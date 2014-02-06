/******************************************************************************/
/* OpenSi : Outils libres de gestion d'entreprise                             */
/* Copyright (C) 2003 Speedinfo.fr S.A.R.L.                                   */
/* Contact: contact@opensi.org                                                */
/*                                                                            */
/* This program is free software; you can redistribute it and/or              */
/* modify it under the terms of the GNU General Public License                */
/* as published by the Free Software Foundation; either version 2             */
/* of the License, or (at your option) any later version.                     */
/*                                                                            */
/* This program is distributed in the hope that it will be useful,            */
/* but WITHOUT ANY WARRANTY; without even the implied warranty of             */
/* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the               */
/* GNU General Public License for more details.                               */
/*                                                                            */
/* You should have received a copy of the GNU General Public License          */
/* along with this program; if not, write to the Free Software                */
/* Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA. */
/******************************************************************************/

var entrepriseId;
var identifiant;

var aDossiersInterdits = new Arbre('Superviseur/GetRDF/listeDossiersEntInterdits.tmpl', 'liste_dossiers_interdits');
var aDossiersAccessibles = new Arbre('Superviseur/GetRDF/listeDossiersEntAccessibles.tmpl', 'liste_dossiers_accessibles');


function initModifEntreprise(entreprise_id) {
	try {
		
		document.getElementById('bAjouterDossiers').disabled = true;
		document.getElementById('bEnleverDossiers').disabled = true;

		entrepriseId = entreprise_id;

		aDossiersInterdits.setParam('Entreprise_Id', entrepriseId);
		aDossiersInterdits.initTree();
		
		aDossiersAccessibles.setParam('Entreprise_Id', entrepriseId);		
		aDossiersAccessibles.initTree();
		
		var qGetEnt = new QueryHttp("Superviseur/entreprises/getEntreprise.tmpl");
		qGetEnt.setParam("Entreprise_Id", entrepriseId);
		var p = qGetEnt.execute();
		var contenu = p.responseXML.documentElement;
		
		var actif = (contenu.getAttribute("Actif")=="1");
		identifiant = contenu.getAttribute("Identifiant");
		document.getElementById("labEntreprise").value = "MODIFICATION DE L'ENTREPRISE '"+ identifiant +"'";
		document.getElementById("me-Denomination").value = contenu.getAttribute('Denomination');
		document.getElementById("me-Tel").value = contenu.getAttribute('Telephone');
		document.getElementById("me-Email").value = contenu.getAttribute('Email');
		document.getElementById("me-No_Mail").checked = (contenu.getAttribute('No_Mail')==1);
		checkModifierMail();
		document.getElementById("me-Responsable").value = contenu.getAttribute('Responsable');
		document.getElementById("me-Actif").checked = actif;
		document.getElementById("bActiver").collapsed = actif;
		document.getElementById("bDesactiver").collapsed = !actif;
		
		document.getElementById("me-gesco").checked = (contenu.getAttribute('Acc_Gest_Com')==1);
		document.getElementById("me-compta").checked = (contenu.getAttribute('Acc_Compta')==1);
		document.getElementById("me-contact").checked = (contenu.getAttribute('Acc_CRM')==1);
		
		document.getElementById("bMenuEntreprises").collapsed = false;
		document.getElementById("tab-modification").selectedIndex=0;
  	document.getElementById("deck").selectedIndex=2;

  } catch (e) {
    recup_erreur(e);
  }
}


function checkModifierMail() {
	try {
		var no_mail = document.getElementById('me-No_Mail').checked;
		if (no_mail) {
			document.getElementById('me-Email').value = "";
			document.getElementById('me-Email').disabled = true;
		} else {
			document.getElementById('me-Email').disabled = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function modifierEntreprise() {
	try {

  	var denomination = document.getElementById('me-Denomination').value;
  	var telephone = document.getElementById('me-Tel').value;
		var email = document.getElementById('me-Email').value;
		var no_mail = (document.getElementById('me-No_Mail').checked?"1":"0");
		var responsable = document.getElementById('me-Responsable').value;
		var gesco = (document.getElementById("me-gesco").checked?"1":"0");
		var compta = (document.getElementById("me-compta").checked?"1":"0");
		var contact = (document.getElementById("me-contact").checked?"1":"0");
		
		if (isEmpty(denomination)) { showWarning("Veuillez saisir une dénomination !"); }
		else if ((no_mail=="1") && isEmpty(telephone)) { showWarning("Veuillez saisir un téléphone !"); }
		else if (!isEmpty(telephone) && !isPhone(telephone)) { showWarning("Le téléphone est invalide !"); }
		else if ((no_mail=="0") && isEmpty(email)) { showWarning("Veuillez saisir une adresse e-mail !"); }
		else if (!isEmpty(email) && !isEmail(email)) { showWarning("L'adresse e-mail est incorrecte !"); }
		else {
			var qModifEnt = new QueryHttp("Superviseur/entreprises/modifierEntreprise.tmpl");
			qModifEnt.setParam("Entreprise_Id", entrepriseId);
			qModifEnt.setParam("Denomination", denomination);
			qModifEnt.setParam("Telephone", telephone);
			qModifEnt.setParam("Email", email);
			qModifEnt.setParam("No_Mail", no_mail);
			qModifEnt.setParam("Responsable", responsable);
			qModifEnt.setParam("Acc_Gest_Com", gesco);
			qModifEnt.setParam("Acc_Compta", compta);
			qModifEnt.setParam("Acc_CRM", contact);
			var p = qModifEnt.execute();
			var message = p.responseXML.documentElement.getAttribute("message");			
			if (message=="inexistant") { showWarning("Erreur lors de la modification de l'entreprise !"); }
			else { showMessage("L'entreprise "+ identifiant +" a été modifiée avec succès !"); }	
		}

	}	catch (e) {
		recup_erreur(e);
	}
}


function changerEtatEntreprise(b) {
	try {
		var actif = (b?"1":"0");
		var qChangerEtatEnt = new QueryHttp("Superviseur/entreprises/changerEtatEntreprise.tmpl");
		qChangerEtatEnt.setParam("Entreprise_Id", entrepriseId);
		qChangerEtatEnt.setParam("Actif", actif);
		var p = qChangerEtatEnt.execute();
		var message = p.responseXML.documentElement.getAttribute("message");			
		if (message=="inexistant") {
			if (b) { showWarning("Erreur lors de l'activation de l'entreprise !"); }
			else { showWarning("Erreur lors de la désactivation de l'entreprise !"); }
		}
		else {
			document.getElementById('bActiver').collapsed=b;
			document.getElementById('bDesactiver').collapsed=!b;
			document.getElementById("me-Actif").checked = b;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnDossiersInterdits() {
	try {
		if (aDossiersInterdits.isSelected()) {
			if (aDossiersAccessibles.nbLignes()>0) {
				aDossiersAccessibles.select(-1);
			}
			document.getElementById('bAjouterDossiers').disabled = false;
			document.getElementById('bEnleverDossiers').disabled = true;
		}
	} catch (e) {
    recup_erreur(e);
  }
}

function pressOnDossiersAccessibles() {
	try {
		if (aDossiersAccessibles.isSelected()) {
			if (aDossiersInterdits.nbLignes()>0) {
				aDossiersInterdits.select(-1);
			}
			document.getElementById('bAjouterDossiers').disabled = true;
			document.getElementById('bEnleverDossiers').disabled = false;			
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function ajouterDossiersAccessibles() {
	try {

		var tree = document.getElementById('liste_dossiers_interdits');
		var rangeCount = tree.view.selection.getRangeCount();

		for (var i=0; i<rangeCount; i++) {
			var start = {};
  		var end = {};
  		tree.view.selection.getRangeAt(i,start,end);

			for(var c=start.value; c<=end.value; c++) {
				var dossierId = getCellText(tree,c,'ldi-ColDossier_Id');
				var qAjouterDossiers = new QueryHttp("Superviseur/entreprises/ajouterDossiersAccessibles.tmpl");
				qAjouterDossiers.setParam("Entreprise_Id", entrepriseId);
				qAjouterDossiers.setParam("Dossier_Id", dossierId);
				qAjouterDossiers.execute();
			}
		}

		aDossiersInterdits.initTree();
		aDossiersAccessibles.initTree();

		document.getElementById('bAjouterDossiers').disabled = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function enleverDossiersAccessibles() {
	try {

		var tree = document.getElementById('liste_dossiers_accessibles');
		var rangeCount = tree.view.selection.getRangeCount();

		for (var i=0; i<rangeCount; i++) {
			var start = {};
  		var end = {};
  		tree.view.selection.getRangeAt(i,start,end);

			for(var c=start.value; c<=end.value; c++) {
				var dossierId = getCellText(tree,c,'lda-ColDossier_Id');
				var qEnleverDossiers = new QueryHttp("Superviseur/entreprises/enleverDossiersAccessibles.tmpl");
				qEnleverDossiers.setParam("Entreprise_Id", entrepriseId);
				qEnleverDossiers.setParam("Dossier_Id", dossierId);
				qEnleverDossiers.execute();
			}
		}

		aDossiersInterdits.initTree();
		aDossiersAccessibles.initTree();

		document.getElementById('bEnleverDossiers').disabled = true;

	} catch (e) {
    recup_erreur(e);
  }
}


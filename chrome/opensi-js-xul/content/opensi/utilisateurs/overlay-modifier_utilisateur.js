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

var admin = 0;
var utilisateurId;
var curDossierId;
var login;

// onglet Droits sur Dossiers
var aDossiersInterdits = new Arbre('Utilisateurs/GetRDF/listeDossiersInterdits.tmpl', 'liste_dossiers_interdits');
var aDossiersAccessibles = new Arbre('Utilisateurs/GetRDF/listeDossiersAccessibles.tmpl', 'liste_dossiers_accessibles');

// profils
var aProfilsDisponibles = new Arbre('Utilisateurs/GetRDF/listeProfilEntreprise.tmpl' , 'liste_profil');
var aDossiersDisponibles = new Arbre('Utilisateurs/GetRDF/listeDossiersUtilisateur.tmpl', 'liste_dossiers_utilisateur');
var aProfilsAffectes = new Arbre('Utilisateurs/GetRDF/listeDossiersUtilisateurProfil.tmpl', 'liste_dossiers_utilisateur_profil');	


function initModifUtilisateur(utilisateur_id) {
	try {
		
		document.getElementById('bAjouterDossiers').disabled = true;
		document.getElementById('bEnleverDossiers').disabled = true;

		utilisateurId = utilisateur_id;

		aDossiersInterdits.setParam('Utilisateur_Id', utilisateurId);
		aDossiersInterdits.initTree();
		
		aDossiersAccessibles.setParam('Utilisateur_Id', utilisateurId);		
		aDossiersAccessibles.initTree();
		
		activerDroitsDossiers(false);
		
		var qGetUtil = new QueryHttp("Utilisateurs/getUtilisateur.tmpl");
		qGetUtil.setParam("Utilisateur_Id", utilisateurId);
		var p = qGetUtil.execute();
		var contenu = p.responseXML.documentElement;
		
		var actif = (contenu.getAttribute("Actif")=="1");
		admin = contenu.getAttribute("Admin");		
		login = contenu.getAttribute("Login");
		document.getElementById("labUtilisateur").value = "MODIFICATION DE L'UTILISATEUR '"+ login +"'";
		document.getElementById("mu-Civilite").value = contenu.getAttribute('Civilite');
		document.getElementById("mu-Nom").value = contenu.getAttribute('Nom');
		document.getElementById("mu-Prenom").value = contenu.getAttribute('Prenom');
		document.getElementById("mu-Telephone").value = contenu.getAttribute('Telephone');
		document.getElementById("mu-Email").value = contenu.getAttribute('Email');
		document.getElementById("mu-Fonction").value = contenu.getAttribute('Fonction');
		document.getElementById('mu-membreDirection').checked = (contenu.getAttribute('Direction')=="1");
		document.getElementById("mu-Admin").checked = (admin==1);
		document.getElementById("mu-Actif").checked = actif;
		document.getElementById("bActiver").collapsed = actif;
		document.getElementById("bDesactiver").collapsed = !actif;
		
		document.getElementById("bMenuUtilisateurs").collapsed = false;
		document.getElementById("tab-modification").selectedIndex=0;
  	document.getElementById("deck").selectedIndex=2;
  	
  	aProfilsAffectes.setParam('Utilisateur_Id', utilisateurId);
  	aDossiersDisponibles.setParam("Utilisateur_Id", utilisateurId);	
  	initProfils();

  } catch (e) {
    recup_erreur(e);
  }
}

function initModifUtilisateur2(utilisateur_id) {
	try {
		initModifUtilisateur(utilisateur_id);
		document.getElementById("tab-modification").selectedIndex=1;
	} catch (e) {
		recup_erreur(e);
	}
}


function changerPassword() {
	try {

		var page ="chrome://opensi/content/utilisateurs/popup-password.xul?"+ cookie() +"&Utilisateur_Id="+ utilisateurId;
		window.openDialog(page,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function modifierUtilisateur() {
	try {

		var civilite = document.getElementById('mu-Civilite').value;
		var nom = document.getElementById('mu-Nom').value;
		var prenom = document.getElementById('mu-Prenom').value;
		var telephone = document.getElementById('mu-Telephone').value;
		var email = document.getElementById('mu-Email').value;
		var fonction = document.getElementById('mu-Fonction').value;
		var ck_admin = document.getElementById('mu-Admin').checked?"1":"0";
		var membreDirection = (document.getElementById('mu-membreDirection').checked?1:0);
		
		if (isEmpty(nom)) { showWarning("Veuillez saisir un nom !"); }
		else if (!isEmpty(telephone) && !isPhone(telephone)) { showWarning("Le téléphone est incorrect !"); }
		else if (!isEmpty(email) && !isEmail(email)) { showWarning("L'adresse e-mail est incorrecte !"); }
		else {			
			var qModifUtil = new QueryHttp("Utilisateurs/modifierUtilisateur.tmpl");
			qModifUtil.setParam("Utilisateur_Id", utilisateurId);
			qModifUtil.setParam("Civilite", civilite);
			qModifUtil.setParam("Nom", nom);
			qModifUtil.setParam("Prenom", prenom);
			qModifUtil.setParam("Telephone", telephone);
			qModifUtil.setParam("Email", email);
			qModifUtil.setParam("Fonction", fonction);
			qModifUtil.setParam("Administrateur", ck_admin);
			qModifUtil.setParam("Direction", membreDirection);
			var p = qModifUtil.execute();
			var message = p.responseXML.documentElement.getAttribute("message");			
			if (message=="inexistant") { showWarning("Erreur lors de la modification de l'utilisateur !"); }
			else {
				showMessage("L'utilisateur "+ login +" a été modifié avec succès !");
				admin = ck_admin;
				if (aDossiersAccessibles.isSelected()) {
					activerDroitsDossiers(true); // recharger les droits du dossier sélectionné	
				}
			}	
		}

	}	catch (e) {
		recup_erreur(e);
	}
}


function changerEtatUtilisateur(b) {
	try {
		var actif = (b?"1":"0");
		var qChangerEtatUtil = new QueryHttp("Utilisateurs/changerEtatUtilisateur.tmpl");
		qChangerEtatUtil.setParam("Utilisateur_Id", utilisateurId);
		qChangerEtatUtil.setParam("Actif", actif);
		var p = qChangerEtatUtil.execute();
		var message = p.responseXML.documentElement.getAttribute("message");			
		if (message=="inexistant") {
			if (b) { showWarning("Erreur lors de l'activation de l'utilisateur !"); }
			else { showWarning("Erreur lors de la désactivation de l'utilisateur !"); }
		}
		else {
			document.getElementById('bActiver').collapsed=b;
			document.getElementById('bDesactiver').collapsed=!b;
			document.getElementById("mu-Actif").checked = b;
		}
	} catch (e) {
		recup_erreur(e);
	}
}




// Fonctions pour gérer les profils


function initProfils() {
	try {
		aProfilsAffectes.initTree(initProfilsAffectes);
		aDossiersDisponibles.initTree(initDossiersDisponibles);
		aProfilsDisponibles.initTree(initProfilsDisponibles);
	} catch (e) {
		recup_erreur(e);
	}
}

function initProfilsAffectes() {
	try {
		document.getElementById('bSupprimerProfil').disabled=(aProfilsAffectes.nbLignes()==0);
	} catch (e) {
    recup_erreur(e);
  }
}

function initDossiersDisponibles() {
	try {
		document.getElementById('liste_dossiers_utilisateur').selectedIndex=0;
	} catch (e) {
    recup_erreur(e);
  }
}

function initProfilsDisponibles() {
	try {
		document.getElementById('liste_profil').selectedIndex=0;
	} catch (e) {
    recup_erreur(e);
  }
}


function ajouterProfil() {
	try {
		if (document.getElementById("liste_dossiers_utilisateur").selectedIndex==0) {
			showWarning("Veuillez sélectionner un dossier !");
		} else if (document.getElementById("liste_profil").selectedIndex==0) {
			showWarning("Veuillez sélectionner un profil !");
		} else {
			var profilId=document.getElementById("liste_profil").value;
			var dossierId=document.getElementById("liste_dossiers_utilisateur").value;
			
			var qGetUtil = new QueryHttp("Utilisateurs/ajouterProfilUtilisateur.tmpl");
			qGetUtil.setParam("Utilisateur_Id", utilisateurId);
			qGetUtil.setParam("Profil_Id", profilId);
			qGetUtil.setParam("Dossier_Id", dossierId);
			qGetUtil.execute();
			aProfilsAffectes.initTree(initProfilsAffectes);
			aDossiersDisponibles.initTree(initDossiersDisponibles);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerProfil() {
	try {
		var tree = document.getElementById('liste_dossiers_utilisateur_profil');
		var rangeCount = tree.view.selection.getRangeCount();
		
		if (rangeCount==0) {
			showWarning("Veuillez sélectionner un ou plusieurs profils à supprimer !");
		} else {
			for (var i=0; i<rangeCount; i++) {
				var start = {};
	  		var end = {};
	  		tree.view.selection.getRangeAt(i,start,end);
	
				for (var c=start.value; c<=end.value; c++) {
					var dossierId = getCellText(tree,c,'ColDossier_Id');
					var profil = getCellText(tree,c,'ColProfil_Id');
					var qEnleverProfil = new QueryHttp("Utilisateurs/supProfilDossierUtilisateur.tmpl");
					qEnleverProfil.setParam("Utilisateur_Id", utilisateurId);
					qEnleverProfil.setParam("Dossier_Id", dossierId);
					qEnleverProfil.setParam("Profil_Id", profil);
					qEnleverProfil.execute();
				}
			}
			aProfilsAffectes.initTree(initProfilsAffectes);
			aDossiersDisponibles.initTree(initDossiersDisponibles);
		}
	} catch (e) {
		recup_erreur(e);
	}
}



// Fonctions concernant l'onglet Droits sur Dossiers


function pressOnDossiersInterdits() {
	try {
		if (aDossiersInterdits.isSelected()) {
			if (aDossiersAccessibles.nbLignes()>0) {
				aDossiersAccessibles.select(-1);
			}
			activerDroitsDossiers(false);
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
			activerDroitsDossiers(true);
			document.getElementById('bAjouterDossiers').disabled = true;
			document.getElementById('bEnleverDossiers').disabled = false;			
		}
	} catch (e) {
    recup_erreur(e);
  }
}

function activerDroitsDossiers(b) {
	try {
		
		if (b) {
			var dossierId = aDossiersAccessibles.getSelectedCellText("lda-ColDossier_Id");
			document.getElementById('labDroits').label = "Droits sur le dossier "+ dossierId;
			var qGetDroits = new QueryHttp("Utilisateurs/getDroitsDossier.tmpl");
			qGetDroits.setParam("Utilisateur_Id", utilisateurId);
			qGetDroits.setParam("Dossier_Id", dossierId);
			var p = qGetDroits.execute();
			document.getElementById("cGestionCo").checked=(p.responseXML.documentElement.getAttribute("Acc_Gest_Com")=="1");
			document.getElementById("cCompta").checked=(p.responseXML.documentElement.getAttribute("Acc_Compta")=="1");
			document.getElementById("cContact").checked=(p.responseXML.documentElement.getAttribute("Acc_CRM")=="1");
			document.getElementById("cConfig").checked=(p.responseXML.documentElement.getAttribute("Acc_Config")=="1");
			document.getElementById("cValidationCdeFourn").checked=(p.responseXML.documentElement.getAttribute("Validation_CF")=="1");
		}
		else {
			document.getElementById('labDroits').label = "Droits sur le dossier";
			document.getElementById("cGestionCo").checked=false;
			document.getElementById("cCompta").checked=false;
			document.getElementById("cContact").checked=false;
			document.getElementById("cConfig").checked=false;
			document.getElementById("cValidationCdeFourn").checked=false;
		}
		
		document.getElementById("cGestionCo").disabled=!b;
		document.getElementById("cCompta").disabled=!b;
		document.getElementById("cContact").disabled=!b;
		document.getElementById("cConfig").disabled=!b;
		document.getElementById("cValidationCdeFourn").disabled=!b;
		document.getElementById("bEnregistrerDroits").disabled=!b;
		
	} catch (e) {
		recup_erreur(e);
	}
}

function enregistrerDroitsDossier() {
	try {
		var dossierId = aDossiersAccessibles.getSelectedCellText("lda-ColDossier_Id");
		
		var acc_compta = (document.getElementById("cCompta").checked?"1":"0");
		var acc_contact = (document.getElementById("cContact").checked?"1":"0");
		var acc_gest_com = (document.getElementById("cGestionCo").checked?"1":"0");
		var acc_config = (document.getElementById("cConfig").checked?"1":"0");
		var validationCF = (document.getElementById("cValidationCdeFourn").checked?"1":"0");
		
		var qModifierDroits = new QueryHttp("Utilisateurs/modifierDroitsDossier.tmpl");
		qModifierDroits.setParam("Utilisateur_Id", utilisateurId);
		qModifierDroits.setParam("Dossier_Id", dossierId);
		qModifierDroits.setParam("Acc_Compta", acc_compta);
		qModifierDroits.setParam("Acc_CRM", acc_contact);
		qModifierDroits.setParam("Acc_Gest_Com", acc_gest_com);
		qModifierDroits.setParam("Acc_Config", acc_config);
		qModifierDroits.setParam("Validation_CF", validationCF);
		qModifierDroits.execute();
		
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
				var qAjouterDossiers = new QueryHttp("Utilisateurs/ajouterDossiersAccessibles.tmpl");
				qAjouterDossiers.setParam("Utilisateur_Id", utilisateurId);
				qAjouterDossiers.setParam("Dossier_Id", dossierId);
				qAjouterDossiers.setParam("Admin", admin);
				var p=qAjouterDossiers.execute();
			}
		}

		aDossiersInterdits.initTree();
		aDossiersAccessibles.initTree();
		
		aProfilsAffectes.initTree(initProfilsAffectes);
		aDossiersDisponibles.initTree(initDossiersDisponibles);

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
				var qEnleverDossiers = new QueryHttp("Utilisateurs/enleverDossiersAccessibles.tmpl");
				qEnleverDossiers.setParam("Utilisateur_Id", utilisateurId);
				qEnleverDossiers.setParam("Dossier_Id", dossierId);
				var p=qEnleverDossiers.execute();
			}
		}
		
		activerDroitsDossiers(false);

		aDossiersInterdits.initTree();
		aDossiersAccessibles.initTree();

		aProfilsAffectes.initTree(initProfilsAffectes);
		aDossiersDisponibles.initTree(initDossiersDisponibles);

		document.getElementById('bEnleverDossiers').disabled = true;

	} catch (e) {
    recup_erreur(e);
  }
}

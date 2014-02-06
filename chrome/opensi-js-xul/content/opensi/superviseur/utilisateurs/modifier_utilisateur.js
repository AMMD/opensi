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


jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var admin = 0;
var utilisateurId;
var entrepriseId;
var login;

var aDroits = new Arbre('Superviseur/GetRDF/listeDroitsUtilisateur.tmpl', 'liste_droits');
var aDossiers = new Arbre('Superviseur/GetRDF/listeNonDroitsUtilisateur.tmpl', 'liste_dossiers');
var aEntreprises = new Arbre('Superviseur/GetRDF/listeEntreprises.tmpl', 'liste_entreprises');


function init() {
	try {

		utilisateurId = ParamValeur('Utilisateur_Id');

		document.getElementById('Enlever').disabled = true;
		document.getElementById('Ajouter').disabled = true;
		
		var qGetUtil = new QueryHttp("Superviseur/utilisateurs/getUtilisateur.tmpl");
		qGetUtil.setParam('Utilisateur_Id', utilisateurId);
		var result = qGetUtil.execute();

		var contenu = result.responseXML.documentElement;

		admin = contenu.getAttribute('Admin');
		login = contenu.getAttribute('Login');
		document.getElementById("titre").value = "MODIFICATION DE L'UTILISATEUR '"+ login +"'";
		document.getElementById("Civilite").value = contenu.getAttribute('Civilite');
		document.getElementById("Nom").value = contenu.getAttribute('Nom');
		document.getElementById("Prenom").value = contenu.getAttribute('Prenom');
		document.getElementById("Fonction").value = contenu.getAttribute('Fonction');
		document.getElementById("Telephone").value = contenu.getAttribute('Telephone');
		document.getElementById("Email").value = contenu.getAttribute('Email');
		document.getElementById("membreDirection").checked = (contenu.getAttribute('Direction')=="1");
		document.getElementById('Admin').checked = (admin==1);		
		
		var actif = (contenu.getAttribute("Actif")=="1");
		document.getElementById("Actif").checked = actif;
		document.getElementById("bActiver").collapsed = actif;
		document.getElementById("bDesactiver").collapsed = !actif;
		
		entrepriseId = contenu.getAttribute('Entreprise_Id');
		aEntreprises.setParam("Afficher_Tous", "0");
		aEntreprises.initTree(initEntreprise);
		
		aDroits.setParam('Utilisateur_Id', utilisateurId);
		aDroits.setParam('Entreprise_Id', entrepriseId);
		aDroits.initTree();
		
		aDossiers.setParam('Utilisateur_Id', utilisateurId);		
		aDossiers.setParam('Entreprise_Id', entrepriseId);		
		aDossiers.initTree();

	} catch (e) {
    recup_erreur(e);
  }
}


function initEntreprise() {
	try {
	
		document.getElementById('liste_entreprises').value = entrepriseId;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function changerEtatUtilisateur(b) {
	try {
	
		var actif = (b?"1":"0");
		var qChangerEtatUtil = new QueryHttp("Superviseur/utilisateurs/changerEtatUtilisateur.tmpl");
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
			document.getElementById("Actif").checked = b;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function affecterDroits() {
	try {

		var tree = document.getElementById('liste_dossiers');
		var rangeCount = tree.view.selection.getRangeCount();

		for(var i=0; i<rangeCount; i++) {

			var start = {};
 			var end = {};
 			tree.view.selection.getRangeAt(i,start,end);

 			for(var c=start.value; c<=end.value; c++) {

				var dossier_id = getCellText(tree,c,'dossier_id');

				if (isEmpty(dossier_id)) {
					showWarning('Aucun dossier sélectionné !');
				}
				else {
					
					var qAffDroits = new QueryHttp("Superviseur/utilisateurs/affecterDroits.tmpl");
					qAffDroits.setParam('Utilisateur_Id', utilisateurId);
					qAffDroits.setParam('Dossier_Id', dossier_id);
					qAffDroits.setParam('Admin', admin);
					var result = qAffDroits.execute();

					var message = result.responseXML.documentElement.getAttribute("message");

					if (message=="inexistant") {
						showWarning("Dossier "+ dossier_id +" inexistant !");
					}
					else if (message=="droit") {
						showWarning("L'utilisateur "+ login +" a déjà les droits sur le dossier "+ dossier_id +" !");
					}
					else if (message!="fini") {
						showWarning("Erreur du serveur !");
					}
				}
 			}
		}

		aDroits.initTree();
		aDossiers.initTree();

		document.getElementById('Ajouter').disabled = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerDroits() {
	try {

		var tree = document.getElementById('liste_droits');
		var rangeCount = tree.view.selection.getRangeCount();

		for(var i=0; i<rangeCount; i++) {

			var start = {};
  		var end = {};
  		tree.view.selection.getRangeAt(i,start,end);

			for(var c=start.value; c<=end.value; c++) {

				var dossier_id = getCellText(tree,c,'dossier_id');

				if (isEmpty(dossier_id)) {
					showWarning('Aucun dossier sélectionné !');
				}
				else {					
					var qSupDroits = new QueryHttp("Superviseur/utilisateurs/supprimerDroits.tmpl");
					qSupDroits.setParam('Utilisateur_Id', utilisateurId);
					qSupDroits.setParam('Dossier_Id', dossier_id);
					qSupDroits.execute();
				}
			}
		}

		aDroits.initTree();
		aDossiers.initTree();

		document.getElementById('Enlever').disabled = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function enable(gauche) {
	try {

		var tree = (gauche?document.getElementById('liste_dossiers'):document.getElementById('liste_droits'));

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById('Enlever').disabled = gauche;
			document.getElementById('Ajouter').disabled = !gauche;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function changer_password() {
	try {

		var page ="chrome://opensi/content/superviseur/utilisateurs/password.xul?"+ cookie() +"&Utilisateur_Id="+ utilisateurId;
		window.openDialog(page,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrer_utilisateur() {
	try {

		var civilite = document.getElementById('Civilite').value;
		var nom = document.getElementById('Nom').value;
		var prenom = document.getElementById('Prenom').value;
		var fonction = document.getElementById('Fonction').value;
		var telephone = document.getElementById('Telephone').value;
		var email = document.getElementById('Email').value;
		var ck_admin = document.getElementById('Admin').checked?"1":"0";
		var membreDirection = (document.getElementById('membreDirection').checked?1:0);
		
		if (isEmpty(prenom) || isEmpty(nom)) {
			showWarning("Vous devez remplir tous les champs !");
		}
		else if (!isEmpty(telephone) && !isPhone(telephone)) {
			showWarning("Le téléphone est incorrect !");
		}
		else if (!isEmpty(email) && !isEmail(email)) {
			showWarning("L'adresse e-mail est incorrecte !");
		}
		else {
			
			var qMajUtil = new QueryHttp("Superviseur/utilisateurs/modifierUtilisateur.tmpl");
			qMajUtil.setParam('Utilisateur_Id', utilisateurId);
			qMajUtil.setParam('Nom', nom);
			qMajUtil.setParam('Prenom', prenom);
			qMajUtil.setParam('Fonction', fonction);
			qMajUtil.setParam('Telephone', telephone);
			qMajUtil.setParam('Email', email);
			qMajUtil.setParam('Administrateur', ck_admin);
			qMajUtil.setParam('Civilite', civilite);
			qMajUtil.setParam('Direction', membreDirection);
			var result = qMajUtil.execute();			
		
			var message = result.responseXML.documentElement.getAttribute("message");

			if (message=="inexistant") {
				showWarning("Utilisateur non modifié !");
			}
			else if (message=="fini") {
				admin = document.getElementById('Admin').checked?"1":"0";
				showMessage("L'utilisateur "+ login +" a été modifié avec succès !");
			}
			else {
				showWarning("Erreur du serveur !");
			}
		}

	}	catch (e) {
		recup_erreur(e);
	}
}


function supprimer_utilisateur() {
	try {

		var rep = window.confirm("Confirmez-vous la suppression de l'utilisateur '"+ login +"' ?");

		if (rep) {
			
			var qSupUtil = new QueryHttp("Superviseur/utilisateurs/supprimerUtilisateur.tmpl");
			qSupUtil.setParam('Utilisateur_Id', utilisateurId);
			var result = qSupUtil.execute();

			var message = result.responseXML.documentElement.getAttribute("message");

			if (message=="inexistant") {
				showWarning("Utilisateur non supprimé !");
			}
			else if (message=="fini") {
				showMessage("L'utilisateur "+ login +" a été supprimé avec succès");
			}
			else {
				showWarning("Erreur du serveur !");
			}

  		window.location = "chrome://opensi/content/superviseur/utilisateurs/menu_utilisateurs.xul?"+ cookie();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_menuManager() {
	try {

  	window.location = "chrome://opensi/content/superviseur/menu_superviseur.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_menuUtilisateurs() {
	try {

  	window.location = "chrome://opensi/content/superviseur/utilisateurs/menu_utilisateurs.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


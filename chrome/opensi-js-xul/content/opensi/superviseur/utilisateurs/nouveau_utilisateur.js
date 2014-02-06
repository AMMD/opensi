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


jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var aEntreprises = new Arbre('Superviseur/GetRDF/listeEntreprises.tmpl', 'liste_entreprises');


function init() {
	try {

		document.getElementById('Login').focus();
		aEntreprises.setParam("Afficher_Tous", "0");
		aEntreprises.initTree(initEntreprise);

	} catch (e) {
    recup_erreur(e);
  }
}


function initEntreprise() {
	try {
	
		document.getElementById('liste_entreprises').selectedIndex = 0;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function creerUtilisateur() {
	try {

		var login = document.getElementById('Login').value;
  	var password = document.getElementById('Password').value;
		var password2 = document.getElementById('Password2').value;
		var civilite = document.getElementById('Civilite').value;
		var nom = document.getElementById('Nom').value;
		var prenom = document.getElementById('Prenom').value;
		var telephone = document.getElementById('Telephone').value;
		var fonction = document.getElementById('Fonction').value;
		var membreDirection = (document.getElementById('membreDirection').checked?1:0);
		var email = document.getElementById('Email').value;
		var entreprise_id = document.getElementById('liste_entreprises').value;

		if (isEmpty(prenom) || isEmpty(nom) || isEmpty(login) || isEmpty(password) || isEmpty(password2)) {
			showWarning('Vous devez remplir tous les champs !');
		}
		else if (password2 != password) {
			showWarning('Les mots de passe saisis sont différents ! Veuillez reconfirmer le mot de passe');
			document.getElementById('Password2').value = '';
		}
		else if (login.toLowerCase()=="root") { showWarning("Login non autorisé !"); }
		else if (!isCleAlpha(login)) { showWarning('Login incorrect ! (A-Z,a-z,0-9,_)'); }
		else if (!isEmpty(telephone) && !isPhone(telephone)) { showWarning("Le téléphone est incorrect !"); }
		else if (!isEmpty(email) && !isEmail(email)) { showWarning("L'adresse e-mail est incorrecte !"); }
		else if (document.getElementById('liste_entreprises').selectedIndex==0) { showWarning("Veuillez sélectionner une entreprise !"); }
		else {
			
			var qNewUtil = new QueryHttp("Superviseur/utilisateurs/nouveauUtilisateur.tmpl");
			qNewUtil.setParam('Login', login);
			qNewUtil.setParam('Password', password);
			qNewUtil.setParam('Password2', password2);
			qNewUtil.setParam('Civilite', civilite);
			qNewUtil.setParam('Nom', nom);
			qNewUtil.setParam('Prenom', prenom);
			qNewUtil.setParam('Fonction', fonction);
			qNewUtil.setParam('Telephone', telephone);
			qNewUtil.setParam('Email', email);
			qNewUtil.setParam('Direction', membreDirection);
			qNewUtil.setParam('Entreprise_Id', entreprise_id);
			var result = qNewUtil.execute();

			if (result.responseXML.documentElement.getAttribute("message")=="true") {
				var utilisateurId = result.responseXML.documentElement.getAttribute("Utilisateur_Id");
				window.location = "chrome://opensi/content/superviseur/utilisateurs/modifier_utilisateur.xul?"+ cookie() +"&Utilisateur_Id="+ utilisateurId;
			}
			else {
				showWarning("L'utilisateur "+ login +" existe déjà dans l'entreprise choisie !");
			}
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

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

var aEntreprises = new Arbre('Superviseur/GetRDF/listeEntreprises.tmpl', 'liste_entreprises');
var aUsers = new Arbre('Superviseur/GetRDF/listeUtilisateurs.tmpl' , 'liste_utilisateurs');


function init() {
	try {
		
		document.getElementById('liste_utilisateurs').disabled = true;
		document.getElementById('liste_entreprises').disabled = true;
		document.getElementById('Login').disabled = true;
		document.getElementById('Nom').disabled = true;
		document.getElementById('chkAffTous').disabled = true;
		document.getElementById('chkAffTous').checked = false;
		document.getElementById('bNouveau').disabled = true;
		
		aEntreprises.initTree(initEntreprise);

	} catch (e) {
    recup_erreur(e);
  }
}


function initEntreprise() {
	try {
	
		document.getElementById('liste_entreprises').selectedIndex = 0;
		rechercherUtilisateurs();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function rechercherUtilisateurs() {
	try {
		document.getElementById('liste_utilisateurs').disabled = true;
		document.getElementById('liste_entreprises').disabled = true;
		document.getElementById('Login').disabled = true;
		document.getElementById('Nom').disabled = true;
		document.getElementById('chkAffTous').disabled = true;
		document.getElementById('bNouveau').disabled = true;
		
		var entrepriseId = document.getElementById('liste_entreprises').value;
		var login = document.getElementById('Login').value;
		var nom = document.getElementById('Nom').value;
		var afficherTous = document.getElementById('chkAffTous').checked?"1":"0";
		
		aUsers.setParam("Entreprise_Id", entrepriseId);
		aUsers.setParam("Login", login);
		aUsers.setParam("Nom", nom);
		aUsers.setParam("Afficher_Tous", afficherTous);
		aUsers.initTree(focus_tree);
	} catch (e) {
		recup_erreur(e);
	}
}


function focus_tree() {
  try {
  	
  	document.getElementById('liste_utilisateurs').disabled = false;
		document.getElementById('liste_entreprises').disabled = false;
		document.getElementById('Login').disabled = false;
		document.getElementById('Nom').disabled = false;
		document.getElementById('chkAffTous').disabled = false;
		document.getElementById('bNouveau').disabled = false;

		document.getElementById('liste_utilisateurs').focus();

    if (aUsers.nbLignes()>0) {
    	aUsers.select(0);
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnFiltre(e) {
  try {

    if (e.keyCode==13) {
    	rechercherUtilisateurs();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function keypress(e) {
  try {

    if (e.keyCode==13) {
    	modifutilisateur();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function modifutilisateur() {
	try {

		var tree = document.getElementById('liste_utilisateurs');

		if (tree.view!=null && tree.currentIndex!=-1) {

  		var utilisateurId = getCellText(tree,tree.currentIndex, 'ColUtilisateur_Id');

  		window.location = "chrome://opensi/content/superviseur/utilisateurs/modifier_utilisateur.xul?"+ cookie() +"&Utilisateur_Id="+ utilisateurId;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_menuManager() {

  window.location = "chrome://opensi/content/superviseur/menu_superviseur.xul?"+ cookie();
}


function nouveau_utilisateur() {

  window.location = "chrome://opensi/content/superviseur/utilisateurs/nouveau_utilisateur.xul?"+ cookie();
}

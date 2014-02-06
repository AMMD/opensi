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


var aUsers = new Arbre('Utilisateurs/GetRDF/listeUtilisateurs.tmpl' , 'liste_utilisateurs');

function initListeUtilisateurs() {
	try {
		
		document.getElementById('omu-chkAffTous').checked = false;
		document.getElementById("bMenuUtilisateurs").collapsed = true;

		omu_rechercherUtilisateurs();
		document.getElementById("deck").selectedIndex=0;

	} catch (e) {
    recup_erreur(e);
  }
}


function omu_rechercherUtilisateurs() {
	try {
		document.getElementById('liste_utilisateurs').disabled = true;
		document.getElementById('omu-login').disabled = true;
		document.getElementById('omu-nom').disabled = true;
		document.getElementById('omu-chkAffTous').disabled = true;
		document.getElementById('omu-bNouveau').disabled = true;
		
		var login = document.getElementById('omu-login').value;
		var nom = document.getElementById('omu-nom').value;
		var afficherTous = document.getElementById('omu-chkAffTous').checked?"1":"0";
		
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
		document.getElementById('omu-login').disabled = false;
		document.getElementById('omu-nom').disabled = false;
		document.getElementById('omu-chkAffTous').disabled = false;
		document.getElementById('omu-bNouveau').disabled = false;
		
    document.getElementById('liste_utilisateurs').focus();

		if (aUsers.nbLignes()>0) {
			aUsers.select(0);
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function omu_pressOnFiltre(e) {
  try {

    if (e.keyCode==13) {
    	omu_rechercherUtilisateurs();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function keypress(e) {
  try {

    if (e.keyCode==13) {
    	modifUtilisateur();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function modifUtilisateur() {
	try {
		if (aUsers.isSelected()) {

  		var utilisateurId = aUsers.getSelectedCellText('ColUtilisateur_Id');
  		initModifUtilisateur(utilisateurId);

		}

	} catch (e) {
    recup_erreur(e);
  }
}


function nouvelUtilisateur() {

	initNouvelUtilisateur();
  
}

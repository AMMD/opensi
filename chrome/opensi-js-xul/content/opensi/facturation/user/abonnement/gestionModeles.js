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


var tree = new Arbre("Facturation/GetRDF/modeles.tmpl","GestionDesModeles");

function init() {
	init_tree();
}

function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

function factureAEmettre() {
	try {

    window.location = "chrome://opensi/content/facturation/user/abonnement/menuFacture_a_emettre.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauModele() {
  try {

    var page = "chrome://opensi/content/facturation/user/abonnement/nouveauModele.xul?"+ cookie();
    page += "&Mode="+"C";//mode = C pour appel de nouveauModele en mode Creation
		window.location = page;

	} catch (e) {
    recup_erreur(e);
  }
}

function gestionAbonnement() {
  try {

    window.location = "chrome://opensi/content/facturation/user/abonnement/gestionAbonnement.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

function init_tree() {
  try {

		tree.initTree();

  } catch (e) {
    recup_erreur(e);
  }
}

function ModifierModele() {
	try�{

		var tree = document.getElementById("GestionDesModeles");

		if (tree.view!=null && tree.currentIndex!=-1) {

			var modele_id = getCellText(tree,tree.currentIndex,'ColModele_Id');

	 		var page = "chrome://opensi/content/facturation/user/abonnement/nouveauModele.xul?" + cookie();
    	page += "&Mode="+"M";//mode = M pour appel de nouveauModele en mode Modification
			page += "&Modele_Id="+ modele_id;
			window.location = page;
		}

	}	catch (e) {
    recup_erreur(e);
  }
}

function creerEtatModele() {
	try {

		var Liste_Modele="";
		var arbre = document.getElementById("GestionDesModeles");
		for (var i=0;i<arbre.view.rowCount;i++) {
			Liste_Modele+=getCellText(arbre,i,'ColModele_Id');
			if (i!=((arbre.view.rowCount)-1))
						Liste_Modele += ",";
		}
		if (i>0) {
			var nbModele = arbre.view.rowCount;
			var page = "chrome://opensi/content/facturation/user/abonnement/etatModele.xul?"+ cookie();
    	page += "&Liste_Modele=" + Liste_Modele;
			page += "&nbModele=" + nbModele;
			window.location = page;
		}
		else
			showWarning("Il n'y a pas de mod�le dans la liste");

	}	catch (e) {
    recup_erreur(e);
  }
}

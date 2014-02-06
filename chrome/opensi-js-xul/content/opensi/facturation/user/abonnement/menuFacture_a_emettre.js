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
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");


var tree = new Arbre("Facturation/GetRDF/FactureAEmettre.tmpl","factureAEmettre");
var treeHistorique = new Arbre("Facturation/GetRDF/Historique_facture_a_emettre.tmpl","historique_tree");
var modification=true;

function menu_init() {
try {
		if (ParamValeur("page")=="histo"){
			historique_init();
			document.getElementById('Panneau').selectedIndex=1;
		}
		else{
			emettre_init();
			document.getElementById('Panneau').selectedIndex=0;
		}
	}
		catch (e) {
    recup_erreur(e);
  }
}


function menu_retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function menu_gestionModeles() {
  try {

    window.location = "chrome://opensi/content/facturation/user/abonnement/gestionModeles.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

function menu_gestionAbonnement() {
  try {

    window.location = "chrome://opensi/content/facturation/user/abonnement/gestionAbonnement.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function menu_pushOnGenererFacture() {
	try {
		if (document.getElementById('Panneau').selectedIndex==0)
			emettre_majDerniereFacture();
		else
			historique_genererFacture();

	} catch (e) {
    recup_erreur(e);
  }
}


function menu_disableGenererFacture() {
	try {
		document.getElementById('bGenererFacture').disabled=true;

	}	catch (e) {
    recup_erreur(e);
  }
}


function menu_enableGenererFacture() {
	try {
		document.getElementById('bGenererFacture').disabled=false;

	}	catch (e) {
    recup_erreur(e);
  }
}


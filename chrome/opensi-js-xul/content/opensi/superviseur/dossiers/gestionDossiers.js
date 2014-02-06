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


jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");

var dossierEnCours = "";


function init() {
	try {

		document.getElementById('deck').selectedIndex = 0;
  	omd_init();
  	ond1_init();
  	ond2_init();
  	ond3_init();

	} catch (e) {
    recup_erreur(e);
  }
}


function testCheck(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		if (cks.item(0).getAttribute("checked")=="false") {
			cks.item(0).setAttribute("checked","true");
		} else {
			cks.item(0).setAttribute("checked","false");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function retour_menuDossiers() {
	try {
		
		dossierEnCours = "";

		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bGestionDossiers').collapsed = true;

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

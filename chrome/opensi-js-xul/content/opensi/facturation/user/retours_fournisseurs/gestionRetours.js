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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");


var bonRetourId = "";
var nfQte = new NumberFormat("0.###", false);

function init() {
  try {
  	
  	window.parent.addEventListener("close",demandeEnregistrement,false);

  	omr_init();
  	oebr_init();
		document.getElementById('deck').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}

function desinit() {
	try {

		window.parent.removeEventListener("close",demandeEnregistrement,false);

	} catch (e) {
    recup_erreur(e);
  }
}



function demandeEnregistrement() {
	try {
		
		var currentDeck = parseIntBis(document.getElementById('deck').selectedIndex);
		switch (currentDeck) {
			case 1: oebr_demandeEnregistrement(); break;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function retourMenuRetours() {
	try {
		
		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bRetourGestionRetour').collapsed = true;
		document.getElementById('bRetourBonRetour').collapsed = true;
		
		omr_listerRetours();

	} catch (e) {
    recup_erreur(e);
  }
}


function retourBonRetour() {
  try {
  	
  	oebr_initVersion();
		document.getElementById('oebr-deckBonRetour').selectedIndex = 0;
		document.getElementById('bRetourBonRetour').collapsed = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function retourMenuPrincipal() {
	try {

		window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

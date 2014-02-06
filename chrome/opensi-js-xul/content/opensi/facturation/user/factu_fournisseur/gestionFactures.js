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
jsLoader.loadSubScript("chrome://opensi/content/libs/calculDocument.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");


var factureId = "";
var acompteId = "";
var avoirId = "";
var premierChargementFact = true;

function init() {
  try {
  	
  	window.parent.addEventListener("close",demandeEnregistrement,false);

	document.getElementById('deck').selectedIndex = 0;
  	omf_init();
	oea_init();
	oef_init();

  } catch (e) {
    recup_erreur(e);
  }
}


function chargerFacture() {
	try {
		if (!isEmpty(ParamValeur("Facture_Id"))) {
			factureId = ParamValeur("Facture_Id");
			oef_chargerFacture();
			document.getElementById("bMenuFactures").collapsed=false;
			document.getElementById("deck").selectedIndex=1;
		}
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


function pressOnWindow(ev) {
	try {
		if (ev.altKey && (ev.charCode==97)) {
			// alt+a
			var currentDeck = document.getElementById('deck').selectedIndex;
			if (currentDeck==1) { oef_rechercherStock(); }
			else if (currentDeck==2) { oea_rechercherStock(); }
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function retourMenuFactures() {
	try {
		document.getElementById('omf-deckMenu').selectedIndex=0;
		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bMenuFactures').collapsed=true;
		document.getElementById('bRetourFacture').collapsed = true;
		document.getElementById('bRetourAvoir').collapsed = true;
		
		omf_listerFactures();
	} catch (e) {
		recup_erreur(e);
	}
}


function retourFacture() {
  try {
		
		oef_chargerFacture();
		document.getElementById('oef-deckFacture').selectedIndex = 0;
		document.getElementById('bRetourFacture').collapsed = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function retourAvoir() {
  try {
		
		oea_chargerAvoir();
		document.getElementById('oea-deckAvoir').selectedIndex = 0;
		document.getElementById('bRetourAvoir').collapsed = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function demandeEnregistrement() {
	try {
		
		var currentDeck = parseIntBis(document.getElementById('deck').selectedIndex);
		switch (currentDeck) {
			case 1: oef_demandeEnregistrement(); break;
			case 2: oea_demandeEnregistrement(); break;
		}
		
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

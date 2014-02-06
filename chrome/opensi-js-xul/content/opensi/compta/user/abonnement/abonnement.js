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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/semaphores.js");

function init() {
	try {
  		oga_init();
  		ofa_init();
	} catch (e) {
		recup_erreur(e);
	}
}

function changeDeck(index) {
	try {
		document.getElementById('deckAbonnement').selectedIndex=index;
	} catch (e) {
		recup_erreur(e);
	}
}


function retourMenuPrincipal() {
	try {

    window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();

	} catch (e) {
		recup_erreur(e);
	}
}

function retourListeAbonnement() {
	try {
  		document.getElementById("bRetourListeAbonnement").collapsed = true;
  		ola_reset();
  		ole_initArbre();
    	changeDeck(0);
	} catch (e) {
		recup_erreur(e);
	}
}

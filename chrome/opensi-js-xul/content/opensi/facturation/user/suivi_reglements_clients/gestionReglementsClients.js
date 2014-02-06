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

XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
var nf = new NumberFormat("0.##", false);

function init() {
  try {
  	
  	document.getElementById('deck').selectedIndex=0;
  	document.getElementById('onglets').selectedIndex=(!isEmpty(ParamValeur('Relances'))?3:0);
  	oe_init();
  	org_init();
  	orbt_init();
  	or_init();
  	oarnf_init();

	} catch (e) {
    recup_erreur(e);
  }
}


function switchPdf(page) {
	try {
		document.getElementById('pdf').setAttribute('src', page);
		document.getElementById('deck').selectedIndex=1;
		document.getElementById('bRetourReglementsClients').collapsed=false;
		if (document.getElementById('onglets').selectedIndex==0) {
			document.getElementById('boxEcheances').collapsed=false;
		} else if (document.getElementById('onglets').selectedIndex==1) {
			document.getElementById('boxReglements').collapsed=false;
		} else if (document.getElementById('onglets').selectedIndex==3) {
			document.getElementById('boxRelances').collapsed=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function retourSuiviReglements() {
	try {
		if (document.getElementById('onglets').selectedIndex==3) { or_init(); }
		document.getElementById('deck').selectedIndex=0;
		document.getElementById('bRetourReglementsClients').collapsed=true;
		document.getElementById('pdf').setAttribute('src', null);
		document.getElementById('boxEcheances').collapsed=true;
		document.getElementById('boxReglements').collapsed=true;
		document.getElementById('boxRelances').collapsed=true;
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

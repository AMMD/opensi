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

var ouvertpref = 1;
var ouvertliv = 0;
var ouvertmodesliv = 0;
var ouvertreg = 0;
var ouvertbanque = 0;
var ouvertstock = 0;
var ouvertsecteur = 0;
var ouvertmentions = 0;
var ouvertemails = 0;


function init() {
	try {

		var page = "chrome://opensi/content/config/gestion_commerciale/preferences/param.xul?"+ cookie();
  	document.getElementById("pref").setAttribute("src", page);

	} catch (e) {
    recup_erreur(e);
  }
}


function tab() {
	try {
		
		if (document.getElementById("tab").selectedIndex==1 && ouvertmodesliv!=0) {
			// nécessaire pour prendre en compte dans l'onglet Modes Livraison
			// les modifs de l'onglet Organisme Livraison
			document.getElementById("modesliv").setAttribute("src",null);
			ouvertmodesliv = 0;
		}
		
		if ((document.getElementById("tab").selectedIndex==4 || document.getElementById("tab").selectedIndex==8) && ouvertpref!=0) {
			// nécessaire pour prendre en compte dans l'onglet Préférences
			// les modifs de l'onglet Banques, et les modifs de l'onglet Emails
			document.getElementById("pref").setAttribute("src",null);
			ouvertpref = 0;
		}
		
		if (document.getElementById("tab").selectedIndex==0 && ouvertpref!=1) {
			var page = "chrome://opensi/content/config/gestion_commerciale/preferences/param.xul?"+ cookie();
  		document.getElementById("pref").setAttribute("src", page);
			ouvertpref = 1;
		}
		else if (document.getElementById("tab").selectedIndex==1 && ouvertliv!=1) {
			var page = "chrome://opensi/content/config/gestion_commerciale/livraison/livraison.xul?"+ cookie();
  		document.getElementById("liv").setAttribute("src",page);
			ouvertliv = 1;
		}
		else if (document.getElementById("tab").selectedIndex==2 && ouvertmodesliv!=1) {
			var page = "chrome://opensi/content/config/gestion_commerciale/modes_livraison/modes_livraison.xul?"+ cookie();
  		document.getElementById("modesliv").setAttribute("src",page);
  		ouvertmodesliv = 1;
		}
		else if (document.getElementById("tab").selectedIndex==3 && ouvertreg!=1) {
			var page = "chrome://opensi/content/config/gestion_commerciale/reglement/reglement.xul?"+ cookie();
  		document.getElementById("reg").setAttribute("src",page);
			ouvertreg = 1;
		}
		else if (document.getElementById("tab").selectedIndex==4 && ouvertbanque!=1) {
			var page = "chrome://opensi/content/config/gestion_commerciale/banques/banques.xul?"+ cookie();
  		document.getElementById("banque").setAttribute("src",page);
			ouvertbanque = 1;
		}
		else if (document.getElementById("tab").selectedIndex==5 && ouvertstock!=1) {
			var page = "chrome://opensi/content/config/gestion_commerciale/statuts_stock/statuts_stock.xul?"+ cookie();
  		document.getElementById("stock").setAttribute("src",page);
			ouvertstock = 1;
		}
		else if (document.getElementById("tab").selectedIndex==6 && ouvertsecteur!=1) {
			var page = "chrome://opensi/content/config/gestion_commerciale/secteurs_activite/secteurs_activite.xul?"+ cookie();
  		document.getElementById("secteur").setAttribute("src",page);
			ouvertsecteur = 1;
		}
		else if (document.getElementById("tab").selectedIndex==7 && ouvertmentions!=1) {
			var page = "chrome://opensi/content/config/gestion_commerciale/liste_mentions/liste_mentions.xul?"+ cookie();
  		document.getElementById("mentions").setAttribute("src",page);
			ouvertmentions = 1;
		}
		else if (document.getElementById("tab").selectedIndex==8 && ouvertemails!=1) {
			var page = "chrome://opensi/content/config/gestion_commerciale/emails/gestion_emails.xul?"+ cookie();
  		document.getElementById("emails").setAttribute("src",page);
			ouvertemails = 1;
		}

	} catch (e) {
    recup_erreur(e);
  }
}



function retour_menuManager() {
	try {

  	window.location = "chrome://opensi/content/config/menu_manager.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

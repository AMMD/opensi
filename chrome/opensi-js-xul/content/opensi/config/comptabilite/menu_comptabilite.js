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


var ouvert_param = 0;
var preference = 0;


function init() {
	try {

	} catch (e) {
    recup_erreur(e);
  }
}


function tab() {
	try {

		if (document.getElementById("tab").selectedIndex==0 && ouvert_param==0) {
			var page = "chrome://opensi/content/config/comptabilite/defaut/gestion_defaut.xul?"+ cookie() +"&ouvert="+ ouvert_param;
  		document.getElementById("param").setAttribute("src",page);
			ouvert_param = 1;
		}
		if (document.getElementById("tab").selectedIndex==1 && preference==0) {
			var page = "chrome://opensi/content/config/comptabilite/preferences/preferences.xul?"+ cookie() +"&ouvert="+ preference;
  		document.getElementById("preferences").setAttribute("src",page);
			preference = 1;
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

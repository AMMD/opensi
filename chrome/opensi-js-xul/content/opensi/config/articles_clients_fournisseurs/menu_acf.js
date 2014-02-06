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

var ouvertart = 0;
var ouvertcli = 0;
var ouvertfour = 0;



function init() {
	try {

		var page = "chrome://opensi/content/config/articles_clients_fournisseurs/articles/gestion_articles.xul?"+ cookie();
  	document.getElementById("articles").setAttribute("src", page);

	} catch (e) {
    recup_erreur(e);
  }
}


function tab() {
	try {

		if (document.getElementById("tab").selectedIndex==0 && ouvertart==0) {
			var page = "chrome://opensi/content/config/articles_clients_fournisseurs/articles/gestion_articles.xul?"+ cookie();
  		document.getElementById("articles").setAttribute("src",page);
			ouvertart = 1;
		}
		else if (document.getElementById("tab").selectedIndex==1 && ouvertcli==0) {
		
			var page = "chrome://opensi/content/config/articles_clients_fournisseurs/clients/gestion_clients.xul?"+ cookie();
  		document.getElementById("clients").setAttribute("src",page);
			ouvertcli = 1;
		}
		else if (document.getElementById("tab").selectedIndex==2 && ouvertfour==0) {
			var page = "chrome://opensi/content/config/articles_clients_fournisseurs/fournisseurs/gestion_fournisseurs.xul?"+ cookie();
  		document.getElementById("fournisseurs").setAttribute("src",page);
			ouvertfour = 1;
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

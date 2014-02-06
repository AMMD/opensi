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


var ouvert_user = 0;
var ouvert_profil = 0;

function init() {
	try {

	} catch (e) {
    recup_erreur(e);
  }
}


function tab() {
	try {

	
			if (document.getElementById("tab").selectedIndex==0 && ouvert_user==0) {
			var page = "chrome://opensi/content/utilisateurs/utilisateurs.xul?"+ cookie() +"&ouvert="+ ouvert_user;
  		document.getElementById("utilisateur").setAttribute("src",page);
			ouvert_user = 1;
		}
		if (document.getElementById("tab").selectedIndex==1 && ouvert_profil==0) {
			var page = "chrome://opensi/content/utilisateurs/profil.xul?"+ cookie() +"&ouvert="+ ouvert_profil;
  		document.getElementById("profil").setAttribute("src",page);
			ouvert_profil = 1;
		}
		
	} catch (e) {
    recup_erreur(e);
  }
}
function goToMenu(numMenu) {
  
  switch (numMenu) {
  	case 1: window.location = "chrome://opensi/content/utilisateurs/utilisateurs.xul?"+ cookie();		break;
    case 2: window.location = "chrome://opensi/content/utilisateurs/profil.xul?"+ cookie();		break;
   
	}  
}


function retour_menuManager() {
	try {

  	window.location = "chrome://opensi/content/config/menu_manager.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

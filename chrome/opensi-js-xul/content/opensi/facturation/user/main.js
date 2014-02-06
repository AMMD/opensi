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


function init() {
	try {

		window.maximize();

  	var page = "chrome://opensi/content/facturation/user/menu.xul?"+ cookie();
  	document.getElementById("contenu").setAttribute("src",page);
    document.getElementById("login").value = ParamValeur("Utilisateur");
		
		if (ParamValeur("VTest")=="true") {
			document.getElementById("bandeau").setAttribute("class", "bandeau_test");
			document.getElementById("imgLogo").setAttribute("src", "chrome://opensi/content/design/logo-test.jpg");
		}
		
		var date = new Date();
		var mois = date.getMonth()+1;
		var jour = date.getDate();
		document.getElementById("date_courante").value = (jour.toString().length==1?"0"+jour:jour)+ "/" +(mois.toString().length==1?"0"+mois:mois)+ "/" +date.getFullYear();
				
	
	} catch (e) {
    recup_erreur(e);
  }
}

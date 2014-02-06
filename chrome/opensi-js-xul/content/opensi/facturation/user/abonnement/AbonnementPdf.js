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

		var page = getUrlOpeneas("&Page=Facturation/Abonnement/imprimerAbonnement.tmpl&Abonnement_Id="
		+ urlEncode(ParamValeur("Abonnement_Id")));
		document.getElementById('AbonnementPdf').setAttribute("src",page);

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

function Abonnement() {
  try {

    var page = "chrome://opensi/content/facturation/user/abonnement/menu_abonnement.xul?" + cookie();
    page += "&Abonnement_Id="+urlEncode(ParamValeur("Abonnement_Id"));
		page += "&Mode=M";
		window.location = page;

	} catch (e) {
    recup_erreur(e);
  }
}


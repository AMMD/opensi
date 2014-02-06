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


function init() {
	try {

		var qBRChiffre = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qBRChiffre.execute();

		document.getElementById("BR_Chiffre").checked = (result.responseXML.documentElement.getAttribute("BR_Chiffre") == "1");

		editer();

	} catch (e) {
    recup_erreur(e);
  }
}


function editer() {
	try {

		var liste_params = "&BR_Id="+ ParamValeur("BR_Id") + "&Commande_Id="+ ParamValeur("Commande_Id");

		if (ParamValeur("Valider")=="1")
			liste_params += "&Solder="+ ParamValeur("Solder");
		if (document.getElementById("BR_Chiffre").checked)
			liste_params += "&BR_Chiffre=1";

		var page = getUrlOpeneas("&Page=Facturation/Commandes/bon_reception_pdf.tmpl"+ liste_params);
		document.getElementById('br').setAttribute("src",page);

	} catch (e) {
		recup_erreur(e);
	}
}


function retour_br() {
  try {

    window.location = "chrome://opensi/content/facturation/user/commandes/edition_br.xul?"+ cookie() + ParamValeur('ParamRetour');

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

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


var commandeId;


function init() {
  try {
		commandeId = ParamValeur("Commande_Id");
		document.getElementById('rgp-choixCopie').value = "0";

  } catch (e) {
    recup_erreur(e);
  }
}


function copierCommande() {
  try {
  	var typeCopie = document.getElementById('rgp-choixCopie').value;
  	
  	var qCopie = new QueryHttp("Facturation/Affaires/copierCommande.tmpl");
  	qCopie.setParam("Commande_Id", commandeId);
  	qCopie.setParam("Type_Copie", typeCopie);
  	var result = qCopie.execute();
  	var newCommandeId = result.responseXML.documentElement.getAttribute("Commande_Id");
  	
		window.arguments[0](newCommandeId);
		window.close();

	} catch (e) {
    recup_erreur(e);
  }
}

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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var typeDoc = ParamValeur("Type_Doc");
var ligneId = ParamValeur("Ligne_Id");
var prixVente = 0;


function init() {
  try {

		var qGetInfosLigneArticle = new QueryHttp("Facturation/Commun/getInfosLigneArticle.tmpl");
		qGetInfosLigneArticle.setParam("Ligne_Id", ligneId);
		qGetInfosLigneArticle.setParam("Type_Doc", typeDoc);
		var result = qGetInfosLigneArticle.execute();
		prixVente = parseFloat(result.responseXML.documentElement.getAttribute("Prix_Vente"));
		document.getElementById('curPrixAchat').value = result.responseXML.documentElement.getAttribute("Prix_Achat");

  } catch (e) {
    recup_erreur(e);
  }
}



function modifierPrixAchat() {
  try {

		var prixAchat = document.getElementById('prixAchat').value;
		if (isEmpty(prixAchat) || !isPositiveOrNull(prixAchat) || !checkDecimal(prixAchat,4)) { showWarning("Le prix d'achat est incorrect !"); }
		else {
			var ok = true;
			if (parseFloat(prixAchat)>prixVente) { ok = window.confirm("Attention : le prix d'achat est supérieur au prix de vente ! Voulez-vous continuer ?"); }
			
			if (ok) {
				var qMaj = new QueryHttp("Facturation/Commun/modifierPrixAchat.tmpl");
				qMaj.setParam("Ligne_Id", ligneId);
				qMaj.setParam("Type_Doc", typeDoc);
				qMaj.setParam("Prix_Achat", prixAchat);
				var result = qMaj.execute();
				
				if (typeDoc=="Commande_Client") {
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {
						var message = result.responseXML.documentElement.getAttribute("Alerte");
						if (message!=null) {
							showWarning(message);
						}
					}
				}

				window.arguments[0]();
				window.close();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

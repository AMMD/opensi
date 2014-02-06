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


var docId = ParamValeur("Doc_Id");
var typeDoc = ParamValeur("Type_Doc");


function init() {
  try {

		var qCom = new QueryHttp("Facturation/Affaires/getCommentaireCache.tmpl");
		qCom.setParam("Doc_Id", docId);
		qCom.setParam("Type_Doc", typeDoc);
		var result = qCom.execute();

		var contenu = result.responseXML.documentElement;

		document.getElementById('commentairesHid').value = contenu.getAttribute('Commentaires_Hid');
    document.getElementById('commentairesHid').focus();

  } catch (e) {
    recup_erreur(e);
  }
}


function modifierCommentaire() {
  try {

		var qMaj = new QueryHttp("Facturation/Affaires/modifierCommentaireCache.tmpl");
		qMaj.setParam("Doc_Id", docId);
		qMaj.setParam("Type_Doc", typeDoc);
		qMaj.setParam("Commentaires_Hid", document.getElementById('commentairesHid').value);

		qMaj.execute();

		window.close();

	} catch (e) {
    recup_erreur(e);
  }
}

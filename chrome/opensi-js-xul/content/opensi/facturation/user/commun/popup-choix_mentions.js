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

XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

var type_doc = ParamValeur("Type_Doc");
var doc_id = ParamValeur("Doc_Id");
var tab_mentions = new Array();


function init() {
  try {

		var qMentions = new QueryHttp("Facturation/Commun/getListeMentions.tmpl");
		qMentions.setParam("Doc_Id", doc_id);
		qMentions.setParam("Type_Doc", type_doc);
		var result = qMentions.execute();
		var liste_mentions = result.responseXML.documentElement.getElementsByTagName("mention");

		var dataNode = document.getElementById('liste_mentions');

		for (var i=0;i<liste_mentions.length;i++) {
			var dataEntryNode = creerItem(liste_mentions.item(i));
			dataNode.appendChild(dataEntryNode);
		}

		window.sizeToContent();

		var x = (screen.width / 2) - (window.outerWidth / 2);
    var y = (screen.height / 2) - (window.outerHeight / 2);
    window.moveTo(x,y);

  } catch (e) {
    recup_erreur(e);
  }
}


function creerItem(result) {
	try {

		var mention_id = result.getAttribute("mention_id");
		var libelle = result.getAttribute("libelle");
    var selection = (result.getAttribute("selection")=="true");

    var checkbox = document.createElementNS(XUL_NS, "xul:checkbox");
    checkbox.setAttribute("id", "m"+mention_id);
    checkbox.setAttribute("label", libelle);
    checkbox.setAttribute("checked", selection);
    tab_mentions.push(mention_id);

		return checkbox;

  } catch (e) {
		recup_erreur(e);
  }
}


function modifierMentions() {
  try {

		var liste_selection = "";

		for (var i=0; i<tab_mentions.length; i++) {
			var id="m"+tab_mentions[i];
			if (document.getElementById(id).checked) {
				liste_selection += tab_mentions[i]+",";
			}
		}

		var qMaj = new QueryHttp("Facturation/Commun/modifierMentions.tmpl");
		qMaj.setParam("Doc_Id", doc_id);
		qMaj.setParam("Type_Doc", type_doc);
		qMaj.setParam("Liste_Selection", liste_selection);
		qMaj.execute();

		window.arguments[0]("true");
		window.close();

	} catch (e) {
    recup_erreur(e);
  }
}

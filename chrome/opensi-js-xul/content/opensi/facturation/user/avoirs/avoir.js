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

jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");

var docId;
var langueDefaut;

var aLangues = new Arbre("Config/GetRDF/liste-langues.tmpl", "langueDefaut");

function init() {
	try {

		if (!isEmpty(ParamValeur("Apercu"))) {
			document.getElementById("boxMail").collapsed = true;
		}
		
		docId = ParamValeur("Avoir_Id");
		
		var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
		qLangueDefaut.setParam("Type_Doc", "Avoir");
		qLangueDefaut.setParam("Doc_Id", docId);
		var result = qLangueDefaut.execute();
		langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
		aLangues.setParam("Selection", langueDefaut);
		aLangues.initTree(initLangue);
		
	} catch (e) {
    recup_erreur(e);
  }
}


function initLangue() {
	try {
		document.getElementById('langueDefaut').value = langueDefaut;
		editerAvoir();
	} catch (e) {
		recup_erreur(e);
	}
}


function editerAvoir() {
	try {
		var langue = document.getElementById('langueDefaut').value;
		var qGenPdf = new QueryHttp("Facturation/Avoirs/avoir_pdf.tmpl");
		qGenPdf.setParam("Avoir_Id", ParamValeur("Avoir_Id"));
		qGenPdf.setParam("Langue", langue);
		qGenPdf.setParam("Stock", ParamValeur("Stock"));
		if (!isEmpty(ParamValeur("Apercu"))) { qGenPdf.setParam("Apercu", true); }
		var result = qGenPdf.execute();
		if (result.responseXML.documentElement.getAttribute('Existe_Edition')=="true") {
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('FichierPDF');
			document.getElementById('avoir').setAttribute("src", page);
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function envoyer() {
	try {
		var langue = document.getElementById('langueDefaut').value;
		
		var url = "chrome://opensi/content/facturation/user/avoirs/envoyer_mail.xul?"+ cookie();
		url += "&Avoir_Id=" + ParamValeur('Avoir_Id') +"&Stock="+ ParamValeur('Stock') +"&Langue="+ langue;

		window.openDialog(url,'','chrome,modal,centerscreen');
	}
	catch (e) {
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

function retour_avoir() {
  try {

    var page = "chrome://opensi/content/facturation/user/avoirs/edition_avoir.xul?"+ cookie();
    page += "&Avoir_Id="+ ParamValeur('Avoir_Id');
    page += "&Mode="+ ParamValeur('Mode');
    window.location = page;

  } catch (e) {
    recup_erreur(e);
  }
}

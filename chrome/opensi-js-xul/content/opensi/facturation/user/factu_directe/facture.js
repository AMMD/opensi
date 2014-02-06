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

var typeDoc;
var docId;
var langueDefaut;

var aLangues = new Arbre("Config/GetRDF/liste-langues.tmpl", "langueDefaut");

function init() {
	try {
		if (!isEmpty(ParamValeur("Apercu"))) {
			document.getElementById("boxEmail").collapsed = true;
		}

		if (isEmpty(ParamValeur("Proforma_Id"))) {
			typeDoc = "Facture";
			docId = ParamValeur("Facture_Id");
		} else {
			typeDoc = "Proforma";
			docId = ParamValeur("Proforma_Id");
		}
		
		var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
		qLangueDefaut.setParam("Type_Doc", typeDoc);
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
		editerDoc();
	} catch (e) {
		recup_erreur(e);
	}
}


function editerDoc() {
	try {
		if (typeDoc=="Facture") { editerFacture(); }
		else { editerProforma(); }
	} catch (e) {
		recup_erreur(e);
	}
}


function editerFacture() {
	try {
		var langue = document.getElementById('langueDefaut').value;
		var qGenPdf = new QueryHttp("Facturation/Factu_Directe/facture_pdf.tmpl");
		qGenPdf.setParam("Facture_Id", ParamValeur("Facture_Id"));
		qGenPdf.setParam("Langue", langue);
		if (!isEmpty(ParamValeur("Apercu"))) { qGenPdf.setParam("Apercu", true); }
		var result = qGenPdf.execute();
		if (result.responseXML.documentElement.getAttribute('Existe_Edition')=="true") {
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('FichierPDF');
			document.getElementById('facture').setAttribute("src", page);
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function editerProforma() {
	try {
		var langue = document.getElementById('langueDefaut').value;
		var page = getUrlOpeneas("&Page=Facturation/Proforma/pdfProforma.tmpl&Proforma_Id="+ ParamValeur("Proforma_Id") +"&Langue="+ langue);
		
		document.getElementById('facture').setAttribute("src",page);
	} catch (e) {
    recup_erreur(e);
  }
}


function envoyer() {
	try {
		var langue = document.getElementById('langueDefaut').value;
		var url = "chrome://opensi/content/facturation/user/factu_directe/envoyer_mail.xul?"+ cookie();
		url += "&Type_Doc="+ typeDoc +"&Doc_Id="+ docId +"&Langue="+ langue;

		window.openDialog(url,'','chrome,modal,centerscreen');
	}
	catch (e) {
    recup_erreur(e);
  }
}


function retour_factures() {
  try {

    window.location = "chrome://opensi/content/facturation/user/factu_directe/menu_factures.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}


function retour_facture() {
  try {

    var page = "chrome://opensi/content/facturation/user/factu_directe/edition_facture.xul?"+ cookie();
    page += "&Facture_Id=" + ParamValeur('Facture_Id');
    page += "&Mode=" + ParamValeur('Mode');
    window.location = page;

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

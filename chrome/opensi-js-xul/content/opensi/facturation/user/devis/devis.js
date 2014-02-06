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

var sansTotaux = false;
var typeDoc;
var docId;
var langueDefaut;

var aLangues = new Arbre("Config/GetRDF/liste-langues.tmpl", "langueDefaut");

function init() {
	try {
		
		if (isEmpty(ParamValeur("Proforma_Id"))) {
			typeDoc = "Devis";
			docId = ParamValeur("Devis_Id");
		} else {
			typeDoc = "Proforma";
			docId = ParamValeur("Proforma_Id");
			document.getElementById('bEdition').collapsed = true;
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
		if (typeDoc=="Devis") { editerDevis(); }
		else { editerProforma(); }
	} catch (e) {
		recup_erreur(e);
	}
}


function editerDevis() {
	try {
		var langue = document.getElementById('langueDefaut').value;
		var page = getUrlOpeneas("&Page=Facturation/Devis/devis_pdf.tmpl&Devis_Id="+ ParamValeur("Devis_Id") +"&Langue="+ langue);
		if (sansTotaux) {
			page += "&SansTotaux=1";
			document.getElementById('bEdition').setAttribute("label","Devis avec totaux");
			sansTotaux = false;
		}
		else {
			document.getElementById('bEdition').setAttribute("label","Devis sans totaux");
			sansTotaux = true;
		}
		document.getElementById('devis').setAttribute("src",page);

	} catch (e) {
    recup_erreur(e);
  }
}


function editerProforma() {
	try {
		var langue = document.getElementById('langueDefaut').value;
		var page = getUrlOpeneas("&Page=Facturation/Proforma/pdfProforma.tmpl&Proforma_Id="+ ParamValeur("Proforma_Id") +"&Langue="+ langue);
		document.getElementById('devis').setAttribute("src",page);

	} catch (e) {
    recup_erreur(e);
  }
}



function envoyer() {
	try {
		var langue = document.getElementById('langueDefaut').value;
		var url = "chrome://opensi/content/facturation/user/devis/envoyer_mail.xul?"+ cookie();
		url += "&Type_Doc="+ typeDoc +"&Doc_Id="+ docId +"&SansTotaux="+ !sansTotaux +"&Langue="+ langue;
		
		window.openDialog(url,'','chrome,modal,centerscreen');
	}
	catch (e) {
    recup_erreur(e);
  }
}


function retour_devis() {
  try {

		var page = "chrome://opensi/content/facturation/user/devis/edition_devis.xul?"+ cookie() +"&Devis_Id="+ ParamValeur("Devis_Id") +"&Mode=M";
    window.location = page;

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_menu_devis() {
  try {

    window.location = "chrome://opensi/content/facturation/user/devis/menu_devis.xul?"+ cookie();

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

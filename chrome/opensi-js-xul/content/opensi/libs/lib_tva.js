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

/* charger préalablement util.js */


var corps = cookie() +"&Page=Commun/getTableTva.tmpl&ContentType=xml";
var p = requeteHTTP(corps);
var lestva = p.responseXML.documentElement.getElementsByTagName("tva");

function getTva(code_tva) {
	for (var i=0;i<lestva.length;i++) {
		if (lestva.item(i).getAttribute("code")==code_tva) {
			return lestva.item(i).getAttribute("taux");
		}
	}
	return 0;
}


function getTvaNormal(code_pays, assujettiTVA, regimeTVA) {
  var qTva = new QueryHttp("Commun/getTvaNormal.tmpl");
	qTva.setParam("Code_Pays", code_pays);
	qTva.setParam("Regime_TVA", regimeTVA);
	qTva.setParam("Assujetti_TVA", assujettiTVA?"1":"0");
	var result = qTva.execute();
	return result.responseXML.documentElement.getAttribute("taux");
}


function getCodeTvaNormal(code_pays, assujettiTVA, regimeTVA) {
  var qTva = new QueryHttp("Commun/getCodeTvaNormal.tmpl");
	qTva.setParam("Code_Pays", code_pays);
	qTva.setParam("Regime_TVA", regimeTVA);
	qTva.setParam("Assujetti_TVA", assujettiTVA?"1":"0");
	var result = qTva.execute();
	return result.responseXML.documentElement.getAttribute("code");
}

//retourne le code tva correspondant au code_tva en parametre pour le code_pays en parametre
// a enlever lorsque l'on gerera le taux de tva par pays dans la fiche article
function getCodeTvaCorrespondant(code_tva, code_pays, assujettiTVA, regimeTVA) {
	var valRetour = code_tva;
	var continuer = true;
	if (code_pays!="FR" && !assujettiTVA && regimeTVA!="E") {
		// si option_taxation = 0 et zoneUE=1, alors continuer=FALSE
		var qCheckTaxationZoneUE = new QueryHttp("Commun/getTaxationZoneUE.tmpl");
		qCheckTaxationZoneUE.setParam("Code_Pays", code_pays);
		var result = qCheckTaxationZoneUE.execute();
		var contenu = result.responseXML.documentElement;
		if (contenu.getAttribute("Zone_UE")=="true" && contenu.getAttribute("Taxe_Arrivee")=="false") { continuer=false; }
	}
  if (continuer && (code_pays!="FR" || regimeTVA=="E")) {
  	valRetour = getCodeTvaNormal(code_pays, assujettiTVA, regimeTVA);
  }
  
  return valRetour;
}


function getCodeTvaZero(codePays) {
	var qCodeTvaZero = new QueryHttp("Commun/getCodeTvaZero.tmpl");
	qCodeTvaZero.setParam("Code_Pays", codePays);
	var result = qCodeTvaZero.execute();
	return result.responseXML.documentElement.getAttribute('code');
}


function getCodeTvaNormalFrance() {
  var qTva = new QueryHttp("Commun/getCodeTvaNormalFrance.tmpl");
	var result = qTva.execute();
	return result.responseXML.documentElement.getAttribute("code");
}



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
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var remboursementId;

function init() {
  try {
  	window.resizeTo(800,400);
  	
  	remboursementId = window.arguments[0];

		var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "codePays");
		aPays.initTree(initPays);
  } catch (e) {
    recup_erreur(e);
  }
}

function initPays() {
	try {

    document.getElementById('codePays').value = "FR";
    preRemplir();

	} catch (e) {
    recup_erreur(e);
  }
}


function preRemplir() {
	try {

    var qGetClientRemboursement = new QueryHttp("Facturation/Suivi_Reglements_Clients/getClientRemboursement.tmpl");
    qGetClientRemboursement.setParam("Remboursement_Id", remboursementId);
    var result = qGetClientRemboursement.execute();
    var contenu = result.responseXML.documentElement;
    
    document.getElementById('denomination').value = contenu.getAttribute("Denomination");
		document.getElementById('adresse1').value = contenu.getAttribute("Adresse_1");
		document.getElementById('adresse2').value = contenu.getAttribute("Adresse_2");
		document.getElementById('adresse3').value = contenu.getAttribute("Adresse_3");
		document.getElementById('codePostal').value = contenu.getAttribute("Code_Postal");
		document.getElementById('ville').value = contenu.getAttribute("Ville");
		document.getElementById('codePays').value = contenu.getAttribute("Code_Pays");
	} catch (e) {
    recup_erreur(e);
  }
}


function valider() {
  try {
    var denomination = document.getElementById('denomination').value;
		var adresse1 = document.getElementById('adresse1').value;
		var adresse2 = document.getElementById('adresse2').value;
		var adresse3 = document.getElementById('adresse3').value;
		var codePostal = document.getElementById('codePostal').value;
		var ville = document.getElementById('ville').value;
		var codePays = document.getElementById('codePays').value;

		if (isEmpty(denomination)) { showWarning("Veuillez spécifier la raison sociale du destinataire !"); }
		else if (isEmpty(adresse1)) { showWarning("Veuillez spécifier l'adresse !"); }
		else if (isEmpty(ville)) { showWarning("Veuillez spécifier la ville !"); }
		else if (window.confirm("Voulez-vous éditer une lettre de remboursement pour cette adresse ?")) {
			window.arguments[1](denomination, adresse1, adresse2, adresse3, codePostal, ville, codePays);
			window.close();
		}
  } catch (e) {
  	recup_erreur(e);
  }
}


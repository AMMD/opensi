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


var opc_currentChampCompte;


function init() {
	try {		
		
		var aTxTva = new Arbre('Facturation/GetRDF/taux_tva.tmpl', 'opc-Code_TVA');
		aTxTva.initTree(opc_initTva);

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_initTva() {
	try {

		document.getElementById('opc-Code_TVA').selectedIndex = 0;
		opc_nouveauCompte();

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_nouveauCompte() {
	try {
		
		document.getElementById("opc-Detail_Cloture").checked =true;
		document.getElementById("opc-Cumul_Journal").checked = false;
		document.getElementById("opc-Tva_Encaissement").checked = false;
		document.getElementById('opc-Contrepartie').value = '';
		document.getElementById('opc-Collectif').value = '';
			
		document.getElementById('opc-Numero_Compte').disabled = false;
		document.getElementById('opc-Numero_Compte').value = '';
		
		document.getElementById('opc-Intitule').value = '';

		document.getElementById('opc-Code_TVA').selectedIndex = 0;
		document.getElementById('opc-Type_Compte').value = "G";
		document.getElementById("opc-Type_Compte").disabled = false;
		opc_pressOnTypeCompte();
		document.getElementById("opc-rTva").collapsed = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_leaveNumero_Compte() {
	try {

		var numero_compte = document.getElementById('opc-Numero_Compte').value;
		var racineCompte = numero_compte.substring(0,1);
		document.getElementById("opc-rTva").collapsed = (racineCompte!='6' && racineCompte!='7');
    
	} catch (e) {
		recup_erreur(e);
	}
}


function opc_enregistrerCompte() {
	try {
		
		var numeroCompte = document.getElementById('opc-Numero_Compte').value;
		var intitule = document.getElementById('opc-Intitule').value;
		var typeCompte = document.getElementById('opc-Type_Compte').value;
		var codeTVA = document.getElementById('opc-Code_TVA').value;
		var cumulJournal = document.getElementById('opc-Cumul_Journal').checked;
		var detailCloture = document.getElementById('opc-Detail_Cloture').checked;
		var tvaEncaissement = document.getElementById('opc-Tva_Encaissement').checked;
		var collectif = document.getElementById('opc-Collectif').value;
		var contrepartie = document.getElementById('opc-Contrepartie').value;

		if (isEmpty(numeroCompte)) { showWarning('Veuillez saisir un numéro de compte !'); }
		else if (isEmpty(intitule)) { showWarning('Veuillez saisir un libellé !'); }
		else if (!isCompteCorrect(numeroCompte)) { showWarning('Le numéro de compte est incorrect !'); }
		else if (typeCompte=="G" && (numeroCompte.charAt(0)<'1' || numeroCompte.charAt(0)>'7')) { showWarning("Le numéro de compte doit commencer par un chiffre de 1 à 7 !"); }
		else if (typeCompte!="G" && numeroCompte.charAt(0)>'0' && numeroCompte.charAt(0)<'9') { showWarning("Le numéro de compte ne doit pas commencer par un chiffre de 1 à 8 !"); }
		else if (typeCompte!="G" && !isCompteCorrect(collectif)) { showWarning("Le compte collectif doit être rempli !"); }
		else if (typeCompte=="F" && collectif.substr(0,3)!="401") { showWarning("La racine du compte collectif doit être 401 !"); }
		else if (typeCompte=="C" && collectif.substr(0,3)!="411") { showWarning("La racine du compte collectif doit être 411 !"); }
		else if (typeCompte=="A" && (collectif.substr(0,3)=="401" || collectif.substr(0,3)=="411")) { showWarning("La racine du compte collectif ne doit pas être 401 ni 411 !"); }
		
		else if (window.confirm("Confirmez-vous l'enregistrement du compte '"+ numeroCompte +"' ?")) {

			var qSaveCpte = new QueryHttp("Compta/Config/plan_comptable/saveCompte.tmpl");
			
			qSaveCpte.setParam('Numero_Compte', numeroCompte);
			qSaveCpte.setParam('Intitule', intitule);
			qSaveCpte.setParam('Type_Compte', typeCompte);
			qSaveCpte.setParam('Code_TVA', codeTVA);
			qSaveCpte.setParam('Cumul_Journal', cumulJournal);
			qSaveCpte.setParam('Detail_Cloture', detailCloture);
			qSaveCpte.setParam('Collectif', collectif);
			qSaveCpte.setParam('Contrepartie', contrepartie);
			qSaveCpte.setParam('Tva_Encaissement', tvaEncaissement);
			qSaveCpte.setParam('Creation', true);
			
			var result = qSaveCpte.execute();
			
			var errors = new Errors(result);
			if (errors.hasNext()) {		
				errors.show();
			} else {
				window.arguments[0](numeroCompte);
				window.close();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_keypress(e,id,p) {
  try {

		if (e.keyCode==13) {			       
	    	if (id=="opc-Contrepartie" || id=="opc-Collectif") {					
	    		opc_recherche_compte(p, id);
	    	}  
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_recherche_compte(numero_compte,id) {
  try {
		
  	opc_currentChampCompte = id;
    var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Creer=false&Num_Compte="+ urlEncode(numero_compte);
    if (id=="opc-Collectif") { url += "&Type_Rech=C"; }
    window.openDialog(url,'','chrome,modal,centerscreen',opc_retourRechercheCompte);

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_retourRechercheCompte(numCompte) {
	try {
		document.getElementById(opc_currentChampCompte).value = numCompte;
	} catch (e) {
		  recup_erreur(e);
	}
}


function opc_pressOnTypeCompte() {
	try {
		var typeCompte = document.getElementById('opc-Type_Compte').value;
		document.getElementById('opc-Collectif').value="";
		document.getElementById('opc-rCollectif').collapsed = (typeCompte=="G");
		
		document.getElementById('opc-Detail_Cloture').checked = true;
		document.getElementById('opc-rDetail').collapsed = (typeCompte=="G");
		
		document.getElementById('opc-Contrepartie').value="";
		document.getElementById("opc-rContrepartie").collapsed = (typeCompte=="G");

	} catch (e) {
		recup_erreur(e);
	}
}

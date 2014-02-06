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
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");

var aCodesTVA = new Arbre('Facturation/GetRDF/taux_tva_fournisseur.tmpl', 'codeTVA');
var aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'modeReglement');

var commandeId;
var totalTTC;
var totalAcompte;
var montantMaxAcompte;
var chargerModeReg = 0;
var codePays;

var nf = new NumberFormat("0.00", false);


function init() {
  try {
		commandeId = ParamValeur("Commande_Id");
		
		var qGetCommande = new QueryHttp("Facturation/Commandes/getCommande.tmpl");
		qGetCommande.setParam("Commande_Id", commandeId);
		var result = qGetCommande.execute();
		document.getElementById('libelle').value = "Acompte sur commande fournisseur N° " + result.responseXML.documentElement.getAttribute('Numero');
		totalTTC = parseFloat(result.responseXML.documentElement.getAttribute("Total_TTC"));
		totalAcompte = parseFloat(result.responseXML.documentElement.getAttribute("Acompte"));
		montantMaxAcompte = nf.format(totalTTC-totalAcompte);
		
		var fournisseurId = ParamValeur("Fournisseur_Id");
		if (fournisseurId!="") {
			var qGetFournisseur = new QueryHttp("Facturation/Fournisseurs/getFournisseur.tmpl");
			qGetFournisseur.setParam("Fournisseur_Id", fournisseurId);
			var result = qGetFournisseur.execute();
			chargerModeReg = result.responseXML.documentElement.getAttribute("Mode_Reg");
		}
		
		codePays = ParamValeur("Code_Pays");
		
		aCodesTVA.setParam("Code_Pays", codePays);
    aCodesTVA.initTree(selectTVA);
  } catch (e) {
    recup_erreur(e);
  }
}


function selectTVA() {
  try {
    document.getElementById('codeTVA').value = getCodeTvaZero(codePays);
    aModesReglements.setParam("Selection", chargerModeReg);
    aModesReglements.initTree(initModeReglement);
  } catch (e) {
    recup_erreur(e);
  }
}


function initModeReglement() {
	try {
		document.getElementById('modeReglement').value = chargerModeReg;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnExoneration() {
	try {
		var exoneration = document.getElementById('chkExonerationTVA').checked;
		
		// positionner taux de tva
		document.getElementById('codeTVA').value = (codePays!="FR" || exoneration?getCodeTvaZero(codePays):getCodeTvaNormalFrance());
		calculerMontantTTC();
		document.getElementById('rowCodeTVA').collapsed = exoneration;
		document.getElementById('rowMontantTTC').collapsed = exoneration;
		document.getElementById('lblMontantHT').value = (exoneration?"* Montant :":"* Montant HT :");
		
	} catch (e) {
		recup_erreur(e);
	}
}


function calculerMontantHT() {
	try {
		var tauxTVA = parseFloat(document.getElementById('codeTVA').getAttribute("label"));
		var montantTTC = document.getElementById('montantTTC').value;
		if (!isEmpty(montantTTC) && !isNaN(montantTTC)) {
			var montantHT = parseFloat(montantTTC)/(1 + tauxTVA/100);
			document.getElementById('montantHT').value = nf.format(montantHT);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function calculerMontantTTC() {
	try {
		var tauxTVA = parseFloat(document.getElementById('codeTVA').getAttribute("label"));
		var montantHT = document.getElementById('montantHT').value;
		if (!isEmpty(montantHT) && !isNaN(montantHT)) {
			var montantTTC = parseFloat(montantHT)*(1 + tauxTVA/100);
			document.getElementById('montantTTC').value = nf.format(montantTTC);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function valider() {
	try {
		
  	var numAcompte = document.getElementById('numAcompte').value;
  	var codeTVA = document.getElementById('codeTVA').value;
		var montantHT = document.getElementById('montantHT').value;
		var montantTTC = document.getElementById('montantTTC').value;
		var modeReglement = document.getElementById('modeReglement').value;
		var libelle = document.getElementById('libelle').value;
		var commentaires = document.getElementById('commentaires').value;
		
		if (isEmpty(montantHT) || !isPositive(montantHT) || !checkNumber(montantHT,12,2)) { showWarning("Le montant HT est incorrect !"); }
		else if (isEmpty(montantTTC) || !isPositive(montantTTC) || !checkNumber(montantTTC,12,2)) { showWarning("Le montant TTC est incorrect !"); }
		else if (parseFloat(montantTTC)>montantMaxAcompte) { showWarning("Le montant de l'acompte ne peut pas excéder "+ montantMaxAcompte +" !"); }
		else if (modeReglement=="0") { showWarning("Veuillez choisir un mode de règlement !"); }
		else if (isEmpty(libelle)) { showWarning("Veuillez saisir un libellé !"); }
		else if (window.confirm("Confirmez-vous la génération de la facture d'acompte ?")) {
	  	var qCreerAcompte = new QueryHttp("Facturation/Commandes/creerAcompte.tmpl");
	  	qCreerAcompte.setParam("Commande_Id", commandeId);
	  	qCreerAcompte.setParam("Num_Acompte", numAcompte);
	  	qCreerAcompte.setParam("Code_TVA", codeTVA);
	  	qCreerAcompte.setParam("Montant_HT", montantHT);
	  	qCreerAcompte.setParam("Montant_TTC", montantTTC);
	  	qCreerAcompte.setParam("Mode_Reglement", modeReglement);
	  	qCreerAcompte.setParam("Libelle", libelle);
	  	qCreerAcompte.setParam("Commentaires", commentaires);
	  	qCreerAcompte.execute();
	  	
			window.arguments[0]();
			window.close();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

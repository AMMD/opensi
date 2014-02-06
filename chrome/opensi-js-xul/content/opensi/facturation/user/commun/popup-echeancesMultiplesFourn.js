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

jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");


var factureId;
var modifiable;
var chargerModeReg;
var montantNet;
var totalEcheances;
var totalRestant;
var currentEcheance;
var modifie = false;
var chargement = true;

var nf = new NumberFormat("0.00");
var nf2 = new NumberFormat("0.00", true);

var aListeEcheances = new Arbre('Facturation/Factu_Fournisseur/liste-echeancesMultiples.tmpl', 'listeEcheances');
var aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'Mode_Reg');


function init() {
	try {
		window.parent.addEventListener("close",majParentOnClose,false);
		
		factureId = ParamValeur("Facture_Id");
		modifiable = (ParamValeur("Modifiable")=="1");
		
		if (!modifiable) {
			document.getElementById('boxModification').collapsed=true;
		}
		
		var qGetMontantNet = new QueryHttp("Facturation/Factu_Fournisseur/getMontantNet.tmpl");
		qGetMontantNet.setParam("Facture_Id", factureId);
		var result = qGetMontantNet.execute();
		montantNet = parseFloat(result.responseXML.documentElement.getAttribute("montantNet"));
		if (montantNet<0) { montantNet = 0; }
		document.getElementById('montantNet').value = nf2.format(montantNet);
		
		aListeEcheances.setParam("Facture_Id", factureId);
		aListeEcheances.initTree(initLigne);
		
	} catch (e) {
		recup_erreur(e);
	}
}



function chargerModesReglements(selection) {
	try {
		chargerModeReg = selection;
		aModesReglements.setParam("Selection", chargerModeReg);
		aModesReglements.initTree(initModeReglement);
	} catch (e) {
		recup_erreur(e);
	}
}


function initModeReglement() {
	try {

    document.getElementById('Mode_Reg').value=chargerModeReg;

	} catch (e) {
    recup_erreur(e);
  }
}


function selectOnListeEcheances() {
	try {
		if (modifiable && aListeEcheances.isSelected()) {
			var i = aListeEcheances.getCurrentIndex();
			document.getElementById('bSupprimer').disabled = (i==0);
			currentEcheance = aListeEcheances.getCellText(i, 'colEcheanceId');
			document.getElementById('Date_Echeance').value = aListeEcheances.getCellText(i, 'colDateEcheance');
			document.getElementById('Montant').value = aListeEcheances.getCellText(i, 'colMontant');
			chargerModesReglements(aListeEcheances.getCellText(i, 'colModeRegId'));
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function calculerTotalEcheances() {
	try {
		totalEcheances = 0;
		var nbLignes = aListeEcheances.nbLignes();
		for (var i=0; i<nbLignes; i++) {
			totalEcheances += parseFloat(aListeEcheances.getCellText(i, 'colMontant'));
		}
		
		totalRestant = montantNet-totalEcheances;
		document.getElementById('totalEcheances').value = nf2.format(totalEcheances);
		document.getElementById('totalRestant').value = nf2.format(totalRestant);
	} catch (e) {
		recup_erreur(e);
	}
}


function initLigne() {
	try {
		calculerTotalEcheances();
		
		if (chargement && aListeEcheances.nbLignes()==1) {
			chargement = false;
			aListeEcheances.select(0);
			selectOnListeEcheances();
		} else {
			if (aListeEcheances.isSelected()) {
				aListeEcheances.select(-1);
			}
			currentEcheance = "";
			document.getElementById('bSupprimer').disabled = true;
			if (aListeEcheances.nbLignes()>0) {
				var i = aListeEcheances.nbLignes()-1;
				document.getElementById('Date_Echeance').value = aListeEcheances.getCellText(i, 'colDateEcheance');
				document.getElementById('Montant').value = (totalRestant>0?nf.format(totalRestant):"");
				chargerModesReglements(aListeEcheances.getCellText(i, 'colModeRegId'));
			} else { // peut se produire si la facture est payée entièrement avec un acompte
				document.getElementById('Date_Echeance').value = "";
				document.getElementById('Montant').value = montantNet;
				chargerModesReglements("0");
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function validerLigne() {
	try {
		
		var dateEcheance = document.getElementById('Date_Echeance').value;
		var modeReglement = document.getElementById('Mode_Reg').value;
		var montant = document.getElementById('Montant').value;
		
		
		if (isEmpty(dateEcheance) || !isDate(dateEcheance)) { showWarning("Date d'échéance incorrecte !"); }
		else if (isEmpty(montant) || !isPositiveOrNull(montant) || (montantNet!=0 && parseFloat(montant)==0)) { showWarning("Montant incorrect !"); }
		else {
			
			var qEnregistrerEcheance;
			if (currentEcheance=="") {
				qEnregistrerEcheance = new QueryHttp("Facturation/Factu_Fournisseur/creerEcheance.tmpl");
				qEnregistrerEcheance.setParam("Facture_Id", factureId);
			} else {
				qEnregistrerEcheance = new QueryHttp("Facturation/Factu_Fournisseur/modifierEcheance.tmpl");
				qEnregistrerEcheance.setParam("Echeance_Id", currentEcheance);
			}
		
			qEnregistrerEcheance.setParam("Date_Echeance", prepareDateJava(dateEcheance));
			qEnregistrerEcheance.setParam("Mode_Reglement", modeReglement);
			qEnregistrerEcheance.setParam("Montant", montant);
			qEnregistrerEcheance.execute();
			
			aListeEcheances.initTree(initLigne);
			modifie = true;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerLigne() {
	try {
		if (window.confirm("Voulez-vous supprimer cette échéance ?")) {
			var qSupprimerEcheance = new QueryHttp("Facturation/Factu_Fournisseur/supprimerEcheance.tmpl");
			qSupprimerEcheance.setParam("Echeance_Id", currentEcheance);
			qSupprimerEcheance.execute();
	
			aListeEcheances.initTree(initLigne);
			modifie = true;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function evaluer(elem, ev) {
	try {

		if (ev.keyCode==13) {
			var nf4 = new NumberFormat("0.00##", false);
			elem.value = nf4.format(calcExpr(elem.value));
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function reinitialiser() {
	try {
		if (window.confirm("Voulez-vous réinitialiser les échéances ?")) {
			var qReinitialiser = new QueryHttp("Facturation/Factu_Fournisseur/reinitialiserEcheances.tmpl");
			qReinitialiser.setParam("Facture_Id", factureId);
			qReinitialiser.execute();
			aListeEcheances.initTree(initLigne);
			modifie = true;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function checkEcheances() {
	try {
		var ok = false;
		
		if (!modifiable) {
			ok = true;
		} else {
	  	var qVerifierEcheances = new QueryHttp("Facturation/Factu_Fournisseur/checkEcheances.tmpl");
	  	qVerifierEcheances.setParam("Facture_Id", factureId);
	  	var result = qVerifierEcheances.execute();
	  	codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
	    
			if (codeErreur=="1") { showWarning("Les dates d'échéances doivent être supérieures ou égales à la date de la facture !"); }
			else if (codeErreur=="2") { showWarning("Veuillez remplir les modes de règlements des échéances !"); }
			else if (codeErreur=="3") { showWarning("Le total des échéances doit être égal au net à payer !"); }
			else { ok=true; }
		}
		
		return ok;
	} catch (e) {
		recup_erreur(e);
	}
}


function majParent() {
	try {
		if (checkEcheances()) {
			if (modifie) {
				window.arguments[0]();
				modifie = false;
			}
			window.close();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function majParentOnClose() {
	try {
		checkEcheances();
		if (modifie) { window.arguments[0](); }
	} catch (e) {
		recup_erreur(e);
	}
}



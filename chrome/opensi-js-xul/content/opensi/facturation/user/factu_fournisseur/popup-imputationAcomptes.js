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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");

var factureId;
var nf2 = new NumberFormat("0.00", true);
var aAcomptesNonImputes = new Arbre("Facturation/Factu_Fournisseur/liste-acomptesNonImputes.tmpl", "listeAcomptesNonImputes");
var aAcomptesImputes = new Arbre("Facturation/Factu_Fournisseur/liste-acomptesImputes.tmpl", "listeAcomptesImputes");


function init() {
	try {

		factureId = window.arguments[0];
		aAcomptesNonImputes.setParam("Facture_Id", factureId);
		aAcomptesImputes.setParam("Facture_Id", factureId);
		
		reinitialiser();
		
	} catch (e) {
  	recup_erreur(e);
  }
}


function reinitialiser() {
	try {
		document.getElementById('montantEntree').value = "";
		document.getElementById('montantSortie').value = "";
		document.getElementById('acompteTotal').value = "";
		
		document.getElementById('listeAcomptesNonImputes').disabled = true;
		document.getElementById('listeAcomptesImputes').disabled = true;
		document.getElementById('montantEntree').disabled = true;
		document.getElementById('montantSortie').disabled = true;
		document.getElementById('bAjouter').disabled = true;
		document.getElementById('bEnlever').disabled = true;
		document.getElementById('bQuitter').disabled = true;
		
		aAcomptesNonImputes.initTree(reinitialiser2);
	} catch (e) {
		recup_erreur(e);
	}
}


function reinitialiser2() {
	try {
		aAcomptesImputes.initTree(reinitialiser3);
	} catch (e) {
		recup_erreur(e);
	}
}


function reinitialiser3() {
	try {
		var montantTotal = 0;
		var nbLignes = aAcomptesImputes.nbLignes();
		for (var i=0; i<nbLignes; i++) {
			montantTotal += parseFloat(aAcomptesImputes.getCellText(i, 'colMontantSortie'));
		}
		document.getElementById('acompteTotal').value = nf2.format(montantTotal);
		
		document.getElementById('listeAcomptesNonImputes').disabled = false;
		document.getElementById('listeAcomptesImputes').disabled = false;
		document.getElementById('bQuitter').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnAcomptesNonImputes() {
	try {
		if (aAcomptesImputes.isSelected()) {
			aAcomptesImputes.select(-1);
			document.getElementById('montantSortie').value = "";
			document.getElementById('montantSortie').disabled = true;
			document.getElementById('bEnlever').disabled = true;
		}
		if (aAcomptesNonImputes.isSelected()) {
			var i = aAcomptesNonImputes.getCurrentIndex();
			document.getElementById('montantEntree').value = aAcomptesNonImputes.getCellText(i, 'colMontantEntree');
			document.getElementById('montantEntree').disabled = false;
			document.getElementById('bAjouter').disabled = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnAcomptesImputes() {
	try {
		if (aAcomptesNonImputes.isSelected()) {
			aAcomptesNonImputes.select(-1);
			document.getElementById('montantEntree').value = "";
			document.getElementById('montantEntree').disabled = true;
			document.getElementById('bAjouter').disabled = true;
		}
		if (aAcomptesImputes.isSelected()) {
			var i = aAcomptesImputes.getCurrentIndex();
			document.getElementById('montantSortie').value = aAcomptesImputes.getCellText(i, 'colMontantSortie');
			document.getElementById('montantSortie').disabled = false;
			document.getElementById('bEnlever').disabled = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnAjouter() {
	try {
		if (aAcomptesNonImputes.isSelected()) {
			var i = aAcomptesNonImputes.getCurrentIndex();
			var montantMax = parseFloat(aAcomptesNonImputes.getCellText(i, 'colMontantEntree'));
			var montant = document.getElementById('montantEntree').value;
			if (isEmpty(montant) || !isPositive(montant)) { showWarning("Le montant est incorrect !"); }
			else if (montant>montantMax) { showWarning("Veuillez saisir un montant inférieur ou égal au montant restant à imputer."); }
			else {
				var acompteId = aAcomptesNonImputes.getCellText(i, 'colAcompteIdEntree');
				var qAjouter = new QueryHttp("Facturation/Factu_Fournisseur/ajouterImputationAcompte.tmpl");
				qAjouter.setParam("Facture_Id", factureId);
				qAjouter.setParam("Acompte_Id", acompteId);
				qAjouter.setParam("Montant", montant);
		  	qAjouter.execute();
				reinitialiser();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnEnlever() {
	try {
		if (aAcomptesImputes.isSelected()) {
			var i = aAcomptesImputes.getCurrentIndex();
			var montantMax = parseFloat(aAcomptesImputes.getCellText(i, 'colMontantSortie'));
			var montant = document.getElementById('montantSortie').value;
			if (isEmpty(montant) || !isPositive(montant)) { showWarning("Le montant est incorrect !"); }
			else if (montant>montantMax) { showWarning("Veuillez saisir un montant inférieur ou égal au montant imputé."); }
			else {
				var acompteId = aAcomptesImputes.getCellText(i, 'colAcompteIdSortie');
				var qEnlever = new QueryHttp("Facturation/Factu_Fournisseur/enleverImputationAcompte.tmpl");
				qEnlever.setParam("Facture_Id", factureId);
				qEnlever.setParam("Acompte_Id", acompteId);
				qEnlever.setParam("Montant", montant);
				qEnlever.execute();
				reinitialiser();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function quitter() {
	try {
		var qCheckImputation = new QueryHttp("Facturation/Factu_Fournisseur/checkImputationsAcomptes.tmpl");
  	qCheckImputation.setParam("Facture_Id", factureId);
  	var result = qCheckImputation.execute();
  	var errors = new Errors(result);

		if (errors.hasNext()) { errors.show(); }
		else { window.close(); }
	} catch (e) {
  	recup_erreur(e);
  }
}


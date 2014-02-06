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

jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arrondi.js");

var nf2 = new NumberFormat("0.00", true);
var arr2 = new Arrondi(2);
var arr4 = new Arrondi(4);
var arr6 = new Arrondi(6);


function CalculDocument() {
	// variables en entrée
	this.editionTTC=false;
	this.remiseP=0;
	this.fraisPortBruts=0;
	this.remiseFPP=0;
	this.codeTVAFP=0;
	this.tauxTVAFP=0;
	this.escompteP=0;
	this.acompte=0;
	
	// variables en sortie
	this.remiseFPM=0;
	this.fraisPortNets=0;
	this.montantHT=0;
	this.remiseM=0;
	this.totalHT=0;
	this.totalCommission=0;
	this.totalTVA=0;
	this.montantTTC=0;
	this.escompteM=0;
	this.totalTTC=0;
	this.netAPayer=0;
	
	// données internes
	this.lignesDocument=new Array();
	this.lignesVentilTVA=new Array();
	this.ventilCommission=new VentilCommission();
}

CalculDocument.prototype.setEditionTTC=function(editionTTC) { this.editionTTC=editionTTC; }
CalculDocument.prototype.setRemiseP=function(remiseP) { this.remiseP=parseFloat(remiseP); }
CalculDocument.prototype.setRemiseM=function(remiseM) { this.remiseM=parseFloat(remiseM); }
CalculDocument.prototype.setFraisPortBruts=function(fraisPortBruts) { this.fraisPortBruts=parseFloat(fraisPortBruts); }
CalculDocument.prototype.setRemiseFPP=function(remiseFPP) { this.remiseFPP=parseFloat(remiseFPP); }
CalculDocument.prototype.setRemiseFPM=function(remiseFPM) { this.remiseFPM=parseFloat(remiseFPM); }
CalculDocument.prototype.setTauxTVAFP=function(tauxTVAFP) {
	// à modifier plus tard ; si on reçoit le code tva, on pourra retrouver le taux
	this.tauxTVAFP=parseFloat(tauxTVAFP);
	this.codeTVAFP=(this.tauxTVAFP==0?1:4);
}
CalculDocument.prototype.setEscompteP=function(escompteP) { this.escompteP=parseFloat(escompteP); }
CalculDocument.prototype.setAcompte=function(acompte) { this.acompte=parseFloat(acompte); }

CalculDocument.prototype.getMontantHT=function() { return nf2.format(this.montantHT); }
CalculDocument.prototype.getRemiseM=function() { return nf2.format(this.remiseM); }
CalculDocument.prototype.afficherRemiseM=function() { return (this.remiseM!=0); }
CalculDocument.prototype.getFraisPortBruts=function() { return nf2.format(this.fraisPortBruts); }
CalculDocument.prototype.getRemiseFPM=function() { return nf2.format(this.remiseFPM); }
CalculDocument.prototype.afficherRemiseFPM=function() { return (this.remiseFPM!=0); }
CalculDocument.prototype.getTotalHT=function() { return nf2.format(this.totalHT); }
CalculDocument.prototype.getCommissionHT=function() { return nf2.format(this.ventilCommission.baseHTNet); }
CalculDocument.prototype.getCommissionTTC=function() { return nf2.format(this.ventilCommission.baseTTCNet); }
CalculDocument.prototype.afficherCommission=function() { return (this.editionTTC?(this.ventilCommission.baseTTCNet!=0):(this.ventilCommission.baseHTNet!=0)); }
CalculDocument.prototype.getTotalTVA=function() { return nf2.format(this.totalTVA); }
CalculDocument.prototype.getMontantTTC=function() { return nf2.format(this.montantTTC); }
CalculDocument.prototype.getEscompteM=function() { return nf2.format(this.escompteM); }
CalculDocument.prototype.afficherEscompteM=function() { return (this.escompteM!=0); }
CalculDocument.prototype.getAcompte=function() { return nf2.format(this.acompte); }
CalculDocument.prototype.getTotalTTC=function() { return nf2.format(this.totalTTC); }
CalculDocument.prototype.getNetAPayer=function() { return nf2.format(this.netAPayer); }

// nécessaire pour ne pas faire buguer les interfaces
CalculDocument.prototype.getMontantHTSansFormat=function() { return this.montantHT; }
CalculDocument.prototype.getTotalHTSansFormat=function() { return this.totalHT; }
CalculDocument.prototype.getMontantTTCSansFormat=function() { return this.montantTTC; }


CalculDocument.prototype.ajouterLigneDocument=function(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA) {
	this.lignesDocument.push(new LigneDocument(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA));
}




CalculDocument.prototype.calculerVentilTVA=function() {
	var codeTVAFPTrouve = false;
	for (var i=0; i<this.lignesDocument.length; i++) {
		var trouve = false;
		var j=0;
		while (!trouve && j<this.lignesVentilTVA.length) {
			if (this.lignesDocument[i].codeTVA==this.lignesVentilTVA[j].codeTVABase) {
				trouve = true;
			} else {
				j++;
			}
		}
		
		if (trouve) {
			this.lignesVentilTVA[j].baseBrut += this.lignesDocument[i].montantLigneAvantCommission;
		} else {
			var ligneVentilTVA = new LigneVentilTVA();
			ligneVentilTVA.codeTVABase = this.lignesDocument[i].codeTVA;
			ligneVentilTVA.tauxTVABase = this.lignesDocument[i].tauxTVA;
			ligneVentilTVA.baseBrut = this.lignesDocument[i].montantLigneAvantCommission;
			this.lignesVentilTVA.push(ligneVentilTVA);
		}
		
		if (!codeTVAFPTrouve && this.lignesDocument[i].codeTVA==this.codeTVAFP) {
			codeTVAFPTrouve = true;
		}
	}
	
	if (!codeTVAFPTrouve) {
		var ligneVentilTVA = new LigneVentilTVA();
		ligneVentilTVA.codeTVABase = this.codeTVAFP;
		ligneVentilTVA.tauxTVABase = this.tauxTVAFP;
		this.lignesVentilTVA.push(ligneVentilTVA);
	}
	
	var totalBaseBrut = 0;
	for (var i=0; i<this.lignesVentilTVA.length; i++) {
		this.lignesVentilTVA[i].baseBrut = arr2.round(this.lignesVentilTVA[i].baseBrut);
		totalBaseBrut += this.lignesVentilTVA[i].baseBrut;
	}
	
	if (this.remiseM!=0) {
		this.remiseP = arr6.round(totalBaseBrut==0?0:(this.remiseM*100)/totalBaseBrut);
		this.remiseM=0;
	}
	
	for (var i=0; i<this.lignesVentilTVA.length; i++) {
		this.lignesVentilTVA[i].montantRemiseBase = arr2.round(this.lignesVentilTVA[i].baseBrut*(this.remiseP/100));
		var baseNet = this.lignesVentilTVA[i].baseBrut - this.lignesVentilTVA[i].montantRemiseBase;
		if (this.lignesVentilTVA[i].codeTVABase==this.codeTVAFP) {
			baseNet += this.fraisPortNets;
		}
		if (this.editionTTC) {
			this.lignesVentilTVA[i].baseTTCNet = arr2.round(baseNet);
			this.lignesVentilTVA[i].montantTVABase = arr2.round(this.lignesVentilTVA[i].baseTTCNet * (this.lignesVentilTVA[i].tauxTVABase/100) / (this.lignesVentilTVA[i].tauxTVABase/100+1));
			this.lignesVentilTVA[i].baseHTNet = arr2.round(this.lignesVentilTVA[i].baseTTCNet - this.lignesVentilTVA[i].montantTVABase);
		} else {
			this.lignesVentilTVA[i].baseHTNet = arr2.round(baseNet);
			this.lignesVentilTVA[i].montantTVABase = arr2.round(this.lignesVentilTVA[i].baseHTNet * (this.lignesVentilTVA[i].tauxTVABase/100));
			this.lignesVentilTVA[i].baseTTCNet = arr2.round(this.lignesVentilTVA[i].baseHTNet + this.lignesVentilTVA[i].montantTVABase);
		}
	}
}


CalculDocument.prototype.calculerVentilCommission=function() {
	for (var i=0; i<this.lignesDocument.length; i++) {
		this.ventilCommission.baseBrut += this.lignesDocument[i].montantCommissionLigne;
	}
	this.ventilCommission.baseBrut = arr2.round(this.ventilCommission.baseBrut);
	this.ventilCommission.montantRemiseBase = arr2.round(this.ventilCommission.baseBrut * (this.remiseP/100));
	
	if (this.editionTTC) {
		this.ventilCommission.baseTTCNet = arr2.round(this.ventilCommission.baseBrut - this.ventilCommission.montantRemiseBase);
		this.ventilCommission.montantTVABase = arr2.round(this.ventilCommission.baseTTCNet * (this.ventilCommission.tauxTVABase/100) / (this.ventilCommission.tauxTVABase/100+1));
		this.ventilCommission.baseHTNet = arr2.round(this.ventilCommission.baseTTCNet - this.ventilCommission.montantTVABase);
	} else {
		this.ventilCommission.baseHTNet = arr2.round(this.ventilCommission.baseBrut - this.ventilCommission.montantRemiseBase);
		this.ventilCommission.montantTVABase = arr2.round(this.ventilCommission.baseHTNet * (this.ventilCommission.tauxTVABase/100));
		this.ventilCommission.baseTTCNet = arr2.round(this.ventilCommission.baseHTNet + this.ventilCommission.montantTVABase);
	}
}


CalculDocument.prototype.calculer=function() {
	
	if (this.remiseFPM!=0) { this.remiseFPP = arr6.round(this.fraisPortBruts==0?0:(this.remiseFPM/this.fraisPortBruts)*100); }
	else { this.remiseFPM = arr2.round(this.fraisPortBruts * (this.remiseFPP/100)); }
	this.fraisPortNets = arr2.round(this.fraisPortBruts - this.remiseFPM);
	
	this.calculerVentilTVA();
	this.calculerVentilCommission();
	
	for (var i=0; i<this.lignesVentilTVA.length; i++) {
		if (this.editionTTC) { this.montantTTC += this.lignesVentilTVA[i].baseBrut; }
		else { this.montantHT += this.lignesVentilTVA[i].baseBrut; }
		this.remiseM += this.lignesVentilTVA[i].montantRemiseBase;
		this.totalTVA += this.lignesVentilTVA[i].montantTVABase;
	}
	this.remiseM = arr2.round(this.remiseM);
	this.totalTVA = arr2.round(this.totalTVA - this.ventilCommission.montantTVABase);
	
	if (this.editionTTC) {
		this.montantTTC = arr2.round(this.montantTTC);
		this.totalCommission = this.ventilCommission.baseTTCNet;
		this.totalTTC = arr2.round(this.montantTTC - this.remiseM + this.fraisPortNets - this.totalCommission);
	} else {
		this.montantHT = arr2.round(this.montantHT);
		this.totalHT = arr2.round(this.montantHT - this.remiseM + this.fraisPortNets);
		this.totalCommission = this.ventilCommission.baseHTNet;
		this.montantTTC = arr2.round(this.totalHT - this.totalCommission + this.totalTVA);
	}
	
	if (this.editionTTC) {
		this.escompteM = arr2.round(this.totalTTC * (this.escompteP/100));
		this.netAPayer = arr2.round(this.totalTTC - this.acompte - this.escompteM);
	} else {
		this.escompteM = arr2.round(this.montantTTC * (this.escompteP/100));
		this.totalTTC = arr2.round(this.montantTTC - this.escompteM);
		this.netAPayer = arr2.round(this.totalTTC - this.acompte);
	}
}


function LigneDocument(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA) {
	// variables en entrée
	this.prixUnitaireBrut=parseFloat(prixUnitaireBrut);
	this.ristourneP=parseFloat(ristourneP);
	this.commissionP=parseFloat(commissionP);
	this.quantite=parseFloat(quantite);
	this.codeTVA=parseInt(codeTVA);
	this.tauxTVA=getTva(this.codeTVA);
	
	// variables en sortie
	this.ristourneM=arr4.round(this.prixUnitaireBrut * (this.ristourneP/100));
	this.prixUnitaireNet=arr4.round(this.prixUnitaireBrut - this.ristourneM);
	this.commissionM=arr4.round(this.prixUnitaireNet * (this.commissionP/100));
	this.prixUnitaireNetApresCommission=arr4.round(this.prixUnitaireNet - this.commissionM);
	this.montantCommissionLigne=arr2.round(this.commissionM * this.quantite);
	this.montantLigneAvantCommission=arr2.round(this.prixUnitaireNet * this.quantite);
	this.montantLigne=arr2.round(this.montantLigneAvantCommission - this.montantCommissionLigne);
}


function LigneVentilTVA() {
	// variables en entrée
	this.codeTVABase=0;
	this.tauxTVABase=0;
	this.fraisPortNets=0;
	
	// variables en sortie
	this.baseBrut=0;
	this.montantRemiseBase=0;
	this.baseHTNet=0;
	this.montantTVABase=0;
	this.baseTTCNet=0;
}


function VentilCommission() {
	// variables en entrée
	this.codeTVABase=4; // à modifier pour le recevoir en paramètre
	this.tauxTVABase=getTva(this.codeTVABase);
	
	// variables en sortie
	this.baseBrut=0;
	this.montantRemiseBase=0;
	this.baseHTNet=0;
	this.montantTVABase=0;
	this.baseTTCNet=0;
}


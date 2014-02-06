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


var oec_charger;
var oec_modeLigne;
var oec_codeTvaPort;
var oec_tauxTvaPort;
var oec_zoneUE;
var oec_modeTarif;
var oec_mode;
var oec_etatCommande;
var oec_soldee;
var oec_facturee;
var oec_defEditionTTC;
var oec_editionTTC;
var oec_assujettiTVA;
var oec_defCommission;
var oec_defModeExpedition;
var oec_typeRemise;
var oec_typeRemiseFP;
var oec_editionPdf;
var oec_premiereCommande;
var oec_nf = new NumberFormat("0.00", false);
var oec_chargerModeReg;
var oec_chargerResponsable;
var oec_acompte;
var oec_currentIndex;
var oec_montantHT;
var oec_montantTTC;

var oec_typeEditionPdf;
var oec_docIdPdf;
var oec_editionInitiale;

var oec_typeLigne;
var oec_tarifId;
var oec_ligneId;
var oec_libelle;
var oec_modifie = false;
var oec_bloque = false;
var oec_langueDefaut;

var oec_aResponsables=new Arbre("ComboListe/combo-responsables.tmpl","oec-responsable");
var oec_aUnites = new Arbre("Facturation/Affaires/liste-unitesVente.tmpl", "oec-unite");
var oec_aCodesTarifs = new Arbre("Facturation/Affaires/liste-codesTarifs.tmpl", "oec-codeTarif");
var oec_aModesExpedition=new Arbre("Facturation/Affaires/liste-modesExpedition.tmpl","oec-modeExpedition");
var oec_aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "oec-secteur");
var oec_aPaysFact = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oec-codePaysFact");
var oec_aPaysLiv = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oec-codePaysLiv");
var oec_aPaysEnvoi = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oec-codePaysEnvoi");
var oec_aCodesTVA = new Arbre("Facturation/Affaires/liste-tauxTva.tmpl", "oec-codeTVA");
var oec_aArticles = new Arbre("Facturation/Affaires/liste-articlesCommande.tmpl", "oec-articles");
var oec_aModesReglements = new Arbre("ComboListe/combo-modesReglement.tmpl", "oec-modeReglement");
var oec_aAcomptes = new Arbre("Facturation/Affaires/liste-acomptes.tmpl","oec-listeAcomptes");
var oec_aListeReglements = new Arbre("Facturation/Affaires/liste-reglementsCommande.tmpl","oec-listeReglements");
var oec_aLiensColis = new Arbre("Facturation/Affaires/liste-liensColisCommande.tmpl","oec-liensColis");
var oec_aListeHistorique = new Arbre("Facturation/Affaires/liste-historiqueModifications.tmpl","oec-listeHistorique");
var oec_aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","oec-listeVersion");
var oec_aLangues = new Arbre("Config/GetRDF/liste-langues.tmpl", "oec-langueDefaut");

function oec_init() {
  try {
    
    var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();
		
		var actCodeStats = (result.responseXML.documentElement.getAttribute('Act_Code_Stats')=="1");
		var calculStock = (result.responseXML.documentElement.getAttribute("Calcul_Stock")=="1");
		if (!actCodeStats) {
			document.getElementById('oec-colCodeStats').collapsed = true;
			document.getElementById('oec-colCodeStats').setAttribute('ignoreincolumnpicker', true);
	  	document.getElementById('oec-actCodeStats').collapsed = true;
		} else {
			document.getElementById('oec-labelRef').setAttribute('style', 'margin-left:0px');
			document.getElementById('oec-reference').setAttribute('style', 'margin-left:0px');
		}
		
		var produitFrais = (result.responseXML.documentElement.getAttribute('Produit_Frais')=="1");
		if (!produitFrais) {
			document.getElementById('oec-colNumLot').collapsed = true;
			document.getElementById('oec-colNumLot').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oec-colNbPieces').collapsed = true;
			document.getElementById('oec-colNbPieces').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oec-colUnite').collapsed = true;
			document.getElementById('oec-colUnite').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oec-colDatePeremption').collapsed = true;
			document.getElementById('oec-colDatePeremption').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oec-produitFrais1').collapsed = true;
			document.getElementById('oec-produitFrais2').collapsed = true;
			document.getElementById('oec-produitFrais3').collapsed = true;
			document.getElementById('oec-produitFrais4').collapsed = true;
		}
		
		var commission = (result.responseXML.documentElement.getAttribute('Act_Commission')=="1");
		if (!commission) {
			document.getElementById('oec-colTauxCommission').collapsed = true;
			document.getElementById('oec-colTauxCommission').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oec-colMontantCommission').collapsed = true;
			document.getElementById('oec-colMontantCommission').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oec-actCommission').collapsed = true;
		}
		
		if (!calculStock) {
			document.getElementById('oec-colStock').setAttribute("hidden",true);
			document.getElementById('oec-colStock').setAttribute("ignoreincolumnpicker",true);
			document.getElementById('oec-colFournisseur').setAttribute("hidden",true);
			document.getElementById('oec-colFournisseur').setAttribute("ignoreincolumnpicker",true);
		}	
		
		oec_defEditionTTC = (result.responseXML.documentElement.getAttribute('Vente_TTC')=="1");
		oec_defModeExpedition = result.responseXML.documentElement.getAttribute('Def_Mode_Expedition');
		oec_modeTarif = result.responseXML.documentElement.getAttribute('Mode_Tarif');
		if (oec_modeTarif=='Q') {
			document.getElementById('oec-rowTarif').collapsed = true;
		}
		
		oec_aCodesTarifs.initTree(oec_initCodeTarif);

	} catch (e) {
  	recup_erreur(e);
	}
}

function oec_initCodeTarif() {
	try {
		document.getElementById('oec-codeTarif').selectedIndex=0;
		oec_aUnites.initTree(oec_initUnite);
	} catch (e) {
		recup_erreur(e);
	}
}

function oec_initUnite() {
	try {
    document.getElementById('oec-unite').selectedIndex = 0;
    oec_aModesExpedition.initTree(oec_initModeExpedition);
	} catch (e) {
    recup_erreur(e);
  }
}

function oec_initModeExpedition() {
	try {
		document.getElementById('oec-modeExpedition').selectedIndex=0;
		oec_aSecteurs.initTree(oec_initSecteur);
	} catch (e) {
		recup_erreur(e);
	}
}

function oec_initSecteur() {
	try {
		document.getElementById('oec-secteur').selectedIndex=0;
		oec_aPaysFact.initTree(oec_initPaysFact);
	} catch (e) {
		recup_erreur(e);
	}
}

function oec_initPaysFact() {
	try {
		document.getElementById('oec-codePaysFact').value = "FR";
		oec_aPaysLiv.initTree(oec_initPaysLiv);
	} catch (e) {
    recup_erreur(e);
  }
}

function oec_initPaysLiv() {
	try {
		document.getElementById('oec-codePaysLiv').value = "FR";
		oec_aPaysEnvoi.initTree(oec_initPaysEnvoi);
	} catch (e) {
    recup_erreur(e);
  }
}

function oec_initPaysEnvoi() {
	try {
		document.getElementById('oec-codePaysEnvoi').value = "FR";
		oec_chargerResponsables(get_cookie("User"));
	} catch (e) {
    recup_erreur(e);
  }
}


function oec_chargerModesReglements(selection) {
	try {
		oec_chargerModeReg = selection;
		oec_aModesReglements.setParam("Selection", oec_chargerModeReg);
		oec_aModesReglements.initTree(oec_initModeReglement);
	} catch (e) {
		recup_erreur(e);
	}
}

function oec_initModeReglement() {
	try {
		document.getElementById('oec-modeReglement').value=oec_chargerModeReg;
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_chargerResponsables(selection) {
	try {
		oec_chargerResponsable = selection;
		oec_aResponsables.setParam("Selection", oec_chargerResponsable);
		oec_aResponsables.initTree(oec_initResponsable);
	} catch (e) {
		recup_erreur(e);
	}
}

function oec_initResponsable() {
  try {
		document.getElementById('oec-responsable').value = oec_chargerResponsable;
		commandeInitialisee = true;
	} catch (e) {
  	recup_erreur(e);
	}
}



function oec_reinitialiser() {
	try {
		
		oec_charger = true;
		oec_modeLigne = "C";
		oec_zoneUE=false;
		
		oec_etatCommande = "";
		oec_soldee = false;
		oec_facturee = false;
		oec_assujettiTVA = false;
		oec_typeRemise = "P";
		oec_typeRemiseFP = "P";
		oec_editionTTC = oec_defEditionTTC;
		oec_editionPdf = "C";
		oec_editionInitiale = false;
		oec_premiereCommande = true;
		oec_defCommission = 0;
		oec_chargerModeReg="0";
		oec_chargerResponsable="0";
		oec_currentIndex=0;
		
		oec_montantHT = 0;
		oec_montantTTC = 0;
		
		oec_typeEditionPdf = "";
		oec_docIdPdf = "";
		
		document.getElementById('oec-deckCommande').selectedIndex = 0;
		document.getElementById('oec-tabBoxCommande').selectedIndex = 0;
		document.getElementById('oec-tabCommande').setAttribute('image', null);
		oec_aAcomptes.deleteTree();
		document.getElementById('oec-tabEncaissements').collapsed = true;
		document.getElementById('oec-caTTCFacture').value = "";
		document.getElementById('oec-caTTCPaye').value = "";
		document.getElementById('oec-pourcCATTCPaye').value = "";
		document.getElementById('oec-soldeAEncaisser').value = "";
		document.getElementById('oec-pourcSoldeAEncaisser').value = "";
		document.getElementById('oec-encoursAutorise').value = "0.00 \u20AC";
		document.getElementById('oec-encoursActuel').value = "0.00 \u20AC";
		document.getElementById('oec-gridEncoursClient').collapsed = false;
		oec_aListeReglements.deleteTree();
		document.getElementById('oec-boxReglement').collapsed=true;
		document.getElementById('oec-boxNouvelAcompte').collapsed=true;
		document.getElementById('oec-bAnnulerAcompte').disabled=true;
		document.getElementById('oec-bReediterAcompte').disabled=true;
		oec_aLiensColis.deleteTree();
		oec_aListeHistorique.deleteTree();
		
		document.getElementById('oec-tabVersionDocument').collapsed=true;
		oec_aVersion.deleteTree();
		
		document.getElementById('oec-caHT').value = "0.00 \u20AC";
		document.getElementById('oec-paHT').value = "0.00 \u20AC";
		document.getElementById('oec-margeHT').value = "0.00 \u20AC (0.00 %)";
		document.getElementById('oec-nbArticlesALivrer').value = "0";
		document.getElementById('oec-nbArticlesDejaLivres').value = "0";
		document.getElementById('oec-nbArticlesRestantALivrer').value = "0";
		document.getElementById('oec-avancementCommande').value = "0 %";
		document.getElementById('oec-lblMargeHT').setAttribute("style", "color:black");
		document.getElementById('oec-margeHT').setAttribute("style", "color:black");
		document.getElementById('oec-pictoMargeNegative').collapsed = true;
		
		oec_aModesReglements.deleteTree();
		oec_aResponsables.deleteTree();
		
		document.getElementById('oec-tabHistorique').collapsed = true;
		document.getElementById('oec-tabAcomptes').collapsed = true;
		document.getElementById('oec-tabColis').collapsed = true;
		document.getElementById('oec-numAffaire').value = "";
		document.getElementById('oec-numCommande').value = "";
		document.getElementById('oec-refCommande').value = "";
		document.getElementById('oec-dateCommande').value = "";
		document.getElementById('oec-poidsTotal').value = 0;
		document.getElementById('oec-secteur').selectedIndex = 0;
		document.getElementById('oec-dateDelai').value = "";
		document.getElementById('oec-numDevisOrigine').value = "";
		document.getElementById('oec-etatCommande').value = "";
		document.getElementById('oec-statutPaiement').value = "";
		document.getElementById('oec-modeExpedition').value = oec_defModeExpedition;
		document.getElementById('oec-clientId').value = "";
		document.getElementById('oec-labelClient').value = "";
		document.getElementById('oec-labelLogin').value = "";
		document.getElementById('oec-rowLoginWeb').collapsed = true;
		document.getElementById('oec-codeTarif').selectedIndex=0;
		document.getElementById('oec-assujettiTVA').checked = false;
		document.getElementById('oec-numTVA').value = "";
		document.getElementById('oec-regimeTVA').selectedIndex=0;
		document.getElementById('oec-editionTTC').checked = oec_editionTTC;
		document.getElementById('oec-indications').value = "";
		document.getElementById('oec-tabWeb').collapsed = true;
		document.getElementById('oec-numTransaction').value = "";
		document.getElementById('oec-siteOrigine').value = "";
		document.getElementById('oec-informations').value = "";
		
		document.getElementById('oec-tabBoxAdresses').selectedIndex = 0;
		document.getElementById('oec-denominationFact').value = "";
		document.getElementById('oec-adresse1Fact').value = "";
		document.getElementById('oec-adresse2Fact').value = "";
		document.getElementById('oec-adresse3Fact').value = "";
		document.getElementById('oec-codePostalFact').value = "";
		document.getElementById('oec-villeFact').value = "";
		document.getElementById('oec-codePaysFact').value = "FR";
		document.getElementById('oec-civInterFact').selectedIndex = 0;
		document.getElementById('oec-nomInterFact').value = "";
		document.getElementById('oec-prenomInterFact').value = "";
		document.getElementById('oec-telInterFact').value = "";
		document.getElementById('oec-faxInterFact').value = "";
		document.getElementById('oec-emailInterFact').value = "";
		document.getElementById('oec-denominationLiv').value = "";
		document.getElementById('oec-adresse1Liv').value = "";
		document.getElementById('oec-adresse2Liv').value = "";
		document.getElementById('oec-adresse3Liv').value = "";
		document.getElementById('oec-codePostalLiv').value = "";
		document.getElementById('oec-villeLiv').value = "";
		document.getElementById('oec-codePaysLiv').value = "FR";
		oec_calculerTvaPort();
		document.getElementById('oec-civInterLiv').selectedIndex = 0;
		document.getElementById('oec-nomInterLiv').value = "";
		document.getElementById('oec-prenomInterLiv').value = "";
		document.getElementById('oec-telInterLiv').value = "";
		document.getElementById('oec-faxInterLiv').value = "";
		document.getElementById('oec-emailInterLiv').value = "";
		document.getElementById('oec-denominationEnvoi').value = "";
		document.getElementById('oec-adresse1Envoi').value = "";
		document.getElementById('oec-adresse2Envoi').value = "";
		document.getElementById('oec-adresse3Envoi').value = "";
		document.getElementById('oec-codePostalEnvoi').value = "";
		document.getElementById('oec-villeEnvoi').value = "";
		document.getElementById('oec-codePaysEnvoi').value = "FR";
		document.getElementById('oec-civInterEnvoi').selectedIndex = 0;
		document.getElementById('oec-nomInterEnvoi').value = "";
		document.getElementById('oec-prenomInterEnvoi').value = "";
		document.getElementById('oec-telInterEnvoi').value = "";
		document.getElementById('oec-faxInterEnvoi').value = "";
		document.getElementById('oec-emailInterEnvoi').value = "";
		
		document.getElementById('oec-codeStats').value = "";
		document.getElementById('oec-reference').value = "";
		document.getElementById('oec-designation').value = "";
		document.getElementById('oec-numLot').value = "";
		document.getElementById('oec-nbPieces').value = "";
		document.getElementById('oec-quantite').value = "";
		document.getElementById('oec-unite').value = "U";
		document.getElementById('oec-datePeremption').value = "";
		document.getElementById('oec-PU').value = "";
		document.getElementById('oec-ristourne').value = "";
		document.getElementById('oec-commission').value = "";
		document.getElementById('oec-codeTVA').value = getCodeTvaNormal(document.getElementById('oec-codePaysLiv').value, oec_assujettiTVA, document.getElementById('oec-regimeTVA').value);
		
		document.getElementById('oec-commentairesFin').value = "";
		document.getElementById('oec-commentairesInt').value = "";
		document.getElementById('oec-modeReglement').selectedIndex = 0;
		document.getElementById('oec-bRemise').setAttribute('class', 'bIcoPourcentage');
		document.getElementById('oec-remise').value = "0.00";
		document.getElementById('oec-fraisPort').value = "0.00";
		document.getElementById('oec-bRemiseFP').setAttribute('class', 'bIcoPourcentage');
		document.getElementById('oec-remiseFP').value = "0.00";
		document.getElementById('oec-escompte').value = "0.00";
		oec_acompte = 0;
		
		document.getElementById('oec-colTotal').setAttribute("label", oec_editionTTC?"Total TTC":"Total HT");
		document.getElementById('oec-colPU').setAttribute("label", oec_editionTTC?"P.U TTC":"P.U HT");
		document.getElementById('oec-lblFraisPort').value = (oec_editionTTC?"Frais de port (ttc) :":"Frais de port (ht) :");
		document.getElementById('oec-lblPU').value = (oec_editionTTC?"P.U TTC :":"P.U HT :");
		document.getElementById('oec-piedTTC').collapsed = !oec_editionTTC;
		document.getElementById('oec-piedHT').collapsed = oec_editionTTC;
		document.getElementById('oec-montantHT').value = "0.00";
		document.getElementById('oec-montantRemise').value = "0.00";
		document.getElementById('oec-montantFraisPort').value = "0.00";
		document.getElementById('oec-montantRemiseFP').value = "0.00";
		document.getElementById('oec-totalHT').value = "0.00";
		document.getElementById('oec-commissionHT').value = "0.00";
		document.getElementById('oec-TVA').value = "0.00";
		document.getElementById('oec-montantTTC').value = "0.00";
		document.getElementById('oec-montantEscompte').value = "0.00";
		document.getElementById('oec-montantAcompte').value = "0.00";
		document.getElementById('oec-totalTTC').value = "0.00";
		document.getElementById('oec-pttcMontantTTC').value = "0.00";
		document.getElementById('oec-pttcMontantRemise').value = "0.00";
		document.getElementById('oec-pttcMontantFraisPort').value = "0.00";
		document.getElementById('oec-pttcMontantRemiseFP').value = "0.00";
		document.getElementById('oec-pttcTotalTTC').value = "0.00";
		document.getElementById('oec-pttcCommissionTTC').value = "0.00";
		document.getElementById('oec-pttcTVA').value = "0.00";
		document.getElementById('oec-pttcMontantEscompte').value = "0.00";
		document.getElementById('oec-pttcMontantAcompte').value = "0.00";
		document.getElementById('oec-pttcNetTTC').value = "0.00";
		
		document.getElementById('oec-rowRemiseHT').collapsed = true;
		document.getElementById('oec-rowRemiseFPHT').collapsed = true;
		document.getElementById('oec-rowCommissionHT').collapsed = true;
		document.getElementById('oec-rowMontantTTC').collapsed = true;
		document.getElementById('oec-rowEscompteHT').collapsed = true;
		document.getElementById('oec-rowRemiseTTC').collapsed = true;
		document.getElementById('oec-rowRemiseFPTTC').collapsed = true;
		document.getElementById('oec-rowCommissionTTC').collapsed = true;
		document.getElementById('oec-rowEscompteTTC').collapsed = true;
		
		document.getElementById('oec-creation').setAttribute("label", "");
		document.getElementById('oec-modification').setAttribute("label", "");
		document.getElementById('oec-fiche').setAttribute("label", "");
		
		oec_typeLigne = "";
		oec_tarifId = "";
		oec_ligneId = "";
		oec_libelle = "";
		oec_modifie = false;
		oec_bloque = false;
		
		document.getElementById('oec-refCommande').disabled = true;
		document.getElementById('oec-dateDelai').disabled = true;
		document.getElementById('oec-responsable').disabled = true;
		document.getElementById('oec-codeTarif').disabled = true;
		document.getElementById('oec-modeExpedition').disabled = true;
		document.getElementById('oec-secteur').disabled = true;
		document.getElementById('oec-assujettiTVA').disabled = true;
		document.getElementById('oec-numTVA').disabled = true;
		document.getElementById('oec-regimeTVA').disabled = true;
		document.getElementById('oec-editionTTC').disabled = true;
		document.getElementById('oec-bVoirFichier').disabled = true;
		document.getElementById('oec-indications').disabled = true;
		document.getElementById('oec-informations').disabled = true;
		document.getElementById('oec-bChercherClient').disabled = true;
		document.getElementById('oec-denominationFact').disabled = true;
		document.getElementById('oec-adresse1Fact').disabled = true;
		document.getElementById('oec-adresse2Fact').disabled = true;
		document.getElementById('oec-adresse3Fact').disabled = true;
		document.getElementById('oec-codePostalFact').disabled = true;
		document.getElementById('oec-villeFact').disabled = true;
		document.getElementById('oec-codePaysFact').disabled = true;
		document.getElementById('oec-civInterFact').disabled = true;
		document.getElementById('oec-nomInterFact').disabled = true;
		document.getElementById('oec-prenomInterFact').disabled = true;
		document.getElementById('oec-telInterFact').disabled = true;
		document.getElementById('oec-faxInterFact').disabled = true;
		document.getElementById('oec-emailInterFact').setAttribute('readonly', true);
		document.getElementById('oec-bChercherAdrFact').disabled = true;
		document.getElementById('oec-bChercherInter').disabled = true;
		document.getElementById('oec-bCopierFactVersLivEnvoi').disabled = true;
		document.getElementById('oec-denominationLiv').disabled = true;
		document.getElementById('oec-adresse1Liv').disabled = true;
		document.getElementById('oec-adresse2Liv').disabled = true;
		document.getElementById('oec-adresse3Liv').disabled = true;
		document.getElementById('oec-codePostalLiv').disabled = true;
		document.getElementById('oec-villeLiv').disabled = true;
		document.getElementById('oec-codePaysLiv').disabled = true;
		document.getElementById('oec-civInterLiv').disabled = true;
		document.getElementById('oec-nomInterLiv').disabled = true;
		document.getElementById('oec-prenomInterLiv').disabled = true;
		document.getElementById('oec-telInterLiv').disabled = true;
		document.getElementById('oec-faxInterLiv').disabled = true;
		document.getElementById('oec-emailInterLiv').setAttribute('readonly', true);
		document.getElementById('oec-bChercherAdrLiv').disabled = true;
		document.getElementById('oec-bChercherInterLiv').disabled = true;
		document.getElementById('oec-denominationEnvoi').disabled = true;
		document.getElementById('oec-adresse1Envoi').disabled = true;
		document.getElementById('oec-adresse2Envoi').disabled = true;
		document.getElementById('oec-adresse3Envoi').disabled = true;
		document.getElementById('oec-codePostalEnvoi').disabled = true;
		document.getElementById('oec-villeEnvoi').disabled = true;
		document.getElementById('oec-codePaysEnvoi').disabled = true;
		document.getElementById('oec-civInterEnvoi').disabled = true;
		document.getElementById('oec-nomInterEnvoi').disabled = true;
		document.getElementById('oec-prenomInterEnvoi').disabled = true;
		document.getElementById('oec-telInterEnvoi').disabled = true;
		document.getElementById('oec-faxInterEnvoi').disabled = true;
		document.getElementById('oec-emailInterEnvoi').setAttribute('readonly', true);
		document.getElementById('oec-bChercherAdrEnvoi').disabled = true;
		document.getElementById('oec-bChercherInterEnvoi').disabled = true;
		
		document.getElementById('oec-commentairesFin').disabled = true;
		document.getElementById('oec-commentairesInt').disabled = true;
		document.getElementById('oec-bOuvrirCommentairesCaches').disabled = true;
		document.getElementById('oec-bChoisirMentions').disabled = true;
		document.getElementById('oec-modeReglement').disabled = true;
		document.getElementById('oec-bRemise').disabled = true;
		document.getElementById('oec-remise').disabled = true;
		document.getElementById('oec-fraisPort').disabled = true;
		document.getElementById('oec-bRemiseFP').disabled = true;
		document.getElementById('oec-remiseFP').disabled = true;
		document.getElementById('oec-escompte').disabled = true;
		document.getElementById('oec-bAnnulerCommande').disabled = true;
		document.getElementById('oec-bEnregistrer').disabled = true;
		document.getElementById('oec-bValiderCommande').disabled = true;
		document.getElementById('oec-bSolder').disabled = true;
		document.getElementById('oec-bModifier').disabled = true;
		document.getElementById('oec-bBloquer').diabled = true;
		document.getElementById('oec-bDebloquer').disabled = true;
		document.getElementById('oec-bCloturer').diabled = true;
		document.getElementById('oec-bDecloturer').disabled = true;
		document.getElementById('oec-bModifier').collapsed = true;
		document.getElementById('oec-bBloquer').collapsed = true;
		document.getElementById('oec-bDebloquer').collapsed = true;
		document.getElementById('oec-bCloturer').collapsed = true;
		document.getElementById('oec-bDecloturer').collapsed = true;
		document.getElementById('oec-bVisualiser').disabled = true;
		document.getElementById('oec-bEditionInitiale').collapsed = true;
		document.getElementById('oec-bCopierCommande').collapsed = true;
		document.getElementById('oec-bProforma').collapsed = true;
		
		document.getElementById('oec-codeStats').disabled = true;
		document.getElementById('oec-reference').disabled = true;
		document.getElementById('oec-designation').disabled = true;
		document.getElementById('oec-numLot').disabled = true;
		document.getElementById('oec-nbPieces').disabled = true;
		document.getElementById('oec-quantite').disabled = true;
		document.getElementById('oec-unite').disabled = true;
		document.getElementById('oec-datePeremption').disabled = true;
		document.getElementById('oec-PU').disabled = true;
		document.getElementById('oec-ristourne').disabled = true;
		document.getElementById('oec-commission').disabled = true;
		document.getElementById('oec-codeTVA').disabled = true;
		document.getElementById('oec-bSupprimer').disabled = true;
		document.getElementById('oec-bFlecheHaut').disabled = true;
		document.getElementById('oec-bFlecheBas').disabled = true;
		document.getElementById('oec-bValider').disabled = true;
		document.getElementById('oec-bAnnuler').disabled = true;
		document.getElementById('oec-bArticle').disabled = true;
		document.getElementById('oec-bCommentaire').disabled = true;
		oec_aArticles.deleteTree();
		
		document.getElementById('oec-bSwitchPdf').setAttribute('label', 'Ordre de fabrication');
		document.getElementById('oec-bSwitchPdf').collapsed=false;
		document.getElementById('oec-pdfCommande').setAttribute('src', null);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_calculerTvaPort() {
	try {
		oec_codeTvaPort = getCodeTvaNormal(document.getElementById("oec-codePaysLiv").value,oec_assujettiTVA,document.getElementById("oec-regimeTVA").value);
		oec_tauxTvaPort = getTva(oec_codeTvaPort);
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_afficherNumAffaire() {
	try {
		
		var qGetNumAffaire = new QueryHttp("Facturation/Affaires/getNumAffaire.tmpl");
		qGetNumAffaire.setParam("Affaire_Id", affaireId);
		var result = qGetNumAffaire.execute();
		document.getElementById('oec-numAffaire').value = result.responseXML.documentElement.getAttribute("Num_Entier");

	} catch (e) {
		recup_erreur(e);
	}
}


function oec_initClient() {
	try {
		
		var qGetNumClient = new QueryHttp("Facturation/Affaires/getAffaire.tmpl");
		qGetNumClient.setParam("Affaire_Id", affaireId);
		var result = qGetNumClient.execute();
		var clientId = result.responseXML.documentElement.getAttribute("Client_Id");
		document.getElementById('oec-clientId').value = clientId;
		if (clientId!="") {
			oec_chargerCoord();
		} else {
			oec_chargerModesReglements("0");
			oec_chargerResponsables(result.responseXML.documentElement.getAttribute("Util_R"));
			document.getElementById('oec-denominationFact').value = result.responseXML.documentElement.getAttribute("Denomination");
			document.getElementById('oec-denominationLiv').value = result.responseXML.documentElement.getAttribute("Denomination");
			document.getElementById('oec-denominationEnvoi').value = result.responseXML.documentElement.getAttribute("Denomination");
			document.getElementById('oec-telInterFact').value = result.responseXML.documentElement.getAttribute("Telephone");
			document.getElementById('oec-telInterLiv').value = result.responseXML.documentElement.getAttribute("Telephone");
			document.getElementById('oec-telInterEnvoi').value = result.responseXML.documentElement.getAttribute("Telephone");
			document.getElementById('oec-faxInterFact').value = result.responseXML.documentElement.getAttribute("Fax");
			document.getElementById('oec-faxInterLiv').value = result.responseXML.documentElement.getAttribute("Fax");
			document.getElementById('oec-faxInterEnvoi').value = result.responseXML.documentElement.getAttribute("Fax");
			document.getElementById('oec-emailInterFact').value = result.responseXML.documentElement.getAttribute("Email");
			document.getElementById('oec-emailInterLiv').value = result.responseXML.documentElement.getAttribute("Email");
			document.getElementById('oec-emailInterEnvoi').value = result.responseXML.documentElement.getAttribute("Email");
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function oec_debloquerChamps() {
	try {
		document.getElementById('oec-refCommande').disabled = false;
		document.getElementById('oec-dateDelai').disabled = false;
		document.getElementById('oec-responsable').disabled = false;
		document.getElementById('oec-modeExpedition').disabled = false;
		document.getElementById('oec-secteur').disabled = false;
		document.getElementById('oec-assujettiTVA').disabled = !oec_premiereCommande;
		document.getElementById('oec-numTVA').disabled = !document.getElementById('oec-assujettiTVA').checked;
		document.getElementById('oec-regimeTVA').disabled = false;
		document.getElementById('oec-editionTTC').disabled = !oec_premiereCommande;
		document.getElementById('oec-indications').disabled = false;
		document.getElementById('oec-informations').disabled = false;
		document.getElementById('oec-bChercherClient').disabled = false;
		document.getElementById('oec-denominationFact').disabled = false;
		document.getElementById('oec-adresse1Fact').disabled = false;
		document.getElementById('oec-adresse2Fact').disabled = false;
		document.getElementById('oec-adresse3Fact').disabled = false;
		document.getElementById('oec-codePostalFact').disabled = false;
		document.getElementById('oec-villeFact').disabled = false;
		document.getElementById('oec-codePaysFact').disabled = false;
		document.getElementById('oec-civInterFact').disabled = false;
		document.getElementById('oec-nomInterFact').disabled = false;
		document.getElementById('oec-prenomInterFact').disabled = false;
		document.getElementById('oec-telInterFact').disabled = false;
		document.getElementById('oec-faxInterFact').disabled = false;
		document.getElementById('oec-emailInterFact').removeAttribute('readonly');
		document.getElementById('oec-bCopierFactVersLivEnvoi').disabled = false;
		document.getElementById('oec-codeTarif').disabled = false;
		document.getElementById('oec-denominationLiv').disabled = false;
		document.getElementById('oec-adresse1Liv').disabled = false;
		document.getElementById('oec-adresse2Liv').disabled = false;
		document.getElementById('oec-adresse3Liv').disabled = false;
		document.getElementById('oec-codePostalLiv').disabled = false;
		document.getElementById('oec-villeLiv').disabled = false;
		document.getElementById('oec-codePaysLiv').disabled = false;
		document.getElementById('oec-civInterLiv').disabled = false;
		document.getElementById('oec-nomInterLiv').disabled = false;
		document.getElementById('oec-prenomInterLiv').disabled = false;
		document.getElementById('oec-telInterLiv').disabled = false;
		document.getElementById('oec-faxInterLiv').disabled = false;
		document.getElementById('oec-emailInterLiv').removeAttribute('readonly');
		document.getElementById('oec-denominationEnvoi').disabled = false;
		document.getElementById('oec-adresse1Envoi').disabled = false;
		document.getElementById('oec-adresse2Envoi').disabled = false;
		document.getElementById('oec-adresse3Envoi').disabled = false;
		document.getElementById('oec-codePostalEnvoi').disabled = false;
		document.getElementById('oec-villeEnvoi').disabled = false;
		document.getElementById('oec-codePaysEnvoi').disabled = false;
		document.getElementById('oec-civInterEnvoi').disabled = false;
		document.getElementById('oec-nomInterEnvoi').disabled = false;
		document.getElementById('oec-prenomInterEnvoi').disabled = false;
		document.getElementById('oec-telInterEnvoi').disabled = false;
		document.getElementById('oec-faxInterEnvoi').disabled = false;
		document.getElementById('oec-emailInterEnvoi').removeAttribute('readonly');
		
		document.getElementById('oec-commentairesFin').disabled = false;
		document.getElementById('oec-commentairesInt').disabled = false;
		document.getElementById('oec-bChoisirMentions').disabled = false;
		document.getElementById('oec-modeReglement').disabled = false;
		document.getElementById('oec-bRemise').disabled = false;
		document.getElementById('oec-remise').disabled = false;
		document.getElementById('oec-fraisPort').disabled = false;
		document.getElementById('oec-bRemiseFP').disabled = false;
		document.getElementById('oec-remiseFP').disabled = false;
		document.getElementById('oec-escompte').disabled = false;
		document.getElementById('oec-bEnregistrer').disabled = false;
		
		document.getElementById('oec-codeStats').disabled = false;
		document.getElementById('oec-reference').disabled = false;
		document.getElementById('oec-designation').disabled = false;
		document.getElementById('oec-numLot').disabled = false;
		document.getElementById('oec-nbPieces').disabled = false;
		document.getElementById('oec-quantite').disabled = false;
		document.getElementById('oec-unite').disabled = false;
		document.getElementById('oec-datePeremption').disabled = false;
		document.getElementById('oec-PU').disabled = false;
		document.getElementById('oec-ristourne').disabled = false;
		document.getElementById('oec-commission').disabled = false;
		document.getElementById('oec-codeTVA').disabled = false;
		document.getElementById('oec-bValider').disabled = false;
		document.getElementById('oec-bAnnuler').disabled = false;
		document.getElementById('oec-bArticle').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_checkPremiereCommande() {
	try {
		var qGetInfosCommande = new QueryHttp("Facturation/Affaires/getNbCommandes.tmpl");
		qGetInfosCommande.setParam("Affaire_Id", affaireId);
		var result = qGetInfosCommande.execute();
		var contenu = result.responseXML.documentElement;
		var nbCommandes = parseIntBis(contenu.getAttribute("nbCommandes"));
		oec_premiereCommande = ((oec_mode=="C" && nbCommandes==0) || (oec_mode!="C" && nbCommandes==1));
		
		if (!oec_premiereCommande) {
			oec_assujettiTVA = (contenu.getAttribute("Assujetti_TVA")=="1");
			oec_editionTTC = (contenu.getAttribute("Edition_TTC")=="1");
			document.getElementById('oec-assujettiTVA').checked = oec_assujettiTVA;
			oec_listeTVA();
			document.getElementById('oec-numTVA').value = contenu.getAttribute("Num_TVA");
			document.getElementById('oec-editionTTC').checked = oec_editionTTC;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_nouvelleCommande() {
	try {
		oec_mode = "C";
		oec_reinitialiser();
		oec_afficherNumAffaire();
		oec_initClient();
		oec_checkPremiereCommande();
		oec_debloquerChamps();
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_chargerCommande() {
	try {
		oec_mode = "M";
		oec_reinitialiser();
		
		oec_aArticles.setParam("Commande_Id", commandeId);
		oec_aArticles.initTree(oec_chargerCommande2);
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_chargerCommande2() {
  try {
		
		var qGetCommande = new QueryHttp("Facturation/Affaires/getCommande.tmpl");
		qGetCommande.setParam("Commande_Id", commandeId);
		var result = qGetCommande.execute();

		var contenu = result.responseXML.documentElement;
		
		affaireId = contenu.getAttribute('Affaire_Id');
		
		oec_etatCommande = contenu.getAttribute("Etat");
		if (oec_etatCommande!='N' && oec_etatCommande!='Z') {
			oec_mode = "V";
		}
		
		oec_checkPremiereCommande();

		var numCommande = contenu.getAttribute('Num_Commande');
		document.getElementById('oec-numCommande').value = numCommande;
		
		oec_defCommission = contenu.getAttribute("Def_Commission");

		oec_soldee = (contenu.getAttribute('Soldee')=='1');
		oec_facturee = (contenu.getAttribute('Facturee')=='1');
		oec_typeRemise = (parseFloat(contenu.getAttribute('Montant_Remise'))!=0?'M':'P');
		document.getElementById('oec-remise').value = (oec_typeRemise=='P'?contenu.getAttribute('Remise'):contenu.getAttribute('Montant_Remise'));
		document.getElementById('oec-bRemise').setAttribute("class", (oec_typeRemise=='P'?"bIcoPourcentage":"bIcoEuro"));
		
		oec_typeRemiseFP = (parseFloat(contenu.getAttribute('MRemise_FP'))!=0?'M':'P');
		document.getElementById('oec-remiseFP').value = (oec_typeRemiseFP=='P'?contenu.getAttribute('PRemise_FP'):contenu.getAttribute('MRemise_FP'));
		document.getElementById('oec-bRemiseFP').setAttribute("class", (oec_typeRemiseFP=='P'?"bIcoPourcentage":"bIcoEuro"));
		
		document.getElementById('oec-escompte').value = contenu.getAttribute('Escompte');
		oec_acompte = contenu.getAttribute('Acompte');
		document.getElementById('oec-fraisPort').value = contenu.getAttribute('Frais_Port');
		document.getElementById('oec-commentairesFin').value = contenu.getAttribute('Commentaires_Fin');
		document.getElementById('oec-commentairesInt').value = contenu.getAttribute('Commentaires_Int');
		document.getElementById('oec-dateCommande').value = contenu.getAttribute('Date_Commande');
		document.getElementById('oec-refCommande').value = contenu.getAttribute('Ref_Commande');
		document.getElementById('oec-dateDelai').value = contenu.getAttribute('Delai');
		document.getElementById('oec-numDevisOrigine').value = contenu.getAttribute('Num_Devis_Origine');
		oec_chargerModesReglements(contenu.getAttribute('Mode_Reglement'));

		document.getElementById('oec-denominationFact').value = contenu.getAttribute('Denomination');
		document.getElementById('oec-adresse1Fact').value = contenu.getAttribute('Adresse_1');
		document.getElementById('oec-adresse2Fact').value = contenu.getAttribute('Adresse_2');
		document.getElementById('oec-adresse3Fact').value = contenu.getAttribute('Adresse_3');
		document.getElementById('oec-codePostalFact').value = contenu.getAttribute('Code_Postal');
		document.getElementById('oec-villeFact').value = contenu.getAttribute('Ville');
		document.getElementById('oec-codePaysFact').value = contenu.getAttribute('Code_Pays');
		document.getElementById('oec-civInterFact').value = contenu.getAttribute('Civ_Inter');
		document.getElementById('oec-nomInterFact').value = contenu.getAttribute('Nom_Inter');
		document.getElementById('oec-prenomInterFact').value = contenu.getAttribute('Prenom_Inter');
		document.getElementById('oec-telInterFact').value = contenu.getAttribute('Tel_Inter');
		document.getElementById('oec-faxInterFact').value = contenu.getAttribute('Fax_Inter');
		document.getElementById('oec-emailInterFact').value = contenu.getAttribute('Email_Inter');
		
		document.getElementById('oec-denominationLiv').value = contenu.getAttribute('Denomination_Liv');
		document.getElementById('oec-adresse1Liv').value = contenu.getAttribute('Adresse_1_Liv');
		document.getElementById('oec-adresse2Liv').value = contenu.getAttribute('Adresse_2_Liv');
		document.getElementById('oec-adresse3Liv').value = contenu.getAttribute('Adresse_3_Liv');
		document.getElementById('oec-codePostalLiv').value = contenu.getAttribute('Code_Postal_Liv');
		document.getElementById('oec-villeLiv').value = contenu.getAttribute('Ville_Liv');
		document.getElementById('oec-codePaysLiv').value = contenu.getAttribute('Code_Pays_Liv');
		document.getElementById('oec-civInterLiv').value = contenu.getAttribute('Civ_Inter_Liv');
		document.getElementById('oec-nomInterLiv').value = contenu.getAttribute('Nom_Inter_Liv');
		document.getElementById('oec-prenomInterLiv').value = contenu.getAttribute('Prenom_Inter_Liv');
		document.getElementById('oec-telInterLiv').value = contenu.getAttribute('Tel_Inter_Liv');
		document.getElementById('oec-faxInterLiv').value = contenu.getAttribute('Fax_Inter_Liv');
		document.getElementById('oec-emailInterLiv').value = contenu.getAttribute('Email_Inter_Liv');
		
		document.getElementById('oec-denominationEnvoi').value = contenu.getAttribute('Denomination_Envoi');
		document.getElementById('oec-adresse1Envoi').value = contenu.getAttribute('Adresse_1_Envoi');
		document.getElementById('oec-adresse2Envoi').value = contenu.getAttribute('Adresse_2_Envoi');
		document.getElementById('oec-adresse3Envoi').value = contenu.getAttribute('Adresse_3_Envoi');
		document.getElementById('oec-codePostalEnvoi').value = contenu.getAttribute('Code_Postal_Envoi');
		document.getElementById('oec-villeEnvoi').value = contenu.getAttribute('Ville_Envoi');
		document.getElementById('oec-codePaysEnvoi').value = contenu.getAttribute('Code_Pays_Envoi');
		document.getElementById('oec-civInterEnvoi').value = contenu.getAttribute('Civ_Inter_Envoi');
		document.getElementById('oec-nomInterEnvoi').value = contenu.getAttribute('Nom_Inter_Envoi');
		document.getElementById('oec-prenomInterEnvoi').value = contenu.getAttribute('Prenom_Inter_Envoi');
		document.getElementById('oec-telInterEnvoi').value = contenu.getAttribute('Tel_Inter_Envoi');
		document.getElementById('oec-faxInterEnvoi').value = contenu.getAttribute('Fax_Inter_Envoi');
		document.getElementById('oec-emailInterEnvoi').value = contenu.getAttribute('Email_Inter_Envoi');

		document.getElementById('oec-codeTarif').value = contenu.getAttribute('Code_Tarif');
		document.getElementById('oec-regimeTVA').value = contenu.getAttribute('Regime_TVA');
		oec_codeTvaPort = contenu.getAttribute('Code_TVA_Port');
		oec_tauxTvaPort = contenu.getAttribute('Taux_TVA_Port');
		oec_assujettiTVA = (contenu.getAttribute('Assujetti_TVA')=="1");
		oec_bloque = (contenu.getAttribute('Bloque')=="1");
		oec_selectPaysLiv();
		
		var typeEdition = (contenu.getAttribute('Edition_TTC')=="1");
		
		document.getElementById('oec-editionTTC').checked = typeEdition;
		
		document.getElementById('oec-assujettiTVA').checked = oec_assujettiTVA;
		document.getElementById('oec-numTVA').value = contenu.getAttribute("Num_TVA_Intra");

		var clientId = contenu.getAttribute('Client_Id');
		document.getElementById('oec-clientId').value = clientId;
		var clientConnu = (clientId!="");
		
		oec_chargerResponsables(contenu.getAttribute('Util_R'));

		document.getElementById('oec-creation').setAttribute("label", "Commande créée le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur'));
		document.getElementById('oec-modification').setAttribute("label", "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj'));
		document.getElementById('oec-fiche').setAttribute("label", "Commande N° "+ numCommande);
		document.getElementById('oec-creation').collapsed = false;
		document.getElementById('oec-modification').collapsed = false;
			
		var libelleEtat = "";
		if (oec_etatCommande=="N") { libelleEtat = "Non validée"; }
		else if (oec_etatCommande=="C") { libelleEtat = "Clôturée"; }
		else if (oec_etatCommande=="A") { libelleEtat = "Annulée"; }
		else if (oec_etatCommande=="Z") { libelleEtat = "Non aboutie"; }
		else if (oec_etatCommande=="T") { libelleEtat = "En cours"; }
		document.getElementById('oec-etatCommande').value = libelleEtat;
		
		var existeFacture = (contenu.getAttribute("Existe_Facture")=="true");
		var acomptePossible = ((oec_etatCommande=="N" || (oec_etatCommande=="T" && !existeFacture)) && contenu.getAttribute("Autoriser_Acompte")=="true");
		document.getElementById('oec-boxNouvelAcompte').collapsed=!acomptePossible;
		
		var statutPaiement = contenu.getAttribute("Statut_Paiement");
		var libelleStatutPaiement = "";
		if (statutPaiement=="0") { libelleStatutPaiement = "Non payée"; }
		else if (statutPaiement=="1") { libelleStatutPaiement = "Payée"; }
		else if (statutPaiement=="2") { libelleStatutPaiement = "Part. payée"; }
		document.getElementById('oec-statutPaiement').value = libelleStatutPaiement;
		document.getElementById('oec-modeExpedition').value = contenu.getAttribute('Mode_Expedition');
		document.getElementById('oec-secteur').value = contenu.getAttribute('Secteur_Activite');
		
		// Infos spécifiques Web
		document.getElementById('oec-rowLoginWeb').collapsed = (contenu.getAttribute('Web')=="0");
		document.getElementById('oec-labelLogin').value = contenu.getAttribute('Login_Web');
		document.getElementById('oec-tabWeb').collapsed = (contenu.getAttribute('Web')=="0");
		document.getElementById('oec-numTransaction').value = contenu.getAttribute('Num_Transaction');
		document.getElementById('oec-informations').value = contenu.getAttribute('Infos_Commande');
		document.getElementById('oec-siteOrigine').value = contenu.getAttribute('Nom_Site');
		// Acomptes
		oec_aAcomptes.setParam("Commande_Id", commandeId);
		oec_aAcomptes.initTree();
		
		// Encaissements
		if (oec_etatCommande!="N") {
			var existeAcompte = (contenu.getAttribute("Existe_Acompte")=="true");
			document.getElementById('oec-boxReglement').collapsed = (existeFacture || existeAcompte || oec_etatCommande!="T");
			document.getElementById('oec-tabEncaissements').collapsed = false;
			document.getElementById('oec-caTTCFacture').value = contenu.getAttribute("CA_TTC_Facture");
			document.getElementById('oec-caTTCPaye').value = contenu.getAttribute("CA_TTC_Paye");
			document.getElementById('oec-pourcCATTCPaye').value = contenu.getAttribute("Pourc_CA_TTC_Paye");
			document.getElementById('oec-soldeAEncaisser').value = contenu.getAttribute("Solde_A_Encaisser");
			document.getElementById('oec-pourcSoldeAEncaisser').value = contenu.getAttribute("Pourc_Solde_A_Encaisser");
			
			document.getElementById('oec-encoursAutorise').value = contenu.getAttribute("En_Cours_Autorise") + " \u20AC";
			document.getElementById('oec-encoursActuel').value = contenu.getAttribute("En_Cours_Actuel") + " \u20AC";
			
			if (!clientConnu) { document.getElementById('oec-gridEncoursClient').collapsed = true; }
			
			oec_aListeReglements.setParam("Commande_Id", commandeId);
			oec_aListeReglements.initTree();
			
			document.getElementById('oec-tabHistorique').collapsed = false;
			oec_aListeHistorique.setParam("Commande_Id", commandeId);
			oec_aListeHistorique.initTree();
		}
		
		// Récapitulatif
		document.getElementById('oec-caHT').value = contenu.getAttribute("CAHT") + " \u20AC";
		document.getElementById('oec-paHT').value = contenu.getAttribute("PAHT") + " \u20AC";
		document.getElementById('oec-margeHT').value = contenu.getAttribute("Marge_HT") + " \u20AC ("+ contenu.getAttribute("Pourc_Marge_HT") +" %)";
		document.getElementById('oec-nbArticlesALivrer').value = contenu.getAttribute("Nb_Articles_A_Livrer");
		document.getElementById('oec-nbArticlesDejaLivres').value = contenu.getAttribute("Nb_Articles_Deja_Livres");
		document.getElementById('oec-nbArticlesRestantALivrer').value = contenu.getAttribute("Nb_Articles_Restant_A_Livrer");
		document.getElementById('oec-avancementCommande').value = contenu.getAttribute("Avancement_Commande") + " %";
		if (contenu.getAttribute("Marge_Negative")=="true") {
			document.getElementById('oec-lblMargeHT').setAttribute("style", "color:red");
			document.getElementById('oec-margeHT').setAttribute("style", "color:red");
			document.getElementById('oec-pictoMargeNegative').collapsed = false;
		}
		
		// Indications de commande client
		if (clientConnu) {
			document.getElementById('oec-labelClient').setAttribute("value", clientId);
			
			var qIndications = new QueryHttp("Facturation/Commun/getIndicationsCommandeClient.tmpl");
			qIndications.setParam("Client_Id", clientId);
			var result = qIndications.execute();
			document.getElementById('oec-indications').value = result.responseXML.documentElement.getAttribute("Indications");
		}
		
		// Infos spécifiques Colis
		var qExisteColis = new QueryHttp("Facturation/Affaires/existeColis.tmpl");
		qExisteColis.setParam("Commande_Id", commandeId);
		var result = qExisteColis.execute();
		if (result.responseXML.documentElement.getAttribute("existe")=="true") {
			oec_aLiensColis.setParam("Commande_Id", commandeId);
			oec_aLiensColis.initTree();
			document.getElementById('oec-tabColis').collapsed = false;
		}
		
		document.getElementById('oec-tabVersionDocument').collapsed=false;
		oec_initVersion();
		
		oec_modifie = false;
		document.getElementById('oec-tabCommande').setAttribute('image', null);
		
		if (oec_mode == "V") {
			document.getElementById('oec-bSolder').disabled = (oec_etatCommande!='T' || oec_soldee);
			document.getElementById('oec-bModifier').disabled = (oec_etatCommande!='T');
			document.getElementById('oec-bModifier').collapsed = (oec_etatCommande!='T');
		} else {
			oec_debloquerChamps();
			document.getElementById('oec-bChercherAdrFact').disabled = !clientConnu;
			document.getElementById('oec-bChercherInter').disabled = !clientConnu;
			document.getElementById('oec-bChercherAdrLiv').disabled = !clientConnu;
			document.getElementById('oec-bChercherInterLiv').disabled = !clientConnu;
			document.getElementById('oec-bChercherAdrEnvoi').disabled = !clientConnu;
			document.getElementById('oec-bChercherInterEnvoi').disabled = !clientConnu;
			document.getElementById('oec-bValiderCommande').disabled = false;
			document.getElementById('oec-numTVA').disabled = !oec_assujettiTVA;
			oec_ajouterLigne("I");
		}
		document.getElementById('oec-bVoirFichier').disabled = false;
		document.getElementById('oec-bAnnulerCommande').disabled = (oec_etatCommande=="A" || oec_etatCommande=="C");
		document.getElementById('oec-bOuvrirCommentairesCaches').disabled = false;
		document.getElementById('oec-bVisualiser').disabled = false;
		document.getElementById('oec-bEditionInitiale').collapsed = (oec_etatCommande=="N" || oec_etatCommande=="Z");
		document.getElementById('oec-bCopierCommande').collapsed = false;
		document.getElementById('oec-bProforma').collapsed = (oec_etatCommande=="A" || oec_etatCommande=="C");
	
		document.getElementById('oec-bBloquer').disabled = ((oec_etatCommande!='T' && oec_etatCommande!='N') || oec_bloque);
		document.getElementById('oec-bBloquer').collapsed = ((oec_etatCommande!='T' && oec_etatCommande!='N') || oec_bloque);
		document.getElementById('oec-bDebloquer').disabled = ((oec_etatCommande!='T' && oec_etatCommande!='N') || !oec_bloque);
		document.getElementById('oec-bDebloquer').collapsed = ((oec_etatCommande!='T' && oec_etatCommande!='N') || !oec_bloque);

		document.getElementById('oec-bCloturer').disabled = (oec_etatCommande=='C' || !oec_soldee || !oec_facturee);
		document.getElementById('oec-bCloturer').collapsed = (oec_etatCommande=='C' || !oec_soldee || !oec_facturee);
		document.getElementById('oec-bDecloturer').disabled = (oec_etatCommande!='C');
		document.getElementById('oec-bDecloturer').collapsed = (oec_etatCommande!='C');
		
		document.getElementById('oec-tabAcomptes').collapsed = false;

		oec_changerTypeEdition(typeEdition);
		
		oec_calculerPoids();
		oec_afficherNumAffaire();
		

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_formatLigne(typeLigne) {
  try {

		switch(typeLigne) {
			case "S":
				document.getElementById('oec-codeStats').disabled = false;
				document.getElementById('oec-reference').disabled = true;
				document.getElementById('oec-designation').disabled = true;
				document.getElementById('oec-numLot').disabled = false;
				document.getElementById('oec-nbPieces').disabled = false;
				document.getElementById('oec-quantite').disabled = false;
				document.getElementById('oec-unite').disabled = false;
				document.getElementById('oec-datePeremption').disabled = false;
				document.getElementById('oec-PU').disabled = false;
				document.getElementById('oec-ristourne').disabled = false;
				document.getElementById('oec-commission').disabled = false;
				document.getElementById('oec-codeTVA').disabled = false;
				document.getElementById('oec-bValider').disabled = false;
				document.getElementById('oec-bAnnuler').disabled = false;
				break;

			case "I":
				document.getElementById('oec-codeStats').disabled = false;
				document.getElementById('oec-reference').disabled = false;
				document.getElementById('oec-designation').disabled = false;
				document.getElementById('oec-numLot').disabled = false;
				document.getElementById('oec-nbPieces').disabled = false;
				document.getElementById('oec-quantite').disabled = false;
				document.getElementById('oec-unite').disabled = false;
				document.getElementById('oec-datePeremption').disabled = false;
				document.getElementById('oec-PU').disabled = false;
				document.getElementById('oec-ristourne').disabled = false;
				document.getElementById('oec-commission').disabled = false;
				document.getElementById('oec-codeTVA').disabled = false;
				document.getElementById('oec-bValider').disabled = false;
				document.getElementById('oec-bAnnuler').disabled = false;
				break;

			default:
				document.getElementById('oec-codeStats').value = "";
				document.getElementById('oec-reference').value = "";
				document.getElementById('oec-designation').value = "";
				document.getElementById('oec-numLot').value = "";
				document.getElementById('oec-nbPieces').value = "";
				document.getElementById('oec-quantite').value = "";
				document.getElementById('oec-unite').value = "U";
				document.getElementById('oec-datePeremption').value = "";
				document.getElementById('oec-PU').value = "";
				document.getElementById('oec-ristourne').value = "";
				document.getElementById('oec-commission').value = "";
				oec_libelle = "";
				oec_ligneId = "";
				document.getElementById('oec-codeTVA').value = getCodeTvaNormal(document.getElementById('oec-codePaysLiv').value, oec_assujettiTVA, document.getElementById('oec-regimeTVA').value);
				document.getElementById('oec-codeStats').disabled = true;
				document.getElementById('oec-reference').disabled = true;
				document.getElementById('oec-designation').disabled = true;
				document.getElementById('oec-numLot').disabled = true;
				document.getElementById('oec-nbPieces').disabled = true;
				document.getElementById('oec-quantite').disabled = true;
				document.getElementById('oec-unite').disabled = true;
				document.getElementById('oec-datePeremption').disabled = true;
				document.getElementById('oec-PU').disabled = true;
				document.getElementById('oec-ristourne').disabled = true;
				document.getElementById('oec-commission').disabled = true;
				document.getElementById('oec-codeTVA').disabled = true;
				document.getElementById('oec-bCommentaire').disabled = true;
				document.getElementById('oec-bSupprimer').disabled = true;
				document.getElementById('oec-bFlecheHaut').disabled = true;
				document.getElementById('oec-bFlecheBas').disabled = true;
				document.getElementById('oec-bValider').disabled = true;
				document.getElementById('oec-bAnnuler').disabled = true;
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}



function oec_selectPaysLiv() {
	try {
		if (oec_charger) {
			oec_listeTVA();
		}
    oec_changerTypeVente();
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_listeTVA() {
  try {
  	oec_calculTotaux();
    
    oec_aCodesTVA.setParam("Code_Pays", document.getElementById("oec-codePaysLiv").value);
    oec_aCodesTVA.setParam("Regime_TVA", document.getElementById("oec-regimeTVA").value);
    oec_aCodesTVA.setParam("Assujetti_TVA", oec_assujettiTVA?"1":"0");
    oec_aCodesTVA.initTree(oec_selectTVA);
  } catch (e) {
    recup_erreur(e);
  }
}


function oec_selectTVA() {
  try {
    document.getElementById('oec-codeTVA').value = getCodeTvaNormal(document.getElementById('oec-codePaysLiv').value, oec_assujettiTVA, document.getElementById('oec-regimeTVA').value);
  } catch (e) {
    recup_erreur(e);
  }
}



function oec_switchRemise() {
	try {

		if (oec_typeRemise=='P') {
			document.getElementById('oec-bRemise').setAttribute("class", "bIcoEuro");
			oec_typeRemise = 'M';
		}
		else {
			document.getElementById('oec-bRemise').setAttribute("class", "bIcoPourcentage");
			oec_typeRemise = 'P';
		}
		oec_calculTotaux();
		oec_setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_switchRemiseFP() {
	try {

		if (oec_typeRemiseFP=='P') {
			document.getElementById('oec-bRemiseFP').setAttribute("class", "bIcoEuro");
			oec_typeRemiseFP = 'M';
		}
		else {
			document.getElementById('oec-bRemiseFP').setAttribute("class", "bIcoPourcentage");
			oec_typeRemiseFP = 'P';
		}
		oec_calculTotaux();
		oec_setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_afficherFichiers() {
	try {
	
    var ok = true;
		if (oec_mode=="C") {
			ok = oec_enregistrerCommande(true);
		}

		if (ok) {
  	  var url = "chrome://opensi/content/facturation/user/recherches/rech_fichiers.xul?"+ cookie() +"&Type=Commande_Client&Document_Id="+ commandeId;
    	window.openDialog(url,'','chrome,modal,centerscreen');
    }
		
	} catch (e) {
    recup_erreur(e);
  }
}


function oec_ajouterLigne(typeLigne) {
  try {
  	
  	document.getElementById('oec-bSupprimer').disabled = true;
  	document.getElementById('oec-bCommentaire').disabled = true;
		document.getElementById('oec-bFlecheHaut').disabled = true;
		document.getElementById('oec-bFlecheBas').disabled = true;

		oec_modeLigne = "C";

		oec_typeLigne = typeLigne;
		oec_ligneId = "";

		oec_formatLigne(typeLigne);

		switch(typeLigne) {
			case "S":

				var reference = document.getElementById('oec-reference').value;

				if (!isEmpty(reference)) {

					if (oec_modeTarif=='Q') {

						var url = "chrome://opensi/content/facturation/user/commun/popup-choixTarif.xul?"+ cookie() +"&Article_Id="+ urlEncode(reference);
    				window.openDialog(url,'','chrome,modal,centerscreen', oec_reporterTarifId);

						var tarifId = oec_tarifId;

						if (!isEmpty(tarifId)) {

							var qGetArticleQte = new QueryHttp("Facturation/Affaires/getArticleQte.tmpl");
							qGetArticleQte.setParam("Article_Id", reference);
							qGetArticleQte.setParam("Tarif_Id", tarifId);
							qGetArticleQte.setParam("Type_Prix", oec_editionTTC?"TTC":"HT");

							var result = qGetArticleQte.execute();
							var contenu = result.responseXML.documentElement;

							document.getElementById('oec-codeStats').value = contenu.getAttribute("Code_Stats");
							document.getElementById('oec-designation').value = contenu.getAttribute("Designation");
							document.getElementById('oec-numLot').value = "";
							document.getElementById('oec-nbPieces').value = "";
							document.getElementById('oec-quantite').value = contenu.getAttribute("Quantite");
							document.getElementById('oec-unite').value = contenu.getAttribute("Unite");
							document.getElementById('oec-datePeremption').value = "";
							document.getElementById('oec-PU').value = contenu.getAttribute("Prix");
							document.getElementById('oec-ristourne').value = "0.00";
							document.getElementById('oec-commission').value = oec_defCommission;
							document.getElementById('oec-codeTVA').value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"), document.getElementById('oec-codePaysLiv').value, oec_assujettiTVA, document.getElementById('oec-regimeTVA').value);
							oec_tarifId = "";
							oec_libelle = contenu.getAttribute("Libelle");
						}
						else {
							oec_ajouterLigne("I");
						}
					}
					else {
						
						var qGetArticleTarif = new QueryHttp("Facturation/Affaires/getArticleTarif.tmpl");
						qGetArticleTarif.setParam("Article_Id", reference);
						qGetArticleTarif.setParam("Code_Tarif", document.getElementById('oec-codeTarif').value);
						qGetArticleTarif.setParam("Type_Prix", oec_editionTTC?"TTC":"HT");
						
						var clientId = document.getElementById('oec-clientId').value;
						if (!isEmpty(clientId)) {
							qGetArticleTarif.setParam("Client_Id", clientId);
						}

						var result = qGetArticleTarif.execute();
						var contenu = result.responseXML.documentElement;

						document.getElementById('oec-codeStats').value = contenu.getAttribute("Code_Stats");
						document.getElementById('oec-designation').value = contenu.getAttribute("Designation");
						document.getElementById('oec-numLot').value = "";
						document.getElementById('oec-nbPieces').value = "";
						document.getElementById('oec-quantite').value = 1;
						document.getElementById('oec-unite').value = contenu.getAttribute("Unite");
						document.getElementById('oec-datePeremption').value = "";
						document.getElementById('oec-PU').value = contenu.getAttribute("Prix");
						document.getElementById('oec-ristourne').value = "0.00";
						document.getElementById('oec-commission').value = oec_defCommission;
						document.getElementById('oec-codeTVA').value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"), document.getElementById('oec-codePaysLiv').value, oec_assujettiTVA, document.getElementById('oec-regimeTVA').value);
						oec_libelle = "";
					}
				}
				else {
					oec_ajouterLigne("I");
				}

				break;

			case "I":

				document.getElementById('oec-codeStats').value = "";
				document.getElementById('oec-reference').value = "";
				document.getElementById('oec-designation').value = "";
				document.getElementById('oec-numLot').value = "";
				document.getElementById('oec-nbPieces').value = "";
				document.getElementById('oec-quantite').value = 1;
				document.getElementById('oec-unite').value = "U";
				document.getElementById('oec-datePeremption').value = "";
				document.getElementById('oec-PU').value = "";
				document.getElementById('oec-ristourne').value = "0.00";
				document.getElementById('oec-commission').value = oec_defCommission;
				document.getElementById('oec-codeTVA').value = getCodeTvaNormal(document.getElementById('oec-codePaysLiv').value, oec_assujettiTVA, document.getElementById('oec-regimeTVA').value);
				oec_libelle = "";
				document.getElementById('oec-reference').focus();
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_pressOnWindow(ev) {
	try {

		if (ev.altKey && oec_mode!="V") {
			switch(ev.charCode) {
      	case 97: // 'a'
					oec_rechercherStock();
        	break;
				case 116: // 't'
					oec_modifierTarif();
					break;
    	}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_pressOnQuantite(ev) {
	try {
		
		if (ev.keyCode==13) {
			oec_validerLigne();
		}
		
	} catch (e) {
    recup_erreur(e);
  }
}


function oec_pressOnReference(ev) {
	try {

		if (ev.keyCode==13) {
			oec_rechercherReference();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_rechercherStock(reference) {
	try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		if (oec_modeTarif != "Q") {
			url += "&Code_Tarif=" + document.getElementById('oec-codeTarif').value;
		}
		if (reference != null) { url += "&Reference="+ urlEncode(reference); }
    window.openDialog(url,'','chrome,modal,centerscreen',oec_retourRechercherStock);

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_retourRechercherStock(reference) {
	try {
	
		document.getElementById('oec-reference').value = reference;
		oec_ajouterLigne("S");
	
	} catch (e) {
    recup_erreur(e);
  }
}


function oec_rechercherReference() {
	try {
		
		var reference = document.getElementById('oec-reference').value;

		var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
		qExArt.setParam("Reference", reference);
		var result = qExArt.execute();
		
		var articleId = result.responseXML.documentElement.getAttribute("Article_Id");
		
		if (!isEmpty(articleId)) {
			document.getElementById('oec-reference').value = articleId;
			oec_ajouterLigne("S");
		} else {
			oec_rechercherStock(reference);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_modifierTarif() {
	try {

		if (oec_modeLigne = "M" && oec_typeLigne=='S') {

			if (oec_modeTarif=='Q') {

				var reference = document.getElementById('oec-reference').value;

				var url = "chrome://opensi/content/facturation/user/commun/popup-choixTarif.xul?"+ cookie() +"&Article_Id="+ urlEncode(reference);
    		window.openDialog(url,'','chrome,modal,centerscreen', oec_reporterTarifId);

				var tarifId = oec_tarifId;

				if (!isEmpty(tarifId)) {

					var qGetArticleQte = new QueryHttp("Facturation/Affaires/getArticleQte.tmpl");
					qGetArticleQte.setParam("Article_Id", reference);
					qGetArticleQte.setParam("Tarif_Id", tarifId);
					qGetArticleQte.setParam("Type_Prix", oec_editionTTC?"TTC":"HT");

					var result = qGetArticleQte.execute();
					var contenu = result.responseXML.documentElement;

					document.getElementById('oec-quantite').value = contenu.getAttribute("Quantite");
					document.getElementById('oec-unite').value = contenu.getAttribute("Unite");
					document.getElementById('oec-PU').value = contenu.getAttribute("Prix");
					oec_tarifId = "";
					oec_libelle = contenu.getAttribute("Libelle");
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_reporterTarifId(tarifId) {
	try {
		oec_tarifId = tarifId;
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_ouvrirLigne() {
  try {

		if (oec_aArticles.isSelected()) {
			var i = oec_aArticles.getCurrentIndex();
			oec_currentIndex = i;
			
			document.getElementById('oec-bFlecheHaut').disabled = true;
			document.getElementById('oec-bFlecheBas').disabled = true;
			
			if (oec_mode=="M") {
				if (oec_aArticles.getCellText(i,'oec-colTypeLigne')=="C") {
					oec_ajouterLigne("I");
				}
				else {
					oec_modeLigne = "M";
					document.getElementById('oec-bCommentaire').disabled = false;
					document.getElementById('oec-bSupprimer').disabled = false;
	
					document.getElementById('oec-codeStats').value = oec_aArticles.getCellText(i,'oec-colCodeStats');
					document.getElementById('oec-reference').value = oec_aArticles.getCellText(i,'oec-colReference');
					document.getElementById('oec-designation').value = oec_aArticles.getCellText(i,'oec-colDesignation');
					document.getElementById('oec-numLot').value = oec_aArticles.getCellText(i,'oec-colNumLot');
					document.getElementById('oec-nbPieces').value = oec_aArticles.getCellText(i,'oec-colNbPieces');
					document.getElementById('oec-quantite').value = oec_aArticles.getCellText(i,'oec-colQuantite');
					document.getElementById('oec-unite').value = oec_aArticles.getCellText(i,'oec-colUnite');
					document.getElementById('oec-datePeremption').value = oec_aArticles.getCellText(i,'oec-colDatePeremption');
					document.getElementById('oec-PU').value = oec_aArticles.getCellText(i,'oec-colPU');
					document.getElementById('oec-codeTVA').value = oec_aArticles.getCellText(i,'oec-colCodeTVA');
					document.getElementById('oec-ristourne').value = oec_aArticles.getCellText(i,'oec-colRistourne');
					document.getElementById('oec-commission').value = oec_aArticles.getCellText(i,'oec-colTauxCommission');
					oec_typeLigne = oec_aArticles.getCellText(i,'oec-colTypeLigne');
					oec_ligneId = oec_aArticles.getCellText(i,'oec-colLigneId');
					oec_libelle = oec_aArticles.getCellText(i,'oec-colLibelle');
					
					oec_formatLigne(oec_typeLigne);
				}
			}
			
			if (oec_mode!="C" && oec_etatCommande!="C" && oec_aArticles.getCellText(i,'oec-colTypeLigne')!="C") {
				// on ignore les lignes de commentaires
				var firstIndex = 0;
				var lastIndex = oec_aArticles.nbLignes()-1;
				if (oec_aArticles.getCellText(firstIndex,'oec-colTypeLigne')=="C") { firstIndex++; }
				if (oec_aArticles.getCellText(lastIndex,'oec-colTypeLigne')=="C") { lastIndex--; }
				
				document.getElementById('oec-bFlecheHaut').disabled = (i==firstIndex);
				document.getElementById('oec-bFlecheBas').disabled = (i==lastIndex);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_ouvrirCommentaire() {
  try {

		if (oec_aArticles.isSelected() && oec_mode=="M") {
			var i = oec_aArticles.getCurrentIndex();
			if (oec_aArticles.getCellText(i,'oec-colTypeLigne')=="C") {
				oec_editerCommentaire();
			} else if ((oec_etatCommande=="T" && oec_aArticles.getCellText(i,'oec-colTypeLigne')!="C")
					|| ((oec_etatCommande=="N" || oec_etatCommande=="Z") && oec_aArticles.getCellText(i,'oec-colTypeLigne')=="I")) {
				oec_editerPrixAchat();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_deplacerLigneBas() {
	try {
		oec_deplacerLigne("Bas");
	} catch (e) {
		recup_erreur(e);
	}
}

function oec_deplacerLigneHaut() {
	try {
		oec_deplacerLigne("Haut");
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_deplacerLigne(type) {
	try {
		if (oec_aArticles.isSelected() && oec_mode!="C" && oec_etatCommande!="C") {
			var i = oec_aArticles.getCurrentIndex();
			if (oec_aArticles.getCellText(i,'oec-colTypeLigne')!="C") {
				var ligneId = oec_aArticles.getCellText(i,'oec-colLigneId');
				var qDeplacerLigne = new QueryHttp("Facturation/Affaires/deplacerLigneCommande.tmpl");
				qDeplacerLigne.setParam("Ligne_Id", ligneId);
				qDeplacerLigne.setParam("Deplacement", type);
				qDeplacerLigne.execute();
				
				oec_ajouterLigne("I");
				oec_aArticles.deleteTree();
				oec_initTree2();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_validerLigne() {
  try {

		var codeStats = document.getElementById('oec-codeStats').value;
		var reference = document.getElementById('oec-reference').value;
		var designation = document.getElementById('oec-designation').value;
		var numLot = document.getElementById('oec-numLot').value;
		var nbPieces = document.getElementById('oec-nbPieces').value;
		var quantite = document.getElementById('oec-quantite').value;
		var unite = document.getElementById('oec-unite').value;
		var datePeremption = document.getElementById('oec-datePeremption').value;
		var pu = document.getElementById('oec-PU').value;
		var ristourne = document.getElementById('oec-ristourne').value;
		var commission = document.getElementById('oec-commission').value;
		var codeTVA = document.getElementById('oec-codeTVA').value;
		var ok = true;

		if (oec_mode=="C") {
			ok = oec_enregistrerCommande(false);
		}

		if (ok) {
			var qValiderLigne;
			if (oec_modeLigne=="C") {
				qValiderLigne = new QueryHttp("Facturation/Affaires/ajouterArticleCommande.tmpl");
				qValiderLigne.setParam("Type_Ligne", oec_typeLigne);
			}
			else {
				qValiderLigne = new QueryHttp("Facturation/Affaires/modifierArticleCommande.tmpl");
				qValiderLigne.setParam("Ligne_Id", oec_ligneId);
			}
			qValiderLigne.setParam("Reference", reference);
			qValiderLigne.setParam("Designation", designation);
			qValiderLigne.setParam("Quantite", quantite);
			qValiderLigne.setParam("Prix", pu);
			qValiderLigne.setParam("Ristourne", ristourne);
			qValiderLigne.setParam("Commission", commission);
			qValiderLigne.setParam("Code_TVA", codeTVA);
			qValiderLigne.setParam("Libelle", oec_libelle);
			qValiderLigne.setParam("Code_Stats", codeStats);
			qValiderLigne.setParam("Unite", unite);
			qValiderLigne.setParam("Nb_Pieces", nbPieces);
			qValiderLigne.setParam("Num_Lot", numLot);
			qValiderLigne.setParam("Commande_Id", commandeId);
			
			if (isEmpty(designation)) { showWarning("Désignation de l'article manquante !"); }
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !");	}
			else if (!isEmpty(nbPieces) && !isPositiveInteger(nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (!isEmpty(datePeremption) && !isDate(datePeremption)) { showWarning("Date de péremption incorrecte !");	}
			else if (isEmpty(pu) || !isPositiveOrNull(pu) || !checkDecimal(pu,4)) { showWarning("Prix unitaire incorrect !");	}
			else if (isEmpty(ristourne) || !isTaux(ristourne)) { showWarning("Taux de ristourne incorrect !");	}
			else if (isEmpty(commission) || !isTaux(commission) || parseIntBis(commission)>=100) { showWarning("Taux de commission incorrect !");	}
			else {
				
				qValiderLigne.setParam("Date_Peremption", !isEmpty(datePeremption)?datePeremption:"");

				var result = qValiderLigne.execute();
				var errors = new Errors(result);

				if (errors.hasNext()) {		
					errors.show();
				}
				else {
					message = result.responseXML.documentElement.getAttribute('Message');
					if (message!=null) {
						showWarning(message);
					}
					if (oec_modeLigne=="C") {
						oec_currentIndex = oec_aArticles.nbLignes();
					}
					
					if (oec_typeLigne=='S') {
						oec_calculerPoids();
					}
					
					oec_ajouterLigne("I");
					oec_aArticles.deleteTree();
					oec_initTree2();
					
					
				}
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_annulerLigne() {
  try {

  	oec_aArticles.select(-1);
		oec_ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_supprimerLigne() {
  try {

		var qSupprimerLigne = new QueryHttp("Facturation/Affaires/supprimerArticleCommande.tmpl");
		qSupprimerLigne.setParam("Ligne_Id", oec_ligneId);
		qSupprimerLigne.setParam("Commande_Id", commandeId);
		var result = qSupprimerLigne.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {		
			errors.show();
		}
		else {
			oec_currentIndex--;
			
			if (oec_typeLigne=='S') {
				oec_calculerPoids();
			}
			
			oec_ajouterLigne("I");
			oec_aArticles.deleteTree();
			oec_initTree2();
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_enregistrerCommande(rafraichir) {
	try {

		var save = false;

		var clientId = document.getElementById('oec-clientId').value;
		var utilR = document.getElementById('oec-responsable').value;
		var refCommande = document.getElementById('oec-refCommande').value;
		var regimeTVA = document.getElementById('oec-regimeTVA').value;
		var numTva = oec_assujettiTVA?document.getElementById('oec-numTVA').value:"";
		var dateDelai = document.getElementById('oec-dateDelai').value;
		var modeReglement = document.getElementById('oec-modeReglement').value;
		var modeExpedition = document.getElementById('oec-modeExpedition').value;
		var secteurActivite = document.getElementById('oec-secteur').value;
		var commentairesFin = document.getElementById('oec-commentairesFin').value;
		var commentairesInt = document.getElementById('oec-commentairesInt').value;
		var codeTarif = document.getElementById('oec-codeTarif').value;
		var remise = document.getElementById('oec-remise').value;
		var tauxRemise = 0;
		var montantRemise = 0;
		var fraisPort = document.getElementById('oec-fraisPort').value;
		var remiseFP = document.getElementById('oec-remiseFP').value;
		var tauxRemiseFP = 0;
		var montantRemiseFP = 0;
		var escompte = document.getElementById('oec-escompte').value;
		
		var denominationFact = document.getElementById('oec-denominationFact').value;
		var adresse1Fact = document.getElementById('oec-adresse1Fact').value;
		var adresse2Fact = document.getElementById('oec-adresse2Fact').value;
		var adresse3Fact = document.getElementById('oec-adresse3Fact').value;
		var codePostalFact = document.getElementById('oec-codePostalFact').value;
		var villeFact = document.getElementById('oec-villeFact').value;
		var codePaysFact = document.getElementById('oec-codePaysFact').value;
		var civInterFact = document.getElementById('oec-civInterFact').value;
		var nomInterFact = document.getElementById('oec-nomInterFact').value;
		var prenomInterFact = document.getElementById('oec-prenomInterFact').value;
		var telInterFact = document.getElementById('oec-telInterFact').value;
		var faxInterFact = document.getElementById('oec-faxInterFact').value;
		var emailInterFact = document.getElementById('oec-emailInterFact').value;
		
		var denominationLiv = document.getElementById('oec-denominationLiv').value;
		var adresse1Liv = document.getElementById('oec-adresse1Liv').value;
		var adresse2Liv = document.getElementById('oec-adresse2Liv').value;
		var adresse3Liv = document.getElementById('oec-adresse3Liv').value;
		var codePostalLiv = document.getElementById('oec-codePostalLiv').value;
		var villeLiv = document.getElementById('oec-villeLiv').value;
		var codePaysLiv = document.getElementById('oec-codePaysLiv').value;
		var civInterLiv = document.getElementById('oec-civInterLiv').value;
		var nomInterLiv = document.getElementById('oec-nomInterLiv').value;
		var prenomInterLiv = document.getElementById('oec-prenomInterLiv').value;
		var telInterLiv = document.getElementById('oec-telInterLiv').value;
		var faxInterLiv = document.getElementById('oec-faxInterLiv').value;
		var emailInterLiv = document.getElementById('oec-emailInterLiv').value;
		
		var denominationEnvoi = document.getElementById('oec-denominationEnvoi').value;
		var adresse1Envoi = document.getElementById('oec-adresse1Envoi').value;
		var adresse2Envoi = document.getElementById('oec-adresse2Envoi').value;
		var adresse3Envoi = document.getElementById('oec-adresse3Envoi').value;
		var codePostalEnvoi = document.getElementById('oec-codePostalEnvoi').value;
		var villeEnvoi = document.getElementById('oec-villeEnvoi').value;
		var codePaysEnvoi = document.getElementById('oec-codePaysEnvoi').value;
		var civInterEnvoi = document.getElementById('oec-civInterEnvoi').value;
		var nomInterEnvoi = document.getElementById('oec-nomInterEnvoi').value;
		var prenomInterEnvoi = document.getElementById('oec-prenomInterEnvoi').value;
		var telInterEnvoi = document.getElementById('oec-telInterEnvoi').value;
		var faxInterEnvoi = document.getElementById('oec-faxInterEnvoi').value;
		var emailInterEnvoi = document.getElementById('oec-emailInterEnvoi').value;
		
		var montantBase = (oec_editionTTC?oec_montantTTC:oec_montantHT);

		if (isEmpty(remise) || (oec_typeRemise=='P'?!isTaux(remise):!isPositiveOrNull(remise) || parseFloat(remise)>montantBase)) { showWarning("Remise incorrecte !"); }
		else if (isEmpty(fraisPort) || !isPositiveOrNull(fraisPort)) { showWarning("Frais de port incorrects !"); }
		else if (isEmpty(remiseFP) || (oec_typeRemiseFP=='P'?!isTaux(remiseFP):!isPositiveOrNull(remiseFP) || parseFloat(remiseFP)>parseFloat(fraisPort))) { showWarning("Remise sur frais de port incorrecte !"); }
		else if (isEmpty(denominationFact)) { showWarning("Veuillez indiquer la raison sociale du client de facturation !"); }
		else if (isEmpty(adresse1Fact)) { showWarning("Veuillez indiquer l'adresse du client de facturation !"); }
		else if (isEmpty(villeFact)) { showWarning("Veuillez indiquer la ville du client de facturation !"); }
		else if (isEmpty(denominationLiv)) { showWarning("Veuillez indiquer la raison sociale du client de livraison !"); }
		else if (isEmpty(adresse1Liv)) { showWarning("Veuillez indiquer l'adresse du client de livraison !"); }
		else if (isEmpty(villeLiv)) { showWarning("Veuillez indiquer la ville du client de livraison !"); }
		else if (isEmpty(denominationEnvoi)) { showWarning("Veuillez indiquer la raison sociale du client d'envoi !"); }
		else if (isEmpty(adresse1Envoi)) { showWarning("Veuillez indiquer l'adresse du client d'envoi !"); }
		else if (isEmpty(villeEnvoi)) { showWarning("Veuillez indiquer la ville du client d'envoi !"); }
		else if (isEmpty(escompte) || !isTaux(escompte)) { showWarning("Taux d'escompte incorrect !"); }
		else if (!isEmpty(dateDelai) && !isDate(dateDelai)) { showWarning("Date de délai incorrecte !"); }
		else if (modeReglement=="0") { showWarning("Veuillez choisir un mode de règlement !"); }
		else if (!isEmpty(telInterFact) && !isPhone(telInterFact)) { showWarning("Numéro de téléphone de facturation incorrect !"); }
		else if (!isEmpty(faxInterFact) && !isPhone(faxInterFact)) { showWarning("Numéro de fax de facturation incorrect !"); }
		else if (!isEmpty(emailInterFact) && !isEmail(emailInterFact)) { showWarning("Adresse e-mail de facturation incorrecte !"); }
		else if (!isEmpty(telInterLiv) && !isPhone(telInterLiv)) { showWarning("Numéro de téléphone de livraison incorrect !"); }
		else if (!isEmpty(faxInterLiv) && !isPhone(faxInterLiv)) { showWarning("Numéro de fax de livraison incorrect !"); }
		else if (!isEmpty(emailInterLiv) && !isEmail(emailInterLiv)) { showWarning("Adresse e-mail de livraison incorrecte !"); }
		else if (!isEmpty(telInterEnvoi) && !isPhone(telInterEnvoi)) { showWarning("Numéro de téléphone d'envoi incorrect !"); }
		else if (!isEmpty(faxInterEnvoi) && !isPhone(faxInterEnvoi)) { showWarning("Numéro de fax d'envoi incorrect !"); }
		else if (!isEmpty(emailInterEnvoi) && !isEmail(emailInterEnvoi)) { showWarning("Adresse e-mail d'envoi incorrecte !"); }
		else {
			
			fraisPort = parseFloat(fraisPort);
			remise = parseFloat(remise);
			remiseFP = parseFloat(remiseFP);

			if (oec_assujettiTVA && codePaysLiv!="FR" && isEmpty(numTva) && oec_zoneUE) {
				showWarning("Attention : vous n'avez pas saisi le numéro de tva intra-communautaire !");
			}

			var qEnregistrer;
			if (oec_mode=="C") {
				qEnregistrer = new QueryHttp("Facturation/Affaires/creerCommande.tmpl");
				qEnregistrer.setParam("Affaire_Id", affaireId);
			}
			else {
				qEnregistrer = new QueryHttp("Facturation/Affaires/modifierCommande.tmpl");
				qEnregistrer.setParam("Commande_Id", commandeId);
			}
			
			if (oec_typeRemise=='P') {
				tauxRemise = remise;
			}
			else {
				tauxRemise = (montantBase>0?remise/montantBase*100:0);
				montantRemise = remise;
			}
			
			if (oec_typeRemiseFP=='P') {
				tauxRemiseFP = remiseFP;
			}
			else {
				tauxRemiseFP = (fraisPort>0?remiseFP/fraisPort*100:0);
				montantRemiseFP = remiseFP;
			}
			
			qEnregistrer.setParam("Client_Id", clientId);
			qEnregistrer.setParam("Util_R", utilR);
			qEnregistrer.setParam("Ref_Commande", refCommande);
			qEnregistrer.setParam("Edition_TTC", oec_editionTTC?"1":"0");
			qEnregistrer.setParam("Regime_TVA", regimeTVA);
			qEnregistrer.setParam("Assujetti_TVA", oec_assujettiTVA?"1":"0");
			qEnregistrer.setParam("Num_TVA_Intra", numTva);
			qEnregistrer.setParam("Code_Tarif", codeTarif);
			qEnregistrer.setParam("Date_Delai", !isEmpty(dateDelai)?dateDelai:"");
			qEnregistrer.setParam("Mode_Reglement", modeReglement);
			qEnregistrer.setParam("Mode_Expedition", modeExpedition);
			qEnregistrer.setParam("Secteur_Activite", secteurActivite);
			qEnregistrer.setParam("Commentaires_Fin", commentairesFin);
			qEnregistrer.setParam("Commentaires_Int", commentairesInt);
			qEnregistrer.setParam("Taux_Remise", tauxRemise);
			qEnregistrer.setParam("Montant_Remise", montantRemise);
			qEnregistrer.setParam("PRemise_FP", tauxRemiseFP);
			qEnregistrer.setParam("MRemise_FP", montantRemiseFP);
			qEnregistrer.setParam("Escompte", escompte);
			qEnregistrer.setParam("Frais_Port", fraisPort);
			qEnregistrer.setParam("Code_TVA_Port", oec_codeTvaPort);
			qEnregistrer.setParam("Taux_TVA_Port", oec_tauxTvaPort);
			qEnregistrer.setParam("Denomination_Fact", denominationFact);
			qEnregistrer.setParam("Adresse_1_Fact", adresse1Fact);
			qEnregistrer.setParam("Adresse_2_Fact", adresse2Fact);
			qEnregistrer.setParam("Adresse_3_Fact", adresse3Fact);
			qEnregistrer.setParam("Code_Postal_Fact", codePostalFact);
			qEnregistrer.setParam("Ville_Fact", villeFact);
			qEnregistrer.setParam("Code_Pays_Fact", codePaysFact);
			qEnregistrer.setParam("Civ_Inter_Fact", civInterFact);
			qEnregistrer.setParam("Nom_Inter_Fact", nomInterFact);
			qEnregistrer.setParam("Prenom_Inter_Fact", prenomInterFact);
			qEnregistrer.setParam("Tel_Inter_Fact", telInterFact);
			qEnregistrer.setParam("Fax_Inter_Fact", faxInterFact);
			qEnregistrer.setParam("Email_Inter_Fact", emailInterFact);
			qEnregistrer.setParam("Denomination_Liv", denominationLiv);
			qEnregistrer.setParam("Adresse_1_Liv", adresse1Liv);
			qEnregistrer.setParam("Adresse_2_Liv", adresse2Liv);
			qEnregistrer.setParam("Adresse_3_Liv", adresse3Liv);
			qEnregistrer.setParam("Code_Postal_Liv", codePostalLiv);
			qEnregistrer.setParam("Ville_Liv", villeLiv);
			qEnregistrer.setParam("Code_Pays_Liv", codePaysLiv);
			qEnregistrer.setParam("Civ_Inter_Liv", civInterLiv);
			qEnregistrer.setParam("Nom_Inter_Liv", nomInterLiv);
			qEnregistrer.setParam("Prenom_Inter_Liv", prenomInterLiv);
			qEnregistrer.setParam("Tel_Inter_Liv", telInterLiv);
			qEnregistrer.setParam("Fax_Inter_Liv", faxInterLiv);
			qEnregistrer.setParam("Email_Inter_Liv", emailInterLiv);
			qEnregistrer.setParam("Denomination_Envoi", denominationEnvoi);
			qEnregistrer.setParam("Adresse_1_Envoi", adresse1Envoi);
			qEnregistrer.setParam("Adresse_2_Envoi", adresse2Envoi);
			qEnregistrer.setParam("Adresse_3_Envoi", adresse3Envoi);
			qEnregistrer.setParam("Code_Postal_Envoi", codePostalEnvoi);
			qEnregistrer.setParam("Ville_Envoi", villeEnvoi);
			qEnregistrer.setParam("Code_Pays_Envoi", codePaysEnvoi);
			qEnregistrer.setParam("Civ_Inter_Envoi", civInterEnvoi);
			qEnregistrer.setParam("Nom_Inter_Envoi", nomInterEnvoi);
			qEnregistrer.setParam("Prenom_Inter_Envoi", prenomInterEnvoi);
			qEnregistrer.setParam("Tel_Inter_Envoi", telInterEnvoi);
			qEnregistrer.setParam("Fax_Inter_Envoi", faxInterEnvoi);
			qEnregistrer.setParam("Email_Inter_Envoi", emailInterEnvoi);
			
			var result = qEnregistrer.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {		
				errors.show();
			}
			else {
				message = result.responseXML.documentElement.getAttribute('Message');
				if (message!=null) {
					showWarning(message);
				}
			
				if (oec_mode=="C") {
					var contenu = result.responseXML.documentElement;
					commandeId = contenu.getAttribute("Commande_Id");
					oec_charger=false;
					if (rafraichir) {
						oec_chargerCommande();
					}	else {
						oec_aArticles.setParam("Commande_Id", commandeId);
						oec_aAcomptes.setParam("Commande_Id", commandeId);
						oec_mode="M";
						oec_etatCommande="N";
						document.getElementById('oec-numCommande').value = contenu.getAttribute("Num_Commande");
						document.getElementById('oec-dateCommande').value = contenu.getAttribute('Date_Commande');
						document.getElementById('oec-etatCommande').value = "Non validée";
						document.getElementById('oec-statutPaiement').value = "Non payée";
						document.getElementById('oec-bOuvrirCommentairesCaches').disabled = false;
						document.getElementById('oec-tabAcomptes').collapsed = false;
						document.getElementById('oec-boxNouvelAcompte').collapsed = false;
						document.getElementById('oec-tabVersionDocument').collapsed=false;
						oec_initVersion();
					}
				} else if (oec_mode=="M") {
					document.getElementById('oec-bAnnulerCommande').disabled=false;
					if (oec_etatCommande=="T") {
						oec_mode=="V";
						oec_chargerCommande();
					}
				}
				oec_setModifie(false);
				save = true;
			}

		}

		return save;

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_calculTotaux() {
  try {
  	var clientId = document.getElementById('oec-clientId').value;
		var clientConnu = (clientId!="");

		if (oec_mode!='V') {
			document.getElementById('oec-editionTTC').disabled = (!oec_premiereCommande || oec_aArticles.nbLignes()>0);
	    document.getElementById('oec-codePaysLiv').disabled = (oec_aArticles.nbLignes()>0);
	    //document.getElementById('oec-bChercherClient').collapsed = (oec_aArticles.nbLignes()>0);
	   	document.getElementById('oec-bChercherAdrLiv').disabled = (!clientConnu || oec_aArticles.nbLignes()>0);
	    document.getElementById('oec-bCopierFactVersLivEnvoi').disabled = (oec_aArticles.nbLignes()>0);
	    document.getElementById('oec-codeTarif').disabled = (oec_aArticles.nbLignes()>0);
			document.getElementById('oec-regimeTVA').disabled = (oec_aArticles.nbLignes()>0);
			document.getElementById('oec-assujettiTVA').disabled = (!oec_premiereCommande || oec_aArticles.nbLignes()>0);
		}
		
		var remise = parseFloat(document.getElementById('oec-remise').value);
		var tauxEscompte = parseFloat(document.getElementById('oec-escompte').value);
		var fraisPort = parseFloat(document.getElementById('oec-fraisPort').value);
		var remiseFP = parseFloat(document.getElementById('oec-remiseFP').value);

		if ((oec_typeRemise=='P'?isTaux(remise):isPositiveOrNull(remise)) && (oec_typeRemiseFP=='P'?isTaux(remiseFP):isPositiveOrNull(remiseFP)) && isTaux(tauxEscompte) && isPositiveOrNull(fraisPort)) {

			if (oec_aArticles.isNotNull()) {
				
				var calculDocument = new CalculDocument();
				calculDocument.setEditionTTC(oec_editionTTC);
				if (oec_typeRemise=='P') { calculDocument.setRemiseP(remise); }
				else { calculDocument.setRemiseM(remise); }
				calculDocument.setFraisPortBruts(fraisPort);
				if (oec_typeRemiseFP=='P') { calculDocument.setRemiseFPP(remiseFP); }
				else { calculDocument.setRemiseFPM(remiseFP); }
				calculDocument.setTauxTVAFP(oec_tauxTvaPort);
				calculDocument.setEscompteP(tauxEscompte);
				calculDocument.setAcompte(oec_acompte);
				
				var nbLignes = oec_aArticles.nbLignes();
				
				for (var i=0;i<nbLignes;i++) {
					if (oec_aArticles.getCellText(i,'oec-colTypeLigne')!="C") {
						var prixUnitaireBrut  = oec_aArticles.getCellText(i,'oec-colPU');
						var ristourneP = oec_aArticles.getCellText(i,'oec-colRistourne');
						var commissionP = oec_aArticles.getCellText(i,'oec-colTauxCommission');
						var quantite  = oec_aArticles.getCellText(i,'oec-colQuantite');
						var codeTVA  = oec_aArticles.getCellText(i,'oec-colCodeTVA');
						calculDocument.ajouterLigneDocument(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA);
					}
				}
				
				calculDocument.calculer();

				if (oec_editionTTC) {
					document.getElementById('oec-pttcMontantRemise').value = calculDocument.getRemiseM();
					document.getElementById('oec-pttcMontantFraisPort').value = calculDocument.getFraisPortBruts();
					document.getElementById('oec-pttcMontantRemiseFP').value = calculDocument.getRemiseFPM();
					document.getElementById('oec-pttcTVA').value = calculDocument.getTotalTVA();
					document.getElementById('oec-pttcCommissionTTC').value = calculDocument.getCommissionTTC();
					document.getElementById('oec-pttcMontantTTC').value = calculDocument.getMontantTTC();
					document.getElementById('oec-pttcMontantEscompte').value = calculDocument.getEscompteM();
					document.getElementById('oec-pttcMontantAcompte').value = calculDocument.getAcompte();
					document.getElementById('oec-pttcTotalTTC').value = calculDocument.getTotalTTC();
					document.getElementById('oec-pttcNetTTC').value = calculDocument.getNetAPayer();
					
					oec_montantTTC = calculDocument.getMontantTTCSansFormat();
					
					document.getElementById('oec-rowCommissionTTC').collapsed = !calculDocument.afficherCommission();
					document.getElementById('oec-rowRemiseTTC').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('oec-rowRemiseFPTTC').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('oec-rowEscompteTTC').collapsed = !calculDocument.afficherEscompteM();
				}
				else {
					document.getElementById('oec-montantHT').value = calculDocument.getMontantHT();
					document.getElementById('oec-montantRemise').value = calculDocument.getRemiseM();
					document.getElementById('oec-montantFraisPort').value = calculDocument.getFraisPortBruts();
					document.getElementById('oec-montantRemiseFP').value = calculDocument.getRemiseFPM();
					document.getElementById('oec-totalHT').value = calculDocument.getTotalHT();
					document.getElementById('oec-commissionHT').value = calculDocument.getCommissionHT();
					document.getElementById('oec-TVA').value = calculDocument.getTotalTVA();
					document.getElementById('oec-montantTTC').value = calculDocument.getMontantTTC();
					document.getElementById('oec-montantEscompte').value = calculDocument.getEscompteM();
					document.getElementById('oec-montantAcompte').value = calculDocument.getAcompte();
					document.getElementById('oec-totalTTC').value = calculDocument.getTotalTTC();
					
					oec_montantHT = calculDocument.getMontantHTSansFormat();
					oec_montantTTC = calculDocument.getMontantTTCSansFormat();
					
					document.getElementById('oec-rowCommissionHT').collapsed = !calculDocument.afficherCommission();
					document.getElementById('oec-rowRemiseHT').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('oec-rowRemiseFPHT').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('oec-rowMontantTTC').collapsed = !calculDocument.afficherEscompteM();
					document.getElementById('oec-rowEscompteHT').collapsed = !calculDocument.afficherEscompteM();
				}
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_calculerPoids() {
	try {
		
		var qPoids = new QueryHttp("Facturation/Affaires/getPoidsTotalCommande.tmpl");
		qPoids.setParam("Commande_Id", commandeId);
		var result = qPoids.execute();
		
		document.getElementById('oec-poidsTotal').value = result.responseXML.documentElement.getAttribute("Poids");
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_afterRefreshArticles() {
	try {

		oec_calculTotaux();
		oec_scrollToRank();
		document.getElementById('oec-reference').focus();

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_scrollToRank() {
	try {
		
		var tb = document.getElementById("oec-articles").treeBoxObject;
		
		if (oec_currentIndex>0) {
			tb.ensureRowIsVisible(oec_currentIndex);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_demandeEnregistrement() {
  try {

		if (oec_modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à la commande ?")) {
				oec_enregistrerCommande(false);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oec_setModifie(m) {
  try {
  	oec_modifie = m;
		if (m) {
			document.getElementById('oec-tabCommande').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('oec-bValiderCommande').disabled = true;
			document.getElementById('oec-bSolder').disabled = true;
			document.getElementById('oec-bModifier').disabled = true;
			document.getElementById('oec-bModifier').collapsed = true;
			document.getElementById('oec-bBloquer').disabled = true;
			document.getElementById('oec-bBloquer').collapsed = true;
			document.getElementById('oec-bDebloquer').disabled = true;
			document.getElementById('oec-bDebloquer').collapsed = true;
			document.getElementById('oec-bCloturer').disabled = true;
			document.getElementById('oec-bCloturer').collapsed = true;
			document.getElementById('oec-bDecloturer').disabled = true;
			document.getElementById('oec-bDecloturer').collapsed = true;
			document.getElementById('oec-bVisualiser').disabled = true;
			document.getElementById('oec-bProforma').disabled = true;
		}
		else {
			document.getElementById('oec-tabCommande').setAttribute('image', null);
			document.getElementById('oec-bValiderCommande').disabled = (oec_etatCommande!='N' && oec_etatCommande!='Z');
			document.getElementById('oec-bSolder').disabled = (oec_etatCommande!='T' || oec_soldee);
			document.getElementById('oec-bModifier').disabled = (oec_etatCommande!='T');
			document.getElementById('oec-bModifier').collapsed = (oec_etatCommande!='T');
			document.getElementById('oec-bBloquer').disabled = ((oec_etatCommande!='T' && oec_etatCommande!='N') || oec_bloque);
			document.getElementById('oec-bBloquer').collapsed = ((oec_etatCommande!='T' && oec_etatCommande!='N') || oec_bloque);
			document.getElementById('oec-bDebloquer').disabled = ((oec_etatCommande!='T' && oec_etatCommande!='N') || !oec_bloque);
			document.getElementById('oec-bDebloquer').collapsed = ((oec_etatCommande!='T' && oec_etatCommande!='N') || !oec_bloque);
			document.getElementById('oec-bCloturer').disabled = (oec_etatCommande!='C' || !oec_soldee || !facturee);
			document.getElementById('oec-bCloturer').collapsed = (oec_etatCommande!='C' || !oec_soldee || !facturee);
			document.getElementById('oec-bDecloturer').disabled = (oec_etatCommande!='C');
			document.getElementById('oec-bDecloturer').collapsed = (oec_etatCommande!='C');
			document.getElementById('oec-bVisualiser').disabled = false;
			document.getElementById('oec-bProforma').disabled = false;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}



function oec_initTree2() {
  try {
  	
  	oec_aArticles.setParam("Commande_Id", commandeId);
  	oec_aArticles.initTree(oec_afterRefreshArticles);

  } catch (e) {
    recup_erreur(e);
  }
}



function oec_editerCommentaire() {
  try {
  	
		if (oec_aArticles.isSelected()) {
			var i = oec_aArticles.getCurrentIndex();
			var ligneId = oec_aArticles.getCellText(i,'oec-colLigneId');

			var url = "chrome://opensi/content/facturation/user/affaires/popup-commentaire.xul?"+ cookie() +"&Type_Doc=Commande_Client&Ligne_Id="+ ligneId;
    	window.openDialog(url,'','chrome,modal,centerscreen');

			oec_aArticles.deleteTree();
			oec_initTree2();
			oec_ajouterLigne("I");
		}
		else {
			showWarning("Aucun article ou commentaire sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_editerPrixAchat() {
  try {
  	
		if (oec_aArticles.isSelected()) {
			var i = oec_aArticles.getCurrentIndex();
			var ligneId = oec_aArticles.getCellText(i,'oec-colLigneId');

			var url = "chrome://opensi/content/facturation/user/commun/popup-modifierPrixAchat.xul?"+ cookie() +"&Type_Doc=Commande_Client&Ligne_Id="+ ligneId;
    	window.openDialog(url,'','chrome,modal,centerscreen',oec_retourEditerPrixAchat);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_retourEditerPrixAchat() {
	try {
		oec_aArticles.deleteTree();
		oec_initTree2();
		oec_ajouterLigne("I");
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_editerCommentairesCaches() {
  try {
  	
		var url = "chrome://opensi/content/facturation/user/affaires/popup-commentaireCache.xul?"+ cookie();
    url += "&Type_Doc=Commande_Client&Doc_Id="+ commandeId;
  	window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_chargerCoord() {
  try {
		var clientId = document.getElementById('oec-clientId').value;
		var qGetClient = new QueryHttp("Facturation/Clients/getCoord.tmpl");
		qGetClient.setParam("Client_Id", clientId);
		var result = qGetClient.execute();

		var contenu = result.responseXML.documentElement;
		
		oec_chargerModesReglements(contenu.getAttribute('Mode_Reg'));
		oec_chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById('oec-remise').value = contenu.getAttribute('Remise');
		document.getElementById('oec-bRemise').setAttribute("class", "bIcoPourcentage");
		oec_typeRemise = 'P';
		document.getElementById('oec-codeTarif').value = contenu.getAttribute('Code_Tarif');
		document.getElementById('oec-secteur').value = contenu.getAttribute('Secteur_Activite');
		
		oec_assujettiTVA = (contenu.getAttribute('Assujetti_TVA')=="1");
		document.getElementById('oec-assujettiTVA').checked=oec_assujettiTVA;
		document.getElementById('oec-numTVA').disabled=!oec_assujettiTVA;
		document.getElementById('oec-numTVA').value=contenu.getAttribute('Num_TVA_Intra');
		
		oec_defCommission = contenu.getAttribute('Taux_Commission');

		document.getElementById('oec-denominationFact').value = contenu.getAttribute('Denomination_Fact');
		document.getElementById('oec-adresse1Fact').value = contenu.getAttribute('Adresse_1_Fact');		
		document.getElementById('oec-adresse2Fact').value = contenu.getAttribute('Adresse_2_Fact');
		document.getElementById('oec-adresse3Fact').value = contenu.getAttribute('Adresse_3_Fact');
		document.getElementById('oec-codePostalFact').value = contenu.getAttribute('Code_Postal_Fact');
		document.getElementById('oec-villeFact').value = contenu.getAttribute('Ville_Fact');
    document.getElementById('oec-codePaysFact').value = contenu.getAttribute('Code_Pays_Fact');
		document.getElementById('oec-civInterFact').value = contenu.getAttribute('Civ_Inter_Fact');
		document.getElementById('oec-nomInterFact').value = contenu.getAttribute('Nom_Inter_Fact');
		document.getElementById('oec-prenomInterFact').value = contenu.getAttribute('Prenom_Inter_Fact');
		document.getElementById('oec-telInterFact').value = contenu.getAttribute('Tel_Inter_Fact');
		document.getElementById('oec-faxInterFact').value = contenu.getAttribute('Fax_Inter_Fact');
		document.getElementById('oec-emailInterFact').value = contenu.getAttribute('Email_Inter_Fact');
		
		document.getElementById('oec-denominationLiv').value = contenu.getAttribute('Denomination_Liv');
		document.getElementById('oec-adresse1Liv').value = contenu.getAttribute('Adresse_1_Liv');
		document.getElementById('oec-adresse2Liv').value = contenu.getAttribute('Adresse_2_Liv');
		document.getElementById('oec-adresse3Liv').value = contenu.getAttribute('Adresse_3_Liv');
		document.getElementById('oec-codePostalLiv').value = contenu.getAttribute('Code_Postal_Liv');		
		document.getElementById('oec-villeLiv').value = contenu.getAttribute('Ville_Liv');
    document.getElementById('oec-codePaysLiv').value = contenu.getAttribute('Code_Pays_Liv');
    oec_calculerTvaPort();
    oec_selectPaysLiv();
    
    document.getElementById('oec-civInterLiv').value = contenu.getAttribute('Civ_Inter_Liv');
		document.getElementById('oec-nomInterLiv').value = contenu.getAttribute('Nom_Inter_Liv');
		document.getElementById('oec-prenomInterLiv').value = contenu.getAttribute('Prenom_Inter_Liv');
		document.getElementById('oec-telInterLiv').value = contenu.getAttribute('Tel_Inter_Liv');
		document.getElementById('oec-faxInterLiv').value = contenu.getAttribute('Fax_Inter_Liv');
		document.getElementById('oec-emailInterLiv').value = contenu.getAttribute('Email_Inter_Liv');
		
		document.getElementById('oec-denominationEnvoi').value = contenu.getAttribute('Denomination_Envoi');
		document.getElementById('oec-adresse1Envoi').value = contenu.getAttribute('Adresse_1_Envoi');
		document.getElementById('oec-adresse2Envoi').value = contenu.getAttribute('Adresse_2_Envoi');
		document.getElementById('oec-adresse3Envoi').value = contenu.getAttribute('Adresse_3_Envoi');
		document.getElementById('oec-codePostalEnvoi').value = contenu.getAttribute('Code_Postal_Envoi');		
		document.getElementById('oec-villeEnvoi').value = contenu.getAttribute('Ville_Envoi');
    document.getElementById('oec-codePaysEnvoi').value = contenu.getAttribute('Code_Pays_Envoi');
		
		document.getElementById('oec-civInterEnvoi').value = contenu.getAttribute('Civ_Inter_Envoi');
		document.getElementById('oec-nomInterEnvoi').value = contenu.getAttribute('Nom_Inter_Envoi');
		document.getElementById('oec-prenomInterEnvoi').value = contenu.getAttribute('Prenom_Inter_Envoi');
		document.getElementById('oec-telInterEnvoi').value = contenu.getAttribute('Tel_Inter_Envoi');
		document.getElementById('oec-faxInterEnvoi').value = contenu.getAttribute('Fax_Inter_Envoi');
		document.getElementById('oec-emailInterEnvoi').value = contenu.getAttribute('Email_Inter_Envoi');
		
		document.getElementById('oec-labelClient').setAttribute("value", clientId);
		
   	document.getElementById('oec-bChercherAdrLiv').disabled = (oec_aArticles.nbLignes()>0);
    document.getElementById('oec-bCopierFactVersLivEnvoi').disabled = (oec_aArticles.nbLignes()>0);
    document.getElementById('oec-codeTarif').disabled = (oec_aArticles.nbLignes()>0);
		document.getElementById('oec-bChercherAdrFact').disabled = false;
		document.getElementById('oec-bChercherInter').disabled = false;
		document.getElementById('oec-bChercherInterLiv').disabled = false;
		document.getElementById('oec-bChercherAdrEnvoi').disabled = false;
		document.getElementById('oec-bChercherInterEnvoi').disabled = false;
		
		var qIndications = new QueryHttp("Facturation/Commun/getIndicationsCommandeClient.tmpl");
		qIndications.setParam("Client_Id", clientId);
		var result = qIndications.execute();
		document.getElementById('oec-indications').value = result.responseXML.documentElement.getAttribute("Indications");
		
		oec_ajouterLigne("I");
		oec_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_rechercherClient() {
  try {

		var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=true&Client_Express=true&Bloque=true";
    window.openDialog(url,'','chrome,modal,centerscreen',oec_retourRechercherClient);
    var clientId = document.getElementById('oec-clientId').value;

		if (clientId != "") {
			oec_chargerCoord();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}

function oec_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('oec-clientId').value = codeClient;
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_evaluer(elem, ev) {
	try {

		if (ev.keyCode==13) {
			var nf4 = new NumberFormat("0.00##", false);
			elem.value = nf4.format(calcExpr(elem.value));
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function oec_changerTypeEdition(chgType) {
	try {

		oec_editionTTC = chgType;
		
		if (oec_editionTTC) {
			document.getElementById('oec-colTotal').setAttribute("label", "Total TTC");
			document.getElementById('oec-colPU').setAttribute("label", "P.U TTC");
			document.getElementById('oec-lblFraisPort').value = "Frais de port (ttc) :";
			document.getElementById('oec-lblPU').value = "P.U TTC :";
			document.getElementById('oec-piedTTC').collapsed = false;
			document.getElementById('oec-piedHT').collapsed = true;
		}
		else {
			document.getElementById('oec-colTotal').setAttribute("label", "Total HT");
			document.getElementById('oec-colPU').setAttribute("label", "P.U HT");
			document.getElementById('oec-lblFraisPort').value = "Frais de port (ht) :";
			document.getElementById('oec-lblPU').value = "P.U HT :";
			document.getElementById('oec-piedTTC').collapsed = true;
			document.getElementById('oec-piedHT').collapsed = false;			
		}
		
		oec_calculTotaux();

	}	catch(e) {
		recup_erreur(e);
	}
}


function oec_changerAssujettiTVA(etat) {
	try {

		oec_assujettiTVA = etat;
		document.getElementById('oec-numTVA').disabled=!oec_assujettiTVA;
		oec_listeTVA();
		oec_setModifie(true);

	}	catch(e) {
		recup_erreur(e);
	}
}


function oec_changerTypeVente() {
	try {
	  var qTypeVente = new QueryHttp("GetPays.tmpl");
	  qTypeVente.setParam("Code_Pays", document.getElementById('oec-codePaysLiv').value);
	  var result = qTypeVente.execute();
	  oec_zoneUE = (result.responseXML.documentElement.getAttribute("zone_ue")=="1");
	}	catch(e) {
		recup_erreur(e);
	}
}


function oec_rechercherAdrFact() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oec-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oec_reporterAdrFact);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_reporterAdrFact(nom, adr1, adr2, adr3, cp, ville, pays, codePays, contactFact, contactLiv, contactEnvoi) {
  try {

		document.getElementById('oec-denominationFact').value = nom;
		document.getElementById('oec-adresse1Fact').value = adr1;		
		document.getElementById('oec-adresse2Fact').value = adr2;
		document.getElementById('oec-adresse3Fact').value = adr3;
		document.getElementById('oec-codePostalFact').value = cp;
		document.getElementById('oec-villeFact').value = ville;
	  document.getElementById('oec-codePaysFact').value = codePays;
	  
	  if (!isEmpty(contactFact)) {
	  	var qInterFact = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterFact.setParam("Num_Inter", contactFact);
	  	var result = qInterFact.execute();
	  	var content = result.responseXML.documentElement;
	  	oec_reporterInterFact(content.getAttribute("Civilite"), content.getAttribute("Civ_Courte"), content.getAttribute("Nom"), content.getAttribute("Prenom"), content.getAttribute("Tel"), content.getAttribute("Fax"), content.getAttribute("Email"));
	  }
		oec_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_rechercherInterlocuteurFact() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oec-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oec_reporterInterFact);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_reporterInterFact(civ, civCourte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oec-civInterFact').value = civ;
		document.getElementById('oec-nomInterFact').value = nom;		
		document.getElementById('oec-prenomInterFact').value = prenom;
		document.getElementById('oec-telInterFact').value = tel;
		document.getElementById('oec-faxInterFact').value = fax;
		document.getElementById('oec-emailInterFact').value = email;
		
		oec_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_rechercherAdrEnvoi() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oec-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oec_reporterAdrEnvoi);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_reporterAdrEnvoi(nom, adr1, adr2, adr3, cp, ville, pays, codePays, contactFact, contactLiv, contactEnvoi) {
  try {

		document.getElementById('oec-denominationEnvoi').value = nom;
		document.getElementById('oec-adresse1Envoi').value = adr1;		
		document.getElementById('oec-adresse2Envoi').value = adr2;
		document.getElementById('oec-adresse3Envoi').value = adr3;
		document.getElementById('oec-codePostalEnvoi').value = cp;
		document.getElementById('oec-villeEnvoi').value = ville;
	  document.getElementById('oec-codePaysEnvoi').value = codePays;
	  
	  if (!isEmpty(contactEnvoi)) {
	  	var qInterEnvoi = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterEnvoi.setParam("Num_Inter", contactEnvoi);
	  	var result = qInterEnvoi.execute();
	  	var content = result.responseXML.documentElement;
	  	oec_reporterInterEnvoi(content.getAttribute("Civilite"), content.getAttribute("Civ_Courte"), content.getAttribute("Nom"), content.getAttribute("Prenom"), content.getAttribute("Tel"), content.getAttribute("Fax"), content.getAttribute("Email"));
	  }
	  
		oec_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_copierFactVersLivEnvoi() {
	try {
		document.getElementById('oec-denominationLiv').value = document.getElementById('oec-denominationFact').value;
		document.getElementById('oec-adresse1Liv').value = document.getElementById('oec-adresse1Fact').value;		
		document.getElementById('oec-adresse2Liv').value = document.getElementById('oec-adresse2Fact').value;
		document.getElementById('oec-adresse3Liv').value = document.getElementById('oec-adresse3Fact').value;
		document.getElementById('oec-codePostalLiv').value = document.getElementById('oec-codePostalFact').value;
		document.getElementById('oec-villeLiv').value = document.getElementById('oec-villeFact').value;
	  document.getElementById('oec-codePaysLiv').value = document.getElementById('oec-codePaysFact').value;
	  oec_calculerTvaPort();
	  oec_selectPaysLiv();
	  document.getElementById('oec-civInterLiv').value = document.getElementById('oec-civInterFact').value;
		document.getElementById('oec-nomInterLiv').value = document.getElementById('oec-nomInterFact').value;		
		document.getElementById('oec-prenomInterLiv').value = document.getElementById('oec-prenomInterFact').value;
		document.getElementById('oec-telInterLiv').value = document.getElementById('oec-telInterFact').value;
		document.getElementById('oec-faxInterLiv').value = document.getElementById('oec-faxInterFact').value;
		document.getElementById('oec-emailInterLiv').value = document.getElementById('oec-emailInterFact').value;
		
		document.getElementById('oec-denominationEnvoi').value = document.getElementById('oec-denominationFact').value;
		document.getElementById('oec-adresse1Envoi').value = document.getElementById('oec-adresse1Fact').value;		
		document.getElementById('oec-adresse2Envoi').value = document.getElementById('oec-adresse2Fact').value;
		document.getElementById('oec-adresse3Envoi').value = document.getElementById('oec-adresse3Fact').value;
		document.getElementById('oec-codePostalEnvoi').value = document.getElementById('oec-codePostalFact').value;
		document.getElementById('oec-villeEnvoi').value = document.getElementById('oec-villeFact').value;
	  document.getElementById('oec-codePaysEnvoi').value = document.getElementById('oec-codePaysFact').value;
	  document.getElementById('oec-civInterEnvoi').value = document.getElementById('oec-civInterFact').value;
		document.getElementById('oec-nomInterEnvoi').value = document.getElementById('oec-nomInterFact').value;		
		document.getElementById('oec-prenomInterEnvoi').value = document.getElementById('oec-prenomInterFact').value;
		document.getElementById('oec-telInterEnvoi').value = document.getElementById('oec-telInterFact').value;
		document.getElementById('oec-faxInterEnvoi').value = document.getElementById('oec-faxInterFact').value;
		document.getElementById('oec-emailInterEnvoi').value = document.getElementById('oec-emailInterFact').value;
	  
	  oec_setModifie(true);
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_rechercherAdrLiv() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oec-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oec_reporterAdrLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_reporterAdrLiv(nom, adr1, adr2, adr3, cp, ville, pays, codePays, contactFact, contactLiv, contactEnvoi) {
  try {

		document.getElementById('oec-denominationLiv').value = nom;
		document.getElementById('oec-adresse1Liv').value = adr1;		
		document.getElementById('oec-adresse2Liv').value = adr2;
		document.getElementById('oec-adresse3Liv').value = adr3;
		document.getElementById('oec-codePostalLiv').value = cp;
		document.getElementById('oec-villeLiv').value = ville;
	  document.getElementById('oec-codePaysLiv').value = codePays;
	  oec_calculerTvaPort();
	  oec_selectPaysLiv();
	  
		if (!isEmpty(contactLiv)) {
	  	var qInterLiv = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterLiv.setParam("Num_Inter", contactLiv);
	  	var result = qInterLiv.execute();
	  	var content = result.responseXML.documentElement;
	  	oec_reporterInterLiv(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
	  oec_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_rechercherInterlocuteurLiv() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oec-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oec_reporterInterLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_reporterInterLiv(civ, civCourte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oec-civInterLiv').value = civ;
		document.getElementById('oec-nomInterLiv').value = nom;		
		document.getElementById('oec-prenomInterLiv').value = prenom;
		document.getElementById('oec-telInterLiv').value = tel;
		document.getElementById('oec-faxInterLiv').value = fax;
		document.getElementById('oec-emailInterLiv').value = email;
		
		oec_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_rechercherInterlocuteurEnvoi() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oec-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oec_reporterInterEnvoi);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_reporterInterEnvoi(civ, civCourte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oec-civInterEnvoi').value = civ;
		document.getElementById('oec-nomInterEnvoi').value = nom;		
		document.getElementById('oec-prenomInterEnvoi').value = prenom;
		document.getElementById('oec-telInterEnvoi').value = tel;
		document.getElementById('oec-faxInterEnvoi').value = fax;
		document.getElementById('oec-emailInterEnvoi').value = email;
		
		oec_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_choisirMentions() {
  try {
  	
  	var ok = true;
  	
  	if (oec_mode=="C") {
			ok = oec_enregistrerCommande(true);
		}

		if (ok) {
			var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Commande_Client&Doc_Id="+ commandeId;
    	window.openDialog(url,'','chrome,modal,centerscreen',oec_setModifie);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oec_validerCommande() {
	try {
		if (oec_aArticles.nbLignes()==0) { showWarning("La commande ne contient aucune ligne !"); }
		else if (document.getElementById("oec-modeReglement").selectedIndex==0) { showWarning("Veuillez choisir un mode de règlement avant de valider la commande !") }
		else {
			var ok = true;
			var qCheckEncoursClient = new QueryHttp("Facturation/Affaires/checkEncoursClient.tmpl");
			qCheckEncoursClient.setParam("Commande_Id", commandeId);
			var result=qCheckEncoursClient.execute();
			if (result.responseXML.documentElement.getAttribute("Depassement")=="true") {
				ok = window.confirm("L'encours autorisé du client est dépassé, voulez-vous continuer ?");
			}
			
			if (ok && window.confirm("Voulez-vous valider la commande ?")) {
				var qValiderCommande = new QueryHttp("Facturation/Affaires/validerCommande.tmpl");
				qValiderCommande.setParam("Commande_Id", commandeId);
				result=qValiderCommande.execute();
				var codeErreur=result.responseXML.documentElement.getAttribute("code_erreur");
				if (codeErreur=="1") {
					showWarning("Erreur : la commande ne peut pas être validée !");
				} else if (codeErreur=="2") {
					showWarning("Erreur : la commande ne possède pas de mode de règlement !");
				} else if (codeErreur=="3") {
					showWarning("Erreur : la commande ne contient aucune ligne !");
				} else if (codeErreur=="4") {
					showWarning("Erreur : le client de la commande est à l'état bloqué !");
				} else if (codeErreur=="5") {
					showWarning("Erreur : la commande est à l'état bloqué !");
				} else {
					showWarning("La commande est validée !");
					retourFicheAffaire();
				}
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_annulerCommande() {
	try {
		if (window.confirm("Voulez-vous annuler la commande ?")) {
			var qAnnulerCommande = new QueryHttp("Facturation/Affaires/annulerCommande.tmpl");
			qAnnulerCommande.setParam("Commande_Id", commandeId);
			var result=qAnnulerCommande.execute();
			var codeErreur = result.responseXML.documentElement.getAttribute("code_erreur");
			if (codeErreur=="1") {
				showWarning("Veuillez d'abord annuler les BL associés à cette commande !");
			} else if (codeErreur=="2") {
				showWarning("Impossible d'annuler la commande car elle est liée à une facture !");
			} else if (codeErreur=="3") {
				showWarning("Veuillez d'abord annuler les acomptes de cette commande !");
			} else {
				showWarning("La commande est annulée !");
				retourFicheAffaire();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_solderCommande() {
	try {
		if (window.confirm("Voulez-vous solder la commande ?")) {
			var qSolderCommande = new QueryHttp("Facturation/Affaires/solderCommande.tmpl");
			qSolderCommande.setParam("Commande_Id", commandeId);
			var result=qSolderCommande.execute();
			if (result.responseXML.documentElement.getAttribute("code_erreur")=="1") {
				showWarning("Veuillez d'abord valider les BL et factures associés à cette commande !");
			} else {
				showWarning("La commande est soldée !");
				retourFicheAffaire();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_bloquerCommande() {
	try {
		if (window.confirm("Voulez-vous bloquer la commande ?")) {
			var qBloquerCommande = new QueryHttp("Facturation/Affaires/bloquerCommande.tmpl");
			qBloquerCommande.setParam("Commande_Id", commandeId);
			var result=qBloquerCommande.execute();
			var errors = new Errors(result);
			if (errors.hasNext()) {		
				errors.show();
			}
			else {
				showWarning("La commande est bloquée !");
				oec_bloque = true;
				retourFicheAffaire();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oec_debloquerCommande() {
	try {
		if (window.confirm("Voulez-vous débloquer la commande ?")) {
			var qDebloquerCommande = new QueryHttp("Facturation/Affaires/debloquerCommande.tmpl");
			qDebloquerCommande.setParam("Commande_Id", commandeId);
			var result=qDebloquerCommande.execute();
			var errors = new Errors(result);
			if (errors.hasNext()) {		
				errors.show();
			}
			else {
				showWarning("La commande est débloquée !");
				oec_bloque = false;
				retourFicheAffaire();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_cloturerCommande() {
	try {
		if (window.confirm("Voulez-vous clôturer la commande ?")) {
			var qCloturerCommande = new QueryHttp("Facturation/Affaires/cloturerCommande.tmpl");
			qCloturerCommande.setParam("Commande_Id", commandeId);
			var result=qCloturerCommande.execute();
			var codeErreur=result.responseXML.documentElement.getAttribute("codeErreur");
			if (codeErreur=="1") {
				showWarning("Impossible de cloturer la commande, un bon de retour est en cours !");
			}
			else {
				showWarning("La commande est cloturée !");
				retourFicheAffaire();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oec_decloturerCommande() {
	try {
		if (window.confirm("Voulez-vous déclôturer la commande ?")) {
			var qDecloturerCommande = new QueryHttp("Facturation/Affaires/decloturerCommande.tmpl");
			qDecloturerCommande.setParam("Commande_Id", commandeId);
			var result=qDecloturerCommande.execute();
			showWarning("La commande est déclôturée !");
			oec_chargerCommande();
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function oec_modifierCommande() {
	try {
		oec_debloquerChamps();

		document.getElementById('oec-bAnnulerCommande').disabled=true;
		document.getElementById('oec-bModifier').disabled=true;
		document.getElementById('oec-bBloquer').disabled = true;
		document.getElementById('oec-bBloquer').collapsed = true;
		document.getElementById('oec-bDebloquer').disabled = true;
		document.getElementById('oec-bDebloquer').collapsed = true;
		document.getElementById('oec-bCloturer').disabled = true;
		document.getElementById('oec-bCloturer').collapsed = true;
		document.getElementById('oec-bDecloturer').disabled = true;
		document.getElementById('oec-bDecloturer').collapsed = true;
		document.getElementById('oec-bSolder').disabled=true;
		document.getElementById('oec-bVisualiser').disabled=true;
		document.getElementById('oec-bProforma').disabled=true;
		document.getElementById('oec-bCopierCommande').collapsed=true;
		document.getElementById('oec-assujettiTVA').disabled = (!oec_premiereCommande || oec_aArticles.nbLignes()>0);
		document.getElementById('oec-editionTTC').disabled = (!oec_premiereCommande || oec_aArticles.nbLignes()>0);
		document.getElementById('oec-codePaysLiv').disabled = (oec_aArticles.nbLignes()>0);
    document.getElementById('oec-bCopierFactVersLivEnvoi').disabled = (oec_aArticles.nbLignes()>0);
		document.getElementById('oec-codeTarif').disabled=true;
		document.getElementById('oec-regimeTVA').disabled=true;
		oec_mode = "M";
		oec_ajouterLigne("I");
		
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_editerProforma() {
  try {

  	if (oec_aArticles.nbLignes()==0) {
			showWarning("La commande ne contient aucune ligne !");
		}
		else {
			oec_typeEditionPdf = "Proforma";
			
			var qCreerProforma = new QueryHttp("Facturation/Affaires/creerProformaCommande.tmpl");
			qCreerProforma.setParam("Commande_Id", commandeId);
			var result = qCreerProforma.execute();
			oec_docIdPdf = result.responseXML.documentElement.getAttribute("Proforma_Id");
			
			var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
			qLangueDefaut.setParam("Type_Doc", "Proforma");
			qLangueDefaut.setParam("Doc_Id", oec_docIdPdf);
			var result = qLangueDefaut.execute();
			oec_langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
			oec_aLangues.setParam("Selection", oec_langueDefaut);
			oec_aLangues.initTree(oec_initLangue);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_visualiserProforma() {
  try {

  	document.getElementById('oec-pdfCommande').setAttribute('src', null);
		document.getElementById('oec-deckCommande').selectedIndex = 1;
		document.getElementById('oec-bSwitchPdf').collapsed=true;
		document.getElementById('bRetourCommande').collapsed = false;
		
		var langue = document.getElementById('oec-langueDefaut').value;
		var params = "&Proforma_Id="+ oec_docIdPdf +"&Langue="+ langue;
		
		var page = getUrlOpeneas("&Page=Facturation/Proforma/pdfProforma.tmpl"+ params);
		document.getElementById('oec-pdfCommande').setAttribute('src',page);

	} catch (e) {
    recup_erreur(e);
  }
}



function oec_switchPdf() {
	try {
		oec_editionPdf = (oec_editionPdf=='C'?'OF':'C');
		document.getElementById('oec-bSwitchPdf').setAttribute('label', oec_editionPdf=='C'?'Ordre de fabrication':'Commande client');
		oec_reediterPdf();
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_editerCommande() {
	try {
		if (oec_aArticles.nbLignes()==0) {
			showWarning("La commande ne contient aucune ligne !");
		} else {
			oec_editionInitiale = false;
			oec_typeEditionPdf = "Commande_Client";
			oec_docIdPdf = commandeId;
			
			var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
			qLangueDefaut.setParam("Type_Doc", "Commande_Client");
			qLangueDefaut.setParam("Doc_Id", commandeId);
			var result = qLangueDefaut.execute();
			oec_langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
			oec_aLangues.setParam("Selection", oec_langueDefaut);
			oec_aLangues.initTree(oec_initLangue);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_initLangue() {
	try {
		document.getElementById('oec-langueDefaut').value = oec_langueDefaut;
		if (oec_typeEditionPdf=="Acompte_Client") { oec_visualiserAcompte(); }
		else if (oec_typeEditionPdf=="Proforma") { oec_visualiserProforma(); }
		else { oec_visualiserCommande(); }
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_reediterPdf() {
	try {
		document.getElementById('oec-pdfCommande').setAttribute('src', null);
		var langue = document.getElementById('oec-langueDefaut').value;
		
		var params = "&Langue="+ langue;
		var page;
		if (oec_typeEditionPdf=="Acompte_Client") {
			params += "&Acompte_Id="+ oec_docIdPdf;
			page = getUrlOpeneas("&Page=Facturation/Affaires/pdfAcompte.tmpl"+ params);
		} else if (oec_typeEditionPdf=="Proforma") {
			params += "&Proforma_Id="+ oec_docIdPdf;
			page = getUrlOpeneas("&Page=Facturation/Proforma/pdfProforma.tmpl"+ params);
		} else {
			params += "&Commande_Id="+ commandeId;
			if (oec_editionInitiale) { params += "&Initiale=1"; }
			if (oec_editionPdf=='C') {
				oec_typeEditionPdf = "Commande_Client";
				page = getUrlOpeneas("&Page=Facturation/Affaires/pdfCommande.tmpl"+ params);
			} else {
				oec_typeEditionPdf = "Ordre_Fabrication";
				page = getUrlOpeneas("&Page=Facturation/Affaires/pdfCommande.tmpl&OF=1"+ params);
			}
		}
		document.getElementById('oec-pdfCommande').setAttribute('src', page);
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_editerCommandeInitiale() {
	try {
		if (oec_aArticles.nbLignes()==0) {
			showWarning("La commande ne contient aucune ligne !");
		} else {
			oec_editionInitiale = true;
			oec_typeEditionPdf = "Commande_Client";
			oec_docIdPdf = commandeId;
			
			var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
			qLangueDefaut.setParam("Type_Doc", "Commande_Client");
			qLangueDefaut.setParam("Initiale", "1");
			qLangueDefaut.setParam("Doc_Id", commandeId);
			var result = qLangueDefaut.execute();
			oec_langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
			oec_aLangues.setParam("Selection", oec_langueDefaut);
			oec_aLangues.initTree(oec_initLangue);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_visualiserCommande() {
  try {

  	if (oec_editionInitiale) { oec_demandeEnregistrement(); }
		oec_editionPdf='C';
		document.getElementById('oec-bSwitchPdf').setAttribute('label', 'Ordre de fabrication');
		document.getElementById('oec-pdfCommande').setAttribute('src', null);
		document.getElementById('oec-deckCommande').selectedIndex = 1;
		document.getElementById('oec-bSwitchPdf').collapsed=false;
		document.getElementById('bRetourCommande').collapsed = false;
		
		
		var langue = document.getElementById('oec-langueDefaut').value;
		var params = "&Commande_Id="+ commandeId +"&Langue="+ langue;
		if (oec_editionInitiale) { params += "&Initiale=1"; }
		
		var page = getUrlOpeneas("&Page=Facturation/Affaires/pdfCommande.tmpl"+ params);
		document.getElementById('oec-pdfCommande').setAttribute('src',page);

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_copierCommande() {
	try {
		var ok = true;
		if (oec_modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à la commande ?")) {
				ok = oec_enregistrerCommande(false);
			}
		}
			
		if (ok) {
			var url = "chrome://opensi/content/facturation/user/affaires/popup-copierCommande.xul?"+ cookie() +"&Commande_Id="+ commandeId;
  		window.openDialog(url,'','chrome,modal,centerscreen',oec_retourCopierCommande);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_retourCopierCommande(comId) {
	try {
		commandeId = comId;
		oec_chargerCommande();
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_nouvelAcompte() {
	try {
    var params = "&Commande_Id="+ commandeId;
    params += "&Code_Pays="+ document.getElementById("oec-codePaysLiv").value;
    params += "&Regime_TVA="+ document.getElementById("oec-regimeTVA").value;
    params += "&Assujetti_TVA="+ (oec_assujettiTVA?"1":"0");
    params += "&Client_Id="+ document.getElementById('oec-clientId').value;
    
		var url = "chrome://opensi/content/facturation/user/affaires/popup-creerAcompte.xul?"+ cookie() + params;
		window.openDialog(url,'','chrome,modal,centerscreen',oec_retourNouvelAcompte);
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_retourNouvelAcompte(acompteId) {
	try {
		oec_retourAcompte();
		oec_editerAcompte(acompteId);
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_editerAcompte(acompteId) {
	try {
		document.getElementById('oec-pdfCommande').setAttribute('src', null);
		document.getElementById('oec-deckCommande').selectedIndex = 1;
		document.getElementById('oec-bSwitchPdf').collapsed=true;
		document.getElementById('bRetourCommande').collapsed = false;
		
		oec_typeEditionPdf = "Acompte_Client";
		oec_docIdPdf = acompteId;
			
		var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
		qLangueDefaut.setParam("Type_Doc", "Acompte_Client");
		qLangueDefaut.setParam("Doc_Id", acompteId);
		var result = qLangueDefaut.execute();
		oec_langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
		oec_aLangues.setParam("Selection", oec_langueDefaut);
		oec_aLangues.initTree(oec_initLangue);
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_visualiserAcompte() {
  try {

  	var langue = document.getElementById('oec-langueDefaut').value;
		var page = getUrlOpeneas("&Page=Facturation/Affaires/pdfAcompte.tmpl&Acompte_Id="+ oec_docIdPdf +"&Langue="+ langue);
		document.getElementById('oec-pdfCommande').setAttribute('src',page);

	} catch (e) {
    recup_erreur(e);
  }
}


function oec_pressOnListeAcomptes() {
	try {
		if (oec_aAcomptes.isSelected()) {
			var i = oec_aAcomptes.getCurrentIndex();
			var statut = oec_aAcomptes.getCellText(i, 'oec-colStatut');
			var impute = oec_aAcomptes.getCellText(i, 'oec-colImpute');
			document.getElementById('oec-bAnnulerAcompte').disabled=(statut=="A" || impute=="true");
			document.getElementById('oec-bReediterAcompte').disabled=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_annulerAcompte() {
	try {
		if (oec_aAcomptes.isSelected() && window.confirm("Voulez-vous annuler cet acompte ?")) {
			var i = oec_aAcomptes.getCurrentIndex();
			var acompteId = oec_aAcomptes.getCellText(i, 'oec-colAcompteId');
			var qAnnulerAcompte = new QueryHttp("Facturation/Affaires/annulerAcompte.tmpl");
			qAnnulerAcompte.setParam("Acompte_Id", acompteId);
			var result = qAnnulerAcompte.execute();
			if (result.responseXML.documentElement.getAttribute("codeErreur")=="1") {
				showWarning("Veuillez d'abord désaffecter le règlement associé à l'acompte en suivi des règlements !");
			} else {
				oec_aAcomptes.initTree(oec_retourAcompte);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_retourAcompte() {
	try {
		oec_aAcomptes.initTree();
		document.getElementById('oec-bAnnulerAcompte').disabled=true;
		document.getElementById('oec-bReediterAcompte').disabled=true;
		var qGetCommande = new QueryHttp("Facturation/Affaires/getCommande.tmpl");
		qGetCommande.setParam("Commande_Id", commandeId);
		var result = qGetCommande.execute();
		var contenu = result.responseXML.documentElement;
		oec_acompte = contenu.getAttribute('Acompte');
		document.getElementById('oec-boxNouvelAcompte').collapsed = (contenu.getAttribute("Autoriser_Acompte")=="false");
		oec_calculTotaux();
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_reediterAcompte() {
	try {
		if (oec_aAcomptes.isSelected()) {
			var i = oec_aAcomptes.getCurrentIndex();
			var acompteId = oec_aAcomptes.getCellText(i, 'oec-colAcompteId');
			oec_editerAcompte(acompteId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_envoyerMail() {
	try {
		
		var langue = document.getElementById('oec-langueDefaut').value;
		var url = "chrome://opensi/content/facturation/user/affaires/popup-envoyerMail.xul?"+ cookie();
		url += "&Type_Doc="+ oec_typeEditionPdf +"&Doc_Id=" + oec_docIdPdf +"&Langue="+ langue;

		if (oec_typeEditionPdf!="Proforma" && oec_typeEditionPdf!="Acompte_Client" && oec_editionInitiale) { url += "&Initiale=1"; }

		window.openDialog(url,'','chrome,modal,centerscreen');
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_nouveauReglement() {
	try {
    var params = "&Commande_Id="+ commandeId;
    params += "&Client_Id="+ urlEncode(document.getElementById('oec-clientId').value);
    params += "&Denomination="+ urlEncode(document.getElementById('oec-denominationFact').value);
    params += "&Mode_Reg_Id="+ document.getElementById('oec-modeReglement').value;
    
		var url = "chrome://opensi/content/facturation/user/affaires/popup-creerReglement.xul?"+ cookie() + params;
		window.openDialog(url,'','chrome,modal,centerscreen',oec_retourNouveauReglement);
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_retourNouveauReglement() {
	try {
		oec_aListeReglements.initTree();
		
		// maj totaux encaissements
		var qGetCommande = new QueryHttp("Facturation/Affaires/getCommande.tmpl");
		qGetCommande.setParam("Commande_Id", commandeId);
		var result = qGetCommande.execute();
		var contenu = result.responseXML.documentElement;
		document.getElementById('oec-caTTCPaye').value = contenu.getAttribute("CA_TTC_Paye");
		document.getElementById('oec-pourcCATTCPaye').value = contenu.getAttribute("Pourc_CA_TTC_Paye");
		document.getElementById('oec-soldeAEncaisser').value = contenu.getAttribute("Solde_A_Encaisser");
		document.getElementById('oec-pourcSoldeAEncaisser').value = contenu.getAttribute("Pourc_Solde_A_Encaisser");
		document.getElementById('oec-encoursActuel').value = contenu.getAttribute("En_Cours_Actuel") + " \u20AC";
		var statutPaiement = contenu.getAttribute("Statut_Paiement");
		var libelleStatutPaiement = "";
		if (statutPaiement=="0") { libelleStatutPaiement = "Non payée"; }
		else if (statutPaiement=="1") { libelleStatutPaiement = "Payée"; }
		else if (statutPaiement=="2") { libelleStatutPaiement = "Part. payée"; }
		document.getElementById('oec-statutPaiement').value = libelleStatutPaiement;
	} catch (e) {
		recup_erreur(e);
	}
}


function oec_initVersion() {
	try {
		
		oec_aVersion.setParam("Type_Document", "Commande_Client");
		oec_aVersion.setParam("Document_Id", commandeId);
		oec_aVersion.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}


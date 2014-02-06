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


var oea_modeLigne;
var oea_codeTvaPort;
var oea_tauxTvaPort;
var oea_zoneUE;
var oea_modeTarif;
var oea_mode;
var oea_defEditionTTC;
var oea_editionTTC;
var oea_assujettiTVA;
var oea_defCommission;
var oea_typeRemise;
var oea_typeRemiseFP;
var oea_chargerResponsable;
var oea_currentIndex;
var oea_montantHT;
var oea_montantTTC;

var oea_typeLigne;
var oea_tarifId;
var oea_ligneId;
var oea_libelle;
var oea_modifie = false;
var oea_langueDefaut;
var oea_apercu;

var oea_aResponsables = new Arbre("ComboListe/combo-responsables.tmpl","oea-responsable");
var oea_aUnites = new Arbre("Facturation/Affaires/liste-unitesVente.tmpl", "oea-unite");
var oea_aCodesTarifs = new Arbre("Facturation/Affaires/liste-codesTarifs.tmpl", "oea-codeTarif");
var oea_aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "oea-secteur");
var oea_aPaysFact = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oea-codePaysFact");
var oea_aPaysLiv = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oea-codePaysLiv");
var oea_aPaysEnvoi = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oea-codePaysEnvoi");
var oea_aCodesTVA = new Arbre("Facturation/Affaires/liste-tauxTva.tmpl", "oea-codeTVA");
var oea_aArticles = new Arbre("Facturation/Affaires/liste-articlesAvoir.tmpl", "oea-articles");
var oea_aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","oea-listeVersion");
var oea_aLangues = new Arbre("Config/GetRDF/liste-langues.tmpl", "oea-langueDefaut");


function oea_init() {
  try {
    
    var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();
		
		var actCodeStats = (result.responseXML.documentElement.getAttribute('Act_Code_Stats')=="1");
		if (!actCodeStats) {
			document.getElementById('oea-colCodeStats').collapsed = true;
			document.getElementById('oea-colCodeStats').setAttribute('ignoreincolumnpicker', true);
	  	document.getElementById('oea-actCodeStats').collapsed = true;
		} else {
			document.getElementById('oea-labelRef').setAttribute('style', 'margin-left:0px');
			document.getElementById('oea-reference').setAttribute('style', 'margin-left:0px');
		}
		
		var produitFrais = (result.responseXML.documentElement.getAttribute('Produit_Frais')=="1");
		if (!produitFrais) {
			document.getElementById('oea-colNumLot').collapsed = true;
			document.getElementById('oea-colNumLot').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oea-colNbPieces').collapsed = true;
			document.getElementById('oea-colNbPieces').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oea-colUnite').collapsed = true;
			document.getElementById('oea-colUnite').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oea-colDatePeremption').collapsed = true;
			document.getElementById('oea-colDatePeremption').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oea-produitFrais1').collapsed = true;
			document.getElementById('oea-produitFrais2').collapsed = true;
			document.getElementById('oea-produitFrais3').collapsed = true;
			document.getElementById('oea-produitFrais4').collapsed = true;
		}
		
		var commission = (result.responseXML.documentElement.getAttribute('Act_Commission')=="1");
		if (!commission) {
			document.getElementById('oea-colTauxCommission').collapsed = true;
			document.getElementById('oea-colTauxCommission').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oea-colMontantCommission').collapsed = true;
			document.getElementById('oea-colMontantCommission').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oea-actCommission').collapsed = true;
		}
		
		oea_defEditionTTC = (result.responseXML.documentElement.getAttribute('Vente_TTC')=="1");
		oea_modeTarif = result.responseXML.documentElement.getAttribute('Mode_Tarif');
		if (oea_modeTarif=='Q') {
			document.getElementById('oea-rowTarif').collapsed = true;
		}
		
		oea_aCodesTarifs.initTree(oea_initCodeTarif);

	} catch (e) {
  	recup_erreur(e);
	}
}

function oea_initCodeTarif() {
	try {
		document.getElementById('oea-codeTarif').selectedIndex=0;
		oea_aUnites.initTree(oea_initUnite);
	} catch (e) {
		recup_erreur(e);
	}
}

function oea_initUnite() {
	try {
    document.getElementById('oea-unite').selectedIndex = 0;
    oea_aSecteurs.initTree(oea_initSecteur);
	} catch (e) {
    recup_erreur(e);
  }
}

function oea_initSecteur() {
	try {
		document.getElementById('oea-secteur').selectedIndex = 0;
		oea_aPaysFact.initTree(oea_initPaysFact);
	} catch (e) {
		recup_erreur(e);
	}
}

function oea_initPaysFact() {
	try {
		document.getElementById('oea-codePaysFact').value = "FR";
		oea_aPaysLiv.initTree(oea_initPaysLiv);
	} catch (e) {
    recup_erreur(e);
  }
}

function oea_initPaysLiv() {
	try {
		document.getElementById('oea-codePaysLiv').value = "FR";
		oea_aPaysEnvoi.initTree(oea_initPaysEnvoi);
	} catch (e) {
    recup_erreur(e);
  }
}

function oea_initPaysEnvoi() {
	try {
		document.getElementById('oea-codePaysEnvoi').value = "FR";
	} catch (e) {
    recup_erreur(e);
  }
}


function oea_chargerResponsables(selection) {
	try {
		oea_chargerResponsable = selection;
		oea_aResponsables.setParam("Selection", oea_chargerResponsable);
		oea_aResponsables.initTree(oea_initResponsable);
	} catch (e) {
		recup_erreur(e);
	}
}

function oea_initResponsable() {
  try {
		document.getElementById('oea-responsable').value = oea_chargerResponsable;
	} catch (e) {
  	recup_erreur(e);
	}
}



function oea_reinitialiser() {
	try {
		
		oea_modeLigne = "C";
		oea_currentIndex = 0;
		oea_zoneUE=false;
		
		oea_assujettiTVA = false;
		oea_typeRemise = "P";
		oea_typeRemiseFP = "P";
		oea_editionTTC = oea_defEditionTTC;
		oea_defCommission = 0;
		oea_chargerResponsable = "0";
		oea_montantHT = 0;
		oea_montantTTC = 0;
		oea_apercu = false;
		
		document.getElementById('oea-deckAvoir').selectedIndex = 0;
		document.getElementById('oea-tabBoxAvoir').selectedIndex = 0;
		document.getElementById('oea-boxMail').collapsed=false;
		document.getElementById('oea-tabAvoir').setAttribute('image', null);
		document.getElementById('oea-numAffaire').value = "";
		document.getElementById('oea-numAvoir').value = "";
		document.getElementById('oea-dateAvoir').value = "";
		document.getElementById('oea-modeEnvoiAvoir').selectedIndex=0;
		document.getElementById('oea-codeTarif').selectedIndex=0;
		document.getElementById('oea-assujettiTVA').checked = false;
		document.getElementById('oea-numTVA').value = "";
		document.getElementById('oea-regimeTVA').selectedIndex=0;
		document.getElementById('oea-editionTTC').checked = oea_editionTTC;
		document.getElementById('oea-secteur').selectedIndex = 0;
		
		oea_aVersion.deleteTree();
		
		document.getElementById('oea-clientId').value = "";
		document.getElementById('oea-labelClient').value = "";
		
		oea_aResponsables.deleteTree();
		
		document.getElementById('oea-tabBoxAdresses').selectedIndex = 0;
		document.getElementById('oea-denominationFact').value = "";
		document.getElementById('oea-adresse1Fact').value = "";
		document.getElementById('oea-adresse2Fact').value = "";
		document.getElementById('oea-adresse3Fact').value = "";
		document.getElementById('oea-codePostalFact').value = "";
		document.getElementById('oea-villeFact').value = "";
		document.getElementById('oea-codePaysFact').value = "FR";
		document.getElementById('oea-civInterFact').selectedIndex = 0;
		document.getElementById('oea-nomInterFact').value = "";
		document.getElementById('oea-prenomInterFact').value = "";
		document.getElementById('oea-telInterFact').value = "";
		document.getElementById('oea-faxInterFact').value = "";
		document.getElementById('oea-emailInterFact').value = "";
		document.getElementById('oea-denominationLiv').value = "";
		document.getElementById('oea-adresse1Liv').value = "";
		document.getElementById('oea-adresse2Liv').value = "";
		document.getElementById('oea-adresse3Liv').value = "";
		document.getElementById('oea-codePostalLiv').value = "";
		document.getElementById('oea-villeLiv').value = "";
		document.getElementById('oea-codePaysLiv').value = "FR";
		oea_calculerTvaPort();
		document.getElementById('oea-civInterLiv').selectedIndex = 0;
		document.getElementById('oea-nomInterLiv').value = "";
		document.getElementById('oea-prenomInterLiv').value = "";
		document.getElementById('oea-telInterLiv').value = "";
		document.getElementById('oea-faxInterLiv').value = "";
		document.getElementById('oea-emailInterLiv').value = "";
		document.getElementById('oea-denominationEnvoi').value = "";
		document.getElementById('oea-adresse1Envoi').value = "";
		document.getElementById('oea-adresse2Envoi').value = "";
		document.getElementById('oea-adresse3Envoi').value = "";
		document.getElementById('oea-codePostalEnvoi').value = "";
		document.getElementById('oea-villeEnvoi').value = "";
		document.getElementById('oea-codePaysEnvoi').value = "FR";
		document.getElementById('oea-civInterEnvoi').selectedIndex = 0;
		document.getElementById('oea-nomInterEnvoi').value = "";
		document.getElementById('oea-prenomInterEnvoi').value = "";
		document.getElementById('oea-telInterEnvoi').value = "";
		document.getElementById('oea-faxInterEnvoi').value = "";
		document.getElementById('oea-emailInterEnvoi').value = "";
		
		document.getElementById('oea-codeStats').value = "";
		document.getElementById('oea-reference').value = "";
		document.getElementById('oea-designation').value = "";
		document.getElementById('oea-numLot').value = "";
		document.getElementById('oea-nbPieces').value = "";
		document.getElementById('oea-quantite').value = "";
		document.getElementById('oea-unite').value = "U";
		document.getElementById('oea-datePeremption').value = "";
		document.getElementById('oea-PU').value = "";
		document.getElementById('oea-ristourne').value = "";
		document.getElementById('oea-commission').value = "";
		document.getElementById('oea-codeTVA').value = getCodeTvaNormal(document.getElementById('oea-codePaysLiv').value, oea_assujettiTVA, document.getElementById('oea-regimeTVA').value);
		
		document.getElementById('oea-commentairesFin').value = "";
		document.getElementById('oea-commentairesInt').value = "";
		document.getElementById('oea-bRemise').setAttribute('class', 'bIcoPourcentage');
		document.getElementById('oea-remise').value = "0.00";
		document.getElementById('oea-fraisPort').value = "0.00";
		document.getElementById('oea-bRemiseFP').setAttribute('class', 'bIcoPourcentage');
		document.getElementById('oea-remiseFP').value = "0.00";
		document.getElementById('oea-escompte').value = "0.00";
		
		document.getElementById('oea-colTotal').setAttribute("label", oea_editionTTC?"Total TTC":"Total HT");
		document.getElementById('oea-colPU').setAttribute("label", oea_editionTTC?"P.U TTC":"P.U HT");
		document.getElementById('oea-lblFraisPort').value = (oea_editionTTC?"Frais de port (ttc) :":"Frais de port (ht) :");
		document.getElementById('oea-lblPU').value = (oea_editionTTC?"P.U TTC :":"P.U HT :");
		document.getElementById('oea-piedTTC').collapsed = !oea_editionTTC;
		document.getElementById('oea-piedHT').collapsed = oea_editionTTC;
		document.getElementById('oea-montantHT').value = "0.00";
		document.getElementById('oea-montantRemise').value = "0.00";
		document.getElementById('oea-montantFraisPort').value = "0.00";
		document.getElementById('oea-montantRemiseFP').value = "0.00";
		document.getElementById('oea-totalHT').value = "0.00";
		document.getElementById('oea-commissionHT').value = "0.00";
		document.getElementById('oea-TVA').value = "0.00";
		document.getElementById('oea-montantTTC').value = "0.00";
		document.getElementById('oea-montantEscompte').value = "0.00";
		document.getElementById('oea-totalTTC').value = "0.00";
		document.getElementById('oea-pttcMontantTTC').value = "0.00";
		document.getElementById('oea-pttcMontantRemise').value = "0.00";
		document.getElementById('oea-pttcMontantFraisPort').value = "0.00";
		document.getElementById('oea-pttcMontantRemiseFP').value = "0.00";
		document.getElementById('oea-pttcTotalTTC').value = "0.00";
		document.getElementById('oea-pttcCommissionTTC').value = "0.00";
		document.getElementById('oea-pttcTVA').value = "0.00";
		document.getElementById('oea-pttcMontantEscompte').value = "0.00";
		document.getElementById('oea-pttcNetTTC').value = "0.00";
		
		document.getElementById('oea-rowRemiseHT').collapsed = true;
		document.getElementById('oea-rowRemiseFPHT').collapsed = true;
		document.getElementById('oea-rowCommissionHT').collapsed = true;
		document.getElementById('oea-rowMontantTTC').collapsed = true;
		document.getElementById('oea-rowEscompteHT').collapsed = true;
		document.getElementById('oea-rowRemiseTTC').collapsed = true;
		document.getElementById('oea-rowRemiseFPTTC').collapsed = true;
		document.getElementById('oea-rowCommissionTTC').collapsed = true;
		document.getElementById('oea-rowEscompteTTC').collapsed = true;
		
		document.getElementById('oea-creation').setAttribute("label", "");
		document.getElementById('oea-modification').setAttribute("label", "");
		document.getElementById('oea-fiche').setAttribute("label", "");
		
		oea_typeLigne = "";
		oea_tarifId = "";
		oea_ligneId = "";
		oea_libelle = "";
		oea_modifie = false;
		
		document.getElementById('oea-modeEnvoiAvoir').disabled = true;
		document.getElementById('oea-responsable').disabled = true;
		document.getElementById('oea-secteur').disabled = true;
		document.getElementById('oea-assujettiTVA').disabled = true;
		document.getElementById('oea-numTVA').disabled = true;
		document.getElementById('oea-regimeTVA').disabled = true;
		document.getElementById('oea-editionTTC').disabled = true;
		document.getElementById('oea-bChercherClient').disabled = true;
		document.getElementById('oea-denominationFact').disabled = true;
		document.getElementById('oea-adresse1Fact').disabled = true;
		document.getElementById('oea-adresse2Fact').disabled = true;
		document.getElementById('oea-adresse3Fact').disabled = true;
		document.getElementById('oea-codePostalFact').disabled = true;
		document.getElementById('oea-villeFact').disabled = true;
		document.getElementById('oea-codePaysFact').disabled = true;
		document.getElementById('oea-civInterFact').disabled = true;
		document.getElementById('oea-nomInterFact').disabled = true;
		document.getElementById('oea-prenomInterFact').disabled = true;
		document.getElementById('oea-telInterFact').disabled = true;
		document.getElementById('oea-faxInterFact').disabled = true;
		document.getElementById('oea-emailInterFact').disabled = true;
		document.getElementById('oea-bChercherAdrFact').disabled = true;
		document.getElementById('oea-bChercherInter').disabled = true;
		document.getElementById('oea-bCopierFactVersLivEnvoi').disabled = true;
		document.getElementById('oea-codeTarif').disabled = true;
		document.getElementById('oea-denominationLiv').disabled = true;
		document.getElementById('oea-adresse1Liv').disabled = true;
		document.getElementById('oea-adresse2Liv').disabled = true;
		document.getElementById('oea-adresse3Liv').disabled = true;
		document.getElementById('oea-codePostalLiv').disabled = true;
		document.getElementById('oea-villeLiv').disabled = true;
		document.getElementById('oea-codePaysLiv').disabled = true;
		document.getElementById('oea-civInterLiv').disabled = true;
		document.getElementById('oea-nomInterLiv').disabled = true;
		document.getElementById('oea-prenomInterLiv').disabled = true;
		document.getElementById('oea-telInterLiv').disabled = true;
		document.getElementById('oea-faxInterLiv').disabled = true;
		document.getElementById('oea-emailInterLiv').disabled = true;
		document.getElementById('oea-bChercherAdrLiv').disabled = true;
		document.getElementById('oea-bChercherInterLiv').disabled = true;
		document.getElementById('oea-denominationEnvoi').disabled = true;
		document.getElementById('oea-adresse1Envoi').disabled = true;
		document.getElementById('oea-adresse2Envoi').disabled = true;
		document.getElementById('oea-adresse3Envoi').disabled = true;
		document.getElementById('oea-codePostalEnvoi').disabled = true;
		document.getElementById('oea-villeEnvoi').disabled = true;
		document.getElementById('oea-codePaysEnvoi').disabled = true;
		document.getElementById('oea-civInterEnvoi').disabled = true;
		document.getElementById('oea-nomInterEnvoi').disabled = true;
		document.getElementById('oea-prenomInterEnvoi').disabled = true;
		document.getElementById('oea-telInterEnvoi').disabled = true;
		document.getElementById('oea-faxInterEnvoi').disabled = true;
		document.getElementById('oea-emailInterEnvoi').disabled = true;
		document.getElementById('oea-bChercherAdrEnvoi').disabled = true;
		document.getElementById('oea-bChercherInterEnvoi').disabled = true;
		
		document.getElementById('oea-commentairesFin').disabled = true;
		document.getElementById('oea-commentairesInt').disabled = true;
		document.getElementById('oea-bOuvrirCommentairesCaches').disabled = true;
		document.getElementById('oea-bChoisirMentions').disabled = true;
		document.getElementById('oea-bRemise').disabled = true;
		document.getElementById('oea-remise').disabled = true;
		document.getElementById('oea-fraisPort').disabled = true;
		document.getElementById('oea-bRemiseFP').disabled = true;
		document.getElementById('oea-remiseFP').disabled = true;
		document.getElementById('oea-escompte').disabled = true;
		document.getElementById('oea-bEnregistrer').disabled = true;
		document.getElementById('oea-bApercu').disabled = true;
		document.getElementById('oea-bVisualiser').disabled = true;
		document.getElementById('oea-bSupprimerAvoir').disabled = true;
		
		document.getElementById('oea-codeStats').disabled = true;
		document.getElementById('oea-reference').disabled = true;
		document.getElementById('oea-designation').disabled = true;
		document.getElementById('oea-numLot').disabled = true;
		document.getElementById('oea-nbPieces').disabled = true;
		document.getElementById('oea-quantite').disabled = true;
		document.getElementById('oea-unite').disabled = true;
		document.getElementById('oea-datePeremption').disabled = true;
		document.getElementById('oea-PU').disabled = true;
		document.getElementById('oea-ristourne').disabled = true;
		document.getElementById('oea-commission').disabled = true;
		document.getElementById('oea-codeTVA').disabled = true;
		document.getElementById('oea-bSupprimer').disabled = true;
		document.getElementById('oea-bFlecheHaut').disabled = true;
		document.getElementById('oea-bFlecheBas').disabled = true;
		document.getElementById('oea-bValider').disabled = true;
		document.getElementById('oea-bAnnuler').disabled = true;
		document.getElementById('oea-bArticle').disabled = true;
		document.getElementById('oea-bCommentaire').disabled = true;
		oea_aArticles.deleteTree();
		
		document.getElementById('oea-pdfAvoir').setAttribute('src', null);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_calculerTvaPort() {
	try {
		oea_codeTvaPort = getCodeTvaNormal(document.getElementById("oea-codePaysLiv").value,oea_assujettiTVA,document.getElementById("oea-regimeTVA").value);
		oea_tauxTvaPort = getTva(oea_codeTvaPort);
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_afficherNumAffaire() {
	try {
		
		var qGetNumAffaire = new QueryHttp("Facturation/Affaires/getNumAffaire.tmpl");
		qGetNumAffaire.setParam("Affaire_Id", affaireId);
		var result = qGetNumAffaire.execute();
		document.getElementById('oea-numAffaire').value = result.responseXML.documentElement.getAttribute("Num_Entier");

	} catch (e) {
		recup_erreur(e);
	}
}


function oea_debloquerChamps() {
	try {
		document.getElementById('oea-modeEnvoiAvoir').disabled = false;
		document.getElementById('oea-responsable').disabled = false;
		document.getElementById('oea-secteur').disabled = false;
		document.getElementById('oea-assujettiTVA').disabled = false;
		document.getElementById('oea-regimeTVA').disabled = false;
		document.getElementById('oea-editionTTC').disabled = false;
		document.getElementById('oea-bChercherClient').disabled = false;
		document.getElementById('oea-denominationFact').disabled = false;
		document.getElementById('oea-adresse1Fact').disabled = false;
		document.getElementById('oea-adresse2Fact').disabled = false;
		document.getElementById('oea-adresse3Fact').disabled = false;
		document.getElementById('oea-codePostalFact').disabled = false;
		document.getElementById('oea-villeFact').disabled = false;
		document.getElementById('oea-codePaysFact').disabled = false;
		document.getElementById('oea-civInterFact').disabled = false;
		document.getElementById('oea-nomInterFact').disabled = false;
		document.getElementById('oea-prenomInterFact').disabled = false;
		document.getElementById('oea-telInterFact').disabled = false;
		document.getElementById('oea-faxInterFact').disabled = false;
		document.getElementById('oea-emailInterFact').disabled = false;
		document.getElementById('oea-bCopierFactVersLivEnvoi').disabled = false;
		document.getElementById('oea-codeTarif').disabled = false;
		document.getElementById('oea-denominationLiv').disabled = false;
		document.getElementById('oea-adresse1Liv').disabled = false;
		document.getElementById('oea-adresse2Liv').disabled = false;
		document.getElementById('oea-adresse3Liv').disabled = false;
		document.getElementById('oea-codePostalLiv').disabled = false;
		document.getElementById('oea-villeLiv').disabled = false;
		document.getElementById('oea-codePaysLiv').disabled = false;
		document.getElementById('oea-civInterLiv').disabled = false;
		document.getElementById('oea-nomInterLiv').disabled = false;
		document.getElementById('oea-prenomInterLiv').disabled = false;
		document.getElementById('oea-telInterLiv').disabled = false;
		document.getElementById('oea-faxInterLiv').disabled = false;
		document.getElementById('oea-emailInterLiv').disabled = false;
		document.getElementById('oea-denominationEnvoi').disabled = false;
		document.getElementById('oea-adresse1Envoi').disabled = false;
		document.getElementById('oea-adresse2Envoi').disabled = false;
		document.getElementById('oea-adresse3Envoi').disabled = false;
		document.getElementById('oea-codePostalEnvoi').disabled = false;
		document.getElementById('oea-villeEnvoi').disabled = false;
		document.getElementById('oea-codePaysEnvoi').disabled = false;
		document.getElementById('oea-civInterEnvoi').disabled = false;
		document.getElementById('oea-nomInterEnvoi').disabled = false;
		document.getElementById('oea-prenomInterEnvoi').disabled = false;
		document.getElementById('oea-telInterEnvoi').disabled = false;
		document.getElementById('oea-faxInterEnvoi').disabled = false;
		document.getElementById('oea-emailInterEnvoi').disabled = false;
		
		document.getElementById('oea-commentairesFin').disabled = false;
		document.getElementById('oea-commentairesInt').disabled = false;
		document.getElementById('oea-bChoisirMentions').disabled = false;
		document.getElementById('oea-bRemise').disabled = false;
		document.getElementById('oea-remise').disabled = false;
		document.getElementById('oea-fraisPort').disabled = false;
		document.getElementById('oea-bRemiseFP').disabled = false;
		document.getElementById('oea-remiseFP').disabled = false;
		document.getElementById('oea-escompte').disabled = false;
		document.getElementById('oea-bEnregistrer').disabled = false;
		
		document.getElementById('oea-codeStats').disabled = false;
		document.getElementById('oea-reference').disabled = false;
		document.getElementById('oea-designation').disabled = false;
		document.getElementById('oea-numLot').disabled = false;
		document.getElementById('oea-nbPieces').disabled = false;
		document.getElementById('oea-quantite').disabled = false;
		document.getElementById('oea-unite').disabled = false;
		document.getElementById('oea-datePeremption').disabled = false;
		document.getElementById('oea-PU').disabled = false;
		document.getElementById('oea-ristourne').disabled = false;
		document.getElementById('oea-commission').disabled = false;
		document.getElementById('oea-codeTVA').disabled = false;
		document.getElementById('oea-bValider').disabled = false;
		document.getElementById('oea-bAnnuler').disabled = false;
		document.getElementById('oea-bArticle').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}



function oea_chargerAvoir() {
	try {
		oea_mode = "M";
		oea_reinitialiser();
		
		oea_aArticles.setParam("Avoir_Id", avoirId);
		oea_aArticles.initTree(oea_chargerAvoir2);
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_chargerAvoir2() {
  try {
		
		var qGetAvoir = new QueryHttp("Facturation/Affaires/getAvoir.tmpl");
		qGetAvoir.setParam("Avoir_Id", avoirId);
		var result = qGetAvoir.execute();

		var contenu = result.responseXML.documentElement;
		
		affaireId = contenu.getAttribute('Affaire_Id');
		oea_defCommission = contenu.getAttribute("Def_Commission");

		var numAvoir = contenu.getAttribute('Num_Entier');

		oea_typeRemise = (parseFloat(contenu.getAttribute('Montant_Remise'))!=0?'M':'P');
		document.getElementById('oea-remise').value = (oea_typeRemise=='P'?contenu.getAttribute('Remise'):contenu.getAttribute('Montant_Remise'));
		document.getElementById('oea-bRemise').setAttribute("class", (oea_typeRemise=='P'?"bIcoPourcentage":"bIcoEuro"));
		
		oea_typeRemiseFP = (parseFloat(contenu.getAttribute('MRemise_FP'))!=0?'M':'P');
		document.getElementById('oea-remiseFP').value = (oea_typeRemiseFP=='P'?contenu.getAttribute('PRemise_FP'):contenu.getAttribute('MRemise_FP'));
		document.getElementById('oea-bRemiseFP').setAttribute("class", (oea_typeRemiseFP=='P'?"bIcoPourcentage":"bIcoEuro"));
		
		document.getElementById('oea-escompte').value = contenu.getAttribute('Escompte');
		document.getElementById('oea-fraisPort').value = contenu.getAttribute('Frais_Port');
		document.getElementById('oea-commentairesFin').value = contenu.getAttribute('Commentaires_Fin');
		document.getElementById('oea-commentairesInt').value = contenu.getAttribute('Commentaires_Int');
		document.getElementById('oea-dateAvoir').value = contenu.getAttribute('Date_Avoir');
		document.getElementById('oea-numAvoir').value = numAvoir;
		document.getElementById('oea-modeEnvoiAvoir').value = contenu.getAttribute('Mode_Envoi_Avoir');
		document.getElementById('oea-secteur').value = contenu.getAttribute('Secteur_Activite');

		document.getElementById('oea-denominationFact').value = contenu.getAttribute('Denomination');
		document.getElementById('oea-adresse1Fact').value = contenu.getAttribute('Adresse_1');
		document.getElementById('oea-adresse2Fact').value = contenu.getAttribute('Adresse_2');
		document.getElementById('oea-adresse3Fact').value = contenu.getAttribute('Adresse_3');
		document.getElementById('oea-codePostalFact').value = contenu.getAttribute('Code_Postal');
		document.getElementById('oea-villeFact').value = contenu.getAttribute('Ville');
		document.getElementById('oea-codePaysFact').value = contenu.getAttribute('Code_Pays');
		document.getElementById('oea-civInterFact').value = contenu.getAttribute('Civ_Inter');
		document.getElementById('oea-nomInterFact').value = contenu.getAttribute('Nom_Inter');
		document.getElementById('oea-prenomInterFact').value = contenu.getAttribute('Prenom_Inter');
		document.getElementById('oea-telInterFact').value = contenu.getAttribute('Tel_Inter');
		document.getElementById('oea-faxInterFact').value = contenu.getAttribute('Fax_Inter');
		document.getElementById('oea-emailInterFact').value = contenu.getAttribute('Email_Inter');
		
		document.getElementById('oea-denominationLiv').value = contenu.getAttribute('Denomination_Liv');
		document.getElementById('oea-adresse1Liv').value = contenu.getAttribute('Adresse_1_Liv');
		document.getElementById('oea-adresse2Liv').value = contenu.getAttribute('Adresse_2_Liv');
		document.getElementById('oea-adresse3Liv').value = contenu.getAttribute('Adresse_3_Liv');
		document.getElementById('oea-codePostalLiv').value = contenu.getAttribute('Code_Postal_Liv');
		document.getElementById('oea-villeLiv').value = contenu.getAttribute('Ville_Liv');
		document.getElementById('oea-codePaysLiv').value = contenu.getAttribute('Code_Pays_Liv');
		document.getElementById('oea-civInterLiv').value = contenu.getAttribute('Civ_Inter_Liv');
		document.getElementById('oea-nomInterLiv').value = contenu.getAttribute('Nom_Inter_Liv');
		document.getElementById('oea-prenomInterLiv').value = contenu.getAttribute('Prenom_Inter_Liv');
		document.getElementById('oea-telInterLiv').value = contenu.getAttribute('Tel_Inter_Liv');
		document.getElementById('oea-faxInterLiv').value = contenu.getAttribute('Fax_Inter_Liv');
		document.getElementById('oea-emailInterLiv').value = contenu.getAttribute('Email_Inter_Liv');
		
		document.getElementById('oea-denominationEnvoi').value = contenu.getAttribute('Denomination_Envoi');
		document.getElementById('oea-adresse1Envoi').value = contenu.getAttribute('Adresse_1_Envoi');
		document.getElementById('oea-adresse2Envoi').value = contenu.getAttribute('Adresse_2_Envoi');
		document.getElementById('oea-adresse3Envoi').value = contenu.getAttribute('Adresse_3_Envoi');
		document.getElementById('oea-codePostalEnvoi').value = contenu.getAttribute('Code_Postal_Envoi');
		document.getElementById('oea-villeEnvoi').value = contenu.getAttribute('Ville_Envoi');
		document.getElementById('oea-codePaysEnvoi').value = contenu.getAttribute('Code_Pays_Envoi');
		document.getElementById('oea-civInterEnvoi').value = contenu.getAttribute('Civ_Inter_Envoi');
		document.getElementById('oea-nomInterEnvoi').value = contenu.getAttribute('Nom_Inter_Envoi');
		document.getElementById('oea-prenomInterEnvoi').value = contenu.getAttribute('Prenom_Inter_Envoi');
		document.getElementById('oea-telInterEnvoi').value = contenu.getAttribute('Tel_Inter_Envoi');
		document.getElementById('oea-faxInterEnvoi').value = contenu.getAttribute('Fax_Inter_Envoi');
		document.getElementById('oea-emailInterEnvoi').value = contenu.getAttribute('Email_Inter_Envoi');

		document.getElementById('oea-codeTarif').value = contenu.getAttribute('Code_Tarif');
		document.getElementById('oea-regimeTVA').value = contenu.getAttribute('Regime_TVA');
		oea_codeTvaPort = contenu.getAttribute('Code_TVA_Port');
		oea_tauxTvaPort = contenu.getAttribute('Taux_TVA_Port');
		oea_assujettiTVA = (contenu.getAttribute('Assujetti_TVA')=="1");		
		oea_selectPaysLiv();
		
		var typeEdition = (contenu.getAttribute('Edition_TTC')=="1");
		
		document.getElementById('oea-editionTTC').checked = typeEdition;
		
		document.getElementById('oea-assujettiTVA').checked = oea_assujettiTVA;
		document.getElementById('oea-numTVA').value = contenu.getAttribute("Num_TVA_Intra");

		var clientId = contenu.getAttribute('Client_Id');
    document.getElementById('oea-clientId').value = clientId;
		var clientConnu = (clientId!="");
		
		if (clientConnu) {
			document.getElementById('oea-labelClient').setAttribute("value", clientId);
		}
		
		oea_chargerResponsables(contenu.getAttribute('Util_R'));

		document.getElementById('oea-creation').setAttribute("label", "Avoir créé le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur'));
		document.getElementById('oea-modification').setAttribute("label", "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj'));
		document.getElementById('oea-fiche').setAttribute("label", "Avoir N° "+ numAvoir);
		document.getElementById('oea-creation').collapsed = false;
		document.getElementById('oea-modification').collapsed = false;

		oea_initVersion();
		
		oea_modifie = false;
		document.getElementById('oea-tabAvoir').setAttribute('image', null);
		
		document.getElementById('oea-bOuvrirCommentairesCaches').disabled = false;

		if (parseIntBis(contenu.getAttribute('Numero'))>0) {
			oea_mode = "V";
		} else {
			oea_debloquerChamps();
			document.getElementById('oea-bChercherAdrFact').disabled = !clientConnu;
			document.getElementById('oea-bChercherInter').disabled = !clientConnu;
			document.getElementById('oea-bChercherAdrLiv').disabled = !clientConnu;
			document.getElementById('oea-bChercherInterLiv').disabled = !clientConnu;
			document.getElementById('oea-bChercherAdrEnvoi').disabled = !clientConnu;
			document.getElementById('oea-bChercherInterEnvoi').disabled = !clientConnu;
			document.getElementById('oea-numTVA').disabled = !oea_assujettiTVA;
			document.getElementById('oea-bSupprimerAvoir').disabled = false;
			oea_ajouterLigne("I");
		}
		document.getElementById('oea-bOuvrirCommentairesCaches').disabled = false;
		document.getElementById('oea-bApercu').disabled = (oea_mode == "V");
		document.getElementById('oea-bVisualiser').disabled = false;

		oea_changerTypeEdition(typeEdition);
		
		oea_afficherNumAffaire();

	} catch (e) {
    recup_erreur(e);
  }
}



function oea_formatLigne(typeLigne) {
  try {

		switch(typeLigne) {
			case "S":
				document.getElementById('oea-codeStats').disabled = false;
				document.getElementById('oea-reference').disabled = true;
				document.getElementById('oea-designation').disabled = true;
				document.getElementById('oea-numLot').disabled = false;
				document.getElementById('oea-nbPieces').disabled = false;
				document.getElementById('oea-quantite').disabled = false;
				document.getElementById('oea-unite').disabled = false;
				document.getElementById('oea-datePeremption').disabled = false;
				document.getElementById('oea-PU').disabled = false;
				document.getElementById('oea-ristourne').disabled = false;
				document.getElementById('oea-commission').disabled = false;
				document.getElementById('oea-codeTVA').disabled = false;
				document.getElementById('oea-bValider').disabled = false;
				document.getElementById('oea-bAnnuler').disabled = false;
				break;

			case "I":
				document.getElementById('oea-codeStats').disabled = false;
				document.getElementById('oea-reference').disabled = false;
				document.getElementById('oea-designation').disabled = false;
				document.getElementById('oea-numLot').disabled = false;
				document.getElementById('oea-nbPieces').disabled = false;
				document.getElementById('oea-quantite').disabled = false;
				document.getElementById('oea-unite').disabled = false;
				document.getElementById('oea-datePeremption').disabled = false;
				document.getElementById('oea-PU').disabled = false;
				document.getElementById('oea-ristourne').disabled = false;
				document.getElementById('oea-commission').disabled = false;
				document.getElementById('oea-codeTVA').disabled = false;
				document.getElementById('oea-bValider').disabled = false;
				document.getElementById('oea-bAnnuler').disabled = false;
				break;

			default:
				document.getElementById('oea-codeStats').value = "";
				document.getElementById('oea-reference').value = "";
				document.getElementById('oea-designation').value = "";
				document.getElementById('oea-numLot').value = "";
				document.getElementById('oea-nbPieces').value = "";
				document.getElementById('oea-quantite').value = "";
				document.getElementById('oea-unite').value = "U";
				document.getElementById('oea-datePeremption').value = "";
				document.getElementById('oea-PU').value = "";
				document.getElementById('oea-ristourne').value = "";
				document.getElementById('oea-commission').value = oea_defCommission;
				oea_libelle = "";
				oea_ligneId = "";
				document.getElementById('oea-codeTVA').value = getCodeTvaNormal(document.getElementById('oea-codePaysLiv').value, oea_assujettiTVA, document.getElementById('oea-regimeTVA').value);
				document.getElementById('oea-codeStats').disabled = true;
				document.getElementById('oea-reference').disabled = true;
				document.getElementById('oea-designation').disabled = true;
				document.getElementById('oea-numLot').disabled = true;
				document.getElementById('oea-nbPieces').disabled = true;
				document.getElementById('oea-quantite').disabled = true;
				document.getElementById('oea-unite').disabled = true;
				document.getElementById('oea-datePeremption').disabled = true;
				document.getElementById('oea-PU').disabled = true;
				document.getElementById('oea-ristourne').disabled = true;
				document.getElementById('oea-commission').disabled = true;
				document.getElementById('oea-codeTVA').disabled = true;
				document.getElementById('oea-bCommentaire').disabled = true;
				document.getElementById('oea-bSupprimer').disabled = true;
				document.getElementById('oea-bFlecheHaut').disabled = true;
				document.getElementById('oea-bFlecheBas').disabled = true;
				document.getElementById('oea-bValider').disabled = true;
				document.getElementById('oea-bAnnuler').disabled = true;
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}



function oea_selectPaysLiv() {
	try {
		oea_listeTVA();
    oea_changerTypeVente();
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_listeTVA() {
  try {
  	oea_calculTotaux();
    
    oea_aCodesTVA.setParam("Code_Pays", document.getElementById("oea-codePaysLiv").value);
    oea_aCodesTVA.setParam("Regime_TVA", document.getElementById("oea-regimeTVA").value);
    oea_aCodesTVA.setParam("Assujetti_TVA", oea_assujettiTVA?"1":"0");
    oea_aCodesTVA.initTree(oea_selectTVA); 
  } catch (e) {
    recup_erreur(e);
  }
}


function oea_selectTVA() {
  try {
    document.getElementById('oea-codeTVA').value = getCodeTvaNormal(document.getElementById('oea-codePaysLiv').value, oea_assujettiTVA, document.getElementById('oea-regimeTVA').value);
  } catch (e) {
    recup_erreur(e);
  }
}


function oea_switchRemise() {
	try {

		if (oea_typeRemise=='P') {
			document.getElementById('oea-bRemise').setAttribute('class', 'bIcoEuro');
			oea_typeRemise = 'M';
		}
		else {
			document.getElementById('oea-bRemise').setAttribute('class', 'bIcoPourcentage');
			oea_typeRemise = 'P';
		}
		oea_calculTotaux();
		oea_setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_switchRemiseFP() {
	try {

		if (oea_typeRemiseFP=='P') {
			document.getElementById('oea-bRemiseFP').setAttribute('class', 'bIcoEuro');
			oea_typeRemiseFP = 'M';
		}
		else {
			document.getElementById('oea-bRemiseFP').setAttribute('class', 'bIcoPourcentage');
			oea_typeRemiseFP = 'P';
		}
		oea_calculTotaux();
		oea_setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_ajouterLigne(typeLigne) {
  try {
  	
  	document.getElementById('oea-bSupprimer').disabled = true;
  	document.getElementById('oea-bCommentaire').disabled = true;
  	document.getElementById('oea-bFlecheHaut').disabled = true;
		document.getElementById('oea-bFlecheBas').disabled = true;

		oea_modeLigne = "C";

		oea_typeLigne = typeLigne;
		oea_ligneId = "";

		oea_formatLigne(typeLigne);

		switch(typeLigne) {
			case "S":

				var reference = document.getElementById('oea-reference').value;

				if (!isEmpty(reference)) {

					if (oea_modeTarif=='Q') {

						var url = "chrome://opensi/content/facturation/user/commun/popup-choixTarif.xul?"+ cookie() +"&Article_Id="+ urlEncode(reference);
    				window.openDialog(url,'','chrome,modal,centerscreen', oea_reporterTarifId);

						var tarifId = oea_tarifId;

						if (!isEmpty(tarifId)) {

							var qGetArticleQte = new QueryHttp("Facturation/Affaires/getArticleQte.tmpl");
							qGetArticleQte.setParam("Article_Id", reference);
							qGetArticleQte.setParam("Tarif_Id", tarifId);
							qGetArticleQte.setParam("Type_Prix", oea_editionTTC?"TTC":"HT");

							var result = qGetArticleQte.execute();
							var contenu = result.responseXML.documentElement;

							document.getElementById('oea-codeStats').value = contenu.getAttribute("Code_Stats");
							document.getElementById('oea-designation').value = contenu.getAttribute("Designation");
							document.getElementById('oea-numLot').value = "";
							document.getElementById('oea-nbPieces').value = "";
							document.getElementById('oea-quantite').value = contenu.getAttribute("Quantite");
							document.getElementById('oea-unite').value = contenu.getAttribute("Unite");
							document.getElementById('oea-datePeremption').value = "";
							document.getElementById('oea-PU').value = contenu.getAttribute("Prix");
							document.getElementById('oea-ristourne').value = "0.00";
							document.getElementById('oea-commission').value = oea_defCommission;
							document.getElementById('oea-codeTVA').value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"), document.getElementById('oea-codePaysLiv').value, oea_assujettiTVA, document.getElementById('oea-regimeTVA').value);
							oea_tarifId = "";
							oea_libelle = contenu.getAttribute("Libelle");
						}
						else {
							oea_ajouterLigne("I");
						}
					}
					else {
						
						var qGetArticleTarif = new QueryHttp("Facturation/Affaires/getArticleTarif.tmpl");
						qGetArticleTarif.setParam("Article_Id", reference);
						qGetArticleTarif.setParam("Code_Tarif", document.getElementById('oea-codeTarif').value);
						qGetArticleTarif.setParam("Type_Prix", oea_editionTTC?"TTC":"HT");
						
						var clientId = document.getElementById('oea-clientId').value;
						if (!isEmpty(clientId)) {
							qGetArticleTarif.setParam("Client_Id", clientId);
						}

						var result = qGetArticleTarif.execute();
						var contenu = result.responseXML.documentElement;

						document.getElementById('oea-codeStats').value = contenu.getAttribute("Code_Stats");
						document.getElementById('oea-designation').value = contenu.getAttribute("Designation");
						document.getElementById('oea-numLot').value = "";
						document.getElementById('oea-nbPieces').value = "";
						document.getElementById('oea-quantite').value = 1;
						document.getElementById('oea-unite').value = contenu.getAttribute("Unite");
						document.getElementById('oea-datePeremption').value = "";
						document.getElementById('oea-PU').value = contenu.getAttribute("Prix");
						document.getElementById('oea-ristourne').value = "0.00";
						document.getElementById('oea-commission').value = oea_defCommission;
						document.getElementById('oea-codeTVA').value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"), document.getElementById('oea-codePaysLiv').value, oea_assujettiTVA, document.getElementById('oea-regimeTVA').value);
						oea_libelle = "";
					}
				}
				else {
					oea_ajouterLigne("I");
				}

				break;

			case "I":

				document.getElementById('oea-codeStats').value = "";
				document.getElementById('oea-reference').value = "";
				document.getElementById('oea-designation').value = "";
				document.getElementById('oea-numLot').value = "";
				document.getElementById('oea-nbPieces').value = "";
				document.getElementById('oea-quantite').value = 1;
				document.getElementById('oea-unite').value = "U";
				document.getElementById('oea-datePeremption').value = "";
				document.getElementById('oea-PU').value = "";
				document.getElementById('oea-ristourne').value = "0.00";
				document.getElementById('oea-commission').value = oea_defCommission;
				document.getElementById('oea-codeTVA').value = getCodeTvaNormal(document.getElementById('oea-codePaysLiv').value, oea_assujettiTVA, document.getElementById('oea-regimeTVA').value);
				oea_libelle = "";
				document.getElementById('oea-reference').focus();
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}




function oea_pressOnWindow(ev) {
	try {

		if (ev.altKey && oea_mode!="V") {
			switch(ev.charCode) {
      	case 97: // 'a'
					oea_rechercherStock();
        	break;
				case 116: // 't'
					oea_modifierTarif();
					break;
    	}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_pressOnQuantite(ev) {
	try {
		
		if (ev.keyCode==13) {
			oea_validerLigne();
		}
		
	} catch (e) {
    recup_erreur(e);
  }
}


function oea_pressOnReference(ev) {
	try {

		if (ev.keyCode==13) {
			oea_rechercherReference();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_rechercherStock(reference) {
	try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		if (oea_modeTarif != "Q") {
			url += "&Code_Tarif=" + document.getElementById('oea-codeTarif').value;
		}
		if (reference != null) { url += "&Reference="+ urlEncode(reference); }
    window.openDialog(url,'','chrome,modal,centerscreen',oea_retourRechercherStock);

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_retourRechercherStock(reference) {
	try {
	
		document.getElementById('oea-reference').value = reference;
		oea_ajouterLigne("S");
	
	} catch (e) {
    recup_erreur(e);
  }
}


function oea_rechercherReference() {
	try {
		
		var reference = document.getElementById('oea-reference').value;

		var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
		qExArt.setParam("Reference", reference);
		var result = qExArt.execute();
		
		var articleId = result.responseXML.documentElement.getAttribute("Article_Id");
		
		if (!isEmpty(articleId)) {
			document.getElementById('oea-reference').value = articleId;
			oea_ajouterLigne("S");
		} else {
			oea_rechercherStock(reference);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_modifierTarif() {
	try {

		if (oea_modeLigne = "M" && oea_typeLigne=='S') {

			if (oea_modeTarif=='Q') {

				var reference = document.getElementById('oea-reference').value;

				var url = "chrome://opensi/content/facturation/user/commun/popup-choixTarif.xul?"+ cookie() +"&Article_Id="+ urlEncode(reference);
    		window.openDialog(url,'','chrome,modal,centerscreen', oea_reporterTarifId);

				var tarifId = oea_tarifId;

				if (!isEmpty(tarifId)) {

					var qGetArticleQte = new QueryHttp("Facturation/Affaires/getArticleQte.tmpl");
					qGetArticleQte.setParam("Article_Id", reference);
					qGetArticleQte.setParam("Tarif_Id", tarifId);
					qGetArticleQte.setParam("Type_Prix", oea_editionTTC?"TTC":"HT");

					var result = qGetArticleQte.execute();
					var contenu = result.responseXML.documentElement;

					document.getElementById('oea-quantite').value = contenu.getAttribute("Quantite");
					document.getElementById('oea-unite').value = contenu.getAttribute("Unite");
					document.getElementById('oea-PU').value = contenu.getAttribute("Prix");
					oea_tarifId = "";
					oea_libelle = contenu.getAttribute("Libelle");
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_reporterTarifId(tarifId) {
	try {
		oea_tarifId = tarifId;
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_ouvrirLigne() {
  try {

		if (oea_aArticles.isSelected() && oea_mode=="M") {
			var i = oea_aArticles.getCurrentIndex();
			oea_currentIndex = i;
			
			if (oea_aArticles.getCellText(i,'oea-colTypeLigne')=="C") {
				oea_ajouterLigne("I");
			}
			else {
				oea_modeLigne = "M";
				document.getElementById('oea-bCommentaire').disabled = false;
				document.getElementById('oea-bSupprimer').disabled = false;

				document.getElementById('oea-codeStats').value = oea_aArticles.getCellText(i,'oea-colCodeStats');
				document.getElementById('oea-reference').value = oea_aArticles.getCellText(i,'oea-colReference');
				document.getElementById('oea-designation').value = oea_aArticles.getCellText(i,'oea-colDesignation');
				document.getElementById('oea-numLot').value = oea_aArticles.getCellText(i,'oea-colNumLot');
				document.getElementById('oea-nbPieces').value = oea_aArticles.getCellText(i,'oea-colNbPieces');
				document.getElementById('oea-quantite').value = oea_aArticles.getCellText(i,'oea-colQuantite');
				document.getElementById('oea-unite').value = oea_aArticles.getCellText(i,'oea-colUnite');
				document.getElementById('oea-datePeremption').value = oea_aArticles.getCellText(i,'oea-colDatePeremption');
				document.getElementById('oea-PU').value = oea_aArticles.getCellText(i,'oea-colPU');
				document.getElementById('oea-codeTVA').value = oea_aArticles.getCellText(i,'oea-colCodeTVA');
				document.getElementById('oea-ristourne').value = oea_aArticles.getCellText(i,'oea-colRistourne');
				document.getElementById('oea-commission').value = oea_aArticles.getCellText(i,'oea-colTauxCommission');
				oea_typeLigne = oea_aArticles.getCellText(i,'oea-colTypeLigne');
				oea_ligneId = oea_aArticles.getCellText(i,'oea-colLigneId');
				oea_libelle = oea_aArticles.getCellText(i,'oea-colLibelle');
				
				// on ignore les lignes de commentaires
				var firstIndex = 0;
				var lastIndex = oea_aArticles.nbLignes()-1;
				if (oea_aArticles.getCellText(firstIndex,'oea-colTypeLigne')=="C") { firstIndex++; }
				if (oea_aArticles.getCellText(lastIndex,'oea-colTypeLigne')=="C") { lastIndex--; }
				
				document.getElementById('oea-bFlecheHaut').disabled = (i==firstIndex);
				document.getElementById('oea-bFlecheBas').disabled = (i==lastIndex);

				oea_formatLigne(oea_typeLigne);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_ouvrirCommentaire() {
  try {
  	
		if (oea_aArticles.isSelected() && oea_mode=="M") {
			var i = oea_aArticles.getCurrentIndex();
			if (oea_aArticles.getCellText(i,'oea-colTypeLigne')=="C") {
				oea_editerCommentaire();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_deplacerLigneBas() {
	try {
		oea_deplacerLigne("Bas");
	} catch (e) {
		recup_erreur(e);
	}
}

function oea_deplacerLigneHaut() {
	try {
		oea_deplacerLigne("Haut");
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_deplacerLigne(type) {
	try {
		if (oea_aArticles.isSelected() && oea_mode=="M") {
			var i = oea_aArticles.getCurrentIndex();
			if (oea_aArticles.getCellText(i,'oea-colTypeLigne')!="C") {
				var ligneId = oea_aArticles.getCellText(i,'oea-colLigneId');
				var qDeplacerLigne = new QueryHttp("Facturation/Avoirs/deplacerLigne.tmpl");
				qDeplacerLigne.setParam("Ligne_Id", ligneId);
				qDeplacerLigne.setParam("Deplacement", type);
				qDeplacerLigne.execute();
				
				oea_ajouterLigne("I");
				oea_aArticles.deleteTree();
				oea_initTree2();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_validerLigne() {
  try {

		var codeStats = document.getElementById('oea-codeStats').value;
		var reference = document.getElementById('oea-reference').value;
		var designation = document.getElementById('oea-designation').value;
		var numLot = document.getElementById('oea-numLot').value;
		var nbPieces = document.getElementById('oea-nbPieces').value;
		var quantite = document.getElementById('oea-quantite').value;
		var unite = document.getElementById('oea-unite').value;
		var datePeremption = document.getElementById('oea-datePeremption').value;
		var pu = document.getElementById('oea-PU').value;
		var ristourne = document.getElementById('oea-ristourne').value;
		var commission = document.getElementById('oea-commission').value;
		var codeTVA = document.getElementById('oea-codeTVA').value;

		var qValiderLigne;
		if (oea_modeLigne=="C") {
			qValiderLigne = new QueryHttp("Facturation/Affaires/ajouterArticleAvoir.tmpl");
			qValiderLigne.setParam("Type_Ligne", oea_typeLigne);
		}
		else {
			qValiderLigne = new QueryHttp("Facturation/Affaires/modifierArticleAvoir.tmpl");
			qValiderLigne.setParam("Ligne_Id", oea_ligneId);
		}
		qValiderLigne.setParam("Reference", reference);
		qValiderLigne.setParam("Designation", designation);
		qValiderLigne.setParam("Quantite", quantite);
		qValiderLigne.setParam("Prix", pu);
		qValiderLigne.setParam("Ristourne", ristourne);
		qValiderLigne.setParam("Commission", commission);
		qValiderLigne.setParam("Code_TVA", codeTVA);
		qValiderLigne.setParam("Libelle", oea_libelle);
		qValiderLigne.setParam("Code_Stats", codeStats);
		qValiderLigne.setParam("Unite", unite);
		qValiderLigne.setParam("Nb_Pieces", nbPieces);
		qValiderLigne.setParam("Num_Lot", numLot);
		qValiderLigne.setParam("Avoir_Id", avoirId);
		
		if (isEmpty(designation)) { showWarning("Désignation de l'article manquante !"); }
		else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !");	}
		else if (!isEmpty(nbPieces) && !isPositiveInteger(nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
		else if (!isEmpty(datePeremption) && !isDate(datePeremption)) { showWarning("Date de péremption incorrecte !");	}
		else if (isEmpty(pu) || !isPositiveOrNull(pu) || !checkDecimal(pu,4)) { showWarning("Prix unitaire incorrect !");	}
		else if (isEmpty(ristourne) || !isTaux(ristourne)) { showWarning("Taux de ristourne incorrect !");	}
		else if (isEmpty(commission) || !isTaux(commission) || parseIntBis(commission)>=100) { showWarning("Taux de commission incorrect !");	}
		else {
			
			if (oea_modeLigne=="C") {
				oea_currentIndex = oea_aArticles.nbLignes();
			}
			
			qValiderLigne.setParam("Date_Peremption", !isEmpty(datePeremption)?prepareDateJava(datePeremption):"");

			var result = qValiderLigne.execute();

			oea_ajouterLigne("I");
			oea_aArticles.deleteTree();
			oea_initTree2();
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_annulerLigne() {
  try {

  	oea_aArticles.select(-1);
		oea_ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
	}
}



function oea_supprimerLigne() {
  try {

		var ligneId = oea_ligneId;
		var qSupprimerLigne = new QueryHttp("Facturation/Affaires/supprimerArticleAvoir.tmpl");
		qSupprimerLigne.setParam("Ligne_Id", oea_ligneId);
		qSupprimerLigne.setParam("Avoir_Id", avoirId);
		qSupprimerLigne.execute();

		oea_currentIndex--;
		oea_ajouterLigne("I");
		oea_aArticles.deleteTree();
		oea_initTree2();

	} catch (e) {
  	recup_erreur(e);
	}
}



function oea_enregistrerAvoir() {
  try {

		var save = false;

		var clientId = document.getElementById('oea-clientId').value;
		var utilR = document.getElementById('oea-responsable').value;
		var regimeTVA = document.getElementById('oea-regimeTVA').value;
		var numTva = oea_assujettiTVA?document.getElementById('oea-numTVA').value:"";
		var commentairesFin = document.getElementById('oea-commentairesFin').value;
		var commentairesInt = document.getElementById('oea-commentairesInt').value;
		var codeTarif = document.getElementById('oea-codeTarif').value;
		var remise = document.getElementById('oea-remise').value;
		var tauxRemise = 0;
		var montantRemise = 0;
		var fraisPort = document.getElementById('oea-fraisPort').value;
		var remiseFP = document.getElementById('oea-remiseFP').value;
		var tauxRemiseFP = 0;
		var montantRemiseFP = 0;
		var escompte = document.getElementById('oea-escompte').value;
		var secteurActivite = document.getElementById('oea-secteur').value;
		
		var denominationFact = document.getElementById('oea-denominationFact').value;
		var adresse1Fact = document.getElementById('oea-adresse1Fact').value;
		var adresse2Fact = document.getElementById('oea-adresse2Fact').value;
		var adresse3Fact = document.getElementById('oea-adresse3Fact').value;
		var codePostalFact = document.getElementById('oea-codePostalFact').value;
		var villeFact = document.getElementById('oea-villeFact').value;
		var codePaysFact = document.getElementById('oea-codePaysFact').value;
		var civInterFact = document.getElementById('oea-civInterFact').value;
		var nomInterFact = document.getElementById('oea-nomInterFact').value;
		var prenomInterFact = document.getElementById('oea-prenomInterFact').value;
		var telInterFact = document.getElementById('oea-telInterFact').value;
		var faxInterFact = document.getElementById('oea-faxInterFact').value;
		var emailInterFact = document.getElementById('oea-emailInterFact').value;
		
		var denominationLiv = document.getElementById('oea-denominationLiv').value;
		var adresse1Liv = document.getElementById('oea-adresse1Liv').value;
		var adresse2Liv = document.getElementById('oea-adresse2Liv').value;
		var adresse3Liv = document.getElementById('oea-adresse3Liv').value;
		var codePostalLiv = document.getElementById('oea-codePostalLiv').value;
		var villeLiv = document.getElementById('oea-villeLiv').value;
		var codePaysLiv = document.getElementById('oea-codePaysLiv').value;
		var civInterLiv = document.getElementById('oea-civInterLiv').value;
		var nomInterLiv = document.getElementById('oea-nomInterLiv').value;
		var prenomInterLiv = document.getElementById('oea-prenomInterLiv').value;
		var telInterLiv = document.getElementById('oea-telInterLiv').value;
		var faxInterLiv = document.getElementById('oea-faxInterLiv').value;
		var emailInterLiv = document.getElementById('oea-emailInterLiv').value;
		
		var denominationEnvoi = document.getElementById('oea-denominationEnvoi').value;
		var adresse1Envoi = document.getElementById('oea-adresse1Envoi').value;
		var adresse2Envoi = document.getElementById('oea-adresse2Envoi').value;
		var adresse3Envoi = document.getElementById('oea-adresse3Envoi').value;
		var codePostalEnvoi = document.getElementById('oea-codePostalEnvoi').value;
		var villeEnvoi = document.getElementById('oea-villeEnvoi').value;
		var codePaysEnvoi = document.getElementById('oea-codePaysEnvoi').value;
		var civInterEnvoi = document.getElementById('oea-civInterEnvoi').value;
		var nomInterEnvoi = document.getElementById('oea-nomInterEnvoi').value;
		var prenomInterEnvoi = document.getElementById('oea-prenomInterEnvoi').value;
		var telInterEnvoi = document.getElementById('oea-telInterEnvoi').value;
		var faxInterEnvoi = document.getElementById('oea-faxInterEnvoi').value;
		var emailInterEnvoi = document.getElementById('oea-emailInterEnvoi').value;
		
		var modeEnvoiAvoir = document.getElementById('oea-modeEnvoiAvoir').value;
		
		var montantBase = (oea_editionTTC?oea_montantTTC:oea_montantHT);

		if (isEmpty(remise) || (oea_typeRemise=='P'?!isTaux(remise):!isPositiveOrNull(remise) || parseFloat(remise)>montantBase)) { showWarning("Remise incorrecte !"); }
		else if (isEmpty(fraisPort) || !isPositiveOrNull(fraisPort)) { showWarning("Frais de port incorrects !"); }
		else if (isEmpty(remiseFP) || (oea_typeRemiseFP=='P'?!isTaux(remiseFP):!isPositiveOrNull(remiseFP) || parseFloat(remiseFP)>parseFloat(fraisPort))) { showWarning("Remise sur frais de port incorrecte !"); }
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

			if (oea_assujettiTVA && codePaysLiv!="FR" && isEmpty(numTva) && oea_zoneUE) {
				showWarning("Attention : vous n'avez pas saisi le numéro de tva intra-communautaire !");
			}

			if (oea_typeRemise=='P') {
				tauxRemise = remise;
			}
			else {
				tauxRemise = (montantBase>0?remise/montantBase*100:0);
				montantRemise = remise;
			}
			
			if (oea_typeRemiseFP=='P') {
				tauxRemiseFP = remiseFP;
			}
			else {
				tauxRemiseFP = (fraisPort>0?remiseFP/fraisPort*100:0);
				montantRemiseFP = remiseFP;
			}
			
			var qEnregistrer = new QueryHttp("Facturation/Affaires/modifierAvoir.tmpl");
			qEnregistrer.setParam("Avoir_Id", avoirId);
			qEnregistrer.setParam("Client_Id", clientId);
			qEnregistrer.setParam("Util_R", utilR);
			qEnregistrer.setParam("Edition_TTC", oea_editionTTC?"1":"0");
			qEnregistrer.setParam("Regime_TVA", regimeTVA);
			qEnregistrer.setParam("Assujetti_TVA", oea_assujettiTVA?"1":"0");
			qEnregistrer.setParam("Num_TVA_Intra", numTva);
			qEnregistrer.setParam("Secteur_Activite", secteurActivite);
			qEnregistrer.setParam("Code_Tarif", codeTarif);
			qEnregistrer.setParam("Commentaires_Fin", commentairesFin);
			qEnregistrer.setParam("Commentaires_Int", commentairesInt);
			qEnregistrer.setParam("Taux_Remise", tauxRemise);
			qEnregistrer.setParam("Montant_Remise", montantRemise);
			qEnregistrer.setParam("PRemise_FP", tauxRemiseFP);
			qEnregistrer.setParam("MRemise_FP", montantRemiseFP);
			qEnregistrer.setParam("Escompte", escompte);
			qEnregistrer.setParam("Frais_Port", fraisPort);
			qEnregistrer.setParam("Code_TVA_Port", oea_codeTvaPort);
			qEnregistrer.setParam("Taux_TVA_Port", oea_tauxTvaPort);
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
			qEnregistrer.setParam("Mode_Envoi_Avoir", modeEnvoiAvoir);
			qEnregistrer.execute();

			oea_setModifie(false);
			save = true;
		}

		return save;

	} catch (e) {
  	recup_erreur(e);
	}
}



function oea_calculTotaux() {
  try {
  	var clientId = document.getElementById('oea-clientId').value;
		var clientConnu = (clientId!="");

		if (oea_mode!='V') {
			document.getElementById('oea-editionTTC').disabled = (oea_aArticles.nbLignes()>0);
			//document.getElementById('oea-bChercherClient').collapsed = (oea_aArticles.nbLignes()>0);
	    document.getElementById('oea-codePaysLiv').disabled = (oea_aArticles.nbLignes()>0);
	   	document.getElementById('oea-bChercherAdrLiv').disabled = (!clientConnu || oea_aArticles.nbLignes()>0);
	    document.getElementById('oea-bCopierFactVersLivEnvoi').disabled = (oea_aArticles.nbLignes()>0);
	    document.getElementById('oea-codeTarif').disabled = (oea_aArticles.nbLignes()>0);
			document.getElementById('oea-regimeTVA').disabled = (oea_aArticles.nbLignes()>0);
			document.getElementById('oea-assujettiTVA').disabled = (oea_aArticles.nbLignes()>0);
		}
		
		var remise = parseFloat(document.getElementById('oea-remise').value);
		var tauxEscompte = parseFloat(document.getElementById('oea-escompte').value);
		var fraisPort = parseFloat(document.getElementById('oea-fraisPort').value);
		var remiseFP = parseFloat(document.getElementById('oea-remiseFP').value);

		if ((oea_typeRemise=='P'?isTaux(remise):isPositiveOrNull(remise)) && (oea_typeRemiseFP=='P'?isTaux(remiseFP):isPositiveOrNull(remiseFP)) && isTaux(tauxEscompte) && isPositiveOrNull(fraisPort)) {

			if (oea_aArticles.isNotNull()) {
				
				var calculDocument = new CalculDocument();
				calculDocument.setEditionTTC(oea_editionTTC);
				if (oea_typeRemise=='P') { calculDocument.setRemiseP(remise); }
				else { calculDocument.setRemiseM(remise); }
				calculDocument.setFraisPortBruts(fraisPort);
				if (oea_typeRemiseFP=='P') { calculDocument.setRemiseFPP(remiseFP); }
				else { calculDocument.setRemiseFPM(remiseFP); }
				calculDocument.setTauxTVAFP(oea_tauxTvaPort);
				calculDocument.setEscompteP(tauxEscompte);
				
				var nbLignes = oea_aArticles.nbLignes();
				
				for (var i=0;i<nbLignes;i++) {
					if (oea_aArticles.getCellText(i,'oea-colTypeLigne')!="C") {
						var prixUnitaireBrut  = oea_aArticles.getCellText(i,'oea-colPU');
						var ristourneP = oea_aArticles.getCellText(i,'oea-colRistourne');
						var commissionP = oea_aArticles.getCellText(i,'oea-colTauxCommission');
						var quantite  = oea_aArticles.getCellText(i,'oea-colQuantite');
						var codeTVA  = oea_aArticles.getCellText(i,'oea-colCodeTVA');
						calculDocument.ajouterLigneDocument(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA);
					}
				}
				
				calculDocument.calculer();

				if (oea_editionTTC) {
					document.getElementById('oea-pttcMontantRemise').value = calculDocument.getRemiseM();
					document.getElementById('oea-pttcMontantFraisPort').value = calculDocument.getFraisPortBruts();
					document.getElementById('oea-pttcMontantRemiseFP').value = calculDocument.getRemiseFPM();
					document.getElementById('oea-pttcTVA').value = calculDocument.getTotalTVA();
					document.getElementById('oea-pttcCommissionTTC').value = calculDocument.getCommissionTTC();
					document.getElementById('oea-pttcMontantTTC').value = calculDocument.getMontantTTC();
					document.getElementById('oea-pttcMontantEscompte').value = calculDocument.getEscompteM();
					document.getElementById('oea-pttcTotalTTC').value = calculDocument.getTotalTTC();
					document.getElementById('oea-pttcNetTTC').value = calculDocument.getNetAPayer();
					
					oea_montantTTC = calculDocument.getMontantTTCSansFormat();
					
					document.getElementById('oea-rowCommissionTTC').collapsed = !calculDocument.afficherCommission();
					document.getElementById('oea-rowRemiseTTC').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('oea-rowRemiseFPTTC').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('oea-rowEscompteTTC').collapsed = !calculDocument.afficherEscompteM();
				}
				else {
					document.getElementById('oea-montantHT').value = calculDocument.getMontantHT();
					document.getElementById('oea-montantRemise').value = calculDocument.getRemiseM();
					document.getElementById('oea-montantFraisPort').value = calculDocument.getFraisPortBruts();
					document.getElementById('oea-montantRemiseFP').value = calculDocument.getRemiseFPM();
					document.getElementById('oea-totalHT').value = calculDocument.getTotalHT();
					document.getElementById('oea-commissionHT').value = calculDocument.getCommissionHT();
					document.getElementById('oea-TVA').value = calculDocument.getTotalTVA();
					document.getElementById('oea-montantTTC').value = calculDocument.getMontantTTC();
					document.getElementById('oea-montantEscompte').value = calculDocument.getEscompteM();
					document.getElementById('oea-totalTTC').value = calculDocument.getTotalTTC();
					
					oea_montantHT = calculDocument.getMontantHTSansFormat();
					oea_montantTTC = calculDocument.getMontantTTCSansFormat();
					
					document.getElementById('oea-rowCommissionHT').collapsed = !calculDocument.afficherCommission();
					document.getElementById('oea-rowRemiseHT').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('oea-rowRemiseFPHT').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('oea-rowMontantTTC').collapsed = !calculDocument.afficherEscompteM();
					document.getElementById('oea-rowEscompteHT').collapsed = !calculDocument.afficherEscompteM();
				}
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}



function oea_afterRefreshArticles() {
	try {

		oea_calculTotaux();
		oea_scrollToRank();
		document.getElementById('oea-reference').focus();

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_scrollToRank() {
	try {
		
		var tb = document.getElementById("oea-articles").treeBoxObject;

		if (oea_currentIndex>0) {
			tb.ensureRowIsVisible(oea_currentIndex);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_demandeEnregistrement() {
  try {

		if (oea_modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à l'avoir ?")) {
				oea_enregistrerAvoir();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_setModifie(m) {
  try {
  	oea_modifie = m;
		if (m) {
			document.getElementById('oea-tabAvoir').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('oea-bApercu').disabled = true;
			document.getElementById('oea-bVisualiser').disabled = true;
		}
		else {
			document.getElementById('oea-tabAvoir').setAttribute('image', null);
			document.getElementById('oea-bApercu').disabled = false;
			document.getElementById('oea-bVisualiser').disabled = false;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_initTree2() {
  try {
  	
  	oea_aArticles.setParam("Avoir_Id", avoirId);
  	oea_aArticles.initTree(oea_afterRefreshArticles);

  } catch (e) {
    recup_erreur(e);
  }
}




function oea_editerCommentaire() {
  try {
  	
		if (oea_aArticles.isSelected()) {

			var ligneId = oea_aArticles.getSelectedCellText('oea-colLigneId');

			var url = "chrome://opensi/content/facturation/user/affaires/popup-commentaire.xul?"+ cookie() +"&Type_Doc=Avoir&Ligne_Id="+ ligneId;
    	window.openDialog(url,'','chrome,modal,centerscreen');

			oea_aArticles.deleteTree();
			oea_initTree2();
			oea_ajouterLigne("I");
		}
		else {
			showWarning("Aucun article ou commentaire sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_editerCommentairesCaches() {
  try {
  	
		var url = "chrome://opensi/content/facturation/user/affaires/popup-commentaireCache.xul?"+ cookie();
    url += "&Type_Doc=Avoir&Doc_Id="+ avoirId;
  	window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_chargerCoord() {
  try {
		var clientId = document.getElementById('oea-clientId').value;
		var qGetClient = new QueryHttp("Facturation/Clients/getCoord.tmpl");
		qGetClient.setParam("Client_Id", clientId);
		var result = qGetClient.execute();

		var contenu = result.responseXML.documentElement;
		
		oea_defCommission = contenu.getAttribute('Taux_Commission');
		
		oea_chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById('oea-remise').value = contenu.getAttribute('Remise');
		document.getElementById('oea-bRemise').setAttribute("class", "bIcoPourcentage");
		oea_typeRemise = 'P';
		document.getElementById('oea-codeTarif').value = contenu.getAttribute('Code_Tarif');
		
		oea_assujettiTVA = (contenu.getAttribute('Assujetti_TVA')=="1");
		document.getElementById('oea-assujettiTVA').checked=oea_assujettiTVA;
		document.getElementById('oea-numTVA').disabled=!oea_assujettiTVA;
		document.getElementById('oea-numTVA').value=contenu.getAttribute('Num_TVA_Intra');
		document.getElementById('oea-secteur').value = contenu.getAttribute('Secteur_Activite');

		document.getElementById('oea-denominationFact').value = contenu.getAttribute('Denomination_Fact');
		document.getElementById('oea-adresse1Fact').value = contenu.getAttribute('Adresse_1_Fact');		
		document.getElementById('oea-adresse2Fact').value = contenu.getAttribute('Adresse_2_Fact');
		document.getElementById('oea-adresse3Fact').value = contenu.getAttribute('Adresse_3_Fact');
		document.getElementById('oea-codePostalFact').value = contenu.getAttribute('Code_Postal_Fact');
		document.getElementById('oea-villeFact').value = contenu.getAttribute('Ville_Fact');
    document.getElementById('oea-codePaysFact').value = contenu.getAttribute('Code_Pays_Fact');
		document.getElementById('oea-civInterFact').value = contenu.getAttribute('Civ_Inter_Fact');
		document.getElementById('oea-nomInterFact').value = contenu.getAttribute('Nom_Inter_Fact');
		document.getElementById('oea-prenomInterFact').value = contenu.getAttribute('Prenom_Inter_Fact');
		document.getElementById('oea-telInterFact').value = contenu.getAttribute('Tel_Inter_Fact');
		document.getElementById('oea-faxInterFact').value = contenu.getAttribute('Fax_Inter_Fact');
		document.getElementById('oea-emailInterFact').value = contenu.getAttribute('Email_Inter_Fact');
		
		document.getElementById('oea-denominationLiv').value = contenu.getAttribute('Denomination_Liv');
		document.getElementById('oea-adresse1Liv').value = contenu.getAttribute('Adresse_1_Liv');
		document.getElementById('oea-adresse2Liv').value = contenu.getAttribute('Adresse_2_Liv');
		document.getElementById('oea-adresse3Liv').value = contenu.getAttribute('Adresse_3_Liv');
		document.getElementById('oea-codePostalLiv').value = contenu.getAttribute('Code_Postal_Liv');		
		document.getElementById('oea-villeLiv').value = contenu.getAttribute('Ville_Liv');
    document.getElementById('oea-codePaysLiv').value = contenu.getAttribute('Code_Pays_Liv');
    oea_calculerTvaPort();
    oea_selectPaysLiv();
    
    document.getElementById('oea-civInterLiv').value = contenu.getAttribute('Civ_Inter_Liv');
		document.getElementById('oea-nomInterLiv').value = contenu.getAttribute('Nom_Inter_Liv');
		document.getElementById('oea-prenomInterLiv').value = contenu.getAttribute('Prenom_Inter_Liv');
		document.getElementById('oea-telInterLiv').value = contenu.getAttribute('Tel_Inter_Liv');
		document.getElementById('oea-faxInterLiv').value = contenu.getAttribute('Fax_Inter_Liv');
		document.getElementById('oea-emailInterLiv').value = contenu.getAttribute('Email_Inter_Liv');
		
		document.getElementById('oea-denominationEnvoi').value = contenu.getAttribute('Denomination_Envoi');
		document.getElementById('oea-adresse1Envoi').value = contenu.getAttribute('Adresse_1_Envoi');
		document.getElementById('oea-adresse2Envoi').value = contenu.getAttribute('Adresse_2_Envoi');
		document.getElementById('oea-adresse3Envoi').value = contenu.getAttribute('Adresse_3_Envoi');
		document.getElementById('oea-codePostalEnvoi').value = contenu.getAttribute('Code_Postal_Envoi');		
		document.getElementById('oea-villeEnvoi').value = contenu.getAttribute('Ville_Envoi');
    document.getElementById('oea-codePaysEnvoi').value = contenu.getAttribute('Code_Pays_Envoi');
    
    document.getElementById('oea-civInterEnvoi').value = contenu.getAttribute('Civ_Inter_Envoi');
		document.getElementById('oea-nomInterEnvoi').value = contenu.getAttribute('Nom_Inter_Envoi');
		document.getElementById('oea-prenomInterEnvoi').value = contenu.getAttribute('Prenom_Inter_Envoi');
		document.getElementById('oea-telInterEnvoi').value = contenu.getAttribute('Tel_Inter_Envoi');
		document.getElementById('oea-faxInterEnvoi').value = contenu.getAttribute('Fax_Inter_Envoi');
		document.getElementById('oea-emailInterEnvoi').value = contenu.getAttribute('Email_Inter_Envoi');
		
    document.getElementById('oea-modeEnvoiAvoir').value = contenu.getAttribute('Mode_Envoi_Facture');
		
		document.getElementById('oea-labelClient').setAttribute("value", clientId);
		
   	document.getElementById('oea-bChercherAdrLiv').disabled = (oea_aArticles.nbLignes()>0);
    document.getElementById('oea-bCopierFactVersLivEnvoi').disabled = (oea_aArticles.nbLignes()>0);
    document.getElementById('oea-codeTarif').disabled = (oea_aArticles.nbLignes()>0);
		document.getElementById('oea-bChercherAdrFact').disabled = false;
		document.getElementById('oea-bChercherInter').disabled = false;
		document.getElementById('oea-bChercherInterLiv').disabled = false;
		document.getElementById('oea-bChercherAdrEnvoi').disabled = false;
		document.getElementById('oea-bChercherInterEnvoi').disabled = false;
		
		oea_ajouterLigne("I");
		oea_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_rechercherClient() {
  try {

		var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=true&Client_Express=true&Bloque=true";
    window.openDialog(url,'','chrome,modal,centerscreen',oea_retourRechercherClient);
    var clientId = document.getElementById('oea-clientId').value;

		if (clientId != "") {
			oea_setModifie(true);
			oea_chargerCoord();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('oea-clientId').value = codeClient;
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_evaluer(elem, ev) {
	try {

		if (ev.keyCode==13) {
			var nf4 = new NumberFormat("0.00##", false);
			elem.value = nf4.format(calcExpr(elem.value));
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function oea_changerTypeEdition(chgType) {
	try {

		oea_editionTTC = chgType;
		
		if (oea_editionTTC) {
			document.getElementById('oea-colTotal').setAttribute("label", "Total TTC");
			document.getElementById('oea-colPU').setAttribute("label", "P.U TTC");
			document.getElementById('oea-lblFraisPort').value = "Frais de port (ttc) :";
			document.getElementById('oea-lblPU').value = "P.U TTC :";
			document.getElementById('oea-piedTTC').collapsed = false;
			document.getElementById('oea-piedHT').collapsed = true;
		}
		else {
			document.getElementById('oea-colTotal').setAttribute("label", "Total HT");
			document.getElementById('oea-colPU').setAttribute("label", "P.U HT");
			document.getElementById('oea-lblFraisPort').value = "Frais de port (ht) :";
			document.getElementById('oea-lblPU').value = "P.U HT :";
			document.getElementById('oea-piedTTC').collapsed = true;
			document.getElementById('oea-piedHT').collapsed = false;			
		}
		
		oea_calculTotaux();

	}	catch(e) {
		recup_erreur(e);
	}
}


function oea_changerAssujettiTVA(etat) {
	try {

		oea_assujettiTVA = etat;
		document.getElementById('oea-numTVA').disabled=!oea_assujettiTVA;
		oea_listeTVA();
		oea_setModifie(true);

	}	catch(e) {
		recup_erreur(e);
	}
}


function oea_changerTypeVente() {
	try {
	  var qTypeVente = new QueryHttp("GetPays.tmpl");
	  qTypeVente.setParam("Code_Pays", document.getElementById('oea-codePaysLiv').value);
	  var result = qTypeVente.execute();
	  oea_zoneUE = (result.responseXML.documentElement.getAttribute("zone_ue")=="1");
	}	catch(e) {
		recup_erreur(e);
	}
}


function oea_rechercherAdrFact() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oea-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oea_reporterAdrFact);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_reporterAdrFact(nom, adr1, adr2, adr3, cp, ville, pays, codePays, contactFact, contactLiv, contactEnvoi) {
  try {

		document.getElementById('oea-denominationFact').value = nom;
		document.getElementById('oea-adresse1Fact').value = adr1;		
		document.getElementById('oea-adresse2Fact').value = adr2;
		document.getElementById('oea-adresse3Fact').value = adr3;
		document.getElementById('oea-codePostalFact').value = cp;
		document.getElementById('oea-villeFact').value = ville;
	  document.getElementById('oea-codePaysFact').value = codePays;
	  
	  if (!isEmpty(contactFact)) {
	  	var qInterFact = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterFact.setParam("Num_Inter", contactFact);
	  	var result = qInterFact.execute();
	  	var content = result.responseXML.documentElement;
	  	oea_reporterInterFact(content.getAttribute("Civilite"), content.getAttribute("Civ_Courte"), content.getAttribute("Nom"), content.getAttribute("Prenom"), content.getAttribute("Tel"), content.getAttribute("Fax"), content.getAttribute("Email"));
	  }
		oea_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_rechercherInterlocuteurFact() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oea-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oea_reporterInterFact);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_reporterInterFact(civ, civCourte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oea-civInterFact').value = civ;
		document.getElementById('oea-nomInterFact').value = nom;		
		document.getElementById('oea-prenomInterFact').value = prenom;
		document.getElementById('oea-telInterFact').value = tel;
		document.getElementById('oea-faxInterFact').value = fax;
		document.getElementById('oea-emailInterFact').value = email;
		
		oea_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_rechercherAdrEnvoi() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oea-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oea_reporterAdrEnvoi);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_reporterAdrEnvoi(nom, adr1, adr2, adr3, cp, ville, pays, codePays, contactFact, contactLiv, contactEnvoi) {
  try {

		document.getElementById('oea-denominationEnvoi').value = nom;
		document.getElementById('oea-adresse1Envoi').value = adr1;		
		document.getElementById('oea-adresse2Envoi').value = adr2;
		document.getElementById('oea-adresse3Envoi').value = adr3;
		document.getElementById('oea-codePostalEnvoi').value = cp;
		document.getElementById('oea-villeEnvoi').value = ville;
	  document.getElementById('oea-codePaysEnvoi').value = codePays;
	  
	  if (!isEmpty(contactEnvoi)) {
	  	var qInterEnvoi = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterEnvoi.setParam("Num_Inter", contactEnvoi);
	  	var result = qInterEnvoi.execute();
	  	var content = result.responseXML.documentElement;
	  	oea_reporterInterEnvoi(content.getAttribute("Civilite"), content.getAttribute("Civ_Courte"), content.getAttribute("Nom"), content.getAttribute("Prenom"), content.getAttribute("Tel"), content.getAttribute("Fax"), content.getAttribute("Email"));
	  }
	  
		oea_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_copierFactVersLivEnvoi() {
	try {
		document.getElementById('oea-denominationLiv').value = document.getElementById('oea-denominationFact').value;
		document.getElementById('oea-adresse1Liv').value = document.getElementById('oea-adresse1Fact').value;		
		document.getElementById('oea-adresse2Liv').value = document.getElementById('oea-adresse2Fact').value;
		document.getElementById('oea-adresse3Liv').value = document.getElementById('oea-adresse3Fact').value;
		document.getElementById('oea-codePostalLiv').value = document.getElementById('oea-codePostalFact').value;
		document.getElementById('oea-villeLiv').value = document.getElementById('oea-villeFact').value;
	  document.getElementById('oea-codePaysLiv').value = document.getElementById('oea-codePaysFact').value;
	  oea_calculerTvaPort();
	  oea_selectPaysLiv();
	  document.getElementById('oea-civInterLiv').value = document.getElementById('oea-civInterFact').value;
		document.getElementById('oea-nomInterLiv').value = document.getElementById('oea-nomInterFact').value;		
		document.getElementById('oea-prenomInterLiv').value = document.getElementById('oea-prenomInterFact').value;
		document.getElementById('oea-telInterLiv').value = document.getElementById('oea-telInterFact').value;
		document.getElementById('oea-faxInterLiv').value = document.getElementById('oea-faxInterFact').value;
		document.getElementById('oea-emailInterLiv').value = document.getElementById('oea-emailInterFact').value;
		
		document.getElementById('oea-denominationEnvoi').value = document.getElementById('oea-denominationFact').value;
		document.getElementById('oea-adresse1Envoi').value = document.getElementById('oea-adresse1Fact').value;		
		document.getElementById('oea-adresse2Envoi').value = document.getElementById('oea-adresse2Fact').value;
		document.getElementById('oea-adresse3Envoi').value = document.getElementById('oea-adresse3Fact').value;
		document.getElementById('oea-codePostalEnvoi').value = document.getElementById('oea-codePostalFact').value;
		document.getElementById('oea-villeEnvoi').value = document.getElementById('oea-villeFact').value;
	  document.getElementById('oea-codePaysEnvoi').value = document.getElementById('oea-codePaysFact').value;
	  
	  document.getElementById('oea-civInterEnvoi').value = document.getElementById('oea-civInterFact').value;
		document.getElementById('oea-nomInterEnvoi').value = document.getElementById('oea-nomInterFact').value;		
		document.getElementById('oea-prenomInterEnvoi').value = document.getElementById('oea-prenomInterFact').value;
		document.getElementById('oea-telInterEnvoi').value = document.getElementById('oea-telInterFact').value;
		document.getElementById('oea-faxInterEnvoi').value = document.getElementById('oea-faxInterFact').value;
		document.getElementById('oea-emailInterEnvoi').value = document.getElementById('oea-emailInterFact').value;
		
	  oea_setModifie(true);
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_rechercherAdrLiv() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oea-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oea_reporterAdrLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_reporterAdrLiv(nom, adr1, adr2, adr3, cp, ville, pays, codePays, contactFact, contactLiv, contactEnvoi) {
  try {

		document.getElementById('oea-denominationLiv').value = nom;
		document.getElementById('oea-adresse1Liv').value = adr1;		
		document.getElementById('oea-adresse2Liv').value = adr2;
		document.getElementById('oea-adresse3Liv').value = adr3;
		document.getElementById('oea-codePostalLiv').value = cp;
		document.getElementById('oea-villeLiv').value = ville;
	  document.getElementById('oea-codePaysLiv').value = codePays;
	  oea_calculerTvaPort();
	  oea_selectPaysLiv();
	  
		if (!isEmpty(contactLiv)) {
	  	var qInterLiv = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterLiv.setParam("Num_Inter", contactLiv);
	  	var result = qInterLiv.execute();
	  	var content = result.responseXML.documentElement;
	  	oea_reporterInterLiv(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
	  oea_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_rechercherInterlocuteurLiv() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oea-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oea_reporterInterLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_reporterInterLiv(civ, civCourte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oea-civInterLiv').value = civ;
		document.getElementById('oea-nomInterLiv').value = nom;		
		document.getElementById('oea-prenomInterLiv').value = prenom;
		document.getElementById('oea-telInterLiv').value = tel;
		document.getElementById('oea-faxInterLiv').value = fax;
		document.getElementById('oea-emailInterLiv').value = email;
		
		oea_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_rechercherInterlocuteurEnvoi() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oea-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oea_reporterInterEnvoi);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_reporterInterEnvoi(civ, civCourte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oea-civInterEnvoi').value = civ;
		document.getElementById('oea-nomInterEnvoi').value = nom;		
		document.getElementById('oea-prenomInterEnvoi').value = prenom;
		document.getElementById('oea-telInterEnvoi').value = tel;
		document.getElementById('oea-faxInterEnvoi').value = fax;
		document.getElementById('oea-emailInterEnvoi').value = email;
		
		oea_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_choisirMentions() {
  try {
  	
		var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Avoir&Doc_Id="+ avoirId;
  	window.openDialog(url,'','chrome,modal,centerscreen',oea_setModifie);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_apercuAvoir() {
  try {
  	
		if (oea_aArticles.nbLignes()==0) {
			showWarning("L'avoir ne contient aucune ligne !");
		}
		else {
			oea_apercu = true;
			
			document.getElementById('oea-pdfAvoir').setAttribute('src', null);
			document.getElementById('oea-boxMail').collapsed=true;
			document.getElementById('oea-deckAvoir').selectedIndex = 1;
			document.getElementById('bRetourAvoir').collapsed = false;

			var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
			qLangueDefaut.setParam("Type_Doc", "Avoir");
			qLangueDefaut.setParam("Doc_Id", avoirId);
			var result = qLangueDefaut.execute();
			oea_langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
			oea_aLangues.setParam("Selection", oea_langueDefaut);
			oea_aLangues.initTree(oea_initLangue);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_editerAvoir() {
	try {
		
		var ok = true;
  	if (oea_mode=="M") {
  		ok = window.confirm("Confirmez-vous la génération de l'avoir ?\n(Attention l'avoir généré ne pourra plus être modifié !)");
  	}

		if (ok) {
			if (oea_aArticles.nbLignes()==0) {
				showWarning("L'avoir ne contient aucune ligne !");
			}
			
			oea_apercu = false;
			
			document.getElementById('oea-pdfAvoir').setAttribute('src', null);
			document.getElementById('oea-boxMail').collapsed=false;
			document.getElementById('oea-deckAvoir').selectedIndex = 1;
			document.getElementById('bRetourAvoir').collapsed = false;
			
			var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
			qLangueDefaut.setParam("Type_Doc", "Avoir");
			qLangueDefaut.setParam("Doc_Id", avoirId);
			var result = qLangueDefaut.execute();
			oea_langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
			oea_aLangues.setParam("Selection", oea_langueDefaut);
			oea_aLangues.initTree(oea_initLangue);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_initLangue() {
	try {
		document.getElementById('oea-langueDefaut').value = oea_langueDefaut;
		oea_visualiserAvoir();
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_visualiserAvoir() {
  try {
  	
		var langue = document.getElementById('oea-langueDefaut').value;
		var qGenPdf = new QueryHttp("Facturation/Avoirs/avoir_pdf.tmpl");
		qGenPdf.setParam("Avoir_Id", avoirId);
		qGenPdf.setParam("Langue", langue);
		if (oea_apercu) { qGenPdf.setParam("Apercu", true); }
		var result = qGenPdf.execute();
		if (result.responseXML.documentElement.getAttribute('Existe_Edition')=="true") {
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('FichierPDF');
			document.getElementById('oea-pdfAvoir').setAttribute("src", page);
		}
		
	} catch (e) {
    recup_erreur(e);
  }
}


function oea_envoyerMail() {
	try {
		var langue = document.getElementById('oea-langueDefaut').value;
		
		var url = "chrome://opensi/content/facturation/user/affaires/popup-envoyerMail.xul?"+ cookie();
		url += "&Type_Doc=Avoir&Doc_Id=" + avoirId +"&Langue="+ langue;

		window.openDialog(url,'','chrome,modal,centerscreen');
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_supprimerAvoir() {
  try {

		if (window.confirm("Confirmez-vous la suppression de l'avoir ?")) {
			var qSupprimerAvoir = new QueryHttp("Facturation/Affaires/supprimerAvoir.tmpl");
			qSupprimerAvoir.setParam("Avoir_Id", avoirId);
			var result = qSupprimerAvoir.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				showMessage("L'avoir a été supprimé !");
				retourFicheAffaire();
			} else {
				// Sécurité : ne peut théoriquement jamais se produire
				showMessage("Impossible de supprimer un avoir validé !");
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_initVersion() {
	try {
		
		oea_aVersion.setParam("Type_Document", "Avoir");
		oea_aVersion.setParam("Document_Id", avoirId);
		oea_aVersion.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}



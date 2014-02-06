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

var oef_modeLigne;
var oef_codeTvaPort;
var oef_tauxTvaPort;
var oef_zoneUE;
var oef_modeTarif;
var oef_mode;
var oef_defEditionTTC;
var oef_editionTTC;
var oef_assujettiTVA;
var oef_defCommission;
var oef_typeRemise;
var oef_typeRemiseFP;

var oef_typeLigne;
var oef_tarifId;
var oef_ligneId;
var oef_libelle;
var oef_modifie = false;
var oef_chargerModeReg;
var oef_chargerResponsable;
var oef_acompte;
var oef_bloquerEcheance;
var oef_currentIndex;
var oef_montantHT;
var oef_montantTTC;
var oef_langueDefaut;
var oef_apercu;

var oef_aResponsables = new Arbre("ComboListe/combo-responsables.tmpl","oef-responsable");
var oef_aUnites = new Arbre("Facturation/Affaires/liste-unitesVente.tmpl", "oef-unite");
var oef_aCodesTarifs = new Arbre("Facturation/Affaires/liste-codesTarifs.tmpl", "oef-codeTarif");
var oef_aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "oef-secteur");
var oef_aPaysFact = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oef-codePaysFact");
var oef_aPaysLiv = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oef-codePaysLiv");
var oef_aPaysEnvoi = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oef-codePaysEnvoi");
var oef_aCodesTVA = new Arbre("Facturation/Affaires/liste-tauxTva.tmpl", "oef-codeTVA");
var oef_aArticles = new Arbre("Facturation/Affaires/liste-articlesFacture.tmpl", "oef-articles");
var oef_aModesReglements = new Arbre("ComboListe/combo-modesReglement.tmpl", "oef-modeReglement");
var oef_aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","oef-listeVersion");
var oef_aLangues = new Arbre("Config/GetRDF/liste-langues.tmpl", "oef-langueDefaut");


function oef_init() {
  try {
    
    var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();
		
		var actCodeStats = (result.responseXML.documentElement.getAttribute('Act_Code_Stats')=="1");
		if (!actCodeStats) {
			document.getElementById('oef-colCodeStats').collapsed = true;
			document.getElementById('oef-colCodeStats').setAttribute('ignoreincolumnpicker', true);
	  	document.getElementById('oef-actCodeStats').collapsed = true;
		} else {
			document.getElementById('oef-labelRef').setAttribute('style', 'margin-left:0px');
			document.getElementById('oef-reference').setAttribute('style', 'margin-left:0px');
		}
		
		var produitFrais = (result.responseXML.documentElement.getAttribute('Produit_Frais')=="1");
		if (!produitFrais) {
			document.getElementById('oef-colNumLot').collapsed = true;
			document.getElementById('oef-colNumLot').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oef-colNbPieces').collapsed = true;
			document.getElementById('oef-colNbPieces').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oef-colUnite').collapsed = true;
			document.getElementById('oef-colUnite').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oef-colDatePeremption').collapsed = true;
			document.getElementById('oef-colDatePeremption').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oef-produitFrais1').collapsed = true;
			document.getElementById('oef-produitFrais2').collapsed = true;
			document.getElementById('oef-produitFrais3').collapsed = true;
			document.getElementById('oef-produitFrais4').collapsed = true;
		}
		
		var commission = (result.responseXML.documentElement.getAttribute('Act_Commission')=="1");
		if (!commission) {
			document.getElementById('oef-colTauxCommission').collapsed = true;
			document.getElementById('oef-colTauxCommission').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oef-colMontantCommission').collapsed = true;
			document.getElementById('oef-colMontantCommission').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('oef-actCommission').collapsed = true;
		}
		
		oef_defEditionTTC = (result.responseXML.documentElement.getAttribute('Vente_TTC')=="1");
		oef_modeTarif = result.responseXML.documentElement.getAttribute('Mode_Tarif');
		if (oef_modeTarif=='Q') {
			document.getElementById('oef-rowTarif').collapsed = true;
		}
		
		oef_aCodesTarifs.initTree(oef_initCodeTarif);

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_chargerResponsables(selection) {
	try {
		oef_chargerResponsable = selection;
		oef_aResponsables.setParam("Selection", oef_chargerResponsable);
		oef_aResponsables.initTree(oef_initResponsable);
	} catch (e) {
		recup_erreur(e);
	}
}

function oef_initResponsable() {
  try {
		document.getElementById('oef-responsable').value = oef_chargerResponsable;
	} catch (e) {
  	recup_erreur(e);
	}
}

function oef_initCodeTarif() {
	try {
		document.getElementById('oef-codeTarif').selectedIndex=0;
		oef_aUnites.initTree(oef_initUnite);
	} catch (e) {
		recup_erreur(e);
	}
}

function oef_initUnite() {
	try {
    document.getElementById('oef-unite').selectedIndex = 0;
    oef_aSecteurs.initTree(oef_initSecteur);
	} catch (e) {
    recup_erreur(e);
  }
}

function oef_initSecteur() {
	try {
		document.getElementById('oef-secteur').selectedIndex = 0;
		oef_aPaysFact.initTree(oef_initPaysFact);
	} catch (e) {
		recup_erreur(e);
	}
}

function oef_initPaysFact() {
	try {
		document.getElementById('oef-codePaysFact').value = "FR";
		oef_aPaysLiv.initTree(oef_initPaysLiv);
	} catch (e) {
    recup_erreur(e);
  }
}

function oef_initPaysLiv() {
	try {
		document.getElementById('oef-codePaysLiv').value = "FR";
		oef_aPaysEnvoi.initTree(oef_initPaysEnvoi);
	} catch (e) {
    recup_erreur(e);
  }
}

function oef_initPaysEnvoi() {
	try {
		document.getElementById('oef-codePaysEnvoi').value = "FR";
	} catch (e) {
    recup_erreur(e);
  }
}


function oef_chargerModesReglements(selection) {
	try {
		oef_chargerModeReg = selection;
		oef_aModesReglements.setParam("Selection", oef_chargerModeReg);
		oef_aModesReglements.initTree(oef_initModeReglement);
	} catch (e) {
		recup_erreur(e);
	}
}

function oef_initModeReglement() {
	try {
		document.getElementById('oef-modeReglement').value=oef_chargerModeReg;
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_reinitialiser() {
	try {
		
		oef_modeLigne = "C";
		oef_zoneUE=false;
		
		oef_assujettiTVA = false;
		oef_typeRemise = "P";
		oef_typeRemiseFP = "P";
		oef_editionTTC = oef_defEditionTTC;
		oef_defCommission = 0;
		oef_chargerModeReg="0";
		oef_chargerResponsable="0";
		oef_bloquerEcheance = false;
		oef_currentIndex = 0;
		oef_montantHT = 0;
		oef_montantTTC = 0;
		oef_apercu = false;
		
		document.getElementById('oef-tabBoxFacture').selectedIndex = 0;
		document.getElementById('oef-deckFacture').selectedIndex = 0;
		document.getElementById('oef-boxMail').collapsed=false;
		document.getElementById('oef-tabFacture').setAttribute('image', null);
		document.getElementById('oef-numAffaire').value = "";
		document.getElementById('oef-numFacture').value = "";
		document.getElementById('oef-dateFacture').value = "";
		document.getElementById('oef-modeEnvoiFacture').selectedIndex=0;
		document.getElementById('oef-codeTarif').selectedIndex=0;
		document.getElementById('oef-assujettiTVA').checked = false;
		document.getElementById('oef-numTVA').value = "";
		document.getElementById('oef-regimeTVA').selectedIndex=0;
		document.getElementById('oef-editionTTC').checked = oef_editionTTC;
		document.getElementById('oef-secteur').selectedIndex = 0;
		
		oef_aVersion.deleteTree();
		
		document.getElementById('oef-clientId').value = "";
		document.getElementById('oef-labelClient').value = "";
		
		oef_aModesReglements.deleteTree();
		oef_aResponsables.deleteTree();
		
		document.getElementById('oef-tabBoxAdresses').selectedIndex = 0;
		document.getElementById('oef-denominationFact').value = "";
		document.getElementById('oef-adresse1Fact').value = "";
		document.getElementById('oef-adresse2Fact').value = "";
		document.getElementById('oef-adresse3Fact').value = "";
		document.getElementById('oef-codePostalFact').value = "";
		document.getElementById('oef-villeFact').value = "";
		document.getElementById('oef-codePaysFact').value = "FR";
		document.getElementById('oef-civInterFact').selectedIndex = 0;
		document.getElementById('oef-nomInterFact').value = "";
		document.getElementById('oef-prenomInterFact').value = "";
		document.getElementById('oef-telInterFact').value = "";
		document.getElementById('oef-faxInterFact').value = "";
		document.getElementById('oef-emailInterFact').value = "";
		document.getElementById('oef-denominationLiv').value = "";
		document.getElementById('oef-adresse1Liv').value = "";
		document.getElementById('oef-adresse2Liv').value = "";
		document.getElementById('oef-adresse3Liv').value = "";
		document.getElementById('oef-codePostalLiv').value = "";
		document.getElementById('oef-villeLiv').value = "";
		document.getElementById('oef-codePaysLiv').value = "FR";
		oef_calculerTvaPort();
		document.getElementById('oef-civInterLiv').selectedIndex = 0;
		document.getElementById('oef-nomInterLiv').value = "";
		document.getElementById('oef-prenomInterLiv').value = "";
		document.getElementById('oef-telInterLiv').value = "";
		document.getElementById('oef-faxInterLiv').value = "";
		document.getElementById('oef-emailInterLiv').value = "";
		document.getElementById('oef-denominationEnvoi').value = "";
		document.getElementById('oef-adresse1Envoi').value = "";
		document.getElementById('oef-adresse2Envoi').value = "";
		document.getElementById('oef-adresse3Envoi').value = "";
		document.getElementById('oef-codePostalEnvoi').value = "";
		document.getElementById('oef-villeEnvoi').value = "";
		document.getElementById('oef-codePaysEnvoi').value = "FR";
		document.getElementById('oef-civInterEnvoi').selectedIndex = 0;
		document.getElementById('oef-nomInterEnvoi').value = "";
		document.getElementById('oef-prenomInterEnvoi').value = "";
		document.getElementById('oef-telInterEnvoi').value = "";
		document.getElementById('oef-faxInterEnvoi').value = "";
		document.getElementById('oef-emailInterEnvoi').value = "";
		
		document.getElementById('oef-codeStats').value = "";
		document.getElementById('oef-reference').value = "";
		document.getElementById('oef-designation').value = "";
		document.getElementById('oef-numLot').value = "";
		document.getElementById('oef-nbPieces').value = "";
		document.getElementById('oef-quantite').value = "";
		document.getElementById('oef-unite').value = "U";
		document.getElementById('oef-datePeremption').value = "";
		document.getElementById('oef-PU').value = "";
		document.getElementById('oef-ristourne').value = "";
		document.getElementById('oef-commission').value = "";
		document.getElementById('oef-codeTVA').value = getCodeTvaNormal(document.getElementById('oef-codePaysLiv').value, oef_assujettiTVA, document.getElementById('oef-regimeTVA').value);
		
		document.getElementById('oef-commentairesFin').value = "";
		document.getElementById('oef-commentairesInt').value = "";
		document.getElementById('oef-echeance').value = "";
		document.getElementById('oef-bRemise').setAttribute('class', 'bIcoPourcentage');
		document.getElementById('oef-remise').value = "0.00";
		document.getElementById('oef-fraisPort').value = "0.00";
		document.getElementById('oef-bRemiseFP').setAttribute('class', 'bIcoPourcentage');
		document.getElementById('oef-remiseFP').value = "0.00";
		document.getElementById('oef-escompte').value = "0.00";
		oef_acompte = 0;
		
		document.getElementById('oef-colTotal').setAttribute("label", oef_editionTTC?"Total TTC":"Total HT");
		document.getElementById('oef-colPU').setAttribute("label", oef_editionTTC?"P.U TTC":"P.U HT");
		document.getElementById('oef-lblFraisPort').value = (oef_editionTTC?"Frais de port (ttc) :":"Frais de port (ht) :");
		document.getElementById('oef-lblPU').value = (oef_editionTTC?"P.U TTC :":"P.U HT :");
		document.getElementById('oef-piedTTC').collapsed = !oef_editionTTC;
		document.getElementById('oef-piedHT').collapsed = oef_editionTTC;
		document.getElementById('oef-montantHT').value = "0.00";
		document.getElementById('oef-montantRemise').value = "0.00";
		document.getElementById('oef-montantFraisPort').value = "0.00";
		document.getElementById('oef-montantRemiseFP').value = "0.00";
		document.getElementById('oef-totalHT').value = "0.00";
		document.getElementById('oef-commissionHT').value = "0.00";
		document.getElementById('oef-TVA').value = "0.00";
		document.getElementById('oef-montantTTC').value = "0.00";
		document.getElementById('oef-montantEscompte').value = "0.00";
		document.getElementById('oef-montantAcompte').value = "0.00";
		document.getElementById('oef-totalTTC').value = "0.00";
		document.getElementById('oef-pttcMontantTTC').value = "0.00";
		document.getElementById('oef-pttcMontantRemise').value = "0.00";
		document.getElementById('oef-pttcMontantFraisPort').value = "0.00";
		document.getElementById('oef-pttcMontantRemiseFP').value = "0.00";
		document.getElementById('oef-pttcTotalTTC').value = "0.00";
		document.getElementById('oef-pttcCommissionTTC').value = "0.00";
		document.getElementById('oef-pttcTVA').value = "0.00";
		document.getElementById('oef-pttcMontantEscompte').value = "0.00";
		document.getElementById('oef-pttcMontantAcompte').value = "0.00";
		document.getElementById('oef-pttcNetTTC').value = "0.00";
		
		document.getElementById('oef-rowRemiseHT').collapsed = true;
		document.getElementById('oef-rowRemiseFPHT').collapsed = true;
		document.getElementById('oef-rowCommissionHT').collapsed = true;
		document.getElementById('oef-rowMontantTTC').collapsed = true;
		document.getElementById('oef-rowEscompteHT').collapsed = true;
		document.getElementById('oef-rowRemiseTTC').collapsed = true;
		document.getElementById('oef-rowRemiseFPTTC').collapsed = true;
		document.getElementById('oef-rowCommissionTTC').collapsed = true;
		document.getElementById('oef-rowEscompteTTC').collapsed = true;
		
		document.getElementById('oef-creation').setAttribute("label", "");
		document.getElementById('oef-modification').setAttribute("label", "");
		document.getElementById('oef-fiche').setAttribute("label", "");
		
		oef_typeLigne = "";
		oef_tarifId = "";
		oef_ligneId = "";
		oef_libelle = "";
		oef_modifie = false;
		
		document.getElementById('oef-modeEnvoiFacture').disabled = true;
		document.getElementById('oef-responsable').disabled = true;
		document.getElementById('oef-secteur').disabled = true;
		document.getElementById('oef-assujettiTVA').disabled = true;
		document.getElementById('oef-numTVA').disabled = true;
		document.getElementById('oef-regimeTVA').disabled = true;
		document.getElementById('oef-editionTTC').disabled = true;
		document.getElementById('oef-bChercherClient').disabled = true;
		document.getElementById('oef-denominationFact').disabled = true;
		document.getElementById('oef-adresse1Fact').disabled = true;
		document.getElementById('oef-adresse2Fact').disabled = true;
		document.getElementById('oef-adresse3Fact').disabled = true;
		document.getElementById('oef-codePostalFact').disabled = true;
		document.getElementById('oef-villeFact').disabled = true;
		document.getElementById('oef-codePaysFact').disabled = true;
		document.getElementById('oef-civInterFact').disabled = true;
		document.getElementById('oef-nomInterFact').disabled = true;
		document.getElementById('oef-prenomInterFact').disabled = true;
		document.getElementById('oef-telInterFact').disabled = true;
		document.getElementById('oef-faxInterFact').disabled = true;
		document.getElementById('oef-emailInterFact').disabled = true;
		document.getElementById('oef-bChercherAdrFact').disabled = true;
		document.getElementById('oef-bChercherInter').disabled = true;
		document.getElementById('oef-bCopierFactVersLivEnvoi').disabled = true;
		document.getElementById('oef-codeTarif').disabled = true;
		document.getElementById('oef-denominationLiv').disabled = true;
		document.getElementById('oef-adresse1Liv').disabled = true;
		document.getElementById('oef-adresse2Liv').disabled = true;
		document.getElementById('oef-adresse3Liv').disabled = true;
		document.getElementById('oef-codePostalLiv').disabled = true;
		document.getElementById('oef-villeLiv').disabled = true;
		document.getElementById('oef-codePaysLiv').disabled = true;
		document.getElementById('oef-civInterLiv').disabled = true;
		document.getElementById('oef-nomInterLiv').disabled = true;
		document.getElementById('oef-prenomInterLiv').disabled = true;
		document.getElementById('oef-telInterLiv').disabled = true;
		document.getElementById('oef-faxInterLiv').disabled = true;
		document.getElementById('oef-emailInterLiv').disabled = true;
		document.getElementById('oef-bChercherAdrLiv').disabled = true;
		document.getElementById('oef-bChercherInterLiv').disabled = true;
		document.getElementById('oef-denominationEnvoi').disabled = true;
		document.getElementById('oef-adresse1Envoi').disabled = true;
		document.getElementById('oef-adresse2Envoi').disabled = true;
		document.getElementById('oef-adresse3Envoi').disabled = true;
		document.getElementById('oef-codePostalEnvoi').disabled = true;
		document.getElementById('oef-villeEnvoi').disabled = true;
		document.getElementById('oef-codePaysEnvoi').disabled = true;
		document.getElementById('oef-civInterEnvoi').disabled = true;
		document.getElementById('oef-nomInterEnvoi').disabled = true;
		document.getElementById('oef-prenomInterEnvoi').disabled = true;
		document.getElementById('oef-telInterEnvoi').disabled = true;
		document.getElementById('oef-faxInterEnvoi').disabled = true;
		document.getElementById('oef-emailInterEnvoi').disabled = true;
		document.getElementById('oef-bChercherAdrEnvoi').disabled = true;
		document.getElementById('oef-bChercherInterEnvoi').disabled = true;
		
		document.getElementById('oef-commentairesFin').disabled = true;
		document.getElementById('oef-commentairesInt').disabled = true;
		document.getElementById('oef-bOuvrirCommentairesCaches').disabled = true;
		document.getElementById('oef-bChoisirMentions').disabled = true;
		document.getElementById('oef-modeReglement').disabled = true;
		document.getElementById('oef-echeance').disabled = true;
		document.getElementById('oef-bEchMultiples').disabled = true;
		document.getElementById('oef-bRemise').disabled = true;
		document.getElementById('oef-remise').disabled = true;
		document.getElementById('oef-fraisPort').disabled = true;
		document.getElementById('oef-bRemiseFP').disabled = true;
		document.getElementById('oef-remiseFP').disabled = true;
		document.getElementById('oef-escompte').disabled = true;
		document.getElementById('oef-bEnregistrer').disabled = true;
		document.getElementById('oef-bApercu').disabled = true;
		document.getElementById('oef-bVisualiser').disabled = true;
		document.getElementById('oef-bSupprimerFacture').disabled = true;
		document.getElementById('oef-bTransAvoir').disabled = true;
		
		document.getElementById('oef-codeStats').disabled = true;
		document.getElementById('oef-reference').disabled = true;
		document.getElementById('oef-designation').disabled = true;
		document.getElementById('oef-numLot').disabled = true;
		document.getElementById('oef-nbPieces').disabled = true;
		document.getElementById('oef-quantite').disabled = true;
		document.getElementById('oef-unite').disabled = true;
		document.getElementById('oef-datePeremption').disabled = true;
		document.getElementById('oef-PU').disabled = true;
		document.getElementById('oef-ristourne').disabled = true;
		document.getElementById('oef-commission').disabled = true;
		document.getElementById('oef-codeTVA').disabled = true;
		document.getElementById('oef-bSupprimer').disabled = true;
		document.getElementById('oef-bFlecheHaut').disabled = true;
		document.getElementById('oef-bFlecheBas').disabled = true;
		document.getElementById('oef-bValider').disabled = true;
		document.getElementById('oef-bAnnuler').disabled = true;
		document.getElementById('oef-bArticle').disabled = true;
		document.getElementById('oef-bCommentaire').disabled = true;
		oef_aArticles.deleteTree();
		
		document.getElementById('oef-pdfFacture').setAttribute('src', null);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_calculerTvaPort() {
	try {
		oef_codeTvaPort = getCodeTvaNormal(document.getElementById("oef-codePaysLiv").value,oef_assujettiTVA,document.getElementById("oef-regimeTVA").value);
		oef_tauxTvaPort = getTva(oef_codeTvaPort);
	} catch (e) {
		recup_erreur(e);
	}
}



function oef_afficherNumAffaire() {
	try {
		
		var qGetNumAffaire = new QueryHttp("Facturation/Affaires/getNumAffaire.tmpl");
		qGetNumAffaire.setParam("Affaire_Id", affaireId);
		var result = qGetNumAffaire.execute();
		document.getElementById('oef-numAffaire').value = result.responseXML.documentElement.getAttribute("Num_Entier");

	} catch (e) {
		recup_erreur(e);
	}
}


function oef_debloquerChamps() {
	try {
		document.getElementById('oef-modeEnvoiFacture').disabled = false;
		document.getElementById('oef-responsable').disabled = false;
		document.getElementById('oef-secteur').disabled = false;
		document.getElementById('oef-assujettiTVA').disabled = false;
		document.getElementById('oef-regimeTVA').disabled = false;
		document.getElementById('oef-editionTTC').disabled = false;
		document.getElementById('oef-bChercherClient').disabled = false;
		document.getElementById('oef-denominationFact').disabled = false;
		document.getElementById('oef-adresse1Fact').disabled = false;
		document.getElementById('oef-adresse2Fact').disabled = false;
		document.getElementById('oef-adresse3Fact').disabled = false;
		document.getElementById('oef-codePostalFact').disabled = false;
		document.getElementById('oef-villeFact').disabled = false;
		document.getElementById('oef-codePaysFact').disabled = false;
		document.getElementById('oef-civInterFact').disabled = false;
		document.getElementById('oef-nomInterFact').disabled = false;
		document.getElementById('oef-prenomInterFact').disabled = false;
		document.getElementById('oef-telInterFact').disabled = false;
		document.getElementById('oef-faxInterFact').disabled = false;
		document.getElementById('oef-emailInterFact').disabled = false;
		document.getElementById('oef-bCopierFactVersLivEnvoi').disabled = false;
		document.getElementById('oef-codeTarif').disabled = false;
		document.getElementById('oef-denominationLiv').disabled = false;
		document.getElementById('oef-adresse1Liv').disabled = false;
		document.getElementById('oef-adresse2Liv').disabled = false;
		document.getElementById('oef-adresse3Liv').disabled = false;
		document.getElementById('oef-codePostalLiv').disabled = false;
		document.getElementById('oef-villeLiv').disabled = false;
		document.getElementById('oef-codePaysLiv').disabled = false;
		document.getElementById('oef-civInterLiv').disabled = false;
		document.getElementById('oef-nomInterLiv').disabled = false;
		document.getElementById('oef-prenomInterLiv').disabled = false;
		document.getElementById('oef-telInterLiv').disabled = false;
		document.getElementById('oef-faxInterLiv').disabled = false;
		document.getElementById('oef-emailInterLiv').disabled = false;
		document.getElementById('oef-denominationEnvoi').disabled = false;
		document.getElementById('oef-adresse1Envoi').disabled = false;
		document.getElementById('oef-adresse2Envoi').disabled = false;
		document.getElementById('oef-adresse3Envoi').disabled = false;
		document.getElementById('oef-codePostalEnvoi').disabled = false;
		document.getElementById('oef-villeEnvoi').disabled = false;
		document.getElementById('oef-codePaysEnvoi').disabled = false;
		document.getElementById('oef-civInterEnvoi').disabled = false;
		document.getElementById('oef-nomInterEnvoi').disabled = false;
		document.getElementById('oef-prenomInterEnvoi').disabled = false;
		document.getElementById('oef-telInterEnvoi').disabled = false;
		document.getElementById('oef-faxInterEnvoi').disabled = false;
		document.getElementById('oef-emailInterEnvoi').disabled = false;
		
		document.getElementById('oef-commentairesFin').disabled = false;
		document.getElementById('oef-commentairesInt').disabled = false;
		document.getElementById('oef-bChoisirMentions').disabled = false;
		document.getElementById('oef-bRemise').disabled = false;
		document.getElementById('oef-remise').disabled = false;
		document.getElementById('oef-fraisPort').disabled = false;
		document.getElementById('oef-bRemiseFP').disabled = false;
		document.getElementById('oef-remiseFP').disabled = false;
		document.getElementById('oef-escompte').disabled = false;
		document.getElementById('oef-bEnregistrer').disabled = false;
		
		document.getElementById('oef-codeStats').disabled = false;
		document.getElementById('oef-reference').disabled = false;
		document.getElementById('oef-designation').disabled = false;
		document.getElementById('oef-numLot').disabled = false;
		document.getElementById('oef-nbPieces').disabled = false;
		document.getElementById('oef-quantite').disabled = false;
		document.getElementById('oef-unite').disabled = false;
		document.getElementById('oef-datePeremption').disabled = false;
		document.getElementById('oef-PU').disabled = false;
		document.getElementById('oef-ristourne').disabled = false;
		document.getElementById('oef-commission').disabled = false;
		document.getElementById('oef-codeTVA').disabled = false;
		document.getElementById('oef-bValider').disabled = false;
		document.getElementById('oef-bAnnuler').disabled = false;
		document.getElementById('oef-bArticle').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}



function oef_chargerFacture() {
	try {
		oef_mode = "M";
		oef_reinitialiser();
		
		oef_aArticles.setParam("Facture_Id", factureId);
		oef_aArticles.initTree(oef_chargerFacture2);
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_chargerFacture2() {
  try {
		
		var qGetFacture = new QueryHttp("Facturation/Affaires/getFacture.tmpl");
		qGetFacture.setParam("Facture_Id", factureId);
		var result = qGetFacture.execute();

		var contenu = result.responseXML.documentElement;
		
		affaireId = contenu.getAttribute('Affaire_Id');
		oef_defCommission = contenu.getAttribute("Def_Commission");

		var numFacture = contenu.getAttribute('Num_Entier');

		oef_typeRemise = (parseFloat(contenu.getAttribute('Montant_Remise'))!=0?'M':'P');
		document.getElementById('oef-remise').value = (oef_typeRemise=='P'?contenu.getAttribute('Remise'):contenu.getAttribute('Montant_Remise'));
		document.getElementById('oef-bRemise').setAttribute("class", (oef_typeRemise=='P'?"bIcoPourcentage":"bIcoEuro"));
		
		oef_typeRemiseFP = (parseFloat(contenu.getAttribute('MRemise_FP'))!=0?'M':'P');
		document.getElementById('oef-remiseFP').value = (oef_typeRemiseFP=='P'?contenu.getAttribute('PRemise_FP'):contenu.getAttribute('MRemise_FP'));
		document.getElementById('oef-bRemiseFP').setAttribute("class", (oef_typeRemiseFP=='P'?"bIcoPourcentage":"bIcoEuro"));
		
		document.getElementById('oef-escompte').value = contenu.getAttribute('Escompte');
		oef_acompte = contenu.getAttribute('Acompte');
		document.getElementById('oef-fraisPort').value = contenu.getAttribute('Frais_Port');
		document.getElementById('oef-commentairesFin').value = contenu.getAttribute('Commentaires_Fin');
		document.getElementById('oef-commentairesInt').value = contenu.getAttribute('Commentaires_Int');
		document.getElementById('oef-dateFacture').value = contenu.getAttribute('Date_Facture');
		document.getElementById('oef-numFacture').value = numFacture;
		document.getElementById('oef-secteur').value = contenu.getAttribute('Secteur_Activite');
		document.getElementById('oef-echeance').value = contenu.getAttribute('Echeance');
		oef_chargerModesReglements(contenu.getAttribute('Mode_Reglement'));
		document.getElementById('oef-modeEnvoiFacture').value = contenu.getAttribute('Mode_Envoi_Facture');

		document.getElementById('oef-denominationFact').value = contenu.getAttribute('Denomination');
		document.getElementById('oef-adresse1Fact').value = contenu.getAttribute('Adresse_1');
		document.getElementById('oef-adresse2Fact').value = contenu.getAttribute('Adresse_2');
		document.getElementById('oef-adresse3Fact').value = contenu.getAttribute('Adresse_3');
		document.getElementById('oef-codePostalFact').value = contenu.getAttribute('Code_Postal');
		document.getElementById('oef-villeFact').value = contenu.getAttribute('Ville');
		document.getElementById('oef-codePaysFact').value = contenu.getAttribute('Code_Pays');
		document.getElementById('oef-civInterFact').value = contenu.getAttribute('Civ_Inter');
		document.getElementById('oef-nomInterFact').value = contenu.getAttribute('Nom_Inter');
		document.getElementById('oef-prenomInterFact').value = contenu.getAttribute('Prenom_Inter');
		document.getElementById('oef-telInterFact').value = contenu.getAttribute('Tel_Inter');
		document.getElementById('oef-faxInterFact').value = contenu.getAttribute('Fax_Inter');
		document.getElementById('oef-emailInterFact').value = contenu.getAttribute('Email_Inter');
		
		document.getElementById('oef-denominationLiv').value = contenu.getAttribute('Denomination_Liv');
		document.getElementById('oef-adresse1Liv').value = contenu.getAttribute('Adresse_1_Liv');
		document.getElementById('oef-adresse2Liv').value = contenu.getAttribute('Adresse_2_Liv');
		document.getElementById('oef-adresse3Liv').value = contenu.getAttribute('Adresse_3_Liv');
		document.getElementById('oef-codePostalLiv').value = contenu.getAttribute('Code_Postal_Liv');
		document.getElementById('oef-villeLiv').value = contenu.getAttribute('Ville_Liv');
		document.getElementById('oef-codePaysLiv').value = contenu.getAttribute('Code_Pays_Liv');
		document.getElementById('oef-civInterLiv').value = contenu.getAttribute('Civ_Inter_Liv');
		document.getElementById('oef-nomInterLiv').value = contenu.getAttribute('Nom_Inter_Liv');
		document.getElementById('oef-prenomInterLiv').value = contenu.getAttribute('Prenom_Inter_Liv');
		document.getElementById('oef-telInterLiv').value = contenu.getAttribute('Tel_Inter_Liv');
		document.getElementById('oef-faxInterLiv').value = contenu.getAttribute('Fax_Inter_Liv');
		document.getElementById('oef-emailInterLiv').value = contenu.getAttribute('Email_Inter_Liv');
		
		document.getElementById('oef-denominationEnvoi').value = contenu.getAttribute('Denomination_Envoi');
		document.getElementById('oef-adresse1Envoi').value = contenu.getAttribute('Adresse_1_Envoi');
		document.getElementById('oef-adresse2Envoi').value = contenu.getAttribute('Adresse_2_Envoi');
		document.getElementById('oef-adresse3Envoi').value = contenu.getAttribute('Adresse_3_Envoi');
		document.getElementById('oef-codePostalEnvoi').value = contenu.getAttribute('Code_Postal_Envoi');
		document.getElementById('oef-villeEnvoi').value = contenu.getAttribute('Ville_Envoi');
		document.getElementById('oef-codePaysEnvoi').value = contenu.getAttribute('Code_Pays_Envoi');
		document.getElementById('oef-civInterEnvoi').value = contenu.getAttribute('Civ_Inter_Envoi');
		document.getElementById('oef-nomInterEnvoi').value = contenu.getAttribute('Nom_Inter_Envoi');
		document.getElementById('oef-prenomInterEnvoi').value = contenu.getAttribute('Prenom_Inter_Envoi');
		document.getElementById('oef-telInterEnvoi').value = contenu.getAttribute('Tel_Inter_Envoi');
		document.getElementById('oef-faxInterEnvoi').value = contenu.getAttribute('Fax_Inter_Envoi');
		document.getElementById('oef-emailInterEnvoi').value = contenu.getAttribute('Email_Inter_Envoi');

		document.getElementById('oef-codeTarif').value = contenu.getAttribute('Code_Tarif');
		document.getElementById('oef-regimeTVA').value = contenu.getAttribute('Regime_TVA');
		oef_codeTvaPort = contenu.getAttribute('Code_TVA_Port');
		oef_tauxTvaPort = contenu.getAttribute('Taux_TVA_Port');
		oef_assujettiTVA = (contenu.getAttribute('Assujetti_TVA')=="1");		
		oef_selectPaysLiv();
		
		var typeEdition = (contenu.getAttribute('Edition_TTC')=="1");
		
		document.getElementById('oef-editionTTC').checked = typeEdition;
		
		document.getElementById('oef-assujettiTVA').checked = oef_assujettiTVA;
		document.getElementById('oef-numTVA').value = contenu.getAttribute("Num_TVA_Intra");

		var clientId = contenu.getAttribute('Client_Id');
    document.getElementById('oef-clientId').value = clientId;
		var clientConnu = (clientId!="");
		
		if (clientConnu) {
			document.getElementById('oef-labelClient').setAttribute("value", clientId);
		}
		oef_chargerResponsables(contenu.getAttribute('Util_R'));

		document.getElementById('oef-creation').setAttribute("label", "Facture créée le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur'));
		document.getElementById('oef-modification').setAttribute("label", "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj'));
		document.getElementById('oef-fiche').setAttribute("label", "Facture N° "+ numFacture);
		document.getElementById('oef-creation').collapsed = false;
		document.getElementById('oef-modification').collapsed = false;

		oef_initVersion();
		
		oef_modifie = false;
		document.getElementById('oef-tabFacture').setAttribute('image', null);
		
		document.getElementById('oef-bOuvrirCommentairesCaches').disabled = false;
		
		oef_bloquerEcheance = (parseFloat(contenu.getAttribute('Net_A_Payer'))==0);

		if (parseIntBis(contenu.getAttribute('Numero'))>0) {
			oef_mode = "V";
			document.getElementById('oef-bTransAvoir').disabled = false;
		} else {
			oef_debloquerChamps();
			document.getElementById('oef-bChercherAdrFact').disabled = !clientConnu;
			document.getElementById('oef-bChercherInter').disabled = !clientConnu;
			document.getElementById('oef-bChercherAdrLiv').disabled = !clientConnu;
			document.getElementById('oef-bChercherInterLiv').disabled = !clientConnu;
			document.getElementById('oef-bChercherAdrEnvoi').disabled = !clientConnu;
			document.getElementById('oef-bChercherInterEnvoi').disabled = !clientConnu;
			document.getElementById('oef-numTVA').disabled = !oef_assujettiTVA;
			document.getElementById('oef-bSupprimerFacture').disabled = false;
			var echModifiable = (contenu.getAttribute('Ech_Modifiable')=="1");
    	document.getElementById('oef-echeance').disabled = !echModifiable;
  		document.getElementById('oef-modeReglement').disabled = !echModifiable;
  		oef_ajouterLigne("I");
		}
		document.getElementById('oef-bOuvrirCommentairesCaches').disabled = false;
		document.getElementById('oef-bApercu').disabled = (oef_mode == "V");
		document.getElementById('oef-bVisualiser').disabled = false;
		
		document.getElementById('oef-bEchMultiples').disabled = oef_bloquerEcheance;

		oef_changerTypeEdition(typeEdition);
		
		oef_afficherNumAffaire();

	} catch (e) {
    recup_erreur(e);
  }
}



function oef_formatLigne(typeLigne) {
  try {

		switch(typeLigne) {
			case "S":
				document.getElementById('oef-codeStats').disabled = false;
				document.getElementById('oef-reference').disabled = true;
				document.getElementById('oef-designation').disabled = true;
				document.getElementById('oef-numLot').disabled = false;
				document.getElementById('oef-nbPieces').disabled = false;
				document.getElementById('oef-quantite').disabled = false;
				document.getElementById('oef-unite').disabled = false;
				document.getElementById('oef-datePeremption').disabled = false;
				document.getElementById('oef-PU').disabled = false;
				document.getElementById('oef-ristourne').disabled = false;
				document.getElementById('oef-commission').disabled = false;
				document.getElementById('oef-codeTVA').disabled = false;
				document.getElementById('oef-bValider').disabled = false;
				document.getElementById('oef-bAnnuler').disabled = false;
				break;

			case "I":
				document.getElementById('oef-codeStats').disabled = false;
				document.getElementById('oef-reference').disabled = false;
				document.getElementById('oef-designation').disabled = false;
				document.getElementById('oef-numLot').disabled = false;
				document.getElementById('oef-nbPieces').disabled = false;
				document.getElementById('oef-quantite').disabled = false;
				document.getElementById('oef-unite').disabled = false;
				document.getElementById('oef-datePeremption').disabled = false;
				document.getElementById('oef-PU').disabled = false;
				document.getElementById('oef-ristourne').disabled = false;
				document.getElementById('oef-commission').disabled = false;
				document.getElementById('oef-codeTVA').disabled = false;
				document.getElementById('oef-bValider').disabled = false;
				document.getElementById('oef-bAnnuler').disabled = false;
				break;

			default:
				document.getElementById('oef-codeStats').value = "";
				document.getElementById('oef-reference').value = "";
				document.getElementById('oef-designation').value = "";
				document.getElementById('oef-numLot').value = "";
				document.getElementById('oef-nbPieces').value = "";
				document.getElementById('oef-quantite').value = "";
				document.getElementById('oef-unite').value = "U";
				document.getElementById('oef-datePeremption').value = "";
				document.getElementById('oef-PU').value = "";
				document.getElementById('oef-ristourne').value = "";
				document.getElementById('oef-commission').value = "";
				oef_libelle = "";
				oef_ligneId = "";
				document.getElementById('oef-codeTVA').value = getCodeTvaNormal(document.getElementById('oef-codePaysLiv').value, oef_assujettiTVA, document.getElementById('oef-regimeTVA').value);
				document.getElementById('oef-codeStats').disabled = true;
				document.getElementById('oef-reference').disabled = true;
				document.getElementById('oef-designation').disabled = true;
				document.getElementById('oef-numLot').disabled = true;
				document.getElementById('oef-nbPieces').disabled = true;
				document.getElementById('oef-quantite').disabled = true;
				document.getElementById('oef-unite').disabled = true;
				document.getElementById('oef-datePeremption').disabled = true;
				document.getElementById('oef-PU').disabled = true;
				document.getElementById('oef-ristourne').disabled = true;
				document.getElementById('oef-commission').disabled = true;
				document.getElementById('oef-codeTVA').disabled = true;
				document.getElementById('oef-bCommentaire').disabled = true;
				document.getElementById('oef-bSupprimer').disabled = true;
				document.getElementById('oef-bFlecheHaut').disabled = true;
				document.getElementById('oef-bFlecheBas').disabled = true;
				document.getElementById('oef-bValider').disabled = true;
				document.getElementById('oef-bAnnuler').disabled = true;
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}



function oef_selectPaysLiv() {
	try {
		oef_listeTVA();
    oef_changerTypeVente();
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_listeTVA() {
  try {
  	oef_calculTotaux();
    
    oef_aCodesTVA.setParam("Code_Pays", document.getElementById("oef-codePaysLiv").value);
    oef_aCodesTVA.setParam("Regime_TVA", document.getElementById("oef-regimeTVA").value);
    oef_aCodesTVA.setParam("Assujetti_TVA", oef_assujettiTVA?"1":"0");
    oef_aCodesTVA.initTree(oef_selectTVA); 
  } catch (e) {
    recup_erreur(e);
  }
}


function oef_selectTVA() {
  try {
    document.getElementById('oef-codeTVA').value = getCodeTvaNormal(document.getElementById('oef-codePaysLiv').value, oef_assujettiTVA, document.getElementById('oef-regimeTVA').value);
  } catch (e) {
    recup_erreur(e);
  }
}


function oef_switchRemise() {
	try {

		if (oef_typeRemise=='P') {
			document.getElementById('oef-bRemise').setAttribute("class", "bIcoEuro");
			oef_typeRemise = 'M';
		}
		else {
			document.getElementById('oef-bRemise').setAttribute("class", "bIcoPourcentage");
			oef_typeRemise = 'P';
		}
		oef_calculTotaux();
		oef_setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_switchRemiseFP() {
	try {

		if (oef_typeRemiseFP=='P') {
			document.getElementById('oef-bRemiseFP').setAttribute("class", "bIcoEuro");
			oef_typeRemiseFP = 'M';
		}
		else {
			document.getElementById('oef-bRemiseFP').setAttribute("class", "bIcoPourcentage");
			oef_typeRemiseFP = 'P';
		}
		oef_calculTotaux();
		oef_setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_ajouterLigne(typeLigne) {
  try {
  	
  	document.getElementById('oef-bSupprimer').disabled = true;
  	document.getElementById('oef-bCommentaire').disabled = true;
  	document.getElementById('oef-bFlecheHaut').disabled = true;
		document.getElementById('oef-bFlecheBas').disabled = true;

		oef_modeLigne = "C";

		oef_typeLigne = typeLigne;
		oef_ligneId = "";

		oef_formatLigne(typeLigne);

		switch(typeLigne) {
			case "S":

				var reference = document.getElementById('oef-reference').value;

				if (!isEmpty(reference)) {

					if (oef_modeTarif=='Q') {

						var url = "chrome://opensi/content/facturation/user/commun/popup-choixTarif.xul?"+ cookie() +"&Article_Id="+ urlEncode(reference);
    				window.openDialog(url,'','chrome,modal,centerscreen', oef_reporterTarifId);

						var tarifId = oef_tarifId;

						if (!isEmpty(tarifId)) {

							var qGetArticleQte = new QueryHttp("Facturation/Affaires/getArticleQte.tmpl");
							qGetArticleQte.setParam("Article_Id", reference);
							qGetArticleQte.setParam("Tarif_Id", tarifId);
							qGetArticleQte.setParam("Type_Prix", oef_editionTTC?"TTC":"HT");

							var result = qGetArticleQte.execute();
							var contenu = result.responseXML.documentElement;

							document.getElementById('oef-codeStats').value = contenu.getAttribute("Code_Stats");
							document.getElementById('oef-designation').value = contenu.getAttribute("Designation");
							document.getElementById('oef-numLot').value = "";
							document.getElementById('oef-nbPieces').value = "";
							document.getElementById('oef-quantite').value = contenu.getAttribute("Quantite");
							document.getElementById('oef-unite').value = contenu.getAttribute("Unite");
							document.getElementById('oef-datePeremption').value = "";
							document.getElementById('oef-PU').value = contenu.getAttribute("Prix");
							document.getElementById('oef-ristourne').value = "0.00";
							document.getElementById('oef-commission').value = oef_defCommission;
							document.getElementById('oef-codeTVA').value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"), document.getElementById('oef-codePaysLiv').value, oef_assujettiTVA, document.getElementById('oef-regimeTVA').value);
							oef_tarifId = "";
							oef_libelle = contenu.getAttribute("Libelle");
						}
						else {
							oef_ajouterLigne("I");
						}
					}
					else {
						
						var qGetArticleTarif = new QueryHttp("Facturation/Affaires/getArticleTarif.tmpl");
						qGetArticleTarif.setParam("Article_Id", reference);
						qGetArticleTarif.setParam("Code_Tarif", document.getElementById('oef-codeTarif').value);
						qGetArticleTarif.setParam("Type_Prix", oef_editionTTC?"TTC":"HT");
						
						var clientId = document.getElementById('oef-clientId').value;
						if (!isEmpty(clientId)) {
							qGetArticleTarif.setParam("Client_Id", clientId);
						}

						var result = qGetArticleTarif.execute();
						var contenu = result.responseXML.documentElement;

						document.getElementById('oef-codeStats').value = contenu.getAttribute("Code_Stats");
						document.getElementById('oef-designation').value = contenu.getAttribute("Designation");
						document.getElementById('oef-numLot').value = "";
						document.getElementById('oef-nbPieces').value = "";
						document.getElementById('oef-quantite').value = 1;
						document.getElementById('oef-unite').value = contenu.getAttribute("Unite");
						document.getElementById('oef-datePeremption').value = "";
						document.getElementById('oef-PU').value = contenu.getAttribute("Prix");
						document.getElementById('oef-ristourne').value = "0.00";
						document.getElementById('oef-commission').value = oef_defCommission;
						document.getElementById('oef-codeTVA').value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"), document.getElementById('oef-codePaysLiv').value, oef_assujettiTVA, document.getElementById('oef-regimeTVA').value);
						oef_libelle = "";
					}
				}
				else {
					oef_ajouterLigne("I");
				}

				break;

			case "I":

				document.getElementById('oef-codeStats').value = "";
				document.getElementById('oef-reference').value = "";
				document.getElementById('oef-designation').value = "";
				document.getElementById('oef-numLot').value = "";
				document.getElementById('oef-nbPieces').value = "";
				document.getElementById('oef-quantite').value = 1;
				document.getElementById('oef-unite').value = "U";
				document.getElementById('oef-datePeremption').value = "";
				document.getElementById('oef-PU').value = "";
				document.getElementById('oef-ristourne').value = "0.00";
				document.getElementById('oef-commission').value = oef_defCommission;
				document.getElementById('oef-codeTVA').value = getCodeTvaNormal(document.getElementById('oef-codePaysLiv').value, oef_assujettiTVA, document.getElementById('oef-regimeTVA').value);
				oef_libelle = "";
				document.getElementById('oef-reference').focus();
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}




function oef_pressOnWindow(ev) {
	try {

		if (ev.altKey && oef_mode!="V") {
			switch(ev.charCode) {
      	case 97: // 'a'
					oef_rechercherStock();
        	break;
				case 116: // 't'
					oef_modifierTarif();
					break;
    	}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_pressOnQuantite(ev) {
	try {
		
		if (ev.keyCode==13) {
			oef_validerLigne();
		}
		
	} catch (e) {
    recup_erreur(e);
  }
}


function oef_pressOnReference(ev) {
	try {

		if (ev.keyCode==13) {
			oef_rechercherReference();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_rechercherStock(reference) {
	try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		if (oef_modeTarif != "Q") {
			url += "&Code_Tarif=" + document.getElementById('oef-codeTarif').value;
		}
		if (reference != null) { url += "&Reference="+ urlEncode(reference); }
    window.openDialog(url,'','chrome,modal,centerscreen',oef_retourRechercherStock);

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_retourRechercherStock(reference) {
	try {
	
		document.getElementById('oef-reference').value = reference;
		oef_ajouterLigne("S");
	
	} catch (e) {
    recup_erreur(e);
  }
}


function oef_rechercherReference() {
	try {
		
		var reference = document.getElementById('oef-reference').value;

		var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
		qExArt.setParam("Reference", reference);
		var result = qExArt.execute();
		
		var articleId = result.responseXML.documentElement.getAttribute("Article_Id");
		
		if (!isEmpty(articleId)) {
			document.getElementById('oef-reference').value = articleId;
			oef_ajouterLigne("S");
		} else {
			oef_rechercherStock(reference);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_modifierTarif() {
	try {

		if (oef_modeLigne = "M" && oef_typeLigne=='S') {

			if (oef_modeTarif=='Q') {

				var reference = document.getElementById('oef-reference').value;

				var url = "chrome://opensi/content/facturation/user/commun/popup-choixTarif.xul?"+ cookie() +"&Article_Id="+ urlEncode(reference);
    		window.openDialog(url,'','chrome,modal,centerscreen', oef_reporterTarifId);

				var tarifId = oef_tarifId;

				if (!isEmpty(tarifId)) {

					var qGetArticleQte = new QueryHttp("Facturation/Affaires/getArticleQte.tmpl");
					qGetArticleQte.setParam("Article_Id", reference);
					qGetArticleQte.setParam("Tarif_Id", tarifId);
					qGetArticleQte.setParam("Type_Prix", oef_editionTTC?"TTC":"HT");

					var result = qGetArticleQte.execute();
					var contenu = result.responseXML.documentElement;

					document.getElementById('oef-quantite').value = contenu.getAttribute("Quantite");
					document.getElementById('oef-unite').value = contenu.getAttribute("Unite");
					document.getElementById('oef-PU').value = contenu.getAttribute("Prix");
					oef_tarifId = "";
					oef_libelle = contenu.getAttribute("Libelle");
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_reporterTarifId(tarifId) {
	try {
		oef_tarifId = tarifId;
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_ouvrirLigne() {
  try {

		if (oef_aArticles.isSelected() && oef_mode=="M") {
			var i = oef_aArticles.getCurrentIndex();
			oef_currentIndex = i;
			
			if (oef_aArticles.getCellText(i,'oef-colTypeLigne')=="C") {
				oef_ajouterLigne("I");
			}
			else {
				oef_modeLigne = "M";
				document.getElementById('oef-bCommentaire').disabled = false;
				document.getElementById('oef-bSupprimer').disabled = false;

				document.getElementById('oef-codeStats').value = oef_aArticles.getCellText(i,'oef-colCodeStats');
				document.getElementById('oef-reference').value = oef_aArticles.getCellText(i,'oef-colReference');
				document.getElementById('oef-designation').value = oef_aArticles.getCellText(i,'oef-colDesignation');
				document.getElementById('oef-numLot').value = oef_aArticles.getCellText(i,'oef-colNumLot');
				document.getElementById('oef-nbPieces').value = oef_aArticles.getCellText(i,'oef-colNbPieces');
				document.getElementById('oef-quantite').value = oef_aArticles.getCellText(i,'oef-colQuantite');
				document.getElementById('oef-unite').value = oef_aArticles.getCellText(i,'oef-colUnite');
				document.getElementById('oef-datePeremption').value = oef_aArticles.getCellText(i,'oef-colDatePeremption');
				document.getElementById('oef-PU').value = oef_aArticles.getCellText(i,'oef-colPU');
				document.getElementById('oef-codeTVA').value = oef_aArticles.getCellText(i,'oef-colCodeTVA');
				document.getElementById('oef-ristourne').value = oef_aArticles.getCellText(i,'oef-colRistourne');
				document.getElementById('oef-commission').value = oef_aArticles.getCellText(i,'oef-colTauxCommission');
				oef_typeLigne = oef_aArticles.getCellText(i,'oef-colTypeLigne');
				oef_ligneId = oef_aArticles.getCellText(i,'oef-colLigneId');
				oef_libelle = oef_aArticles.getCellText(i,'oef-colLibelle');
				
				// on ignore les lignes de commentaires
				var firstIndex = 0;
				var lastIndex = oef_aArticles.nbLignes()-1;
				if (oef_aArticles.getCellText(firstIndex,'oef-colTypeLigne')=="C") { firstIndex++; }
				if (oef_aArticles.getCellText(lastIndex,'oef-colTypeLigne')=="C") { lastIndex--; }
				
				document.getElementById('oef-bFlecheHaut').disabled = (i==firstIndex);
				document.getElementById('oef-bFlecheBas').disabled = (i==lastIndex);

				oef_formatLigne(oef_typeLigne);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_ouvrirCommentaire() {
  try {
  	
  	

		if (oef_aArticles.isSelected() && oef_mode=="M") {
			var i = oef_aArticles.getCurrentIndex();
			if (oef_aArticles.getCellText(i,'oef-colTypeLigne')=="C") {
				// POUR L'INSTANT on n'autorise pas les modifications des commentaires
				//oef_editerCommentaire();
			} else {
				oef_editerPrixAchat();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_deplacerLigneBas() {
	try {
		oef_deplacerLigne("Bas");
	} catch (e) {
		recup_erreur(e);
	}
}

function oef_deplacerLigneHaut() {
	try {
		oef_deplacerLigne("Haut");
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_deplacerLigne(type) {
	try {
		if (oef_aArticles.isSelected() && oef_mode=="M") {
			var i = oef_aArticles.getCurrentIndex();
			if (oef_aArticles.getCellText(i,'oef-colTypeLigne')!="C") {
				var ligneId = oef_aArticles.getCellText(i,'oef-colLigneId');
				var qDeplacerLigne = new QueryHttp("Facturation/Factu_Directe/deplacerLigne.tmpl");
				qDeplacerLigne.setParam("Ligne_Id", ligneId);
				qDeplacerLigne.setParam("Deplacement", type);
				qDeplacerLigne.execute();
				
				oef_ajouterLigne("I");
				oef_aArticles.deleteTree();
				oef_initTree2();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_validerLigne() {
  try {

		var codeStats = document.getElementById('oef-codeStats').value;
		var reference = document.getElementById('oef-reference').value;
		var designation = document.getElementById('oef-designation').value;
		var numLot = document.getElementById('oef-numLot').value;
		var nbPieces = document.getElementById('oef-nbPieces').value;
		var quantite = document.getElementById('oef-quantite').value;
		var unite = document.getElementById('oef-unite').value;
		var datePeremption = document.getElementById('oef-datePeremption').value;
		var pu = document.getElementById('oef-PU').value;
		var ristourne = document.getElementById('oef-ristourne').value;
		var commission = document.getElementById('oef-commission').value;
		var codeTVA = document.getElementById('oef-codeTVA').value;

		var qValiderLigne;
		if (oef_modeLigne=="C") {
			qValiderLigne = new QueryHttp("Facturation/Affaires/ajouterArticleFacture.tmpl");
			qValiderLigne.setParam("Type_Ligne", oef_typeLigne);
		}
		else {
			qValiderLigne = new QueryHttp("Facturation/Affaires/modifierArticleFacture.tmpl");
			qValiderLigne.setParam("Ligne_Id", oef_ligneId);
		}
		qValiderLigne.setParam("Reference", reference);
		qValiderLigne.setParam("Designation", designation);
		qValiderLigne.setParam("Quantite", quantite);
		qValiderLigne.setParam("Prix", pu);
		qValiderLigne.setParam("Ristourne", ristourne);
		qValiderLigne.setParam("Commission", commission);
		qValiderLigne.setParam("Code_TVA", codeTVA);
		qValiderLigne.setParam("Libelle", oef_libelle);
		qValiderLigne.setParam("Code_Stats", codeStats);
		qValiderLigne.setParam("Unite", unite);
		qValiderLigne.setParam("Nb_Pieces", nbPieces);
		qValiderLigne.setParam("Num_Lot", numLot);
		qValiderLigne.setParam("Facture_Id", factureId);
		
		if (isEmpty(designation)) { showWarning("Désignation de l'article manquante !"); }
		else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !");	}
		else if (!isEmpty(nbPieces) && !isPositiveInteger(nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
		else if (!isEmpty(datePeremption) && !isDate(datePeremption)) { showWarning("Date de péremption incorrecte !");	}
		else if (isEmpty(pu) || !isPositiveOrNull(pu) || !checkDecimal(pu,4)) { showWarning("Prix unitaire incorrect !");	}
		else if (isEmpty(ristourne) || !isTaux(ristourne)) { showWarning("Taux de ristourne incorrect !");	}
		else if (isEmpty(commission) || !isTaux(commission) || parseIntBis(commission)>=100) { showWarning("Taux de commission incorrect !");	}
		else {
			
			if (oef_modeLigne=="C") {
				oef_currentIndex = oef_aArticles.nbLignes();
			}
			
			qValiderLigne.setParam("Date_Peremption", !isEmpty(datePeremption)?prepareDateJava(datePeremption):"");

			var result = qValiderLigne.execute();

			oef_ajouterLigne("I");
			oef_aArticles.deleteTree();
			oef_initTree2();
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_annulerLigne() {
  try {
  	
  	oef_aArticles.select(-1);
		oef_ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
	}
}



function oef_supprimerLigne() {
  try {

		var qSupprimerLigne = new QueryHttp("Facturation/Affaires/supprimerArticleFacture.tmpl");
		qSupprimerLigne.setParam("Ligne_Id", oef_ligneId);
		qSupprimerLigne.setParam("Facture_Id", factureId);
		qSupprimerLigne.execute();

		oef_currentIndex--;
		oef_ajouterLigne("I");
		oef_aArticles.deleteTree();
		oef_initTree2();

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_enregistrerFacture() {
  try {

		var save = false;

		var clientId = document.getElementById('oef-clientId').value;
		var utilR = document.getElementById('oef-responsable').value;
		var regimeTVA = document.getElementById('oef-regimeTVA').value;
		var numTva = oef_assujettiTVA?document.getElementById('oef-numTVA').value:"";
		var modeReglement = document.getElementById('oef-modeReglement').value;
		var echeance = document.getElementById('oef-echeance').value;
		var commentairesFin = document.getElementById('oef-commentairesFin').value;
		var commentairesInt = document.getElementById('oef-commentairesInt').value;
		var codeTarif = document.getElementById('oef-codeTarif').value;
		var secteurActivite = document.getElementById('oef-secteur').value;
		var remise = document.getElementById('oef-remise').value;
		var tauxRemise = 0;
		var montantRemise = 0;
		var fraisPort = document.getElementById('oef-fraisPort').value;
		var remiseFP = document.getElementById('oef-remiseFP').value;
		var tauxRemiseFP = 0;
		var montantRemiseFP = 0;
		var escompte = document.getElementById('oef-escompte').value;
		
		var denominationFact = document.getElementById('oef-denominationFact').value;
		var adresse1Fact = document.getElementById('oef-adresse1Fact').value;
		var adresse2Fact = document.getElementById('oef-adresse2Fact').value;
		var adresse3Fact = document.getElementById('oef-adresse3Fact').value;
		var codePostalFact = document.getElementById('oef-codePostalFact').value;
		var villeFact = document.getElementById('oef-villeFact').value;
		var codePaysFact = document.getElementById('oef-codePaysFact').value;
		var civInterFact = document.getElementById('oef-civInterFact').value;
		var nomInterFact = document.getElementById('oef-nomInterFact').value;
		var prenomInterFact = document.getElementById('oef-prenomInterFact').value;
		var telInterFact = document.getElementById('oef-telInterFact').value;
		var faxInterFact = document.getElementById('oef-faxInterFact').value;
		var emailInterFact = document.getElementById('oef-emailInterFact').value;
		
		var denominationLiv = document.getElementById('oef-denominationLiv').value;
		var adresse1Liv = document.getElementById('oef-adresse1Liv').value;
		var adresse2Liv = document.getElementById('oef-adresse2Liv').value;
		var adresse3Liv = document.getElementById('oef-adresse3Liv').value;
		var codePostalLiv = document.getElementById('oef-codePostalLiv').value;
		var villeLiv = document.getElementById('oef-villeLiv').value;
		var codePaysLiv = document.getElementById('oef-codePaysLiv').value;
		var civInterLiv = document.getElementById('oef-civInterLiv').value;
		var nomInterLiv = document.getElementById('oef-nomInterLiv').value;
		var prenomInterLiv = document.getElementById('oef-prenomInterLiv').value;
		var telInterLiv = document.getElementById('oef-telInterLiv').value;
		var faxInterLiv = document.getElementById('oef-faxInterLiv').value;
		var emailInterLiv = document.getElementById('oef-emailInterLiv').value;
		
		var denominationEnvoi = document.getElementById('oef-denominationEnvoi').value;
		var adresse1Envoi = document.getElementById('oef-adresse1Envoi').value;
		var adresse2Envoi = document.getElementById('oef-adresse2Envoi').value;
		var adresse3Envoi = document.getElementById('oef-adresse3Envoi').value;
		var codePostalEnvoi = document.getElementById('oef-codePostalEnvoi').value;
		var villeEnvoi = document.getElementById('oef-villeEnvoi').value;
		var codePaysEnvoi = document.getElementById('oef-codePaysEnvoi').value;
		var civInterEnvoi = document.getElementById('oef-civInterEnvoi').value;
		var nomInterEnvoi = document.getElementById('oef-nomInterEnvoi').value;
		var prenomInterEnvoi = document.getElementById('oef-prenomInterEnvoi').value;
		var telInterEnvoi = document.getElementById('oef-telInterEnvoi').value;
		var faxInterEnvoi = document.getElementById('oef-faxInterEnvoi').value;
		var emailInterEnvoi = document.getElementById('oef-emailInterEnvoi').value;
		
		var modeEnvoiFacture = document.getElementById('oef-modeEnvoiFacture').value;
		
		var montantBase = (oef_editionTTC?oef_montantTTC:oef_montantHT);

		if (isEmpty(remise) || (oef_typeRemise=='P'?!isTaux(remise):!isPositiveOrNull(remise) || parseFloat(remise)>montantBase)) { showWarning("Remise incorrecte !"); }
		else if (isEmpty(fraisPort) || !isPositiveOrNull(fraisPort)) { showWarning("Frais de port incorrects !"); }
		else if (isEmpty(remiseFP) || (oef_typeRemiseFP=='P'?!isTaux(remiseFP):!isPositiveOrNull(remiseFP) || parseFloat(remiseFP)>parseFloat(fraisPort))) { showWarning("Remise sur frais de port incorrecte !"); }
		else if (!oef_bloquerEcheance && (isEmpty(echeance) || !isDate(echeance))) { showWarning("Date d'échéance incorrecte !"); }
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

			if (oef_assujettiTVA && codePaysLiv!="FR" && isEmpty(numTva) && oef_zoneUE) {
				showWarning("Attention : vous n'avez pas saisi le numéro de tva intra-communautaire !");
			}

			if (oef_typeRemise=='P') {
				tauxRemise = remise;
			}
			else {
				tauxRemise = (montantBase>0?remise/montantBase*100:0);
				montantRemise = remise;
			}
			
			if (oef_typeRemiseFP=='P') {
				tauxRemiseFP = remiseFP;
			}
			else {
				tauxRemiseFP = (fraisPort>0?remiseFP/fraisPort*100:0);
				montantRemiseFP = remiseFP;
			}
			
			var qEnregistrer = new QueryHttp("Facturation/Affaires/modifierFacture.tmpl");
			qEnregistrer.setParam("Facture_Id", factureId);
			qEnregistrer.setParam("Client_Id", clientId);
			qEnregistrer.setParam("Util_R", utilR);
			qEnregistrer.setParam("Edition_TTC", oef_editionTTC?"1":"0");
			qEnregistrer.setParam("Regime_TVA", regimeTVA);
			qEnregistrer.setParam("Assujetti_TVA", oef_assujettiTVA?"1":"0");
			qEnregistrer.setParam("Num_TVA_Intra", numTva);
			qEnregistrer.setParam("Code_Tarif", codeTarif);
			qEnregistrer.setParam("Secteur_Activite", secteurActivite);
			qEnregistrer.setParam("Mode_Reglement", modeReglement);
			qEnregistrer.setParam("Echeance", prepareDateJava(echeance));
			qEnregistrer.setParam("Commentaires_Fin", commentairesFin);
			qEnregistrer.setParam("Commentaires_Int", commentairesInt);
			qEnregistrer.setParam("Taux_Remise", tauxRemise);
			qEnregistrer.setParam("Montant_Remise", montantRemise);
			qEnregistrer.setParam("PRemise_FP", tauxRemiseFP);
			qEnregistrer.setParam("MRemise_FP", montantRemiseFP);
			qEnregistrer.setParam("Escompte", escompte);
			qEnregistrer.setParam("Frais_Port", fraisPort);
			qEnregistrer.setParam("Code_TVA_Port", oef_codeTvaPort);
			qEnregistrer.setParam("Taux_TVA_Port", oef_tauxTvaPort);
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
			qEnregistrer.setParam("Mode_Envoi_Facture", modeEnvoiFacture);
			qEnregistrer.execute();

			oef_setModifie(false);
			save = true;
		}

		return save;

	} catch (e) {
  	recup_erreur(e);
	}
}



function oef_calculTotaux() {
  try {
  	var clientId = document.getElementById('oef-clientId').value;
		var clientConnu = (clientId!="");

		if (oef_mode!='V') {
			document.getElementById('oef-editionTTC').disabled = (oef_aArticles.nbLignes()>0);
	    document.getElementById('oef-codePaysLiv').disabled = (oef_aArticles.nbLignes()>0);
	    //document.getElementById('oef-bChercherClient').collapsed = (oef_aArticles.nbLignes()>0);
	   	document.getElementById('oef-bChercherAdrLiv').disabled = (!clientConnu || oef_aArticles.nbLignes()>0);
	    document.getElementById('oef-bCopierFactVersLivEnvoi').disabled = (oef_aArticles.nbLignes()>0);
	    document.getElementById('oef-codeTarif').disabled = (oef_aArticles.nbLignes()>0);
			document.getElementById('oef-regimeTVA').disabled = (oef_aArticles.nbLignes()>0);
			document.getElementById('oef-assujettiTVA').disabled = (oef_aArticles.nbLignes()>0);
		}
		
		var remise = parseFloat(document.getElementById('oef-remise').value);
		var tauxEscompte = parseFloat(document.getElementById('oef-escompte').value);
		var fraisPort = parseFloat(document.getElementById('oef-fraisPort').value);
		var remiseFP = parseFloat(document.getElementById('oef-remiseFP').value);

		if ((oef_typeRemise=='P'?isTaux(remise):isPositiveOrNull(remise)) && (oef_typeRemiseFP=='P'?isTaux(remiseFP):isPositiveOrNull(remiseFP)) && isTaux(tauxEscompte) && isPositiveOrNull(fraisPort)) {

			if (oef_aArticles.isNotNull()) {
				
				var calculDocument = new CalculDocument();
				calculDocument.setEditionTTC(oef_editionTTC);
				if (oef_typeRemise=='P') { calculDocument.setRemiseP(remise); }
				else { calculDocument.setRemiseM(remise); }
				calculDocument.setFraisPortBruts(fraisPort);
				if (oef_typeRemiseFP=='P') { calculDocument.setRemiseFPP(remiseFP); }
				else { calculDocument.setRemiseFPM(remiseFP); }
				calculDocument.setTauxTVAFP(oef_tauxTvaPort);
				calculDocument.setEscompteP(tauxEscompte);
				calculDocument.setAcompte(oef_acompte);
				
				var nbLignes = oef_aArticles.nbLignes();
				
				for (var i=0;i<nbLignes;i++) {
					if (oef_aArticles.getCellText(i,'oef-colTypeLigne')!="C") {
						var prixUnitaireBrut  = oef_aArticles.getCellText(i,'oef-colPU');
						var ristourneP = oef_aArticles.getCellText(i,'oef-colRistourne');
						var commissionP = oef_aArticles.getCellText(i,'oef-colTauxCommission');
						var quantite  = oef_aArticles.getCellText(i,'oef-colQuantite');
						var codeTVA  = oef_aArticles.getCellText(i,'oef-colCodeTVA');
						calculDocument.ajouterLigneDocument(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA);
					}
				}
				
				calculDocument.calculer();

				if (oef_editionTTC) {
					document.getElementById('oef-pttcMontantRemise').value = calculDocument.getRemiseM();
					document.getElementById('oef-pttcMontantFraisPort').value = calculDocument.getFraisPortBruts();
					document.getElementById('oef-pttcMontantRemiseFP').value = calculDocument.getRemiseFPM();
					document.getElementById('oef-pttcTVA').value = calculDocument.getTotalTVA();
					document.getElementById('oef-pttcCommissionTTC').value = calculDocument.getCommissionTTC();
					document.getElementById('oef-pttcMontantTTC').value = calculDocument.getMontantTTC();
					document.getElementById('oef-pttcMontantEscompte').value = calculDocument.getEscompteM();
					document.getElementById('oef-pttcMontantAcompte').value = calculDocument.getAcompte();
					document.getElementById('oef-pttcTotalTTC').value = calculDocument.getTotalTTC();
					document.getElementById('oef-pttcNetTTC').value = calculDocument.getNetAPayer();
					
					oef_montantTTC = calculDocument.getMontantTTCSansFormat();
					
					document.getElementById('oef-rowCommissionTTC').collapsed = !calculDocument.afficherCommission();
					document.getElementById('oef-rowRemiseTTC').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('oef-rowRemiseFPTTC').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('oef-rowEscompteTTC').collapsed = !calculDocument.afficherEscompteM();
				}
				else {
					document.getElementById('oef-montantHT').value = calculDocument.getMontantHT();
					document.getElementById('oef-montantRemise').value = calculDocument.getRemiseM();
					document.getElementById('oef-montantFraisPort').value = calculDocument.getFraisPortBruts();
					document.getElementById('oef-montantRemiseFP').value = calculDocument.getRemiseFPM();
					document.getElementById('oef-totalHT').value = calculDocument.getTotalHT();
					document.getElementById('oef-commissionHT').value = calculDocument.getCommissionHT();
					document.getElementById('oef-TVA').value = calculDocument.getTotalTVA();
					document.getElementById('oef-montantTTC').value = calculDocument.getMontantTTC();
					document.getElementById('oef-montantEscompte').value = calculDocument.getEscompteM();
					document.getElementById('oef-montantAcompte').value = calculDocument.getAcompte();
					document.getElementById('oef-totalTTC').value = calculDocument.getTotalTTC();
					
					oef_montantHT = calculDocument.getMontantHTSansFormat();
					oef_montantTTC = calculDocument.getMontantTTCSansFormat();
					
					document.getElementById('oef-rowCommissionHT').collapsed = !calculDocument.afficherCommission();
					document.getElementById('oef-rowRemiseHT').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('oef-rowRemiseFPHT').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('oef-rowMontantTTC').collapsed = !calculDocument.afficherEscompteM();
					document.getElementById('oef-rowEscompteHT').collapsed = !calculDocument.afficherEscompteM();
				}
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}



function oef_afterRefreshArticles() {
	try {

		oef_calculTotaux();
		oef_scrollToRank();
		document.getElementById('oef-reference').focus();

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_scrollToRank() {
	try {
		
		var tb = document.getElementById("oef-articles").treeBoxObject;
		
		if (oef_currentIndex>0) {
			tb.ensureRowIsVisible(oef_currentIndex);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_demandeEnregistrement() {
  try {

		if (oef_modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à la facture ?")) {
				oef_enregistrerFacture();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_setModifie(m) {
  try {
  	oef_modifie = m;
		if (m) {
			document.getElementById('oef-tabFacture').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('oef-bApercu').disabled = true;
			document.getElementById('oef-bVisualiser').disabled = true;
			document.getElementById('oef-bEchMultiples').disabled = true;
		}
		else {
			document.getElementById('oef-tabFacture').setAttribute('image', null);
			document.getElementById('oef-bApercu').disabled = false;
			document.getElementById('oef-bVisualiser').disabled = false;
			if (oef_mode!="C") { document.getElementById('oef-bEchMultiples').disabled = false; }
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_initTree2() {
  try {
  	
  	oef_aArticles.setParam("Facture_Id", factureId);
  	oef_aArticles.initTree(oef_afterRefreshArticles);

  } catch (e) {
    recup_erreur(e);
  }
}



function oef_editerCommentaire() {
  try {
  	
		if (oef_aArticles.isSelected()) {
			var i = oef_aArticles.getCurrentIndex();
			var ligneId = oef_aArticles.getCellText(i,'oef-colLigneId');

			var url = "chrome://opensi/content/facturation/user/affaires/popup-commentaire.xul?"+ cookie() +"&Type_Doc=Facture&Ligne_Id="+ ligneId;
    	window.openDialog(url,'','chrome,modal,centerscreen');

			oef_aArticles.deleteTree();
			oef_initTree2();
			oef_ajouterLigne("I");
		}
		else {
			showWarning("Aucun article ou commentaire sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_editerPrixAchat() {
  try {
  	
		if (oef_aArticles.isSelected()) {
			var i = oef_aArticles.getCurrentIndex();
			var ligneId = oef_aArticles.getCellText(i,'oef-colLigneId');

			var url = "chrome://opensi/content/facturation/user/commun/popup-modifierPrixAchat.xul?"+ cookie() +"&Type_Doc=Facture&Ligne_Id="+ ligneId;
    	window.openDialog(url,'','chrome,modal,centerscreen',oef_retourEditerPrixAchat);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_retourEditerPrixAchat() {
	try {
		oef_aArticles.deleteTree();
		oef_initTree2();
		oef_ajouterLigne("I");
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_editerCommentairesCaches() {
  try {
  	
		var url = "chrome://opensi/content/facturation/user/affaires/popup-commentaireCache.xul?"+ cookie();
    url += "&Type_Doc=Facture&Doc_Id="+ factureId;
  	window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_chargerCoord() {
  try {
		var clientId = document.getElementById('oef-clientId').value;
		var qGetClient = new QueryHttp("Facturation/Clients/getCoord.tmpl");
		qGetClient.setParam("Client_Id", clientId);
		var result = qGetClient.execute();

		var contenu = result.responseXML.documentElement;
		
		oef_defCommission = contenu.getAttribute('Taux_Commission');

		oef_chargerResponsables(contenu.getAttribute('Util_R'));
		if (!oef_bloquerEcheance) {
			document.getElementById('oef-echeance').value = contenu.getAttribute('Echeance');
			oef_chargerModesReglements(contenu.getAttribute('Mode_Reg'));
		}
		document.getElementById('oef-remise').value = contenu.getAttribute('Remise');
		document.getElementById('oef-bRemise').setAttribute("class", "bIcoPourcentage");
		oef_typeRemise = 'P';
		document.getElementById('oef-codeTarif').value = contenu.getAttribute('Code_Tarif');
		document.getElementById('oef-secteur').value = contenu.getAttribute('Secteur_Activite');
		
		oef_assujettiTVA = (contenu.getAttribute('Assujetti_TVA')=="1");
		document.getElementById('oef-assujettiTVA').checked=oef_assujettiTVA;
		document.getElementById('oef-numTVA').disabled=!oef_assujettiTVA;
		document.getElementById('oef-numTVA').value=contenu.getAttribute('Num_TVA_Intra');

		document.getElementById('oef-denominationFact').value = contenu.getAttribute('Denomination_Fact');
		document.getElementById('oef-adresse1Fact').value = contenu.getAttribute('Adresse_1_Fact');		
		document.getElementById('oef-adresse2Fact').value = contenu.getAttribute('Adresse_2_Fact');
		document.getElementById('oef-adresse3Fact').value = contenu.getAttribute('Adresse_3_Fact');
		document.getElementById('oef-codePostalFact').value = contenu.getAttribute('Code_Postal_Fact');
		document.getElementById('oef-villeFact').value = contenu.getAttribute('Ville_Fact');
    document.getElementById('oef-codePaysFact').value = contenu.getAttribute('Code_Pays_Fact');
		document.getElementById('oef-civInterFact').value = contenu.getAttribute('Civ_Inter_Fact');
		document.getElementById('oef-nomInterFact').value = contenu.getAttribute('Nom_Inter_Fact');
		document.getElementById('oef-prenomInterFact').value = contenu.getAttribute('Prenom_Inter_Fact');
		document.getElementById('oef-telInterFact').value = contenu.getAttribute('Tel_Inter_Fact');
		document.getElementById('oef-faxInterFact').value = contenu.getAttribute('Fax_Inter_Fact');
		document.getElementById('oef-emailInterFact').value = contenu.getAttribute('Email_Inter_Fact');
		
		document.getElementById('oef-denominationLiv').value = contenu.getAttribute('Denomination_Liv');
		document.getElementById('oef-adresse1Liv').value = contenu.getAttribute('Adresse_1_Liv');
		document.getElementById('oef-adresse2Liv').value = contenu.getAttribute('Adresse_2_Liv');
		document.getElementById('oef-adresse3Liv').value = contenu.getAttribute('Adresse_3_Liv');
		document.getElementById('oef-codePostalLiv').value = contenu.getAttribute('Code_Postal_Liv');		
		document.getElementById('oef-villeLiv').value = contenu.getAttribute('Ville_Liv');
    document.getElementById('oef-codePaysLiv').value = contenu.getAttribute('Code_Pays_Liv');
    oef_calculerTvaPort();
    oef_selectPaysLiv();
    
    document.getElementById('oef-civInterLiv').value = contenu.getAttribute('Civ_Inter_Liv');
		document.getElementById('oef-nomInterLiv').value = contenu.getAttribute('Nom_Inter_Liv');
		document.getElementById('oef-prenomInterLiv').value = contenu.getAttribute('Prenom_Inter_Liv');
		document.getElementById('oef-telInterLiv').value = contenu.getAttribute('Tel_Inter_Liv');
		document.getElementById('oef-faxInterLiv').value = contenu.getAttribute('Fax_Inter_Liv');
		document.getElementById('oef-emailInterLiv').value = contenu.getAttribute('Email_Inter_Liv');
		
		document.getElementById('oef-denominationEnvoi').value = contenu.getAttribute('Denomination_Envoi');
		document.getElementById('oef-adresse1Envoi').value = contenu.getAttribute('Adresse_1_Envoi');
		document.getElementById('oef-adresse2Envoi').value = contenu.getAttribute('Adresse_2_Envoi');
		document.getElementById('oef-adresse3Envoi').value = contenu.getAttribute('Adresse_3_Envoi');
		document.getElementById('oef-codePostalEnvoi').value = contenu.getAttribute('Code_Postal_Envoi');		
		document.getElementById('oef-villeEnvoi').value = contenu.getAttribute('Ville_Envoi');
    document.getElementById('oef-codePaysEnvoi').value = contenu.getAttribute('Code_Pays_Envoi');
    
    document.getElementById('oef-civInterEnvoi').value = contenu.getAttribute('Civ_Inter_Envoi');
		document.getElementById('oef-nomInterEnvoi').value = contenu.getAttribute('Nom_Inter_Envoi');
		document.getElementById('oef-prenomInterEnvoi').value = contenu.getAttribute('Prenom_Inter_Envoi');
		document.getElementById('oef-telInterEnvoi').value = contenu.getAttribute('Tel_Inter_Envoi');
		document.getElementById('oef-faxInterEnvoi').value = contenu.getAttribute('Fax_Inter_Envoi');
		document.getElementById('oef-emailInterEnvoi').value = contenu.getAttribute('Email_Inter_Envoi');
    
    document.getElementById('oef-modeEnvoiFacture').value = contenu.getAttribute('Mode_Envoi_Facture');
		
		document.getElementById('oef-labelClient').setAttribute("value", clientId);
		
   	document.getElementById('oef-bChercherAdrLiv').disabled = (oef_aArticles.nbLignes()>0);
    document.getElementById('oef-bCopierFactVersLivEnvoi').disabled = (oef_aArticles.nbLignes()>0);
    document.getElementById('oef-codeTarif').disabled = (oef_aArticles.nbLignes()>0);
		document.getElementById('oef-bChercherAdrFact').disabled = false;
		document.getElementById('oef-bChercherInter').disabled = false;
		document.getElementById('oef-bChercherInterLiv').disabled = false;
		document.getElementById('oef-bChercherAdrEnvoi').disabled = false;
		document.getElementById('oef-bChercherInterEnvoi').disabled = false;
		
		oef_ajouterLigne("I");
		oef_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_rechercherClient() {
  try {

		var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=true&Client_Express=true&Bloque=true";
    window.openDialog(url,'','chrome,modal,centerscreen',oef_retourRechercherClient);
    var clientId = document.getElementById('oef-clientId').value;

		if (clientId != "") {
			oef_setModifie(true);
			oef_chargerCoord();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('oef-clientId').value = codeClient;
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_evaluer(elem, ev) {
	try {

		if (ev.keyCode==13) {
			var nf4 = new NumberFormat("0.00##", false);
			elem.value = nf4.format(calcExpr(elem.value));
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function oef_changerTypeEdition(chgType) {
	try {

		oef_editionTTC = chgType;
		
		if (oef_editionTTC) {
			document.getElementById('oef-colTotal').setAttribute("label", "Total TTC");
			document.getElementById('oef-colPU').setAttribute("label", "P.U TTC");
			document.getElementById('oef-lblFraisPort').value = "Frais de port (ttc) :";
			document.getElementById('oef-lblPU').value = "P.U TTC :";
			document.getElementById('oef-piedTTC').collapsed = false;
			document.getElementById('oef-piedHT').collapsed = true;
		}
		else {
			document.getElementById('oef-colTotal').setAttribute("label", "Total HT");
			document.getElementById('oef-colPU').setAttribute("label", "P.U HT");
			document.getElementById('oef-lblFraisPort').value = "Frais de port (ht) :";
			document.getElementById('oef-lblPU').value = "P.U HT :";
			document.getElementById('oef-piedTTC').collapsed = true;
			document.getElementById('oef-piedHT').collapsed = false;			
		}
		
		oef_calculTotaux();

	}	catch(e) {
		recup_erreur(e);
	}
}


function oef_changerAssujettiTVA(etat) {
	try {

		oef_assujettiTVA = etat;
		document.getElementById('oef-numTVA').disabled=!oef_assujettiTVA;
		oef_listeTVA();
		oef_setModifie(true);

	}	catch(e) {
		recup_erreur(e);
	}
}


function oef_changerTypeVente() {
	try {
	  var qTypeVente = new QueryHttp("GetPays.tmpl");
	  qTypeVente.setParam("Code_Pays", document.getElementById('oef-codePaysLiv').value);
	  var result = qTypeVente.execute();
	  oef_zoneUE = (result.responseXML.documentElement.getAttribute("zone_ue")=="1");
	}	catch(e) {
		recup_erreur(e);
	}
}


function oef_rechercherAdrFact() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oef-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oef_reporterAdrFact);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_reporterAdrFact(nom, adr1, adr2, adr3, cp, ville, pays, codePays, contactFact, contactLiv, contactEnvoi) {
  try {

		document.getElementById('oef-denominationFact').value = nom;
		document.getElementById('oef-adresse1Fact').value = adr1;		
		document.getElementById('oef-adresse2Fact').value = adr2;
		document.getElementById('oef-adresse3Fact').value = adr3;
		document.getElementById('oef-codePostalFact').value = cp;
		document.getElementById('oef-villeFact').value = ville;
	  document.getElementById('oef-codePaysFact').value = codePays;
	  
	  if (!isEmpty(contactFact)) {
	  	var qInterFact = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterFact.setParam("Num_Inter", contactFact);
	  	var result = qInterFact.execute();
	  	var content = result.responseXML.documentElement;
	  	oef_reporterInterFact(content.getAttribute("Civilite"), content.getAttribute("Civ_Courte"), content.getAttribute("Nom"), content.getAttribute("Prenom"), content.getAttribute("Tel"), content.getAttribute("Fax"), content.getAttribute("Email"));
	  }
		oef_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_rechercherInterlocuteurFact() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oef-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oef_reporterInterFact);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_reporterInterFact(civ, civCourte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oef-civInterFact').value = civ;
		document.getElementById('oef-nomInterFact').value = nom;		
		document.getElementById('oef-prenomInterFact').value = prenom;
		document.getElementById('oef-telInterFact').value = tel;
		document.getElementById('oef-faxInterFact').value = fax;
		document.getElementById('oef-emailInterFact').value = email;
		
		oef_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_rechercherAdrEnvoi() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oef-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oef_reporterAdrEnvoi);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_reporterAdrEnvoi(nom, adr1, adr2, adr3, cp, ville, pays, codePays, contactFact, contactLiv, contactEnvoi) {
  try {

		document.getElementById('oef-denominationEnvoi').value = nom;
		document.getElementById('oef-adresse1Envoi').value = adr1;		
		document.getElementById('oef-adresse2Envoi').value = adr2;
		document.getElementById('oef-adresse3Envoi').value = adr3;
		document.getElementById('oef-codePostalEnvoi').value = cp;
		document.getElementById('oef-villeEnvoi').value = ville;
	  document.getElementById('oef-codePaysEnvoi').value = codePays;
	  
	  if (!isEmpty(contactEnvoi)) {
	  	var qInterEnvoi = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterEnvoi.setParam("Num_Inter", contactEnvoi);
	  	var result = qInterEnvoi.execute();
	  	var content = result.responseXML.documentElement;
	  	oef_reporterInterEnvoi(content.getAttribute("Civilite"), content.getAttribute("Civ_Courte"), content.getAttribute("Nom"), content.getAttribute("Prenom"), content.getAttribute("Tel"), content.getAttribute("Fax"), content.getAttribute("Email"));
	  }
	  
		oef_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_copierFactVersLivEnvoi() {
	try {
		document.getElementById('oef-denominationLiv').value = document.getElementById('oef-denominationFact').value;
		document.getElementById('oef-adresse1Liv').value = document.getElementById('oef-adresse1Fact').value;		
		document.getElementById('oef-adresse2Liv').value = document.getElementById('oef-adresse2Fact').value;
		document.getElementById('oef-adresse3Liv').value = document.getElementById('oef-adresse3Fact').value;
		document.getElementById('oef-codePostalLiv').value = document.getElementById('oef-codePostalFact').value;
		document.getElementById('oef-villeLiv').value = document.getElementById('oef-villeFact').value;
	  document.getElementById('oef-codePaysLiv').value = document.getElementById('oef-codePaysFact').value;
	  oef_calculerTvaPort();
	  oef_selectPaysLiv();
	  document.getElementById('oef-civInterLiv').value = document.getElementById('oef-civInterFact').value;
		document.getElementById('oef-nomInterLiv').value = document.getElementById('oef-nomInterFact').value;		
		document.getElementById('oef-prenomInterLiv').value = document.getElementById('oef-prenomInterFact').value;
		document.getElementById('oef-telInterLiv').value = document.getElementById('oef-telInterFact').value;
		document.getElementById('oef-faxInterLiv').value = document.getElementById('oef-faxInterFact').value;
		document.getElementById('oef-emailInterLiv').value = document.getElementById('oef-emailInterFact').value;
		
		document.getElementById('oef-denominationEnvoi').value = document.getElementById('oef-denominationFact').value;
		document.getElementById('oef-adresse1Envoi').value = document.getElementById('oef-adresse1Fact').value;		
		document.getElementById('oef-adresse2Envoi').value = document.getElementById('oef-adresse2Fact').value;
		document.getElementById('oef-adresse3Envoi').value = document.getElementById('oef-adresse3Fact').value;
		document.getElementById('oef-codePostalEnvoi').value = document.getElementById('oef-codePostalFact').value;
		document.getElementById('oef-villeEnvoi').value = document.getElementById('oef-villeFact').value;
	  document.getElementById('oef-codePaysEnvoi').value = document.getElementById('oef-codePaysFact').value;
	  
	  document.getElementById('oef-civInterEnvoi').value = document.getElementById('oef-civInterFact').value;
		document.getElementById('oef-nomInterEnvoi').value = document.getElementById('oef-nomInterFact').value;		
		document.getElementById('oef-prenomInterEnvoi').value = document.getElementById('oef-prenomInterFact').value;
		document.getElementById('oef-telInterEnvoi').value = document.getElementById('oef-telInterFact').value;
		document.getElementById('oef-faxInterEnvoi').value = document.getElementById('oef-faxInterFact').value;
		document.getElementById('oef-emailInterEnvoi').value = document.getElementById('oef-emailInterFact').value;
	  
	  oef_setModifie(true);
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_rechercherAdrLiv() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oef-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oef_reporterAdrLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_reporterAdrLiv(nom, adr1, adr2, adr3, cp, ville, pays, codePays, contactFact, contactLiv, contactEnvoi) {
  try {

		document.getElementById('oef-denominationLiv').value = nom;
		document.getElementById('oef-adresse1Liv').value = adr1;		
		document.getElementById('oef-adresse2Liv').value = adr2;
		document.getElementById('oef-adresse3Liv').value = adr3;
		document.getElementById('oef-codePostalLiv').value = cp;
		document.getElementById('oef-villeLiv').value = ville;
	  document.getElementById('oef-codePaysLiv').value = codePays;
	  oef_calculerTvaPort();
	  oef_selectPaysLiv();
	  
		if (!isEmpty(contactLiv)) {
	  	var qInterLiv = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterLiv.setParam("Num_Inter", contactLiv);
	  	var result = qInterLiv.execute();
	  	var content = result.responseXML.documentElement;
	  	oef_reporterInterLiv(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
	  oef_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_rechercherInterlocuteurLiv() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oef-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oef_reporterInterLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_reporterInterLiv(civ, civCourte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oef-civInterLiv').value = civ;
		document.getElementById('oef-nomInterLiv').value = nom;		
		document.getElementById('oef-prenomInterLiv').value = prenom;
		document.getElementById('oef-telInterLiv').value = tel;
		document.getElementById('oef-faxInterLiv').value = fax;
		document.getElementById('oef-emailInterLiv').value = email;
		
		oef_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_rechercherInterlocuteurEnvoi() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('oef-clientId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oef_reporterInterEnvoi);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_reporterInterEnvoi(civ, civCourte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oef-civInterEnvoi').value = civ;
		document.getElementById('oef-nomInterEnvoi').value = nom;		
		document.getElementById('oef-prenomInterEnvoi').value = prenom;
		document.getElementById('oef-telInterEnvoi').value = tel;
		document.getElementById('oef-faxInterEnvoi').value = fax;
		document.getElementById('oef-emailInterEnvoi').value = email;
		
		oef_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_choisirMentions() {
  try {
  	
		var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Facture&Doc_Id="+ factureId;
  	window.openDialog(url,'','chrome,modal,centerscreen',oef_setModifie);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_apercuFacture() {
  try {
  	
		if (oef_aArticles.nbLignes()==0) {
			showWarning("La facture ne contient aucune ligne !");
		}
		else {
			oef_apercu = true;
			
			document.getElementById('oef-pdfFacture').setAttribute('src', null);
			document.getElementById('oef-boxMail').collapsed=true;
			document.getElementById('oef-deckFacture').selectedIndex = 1;
			document.getElementById('bRetourFacture').collapsed = false;

			var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
			qLangueDefaut.setParam("Type_Doc", "Facture");
			qLangueDefaut.setParam("Doc_Id", factureId);
			var result = qLangueDefaut.execute();
			oef_langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
			oef_aLangues.setParam("Selection", oef_langueDefaut);
			oef_aLangues.initTree(oef_initLangue);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_editerFacture() {
	try {
		
		var ok = true;
  	if (oef_mode=="M") {
  		ok = false;
  		if (oef_aArticles.nbLignes()==0) { showWarning("La facture ne contient aucune ligne !"); }
  		else {
	  		var codeErreur = "0";
	    	var qVerifierEcheances = new QueryHttp("Facturation/Factu_Directe/checkEcheances.tmpl");
	    	qVerifierEcheances.setParam("Facture_Id", factureId);
	    	var result = qVerifierEcheances.execute();
	    	codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
	    	if (codeErreur=="1") { showWarning("Les dates d'échéances doivent être supérieures ou égales à la date de la facture !"); }
				else if (codeErreur=="2") { showWarning("Veuillez remplir les modes de règlements des échéances !"); }
				else if (codeErreur=="3") { showWarning("Le total des échéances doit être égal au net à payer !"); }
				else {
					ok = window.confirm("Confirmez-vous la génération de la facture ?\n(Attention la facture générée ne pourra plus être modifiée !)");
				}
  		}
  	}
  	
		if (ok) {
			
			oef_apercu = false;
			
			document.getElementById('oef-pdfFacture').setAttribute('src', null);
			document.getElementById('oef-boxMail').collapsed=false;
			document.getElementById('oef-deckFacture').selectedIndex = 1;
			document.getElementById('bRetourFacture').collapsed = false;
			
			var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
			qLangueDefaut.setParam("Type_Doc", "Facture");
			qLangueDefaut.setParam("Doc_Id", factureId);
			var result = qLangueDefaut.execute();
			oef_langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
			oef_aLangues.setParam("Selection", oef_langueDefaut);
			oef_aLangues.initTree(oef_initLangue);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_initLangue() {
	try {
		document.getElementById('oef-langueDefaut').value = oef_langueDefaut;
		oef_visualiserFacture();
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_visualiserFacture() {
  try {
  	
  	var langue = document.getElementById('oef-langueDefaut').value;
  	var qGenPdf = new QueryHttp("Facturation/Affaires/pdfFacture.tmpl");
		qGenPdf.setParam("Facture_Id", factureId);
		qGenPdf.setParam("Langue", langue);
		if (oef_apercu) { qGenPdf.setParam("Apercu", true); }
		var result = qGenPdf.execute();
		if (result.responseXML.documentElement.getAttribute('Existe_Edition')=="true") {
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('FichierPDF');
			document.getElementById('oef-pdfFacture').setAttribute("src", page);
		}
		
	} catch (e) {
    recup_erreur(e);
  }
}


function oef_envoyerMail() {
	try {
		var langue = document.getElementById('oef-langueDefaut').value;
		
		var url = "chrome://opensi/content/facturation/user/affaires/popup-envoyerMail.xul?"+ cookie();
		url += "&Type_Doc=Facture&Doc_Id=" + factureId +"&Langue="+ langue;

		window.openDialog(url,'','chrome,modal,centerscreen');
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_supprimerFacture() {
  try {

		if (window.confirm("Confirmez-vous la suppression de la facture ?")) {
			var qSupprimerFact = new QueryHttp("Facturation/Affaires/supprimerFacture.tmpl");
			qSupprimerFact.setParam("Facture_Id", factureId);
			var result = qSupprimerFact.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				showMessage("La facture a été supprimée !");
				retourFicheAffaire();
			} else {
				// Sécurité : ne peut théoriquement jamais se produire
				showMessage("Impossible de supprimer une facture validée !");
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_transformerAvoir() {
	try {
		if (window.confirm("Voulez-vous créer un avoir à partir de cette facture ?")) {
			var qVerif = new QueryHttp("Facturation/Affaires/verifierAvoirPossible.tmpl");
			qVerif.setParam("Affaire_Id", affaireId);
			var result = qVerif.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				var qTransFact = new QueryHttp("Facturation/Affaires/transformerFactureEnAvoir.tmpl");
				qTransFact.setParam("Facture_Id", factureId);
				var result = qTransFact.execute();
				avoirId = result.responseXML.documentElement.getAttribute("Avoir_Id");
				oea_chargerAvoir();
				document.getElementById('deck').selectedIndex=6;
			} else {
				showWarning("Impossible de créer un avoir tant que les avoirs précédents ne sont pas validés !");
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_pressOnEcheancesMultiples() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-echeancesMultiples.xul?"+ cookie() +"&Facture_Id="+ factureId +"&Modifiable="+ (oef_mode=="V"?0:1);
    window.openDialog(url,'','chrome,modal,centerscreen',oef_refreshEcheance1);
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_refreshEcheance1() {
	try {
		var qGetEcheance = new QueryHttp("Facturation/Factu_Directe/getPremiereEcheance.tmpl");
		qGetEcheance.setParam("Facture_Id", factureId);
		var result = qGetEcheance.execute();
		var contenu = result.responseXML.documentElement;
		document.getElementById('oef-echeance').value = contenu.getAttribute('Echeance');
		oef_chargerModesReglements(contenu.getAttribute('Mode_Reg'));
		var echModifiable = (contenu.getAttribute('Ech_Modifiable')=="1");
  	document.getElementById('oef-echeance').disabled = !echModifiable;
		document.getElementById('oef-modeReglement').disabled = !echModifiable;
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_initVersion() {
	try {
		
		oef_aVersion.setParam("Type_Document", "Facture");
		oef_aVersion.setParam("Document_Id", factureId);
		oef_aVersion.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}


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
var oef_mode;
var oef_tauxTvaPort;
var oef_codeTvaPort;
var oef_chargerModeReg;
var oef_chargerResponsable;
var oef_modifie = false;
var oef_currentIndex = 0;
var oef_typeRemise = 'P';
var oef_typeRemiseFP = 'P';
var oef_montantHT = 0;
var oef_bloquerEcheance = false;
var oef_typeLigne;
var oef_tarifId;
var oef_ligneId;
var oef_libelle;
var oef_acompte;
var oef_typeDocPdf = "FF";

var oef_aLignes = new Arbre("Facturation/GetRDF/articles_facture_fournisseur.tmpl","oef-articles");
var oef_aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'oef-modeReglement');
var oef_aResponsables = new Arbre("ComboListe/combo-responsables.tmpl","oef-responsable");
var oef_aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "oef-secteur");
var oef_aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","oef-listeVersion");
var oef_aAcomptes = new Arbre("Facturation/Factu_Fournisseur/liste-acomptes.tmpl","oef-listeAcomptes");

function oef_init() {
  try {
  	
  	var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();

		var produitFrais = (parseInt(result.responseXML.documentElement.getAttribute('Produit_Frais'))==1);
		if (!produitFrais) {
			document.getElementById('oef-colNumLot').collapsed = true;
			document.getElementById('oef-colNbPieces').collapsed = true;
			document.getElementById('oef-colUnite').collapsed = true;
			document.getElementById('oef-colDatePeremption').collapsed = true;
			document.getElementById('oef-produitFrais1').collapsed = true;
			document.getElementById('oef-produitFrais2').collapsed = true;
			document.getElementById('oef-produitFrais3').collapsed = true;
			document.getElementById('oef-produitFrais4').collapsed = true;
		}

		//liste des unités de l'article
		var aUnite = new Arbre("Facturation/GetRDF/unites_vente.tmpl", "oef-unite");
		aUnite.initTree(oef_initUnite);

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
    var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "oef-codePays");
		aPays.initTree(oef_initPays);

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_initPays() {
	try {

    document.getElementById('oef-codePays').value = "FR";
    oef_calculerTvaPort();
    oef_selectPays();

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_selectPays() {
	try {
		oef_listeTVA();
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_calculerTvaPort() {
	try {
		var codePays = document.getElementById('oef-codePays').value;
		oef_codeTvaPort = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
		oef_tauxTvaPort = getTva(oef_codeTvaPort);
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_listeTVA() {
  try {
  	oef_calculTotaux();
    var aCode = new Arbre("Facturation/GetRDF/taux_tva_fournisseur.tmpl", "oef-codeTVA");
    aCode.setParam("Code_Pays", document.getElementById("oef-codePays").value);
    aCode.initTree(oef_selectTVA);

  } catch (e) {
    recup_erreur(e);
  }
}


function oef_selectTVA() {
  try {
	var codePays = document.getElementById('oef-codePays').value;
	document.getElementById('oef-codeTVA').value = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
	
	if (premierChargementFact) {
		premierChargementFact = false;
		chargerFacture();
	}
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


function oef_reinitialiser() {
	try {
		
		acompteId = "";
		oef_modeLigne = "C";
		oef_currentIndex = 0;
		oef_typeRemise = "P";
		oef_typeRemiseFP = "P";
		oef_chargerModeReg = "0";
		oef_chargerResponsable = "0";
		oef_montantHT = 0;
		oef_bloquerEcheance = false;
		
		document.getElementById('oef-tabBoxFacture').selectedIndex = 0;
		document.getElementById('oef-deckFacture').selectedIndex = 0;
		document.getElementById('oef-boxMail').collapsed=false;
		document.getElementById('oef-tabFacture').setAttribute('image', null);
		document.getElementById('oef-tabAcomptes').collapsed=true;
		document.getElementById('oef-tabAcomptes').disabled=true;
		document.getElementById('oef-bReediterAcompte').disabled=true;
		document.getElementById('oef-bAffecterAcomptes').collapsed=true;
		document.getElementById('oef-bAffecterAcomptes').disabled=true;

		document.getElementById('oef-numFacture').value = "";
		document.getElementById('oef-dateFacture').value = "";
		document.getElementById('oef-secteur').selectedIndex = 0;
		
		oef_aAcomptes.deleteTree();
		oef_aVersion.deleteTree();
		
		document.getElementById('oef-fournisseurId').value = "";
		document.getElementById('oef-labelFournisseur').value = "";
		
		oef_aResponsables.deleteTree();

		document.getElementById('oef-denomination').value = "";
		document.getElementById('oef-adresse1').value = "";
		document.getElementById('oef-adresse2').value = "";
		document.getElementById('oef-adresse3').value = "";
		document.getElementById('oef-codePostal').value = "";
		document.getElementById('oef-ville').value = "";
		document.getElementById('oef-codePays').value = "FR";
		document.getElementById('oef-civInter').selectedIndex = 0;
		document.getElementById('oef-nomInter').value = "";
		document.getElementById('oef-prenomInter').value = "";
		document.getElementById('oef-telInter').value = "";
		document.getElementById('oef-faxInter').value = "";
		document.getElementById('oef-emailInter').value = "";
		
		document.getElementById('oef-reference').value = "";
		document.getElementById('oef-designation').value = "";
		document.getElementById('oef-numLot').value = "";
		document.getElementById('oef-nbPieces').value = "";
		document.getElementById('oef-quantite').value = "";
		document.getElementById('oef-unite').value = "U";
		document.getElementById('oef-datePeremption').value = "";
		document.getElementById('oef-PU').value = "";
		document.getElementById('oef-ristourne').value = "";
		
		document.getElementById('oef-commentairesFin').value = "";
		document.getElementById('oef-commentairesInt').value = "";
		document.getElementById('oef-echeance').value = "";
		document.getElementById('oef-modeReglement').value = "0";
		document.getElementById('oef-bRemise').setAttribute('class', 'bIcoPourcentage');
		document.getElementById('oef-remise').value = "0.00";
		document.getElementById('oef-fraisPort').value = "0.00";
		document.getElementById('oef-bRemiseFP').setAttribute('class', 'bIcoPourcentage');
		document.getElementById('oef-remiseFP').value = "0.00";
		document.getElementById('oef-escompte').value = "0.00";
		oef_acompte = 0;
		
		document.getElementById('oef-montantHT').value = "0.00";
		document.getElementById('oef-montantRemise').value = "0.00";
		document.getElementById('oef-montantFraisPort').value = "0.00";
		document.getElementById('oef-montantRemiseFP').value = "0.00";
		document.getElementById('oef-totalHT').value = "0.00";
		document.getElementById('oef-TVA').value = "0.00";
		document.getElementById('oef-montantTTC').value = "0.00";
		document.getElementById('oef-montantEscompte').value = "0.00";
		document.getElementById('oef-totalTTC').value = "0.00";
		document.getElementById('oef-montantAcompte').value = "0.00";
		
		document.getElementById('oef-rowRemiseHT').collapsed = true;
		document.getElementById('oef-rowRemiseFPHT').collapsed = true;
		document.getElementById('oef-rowMontantTTC').collapsed = true;
		document.getElementById('oef-rowEscompteHT').collapsed = true;
		
		document.getElementById('oef-creation').setAttribute("label", "");
		document.getElementById('oef-modification').setAttribute("label", "");
		document.getElementById('oef-fiche').setAttribute("label", "");
		
		oef_typeLigne = "";
		oef_tarifId = "";
		oef_ligneId = "";
		oef_libelle = "";
		oef_modifie = false;
		
		document.getElementById('oef-numFacture').disabled = true;
		document.getElementById('oef-dateFacture').disabled = true;
		document.getElementById('oef-secteur').disabled = true;
		document.getElementById('oef-responsable').disabled = true;
		document.getElementById('oef-bReception').disabled = true;
		
		document.getElementById('oef-denomination').disabled = true;
		document.getElementById('oef-adresse1').disabled = true;
		document.getElementById('oef-adresse2').disabled = true;
		document.getElementById('oef-adresse3').disabled = true;
		document.getElementById('oef-codePostal').disabled = true;
		document.getElementById('oef-ville').disabled = true;
		document.getElementById('oef-codePays').disabled = true;
		document.getElementById('oef-civInter').disabled = true;
		document.getElementById('oef-nomInter').disabled = true;
		document.getElementById('oef-prenomInter').disabled = true;
		document.getElementById('oef-telInter').disabled = true;
		document.getElementById('oef-faxInter').disabled = true;
		document.getElementById('oef-emailInter').disabled = true;
		document.getElementById('oef-bRechFournisseur').collapsed = true;
		document.getElementById('oef-bChercherAdr').disabled = true;
		document.getElementById('oef-bChercherInter').disabled = true;
		
		document.getElementById('oef-bFlecheHaut').disabled = true;
		document.getElementById('oef-bFlecheBas').disabled = true;
		
		document.getElementById('oef-reference').disabled = true;
		document.getElementById('oef-designation').disabled = true;
		document.getElementById('oef-numLot').disabled = true;
		document.getElementById('oef-nbPieces').disabled = true;
		document.getElementById('oef-quantite').disabled = true;
		document.getElementById('oef-unite').disabled = true;
		document.getElementById('oef-datePeremption').disabled = true;
		document.getElementById('oef-PU').disabled = true;
		document.getElementById('oef-ristourne').disabled = true;
		document.getElementById('oef-codeTVA').disabled = true;
		
		document.getElementById('oef-bArticle').disabled = true;
		document.getElementById('oef-bCommentaire').disabled = true;
		document.getElementById('oef-bAnnuler').disabled = true;
		document.getElementById('oef-bValider').disabled = true;
		document.getElementById('oef-bSupprimer').disabled = true;
		oef_aLignes.deleteTree();
		
		document.getElementById('oef-commentairesFin').disabled = true;
		document.getElementById('oef-commentairesInt').disabled = true;
		document.getElementById('oef-bOuvrirCommentairesCaches').disabled = true;
		document.getElementById('oef-bChoisirMentions').disabled = true;
		document.getElementById('oef-echeance').disabled = true;
		document.getElementById('oef-modeReglement').disabled = true;
		document.getElementById('oef-bEchMultiples').disabled = true;
		document.getElementById('oef-bRemise').disabled = true;
		document.getElementById('oef-remise').disabled = true;
		document.getElementById('oef-fraisPort').disabled = true;
		document.getElementById('oef-bRemiseFP').disabled = true;
		document.getElementById('oef-remiseFP').disabled = true;
		document.getElementById('oef-escompte').disabled = true;
		document.getElementById('oef-bEnregistrer').disabled = true;
		document.getElementById('oef-bSupFacture').disabled = true;
		document.getElementById('oef-bVisualiser').disabled = true;
		document.getElementById('oef-pdfFacture').setAttribute('src', null);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_debloquerChamps() {
	try {
		document.getElementById('oef-numFacture').disabled = false;
		document.getElementById('oef-dateFacture').disabled = false;
		document.getElementById('oef-secteur').disabled = false;
		document.getElementById('oef-responsable').disabled = false;
		
		document.getElementById('oef-denomination').disabled = false;
		document.getElementById('oef-adresse1').disabled = false;
		document.getElementById('oef-adresse2').disabled = false;
		document.getElementById('oef-adresse3').disabled = false;
		document.getElementById('oef-codePostal').disabled = false;
		document.getElementById('oef-ville').disabled = false;
		document.getElementById('oef-codePays').disabled = false;
		document.getElementById('oef-civInter').disabled = false;
		document.getElementById('oef-nomInter').disabled = false;
		document.getElementById('oef-prenomInter').disabled = false;
		document.getElementById('oef-telInter').disabled = false;
		document.getElementById('oef-faxInter').disabled = false;
		document.getElementById('oef-emailInter').disabled = false;
		
		oef_ajouterLigne("I");
		document.getElementById('oef-bArticle').disabled = false;
		
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
		
		if (oef_mode=='C') {
			document.getElementById('oef-bRechFournisseur').collapsed = false;
			document.getElementById('oef-echeance').disabled = false;
  		document.getElementById('oef-modeReglement').disabled = false;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_chargerFacture() {
	try {
		oef_mode = "M";
		oef_reinitialiser();
		
		oef_aLignes.setParam("Facture_Id",factureId);
		oef_aLignes.initTree(oef_chargerFacture2);
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_chargerFacture2() {
  try {

		var qChargerFacture = new QueryHttp("Facturation/Factu_Fournisseur/getFacture.tmpl");
		qChargerFacture.setParam("Facture_Id", factureId);
		var result = qChargerFacture.execute();
		var contenu = result.responseXML.documentElement;
		
		var numFacture = contenu.getAttribute('Numero');
		if (contenu.getAttribute('Statut')=="V" && !isEmpty(numFacture)) { oef_mode = "V"; }

    document.getElementById('oef-escompte').value = contenu.getAttribute('Escompte');
    oef_acompte = contenu.getAttribute('Acompte');
    document.getElementById('oef-fraisPort').value = contenu.getAttribute('Frais_Port');
    document.getElementById('oef-commentairesFin').value = contenu.getAttribute('Commentaires_Fin');
    document.getElementById('oef-commentairesInt').value = contenu.getAttribute('Commentaires_Int');
    document.getElementById('oef-dateFacture').value = contenu.getAttribute('Date_Facture');
    document.getElementById('oef-numFacture').value = numFacture;
    document.getElementById('oef-secteur').value = contenu.getAttribute('Secteur_Activite');
    document.getElementById('oef-echeance').value = contenu.getAttribute('Echeance');
    oef_chargerModesReglements(contenu.getAttribute('Mode_Reg'));
    
    document.getElementById('oef-remise').value = contenu.getAttribute('Remise');
		oef_typeRemise = contenu.getAttribute('TypeRemise');
		document.getElementById('oef-bRemise').setAttribute("class", (oef_typeRemise=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('oef-remiseFP').value = contenu.getAttribute('Remise_FP');
		oef_typeRemiseFP = contenu.getAttribute('TypeRemise_FP');
		document.getElementById('oef-bRemiseFP').setAttribute("class", (oef_typeRemiseFP=='P'?"bIcoPourcentage":"bIcoEuro"));
		
    document.getElementById('oef-denomination').value = contenu.getAttribute('Denomination');
    document.getElementById('oef-adresse1').value = contenu.getAttribute('Adresse_Fact');
    document.getElementById('oef-adresse2').value = contenu.getAttribute('Comp_Adresse_Fact');
		document.getElementById('oef-adresse3').value = contenu.getAttribute('Adresse_3_Fact');
    document.getElementById('oef-codePostal').value = contenu.getAttribute('CP_Fact');
    document.getElementById('oef-ville').value = contenu.getAttribute('Ville_Fact');
    document.getElementById('oef-codePays').value = contenu.getAttribute('Code_Pays_Fact');
    oef_selectPays();
    document.getElementById('oef-civInter').value = contenu.getAttribute('Civ_Inter');
    document.getElementById('oef-nomInter').value = contenu.getAttribute('Nom_Inter');
    document.getElementById('oef-prenomInter').value = contenu.getAttribute('Prenom_Inter');
    document.getElementById('oef-telInter').value = contenu.getAttribute('Tel_Inter');
    document.getElementById('oef-faxInter').value = contenu.getAttribute('Fax_Inter');
    document.getElementById('oef-emailInter').value = contenu.getAttribute('Email_Inter');
    oef_chargerResponsables(contenu.getAttribute('Util_R'));
    oef_codeTvaPort = contenu.getAttribute('Code_TVA_Port');
    oef_tauxTvaPort = contenu.getAttribute('Taux_TVA_Port');

    var fournisseurId = contenu.getAttribute('Fournisseur_Id');
    document.getElementById('oef-fournisseurId').value = fournisseurId;
		var fournisseurConnu = (fournisseurId!="");
		document.getElementById('oef-labelFournisseur').value = fournisseurId;

    document.getElementById('oef-creation').label = "Facture créée le "+ contenu.getAttribute('Date_Creation') + " par "+ contenu.getAttribute('Login_Createur');
    document.getElementById('oef-modification').label = "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj');
    document.getElementById('oef-fiche').setAttribute("label","Facture N° "+ numFacture);
    
    document.getElementById('oef-tabVersionDocument').collapsed = false;
    oef_initVersion();
    oef_modifie = false;
    
    oef_bloquerEcheance = (parseFloat(contenu.getAttribute('Net_A_Payer'))==0);
    
    if (oef_mode!="V") {
    	oef_debloquerChamps();
   		document.getElementById('oef-bReception').disabled = false;
			document.getElementById('oef-bChercherInter').disabled = !fournisseurConnu;
			document.getElementById('oef-bSupFacture').disabled = false;
			var echModifiable = (contenu.getAttribute('Ech_Modifiable')=="1");
    	document.getElementById('oef-echeance').disabled = !echModifiable;
  		document.getElementById('oef-modeReglement').disabled = !echModifiable;
  		document.getElementById('oef-bAffecterAcomptes').collapsed=false;
    }
    
    oef_aAcomptes.setParam("Facture_Id", factureId);
    oef_aAcomptes.initTree(oef_initAcomptes);
    
    document.getElementById('oef-tabAcomptes').collapsed=false;
		document.getElementById('oef-tabAcomptes').disabled=false;

    document.getElementById('oef-bOuvrirCommentairesCaches').disabled = false;
    document.getElementById('oef-bVisualiser').disabled = false;
    document.getElementById('oef-bEchMultiples').disabled = oef_bloquerEcheance;
  
    oef_calculTotaux();

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


function oef_pressOnEcheancesMultiples() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-echeancesMultiplesFourn.xul?"+ cookie() +"&Facture_Id="+ factureId +"&Modifiable="+ (oef_mode=="V"?0:1);
    window.openDialog(url,'','chrome,modal,centerscreen',oef_refreshEcheance1);
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_refreshEcheance1() {
	try {
		var qGetEcheance = new QueryHttp("Facturation/Factu_Fournisseur/getPremiereEcheance.tmpl");
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


function oef_rechercherFournisseur() {
  try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie();
    url += "&Nouv=false&Bloque=true";
    window.openDialog(url,'','chrome,modal,centerscreen',oef_retourRechercherFournisseur);
		if (!isEmpty(document.getElementById("oef-fournisseurId").value)) {
			oef_setModifie(true);
			oef_chargerCoord();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}

function oef_retourRechercherFournisseur(codeFournisseur) {
	try {
		document.getElementById('oef-fournisseurId').value = codeFournisseur;
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_rechercherAdr() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdrCom.xul?"+ cookie() +"&Fournisseur_Id="+ urlEncode(document.getElementById('oef-fournisseurId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oef_reporterAdr);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_reporterAdr(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact) {
  try {

		document.getElementById("oef-denomination").value = nom;
		document.getElementById("oef-adresse1").value = adr1;
		document.getElementById("oef-adresse2").value = adr2;
		document.getElementById("oef-adresse3").value = adr3;
		document.getElementById("oef-codePostal").value = cp;
		document.getElementById("oef-ville").value = ville;
	  document.getElementById("oef-codePays").value = code_pays;
	  oef_calculerTvaPort();
	  oef_selectPays();

	  if (!isEmpty(contact)) {
	  	var qInter = new QueryHttp("Facturation/Fournisseurs/getContact.tmpl");
	  	qInter.setParam("Num_Inter", contact);
	  	var result = qInter.execute();
	  	var content = result.responseXML.documentElement;
	  	oef_reporterInter(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
	  oef_setModifie(true);


	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_rechercherInterlocuteur() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInterFournisseur.xul?"+ cookie() +"&Fournisseur_Id="+ urlEncode(document.getElementById('oef-fournisseurId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oef_reporterInter);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_reporterInter(civ, civ_courte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById("oef-civInter").value = civ;
		document.getElementById("oef-nomInter").value = nom;
		document.getElementById("oef-prenomInter").value = prenom;
		document.getElementById("oef-telInter").value = tel;
		document.getElementById("oef-faxInter").value = fax;
		document.getElementById("oef-emailInter").value = email;

		oef_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_chargerCoord() {
  try {
		var fournisseurId = document.getElementById("oef-fournisseurId").value;
		document.getElementById('oef-labelFournisseur').value = fournisseurId;

		var qCoord = new QueryHttp("Facturation/Fournisseurs/getCoord.tmpl");
		qCoord.setParam("Fournisseur_Id",fournisseurId);
		var result = qCoord.execute();
		var contenu = result.responseXML.documentElement;

    document.getElementById("oef-denomination").value = contenu.getAttribute("Denomination");
    document.getElementById("oef-adresse1").value = contenu.getAttribute("Adresse_Fact");
    document.getElementById("oef-adresse2").value = contenu.getAttribute("Comp_Adresse_Fact");
		document.getElementById("oef-adresse3").value = contenu.getAttribute("Adresse_3_Fact");
    document.getElementById("oef-codePostal").value = contenu.getAttribute("CP_Fact");
    document.getElementById("oef-ville").value = contenu.getAttribute("Ville_Fact");
    document.getElementById("oef-codePays").value = contenu.getAttribute("Code_Pays_Fact");
    oef_calculerTvaPort();
    oef_selectPays();

		document.getElementById("oef-civInter").value = contenu.getAttribute("Civ_Inter");
		document.getElementById("oef-nomInter").value = contenu.getAttribute("Nom_Inter");
		document.getElementById("oef-prenomInter").value = contenu.getAttribute("Prenom_Inter");
		document.getElementById("oef-telInter").value = contenu.getAttribute("Tel_Inter");
		document.getElementById("oef-faxInter").value = contenu.getAttribute("Fax_Inter");
		document.getElementById("oef-emailInter").value = contenu.getAttribute("Email_Inter");
		oef_chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById("oef-secteur").value = contenu.getAttribute("Secteur_Activite");

    document.getElementById('oef-remise').value = contenu.getAttribute("Remise");
		document.getElementById('oef-bRemise').setAttribute("class", "bIcoPourcentage");
		oef_typeRemise = 'P';
		
		if (!oef_bloquerEcheance) {
	    document.getElementById('oef-echeance').value = contenu.getAttribute('Echeance');
	    oef_chargerModesReglements(contenu.getAttribute('Mode_Reg'));
		}
		
		document.getElementById('oef-bChercherAdr').disabled = false;
		document.getElementById('oef-bChercherInter').disabled = false;

		oef_ajouterLigne("I");
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
		var fournisseurId = document.getElementById("oef-fournisseurId").value;
		var codePays = document.getElementById('oef-codePays').value;

		switch (typeLigne) {
			case "S":
				
				var reference = document.getElementById("oef-reference").value;
				if (!isEmpty(reference)) {

					var queryTarif = new QueryHttp("Facturation/Factu_Fournisseur/getArticleTarif.tmpl");
					queryTarif.setParam("Article_Id",reference);
					if (!isEmpty(fournisseurId)) { queryTarif.setParam("Fournisseur_Id",fournisseurId); }
					var result = queryTarif.execute();
					var contenu = result.responseXML.documentElement;
					
          document.getElementById("oef-designation").value = contenu.getAttribute("Designation");
          document.getElementById("oef-numLot").value = "";
					document.getElementById("oef-nbPieces").value = "";
					document.getElementById('oef-quantite').value = 1;
					document.getElementById('oef-unite').value = contenu.getAttribute("Unite");
					document.getElementById("oef-datePeremption").value = "";
          document.getElementById("oef-PU").value = contenu.getAttribute("Prix");
          document.getElementById('oef-ristourne').value = "0.00";
          document.getElementById("oef-codeTVA").value = (codePays=="FR"?contenu.getAttribute("Code_TVA"):getCodeTvaZero(codePays));
          oef_libelle = "";
				}
				else {
					oef_ajouterLigne("I");
				}
				break;

			case "B":
				if (!isEmpty(factureId)) {
					if (!isEmpty(fournisseurId) && !oef_existeBR(fournisseurId)) { showWarning("Tous les articles des BR de ce fournisseur ont été inclus dans des factures !"); }
					else {
						// on prévoit le cas où l'utilisateur cliquera sur "Annuler" dans le popup de recherche articles des br
						if (oef_aLignes.isSelected()) {
							oef_aLignes.select(-1);
						}
						document.getElementById('oef-reference').value = "";
						document.getElementById('oef-designation').value = "";
						document.getElementById("oef-numLot").value = "";
						document.getElementById("oef-nbPieces").value = "";
						document.getElementById('oef-quantite').value = 1;
						document.getElementById('oef-unite').value = "U";
						document.getElementById("oef-datePeremption").value = "";
						document.getElementById('oef-PU').value = "";
						document.getElementById('oef-ristourne').value = "0.00";
						document.getElementById('oef-codeTVA').value = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
						oef_libelle = "";
						
						var url = "chrome://opensi/content/facturation/user/recherches/rech_articles_bon_reception.xul?"+ cookie();
						url += "&Fournisseur_Id="+ urlEncode(fournisseurId) +"&Facture_Id="+ factureId;
						window.openDialog(url,'','chrome,modal,centerscreen',oef_ajouterBR);
					}
				}
				break;

			case "I":
				document.getElementById('oef-reference').value = "";
				document.getElementById('oef-designation').value = "";
				document.getElementById("oef-numLot").value = "";
				document.getElementById("oef-nbPieces").value = "";
				document.getElementById('oef-quantite').value = 1;
				document.getElementById('oef-unite').value = "U";
				document.getElementById("oef-datePeremption").value = "";
				document.getElementById('oef-PU').value = "";
				document.getElementById('oef-ristourne').value = "0.00";
				document.getElementById('oef-codeTVA').value = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
				oef_libelle = "";
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}

function oef_ajouterBR() {
  try {
  	oef_ajouterLigne("I");
  	oef_aLignes.initTree(oef_afterRefreshArticles);
	} catch (e) {
  	recup_erreur(e);
	}
}

function oef_existeBR() {
  try {
  	
  	var fournisseurId = document.getElementById('oef-fournisseurId').value;

		var queryExBR = new QueryHttp("Facturation/Factu_Fournisseur/existeBRFournisseur.tmpl");
		if (fournisseurId!="") { queryExBR.setParam("Fournisseur_Id", fournisseurId); }
		var result = queryExBR.execute();
    return (result.responseXML.documentElement.getAttribute("existe")=="true");

	} catch (e) {
  	recup_erreur(e);
	}
}

function oef_formatLigne(typeLigne) {
  try {

		switch(typeLigne) {
			case "S":
        if (oef_mode != 'V') {
				  document.getElementById('oef-reference').disabled = true;
				  document.getElementById('oef-designation').disabled = true;
				  document.getElementById('oef-numLot').disabled = false;
					document.getElementById('oef-nbPieces').disabled = false;
					document.getElementById('oef-quantite').disabled = false;
					document.getElementById('oef-unite').disabled = false;
					document.getElementById('oef-datePeremption').disabled = false;
				  document.getElementById('oef-PU').disabled = false;
				  document.getElementById('oef-ristourne').disabled = false;
				  document.getElementById('oef-codeTVA').disabled = false;
				  document.getElementById('oef-bValider').disabled = false;
				  document.getElementById('oef-bAnnuler').disabled = false;
        }
				break;

			case "B":
        if (oef_mode != 'V') {
				  document.getElementById('oef-reference').disabled = true;
				  document.getElementById('oef-designation').disabled = true;
				  document.getElementById('oef-numLot').disabled = true;
					document.getElementById('oef-nbPieces').disabled = true;
					document.getElementById('oef-quantite').disabled = false;
					document.getElementById('oef-unite').disabled = true;
					document.getElementById('oef-datePeremption').disabled = true;
				  document.getElementById('oef-PU').disabled = true;
				  document.getElementById('oef-ristourne').disabled = false;
				  document.getElementById('oef-codeTVA').disabled = false;
				  document.getElementById('oef-bValider').disabled = false;
				  document.getElementById('oef-bAnnuler').disabled = false;
        }
				break;

			case "I":
        if (oef_mode != 'V') {
  				document.getElementById('oef-reference').disabled = false;
	  			document.getElementById('oef-designation').disabled = false;
		  		document.getElementById('oef-numLot').disabled = false;
					document.getElementById('oef-nbPieces').disabled = false;
					document.getElementById('oef-quantite').disabled = false;
					document.getElementById('oef-unite').disabled = false;
					document.getElementById('oef-datePeremption').disabled = false;
			  	document.getElementById('oef-PU').disabled = false;
				  document.getElementById('oef-ristourne').disabled = false;
				  document.getElementById('oef-codeTVA').disabled = false;
				  document.getElementById('oef-bValider').disabled = false;
				  document.getElementById('oef-bAnnuler').disabled = false;
        }
				break;

			default:
				var codePays = document.getElementById('oef-codePays').value;
			
				document.getElementById('oef-reference').value = "";
				document.getElementById('oef-designation').value = "";
				document.getElementById('oef-numLot').value = "";
				document.getElementById('oef-nbPieces').value = "";
				document.getElementById('oef-quantite').value = "";
				document.getElementById('oef-unite').value = "U";
				document.getElementById('oef-datePeremption').value = "";
				document.getElementById('oef-PU').value = "";
				document.getElementById('oef-ristourne').value = "";
				document.getElementById('oef-codeTVA').value = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
				oef_libelle = "";
				oef_ligneId = "";
				document.getElementById('oef-reference').disabled = true;
				document.getElementById('oef-designation').disabled = true;
				document.getElementById('oef-numLot').disabled = true;
				document.getElementById('oef-nbPieces').disabled = true;
				document.getElementById('oef-quantite').disabled = true;
				document.getElementById('oef-unite').disabled = true;
				document.getElementById('oef-datePeremption').disabled = true;
				document.getElementById('oef-PU').disabled = true;
				document.getElementById('oef-ristourne').disabled = true;
				document.getElementById('oef-codeTVA').disabled = true;
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


function oef_dejaPresente(reference) {
  try {

		var queryExArticle = new QueryHttp("Facturation/Factu_Fournisseur/existeArticle.tmpl");
		queryExArticle.setParam("Reference",reference);
		queryExArticle.setParam("Doc_Id",factureId);
		queryExArticle.setParam("Type_Doc", "Facture_Fournisseur");
		var result=queryExArticle.execute();

    return (result.responseXML.documentElement.getAttribute("existe")=="true");

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


function oef_pressOnQuantite(ev) {
	try {

		if (ev.keyCode==13) {
			oef_validerLigne();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_rechercherStock(reference) {
	try {

		var fournisseurId = document.getElementById("oef-fournisseurId").value;
		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		if (!isEmpty(fournisseurId)) { url += "&Fournisseur="+ urlEncode(fournisseurId); }
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

		var fournisseurId = document.getElementById("oef-fournisseurId").value;
		var reference = document.getElementById('oef-reference').value;

		var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
		qExArt.setParam('Reference', reference);
		if (!isEmpty(fournisseurId)) { qExArt.setParam('Fournisseur_Id', fournisseurId); }
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


function oef_ouvrirLigne() {
  try {

		if (oef_aLignes.isSelected() && (oef_mode!="C")) {
			var i = oef_aLignes.getCurrentIndex();
			oef_currentIndex = i;
			
			if (oef_aLignes.getCellText(i,'oef-colTypeLigne')=="C") {
				oef_ajouterLigne("I");
			}	else {
				oef_modeLigne = "M";
				
				document.getElementById("oef-reference").value = oef_aLignes.getCellText(i,'oef-colReference');
				document.getElementById("oef-designation").value = oef_aLignes.getCellText(i,'oef-colDesignation');
				document.getElementById("oef-numLot").value = oef_aLignes.getCellText(i,'oef-colNumLot');
				document.getElementById("oef-nbPieces").value = oef_aLignes.getCellText(i,'oef-colNbPieces');
				document.getElementById("oef-quantite").value = oef_aLignes.getCellText(i,'oef-colQuantite');
				document.getElementById("oef-unite").value = oef_aLignes.getCellText(i,'oef-colUnite');
				document.getElementById("oef-datePeremption").value = oef_aLignes.getCellText(i,'oef-colDatePeremption');
				document.getElementById("oef-PU").value = oef_aLignes.getCellText(i,'oef-colPU');
				document.getElementById("oef-ristourne").value = oef_aLignes.getCellText(i,'oef-colRistourne');
				oef_typeLigne = oef_aLignes.getCellText(i,'oef-colTypeLigne');
				oef_ligneId = oef_aLignes.getCellText(i,'oef-colLigneId');
				oef_libelle = oef_aLignes.getCellText(i,'oef-colLibelle');
        document.getElementById("oef-codeTVA").value = oef_aLignes.getCellText(i,'oef-colCodeTVA');
        
        if (oef_mode == "M") {
        	document.getElementById('oef-bCommentaire').disabled = false;
  		    document.getElementById('oef-bSupprimer').disabled = false;
  		    
  		    // on ignore les lignes de commentaires
  				var firstIndex = 0;
  				var lastIndex = oef_aLignes.nbLignes()-1;
  				if (oef_aLignes.getCellText(firstIndex,'oef-colTypeLigne')=="C") { firstIndex++; }
  				if (oef_aLignes.getCellText(lastIndex,'oef-colTypeLigne')=="C") { lastIndex--; }
  				
  				document.getElementById('oef-bFlecheHaut').disabled = (i==firstIndex);
  				document.getElementById('oef-bFlecheBas').disabled = (i==lastIndex);
        }

				oef_formatLigne(oef_typeLigne);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_ouvrirCommentaire() {
  try {

		if (oef_aLignes.isSelected() && oef_mode=="M") {
			var i = oef_aLignes.getCurrentIndex();
			
			if (oef_aLignes.getCellText(i,'oef-colTypeLigne')=="C") {
				oef_editerCommentaire();
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
		if (oef_aLignes.isSelected() && oef_mode=="M") {
			var i = oef_aLignes.getCurrentIndex();
			if (oef_aLignes.getCellText(i,'oef-colTypeLigne')!="C") {
				var ligneId = oef_aLignes.getCellText(i,'oef-colLigneId');
				var qDeplacerLigne = new QueryHttp("Facturation/Factu_Fournisseur/deplacerLigne.tmpl");
				qDeplacerLigne.setParam("Ligne_Id", ligneId);
				qDeplacerLigne.setParam("Deplacement", type);
				qDeplacerLigne.execute();
				
				oef_ajouterLigne("I");
				oef_aLignes.initTree(oef_afterRefreshArticles);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_validerLigne() {
  try {

		var reference = document.getElementById("oef-reference").value;
		var designation = document.getElementById("oef-designation").value;
		var numLot = document.getElementById("oef-numLot").value;
		var nbPieces = document.getElementById("oef-nbPieces").value;
		var quantite = document.getElementById("oef-quantite").value;
		var unite = document.getElementById("oef-unite").value;
		var datePeremption = document.getElementById("oef-datePeremption").value;
		var pu = document.getElementById("oef-PU").value;
		var ristourne = document.getElementById("oef-ristourne").value;
		var codeTva = document.getElementById("oef-codeTVA").value;
		var ok=true;

		if (oef_mode=="C") {
			var prec_typeLigne = oef_typeLigne;
			ok=oef_enregistrerFacture();
			oef_typeLigne = prec_typeLigne;
		}

		if (ok) {
			if (isEmpty(designation)) { showWarning("Désignation de l'article manquante !"); }
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !");	}
			else if (!isEmpty(nbPieces) && !isPositiveInteger(nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (!isEmpty(datePeremption) && !isDate(datePeremption)) { showWarning("Date de péremption incorrecte !");	}
			else if (isEmpty(pu) || !checkDecimal(pu,4) || !isPositiveOrNull(pu)) { showWarning("Prix unitaire incorrect !");	}
			else if (isEmpty(ristourne) || !isTaux(ristourne)) { showWarning("Taux de ristourne incorrect !");	}
			else {
				
				if (oef_modeLigne=="M") {
					var qCheckImputation = new QueryHttp("Facturation/Factu_Fournisseur/checkImputationArticleBR.tmpl");
					qCheckImputation.setParam("Ligne_Id", oef_ligneId);
					qCheckImputation.setParam("Quantite", quantite);
					var result = qCheckImputation.execute();
		      var contenu = result.responseXML.documentElement;
		      if (contenu.getAttribute("Surplus")=="true") {
		      	ok = window.confirm("Attention : la quantité facturée dépasse la quantité réceptionnée. Voulez-vous continuer ?");
		      }
				}
				
				if (ok) {
					var qEnregistrer;
					if (oef_modeLigne=="C") {
						oef_currentIndex = oef_aLignes.nbLignes();
						qEnregistrer = new QueryHttp("Facturation/Factu_Fournisseur/ajouterArticle.tmpl");
					}
					else {
						qEnregistrer = new QueryHttp("Facturation/Factu_Fournisseur/modifierArticle.tmpl");
						qEnregistrer.setParam("Ligne_Id", oef_ligneId);
					}
					qEnregistrer.setParam("Facture_Id", factureId);
					qEnregistrer.setParam("Reference", reference);
					qEnregistrer.setParam("Designation", designation);
					qEnregistrer.setParam("Quantite", quantite);
					qEnregistrer.setParam("Type_Ligne", oef_typeLigne);
					qEnregistrer.setParam("Prix", pu);
					qEnregistrer.setParam("Ristourne", ristourne);
					qEnregistrer.setParam("Code_TVA", codeTva);
					qEnregistrer.setParam("Libelle", oef_libelle);
					qEnregistrer.setParam("Num_Lot", numLot);
					qEnregistrer.setParam("Nb_Pieces", nbPieces);
					qEnregistrer.setParam("Unite", unite);
					qEnregistrer.setParam("Date_Peremption", (!isEmpty(datePeremption)?prepareDateJava(datePeremption):""));
		      var result = qEnregistrer.execute();
		      var contenu = result.responseXML.documentElement;
		      oef_bloquerEcheance = (parseFloat(contenu.getAttribute('Net_A_Payer'))==0);
	        var echModifiable = (contenu.getAttribute('Ech_Modifiable')=="1");
	        document.getElementById('oef-echeance').disabled = !echModifiable;
	        document.getElementById('oef-modeReglement').disabled = !echModifiable;
	        document.getElementById('oef-bEchMultiples').disabled = oef_bloquerEcheance;
		      
	        oef_ajouterLigne("I");
	
	        oef_aLignes.initTree(oef_afterRefreshArticles);
				}
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_annulerLigne() {
  try {

  	oef_aLignes.select(-1);
  	oef_ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_supprimerLigne() {
  try {

		var qSupprimer = new QueryHttp("Facturation/Factu_Fournisseur/supprimerArticle.tmpl");
		qSupprimer.setParam("Facture_Id", factureId);
		qSupprimer.setParam("Ligne_Id", oef_ligneId);
    var result = qSupprimer.execute();
    var contenu = result.responseXML.documentElement;
    oef_bloquerEcheance = (parseFloat(contenu.getAttribute('Net_A_Payer'))==0);
    var echModifiable = (contenu.getAttribute('Ech_Modifiable')=="1");
    document.getElementById('oef-echeance').disabled = !echModifiable;
    document.getElementById('oef-modeReglement').disabled = !echModifiable;
    document.getElementById('oef-bEchMultiples').disabled = oef_bloquerEcheance;

    oef_currentIndex--;
    oef_ajouterLigne("I");
    oef_aLignes.initTree(oef_afterRefreshArticles);

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_enregistrerFacture() {
  try {

		var ok = false;
		
    if (oef_mode != 'C' && (oef_aLignes.nbLignes()==0)) { showWarning("La facture ne contient aucune ligne !"); }
		else {
			var modeReglement = document.getElementById('oef-modeReglement').value;
		  var fraisPort = document.getElementById('oef-fraisPort').value;
		  var escompte = document.getElementById('oef-escompte').value;
		  var echeance = document.getElementById('oef-echeance').value;
      var denomination = document.getElementById('oef-denomination').value;
      var adresse1 = document.getElementById('oef-adresse1').value;
      var adresse2 = document.getElementById('oef-adresse2').value;
			var adresse3 = document.getElementById('oef-adresse3').value;
      var cp = document.getElementById('oef-codePostal').value;
      var ville = document.getElementById('oef-ville').value;
			var codePays = document.getElementById('oef-codePays').value;
			var civInter = document.getElementById('oef-civInter').value;
			var nomInter = document.getElementById('oef-nomInter').value;
			var prenomInter = document.getElementById('oef-prenomInter').value;
			var telInter = document.getElementById('oef-telInter').value;
			var faxInter = document.getElementById('oef-faxInter').value;
			var emailInter = document.getElementById('oef-emailInter').value;
			var numero = document.getElementById('oef-numFacture').value;
			var dateFact = document.getElementById('oef-dateFacture').value;
			var fournisseurId = document.getElementById('oef-fournisseurId').value;
			var secteurActivite = document.getElementById("oef-secteur").value;
			var responsable = document.getElementById('oef-responsable').value;
			var commentairesFin = document.getElementById('oef-commentairesFin').value;
			var commentairesInt = document.getElementById('oef-commentairesInt').value;
			
			var remise = document.getElementById('oef-remise').value;
	    var remiseFP = document.getElementById('oef-remiseFP').value;
			var tauxRemise = 0;
			var montantRemise = 0;
			var tauxRemiseFP = 0;
			var montantRemiseFP = 0;
			
			var montantBase = oef_montantHT;

			if (isEmpty(denomination)) { showWarning("Veuillez saisir la raison sociale du fournisseur !"); }
		  else if (isEmpty(adresse1)) { showWarning("Veuillez saisir l'adresse du fournisseur !"); }
		  else if (isEmpty(ville)) { showWarning("Veuillez saisir la ville du fournisseur !"); }
			else if (isEmpty(echeance) || !isDate(echeance)) { showWarning("Date d'échéance incorrecte !"); }
			else if (isEmpty(remise) || (oef_typeRemise=='P'?!isTaux(remise):!isPositiveOrNull(remise) || parseFloat(remise)>montantBase)) { showWarning("Remise incorrecte !"); }
		  else if (isEmpty(fraisPort) || !isPositiveOrNull(fraisPort)) { showWarning("Frais de port incorrects !"); }
		  else if (isEmpty(remiseFP) || (oef_typeRemiseFP=='P'?!isTaux(remiseFP):!isPositiveOrNull(remiseFP) || parseFloat(remiseFP)>parseFloat(fraisPort))) { showWarning("Remise sur frais de port incorrecte !"); }
		  else if (isEmpty(escompte) || !isTaux(escompte)) { showWarning("Taux d'escompte incorrect !"); }
		  else if (isEmpty(trim(numero))) { showWarning("Numéro de facture incorrect !"); }
		  else if (isEmpty(dateFact) || !isDate(dateFact)) { showWarning("Date de la facture incorrecte !"); }
      else if (!isEmpty(telInter) && !isPhone(telInter)) { showWarning("Numéro de téléphone de facturation incorrect !"); }
			else if (!isEmpty(faxInter) && !isPhone(faxInter)) { showWarning("Numéro de fax de facturation incorrect !"); }
			else if (!isEmpty(emailInter) && !isEmail(emailInter)) { showWarning("Adresse e-mail de facturation incorrecte !"); }
		  else {
		  	
		  	fraisPort = parseFloat(fraisPort);
				remise = parseFloat(remise);
				remiseFP = parseFloat(remiseFP);

			  var qEnregistrer;

			  if (oef_mode=="C") {
			  	qEnregistrer = new QueryHttp("Facturation/Factu_Fournisseur/creerFacture.tmpl");
			  } else {
			  	qEnregistrer = new QueryHttp("Facturation/Factu_Fournisseur/modifierFacture.tmpl");
				  qEnregistrer.setParam("Facture_Id", factureId);
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
				
				qEnregistrer.setParam("Fournisseur_Id", fournisseurId);
				qEnregistrer.setParam("PRemise", tauxRemise);
				qEnregistrer.setParam("MRemise", montantRemise);
				qEnregistrer.setParam("PRemise_FP", tauxRemiseFP);
				qEnregistrer.setParam("MRemise_FP", montantRemiseFP);
				qEnregistrer.setParam("Date_Facture", prepareDateJava(dateFact));
				qEnregistrer.setParam("Numero", numero);
				qEnregistrer.setParam("Denomination", denomination);
				qEnregistrer.setParam("Adresse_Fact", adresse1);
				qEnregistrer.setParam("Comp_Adresse_Fact", adresse2);
				qEnregistrer.setParam("Adresse_3_Fact", adresse3);
				qEnregistrer.setParam("CP_Fact", cp);
				qEnregistrer.setParam("Ville_Fact", ville);
				qEnregistrer.setParam("Code_Pays_Fact", codePays);
				qEnregistrer.setParam("Util_R", responsable);
				qEnregistrer.setParam("Civ_Inter", civInter);
				qEnregistrer.setParam("Nom_Inter", nomInter);
				qEnregistrer.setParam("Prenom_Inter", prenomInter);
				qEnregistrer.setParam("Tel_Inter", telInter);
				qEnregistrer.setParam("Fax_Inter", faxInter);
				qEnregistrer.setParam("Email_Inter", emailInter);
				qEnregistrer.setParam("Code_TVA_Port", oef_codeTvaPort);
				qEnregistrer.setParam("Taux_TVA_Port", oef_tauxTvaPort);
				qEnregistrer.setParam("Secteur_Activite", secteurActivite);
				qEnregistrer.setParam("Frais_Port", fraisPort);
				qEnregistrer.setParam("Echeance", prepareDateJava(echeance));
				qEnregistrer.setParam("Mode_Reg", modeReglement);
				qEnregistrer.setParam("Escompte", escompte);
				qEnregistrer.setParam("Commentaires_Fin", commentairesFin);
				qEnregistrer.setParam("Commentaires_Int", commentairesInt);
				var result = qEnregistrer.execute();
				var contenu = result.responseXML.documentElement;

				if (oef_mode=="C") {
					factureId = contenu.getAttribute("Facture_Id");
					oef_aLignes.setParam("Facture_Id",factureId);
					oef_chargerFacture();
				} else if (oef_mode=="M") {
					oef_bloquerEcheance = (parseFloat(contenu.getAttribute('Net_A_Payer'))==0);
			    var echModifiable = (contenu.getAttribute('Ech_Modifiable')=="1");
			    document.getElementById('oef-echeance').disabled = !echModifiable;
			    document.getElementById('oef-modeReglement').disabled = !echModifiable;
			    document.getElementById('oef-bEchMultiples').disabled = oef_bloquerEcheance;
			    oef_initAcomptes();
			  }
			  oef_setModifie(false);
				ok = true;
		  }
    }

    return ok;

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_calculTotaux() {
  try {
  	
  	var fournisseurId = document.getElementById("oef-fournisseurId").value;
		var fournisseurConnu = (fournisseurId!="");
  	
  	if (oef_mode!='V') {
			document.getElementById('oef-bRechFournisseur').collapsed = (oef_aLignes.nbLignes()>0);
	    document.getElementById('oef-codePays').disabled = (oef_aLignes.nbLignes()>0);
	    document.getElementById('oef-bChercherAdr').disabled = (!fournisseurConnu || oef_aLignes.nbLignes()>0);
		}

		var tauxEscompte = parseFloat(document.getElementById('oef-escompte').value);
		var fraisPort = parseFloat(document.getElementById('oef-fraisPort').value);
		var remise = parseFloat(document.getElementById('oef-remise').value);
		var remiseFP = parseFloat(document.getElementById('oef-remiseFP').value);
		
		if ((oef_typeRemise=='P'?isTaux(remise):isPositiveOrNull(remise)) && (oef_typeRemiseFP=='P'?isTaux(remiseFP):isPositiveOrNull(remiseFP)) && isTaux(tauxEscompte) && isPositiveOrNull(fraisPort)) {

			if (oef_aLignes.isNotNull()) {
				
				var calculDocument = new CalculDocument();
				if (oef_typeRemise=='P') { calculDocument.setRemiseP(remise); }
				else { calculDocument.setRemiseM(remise); }
				calculDocument.setFraisPortBruts(fraisPort);
				if (oef_typeRemiseFP=='P') { calculDocument.setRemiseFPP(remiseFP); }
				else { calculDocument.setRemiseFPM(remiseFP); }
				calculDocument.setTauxTVAFP(oef_tauxTvaPort);
				calculDocument.setEscompteP(tauxEscompte);
				calculDocument.setAcompte(oef_acompte);
				
				var nbLignes = oef_aLignes.nbLignes();
				for (var i=0; i<nbLignes; i++) {
					if (oef_aLignes.getCellText(i,'oef-colTypeLigne')!="C") {
						var prixUnitaireBrut = oef_aLignes.getCellText(i,'oef-colPU');
						var ristourneP = oef_aLignes.getCellText(i,'oef-colRistourne');
						var commissionP = 0;
						var quantite = oef_aLignes.getCellText(i,'oef-colQuantite');
						var codeTVA = oef_aLignes.getCellText(i,'oef-colCodeTVA');
						calculDocument.ajouterLigneDocument(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA);
					}
				}
				
				calculDocument.calculer();
				
				document.getElementById('oef-montantHT').value = calculDocument.getMontantHT();
				document.getElementById('oef-montantRemise').value = calculDocument.getRemiseM();
				document.getElementById('oef-montantFraisPort').value = calculDocument.getFraisPortBruts();
				document.getElementById('oef-montantRemiseFP').value = calculDocument.getRemiseFPM();
				document.getElementById('oef-totalHT').value = calculDocument.getTotalHT();
				document.getElementById('oef-TVA').value = calculDocument.getTotalTVA();
				document.getElementById('oef-montantTTC').value = calculDocument.getMontantTTC();
				document.getElementById('oef-montantEscompte').value = calculDocument.getEscompteM();
				document.getElementById('oef-montantAcompte').value = calculDocument.getAcompte();
				document.getElementById('oef-totalTTC').value = calculDocument.getTotalTTC();
				
				oef_montantHT = calculDocument.getMontantHTSansFormat();
				
				document.getElementById('oef-rowRemiseHT').collapsed = !calculDocument.afficherRemiseM();
				document.getElementById('oef-rowRemiseFPHT').collapsed = !calculDocument.afficherRemiseFPM();
				document.getElementById('oef-rowMontantTTC').collapsed = !calculDocument.afficherEscompteM();
				document.getElementById('oef-rowEscompteHT').collapsed = !calculDocument.afficherEscompteM();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_afterRefreshArticles() {
	try {

		oef_initAcomptes();
		oef_calculTotaux();
		oef_scrollToRank();

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
  	document.getElementById('oef-bVisualiser').disabled = m;
		if (m) {
			document.getElementById('oef-tabFacture').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('oef-bEchMultiples').disabled = true;
			document.getElementById('oef-bAffecterAcomptes').disabled = true;
		}
		else {
			document.getElementById('oef-tabFacture').setAttribute('image', null);
			document.getElementById('oef-bEchMultiples').disabled = (oef_mode=="C" || oef_bloquerEcheance);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oef_nouvelleFacture() {
	try {
		oef_mode = "C";
		oef_reinitialiser();
		document.getElementById('oef-echeance').value = get_cookie('Today');
		oef_chargerResponsables(get_cookie("User"));
		oef_chargerModesReglements("0");
		oef_calculerTvaPort();
		oef_selectPays();
		oef_debloquerChamps();
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_visualiserFacture() {
  try {
  	
		if (isEmpty(document.getElementById('oef-numFacture').value)) {
			showWarning("Numéro de facture incorrect !");
		} else {
			var ok = true;
			if (oef_mode=="M") {
				ok = oef_enregistrerFacture();
			}
			
			if (ok) {
		  	var modeReglement = document.getElementById('oef-modeReglement').value;
	
				if (oef_aLignes.nbLignes()==0) { showWarning("La facture ne contient aucune ligne !"); }
				else {
					var codeErreur = "0";
					var acomptesOk = true;
			    if (oef_mode != "V") {
			    	var qVerifierEcheances = new QueryHttp("Facturation/Factu_Fournisseur/checkEcheances.tmpl");
			    	qVerifierEcheances.setParam("Facture_Id", factureId);
			    	var result = qVerifierEcheances.execute();
			    	codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
			    }
			    
			    if (codeErreur=="0") {
			    	var qCheckImputation = new QueryHttp("Facturation/Factu_Fournisseur/checkImputationsAcomptes.tmpl");
			    	qCheckImputation.setParam("Facture_Id", factureId);
			    	var result = qCheckImputation.execute();
			    	var errors = new Errors(result);

						if (errors.hasNext()) {
							errors.show();
							acomptesOk = false;
						}
			    }

			    if (codeErreur=="1") { showWarning("Les dates d'échéances doivent être supérieures ou égales à la date de la facture !"); }
					else if (codeErreur=="2") { showWarning("Veuillez remplir les modes de règlements des échéances !"); }
					else if (codeErreur=="3") { showWarning("Le total des échéances doit être égal au net à payer !"); }
					else if (acomptesOk && (oef_mode=="V" || window.confirm("Confirmez-vous la génération de la facture ?\n(Attention la facture générée ne pourra plus être modifiée !)"))) {
						document.getElementById('oef-deckFacture').selectedIndex=1;
						document.getElementById('bRetourFacture').collapsed = false;
						oef_typeDocPdf = "FF";
						
						var qGenPdf = new QueryHttp("Facturation/Factu_Fournisseur/facture_pdf.tmpl");
						qGenPdf.setParam("Facture_Id", factureId);
			      var result = qGenPdf.execute();
			      var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
			      document.getElementById('oef-pdfFacture').setAttribute("src",page);
					}
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_supprimerFacture() {
  try {

		if (window.confirm("Confirmez-vous la suppression de la facture ?")) {

			var qSupprimer = new QueryHttp("Facturation/Factu_Fournisseur/supprimerFacture.tmpl");
			qSupprimer.setParam("Facture_Id", factureId);
			qSupprimer.execute();

			showMessage("La facture a été supprimée !");

			retourMenuFactures();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_editerCommentaire() {
  try {

		if (oef_aLignes.isSelected()) {
			var i = oef_aLignes.getCurrentIndex();
			var ligneId = oef_aLignes.getCellText(i,'oef-colLigneId');

			var url = "chrome://opensi/content/facturation/user/factu_fournisseur/popup-commentaire.xul?"+ cookie();
      url += "&Ligne_Id="+ ligneId +"&Type_Doc=Facture_Fournisseur";
    	window.openDialog(url,'','chrome,modal,centerscreen');

    	oef_aLignes.initTree(oef_afterRefreshArticles);
    	oef_ajouterLigne("I");
		}
		else {
			showWarning("Aucun article ou commentaire sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_editerCommentairesCaches() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-commentaireCache.xul?"+ cookie();
    url += "&Type_Doc=Facture_Fournisseur&Doc_Id="+ factureId;
  	window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_choisirMentions() {
  try {

  	var ok = true;

  	if (oef_mode=="C") {
			ok = oef_enregistrerFacture();
		}

		if (ok) {
			var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Facture_Fournisseur&Doc_Id="+ factureId;
    	window.openDialog(url,'','chrome,modal,centerscreen',oef_setModifie);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oef_initVersion() {
	try {
		
		oef_aVersion.setParam("Type_Document", "Facture_Fournisseur");
		oef_aVersion.setParam("Document_Id", factureId);
		oef_aVersion.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_envoyerMail() {
	try {
		var url = "chrome://opensi/content/facturation/user/factu_fournisseur/popup-envoyerMail.xul?"+ cookie();
		url += "&Doc_Id="+ (oef_typeDocPdf=="FF"?factureId:acompteId) +"&Type_Doc="+ (oef_typeDocPdf=="FF"?"Facture_Fournisseur":"Acompte_Fournisseur");

		window.openDialog(url,'','chrome,modal,centerscreen');
	}
	catch (e) {
    recup_erreur(e);
  }
}


function oef_initAcomptes() {
	try {
		acompteId = "";
		
		var qAcomptesImputables = new QueryHttp("Facturation/Factu_Fournisseur/existeAcomptesImputables.tmpl");
		qAcomptesImputables.setParam("Facture_Id", factureId);
		var result = qAcomptesImputables.execute();
		var contenu = result.responseXML.documentElement;
		var existeAcomptesImputables = (contenu.getAttribute("Existe")=="true");
		
		document.getElementById('oef-bAffecterAcomptes').disabled=(oef_mode!="V" && oef_aAcomptes.nbLignes()>0?false:!existeAcomptesImputables);
		document.getElementById('oef-bReediterAcompte').disabled=true;
		
		if (oef_mode!="V") {
			var desactiver = (oef_aAcomptes.nbLignes()>0 && isEmpty(document.getElementById('oef-fournisseurId').value));
			document.getElementById('oef-denomination').disabled = desactiver;
			document.getElementById('oef-bRechFournisseur').disabled = desactiver;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_retourAcompte() {
	try {
		
		document.getElementById('oef-deckFacture').selectedIndex = 0;
		document.getElementById('bRetourFacture').collapsed = true;
		oef_aAcomptes.initTree(oef_initAcomptes);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_pressOnListeAcomptes() {
	try {
		
		if (oef_aAcomptes.isSelected()) {
			document.getElementById('oef-bReediterAcompte').disabled=false;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_editerAcompte() {
	try {
		if (oef_aAcomptes.isSelected()) {
			var i = oef_aAcomptes.getCurrentIndex();
			acompteId = oef_aAcomptes.getCellText(i, 'oef-colAcompteId');
			
			oef_typeDocPdf = "AF";
			
			document.getElementById('oef-pdfFacture').setAttribute('src', null);
			document.getElementById('oef-deckFacture').selectedIndex = 1;
			document.getElementById('bRetourFacture').collapsed = false;
			
			var page = getUrlOpeneas("&Page=Facturation/Commandes/pdfAcompte.tmpl&Acompte_Id="+ acompteId);
			document.getElementById('oef-pdfFacture').setAttribute('src',page);

		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_affecterAcomptes() {
	try {

		var url = "chrome://opensi/content/facturation/user/factu_fournisseur/popup-imputationAcomptes.xul?"+ cookie();

		window.openDialog(url,'','chrome,modal,centerscreen', factureId);
		
		// on ne met pas cet appel dans les arguments du popup, car on veut que la fonction soit appelée même si l'utilisateur
		// sort du popup en passant par la croix (auquel cas aucune vérif ne peut être faite)
		oef_retourAffecterAcomptes();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_retourAffecterAcomptes() {
	try {
		
		var qChargerFacture = new QueryHttp("Facturation/Factu_Fournisseur/getFacture.tmpl");
		qChargerFacture.setParam("Facture_Id", factureId);
		var result = qChargerFacture.execute();
		var contenu = result.responseXML.documentElement;
    oef_acompte = contenu.getAttribute('Acompte');
    oef_calculTotaux();
		oef_aAcomptes.initTree(oef_initAcomptes);
		
	} catch (e) {
		recup_erreur(e);
	}
}


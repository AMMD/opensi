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

var oebl_aBon = new Arbre('Facturation/Affaires/liste-articlesBon.tmpl', 'oebl-bonLivraison');
var oebl_aCom = new Arbre('Facturation/Affaires/liste-articlesALivrer.tmpl', 'oebl-commande');

var oebl_aPaysLiv = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oebl-codePaysLiv");
var oebl_aModesExpedition=new Arbre("Facturation/Affaires/liste-modesExpedition.tmpl","oebl-modeExpedition");

var oebl_qParam = new QueryHttp('Config/gestion_commerciale/preferences/getParam.tmpl');
var oebl_qGetBonLiv = new QueryHttp('Facturation/Affaires/getBonLivraison.tmpl');
var oebl_qInfosFournisseur = new QueryHttp('Facturation/Affaires/getInfosFournisseur.tmpl');
var oebl_qAjouterToutBon = new QueryHttp('Facturation/Affaires/ajouterToutBon.tmpl');
var oebl_qAjouterToutBonDispo = new QueryHttp('Facturation/Affaires/ajouterToutBonDispo.tmpl');
var oebl_qAjouterArticles = new QueryHttp('Facturation/Affaires/ajouterArticleBon.tmpl');
var oebl_qEnleverToutBon = new QueryHttp('Facturation/Affaires/enleverToutBon.tmpl');
var oebl_qEnleverArticles = new QueryHttp('Facturation/Affaires/enleverArticleBon.tmpl');

var oebl_qDefautAdresse = new QueryHttp('Facturation/Affaires/getDefaultAdresse.tmpl');
var oebl_qSupBL = new QueryHttp("Facturation/Affaires/supprimerBL.tmpl");
var oebl_qConfExpe = new QueryHttp("Facturation/Affaires/confirmerExpeditionBL.tmpl");
var oebl_qCheckNumLot = new QueryHttp("Facturation/Suivi_Lot/checkNumLot.tmpl");
var oebl_qValider = new QueryHttp("Facturation/Affaires/validerBonLivraison.tmpl");
var oebl_qAnnuler = new QueryHttp("Facturation/Affaires/annulerBL.tmpl");
var oebl_qInterLiv = new QueryHttp("Facturation/Clients/getContact.tmpl");
var oebl_qGetAssujetti = new QueryHttp("Facturation/Affaires/getBonCommande.tmpl");
var oebl_qGetNumeroCommande = new QueryHttp("Facturation/Affaires/getNumeroCommande.tmpl");

var oebl_aLiensColis = new Arbre("Facturation/Affaires/liste-liensColisBL.tmpl","oebl-liensColis");
var oebl_aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","oebl-listeVersion");
var oebl_aLangues = new Arbre("Config/GetRDF/liste-langues.tmpl", "oebl-langueDefaut");


var oebl_colisId = 0;
var oebl_autEtiq = false;

var oebl_mode;
var oebl_clientId;
var oebl_etatBon;
var oebl_statutExpedition;
var oebl_currentCodePaysLiv;
var oebl_langueDefaut;
var oebl_typeEdition='BL';
var oebl_bonChiffre;

var oebl_fournisseur;
var oebl_fournisseurId;

var oebl_modifie = false;

function oebl_init() {
	try {
		
		var oebl_result = oebl_qParam.execute();
		var oebl_prodFrais = (oebl_result.responseXML.documentElement.getAttribute("Produit_Frais")=="1");
		oebl_bonChiffre = (oebl_result.responseXML.documentElement.getAttribute("BL_Chiffre")=="1");
		document.getElementById('oebl-prodFraisEntree').collapsed = !oebl_prodFrais;
		document.getElementById('oebl-prodFraisSortie').collapsed = !oebl_prodFrais;
		document.getElementById('oebl-colNumLotDev').collapsed = !oebl_prodFrais;
		document.getElementById('oebl-colNumLotDev').setAttribute('ignoreincolumnpicker', !oebl_prodFrais);
		document.getElementById('oebl-colDatePeremptionDev').collapsed = !oebl_prodFrais;
		document.getElementById('oebl-colDatePeremptionDev').setAttribute('ignoreincolumnpicker', !oebl_prodFrais);
		document.getElementById('oebl-colNbPiecesDev').collapsed = !oebl_prodFrais;
		document.getElementById('oebl-colNbPiecesDev').setAttribute('ignoreincolumnpicker', !oebl_prodFrais);
		document.getElementById('oebl-colNumLotLiv').collapsed = !oebl_prodFrais;
		document.getElementById('oebl-colNumLotLiv').setAttribute('ignoreincolumnpicker', !oebl_prodFrais);
		document.getElementById('oebl-colDatePeremptionLiv').collapsed = !oebl_prodFrais;
		document.getElementById('oebl-colDatePeremptionLiv').setAttribute('ignoreincolumnpicker', !oebl_prodFrais);
		document.getElementById('oebl-colNbPiecesLiv').collapsed = !oebl_prodFrais;
		document.getElementById('oebl-colNbPiecesLiv').setAttribute('ignoreincolumnpicker', !oebl_prodFrais);
		oebl_aPaysLiv.initTree(oebl_initPaysLiv);
		
  } catch (e) {
  	recup_erreur(e);
  }
}

function oebl_initPaysLiv() {
	try {
		document.getElementById('oebl-codePaysLiv').value = "FR";
		oebl_aModesExpedition.initTree(oebl_initModeExpedition);
	} catch (e) {
    recup_erreur(e);
  }
}

function oebl_initModeExpedition() {
	try {
		document.getElementById('oebl-modeExpedition').selectedIndex=0;
	} catch (e) {
		recup_erreur(e);
	}
}
function oebl_reinitialiser() {
	try {
		
		oebl_mode = "C";
		oebl_etatBon = "N";
		oebl_clientId = "";
		
		document.getElementById('oebl-deckBonLivraison').selectedIndex = 0;
		document.getElementById('oebl-tabBoxBon').selectedIndex = 0;
		document.getElementById('oebl-client').value = "";
		document.getElementById('oebl-labelLogin').value = "";
		document.getElementById('oebl-rowLoginWeb').collapsed = true;
		document.getElementById('oebl-raisonSociale').value = "";
		document.getElementById('oebl-adresseFact').value = "";
		document.getElementById('oebl-adresse2Fact').value = "";
		document.getElementById('oebl-adresse3Fact').value = "";
		document.getElementById('oebl-codePostalFact').value = "";
		document.getElementById('oebl-villeFact').value = "";
		document.getElementById('oebl-affaire').value = "";
		document.getElementById('oebl-labelClientLiv').value = "";
		document.getElementById('oebl-denominationLiv').value = "";
		document.getElementById('oebl-adresse1Liv').value = "";
		document.getElementById('oebl-adresse2Liv').value = "";
		document.getElementById('oebl-adresse3Liv').value = "";
		document.getElementById('oebl-codePostalLiv').value = "";
		document.getElementById('oebl-villeLiv').value = "";
		document.getElementById('oebl-codePaysLiv').value = "FR";
		document.getElementById('oebl-civInterLiv').value = "0";
		document.getElementById('oebl-nomInterLiv').value = "";
		document.getElementById('oebl-prenomInterLiv').value = "";
		document.getElementById('oebl-telInterLiv').value = "";
		document.getElementById('oebl-faxInterLiv').value = "";
		document.getElementById('oebl-emailInterLiv').value = "";
		document.getElementById('oebl-tabBon').setAttribute('image', null);
		
		document.getElementById('oebl-tabVersionDocument').collapsed=true;
		oebl_aVersion.deleteTree();
		
		document.getElementById('oebl-tabBoxAdresses').selectedIndex = 1;

		document.getElementById('Fournisseur').value = "";
		document.getElementById('oebl-raisonSocialeFournisseur').value = "";
		document.getElementById('oebl-adresseFournisseur').value = "";
		document.getElementById('oebl-adresse2Fournisseur').value = "";
		document.getElementById('oebl-adresse3Fournisseur').value = "";
		document.getElementById('oebl-cpFournisseur').value = "";
		document.getElementById('oebl-villeFournisseur').value = "";

		oebl_aLiensColis.deleteTree();
		document.getElementById('oebl-numero').value = "";
		document.getElementById('oebl-dateLiv').value = "";
		document.getElementById('oebl-etat').value = "";
		document.getElementById('oebl-statutExpedition').value = "";
		document.getElementById('oebl-commentairesFin').value = "";
		document.getElementById('oebl-commentairesInt').value = "";
		document.getElementById('oebl-nbColis').value = "1";
		document.getElementById('oebl-fraisSup').value = "0.00";
		document.getElementById('oebl-solder').setAttribute("checked",false);
		document.getElementById('oebl-numLotEntree').value = "";
		document.getElementById('oebl-datePeremptionEntree').value = "";
		document.getElementById('oebl-nbPiecesEntree').value = "";
		document.getElementById('oebl-qteEntree').value = "";
		document.getElementById('oebl-nbPiecesSortie').value = "";
		document.getElementById('oebl-qteSortie').value = "";
		document.getElementById('oebl-creation').value = "";
		document.getElementById('oebl-modification').value = "";
		document.getElementById('oebl-fiche').value = "";
		document.getElementById('oebl-modeExpedition').selectedIndex=0;
		oebl_modifie = false;
		
		document.getElementById('oebl-chercherAdrLiv').disabled = true;
		document.getElementById('oebl-chercherInterLiv').disabled = true;
		document.getElementById('oebl-bChoisirMentions').disabled = true;
		document.getElementById('oebl-bAjouter').disabled = true;
		document.getElementById('oebl-bToutAjouter').disabled = true;
		document.getElementById('oebl-bToutAjouterDispo').disabled = true;
		document.getElementById('oebl-bToutAjouterDispo').collapsed = (!oma_calculStock || oebl_fournisseur==1);
		document.getElementById('oebl-bEnlever').disabled = true;
		document.getElementById('oebl-bToutEnlever').disabled = true;
		document.getElementById('oebl-bEnregistrer').disabled = true;
		document.getElementById('oebl-bValider').disabled = true;
		document.getElementById('oebl-bAnnuler').disabled = true;
		document.getElementById('oebl-bConfirmerExpedition').collapsed = true;
		document.getElementById('oebl-bSupprimer').disabled = true;
		document.getElementById('oebl-bVisualiser').disabled = true;
		document.getElementById('oebl-bColisage').disabled = true;
		document.getElementById('oebl-bEditionBP').disabled = true;
		
    document.getElementById('oebl-solder').disabled = true;
    
		document.getElementById('oebl-modeExpedition').disabled = true;
		document.getElementById('oebl-denominationLiv').disabled = true;
		document.getElementById('oebl-adresse1Liv').disabled = true;
		document.getElementById('oebl-adresse2Liv').disabled = true;
		document.getElementById('oebl-adresse3Liv').disabled = true;
		document.getElementById('oebl-codePostalLiv').disabled = true;
		document.getElementById('oebl-villeLiv').disabled = true;
		document.getElementById('oebl-codePaysLiv').disabled = true;
		document.getElementById('oebl-civInterLiv').disabled = true;
		document.getElementById('oebl-nomInterLiv').disabled = true;
		document.getElementById('oebl-prenomInterLiv').disabled = true;
		document.getElementById('oebl-telInterLiv').disabled = true;
		document.getElementById('oebl-faxInterLiv').disabled = true;
		document.getElementById('oebl-emailInterLiv').disabled = true;
		document.getElementById('oebl-commentairesFin').disabled = true;
		document.getElementById('oebl-commentairesInt').disabled = true;
		document.getElementById('oebl-nbColis').disabled = true;
		document.getElementById('oebl-fraisSup').disabled = true;
		document.getElementById('oebl-numLotEntree').disabled = true;
		document.getElementById('oebl-datePeremptionEntree').disabled = true;
		document.getElementById('oebl-nbPiecesEntree').disabled = true;
		document.getElementById('oebl-qteEntree').disabled = true;
		document.getElementById('oebl-nbPiecesSortie').disabled = true;
		document.getElementById('oebl-qteSortie').disabled = true;
		document.getElementById('oebl-codePaysLiv').disabled = true;
		document.getElementById('oebl-bonLivraison').disabled = true;
		document.getElementById('oebl-commande').disabled = true;

		document.getElementById('oebl-bOuvrirCommentairesCaches').disabled = true;

		document.getElementById('oebl-btFournisseur').disabled = true;
		
		document.getElementById('oebl-groupboxFournisseur').collapsed = true;
		document.getElementById('oebl-bVisualiser').collapsed = true;
		document.getElementById('oebl-bColisage').collapsed = true;
		document.getElementById('oebl-bEditionBP').collapsed = true;

		document.getElementById('oebl-barEdition').collapsed=true;
		document.getElementById('oebl-boxLangue').collapsed = true;
		document.getElementById('oebl-chkBonChiffre').checked = oebl_bonChiffre;

		oebl_aBon.deleteTree();
		oebl_aCom.deleteTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function oebl_choisirFournisseur() {
	try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie() +"&Nouv=false&Bloque=true";
		window.openDialog(url,'','chrome,modal,centerscreen',oebl_retourRechercherFournisseur);
		
    if (isEmpty(oebl_fournisseurId)) {
      retourFicheAffaire();
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function oebl_changerFournisseur() {
	try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie() +"&Nouv=false&Bloque=true";
		window.openDialog(url,'','chrome,modal,centerscreen',oebl_retourRechercherFournisseur);
		
    if (isEmpty(oebl_fournisseurId)) {
      retourFicheAffaire();
    } else {
			oebl_aCom.setParam('Fournisseur_Id', oebl_fournisseurId);		
			oebl_aCom.initTree();
			oebl_enregistrerBon(true);
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function oebl_retourRechercherFournisseur(codeFournisseur) {
	try {
		oebl_fournisseurId = codeFournisseur;
		document.getElementById('Fournisseur').value = codeFournisseur;
		if (!isEmpty(codeFournisseur)) {
			oebl_qInfosFournisseur.setParam("Fournisseur_Id", oebl_fournisseurId);
			var result = oebl_qInfosFournisseur.execute();
			var contenu = result.responseXML.documentElement;
			
			document.getElementById('oebl-raisonSocialeFournisseur').value = contenu.getAttribute('Denomination');
			document.getElementById('oebl-adresseFournisseur').value = contenu.getAttribute('Adresse');
			document.getElementById('oebl-adresse2Fournisseur').value = contenu.getAttribute('Adresse_2');
			document.getElementById('oebl-adresse3Fournisseur').value = contenu.getAttribute('Adresse_3');
			document.getElementById('oebl-cpFournisseur').value = contenu.getAttribute('Code_Postal');
			document.getElementById('oebl-villeFournisseur').value = contenu.getAttribute('Ville');
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oebl_debloquerChamps() {
	try {

		document.getElementById('oebl-chercherAdrLiv').disabled = false;
		document.getElementById('oebl-chercherInterLiv').disabled = false;
		document.getElementById('oebl-bChoisirMentions').disabled = false;
		document.getElementById('oebl-bAjouter').disabled = false;
		document.getElementById('oebl-bToutAjouter').disabled = false;
		document.getElementById('oebl-bToutAjouterDispo').disabled = false;
		document.getElementById('oebl-bEnlever').disabled = false;
    document.getElementById('oebl-solder').disabled = false;

		document.getElementById('oebl-modeExpedition').disabled = false;
		document.getElementById('oebl-denominationLiv').disabled = false;
		document.getElementById('oebl-adresse1Liv').disabled = false;
		document.getElementById('oebl-adresse2Liv').disabled = false;
		document.getElementById('oebl-adresse3Liv').disabled = false;
		document.getElementById('oebl-codePostalLiv').disabled = false;
		document.getElementById('oebl-villeLiv').disabled = false;
		document.getElementById('oebl-codePaysLiv').disabled = false;
		document.getElementById('oebl-civInterLiv').disabled = false;
		document.getElementById('oebl-nomInterLiv').disabled = false;
		document.getElementById('oebl-prenomInterLiv').disabled = false;
		document.getElementById('oebl-telInterLiv').disabled = false;
		document.getElementById('oebl-faxInterLiv').disabled = false;
		document.getElementById('oebl-emailInterLiv').disabled = false;
		document.getElementById('oebl-commentairesFin').disabled = false;
		document.getElementById('oebl-commentairesInt').disabled = false;
		document.getElementById('oebl-nbColis').disabled = false;
		document.getElementById('oebl-fraisSup').disabled = false;
		document.getElementById('oebl-numLotEntree').disabled = false;
		document.getElementById('oebl-datePeremptionEntree').disabled = false;
		document.getElementById('oebl-nbPiecesEntree').disabled = false;
		document.getElementById('oebl-qteEntree').disabled = false;
		document.getElementById('oebl-nbPiecesSortie').disabled = false;
		document.getElementById('oebl-qteSortie').disabled = false;
		document.getElementById('oebl-codePaysLiv').disabled = false;
		document.getElementById('oebl-bonLivraison').disabled = false;
		document.getElementById('oebl-commande').disabled = false;
		document.getElementById('oebl-bEnregistrer').disabled = false;
		document.getElementById('oebl-bSupprimer').disabled = false;
		
		oebl_disableAjouter(true,false);
		oebl_disableEnlever(true,false);

	} catch (e) {
    recup_erreur(e);
  }
}

function oebl_reporterQteEntree() {
	try {

		if (oebl_aCom.isSelected()) {
			document.getElementById('oebl-numLotEntree').value = oebl_aCom.getSelectedCellText('oebl-colNumLotDev');
			document.getElementById('oebl-datePeremptionEntree').value = oebl_aCom.getSelectedCellText('oebl-colDatePeremptionDev');
			document.getElementById('oebl-nbPiecesEntree').value = oebl_aCom.getSelectedCellText('oebl-colNbPiecesDev');
			document.getElementById('oebl-qteEntree').value = oebl_aCom.getSelectedCellText('oebl-colQuantiteDev');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebl_reporterQteSortie() {
	try {

		if (oebl_aBon.isSelected()) {
			document.getElementById('oebl-nbPiecesSortie').value = oebl_aBon.getSelectedCellText('oebl-colNbPiecesLiv');
			document.getElementById('oebl-qteSortie').value = oebl_aBon.getSelectedCellText('oebl-colQuantiteLiv');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebl_disableAjouter(oebl_b,oebl_arbre) {
	try {

		if (!oebl_arbre || (oebl_aCom.isSelected() && oebl_mode!="V")) {
			document.getElementById('oebl-bAjouter').disabled = oebl_b;
			document.getElementById('oebl-numLotEntree').disabled = oebl_b;
			document.getElementById('oebl-datePeremptionEntree').disabled = oebl_b;
			document.getElementById('oebl-nbPiecesEntree').disabled = oebl_b;
			document.getElementById('oebl-qteEntree').disabled = oebl_b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebl_disableEnlever(oebl_b,oebl_arbre) {
	try {

		if (!oebl_arbre || (oebl_aBon.isSelected() && oebl_mode!="V")) {
			document.getElementById('oebl-bEnlever').disabled = oebl_b;
			document.getElementById('oebl-nbPiecesSortie').disabled = oebl_b;
			document.getElementById('oebl-qteSortie').disabled = oebl_b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function oebl_nouveauBon() {
  try {

		oebl_aCom.clearParams();		
		oebl_reinitialiser();
		oebl_aCom.setParam('Fournisseur_Id', "");		
		
		if (oebl_fournisseur==1) {
			document.getElementById('oebl-groupboxFournisseur').collapsed = false;
			document.getElementById('oebl-btFournisseur').disabled = false;
			
			oebl_choisirFournisseur();
			oebl_aCom.setParam('Fournisseur_Id', oebl_fournisseurId);
		}
		else {
			document.getElementById('oebl-bVisualiser').collapsed = false;
			document.getElementById('oebl-bColisage').collapsed = false;
			document.getElementById('oebl-bEditionBP').collapsed = false;
		}
		
		if (oebl_fournisseur==0 || !isEmpty(oebl_fournisseurId)) {
			oebl_mode = "C";
			oebl_aCom.setParam('Commande_Id', commandeId);		
	
			oebl_qDefautAdresse.setParam("Commande_Id", commandeId);
			var result = oebl_qDefautAdresse.execute();
	
			var contenu = result.responseXML.documentElement;
	
			document.getElementById('oebl-modeExpedition').value = contenu.getAttribute('Mode_Expedition');
			
			oebl_clientId = contenu.getAttribute("Client_Id");
			document.getElementById('oebl-client').value = oebl_clientId;
			
			document.getElementById('oebl-denominationLiv').value = contenu.getAttribute('Denomination_Liv');
			document.getElementById('oebl-adresse1Liv').value = contenu.getAttribute('Adresse_1_Liv');
			document.getElementById('oebl-adresse2Liv').value = contenu.getAttribute('Adresse_2_Liv');
			document.getElementById('oebl-adresse3Liv').value = contenu.getAttribute('Adresse_3_Liv');
			document.getElementById('oebl-codePostalLiv').value = contenu.getAttribute('Code_Postal_Liv');
			document.getElementById('oebl-villeLiv').value = contenu.getAttribute('Ville_Liv');
			document.getElementById('oebl-codePaysLiv').value = contenu.getAttribute('Code_Pays_Liv');
	
			document.getElementById('oebl-civInterLiv').value = contenu.getAttribute("Civ_Inter_Liv");
			document.getElementById('oebl-nomInterLiv').value = contenu.getAttribute("Nom_Inter_Liv");
			document.getElementById('oebl-prenomInterLiv').value = contenu.getAttribute("Prenom_Inter_Liv");
			document.getElementById('oebl-telInterLiv').value = contenu.getAttribute("Tel_Inter_Liv");
			document.getElementById('oebl-faxInterLiv').value = contenu.getAttribute("Fax_Inter_Liv");
			document.getElementById('oebl-emailInterLiv').value = contenu.getAttribute("Email_Inter_Liv");
	
			oebl_aBon.deleteTree();
			oebl_aCom.initTree();
	
			oebl_setModifie(false);
			document.getElementById('oebl-bSupprimer').collapsed = true;
			document.getElementById('oebl-bAnnuler').collapsed = true;
			document.getElementById('oebl-bConfirmerExpedition').collapsed = true;
			oebl_debloquerChamps();

			document.getElementById('oebl-bEnregistrer').disabled = false;
			document.getElementById('oebl-bValider').disabled = true;
			document.getElementById('oebl-bVisualiser').disabled = true;
			document.getElementById('oebl-bColisage').disabled = true;
			document.getElementById('oebl-bEditionBP').disabled = true;
			document.getElementById('oebl-corpsCommande').collapsed = false;
			document.getElementById('oebl-corpsTransfert').collapsed = false;
			
			oebl_afficherNumAffaire();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebl_afficherNumAffaire() {
	try {
		
		var qGetNumAffaire = new QueryHttp("Facturation/Affaires/getNumAffaire.tmpl");
		qGetNumAffaire.setParam("Affaire_Id", affaireId);
		var result = qGetNumAffaire.execute();
		document.getElementById('oebl-affaire').value = result.responseXML.documentElement.getAttribute("Num_Entier");

	} catch (e) {
		recup_erreur(e);
	}
}


function oebl_chargerBon() {
  try {

		oebl_reinitialiser();
		oebl_aBon.setParam('Fournisseur_Id', "");
		oebl_aBon.setParam('Bon_Id', bonId);
		oebl_aCom.setParam('Bon_Id', bonId);
		
		if (oebl_fournisseur==1) {
			oebl_aCom.setParam('Fournisseur_Id', oebl_fournisseurId);

			oebl_qInfosFournisseur.setParam("Fournisseur_Id", oebl_fournisseurId);
			var result = oebl_qInfosFournisseur.execute();
	
			var contenu = result.responseXML.documentElement;
	
			document.getElementById('Fournisseur').value = contenu.getAttribute('Fournisseur_Id');
			document.getElementById('oebl-raisonSocialeFournisseur').value = contenu.getAttribute('Denomination');
			document.getElementById('oebl-adresseFournisseur').value = contenu.getAttribute('Adresse');
			document.getElementById('oebl-adresse2Fournisseur').value = contenu.getAttribute('Adresse_2');
			document.getElementById('oebl-adresse3Fournisseur').value = contenu.getAttribute('Adresse_3');
			document.getElementById('oebl-cpFournisseur').value = contenu.getAttribute('Code_Postal');
			document.getElementById('oebl-villeFournisseur').value = contenu.getAttribute('Ville');

			document.getElementById('oebl-groupboxFournisseur').collapsed = false;
		}
		else {
			document.getElementById('oebl-bVisualiser').collapsed = false;
			document.getElementById('oebl-bColisage').collapsed = false;
			document.getElementById('oebl-bEditionBP').collapsed = false;
		}
		
		oebl_mode = "M";
		oebl_qGetBonLiv.setParam("Bon_Id",bonId);
		var result = oebl_qGetBonLiv.execute();
		var contenu = result.responseXML.documentElement;

		oebl_etatBon = contenu.getAttribute("Etat");
		oebl_statutExpedition = contenu.getAttribute("Statut_Expedition");
		commandeId = contenu.getAttribute("Commande_Id");
		var annulationImpossible = (contenu.getAttribute("Annulation_Impossible")=="1");
		var etatCommande = contenu.getAttribute("Etat_Commande");
		switch (oebl_statutExpedition) {
			case "P":
				document.getElementById('oebl-statutExpedition').value = "Préparé";
			break;
			case "E":
				document.getElementById('oebl-statutExpedition').value = "Expédié";
			break;
			case "L":
				document.getElementById('oebl-statutExpedition').value = "Livré";
			break;
		}
		document.getElementById('oebl-bConfirmerExpedition').collapsed = true;

		if (oebl_etatBon=="V") {
			document.getElementById('oebl-etat').value = "Validé";
			document.getElementById('oebl-bSupprimer').collapsed = true;          
			document.getElementById('oebl-bAnnuler').collapsed = (annulationImpossible || ofa_etatAffaire=="C" || etatCommande=="C");
			document.getElementById('oebl-corpsCommande').collapsed = true;
			document.getElementById('oebl-corpsTransfert').collapsed = true;
			document.getElementById('oebl-btFournisseur').disabled = true;
			if (contenu.getAttribute("Facture")=="0") {
				document.getElementById('oebl-bAnnuler').disabled = (annulationImpossible || ofa_etatAffaire=="C" || etatCommande=="C");
			}
			if (oebl_statutExpedition=="P") {
				document.getElementById('oebl-bConfirmerExpedition').collapsed = false;
			}
		}
		else if (oebl_etatBon=="A") {
			document.getElementById('oebl-etat').value = "Annulé";
			document.getElementById('oebl-bSupprimer').collapsed = true;
			document.getElementById('oebl-bAnnuler').collapsed = true;
			document.getElementById('oebl-corpsCommande').collapsed = true;
			document.getElementById('oebl-corpsTransfert').collapsed = true;
			document.getElementById('oebl-btFournisseur').disabled = true;
		}
		else {
			document.getElementById('oebl-etat').value = "En cours";
			document.getElementById('oebl-bAnnuler').collapsed = true;
			document.getElementById('oebl-bSupprimer').collapsed = false;
			document.getElementById('oebl-corpsCommande').collapsed = false;
			document.getElementById('oebl-corpsTransfert').collapsed = false;
			document.getElementById('oebl-btFournisseur').disabled = false;
		}
		
		if (oebl_etatBon!="N" && oebl_fournisseur!="1") {
			document.getElementById('oebl-tabVersionDocument').collapsed=false;
			oebl_initVersion();
		}

		document.getElementById('oebl-modeExpedition').value = contenu.getAttribute('Mode_Expedition');
		document.getElementById('oebl-raisonSociale').value = contenu.getAttribute("Denomination");
		document.getElementById('oebl-adresseFact').value = contenu.getAttribute("Adresse_1");
		document.getElementById('oebl-adresse2Fact').value = contenu.getAttribute("Adresse_2");
		document.getElementById('oebl-adresse3Fact').value = contenu.getAttribute("Adresse_3");
		document.getElementById('oebl-codePostalFact').value = contenu.getAttribute("Code_Postal");
		document.getElementById('oebl-villeFact').value = contenu.getAttribute("Ville");
		oebl_clientId = contenu.getAttribute("Client_Id");
		document.getElementById('oebl-client').value = oebl_clientId;
		document.getElementById('oebl-labelLogin').value = contenu.getAttribute("Login_Web");
		document.getElementById('oebl-rowLoginWeb').collapsed = (contenu.getAttribute("Web")=="0");
		document.getElementById('oebl-affaire').value = contenu.getAttribute("Num_Affaire");
		
		document.getElementById('oebl-dateLiv').value = contenu.getAttribute("Date_Liv");
		document.getElementById('oebl-denominationLiv').value = contenu.getAttribute("Denomination_Liv");
		document.getElementById('oebl-adresse1Liv').value = contenu.getAttribute("Adresse_1_Liv");
		document.getElementById('oebl-adresse2Liv').value = contenu.getAttribute("Adresse_2_Liv");
		document.getElementById('oebl-adresse3Liv').value = contenu.getAttribute("Adresse_3_Liv");
		document.getElementById('oebl-codePostalLiv').value = contenu.getAttribute("Code_Postal_Liv");
		document.getElementById('oebl-villeLiv').value = contenu.getAttribute("Ville_Liv");		
		document.getElementById('oebl-codePaysLiv').value = contenu.getAttribute("Code_Pays_Liv");
		document.getElementById('oebl-commentairesFin').value = contenu.getAttribute("Commentaires_Fin");
		document.getElementById('oebl-commentairesInt').value = contenu.getAttribute("Commentaires_Int");
		document.getElementById('oebl-numero').value = contenu.getAttribute("Num_Entier");
		document.getElementById('oebl-nbColis').value = contenu.getAttribute("Nb_Colis");
		document.getElementById('oebl-fraisSup').value = contenu.getAttribute("Frais_Sup");

		document.getElementById('oebl-civInterLiv').value = contenu.getAttribute("Civ_Inter_Liv");
		document.getElementById('oebl-nomInterLiv').value = contenu.getAttribute("Nom_Inter_Liv");
		document.getElementById('oebl-prenomInterLiv').value = contenu.getAttribute("Prenom_Inter_Liv");
		document.getElementById('oebl-telInterLiv').value = contenu.getAttribute("Tel_Inter_Liv");
		document.getElementById('oebl-faxInterLiv').value = contenu.getAttribute("Fax_Inter_Liv");
		document.getElementById('oebl-emailInterLiv').value = contenu.getAttribute("Email_Inter_Liv");

		document.getElementById('oebl-creation').setAttribute("label","Bon de livraison créé le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur'));
		document.getElementById('oebl-modification').setAttribute("label","Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj'));
		document.getElementById('oebl-fiche').setAttribute("label","Bon N° "+ contenu.getAttribute('Num_Entier'));
		document.getElementById('oebl-creation').collapsed = false;
		document.getElementById('oebl-modification').collapsed = false;
		
		document.getElementById('oebl-bOuvrirCommentairesCaches').disabled = false;
		
		document.getElementById('oebl-chkBonChiffre').checked = (oebl_bonChiffre || (contenu.getAttribute("Bon_Chiffre")=="1"));
		
		oebl_aLiensColis.setParam("Bon_Id", bonId);
		oebl_aLiensColis.initTree();

		oebl_aBon.initTree();
		
		oebl_setModifie(false);
		if (oebl_etatBon!='V' && oebl_etatBon!='A') {
			oebl_aCom.setParam('Commande_Id', commandeId);		
			oebl_aCom.initTree();
			oebl_debloquerChamps();
			document.getElementById('oebl-bToutEnlever').disabled=false;
			if (oebl_fournisseur==1) {
				document.getElementById('oebl-btFournisseur').disabled = (oebl_aBon.nbLignes()>0);		
			}
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebl_editerCommentairesCaches()  {
  try {
  	var url = "chrome://opensi/content/facturation/user/affaires/popup-commentaireCache.xul?"+ cookie();
    url += "&Type_Doc=Bon_Livraison&Doc_Id="+ bonId;
  	window.openDialog(url,'','chrome,modal,centerscreen');
  
	} catch (e) {
  	recup_erreur(e);
  }
}
  	
function oebl_enregistrerBon(rafraichir) {
  try {
  	
  	var oebl_ok=false;

		var oebl_qBonLivraison;

		if (oebl_mode=="C") {
			oebl_qBonLivraison = new QueryHttp("Facturation/Affaires/creerBonLivraison.tmpl");
			oebl_qBonLivraison.setParam("Commande_Id",commandeId);
		}
		else {
			oebl_qBonLivraison = new QueryHttp("Facturation/Affaires/modifierBonLivraison.tmpl");
			oebl_qBonLivraison.setParam("Bon_Id",bonId);
		}

		var oebl_modeExpedition = document.getElementById('oebl-modeExpedition').value;
		
		var oebl_denominationLiv = document.getElementById('oebl-denominationLiv').value;
		var oebl_adresse1Liv = document.getElementById('oebl-adresse1Liv').value;
		var oebl_adresse2Liv = document.getElementById('oebl-adresse2Liv').value;
		var oebl_adresse3Liv = document.getElementById('oebl-adresse3Liv').value;
		var oebl_codePostalLiv = document.getElementById('oebl-codePostalLiv').value;
		var oebl_villeLiv = document.getElementById('oebl-villeLiv').value;
		var oebl_codePaysLiv = document.getElementById('oebl-codePaysLiv').value;

		var oebl_civInterLiv = document.getElementById('oebl-civInterLiv').value;
		var oebl_nomInterLiv = document.getElementById('oebl-nomInterLiv').value;
		var oebl_prenomInterLiv = document.getElementById('oebl-prenomInterLiv').value;
		var oebl_telInterLiv = document.getElementById('oebl-telInterLiv').value;
		var oebl_faxInterLiv = document.getElementById('oebl-faxInterLiv').value;
		var oebl_emailInterLiv = document.getElementById('oebl-emailInterLiv').value;

		var oebl_nbColis = document.getElementById('oebl-nbColis').value;
		var oebl_fraisSup = document.getElementById('oebl-fraisSup').value;
		var oebl_commentairesFin = document.getElementById('oebl-commentairesFin').value;
		var oebl_commentairesInt = document.getElementById('oebl-commentairesInt').value;

		oebl_qBonLivraison.setParam("Mode_Expedition",oebl_modeExpedition);
		oebl_qBonLivraison.setParam("Denomination_Liv",oebl_denominationLiv);
		oebl_qBonLivraison.setParam("Adresse_1_Liv",oebl_adresse1Liv);
		oebl_qBonLivraison.setParam("Adresse_2_Liv",oebl_adresse2Liv);
		oebl_qBonLivraison.setParam("Adresse_3_Liv",oebl_adresse3Liv);
		oebl_qBonLivraison.setParam("Code_Postal_Liv",oebl_codePostalLiv);
		oebl_qBonLivraison.setParam("Ville_Liv",oebl_villeLiv);
		oebl_qBonLivraison.setParam("Code_Pays_Liv",oebl_codePaysLiv);
		oebl_qBonLivraison.setParam("Civ_Inter_Liv",oebl_civInterLiv);
		oebl_qBonLivraison.setParam("Nom_Inter_Liv",oebl_nomInterLiv);
		oebl_qBonLivraison.setParam("Prenom_Inter_Liv",oebl_prenomInterLiv);
		oebl_qBonLivraison.setParam("Tel_Inter_Liv",oebl_telInterLiv);
		oebl_qBonLivraison.setParam("Fax_Inter_Liv",oebl_faxInterLiv);
		oebl_qBonLivraison.setParam("Email_Inter_Liv",oebl_emailInterLiv);
		oebl_qBonLivraison.setParam("Commentaires_Fin",oebl_commentairesFin);
		oebl_qBonLivraison.setParam("Commentaires_Int",oebl_commentairesInt);
		oebl_qBonLivraison.setParam("Nb_Colis",oebl_nbColis);
		oebl_qBonLivraison.setParam("Frais_Sup",oebl_fraisSup);
		oebl_qBonLivraison.setParam("Fournisseur_Id",oebl_fournisseurId);
		
		if (isEmpty(oebl_denominationLiv)) { showWarning("Veuillez indiquer la raison sociale du client de livraison !"); }
		else if (isEmpty(oebl_adresse1Liv)) { showWarning("Veuillez indiquer l'adresse du client de livraison !"); }
		else if (isEmpty(oebl_villeLiv)) { showWarning("Veuillez indiquer la ville du client de livraison !"); }
		else if (!isEmpty(oebl_telInterLiv) && !isPhone(oebl_telInterLiv)) { showWarning("Numéro de téléphone de livraison incorrect !"); }
		else if (!isEmpty(oebl_faxInterLiv) && !isPhone(oebl_faxInterLiv)) { showWarning("Numéro de fax de livraison incorrect !"); }
		else if (!isEmpty(oebl_emailInterLiv) && !isEmail(oebl_emailInterLiv)) { showWarning("Adresse e-mail de livraison incorrecte !"); }
		else if (!isEmpty(oebl_nbColis) && !isPositiveOrNullInteger(oebl_nbColis)) { showWarning("Nombre de colis incorrect !"); }
		else if (isEmpty(oebl_fraisSup) || !isPositiveOrNull(oebl_fraisSup)) { showWarning("Frais de port supplémentaires incorrects !"); }
		else {
			var result = oebl_qBonLivraison.execute();

			var contenu = result.responseXML.documentElement;

			if (oebl_mode=="C") {
				bonId = contenu.getAttribute("Bon_Id");
				if (rafraichir) { oebl_chargerBon(); }
			}
			

			oebl_setModifie(false);
			oebl_ok=true;
		}
		return oebl_ok;

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebl_supprimerBon() {
  try {

		if (window.confirm("Confirmez-vous la suppression de ce bon de livraison ?")) {
			
			oebl_qSupBL.setParam("Bon_Id", bonId);
			oebl_qSupBL.execute();
			
			showMessage("Le bon de livraison a été supprimé avec succès !");
			
			retourFicheAffaire();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebl_validerExpedition() {
  try {

		oebl_qConfExpe.setParam("Bon_Id", bonId);
		oebl_qConfExpe.execute();
		
		oebl_chargerBon();

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebl_toutTransferer() {
  try {
  	var ok = true;
		if (oebl_mode=="C") {
			ok = oebl_enregistrerBon(true);
		}
		if (ok) {
			oebl_qAjouterToutBon.setParam('Fournisseur_Id', oebl_fournisseurId);	
			oebl_qAjouterToutBon.setParam("Bon_Id", bonId);
			oebl_qAjouterToutBon.setParam("Commande_Id", commandeId);
			var result = oebl_qAjouterToutBon.execute();
			if (result.responseXML.documentElement.getAttribute("erreur")=="true") { showWarning("Certains articles n'ont pas pu être transférés car leur numéro de lot est bloqué !"); }
	
			oebl_aCom.initTree();
			oebl_aBon.initTree();
			if (oebl_fournisseur==1) {
				document.getElementById('oebl-btFournisseur').disabled = oebl_aBon.nbLignes>0;		
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}

function oebl_toutTransfererDispo() {
  try {
  	var ok = true;
		if (oebl_mode=="C") {
			ok = oebl_enregistrerBon(true);
		}
		if (ok) {
			oebl_qAjouterToutBonDispo.setParam("Bon_Id", bonId);
			oebl_qAjouterToutBonDispo.setParam("Commande_Id", commandeId);
			var result = oebl_qAjouterToutBonDispo.execute();
			if (result.responseXML.documentElement.getAttribute("erreur")=="true") { showWarning("Certains articles n'ont pas pu être transférés car leur numéro de lot est bloqué !"); }
	
			oebl_aCom.initTree();
			oebl_aBon.initTree();
			if (oebl_fournisseur==1) {
				document.getElementById('oebl-btFournisseur').disabled = oebl_aBon.nbLignes>0;		
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}

function oebl_toutEnlever() {
  try {

		oebl_qEnleverToutBon.setParam("Bon_Id", bonId);
		oebl_qEnleverToutBon.execute();

		oebl_aCom.initTree();
		oebl_aBon.initTree();
		if (oebl_fournisseur==1) {
			document.getElementById('oebl-btFournisseur').disabled = oebl_aBon.nbLignes>0;		
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebl_ajouter() {
  try {

		if (oebl_aCom.isSelected()) {
		
			var oebl_ligne = oebl_aCom.getSelectedCellText('oebl-colLigneDev');
			var oebl_qteInit = oebl_aCom.getSelectedCellText('oebl-colQuantiteDev');
			var oebl_quantite = document.getElementById('oebl-qteEntree').value;
			
			var oebl_datePeremption = document.getElementById('oebl-datePeremptionEntree').value;
			var oebl_numLot = document.getElementById('oebl-numLotEntree').value;
			var oebl_nbPiecesInit = oebl_aCom.getSelectedCellText('oebl-colNbPiecesDev');
			if (isEmpty(oebl_nbPiecesInit)) { oebl_nbPiecesInit = 0; }
			var oebl_nbPieces = document.getElementById('oebl-nbPiecesEntree').value;
			
			oebl_qCheckNumLot.setParam("Num_Lot", oebl_numLot);
			var result = oebl_qCheckNumLot.execute();
			if (result.responseXML.documentElement.getAttribute("blocage")=="true") { showWarning("Impossible de transférer cet article car le numéro de lot est bloqué !"); }
			
			else if (isEmpty(oebl_quantite)) { showWarning("Veuillez entrer une quantité à transférer !"); }
			else if (!checkQte(oebl_quantite)) { showWarning("Quantité incorrecte !"); }
			else if (!isEmpty(oebl_nbPieces) && !isPositiveInteger(oebl_nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (!isEmpty(oebl_datePeremption) && !isDate(oebl_datePeremption)) { showWarning("Date de péremption incorrecte !");	}
			else {

				var oebl_continuer = true;

				if (parseFloat(oebl_qteInit)-parseFloat(oebl_quantite)<0) {
					oebl_continuer = window.confirm("La quantité à transférer dépasse la quantité restant à livrer !\n\nVoulez-vous vraiment livrer plus que la quantité commandée ?");
				}
				
				if (!isEmpty(oebl_nbPieces)) {
					if (parseFloat(oebl_nbPiecesInit)-parseFloat(oebl_nbPieces)<0) {
						oebl_continuer = window.confirm("Le nb de pièces à transférer dépasse le nb de pièces restant à livrer !\n\nVoulez-vous vraiment livrer plus que le nb de pièces commandé ?");
					}
				}

				if (oebl_continuer) {
					var ok = true;
					if (oebl_mode=="C") {
						ok = oebl_enregistrerBon(true);
					}
					
					if (ok) {
						oebl_qAjouterArticles.setParam("Bon_Id", bonId);
						oebl_qAjouterArticles.setParam("Ligne", oebl_ligne);
						oebl_qAjouterArticles.setParam("Quantite", oebl_quantite);
						oebl_qAjouterArticles.setParam("Num_Lot", oebl_numLot);
						oebl_qAjouterArticles.setParam("Nb_Pieces", oebl_nbPieces);
						oebl_qAjouterArticles.setParam("Date_Peremption", (!isEmpty(oebl_datePeremption)?prepareDateJava(oebl_datePeremption):""));
						oebl_qAjouterArticles.execute();
						
						oebl_aCom.initTree();
						oebl_aBon.initTree();
						if (oebl_fournisseur==1) {
							document.getElementById('oebl-btFournisseur').disabled = oebl_aBon.nbLignes>0;		
						}
			
						oebl_disableAjouter(true,false);
					}
				}
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebl_enlever() {
  try {

		if (oebl_aBon.isSelected()) {
			var oebl_ligneId = oebl_aBon.getSelectedCellText('oebl-colLigneLiv');
			var oebl_qteInit = oebl_aBon.getSelectedCellText('oebl-colQuantiteLiv');
			var oebl_quantite = document.getElementById('oebl-qteSortie').value;
			var oebl_nbPiecesInit = oebl_aBon.getSelectedCellText('oebl-colNbPiecesLiv');
			if (isEmpty(oebl_nbPiecesInit)) { oebl_nbPiecesInit = 0; }
			var oebl_nbPieces = document.getElementById('oebl-nbPiecesSortie').value;

			if (isEmpty(oebl_quantite)) {
				showWarning("Veuillez entrer une quantité à enlever !");
			}
			else if (!checkQte(oebl_quantite)) {
				showWarning("Quantité incorrecte !");
			}
			else if (parseFloat(oebl_qteInit)-parseFloat(oebl_quantite)<0) {
				showWarning("La quantité à enlever ne peut dépasser la quantité présente dans le bon de livraison !");
			}
			else if (!isEmpty(oebl_nbPieces) && !isPositiveInteger(oebl_nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (!isEmpty(oebl_nbPieces) && (parseFloat(oebl_nbPiecesInit)-parseFloat(oebl_nbPieces)<0)) {
				showWarning("Le nb de pièces à enlever ne peut dépasser le nb de pièces présent dans le bon de livraison !");
			}
			else {
				oebl_qEnleverArticles.setParam("Bon_Id", bonId);
				oebl_qEnleverArticles.setParam("Ligne_Id", oebl_ligneId);
				oebl_qEnleverArticles.setParam("QteInit", oebl_qteInit);
				oebl_qEnleverArticles.setParam("Quantite", oebl_quantite);
				oebl_qEnleverArticles.setParam("Nb_Pieces", oebl_nbPieces);
				oebl_qEnleverArticles.execute();

				oebl_aCom.initTree();
				oebl_aBon.initTree();
				if (oebl_fournisseur==1) {
					document.getElementById('oebl-btFournisseur').disabled = oebl_aBon.nbLignes>0;		
				}
				
				oebl_disableEnlever(true,false);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebl_demandeEnregistrement() {
  try {

		if (oebl_modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées au bon de livraison ?")) {
				oebl_enregistrerBon(false);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebl_setModifie(oebl_m) {
  try {
  	oebl_modifie = oebl_m;
		if (oebl_m) {
			document.getElementById('oebl-tabBon').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('oebl-bValider').disabled = true;
			document.getElementById('oebl-bVisualiser').disabled = true;
			document.getElementById('oebl-bColisage').disabled = true;
			document.getElementById('oebl-bEditionBP').disabled = true;
		}
		else {
			document.getElementById('oebl-tabBon').setAttribute('image', null);
			document.getElementById('oebl-bValider').disabled = (oebl_etatBon=='V');
			document.getElementById('oebl-bValider').collapsed = (oebl_etatBon=='V' || oebl_etatBon=='A');
			document.getElementById('oebl-bVisualiser').disabled = false;
			document.getElementById('oebl-bVisualiser').collapsed = (oebl_etatBon=='N');
			document.getElementById('oebl-bColisage').disabled = false;
			//document.getElementById('oebl-bColisage').collapsed = (oebl_etatBon=='N');
			document.getElementById('oebl-bEditionBP').disabled = false;
			document.getElementById('oebl-bEditionBP').collapsed = (oebl_mode=='C' || oebl_fournisseur==1);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebl_changerTypeEdition(typeEdition) {
  try {
    oebl_typeEdition=typeEdition;
    document.getElementById('oebl-boxLangue').collapsed = (oebl_fournisseur==1 || oebl_typeEdition!="BL");
    if (oebl_fournisseur!=1 && oebl_typeEdition=="BL") {
    	var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
			qLangueDefaut.setParam("Type_Doc", "Bon_Livraison");
			qLangueDefaut.setParam("Doc_Id", bonId);
			var result = qLangueDefaut.execute();
			oebl_langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
			oebl_aLangues.setParam("Selection", oebl_langueDefaut);
			oebl_aLangues.initTree(oebl_initLangue);
    } else {
    	oebl_editerBon();
    }
  } catch (e) {
    recup_erreur(e);
  }
}


function oebl_initLangue() {
	try {
		document.getElementById('oebl-langueDefaut').value = oebl_langueDefaut;
		oebl_editerBon();
	} catch (e) {
		recup_erreur(e);
	}
}


function oebl_editerBon() {
	try {
		document.getElementById("bRetourBL").collapsed = false;
		document.getElementById("oebl-deckBonLivraison").selectedIndex = 1;
		document.getElementById('oebl-barEdition').collapsed=(oebl_fournisseur==1 || oebl_typeEdition!="BL");
		
		var oebl_qGenPdf = new QueryHttp("Facturation/Affaires/pdfBonLivraison.tmpl");
		oebl_qGenPdf.setParam('Bon_Id', bonId);
	  oebl_qGenPdf.setParam("Type",oebl_fournisseur==1?"LF":oebl_typeEdition);
	  if (oebl_fournisseur!=1 && oebl_typeEdition=="BL") {
	  	var langue = document.getElementById('oebl-langueDefaut').value;
	  	oebl_qGenPdf.setParam('Langue', langue);
	  }
		oebl_qGenPdf.setParam('Chiffre', document.getElementById('oebl-chkBonChiffre').checked?"1":"0");
		var result = oebl_qGenPdf.execute();
		var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
				
		document.getElementById('oebl-pdfBonLivraison').setAttribute("src", page);
	} catch (e) {
		recup_erreur(e);
	}
}

function oebl_validerBon() {
  try {

		if (oebl_aBon.nbLignes()<=0) {
			showWarning("Le bon de livraison ne contient aucune ligne !");
		}
		else if (window.confirm("Confirmez-vous la validation du bon de livraison ?\n(Attention le bon de livraison validé ne pourra plus être modifié !)")) {
			
			var oebl_solder = (document.getElementById('oebl-solder').checked?"1":"0");
			
			oebl_qValider.setParam('Client_Id', oebl_clientId);
			oebl_qValider.setParam('Bon_Id', bonId);
			oebl_qValider.setParam('Commande_Id', commandeId);
			oebl_qValider.setParam('Solder', oebl_solder);
			oebl_qValider.setParam('Fournisseur_Id', oebl_fournisseurId);
			var result = oebl_qValider.execute();
			
			if (result.responseXML.documentElement.getAttribute('code_erreur')=="1") {
				showWarning("Impossible de valider le bon de livraison car le client est bloqué !");
			}
			else {
				oebl_changerTypeEdition('BL');
				//MODIFIER setTimeout(oebl_chargerBon(),'1000');
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebl_annulerBon() {
  try {
	
		if (window.confirm("Confirmez-vous l'annulation du bon de livraison ?")) {
	
			oebl_qAnnuler.setParam('Bon_Id', bonId);
			oebl_qAnnuler.setParam('Commande_Id', commandeId);
			oebl_qAnnuler.execute();
			
			showMessage("Le bon de livraison a été annulé !");
			
			oebl_chargerBon();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebl_rechercherAdrLiv() {
  try {
  	
  	oebl_currentCodePaysLiv = document.getElementById('oebl-codePaysLiv').value;

		var oebl_url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(oebl_clientId);
    window.openDialog(oebl_url,'','chrome,modal,centerscreen', oebl_reporterAdrLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebl_reporterAdrLiv(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact_fact, contact_liv) {
  try {
  	
		oebl_qGetAssujetti.setParam("Commande_Id", commandeId);
		var result = oebl_qGetAssujetti.execute();
		var content = result.responseXML.documentElement;
	  var oebl_assujettiTVA=(content.getAttribute("Assujetti_TVA")=="1");
  	
  	if (oebl_currentCodePaysLiv!=code_pays && !oebl_assujettiTVA) {
  		showWarning("L'adresse choisie doit être dans le même pays que le pays de livraison actuel !");
  	} else {	
			document.getElementById('oebl-denominationLiv').value = nom;
			document.getElementById('oebl-adresse1Liv').value = adr1;		
			document.getElementById('oebl-adresse2Liv').value = adr2;
			document.getElementById('oebl-adresse3Liv').value = adr3;
			document.getElementById('oebl-codePostalLiv').value = cp;
			document.getElementById('oebl-villeLiv').value = ville;
		  document.getElementById('oebl-codePaysLiv').value = code_pays;
			
			if (!isEmpty(contact_liv)) {
		  	oebl_qInterLiv.setParam("Num_Inter", contact_liv);
		  	var result = oebl_qInterLiv.execute();
		  	var content = result.responseXML.documentElement;
		  	oebl_reporterInterLiv(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
		  } else {		
				oebl_setModifie(true);
		  }
  	}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebl_rechercherInterlocuteurLiv() {
  try {

		var oebl_url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(oebl_clientId);
    window.openDialog(oebl_url,'','chrome,modal,centerscreen',oebl_reporterInterLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebl_reporterInterLiv(civ, civCourte,nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oebl-civInterLiv').value = civ;
		document.getElementById('oebl-nomInterLiv').value = nom;		
		document.getElementById('oebl-prenomInterLiv').value = prenom;
		document.getElementById('oebl-telInterLiv').value = tel;
		document.getElementById('oebl-faxInterLiv').value = fax;
		document.getElementById('oebl-emailInterLiv').value = email;
		
		oebl_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}

function oebl_choisirMentions() {
  try {
  	
  	var oebl_ok = true;
  	
  	if (oebl_mode=="C") {
			oebl_ok = oebl_enregistrerBon(true);
		}

		if (oebl_ok) {
			var oebl_url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Bon_Livraison&Doc_Id="+ bonId;
	    window.openDialog(oebl_url,'','chrome,modal,centerscreen',oebl_setModifie);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebl_colisage() {
  try {
		oecol_init();
		document.getElementById("oecol-deckColisageEtiquettes").selectedIndex = 0;
		document.getElementById('bRetourBL').collapsed = false;
		document.getElementById("deck").selectedIndex = 4;

  } catch (e) {
    recup_erreur(e);
  }
}


function oebl_initVersion() {
	try {
		
		oebl_aVersion.setParam("Type_Document", "Bon_Livraison");
		oebl_aVersion.setParam("Document_Id", bonId);
		oebl_aVersion.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}

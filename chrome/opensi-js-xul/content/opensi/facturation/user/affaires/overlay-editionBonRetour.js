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

var oebrc_aBonRetour = new Arbre('Facturation/Affaires/liste-articlesBonRetour.tmpl', 'oebrc-bonRetour');
var oebrc_aBonLivraison = new Arbre('Facturation/Affaires/liste-articlesARetourner.tmpl', 'oebrc-bonLivraison');
var oebrc_aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","oebrc-listeVersion");
var oebrc_aLangues = new Arbre("Config/GetRDF/liste-langues.tmpl", "oebrc-langueDefaut");

var oebrc_mode;
var oebrc_clientId;
var oebrc_etatBon;
var oebrc_currentCodePaysLiv;
var oebrc_langueDefaut;

var oebrc_modifie = false;

function oebrc_init() {
  try {
  	
  	var oebrc_qProduitsFrais = new QueryHttp('Config/gestion_commerciale/preferences/getParam.tmpl');
		var oebrc_result = oebrc_qProduitsFrais.execute();
		var oebrc_prodFrais = (oebrc_result.responseXML.documentElement.getAttribute("Produit_Frais")=="1");
		document.getElementById('oebrc-prodFraisEntree').collapsed = !oebrc_prodFrais;
		document.getElementById('oebrc-prodFraisSortie').collapsed = !oebrc_prodFrais;
		document.getElementById('oebrc-colNumLotDev').collapsed = !oebrc_prodFrais;
		document.getElementById('oebrc-colNumLotDev').setAttribute('ignoreincolumnpicker', !oebrc_prodFrais);
		document.getElementById('oebrc-colDatePeremptionDev').collapsed = !oebrc_prodFrais;
		document.getElementById('oebrc-colDatePeremptionDev').setAttribute('ignoreincolumnpicker', !oebrc_prodFrais);
		document.getElementById('oebrc-colNbPiecesDev').collapsed = !oebrc_prodFrais;
		document.getElementById('oebrc-colNbPiecesDev').setAttribute('ignoreincolumnpicker', !oebrc_prodFrais);
		document.getElementById('oebrc-colNumLotLiv').collapsed = !oebrc_prodFrais;
		document.getElementById('oebrc-colNumLotLiv').setAttribute('ignoreincolumnpicker', !oebrc_prodFrais);
		document.getElementById('oebrc-colDatePeremptionLiv').collapsed = !oebrc_prodFrais;
		document.getElementById('oebrc-colDatePeremptionLiv').setAttribute('ignoreincolumnpicker', !oebrc_prodFrais);
		document.getElementById('oebrc-colNbPiecesLiv').collapsed = !oebrc_prodFrais;
		document.getElementById('oebrc-colNbPiecesLiv').setAttribute('ignoreincolumnpicker', !oebrc_prodFrais);
		var oebrc_aPaysLiv = new Arbre("Facturation/Affaires/liste-pays.tmpl", "oebrc-codePaysLiv");
		oebrc_aPaysLiv.initTree(oebrc_initPaysLiv);
		
  } catch (e) {
  	recup_erreur(e);
  }
}

function oebrc_initPaysLiv() {
	try {
		document.getElementById('oebrc-codePaysLiv').value = "FR";
	} catch (e) {
    recup_erreur(e);
  }
}


function oebrc_reinitialiser() {
	try {
		
		oebrc_mode = "C";
		oebrc_etatBon = "N";
		oebrc_clientId = "";
		document.getElementById('oebrc-deckBonRetour').selectedIndex = 0;
		document.getElementById('oebrc-tabBoxBon').selectedIndex = 0;
		document.getElementById('oebrc-client').value = "";
		document.getElementById('oebrc-labelLogin').value = "";
		document.getElementById('oebrc-rowLoginWeb').collapsed = true;
		document.getElementById('oebrc-raisonSociale').value = "";
		document.getElementById('oebrc-adresseFact').value = "";
		document.getElementById('oebrc-adresse2Fact').value = "";
		document.getElementById('oebrc-adresse3Fact').value = "";
		document.getElementById('oebrc-codePostalFact').value = "";
		document.getElementById('oebrc-villeFact').value = "";
		document.getElementById('oebrc-affaire').value = "";
		document.getElementById('oebrc-labelClientLiv').value = "";
		document.getElementById('oebrc-denominationLiv').value = "";
		document.getElementById('oebrc-adresse1Liv').value = "";
		document.getElementById('oebrc-adresse2Liv').value = "";
		document.getElementById('oebrc-adresse3Liv').value = "";
		document.getElementById('oebrc-codePostalLiv').value = "";
		document.getElementById('oebrc-villeLiv').value = "";
		document.getElementById('oebrc-codePaysLiv').value = "FR";
		document.getElementById('oebrc-civInterLiv').value = "0";
		document.getElementById('oebrc-nomInterLiv').value = "";
		document.getElementById('oebrc-prenomInterLiv').value = "";
		document.getElementById('oebrc-telInterLiv').value = "";
		document.getElementById('oebrc-faxInterLiv').value = "";
		document.getElementById('oebrc-emailInterLiv').value = "";
		document.getElementById('oebrc-tabBon').setAttribute('image', null);
		
		document.getElementById('oebrc-tabVersionDocument').collapsed=true;
		oebrc_aVersion.deleteTree();
		
		document.getElementById('oebrc-tabBoxAdresses').selectedIndex = 1;

		document.getElementById('oebrc-numero').value = "";
		document.getElementById('oebrc-dateRetour').value = "";
		document.getElementById('oebrc-etat').value = "";
		document.getElementById('oebrc-dateReception').value = "";
		document.getElementById('oebrc-commentairesFin').value = "";
		document.getElementById('oebrc-commentairesInt').value = "";
		document.getElementById('oebrc-nbPiecesEntree').value = "";
		document.getElementById('oebrc-qteEntree').value = "";
		document.getElementById('oebrc-nbPiecesSortie').value = "";
		document.getElementById('oebrc-qteSortie').value = "";
		document.getElementById('oebrc-creation').value = "";
		document.getElementById('oebrc-modification').value = "";
		document.getElementById('oebrc-fiche').value = "";
		oebrc_modifie = false;
		
		document.getElementById('oebrc-chercherAdrLiv').disabled = true;
		document.getElementById('oebrc-chercherInterLiv').disabled = true;
		document.getElementById('oebrc-bChoisirMentions').disabled = true;
		document.getElementById('oebrc-bAjouter').disabled = true;
		document.getElementById('oebrc-bToutAjouter').disabled = true;
		document.getElementById('oebrc-bEnlever').disabled = true;
		document.getElementById('oebrc-bToutEnlever').disabled = true;
		document.getElementById('oebrc-bEnregistrer').disabled = true;
		document.getElementById('oebrc-bValiderBR').disabled = true;
		document.getElementById('oebrc-bValiderReception').disabled = true;
		document.getElementById('oebrc-bAnnuler').disabled = true;
		document.getElementById('oebrc-bSupprimer').disabled = true;
		document.getElementById('oebrc-bVisualiser').disabled = true;

		document.getElementById('oebrc-denominationLiv').disabled = true;
		document.getElementById('oebrc-adresse1Liv').disabled = true;
		document.getElementById('oebrc-adresse2Liv').disabled = true;
		document.getElementById('oebrc-adresse3Liv').disabled = true;
		document.getElementById('oebrc-codePostalLiv').disabled = true;
		document.getElementById('oebrc-villeLiv').disabled = true;
		document.getElementById('oebrc-codePaysLiv').disabled = true;
		document.getElementById('oebrc-civInterLiv').disabled = true;
		document.getElementById('oebrc-nomInterLiv').disabled = true;
		document.getElementById('oebrc-prenomInterLiv').disabled = true;
		document.getElementById('oebrc-telInterLiv').disabled = true;
		document.getElementById('oebrc-faxInterLiv').disabled = true;
		document.getElementById('oebrc-emailInterLiv').disabled = true;
		document.getElementById('oebrc-dateReception').disabled = true;
		document.getElementById('oebrc-commentairesFin').disabled = true;
		document.getElementById('oebrc-commentairesInt').disabled = true;
		document.getElementById('oebrc-nbPiecesEntree').disabled = true;
		document.getElementById('oebrc-qteEntree').disabled = true;
		document.getElementById('oebrc-nbPiecesSortie').disabled = true;
		document.getElementById('oebrc-qteSortie').disabled = true;
		document.getElementById('oebrc-codePaysLiv').disabled = true;
		document.getElementById('oebrc-bonLivraison').disabled = true;
		document.getElementById('oebrc-bonRetour').disabled = true;

		document.getElementById('oebrc-bOuvrirCommentairesCaches').disabled = true;

		document.getElementById('oebrc-bVisualiser').collapsed = true;
		document.getElementById('oebrc-bValiderBR').collapsed = true;
		document.getElementById('oebrc-bValiderReception').collapsed = true;


		oebrc_aBonRetour.deleteTree();
		oebrc_aBonLivraison.deleteTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function oebrc_debloquerChamps() {
	try {

		document.getElementById('oebrc-chercherAdrLiv').disabled = false;
		document.getElementById('oebrc-chercherInterLiv').disabled = false;
		document.getElementById('oebrc-bChoisirMentions').disabled = false;
		document.getElementById('oebrc-bAjouter').disabled = false;
		document.getElementById('oebrc-bToutAjouter').disabled = false;
		document.getElementById('oebrc-bEnlever').disabled = false;

		document.getElementById('oebrc-dateReception').disabled = false;
		document.getElementById('oebrc-denominationLiv').disabled = false;
		document.getElementById('oebrc-adresse1Liv').disabled = false;
		document.getElementById('oebrc-adresse2Liv').disabled = false;
		document.getElementById('oebrc-adresse3Liv').disabled = false;
		document.getElementById('oebrc-codePostalLiv').disabled = false;
		document.getElementById('oebrc-villeLiv').disabled = false;
		document.getElementById('oebrc-codePaysLiv').disabled = false;
		document.getElementById('oebrc-civInterLiv').disabled = false;
		document.getElementById('oebrc-nomInterLiv').disabled = false;
		document.getElementById('oebrc-prenomInterLiv').disabled = false;
		document.getElementById('oebrc-telInterLiv').disabled = false;
		document.getElementById('oebrc-faxInterLiv').disabled = false;
		document.getElementById('oebrc-emailInterLiv').disabled = false;
		document.getElementById('oebrc-commentairesFin').disabled = false;
		document.getElementById('oebrc-commentairesInt').disabled = false;
		document.getElementById('oebrc-nbPiecesEntree').disabled = false;
		document.getElementById('oebrc-qteEntree').disabled = false;
		document.getElementById('oebrc-nbPiecesSortie').disabled = false;
		document.getElementById('oebrc-qteSortie').disabled = false;
		document.getElementById('oebrc-codePaysLiv').disabled = false;
		document.getElementById('oebrc-bonLivraison').disabled = false;
		document.getElementById('oebrc-bonRetour').disabled = false;
		document.getElementById('oebrc-bEnregistrer').disabled = false;
		document.getElementById('oebrc-bSupprimer').disabled = false;
		document.getElementById('oebrc-bValiderReception').disabled = false;
		
		oebrc_disableAjouter(true,false);
		oebrc_disableEnlever(true,false);

	} catch (e) {
    recup_erreur(e);
  }
}

function oebrc_reporterQteEntree() {
	try {

		if (oebrc_aBonLivraison.isSelected()) {
			var i = oebrc_aBonLivraison.getCurrentIndex();
			document.getElementById('oebrc-nbPiecesEntree').value = oebrc_aBonLivraison.getCellText(i, 'oebrc-colNbPiecesDev');
			document.getElementById('oebrc-qteEntree').value = oebrc_aBonLivraison.getCellText(i, 'oebrc-colQuantiteDev');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebrc_reporterQteSortie() {
	try {

		if (oebrc_aBonRetour.isSelected()) {
			var i = oebrc_aBonRetour.getCurrentIndex();
			document.getElementById('oebrc-nbPiecesSortie').value = oebrc_aBonRetour.getCellText(i, 'oebrc-colNbPiecesLiv');
			document.getElementById('oebrc-qteSortie').value = oebrc_aBonRetour.getCellText(i, 'oebrc-colQuantiteLiv');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebrc_disableAjouter(oebrc_b,oebrc_arbre) {
	try {

		if (!oebrc_arbre || (oebrc_aBonLivraison.isSelected() && oebrc_mode!="V")) {
			document.getElementById('oebrc-bAjouter').disabled = oebrc_b;
			document.getElementById('oebrc-nbPiecesEntree').disabled = oebrc_b;
			document.getElementById('oebrc-qteEntree').disabled = oebrc_b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebrc_disableEnlever(oebrc_b,oebrc_arbre) {
	try {

		if (!oebrc_arbre || (oebrc_aBonRetour.isSelected() && oebrc_mode!="V")) {
			document.getElementById('oebrc-bEnlever').disabled = oebrc_b;
			document.getElementById('oebrc-nbPiecesSortie').disabled = oebrc_b;
			document.getElementById('oebrc-qteSortie').disabled = oebrc_b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function oebrc_nouveauBon() {
  try {

		oebrc_aBonLivraison.clearParams();		
		oebrc_reinitialiser();

		oebrc_mode = "C";

		var oebrc_qDefautAdresse = new QueryHttp('Facturation/Affaires/getAdresseBL.tmpl');
		oebrc_qDefautAdresse.setParam('Bon_Id', bonId);
		var result = oebrc_qDefautAdresse.execute();

		var contenu = result.responseXML.documentElement;

		commandeId = contenu.getAttribute('Commande_Id');
		oebrc_clientId = contenu.getAttribute('Client_Id');
		document.getElementById('oebrc-client').value = oebrc_clientId;
		document.getElementById('oebrc-denominationLiv').value = contenu.getAttribute('Denomination_Liv');
		document.getElementById('oebrc-adresse1Liv').value = contenu.getAttribute('Adresse_1_Liv');
		document.getElementById('oebrc-adresse2Liv').value = contenu.getAttribute('Adresse_2_Liv');
		document.getElementById('oebrc-adresse3Liv').value = contenu.getAttribute('Adresse_3_Liv');
		document.getElementById('oebrc-codePostalLiv').value = contenu.getAttribute('Code_Postal_Liv');
		document.getElementById('oebrc-villeLiv').value = contenu.getAttribute('Ville_Liv');
		document.getElementById('oebrc-codePaysLiv').value = contenu.getAttribute('Code_Pays_Liv');

		document.getElementById('oebrc-civInterLiv').value = contenu.getAttribute("Civ_Inter_Liv");
		document.getElementById('oebrc-nomInterLiv').value = contenu.getAttribute("Nom_Inter_Liv");
		document.getElementById('oebrc-prenomInterLiv').value = contenu.getAttribute("Prenom_Inter_Liv");
		document.getElementById('oebrc-telInterLiv').value = contenu.getAttribute("Tel_Inter_Liv");
		document.getElementById('oebrc-faxInterLiv').value = contenu.getAttribute("Fax_Inter_Liv");
		document.getElementById('oebrc-emailInterLiv').value = contenu.getAttribute("Email_Inter_Liv");

		oebrc_aBonRetour.deleteTree();
		oebrc_aBonLivraison.setParam("BL_Id", bonId);
		oebrc_aBonLivraison.initTree();
		document.getElementById('oebrc-bVisualiser').collapsed = false;

		oebrc_setModifie(false);
		document.getElementById('oebrc-bSupprimer').collapsed = true;
		document.getElementById('oebrc-bAnnuler').collapsed = true;
		oebrc_debloquerChamps();

		document.getElementById('oebrc-bEnregistrer').disabled = false;
		document.getElementById('oebrc-bValiderBR').disabled = true;
		document.getElementById('oebrc-bVisualiser').disabled = true;
		document.getElementById('oebrc-corpsBL').collapsed = false;
		document.getElementById('oebrc-corpsTransfert').collapsed = false;
		
		oebrc_afficherNumAffaire();

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebrc_afficherNumAffaire() {
	try {
		
		var qGetNumAffaire = new QueryHttp("Facturation/Affaires/getNumAffaire.tmpl");
		qGetNumAffaire.setParam("Affaire_Id", affaireId);
		var result = qGetNumAffaire.execute();
		document.getElementById('oebrc-affaire').value = result.responseXML.documentElement.getAttribute("Num_Entier");

	} catch (e) {
		recup_erreur(e);
	}
}


function oebrc_chargerBon() {
  try {

		oebrc_reinitialiser();
  	oebrc_aBonLivraison.setParam('Bon_Id', bonRetourId);
		oebrc_aBonRetour.setParam('Bon_Id', bonRetourId);

		document.getElementById('oebrc-bVisualiser').collapsed = false;

		oebrc_mode = "M";
		var oebrc_qGetBonRetour = new QueryHttp('Facturation/Affaires/getBonRetour.tmpl');
		oebrc_qGetBonRetour.setParam("Bon_Id", bonRetourId);
		var result = oebrc_qGetBonRetour.execute();
		var contenu = result.responseXML.documentElement;

		oebrc_etatBon = contenu.getAttribute("Etat");
		commandeId = contenu.getAttribute("Commande_Id");
		bonId = contenu.getAttribute("BL_Id");
		
		document.getElementById('oebrc-bAnnuler').disabled = (ofa_etatAffaire=="C" || (oebrc_etatBon!="E" && oebrc_etatBon!="V"));

		if (oebrc_etatBon=="V" || oebrc_etatBon=="E") {
			document.getElementById('oebrc-etat').value = (oebrc_etatBon=="V"?"Validé":"En attente");
			document.getElementById('oebrc-bSupprimer').collapsed = true;          
			document.getElementById('oebrc-bAnnuler').collapsed = (ofa_etatAffaire=="C");
			document.getElementById('oebrc-corpsBL').collapsed = true;
			document.getElementById('oebrc-corpsTransfert').collapsed = true;
		}
		else if (oebrc_etatBon=="A") {
			document.getElementById('oebrc-etat').value = "Annulé";
			document.getElementById('oebrc-bSupprimer').collapsed = true;
			document.getElementById('oebrc-bAnnuler').collapsed = true;
			document.getElementById('oebrc-corpsBL').collapsed = true;
			document.getElementById('oebrc-corpsTransfert').collapsed = true;
		}
		else {
			document.getElementById('oebrc-etat').value = "En cours";
			document.getElementById('oebrc-bAnnuler').collapsed = true;
			document.getElementById('oebrc-bSupprimer').collapsed = false;
			document.getElementById('oebrc-corpsBL').collapsed = false;
			document.getElementById('oebrc-corpsTransfert').collapsed = false;
		}
		
		document.getElementById('oebrc-bVisualiser').collapsed = (oebrc_etatBon=='N');
		document.getElementById('oebrc-bValiderBR').collapsed = (oebrc_etatBon!='N');
		document.getElementById('oebrc-bValiderReception').collapsed = (oebrc_etatBon!='E');

		document.getElementById('oebrc-dateReception').value = contenu.getAttribute("Date_Retour");
		document.getElementById('oebrc-raisonSociale').value = contenu.getAttribute("Denomination");
		document.getElementById('oebrc-adresseFact').value = contenu.getAttribute("Adresse_1");
		document.getElementById('oebrc-adresse2Fact').value = contenu.getAttribute("Adresse_2");
		document.getElementById('oebrc-adresse3Fact').value = contenu.getAttribute("Adresse_3");
		document.getElementById('oebrc-codePostalFact').value = contenu.getAttribute("Code_Postal");
		document.getElementById('oebrc-villeFact').value = contenu.getAttribute("Ville");
		oebrc_clientId = contenu.getAttribute("Client_Id");
		document.getElementById('oebrc-client').value = oebrc_clientId;
		document.getElementById('oebrc-labelLogin').value = contenu.getAttribute("Login_Web");
		document.getElementById('oebrc-rowLoginWeb').collapsed = (contenu.getAttribute("Web")=="0");
		document.getElementById('oebrc-affaire').value = contenu.getAttribute("Num_Affaire");
		
		document.getElementById('oebrc-dateRetour').value = contenu.getAttribute("Date_Bon");
		document.getElementById('oebrc-denominationLiv').value = contenu.getAttribute("Denomination_Liv");
		document.getElementById('oebrc-adresse1Liv').value = contenu.getAttribute("Adresse_1_Liv");
		document.getElementById('oebrc-adresse2Liv').value = contenu.getAttribute("Adresse_2_Liv");
		document.getElementById('oebrc-adresse3Liv').value = contenu.getAttribute("Adresse_3_Liv");
		document.getElementById('oebrc-codePostalLiv').value = contenu.getAttribute("Code_Postal_Liv");
		document.getElementById('oebrc-villeLiv').value = contenu.getAttribute("Ville_Liv");		
		document.getElementById('oebrc-codePaysLiv').value = contenu.getAttribute("Code_Pays_Liv");
		document.getElementById('oebrc-commentairesFin').value = contenu.getAttribute("Commentaires_Fin");
		document.getElementById('oebrc-commentairesInt').value = contenu.getAttribute("Commentaires_Int");
		document.getElementById('oebrc-numero').value = contenu.getAttribute("Num_Entier");

		document.getElementById('oebrc-civInterLiv').value = contenu.getAttribute("Civ_Inter_Liv");
		document.getElementById('oebrc-nomInterLiv').value = contenu.getAttribute("Nom_Inter_Liv");
		document.getElementById('oebrc-prenomInterLiv').value = contenu.getAttribute("Prenom_Inter_Liv");
		document.getElementById('oebrc-telInterLiv').value = contenu.getAttribute("Tel_Inter_Liv");
		document.getElementById('oebrc-faxInterLiv').value = contenu.getAttribute("Fax_Inter_Liv");
		document.getElementById('oebrc-emailInterLiv').value = contenu.getAttribute("Email_Inter_Liv");

		document.getElementById('oebrc-creation').setAttribute("label","Bon de retour créé le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur'));
		document.getElementById('oebrc-modification').setAttribute("label","Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj'));
		document.getElementById('oebrc-fiche').setAttribute("label","Bon N° "+ contenu.getAttribute('Num_Entier'));
		document.getElementById('oebrc-creation').collapsed = false;
		document.getElementById('oebrc-modification').collapsed = false;
		
		document.getElementById('oebrc-bOuvrirCommentairesCaches').disabled = false;

		oebrc_aBonRetour.initTree();
		
		if (oebrc_etatBon!='N') {
			document.getElementById('oebrc-tabVersionDocument').collapsed=false;
			oebrc_initVersion();
		}

		oebrc_setModifie(false);
		if (oebrc_etatBon!='V' && oebrc_etatBon!='E' && oebrc_etatBon!='A') {
			oebrc_aBonLivraison.setParam("BL_Id", bonId);
			oebrc_aBonLivraison.initTree();
			oebrc_debloquerChamps();
			document.getElementById('oebrc-bToutEnlever').disabled = false;
		} else if (oebrc_etatBon=='E') {
			document.getElementById('oebrc-dateReception').disabled = false;
			document.getElementById('oebrc-bValiderReception').disabled = false;
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebrc_editerCommentairesCaches()  {
  try {
  	var url = "chrome://opensi/content/facturation/user/affaires/popup-commentaireCache.xul?"+ cookie();
    url += "&Type_Doc=Bon_Retour&Doc_Id="+ bonRetourId;
  	window.openDialog(url,'','chrome,modal,centerscreen');
  
	} catch (e) {
  	recup_erreur(e);
  }
}


function oebrc_enregistrerBon(rafraichir) {
  try {
  	
  	var oebrc_ok=false;

		var oebrc_qBonRetour;

		if (oebrc_mode=="C") {
			oebrc_qBonRetour = new QueryHttp("Facturation/Affaires/creerBonRetour.tmpl");
			oebrc_qBonRetour.setParam("BL_Id", bonId);
		}
		else {
			oebrc_qBonRetour = new QueryHttp("Facturation/Affaires/modifierBonRetour.tmpl");
			oebrc_qBonRetour.setParam("Bon_Id", bonRetourId);
		}

		var oebrc_dateReception = document.getElementById('oebrc-dateReception').value;
		var oebrc_denomination = document.getElementById('oebrc-denominationLiv').value;
		var oebrc_adresse1 = document.getElementById('oebrc-adresse1Liv').value;
		var oebrc_adresse2 = document.getElementById('oebrc-adresse2Liv').value;
		var oebrc_adresse3 = document.getElementById('oebrc-adresse3Liv').value;
		var oebrc_codePostal = document.getElementById('oebrc-codePostalLiv').value;
		var oebrc_ville = document.getElementById('oebrc-villeLiv').value;
		var oebrc_codePays = document.getElementById('oebrc-codePaysLiv').value;
		var oebrc_civInter = document.getElementById('oebrc-civInterLiv').value;
		var oebrc_nomInter = document.getElementById('oebrc-nomInterLiv').value;
		var oebrc_prenomInter = document.getElementById('oebrc-prenomInterLiv').value;
		var oebrc_telInter = document.getElementById('oebrc-telInterLiv').value;
		var oebrc_faxInter = document.getElementById('oebrc-faxInterLiv').value;
		var oebrc_emailInter = document.getElementById('oebrc-emailInterLiv').value;
		var oebrc_commentairesFin = document.getElementById('oebrc-commentairesFin').value;
		var oebrc_commentairesInt = document.getElementById('oebrc-commentairesInt').value;

		if (isEmpty(oebrc_denomination)) { showWarning("Veuillez indiquer la raison sociale du client !"); }
		else if (isEmpty(oebrc_adresse1)) { showWarning("Veuillez indiquer l'adresse du client !"); }
		else if (isEmpty(oebrc_ville)) { showWarning("Veuillez indiquer la ville du client !"); }
		else if (!isEmpty(oebrc_telInter) && !isPhone(oebrc_telInter)) { showWarning("Numéro de téléphone incorrect !"); }
		else if (!isEmpty(oebrc_faxInter) && !isPhone(oebrc_faxInter)) { showWarning("Numéro de fax incorrect !"); }
		else if (!isEmpty(oebrc_emailInter) && !isEmail(oebrc_emailInter)) { showWarning("Adresse e-mail incorrecte !"); }
		else if (!isEmpty(oebrc_dateReception) && !isDate(oebrc_dateReception)) { showWarning("La date de réception est incorrecte !"); }
		else {
			if (!isEmpty(oebrc_dateReception)) { oebrc_dateReception = prepareDateJava(oebrc_dateReception); }
			
			oebrc_qBonRetour.setParam("Date_Retour",oebrc_dateReception);
			oebrc_qBonRetour.setParam("Denomination",oebrc_denomination);
			oebrc_qBonRetour.setParam("Adresse_1",oebrc_adresse1);
			oebrc_qBonRetour.setParam("Adresse_2",oebrc_adresse2);
			oebrc_qBonRetour.setParam("Adresse_3",oebrc_adresse3);
			oebrc_qBonRetour.setParam("Code_Postal",oebrc_codePostal);
			oebrc_qBonRetour.setParam("Ville",oebrc_ville);
			oebrc_qBonRetour.setParam("Code_Pays",oebrc_codePays);
			oebrc_qBonRetour.setParam("Civ_Inter",oebrc_civInter);
			oebrc_qBonRetour.setParam("Nom_Inter",oebrc_nomInter);
			oebrc_qBonRetour.setParam("Prenom_Inter",oebrc_prenomInter);
			oebrc_qBonRetour.setParam("Tel_Inter",oebrc_telInter);
			oebrc_qBonRetour.setParam("Fax_Inter",oebrc_faxInter);
			oebrc_qBonRetour.setParam("Email_Inter",oebrc_emailInter);
			oebrc_qBonRetour.setParam("Commentaires_Fin",oebrc_commentairesFin);
			oebrc_qBonRetour.setParam("Commentaires_Int",oebrc_commentairesInt);

			var result = oebrc_qBonRetour.execute();
			var contenu = result.responseXML.documentElement;

			if (oebrc_mode=="C") {
				bonRetourId = contenu.getAttribute("Bon_Id");
				if (rafraichir) { oebrc_chargerBon(); }
			}
			

			oebrc_setModifie(false);
			oebrc_ok=true;
		}
		return oebrc_ok;

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebrc_supprimerBon() {
  try {

		if (window.confirm("Confirmez-vous la suppression de ce bon de retour ?")) {
			var oebrc_qSupBR = new QueryHttp("Facturation/Affaires/supprimerBR.tmpl");
			oebrc_qSupBR.setParam("Bon_Id", bonRetourId);
			oebrc_qSupBR.execute();
			
			showMessage("Le bon de retour a été supprimé avec succès !");
			
			retourFicheAffaire();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebrc_toutTransferer() {
  try {
  	var ok = true;
		if (oebrc_mode=="C") {
			ok = oebrc_enregistrerBon(true);
		}
		if (ok) {
			var oebrc_qAjouterToutBon = new QueryHttp('Facturation/Affaires/ajouterToutBonRetour.tmpl');
			oebrc_qAjouterToutBon.setParam("Bon_Id", bonRetourId);
			oebrc_qAjouterToutBon.setParam("BL_Id", bonId);
			oebrc_qAjouterToutBon.execute();
			
			oebrc_aBonLivraison.initTree();
			oebrc_aBonRetour.initTree();
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebrc_toutEnlever() {
  try {

  	var oebrc_qEnleverToutBon = new QueryHttp('Facturation/Affaires/enleverToutBonRetour.tmpl');
		oebrc_qEnleverToutBon.setParam("Bon_Id", bonRetourId);
		oebrc_qEnleverToutBon.execute();

		oebrc_aBonLivraison.initTree();
		oebrc_aBonRetour.initTree();

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebrc_ajouter() {
  try {

		if (oebrc_aBonLivraison.isSelected()) {
			var i = oebrc_aBonLivraison.getCurrentIndex();
			var oebrc_ligne = oebrc_aBonLivraison.getCellText(i, 'oebrc-colLigneDev');
			var oebrc_qteInit = oebrc_aBonLivraison.getCellText(i, 'oebrc-colQuantiteDev');
			var oebrc_quantite = document.getElementById('oebrc-qteEntree').value;
			
			var oebrc_nbPiecesInit = oebrc_aBonLivraison.getCellText(i, 'oebrc-colNbPiecesDev');
			if (isEmpty(oebrc_nbPiecesInit)) { oebrc_nbPiecesInit = 0; }
			var oebrc_nbPieces = document.getElementById('oebrc-nbPiecesEntree').value;
			
			if (isEmpty(oebrc_quantite)) { showWarning("Veuillez entrer une quantité à transférer !"); }
			else if (!checkQte(oebrc_quantite)) { showWarning("Quantité incorrecte !"); }
			else if (!isEmpty(oebrc_nbPieces) && !isPositiveInteger(oebrc_nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (parseFloat(oebrc_qteInit)-parseFloat(oebrc_quantite)<0) { showWarning("La quantité à transférer ne doit pas dépasser la quantité restant à retourner !"); }
			else if (!isEmpty(oebrc_nbPieces) && (parseFloat(oebrc_nbPiecesInit)-parseFloat(oebrc_nbPieces)<0)) { showWarning("Le nb de pièces à transférer ne doit pas dépasser le nb de pièces restant à retourner !"); }
			else {
				
				var ok = true;
				if (oebrc_mode=="C") {
					ok = oebrc_enregistrerBon(true);
				}
				if (ok) {
					var oebrc_qAjouterArticles = new QueryHttp('Facturation/Affaires/ajouterArticleBonRetour.tmpl');
					oebrc_qAjouterArticles.setParam("Bon_Id", bonRetourId);
					oebrc_qAjouterArticles.setParam("Ligne", oebrc_ligne);
					oebrc_qAjouterArticles.setParam("Quantite", oebrc_quantite);
					oebrc_qAjouterArticles.setParam("Nb_Pieces", oebrc_nbPieces);
					oebrc_qAjouterArticles.execute();
					
					oebrc_aBonLivraison.initTree();
					oebrc_aBonRetour.initTree();
		
					oebrc_disableAjouter(true,false);
				}
				
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebrc_enlever() {
  try {

		if (oebrc_aBonRetour.isSelected()) {
			var i = oebrc_aBonRetour.getCurrentIndex();
			var oebrc_ligneId = oebrc_aBonRetour.getCellText(i, 'oebrc-colLigneLiv');
			var oebrc_qteInit = oebrc_aBonRetour.getCellText(i, 'oebrc-colQuantiteLiv');
			var oebrc_quantite = document.getElementById('oebrc-qteSortie').value;
			var oebrc_nbPiecesInit = oebrc_aBonRetour.getCellText(i, 'oebrc-colNbPiecesLiv');
			if (isEmpty(oebrc_nbPiecesInit)) { oebrc_nbPiecesInit = 0; }
			var oebrc_nbPieces = document.getElementById('oebrc-nbPiecesSortie').value;

			if (isEmpty(oebrc_quantite)) { showWarning("Veuillez entrer une quantité à enlever"); }
			else if (!checkQte(oebrc_quantite)) { showWarning("Quantité incorrecte !"); }
			else if (parseFloat(oebrc_qteInit)-parseFloat(oebrc_quantite)<0) { showWarning("La quantité à enlever ne peut dépasser la quantité présente dans le bon de retour !"); }
			else if (!isEmpty(oebrc_nbPieces) && !isPositiveInteger(oebrc_nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (!isEmpty(oebrc_nbPieces) && (parseFloat(oebrc_nbPiecesInit)-parseFloat(oebrc_nbPieces)<0)) { showWarning("Le nb de pièces à enlever ne peut dépasser le nb de pièces présent dans le bon de retour !"); }
			else {
				var oebrc_qEnleverArticles = new QueryHttp('Facturation/Affaires/enleverArticleBonRetour.tmpl');
				oebrc_qEnleverArticles.setParam("Bon_Id", bonRetourId);
				oebrc_qEnleverArticles.setParam("Ligne_Id", oebrc_ligneId);
				oebrc_qEnleverArticles.setParam("QteInit", oebrc_qteInit);
				oebrc_qEnleverArticles.setParam("Quantite", oebrc_quantite);
				oebrc_qEnleverArticles.setParam("Nb_Pieces", oebrc_nbPieces);
				oebrc_qEnleverArticles.execute();

				oebrc_aBonLivraison.initTree();
				oebrc_aBonRetour.initTree();
				
				oebrc_disableEnlever(true,false);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebrc_demandeEnregistrement() {
  try {

		if (oebrc_modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées au bon de retour ?")) {
				oebrc_enregistrerBon(false);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebrc_setModifie(oebrc_m) {
  try {
  	oebrc_modifie = oebrc_m;
		if (oebrc_m) {
			document.getElementById('oebrc-tabBon').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('oebrc-bValiderBR').disabled = true;
			document.getElementById('oebrc-bVisualiser').disabled = (oebrc_etatBon!='E');
		}
		else {
			document.getElementById('oebrc-tabBon').setAttribute('image', null);
			document.getElementById('oebrc-bValiderBR').disabled = (oebrc_etatBon=='E');
			document.getElementById('oebrc-bVisualiser').disabled = false;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}



function oebrc_visualiserBon() {
  try {

		if (oebrc_aBonRetour.nbLignes()<=0) {
			showWarning("Le bon de retour ne contient aucune ligne !");
		}
		else {
			document.getElementById("bRetourBonRetour").collapsed = false;
			document.getElementById("oebrc-deckBonRetour").selectedIndex = 1;
			
			var qLangueDefaut = new QueryHttp("Facturation/Commun/getLangueDefaut.tmpl");
			qLangueDefaut.setParam("Type_Doc", "Bon_Retour_Client");
			qLangueDefaut.setParam("Doc_Id", bonRetourId);
			var result = qLangueDefaut.execute();
			oebrc_langueDefaut = result.responseXML.documentElement.getAttribute("Langue_Id");
			oebrc_aLangues.setParam("Selection", oebrc_langueDefaut);
			oebrc_aLangues.initTree(oebrc_initLangue);
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function oebrc_initLangue() {
	try {
		document.getElementById('oebrc-langueDefaut').value = oebrc_langueDefaut;
		oebrc_editerBon();
	} catch (e) {
		recup_erreur(e);
	}
}


function oebrc_editerBon() {
	try {
		var langue = document.getElementById('oebrc-langueDefaut').value;
		
		var oebrc_qGenPdf = new QueryHttp("Facturation/Affaires/pdfBonRetour.tmpl");
		oebrc_qGenPdf.setParam('Bon_Id', bonRetourId);
	  oebrc_qGenPdf.setParam('Langue', langue);
		var result = oebrc_qGenPdf.execute();
		var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
				
		document.getElementById('oebrc-pdfBonRetour').setAttribute("src", page);
	} catch (e) {
		recup_erreur(e);
	}
}


function oebrc_validerBon() {
  try {

		if (oebrc_aBonRetour.nbLignes()<=0) {
			showWarning("Le bon de retour ne contient aucune ligne !");
		}
		else if (window.confirm("Confirmez-vous la validation du bon de retour ?\n(Attention le bon de retour validé ne pourra plus être modifié !)")) {
			var oebrc_qValider = new QueryHttp("Facturation/Affaires/validerBonRetour.tmpl");
			oebrc_qValider.setParam('Bon_Id', bonRetourId);
			oebrc_qValider.execute();
			
			oebrc_chargerBon();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function oebrc_validerReception() {
  try {

		var oebrc_dateReception = document.getElementById('oebrc-dateReception').value;
		if (isEmpty(oebrc_dateReception) || !isDate(oebrc_dateReception)) { showWarning("Date de réception incorrecte !"); }
		else if (window.confirm("Confirmez-vous la validation de la réception ?")) {
			oebrc_dateReception = prepareDateJava(oebrc_dateReception);
		
			var oebrc_qValiderReception = new QueryHttp("Facturation/Affaires/validerReception.tmpl");
			oebrc_qValiderReception.setParam('Bon_Id', bonRetourId);
			oebrc_qValiderReception.setParam('Date_Reception', oebrc_dateReception);
			oebrc_qValiderReception.execute();
			
			oebrc_chargerBon();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function oebrc_annulerBon() {
  try {

		if (window.confirm("Confirmez-vous l'annulation du bon de retour ?")) {
			var oebrc_qAnnuler = new QueryHttp("Facturation/Affaires/annulerBonRetour.tmpl");
			oebrc_qAnnuler.setParam('Bon_Id', bonRetourId);
			oebrc_qAnnuler.execute();
			
			showMessage("Le bon de retour a été annulé !");
			
			oebrc_chargerBon();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebrc_rechercherAdrLiv() {
  try {
  	
  	oebrc_currentCodePaysLiv = document.getElementById('oebrc-codePaysLiv').value;

		var oebrc_url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(oebrc_clientId);
    window.openDialog(oebrc_url,'','chrome,modal,centerscreen', oebrc_reporterAdrLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebrc_reporterAdrLiv(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact_fact, contact_liv) {
  try {
  	
  	var oebrc_qGetAssujetti = new QueryHttp("Facturation/Affaires/getBonCommande.tmpl");
		oebrc_qGetAssujetti.setParam("Commande_Id", commandeId);
		var result = oebrc_qGetAssujetti.execute();
		var content = result.responseXML.documentElement;
	  var oebrc_assujettiTVA=(content.getAttribute("Assujetti_TVA")=="1");
  	
  	if (oebrc_currentCodePaysLiv!=code_pays && !oebrc_assujettiTVA) {
  		showWarning("L'adresse choisie doit être dans le même pays que le pays de livraison actuel !");
  	} else {	
			document.getElementById('oebrc-denominationLiv').value = nom;
			document.getElementById('oebrc-adresse1Liv').value = adr1;		
			document.getElementById('oebrc-adresse2Liv').value = adr2;
			document.getElementById('oebrc-adresse3Liv').value = adr3;
			document.getElementById('oebrc-codePostalLiv').value = cp;
			document.getElementById('oebrc-villeLiv').value = ville;
		  document.getElementById('oebrc-codePaysLiv').value = code_pays;
			
			if (!isEmpty(contact_liv)) {
				var oebrc_qInterLiv = new QueryHttp("Facturation/Clients/getContact.tmpl");
		  	oebrc_qInterLiv.setParam("Num_Inter", contact_liv);
		  	var result = oebrc_qInterLiv.execute();
		  	var content = result.responseXML.documentElement;
		  	oebrc_reporterInterLiv(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
		  } else {
				oebrc_setModifie(true);
		  }
  	}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebrc_rechercherInterlocuteurLiv() {
  try {

		var oebrc_url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(oebrc_clientId);
    window.openDialog(oebrc_url,'','chrome,modal,centerscreen',oebrc_reporterInterLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebrc_reporterInterLiv(civ, civCourte,nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oebrc-civInterLiv').value = civ;
		document.getElementById('oebrc-nomInterLiv').value = nom;		
		document.getElementById('oebrc-prenomInterLiv').value = prenom;
		document.getElementById('oebrc-telInterLiv').value = tel;
		document.getElementById('oebrc-faxInterLiv').value = fax;
		document.getElementById('oebrc-emailInterLiv').value = email;
		
		oebrc_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}

function oebrc_choisirMentions() {
  try {
  	
  	var oebrc_ok = true;
  	
  	if (oebrc_mode=="C") {
			oebrc_ok = oebrc_enregistrerBon(true);
		}

		if (oebrc_ok) {
			var oebrc_url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Bon_Retour&Doc_Id="+ bonRetourId;
	    window.openDialog(oebrc_url,'','chrome,modal,centerscreen',oebrc_setModifie);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebrc_initVersion() {
	try {
		
		oebrc_aVersion.setParam("Type_Document", "Bon_Retour_Client");
		oebrc_aVersion.setParam("Document_Id", bonRetourId);
		oebrc_aVersion.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}

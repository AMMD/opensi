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

var oebr_aBRArticlesFourn = new Arbre('Facturation/Retours_Fournisseurs/liste-bonsReceptionsArticleFourn.tmpl', 'oebr-listeBRArticlesFourn');
var oebr_aArticlesRetour = new Arbre('Facturation/Retours_Fournisseurs/liste-articlesBonRetour.tmpl', 'oebr-listeArticlesBonRetour');
var oebr_aArticlesEnAttente = new Arbre('Facturation/Retours_Fournisseurs/liste-articlesBonRetour.tmpl', 'oebr-listeArticlesEnAttente');
var oebr_aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","oebr-listeVersion");

var oebr_mode;
var oebr_fournisseurId;
var oebr_etatBon;
var oebr_currentCodePays;
var oebr_modifie = false;

function oebr_init() {
	try {
		
  	var qProduitsFrais = new QueryHttp('Config/gestion_commerciale/preferences/getParam.tmpl');
		var result = qProduitsFrais.execute();
		var prodFrais = (result.responseXML.documentElement.getAttribute("Produit_Frais")=="1");
		document.getElementById('oebr-prodFraisEntree').collapsed = !prodFrais;
		document.getElementById('oebr-prodFraisSortie').collapsed = !prodFrais;

		document.getElementById('oebr-colNbPiecesRecep').collapsed = !prodFrais;
		document.getElementById('oebr-colNbPiecesRecep').setAttribute('ignoreincolumnpicker', !prodFrais);
		document.getElementById('oebr-colNbPiecesRetour').collapsed = !prodFrais;
		document.getElementById('oebr-colNbPiecesRetour').setAttribute('ignoreincolumnpicker', !prodFrais);
		var aPays = new Arbre("ComboListe/combo-pays.tmpl", "oebr-codePays");
		aPays.initTree(oebr_initPays);
		
	} catch (e) {
		recup_erreur(e);
	}
}

function oebr_initPays() {
	try {
		document.getElementById('oebr-codePays').value = "FR";
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_reinitialiser() {
	try {
		
		oebr_mode = "C";
		oebr_etatBon = "N";
		oebr_fournisseurId = "";
		document.getElementById('oebr-deckBonRetour').selectedIndex = 0;
		document.getElementById('oebr-tabBoxBon').selectedIndex = 0;
		document.getElementById('oebr-numFournisseur').value = "";
		document.getElementById('oebr-numero').value = "";
		document.getElementById('oebr-dateBon').value = "";
		document.getElementById('oebr-etat').value = "";
		document.getElementById('oebr-dateRetour').value = "";
		document.getElementById('oebr-refArticle').value = "";
		
		document.getElementById('oebr-denomination').value = "";
		document.getElementById('oebr-adresse1').value = "";
		document.getElementById('oebr-adresse2').value = "";
		document.getElementById('oebr-adresse3').value = "";
		document.getElementById('oebr-codePostal').value = "";
		document.getElementById('oebr-ville').value = "";
		document.getElementById('oebr-codePays').value = "FR";
		document.getElementById('oebr-civInter').value = "0";
		document.getElementById('oebr-nomInter').value = "";
		document.getElementById('oebr-prenomInter').value = "";
		document.getElementById('oebr-telInter').value = "";
		document.getElementById('oebr-faxInter').value = "";
		document.getElementById('oebr-emailInter').value = "";
		document.getElementById('oebr-rgpTypeRetour').value = "E";
		document.getElementById('oebr-tabBon').setAttribute('image', null);
		
		document.getElementById('oebr-tabVersionDocument').collapsed=true;
		oebr_aVersion.deleteTree();

		document.getElementById('oebr-commentairesFin').value = "";
		document.getElementById('oebr-commentairesInt').value = "";
		document.getElementById('oebr-nbPiecesEntree').value = "";
		document.getElementById('oebr-qteEntree').value = "";
		document.getElementById('oebr-nbPiecesSortie').value = "";
		document.getElementById('oebr-qteSortie').value = "";
		document.getElementById('oebr-creation').value = "";
		document.getElementById('oebr-modification').value = "";
		document.getElementById('oebr-fiche').value = "";
		document.getElementById('oebr-qteReceptionnee').value = "";
		oebr_modifie = false;
		
		document.getElementById('oebr-refArticle').disabled = true;
		document.getElementById('oebr-bArticle').disabled = true;
		document.getElementById('oebr-bActualiser').disabled = true;
		
		document.getElementById('oebr-bRechFournisseur').disabled = true;
		document.getElementById('oebr-bChercherAdresse').disabled = true;
		document.getElementById('oebr-bChercherInter').disabled = true;
		document.getElementById('oebr-bChoisirMentions').disabled = true;
		document.getElementById('oebr-bAjouter').disabled = true;
		document.getElementById('oebr-bEnlever').disabled = true;
		document.getElementById('oebr-bEnregistrer').disabled = true;
		document.getElementById('oebr-bValiderBR').disabled = true;
		document.getElementById('oebr-bValiderReception').disabled = true;
		document.getElementById('oebr-bAnnuler').disabled = true;
		document.getElementById('oebr-bSupprimer').disabled = true;
		document.getElementById('oebr-bVisualiser').disabled = true;

		document.getElementById('oebr-denomination').disabled = true;
		document.getElementById('oebr-adresse1').disabled = true;
		document.getElementById('oebr-adresse2').disabled = true;
		document.getElementById('oebr-adresse3').disabled = true;
		document.getElementById('oebr-codePostal').disabled = true;
		document.getElementById('oebr-ville').disabled = true;
		document.getElementById('oebr-codePays').disabled = true;
		document.getElementById('oebr-civInter').disabled = true;
		document.getElementById('oebr-nomInter').disabled = true;
		document.getElementById('oebr-prenomInter').disabled = true;
		document.getElementById('oebr-telInter').disabled = true;
		document.getElementById('oebr-faxInter').disabled = true;
		document.getElementById('oebr-emailInter').disabled = true;
		document.getElementById('oebr-commentairesFin').disabled = true;
		document.getElementById('oebr-commentairesInt').disabled = true;
		document.getElementById('oebr-nbPiecesEntree').disabled = true;
		document.getElementById('oebr-qteEntree').disabled = true;
		document.getElementById('oebr-nbPiecesSortie').disabled = true;
		document.getElementById('oebr-qteSortie').disabled = true;
		document.getElementById('oebr-codePays').disabled = true;
		document.getElementById('oebr-rgpTypeRetour').disabled = true;
		document.getElementById('oebr-listeBRArticlesFourn').disabled = true;
		document.getElementById('oebr-listeArticlesBonRetour').disabled = true;
		document.getElementById('oebr-listeArticlesEnAttente').disabled = true;
		document.getElementById('oebr-qteReceptionnee').disabled = true;
		document.getElementById('oebr-bValiderQteRecep').disabled = true;
		document.getElementById('oebr-bToutCocher').disabled = true;
		document.getElementById('oebr-bToutDecocher').disabled = true;

		document.getElementById('oebr-bOuvrirCommentairesCaches').disabled = true;

		document.getElementById('oebr-bRechFournisseur').collapsed = true;
		document.getElementById('oebr-bVisualiser').collapsed = true;
		document.getElementById('oebr-bValiderBR').collapsed = true;
		document.getElementById('oebr-bValiderReception').collapsed = true;
		
		document.getElementById('oebr-creation').collapsed = true;
		document.getElementById('oebr-modification').collapsed = true;


		oebr_aBRArticlesFourn.clearParams();
		oebr_aBRArticlesFourn.deleteTree();
		
		oebr_aArticlesRetour.deleteTree();
		oebr_aArticlesEnAttente.deleteTree();
		document.getElementById('oebr-deckEdition').selectedIndex = 0;
		document.getElementById('oebr-corpsTransfert').collapsed = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_debloquerChamps() {
	try {

		document.getElementById('oebr-denomination').disabled = false;
		document.getElementById('oebr-adresse1').disabled = false;
		document.getElementById('oebr-adresse2').disabled = false;
		document.getElementById('oebr-adresse3').disabled = false;
		document.getElementById('oebr-codePostal').disabled = false;
		document.getElementById('oebr-ville').disabled = false;
		document.getElementById('oebr-codePays').disabled = false;
		document.getElementById('oebr-civInter').disabled = false;
		document.getElementById('oebr-nomInter').disabled = false;
		document.getElementById('oebr-prenomInter').disabled = false;
		document.getElementById('oebr-telInter').disabled = false;
		document.getElementById('oebr-faxInter').disabled = false;
		document.getElementById('oebr-emailInter').disabled = false;
		document.getElementById('oebr-commentairesFin').disabled = false;
		document.getElementById('oebr-commentairesInt').disabled = false;
		document.getElementById('oebr-codePays').disabled = false;
		document.getElementById('oebr-rgpTypeRetour').disabled = false;
		document.getElementById('oebr-listeBRArticlesFourn').disabled = false;
		document.getElementById('oebr-listeArticlesBonRetour').disabled = false;
		document.getElementById('oebr-bVisualiser').disabled = false;
		document.getElementById('oebr-bEnregistrer').disabled = false;
		document.getElementById('oebr-bSupprimer').disabled = false;
		document.getElementById('oebr-bValiderReception').disabled = false;
		
		oebr_disableAjouter(true,false);
		oebr_disableEnlever(true,false);
		document.getElementById('oebr-nbPiecesEntree').value = "";
		document.getElementById('oebr-qteEntree').value = "";
		document.getElementById('oebr-nbPiecesSortie').value = "";
		document.getElementById('oebr-qteSortie').value = "";

	} catch (e) {
    recup_erreur(e);
  }
}

function oebr_reporterQteEntree() {
	try {

		if (oebr_aBRArticlesFourn.isSelected()) {
			var i = oebr_aBRArticlesFourn.getCurrentIndex();
			document.getElementById('oebr-nbPiecesEntree').value = oebr_aBRArticlesFourn.getCellText(i, 'oebr-colNbPiecesRecep');
			document.getElementById('oebr-qteEntree').value = oebr_aBRArticlesFourn.getCellText(i, 'oebr-colQuantiteRecep');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebr_reporterQteSortie() {
	try {

		if (oebr_aArticlesRetour.isSelected()) {
			var i = oebr_aArticlesRetour.getCurrentIndex();
			document.getElementById('oebr-nbPiecesSortie').value = oebr_aArticlesRetour.getCellText(i, 'oebr-colNbPiecesRetour');
			document.getElementById('oebr-qteSortie').value = oebr_aArticlesRetour.getCellText(i, 'oebr-colQuantiteRetour');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebr_disableAjouter(oebr_b,oebr_arbre) {
	try {

		if (!oebr_arbre || (oebr_aBRArticlesFourn.isSelected() && oebr_mode!="V")) {
			document.getElementById('oebr-bAjouter').disabled = oebr_b;
			document.getElementById('oebr-nbPiecesEntree').disabled = oebr_b;
			document.getElementById('oebr-qteEntree').disabled = oebr_b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebr_disableEnlever(oebr_b,oebr_arbre) {
	try {

		if (!oebr_arbre || (oebr_aArticlesRetour.isSelected() && oebr_mode!="V")) {
			document.getElementById('oebr-bEnlever').disabled = oebr_b;
			document.getElementById('oebr-nbPiecesSortie').disabled = oebr_b;
			document.getElementById('oebr-qteSortie').disabled = oebr_b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function oebr_nouveauBon() {
  try {
  	
  	oebr_reinitialiser();

		document.getElementById('oebr-etat').value = "Nouveau";

		document.getElementById('oebr-bSupprimer').collapsed = true;
		document.getElementById('oebr-bAnnuler').collapsed = true;
		oebr_debloquerChamps();
		
		document.getElementById('oebr-refArticle').disabled = false;
		document.getElementById('oebr-bArticle').disabled = false;
		document.getElementById('oebr-bActualiser').disabled = false;

		oebr_checkChangerFourn();
		
		oebr_setModifie(false);

	} catch (e) {
  	recup_erreur(e);
  }
}



function oebr_chargerBon() {
  try {

		oebr_reinitialiser();

		oebr_mode = "M";
		var qGetBonRetour = new QueryHttp('Facturation/Retours_Fournisseurs/getBonRetour.tmpl');
		qGetBonRetour.setParam("Bon_Id", bonRetourId);
		var result = qGetBonRetour.execute();
		var contenu = result.responseXML.documentElement;

		oebr_etatBon = contenu.getAttribute("Etat");
		oebr_fournisseurId = contenu.getAttribute("Fournisseur_Id");
		
		document.getElementById('oebr-bAnnuler').disabled = (oebr_etatBon!="E" && oebr_etatBon!="V");

		if (oebr_etatBon=="V") {
			document.getElementById('oebr-etat').value = "Validé";
			document.getElementById('oebr-bSupprimer').collapsed = true;          
			document.getElementById('oebr-bAnnuler').collapsed = false;
			document.getElementById('oebr-deckEdition').selectedIndex = 0;
			document.getElementById('oebr-corpsTransfert').collapsed = true;
		}
		else if (oebr_etatBon=="E") {
			document.getElementById('oebr-etat').value = "En attente";
			document.getElementById('oebr-bSupprimer').collapsed = true;          
			document.getElementById('oebr-bAnnuler').collapsed = false;
			document.getElementById('oebr-deckEdition').selectedIndex = 1;
			document.getElementById('oebr-corpsTransfert').collapsed = true;
		}
		else if (oebr_etatBon=="A") {
			document.getElementById('oebr-etat').value = "Annulé";
			document.getElementById('oebr-bSupprimer').collapsed = true;
			document.getElementById('oebr-bAnnuler').collapsed = true;
			document.getElementById('oebr-deckEdition').selectedIndex = 0;
			document.getElementById('oebr-corpsTransfert').collapsed = true;
		}
		else {
			document.getElementById('oebr-etat').value = "Nouveau";
			document.getElementById('oebr-bAnnuler').collapsed = true;
			document.getElementById('oebr-bSupprimer').collapsed = false;
			document.getElementById('oebr-deckEdition').selectedIndex = 0;
			document.getElementById('oebr-corpsTransfert').collapsed = false;
			document.getElementById('oebr-refArticle').disabled = false;
			document.getElementById('oebr-bArticle').disabled = false;
			document.getElementById('oebr-bActualiser').disabled = false;
			document.getElementById('oebr-bChercherAdresse').disabled = (oebr_fournisseurId=="");
			document.getElementById('oebr-bChercherInter').disabled = (oebr_fournisseurId=="");
			document.getElementById('oebr-bChoisirMentions').disabled = false;
		}
		
		document.getElementById('oebr-bVisualiser').collapsed = (oebr_etatBon=='N');
		document.getElementById('oebr-bValiderBR').collapsed = (oebr_etatBon!='N');
		document.getElementById('oebr-bValiderReception').collapsed = (oebr_etatBon!='E');

		document.getElementById('oebr-dateRetour').value = contenu.getAttribute("Date_Retour");
		document.getElementById('oebr-denomination').value = contenu.getAttribute("Denomination");
		document.getElementById('oebr-adresse1').value = contenu.getAttribute("Adresse_1");
		document.getElementById('oebr-adresse2').value = contenu.getAttribute("Adresse_2");
		document.getElementById('oebr-adresse3').value = contenu.getAttribute("Adresse_3");
		document.getElementById('oebr-codePostal').value = contenu.getAttribute("Code_Postal");
		document.getElementById('oebr-ville').value = contenu.getAttribute("Ville");
		document.getElementById('oebr-codePays').value = contenu.getAttribute("Code_Pays");
		document.getElementById('oebr-numFournisseur').value = oebr_fournisseurId;
		document.getElementById('oebr-rgpTypeRetour').value = contenu.getAttribute("Type_Retour");
		
		document.getElementById('oebr-dateBon').value = contenu.getAttribute("Date_Bon");
		document.getElementById('oebr-commentairesFin').value = contenu.getAttribute("Commentaires_Fin");
		document.getElementById('oebr-commentairesInt').value = contenu.getAttribute("Commentaires_Int");
		document.getElementById('oebr-numero').value = contenu.getAttribute("Numero");

		document.getElementById('oebr-civInter').value = contenu.getAttribute("Civ_Inter");
		document.getElementById('oebr-nomInter').value = contenu.getAttribute("Nom_Inter");
		document.getElementById('oebr-prenomInter').value = contenu.getAttribute("Prenom_Inter");
		document.getElementById('oebr-telInter').value = contenu.getAttribute("Tel_Inter");
		document.getElementById('oebr-faxInter').value = contenu.getAttribute("Fax_Inter");
		document.getElementById('oebr-emailInter').value = contenu.getAttribute("Email_Inter");

		document.getElementById('oebr-creation').setAttribute("label","Bon de retour créé le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur'));
		document.getElementById('oebr-modification').setAttribute("label","Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj'));
		document.getElementById('oebr-fiche').setAttribute("label","Bon N° "+ contenu.getAttribute('Numero'));
		document.getElementById('oebr-creation').collapsed = false;
		document.getElementById('oebr-modification').collapsed = false;
		
		document.getElementById('oebr-bOuvrirCommentairesCaches').disabled = false;

		oebr_aArticlesRetour.setParam('Bon_Id', bonRetourId);
		oebr_aArticlesRetour.initTree(oebr_checkChangerFourn);
		
		if (oebr_etatBon=='N') {
			oebr_debloquerChamps();
		} else {
			document.getElementById('oebr-tabVersionDocument').collapsed=false;
			oebr_initVersion();
			if (oebr_etatBon=='E') {
				oebr_aArticlesEnAttente.setParam('Bon_Id', bonRetourId);
				oebr_aArticlesEnAttente.initTree(oebr_initListeArticlesEnAttente);
			}
		}
		oebr_setModifie(false);

	} catch (e) {
  	recup_erreur(e);
  }
}



function ober_majAffichageUtilM() {
	try {
		var qGetBonRetour = new QueryHttp('Facturation/Retours_Fournisseurs/getBonRetour.tmpl');
		qGetBonRetour.setParam("Bon_Id", bonRetourId);
		var result = qGetBonRetour.execute();
		var contenu = result.responseXML.documentElement;
		document.getElementById('oebr-modification').setAttribute("label","Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj'));
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_checkChangerFourn() {
	try {
		var desactiverRechFourn = (oebr_etatBon!="N" || oebr_aArticlesRetour.nbLignes()>0);
		document.getElementById('oebr-bRechFournisseur').collapsed = desactiverRechFourn;
		document.getElementById('oebr-bRechFournisseur').disabled = desactiverRechFourn;
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_editerCommentairesCaches() {
  try {
  	var url = "chrome://opensi/content/facturation/user/commun/popup-commentaireCache.xul?"+ cookie();
    url += "&Type_Doc=Bon_Retour_Fournisseur&Doc_Id="+ bonRetourId;
  	window.openDialog(url,'','chrome,modal,centerscreen');
  
	} catch (e) {
  	recup_erreur(e);
  }
}


function oebr_enregistrerBon(rafraichir) {
  try {
  	
  	var ok=false;

		var qBonRetour;

		if (oebr_mode=="C") {
			qBonRetour = new QueryHttp("Facturation/Retours_Fournisseurs/creerBonRetour.tmpl");
		}
		else {
			qBonRetour = new QueryHttp("Facturation/Retours_Fournisseurs/modifierBonRetour.tmpl");
			qBonRetour.setParam("Bon_Id", bonRetourId);
		}

		var denomination = document.getElementById('oebr-denomination').value;
		var adresse1 = document.getElementById('oebr-adresse1').value;
		var adresse2 = document.getElementById('oebr-adresse2').value;
		var adresse3 = document.getElementById('oebr-adresse3').value;
		var codePostal = document.getElementById('oebr-codePostal').value;
		var ville = document.getElementById('oebr-ville').value;
		var codePays = document.getElementById('oebr-codePays').value;
		var civInter = document.getElementById('oebr-civInter').value;
		var nomInter = document.getElementById('oebr-nomInter').value;
		var prenomInter = document.getElementById('oebr-prenomInter').value;
		var telInter = document.getElementById('oebr-telInter').value;
		var faxInter = document.getElementById('oebr-faxInter').value;
		var emailInter = document.getElementById('oebr-emailInter').value;
		var commentairesFin = document.getElementById('oebr-commentairesFin').value;
		var commentairesInt = document.getElementById('oebr-commentairesInt').value;
		var typeRetour = document.getElementById('oebr-rgpTypeRetour').value;

		if (isEmpty(denomination)) { showWarning("Veuillez indiquer la raison sociale du fournisseur !"); }
		else if (isEmpty(adresse1)) { showWarning("Veuillez indiquer l'adresse du fournisseur !"); }
		else if (isEmpty(ville)) { showWarning("Veuillez indiquer la ville du fournisseur !"); }
		else if (!isEmpty(telInter) && !isPhone(telInter)) { showWarning("Numéro de téléphone incorrect !"); }
		else if (!isEmpty(faxInter) && !isPhone(faxInter)) { showWarning("Numéro de fax incorrect !"); }
		else if (!isEmpty(emailInter) && !isEmail(emailInter)) { showWarning("Adresse e-mail incorrecte !"); }
		else {
			qBonRetour.setParam("Fournisseur_Id", oebr_fournisseurId);
			qBonRetour.setParam("Denomination",denomination);
			qBonRetour.setParam("Adresse_1",adresse1);
			qBonRetour.setParam("Adresse_2",adresse2);
			qBonRetour.setParam("Adresse_3",adresse3);
			qBonRetour.setParam("Code_Postal",codePostal);
			qBonRetour.setParam("Ville",ville);
			qBonRetour.setParam("Code_Pays",codePays);
			qBonRetour.setParam("Civ_Inter",civInter);
			qBonRetour.setParam("Nom_Inter",nomInter);
			qBonRetour.setParam("Prenom_Inter",prenomInter);
			qBonRetour.setParam("Tel_Inter",telInter);
			qBonRetour.setParam("Fax_Inter",faxInter);
			qBonRetour.setParam("Email_Inter",emailInter);
			qBonRetour.setParam("Commentaires_Fin",commentairesFin);
			qBonRetour.setParam("Commentaires_Int",commentairesInt);
			qBonRetour.setParam("Type_Retour",typeRetour);

			var result = qBonRetour.execute();
			var contenu = result.responseXML.documentElement;

			if (oebr_mode=="C") {
				bonRetourId = contenu.getAttribute("Bon_Id");
				if (rafraichir) { oebr_chargerBon(); }
			} else {
				ober_majAffichageUtilM();
			}

			oebr_setModifie(false);
			ok=true;
		}
		return ok;

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebr_supprimerBon() {
  try {

		if (window.confirm("Confirmez-vous la suppression de ce bon de retour ?")) {
			var qSupBR = new QueryHttp("Facturation/Retours_Fournisseurs/supprimerBonRetour.tmpl");
			qSupBR.setParam("Bon_Id", bonRetourId);
			var result = qSupBR.execute();
			var errors = new Errors(result);

			if (errors.hasNext()) {		
				errors.show();
			} else {
				message = result.responseXML.documentElement.getAttribute('Message');
				if (message!=null) {
					showWarning(message);
				}
				retourMenuRetours();
			}
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebr_pressOnRefArticle(ev) {
	try {

		if (ev.keyCode==13) {
			oebr_rechercherReference();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebr_rechercherReference() {
	try {
		
		var reference = document.getElementById('oebr-refArticle').value;

		var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
		qExArt.setParam("Reference", reference);
		var result = qExArt.execute();
		
		var articleId = result.responseXML.documentElement.getAttribute("Article_Id");
		
		if (!isEmpty(articleId)) {
			document.getElementById('oebr-refArticle').value = articleId;
			oebr_initListeBonsReceptions();
		} else {
			oebr_rechercherStock(reference);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oebr_rechercherStock(reference) {
	try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		if (reference != null) { url += "&Reference="+ urlEncode(reference); }
    window.openDialog(url,'','chrome,modal,centerscreen',oebr_retourRechercherStock);

	} catch (e) {
    recup_erreur(e);
  }
}


function oebr_retourRechercherStock(reference) {
	try {
	
		document.getElementById('oebr-refArticle').value = reference;
		oebr_initListeBonsReceptions();
	
	} catch (e) {
    recup_erreur(e);
  }
}


function oebr_initListeBonsReceptions() {
	try {
		
		var refArticle = document.getElementById('oebr-refArticle').value;
		oebr_aBRArticlesFourn.setParam("Ref_Article", refArticle);
		oebr_aBRArticlesFourn.setParam("Fournisseur_Id", oebr_fournisseurId);
		oebr_aBRArticlesFourn.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_ajouter() {
  try {

		if (oebr_aBRArticlesFourn.isSelected()) {
			var i = oebr_aBRArticlesFourn.getCurrentIndex();
			var ligneId = oebr_aBRArticlesFourn.getCellText(i, 'oebr-colLigneRecep');
			var qteInit = oebr_aBRArticlesFourn.getCellText(i, 'oebr-colQuantiteRecep');
			var quantite = document.getElementById('oebr-qteEntree').value;
			
			var nbPiecesInit = oebr_aBRArticlesFourn.getCellText(i, 'oebr-colNbPiecesRecep');
			if (isEmpty(nbPiecesInit)) { nbPiecesInit = 0; }
			var nbPieces = document.getElementById('oebr-nbPiecesEntree').value;
			
			if (isEmpty(quantite)) { showWarning("Veuillez entrer une quantité à transférer !"); }
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !"); }
			else if (!isEmpty(nbPieces) && !isPositiveInteger(nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (parseFloat(qteInit)-parseFloat(quantite)<0) { showWarning("La quantité à transférer ne doit pas dépasser la quantité restant à retourner !"); }
			else if (!isEmpty(nbPieces) && (parseFloat(nbPiecesInit)-parseFloat(nbPieces)<0)) { showWarning("Le nb de pièces à transférer ne doit pas dépasser le nb de pièces restant à retourner !"); }
			else {
				
				var refArticle = document.getElementById('oebr-refArticle').value;
				var ok = true;
				if (oebr_mode=="C") {
					ok = oebr_enregistrerBon(true);
				}
				if (ok) {
					var qAjouterArticles = new QueryHttp('Facturation/Retours_Fournisseurs/ajouterArticleBonRetour.tmpl');
					qAjouterArticles.setParam("Bon_Id", bonRetourId);
					qAjouterArticles.setParam("Ligne_BR", ligneId);
					qAjouterArticles.setParam("Quantite", quantite);
					qAjouterArticles.setParam("Nb_Pieces", nbPieces);
					qAjouterArticles.execute();
					
					document.getElementById('oebr-refArticle').value = refArticle;
					oebr_initListeBonsReceptions();
					oebr_aArticlesRetour.initTree(oebr_checkChangerFourn);
		
					oebr_disableAjouter(true,false);
					document.getElementById('oebr-nbPiecesEntree').value = "";
					document.getElementById('oebr-qteEntree').value = "";
				}
				
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebr_enlever() {
  try {

		if (oebr_aArticlesRetour.isSelected()) {
			var i = oebr_aArticlesRetour.getCurrentIndex();
			var ligneId = oebr_aArticlesRetour.getCellText(i, 'oebr-colLigneRetour');
			var qteInit = oebr_aArticlesRetour.getCellText(i, 'oebr-colQuantiteRetour');
			var quantite = document.getElementById('oebr-qteSortie').value;
			var nbPiecesInit = oebr_aArticlesRetour.getCellText(i, 'oebr-colNbPiecesRetour');
			if (isEmpty(nbPiecesInit)) { nbPiecesInit = 0; }
			var nbPieces = document.getElementById('oebr-nbPiecesSortie').value;

			if (isEmpty(quantite)) { showWarning("Veuillez entrer une quantité à enlever"); }
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !"); }
			else if (parseFloat(qteInit)-parseFloat(quantite)<0) { showWarning("La quantité à enlever ne peut dépasser la quantité présente dans le bon de retour !"); }
			else if (!isEmpty(nbPieces) && !isPositiveInteger(nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (!isEmpty(nbPieces) && (parseFloat(nbPiecesInit)-parseFloat(nbPieces)<0)) { showWarning("Le nb de pièces à enlever ne peut dépasser le nb de pièces présent dans le bon de retour !"); }
			else {
				var qEnleverArticles = new QueryHttp('Facturation/Retours_Fournisseurs/enleverArticleBonRetour.tmpl');
				qEnleverArticles.setParam("Bon_Id", bonRetourId);
				qEnleverArticles.setParam("Ligne_Id", ligneId);
				qEnleverArticles.setParam("QteInit", qteInit);
				qEnleverArticles.setParam("Quantite", quantite);
				qEnleverArticles.setParam("Nb_Pieces", nbPieces);
				qEnleverArticles.execute();

				oebr_aBRArticlesFourn.initTree();
				oebr_aArticlesRetour.initTree(oebr_checkChangerFourn);
				
				oebr_disableEnlever(true,false);
				document.getElementById('oebr-nbPiecesSortie').value = "";
				document.getElementById('oebr-qteSortie').value = "";
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebr_demandeEnregistrement() {
  try {

		if (oebr_modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées au bon de retour ?")) {
				oebr_enregistrerBon(false);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oebr_setModifie(m) {
  try {
  	oebr_modifie = m;
		if (m) {
			document.getElementById('oebr-tabBon').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('oebr-bValiderBR').disabled = true;
			document.getElementById('oebr-bVisualiser').disabled = (oebr_etatBon!='E');
		}
		else {
			document.getElementById('oebr-tabBon').setAttribute('image', null);
			document.getElementById('oebr-bValiderBR').disabled = (oebr_etatBon=='E');
			document.getElementById('oebr-bVisualiser').disabled = false;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}



function oebr_visualiserBon() {
  try {

		if (oebr_aArticlesRetour.nbLignes()==0) {
			showWarning("Le bon de retour ne contient aucune ligne !");
		}
		else {
			document.getElementById("bRetourBonRetour").collapsed = false;
			document.getElementById("oebr-deckBonRetour").selectedIndex = 1;
			
			oebr_editerBon();
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function oebr_editerBon() {
	try {
		
		var qGenPdf = new QueryHttp("Facturation/Retours_Fournisseurs/pdfBonRetour.tmpl");
		qGenPdf.setParam('Bon_Id', bonRetourId);
		var result = qGenPdf.execute();
		var page = getDirPdf() + result.responseXML.documentElement.getAttribute('FichierPDF');
				
		document.getElementById('oebr-pdfBonRetour').setAttribute("src", page);
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_validerBon() {
  try {

		if (oebr_aArticlesRetour.nbLignes()==0) { showWarning("Le bon de retour ne contient aucune ligne !"); }
		else if (window.confirm("Confirmez-vous la validation du bon de retour ?\n(Attention le bon de retour validé ne pourra plus être modifié !)")) {
			var qValider = new QueryHttp("Facturation/Retours_Fournisseurs/validerBonRetour.tmpl");
			qValider.setParam('Bon_Id', bonRetourId);
			qValider.execute();
			
			oebr_chargerBon();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function oebr_validerReception() {
	try {

		if (window.confirm("Confirmez-vous la validation de la réception ?")) {
		
			document.getElementById('oebr-listeArticlesEnAttente').disabled = true;
			document.getElementById('oebr-qteReceptionnee').disabled = true;
			document.getElementById('oebr-bValiderQteRecep').disabled = true;
			document.getElementById('oebr-bToutCocher').disabled = true;
			document.getElementById('oebr-bToutDecocher').disabled = true;
			document.getElementById('oebr-bValiderReception').disabled = true;
			
			var liste = document.getElementById("oebr-listeArticlesEnAttente");
			var listeArticles = "";
			var nombreElements = liste.getRowCount();
			for (var i=0; i<nombreElements; i++) {
				if (liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
					listeArticles += liste.getItemAtIndex(i).value +";";
					listeArticles += liste.getItemAtIndex(i).getElementsByTagName("listcell").item(4).getAttribute("label") +",";
				}
			}
			
			if (isEmpty(listeArticles)) { showWarning("Veuillez cocher au moins une ligne !"); }
			else {
				var qValiderReception = new QueryHttp("Facturation/Retours_Fournisseurs/validerReception.tmpl");
				qValiderReception.setParam('Bon_Id', bonRetourId);
				qValiderReception.setParam('Liste_Articles', listeArticles);
				qValiderReception.execute();
				
				oebr_aArticlesEnAttente.initTree(oebr_chargerBon);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function oebr_annulerBon() {
	try {

		if (window.confirm("Confirmez-vous l'annulation du bon de retour ?")) {
			var qAnnuler = new QueryHttp("Facturation/Retours_Fournisseurs/annulerBonRetour.tmpl");
			qAnnuler.setParam('Bon_Id', bonRetourId);
			var result = qAnnuler.execute();
			var errors = new Errors(result);

			if (errors.hasNext()) {
				errors.show();
			} else {
				message = result.responseXML.documentElement.getAttribute('Message');
				if (message!=null) {
					showWarning(message);
				}
				oebr_chargerBon();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_rechercherFournisseur() {
	try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie();
    url += "&Nouv=false&Bloque=true";
    window.openDialog(url,'','chrome,modal,centerscreen',oebr_retourRechercherFournisseur);

  } catch (e) {
    recup_erreur(e);
  }
}


function oebr_retourRechercherFournisseur(codeFournisseur) {
	try {
		oebr_fournisseurId = codeFournisseur;
		document.getElementById('oebr-numFournisseur').value = codeFournisseur;
		oebr_setModifie(true);
		oebr_chargerCoord();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_chargerCoord() {
  try {

  	var qGetCoord = new QueryHttp("Facturation/Fournisseurs/getCoord.tmpl");
  	qGetCoord.setParam("Fournisseur_Id", oebr_fournisseurId);
		var result = qGetCoord.execute();
		var contenu = result.responseXML.documentElement;
		
		document.getElementById("oebr-denomination").value = contenu.getAttribute("Denomination");
		document.getElementById("oebr-adresse1").value = contenu.getAttribute("Adresse_Fact");
		document.getElementById("oebr-adresse2").value = contenu.getAttribute("Comp_Adresse_Fact");
		document.getElementById("oebr-adresse3").value = contenu.getAttribute("Adresse_3_Fact");
		document.getElementById("oebr-codePostal").value = contenu.getAttribute("CP_Fact");
		document.getElementById("oebr-ville").value = contenu.getAttribute("Ville_Fact");
		document.getElementById("oebr-codePays").value = contenu.getAttribute("Code_Pays_Fact");

		document.getElementById("oebr-civInter").value = contenu.getAttribute("Civ_Inter");
		document.getElementById("oebr-nomInter").value = contenu.getAttribute("Nom_Inter");
		document.getElementById("oebr-prenomInter").value = contenu.getAttribute("Prenom_Inter");
		document.getElementById("oebr-telInter").value = contenu.getAttribute("Tel_Inter");
		document.getElementById("oebr-faxInter").value = contenu.getAttribute("Fax_Inter");
		document.getElementById("oebr-emailInter").value = contenu.getAttribute("Email_Inter");
		document.getElementById('oebr-bChercherAdresse').disabled = false;
		document.getElementById('oebr-bChercherInter').disabled = false;
		
		oebr_viderChampsTransfert();

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebr_viderChampsTransfert() {
	try {
		oebr_aBRArticlesFourn.clearParams();
		oebr_aBRArticlesFourn.deleteTree();
		document.getElementById('oebr-nbPiecesEntree').disabled = true;
		document.getElementById('oebr-qteEntree').disabled = true;
		document.getElementById('oebr-nbPiecesSortie').disabled = true;
		document.getElementById('oebr-qteSortie').disabled = true;
		document.getElementById('oebr-nbPiecesEntree').value = "";
		document.getElementById('oebr-qteEntree').value = "";
		document.getElementById('oebr-nbPiecesSortie').value = "";
		document.getElementById('oebr-qteSortie').value = "";
		document.getElementById('oebr-bAjouter').disabled = true;
		document.getElementById('oebr-bEnlever').disabled = true;
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_rechercherAdr() {
  try {
  	
  	oebr_currentCodePays = document.getElementById('oebr-codePays').value;

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdrCom.xul?"+ cookie() +"&Fournisseur_Id="+ urlEncode(oebr_fournisseurId);
    window.openDialog(url,'','chrome,modal,centerscreen', oebr_reporterAdr);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebr_reporterAdr(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact) {
  try {
  	
		document.getElementById('oebr-denomination').value = nom;
		document.getElementById('oebr-adresse1').value = adr1;		
		document.getElementById('oebr-adresse2').value = adr2;
		document.getElementById('oebr-adresse3').value = adr3;
		document.getElementById('oebr-codePostal').value = cp;
		document.getElementById('oebr-ville').value = ville;
	  document.getElementById('oebr-codePays').value = code_pays;
		
		if (!isEmpty(contact)) {
			var qInter = new QueryHttp("Facturation/Fournisseurs/getContact.tmpl");
	  	qInter.setParam("Num_Inter", contact);
	  	var result = qInter.execute();
	  	var content = result.responseXML.documentElement;
	  	oebr_reporterInter(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  } else {
			oebr_setModifie(true);
	  }

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebr_rechercherInterlocuteur() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInterFournisseur.xul?"+ cookie() +"&Fournisseur_Id="+ urlEncode(oebr_fournisseurId);
    window.openDialog(url,'','chrome,modal,centerscreen',oebr_reporterInter);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebr_reporterInter(civ, civCourte,nom, prenom, tel, fax, email) {
  try {
		document.getElementById('oebr-civInter').value = civ;
		document.getElementById('oebr-nomInter').value = nom;		
		document.getElementById('oebr-prenomInter').value = prenom;
		document.getElementById('oebr-telInter').value = tel;
		document.getElementById('oebr-faxInter').value = fax;
		document.getElementById('oebr-emailInter').value = email;
		
		oebr_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}

function oebr_choisirMentions() {
  try {
  	
  	var ok = true;
  	
  	if (oebr_mode=="C") {
			ok = oebr_enregistrerBon(true);
		}

		if (ok) {
			var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Bon_Retour_Fournisseur&Doc_Id="+ bonRetourId;
	    window.openDialog(url,'','chrome,modal,centerscreen',oebr_setModifie);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oebr_initVersion() {
	try {
		
		oebr_aVersion.setParam("Type_Document", "Bon_Retour_Fournisseur");
		oebr_aVersion.setParam("Document_Id", bonRetourId);
		oebr_aVersion.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_initListeArticlesEnAttente() {
	try {
		// on désactive la case à cocher des lignes dont Reliquat=0
		var existeCoche = false;
		var listbox = document.getElementById('oebr-listeArticlesEnAttente');
		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;

			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				if (parseFloat(cks.item(4).getAttribute("label"))==0) { cks.item(0).setAttribute("disabled", true); }
				else {
					cks.item(0).setAttribute("checked", true);
					existeCoche = true;
				}
				i++;
			}
		}
		
		document.getElementById('oebr-bValiderReception').disabled = (!existeCoche);
		
		document.getElementById('oebr-qteReceptionnee').value = "";
		document.getElementById('oebr-qteReceptionnee').disabled = true;
		document.getElementById('oebr-bValiderQteRecep').disabled = true;
		document.getElementById('oebr-bToutCocher').disabled = false;
		document.getElementById('oebr-bToutDecocher').disabled = false;
		
		document.getElementById('oebr-listeArticlesEnAttente').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_checkValidationPossible() {
	try {
		var existeCoche = false;
		var listbox = document.getElementById('oebr-listeArticlesEnAttente');

		var nbLignes = listbox.getRowCount();
		var i = 0;

		while (i<nbLignes && !existeCoche) {
			var item = listbox.getItemAtIndex(i);
			var cks = item.getElementsByTagName("listcell");
			if ((cks.item(0).getAttribute("checked")=="true") && (parseFloat(cks.item(4).getAttribute("label"))>0)) {
				existeCoche=true;
			}
			i++;
		}
		
		document.getElementById('oebr-bValiderReception').disabled = (!existeCoche);
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_toutCocherArticles(b) {
	try {

		var listbox = document.getElementById('oebr-listeArticlesEnAttente');
		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;

			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				if (!cks.item(0).getAttribute("disabled")) { cks.item(0).setAttribute("checked", b); }
				i++;
			}
			
			oebr_checkValidationPossible();
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_selectOnListeArticlesEnAttente() {
	try {
		var liste = document.getElementById("oebr-listeArticlesEnAttente");
		if (liste.selectedIndex!=-1) {
			var item = liste.getItemAtIndex(liste.selectedIndex);
			var cell = item.getElementsByTagName("listcell");
			var desactiver = cell.item(0).getAttribute("disabled");
			document.getElementById('oebr-qteReceptionnee').value = (desactiver?"":cell.item(4).getAttribute("label"));
			document.getElementById('oebr-qteReceptionnee').disabled = desactiver;
			document.getElementById('oebr-bValiderQteRecep').disabled = desactiver;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_testCheck(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		var desactiver = cks.item(0).getAttribute("disabled");
		if (!desactiver) {
			if (cks.item(0).getAttribute("checked")=="false") {
				cks.item(0).setAttribute("checked","true");
			} else {
				cks.item(0).setAttribute("checked","false");
				cks.item(4).setAttribute("label", "0");
				document.getElementById('oebr-qteReceptionnee').value = "0";
			}
			oebr_checkValidationPossible();
		}
		document.getElementById('oebr-qteReceptionnee').value = (desactiver?"":cks.item(4).getAttribute("label"));
		document.getElementById('oebr-qteReceptionnee').disabled = desactiver;
		document.getElementById('oebr-bValiderQteRecep').disabled = desactiver;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_pressOnQteRecep(ev) {
	try {
		if (ev.keyCode==13) {
			oebr_changerQteRecep();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oebr_changerQteRecep() {
	try {
		var qte = document.getElementById("oebr-qteReceptionnee").value;
		var liste = document.getElementById("oebr-listeArticlesEnAttente");
		
		if (liste.selectedIndex==-1) { showWarning("Veuillez sélectionner une ligne !"); }
		else if (isEmpty(qte) || !isPositiveOrNull(qte)) { showWarning("La quantité est incorrecte !"); }
		else {
			qte = parseFloat(qte);
			var item = liste.getItemAtIndex(liste.selectedIndex);
			var cell = item.getElementsByTagName("listcell");
			var reliquat = parseFloat(cell.item(3).getAttribute("label"));
			if (qte > reliquat) { showWarning("La quantité doit être inférieure ou égale au reliquat !"); }
			else {
				cell.item(4).setAttribute("label",nfQte.format(qte));
				cell.item(0).setAttribute("checked",(isPositive(qte)));
				cell.item(3).setAttribute("label",nfQte.format(reliquat-qte));
				liste.selectedIndex = -1;
				document.getElementById("oebr-qteReceptionnee").value = "";
				document.getElementById('oebr-qteReceptionnee').disabled = true;
				document.getElementById('oebr-bValiderQteRecep').disabled = true;
				
				oebr_checkValidationPossible();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

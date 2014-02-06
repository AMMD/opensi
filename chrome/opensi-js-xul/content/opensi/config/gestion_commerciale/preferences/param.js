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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var curLangueDefaut;

function init() {
	try {

		loadPhoto();

		var aEtiquettes = new Arbre('Config/GetRDF/listeModelesEtiquettes.tmpl', 'Modele_Etiquette');
		aEtiquettes.initTree(init_2);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_2() {
	try {

		var aCodesRegimeIntro = new Arbre('Config/GetRDF/listeCodesRegime.tmpl', 'Code_Regime_Intro');
		aCodesRegimeIntro.setParam('Type_Regime', 0);
		aCodesRegimeIntro.initTree(init_3);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_3() {
	try {

		var aCodesRegimeExpe = new Arbre('Config/GetRDF/listeCodesRegime.tmpl', 'Code_Regime_Expe');
		aCodesRegimeExpe.setParam('Type_Regime', 1);
		aCodesRegimeExpe.initTree(init_4);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_4() {
	try {

		var aTransactionsIntro = new Arbre('Config/GetRDF/listeNatureTransaction.tmpl', 'Nature_Transaction_Intro');
		aTransactionsIntro.initTree(init_5);

	} catch (e) {
		recup_erreur(e);
	}
}

function init_5() {
	try {

		var aTransactionsExpe = new Arbre('Config/GetRDF/listeNatureTransaction.tmpl', 'Nature_Transaction_Expe');
		aTransactionsExpe.initTree(init_6);

	} catch (e) {
		recup_erreur(e);
	}
}

function init_6() {
	try {

		var aCondLivIntro = new Arbre('Config/GetRDF/listeConditionsLivraison.tmpl', 'Conditions_Liv_Intro');
		aCondLivIntro.initTree(init_7);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_7() {
	try {

		var aCondLivExpe = new Arbre('Config/GetRDF/listeConditionsLivraison.tmpl', 'Conditions_Liv_Expe');
		aCondLivExpe.initTree(init_8);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_8() {
	try {

		var aModesTransportIntro = new Arbre('Config/GetRDF/listeModesTransport.tmpl', 'Modes_Transport_Intro');
		aModesTransportIntro.initTree(init_9);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_9() {
	try {

		var aModesTransportExpe = new Arbre('Config/GetRDF/listeModesTransport.tmpl', 'Modes_Transport_Expe');
		aModesTransportExpe.initTree(init_10);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_10() {
	try {

		var aBanques = new Arbre('Config/GetRDF/listeBanques.tmpl', 'Banque');
		aBanques.initTree(init_11);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_11() {
	try {

		var aModesLivraison = new Arbre('Config/GetRDF/listeModesLivraison.tmpl', 'Def_Mode_Expedition');
		aModesLivraison.initTree(init_12);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_12() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_DC');
		aModelesPdf.setParam("Type_Modele", "Devis");
		aModelesPdf.initTree(init_13);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_13() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_CC');
		aModelesPdf.setParam("Type_Modele", "Commande_Client");
		aModelesPdf.initTree(init_14);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_14() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_BL');
		aModelesPdf.setParam("Type_Modele", "Bon_Livraison");
		aModelesPdf.initTree(init_15);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_15() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_BP');
		aModelesPdf.setParam("Type_Modele", "Bon_Preparation");
		aModelesPdf.initTree(init_16);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_16() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_FC');
		aModelesPdf.setParam("Type_Modele", "Facture_Client");
		aModelesPdf.initTree(init_17);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_17() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_AC');
		aModelesPdf.setParam("Type_Modele", "Avoir_Client");
		aModelesPdf.initTree(init_18);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_18() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_CF');
		aModelesPdf.setParam("Type_Modele", "Commande_Fournisseur");
		aModelesPdf.initTree(init_19);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_19() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_BR');
		aModelesPdf.setParam("Type_Modele", "Bon_Reception");
		aModelesPdf.initTree(init_20);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_20() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_FF');
		aModelesPdf.setParam("Type_Modele", "Facture_Fournisseur");
		aModelesPdf.initTree(init_21);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_21() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_AF');
		aModelesPdf.setParam("Type_Modele", "Avoir_Fournisseur");
		aModelesPdf.initTree(init_22);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_22() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_RC');
		aModelesPdf.setParam("Type_Modele", "Bon_Retour_Client");
		aModelesPdf.initTree(init_23);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_23() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_FAC');
		aModelesPdf.setParam("Type_Modele", "Acompte_Client");
		aModelesPdf.initTree(init_24);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_24() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_FAF');
		aModelesPdf.setParam("Type_Modele", "Acompte_Fournisseur");
		aModelesPdf.initTree(init_25);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_25() {
	try {

		var aModelesPdf = new Arbre('Config/GetRDF/listeModelesPdf.tmpl', 'Modele_Pdf_RF');
		aModelesPdf.setParam("Type_Modele", "Bon_Retour_Fournisseur");
		aModelesPdf.initTree(init_26);

	} catch (e) {
    recup_erreur(e);
  }
}


function init_26() {
	try {

		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'Email_VCC');
		aEmails.initTree(init_27);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_27() {
	try {

		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'Email_ACC');
		aEmails.initTree(init_28);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_28() {
	try {

		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'Email_ECC');
		aEmails.initTree(init_29);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_29() {
	try {

		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'Email_PCC');
		aEmails.initTree(init_30);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_30() {
	try {

		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'Email_VFC');
		aEmails.initTree(init_31);

	} catch (e) {
    recup_erreur(e);
  }
}

function init_31() {
	try {

		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'Email_VAC');
		aEmails.initTree(chargerParametrage);

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerParametrage() {
	try {

		var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();
		var contenu = result.responseXML.documentElement;

		document.getElementById('Mode_Tarif').value = contenu.getAttribute('Mode_Tarif');
		document.getElementById('Frais_Port_Prem').value = contenu.getAttribute('Frais_Port_Prem');
		document.getElementById('Type_Fact').value = contenu.getAttribute('Def_Type_Fact');
		document.getElementById('Mode_Facturation').checked = (contenu.getAttribute('Def_Mode_Facturation')=="C");
		document.getElementById('Periode_Facturation').value = contenu.getAttribute('Def_Periode_Facturation');
		document.getElementById('Mode_Envoi_Facture').value = contenu.getAttribute('Def_Mode_Envoi_Facture');
		document.getElementById('Mode_Facturation').disabled = (contenu.getAttribute('Def_Type_Fact')=="BL");
		document.getElementById('Module_Envoi').checked = (contenu.getAttribute('Module_Envoi')==1);
		document.getElementById('Imp_Ex_Fact_Ent').checked = (contenu.getAttribute('Imp_Ex_Fact_Ent')==1);
		document.getElementById('Modele_Pdf_DC').value = contenu.getAttribute('Modele_Pdf_DC');
		document.getElementById('Modele_Pdf_CC').value = contenu.getAttribute('Modele_Pdf_CC');
		document.getElementById('Modele_Pdf_BL').value = contenu.getAttribute('Modele_Pdf_BL');
		document.getElementById('Modele_Pdf_BP').value = contenu.getAttribute('Modele_Pdf_BP');
		document.getElementById('Modele_Pdf_FC').value = contenu.getAttribute('Modele_Pdf_FC');
		document.getElementById('Modele_Pdf_AC').value = contenu.getAttribute('Modele_Pdf_AC');
		document.getElementById('Modele_Pdf_CF').value = contenu.getAttribute('Modele_Pdf_CF');
		document.getElementById('Modele_Pdf_BR').value = contenu.getAttribute('Modele_Pdf_BR');
		document.getElementById('Modele_Pdf_FF').value = contenu.getAttribute('Modele_Pdf_FF');
		document.getElementById('Modele_Pdf_AF').value = contenu.getAttribute('Modele_Pdf_AF');
		document.getElementById('Modele_Pdf_RC').value = contenu.getAttribute('Modele_Pdf_RC');
		document.getElementById('Modele_Pdf_FAC').value = contenu.getAttribute('Modele_Pdf_FAC');
		document.getElementById('Modele_Pdf_FAF').value = contenu.getAttribute('Modele_Pdf_FAF');
		document.getElementById('Modele_Pdf_RF').value = contenu.getAttribute('Modele_Pdf_RF');
		document.getElementById('Email_VCC').value = contenu.getAttribute('Email_VCC');
		document.getElementById('Email_ACC').value = contenu.getAttribute('Email_ACC');
		document.getElementById('Email_ECC').value = contenu.getAttribute('Email_ECC');
		document.getElementById('Email_PCC').value = contenu.getAttribute('Email_PCC');
		document.getElementById('Email_VFC').value = contenu.getAttribute('Email_VFC');
		document.getElementById('Email_VAC').value = contenu.getAttribute('Email_VAC');
		
		document.getElementById('Com_Devis').value = contenu.getAttribute('Com_Devis');
		document.getElementById('Com_Fact').value = contenu.getAttribute('Com_Fact');
		document.getElementById('Com_BL').value = contenu.getAttribute('Com_BL');

		document.getElementById('Imp_Nom_Fiche').checked = (contenu.getAttribute('Imp_Nom_Fiche')==1);
		document.getElementById('Imp_Nom_OF').checked = (contenu.getAttribute('Imp_Nom_OF')==1);
		document.getElementById('Imp_Nom_Facture').checked = (contenu.getAttribute('Imp_Nom_Facture')==1);
		document.getElementById('Imp_Nom_Bon').checked = (contenu.getAttribute('Imp_Nom_Bon')==1);
		document.getElementById('Imp_Nom_Devis').checked = (contenu.getAttribute('Imp_Nom_Devis')==1);
		document.getElementById('Imp_Nom_BP').checked = (contenu.getAttribute('Imp_Nom_BP')==1);
		document.getElementById('Imp_Nom_BCF').checked = (contenu.getAttribute('Imp_Nom_BCF')==1);

		document.getElementById('Imp_Desc1_Fiche').checked = (contenu.getAttribute('Imp_Desc1_Fiche')==1);
		document.getElementById('Imp_Desc1_OF').checked = (contenu.getAttribute('Imp_Desc1_OF')==1);
		document.getElementById('Imp_Desc1_Facture').checked = (contenu.getAttribute('Imp_Desc1_Facture')==1);
		document.getElementById('Imp_Desc1_Bon').checked = (contenu.getAttribute('Imp_Desc1_Bon')==1);
		document.getElementById('Imp_Desc1_Devis').checked = (contenu.getAttribute('Imp_Desc1_Devis')==1);
		document.getElementById('Imp_Desc1_BP').checked = (contenu.getAttribute('Imp_Desc1_BP')==1);
		document.getElementById('Imp_Desc1_BCF').checked = (contenu.getAttribute('Imp_Desc1_BCF')==1);

		document.getElementById('Imp_Desc2_Fiche').checked = (contenu.getAttribute('Imp_Desc2_Fiche')==1);
		document.getElementById('Imp_Desc2_OF').checked = (contenu.getAttribute('Imp_Desc2_OF')==1);
		document.getElementById('Imp_Desc2_Facture').checked = (contenu.getAttribute('Imp_Desc2_Facture')==1);
		document.getElementById('Imp_Desc2_Bon').checked = (contenu.getAttribute('Imp_Desc2_Bon')==1);
		document.getElementById('Imp_Desc2_Devis').checked = (contenu.getAttribute('Imp_Desc2_Devis')==1);
		document.getElementById('Imp_Desc2_BP').checked = (contenu.getAttribute('Imp_Desc2_BP')==1);
		document.getElementById('Imp_Desc2_BCF').checked = (contenu.getAttribute('Imp_Desc2_BCF')==1);

		document.getElementById('Logo_Adr').checked = (contenu.getAttribute('Logo_Adr')==1);

		document.getElementById('Banque').value = contenu.getAttribute('Banque');
		document.getElementById('Lien_Fichier').value = contenu.getAttribute('Lien_Fichier');
		document.getElementById('Lien_Distant').value = contenu.getAttribute('Lien_Distant');
		document.getElementById('Dossier_Fichier').value = contenu.getAttribute('Dossier_Fichier');
		
		document.getElementById('lbl_1').value = contenu.getAttribute('lbl_1');
		document.getElementById('lbl_2').value = contenu.getAttribute('lbl_2');
		document.getElementById('lbl_3').value = contenu.getAttribute('lbl_3');
		document.getElementById('lbl_4').value = contenu.getAttribute('lbl_4');
		document.getElementById('lbl_5').value = contenu.getAttribute('lbl_5');
		

		document.getElementById('lblCoeff1').value = "Coeff. " + contenu.getAttribute('Label_Tarif_1') + " :";
		document.getElementById('lblCoeff2').value = "Coeff. " + contenu.getAttribute('Label_Tarif_2') + " :";
		document.getElementById('lblCoeff3').value = "Coeff. " + contenu.getAttribute('Label_Tarif_3') + " :";
		document.getElementById('lblCoeff4').value = "Coeff. " + contenu.getAttribute('Label_Tarif_4') + " :";
		document.getElementById('lblCoeff5').value = "Coeff. " + contenu.getAttribute('Label_Tarif_5') + " :";
		document.getElementById('Coeff_1').value = contenu.getAttribute('Coeff_1');
		document.getElementById('Coeff_2').value = contenu.getAttribute('Coeff_2');
		document.getElementById('Coeff_3').value = contenu.getAttribute('Coeff_3');
		document.getElementById('Coeff_4').value = contenu.getAttribute('Coeff_4');
		document.getElementById('Coeff_5').value = contenu.getAttribute('Coeff_5');

		document.getElementById('Modele_Etiquette').value = contenu.getAttribute('Modele_Etiquette');
		document.getElementById('Def_Mode_Expedition').value = contenu.getAttribute('Def_Mode_Expedition');

		document.getElementById('Vente_TTC').checked = (contenu.getAttribute('Vente_TTC')==1);
		document.getElementById('Imp_LCR').checked = (contenu.getAttribute('Imp_LCR')==1);
		document.getElementById('Imp_RIB').checked = (contenu.getAttribute('Imp_RIB')==1);
		document.getElementById('BL_Chiffre').checked = (contenu.getAttribute('BL_Chiffre')==1);
		document.getElementById('BR_Chiffre').checked = (contenu.getAttribute('BR_Chiffre')==1);
		document.getElementById('Calcul_Stock').checked = (contenu.getAttribute('Calcul_Stock')==1);
    document.getElementById('Type_Calcul_Stock').checked = (contenu.getAttribute('Type_Calcul_Stock')==1);
		document.getElementById('Duree_Reservation').value = contenu.getAttribute('Duree_Reservation');
		document.getElementById('Act_Code_Stats').checked = (contenu.getAttribute('Act_Code_Stats')==1);
		document.getElementById('Produit_Frais').checked = (contenu.getAttribute('Produit_Frais')==1);
		document.getElementById('Act_Commission').checked = (contenu.getAttribute('Act_Commission')==1);
		document.getElementById('Imprimer_Adr_Liv').checked = (contenu.getAttribute('Imprimer_Adr_Liv')==1);
		document.getElementById('Statut_Expe_Prep').checked = (contenu.getAttribute('Statut_Expe_Prep')==1);
		document.getElementById('Alerte_Encours_Client').checked = (contenu.getAttribute('Alerte_Encours_Client')==1);
		document.getElementById('Act_Code_Produit').checked = (contenu.getAttribute('Act_Code_Produit')==1);
		document.getElementById('Act_Activation_CP').checked = (contenu.getAttribute('Act_Activation_CP')==1);
		checkActCodeProduit();
		document.getElementById('Act_Outillage').checked = (contenu.getAttribute('Act_Outillage')==1);

		document.getElementById('Niveau_Obligation_Intro').value = contenu.getAttribute('Niveau_Obligation_Intro');
		document.getElementById('Niveau_Obligation_Expe').value = contenu.getAttribute('Niveau_Obligation_Expe');
		document.getElementById('Code_Regime_Intro').value = contenu.getAttribute('Code_Regime_Intro');
		document.getElementById('Code_Regime_Expe').value = contenu.getAttribute('Code_Regime_Expe');
		document.getElementById('Nature_Transaction_Intro').value = contenu.getAttribute('Nature_Transaction_Intro');
		document.getElementById('Nature_Transaction_Expe').value = contenu.getAttribute('Nature_Transaction_Expe');
		document.getElementById('Conditions_Liv_Intro').value = contenu.getAttribute('Conditions_Liv_Intro');
		document.getElementById('Conditions_Liv_Expe').value = contenu.getAttribute('Conditions_Liv_Expe');
		document.getElementById('Modes_Transport_Intro').value = contenu.getAttribute('Mode_Transport_Intro');
		document.getElementById('Modes_Transport_Expe').value = contenu.getAttribute('Mode_Transport_Expe');

		document.getElementById('Mode_Traitement').value = contenu.getAttribute('Mode_Traitement');
		document.getElementById('Def_Etat_Rech_Com').value = contenu.getAttribute('Def_Etat_Rech_Com');
		document.getElementById('Def_Etat_Rech_Log').value = contenu.getAttribute('Def_Etat_Rech_Log');
		document.getElementById('Timeout_Commande').value = (contenu.getAttribute('Timeout_Commande')=="0"?"":contenu.getAttribute('Timeout_Commande'));

		document.getElementById('Def_Etat_Rech_Com_Four').value = contenu.getAttribute('Def_Etat_Rech_Com_Four');
		
		action_DEB();
		
		curLangueDefaut = result.responseXML.documentElement.getAttribute("Langue_Defaut");
		var aLangues = new Arbre("Config/GetRDF/liste-langues.tmpl", "langueDefaut");
		aLangues.setParam("Selection", curLangueDefaut);
		aLangues.initTree(initLangueDefaut);

	} catch (e) {
    recup_erreur(e);
  }
}


function initLangueDefaut() {
	try {
		document.getElementById('langueDefaut').value = curLangueDefaut;
	} catch (e) {
		recup_erreur(e);
	}
}


function checkActCodeProduit() {
	try {
		var actCodeProduit = document.getElementById('Act_Code_Produit').checked;
		document.getElementById('Act_Activation_CP').disabled = !actCodeProduit;
		if (!actCodeProduit) {
			document.getElementById('Act_Activation_CP').checked = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function action_DEB() {
	try {
		var niveauObligationIntro = document.getElementById('Niveau_Obligation_Intro').value;
		document.getElementById('Code_Regime_Intro').disabled = (niveauObligationIntro!=1);
		document.getElementById('Nature_Transaction_Intro').disabled = (niveauObligationIntro>2);
		document.getElementById('Conditions_Liv_Intro').disabled = (niveauObligationIntro>2);
		document.getElementById('Modes_Transport_Intro').disabled = (niveauObligationIntro!=1);

		var niveauObligationExpe = document.getElementById('Niveau_Obligation_Expe').value;
		var codeRegimeExpe = document.getElementById('Code_Regime_Expe').value;
		document.getElementById('Nature_Transaction_Expe').disabled = (niveauObligationExpe>2 || (codeRegimeExpe==25 || codeRegimeExpe==26 || codeRegimeExpe==31));
		document.getElementById('Conditions_Liv_Expe').disabled = (niveauObligationExpe>2);
		document.getElementById('Modes_Transport_Expe').disabled = (niveauObligationExpe!=1 || (codeRegimeExpe==25 || codeRegimeExpe==26 || codeRegimeExpe==31));
	} catch (e) {
		recup_erreur(e);
	}
}


function enregistrerParametrage() {
	try {
		
		var corps = cookie() +"&Page=Config/gestion_commerciale/preferences/modifierParam.tmpl&ContentType=xml";
		corps += "&Mode_Tarif="+ document.getElementById('Mode_Tarif').value;
		corps += "&Frais_Port_Prem="+ document.getElementById('Frais_Port_Prem').value;
		corps += "&Com_Devis="+ urlEncode(document.getElementById('Com_Devis').value);
		corps += "&Com_Fact="+ urlEncode(document.getElementById('Com_Fact').value);
		corps += "&Com_BL="+ urlEncode(document.getElementById('Com_BL').value);
		corps += "&Modele_Etiquette="+ urlEncode(document.getElementById('Modele_Etiquette').value);
		corps += "&Vente_TTC="+ (document.getElementById('Vente_TTC').checked?"1":"0");
		corps += "&Imp_LCR="+ (document.getElementById('Imp_LCR').checked?"1":"0");
		corps += "&Imp_RIB="+ (document.getElementById('Imp_RIB').checked?"1":"0");
		corps += "&BL_Chiffre="+ (document.getElementById('BL_Chiffre').checked?"1":"0");
		corps += "&BR_Chiffre="+ (document.getElementById('BR_Chiffre').checked?"1":"0");
		corps += "&Calcul_Stock="+ (document.getElementById('Calcul_Stock').checked?"1":"0");
    corps += "&Type_Calcul_Stock="+ (document.getElementById('Type_Calcul_Stock').checked?"1":"0");
		corps += "&Duree_Reservation="+ urlEncode(document.getElementById('Duree_Reservation').value);
		corps += "&Act_Code_Stats="+ (document.getElementById('Act_Code_Stats').checked?"1":"0");
		corps += "&Produit_Frais="+ (document.getElementById('Produit_Frais').checked?"1":"0");
		corps += "&Act_Commission="+ (document.getElementById('Act_Commission').checked?"1":"0");
		corps += "&Act_Code_Produit=" + (document.getElementById('Act_Code_Produit').checked?"1":"0");
		corps += "&Act_Activation_CP=" + (document.getElementById('Act_Activation_CP').checked?"1":"0");
		corps += "&Act_Outillage="+ (document.getElementById('Act_Outillage').checked?"1":"0");
		corps += "&Imprimer_Adr_Liv="+ (document.getElementById('Imprimer_Adr_Liv').checked?"1":"0");
		corps += "&Statut_Expe_Prep="+ (document.getElementById('Statut_Expe_Prep').checked?"1":"0");
		corps += "&Alerte_Encours_Client="+ (document.getElementById('Alerte_Encours_Client').checked?"1":"0");
		corps += "&Niveau_Obligation_Intro="+ urlEncode(document.getElementById('Niveau_Obligation_Intro').value);
		corps += "&Niveau_Obligation_Expe="+ urlEncode(document.getElementById('Niveau_Obligation_Expe').value);
		corps += "&Code_Regime_Intro="+ urlEncode(document.getElementById('Code_Regime_Intro').value);
		corps += "&Code_Regime_Expe="+ urlEncode(document.getElementById('Code_Regime_Expe').value);
		corps += "&Nature_Transaction_Intro="+ urlEncode(document.getElementById('Nature_Transaction_Intro').value);
		corps += "&Nature_Transaction_Expe="+ urlEncode(document.getElementById('Nature_Transaction_Expe').value);
		corps += "&Conditions_Liv_Intro="+ urlEncode(document.getElementById('Conditions_Liv_Intro').value);
		corps += "&Conditions_Liv_Expe="+ urlEncode(document.getElementById('Conditions_Liv_Expe').value);
		corps += "&Mode_Transport_Intro="+ urlEncode(document.getElementById('Modes_Transport_Intro').value);
		corps += "&Mode_Transport_Expe="+ urlEncode(document.getElementById('Modes_Transport_Expe').value);
		corps += "&Def_Mode_Expedition="+ document.getElementById('Def_Mode_Expedition').value;

		corps += "&Def_Type_Fact="+ urlEncode(document.getElementById('Type_Fact').value);
		corps += "&Def_Mode_Facturation="+ (document.getElementById('Mode_Facturation').checked?"C":"E");
		corps += "&Def_Periode_Facturation="+ urlEncode(document.getElementById('Periode_Facturation').value);
		corps += "&Def_Mode_Envoi_Facture="+ urlEncode(document.getElementById('Mode_Envoi_Facture').value);
		corps += "&Module_Envoi="+ (document.getElementById('Module_Envoi').checked?"1":"0");
		corps += "&Imp_Ex_Fact_Ent="+ (document.getElementById('Imp_Ex_Fact_Ent').checked?"1":"0");
		corps += "&Modele_Pdf_DC="+ urlEncode(document.getElementById('Modele_Pdf_DC').value);
		corps += "&Modele_Pdf_CC="+ urlEncode(document.getElementById('Modele_Pdf_CC').value);
		corps += "&Modele_Pdf_BL="+ urlEncode(document.getElementById('Modele_Pdf_BL').value);
		corps += "&Modele_Pdf_BP="+ urlEncode(document.getElementById('Modele_Pdf_BP').value);
		corps += "&Modele_Pdf_FC="+ urlEncode(document.getElementById('Modele_Pdf_FC').value);
		corps += "&Modele_Pdf_AC="+ urlEncode(document.getElementById('Modele_Pdf_AC').value);
		corps += "&Modele_Pdf_CF="+ urlEncode(document.getElementById('Modele_Pdf_CF').value);
		corps += "&Modele_Pdf_BR="+ urlEncode(document.getElementById('Modele_Pdf_BR').value);
		corps += "&Modele_Pdf_FF="+ urlEncode(document.getElementById('Modele_Pdf_FF').value);
		corps += "&Modele_Pdf_AF="+ urlEncode(document.getElementById('Modele_Pdf_AF').value);
		corps += "&Modele_Pdf_RC="+ urlEncode(document.getElementById('Modele_Pdf_RC').value);
		corps += "&Modele_Pdf_FAC="+ urlEncode(document.getElementById('Modele_Pdf_FAC').value);
		corps += "&Modele_Pdf_FAF="+ urlEncode(document.getElementById('Modele_Pdf_FAF').value);
		corps += "&Modele_Pdf_RF="+ urlEncode(document.getElementById('Modele_Pdf_RF').value);
		corps += "&Email_VCC="+ urlEncode(document.getElementById('Email_VCC').value);
		corps += "&Email_ACC="+ urlEncode(document.getElementById('Email_ACC').value);
		corps += "&Email_ECC="+ urlEncode(document.getElementById('Email_ECC').value);
		corps += "&Email_PCC="+ urlEncode(document.getElementById('Email_PCC').value);
		corps += "&Email_VFC="+ urlEncode(document.getElementById('Email_VFC').value);
		corps += "&Email_VAC="+ urlEncode(document.getElementById('Email_VAC').value);
		
		corps += "&Imp_Nom_Fiche="+ (document.getElementById('Imp_Nom_Fiche').checked?"1":"0");
		corps += "&Imp_Nom_OF="+ (document.getElementById('Imp_Nom_OF').checked?"1":"0");
		corps += "&Imp_Nom_Facture="+ (document.getElementById('Imp_Nom_Facture').checked?"1":"0");
		corps += "&Imp_Nom_Bon="+ (document.getElementById('Imp_Nom_Bon').checked?"1":"0");
		corps += "&Imp_Nom_Devis="+ (document.getElementById('Imp_Nom_Devis').checked?"1":"0");
		corps += "&Imp_Nom_BP="+ (document.getElementById('Imp_Nom_BP').checked?"1":"0");
		corps += "&Imp_Nom_BCF="+ (document.getElementById('Imp_Nom_BCF').checked?"1":"0");

		corps += "&Imp_Desc1_Fiche="+ (document.getElementById('Imp_Desc1_Fiche').checked?"1":"0");
		corps += "&Imp_Desc1_OF="+ (document.getElementById('Imp_Desc1_OF').checked?"1":"0");
		corps += "&Imp_Desc1_Facture="+ (document.getElementById('Imp_Desc1_Facture').checked?"1":"0");
		corps += "&Imp_Desc1_Bon="+ (document.getElementById('Imp_Desc1_Bon').checked?"1":"0");
		corps += "&Imp_Desc1_Devis="+ (document.getElementById('Imp_Desc1_Devis').checked?"1":"0");
		corps += "&Imp_Desc1_BP="+ (document.getElementById('Imp_Desc1_BP').checked?"1":"0");
		corps += "&Imp_Desc1_BCF="+ (document.getElementById('Imp_Desc1_BCF').checked?"1":"0");

		corps += "&Imp_Desc2_Fiche="+ (document.getElementById('Imp_Desc2_Fiche').checked?"1":"0");
		corps += "&Imp_Desc2_OF="+ (document.getElementById('Imp_Desc2_OF').checked?"1":"0");
		corps += "&Imp_Desc2_Facture="+ (document.getElementById('Imp_Desc2_Facture').checked?"1":"0");
		corps += "&Imp_Desc2_Bon="+ (document.getElementById('Imp_Desc2_Bon').checked?"1":"0");
		corps += "&Imp_Desc2_Devis="+ (document.getElementById('Imp_Desc2_Devis').checked?"1":"0");
		corps += "&Imp_Desc2_BP="+ (document.getElementById('Imp_Desc2_BP').checked?"1":"0");
		corps += "&Imp_Desc2_BCF="+ (document.getElementById('Imp_Desc2_BCF').checked?"1":"0");

		corps += "&Logo_Adr="+ (document.getElementById('Logo_Adr').checked?"1":"0");
		corps += "&Banque=" + document.getElementById('Banque').value;
		corps += "&Lien_Fichier="+ urlEncode(document.getElementById('Lien_Fichier').value);
		corps += "&Lien_Distant="+ urlEncode(document.getElementById('Lien_Distant').value);
		corps += "&Dossier_Fichier="+ urlEncode(document.getElementById('Dossier_Fichier').value);
		corps += "&Langue_Defaut="+ document.getElementById('langueDefaut').value;
		
		
		var timeout_commande = document.getElementById('Timeout_Commande').value;
		
		corps += "&Mode_Traitement="+ urlEncode(document.getElementById('Mode_Traitement').value);
		corps += "&Def_Etat_Rech_Com="+ urlEncode(document.getElementById('Def_Etat_Rech_Com').value);
		corps += "&Def_Etat_Rech_Log="+ urlEncode(document.getElementById('Def_Etat_Rech_Log').value);
		corps += "&Timeout_Commande="+ (isEmpty(timeout_commande)?0:timeout_commande);
		corps += "&Def_Etat_Rech_Com_Four="+ urlEncode(document.getElementById('Def_Etat_Rech_Com_Four').value);

		var coeff_1 = document.getElementById('Coeff_1').value;
		var coeff_2 = document.getElementById('Coeff_2').value;
		var coeff_3 = document.getElementById('Coeff_3').value;
		var coeff_4 = document.getElementById('Coeff_4').value;
		var coeff_5 = document.getElementById('Coeff_5').value;

		corps += "&Coeff_1="+ coeff_1 +"&Coeff_2="+ coeff_2 +"&Coeff_3="+ coeff_3 +"&Coeff_4="+ coeff_4 +"&Coeff_5="+ coeff_5;
		
		var lbl_1 = document.getElementById('lbl_1').value;
		var lbl_2 = document.getElementById('lbl_2').value;
		var lbl_3 = document.getElementById('lbl_3').value;
		var lbl_4 = document.getElementById('lbl_4').value;
		var lbl_5 = document.getElementById('lbl_5').value;

		corps += "&lbl_1="+ lbl_1 +"&lbl_2="+ lbl_2 +"&lbl_3="+ lbl_3 +"&lbl_4="+ lbl_4 +"&lbl_5="+ lbl_5;

		var duree_reservation = document.getElementById('Duree_Reservation').value;
		var type_fact = document.getElementById('Type_Fact').value;
		var mode_facturation = (document.getElementById('Mode_Facturation').checked?"C":"E");
		if (isEmpty(duree_reservation) || !isPositiveOrNull(duree_reservation)) {
			showWarning("Durée de réservation du stock incorrecte !");
		}
		else if (isEmpty(coeff_1) || !isPositive(coeff_1)) {
			showWarning("Coefficient tarifaire 1 incorrect !");
		}
		else if (isEmpty(coeff_2) || !isPositive(coeff_2)) {
			showWarning("Coefficient tarifaire 2 incorrect !");
		}
		else if (isEmpty(coeff_3) || !isPositive(coeff_3)) {
			showWarning("Coefficient tarifaire 3 incorrect !");
		}
		else if (isEmpty(coeff_4) || !isPositive(coeff_4)) {
			showWarning("Coefficient tarifaire 4 incorrect !");
		}
		else if (isEmpty(coeff_5) || !isPositive(coeff_5)) {
			showWarning("Coefficient tarifaire 5 incorrect !");
		}
		else if (!isEmpty(timeout_commande) && !isPositiveInteger(timeout_commande)) {
			showWarning("Timeout de commande incorrect !");
		}
		else if (type_fact=="BL" && mode_facturation=="C") {
			showWarning("Le type de facturation par BL et le mode de facturation par commande sont incompatibles !");
		}
		else {
			requeteHTTP(corps);
			showMessage("Paramètres sauvegardés !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function loadPhoto() {
  try {
  	
		document.getElementById('Vignette').setAttribute("src", "");
		document.getElementById('Vignette').setAttribute("src", getDirServeur() +"logos/"+ get_cookie('Dossier_Id') +"_small.jpg");

	} catch (e) {
    recup_erreur(e);
  }
}



function voirPhoto() {
  try {

		var url = "chrome://opensi/content/config/gestion_commerciale/preferences/voir_photo.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function changerPhoto() {
  try {

		var url = "chrome://opensi/content/config/gestion_commerciale/preferences/change_photo.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen');

		loadPhoto();

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnTypeFact() {
	try {
		var typeFacturation = document.getElementById('Type_Fact').value;
		if (typeFacturation=="BL") {
			document.getElementById('Mode_Facturation').checked=false;
		}
		document.getElementById('Mode_Facturation').disabled = (typeFacturation=="BL");
	} catch (e) {
		recup_erreur(e);
	}
}

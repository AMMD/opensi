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
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");

var retourEdition = false; // indique si la page précédente était la visualisation PDF
var articleId;  // Fiche_Article_Id
var premierChargement = true;
var numerotationAuto = false;

function init() {
  try {

		window.parent.addEventListener("close",demandeEnregistrement,false);
		
		var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();
		numerotationAuto = (result.responseXML.documentElement.getAttribute("Format_NA")!="");
		
		initPresentation();
		initStock();
	  initPrix();
		initNomenclature();

    if (ParamValeur('Article_Id') != '') {
    	retourEdition = true;
    }

		document.getElementById('Modifie').value = "n";
    setTimeout("rechercherArticle();", 100);

  } catch (e) {
  	recup_erreur(e);
  }
}


function desinit() {
	try {

		window.parent.removeEventListener("close",demandeEnregistrement,false);

	} catch (e) {
  	recup_erreur(e);
  }
}


function hideButtons(b) {
	try {

		document.getElementById('bEnregistrer').collapsed = b;

		if (document.getElementById('Action').value == "M") {
    	document.getElementById('bSupprimer').collapsed = b;
			document.getElementById('bEdition').collapsed = b;
			document.getElementById('bDupliquer').collapsed = b;
		}
		else {
			document.getElementById('bSupprimer').collapsed = true;
			document.getElementById('bEdition').collapsed = true;
			document.getElementById('bDupliquer').collapsed = true;
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function setDefaultValues() {
	try {

		document.getElementById('Panneau').selectedIndex = 0;
		hideButtons(false);

		document.getElementById('rsReference').value = "";
		document.getElementById('rsDesignation').value = "";
		document.getElementById('rsMarque').value = "";
		document.getElementById('rsFamille1').value = "";
		document.getElementById('rsStock_Init').value = "";
    document.getElementById('rsEntrees').value = "";
    document.getElementById('rsSorties').value = "";
    document.getElementById('rsStock_Reel').value = "";
    document.getElementById('rsStock_Virtuel').value = "";
    document.getElementById('rsCUMP').value = "";

		// onglet présentation

		document.getElementById('pArticle_Id').value = "";
		document.getElementById('pRefModele').value = "";
    document.getElementById('pDesignation').value = "";
		document.getElementById('pFamille1').selectedIndex = 0;
		document.getElementById('pFamille2').selectedIndex = 0;
		document.getElementById('pFamille3').selectedIndex = 0;
		op_deleteFamilles();
		op_chargerFamilles("0","0","0");
		op_chargerMarques("0");
		if (!op_circonstAttr1) { op_chargerAttributs1(""); }
		if (!op_circonstAttr2) { op_chargerAttributs2(""); }
		if (!op_circonstAttr3) { op_chargerAttributs3(""); }
		if (!op_circonstAttr4) { op_chargerAttributs4(""); }
		if (!op_circonstAttr5) { op_chargerAttributs5(""); }
		if (!op_circonstAttr6) { op_chargerAttributs6(""); }
    document.getElementById('pLocalisation').value = "";
    document.getElementById('pCode_Barre').value = "";
    document.getElementById('pCode_NC8').value = "";
    document.getElementById('pConditionnement').value = "";
    document.getElementById('pArticle_Substitution').value = "";
    document.getElementById('pNature').value = "1";
    document.getElementById('pTracabilite_CP').checked = false;
		document.getElementById('pArt_Achat').checked = true;
		document.getElementById('pArt_Vente').checked = true;
		document.getElementById('pPrestation').checked = false;
		document.getElementById('pDescrip_1').value = "";
		document.getElementById('pDescrip_2').value = "";
		document.getElementById('pRef_Fabricant').value = "";
		document.getElementById('pComposition').value = "U";

		var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();

    var contenu = result.responseXML.documentElement;

		document.getElementById('pImp_Nom_Fiche').checked = (contenu.getAttribute('Imp_Nom_Fiche')==1);
		document.getElementById('pImp_Nom_OF').checked = (contenu.getAttribute('Imp_Nom_OF')==1);
		document.getElementById('pImp_Nom_Facture').checked = (contenu.getAttribute('Imp_Nom_Facture')==1);
		document.getElementById('pImp_Nom_Bon').checked = (contenu.getAttribute('Imp_Nom_Bon')==1);
		document.getElementById('pImp_Nom_Devis').checked = (contenu.getAttribute('Imp_Nom_Devis')==1);
		document.getElementById('pImp_Nom_BP').checked = (contenu.getAttribute('Imp_Nom_BP')==1);
		document.getElementById('pImp_Nom_BCF').checked = (contenu.getAttribute('Imp_Nom_BCF')==1);

		document.getElementById('pImp_Desc1_Fiche').checked = (contenu.getAttribute('Imp_Desc1_Fiche')==1);
		document.getElementById('pImp_Desc1_OF').checked = (contenu.getAttribute('Imp_Desc1_OF')==1);
		document.getElementById('pImp_Desc1_Facture').checked = (contenu.getAttribute('Imp_Desc1_Facture')==1);
		document.getElementById('pImp_Desc1_Bon').checked = (contenu.getAttribute('Imp_Desc1_Bon')==1);
		document.getElementById('pImp_Desc1_Devis').checked = (contenu.getAttribute('Imp_Desc1_Devis')==1);
		document.getElementById('pImp_Desc1_BP').checked = (contenu.getAttribute('Imp_Desc1_BP')==1);
		document.getElementById('pImp_Desc1_BCF').checked = (contenu.getAttribute('Imp_Desc1_BCF')==1);

		document.getElementById('pImp_Desc2_Fiche').checked = (contenu.getAttribute('Imp_Desc2_Fiche')==1);
		document.getElementById('pImp_Desc2_OF').checked = (contenu.getAttribute('Imp_Desc2_OF')==1);
		document.getElementById('pImp_Desc2_Facture').checked = (contenu.getAttribute('Imp_Desc2_Facture')==1);
		document.getElementById('pImp_Desc2_Bon').checked = (contenu.getAttribute('Imp_Desc2_Bon')==1);
		document.getElementById('pImp_Desc2_Devis').checked = (contenu.getAttribute('Imp_Desc2_Devis')==1);
		document.getElementById('pImp_Desc2_BP').checked = (contenu.getAttribute('Imp_Desc2_BP')==1);
		document.getElementById('pImp_Desc2_BCF').checked = (contenu.getAttribute('Imp_Desc2_BCF')==1);

		document.getElementById('pVignette').src = "chrome://opensi/content/design/default_vignette.jpg";

		// onglet prix
		document.getElementById('Coeff_1').value = contenu.getAttribute('Coeff_1');
    document.getElementById('Coeff_2').value = contenu.getAttribute('Coeff_2');
    document.getElementById('Coeff_3').value = contenu.getAttribute('Coeff_3');
    document.getElementById('Coeff_4').value = contenu.getAttribute('Coeff_4');
    document.getElementById('Coeff_5').value = contenu.getAttribute('Coeff_5');

    document.getElementById("Unite").value = "U";

    document.getElementById('Prix_Achat_Der').value = 0.00;
    document.getElementById('Frais_Appro_Der').value = 0.00;
    document.getElementById('Prix_Revient_Der').value = 0.00;
    document.getElementById('Tarif_1').value = 0;
    document.getElementById('Tarif_2').value = 0;
    document.getElementById('Tarif_3').value = 0;
    document.getElementById('Tarif_4').value = 0;
    document.getElementById('Tarif_5').value = 0;
		document.getElementById('Tarif_1_TTC').value = 0;
    document.getElementById('Tarif_2_TTC').value = 0;
    document.getElementById('Tarif_3_TTC').value = 0;
    document.getElementById('Tarif_4_TTC').value = 0;
    document.getElementById('Tarif_5_TTC').value = 0;
		document.getElementById('Marge_1').value = 0;
    document.getElementById('Marge_2').value = 0;
    document.getElementById('Marge_3').value = 0;
    document.getElementById('Marge_4').value = 0;
    document.getElementById('Marge_5').value = 0;
		document.getElementById('Prix_Achat').value = 0;
		document.getElementById('Frais_Appro').value = 0;
		document.getElementById('Prix_Revient').value = 0;
    document.getElementById('PMP').value = 0;
    document.getElementById('Poids_Brut').value = 0;
    document.getElementById('Poids_Net').value = 0;
		document.getElementById('Colisage').value = 0;
		document.getElementById('Code_TVA').value = 4;
		chargerUnitesPoids(defautUniteIdPoids);
		chargerUnitesDimensions(defautUniteIdDim);
		document.getElementById('longueur').value = 0;
		document.getElementById('largeur').value = 0;
		document.getElementById('hauteur').value = 0;
		chargerUnitesVolume(defautUniteIdVol);
		document.getElementById('volume').value = 0;
		document.getElementById('Base_Calcul').checked = true;
		document.getElementById('Eco_Taxe').value = 0;
		document.getElementById('Prix_Public').value = 0;

		delete_tree_tarifs();
		desactiverComptesNational();
		annulerLigne();
		disableBoutons(true);

		// onglet stock
		document.getElementById('Stock_Init').value = 0;
		document.getElementById('Prix_Init').value = 0;
		document.getElementById('Frais_Init').value = 0;
		document.getElementById('Date_Inventaire').value = "";
    document.getElementById('Entrees').value = 0;
    document.getElementById('Sorties').value = 0;
    document.getElementById('Stock_Auj').value = 0;
    document.getElementById('Com_Clients').value = 0;
    document.getElementById('Com_Fournisseurs').value = 0;
    document.getElementById('Stock_Calcule').value = 0;
		document.getElementById('Stock_Dispo').value = 0;
		document.getElementById('Stock_Minimum').value = 0;
    document.getElementById('Stock_Maximum').value = 0;
    document.getElementById('Stock_Alerte').value = 0;
		document.getElementById('Stock_Securite').value = 0;
		document.getElementById('Ajustement').value = "";
		document.getElementById('Libelle_Ajustement').selectedIndex = 0;
		
		aPW.deleteTree();

		document.getElementById('Modifie').value = "n";

	} catch (e) {
  	recup_erreur(e);
  }
}


function enregistrerTout() {
	try {

		var Action = document.getElementById('Action').value;

		var qSaveArt;

		if (Action=="M") {
			qSaveArt = new QueryHttp("Facturation/Stocks/modifierArticle.tmpl");
			qSaveArt.setParam("Liste_Publications", os_getListePublications());
		}
		else {
			qSaveArt = new QueryHttp("Facturation/Stocks/creerArticle.tmpl");
		}


		// Champs onglet présentation

    var article_id = document.getElementById('pArticle_Id').value;
		var refModele = document.getElementById('pRefModele').value;
    var designation = document.getElementById('pDesignation').value;
    var famille1 = document.getElementById('pFamille1').value;
    var lblFamille1 = document.getElementById('pFamille1').getAttribute("label");
    var famille2 = document.getElementById('pFamille2').value;
    var famille3 = document.getElementById('pFamille3').value;
		var marque = document.getElementById('pMarque').value;
		var lblMarque = document.getElementById('pMarque').getAttribute("label");
		var attribut1 = document.getElementById('pAttribut1').value;
		var attribut2 = document.getElementById('pAttribut2').value;
		var attribut3 = document.getElementById('pAttribut3').value;
		var attribut4 = document.getElementById('pAttribut4').value;
		var attribut5 = document.getElementById('pAttribut5').value;
		var attribut6 = document.getElementById('pAttribut6').value;
    var nature = document.getElementById('pNature').value;
    var tracabiliteCP = document.getElementById('pTracabilite_CP').checked?"1":"0";
    var localisation = document.getElementById('pLocalisation').value;
    var code_barre = document.getElementById('pCode_Barre').value;
    var code_nc8 = document.getElementById('pCode_NC8').value;
    var conditionnement = document.getElementById('pConditionnement').value;
    var article_substitution = document.getElementById('pArticle_Substitution').value;
		var art_achat = document.getElementById('pArt_Achat').checked?"1":"0";
		var art_vente = document.getElementById('pArt_Vente').checked?"1":"0";
		var prestation = document.getElementById('pPrestation').checked?"1":"0";
		var descrip_1 = document.getElementById('pDescrip_1').value;
		var descrip_2 = document.getElementById('pDescrip_2').value;
		var ref_fabricant = document.getElementById('pRef_Fabricant').value;
		var composition = document.getElementById('pComposition').value;

		if (Action=="M" || !numerotationAuto) {
			qSaveArt.setParam('Article_Id', article_id);
		}
		qSaveArt.setParam('Ref_Modele', refModele);
		qSaveArt.setParam('Designation', designation);
		qSaveArt.setParam('Famille_1', famille1);
		qSaveArt.setParam('Famille_2', famille2);
		qSaveArt.setParam('Famille_3', famille3);
		qSaveArt.setParam('Nature', nature);
		qSaveArt.setParam('Tracabilite_CP', tracabiliteCP);
		qSaveArt.setParam('Localisation', localisation);
		qSaveArt.setParam('Art_Achat', art_achat);
		qSaveArt.setParam('Art_Vente', art_vente);
		qSaveArt.setParam('Prestation', prestation);
		qSaveArt.setParam('Code_Barre', code_barre);
		qSaveArt.setParam('Code_NC8', code_nc8);
		qSaveArt.setParam('Conditionnement', conditionnement);
		qSaveArt.setParam('Article_Substitution', article_substitution);
		qSaveArt.setParam('Marque', marque);
		qSaveArt.setParam('Composition', composition);
		qSaveArt.setParam('Descrip_1', descrip_1);
		qSaveArt.setParam('Descrip_2', descrip_2);
		qSaveArt.setParam('Ref_Fabricant', ref_fabricant);
		qSaveArt.setParam('Attribut_1', attribut1);
		qSaveArt.setParam('Attribut_2', attribut2);
		qSaveArt.setParam('Attribut_3', attribut3);
		qSaveArt.setParam('Attribut_4', attribut4);
		qSaveArt.setParam('Attribut_5', attribut5);
		qSaveArt.setParam('Attribut_6', attribut6);

		qSaveArt.setParam('Imp_Nom_Fiche', (document.getElementById('pImp_Nom_Fiche').checked?"1":"0"));
		qSaveArt.setParam('Imp_Nom_OF', (document.getElementById('pImp_Nom_OF').checked?"1":"0"));
		qSaveArt.setParam('Imp_Nom_Facture', (document.getElementById('pImp_Nom_Facture').checked?"1":"0"));
		qSaveArt.setParam('Imp_Nom_Bon', (document.getElementById('pImp_Nom_Bon').checked?"1":"0"));
		qSaveArt.setParam('Imp_Nom_Devis', (document.getElementById('pImp_Nom_Devis').checked?"1":"0"));
		qSaveArt.setParam('Imp_Nom_BP', (document.getElementById('pImp_Nom_BP').checked?"1":"0"));
		qSaveArt.setParam('Imp_Nom_BCF', (document.getElementById('pImp_Nom_BCF').checked?"1":"0"));

		qSaveArt.setParam('Imp_Desc1_Fiche', (document.getElementById('pImp_Desc1_Fiche').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc1_OF', (document.getElementById('pImp_Desc1_OF').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc1_Facture', (document.getElementById('pImp_Desc1_Facture').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc1_Bon', (document.getElementById('pImp_Desc1_Bon').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc1_Devis', (document.getElementById('pImp_Desc1_Devis').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc1_BP', (document.getElementById('pImp_Desc1_BP').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc1_BCF', (document.getElementById('pImp_Desc1_BCF').checked?"1":"0"));

		qSaveArt.setParam('Imp_Desc2_Fiche', (document.getElementById('pImp_Desc2_Fiche').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc2_OF', (document.getElementById('pImp_Desc2_OF').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc2_Facture', (document.getElementById('pImp_Desc2_Facture').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc2_Bon', (document.getElementById('pImp_Desc2_Bon').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc2_Devis', (document.getElementById('pImp_Desc2_Devis').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc2_BP', (document.getElementById('pImp_Desc2_BP').checked?"1":"0"));
		qSaveArt.setParam('Imp_Desc2_BCF', (document.getElementById('pImp_Desc2_BCF').checked?"1":"0"));


		// Champs onglet prix
		var unite = document.getElementById('Unite').value;
    var tarif_1 = document.getElementById('Tarif_1').value;
    var tarif_2 = document.getElementById('Tarif_2').value;
    var tarif_3 = document.getElementById('Tarif_3').value;
    var tarif_4 = document.getElementById('Tarif_4').value;
    var tarif_5 = document.getElementById('Tarif_5').value;
		var coeff_1 = document.getElementById('Coeff_1').value;
    var coeff_2 = document.getElementById('Coeff_2').value;
    var coeff_3 = document.getElementById('Coeff_3').value;
    var coeff_4 = document.getElementById('Coeff_4').value;
    var coeff_5 = document.getElementById('Coeff_5').value;
		var tarif_1_ttc = document.getElementById('Tarif_1_TTC').value;
    var tarif_2_ttc = document.getElementById('Tarif_2_TTC').value;
    var tarif_3_ttc = document.getElementById('Tarif_3_TTC').value;
    var tarif_4_ttc = document.getElementById('Tarif_4_TTC').value;
    var tarif_5_ttc = document.getElementById('Tarif_5_TTC').value;
		var marge_1 = document.getElementById('Marge_1').value;
    var marge_2 = document.getElementById('Marge_2').value;
    var marge_3 = document.getElementById('Marge_3').value;
    var marge_4 = document.getElementById('Marge_4').value;
    var marge_5 = document.getElementById('Marge_5').value;
		var prix_achat = document.getElementById('Prix_Achat').value;
		var frais_appro = document.getElementById('Frais_Appro').value;
    var poids_brut = document.getElementById('Poids_Brut').value;
    var poids_net = document.getElementById('Poids_Net').value;
		var colisage = document.getElementById('Colisage').value;
		var code_tva = document.getElementById('Code_TVA').value;
		var unitePoids = document.getElementById('unitePoids').value;
		var uniteDimensions = document.getElementById('uniteDimensions').value;
		var longueur = document.getElementById('longueur').value;
		var largeur = document.getElementById('largeur').value;
		var hauteur = document.getElementById('hauteur').value;
		var uniteVolume = document.getElementById('uniteVolume').value;
		var volume = document.getElementById('volume').value;
		var base_calcul = document.getElementById('Base_Calcul').checked?"1":"0";
		var eco_taxe = document.getElementById('Eco_Taxe').value;
		var prix_public = document.getElementById('Prix_Public').value;

		qSaveArt.setParam('Unite', unite);
		qSaveArt.setParam('Poids_Brut', poids_brut);
		qSaveArt.setParam('Tarif_1', tarif_1);
		qSaveArt.setParam('Tarif_2', tarif_2);
		qSaveArt.setParam('Tarif_3', tarif_3);
		qSaveArt.setParam('Tarif_4', tarif_4);
		qSaveArt.setParam('Tarif_5', tarif_5);
		qSaveArt.setParam('Tarif_1_TTC', tarif_1_ttc);
		qSaveArt.setParam('Tarif_2_TTC', tarif_2_ttc);
		qSaveArt.setParam('Tarif_3_TTC', tarif_3_ttc);
		qSaveArt.setParam('Tarif_4_TTC', tarif_4_ttc);
		qSaveArt.setParam('Tarif_5_TTC', tarif_5_ttc);
		qSaveArt.setParam('Poids_Net', poids_net);
		qSaveArt.setParam('Colisage', colisage);
		qSaveArt.setParam('Code_TVA', code_tva);
		qSaveArt.setParam('Frais_Appro', frais_appro);
		qSaveArt.setParam('Prix_Achat', prix_achat);
		qSaveArt.setParam('Unite_Poids', unitePoids);
		qSaveArt.setParam('Unite_Dimensions', uniteDimensions);
		qSaveArt.setParam('Longueur', longueur);
		qSaveArt.setParam('Largeur', largeur);
		qSaveArt.setParam('Hauteur', hauteur);
		qSaveArt.setParam('Unite_Volume', uniteVolume);
		qSaveArt.setParam('Volume', volume);
		qSaveArt.setParam('Base_Calcul', base_calcul);
		qSaveArt.setParam('Coeff_1', coeff_1);
		qSaveArt.setParam('Coeff_2', coeff_2 );
		qSaveArt.setParam('Coeff_3', coeff_3);
		qSaveArt.setParam('Coeff_4', coeff_4);
		qSaveArt.setParam('Coeff_5', coeff_5);
		qSaveArt.setParam('Marge_1', marge_1);
		qSaveArt.setParam('Marge_2', marge_2);
		qSaveArt.setParam('Marge_3', marge_3);
		qSaveArt.setParam('Marge_4', marge_4);
		qSaveArt.setParam('Marge_5', marge_5);
		qSaveArt.setParam('Eco_Taxe', eco_taxe);
		qSaveArt.setParam('Prix_Public', prix_public);


		// Champs onglet stock
    var stock_init = document.getElementById('Stock_Init').value;
    var stock_maximum = document.getElementById('Stock_Maximum').value;
    var stock_alerte = document.getElementById('Stock_Alerte').value;
		var stock_securite = document.getElementById('Stock_Securite').value;
		var prix_init = document.getElementById('Prix_Init').value;
		var frais_init = document.getElementById('Frais_Init').value;

		qSaveArt.setParam('Stock_Init', stock_init);
		qSaveArt.setParam('Stock_Maximum', stock_maximum);
		qSaveArt.setParam('Stock_Alerte', stock_alerte);
		qSaveArt.setParam('Stock_Securite', stock_securite);
		qSaveArt.setParam('Prix_Init', prix_init);
		qSaveArt.setParam('Frais_Init', frais_init);


		// Champs onglet supplément
		qSaveArt.setParam('Code_Stats', document.getElementById('Code_Stats').value);

		var saveOK = false;
	
		var lblTarif1 = document.getElementById('lblTarif1').value;
		var lblTarif2 = document.getElementById('lblTarif2').value;
		var lblTarif3 = document.getElementById('lblTarif3').value;
		var lblTarif4 = document.getElementById('lblTarif4').value;
		var lblTarif5 = document.getElementById('lblTarif5').value;

		if (Action=="C" && isEmpty(article_id) && !numerotationAuto) {
			showWarning("Veuillez spécifier un code article ! (Onglet présentation)");
		}
		else if (Action=="C" && existeArticle(article_id) && !numerotationAuto) {
			showWarning("Le code article '"+ article_id +"' est déjà utilisé ! (Onglet présentation)");
		}
		else if (Action=="C" && !isCleAlpha(article_id) && !numerotationAuto) {
			showWarning("Référence article invalide ! (Onglet présentation)");
		}
		else if (!isEmpty(refModele) && !isCleAlpha(refModele)) { showWarning("Référence modèle invalide ! (Onglet présentation)"); }
		else if (isEmpty(designation)) { showWarning("Veuillez spécifier la désignation de l'article ! (Onglet présentation)"); }
		else if (famille1=="0") { showWarning("Veuillez spécifier la famille 1 de l'article ! (Onglet présentation)"); }
		else if (famille3!="0" && famille2=="0") { showWarning("Veuillez spécifier la famille 2 de l'article ! (Onglet présentation)"); }

		else if (isEmpty(prix_init) || !isPositiveOrNull(prix_init) || !checkDecimal(prix_init,4)) { showWarning("Prix d'achat initial incorrect ! (Onglet stock)"); }
		else if (isEmpty(frais_init) || !isPositiveOrNull(frais_init) || !checkDecimal(frais_init,4)) { showWarning("Frais d'approche initiaux incorrects ! (Onglet stock)"); }

		else if (!isEmpty(code_barre) && !isDigitList(code_barre)) { showWarning("Code barre incorrect ! (Onglet présentation)"); }
		else if (!isEmpty(code_nc8) && (!isDigitList(code_nc8) || code_nc8.length < 8)) { showWarning("Code NC8 incorrect ! (Onglet présentation)"); }

		else if (isEmpty(colisage)) { showWarning("Veuillez spécifier le colisage ! (Onglet prix)"); }
		else if (!isPositiveOrNull(colisage)) { showWarning("Colisage incorrect ! (Onglet prix)"); }
		else if (!isPositiveOrNull(eco_taxe)) { showWarning("Montant d'eco-participation incorrect ! (Onglet prix)"); }
		else if (!isPositiveOrNull(prix_public)) { showWarning("Prix public incorrect ! (Onglet prix)"); }
		else if (isEmpty(poids_brut) || !isPositiveOrNull(poids_brut)) { showWarning("Poids brut incorrect ! (Onglet prix)"); }
		else if (isEmpty(poids_net) || !isPositiveOrNull(poids_net)) { showWarning("Poids net incorrect ! (Onglet prix)"); }
		else if (isEmpty(unitePoids)) { showWarning("Veuillez sélectionner une unité de poids ! (Onglet prix)"); }
		else if (isEmpty(uniteDimensions)) { showWarning("Veuillez sélectionner une unité de dimensions ! (Onglet prix)"); }
		else if (isEmpty(longueur) || !isPositiveOrNull(longueur) || !checkNumber(longueur,4,2)) { showWarning("La longueur est incorrecte ! (Onglet prix)"); }
		else if (isEmpty(largeur) || !isPositiveOrNull(largeur) || !checkNumber(largeur,4,2)) { showWarning("La largeur est incorrecte ! (Onglet prix)"); }
		else if (isEmpty(hauteur) || !isPositiveOrNull(hauteur) || !checkNumber(hauteur,4,2)) { showWarning("La hauteur est incorrecte ! (Onglet prix)"); }
		else if (isEmpty(uniteVolume)) { showWarning("Veuillez sélectionner une unité de volume ! (Onglet prix)"); }
		else if (isEmpty(volume) || !isPositiveOrNull(volume) || !checkNumber(volume,4,2)) { showWarning("Le volume est incorrect ! (Onglet prix)"); }
		
		else if (isEmpty(stock_maximum) || !isPositiveOrNull(stock_maximum)) { showWarning("Stock maximum incorrect ! (Onglet stock)"); }
		else if (isEmpty(stock_alerte) || !isPositiveOrNull(stock_alerte)) { showWarning("Stock d'alerte incorrect ! (Onglet stock)"); }
		else if (isEmpty(stock_securite) || !isPositiveOrNull(stock_securite)) { showWarning("Stock de sécurité incorrect ! (Onglet stock)"); }
		else if (parseFloat(stock_maximum)<parseFloat(stock_alerte)) { showWarning("le stock maximum doit être supérieur ou égal au stock alerte ! (Onglet stock)"); }

		else if (isEmpty(tarif_1) || !isPositiveOrNull(tarif_1) || !checkDecimal(tarif_1,4)) { showWarning("PV HT du "+ lblTarif1 +" incorrect ! (Onglet prix)"); }
		else if (isEmpty(tarif_2) || !isPositiveOrNull(tarif_2) || !checkDecimal(tarif_2,4)) { showWarning("PV HT du "+ lblTarif2 +" incorrect ! (Onglet prix)"); }
		else if (isEmpty(tarif_3) || !isPositiveOrNull(tarif_3) || !checkDecimal(tarif_3,4)) { showWarning("PV HT du "+ lblTarif3 +" incorrect ! (Onglet prix)"); }
		else if (isEmpty(tarif_4) || !isPositiveOrNull(tarif_4) || !checkDecimal(tarif_4,4)) { showWarning("PV HT du "+ lblTarif4 +" incorrect ! (Onglet prix)"); }
		else if (isEmpty(tarif_5) || !isPositiveOrNull(tarif_5) || !checkDecimal(tarif_5,4)) { showWarning("PV HT du "+ lblTarif5 +" incorrect ! (Onglet prix)"); }
		else if (isEmpty(coeff_1) || !isPositiveOrNull(coeff_1) || !checkDecimal(coeff_1,6)) { showWarning("Coefficient 1 incorrect ! (Onglet prix)"); }
		else if (isEmpty(coeff_2) || !isPositiveOrNull(coeff_2) || !checkDecimal(coeff_2,6)) { showWarning("Coefficient 2 incorrect ! (Onglet prix)"); }
		else if (isEmpty(coeff_3) || !isPositiveOrNull(coeff_3) || !checkDecimal(coeff_3,6)) { showWarning("Coefficient 3 incorrect ! (Onglet prix)"); }
		else if (isEmpty(coeff_4) || !isPositiveOrNull(coeff_4) || !checkDecimal(coeff_4,6)) { showWarning("Coefficient 4 incorrect ! (Onglet prix)"); }
		else if (isEmpty(coeff_5) || !isPositiveOrNull(coeff_5) || !checkDecimal(coeff_5,6)) { showWarning("Coefficient 5 incorrect ! (Onglet prix)"); }
		else if (isEmpty(tarif_1_ttc) || !isPositiveOrNull(tarif_1_ttc) || !checkDecimal(tarif_1_ttc,4)) { showWarning("PV TTC du "+ lblTarif1 +" incorrect ! (Onglet prix)"); }
		else if (isEmpty(tarif_2_ttc) || !isPositiveOrNull(tarif_2_ttc) || !checkDecimal(tarif_2_ttc,4)) { showWarning("PV TTC du "+ lblTarif2 +" incorrect ! (Onglet prix)"); }
		else if (isEmpty(tarif_3_ttc) || !isPositiveOrNull(tarif_3_ttc) || !checkDecimal(tarif_3_ttc,4)) { showWarning("PV TTC du "+ lblTarif3 +" incorrect ! (Onglet prix)"); }
		else if (isEmpty(tarif_4_ttc) || !isPositiveOrNull(tarif_4_ttc) || !checkDecimal(tarif_4_ttc,4)) { showWarning("PV TTC du "+ lblTarif4 +" incorrect ! (Onglet prix)"); }
		else if (isEmpty(tarif_5_ttc) || !isPositiveOrNull(tarif_5_ttc) || !checkDecimal(tarif_5_ttc,4)) { showWarning("PV TTC du "+ lblTarif5 +" incorrect ! (Onglet prix)"); }
		else if (isEmpty(marge_1) || !isPositiveOrNull(marge_1) || !checkDecimal(marge_1,2)) { showWarning("Marge 1 incorrecte ! (Onglet prix)"); }
		else if (isEmpty(marge_2) || !isPositiveOrNull(marge_2) || !checkDecimal(marge_2,2)) { showWarning("Marge 2 incorrecte ! (Onglet prix)"); }
		else if (isEmpty(marge_3) || !isPositiveOrNull(marge_3) || !checkDecimal(marge_3,2)) { showWarning("Marge 3 incorrecte ! (Onglet prix)"); }
		else if (isEmpty(marge_4) || !isPositiveOrNull(marge_4) || !checkDecimal(marge_4,2)) { showWarning("Marge 4 incorrecte ! (Onglet prix)"); }
		else if (isEmpty(marge_5) || !isPositiveOrNull(marge_5) || !checkDecimal(marge_5,2)) { showWarning("Marge 5 incorrecte ! (Onglet prix)"); }
		else if (isEmpty(prix_achat) || !isPositiveOrNull(prix_achat) || !checkNumber(prix_achat,9,4)) { showWarning("Prix d'achat incorrect ! (Onglet prix)"); }
		else if (isEmpty(frais_appro) || !isPositiveOrNull(frais_appro) || !checkDecimal(frais_appro,4)) { showWarning("Frais d'appro. incorrects ! (Onglet prix)"); }
		else if (isEmpty(prix_public) || !isPositiveOrNull(prix_public) || !checkDecimal(prix_public,2)) { showWarning("Prix Public incorrect ! (Onglet prix)"); }
		else if ((Action!="C" || ((stock_init == 0) || (stock_init != 0 && prix_init != 0) || (stock_init != 0 && prix_init==0 && window.confirm("Vous n'avez pas spécifié de prix d'achat moyen initial.\nVoulez-vous continuer ?")))) && checkChampsPerso()) {

			var continuer = true;
			var qCheckRefModele = new QueryHttp("Facturation/Stocks/checkRefModele.tmpl");
			qCheckRefModele.setParam("Ref_Modele", refModele);
			var result = qCheckRefModele.execute();
			if (result.responseXML.documentElement.getAttribute("existeRefModele")=="false") {
				continuer = window.confirm("La référence modèle saisie est nouvelle. Voulez-vous continuer ?");
			}
			if (continuer) {
				result = qSaveArt.execute();
				if (numerotationAuto && result.responseXML.documentElement.getAttribute("Article_Id")=="") {
					showWarning("Erreur : le format de num\u00E9rotation actuel ne permet plus de g\u00E9n\u00E9rer de r\u00E9f\u00E9rences articles pour la p\u00E9riode d\u00E9finie !");
				} else {
					saveChampsPerso();
		
					saveOK = true;
		
					showMessage("La fiche article a été enregistrée !");
	
					if (Action=="C") {
						document.getElementById('Action').value = "M";
						if (numerotationAuto) {
							document.getElementById('pArticle_Id').value = result.responseXML.documentElement.getAttribute("Article_Id");
						}
						document.getElementById('Article').value = result.responseXML.documentElement.getAttribute("Article_Id");
		
						document.getElementById('bSupprimer').collapsed = false;
						document.getElementById('bEdition').collapsed = false;
						document.getElementById('bVoirPhoto').collapsed = false;
						document.getElementById('bChangerPhoto').collapsed = false;
						document.getElementById('TabFournisseurs').collapsed = false;
						document.getElementById('TabSupplements').collapsed = false;
						document.getElementById('pRowFichiers').collapsed = false;
						document.getElementById('TabNomenclature').collapsed = false;
						chargerArticle();
						document.getElementById('pArticle_Id').disabled = true;
						document.getElementById('pArticle_Id').collapsed=false;
						document.getElementById('pLblAuto').collapsed=true;
					}
					else {
						document.getElementById('rsDesignation').value = designation;
						document.getElementById('rsMarque').value = lblMarque;
						document.getElementById('rsFamille1').value = lblFamille1;
						disableInitStock(true);
		
						calculerStocks();
						afficherResumeStocks();
						calculerCUMP();
					}
		
					document.getElementById('Modifie').value = "n";
				}
			}
		}

		return saveOK;

	} catch (e) {
  	recup_erreur(e);
  }
}


function demandeEnregistrement() {
  try {

		if (document.getElementById("Modifie").value=="y") {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à la fiche article ?")) {
				enregistrerTout();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function existeArticle(code_article) {
  try {

		var qExArt = new QueryHttp("Facturation/Stocks/existeArticle.tmpl");
		qExArt.setParam('Article_Id', code_article);
		var result = qExArt.execute();

  	return result.responseXML.documentElement.getAttribute('existe')=="true";

  } catch (e) {
    recup_erreur(e);
  }
}


function rechercherArticle() {
	try {

		var Action = document.getElementById('Action').value;
		var Modifie = document.getElementById('Modifie').value;
		var change = true;

		if (premierChargement) {
			premierChargement = false;
			document.getElementById('Action').value = "C";
			document.getElementById('Modifie').value = "n";
		} else if (Modifie=="y") {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à la fiche article ?")) {
				change = enregistrerTout();
			}
		}

		if (change) {
			if (retourEdition) {
				retourRechercherArticle(ParamValeur('Article_Id'));
				retourEdition = false;
			} else {
				var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie() +"&Nouv=true";
				window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherArticle);
			}

			Action = document.getElementById('Action').value;

			if (Action=="M") {
				document.getElementById('bSupprimer').collapsed = false;
				document.getElementById('bEdition').collapsed = false;
				document.getElementById('bVoirPhoto').collapsed = false;
				document.getElementById('bChangerPhoto').collapsed = false;
				document.getElementById('TabFournisseurs').collapsed = false;
				document.getElementById('TabSupplements').collapsed = false;
				document.getElementById('pRowFichiers').collapsed = false;
				document.getElementById('TabNomenclature').collapsed = false;
				document.getElementById('pArticle_Id').disabled = true;
				op_deleteFamilles();
				chargerArticle();
				document.getElementById('pArticle_Id').disabled = true;
				document.getElementById('pArticle_Id').collapsed=false;
				document.getElementById('pLblAuto').collapsed=true;
			}
			else {
				document.getElementById('bSupprimer').collapsed = true;
				document.getElementById('bEdition').collapsed = true;
				document.getElementById('bVoirPhoto').collapsed = true;
				document.getElementById('bChangerPhoto').collapsed = true;
  			document.getElementById('TabFournisseurs').collapsed = true;
  			document.getElementById('TabSupplements').collapsed = true;
  			document.getElementById('pRowFichiers').collapsed = true;
				document.getElementById('TabNomenclature').collapsed = true;
				document.getElementById('TabChampsPerso').collapsed = true;

				document.getElementById('Creation').label = "";
				document.getElementById('Modification').label = "";
				document.getElementById('Creation').collapsed = true;
				document.getElementById('Modification').collapsed = true;
				document.getElementById('Fiche').label = "";
				
				document.getElementById('pArticle_Id').disabled = numerotationAuto;
				document.getElementById('pArticle_Id').collapsed = numerotationAuto;
				document.getElementById('pLblAuto').collapsed = !numerotationAuto;
				
				viderChampsPerso();
				disableInitStock(false);

				setDefaultValues();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function retourRechercherArticle(reference) {
	try {
		
		if (isEmpty(reference)) {
			document.getElementById('Action').value = "C";
		}
		else {
			document.getElementById('Action').value = "M";
			document.getElementById('Article').value = reference;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function calculerCUMP() {
  try {

		var qCump = new QueryHttp("Facturation/Stocks/calculerCUMP.tmpl");
		qCump.setParam('Article_Id', articleId);
		var result = qCump.execute();

		var cump = result.responseXML.documentElement.getAttribute('CUMP');

    document.getElementById('rsCUMP').value = cump;
    document.getElementById('PMP').value = cump;

	} catch (e) {
    recup_erreur(e);
  }
}


function afficherResumeStocks() {
  try {
  	document.getElementById('rsStock_Init').value = document.getElementById('Stock_Init').value;
  	document.getElementById('rsEntrees').value = document.getElementById('Entrees').value;
  	document.getElementById('rsSorties').value = document.getElementById('Sorties').value;
  	document.getElementById('rsStock_Reel').value = document.getElementById('Stock_Auj').value;
  	document.getElementById('rsStock_Virtuel').value = document.getElementById('Stock_Calcule').value;

  } catch (e) {
   	recup_erreur(e);
  }
}


function supprimerTout() {
	try {

		var article_id = document.getElementById('Article').value;

		if (window.confirm("Confirmez-vous la suppression de l'article "+article_id+" ?")) {

			var qSupArt = new QueryHttp("Facturation/Stocks/supprimerArticle.tmpl");
			qSupArt.setParam('Article_Id', article_id);
			qSupArt.execute();

    	showMessage("L'article a été supprimé !");
			setDefaultValues();
			document.getElementById('Action').value = "C";
			document.getElementById('Modifie').value = "n";
			rechercherArticle();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function chargerArticle() {
	try {

		document.getElementById('Panneau').selectedIndex = 0;
		hideButtons(false);

		var qArticle = new QueryHttp("Facturation/Stocks/getArticle.tmpl");
		qArticle.setParam('Article_Id', document.getElementById('Article').value);
		var result = qArticle.execute();

		var contenu = result.responseXML.documentElement;

		articleId = contenu.getAttribute('Fiche_Article_Id');

		// onglet présentation

		document.getElementById('pArticle_Id').value = contenu.getAttribute('Article_Id');
		document.getElementById('pRefModele').value = contenu.getAttribute('Ref_Modele');
    document.getElementById('pDesignation').value = contenu.getAttribute('Designation');
		document.getElementById('rsReference').value = contenu.getAttribute('Article_Id');
		document.getElementById('rsDesignation').value = contenu.getAttribute('Designation');
		document.getElementById('rsFamille1').value = contenu.getAttribute('Libelle_Famille_1');
		
		if (op_circonstAttr1) { op_chargerAttribut1 = contenu.getAttribute('Attribut_1'); }
		if (op_circonstAttr2) { op_chargerAttribut2 = contenu.getAttribute('Attribut_2'); }
		if (op_circonstAttr3) { op_chargerAttribut3 = contenu.getAttribute('Attribut_3'); }
		if (op_circonstAttr4) { op_chargerAttribut4 = contenu.getAttribute('Attribut_4'); }
		if (op_circonstAttr5) { op_chargerAttribut5 = contenu.getAttribute('Attribut_5'); }
		if (op_circonstAttr6) { op_chargerAttribut6 = contenu.getAttribute('Attribut_6'); }
		
		op_chargerFamilles(contenu.getAttribute('Famille_1'),contenu.getAttribute('Famille_2'),contenu.getAttribute('Famille_3'));
		op_chargerMarques(contenu.getAttribute('Marque'));
		if (!op_circonstAttr1) { op_chargerAttributs1(contenu.getAttribute('Attribut_1')); }
		if (!op_circonstAttr2) { op_chargerAttributs2(contenu.getAttribute('Attribut_2')); }
		if (!op_circonstAttr3) { op_chargerAttributs3(contenu.getAttribute('Attribut_3')); }
		if (!op_circonstAttr4) { op_chargerAttributs4(contenu.getAttribute('Attribut_4')); }
		if (!op_circonstAttr5) { op_chargerAttributs5(contenu.getAttribute('Attribut_5')); }
		if (!op_circonstAttr6) { op_chargerAttributs6(contenu.getAttribute('Attribut_6')); }
		document.getElementById('pRef_Fabricant').value = contenu.getAttribute('Ref_Fabricant');
		document.getElementById('rsMarque').value = contenu.getAttribute('Libelle_Marque');

    document.getElementById('pLocalisation').value = contenu.getAttribute('Localisation');
    document.getElementById('pCode_Barre').value = contenu.getAttribute('Code_Barre');
    document.getElementById('pCode_NC8').value = contenu.getAttribute('Code_NC8');
    document.getElementById('pConditionnement').value = contenu.getAttribute('Conditionnement');
    document.getElementById('pArticle_Substitution').value = contenu.getAttribute('Article_Substitution');
		document.getElementById('pDescrip_1').value = contenu.getAttribute('Descrip_1');
		document.getElementById('pDescrip_2').value = contenu.getAttribute('Descrip_2');
		document.getElementById('pArt_Achat').checked = contenu.getAttribute('Art_Achat')=="1";
		document.getElementById('pArt_Vente').checked = contenu.getAttribute('Art_Vente')=="1";
		document.getElementById('pPrestation').checked = contenu.getAttribute('Prestation')=="1";
		document.getElementById('pComposition').value = contenu.getAttribute('Composition');
		document.getElementById('Code_Stats').value = contenu.getAttribute('Code_Stats');

		document.getElementById('TabNomenclature').collapsed = (contenu.getAttribute('Composition')=='U');

		document.getElementById('pImp_Nom_Fiche').checked = (contenu.getAttribute('Imp_Nom_Fiche')==1);
		document.getElementById('pImp_Nom_OF').checked = (contenu.getAttribute('Imp_Nom_OF')==1);
		document.getElementById('pImp_Nom_Facture').checked = (contenu.getAttribute('Imp_Nom_Facture')==1);
		document.getElementById('pImp_Nom_Bon').checked = (contenu.getAttribute('Imp_Nom_Bon')==1);
		document.getElementById('pImp_Nom_Devis').checked = (contenu.getAttribute('Imp_Nom_Devis')==1);
		document.getElementById('pImp_Nom_BP').checked = (contenu.getAttribute('Imp_Nom_BP')==1);
		document.getElementById('pImp_Nom_BCF').checked = (contenu.getAttribute('Imp_Nom_BCF')==1);

		document.getElementById('pImp_Desc1_Fiche').checked = (contenu.getAttribute('Imp_Desc1_Fiche')==1);
		document.getElementById('pImp_Desc1_OF').checked = (contenu.getAttribute('Imp_Desc1_OF')==1);
		document.getElementById('pImp_Desc1_Facture').checked = (contenu.getAttribute('Imp_Desc1_Facture')==1);
		document.getElementById('pImp_Desc1_Bon').checked = (contenu.getAttribute('Imp_Desc1_Bon')==1);
		document.getElementById('pImp_Desc1_Devis').checked = (contenu.getAttribute('Imp_Desc1_Devis')==1);
		document.getElementById('pImp_Desc1_BP').checked = (contenu.getAttribute('Imp_Desc1_BP')==1);
		document.getElementById('pImp_Desc1_BCF').checked = (contenu.getAttribute('Imp_Desc1_BCF')==1);

		document.getElementById('pImp_Desc2_Fiche').checked = (contenu.getAttribute('Imp_Desc2_Fiche')==1);
		document.getElementById('pImp_Desc2_OF').checked = (contenu.getAttribute('Imp_Desc2_OF')==1);
		document.getElementById('pImp_Desc2_Facture').checked = (contenu.getAttribute('Imp_Desc2_Facture')==1);
		document.getElementById('pImp_Desc2_Bon').checked = (contenu.getAttribute('Imp_Desc2_Bon')==1);
		document.getElementById('pImp_Desc2_Devis').checked = (contenu.getAttribute('Imp_Desc2_Devis')==1);
		document.getElementById('pImp_Desc2_BP').checked = (contenu.getAttribute('Imp_Desc2_BP')==1);
		document.getElementById('pImp_Desc2_BCF').checked = (contenu.getAttribute('Imp_Desc2_BCF')==1);

   	document.getElementById('pNature').value = contenu.getAttribute('Nature');
   	document.getElementById('pTracabilite_CP').checked = (contenu.getAttribute('Tracabilite_CP')==1);
		loadPhoto();

		// onglet prix

		var prix_achat_der = parseFloat(contenu.getAttribute('Prix_Achat_Der'));
		var frais_appro_der = parseFloat(contenu.getAttribute('Frais_Appro_Der'));

    document.getElementById('Prix_Achat_Der').value = contenu.getAttribute('Prix_Achat_Der');
    document.getElementById('Frais_Appro_Der').value = contenu.getAttribute('Frais_Appro_Der');
		var nfs = new NumberFormat("0.00", true);
		document.getElementById('Prix_Revient_Der').value = nfs.format(prix_achat_der + frais_appro_der);

    document.getElementById('Tarif_1').value = contenu.getAttribute('Tarif_1');
    document.getElementById('Tarif_2').value = contenu.getAttribute('Tarif_2');
    document.getElementById('Tarif_3').value = contenu.getAttribute('Tarif_3');
    document.getElementById('Tarif_4').value = contenu.getAttribute('Tarif_4');
    document.getElementById('Tarif_5').value = contenu.getAttribute('Tarif_5');
		document.getElementById('Coeff_1').value = contenu.getAttribute('Coeff_1');
    document.getElementById('Coeff_2').value = contenu.getAttribute('Coeff_2');
    document.getElementById('Coeff_3').value = contenu.getAttribute('Coeff_3');
    document.getElementById('Coeff_4').value = contenu.getAttribute('Coeff_4');
    document.getElementById('Coeff_5').value = contenu.getAttribute('Coeff_5');
		document.getElementById('Tarif_1_TTC').value = contenu.getAttribute('Tarif_1_TTC');
    document.getElementById('Tarif_2_TTC').value = contenu.getAttribute('Tarif_2_TTC');
    document.getElementById('Tarif_3_TTC').value = contenu.getAttribute('Tarif_3_TTC');
    document.getElementById('Tarif_4_TTC').value = contenu.getAttribute('Tarif_4_TTC');
    document.getElementById('Tarif_5_TTC').value = contenu.getAttribute('Tarif_5_TTC');
		document.getElementById('Marge_1').value = contenu.getAttribute('Marge_1');
    document.getElementById('Marge_2').value = contenu.getAttribute('Marge_2');
    document.getElementById('Marge_3').value = contenu.getAttribute('Marge_3');
    document.getElementById('Marge_4').value = contenu.getAttribute('Marge_4');
    document.getElementById('Marge_5').value = contenu.getAttribute('Marge_5');
		document.getElementById('Prix_Achat').value = contenu.getAttribute('Prix_Achat');
    document.getElementById('Frais_Appro').value = contenu.getAttribute('Frais_Appro');
    document.getElementById('Poids_Brut').value = contenu.getAttribute('Poids_Brut');
    document.getElementById('Poids_Net').value = contenu.getAttribute('Poids_Net');
    document.getElementById('Colisage').value = contenu.getAttribute('Colisage');
		document.getElementById('Unite').value = contenu.getAttribute('Unite');
		document.getElementById('Code_TVA').value = contenu.getAttribute('Code_TVA');
		chargerUnitesPoids(contenu.getAttribute('Unite_Poids'));
		chargerUnitesDimensions(contenu.getAttribute('Unite_Dimensions'));
		document.getElementById('longueur').value = contenu.getAttribute('Longueur');
		document.getElementById('largeur').value = contenu.getAttribute('Largeur');
		document.getElementById('hauteur').value = contenu.getAttribute('Hauteur');
		chargerUnitesVolume(contenu.getAttribute('Unite_Volume'));
		document.getElementById('volume').value = contenu.getAttribute('Volume');
		document.getElementById('Base_Calcul').checked = contenu.getAttribute('Base_Calcul')=="1";
		document.getElementById('Eco_Taxe').value = contenu.getAttribute('Eco_Taxe');
		document.getElementById('Prix_Public').value = contenu.getAttribute('Prix_Public');

		calculerRevient(false);
		changeModeTarifQte();
		disableBoutons(false);
		annulerLigne();
		desactiverComptesNational(); // griser tous les boutons
		activerComptesNational(); // rechargement des listes

		// onglet stock
		document.getElementById('Stock_Init').value = contenu.getAttribute('Stock_Init');
		document.getElementById('Prix_Init').value = contenu.getAttribute('Prix_Init');
		document.getElementById('Frais_Init').value = contenu.getAttribute('Frais_Init');
		document.getElementById('Date_Inventaire').value = contenu.getAttribute('Date_Inventaire');
    document.getElementById('Entrees').value = contenu.getAttribute('Entrees');
    document.getElementById('Sorties').value = contenu.getAttribute('Sorties');
    document.getElementById('Com_Clients').value = contenu.getAttribute('Com_Clients');
    document.getElementById('Com_Fournisseurs').value = contenu.getAttribute('Com_Fournisseurs');
    document.getElementById('Stock_Maximum').value = contenu.getAttribute('Stock_Maximum');
    document.getElementById('Stock_Alerte').value = contenu.getAttribute('Stock_Alerte');
		document.getElementById('Stock_Securite').value = contenu.getAttribute('Stock_Securite');
		document.getElementById('Ajustement').value = "";
		document.getElementById('Libelle_Ajustement').selectedIndex = 0;
		calcStockMinimum();
		disableInitStock(true);
		calculerStocks();
		afficherResumeStocks();
		calculerCUMP();
		
		// onglet fournisseur
		initFournisseurs();
		
		// onglet nomenclature
		initNomenclature();
		
		// onglet supplément
		initSupplements();
		
		// onglet champs perso
		initChampsPerso(document.getElementById('pFamille1').value, document.getElementById('pFamille2').value, document.getElementById('pFamille3').value, document.getElementById('Article').value);

		// actualisation status bar
		document.getElementById('Creation').label = "Article créé le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur');
		document.getElementById('Modification').label = "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj');
		document.getElementById('Fiche').label = "Article N° "+ contenu.getAttribute('Article_Id') +" - "+ contenu.getAttribute('Designation');
		document.getElementById('Creation').collapsed = false;
		document.getElementById('Modification').collapsed = false;		

		document.getElementById('Modifie').value = "n";
	} catch (e) {
  	recup_erreur(e);
  }
}


function calculerStocks() {
	try {
		var stock_init = parseFloat(document.getElementById('Stock_Init').value);
		var entrees = parseFloat(document.getElementById('Entrees').value);
		var sorties = parseFloat(document.getElementById('Sorties').value);
		var stock_auj = stock_init + entrees - sorties;
		var com_clients = parseFloat(document.getElementById('Com_Clients').value);
		var com_fournisseurs = parseFloat(document.getElementById('Com_Fournisseurs').value);
		var stock_dispo = parseFloat(stock_auj) - com_clients;
		var stock_calcule = parseFloat(stock_auj) + com_fournisseurs - com_clients;

		var nf = new NumberFormat("0.##", true);

		document.getElementById('Stock_Auj').value = nf.format(stock_auj);
		document.getElementById('Stock_Dispo').value = nf.format(stock_dispo);
		document.getElementById('Stock_Calcule').value = nf.format(stock_calcule);

	} catch (e) {
  	recup_erreur(e);
  }
}


function editerFiche() {
	try {

		window.location = "chrome://opensi/content/facturation/user/stocks/edition_fiche.xul?"+ cookie()
															+"&Article_Id="+ urlEncode(document.getElementById('Article').value);

	} catch (e) {
  	recup_erreur(e);
  }
}


function dupliquerFiche() {
	try {

		var Modifie = document.getElementById('Modifie').value;
		var change = true;

		if (Modifie=="y") {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à la fiche article ?")) {
				change = enregistrerTout();
			}
		}

		if (change) {
			var curArticleId = document.getElementById('Article').value;
			if (numerotationAuto) {
				var qDupliquer = new QueryHttp("Facturation/Stocks/copierArticle.tmpl");
				qDupliquer.setParam("Ancien_Article_Id", curArticleId);
				var result = qDupliquer.execute();
				var nouvArticleId = result.responseXML.documentElement.getAttribute("Article_Id");
				if (isEmpty(nouvArticleId)) { showWarning("Erreur : le format de num\u00E9rotation actuel ne permet plus de g\u00E9n\u00E9rer de r\u00E9f\u00E9rences articles pour la p\u00E9riode d\u00E9finie !"); }
				else { retourDupliquerFiche(nouvArticleId); }
			} else {
				var url = "chrome://opensi/content/facturation/user/stocks/copier_article.xul?"+ cookie();
				url += "&Article_Id=" + urlEncode(curArticleId);
				window.openDialog(url,'','chrome,modal,centerscreen',retourDupliquerFiche);
			}
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function setModifie() {
	try {

		document.getElementById('Modifie').value = "y";

	} catch (e) {
		recup_erreur(e);
	}
}


function retourDupliquerFiche(nouvel_article_id) {
  try {

    window.location = "chrome://opensi/content/facturation/user/stocks/menu_stocks.xul?"+ cookie() +"&Article_Id="+ urlEncode(nouvel_article_id);

  } catch (e) {
    recup_erreur(e);
  }
}


function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

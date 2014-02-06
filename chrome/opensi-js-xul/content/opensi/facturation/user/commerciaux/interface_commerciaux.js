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


var user = get_cookie("User");
var aFamille1 = new Arbre("Facturation/GetRDF/familles_article_commercial.tmpl","liste_familles_1");
var aFamille2 = new Arbre("Facturation/GetRDF/familles_article_commercial.tmpl","liste_familles_2");
var aFamille3 = new Arbre("Facturation/GetRDF/familles_article_commercial.tmpl","liste_familles_3");
var aMarques = new Arbre("Facturation/GetRDF/marques_article_commercial.tmpl","liste_marques");
var aTranches = new Arbre("Facturation/GetRDF/liste_tranches.tmpl","liste_tranches");
var aRegles = new Arbre("Facturation/GetRDF/liste_regles_commissions.tmpl","liste_regles_commissions");
var commission_id = -1; // id de la commission sélectionnée, -1 si aucune
var tranche_id = -1; // id de la tranche sélectionnée, -1 si aucune
var current_rule = null;
var select_famille_1 = "";
var select_famille_2 = "";
var select_famille_3 = "";
var chargement_famille_1 = "";
var chargement_famille_2 = "";
var chargement_famille_3 = "";
var select_marque = "";
var modeCalculQte = "P";
var baseCalculQte = "CA";
var restrictionGlobale=false;
var restrictionHorsStock=false;
var restrictionCAE=false;


function init_infos() {
  try {

		if (is_new_commercial) {			
			var aUtil = new Arbre('Facturation/GetRDF/liste_utilisateurs_hors_commerciaux.tmpl', 'login_utilisateur');
			aUtil.initTree(initLoginCommerciaux);
		}
		else {
			document.getElementById('login_utilisateur').collapsed = true;
			document.getElementById('enregistre').label = "Modifier le commercial";
		}

  	var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays");
		aPays.initTree(init_commercial);

 	} catch (e) {
    recup_erreur(e);
  }
}


function initLoginCommerciaux() {
	try {
		document.getElementById('login_utilisateur').selectedIndex = 0;
	} catch (e) {
		recup_erreur(e);
	}
}

function init_commercial() {
	try {
		document.getElementById('param_commissions').collapsed = true;
		if (is_new_commercial) {
			document.getElementById('txt_codeComm').disabled=false;
			document.getElementById('delete').disabled = true;
			document.getElementById('Commissionnements').collapsed = true;
			document.getElementById('Code_Pays').value = "FR";
		}
		else {
			document.getElementById('txt_codeComm').disabled=true;
			document.getElementById('delete').disabled = false;
			document.getElementById('Commissionnements').collapsed = false;

			chargerCommercial();
		}

		if (!is_admin || !actif) {
			document.getElementById('bNewRule').collapsed = true;
			document.getElementById('bChangeRule').collapsed = true;
			document.getElementById('bDeleteRule').collapsed = true;
			document.getElementById('bDuplicateRule').collapsed = true;
			document.getElementById('bReinitRules').collapsed = true;
			document.getElementById('delete').collapsed = true;
		}

		if (!actif) {
			document.getElementById('txt_adresse').disabled = true;
			document.getElementById('txt_adresse2').disabled = true;
			document.getElementById('txt_codePost').disabled = true;
			document.getElementById('txt_ville').disabled = true;
			document.getElementById('Code_Pays').disabled = true;
			document.getElementById('txt_tel1').disabled = true;
			document.getElementById('txt_tel2').disabled = true;
			document.getElementById('txt_tel3').disabled = true;
			document.getElementById('txt_fax1').disabled = true;
			document.getElementById('txt_fax2').disabled = true;
			document.getElementById('txt_email1').disabled = true;
			document.getElementById('txt_email2').disabled = true;
			document.getElementById('txt_secteur').disabled = true;
			document.getElementById('enregistre').collapsed = true;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function setModifie(m) {
	try {
		if (m) {
			document.getElementById('Modifie').value = "y";
			document.getElementById('labelCommercial').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
		} else {
			document.getElementById('Modifie').value = "n";
			document.getElementById('labelCommercial').setAttribute('image', null);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function chargerCommercial() {
	try {

		var qCommercial = new QueryHttp("Facturation/Commerciaux/charger_commercial.tmpl");
    qCommercial.setParam("Commercial_Id", identifiant);
    var result = qCommercial.execute();
		var contenu = result.responseXML.documentElement;

		if (identifiant==user && !is_admin) { document.getElementById('bMenuCommerciaux').collapsed = true; }

  	document.getElementById('lab_login_utilisateur').value = contenu.getAttribute("Login");
		document.getElementById('lab_civilite').value = contenu.getAttribute("Civilite");
		document.getElementById('lab_nom').value = contenu.getAttribute("Nom");
		document.getElementById('lab_prenom').value = contenu.getAttribute("Prenom");
		document.getElementById('txt_codeComm').value = contenu.getAttribute("Code_Commercial");
		document.getElementById('txt_adresse').value = contenu.getAttribute("Adresse");
		document.getElementById('txt_adresse2').value = contenu.getAttribute("Comp_Adresse");
		document.getElementById('txt_codePost').value = contenu.getAttribute("Code_Postal");
		document.getElementById('txt_ville').value = contenu.getAttribute("Ville");
		document.getElementById('Code_Pays').value = contenu.getAttribute("Code_Pays");
		document.getElementById('txt_tel1').value = contenu.getAttribute("Tel_1");
		document.getElementById('txt_tel2').value = contenu.getAttribute("Tel_2");
		document.getElementById('txt_tel3').value = contenu.getAttribute("Tel_3");
		document.getElementById('txt_fax1').value = contenu.getAttribute("Fax_1");
		document.getElementById('txt_fax2').value = contenu.getAttribute("Fax_2");
		document.getElementById('txt_email1').value = contenu.getAttribute("Email_1");
		document.getElementById('txt_email2').value = contenu.getAttribute("Email_2");
		document.getElementById('txt_secteur').value = contenu.getAttribute("Secteur");

		init_regles();

	} catch(e) {
		recup_erreur(e);
	}
}


function init_regles() {
	try {

		aRegles.setParam("Commercial_Id", identifiant);
		aRegles.initTree();

		var queryCAE = new QueryHttp("Facturation/Commerciaux/existe_CAE.tmpl");
    queryCAE.setParam("Commercial_Id", identifiant);
    var result = queryCAE.execute();
		document.getElementById('bNewRule').collapsed = (result.responseXML.documentElement.getAttribute("existe")=="true");
		document.getElementById('bDuplicateRule').collapsed = (result.responseXML.documentElement.getAttribute("existe")=="true");
		document.getElementById('bChangeRule').disabled = true;
		document.getElementById('bDeleteRule').disabled = true;
		document.getElementById('bDuplicateRule').disabled = true;
		document.getElementById('bReinitRules').disabled = (getNbRegles()==0);

		document.getElementById('param_commissions').collapsed = true;

		document.getElementById('edition_regles').collapsed = false;
		commission_id=-1;

	} catch(e) {
		recup_erreur(e);
	}
}


function reinit_regles() {
	try {
		if (window.confirm("Etes-vous sûr de vouloir effacer toutes les règles ?")) {
			var qEffacerRegles = new QueryHttp("Facturation/Commerciaux/reinitialiser_regles.tmpl");
			qEffacerRegles.setParam("Commercial_Id", identifiant);
			qEffacerRegles.execute();
			init_regles();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function selectLogin() {
	try {
		if (document.getElementById("login_utilisateur").selectedIndex != 0) {
			var utilisateur_id = document.getElementById("login_utilisateur").value;

			var queryUtilisateur = new QueryHttp("Config/getUtilisateur.tmpl");
      queryUtilisateur.setParam("Utilisateur_Id", utilisateur_id);
			var result = queryUtilisateur.execute();
			var contenu = result.responseXML.documentElement;

			document.getElementById("lab_civilite").value = contenu.getAttribute("civilite");
			document.getElementById("lab_nom").value = contenu.getAttribute("nom");
			document.getElementById("lab_prenom").value = contenu.getAttribute("prenom");
		} else {
			document.getElementById("lab_civilite").value = "";
			document.getElementById("lab_nom").value = "";
			document.getElementById("lab_prenom").value = "";
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function existeSecteurCommercial(code_commercial, secteur) {
	try {
		var qExiste = new QueryHttp("Facturation/Commerciaux/existeSecteurCommercial.tmpl");
    qExiste.setParam("Code_Commercial", code_commercial);
    qExiste.setParam("Secteur", secteur);
    var result = qExiste.execute();
    return (result.responseXML.documentElement.getAttribute("existe") == "true");
	} catch(e) {
		recup_erreur(e);
	}
}


function existeCommercial(code) {
	try {

		var qExCom = new QueryHttp("Facturation/Commerciaux/existeCommercial.tmpl");
		qExCom.setParam("Code_Commercial", code);
		var result = qExCom.execute();

  	return (result.responseXML.documentElement.getAttribute('existe')=="true");

	} catch(e) {
		recup_erreur(e);
	}
}


function enregistrerCommercial() {
	try {

		var commercial_id = (is_new_commercial ? document.getElementById('login_utilisateur').value : 0);
		var code_commercial = document.getElementById('txt_codeComm').value;
		var civilite = 0;
		switch (document.getElementById('lab_civilite').value) {
			case "Monsieur": civilite=1; break;
			case "Madame": civilite=2; break;
			case "Mademoiselle": civilite=3; break;
		}
		var nom = document.getElementById('lab_nom').value;
		var prenom = document.getElementById('lab_prenom').value;
		var adresse = document.getElementById('txt_adresse').value;
		var comp_adresse = document.getElementById('txt_adresse2').value;
		var code_postal = document.getElementById('txt_codePost').value;
		var ville = document.getElementById('txt_ville').value;
		var code_pays = document.getElementById('Code_Pays').value;
		var tel1 = document.getElementById('txt_tel1').value;
		var tel2 = document.getElementById('txt_tel2').value;
		var tel3 = document.getElementById('txt_tel3').value;
		var fax1 = document.getElementById('txt_fax1').value;
		var fax2 = document.getElementById('txt_fax2').value;
		var email1 = document.getElementById('txt_email1').value;
		var email2 = document.getElementById('txt_email2').value;
		var secteur = document.getElementById('txt_secteur').value;

		if (isEmpty(commercial_id)) { showWarning("Veuillez choisir le login du commercial."); }
		else if (isEmpty(code_commercial)) { showWarning("Veuillez indiquer le code du commercial."); }
		else if (is_new_commercial && existeCommercial(code_commercial)) { showWarning("Ce code commercial est déjà utilisé."); }
		else if (isEmpty(adresse)) { showWarning("Veuillez indiquer une adresse."); }
		else if (isEmpty(ville)) { showWarning("Veuillez indiquer une ville."); }
		else if (!isPhone(tel1)) { showWarning("Telephone n°1 incorrect."); }
		else if (!isEmpty(tel2) && !isPhone(tel2)) { showWarning("Telephone n°2 incorrect."); }
		else if (!isEmpty(tel3) && !isPhone(tel3)) { showWarning("Telephone n°3 incorrect."); }
		else if (!isEmpty(fax1) && !isPhone(fax1)) { showWarning("Fax n°1 incorrect."); }
		else if (!isEmpty(fax2) && !isPhone(fax2)) { showWarning("Fax n°2 incorrect."); }
		else if (!isEmpty(email1) && !isEmail(email1)) { showWarning("Email n°1 incorrect."); }
		else if (!isEmpty(email2) && !isEmail(email2)) { showWarning("Email n°2 incorrect."); }
		else if (!isEmpty(secteur) && existeSecteurCommercial(code_commercial, secteur)) { showWarning("Le secteur est déjà utilisé par un autre commercial."); }
		else {

			var qSaveCom = new QueryHttp("Facturation/Commerciaux/enregistrer_commercial.tmpl");
			qSaveCom.setParam("NewComm", is_new_commercial);
      qSaveCom.setParam("Code_Commercial", code_commercial);
			qSaveCom.setParam("Commercial_Id", commercial_id);
			qSaveCom.setParam("Secteur", secteur);
			qSaveCom.setParam("Civilite", civilite);
			qSaveCom.setParam("Nom", nom);
			qSaveCom.setParam("Prenom", prenom);
			qSaveCom.setParam("Adresse", adresse);
			qSaveCom.setParam("Comp_Adresse", comp_adresse);
			qSaveCom.setParam("Code_Postal", code_postal);
			qSaveCom.setParam("Ville", ville);
			qSaveCom.setParam("Code_Pays", code_pays);
			qSaveCom.setParam("Tel_1", tel1);
			qSaveCom.setParam("Tel_2", tel2);
			qSaveCom.setParam("Tel_3", tel3);
			qSaveCom.setParam("Fax_1", fax1);
			qSaveCom.setParam("Fax_2", fax2);
			qSaveCom.setParam("Email_1", email1);
			qSaveCom.setParam("Email_2", email2);
      qSaveCom.execute();

			showMessage("Commercial enregistré !");

			if (is_new_commercial) {
				identifiant = commercial_id;
				is_new_commercial = false;
				init();
			}
			setModifie(false);
		}

	} catch(e) {
		recup_erreur(e);
	}
}


function supprimerCommercial() {
	try {
		if (!is_new_commercial && confirm("Confirmez-vous la désactivation de ce commercial ?")) {
			var qSupCom = new QueryHttp("Facturation/Commerciaux/suppression_commercial.tmpl");
      qSupCom.setParam("Commercial_Id", identifiant);
      qSupCom.execute();
			retourChoixCommercial();
		}
	} catch(e) {
		recup_erreur(e);
	}
}


function select_regle() {
	try {
		if (is_admin) {
			var tree = document.getElementById('liste_regles_commissions');
			if (tree.view!=null && tree.currentIndex!=-1) {
				var type_commission = getCellText(tree, tree.currentIndex, 'type_commission');
				document.getElementById('bChangeRule').disabled = false;
				document.getElementById('bDeleteRule').disabled = false;
				document.getElementById('bDuplicateRule').disabled = (type_commission=="G" || type_commission=="AS" || type_commission=="HS");
			}
		}
	} catch(e) {
		recup_erreur(e);
	}
}


function nouvelle_regle() {
	try {
		var tree = document.getElementById('liste_regles_commissions');
		if (tree.view!=null && tree.currentIndex!=-1) {
			tree.view.selection.select(-1);
			document.getElementById('bChangeRule').disabled = true;
			document.getElementById('bDeleteRule').disabled = true;
			document.getElementById('bDuplicateRule').disabled = true;
			commission_id=-1;
		}
		document.getElementById('edition_regles').collapsed = true;
		init_parametrage();
	} catch(e) {
		recup_erreur(e);
	}
}


function init_parametrage() {
	try {
		current_rule=null;
		tranche_id=-1;
		document.getElementById('rgp_typeComm').value = "MQ";
		document.getElementById('rgp_baseCalcul').value = "CA";
		document.getElementById('bCA').disabled=false;
		document.getElementById('bCAE').disabled=false;
		document.getElementById('bMarge').disabled=false;
		document.getElementById('bQuantite').disabled=false;
		document.getElementById('bModeCalculQte').disabled=false;
		document.getElementById('bBaseCalculQte').disabled=false;
		document.getElementById('txt_val').value = "";
		document.getElementById('article_id').value="";
		document.getElementById('liste_familles_1').collapsed=true;
		document.getElementById('liste_familles_2').collapsed=true;
		document.getElementById('liste_familles_3').collapsed=true;
		document.getElementById('param_commissions').collapsed = false;
		select_famille_1="";
		select_famille_2="";
		select_famille_3="";
		chargement_famille_1="";
		chargement_famille_2="";
		chargement_famille_3="";
		select_marque="";
		chargerFamille1();
		chargerMarques();
		aTranches.deleteTree();
		activer_tranches(false);
		restrictionCAE = (getNbRegles()>0);
		restreindre_regles();
		action_typeCommission();
	} catch(e) {
		recup_erreur(e);
	}
}


function restreindre_regles() {
	try {
		var qExRegle = new QueryHttp("Facturation/Commerciaux/restrictions_regles.tmpl");
		qExRegle.setParam("Commercial_Id", identifiant);
		if (commission_id != -1) {
			qExRegle.setParam("Commission_Id", commission_id);
		}
		var result = qExRegle.execute();
		restrictionGlobale=(result.responseXML.documentElement.getAttribute('existeG')=="true");
		restrictionHorsStock=(result.responseXML.documentElement.getAttribute('existeHS')=="true");
		document.getElementById('tGlobaleComm').disabled=restrictionGlobale;
		document.getElementById('tAllArticle').disabled=(result.responseXML.documentElement.getAttribute('existeAS')=="true");
		document.getElementById('tHorsStock').disabled=restrictionHorsStock;
	} catch (e) {
		recup_erreur(e);
	}
}


function action_typeCommission() {
	try {

		var type_commission = document.getElementById('rgp_typeComm').value;
		var base_calcul = document.getElementById('rgp_baseCalcul').value;

		if (type_commission=="MQ")	{
			document.getElementById('bCAE').collapsed = true;
			document.getElementById('bMarge').collapsed = false;
			document.getElementById('bQuantite').collapsed = false;
			document.getElementById('liste_marques').collapsed = false;
			document.getElementById('liste_familles_1').collapsed=true;
			document.getElementById('liste_familles_2').collapsed=true;
			document.getElementById('liste_familles_3').collapsed=true;
			document.getElementById('article_id').collapsed=true;
			document.getElementById('bRechArticle').collapsed=true;
		}
		else if (type_commission=="FA")	{
			document.getElementById('bCAE').collapsed = true;
			document.getElementById('bMarge').collapsed = false;
			document.getElementById('bQuantite').collapsed = false;
			document.getElementById('liste_familles_1').collapsed = false;
			document.getElementById('liste_familles_2').collapsed=(document.getElementById('liste_familles_1').value=="");
			document.getElementById('liste_familles_3').collapsed=(document.getElementById('liste_familles_1').value=="" || document.getElementById('liste_familles_2').value=="" || document.getElementById('liste_familles_2').value=="0");
			document.getElementById('liste_marques').collapsed = true;
			document.getElementById('article_id').collapsed=true;
			document.getElementById('bRechArticle').collapsed=true;
		}
		else if (type_commission=="A")	{
			document.getElementById('bCAE').collapsed = true;
			document.getElementById('bMarge').collapsed = false;
			document.getElementById('bQuantite').collapsed = false;
			document.getElementById('article_id').collapsed=false;
			document.getElementById('bRechArticle').collapsed=false;
			document.getElementById('liste_marques').collapsed = true;
			document.getElementById('liste_familles_1').collapsed=true;
			document.getElementById('liste_familles_2').collapsed=true;
			document.getElementById('liste_familles_3').collapsed=true;
		}
		else if (type_commission=="G")	{
			// L'option CAE est gérée, il faut décommenter le code ci-dessous pour utiliser cette option
			// L'incohérence de cette option est que le commissionnement peut dépasser le CA HT généré par
			// les ventes du commercial, car le CAE tient compte des frais de ports, contrairement au CA
			// que nous utilisons dans ce module
			// (restrictionCAE est une variable, pas un simple commentaire !!)
			document.getElementById('bCAE').collapsed = true; //restrictionCAE;
			document.getElementById('bMarge').collapsed = true;
			document.getElementById('bQuantite').collapsed = true;
			document.getElementById('liste_marques').collapsed = true;
			document.getElementById('liste_familles_1').collapsed=true;
			document.getElementById('liste_familles_2').collapsed=true;
			document.getElementById('liste_familles_3').collapsed=true;
			document.getElementById('article_id').collapsed=true;
			document.getElementById('bRechArticle').collapsed=true;
			if ((base_calcul=="M") || (base_calcul=="Q")) { document.getElementById('rgp_baseCalcul').value="CA";	}
		}
		else if (type_commission=="AS")	{
			document.getElementById('bCAE').collapsed = true;
			document.getElementById('bMarge').collapsed = false;
			document.getElementById('bQuantite').collapsed = false;
			document.getElementById('liste_marques').collapsed = true;
			document.getElementById('liste_familles_1').collapsed=true;
			document.getElementById('liste_familles_2').collapsed=true;
			document.getElementById('liste_familles_3').collapsed=true;
			document.getElementById('article_id').collapsed=true;
			document.getElementById('bRechArticle').collapsed=true;
		}
		else if (type_commission=="HS") {
			document.getElementById('bCAE').collapsed = true;
			document.getElementById('bMarge').collapsed = true;
			document.getElementById('bQuantite').collapsed = true;
			document.getElementById('liste_marques').collapsed = true;
			document.getElementById('liste_familles_1').collapsed=true;
			document.getElementById('liste_familles_2').collapsed=true;
			document.getElementById('liste_familles_3').collapsed=true;
			document.getElementById('article_id').collapsed=true;
			document.getElementById('bRechArticle').collapsed=true;
			if ((base_calcul=="M") || (base_calcul=="Q")) { document.getElementById('rgp_baseCalcul').value="CA";	}
		}
		action_baseCalcul();
	} catch(e) {
		recup_erreur(e);
	}
}


function action_baseCalcul() {
	try {
		var base_calcul = document.getElementById('rgp_baseCalcul').value;
		if (base_calcul=="CA")	{
			document.getElementById('lbl_val').value = "Pourcentage du CA :";
			document.getElementById('infosQte').collapsed = true;
			document.getElementById('lbl_unite').value = "euros";
			document.getElementById('tranche_val').setAttribute('label',"% Chiffre d'Affaires");
			document.getElementById('tMarque').disabled = false;
			document.getElementById('tFamilleArticle').disabled = false;
			document.getElementById('tArticleDirect').disabled = false;
			document.getElementById('tGlobaleComm').disabled=restrictionGlobale;
			document.getElementById('tAllArticle').disabled = false;
			document.getElementById('tHorsStock').disabled=restrictionHorsStock;
		}
		else if (base_calcul=="CAE")	{
			document.getElementById('lbl_val').value = "Pourcentage du CA encaissé :";
			document.getElementById('infosQte').collapsed = true;
			document.getElementById('lbl_unite').value = "euros";
			document.getElementById('tranche_val').setAttribute('label',"% Chiffre d'Affaires Encaissé");
			document.getElementById('tMarque').disabled = true;
			document.getElementById('tFamilleArticle').disabled = true;
			document.getElementById('tArticleDirect').disabled = true;
			document.getElementById('tGlobaleComm').disabled=restrictionGlobale;
			document.getElementById('tAllArticle').disabled = true;
			document.getElementById('tHorsStock').disabled=true;
		}
		else if (base_calcul=="M")	{
			document.getElementById('lbl_val').value = "Pourcentage de la marge :";
			document.getElementById('infosQte').collapsed = true;
			document.getElementById('lbl_unite').value = "euros";
			document.getElementById('tranche_val').setAttribute('label',"% Marge");
			document.getElementById('tMarque').disabled = false;
			document.getElementById('tFamilleArticle').disabled = false;
			document.getElementById('tArticleDirect').disabled = false;
			document.getElementById('tGlobaleComm').disabled=true;
			document.getElementById('tAllArticle').disabled = false;
			document.getElementById('tHorsStock').disabled=true;
		}
		else if (base_calcul=="Q") {
			document.getElementById('lbl_val').value = "Montant :";
			document.getElementById('bModeCalculQte').label = (modeCalculQte=="P"?"%":"\u20AC");
			document.getElementById('bBaseCalculQte').label = (baseCalculQte=="CA"?"CA":"Marge");
			document.getElementById('infosQte').collapsed = false;
			document.getElementById('baseCalculQte').collapsed = (modeCalculQte!="P");
			document.getElementById('lbl_unite').value = "articles";
			var uniteValTranche = (modeCalculQte=="P"?"%":"Montant en \u20AC");
			if (modeCalculQte=="P") { uniteValTranche += (baseCalculQte=="CA"?" Chiffre d'Affaires":" Marge"); }
			document.getElementById('tranche_val').setAttribute('label',uniteValTranche);
			document.getElementById('tMarque').disabled = false;
			document.getElementById('tFamilleArticle').disabled = false;
			document.getElementById('tArticleDirect').disabled = false;
			document.getElementById('tGlobaleComm').disabled=true;
			document.getElementById('tAllArticle').disabled = false;
			document.getElementById('tHorsStock').disabled=true;
		}
		if (document.getElementById('Tranche').checked && (current_rule==null || !current_rule.haveTranche)) { generer_borne_inf(); }
	} catch(e) {
		recup_erreur(e);
	}
}


function switchModeCalculQte() {
	try {
		if (modeCalculQte=='P') {
			modeCalculQte='E';
			document.getElementById('bModeCalculQte').label = "\u20AC";
		} else {
			modeCalculQte='P';
			document.getElementById('bModeCalculQte').label = "%";
		}
		document.getElementById('baseCalculQte').collapsed = (modeCalculQte!="P");
		var uniteValTranche = (modeCalculQte=="P"?"%":"Montant");
		if (modeCalculQte=="P") { uniteValTranche += (baseCalculQte=="CA"?" CA":" Marge"); }
		document.getElementById('tranche_val').setAttribute('label',uniteValTranche);
	} catch (e) {
		recup_erreur(e);
	}
}


function switchBaseCalculQte() {
	try {
		if (baseCalculQte=='CA') {
			baseCalculQte='M';
			document.getElementById('bBaseCalculQte').label = "Marge";
		} else {
			baseCalculQte='CA';
			document.getElementById('bBaseCalculQte').label = "CA";
		}
		var uniteValTranche = (baseCalculQte=="CA"?"% CA":"% Marge");
		document.getElementById('tranche_val').setAttribute('label',uniteValTranche);
	} catch (e) {
		recup_erreur(e);
	}
}


function activer_tranches(etat) {
	try {
		if (!etat) {
			modeCalculQte="P";
			switchModeCalculQte();
		}
		document.getElementById('bModeCalculQte').disabled=((current_rule!=null && current_rule.haveTranche) || !etat);
		document.getElementById('Tranche').checked = etat;
		document.getElementById('box_tranche').collapsed = !etat;
		document.getElementById('btn_box_tranche').collapsed = !etat;
		document.getElementById('liste_tranches').collapsed = !etat;
		nouvelle_tranche();
	} catch (e) {
		recup_erreur(e);
	}
}


function action_derniere_tranche(etat) {
	try {
		document.getElementById('txt_bSup').collapsed = etat;
		document.getElementById('txt_bSup').value=(etat?"999999999999":"");
		document.getElementById('lbl_bsup').collapsed = etat;
		document.getElementById('lbl_unite').collapsed = etat;
	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamille1() {
	try {
		aFamille1.setParam("Commercial_Id", identifiant);
		aFamille1.setParam("Selection", chargement_famille_1);
		aFamille1.initTree(initFamille1);
	} catch (e) {
		recup_erreur(e);
	}
}

function initFamille1() {
	try {
		document.getElementById('liste_familles_1').value = select_famille_1;
		chargerFamille2();
	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamille2() {
	try {
		if (select_famille_1=="") {
			document.getElementById('liste_familles_2').collapsed = true;
		} else {
			document.getElementById('liste_familles_2').collapsed = false;
			aFamille2.setParam("Commercial_Id", identifiant);
			aFamille2.setParam("Parent_Id", select_famille_1);
			aFamille2.setParam("Selection", (select_famille_1==chargement_famille_1)?chargement_famille_2:select_famille_2);
			aFamille2.initTree(initFamille2);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille2() {
	try {
		document.getElementById('liste_familles_2').value = select_famille_2;
		chargerFamille3();
	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamille3() {
	try {
		if (select_famille_2=="" || select_famille_2=="0") {
			document.getElementById('liste_familles_3').collapsed = true;
		} else {
			document.getElementById('liste_familles_3').collapsed = false;
			aFamille3.setParam("Commercial_Id", identifiant);
			aFamille3.setParam("Parent_Id", select_famille_2);
			aFamille3.setParam("Selection", (select_famille_2==chargement_famille_2)?chargement_famille_3:select_famille_3);
			aFamille3.initTree(initFamille3);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille3() {
	try {
		document.getElementById('liste_familles_3').value = select_famille_3;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnFamille1() {
	try {
		select_famille_1 = document.getElementById('liste_familles_1').value;
		select_famille_2 = "";
		select_famille_3 = "";
		chargerFamille2();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnFamille2() {
	try {
		select_famille_2 = document.getElementById('liste_familles_2').value;
		select_famille_3 = "";
		chargerFamille3();
	} catch (e) {
		recup_erreur(e);
	}
}


function chargerMarques() {
	try {
		aMarques.setParam("Commercial_Id", identifiant);
		aMarques.setParam("Selection", select_marque);
		aMarques.initTree(initMarques);
	} catch (e) {
		recup_erreur(e);
	}
}


function initMarques() {
	try {
		document.getElementById('liste_marques').value = select_marque;
	} catch (e) {
		recup_erreur(e);
	}
}



function rechercherStock() {
	try {
		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
    window.openDialog(url,'','chrome,modal,centerscreen', retourRechercherStock);
	} catch (e) {
    recup_erreur(e);
  }
}


function retourRechercherStock(reference) {
	try {
		var qExArticle = new QueryHttp("Facturation/Commerciaux/existeRegleArticle.tmpl");
		qExArticle.setParam("Commercial_Id", identifiant);
		qExArticle.setParam("Commission_Id", commission_id);
		qExArticle.setParam("Article", reference);
		var result = qExArticle.execute();
		if (result.responseXML.documentElement.getAttribute("existe")=="true") {
			document.getElementById('article_id').value="";
			showWarning("L'article "+ reference +" est déjà utilisé dans une règle de commissionnement.");
		} else { document.getElementById('article_id').value = reference; }
	} catch (e) {
    recup_erreur(e);
  }
}



function charger_regle(copie) {
	try {
		var tree = document.getElementById('liste_regles_commissions');
		if (tree.view!=null && tree.currentIndex!=-1)	{
			aTranches.deleteTree();
			commission_id = getCellText(tree,tree.currentIndex, 'idcomm');

			var qRegle = new QueryHttp("Facturation/Commerciaux/charger_regle.tmpl");
			qRegle.setParam("Commission_Id", commission_id);
			var result = qRegle.execute();
			var contenu = result.responseXML.documentElement;

			var type_commission = contenu.getAttribute("Type");
			var base_calcul = contenu.getAttribute("Base_Calcul");
			var famille1 = copie?"":contenu.getAttribute("Famille_1");
			var famille2 = copie?"":contenu.getAttribute("Famille_2");
			var famille3 = copie?"":contenu.getAttribute("Famille_3");
			var article_id = copie?"":contenu.getAttribute("Article_Id");
			var marque = copie?"":contenu.getAttribute("Marque");
			var valeur = "";
			modeCalculQte = contenu.getAttribute("Mode_Calcul_Qte");
			baseCalculQte = contenu.getAttribute("Base_Calcul_Qte");

			current_rule = new Regle(type_commission,base_calcul,false,0,article_id,famille1,famille2,famille3,marque,modeCalculQte,baseCalculQte);
			var qTranches = new QueryHttp("Facturation/Commerciaux/charger_tranches.tmpl");
			qTranches.setParam("Commission_Id", commission_id);
			result = qTranches.execute();
			var les_tranches = result.responseXML.documentElement.getElementsByTagName("tranche");
			for (var i=0; i<les_tranches.length; i++) {
				var val = parseFloat(les_tranches.item(i).getAttribute("val"));
				var binf = parseFloat(les_tranches.item(i).getAttribute("binf"));
				var bsup = parseFloat(les_tranches.item(i).getAttribute("bsup"));

				if ((binf==0.00) && (bsup==0.00)) {
					// il n'y a pas de tranches
					valeur = val;
					current_rule.val = valeur;
				}
				else {
					current_rule.haveTranche = true;
					current_rule.addTranche(binf, bsup, val);
				}
			}

			document.getElementById('rgp_typeComm').value = type_commission;
			document.getElementById('article_id').value = article_id;
			document.getElementById('rgp_baseCalcul').value = base_calcul;
			document.getElementById('txt_val').value = valeur;
			document.getElementById('bCA').disabled=false;
			document.getElementById('bCAE').disabled=false;
			document.getElementById('bMarge').disabled=false;
			document.getElementById('bQuantite').disabled=false;
			document.getElementById('bModeCalculQte').disabled=false;
			document.getElementById('bBaseCalculQte').disabled=false;

			restreindre_regles();
			if (getNbRegles()==1) { restrictionCAE=false; }
			action_typeCommission();
			select_famille_1 = (type_commission=="FA"?famille1:"");
			select_famille_2 = (type_commission=="FA"?famille2:"");
			select_famille_3 = (type_commission=="FA"?famille3:"");
			chargement_famille_1 = select_famille_1;
			chargement_famille_2 = select_famille_2;
			chargement_famille_3 = select_famille_3;
			select_marque = (type_commission=="MQ"?marque:"");
			chargerFamille1();
			chargerMarques();
			afficher_tranches();
			activer_tranches(current_rule.haveTranche);
			document.getElementById('param_commissions').collapsed = false;
			document.getElementById('edition_regles').collapsed = true;
		}
	} catch(e) {
		recup_erreur(e);
	}
}



function getNbRegles() {
	try {
		var qNbRegles = new QueryHttp("Facturation/Commerciaux/getNbRegles.tmpl");
		qNbRegles.setParam("Commercial_Id", identifiant);
		var result = qNbRegles.execute();
		return parseInt(result.responseXML.documentElement.getAttribute('nbRegles'));
	} catch (e) {
		recup_erreur(e);
	}
}


function supprimer_regle() {
	try {
		var tree = document.getElementById('liste_regles_commissions');
		if (tree.view!=null && tree.currentIndex!=-1)	{
			if (confirm("Confirmez-vous la suppression de cette règle ?")) {
				var idcomm = getCellText(tree,tree.currentIndex, 'idcomm');
				var qSupCom = new QueryHttp("Facturation/Commerciaux/suppression_regle.tmpl");
				qSupCom.setParam("Commission_Id", idcomm);
				qSupCom.setParam("Commercial_Id", identifiant);
				qSupCom.execute();
				init_regles();
			}
		}
	} catch(e) {
		recup_erreur(e);
	}
}


function dupliquer_regle() {
	try {
		var tree = document.getElementById('liste_regles_commissions');
		if (tree.view!=null && tree.currentIndex!=-1)	{
			charger_regle(true);
			tree.view.selection.select(-1);
			commission_id=-1;
			document.getElementById('bChangeRule').disabled = true;
			document.getElementById('bDeleteRule').disabled = true;
			document.getElementById('bDuplicateRule').disabled = true;
		}
	} catch(e) {
		recup_erreur(e);
	}
}


function annuler_regle() {
	try {
		if (confirm("Souhaitez-vous abandonner les modifications en cours ?")) {
			init_regles();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function verifier_regle() {
	try {
		var message="";
		var etat=false;
		var type_commission=document.getElementById('rgp_typeComm').value;
		var has_tranche=document.getElementById('Tranche').checked;
		var base_calcul=document.getElementById('rgp_baseCalcul').value;
		var val=parseFloat(document.getElementById('txt_val').value);

		if (type_commission=="FA" && document.getElementById('liste_familles_1').value=="") {	message="Veuillez sélectionner une famille 1.";	}
		else if (type_commission=="FA" && document.getElementById('liste_familles_2').value=="") {	message="Veuillez sélectionner une famille 2."; }
		else if (type_commission=="FA" && document.getElementById('liste_familles_2').value!="0" && document.getElementById('liste_familles_3').value=="") {	message="Veuillez sélectionner une famille 3."; }
		else if (type_commission=="A" && isEmpty(document.getElementById('article_id').value)) { message="Veuillez sélectionner un article."; }
		else if (type_commission=="MQ" && document.getElementById('liste_marques').selectedIndex==0) { message="Veuillez sélectionner une marque."; }
		else if (has_tranche && (current_rule==null || (current_rule!=null && !current_rule.haveTranche))) { message="Veuillez ajouter au moins une tranche."; }
		else if (!has_tranche && (isEmpty(val) || !isPositive(val))) { message="La valeur doit être supérieure à zéro."; }
		else if ((modeCalculQte=="P") && !has_tranche && !isTaux(val)) { message="Le taux doit être compris entre 0 et 100."; }
		else { etat=true; }

		if (!etat) { showWarning(message); }
		return etat;
	} catch(e) {
		recup_erreur(e);
	}
}


function enregistrer_regle() {
	try {
		if (verifier_regle()) {
			var type_commission = document.getElementById("rgp_typeComm").value;
			var base_calcul = document.getElementById("rgp_baseCalcul").value;
			var famille1 = (type_commission=="FA"?document.getElementById("liste_familles_1").value:0);
			var famille2 = (type_commission=="FA"?document.getElementById("liste_familles_2").value:0);
			var famille3 = (type_commission=="FA" && document.getElementById('liste_familles_2').value!="0"?document.getElementById("liste_familles_3").value:0);
			var article_id = (type_commission=="A"?document.getElementById("article_id").value:"");
			var marque = (type_commission=="MQ")?document.getElementById("liste_marques").value:0;
			var has_tranche = document.getElementById("Tranche").checked;
			var valeur = nf2.format(has_tranche?0:document.getElementById('txt_val').value);

			if (base_calcul!="Q") { modeCalculQte="P"; baseCalculQte="CA"; }
			else if (modeCalculQte!="P") { baseCalculQte="CA"; }

			if (commission_id==-1 && current_rule==null) {
				current_rule = new Regle(type_commission,base_calcul,false,valeur,article_id,famille1,famille2,famille3,marque,modeCalculQte,baseCalculQte);
			} else {
				current_rule.type_comm = type_commission;
				current_rule.baseCalcul = base_calcul;
				current_rule.haveTranche = has_tranche;
				current_rule.val = valeur;
				current_rule.famille1 = famille1;
				current_rule.famille2 = famille2;
				current_rule.famille3 = famille3;
				current_rule.marque = marque;
				current_rule.article = article_id;
				current_rule.modeCalculQte = modeCalculQte;
				current_rule.baseCalculQte = baseCalculQte;

				var qNettoyer = new QueryHttp("Facturation/Commerciaux/suppression_regle.tmpl");
				qNettoyer.setParam("Commission_Id", commission_id);
				qNettoyer.setParam("Commercial_Id",identifiant);
				qNettoyer.execute();
			}

			var qEnregistrer = new QueryHttp("Facturation/Commerciaux/enregistrer_regle.tmpl");
			qEnregistrer.setParam("Commercial_Id",identifiant);
			qEnregistrer.setParam("Type",current_rule.type_comm);
			qEnregistrer.setParam("Base_Calcul",current_rule.baseCalcul);
			qEnregistrer.setParam("Article_Id",current_rule.article);
			qEnregistrer.setParam("Famille_1",current_rule.famille1);
			qEnregistrer.setParam("Famille_2",current_rule.famille2);
			qEnregistrer.setParam("Famille_3",current_rule.famille3);
			qEnregistrer.setParam("Marque",current_rule.marque);
			qEnregistrer.setParam("Val",current_rule.val);
			qEnregistrer.setParam("haveTranche",current_rule.haveTranche);
			qEnregistrer.setParam("Mode_Calcul_Qte",current_rule.modeCalculQte);
			qEnregistrer.setParam("Base_Calcul_Qte",current_rule.baseCalculQte);

			if (current_rule.haveTranche) {
				var listeBInf = "";
				var listeBSup = "";
				var listeVal = "";
				for (var i=0; i<current_rule.arrayTranche.length; i++) {
					listeBInf += nf2.format(current_rule.getTranche(i).binf)+",";
					listeBSup += nf2.format(current_rule.getTranche(i).bsup)+",";
					listeVal += nf2.format(current_rule.getTranche(i).valeur)+",";
				}
				qEnregistrer.setParam("BInf",listeBInf);
				qEnregistrer.setParam("BSup",listeBSup);
				qEnregistrer.setParam("Val",listeVal);
			}
			qEnregistrer.execute();

			init_regles();
			init_parametrage();
			document.getElementById('param_commissions').collapsed = true;
		}
	} catch(e) {
		recup_erreur(e);
	}
}


function afficher_tranches() {
	try {
		document.getElementById('tr_infini').checked=false;
		action_derniere_tranche(false);
		document.getElementById('btn_nouvelle_tranche').collapsed=true;
		document.getElementById('btn_valider_tranche').label="Enregistrer la tranche";
		document.getElementById('btn_delete_tranche').disabled=true;

		var base_calcul = document.getElementById('rgp_baseCalcul').value;
		aTranches.deleteTree();
		if (current_rule.haveTranche) {
			document.getElementById('txt_val').value = "";
			document.getElementById('bCA').disabled=(base_calcul=="Q");
			document.getElementById('bCAE').disabled=(base_calcul=="Q");
			document.getElementById('bMarge').disabled=(base_calcul=="Q");
			document.getElementById('bQuantite').disabled=(base_calcul!="Q");
			var listeBInf="";
			var listeBSup="";
			var listeVal="";
			for (i=0; i<current_rule.arrayTranche.length; i++) {
				listeBInf+=current_rule.getTranche(i).binf+",";
				listeBSup+=current_rule.getTranche(i).bsup+",";
				listeVal+=current_rule.getTranche(i).valeur+",";
			}
			aTranches.setParam("bInf",listeBInf);
			aTranches.setParam("bSup",listeBSup);
			aTranches.setParam("Val",listeVal);
			aTranches.initTree();

			if (!current_rule.existeBorneInfinie()) {
				generer_borne_inf();
				generer_borne_sup();
				document.getElementById('txt_bSup').disabled=false;
				document.getElementById('tr_infini').disabled=false;
			} else {
				document.getElementById('txt_bInf').value="";
				document.getElementById('txt_bSup').value="";
				document.getElementById('txt_bSup').disabled=true;
				document.getElementById('tr_infini').disabled=true;
				document.getElementById('btn_valider_tranche').disabled=true;
			}
		} else {
			document.getElementById('bCA').disabled=false;
			document.getElementById('bCAE').disabled=false;
			document.getElementById('bMarge').disabled=false;
			document.getElementById('bQuantite').disabled=false;
			nouvelle_tranche();
		}
		document.getElementById('bModeCalculQte').disabled=current_rule.haveTranche;
		document.getElementById('bBaseCalculQte').disabled=current_rule.haveTranche;
		tranche_id=-1;
	} catch(e) {
		recup_erreur(e);
	}
}


function nouvelle_tranche() {
	try {
		tranche_id=-1;
		document.getElementById('tr_infini').checked=false;
		action_derniere_tranche(false);
		var tree = document.getElementById('liste_tranches');
		if (tree.view!=null && tree.currentIndex!=-1) {
			tree.view.selection.select(-1);
			document.getElementById('txt_val').value = "";
		}
		generer_borne_inf();
		if (current_rule!=null && !current_rule.existeBorneInfinie()) {
			generer_borne_sup();
		} else {
			document.getElementById('txt_bSup').value = "";
		}

		var etat = (current_rule!=null && current_rule.existeBorneInfinie());
		document.getElementById('txt_bSup').disabled=etat;
		document.getElementById('tr_infini').disabled=etat;
		document.getElementById('btn_nouvelle_tranche').collapsed=true;
		document.getElementById('btn_valider_tranche').label="Enregistrer la tranche";
		document.getElementById('btn_valider_tranche').disabled=etat;
		document.getElementById('btn_delete_tranche').disabled=true;
	} catch(e) {
		recup_erreur(e);
	}
}


function verifier_tranche() {
	try {
		var message="";
		var etat=false;
		var type_commission=document.getElementById('rgp_typeComm').value;
		var base_calcul=document.getElementById('rgp_baseCalcul').value;
		var binf=parseFloat(document.getElementById('txt_bInf').value);
		var bsup=parseFloat(document.getElementById('txt_bSup').value);
		var val=parseFloat(document.getElementById('txt_val').value);

		if (type_commission=="FA" && document.getElementById('liste_familles_1').selectedIndex==0) {	message="Veuillez sélectionner une famille 1.";	}
		else if (type_commission=="FA" && document.getElementById('liste_familles_2').selectedIndex==0) {	message="Veuillez sélectionner une famille 2."; }
		else if (type_commission=="FA" && document.getElementById('liste_familles_2').value!="0" && document.getElementById('liste_familles_3').selectedIndex==0) {	message="Veuillez sélectionner une famille 3."; }
		else if (type_commission=="A" && isEmpty(document.getElementById('article_id').value)) { message="Veuillez sélectionner un article."; }
		else if (type_commission=="MQ" && document.getElementById('liste_marques').selectedIndex==0) {	message="Veuillez sélectionner une marque.";	}
		else if (isEmpty(bsup)) { message="Veuillez saisir la borne supérieure de la tranche."; }
		else if (!isPositive(bsup)) { message="La borne supérieure de la tranche doit être supérieure à zéro."; }
		else if ((base_calcul=="Q") && (!isPositiveInteger(bsup))) { message="La borne supérieure de la tranche doit être un nombre entier."; }
		else if (bsup<binf && (base_calcul!="Q" || bsup!=binf)) { message="L'interval de la tranche n'est pas valide."; }
		else if (isEmpty(val) || !isPositive(val)) { message="La valeur doit être supérieure à zéro."; }
		else if ((baseCalculQte=="P") && !isTaux(val)) { message="Le taux doit être compris entre 0 et 100."; }
		else { etat=true; }

		if (!etat) { showWarning(message); }
		return etat;
	} catch(e) {
		recup_erreur(e);
	}
}


function valider_tranche() {
	try {
		if (verifier_tranche()) {
			var type_commission=document.getElementById('rgp_typeComm').value;
			var base_calcul=document.getElementById('rgp_baseCalcul').value;
			var valeur=parseFloat(document.getElementById('txt_val').value);
			var famille1=(type_commission=="FA"?document.getElementById('liste_familles_1').value:0);
			var famille2=(type_commission=="FA"?document.getElementById('liste_familles_2').value:0);
			var famille3=(type_commission=="FA"?document.getElementById('liste_familles_3').value:0);
			var article = (type_commission=="A"?document.getElementById("article_id").value:"");
			var marque = (type_commission=="MQ"?document.getElementById("liste_marques").value:0);
			var bsup_infini=(document.getElementById('tr_infini').checked);
			var binf=parseFloat(document.getElementById('txt_bInf').value);
			var bsup=parseFloat(bsup_infini?999999999999:nf2.format(document.getElementById('txt_bSup').value));
			var gradient=(base_calcul!="Q"?0.01:1);

			if (current_rule == null) { current_rule = new Regle(type_commission, base_calcul, true, 0, article, famille1, famille2, famille3, marque, modeCalculQte, baseCalculQte); }
			if (!maj_tranche(valeur,bsup)) { current_rule.addTranche(binf,bsup,valeur); }
			afficher_tranches();
		}
	} catch(e) {
		recup_erreur(e);
	}
}



function select_tranche() {
	try {
		var tree = document.getElementById('liste_tranches');
		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById('btn_delete_tranche').disabled = false;
			tranche_id=getCellText(tree,tree.currentIndex, 'tranche_id');

			var binf=getCellText(tree,tree.currentIndex, 'binf');
			var bsup=getCellText(tree,tree.currentIndex, 'bsup');
			var val=nf2.format(getCellText(tree,tree.currentIndex, 'tranche_val'));

			if (document.getElementById('rgp_baseCalcul').value=="Q") {
				binf=nf.format(binf);
				if (bsup!="Infini") { bsup = nf.format(bsup); }
			} else {
				binf=nf2.format(binf);
				if (bsup!="Infini") { bsup = nf2.format(bsup); }
			}

			document.getElementById('txt_bInf').value=binf;
			document.getElementById('txt_val').value=val;

			if (bsup=="Infini") {
				document.getElementById('tr_infini').checked = true;
				action_derniere_tranche(true);
			}	else {
				document.getElementById('tr_infini').checked = false;
				action_derniere_tranche(false);
				document.getElementById('txt_bSup').value=bsup;
			}

			var niv = current_rule.rechercherTranche(tranche_id);
			var derniere_tranche = (niv==current_rule.arrayTranche.length-1);
			document.getElementById('txt_bSup').disabled=!derniere_tranche;
			document.getElementById('tr_infini').disabled=!derniere_tranche;
			document.getElementById('btn_nouvelle_tranche').collapsed=current_rule.existeBorneInfinie();
			document.getElementById('btn_valider_tranche').label="Modifier la tranche";
			document.getElementById('btn_valider_tranche').disabled=false;
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function maj_tranche(val, bsup) {
	try {
		var etat=false;
		if (tranche_id!=-1)	{
			var niv = current_rule.rechercherTranche(tranche_id);
			current_rule.arrayTranche[niv].bsup = bsup;
			current_rule.arrayTranche[niv].valeur = val;
			etat=true;
		}
		return etat;
	} catch(e) {
		recup_erreur(e);
	}
}



function supprimer_tranche() {
	try {
		var tree = document.getElementById('liste_tranches');
		if (tree.view!=null && tree.currentIndex!=-1)	{
			if (confirm("Confirmez-vous la suppression de toutes les tranches à partir de la tranche sélectionnée ?")) {
				var binferieure=getCellText(tree,tree.currentIndex, 'tranche_id');
				var niv = current_rule.rechercherTranche(binferieure);
				while (niv<current_rule.arrayTranche.length) { current_rule.removeTranche(niv);	}
				afficher_tranches();
			}
		}
	} catch(e) {
		recup_erreur(e);
	}
}


function generer_borne_inf() {
	try {
		var base_calcul = document.getElementById('rgp_baseCalcul').value;
		if (current_rule!=null && current_rule.arrayTranche.length>0) {
			if (!current_rule.existeBorneInfinie()) {
				var gradient = (base_calcul=="Q"?1:0.01);
				var val = parseFloat(current_rule.getTranche(current_rule.arrayTranche.length-1).bsup) + gradient;
				document.getElementById('txt_bInf').value = (base_calcul=="Q"?nf.format(val):nf2.format(val));
			} else {
				document.getElementById('txt_bInf').value = "";
			}
		} else {
			document.getElementById('txt_bInf').value = (base_calcul=="Q"?"1":"0.01");
		}
	} catch(e) {
		recup_erreur(e);
	}
}


function generer_borne_sup() {
	try {
		if (current_rule.arrayTranche.length>0) {
			var base_calcul = document.getElementById('rgp_baseCalcul').value;
			var val_bsup = parseFloat(current_rule.getTranche(current_rule.arrayTranche.length-1).bsup);
			var val_binf = parseFloat(current_rule.getTranche(current_rule.arrayTranche.length-1).binf)

			var diff = val_bsup-val_binf;
			var new_bsup=val_bsup+diff;
			var diviseur=Math.pow(10, (""+nf.format(new_bsup)).length-1);
			var mod=new_bsup%diviseur;
			var valeur = (mod==0?(base_calcul=="Q"?nf.format(diviseur+new_bsup):nf2.format(diviseur+new_bsup)):(base_calcul=="Q"?nf.format(diviseur+new_bsup-mod):nf2.format(diviseur+new_bsup-mod)));

			document.getElementById('txt_bSup').value = valeur;
		}
	} catch(e) {
		recup_erreur(e);
	}
}


function Tranche(binf,bsup,val) {
	this.binf=binf;
	this.bsup=bsup;
	this.valeur=val;
}

function Regle(type_comm, baseCalcul, haveTranche, val, article, famille1, famille2, famille3, marque, modeCalculQte, baseCalculQte) {
	this.type_comm=type_comm;
	this.baseCalcul=baseCalcul;
	this.haveTranche=haveTranche;
	this.arrayTranche=new Array();
	this.val=val;
	this.article=article;
	this.famille1=isEmpty(famille1)?0:famille1;
	this.famille2=isEmpty(famille2)?0:famille2;
	this.famille3=isEmpty(famille3)?0:famille3;
	this.marque=isEmpty(marque)?0:marque;
	this.modeCalculQte=modeCalculQte;
	this.baseCalculQte=baseCalculQte;
}

Regle.prototype.existeBorneInfinie=function() {
	return (this.arrayTranche.length>0 && parseFloat(this.arrayTranche[this.arrayTranche.length-1].bsup)==999999999999.00);
}

Regle.prototype.addTranche=function(binf,bsup,val) {
	if (binf>0 && bsup>0 && val>0) {
		this.arrayTranche.push(new Tranche(binf,bsup,val));
		this.haveTranche = true;
	}
}

Regle.prototype.removeTranche=function(rang) {
	if (rang>=0 && rang<this.arrayTranche.length) { this.arrayTranche.splice(rang,1); }
	if (this.arrayTranche.length == 0) { this.haveTranche = false; }
}

Regle.prototype.getTranche=function(rang) {
	if (rang>=0 && rang<this.arrayTranche.length) {	return this.arrayTranche[rang];	}
}

Regle.prototype.rechercherTranche=function(binf) {
	if (binf>0) {
		var i=0;
		while(binf!=parseFloat(this.arrayTranche[i].binf) && i<this.arrayTranche.length) {
			i++;
		}
		return i;
	}
}


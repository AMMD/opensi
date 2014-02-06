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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/banques.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");

var currentFournisseur = "";
var defaut_contact = "";
var numeroration_auto = false;
var premierChargement = true;

function init() {
	try {

		window.parent.addEventListener("close",demandeEnregistrement,false);
		
		var corps = cookie() +"&Page=Config/gestion_commerciale/preferences/getParam.tmpl&ContentType=xml";
		var p = requeteHTTP(corps);
		numerotation_auto = (p.responseXML.documentElement.getAttribute("Format_NF")!="");

		initFicheFournisseur();
		oef_init();
		document.getElementById('Modifie').value = "n";

		rechercherFournisseur();

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
		}
		else {
			document.getElementById('bSupprimer').collapsed = true;
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function enregistrerTout() {
	try {

		var Action = document.getElementById('Action').value;

		var corps;

		if (Action=="M") {
			corps = cookie() +"&Page=Facturation/Fournisseurs/modifierFournisseur.tmpl&ContentType=xml";
		}
		else {
			corps = cookie() +"&Page=Facturation/Fournisseurs/creerFournisseur.tmpl&ContentType=xml";
		}


		// Champs onglet fiche signalétique
		var fournisseur_id = document.getElementById('ff-Fournisseur_Id').value;
		var raison_sociale = document.getElementById('ff-Denomination').value;
		var civilite = document.getElementById('ff-Civilite').value;
		var nom = document.getElementById('ff-Nom').value;
		var prenom = document.getElementById('ff-Prenom').value;
		var adresse = document.getElementById('ff-Adresse').value;
		var comp_adresse = document.getElementById('ff-Comp_Adresse').value;
		var adresse_3 = document.getElementById('ff-Adresse_3').value;
		var code_postal = document.getElementById('ff-Code_Postal').value;
		var ville = document.getElementById('ff-Ville').value;
		var code_pays = document.getElementById('ff-Code_Pays').value;
		var tel_1 = document.getElementById('ff-Tel_1').value;
		var tel_2 = document.getElementById('ff-Tel_2').value;
		var tel_3 = document.getElementById('ff-Tel_3').value;
		var fax_1 = document.getElementById('ff-Fax_1').value;
		var fax_2 = document.getElementById('ff-Fax_2').value;
		var email_1 = document.getElementById('ff-Email_1').value;
		var email_2 = document.getElementById('ff-Email_2').value;
		var site_web = document.getElementById('ff-Site_Web').value;
		var logisticien = document.getElementById('ff-chkLogisticien').checked?"1":"0";
		var com_libre = document.getElementById('ff-Com_Libre').value;
		var code_couleur = document.getElementById('ff-Code_Couleur').value;
		var type_societe = document.getElementById('ff-Type_Societe').value;
		var famille = document.getElementById('ff-Famille').value;
		var secteur = document.getElementById('ff-Secteur').value;
		var num_tva_intra = document.getElementById('ff-Num_TVA_Intra').value;
		var num_siret = document.getElementById('ff-Num_SIRET').value;
		var code_naf = document.getElementById('ff-Code_NAF').value;
		var qualite_relation = document.getElementById('ff-Qualite_Relation').value;
		var respect_delai = document.getElementById('ff-Respect_Delai').value;
		var competitivite = document.getElementById('ff-Competitivite').value;
		var indications = document.getElementById('ff-Indications').value;
		var utilR = document.getElementById('ff-Responsable').value;
		var code_client = document.getElementById('ff-Code_Client').value;
		var actif = document.getElementById('ff-Actif').value;
		var date_ouverture = document.getElementById('ff-Date_Ouverture').value;
		
		if (Action=="M" || !numerotation_auto) {
			corps += "&Fournisseur_Id="+ urlEncode(fournisseur_id);
		}

		corps += "&Denomination="+ urlEncode(raison_sociale) +"&Adresse="+ urlEncode(adresse) +"&Comp_Adresse="+ urlEncode(comp_adresse);
		corps += "&Code_Postal="+ code_postal +"&Ville="+ urlEncode(ville) +"&Code_Pays="+ urlEncode(code_pays) +"&Tel_1="+ urlEncode(tel_1) +"&Tel_2="+ urlEncode(tel_2) +"&Tel_3="+ urlEncode(tel_3);
		corps += "&Fax_1="+ urlEncode(fax_1) +"&Fax_2="+ urlEncode(fax_2) +"&Email_1="+ urlEncode(email_1) +"&Email_2="+ urlEncode(email_2) +"&Site_Web="+ urlEncode(site_web) +"&Logisticien="+ logisticien +"&Com_Libre="+ urlEncode(com_libre);
		corps += "&Code_Couleur="+ code_couleur +"&Type_Societe="+ type_societe +"&Famille="+ famille +"&Secteur="+ secteur +"&Num_TVA_Intra="+ urlEncode(num_tva_intra);
		corps += "&Num_SIRET="+ urlEncode(num_siret) +"&Code_NAF="+ urlEncode(code_naf) +"&Qualite_Relation="+ qualite_relation +"&Respect_Delai="+ respect_delai;
		corps += "&Competitivite="+ competitivite +"&Civilite="+ civilite +"&Nom="+ urlEncode(nom) +"&Prenom="+ urlEncode(prenom) +"&Indications="+ urlEncode(indications);
		corps += "&Adresse_3="+ urlEncode(adresse_3) + "&Util_R="+ utilR +"&Code_Client="+ urlEncode(code_client);
		corps += "&Actif="+ actif +"&Date_Ouverture="+ (!isEmpty(date_ouverture) && isDate(date_ouverture)?prepareDateJava(date_ouverture):date_ouverture);

		// Champs onglet Eléments de gestion
		var site_web_com = document.getElementById('oef-Site_Web').value;
		var login_web = document.getElementById('oef-Login_Web').value;
		var pass_web = document.getElementById('oef-Pass_Web').value;
		var encours_auto = document.getElementById('oef-Encours_Auto').value;
		var numero_compte = document.getElementById('oef-Numero_Compte').value;
		var taux_remise = document.getElementById('oef-Taux_Remise').value;
		var remise_1 = document.getElementById('oef-Remise_1').value;
		var remise_2 = document.getElementById('oef-Remise_2').value;
		var remise_3 = document.getElementById('oef-Remise_3').value;
		var remise_4 = document.getElementById('oef-Remise_4').value;
		var remise_5 = document.getElementById('oef-Remise_5').value;
		var tranche_ca0 = document.getElementById('oef-Tranche_CA0').value;
		var tranche_ca1 = document.getElementById('oef-Tranche_CA1').value;
		var tranche_ca2 = document.getElementById('oef-Tranche_CA2').value;
		var tranche_ca3 = document.getElementById('oef-Tranche_CA3').value;
		var tranche_ca4 = document.getElementById('oef-Tranche_CA4').value;
		var taux_rfa = document.getElementById('oef-Taux_RFA').value;
		var remise_fixe = document.getElementById('oef-Remise_Fixe').value;
		var remise_var = document.getElementById('oef-Remise_Var').value;
		var delai_livraison = document.getElementById('oef-Delai_Livraison').value;
		var mode_reg = document.getElementById('oef-Mode_Reg').value;
		var delai_reg = document.getElementById('oef-Delai_Reg').value;
		var type_reg = document.getElementById('oef-Type_Reg').value;
		var jour_fact = document.getElementById('oef-Jour_Fact').value;
		var banqueRetrait = document.getElementById('oef-banqueRetrait').value;
		var francoPort = document.getElementById('oef-chkFrancoPort').checked;
		var montantFranco = document.getElementById('oef-montantFranco').value;
		var fraisPort = document.getElementById('oef-fraisPort').value;

		corps += "&Site_Web_Com="+ urlEncode(site_web_com);
		corps += "&Login_Web="+ urlEncode(login_web) +"&Pass_Web="+ urlEncode(pass_web);
		corps += "&Encours_Auto="+ encours_auto +"&Numero_Compte="+ numero_compte;
		corps += "&Taux_Remise="+ taux_remise +"&Remise_1="+ remise_1 +"&Remise_2="+ remise_2 +"&Remise_3="+ remise_3 +"&Remise_4="+ remise_4 +"&Remise_5="+ remise_5;
		corps += "&Tranche_CA0="+ tranche_ca0 +"&Tranche_CA1="+ tranche_ca1 +"&Tranche_CA2="+ tranche_ca2 +"&Tranche_CA3="+ tranche_ca3 +"&Tranche_CA4="+ tranche_ca4;
		corps += "&Taux_RFA="+ taux_rfa +"&Remise_Fixe="+ remise_fixe +"&Remise_Var="+ remise_var;
		corps += "&Delai_Livraison="+ delai_livraison +"&Mode_Reg="+ urlEncode(mode_reg);
		corps += "&Delai_Reg="+ delai_reg +"&Type_Reg="+ type_reg +"&Jour_Fact="+ jour_fact + "&Banque_Retrait="+ banqueRetrait;
		corps += "&Franco_Port=" + (francoPort?1:0) +"&Montant_Franco="+ montantFranco +"&Frais_Port="+ fraisPort +"&Type_Port="+ oef_typePort;


		var saveOK = false;

		if (Action=="C" && isEmpty(fournisseur_id) && !numerotation_auto) { showWarning("Veuillez spécifier un code fournisseur ! (Onglet fiche signalétique)"); }
		else if (Action=="C" && existeFournisseur(fournisseur_id) && !numerotation_auto) { showWarning("Le code fournisseur '"+ fournisseur_id +"' est déjà utilisé ! (Onglet fiche signalétique)"); }
		else if (Action=="C" && !isCleAlpha(fournisseur_id) && !numerotation_auto) { showWarning("Code fournisseur invalide ! (Onglet fiche signalétique)"); }
		else if (isEmpty(raison_sociale)) { showWarning("Veuillez spécifier la raison sociale de l'entreprise ! (Onglet fiche signalétique)"); }
		else if (isEmpty(adresse)) { showWarning("Veuillez spécifier l'adresse de l'entreprise ! (Onglet fiche signalétique)"); }
		else if (isEmpty(ville)) { showWarning("Veuillez spécifier la ville de l'entreprise ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(date_ouverture) && !isDate(date_ouverture)) { showWarning("Date d'ouverture de compte incorrecte ! (Onglet fiche signalétique)"); }
		//else if (isEmpty(code_client)) { showWarning("Veuillez spécifier votre numéro de client ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(tel_1) && !isPhone(tel_1)) { showWarning("Numéro de téléphone 1 incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(tel_2) && !isPhone(tel_2)) { showWarning("Numéro de téléphone 2 incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(tel_3) && !isPhone(tel_3)) { showWarning("Numéro de téléphone 3 incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(fax_1) && !isPhone(fax_1)) { showWarning("Numéro de fax 1 incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(fax_2) && !isPhone(fax_2)) { showWarning("Numéro de fax 2 incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(email_1) && !isEmail(email_1)) { showWarning("Adresse e-mail 1 incorrecte ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(email_2) && !isEmail(email_2)) { showWarning("Adresse e-mail 2 incorrecte ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(site_web) && !isWeb(site_web)) { showWarning("Site Web incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(num_siret) && (num_siret.length != 14 || !isDigitList(num_siret))) { showWarning("Numéro SIRET incorrect ! (Onglet fiche signalétique)"); }
		
		else if (isEmpty(encours_auto) || !isPositiveOrNull(encours_auto)) { showWarning("Encours autorisé incorrect ! (Onglet éléments de gestion)"); }
		else if (isEmpty(tranche_ca0) || !isPositiveOrNull(tranche_ca0)) { showWarning("Tranches de chiffre d'affaires incorrectes ! (Onglet éléments de gestion)"); }
		else if (isEmpty(tranche_ca1) || !isPositiveOrNull(tranche_ca1)) { showWarning("Tranches de chiffre d'affaires incorrectes ! (Onglet éléments de gestion)"); }
		else if (isEmpty(tranche_ca2) || !isPositiveOrNull(tranche_ca2)) { showWarning("Tranches de chiffre d'affaires incorrectes ! (Onglet éléments de gestion)"); }
		else if (isEmpty(tranche_ca3) || !isPositiveOrNull(tranche_ca3)) { showWarning("Tranches de chiffre d'affaires incorrectes ! (Onglet éléments de gestion)"); }
		else if (isEmpty(tranche_ca4) || !isPositiveOrNull(tranche_ca4)) { showWarning("Tranches de chiffre d'affaires incorrectes ! (Onglet éléments de gestion)"); }
		else if (isEmpty(remise_fixe) || !isPositiveOrNull(remise_fixe)) { showWarning("Montant de remise fixe incorrect ! (Onglet éléments de gestion)"); }
		else if (isEmpty(taux_remise) || !isTaux(taux_remise)) { showWarning("Taux de remise incorrect ! (Onglet éléments de gestion)"); }
		else if (isEmpty(remise_var) || !isTaux(remise_var)) { showWarning("Part variable de remise incorrecte ! (Onglet éléments de gestion)"); }
		else if (isEmpty(taux_rfa) || !isTaux(taux_rfa)) { showWarning("Taux de remise RFA incorrect ! (Onglet éléments de gestion)"); }
		else if (isEmpty(remise_1) || !isTaux(remise_1)) { showWarning("Taux de remise par tranche de CA incorrectes ! (Onglet éléments de gestion)"); }
		else if (isEmpty(remise_2) || !isTaux(remise_2)) { showWarning("Taux de remise par tranche de CA incorrectes ! (Onglet éléments de gestion)"); }
		else if (isEmpty(remise_3) || !isTaux(remise_3)) { showWarning("Taux de remise par tranche de CA incorrectes ! (Onglet éléments de gestion)"); }
		else if (isEmpty(remise_4) || !isTaux(remise_4)) { showWarning("Taux de remise par tranche de CA incorrectes ! (Onglet éléments de gestion)"); }
		else if (isEmpty(remise_5) || !isTaux(remise_5)) { showWarning("Taux de remise par tranche de CA incorrectes ! (Onglet éléments de gestion)"); }
		else if (isEmpty(delai_livraison) || !isPositiveOrNullInteger(delai_livraison)) { showWarning("Délai de livraison incorrect ! (Onglet éléments de gestion)"); }
		else if (isEmpty(delai_reg) || !isPositiveOrNullInteger(delai_reg)) { showWarning("Délai de règlement incorrect ! (Onglet éléments de gestion)"); }
		else if (!isEmpty(jour_fact) && (!isPositiveInteger(jour_fact) || jour_fact>30)) { showWarning("Jour de règlement incorrect ! (Onglet éléments de gestion)"); }
		else if (francoPort && !isPositiveOrNull(montantFranco)) { showWarning("Le montant du franco de port est incorrect ! (Onglet éléments de gestion)"); }
		else if (oef_typePort=='P'?!isTaux(fraisPort):!isPositiveOrNull(fraisPort)) { showWarning("Le montant des frais de port est incorrect ! (Onglet éléments de gestion)"); }
		else {
			var p = requeteHTTP(corps);
			
			if (numerotation_auto && p.responseXML.documentElement.getAttribute("Fournisseur_Id")=="") {
				showWarning("Erreur : le format de num\u00E9rotation actuel ne permet plus de g\u00E9n\u00E9rer de num\u00E9ros fournisseur pour la p\u00E9riode d\u00E9finie !");
			} else {

				saveOK = true;
	
				showWarning("La fiche fournisseur a \u00E9t\u00E9 enregistr\u00E9e !");
	
				if (Action=="C") {
					initFicheFournisseur();
					document.getElementById('Action').value = "M";
					if (numerotation_auto) {
						fournisseur_id = p.responseXML.documentElement.getAttribute("Fournisseur_Id");
						document.getElementById('ff-Fournisseur_Id').value = fournisseur_id;
					}
					currentFournisseur = fournisseur_id;
					document.getElementById('Fournisseur').value = fournisseur_id;
	
					document.getElementById('bSupprimer').collapsed = false;
					document.getElementById('TabContacts').collapsed = false;
					document.getElementById('TabBanques').collapsed = false;
					document.getElementById('TabArticles').collapsed = false;
					document.getElementById('TabHistorique').collapsed = false;
					document.getElementById('TabAdrCom').collapsed = false;
					chargerFournisseur();
					document.getElementById('ff-Fournisseur_Id').disabled = true;
					document.getElementById('bChgCodeFournisseur').collapsed = numerotation_auto;
					document.getElementById('ff-Fournisseur_Id').collapsed=false;
					document.getElementById('lblAuto').collapsed=true;
				}
	
				document.getElementById('Modifie').value = "n";
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
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à la fiche fournisseur ?")) {
				enregistrerTout();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function rechercherFournisseur() {
	try {

		var Action = document.getElementById('Action').value;
		var Modifie = document.getElementById('Modifie').value;
		var change = true;

		if (premierChargement) {
			premierChargement = false;
			document.getElementById('Action').value = "C";
			document.getElementById('Modifie').value = "n";
		}
		if (Modifie=="y") {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à la fiche fournisseur ?")) {
				change = enregistrerTout();
			}
		}

		if (change) {
			var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie();
			window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherFournisseur);
			Action = document.getElementById('Action').value;

			if (Action=="M") {
				document.getElementById('bSupprimer').collapsed = false;
				document.getElementById('TabContacts').collapsed = false;
				document.getElementById('TabBanques').collapsed = false;
				document.getElementById('TabArticles').collapsed = false;
				document.getElementById('TabHistorique').collapsed = false;
				document.getElementById('TabAdrCom').collapsed = false;
				currentFournisseur = document.getElementById('Fournisseur').value;
				chargerFournisseur();
				document.getElementById('ff-Fournisseur_Id').disabled = true;
				document.getElementById('bChgCodeFournisseur').collapsed = numerotation_auto;
				document.getElementById('ff-Fournisseur_Id').collapsed=false;
				document.getElementById('lblAuto').collapsed=true;
			}
			else {
				document.getElementById('bSupprimer').collapsed = true;
  			document.getElementById('TabContacts').collapsed = true;
				document.getElementById('TabArticles').collapsed = true;
				document.getElementById('TabBanques').collapsed = true;
				document.getElementById('TabHistorique').collapsed = true;
				document.getElementById('TabAdrCom').collapsed = true;

				document.getElementById('Creation').label = "";
				document.getElementById('Modification').label = "";
				document.getElementById('Creation').collapsed = true;
				document.getElementById('Modification').collapsed = true;
				document.getElementById('Fiche').label = "";

				document.getElementById('ff-Fournisseur_Id').disabled = numerotation_auto;
				document.getElementById('bChgCodeFournisseur').collapsed = true;
				document.getElementById('ff-Fournisseur_Id').collapsed=numerotation_auto;
				document.getElementById('lblAuto').collapsed=!numerotation_auto;
				setDefaultValues();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}

function retourRechercherFournisseur(codeFournisseur) {
	try {
		document.getElementById('Fournisseur').value = codeFournisseur;
		document.getElementById('Action').value = (isEmpty(codeFournisseur)?"C":"M");
	} catch (e) {
		recup_erreur(e);
	}
}


function setDefaultValues() {
	try {

		defaut_contact = "";

		document.getElementById('Panneau').selectedIndex = 0;
		hideButtons(false);

		// valeurs onglet fiche signalétique

		document.getElementById('ff-Respect_Delai').selectedItem = document.getElementById('ff-DelaiOui');
		document.getElementById('ff-Qualite_Relation').selectedItem = document.getElementById('ff-QualiteB');
		document.getElementById('ff-Competitivite').selectedItem = document.getElementById('ff-Comp1');
		document.getElementById('ff-Fournisseur_Id').value = "";
		document.getElementById('ff-Denomination').value = "";
		document.getElementById('ff-Civilite').selectedItem = document.getElementById('ff-CiviliteM');
		document.getElementById('ff-Nom').value = "";
		document.getElementById('ff-Prenom').value = "";
		document.getElementById('ff-Adresse').value = "";
		document.getElementById('ff-Comp_Adresse').value = "";
		document.getElementById('ff-Adresse_3').value = "";
		document.getElementById('ff-Code_Postal').value = "";
		document.getElementById('ff-Ville').value = "";
		document.getElementById('ff-Code_Pays').value = "FR";
		document.getElementById('ff-Tel_1').value = "";
		document.getElementById('ff-Tel_2').value = "";
		document.getElementById('ff-Tel_3').value = "";
		document.getElementById('ff-Fax_1').value = "";
		document.getElementById('ff-Fax_2').value = "";
		document.getElementById('ff-Email_1').value = "";
		document.getElementById('ff-Email_2').value = "";
		document.getElementById('ff-Site_Web').value = "";
		document.getElementById('ff-chkLogisticien').checked=false;
		document.getElementById('ff-Com_Libre').value = "";
		document.getElementById('ff-Responsable').value = get_cookie("User");
		document.getElementById('ff-Code_Couleur').value = 2;
		document.getElementById('ff-Num_TVA_Intra').value = "";
		document.getElementById('ff-Num_SIRET').value = "";
		document.getElementById('ff-Code_NAF').value = "";
		ff_chargerFamille("0");
		ff_chargerResponsables(get_cookie("User"));
		document.getElementById('ff-Secteur').selectedIndex = 0;
		selectTypeSociete('SARL');
		document.getElementById('ff-Indications').value = "";
		document.getElementById('ff-Actif').selectedItem = document.getElementById('ff-ActifOui');
		document.getElementById('ff-Date_Ouverture').value = "";
		document.getElementById('ff-Code_Client').value = "";

		// valeurs onglet éléments de gestion
		
		document.getElementById('oef-Encours_Auto').value = 0.00;
		document.getElementById('oef-Site_Web').value = "";
		document.getElementById('oef-Login_Web').value = "";
		document.getElementById('oef-Pass_Web').value = "";
		document.getElementById('oef-Numero_Compte').value = "";
		document.getElementById('oef-Collectif').value = "";
		document.getElementById('oef-Type_Reg').selectedItem = document.getElementById('oef-RegF');
		document.getElementById('oef-Taux_Remise').value = 0;
		document.getElementById('oef-Remise_Fixe').value = 0;
		document.getElementById('oef-Remise_Var').value = 0;
		document.getElementById('oef-Taux_RFA').value = 0;
		document.getElementById('oef-Delai_Reg').value = 0;
		document.getElementById('oef-Delai_Livraison').value = 0;
		oef_chargerModesReglements("0");
		document.getElementById('oef-Jour_Fact').value = "";
		document.getElementById('oef-banqueRetrait').value = "0";
		document.getElementById('oef-chkFrancoPort').checked = false;
		document.getElementById('oef-montantFranco').disabled = true;
		document.getElementById('oef-montantFranco').value = "0.00";
		document.getElementById('oef-fraisPort').value = "0.00";
		oef_typePort = 'M';
		document.getElementById('oef-bTypePort').setAttribute("class", "bIcoEuro");


		// en attendant autre gestion
		document.getElementById('oef-Remise_1').value = 0;
		document.getElementById('oef-Remise_2').value = 0;
		document.getElementById('oef-Remise_3').value = 0;
		document.getElementById('oef-Remise_4').value = 0;
		document.getElementById('oef-Remise_5').value = 0;

		document.getElementById('oef-Tranche_CA0').value = 0;
		document.getElementById('oef-Tranche_CA1').value = 0;
		document.getElementById('oef-Tranche_CA2').value = 0;
		document.getElementById('oef-Tranche_CA3').value = 0;
		document.getElementById('oef-Tranche_CA4').value = 0;
		document.getElementById('oef-De1').value = "0.00";
		document.getElementById('oef-De2').value = "0.00";
		document.getElementById('oef-De3').value = "0.00";
		document.getElementById('oef-De4').value = "0.00";

		document.getElementById('Modifie').value = "n";

	} catch (e) {
		recup_erreur(e);
	}
}


function selectTypeSociete(typeSociete) {
	try {
		var selected = false;
		var i=0;
		var menulist = document.getElementById('ff-Type_Societe');
		var items = menulist.getElementsByTagName("menuitem");
		while (!selected && i<items.length) {
			if (items[i].getAttribute("label")==typeSociete) {
				menulist.selectedIndex = i;
				selected = true;
			}
			i++;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFournisseur() {
	try {

		document.getElementById('Panneau').selectedIndex = 0;
		hideButtons(false);

		var corps = cookie() +"&Page=Facturation/Fournisseurs/getFournisseur.tmpl&ContentType=xml&Fournisseur_Id="+ document.getElementById('Fournisseur').value;

		var p = requeteHTTP(corps);

    var contenu = p.responseXML.documentElement;

		// onglet fiche signalétique

		document.getElementById('ff-Fournisseur_Id').value = contenu.getAttribute('Fournisseur_Id');
		document.getElementById('ff-Denomination').value = contenu.getAttribute('Denomination');

		if (contenu.getAttribute('Civilite')==1) { document.getElementById('ff-Civilite').selectedItem = document.getElementById('ff-CiviliteM'); }
		else if (contenu.getAttribute('Civilite')==2) { document.getElementById('ff-Civilite').selectedItem = document.getElementById('ff-CiviliteMme'); }
		else { document.getElementById('ff-Civilite').selectedItem = document.getElementById('ff-CiviliteMlle'); }

		document.getElementById('ff-Nom').value = contenu.getAttribute('Nom');
		document.getElementById('ff-Prenom').value = contenu.getAttribute('Prenom');
		document.getElementById('ff-Adresse').value = contenu.getAttribute('Adresse');
		document.getElementById('ff-Comp_Adresse').value = contenu.getAttribute('Comp_Adresse');
		document.getElementById('ff-Adresse_3').value = contenu.getAttribute('Adresse_3');
		document.getElementById('ff-Code_Postal').value = contenu.getAttribute('Code_Postal');
		document.getElementById('ff-Ville').value = contenu.getAttribute('Ville');
		document.getElementById('ff-Code_Pays').value = contenu.getAttribute('Code_Pays');
		document.getElementById('ff-Tel_1').value = contenu.getAttribute('Tel_1');
		document.getElementById('ff-Tel_2').value = contenu.getAttribute('Tel_2');
		document.getElementById('ff-Tel_3').value = contenu.getAttribute('Tel_3');
		document.getElementById('ff-Fax_1').value = contenu.getAttribute('Fax_1');
		document.getElementById('ff-Fax_2').value = contenu.getAttribute('Fax_2');
		document.getElementById('ff-Email_1').value = contenu.getAttribute('Email_1');
		document.getElementById('ff-Email_2').value = contenu.getAttribute('Email_2');
		document.getElementById('ff-Site_Web').value = contenu.getAttribute('Site_Web');
		document.getElementById('ff-chkLogisticien').checked = (contenu.getAttribute('Logisticien')=="1");
		document.getElementById('ff-Com_Libre').value = contenu.getAttribute('Com_Libre');
		document.getElementById('ff-Code_Client').value = contenu.getAttribute('Code_Client');
		document.getElementById('ff-Code_Couleur').value = contenu.getAttribute('Code_Couleur');
		document.getElementById('ff-Type_Societe').value = contenu.getAttribute('Type_Societe');
		ff_chargerFamille(contenu.getAttribute('Famille'));
		ff_chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById('ff-Secteur').value = contenu.getAttribute('Secteur');
		document.getElementById('ff-Num_TVA_Intra').value = contenu.getAttribute('Num_TVA_Intra');
		document.getElementById('ff-Num_SIRET').value = contenu.getAttribute('Num_SIRET');
		document.getElementById('ff-Code_NAF').value = contenu.getAttribute('Code_NAF');
		document.getElementById('ff-Indications').value = contenu.getAttribute('Indications');
		document.getElementById('ff-Date_Ouverture').value = contenu.getAttribute('Date_Ouverture');

		if (contenu.getAttribute('Qualite_Relation')=="E") { document.getElementById('ff-Qualite_Relation').selectedItem = document.getElementById('ff-QualiteE'); }
		else if (contenu.getAttribute('Qualite_Relation')=="B") { document.getElementById('ff-Qualite_Relation').selectedItem = document.getElementById('ff-QualiteB'); }
		else if (contenu.getAttribute('Qualite_Relation')=="M") { document.getElementById('ff-Qualite_Relation').selectedItem = document.getElementById('ff-QualiteM'); }
		else { document.getElementById('ff-Qualite_Relation').selectedItem = document.getElementById('ff-QualiteN'); }

		if (contenu.getAttribute('Respect_Delai')==1) { document.getElementById('ff-Respect_Delai').selectedItem = document.getElementById('ff-DelaiOui'); }
		else { document.getElementById('ff-Respect_Delai').selectedItem = document.getElementById('ff-DelaiNon'); }

		if (contenu.getAttribute('Competitivite')==5) { document.getElementById('ff-Competitivite').selectedItem = document.getElementById('ff-Comp5'); }
		else if (contenu.getAttribute('Competitivite')==2) { document.getElementById('ff-Competitivite').selectedItem = document.getElementById('ff-Comp2'); }
		else if (contenu.getAttribute('Competitivite')==3) { document.getElementById('ff-Competitivite').selectedItem = document.getElementById('ff-Comp3'); }
		else if (contenu.getAttribute('Competitivite')==4) { document.getElementById('ff-Competitivite').selectedItem = document.getElementById('ff-Comp4'); }
		else { document.getElementById('ff-Competitivite').selectedItem = document.getElementById('ff-Comp1'); }

		if (contenu.getAttribute('Actif')==1) { document.getElementById('ff-Actif').selectedItem = document.getElementById('ff-ActifOui'); }
		else { document.getElementById('ff-Actif').selectedItem = document.getElementById('ff-ActifNon'); }

		// onglet éléments de gestion
		document.getElementById('oef-Site_Web').value = contenu.getAttribute('Site_Web_Com');
		document.getElementById('oef-Login_Web').value = contenu.getAttribute('Login_Web');
		document.getElementById('oef-Pass_Web').value = contenu.getAttribute('Pass_Web');
		document.getElementById('oef-Encours_Auto').value = contenu.getAttribute('Encours_Auto');
		document.getElementById('oef-Numero_Compte').value = contenu.getAttribute('Numero_Compte');
		oef_getCompteCollectif();
		document.getElementById('oef-Taux_Remise').value = contenu.getAttribute('Taux_Remise');
		document.getElementById('oef-Remise_1').value = contenu.getAttribute('Remise_1');
		document.getElementById('oef-Remise_2').value = contenu.getAttribute('Remise_2');
		document.getElementById('oef-Remise_3').value = contenu.getAttribute('Remise_3');
		document.getElementById('oef-Remise_4').value = contenu.getAttribute('Remise_4');
		document.getElementById('oef-Remise_5').value = contenu.getAttribute('Remise_5');
		document.getElementById('oef-Tranche_CA0').value = contenu.getAttribute('Tranche_CA0');
		document.getElementById('oef-Tranche_CA1').value = contenu.getAttribute('Tranche_CA1');
		document.getElementById('oef-Tranche_CA2').value = contenu.getAttribute('Tranche_CA2');
		document.getElementById('oef-Tranche_CA3').value = contenu.getAttribute('Tranche_CA3');
		document.getElementById('oef-Tranche_CA4').value = contenu.getAttribute('Tranche_CA4');
		document.getElementById('oef-Taux_RFA').value = contenu.getAttribute('Taux_RFA');
		document.getElementById('oef-Remise_Fixe').value = contenu.getAttribute('Remise_Fixe');
		document.getElementById('oef-Remise_Var').value = contenu.getAttribute('Remise_Var');
		
		var francoPort = (contenu.getAttribute('Franco_Port')==1);
		document.getElementById('oef-chkFrancoPort').checked = francoPort;
		document.getElementById('oef-montantFranco').value = contenu.getAttribute('Montant_Franco');
		document.getElementById('oef-montantFranco').disabled = !francoPort;
		document.getElementById('oef-fraisPort').value = contenu.getAttribute('Frais_Port');
		oef_typePort = contenu.getAttribute('Type_Port');
		document.getElementById('oef-bTypePort').setAttribute("class", oef_typePort=="P"?"bIcoPourcentage":"bIcoEuro");

		report_tranche();

		document.getElementById('oef-Delai_Livraison').value = contenu.getAttribute('Delai_Livraison');
		oef_chargerModesReglements(contenu.getAttribute('Mode_Reg'));
		document.getElementById('oef-Delai_Reg').value = contenu.getAttribute('Delai_Reg');
		document.getElementById('oef-Jour_Fact').value = contenu.getAttribute('Jour_Fact');
		document.getElementById('oef-banqueRetrait').value = contenu.getAttribute('Banque_Retrait');

		if (contenu.getAttribute('Type_Reg')=="F") { document.getElementById('oef-Type_Reg').selectedItem = document.getElementById('oef-RegF'); }
		else if (contenu.getAttribute('Type_Reg')=="L") { document.getElementById('oef-Type_Reg').selectedItem = document.getElementById('oef-RegL'); }
		else { document.getElementById('oef-Type_Reg').selectedItem = document.getElementById('oef-RegN'); }

		defaut_contact = contenu.getAttribute('Contact');

		initContact();
		initAdrCom();
		initBanques();
		initArticles();
		initHistorique();

		// actualisation status bar

		document.getElementById('Creation').label = "Fournisseur créé le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur');
		document.getElementById('Modification').label = "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj');
		document.getElementById('Fiche').label = "Fournisseur N° "+ contenu.getAttribute('Fournisseur_Id') +" - "+ contenu.getAttribute('Denomination');
		document.getElementById('Creation').collapsed = false;
		document.getElementById('Modification').collapsed = false;

		document.getElementById('Modifie').value = "n";

	} catch (e) {
  	recup_erreur(e);
  }
}


function supprimerTout() {
	try {

		var fournisseur_id = document.getElementById('Fournisseur').value;

		if (window.confirm("Confirmez-vous la suppression du fournisseur "+fournisseur_id+" ?")) {

			var corps = cookie() +"&Page=Facturation/Fournisseurs/supprimerFournisseur.tmpl&ContentType=xml&Fournisseur_Id="+ urlEncode(fournisseur_id);

			requeteHTTP(corps);

    	showMessage("Le fournisseur a été supprimé !");
			setDefaultValues();
			document.getElementById('Action').value = "C";
			document.getElementById('Modifie').value = "n";
			rechercherFournisseur();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function existeFournisseur(code_fournisseur) {
  try {

		var corps = cookie() +"&Page=Facturation/Fournisseurs/existeFournisseur.tmpl&ContentType=xml&Fournisseur_Id="+ urlEncode(code_fournisseur);
		var p = requeteHTTP(corps);

 		return p.responseXML.documentElement.getAttribute('existe')=="true";

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


function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

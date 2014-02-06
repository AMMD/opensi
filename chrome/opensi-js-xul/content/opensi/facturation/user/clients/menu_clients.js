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


jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/banques.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var mode_tarif = "G";
var def_type_fact;
var def_mode_facturation;
var def_periode_facturation;
var def_mode_envoi_facture;
var currentClient = "";
var modifie = false;
var defaut_contact_fact = "";
var defaut_contact_liv = "";
var defaut_contact_envoi = "";
var numeroration_auto = false;
var existeSites = false;
var premierChargement = true;


function init() {
	try {

		window.parent.addEventListener("close",demandeEnregistrement,false);

		var corps = cookie() +"&Page=Config/gestion_commerciale/preferences/getParam.tmpl&ContentType=xml";
		var p = requeteHTTP(corps);
		mode_tarif = p.responseXML.documentElement.getAttribute('Mode_Tarif');
		def_type_fact = p.responseXML.documentElement.getAttribute('Def_Type_Fact');
		def_mode_facturation = p.responseXML.documentElement.getAttribute('Def_Mode_Facturation');
		def_periode_facturation = p.responseXML.documentElement.getAttribute('Def_Periode_Facturation');
		def_mode_envoi_facture = p.responseXML.documentElement.getAttribute('Def_Mode_Envoi_Facture');
		numerotation_auto = (p.responseXML.documentElement.getAttribute("Format_NC")!="");
		
		if (mode_tarif=="Q") {
			document.getElementById('TabTarifs').collapsed = true;
		}
		
		document.getElementById('oef-rowActivation_CP').collapsed = (p.responseXML.documentElement.getAttribute('Act_Activation_CP')!="1");
		document.getElementById('oef-rowFact_Sep_FP').collapsed = (p.responseXML.documentElement.getAttribute('Act_Code_Produit')!="1");
		document.getElementById('oef-rowTauxCommission').collapsed = (p.responseXML.documentElement.getAttribute('Act_Commission')!="1");
		
		var qExisteSites = new QueryHttp("Facturation/Affaires/existeSites.tmpl");
		var result = qExisteSites.execute();

		existeSites = (result.responseXML.documentElement.getAttribute("Existe")=="true");

		initFiche();
		initElemsFact();

		modifie = false;
		setTimeout("rechercherClient()", 100);

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
			document.getElementById('bExportCSV').collapsed = b;
    	document.getElementById('bSupprimer').collapsed = b;
		}
		else {
			document.getElementById('bExportCSV').collapsed = true;
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
			var listeMentions = oef_getListeMentions();
			corps = cookie() +"&Page=Facturation/Clients/modifierClient.tmpl&ContentType=xml";
			corps += "&Liste_Mentions="+ urlEncode(listeMentions);
		}
		else {
			corps = cookie() +"&Page=Facturation/Clients/creerClient.tmpl&ContentType=xml";
		}


		// Champs onglet fiche signalétique

		var client_id = document.getElementById('Client_Id').value;
		var raison_sociale = document.getElementById('Denomination').value;
		var civilite = document.getElementById('Civilite').value;
		var nom = document.getElementById('Nom').value;
		var prenom = document.getElementById('Prenom').value;
		var adresse = document.getElementById('Adresse').value;
		var comp_adresse = document.getElementById('Comp_Adresse').value;
		var adresse_3 = document.getElementById('Adresse_3').value;
		var code_postal = document.getElementById('Code_Postal').value;
		var ville = document.getElementById('Ville').value;
		var code_pays = document.getElementById('Code_Pays').value;
		var tel_1 = document.getElementById('Tel_1').value;
		var tel_2 = document.getElementById('Tel_2').value;
		var tel_3 = document.getElementById('Tel_3').value;
		var fax_1 = document.getElementById('Fax_1').value;
		var fax_2 = document.getElementById('Fax_2').value;
		var email_1 = document.getElementById('Email_1').value;
		var email_2 = document.getElementById('Email_2').value;
		var site_web = document.getElementById('Site_Web').value;
		var com_libre = document.getElementById('Com_Libre').value;
		var code_couleur = document.getElementById('Code_Couleur').value;
		var type_societe = document.getElementById('Type_Societe').value;
		var num_tva_intra = document.getElementById('Num_TVA_Intra').value;
		var num_siret = document.getElementById('Num_SIRET').value;
		var code_naf = document.getElementById('Code_NAF').value;
		var famille = document.getElementById('Famille').value;
		var secteur = document.getElementById('Secteur').value;
		var recurrent = document.getElementById('Recurrent').value;
		var exigences = document.getElementById('Exigences').value;
		var actif = document.getElementById('Actif').value;
		var com_recurrent = document.getElementById('Com_Recurrent').value;
		var com_exigences = document.getElementById('Com_Exigences').value;
		var com_sante = document.getElementById('Com_Sante').value;
		var bloque = document.getElementById('Bloque').value;
		var revendeur = document.getElementById('Revendeur').value;
		var util_R = document.getElementById('Login_Resp').value;
		var code_fournisseur = document.getElementById('Code_Fournisseur').value;
		var indications = document.getElementById('Indications').value;
		var type_client = document.getElementById('Type_Client').value;
		
		if (Action=="M" || !numerotation_auto) {
			corps += "&Client_Id="+ urlEncode(client_id);
		}

		corps += "&Denomination="+ urlEncode(raison_sociale) +"&Adresse="+ urlEncode(adresse) +"&Comp_Adresse="+ urlEncode(comp_adresse);
		corps += "&Code_Postal="+ code_postal +"&Ville="+ urlEncode(ville) +"&Code_Pays="+ urlEncode(code_pays) +"&Tel_1="+ urlEncode(tel_1) +"&Tel_2="+ urlEncode(tel_2) +"&Tel_3="+ urlEncode(tel_3);
		corps += "&Fax_1="+ urlEncode(fax_1) +"&Fax_2="+ urlEncode(fax_2) +"&Email_1="+ urlEncode(email_1) +"&Email_2="+ urlEncode(email_2) +"&Site_Web="+ urlEncode(site_web) +"&Com_Libre="+ urlEncode(com_libre);
		corps += "&Code_Couleur="+ code_couleur +"&Type_Societe="+ type_societe +"&Num_TVA_Intra="+ urlEncode(num_tva_intra);
		corps += "&Num_SIRET="+ urlEncode(num_siret) +"&Code_NAF="+ urlEncode(code_naf) +"&Adresse_3="+ urlEncode(adresse_3);
		corps += "&Civilite="+ civilite +"&Nom="+ urlEncode(nom) +"&Prenom="+ urlEncode(prenom) +"&Type_Client="+ type_client;
		corps += "&Famille="+ famille +"&Secteur="+ secteur +"&Recurrent="+ recurrent +"&Exigences="+ exigences +"&Indications="+ urlEncode(indications);
		corps += "&Actif="+ actif +"&Com_Recurrent="+ urlEncode(com_recurrent) +"&Com_Exigences="+ urlEncode(com_exigences);
		corps += "&Com_Sante="+ com_sante +"&Util_R="+ urlEncode(util_R) +"&Bloque="+ bloque +"&Revendeur="+ revendeur +"&Code_Fournisseur="+ urlEncode(code_fournisseur);


		// Champs onglet éléments de facturation

		var numero_compte = document.getElementById('oef-Numero_Compte').value;
		var mode_reg = document.getElementById('oef-Mode_Reg').value;
		var delai_reg = document.getElementById('oef-Delai_Reg').value;
		var assujetti_tva = (document.getElementById('oef-Assujetti_TVA').checked?1:0);
		var taux_penalite = document.getElementById('oef-Taux_Penalite').value;
		var taux_remise = document.getElementById('oef-Taux_Remise').value;
		var code_tarif = document.getElementById('oef-Code_Tarif').value;
		var nb_ex = document.getElementById('oef-Nb_Ex').value;
		var num_org = document.getElementById('oef-Num_Org').value;
		var activation_cp = (document.getElementById('oef-Activation_CP').checked?"1":"0");
		var fact_sep_FP = (document.getElementById('oef-Fact_Sep_FP').checked?"1":"0");
		var type_reg = document.getElementById('oef-Type_Reg').value;
		var banque_remise = document.getElementById('oef-banqueRemise').value;
		var jour_fact = document.getElementById('oef-Jour_Fact').value;
		var nb_bon = document.getElementById('oef-Nb_Bon').value;
		var bon_chiffre = document.getElementById('oef-Bon_Chiffre').value;
		var com_fact = document.getElementById('oef-Com_Fact').value;
		var type_fact = document.getElementById('oef-Type_Fact').value;
		var encours_auto = document.getElementById('oef-Encours_Auto').value;
		var mode_facturation = (document.getElementById('oef-Mode_Facturation').checked?"C":"E");
		var periode_facturation = document.getElementById('oef-Periode_Facturation').value;
		var mode_envoi_facture = document.getElementById('oef-Mode_Envoi_Facture').value;
		var taux_commission = document.getElementById('oef-Taux_Commission').value;
		var francoPort = document.getElementById('oef-chkFrancoPort').checked;
		var montantFranco = document.getElementById('oef-montantFranco').value;
		var fraisPort = document.getElementById('oef-fraisPort').value;

		corps += "&Numero_Compte="+ numero_compte +"&Mode_Reg="+ urlEncode(mode_reg) +"&Delai_Reg="+ delai_reg + "&Assujetti_TVA="+ assujetti_tva +"&Taux_Penalite="+ taux_penalite;
		corps += "&Taux_Remise="+ taux_remise +"&Code_Tarif="+ code_tarif;
		corps += "&Nb_Ex="+ nb_ex +"&Num_Org="+ num_org +"&Jour_Fact="+ jour_fact +"&Bon_Chiffre="+ bon_chiffre +"&Nb_Bon="+ nb_bon;
		corps += "&Activation_CP="+ activation_cp +"&Fact_Sep_FP="+ fact_sep_FP +"&Type_Reg="+ type_reg +"&Banque_Remise="+ banque_remise;
		corps += "&Com_Fact="+ urlEncode(com_fact) +"&Type_Fact="+ type_fact +"&Encours_Auto="+ encours_auto;
		corps += "&Mode_Facturation="+ mode_facturation +"&Periode_Facturation="+ periode_facturation +"&Mode_Envoi_Facture="+ mode_envoi_facture +"&Taux_Commission="+ taux_commission;
		corps += "&Franco_Port=" + (francoPort?1:0) +"&Montant_Franco="+ montantFranco +"&Frais_Port="+ fraisPort +"&Type_Port="+ oef_typePort;

		var saveOK = false;


		if (Action=="C" && isEmpty(client_id) && !numerotation_auto) {
			showWarning("Veuillez spécifier un code client ! (Onglet fiche signalétique)");
		}
		else if (Action=="C" && existeClient(client_id) && !numerotation_auto) {
			showWarning("Le code client '"+ client_id +"' est déjà utilisé ! (Onglet fiche signalétique)");
		}
		else if (Action=="C" && !isCleAlpha(client_id) && !numerotation_auto) {
			showWarning("Code client invalide ! (Onglet fiche signalétique)");
		}
		else if (type_client!="P" && isEmpty(raison_sociale)) { showWarning("Veuillez spécifier la raison sociale du client ! (Onglet fiche signalétique)"); }
		else if (type_client=="P" && isEmpty(nom)) { showWarning("Veuillez spécifier le nom du client ! (Onglet fiche signalétique)"); }
		else if (isEmpty(adresse)) { showWarning("Veuillez spécifier l'adresse du client ! (Onglet fiche signalétique)"); }
		else if (isEmpty(ville)) { showWarning("Veuillez spécifier la ville du client ! (Onglet fiche signalétique)"); }

		else if (!isEmpty(tel_1) && !isPhone(tel_1)) { showWarning("Numéro de téléphone 1 incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(tel_2) && !isPhone(tel_2)) { showWarning("Numéro de téléphone 2 incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(tel_3) && !isPhone(tel_3)) { showWarning("Numéro de téléphone 3 incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(fax_1) && !isPhone(fax_1)) { showWarning("Numéro de fax 1 incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(fax_2) && !isPhone(fax_2)) { showWarning("Numéro de fax 2 incorrect ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(email_1) && !isEmail(email_1)) { showWarning("Adresse e-mail 1 incorrecte ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(email_2) && !isEmail(email_2)) { showWarning("Adresse e-mail 2 incorrecte ! (Onglet fiche signalétique)"); }
		else if (!isEmpty(site_web) && !isWeb(site_web)) { showWarning("Site Web incorrect ! (Onglet fiche signalétique)"); }

		else if (!isEmpty(num_siret) && (num_siret.length != 14 || !isDigitList(num_siret))) { showWarning("Numéro SIRET incorrect ! (Onglet fiche signalétique)"); }

		else if (isEmpty(delai_reg) || !isPositiveOrNullInteger(delai_reg)) { showWarning("Délai de règlement incorrect ! (Onglet éléments de facturation)"); }
		else if (isEmpty(taux_penalite) || !isPositiveOrNull(taux_penalite)) { showWarning("Taux de pénalité incorrect ! (Onglet éléments de facturation)"); }
		else if (isEmpty(taux_remise) || !isPositiveOrNull(taux_remise)) { showWarning("Taux de remise incorrect ! (Onglet éléments de facturation)"); }
		else if (isEmpty(encours_auto) || !isPositiveOrNull(encours_auto)) { showWarning("Encours autorisé incorrect ! (Onglet éléments de facturation)"); }
		else if (!isEmpty(jour_fact) && (!isPositiveInteger(jour_fact) || jour_fact>30)) { showWarning("Jour de règlement incorrect ! (Onglet éléments de facturation)"); }
		else if (isEmpty(taux_commission) || !isPositiveOrNull(taux_commission)) { showWarning("Taux de commission incorrect ! (Onglet éléments de facturation)"); }
		else if (type_fact=="BL" && mode_facturation=="C") { showWarning("Le type de facturation par BL et le mode de facturation par commande sont incompatibles ! (Onglet éléments de facturation)"); }
		else if (francoPort && !isPositiveOrNull(montantFranco)) { showWarning("Le montant du franco de port est incorrect ! (Onglet éléments de facturation)"); }
		else if (oef_typePort=='P'?!isTaux(fraisPort):!isPositiveOrNull(fraisPort)) { showWarning("Le montant des frais de port est incorrect ! (Onglet éléments de facturation)"); }
		else {
			if (assujetti_tva && type_client=="P") {
				showWarning("Attention : vous avez coché la case assujetti à la tva bien que votre client soit un particulier !");
			} else if (assujetti_tva && type_client=="O") {
				showWarning("Attention : vous avez coché la case assujetti à la tva bien que votre client soit un organisme public !");
			} else if (!assujetti_tva && type_client=="E") {
				showWarning("Attention : vous n'avez pas coché la case assujetti à la tva bien que votre client soit une entreprise !");
			}

			if (assujetti_tva && code_pays!="FR" && isEmpty(num_tva_intra)) {
				var qZoneUE = new QueryHttp("GetPays.tmpl");
				qZoneUE.setParam("Code_Pays", code_pays);
				var result = qZoneUE.execute();
				if (result.responseXML.documentElement.getAttribute("zone_ue")=="1") {
					showWarning("Attention : vous n'avez pas saisi le numéro de tva intra-communautaire !");
				}
			}

			var p = requeteHTTP(corps);
			
			if (numerotation_auto && p.responseXML.documentElement.getAttribute("Client_Id")=="") {
				showWarning("Erreur : le format de num\u00E9rotation actuel ne permet plus de g\u00E9n\u00E9rer de num\u00E9ros client pour la p\u00E9riode d\u00E9finie !");
			} else {

				saveOK = true;
	
				showWarning("La fiche client a \u00E9t\u00E9 enregistr\u00E9e !");
	
				if (Action=="C") {
					initFiche();
					document.getElementById('Action').value = "M";
					if (numerotation_auto) {
						client_id = p.responseXML.documentElement.getAttribute("Client_Id");
						document.getElementById('Client_Id').value = client_id;
					}
					currentClient = client_id;
					document.getElementById('Client').value = client_id;
	
					document.getElementById('bSupprimer').collapsed = false;
					document.getElementById('bExportCSV').collapsed = false;
					document.getElementById('TabContacts').collapsed = false;
					document.getElementById('TabBanques').collapsed = false;
					document.getElementById('TabHisto').collapsed = false;
					document.getElementById('TabWeb').collapsed = !existeSites;
					document.getElementById('TabTarifs').collapsed = (mode_tarif=="G"?false:true);
					document.getElementById('TabAdresses').collapsed = false;
					document.getElementById('oef-grpMentions').collapsed=false;
					chargerClient();
					document.getElementById('Client_Id').disabled = true;
					document.getElementById('bChgCodeClient').collapsed = numerotation_auto;
					document.getElementById('Client_Id').collapsed=false;
					document.getElementById('lblAuto').collapsed=true;
				}

				modifie = false;
			}
		}

		return saveOK;

	} catch (e) {
  	recup_erreur(e);
  }
}


function demandeEnregistrement() {
  try {

		if (modifie && window.confirm("Voulez-vous enregistrer les modifications apportées à la fiche client ?")) {
			enregistrerTout();
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function rechercherClient() {
	try {

		var Action = document.getElementById('Action').value;
		var change = true;

		if (premierChargement) {
			premierChargement = false;
			document.getElementById('Action').value = "C";
			modifie = false;
		} else if (modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à la fiche client ?")) {
				change = enregistrerTout();
			}
		}

		if (change) {
			var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie();
			window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherClient);
			Action = document.getElementById('Action').value;

			if (Action=="M") {
				document.getElementById('bSupprimer').collapsed = false;
				document.getElementById('TabContacts').collapsed = false;
				document.getElementById('TabBanques').collapsed = false;
				document.getElementById('TabHisto').collapsed = false;
        document.getElementById('TabWeb').collapsed = !existeSites;
				document.getElementById('TabTarifs').collapsed = (mode_tarif=="G"?false:true);
				//document.getElementById('TabInfosArticles').collapsed = false;
				document.getElementById('TabAdresses').collapsed = false;
				currentClient = document.getElementById('Client').value;
				document.getElementById('oef-grpMentions').collapsed=false;
				chargerClient();
				document.getElementById('Client_Id').disabled = true;
				document.getElementById('bChgCodeClient').collapsed = numerotation_auto;
				document.getElementById('Client_Id').collapsed=false;
				document.getElementById('lblAuto').collapsed=true;
			}
			else {
				document.getElementById('bSupprimer').collapsed = true;
  			document.getElementById('TabContacts').collapsed = true;
				document.getElementById('TabHisto').collapsed = true;
        document.getElementById('TabWeb').collapsed = true;
				document.getElementById('TabBanques').collapsed = true;
				document.getElementById('TabTarifs').collapsed = true;
				document.getElementById('TabInfosArticles').collapsed = true;
				document.getElementById('TabAdresses').collapsed = true;
				document.getElementById('oef-grpMentions').collapsed=true;

				document.getElementById('Creation').label = "";
				document.getElementById('Modification').label = "";
				document.getElementById('Creation').collapsed = true;
				document.getElementById('Modification').collapsed = true;
				document.getElementById('Fiche').label = "";

				document.getElementById('Client_Id').disabled = numerotation_auto;
				document.getElementById('bChgCodeClient').collapsed = true;
				document.getElementById('Client_Id').collapsed=numerotation_auto;
				document.getElementById('lblAuto').collapsed=!numerotation_auto;
				setDefaultValues();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function retourRechercherClient(codeClient) {
	try {
  	document.getElementById('Client').value = codeClient;
  	document.getElementById('Action').value = (isEmpty(codeClient)?"C":"M");
	} catch (e) {
		recup_erreur(e);
	}
}


function setDefaultValues() {
	try {

		document.getElementById('Panneau').selectedIndex = 0;
		hideButtons(false);

		defaut_contact_fact = "";
		defaut_contact_liv = "";
		defaut_contact_envoi = "";

		currentClient = "";

		// valeurs onglet fiche signalétique

		document.getElementById('Client_Id').value = "";
		document.getElementById('Denomination').value = "";
		document.getElementById('Civilite').selectedItem = document.getElementById('CiviliteM');
		document.getElementById('Nom').value = "";
		document.getElementById('Prenom').value = "";
		document.getElementById('Adresse').value = "";
		document.getElementById('Comp_Adresse').value = "";
		document.getElementById('Adresse_3').value = "";
		document.getElementById('Code_Postal').value = "";
		document.getElementById('Ville').value = "";
		initPays();
		document.getElementById('Tel_1').value = "";
		document.getElementById('Tel_2').value = "";
		document.getElementById('Tel_3').value = "";
		document.getElementById('Fax_1').value = "";
		document.getElementById('Fax_2').value = "";
		document.getElementById('Email_1').value = "";
		document.getElementById('Email_2').value = "";
		document.getElementById('Site_Web').value = "";
		document.getElementById('Com_Libre').value = "";
		document.getElementById('Code_Couleur').value = 2;
		document.getElementById('Num_TVA_Intra').value = "";
		document.getElementById('Num_SIRET').value = "";
		document.getElementById('Code_NAF').value = "";
		chargerFamille("0");
		chargerResponsables(get_cookie("User"));
		document.getElementById('Secteur').selectedIndex = 0;
		document.getElementById('Recurrent').selectedItem = document.getElementById('RecurrentNon');
		document.getElementById('Exigences').selectedItem = document.getElementById('ExigencesNon');
		document.getElementById('Actif').selectedItem = document.getElementById('ActifOui');
		document.getElementById('Com_Recurrent').value = "";
		document.getElementById('Com_Exigences').value = "";
		document.getElementById('Com_Sante').value = "";
		document.getElementById('Bloque').selectedItem = document.getElementById('BloqueNon');
		document.getElementById('Revendeur').selectedItem = document.getElementById('RevendeurNon');
		document.getElementById('Login_Resp').value = get_cookie("User");
		selectTypeSociete('SARL');
		document.getElementById('Code_Fournisseur').value = "";
		document.getElementById('Indications').value = "";
		document.getElementById('Type_Client').selectedItem = document.getElementById('TypeE');

		// valeurs onglet éléments de facturation

		document.getElementById('oef-Numero_Compte').value = "";
		document.getElementById('oef-Collectif').value = "";
		chargerModesReglements("0");
		document.getElementById('oef-banqueRemise').selectedIndex = 0;
		document.getElementById('oef-Delai_Reg').value = 0;
		document.getElementById('oef-Assujetti_TVA').checked = false;
		document.getElementById('oef-Taux_Penalite').value = 0.00;
		document.getElementById('oef-Taux_Remise').value = 0.00;
		document.getElementById('oef-Code_Tarif').value = 1;
		document.getElementById('oef-Nb_Ex').value = "1";
		document.getElementById('oef-Nb_Bon').value = "1";
		document.getElementById('oef-Num_Org').selectedIndex = 0;
		document.getElementById('oef-Activation_CP').checked = true;
		document.getElementById('oef-Fact_Sep_FP').checked=false;
		document.getElementById('oef-Jour_Fact').value = "";
		document.getElementById('oef-Type_Reg').selectedItem = document.getElementById('oef-RegF');
		document.getElementById('oef-Bon_Chiffre').selectedItem = document.getElementById('oef-BCNon');
		document.getElementById('oef-Type_Fact').value = def_type_fact;
		document.getElementById('oef-Com_Fact').value = "";
		document.getElementById('oef-Encours_Auto').value = "0.00";
		document.getElementById('oef-Mode_Facturation').checked = (def_mode_facturation=="C");
		document.getElementById('oef-Periode_Facturation').value = def_periode_facturation;
		document.getElementById('oef-Mode_Envoi_Facture').value = def_mode_envoi_facture;
		document.getElementById('oef-Taux_Commission').value = "0.00";
		document.getElementById('oef-Mode_Facturation').disabled = (def_type_fact=="BL");
		document.getElementById('oef-chkFrancoPort').checked = false;
		document.getElementById('oef-montantFranco').disabled = true;
		document.getElementById('oef-montantFranco').value = "0.00";
		document.getElementById('oef-fraisPort').value = "0.00";
		oef_typePort = 'M';
		document.getElementById('oef-bTypePort').setAttribute("class", "bIcoEuro");
		oef_effacerMentions();

		selTypeClient('E');

		modifie = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function selectTypeSociete(typeSociete) {
	try {
		var selected = false;
		var i=0;
		var menulist = document.getElementById('Type_Societe');
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


function chargerClient() {
	try {

		document.getElementById('Panneau').selectedIndex = 0;
		hideButtons(false);

		var corps = cookie() +"&Page=Facturation/Clients/getClient.tmpl&ContentType=xml&Client_Id="+ currentClient;

		var p = requeteHTTP(corps);

    var contenu = p.responseXML.documentElement;

		// onglet fiche signalétique

		document.getElementById('Client_Id').value = contenu.getAttribute('Client_Id');
		document.getElementById('Denomination').value = contenu.getAttribute('Denomination');

		if (contenu.getAttribute('Civilite')==1) { document.getElementById('Civilite').selectedItem = document.getElementById('CiviliteM'); }
		else if (contenu.getAttribute('Civilite')==2) { document.getElementById('Civilite').selectedItem = document.getElementById('CiviliteMme'); }
		else { document.getElementById('Civilite').selectedItem = document.getElementById('CiviliteMlle'); }

		document.getElementById('Nom').value = contenu.getAttribute('Nom');
		document.getElementById('Prenom').value = contenu.getAttribute('Prenom');
		document.getElementById('Adresse').value = contenu.getAttribute('Adresse');
		document.getElementById('Comp_Adresse').value = contenu.getAttribute('Comp_Adresse');
		document.getElementById('Adresse_3').value = contenu.getAttribute('Adresse_3');
		document.getElementById('Code_Postal').value = contenu.getAttribute('Code_Postal');
		document.getElementById('Ville').value = contenu.getAttribute('Ville');
		document.getElementById('Code_Pays').value = contenu.getAttribute('Code_Pays');
		document.getElementById('Tel_1').value = contenu.getAttribute('Tel_1');
		document.getElementById('Tel_2').value = contenu.getAttribute('Tel_2');
		document.getElementById('Tel_3').value = contenu.getAttribute('Tel_3');
		document.getElementById('Fax_1').value = contenu.getAttribute('Fax_1');
		document.getElementById('Fax_2').value = contenu.getAttribute('Fax_2');
		document.getElementById('Email_1').value = contenu.getAttribute('Email_1');
		document.getElementById('Email_2').value = contenu.getAttribute('Email_2');
		document.getElementById('Site_Web').value = contenu.getAttribute('Site_Web');
		document.getElementById('Com_Libre').value = contenu.getAttribute('Com_Libre');
		document.getElementById('Code_Couleur').value = contenu.getAttribute('Code_Couleur');
		document.getElementById('Type_Societe').value = contenu.getAttribute('Type_Societe');
		document.getElementById('Num_TVA_Intra').value = contenu.getAttribute('Num_TVA_Intra');
		document.getElementById('Num_SIRET').value = contenu.getAttribute('Num_SIRET');
		document.getElementById('Code_NAF').value = contenu.getAttribute('Code_NAF');
		chargerFamille(contenu.getAttribute('Famille'));
		chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById('Secteur').value = contenu.getAttribute('Secteur');
		document.getElementById('Code_Fournisseur').value = contenu.getAttribute('Code_Fournisseur');
		document.getElementById('Indications').value = contenu.getAttribute('Indications');

		var type_client = contenu.getAttribute('Type_Client');

		selTypeClient(type_client);

		document.getElementById('Type_Client').selectedItem = document.getElementById("Type"+ type_client);

		if (contenu.getAttribute('Recurrent')==1) { document.getElementById('Recurrent').selectedItem = document.getElementById('RecurrentOui'); }
		else { document.getElementById('Recurrent').selectedItem = document.getElementById('RecurrentNon'); }

		if (contenu.getAttribute('Exigences')==1) { document.getElementById('Exigences').selectedItem = document.getElementById('ExigencesOui'); }
		else { document.getElementById('Exigences').selectedItem = document.getElementById('ExigencesNon'); }

		if (contenu.getAttribute('Actif')==1) { document.getElementById('Actif').selectedItem = document.getElementById('ActifOui'); }
		else { document.getElementById('Actif').selectedItem = document.getElementById('ActifNon'); }

		document.getElementById('Com_Recurrent').value = contenu.getAttribute('Com_Recurrent');
		document.getElementById('Com_Exigences').value = contenu.getAttribute('Com_Exigences');
		document.getElementById('Com_Sante').value = contenu.getAttribute('Com_Sante');

		if (contenu.getAttribute('Bloque')==1) { document.getElementById('Bloque').selectedItem = document.getElementById('BloqueOui'); }
		else { document.getElementById('Bloque').selectedItem = document.getElementById('BloqueNon'); }

		if (contenu.getAttribute('Revendeur')==1) { document.getElementById('Revendeur').selectedItem = document.getElementById('RevendeurOui'); }
		else { document.getElementById('Revendeur').selectedItem = document.getElementById('RevendeurNon'); }

		// onglet éléments de facturation

		document.getElementById('oef-Numero_Compte').value = contenu.getAttribute('Numero_Compte');
		oef_getCompteCollectif();
		chargerModesReglements(contenu.getAttribute('Mode_Reg'));
		document.getElementById('oef-banqueRemise').value = contenu.getAttribute('Banque_Remise');
		document.getElementById('oef-Delai_Reg').value = contenu.getAttribute('Delai_Reg');
		document.getElementById('oef-Assujetti_TVA').checked = (contenu.getAttribute('Assujetti_TVA')==1);
		document.getElementById('oef-Taux_Penalite').value = contenu.getAttribute('Taux_Penalite');
		document.getElementById('oef-Taux_Remise').value = contenu.getAttribute('Taux_Remise');
		document.getElementById('oef-Code_Tarif').value = contenu.getAttribute('Code_Tarif');
		document.getElementById('oef-Jour_Fact').value = contenu.getAttribute('Jour_Fact');

		if (contenu.getAttribute('Type_Reg')=="F") { document.getElementById('oef-Type_Reg').selectedItem = document.getElementById('oef-RegF'); }
		else if (contenu.getAttribute('Type_Reg')=="L") { document.getElementById('oef-Type_Reg').selectedItem = document.getElementById('oef-RegL'); }
		else { document.getElementById('oef-Type_Reg').selectedItem = document.getElementById('oef-RegN'); }

		document.getElementById('oef-Nb_Ex').value = contenu.getAttribute('Nb_Ex');
		document.getElementById('oef-Nb_Bon').value = contenu.getAttribute('Nb_Bon');
		document.getElementById('oef-Num_Org').value = contenu.getAttribute('Num_Org');
		document.getElementById('oef-Type_Fact').value = contenu.getAttribute('Type_Fact');
		document.getElementById('oef-Com_Fact').value = contenu.getAttribute('Com_Fact');
		document.getElementById('oef-Encours_Auto').value = contenu.getAttribute('Encours_Auto');
		document.getElementById('oef-Mode_Facturation').checked = (contenu.getAttribute('Mode_Facturation')=="C");
		document.getElementById('oef-Periode_Facturation').value = contenu.getAttribute('Periode_Facturation');
		document.getElementById('oef-Mode_Envoi_Facture').value = contenu.getAttribute('Mode_Envoi_Facture');
		document.getElementById('oef-Taux_Commission').value = contenu.getAttribute('Taux_Commission');
		document.getElementById('oef-Mode_Facturation').disabled = (contenu.getAttribute('Type_Fact')=="BL");

		if (contenu.getAttribute('Bon_Chiffre')==1) { document.getElementById('oef-Bon_Chiffre').selectedItem = document.getElementById('oef-BCOui'); }
		else { document.getElementById('oef-Bon_Chiffre').selectedItem = document.getElementById('oef-BCNon'); }

		document.getElementById('oef-Activation_CP').checked = (contenu.getAttribute('Activation_CP')==1);
		document.getElementById('oef-Fact_Sep_FP').checked = (contenu.getAttribute('Fact_Sep_FP')==1);
		
		var francoPort = (contenu.getAttribute('Franco_Port')==1);
		document.getElementById('oef-chkFrancoPort').checked = francoPort;
		document.getElementById('oef-montantFranco').value = contenu.getAttribute('Montant_Franco');
		document.getElementById('oef-montantFranco').disabled = !francoPort;
		document.getElementById('oef-fraisPort').value = contenu.getAttribute('Frais_Port');
		oef_typePort = contenu.getAttribute('Type_Port');
		document.getElementById('oef-bTypePort').setAttribute("class", oef_typePort=="P"?"bIcoPourcentage":"bIcoEuro");

		defaut_contact_fact = contenu.getAttribute('Contact_Fact');
		defaut_contact_liv = contenu.getAttribute('Contact_Liv');
		defaut_contact_envoi = contenu.getAttribute('Contact_Envoi');

		initTarifs();
		oia_initInfosArticles();
		oef_initMentions();
		initBanques();
		initContacts();
		initAdr();
		initHistorique();
    initWeb();

		// actualisation status bar

		document.getElementById('Creation').label = "Client créé le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur');
		document.getElementById('Modification').label = "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj');
		document.getElementById('Fiche').label = "Client N° "+ contenu.getAttribute('Client_Id') +" - "+ contenu.getAttribute('Denomination');
		document.getElementById('Creation').collapsed = false;
		document.getElementById('Modification').collapsed = false;

		modifie = false;

	} catch (e) {
  	recup_erreur(e);
  }
}


function supprimerTout() {
	try {

		if (window.confirm("Confirmez-vous la suppression du client "+ currentClient +" ?")) {

			var corps = cookie() +"&Page=Facturation/Clients/supprimerClient.tmpl&ContentType=xml&Client_Id="+ urlEncode(currentClient);

			requeteHTTP(corps);

			showMessage("Le client a été supprimé !");
			setDefaultValues();
			document.getElementById('Action').value = "C";
			modifie = false;
			rechercherClient();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function existeClient(code_client) {
  try {

		var corps = cookie() +"&Page=Facturation/Clients/existeClient.tmpl&ContentType=xml&Client_Id="+ urlEncode(code_client);
		var p = requeteHTTP(corps);

  	return p.responseXML.documentElement.getAttribute('existe')=="true";

  } catch (e) {
    recup_erreur(e);
  }
}


function exportCSV() {
	try {
		demandeEnregistrement();

		var queryEdit = new QueryHttp("Facturation/Clients/exporterFicheCSV.tmpl");
		queryEdit.setParam("Client_Id", currentClient);
		queryEdit.execute(exportCSV_2);
	} catch (e) {
		recup_erreur(e);
	}
}


function exportCSV_2(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		var fichier = contenu.getAttribute('FichierCsv');
		
		var nom_defaut = "ficheClient.csv";
		var file = fileChooser("save", nom_defaut);

		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function setModifie() {
	try {

		modifie = true;

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

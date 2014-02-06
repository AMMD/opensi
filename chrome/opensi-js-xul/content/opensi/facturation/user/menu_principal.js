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


jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");


function init() {
  try {

		var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();

		var prod_frais = (result.responseXML.documentElement.getAttribute("Produit_Frais")=="1");
		document.getElementById('prod_frais').collapsed = !prod_frais;
		
		var tarification_client = (result.responseXML.documentElement.getAttribute("Mode_Tarif")=="G");
		document.getElementById('tarification_client').collapsed = !tarification_client;
		
		var actOutillage = (result.responseXML.documentElement.getAttribute("Act_Outillage")=="1");
		document.getElementById('outillage').collapsed = !actOutillage;
		
		var qExisteSites = new QueryHttp("Facturation/Affaires/existeSites.tmpl");
		var result = qExisteSites.execute();
		var actClientWeb = (result.responseXML.documentElement.getAttribute("Existe")=="true");
		document.getElementById('clientsWeb').collapsed = !actClientWeb;

		var queryRelances = new QueryHttp("Facturation/Suivi_Reglements_Clients/relances.tmpl");
		queryRelances.execute(initRelances);

		var queryEcheance = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/checkEcheancesFournNonPayees.tmpl");
		queryEcheance.execute(initEcheance);

		var querySuivi = new QueryHttp("Facturation/SuiviActivite.tmpl");
		querySuivi.execute(initActivite);

		var queryCloture = new QueryHttp("Facturation/Transfert/isCloturable.tmpl");
		queryCloture.execute(initCloture);
		
		var queryAffaire = new QueryHttp("Facturation/Affaires/checkNonGeneres.tmpl");
		queryAffaire.execute(initAffaires);
		
		var queryFactAEmettre = new QueryHttp("Facturation/Abonnement/facture_a_emettre.tmpl");
		queryFactAEmettre.execute(initFactAEmettre);

		document.getElementById('news').setAttribute("src", "http://opensi.speedinfo.fr/speedinfo/expershop?Page=OpenSI/DisplayNewsOpensi.tmpl"+ nocache());

  } catch (e) {
    recup_erreur(e);
  }
}


function initCloture(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;

		if (contenu.getAttribute('cloturable')=="true") {
			document.getElementById('boxNoAlertes').collapsed = true;
			document.getElementById('boxCloture').collapsed = false;
			document.getElementById('lblPeriode').value = contenu.getAttribute('mois-periode').toUpperCase();
			document.getElementById('tbActivite').selectedIndex = 2;
			document.getElementById('tabAlertes').setAttribute('image', 'chrome://opensi/content/design/icones/ampoule.png');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function initAffaires(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		var nbFactures = parseInt(contenu.getAttribute('nbFactures'));
		var nbBL = parseIntBis(contenu.getAttribute('nbBL'));
		
		document.getElementById('lblNbFactures').value = "Il y a " + nbFactures + " "+ (nbFactures==1?"facture":"factures") +" à l'état non généré depuis plus de 1 jour dans les affaires :";
		document.getElementById('lblNbBL').value = "Il y a " + nbBL + " BL à l'état non généré depuis plus de 1 jour dans les affaires :";
		
		var aListeAffairesFact = new Arbre("Facturation/Affaires/liste-nonGeneres.tmpl", "numAffairesFact");
		aListeAffairesFact.setParam("Factures","1");
		aListeAffairesFact.initTree();
		
		var aListeAffairesBL = new Arbre("Facturation/Affaires/liste-nonGeneres.tmpl", "numAffairesBL");
		aListeAffairesBL.setParam("BL","1");
		aListeAffairesBL.initTree();

		if (nbFactures>0 || nbBL>0) {
			document.getElementById('boxNoAlertes').collapsed = true;
			document.getElementById('boxAffaireFact').collapsed = (nbFactures==0);
			document.getElementById('boxAffaireBL').collapsed = (nbBL==0);
			document.getElementById('tbActivite').selectedIndex = 2;
			document.getElementById('tabAlertes').setAttribute('image', 'chrome://opensi/content/design/icones/ampoule.png');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function initFactAEmettre(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		var nbFactures = parseInt(contenu.getAttribute('nbFacture_a_emettre'));
		
		document.getElementById('lblNbFactAEmettre').value = "Il y a " + nbFactures + " "+ (nbFactures==1?"facture":"factures") +" à émettre dans les abonnements.";

		if (nbFactures>0) {
			document.getElementById('boxNoAlertes').collapsed = true;
			document.getElementById('boxAbonnement').collapsed = false;
			document.getElementById('tbActivite').selectedIndex = 2;
			document.getElementById('tabAlertes').setAttribute('image', 'chrome://opensi/content/design/icones/ampoule.png');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function initActivite(httpRequest) {
  try {

    var contenu = httpRequest.responseXML.documentElement;

    document.getElementById('ComEnCours').value = contenu.getAttribute('ComEnCours') +" \u20AC";
    document.getElementById('CANMois').value = contenu.getAttribute('CANMois') +" \u20AC";
    document.getElementById('CAN1Mois').value = contenu.getAttribute('CAN1Mois') +" \u20AC";
    document.getElementById('CAN').value = contenu.getAttribute('CAN') +" \u20AC";
    document.getElementById('CAN1').value = contenu.getAttribute('CAN1') +" \u20AC";

		var queryGraph = new QueryHttp("Facturation/SuiviActivite2.tmpl");
		queryGraph.setParam("ficPng", contenu.getAttribute('GraphCA'));
		queryGraph.setParam("VListeN", contenu.getAttribute('ListeN'));
		queryGraph.setParam("VListeN1", contenu.getAttribute('ListeN1'));
		queryGraph.execute(initGraph);

	} catch (e) {
    recup_erreur(e);
  }
}


function initGraph(httpRequest) {
	try {

  	var contenu = httpRequest.responseXML.documentElement;
  	document.getElementById('GraphCA').setAttribute("src", getDirServeur() +"graph/"+ contenu.getAttribute('GraphCA'));

	} catch (e) {
    recup_erreur(e);
  }
}


function initRelances(httpRequest) {
  try {

    var resultat = parseIntBis(httpRequest.responseXML.documentElement.getAttribute('relances'));
    if (resultat > 0) {
      var relances = (resultat==1?"relance client":"relances clients");
      document.getElementById('lblRelances').value = resultat +" "+ relances +" à générer...";
			document.getElementById('boxNoAlertes').collapsed = true;
      document.getElementById('boxRelances').collapsed = false;
			document.getElementById('tabAlertes').setAttribute('image', 'chrome://opensi/content/design/icones/ampoule.png');
    }

	} catch (e) {
    recup_erreur(e);
  }
}


function initEcheance(httpRequest) {
  try {

    var resultat = parseIntBis(httpRequest.responseXML.documentElement.getAttribute('echeance'));
    if (resultat > 0) {
      var echeance = (resultat==1?"échéance fournisseur":"échéances fournisseurs");
      document.getElementById('lblFournisseur').value = resultat +" "+ echeance +" à régler...";
			document.getElementById('boxNoAlertes').collapsed = true;
      document.getElementById('boxFournisseur').collapsed = false;
			document.getElementById('tabAlertes').setAttribute('image', 'chrome://opensi/content/design/icones/ampoule.png');
    }

	} catch (e) {
    recup_erreur(e);
  }
}


function cloturerFacturation() {
  try {

		var queryCloturer = new QueryHttp("Facturation/Transfert/CloturerMois.tmpl");
		queryCloturer.execute();

		showMessage("Facturation de la période "+ document.getElementById('lblPeriode').value +" cloturée");
		
		window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function echeancesFournisseur() {
	try {

  	window.location = "chrome://opensi/content/facturation/user/suivi_reglements_fournisseurs/gestionReglementsFournisseurs.xul?"+ cookie();

  } catch (e) {
  	recup_erreur(e);
  }
}


function goToMenu(m) {
  try {
	
		switch(m) {
			case 1:	 window.location = "chrome://opensi/content/facturation/user/clients/menu_clients.xul?"+ cookie();					  		break;
			case 2:  window.location = "chrome://opensi/content/facturation/user/fournisseurs/menu_fournisseurs.xul?"+ cookie();  		break;
			case 3:  window.location = "chrome://opensi/content/facturation/user/stocks/menu_stocks.xul?"+ cookie();						  		break;
			case 4:  window.location = "chrome://opensi/content/facturation/user/commandes/menu_commandes.xul?"+ cookie();			  		break;
			case 5:  window.location = "chrome://opensi/content/facturation/user/devis/menu_devis.xul?"+ cookie();							  		break;
			case 6:  window.location = "chrome://opensi/content/facturation/user/affaires/gestionAffaires.xul?"+ cookie();				  	break;
			case 7:  window.location = "chrome://opensi/content/facturation/user/factu_directe/menu_factures.xul?"+ cookie();		  		break;
			case 8:  window.location = "chrome://opensi/content/facturation/user/factu_auto/menuFactuAuto.xul?"+ cookie();			  		break;
			case 9:  window.location = "chrome://opensi/content/facturation/user/avoirs/menu_avoirs.xul?"+ cookie();						  		break;
			case 10: window.location = "chrome://opensi/content/facturation/user/tabbord/menu.xul?"+ cookie();									  		break;
			case 11: window.location = "chrome://opensi/content/facturation/user/editions/menu_editions.xul?"+ cookie();				  		break;
			case 12: window.location = "chrome://opensi/content/facturation/user/suivi_reglements_fournisseurs/gestionReglementsFournisseurs.xul?"+ cookie();			  		break;
			case 13: window.location = "chrome://opensi/content/facturation/user/transfert/menuTransfert.xul?"+ cookie();	  		break;
			case 14: window.location = "chrome://opensi/content/facturation/user/factu_fournisseur/gestionFactures.xul?"+ cookie();		break;
			case 16: window.location = "chrome://opensi/content/facturation/user/abonnement/menuFacture_a_emettre.xul?"+ cookie();		break;
			case 17: window.location = "chrome://opensi/content/facturation/user/commandes/prep_commandes.xul?"+ cookie();						break;
			case 18: window.location = "chrome://opensi/content/facturation/user/clients_web/liste_clients.xul?"+ cookie();						break;
			case 20: window.location = "chrome://opensi/content/facturation/user/reception/reception.xul?"+ cookie(); 								break;
			case 21: window.location = "chrome://opensi/content/facturation/user/commerciaux/choix_commerciaux.xul?"+ cookie();   		break;
			case 22: window.location = "chrome://opensi/content/facturation/user/expedition/expedition.xul?"+ cookie(); 							break;
			case 23: window.location = "chrome://opensi/content/facturation/user/inventaire/menuInventaire.xul?"+ cookie(); 					break;
			case 24: window.location = "chrome://opensi/content/facturation/user/export_idep/export.xul?"+ cookie(); 									break;
			case 25: window.location = "chrome://opensi/content/facturation/user/suivi_lot/suivi_lot.xul?"+ cookie(); 								break;
			case 26: window.location = "chrome://opensi/content/facturation/user/fabrication/fabrication.xul?"+ cookie(); 						break;
			case 27: window.location = "chrome://opensi/content/facturation/user/expedition_lot/expedition_lot.xul?"+ cookie(); 			break;
			case 28: window.location = "chrome://opensi/content/facturation/user/changement_mdp/change_user_password.xul?"+ cookie(); break;
			case 29: window.location = "chrome://opensi/content/facturation/user/majtarifs/majtarifs.xul?"+ cookie();									break;
			case 30: window.location = "chrome://opensi/content/facturation/user/prestation_service/menu_prestation.xul?"+ cookie();	break;
			case 31: window.openDialog("chrome://opensi/content/facturation/user/outillage/outils.xul?"+ cookie(),'','chrome,centerscreen,scrollbars');		break;		
			case 32: window.location = "chrome://opensi/content/facturation/user/envoi_factures/menuEnvoiFactures.xul?"+ cookie();		break;
			case 33: window.location = "chrome://opensi/content/facturation/user/suivi_reglements_clients/gestionReglementsClients.xul?"+ cookie();		break;
			case 34: window.location = "chrome://opensi/content/facturation/user/remises_banque/gestionRemisesBanque.xul?"+ cookie();		break;
			case 35: window.location = "chrome://opensi/content/facturation/user/retours_fournisseurs/gestionRetours.xul?"+ cookie();		break;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirSousMenu(idSM) {

	document.getElementById('smTiers').collapsed = true;
	document.getElementById('smVentes').collapsed = true;
	document.getElementById('smAchats').collapsed = true;
	document.getElementById('smStocks').collapsed = true;
	document.getElementById('smOD').collapsed = true;

	document.getElementById(idSM).collapsed = false;
}


function chargerAffaire(affaireId) {
  try {

    window.location = "chrome://opensi/content/facturation/user/affaires/gestionAffaires.xul?"+ cookie() +"&Affaire_Id="+ affaireId;

	} catch (e) {
    recup_erreur(e);
  }
}


function relances() {
  try {

    window.location = "chrome://opensi/content/facturation/user/suivi_reglements_clients/gestionReglementsClients.xul?"+ cookie() +"&Relances=1";

	} catch (e) {
    recup_erreur(e);
  }
}


function facturesAEmettre() {
  try {

    window.location = "chrome://opensi/content/facturation/user/abonnement/menuFacture_a_emettre.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function retourChoixDossier() {
	try {

    window.location = "chrome://opensi/content/facturation/user/menu.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

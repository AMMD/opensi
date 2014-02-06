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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/calculDocument.js");


// empêche de charger une commande depuis le menu des affaires,
// tant que l'interface de commande n'est pas initialisée
var commandeInitialisee = false;

var affaireId = "";
var commandeId = "";
var bonId = "";
var bonRetourId = "";
var factureId = "";
var avoirId = "";

function init() {
  try {
  	
  	window.parent.addEventListener("close",demandeEnregistrement,false);
  	
  	var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
    qNomListeAttribut.setParam("Liste_Id", 2);
    var result = qNomListeAttribut.execute();
    document.getElementById('oec-colAttribut2').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    document.getElementById('oef-colAttribut2').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    document.getElementById('oea-colAttribut2').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));

  	oma_init();
		ofa_init();
		oec_init();
		oebl_init();
		oebrc_init();
		oef_init();
		oea_init();
		document.getElementById('deck').selectedIndex = 0;
		
		if (!isEmpty(ParamValeur("Affaire_Id"))) {
			affaireId = ParamValeur("Affaire_Id");
			ofa_chargerAffaire();
			document.getElementById("bMenuAffaires").collapsed=false;
			document.getElementById("deck").selectedIndex=1;
		} else if (!isEmpty(ParamValeur("Commande_Id"))) {
			commandeId = ParamValeur("Commande_Id");
			oec_chargerCommande();
			document.getElementById("bMenuAffaires").collapsed=false;
			document.getElementById('bRetourAffaire').collapsed=false;
			document.getElementById('deck').selectedIndex=2;
		}

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


function ouvrirLienMail(id) {
	try {
		window.location='mailto:'+document.getElementById(id).value;
	} catch (e) {
		recup_erreur(e);
	}
}


function retourMenuAffaires() {
	try {
		
		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bRetourCommande').collapsed = true;
		document.getElementById('bRetourFacture').collapsed = true;
		document.getElementById('bRetourAvoir').collapsed = true;
		document.getElementById('bRetourAffaire').collapsed = true;
		document.getElementById('bMenuAffaires').collapsed = true;
		document.getElementById('bRetourBL').collapsed = true;
		document.getElementById('bRetourBonRetour').collapsed = true;
		
		oma_initStats();
		oma_listerCommandes();

	} catch (e) {
    recup_erreur(e);
  }
}


function retourFicheAffaire() {
  try {

    document.getElementById('deck').selectedIndex = 1;
    document.getElementById('bRetourCommande').collapsed = true;
    document.getElementById('bRetourFacture').collapsed = true;
    document.getElementById('bRetourAvoir').collapsed = true;
		document.getElementById('bRetourAffaire').collapsed = true;
		document.getElementById('bRetourBL').collapsed = true;
		document.getElementById('bRetourBonRetour').collapsed = true;
		
		ofa_chargerAffaire();

  } catch (e) {
    recup_erreur(e);
  }
}


function retourCommande() {
  try {
  	
  	oec_initVersion();
		document.getElementById('oec-deckCommande').selectedIndex = 0;
		document.getElementById('bRetourCommande').collapsed = true;

	} catch (e) {
    recup_erreur(e);
  }
}

function retourBonLivraison() {
  try {

  	if (oebl_fournisseur!=1) { oebl_initVersion(); }
		document.getElementById('deck').selectedIndex = 3;
		document.getElementById('oebl-deckBonLivraison').selectedIndex = 0;
		document.getElementById('oecol-deckColisageEtiquettes').selectedIndex = 0;
		document.getElementById('bRetourBL').collapsed = true;
		document.getElementById('bRetourColisage').collapsed = true;
		oebl_chargerBon();
	} catch (e) {
    recup_erreur(e);
  }
}

function retourColisage() {
  try {

		document.getElementById('oecol-deckColisageEtiquettes').selectedIndex = 0;
		document.getElementById('bRetourColisage').collapsed = true;
		oecol_init();
	} catch (e) {
    recup_erreur(e);
  }
}


function retourBonRetour() {
  try {

  	oebrc_initVersion();
		document.getElementById('oebrc-deckBonRetour').selectedIndex = 0;
		document.getElementById('bRetourBonRetour').collapsed = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function retourFacture() {
  try {
		
		oef_chargerFacture();
		document.getElementById('oef-deckFacture').selectedIndex = 0;
		document.getElementById('bRetourFacture').collapsed = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function retourAvoir() {
  try {

		oea_chargerAvoir();
		document.getElementById('oea-deckAvoir').selectedIndex = 0;
		document.getElementById('bRetourAvoir').collapsed = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function demandeEnregistrement() {
	try {
		
		var currentDeck = parseIntBis(document.getElementById('deck').selectedIndex);
		switch (currentDeck) {
			case 1: ofa_demandeEnregistrement(); break;
			case 2: oec_demandeEnregistrement(); break;
			case 3: oebl_demandeEnregistrement(); break;
			case 4: oecol_demandeEnregistrement(); break;
			case 5: oef_demandeEnregistrement(); break;
			case 6: oea_demandeEnregistrement(); break;
			case 7: oebrc_demandeEnregistrement(); break;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function retourMenuPrincipal() {
	try {

		window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

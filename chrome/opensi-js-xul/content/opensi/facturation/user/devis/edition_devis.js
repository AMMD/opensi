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
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/calculDocument.js");

var aLignes = new Arbre('Facturation/GetRDF/articles_devis.tmpl', 'articles');
var aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'Mode_Reg');
var aResponsables = new Arbre("ComboListe/combo-responsables.tmpl","Login_Resp");
var aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "Secteur");
var aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","listeVersion");

var devis_id;
var mode_ligne;
var mode;
var etat_devis;
var mode_tarif;
var initLigne = false;
var type_remise = 'P';
var typeRemiseFP = 'P';
var editionTTC = false;
var assujettiTVA = false;
var defCommission = 0;
var tauxTvaPort;
var codeTvaPort;
var zoneUE=false;
var charger = true;
var modifie = false;
var chargerModeReg;
var chargerResponsable;
var chargementEnCours = false;
var currentIndex = 0;
var montantHT = 0;
var montantTTC = 0;
var changementClientPossible = true;


function init() {
  try {
  	bloquerInterface();
    
  	var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();
		
		var act_code_stats = (parseInt(result.responseXML.documentElement.getAttribute('Act_Code_Stats'))==1);
		var produit_frais = (parseInt(result.responseXML.documentElement.getAttribute('Produit_Frais'))==1);
		if (!act_code_stats) {
			document.getElementById('ColCode_Stats').collapsed = true;
			document.getElementById('ColCode_Stats').setAttribute('ignoreincolumnpicker', true);
	  	document.getElementById('Act_Code_Stats').collapsed = true;
		} else {
			document.getElementById('labelRef').setAttribute('style', 'margin-left:0px');
			document.getElementById('Reference').setAttribute('style', 'margin-left:0px');
		}
		
		if (!produit_frais) {
			document.getElementById('ColNum_Lot').collapsed = true;
			document.getElementById('ColNb_Pieces').collapsed = true;
			document.getElementById('ColUnite').collapsed = true;
			document.getElementById('ColDate_Peremption').collapsed = true;
			document.getElementById('Produit_Frais_1').collapsed = true;
			document.getElementById('Produit_Frais_2').collapsed = true;
			document.getElementById('Produit_Frais_3').collapsed = true;
			document.getElementById('Produit_Frais_4').collapsed = true;
		}
		
		var commission = (result.responseXML.documentElement.getAttribute('Act_Commission')=="1");
		if (!commission) {
			document.getElementById('ColTauxCommission').collapsed = true;
			document.getElementById('ColTauxCommission').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('ColMontantCommission').collapsed = true;
			document.getElementById('ColMontantCommission').setAttribute('ignoreincolumnpicker', true);
			document.getElementById('ActCommission').collapsed = true;
		}
		
		document.getElementById('poidsTotal').value = 0;
		setModeTarif();
		
		var aCodesTarifs = new Arbre("Facturation/GetRDF/liste_types_tarifs.tmpl", "Code_Tarif");
		aCodesTarifs.initTree(initCodeTarif);

	} catch (e) {
  	recup_erreur(e);
	}
}


function initCodeTarif() {
	try {
		document.getElementById('Code_Tarif').selectedIndex=0;
		var aUnite = new Arbre("Facturation/GetRDF/unites_vente.tmpl", "Unite");
		aUnite.initTree(initUnite);
	} catch (e) {
		recup_erreur(e);
	}
}

function initUnite() {
	try {

    document.getElementById('Unite').selectedIndex = 0;
    aSecteurs.initTree(initSecteur);

	} catch (e) {
    recup_erreur(e);
  }
}

function initSecteur() {
	try {

    document.getElementById('Secteur').selectedIndex = 0;
    var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays_Fact");
		aPays.initTree(initPaysFact);

	} catch (e) {
    recup_erreur(e);
  }
}

function initPaysFact() {
	try {
		
		var aPaysEnvoi = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays_Envoi");
		aPaysEnvoi.initTree(initPaysEnvoi);
    
	} catch (e) {
    recup_erreur(e);
  }
}

function initPaysEnvoi() {
	try {
		
		var aPaysLiv = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays_Liv");
		aPaysLiv.initTree(init2);

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerResponsables(selection) {
	try {
		chargerResponsable = selection;
		aResponsables.setParam("Selection", chargerResponsable);
		aResponsables.initTree(initResponsable);
	} catch (e) {
		recup_erreur(e);
	}
}

function initResponsable() {
  try {
		document.getElementById('Login_Resp').value = chargerResponsable;
	} catch (e) {
  	recup_erreur(e);
	}
}


function init2() {
  try {
  	window.parent.addEventListener("close",demandeEnregistrement,false);

		mode = ParamValeur("Mode");

		if (mode=="C") {
			nouveauDevis();
		}
		else {

			// chargement

			devis_id = ParamValeur("Devis_Id");
			initLigne = true;
			aLignes.setParam('Devis_Id', devis_id);
			aLignes.initTree(chargerDevis);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function selectPaysLiv() {
	try {
		if (charger) {
			listeTVA();
		}
    changerTypeVente();
	} catch (e) {
		recup_erreur(e);
	}
}


function calculerTvaPort() {
	try {
		codeTvaPort = getCodeTvaNormal(document.getElementById("Code_Pays_Liv").value,assujettiTVA,document.getElementById("Regime_TVA").value);
		tauxTvaPort = getTva(codeTvaPort);
	} catch (e) {
		recup_erreur(e);
	}
}


function listeTVA() {
  try {
  	calculTotaux();
    var aCode = new Arbre("Facturation/GetRDF/taux_tva.tmpl", "Code_TVA");
    aCode.setParam("Code_Pays", document.getElementById("Code_Pays_Liv").value);
    aCode.setParam("Regime_TVA", document.getElementById("Regime_TVA").value);
    aCode.setParam("Assujetti_TVA", assujettiTVA?"1":"0");
    aCode.initTree(selectTVA); 
  } catch (e) {
    recup_erreur(e);
  }
}

 function selectTVA() {
  try {
    document.getElementById('Code_TVA').value = getCodeTvaNormal(document.getElementById('Code_Pays_Liv').value,assujettiTVA,document.getElementById("Regime_TVA").value);
  } catch (e) {
    recup_erreur(e);
  }
}

function setModeTarif() {
	try {

    var corps = cookie() +"&Page=Config/gestion_commerciale/preferences/getParam.tmpl&ContentType=xml";
    var p = requeteHTTP(corps);

		mode_tarif = p.responseXML.documentElement.getAttribute('Mode_Tarif');

		if (mode_tarif=='Q') {
			document.getElementById('row_tarif').collapsed = true;
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


function chargerModesReglements(selection) {
	try {
		chargerModeReg = selection;
		aModesReglements.setParam("Selection", chargerModeReg);
		aModesReglements.initTree(initModeReglement);
	} catch (e) {
		recup_erreur(e);
	}
}


function initModeReglement() {
	try {

    document.getElementById('Mode_Reg').value=chargerModeReg;
		setModifie(false);

	} catch (e) {
    recup_erreur(e);
  }
}

function switchRemise() {
	try {

		if (type_remise=='P') {
			document.getElementById('bRemise').setAttribute("class", "bIcoEuro");
			type_remise = 'M';
		}
		else {
			document.getElementById('bRemise').setAttribute("class", "bIcoPourcentage");
			type_remise = 'P';
		}
		calculTotaux();
		setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function switchRemiseFP() {
	try {

		if (typeRemiseFP=='P') {
			document.getElementById('bRemiseFP').setAttribute("class", "bIcoEuro");
			typeRemiseFP = 'M';
		}
		else {
			document.getElementById('bRemiseFP').setAttribute("class", "bIcoPourcentage");
			typeRemiseFP = 'P';
		}
		calculTotaux();
		setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function afficherFichiers() {
	try {
	
    var ok = true;
		if (mode=="C") {
			ok = enregistrerDevis();
		}

		if (ok) {
  	  var url = "chrome://opensi/content/facturation/user/recherches/rech_fichiers.xul?"+ cookie() +"&Type=Devis&Document_Id="+ urlEncode(devis_id);
    	window.openDialog(url,'','chrome,modal,centerscreen');
    }
		
	} catch (e) {
    recup_erreur(e);
  }
}


function ajouterLigne(type_ligne) {
  try {

		document.getElementById('bSupprimer').disabled = true;
		document.getElementById('bFlecheHaut').disabled = true;
		document.getElementById('bFlecheBas').disabled = true;

		mode_ligne = "C";

		document.getElementById("Type_Ligne").value = type_ligne;
		document.getElementById("Ligne_Id").value = "";

		formatLigne(type_ligne);

		switch(type_ligne) {
			case "S":

				var reference = document.getElementById("Reference").value;

				if (!isEmpty(reference)) {

					if (mode_tarif=='Q') {

						var url = "chrome://opensi/content/facturation/user/commun/popup-choixTarif.xul?"+ cookie() +"&Article_Id="+ urlEncode(reference);
    				window.openDialog(url,'','chrome,modal,centerscreen', reporterTarifId);

						var tarif_id = document.getElementById('Tarif_Id').value;

						if (!isEmpty(tarif_id)) {

							var corps = cookie() +"&Page=Facturation/Affaires/getArticleQte.tmpl&ContentType=xml&Article_Id="+ urlEncode(reference);
							corps += "&Tarif_Id="+ tarif_id;
							corps += "&Type_Prix="+ (editionTTC?"TTC":"HT");

							var p = requeteHTTP(corps);

							var contenu = p.responseXML.documentElement;

							document.getElementById("Code_Stats").value = contenu.getAttribute("Code_Stats");
							document.getElementById("Designation").value = contenu.getAttribute("Designation");
							document.getElementById("Num_Lot").value = "";
							document.getElementById("Nb_Pieces").value = "";
							document.getElementById('Quantite').value = contenu.getAttribute("Quantite");
							document.getElementById('Unite').value = contenu.getAttribute("Unite");
							document.getElementById("Date_Peremption").value = "";
							document.getElementById("PU").value = contenu.getAttribute("Prix");
							document.getElementById('Ristourne').value = "0.00";
							document.getElementById('Commission').value = defCommission;
							document.getElementById("Code_TVA").value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"),document.getElementById('Code_Pays_Liv').value,assujettiTVA,document.getElementById('Regime_TVA').value);
							document.getElementById("Tarif_Id").value = "";
							document.getElementById("Libelle").value = contenu.getAttribute("Libelle");
						}
						else {
							ajouterLigne("I");
						}
					}
					else {
						var corps = cookie() +"&Page=Facturation/Affaires/getArticleTarif.tmpl&ContentType=xml&Article_Id="+ urlEncode(reference) +"&Code_Tarif="+ document.getElementById('Code_Tarif').value;
						var client_id = document.getElementById("Client_Id").value;
						if (!isEmpty(client_id)) {
							corps += "&Client_Id="+ urlEncode(client_id);
						}
						corps += "&Type_Prix="+ (editionTTC?"TTC":"HT");

						var p = requeteHTTP(corps);

						var contenu = p.responseXML.documentElement;

						document.getElementById("Code_Stats").value = contenu.getAttribute("Code_Stats");
						document.getElementById("Designation").value = contenu.getAttribute("Designation");
						document.getElementById("Num_Lot").value = "";
						document.getElementById("Nb_Pieces").value = "";
						document.getElementById('Quantite').value = 1;
						document.getElementById('Unite').value = contenu.getAttribute("Unite");
						document.getElementById("Date_Peremption").value = "";
						document.getElementById("PU").value = contenu.getAttribute("Prix");
						document.getElementById('Ristourne').value = "0.00";
						document.getElementById('Commission').value = defCommission;
						document.getElementById("Code_TVA").value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"),document.getElementById('Code_Pays_Liv').value,assujettiTVA,document.getElementById('Regime_TVA').value);
						document.getElementById("Libelle").value = "";
					}
				}
				else {
					ajouterLigne("I");
				}

				break;

			case "I":

				document.getElementById('Code_Stats').value = "";
				document.getElementById('Reference').value = "";
				document.getElementById('Designation').value = "";
				document.getElementById("Num_Lot").value = "";
				document.getElementById("Nb_Pieces").value = "";
				document.getElementById('Quantite').value = 1;
				document.getElementById('Unite').value = "U";
				document.getElementById("Date_Peremption").value = "";
				document.getElementById('PU').value = "";
				document.getElementById('Ristourne').value = "0.00";
				document.getElementById('Commission').value = defCommission;
				document.getElementById('Code_TVA').value = getCodeTvaNormal(document.getElementById('Code_Pays_Liv').value,assujettiTVA,document.getElementById('Regime_TVA').value);
				document.getElementById("Libelle").value = "";
				document.getElementById('Reference').focus();
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function formatLigne(type_ligne) {
  try {

		switch(type_ligne) {
			case "S":
				document.getElementById('Code_Stats').disabled = false;
				document.getElementById('Reference').disabled = true;
				document.getElementById('Designation').disabled = true;
				document.getElementById('Num_Lot').disabled = false;
				document.getElementById('Nb_Pieces').disabled = false;
				document.getElementById('Quantite').disabled = false;
				document.getElementById('Unite').disabled = false;
				document.getElementById('Date_Peremption').disabled = false;
				document.getElementById('PU').disabled = false;
				document.getElementById('Ristourne').disabled = false;
				document.getElementById('Commission').disabled = false;
				document.getElementById('Code_TVA').disabled = false;
				document.getElementById('bValider').disabled = false;
				document.getElementById('bAnnuler').disabled = false;
				break;

			case "I":
				document.getElementById('Code_Stats').disabled = false;
				document.getElementById('Reference').disabled = false;
				document.getElementById('Designation').disabled = false;
				document.getElementById('Num_Lot').disabled = false;
				document.getElementById('Nb_Pieces').disabled = false;
				document.getElementById('Quantite').disabled = false;
				document.getElementById('Unite').disabled = false;
				document.getElementById('Date_Peremption').disabled = false;
				document.getElementById('PU').disabled = false;
				document.getElementById('Ristourne').disabled = false;
				document.getElementById('Commission').disabled = false;
				document.getElementById('Code_TVA').disabled = false;
				document.getElementById('bValider').disabled = false;
				document.getElementById('bAnnuler').disabled = false;
				break;

			default:
				document.getElementById('Code_Stats').value = "";
				document.getElementById('Reference').value = "";
				document.getElementById('Designation').value = "";
				document.getElementById('Num_Lot').value = "";
				document.getElementById('Nb_Pieces').value = "";
				document.getElementById('Quantite').value = "";
				document.getElementById('Unite').value = "U";
				document.getElementById('Date_Peremption').value = "";
				document.getElementById('PU').value = "";
				document.getElementById('Ristourne').value = "";
				document.getElementById('Commission').value = "";
				document.getElementById('Libelle').value = "";
				document.getElementById('Ligne_Id').value = "";
				document.getElementById('Code_TVA').value = getCodeTvaNormal(document.getElementById("Code_Pays_Liv").value,assujettiTVA,document.getElementById('Regime_TVA').value);
				document.getElementById('Code_Stats').disabled = true;
				document.getElementById('Reference').disabled = true;
				document.getElementById('Designation').disabled = true;
				document.getElementById('Num_Lot').disabled = true;
				document.getElementById('Nb_Pieces').disabled = true;
				document.getElementById('Quantite').disabled = true;
				document.getElementById('Unite').disabled = true;
				document.getElementById('Date_Peremption').disabled = true;
				document.getElementById('PU').disabled = true;
				document.getElementById('Ristourne').disabled = true;
				document.getElementById('Commission').disabled = true;
				document.getElementById('Code_TVA').disabled = true;
				document.getElementById('bSupprimer').disabled = true;
				document.getElementById('bFlecheHaut').disabled = true;
				document.getElementById('bFlecheBas').disabled = true;
				document.getElementById('bValider').disabled = true;
				document.getElementById('bAnnuler').disabled = true;
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function pressOnWindow(ev) {
	try {

		if (ev.altKey && mode!="V") {
			switch(ev.charCode) {
      	case 97: // 'a'
					rechercherStock();
        	break;
				case 116: // 't'
					modifierTarif();
					break;
    	}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnQuantite(ev) {
	try {
		
		if (ev.keyCode==13) {
			validerLigne();
		}
		
	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnReference(ev) {
	try {

		if (ev.keyCode==13) {
			rechercherReference();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function rechercherStock(reference) {
	try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		if (mode_tarif != "Q") {
			url += "&Code_Tarif=" + document.getElementById('Code_Tarif').value;
		}
		if (reference != null) { url += "&Reference="+ urlEncode(reference); }
    window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherStock);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourRechercherStock(reference) {
	try {
	
		document.getElementById('Reference').value = reference;
		ajouterLigne("S");
	
	} catch (e) {
    recup_erreur(e);
  }
}


function rechercherReference() {
	try {
		
		var reference = document.getElementById('Reference').value;

		var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
		qExArt.setParam("Reference", reference);
		var result = qExArt.execute();
		
		var articleId = result.responseXML.documentElement.getAttribute("Article_Id");
		
		if (!isEmpty(articleId)) {
			document.getElementById('Reference').value = articleId;
			ajouterLigne("S");
		} else {
			rechercherStock(reference);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function modifierTarif() {
	try {

		if (mode_ligne = "M" && document.getElementById('Type_Ligne').value=='S') {

			if (mode_tarif=='Q') {

				var reference = document.getElementById('Reference').value;

				var url = "chrome://opensi/content/facturation/user/commun/popup-choixTarif.xul?"+ cookie() +"&Article_Id="+ urlEncode(reference);
    		window.openDialog(url,'','chrome,modal,centerscreen', reporterTarifId);

				var tarif_id = document.getElementById('Tarif_Id').value;

				if (!isEmpty(tarif_id)) {

					var corps = cookie() +"&Page=Facturation/Affaires/getArticleQte.tmpl&ContentType=xml&Article_Id="+ urlEncode(reference);
					corps += "&Tarif_Id="+ tarif_id;
					corps += "&Type_Prix="+ (editionTTC?"TTC":"HT");

					var p = requeteHTTP(corps);

					var contenu = p.responseXML.documentElement;

					document.getElementById('Quantite').value = contenu.getAttribute("Quantite");
					document.getElementById('Unite').value = contenu.getAttribute("Unite");
					document.getElementById("PU").value = contenu.getAttribute("Prix");
					document.getElementById("Tarif_Id").value = "";
					document.getElementById("Libelle").value = contenu.getAttribute("Libelle");
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function reporterTarifId(tarif_id) {
	try {
		document.getElementById('Tarif_Id').value = tarif_id;
	} catch (e) {
		recup_erreur(e);
	}
}


function ouvrirLigne() {
  try {

		if (aLignes.isSelected() && mode=="M") {
			var i = aLignes.getCurrentIndex();
			currentIndex = i;

			if (aLignes.getCellText(i,'ColType_Ligne')=="C") {
				ajouterLigne("I");
			}
			else {
				mode_ligne = "M";
				document.getElementById('bSupprimer').disabled = false;

				document.getElementById("Code_Stats").value = aLignes.getCellText(i,'ColCode_Stats');
				document.getElementById("Reference").value = aLignes.getCellText(i,'ColReference');
				document.getElementById("Designation").value = aLignes.getCellText(i,'ColDesignation');
				document.getElementById("Num_Lot").value = aLignes.getCellText(i,'ColNum_Lot');
				document.getElementById("Nb_Pieces").value = aLignes.getCellText(i,'ColNb_Pieces');
				document.getElementById("Quantite").value = aLignes.getCellText(i,'ColQuantite');
				document.getElementById("Unite").value = aLignes.getCellText(i,'ColUnite');
				document.getElementById("Date_Peremption").value = aLignes.getCellText(i,'ColDate_Peremption');
				document.getElementById("PU").value = aLignes.getCellText(i,'ColPU');
				document.getElementById("Code_TVA").value = aLignes.getCellText(i,'ColCode_TVA');
				document.getElementById("Ristourne").value = aLignes.getCellText(i,'ColRistourne');
				document.getElementById("Commission").value = aLignes.getCellText(i,'ColTauxCommission');
				document.getElementById("Type_Ligne").value = aLignes.getCellText(i,'ColType_Ligne');
				document.getElementById("Ligne_Id").value = aLignes.getCellText(i,'ColLigne_Id');
				document.getElementById("Libelle").value = aLignes.getCellText(i,'ColLibelle');
				
				
				// on ignore les lignes de commentaires
				var firstIndex = 0;
				var lastIndex = aLignes.nbLignes()-1;
				if (aLignes.getCellText(firstIndex,'ColType_Ligne')=="C") { firstIndex++; }
				if (aLignes.getCellText(lastIndex,'ColType_Ligne')=="C") { lastIndex--; }
				
				document.getElementById('bFlecheHaut').disabled = (i==firstIndex);
				document.getElementById('bFlecheBas').disabled = (i==lastIndex);

				formatLigne(document.getElementById("Type_Ligne").value);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function ouvrirCommentaire() {
  try {

		if (aLignes.isSelected() && mode=="M") {
			var i = aLignes.getCurrentIndex();
			if (aLignes.getCellText(i,'ColType_Ligne')=="C") {
				editerCommentaire();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function deplacerLigneBas() {
	try {
		deplacerLigne("Bas");
	} catch (e) {
		recup_erreur(e);
	}
}

function deplacerLigneHaut() {
	try {
		deplacerLigne("Haut");
	} catch (e) {
		recup_erreur(e);
	}
}


function deplacerLigne(type) {
	try {
		if (aLignes.isSelected() && mode=="M") {
			var i = aLignes.getCurrentIndex();
			if (aLignes.getCellText(i,'ColType_Ligne')!="C") {
				var ligneId = aLignes.getCellText(i,'ColLigne_Id');
				var qDeplacerLigne = new QueryHttp("Facturation/Devis/deplacerLigne.tmpl");
				qDeplacerLigne.setParam("Ligne_Id", ligneId);
				qDeplacerLigne.setParam("Deplacement", type);
				qDeplacerLigne.execute();
				
				ajouterLigne("I");
				aLignes.initTree(afterRefreshArticles);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function validerLigne() {
  try {

		var type_ligne = document.getElementById("Type_Ligne").value;
		var code_stats = document.getElementById("Code_Stats").value;
		var reference = document.getElementById("Reference").value;
		var designation = document.getElementById("Designation").value;
		var num_lot = document.getElementById("Num_Lot").value;
		var nb_pieces = document.getElementById("Nb_Pieces").value;
		var quantite = document.getElementById("Quantite").value;
		var unite = document.getElementById("Unite").value;
		var date_peremption = document.getElementById("Date_Peremption").value;
		var pu = document.getElementById("PU").value;
		var ristourne = document.getElementById("Ristourne").value;
		var commission = document.getElementById("Commission").value;
		var code_tva = document.getElementById("Code_TVA").value;
		var ligneId = document.getElementById("Ligne_Id").value;
		var libelle = document.getElementById("Libelle").value;
		var ok = true;

		if (mode=="C") {
			ok = enregistrerDevis();
		}

		if (ok) {

			if (mode_ligne=="C") {
				var corps = cookie() +"&Page=Facturation/Devis/ajouterArticle.tmpl&ContentType=xml";
			}
			else {
				var corps = cookie() +"&Page=Facturation/Devis/modifierArticle.tmpl&ContentType=xml";
				corps += "&Ligne_Id="+ ligneId;
			}

			corps += "&Reference="+ urlEncode(reference) +"&Designation="+ urlEncode(designation) + "&Num_Lot=" + urlEncode(num_lot) + "&Nb_Pieces=" + nb_pieces +"&Quantite="+ quantite +"&Unite="+ urlEncode(unite) +"&Type_Ligne="+ type_ligne;
			corps += "&Prix="+ pu +"&Ristourne="+ ristourne +"&Commission="+ commission +"&Code_TVA="+ code_tva +"&Devis_Id="+ devis_id +"&Libelle="+ urlEncode(libelle);
			corps += "&Code_Stats=" + code_stats;

			if (isEmpty(designation)) { showWarning("D�signation de l'article manquante !"); }
			else if (!checkQte(quantite)) { showWarning("Quantit� incorrecte !");	}
			else if (!isEmpty(nb_pieces) && !isPositiveInteger(nb_pieces)) { showWarning("Nombre de pi�ces incorrect !");	}
			else if (!isEmpty(date_peremption) && !isDate(date_peremption)) { showWarning("Date de p�remption incorrecte !");	}
			else if (isEmpty(pu) || !isPositiveOrNull(pu) || !checkDecimal(pu,4)) { showWarning("Prix unitaire incorrect !");	}
			else if (isEmpty(ristourne) || !isTaux(ristourne)) { showWarning("Taux de ristourne incorrect !");	}
			else if (isEmpty(commission) || !isTaux(commission) || parseIntBis(commission)>=100) { showWarning("Taux de commission incorrect !");	}
			else {
				
				if (mode_ligne=="C") {
					currentIndex = aLignes.nbLignes();
				}
				
				corps += "&Date_Peremption=" + (!isEmpty(date_peremption)?prepareDateJava(date_peremption):"");
				var p = requeteHTTP(corps);

				if (type_ligne=='S') {
					calculerPoids();
				}
				ajouterLigne("I");
				aLignes.initTree(afterRefreshArticles);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function annulerLigne() {
  try {

  	aLignes.select(-1);
		ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
	}
}


function supprimerLigne() {
  try {

		var ligneId = document.getElementById("Ligne_Id").value;
		var type_ligne = document.getElementById("Type_Ligne").value;

		var corps = cookie() +"&Page=Facturation/Devis/supprimerArticle.tmpl&ContentType=xml&Devis_Id="+ devis_id +"&Ligne_Id="+ ligneId;
		requeteHTTP(corps);

		currentIndex--;
		if (type_ligne=='S') {
			calculerPoids();
		}
		ajouterLigne("I");
		aLignes.initTree(afterRefreshArticles);

	} catch (e) {
  	recup_erreur(e);
	}
}


function transAffaire() {
  try {

		var tree = document.getElementById("articles");

		if (tree.view==null || tree.view.rowCount<=0) {
			showWarning("Le devis ne contient aucune ligne !");
		}
		else {
			if (window.confirm("Etes-vous s�r de vouloir passer le devis en affaire ?")) {
				var corps = cookie() +"&Page=Facturation/Devis/transDevisAffaire.tmpl&ContentType=xml&Devis_Id="+ devis_id;
				var p = requeteHTTP(corps);

				var affaire_id = p.responseXML.documentElement.getAttribute("Affaire_Id");

    		window.location = "chrome://opensi/content/facturation/user/affaires/gestionAffaires.xul?"+ cookie() +"&Affaire_Id="+ affaire_id;
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function transFacture() {
  try {

		var tree = document.getElementById("articles");

		if (tree.view==null || tree.view.rowCount<=0) {
			showWarning("Le devis ne contient aucune ligne !");
		}
		else {
			if (window.confirm("Etes-vous s�r de vouloir passer le devis en facture express ?")) {
				var corps = cookie() + "&Page=Facturation/Devis/transDevisFacture.tmpl&ContentType=xml&Devis_Id="+ devis_id;
				var p = requeteHTTP(corps);

				var facture_id = p.responseXML.documentElement.getAttribute("Facture_Id");

    		window.location = "chrome://opensi/content/facturation/user/factu_directe/edition_facture.xul?"+ cookie() +"&Facture_Id="+ facture_id;
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function enregistrerDevis() {
  try {

		var save = false;

		var client_id = document.getElementById("Client_Id").value;
		var remise = document.getElementById('Remise').value;
		var remiseFP = document.getElementById('RemiseFP').value;
		var taux_remise = 0;
		var montant_remise = 0;
		var tauxRemiseFP = 0;
		var montantRemiseFP = 0;
		var modeReglement = document.getElementById('Mode_Reg').value;
		var frais_port = document.getElementById('Frais_Port').value;
		var escompte = document.getElementById('Escompte').value;
		var date_exp = document.getElementById('Date_Exp').value;
		var denomination_fact = document.getElementById('Denomination_Fact').value;
		var adresse_1_fact = document.getElementById('Adresse_1_Fact').value;
		var adresse_2_fact = document.getElementById('Adresse_2_Fact').value;
		var adresse_3_fact = document.getElementById('Adresse_3_Fact').value;
		var code_postal_fact = document.getElementById('Code_Postal_Fact').value;
		var ville_fact = document.getElementById('Ville_Fact').value;
		var code_pays_fact = document.getElementById('Code_Pays_Fact').value;
		var util_R = document.getElementById('Login_Resp').value;
		var intitule = document.getElementById('intitule').value;
		var secteurActivite = document.getElementById('Secteur').value;
		
		var civ_inter_fact = document.getElementById("Civ_Inter_Fact").value;
		var nom_inter_fact = document.getElementById("Nom_Inter_Fact").value;
		var prenom_inter_fact = document.getElementById("Prenom_Inter_Fact").value;
		var tel_inter_fact = document.getElementById("Tel_Inter_Fact").value;
		var fax_inter_fact = document.getElementById('Fax_Inter_Fact').value;
		var email_inter_fact = document.getElementById('Email_Inter_Fact').value;
		
		var denomination_liv = document.getElementById('Denomination_Liv').value;
		var adresse_1_liv = document.getElementById('Adresse_1_Liv').value;
		var adresse_2_liv = document.getElementById('Adresse_2_Liv').value;
		var adresse_3_liv = document.getElementById('Adresse_3_Liv').value;
		var code_postal_liv = document.getElementById('Code_Postal_Liv').value;
		var ville_liv = document.getElementById('Ville_Liv').value;
		var code_pays_liv = document.getElementById('Code_Pays_Liv').value;
		
		var civ_inter_liv = document.getElementById("Civ_Inter_Liv").value;
		var nom_inter_liv = document.getElementById("Nom_Inter_Liv").value;
		var prenom_inter_liv = document.getElementById("Prenom_Inter_Liv").value;
		var tel_inter_liv = document.getElementById("Tel_Inter_Liv").value;
		var fax_inter_liv = document.getElementById('Fax_Inter_Liv').value;
		var email_inter_liv = document.getElementById('Email_Inter_Liv').value;
		
		var denomination_envoi = document.getElementById('Denomination_Envoi').value;
		var adresse_1_envoi = document.getElementById('Adresse_1_Envoi').value;
		var adresse_2_envoi = document.getElementById('Adresse_2_Envoi').value;
		var adresse_3_envoi = document.getElementById('Adresse_3_Envoi').value;
		var code_postal_envoi = document.getElementById('Code_Postal_Envoi').value;
		var ville_envoi = document.getElementById('Ville_Envoi').value;
		var code_pays_envoi = document.getElementById('Code_Pays_Envoi').value;
		
		var civ_inter_envoi = document.getElementById("Civ_Inter_Envoi").value;
		var nom_inter_envoi = document.getElementById("Nom_Inter_Envoi").value;
		var prenom_inter_envoi = document.getElementById("Prenom_Inter_Envoi").value;
		var tel_inter_envoi = document.getElementById("Tel_Inter_Envoi").value;
		var fax_inter_envoi = document.getElementById('Fax_Inter_Envoi').value;
		var email_inter_envoi = document.getElementById('Email_Inter_Envoi').value;
		
		var num_tva = assujettiTVA?document.getElementById('Num_TVA').value:"";
		
		var montant_base = (editionTTC?montantTTC:montantHT);

		if (isEmpty(remise) || (type_remise=='P'?!isTaux(remise):!isPositiveOrNull(remise) || parseFloat(remise)>montant_base)) { showWarning("Remise incorrecte !"); }
		else if (isEmpty(frais_port) || !isPositiveOrNull(frais_port)) { showWarning("Frais de port incorrects !"); }
		else if (isEmpty(remiseFP) || (typeRemiseFP=='P'?!isTaux(remiseFP):!isPositiveOrNull(remiseFP) || parseFloat(remiseFP)>parseFloat(frais_port))) { showWarning("Remise sur frais de port incorrecte !"); }
		else if (isEmpty(denomination_fact)) { showWarning("Veuillez indiquer la raison sociale du client de facturation !"); }
		else if (isEmpty(adresse_1_fact)) { showWarning("Veuillez indiquer l'adresse du client de facturation !"); }
		else if (isEmpty(ville_fact)) { showWarning("Veuillez indiquer la ville du client de facturation !"); }
		else if (isEmpty(denomination_liv)) { showWarning("Veuillez indiquer la raison sociale du client de livraison !"); }
		else if (isEmpty(adresse_1_liv)) { showWarning("Veuillez indiquer l'adresse du client de livraison !"); }
		else if (isEmpty(ville_liv)) { showWarning("Veuillez indiquer la ville du client de livraison !"); }
		else if (isEmpty(denomination_envoi)) { showWarning("Veuillez indiquer la raison sociale du client d'envoi !"); }
		else if (isEmpty(adresse_1_envoi)) { showWarning("Veuillez indiquer l'adresse du client d'envoi !"); }
		else if (isEmpty(ville_envoi)) { showWarning("Veuillez indiquer la ville du client d'envoi !"); }
		else if (isEmpty(escompte) || !isTaux(escompte)) { showWarning("Taux d'escompte incorrect !"); }
		else if (!isEmpty(date_exp) && !isDate(date_exp)) { showWarning("Date d'expiration de l'offre incorrecte !"); }
		else if (!isEmpty(tel_inter_fact) && !isPhone(tel_inter_fact)) { showWarning("Num�ro de t�l�phone de facturation incorrect !"); }
		else if (!isEmpty(fax_inter_fact) && !isPhone(fax_inter_fact)) { showWarning("Num�ro de fax de facturation incorrect !"); }
		else if (!isEmpty(email_inter_fact) && !isEmail(email_inter_fact)) { showWarning("Adresse e-mail de facturation incorrecte !"); }
		else if (!isEmpty(tel_inter_liv) && !isPhone(tel_inter_liv)) { showWarning("Num�ro de t�l�phone de livraison incorrect !"); }
		else if (!isEmpty(fax_inter_liv) && !isPhone(fax_inter_liv)) { showWarning("Num�ro de fax de livraison incorrect !"); }
		else if (!isEmpty(email_inter_liv) && !isEmail(email_inter_liv)) { showWarning("Adresse e-mail de livraison incorrecte !"); }
		else if (!isEmpty(tel_inter_envoi) && !isPhone(tel_inter_envoi)) { showWarning("Num�ro de t�l�phone d'envoi incorrect !"); }
		else if (!isEmpty(fax_inter_envoi) && !isPhone(fax_inter_envoi)) { showWarning("Num�ro de fax d'envoi incorrect !"); }
		else if (!isEmpty(email_inter_envoi) && !isEmail(email_inter_envoi)) { showWarning("Adresse e-mail d'envoi incorrecte !"); }
		else {
			
			frais_port = parseFloat(frais_port);
			remise = parseFloat(remise);
			remiseFP = parseFloat(remiseFP);

			var corps;

			if (assujettiTVA && code_pays_liv!="FR" && isEmpty(num_tva) && zoneUE) {
				showWarning("Attention : vous n'avez pas saisi le num�ro de tva intra-communautaire !");
			}

			if (mode=="C") {
				corps = cookie() +"&Page=Facturation/Devis/creerDevis.tmpl&ContentType=xml";
			}
			else {
				corps = cookie() +"&Page=Facturation/Devis/modifierDevis.tmpl&ContentType=xml&Devis_Id="+ devis_id;
			}

			
			if (type_remise=='P') {
				taux_remise = remise;
			}
			else {
				taux_remise = (montant_base>0?remise/montant_base*100:0);
				montant_remise = remise;
			}
			
			if (typeRemiseFP=='P') {
				tauxRemiseFP = remiseFP;
			}
			else {
				tauxRemiseFP = (frais_port>0?remiseFP/frais_port*100:0);
				montantRemiseFP = remiseFP;
			}
			
			corps += "&Taux_Remise="+ taux_remise +"&Frais_Port="+ frais_port +"&Escompte="+ escompte +"&Montant_Remise="+ montant_remise;
			corps += "&PRemise_FP="+ tauxRemiseFP +"&MRemise_FP="+ montantRemiseFP +"&Mode_Reg="+ modeReglement;
			corps += "&Commentaires_Fin="+ urlEncode(document.getElementById('Commentaires_Fin').value);
			corps += "&Commentaires_Int="+ urlEncode(document.getElementById('Commentaires_Int').value);
			corps += "&Date_Exp="+ (!isEmpty(date_exp)?prepareDateJava(date_exp):"");
			corps += "&Code_Tarif="+ document.getElementById('Code_Tarif').value;
			corps += "&Regime_TVA="+ document.getElementById('Regime_TVA').value;
			corps += "&Intitule="+ urlEncode(intitule);
			corps += "&Secteur_Activite="+ secteurActivite;

			corps += "&Denomination="+ urlEncode(denomination_fact);
			corps += "&Adresse="+ urlEncode(adresse_1_fact);
			corps += "&Comp_Adresse="+ urlEncode(adresse_2_fact);
			corps += "&Adresse_3="+ urlEncode(adresse_3_fact);
			corps += "&Code_Postal="+ urlEncode(code_postal_fact);
			corps += "&Ville="+ urlEncode(ville_fact);
			corps += "&Code_Pays="+ urlEncode(code_pays_fact);
			corps += "&Util_R="+ urlEncode(util_R);
			corps += "&Client_Id="+ urlEncode(client_id);
			corps += "&Civ_Inter="+ urlEncode(civ_inter_fact);
			corps += "&Nom_Inter="+ urlEncode(nom_inter_fact);
			corps += "&Prenom_Inter="+ urlEncode(prenom_inter_fact);
			corps += "&Tel_Inter="+ urlEncode(tel_inter_fact);
			corps += "&Fax_Inter="+ urlEncode(fax_inter_fact);
			corps += "&Email_Inter="+ urlEncode(email_inter_fact);
			
			corps += "&Denomination_Liv="+ urlEncode(denomination_liv);
			corps += "&Adresse_1_Liv="+ urlEncode(adresse_1_liv);
			corps += "&Adresse_2_Liv="+ urlEncode(adresse_2_liv);
			corps += "&Adresse_3_Liv="+ urlEncode(adresse_3_liv);
			corps += "&Code_Postal_Liv="+ urlEncode(code_postal_liv);
			corps += "&Ville_Liv="+ urlEncode(ville_liv);
			corps += "&Code_Pays_Liv="+ urlEncode(code_pays_liv);
			corps += "&Civ_Inter_Liv="+ urlEncode(civ_inter_liv);
			corps += "&Nom_Inter_Liv="+ urlEncode(nom_inter_liv);
			corps += "&Prenom_Inter_Liv="+ urlEncode(prenom_inter_liv);
			corps += "&Tel_Inter_Liv="+ urlEncode(tel_inter_liv);
			corps += "&Fax_Inter_Liv="+ urlEncode(fax_inter_liv);
			corps += "&Email_Inter_Liv="+ urlEncode(email_inter_liv);
			
			corps += "&Denomination_Envoi="+ urlEncode(denomination_envoi);
			corps += "&Adresse_1_Envoi="+ urlEncode(adresse_1_envoi);
			corps += "&Adresse_2_Envoi="+ urlEncode(adresse_2_envoi);
			corps += "&Adresse_3_Envoi="+ urlEncode(adresse_3_envoi);
			corps += "&Code_Postal_Envoi="+ urlEncode(code_postal_envoi);
			corps += "&Ville_Envoi="+ urlEncode(ville_envoi);
			corps += "&Code_Pays_Envoi="+ urlEncode(code_pays_envoi);
			corps += "&Civ_Inter_Envoi="+ urlEncode(civ_inter_envoi);
			corps += "&Nom_Inter_Envoi="+ urlEncode(nom_inter_envoi);
			corps += "&Prenom_Inter_Envoi="+ urlEncode(prenom_inter_envoi);
			corps += "&Tel_Inter_Envoi="+ urlEncode(tel_inter_envoi);
			corps += "&Fax_Inter_Envoi="+ urlEncode(fax_inter_envoi);
			corps += "&Email_Inter_Envoi="+ urlEncode(email_inter_envoi);
			
			corps += "&Code_TVA_Port="+ codeTvaPort +"&Taux_TVA_Port="+ tauxTvaPort;
			
			corps += "&Edition_TTC="+ (document.getElementById('Edition_TTC').checked?"1":"0");
			corps += "&Assujetti_TVA="+ (assujettiTVA?"1":"0");
			corps += "&Num_TVA_Intra="+ urlEncode(num_tva);
			var p = requeteHTTP(corps);

			if (mode=="C") {
				var contenu = p.responseXML.documentElement;
				devis_id = contenu.getAttribute("Devis_Id");
				aLignes.setParam('Devis_Id', devis_id);
				charger=false;
				bloquerInterface();
				chargerDevis();
			}

			setModifie(false);
			save = true;
		}

		return save;

	} catch (e) {
  	recup_erreur(e);
	}
}


function calculTotaux() {
  try {
  	var client_id = document.getElementById("Client_Id").value;
		var client_connu = (client_id!="");

		var tree = document.getElementById("articles");
		document.getElementById('Edition_TTC').disabled = (tree.view==null || tree.view.rowCount>0);
    document.getElementById('Code_Pays_Liv').disabled = (tree.view==null || tree.view.rowCount>0);
    document.getElementById('chercher_client').collapsed = (mode=='V');
   	document.getElementById('chercher_adrliv').disabled = (!client_connu || tree.view==null || tree.view.rowCount>0);
    document.getElementById('bCopierFactVersLivEnvoi').disabled = (mode=='V' || (aLignes.nbLignes()>0 && document.getElementById('Code_Pays_Fact').value!=document.getElementById('Code_Pays_Liv').value));
    document.getElementById('Code_Tarif').disabled = (tree.view==null || tree.view.rowCount>0);
		document.getElementById('Regime_TVA').disabled = (tree.view==null || tree.view.rowCount>0);
		document.getElementById('Assujetti_TVA').disabled = (tree.view==null || tree.view.rowCount>0);
		
		var remise = parseFloat(document.getElementById('Remise').value);
		var remiseFP = parseFloat(document.getElementById('RemiseFP').value);
		var taux_escompte = parseFloat(document.getElementById('Escompte').value);
		var frais_port = parseFloat(document.getElementById('Frais_Port').value);

		if ((type_remise=='P'?isTaux(remise):isPositiveOrNull(remise)) && (typeRemiseFP=='P'?isTaux(remiseFP):isPositiveOrNull(remiseFP)) && isTaux(taux_escompte) && isPositiveOrNull(frais_port)) {

			if (tree.view!=null) {
				
				var calculDocument = new CalculDocument();
				calculDocument.setEditionTTC(editionTTC);
				if (type_remise=='P') { calculDocument.setRemiseP(remise); }
				else { calculDocument.setRemiseM(remise); }
				calculDocument.setFraisPortBruts(frais_port);
				if (typeRemiseFP=='P') { calculDocument.setRemiseFPP(remiseFP); }
				else { calculDocument.setRemiseFPM(remiseFP); }
				calculDocument.setTauxTVAFP(tauxTvaPort);
				calculDocument.setEscompteP(taux_escompte);
				
				for (var i=0;i<tree.view.rowCount;i++) {
					if (getCellText(tree,i,'ColType_Ligne')!="C") {
						var prixUnitaireBrut  = getCellText(tree,i,'ColPU');
						var ristourneP = getCellText(tree,i,'ColRistourne');
						var commissionP = getCellText(tree,i,'ColTauxCommission');
						var quantite  = getCellText(tree,i,'ColQuantite');
						var codeTVA  = getCellText(tree,i,'ColCode_TVA');
						calculDocument.ajouterLigneDocument(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA);
					}
				}
				
				calculDocument.calculer();
				
				if (editionTTC) {
					document.getElementById('pttcMontantRemise').value = calculDocument.getRemiseM();
					document.getElementById('pttcMontantFrais_Port').value = calculDocument.getFraisPortBruts();
					document.getElementById('pttcMontantRemiseFP').value = calculDocument.getRemiseFPM();
					document.getElementById('pttcTVA').value = calculDocument.getTotalTVA();
					document.getElementById('pttcCommissionTTC').value = calculDocument.getCommissionTTC();
					document.getElementById('pttcMontantTTC').value = calculDocument.getMontantTTC();
					document.getElementById('pttcMontantEscompte').value = calculDocument.getEscompteM();
					document.getElementById('pttcTotalTTC').value = calculDocument.getTotalTTC();
					document.getElementById('pttcNetTTC').value = calculDocument.getNetAPayer();
					
					montantTTC = calculDocument.getMontantTTCSansFormat();
					
					document.getElementById('rowCommissionTTC').collapsed = !calculDocument.afficherCommission();
					document.getElementById('rowRemiseTTC').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('rowRemiseFPTTC').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('rowEscompteTTC').collapsed = !calculDocument.afficherEscompteM();
				}
				else {
					document.getElementById('MontantHT').value = calculDocument.getMontantHT();
					document.getElementById('MontantRemise').value = calculDocument.getRemiseM();
					document.getElementById('MontantFrais_Port').value = calculDocument.getFraisPortBruts();
					document.getElementById('MontantRemiseFP').value = calculDocument.getRemiseFPM();
					document.getElementById('TotalHT').value = calculDocument.getTotalHT();
					document.getElementById('commissionHT').value = calculDocument.getCommissionHT();
					document.getElementById('TVA').value = calculDocument.getTotalTVA();
					document.getElementById('MontantTTC').value = calculDocument.getMontantTTC();
					document.getElementById('MontantEscompte').value = calculDocument.getEscompteM();
					document.getElementById('TotalTTC').value = calculDocument.getTotalTTC();
					
					montantHT = calculDocument.getMontantHTSansFormat();
					montantTTC = calculDocument.getMontantTTCSansFormat();
					
					document.getElementById('rowCommissionHT').collapsed = !calculDocument.afficherCommission();
					document.getElementById('rowRemiseHT').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('rowRemiseFPHT').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('rowMontantTTC').collapsed = !calculDocument.afficherEscompteM();
					document.getElementById('rowEscompteHT').collapsed = !calculDocument.afficherEscompteM();
				}
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function calculerPoids() {
	try {
		
		var qPoids = new QueryHttp("Facturation/Devis/getPoidsTotal.tmpl");
		qPoids.setParam("Devis_Id", devis_id);
		var p = qPoids.execute();
		
		document.getElementById('poidsTotal').value = p.responseXML.documentElement.getAttribute("Poids");
	} catch (e) {
		recup_erreur(e);
	}
}


function afterRefreshArticles() {
	try {

		calculTotaux();
		scrollToRank();
		document.getElementById('Reference').focus();

	} catch (e) {
  	recup_erreur(e);
	}
}


function scrollToRank() {
	try {
		
		var tb = document.getElementById("articles").treeBoxObject;
		
		if (currentIndex>0) {
			tb.ensureRowIsVisible(currentIndex);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function demandeEnregistrement() {
  try {

		if (modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apport�es au devis ?")) {
				enregistrerDevis();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function setModifie(m) {
  try {

  	modifie = m;
		if (m) {
			document.getElementById('tabDevis').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('bVisualiser').disabled = true;
			document.getElementById('bCopierDevis').disabled = true;
			document.getElementById('bProforma').disabled = true;
			document.getElementById('bTransAff').disabled = true;
			document.getElementById('bTransFac').disabled = true;
			document.getElementById('bArchiverDevis').disabled = true;
		}
		else {
			document.getElementById('tabDevis').setAttribute('image', null);
			document.getElementById('bVisualiser').disabled = (chargementEnCours || etat_devis=='');
			document.getElementById('bCopierDevis').disabled = (chargementEnCours || etat_devis=='');
			document.getElementById('bProforma').disabled = (chargementEnCours || etat_devis!='N');
			document.getElementById('bTransAff').disabled = (chargementEnCours || etat_devis!='N');
			document.getElementById('bTransFac').disabled = (chargementEnCours || etat_devis!='N');
			document.getElementById('bArchiverDevis').disabled = (chargementEnCours || etat_devis!='N');
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function debloquerInterface() {
	try {
		
		document.getElementById('listeVersion').disabled=false;
		document.getElementById('articles').disabled=false;
		document.getElementById('intitule').disabled=false;
		document.getElementById('Secteur').disabled=false;
		document.getElementById('Login_Resp').disabled=false;
		document.getElementById('Assujetti_TVA').disabled=false;
		document.getElementById('Regime_TVA').disabled=false;
		document.getElementById('Edition_TTC').disabled=false;
		document.getElementById('Denomination_Fact').disabled=false;
		document.getElementById('chercher_client').disabled=false;
		document.getElementById('bCreerClient').disabled=false;
		document.getElementById('Adresse_1_Fact').disabled=false;
		document.getElementById('Adresse_2_Fact').disabled=false;
		document.getElementById('Adresse_3_Fact').disabled=false;
		document.getElementById('Code_Postal_Fact').disabled=false;
		document.getElementById('Ville_Fact').disabled=false;
		document.getElementById('Code_Pays_Fact').disabled=false;
		document.getElementById('Civ_Inter_Fact').disabled=false;
		document.getElementById('Nom_Inter_Fact').disabled=false;
		document.getElementById('Prenom_Inter_Fact').disabled=false;
		document.getElementById('Tel_Inter_Fact').disabled=false;
		document.getElementById('Fax_Inter_Fact').disabled=false;
		document.getElementById('Email_Inter_Fact').disabled=false;
		document.getElementById('bCopierFactVersLivEnvoi').disabled=false;
		document.getElementById('Code_Tarif').disabled=false;
		document.getElementById('Denomination_Liv').disabled=false;
		document.getElementById('Adresse_1_Liv').disabled=false;
		document.getElementById('Adresse_2_Liv').disabled=false;
		document.getElementById('Adresse_3_Liv').disabled=false;
		document.getElementById('Code_Postal_Liv').disabled=false;
		document.getElementById('Ville_Liv').disabled=false;
		document.getElementById('Code_Pays_Liv').disabled=false;
		document.getElementById('Civ_Inter_Liv').disabled=false;
		document.getElementById('Nom_Inter_Liv').disabled=false;
		document.getElementById('Prenom_Inter_Liv').disabled=false;
		document.getElementById('Tel_Inter_Liv').disabled=false;
		document.getElementById('Fax_Inter_Liv').disabled=false;
		document.getElementById('Email_Inter_Liv').disabled=false;
		document.getElementById('Denomination_Envoi').disabled=false;
		document.getElementById('Adresse_1_Envoi').disabled=false;
		document.getElementById('Adresse_2_Envoi').disabled=false;
		document.getElementById('Adresse_3_Envoi').disabled=false;
		document.getElementById('Code_Postal_Envoi').disabled=false;
		document.getElementById('Ville_Envoi').disabled=false;
		document.getElementById('Code_Pays_Envoi').disabled=false;
		document.getElementById('Civ_Inter_Envoi').disabled=false;
		document.getElementById('Nom_Inter_Envoi').disabled=false;
		document.getElementById('Prenom_Inter_Envoi').disabled=false;
		document.getElementById('Tel_Inter_Envoi').disabled=false;
		document.getElementById('Fax_Inter_Envoi').disabled=false;
		document.getElementById('Email_Inter_Envoi').disabled=false;
		document.getElementById('Code_Stats').disabled=false;
		document.getElementById('Reference').disabled=false;
		document.getElementById('Designation').disabled=false;
		document.getElementById('Num_Lot').disabled=false;
		document.getElementById('Nb_Pieces').disabled=false;
		document.getElementById('Quantite').disabled=false;
		document.getElementById('Unite').disabled=false;
		document.getElementById('Date_Peremption').disabled=false;
		document.getElementById('PU').disabled=false;
		document.getElementById('Ristourne').disabled=false;
		document.getElementById('Commission').disabled=false;
		document.getElementById('Code_TVA').disabled=false;
		document.getElementById('bArticle').disabled=false;
		document.getElementById('bCommentaire').disabled=false;
		document.getElementById('bAnnuler').disabled=false;
		document.getElementById('bValider').disabled=false;
		document.getElementById('Commentaires_Fin').disabled=false;
		document.getElementById('Commentaires_Int').disabled=false;
		document.getElementById('bChoisirMentions').disabled=false;
		document.getElementById('Mode_Reg').disabled=false;
		document.getElementById('bRemise').disabled=false;
		document.getElementById('Remise').disabled=false;
		document.getElementById('Frais_Port').disabled=false;
		document.getElementById('bRemiseFP').disabled=false;
		document.getElementById('RemiseFP').disabled=false;
		document.getElementById('Escompte').disabled=false;
		document.getElementById('Date_Exp').disabled=false;
		document.getElementById('bEnregistrer').disabled=false;
		document.getElementById('bProforma').disabled=false;
		document.getElementById('bArchiverDevis').disabled=false;
		document.getElementById('bTransFac').disabled=false;
		document.getElementById('bTransAff').disabled=false;

		debloquerBoutonsMenu();
	} catch (e) {
		recup_erreur(e);
	}
}


function nouveauDevis() {
  try {

		var qVenteTTC = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl"); 
		var result = qVenteTTC.execute();
		var venteTTC = (result.responseXML.documentElement.getAttribute('Vente_TTC')==1);

		document.getElementById('Edition_TTC').checked = venteTTC;		
		changerTypeEdition(venteTTC);
		
		etat_devis = "";
		assujettiTVA = false;		
		document.getElementById('Assujetti_TVA').checked = false;
		document.getElementById('Num_TVA').value = "";
		document.getElementById('Code_Tarif').value = 1;
		document.getElementById('Regime_TVA').value = "G";
		document.getElementById('intitule').value = "";
		chargerModesReglements("0");

		mode = "C";
		changementClientPossible=true;
		
		document.getElementById('bCreerClient').collapsed = true;

		document.getElementById('Commentaires_Fin').value = "";
		document.getElementById('Commentaires_Int').value = "";
		document.getElementById('Date_Devis').value = "";
		document.getElementById('Numero').value = "";
		
		document.getElementById('Remise').value = "0.00";
		document.getElementById('Escompte').value = "0.00";
		document.getElementById('Frais_Port').value = "0.00";
		document.getElementById('RemiseFP').value = "0.00";
		document.getElementById('Date_Exp').value = "";

		document.getElementById('Denomination_Fact').value = "";
		document.getElementById('Adresse_1_Fact').value = "";
		document.getElementById('Adresse_2_Fact').value = "";
		document.getElementById('Adresse_3_Fact').value = "";
		document.getElementById('Code_Postal_Fact').value = "";
		document.getElementById('Ville_Fact').value = "";
		document.getElementById('Code_Pays_Fact').value = "FR";
		
		document.getElementById('Civ_Inter_Fact').selectedIndex = 0;
		document.getElementById('Nom_Inter_Fact').value = "";
		document.getElementById('Prenom_Inter_Fact').value = "";
		document.getElementById('Tel_Inter_Fact').value = "";
		document.getElementById('Fax_Inter_Fact').value = "";
		document.getElementById('Email_Inter_Fact').value = "";
		
		document.getElementById('Denomination_Liv').value = "";
		document.getElementById('Adresse_1_Liv').value = "";
		document.getElementById('Adresse_2_Liv').value = "";
		document.getElementById('Adresse_3_Liv').value = "";
		document.getElementById('Code_Postal_Liv').value = "";
		document.getElementById('Ville_Liv').value = "";
		document.getElementById('Code_Pays_Liv').value = "FR";
		calculerTvaPort();
		selectPaysLiv();
		
		document.getElementById('Civ_Inter_Liv').selectedIndex = 0;
		document.getElementById('Nom_Inter_Liv').value = "";
		document.getElementById('Prenom_Inter_Liv').value = "";
		document.getElementById('Tel_Inter_Liv').value = "";
		document.getElementById('Fax_Inter_Liv').value = "";
		document.getElementById('Email_Inter_Liv').value = "";
		
		document.getElementById('Denomination_Envoi').value = "";
		document.getElementById('Adresse_1_Envoi').value = "";
		document.getElementById('Adresse_2_Envoi').value = "";
		document.getElementById('Adresse_3_Envoi').value = "";
		document.getElementById('Code_Postal_Envoi').value = "";
		document.getElementById('Ville_Envoi').value = "";
		document.getElementById('Code_Pays_Envoi').value = "FR";
		
		document.getElementById('Civ_Inter_Envoi').selectedIndex = 0;
		document.getElementById('Nom_Inter_Envoi').value = "";
		document.getElementById('Prenom_Inter_Envoi').value = "";
		document.getElementById('Tel_Inter_Envoi').value = "";
		document.getElementById('Fax_Inter_Envoi').value = "";
		document.getElementById('Email_Inter_Envoi').value = "";

		document.getElementById('MontantHT').value = "0.00";
		document.getElementById('MontantRemise').value = "0.00";
		document.getElementById('MontantFrais_Port').value = "0.00";
		document.getElementById('MontantRemiseFP').value = "0.00";
		document.getElementById('TotalHT').value = "0.00";
		document.getElementById('commissionHT').value = "0.00";
		document.getElementById('TVA').value = "0.00";
		document.getElementById('MontantTTC').value = "0.00";
		document.getElementById('MontantEscompte').value = "0.00";
		document.getElementById('TotalTTC').value = "0.00";
		
		document.getElementById('rowRemiseHT').collapsed = true;
		document.getElementById('rowRemiseFPHT').collapsed = true;
		document.getElementById('rowCommissionHT').collapsed = true;
		document.getElementById('rowMontantTTC').collapsed = true;
		document.getElementById('rowEscompteHT').collapsed = true;
		
		document.getElementById('pttcMontantRemise').value = "0.00";
		document.getElementById('pttcMontantFrais_Port').value = "0.00";
		document.getElementById('pttcMontantRemiseFP').value = "0.00";
		document.getElementById('pttcCommissionTTC').value = "0.00";
		document.getElementById('pttcTVA').value = "0.00";
		document.getElementById('pttcMontantTTC').value = "0.00";
		document.getElementById('pttcMontantEscompte').value = "0.00";
		document.getElementById('pttcTotalTTC').value = "0.00";
		document.getElementById('pttcNetTTC').value = "0.00";
		
		montantHT=0;
		montantTTC=0;
		
		document.getElementById('rowRemiseTTC').collapsed = true;
		document.getElementById('rowRemiseFPTTC').collapsed = true;
		document.getElementById('rowCommissionTTC').collapsed = true;
		document.getElementById('rowEscompteTTC').collapsed = true;

		document.getElementById('Creation').label = "";
		document.getElementById('Modification').label = "";
		document.getElementById('Creation').collapsed = true;
		document.getElementById('Modification').collapsed = true;
		document.getElementById('Fiche').label = "";

		chargerResponsables(get_cookie("User"));
		document.getElementById('labelClient').value = "";
		document.getElementById('Client_Id').value = "";

		ajouterLigne("I");

		aLignes.deleteTree();

		document.getElementById('bProforma').collapsed = true;
		document.getElementById('bTransAff').collapsed = true;
		document.getElementById('bTransFac').collapsed = true;
		document.getElementById('bArchiverDevis').collapsed = true;
		
		debloquerInterface();
		setModifie(false);

	} catch (e) {
  	recup_erreur(e);
  }
}


function chargerDevis() {
  try {

		mode = "M";
		chargementEnCours = true;
		
		document.getElementById('bTransFac').collapsed = false;
		document.getElementById('bTransAff').collapsed = false;
		document.getElementById('bArchiverDevis').collapsed = false;
		document.getElementById('bProforma').collapsed = false;
		
		var corps = cookie() +"&Page=Facturation/Devis/getDevis.tmpl&ContentType=xml&Devis_Id="+ devis_id;

		var p = requeteHTTP(corps);

		var contenu = p.responseXML.documentElement;

		var numero = contenu.getAttribute('Num_Entier');
		defCommission = contenu.getAttribute("Def_Commission");
		
		chargerModesReglements(contenu.getAttribute('Mode_Reg'));
		document.getElementById('Remise').value = contenu.getAttribute('Remise');
		type_remise = contenu.getAttribute('Type_Remise');
		document.getElementById('bRemise').setAttribute("class", (type_remise=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('RemiseFP').value = contenu.getAttribute('RemiseFP');
		typeRemiseFP = contenu.getAttribute('TypeRemiseFP');
		document.getElementById('bRemiseFP').setAttribute("class", (typeRemiseFP=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('Escompte').value = contenu.getAttribute('Escompte');
		document.getElementById('Frais_Port').value = contenu.getAttribute('Frais_Port');
		document.getElementById('Commentaires_Fin').value = contenu.getAttribute('Commentaires_Fin');
		document.getElementById('Commentaires_Int').value = contenu.getAttribute('Commentaires_Int');
		document.getElementById('Date_Devis').value = contenu.getAttribute('Date_Devis');
		document.getElementById('Numero').value = numero;
		document.getElementById('Date_Exp').value = contenu.getAttribute('Date_Exp');
		document.getElementById('intitule').value = contenu.getAttribute('Intitule');
		document.getElementById('Secteur').value = contenu.getAttribute('Secteur_Activite');
		
		document.getElementById('Denomination_Fact').value = contenu.getAttribute('Denomination');
		document.getElementById('Adresse_1_Fact').value = contenu.getAttribute('Adresse');
		document.getElementById('Adresse_2_Fact').value = contenu.getAttribute('Comp_Adresse');
		document.getElementById('Adresse_3_Fact').value = contenu.getAttribute('Adresse_3');
		document.getElementById('Code_Postal_Fact').value = contenu.getAttribute('Code_Postal');
		document.getElementById('Ville_Fact').value = contenu.getAttribute('Ville');
		document.getElementById('Code_Pays_Fact').value = contenu.getAttribute('Code_Pays');
		
		document.getElementById('Denomination_Liv').value = contenu.getAttribute('Denomination_Liv');
		document.getElementById('Adresse_1_Liv').value = contenu.getAttribute('Adresse_1_Liv');
		document.getElementById('Adresse_2_Liv').value = contenu.getAttribute('Adresse_2_Liv');
		document.getElementById('Adresse_3_Liv').value = contenu.getAttribute('Adresse_3_Liv');
		document.getElementById('Code_Postal_Liv').value = contenu.getAttribute('Code_Postal_Liv');
		document.getElementById('Ville_Liv').value = contenu.getAttribute('Ville_Liv');
		document.getElementById('Code_Pays_Liv').value = contenu.getAttribute('Code_Pays_Liv');

		document.getElementById('Civ_Inter_Fact').value = contenu.getAttribute('Civ_Inter');
		document.getElementById('Nom_Inter_Fact').value = contenu.getAttribute('Nom_Inter');
		document.getElementById('Prenom_Inter_Fact').value = contenu.getAttribute('Prenom_Inter');
		document.getElementById('Tel_Inter_Fact').value = contenu.getAttribute('Tel_Inter');
		document.getElementById('Fax_Inter_Fact').value = contenu.getAttribute('Fax_Inter');
		document.getElementById('Email_Inter_Fact').value = contenu.getAttribute('Email_Inter');
		
		document.getElementById('Civ_Inter_Liv').value = contenu.getAttribute('Civ_Inter_Liv');
		document.getElementById('Nom_Inter_Liv').value = contenu.getAttribute('Nom_Inter_Liv');
		document.getElementById('Prenom_Inter_Liv').value = contenu.getAttribute('Prenom_Inter_Liv');
		document.getElementById('Tel_Inter_Liv').value = contenu.getAttribute('Tel_Inter_Liv');
		document.getElementById('Fax_Inter_Liv').value = contenu.getAttribute('Fax_Inter_Liv');
		document.getElementById('Email_Inter_Liv').value = contenu.getAttribute('Email_Inter_Liv');
		
		document.getElementById('Denomination_Envoi').value = contenu.getAttribute('Denomination_Envoi');
		document.getElementById('Adresse_1_Envoi').value = contenu.getAttribute('Adresse_1_Envoi');
		document.getElementById('Adresse_2_Envoi').value = contenu.getAttribute('Adresse_2_Envoi');
		document.getElementById('Adresse_3_Envoi').value = contenu.getAttribute('Adresse_3_Envoi');
		document.getElementById('Code_Postal_Envoi').value = contenu.getAttribute('Code_Postal_Envoi');
		document.getElementById('Ville_Envoi').value = contenu.getAttribute('Ville_Envoi');
		document.getElementById('Code_Pays_Envoi').value = contenu.getAttribute('Code_Pays_Envoi');
		
		document.getElementById('Civ_Inter_Envoi').value = contenu.getAttribute('Civ_Inter_Envoi');
		document.getElementById('Nom_Inter_Envoi').value = contenu.getAttribute('Nom_Inter_Envoi');
		document.getElementById('Prenom_Inter_Envoi').value = contenu.getAttribute('Prenom_Inter_Envoi');
		document.getElementById('Tel_Inter_Envoi').value = contenu.getAttribute('Tel_Inter_Envoi');
		document.getElementById('Fax_Inter_Envoi').value = contenu.getAttribute('Fax_Inter_Envoi');
		document.getElementById('Email_Inter_Envoi').value = contenu.getAttribute('Email_Inter_Envoi');

		document.getElementById('Code_Tarif').value = contenu.getAttribute('Code_Tarif');
		document.getElementById('Regime_TVA').value = contenu.getAttribute('Regime_TVA');
		codeTvaPort = contenu.getAttribute('Code_TVA_Port');
		tauxTvaPort = contenu.getAttribute('Taux_TVA_Port');
		assujettiTVA = (contenu.getAttribute('Assujetti_TVA')=="1");		
		selectPaysLiv();
		
		var typeEdition = (contenu.getAttribute('Edition_TTC')=="1");
		document.getElementById('Edition_TTC').checked = typeEdition;
		
		document.getElementById('Assujetti_TVA').checked = assujettiTVA;
		document.getElementById('Num_TVA').value = contenu.getAttribute("Num_TVA_Intra");

		var client_id = contenu.getAttribute('Client_Id');
    document.getElementById('Client_Id').value = client_id;
		var client_connu = (client_id!="");
		
		document.getElementById('labelClient').value = (client_connu?client_id:"");
		document.getElementById('bCreerClient').collapsed = client_connu;
		
		chargerResponsables(contenu.getAttribute('Util_R'));

		document.getElementById('Creation').label = "Devis cr�� le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur');
		document.getElementById('Modification').label = "Derni�re modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj');
		document.getElementById('Fiche').label = "Devis N� "+ numero;
		document.getElementById('Creation').collapsed = false;
		document.getElementById('Modification').collapsed = false;

		etat_devis = contenu.getAttribute("Etat");
		
		document.getElementById('tabVersionDocument').collapsed = false;
    initVersion();

		if (etat_devis=='A' || etat_devis=='F' || etat_devis=='C') {
			mode = "V";
			formatLigne("");
		}
		else if (initLigne) {
			ajouterLigne("I");
			initLigne = false;
		}
		
		
		calculerPoids();
		document.getElementById('bArchiverDevis').disabled=(etat_devis!='N');
		if (mode!="V") {
			document.getElementById('Num_TVA').disabled = !assujettiTVA;
			document.getElementById('chercher_adrfact').disabled = !client_connu;
			document.getElementById('chercher_inter').disabled = !client_connu;
			document.getElementById('chercher_adrliv').disabled = !client_connu;
			document.getElementById('chercher_inter_liv').disabled = !client_connu;
			document.getElementById('chercher_adrenvoi').disabled = !client_connu;
			document.getElementById('chercher_inter_envoi').disabled = !client_connu;
			debloquerInterface();
		} else {
			document.getElementById('bVoirFichier').disabled=false;
			document.getElementById('listeVersion').disabled=false;
			document.getElementById('articles').disabled=false;
			debloquerBoutonsMenu();
		}
		document.getElementById('bOuvrirCommentairesCaches').disabled=false;
		document.getElementById('bVoirFichier').disabled=false;

		changerTypeEdition(typeEdition);
		chargementEnCours = false;
		setModifie(false);

	} catch (e) {
    recup_erreur(e);
  }
}


function visualiserDevis() {
  try {

		var tree = document.getElementById("articles");

		if (tree.view==null || tree.view.rowCount<=0) {
			showWarning("Le devis ne contient aucune ligne !");
		}
		else {
	  	window.location = "chrome://opensi/content/facturation/user/devis/devis.xul?"+ cookie() +"&Devis_Id="+ devis_id;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function editerProforma() {
  try {

		var tree = document.getElementById("articles");

		if (tree.view==null || tree.view.rowCount<=0) { showWarning("Le devis ne contient aucune ligne !"); }
		else {
			var qCreerProforma = new QueryHttp("Facturation/Devis/creerProforma.tmpl");
			qCreerProforma.setParam("Devis_Id", devis_id);
			var result = qCreerProforma.execute();
			var proformaId = result.responseXML.documentElement.getAttribute("Proforma_Id");
			var page = "chrome://opensi/content/facturation/user/devis/devis.xul?"+ cookie();
      page += "&Proforma_Id="+ proformaId;
      page += "&Devis_Id="+ devis_id;
	  	window.location = page;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function copierDevis() {
	try {
		if (window.confirm("Voulez-vous copier le devis ?")) {
			var qCopie = new QueryHttp("Facturation/Devis/copierDevis.tmpl");
			qCopie.setParam("Devis_Id", devis_id);
			var result = qCopie.execute();
			var new_devis_id = result.responseXML.documentElement.getAttribute('Devis_Id');
			
			var page = "chrome://opensi/content/facturation/user/devis/edition_devis.xul?"+ cookie();
	    page += "&Mode=M&Devis_Id="+ new_devis_id;
		  window.location = page;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function editerCommentaire() {
  try {

		var tree = document.getElementById("articles");

		if (tree.view!=null && tree.currentIndex!=-1) {

			var ligneId = getCellText(tree,tree.currentIndex,'ColLigne_Id');

			var url = "chrome://opensi/content/facturation/user/devis/commentaire.xul?"+ cookie() +"&Ligne_Id="+ ligneId;
    	window.openDialog(url,'','chrome,modal,centerscreen');

			aLignes.initTree(afterRefreshArticles);
			ajouterLigne("I");
		}
		else {
			showWarning("Aucun article ou commentaire s�lectionn� !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function editerCommentairesCaches() {
  try {

		var url = "chrome://opensi/content/facturation/user/devis/commentaire_cache.xul?"+ cookie() +"&Devis_Id="+ devis_id;
  	window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function charger_coord() {
  try {
		var client_id = document.getElementById("Client_Id").value;
		var corps = cookie() +"&Page=Facturation/Clients/getCoord.tmpl&ContentType=xml&Client_Id="+ urlEncode(client_id);

		var p = requeteHTTP(corps);

		var contenu = p.responseXML.documentElement;
		
		chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById("Remise").value = contenu.getAttribute("Remise");
		document.getElementById('bRemise').setAttribute("class", "bIcoPourcentage");
		type_remise = 'P';
		document.getElementById("Code_Tarif").value = contenu.getAttribute("Code_Tarif");
		chargerModesReglements(contenu.getAttribute("Mode_Reg"));
		assujettiTVA = (contenu.getAttribute("Assujetti_TVA")=="1");
		document.getElementById('Assujetti_TVA').checked=assujettiTVA;
		document.getElementById('Num_TVA').disabled=!assujettiTVA;
		document.getElementById('Num_TVA').value=contenu.getAttribute("Num_TVA_Intra");
		
		defCommission = contenu.getAttribute('Taux_Commission');
		
		document.getElementById("Secteur").value = contenu.getAttribute("Secteur_Activite");

		document.getElementById("Denomination_Fact").value = contenu.getAttribute("Denomination_Fact");
		document.getElementById("Adresse_1_Fact").value = contenu.getAttribute("Adresse_1_Fact");		
		document.getElementById("Adresse_2_Fact").value = contenu.getAttribute("Adresse_2_Fact");
		document.getElementById("Adresse_3_Fact").value = contenu.getAttribute("Adresse_3_Fact");
		document.getElementById("Code_Postal_Fact").value = contenu.getAttribute("Code_Postal_Fact");
		document.getElementById("Ville_Fact").value = contenu.getAttribute("Ville_Fact");
    document.getElementById("Code_Pays_Fact").value = contenu.getAttribute("Code_Pays_Fact");
		
		document.getElementById("Civ_Inter_Fact").value = contenu.getAttribute("Civ_Inter_Fact");
		document.getElementById("Nom_Inter_Fact").value = contenu.getAttribute("Nom_Inter_Fact");
		document.getElementById("Prenom_Inter_Fact").value = contenu.getAttribute("Prenom_Inter_Fact");
		document.getElementById("Tel_Inter_Fact").value = contenu.getAttribute("Tel_Inter_Fact");
		document.getElementById("Fax_Inter_Fact").value = contenu.getAttribute("Fax_Inter_Fact");
		document.getElementById("Email_Inter_Fact").value = contenu.getAttribute("Email_Inter_Fact");
		
		document.getElementById("Denomination_Liv").value = contenu.getAttribute("Denomination_Liv");
		document.getElementById("Adresse_1_Liv").value = contenu.getAttribute("Adresse_1_Liv");
		document.getElementById("Adresse_2_Liv").value = contenu.getAttribute("Adresse_2_Liv");
		document.getElementById("Adresse_3_Liv").value = contenu.getAttribute("Adresse_3_Liv");
		document.getElementById("Code_Postal_Liv").value = contenu.getAttribute("Code_Postal_Liv");		
		document.getElementById("Ville_Liv").value = contenu.getAttribute("Ville_Liv");
    document.getElementById("Code_Pays_Liv").value = contenu.getAttribute("Code_Pays_Liv");
    calculerTvaPort();
    selectPaysLiv();
    
    document.getElementById("Civ_Inter_Liv").value = contenu.getAttribute("Civ_Inter_Liv");
		document.getElementById("Nom_Inter_Liv").value = contenu.getAttribute("Nom_Inter_Liv");
		document.getElementById("Prenom_Inter_Liv").value = contenu.getAttribute("Prenom_Inter_Liv");
		document.getElementById("Tel_Inter_Liv").value = contenu.getAttribute("Tel_Inter_Liv");
		document.getElementById("Fax_Inter_Liv").value = contenu.getAttribute("Fax_Inter_Liv");
		document.getElementById("Email_Inter_Liv").value = contenu.getAttribute("Email_Inter_Liv");
		
		document.getElementById("Denomination_Envoi").value = contenu.getAttribute("Denomination_Envoi");
		document.getElementById("Adresse_1_Envoi").value = contenu.getAttribute("Adresse_1_Envoi");
		document.getElementById("Adresse_2_Envoi").value = contenu.getAttribute("Adresse_2_Envoi");
		document.getElementById("Adresse_3_Envoi").value = contenu.getAttribute("Adresse_3_Envoi");
		document.getElementById("Code_Postal_Envoi").value = contenu.getAttribute("Code_Postal_Envoi");		
		document.getElementById("Ville_Envoi").value = contenu.getAttribute("Ville_Envoi");
    document.getElementById("Code_Pays_Envoi").value = contenu.getAttribute("Code_Pays_Envoi");
    
    document.getElementById("Civ_Inter_Envoi").value = contenu.getAttribute("Civ_Inter_Envoi");
		document.getElementById("Nom_Inter_Envoi").value = contenu.getAttribute("Nom_Inter_Envoi");
		document.getElementById("Prenom_Inter_Envoi").value = contenu.getAttribute("Prenom_Inter_Envoi");
		document.getElementById("Tel_Inter_Envoi").value = contenu.getAttribute("Tel_Inter_Envoi");
		document.getElementById("Fax_Inter_Envoi").value = contenu.getAttribute("Fax_Inter_Envoi");
		document.getElementById("Email_Inter_Envoi").value = contenu.getAttribute("Email_Inter_Envoi");
		
		document.getElementById('labelClient').value = client_id;
		document.getElementById('bCreerClient').collapsed = true;
		
		var client_connu = (client_id!="");
		var tree = document.getElementById("articles");
   	document.getElementById('chercher_adrliv').disabled = (!client_connu || tree.view==null || tree.view.rowCount>0);
   	document.getElementById('bCopierFactVersLivEnvoi').disabled = (mode=='V' || (aLignes.nbLignes()>0 && document.getElementById('Code_Pays_Fact').value!=document.getElementById('Code_Pays_Liv').value));
    document.getElementById('Code_Tarif').disabled = (tree.view==null || tree.view.rowCount>0);
		document.getElementById('chercher_adrfact').disabled = !client_connu;
		document.getElementById('chercher_inter').disabled = !client_connu;
		document.getElementById('chercher_inter_liv').disabled = !client_connu;
		document.getElementById('chercher_adrenvoi').disabled = !client_connu;
		document.getElementById('chercher_inter_envoi').disabled = !client_connu;
		
		ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
  }
}

function rechercherClient() {
  try {

		var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=true&Client_Express=true&Bloque=true";
		window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherClient);

		if (changementClientPossible) {
			var client_id = document.getElementById("Client_Id").value;
			if (client_id != "") {
				setModifie(true);
				charger_coord();
			}
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function retourRechercherClient(codeClient) {
	try {
		changementClientPossible = false;
		if (aLignes.nbLignes()>0) {
			var qCheckChgtClient = new QueryHttp("Facturation/Clients/getCoord.tmpl");
			qCheckChgtClient.setParam("Client_Id", codeClient);
			var result = qCheckChgtClient.execute();
			var contenu = result.responseXML.documentElement;
			var ancCodePaysLiv = document.getElementById('Code_Pays_Liv').value;
			var nouvCodePaysLiv = contenu.getAttribute('Code_Pays_Liv');
			var ancAssujettiTVA = document.getElementById('Assujetti_TVA').checked?"1":"0";
			var nouvAssujettiTVA = contenu.getAttribute('Assujetti_TVA');
			
			if (ancCodePaysLiv!=nouvCodePaysLiv) { showWarning("Impossible de changer le client car le code pays de livraison n'est pas identique."); }
			else if (ancAssujettiTVA!=nouvAssujettiTVA) { showWarning("Impossible de changer le client car le statut de la case 'Assujetti TVA' n'est pas identique."); }
			else {
				changementClientPossible = true;
			}
		} else { changementClientPossible = true; }
		
		if (changementClientPossible) {
			document.getElementById('Client_Id').value = codeClient;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnCodePaysFact() {
	try {
		document.getElementById('bCopierFactVersLivEnvoi').disabled = (aLignes.nbLignes()>0 && document.getElementById('Code_Pays_Fact').value!=document.getElementById('Code_Pays_Liv').value);
	} catch (e) {
		recup_erreur(e);
	}
}


function evaluer(elem, ev) {
	try {

		if (ev.keyCode==13) {
			var nf4 = new NumberFormat("0.00##", false);
			elem.value = nf4.format(calcExpr(elem.value));
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function changerTypeEdition(chgType) {
	try {

		editionTTC = chgType;
		
		if (editionTTC) {
			document.getElementById('ColTotal').setAttribute("label", "Total TTC");
			document.getElementById('ColPU').setAttribute("label", "P.U TTC");
			document.getElementById('lblFrais_Port').value = "Frais de port (ttc) :";
			document.getElementById('lblPU').value = "P.U TTC :";
			document.getElementById('piedTTC').collapsed = false;
			document.getElementById('piedHT').collapsed = true;
		}
		else {
			document.getElementById('ColTotal').setAttribute("label", "Total HT");
			document.getElementById('ColPU').setAttribute("label", "P.U HT");
			document.getElementById('lblFrais_Port').value = "Frais de port (ht) :";
			document.getElementById('lblPU').value = "P.U HT :";
			document.getElementById('piedTTC').collapsed = true;
			document.getElementById('piedHT').collapsed = false;			
		}
		
		calculTotaux();

	}	catch(e) {
		recup_erreur(e);
	}
}


function changerAssujettiTVA(etat) {
	try {

		assujettiTVA = etat;
		document.getElementById('Num_TVA').disabled=!assujettiTVA;
		listeTVA();
		setModifie(true);

	}	catch(e) {
		recup_erreur(e);
	}
}


function changerTypeVente() {
	try {
	  var qTypeVente = new QueryHttp("GetPays.tmpl");
	  qTypeVente.setParam("Code_Pays", document.getElementById("Code_Pays_Liv").value);
	  var result = qTypeVente.execute();
	  zoneUE = (result.responseXML.documentElement.getAttribute("zone_ue")=="1");
	}	catch(e) {
		recup_erreur(e);
	}
}


function rechercherAdrFact() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterAdrFact);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterAdrFact(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact_fact, contact_liv, contact_envoi) {
  try {

		document.getElementById("Denomination_Fact").value = nom;
		document.getElementById("Adresse_1_Fact").value = adr1;		
		document.getElementById("Adresse_2_Fact").value = adr2;
		document.getElementById("Adresse_3_Fact").value = adr3;
		document.getElementById("Code_Postal_Fact").value = cp;
		document.getElementById("Ville_Fact").value = ville;
	  document.getElementById("Code_Pays_Fact").value = code_pays;
	  
	  if (!isEmpty(contact_fact)) {
	  	var qInterFact = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterFact.setParam("Num_Inter", contact_fact);
	  	var result = qInterFact.execute();
	  	var content = result.responseXML.documentElement;
	  	reporterInterFact(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
		setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function rechercherInterlocuteurFact() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterInterFact);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterInterFact(civ, civ_courte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById("Civ_Inter_Fact").value = civ;
		document.getElementById("Nom_Inter_Fact").value = nom;		
		document.getElementById("Prenom_Inter_Fact").value = prenom;
		document.getElementById("Tel_Inter_Fact").value = tel;
		document.getElementById("Fax_Inter_Fact").value = fax;
		document.getElementById("Email_Inter_Fact").value = email;
		
		setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function rechercherAdrEnvoi() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterAdrEnvoi);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterAdrEnvoi(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact_fact, contact_liv, contact_envoi) {
  try {

		document.getElementById("Denomination_Envoi").value = nom;
		document.getElementById("Adresse_1_Envoi").value = adr1;		
		document.getElementById("Adresse_2_Envoi").value = adr2;
		document.getElementById("Adresse_3_Envoi").value = adr3;
		document.getElementById("Code_Postal_Envoi").value = cp;
		document.getElementById("Ville_Envoi").value = ville;
	  document.getElementById("Code_Pays_Envoi").value = code_pays;
	  
	   if (!isEmpty(contact_envoi)) {
	  	var qInterEnvoi = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterEnvoi.setParam("Num_Inter", contact_envoi);
	  	var result = qInterEnvoi.execute();
	  	var content = result.responseXML.documentElement;
	  	reporterInterEnvoi(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
	  
		setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function copierFactVersLivEnvoi() {
	try {
		document.getElementById('Denomination_Liv').value = document.getElementById('Denomination_Fact').value;
		document.getElementById("Adresse_1_Liv").value = document.getElementById("Adresse_1_Fact").value;		
		document.getElementById("Adresse_2_Liv").value = document.getElementById("Adresse_2_Fact").value;
		document.getElementById("Adresse_3_Liv").value = document.getElementById("Adresse_3_Fact").value;
		document.getElementById("Code_Postal_Liv").value = document.getElementById("Code_Postal_Fact").value;
		document.getElementById("Ville_Liv").value = document.getElementById("Ville_Fact").value;
	  document.getElementById("Code_Pays_Liv").value = document.getElementById("Code_Pays_Fact").value;
		calculerTvaPort();
		selectPaysLiv();

	  document.getElementById("Civ_Inter_Liv").value = document.getElementById("Civ_Inter_Fact").value;
		document.getElementById("Nom_Inter_Liv").value = document.getElementById("Nom_Inter_Fact").value;		
		document.getElementById("Prenom_Inter_Liv").value = document.getElementById("Prenom_Inter_Fact").value;
		document.getElementById("Tel_Inter_Liv").value = document.getElementById("Tel_Inter_Fact").value;
		document.getElementById("Fax_Inter_Liv").value = document.getElementById("Fax_Inter_Fact").value;
		document.getElementById("Email_Inter_Liv").value = document.getElementById("Email_Inter_Fact").value;
		
		document.getElementById('Denomination_Envoi').value = document.getElementById('Denomination_Fact').value;
		document.getElementById("Adresse_1_Envoi").value = document.getElementById("Adresse_1_Fact").value;		
		document.getElementById("Adresse_2_Envoi").value = document.getElementById("Adresse_2_Fact").value;
		document.getElementById("Adresse_3_Envoi").value = document.getElementById("Adresse_3_Fact").value;
		document.getElementById("Code_Postal_Envoi").value = document.getElementById("Code_Postal_Fact").value;
		document.getElementById("Ville_Envoi").value = document.getElementById("Ville_Fact").value;
	  document.getElementById("Code_Pays_Envoi").value = document.getElementById("Code_Pays_Fact").value;
	  
	  document.getElementById("Civ_Inter_Envoi").value = document.getElementById("Civ_Inter_Fact").value;
		document.getElementById("Nom_Inter_Envoi").value = document.getElementById("Nom_Inter_Fact").value;		
		document.getElementById("Prenom_Inter_Envoi").value = document.getElementById("Prenom_Inter_Fact").value;
		document.getElementById("Tel_Inter_Envoi").value = document.getElementById("Tel_Inter_Fact").value;
		document.getElementById("Fax_Inter_Envoi").value = document.getElementById("Fax_Inter_Fact").value;
		document.getElementById("Email_Inter_Envoi").value = document.getElementById("Email_Inter_Fact").value;
	  
		setModifie(true);
	} catch (e) {
		recup_erreur(e);
	}
}


function rechercherAdrLiv() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterAdrLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterAdrLiv(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact_fact, contact_liv, contact_envoi) {
  try {

		document.getElementById("Denomination_Liv").value = nom;
		document.getElementById("Adresse_1_Liv").value = adr1;		
		document.getElementById("Adresse_2_Liv").value = adr2;
		document.getElementById("Adresse_3_Liv").value = adr3;
		document.getElementById("Code_Postal_Liv").value = cp;
		document.getElementById("Ville_Liv").value = ville;
	  document.getElementById("Code_Pays_Liv").value = code_pays;
	  calculerTvaPort();
		selectPaysLiv();
	  
		if (!isEmpty(contact_liv)) {
	  	var qInterLiv = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterLiv.setParam("Num_Inter", contact_liv);
	  	var result = qInterLiv.execute();
	  	var content = result.responseXML.documentElement;
	  	reporterInterLiv(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
	  setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function rechercherInterlocuteurLiv() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterInterLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterInterLiv(civ, civ_courte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById("Civ_Inter_Liv").value = civ;
		document.getElementById("Nom_Inter_Liv").value = nom;		
		document.getElementById("Prenom_Inter_Liv").value = prenom;
		document.getElementById("Tel_Inter_Liv").value = tel;
		document.getElementById("Fax_Inter_Liv").value = fax;
		document.getElementById("Email_Inter_Liv").value = email;
		
		setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}


function rechercherInterlocuteurEnvoi() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterInterEnvoi);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterInterEnvoi(civ, civ_courte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById("Civ_Inter_Envoi").value = civ;
		document.getElementById("Nom_Inter_Envoi").value = nom;		
		document.getElementById("Prenom_Inter_Envoi").value = prenom;
		document.getElementById("Tel_Inter_Envoi").value = tel;
		document.getElementById("Fax_Inter_Envoi").value = fax;
		document.getElementById("Email_Inter_Envoi").value = email;
		
		setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}


function choisirMentions() {
  try {
  	
  	var ok = true;
  	
  	if (mode=="C") {
			ok = enregistrerDevis();
		}

		if (ok) {
			var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Devis&Doc_Id="+ devis_id;
    	window.openDialog(url,'','chrome,modal,centerscreen',setModifie);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function archiverDevis() {
	try {
		if (window.confirm("Etes-vous s�r de vouloir archiver le devis ?")) {
			var qArchiver = new QueryHttp("Facturation/Devis/archiverDevis.tmpl");
			qArchiver.setParam("Devis_Id", devis_id);
			qArchiver.execute();
			bloquerInterface();
			chargerDevis();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function creerClient() {
	try {

		var denomination_fact = document.getElementById('Denomination_Fact').value;
		var adresse_1_fact = document.getElementById('Adresse_1_Fact').value;
		var adresse_2_fact = document.getElementById('Adresse_2_Fact').value;
		var adresse_3_fact = document.getElementById('Adresse_3_Fact').value;
		var code_postal_fact = document.getElementById('Code_Postal_Fact').value;
		var ville_fact = document.getElementById('Ville_Fact').value;
		var code_pays_fact = document.getElementById('Code_Pays_Fact').value;
		var civ_inter_fact = document.getElementById("Civ_Inter_Fact").value;
		var nom_inter_fact = document.getElementById("Nom_Inter_Fact").value;
		var prenom_inter_fact = document.getElementById("Prenom_Inter_Fact").value;
		var tel_inter_fact = document.getElementById("Tel_Inter_Fact").value;
		var fax_inter_fact = document.getElementById('Fax_Inter_Fact').value;
		var email_inter_fact = document.getElementById('Email_Inter_Fact').value;
		var util_R = document.getElementById('Login_Resp').value;
		var num_tva = assujettiTVA?document.getElementById('Num_TVA').value:"";
		var code_tarif = document.getElementById("Code_Tarif").value;
		var modeReglement = document.getElementById("Mode_Reg").value;
		var secteurActivite = document.getElementById("Secteur").value;
		
		var params = "&Denomination_Fact=" + urlEncode(denomination_fact);
		params += "&Adresse_1_Fact=" + urlEncode(adresse_1_fact);
		params += "&Adresse_2_Fact=" + urlEncode(adresse_2_fact);
		params += "&Adresse_3_Fact=" + urlEncode(adresse_3_fact);
		params += "&Code_Postal_Fact=" + urlEncode(code_postal_fact);
		params += "&Ville_Fact=" + urlEncode(ville_fact);
		params += "&Code_Pays_Fact=" + urlEncode(code_pays_fact);
		params += "&Civ_Inter_Fact=" + civ_inter_fact;
		params += "&Nom_Inter_Fact=" + urlEncode(nom_inter_fact);
		params += "&Prenom_Inter_Fact=" + urlEncode(prenom_inter_fact);
		params += "&Tel_Inter_Fact=" + urlEncode(tel_inter_fact);
		params += "&Fax_Inter_Fact=" + urlEncode(fax_inter_fact);
		params += "&Email_Inter_Fact=" + urlEncode(email_inter_fact);
		params += "&Util_R=" + util_R;
		params += "&Assujetti_TVA=" + (assujettiTVA?"1":"0");
		params += "&Num_TVA=" + urlEncode(num_tva);
		params += "&Code_Tarif=" + code_tarif;
		params += "&Mode_Reg=" + modeReglement;
		params += "&Secteur_Activite=" + secteurActivite;
		params += "&Infos_Existantes=1";
		
		var url = "chrome://opensi/content/facturation/user/commun/popup-creerClient.xul?"+ cookie() + params;
    window.openDialog(url,'','chrome,modal,centerscreen', retourCreerClient);
	} catch (e) {
		recup_erreur(e);
	}
}


function retourCreerClient(clientId) {
	try {
		
		document.getElementById('Client_Id').value = clientId;
		document.getElementById('labelClient').value = clientId;
		document.getElementById('bCreerClient').collapsed = true;
		
		var tree = document.getElementById("articles");
   	document.getElementById('chercher_adrliv').disabled = (tree.view==null || tree.view.rowCount>0);
   	document.getElementById('bCopierFactVersLivEnvoi').disabled = (aLignes.nbLignes()>0 && document.getElementById('Code_Pays_Fact').value!=document.getElementById('Code_Pays_Liv').value);
    document.getElementById('Code_Tarif').disabled = (tree.view==null || tree.view.rowCount>0);
		document.getElementById('chercher_adrfact').disabled = false;
		document.getElementById('chercher_inter').disabled = false;
		document.getElementById('chercher_inter_liv').disabled = false;
		document.getElementById('chercher_adrenvoi').disabled = false;
		document.getElementById('chercher_inter_envoi').disabled = false;
		
		setModifie(true);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function initVersion() {
	try {
		
		aVersion.setParam("Type_Document", "Devis");
		aVersion.setParam("Document_Id", devis_id);
		aVersion.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function retour_devis() {
  try {

    window.location = "chrome://opensi/content/facturation/user/devis/menu_devis.xul?"+ cookie();

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

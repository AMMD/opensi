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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/calculDocument.js");


var aLignes = new Arbre('Facturation/GetRDF/articles_commande.tmpl', 'articles');
var aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'Mode_Reg');
var aResponsables = new Arbre("ComboListe/combo-responsables.tmpl","Responsable");
var aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "Secteur");
var aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","listeVersion");
var aAcomptes = new Arbre("Facturation/Commandes/liste-acomptes.tmpl","listeAcomptes");
var aListeHistorique = new Arbre("Facturation/Commandes/liste-historiqueModifications.tmpl","listeHistorique");

var commande_id;
var mode_ligne;
var qte_Minimum = 0;
var multiple = 0;
var fournisseur_id;
var mode;
var br_en_cours = 0;
var initLigne = false;
var tauxTvaPort;
var codeTvaPort;
var chargerModeReg;
var chargerResponsable;
var modifie = false;
var etat_commande;
var currentIndex = 0;
var typeRemise = 'P';
var typeRemiseFP = 'P';
var montantHT = 0;
var charger = true;
var acompte = 0;
var bloque = false;

var nf = new NumberFormat("0.00", false);


function init() {
  try {

  	bloquerInterface();
  	document.getElementById('boxNouvelAcompte').collapsed = true;
  	document.getElementById('tabHistorique').collapsed = true;

  	var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();
		var produit_frais = (parseIntBis(result.responseXML.documentElement.getAttribute('Produit_Frais'))==1);

		if (!produit_frais) {
			document.getElementById('ColNb_Pieces').collapsed = true;
			document.getElementById('ColUnite').collapsed = true;
			document.getElementById('Produit_Frais_1').collapsed = true;
			document.getElementById('Produit_Frais_2').collapsed = true;
		}
		
		var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
    qNomListeAttribut.setParam("Liste_Id", 2);
    result = qNomListeAttribut.execute();
    document.getElementById('colAttribut2').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
		
		document.getElementById('poidsTotal').value = 0;

		// liste des unités de l'article
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
    aPays.initTree(initPays);

	} catch (e) {
    recup_erreur(e);
  }
}


function initPays() {
	try {
		
    document.getElementById('Code_Pays_Fact').value = "FR";
    calculerTvaPort();
    selectPays();
    
	} catch (e) {
    recup_erreur(e);
  }
}


function selectPays() {
	try {
		listeTVA();
	} catch (e) {
		recup_erreur(e);
	}
}


function calculerTvaPort() {
	try {
		var codePays = document.getElementById('Code_Pays_Fact').value;
		codeTvaPort = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
		tauxTvaPort = getTva(codeTvaPort);
	} catch (e) {
		recup_erreur(e);
	}
}


function listeTVA() {
  try {
  	calculTotaux();
    var aCode = new Arbre("Facturation/GetRDF/taux_tva_fournisseur.tmpl", "Code_TVA");
    aCode.setParam("Code_Pays", document.getElementById("Code_Pays_Fact").value);
    aCode.initTree(selectTVA);

  } catch (e) {
    recup_erreur(e);
  }
}


function selectTVA() {
  try {
  	var codePays = document.getElementById('Code_Pays_Fact').value;
    document.getElementById('Code_TVA').value = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
    if (charger) {
    	init_2();
    	charger = false;
    }
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
		document.getElementById('Responsable').value = chargerResponsable;
	} catch (e) {
  	recup_erreur(e);
	}
}


function init_2() {
	try {

		window.parent.addEventListener("close",demandeEnregistrement,false);
		mode = ParamValeur("Mode");

		if (mode=="C") {
			nouvelleCommande();
		}
		else {
			commande_id = ParamValeur("Commande_Id");
			initLigne = true;

			aLignes.setParam("Commande_Id", commande_id);
			aLignes.initTree(chargerCommande);
		}
	} catch (e) {
  	recup_erreur(e);
	}
}


function getIndicationsCommande() {
	try {
		var qIndications = new QueryHttp("Facturation/Commun/getIndicationsCommandeFournisseur.tmpl");
		qIndications.setParam("Fournisseur_Id", fournisseur_id);
		var result = qIndications.execute();
		document.getElementById('Indications').value = result.responseXML.documentElement.getAttribute("Indications");
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


function switchRemise() {
	try {

		if (typeRemise=='P') {
			document.getElementById('bRemise').setAttribute("class", "bIcoEuro");
			typeRemise = 'M';
		}
		else {
			document.getElementById('bRemise').setAttribute("class", "bIcoPourcentage");
			typeRemise = 'P';
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
		var codePays = document.getElementById('Code_Pays_Fact').value;

		switch(type_ligne) {
			case "S":

				var reference = document.getElementById("Reference").value;

				if (!isEmpty(reference)) {

					if (mode == 'C' || !dejaPresente(reference)) {

						var corps = cookie() +"&Page=Facturation/Commandes/getArticle.tmpl&ContentType=xml";
            corps += "&Article_Id="+ urlEncode(reference) +"&Fournisseur_Id="+ urlEncode(fournisseur_id);
						var p = requeteHTTP(corps);

						var contenu = p.responseXML.documentElement;

						document.getElementById("Designation").value = contenu.getAttribute("Designation");
						quantite = 1;
						qte_Minimum = nf.format(contenu.getAttribute("Qte_Minimum"));
						multiple = nf.format(contenu.getAttribute("Multiple"));

						// trouve la quantité minimale a commander par rapport à la qte_Minimum et au multiple
						if (multiple!=0 && qte_Minimum!=0) {
							//prend la valeur entière supérieure de  qte_Minimum/multiple et la multiplie par le multiple
							//marche pour qte_Minimum>=multiple et qte_Minimum<=multiple
							quantite=nf.format(Math.ceil(qte_Minimum/multiple)*multiple);
						}
						else if (qte_Minimum!=0) {
							quantite=qte_Minimum;
						}
						else if (multiple!=0) {
							quantite=multiple;
						}
						document.getElementById("Nb_Pieces").value = "";
						document.getElementById("Quantite").value = quantite;
						document.getElementById('Unite').value = contenu.getAttribute("Unite");
						document.getElementById("PU").value = contenu.getAttribute("Prix");
						document.getElementById('Ristourne').value = "0.00";
						document.getElementById("Code_TVA").value = (codePays=="FR"?contenu.getAttribute("Code_TVA"):getCodeTvaZero(codePays));

					}
					else {
						showWarning("Cet article est déjà présent dans la commande !");
            ajouterLigne("I");
					}
				}
				else {
          ajouterLigne("I");
				}

				break;

			case "I":

				document.getElementById('Reference').value = "";
				document.getElementById('Designation').value = "";
				document.getElementById("Nb_Pieces").value = "";
				document.getElementById('Quantite').value = 1;
				document.getElementById('Unite').value = "U";
				document.getElementById('PU').value = "";
				document.getElementById('Ristourne').value = "0.00";
				document.getElementById('Code_TVA').value = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
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
				document.getElementById('Reference').setAttribute('readonly', true);
				document.getElementById('Designation').setAttribute('readonly', true);
				document.getElementById('Quantite').disabled = false;
				document.getElementById('PU').disabled = false;
				document.getElementById('Ristourne').disabled = false;
				document.getElementById('Code_TVA').disabled = false;
				document.getElementById('bValider').disabled = false;
				document.getElementById('bAnnuler').disabled = false;
				if (mode_ligne=="M" && !modifie) { document.getElementById('bBasculer').disabled = false; }
				break;

			case "I":
				document.getElementById('Reference').removeAttribute('readonly');
				document.getElementById('Designation').removeAttribute('readonly');
				document.getElementById('Nb_Pieces').disabled = false;
				document.getElementById('Quantite').disabled = false;
				document.getElementById('Unite').disabled = false;
				document.getElementById('PU').disabled = false;
				document.getElementById('Ristourne').disabled = false;
				document.getElementById('Code_TVA').disabled = false;
				document.getElementById('bValider').disabled = false;
				document.getElementById('bAnnuler').disabled = false;
				document.getElementById('bBasculer').disabled = true;
				break;

			default:
				var codePays = document.getElementById('Code_Pays_Fact').value;
				document.getElementById('Reference').value = "";
				document.getElementById('Designation').value = "";
				document.getElementById('Nb_Pieces').value = "";
				document.getElementById('Quantite').value = "";
				document.getElementById('Unite').value = "U";
				document.getElementById('PU').value = "";
				document.getElementById('Ristourne').value = "";
				document.getElementById('Ligne_Id').value = "";
				document.getElementById('Code_TVA').value = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
				document.getElementById('Reference').setAttribute('readonly', true);
				document.getElementById('Designation').setAttribute('readonly', true);
				document.getElementById('Nb_Pieces').disabled = true;
				document.getElementById('Quantite').disabled = true;
				document.getElementById('Unite').disabled = true;
				document.getElementById('PU').disabled = true;
				document.getElementById('Ristourne').disabled = true;
				document.getElementById('Code_TVA').disabled = true;
				document.getElementById('bSupprimer').disabled = true;
				document.getElementById('bFlecheHaut').disabled = true;
				document.getElementById('bFlecheBas').disabled = true;
				document.getElementById('bBasculer').disabled = true;
				document.getElementById('bValider').disabled = true;
				document.getElementById('bAnnuler').disabled = true;
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function basculerLigne() {
	try {
		var ligneId = document.getElementById("Ligne_Id").value;
		var type_ligne = document.getElementById("Type_Ligne").value;
		var url = "chrome://opensi/content/facturation/user/commandes/transferer_article.xul?"+ cookie() +"&Commande_Id="+ commande_id +"&Ligne_Id="+ ligneId +"&Type_Ligne="+ type_ligne;
	  window.openDialog(url,'','chrome,modal,centerscreen',retourBasculerLigne);
  } catch (e) {
  	recup_erreur(e);
	}
}


function transfertMultiArticles() {
	try {
		var url = "chrome://opensi/content/facturation/user/commandes/popup-transfertMultiArticles.xul?"+ cookie() +"&Commande_Id="+ commande_id;
	  window.openDialog(url,'','chrome,modal,centerscreen',retourBasculerLigne);
	} catch (e) {
		recup_erreur(e);
	}
}


function retourBasculerLigne() {
	try {
		ajouterLigne("I");
		aLignes.initTree(afterRefreshArticles);
	} catch (e) {
		recup_erreur(e);
	}
}


function dejaPresente(reference) {
  try {

		var corps = cookie() +"&Page=Facturation/Commandes/existeArticle.tmpl&ContentType=xml";
    corps += "&Reference="+ urlEncode(reference) +"&Commande_Id="+ commande_id;
		var p = requeteHTTP(corps);

		return p.responseXML.documentElement.getAttribute("existe")=="true";

	} catch (e) {
  	recup_erreur(e);
	}
}


function pressOnWindow(ev) {
	try {

		if (ev.altKey) {
			switch(ev.charCode) {
      	case 97: // 'a'
        	rechercherStock();
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

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie() +"&Fournisseur="+ urlEncode(fournisseur_id);
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
		qExArt.setParam('Reference', reference);
		qExArt.setParam('Fournisseur_Id', fournisseur_id);
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


function ouvrirLigne() {
  try {

		if (!bloque && aLignes.isSelected()) {
			var i = aLignes.getCurrentIndex();
			currentIndex = i;
			
			document.getElementById('bFlecheHaut').disabled = true;
			document.getElementById('bFlecheBas').disabled = true;
			
			if (mode=="M") {
				if (aLignes.getCellText(i,'ColType_Ligne')=="C") {
					ajouterLigne("I");
				}
				else {
	  			mode_ligne = "M";
		  		document.getElementById('bSupprimer').disabled = false;
	
			  	document.getElementById("Reference").value = aLignes.getCellText(i,'ColReference');
				  document.getElementById("Designation").value = aLignes.getCellText(i,'ColDesignation');
				  document.getElementById("Nb_Pieces").value = aLignes.getCellText(i,'ColNb_Pieces');
				  document.getElementById("Quantite").value = aLignes.getCellText(i,'ColQuantite');
				  document.getElementById("Unite").value = aLignes.getCellText(i,'ColUnite');
				  document.getElementById("PU").value = aLignes.getCellText(i,'ColPU');
				  document.getElementById("Code_TVA").value = aLignes.getCellText(i,'ColCode_TVA');
				  document.getElementById("Ristourne").value = aLignes.getCellText(i,'ColRistourne');
				  document.getElementById("Type_Ligne").value = aLignes.getCellText(i,'ColType_Ligne');
				  document.getElementById("Ligne_Id").value = aLignes.getCellText(i,'ColLigne_Id');

				  formatLigne(document.getElementById("Type_Ligne").value);
	      }
			}
			
			if (mode!="C" && (etat_commande!="T" && etat_commande!="C" && etat_commande!="A") && aLignes.getCellText(i,'ColType_Ligne')!="C") {
				// on ignore les lignes de commentaires
				var firstIndex = 0;
				var lastIndex = aLignes.nbLignes()-1;
				if (aLignes.getCellText(firstIndex,'ColType_Ligne')=="C") { firstIndex++; }
				if (aLignes.getCellText(lastIndex,'ColType_Ligne')=="C") { lastIndex--; }
				
				document.getElementById('bFlecheHaut').disabled = (i==firstIndex);
				document.getElementById('bFlecheBas').disabled = (i==lastIndex);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function ouvrirCommentaire() {
  try {

		if (!bloque && aLignes.isSelected() && mode=="M") {
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
		if (aLignes.isSelected() && mode!="C" && etat_commande!="T" && etat_commande!="C" && etat_commande!="A") {
			var i = aLignes.getCurrentIndex();
			if (aLignes.getCellText(i,'ColType_Ligne')!="C") {
				var ligneId = aLignes.getCellText(i,'ColLigne_Id');
				var qDeplacerLigne = new QueryHttp("Facturation/Commandes/deplacerLigne.tmpl");
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
		var reference = document.getElementById("Reference").value;
		var designation = document.getElementById("Designation").value;
		var nb_pieces = document.getElementById("Nb_Pieces").value;
		var quantite = document.getElementById("Quantite").value;
		var unite = document.getElementById("Unite").value;
		var pu = document.getElementById("PU").value;
		var ristourne = document.getElementById("Ristourne").value;
		var code_tva = document.getElementById("Code_TVA").value;
		var ligneId = document.getElementById("Ligne_Id").value;
  	var ok=true;

		if (mode=="C") {
			var prec_typeLigne = type_ligne;
			ok = enregistrerCommande();
			document.getElementById("Type_Ligne").value = prec_typeLigne;
			type_ligne = prec_typeLigne;
		}

		if (ok) {
			if (mode_ligne=="C") {
				var corps = cookie() +"&Page=Facturation/Commandes/ajouterArticle.tmpl&ContentType=xml";
			}
			else {
				var corps = cookie() +"&Page=Facturation/Commandes/modifierArticle.tmpl&ContentType=xml";
				corps += "&Ligne_Id="+ ligneId;
			}

			corps += "&Reference="+ urlEncode(reference);
	    corps += "&Designation="+ urlEncode(designation);
	    corps += "&Nb_Pieces=" + nb_pieces +"&Quantite="+ quantite +"&Unite="+ urlEncode(unite);
	    corps += "&Type_Ligne="+ type_ligne;
			corps += "&Prix="+ pu;
	    corps += "&Ristourne="+ ristourne;
	    corps += "&Code_TVA="+ code_tva;
	    corps += "&Commande_Id="+ commande_id;
	    corps += "&Fournisseur_Id="+ fournisseur_id;

			if (isEmpty(designation)) { showWarning("Désignation de l'article manquante !"); }
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !");	}
			else if (!isEmpty(nb_pieces) && !isPositiveInteger(nb_pieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (isEmpty(pu) || !isPositiveOrNull(pu) || !checkDecimal(pu,4)) { showWarning("Prix unitaire incorrect !");	}
			else if (isEmpty(ristourne) || !isTaux(ristourne)) { showWarning("Taux de ristourne incorrect !");	}
			else if (type_ligne=='S' && (nf.format(quantite)<nf.format(qte_Minimum))) { showWarning("La quantité doit être supérieure ou égale à la quantité minimale : "+qte_Minimum);	}
			else if (type_ligne=='S' && multiple!=0 && ((nf.format(quantite)%nf.format(multiple))!=0)) { showWarning("La quantité doit être un multiple de : "+multiple);	}
			else {

				var msg = "Attention cette référence n'existe pas dans votre base article. Elle ne sera donc pas prise en compte dans la gestion des stocks. Voulez-vous continuer ?";

				if (type_ligne=='S' || (mode_ligne=='M' || window.confirm(msg))) {
					if (mode_ligne=="C") {
						currentIndex = aLignes.nbLignes();
					}
					var p = requeteHTTP(corps);
					if (p.responseXML.documentElement.getAttribute('stock_depasse')=="true") {
						showWarning("Le stock virtuel du produit sera supérieur au stock maximum !");
					}
					
					checkAcomptePossible();
					
					ajouterLigne("I");
					aLignes.initTree(afterRefreshArticles);
					
					if (type_ligne=='S') {
						calculerPoids();
					}
				}
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

		var corps = cookie() +"&Page=Facturation/Commandes/supprimerArticle.tmpl&ContentType=xml&Commande_Id="+ commande_id +"&Ligne_Id="+ ligneId;
		requeteHTTP(corps);
		
		checkAcomptePossible();

		currentIndex--;
		ajouterLigne("I");
		aLignes.initTree(afterRefreshArticles);
		calculerPoids();

	} catch (e) {
  	recup_erreur(e);
	}
}


function validerCommande() {
  try {

    if (demandeEnregistrement()) {

			var tree = document.getElementById('articles');
			var modeReglement = document.getElementById('Mode_Reg').value;

		  if (tree.view==null || tree.view.rowCount<=0) { showWarning("La commande ne contient aucune ligne !"); }
		  else if (modeReglement=="0") { showWarning("Veuillez choisir un mode de règlement !"); }
		  else if (window.confirm("Etes-vous sûr de vouloir valider la commande ?")) {

		  	var qValider = new QueryHttp("Facturation/Commandes/validerCommande.tmpl");
		  	qValider.setParam("Commande_Id", commande_id);
		  	var result = qValider.execute();
		  	if (result.responseXML.documentElement.getAttribute("codeErreur")=="1") {
		  		showWarning("Vous n'avez pas les droits nécessaires pour valider une commande fournisseur !");
		  	} else {
		  		loadPage();
		  	}
			}
    }

	} catch (e) {
  	recup_erreur(e);
	}
}


function annulerCommande() {
  try {

	  if (window.confirm("Etes-vous sûr de vouloir annuler la commande ?")) {

	  	var qAnnuler = new QueryHttp("Facturation/Commandes/annulerCommande.tmpl");
	  	qAnnuler.setParam("Commande_Id", commande_id);
	  	var result = qAnnuler.execute();
	  	var codeErreur = result.responseXML.documentElement.getAttribute("code_erreur");
	  	if (codeErreur=="1") { showWarning("Veuillez d'abord annuler les acomptes de cette commande !"); }
	  	else if (codeErreur=="2") { showWarning("Veuillez d'abord annuler les bons de réception de cette commande !"); }
	  	else {
	  		showWarning("La commande est annulée !");
	  		loadPage();
	  	}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function enregistrerCommande() {
  try {

  	var ok=false;

    var tree = document.getElementById('articles');

    if (mode != 'C' && (tree.view==null || tree.view.rowCount<=0)) {
	    showWarning("La commande ne contient aucune ligne !");
    }
		else {

			var raison_sociale = document.getElementById('Denomination').value;
      var adresse_fact = document.getElementById('Adresse_Fact').value;
      var comp_adresse_fact = document.getElementById('Comp_Adresse_Fact').value;
			var adresse_3_fact = document.getElementById('Adresse_3_Fact').value;
      var cp_fact = document.getElementById('CP_Fact').value;
      var ville_fact = document.getElementById('Ville_Fact').value;
			var code_pays_fact = document.getElementById('Code_Pays_Fact').value;
			var civ_inter = document.getElementById('Civ_Inter').value;
			var nom_inter = document.getElementById('Nom_Inter').value;
			var prenom_inter = document.getElementById('Prenom_Inter').value;
			var tel_inter = document.getElementById('Tel_Inter').value;
			var fax_inter = document.getElementById('Fax_Inter').value;
			var email_inter = document.getElementById('Email_Inter').value;
			var refCommande = document.getElementById('refCommande').value;

			var modeReglement = document.getElementById('Mode_Reg').value;
			var secteurActivite = document.getElementById('Secteur').value;
  	  var frais_port = document.getElementById('Frais_Port').value;
	    var escompte = document.getElementById('Escompte').value;
			
			var remise = document.getElementById('Remise').value;
	    var remiseFP = document.getElementById('RemiseFP').value;
			var tauxRemise = 0;
			var montantRemise = 0;
			var tauxRemiseFP = 0;
			var montantRemiseFP = 0;
			
			var montantBase = montantHT;
			
			if (isEmpty(remise) || (typeRemise=='P'?!isTaux(remise):!isPositiveOrNull(remise) || parseFloat(remise)>montantBase)) { showWarning("Remise incorrecte !"); }
    	else if (isEmpty(frais_port) || !isPositiveOrNull(frais_port)) { showWarning("Frais de port incorrects !"); }
    	else if (isEmpty(remiseFP) || (typeRemiseFP=='P'?!isTaux(remiseFP):!isPositiveOrNull(remiseFP) || parseFloat(remiseFP)>parseFloat(frais_port))) { showWarning("Remise sur frais de port incorrecte !"); }
    	else if (isEmpty(escompte) || !isTaux(escompte)) { showWarning("Taux d'escompte incorrect !"); }
			else if (isEmpty(raison_sociale) || isEmpty(adresse_fact) || isEmpty(ville_fact) ) { showWarning("Vous devez indiquer les coordonnées du fournisseur avant d'enregistrer la commande !"); }
			else if (!isEmpty(tel_inter) && !isPhone(tel_inter)) { showWarning("Numéro de téléphone de facturation incorrect !"); }
			else if (!isEmpty(fax_inter) && !isPhone(fax_inter)) { showWarning("Numéro de fax de facturation incorrect !"); }
			else if (!isEmpty(email_inter) && !isEmail(email_inter)) { showWarning("Adresse e-mail de facturation incorrecte !"); }
			else {
				
				frais_port = parseFloat(frais_port);
				remise = parseFloat(remise);
				remiseFP = parseFloat(remiseFP);

  		  var corps;

	  	  if (mode=="C") {
		  	  corps = cookie() +"&Page=Facturation/Commandes/creerCommande.tmpl&ContentType=xml";
			  }
  		  else {
	  		  corps = cookie() +"&Page=Facturation/Commandes/modifierCommande.tmpl&ContentType=xml&Commande_Id="+ commande_id;
		    }
	  	  
	  	  if (typeRemise=='P') {
					tauxRemise = remise;
				}
				else {
					tauxRemise = (montantBase>0?remise/montantBase*100:0);
					montantRemise = remise;
				}
				
				if (typeRemiseFP=='P') {
					tauxRemiseFP = remiseFP;
				}
				else {
					tauxRemiseFP = (frais_port>0?remiseFP/frais_port*100:0);
					montantRemiseFP = remiseFP;
				}

				corps += "&Fournisseur_Id="+ urlEncode(fournisseur_id);
				corps += "&PRemise="+ tauxRemise +"&MRemise="+ montantRemise;
				corps += "&PRemise_FP="+ tauxRemiseFP +"&MRemise_FP="+ montantRemiseFP;
			  corps += "&Frais_Port="+ frais_port +"&Escompte="+ escompte +"&Mode_Reg="+ modeReglement;
			  corps += "&Secteur_Activite="+ secteurActivite +"&Commentaires_Fin="+ urlEncode(document.getElementById('Commentaires_Fin').value);
				corps += "&Commentaires_Int="+ urlEncode(document.getElementById('Commentaires_Int').value);
				corps += "&Ref_Commande="+ urlEncode(refCommande) +"&Intitule="+ urlEncode(document.getElementById('Intitule').value);
				corps += "&Util_R="+ document.getElementById('Responsable').value;
				corps += "&Code_TVA_Port="+ codeTvaPort +"&Taux_TVA_Port="+ tauxTvaPort;
				
				corps += "&Denomination="+ urlEncode(raison_sociale);
        corps += "&Adresse="+ urlEncode(adresse_fact);
        corps += "&Comp_Adresse="+ urlEncode(comp_adresse_fact);
				corps += "&Adresse_3="+ urlEncode(adresse_3_fact);
        corps += "&Code_Postal="+ urlEncode(cp_fact);
        corps += "&Ville="+ urlEncode(ville_fact);
				corps += "&Code_Pays="+ urlEncode(code_pays_fact);
				corps += "&Civ_Inter="+ urlEncode(civ_inter);
				corps += "&Nom_Inter="+ urlEncode(nom_inter);
				corps += "&Prenom_Inter="+ urlEncode(prenom_inter);
				corps += "&Tel_Inter="+ urlEncode(tel_inter);
				corps += "&Fax_Inter="+ urlEncode(fax_inter);
				corps += "&Email_Inter="+ urlEncode(email_inter);

  	  	var p = requeteHTTP(corps);

	    	if (mode=="C") {
		    	var contenu = p.responseXML.documentElement;
			    commande_id = contenu.getAttribute("Commande_Id");
			    aLignes.setParam("Commande_Id", commande_id);
			    bloquerInterface();
			    initLigne = true;
				  chargerCommande();
  			} else if (mode=="M") {
		  		if (aLignes.isSelected()) {
		  			var i = aLignes.getCurrentIndex();
		  			if (aLignes.getCellText(i, "ColType_Ligne")=="S") {
		  				document.getElementById('bBasculer').disabled = false;
		  			}
					}
  	  	}
  	  	
  	  	setModifie(false);

        ok = true;
  		}
    }

    return ok;

	} catch (e) {
  	recup_erreur(e);
	}
}


function calculTotaux() {
  try {
  	
  	var fournisseurId = document.getElementById("Fournisseur_Id").value;
		var fournisseurConnu = (fournisseurId!="");

		if (mode!='V') {
			document.getElementById('bRechFournisseur').collapsed = (aLignes.nbLignes()>0);
	    document.getElementById('Code_Pays_Fact').disabled = (bloque || charger || aLignes.nbLignes()>0);
	    document.getElementById('bChercherAdr').disabled = (bloque || charger || !fournisseurConnu || aLignes.nbLignes()>0);
		}
		
		var taux_escompte = parseFloat(document.getElementById('Escompte').value);
		var frais_port = parseFloat(document.getElementById('Frais_Port').value);
		var remise = parseFloat(document.getElementById('Remise').value);
		var remiseFP = parseFloat(document.getElementById('RemiseFP').value);

		if ((typeRemise=='P'?isTaux(remise):isPositiveOrNull(remise)) && (typeRemiseFP=='P'?isTaux(remiseFP):isPositiveOrNull(remiseFP)) && isTaux(taux_escompte) && isPositiveOrNull(frais_port)) {

			var tree = document.getElementById("articles");

			if (tree.view!=null) {
				
				var calculDocument = new CalculDocument();
				if (typeRemise=='P') { calculDocument.setRemiseP(remise); }
				else { calculDocument.setRemiseM(remise); }
				calculDocument.setFraisPortBruts(frais_port);
				if (typeRemiseFP=='P') { calculDocument.setRemiseFPP(remiseFP); }
				else { calculDocument.setRemiseFPM(remiseFP); }
				calculDocument.setTauxTVAFP(tauxTvaPort);
				calculDocument.setEscompteP(taux_escompte);
				calculDocument.setAcompte(acompte);
				
				for (var i=0;i<tree.view.rowCount;i++) {
					if (getCellText(tree,i,'ColType_Ligne')!="C") {
						var prixUnitaireBrut  = getCellText(tree,i,'ColPU');
						var ristourneP = getCellText(tree,i,'ColRistourne');
						var commissionP = 0;
						var quantite  = getCellText(tree,i,'ColQuantite');
						var codeTVA  = getCellText(tree,i,'ColCode_TVA');
						calculDocument.ajouterLigneDocument(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA);
					}
				}
				
				calculDocument.calculer();
				
				document.getElementById('MontantHT').value = calculDocument.getMontantHT();
				document.getElementById('MontantRemise').value = calculDocument.getRemiseM();
				document.getElementById('MontantFrais_Port').value = calculDocument.getFraisPortBruts();
				document.getElementById('MontantRemiseFP').value = calculDocument.getRemiseFPM();
				document.getElementById('TotalHT').value = calculDocument.getTotalHT();
				document.getElementById('TVA').value = calculDocument.getTotalTVA();
				document.getElementById('MontantTTC').value = calculDocument.getMontantTTC();
				document.getElementById('MontantEscompte').value = calculDocument.getEscompteM();
				document.getElementById('MontantAcompte').value = calculDocument.getAcompte();
				document.getElementById('TotalTTC').value = calculDocument.getTotalTTC();
				
				montantHT = calculDocument.getMontantHTSansFormat();
				
				document.getElementById('rowRemiseHT').collapsed = !calculDocument.afficherRemiseM();
				document.getElementById('rowRemiseFPHT').collapsed = !calculDocument.afficherRemiseFPM();
				document.getElementById('rowMontantTTC').collapsed = !calculDocument.afficherEscompteM();
				document.getElementById('rowEscompteHT').collapsed = !calculDocument.afficherEscompteM();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function calculerPoids() {
	try {
		
		var qPoids = new QueryHttp("Facturation/Commandes/getPoidsTotal.tmpl");
		qPoids.setParam("Commande_Id", commande_id);
		var result = qPoids.execute();
		
		document.getElementById('poidsTotal').value = result.responseXML.documentElement.getAttribute("Poids");
	} catch (e) {
		recup_erreur(e);
	}
}


function afterRefreshArticles() {
	try {
		document.getElementById('bBasculerMulti').disabled = (bloque || (etat_commande!="N" && etat_commande!="P") || aLignes.nbLignes()==0);
		calculTotaux();
		scrollToRank();

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

		document.getElementById('bEnregistrer').focus();
		// ça permet de perdre le focus sur les éléments "textbox"
		// et valider l'événement onchange en cas d'appui sur la croix de fermeture
		var ok = true;

		if (modifie) {
			ok = false;
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à la commande ?")) {
				ok = enregistrerCommande();
			}
		}
		
		return ok;

	} catch (e) {
  	recup_erreur(e);
	}
}


function setModifie(m) {
  try {
  	
  	modifie = m;

		if (m) {
			document.getElementById('tabCommande').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('bBasculer').disabled = true;
			document.getElementById('bBasculerMulti').disabled = true;
		} else {
			document.getElementById('tabCommande').setAttribute('image', null);
			document.getElementById('bBasculerMulti').disabled = (bloque || (etat_commande!="N" && etat_commande!="P") || aLignes.nbLignes()==0);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}



function rechercherFournisseur() {
	try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie();
    url += "&Nouv=false&Bloque=true";
    window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherFournisseur);

  } catch (e) {
    recup_erreur(e);
  }
}

function retourRechercherFournisseur(codeFournisseur) {
	try {
		
		document.getElementById('Fournisseur_Id').value = codeFournisseur;
		fournisseur_id = codeFournisseur;
		setModifie(true);
		charger_coordfact();
		getIndicationsCommande();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function rechercherAdr() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdrCom.xul?"+ cookie() +"&Fournisseur_Id="+ urlEncode(fournisseur_id);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterAdr);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterAdr(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact) {
  try {

		document.getElementById("Denomination").value = nom;
		document.getElementById("Adresse_Fact").value = adr1;		
		document.getElementById("Comp_Adresse_Fact").value = adr2;
		document.getElementById("Adresse_3_Fact").value = adr3;
		document.getElementById("CP_Fact").value = cp;
		document.getElementById("Ville_Fact").value = ville;
	  document.getElementById("Code_Pays_Fact").value = code_pays;
	  calculerTvaPort();
	  selectPays();
	  
	  if (!isEmpty(contact)) {
	  	var qInter = new QueryHttp("Facturation/Fournisseurs/getContact.tmpl");
	  	qInter.setParam("Num_Inter", contact);
	  	var result = qInter.execute();
	  	var content = result.responseXML.documentElement;
	  	reporterInter(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }	
		setModifie(true);
		
	} catch (e) {
  	recup_erreur(e);
  }
}


function rechercherInterlocuteur() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInterFournisseur.xul?"+ cookie() +"&Fournisseur_Id="+ urlEncode(fournisseur_id);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterInter);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterInter(civ, civ_courte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById("Civ_Inter").value = civ;
		document.getElementById("Nom_Inter").value = nom;		
		document.getElementById("Prenom_Inter").value = prenom;
		document.getElementById("Tel_Inter").value = tel;
		document.getElementById("Fax_Inter").value = fax;
		document.getElementById("Email_Inter").value = email;
		
		setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function charger_coordfact() {
  try {

		document.getElementById('labelFournisseur').value = fournisseur_id;
		var corps = cookie() +"&Page=Facturation/Fournisseurs/getCoord.tmpl&ContentType=xml&Fournisseur_Id="+ urlEncode(fournisseur_id);

    requeteHTTP(corps,new XMLHttpRequest(),charger_coordfact_2);

	} catch (e) {
  	recup_erreur(e);
  }
}


function charger_coordfact_2(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		document.getElementById("Denomination").value = contenu.getAttribute("Denomination");
		document.getElementById("Adresse_Fact").value = contenu.getAttribute("Adresse_Fact");
		document.getElementById("Comp_Adresse_Fact").value = contenu.getAttribute("Comp_Adresse_Fact");
		document.getElementById("Adresse_3_Fact").value = contenu.getAttribute("Adresse_3_Fact");
		document.getElementById("CP_Fact").value = contenu.getAttribute("CP_Fact");
		document.getElementById("Ville_Fact").value = contenu.getAttribute("Ville_Fact");
		document.getElementById("Code_Pays_Fact").value = contenu.getAttribute("Code_Pays_Fact");
		calculerTvaPort();
		selectPays();

		document.getElementById("Civ_Inter").value = contenu.getAttribute("Civ_Inter");
		document.getElementById("Nom_Inter").value = contenu.getAttribute("Nom_Inter");
		document.getElementById("Prenom_Inter").value = contenu.getAttribute("Prenom_Inter");
		document.getElementById("Tel_Inter").value = contenu.getAttribute("Tel_Inter");
		document.getElementById("Fax_Inter").value = contenu.getAttribute("Fax_Inter");
		document.getElementById("Email_Inter").value = contenu.getAttribute("Email_Inter");
		chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById('bChercherInter').disabled = false;

    document.getElementById('Secteur').value = contenu.getAttribute("Secteur_Activite");
    
    var corps = cookie() +"&Page=Facturation/Commandes/getDefaultCommande.tmpl&ContentType=xml&Fournisseur_Id="+ fournisseur_id;
		var p = requeteHTTP(corps);

		var contenu = p.responseXML.documentElement;
		document.getElementById('Remise').value = contenu.getAttribute("Remise");
		document.getElementById('bRemise').setAttribute("class", "bIcoPourcentage");
		typeRemise = 'P';
		chargerModesReglements(contenu.getAttribute('Mode_Reg'));

		ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
  }
}



function debloquerInterface(statut) {
	try {
		
		document.getElementById('listeVersion').disabled = false;
		document.getElementById('articles').disabled = false;
		document.getElementById('listeAcomptes').disabled = false;
		document.getElementById('listeHistorique').disabled = false;
		document.getElementById('tabBoxCommande').selectedIndex = 0;
		
		document.getElementById('bEnregistrer').disabled = bloque;
		document.getElementById('bValiderCommande').disabled = bloque;
		document.getElementById('bBloquerCommande').disabled = false;
		document.getElementById('bDebloquerCommande').disabled = false;
		document.getElementById('bVisualiser').disabled = false;
		document.getElementById('bReception').disabled = bloque;
		document.getElementById('bSolderCommande').disabled = bloque;
		document.getElementById('bAnnulerCommande').disabled = bloque;
		document.getElementById('bSupprimerCommande').disabled = bloque;
		document.getElementById('bNouvelAcompte').disabled=bloque;
		
		ajouterLigne("I");
		
		switch (statut) {
	    case 'N':
			case 'P':
	      document.getElementById('bEnregistrer').collapsed = bloque;
	      document.getElementById('bValiderCommande').collapsed = bloque;
	      document.getElementById('bSupprimerCommande').collapsed = (isEmpty(commande_id));
	      document.getElementById('bRemise').disabled=bloque;
	  		document.getElementById('Remise').disabled=bloque;
	  		document.getElementById('Frais_Port').disabled=bloque;
	  		document.getElementById('bRemiseFP').disabled=bloque;
	  		document.getElementById('RemiseFP').disabled=bloque;
	      document.getElementById('Escompte').disabled = bloque;
	      document.getElementById('Mode_Reg').disabled = bloque;
	      document.getElementById('Commentaires_Fin').disabled = bloque;
				document.getElementById('Commentaires_Int').disabled = bloque;
				document.getElementById('bChoisirMentions').disabled = bloque;
				document.getElementById('bArticle').disabled = bloque;
				document.getElementById('bCommentaire').disabled = bloque;
				document.getElementById('bRechFournisseur').disabled = (bloque || statut=='P');
				document.getElementById('Intitule').disabled = bloque;
				document.getElementById('refCommande').disabled = bloque;
				document.getElementById('Indications').disabled = bloque;
				document.getElementById('Responsable').disabled = bloque;
				document.getElementById('Secteur').disabled = bloque;
				document.getElementById('bBloquerCommande').collapsed = (isEmpty(commande_id) || bloque);
				document.getElementById('bDebloquerCommande').collapsed = (isEmpty(commande_id) || !bloque);
	      break;
	    case 'A':
	    case 'T':
	    case 'C':
	    	mode = "V";
	    	document.getElementById('bReception').collapsed = false;
	    	document.getElementById('bAnnulerCommande').collapsed = (statut!='T');
	    	document.getElementById('bSolderCommande').collapsed = (statut!='T');
	    	document.getElementById('bBloquerCommande').collapsed = (statut!='T' || bloque);
				document.getElementById('bDebloquerCommande').collapsed = (statut!='T' || !bloque);
				formatLigne("");
	      break;
	  }
	
	  if (mode!="V") {
			document.getElementById('Denomination').disabled = bloque;
			document.getElementById('Adresse_Fact').disabled = bloque;
			document.getElementById('Comp_Adresse_Fact').disabled = bloque;
			document.getElementById('Adresse_3_Fact').disabled = bloque;
			document.getElementById('CP_Fact').disabled = bloque;
			document.getElementById('Ville_Fact').disabled = bloque;
			document.getElementById('Code_Pays_Fact').disabled = bloque;
			document.getElementById("Civ_Inter").disabled = bloque;
			document.getElementById("Nom_Inter").disabled = bloque;
			document.getElementById("Prenom_Inter").disabled = bloque;
			document.getElementById("Tel_Inter").disabled = bloque;
			document.getElementById("Fax_Inter").disabled = bloque;
			document.getElementById("Email_Inter").disabled = bloque;
			
			document.getElementById('Reference').disabled = bloque;
			document.getElementById('Designation').disabled = bloque;
			document.getElementById('Nb_Pieces').disabled = bloque;
			document.getElementById('Quantite').disabled = bloque;
			document.getElementById('Unite').disabled = bloque;
			document.getElementById('PU').disabled = bloque;
			document.getElementById('Ristourne').disabled = bloque;
			document.getElementById('Code_TVA').disabled = bloque;
			document.getElementById('bArticle').disabled = bloque;
			document.getElementById('bCommentaire').disabled = bloque;
			document.getElementById('bAnnuler').disabled = bloque;
			document.getElementById('bValider').disabled = bloque;
			
			document.getElementById('refCommande').disabled = bloque;
			document.getElementById('Intitule').disabled = bloque;
			document.getElementById('Responsable').disabled = bloque;
			document.getElementById('Secteur').disabled = bloque;
			document.getElementById('Commentaires_Fin').disabled = bloque;
			document.getElementById('Commentaires_Int').disabled = bloque;
			document.getElementById('bChoisirMentions').disabled = bloque;
			document.getElementById('Mode_Reg').disabled = bloque;
			document.getElementById('bRemise').disabled = bloque;
			document.getElementById('Remise').disabled = bloque;
			document.getElementById('Frais_Port').disabled = bloque;
			document.getElementById('bRemiseFP').disabled = bloque;
			document.getElementById('RemiseFP').disabled = bloque;
			document.getElementById('Escompte').disabled = bloque;
	  }
	  
	  debloquerBoutonsMenu();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function nouvelleCommande() {
  try {

  	commande_id = "";
		etat_commande = "";
		fournisseur_id = "";
		bloquer = false;

		document.getElementById('Commentaires_Fin').value = "";
		document.getElementById('Commentaires_Int').value = "";
		document.getElementById('Numero').value = "";
		document.getElementById('date_cmd').value = get_cookie('Today');
		document.getElementById('Remise').value = "0.00";
		document.getElementById('Escompte').value = "0.00";
		document.getElementById('Frais_Port').value = "0.00";
		document.getElementById('RemiseFP').value = "0.00";

		document.getElementById('MontantHT').value = "0.00";
		document.getElementById('MontantRemise').value = "0.00";
		document.getElementById('MontantFrais_Port').value = "0.00";
		document.getElementById('MontantRemiseFP').value = "0.00";
		document.getElementById('MontantAcompte').value = "0.00"
		document.getElementById('TotalHT').value = "0.00";
		document.getElementById('TVA').value = "0.00";
		document.getElementById('MontantTTC').value = "0.00";
		document.getElementById('MontantEscompte').value = "0.00";
		document.getElementById('TotalTTC').value = "0.00";
		
		montantHT=0;
		
		document.getElementById('rowRemiseHT').collapsed = true;
		document.getElementById('rowRemiseFPHT').collapsed = true;
		document.getElementById('rowMontantTTC').collapsed = true;
		document.getElementById('rowEscompteHT').collapsed = true;

		document.getElementById('Creation').label = "";
		document.getElementById('Modification').label = "";
		document.getElementById('Creation').collapsed = true;
		document.getElementById('Modification').collapsed = true;
		document.getElementById('Fiche').label = "";
    document.getElementById('Numero').value = "";
		document.getElementById('labelFournisseur').value = "";
		document.getElementById('Secteur').selectedIndex = 0;
		document.getElementById('etat_cmd').value = "Nouvelle";
		
		chargerResponsables(get_cookie("User"));
		chargerModesReglements("0");
		
		document.getElementById('boxNouvelAcompte').collapsed = true;
    document.getElementById('tabHistorique').collapsed = true;
    aAcomptes.deleteTree();
    aListeHistorique.deleteTree();

		aLignes.deleteTree();
		debloquerInterface('N');

	} catch (e) {
  	recup_erreur(e);
  }
}


function chargerCommande() {
  try {

		mode = "M";

		var corps = cookie() +"&Page=Facturation/Commandes/getCommande.tmpl&ContentType=xml&Commande_Id="+ commande_id;

		var p = requeteHTTP(corps);

		var contenu = p.responseXML.documentElement;

    document.getElementById('Denomination').value = contenu.getAttribute('Denomination');
    document.getElementById('Adresse_Fact').value = contenu.getAttribute('Adresse');
    document.getElementById('Comp_Adresse_Fact').value = contenu.getAttribute('Comp_Adresse');
		document.getElementById('Adresse_3_Fact').value = contenu.getAttribute('Adresse_3');
    document.getElementById('CP_Fact').value = contenu.getAttribute('Code_Postal');
    document.getElementById('Ville_Fact').value = contenu.getAttribute('Ville');
    document.getElementById('Code_Pays_Fact').value = contenu.getAttribute('Code_Pays');
    selectPays();
    document.getElementById('Civ_Inter').value = contenu.getAttribute('Civ_Inter');
    document.getElementById('Nom_Inter').value = contenu.getAttribute('Nom_Inter');
    document.getElementById('Prenom_Inter').value = contenu.getAttribute('Prenom_Inter');
    document.getElementById('Tel_Inter').value = contenu.getAttribute('Tel_Inter');
    document.getElementById('Fax_Inter').value = contenu.getAttribute('Fax_Inter');
    document.getElementById('Email_Inter').value = contenu.getAttribute('Email_Inter');

		document.getElementById('Remise').value = contenu.getAttribute('Remise');
		typeRemise = contenu.getAttribute('TypeRemise');
		document.getElementById('bRemise').setAttribute("class", (typeRemise=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('RemiseFP').value = contenu.getAttribute('Remise_FP');
		typeRemiseFP = contenu.getAttribute('TypeRemise_FP');
		document.getElementById('bRemiseFP').setAttribute("class", (typeRemiseFP=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('Escompte').value = contenu.getAttribute('Escompte');
		document.getElementById('Frais_Port').value = contenu.getAttribute('Frais_Port');
		acompte = contenu.getAttribute('Acompte');
		document.getElementById('Commentaires_Fin').value = contenu.getAttribute('Commentaires_Fin');
		document.getElementById('Commentaires_Int').value = contenu.getAttribute('Commentaires_Int');
    document.getElementById('date_cmd').value = contenu.getAttribute('Date_Commande');
    chargerResponsables(contenu.getAttribute('Util_R'));
    chargerModesReglements(contenu.getAttribute('Mode_Reg'));

		document.getElementById('Intitule').value = contenu.getAttribute('Intitule');
		document.getElementById('refCommande').value = contenu.getAttribute('Ref_Commande');
		document.getElementById('Secteur').value = contenu.getAttribute("Secteur_Activite");
		
		codeTvaPort = contenu.getAttribute('Code_TVA_Port');
		tauxTvaPort = contenu.getAttribute('Taux_TVA_Port');

		br_en_cours = contenu.getAttribute('BR_En_Cours');
		bloque = (contenu.getAttribute('Bloque')=="1");

		var creation = "Commande créée le "+ contenu.getAttribute('Date_Creation');
    creation += " par "+ contenu.getAttribute('Login_Createur');
    document.getElementById('Creation').label = creation;
    var modification = "Dernière modification le "+ contenu.getAttribute('Date_Maj');
    modification += " par "+ contenu.getAttribute('Login_Maj');
		document.getElementById('Modification').label = modification;
		document.getElementById('Fiche').label = "Commande N° "+ contenu.getAttribute('Numero');
		document.getElementById('Numero').value = contenu.getAttribute('Numero');
		document.getElementById('Creation').collapsed = false;
		document.getElementById('Modification').collapsed = false;
		
		document.getElementById('tabVersionDocument').collapsed = false;
    initVersion();
    
    calculerPoids();

		setModifie(false);

		etat_commande = contenu.getAttribute('Etat');
		if (etat_commande=="N") { document.getElementById('etat_cmd').value = "Non validée"; }
		else if (etat_commande=="P") { document.getElementById('etat_cmd').value = "En préparation"; }
		else if (etat_commande=="T") { document.getElementById('etat_cmd').value = "En cours"; }
		else if (etat_commande=="A") { document.getElementById('etat_cmd').value = "Annulée"; }
		else if (etat_commande=="C") { document.getElementById('etat_cmd').value = "Clôturée"; }

		fournisseur_id = contenu.getAttribute('Fournisseur_Id');
		var fournisseurConnu = (fournisseur_id!="");
		document.getElementById('Fournisseur_Id').value = fournisseur_id;
		document.getElementById('labelFournisseur').value = fournisseur_id;
		getIndicationsCommande();
		debloquerInterface(etat_commande);
		document.getElementById('bBasculerMulti').disabled = (bloque || (etat_commande!="N" && etat_commande!="P") || aLignes.nbLignes()==0);

		if ((etat_commande=='N' || etat_commande=='P') && initLigne && !bloque) {
			document.getElementById('bChercherInter').disabled = (!fournisseurConnu);
			ajouterLigne("I");
			initLigne = false;
		}
		
		document.getElementById('bOuvrirCommentairesCaches').disabled=false;
		
		var existeFacture = (contenu.getAttribute("Existe_Facture")=="true");
		var acomptePossible = ((etat_commande=="N" || ((etat_commande=="P" || etat_commande=="T") && !existeFacture)) && contenu.getAttribute("Autoriser_Acompte")=="true");
		document.getElementById('boxNouvelAcompte').collapsed=!acomptePossible;
		aAcomptes.setParam("Commande_Id", commande_id);
		aAcomptes.initTree();
		
		if (etat_commande!="N" && etat_commande!="P") {
			//document.getElementById('tabHistorique').collapsed = false;
			aListeHistorique.setParam("Commande_Id", commande_id);
			aListeHistorique.initTree();
		}

		calculTotaux();

	} catch (e) {
    recup_erreur(e);
  }
}


function checkAcomptePossible() {
	try {
		var qAcompte = new QueryHttp("Facturation/Commandes/checkAcomptePossible.tmpl");
		qAcompte.setParam("Commande_Id", commande_id);
		var result = qAcompte.execute();
		var contenu = result.responseXML.documentElement;
		
		var existeFacture = (contenu.getAttribute("Existe_Facture")=="true");
		var acomptePossible = ((etat_commande=="N" || ((etat_commande=="P" || etat_commande=="T") && !existeFacture)) && contenu.getAttribute("Autoriser_Acompte")=="true");
		document.getElementById('boxNouvelAcompte').collapsed=!acomptePossible;
		aAcomptes.setParam("Commande_Id", commande_id);
		aAcomptes.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerCommande() {
	try {

		if (window.confirm("Confirmez-vous la suppression de la commande ?")) {
			var qSupCom = new QueryHttp("Facturation/Commandes/supprimerCommande.tmpl");
			qSupCom.setParam("Commande_Id", commande_id);
			qSupCom.execute();

			showMessage("La commande a été supprimée !");

			retour_commandes();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function solderCommande() {
	try {

		if (br_en_cours>0) {
			showWarning("Impossible de solder la commande, vous devez d'abord traiter les BR en cours");
		}
		else if (window.confirm("Voulez-vous vraiment solder cette commande ?\n(Attention plus aucune réception possible !)")) {

			var qSolder = new QueryHttp("Facturation/Commandes/solderCommande.tmpl");
			qSolder.setParam("Commande_Id", commande_id);
			qSolder.execute();

			showMessage("La commande a été soldée avec succès !");

			loadPage();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function changeBlocage(b) {
  try {

  	var qBloquer = new QueryHttp("Facturation/Commandes/bloquerCommande.tmpl");
  	qBloquer.setParam("Bloquer", (b?1:0));
  	qBloquer.setParam("Commande_Id", commande_id);
  	qBloquer.execute();

  } catch (e) {
    recup_erreur(e);
  }
}


function nouvelAcompte() {
	try {
    var params = "&Commande_Id="+ commande_id;
    params += "&Code_Pays="+ document.getElementById("Code_Pays_Fact").value;
    params += "&Fournisseur_Id="+ document.getElementById('Fournisseur_Id').value;
    
		var url = "chrome://opensi/content/facturation/user/commandes/popup-creerAcompte.xul?"+ cookie() + params;
		window.openDialog(url,'','chrome,modal,centerscreen',retourAcompte);
	} catch (e) {
		recup_erreur(e);
	}
}


function retourAcompte() {
	try {
		aAcomptes.initTree();
		document.getElementById('bAnnulerAcompte').disabled=true;
		document.getElementById('bReediterAcompte').disabled=true;
		var qGetCommande = new QueryHttp("Facturation/Commandes/getCommande.tmpl");
		qGetCommande.setParam("Commande_Id", commande_id);
		var result = qGetCommande.execute();
		var contenu = result.responseXML.documentElement;
		acompte = contenu.getAttribute('Acompte');
		document.getElementById('boxNouvelAcompte').collapsed = (contenu.getAttribute("Autoriser_Acompte")=="false");
		calculTotaux();
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnListeAcomptes() {
	try {
		if (aAcomptes.isSelected()) {
			var i = aAcomptes.getCurrentIndex();
			var statut = aAcomptes.getCellText(i, 'colStatut');
			var impute = aAcomptes.getCellText(i, 'colImpute');
			document.getElementById('bAnnulerAcompte').disabled=(statut=="A" || impute=="true");
			document.getElementById('bReediterAcompte').disabled=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function annulerAcompte() {
	try {
		if (aAcomptes.isSelected() && window.confirm("Voulez-vous annuler cet acompte ?")) {
			var i = aAcomptes.getCurrentIndex();
			var acompteId = aAcomptes.getCellText(i, 'colAcompteId');
			var qAnnulerAcompte = new QueryHttp("Facturation/Commandes/annulerAcompte.tmpl");
			qAnnulerAcompte.setParam("Acompte_Id", acompteId);
			var result = qAnnulerAcompte.execute();
			var codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
			if (codeErreur=="1") {
				showWarning("Veuillez d'abord désaffecter le règlement associé à l'acompte en suivi des règlements !");
			} else if (codeErreur=="2") {
				showWarning("Veuillez d'abord désaffecter l'acompte des factures auxquelles il est relié !");
			} else {
				aAcomptes.initTree(retourAcompte);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function reediterAcompte() {
	try {
		if (aAcomptes.isSelected()) {
			var i = aAcomptes.getCurrentIndex();
			var acompteId = aAcomptes.getCellText(i, 'colAcompteId');
			editerAcompte(acompteId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function editerAcompte(acompteId) {
  try {

		window.location = "chrome://opensi/content/facturation/user/commandes/commande.xul?"+ cookie() +"&Commande_Id="+ commande_id +"&Acompte_Id="+ acompteId  +"&Mode="+ mode +"&Type_Doc=Acompte";

	} catch (e) {
    recup_erreur(e);
  }
}


function loadPage() {
  try {

    window.location = "chrome://opensi/content/facturation/user/commandes/edition_commande.xul?"+ cookie() +"&Commande_Id="+ commande_id;

  } catch (e) {
    recup_erreur(e);
  }
}


function bloquerCommande() {
  try {

    if (demandeEnregistrement()) {
      changeBlocage(true);
      loadPage();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function debloquerCommande() {
  try {

  	changeBlocage(false);
    loadPage();

	} catch (e) {
    recup_erreur(e);
  }
}


function visualiserCommande() {
  try {
  	
    if (demandeEnregistrement()) {

		  var tree = document.getElementById('articles');
		  var modeReglement = document.getElementById('Mode_Reg').value;

		  if (tree.view==null || tree.view.rowCount<=0) { showWarning("La commande ne contient aucune ligne !"); }
		  else if (modeReglement=="0") { showWarning("Veuillez choisir un mode de règlement !"); }
		  else {
	  	  window.location = "chrome://opensi/content/facturation/user/commandes/commande.xul?"+ cookie() +"&Commande_Id="+ commande_id +"&Mode="+ mode +"&Type_Doc=Commande";
		  }
    }

	} catch (e) {
    recup_erreur(e);
  }
}


function receptionCommande() {
  try {

	  window.location = "chrome://opensi/content/facturation/user/commandes/edition_br.xul?"+ cookie() +"&Commande_Id="+ commande_id +"&Fournisseur_Id="+ fournisseur_id;

	} catch (e) {
    recup_erreur(e);
  }
}


function editerCommentaire() {
  try {

		var tree = document.getElementById("articles");

		if (tree.view!=null && tree.currentIndex!=-1) {

			var ligneId = getCellText(tree,tree.currentIndex,'ColLigne_Id');

			var url = "chrome://opensi/content/facturation/user/commandes/commentaire.xul?"+ cookie();
      url += "&Ligne_Id="+ ligneId;
    	window.openDialog(url,'','chrome,modal,centerscreen');

			aLignes.initTree(afterRefreshArticles);
			ajouterLigne("I");
		}
		else {
			showWarning("Aucun article ou commentaire sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function editerCommentairesCaches() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-commentaireCache.xul?"+ cookie();
    url += "&Type_Doc=Commande_Fournisseur&Doc_Id="+ commande_id;
  	window.openDialog(url,'','chrome,modal,centerscreen');

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


function choisirMentions() {
  try {

  	var ok = true;

  	if (mode=="C") {
			ok = enregistrerCommande();
		}

		if (ok) {
			var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Commande_Fournisseur&Doc_Id="+ commande_id;
    	window.openDialog(url,'','chrome,modal,centerscreen',pageModifiee);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function pageModifiee(b) {
	try {

		if (b) setModifie(true);

	} catch (e) {
		recup_erreur(e);
	}
}


function initVersion() {
	try {
		
		aVersion.setParam("Type_Document", "Commande_Fournisseur");
		aVersion.setParam("Document_Id", commande_id);
		aVersion.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}



function retour_commandes() {
  try {

    window.location = "chrome://opensi/content/facturation/user/commandes/menu_commandes.xul?"+ cookie();

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

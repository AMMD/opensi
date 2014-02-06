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


var aTarifs = new Arbre('Facturation/GetRDF/tarifs_qte.tmpl', 'tarifs_qte');
var aUnitesPoids = new Arbre("ComboListe/combo-unitesVente.tmpl", "unitePoids");
var aUnitesDimensions = new Arbre("ComboListe/combo-unitesVente.tmpl", "uniteDimensions");
var aUnitesVolume = new Arbre("ComboListe/combo-unitesVente.tmpl", "uniteVolume");
var aComptesNational = new Arbre("Facturation/GetRDF/liste_comptes_articles.tmpl", "liste_comptes_articles_national");
var aComptesNatUE = new Arbre("Facturation/GetRDF/liste_comptes_articles_nat_ue.tmpl", "liste_comptes_articles_nat_ue");
var aComptesUE = new Arbre("Facturation/GetRDF/liste_comptes_articles.tmpl", "liste_comptes_articles_ue");
var aComptesInternational = new Arbre("Facturation/GetRDF/liste_comptes_articles.tmpl", "liste_comptes_articles_international");

var defautUniteIdPoids;
var defautUniteIdDim;
var defautUniteIdVol;
var currentUnitePoids = "";
var currentUniteDimensions = "";
var currentUniteVolume = "";
var currentChampCompte = "";

function initPrix() {
	try {
		
		var qDefautUniteIdPoids = new QueryHttp("Facturation/Commun/getUniteId.tmpl");
		qDefautUniteIdPoids.setParam("Unite","kg");
		qDefautUniteIdPoids.setParam("Type_Unite","P");
		result = qDefautUniteIdPoids.execute();
		defautUniteIdPoids = result.responseXML.documentElement.getAttribute("Unite_Id");
		
		var qDefautUniteIdDim = new QueryHttp("Facturation/Commun/getUniteId.tmpl");
		qDefautUniteIdDim.setParam("Unite","m");
		qDefautUniteIdDim.setParam("Type_Unite","L");
		var result = qDefautUniteIdDim.execute();
		defautUniteIdDim = result.responseXML.documentElement.getAttribute("Unite_Id");
		
		var qDefautUniteIdVol = new QueryHttp("Facturation/Commun/getUniteId.tmpl");
		qDefautUniteIdVol.setParam("Unite","m³");
		qDefautUniteIdVol.setParam("Type_Unite","V");
		result = qDefautUniteIdVol.execute();
		defautUniteIdVol = result.responseXML.documentElement.getAttribute("Unite_Id");
		
		aUnitesPoids.setParam("Type_Unite", "P");
		aUnitesDimensions.setParam("Type_Unite", "L");
		aUnitesVolume.setParam("Type_Unite", "V");

		setModeTarif();

		// liste des unités de l'article
		var aUnite = new Arbre("Facturation/GetRDF/unites_vente.tmpl", "Unite");
		aUnite.initTree(initUnite);

		 // liste des TVA de l'article
		var aTva = new Arbre("Facturation/GetRDF/taux_tva.tmpl", "Code_TVA");
		aTva.initTree(initTVA);

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerUnitesPoids(selection) {
	try {

		currentUnitePoids = selection;
		aUnitesPoids.setParam("Selection", currentUnitePoids);
		aUnitesPoids.initTree(initUnitePoids);

	} catch (e) {
    recup_erreur(e);
  }
}


function initUnitePoids() {
	try {

    document.getElementById('unitePoids').value = currentUnitePoids;

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerUnitesDimensions(selection) {
	try {

		currentUniteDimensions = selection;
		aUnitesDimensions.setParam("Selection", currentUniteDimensions);
		aUnitesDimensions.initTree(initUniteDimensions);

	} catch (e) {
    recup_erreur(e);
  }
}


function initUniteDimensions() {
	try {

    document.getElementById('uniteDimensions').value = currentUniteDimensions;

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerUnitesVolume(selection) {
	try {

		currentUniteVolume = selection;
		aUnitesVolume.setParam("Selection", currentUniteVolume);
		aUnitesVolume.initTree(initUniteVolume);

	} catch (e) {
    recup_erreur(e);
  }
}


function initUniteVolume() {
	try {

    document.getElementById('uniteVolume').value = currentUniteVolume;

	} catch (e) {
    recup_erreur(e);
  }
}


function initUnite() {
	try {
		
		document.getElementById('Unite').selectedIndex = 0;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function calculerVolume() {
	try {
		var uniteDimensions = document.getElementById('uniteDimensions').value;
		var longueur = document.getElementById('longueur').value;
		var largeur = document.getElementById('largeur').value;
		var hauteur = document.getElementById('hauteur').value;
		var uniteVolume = document.getElementById('uniteVolume').value;
		
		if (isEmpty(uniteDimensions)) { showWarning("Veuillez sélectionner une unité de dimensions !"); }
		else if (isEmpty(longueur) || !isPositiveOrNull(longueur) || !checkNumber(longueur,6,2)) { showWarning("La longueur est incorrecte !"); }
		else if (isEmpty(largeur) || !isPositiveOrNull(largeur) || !checkNumber(largeur,6,2)) { showWarning("La largeur est incorrecte !"); }
		else if (isEmpty(hauteur) || !isPositiveOrNull(hauteur) || !checkNumber(hauteur,6,2)) { showWarning("La hauteur est incorrecte !"); }
		else if (isEmpty(uniteVolume)) { showWarning("Veuillez sélectionner une unité de volume !"); }
		else {
			var qUniteDim = new QueryHttp("Facturation/Commun/getUnite.tmpl");
			qUniteDim.setParam("Unite_Id", uniteDimensions);
			var result = qUniteDim.execute();
			var uniteDim = result.responseXML.documentElement.getAttribute("Unite");
			
			var qUniteVol = new QueryHttp("Facturation/Commun/getUnite.tmpl");
			qUniteVol.setParam("Unite_Id", uniteVolume);
			var result = qUniteVol.execute();
			var uniteVol = result.responseXML.documentElement.getAttribute("Unite");
			
			longueur = parseFloat(longueur);
			largeur = parseFloat(largeur);
			hauteur = parseFloat(hauteur);
			
			if (uniteDim=="cm") {
				longueur = longueur / 100;
				largeur = largeur / 100;
				hauteur = hauteur / 100;
			} else if (uniteDim=="mm") {
				longueur = longueur / 1000;
				largeur = largeur / 1000;
				hauteur = hauteur / 1000;
			}
			
			var volume = longueur * largeur * hauteur;
			
			if (uniteVol=="cm³") { volume = volume * 1000000; }
			else if (uniteVol=="dm³") { volume = volume * 1000; }
			
			var nfv = new NumberFormat("0.##", false);
			volume = nfv.format(volume);
			document.getElementById('volume').value = volume;
			setModifie();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function initTVA() {
	try {

    document.getElementById('Code_TVA').value = 4;
		document.getElementById('Modifie').value = "n";
		
	} catch (e) {
    recup_erreur(e);
  }
}


function setModeTarif() {
	try {

		var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		qParam.execute(setModeTarif2);

	} catch (e) {
		recup_erreur(e);
	}
}


function setModeTarif2(httpRequest) {
  try {

    var contenu = httpRequest.responseXML.documentElement;

		if (contenu.getAttribute('Mode_Tarif')=='G') {
			document.getElementById('Grille_Tarif').collapsed = false;
			document.getElementById('Grille_Qte').collapsed = true;
		}
		else {
			document.getElementById('Grille_Tarif').collapsed = true;
			document.getElementById('Grille_Qte').collapsed = false;
		}
		
		document.getElementById('lblTarif1').value = contenu.getAttribute('Label_Tarif_1');
		document.getElementById('lblTarif2').value = contenu.getAttribute('Label_Tarif_2');
		document.getElementById('lblTarif3').value = contenu.getAttribute('Label_Tarif_3');
		document.getElementById('lblTarif4').value = contenu.getAttribute('Label_Tarif_4');
		document.getElementById('lblTarif5').value = contenu.getAttribute('Label_Tarif_5');

	} catch (e) {
		recup_erreur(e);
	}
}


function calculerRevient(recalc) {
	try {

		var pa = parseFloat(document.getElementById('Prix_Achat').value);
		var fa = parseFloat(document.getElementById('Frais_Appro').value);

		var nfs = new NumberFormat("0.00##", false);

		if (isPositiveOrNull(pa) && isPositiveOrNull(fa)) {
			document.getElementById('Prix_Revient').value = nfs.format(pa + fa);
			if (recalc) {
				calculerTarif('coeff',1);
				calculerTarif('coeff',2);
				calculerTarif('coeff',3);
				calculerTarif('coeff',4);
				calculerTarif('coeff',5);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function refreshTarifs() {
	try {

		if (document.getElementById('Action').value=='M') {
			init_tree_tarifs();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function calculerTarif(origine,tarif) {
	try {

		var nf = new NumberFormat("0.00", false);
		var nf6 = new NumberFormat("0.######", false);

		var pr = parseFloat(document.getElementById('Prix_Revient').value);
		var tva = parseFloat(getTva(document.getElementById('Code_TVA').value))/100 + 1;

		if (origine=="ht") {
			var pvht = parseFloat(document.getElementById('Tarif_'+tarif).value);
			document.getElementById('Coeff_'+tarif).value = nf6.format(pvht / pr);
			document.getElementById('Tarif_'+tarif+'_TTC').value = nf.format(pvht * tva);
			document.getElementById('Marge_'+tarif).value = (pvht==0?100:nf.format((pvht-pr)/pvht * 100));
		}
		else if (origine=="coeff") {
			var pvht = parseFloat(document.getElementById('Coeff_'+tarif).value) * pr;
			document.getElementById('Tarif_'+tarif).value = nf.format(pvht);
			document.getElementById('Tarif_'+tarif+'_TTC').value = nf.format(pvht * tva);
			document.getElementById('Marge_'+tarif).value = (pvht==0?100:nf.format((pvht-pr)/pvht * 100));
		}
		else if (origine=="ttc") {
			var pvht = parseFloat(document.getElementById('Tarif_'+tarif+'_TTC').value) / tva;
			document.getElementById('Tarif_'+tarif).value = nf.format(pvht);
			document.getElementById('Coeff_'+tarif).value = nf6.format(pvht / pr);
			document.getElementById('Marge_'+tarif).value = (pvht==0?100:nf.format((pvht-pr)/pvht * 100));
		}
		else {
			if (parseFloat(document.getElementById('Marge_'+tarif).value)>=100) {
				showWarning("Le pourcentage de marge doit être inférieur à 100 % !");
			}
			else {
				var pvht = pr / (1 - parseFloat(document.getElementById('Marge_'+tarif).value)/100);
				document.getElementById('Tarif_'+tarif).value = nf.format(pvht);
				document.getElementById('Coeff_'+tarif).value = (pr==0?0:nf6.format(pvht / pr));
				document.getElementById('Tarif_'+tarif+'_TTC').value = nf.format(pvht * tva);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function validerLigne() {
  try {

		var article_id = document.getElementById("Article").value;

		var quantite = document.getElementById('Quantite_Ligne').value;
		var prix = document.getElementById('Prix_Ligne').value;
		var prix_ttc = document.getElementById('Prix_Ligne_TTC').value;
		var lib_ext = document.getElementById('Lib_Ext').value;
		var lib_int = document.getElementById('Lib_Int').value;
		var coeff = document.getElementById('Coeff_Ligne').value;
		var marge = document.getElementById('Marge_Ligne').value;
		var tarif_id = document.getElementById('Tarif_Id').value;

		if (isEmpty(prix) || !isPositiveOrNull(prix) || !checkDecimal(prix,4)) {
			showWarning("Prix HT incorrect !");
		}
		else if (isEmpty(prix_ttc) || !isPositiveOrNull(prix_ttc) || !checkDecimal(prix_ttc,4)) {
			showWarning("Prix TTC incorrect !");
		}
		else if (!checkQte(quantite)) {
			showWarning("Quantité incorrecte !");
		}
		else if (document.getElementById('Base_Calcul').checked && (isEmpty(coeff) || !isPositive(coeff))) {
			showWarning("Coefficient incorrect !");
		}
		else if (document.getElementById('Base_Calcul').checked && (isEmpty(marge) || !isPositiveOrNull(marge))) {
			showWarning("Marge incorrect !");
		}
		else if (document.getElementById('Prix_Revient').value <= 0) {
			showWarning("Le prix de revient doit être supérieur à 0 !");
		}
		else {

			var qSaveTarif;

			if (isEmpty(tarif_id)) {
				qSaveTarif = new QueryHttp("Facturation/Stocks/ajouterTarifQte.tmpl");
			}
			else {
				qSaveTarif = new QueryHttp("Facturation/Stocks/modifierTarifQte.tmpl");
				qSaveTarif.setParam('Tarif_Id', tarif_id);
			}

			qSaveTarif.setParam('Article_Id', article_id);
			qSaveTarif.setParam('Quantite', quantite);
			qSaveTarif.setParam('Prix', prix);
			qSaveTarif.setParam('Lib_Ext', lib_ext);
			qSaveTarif.setParam('Lib_Int', lib_int);
			qSaveTarif.setParam('Coeff', coeff);
			qSaveTarif.setParam('Marge', marge);
			qSaveTarif.setParam('Prix_TTC', prix_ttc);
			qSaveTarif.execute();

			init_tree_tarifs();

			annulerLigne();
		}

  } catch (e) {
  	recup_erreur(e);
	}
}


function changeModeTarifQte() {
  try {

		if (document.getElementById('Base_Calcul').checked) {
			document.getElementById('ColMarge').collapsed = false;
			document.getElementById('ColCoeff').collapsed = false;
			document.getElementById('Marge_Ligne').collapsed = false;
			document.getElementById('Coeff_Ligne').collapsed = false;
			document.getElementById('Box_Achat').collapsed = false;
		}
		else {
			document.getElementById('ColMarge').collapsed = true;
			document.getElementById('ColCoeff').collapsed = true;
			document.getElementById('Marge_Ligne').collapsed = true;
			document.getElementById('Coeff_Ligne').collapsed = true;
			document.getElementById('Box_Achat').collapsed = true;
			if (document.getElementById('Prix_Revient').value <= 0) {
				document.getElementById('Prix_Achat').value = 1;
				calculerRevient(true);
				calculerLigne("h");
			}
		}

		init_tree_tarifs();

	} catch (e) {
  	recup_erreur(e);
	}
}


function annulerLigne() {
  try {

		document.getElementById('Lib_Int').value = "";
		document.getElementById('Lib_Ext').value = "";
		document.getElementById('Quantite_Ligne').value = "";
		document.getElementById('Prix_Ligne').value = "";
		document.getElementById('Marge_Ligne').value = "";
		document.getElementById('Coeff_Ligne').value = "";
		document.getElementById('Prix_Ligne_TTC').value = "";
		document.getElementById('Tarif_Id').value = "";
		document.getElementById('bSupprimerPrix').disabled = true;

	} catch (e) {
  	recup_erreur(e);
	}
}


function calculerLigne(t) {
  try {

		var nf = new NumberFormat("0.00", false);
		var nf6 = new NumberFormat("0.######", false);

		var tva = parseFloat(getTva(document.getElementById('Code_TVA').value))/100 + 1;

		var pr = document.getElementById('Prix_Revient').value;

		if (t=="h") {
			var pvht = parseFloat(document.getElementById('Prix_Ligne').value);
			document.getElementById('Coeff_Ligne').value = nf6.format(pvht / pr);
			document.getElementById('Prix_Ligne_TTC').value = nf.format(pvht * tva);
			document.getElementById('Marge_Ligne').value = (pvht==0?100:nf.format((pvht-pr)/pvht * 100));
		}
		else if (t=="c") {
			var pvht = parseFloat(document.getElementById('Coeff_Ligne').value) * pr;
			document.getElementById('Prix_Ligne').value = nf.format(pvht);
			document.getElementById('Prix_Ligne_TTC').value = nf.format(pvht * tva);
			document.getElementById('Marge_Ligne').value = (pvht==0?100:nf.format((pvht-pr)/pvht * 100));
		}
		else if (t=="t") {
			var pvht = parseFloat(document.getElementById('Prix_Ligne_TTC').value) / tva;
			document.getElementById('Prix_Ligne').value = nf.format(pvht);
			document.getElementById('Coeff_Ligne').value = nf6.format(pvht / pr);
			document.getElementById('Marge_Ligne').value = (pvht==0?100:nf.format((pvht-pr)/pvht * 100));
		}
		else if (t=="m") {

			if (parseFloat(document.getElementById('Marge_Ligne').value)>=100) {
				showWarning("Le pourcentage de marge doit être inférieur à 100 % !");
			}
			else {
				var pvht = pr / (1 - parseFloat(document.getElementById('Marge_Ligne').value)/100);
				document.getElementById('Prix_Ligne').value = nf.format(pvht);
				document.getElementById('Coeff_Ligne').value = (pr==0?0:nf6.format(pvht / pr));
				document.getElementById('Prix_Ligne_TTC').value = nf.format(pvht * tva);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function reporterLigne() {
  try {

		var tree = document.getElementById('tarifs_qte');

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById('Lib_Int').value = getCellText(tree,tree.currentIndex,'ColLibInt');
			document.getElementById('Lib_Ext').value = getCellText(tree,tree.currentIndex,'ColLibExt');
			document.getElementById('Quantite_Ligne').value = getCellText(tree,tree.currentIndex,'ColQuantite');
			document.getElementById('Prix_Ligne').value = getCellText(tree,tree.currentIndex,'ColHT');
			document.getElementById('Marge_Ligne').value = getCellText(tree,tree.currentIndex,'ColMarge');
			document.getElementById('Coeff_Ligne').value = getCellText(tree,tree.currentIndex,'ColCoeff');
			document.getElementById('Prix_Ligne_TTC').value = getCellText(tree,tree.currentIndex,'ColTTC');
			document.getElementById('Tarif_Id').value = getCellText(tree,tree.currentIndex,'ColTarif_Id');
			document.getElementById('bSupprimerPrix').disabled = false;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function supprimerLigne() {
  try {

		var qSupTarifQte = new QueryHttp("Facturation/Stocks/supprimerTarifQte.tmpl");
		qSupTarifQte.setParam('Tarif_Id', document.getElementById("Tarif_Id").value);
    qSupTarifQte.execute();

   	init_tree_tarifs();
		annulerLigne();

	} catch (e) {
  	recup_erreur(e);
	}
}


function disableBoutons(b) {
  try {

		document.getElementById('bAnnuler').disabled = b;
		document.getElementById('bValider').disabled = b;
		document.getElementById('bSupprimerPrix').disabled = b;

		document.getElementById('Base_Calcul').disabled = b;

	} catch (e) {
  	recup_erreur(e);
	}
}


function init_tree_tarifs() {
  try {

    var article_id = document.getElementById("Article").value;
		var tva = getTva(document.getElementById('Code_TVA').value);

		aTarifs.setParam('Article_Id', article_id);
		aTarifs.setParam('Taux_TVA', tva);

		if (document.getElementById('Base_Calcul').checked) {
			aTarifs.setParam('Prix_Achat', document.getElementById('Prix_Revient').value);
		}

    aTarifs.initTree();

  } catch (e) {
    recup_erreur(e);
  }
}


function delete_tree_tarifs() {
  try {

		aTarifs.deleteTree();

	} catch (e) {
    recup_erreur(e);
  }
}


function rechcompte(id) {
	try {

    setModifie();

		var debCompte="";
		var nom="";
    switch (id) {
    	case 'Compte_Vente_National':
    		debCompte="7";
        nom="VENTE";
        break;
    	case 'Compte_Vente_UE':
    		debCompte="7";
        nom="VENTE UE";
        break;
      case 'Compte_Vente_Nat_UE':
    		debCompte="7";
        nom="VENTE UE";
        break;
    	case 'Compte_Vente_International':
  			debCompte="7";
        nom="VENTE INTERNATIONAL";
        break;
      case 'Compte_Achat_National':
  			debCompte="6";
        nom="ACHAT";
        break;
      case 'Compte_Achat_UE':
  			debCompte="6";
        nom="ACHAT UE";
        break;
      case 'Compte_Achat_International':
  			debCompte="6";
        nom="ACHAT INTERNATIONAL";
        break;
    }
    currentChampCompte = id;
    var url ="chrome://opensi/content/config/util/rechcompte.xul?"+ cookie();
    url += "&Type_Compte=G";
		url += "&Force_Deb="+ debCompte;
    url += "&nom="+ urlEncode(nom);
    url += "&Creer=false";
    url += "&Num_Compte="+ urlEncode(debCompte);
    window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherCompte);

	} catch (e) {
		recup_erreur(e);
	}
}


function retourRechercherCompte(numCompte) {
	try {
		document.getElementById(currentChampCompte).value = numCompte;
		currentChampCompte = "";
	} catch (e) {
		recup_erreur(e);
	}
}


function existeCompteArticle(article_id, code_tva) {
	try {
		var qExistCA = new QueryHttp("Facturation/Stocks/existeCompteArticle.tmpl");
		qExistCA.setParam("Article_Id", article_id);
		qExistCA.setParam("Code_TVA", code_tva);
		var result = qExistCA.execute();
		var existe = (result.responseXML.documentElement.getAttribute('existe') == "true");
		return existe;
	} catch (e) {
		recup_erreur(e);
	}
}


function existeCompteArticleNatUE(article_id, code_pays, code_tva) {
	try {
		var qExistCA = new QueryHttp("Facturation/Stocks/existeCompteArticleNatUE.tmpl");
		qExistCA.setParam("Article_Id", article_id);
		qExistCA.setParam("Code_Pays", code_pays);
		qExistCA.setParam("Code_TVA", code_tva);
		var result = qExistCA.execute();
		var existe = (result.responseXML.documentElement.getAttribute('existe') == "true");
		return existe;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnComptesArticlesNational() {
	try {
		var tree = document.getElementById('liste_comptes_articles_national');
		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("Code_TVA_National").value = getCellText(tree,tree.currentIndex,'ColCode_TVA_National');
			document.getElementById("Taux_TVA_National").value = getCellText(tree,tree.currentIndex,'ColTaux_TVA_National');
			document.getElementById("Compte_Achat_National").value = getCellText(tree,tree.currentIndex,'ColCompte_Achat_National');
			document.getElementById("Compte_Vente_National").value = getCellText(tree,tree.currentIndex,'ColCompte_Vente_National');
			
			document.getElementById("Aplus_National").disabled=false;
			document.getElementById("Amoins_National").disabled=false;
			document.getElementById("Vplus_National").disabled=false;
			document.getElementById("Vmoins_National").disabled=false;
			document.getElementById("bValiderCompte_National").disabled=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function validerCompteArticleNational() {
	try {

		if (isEmpty(document.getElementById('Code_TVA_National').value)) {
			showWarning("Veuillez sélectionner un taux de TVA !");
		} else {
			var code_tva = document.getElementById("Code_TVA_National").value;
			var compte_achat = document.getElementById("Compte_Achat_National").value;
			var compte_vente = document.getElementById("Compte_Vente_National").value;

			if (isEmpty(compte_achat) && isEmpty(compte_vente)) {
				// Suppression compte article
				var qSupprCA = new QueryHttp("Facturation/Stocks/supprimerCompteArticle.tmpl");
				qSupprCA.setParam("Article_Id", document.getElementById('Article').value);
				qSupprCA.setParam("Code_TVA", code_tva);
				qSupprCA.execute();
			} else {
				var qCF;
				if (existeCompteArticle(document.getElementById('Article').value, code_tva)) {
					// modifier compte article
					qCA = new QueryHttp("Facturation/Stocks/modifierCompteArticle.tmpl");
				} else {
					// nouveau compte article
					qCA = new QueryHttp("Facturation/Stocks/ajouterCompteArticle.tmpl");
				}

				qCA.setParam("Article_Id", document.getElementById('Article').value);
				qCA.setParam("Code_TVA", code_tva);
				qCA.setParam("Compte_Achat", compte_achat);
				qCA.setParam("Compte_Vente", compte_vente);
				qCA.execute();
			}
			
			document.getElementById("Aplus_National").disabled=true;
			document.getElementById("Amoins_National").disabled=true;
			document.getElementById("Vplus_National").disabled=true;
			document.getElementById("Vmoins_National").disabled=true;
			document.getElementById("bValiderCompte_National").disabled=true;

			initComptesNational();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function desactiverComptesNational() {
	try {
		document.getElementById("Code_TVA_National").value = "";
		document.getElementById("Taux_TVA_National").value = "";
		document.getElementById("Compte_Achat_National").value = "";
		document.getElementById("Compte_Vente_National").value = "";

		document.getElementById("liste_comptes_articles_national").disabled=true;
		document.getElementById("Aplus_National").disabled=true;
		document.getElementById("Amoins_National").disabled=true;
		document.getElementById("Vplus_National").disabled=true;
		document.getElementById("Vmoins_National").disabled=true;
		document.getElementById("bValiderCompte_National").disabled=true;
		aComptesNational.deleteTree();
		desactiverComptesUE();
	} catch (e) {
		recup_erreur(e);
	}
}


function activerComptesNational() {
	try {
		document.getElementById("liste_comptes_articles_national").disabled=false;

		initComptesNational();
	} catch (e) {
		recup_erreur(e);
	}
}


function initComptesNational() {
	try {
		document.getElementById("Code_TVA_National").value = "";
		document.getElementById("Taux_TVA_National").value = "";
		document.getElementById("Compte_Achat_National").value = "";
		document.getElementById("Compte_Vente_National").value = "";

		aComptesNational.clearParams();
		aComptesNational.setParam('Article_Id', articleId);
		aComptesNational.setParam('National', 1);
		aComptesNational.initTree(activerComptesUE);
	} catch (e) {
		recup_erreur(e);
	}
}



function pressOnComptesArticlesUE() {
	try {
		var tree = document.getElementById('liste_comptes_articles_ue');
		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("Code_TVA_UE").value = getCellText(tree,tree.currentIndex,'ColCode_TVA_UE');
			document.getElementById("Taux_TVA_UE").value = getCellText(tree,tree.currentIndex,'ColTaux_TVA_UE');
			document.getElementById("Code_Pays_UE").value = getCellText(tree,tree.currentIndex,'ColCode_Pays_UE');
			document.getElementById("Pays_UE").value = getCellText(tree,tree.currentIndex,'ColPays_UE');
			document.getElementById("Compte_Achat_UE").value = getCellText(tree,tree.currentIndex,'ColCompte_Achat_UE');
			document.getElementById("Compte_Vente_UE").value = getCellText(tree,tree.currentIndex,'ColCompte_Vente_UE');
			
			document.getElementById("Aplus_UE").disabled=false;
			document.getElementById("Amoins_UE").disabled=false;
			document.getElementById("Vplus_UE").disabled=false;
			document.getElementById("Vmoins_UE").disabled=false;
			document.getElementById("bValiderCompte_UE").disabled=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}




function validerCompteArticleUE() {
	try {

		if (isEmpty(document.getElementById('Code_Pays_UE').value)) {
			showWarning("Veuillez sélectionner un pays !");
		}
		else {
			var code_tva = document.getElementById("Code_TVA_UE").value;
			var compteAchat = document.getElementById("Compte_Achat_UE").value;
			var compte_vente = document.getElementById("Compte_Vente_UE").value;

			if (isEmpty(compteAchat) && isEmpty(compte_vente)) {
				// Suppression compte article
				var qSupprCA = new QueryHttp("Facturation/Stocks/supprimerCompteArticle.tmpl");
				qSupprCA.setParam("Article_Id", document.getElementById('Article').value);
				qSupprCA.setParam("Code_TVA", code_tva);
				qSupprCA.execute();
			} else {
				var qCA;
				if (existeCompteArticle(document.getElementById('Article').value, code_tva)) {
					// modifier compte article
					qCA = new QueryHttp("Facturation/Stocks/modifierCompteArticle.tmpl");
				} else {
					// nouveau compte article
					qCA = new QueryHttp("Facturation/Stocks/ajouterCompteArticle.tmpl");
				}

				qCA.setParam("Article_Id", document.getElementById('Article').value);
				qCA.setParam("Code_TVA", code_tva);
				qCA.setParam("Compte_Achat", compteAchat);
				qCA.setParam("Compte_Vente", compte_vente);
				qCA.execute();
			}
			
			document.getElementById("Aplus_UE").disabled=true;
			document.getElementById("Amoins_UE").disabled=true;
			document.getElementById("Vplus_UE").disabled=true;
			document.getElementById("Vmoins_UE").disabled=true;
			document.getElementById("bValiderCompte_UE").disabled=true;

			initComptesUE();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function desactiverComptesUE() {
	try {
		document.getElementById("Code_TVA_UE").value = "";
		document.getElementById("Taux_TVA_UE").value = "";
		document.getElementById("Code_Pays_UE").value = "";
		document.getElementById("Pays_UE").value = "";
		document.getElementById("Compte_Achat_UE").value = "";
		document.getElementById("Compte_Vente_UE").value = "";

		document.getElementById("liste_comptes_articles_ue").disabled=true;
		document.getElementById("Aplus_UE").disabled=true;
		document.getElementById("Amoins_UE").disabled=true;
		document.getElementById("Vplus_UE").disabled=true;
		document.getElementById("Vmoins_UE").disabled=true;
		document.getElementById("bValiderCompte_UE").disabled=true;
		aComptesUE.deleteTree();
		desactiverComptesNatUE();
	} catch (e) {
		recup_erreur(e);
	}
}


function desactiverComptesNatUE() {
	try {
		document.getElementById("Code_TVA_Nat_UE").value = "";
		document.getElementById("Taux_TVA_Nat_UE").value = "";
		document.getElementById("Code_Pays_Nat_UE").value = "";
		document.getElementById("Pays_Nat_UE").value = "";
		document.getElementById("Compte_Vente_Nat_UE").value = "";

		document.getElementById("liste_comptes_articles_nat_ue").disabled=true;
		document.getElementById("Vplus_Nat_UE").disabled=true;
		document.getElementById("Vmoins_Nat_UE").disabled=true;
		document.getElementById("bValiderCompte_Nat_UE").disabled=true;
		aComptesNatUE.deleteTree();
		desactiverComptesInternational();
	} catch (e) {
		recup_erreur(e);
	}
}


function activerComptesUE() {
	try {
		document.getElementById("liste_comptes_articles_ue").disabled=false;

		initComptesUE();
	} catch (e) {
		recup_erreur(e);
	}
}


function initComptesUE() {
	try {
		document.getElementById("Code_TVA_UE").value = "";
		document.getElementById("Taux_TVA_UE").value = "";
		document.getElementById("Code_Pays_UE").value = "";
		document.getElementById("Pays_UE").value = "";
		document.getElementById("Compte_Achat_UE").value = "";
		document.getElementById("Compte_Vente_UE").value = "";

		aComptesUE.clearParams();
		aComptesUE.setParam('Article_Id', articleId);
		aComptesUE.setParam('UE', 1);
		aComptesUE.initTree(activerComptesNatUE);
	} catch (e) {
		recup_erreur(e);
	}
}


function activerComptesNatUE() {
	try {
		document.getElementById("liste_comptes_articles_nat_ue").disabled=false;
		
		initComptesNatUE();
	} catch (e) {
		recup_erreur(e);
	}
}


function initComptesNatUE() {
	try {
		document.getElementById("Code_TVA_Nat_UE").value = "";
		document.getElementById("Taux_TVA_Nat_UE").value = "";
		document.getElementById("Code_Pays_Nat_UE").value = "";
		document.getElementById("Pays_Nat_UE").value = "";
		document.getElementById("Compte_Vente_Nat_UE").value = "";

		aComptesNatUE.clearParams();
		aComptesNatUE.setParam('Article_Id', articleId);
		aComptesNatUE.initTree(activerComptesInternational);
	} catch (e) {
		recup_erreur(e);
	}
}




function pressOnComptesArticlesNatUE() {
	try {
		var tree = document.getElementById('liste_comptes_articles_nat_ue');
		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("Code_TVA_Nat_UE").value = getCellText(tree,tree.currentIndex,'ColCode_TVA_Nat_UE');
			document.getElementById("Taux_TVA_Nat_UE").value = getCellText(tree,tree.currentIndex,'ColTaux_TVA_Nat_UE');
			document.getElementById("Code_Pays_Nat_UE").value = getCellText(tree,tree.currentIndex,'ColCode_Pays_Nat_UE');
			document.getElementById("Pays_Nat_UE").value = getCellText(tree,tree.currentIndex,'ColPays_Nat_UE');
			document.getElementById("Compte_Vente_Nat_UE").value = getCellText(tree,tree.currentIndex,'ColCompte_Vente_Nat_UE');
			
			document.getElementById("Vplus_Nat_UE").disabled=false;
			document.getElementById("Vmoins_Nat_UE").disabled=false;
			document.getElementById("bValiderCompte_Nat_UE").disabled=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function validerCompteArticleNatUE() {
	try {

		if (isEmpty(document.getElementById('Code_Pays_Nat_UE').value)) {
			showWarning("Veuillez sélectionner un pays !");
		}
		else {
			var code_pays = document.getElementById("Code_Pays_Nat_UE").value;
			var code_tva = document.getElementById("Code_TVA_Nat_UE").value;
			var compte_vente = document.getElementById("Compte_Vente_Nat_UE").value;

			if (isEmpty(compte_vente)) {
				// Suppression compte article
				var qSupprCA = new QueryHttp("Facturation/Stocks/supprimerCompteArticleNatUE.tmpl");
				qSupprCA.setParam("Article_Id", document.getElementById('Article').value);
				qSupprCA.setParam("Code_Pays", code_pays);
				qSupprCA.setParam("Code_TVA", code_tva);
				qSupprCA.execute();
			} else {
				var qCA;
				if (existeCompteArticleNatUE(document.getElementById('Article').value, code_pays, code_tva)) {
					// modifier compte article
					qCA = new QueryHttp("Facturation/Stocks/modifierCompteArticleNatUE.tmpl");
				} else {
					// nouveau compte article
					qCA = new QueryHttp("Facturation/Stocks/ajouterCompteArticleNatUE.tmpl");
				}

				qCA.setParam("Article_Id", document.getElementById('Article').value);
				qCA.setParam("Code_Pays", code_pays);
				qCA.setParam("Code_TVA", code_tva);
				qCA.setParam("Compte_Vente", compte_vente);
				qCA.execute();
			}
			
			document.getElementById("Vplus_Nat_UE").disabled=true;
			document.getElementById("Vmoins_Nat_UE").disabled=true;
			document.getElementById("bValiderCompte_Nat_UE").disabled=true;

			initComptesNatUE();
		}

	} catch (e) {
		recup_erreur(e);
	}
}



function pressOnComptesArticlesInternational() {
	try {
		var tree = document.getElementById('liste_comptes_articles_international');
		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("Code_TVA_International").value = getCellText(tree,tree.currentIndex,'ColCode_TVA_International');
			document.getElementById("Code_Pays_International").value = getCellText(tree,tree.currentIndex,'ColCode_Pays_International');
			document.getElementById("Pays_International").value = getCellText(tree,tree.currentIndex,'ColPays_International');
			document.getElementById("Compte_Achat_International").value =  getCellText(tree,tree.currentIndex,'ColCompte_Achat_International');
			document.getElementById("Compte_Vente_International").value =  getCellText(tree,tree.currentIndex,'ColCompte_Vente_International');
			
			document.getElementById("Aplus_International").disabled=false;
			document.getElementById("Amoins_International").disabled=false;
			document.getElementById("Vplus_International").disabled=false;
			document.getElementById("Vmoins_International").disabled=false;
			document.getElementById("bValiderCompte_International").disabled=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}




function validerCompteArticleInternational() {
	try {

		if (isEmpty(document.getElementById('Code_Pays_International').value)) {
			showWarning("Veuillez choisir un pays !");
		}
		else {
			var code_pays = document.getElementById('Code_Pays_International').value;
			var code_tva = document.getElementById('Code_TVA_International').value;
			var compteAchat = document.getElementById("Compte_Achat_International").value;
			var compte_vente = document.getElementById("Compte_Vente_International").value;

			if (isEmpty(compteAchat) && isEmpty(compte_vente)) {
				// Suppression compte article
				var qSupprCA = new QueryHttp("Facturation/Stocks/supprimerCompteArticle.tmpl");
				qSupprCA.setParam("Article_Id", document.getElementById('Article').value);
				qSupprCA.setParam("Code_TVA", code_tva);
				qSupprCA.execute();
			} else {
				var qCA;
				if (existeCompteArticle(document.getElementById('Article').value, code_tva)) {
					// modifier compte article
					qCA = new QueryHttp("Facturation/Stocks/modifierCompteArticle.tmpl");
				} else {
					// nouveau compte article
					qCA = new QueryHttp("Facturation/Stocks/ajouterCompteArticle.tmpl");
				}

				qCA.setParam("Article_Id", document.getElementById('Article').value);
				qCA.setParam("Code_TVA", code_tva);
				qCA.setParam("Compte_Achat", compteAchat);
				qCA.setParam("Compte_Vente", compte_vente);
				qCA.execute();
			}
			
			document.getElementById("Aplus_International").disabled=true;
			document.getElementById("Amoins_International").disabled=true;
			document.getElementById("Vplus_International").disabled=true;
			document.getElementById("Vmoins_International").disabled=true;
			document.getElementById("bValiderCompte_International").disabled=true;

			initComptesInternational();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function desactiverComptesInternational() {
	try {
		document.getElementById("Code_TVA_International").value = "";
		document.getElementById("Code_Pays_International").value = "";
		document.getElementById("Pays_International").value = value = "";
		document.getElementById("Compte_Achat_International").value = "";
		document.getElementById("Compte_Vente_International").value = "";

		document.getElementById("liste_comptes_articles_international").disabled=true;
		document.getElementById("Aplus_International").disabled=true;
		document.getElementById("Amoins_International").disabled=true;
		document.getElementById("Vplus_International").disabled=true;
		document.getElementById("Vmoins_International").disabled=true;
		document.getElementById("bValiderCompte_International").disabled=true;
		aComptesInternational.deleteTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function activerComptesInternational() {
	try {
		document.getElementById("liste_comptes_articles_international").disabled=false;

		initComptesInternational();
	} catch (e) {
		recup_erreur(e);
	}
}


function initComptesInternational() {
	try {
		document.getElementById("Code_TVA_International").value = "";
		document.getElementById("Code_Pays_International").value = "";
		document.getElementById("Pays_International").value = value = "";
		document.getElementById("Compte_Achat_International").value = "";
		document.getElementById("Compte_Vente_International").value = "";

		aComptesInternational.clearParams();
		aComptesInternational.setParam('Article_Id', articleId);
		aComptesInternational.setParam('International', 1);
		aComptesInternational.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}



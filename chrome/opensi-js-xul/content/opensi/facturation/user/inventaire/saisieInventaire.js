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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");


var aArtInv = new Arbre('Facturation/GetRDF/liste-articlesInventaire.tmpl', 'tree-articlesInventaire');
var aFamille1 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_1');
var aFamille2 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_2');
var aFamille3 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_3');
var aMarques = new Arbre("Facturation/GetRDF/combo-marquesArticle.tmpl", "Marque");
var qNbPage = new QueryHttp("Facturation/Inventaire/getNbPage.tmpl");

var inventaireId;
var ligneId = 0;
var methode = 'A';
var currentIndex = -1;
var currentPage = 1;
var nbPage = 1;
var indexArticle = 0;
var typeInventaire;
var etat;

var pMarque = "0";
var pFamille1 = "0";
var pFamille2 = "0";
var pFamille3 = "0";

var tree;


function init() {
  try {

		tree = document.getElementById('tree-articlesInventaire');

		document.getElementById('Article_Id').focus();

		var nf = new NumberFormat('00000', false);

		inventaireId = ParamValeur('Inventaire_Id');

		document.getElementById('Num_Inventaire').value = nf.format(inventaireId);

		var qInv = new QueryHttp("Facturation/Inventaire/getInventaire.tmpl");
		qInv.setParam('Inventaire_Id', inventaireId);
		var result = qInv.execute();

		var contenu = result.responseXML.documentElement;

		etat = contenu.getAttribute('Etat');
		typeInventaire = contenu.getAttribute('Type_Inventaire');

		if (typeInventaire=='P') {

			pMarque = contenu.getAttribute('Marque');
			pFamille1 = contenu.getAttribute('Famille_1');
			pFamille2 = contenu.getAttribute('Famille_2');
			pFamille3 = contenu.getAttribute('Famille_3');

			aMarques.initTree(initMarque);
			aFamille1.initTree(initFamille1);

			if (pMarque != "0") {
				aArtInv.setParam('Marque', pMarque);
				qNbPage.setParam('Marque', pMarque);
			}

			if (pFamille1 != "0") {
				aArtInv.setParam('Famille_1', pFamille1);
				qNbPage.setParam('Famille_1', pFamille1);
				
				if (pFamille2 != "0") {
					aArtInv.setParam('Famille_2', pFamille2);
					qNbPage.setParam('Famille_2', pFamille2);
					
					if (pFamille3 != "0") {
						aArtInv.setParam('Famille_3', pFamille3);
						qNbPage.setParam('Famille_3', pFamille3);
					}
				}
			}

			document.getElementById('Marque').disabled = true;
			document.getElementById('Famille_1').disabled = true;
			document.getElementById('Famille_2').disabled = true;
			document.getElementById('Famille_3').disabled = true;
		}
		else {
			aMarques.initTree(initMarque);
			aFamille1.initTree(initFamille1);
		}

		if (etat=='C' || etat=='A') {
			document.getElementById('Article_Id').disabled = true;
			document.getElementById('Designation').disabled = true;
			document.getElementById('Qte_Theorique').disabled = true;
			document.getElementById('Qte_Inventaire').disabled = true;
			document.getElementById('bValiderLigne').disabled = true;
			document.getElementById('Methode').disabled = true;
			document.getElementById('bAnnuler').disabled = true;
			document.getElementById('bCloturer').disabled = true;
		}
		if (etat!='C') {
			document.getElementById('bEditerInventaire').disabled = true;
		}

		qNbPage.setParam('Inventaire_Id', inventaireId);

		setNbPage();

		aArtInv.setParam('Inventaire_Id', inventaireId);
		aArtInv.setParam('Num_Page', currentPage);
		aArtInv.initTree();

  } catch (e) {
    recup_erreur(e);
  }
}


function initFamille1() {
  try {

		document.getElementById('Famille_1').value = pFamille1;
		chargerFamilles2();

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles2() {
	try {
  	
		aFamille2.setParam('Parent_Id', document.getElementById('Famille_1').value);
		aFamille2.initTree(initFamille2);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille2() {
  try {

		document.getElementById('Famille_2').value = pFamille2;
		chargerFamilles3();

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles3() {
	try {
  	
		aFamille3.setParam('Parent_Id', document.getElementById('Famille_2').value);
		aFamille3.initTree(initFamille3);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille3() {
  try {

		document.getElementById('Famille_3').value = pFamille3;

	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnFamille1() {
  try {
  	document.getElementById('Famille_2').selectedIndex = 0;
  	document.getElementById('Famille_3').selectedIndex = 0;
  	pFamille2 = "0";
  	pFamille3 = "0";
		chargerFamilles2();
		switchSelection();

  } catch (e) {
    recup_erreur(e);
  }
}

function pressOnFamille2() {
  try {

  	document.getElementById('Famille_3').selectedIndex = 0;
  	pFamille3 = "0";
		chargerFamilles3();
		switchSelection();

  } catch (e) {
    recup_erreur(e);
  }
}



function initMarque() {
	try {

		document.getElementById('Marque').value = pMarque;

	} catch (e) {
    recup_erreur(e);
  }
}





function setNbPage() {
  try {

		result = qNbPage.execute();

		nbPage = result.responseXML.documentElement.getAttribute('Nb_Page');

		document.getElementById('Nb_Page').value = nbPage;
		document.getElementById('Num_Page').value = 1;

		document.getElementById('bPagePrec').disabled = true;
		document.getElementById('bPageSuiv').disabled = (nbPage==1);

	} catch (e) {
    recup_erreur(e);
  }
}


function validerLigneInventaire() {
  try {

  	if (etat!='C' && etat!='A') {

			var qteInventaire = document.getElementById('Qte_Inventaire').value;

			if (ligneId==0) {
				showWarning("Veuillez sélectionner un article");
			}
			else if (isEmpty(qteInventaire) || isNaN(qteInventaire)) {
				showWarning("Quantité incorrecte");
			}
			else {
				var qValider = new QueryHttp("Facturation/Inventaire/validerLigneInventaire.tmpl");
				qValider.setParam('Qte_Inventaire', qteInventaire);
				qValider.setParam('Ligne_Id', ligneId);
				qValider.execute();

				viderLigne();

				if (methode=='A') {
					document.getElementById('Article_Id').focus();
					aArtInv.initTree(toLigneArticle);
				}
				else {
					if (currentPage<nbPage && tree.view!=null && tree.view.rowCount==currentIndex+1) {
						decalerPage(1);
					}
					else {
						aArtInv.initTree(selectLigneSuivante);
					}
				}
			}
  	}

	} catch (e) {
    recup_erreur(e);
  }
}


function selectLigneSuivante() {
  try {

		if (tree.view!=null && tree.view.rowCount>currentIndex+1) {
			tree.view.selection.select(currentIndex+1);
			document.getElementById('tree-articlesInventaire').treeBoxObject.ensureRowIsVisible(currentIndex+1);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function toLigneArticle() {
  try {

		if (tree.view!=null && tree.view.rowCount>indexArticle) {
			document.getElementById('tree-articlesInventaire').treeBoxObject.ensureRowIsVisible(indexArticle);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function reporterLigneInventaire() {
  try {

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById('Article_Id').value = getCellText(tree, tree.currentIndex, 'ColArticle_Id');
			document.getElementById('Designation').value = getCellText(tree, tree.currentIndex, 'ColDesignation');
			document.getElementById('Qte_Theorique').value = getCellText(tree, tree.currentIndex, 'ColQte_Theorique');
			document.getElementById('Qte_Inventaire').value = getCellText(tree, tree.currentIndex, 'ColQte_Theorique');
			ligneId = getCellText(tree, tree.currentIndex, 'ColLigne_Id');

			currentIndex = tree.currentIndex;
			indexArticle = currentIndex;

			document.getElementById('Qte_Inventaire').select();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnQteInventaire(ev) {
  try {

		if (ev.keyCode==13) {
			validerLigneInventaire();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function cloturerInventaire() {
  try {

		var qComplet = new QueryHttp("Facturation/Inventaire/inventaireComplet.tmpl");
		qComplet.setParam('Inventaire_Id', inventaireId);
		var result = qComplet.execute();

		if (result.responseXML.documentElement.getAttribute('Complet')==0 && window.confirm("L'inventaire est incomplet, voulez-vous quand même clôturer cet inventaire ?")
					|| result.responseXML.documentElement.getAttribute('Complet')==1 && window.confirm("Confirmez-vous la clôture de l'inventaire ?")) {

			disableAll();
			
			var qCloturer = new QueryHttp("Facturation/Inventaire/cloturerInventaire.tmpl");
			qCloturer.setParam('Inventaire_Id', inventaireId);
			qCloturer.execute();

			retourMenuInventaire();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function disableAll() {
	try {
		document.getElementById('Marque').disabled=true;
		document.getElementById('Famille_1').disabled=true;
		document.getElementById('Famille_2').disabled=true;
		document.getElementById('Famille_3').disabled=true;
		document.getElementById('bPagePrec').disabled=true;
		document.getElementById('Num_Page').disabled=true;
		document.getElementById('bPageSuiv').disabled=true;
		document.getElementById('tree-articlesInventaire').disabled=true;
		document.getElementById('Article_Id').disabled=true;
		document.getElementById('Designation').disabled=true;
		document.getElementById('Qte_Theorique').disabled=true;
		document.getElementById('Qte_Inventaire').disabled=true;
		document.getElementById('bValiderLigne').disabled=true;
		document.getElementById('Methode').disabled=true;
		document.getElementById('rgpSortie').disabled=true;
		document.getElementById('bEditerInventaire').disabled=true;
		document.getElementById('bEditerEcarts').disabled=true;
		document.getElementById('bEditerPdfVierge').disabled=true;
		document.getElementById('bAnnuler').disabled=true;
		document.getElementById('bCloturer').disabled=true;
	} catch (e) {
		recup_erreur(e);
	}
}


function annulerInventaire() {
  try {

		if (window.confirm("Confirmez-vous l'annulation de l'inventaire en cours ?")) {
			disableAll();
			
			var qAnnuler = new QueryHttp("Facturation/Inventaire/annulerInventaire.tmpl");
			qAnnuler.setParam('Inventaire_Id', inventaireId);
			qAnnuler.execute();

			retourMenuInventaire();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function switchMethode() {
  try {

		methode = document.getElementById('Methode').value;

	} catch (e) {
    recup_erreur(e);
  }
}


function rechercherReference() {
	try {

		var qExArt = new QueryHttp("Facturation/Inventaire/rechReference.tmpl");
		qExArt.setFullParamById('Article_Id');
		qExArt.setParam('Inventaire_Id', inventaireId);
		var result = qExArt.execute();

		var contenu = result.responseXML.documentElement;
		var articleId = contenu.getAttribute('Article_Id');

		if (!isEmpty(articleId)) {
			document.getElementById('Article_Id').value = articleId;
			ligneId = contenu.getAttribute('Ligne_Id');
			document.getElementById('Designation').value = contenu.getAttribute('Designation');
			document.getElementById('Qte_Theorique').value = contenu.getAttribute('Qte_Theorique');
			document.getElementById('Qte_Inventaire').value = "";
			document.getElementById('Qte_Inventaire').focus();

			var qNumPage = new QueryHttp("Facturation/Inventaire/getNumPageArticle.tmpl");
			qNumPage.setParam('Inventaire_Id', inventaireId);
			qNumPage.setParam('Article_Id', articleId);
			var result = qNumPage.execute();

			var numPage = result.responseXML.documentElement.getAttribute('Page');
			indexArticle = result.responseXML.documentElement.getAttribute('Index') - 1;

			goToPage(numPage);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnArticle_Id(ev) {
  try {

		if (ev.keyCode==13) {
			rechercherReference();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function decalerPage(decalage) {
  try {

		goToPage(currentPage + decalage);

	} catch (e) {
    recup_erreur(e);
  }
}


function goToPage(numpage) {
  try {

		var page = parseIntBis(numpage);

		if (!isEmpty(page) && isPositive(page) && page>0 && page<=nbPage) {

			currentIndex = -1;
			currentPage = page;

			document.getElementById('bPagePrec').disabled = (currentPage==1);
			document.getElementById('bPageSuiv').disabled = (currentPage==nbPage);

			document.getElementById('Num_Page').value = currentPage;

			aArtInv.setParam('Num_Page', currentPage);
			aArtInv.initTree(methode=='A'?toLigneArticle:selectLigneSuivante);
		}
		else {
			showWarning("Page inexistante");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnNumPage(ev) {
  try {

		if (ev.keyCode==13) {
			goToPage(document.getElementById('Num_Page').value);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function editionInventaire(typeEdition) {
  try {
		var sortie = (typeEdition=="V"?"PDF":document.getElementById('rgpSortie').value);
		
		if (sortie=="PDF") {
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('bRetourInventaire').collapsed = false;
			document.getElementById('bMenuInventaire').collapsed = true;
			
			var params = "&Type_Inventaire="+ typeInventaire +"&Type_Edition="+ typeEdition +"&Sortie="+ sortie;
			params += "&Marque="+ (typeInventaire=="C"?urlEncode(document.getElementById('Marque').value):pMarque);
			params += "&Famille_1="+ (typeInventaire=="C"?urlEncode(document.getElementById('Famille_1').value):pFamille1);
			params += "&Famille_2="+ (typeInventaire=="C"?urlEncode(document.getElementById('Famille_2').value):pFamille2);
			params += "&Famille_3="+ (typeInventaire=="C"?urlEncode(document.getElementById('Famille_3').value):pFamille3);
	
			var page = getUrlOpeneas("&Page=Facturation/Inventaire/editionInventaire.tmpl&Inventaire_Id="+ inventaireId + params);
			document.getElementById('pdf').setAttribute("src", page);
			
		} else {
			var queryEdit = new QueryHttp("Facturation/Inventaire/editionInventaire.tmpl");
			queryEdit.setParam("Sortie", sortie);
			queryEdit.setParam("Inventaire_Id", inventaireId);
			queryEdit.setParam("Type_Inventaire", typeInventaire);
			queryEdit.setParam("Type_Edition", typeEdition);
			queryEdit.setParam("Marque", typeInventaire=="C"?document.getElementById('Marque').value:pMarque);
			queryEdit.setParam("Famille_1", typeInventaire=="C"?document.getElementById('Famille_1').value:pFamille1);
			queryEdit.setParam("Famille_2", typeInventaire=="C"?document.getElementById('Famille_2').value:pFamille2);
			queryEdit.setParam("Famille_3", typeInventaire=="C"?document.getElementById('Famille_3').value:pFamille3);

			var result = queryEdit.execute();
			var fichier = result.responseXML.documentElement.getAttribute('FichierCsv');
			
			var nom_defaut = "inventaire.csv";
			var file = fileChooser("save", nom_defaut);

			if (file!=null) {
				downloadFile(getDirBuffer()+ fichier, file);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function switchSelection() {
  try {

		var marque = document.getElementById('Marque').value;
		var famille1 = document.getElementById('Famille_1').value;
		var famille2 = document.getElementById('Famille_2').value;
		var famille3 = document.getElementById('Famille_3').value;

		if (marque == 0) {
			aArtInv.removeParam('Marque');
			qNbPage.removeParam('Marque');
		}
		else {
			aArtInv.setParam('Marque', marque);
			qNbPage.setParam('Marque', marque);
		}

		if (famille1 == 0) {
			aArtInv.removeParam('Famille_1');
			qNbPage.removeParam('Famille_1');
		}
		else {
			aArtInv.setParam('Famille_1', famille1);
			qNbPage.setParam('Famille_1', famille1);
		}

		if (famille2 == 0) {
			aArtInv.removeParam('Famille_2');
			qNbPage.removeParam('Famille_2');
		}
		else {
			aArtInv.setParam('Famille_2', famille2);
			qNbPage.setParam('Famille_2', famille2);
		}
		
		if (famille3 == 0) {
			aArtInv.removeParam('Famille_3');
			qNbPage.removeParam('Famille_3');
		}
		else {
			aArtInv.setParam('Famille_3', famille3);
			qNbPage.setParam('Famille_3', famille3);
		}

		viderLigne();

		setNbPage();
		goToPage(1);

	} catch (e) {
    recup_erreur(e);
  }
}


function viderLigne() {
	try {

		document.getElementById('Article_Id').value = "";
		document.getElementById('Designation').value = "";
		document.getElementById('Qte_Theorique').value = "";
		document.getElementById('Qte_Inventaire').value = "";

		ligneId = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function retourInventaire() {
	try {

    document.getElementById('deck').selectedIndex = 0;
    document.getElementById('pdf').setAttribute("src", null);
		document.getElementById('bRetourInventaire').collapsed = true;
		document.getElementById('bMenuInventaire').collapsed = false;

	} catch (e) {
    recup_erreur(e);
  }
}


function retourMenuInventaire() {
	try {

    window.location = "chrome://opensi/content/facturation/user/inventaire/menuInventaire.xul?"+ cookie();

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

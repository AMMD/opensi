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


var aComposants = new Arbre('Facturation/GetRDF/composants_article.tmpl', 'composants');
var aComposantsDispo = new Arbre('Facturation/GetRDF/composants_dispo.tmpl', 'articles');


function initNomenclature() {
	try {
		
		var aFamille = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_Article');
		aFamille.initTree(initFamille);

		document.getElementById('Quantite').value = 1;
		
		aComposants.setParam('Article_Id', document.getElementById("Article").value);
		aComposants.initTree();

	} catch (e) {
    recup_erreur(e);
  }
}


function initFamille() {
	try {

    document.getElementById('Famille_Article').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function filtrerComposants() {
	try {

  	aComposantsDispo.setParam("Article_Id", article_id);
  	aComposantsDispo.setParam("Famille", document.getElementById('Famille_Article').value);
  	aComposantsDispo.initTree();
  	
		disableAjouter(true,false);

	} catch (e) {
    recup_erreur(e);
  }
}


function disableAjouter(b,arbre) {
	try {

		var tree = document.getElementById('articles');

		if (!arbre || (tree.view!=null && tree.currentIndex!=-1)) {
			document.getElementById('bAjouter').disabled = b;
			document.getElementById('Quantite').disabled = b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function disableEnlever(b,arbre) {
	try {

		var tree = document.getElementById('composants');

		if (!arbre || (tree.view!=null && tree.currentIndex!=-1)) {
			document.getElementById('bEnlever').disabled = b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnComposants(ev) {
	try {

		if (ev.keyCode==13) {
	    ouvrirQuantite();
  	}

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirQuantite() {
	try {

		var tree = document.getElementById('composants');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var article_comp_id = getCellText(tree,tree.currentIndex,'ColArticleComp_Id');
			var article_id = document.getElementById('Article').value;
			var quantite = getCellText(tree,tree.currentIndex,'ColQuantite');
			var designation = getCellText(tree,tree.currentIndex,'ColDesignation');

			var url = "chrome://opensi/content/facturation/user/stocks/quantite_composant.xul?"+ cookie() +"&ArticleComp_Id="+ urlEncode(article_comp_id) +"&Article_Id="+ urlEncode(article_id);
					url += "&Quantite="+ quantite +"&Designation="+ designation;
			window.openDialog(url,'','chrome,modal,centerscreen');

  		aComposants.initTree();
			disableEnlever(true,false);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ajouterComposant() {
  try {

		var tree = document.getElementById('articles');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var article_comp_id = getCellText(tree,tree.currentIndex,'ColArticle_Id');

			var article_id = document.getElementById("Article").value;
    	var quantite = document.getElementById('Quantite').value;

			if (isEmpty(quantite)) {
				showWarning("Veuillez spécifier une quantité");
			}
			else if (!checkQte(quantite)) {
				showWarning("Quantité incorrecte");
			}
			else {

				var qExArtNom = new QueryHttp("Facturation/Stocks/existeArticleNomenclature.tmpl");
				qExArtNom.setParam('Article_Id', article_id);
				qExArtNom.setParam('ArticleComp_Id', article_comp_id);
				var result = qExArtNom.execute();

				var contenu = result.responseXML.documentElement;

  			if (contenu.getAttribute('existe')=="false") {

					var qAjArtNom = new QueryHttp("Facturation/Stocks/ajouterArticleNomenclature.tmpl");
					qAjArtNom.setParam('ArticleComp_Id', article_comp_id);
					qAjArtNom.setParam('Article_Id', article_id);
					qAjArtNom.setParam('Quantite', quantite);
					qAjArtNom.execute();

    			aComposants.initTree();
				}
				else {
					showWarning("Cet article est déjà composant de l'article !");
				}
				document.getElementById('Quantite').value = 1;
			}
		}

  } catch (e) {
  	recup_erreur(e);
	}
}


function enleverComposant() {
	try {

    var tree = document.getElementById('composants');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var article_comp_id = getCellText(tree,tree.currentIndex,'ColArticleComp_Id');

			var article_id = document.getElementById("Article").value;

			var qSupArtNom = new QueryHttp("Facturation/Stocks/enleverArticleNomenclature.tmpl");
			qSupArtNom.setParam('ArticleComp_Id', article_comp_id);
			qSupArtNom.setParam('Article_Id', article_id);
    	qSupArtNom.execute();

    	aComposants.initTree();
			disableEnlever(true, false);
		}

	} catch (e) {
		recup_erreur(e);
	}
}


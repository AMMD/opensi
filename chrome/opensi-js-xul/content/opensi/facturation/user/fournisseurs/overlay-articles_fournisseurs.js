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


var tree_articles = new Arbre('Facturation/GetRDF/articles_fournisseur.tmpl', 'af-articles');

var cur_page_article;
var max_page_article;
var fournisseur_id;


function initArticles() {
	try {
		fournisseur_id = document.getElementById('Fournisseur').value;
		document.getElementById('af-PrecArticles').disabled = true;
		document.getElementById('af-SuivArticles').disabled = true;

		var qMaxPageArticles = new QueryHttp("Facturation/Fournisseurs/getNbPagesArticles.tmpl");
		qMaxPageArticles.setParam("Fournisseur_Id", fournisseur_id);
		var p = qMaxPageArticles.execute();
		max_page_article = p.responseXML.documentElement.getAttribute("nbPages");
		if (max_page_article<1) {
			max_page_article = 1;
		}
		document.getElementById('af-pagination_articles').collapsed=(max_page_article==1);
		initPageArticle();

	} catch (e) {
		recup_erreur(e);
	}
}


function disableSup(b) {
	try {

		var tree = document.getElementById('af-articles');

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("af-bSupprimer").disabled = b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ajouterArticle() {
  try {

    var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_article.xul?"+ cookie();
    window.openDialog(url,'Recherche article','chrome,modal,centerscreen');
    init_tree_articles();

  } catch (e) {
    recup_erreur(e);
  }
}

function supprimerArticle() {
  try {

  	var tree = document.getElementById('af-articles');

		if (tree.view!=null && tree.currentIndex!=-1) {

  		var Article_Id = getCellText(tree,tree.currentIndex,'af-ColArticle_Id');
  		var Fournisseur_Id = document.getElementById('Fournisseur').value;

			if (window.confirm("Confirmez-vous la suppression de l'article "+Article_Id+" ?")) {

  			var corps = cookie() +"&Page=Facturation/Fournisseurs/supprimerArticle.tmpl&ContentType=xml&Fournisseur_Id="+ Fournisseur_Id +"&Article_Id="+ Article_Id;
  			var p = requeteHTTP(corps);

  			init_tree_articles();
			}
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function initPageArticle() {
	try {
		cur_page_article = 1;
		document.getElementById('af-PageDebArticles').value = cur_page_article;
		document.getElementById('af-PageFinArticles').value = max_page_article;
		document.getElementById('af-PrecArticles').disabled = (cur_page_article==1);
		document.getElementById('af-SuivArticles').disabled = (cur_page_article==max_page_article);
		init_tree_articles();
	} catch (e) {
		recup_erreur(e);
	}
}


function pageArticleSuiv() {
	try {
		cur_page_article++;
		document.getElementById('af-PageDebArticles').value = cur_page_article;
		document.getElementById('af-PrecArticles').disabled = (cur_page_article==1);
		document.getElementById('af-SuivArticles').disabled = (cur_page_article==max_page_article);
		init_tree_articles();
	} catch (e) {
		recup_erreur(e);
	}
}

function pageArticlePrec() {
	try {
		cur_page_article--;
		document.getElementById('af-PageDebArticles').value = cur_page_article;
		document.getElementById('af-PrecArticles').disabled = (cur_page_article==1);
		document.getElementById('af-SuivArticles').disabled = (cur_page_article==max_page_article);
		init_tree_articles();
	} catch (e) {
		recup_erreur(e);
	}
}


function init_tree_articles() {
  try {
	  tree_articles.setParam("Fournisseur_Id",fournisseur_id);
		tree_articles.setParam("Page_Deb",cur_page_article);
		tree_articles.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}


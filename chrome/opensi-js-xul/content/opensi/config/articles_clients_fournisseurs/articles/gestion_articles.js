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
jsLoader.loadSubScript("chrome://opensi/content/libs/banques.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");



var aArticle = new Arbre("Config/GetRDF/listeArticle.tmpl", "liste_article");


function init() {
	try {


		aArticle.initTree();
		document.getElementById("bRestaurer").disabled=true;


	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnListeArticle() {
	try {
		var tree = document.getElementById('liste_article');
		var rangeCount = tree.view.selection.getRangeCount();
		document.getElementById("bRestaurer").disabled=(rangeCount==0);
	} catch (e) {
		recup_erreur(e);
	}
}


function reinitialiser() {
	try {
		var tree = document.getElementById('liste_article');
		var rangeCount = tree.view.selection.getRangeCount();
			if (window.confirm("Souhaitez-vous restaurer les articles sélectionnés ? (les fiches articles seront de nouveaux visibles dans les fiches articles du dossier)")){
					for (var i=0; i<rangeCount; i++) {
						var start = {};
			  		var end = {};
			  		tree.view.selection.getRangeAt(i,start,end);
			
						for(var c=start.value; c<=end.value; c++) {
							var codeArticle = getCellText(tree,c,'code');
							var qReinitArticle = new QueryHttp("Config/dossiers/restaureArticles.tmpl");
							qReinitArticle.setParam("codearticle", codeArticle);				
							var response=qReinitArticle.execute();
							var contenu = response.responseXML.documentElement;
							var msg = contenu.getAttribute('message');
								if (msg !="1"){
									showMessage("Une erreur est survenue");
									return false;
								}
							}
						}
						showMessage("Les articles sont restaurés");
						init();
			 }
				
		
	} catch (e) {
    recup_erreur(e);
  }
}





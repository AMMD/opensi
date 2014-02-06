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

var oia_aInfosArticles = new Arbre("Facturation/GetRDF/liste-infosArticlesClient.tmpl", "oia-treeInfosArticles");
var oia_currentArticle;

function oia_initInfosArticles() {
	try {
		oia_aInfosArticles.setParam("Client_Id", currentClient);
		oia_aInfosArticles.initTree(oia_nouveauArticleSpec);
	} catch (e) {
		recup_erreur(e);
	}
}


function oia_reporterArticle() {
	try {
		if (oia_aInfosArticles.isSelected()) {
			oia_currentArticle = oia_aInfosArticles.getSelectedCellText('oia-colArticleId');
			document.getElementById('oia-refArticleOrg').value = oia_aInfosArticles.getSelectedCellText('oia-colRefArticleOrg');
			document.getElementById('oia-refArticleSpec').value = oia_aInfosArticles.getSelectedCellText('oia-colRefArticleSpec');
			document.getElementById('oia-codeBarre').value = oia_aInfosArticles.getSelectedCellText('oia-colCodeBarre');
			oia_cacherBoutons(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oia_cacherBoutons(b) {
	try {
		document.getElementById('oia-bRechercherArticle').collapsed = b;
		document.getElementById('oia-bNouveauArticleSpec').collapsed = !b;
		document.getElementById('oia-bCreerArticleSpec').collapsed = b;
		document.getElementById('oia-bModifierArticleSpec').collapsed = !b;
		document.getElementById('oia-bSupprimerArticleSpec').collapsed = !b;
	} catch (e) {
		recup_erreur(e);
	}
}


function oia_rechercherArticle() {
	try {
		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
    window.openDialog(url,'','chrome,modal,centerscreen',oia_retourRechercherArticle);
	} catch (e) {
		recup_erreur(e);
	}
}


function oia_retourRechercherArticle(reference) {
	try {
		var qArticle = new QueryHttp("Facturation/Stocks/getArticle.tmpl");
		qArticle.setParam("Article_Id", reference);
		var result = qArticle.execute();
		var ficheArticleId = result.responseXML.documentElement.getAttribute('Fiche_Article_Id');
		
		var qVerifArticle = new QueryHttp("Facturation/Clients/verifArticleSpec.tmpl");
		qVerifArticle.setParam("Article_Id", ficheArticleId);
		qVerifArticle.setParam("Client_Id", currentClient);
		result = qVerifArticle.execute();
		if (result.responseXML.documentElement.getAttribute("ok")=="true") {
			oia_currentArticle = ficheArticleId;
			document.getElementById('oia-refArticleOrg').value = reference;
		} else {
			showWarning("L'article '"+ reference +"' possède déjà des infos spécifiques !");
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function oia_nouveauArticleSpec() {
	try {
		if (oia_aInfosArticles.isSelected()) {
			oia_aInfosArticles.select(-1);
		}
		oia_currentArticle = "";
		document.getElementById('oia-refArticleOrg').value = "";
		document.getElementById('oia-refArticleSpec').value = "";
		document.getElementById('oia-codeBarre').value = "";
		oia_cacherBoutons(false);
	} catch (e) {
		recup_erreur(e);
	}
}


function oia_enregistrerArticleSpec(mode) {
	try {
		var refArticleSpec = document.getElementById('oia-refArticleSpec').value;
		var codeBarre = document.getElementById('oia-codeBarre').value;
		
		if (isEmpty(oia_currentArticle)) { showWarning("Veuillez choisir un article !"); }
		else if (isEmpty(refArticleSpec) && isEmpty(codeBarre)) { showWarning("Veuillez saisir une réf. article et/ou un code barre !"); }
		else {
			var qEnregistrer;
			if (mode=='C') {
				qEnregistrer = new QueryHttp("Facturation/Clients/creerArticleSpec.tmpl");
			} else {
				qEnregistrer = new QueryHttp("Facturation/Clients/modifierArticleSpec.tmpl");
			}
			qEnregistrer.setParam("Article_Id", oia_currentArticle);
			qEnregistrer.setParam("Client_Id", currentClient);
			qEnregistrer.setParam("Ref_Article_Spec", refArticleSpec);
			qEnregistrer.setParam("Code_Barre", codeBarre);
			qEnregistrer.execute();
			
			oia_aInfosArticles.initTree(oia_nouveauArticleSpec);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oia_supprimerArticleSpec() {
	try {
		if (window.confirm("Voulez-vous supprimer les informations spécifiques de cet article ?")) {
			var qSupprimer = new QueryHttp("Facturation/Clients/supprimerArticleSpec.tmpl");
			qSupprimer.setParam("Client_Id", currentClient);
			qSupprimer.setParam("Article_Id", oia_currentArticle);
			qSupprimer.execute();
			
			oia_aInfosArticles.initTree(oia_nouveauArticleSpec);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


function init() {
	try {

		document.getElementById('Reference').focus();

	} catch (e) {
  	recup_erreur(e);
  }
}


function valider() {
	try {

		var currentArticle = ParamValeur("Article_Id");
		var nouvelArticle = document.getElementById('Reference').value;

		if (isEmpty(nouvelArticle)) { showWarning("Veuillez saisir une r�f�rence pour le nouvel article !"); }
		else if (!isCleAlpha(nouvelArticle)) { showWarning("R�f�rence article invalide !"); }
		else {
			var qExistArticle = new QueryHttp("Facturation/Stocks/existeArticle.tmpl");
			qExistArticle.setParam("Article_Id", nouvelArticle);
			var result = qExistArticle.execute();
			if (result.responseXML.documentElement.getAttribute("existe") == "true") {
				showWarning("Cette r�f�rence est d�j� utilis�e !");
			}
			else {
				var qCopierArticle = new QueryHttp("Facturation/Stocks/copierArticle.tmpl");
				qCopierArticle.setParam("Ancien_Article_Id", currentArticle);
				qCopierArticle.setParam("Nouvel_Article_Id", nouvelArticle);
				qCopierArticle.execute();

				window.arguments[0](nouvelArticle);
    		window.close();
			}
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


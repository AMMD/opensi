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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var codeBarre;


function init() {
  try {

		codeBarre = window.arguments[0];
		document.getElementById('Code_Barre').value = codeBarre;

  } catch (e) {
    recup_erreur(e);
  }
}


function associerCodeBarre() {
  try {
		
		var articleId = document.getElementById('Article_Id').value;
		
		if (isEmpty(articleId)) {
			showWarning("Veuillez saisir une référence");
		}
		else {

			var qAssoc = new QueryHttp("Facturation/Reception/associerCodeBarre.tmpl");
			qAssoc.setParam('Article_Id', articleId);
			qAssoc.setParam('Code_Barre', codeBarre);
			var result = qAssoc.execute();
			var codeErreur = result.responseXML.documentElement.getAttribute('Code_Erreur');

			if (codeErreur=="1")
				showWarning("Article inexistant");
			else {
				showMessage("Le code barre a été associé à l'article");
				window.close();
			}   	
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnArticleId(ev) {
	try {
	
		if (ev.keyCode==13) {
			associerCodeBarre();
		}	
	
	} catch (e) {
    recup_erreur(e);
  }
}


function rechercherArticle() {
	try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		url +="&Article_Id="+ document.getElementById('Article_Id').value;
    window.openDialog(url,'','chrome,modal,centerscreen', retourRechercherArticle);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourRechercherArticle(reference) {
	try {
	
		document.getElementById('Article_Id').value = reference;
	
	} catch (e) {
    recup_erreur(e);
  }
}

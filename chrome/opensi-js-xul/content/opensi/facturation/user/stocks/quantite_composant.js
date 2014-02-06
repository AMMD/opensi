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

    window.resizeTo(400,180);

		document.getElementById('titre').value = "Composant "+ ParamValeur("ArticleComp_Id") +" - "+ ParamValeur("Designation");

		document.getElementById('Quantite').value = ParamValeur("Quantite");
    document.getElementById('Quantite').focus();

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnQuantite(ev) {
  try {

		if (ev.keyCode==13) {
      modifierQuantite();
  	}

	} catch (e) {
    recup_erreur(e);
  }
}


function modifierQuantite() {
  try {

		var article_comp_id = ParamValeur("ArticleComp_Id");
		var article_id = ParamValeur("Article_Id");

		var quantite = document.getElementById('Quantite').value;

		if (!checkQte(quantite)) {
			showWarning("Quantité incorrecte !");
		}
		else {
			var qMajQC = new QueryHttp("Facturation/Stocks/modifierQuantiteComposant.tmpl");
			qMajQC.setParam('Article_Id', article_id);
			qMajQC.setParam('ArticleComp_Id', article_comp_id);
			qMajQC.setParam('Quantite', quantite);
			qMajQC.execute();

			window.close();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

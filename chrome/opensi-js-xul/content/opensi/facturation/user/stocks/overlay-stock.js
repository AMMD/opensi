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


var aStatutsStock = new Arbre('Config/GetRDF/listeStatutsMvtStock.tmpl', 'Libelle_Ajustement');


function initStock() {
	try {
		aStatutsStock.initTree(initStatutsStock);

  } catch (e) {
    recup_erreur(e);
  }
}


function initStatutsStock() {
	try {

		document.getElementById('Libelle_Ajustement').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function disableInitStock(b) {
	try {

	 	document.getElementById('Stock_Init').disabled = b;
		document.getElementById('Prix_Init').disabled = b;
		document.getElementById('Frais_Init').disabled = b;
		document.getElementById('Date_Inventaire').disabled = b;
		document.getElementById('row_ajustement').collapsed = !b;
		document.getElementById('row_ajustement_2').collapsed = !b;

  } catch (e) {
    recup_erreur(e);
  }
}


function ajusterStock() {
	try {

		var stockReel = document.getElementById('Stock_Auj').value;
		var ajustement = document.getElementById('Ajustement').value;

		if (isEmpty(ajustement) || !isPositiveOrNull(ajustement)) {
			showWarning("Ajustement du stock incorrect !");
		}
		else {
			var ok = true;
			
			if (parseFloat(ajustement) > parseFloat(stockReel)) {
				var qCheckCUMP = new QueryHttp("Facturation/Stocks/existeCUMP.tmpl");
				var articleId = document.getElementById('Article').value;
				qCheckCUMP.setParam('Article_Id', articleId);
				var result = qCheckCUMP.execute();
				if (result.responseXML.documentElement.getAttribute("existe")=="false") {
					ok = false;
					var url = "chrome://opensi/content/facturation/user/stocks/popup-creerCUMP.xul?"+ cookie();
					window.openDialog(url,'','chrome,modal,centerscreen', majStock);
				}
			}
			if (ok) { majStock(""); }
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function majStock(valUnitaire) {
	try {
		var ajustement = document.getElementById('Ajustement').value;
		var libelleAjustement = document.getElementById('Libelle_Ajustement').label;
		
		var qAjStock = new QueryHttp("Facturation/Stocks/ajustementStock.tmpl");
		qAjStock.setParam('Ajustement', ajustement);
		qAjStock.setParam('Libelle_Ajustement', libelleAjustement);
		qAjStock.setParam('Article_Id', document.getElementById('Article').value);
		if (valUnitaire!="") { qAjStock.setParam('Valeur_Unitaire', valUnitaire); }
		qAjStock.execute(ajusterStock_2);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ajusterStock_2(httpRequest) {
	try {

		var stock_init = document.getElementById('Stock_Init').value;
		var com_clients = document.getElementById('Com_Clients').value;
		var com_fournisseurs = document.getElementById('Com_Fournisseurs').value;

		var contenu = httpRequest.responseXML.documentElement;

		document.getElementById('Entrees').value = contenu.getAttribute('Entrees');
		document.getElementById('Sorties').value = contenu.getAttribute('Sorties');
		document.getElementById('Stock_Auj').value = parseFloat(stock_init) + parseFloat(contenu.getAttribute('Entrees')) - parseFloat(contenu.getAttribute('Sorties'));

		var reel = document.getElementById('Stock_Auj').value;

		document.getElementById('Stock_Dispo').value = parseFloat(reel) - parseFloat(com_clients);
		document.getElementById('Stock_Calcule').value = parseFloat(reel) - parseFloat(com_clients) + parseFloat(com_fournisseurs);

		document.getElementById('Ajustement').value = "";
		initStatutsStock();
		afficherResumeStocks();

	} catch (e) {
    recup_erreur(e);
  }
}


function calcStockMinimum() {
	try {

		var stock_alerte = document.getElementById('Stock_Alerte').value;
		var stock_securite = document.getElementById('Stock_Securite').value;

		if (isPositiveOrNull(stock_alerte) && isPositiveOrNull(stock_securite)) {
			document.getElementById('Stock_Minimum').value = stock_alerte - stock_securite;
		}
		else {
			document.getElementById('Stock_Minimum').value = "";
		}

	} catch (e) {
    recup_erreur(e);
  }
}


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


var stock_id = 0;
var aStocks = new Arbre("Config/GetRDF/liste-stocks.tmpl", "tree-stocks");


function initStocks() {
	try {

		aStocks.initTree();

	} catch (e) {
		recup_erreur(e);
	}
}


function reporterStock() {
	try {

		var tree = document.getElementById('tree-stocks');

		if (tree.view!=null && tree.currentIndex!=-1) {

			document.getElementById('ost-Intitule').value = getCellText(tree, tree.currentIndex, 'ost-ColIntitule');
			document.getElementById('ost-Denomination').value = getCellText(tree, tree.currentIndex, 'ost-ColDenomination');
			document.getElementById('ost-Adresse_1').value = getCellText(tree, tree.currentIndex, 'ost-ColAdresse_1');
			document.getElementById('ost-Adresse_2').value = getCellText(tree, tree.currentIndex, 'ost-ColAdresse_2');
			document.getElementById('ost-Adresse_3').value = getCellText(tree, tree.currentIndex, 'ost-ColAdresse_3');
			document.getElementById('ost-Code_Postal').value = getCellText(tree, tree.currentIndex, 'ost-ColCode_Postal');
			document.getElementById('ost-Ville').value = getCellText(tree, tree.currentIndex, 'ost-ColVille');
			document.getElementById('ost-Code_Pays').value = getCellText(tree, tree.currentIndex, 'ost-ColCode_Pays');
			stock_id = getCellText(tree, tree.currentIndex, 'ost-ColStock_Id');

			document.getElementById('ost-bSupprimer').collapsed = false;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function enregistrerStock() {
	try {

		var intitule = document.getElementById('ost-Intitule').value;
		var denomination = document.getElementById('ost-Denomination').value;
		var adresse_1 = document.getElementById('ost-Adresse_1').value;
		var ville = document.getElementById('ost-Ville').value;

				 if (isEmpty(intitule)) { showWarning("Intitulé de stock manquant");	}
		else if (isEmpty(denomination)) { showWarning("Raison sociale manquante"); }
		else if (isEmpty(adresse_1)) { showWarning("Adresse manquante"); }
		else if (isEmpty(ville)) { showWarning("Ville manquante"); }
		else {

			var qSave;

			if (stock_id==0) {
				qSave = new QueryHttp("Config/multisites/creerStock.tmpl");
			}
			else {
				qSave = new QueryHttp("Config/multisites/modifierStock.tmpl");
				qSave.setParam('Stock_Id', stock_id);
			}

			qSave.setParamById('Intitule', 'ost-Intitule');
			qSave.setParamById('Denomination', 'ost-Denomination');
			qSave.setParamById('Adresse_1', 'ost-Adresse_1');
			qSave.setParamById('Adresse_2', 'ost-Adresse_2');
			qSave.setParamById('Adresse_3', 'ost-Adresse_3');
			qSave.setParamById('Code_Postal', 'ost-Code_Postal');
			qSave.setParamById('Ville', 'ost-Ville');
			qSave.setParamById('Code_Pays', 'ost-Code_Pays');

			qSave.execute(enregistrerStock_2);
			nouveauStock();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function enregistrerStock_2() {
	try {

		aStocks.initTree();

	} catch (e) {
		recup_erreur(e);
	}
}


function nouveauStock() {
	try {

		stock_id = 0;
		document.getElementById('ost-Intitule').value = "";
		document.getElementById('ost-Denomination').value = "";
		document.getElementById('ost-Adresse_1').value = "";
		document.getElementById('ost-Adresse_2').value = "";
		document.getElementById('ost-Adresse_3').value = "";
		document.getElementById('ost-Code_Postal').value = "";
		document.getElementById('ost-Ville').value = "";
		document.getElementById('ost-Code_Pays').value = "FR";

		document.getElementById('ost-bSupprimer').collapsed = true;

	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerStock() {
	try {

		if (window.confirm("Confirmez-vous la suppression de ce stock ?")) {
			var qSup = new QueryHttp("Config/multisites/supprimerStock.tmpl");
			qSup.setParam('Stock_Id', stock_id);
			qSup.execute();

			nouveauStock();
			aStocks.initTree();
		}

	} catch (e) {
		recup_erreur(e);
	}
}

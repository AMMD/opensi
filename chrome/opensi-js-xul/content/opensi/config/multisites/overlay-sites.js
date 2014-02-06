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


var site_id = 0;
var aSites = new Arbre("Config/GetRDF/liste-sites.tmpl", "tree-sites");
var cbStocks = new Arbre("Config/GetRDF/combo-stocks.tmpl", "osi-Stock_Defaut");
var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "osi-Code_Pays");


function initSites() {
	try {

		aSites.initTree();
    aPays.initTree(initPays);
		cbStocks.initTree(initComboStocks);

	} catch (e) {
		recup_erreur(e);
	}
}

function initPays() {
  try {

    document.getElementById('osi-Code_Pays').value = "FR";

  } catch (e) {
    recup_erreur(e);
  }
}


function initComboStocks() {
	try {

		document.getElementById('osi-Stock_Defaut').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function reloadComboStocks() {
	try {

		cbStocks.initTree(initComboStocks);

	} catch (e) {
		recup_erreur(e);
	}
}

function reporterSite() {
	try {

		var tree = document.getElementById('tree-sites');

		if (tree.view!=null && tree.currentIndex!=-1) {

			document.getElementById('osi-Intitule').value = getCellText(tree, tree.currentIndex, 'osi-ColIntitule');
			document.getElementById('osi-Denomination').value = getCellText(tree, tree.currentIndex, 'osi-ColDenomination');
			document.getElementById('osi-Adresse_1').value = getCellText(tree, tree.currentIndex, 'osi-ColAdresse_1');
			document.getElementById('osi-Adresse_2').value = getCellText(tree, tree.currentIndex, 'osi-ColAdresse_2');
			document.getElementById('osi-Adresse_3').value = getCellText(tree, tree.currentIndex, 'osi-ColAdresse_3');
			document.getElementById('osi-Code_Postal').value = getCellText(tree, tree.currentIndex, 'osi-ColCode_Postal');
			document.getElementById('osi-Ville').value = getCellText(tree, tree.currentIndex, 'osi-ColVille');
      document.getElementById('osi-Code_Pays').value = getCellText(tree, tree.currentIndex, 'osi-ColCode_Pays');
      document.getElementById('osi-Tel').value = getCellText(tree, tree.currentIndex, 'osi-ColTel');
      document.getElementById('osi-Fax').value = getCellText(tree, tree.currentIndex, 'osi-ColFax');
      document.getElementById('osi-Email').value = getCellText(tree, tree.currentIndex, 'osi-ColEmail');
      document.getElementById('osi-Numero_TVA').value = getCellText(tree, tree.currentIndex, 'osi-ColNumero_TVA');
			document.getElementById('osi-Stock_Defaut').value = getCellValue(tree, tree.currentIndex, 'osi-ColStock_Defaut');
			site_id = getCellText(tree, tree.currentIndex, 'osi-ColSite_Id');

			document.getElementById('osi-bSupprimer').collapsed = false;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function enregistrerSite() {
	try {

		var intitule = document.getElementById('osi-Intitule').value;
		var denomination = document.getElementById('osi-Denomination').value;
		var adresse_1 = document.getElementById('osi-Adresse_1').value;
		var ville = document.getElementById('osi-Ville').value;

				 if (isEmpty(intitule)) { showWarning("Intitulé de site manquant");	}
		else if (isEmpty(denomination)) { showWarning("Raison sociale manquante"); }
		else if (isEmpty(adresse_1)) { showWarning("Adresse manquante"); }
		else if (isEmpty(ville)) { showWarning("Ville manquante"); }
		else {

			var qSave;

			if (site_id==0) {
				qSave = new QueryHttp("Config/multisites/creerSite.tmpl");
			}
			else {
				qSave = new QueryHttp("Config/multisites/modifierSite.tmpl");
				qSave.setParam('Site_Id', site_id);
			}

			qSave.setParamById('Intitule', 'osi-Intitule');
			qSave.setParamById('Denomination', 'osi-Denomination');
			qSave.setParamById('Adresse_1', 'osi-Adresse_1');
			qSave.setParamById('Adresse_2', 'osi-Adresse_2');
			qSave.setParamById('Adresse_3', 'osi-Adresse_3');
			qSave.setParamById('Code_Postal', 'osi-Code_Postal');
			qSave.setParamById('Ville', 'osi-Ville');
      qSave.setParamById('Code_Pays', 'osi-Code_Pays');
      qSave.setParamById('Tel', 'osi-Tel');
      qSave.setParamById('Fax', 'osi-Fax');
      qSave.setParamById('Email', 'osi-Email');
      qSave.setParamById('Numero_TVA', 'osi-Numero_TVA');
			qSave.setParamById('Stock_Defaut', 'osi-Stock_Defaut');

			qSave.execute(enregistrerSite_2);
			nouveauSite();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function enregistrerSite_2() {
	try {

		aSites.initTree();

	} catch (e) {
		recup_erreur(e);
	}
}


function nouveauSite() {
	try {

		site_id = 0;
		document.getElementById('osi-Intitule').value = "";
		document.getElementById('osi-Denomination').value = "";
		document.getElementById('osi-Adresse_1').value = "";
		document.getElementById('osi-Adresse_2').value = "";
		document.getElementById('osi-Adresse_3').value = "";
		document.getElementById('osi-Code_Postal').value = "";
		document.getElementById('osi-Ville').value = "";
    document.getElementById('osi-Code_Pays').value = "FR";
    document.getElementById('osi-Tel').value = "";
    document.getElementById('osi-Fax').value = "";
    document.getElementById('osi-Email').value = "";
		document.getElementById('osi-Stock_Defaut').selectedIndex = 0;

		document.getElementById('osi-bSupprimer').collapsed = true;

	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerSite() {
	try {

		if (window.confirm("Confirmez-vous la suppression de ce site ?")) {
			var qSup = new QueryHttp("Config/multisites/supprimerSite.tmpl");
			qSup.setParam('Site_Id', site_id);
			qSup.execute();

			nouveauSite();
			aSites.initTree();
		}

	} catch (e) {
		recup_erreur(e);
	}
}

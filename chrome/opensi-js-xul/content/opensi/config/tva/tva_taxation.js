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
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");


var aTaxation = new Arbre('Config/GetRDF/listeTaxation.tmpl','liste_Taxation');

function init() {
	try {

		aTaxation.initTree();

	} catch (e) {
    recup_erreur(e);
  }
}


function reporter() {
  try {

    var tree = document.getElementById("liste_Taxation");

		if (tree.view!=null && tree.currentIndex!=-1) {

			document.getElementById('Seuil_CA').value = getCellText(tree,tree.currentIndex,'ColSeuil_CA');
			document.getElementById('Taxation').checked = (getCellText(tree,tree.currentIndex,'ColTaxation')=="oui");

			document.getElementById('Row_Seuil_CA').collapsed  = false;
			document.getElementById('Row_Taxation').collapsed  = false;
			document.getElementById('bModifier').collapsed  = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}



function modifierTaxation() {
	try {

    var tree = document.getElementById("liste_Taxation");

		if (tree.view!=null) {

				var code_pays = getCellText(tree,tree.currentIndex,'ColCode_Pays');
				var taxation = (document.getElementById("Taxation").checked?1:0);

 				var qMajTaxation = new QueryHttp("Config/Tva/modifierTaxation.tmpl");
				qMajTaxation.setParam('Code_Pays', code_pays);
				qMajTaxation.setParam('Taxation', taxation);

				qMajTaxation.execute(modifierTaxation_2);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function modifierTaxation_2(httpRequest) {
	try {

		aTaxation.initTree();

		document.getElementById('Row_Seuil_CA').collapsed  = true;
		document.getElementById('Row_Taxation').collapsed  = true;
		document.getElementById('bModifier').collapsed  = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_menuManager() {
	try {

  	window.location = "chrome://opensi/content/config/menu_manager.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

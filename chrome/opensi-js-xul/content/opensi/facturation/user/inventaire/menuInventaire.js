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
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");


function init() {
  try {

		var aInventaires = new Arbre('Facturation/GetRDF/liste-inventaires.tmpl', 'tree-inventaires');
		aInventaires.initTree();

  } catch (e) {
    recup_erreur(e);
  }
}


function nouvelInventaire() {
	try {

		var url = "chrome://opensi/content/facturation/user/inventaire/popup-typeInventaire.xul?"+ cookie();
    window.openDialog(url,'','chrome,modal,centerscreen', creerInventaire);

	} catch (e) {
    recup_erreur(e);
  }
}


function creerInventaire(typeInventaire, marque, famille1, famille2, famille3) {
	try {

		var qNewInv = new QueryHttp("Facturation/Inventaire/creerInventaire.tmpl");
		qNewInv.setParam('Type_Inventaire', typeInventaire);
		qNewInv.setParam('Marque', marque);
		qNewInv.setParam('Famille_1', famille1);
		qNewInv.setParam('Famille_2', famille2);
		qNewInv.setParam('Famille_3', famille3);

		var result = qNewInv.execute();

		var inventaireId = result.responseXML.documentElement.getAttribute('Inventaire_Id');

		if (inventaireId>0) {
			window.location = "chrome://opensi/content/facturation/user/inventaire/saisieInventaire.xul?"+ cookie() +"&Inventaire_Id="+ inventaireId;
		}
		else {
			showWarning("Vous devez clôturer l'inventaire en cours avant d'en ouvrir un nouveau");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirInventaire() {
	try {

		var tree = document.getElementById('tree-inventaires');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var inventaireId = getCellText(tree, tree.currentIndex, 'ColInventaire_Id');

			window.location = "chrome://opensi/content/facturation/user/inventaire/saisieInventaire.xul?"+ cookie() +"&Inventaire_Id="+ inventaireId;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function retourMenuPrincipal() {
	try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

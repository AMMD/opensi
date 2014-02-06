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


jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");


var aFacts = new Arbre('Facturation/GetRDF/factures.tmpl', 'factures');
var aHisto = new Arbre('Facturation/GetRDF/factures.tmpl', 'historique');


function init() {
  try {

		aFacts.setParam('Directe', 1);
  	aFacts.setParam('Terminees', 'n');
  	aFacts.initTree();

		aHisto.setParam('Directe', 1);
		aHisto.setParam('Terminees', 'y');
		aHisto.initTree();

		var corps = cookie() +"&Page=Facturation/Factu_Directe/getTotauxMenu.tmpl&ContentType=xml";
		requeteHTTP(corps, new XMLHttpRequest(), init_2);

  } catch (e) {
  	recup_erreur(e);
  }
}

function init_2(httpRequest) {
  try {

		document.getElementById('TotalEnCours').value = httpRequest.responseXML.documentElement.getAttribute('TotalEnCours');

	} catch (e) {
  	recup_erreur(e);
  }
}


function nouvelle_facture() {
  try {

    window.location = "chrome://opensi/content/facturation/user/factu_directe/edition_facture.xul?"+ cookie() +"&Mode=C";

  } catch (e) {
  	recup_erreur(e);
  }
}


function rechercher_facture() {
  try {

		var url = "chrome://opensi/content/facturation/user/recherches/rech_facture.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen', ouvrirFacture);

	} catch (e) {
  	recup_erreur(e);
  }
}


function pressOnFactures(ev) {
  try {

		if (ev.keyCode==13) {
    	ouvrirFromTree('factures');
    }

	} catch (e) {
  	recup_erreur(e);
  }
}


function pressOnHistorique(ev) {
  try {

		if (ev.keyCode==13) {
    	ouvrirFromTree('historique');
    }

	} catch (e) {
  	recup_erreur(e);
  }
}


function ouvrirFacture(facture_id) {
  try {

    window.location = "chrome://opensi/content/facturation/user/factu_directe/edition_facture.xul?"+ cookie() +"&Mode=M&Facture_Id="+ facture_id;

	} catch (e) {
  	recup_erreur(e);
  }
}


function ouvrirFromTree(tree_id) {
  try {

		var tree = document.getElementById(tree_id);

		if (tree.view!=null && tree.currentIndex!=-1) {

			var facture_id = getCellText(tree,tree.currentIndex,(tree_id=='factures'?'ColFacture_Id':'ColFacture_IdH'));

			ouvrirFacture(facture_id);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

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


var aAvoirs = new Arbre('Facturation/GetRDF/avoirs.tmpl', 'avoirs');
var aHisto = new Arbre('Facturation/GetRDF/avoirs.tmpl', 'historique');


function init() {
  try {

		aAvoirs.setParam('Termines', 'n');
  	aAvoirs.initTree();

		aHisto.setParam('Termines', 'y');
		aHisto.initTree();

  } catch (e) {
  	recup_erreur(e);
  }
}


function nouvel_avoir() {
  try {

    window.location = "chrome://opensi/content/facturation/user/avoirs/edition_avoir.xul?"+ cookie() +"&Mode=C";

  } catch (e) {
  	recup_erreur(e);
  }
}


function rechercher_avoir() {
  try {

		var url = "chrome://opensi/content/facturation/user/recherches/rech_avoir.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen', ouvrirAvoir);

	} catch (e) {
  	recup_erreur(e);
  }
}


function pressOnAvoirs(ev) {
  try {

		if (ev.keyCode==13) {
    	ouvrirFromTree('avoirs');
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


function ouvrirAvoir(avoir_id) {
  try {

    window.location = "chrome://opensi/content/facturation/user/avoirs/edition_avoir.xul?"+ cookie() +"&Mode=M&Avoir_Id="+ avoir_id;

	} catch (e) {
  	recup_erreur(e);
  }
}


function ouvrirFromTree(tree_id) {
  try {

		var tree = document.getElementById(tree_id);

		if (tree.view!=null && tree.currentIndex!=-1) {

			var avoir_id = getCellText(tree,tree.currentIndex,(tree_id=='avoirs'?'ColAvoir_Id':'ColAvoir_IdH'));

			ouvrirAvoir(avoir_id);
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

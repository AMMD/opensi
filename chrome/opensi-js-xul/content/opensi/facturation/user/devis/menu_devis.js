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
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");


var aDevis = new Arbre('Facturation/GetRDF/liste_devis.tmpl', 'devis');
var aHisto = new Arbre('Facturation/GetRDF/liste_devis.tmpl', 'historique');


function init() {
  try {
	
		aDevis.setParam('Terminees', 'n');
  	aDevis.initTree();
		
		aHisto.setParam('Terminees', 'y');
		aHisto.initTree();

		var corps = cookie() +"&Page=Facturation/Devis/getTotauxMenu.tmpl&ContentType=xml";
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


function nouveau_devis() {
  try {

    window.location = "chrome://opensi/content/facturation/user/devis/edition_devis.xul?" + cookie() +"&Mode=C";

  } catch (e) {
  	recup_erreur(e);
  }
}


function rechercher_devis() {
  try {

		var url = "chrome://opensi/content/facturation/user/devis/rech_devis.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
  	recup_erreur(e);
  }
}


function pressOnDevis(ev) {
  try {

		if (ev.keyCode==13) {
    	ouvrir_devis();
    }

	} catch (e) {
  	recup_erreur(e);
  }
}


function pressOnHistorique(ev) {
  try {

		if (ev.keyCode==13) {

    	ouvrir_devis_historique();
    }

	} catch (e) {
  	recup_erreur(e);
  }
}


function ouvrir_devis_win(devis_id) {
  try {

    window.location = "chrome://opensi/content/facturation/user/devis/edition_devis.xul?"+ cookie() +"&Mode=M&Devis_Id="+ devis_id;

	} catch (e) {
  	recup_erreur(e);
  }
}


function ouvrir_devis() {
  try {

		var tree = document.getElementById('devis');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var devis_id = getCellText(tree,tree.currentIndex,'ColDevis_Id');

    	window.location = "chrome://opensi/content/facturation/user/devis/edition_devis.xul?"+ cookie() +"&Mode=M&Devis_Id="+ devis_id;
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function ouvrir_devis_historique() {
  try {

		var tree = document.getElementById('historique');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var devis_id = getCellText(tree,tree.currentIndex,'ColDevis_IdH');

    	window.location = "chrome://opensi/content/facturation/user/devis/edition_devis.xul?"+ cookie() +"&Mode=M&Devis_Id="+ devis_id;
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function archiver() {
  try {

		var nb_mois = document.getElementById('Nb_Mois').value;

		if (isEmpty(nb_mois) || !isPositiveInteger(nb_mois)) {
			showWarning("Nombre de mois incorrect !");
		}
		else if (window.confirm("Confirmez-vous l'archivage des devis ?")) {

			var corps = cookie() +"&Page=Facturation/Devis/archivageDevis.tmpl&ContentType=xml&Nb_Mois="+ nb_mois;
			requeteHTTP(corps);

			showMessage("Archivage terminé");
			
			aDevis.initTree();
			aHisto.initTree();
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

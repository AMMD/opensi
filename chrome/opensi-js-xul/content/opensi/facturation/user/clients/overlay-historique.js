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


var aHistorique = new Arbre("Facturation/GetRDF/historique_client.tmpl", "tree-historique");


function initHistorique() {
  try {

		document.getElementById('Periode').value = "1";
		aHistorique.setParam("Client_Id", currentClient);
		loadHisto();

  } catch (e) {
    recup_erreur(e);
  }
}


function verifPlageDates() {
  try {

	 	document.getElementById('Periode').value = "P";

    var date_debut = document.getElementById('Date_Debut').value;
		var date_fin = document.getElementById('Date_Fin').value;

		if (isEmpty(date_debut)) {
			showWarning("Vous devez indiquer une date de début de période !");
		}
		else if (isEmpty(date_fin)) {
			showWarning("Vous devez indiquer une date de fin de période !");
		}
		else if (!isDate(date_debut)) {
			showWarning("Date de début de période incorrecte !");
		}
		else if (!isDate(date_fin)) {
			showWarning("Date de fin de période incorrecte !");
		}
		else if (!isDateInterval(date_debut,date_fin)) {
			showWarning("Plage de dates incorrecte !");
		}
		else {
			loadHisto();
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function loadHisto() {
  try {

	 	var periode = document.getElementById('Periode').value;

		aHistorique.setParam("Periode", periode);

		if (periode=="P") {
			var date_debut = document.getElementById('Date_Debut').value;
			var date_fin = document.getElementById('Date_Fin').value;
			aHistorique.setParam("Date_Debut", prepareDateJava(date_debut));
			aHistorique.setParam("Date_Fin", prepareDateJava(date_fin));
		}

		aHistorique.initTree(calculCA);

  } catch (e) {
    recup_erreur(e);
  }
}


function selectPerso() {
  try {

	 	document.getElementById('Periode').value = "P";

  } catch (e) {
    recup_erreur(e);
  }
}


function calculCA() {
  try {

	 	var tree = document.getElementById('tree-historique');

		var ca = 0;

		if (tree.view!=null) {
			for (var i=0; i<tree.view.rowCount; i++) {

				ca += parseFloat(getCellText(tree,i,'ColTotal_HT'));
			}
		}

		var nf = new NumberFormat("0.00", true);
		document.getElementById('cap').value = nf.format(ca);

  } catch (e) {
    recup_erreur(e);
  }
}


function choixDoc() {
	try {
		var tree = document.getElementById('tree-historique');
		if (tree.view!=null && tree.currentIndex!=-1) {
			var typeDoc = getCellText(tree,tree.currentIndex,'ColType_Doc');
			var doc_id = getCellText(tree,tree.currentIndex,'ColDoc_Id');
			if (typeDoc=="Facture") {
				var page = "chrome://opensi/content/facturation/user/factu_directe/edition_facture.xul?" + cookie();
				page += "&Facture_Id="+ doc_id;
				page += "&Mode=V";
			} else {
				var page = "chrome://opensi/content/facturation/user/avoirs/edition_avoir.xul?" + cookie();
				page += "&Avoir_Id="+ doc_id;
				page += "&Mode=V";
			}
			window.location = page;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


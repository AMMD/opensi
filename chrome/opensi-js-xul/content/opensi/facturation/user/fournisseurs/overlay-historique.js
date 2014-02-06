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


function initHistorique() {
	try {

		init_tree_histo(1);

	} catch (e) {
		recup_erreur(e);
	}
}


function verifPlageDates() {
  try {

	 	document.getElementById('hi-Periode').selectedItem = document.getElementById('hi-PeriodeP');

    var date_debut = document.getElementById('hi-Date_Debut').value;
		var date_fin = document.getElementById('hi-Date_Fin').value;

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
   		init_tree_histo("P");
		}

  } catch (e) {
    recup_erreur(e);
  }
}

function loadHisto() {
  try {
		
		init_tree_histo(document.getElementById('hi-Periode').value);

  } catch (e) {
    recup_erreur(e);
  }
}


function selectPerso() {
  try {

	 	document.getElementById('hi-Periode').selectedItem = document.getElementById('hi-PeriodeP');

  } catch (e) {
    recup_erreur(e);
  }
}


function calculCA() {
  try {

	 	var tree = document.getElementById('hi-histo');

		var ca = 0;

		if (tree.view!=null) {
			for (var i=0; i<tree.view.rowCount; i++) {

				ca += parseFloat(getCellText(tree,i,'hi-ColTotal_HT'));
			}
		}

		var nf = new NumberFormat("0.00", true);
		document.getElementById('hi-cap').value = nf.format(ca);

  } catch (e) {
    recup_erreur(e);
  }
}


function init_tree_histo(periode) {
  try {
		
		var aHisto = new Arbre('Facturation/GetRDF/historique_fournisseur.tmpl', 'hi-histo');
		aHisto.setParam('Periode', periode);
		aHisto.setParam('Fournisseur_Id', currentFournisseur);
		if (periode=="P") {
			var date_debut = document.getElementById('hi-Date_Debut').value;
			var date_fin = document.getElementById('hi-Date_Fin').value;			
			aHisto.setParam('Date_Debut', prepareDateJava(date_debut));
			aHisto.setParam('Date_Fin', prepareDateJava(date_fin));
		}
		aHisto.initTree(calculCA);

  } catch (e) {
    recup_erreur(e);
  }
}


function choixCommande() {
	try {
		var tree = document.getElementById('hi-histo');
		if (tree.view!=null && tree.currentIndex!=-1) {
			var commande_id = getCellText(tree,tree.currentIndex,'hi-ColCommande_Id');
			var page = "chrome://opensi/content/facturation/user/commandes/edition_commande.xul?"+ cookie();
			page += "&Commande_Id="+ commande_id;
			page += "&Mode=V";
			window.location = page;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


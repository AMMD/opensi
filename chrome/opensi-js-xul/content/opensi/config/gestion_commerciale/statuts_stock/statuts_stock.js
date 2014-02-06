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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var aStatuts = new Arbre('Config/GetRDF/listeStatutsMvtStock.tmpl', 'liste_statuts');
var statut_id = -1;


function init() {
	try {

		aStatuts.initTree(nouveauStatut);

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauStatut() {
	try {

		document.getElementById('liste_statuts').view.selection.clearSelection();

		document.getElementById('bSupprimer').disabled = true;
		document.getElementById('bAjouter').collapsed = false;
		document.getElementById('bModifier').collapsed = true;
		document.getElementById('bNouveau').disabled = true;
		document.getElementById('Statut').value="";
		statut_id=-1;

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerStatut() {
	try {

		var tree = document.getElementById('liste_statuts');

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById('bSupprimer').disabled = false;
			document.getElementById('bNouveau').disabled = false;
			document.getElementById('bAjouter').collapsed = true;
			document.getElementById('bModifier').collapsed = false;			
			document.getElementById('Statut').value=getCellText(tree,tree.currentIndex,'ColStatut');
			statut_id = getCellText(tree,tree.currentIndex,'ColId');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerStatut() {
	try {

		var tree = document.getElementById('liste_statuts');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var statut = getCellText(tree,tree.currentIndex,'ColStatut');

			if (window.confirm("Confirmez-vous la suppression du statut '"+ statut +"' ?")) {

				var querySup = new QueryHttp("Config/gestion_commerciale/statuts_stock/supprimerStatut.tmpl");
				querySup.setParam('Statut_Id', statut_id);
				querySup.execute();

				aStatuts.initTree();
				nouveauStatut();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerStatut() {
	try {

		var statut = document.getElementById('Statut').value;

		if (isEmpty(statut)) {
			showWarning("Veuillez remplir le champ 'Statut' !");
		}
		else {
			var querySave = new QueryHttp("Config/gestion_commerciale/statuts_stock/creerStatut.tmpl");
			querySave.setParam('Statut', statut);
			var rep = querySave.execute();

			if (rep.responseXML.documentElement.getAttribute('existe')=="true") {
				showWarning("Le statut '"+ statut +"' existe déjà");
			}
			else {
				aStatuts.initTree();
				nouveauStatut();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function modifierStatut() {
	try {

		var statut = document.getElementById('Statut').value;

		if (isEmpty(statut)) {
			showWarning("Veuillez remplir le champ 'Statut' !");
		}
		else {
			var queryMod = new QueryHttp("Config/gestion_commerciale/statuts_stock/modifierStatut.tmpl");
			queryMod.setParam('Statut', statut);
			queryMod.setParam('Statut_Id', statut_id);
			var rep = queryMod.execute();

			if (rep.responseXML.documentElement.getAttribute('existe')=="true") {
				showWarning("Le statut '"+ statut +"' existe déjà");
			}
			else {
				aStatuts.initTree();
				nouveauStatut();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

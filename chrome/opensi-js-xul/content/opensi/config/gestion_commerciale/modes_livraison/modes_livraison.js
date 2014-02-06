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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var curModeLivraisonId = '';
var curNomModeLivraison = '';
var aModesLivraison = new Arbre("Config/GetRDF/listeModesLivraison.tmpl", "liste_modes_livraison");
var aOrganismes = new Arbre("Config/GetRDF/listeOrgLivraison.tmpl", "Organisme");
var aFormatsExport = new Arbre("Config/GetRDF/listeFormatsExportColis.tmpl", "Format");


function init() {
	try {

		aModesLivraison.initTree();
		aOrganismes.initTree(initOrganisme);
		aFormatsExport.initTree(initExport);

	} catch (e) {
    recup_erreur(e);
  }
}

function initOrganisme() {
	try {
		document.getElementById('Organisme').selectedIndex = 0;
	} catch (e) {
		recup_erreur(e);
	}
}


function initExport() {
	try {
		document.getElementById('Format').selectedIndex = 0;
	} catch (e) {
		recup_erreur(e);
	}
}



function selectModeLivraison() {
	try {

		if (aModesLivraison.isSelected()) {
			var currentIndex = aModesLivraison.getCurrentIndex();

			curModeLivraisonId = aModesLivraison.getCellText(currentIndex, 'ColModeLivId');
			curNomModeLivraison = aModesLivraison.getCellText(currentIndex, 'ColNom');

			document.getElementById('Nom').value = aModesLivraison.getCellText(currentIndex, 'ColNom');
			document.getElementById('typeLiv').value = aModesLivraison.getCellText(currentIndex, 'ColTypeLiv');
			document.getElementById('Organisme').value = aModesLivraison.getCellText(currentIndex, 'ColOrganismeId');
			document.getElementById('Format').value = aModesLivraison.getCellText(currentIndex, 'ColFormat');

			document.getElementById('bSupprimer').disabled = false;
			document.getElementById('bNouveau').disabled = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauMode() {
	try {
		
		if (aModesLivraison.isSelected()) {
			aModesLivraison.select(-1);
		}

		document.getElementById('Nom').value = "";
		document.getElementById('typeLiv').value = "E";
		document.getElementById('Organisme').selectedIndex = 0;
		document.getElementById('Format').selectedIndex = 0;

		document.getElementById('bSupprimer').disabled = true;
		document.getElementById('bNouveau').disabled = true;

		curModeLivraisonId = '';
		curNomModeLivraison = '';

	} catch (e) {
    recup_erreur(e);
  }
}



function supprimerMode() {
	try {

		if (curModeLivraisonId != '') {

			if (window.confirm("Confirmez-vous la suppression du mode de livraison '"+ curNomModeLivraison +"' ?")) {

				var qSupprimerMode = new QueryHttp("Config/gestion_commerciale/modes_livraison/supprimerModeLivraison.tmpl");
				qSupprimerMode.setParam("Mode_Liv_Id", curModeLivraisonId);
				var result = qSupprimerMode.execute();
				if (result.responseXML.documentElement.getAttribute("ok")=="true") {
					aModesLivraison.initTree();
					nouveauMode();
				} else { showWarning("Impossible de supprimer ce mode de livraison car il est utilisé !"); }
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}




function enregistrerMode() {
	try {
		
		var qEnregistrerMode;
		if (curModeLivraisonId != '') {
			qEnregistrerMode = new QueryHttp("Config/gestion_commerciale/modes_livraison/modifierModeLivraison.tmpl");
			qEnregistrerMode.setParam("Mode_Liv_Id", curModeLivraisonId);
		} else {
			qEnregistrerMode = new QueryHttp("Config/gestion_commerciale/modes_livraison/creerModeLivraison.tmpl");
		}
		
		var nom = document.getElementById('Nom').value;
		var typeLiv = document.getElementById('typeLiv').value;
		var organisme = document.getElementById('Organisme').value;
		var format = document.getElementById('Format').value;
		
		if (isEmpty(nom)) {
			showWarning("Veuillez saisir le nom du mode de livraison !");
		}
		else {
			qEnregistrerMode.setParam("Nom", nom);
			qEnregistrerMode.setParam("Type_Liv", typeLiv);
			qEnregistrerMode.setParam("Organisme", organisme);
			qEnregistrerMode.setParam("Format", format);

			var result = qEnregistrerMode.execute();
			if (result.responseXML.documentElement.getAttribute("Ok")=="true") {
				aModesLivraison.initTree();
				nouveauMode();
			} else {
				showWarning("Erreur : le nom du mode de livraison saisi est déjà utilisé !");
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


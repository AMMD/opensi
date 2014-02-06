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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


function init() {
	try {		
		
		var aExos = new Arbre('Compta/GetRDF/Dossier.tmpl', 'Exercice');
		aExos.initTree(initExercice);
		
		var aTypesImport = new Arbre('Compta/GetRDF/types_import.tmpl', 'Type_Import');
		aTypesImport.initTree(initType_Import);
		
		var aJVE = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'Journal');
		aJVE.setParam('Type_Journal', 'VE');
		aJVE.initTree(initJournal);

	} catch (e) {
    recup_erreur(e);
  }
}

function initExercice() {
	try {

		document.getElementById('Exercice').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}

function initType_Import() {
	try {

		document.getElementById('Type_Import').selectedIndex = 0;
		loadFormats(document.getElementById('Type_Import').value);

	} catch (e) {
    recup_erreur(e);
  }
}

function initFormat_Import() {
	try {

		document.getElementById('Format_Import').selectedIndex = 0;
		cacher();

	} catch (e) {
    recup_erreur(e);
  }
}

function initJournal() {
	try {

		document.getElementById('Journal').selectedIndex = 0;
		cacher();

	} catch (e) {
    recup_erreur(e);
  }
}

function cacher () {
	try {

		var fact=(document.getElementById('Format_Import').value=="CE_CSV_ASC");
		document.getElementById('jour').collapsed=!fact;
		
	} catch (e) {
    recup_erreur(e);
  }
}

function loadFormats(import_id) {
	try {
		
		var aFormats = new Arbre('Compta/GetRDF/formats_import.tmpl', 'Format_Import');
		aFormats.setParam('Import_Id', import_id);
		aFormats.initTree(initFormat_Import);

	} catch (e) {
    recup_erreur(e);
  }
}


function importer() {
	try {

		var base = document.getElementById('Exercice').value;
		var format = document.getElementById('Format_Import').value;
		var journal = document.getElementById('Journal').value;
		var fact=(format=="CE_CSV_ASC");

		if (isEmpty(document.getElementById('FichierImport').value)) {
			showWarning('Vous devez selectionner un fichier à importer !');
		}
		else if (isEmpty(journal) && fact) {
			showWarning('Vous devez indiquer un journal de vente !');
		}
		else {

			document.getElementById('boxJournal').collapsed = true;
			document.getElementById('bImporter').disabled = true;
			document.getElementById('progression').collapsed = false;
			document.getElementById('pm').setAttribute("mode", "undetermined");

			var fichierImport = getFileName(document.getElementById('FichierImport').value);
			var url = "chrome://opensi/content/compta/util/upload.xul?"+ cookie();
    	url += "&file="+ document.getElementById('FichierImport').value;
			url += "&dir=iobuffer";
   		window.openDialog(url,'','chrome,modal,centerscreen');
			
			var aRapport = new Arbre('Compta/Import/ProcessImport.tmpl', 'rapport');
			aRapport.setParam('FichierImport', fichierImport);
			aRapport.setParam('Base', base);
			aRapport.setParam('Format', format);
			if (!fact) {
				aRapport.setParam('Journal', 0);
			}
			else {
				aRapport.setParam('Journal', journal);
			}
			aRapport.initTree(importer_2);			
    }

	} catch (e) {
    recup_erreur(e);
  }
}


function importer_2() {
	try {

		document.getElementById('pm').setAttribute("mode", "none");
		document.getElementById('progression').collapsed = true;
		document.getElementById('bImporter').disabled = false;
		document.getElementById('boxJournal').collapsed = false;

		showMessage("Import terminé");

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

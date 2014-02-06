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

var treeExpe = new Arbre('Facturation/Expedition/liste-modesExpedition.tmpl','expe');
var treeFormatsExport = new Arbre("Facturation/GetRDF/liste-formatsExportColis.tmpl", "FormatExport");
var treeFormatsImport = new Arbre("Facturation/GetRDF/liste-formatsImportColis.tmpl", "FormatImport");
var qDates = new QueryHttp("GetDates.tmpl");


function init() {
	try {
		
		var qExisteSites = new QueryHttp("Facturation/Affaires/existeSites.tmpl");
		var result = qExisteSites.execute();
		document.getElementById('boxProvenance').collapsed = (result.responseXML.documentElement.getAttribute("Existe")=="false");

		document.getElementById('Periode').value="A";

		var result = qDates.execute();

		var auj = result.responseXML.documentElement.getAttribute("auj");
		var demain = result.responseXML.documentElement.getAttribute("demain");

		document.getElementById('Date_Debut').value=auj;
		document.getElementById('Date_Fin').value=demain;

    treeExpe.initTree();
    treeFormatsExport.initTree(initFormatExport);
    treeFormatsImport.initTree(initFormatImport);

	} catch (e) {
    recup_erreur(e);
  }
}


function initFormatExport() {
	try {

		document.getElementById('FormatExport').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function initFormatImport() {
	try {

		document.getElementById('FormatImport').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function disableDates(b) {
	try {

		document.getElementById('Date_Debut').disabled = b;
		document.getElementById('Date_Fin').disabled = b;
		document.getElementById('Heure_Debut').disabled = b;
		document.getElementById('Heure_Fin').disabled = b;

	} catch (e) {
    recup_erreur(e);
  }
}


function testcheck(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		if (cks.item(0).getAttribute("checked")=="false") {
			cks.item(0).setAttribute("checked","true");
		} else {
			cks.item(0).setAttribute("checked","false");
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function exporter() {
	try {

		var expediteur="";
		var listbox = document.getElementById("expe");

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;
			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				if (cks.item(0).getAttribute("checked")=="true") {
					expediteur += item.value+",";
				}
				i++;
			}
		}
		
		if (expediteur!="") {
			expediteur = expediteur.substring(0,expediteur.length-1);
		}

		document.getElementById('progression').collapsed = false;
		document.getElementById('pm').setAttribute("mode", "undetermined");
		document.getElementById('bExporter').disabled = true;

		var result = qDates.execute();

		var date = result.responseXML.documentElement.getAttribute("now");

		var fichier_sugg = get_cookie("Dossier_Id")+"_"+date+ ".csv";
		var heure = document.getElementById('Heure').value;
		var heure_debut = document.getElementById('Heure_Debut').value;
		var heure_fin = document.getElementById('Heure_Fin').value;
		var date_debut = document.getElementById('Date_Debut').value;
		var date_fin = document.getElementById('Date_Fin').value;
		var colis = document.getElementById('noncolis').checked;
		var provenance = document.getElementById('provenance').value;
		var format = document.getElementById('FormatExport').value;
		if (document.getElementById('PeriodeDD').selected && (!isDate(date_fin) || !isDate(date_debut))) {
			showMessage("Plage de dates invalide !");
			document.getElementById('progression').collapsed = true;
			document.getElementById('bExporter').disabled = false;
		}
		else {
			var corps = cookie() +"&Page=Facturation/Expedition/ProcessExport.tmpl&ContentType=xml";
			corps += "&Heure="+ heure;
			corps += "&Heure_Debut="+ heure_debut;
			corps += "&Heure_Fin="+ heure_fin;
			corps += "&Date_Debut="+ date_debut;
			corps += "&Date_Fin="+ date_fin;
			corps += "&Colis="+ colis;
			corps += "&Provenance="+ provenance;
			corps += "&Expediteur="+ expediteur;
			corps += "&Periode="+ document.getElementById('Periode').value;
			corps += "&Format="+ format;
	    requeteHTTP(corps,new XMLHttpRequest(),exporter_2);
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function exporter_2(req1) {
	try {

		var contenu = req1.responseXML.documentElement;

		var action_error = contenu.getAttribute('action_error');
		var fichier_export = contenu.getAttribute('fichier_export');
		var nom_sugg = contenu.getAttribute('nom_sugg');

		document.getElementById('pm').setAttribute("mode", "none");
		document.getElementById('progression').collapsed = true;
		document.getElementById('bExporter').disabled = false;

		if (action_error!="") {
			showWarning(action_error);
		} else {
			var file = fileChooser("save", nom_sugg);
			if (file!=null) {
				downloadFile(getDirBuffer()+ fichier_export, file);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function importer() {
	try {

    if (isEmpty(document.getElementById('FichierImport').value)) {
			showWarning('Vous devez sélectionner un fichier à importer !');
		} else {
			var format = document.getElementById('FormatImport').value;
			var fichierImport = getFileName(document.getElementById('FichierImport').value);
			var url = "chrome://opensi/content/compta/util/upload.xul?"+ cookie();
    	url += "&file="+ document.getElementById('FichierImport').value;
			url += "&dir=iobuffer";
   		window.openDialog(url,'','chrome,modal,centerscreen');

			var queryImport = new QueryHttp("Facturation/Expedition/ProcessImport.tmpl");
			queryImport.setParam("Format",format);
			queryImport.setParam("Fichier",fichierImport);
			queryImport.execute();

			showMessage("Les numéros de colis ont été mis à jour !");
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

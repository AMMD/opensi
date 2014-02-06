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


var oc_codeEtat = 'PC';

function initClients() {
  try {
		
		var aFamille = new Arbre('Facturation/GetRDF/familles_client.tmpl', 'oc-Famille');
		aFamille.initTree(oc_initFamille);
		
		var aCommercial = new Arbre('Facturation/GetRDF/liste_commerciaux.tmpl', 'oc-Commercial');
		aCommercial.setParam('tabbord', 'true');
		aCommercial.initTree(oc_initCommercial);

    oc_enableDates(false);
		
		document.getElementById('oc-Periode').selectedItem = document.getElementById('oc-PeriodeMC');
		document.getElementById('oc-DetailCA').selectedItem = document.getElementById('oc-DetailCAN');
		
		oc_switchOptions('PC');

  } catch (e) {
    recup_erreur(e);
  }
}


function oc_initFamille() {
	try {

		document.getElementById('oc-Famille').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}

function oc_initCommercial() {
	try {

		document.getElementById('oc-Commercial').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function oc_switchOptions(etat) {
  try {

		oc_codeEtat = etat;

		var gPeriode = document.getElementById('oc-gPeriode');
		var gSelection = document.getElementById('oc-gSelection');
		var gTri = document.getElementById('oc-gTri');
		var gDetailCA = document.getElementById('oc-gDetailCA');

		switch (etat) {
			case 'PC': gPeriode.collapsed = false;
								 gSelection.collaped = false;
								 gDetailCA.collapsed = false;
								 gTri.collapsed = true;
								 break;
			case 'LC': gPeriode.collapsed = true;
								 gSelection.collaped = false;
								 gDetailCA.collapsed = true;
								 gTri.collapsed = false;
								 break;
			case 'FC': break;
			case 'PD': break;
			case 'AC': break;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oc_enableDates(b) {
	try {

		document.getElementById("oc-DateDebut").disabled = !b;
		document.getElementById("oc-DateFin").disabled = !b;

	} catch (e) {
    recup_erreur(e);
  }
}


function oc_editerPalmaresCsv() {
	try {

		var periode = document.getElementById('oc-Periode').value;
		var detail = document.getElementById('oc-DetailCA').value;
		var date_debut = document.getElementById('oc-DateDebut').value;
		var date_fin = document.getElementById('oc-DateFin').value;
		var famille = document.getElementById('oc-Famille').value;
		var commercial = document.getElementById('oc-Commercial').value;
		var tri1 = document.getElementById('oc-Tri1').value;
		var tri2 = document.getElementById('oc-Tri2').value;
		var tri3 = document.getElementById('oc-Tri3').value;
		var tarifs_spe = (document.getElementById('oc-Tarifs_Spe').checked?"1":"0");
		
		
		if (oc_codeEtat=="PC" && periode=="DD" && !isDate(date_debut)) { showWarning("Date de début de période incorrecte"); }
		else if (oc_codeEtat=="PC" && periode=="DD" && !isDate(date_fin)) { showWarning("Date de fin de période incorrecte"); }
		else if (oc_codeEtat=="PC" && periode=="DD" && !isDateInterval(date_debut, date_fin)) { showWarning("Plage de date incorrecte"); }
		else {

			if (periode=="DD") {
				date_fin = prepareDateJava(date_fin);
				date_debut = prepareDateJava(date_debut);
			}
			
			var queryEdit = new QueryHttp("Facturation/Editions/editionCsvClient.tmpl");
			
			queryEdit.setParam("Periode",periode);
			queryEdit.setParam("Detail",detail);
			queryEdit.setParam("DateDebut",date_debut);
			queryEdit.setParam("DateFin",date_fin);
			queryEdit.setParam("Famille",famille);
			queryEdit.setParam("Commercial",commercial);
			queryEdit.setParam("Tri1",tri1);
			queryEdit.setParam("Tri2",tri2);
			queryEdit.setParam("Tri3",tri3);
			queryEdit.setParam("Tarifs_Spe", tarifs_spe);
			queryEdit.setParam("CodeEtat", oc_codeEtat);

			queryEdit.execute(oc_editerPalmaresCsv_2);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oc_editerPalmaresCsv_2(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		var fichier = contenu.getAttribute('FichierCsv');
		
		var nom_defaut;
		switch(oc_codeEtat) {
			case "PC": nom_defaut = "palmaresClient.csv"; break;
			case "LC": nom_defaut = "listeClients.csv"; break;
		}

		var file = fileChooser("save", nom_defaut);

		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oc_editerPalmaresPdf() {
	try {

		var periode = document.getElementById('oc-Periode').value;
		var detail = document.getElementById('oc-DetailCA').value;
		var date_debut = document.getElementById('oc-DateDebut').value;
		var date_fin = document.getElementById('oc-DateFin').value;
		var famille = document.getElementById('oc-Famille').value;
		var commercial = document.getElementById('oc-Commercial').value;
		var tri1 = document.getElementById('oc-Tri1').value;
		var tri2 = document.getElementById('oc-Tri2').value;
		var tri3 = document.getElementById('oc-Tri3').value;
		var tarifs_spe = (document.getElementById('oc-Tarifs_Spe').checked?"1":"0");

		if (oc_codeEtat=="PC" && periode=="DD" && !isDate(date_debut)) { showWarning("Date de début de période incorrecte"); }
		else if (oc_codeEtat=="PC" && periode=="DD" && !isDate(date_fin)) { showWarning("Date de fin de période incorrecte"); }
		else if (oc_codeEtat=="PC" && periode=="DD" && !isDateInterval(date_debut, date_fin)) { showWarning("Plage de date incorrecte"); }
		else {

			if (periode=="DD") {
				date_fin = prepareDateJava(date_fin);
				date_debut = prepareDateJava(date_debut);
			}

			var listeParams = "&Periode="+ periode +"&Detail="+ detail;
			listeParams += "&DateDebut="+ date_debut +"&DateFin="+ date_fin;
			listeParams += "&Famille="+ urlEncode(famille) +"&Commercial="+ urlEncode(commercial);
			listeParams += "&Tri1="+ tri1 +"&Tri2="+ tri2 +"&Tri3="+ tri3 +"&Tarifs_Spe="+ tarifs_spe +"&CodeEtat="+ oc_codeEtat;

			var page = getUrlOpeneas("&Page=Facturation/Editions/editionPdfClient.tmpl"+ listeParams);
			document.getElementById('pdf').setAttribute("src", page);
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('bMenuEditions').collapsed = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oc_editerPalmares() {
	try {
	
		var sortie = document.getElementById('oc-Sortie').value;
		if (sortie == "CSV") {
			oc_editerPalmaresCsv();
		} else {
			oc_editerPalmaresPdf();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


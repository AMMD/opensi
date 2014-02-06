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

var of_codeEtat = 'PF';

function initFournisseurs() {
  try {
		
		var aFamille = new Arbre('Facturation/GetRDF/familles_fournisseur.tmpl', 'of-Famille');
		aFamille.initTree(of_initFamille);

    of_enableDates(false);
		document.getElementById('of-Periode').selectedItem = document.getElementById('of-PeriodeMC');
		document.getElementById('of-DetailCA').selectedItem = document.getElementById('of-DetailCAN');

		of_switchOptions('PF');

  } catch (e) {
    recup_erreur(e);
  }
}


function of_initFamille() {
	try {

		document.getElementById('of-Famille').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function of_switchOptions(etat) {
  try {

		of_codeEtat = etat;

		var gPeriode = document.getElementById('of-gPeriode');
		var gSelection = document.getElementById('of-gSelection');
		var gDetailCA = document.getElementById('of-gDetailCA');
		var gTri = document.getElementById('of-gTri');

		switch (etat) {
			case 'PF': gPeriode.collapsed = false;
								 gSelection.collaped = false;
								 gDetailCA.collapsed = false;
								 gTri.collapsed = true;
								 break;
			case 'LF': gPeriode.collapsed = true;
								 gSelection.collaped = false;
								 gDetailCA.collapsed = true;
								 gTri.collapsed = false;
								 break;
			case 'FF': break;
			case 'AF': break;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function of_enableDates(b) {
	try {

		document.getElementById("of-DateDebut").disabled = !b;
		document.getElementById("of-DateFin").disabled = !b;

	} catch (e) {
    recup_erreur(e);
  }
}


function of_editerPalmaresCsv() {
	try {

		var periode = document.getElementById('of-Periode').value;
		var detail = document.getElementById('of-DetailCA').value;
		var date_debut = document.getElementById('of-DateDebut').value;
		var date_fin = document.getElementById('of-DateFin').value;
		var famille = document.getElementById('of-Famille').value;
		var tri1 = document.getElementById('of-Tri1').value;
		var tri2 = document.getElementById('of-Tri2').value;
		var tri3 = document.getElementById('of-Tri3').value;
		
		
		if (of_codeEtat=="PF" && periode=="DD" && !isDate(date_debut)) { showWarning("Date de début de période incorrecte"); }
		else if (of_codeEtat=="PF" && periode=="DD" && !isDate(date_fin)) { showWarning("Date de fin de période incorrecte"); }
		else if (of_codeEtat=="PF" && periode=="DD" && !isDateInterval(date_debut, date_fin)) { showWarning("Plage de date incorrecte"); }
		else {

			if (periode=="DD") {
				date_fin = prepareDateJava(date_fin);
				date_debut = prepareDateJava(date_debut);
			}
			
			var queryEdit = new QueryHttp("Facturation/Editions/editionCsvFournisseur.tmpl");
			
			queryEdit.setParam("Periode",periode);
			queryEdit.setParam("Detail",detail);
			queryEdit.setParam("DateDebut",date_debut);
			queryEdit.setParam("DateFin",date_fin);
			queryEdit.setParam("Famille",famille);
			queryEdit.setParam("Tri1",tri1);
			queryEdit.setParam("Tri2",tri2);
			queryEdit.setParam("Tri3",tri3);
			queryEdit.setParam("CodeEtat", of_codeEtat);

			queryEdit.execute(of_editerPalmaresCsv_2);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function of_editerPalmaresCsv_2(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		var fichier = contenu.getAttribute('FichierCsv');
		
		var nom_defaut;
		switch(of_codeEtat) {
			case "PF": nom_defaut = "palmaresFournisseur.csv"; break;
			case "LF": nom_defaut = "listeFournisseurs.csv"; break;
		}

		var file = fileChooser("save", nom_defaut);

		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function of_editerPalmaresPdf() {
	try {

		var periode = document.getElementById('of-Periode').value;
		var detail = document.getElementById('of-DetailCA').value;
		var date_debut = document.getElementById('of-DateDebut').value;
		var date_fin = document.getElementById('of-DateFin').value;
		var famille = document.getElementById('of-Famille').value;
		var tri1 = document.getElementById('of-Tri1').value;
		var tri2 = document.getElementById('of-Tri2').value;
		var tri3 = document.getElementById('of-Tri3').value;

		if (of_codeEtat=="PF" && periode=="DD" && !isDate(date_debut)) { showWarning("Date de début de période incorrecte"); }
		else if (of_codeEtat=="PF" && periode=="DD" && !isDate(date_fin)) { showWarning("Date de fin de période incorrecte"); }
		else if (of_codeEtat=="PF" && periode=="DD" && !isDateInterval(date_debut, date_fin)) { showWarning("Plage de date incorrecte"); }
		else {

			if (periode=="DD") {
				date_fin = prepareDateJava(date_fin);
				date_debut = prepareDateJava(date_debut);
			}

			var listeParams = "&Periode="+ periode +"&Detail="+ detail;
			listeParams += "&DateDebut="+ date_debut +"&DateFin="+ date_fin;
			listeParams += "&Famille="+ urlEncode(famille);
			listeParams += "&Tri1="+ tri1 +"&Tri2="+ tri2 +"&Tri3="+ tri3 +"&CodeEtat="+ of_codeEtat;
			
			var page = getUrlOpeneas("&Page=Facturation/Editions/editionPdfFournisseur.tmpl"+ listeParams);
			document.getElementById('pdf').setAttribute("src", page);
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('bMenuEditions').collapsed = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function of_editerPalmares() {
	try {
	
		var sortie = document.getElementById('of-Sortie').value;
		if (sortie == "CSV") {
			of_editerPalmaresCsv();
		} else {
			of_editerPalmaresPdf();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

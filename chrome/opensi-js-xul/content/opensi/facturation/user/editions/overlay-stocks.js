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


var os_codeEtat = 'PA';

var os_aFamille1 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'os-Famille_1');
var os_aFamille2 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'os-Famille_2');
var os_aFamille3 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'os-Famille_3');
var os_aMarque = new Arbre('Facturation/GetRDF/combo-marquesArticle.tmpl', 'os-Marque');

function initStocks() {
  try {
		
		os_aFamille1.initTree(os_initFamille1);
		os_aMarque.initTree(os_initMarque);
		
    os_enableDates(false);
		//document.getElementById('os-Periode').value = "MC";
		document.getElementById('os-gPeriode').collapsed=true;
		//document.getElementById('valo').value='cump';
		
		os_switchOptions('PA');

  } catch (e) {
    recup_erreur(e);
  }
}


function os_initFamille1() {
  try {

		document.getElementById('os-Famille_1').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function os_chargerFamilles2() {
	try {
  	
		os_aFamille2.setParam('Parent_Id', document.getElementById('os-Famille_1').value);
		os_aFamille2.initTree(os_initFamille2);

	} catch (e) {
		recup_erreur(e);
	}
}


function os_initFamille2() {
  try {

		document.getElementById('os-Famille_2').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function os_chargerFamilles3() {
	try {
  	
		os_aFamille3.setParam('Parent_Id', document.getElementById('os-Famille_2').value);
		os_aFamille3.initTree(os_initFamille3);

	} catch (e) {
		recup_erreur(e);
	}
}


function os_initFamille3() {
  try {

		document.getElementById('os-Famille_3').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function os_initMarque() {
	try {

		document.getElementById('os-Marque').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}



function os_switchOptions(etat) {
  try {

		os_codeEtat = etat;
		var gDateArrete = document.getElementById('gp-dateArrete');
		var gValo = document.getElementById('gp-valorisation');
		var gPeriode = document.getElementById('os-gPeriode');
		var mvte = document.getElementById('os-mvte');
		var gSelection = document.getElementById('os-gSelection');
		var gSortie = document.getElementById('os-gSortie');
		var rStockEntier = document.getElementById('os-RowStockEntier');
   
		switch (etat) {
			case 'PA': gPeriode.collapsed = false;
								 mvte.collapsed = true;
								 gSelection.collapsed = false;
								 gSortie.collapsed = false;
								 rStockEntier.collapsed = true;
								 gValo.collapsed=true;
								 gDateArrete.collapsed=true;
								 break;
			case 'FA': gPeriode.collapsed = true;
								 mvte.collapsed = true;
								 gSelection.collapsed = false;
								 gSortie.collapsed = false;
								 rStockEntier.collapsed = true;
								 gValo.collapsed=true;
								 gDateArrete.collapsed=true;
								 break;
			case 'MS': gPeriode.collapsed = false;			
								 mvte.collapsed = false;
								 gSelection.collapsed = false;
								 gSortie.collapsed = true;
								 rStockEntier.collapsed = true;
								 gValo.collapsed=true;
								 gDateArrete.collapsed=true;
								 break;
								 
			case 'ES': gPeriode.collapsed = true;
								 mvte.collapsed = true;
								 gSelection.collapsed = false;
								 gSortie.collapsed = false;
								 rStockEntier.collapsed = false;
								 gValo.collapsed=false;
								 gDateArrete.collapsed=false;
								 break;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function os_enableDates(b) {
	try {

		document.getElementById("os-DateDebut").disabled = !b;
		document.getElementById("os-DateFin").disabled = !b;

	} catch (e) {
    recup_erreur(e);
  }
}


function os_editerPalmaresCsv() {
	try {

		var periode = document.getElementById('os-Periode').value;
		var date_debut = document.getElementById('os-DateDebut').value;
		var date_fin = document.getElementById('os-DateFin').value;
		var famille1 = document.getElementById('os-Famille_1').value;
		var famille2 = document.getElementById('os-Famille_2').value;
		var famille3 = document.getElementById('os-Famille_3').value;
		var marque = document.getElementById('os-Marque').value;
		var stockEntier = document.getElementById('os-StockEntier').checked?1:0;
		var valorisation = document.getElementById('valo').value;
		var dateArrete = document.getElementById('os-dateArrete').value;
		
		if (os_codeEtat=="PA" && periode=="DD" && !isDate(date_debut)) { showWarning("Date de début de période incorrecte !"); }
		else if (os_codeEtat=="PA" && periode=="DD" && !isDate(date_fin)) { showWarning("Date de fin de période incorrecte !"); }
		else if (os_codeEtat=="PA" && periode=="DD" && !isDateInterval(date_debut, date_fin)) { showWarning("Plage de dates incorrecte !"); }
		else if (os_codeEtat=="ES" && !isEmpty(dateArrete) && !isDate(dateArrete)) { showWarning("Date d'arrêté incorrecte !"); }
		else {

			if (periode=="DD") {
				date_fin = prepareDateJava(date_fin);
				date_debut = prepareDateJava(date_debut);
			}
			
			if (os_codeEtat=="ES" && isDate(dateArrete)) {
				dateArrete = prepareDateJava(dateArrete);
			}
			
		 	var queryEdit = new QueryHttp("Facturation/Editions/editionCsvStock.tmpl");
			queryEdit.setParam("Periode",periode);
			queryEdit.setParam("DateDebut",date_debut);
			queryEdit.setParam("DateFin",date_fin);
			queryEdit.setParam("Famille_1",famille1);
			queryEdit.setParam("Famille_2",famille2);
			queryEdit.setParam("Famille_3",famille3);
			queryEdit.setParam("Marque",marque);
			queryEdit.setParam("valorisation",valorisation);
			queryEdit.setParam("CodeEtat", os_codeEtat);
			queryEdit.setParam("StockEntier", stockEntier);
			queryEdit.setParam("Date_Arrete", dateArrete);

			queryEdit.execute(os_editerPalmaresCsv_2);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function os_editerPalmaresCsv_2(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		var fichier = contenu.getAttribute('FichierCsv');
		
		var nom_defaut;
		switch(os_codeEtat) {
			case "FA": nom_defaut = "listeArticle.csv"; break;
			case "PA": nom_defaut = "palmaresArticle.csv"; break;
			case "ES": nom_defaut = "etatStock.csv"; break;
		}

		var file = fileChooser("save", nom_defaut);

		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function os_editerPalmaresPdf() {
	try {

		var periode = document.getElementById('os-Periode').value;
		var date_debut = document.getElementById('os-DateDebut').value;
		var date_fin = document.getElementById('os-DateFin').value;
		var famille1 = document.getElementById('os-Famille_1').value;
		var famille2 = document.getElementById('os-Famille_2').value;
		var famille3 = document.getElementById('os-Famille_3').value;
		var marque = document.getElementById('os-Marque').value;
		var stockEntier = document.getElementById('os-StockEntier').checked?1:0;
		var valorisation = document.getElementById('valo').value;
		var dateArrete = document.getElementById('os-dateArrete').value;
		var mvte = document.getElementById('os-mvte').checked?1:0;
	
		if ((os_codeEtat=="PA" || os_codeEtat=="MS") && periode=="DD" && !isDate(date_debut)) { showWarning("Date de début de période incorrecte !"); }
		else if ((os_codeEtat=="PA" || os_codeEtat=="MS") && periode=="DD" && !isDate(date_fin)) { showWarning("Date de fin de période incorrecte !"); }
		else if ((os_codeEtat=="PA" || os_codeEtat=="MS") && periode=="DD" && !isDateInterval(date_debut, date_fin)) { showWarning("Plage de dates incorrecte !"); }
		else if (os_codeEtat=="ES" && !isEmpty(dateArrete) && !isDate(dateArrete)) { showWarning("Date d'arrêté incorrecte !"); }
		else {

			if (periode=="DD" && (os_codeEtat=="PA" || os_codeEtat=="MS")) {
				date_fin = prepareDateJava(date_fin);
				date_debut = prepareDateJava(date_debut);
			}
			
			if (os_codeEtat=="ES" && isDate(dateArrete)) {
				dateArrete = prepareDateJava(dateArrete);
			}

			var listeParams = "&Periode="+ periode;
			listeParams += "&DateDebut="+ urlEncode(date_debut) +"&DateFin="+ urlEncode(date_fin);
			listeParams += "&Famille_1="+ urlEncode(famille1) +"&Famille_2="+ urlEncode(famille2) +"&Famille_3="+ urlEncode(famille3);
			listeParams += "&Marque="+ urlEncode(marque) +"&CodeEtat="+ os_codeEtat +"&StockEntier="+ stockEntier+"&valorisation="+valorisation;
			listeParams += "&Date_Arrete="+ dateArrete;
			
			if (os_codeEtat=="MS") {
				listeParams += "&mvte="+ mvte;
			}
			
			var page = getUrlOpeneas("&Page=Facturation/Editions/editionPdfStock.tmpl"+ listeParams);
			document.getElementById('pdf').setAttribute("src", page);
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('bMenuEditions').collapsed = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function os_editerPalmares() {
	try {
	
		var gSortie = document.getElementById('os-gSortie');
		
		var sortie = document.getElementById('os-Sortie').value;
	
		if (!gSortie.collapsed && (sortie == "CSV")) {
			os_editerPalmaresCsv();
		} else {
			os_editerPalmaresPdf();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


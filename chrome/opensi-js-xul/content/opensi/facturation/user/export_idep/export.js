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

var aArticlesSansNC8 = new Arbre("Facturation/GetRDF/articles_idep_sans_nc8.tmpl","articles_idep_sans_nc8");
var aArticlesExport = new Arbre("Facturation/GetRDF/articles_idep.tmpl", "articles_idep");
var aDatesReedition = new Arbre("Facturation/GetRDF/liste_dates_editions_deb.tmpl", "Date_Reedition");
var currentArticle;

function init() {
  try {
		document.getElementById('Periode').value = "MP";
		document.getElementById('Type_Export').value = "E";
		document.getElementById('Format').value = "DECL";
		document.getElementById('Type_Apercu').value = "E1";
		pressOnDates();
		
		var reqDossier = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = reqDossier.execute();
		document.getElementById('Introduction').disabled = (result.responseXML.documentElement.getAttribute('Niveau_Obligation_Intro')==4);
  } catch (e) {
    recup_erreur(e);
  }
}

function initDateReedition() {
	try {
    document.getElementById('Date_Reedition').selectedIndex = 0;
	} catch (e) {
    recup_erreur(e);
  }
}


function initTreeArticlesSansNC8() {
	try {
		currentArticle = "";
		disableEditionNC8(true);
		aArticlesSansNC8.deleteTree();
		var typeExport = document.getElementById('Type_Export').value;
		var periode = document.getElementById('Periode').value;
		var dateDebut = document.getElementById('DateDebut').value;
		var dateFin = document.getElementById('DateFin').value;
		if (periode=="DD") {
			dateFin = prepareDateJava(dateFin);
			dateDebut = prepareDateJava(dateDebut);
		}

		if (document.getElementById('Type_Apercu').value=="E1") {
			aArticlesSansNC8.setParam("Type_Export", typeExport);
			aArticlesSansNC8.setParam("Periode",periode);
			aArticlesSansNC8.setParam("DateDebut",dateDebut);
			aArticlesSansNC8.setParam("DateFin",dateFin);
			aArticlesSansNC8.initTree();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function initTreeArticles() {
	try {
		var typeExport = document.getElementById('Type_Export').value;
		var typeApercu = document.getElementById('Type_Apercu').value;
		var periode = document.getElementById('Periode').value;
		var dateDebut = document.getElementById('DateDebut').value;
		var dateFin = document.getElementById('DateFin').value;
		if (periode=="DD") {
			dateFin = prepareDateJava(dateFin);
			dateDebut = prepareDateJava(dateDebut);
		}
		
		aArticlesExport.setParam("Type_Export", typeExport);
		aArticlesExport.setParam("Type_Apercu", typeApercu);
		aArticlesExport.setParam("Periode",periode);
		aArticlesExport.setParam("DateDebut",dateDebut);
		aArticlesExport.setParam("DateFin",dateFin);
		aArticlesExport.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnDates() {
	try {
		var periode = document.getElementById('Periode').value;
		var typeExport = document.getElementById('Type_Export').value;

		document.getElementById("DateDebut").disabled = (periode!="DD");
		document.getElementById("DateFin").disabled = (periode!="DD");
		document.getElementById("Date_Reedition").disabled = (periode!="RE");
		if (periode=="RE") {
			aDatesReedition.setParam("Type_Export", typeExport);
			aDatesReedition.initTree(initDateReedition);
			aArticlesSansNC8.deleteTree();
			aArticlesExport.deleteTree();
		} else if (periode!="DD") {
			initTreeArticlesSansNC8();
			initTreeArticles();
		}
		
		document.getElementById("Type_Apercu").disabled = (periode=="RE");

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnTypeExport() {
	try {
		var ok=true;
		var periode = document.getElementById('Periode').value;
		var typeExport = document.getElementById('Type_Export').value;
		if (periode=="DD") {
			ok=verifierDate();
		} else if (periode=="RE") {
			aDatesReedition.setParam("Type_Export", typeExport);
			aDatesReedition.initTree(initDateReedition);			
			ok=false;
		}
		
		if (ok) {
			initTreeArticlesSansNC8();
			initTreeArticles();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnTypeApercu() {
	try {
		var typeApercu = document.getElementById('Type_Apercu').value;
		document.getElementById('gFormat').collapsed = (typeApercu=="E2");
		document.getElementById('boxEdition').collapsed = (typeApercu=="E2");
		document.getElementById('boxArticlesSansNC8').collapsed = (typeApercu=="E2");
		
		var periode = document.getElementById('Periode').value;
		if (periode!="RE" && (periode!="DD" || verifierDate())) {
			initTreeArticles();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnTextDate(ev) {
	try {
		if (ev.keyCode==13) {
			if (verifierDate()) {
				initTreeArticlesSansNC8();
				initTreeArticles();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function verifierDate() {
	try {
		var ok=false;
		var dateDebut = document.getElementById('DateDebut').value;
		var dateFin = document.getElementById('DateFin').value;
		
		if (!isDate(dateDebut)) { showWarning("Date de début de période incorrecte !"); }
		else if (!isDate(dateFin)) { showWarning("Date de fin de période incorrecte !"); }
		else if (!isDateInterval(dateDebut, dateFin)) { showWarning("Plage de date incorrecte !"); }
		else {
			ok=true;
		}
		return ok;
	} catch (e) {
		recup_erreur(e);
	}
}



function editer() {
	try {

		var periode = document.getElementById('Periode').value;
		var dateDebut = document.getElementById('DateDebut').value;
		var dateFin = document.getElementById('DateFin').value;
		var typeExport = document.getElementById('Type_Export').value;
		var format = document.getElementById('Format').value;
		var dateReedition = (periode=="RE"?document.getElementById('Date_Reedition').value:0);

		if (periode=="DD" && !isDate(dateDebut)) { showWarning("Date de début de période incorrecte !"); }
		else if (periode=="DD" && !isDate(dateFin)) { showWarning("Date de fin de période incorrecte !"); }
		else if (periode=="DD" && !isDateInterval(dateDebut, dateFin)) { showWarning("Plage de date incorrecte !"); }
		else if (periode=="RE" && (document.getElementById('Date_Reedition').selectedIndex==0)) { showWarning("Veuillez sélectionner une date de réédition !"); }
		else {

			if (periode=="DD") {
				dateFin = prepareDateJava(dateFin);
				dateDebut = prepareDateJava(dateDebut);
			}
			
			var queryEdit = new QueryHttp("Facturation/Export_Idep/edition.tmpl");

			queryEdit.setParam("DateReedition",dateReedition);
			queryEdit.setParam("Periode",periode);
			queryEdit.setParam("DateDebut",dateDebut);
			queryEdit.setParam("DateFin",dateFin);
			queryEdit.setParam("TypeExport", typeExport);
			queryEdit.setParam("Format", format);
			var result = queryEdit.execute();
			var fichier = result.responseXML.documentElement.getAttribute("fichier");
			var action_error = result.responseXML.documentElement.getAttribute("action_error");
			
			var nom_defaut;
			switch(typeExport) {
				case "E": nom_defaut = "declarationExpedition"; break;
				case "I": nom_defaut = "declarationIntroduction"; break;
			}
			switch(format) {
				case "DECL": nom_defaut += ".csv"; break;
				case "INTR": nom_defaut += ".sdf"; break;
			}
	
			if (action_error!="") {
				showWarning(action_error);
			} else {
				var file = fileChooser("save", nom_defaut);
				if (file!=null) {
					downloadFile(getDirBuffer()+ fichier, file);
				}
				if (periode!="RE") {
					initTreeArticles();
					initTreeArticlesSansNC8();
				}
			}
				
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirArticle(ev) {
	try {
		
		if (document.getElementById('Type_Apercu').value=="E1" && aArticlesSansNC8.isSelected()) {
			currentArticle = aArticlesSansNC8.getSelectedCellText('ColRefArticle');
			disableEditionNC8(false);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function disableEditionNC8(b) {
	try {
		document.getElementById('Code_NC8').value="";
		document.getElementById('Code_NC8').disabled=b;
		document.getElementById('bRechercherNC8').disabled=b;
		document.getElementById('bValiderNC8').disabled=b;
	} catch (e) {
		recup_erreur(e);
	}
}


function choixCodeNC8() {
  try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_code_nc8.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',retourChoixCodeNC8);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourChoixCodeNC8(code_nc8) {
  try {

		document.getElementById('Code_NC8').value = code_nc8;

	} catch (e) {
    recup_erreur(e);
  }
}


function validerChoixCodeNC8() {
  try {

		var code_nc8 = document.getElementById('Code_NC8').value;
		
		if (isEmpty(code_nc8) || code_nc8.length < 8 || !isDigitList(code_nc8)) { showWarning("Code NC8 incorrect !"); }
		else {
			var qMajArticle = new QueryHttp("Facturation/Stocks/modifierCodeNC8.tmpl");
			qMajArticle.setParam("Article_Id", currentArticle);
			qMajArticle.setParam("Code_NC8", code_nc8);
			qMajArticle.execute(validerNC8Suite);
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function validerNC8Suite() {
	try {
		initTreeArticlesSansNC8();
		initTreeArticles();
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

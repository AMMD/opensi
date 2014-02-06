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


var ov_codeEtat = 'JV';


function initVentes() {
  try {

    ov_enableDates(false);
		document.getElementById('ov-Periode').value = "MC";
		
		var qActCS = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qActCS.execute();
		var act_code_stats = (parseInt(result.responseXML.documentElement.getAttribute('Act_Code_Stats'))==1);
		if (!act_code_stats) {
			document.getElementById('ov-bStats').collapsed = true;
		}
		
		var aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "ov-secteur");
		aSecteurs.initTree(ov_initSecteur);

  } catch (e) {
    recup_erreur(e);
  }
}


function ov_initSecteur() {
	try {
		document.getElementById('ov-secteur').selectedIndex = 0;
		ov_switchOptions('JV');
	} catch (e) {
		recup_erreur(e);
	}
}


function ov_switchOptions(etat) {
  try {

		ov_codeEtat = etat;

		var gPeriode = document.getElementById('ov-gPeriode');
		var gSecteur = document.getElementById('ov-gSecteur');
		var gDetailCompte = document.getElementById('ov-gDetailCompte');
		var gStatistiques = document.getElementById('ov-gStatistiques');
		var bEditionPDF = document.getElementById('ov-bEditionPDF');
		var bEditionCSV = document.getElementById('ov-bEditionCSV');
		var gPeriodePrecedente = document.getElementById('ov-gPeriodePrecedente');
		var periodeEdition = document.getElementById('ov-Periode');
		var boxMargeMois = document.getElementById('ov-boxMargeMois');
		var boxMargeAnnee = document.getElementById('ov-boxMargeAnnee');
	
		switch (etat) {
			case 'JV': gDetailCompte.collapsed = false;
								 gSecteur.collapsed = false;
								 gStatistiques.collapsed = true;
								 bEditionPDF.collapsed = false;
								 gPeriodePrecedente.collapsed = true;
								 periodeEdition.collapsed = false;
								 boxMargeMois.collapsed = true;
								 boxMargeAnnee.collapsed = true;
								 break;
			case 'JA': gDetailCompte.collapsed = false;
								 gSecteur.collapsed = false;
								 gStatistiques.collapsed = true;
								 bEditionPDF.collapsed = false;
								 gPeriodePrecedente.collapsed = true;
								 periodeEdition.collapsed = false;
								 boxMargeMois.collapsed = true;
								 boxMargeAnnee.collapsed = true;
								 break;
			case 'VA': gDetailCompte.collapsed = true;
								 gSecteur.collapsed = true;
								 gStatistiques.collapsed = true;
								 bEditionPDF.collapsed = true;
								 gPeriodePrecedente.collapsed = true;
								 periodeEdition.collapsed = false;
								 boxMargeMois.collapsed = true;
								 boxMargeAnnee.collapsed = true;
								 break;
			case 'ST': gDetailCompte.collapsed = true;
								 gSecteur.collapsed = true;
								 gStatistiques.collapsed = false;
								 bEditionPDF.collapsed = true;
								 gPeriodePrecedente.collapsed = true;
								 periodeEdition.collapsed = false;
								 boxMargeMois.collapsed = true;
								 boxMargeAnnee.collapsed = true;
								 break;
			case 'MA': gDetailCompte.collapsed = true;
								 gSecteur.collapsed = true;
								 gStatistiques.collapsed = true;
								 bEditionPDF.collapsed = true;
								 gPeriodePrecedente.collapsed = false;
								 periodeEdition.collapsed = true;
								 
								 var margePeriode = document.getElementById('ov-margePeriode').value;
							 	 boxMargeMois.collapsed = (margePeriode=="AP");
								 boxMargeAnnee.collapsed = (margePeriode=="MP");
								 break;
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function ov_switchMargePeriode() {
	try {
		var margePeriode = document.getElementById('ov-margePeriode').value;
		document.getElementById('ov-boxMargeMois').collapsed = (margePeriode=="AP");
		document.getElementById('ov-boxMargeAnnee').collapsed = (margePeriode=="MP");
	} catch (e) {
		recup_erreur(e);
	}
}

function ov_enableDates(b) {
	try {

		document.getElementById("ov-DateDebut").disabled = !b;
		document.getElementById("ov-DateFin").disabled = !b;

	} catch (e) {
    recup_erreur(e);
  }
}


function ov_editer() {
	try {

		var periode = document.getElementById('ov-Periode').value;
		var dateDebut = document.getElementById('ov-DateDebut').value;
		var dateFin = document.getElementById('ov-DateFin').value;
		var detailCompte = (document.getElementById('ov-DetailCompte').checked?"1":"0");
		var secteur = document.getElementById('ov-secteur').value;

		if (periode=="DD" && !isDate(dateDebut)) { showWarning("Date de début de période incorrecte"); }
		else if (periode=="DD" && !isDate(dateFin)) { showWarning("Date de fin de période incorrecte"); }
		else if (periode=="DD" && !isDateInterval(dateDebut, dateFin)) { showWarning("Plage de date incorrecte"); }
		else {

			if (periode=="DD") {
				dateFin = prepareDateJava(dateFin);
				dateDebut = prepareDateJava(dateDebut);
			}

			var qEditionPdf = new QueryHttp("Facturation/Editions/editionPdfVentes.tmpl");
			qEditionPdf.setParam("Periode", periode);
			qEditionPdf.setParam("DetailCompte", detailCompte);
			qEditionPdf.setParam("DateDebut", dateDebut);
			qEditionPdf.setParam("DateFin", dateFin);
			qEditionPdf.setParam("CodeEtat", ov_codeEtat);
			qEditionPdf.setParam("Secteur_Activite", secteur);
			var result = qEditionPdf.execute();
			var contenu = result.responseXML.documentElement;

			if (ov_codeEtat=="JV") {
				var coherent = (contenu.getAttribute('Coherent')=="true");
				if (!coherent) { showWarning("Le document généré est incohérent. Veuillez contacter votre administrateur OpenSi."); }
			}
			
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('FichierPDF');
			document.getElementById('pdf').setAttribute("src", page);
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('bMenuEditions').collapsed = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}



function ov_editerCSV() {
	try {
		var queryEdit = new QueryHttp("Facturation/Editions/editionCsvVentes.tmpl");
		
		if (ov_codeEtat=="MA") {
			
			var periode = document.getElementById('ov-margePeriode').value;
			if (periode=="MP") {
				var mois = document.getElementById('ov-margeMois').value;
				if (!isPeriode(mois)) {
					showWarning("La date doit être au format mmaa");
				} else {
					queryEdit.setParam("Periode",periode);
					queryEdit.setParam("Mois",preparePeriodeJava(mois));
					queryEdit.setParam("CodeEtat", ov_codeEtat);
					queryEdit.execute(ov_editerCsv_2);
				}
			} else {
				var dateDebut = document.getElementById('ov-margeDateDebut').value;
				var dateFin = document.getElementById('ov-margeDateFin').value;
		  	if (!isPeriode(dateDebut)) { showWarning("Date de début de période incorrecte"); }
		  	else if (!isPeriode(dateFin)) { showWarning("Date de fin de période incorrecte"); }
		  	else if (!isPeriodeInterval(dateDebut, dateFin)) { showWarning("Plage de périodes incorrecte"); }
		  	else {
					var dateDebut = preparePeriodeJava(document.getElementById('ov-margeDateDebut').value);
					var dateFin = preparePeriodeJava(document.getElementById('ov-margeDateFin').value);
					queryEdit.setParam("Periode",periode);
					queryEdit.setParam("DateDebut",dateDebut);
					queryEdit.setParam("DateFin",dateFin);
					queryEdit.setParam("CodeEtat", ov_codeEtat);
					queryEdit.execute(ov_editerCsv_2);
		  	}
		  }
		} else {
			var periode = document.getElementById('ov-Periode').value;
			var dateDebut = document.getElementById('ov-DateDebut').value;
			var dateFin = document.getElementById('ov-DateFin').value;
			var detailCompte = (document.getElementById('ov-DetailCompte').checked?"1":"0");
			
			if (periode=="DD" && !isDate(dateDebut)) { showWarning("Date de début de période incorrecte"); }
			else if (periode=="DD" && !isDate(dateFin)) { showWarning("Date de fin de période incorrecte"); }
			else if (periode=="DD" && !isDateInterval(dateDebut, dateFin)) { showWarning("Plage de date incorrecte"); }
			else {
	
				if (periode=="DD") {
					dateFin = prepareDateJava(dateFin);
					dateDebut = prepareDateJava(dateDebut);
				}

				switch(ov_codeEtat) {
					case "JV":
					case "JA":
									queryEdit.setParam("DetailCompte",detailCompte);
									queryEdit.setParam("Secteur_Activite", document.getElementById('ov-secteur').value);
									break;
					case "ST":
									if (document.getElementById('ov-DetailArticle').checked) {
										queryEdit.setParam("Detail_Article",true);
									}
									break;
				}
				queryEdit.setParam("Periode",periode);
				queryEdit.setParam("DateDebut",dateDebut);
				queryEdit.setParam("DateFin",dateFin);
				queryEdit.setParam("CodeEtat", ov_codeEtat);
				queryEdit.execute(ov_editerCsv_2);
			}
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function ov_editerCsv_2(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		var fichier = contenu.getAttribute('FichierCsv');
		
		if (ov_codeEtat=="JV") {
			var coherent = (contenu.getAttribute('Coherent')=="true");
			if (!coherent) { showWarning("Le document généré est incohérent. Veuillez contacter votre administrateur OpenSi."); }
		}
		
		var nom_defaut;
		switch(ov_codeEtat) {
			case "JV": nom_defaut = "journalVentes.csv"; break;
			case "JA": nom_defaut = "journalAcomptes.csv"; break;
			case "VA": nom_defaut = "ventesArticles.csv"; break;
			case "ST": nom_defaut = "statistiquesCA.csv"; break;
			case "MA": nom_defaut = "marges.csv"; break;
		}

		var file = fileChooser("save", nom_defaut);

		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}

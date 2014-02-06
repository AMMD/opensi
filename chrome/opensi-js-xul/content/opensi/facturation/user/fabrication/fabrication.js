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

var aHistorique = new Arbre("Facturation/GetRDF/historique_fabrication.tmpl", "historique_fabrication");

function init() {
	try {
		
		nouvelleSaisie();
		document.getElementById('Periode').value = "MC";
		enableDates(false);
		afficherHistorique();
		document.getElementById('Sortie').value = "PDF";
		document.getElementById('bMenuFabrication').collapsed = true;
		document.getElementById('deck').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function rechercherStock() {
	try {
		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie()+"&Nomenclature=1";
    window.openDialog(url,'','chrome,modal,centerscreen', retourRechercherStock);
	} catch (e) {
    recup_erreur(e);
  }
}


function retourRechercherStock(reference) {
	try {
		document.getElementById('Reference').value = reference;
		var qGetArticle = new QueryHttp("Facturation/Stocks/getArticle.tmpl");
		qGetArticle.setParam("Article_Id", reference);
		var p = qGetArticle.execute();
		var contenu = p.responseXML.documentElement;
		document.getElementById('Stock_Reel').value = parseFloat(contenu.getAttribute('Stock_Init')) + parseFloat(contenu.getAttribute('Entrees')) - parseFloat(contenu.getAttribute('Sorties'));
	} catch (e) {
    recup_erreur(e);
  }
}


function nouvelleSaisie() {
	try {
		document.getElementById('Reference').value="";
		document.getElementById('Quantite').value="0.00";
		document.getElementById('Type').value="A";
		document.getElementById('Stock_Reel').value="0.00";
		document.getElementById('Commentaires').value="";
	} catch (e) {
		recup_erreur(e);
	}
}

function validerSaisie() {
	try {
		var refArticle = document.getElementById('Reference').value;
		var qte = document.getElementById('Quantite').value;
		var type = document.getElementById('Type').value;
		var stock_reel = document.getElementById('Stock_Reel').value;
		var commentaires = document.getElementById('Commentaires').value;
		
		if (isEmpty(refArticle)) { showWarning("Veuillez choisir un article !"); }
		else if (!checkQte(qte)) { showWarning("Quantité incorrecte !");	}
		else if (type=='D' && stock_reel<=0) { showWarning("Impossible de désassembler l'article car le stock réel n'est pas positif !"); }
		else {
			var qEnregistrer = new QueryHttp("Facturation/Fabrication/fabriquerArticle.tmpl");
			qEnregistrer.setParam("Reference", refArticle);
			qEnregistrer.setParam("Quantite", qte);
			qEnregistrer.setParam("Type", type);
			qEnregistrer.setParam("Commentaires", commentaires);
			qEnregistrer.execute();
			showWarning("Enregistrement réussi !");
			nouvelleSaisie();
			if (document.getElementById('Periode').value=="MC") {
				afficherHistorique();
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function enableDates(b) {
	try {

		document.getElementById("DateDebut").disabled = !b;
		document.getElementById("DateFin").disabled = !b;

	} catch (e) {
    recup_erreur(e);
  }
}


function afficherHistorique() {
	try {
		
		var periode = document.getElementById('Periode').value;
		var date_debut = document.getElementById('DateDebut').value;
		var date_fin = document.getElementById('DateFin').value;
		
		if (periode=="DD" && !isDate(date_debut)) { showWarning("Date de début de période incorrecte !"); }
		else if (periode=="DD" && !isDate(date_fin)) { showWarning("Date de fin de période incorrecte !"); }
		else if (periode=="DD" && !isDateInterval(date_debut, date_fin)) { showWarning("Plage de dates incorrecte !"); }
		else {

			if (periode=="DD") {
				date_fin = prepareDateJava(date_fin);
				date_debut = prepareDateJava(date_debut);
			}
			
			aHistorique.setParam("Periode", periode);
			aHistorique.setParam("Date_Debut", date_debut);
			aHistorique.setParam("Date_Fin", date_fin);
			aHistorique.initTree();
			
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function editerHistorique() {
	try {
		var sortie = document.getElementById('Sortie').value;
		if (sortie == "PDF") {
			editerPdf();
		} else {
			editerCsv();
		}
		
		
	} catch (e) {
		recup_erreur(e);
	}
}


function editerPdf() {
	try {
		var periode = document.getElementById('Periode').value;
		var date_debut = document.getElementById('DateDebut').value;
		var date_fin = document.getElementById('DateFin').value;
		
		if (periode=="DD" && !isDate(date_debut)) { showWarning("Date de début de période incorrecte !"); }
		else if (periode=="DD" && !isDate(date_fin)) { showWarning("Date de fin de période incorrecte !"); }
		else if (periode=="DD" && !isDateInterval(date_debut, date_fin)) { showWarning("Plage de dates incorrecte !"); }
		else {

			if (periode=="DD") {
				date_fin = prepareDateJava(date_fin);
				date_debut = prepareDateJava(date_debut);
			}
			
			var listeParams = "&Periode="+ periode;
			listeParams += "&Date_Debut="+ date_debut +"&Date_Fin="+ date_fin;
			
			var page = getUrlOpeneas("&Page=Facturation/Fabrication/editionPdfHistorique.tmpl"+ listeParams);
			document.getElementById('fabrication').setAttribute("src", page);
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('bMenuFabrication').collapsed = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function editerCsv() {
	try {
		
		var periode = document.getElementById('Periode').value;
		var date_debut = document.getElementById('DateDebut').value;
		var date_fin = document.getElementById('DateFin').value;
		
		if (periode=="DD" && !isDate(date_debut)) { showWarning("Date de début de période incorrecte !"); }
		else if (periode=="DD" && !isDate(date_fin)) { showWarning("Date de fin de période incorrecte !"); }
		else if (periode=="DD" && !isDateInterval(date_debut, date_fin)) { showWarning("Plage de dates incorrecte !"); }
		else {

			if (periode=="DD") {
				date_fin = prepareDateJava(date_fin);
				date_debut = prepareDateJava(date_debut);
			}
			
			var qEdition = new QueryHttp("Facturation/Fabrication/editionCsvHistorique.tmpl");
			qEdition.setParam("Periode", periode);
			qEdition.setParam("Date_Debut", date_debut);
			qEdition.setParam("Date_Fin", date_fin);
			var p = qEdition.execute();
			var fichier = p.responseXML.documentElement.getAttribute("FichierCsv");
			var nom_defaut = "historiqueFabrication.csv";
			var file = fileChooser("save", nom_defaut);
			if (file!=null) {
				downloadFile(getDirBuffer()+ fichier, file);
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function retour_fabrication() {
  try {

		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bMenuFabrication').collapsed = true;		

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

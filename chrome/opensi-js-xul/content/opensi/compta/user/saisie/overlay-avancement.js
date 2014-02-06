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


function oav_init() {
  try {

  	var qCheckLastExercice = new QueryHttp("Compta/Etats/checkLastExercice.tmpl");
  	var result = qCheckLastExercice.execute();
  	var existe = result.responseXML.documentElement.getAttribute("existe")=="true";
  	document.getElementById('oav-boxExercice').collapsed=!existe;

  	document.getElementById('oav-deck').selectedIndex = 0;
  	document.getElementById('oav-pdfAvancement').setAttribute('src', null);
  	document.getElementById('oav-rgpExercice').value = "N";

		var aJournal = new Arbre("Compta/GetRDF/combo-journaux.tmpl", 'oav-journal');
		aJournal.initTree(oav_initJournal);

		var aPeriode = new Arbre("Compta/GetRDF/liste_periodes.tmpl", 'oav-periode');
		aPeriode.initTree(oav_initPeriode);

		var qDate = new QueryHttp("GetDates.tmpl");
		document.getElementById('oav-labelAvancement').value = "Etat d'avancement au "+ qDate.execute().responseXML.documentElement.getAttribute("auj");
		oav_chargerAvancement();

	} catch (e) {
    recup_erreur(e);
  }
}


function oav_initPeriode() {
  try {

		document.getElementById('oav-periode').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function oav_initJournal() {
  try {

		document.getElementById('oav-journal').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function oav_chargerAvancement() {
  try {

		var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
		var rgp = document.getElementById('oav-rgpExercice').value;

		var qAvancement = new QueryHttp("Compta/Etats/Avancement.tmpl");
		qAvancement.setParam("Exercice", rgp);
		var result = qAvancement.execute();
		var listeJournaux = result.responseXML.documentElement.getAttribute("Liste_Journaux").split(",");
		var listeNbOp = result.responseXML.documentElement.getAttribute("Liste_Nb_Op").split(",");
		var listePeriodes = result.responseXML.documentElement.getAttribute("Liste_Periodes").split(",");
		var listeNbOpPeriodes = result.responseXML.documentElement.getAttribute("Liste_Nb_Op_Periodes").split(",");
		var listeTotauxPeriodes = result.responseXML.documentElement.getAttribute("Liste_Totaux_Periodes").split(",");
		var totalGeneral = result.responseXML.documentElement.getAttribute("Total_General");

		var gridAvancement = document.getElementById('oav-gridAvancement');
		while (gridAvancement.hasChildNodes()) { gridAvancement.removeChild(gridAvancement.firstChild); }

	  var columns = document.createElementNS(XUL_NS, "xul:columns");
	  var column = document.createElementNS(XUL_NS, "xul:column");
	  column.setAttribute("style", "min-width:50px");
	  columns.appendChild(column);
	  for (var i=0; i<listeJournaux.length-1; i++) {
	  	column = document.createElementNS(XUL_NS, "xul:column");
	  	column.setAttribute("style", "min-width:50px");
	  	columns.appendChild(column);
	  }
	  column = document.createElementNS(XUL_NS, "xul:column");
  	column.setAttribute("style", "min-width:50px");
	  columns.appendChild(column);
	  gridAvancement.appendChild(columns);
	  var rows = document.createElementNS(XUL_NS, "xul:rows");
	  var row = document.createElementNS(XUL_NS, "xul:row");
	  var label = document.createElementNS(XUL_NS, "xul:label");
	  label.setAttribute("class", "case_entete");
	  label.setAttribute("value", "");
	  row.appendChild(label);
	  for (var i=0; i<listeJournaux.length-1; i++) {
		  var codeJournal = listeJournaux[i];
		  label = document.createElementNS(XUL_NS, "xul:label");
		  label.setAttribute("class", "row_entete");
		  label.setAttribute("value", codeJournal);
		  label.setAttribute("style", "text-align:center;font-weight:bold");
		  row.appendChild(label);
	  }
	  label = document.createElementNS(XUL_NS, "xul:label");
	  label.setAttribute("class", "row_entete");
	  label.setAttribute("value", "Total");
	  label.setAttribute("style", "text-align:center;font-weight:bold");
	  row.appendChild(label);
	  rows.appendChild(row);

	  var rang = 0;
	  for (var i=0; i<listePeriodes.length-1; i++) {
	  	row = document.createElementNS(XUL_NS, "xul:row");
		  var periode = listePeriodes[i];
		  var totalPeriode = listeTotauxPeriodes[i];
		  label = document.createElementNS(XUL_NS, "xul:label");
		  label.setAttribute("class", "col_entete");
		  label.setAttribute("value", periode);
		  label.setAttribute("style", "text-align:center;font-weight:bold");
		  row.appendChild(label);
		  for (var j=0; j<listeJournaux.length-1; j++) {
		  	var codeJournal = listeJournaux[j];
		  	var nbOp = listeNbOpPeriodes[rang];
		  	rang++;
		  	label = document.createElementNS(XUL_NS, "xul:label");
			  label.setAttribute("class", "case");
			  label.setAttribute("value", nbOp);
			  label.setAttribute("style", "text-align:right");
				if (rgp=="N") {
					label.setAttribute("ondblclick", "gms_ouvrirSaisie('"+ codeJournal +"', '"+ periode.replace('/', '') +"')");
				}
			  row.appendChild(label);
		  }
		  label = document.createElementNS(XUL_NS, "xul:label");
		  label.setAttribute("class", "case");
		  label.setAttribute("value", totalPeriode);
		  label.setAttribute("style", "text-align:right");
		  row.appendChild(label);
		  rows.appendChild(row);
	  }

	  row = document.createElementNS(XUL_NS, "xul:row");
	  row.setAttribute("style", "border-bottom: solid 1px");
	  label = document.createElementNS(XUL_NS, "xul:label");
	  label.setAttribute("class", "case_entete");
	  label.setAttribute("value", "Total");
	  label.setAttribute("style", "text-align:center;font-weight:bold");
	  row.appendChild(label);
	  for (var i=0; i<listeNbOp.length-1; i++) {
		  var codeJournal = listeJournaux[i];
		  var nbOp = listeNbOp[i];
		  label = document.createElementNS(XUL_NS, "xul:label");
		  label.setAttribute("class", "row_case");
		  label.setAttribute("value", nbOp);
		  label.setAttribute("style", "text-align:right");
		  row.appendChild(label);
	  }
	  label = document.createElementNS(XUL_NS, "xul:label");
	  label.setAttribute("class", "row_case");
	  label.setAttribute("value", totalGeneral);
	  label.setAttribute("style", "text-align:right");
	  row.appendChild(label);
	  rows.appendChild(row);
	  gridAvancement.appendChild(rows);

	} catch (e) {
    recup_erreur(e);
  }
}


function oav_clickOnOK() {
  try {

		var codeJournal = document.getElementById('oav-journal').value;
		var periode = document.getElementById('oav-periode').value;

		gms_ouvrirSaisie(codeJournal, periode);

	} catch (e) {
    recup_erreur(e);
  }
}


function oav_menuOpEcritures() {
	try {

		window.location = "chrome://opensi/content/compta/user/autres/cp_journaux.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function oav_pdfAvancement() {
	try {

		document.getElementById('oav-pdfAvancement').setAttribute('src', null);
		document.getElementById('oav-deck').selectedIndex = 1;
		document.getElementById('bEtatAvancement').collapsed = false;

		var exercice =  document.getElementById('oav-rgpExercice').value;

		var page = getUrlOpeneas("&Page=Compta/Etats/editionEtatAvancement.tmpl&Sortie=PDF&Exercice="+ exercice);
		document.getElementById('oav-pdfAvancement').setAttribute('src',page);

	} catch (e) {
    recup_erreur(e);
  }
}



function oav_csvAvancement() {
	try {

		var exercice =  document.getElementById('oav-rgpExercice').value;

		var queryEdit = new QueryHttp("Compta/Etats/editionEtatAvancement.tmpl");
		queryEdit.setParam("Sortie", "CSV");
		queryEdit.setParam("Exercice", exercice);

		var result = queryEdit.execute();
		var fichier = result.responseXML.documentElement.getAttribute('FichierCsv');

		var nom_defaut = "etatAvancement.csv";
		var file = fileChooser("save", nom_defaut);

		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}



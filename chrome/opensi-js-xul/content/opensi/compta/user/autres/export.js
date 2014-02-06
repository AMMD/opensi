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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var aFormExp = new Arbre("Compta/GetRDF/formats_export.tmpl", "Format_Export");


function init() {
	try {

		document.getElementById('Type').selectedItem = document.getElementById('TypeG');

		var aExos = new Arbre("Compta/GetRDF/Dossier.tmpl", "Exercice");
		aExos.initTree(initExercice);

		var aTypExp = new Arbre("Compta/GetRDF/types_export.tmpl", "Type_Export");
		aTypExp.initTree(initType_Export);

	} catch (e) {
    recup_erreur(e);
  }
}


function initExercice() {
	try {

		document.getElementById('Exercice').selectedIndex = 0;
		initialiserPeriode();
	} catch (e) {
    recup_erreur(e);
  }
}


function initType_Export() {
	try {

		document.getElementById('Type_Export').selectedIndex = 0;
		loadFormats(document.getElementById('Type_Export').value);

	} catch (e) {
    recup_erreur(e);
  }
}


function initFormat_Export() {
	try {

		document.getElementById('Format_Export').selectedIndex = 0;
		if (document.getElementById('Format_Export').value=="E_TABLEUR_ASC") {
			document.getElementById('tab').collapsed=false;
			document.getElementById('autre').collapsed=true;
			document.getElementById('type').collapsed=false;
			document.getElementById('Debut_Ecriture').value = "";
		  document.getElementById('Fin_Ecriture').value = "";
		}
		else {
			document.getElementById('tab').collapsed=true;
			document.getElementById('autre').collapsed=false;
			document.getElementById('type').collapsed=true;
			var aJournaux = new Arbre("Compta/GetRDF/combo-journaux.tmpl", 'journal');
			aJournaux.initTree(initialiser);
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function initialiser()
{
document.getElementById("journal").selectedIndex = 0;

}
function initialiserPeriode(){
		if (document.getElementById('Exercice').selectedIndex == -1){
			document.getElementById('Exercice').selectedIndex = 0;
		}
			var exercice=document.getElementById('Exercice').value;
			var exercicelabel=document.getElementById('Exercice').label;

		
      var aPeriodes = new Arbre("Compta/GetRDF/Get_periode_Export.tmpl", 'periode_initiale');
	   	param1=exercice;
			aPeriodes.clearParams();
			if (param1 != ""){
				aPeriodes.setParam("base",param1);
				aPeriodes.initTree(initialiser2);

			}
			var aPeriodesintervalle = new Arbre("Compta/GetRDF/Get_periode_Export.tmpl", 'periode_fin');
	    param1=exercice;
			aPeriodesintervalle.clearParams();
			if (param1 != ""){
				aPeriodesintervalle.setParam("base",param1);
				aPeriodesintervalle.initTree(initialiser2);

			}

}
function initialiser2(){

	document.getElementById("periode_initiale").selectedIndex = 0;
	document.getElementById("periode_fin").selectedIndex = 0;
}
function loadFormats(export_id) {
	try {

		aFormExp.setParam("Export_Id", export_id);
		aFormExp.initTree(initFormat_Export);

	} catch (e) {
    recup_erreur(e);
  }
}


function disableDates(b) {
	try {

		document.getElementById('Date_Debut').disabled = b;
		document.getElementById('Date_Fin').disabled = b;

	} catch (e) {
    recup_erreur(e);
  }
}


function exporter() {
	try {

		document.getElementById('bExporter').disabled = true;

		var base = document.getElementById('Exercice').value;
		var format = document.getElementById('Format_Export').value;
		var date_debut = document.getElementById('Date_Debut').value;
		var date_fin = document.getElementById('Date_Fin').value;
		var periode_initiale = document.getElementById("periode_initiale").value;
		var periode_fin = document.getElementById("periode_fin").value;
		var debut_ecriture = document.getElementById('Debut_Ecriture').value;
		var fin_ecriture = document.getElementById('Fin_Ecriture').value;
				
		if (document.getElementById('PeriodeDD').selected && (!isDate(date_fin) || !isDate(date_debut) || !isDateInterval(date_debut, date_fin))) {
			showWarning("Plage de dates invalide !");
			document.getElementById('bExporter').disabled = false;
		}
		else if (document.getElementById('Periode2').value=="pp" && (!isPeriode(periode_fin) || !isPeriode(periode_initiale) || !isPeriodeInterval(periode_initiale, periode_fin))) {
			showWarning("Plage de dates invalide !");
			document.getElementById('bExporter').disabled = false;
		}
		else if (format!="E_TABLEUR_ASC" &&
			((!isEmpty(debut_ecriture) && !isPositiveInteger(debut_ecriture)) || (!isEmpty(fin_ecriture) && !isPositiveInteger(fin_ecriture))
			|| (!isEmpty(debut_ecriture) && !isEmpty(fin_ecriture) && parseIntBis(debut_ecriture)>parseIntBis(fin_ecriture)))
		) {
			showWarning("Plage de numéros d'écritures invalide !");
			document.getElementById('bExporter').disabled = false;
		}
		else {

			document.getElementById('progression').collapsed = false;
			document.getElementById('pm').setAttribute("mode", "undetermined");

			var fichier_sugg = get_cookie("Dossier_Id");
			if (format=="CE_OPENSI_XML") fichier_sugg += ".xml";
			else if (format=="E_SAGE_ASC") fichier_sugg += ".pnm";
			else if (format=="E_TABLEUR_ASC") fichier_sugg += ".csv";
			else fichier_sugg += ".txt";

			var qExport = new QueryHttp("Compta/Export/ProcessExport.tmpl");
			qExport.setParam("Base", base);
			qExport.setParam("Date_Debut", date_debut);
			qExport.setParam("Date_Fin", date_fin);
			//période de date à date
			qExport.setParam("Periode", document.getElementById('Periode').value);
			//de mois en mois
			qExport.setParam("Periode2", document.getElementById('Periode2').value);
			qExport.setParam("Debut", periode_initiale);
			qExport.setParam("Fin", periode_fin);
			qExport.setParam("Journal", document.getElementById('journal').value);
			qExport.setParam("Debut_Ecriture", debut_ecriture);
			qExport.setParam("Fin_Ecriture", fin_ecriture);
			
			qExport.setParam("Format", format);
			qExport.setParam("Type", document.getElementById('Type').value);
			qExport.execute(exporter_2, fichier_sugg);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function exporter_2(result, fichier_sugg) {
	try {

		var contenu = result.responseXML;

		var action_error = contenu.documentElement.getAttribute('action_error');
		var fichier_export = contenu.documentElement.getAttribute('fichier_export');

		document.getElementById('pm').setAttribute("mode", "none");
		document.getElementById('progression').collapsed = true;
		document.getElementById('bExporter').disabled = false;

		if (action_error!="") {
			showWarning(action_error);
		}
		else {

			var file = fileChooser("save", fichier_sugg);

			if (file!=null) {
				downloadFile(getDirBuffer()+ fichier_export, file);
			}
		}

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

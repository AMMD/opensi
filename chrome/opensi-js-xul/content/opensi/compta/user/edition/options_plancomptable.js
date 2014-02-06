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


function init() {
  try {

  	document.getElementById('deck').selectedIndex = 0;
		document.getElementById('Choix').value = "G";
		
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
function retour_options_plan() {
  try {

		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bRetourOptions').collapsed = true;
  } catch (e) {
    recup_erreur(e);
  }
}

function editerPlan() {
	try {

		var plan = document.getElementById('Plan').value;
		var sortie = document.getElementById('Sortie').value;
		if (plan=="2"){
			var choix = document.getElementById('Choix').value;
		}
		else{
			var choix="0";
		}

		if (document.getElementById('Sortie').value=='1'){

				var queryEdit = new QueryHttp("Compta/Etats/planComptable.tmpl");
							queryEdit.setParam("req","csv");
							queryEdit.setParam("plan",plan);
							queryEdit.setParam("sortie",sortie);
							queryEdit.setParam("choix",choix);
							queryEdit.execute();
							var response=queryEdit.execute();
		  				suiteEditerCSV(response);
		}
		else if (document.getElementById('Sortie').value=='2'){
				var params = "&req=pdf&plan="+ plan+"&sortie="+sortie+"&choix="+choix;
				var page = getUrlOpeneas("&Page=Compta/Etats/planComptable.tmpl" + params);
				document.getElementById('pdf_plan').setAttribute("src", page);
				document.getElementById('deck').selectedIndex = 1;
				document.getElementById('bRetourOptions').collapsed = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}
function cachechoix(a){
	if (a=="1"){
		document.getElementById('gpchoix').collapsed=true;
	}
	else{
		document.getElementById('gpchoix').collapsed=false;
	}
}

function suiteEditerCSV(response) {
  try {

    var contenu = response.responseXML;

		var fichier_csv = contenu.documentElement.getAttribute('fichier');

		var file = fileChooser("save", "plan.csv");
		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier_csv, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


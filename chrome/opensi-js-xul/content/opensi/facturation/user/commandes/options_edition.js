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

jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


function init() {
	try {


	} catch (e) {
    recup_erreur(e);
  }
}


function editer() {
	try {

		var date_debut = document.getElementById('Date_Debut').value;
		var date_fin = document.getElementById('Date_Fin').value;

		if (!isEmpty(date_debut) && !isDate(date_debut)) {
			showWarning("Date de début incorrecte");
		}
		else if (!isEmpty(date_fin) && !isDate(date_fin)) {
			showWarning("Date de fin incorrecte");
		}
		else if (!isEmpty(date_debut) && !isEmpty(date_fin) && !isDateInterval(date_debut, date_fin)) {
			showWarning("Plage de dates de délai incorrecte");
		}
		else {

			var queryEdit = new QueryHttp("Facturation/Commandes/editionListeCsv.tmpl");
			queryEdit.setFullParamById('Tri1');
			queryEdit.setFullParamById('Tri2');
			queryEdit.setFullParamById('Tri3');
			queryEdit.setFullParamById('Etat');
			queryEdit.setParam('Date_Debut', prepareDateJava(date_debut));
			queryEdit.setParam('Date_Fin', prepareDateJava(date_fin));
			queryEdit.execute(editer_2);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function editer_2(httpRequest) {
	try {

		var fichier = httpRequest.responseXML.documentElement.getAttribute('Fichier');

		var file = fileChooser("save", "listecommandes.csv");

		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_commandes() {
  try {

    window.location = "chrome://opensi/content/facturation/user/commandes/menu_commandes.xul?"+ cookie();

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

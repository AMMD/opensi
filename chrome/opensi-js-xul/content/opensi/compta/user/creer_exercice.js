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

		var qLastExo = new QueryHttp("Compta/GetLastExercice.tmpl");
		qLastExo.execute(suiteInit);

	} catch (e) {
    recup_erreur(e);
  }
}


function suiteInit(result) {
  try {

		var contenu = result.responseXML.documentElement;

		var debut = contenu.getAttribute('debut_exercice_format');
		var fin = contenu.getAttribute('fin_exercice_format');
		var base = contenu.getAttribute('nom_base');

		document.getElementById("Ancien_Exercice").value = "Ancien Exercice: Du "+ debut +" au "+ fin;

		document.getElementById('Date_Fin').value = fin.substring(0,6)+(parseIntBis(fin.substring(6,10))+1);
		document.getElementById("Date_Fin").focus();

		var aJAN = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'JournalAN');
		aJAN.setParam('Type_Journal', 'AN');
		aJAN.initTree(selectJournalAN);

	} catch (e) {
    recup_erreur(e);
  }
}


function selectJournalAN() {
	try {

    document.getElementById('JournalAN').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function createExercice() {
	try {

		var date_fin = document.getElementById('Date_Fin').value;
		var journal_an = document.getElementById('JournalAN').value;

		if (isEmpty(journal_an)) {
			showWarning("Impossible de créer l'exercice, aucun journal d'A Nouveau disponible !");
		}
		else if (isEmpty(date_fin)) {
			showWarning("Vous devez spécifier une date de fin d'exercice !");
  	}
		else if (!isDate(date_fin)) {
			showWarning("Date de fin d'exercice incorrecte !");
		}
		else {
			document.getElementById('bOk').disabled = true;
			document.getElementById('progression').collapsed = false;
			document.getElementById('pm').setAttribute("mode", "undetermined");

			var qNewExo = new QueryHttp("Compta/UpdateDatabase/CreerExercice.tmpl");
			qNewExo.setParam('Fin_Exercice', date_fin);
			qNewExo.setParam('JournalAN', journal_an);
			var result = qNewExo.execute();

			document.getElementById('progression').collapsed = true;
			document.getElementById('pm').setAttribute("mode", "none");

			var errors = new Errors(result);

			if (errors.hasNext()) {		
				errors.show();
				document.getElementById('Date_Fin').focus();
				document.getElementById('bOk').disabled = false;
			}
			else {
    		showMessage("Le nouvel exercice a été créé avec succés");
				retour_exercice();
  		}			
    }

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_exercice() {
	try {

  	window.location = "chrome://opensi/content/compta/user/menu_dossier.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function retourChoixDossier() {
  try {

    window.location = "chrome://opensi/content/compta/user/menu.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}


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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


function init() {
  try {

  	window.resizeTo(400,250);

  } catch (e) {
    recup_erreur(e);
  }
}



function valider() {
	try {

		var codeCabinet = document.getElementById('codeCabinet').value;
		var numDossier = document.getElementById('numDossier').value;
		
		if (isEmpty(codeCabinet)) { showWarning("Veuillez saisir un code cabinet."); }
		else if (!isCleAlpha(codeCabinet)) { showWarning("Le code cabinet ne doit pas contenir d'accents ni de caractères spéciaux.") }
		else if (isEmpty(numDossier)) { showWarning("Veuillez saisir un code dossier."); }
		else if (!isCleAlpha(numDossier)) { showWarning("Le code dossier ne doit pas contenir d'accents ni de caractères spéciaux.") }
		else {
			var nomFichier = codeCabinet + numDossier + "IN";
			window.arguments[0](nomFichier);
			window.close();
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


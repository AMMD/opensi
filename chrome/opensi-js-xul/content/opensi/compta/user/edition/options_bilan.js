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


function init() {
  try {

		document.getElementById('Type').selectedItem = document.getElementById('TypeC');
		document.getElementById('Detail').selectedItem = document.getElementById('DetailNon');
		document.getElementById('Sortie').selectedItem = document.getElementById('SortieP');

		document.getElementById('Num_Dossier').selectedItem = document.getElementById('Num_DossierNon');
		document.getElementById('Date_Heure').selectedItem = document.getElementById('Date_HeureOui');
		document.getElementById('Proratisation').selectedItem = document.getElementById('ProratisationNon');
		document.getElementById('Comparatif').selectedItem = document.getElementById('ComparatifNon');
		document.getElementById('Projet').selectedItem = document.getElementById('ProjetNon');

  } catch (e) {
    recup_erreur(e);
  }
}


function cacheChampsMail(b) {
	try {
		document.getElementById('ChampsMail').collapsed = b;

		if (b) {
			document.getElementById('BoutonEdition').label = "EDITER LE BILAN";
		}
		else {
			document.getElementById('BoutonEdition').label = "ENVOYER LE BILAN";
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function disableDates(b) {
	try {

		document.getElementById('Date_Fin').disabled = b;

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


function editerBilan() {
	try {

		var date_fin = document.getElementById('Date_Fin').value;

		if (document.getElementById('TypeD').selected && !isDate(date_fin)) {
			showWarning("Date de fin de période incorrecte !");
		}
		else {
			var liste_options = "&Date_Fin="+ date_fin;
			liste_options += "&Type="+ document.getElementById('Type').value;
			liste_options += "&Detail="+ document.getElementById('Detail').value;
			liste_options += "&Date_Heure="+ document.getElementById('Date_Heure').value;
			liste_options += "&Num_Dossier="+ document.getElementById('Num_Dossier').value;
			liste_options += "&Proratisation="+ document.getElementById('Proratisation').value;
			liste_options += "&Comparatif="+ document.getElementById('Comparatif').value;
			liste_options += "&Projet="+ document.getElementById('Projet').value;

			var sortie = document.getElementById('Sortie').value;

			if (sortie=="M") {

				var email = document.getElementById('Email').value;
				var sujet = document.getElementById('Sujet').value;
				var message = document.getElementById('Message').value;

				if (!isEmail(email)) {
					showWarning("Adresse e-mail incorrecte !");
				}
				else {
					var corps = cookie() +"&Page=Compta/Etats/bilan_pdf.tmpl&ContentType=xml&EnvoiMail=y";
          corps += liste_options +"&Email="+ urlEncode(email) +"&Sujet="+ urlEncode(sujet) +"&Message="+ urlEncode(message);
          requeteHTTP(corps,new XMLHttpRequest(),suiteEditer);
				}
			}
			else {
				page = getUrlOpeneas("&Page=Compta/Etats/bilan_pdf.tmpl" + liste_options);
				document.getElementById('bilan').setAttribute("src", page);
				document.getElementById('deck').selectedIndex = 1;
				document.getElementById('bRetourOptions').collapsed = false;
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function retour_options() {
  try {

   	document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bRetourOptions').collapsed = true;

  } catch (e) {
    recup_erreur(e);
  }
}
function suiteEditer(httpRequest) {
  try {

    showMessage("Le bilan a été envoyé");

	} catch (e) {
    recup_erreur(e);
  }
}

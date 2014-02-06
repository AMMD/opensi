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


function init() {
  try {
		
		var aJournaux = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'Code_Journal');
		aJournaux.setParam('Used', '');
		aJournaux.initTree(selectJournal);

		document.getElementById('Ordre').selectedItem = document.getElementById('OrdreJ');
		document.getElementById('Sortie').selectedItem = document.getElementById('SortieP');

  } catch (e) {
    recup_erreur(e);
  }
}


function cacheChampsMail(b) {
	try {
		document.getElementById('ChampsMail').collapsed = b;

		if (b) {
			document.getElementById('BoutonEdition').label = "EDITER LE CENTRALISATEUR";
		}
		else {
			document.getElementById('BoutonEdition').label = "ENVOYER LE CENTRALISATEUR";
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function selectJournal() {
	try {
		document.getElementById('Code_Journal').selectedIndex = 0;
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


function editerCentralisateur() {
	try {

		var date_debut = document.getElementById('Date_Debut').value;
		var date_fin = document.getElementById('Date_Fin').value;

		if (!isEmpty(date_debut) && !isEmpty(date_fin) && (!isPeriode(date_debut) || !isPeriode(date_fin) || !isPeriodeInterval(date_debut, date_fin))) {
			showWarning("Plage de dates incorrecte !");
		}
		else if (isEmpty(date_fin) && !isEmpty(date_debut) && !isPeriode(date_debut)) {
			showWarning("Date de d�but p�riode invalide (mmaa) !");
		}
		else {
			var liste_options = "&Date_Debut="+ date_debut;
			liste_options += "&Date_Fin="+ date_fin;
			liste_options += "&Code_Journal="+ document.getElementById('Code_Journal').value;
			liste_options += "&Ordre="+ document.getElementById('Ordre').value;

			var sortie = document.getElementById('Sortie').value;

			if (sortie=="M") {

				var email = document.getElementById('Email').value;
				var sujet = document.getElementById('Sujet').value;
				var message = document.getElementById('Message').value;

				if (!isEmail(email)) {
					showMessage("Adresse e-mail incorrecte !");
				}
				else {
					var corps = cookie() + "&Page=Compta/Etats/centralisateur_pdf.tmpl&ContentType=xml&EnvoiMail=y";
          corps += liste_options+"&Email="+urlEncode(email)+"&Sujet="+urlEncode(sujet)+"&Message="+urlEncode(message);
          requeteHTTP(corps,new XMLHttpRequest(),suiteEditer);
				}
			}
			else {
				page = getUrlOpeneas("&Page=Compta/Etats/centralisateur_pdf.tmpl" + liste_options);
				document.getElementById('centralisateur').setAttribute("src", page);
				document.getElementById('deck').selectedIndex = 1;
				document.getElementById('bRetourOptions').collapsed = false;
			
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function suiteEditer(httpRequest) {
  try {

    showMessage("Le centralisateur a �t� envoy� !");

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

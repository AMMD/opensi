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

var currentChampCompte;

function init() {
  try {

		document.getElementById('Type').value = "G";
		document.getElementById('Periode').selectedItem = document.getElementById('PeriodeEC');
		document.getElementById('Edition').selectedItem = document.getElementById('EditionC');
		document.getElementById('Ed_Cpte').selectedItem = document.getElementById('EdCpteT');
		document.getElementById('Ed_Ecriture').selectedItem = document.getElementById('EdEcrT');
		document.getElementById('Sortie').selectedItem = document.getElementById('SortieP');

  } catch (e) {
    recup_erreur(e);
  }
}

function cacheChampsMail(b) {
	try {
		document.getElementById('ChampsMail').collapsed = b;

		if (b) {
			document.getElementById('BoutonEdition').label = "EDITER LE GRAND LIVRE";
		}
		else {
			document.getElementById('BoutonEdition').label = "ENVOYER LE GRAND LIVRE";
		}

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

function disableCptes(b) {
	try {

		document.getElementById('Cpte_Debut').disabled = b;
		document.getElementById('Cpte_Fin').disabled = b;
		document.getElementById('bCpte_Debut').disabled = b;
		document.getElementById('bCpte_Fin').disabled = b;

	} catch (e) {
    recup_erreur(e);
  }
}


function rechcompte(id) {
	try {
		currentChampCompte = id;
		var type_compte = document.getElementById('Type').value;
		var numero_compte = document.getElementById(id).value;
		var nom = "";
    var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Type_Rech=A&Creer=false&Num_Compte="+ urlEncode(numero_compte);
    if (type_compte!="T") {
    	if (type_compte=="C") {
    		nom ="CLIENT";
    	} else if (type_compte=="F") {
    		nom ="FOURNISSEUR";
    	} else if (type_compte=="A") {
    		nom ="AUXILIAIRE";
			} else if (type_compte=="G") {
    		nom ="GENERAL";
    	}
    	url += "&Type_Compte="+type_compte+"&nom="+nom;
    }

    window.openDialog(url,'','chrome,modal,centerscreen',retourRechCompte);
	} catch (e) {
		recup_erreur(e);
	}
}

function retourRechCompte(numCompte) {
	try {
		
		document.getElementById(currentChampCompte).value = numCompte;

	} catch (e) {
		recup_erreur(e);
	}
}

function keypress(e,id) {
  try {

    if (e.keyCode == 13){
      rechcompte(id);
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


function editerGrandLivre() {
	try {

		var date_debut = document.getElementById('Date_Debut').value;
		var date_fin = document.getElementById('Date_Fin').value;
		var cpte_debut = document.getElementById('Cpte_Debut').value;
		var cpte_fin = document.getElementById('Cpte_Fin').value;

		if (document.getElementById('EditionP').selected && (!isCompteCorrect(cpte_debut) || !isCompteCorrect(cpte_fin))) {
			showMessage("Numéros de compte invalides !");
		}
		else if (document.getElementById('PeriodeDD').selected && (!isDate(date_fin) || !isDate(date_debut) || !isDateInterval(date_debut, date_fin))) {
			showMessage("Plage de dates invalide !");
		}
		else {
			var liste_options = "&Date_Debut="+ date_debut;
			liste_options += "&Date_Fin="+ date_fin;
			liste_options += "&Cpte_Debut="+ cpte_debut;
			liste_options += "&Cpte_Fin="+ cpte_fin;
			liste_options += "&Type="+ document.getElementById('Type').value;
			liste_options += "&Periode="+ document.getElementById('Periode').value;
			liste_options += "&Edition="+ document.getElementById('Edition').value;
			liste_options += "&Ed_Cpte="+ document.getElementById('Ed_Cpte').value;
			liste_options += "&Ed_Ecriture="+ document.getElementById('Ed_Ecriture').value;

			var sortie = document.getElementById('Sortie').value;

			if (sortie=="M") {

				var email = document.getElementById('Email').value;
				var sujet = document.getElementById('Sujet').value;
				var message = document.getElementById('Message').value;

				if (!isEmail(email)) {
					showMessage("Adresse e-mail incorrecte !");
				}
				else {
					var corps = cookie() + "&Page=Compta/Etats/grandlivre_pdf.tmpl&ContentType=xml&EnvoiMail=y";
          corps += liste_options+"&Email="+urlEncode(email)+"&Sujet="+urlEncode(sujet)+"&Message="+urlEncode(message);
          requeteHTTP(corps,new XMLHttpRequest(),suiteEditer);
				}
			} else if (sortie=="C") {
				var corps = cookie() + "&Page=Compta/Etats/grandlivre_csv.tmpl&ContentType=xml" + liste_options;
        requeteHTTP(corps,new XMLHttpRequest(),suiteEditerCSV);
			}
			else {
				var page = getUrlOpeneas("&Page=Compta/Etats/grandlivre_pdf.tmpl" + liste_options);
			document.getElementById('grandlivre').setAttribute("src", page);
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

    showMessage("Le grand livre a été envoyé !");

	} catch (e) {
    recup_erreur(e);
  }
}


function suiteEditerCSV(httpRequest) {
  try {

    var contenu = httpRequest.responseXML;

		var fichier_csv = contenu.documentElement.getAttribute('fichier');

		var file = fileChooser("save", "grand_livre.csv");
		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier_csv, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}

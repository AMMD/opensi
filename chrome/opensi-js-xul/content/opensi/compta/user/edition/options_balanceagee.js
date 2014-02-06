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

		if (ParamValeur("Type")=="Fournisseurs") {
			document.getElementById('Type').selectedItem = document.getElementById('TypeF');
		}
		else {
			document.getElementById('Type').selectedItem = document.getElementById('TypeC');
		}
		document.getElementById('Periode').selectedItem = document.getElementById('PeriodeEC');
		document.getElementById('Tri').selectedItem = document.getElementById('TriN');
		document.getElementById('Sortie').selectedItem = document.getElementById('SortieP');

  } catch (e) {
    recup_erreur(e);
  }
}

function cacheChampsMail(b) {
	try {
		document.getElementById('ChampsMail').collapsed = b;

		if (b) {
			document.getElementById('BoutonEdition').label = "EDITER LA BALANCE AGEE";
		}
		else {
			document.getElementById('BoutonEdition').label = "ENVOYER LA BALANCE AGEE";
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


function updateTranche() {

	var tranche1 = document.getElementById('Tranche1').value;
	var tranche2 = document.getElementById('Tranche2').value;
	var tranche3 = document.getElementById('Tranche3').value;
	var tranche4 = document.getElementById('Tranche4').value;


	if (isEmpty(tranche1) || !isPositiveOrNull(tranche1)) {
		showWarning('Tranche 1 invalide !');
		document.getElementById('Tranche1').value = '';
		return false;
	}
	else if (isEmpty(tranche2) || !isPositiveOrNull(tranche2)) {
		showWarning('Tranche 2 invalide !');
		document.getElementById('Tranche2').value = '';
		return false;
	}
	else if (isEmpty(tranche3) || !isPositiveOrNull(tranche3)) {
		showWarning('Tranche 3 invalide !');
		document.getElementById('Tranche3').value = '';
		return false;
	}
	else if (isEmpty(tranche4) || !isPositiveOrNull(tranche4)) {
		showWarning('Tranche 4 invalide !');
		document.getElementById('Tranche4').value = '';
		return false;
	}
	else if (!(parseIntBis(tranche1) <= parseIntBis(tranche2) && parseIntBis(tranche2) <= parseIntBis(tranche3) && parseIntBis(tranche3) <= parseIntBis(tranche4))) {
		showWarning('Tranches incohérentes !');
		return false;
	}
	else {
		document.getElementById('Label2').value = "de "+ tranche1 +" à";
		document.getElementById('Label3').value = "de "+ tranche2 +" à";
		document.getElementById('Label4').value = "de "+ tranche3 +" à";
		document.getElementById('Label5').value = tranche4 +" jours";
		return true;
	}

}

function editerBalanceAgee() {
	try {

		var date_fin = document.getElementById('Date_Fin').value;

		if (document.getElementById('PeriodeDD').selected && !isDate(date_fin)) {
			showMessage("Date de fin invalide !");
		}
		else if(updateTranche()) {
			var liste_options = "&Date_Fin="+ date_fin;
			liste_options += "&Type="+ document.getElementById('Type').value;
			liste_options += "&Tri=" + document.getElementById('Tri').value;
			liste_options += "&Periode="+ document.getElementById('Periode').value;
			liste_options += "&Tranche1="+ document.getElementById('Tranche1').value;
			liste_options += "&Tranche2="+ document.getElementById('Tranche2').value;
			liste_options += "&Tranche3="+ document.getElementById('Tranche3').value;
			liste_options += "&Tranche4="+ document.getElementById('Tranche4').value;

			var sortie = document.getElementById('Sortie').value;

			if (sortie=="M") {

				var email = document.getElementById('Email').value;
				var sujet = document.getElementById('Sujet').value;
				var message = document.getElementById('Message').value;

				if (!isEmail(email)) {
					showMessage("Adresse e-mail incorrecte !");
				}
				else {
					var corps = cookie() + "&Page=Compta/Etats/balanceagee_pdf.tmpl&ContentType=xml&EnvoiMail=y";
          corps += liste_options+"&Email="+urlEncode(email)+"&Sujet="+urlEncode(sujet)+"&Message="+urlEncode(message);
          requeteHTTP(corps,new XMLHttpRequest(),suiteEditer);
				}
			}
			else {
				page = getUrlOpeneas("&Page=Compta/Etats/balanceagee_pdf.tmpl" + liste_options);
				document.getElementById('balanceagee').setAttribute("src", page);
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

    showMessage("La balance agée a été envoyée !");

	} catch (e) {
    recup_erreur(e);
  }
}

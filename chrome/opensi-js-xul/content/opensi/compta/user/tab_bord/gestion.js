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


function init() {
  try {

		document.getElementById('date_bord').value = "AU "+ parent.document.getElementById('date_courante').value;

    var url_tab_sig = "&Page=Compta/Etats/Tab_SIG.tmpl&ContentType=xul";
		document.getElementById('tab_sig').setAttribute("src", getUrlOpeneas(url_tab_sig));

    var url_tab_ca = "&Page=Compta/Etats/Tab_CA.tmpl&ContentType=xul"
		document.getElementById('tab_ca').setAttribute("src", getUrlOpeneas(url_tab_ca));

		loadGraphSIG();

		loadGraphCA();

  } catch (e) {
    recup_erreur(e);
  }
}


function loadGraphCA() {
	try {

		if (document.getElementById('tab_ca').contentDocument.getElementById('ListeN')==null) {
			setTimeout("loadGraphCA()", 100);
		}
		else {
			var listeN = "&ListeN="+ document.getElementById('tab_ca').contentDocument.getElementById('ListeN').value;
			var listeN1 = "&ListeN1="+ document.getElementById('tab_ca').contentDocument.getElementById('ListeN1').value;
			var periodes = "&Periodes="+ document.getElementById('tab_ca').contentDocument.getElementById('Periodes').value;

      var url_chiffre_affaire = "&Page=Compta/Etats/Chiffre_Affaire.tmpl&ContentType=xul" + periodes + listeN1 + listeN;
			document.getElementById('chiffre_affaire').setAttribute("src", getUrlOpeneas(url_chiffre_affaire));
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function loadGraphSIG() {
	try {

		if (document.getElementById('tab_sig').contentDocument.getElementById('RE')==null) {
			setTimeout("loadGraphSIG()", 100);
		}
		else {
			var liste_sig = "&VM="+ document.getElementById('tab_sig').contentDocument.getElementById('VM').value;
			liste_sig += "&PE="+ document.getElementById('tab_sig').contentDocument.getElementById('PE').value;
			liste_sig += "&MBG="+ document.getElementById('tab_sig').contentDocument.getElementById('MBG').value;
			liste_sig += "&VA="+ document.getElementById('tab_sig').contentDocument.getElementById('VA').value;
			liste_sig += "&EBE="+ document.getElementById('tab_sig').contentDocument.getElementById('EBE').value;
			liste_sig += "&RE="+ document.getElementById('tab_sig').contentDocument.getElementById('RE').value;

      var url_camembert_sig = "&Page=Compta/Etats/Camembert_SIG.tmpl&ContentType=xul"+liste_sig;
			document.getElementById('camembert_sig').setAttribute("src", getUrlOpeneas(url_camembert_sig));
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

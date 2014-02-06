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


function init() {
  try {

    var urlnews = "http://opensi.speedinfo.fr/speedinfo/expershop?Page=OpenSI/DisplayNewsOpensi.tmpl"+ nocache();
		document.getElementById('news').setAttribute("src", urlnews);

		var urlinfos = "http://opensi.speedinfo.fr/speedinfo/expershop?Page=OpenSI/DisplayInfosCompta.tmpl"+ nocache();
		document.getElementById('infos').setAttribute("src", urlinfos);

		/*var qExo = new QueryHttp("Compta/Exercice/GetExercice.tmpl");
		var result = qExo.execute();		

	    if (result.responseXML.documentElement.getAttribute('Verrouille')=='1') {
				document.getElementById('message').collapsed = false;
	    }
		Verrouille n'est plus utilisé pour le moment...
		*/
		
		var qClot = new QueryHttp("Compta/Exercice/IsCloturable.tmpl");
		var result = qClot.execute();
		
		if (result.responseXML.documentElement.getAttribute('Cloturable')=='0') {
			document.getElementById('bouton_cloture').collapsed = true;
		}

		var qSuivi = new QueryHttp("Compta/Etats/SuiviActivite.tmpl");
		qSuivi.execute(initSuivi);
		
		// activation compta ana
		var qChargerPrefs = new QueryHttp("Config/comptabilite/preferences/getPreferences.tmpl");
		var result = qChargerPrefs.execute();
		var actAnalytique = (result.responseXML.documentElement.getAttribute('Act_Analytique')=="1");
		document.getElementById('bouton_analytique').collapsed = !actAnalytique;
		
  } catch (e) {
    recup_erreur(e);
  }
}


function initSuivi(result) {
  try {

		var contenu = result.responseXML.documentElement;

		document.getElementById('SoldeTresorerie').value = contenu.getAttribute('SoldeTresorerie') +" \u20AC";
		document.getElementById('TotalCAN').value = contenu.getAttribute('TotalCAN') +" \u20AC";

		document.getElementById('GraphCA').setAttribute("src", getDirServeur() +"graph/"+ contenu.getAttribute('GraphCA'));

	} catch (e) {
    recup_erreur(e);
  }
}


function goToMenu(m) {
  try {

		switch(m) {
			case 1:	 window.location = "chrome://opensi/content/compta/user/saisie/menuSaisie.xul?"+ cookie();									break;
			case 2:  window.location = "chrome://opensi/content/compta/user/consultation/menu_consultation.xul?"+ cookie();  		break;
			case 3:  window.location = "chrome://opensi/content/compta/user/autres/cp_journaux.xul?"+ cookie();									break;
			case 4:  window.location = "chrome://opensi/content/compta/user/rapprochement_bancaire/menu_rappro.xul?"+ cookie();	break;
			case 5:  window.location = "chrome://opensi/content/compta/user/cloture/options_cloture.xul?"+ cookie();            break;
			case 6:  window.location = "chrome://opensi/content/compta/user/edition/options_balance.xul?"+ cookie();          	break;
			case 7:  window.location = "chrome://opensi/content/compta/user/edition/options_centralisateur.xul?"+ cookie();     break;
			case 8:  window.location = "chrome://opensi/content/compta/user/edition/options_grandlivre.xul?"+ cookie();         break;
			case 9:  window.location = "chrome://opensi/content/compta/user/edition/options_journaux.xul?"+ cookie();           break;
			case 10: window.location = "chrome://opensi/content/compta/user/edition/options_balanceagee.xul?"+ cookie();        break;
			case 11: window.location = "chrome://opensi/content/compta/user/edition/options_bilan.xul?"+ cookie();          		break;
			case 12: window.location = "chrome://opensi/content/compta/user/edition/options_resultat.xul?"+ cookie();       		break;
			case 13: window.location = "chrome://opensi/content/compta/user/edition/options_sig.xul?"+ cookie();    						break;
			case 14: window.location = "chrome://opensi/content/compta/user/tab_bord/gestion.xul?"+ cookie();										break;
			case 15: window.location = "chrome://opensi/content/compta/user/tab_bord/tresorerie.xul?"+ cookie();								break;
			case 20: window.location = "chrome://opensi/content/compta/user/config/menu_comptabilite.xul?"+ cookie();           break;
			case 21: window.location = "chrome://opensi/content/compta/user/autres/import.xul?"+ cookie();            				 	break;
			case 22: window.location = "chrome://opensi/content/compta/user/autres/export.xul?"+ cookie();											break;
			case 23: window.location = "chrome://opensi/content/compta/user/autres/change_user_password.xul?"+ cookie();       	break;
			case 24: window.location = "chrome://opensi/content/compta/user/edition/options_plancomptable.xul?"+ cookie();      break;
			case 25: window.location = "chrome://opensi/content/compta/user/cloture/optionsClotureMois.xul?"+ cookie();         break;
			case 26: window.location = "chrome://opensi/content/compta/user/abonnement/abonnement.xul?"+ cookie(); 							break;
			case 27: window.location = "chrome://opensi/content/compta/user/modele/modele.xul?"+ cookie(); 											break;
			case 28: window.location = "chrome://opensi/content/compta/user/import_banque/importBanque.xul?"+ cookie(); 				break;
			case 29: window.location = "chrome://opensi/content/compta/user/analytique/parametrages/parametrages.xul?"+ cookie(); break;
			case 30: window.location = "chrome://opensi/content/compta/user/analytique/comptes/gestionComptes.xul?"+ cookie(); 	break;
			case 31: window.location = "chrome://opensi/content/compta/user/analytique/comptes/pageTest.xul?"+ cookie(); 				break;
			case 32: window.location = "chrome://opensi/content/compta/user/analytique/404.xul?"+ cookie(); 										break;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirSousMenu(idSM) {
  try {
	
		document.getElementById('smComptabilite').collapsed = true;
		document.getElementById('smEditions').collapsed = true;
		document.getElementById('smSA').collapsed = true;
		document.getElementById('smAna').collapsed = true;
		document.getElementById('smOD').collapsed = true;

		document.getElementById(idSM).collapsed = false;
		
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

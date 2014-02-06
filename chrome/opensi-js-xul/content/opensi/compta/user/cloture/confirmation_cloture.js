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

		document.getElementById("resultat").value = "RESULTAT DE L'EXERCICE : "+ ParamValeur('Resultat') +" \u20AC";
		document.getElementById("annuler").focus();

	} catch (e) {
    recup_erreur(e);
  }
}


function cloture() {
	try {

		document.getElementById('progression').collapsed = false;
		document.getElementById('pm').setAttribute('mode', 'undetermined');

    document.getElementById('bMenuPrincipal').disabled = true;
    document.getElementById('bFermerSession').disabled = true;
    document.getElementById('annuler').disabled = true;
    document.getElementById('valider').disabled = true;

		var JournalAN = ParamValeur('JournalAN');
		var DetailTiers = ParamValeur('DetailTiers');
		var DetailAux = ParamValeur('DetailAux');
		var AExtourner = ParamValeur('AExtourner');
		var JournalEX = ParamValeur('JournalEX');
		var DateEX = ParamValeur('DateEX');

		var qCloture = new QueryHttp("Compta/UpdateDatabase/Cloture.tmpl");
		qCloture.setParam('JournalAN', JournalAN);
		qCloture.setParam('DetailTiers', DetailTiers);
		qCloture.setParam('DetailAux', DetailAux);
		qCloture.setParam('AExtourner', AExtourner);
		qCloture.setParam('JournalEX', JournalEX);
		qCloture.setParam('DateEX', DateEX);		
		var result = qCloture.execute();

		var errors = new Errors(result);

		if (errors.hasNext()) {		
			errors.show();
		}
		else {
			showMessage("L'exercice a été cloturé avec succés");
			window.location = "chrome://opensi/content/compta/user/menu_dossier.xul?"+ cookie();
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

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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arrondi.js");



function init() {
  try {

		oav_init();
		osa_init();

    var opId = ParamValeur('Op_Id');
		var codeJournal = ParamValeur('Code_Journal');

		if (!isEmpty(opId)) {
			osa_initSaisieEcr(opId);
			document.getElementById('dk-menuSaisie').selectedIndex = 1;
			document.getElementById('bEtatAvancement').collapsed = false;
		}
		else if (!isEmpty(codeJournal)) {
			gms_ouvrirSaisie(codeJournal, ParamValeur('Periode'));
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function gms_ouvrirSaisie(codeJournal, periode) {
  try {

		osa_initSaisie(codeJournal, periode);
		document.getElementById('dk-menuSaisie').selectedIndex = 1;
		document.getElementById('bEtatAvancement').collapsed = false;

  } catch (e) {
    recup_erreur(e);
  }
}


function gms_openRechercheEcriture() {
  try {

    var url = "chrome://opensi/content/compta/util/rechecriture.xul?"+ cookie();
    window.openDialog(url,'','chrome,modal,centerscreen');

  } catch (e) {
    recup_erreur(e);
  }
}


function retourAvancement() {
  try {

  	document.getElementById('oav-deck').selectedIndex = 0;
		document.getElementById('dk-menuSaisie').selectedIndex = 0;
		document.getElementById('bEtatAvancement').collapsed = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function getCurrentDeck() {
  try {

		return document.getElementById('dk-menuSaisie').selectedIndex;

	} catch (e) {
    recup_erreur(e);
  }
}


function retourMenuPrincipal() {
  try {

    window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

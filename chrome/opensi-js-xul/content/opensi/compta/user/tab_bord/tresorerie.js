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


function init() {
  try {

		document.getElementById('date_bord').value = "AU "+ parent.document.getElementById('date_courante').value;
    var paramlist = "&Page=Compta/GetRDF/balance_agee.tmpl&ContentType=xml";
    load_rdf('grille', getUrlOpeneas(paramlist));

    var url_tab_tr = "&Page=Compta/Etats/Tab_TR.tmpl&ContentType=xul";
		document.getElementById('tab_tr').setAttribute("src", getUrlOpeneas(url_tab_tr));

    var url_tresorerie = "&Page=Compta/Etats/Tresorerie.tmpl&ContentType=xul";
		document.getElementById('tresorerie').setAttribute("src", getUrlOpeneas(url_tresorerie));

  } catch (e) {
    recup_erreur(e);
  }
}


function reloadTabTR(d) {
	try {

    var url_tab_tr = "&Page=Compta/Etats/Tab_TR.tmpl&ContentType=xul";
		document.getElementById('tab_tr').setAttribute("src", getUrlOpeneas(url_tab_tr));

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


function balance(t) {
  try {

    window.location = "chrome://opensi/content/compta/user/edition/options_balanceagee.xul?"+ cookie() +"&Type="+ t.label;

  } catch (e) {
    recup_erreur(e);
  }
}
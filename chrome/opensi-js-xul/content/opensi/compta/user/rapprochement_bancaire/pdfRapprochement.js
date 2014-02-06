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


var periode;
var journal;
var date_affiche;
var date_periode;

function init() {
	try {

		var rapproid = ParamValeur('rapproid');
		var baseexo2 = ParamValeur('base2');
		var page = "&Page=Compta/RapprochementBancaire/genPdf_rapprochement.tmpl&rapproid="+ rapproid+"&base2="+baseexo2;

		document.getElementById("pdf").setAttribute("src",getUrlOpeneas(page));

	} catch (e) {
		recup_erreur(e);
	}
}


function retour_module() {
  try {

		var rapproid = ParamValeur('rapproid');
		var nomjournal = ParamValeur('nomjournal');
		var nomcompte = ParamValeur('nomcompte');
    var page = "chrome://opensi/content/compta/user/rapprochement_bancaire/menu_rappro.xul?"+ cookie()+"&rapproid="+ rapproid+"&nomcompte="+nomcompte+"&nomjournal="+nomjournal;

    window.location = page;

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



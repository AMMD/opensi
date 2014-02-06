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

    window.resizeTo(300,100);

		document.getElementById('pm').setAttribute("mode","undetermined");

    if (isEmpty(ParamValeur('onlywait'))) {
      document.getElementById('uploadform').action = getDirServeur() +"uploader";
      document.getElementById('urles').value = getUrlOpeneas("&Page=CloseWindow.tmpl");
      document.getElementById('file').value = ParamValeur('file');
      document.getElementById('dir').value = ParamValeur('dir');
  	  document.getElementById('uploadform').submit();
    }

	} catch (e) {
    recup_erreur(e);
  }
}

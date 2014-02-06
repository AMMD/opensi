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

		loadPhoto();

  } catch (e) {
    recup_erreur(e);
  }
}


function resizeWindow() {
  try {

		window.sizeToContent();

		var x = (screen.width / 2) - (window.outerWidth / 2);
    var y = (screen.height / 2) - (window.outerHeight / 2);

		window.moveTo(x,y);

	} catch (e) {
    recup_erreur(e);
  }
}


function loadPhoto() {
  try {

		var dossier = get_cookie("Dossier_Id");
		var article_id = ParamValeur("Article_Id");
		document.getElementById('Photo').setAttribute("src", getDirServeur() +"photos_articles/"+ dossier +"/"+ article_id +"_big.jpg");

	} catch (e) {
    recup_erreur(e);
  }
}
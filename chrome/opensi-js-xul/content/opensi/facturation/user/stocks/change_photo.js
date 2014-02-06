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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


function init() {
  try {

    window.resizeTo(600,250);

  } catch (e) {
    recup_erreur(e);
  }
}


function validerPhoto() {
  try {

		file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(document.getElementById('Photo').value);

		if (file.fileSize>204800) {
			showWarning("Taille de fichier trop importante !");
		}
		else if (!validExtension(getFileExtension(file.leafName).toLowerCase())) {
			showWarning("Fichier non valide ! (types acceptés : *.gif, *.jpeg, *.jpg, *.png)");
		}
		else {
			var url = "chrome://opensi/content/compta/util/upload.xul?" + cookie();
    	url += "&file=" + document.getElementById('Photo').value;
			url += "&dir=iobuffer";
   		window.openDialog(url,'','chrome,modal,centerscreen');

			var qUpload = new QueryHttp("Facturation/Stocks/processUploadPhoto.tmpl");
			qUpload.setParam('Fichier', file.leafName);
			qUpload.setParam('Article_Id', ParamValeur("Article_Id"));

			var result = qUpload.execute();
			var error = result.responseXML.documentElement.getAttribute('action_error');

			if (error!="") {
				showWarning(error);
			}

			window.close();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function validExtension(ext) {
  try {

		return ext=="gif" || ext=="jpg" || ext=="jpeg" || ext=="png";

	} catch (e) {
    recup_erreur(e);
  }
}

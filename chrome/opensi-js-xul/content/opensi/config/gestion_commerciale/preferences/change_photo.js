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

    window.resizeTo(600,250);

  } catch (e) {
    recup_erreur(e);
  }
}


function validerPhoto() {
  try {
  	
  	var photo = document.getElementById('Photo').value;
  	if (isEmpty(photo)) { showWarning("Veuillez choisir une image à uploader !"); }
  	else {

			file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(photo);
	
			if (file.fileSize>512000) {
				showWarning("Taille de fichier trop importante !");
			}
			else if (!validExtension(getFileExtension(file.leafName).toLowerCase())) {
				showWarning("Fichier non valide ! (types acceptés : *.jpeg, *.jpg)");
			}
			else {
				var url = "chrome://opensi/content/compta/util/upload.xul?"+ cookie();
	    	url += "&file=" + photo;
				url += "&dir=iobuffer";
	   		window.openDialog(url,'','chrome,modal,centerscreen');
	
				var corps = cookie() +"&Page=Config/gestion_commerciale/preferences/processUploadLogo.tmpl&ContentType=xml&Fichier="+ file.leafName;
				var p = requeteHTTP(corps);
	
	    	var contenu = p.responseXML.documentElement;
	
				var error = contenu.getAttribute('action_error');
	
				if (error!="") {
					showWarning(error);
				}
	
				window.close();
			}
  	}

	} catch (e) {
    recup_erreur(e);
  }
}


function validExtension(ext) {
  try {

		return ext=="jpg" || ext=="jpeg";

	} catch (e) {
    recup_erreur(e);
  }
}

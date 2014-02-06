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


var treeAssoc = new Arbre("Facturation/GetRDF/fichiersAssocies.tmpl","assoc");
var qajouterLien = new QueryHttp("Facturation/Recherches/ajouterFichier.tmpl");

function init() {
	try {

		window.resizeTo(300,400);

    var Type=ParamValeur("Type");
    var Document_Id=ParamValeur("Document_Id");
    if (get_pref_acces_check()) {
      document.getElementById('acces_check').checked = true;
    }
    else {
      document.getElementById('acces_check').removeAttribute("Checked");
    }

   	qajouterLien.setParam("Type",Type);
		qajouterLien.setParam("Document_Id",Document_Id);

    treeAssoc.setParam("Type",Type);
    treeAssoc.setParam("Document_Id",Document_Id);
    treeAssoc.setParam("Acces",document.getElementById('acces_check').checked);
    treeAssoc.initTree();

	} catch (e) {
		recup_erreur(e);
	}
}


function charger() {
  try {

		set_pref_acces_check(document.getElementById('acces_check').checked);
    treeAssoc.setParam("Acces",document.getElementById('acces_check').checked);
		treeAssoc.initTree();

	} catch (e) {
  	recup_erreur(e);
  }
}


function valider_assoc() {
  try {

    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Sélectionnez un fichier", nsIFilePicker.modeOpen);
    var res = fp.show(); // clic sur OK : res=0 ; clic sur Annuler ou sur la croix : res = 1 

		if (res!=1 && fp.file!=null) {
    	var lien=fp.file.path;
    	if (!isEmpty(lien)) {
	    	qajouterLien.setParam("Lien", lien);
				qajouterLien.setParam("Nom",getFileName(lien));
				var http = qajouterLien.execute();
				var message = http.responseXML.documentElement.getAttribute("message");
				if (message=="existe") {
	      	 showWarning("Ce fichier est déjà associé à ce document");
				}
				else if (message=="impossible") {
	      	 showWarning("le fichier à ajouter doit être dans le dossier "+http.responseXML.documentElement.getAttribute("dossier"));
				}
				treeAssoc.initTree();
			}
			else {
		  	showWarning("Vous devez donner le chemin du fichier à ajouter");
			}
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function enlever_assoc(Fichier_Assoc_Id) {
  try {
    if (confirm("Etes vous sûr de vouloir enlever la liaison vers ce fichier ?")) {
	    var qenleverLien = new QueryHttp("Facturation/Recherches/enleverFichier.tmpl");
	 	  qenleverLien.setParam("Fichier_Assoc_Id", Fichier_Assoc_Id);
	    qenleverLien.execute();
	    treeAssoc.initTree();
    }

	} catch (e) {
  	recup_erreur(e);
  }
}

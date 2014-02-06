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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var aDossiers;

function init() {
	try {

  	document.getElementById('Dossier_Id').focus();

  	aDossiers = new Arbre("Config/GetRDF/listeDossiers.tmpl", "liste_dossiers");
		aDossiers.setParam("Dossier_Id", document.getElementById('Dossier_Id').value);
		aDossiers.initTree();

		parent.document.getElementById("nom_dossier").value = "";

	} catch (e) {
    recup_erreur(e);
  }
}


function ok() {
	try {

		var doss = document.getElementById('Dossier_Id').value;

		var qExDossier = new QueryHttp("Config/dossiers/existeDossier.tmpl");
		qExDossier.setParam("Dossier_Id", doss);
		qExDossier.execute(ok_2, doss);

	} catch (e) {
    recup_erreur(e);
  }
}


function ok_2(httpRequest, doss) {
	try {
	
		var message = httpRequest.responseXML.documentElement.getAttribute("message");

		if (message=="existe") {
				
			var raison = httpRequest.responseXML.documentElement.getAttribute("raison");

			var qEnterDossier = new QueryHttp("EnterDossier.tmpl");
			qEnterDossier.setParam('Dossier_Id', doss);
			qEnterDossier.execute();

			parent.document.getElementById("nom_dossier").value = doss +" - "+ raison;

    	window.location = "chrome://opensi/content/config/menu_manager.xul?"+ cookie();
		}
		else {
			aDossiers.setParam("Dossier_Id", doss);
			aDossiers.initTree();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function reporter(tree) {
	try {

		if (tree.view!=null && tree.currentIndex!=-1) {
  		document.getElementById("Dossier_Id").value = getCellText(tree,tree.currentIndex, 'num');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function keypress(e,id) {
	try {

		if (id=="dossier") {
      switch(e.keyCode) {
        case 13:
          ok();		 	break;
        case 123:
          document.getElementById('liste_dossiers').focus(); 	break;
      }
  	}

	} catch (e) {
    recup_erreur(e);
  }
}

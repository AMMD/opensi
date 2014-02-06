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

var aDossiers = new Arbre("Compta/GetRDF/RechercheDossier.tmpl", "tree01");


function init() {
  try {

		init_tree();
  	parent.document.getElementById("nom_dossier").value = "";
  	parent.document.getElementById("boxExercice").collapsed = true;
		parent.document.getElementById("date_exercice").value = "";		

	} catch (e) {
    recup_erreur(e);
  }
}


function init_tree() {
  try {

  	aDossiers.setParam("Dossier_Id", document.getElementById('dossier').value);
  	aDossiers.initTree();
		document.getElementById('dossier').focus();

	} catch (e) {
    recup_erreur(e);
  }
}


function ok() {
  try {

		var dossier = document.getElementById("dossier").value;

		var httpRequest = new QueryHttp("Compta/existeDossier.tmpl");
		httpRequest.setParam("Dossier_Id", dossier);
		var p = httpRequest.execute();

		var message = p.responseXML.documentElement.getAttribute("message");
		if (message=="existe") {
			var raison = p.responseXML.documentElement.getAttribute("raison");
			
    	var qEnterDossier = new QueryHttp("EnterDossier.tmpl");
			qEnterDossier.setParam('Dossier_Id', dossier);
			qEnterDossier.execute();
			
			parent.document.getElementById("nom_dossier").value = dossier +" - "+ raison;
    	window.location = "chrome://opensi/content/compta/user/menu_dossier.xul?"+ cookie();
		}
		else {
			aDossiers.setParam("Dossier_Id", dossier);
			aDossiers.initTree();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function reporter(tree) {
  try {

		if (tree!=null && tree.currentIndex!=-1) {
 			document.getElementById("dossier").value = getCellText(tree,tree.currentIndex,'num');
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
        	ok();
      	break;
      	case 123:
        	document.getElementById('tree01').focus();
      	break;
    	}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

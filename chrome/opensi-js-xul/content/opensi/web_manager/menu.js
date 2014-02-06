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

var aDossiers = new Arbre("WebManager/GetRDF/RechercheDossier.tmpl", "dossiers");


function init() {
	try {
	
  	document.getElementById('Dossier_Id').focus();		
		aDossiers.initTree();
  	parent.document.getElementById("nom_dossier").value = "";
		
	}	catch (e) {
   	recup_erreur(e);
  }
}


function ok() {
	try {
	
  	var dossier = document.getElementById("Dossier_Id").value;
 		var corps = cookie() +"&Page=WebManager/existeDossier.tmpl&ContentType=xml&Dossier_Id="+ dossier;
		var p = requeteHTTP(corps);
		
		var message = p.responseXML.documentElement.getAttribute("message");
		if (message=="existe") {
			var raison = p.responseXML.documentElement.getAttribute("raison");
			
     	var qEnterDossier = new QueryHttp("EnterDossier.tmpl");
			qEnterDossier.setParam('Dossier_Id', dossier);
			qEnterDossier.execute();
			
			parent.document.getElementById("nom_dossier").value = dossier + " - " + raison;
     	window.location = "chrome://opensi/content/web_manager/menu_e_commerce.xul?"+ cookie();
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

	if (tree!=null && tree.currentIndex!=-1) {
 		document.getElementById("Dossier_Id").value = getCellText(tree,tree.currentIndex,'num');
	}
} 


function keypress(ev) {
	try {
	
  	if (ev.keyCode==13) {
    	ok();
    }
		
	} catch (e) {
    recup_erreur(e);
  }
}

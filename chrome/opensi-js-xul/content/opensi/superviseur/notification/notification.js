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

var aEntreprisesMail = new Arbre('Superviseur/GetRDF/listeEntreprisesMail.tmpl', 'liste_entreprises_mail');
var aEntreprisesNoMail = new Arbre('Superviseur/GetRDF/listeEntreprisesMail.tmpl', 'liste_entreprises_nomail');


function init() {
	try {
		aEntreprisesMail.setParam("No_Mail",0);
		aEntreprisesMail.initTree();
		
		aEntreprisesNoMail.setParam("No_Mail",1);
		aEntreprisesNoMail.initTree();
	} catch (e) {
    recup_erreur(e);
  }
}


function envoyerMail() {
	try {
		var sujet = document.getElementById("Sujet").value;
		var message = document.getElementById("Message").value;
		var copie = document.getElementById("Copie").checked?"1":"0";
		
		var liste = document.getElementById("liste_entreprises_mail");
		var valeur = "";
		var nombreElements = liste.getRowCount();

		for (var i=0; i<nombreElements; i++) {
			if(liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked","true")=="true") {
				valeur += liste.getItemAtIndex(i).value +",";
			}
		}
		
		if (valeur=="") { showWarning("Veuillez sélectionner au moins une entreprise !"); }
		else if (sujet=="") { showWarning("Veuillez saisir un sujet !"); }
		else if (message=="") { showWarning("Veuillez saisir un message !"); }
		else {
			var qEnvoiMail = new QueryHttp("Superviseur/notification/envoiMail.tmpl");
			qEnvoiMail.setParam("Liste_Entreprises", valeur);
			qEnvoiMail.setParam("Sujet", sujet);
			qEnvoiMail.setParam("Corps_Message", message);
			qEnvoiMail.setParam("Copie", copie);
			qEnvoiMail.execute();
			
			showWarning("Le mail a été envoyé !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function testcheckEntMail() {
	try {

		var liste = document.getElementById("liste_entreprises_mail");
		if (liste.currentItem!=null && liste.selectedIndex!=-1) {
			var item = liste.getItemAtIndex(liste.selectedIndex);
			var cks = item.getElementsByTagName("listcell");
			cks.item(0).setAttribute("checked",(cks.item(0).getAttribute("checked")=="true"?"false":"true"));
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function toutCocher(b) {
	try {
		var listbox = document.getElementById("liste_entreprises_mail");

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;

			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				cks.item(0).setAttribute("checked",b);
				i++;
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function retour_menuManager() {

  window.location = "chrome://opensi/content/superviseur/menu_superviseur.xul?"+ cookie();
}


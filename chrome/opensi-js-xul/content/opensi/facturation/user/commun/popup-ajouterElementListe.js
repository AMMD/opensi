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

var typeElement = ParamValeur("Type_Element");


function init() {
  try {
  	var titre = "";
		switch (typeElement) {
			case "FCLIENT" :
			case "FFOURN" :
			case "FART" : titre = "NOUVELLE FAMILLE"; break;
			case "MARQUE" : titre = "NOUVELLE MARQUE"; break;
			case "ATTRIBUT_1" :
				var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
		    qNomListeAttribut.setParam("Liste_Id", 1);
		    var result = qNomListeAttribut.execute();
				titre = "NOUVEL ATTRIBUT " + result.responseXML.documentElement.getAttribute("Nom").toUpperCase();
			break;
			case "ATTRIBUT_2" :
				var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
		    qNomListeAttribut.setParam("Liste_Id", 2);
		    var result = qNomListeAttribut.execute();
				titre = "NOUVEL ATTRIBUT " + result.responseXML.documentElement.getAttribute("Nom").toUpperCase();
			break;
			case "ATTRIBUT_3" :
				var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
		    qNomListeAttribut.setParam("Liste_Id", 3);
		    var result = qNomListeAttribut.execute();
				titre = "NOUVEL ATTRIBUT " + result.responseXML.documentElement.getAttribute("Nom").toUpperCase();
			break;
			case "ATTRIBUT_4" :
				var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
		    qNomListeAttribut.setParam("Liste_Id", 4);
		    var result = qNomListeAttribut.execute();
				titre = "NOUVEL ATTRIBUT " + result.responseXML.documentElement.getAttribute("Nom").toUpperCase();
			break;
			case "ATTRIBUT_5" :
				var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
		    qNomListeAttribut.setParam("Liste_Id", 5);
		    var result = qNomListeAttribut.execute();
				titre = "NOUVEL ATTRIBUT " + result.responseXML.documentElement.getAttribute("Nom").toUpperCase();
			break;
			case "ATTRIBUT_6" :
				var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
		    qNomListeAttribut.setParam("Liste_Id", 6);
		    var result = qNomListeAttribut.execute();
				titre = "NOUVEL ATTRIBUT " + result.responseXML.documentElement.getAttribute("Nom").toUpperCase();
			break;
		}
		document.getElementById('lblTitre').value = titre;

  } catch (e) {
    recup_erreur(e);
  }
}


function valider() {
  try {

  	var libelle = document.getElementById('libelle').value;
  	
  	if (isEmpty(libelle)) { showWarning("Veuillez saisir un libellé !"); }
  	else {
			var qValider = new QueryHttp("Facturation/Commun/creerElementListe.tmpl");
			qValider.setParam("Type_Element", typeElement);
			qValider.setParam("Libelle", libelle);
			if (typeElement=="FART") { qValider.setParam("Parent_Id", ParamValeur("Parent_Id")); }
			var result = qValider.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="false") { showWarning("Erreur : le libellé est déjà utilisé par un élément de la liste !"); }
			else {
				showWarning("L'élément a été ajouté à la liste !");
				var elementId = result.responseXML.documentElement.getAttribute("Element_Id");
				
				window.arguments[0](elementId);
				window.close();
			}
  	}
	} catch (e) {
    recup_erreur(e);
  }
}

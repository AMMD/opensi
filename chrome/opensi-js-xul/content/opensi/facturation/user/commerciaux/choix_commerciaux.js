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


var arbre = new Arbre("Facturation/GetRDF/liste_commerciaux_inscrits.tmpl", "liste_commerciaux");
var est_admin = false;


function init() {
  try {
  	document.getElementById("acces_restreint").value = "";
  	document.getElementById("acces_restreint").collapsed=true;
  	var queryCommercial = new QueryHttp("Facturation/Commerciaux/typeUser.tmpl");
  	queryCommercial.execute(initCommercial);
  } catch (e) {
    recup_erreur(e);
  }
}

function initCommercial(result) {
	try {
		est_admin = (result.responseXML.documentElement.getAttribute("admin")=="true");
		var commercial_id = result.responseXML.documentElement.getAttribute("commercial");

		document.getElementById('barre_actions').collapsed = !est_admin;
		document.getElementById('liste_commerciaux').collapsed = !est_admin;

		if (est_admin) {
  		arbre.initTree();
		} else if (commercial_id!="") {
			var params = "&NewCommercial=false&Commercial_Id="+ commercial_id +"&isAdmin=false";
    	urlCommerciaux = "chrome://opensi/content/facturation/user/commerciaux/gestion_commerciaux.xul?"+ cookie() + params;
			window.location = urlCommerciaux;
		} else {
			document.getElementById("acces_restreint").value = "Vous n'avez pas les droits pour accéder à cette partie.";
			document.getElementById("acces_restreint").collapsed=false;
		}
	}	catch(e) {
    recup_erreur(e);
	}
}


function pressOnTree() {
	try {

		var tree = document.getElementById('liste_commerciaux');

		if (tree.view!=null && tree.currentIndex!=-1) {
			var actif = (getCellText(tree, tree.currentIndex, 'ColSupprime')=="0");
			document.getElementById('bModifier').disabled = false;
			document.getElementById('bSupprimer').disabled = !actif;
			document.getElementById('bReactiver').disabled = actif;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function modifierCommercial() {
	try {

		var tree = document.getElementById('liste_commerciaux');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var commercial_id = getCellText(tree, tree.currentIndex, 'ColCommercial_Id');
			var supprime = getCellText(tree, tree.currentIndex, 'ColSupprime');
			var params = "&NewCommercial=false&Commercial_Id="+ commercial_id +"&isAdmin="+ est_admin +"&Supprime="+supprime;

    	window.location = "chrome://opensi/content/facturation/user/commerciaux/gestion_commerciaux.xul?"+ cookie() + params;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauCommercial() {
	try {

		var params = "&NewCommercial=true&isAdmin="+ est_admin +"&Supprime=0";
		window.location = "chrome://opensi/content/facturation/user/commerciaux/gestion_commerciaux.xul?"+ cookie() + params;

	} catch (e) {
    recup_erreur(e);
  }
}


function desactiverCommercial() {
	try {

		var tree = document.getElementById('liste_commerciaux');

		if (tree.view!=null && tree.currentIndex!=-1) {
			if (confirm("Confirmez-vous la désactivation de ce commercial ?")) {
				var queryDesactiverCom = new QueryHttp("Facturation/Commerciaux/suppression_commercial.tmpl");
      	queryDesactiverCom.setParam("Commercial_Id", getCellText(tree, tree.currentIndex, 'ColCommercial_Id'));
      	queryDesactiverCom.execute();
				arbre.initTree();
			}
			document.getElementById('bModifier').disabled = true;
			document.getElementById('bSupprimer').disabled = true;
		}

	} catch(e) {
    recup_erreur(e);
  }
}


function reactiverCommercial() {
	try {

		var tree = document.getElementById('liste_commerciaux');

		if (tree.view!=null && tree.currentIndex!=-1) {
			if (confirm("Confirmez-vous la réactivation de ce commercial ?")) {
				var queryReactiverCom = new QueryHttp("Facturation/Commerciaux/reactivation_commercial.tmpl");
      	queryReactiverCom.setParam("Commercial_Id", getCellText(tree, tree.currentIndex, 'ColCommercial_Id'));
      	queryReactiverCom.execute();
				arbre.initTree();
			}
			document.getElementById('bModifier').disabled = true;
			document.getElementById('bReactiver').disabled = true;
		}

	} catch(e) {
    recup_erreur(e);
  }
}


function retourMenuPrincipal() {
	try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


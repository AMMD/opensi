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
/*
 * Affichage des échéances à solder
 */


jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var aEcheances = new Arbre("Facturation/Suivi_Reglements_Clients/liste-echeances.tmpl", "listeEcheances");

function init() {
	try {

		window.resizeTo(1200,600);
		reinitialiser();

	} catch (e) {
		recup_erreur(e);
	}
}


function reinitialiser() {
	try {
		document.getElementById('nbCentimes').value = "1";
		rafraichirListeEcheances();
	} catch (e) {
		recup_erreur(e);
	}
}


function rafraichirListeEcheances() {
	try {
		var nbCentimes = document.getElementById('nbCentimes').value;
		if (isEmpty(nbCentimes) || !isPositiveInteger(nbCentimes)) { showWarning("Le nombre de centimes est invalide !"); }
		else {
			document.getElementById('nbCentimes').disabled = true;
			document.getElementById('bValider').disabled = true;
			document.getElementById('listeEcheances').disabled = true;
			aEcheances.setParam("Nb_Centimes", nbCentimes);
			aEcheances.initTree(initListeEcheances);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function initListeEcheances() {
	try {
		var liste = document.getElementById("listeEcheances");
		document.getElementById('nbCentimes').disabled = false;
		document.getElementById('bValider').disabled = (liste.getRowCount()==0);
		document.getElementById('listeEcheances').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			rafraichirListeEcheances();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function testCheck(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		if (cks.item(0).getAttribute("checked")=="false") {
			cks.item(0).setAttribute("checked","true");
		} else {
			cks.item(0).setAttribute("checked","false");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function valider() {
	try {
		var liste = document.getElementById("listeEcheances");
		var listeEcheances = "";
		var nombreElements = liste.getRowCount();
		for (var i=0; i<nombreElements; i++) {
			if (liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
				listeEcheances += liste.getItemAtIndex(i).value +",";
			}
		}
		
		if (isEmpty(listeEcheances)) { showWarning("Veuillez cocher au moins une échéance !"); }
		else if (window.confirm("Voulez-vous solder les échéances sélectionnées en perte et profit ?")) {
			var qSolderEcheances = new QueryHttp("Facturation/Suivi_Reglements_Clients/solderEcheances.tmpl");
			qSolderEcheances.setParam("Liste_Echeances", listeEcheances);
			var result = qSolderEcheances.execute();
			var listeRegularisations = result.responseXML.documentElement.getAttribute("Liste_Regularisations");
			var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
			
			if (transfertAuto) {
				var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
				qVerifier.setParam("Liste_Id", listeRegularisations);
				qVerifier.setParam("Type", "REGUL_ECHEANCE");
				result = qVerifier.execute();
				var errors = new Errors(result);
				if (errors.hasNext()) {
					errors.show();
				} else {
					var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
					qTransfertAuto.setParam("Regularisation_Id", listeRegularisations);
					qTransfertAuto.setParam("Type", "REGUL_ECHEANCE");
					qTransfertAuto.execute();
				}
			}
			
			window.arguments[0]();
			window.close();
		}
	} catch (e) {
		recup_erreur(e);
	}
}
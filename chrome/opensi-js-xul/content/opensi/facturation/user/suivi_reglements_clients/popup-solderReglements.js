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
 * Affichage des règlements à solder
 */


jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var aReglements = new Arbre("Facturation/Suivi_Reglements_Clients/liste-avoirsReglements.tmpl", "listeReglements");

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
		rafraichirListeReglements();
	} catch (e) {
		recup_erreur(e);
	}
}


function rafraichirListeReglements() {
	try {
		var nbCentimes = document.getElementById('nbCentimes').value;
		if (isEmpty(nbCentimes) || !isPositiveInteger(nbCentimes)) { showWarning("Le nombre de centimes est invalide !"); }
		else {
			document.getElementById('nbCentimes').disabled = true;
			document.getElementById('bValider').disabled = true;
			document.getElementById('listeReglements').disabled = true;
			aReglements.setParam("Nb_Centimes", nbCentimes);
			aReglements.initTree(initListeReglements);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function initListeReglements() {
	try {
		var liste = document.getElementById("listeReglements");
		document.getElementById('nbCentimes').disabled = false;
		document.getElementById('bValider').disabled = (liste.getRowCount()==0);
		document.getElementById('listeReglements').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			rafraichirListeReglements();
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
		var liste = document.getElementById("listeReglements");
		var listeReglements = "";
		var nombreElements = liste.getRowCount();
		for (var i=0; i<nombreElements; i++) {
			if (liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
				listeReglements += liste.getItemAtIndex(i).value +";";
				listeReglements += liste.getItemAtIndex(i).getElementsByTagName("listcell").item(9).getAttribute("label") +",";
			}
		}
		
		if (isEmpty(listeReglements)) { showWarning("Veuillez cocher au moins un règlement !"); }
		else if (window.confirm("Voulez-vous solder les règlements sélectionnés en perte et profit ?")) {
			var qSolderReglements = new QueryHttp("Facturation/Suivi_Reglements_Clients/solderReglements.tmpl");
			qSolderReglements.setParam("Liste_Reglements", listeReglements);
			var result = qSolderReglements.execute();
			
			var listeRegularisationsRegl = result.responseXML.documentElement.getAttribute("Liste_Regularisations_Regl");
			var listeRegularisationsAvoir = result.responseXML.documentElement.getAttribute("Liste_Regularisations_Avoir");
			var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
			
			if (transfertAuto) {
				var ok = true;
				if (!isEmpty(listeRegularisationsRegl)) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", listeRegularisationsRegl);
					qVerifier.setParam("Type", "REGUL_REGL");
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						ok = false;
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Regularisation_Id", listeRegularisationsRegl);
						qTransfertAuto.setParam("Type", "REGUL_REGLEMENT");
						qTransfertAuto.execute();
					}
				}
				
				if (ok && !isEmpty(listeRegularisationsAvoir)) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", listeRegularisationsAvoir);
					qVerifier.setParam("Type", "REGUL_AVOIR");
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						ok = false;
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Regularisation_Id", listeRegularisationsAvoir);
						qTransfertAuto.setParam("Type", "REGUL_AVOIR");
						qTransfertAuto.execute();
					}
				}
			}
			
			window.arguments[0]();
			window.close();
		}
	} catch (e) {
		recup_erreur(e);
	}
}
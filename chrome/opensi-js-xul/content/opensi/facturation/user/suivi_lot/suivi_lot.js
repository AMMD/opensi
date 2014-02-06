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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var aReceptions = new Arbre("Facturation/GetRDF/liste_receptions_lot.tmpl", "liste_receptions");
var aLivraisons = new Arbre("Facturation/GetRDF/liste_livraisons_lot.tmpl", "liste_livraisons");

var blocage=false;
var num_lot_courant = "";

function init() {
	try {

		document.getElementById('bRetourSuiviLot').collapsed = true;
		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bActionNumLot').disabled = true;
		document.getElementById('bEdition').disabled = true;

	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnNumLot(ev) {
	try {
		if (ev.keyCode==13) {
			validerNumLot();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function validerNumLot() {
	try {
		
		var num_lot = document.getElementById('num_lot').value;
		
		if (isEmpty(num_lot)) { showWarning("Veuillez saisir un numéro de lot !"); }
		else {
			num_lot_courant = num_lot;
			document.getElementById('bEdition').disabled = true;
			var qCheckNumLot = new QueryHttp("Facturation/Suivi_Lot/checkNumLot.tmpl");
			qCheckNumLot.setParam("Num_Lot", num_lot);
			var result = qCheckNumLot.execute();
			blocage = (result.responseXML.documentElement.getAttribute("blocage")=="true");
			document.getElementById('bActionNumLot').label = (blocage?"Débloquer le n° de lot":"Bloquer le n° de lot");
			document.getElementById('bActionNumLot').disabled = false;
			
			var qGetRefArticle = new QueryHttp("Facturation/Suivi_Lot/getRefArticleLot.tmpl");
			qGetRefArticle.setParam("Num_Lot", num_lot);
			var result = qGetRefArticle.execute();
			var existe = (result.responseXML.documentElement.getAttribute("existe")=="true");
			if (existe) {
				var reference = result.responseXML.documentElement.getAttribute("reference");
				var designation = result.responseXML.documentElement.getAttribute("designation");
				document.getElementById("RefArticle").value = "Réf Article : " + reference + "; Désignation : " + designation;
			} else {
				document.getElementById("RefArticle").value = "";
			}
			
			aReceptions.setParam("Num_Lot", num_lot);				
			aReceptions.initTree();
			
			aLivraisons.setParam("Num_Lot", num_lot);				
			aLivraisons.initTree(initListeLivraisons);
		}
		
	} catch (e) {
		recup_erreur(e);
	}	
}


function initListeLivraisons() {
	try {		
		document.getElementById('bEdition').disabled = (aReceptions.nbLignes()==0 && aLivraisons.nbLignes()==0);
	} catch (e) {
		recup_erreur(e);
	}
}



function bloquerNumLot() {
	try {
		
		blocage = !blocage;
		var qActionNumLot;
		if (blocage) {
			qActionNumLot = new QueryHttp("Facturation/Suivi_Lot/bloquerNumLot.tmpl");
		} else {
			qActionNumLot = new QueryHttp("Facturation/Suivi_Lot/debloquerNumLot.tmpl");
		}
		qActionNumLot.setParam("Num_Lot", num_lot_courant);
		qActionNumLot.execute();
		
		document.getElementById('bActionNumLot').label = (blocage?"Débloquer le n° de lot":"Bloquer le n° de lot");
		
	} catch (e) {
		recup_erreur(e);
	}
}


function editionPdf() {
	try {
		var page = getUrlOpeneas("&Page=Facturation/Suivi_Lot/suivi_pdf.tmpl&Num_Lot="+ urlEncode(num_lot_courant));
		document.getElementById('suivi_lot').setAttribute("src", page);
		document.getElementById('deck').selectedIndex = 1;
		document.getElementById('bRetourSuiviLot').collapsed = false;
	} catch(e) {
		recup_erreur(e);
	}
}


function editionCourrier() {
	try {
		var qExiste = new QueryHttp("Facturation/Suivi_Lot/existeNumLotBloque.tmpl");
		var p = qExiste.execute();
		if (p.responseXML.documentElement.getAttribute("existe")=="true") {
			var page = getUrlOpeneas("&Page=Facturation/Suivi_Lot/courrier_pdf.tmpl");
			document.getElementById('suivi_lot').setAttribute("src", page);
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('bRetourSuiviLot').collapsed = false;
		} else {
			showWarning("Il n'y a rien à éditer : aucun n° de lot n'est bloqué.");
		}
	} catch(e) {
		recup_erreur(e);
	}
}


function retour_suivi_lot() {
  try {

		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bRetourSuiviLot').collapsed = true;		

  } catch (e) {
    recup_erreur(e);
  }
}


function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

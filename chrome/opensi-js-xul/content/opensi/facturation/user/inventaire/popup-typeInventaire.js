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


var aFamille1 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_1');
var aFamille2 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_2');
var aFamille3 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_3');
var aMarques = new Arbre('Facturation/GetRDF/combo-marquesArticle.tmpl', 'Marque');


function init() {
  try {

		disableCriteres(true);

    
		aFamille1.initTree(initFamille1);
		aMarques.initTree(initMarque);

  } catch (e) {
    recup_erreur(e);
  }
}


function initFamille1() {
  try {

		document.getElementById('Famille_1').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles2() {
	try {
  	
		aFamille2.setParam('Parent_Id', document.getElementById('Famille_1').value);
		aFamille2.initTree(initFamille2);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille2() {
  try {

		document.getElementById('Famille_2').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles3() {
	try {
  	
		aFamille3.setParam('Parent_Id', document.getElementById('Famille_2').value);
		aFamille3.initTree(initFamille3);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille3() {
  try {

		document.getElementById('Famille_3').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnFamille1() {
  try {

		chargerFamilles2();
		aFamille3.deleteTree();
		initFamille3();

  } catch (e) {
    recup_erreur(e);
  }
}

function pressOnFamille2() {
  try {

		chargerFamilles3();

  } catch (e) {
    recup_erreur(e);
  }
}



function initMarque() {
	try {

		document.getElementById('Marque').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function disableCriteres(b) {
  try {

		document.getElementById('Marque').disabled = b;
		document.getElementById('Famille_1').disabled = b;
		document.getElementById('Famille_2').disabled = b;
		document.getElementById('Famille_3').disabled = b;

	} catch (e) {
    recup_erreur(e);
  }
}


function ok() {
  try {

		var typeInventaire = document.getElementById('Type_Inventaire').value;
		var marque = (typeInventaire=='P'?document.getElementById('Marque').value:"0");
		var famille1 = (typeInventaire=='P'?document.getElementById('Famille_1').value:"0");
		var famille2 = (typeInventaire=='P'?document.getElementById('Famille_2').value:"0");
		var famille3 = (typeInventaire=='P'?document.getElementById('Famille_3').value:"0");

    window.arguments[0](typeInventaire, marque, famille1, famille2, famille3);
		window.close();

  } catch (e) {
    recup_erreur(e);
  }
}

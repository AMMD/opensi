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
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");

var nf = new NumberFormat("0.00", false);

var produits_decoche = new Array();


var aChoixProduit = new Arbre('', 'Facturation/Factu_Auto/liste-choixProduit.tmpl', 'listeProduitsEnAttente');

function init() {
  try {
		
		window.resizeTo(600,400);
		aChoixProduit.setParam("Affaire_Id",ParamValeur("Affaire_Id"));
		aChoixProduit.setParam("Produits_Decoche",ParamValeur("Produits_Decoche"));
		aChoixProduit.initTree();

  } catch (e) {
  	recup_erreur(e);
  }
}

function valider() {
  try {
		var ok = false;
		coche_produit = new Array();
		decoche_produit = new Array();
		var liste = document.getElementById("listeProduitsEnAttente");
		var nombreElements = liste.getRowCount();
		for (var i=0; i<nombreElements; i++) {
			elem=liste.getItemAtIndex(i).getElementsByTagName("listcell");
			if(liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked","true")=="true"){
				ok = true;
				coche_produit.push(liste.getItemAtIndex(i).value);
			}
			else {
				decoche_produit.push(liste.getItemAtIndex(i).value);
			}
		}
		if (ok) {
			window.arguments[0](coche_produit,decoche_produit);
			window.close();
		}
		else {
			showWarning("Vous devez cocher au moins un code produit");
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


function toutCocher() {
	try {
		var total = 0;
		var listbox = document.getElementById("listeProduitsEnAttente");

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;
			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				cks.item(0).setAttribute("checked","true");
				i++;
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function toutDecocher() {
	try {
		var listbox = document.getElementById("listeProduitsEnAttente");

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;
			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				cks.item(0).setAttribute("checked","false");
				i++;
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function annuler() {
  try {
		window.close();
  } catch (e) {
  	recup_erreur(e);
  }
}

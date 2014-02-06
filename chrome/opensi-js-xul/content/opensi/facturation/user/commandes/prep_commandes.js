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


var aPrepCom = new Arbre('Facturation/GetRDF/preparation_commandes.tmpl', 'tree-prepcom');

var aPrepComTotaux = new Arbre('Facturation/GetRDF/preparation_commandes_totaux.tmpl', 'tree-totaux');

var idxColQte = 6;
var idxColPack = 7;
var idxColSVA = 11;
var currentLine = 0;
var currentFournisseur = "";

var qMajQte = new QueryHttp("Facturation/Commandes/modifierQtePrep.tmpl");


function init() {
  try {
  
  		document.getElementById('Quantite').value = "";
  		document.getElementById('Quantite').disabled = true;
		document.getElementById('bChgQte').disabled = true;
		document.getElementById('breinitprep').disabled = true;
		document.getElementById('bGenCom').disabled = true;

		var qPossible = new QueryHttp("Facturation/Commandes/isPrepPossible.tmpl");
		var result = qPossible.execute();

		if (result.responseXML.documentElement.getAttribute('possible')=="true") {
  		aPrepCom.initTree(init2);
		}
		else {
			document.getElementById('msgImpossible').collapsed = false;
		}

  } catch (e) {
  	recup_erreur(e);
  }
}


function init2() {
	try {

		aPrepComTotaux.initTree();
		document.getElementById('bGenCom').disabled = false;
		document.getElementById('breinitprep').disabled = false;

	} catch (e) {
  	recup_erreur(e);
  }
}


function genererBC() {
  try {

		document.getElementById('bGenCom').disabled = true;
		document.getElementById('breinitprep').disabled = true;
		var qGenBC = new QueryHttp("Facturation/Commandes/validerPrepCommande.tmpl");
		qGenBC.execute(goToCommandes);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reinitialiserBPC() {
  try {

		var qreinitBPC = new QueryHttp("Facturation/Commandes/reinitialiserPrepCommande.tmpl");
		qreinitBPC.execute(init);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterQte() {
  try {

		var tree = document.getElementById('tree-prepcom');

		if (tree.view!=null && tree.currentIndex!=-1) {
			currentLine = tree.currentIndex;
			document.getElementById('Quantite').value = getCellText(tree, currentLine, 'ColQuantite');
			document.getElementById('Quantite').disabled = false;
			document.getElementById('bChgQte').disabled = false;
			document.getElementById('Quantite').select();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function changerQuantite() {
  try {

		var quantite = document.getElementById('Quantite').value;

		if (isEmpty(quantite) || !isPositiveOrNull(quantite)) {

			showWarning("Quantité incorrecte");
			document.getElementById('Quantite').select();
		}
		else {
			document.getElementById('Quantite').disabled = true;
			document.getElementById('bChgQte').disabled = true;

			var tree = document.getElementById('tree-prepcom');

			var ligne = tree.view.getItemAtIndex(currentLine).childNodes[0].childNodes;

			if (tree.view.getLevel(currentLine)==0) {
				ligneParent = ligne;
			}
			else {
				var parentLine = tree.view.getParentIndex(currentLine);
				var ligneParent = tree.view.getItemAtIndex(parentLine).childNodes[0].childNodes;
			}

			var qteInit = parseFloat(ligne[idxColQte].getAttribute("label"));
			var pack = parseFloat(ligne[idxColPack].getAttribute("label"));
			var stockApres = parseFloat(ligneParent[idxColSVA].getAttribute("label")) + (parseFloat(quantite) - qteInit)*pack;

			ligne[idxColQte].setAttribute("label", quantite);
			ligneParent[idxColSVA].setAttribute("label", stockApres);

			qMajQte.setParam("Quantite", quantite);
			qMajQte.setParam("Fournisseur_Id", getCellText(tree, currentLine, 'ColFournisseur_Id'));
			qMajQte.setParam("Ligne_Prep_Id", getCellText(tree, currentLine, 'ColLigne_Prep_Id'));
			qMajQte.execute();
			tree.focus();
  		aPrepComTotaux.initTree();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function keypress(ev, id) {
  try {

		if (ev.keyCode==13) {
			if (id=="tree-prepcom") {
				reporterQte();
			}
			else if (id=="Quantite") {
				changerQuantite();
			}
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function goToCommandes() {
  try {

		window.location = "chrome://opensi/content/facturation/user/commandes/menu_commandes.xul?"+ cookie();

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

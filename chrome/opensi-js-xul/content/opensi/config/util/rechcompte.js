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

var aComptes = new Arbre('Config/GetRDF/listeComptes.tmpl', 'comptes_tree');
var qExCompte = new QueryHttp("Compta/Commun/rechercheCompte.tmpl");

var noresult = false;
var creerCompte;

function init() {
	try {


		document.getElementById('titre').value = "RECHERCHE DE COMPTE "+ ParamValeur("nom");

		var force_deb = ParamValeur("Force_Deb");
		var typeRech = ParamValeur("Type_Rech");
		var typeCompte = ParamValeur("Type_Compte");
		creerCompte = (ParamValeur("Creer")=="true");
		var num_compte = ParamValeur("Num_Compte").replace(' ','');

		if (!isEmpty(force_deb)) {
			aComptes.setParam('Force_Deb', force_deb);
			qExCompte.setParam('Force_Deb', force_deb);
		}
		if (!isEmpty(typeRech)) {
			aComptes.setParam('Type_Rech', typeRech);
			qExCompte.setParam('Type_Rech', typeRech);
		}
		if (!isEmpty(typeCompte)) {
			aComptes.setParam('Type_Compte', typeCompte);
			qExCompte.setParam('Type_Compte', typeCompte);
		}

		document.getElementById('num_compte').value = num_compte;

		init_tree();

		document.getElementById('num_compte').focus();

	} catch (e) {
		recup_erreur(e);
	}
}


function init_tree() {
	try {

		var numc = document.getElementById('num_compte').value;
		var libc = document.getElementById('lib_compte').value;

		aComptes.setParam('Numero_Compte', numc);

		if (isEmpty(libc)) {
			aComptes.removeParam('Libelle');
		}
		else {
			aComptes.setParam('Libelle', libc);
		}

		aComptes.initTree(fin_chargement);

	} catch (e) {
		recup_erreur(e);
	}
}


function fin_chargement() {
	try {

		if (document.getElementById('comptes_tree').view == null) {
			var libc = document.getElementById('num_compte').value;
			if (noresult || isEmpty(libc)) {
				document.getElementById('num_compte').value = document.getElementById('lib_compte').value;
				document.getElementById('lib_compte').value = '';
			}
			else {
				document.getElementById('lib_compte').value = libc;
				document.getElementById('num_compte').value = '';
				noresult = true;
				init_tree();
			}
		}
		noresult = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function reporter() {
	try {

		var tree = document.getElementById('comptes_tree');

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("num_compte").value = getCellText(tree, tree.currentIndex, 'num');
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function ok() {
	try {

		if (doOK()) {
			var num_compte = document.getElementById('num_compte').value;
			window.arguments[0](num_compte);
			window.close();
		}
		else {
			document.getElementById('num_compte').focus();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function doOK() {
	try {

		var input_compte = document.getElementById('num_compte');
		var num_compte = input_compte.value;
		if (num_compte.length < 8) {
			init_tree();
			return false;
		}
		else {

			qExCompte.setParam("Numero_Compte", num_compte);
			result = qExCompte.execute();
			
			if (result.responseXML.documentElement.getAttribute("existe")=="true") {
				return true;
			}
			else {
				var msg = "Le compte numéro "+ num_compte +" est invalide !";
				if (creerCompte) {
					msg += "\nVoulez-vous créer un nouveau compte ?";
					if (confirm(msg)) {
						creer_compte();
						return false;
					}
					else {
						return false;
					}
				}
				else {
					showWarning(msg);
					return false;
				}
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function creer_compte() {
	try {

		var num_compte = document.getElementById('num_compte').value;
		var url = "chrome://opensi/content/config/util/nouveau_compte.xul?"+ cookie()+"&Numero_Compte="+num_compte;
		window.openDialog(url,'','chrome,modal,centerscreen',reportCompte);

	} catch (e) {
		recup_erreur(e);
	}
}

function reportCompte(numero_compte) {
	try {
		document.getElementById("num_compte").value = numero_compte;
		init_tree();
	} catch (e) {
		recup_erreur(e);
	}
}


function keypress(e, id) {
	try {
		switch (e.keyCode) {
			case 33: // 'PageUp'
				select_up();
				break;
			case 34: // 'PageDown'
				select_down();
				break;
			case 38: // '^'
				select_prev();
				break;
			case 40: // 'v'
				select_next();
				break;
			case 13: // <Enter>
				if (id=="lib_compte")
					init_tree();
				else
					ok();
				break;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


// sélection de la ligne précédente à la ligne sélectionnée
function select_prev() {
	try {

		var tree = document.getElementById('comptes_tree');

		if (tree.view!=null) {
			var index = tree.currentIndex - 1;
			if (index >= 0) {
				select_row(index);
			}
			else {
				select_row(0);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


// sélection de la ligne suivante à la ligne sélectionnée
function select_next() {
	try {

		var tree = document.getElementById('comptes_tree');

		if (tree.view!=null) {
			var index = tree.currentIndex + 1;
			if (index < tree.view.rowCount) {
				select_row(index);
			}
			else {
				select_row(tree.view.rowCount - 1);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


// sélection d'une ligne 10 lignes au dessus de la ligne sélectionnée
function select_up() {
	try {

		var tree = document.getElementById('comptes_tree');

		if (tree.view!=null) {
			var index = tree.currentIndex - 10;
			if (index < 0) {
				select_row(0);
			}
			else {
				select_row(index);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


// sélection d'une ligne 10 lignes en dessous de la ligne sélectionnée
function select_down() {
	try {

		var tree = document.getElementById('comptes_tree');

		if (tree.view!=null) {
			var index = tree.currentIndex + 10 ;
			if (index >= tree.view.rowCount) {
				select_row(tree.view.rowCount - 1);
			}
			else {
				select_row(index);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


// selectionne une ligne dans l'arbre
function select_row(index) {
	try {

		var tree = document.getElementById('comptes_tree');
		tree.treeBoxObject.focused = true;
		tree.view.selection.select(index);
		tree.treeBoxObject.ensureRowIsVisible(index);

	} catch (e) {
		recup_erreur(e);
	}
}

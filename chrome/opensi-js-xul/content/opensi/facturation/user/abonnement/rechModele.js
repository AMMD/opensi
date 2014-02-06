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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var dureeModele = new Arbre("Facturation/GetRDF/dureeModele.tmpl","DureeModele");
var tree = new Arbre("Facturation/GetRDF/liste_modele.tmpl","ListeModeles");


function init() {
  try {

    window.resizeTo(800,500);

		document.getElementById('bOuvrir').disabled = true;

		dureeModele.initTree(initDuree);
		window.parent.addEventListener("close",retour_gestion_abonnement,false);

	 } catch (e) {
    recup_erreur(e);
  }
}


function initDuree() {
	try {

		document.getElementById('DureeModele').selectedIndex = 0;

	}
	catch(e) {
		recup_erreur(e);
  }
}


//fonction qui permet de retourner à la gestion des abonnements si l'on clique sur la croix pour quitter
function desinit() {
	try {

		window.parent.removeEventListener("close",retour_gestion_abonnement,false);

	} catch (e) {
    recup_erreur(e);
  }
}


//fonction de retour à la gestion des abonnements
function retour_gestion_abonnement() {
	 try {
	 		window.arguments[0]("null");
			window.close();
		}

		catch (e) {
    recup_erreur(e);
  }
}


//fonction execute lors de la selection d'une reference
function pressOnId(ev) {
  try {

		if (ev.keyCode==13) {

			document.getElementById('Libelle_modele').value = "";
			document.getElementById('TypeContrat').value = "0";
			document.getElementById('DureeModele').value = "0";
			tree.clearParams();
			tree.setParam("Reference_modele",document.getElementById('Reference').value);
			tree.initTree();
    }

  } catch (e) {
    recup_erreur(e);
  }
}
//fonction execute lors de la selection d'un libelle
function pressOnLibelle(ev) {
  try {
    if (ev.keyCode==13) {

		 	document.getElementById('Reference').value = "";
			document.getElementById('TypeContrat').value = "0";
			document.getElementById('DureeModele').value = "0";
			tree.clearParams();
			tree.setParam("Libelle_modele",document.getElementById('Libelle_modele').value);
			tree.initTree();
    }

  } catch (e) {
    recup_erreur(e);
  }
}
//fonction execute lors de la selection d'une duree
function pressOnDuree() {
  try {

		document.getElementById('Reference').value = "";
		document.getElementById('Libelle_modele').value = "";
		document.getElementById('TypeContrat').value = 0;
		var duree = document.getElementById('DureeModele').value;
		tree.clearParams();
		if (duree=="0")
		{
			tree.initTree();
		}
		else
		{

			var valeur = duree.split(/\s/);

    	tree.setParam("Duree_Contrat",valeur[0]);
			tree.setParam("Type_duree_contrat",valeur[1]);
    	tree.initTree();
		}
  } catch (e) {
    recup_erreur(e);
  }
}

//fonction execute lors de la selection d'un type Contrat
function pressOnTypeContrat() {
  try {

		document.getElementById('Reference').value = "";
		document.getElementById('Libelle_modele').value = "";
		document.getElementById('DureeModele').value = 0;
		tree.clearParams();
		if (document.getElementById('TypeContrat').value=="0") {
			tree.initTree();
		}
		else {
			tree.setParam("Type_contrat",document.getElementById('TypeContrat').value);
			tree.initTree();
		}

  } catch (e) {
    recup_erreur(e);
  }
}


//fonction qui affiche les informations sur un modele dans l'arbre
function ouvrirModele() {
	try	{

		var tree = document.getElementById("ListeModeles");

		if (tree.view!=null && tree.currentIndex!=-1)	{
			var modele_id = getCellText(tree,tree.currentIndex,'ColModele_Id');
			window.arguments[0](modele_id);
			window.close();
		}

	}	catch (e)	{
    recup_erreur(e);
	}
}

//fonction qui active le bouton ouvrir lors de la selection d'un modele
function MontrerOuvrir() {
	try {

		var tree = document.getElementById("ListeModeles");

		if (tree.view!=null && tree.currentIndex!=-1)	{
			document.getElementById('bOuvrir').disabled = false;
		}

	}	catch (e)	{
    recup_erreur(e);
	}
}

function nouveauModele() {
	try {

		window.arguments[0]("nouveauModele");
		window.close();

	}	catch (e) {
    recup_erreur(e);
	}
}


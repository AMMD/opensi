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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");


var aFournisseurs = new Arbre("Facturation/Commandes/liste-fournisseursArticle.tmpl", "fournisseur");
var aCommandes = new Arbre("Facturation/Commandes/liste-commandesNonValidees.tmpl", "commande");
var aArticles = new Arbre("Facturation/Commandes/liste-articlesFournisseurCommande.tmpl", "listeArticles");

var nf = new NumberFormat("0.###", false);

var commandeId;


function init() {
	try {
  	commandeId = ParamValeur("Commande_Id");

  	aFournisseurs.setParam("Commande_Id", commandeId);
  	aFournisseurs.initTree(initFournisseur);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFournisseur() {
	try {

    document.getElementById('fournisseur').selectedIndex = 0;
    pressOnFournisseur();

	} catch (e) {
    recup_erreur(e);
  }
}


function testcheck(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		if (cks.item(0).getAttribute("checked")=="false") {
			cks.item(0).setAttribute("checked","true");
		} else {
			cks.item(0).setAttribute("checked","false");
			cks.item(3).setAttribute("label", "0");
			document.getElementById('quantite').value = "0";
		}
		
		checkValidationPossible();
	} catch (e) {
    recup_erreur(e);
  }
}


function toutCocher(b) {
	try {

		var listbox = document.getElementById('listeArticles');
		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;

			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				cks.item(0).setAttribute("checked", b);
				i++;
			}
		}
		
		checkValidationPossible();
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnFournisseur() {
	try {
		document.getElementById('bValider').disabled = true;
		if (document.getElementById('fournisseur').selectedIndex != 0) {
			var fournisseurId = document.getElementById('fournisseur').value;
			aArticles.setParam("Fournisseur_Id", fournisseurId);
			aArticles.setParam("Commande_Id", commandeId);
			aArticles.initTree(initListeArticles);
		} else {
			document.getElementById('quantite').value = "";
			document.getElementById('quantite').disabled = true;
			document.getElementById('bValiderLigne').disabled = true;
			aArticles.deleteTree();
			aCommandes.deleteTree();
			initCommande();
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function initListeArticles() {
	try {
		checkValidationPossible();
		var fournisseurId = document.getElementById('fournisseur').value;
		aCommandes.setParam("Fournisseur_Id", fournisseurId);
		aCommandes.setParam("Commande_Id", commandeId);
		aCommandes.initTree(initCommande);
	} catch (e) {
		recup_erreur(e);
	}
}

function initCommande() {
	try {
		
    document.getElementById('commande').selectedIndex = 0;


	} catch (e) {
    recup_erreur(e);
  }
}

function selectOnListeArticles() {
	try {
		var liste = document.getElementById("listeArticles");
		if (liste.selectedIndex!=-1) {
			var item = liste.getItemAtIndex(liste.selectedIndex);
			var cell = item.getElementsByTagName("listcell");
			document.getElementById("quantite").value = cell.item(3).getAttribute("label");
		}
		document.getElementById('quantite').disabled = false;
		document.getElementById('bValiderLigne').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function validerLigne() {
	try {
		
		var liste = document.getElementById("listeArticles");
		if (liste.selectedIndex!=-1) {
			var nouvelleQte = document.getElementById('quantite').value;
			if (isEmpty(nouvelleQte) || !isPositiveOrNull(nouvelleQte)) { showWarning("La quantité saisie est incorrecte !"); }
			else {
				var item = liste.getItemAtIndex(liste.selectedIndex);
				var cell = item.getElementsByTagName("listcell");
				nouvelleQte = parseFloat(nouvelleQte);
				var qteInitiale = parseFloat(cell.item(2).getAttribute("label"));
				if (nouvelleQte>qteInitiale) { showWarning("La quantité à transférer doit être inférieure ou égale à la quantité de la ligne !"); }
				else if (!isPositiveOrNull(nouvelleQte)) { showWarning("La quantité à transférer ne peut pas être négative !"); }
				else {
					cell.item(3).setAttribute("label",nf.format(nouvelleQte));
					cell.item(0).setAttribute("checked",(isPositive(nouvelleQte)));
					liste.selectedIndex = -1;
					document.getElementById('quantite').value = "";
					document.getElementById('quantite').disabled = true;
					document.getElementById('bValiderLigne').disabled = true;
					
					checkValidationPossible();
				}
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function checkValidationPossible() {
	try {
		var existeCoche = false;
		var listbox = document.getElementById('listeArticles');

		var nbLignes = listbox.getRowCount();
		var i = 0;

		while (i<nbLignes && !existeCoche) {
			var item = listbox.getItemAtIndex(i);
			var cks = item.getElementsByTagName("listcell");
			if ((cks.item(0).getAttribute("checked")=="true") && (parseFloat(cks.item(3).getAttribute("label"))>0)) {
				existeCoche=true;
			}
			i++;
		}
		
		document.getElementById('bValider').disabled = (!existeCoche);
	} catch (e) {
		recup_erreur(e);
	}
}


function valider() {
  try {
  	
  	if (document.getElementById("commande").selectedIndex==0) { showWarning("Veuillez choisir une commande de destination !"); }
  	else {
	  	document.getElementById('bValider').disabled=true;
			
			var liste = document.getElementById("listeArticles");
			var listeArticles = "";
			var nombreElements = liste.getRowCount();
			for (var i=0; i<nombreElements; i++) {
				if (liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
					listeArticles += liste.getItemAtIndex(i).value +";";
					listeArticles += liste.getItemAtIndex(i).getElementsByTagName("listcell").item(3).getAttribute("label") +",";
				}
			}
			
			if (!isEmpty(listeArticles)) {
				var qTransfererArticles = new QueryHttp("Facturation/Commandes/basculerMultiArticles.tmpl");
				qTransfererArticles.setParam("Commande_Id_Source", commandeId);
				qTransfererArticles.setParam("Commande_Id_Dest", document.getElementById("commande").value);
				qTransfererArticles.setParam("Fournisseur_Id_Dest", document.getElementById("fournisseur").value);
				qTransfererArticles.setParam("Liste_Articles", listeArticles);
				qTransfererArticles.execute();
				
				window.arguments[0]();
				window.close();
			} else {
				showWarning("Veuillez cocher au moins un article !");
				document.getElementById('bValider').disabled=false;
			}
  	}
		
  } catch (e) {
    recup_erreur(e);
  }
}


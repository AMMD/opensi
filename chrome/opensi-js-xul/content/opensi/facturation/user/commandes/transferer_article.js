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


var aCommandes = new Arbre("Facturation/Commandes/liste-commandesNonValidees.tmpl", "Commande");

var commande_id = ParamValeur("Commande_Id");
var ligneId = ParamValeur("Ligne_Id");
var type_ligne = ParamValeur("Type_Ligne");


function init() {
  try {
  	var qArticle = new QueryHttp("Facturation/Commandes/getArticleCommande.tmpl");
  	qArticle.setParam("Ligne_Id",ligneId);
  	var result = qArticle.execute();
		var contenu = result.responseXML.documentElement;
		document.getElementById('Reference').value = contenu.getAttribute('Reference');
		document.getElementById('lblDesignation').value = contenu.getAttribute('Designation');
		document.getElementById('Quantite').value = contenu.getAttribute('Quantite');

		var aFournisseur = new Arbre("Facturation/Commandes/liste-fournisseursArticle.tmpl", "Fournisseur");
    aFournisseur.setParam("Commande_Id", commande_id);
    aFournisseur.setParam("Article_Id", contenu.getAttribute('Reference'));
    aFournisseur.initTree(initFournisseur);

	} catch (e) {
    recup_erreur(e);
  }
}


function initFournisseur() {
	try {

    document.getElementById('Fournisseur').selectedIndex = 0;
    initCommande();

	} catch (e) {
    recup_erreur(e);
  }
}


function initCommande() {
	try {
		if (document.getElementById('Fournisseur').selectedIndex != 0) {
			aCommandes.setParam("Fournisseur_Id", document.getElementById('Fournisseur').value);
			aCommandes.setParam("Commande_Id", commande_id);
			aCommandes.initTree(initCommande2);
		} else {
			aCommandes.deleteTree();
			initCommande2();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function initCommande2() {
	try {

    document.getElementById('Commande').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function valider() {
  try {
  	
  	if (document.getElementById("Commande").selectedIndex==0) { showWarning("Veuillez choisir une commande de destination !"); }
  	else {
	  	var quantite = document.getElementById("Quantite").value;
	
			if (document.getElementById('Fournisseur').selectedIndex == 0) { showWarning("Veuillez choisir un fournisseur !"); }
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !");	}
			else {
				var queryBasculer = new QueryHttp("Facturation/Commandes/basculerArticleCommande.tmpl");
				queryBasculer.setParam("Ligne_Id_Source",ligneId);
				queryBasculer.setParam("Quantite",quantite);
				queryBasculer.setParam("Commande_Id_Dest",document.getElementById("Commande").value);
				queryBasculer.setParam("Fournisseur_Id_Dest",document.getElementById("Fournisseur").value);
				queryBasculer.execute();
				window.arguments[0]();
				window.close();
			}
  	}

  } catch (e) {
    recup_erreur(e);
  }
}


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


jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");


var code_tva;
var taux_tva;
var normal;

var currentChampCompte;

var codeTVANatUE = -1;
var codePaysNatUE = "";

var aTva = new Arbre('Config/GetRDF/listeTauxTva.tmpl','liste_TVA');
var aTvaNatUE = new Arbre('Config/GetRDF/listeTauxTvaNatUE.tmpl','liste_TVA_Nat_UE');



function init() {
	try {

		aTva.setParam("Zone_UE",1);
		aTva.initTree();
		aTvaNatUE.initTree();

		var aPays = new Arbre('Config/GetRDF/listePaysUE.tmpl','Pays_UE');
		aPays.initTree();

	} catch (e) {
    recup_erreur(e);
  }
}


function reporter() {
  try {

    var tree = document.getElementById("liste_TVA");

		if (tree.view!=null && tree.currentIndex!=-1) {

			taux_tva = parseFloat(getCellText(tree,tree.currentIndex,'ColTaux_TVA'));
    	document.getElementById('Taux_TVA').value = taux_tva;
			code_tva = getCellText(tree,tree.currentIndex,'ColCode_TVA');
			normal = (getCellText(tree,tree.currentIndex,'ColNormal')=='1');

			document.getElementById('Pays_UE').value = getCellText(tree,tree.currentIndex,'ColCode_Pays');
			document.getElementById('Compte_TVA_Vente').value = getCellText(tree,tree.currentIndex,'ColCompte_TVA_Vente');
			document.getElementById('Compte_Achat').value = getCellText(tree,tree.currentIndex,'ColCompte_Achat');
			document.getElementById('Compte_Vente').value = getCellText(tree,tree.currentIndex,'ColCompte_Vente');
			document.getElementById('Pays_UE').disabled=true;

			disableSup(false);
			document.getElementById('bNouveau').collapsed = false;
			document.getElementById('bAjouter').collapsed  = true;
			document.getElementById('bModifier').collapsed  = false;
			document.getElementById('bSupprimer').disabled = (normal || (taux_tva==0));
			document.getElementById('Row_Taux_TVA').collapsed = (taux_tva == 0);
			document.getElementById('Row_Compte_TVA_Ventes').collapsed = (taux_tva == 0);
		}

	} catch (e) {
    recup_erreur(e);
  }
}



function changerCompte(id, debut, titre) {
  try {

  	currentChampCompte = id;
    var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Force_Deb="+ debut +"&Type_Compte=G&Creer=false&nom="+ urlEncode(titre)+"&Num_Compte="+ urlEncode(debut);
    window.openDialog(url,'','chrome,modal,centerscreen', retourChangerCompte);

  } catch (e) {
    recup_erreur(e);
  }
}


function retourChangerCompte(numCompte) {
	try {
		document.getElementById(currentChampCompte).value = numCompte;

	} catch (e) {
		  recup_erreur(e);
	}
}


function nouvelleTVA() {
  try {

  	var tree = document.getElementById("liste_TVA");
		if (tree.view!=null && tree.currentIndex!=-1) {
			tree.view.selection.select(-1);
		}

    disableSup(true);
		document.getElementById('bSupprimer').collapsed = true;
		document.getElementById('Pays_UE').selectedIndex = 0;
		document.getElementById('Pays_UE').disabled=false;
		document.getElementById('Taux_TVA').value = "";
		document.getElementById('Compte_TVA_Vente').value = "";
		document.getElementById('Compte_Achat').value = "";
		document.getElementById('Compte_Vente').value = "";
		document.getElementById('bNouveau').collapsed = true;
		document.getElementById('bAjouter').collapsed  = false;
		document.getElementById('bModifier').collapsed  = true;
		document.getElementById('Row_Taux_TVA').collapsed = false;
		document.getElementById('Row_Compte_TVA_Ventes').collapsed = false;
  	document.getElementById('Taux_TVA').focus();

	} catch (e) {
    recup_erreur(e);
  }
}


function disableSup(b) {
	try {

		var tree = document.getElementById("liste_TVA");

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById('bSupprimer').collapsed = b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerTVA() {
	try {

		var tree = document.getElementById("liste_TVA");

		if (tree.view!=null && tree.currentIndex!=-1) {

			if (taux_tva==0) {
				showWarning("Le taux de TVA '0.00 %' ne peut pas être supprimé !");
			}
			else if (normal) {
				showWarning("Le taux de TVA '"+ taux_tva +" %' ne peut pas être supprimé !");
			}
			else {

				if (window.confirm("Confirmez-vous la suppression du taux de TVA de "+ taux_tva +" % ?")) {

					var qSupTva = new QueryHttp("Config/Tva/supprimerTVA.tmpl");
					qSupTva.setParam('Code_TVA', code_tva);
					qSupTva.execute(supprimerTVA_2);

					nouvelleTVA();
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerTVA_2(httpRequest) {
	try {

		var message = httpRequest.responseXML.documentElement.getAttribute("message");

		if (message=="suppr") {
			showMessage("Le taux de TVA '"+ taux_tva +" %' a été supprimé avec succès");
		}
		else if (message=="impossible") {
			showWarning("Impossible de supprimer, ce taux de TVA est utilisé par OpenSi !");
		}
		else {
			showWarning("Erreur du serveur !");
		}

		aTva.initTree();

		document.getElementById('bSupprimer').collapsed = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function modifierTVA() {
	try {

		var Ntaux_tva = document.getElementById('Taux_TVA').value;
		var compteTvaVente = document.getElementById('Compte_TVA_Vente').value;
		var compteAchat = document.getElementById('Compte_Achat').value;
		var compteVente = document.getElementById('Compte_Vente').value;

		var autoriser = true;
    var tree = document.getElementById("liste_TVA");

		if (tree.view!=null) {

			if (isEmpty(Ntaux_tva) || !isTaux(Ntaux_tva)) {
				showWarning("Taux de TVA incorrect !");
			}
			else {

				var code_pays = document.getElementById('Pays_UE').value;

				for (i=0;i<tree.view.rowCount;i++) {
					if (code_pays==getCellText(tree,i,'ColCode_Pays') && code_tva!=getCellText(tree,i,'ColCode_TVA') && parseFloat(Ntaux_tva) == parseFloat(getCellText(tree,i,'ColTaux_TVA'))) {
						autoriser = false;
						showWarning("Le taux de TVA '"+ Ntaux_tva +" %' existe déjà pour le pays sélectionné !");
					}
	    	}

				if (autoriser && Ntaux_tva!=taux_tva) {
					autoriser = window.confirm("Confirmez-vous la modification du taux de TVA de "+ taux_tva +" % ?")
				}

 				if (autoriser) {
					var qMajTva = new QueryHttp("Config/Tva/modifierTVA.tmpl");
					qMajTva.setParam('Code_Pays', code_pays);
					qMajTva.setParam('Code_TVA', code_tva);
					qMajTva.setParam('Taux_TVA', Ntaux_tva);
					qMajTva.setParam('Compte_TVA_Vente', compteTvaVente);
					qMajTva.setParam('Compte_Achat', compteAchat);
					qMajTva.setParam('Compte_Vente', compteVente);

					qMajTva.execute();
					aTva.initTree();
					nouvelleTVA();
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerTVA() {
	try {

		var taux_tva = document.getElementById('Taux_TVA').value;
		var compteTvaVente = document.getElementById('Compte_TVA_Vente').value;
		var compteAchat = document.getElementById('Compte_Achat').value;
		var compteVente = document.getElementById('Compte_Vente').value;

		if (document.getElementById('Pays_UE').selectedIndex==0) {
			showWarning("Veuillez choisir un pays !");
		}
		else if (isEmpty(taux_tva) || !isTaux(taux_tva)) {
			showWarning("Taux de TVA incorrect !");
		}
		else if (isEmpty(compteTvaVente)) {
			showWarning("Veuillez indiquer un compte de TVA sur vente");
		}
		else if (parseFloat(taux_tva)!=0 && isEmpty(compteAchat)) {
			showWarning("Veuillez indiquer un compte d'achat");
		}
		else if (parseFloat(taux_tva)!=0 && isEmpty(compteVente)) {
			showWarning("Veuillez indiquer un compte de vente");
		}
		else {

			var autoriser = true;
	    var tree = document.getElementById("liste_TVA");
	    var code_pays = document.getElementById('Pays_UE').value;

			if (tree.view!=null) {

  			for (i=0;i<tree.view.rowCount;i++) {
					if (code_pays==getCellText(tree,i,'ColCode_Pays') && (parseFloat(taux_tva)==parseFloat(getCellText(tree,i,'ColTaux_TVA')))) {
						autoriser = false;
						showWarning("Le taux de TVA '"+ taux_tva +" %' existe déjà pour le pays sélectionné !");
					}
    		}
			}

			if (autoriser) {
				var qNewTva = new QueryHttp("Config/Tva/creerTVA.tmpl");
				qNewTva.setParam('Code_Pays', code_pays);
				qNewTva.setParam('Taux_TVA', taux_tva);
				qNewTva.setParam('Compte_TVA_Vente', compteTvaVente);
				qNewTva.setParam('Compte_Achat', compteAchat);
				qNewTva.setParam('Compte_Vente', compteVente);
				qNewTva.execute();

				aTva.initTree();
				nouvelleTVA();
			}
  	}

	} catch (e) {
    recup_erreur(e);
  }
}



function reporterNatUE() {
  try {

    var tree = document.getElementById('liste_TVA_Nat_UE');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var idx = tree.currentIndex;

			codeTVANatUE = getCellText(tree,idx,'ColCode_TVA_Nat_UE');
			codePaysNatUE = getCellText(tree,idx,'ColCode_Pays_Nat_UE');
			document.getElementById('Pays_Nat_UE').value = getCellText(tree,idx,'ColPays_Nat_UE');
			document.getElementById('Compte_Vente_Nat_UE').value = getCellText(tree,idx,'ColCompte_Vente_Nat_UE');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerComptesNatUE() {
	try {

		var compteVente = document.getElementById('Compte_Vente_Nat_UE').value;

		if (codeTVANatUE==-1) {
			showWarning("Veuillez sélectionner un pays !");
		}
		else if (isEmpty(compteVente)) {
			showWarning("Veuillez définir un numéro de compte de vente !");
		}
		else {
			var qMaj = new QueryHttp("Config/Tva/modifierTauxNationalUE.tmpl");
			qMaj.setParam('Code_TVA', codeTVANatUE);
			qMaj.setParam('Code_Pays', codePaysNatUE);
			qMaj.setParam('Compte_Vente', compteVente);
			qMaj.execute();

			aTvaNatUE.initTree();

			codeTVANatUE = -1;
			codePaysNatUE = "";
			document.getElementById('Pays_Nat_UE').value = "";
			document.getElementById('Compte_Vente_Nat_UE').value = "";
		}

	} catch (e) {
    recup_erreur(e);
  }
}


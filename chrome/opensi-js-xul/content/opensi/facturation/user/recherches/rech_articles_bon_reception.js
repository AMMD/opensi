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

var aBR = new Arbre("Facturation/GetRDF/liste_bon_reception.tmpl","listeBR");
var aCommandes = new Arbre("Facturation/Commandes/liste-commandes.tmpl","listeCommandes");
var aArticles = new Arbre("Facturation/GetRDF/liste_articles_bon_reception.tmpl","articles");


function init() {
  try {

		document.getElementById('grpModeRecherche').value = "BR";
		document.getElementById('Num_Entier').focus();
		aBR.setParam("Fournisseur_Id",ParamValeur("Fournisseur_Id"));
		aCommandes.setParam("Fournisseur_Id",ParamValeur("Fournisseur_Id"));
		initCriteres();

  } catch (e) {
    recup_erreur(e);
  }
}


function initCriteres() {
	try {
		document.getElementById('Num_Entier').value = "";
		document.getElementById('Num_Commande').value = "";
		document.getElementById('Num_BL').value = "";
		document.getElementById('refArticle').value = "";
		
		listerDocuments();
	} catch (e) {
		recup_erreur(e);
	}
}


function listerDocuments() {
	try {
		document.getElementById('bOk').disabled=true;
		document.getElementById('listeBR').disabled=true;
		document.getElementById('listeCommandes').disabled=true;
		document.getElementById('articles').disabled=true;
		document.getElementById('bToutCocher').disabled=true;
		document.getElementById('bToutDecocher').disabled=true;
		aArticles.deleteTree();
		aBR.clearSelection();
		aBR.deleteTree();
		aCommandes.clearSelection();
		aCommandes.deleteTree();
		
		var modeRecherche = document.getElementById('grpModeRecherche').value;
		document.getElementById('boxBR').collapsed=(modeRecherche!="BR");
		document.getElementById('boxCommandes').collapsed=(modeRecherche!="C");
		if (modeRecherche=="BR") {
			aBR.setParam("Num_Entier", document.getElementById('Num_Entier').value);
			aBR.setParam("Num_Commande", document.getElementById('Num_Commande').value);
			aBR.setParam("Num_BL", document.getElementById('Num_BL').value);
			aBR.setParam("Ref_Article", document.getElementById('refArticle').value);
			aBR.initTree(retourListerDocuments);
		} else {
			aCommandes.setParam("Num_Entier", document.getElementById('Num_Entier').value);
			aCommandes.setParam("Num_Commande", document.getElementById('Num_Commande').value);
			aCommandes.setParam("Num_BL", document.getElementById('Num_BL').value);
			aCommandes.setParam("Ref_Article", document.getElementById('refArticle').value);
			aCommandes.initTree(retourListerDocuments);
		}
  } catch (e) {
    recup_erreur(e);
  }
}


function retourListerDocuments() {
	try {
		document.getElementById('bOk').disabled=false;
		document.getElementById('listeBR').disabled=false;
		document.getElementById('listeCommandes').disabled=false;
		document.getElementById('articles').disabled=false;
		document.getElementById('bToutCocher').disabled=false;
		document.getElementById('bToutDecocher').disabled=false;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnId(ev) {
  try {

		if (ev.keyCode==13) {
			var ok=false;
			var modeRecherche = document.getElementById('grpModeRecherche').value;
			if (modeRecherche=="BR") {
				var numBR = document.getElementById('Num_Entier').value;
				if (!isEmpty(numBR) && existeBR(numBR)) {
					ok=true;
					document.getElementById('Num_Commande').value = "";
					document.getElementById('Num_BL').value = "";
					document.getElementById('refArticle').value = "";
	      	ouvrirBR(numBR);
				}
			} else {
				var numCommande = document.getElementById('Num_Commande').value;
				if (!isEmpty(numCommande) && existeCommande(numCommande)) {
					ok=true;
					document.getElementById('Num_Entier').value = "";
					document.getElementById('Num_BL').value = "";
					document.getElementById('refArticle').value = "";
	      	ouvrirCommande(numCommande);
				}
			}
			
			if (!ok) {
				listerDocuments();
			}
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnCritere(ev) {
  try {
		if (ev.keyCode==13) {
			listerDocuments();
    }
  } catch (e) {
    recup_erreur(e);
  }
}


function existeBR(Num_Entier) {
  try {

		var qExBR = new QueryHttp("Facturation/Factu_Fournisseur/existeBR.tmpl");
		qExBR.setParam('Num_Entier', Num_Entier);
		var result = qExBR.execute();

  	return result.responseXML.documentElement.getAttribute('existe')=="true";

  } catch (e) {
    recup_erreur(e);
  }
}


function existeCommande(numCommande) {
  try {

		var qExCommande = new QueryHttp("Facturation/Commandes/existeCommande.tmpl");
		qExCommande.setParam('Numero', numCommande);
		var result = qExCommande.execute();

  	return result.responseXML.documentElement.getAttribute('existe')=="true";

  } catch (e) {
    recup_erreur(e);
  }
}


function choixCommande() {
	try {
		
		if (aCommandes.isSelected()) {
			var listeNumCommande = "";
			var start = new Object();
			var end = new Object();
			var numRanges = aCommandes.getRangeCount();

			for (var t=0; t<numRanges; t++){
				aCommandes.getRangeAt(t,start,end);
			  for (var v=start.value; v<=end.value; v++){
			  	listeNumCommande += aCommandes.getCellText(v,'colNumCommande')+",";
			  }
			}

			ouvrirCommande(listeNumCommande);
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ouvrirCommande(listeNumCommande) {
	try {
		aArticles.clearParams();
		aArticles.setParam("Liste_Numero",listeNumCommande);
		aArticles.setParam("Type","Commande_Fournisseur");
		aArticles.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function choixBR() {
	try {
		
		if (aBR.isSelected()) {
			var listeNumBR = "";
			var start = new Object();
			var end = new Object();
			var numRanges = aBR.getRangeCount();

			for (var t=0; t<numRanges; t++){
			  aBR.getRangeAt(t,start,end);
			  for (var v=start.value; v<=end.value; v++){
			  	listeNumBR += aBR.getCellText(v,'colNumBR')+",";
			  }
			}

			ouvrirBR(listeNumBR);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirBR(listeNumBR) {
	try {
		aArticles.clearParams();
		aArticles.setParam("Liste_Numero",listeNumBR);
		aArticles.setParam("Type","Bon_Reception");
		aArticles.initTree();
	} catch (e) {
    recup_erreur(e);
  }
}


function testCheck() {
	try {

		var liste = document.getElementById("articles");
		if (!liste.disabled) {
			if (liste.currentItem!=null && liste.selectedIndex!=-1) {
				var item = liste.getItemAtIndex(liste.selectedIndex);
				var cks = item.getElementsByTagName("listcell");
				cks.item(0).setAttribute("checked",(cks.item(0).getAttribute("checked")=="true"?"false":"true"));
			}
		}
	} catch (e) {
    recup_erreur(e);
	}
}


function toutCocher(b) {
	try {
		var listbox = document.getElementById('articles');
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
	} catch (e) {
		recup_erreur(e);
	}
}


function choixArticle() {
	try {

		var liste = document.getElementById("articles");
		var nombreElements = liste.getRowCount();
		if (nombreElements == 0) {
			showWarning("Il n'y a pas d'articles à ajouter !");
		} else {
			var liste_ligneId="";
			for (var i=0; i<nombreElements; i++) {
				if(liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
					liste_ligneId += liste.getItemAtIndex(i).value+",";
				}
			}

			var qAjArtBon = new QueryHttp("Facturation/Factu_Fournisseur/ajouterArticleBonReception.tmpl");
			qAjArtBon.setParam('Facture_Id', ParamValeur("Facture_Id"));
			qAjArtBon.setParam('Liste_Ligne_Id', liste_ligneId);
			qAjArtBon.execute();

			window.arguments[0]();
			window.close();
		}

	} catch (e) {
    recup_erreur(e);
	}
}

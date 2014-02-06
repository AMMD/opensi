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

/*

Paramètres d'entrée non obligatoires :
	- Nouv --> affichage du bouton nouveau si présent

*/

jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var aSites = new Arbre('Facturation/GetRDF/liste_sites_web.tmpl','siteweb');
var aFamille1 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_1');
var aFamille2 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_2');
var aFamille3 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_3');
var aMarques = new Arbre('Facturation/GetRDF/combo-marquesArticle.tmpl', 'Marque');
var aAttribut1 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'attribut1');
var aAttribut2 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'attribut2');
var aAttribut3 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'attribut3');
var aAttribut4 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'attribut4');
var aAttribut5 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'attribut5');
var aAttribut6 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'attribut6');

var chargerFamille1 = "0";
var chargerFamille2 = "0";
var chargerFamille3 = "0";
var chargerAttribut1 = "";
var chargerAttribut2 = "";
var chargerAttribut3 = "";
var chargerAttribut4 = "";
var chargerAttribut5 = "";
var chargerAttribut6 = "";
var circonstAttr1 = false;
var circonstAttr2 = false;
var circonstAttr3 = false;
var circonstAttr4 = false;
var circonstAttr5 = false;
var circonstAttr6 = false;

var aRecherche = new Arbre('Facturation/GetRDF/liste-articles.tmpl', 'tree-articles');
var aDispoFourn = new Arbre('Facturation/Stocks/liste-dispoFournisseur.tmpl', 'listeDispoFournisseur');

var fournisseur_id = ParamValeur('Fournisseur');
var nomenclature = ParamValeur('Nomenclature');


function init() {
  try {

    if (!isEmpty(ParamValeur('Nouv'))) {
    	document.getElementById('bouton_nouveau').collapsed = false;
    }

    if (!isEmpty(ParamValeur('Code_Tarif'))) {
    	document.getElementById('ColTarifHT').collapsed = false;
    }
    
    aAttribut1.setParam("Liste_Id", 1);
		aAttribut2.setParam("Liste_Id", 2);
		aAttribut3.setParam("Liste_Id", 3);
		aAttribut4.setParam("Liste_Id", 4);
		aAttribut5.setParam("Liste_Id", 5);
		aAttribut6.setParam("Liste_Id", 6);
    
    var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
    qNomListeAttribut.setParam("Liste_Id", 1);
    var result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut1').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    document.getElementById('colAttribut1').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    circonstAttr1 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 2);
    result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut2').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    document.getElementById('colAttribut2').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    circonstAttr2 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 3);
    result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut3').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    document.getElementById('colAttribut3').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    circonstAttr3 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 4);
    result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut4').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    document.getElementById('colAttribut4').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    circonstAttr4 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 5);
    result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut5').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    document.getElementById('colAttribut5').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    circonstAttr5 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 6);
    result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut6').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    document.getElementById('colAttribut6').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    circonstAttr6 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    
		aMarques.initTree(initMarque);
		chargerFamilles("0","0","0");
		if (!circonstAttr1) { chargerAttributs1(""); }
		if (!circonstAttr2) { chargerAttributs2(""); }
		if (!circonstAttr3) { chargerAttributs3(""); }
		if (!circonstAttr4) { chargerAttributs4(""); }
		if (!circonstAttr5) { chargerAttributs5(""); }
		if (!circonstAttr6) { chargerAttributs6(""); }
    aSites.initTree();

		if (!isEmpty(fournisseur_id)) {
			aRecherche.setParam('Fournisseur_Id', fournisseur_id);
		}
		
		if (!isEmpty(nomenclature)) {
  		aRecherche.setParam('Nomenclature',1);
  	}

    document.getElementById('Article_Id').focus();
    
    if (!isEmpty(ParamValeur('Reference'))) {
    	document.getElementById('Article_Id').value = ParamValeur('Reference');
    	rechercher();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function chargerFamilles(famille1, famille2, famille3) {
	try {
		chargerFamille1 = famille1;
		chargerFamille2 = famille2;
		chargerFamille3 = famille3;
		chargerFamilles1();
	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles1() {
	try {
		aFamille1.setParam("Selection", chargerFamille1);
		aFamille1.initTree(initFamille1);
	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille1() {
  try {

		document.getElementById('Famille_1').value = chargerFamille1;
		if (chargerFamille1 != "0") {
			chargerFamille1 = "0";
			chargerFamilles2();
		} else {
			aFamille2.deleteTree();
			aFamille3.deleteTree();
			document.getElementById('Famille_2').selectedIndex=0;
			document.getElementById('Famille_3').selectedIndex=0;
			document.getElementById('Famille_2').disabled = true;
			document.getElementById('Famille_3').disabled = true;
			
			rechargerAttributs();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles2() {
	try {
		
		var famille1 = document.getElementById('Famille_1').value;
		if (famille1=="0") {
			document.getElementById('Famille_2').disabled = true;
			document.getElementById('Famille_3').disabled = true;
		}
  	
		aFamille2.setParam('Parent_Id', famille1);
		aFamille2.setParam("Selection", chargerFamille2);
		aFamille2.initTree(initFamille2);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille2() {
  try {

		document.getElementById('Famille_2').value = chargerFamille2;
		if (document.getElementById('Famille_1').value!="0") {
			document.getElementById('Famille_2').disabled = false;
		}
		if (chargerFamille2 != "0") {
			chargerFamille2 = "0";
			chargerFamilles3();
		} else {
			aFamille3.deleteTree();
			document.getElementById('Famille_3').selectedIndex=0;
			document.getElementById('Famille_3').disabled = true;
			
			rechargerAttributs();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles3() {
	try {
		
		var famille2 = document.getElementById('Famille_2').value;
		if (famille2=="0") {
			document.getElementById('Famille_3').disabled = true;
		}
  	
		aFamille3.setParam('Parent_Id', famille2);
		aFamille3.setParam("Selection", chargerFamille3);
		aFamille3.initTree(initFamille3);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille3() {
  try {

		document.getElementById('Famille_3').value = chargerFamille3;
		if (document.getElementById('Famille_2').value!="0") {
			document.getElementById('Famille_3').disabled = false;
		}
		if (chargerFamille3 != "0") {
			chargerFamille3 = "0";
		}
		rechargerAttributs();

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


function chargerAttributs1(selection) {
	try {
		chargerAttribut1 = selection;
		if (!isEmpty(selection)) { aAttribut1.setParam("Selection", chargerAttribut1); }
		else { aAttribut1.removeParam("Selection"); }
		aAttribut1.initTree(initAttribut1);
	} catch (e) {
		recup_erreur(e);
	}
}


function initAttribut1() {
  try {
  	
  	if (circonstAttr1) { chargerAttribut1 = checkExisteCirconst('attribut1', chargerAttribut1); }

		document.getElementById('attribut1').value = chargerAttribut1;

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerAttributs2(selection) {
	try {
		chargerAttribut2 = selection;
		if (!isEmpty(selection)) { aAttribut2.setParam("Selection", chargerAttribut2); }
		else { aAttribut2.removeParam("Selection"); }
		aAttribut2.initTree(initAttribut2);
	} catch (e) {
		recup_erreur(e);
	}
}


function initAttribut2() {
  try {
  	
  	if (circonstAttr2) { chargerAttribut2 = checkExisteCirconst('attribut2', chargerAttribut2); }

		document.getElementById('attribut2').value = chargerAttribut2;

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerAttributs3(selection) {
	try {
		chargerAttribut3 = selection;
		if (!isEmpty(selection)) { aAttribut3.setParam("Selection", chargerAttribut3); }
		else { aAttribut3.removeParam("Selection"); }
		aAttribut3.initTree(initAttribut3);
	} catch (e) {
		recup_erreur(e);
	}
}


function initAttribut3() {
  try {
  	
  	if (circonstAttr3) { chargerAttribut3 = checkExisteCirconst('attribut3', chargerAttribut3); }

		document.getElementById('attribut3').value = chargerAttribut3;

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerAttributs4(selection) {
	try {
		chargerAttribut4 = selection;
		if (!isEmpty(selection)) { aAttribut4.setParam("Selection", chargerAttribut4); }
		else { aAttribut4.removeParam("Selection"); }
		aAttribut4.initTree(initAttribut4);
	} catch (e) {
		recup_erreur(e);
	}
}


function initAttribut4() {
  try {
  	
  	if (circonstAttr4) { chargerAttribut4 = checkExisteCirconst('attribut4', chargerAttribut4); }

		document.getElementById('attribut4').value = chargerAttribut4;

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerAttributs5(selection) {
	try {
		chargerAttribut5 = selection;
		if (!isEmpty(selection)) { aAttribut5.setParam("Selection", chargerAttribut5); }
		else { aAttribut5.removeParam("Selection"); }
		aAttribut5.initTree(initAttribut5);
	} catch (e) {
		recup_erreur(e);
	}
}


function initAttribut5() {
  try {
  	
  	if (circonstAttr5) { chargerAttribut5 = checkExisteCirconst('attribut5', chargerAttribut5); }

		document.getElementById('attribut5').value = chargerAttribut5;

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerAttributs6(selection) {
	try {
		chargerAttribut6 = selection;
		if (!isEmpty(selection)) { aAttribut6.setParam("Selection", chargerAttribut6); }
		else { aAttribut6.removeParam("Selection"); }
		aAttribut6.initTree(initAttribut6);
	} catch (e) {
		recup_erreur(e);
	}
}


function initAttribut6() {
  try {
  	
  	if (circonstAttr6) { chargerAttribut6 = checkExisteCirconst('attribut6', chargerAttribut6); }

		document.getElementById('attribut6').value = chargerAttribut6;

	} catch (e) {
		recup_erreur(e);
	}
}


function checkExisteCirconst(champ, value) {
	try {
		var retour=value;
		if (retour!="") {
			var existe = false;
			var i=0;
			var menulist = document.getElementById(champ);
			var items = menulist.getElementsByTagName("menuitem");
			while (!existe && i<items.length) {
				if (items[i].getAttribute("value")==value) { existe = true; }
				else { i++; }
			}
			if (!existe) { retour = ""; }
		}
		return retour;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnId(ev) {
  try {

    if (ev.keyCode==13) {

			var code_article = document.getElementById('Article_Id').value;

			if (existeArticle(code_article)) {
				code_article = document.getElementById('Article_Id').value;
        ouvrirArticle(code_article);
			}
			else
				rechercher();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnNom(ev) {
  try {

    if (ev.keyCode==13) {
			rechercher();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnRefModele(ev) {
  try {

    if (ev.keyCode==13) {
			rechercher();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnFamille1() {
  try {

		chargerFamilles2();
		rechercher();

  } catch (e) {
    recup_erreur(e);
  }
}

function pressOnFamille2() {
  try {

		chargerFamilles3();
		rechercher();

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnFamille3() {
	try {
		rechargerAttributs();
		rechercher();
	} catch (e) {
		recup_erreur(e);
	}
}


function rechargerAttributs() {
	try {
		var famille1 = document.getElementById('Famille_1').value;
		if (famille1=="0") {
			if (circonstAttr1) { aAttribut1.removeParam("Famille_Id"); }
			if (circonstAttr2) { aAttribut2.removeParam("Famille_Id"); }
			if (circonstAttr3) { aAttribut3.removeParam("Famille_Id"); }
			if (circonstAttr4) { aAttribut4.removeParam("Famille_Id"); }
			if (circonstAttr5) { aAttribut5.removeParam("Famille_Id"); }
			if (circonstAttr6) { aAttribut6.removeParam("Famille_Id"); }
		} else {
			var famille2 = document.getElementById('Famille_2').value;
			var famille3 = document.getElementById('Famille_3').value;
			
			var famille;
			if (famille3!="0") { famille = famille3; }
			else if (famille2!="0") { famille = famille2; }
			else { famille = famille1; }
			
			if (circonstAttr1) { aAttribut1.setParam("Famille_Id", famille); }
			if (circonstAttr2) { aAttribut2.setParam("Famille_Id", famille); }
			if (circonstAttr3) { aAttribut3.setParam("Famille_Id", famille); }
			if (circonstAttr4) { aAttribut4.setParam("Famille_Id", famille); }
			if (circonstAttr5) { aAttribut5.setParam("Famille_Id", famille); }
			if (circonstAttr6) { aAttribut6.setParam("Famille_Id", famille); }
		}
		
		if (circonstAttr1) {
			var attr1 = document.getElementById('attribut1').value;
			chargerAttributs1(attr1);
		}
		if (circonstAttr2) {
			var attr2 = document.getElementById('attribut2').value;
			chargerAttributs2(attr2);
		}
		if (circonstAttr3) {
			var attr3 = document.getElementById('attribut3').value;
			chargerAttributs3(attr3);
		}
		if (circonstAttr4) {
			var attr4 = document.getElementById('attribut4').value;
			chargerAttributs4(attr4);
		}
		if (circonstAttr5) {
			var attr5 = document.getElementById('attribut5').value;
			chargerAttributs5(attr5);
		}
		if (circonstAttr6) {
			var attr6 = document.getElementById('attribut6').value;
			chargerAttributs6(attr6);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnTree(ev) {
  try {

    if (ev.keyCode==13) {
			choixArticle();
  	}

  } catch (e) {
    recup_erreur(e);
  }
}


function existeArticle(code_article) {
  try {

		var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
		qExArt.setParam('Reference', code_article);

    if (!isEmpty(fournisseur_id)) {
      qExArt.setParam('Fournisseur_Id', fournisseur_id);
    }
		if (!isEmpty(nomenclature)) {
  		qExArt.setParam('Nomenclature',1);
  	}

		var result = qExArt.execute();

  	var reference = result.responseXML.documentElement.getAttribute('Article_Id');

		if (isEmpty(reference)) {
			return false;
		}
		else {
			document.getElementById('Article_Id').value = reference;
			return true;
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function nouveauArticle() {
  try {

		window.arguments[0]("");

		window.close();

  } catch (e) {
    recup_erreur(e);
  }
}


function ouvrirArticle(code_article) {
  try {

		window.arguments[0](code_article);

    window.close();

  } catch (e) {
    recup_erreur(e);
  }
}


function choixArticle() {
	try {

		var tree = document.getElementById('tree-articles');

		if (tree.view!=null && tree.currentIndex!=-1) {
			var code_article = getCellText(tree,tree.currentIndex, 'ColArticle_Id');
			ouvrirArticle(code_article);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnListeArticles() {
	try {
		
		if (aRecherche.isSelected()) {
			
			var i = aRecherche.getCurrentIndex();
			var articleId = aRecherche.getCellText(i, 'ColArticle_Id');
			aDispoFourn.setParam("Article_Id", articleId);
			aDispoFourn.initTree();
			
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function rechercher() {
	try {

		var refModele = document.getElementById('refModele').value;
		var attribut1 = document.getElementById('attribut1').value;
		var attribut2 = document.getElementById('attribut2').value;
		var attribut3 = document.getElementById('attribut3').value;
		var attribut4 = document.getElementById('attribut4').value;
		var attribut5 = document.getElementById('attribut5').value;
		var attribut6 = document.getElementById('attribut6').value;

		aRecherche.setFullParamById('Article_Id');
		aRecherche.setParam("Ref_Modele", refModele);
		aRecherche.setFullParamById('Designation');
		aRecherche.setFullParamById('Marque');
		aRecherche.setFullParamById('Famille_1');
		aRecherche.setFullParamById('Famille_2');
		aRecherche.setFullParamById('Famille_3');
		if (isEmpty(attribut1)) { aRecherche.removeParam('Attribut_1'); }
		else { aRecherche.setParam('Attribut_1', attribut1); }
		if (isEmpty(attribut2)) { aRecherche.removeParam('Attribut_2'); }
		else { aRecherche.setParam('Attribut_2', attribut2); }
		if (isEmpty(attribut3)) { aRecherche.removeParam('Attribut_3'); }
		else { aRecherche.setParam('Attribut_3', attribut3); }
		if (isEmpty(attribut4)) { aRecherche.removeParam('Attribut_4'); }
		else { aRecherche.setParam('Attribut_4', attribut4); }
		if (isEmpty(attribut5)) { aRecherche.removeParam('Attribut_5'); }
		else { aRecherche.setParam('Attribut_5', attribut5); }
		if (isEmpty(attribut6)) { aRecherche.removeParam('Attribut_6'); }
		else { aRecherche.setParam('Attribut_6', attribut6); }
		aRecherche.setFullParamById('siteweb');

		if (!isEmpty(ParamValeur('Code_Tarif'))) {
    	aRecherche.setParam('Code_Tarif', ParamValeur('Code_Tarif'));
    }

		aRecherche.initTree();
		aDispoFourn.deleteTree();

	} catch (e) {
    recup_erreur(e);
  }
}


function reinitialiser() {
	try {

		aRecherche.deleteTree();
		aDispoFourn.deleteTree();
		aFamille2.deleteTree();
		aFamille3.deleteTree();
		
		var chargerFamille1 = "0";
		var chargerFamille2 = "0";
		var chargerFamille3 = "0";
		var chargerAttribut1 = "";
		var chargerAttribut2 = "";
		var chargerAttribut3 = "";
		var chargerAttribut4 = "";
		var chargerAttribut5 = "";
		var chargerAttribut6 = "";

		document.getElementById('Article_Id').value = "";
		document.getElementById('refModele').value = "";
		document.getElementById('Designation').value = "";
		document.getElementById('Marque').selectedIndex = 0;
		document.getElementById('Famille_1').selectedIndex = 0;
		document.getElementById('Famille_2').selectedIndex = 0;
		document.getElementById('Famille_3').selectedIndex = 0;
		document.getElementById('attribut1').selectedIndex = 0;
		document.getElementById('attribut2').selectedIndex = 0;
		document.getElementById('attribut3').selectedIndex = 0;
		document.getElementById('attribut4').selectedIndex = 0;
		document.getElementById('attribut5').selectedIndex = 0;
		document.getElementById('attribut6').selectedIndex = 0;
		
		rechargerAttributs();

	} catch (e) {
    recup_erreur(e);
  }
}

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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var modif = false; //controle si des modifications ont été apportées

var aFamille1 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_1');
var aFamille2 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_2');
var aFamille3 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_3');
var listeMarque = new Arbre("Facturation/GetRDF/combo-marquesArticle.tmpl","Marque");
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

var arbreArticles = new Arbre("Facturation/GetRDF/liste_articles_tarifs.tmpl","articles");
var clientId;

var calcul_possible = false;


function init() {
	try {

		window.addEventListener("close",fermer,false);
		
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
    circonstAttr4 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 5);
    result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut5').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    circonstAttr5 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 6);
    result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut6').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    circonstAttr6 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");

		listeMarque.initTree(initMarque);
		chargerFamilles("0","0","0");
		if (!circonstAttr1) { chargerAttributs1(""); }
		if (!circonstAttr2) { chargerAttributs2(""); }
		if (!circonstAttr3) { chargerAttributs3(""); }
		if (!circonstAttr4) { chargerAttributs4(""); }
		if (!circonstAttr5) { chargerAttributs5(""); }
		if (!circonstAttr6) { chargerAttributs6(""); }

		clientId = window.arguments[0];

		document.getElementById('Article_Id').focus();

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
			if (circonstAttr1) { aAttribut1.setParam("Famille_Id", chargerFamille1); }
			if (circonstAttr2) { aAttribut2.setParam("Famille_Id", chargerFamille1); }
			if (circonstAttr3) { aAttribut3.setParam("Famille_Id", chargerFamille1); }
			if (circonstAttr4) { aAttribut4.setParam("Famille_Id", chargerFamille1); }
			if (circonstAttr5) { aAttribut5.setParam("Famille_Id", chargerFamille1); }
			if (circonstAttr6) { aAttribut6.setParam("Famille_Id", chargerFamille1); }
			chargerFamille1 = "0";
			chargerFamilles2();
		} else {
			aFamille2.deleteTree();
			aFamille3.deleteTree();
			document.getElementById('Famille_2').selectedIndex=0;
			document.getElementById('Famille_3').selectedIndex=0;
			document.getElementById('Famille_2').disabled = true;
			document.getElementById('Famille_3').disabled = true;
			
			if (circonstAttr1) {
				aAttribut1.removeParam("Famille_Id");
				var attr1 = document.getElementById('attribut1').value;
				chargerAttributs1(attr1);
			}
			if (circonstAttr2) {
				aAttribut2.removeParam("Famille_Id");
				var attr2 = document.getElementById('attribut2').value;
				chargerAttributs2(attr2);
			}
			if (circonstAttr3) {
				aAttribut3.removeParam("Famille_Id");
				var attr3 = document.getElementById('attribut3').value;
				chargerAttributs3(attr3);
			}
			if (circonstAttr4) {
				aAttribut4.removeParam("Famille_Id");
				var attr4 = document.getElementById('attribut4').value;
				chargerAttributs4(attr4);
			}
			if (circonstAttr5) {
				aAttribut5.removeParam("Famille_Id");
				var attr5 = document.getElementById('attribut5').value;
				chargerAttributs5(attr5);
			}
			if (circonstAttr6) {
				aAttribut6.removeParam("Famille_Id");
				var attr6 = document.getElementById('attribut6').value;
				chargerAttributs6(attr6);
			}
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
			if (circonstAttr1) { aAttribut1.setParam("Famille_Id", chargerFamille2); }
			if (circonstAttr2) { aAttribut2.setParam("Famille_Id", chargerFamille2); }
			if (circonstAttr3) { aAttribut3.setParam("Famille_Id", chargerFamille2); }
			if (circonstAttr4) { aAttribut4.setParam("Famille_Id", chargerFamille2); }
			if (circonstAttr5) { aAttribut5.setParam("Famille_Id", chargerFamille2); }
			if (circonstAttr6) { aAttribut6.setParam("Famille_Id", chargerFamille2); }
			chargerFamille2 = "0";
			chargerFamilles3();
		} else {
			aFamille3.deleteTree();
			document.getElementById('Famille_3').selectedIndex=0;
			document.getElementById('Famille_3').disabled = true;
			
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
		var existe = false;
		var i=0;
		var menulist = document.getElementById(champ);
		var items = menulist.getElementsByTagName("menuitem");
		while (!existe && i<items.length) {
			if (items[i].getAttribute("value")==value) { existe = true; }
			else { i++; }
		}
		if (!existe) { retour = ""; }
		return retour;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnId(ev) {
	try {

		if (ev.keyCode==13) {
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
		var famille3 = document.getElementById('Famille_3').value;
		if (famille3 != "0") {
			if (circonstAttr1) {
				aAttribut1.setParam("Famille_Id", famille3);
				var attr1 = document.getElementById('attribut1').value;
				chargerAttributs1(attr1);
			}
			if (circonstAttr2) {
				aAttribut2.setParam("Famille_Id", famille3);
				var attr2 = document.getElementById('attribut2').value;
				chargerAttributs2(attr2);
			}
			if (circonstAttr3) {
				aAttribut3.setParam("Famille_Id", famille3);
				var attr3 = document.getElementById('attribut3').value;
				chargerAttributs3(attr3);
			}
			if (circonstAttr4) {
				aAttribut4.setParam("Famille_Id", famille3);
				var attr4 = document.getElementById('attribut4').value;
				chargerAttributs4(attr4);
			}
			if (circonstAttr5) {
				aAttribut5.setParam("Famille_Id", famille3);
				var attr5 = document.getElementById('attribut5').value;
				chargerAttributs5(attr5);
			}
			if (circonstAttr6) {
				aAttribut6.setParam("Famille_Id", famille3);
				var attr6 = document.getElementById('attribut6').value;
				chargerAttributs6(attr6);
			}
		}
		rechercher();
	} catch (e) {
		recup_erreur(e);
	}
}


function existeArticle(code_article) {
	try {

		var corps = cookie() +"&Page=Facturation/Stocks/existeArticle.tmpl&ContentType=xml&Article_Id="+ urlEncode(code_article);
		var p = requeteHTTP(corps);

		var contenu = p.responseXML.documentElement;
		return (contenu.getAttribute('existe')=="true" && contenu.getAttribute('supprime')=="false");

	} catch (e) {
		recup_erreur(e);
	}
}


function rechercher() {
	try {
		
		if (arbreArticles.isNotNull()) {
			arbreArticles.clearSelection();
		}
		
		var refModele = document.getElementById('refModele').value;
		var attribut1 = document.getElementById('attribut1').value;
		var attribut2 = document.getElementById('attribut2').value;
		var attribut3 = document.getElementById('attribut3').value;
		var attribut4 = document.getElementById('attribut4').value;
		var attribut5 = document.getElementById('attribut5').value;
		var attribut6 = document.getElementById('attribut6').value;
		
		document.getElementById('articles').disabled = true;
		document.getElementById('bToutSelectionner').disabled = true;
		document.getElementById('bToutDeselectionner').disabled = true;
		document.getElementById('Prix_HT').disabled = true;
		document.getElementById('Prix_TTC').disabled = true;
		document.getElementById('Coeff').disabled = true;
		document.getElementById('Marge').disabled = true;
		document.getElementById('bValiderTarif').disabled = true;

		arbreArticles.setParam("Article_Id", document.getElementById("Article_Id").value);
		arbreArticles.setParam("Ref_Modele", refModele);
		arbreArticles.setParam("Designation", document.getElementById("Designation").value);
		arbreArticles.setParam("Marque", document.getElementById("Marque").value);
		arbreArticles.setParam("Famille_1", document.getElementById("Famille_1").value);
		arbreArticles.setParam("Famille_2", document.getElementById("Famille_2").value);
		arbreArticles.setParam("Famille_3", document.getElementById("Famille_3").value);
		if (isEmpty(attribut1)) { arbreArticles.removeParam('Attribut_1'); }
		else { arbreArticles.setParam('Attribut_1', attribut1); }
		if (isEmpty(attribut2)) { arbreArticles.removeParam('Attribut_2'); }
		else { arbreArticles.setParam('Attribut_2', attribut2); }
		if (isEmpty(attribut3)) { arbreArticles.removeParam('Attribut_3'); }
		else { arbreArticles.setParam('Attribut_3', attribut3); }
		if (isEmpty(attribut4)) { arbreArticles.removeParam('Attribut_4'); }
		else { arbreArticles.setParam('Attribut_4', attribut4); }
		if (isEmpty(attribut5)) { arbreArticles.removeParam('Attribut_5'); }
		else { arbreArticles.setParam('Attribut_5', attribut5); }
		if (isEmpty(attribut6)) { arbreArticles.removeParam('Attribut_6'); }
		else { arbreArticles.setParam('Attribut_6', attribut6); }
		arbreArticles.setParam("Client_Id",clientId);

		arbreArticles.initTree(initListeArticles);

	} catch (e) {
		recup_erreur(e);
	}
}


function initListeArticles() {
	try {
		document.getElementById('articles').disabled = false;
		document.getElementById('bToutSelectionner').disabled = false;
		document.getElementById('bToutDeselectionner').disabled = false;
		document.getElementById('Prix_HT').disabled = false;
		document.getElementById('Prix_TTC').disabled = false;
		document.getElementById('Coeff').disabled = false;
		document.getElementById('Marge').disabled = false;
		document.getElementById('bValiderTarif').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function reinitialiser() {
	try {
		
		if (arbreArticles.isNotNull()) {
			arbreArticles.clearSelection();
		}

		arbreArticles.deleteTree();
		aFamille2.deleteTree();
		aFamille3.deleteTree();

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
		efface_champ();
		document.getElementById("infoart").collapsed = false;
		document.getElementById("nb_article_mod").collapsed = true;
		document.getElementById('Reference').value = "";
		document.getElementById('Desig').value = "";
		document.getElementById('PrixAchat').value = "";
		calcul_possible = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function select_all() {
	try {

		if (arbreArticles.isNotNull()) {
			arbreArticles.selectAll();
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function deselect_all() {
	try {
		
		if (arbreArticles.isNotNull()) {
			arbreArticles.clearSelection();
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function remplit_champ() {
	try {

		efface_champ();
		var nbSelection = arbreArticles.nbSelection();
		
		if (nbSelection > 0) {
			if (nbSelection == 1) {
				var currentIndex = arbreArticles.getCurrentIndex();
				document.getElementById("infoart").collapsed = false;
				document.getElementById("nb_article_mod").collapsed = true;
				document.getElementById('Reference').value = arbreArticles.getCellText(currentIndex,'ColArticle_Id');
				document.getElementById('Desig').value = arbreArticles.getCellText(currentIndex,'ColDesignation');
				document.getElementById('PrixAchat').value = arbreArticles.getCellText(currentIndex,'ColPrixAchat');
				calcul_possible = (currentIndex!=-1);
			}
			else {
				document.getElementById("infoart").collapsed = true;
				document.getElementById("nb_article_mod").collapsed = false;

				document.getElementById('Reference').value = "";
				document.getElementById('Desig').value = "";
				document.getElementById('PrixAchat').value = "";
				document.getElementById("label_article_mod").value = " Nouveau tarif pour les "+nbSelection+" articles sélectionnés : ";
				calcul_possible = false;
			}
		}
		else {
			document.getElementById("infoart").collapsed = false;
			document.getElementById("nb_article_mod").collapsed = true;
			document.getElementById('Reference').value = "";
			document.getElementById('Desig').value = "";
			document.getElementById('PrixAchat').value = "";
			calcul_possible = false;
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function efface_champ() {
	try {

		document.getElementById('Prix_HT').value = "";
		document.getElementById('Prix_TTC').value = "";
		document.getElementById('Coeff').value = "";
		document.getElementById('Marge').value = "";

	}	catch(e){
		recup_erreur(e);
	}
}


function calculerTarif(t) {
	try {

		var nf2 = new NumberFormat("0.00", false);
		var nf4 = new NumberFormat("0.00##", false);
		var nf5 = new NumberFormat("0.#####", false);

		if (calcul_possible) {
			var currentIndex = arbreArticles.getCurrentIndex();
			var tva = parseFloat(arbreArticles.getCellText(currentIndex,"ColTVA"))/100 + 1;

			var pr = parseFloat(arbreArticles.getCellText(currentIndex,"ColPrixAchat"));
			var anTarif = parseFloat(arbreArticles.getCellText(currentIndex,"ColTarif"));

			var saisieOk = true;
			
			if (t=="h") {
				if (isEmpty(document.getElementById('Prix_HT').value) || isNaN(document.getElementById('Prix_HT').value)) {
					saisieOk = false;
				} else {
					var pvht = parseFloat(document.getElementById('Prix_HT').value);
					var pourcPV = (pvht>=anTarif?(pvht/anTarif -1) * 100:(anTarif/pvht -1) * (-100));
					document.getElementById('Prix_TTC').value = nf4.format(pvht * tva);
					document.getElementById('Coeff').value = nf5.format(pourcPV);
					document.getElementById('Marge').value = nf2.format(pvht==0?100:(pvht-pr)/pvht * 100);
				}
			}
			else if (t=="t") {
				if (isEmpty(document.getElementById('Prix_TTC').value) || isNaN(document.getElementById('Prix_TTC').value)) {
					saisieOk = false;
				} else {
					var pvht = parseFloat(document.getElementById('Prix_TTC').value) / tva;
					document.getElementById('Prix_HT').value = nf4.format(pvht);
					var pourcPV = (pvht>=anTarif?(pvht/anTarif -1) * 100:(anTarif/pvht -1) * (-100));
					document.getElementById('Coeff').value = nf5.format(pourcPV);
					document.getElementById('Marge').value = nf2.format(pvht==0?100:(pvht-pr)/pvht * 100);
				}
			}
			else if (t=="c") {
				if (isEmpty(document.getElementById('Coeff').value) || (document.getElementById('Coeff').value!="-" && isNaN(document.getElementById('Coeff').value))) {
					saisieOk = false;
				} else {
					if (document.getElementById('Coeff').value!="-") {
						var coeff = parseFloat(document.getElementById('Coeff').value);
						var pvht = anTarif * (coeff>=0?1 + coeff/100:1 - Math.abs(coeff)/100);
						document.getElementById('Prix_HT').value = nf4.format(pvht);
						document.getElementById('Prix_TTC').value = nf4.format(pvht * tva);
						document.getElementById('Marge').value = nf2.format(pvht==0?100:(pvht-pr)/pvht * 100);
					} else {
						document.getElementById('Prix_HT').value = "";
						document.getElementById('Prix_TTC').value = "";
						document.getElementById('Marge').value = "";
					}
				}
			}
			else if (t=="m") {
				if (isEmpty(document.getElementById('Marge').value) || !isTaux(document.getElementById('Marge').value) || (parseFloat(document.getElementById('Marge').value)==100)) {
					saisieOk = false;
				} else {
					var pvht = pr / (1 - parseFloat(document.getElementById('Marge').value)/100);
					var pourcPV = (pvht>=anTarif?(pvht/anTarif -1) * 100:(anTarif/pvht -1) * (-100));
					document.getElementById('Prix_HT').value = nf4.format(pvht);
					document.getElementById('Prix_TTC').value = nf4.format(pvht * tva);
					document.getElementById('Coeff').value = nf5.format(pourcPV);
				}
			}
			
			if (!saisieOk) {
				document.getElementById('Prix_HT').value = "";
				document.getElementById('Prix_TTC').value = "";
				document.getElementById('Coeff').value = "";
				document.getElementById('Marge').value = "";
			}
		}
		else {
			if (t=="h") {
				if (isEmpty(document.getElementById('Prix_HT').value) || isNaN(document.getElementById('Prix_HT').value)) {
					document.getElementById('Prix_HT').value = "";
				}
				document.getElementById('Prix_TTC').value = "";
				document.getElementById('Coeff').value = "";
				document.getElementById('Marge').value = "";
			}
			else if (t=="t") {
				if (isEmpty(document.getElementById('Prix_TTC').value) || isNaN(document.getElementById('Prix_TTC').value)) {
					document.getElementById('Prix_TTC').value = "";
				}
				document.getElementById('Prix_HT').value = "";
				document.getElementById('Coeff').value = "";
				document.getElementById('Marge').value = "";
			}
			else if (t=="c") {
				// le coeff peut être négatif, et si on a saisi un "-", il ne faut pas que ce soit interprété comme une erreur, d'où la vérif ci-dessous
				if (isEmpty(document.getElementById('Coeff').value) || (document.getElementById('Coeff').value!="-" && isNaN(document.getElementById('Coeff').value))) {
					document.getElementById('Coeff').value = "";
				}
				document.getElementById('Prix_HT').value = "";
				document.getElementById('Prix_TTC').value = "";
				document.getElementById('Marge').value = "";
			}
			else if (t=="m") {
				if (isEmpty(document.getElementById('Marge').value) || !isTaux(document.getElementById('Marge').value) || (parseFloat(document.getElementById('Marge').value)==100)) {
					document.getElementById('Marge').value = "";
				}
				document.getElementById('Prix_HT').value = "";
				document.getElementById('Prix_TTC').value = "";
				document.getElementById('Coeff').value = "";
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function valider() {
	try {
		
		if (arbreArticles.nbSelection()>0) {
		
			var prixHT = document.getElementById("Prix_HT").value;
			var prixTTC = document.getElementById("Prix_TTC").value;
			var marge = document.getElementById("Marge").value;
			var coeff = document.getElementById('Coeff').value;
			
			if (!isEmpty(prixHT) && (!isPositiveOrNull(prixHT) || !checkDecimal(prixHT,4))) {
				showWarning("Prix de vente HT incorrect !");
			}
			else if (!isEmpty(prixTTC) && (!isPositiveOrNull(prixTTC) || !checkDecimal(prixTTC,4))) {
				showWarning("Prix de vente TTC incorrect !");
			}
			else if (!isEmpty(coeff) && ((parseFloat(coeff)<-100) || (parseFloat(coeff)>100) || !checkDecimal(coeff,5))) {
				showWarning("Coefficient incorrect !");
			}
			else if (!isEmpty(marge) && (!isTaux(marge) || (marge==100) || !checkDecimal(marge,2))) {
				showWarning("Taux de marge incorrect !");
			}
			else {
				var nb = 0;
				var mod;
				
				if (isEmpty(prixHT)) { nb++; }
				else { mod = 'h'; }
	
				if (isEmpty(prixTTC)) { nb++; }
				else { mod = 't'; }
	
				if (isEmpty(coeff)) { nb++; }
				else {
					coeff = parseFloat(coeff);
					mod = 'c';
					coeff = (coeff>=0?1+coeff/100:1-(Math.abs(coeff)/100));
				}
				
				if (isEmpty(marge)) { nb++; }
				else { mod = 'm'; }
	
				if (nb==4) {
					showWarning("Veuillez remplir un champ !");
				}
				else {
					// sélection unique
					if (calcul_possible) {
						var currentIndex = arbreArticles.getCurrentIndex();
	
						var articleId = arbreArticles.getCellText(currentIndex,"ColArticle_Id");
	
						var corps = cookie() +"&Page=Facturation/Clients/creerTarifSpecLot.tmpl&ContentType=xml";
						corps += "&Type=1&Client_Id="+ urlEncode(clientId);
						corps += "&Prix_HT="+ prixHT + "&Prix_TTC="+ prixTTC +"&Coeff="+ coeff +"&Marge="+ marge;
						corps += "&Article_Id="+ urlEncode(articleId);
	
						requeteHTTP(corps);
						arbreArticles.initTree();
						modif = true;
					}
					// sélection multiple
					else {
						var it = 0;
						var listeArticlesSelect = new Array();
						var rangCompte = arbreArticles.getRangeCount();
	
						var start = {};
						var end = {};
	
						for (var i=0;i<rangCompte;i++){
							arbreArticles.getRangeAt(i,start,end);
							for (var j=start.value;j<=end.value;j++) {
								listeArticlesSelect[it] = arbreArticles.getCellText(j,"ColArticle_Id");
								it++;
							}
						}
	
						var corps = cookie() +"&Page=Facturation/Clients/creerTarifSpecLot.tmpl&ContentType=xml";
						corps += "&Type=2&Client_Id="+ urlEncode(clientId);
						corps += "&Liste_Articles_Select="+ listeArticlesSelect;
	
						switch(mod) {
							case 't':
								corps += "&Prix_TTC="+ prixTTC;
								break;
							case 'h':
								corps += "&Prix_HT="+ prixHT;
								break;
							case 'c':
								corps += "&Coeff="+ coeff;
								break;
							case 'm':
								corps += "&Marge="+ marge;
								break;
						}
	
						requeteHTTP(corps);
						arbreArticles.initTree(deselect_all);
						modif = true;
					}
				}
			}
		} else {
			showWarning("Veuillez sélectionner un ou plusieurs articles !");
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function fermer() {
	try {

		if (modif) {
			window.arguments[1]();
		}
		window.close();

	}	catch(e){
		recup_erreur(e);
	}
}



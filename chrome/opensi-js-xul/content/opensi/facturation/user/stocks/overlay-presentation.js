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


var op_aFamille1 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'pFamille1');
var op_aFamille2 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'pFamille2');
var op_aFamille3 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'pFamille3');
var op_aMarque = new Arbre('Facturation/GetRDF/combo-marquesArticle.tmpl', 'pMarque');
var op_aAttribut1 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'pAttribut1');
var op_aAttribut2 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'pAttribut2');
var op_aAttribut3 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'pAttribut3');
var op_aAttribut4 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'pAttribut4');
var op_aAttribut5 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'pAttribut5');
var op_aAttribut6 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'pAttribut6');

var op_chargerMarque = "0";
var op_chargerFamille1 = "0";
var op_chargerFamille2 = "0";
var op_chargerFamille3 = "0";
var op_chargerAttribut1 = "";
var op_chargerAttribut2 = "";
var op_chargerAttribut3 = "";
var op_chargerAttribut4 = "";
var op_chargerAttribut5 = "";
var op_chargerAttribut6 = "";

var op_circonstAttr1 = false;
var op_circonstAttr2 = false;
var op_circonstAttr3 = false;
var op_circonstAttr4 = false;
var op_circonstAttr5 = false;
var op_circonstAttr6 = false;


function initPresentation() {
  try {
	
  	var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();

		document.getElementById('Act_Code_Stats').collapsed = (result.responseXML.documentElement.getAttribute('Act_Code_Stats')=="0");
    document.getElementById('pRowTracabilite_CP').collapsed = (result.responseXML.documentElement.getAttribute("Act_Code_Produit")!="1");
    
    var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
    qNomListeAttribut.setParam("Liste_Id", 1);
    result = qNomListeAttribut.execute();
    document.getElementById('pLblAttribut1').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    op_circonstAttr1 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 2);
    result = qNomListeAttribut.execute();
    document.getElementById('pLblAttribut2').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    op_circonstAttr2 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 3);
    result = qNomListeAttribut.execute();
    document.getElementById('pLblAttribut3').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    op_circonstAttr3 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 4);
    result = qNomListeAttribut.execute();
    document.getElementById('pLblAttribut4').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    op_circonstAttr4 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 5);
    result = qNomListeAttribut.execute();
    document.getElementById('pLblAttribut5').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    op_circonstAttr5 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");
    qNomListeAttribut.setParam("Liste_Id", 6);
    result = qNomListeAttribut.execute();
    document.getElementById('pLblAttribut6').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    op_circonstAttr6 = (result.responseXML.documentElement.getAttribute('Circonst')=="true");

		op_aAttribut1.setParam("Liste_Id", 1);
		op_aAttribut2.setParam("Liste_Id", 2);
		op_aAttribut3.setParam("Liste_Id", 3);
		op_aAttribut4.setParam("Liste_Id", 4);
		op_aAttribut5.setParam("Liste_Id", 5);
		op_aAttribut6.setParam("Liste_Id", 6);

	} catch (e) {
		recup_erreur(e);
	}
}


function op_deleteFamilles() {
  try {

  	op_aFamille1.deleteTree();
		op_aFamille2.deleteTree();
		op_aFamille3.deleteTree();

	} catch (e) {
		recup_erreur(e);
	}
}


function op_ouvrirEditionListeMarque() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=MARQUE";
    window.openDialog(url,'','chrome,modal,centerscreen', op_chargerMarques);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerMarques(selection) {
	try {
		op_chargerMarque = selection;
		op_aMarque.setParam("Selection", op_chargerMarque);
		op_aMarque.initTree(op_initMarque);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_initMarque() {
  try {

		document.getElementById('pMarque').value = op_chargerMarque;

	} catch (e) {
		recup_erreur(e);
	}
}


function op_ouvrirEditionListeAttribut1() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=ATTRIBUT_1";
    window.openDialog(url,'','chrome,modal,centerscreen', op_chargerAttributs1);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerAttributs1(selection) {
	try {
		op_chargerAttribut1 = selection;
		if (!isEmpty(selection)) { op_aAttribut1.setParam("Selection", op_chargerAttribut1); }
		else { op_aAttribut1.removeParam("Selection"); }
		op_aAttribut1.initTree(op_initAttribut1);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_initAttribut1() {
  try {
  	
  	if (op_circonstAttr1) { op_chargerAttribut1 = op_checkExisteCirconst('pAttribut1', op_chargerAttribut1); }

		document.getElementById('pAttribut1').value = op_chargerAttribut1;

	} catch (e) {
		recup_erreur(e);
	}
}


function op_ouvrirEditionListeAttribut2() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=ATTRIBUT_2";
    window.openDialog(url,'','chrome,modal,centerscreen', op_chargerAttributs2);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerAttributs2(selection) {
	try {
		op_chargerAttribut2 = selection;
		if (!isEmpty(selection)) { op_aAttribut2.setParam("Selection", op_chargerAttribut2); }
		else { op_aAttribut2.removeParam("Selection"); }
		op_aAttribut2.initTree(op_initAttribut2);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_initAttribut2() {
  try {
  	
  	if (op_circonstAttr2) { op_chargerAttribut2 = op_checkExisteCirconst('pAttribut2', op_chargerAttribut2); }

		document.getElementById('pAttribut2').value = op_chargerAttribut2;

	} catch (e) {
		recup_erreur(e);
	}
}


function op_ouvrirEditionListeAttribut3() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=ATTRIBUT_3";
    window.openDialog(url,'','chrome,modal,centerscreen', op_chargerAttributs3);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerAttributs3(selection) {
	try {
		op_chargerAttribut3 = selection;
		if (!isEmpty(selection)) { op_aAttribut3.setParam("Selection", op_chargerAttribut3); }
		else { op_aAttribut3.removeParam("Selection"); }
		op_aAttribut3.initTree(op_initAttribut3);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_initAttribut3() {
  try {
  	
  	if (op_circonstAttr3) { op_chargerAttribut3 = op_checkExisteCirconst('pAttribut3', op_chargerAttribut3); }

		document.getElementById('pAttribut3').value = op_chargerAttribut3;

	} catch (e) {
		recup_erreur(e);
	}
}


function op_ouvrirEditionListeAttribut4() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=ATTRIBUT_4";
    window.openDialog(url,'','chrome,modal,centerscreen', op_chargerAttributs4);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerAttributs4(selection) {
	try {
		op_chargerAttribut4 = selection;
		if (!isEmpty(selection)) { op_aAttribut4.setParam("Selection", op_chargerAttribut4); }
		else { op_aAttribut4.removeParam("Selection"); }
		op_aAttribut4.initTree(op_initAttribut4);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_initAttribut4() {
  try {
  	
  	if (op_circonstAttr4) { op_chargerAttribut4 = op_checkExisteCirconst('pAttribut4', op_chargerAttribut4); }

		document.getElementById('pAttribut4').value = op_chargerAttribut4;

	} catch (e) {
		recup_erreur(e);
	}
}


function op_ouvrirEditionListeAttribut5() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=ATTRIBUT_5";
    window.openDialog(url,'','chrome,modal,centerscreen', op_chargerAttributs5);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerAttributs5(selection) {
	try {
		op_chargerAttribut5 = selection;
		if (!isEmpty(selection)) { op_aAttribut5.setParam("Selection", op_chargerAttribut5); }
		else { op_aAttribut5.removeParam("Selection"); }
		op_aAttribut5.initTree(op_initAttribut5);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_initAttribut5() {
  try {

  	if (op_circonstAttr5) { op_chargerAttribut5 = op_checkExisteCirconst('pAttribut5', op_chargerAttribut5); }
  	
		document.getElementById('pAttribut5').value = op_chargerAttribut5;

	} catch (e) {
		recup_erreur(e);
	}
}


function op_ouvrirEditionListeAttribut6() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=ATTRIBUT_6";
    window.openDialog(url,'','chrome,modal,centerscreen', op_chargerAttributs6);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerAttributs6(selection) {
	try {
		op_chargerAttribut6 = selection;
		if (!isEmpty(selection)) { op_aAttribut6.setParam("Selection", op_chargerAttribut6); }
		else { op_aAttribut6.removeParam("Selection"); }
		op_aAttribut6.initTree(op_initAttribut6);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_initAttribut6() {
  try {
  	
  	if (op_circonstAttr6) { op_chargerAttribut6 = op_checkExisteCirconst('pAttribut6', op_chargerAttribut6); }

		document.getElementById('pAttribut6').value = op_chargerAttribut6;

	} catch (e) {
		recup_erreur(e);
	}
}


function op_checkExisteCirconst(champ, value) {
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



function op_ouvrirEditionListeFamille1() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=FART&Parent_Id=0";
    window.openDialog(url,'','chrome,modal,centerscreen', op_retourEditionListeFamille1);
	} catch (e) {
		recup_erreur(e);
	}
}

function op_retourEditionListeFamille1(selection) {
	try {
		op_chargerFamille1 = selection;
		op_chargerFamilles1();
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerFamilles1() {
	try {
		op_aFamille1.setParam("Selection", op_chargerFamille1);
		op_aFamille1.initTree(op_initFamille1);
	} catch (e) {
		recup_erreur(e);
	}
}


function op_initFamille1() {
  try {

		document.getElementById('pFamille1').value = op_chargerFamille1;
		if (op_chargerFamille1 != "0") {
			op_chargerFamille1 = "0";
			op_chargerFamilles2();
		} else {
			op_aFamille2.deleteTree();
			op_aFamille3.deleteTree();
			document.getElementById('pFamille2').selectedIndex=0;
			document.getElementById('pFamille3').selectedIndex=0;
			document.getElementById('pFamille2').disabled = true;
			document.getElementById('pFamille3').disabled = true;
			document.getElementById('op-bCreerFamille2').disabled = true;
			document.getElementById('op-bCreerFamille3').disabled = true;
			
			op_rechargerAttributs();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function op_ouvrirEditionListeFamille2() {
	try {
		var parentId = document.getElementById('pFamille1').value;
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=FART&Parent_Id="+ parentId;
    window.openDialog(url,'','chrome,modal,centerscreen', op_retourEditionListeFamille2);
	} catch (e) {
		recup_erreur(e);
	}
}

function op_retourEditionListeFamille2(selection) {
	try {
		op_chargerFamille2 = selection;
		op_chargerFamilles2();
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerFamilles2() {
	try {
		
		var famille1 = document.getElementById('pFamille1').value;
		if (famille1=="0") {
			document.getElementById('pFamille2').disabled = true;
			document.getElementById('pFamille3').disabled = true;
			document.getElementById('op-bCreerFamille2').disabled = true;
			document.getElementById('op-bCreerFamille3').disabled = true;
		}
  	
		op_aFamille2.setParam('Parent_Id', famille1);
		op_aFamille2.setParam("Selection", op_chargerFamille2);
		op_aFamille2.initTree(op_initFamille2);

	} catch (e) {
		recup_erreur(e);
	}
}


function op_initFamille2() {
  try {

		document.getElementById('pFamille2').value = op_chargerFamille2;
		if (document.getElementById('pFamille1').value!="0") {
			document.getElementById('pFamille2').disabled = false;
			document.getElementById('op-bCreerFamille2').disabled = false;
		}
		if (op_chargerFamille2 != "0") {
			op_chargerFamille2 = "0";
			op_chargerFamilles3();
		} else {
			op_aFamille3.deleteTree();
			document.getElementById('pFamille3').selectedIndex=0;
			document.getElementById('pFamille3').disabled = true;
			document.getElementById('op-bCreerFamille3').disabled = true;
			
			op_rechargerAttributs();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function op_ouvrirEditionListeFamille3() {
	try {
		var parentId = document.getElementById('pFamille2').value;
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=FART&Parent_Id="+ parentId;
    window.openDialog(url,'','chrome,modal,centerscreen', op_retourEditionListeFamille3);
	} catch (e) {
		recup_erreur(e);
	}
}

function op_retourEditionListeFamille3(selection) {
	try {
		op_chargerFamille3 = selection;
		op_chargerFamilles3();
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerFamilles3() {
	try {
		
		var famille2 = document.getElementById('pFamille2').value;
		if (famille2=="0") {
			document.getElementById('pFamille3').disabled = true;
			document.getElementById('op-bCreerFamille3').disabled = true;
		}
  	
		op_aFamille3.setParam('Parent_Id', famille2);
		op_aFamille3.setParam("Selection", op_chargerFamille3);
		op_aFamille3.initTree(op_initFamille3);

	} catch (e) {
		recup_erreur(e);
	}
}


function op_initFamille3() {
  try {

		document.getElementById('pFamille3').value = op_chargerFamille3;
		if (document.getElementById('pFamille2').value!="0") {
			document.getElementById('pFamille3').disabled = false;
			document.getElementById('op-bCreerFamille3').disabled = false;
		}
		if (op_chargerFamille3 != "0") {
			op_chargerFamille3 = "0";
		}
		op_rechargerAttributs();

	} catch (e) {
		recup_erreur(e);
	}
}


function op_rechargerAttributs() {
	try {
		var famille1 = document.getElementById('pFamille1').value;
		if (famille1=="0") {
			if (op_circonstAttr1) { op_aAttribut1.removeParam("Famille_Id"); }
			if (op_circonstAttr2) { op_aAttribut2.removeParam("Famille_Id"); }
			if (op_circonstAttr3) { op_aAttribut3.removeParam("Famille_Id"); }
			if (op_circonstAttr4) { op_aAttribut4.removeParam("Famille_Id"); }
			if (op_circonstAttr5) { op_aAttribut5.removeParam("Famille_Id"); }
			if (op_circonstAttr6) { op_aAttribut6.removeParam("Famille_Id"); }
		} else {
			var famille2 = document.getElementById('pFamille2').value;
			var famille3 = document.getElementById('pFamille3').value;
			
			var famille;
			if (famille3!="0") { famille = famille3; }
			else if (famille2!="0") { famille = famille2; }
			else { famille = famille1; }
			
			if (op_circonstAttr1) { op_aAttribut1.setParam("Famille_Id", famille); }
			if (op_circonstAttr2) { op_aAttribut2.setParam("Famille_Id", famille); }
			if (op_circonstAttr3) { op_aAttribut3.setParam("Famille_Id", famille); }
			if (op_circonstAttr4) { op_aAttribut4.setParam("Famille_Id", famille); }
			if (op_circonstAttr5) { op_aAttribut5.setParam("Famille_Id", famille); }
			if (op_circonstAttr6) { op_aAttribut6.setParam("Famille_Id", famille); }
		}
		
		if (op_circonstAttr1) {
			var attr1 = document.getElementById('pAttribut1').value;
			op_chargerAttributs1(attr1);
		}
		if (op_circonstAttr2) {
			var attr2 = document.getElementById('pAttribut2').value;
			op_chargerAttributs2(attr2);
		}
		if (op_circonstAttr3) {
			var attr3 = document.getElementById('pAttribut3').value;
			op_chargerAttributs3(attr3);
		}
		if (op_circonstAttr4) {
			var attr4 = document.getElementById('pAttribut4').value;
			op_chargerAttributs4(attr4);
		}
		if (op_circonstAttr5) {
			var attr5 = document.getElementById('pAttribut5').value;
			op_chargerAttributs5(attr5);
		}
		if (op_circonstAttr6) {
			var attr6 = document.getElementById('pAttribut6').value;
			op_chargerAttributs6(attr6);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function op_chargerFamilles(famille1, famille2, famille3) {
	try {
		op_chargerFamille1 = famille1;
		op_chargerFamille2 = famille2;
		op_chargerFamille3 = famille3;
		op_chargerFamilles1();
	} catch (e) {
		recup_erreur(e);
	}
}



function loadPhoto() {
  try {

		var article_id = document.getElementById('Article').value;
		document.getElementById('pVignette').setAttribute("src", "");
		document.getElementById('pVignette').setAttribute("src", getDirServeur() +"photos_articles/"+ get_cookie("Dossier_Id") +"/"+ article_id +"_small.jpg");

	} catch (e) {
    recup_erreur(e);
  }
}


function voirPhoto() {
  try {

		var article_id = document.getElementById('Article').value;

		var url = "chrome://opensi/content/facturation/user/stocks/voir_photo.xul?"+ cookie() +"&Article_Id="+ article_id;
		window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function changerPhoto() {
  try {

		var article_id = document.getElementById('Article').value;

		var url = "chrome://opensi/content/facturation/user/stocks/change_photo.xul?"+ cookie() +"&Article_Id="+ article_id;
		window.openDialog(url,'','chrome,modal,centerscreen');

		loadPhoto();

	} catch (e) {
    recup_erreur(e);
  }
}


function choixCodeNC8() {
  try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_code_nc8.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',retourChoixCodeNC8);

	} catch (e) {
    recup_erreur(e);
  }
}

function retourChoixCodeNC8(code_nc8) {
  try {

		document.getElementById('pCode_NC8').value = code_nc8;
		setModifie();

	} catch (e) {
    recup_erreur(e);
  }
}


function choixArticleSubstitution() {
  try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',retourChoixArticleSubstitution);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourChoixArticleSubstitution(article_id) {
  try {

		document.getElementById('pArticle_Substitution').value = article_id;
		setModifie();

	} catch (e) {
    recup_erreur(e);
  }
}


function afficherComposition(aff) {
  try {

		if (document.getElementById('Action').value == 'M') {
			document.getElementById('TabNomenclature').collapsed = !aff;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function afficherFichiers() {
	try {

	  var url = "chrome://opensi/content/facturation/user/recherches/rech_fichiers.xul?"+ cookie();
	  url +="&Type=Article&Document_Id="+ urlEncode(document.getElementById("Article").value);
  	window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


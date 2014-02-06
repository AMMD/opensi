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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");

var aTarifs = new Arbre('Facturation/GetRDF/tarifs_qte.tmpl', 'tarifs_qte');

var base_calcul;
var taux_tva;


function init() {
  try {

    var corps = cookie() +"&Page=Facturation/Stocks/getInfosTarifArticle.tmpl&ContentType=xml&Article_Id="+ ParamValeur("Article_Id");

    var p = requeteHTTP(corps);

    var contenu = p.responseXML.documentElement;

		document.getElementById('Prix_Revient').value = contenu.getAttribute('Prix_Revient');
		taux_tva = contenu.getAttribute('Taux_TVA');
		base_calcul = contenu.getAttribute('Base_Calcul')==1;

		initModeTarifQte();
		switchMode();
		annulerLigne();
		
		aTarifs.setParam('Article_Id', ParamValeur("Article_Id"));
		if (base_calcul) {
			aTarifs.setParam('Prix_Achat', document.getElementById('Prix_Revient').value);
		}
		aTarifs.initTree();

		var x = (screen.width / 2) - (window.outerWidth / 2);
    var y = (screen.height / 2) - (window.outerHeight / 2);
    window.moveTo(x,y);

  } catch (e) {
    recup_erreur(e);
  }
}


function ouvrirTarif() {
  try {

		tree = document.getElementById('tarifs_qte');

		if (tree.view!=null && tree.currentIndex!=-1) {
			window.arguments[0](getCellText(tree,tree.currentIndex,'ColTarif_Id'));
			window.close();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function validerLigne() {
  try {

		var article_id = ParamValeur("Article_Id");

		var quantite = document.getElementById('Quantite_Ligne').value;
		var prix = document.getElementById('Prix_Ligne').value;
		var prix_ttc = document.getElementById('Prix_Ligne_TTC').value;
		var lib_ext = document.getElementById('Lib_Ext').value;
		var lib_int = document.getElementById('Lib_Int').value;
		var coeff = document.getElementById('Coeff_Ligne').value;
		var marge = document.getElementById('Marge_Ligne').value;
		var tarif_id = document.getElementById('Tarif_Id').value;

		if (isEmpty(prix) || !isPositiveOrNull(prix)) {
			showWarning("Prix HT incorrect !");
		}
		else if (isEmpty(prix_ttc) || !isPositiveOrNull(prix_ttc) || !checkDecimal(prix_ttc,4)) {
			showWarning("Prix TTC incorrect !");
		}
		else if (isEmpty(quantite) || !isPositiveInteger(quantite)) {
			showWarning("Quantité incorrecte !");
		}
		else if (base_calcul && (isEmpty(coeff) || !isPositive(coeff))) {
			showWarning("Coefficient incorrect !");
		}
		else {

			var corps;

			if (isEmpty(tarif_id)) {
				corps = cookie() + "&Page=Facturation/Stocks/ajouterTarifQte.tmpl&ContentType=xml&Article_Id="+ urlEncode(article_id);
			}
			else {
				corps = cookie() + "&Page=Facturation/Stocks/modifierTarifQte.tmpl&ContentType=xml&Article_Id="+ urlEncode(article_id) +"&Tarif_Id="+ tarif_id;
			}

			corps += "&Quantite="+ quantite +"&Prix="+ prix +"&Lib_Ext="+ urlEncode(lib_ext) +"&Lib_Int="+ urlEncode(lib_int) +"&Coeff="+ coeff;
			corps += "&Marge="+ marge +"&Prix_TTC="+ prix_ttc;
			requeteHTTP(corps);

			aTarifs.initTree();

			annulerLigne();
		}

  } catch (e) {
  	recup_erreur(e);
	}
}


function switchMode() {
  try {

		var b = !document.getElementById('SwitchMode').checked;

		document.getElementById('boxBoutons').collapsed = b;
		document.getElementById('boxLigne').collapsed = b;
		document.getElementById('boxRevient').collapsed = b;

	} catch (e) {
  	recup_erreur(e);
	}
}


function initModeTarifQte() {
  try {

		document.getElementById('ColMarge').collapsed = !base_calcul;
		document.getElementById('ColCoeff').collapsed = !base_calcul;
		document.getElementById('Marge_Ligne').collapsed = !base_calcul;
		document.getElementById('Coeff_Ligne').collapsed = !base_calcul;
		document.getElementById('Prix_Revient').collapsed = !base_calcul;
		document.getElementById('lblPrix_Revient').collapsed = !base_calcul;

	} catch (e) {
  	recup_erreur(e);
	}
}


function annulerLigne() {
  try {

		document.getElementById('Lib_Int').value = "";
		document.getElementById('Lib_Ext').value = "";
		document.getElementById('Quantite_Ligne').value = "";
		document.getElementById('Prix_Ligne').value = "";
		document.getElementById('Marge_Ligne').value = "";
		document.getElementById('Coeff_Ligne').value = "";
		document.getElementById('Prix_Ligne_TTC').value = "";
		document.getElementById('Tarif_Id').value = "";
		document.getElementById('bSupprimer').disabled = true;

	} catch (e) {
  	recup_erreur(e);
	}
}


function calculerLigne(t) {
  try {

		var nf5 = new NumberFormat("0.######", false);
		var nf = new NumberFormat("0.00", false);

		var tva = parseFloat(taux_tva)/100 + 1;

		var pr = document.getElementById('Prix_Revient').value;

		if (t=="h") {
			var pvht = parseFloat(document.getElementById('Prix_Ligne').value);
			document.getElementById('Coeff_Ligne').value = nf5.format(pvht / pr);
			document.getElementById('Prix_Ligne_TTC').value = nf.format(pvht * tva);
			document.getElementById('Marge_Ligne').value = (pvht==0?100:nf.format((pvht-pr)/pvht * 100));
		}
		else if (t=="c") {
			var pvht = parseFloat(document.getElementById('Coeff_Ligne').value) * pr;
			document.getElementById('Prix_Ligne').value = nf.format(pvht);
			document.getElementById('Prix_Ligne_TTC').value = nf.format(pvht * tva);
			document.getElementById('Marge_Ligne').value = (pvht==0?100:nf.format((pvht-pr)/pvht * 100));
		}
		else if (t=="t") {
			var pvht = parseFloat(document.getElementById('Prix_Ligne_TTC').value) / tva;
			document.getElementById('Prix_Ligne').value = nf.format(pvht);
			document.getElementById('Coeff_Ligne').value = nf5.format(pvht / pr);
			document.getElementById('Marge_Ligne').value = (pvht==0?100:nf.format((pvht-pr)/pvht * 100));
		}
		else if (t=="m") {

			if (parseFloat(document.getElementById('Marge_Ligne').value)>=100) {
				showWarning("Le pourcentage de marge doit être inférieur à 100 % !");
			}
			else {
				var pvht = pr / (1 - parseFloat(document.getElementById('Marge_Ligne').value)/100);
				document.getElementById('Prix_Ligne').value = nf.format(pvht);
				document.getElementById('Coeff_Ligne').value = (pr==0?0:nf5.format(pvht / pr));
				document.getElementById('Prix_Ligne_TTC').value = nf.format(pvht * tva);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function reporterLigne() {
  try {

		var tree = document.getElementById('tarifs_qte');

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById('Lib_Int').value = getCellText(tree,tree.currentIndex,'ColLibInt');
			document.getElementById('Lib_Ext').value = getCellText(tree,tree.currentIndex,'ColLibExt');
			document.getElementById('Quantite_Ligne').value = getCellText(tree,tree.currentIndex,'ColQuantite');
			document.getElementById('Prix_Ligne').value = getCellText(tree,tree.currentIndex,'ColHT');
			document.getElementById('Marge_Ligne').value = getCellText(tree,tree.currentIndex,'ColMarge');
			document.getElementById('Coeff_Ligne').value = getCellText(tree,tree.currentIndex,'ColCoeff');
			document.getElementById('Prix_Ligne_TTC').value = getCellText(tree,tree.currentIndex,'ColTTC');
			document.getElementById('Tarif_Id').value = getCellText(tree,tree.currentIndex,'ColTarif_Id');
			document.getElementById('bSupprimer').disabled = false;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}

function supprimerLigne() {
  try {

		var tarif_id = document.getElementById("Tarif_Id").value;

		if (window.confirm("Supprimer la ligne de tarif ?")) {

    	var corps = cookie() +"&Page=Facturation/Stocks/supprimerTarifQte.tmpl&ContentType=xml&Tarif_Id="+ tarif_id;
    	requeteHTTP(corps);

    	aTarifs.initTree();
			annulerLigne();
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


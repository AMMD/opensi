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

var mode = "C";
var aFA = new Arbre("Facturation/GetRDF/liste_fournisseurs_article.tmpl", "farticle");


function initFournisseurs() {
	try {

		nouveauFournisseur();

		aFA.setParam("Article_Id", document.getElementById('Article').value);
		aFA.initTree();

  } catch (e) {
    recup_erreur(e);
  }
}


function reporterRefFabricant() {
	try {
		
		document.getElementById('Ref_Fournisseur').value = document.getElementById('pRef_Fabricant').value;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function reporterFournisseur() {
	try {

		var tree = document.getElementById('farticle');

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById('Fournisseur_Id').value = getCellText(tree, tree.currentIndex, 'ColFournisseur_Id');
			document.getElementById('Principal').checked = (getCellText(tree, tree.currentIndex, 'ColPrincipal')=="1");
			document.getElementById('Principal').disabled = (getCellText(tree, tree.currentIndex, 'ColPrincipal')=="1");
			document.getElementById('Delai_Reappro').value = getCellText(tree, tree.currentIndex, 'ColDelai_Reappro');
			document.getElementById('Ref_Fournisseur').value = getCellText(tree, tree.currentIndex, 'ColRef_Fournisseur');
			document.getElementById('Qte_Minimum').value = getCellText(tree, tree.currentIndex, 'ColQte_Minimum');
			document.getElementById('Multiple').value = getCellText(tree, tree.currentIndex, 'ColMultiple');
			document.getElementById('Frais_Logistiques').value = getCellText(tree, tree.currentIndex, 'ColFrais_Logistiques');
			document.getElementById('Pack').value = getCellText(tree, tree.currentIndex, 'ColPack');
			document.getElementById('of-Prix_Achat').value = getCellText(tree, tree.currentIndex, 'ColPrix_Achat');
			document.getElementById('stockFournisseur').value = getCellText(tree, tree.currentIndex, 'colStockFournisseur');
			document.getElementById('bRechFourn').collapsed = true;
			document.getElementById('bSupprimerFournisseur').collapsed = false;

			mode = "M";
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function rechercherFournisseur() {
	try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherFournisseur);

		var fournisseur_id = document.getElementById('Fournisseur_Id').value;

		if (!isEmpty(fournisseur_id)) {
			var qDelai = new QueryHttp("Facturation/Stocks/getDelaiDefaut.tmpl");
			qDelai.setParam("Fournisseur_Id", fournisseur_id);
			var result = qDelai.execute();
			document.getElementById('Delai_Reappro').value = result.responseXML.documentElement.getAttribute('Delai');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function retourRechercherFournisseur(codeFournisseur) {
	try {
		document.getElementById('Fournisseur_Id').value = codeFournisseur;
		document.getElementById('Action').value = (isEmpty(codeFournisseur)?"C":"M");
	} catch (e) {
		recup_erreur(e);
	}
}


function nouveauFournisseur() {
	try {

		document.getElementById('Fournisseur_Id').value = "";
		document.getElementById('Principal').checked = false;
		document.getElementById('Principal').disabled = false;
		document.getElementById('Delai_Reappro').value = "0";
		document.getElementById('Ref_Fournisseur').value = "";
		document.getElementById('Qte_Minimum').value = 0;
		document.getElementById('Multiple').value = 0;
		document.getElementById('Frais_Logistiques').value = 0;
		document.getElementById('Pack').value = 1;
		document.getElementById('of-Prix_Achat').value = "";
		document.getElementById('stockFournisseur').value = "";
		document.getElementById('bRechFourn').collapsed = false;
		document.getElementById('bSupprimerFournisseur').collapsed = true;
		aFA.select(-1);
		mode = "C";

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerFournisseur() {
  try {

		var fournisseur_id = document.getElementById('Fournisseur_Id').value;
		var article_id = document.getElementById('Article').value;
		var ref_fournisseur = document.getElementById('Ref_Fournisseur').value;
		var prix_achat = document.getElementById('of-Prix_Achat').value;
		var delai_reappro = document.getElementById('Delai_Reappro').value;
		var qte_minimum = document.getElementById('Qte_Minimum').value;
		var multiple = document.getElementById('Multiple').value;
		var frais_logistiques = document.getElementById('Frais_Logistiques').value;
		var pack = document.getElementById('Pack').value;
		var principal = (document.getElementById('Principal').checked?"1":"0");
		var existe = false;

		var qSaveFA;

		if (mode=="C") {
			var qExFA = new QueryHttp("Facturation/Stocks/existeFournisseurArticle.tmpl");
			qExFA.setParam("Article_Id", article_id);
			qExFA.setParam("Fournisseur_Id", fournisseur_id);
			var result = qExFA.execute();
			existe = (result.responseXML.documentElement.getAttribute('existe')=="true");
			qSaveFA = new QueryHttp("Facturation/Stocks/ajouterFournisseurArticle.tmpl");
		}
		else {
			qSaveFA = new QueryHttp("Facturation/Stocks/modifierFournisseurArticle.tmpl");
		}

				 if (existe) { showWarning("Ce fournisseur est déjà fournisseur de cet article !"); }
		else if (isEmpty(fournisseur_id)) { showWarning("Veuillez spécifier un fournisseur !"); }
		else if (isEmpty(delai_reappro)) { showWarning("Veuillez spécifier un délai de réapprovisionnement !"); }
		else if (isEmpty(prix_achat)) { showWarning("Veuillez spécifier un prix d'achat !"); }
		else if (isEmpty(ref_fournisseur)) { showWarning("Veuillez spécifier la référence de l'article chez ce fournisseur !"); }
		else if (!isPositiveOrNull(prix_achat)) { showWarning("Prix d'achat incorrect !"); }
		else if (!isPositiveOrNull(delai_reappro)) { showWarning("Délai de réappro. incorrect !"); }
		else if (!isPositiveOrNull(qte_minimum)) { showWarning("Quantité minimale de commande incorrecte !"); }
		else if (!isPositiveOrNull(multiple)) { showWarning("Multiple de commande incorrecte !"); }
		else if (!isPositiveOrNull(frais_logistiques)) { showWarning("Frais logistiques incorrects !"); }
		else if (!isPositiveInteger(pack)) { showWarning("Quantité du pack incorrecte !"); }
		else {

			qSaveFA.setParam('Article_Id', article_id);
			qSaveFA.setParam('Fournisseur_Id', fournisseur_id);
			qSaveFA.setParam('Ref_Fournisseur', ref_fournisseur);
			qSaveFA.setParam('Prix_Achat', prix_achat);
			qSaveFA.setParam('Principal', principal);
			qSaveFA.setParam('Delai_Reappro', delai_reappro);
			qSaveFA.setParam('Qte_Minimum', qte_minimum);
			qSaveFA.setParam('Multiple', multiple);
			qSaveFA.setParam('Frais_Logistiques', frais_logistiques);
			qSaveFA.setParam('Pack', pack);
			qSaveFA.execute();

			nouveauFournisseur();

			aFA.initTree();
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function supprimerFournisseur() {
  try {

  	if (!document.getElementById('Principal').checked) {

			var qSupFournArt = new QueryHttp("Facturation/Stocks/enleverFournisseurArticle.tmpl");
			qSupFournArt.setParam('Article_Id', document.getElementById('Article').value);
			qSupFournArt.setParam('Fournisseur_Id', document.getElementById('Fournisseur_Id').value);
			qSupFournArt.execute();

			nouveauFournisseur();

			aFA.initTree();
  	}
		else {
			showWarning("Impossible de supprimer le fournisseur car c'est le fournisseur principal de l'article !");
		}

  } catch (e) {
    recup_erreur(e);
  }
}


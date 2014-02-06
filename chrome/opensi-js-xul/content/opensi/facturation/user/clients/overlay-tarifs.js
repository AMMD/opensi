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


var mode_ligne;
var aTarifs = new Arbre("Facturation/GetRDF/tarifs_client.tmpl", "tree-tarifs");


function initTarifs() {
  try {

		formatLigne("N");

		document.getElementById('Reference').value = "";
		document.getElementById('Designation').value = "";
		document.getElementById('Prix_Achat').value = "";
		document.getElementById('Taux_TVA').value = "";
		document.getElementById('Prix_HT').value = "";
		document.getElementById('Prix_TTC').value = "";
		document.getElementById('Coeff').value = "";
		document.getElementById('Marge').value = "";
		document.getElementById('BasePrix_HT').value = "";
		document.getElementById('BasePrix_TTC').value = "";

		aTarifs.setParam("Client_Id", currentClient);
		aTarifs.initTree();

  } catch (e) {
    recup_erreur(e);
  }
}


function validerTarif() {
  try {

		var article_id = document.getElementById('Reference').value;
		var prix_ht = parseFloat(document.getElementById('Prix_HT').value);
		var prix_ttc = parseFloat(document.getElementById('Prix_TTC').value);
		var marge = parseFloat(document.getElementById('Marge').value);
		
		var coeff = parseFloat(document.getElementById('Coeff').value);

		if (isEmpty(prix_ht) || !isPositiveOrNull(prix_ht) || !checkDecimal(prix_ht,4)) {
			showWarning("Prix de vente HT incorrect !");
		}
		else if (isEmpty(prix_ttc) || !isPositiveOrNull(prix_ttc) || !checkDecimal(prix_ttc,4)) {
			showWarning("Prix de vente TTC incorrect !");
		}
		else if (isEmpty(coeff) || (coeff<-100) || (coeff>100) || !checkDecimal(coeff,5)) {
			showWarning("Coefficient incorrect !");
		}
		else if (isEmpty(marge) || !isTaux(marge) || (marge==100) || !checkDecimal(marge,2)) {
			showWarning("Taux de marge incorrect !");
		}
		else {
			
			var new_coeff = (coeff>=0?1+coeff/100:1-(Math.abs(coeff)/100));

			var corps = cookie() +"&Page=Facturation/Clients/"+ (mode_ligne=="C"?"creerArticleTarif.tmpl":"modifierArticleTarif.tmpl") +"&ContentType=xml";
			corps += "&Client_Id="+ urlEncode(currentClient) +"&Article_Id="+ urlEncode(article_id) +"&Prix_HT="+ prix_ht +"&Prix_TTC="+ prix_ttc +"&Coeff="+ new_coeff +"&Marge="+ marge;

			requeteHTTP(corps, new XMLHttpRequest(), validerTarif_2);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function validerTarif_2() {
  try {

		formatLigne("M");

		aTarifs.initTree();

	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerTarif() {
  try {

  	if (window.confirm("Voulez-vous supprimer ce tarif spécifique ?")) {
			var article_id = document.getElementById('Reference').value;
	
			var corps = cookie() +"&Page=Facturation/Clients/supprimerArticleTarif.tmpl&ContentType=xml&Article_Id="+ urlEncode(article_id);
			corps += "&Client_Id="+ urlEncode(currentClient);
	
			requeteHTTP(corps, new XMLHttpRequest(), supprimerTarif_2);
  	}
  	
	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerTarif_2() {
  try {

		formatLigne("N");

		document.getElementById('Reference').value = "";
		document.getElementById('Designation').value = "";
		document.getElementById('Prix_Achat').value = "";
		document.getElementById('Taux_TVA').value = "";
		document.getElementById('Prix_HT').value = "";
		document.getElementById('Prix_TTC').value = "";
		document.getElementById('Coeff').value = "";
		document.getElementById('Marge').value = "";
		document.getElementById('BasePrix_HT').value = "";
		document.getElementById('BasePrix_TTC').value = "";

		aTarifs.initTree();

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauTarif() {
  try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherStock);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourRechercherStock(reference) {
	try {

		document.getElementById('Reference').value = reference;

		if (!isEmpty(reference)) {

			if (existeTarifClient(reference)) {
				showWarning("Cet article est déjà présent dans la liste");
			}
			else {

		  	var corps = cookie() +"&Page=Facturation/Clients/getArticleTarif.tmpl&ContentType=xml&Article_Id="+ urlEncode(reference) +"&Client_Id="+ urlEncode(currentClient);

				requeteHTTP(corps, new XMLHttpRequest(), nouveauTarif_2);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauTarif_2(httpRequest) {
  try {

		var nf = new NumberFormat("0.00##", true);

		var contenu = httpRequest.responseXML.documentElement;

		document.getElementById('Designation').value = contenu.getAttribute('Designation');
		document.getElementById('Prix_Achat').value = nf.format(contenu.getAttribute('Prix_Achat'));
		document.getElementById('Taux_TVA').value = contenu.getAttribute('Taux_TVA');

		document.getElementById('Prix_HT').value = "";
		document.getElementById('Prix_TTC').value = "";
		document.getElementById('Coeff').value = "";
		document.getElementById('Marge').value = "";
		document.getElementById('BasePrix_HT').value = nf.format(contenu.getAttribute('BasePrix_HT'));
		document.getElementById('BasePrix_TTC').value = nf.format(contenu.getAttribute('BasePrix_TTC'));
		
		var pr = parseFloat(contenu.getAttribute('Prix_Achat'));
		if (pr==0) {
			showWarning("Aucune opération n'est possible sur cet article car le prix d'achat est à 0 !");
			formatLigne("N");
		} else {
			formatLigne("C");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function reporterTarif() {
  try {

		var nf = new NumberFormat("0.00##", false);

		var tree = document.getElementById('tree-tarifs');

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById('Reference').value = getCellText(tree,tree.currentIndex,'ColArticle_Id');
			document.getElementById('Designation').value = getCellText(tree,tree.currentIndex,'ColDesignation');
			document.getElementById('Prix_Achat').value = getCellText(tree,tree.currentIndex,'ColPrix_Achat');
			document.getElementById('Prix_HT').value = nf.format(getCellText(tree,tree.currentIndex,'ColPrix_HT'));
			document.getElementById('Taux_TVA').value = getCellText(tree,tree.currentIndex,'ColTaux_TVA');
			document.getElementById('Prix_TTC').value = nf.format(getCellText(tree,tree.currentIndex,'ColPrix_TTC'));
			document.getElementById('Coeff').value = getCellText(tree,tree.currentIndex,'ColCoeff');
			document.getElementById('BasePrix_HT').value = getCellText(tree,tree.currentIndex,'ColTarif_HT');
			document.getElementById('BasePrix_TTC').value = getCellText(tree,tree.currentIndex,'ColTarif_TTC');
			document.getElementById('Marge').value = getCellText(tree,tree.currentIndex,'ColMarge');
			
			formatLigne("M");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function existeTarifClient(article_id) {
  try {

		var corps = cookie() +"&Page=Facturation/Clients/existeTarifClient.tmpl&ContentType=xml&Client_Id="+ urlEncode(currentClient) +"&Article_Id="+ urlEncode(article_id);
		var p = requeteHTTP(corps);

 		return p.responseXML.documentElement.getAttribute('existe')=="true";

  } catch (e) {
    recup_erreur(e);
  }
}


function calculerTarif(t) {
  try {

		var saisieOk = true;
		var pr = parseFloat(document.getElementById('Prix_Achat').value);
		if (pr==0) {
			saisieOk = false;
		} else {
			var nf2 = new NumberFormat("0.00", false);
			var nf4 = new NumberFormat("0.00##", false);
			var nf5 = new NumberFormat("0.#####", false);
	
			var tva = parseFloat(document.getElementById('Taux_TVA').value)/100 + 1;
			var anTarif = parseFloat(document.getElementById('BasePrix_HT').value);

			if (t=="h") {
				if (isEmpty(document.getElementById('Prix_HT').value) || isNaN(document.getElementById('Prix_HT').value)) {
					saisieOk = false;
				} else {
					var pvht = parseFloat(document.getElementById('Prix_HT').value);
					var pourcPV = (pvht>=anTarif?(pvht/anTarif -1) * 100:(anTarif/pvht -1) * (-100));
					document.getElementById('Prix_TTC').value = nf4.format(pvht * tva);
					document.getElementById('Coeff').value = nf5.format(pourcPV);
					document.getElementById('Marge').value = nf2.format(pvht==0?100:((pvht-pr)/pvht * 100));
				}
			}
			else if (t=="t") {
				if (isEmpty(document.getElementById('Prix_TTC').value) || isNaN(document.getElementById('Prix_TTC').value)) {
					saisieOk = false;
				} else {
					var pvht = parseFloat(document.getElementById('Prix_TTC').value) / tva;
					var pourcPV = (pvht>=anTarif?(pvht/anTarif -1) * 100:(anTarif/pvht -1) * (-100));
					document.getElementById('Prix_HT').value = nf4.format(pvht);
					document.getElementById('Coeff').value = nf5.format(pourcPV);
					document.getElementById('Marge').value = nf2.format(pvht==0?100:((pvht-pr)/pvht * 100));
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
						document.getElementById('Marge').value = nf2.format(pvht==0?100:((pvht-pr)/pvht * 100));
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
		}
		
		if (!saisieOk) {
			document.getElementById('Prix_HT').value = "";
			document.getElementById('Prix_TTC').value = "";
			document.getElementById('Coeff').value = "";
			document.getElementById('Marge').value = "";
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function formatLigne(typeLigne) {
  try {

		mode_ligne = typeLigne;

		if (typeLigne=="C") {
			document.getElementById('bSupprimerTarif').disabled = true;
			document.getElementById('bValiderTarif').disabled = false;
			document.getElementById('Prix_HT').disabled = false;
			document.getElementById('Prix_TTC').disabled = false;
			document.getElementById('Coeff').disabled = false;
			document.getElementById('Marge').disabled = false;
		}
		else if (typeLigne=="M") {
			document.getElementById('bSupprimerTarif').disabled = false;
			document.getElementById('bValiderTarif').disabled = false;
			document.getElementById('Prix_HT').disabled = false;
			document.getElementById('Prix_TTC').disabled = false;
			document.getElementById('Coeff').disabled = false;
			document.getElementById('Marge').disabled = false;
		}
		else {
			document.getElementById('bSupprimerTarif').disabled = true;
			document.getElementById('bValiderTarif').disabled = true;
			document.getElementById('Prix_HT').disabled = true;
			document.getElementById('Prix_TTC').disabled = true;
			document.getElementById('Coeff').disabled = true;
			document.getElementById('Marge').disabled = true;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function traitement_lot() {
	try {

		var url = "chrome://opensi/content/facturation/user/clients/traitement_lot.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',currentClient,recharge_arbre);

	}	catch(e) {
		recup_erreur(e);
	}
}


function recharge_arbre() {
	try {

		aTarifs.initTree();

	}	catch(e) {
		recup_erreur(e);
	}
}


function change_affiche() {
	try {

		var ledeck = document.getElementById("switchboite");
		var lebouton = document.getElementById("changeur_affiche");
		if (ledeck.selectedIndex == 0) {
			lebouton.setAttribute("label","Afficher Tableau");
			lebouton.setAttribute("class","");
			ledeck.selectedIndex = 1;
			document.getElementById('bRAZ').collapsed = true;
			document.getElementById('bTraitementLot').collapsed = true;
			init_pdf();
		}
		else {
			lebouton.setAttribute("label","Editer les tarifs spécifiques");
			lebouton.setAttribute("class","bPDF");
			ledeck.selectedIndex = 0;
			document.getElementById('bRAZ').collapsed = false;
			document.getElementById('bTraitementLot').collapsed = false;
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function razTarifs() {
	try {
		if (confirm("Etes-vous sûr de vouloir supprimer tous les tarifs spécifiques de ce client ?")) {
			var qRaz = new QueryHttp("Facturation/Clients/supprimerTarifsSpecifiques.tmpl");
			qRaz.setParam("Client_Id", currentClient);
			qRaz.execute();
			
			showWarning("Les tarifs spécifiques ont été supprimés !");
			
			formatLigne("N");
			document.getElementById('Reference').value = "";
			document.getElementById('Designation').value = "";
			document.getElementById('Prix_Achat').value = "";
			document.getElementById('Taux_TVA').value = "";
			document.getElementById('Prix_HT').value = "";
			document.getElementById('Prix_TTC').value = "";
			document.getElementById('Coeff').value = "";
			document.getElementById('Marge').value = "";
			document.getElementById('BasePrix_HT').value = "";
			document.getElementById('BasePrix_TTC').value = "";
			aTarifs.initTree();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function init_pdf() {
	try {

		var page = cookie() +"&Page=Facturation/Clients/redirectPdfMajTarifsSpe.tmpl&Client_Id="+ urlEncode(currentClient);
		document.getElementById("pdf").setAttribute("src",getUrlOpeneas(page));

	}	catch(e) {
		recup_erreur(e);
	}
}



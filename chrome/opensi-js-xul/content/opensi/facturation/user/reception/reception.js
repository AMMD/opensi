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


var Prep_Id;
var fournId;
var typeEdition;

var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
var qCreerPrep = new QueryHttp("Facturation/Reception/creerPrep.tmpl");
var qExArtValider = new QueryHttp("Facturation/Reception/ajouterArticle.tmpl");
var qExArtSupprimer = new QueryHttp("Facturation/Reception/supprimerArticle.tmpl");
var PrepValider = new QueryHttp("Facturation/Reception/validerPrep.tmpl");
var queryPrepSuppr = new QueryHttp("Facturation/Reception/supprimerPrep.tmpl");

var aPrepReceptions = new Arbre("Facturation/Reception/liste-prepReceptions.tmpl", "listePrepRecep");
var treeArticles = new Arbre("Facturation/GetRDF/liste_bon_preparation_reception.tmpl","bon_reception");

var aAttRecep = new Arbre("Facturation/GetRDF/liste-articlesAttenteReception.tmpl", "tree-attRecep");
var aFournisseursAtt = new Arbre("Facturation/Reception/liste-fournisseursReliquats.tmpl", "FournisseurAtt");
var aRecus = new Arbre("Facturation/GetRDF/liste-articlesRecus.tmpl", "tree-recus");

// effectuer un traitement lorsque l'utilisateur clique sur un bouton radio pour le fournisseur ?
var bActionFournisseur = false;

var artAttCharge = false;
var bonChiffreDefaut;


function init() {
  try {
  	var qBRChiffre = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qBRChiffre.execute();
		bonChiffreDefaut = (result.responseXML.documentElement.getAttribute("BR_Chiffre") == "1");

		Prep_Id = "0";
		majFournisseurId();
  	document.getElementById('deck').selectedIndex = 0;
		document.getElementById('Fournisseur').selectedIndex = 0;
		document.getElementById('CodeFournisseur').value = 0;
		bActionFournisseur = true;
		
		aPrepReceptions.initTree(initPrepReception);

  } catch (e) {
    recup_erreur(e);
  }
}


function initPrepReception() {
	try {
		document.getElementById('listePrepRecep').value = Prep_Id;
		pressOnListePrepRecep();
	} catch (e) {
		recup_erreur(e);
	}
}


function initInterfacePrep() {
	try {
		document.getElementById('Num_BL').value = "";
		document.getElementById('Article_Id').value = "";
		document.getElementById('Quantite').value = "1";
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnListePrepRecep() {
	try {
		Prep_Id = document.getElementById('listePrepRecep').value;
		majFournisseurId();
		
		document.getElementById('bSupprimerPrep').disabled = (Prep_Id=="0");
		document.getElementById('Num_BL').disabled = (Prep_Id=="0");
		document.getElementById('Article_Id').disabled = (Prep_Id=="0");
		document.getElementById('bCodeBarre').disabled = (Prep_Id=="0");
		document.getElementById('bArticle').disabled = (Prep_Id=="0");
		document.getElementById('Quantite').disabled = (Prep_Id=="0");
		document.getElementById('recep_unitaire').disabled = (Prep_Id=="0");
		
		initInterfacePrep();
		if (Prep_Id=="0") {
			treeArticles.deleteTree();
			document.getElementById('bSupprimerLigne').disabled = true;
			document.getElementById('bValiderPrep').disabled = true;
		} else {
			treeArticles.setParam("Prep_Id", Prep_Id);
			treeArticles.initTree(initTreeArticle);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnArtAtt() {
	try {
		if (!artAttCharge) {
			artAttCharge=true;
			aFournisseursAtt.initTree(initFournisseurAtt);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function initFournisseurAtt() {
	try {
		document.getElementById('FournisseurAtt').selectedIndex = 0;
		chargerAttenteReception();
	} catch (e) {
		recup_erreur(e);
	}
}


function rechercherFournisseur() {
	try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie();
		url += "&Nouv=false&Bloque=true";
		window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherFournisseur);

	} catch (e) {
		recup_erreur(e);
  }
}


function retourRechercherFournisseur(codeFournisseur) {
	try {
		qCreerPrep.setParam("Fournisseur_Id", codeFournisseur);
		var result = qCreerPrep.execute();
		Prep_Id = result.responseXML.documentElement.getAttribute("Prep_Id");
		majFournisseurId();
		
		aPrepReceptions.initTree(initPrepReception);
	} catch (e) {
		recup_erreur(e);
	}
}


function majFournisseurId() {
	try {
		fournId = "";
		if (Prep_Id!="0") {
			var qFourn = new QueryHttp("Facturation/Reception/getFournisseurId.tmpl");
			qFourn.setParam("Prep_Id", Prep_Id);
			var result = qFourn.execute();
			fournId = result.responseXML.documentElement.getAttribute("Fournisseur_Id");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function verifPrepRecep() {
	try {
		var qVerif = new QueryHttp("Facturation/Reception/verifPrep.tmpl");
		qVerif.setParam("Prep_Id", Prep_Id);
		var result = qVerif.execute();
		var ok = (result.responseXML.documentElement.getAttribute("Code_Erreur")=="0");
		if (!ok) {
			showWarning("Impossible de modifier la réception : un autre utilisateur travaille dessus.");
			init();
		}
		return ok;
	} catch (e) {
		recup_erreur(e);
	}
}


function rechercherArticle() {
	try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		url +="&Article_Id="+document.getElementById('Article_Id').value;
		if (!isEmpty(fournId)) { url +="&Fournisseur="+ urlEncode(fournId); }
   	window.openDialog(url,'','chrome,modal,centerscreen', retourRechercherArticle);

	} catch (e) {
		recup_erreur(e);
  }
}


function retourRechercherArticle(reference) {
	try {
		document.getElementById('Article_Id').value = reference;
		rechercherReference();
	} catch (e) {
    recup_erreur(e);
  }
}


function associerCodeBarre() {
	try {

		var articleId = document.getElementById('Article_Id').value;
		if (isEmpty(articleId)) {
			showWarning("Veuillez saisir un code barre !");
		}
		else if (articleId.length>15) {
			showWarning("Le code barre saisi est trop long !");
		}
		else {
			var url = "chrome://opensi/content/facturation/user/reception/popup-associerCodeBarre.xul?"+ cookie();
    	window.openDialog(url,'','chrome,modal,centerscreen', articleId);
			rechercherReference();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function keypress(e,id) {
	try {

		if (e.keyCode==13) {
			if (id=="Article_Id") {
				rechercherReference();
			} else if (id=="Quantite"){
				validerLigne();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function rechercherReference() {
	try {

		qExArt.setParam('Reference',document.getElementById('Article_Id').value);
		var result = qExArt.execute();
		var articleId = result.responseXML.documentElement.getAttribute("Article_Id");

		if (!isEmpty(articleId)) {
			document.getElementById('Article_Id').value = articleId;
			if (document.getElementById('recep_unitaire').checked) {
				document.getElementById('Quantite').value=1;
				validerLigne();
			}
			else {
				document.getElementById('Quantite').select();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function changerTypeQuantite(unitaire) {
  try {
		document.getElementById('Quantite').disabled=unitaire;
		document.getElementById('Quantite').value="1";
		document.getElementById("Article_Id").focus();
  } catch (e) {
    recup_erreur(e);
  }
}


function validerLigne() {
	try {
	
		if (verifPrepRecep()) {
			var quantite = document.getElementById('Quantite').value;
			if (!checkQte(quantite)) { showWarning("Quantité incorrecte !"); }
			else {
				qExArtValider.setParam('Prep_Id',Prep_Id);
				qExArtValider.setParamById('Article_Id',"Article_Id");
				qExArtValider.setFullParamById('Quantite');
				var result = qExArtValider.execute();
				var ok = true;
	
				var reponse = result.responseXML.documentElement.getAttribute("reponse");
				if (reponse=="aucune"){
					showWarning("Aucune commande ne correspond à votre réception.");
					ok = false;
				}
				else if (reponse=="noncommande") {
					showWarning("Vous ne pouvez pas réceptionner plus que ce que vous attendez. L'excédent n'a donc pas été pris en compte.");
				}
				else if (reponse!="ok") {
					showWarning("Erreur lors de la réception.");
					ok = false;
				}
				
				if (ok) {
					initInterfacePrep();
					treeArticles.initTree(initTreeArticle);
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnBonReception() {
	try {
		document.getElementById('bSupprimerLigne').disabled=false;
	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerLigne() {
	try {

		if (verifPrepRecep()) {
			var tree = document.getElementById('bon_reception');
			if (tree.view!=null && tree.currentIndex!=-1) {
				qExArtSupprimer.setParam('Prep_Id',Prep_Id);
				qExArtSupprimer.setParam('Commande_Id',getCellText(tree,tree.currentIndex, 'Num_Com'));
				qExArtSupprimer.setParam('Article_Id',getCellText(tree,tree.currentIndex, 'Article_Id'));
				qExArtSupprimer.execute();
	
				treeArticles.initTree(initTreeArticle);
			}
			else {
				showWarning("Veuillez sélectionner une ligne !");
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function initTreeArticle() {
	try {
		document.getElementById('bSupprimerLigne').disabled=true;
		document.getElementById('bValiderPrep').disabled = (treeArticles.nbLignes()==0);
		document.getElementById("Article_Id").focus();
	} catch (e) {
		recup_erreur(e);
	}
}



function SupprimerPrepBR() {
	try {
		
		if (verifPrepRecep()) {
			var fournisseurId = document.getElementById('listePrepRecep').getAttribute("label");
	
			if (confirm("Etes vous sûr de vouloir supprimer la préparation des bons de réception pour le fournisseur "+ fournisseurId +" ?")) {
				queryPrepSuppr.setParam('Prep_Id',Prep_Id);
				queryPrepSuppr.execute();
				
				Prep_Id="0";
				majFournisseurId();
				aPrepReceptions.initTree(initPrepReception);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerAttenteReception() {
	try {
		
		document.getElementById('bEditerReliquats').disabled = true;
		document.getElementById('bEditerArtAtt').disabled = true;

		if (document.getElementById('FournisseurAtt').selectedIndex!=0) {
			var fournisseurId = document.getElementById('FournisseurAtt').value;
			aAttRecep.setParam("Fournisseur_Id", fournisseurId);
			aAttRecep.initTree(initListeArtAttRecep);
		} else {
			aAttRecep.deleteTree();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function initListeArtAttRecep() {
	try {
		
		if (aAttRecep.nbLignes()>0) {
			document.getElementById('bEditerReliquats').disabled = false;
			document.getElementById('bEditerArtAtt').disabled = false;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}



function pressOnDateDebut(ev) {
  try {

    if (ev.keyCode==13) {
			rechercherArticlesRecus();
    }

  } catch (e) {
    recup_erreur(e);
  }
}

function pressOnDateFin(ev) {
  try {

    if (ev.keyCode==13) {
			rechercherArticlesRecus();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnFournisseur() {
	try {
		document.getElementById('CodeFournisseur').value = 0; // réinitialisation du code fournisseur
		if (document.getElementById('Fournisseur').selectedIndex==0) {
			rechercherArticlesRecus();
		} else {
			var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?" + cookie() + "&Nouv=false";
			window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherFournisseur2);

			var code_fournisseur = document.getElementById('CodeFournisseur').value;

			if (code_fournisseur == 0) {
				bActionFournisseur = false; // ignorer l'événement de sélection du bouton radio...
				document.getElementById('Fournisseur').selectedItem.label = "Choisir un fournisseur";
				document.getElementById('Fournisseur').selectedIndex = 0;
				bActionFournisseur = true; // ...jusqu'ici
			} else {
				// récupérer la raison sociale du fournisseur
				var qFourn = new QueryHttp("Facturation/Fournisseurs/getFournisseur.tmpl");
				qFourn.setParam('Fournisseur_Id', code_fournisseur);
				var result = qFourn.execute();
				document.getElementById('Fournisseur').selectedItem.label = result.responseXML.documentElement.getAttribute('Denomination');
				rechercherArticlesRecus();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function retourRechercherFournisseur2(codeFournisseur) {
	try {
		document.getElementById('CodeFournisseur').value = codeFournisseur;
	} catch (e) {
		recup_erreur(e);
	}
}


function rechercherArticlesRecus() {
  try {
		if (bActionFournisseur) {
			if (isEmpty(document.getElementById('Date_Debut').value)) {
				showWarning("Veuillez saisir une date de début !");
			} else if (!isDate(document.getElementById('Date_Debut').value)) {
				showWarning("Date de début incorrecte !");
			} else if (!isEmpty(document.getElementById('Date_Fin').value) && !isDate(document.getElementById('Date_Fin').value)) {
				showWarning("Date de fin incorrecte !");
			} else if (!isEmpty(document.getElementById('Date_Fin').value) && !isDateInterval(document.getElementById('Date_Debut').value, document.getElementById('Date_Fin').value)) {
				showWarning("La date de fin doit être supérieure à la date de début !");
			} else {
				var date_debut = prepareDateJava(document.getElementById('Date_Debut').value);
				var code_fournisseur = document.getElementById('CodeFournisseur').value;
				
				document.getElementById('bEditerArtRecus').disabled = true;
				aRecus.clearParams();
				aRecus.setParam('Date_Debut', date_debut);
				if (!isEmpty(document.getElementById('Date_Fin').value)) {
					var date_fin = prepareDateJava(document.getElementById('Date_Fin').value);
					aRecus.setParam('Date_Fin', date_fin);
				}
				aRecus.setParam('Code_Fournisseur', code_fournisseur);
				aRecus.initTree(initListeArtRecus);
			}
		}
  } catch (e) {
    recup_erreur(e);
  }
}


function initListeArtRecus() {
	try {
		if (aRecus.nbLignes()>0) {
			document.getElementById('bEditerArtRecus').disabled = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function editerArtAtt() {
	try {

		if (document.getElementById('FournisseurAtt').selectedIndex!=0) {
			var fournisseurId = document.getElementById('FournisseurAtt').value;
			
			var queryEdit = new QueryHttp("Facturation/Reception/listingArticlesEnAttente.tmpl");
			queryEdit.setParam("Fournisseur_Id", fournisseurId);
			queryEdit.execute(editerArtAtt_2);
		} else {
			showWarning("Veuillez choisir un fournisseur !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function editerArtAtt_2(httpRequest) {
	try {

		var fichier = httpRequest.responseXML.documentElement.getAttribute('Fichier');

		var file = fileChooser("save", "listeArticlesEnAttente.csv");

		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function editerArtRecus() {
	try {

		if (isEmpty(document.getElementById('Date_Debut').value)) {
			showWarning("Veuillez saisir une date de début !");
		} else if (!isDate(document.getElementById('Date_Debut').value)) {
			showWarning("Date de début incorrecte !");
		} else if (!isEmpty(document.getElementById('Date_Fin').value) && !isDate(document.getElementById('Date_Fin').value)) {
			showWarning("Date de fin incorrecte !");
		} else if (!isEmpty(document.getElementById('Date_Fin').value) && !isDateInterval(document.getElementById('Date_Debut').value, document.getElementById('Date_Fin').value)) {
			showWarning("La date de fin doit être supérieure à la date de début !");
		} else {
			var queryEdit = new QueryHttp("Facturation/Reception/listingArticlesRecus.tmpl");
			var date_debut = prepareDateJava(document.getElementById('Date_Debut').value);
			var code_fournisseur = document.getElementById('CodeFournisseur').value;
			queryEdit.setParam('Date_Debut', date_debut);
			var date_fin = document.getElementById('Date_Fin').value;
			if (!isEmpty(date_fin)) {
				date_fin = prepareDateJava(date_fin);
			}
			queryEdit.setParam('Date_Fin', date_fin);
			queryEdit.setParam('Code_Fournisseur', code_fournisseur);
			queryEdit.execute(editerArtRecus_2);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function editerArtRecus_2(httpRequest) {
	try {

		var fichier = httpRequest.responseXML.documentElement.getAttribute('Fichier');

		var file = fileChooser("save", "listeArticlesRecus.csv");

		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}

	} catch (e) {
    recup_erreur(e);
  }
}



function validerPrepBR() {
	try {
		if (verifPrepRecep()) {
			if (!treeArticles.nbLignes()) {
				showWarning("Impossible de valider la réception. Vous n'avez rien réceptionné.");
			} else if (confirm("Êtes vous sur de vouloir valider les bons de receptions ?")) {
				var params = "&Prep_Id="+ Prep_Id;
				params += "&Num_BL="+ document.getElementById("Num_BL").value;
	  		editerBR(params);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function reediterDerniereValidation() {
	try {

		// vérifier si il y a des br validés dernièrement
		var queryExisteValidation = new QueryHttp("Facturation/Reception/existeBRValides.tmpl");
		var result = queryExisteValidation.execute();
		if (result.responseXML.documentElement.getAttribute("existe") == "true") {
			editerBR("");
		}
		else {
			showWarning("Erreur : vous n'avez encore rien validé.");
		}

	} catch (e) {
    recup_erreur(e);
  }
}



function editerBR(params) {
	try {

		var page="";
		typeEdition = "BR";
		document.getElementById('chkBonChiffre').setAttribute("checked", bonChiffreDefaut);
		var bonChiffre = (document.getElementById('chkBonChiffre').checked?1:0);
		document.getElementById('optionsReliquat').collapsed = true;
	
		if (isEmpty(params)) {
			page = getUrlOpeneas("&Page=Facturation/Reception/getDerniersBRValides.tmpl&BR_Chiffre="+ bonChiffre);
		} else {
			page = getUrlOpeneas("&Page=Facturation/Reception/validerPrep.tmpl"+ params +"&BR_Chiffre="+ bonChiffre);
		}

		document.getElementById('br').setAttribute("src",page);
		document.getElementById('deck').selectedIndex = 1;
		document.getElementById('bRetourReception').collapsed = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function editerBonReliquats() {
	try {
		
		if (document.getElementById('FournisseurAtt').selectedIndex!=0) {
			typeEdition = "Reliquats";
			var fournisseurId = document.getElementById('FournisseurAtt').value;
			var page = getUrlOpeneas("&Page=Facturation/Reception/pdfBonReliquats.tmpl&Chiffre=0&Fournisseur_Id="+ urlEncode(fournisseurId)+"&Tri=D");
			
			document.getElementById('br').setAttribute("src",page);
			document.getElementById('chkBonChiffre').setAttribute("checked", false);
			document.getElementById('optionsReliquat').collapsed = false;
			document.getElementById('rgpTri').value = "D";
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('bRetourReception').collapsed = false;
		} else {
			showWarning("Veuillez choisir un fournisseur !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnBonChiffre() {
	try {
		
		document.getElementById('br').setAttribute("src", null);
		var bonChiffre = (document.getElementById('chkBonChiffre').checked?1:0);
		
		var page;
		if (typeEdition=="BR") {
			page = page = getUrlOpeneas("&Page=Facturation/Reception/getDerniersBRValides.tmpl&BR_Chiffre="+ bonChiffre);
		} else {
			var tri = document.getElementById('rgpTri').value;
			var fournisseurId = document.getElementById('FournisseurAtt').value;
			page = getUrlOpeneas("&Page=Facturation/Reception/pdfBonReliquats.tmpl&Chiffre="+ bonChiffre +"&Fournisseur_Id="+ urlEncode(fournisseurId) +"&Tri="+ tri);
		}
		
		document.getElementById('br').setAttribute("src",page);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function retourReception() {
  try {

		document.getElementById('br').setAttribute("src", null);
		document.getElementById('bRetourReception').collapsed = true;
		init();

  } catch (e) {
    recup_erreur(e);
  }
}



function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

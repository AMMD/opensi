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
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var defautEtatCommande;

var nbLignesParPage;
var pageCourante;
var nbPages;
var chargement;

var aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "secteurActivite");
var aListeCommandes = new Arbre("Facturation/GetRDF/commandes.tmpl","listeCommandes");
var aApercuCommande = new Arbre("Facturation/GetRDF/apercu_commande_fournisseur.tmpl","apercu");
var qGetTotauxCommandes = new QueryHttp("Facturation/Commandes/getTotauxCommandes.tmpl");
var qEditionCsv = new QueryHttp("Facturation/Commandes/editionListeCsv.tmpl");


function init() {
  try {
  	
  	chargement = true;
  	document.getElementById('boxNouvelleCommande').collapsed = true;
  	
  	var qDossier = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qDossier.execute();
		defautEtatCommande = result.responseXML.documentElement.getAttribute("Def_Etat_Rech_Com_Four");
		
  	var qExistePrep = new QueryHttp("Facturation/Commandes/existeCommandesPrep.tmpl");
  	var result = qExistePrep.execute();
  	document.getElementById('bSupprimerPrep').disabled = (result.responseXML.documentElement.getAttribute("existe")=="false");
  	
		document.getElementById('nbLignesParPage').selectedIndex=0;
		aSecteurs.initTree(initSecteurActivite);

  } catch (e) {
  	recup_erreur(e);
  }
}

function initSecteurActivite() {
	try {
		document.getElementById('secteurActivite').selectedIndex=0;
		initCriteres();
	} catch (e) {
		recup_erreur(e);
	}
}


function initCriteres() {
	try {
		document.getElementById('numCommande').value="";
		document.getElementById('refArticle').value="";
		document.getElementById('numFournisseur').value="";
		document.getElementById('nomFournisseur').value="";
		document.getElementById('etatCommande').value = defautEtatCommande;
		document.getElementById('numBR').value="";
		document.getElementById('intitule').value="";
		document.getElementById('dateCommandeDebut').value="";
		document.getElementById('dateCommandeFin').value="";
		document.getElementById('etatPaiement').selectedIndex=0;
		document.getElementById('bloque').selectedIndex=0;
		document.getElementById('secteurActivite').selectedIndex=0;
		document.getElementById('numFacture').value="";
		document.getElementById('numAcompte').value="";
		
		listerCommandes();
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnNouvelleCommande() {
	try {
		window.location = "chrome://opensi/content/facturation/user/commandes/edition_commande.xul?"+ cookie() +"&Mode=C";
	} catch (e) {
		recup_erreur(e);
	}
}


function onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			listerCommandes();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function listerCommandes() {
	try {

		var numCommande = document.getElementById('numCommande').value;
		var refArticle = document.getElementById('refArticle').value;
		var numFournisseur = document.getElementById('numFournisseur').value;
		var nomFournisseur = document.getElementById('nomFournisseur').value;
		var etatCommande = document.getElementById('etatCommande').value;
		var numBR = document.getElementById('numBR').value;
		var intitule = document.getElementById('intitule').value;
		var dateCommandeDebut = document.getElementById('dateCommandeDebut').value;
		var dateCommandeFin = document.getElementById('dateCommandeFin').value;
		var etatPaiement = document.getElementById('etatPaiement').value;
		var bloque = document.getElementById('bloque').value;
		var secteurActivite = document.getElementById('secteurActivite').value;
		var numFacture = document.getElementById('numFacture').value;
		var numAcompte = document.getElementById('numAcompte').value;
		
		nbLignesParPage = document.getElementById('nbLignesParPage').value;
		
		if (!isEmpty(dateCommandeDebut) && !isDate(dateCommandeDebut)) { showWarning("Date de début de période incorrecte pour la commande !"); }
		else if (!isEmpty(dateCommandeFin) && !isDate(dateCommandeFin)) { showWarning("Date de fin de période incorrecte pour la commande !"); }
		else if (!isEmpty(dateCommandeDebut) && !isEmpty(dateCommandeFin) && !isDateInterval(dateCommandeDebut, dateCommandeFin)) { showWarning("Plage de dates incorrecte pour la commande !"); }
		else {
			document.getElementById('listeCommandes').disabled = true;
			document.getElementById('bEditionCsv').disabled = true;
			if (!isEmpty(dateCommandeDebut)) { dateCommandeDebut = prepareDateJava(dateCommandeDebut); }
			if (!isEmpty(dateCommandeFin)) { dateCommandeFin = prepareDateJava(dateCommandeFin); }
			
			aApercuCommande.deleteTree();
			aListeCommandes.deleteTree();
			
			pageCourante = 1;
			nbPages = 1;
			document.getElementById('pageDeb').value = 1;
			document.getElementById('pageFin').value = 1;
			document.getElementById('bPrec').disabled = true;
			document.getElementById('bSuiv').disabled = true;
			document.getElementById('totalHT').value = "";
			document.getElementById('totalCARecep').value = "";
			document.getElementById('totalCARestant').value = "";
			
			aListeCommandes.setParam("Num_Commande", numCommande);
			aListeCommandes.setParam("Ref_Article", refArticle);
			aListeCommandes.setParam("Num_Fournisseur", numFournisseur);
			aListeCommandes.setParam("Nom_Fournisseur", nomFournisseur);
			aListeCommandes.setParam("Etat_Commande", etatCommande);
			aListeCommandes.setParam("Num_BR", numBR);
			aListeCommandes.setParam("Intitule", intitule);
			aListeCommandes.setParam("Date_Commande_Debut", dateCommandeDebut);
			aListeCommandes.setParam("Date_Commande_Fin", dateCommandeFin);
			aListeCommandes.setParam("Etat_Paiement", etatPaiement);
			aListeCommandes.setParam("Bloque", bloque);
			aListeCommandes.setParam("Secteur_Activite", secteurActivite);
			aListeCommandes.setParam("Num_Facture", numFacture);
			aListeCommandes.setParam("Num_Acompte", numAcompte);
			aListeCommandes.setParam("Page_Debut", pageCourante);
			aListeCommandes.setParam("Nb_Lignes_Par_Page", nbLignesParPage);
			aListeCommandes.initTree(initTotauxCommandes);
			
			qGetTotauxCommandes.setParam("Num_Commande", numCommande);
			qGetTotauxCommandes.setParam("Ref_Article", refArticle);
			qGetTotauxCommandes.setParam("Num_Fournisseur", numFournisseur);
			qGetTotauxCommandes.setParam("Nom_Fournisseur", nomFournisseur);
			qGetTotauxCommandes.setParam("Etat_Commande", etatCommande);
			qGetTotauxCommandes.setParam("Num_BR", numBR);
			qGetTotauxCommandes.setParam("Intitule", intitule);
			qGetTotauxCommandes.setParam("Date_Commande_Debut", dateCommandeDebut);
			qGetTotauxCommandes.setParam("Date_Commande_Fin", dateCommandeFin);
			qGetTotauxCommandes.setParam("Etat_Paiement", etatPaiement);
			qGetTotauxCommandes.setParam("Bloque", bloque);
			qGetTotauxCommandes.setParam("Secteur_Activite", secteurActivite);
			qGetTotauxCommandes.setParam("Num_Facture", numFacture);
			qGetTotauxCommandes.setParam("Num_Acompte", numAcompte);
			qGetTotauxCommandes.setParam("Nb_Lignes_Par_Page", nbLignesParPage);
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function initTotauxCommandes() {
	try {
		var result = qGetTotauxCommandes.execute();
		var contenu = result.responseXML.documentElement;
		document.getElementById('totalHT').value = contenu.getAttribute("Total_HT");
		document.getElementById('totalCARecep').value = contenu.getAttribute("Total_CA_Recep");
		document.getElementById('totalCARestant').value = contenu.getAttribute("Total_CA_Restant");
		nbPages = contenu.getAttribute("Nb_Pages");
		
		initPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function initPagination() {
	try {
		document.getElementById('pageDeb').value = pageCourante;
		document.getElementById('pageFin').value = (nbPages>0?nbPages:1);
		document.getElementById('bPrec').disabled = (pageCourante==1);
		document.getElementById('bSuiv').disabled = (pageCourante>=nbPages); // peut se produire si nbPages=0
		
		document.getElementById('listeCommandes').disabled = false;
		document.getElementById('bEditionCsv').disabled = (aListeCommandes.nbLignes()==0);
		
		if (chargement) {
			document.getElementById('boxNouvelleCommande').collapsed = false;
			chargement=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnPagePrec() {
	try {
		pageCourante--;
		majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnPageSuiv() {
	try {
		pageCourante++;
		majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function majPagination() {
	try {
		document.getElementById('pageDeb').value = pageCourante;
		document.getElementById('bPrec').disabled = (pageCourante==1);
		document.getElementById('bSuiv').disabled = (pageCourante==nbPages);
		
		aApercuCommande.deleteTree();
		
		aListeCommandes.setParam("Page_Debut", pageCourante);
		aListeCommandes.initTree();

	} catch (e) {
		recup_erreur(e);
	}
}


function selectOnListeCommandes() {
	try {
		if (aListeCommandes.isSelected()) {
			var commandeId = aListeCommandes.getSelectedCellText("colCommandeId");
			listerApercu(commandeId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnListeCommandes() {
	try {
		if (aListeCommandes.isSelected()) {
			var commandeId = aListeCommandes.getSelectedCellText("colCommandeId");
			window.location = "chrome://opensi/content/facturation/user/commandes/edition_commande.xul?"+ cookie() +"&Commande_Id="+ commandeId;
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function listerApercu(commandeId) {
	try {
		aApercuCommande.setParam("Commande_Id", commandeId);
		aApercuCommande.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerCommandesPrep() {
  try {

		if (confirm("Etes-vous sûr de vouloir supprimer les commandes en préparation ?")) {
			document.getElementById('bSupprimerPrep').disabled = true;
			var qSupprimer = new QueryHttp("Facturation/Commandes/supprimerCommandesPrep.tmpl");
			qSupprimer.execute(listerCommandes);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function pressOnEditionCsv() {
	try {
		
		var numCommande = document.getElementById('numCommande').value;
		var refArticle = document.getElementById('refArticle').value;
		var numFournisseur = document.getElementById('numFournisseur').value;
		var nomFournisseur = document.getElementById('nomFournisseur').value;
		var etatCommande = document.getElementById('etatCommande').value;
		var numBR = document.getElementById('numBR').value;
		var intitule = document.getElementById('intitule').value;
		var dateCommandeDebut = document.getElementById('dateCommandeDebut').value;
		var dateCommandeFin = document.getElementById('dateCommandeFin').value;
		var etatPaiement = document.getElementById('etatPaiement').value;
		var bloque = document.getElementById('bloque').value;
		var secteurActivite = document.getElementById('secteurActivite').value;
		var numFacture = document.getElementById('numFacture').value;
		var numAcompte = document.getElementById('numAcompte').value;
		
		if (!isEmpty(dateCommandeDebut) && !isDate(dateCommandeDebut)) { showWarning("Date de début de période incorrecte pour la commande !"); }
		else if (!isEmpty(dateCommandeFin) && !isDate(dateCommandeFin)) { showWarning("Date de fin de période incorrecte pour la commande !"); }
		else if (!isEmpty(dateCommandeDebut) && !isEmpty(dateCommandeFin) && !isDateInterval(dateCommandeDebut, dateCommandeFin)) { showWarning("Plage de dates incorrecte pour la commande !"); }
		else {
			if (!isEmpty(dateCommandeDebut)) { dateCommandeDebut = prepareDateJava(dateCommandeDebut); }
			if (!isEmpty(dateCommandeFin)) { dateCommandeFin = prepareDateJava(dateCommandeFin); }
			
			qEditionCsv.setParam("Num_Commande", numCommande);
			qEditionCsv.setParam("Ref_Article", refArticle);
			qEditionCsv.setParam("Num_Fournisseur", numFournisseur);
			qEditionCsv.setParam("Nom_Fournisseur", nomFournisseur);
			qEditionCsv.setParam("Etat_Commande", etatCommande);
			qEditionCsv.setParam("Num_BR", numBR);
			qEditionCsv.setParam("Intitule", intitule);
			qEditionCsv.setParam("Date_Commande_Debut", dateCommandeDebut);
			qEditionCsv.setParam("Date_Commande_Fin", dateCommandeFin);
			qEditionCsv.setParam("Etat_Paiement", etatPaiement);
			qEditionCsv.setParam("Bloque", bloque);
			qEditionCsv.setParam("Secteur_Activite", secteurActivite);
			qEditionCsv.setParam("Num_Facture", numFacture);
			qEditionCsv.setParam("Num_Acompte", numAcompte);
				
			var result = qEditionCsv.execute();
			var fichier = result.responseXML.documentElement.getAttribute('FichierCsv');
			
			var nomDefaut = "listeCommandes.csv";
	
			var file = fileChooser("save", nomDefaut);
			if (file!=null) {
				downloadFile(getDirBuffer()+ fichier, file);
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function retourMenuPrincipal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

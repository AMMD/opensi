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


var oma_existeSites;
var oma_defautEtatCommande;
var oma_defautEtatLogistique;
var oma_calculStock;
var oma_modeTraitement;

var oma_nbLignesParPage;
var oma_pageCourante;
var oma_nbPages;
var oma_chargement;

var oma_aModesReglements=new Arbre("ComboListe/combo-modesReglement.tmpl","oma-modeReglement");
var oma_aProvenance=new Arbre("Facturation/Affaires/liste-sites.tmpl","oma-provenance");
var oma_aModesExpedition=new Arbre("Facturation/Affaires/liste-modesExpedition.tmpl","oma-modeExpedition");
var oma_aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "oma-secteurActivite");
var oma_aListeCommandes=new Arbre("Facturation/Affaires/liste-commandes.tmpl","oma-listeCommandes");
var oma_aListeAffaires=new Arbre("Facturation/Affaires/liste-affaires.tmpl","oma-listeAffaires");
var oma_aApercuCommande=new Arbre("Facturation/Affaires/liste-apercuCommande.tmpl","oma-apercuCommande");
var oma_aApercuAffaire=new Arbre("Facturation/Affaires/liste-apercuAffaire.tmpl","oma-apercuAffaire");

var oma_qGetTotauxCommandes = new QueryHttp("Facturation/Affaires/getTotauxCommandes.tmpl");
var oma_qGetTotauxAffaires = new QueryHttp("Facturation/Affaires/getTotauxAffaires.tmpl");
var oma_qGetStats = new QueryHttp("Facturation/Affaires/getStatistiques.tmpl");

function oma_init() {
  try {

  	oma_chargement = true;
  	document.getElementById('oma-boxNouvelleAffaire').collapsed = true;
  	
  	var qDossier = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qDossier.execute();
		oma_modeTraitement = result.responseXML.documentElement.getAttribute("Mode_Traitement");
		document.getElementById('oma-modeTraitement').value = oma_modeTraitement;
		document.getElementById('oma-listeCommandes').collapsed = (oma_modeTraitement=="A");
		document.getElementById('oma-listeAffaires').collapsed = (oma_modeTraitement=="C");
		document.getElementById('oma-bValiderCommande').collapsed = (oma_modeTraitement=="A");
		
		oma_defautEtatCommande = result.responseXML.documentElement.getAttribute("Def_Etat_Rech_Com");
		oma_defautEtatLogistique = result.responseXML.documentElement.getAttribute("Def_Etat_Rech_Log");
		oma_calculStock = (result.responseXML.documentElement.getAttribute("Calcul_Stock")=="1");
		
		if (!oma_calculStock) {
			document.getElementById('oma-miExpedier').collapsed = true;
			document.getElementById('oma-miReassort').collapsed = true;
			document.getElementById('oma-lcColStock').setAttribute("hidden",true);
			document.getElementById('oma-lcColStock').setAttribute("ignoreincolumnpicker",true);
			
			if (oma_defautEtatLogistique=="C" || oma_defautEtatLogistique=="R") {
				oma_defautEtatLogistique = "T";
			}
		}
		
		var qExisteSites = new QueryHttp("Facturation/Affaires/existeSites.tmpl");
		var result = qExisteSites.execute();

		oma_existeSites = (result.responseXML.documentElement.getAttribute("Existe")=="true");
		if (!oma_existeSites) {
			document.getElementById('oma-bEtatsWebService').collapsed = true;
			document.getElementById('oma-lcColLoginWeb').setAttribute("hidden",true);
			document.getElementById('oma-lcColLoginWeb').setAttribute("ignoreincolumnpicker",true);
			document.getElementById('oma-lcColProvenance').setAttribute("hidden",true);
			document.getElementById('oma-lcColProvenance').setAttribute("ignoreincolumnpicker",true);
			document.getElementById('oma-boxLoginWeb').collapsed = true;
		}
		
		oma_initStats();
		document.getElementById('oma-nbLignesParPage').selectedIndex=0;
		oma_aModesReglements.initTree(oma_initModeReglement);
		
		
  } catch (e) {
  	recup_erreur(e);
  }
}


function oma_initModeReglement() {
	try {
		document.getElementById('oma-modeReglement').selectedIndex=0;
		oma_aProvenance.initTree(oma_initProvenance);
	} catch (e) {
		recup_erreur(e);
	}
}

function oma_initProvenance() {
	try {
		document.getElementById('oma-provenance').selectedIndex=0;
		oma_aModesExpedition.initTree(oma_initModeExpedition);
	} catch (e) {
		recup_erreur(e);
	}
}

function oma_initModeExpedition() {
	try {
		document.getElementById('oma-modeExpedition').selectedIndex=0;
		oma_aSecteurs.initTree(oma_initSecteurActivite);
	} catch (e) {
		recup_erreur(e);
	}
}

function oma_initSecteurActivite() {
	try {
		document.getElementById('oma-secteurActivite').selectedIndex=0;
		oma_initCriteres();
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_pressOnNouvelleAffaire() {
	try {
		document.getElementById("bMenuAffaires").collapsed=false;
		document.getElementById("deck").selectedIndex=1;
		ofa_nouvelleAffaire();
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_pressOnEtatsWebService() {
	try {
		var url = "chrome://opensi/content/facturation/user/affaires/popup-etatsWebservice.xul?"+ cookie();
    window.openDialog(url,'','chrome,modal,centerscreen');
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_initStats() {
	try {
		var result = oma_qGetStats.execute();
		var contenu = result.responseXML.documentElement;
		
		document.getElementById('oma-nbCommandesEnCours').value = contenu.getAttribute("Nb_Commandes_En_Cours");
		document.getElementById('oma-montantHTCommandesEnCours').value = contenu.getAttribute("Montant_HT_Commandes_En_Cours");
		document.getElementById('oma-nbCommandesAFacturer').value = contenu.getAttribute("Nb_Commandes_A_Facturer");
		document.getElementById('oma-montantHTCommandesAFacturer').value = contenu.getAttribute("Montant_HT_Commandes_A_Facturer");
		document.getElementById('oma-nbCommandesAExpedier').value = contenu.getAttribute("Nb_Commandes_A_Expedier");
		document.getElementById('oma-montantHTCommandesAExpedier').value = contenu.getAttribute("Montant_HT_Commandes_A_Expedier");
		document.getElementById('oma-nbCommandesNonValidees').value = contenu.getAttribute("Nb_Commandes_Non_Validees");
		document.getElementById('oma-montantHTCommandesNonValidees').value = contenu.getAttribute("Montant_HT_Commandes_Non_Validees");
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_initCriteres() {
	try {
		
		oma_modeTraitement = document.getElementById('oma-modeTraitement').value;
		
		document.getElementById('oma-numCommande').value="";
		document.getElementById('oma-intituleAffaire').value="";
		document.getElementById('oma-loginWeb').value="";
		document.getElementById('oma-nomClient').value="";
		document.getElementById('oma-refArticle').value="";
		document.getElementById('oma-numFacture').value="";
		document.getElementById('oma-numAcompte').value="";
		document.getElementById('oma-numBL').value="";
		document.getElementById('oma-numRetour').value="";
		document.getElementById('oma-numAffaire').value="";
		document.getElementById('oma-etatAffaire').value = oma_defautEtatCommande;
		document.getElementById('oma-etatCommande').value = oma_defautEtatCommande;
		document.getElementById('oma-etatLogistique').value = oma_defautEtatLogistique;
		document.getElementById('oma-bloque').selectedIndex=0;
		document.getElementById('oma-dateCommandeDebut').value="";
		document.getElementById('oma-dateCommandeFin').value="";
		document.getElementById('oma-dateDelaiDebut').value="";
		document.getElementById('oma-dateDelaiFin').value="";
		document.getElementById('oma-numClient').value="";
		document.getElementById('oma-montantTTC').value="";
		document.getElementById('oma-etatPaiement').selectedIndex=0;
		document.getElementById('oma-modeReglement').selectedIndex=0;
		document.getElementById('oma-provenance').selectedIndex=0;
		document.getElementById('oma-modeExpedition').selectedIndex=0;
		document.getElementById('oma-secteurActivite').selectedIndex=0;
		
		document.getElementById('oma-boxIntituleAffaire').collapsed = (oma_modeTraitement=="C");
		document.getElementById('oma-boxNumAffaire').collapsed = (oma_modeTraitement=="C");
		document.getElementById('oma-boxEtatAffaire').collapsed = (oma_modeTraitement=="C");
		document.getElementById('oma-boxEtatCommande').collapsed = (oma_modeTraitement=="A");
		document.getElementById('oma-boxEtatLogistique').collapsed = (oma_modeTraitement=="A");
		document.getElementById('oma-boxBloque').collapsed = (oma_modeTraitement=="A");
		document.getElementById('oma-boxMontantTTC').collapsed = (oma_modeTraitement=="A");
		document.getElementById('oma-boxEtatPaiement').collapsed = (oma_modeTraitement=="A");
		document.getElementById('oma-boxModeReglement').collapsed = (oma_modeTraitement=="A");
		document.getElementById('oma-boxProvenance').collapsed = (oma_modeTraitement=="A" || !oma_existeSites);
		document.getElementById('oma-boxModeExpedition').collapsed = (oma_modeTraitement=="A");
		document.getElementById('oma-boxSecteurActivite').collapsed = (oma_modeTraitement=="A");
		document.getElementById('oma-boxStats').collapsed = false;
		document.getElementById('oma-boxApercuCommande').collapsed = true;
		document.getElementById('oma-boxApercuAffaire').collapsed = true;
		
		document.getElementById('oma-listeCommandes').collapsed = (oma_modeTraitement=="A");
		document.getElementById('oma-listeAffaires').collapsed = (oma_modeTraitement=="C");
		document.getElementById('oma-bValiderCommande').collapsed = (oma_modeTraitement=="A");
		
		oma_listerCommandes();
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			oma_listerCommandes();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_listerCommandes() {
	try {
		
		var numCommande = document.getElementById('oma-numCommande').value;
		var intituleAffaire = document.getElementById('oma-intituleAffaire').value;
		var loginWeb = document.getElementById('oma-loginWeb').value;
		var nomClient = document.getElementById('oma-nomClient').value;
		var refArticle = document.getElementById('oma-refArticle').value;
		var numFacture = document.getElementById('oma-numFacture').value;
		var numAcompte = document.getElementById('oma-numAcompte').value;
		var numBL = document.getElementById('oma-numBL').value;
		var numRetour = document.getElementById('oma-numRetour').value;
		var numAffaire = document.getElementById('oma-numAffaire').value;
		var etatAffaire = document.getElementById('oma-etatAffaire').value;
		var etatCommande = document.getElementById('oma-etatCommande').value;
		var etatLogistique = document.getElementById('oma-etatLogistique').value;
		var commandeBloquee = document.getElementById('oma-bloque').value;
		var dateCommandeDebut = document.getElementById('oma-dateCommandeDebut').value;
		var dateCommandeFin = document.getElementById('oma-dateCommandeFin').value;
		var dateDelaiDebut = document.getElementById('oma-dateDelaiDebut').value;
		var dateDelaiFin = document.getElementById('oma-dateDelaiFin').value;
		var numClient = document.getElementById('oma-numClient').value;
		var montantTTC = document.getElementById('oma-montantTTC').value;
		var etatPaiement = document.getElementById('oma-etatPaiement').value;
		var modeReglement = document.getElementById('oma-modeReglement').value;
		var provenance = document.getElementById('oma-provenance').value;
		var modeExpedition = document.getElementById('oma-modeExpedition').value;
		var secteurActivite = document.getElementById('oma-secteurActivite').value;
		
		oma_nbLignesParPage = document.getElementById('oma-nbLignesParPage').value;
		
		if (etatCommande!="T") {
			document.getElementById('oma-etatLogistique').value = oma_defautEtatLogistique;
		}
		
		if (!isEmpty(montantTTC) && isNaN(montantTTC)) { showWarning("Le montant TTC est incorrect !"); }
		else if (!isEmpty(dateCommandeDebut) && !isDate(dateCommandeDebut)) { showWarning("Date de début de période incorrecte pour la commande !"); }
		else if (!isEmpty(dateCommandeFin) && !isDate(dateCommandeFin)) { showWarning("Date de fin de période incorrecte pour la commande !"); }
		else if (!isEmpty(dateCommandeDebut) && !isEmpty(dateCommandeFin) && !isDateInterval(dateCommandeDebut, dateCommandeFin)) { showWarning("Plage de dates incorrecte pour la commande !"); }
		else if (!isEmpty(dateDelaiDebut) && !isDate(dateDelaiDebut)) { showWarning("Date de début de période incorrecte pour le délai !"); }
		else if (!isEmpty(dateDelaiFin) && !isDate(dateDelaiFin)) { showWarning("Date de fin de période incorrecte pour le délai !"); }
		else if (!isEmpty(dateDelaiDebut) && !isEmpty(dateDelaiFin) && !isDateInterval(dateDelaiDebut, dateDelaiFin)) { showWarning("Plage de dates incorrecte pour le délai !"); }
		else {
			document.getElementById('oma-boxStats').collapsed = false;
			document.getElementById('oma-boxApercuCommande').collapsed = true;
			document.getElementById('oma-boxApercuAffaire').collapsed = true;
			document.getElementById('oma-totalApercuCommande').value = "";
			document.getElementById('oma-montantMargeApercuCommande').value = "";
			document.getElementById('oma-pourcMargeApercuCommande').value = "";
			document.getElementById('oma-lblMargeApercuCommande').setAttribute("style", "color:black");
			document.getElementById('oma-montantMargeApercuCommande').setAttribute("style", "color:black");
			document.getElementById('oma-lblPourcMargeApercuCommande').setAttribute("style", "color:black");
			document.getElementById('oma-pourcMargeApercuCommande').setAttribute("style", "color:black");
			document.getElementById('oma-pictoMargeNegativeCommande').collapsed = true;
			document.getElementById('oma-totalApercuAffaire').value = "";
			document.getElementById('oma-montantMargeApercuAffaire').value = "";
			document.getElementById('oma-pourcMargeApercuAffaire').value = "";
			document.getElementById('oma-lblMargeApercuAffaire').setAttribute("style", "color:black");
			document.getElementById('oma-montantMargeApercuAffaire').setAttribute("style", "color:black");
			document.getElementById('oma-lblPourcMargeApercuAffaire').setAttribute("style", "color:black");
			document.getElementById('oma-pourcMargeApercuAffaire').setAttribute("style", "color:black");
			document.getElementById('oma-pictoMargeNegativeAffaire').collapsed = true;
			
			document.getElementById('oma-listeCommandes').disabled = true;
			document.getElementById('oma-listeAffaires').disabled = true;
			document.getElementById('oma-bEditionCsv').disabled = true;
			if (!isEmpty(dateCommandeDebut)) { dateCommandeDebut = prepareDateJava(dateCommandeDebut); }
			if (!isEmpty(dateCommandeFin)) { dateCommandeFin = prepareDateJava(dateCommandeFin); }
			if (!isEmpty(dateDelaiDebut)) { dateDelaiDebut = prepareDateJava(dateDelaiDebut); }
			if (!isEmpty(dateDelaiFin)) { dateDelaiFin = prepareDateJava(dateDelaiFin); }
	
			document.getElementById('oma-numCommandeSelect').value = "";
			document.getElementById('oma-numAffaireSelect').value = "";
			oma_aApercuCommande.deleteTree();
			oma_aApercuAffaire.deleteTree();
			oma_aListeCommandes.deleteTree();
			oma_aListeAffaires.deleteTree();
			
			oma_pageCourante = 1;
			oma_nbPages = 1;
			document.getElementById('oma-pageDeb').value = 1;
			document.getElementById('oma-pageFin').value = 1;
			document.getElementById('oma-bPrec').disabled = true;
			document.getElementById('oma-bSuiv').disabled = true;
			document.getElementById('oma-totalHT').value = "";
			document.getElementById('oma-totalCALivre').value = "";
			document.getElementById('oma-totalCARestant').value = "";
			
			if (oma_modeTraitement=="C") {
				oma_aListeCommandes.setParam("Num_Commande", numCommande);
				oma_aListeCommandes.setParam("Login_Web", loginWeb);
				oma_aListeCommandes.setParam("Nom_Client", nomClient);
				oma_aListeCommandes.setParam("Ref_Article", refArticle);
				oma_aListeCommandes.setParam("Num_Facture", numFacture);
				oma_aListeCommandes.setParam("Num_Acompte", numAcompte);
				oma_aListeCommandes.setParam("Num_BL", numBL);
				oma_aListeCommandes.setParam("Num_Retour", numRetour);
				oma_aListeCommandes.setParam("Etat_Commande", etatCommande);
				oma_aListeCommandes.setParam("Etat_Logistique", etatLogistique);
				oma_aListeCommandes.setParam("Commande_Bloquee", commandeBloquee);
				oma_aListeCommandes.setParam("Date_Commande_Debut", dateCommandeDebut);
				oma_aListeCommandes.setParam("Date_Commande_Fin", dateCommandeFin);
				oma_aListeCommandes.setParam("Date_Delai_Debut", dateDelaiDebut);
				oma_aListeCommandes.setParam("Date_Delai_Fin", dateDelaiFin);
				oma_aListeCommandes.setParam("Num_Client", numClient);
				oma_aListeCommandes.setParam("Montant_TTC", montantTTC);
				oma_aListeCommandes.setParam("Etat_Paiement", etatPaiement);
				oma_aListeCommandes.setParam("Mode_Reglement", modeReglement);
				oma_aListeCommandes.setParam("Provenance", provenance);
				oma_aListeCommandes.setParam("Mode_Expedition", modeExpedition);
				oma_aListeCommandes.setParam("Secteur_Activite", secteurActivite);
				oma_aListeCommandes.setParam("Calcul_Stock", oma_calculStock?"1":"0");
				oma_aListeCommandes.setParam("Page_Debut", oma_pageCourante);
				oma_aListeCommandes.setParam("Nb_Lignes_Par_Page", oma_nbLignesParPage);
				
				document.getElementById('oma-boxEtatLogistique').collapsed = (etatCommande!="T");
				document.getElementById('oma-intituleAffaire').value="";
				document.getElementById('oma-numAffaire').value="";
				document.getElementById('oma-etatAffaire').value = oma_defautEtatCommande;
				document.getElementById('oma-bValiderCommande').disabled = true;
				
				oma_qGetTotauxCommandes.setParam("Num_Commande", numCommande);
				oma_qGetTotauxCommandes.setParam("Login_Web", loginWeb);
				oma_qGetTotauxCommandes.setParam("Nom_Client", nomClient);
				oma_qGetTotauxCommandes.setParam("Ref_Article", refArticle);
				oma_qGetTotauxCommandes.setParam("Num_Facture", numFacture);
				oma_qGetTotauxCommandes.setParam("Num_Acompte", numAcompte);
				oma_qGetTotauxCommandes.setParam("Num_BL", numBL);
				oma_qGetTotauxCommandes.setParam("Num_Retour", numRetour);
				oma_qGetTotauxCommandes.setParam("Etat_Commande", etatCommande);
				oma_qGetTotauxCommandes.setParam("Etat_Logistique", etatLogistique);
				oma_qGetTotauxCommandes.setParam("Commande_Bloquee", commandeBloquee);
				oma_qGetTotauxCommandes.setParam("Date_Commande_Debut", dateCommandeDebut);
				oma_qGetTotauxCommandes.setParam("Date_Commande_Fin", dateCommandeFin);
				oma_qGetTotauxCommandes.setParam("Date_Delai_Debut", dateDelaiDebut);
				oma_qGetTotauxCommandes.setParam("Date_Delai_Fin", dateDelaiFin);
				oma_qGetTotauxCommandes.setParam("Num_Client", numClient);
				oma_qGetTotauxCommandes.setParam("Montant_TTC", montantTTC);
				oma_qGetTotauxCommandes.setParam("Etat_Paiement", etatPaiement);
				oma_qGetTotauxCommandes.setParam("Mode_Reglement", modeReglement);
				oma_qGetTotauxCommandes.setParam("Provenance", provenance);
				oma_qGetTotauxCommandes.setParam("Mode_Expedition", modeExpedition);
				oma_qGetTotauxCommandes.setParam("Secteur_Activite", secteurActivite);
				oma_qGetTotauxCommandes.setParam("Nb_Lignes_Par_Page", oma_nbLignesParPage);
				
				oma_aListeCommandes.initTree(oma_initTotaux);
			} else {
				oma_aListeAffaires.setParam("Num_Commande", numCommande);
				oma_aListeAffaires.setParam("Intitule_Affaire", intituleAffaire);
				oma_aListeAffaires.setParam("Login_Web", loginWeb);
				oma_aListeAffaires.setParam("Nom_Client", nomClient);
				oma_aListeAffaires.setParam("Ref_Article", refArticle);
				oma_aListeAffaires.setParam("Num_Facture", numFacture);
				oma_aListeAffaires.setParam("Num_Acompte", numAcompte);
				oma_aListeAffaires.setParam("Num_BL", numBL);
				oma_aListeAffaires.setParam("Num_Retour", numRetour);
				oma_aListeAffaires.setParam("Num_Affaire", numAffaire);
				oma_aListeAffaires.setParam("Etat_Affaire", etatAffaire);
				oma_aListeAffaires.setParam("Date_Commande_Debut", dateCommandeDebut);
				oma_aListeAffaires.setParam("Date_Commande_Fin", dateCommandeFin);
				oma_aListeAffaires.setParam("Date_Delai_Debut", dateDelaiDebut);
				oma_aListeAffaires.setParam("Date_Delai_Fin", dateDelaiFin);
				oma_aListeAffaires.setParam("Num_Client", numClient);
				oma_aListeAffaires.setParam("Page_Debut", oma_pageCourante);
				oma_aListeAffaires.setParam("Nb_Lignes_Par_Page", oma_nbLignesParPage);
				
				document.getElementById('oma-etatCommande').value = oma_defautEtatCommande;
				document.getElementById('oma-boxEtatLogistique').collapsed = true;
				document.getElementById('oma-etatLogistique').value = oma_defautEtatLogistique;
				document.getElementById('oma-bloque').selectedIndex=0;
				document.getElementById('oma-montantTTC').value="";
				document.getElementById('oma-etatPaiement').selectedIndex=0;
				document.getElementById('oma-modeReglement').selectedIndex=0;
				document.getElementById('oma-provenance').selectedIndex=0;
				document.getElementById('oma-modeExpedition').selectedIndex=0;
				document.getElementById('oma-secteurActivite').selectedIndex=0;
				
				oma_qGetTotauxAffaires.setParam("Num_Commande", numCommande);
				oma_qGetTotauxAffaires.setParam("Intitule_Affaire", intituleAffaire);
				oma_qGetTotauxAffaires.setParam("Login_Web", loginWeb);
				oma_qGetTotauxAffaires.setParam("Nom_Client", nomClient);
				oma_qGetTotauxAffaires.setParam("Ref_Article", refArticle);
				oma_qGetTotauxAffaires.setParam("Num_Facture", numFacture);
				oma_qGetTotauxAffaires.setParam("Num_Acompte", numAcompte);
				oma_qGetTotauxAffaires.setParam("Num_BL", numBL);
				oma_qGetTotauxAffaires.setParam("Num_Retour", numRetour);
				oma_qGetTotauxAffaires.setParam("Num_Affaire", numAffaire);
				oma_qGetTotauxAffaires.setParam("Etat_Affaire", etatAffaire);
				oma_qGetTotauxAffaires.setParam("Date_Commande_Debut", dateCommandeDebut);
				oma_qGetTotauxAffaires.setParam("Date_Commande_Fin", dateCommandeFin);
				oma_qGetTotauxAffaires.setParam("Date_Delai_Debut", dateDelaiDebut);
				oma_qGetTotauxAffaires.setParam("Date_Delai_Fin", dateDelaiFin);
				oma_qGetTotauxAffaires.setParam("Num_Client", numClient);
				oma_qGetTotauxAffaires.setParam("Nb_Lignes_Par_Page", oma_nbLignesParPage);
				
				oma_aListeAffaires.initTree(oma_initTotaux);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_initTotaux() {
	try {
		var result;
		if (oma_modeTraitement=="C") { result = oma_qGetTotauxCommandes.execute(); }
		else { result = oma_qGetTotauxAffaires.execute(); }
		var contenu = result.responseXML.documentElement;
		document.getElementById('oma-totalHT').value = contenu.getAttribute("Total_HT");
		document.getElementById('oma-totalCALivre').value = contenu.getAttribute("Total_CA_Livre");
		document.getElementById('oma-totalCARestant').value = contenu.getAttribute("Total_CA_Restant");
		oma_nbPages = contenu.getAttribute("Nb_Pages");
		
		oma_initPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_initPagination() {
	try {
		document.getElementById('oma-pageDeb').value = oma_pageCourante;
		document.getElementById('oma-pageFin').value = (oma_nbPages>0?oma_nbPages:1);
		document.getElementById('oma-bPrec').disabled = (oma_pageCourante==1);
		document.getElementById('oma-bSuiv').disabled = (oma_pageCourante>=oma_nbPages); // peut se produire si oma_nbPages=0
		
		document.getElementById('oma-listeCommandes').disabled = false;
		document.getElementById('oma-listeAffaires').disabled = false;
		document.getElementById('oma-bEditionCsv').disabled = ((oma_modeTraitement=="C" && oma_aListeCommandes.nbLignes()==0) || (oma_modeTraitement=="A" && oma_aListeAffaires.nbLignes()==0));
		
		if (oma_chargement) {
			document.getElementById('oma-boxNouvelleAffaire').collapsed = false;
			oma_chargement=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_pressOnPagePrec() {
	try {
		oma_pageCourante--;
		oma_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_pressOnPageSuiv() {
	try {
		oma_pageCourante++;
		oma_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_majPagination() {
	try {
		document.getElementById('oma-pageDeb').value = oma_pageCourante;
		document.getElementById('oma-bPrec').disabled = (oma_pageCourante==1);
		document.getElementById('oma-bSuiv').disabled = (oma_pageCourante==oma_nbPages);
		
		document.getElementById('oma-boxStats').collapsed = false;
		document.getElementById('oma-boxApercuCommande').collapsed = true;
		document.getElementById('oma-boxApercuAffaire').collapsed = true;
		document.getElementById('oma-totalApercuCommande').value = "";
		document.getElementById('oma-montantMargeApercuCommande').value = "";
		document.getElementById('oma-pourcMargeApercuCommande').value = "";
		document.getElementById('oma-lblMargeApercuCommande').setAttribute("style", "color:black");
		document.getElementById('oma-montantMargeApercuCommande').setAttribute("style", "color:black");
		document.getElementById('oma-lblPourcMargeApercuCommande').setAttribute("style", "color:black");
		document.getElementById('oma-pourcMargeApercuCommande').setAttribute("style", "color:black");
		document.getElementById('oma-pictoMargeNegativeCommande').collapsed = true;
		document.getElementById('oma-totalApercuAffaire').value = "";
		document.getElementById('oma-montantMargeApercuAffaire').value = "";
		document.getElementById('oma-pourcMargeApercuAffaire').value = "";
		document.getElementById('oma-lblMargeApercuAffaire').setAttribute("style", "color:black");
		document.getElementById('oma-montantMargeApercuAffaire').setAttribute("style", "color:black");
		document.getElementById('oma-lblPourcMargeApercuAffaire').setAttribute("style", "color:black");
		document.getElementById('oma-pourcMargeApercuAffaire').setAttribute("style", "color:black");
		document.getElementById('oma-pictoMargeNegativeAffaire').collapsed = true;
		
		document.getElementById('oma-numCommandeSelect').value = "";
		document.getElementById('oma-numAffaireSelect').value = "";
		
		document.getElementById('oma-listeCommandes').disabled = true;
		document.getElementById('oma-listeAffaires').disabled = true;
		document.getElementById('oma-bEditionCsv').disabled = true;
		oma_aApercuCommande.deleteTree();
		oma_aApercuAffaire.deleteTree();
		
		if (oma_modeTraitement=="C") {
			document.getElementById('oma-bValiderCommande').disabled = true;
			oma_aListeCommandes.setParam("Page_Debut", oma_pageCourante);
			oma_aListeCommandes.initTree(oma_afterMajPagination);
		} else {
			oma_aListeAffaires.setParam("Page_Debut", oma_pageCourante);
			oma_aListeAffaires.initTree(oma_afterMajPagination);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_afterMajPagination() {
	try {
		document.getElementById('oma-listeCommandes').disabled = false;
		document.getElementById('oma-listeAffaires').disabled = false;
		document.getElementById('oma-bEditionCsv').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_selectOnListeCommandes() {
	try {
		if (oma_aListeCommandes.isSelected()) {
			var i = oma_aListeCommandes.getCurrentIndex();
			var cmdId = oma_aListeCommandes.getCellText(i, "oma-lcColCommandeId");
			var etatCommande = oma_aListeCommandes.getCellText(i, "oma-lcColCodeEtat");
			document.getElementById('oma-numCommandeSelect').value = "Aperçu de la commande N° "+ oma_aListeCommandes.getCellText(i, "oma-lcColNumCommande") +" :";
			oma_listerApercuCommande(cmdId);
			document.getElementById('oma-bValiderCommande').disabled = (etatCommande!="N" && etatCommande!="Z");
			
			document.getElementById('oma-totalApercuCommande').value = oma_aListeCommandes.getCellText(i, "oma-lcColMontantHT");
			
			var qGetStats = new QueryHttp("Facturation/Affaires/getStatsCommande.tmpl");
			qGetStats.setParam("Commande_Id", cmdId);
			var result = qGetStats.execute();
			document.getElementById('oma-montantMargeApercuCommande').value = result.responseXML.documentElement.getAttribute("Marge_HT");
			document.getElementById('oma-pourcMargeApercuCommande').value = result.responseXML.documentElement.getAttribute("Pourc_Marge_HT");
			var margeNegative = (result.responseXML.documentElement.getAttribute("Marge_Negative")=="true");
			document.getElementById('oma-lblMargeApercuCommande').setAttribute("style", margeNegative?"color:red":"color:black");
			document.getElementById('oma-montantMargeApercuCommande').setAttribute("style", margeNegative?"color:red":"color:black");
			document.getElementById('oma-lblPourcMargeApercuCommande').setAttribute("style", margeNegative?"color:red":"color:black");
			document.getElementById('oma-pourcMargeApercuCommande').setAttribute("style", margeNegative?"color:red":"color:black");
			document.getElementById('oma-pictoMargeNegativeCommande').collapsed = !margeNegative;
			
			document.getElementById('oma-boxStats').collapsed = true;
			document.getElementById('oma-boxApercuCommande').collapsed = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_pressOnListeCommandes() {
	try {
		if (commandeInitialisee && oma_aListeCommandes.isSelected()) {
			var i = oma_aListeCommandes.getCurrentIndex();
			var etatCommande = oma_aListeCommandes.getCellText(i, "oma-lcColCodeEtat");
			if (etatCommande!="T") {
				commandeId = oma_aListeCommandes.getCellText(i, "oma-lcColCommandeId");
				oec_chargerCommande();
				document.getElementById("bRetourAffaire").collapsed=false;
				document.getElementById("deck").selectedIndex=2;
			} else {
				affaireId = oma_aListeCommandes.getCellText(i, "oma-lcColAffaireId");
				ofa_chargerAffaire();
				document.getElementById("deck").selectedIndex=1;
			}
			document.getElementById("bMenuAffaires").collapsed=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_selectOnListeAffaires() {
	try {
		if (oma_aListeAffaires.isSelected()) {
			var i = oma_aListeAffaires.getCurrentIndex();
			var affaireId = oma_aListeAffaires.getCellText(i, "oma-laColAffaireId");
			document.getElementById('oma-numAffaireSelect').value = "Aperçu de l'affaire N° "+ oma_aListeAffaires.getCellText(i, "oma-laColNumAffaire") +" :";
			oma_listerApercuAffaire(affaireId);
			
			document.getElementById('oma-totalApercuAffaire').value = oma_aListeAffaires.getCellText(i, "oma-laColMontantHT");
			
			var qGetStats = new QueryHttp("Facturation/Affaires/getStatsAffaire.tmpl");
			qGetStats.setParam("Affaire_Id", affaireId);
			var result = qGetStats.execute();
			document.getElementById('oma-montantMargeApercuAffaire').value = result.responseXML.documentElement.getAttribute("Marge_HT");
			document.getElementById('oma-pourcMargeApercuAffaire').value = result.responseXML.documentElement.getAttribute("Pourc_Marge_HT");
			var margeNegative = (result.responseXML.documentElement.getAttribute("Marge_Negative")=="true");
			document.getElementById('oma-lblMargeApercuAffaire').setAttribute("style", margeNegative?"color:red":"color:black");
			document.getElementById('oma-montantMargeApercuAffaire').setAttribute("style", margeNegative?"color:red":"color:black");
			document.getElementById('oma-lblPourcMargeApercuAffaire').setAttribute("style", margeNegative?"color:red":"color:black");
			document.getElementById('oma-pourcMargeApercuAffaire').setAttribute("style", margeNegative?"color:red":"color:black");
			document.getElementById('oma-pictoMargeNegativeAffaire').collapsed = !margeNegative;
			
			document.getElementById('oma-boxStats').collapsed = true;
			document.getElementById('oma-boxApercuAffaire').collapsed = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_pressOnListeAffaires() {
	try {
		if (commandeInitialisee && oma_aListeAffaires.isSelected()) {
			var i = oma_aListeAffaires.getCurrentIndex();
			affaireId = oma_aListeAffaires.getCellText(i, "oma-laColAffaireId");
			ofa_chargerAffaire();
			document.getElementById("bMenuAffaires").collapsed=false;
			document.getElementById("deck").selectedIndex=1;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_listerApercuCommande(id) {
	try {
		oma_aApercuCommande.setParam("Commande_Id", id);
		oma_aApercuCommande.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_listerApercuAffaire(id) {
	try {
		oma_aApercuAffaire.setParam("Affaire_Id", id);
		oma_aApercuAffaire.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_pressOnValiderCommande() {
	try {
		if (oma_aListeCommandes.isSelected()) {
			var i = oma_aListeCommandes.getCurrentIndex();
			var comId = oma_aListeCommandes.getCellText(i, "oma-lcColCommandeId");
			
			var ok = true;
			var qCheckEncoursClient = new QueryHttp("Facturation/Affaires/checkEncoursClient.tmpl");
			qCheckEncoursClient.setParam("Commande_Id", comId);
			var result=qCheckEncoursClient.execute();
			if (result.responseXML.documentElement.getAttribute("Depassement")=="true") {
				ok = window.confirm("L'encours autorisé du client est dépassé, voulez-vous continuer ?");
			}
			
			if (ok && window.confirm("Voulez-vous valider la commande sélectionnée ?")) {
				var qValiderCommande = new QueryHttp("Facturation/Affaires/validerCommande.tmpl");
				qValiderCommande.setParam("Commande_Id", comId);
				var result=qValiderCommande.execute();
				var codeErreur=result.responseXML.documentElement.getAttribute("code_erreur");
				if (codeErreur=="1") {
					showWarning("Erreur : la commande ne peut pas être validée !");
				} else if (codeErreur=="2") {
					showWarning("Erreur : la commande ne possède pas de mode de règlement !");
				} else if (codeErreur=="3") {
					showWarning("Erreur : la commande ne contient aucune ligne !");
				} else if (codeErreur=="4") {
					showWarning("Erreur : le client de la commande est à l'état bloqué !");
				} else {
					oma_initStats();
					oma_listerCommandes();
				}
			}
		} else {
			showWarning("Veuillez sélectionner une commande !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oma_pressOnEditionCsv() {
	try {

		var numCommande = document.getElementById('oma-numCommande').value;
		var intituleAffaire = document.getElementById('oma-intituleAffaire').value;
		var loginWeb = document.getElementById('oma-loginWeb').value;
		var nomClient = document.getElementById('oma-nomClient').value;
		var refArticle = document.getElementById('oma-refArticle').value;
		var numFacture = document.getElementById('oma-numFacture').value;
		var numAcompte = document.getElementById('oma-numAcompte').value;
		var numBL = document.getElementById('oma-numBL').value;
		var numRetour = document.getElementById('oma-numRetour').value;
		var numAffaire = document.getElementById('oma-numAffaire').value;
		var etatAffaire = document.getElementById('oma-etatAffaire').value;
		var etatCommande = document.getElementById('oma-etatCommande').value;
		var etatLogistique = document.getElementById('oma-etatLogistique').value;
		var commandeBloquee = document.getElementById('oma-bloque').value;
		var dateCommandeDebut = document.getElementById('oma-dateCommandeDebut').value;
		var dateCommandeFin = document.getElementById('oma-dateCommandeFin').value;
		var dateDelaiDebut = document.getElementById('oma-dateDelaiDebut').value;
		var dateDelaiFin = document.getElementById('oma-dateDelaiFin').value;
		var numClient = document.getElementById('oma-numClient').value;
		var montantTTC = document.getElementById('oma-montantTTC').value;
		var etatPaiement = document.getElementById('oma-etatPaiement').value;
		var modeReglement = document.getElementById('oma-modeReglement').value;
		var provenance = document.getElementById('oma-provenance').value;
		var modeExpedition = document.getElementById('oma-modeExpedition').value;
		var secteurActivite = document.getElementById('oma-secteurActivite').value;
		
		if (!isEmpty(montantTTC) && isNaN(montantTTC)) { showWarning("Le montant TTC est incorrect !"); }
		else if (!isEmpty(dateCommandeDebut) && !isDate(dateCommandeDebut)) { showWarning("Date de début de période incorrecte pour la commande !"); }
		else if (!isEmpty(dateCommandeFin) && !isDate(dateCommandeFin)) { showWarning("Date de fin de période incorrecte pour la commande !"); }
		else if (!isEmpty(dateCommandeDebut) && !isEmpty(dateCommandeFin) && !isDateInterval(dateCommandeDebut, dateCommandeFin)) { showWarning("Plage de dates incorrecte pour la commande !"); }
		else if (!isEmpty(dateDelaiDebut) && !isDate(dateDelaiDebut)) { showWarning("Date de début de période incorrecte pour le délai !"); }
		else if (!isEmpty(dateDelaiFin) && !isDate(dateDelaiFin)) { showWarning("Date de fin de période incorrecte pour le délai !"); }
		else if (!isEmpty(dateDelaiDebut) && !isEmpty(dateDelaiFin) && !isDateInterval(dateDelaiDebut, dateDelaiFin)) { showWarning("Plage de dates incorrecte pour le délai !"); }
		else {
			if (!isEmpty(dateCommandeDebut)) { dateCommandeDebut = prepareDateJava(dateCommandeDebut); }
			if (!isEmpty(dateCommandeFin)) { dateCommandeFin = prepareDateJava(dateCommandeFin); }
			if (!isEmpty(dateDelaiDebut)) { dateDelaiDebut = prepareDateJava(dateDelaiDebut); }
			if (!isEmpty(dateDelaiFin)) { dateDelaiFin = prepareDateJava(dateDelaiFin); }
			
			var qEditionCsv = new QueryHttp("Facturation/Affaires/editionListeCsv.tmpl");
			qEditionCsv.setParam("Mode_Traitement", oma_modeTraitement);
			
			if (oma_modeTraitement=="C") {
				qEditionCsv.setParam("Num_Commande", numCommande);
				qEditionCsv.setParam("Login_Web", loginWeb);
				qEditionCsv.setParam("Nom_Client", nomClient);
				qEditionCsv.setParam("Ref_Article", refArticle);
				qEditionCsv.setParam("Num_Facture", numFacture);
				qEditionCsv.setParam("Num_Acompte", numAcompte);
				qEditionCsv.setParam("Num_BL", numBL);
				qEditionCsv.setParam("Num_Retour", numRetour);
				qEditionCsv.setParam("Etat_Commande", etatCommande);
				qEditionCsv.setParam("Etat_Logistique", etatLogistique);
				qEditionCsv.setParam("Commande_Bloquee", commandeBloquee);
				qEditionCsv.setParam("Date_Commande_Debut", dateCommandeDebut);
				qEditionCsv.setParam("Date_Commande_Fin", dateCommandeFin);
				qEditionCsv.setParam("Date_Delai_Debut", dateDelaiDebut);
				qEditionCsv.setParam("Date_Delai_Fin", dateDelaiFin);
				qEditionCsv.setParam("Num_Client", numClient);
				qEditionCsv.setParam("Montant_TTC", montantTTC);
				qEditionCsv.setParam("Etat_Paiement", etatPaiement);
				qEditionCsv.setParam("Mode_Reglement", modeReglement);
				qEditionCsv.setParam("Provenance", provenance);
				qEditionCsv.setParam("Mode_Expedition", modeExpedition);
				qEditionCsv.setParam("Secteur_Activite", secteurActivite);
				qEditionCsv.setParam("Calcul_Stock", oma_calculStock?"1":"0");
			} else {
				qEditionCsv.setParam("Num_Commande", numCommande);
				qEditionCsv.setParam("Intitule_Affaire", intituleAffaire);
				qEditionCsv.setParam("Login_Web", loginWeb);
				qEditionCsv.setParam("Nom_Client", nomClient);
				qEditionCsv.setParam("Ref_Article", refArticle);
				qEditionCsv.setParam("Num_Facture", numFacture);
				qEditionCsv.setParam("Num_Acompte", numAcompte);
				qEditionCsv.setParam("Num_BL", numBL);
				qEditionCsv.setParam("Num_Retour", numRetour);
				qEditionCsv.setParam("Num_Affaire", numAffaire);
				qEditionCsv.setParam("Etat_Affaire", etatAffaire);
				qEditionCsv.setParam("Date_Commande_Debut", dateCommandeDebut);
				qEditionCsv.setParam("Date_Commande_Fin", dateCommandeFin);
				qEditionCsv.setParam("Date_Delai_Debut", dateDelaiDebut);
				qEditionCsv.setParam("Date_Delai_Fin", dateDelaiFin);
				qEditionCsv.setParam("Num_Client", numClient);
			}
			var result = qEditionCsv.execute();
			var fichier = result.responseXML.documentElement.getAttribute('FichierCsv');
			
			var nomDefaut;
			switch (oma_modeTraitement) {
				case "C": nomDefaut = "listeCommandes.csv"; break;
				case "A": nomDefaut = "listeAffaires.csv"; break;
			}
	
			var file = fileChooser("save", nomDefaut);
			if (file!=null) {
				downloadFile(getDirBuffer()+ fichier, file);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

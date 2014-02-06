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


var omf_aFactures = new Arbre('Facturation/Factu_Fournisseur/liste-facturesFournisseur.tmpl', 'omf-listeFactures');
var omf_aApercuFacture = new Arbre('Facturation/Factu_Fournisseur/liste-apercuFactureFourn.tmpl', 'omf-apercu');
var omf_qGetTotauxFactures = new QueryHttp("Facturation/Factu_Fournisseur/getTotauxFactures.tmpl");

var omf_aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "omf-secteurActivite");
var omf_aModesReglements = new Arbre("ComboListe/combo-modesReglement.tmpl","omf-modeReglement");

var omf_nbLignesParPage;
var omf_pageCourante;
var omf_nbPages;


function omf_init() {
  try {
  	
  	omf_aModesReglements.initTree(omf_initModeReglement);

  } catch (e) {
  	recup_erreur(e);
  }
}

function omf_initModeReglement() {
	try {
		document.getElementById('omf-modeReglement').selectedIndex=0;
		omf_aSecteurs.initTree(omf_initSecteurActivite);
	} catch (e) {
		recup_erreur(e);
	}
}

function omf_initSecteurActivite() {
	try {
		document.getElementById('omf-secteurActivite').selectedIndex=0;
		omf_initCriteres();
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_initCriteres() {
	try {
		
		document.getElementById('omf-numFacture').value = "";
		document.getElementById('omf-fournisseurId').value = "";
		document.getElementById('omf-denomination').value = "";
		document.getElementById('omf-etat').value = "N";
		document.getElementById('omf-dateDebut').value = "";
		document.getElementById('omf-dateFin').value = "";
		document.getElementById('omf-articleId').value = "";
		document.getElementById('omf-etatPaiement').selectedIndex=0;
		document.getElementById('omf-modeReglement').selectedIndex=0;
		document.getElementById('omf-secteurActivite').selectedIndex=0;
		
		omf_listerFactures();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_listerFactures() {
	try {
		
		var numFacture = document.getElementById('omf-numFacture').value;
		var fournisseurId = document.getElementById('omf-fournisseurId').value;
		var denomination = document.getElementById('omf-denomination').value;
		var etat = document.getElementById('omf-etat').value;
		var dateDebut = document.getElementById('omf-dateDebut').value;
		var dateFin = document.getElementById('omf-dateFin').value;
		var articleId = document.getElementById('omf-articleId').value;
		var etatPaiement = document.getElementById('omf-etatPaiement').value;
		var modeReglement = document.getElementById('omf-modeReglement').value;
		var secteurActivite = document.getElementById('omf-secteurActivite').value;
		
		omf_nbLignesParPage = document.getElementById('omf-nbLignesParPage').value;
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("Plage de dates incorrecte !"); }
		else {
			
			omf_pageCourante = 1;
			omf_nbPages = 1;
			document.getElementById('omf-pageDeb').value = 1;
			document.getElementById('omf-pageFin').value = 1;
			document.getElementById('omf-bPrec').disabled = true;
			document.getElementById('omf-bSuiv').disabled = true;
			document.getElementById('omf-totalHT').value = "";
			
			document.getElementById('omf-listeFactures').disabled=true;
			document.getElementById('omf-bEditionCsv').disabled=true;
			document.getElementById('omf-bEditerFactures').disabled=true;
			document.getElementById('omf-numFactureSelect').value = "";
			omf_aApercuFacture.deleteTree();
			omf_aFactures.deleteTree();
			
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			omf_aFactures.setParam("Num_Facture", numFacture);
			omf_aFactures.setParam("Fournisseur_Id", fournisseurId);
			omf_aFactures.setParam("Denomination", denomination);
			omf_aFactures.setParam("Etat", etat);
			omf_aFactures.setParam("Date_Debut", dateDebut);
			omf_aFactures.setParam("Date_Fin", dateFin);
			omf_aFactures.setParam("Article_Id", articleId);
			omf_aFactures.setParam("Etat_Paiement", etatPaiement);
			omf_aFactures.setParam("Mode_Reglement", modeReglement);
			omf_aFactures.setParam("Secteur_Activite", secteurActivite);
			omf_aFactures.setParam("Page_Debut", omf_pageCourante);
			omf_aFactures.setParam("Nb_Lignes_Par_Page", omf_nbLignesParPage);
			
			omf_qGetTotauxFactures.setParam("Num_Facture", numFacture);
			omf_qGetTotauxFactures.setParam("Fournisseur_Id", fournisseurId);
			omf_qGetTotauxFactures.setParam("Denomination", denomination);
			omf_qGetTotauxFactures.setParam("Etat", etat);
			omf_qGetTotauxFactures.setParam("Date_Debut", dateDebut);
			omf_qGetTotauxFactures.setParam("Date_Fin", dateFin);
			omf_qGetTotauxFactures.setParam("Article_Id", articleId);
			omf_qGetTotauxFactures.setParam("Etat_Paiement", etatPaiement);
			omf_qGetTotauxFactures.setParam("Mode_Reglement", modeReglement);
			omf_qGetTotauxFactures.setParam("Secteur_Activite", secteurActivite);
			omf_qGetTotauxFactures.setParam("Nb_Lignes_Par_Page", omf_nbLignesParPage);
			
			omf_aFactures.initTree(omf_initTotaux);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_initTotaux() {
	try {
		var result = omf_qGetTotauxFactures.execute();
		var contenu = result.responseXML.documentElement;
		document.getElementById('omf-totalHT').value = contenu.getAttribute("Total_HT");
		omf_nbPages = contenu.getAttribute("Nb_Pages");
		
		omf_initPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_initPagination() {
	try {
		document.getElementById('omf-pageDeb').value = omf_pageCourante;
		document.getElementById('omf-pageFin').value = (omf_nbPages>0?omf_nbPages:1);
		document.getElementById('omf-bPrec').disabled = (omf_pageCourante==1);
		document.getElementById('omf-bSuiv').disabled = (omf_pageCourante>=omf_nbPages); // peut se produire si omf_nbPages=0
		
		document.getElementById('omf-listeFactures').disabled=false;
		document.getElementById('omf-bEditionCsv').disabled=(omf_aFactures.nbLignes()==0);
		document.getElementById('omf-bEditerFactures').disabled=(omf_aFactures.nbLignes()==0);
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_pressOnPagePrec() {
	try {
		omf_pageCourante--;
		omf_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_pressOnPageSuiv() {
	try {
		omf_pageCourante++;
		omf_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_majPagination() {
	try {
		document.getElementById('omf-pageDeb').value = omf_pageCourante;
		document.getElementById('omf-bPrec').disabled = (omf_pageCourante==1);
		document.getElementById('omf-bSuiv').disabled = (omf_pageCourante==omf_nbPages);
		
		document.getElementById('omf-numFactureSelect').value = "";
		
		document.getElementById('omf-listeFactures').disabled = true;
		document.getElementById('omf-bEditionCsv').disabled = true;
		document.getElementById('omf-bEditerFactures').disabled = true;
		omf_aApercuFacture.deleteTree();
		
		omf_aFactures.setParam("Page_Debut", omf_pageCourante);
		omf_aFactures.initTree(omf_afterMajPagination);
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_afterMajPagination() {
	try {
		document.getElementById('omf-listeFactures').disabled = false;
		document.getElementById('omf-bEditionCsv').disabled=(omf_aFactures.nbLignes()==0);
		document.getElementById('omf-bEditerFactures').disabled=(omf_aFactures.nbLignes()==0);
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_selectOnListeFactures() {
	try {
		if (omf_aFactures.isSelected()) {
			var i = omf_aFactures.getCurrentIndex();
			var factId = omf_aFactures.getCellText(i, 'omf-colFactureId');
			var typeDoc = omf_aFactures.getCellText(i, 'omf-colTypeDoc');
			var numFacture = omf_aFactures.getCellText(i, 'omf-colNumFacture');
			document.getElementById('omf-numFactureSelect').value = numFacture;
			omf_aApercuFacture.setParam("Facture_Id", factId);
			omf_aApercuFacture.setParam("Type_Doc", typeDoc);
			omf_aApercuFacture.initTree();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_pressOnNouvelleFacture() {
	try {

		document.getElementById('deck').selectedIndex=1;
		document.getElementById('bMenuFactures').collapsed=false;
		oef_nouvelleFacture();

	} catch (e) {
		recup_erreur(e);
	}
}


function omf_pressOnNouvelAvoir() {
	try {

		document.getElementById('deck').selectedIndex=2;
		document.getElementById('bMenuFactures').collapsed=false;
		oea_nouvelAvoir();

	} catch (e) {
		recup_erreur(e);
	}
}


function omf_pressOnCritere(ev) {
  try {

		if (ev.keyCode==13) {
			omf_listerFactures();
    }

	} catch (e) {
  	recup_erreur(e);
  }
}


function omf_pressOnListeFactures(ev) {
  try {

		if (ev.keyCode==13) {
			omf_ouvrirFacture();
    }

	} catch (e) {
  	recup_erreur(e);
  }
}


function omf_ouvrirFacture() {
  try {

  	if (omf_aFactures.isSelected()) {
	  	var i = omf_aFactures.getCurrentIndex();
	  	var typeDoc = omf_aFactures.getCellText(i, 'omf-colTypeDoc');
	  	if (typeDoc=="FF") {
				factureId = omf_aFactures.getCellText(i, 'omf-colFactureId');
				document.getElementById('deck').selectedIndex=1;
				oef_chargerFacture();
	  	} else {
	  		avoirId = omf_aFactures.getCellText(i, 'omf-colFactureId');
				document.getElementById('deck').selectedIndex=2;
				oea_chargerAvoir();
	  	}
			document.getElementById('bMenuFactures').collapsed=false;
  	}
  	
	} catch (e) {
  	recup_erreur(e);
  }
}


function omf_pressOnEditionCsv() {
	try {

		var numFacture = document.getElementById('omf-numFacture').value;
		var fournisseurId = document.getElementById('omf-fournisseurId').value;
		var denomination = document.getElementById('omf-denomination').value;
		var etat = document.getElementById('omf-etat').value;
		var dateDebut = document.getElementById('omf-dateDebut').value;
		var dateFin = document.getElementById('omf-dateFin').value;
		var articleId = document.getElementById('omf-articleId').value;
		var etatPaiement = document.getElementById('omf-etatPaiement').value;
		var modeReglement = document.getElementById('omf-modeReglement').value;
		var secteurActivite = document.getElementById('omf-secteurActivite').value;

		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("Plage de dates incorrecte !"); }
		else {
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			var qEditionCsv = new QueryHttp("Facturation/Factu_Fournisseur/csvListeFactures.tmpl");
			qEditionCsv.setParam("Num_Facture", numFacture);
			qEditionCsv.setParam("Fournisseur_Id", fournisseurId);
			qEditionCsv.setParam("Denomination", denomination);
			qEditionCsv.setParam("Etat", etat);
			qEditionCsv.setParam("Date_Debut", dateDebut);
			qEditionCsv.setParam("Date_Fin", dateFin);
			qEditionCsv.setParam("Article_Id", articleId);
			qEditionCsv.setParam("Etat_Paiement", etatPaiement);
			qEditionCsv.setParam("Mode_Reglement", modeReglement);
			qEditionCsv.setParam("Secteur_Activite", secteurActivite);

			var result = qEditionCsv.execute();
			var fichier = result.responseXML.documentElement.getAttribute('FichierCSV');

			var file = fileChooser("save", "listeFactures.csv");
			if (file!=null) {
				downloadFile(getDirBuffer()+ fichier, file);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function omf_pressOnEditerFactures() {
	try {
		var numFacture = document.getElementById('omf-numFacture').value;
		var fournisseurId = document.getElementById('omf-fournisseurId').value;
		var denomination = document.getElementById('omf-denomination').value;
		var etat = document.getElementById('omf-etat').value;
		var dateDebut = document.getElementById('omf-dateDebut').value;
		var dateFin = document.getElementById('omf-dateFin').value;
		var articleId = document.getElementById('omf-articleId').value;
		var etatPaiement = document.getElementById('omf-etatPaiement').value;
		var modeReglement = document.getElementById('omf-modeReglement').value;
		var secteurActivite = document.getElementById('omf-secteurActivite').value;
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("Plage de dates incorrecte !"); }
		else {
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			document.getElementById('omf-pdfFactures').setAttribute("src", null);
			
			var qGenPdf = new QueryHttp("Facturation/Factu_Fournisseur/pdfEditionFactures.tmpl");
			qGenPdf.setParam("Num_Facture", numFacture);
			qGenPdf.setParam("Fournisseur_Id", fournisseurId);
			qGenPdf.setParam("Denomination", denomination);
			qGenPdf.setParam("Etat", etat);
			qGenPdf.setParam("Date_Debut", dateDebut);
			qGenPdf.setParam("Date_Fin", dateFin);
			qGenPdf.setParam("Article_Id", articleId);
			qGenPdf.setParam("Etat_Paiement", etatPaiement);
			qGenPdf.setParam("Mode_Reglement", modeReglement);
			qGenPdf.setParam("Secteur_Activite", secteurActivite);
			var result = qGenPdf.execute();
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('FichierPDF');
			document.getElementById('omf-deckMenu').selectedIndex=1;
			document.getElementById('bMenuFactures').collapsed=false;
			document.getElementById('omf-pdfFactures').setAttribute("src", page);
		}
			
	} catch (e) {
		recup_erreur(e);
	}
}

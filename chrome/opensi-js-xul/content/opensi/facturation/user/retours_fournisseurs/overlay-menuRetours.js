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


var omr_chargement;

var omr_nbLignesParPage;
var omr_pageCourante;
var omr_nbPages;

var omr_aListeRetours = new Arbre("Facturation/Retours_Fournisseurs/liste-retours.tmpl", "omr-listeRetours");
var omr_qGetInfosListeRetours = new QueryHttp("Facturation/Retours_Fournisseurs/getInfosListeRetoursFournisseurs.tmpl");
var omr_aApercuRetour = new Arbre("Facturation/Retours_Fournisseurs/liste-apercuRetour.tmpl", "omr-apercuRetour");


function omr_init() {
	try {

  	omr_chargement = true;
  	document.getElementById('omr-boxNouveauRetour').collapsed = true;
		
		document.getElementById('omr-nbLignesParPage').selectedIndex=0;
		omr_initCriteres();
		
	} catch (e) {
		recup_erreur(e);
	}
}



function omr_pressOnNouveauRetour() {
	try {
		document.getElementById("bRetourGestionRetour").collapsed=false;
		document.getElementById("deck").selectedIndex=1;
		oebr_nouveauBon();
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_initCriteres() {
	try {
		
		document.getElementById('omr-numRetour').value="";
		document.getElementById('omr-numFournisseur').value="";
		document.getElementById('omr-nomFournisseur').value="";
		document.getElementById('omr-dateBonDebut').value="";
		document.getElementById('omr-dateBonFin').value="";
		document.getElementById('omr-refArticle').value="";
		document.getElementById('omr-etatRetour').value = "TS";
		document.getElementById('omr-typeRetour').value = "TS";
		
		omr_listerRetours();
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			omr_listerRetours();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_listerRetours() {
	try {

		var numRetour = document.getElementById('omr-numRetour').value;
		var numFournisseur = document.getElementById('omr-numFournisseur').value;
		var nomFournisseur = document.getElementById('omr-nomFournisseur').value;
		var dateBonDebut = document.getElementById('omr-dateBonDebut').value;
		var dateBonFin = document.getElementById('omr-dateBonFin').value;
		var refArticle = document.getElementById('omr-refArticle').value;
		var etat = document.getElementById('omr-etatRetour').value;
		var type = document.getElementById('omr-typeRetour').value;
		
		omr_nbLignesParPage = document.getElementById('omr-nbLignesParPage').value;
		
		if (!isEmpty(dateBonDebut) && !isDate(dateBonDebut)) { showWarning("Date de début de période incorrecte !"); }
		else if (!isEmpty(dateBonFin) && !isDate(dateBonFin)) { showWarning("Date de fin de période incorrecte !"); }
		else if (!isEmpty(dateBonDebut) && !isEmpty(dateBonFin) && !isDateInterval(dateBonDebut, dateBonFin)) { showWarning("Plage de dates incorrecte !"); }
		else {
			document.getElementById('omr-listeRetours').disabled = true;
			document.getElementById('omr-bEditionCsv').disabled = true;
			if (!isEmpty(dateBonDebut)) { dateBonDebut = prepareDateJava(dateBonDebut); }
			if (!isEmpty(dateBonFin)) { dateBonFin = prepareDateJava(dateBonFin); }
	
			document.getElementById('omr-numRetourSelect').value = "";
			omr_aApercuRetour.deleteTree();
			omr_aListeRetours.deleteTree();
			
			omr_pageCourante = 1;
			omr_nbPages = 1;
			document.getElementById('omr-pageDeb').value = 1;
			document.getElementById('omr-pageFin').value = 1;
			document.getElementById('omr-bPrec').disabled = true;
			document.getElementById('omr-bSuiv').disabled = true;
			
			omr_aListeRetours.setParam("Num_Retour", numRetour);
			omr_aListeRetours.setParam("Num_Fournisseur", numFournisseur);
			omr_aListeRetours.setParam("Nom_Fournisseur", nomFournisseur);
			omr_aListeRetours.setParam("Date_Bon_Debut", dateBonDebut);
			omr_aListeRetours.setParam("Date_Bon_Fin", dateBonFin);
			omr_aListeRetours.setParam("Ref_Article", refArticle);
			omr_aListeRetours.setParam("Etat_Retour", etat);
			omr_aListeRetours.setParam("Type_Retour", type);
			omr_aListeRetours.setParam("Page_Debut", omr_pageCourante);
			omr_aListeRetours.setParam("Nb_Lignes_Par_Page", omr_nbLignesParPage);
			
			omr_qGetInfosListeRetours.setParam("Num_Retour", numRetour);
			omr_qGetInfosListeRetours.setParam("Num_Fournisseur", numFournisseur);
			omr_qGetInfosListeRetours.setParam("Nom_Fournisseur", nomFournisseur);
			omr_qGetInfosListeRetours.setParam("Date_Bon_Debut", dateBonDebut);
			omr_qGetInfosListeRetours.setParam("Date_Bon_Fin", dateBonFin);
			omr_qGetInfosListeRetours.setParam("Ref_Article", refArticle);
			omr_qGetInfosListeRetours.setParam("Etat_Retour", etat);
			omr_qGetInfosListeRetours.setParam("Type_Retour", type);
			omr_qGetInfosListeRetours.setParam("Nb_Lignes_Par_Page", omr_nbLignesParPage);
			
			omr_aListeRetours.initTree(omr_initInfosListe);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_initInfosListe() {
	try {
		var result = omr_qGetInfosListeRetours.execute();
		var contenu = result.responseXML.documentElement;
		omr_nbPages = contenu.getAttribute("Nb_Pages");
		
		omr_initPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_initPagination() {
	try {
		document.getElementById('omr-pageDeb').value = omr_pageCourante;
		document.getElementById('omr-pageFin').value = (omr_nbPages>0?omr_nbPages:1);
		document.getElementById('omr-bPrec').disabled = (omr_pageCourante==1);
		document.getElementById('omr-bSuiv').disabled = (omr_pageCourante>=omr_nbPages); // peut se produire si omr_nbPages=0
		
		document.getElementById('omr-listeRetours').disabled = false;
		document.getElementById('omr-bEditionCsv').disabled = (omr_aListeRetours.nbLignes()==0);
		
		if (omr_chargement) {
			document.getElementById('omr-boxNouveauRetour').collapsed = false;
			omr_chargement=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_pressOnPagePrec() {
	try {
		omr_pageCourante--;
		omr_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_pressOnPageSuiv() {
	try {
		omr_pageCourante++;
		omr_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_majPagination() {
	try {
		document.getElementById('omr-pageDeb').value = omr_pageCourante;
		document.getElementById('omr-bPrec').disabled = (omr_pageCourante==1);
		document.getElementById('omr-bSuiv').disabled = (omr_pageCourante==omr_nbPages);
		
		document.getElementById('omr-numRetourSelect').value = "";
		
		document.getElementById('omr-listeRetours').disabled = true;
		document.getElementById('omr-bEditionCsv').disabled = true;
		omr_aApercuRetour.deleteTree();
		
		omr_aListeRetours.setParam("Page_Debut", omr_pageCourante);
		omr_aListeRetours.initTree(omr_afterMajPagination);
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_afterMajPagination() {
	try {
		document.getElementById('omr-listeRetours').disabled = false;
		document.getElementById('omr-bEditionCsv').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_selectOnListeRetours() {
	try {
		if (omr_aListeRetours.isSelected()) {
			var i = omr_aListeRetours.getCurrentIndex();
			var retourId = omr_aListeRetours.getCellText(i, "omr-colRetourId");
			document.getElementById('omr-numRetourSelect').value = "Aperçu du retour N° "+ omr_aListeRetours.getCellText(i, "omr-colNumRetour") +" :";
			omr_listerApercuRetour(retourId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_pressOnListeRetours() {
	try {
		if (omr_aListeRetours.isSelected()) {
			var i = omr_aListeRetours.getCurrentIndex();
			bonRetourId = omr_aListeRetours.getCellText(i, "omr-colRetourId");
			oebr_chargerBon();
			document.getElementById("deck").selectedIndex=1;
			document.getElementById("bRetourGestionRetour").collapsed=false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_listerApercuRetour(id) {
	try {
		omr_aApercuRetour.setParam("Retour_Id", id);
		omr_aApercuRetour.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function omr_pressOnEditionCsv() {
	try {
		
		var numRetour = document.getElementById('omr-numRetour').value;
		var numFournisseur = document.getElementById('omr-numFournisseur').value;
		var nomFournisseur = document.getElementById('omr-nomFournisseur').value;
		var dateBonDebut = document.getElementById('omr-dateBonDebut').value;
		var dateBonFin = document.getElementById('omr-dateBonFin').value;
		var refArticle = document.getElementById('omr-refArticle').value;
		var etat = document.getElementById('omr-etatRetour').value;
		var type = document.getElementById('omr-typeRetour').value;

		if (!isEmpty(dateBonDebut) && !isDate(dateBonDebut)) { showWarning("Date de début de période incorrecte !"); }
		else if (!isEmpty(dateBonFin) && !isDate(dateBonFin)) { showWarning("Date de fin de période incorrecte !"); }
		else if (!isEmpty(dateBonDebut) && !isEmpty(dateBonFin) && !isDateInterval(dateBonDebut, dateBonFin)) { showWarning("Plage de dates incorrecte !"); }
		else {
			
			var qEditionCsv = new QueryHttp("Facturation/Retours_Fournisseurs/editionListeCsv.tmpl");
			qEditionCsv.setParam("Num_Retour", numRetour);
			qEditionCsv.setParam("Num_Fournisseur", numFournisseur);
			qEditionCsv.setParam("Nom_Fournisseur", nomFournisseur);
			qEditionCsv.setParam("Date_Bon_Debut", dateBonDebut);
			qEditionCsv.setParam("Date_Bon_Fin", dateBonFin);
			qEditionCsv.setParam("Ref_Article", refArticle);
			qEditionCsv.setParam("Etat_Retour", etat);
			qEditionCsv.setParam("Type_Retour", type);
			
			var result = qEditionCsv.execute();
			var fichier = result.responseXML.documentElement.getAttribute('FichierCSV');
			
			var nomDefaut = "listeRetours.csv";
	
			var file = fileChooser("save", nomDefaut);
			if (file!=null) {
				downloadFile(getDirBuffer()+ fichier, file);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

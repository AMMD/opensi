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

var ola_aAbonnement;

// variables de filtre
var ola_nbPages;
var ola_pageCourante;
var ola_etat;

var ola_nbLignesPages = 30;

function ola_init() {
	try {
		document.getElementById("ola-filtreEtat").selectedIndex = 2
		ola_etat = "T";
		
  		ola_reset();
	} catch (e) {
  		recup_erreur(e);
	}
}

function ola_desactiveMenu() {
	try {
		// le menulist
		document.getElementById("ola-filtreEtat").disabled = true;
		
		// les boutons de pagination
		document.getElementById("ola-bPrec").disabled = true;
		document.getElementById("ola-bSuiv").disabled = true;
	} catch (e) {
		recup_erreur(e);
	}
}

function ola_activeMenu() {
	try {
		// le menulist
		document.getElementById("ola-filtreEtat").disabled = false;
		
		// et les boutons de pagination
		document.getElementById("ola-bPrec").disabled = !(ola_pageCourante>1);
		document.getElementById("ola-bSuiv").disabled = !(ola_pageCourante<ola_nbPages);
		document.getElementById("ola-pageDeb").value = ola_pageCourante;
		document.getElementById("ola-pageFin").value = (ola_nbPages==0)?"1":ola_nbPages;
	} catch (e) {
		recup_erreur(e);
	}
}

function ola_initNbPages() {
	try {
		ola_nbPages = 0;
		var queryTotaux = new QueryHttp("Compta/Abonnement/getTotauxListeAbonnement.tmpl");
		queryTotaux.setParam("Nb_Lignes_Par_Page", ola_nbLignesPages);
		queryTotaux.setParam("Etat", ola_etat);
		
		var result = queryTotaux.execute();
		ola_nbPages = result.responseXML.documentElement.getAttribute("Nb_Pages");
	} catch (e) {
		recup_erreur(e);
	}
}

function ola_initListe() {
	try {	
  		ola_aAbonnement = new Arbre("Compta/Abonnement/listeAbonnement.tmpl","ola-treeAbonnement");
  		if (ola_etat!="*") {
  			ola_aAbonnement.setParam("Etat", ola_etat);
  		}
  		ola_aAbonnement.setParam("Page_Courante", ola_pageCourante);
  		ola_aAbonnement.setParam("Nb_Lignes_Par_Page", ola_nbLignesPages);
  		ola_aAbonnement.initTree(ola_activeMenu);
	} catch (e) {
  		recup_erreur(e);
	}
}

function ola_selectOnFiltreEtat() {
	try {
  		var menu = document.getElementById("ola-filtreEtat");
  		switch (menu.value) {
  			case "0" : ola_etat = "*"; break;
  			case "1" : ola_etat = "N"; break;
  			case "2" : ola_etat = "T"; break;
  			case "3" : ola_etat = "A"; break;
  			case "4" : ola_etat = "C"; break;
  			default : alert("bug");
  		}
  		
  		ola_reset();
	} catch (e) {
  		recup_erreur(e);
	}
}

function ola_dblClickOnTreeAbonnement() {
	try {
 		if (ola_aAbonnement.isSelected()) {
  			var index = ola_aAbonnement.getCurrentIndex();
  			var id = ola_aAbonnement.getCellText(index,"ola-colAbonnementId");
  			document.getElementById("bRetourListeAbonnement").collapsed = false;
  			changeDeck(1);
  			ofa_ouvrir(id);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ola_pressOnPrec() {
	try {
  		ola_desactiveMenu();
  		ola_pageCourante--;
  		ola_initListe();
	} catch (e) {
		recup_erreur(e);
	}
}

function ola_pressOnSuiv() {
	try {
  		ola_desactiveMenu();
  		ola_pageCourante++;
  		ola_initListe();
	} catch (e) {
		recup_erreur(e);
	}
}

function ola_pressOnNouveau() {
	try {
  		document.getElementById("bRetourListeAbonnement").collapsed = false;
		changeDeck(1);
		ofa_nouveau();
	} catch (e) {
		recup_erreur(e);
	}
}

function ola_pressOnCsv() {
	try {
		ola_editCsv();
	} catch (e) {
		recup_erreur(e);
	}
}

function ola_editCsv() {
 	try {
 		var qCSV = new QueryHttp("Compta/Abonnement/editionCsvAbo.tmpl");
 		qCSV.setParam("Etat", ola_etat);
 		
 		var result = qCSV.execute();
 		
 		var fichier = result.responseXML.documentElement.getAttribute("FichierCsv");
 		var nomFichier = "liste_abonnement.csv";
 		
 		var file = fileChooser("save", nomFichier);
 		
 		if (file!=null) {
 			downloadFile(getDirBuffer()+fichier,file);
 		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function ola_reset() {
	try {
  		// on réinitialise la page courante, le nombre de pages et on recharge le tableau
  		ola_desactiveMenu();
  		ola_pageCourante = 1;
  		ola_initNbPages();
  		ola_initListe();
	} catch (e) {
		recup_erreur(e);
	}
}
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

var oli_aListeImport;

// variables de filtre
var oli_aFiltreJournaux;
var oli_filtreEtat;
var oli_filtreJournal;
var oli_filtreDateModif;

var oli_nbPages;
var oli_pageCourante;

var oli_nbLignesPages = 30;

function oli_init() {
	try {
		// init des filtres
		oli_aFiltreJournaux = new Arbre('Compta/ImportBanque/comboJournauxTR.tmpl', 'oli-filtreJournal');
  		oli_aFiltreJournaux.initTree();
  		
		document.getElementById("oli-filtreEtat").selectedIndex = 0;
		oli_filtreEtat = document.getElementById('oli-filtreEtat').value;
		document.getElementById("oli-filtreJournal").selectedIndex = 0;
		oli_filtreJournal = document.getElementById('oli-filtreJournal').value;
		oli_filtreDateModif = document.getElementById('oli-filtreDateModif').value;
		
		// initialisation de la liste d'import
		oli_aListeImport = new Arbre('Compta/ImportBanque/listeImport.tmpl','oli-treeImport');
		oli_reset(); 
		
	} catch (e) {
  		recup_erreur(e);
	}
}

function oli_initListe() {
	try {
		var go = true;
		oli_aListeImport.clearParams();
		
		oli_aListeImport.setParam('etatImport', oli_filtreEtat);
		oli_aListeImport.setParam('journalImport', oli_filtreJournal);
		
		if (!isEmpty(oli_filtreDateModif)) {
			oli_aListeImport.setParam('dateModifImport', oli_filtreDateModif);
		}
		
  		oli_aListeImport.setParam('pageCourante', oli_pageCourante);
  		oli_aListeImport.setParam('nbLignesParPage', oli_nbLignesPages);
  		
  		oli_aListeImport.initTree(oli_activeMenu());
	} catch (e) {
		recup_erreur(e);
	}
}

function oli_initNbPages() {
	try {
		oli_nbPages = 0;
		var go = true;
		
		var queryTotaux = new QueryHttp("Compta/ImportBanque/getTotauxListeImport.tmpl");
		
		queryTotaux.setParam('etatImport', oli_filtreEtat);
		queryTotaux.setParam('journalImport', oli_filtreJournal);
		if (!isEmpty(oli_filtreDateModif)) {
			queryTotaux.setParam('dateModifImport', oli_filtreDateModif);
		}
		
		queryTotaux.setParam('nbLignesParPage', oli_nbLignesPages);
		
		var result = queryTotaux.execute();
		oli_nbPages = result.responseXML.documentElement.getAttribute("nbPages");
	} catch (e) {
		recup_erreur(e);
	}
}

function oli_activeMenu() {
	try {
		document.getElementById('oli-filtreDateModif').disabled = false;
		document.getElementById('oli-filtreEtat').disabled = false;
		document.getElementById('oli-filtreJournal').disabled = false;
		document.getElementById('oli-nouvelImport').disabled = false;
		
		document.getElementById('oli-bPrec').disabled = !(oli_pageCourante>1);
		document.getElementById('oli-bSuiv').disabled = !(oli_pageCourante<oli_nbPages);
		document.getElementById('oli-pageDeb').value = oli_pageCourante;
		document.getElementById('oli-pageFin').value = (oli_nbPages==0)?"1":oli_nbPages;
	} catch (e) {
		recup_erreur(e);
	}
}

function oli_desactiveMenu() {
	try {
		document.getElementById('oli-filtreDateModif').disabled = true;
		document.getElementById('oli-filtreEtat').disabled = true;
		document.getElementById('oli-filtreJournal').disabled = true;
		document.getElementById('oli-nouvelImport').disabled = true;
		document.getElementById('oli-bPrec').disabled = true;
		document.getElementById('oli-bSuiv').disabled = true;
	} catch (e) {
		recup_erreur(e);
	}
} 

function oli_reset() {
	try {
		var go = true;
		// récupération des variables de filtre
		oli_filtreEtat = document.getElementById('oli-filtreEtat').value;
		oli_filtreJournal = document.getElementById('oli-filtreJournal').value;
		
		oli_filtreDateModif = document.getElementById('oli-filtreDateModif').value;
		if (!isEmpty(oli_filtreDateModif)) {
			if (!isDate(oli_filtreDateModif)) {
				showWarning("Date incorrecte !");
				go = false;
			} else {
				oli_filtreDateModif = prepareDateJava(oli_filtreDateModif);
			}
		}
	
		// réinitialistion
		if (go) {
			oli_desactiveMenu();
	  		oli_pageCourante = 1;
	  		oli_initNbPages();
	  		oli_initListe();
	  	}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oli_keyPressOnDateModif(event) {
	try {
		if (event.keyCode==13) {
			oli_reset();
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oli_selectOnFiltreJournal() {
	try {
		oli_reset();
	} catch (e) {
  		recup_erreur(e);
	}
}

function oli_selectOnFiltreEtat() {
	try {
		oli_reset();
	} catch (e) {
  		recup_erreur(e);
	}
}

function oli_pressOnNouveau() {
	try {
  		document.getElementById('bRetourListeImports').collapsed = false;
		changeDeck(1);
		oib_nouveau();
	} catch (e) {
		recup_erreur(e);
	}
}

function oli_pressOnPrec() {
	try {
  		oli_desactiveMenu();
  		oli_pageCourante--;
  		oli_initListe();
	} catch (e) {
		recup_erreur(e);
	}
}

function oli_pressOnSuiv() {
	try {
  		oli_desactiveMenu();
  		oli_pageCourante++;
  		oli_initListe();
	} catch (e) {
		recup_erreur(e);
	}
}

function oli_dblClickOnTreeImport() {
 	try {
 		if (oli_aListeImport.isSelected()) {
  			var index = oli_aListeImport.getCurrentIndex();
  			var id = oli_aListeImport.getCellText(index,'oli-colImportId');
  			document.getElementById('bRetourListeImports').collapsed = false;
  			changeDeck(1);
  			oib_ouvrir(id);
		}
 	} catch (e) {
 		recup_erreur(e);
 	}
 }

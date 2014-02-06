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

var ole_aFiltreJournaux;
var ole_aListeEcheance;

// variables de filtre
var ole_journal;
var ole_dateDeb;
var ole_dateFin;
var ole_chkNonEchues;

function ole_init() {
  try {
  		// init des variables de filtre
  		ole_journal = 0;
  		ole_dateDeb = "";
  		ole_dateFin = "";
  		ole_chkNonEchues = false;
  		
  		// init de la liste de journaux
  		ole_desactiveMenu();
  		ole_aFiltreJournaux = new Arbre('Compta/GetRDF/combo-journauxSansAN.tmpl', 'ole-filtreJournal');
  		  		
  		// init de la liste d'échéances
  		ole_aListeEcheance = new Arbre('Compta/Abonnement/listeEcheance.tmpl', 'ole-listEcheance');
  		
  		var sia = new SyncInitArbre(ole_finInit);
  		sia.add(ole_aFiltreJournaux);
  		sia.add(ole_aListeEcheance);
  		ole_desactiveMenu();
  		sia.load();
	} catch (e) {
  		recup_erreur(e);
	}
}

function ole_finInit() {
	try {
		ole_activeMenu();
	} catch (e) {
  		recup_erreur(e);
	}
}

function ole_desactiveMenu() {
	try {
		// le filtre de journal
  		document.getElementById("ole-filtreJournal").disabled = true;
  		
  		// les dates d'échéance
  		document.getElementById("ole-dateDebut").disabled = true;
  		document.getElementById("ole-dateFin").disabled = true;
  		
  		// la case non échues
  		document.getElementById("ole-chkAffEcheancesNonEchues").disabled = true;
  		
  		// la liste d'échéances
  		document.getElementById("ole-listEcheance").disabled = true;
	} catch (e) {
  		recup_erreur(e);
	}
}

function ole_activeMenu() {
	try {
		// le filtre de journal
  		document.getElementById("ole-filtreJournal").disabled = false;
  		// les dates d'échéance
  		document.getElementById("ole-dateDebut").disabled = false;
  		document.getElementById("ole-dateFin").disabled = false;
  		// la case non échues
  		document.getElementById("ole-chkAffEcheancesNonEchues").disabled = false;
  		// la liste d'échéances
  		document.getElementById("ole-listEcheance").disabled = false;
	} catch (e) {
  		recup_erreur(e);
	}
}

function ole_cocher() {
	try {
  		var listbox = document.getElementById("ole-listEcheance");
		var item = listbox.getSelectedItem(0);
		var cks = item.getElementsByTagName("listcell");
		if (cks.item(0).getAttribute("checked")=="false") {
			cks.item(0).setAttribute("checked","true");
		} else {
			cks.item(0).setAttribute("checked","false");
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function ole_toutCocher(id, b) {
	try {
		var listbox = document.getElementById(id);

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			for(var i=0; i<nbLignes; i++) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				cks.item(0).setAttribute("checked", b);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnFiltreJournal() {
	try {
		var menu = document.getElementById("ole-filtreJournal");
		ole_journal = menu.value;
		ole_initArbre();
	} catch (e) {
		recup_erreur(e);
	}
}

function ole_chkAffEcheances() {
	try {
		ole_chkNonEchues = !ole_chkNonEchues;
		ole_initArbre();
	} catch (e) {
		recup_erreur(e);
	}
}

function ole_keyPressOnDateDebut(event) {
	try {
		if (event.keyCode==13) {
			ole_initArbre();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ole_keyPressOnDateFin(event) {
	try {
		if (event.keyCode==13) {
			ole_initArbre();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ole_initArbre() {
	try {
		var go = false;
		// check date
		ole_dateDeb = document.getElementById('ole-dateDebut').value;
		ole_dateFin = document.getElementById('ole-dateFin').value;
		
		if (!isEmpty(ole_dateDeb) && !isDate(ole_dateDeb)) { showWarning("Date de début incorrecte !"); }
		else if (!isEmpty(ole_dateFin) && !isDate(ole_dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(ole_dateDeb) && !isEmpty(ole_dateFin) && !isDateInterval(ole_dateDeb, ole_dateFin)) { showWarning("Période incorrecte !"); }
		else {
			// les dates ne sont pas malformées, ou bien n'existent pas
			go = true;
			if (!isEmpty(ole_dateDeb)) { ole_dateDeb = prepareDateJava(ole_dateDeb); }
			if (!isEmpty(ole_dateFin)) { ole_dateFin = prepareDateJava(ole_dateFin); }
		}
		
		// init
		if (go) {
			ole_aListeEcheance.clearParams();
			if (ole_journal!=0) {
				ole_aListeEcheance.setParam("Journal", ole_journal);
			}
			if (!isEmpty(ole_dateDeb)) {
				ole_aListeEcheance.setParam("DateDeb", ole_dateDeb);
			}
			if (!isEmpty(ole_dateFin)) {
				ole_aListeEcheance.setParam("DateFin", ole_dateFin);
			}
			if (ole_chkNonEchues) {
				ole_aListeEcheance.setParam("NonEchue", ole_chkNonEchues);
			}
	  		ole_aListeEcheance.initTree(ole_activeMenu);
  		}
		
	} catch (e) {
		recup_erreur(e);
	}
}

function ole_pressOnGenerer() {
	try {
		if (document.getElementById("ole-listEcheance").getRowCount()==0) { showWarning("Aucune échéance à générer sur la page !");	}
		else if (!existEcheanceCochee()) { showWarning("Veuillez cocher au moins une échéance !");	}
		else if (window.confirm("Voulez-vous générer les écritures sélectionnées ?")) {
			ole_genererListeEcriture();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function existEcheanceCochee() {
	try {
		var trouve = false;
		var listbox = document.getElementById("ole-listEcheance");
		var nbLignes = listbox.getRowCount();
		var i = 0;
		while (i<nbLignes && !trouve) {
			var item = listbox.getItemAtIndex(i);
			var cks = item.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="true") {
				trouve=true;
			} 
			i++;
		}
		return trouve;
	} catch (e) {
		recup_erreur(e);
	}
}

function ole_genererListeEcriture() {
	try {
		var queryGen = new QueryHttp("Compta/Abonnement/genListeEcriture.tmpl");
		
		var liste="";
		var listbox = document.getElementById("ole-listEcheance");
		var nbLignes = listbox.getRowCount();
		var i = 0;
		while (i<nbLignes) {
			var item = listbox.getItemAtIndex(i);
			var cks = item.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="true") {
				liste+=cks.item(3).getAttribute("label")+",";
			} 
			i++;
		}
		queryGen.setParam("Liste_Ech_Id", liste);
		
		var result = queryGen.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			ole_initArbre();
			ola_reset();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ole_pressOnActualiser() {
	try {
		ole_initArbre();
	} catch (e) {
		recup_erreur(e);
	}
}

function ole_pressOnReinit() {
	try {
		ole_journal = 0;
		document.getElementById("ole-filtreJournal").value = ole_journal;
		document.getElementById('ole-dateDebut').value = "";
		document.getElementById('ole-dateFin').value = "";
		ole_chkNonEchues = false;
		document.getElementById('ole-chkAffEcheancesNonEchues').checked = ole_chkNonEchues;
		ole_initArbre();
	} catch (e) {
		recup_erreur(e);
	}
}
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

var or_aRelances = new Arbre("Facturation/Suivi_Reglements_Clients/liste-relances.tmpl","or-listeRelances");
var or_aRelancesEnCours = new Arbre("Facturation/Suivi_Reglements_Clients/liste-relances.tmpl","or-listeRelancesEnCours");
var or_aDernieresRelances = new Arbre("Facturation/Suivi_Reglements_Clients/combo-dernieresRelances.tmpl","or-dernieresRelances");

var or_premiereEdition;
var or_dateReedition;


function or_init() {
	try {
		document.getElementById('or-listeRelances').disabled = true;
		document.getElementById('or-listeRelancesEnCours').disabled = true;
		or_aRelances.setParam("Etat","relances");
		or_aRelances.initTree(or_initRelancesEnCours);
	} catch (e) {
		recup_erreur(e);
	}
}

function or_initRelancesEnCours() {
	try {
		or_aRelancesEnCours.setParam("Etat","relances_en_cours");
		or_aRelancesEnCours.initTree(or_initDernieresRelances);
	} catch (e) {
		recup_erreur(e);
	}
}

function or_initDernieresRelances() {
	try {
		document.getElementById('or-listeRelances').disabled = false;
		document.getElementById('or-listeRelancesEnCours').disabled = false;
		or_aDernieresRelances.initTree(or_selectDerniereRelance);
	} catch (e) {
		recup_erreur(e);
	}
}

function or_selectDerniereRelance() {
	try {
		document.getElementById('or-dernieresRelances').selectedIndex=0;
	} catch (e) {
		recup_erreur(e);
	}
}


function or_bloquerInterface(b) {
	try {
		document.getElementById('or-bGenererRelancesEnvoi').disabled=b;
		document.getElementById('or-bGenererRelancesEnCours').disabled=b;
		document.getElementById('or-bReediterRelances').disabled=b;
		document.getElementById('or-dernieresRelances').disabled=b;
		document.getElementById('or-listeRelances').disabled=b;
		document.getElementById('or-listeRelancesEnCours').disabled=b;
	} catch (e) {
		recup_erreur(e);
	}
}


function or_genererRelancesEnvoi() {
	try {
		if (or_aRelances.nbLignes()>0) {
			or_premiereEdition = true;
			or_dateReedition = "0";
			or_bloquerInterface(true);
			or_initPdf();
			or_bloquerInterface(false);
		}
		else {
			showWarning("Il n'y a pas de relances à générer !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function or_genererRelancesEnCours() {
	try {
		if (or_aRelancesEnCours.nbLignes()>0) {
			or_premiereEdition = false;
			or_dateReedition = "0";
			or_bloquerInterface(true);
			or_initPdf();
			or_bloquerInterface(false);
		}
		else {
			showWarning("Il n'y a pas de relances en cours !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function or_reediterRelance() {
	try {
		or_dateReedition = document.getElementById('or-dernieresRelances').value;
		if (or_dateReedition!="0") {
			or_premiereEdition = false;
			or_bloquerInterface(true);
			or_initPdf();
			or_bloquerInterface(false);
		}
		else {
			showWarning("Veuillez choisir une date de réédition !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function or_ouvrirRelance(enCours) {
	try {
		
		var arbre = (enCours?or_aRelancesEnCours:or_aRelances);
		var col = (enCours?'or-colOpIdEnCours':'or-colOpId');
		
		if (arbre.isSelected()) {
			var i = arbre.getCurrentIndex();
			var opId = arbre.getCellText(i, col);
			var url = "chrome://opensi/content/facturation/user/suivi_reglements_clients/popup-detailRelances.xul?"+ cookie() +"&id=" + opId;
			window.openDialog(url,'détail de relance','chrome,modal,centerscreen');
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function or_initPdf() {
	try {
		document.getElementById('rgpRelances').value="C";
		var qGenPdf = new QueryHttp("Facturation/Suivi_Reglements_Clients/pdfRelances.tmpl");
		qGenPdf.setParam('Type_Edition', 'C');
		qGenPdf.setParam('Premiere_Edition', or_premiereEdition?"1":"0");
		if (or_dateReedition!="0") { qGenPdf.setParam('Date_Reedition', or_dateReedition); }
		var result = qGenPdf.execute();
		var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
		switchPdf(page);
	} catch (e) {
		recup_erreur(e);
	}
}


function or_pressOnRgpRelances() {
	try {
		var qGenPdf;
		var rgpRelance = document.getElementById('rgpRelances').value;
		if (rgpRelance!="L") {
			qGenPdf = new QueryHttp("Facturation/Suivi_Reglements_Clients/pdfRelances.tmpl");
			qGenPdf.setParam('Type_Edition', rgpRelance);
		}
		else { qGenPdf = new QueryHttp("Facturation/Suivi_Reglements_Clients/pdfListeRelances.tmpl"); }
		qGenPdf.setParam('Premiere_Edition', or_premiereEdition?"1":"0");
		if (or_dateReedition!="0") { qGenPdf.setParam('Date_Reedition', or_dateReedition); }
		var result = qGenPdf.execute();
		var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
		switchPdf(page);
	} catch (e) {
		recup_erreur(e);
	}
}

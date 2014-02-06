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


var ote_aPeriodes = new Arbre('Facturation/GetRDF/liste_12_dernieres_periodes.tmpl', 'ote-periode');
var ote_aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'ote-modeReglement');
var ote_aJournaux = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'ote-journal');
var ote_aEncaissements = new Arbre('Facturation/Transfert/liste-encaissements.tmpl', 'ote-encaissements');
var ote_aFormats = new Arbre('ComboListe/combo-formatsExportCompta.tmpl', 'ote-formatExport');


function ote_init() {
  try {

		document.getElementById('ote-typePeriode').value = 'P';
		document.getElementById('ote-dateDebut').disabled = true;
		document.getElementById('ote-dateFin').disabled = true;
		
		ote_aFormats.initTree(ote_initFormat);
		
	} catch (e) {
  	recup_erreur(e);
  }
}


function ote_initFormat() {
	try {
		document.getElementById('ote-formatExport').selectedIndex = 0;
		ote_aPeriodes.initTree(ote_initPeriode);
	} catch (e) {
		recup_erreur(e);
	}
}


function ote_initPeriode() {
  try {

		document.getElementById('ote-periode').selectedIndex = 0;
		ote_aModesReglements.initTree(ote_initModeReglement);

	} catch (e) {
    recup_erreur(e);
  }
}


function ote_initModeReglement() {
  try {
		
  	document.getElementById('ote-modeReglement').selectedIndex=0;
  	ote_aJournaux.setParam('Type_Journal', 'TR');
  	ote_aJournaux.initTree(ote_initJournal);

	} catch (e) {
    recup_erreur(e);
  }
}


function ote_initJournal() {
  try {
		document.getElementById('ote-journal').selectedIndex = 0;
		document.getElementById('ote-journal').disabled = true;
		
		ote_aEncaissements.setParam('SansTrans','true');
		ote_actualiserSelection();

	} catch (e) {
    recup_erreur(e);
  }
}


function ote_pressOnModeReglement() {
	try {
		var modeReglement = document.getElementById('ote-modeReglement').value;
		document.getElementById('ote-journal').disabled = (modeReglement=="0");
		if (modeReglement=="0") { document.getElementById('ote-journal').selectedIndex = 0; }
		else {
			var qCodeJournal = new QueryHttp("Facturation/Transfert/getCodeJournalModeReg.tmpl");
			qCodeJournal.setParam("Mode_Reglement", modeReglement);
			var result = qCodeJournal.execute();
			document.getElementById('ote-journal').value = result.responseXML.documentElement.getAttribute('Code_Journal');
		}
		
		ote_actualiserSelection();
	} catch (e) {
		recup_erreur(e);
	}
}


function ote_actualiserSelection() {
  try {

		var typePeriode = document.getElementById('ote-typePeriode').value;
		var periode = document.getElementById('ote-periode').value;
		var dateDebut = document.getElementById('ote-dateDebut').value;
		var dateFin = document.getElementById('ote-dateFin').value;
		var clientId = document.getElementById('ote-clientId').value;
		var fournisseurId = document.getElementById('ote-fournisseurId').value;
		var modeReglement = document.getElementById('ote-modeReglement').value;
		var transfere = document.getElementById('ote-chkAffEncTrans').checked;

		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			ote_aEncaissements.clearParams();
			ote_aEncaissements.setParam('Type_Periode', typePeriode);
			ote_aEncaissements.setParam('Periode', periode);
			ote_aEncaissements.setParam('Date_Debut', prepareDateJava(dateDebut));
			ote_aEncaissements.setParam('Date_Fin', prepareDateJava(dateFin));
			ote_aEncaissements.setParam('Client_Id', clientId);
			ote_aEncaissements.setParam('Fournisseur_Id', fournisseurId);
			ote_aEncaissements.setParam('Mode_Reglement', modeReglement);
			if (!transfere) { ote_aEncaissements.setParam('SansTrans','true'); }
			ote_aEncaissements.initTree(ote_initListeEncaissements);
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ote_changerTypePeriode(tp) {
  try {

		var b = (tp=="P");
		document.getElementById('ote-dateDebut').disabled = b;
		document.getElementById('ote-dateFin').disabled = b;
		document.getElementById('ote-periode').disabled = !b;

	} catch (e) {
    recup_erreur(e);
  }
}


function ote_initListeEncaissements() {
	try {
		toutCocher('ote-encaissements', true);
	} catch (e) {
		recup_erreur(e);
	}
}


function ote_transferer() {
	try {
		ote_checkEncaissements("Transfert");
	} catch (e) {
		recup_erreur(e);
	}
}


function ote_checkEncaissements(type) {
  try {
  	
  	var listboxEncaissements = document.getElementById("ote-encaissements");		
		var listeEncaissementsClients="";
		var listeAnnulEncaissementsClients="";
		var listeEncaissementsFourn="";
		var listeAnnulEncaissementsFourn="";
		var nbLignes = listboxEncaissements.getRowCount();
		
		var i = 0;
		while (i<nbLignes) {
			var item = listboxEncaissements.getItemAtIndex(i);				
			var cks = item.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="true") {
				var typeTiers = cks.item(9).getAttribute("label");
				if (typeTiers=="C") {
					if (cks.item(8).getAttribute("label")=="V") { listeEncaissementsClients += item.value+","; }
					else { listeAnnulEncaissementsClients += item.value+","; }
				} else {
					if (cks.item(8).getAttribute("label")=="V") { listeEncaissementsFourn += item.value+","; }
					else { listeAnnulEncaissementsFourn += item.value+","; }
				}
			}
			i++;
		}
		
		if (!isEmpty(listeEncaissementsClients) || !isEmpty(listeAnnulEncaissementsClients) || !isEmpty(listeEncaissementsFourn) || !isEmpty(listeAnnulEncaissementsFourn)) {
			
			var codeJournal = document.getElementById('ote-journal').value;
			var modeReglement = document.getElementById('ote-modeReglement').value;

			if (modeReglement!="0" && isEmpty(codeJournal)) { showWarning("Veuillez sélectionner un code journal"); }
			else if (type=="Export" || window.confirm("Confirmez-vous le transfert en comptabilité des encaissements sélectionnés ?")) {
				if (checkErreurs(listeEncaissementsClients + listeAnnulEncaissementsClients, "ENCAISSEMENT", type)
					&& checkErreurs(listeEncaissementsFourn + listeAnnulEncaissementsFourn, "ENCAISSEMENT_FOURN", type)) {
					
					if (type=="Transfert") { ote_transfererEncaissements(listeEncaissementsClients, listeAnnulEncaissementsClients, listeEncaissementsFourn, listeAnnulEncaissementsFourn, codeJournal); }
					else { ote_exporterEncaissements(listeEncaissementsClients, listeAnnulEncaissementsClients, listeEncaissementsFourn, listeAnnulEncaissementsFourn, codeJournal) }
				}
			}

		} else {
			showWarning("Vous n'avez rien sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ote_transfererEncaissements(listeEncaissementsClients, listeAnnulEncaissementsClients, listeEncaissementsFourn, listeAnnulEncaissementsFourn, codeJournal) {
	try {
		
		document.getElementById('ote-bTransfert').disabled = true;
		document.getElementById('ote-bExporter').disabled = true;
		
		var qTrans = new QueryHttp("Facturation/Transfert/TransfertEncaissements.tmpl");
		qTrans.setParam('Code_Journal', codeJournal);
		qTrans.setParam('Liste_Encaissements_Clients', listeEncaissementsClients);
		qTrans.setParam('Liste_Annul_Encaissements_Clients', listeAnnulEncaissementsClients);
		qTrans.setParam('Liste_Encaissements_Fourn', listeEncaissementsFourn);
		qTrans.setParam('Liste_Annul_Encaissements_Fourn', listeAnnulEncaissementsFourn);
		qTrans.execute();

		ote_aEncaissements.initTree(ote_initListeEncaissements);
		
		document.getElementById('ote-bTransfert').disabled = false;
		document.getElementById('ote-bExporter').disabled = false;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ote_rechercherClient() {
	try {

		var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',ote_retourRechercherClient);

	} catch (e) {
		recup_erreur(e);
	}
}

function ote_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('ote-clientId').value = codeClient;
	} catch (e) {
		recup_erreur(e);
	}
}


function ote_rechercherFournisseur() {
	try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',ote_retourRechercherFournisseur);

	} catch (e) {
		recup_erreur(e);
	}
}


function ote_retourRechercherFournisseur(codeFournisseur) {
	try {
  	document.getElementById('ote-fournisseurId').value = codeFournisseur;
	} catch (e) {
		recup_erreur(e);
	}
}


function ote_exporter() {
	try {
		formatExport = document.getElementById('ote-formatExport').value;
		if (isEmpty(formatExport)) { showWarning("Veuillez choisir un format d'export."); }
		else if (checkNomFichierExport(formatExport)) {
			ote_checkEncaissements("Export");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ote_exporterEncaissements(listeEncaissementsClients, listeAnnulEncaissementsClients, listeEncaissementsFourn, listeAnnulEncaissementsFourn, codeJournal) {
	try {
		
		document.getElementById('ote-bTransfert').disabled = true;
		document.getElementById('ote-bExporter').disabled = true;

		var qExport = new QueryHttp("Facturation/Transfert/exporterEcritures.tmpl");
		qExport.setParam('Type_Liste', "Encaissements");
		qExport.setParam('Format_Id', formatExport);
		qExport.setParam('Code_Journal', codeJournal);
		qExport.setParam('Liste_Encaissements_Clients', listeEncaissementsClients);
		qExport.setParam('Liste_Annul_Encaissements_Clients', listeAnnulEncaissementsClients);
		qExport.setParam('Liste_Encaissements_Fourn', listeEncaissementsFourn);
		qExport.setParam('Liste_Annul_Encaissements_Fourn', listeAnnulEncaissementsFourn);
		var result = qExport.execute();
		var fichier = result.responseXML.documentElement.getAttribute('Fichier');
		
		telechargerFichier(fichier, nomFichierDefaut);
		
		document.getElementById('ote-bTransfert').disabled = false;
		document.getElementById('ote-bExporter').disabled = false;

	} catch (e) {
		recup_erreur(e);
	}
}


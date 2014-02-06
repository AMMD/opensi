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


var otr_aRemisesBanque = new Arbre('Facturation/Transfert/liste-remisesBanque.tmpl', 'otr-remisesBanque');
var otr_aDetailReglements = new Arbre('Facturation/Remises_Banque/liste-historiqueReglements.tmpl', 'otr-listeReglements');
var otr_aDetailEspeces = new Arbre('Facturation/Remises_Banque/liste-historiqueEspeces.tmpl', 'otr-listeReglementsEspeces');

var otr_aRemboursements = new Arbre('Facturation/Transfert/liste-remboursements.tmpl', 'otr-remboursements');
var otr_aRegulEcheances = new Arbre('Facturation/Transfert/liste-regulEcheances.tmpl', 'otr-regulEcheances');
var otr_aRegulReglements = new Arbre('Facturation/Transfert/liste-regulReglements.tmpl', 'otr-regulReglements');

var otr_aPeriodes = new Arbre('Facturation/GetRDF/liste_12_dernieres_periodes.tmpl', 'otr-periode');
var otr_aFormats = new Arbre('ComboListe/combo-formatsExportCompta.tmpl', 'otr-formatExport');

function otr_init() {
  try {
  	
  	document.getElementById('otr-boxDetails').collapsed=true;
		document.getElementById('otr-listeReglements').collapsed=true;
		document.getElementById('otr-listeReglementsEspeces').collapsed=true;

		document.getElementById('otr-typePeriode').value = 'P';
		document.getElementById('otr-dateDebut').disabled = true;
		document.getElementById('otr-dateFin').disabled = true;
		document.getElementById('otr-typeTransfert').value = "RR";
		otr_switchTypeTransfert();
		
		otr_aFormats.initTree(otr_initFormat);

	} catch (e) {
  	recup_erreur(e);
  }
}


function otr_initFormat() {
	try {
		document.getElementById('otr-formatExport').selectedIndex = 0;
		otr_aPeriodes.initTree(otr_initPeriode);
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_initPeriode() {
  try {

		document.getElementById('otr-periode').selectedIndex = 0;
		var aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'otr-modeReglement');
		aModesReglements.initTree(otr_initModeReglement);

	} catch (e) {
    recup_erreur(e);
  }
}


function otr_initModeReglement() {
  try {
		
  	document.getElementById('otr-modeReglement').selectedIndex=0;
  	var aBanques = new Arbre("ComboListe/combo-banques.tmpl", "otr-comboBanques");
  	aBanques.initTree(otr_initBanque);

	} catch (e) {
    recup_erreur(e);
  }
}


function otr_initBanque() {
  try {
		document.getElementById('otr-comboBanques').selectedIndex = 0;
		var aJournauxRemise = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'otr-journal');
		aJournauxRemise.setParam('Type_Journal', 'TR');
		aJournauxRemise.initTree(otr_initJournalRemise);
	} catch (e) {
    recup_erreur(e);
  }
}


function otr_initJournalRemise() {
  try {
  	
		document.getElementById('otr-journal').selectedIndex = 0;
		document.getElementById('otr-journal').disabled = true;
		
		var aJournauxRegul = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'otr-journalRegul');
  	aJournauxRegul.setParam('Type_Journal', 'OD');
  	aJournauxRegul.initTree(otr_initJournalRegul);

	} catch (e) {
    recup_erreur(e);
  }
}


function otr_initJournalRegul() {
  try {

		document.getElementById('otr-journalRegul').selectedIndex = 0;
		
		otr_aRemisesBanque.setParam('SansTrans','true');
		otr_aRemboursements.setParam('SansTrans','true');
		otr_aRegulEcheances.setParam('SansTrans','true');
		otr_aRegulReglements.setParam('SansTrans','true');
		otr_actualiserSelection();

	} catch (e) {
    recup_erreur(e);
  }
}


function otr_initCriteres() {
	try {
		document.getElementById('otr-typePeriode').value = 'P';
		document.getElementById('otr-periode').selectedIndex = 0;
		document.getElementById('otr-dateDebut').value = "";
		document.getElementById('otr-dateFin').value = "";
		document.getElementById('otr-dateDebut').disabled = true;
		document.getElementById('otr-dateFin').disabled = true;
		
		document.getElementById('otr-modeReglement').selectedIndex = 0;
		document.getElementById('otr-comboBanques').selectedIndex = 0;
		document.getElementById('otr-clientId').value = "";
		document.getElementById('otr-fournisseurId').value = "";
		
		otr_actualiserSelection();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_pressOnBanque() {
	try {
		var banqueId = document.getElementById('otr-comboBanques').value;
		document.getElementById('otr-journal').disabled = (banqueId=="0");
		if (banqueId=="0") { document.getElementById('otr-journal').selectedIndex = 0; }
		else {
			var qCodeJournal = new QueryHttp("Facturation/Transfert/getCodeJournalBanque.tmpl");
			qCodeJournal.setParam("Banque_Id", banqueId);
			var result = qCodeJournal.execute();
			document.getElementById('otr-journal').value = result.responseXML.documentElement.getAttribute('Code_Journal');
		}
		
		otr_actualiserSelection();
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_switchTypeTransfert() {
	try {
		var type = document.getElementById('otr-typeTransfert').value;
		document.getElementById('otr-boxReglements').collapsed = (type!="RR");
		document.getElementById('otr-boxRemisesRemboursements').collapsed = (type!="RR");
		document.getElementById('otr-boxJournalRemise').collapsed = (type!="RR");
		document.getElementById('otr-boxRegularisations').collapsed = (type!="RG");
		document.getElementById('otr-boxJournalRegul').collapsed = (type!="RG");
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_actualiserListeRemise() {
	try {
		var typePeriode = document.getElementById('otr-typePeriode').value;
		var periode = document.getElementById('otr-periode').value;
		var dateDebut = document.getElementById('otr-dateDebut').value;
		var dateFin = document.getElementById('otr-dateFin').value;
		var clientId = document.getElementById('otr-clientId').value;
		var fournisseurId = document.getElementById('otr-fournisseurId').value;
		var modeReglement = document.getElementById('otr-modeReglement').value;
		var banqueId = document.getElementById('otr-comboBanques').value;
		var transferees = document.getElementById('otr-chkAffRemiseTransferees').checked;
		
		document.getElementById('otr-boxDetails').collapsed=true;
		document.getElementById('otr-listeReglements').collapsed=true;
		document.getElementById('otr-listeReglementsEspeces').collapsed=true;
		otr_aDetailReglements.deleteTree();
		otr_aDetailEspeces.deleteTree();
		
		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			otr_aRemisesBanque.clearParams();
			otr_aRemisesBanque.setParam('Type_Periode', typePeriode);
			otr_aRemisesBanque.setParam('Periode', periode);
			otr_aRemisesBanque.setParam('Date_Debut', prepareDateJava(dateDebut));
			otr_aRemisesBanque.setParam('Date_Fin', prepareDateJava(dateFin));
			otr_aRemisesBanque.setParam('Client_Id', clientId);
			otr_aRemisesBanque.setParam('Fournisseur_Id', fournisseurId);
			otr_aRemisesBanque.setParam('Mode_Reglement', modeReglement);
			otr_aRemisesBanque.setParam('Banque_Id', banqueId);
			if (!transferees) { otr_aRemisesBanque.setParam('SansTrans','true'); }
			otr_aRemisesBanque.initTree(otr_initListeRemiseBanque);
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_actualiserListeRemboursement() {
	try {
		var typePeriode = document.getElementById('otr-typePeriode').value;
		var periode = document.getElementById('otr-periode').value;
		var dateDebut = document.getElementById('otr-dateDebut').value;
		var dateFin = document.getElementById('otr-dateFin').value;
		var clientId = document.getElementById('otr-clientId').value;
		var fournisseurId = document.getElementById('otr-fournisseurId').value;
		var modeReglement = document.getElementById('otr-modeReglement').value;
		var banqueId = document.getElementById('otr-comboBanques').value;
		var transferes = document.getElementById('otr-chkAffRembTransferes').checked;
		
		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			otr_aRemboursements.clearParams();
			otr_aRemboursements.setParam('Type_Periode', typePeriode);
			otr_aRemboursements.setParam('Periode', periode);
			otr_aRemboursements.setParam('Date_Debut', prepareDateJava(dateDebut));
			otr_aRemboursements.setParam('Date_Fin', prepareDateJava(dateFin));
			otr_aRemboursements.setParam('Client_Id', clientId);
			otr_aRemboursements.setParam('Fournisseur_Id', fournisseurId);
			otr_aRemboursements.setParam('Mode_Reglement', modeReglement);
			otr_aRemboursements.setParam('Banque_Id', banqueId);
			if (!transferes) { otr_aRemboursements.setParam('SansTrans','true'); }
			otr_aRemboursements.initTree(otr_initListeRemboursements);
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_actualiserListeRegulEcheance() {
	try {
		var typePeriode = document.getElementById('otr-typePeriode').value;
		var periode = document.getElementById('otr-periode').value;
		var dateDebut = document.getElementById('otr-dateDebut').value;
		var dateFin = document.getElementById('otr-dateFin').value;
		var clientId = document.getElementById('otr-clientId').value;
		var fournisseurId = document.getElementById('otr-fournisseurId').value;
		var transferees = document.getElementById('otr-chkAffRegulEchTrans').checked;
		
		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			otr_aRegulEcheances.clearParams();
			otr_aRegulEcheances.setParam('Type_Periode', typePeriode);
			otr_aRegulEcheances.setParam('Periode', periode);
			otr_aRegulEcheances.setParam('Date_Debut', prepareDateJava(dateDebut));
			otr_aRegulEcheances.setParam('Date_Fin', prepareDateJava(dateFin));
			otr_aRegulEcheances.setParam('Client_Id', clientId);
			otr_aRegulEcheances.setParam('Fournisseur_Id', fournisseurId);
			if (!transferees) { otr_aRegulEcheances.setParam('SansTrans','true'); }
			otr_aRegulEcheances.initTree(otr_initListeRegulEcheances);
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_actualiserListeRegulReglement() {
	try {
		var typePeriode = document.getElementById('otr-typePeriode').value;
		var periode = document.getElementById('otr-periode').value;
		var dateDebut = document.getElementById('otr-dateDebut').value;
		var dateFin = document.getElementById('otr-dateFin').value;
		var clientId = document.getElementById('otr-clientId').value;
		var fournisseurId = document.getElementById('otr-fournisseurId').value;
		var transferees = document.getElementById('otr-chkAffRegulReglTrans').checked;
		
		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			otr_aRegulReglements.clearParams();
			otr_aRegulReglements.setParam('Type_Periode', typePeriode);
			otr_aRegulReglements.setParam('Periode', periode);
			otr_aRegulReglements.setParam('Date_Debut', prepareDateJava(dateDebut));
			otr_aRegulReglements.setParam('Date_Fin', prepareDateJava(dateFin));
			otr_aRegulReglements.setParam('Client_Id', clientId);
			otr_aRegulReglements.setParam('Fournisseur_Id', fournisseurId);
			if (!transferees) { otr_aRegulReglements.setParam('SansTrans','true'); }
			otr_aRegulReglements.initTree(otr_initListeRegulReglements);
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_actualiserSelection() {
  try {
  	var typePeriode = document.getElementById('otr-typePeriode').value;
		var dateDebut = document.getElementById('otr-dateDebut').value;
		var dateFin = document.getElementById('otr-dateFin').value;
		
		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
	  	otr_actualiserListeRemise();
	  	otr_actualiserListeRemboursement();
	  	otr_actualiserListeRegulEcheance();
	  	otr_actualiserListeRegulReglement();
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
		
	} catch (e) {
    recup_erreur(e);
  }
}


function otr_changerTypePeriode(tp) {
  try {

		var b = (tp=="P");
		document.getElementById('otr-dateDebut').disabled = b;
		document.getElementById('otr-dateFin').disabled = b;
		document.getElementById('otr-periode').disabled = !b;

	} catch (e) {
    recup_erreur(e);
  }
}


function otr_initListeRemiseBanque() {
	try {
		toutCocher('otr-remisesBanque', true);
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_initListeRemboursements() {
	try {
		toutCocher('otr-remboursements', true);
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_initListeRegulEcheances() {
	try {
		toutCocher('otr-regulEcheances', true);
	} catch (e) {
		recup_erreur(e);
	}
}



function otr_initListeRegulReglements() {
	try {
		toutCocher('otr-regulReglements', true);
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_selectOnListeRemisesBanque(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		var especes = (cks.item(6).getAttribute("label")=="ESP");
		var remiseId = listitem.value;

		document.getElementById('otr-boxDetails').collapsed=false;
		document.getElementById('otr-listeReglements').collapsed = especes;
		document.getElementById('otr-listeReglementsEspeces').collapsed = !especes;
		
		if (especes) {
			document.getElementById('otr-listeReglementsEspeces').disabled=true;
			otr_aDetailEspeces.setParam("Remise_Id", remiseId);
			otr_aDetailEspeces.initTree(otr_initDetailEspeces);
		} else {
			otr_aDetailReglements.setParam("Remise_Id", remiseId);
			otr_aDetailReglements.initTree();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function otr_initDetailEspeces() {
	try {
		document.getElementById('otr-listeReglementsEspeces').disabled=false;
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_affecterCompte() {
	try {
		if (otr_aDetailReglements.isSelected()) {
			var i = otr_aDetailReglements.getCurrentIndex();
			var tiersId = otr_aDetailReglements.getCellText(i, 'otr-colTiersId');
			var typeTiers = otr_aDetailReglements.getCellText(i, 'otr-colTypeTiers');
			if (!isEmpty(tiersId)) {
				var url;
				if (typeTiers=="C") { url = "chrome://opensi/content/facturation/user/clients/popup-modifierCompteClient.xul?"+ cookie() +"&Client_Id="+ urlEncode(tiersId); }
				else { url = "chrome://opensi/content/facturation/user/fournisseurs/popup-modifierCompteFournisseur.xul?"+ cookie() +"&Fournisseur_Id="+ urlEncode(tiersId); }
				window.openDialog(url,'','chrome,modal,centerscreen',reinitialiserListesClients);
			}
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function otr_transferer() {
	try {
		var type = document.getElementById('otr-typeTransfert').value;
		if (type=="RR") { otr_checkRemisesRemboursements("Transfert"); }
		else { otr_checkRegularisations("Transfert"); }
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_checkRemisesRemboursements(type) {
	try {

  	var listboxRemisesBanque = document.getElementById("otr-remisesBanque");
		var listeRemisesBanque="";
		var listeAnnulRemisesBanque="";
		var listeRemisesEspeces="";
		var listeAnnulRemisesEspeces="";
		var nbLignes = listboxRemisesBanque.getRowCount();
		
		var i = 0;
		while (i<nbLignes) {
			var item = listboxRemisesBanque.getItemAtIndex(i);				
			var cks = item.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="true") {
				if (cks.item(5).getAttribute("label")=="V") {
					if (cks.item(6).getAttribute("label")=="ESP") { listeRemisesEspeces += item.value+","; }
					else { listeRemisesBanque += item.value+","; }
				}
				else {
					if (cks.item(6).getAttribute("label")=="ESP") { listeAnnulRemisesEspeces += item.value+","; }
					else { listeAnnulRemisesBanque += item.value+","; }
				}
			}
			i++;
		}
		
		var listboxRemboursements = document.getElementById("otr-remboursements");		
		var listeRemboursementsClients="";
		var listeAnnulRemboursementsClients="";
		var listeReglementsFourn="";
		var listeAnnulReglementsFourn="";
		nbLignes = listboxRemboursements.getRowCount();
		
		var i = 0;
		while (i<nbLignes) {
			var item = listboxRemboursements.getItemAtIndex(i);				
			var cks = item.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="true") {
				var typeTiers = cks.item(10).getAttribute("label");
				if (typeTiers=="C") {
					if (cks.item(9).getAttribute("label")=="V") { listeRemboursementsClients += item.value+","; }
					else { listeAnnulRemboursementsClients += item.value+","; }
				} else {
					if (cks.item(9).getAttribute("label")=="V") { listeReglementsFourn += item.value+","; }
					else { listeAnnulReglementsFourn += item.value+","; }
				}
			}
			i++;
		}
		
		if (!isEmpty(listeRemisesBanque) || !isEmpty(listeAnnulRemisesBanque) || !isEmpty(listeRemisesEspeces) || !isEmpty(listeAnnulRemisesEspeces)
				|| !isEmpty(listeRemboursementsClients) || !isEmpty(listeAnnulRemboursementsClients) || !isEmpty(listeReglementsFourn) || !isEmpty(listeAnnulReglementsFourn)) {
			
			var codeJournal = document.getElementById('otr-journal').value;
			var modeReglement = document.getElementById('otr-modeReglement').value;

			if (modeReglement!="0" && isEmpty(codeJournal)) { showWarning("Veuillez sélectionner un code journal !"); }
			else if (type=="Export" || window.confirm("Confirmez-vous le transfert en comptabilité des règlements sélectionnés ?")) {

				var ok = checkErreurs(listeRemisesBanque + listeAnnulRemisesBanque, "REMISE_REGL", type);
				if (ok) {
					ok = checkErreurs(listeRemisesEspeces + listeAnnulRemisesEspeces, "REMISE_ESP", type);
					if (ok) {
						ok = checkErreurs(listeRemboursementsClients + listeAnnulRemboursementsClients, "REMBOURSEMENT", type);
						if (ok) {
							ok = checkErreurs(listeReglementsFourn + listeAnnulReglementsFourn, "REGLEMENT_FOURN", type);
						}
					}
				}
				
				if (ok) {
					if (type=="Transfert") { otr_transfererRemisesRemboursements(listeRemisesBanque, listeAnnulRemisesBanque, listeRemisesEspeces, listeAnnulRemisesEspeces, listeRemboursementsClients, listeAnnulRemboursementsClients, listeReglementsFourn, listeAnnulReglementsFourn, codeJournal); }
					else { otr_exporterRemisesRemboursements(listeRemisesBanque, listeAnnulRemisesBanque, listeRemisesEspeces, listeAnnulRemisesEspeces, listeRemboursementsClients, listeAnnulRemboursementsClients, listeReglementsFourn, listeAnnulReglementsFourn, codeJournal); }
				}
			}
			
		} else {
			showWarning("Vous n'avez rien sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function otr_transfererRemisesRemboursements(listeRemisesBanque, listeAnnulRemisesBanque, listeRemisesEspeces, listeAnnulRemisesEspeces, listeRemboursementsClients, listeAnnulRemboursementsClients, listeReglementsFourn, listeAnnulReglementsFourn, codeJournal) {
	try {
		
		document.getElementById('otr-bTransfert').disabled = true;
		document.getElementById('otr-bExporter').disabled = true;
		
		var qTrans = new QueryHttp("Facturation/Transfert/TransfertReglements.tmpl");
		qTrans.setParam('Code_Journal', codeJournal);
		qTrans.setParam('Liste_Remises_Banque', listeRemisesBanque);
		qTrans.setParam('Liste_Annul_Remises_Banque', listeAnnulRemisesBanque);
		qTrans.setParam('Liste_Remises_Especes', listeRemisesEspeces);
		qTrans.setParam('Liste_Annul_Remises_Especes', listeAnnulRemisesEspeces);
		qTrans.setParam('Liste_Remboursements_Clients', listeRemboursementsClients);
		qTrans.setParam('Liste_Annul_Remboursements_Clients', listeAnnulRemboursementsClients);
		qTrans.setParam('Liste_Reglements_Fournisseurs', listeReglementsFourn);
		qTrans.setParam('Liste_Annul_Reglements_Fournisseurs', listeAnnulReglementsFourn);
		qTrans.execute();
		
		document.getElementById('otr-boxDetails').collapsed=true;
		document.getElementById('otr-listeReglements').collapsed=true;
		document.getElementById('otr-listeReglementsEspeces').collapsed=true;
		otr_aDetailReglements.deleteTree();
		otr_aDetailEspeces.deleteTree();

		otr_aRemisesBanque.initTree(otr_initListeRemiseBanque);
		otr_aRemboursements.initTree(otr_initListeRemboursements);
		
		document.getElementById('otr-bTransfert').disabled = false;
		document.getElementById('otr-bExporter').disabled = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function otr_checkRegularisations(type) {
  try {
  	
  	var listboxRegulEcheances = document.getElementById("otr-regulEcheances");
		var listeRegulReglFourn="";
		var listeAnnulRegulReglFourn="";
		var listeRegulAvoirFourn="";
		var listeAnnulRegulAvoirFourn="";
		var listeRegulEchClients="";
		var listeAnnulRegulEchClients="";
		var nbLignes = listboxRegulEcheances.getRowCount();
		
		var i = 0;
		while (i<nbLignes) {
			var item = listboxRegulEcheances.getItemAtIndex(i);
			var cks = item.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="true") {
				var typeRegul = cks.item(9).getAttribute("label");
				var statut = cks.item(10).getAttribute("label");
				if (typeRegul=="R") {
					if (statut=="V") { listeRegulReglFourn += item.value+","; }
					else { listeAnnulRegulReglFourn += item.value+","; }
				} else if (typeRegul=="A") {
					if (statut=="V") { listeRegulAvoirFourn += item.value+","; }
					else { listeAnnulRegulAvoirFourn += item.value+","; }
				} else if (typeRegul=="E") {
					if (statut=="V") { listeRegulEchClients += item.value+","; }
					else { listeAnnulRegulEchClients += item.value+","; }
				}
			}
			i++;
		}
		
		var listboxRegulReglements = document.getElementById("otr-regulReglements");		
		var listeRegulReglClients="";
		var listeAnnulRegulReglClients="";
		var listeRegulAvoirClients="";
		var listeAnnulRegulAvoirClients="";
		var listeRegulEchFourn="";
		var listeAnnulRegulEchFourn="";
		var nbLignes = listboxRegulReglements.getRowCount();
		
		var i = 0;
		while (i<nbLignes) {
			var item = listboxRegulReglements.getItemAtIndex(i);				
			var cks = item.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="true") {
				var typeRegul = cks.item(9).getAttribute("label");
				var statut = cks.item(10).getAttribute("label");
				if (typeRegul=="R") {
					if (statut=="V") { listeRegulReglClients += item.value+","; }
					else { listeAnnulRegulReglClients += item.value+","; }
				} else if (typeRegul=="A") {
					if (statut=="V") { listeRegulAvoirClients += item.value+","; }
					else { listeAnnulRegulAvoirClients += item.value+","; }
				} else if (typeRegul=="E") {
					if (statut=="V") { listeRegulEchFourn += item.value+","; }
					else { listeAnnulRegulEchFourn += item.value+","; }
				}
			}
			i++;
		}
		
		if (!isEmpty(listeRegulReglFourn) || !isEmpty(listeAnnulRegulReglFourn) || !isEmpty(listeRegulAvoirFourn) || !isEmpty(listeAnnulRegulAvoirFourn) || !isEmpty(listeRegulEchClients) || !isEmpty(listeAnnulRegulEchClients)
				|| !isEmpty(listeRegulReglClients) || !isEmpty(listeAnnulRegulReglClients) || !isEmpty(listeRegulAvoirClients) || !isEmpty(listeAnnulRegulAvoirClients) || !isEmpty(listeRegulEchFourn) || !isEmpty(listeAnnulRegulEchFourn)) {
			
			var codeJournal = document.getElementById('otr-journalRegul').value;
			
			if (isEmpty(codeJournal)) { showWarning("Veuillez sélectionner un code journal !"); }
			else if (type=="Export" || window.confirm("Confirmez-vous le transfert en comptabilité des régularisations sélectionnées ?")) {
				
				var ok = true;
				if (!checkErreurs(listeRegulReglFourn + listeAnnulRegulReglFourn, "REGUL_REGLEMENT_FOURN", type)
						|| !checkErreurs(listeRegulAvoirFourn + listeAnnulRegulAvoirFourn, "REGUL_AVOIR_FOURN", type)
						|| !checkErreurs(listeRegulEchClients + listeAnnulRegulEchClients, "REGUL_ECHEANCE", type)
						|| !checkErreurs(listeRegulReglClients + listeAnnulRegulReglClients, "REGUL_REGLEMENT", type)
						|| !checkErreurs(listeRegulAvoirClients + listeAnnulRegulAvoirClients, "REGUL_AVOIR", type)
						|| !checkErreurs(listeRegulEchFourn + listeAnnulRegulEchFourn, "REGUL_ECHEANCE_FOURN", type)) {
					ok = false;
				}

				if (ok) {
					if (type=="Transfert") { otr_transfererRegularisations(listeRegulReglFourn, listeAnnulRegulReglFourn, listeRegulAvoirFourn, listeAnnulRegulAvoirFourn, listeRegulEchClients, listeAnnulRegulEchClients, listeRegulReglClients, listeAnnulRegulReglClients, listeRegulAvoirClients, listeAnnulRegulAvoirClients, listeRegulEchFourn, listeAnnulRegulEchFourn, codeJournal); }
					else { otr_exporterRegularisations(listeRegulReglFourn, listeAnnulRegulReglFourn, listeRegulAvoirFourn, listeAnnulRegulAvoirFourn, listeRegulEchClients, listeAnnulRegulEchClients, listeRegulReglClients, listeAnnulRegulReglClients, listeRegulAvoirClients, listeAnnulRegulAvoirClients, listeRegulEchFourn, listeAnnulRegulEchFourn, codeJournal); }
				}
			}

		} else {
			showWarning("Vous n'avez rien sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function otr_transfererRegularisations(listeRegulReglFourn, listeAnnulRegulReglFourn, listeRegulAvoirFourn, listeAnnulRegulAvoirFourn, listeRegulEchClients, listeAnnulRegulEchClients, listeRegulReglClients, listeAnnulRegulReglClients, listeRegulAvoirClients, listeAnnulRegulAvoirClients, listeRegulEchFourn, listeAnnulRegulEchFourn, codeJournal) {
	try {
		
		document.getElementById('otr-bTransfert').disabled = true;
		document.getElementById('otr-bExporter').disabled = true;
		
		var qTrans = new QueryHttp("Facturation/Transfert/TransfertRegularisations.tmpl");
		qTrans.setParam('Code_Journal', codeJournal);
		qTrans.setParam('Liste_Regul_Regl_Fournisseurs', listeRegulReglFourn);
		qTrans.setParam('Liste_Annul_Regul_Regl_Fournisseurs', listeAnnulRegulReglFourn);
		qTrans.setParam('Liste_Regul_Avoir_Fournisseurs', listeRegulAvoirFourn);
		qTrans.setParam('Liste_Annul_Regul_Avoir_Fournisseurs', listeAnnulRegulAvoirFourn);
		qTrans.setParam('Liste_Regul_Echeances_Clients', listeRegulEchClients);
		qTrans.setParam('Liste_Annul_Regul_Echeances_Clients', listeAnnulRegulEchClients);
		qTrans.setParam('Liste_Regul_Regl_Clients', listeRegulReglClients);
		qTrans.setParam('Liste_Annul_Regul_Regl_Clients', listeAnnulRegulReglClients);
		qTrans.setParam('Liste_Regul_Avoir_Clients', listeRegulAvoirClients);
		qTrans.setParam('Liste_Annul_Regul_Avoir_Clients', listeAnnulRegulAvoirClients);
		qTrans.setParam('Liste_Regul_Echeances_Fourn', listeRegulEchFourn);
		qTrans.setParam('Liste_Annul_Regul_Echeances_Fourn', listeAnnulRegulEchFourn);
		qTrans.execute();
		
		otr_aRegulEcheances.initTree(otr_initListeRegulEcheances);
		otr_aRegulReglements.initTree(otr_initListeRegulReglements);
		
		document.getElementById('otr-bTransfert').disabled = false;
		document.getElementById('otr-bExporter').disabled = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function otr_rechercherClient() {
	try {

		var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',otr_retourRechercherClient);

	} catch (e) {
		recup_erreur(e);
	}
}

function otr_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('otr-clientId').value = codeClient;
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_rechercherFournisseur() {
	try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',otr_retourRechercherFournisseur);

	} catch (e) {
		recup_erreur(e);
	}
}

function otr_retourRechercherFournisseur(codeFournisseur) {
	try {
  	document.getElementById('otr-fournisseurId').value = codeFournisseur;
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_exporter() {
	try {
		var type = document.getElementById('otr-typeTransfert').value;
		formatExport = document.getElementById('otr-formatExport').value;
		if (isEmpty(formatExport)) { showWarning("Veuillez choisir un format d'export."); }
		else if (checkNomFichierExport(formatExport)) {
			if (type=="RR") { otr_checkRemisesRemboursements("Export"); }
			else { otr_checkRegularisations("Export"); }
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function otr_exporterRemisesRemboursements(listeRemisesBanque, listeAnnulRemisesBanque, listeRemisesEspeces, listeAnnulRemisesEspeces, listeRemboursementsClients, listeAnnulRemboursementsClients, listeReglementsFourn, listeAnnulReglementsFourn, codeJournal) {
	try {

		document.getElementById('otr-bTransfert').disabled = true;
		document.getElementById('otr-bExporter').disabled = true;
		
		var qExport = new QueryHttp("Facturation/Transfert/exporterEcritures.tmpl");
		qExport.setParam('Type_Liste', "Remises_Remboursements");
		qExport.setParam('Format_Id', formatExport);
		qExport.setParam('Code_Journal', codeJournal);
		qExport.setParam('Liste_Remises_Banque', listeRemisesBanque);
		qExport.setParam('Liste_Annul_Remises_Banque', listeAnnulRemisesBanque);
		qExport.setParam('Liste_Remises_Especes', listeRemisesEspeces);
		qExport.setParam('Liste_Annul_Remises_Especes', listeAnnulRemisesEspeces);
		qExport.setParam('Liste_Remboursements_Clients', listeRemboursementsClients);
		qExport.setParam('Liste_Annul_Remboursements_Clients', listeAnnulRemboursementsClients);
		qExport.setParam('Liste_Reglements_Fourn', listeReglementsFourn);
		qExport.setParam('Liste_Annul_Reglements_Fourn', listeAnnulReglementsFourn);
		var result = qExport.execute();
		var fichier = result.responseXML.documentElement.getAttribute('Fichier');
		
		telechargerFichier(fichier, nomFichierDefaut);

		document.getElementById('otr-bTransfert').disabled = false;
		document.getElementById('otr-bExporter').disabled = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function otr_exporterRegularisations(listeRegulReglFourn, listeAnnulRegulReglFourn, listeRegulAvoirFourn, listeAnnulRegulAvoirFourn, listeRegulEchClients, listeAnnulRegulEchClients, listeRegulReglClients, listeAnnulRegulReglClients, listeRegulAvoirClients, listeAnnulRegulAvoirClients, listeRegulEchFourn, listeAnnulRegulEchFourn, codeJournal) {
	try {

		document.getElementById('otr-bTransfert').disabled = true;
		document.getElementById('otr-bExporter').disabled = true;
		
		var qExport = new QueryHttp("Facturation/Transfert/exporterEcritures.tmpl");
		qExport.setParam('Type_Liste', "Regularisations");
		qExport.setParam('Format_Id', formatExport);
		qExport.setParam('Code_Journal', codeJournal);
		qExport.setParam('Liste_Regul_Regl_Fourn', listeRegulReglFourn);
		qExport.setParam('Liste_Annul_Regul_Regl_Fourn', listeAnnulRegulReglFourn);
		qExport.setParam('Liste_Regul_Avoir_Fourn', listeRegulAvoirFourn);
		qExport.setParam('Liste_Annul_Regul_Avoir_Fourn', listeAnnulRegulAvoirFourn);
		qExport.setParam('Liste_Regul_Ech_Clients', listeRegulEchClients);
		qExport.setParam('Liste_Annul_Regul_Ech_Clients', listeAnnulRegulEchClients);
		qExport.setParam('Liste_Regul_Regl_Clients', listeRegulReglClients);
		qExport.setParam('Liste_Annul_Regul_Regl_Clients', listeAnnulRegulReglClients);
		qExport.setParam('Liste_Regul_Avoir_Clients', listeRegulAvoirClients);
		qExport.setParam('Liste_Annul_Regul_Avoir_Clients', listeAnnulRegulAvoirClients);
		qExport.setParam('Liste_Regul_Ech_Fourn', listeRegulEchFourn);
		qExport.setParam('Liste_Annul_Regul_Ech_Fourn', listeAnnulRegulEchFourn);
		var result = qExport.execute();
		var fichier = result.responseXML.documentElement.getAttribute('Fichier');
		
		telechargerFichier(fichier, nomFichierDefaut);
		
		document.getElementById('otr-bTransfert').disabled = false;
		document.getElementById('otr-bExporter').disabled = false;

	} catch (e) {
		recup_erreur(e);
	}
}


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


var otv_aFactures = new Arbre('Facturation/GetRDF/factures_transfert.tmpl', 'otv-factures');
var otv_aAvoirs = new Arbre('Facturation/GetRDF/avoirs_transfert.tmpl', 'otv-avoirs');
var otv_aAcomptes = new Arbre('Facturation/Transfert/liste-acomptes.tmpl', 'otv-acomptes');
var otv_aPeriodes = new Arbre('Facturation/GetRDF/liste_12_dernieres_periodes.tmpl', 'otv-Periode');
var otv_aSecteurs = new Arbre('Facturation/GetRDF/secteurs_activite.tmpl', 'otv-secteur');
var otv_aFormats = new Arbre('ComboListe/combo-formatsExportCompta.tmpl', 'otv-formatExport');

function otv_init() {
  try {

		document.getElementById('otv-Type_Periode').value = 'P';
		document.getElementById('otv-Date_Debut').disabled = true;
		document.getElementById('otv-Date_Fin').disabled = true;
		document.getElementById('otv-typeTransfert').value = "FA";
		otv_switchTypeTransfert();
		
		otv_aFormats.initTree(otv_initFormat);

	} catch (e) {
  	recup_erreur(e);
  }
}


function otv_initFormat() {
	try {
		document.getElementById('otr-formatExport').selectedIndex = 0;
		var aProvenance = new Arbre('Facturation/Affaires/liste-sites.tmpl','otv-provenance');
		aProvenance.initTree(otv_initProvenance);
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_initProvenance() {
	try {
		document.getElementById('otv-provenance').selectedIndex = 0;
		otv_aSecteurs.initTree(otv_initSecteur);
		
	} catch (e) {
		recup_erreur(e);
	}
}

function otv_initSecteur() {
	try {
		document.getElementById('otv-secteur').selectedIndex = 0;
		
		var qExisteSites = new QueryHttp("Facturation/Affaires/existeSites.tmpl");
		var result = qExisteSites.execute();
		document.getElementById('otv-boxProvenance').collapsed = (result.responseXML.documentElement.getAttribute("Existe")=="false");
		
		otv_aPeriodes.initTree(otv_initPeriode);

		var aJournauxVente = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'otv-JournalVente');
		aJournauxVente.setParam('Type_Journal', 'VE');
		aJournauxVente.initTree(otv_initJournalVente);
		
		var aJournauxTransfert = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'otv-JournalTransfert');
		aJournauxTransfert.setParam('Type_Journal', 'OD');
		aJournauxTransfert.initTree(otv_initJournalTransfert);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_initJournalVente() {
  try {
		var qDefautJournal = new QueryHttp("Facturation/Transfert/getDefautJournal.tmpl");
		var result = qDefautJournal.execute();
		document.getElementById('otv-JournalVente').value = result.responseXML.documentElement.getAttribute('Code_Journal_Vente');
	} catch (e) {
    recup_erreur(e);
  }
}


function otv_initJournalTransfert() {
  try {
		var qDefautJournal = new QueryHttp("Facturation/Transfert/getDefautJournal.tmpl");
		var result = qDefautJournal.execute();
		document.getElementById('otv-JournalTransfert').value = result.responseXML.documentElement.getAttribute('Code_Journal_Acpte');
	} catch (e) {
    recup_erreur(e);
  }
}


function otv_initPeriode() {
  try {

		document.getElementById('otv-Periode').selectedIndex = 0;
		
		var periode = document.getElementById('otv-Periode').value;
		var provenance = document.getElementById('otv-provenance').value;
		var secteur = document.getElementById('otv-secteur').value;
		var clientId = document.getElementById('otv-Client_Id').value;

		otv_aFactures.setParam('Type_Periode', 'P');
		otv_aFactures.setParam('SansTrans','true');
		otv_aFactures.setParam('Periode', periode);
		otv_aFactures.setParam('Provenance', provenance);
		otv_aFactures.setParam('Client_Id', clientId);
		otv_aFactures.setParam('Secteur_Activite', secteur);
		otv_aFactures.initTree(otv_initListeFactures);

		otv_aAvoirs.setParam('Type_Periode', 'P');
		otv_aAvoirs.setParam('SansTrans','true');
		otv_aAvoirs.setParam('Periode', periode);
		otv_aAvoirs.setParam('Provenance', provenance);
		otv_aAvoirs.setParam('Client_Id', clientId);
		otv_aAvoirs.setParam('Secteur_Activite', secteur);
		otv_aAvoirs.initTree(otv_initListeAvoirs);
		
		otv_aAcomptes.setParam('Type_Periode', 'P');
		otv_aAcomptes.setParam('SansTrans','true');
		otv_aAcomptes.setParam('Periode', periode);
		otv_aAcomptes.setParam('Provenance', provenance);
		otv_aAcomptes.setParam('Client_Id', clientId);
		otv_aAcomptes.setParam('Secteur_Activite', secteur);
		otv_aAcomptes.initTree(otv_initListeAcomptes);

	} catch (e) {
    recup_erreur(e);
  }
}


function otv_switchTypeTransfert() {
	try {
		var type = document.getElementById('otv-typeTransfert').value;
		document.getElementById('otv-boxFacturesAvoirs').collapsed = (type!="FA");
		document.getElementById('otv-boxJournalVente').collapsed = (type!="FA");
		document.getElementById('otv-boxAcomptes').collapsed = (type!="AC");
		document.getElementById('otv-boxJournalTransfert').collapsed = (type!="AC");
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_actualiserListeFactures() {
	try {
		var typePeriode = document.getElementById('otv-Type_Periode').value;
		var periode = document.getElementById('otv-Periode').value;
		var dateDebut = document.getElementById('otv-Date_Debut').value;
		var dateFin = document.getElementById('otv-Date_Fin').value;
		var clientId = document.getElementById('otv-Client_Id').value;
		var provenance = document.getElementById('otv-provenance').value;
		var secteur = document.getElementById('otv-secteur').value;
		var transfere = document.getElementById('otv-chkAffFactTrans').checked;

		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			otv_aFactures.clearParams();
			otv_aFactures.setParam('Type_Periode', typePeriode);
			otv_aFactures.setParam('Periode', periode);
			otv_aFactures.setParam('Date_Debut', prepareDateJava(dateDebut));
			otv_aFactures.setParam('Date_Fin', prepareDateJava(dateFin));
			otv_aFactures.setParam('Client_Id', clientId);
			otv_aFactures.setParam('Provenance', provenance);
			otv_aFactures.setParam('Secteur_Activite', secteur);
			if (!transfere) { otv_aFactures.setParam('SansTrans','true'); }
			otv_aFactures.initTree(otv_initListeFactures);
			
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_actualiserListeAvoirs() {
	try {
		var typePeriode = document.getElementById('otv-Type_Periode').value;
		var periode = document.getElementById('otv-Periode').value;
		var dateDebut = document.getElementById('otv-Date_Debut').value;
		var dateFin = document.getElementById('otv-Date_Fin').value;
		var clientId = document.getElementById('otv-Client_Id').value;
		var provenance = document.getElementById('otv-provenance').value;
		var secteur = document.getElementById('otv-secteur').value;
		var transfere = document.getElementById('otv-chkAffAvoirTrans').checked;

		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			otv_aAvoirs.clearParams();
			otv_aAvoirs.setParam('Type_Periode', typePeriode);
			otv_aAvoirs.setParam('Periode', periode);
			otv_aAvoirs.setParam('Date_Debut', prepareDateJava(dateDebut));
			otv_aAvoirs.setParam('Date_Fin', prepareDateJava(dateFin));
			otv_aAvoirs.setParam('Client_Id', clientId);
			otv_aAvoirs.setParam('Provenance', provenance);
			otv_aAvoirs.setParam('Secteur_Activite', secteur);
			if (!transfere) { otv_aAvoirs.setParam('SansTrans','true'); }
			otv_aAvoirs.initTree(otv_initListeAvoirs);
			
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_actualiserListeAcomptes() {
	try {
		var typePeriode = document.getElementById('otv-Type_Periode').value;
		var periode = document.getElementById('otv-Periode').value;
		var dateDebut = document.getElementById('otv-Date_Debut').value;
		var dateFin = document.getElementById('otv-Date_Fin').value;
		var clientId = document.getElementById('otv-Client_Id').value;
		var provenance = document.getElementById('otv-provenance').value;
		var secteur = document.getElementById('otv-secteur').value;
		var transfere = document.getElementById('otv-chkAffAcomptesTrans').checked;

		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			otv_aAcomptes.clearParams();
			otv_aAcomptes.setParam('Type_Periode', typePeriode);
			otv_aAcomptes.setParam('Periode', periode);
			otv_aAcomptes.setParam('Date_Debut', prepareDateJava(dateDebut));
			otv_aAcomptes.setParam('Date_Fin', prepareDateJava(dateFin));
			otv_aAcomptes.setParam('Client_Id', clientId);
			otv_aAcomptes.setParam('Provenance', provenance);
			otv_aAcomptes.setParam('Secteur_Activite', secteur);
			if (!transfere) { otv_aAcomptes.setParam('SansTrans','true'); }
			otv_aAcomptes.initTree(otv_initListeAcomptes);
			
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_actualiserSelection() {
  try {

		var typePeriode = document.getElementById('otv-Type_Periode').value;
		var dateDebut = document.getElementById('otv-Date_Debut').value;
		var dateFin = document.getElementById('otv-Date_Fin').value;

		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			otv_actualiserListeFactures();
			otv_actualiserListeAvoirs();
			otv_actualiserListeAcomptes();
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function otv_initListeFactures() {
	try {
		toutCocher('otv-factures', true);
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_initListeAvoirs() {
	try {
		toutCocher('otv-avoirs', true);
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_initListeAcomptes() {
	try {
		toutCocher('otv-acomptes', true);
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_changerTypePeriode(tp) {
  try {

		var b = (tp=="P");
		document.getElementById('otv-Date_Debut').disabled = b;
		document.getElementById('otv-Date_Fin').disabled = b;
		document.getElementById('otv-Periode').disabled = !b;

	} catch (e) {
    recup_erreur(e);
  }
}


function otv_transferer() {
	try {
		var type = document.getElementById('otv-typeTransfert').value;
		if (type=="FA") { otv_checkFacturesAvoirs("Transfert"); }
		else { otv_checkAcomptes("Transfert"); }
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_checkFacturesAvoirs(type) {
  try {
  	
  	var listboxFactures = document.getElementById("otv-factures");		
		var listeFactures="";
		var nbLignes = listboxFactures.getRowCount();
		
		var i = 0;
		while (i<nbLignes) {
			var item = listboxFactures.getItemAtIndex(i);				
			var cks = item.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="true") {
				listeFactures += item.value+",";
			}
			i++;
		}
		
		var listboxAvoirs = document.getElementById("otv-avoirs");		
		var listeAvoirs="";
		nbLignes = listboxAvoirs.getRowCount();
		i = 0;
		while (i<nbLignes) {
			var item = listboxAvoirs.getItemAtIndex(i);				
			var cks = item.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="true") {
				listeAvoirs += item.value+",";
			}
			i++;
		}
		
		if (!isEmpty(listeFactures) || !isEmpty(listeAvoirs)) {
			var codeJournal = document.getElementById('otv-JournalVente').value;
			
			if (isEmpty(codeJournal)) {
				showWarning("Veuillez sélectionner un code journal !");
			}
			else if (type=="Export" || window.confirm("Confirmez-vous le transfert en comptabilité des ventes sélectionnées ?")) {
				
				var ok = checkErreurs(listeFactures, "FACTURE", type);
				if (ok) {
					ok = checkErreurs(listeAvoirs, "AVOIR", type);
				}
				
				if (ok) {
					if (type=="Transfert") {
						var qIsClot = new QueryHttp("Facturation/Transfert/isCloturable.tmpl");
						qIsClot.setParam('Transfert', 'true');
						var result = qIsClot.execute();
						var cloture = false;
			
						if (result.responseXML.documentElement.getAttribute('cloturable')=="true" && document.getElementById('otv-Type_Periode').value=="P" && document.getElementById('otv-Periode').selectedIndex==0) {
							var moisEnCours = document.getElementById('otv-Periode').getAttribute("label");
							if (window.confirm("Voulez-vous clôturer le mois de facturation en cours ("+ moisEnCours +") ?")) {
								var qClot = new QueryHttp("Facturation/Transfert/CloturerMois.tmpl");
								qClot.execute();
								cloture = true;
							}
						}
						otv_transfererFacturesAvoirs(listeFactures, listeAvoirs, codeJournal);
						if (cloture) { otv_aPeriodes.initTree(otv_initPeriodePrec); }
					} else { otv_exporterFacturesAvoirs(listeFactures, listeAvoirs, codeJournal); }
				}
			}
				
		} else {
			showWarning("Vous n'avez rien sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function otv_transfererFacturesAvoirs(listeFactures, listeAvoirs, codeJournal) {
	try {
			
		document.getElementById('otv-bTransfert').disabled = true;
		document.getElementById('otv-bExporter').disabled = true;

		var qTrans = new QueryHttp("Facturation/Transfert/TransfertFactures.tmpl");
		qTrans.setParam('Code_Journal', codeJournal);
		qTrans.setParam('Liste_Factures', listeFactures);
		qTrans.setParam('Liste_Avoirs', listeAvoirs);
		qTrans.execute();

		otv_aFactures.initTree(otv_initListeFactures);
		otv_aAvoirs.initTree(otv_initListeAvoirs);

		document.getElementById('otv-bTransfert').disabled = false;
		document.getElementById('otv-bExporter').disabled = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function otv_checkAcomptes(type) {
	try {
		
  	var listboxAcomptes = document.getElementById("otv-acomptes");		
		var listeAcomptes="";
		var listeAnnulAcomptes="";
		var nbLignes = listboxAcomptes.getRowCount();
		
		var i = 0;
		while (i<nbLignes) {
			var item = listboxAcomptes.getItemAtIndex(i);				
			var cks = item.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="true") {
				if (cks.item(9).getAttribute("label")=="V") { listeAcomptes += item.value+","; }
				else { listeAnnulAcomptes += item.value+","; }
			}
			i++;
		}
		
		if (!isEmpty(listeAcomptes) || !isEmpty(listeAnnulAcomptes)) {
			var codeJournal = document.getElementById('otv-JournalTransfert').value;
			
			if (codeJournal=="0") {
				showWarning("Veuillez sélectionner un code journal !");
			}
			else if (type=="Export" || window.confirm("Confirmez-vous le transfert en comptabilité des ventes sélectionnées ?")) {
				if (checkErreurs(listeAcomptes + listeAnnulAcomptes, "ACOMPTE", type)) {
					if (type=="Transfert") { otv_transfererAcomptes(listeAcomptes, listeAnnulAcomptes, codeJournal); }
					else { otv_exporterAcomptes(listeAcomptes, listeAnnulAcomptes, codeJournal); }
				}
			}
		} else {
			showWarning("Vous n'avez rien sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function otv_transfererAcomptes(listeAcomptes, listeAnnulAcomptes, codeJournal) {
	try {
		
		document.getElementById('otv-bTransfert').disabled = true;
		document.getElementById('otv-bExporter').disabled = true;
		
		var qTrans = new QueryHttp("Facturation/Transfert/TransfertAcomptes.tmpl");
		qTrans.setParam('Code_Journal', codeJournal);
		qTrans.setParam('Liste_Acomptes', listeAcomptes);
		qTrans.setParam('Liste_Annul_Acomptes', listeAnnulAcomptes);
		qTrans.execute();

		otv_aAcomptes.initTree(otv_initListeAcomptes);
		
		document.getElementById('otv-bTransfert').disabled = false;
		document.getElementById('otv-bExporter').disabled = false;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_initPeriodePrec() {
  try {

		document.getElementById('otv-Periode').selectedIndex = 1;

	} catch (e) {
    recup_erreur(e);
  }
}


function otv_rechercherClient() {
	try {

		var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',otv_retourRechercherClient);

	} catch (e) {
		recup_erreur(e);
	}
}

function otv_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('otv-Client_Id').value = codeClient;
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_exporter() {
	try {
		var type = document.getElementById('otv-typeTransfert').value;
		formatExport = document.getElementById('otv-formatExport').value;
		if (isEmpty(formatExport)) { showWarning("Veuillez choisir un format d'export."); }
		else  if (checkNomFichierExport(formatExport)) {
			if (type=="FA") { otv_checkFacturesAvoirs("Export"); }
			else { otv_checkAcomptes("Export"); }
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_exporterFacturesAvoirs(listeFactures, listeAvoirs, codeJournal) {
	try {
		
		document.getElementById('otv-bTransfert').disabled = true;
		document.getElementById('otv-bExporter').disabled = true;
		
		var qExport = new QueryHttp("Facturation/Transfert/exporterEcritures.tmpl");
		qExport.setParam('Type_Liste', "Factures_Avoirs_Vente");
		qExport.setParam('Format_Id', formatExport);
		qExport.setParam('Code_Journal', codeJournal);
		qExport.setParam('Liste_Factures', listeFactures);
		qExport.setParam('Liste_Avoirs', listeAvoirs);
		var result = qExport.execute();
		var fichier = result.responseXML.documentElement.getAttribute('Fichier');
		
		telechargerFichier(fichier, nomFichierDefaut);
		
		document.getElementById('otv-bTransfert').disabled = false;
		document.getElementById('otv-bExporter').disabled = false;
			
	} catch (e) {
		recup_erreur(e);
	}
}


function otv_exporterAcomptes(listeAcomptes, listeAnnulAcomptes, codeJournal) {
	try {
		
		document.getElementById('otv-bTransfert').disabled = true;
		document.getElementById('otv-bExporter').disabled = true;
		
		var qExport = new QueryHttp("Facturation/Transfert/exporterEcritures.tmpl");
		qExport.setParam('Type_Liste', "Acomptes_Vente");
		qExport.setParam('Format_Id', formatExport);
		qExport.setParam('Code_Journal', codeJournal);
		qExport.setParam('Liste_Acomptes', listeAcomptes);
		qExport.setParam('Liste_Annul_Acomptes', listeAnnulAcomptes);
		var result = qExport.execute();
		var fichier = result.responseXML.documentElement.getAttribute('Fichier');
		
		telechargerFichier(fichier, nomFichierDefaut);
		
		document.getElementById('otv-bTransfert').disabled = false;
		document.getElementById('otv-bExporter').disabled = false;

	} catch (e) {
		recup_erreur(e);
	}
}



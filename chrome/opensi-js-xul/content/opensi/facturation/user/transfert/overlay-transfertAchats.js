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


var ota_aFactures = new Arbre('Facturation/GetRDF/factures_achats_transfert.tmpl', 'ota-factures');
var ota_aAvoirs = new Arbre('Facturation/GetRDF/avoirs_achats_transfert.tmpl', 'ota-avoirs');
var ota_aAcomptes = new Arbre('Facturation/Transfert/liste-acomptesFournisseurs.tmpl', 'ota-acomptes');
var ota_aPeriodes = new Arbre('Facturation/GetRDF/liste_12_dernieres_periodes.tmpl', 'ota-Periode');
var ota_aSecteurs = new Arbre('Facturation/GetRDF/secteurs_activite.tmpl', 'ota-secteur');
var ota_aFormats = new Arbre('ComboListe/combo-formatsExportCompta.tmpl', 'ota-formatExport');


function ota_init() {
  try {
  	
  	document.getElementById('ota-Type_Periode').value = 'P';
		document.getElementById('ota-Date_Debut').disabled = true;
		document.getElementById('ota-Date_Fin').disabled = true;
		document.getElementById('ota-typeTransfert').value = "FA";
		ota_switchTypeTransfert();
		
		ota_aFormats.initTree(ota_initFormat);
  	
	} catch (e) {
  	recup_erreur(e);
  }
}


function ota_initFormat() {
	try {
		document.getElementById('ota-formatExport').selectedIndex = 0;
		ota_aSecteurs.initTree(ota_initSecteur);
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_initSecteur() {
	try {
		document.getElementById('ota-secteur').selectedIndex = 0;
		
		ota_aPeriodes.initTree(ota_initPeriode);
		
		var aJournauxAchat = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'ota-journalAchat');
		aJournauxAchat.setParam('Type_Journal', 'AC');
		aJournauxAchat.initTree(ota_initJournalAchat);
		
		var aJournauxTransfert = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'ota-journalTransfert');
		aJournauxTransfert.setParam('Type_Journal', 'OD');
		aJournauxTransfert.initTree(ota_initJournalTransfert);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_initJournalAchat() {
  try {
		var qDefautJournal = new QueryHttp("Facturation/Transfert/getDefautJournal.tmpl");
		var result = qDefautJournal.execute();
		document.getElementById('ota-journalAchat').value = result.responseXML.documentElement.getAttribute('Code_Journal_Achat');
	} catch (e) {
    recup_erreur(e);
  }
}


function ota_initJournalTransfert() {
  try {
		var qDefautJournal = new QueryHttp("Facturation/Transfert/getDefautJournal.tmpl");
		var result = qDefautJournal.execute();
		document.getElementById('ota-journalTransfert').value = result.responseXML.documentElement.getAttribute('Code_Journal_Acpte_AC');
	} catch (e) {
    recup_erreur(e);
  }
}


function ota_initPeriode() {
  try {

		document.getElementById('ota-Periode').selectedIndex = 0;
		
		var periode = document.getElementById('ota-Periode').value;
		var secteur = document.getElementById('ota-secteur').value;
		var fournisseurId = document.getElementById('ota-Fournisseur_Id').value;

		ota_aFactures.setParam('Type_Periode', 'P');
		ota_aFactures.setParam('SansTrans','true');
		ota_aFactures.setParam('Periode', periode);
		ota_aFactures.setParam('Secteur_Activite', secteur);
		ota_aFactures.setParam('Fournisseur_Id', fournisseurId);
		ota_aFactures.initTree(ota_initListeFactures);

		ota_aAvoirs.setParam('Type_Periode', 'P');
		ota_aAvoirs.setParam('SansTrans','true');
		ota_aAvoirs.setParam('Periode', periode);
		ota_aAvoirs.setParam('Secteur_Activite', secteur);
		ota_aAvoirs.setParam('Fournisseur_Id', fournisseurId);
		ota_aAvoirs.initTree(ota_initListeAvoirs);
		
		ota_aAcomptes.setParam('Type_Periode', 'P');
		ota_aAcomptes.setParam('SansTrans','true');
		ota_aAcomptes.setParam('Periode', periode);
		ota_aAcomptes.setParam('Secteur_Activite', secteur);
		ota_aAcomptes.setParam('Fournisseur_Id', fournisseurId);
		ota_aAcomptes.initTree(ota_initListeAcomptes);

	} catch (e) {
    recup_erreur(e);
  }
}


function ota_switchTypeTransfert() {
	try {
		var type = document.getElementById('ota-typeTransfert').value;
		document.getElementById('ota-boxFacturesAvoirs').collapsed = (type!="FA");
		document.getElementById('ota-boxJournalAchat').collapsed = (type!="FA");
		document.getElementById('ota-boxAcomptes').collapsed = (type!="AC");
		document.getElementById('ota-boxJournalTransfert').collapsed = (type!="AC");
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_actualiserListeFactures() {
	try {
		var typePeriode = document.getElementById('ota-Type_Periode').value;
		var periode = document.getElementById('ota-Periode').value;
		var dateDebut = document.getElementById('ota-Date_Debut').value;
		var dateFin = document.getElementById('ota-Date_Fin').value;
		var fournisseurId = document.getElementById('ota-Fournisseur_Id').value;
		var secteur = document.getElementById('ota-secteur').value;
		var transfere = document.getElementById('ota-chkAffFacturesTrans').checked;

		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			ota_aFactures.clearParams();
			ota_aFactures.setParam('Type_Periode', typePeriode);
			ota_aFactures.setParam('Periode', periode);
			ota_aFactures.setParam('Date_Debut', prepareDateJava(dateDebut));
			ota_aFactures.setParam('Date_Fin', prepareDateJava(dateFin));
			ota_aFactures.setParam('Secteur_Activite', secteur);
			ota_aFactures.setParam('Fournisseur_Id', fournisseurId);
			if (!transfere) { ota_aFactures.setParam('SansTrans','true'); }
			ota_aFactures.initTree(ota_initListeFactures);
			
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_actualiserListeAvoirs() {
	try {
		var typePeriode = document.getElementById('ota-Type_Periode').value;
		var periode = document.getElementById('ota-Periode').value;
		var dateDebut = document.getElementById('ota-Date_Debut').value;
		var dateFin = document.getElementById('ota-Date_Fin').value;
		var fournisseurId = document.getElementById('ota-Fournisseur_Id').value;
		var secteur = document.getElementById('ota-secteur').value;
		var transfere = document.getElementById('ota-chkAffAvoirsTrans').checked;

		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			ota_aAvoirs.clearParams();
			ota_aAvoirs.setParam('Type_Periode', typePeriode);
			ota_aAvoirs.setParam('Periode', periode);
			ota_aAvoirs.setParam('Date_Debut', prepareDateJava(dateDebut));
			ota_aAvoirs.setParam('Date_Fin', prepareDateJava(dateFin));
			ota_aAvoirs.setParam('Secteur_Activite', secteur);
			ota_aAvoirs.setParam('Fournisseur_Id', fournisseurId);
			if (!transfere) { ota_aAvoirs.setParam('SansTrans','true'); }
			ota_aAvoirs.initTree(ota_initListeAvoirs);
			
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_actualiserListeAcomptes() {
	try {
		var typePeriode = document.getElementById('ota-Type_Periode').value;
		var periode = document.getElementById('ota-Periode').value;
		var dateDebut = document.getElementById('ota-Date_Debut').value;
		var dateFin = document.getElementById('ota-Date_Fin').value;
		var fournisseurId = document.getElementById('ota-Fournisseur_Id').value;
		var secteur = document.getElementById('ota-secteur').value;
		var transfere = document.getElementById('ota-chkAffAcomptesTrans').checked;

		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			ota_aAcomptes.clearParams();
			ota_aAcomptes.setParam('Type_Periode', typePeriode);
			ota_aAcomptes.setParam('Periode', periode);
			ota_aAcomptes.setParam('Date_Debut', prepareDateJava(dateDebut));
			ota_aAcomptes.setParam('Date_Fin', prepareDateJava(dateFin));
			ota_aAcomptes.setParam('Secteur_Activite', secteur);
			ota_aAcomptes.setParam('Fournisseur_Id', fournisseurId);
			if (!transfere) { ota_aAcomptes.setParam('SansTrans','true'); }
			ota_aAcomptes.initTree(ota_initListeAcomptes);
			
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_actualiserSelection() {
  try {

		var typePeriode = document.getElementById('ota-Type_Periode').value;
		var dateDebut = document.getElementById('ota-Date_Debut').value;
		var dateFin = document.getElementById('ota-Date_Fin').value;

		if (typePeriode=="P" || (isDate(dateDebut) && isDate(dateFin) && isDateInterval(dateDebut, dateFin))) {
			ota_actualiserListeFactures();
			ota_actualiserListeAvoirs();
			ota_actualiserListeAcomptes();
		} else {
			showWarning("Veuillez saisir un intervalle de dates valide !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ota_initListeFactures() {
	try {
		toutCocher('ota-factures', true);
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_initListeAvoirs() {
	try {
		toutCocher('ota-avoirs', true);
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_initListeAcomptes() {
	try {
		toutCocher('ota-acomptes', true);
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_changerTypePeriode(tp) {
  try {

		var b = (tp=="P");
		document.getElementById('ota-Date_Debut').disabled = b;
		document.getElementById('ota-Date_Fin').disabled = b;
		document.getElementById('ota-Periode').disabled = !b;

	} catch (e) {
    recup_erreur(e);
  }
}


function ota_transferer() {
	try {
		var type = document.getElementById('ota-typeTransfert').value;
		if (type=="FA") { ota_checkFacturesAvoirs("Transfert"); }
		else { ota_checkAcomptes("Transfert"); }
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_checkFacturesAvoirs(type) {
	try {
		
		var listboxFactures = document.getElementById("ota-factures");		
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
		
		var listboxAvoirs = document.getElementById("ota-avoirs");		
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
			var codeJournal = document.getElementById('ota-journalAchat').value;

			if (isEmpty(codeJournal)) {
				showWarning("Veuillez sélectionner un code journal !");
			}
			else if (type=="Export" || window.confirm("Confirmez-vous le transfert en comptabilité des achats sélectionnés ?")) {
				var ok = checkErreurs(listeFactures, "FACTURE_FOURNISSEUR", type);
				if (ok) {
					ok = checkErreurs(listeAvoirs, "AVOIR_FOURNISSEUR", type);
				}
				
				if (ok) {
					if (type=="Transfert") { ota_transfererFacturesAvoirs(listeFactures, listeAvoirs, codeJournal); }
					else { ota_exporterFacturesAvoirs(listeFactures, listeAvoirs, codeJournal); }
				}
			}
			
		} else {
			showWarning("Vous n'avez rien sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ota_transfererFacturesAvoirs(listeFactures, listeAvoirs, codeJournal) {
	try {
		document.getElementById('ota-bTransfert').disabled = true;
		document.getElementById('ota-bExporter').disabled = true;
		
		var qTrans = new QueryHttp("Facturation/Transfert/TransfertAchats.tmpl");
		qTrans.setParam('Code_Journal', codeJournal);
		qTrans.setParam('Liste_Factures', listeFactures);
		qTrans.setParam('Liste_Avoirs', listeAvoirs);
		qTrans.execute();

		ota_aFactures.initTree(ota_initListeFactures);
		ota_aAvoirs.initTree(ota_initListeAvoirs);
		
		document.getElementById('ota-bTransfert').disabled = false;
		document.getElementById('ota-bExporter').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_checkAcomptes(type) {
	try {
		
  	var listboxAcomptes = document.getElementById("ota-acomptes");		
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
			var codeJournal = document.getElementById('ota-journalTransfert').value;
			
			if (codeJournal=="0") {
				showWarning("Veuillez sélectionner un code journal !");
			}
			else if (type=="Export" || window.confirm("Confirmez-vous le transfert en comptabilité des achats sélectionnés ?")) {
				if (checkErreurs(listeAcomptes + listeAnnulAcomptes, "ACOMPTE_FOURN", type)) {
					if (type=="Transfert") { ota_transfererAcomptes(listeAcomptes, listeAnnulAcomptes, codeJournal); }
					else { ota_exporterAcomptes(listeAcomptes, listeAnnulAcomptes, codeJournal); }
				}
			}
		} else {
			showWarning("Vous n'avez rien sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ota_transfererAcomptes(listeAcomptes, listeAnnulAcomptes, codeJournal) {
	try {
		document.getElementById('ota-bTransfert').disabled = true;
		document.getElementById('ota-bExporter').disabled = true;
		
		var qTrans = new QueryHttp("Facturation/Transfert/TransfertAcomptesFournisseurs.tmpl");
		qTrans.setParam('Code_Journal', codeJournal);
		qTrans.setParam('Liste_Acomptes', listeAcomptes);
		qTrans.setParam('Liste_Annul_Acomptes', listeAnnulAcomptes);
		qTrans.execute();

		ota_aAcomptes.initTree(ota_initListeAcomptes);
		
		document.getElementById('ota-bTransfert').disabled = false;
		document.getElementById('ota-bExporter').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_rechercherFournisseur() {
	try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',ota_retourRechercherFournisseur);

	} catch (e) {
		recup_erreur(e);
	}
}


function ota_retourRechercherFournisseur(codeFournisseur) {
	try {
		document.getElementById('ota-Fournisseur_Id').value = codeFournisseur;
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_exporter() {
	try {
		var type = document.getElementById('ota-typeTransfert').value;
		formatExport = document.getElementById('ota-formatExport').value;
		if (isEmpty(formatExport)) { showWarning("Veuillez choisir un format d'export."); }
		else if (checkNomFichierExport(formatExport)) {
			if (type=="FA") { ota_checkFacturesAvoirs("Export"); }
			else { ota_checkAcomptes("Export"); }
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ota_exporterFacturesAvoirs(listeFactures, listeAvoirs, codeJournal) {
	try {
		
		document.getElementById('ota-bTransfert').disabled = true;
		document.getElementById('ota-bExporter').disabled = true;
		
		var qExport = new QueryHttp("Facturation/Transfert/exporterEcritures.tmpl");
		qExport.setParam('Type_Liste', "Factures_Avoirs_Achat");
		qExport.setParam('Format_Id', formatExport);
		qExport.setParam('Code_Journal', codeJournal);
		qExport.setParam('Liste_Factures', listeFactures);
		qExport.setParam('Liste_Avoirs', listeAvoirs);
		result = qExport.execute();
		var fichier = result.responseXML.documentElement.getAttribute('Fichier');
		
		telechargerFichier(fichier, nomFichierDefaut);
		
		document.getElementById('ota-bTransfert').disabled = false;
		document.getElementById('ota-bExporter').disabled = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function ota_exporterAcomptes(listeAcomptes, listeAnnulAcomptes, codeJournal) {
	try {
		
		document.getElementById('ota-bTransfert').disabled = true;
		document.getElementById('ota-bExporter').disabled = true;

		var qExport = new QueryHttp("Facturation/Transfert/exporterEcritures.tmpl");
		qExport.setParam('Type_Liste', "Acomptes_Achat");
		qExport.setParam('Format_Id', formatExport);
		qExport.setParam('Code_Journal', codeJournal);
		qExport.setParam('Liste_Acomptes', listeAcomptes);
		qExport.setParam('Liste_Annul_Acomptes', listeAnnulAcomptes);
		var result = qExport.execute();
		var fichier = result.responseXML.documentElement.getAttribute('Fichier');
		
		telechargerFichier(fichier, nomFichierDefaut);
		
		document.getElementById('ota-bTransfert').disabled = false;
		document.getElementById('ota-bExporter').disabled = false;
			
	} catch (e) {
		recup_erreur(e);
	}
}


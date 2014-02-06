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

var oib_aFiltreJournaux;
var oib_aListeFormat;
var oib_aLigneImport;

var oib_importId;
var oib_besoinAnnee;
var oib_ligneImportId;
var oib_journal;
var oib_paramId;
var oib_coherence;
var oib_etatValide;
var oib_soldesOk;

function oib_init() {
 	try {
 		oib_reset();
 		
 		// verrouillage de la barre de saisie de ligne
 		oib_activeLigneImport(false);
 		
  		// init de la liste de journaux
  		oib_aFiltreJournaux = new Arbre('Compta/ImportBanque/comboJournauxTR.tmpl', 'oib-journal');
  		oib_aFiltreJournaux.initTree();
  		
  		// init de la liste de format
  		oib_aListeFormat = new Arbre('Compta/ImportBanque/comboFormatsImport.tmpl','oib-formatImport');
  		oib_aListeFormat.initTree();
  		
  		// init des lignes l'import
  		oib_aLigneImport = new Arbre('Compta/ImportBanque/listeLigneImport.tmpl','oib-treeLigneImport');
  		oib_aLigneImport.initTree();
  		
  		// init de la liste d'écritures
  		oib_aEcritureBanque = new Arbre('Compta/ImportBanque/listeEcritureBanque.tmpl','oib-treeLigneEcriture');
  		oib_aEcritureBanque.initTree();
	} catch (e) {
  		recup_erreur(e);
	}
}

/* reset tout sauf les arbres */
function oib_reset() {
	try {
 		oib_importId = 0;
 		oib_besoinAnnee = false;
 		oib_ligneImportId = 0;
 		oib_journal = 0;
 		oib_paramId = 0;
 		oib_coherence = false;
 		oib_etatValide = false;
 		oib_soldesOk = false;
 		
 		oib_videImport();
 		oib_videLigneImport();
 		oib_videParam();
 		
 		document.getElementById('oib-journal').selectedIndex = 0;
 		ogi_setTabParamDisabled(true);
 		
		document.getElementById('oib-menuImport').collapsed = false;
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_activeImport(boolean) {
	try {
		if (oib_etatValide) {
			document.getElementById('oib-formatImport').disabled = true;
			document.getElementById('oib-anneeImport').disabled = true;
			document.getElementById('oib-fichierImport').disabled = true;
			document.getElementById('oib-bImporter').disabled = true;
			document.getElementById('oib-soldeDebut').disabled = true;
			document.getElementById('oib-soldeFin').disabled = true;
		} else {
			document.getElementById('oib-formatImport').disabled = !boolean;
			document.getElementById('oib-anneeImport').disabled = !boolean;
			document.getElementById('oib-fichierImport').disabled = !boolean;
			if (document.getElementById('oib-formatImport').value==0) {
				document.getElementById('oib-bImporter').disabled = true;
			} else {
				document.getElementById('oib-bImporter').disabled = !boolean;
			}
			document.getElementById('oib-soldeDebut').disabled = !boolean;
			document.getElementById('oib-soldeFin').disabled = !boolean;
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_activeLigneImport(boolean) {
	try {
		if (oib_importId==0 || oib_etatValide) {
			document.getElementById('oib-dateLigne').disabled = true;
			document.getElementById('oib-libelleLigne').disabled = true;
			document.getElementById('oib-debitLigne').disabled = true;
			document.getElementById('oib-creditLigne').disabled = true;
			document.getElementById('oib-reglementLigne').disabled = true;
			document.getElementById('oib-pieceLigne').disabled = true;
			document.getElementById('oib-annulerLigne').disabled = true;
			document.getElementById('oib-validerLigne').disabled = true;
			document.getElementById('oib-supprimerLigne').disabled = true;
		} else {
			document.getElementById('oib-dateLigne').disabled = !boolean;
			document.getElementById('oib-libelleLigne').disabled = !boolean;
			document.getElementById('oib-debitLigne').disabled = !boolean;
			document.getElementById('oib-creditLigne').disabled = !boolean;
			document.getElementById('oib-reglementLigne').disabled = !boolean;
			document.getElementById('oib-pieceLigne').disabled = !boolean;
			document.getElementById('oib-annulerLigne').disabled = !boolean;
			document.getElementById('oib-validerLigne').disabled = !boolean;
			document.getElementById('oib-supprimerLigne').disabled = !boolean;
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_activeParam(boolean) {
	try {
		if (oib_etatValide || oib_importId==0) {
			document.getElementById('oib-journal').disabled = true;
		} else {
			document.getElementById('oib-journal').disabled = !boolean;
		}
		oib_activeInfosParam(boolean);
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_activeInfosParam(boolean) {
	try {
		if (oib_paramId==0 || oib_etatValide) {
			document.getElementById('oib-chkCentralisee').disabled = true;
			document.getElementById('oib-compteBanque').disabled = true;
			document.getElementById('oib-bRechBanque').disabled = true;
			document.getElementById('oib-chkFusion').disabled = true;
			document.getElementById('oib-compteAttente').disabled = true;
			document.getElementById('oib-bRechAttente').disabled = true;
		} else {
			document.getElementById('oib-chkCentralisee').disabled = !boolean;
			document.getElementById('oib-compteBanque').disabled = !boolean;
			document.getElementById('oib-bRechBanque').disabled = !boolean;
			document.getElementById('oib-chkFusion').disabled = !boolean;
			document.getElementById('oib-compteAttente').disabled = !boolean;
			document.getElementById('oib-bRechAttente').disabled = !boolean;
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_activeActionImport(boolean) {
	try {
		if (oib_importId==0 || oib_etatValide) {
			document.getElementById('oib-supprimer').disabled = true;
		} else {
			document.getElementById('oib-supprimer').disabled = !boolean;
		}
		if (oib_paramId==0 || oib_etatValide) {
			document.getElementById('oib-rafraichir').disabled = true;
		} else {
			document.getElementById('oib-rafraichir').disabled = !boolean;
		}
		if (!oib_coherence || oib_etatValide || !oib_soldesOk) {
			document.getElementById('oib-valider').disabled = true;
		} else {
			document.getElementById('oib-valider').disabled = !boolean;
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_activeAll(boolean) {
	try {
		oib_activeImport(boolean);
		oib_activeLigneImport(boolean);
		oib_activeParam(boolean);
		oib_activeActionImport(boolean);
		ogi_setTabParamDisabled(oib_etatValide || oib_journal==0 || !boolean);
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_videImport() {
	try {
		document.getElementById('oib-formatImport').value = 0;
		document.getElementById('oib-fichierImport').value = "";
		document.getElementById('oib-anneeImport').value = "";
		document.getElementById('oib-soldeDebut').value = "";
		document.getElementById('oib-soldeFin').value = "";
		document.getElementById('oib-soldeCalcule').value = "";
		document.getElementById('oib-journal').value = 0;
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_videLigneImport() {
	try {
		document.getElementById('oib-dateLigne').value = "";
		document.getElementById('oib-libelleLigne').value = "";
		document.getElementById('oib-debitLigne').value = "";
		document.getElementById('oib-creditLigne').value = "";
		document.getElementById('oib-reglementLigne').value = "";
		document.getElementById('oib-pieceLigne').value = "";
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_videParam() {
	try {
		document.getElementById('oib-compteBanque').value = "";
		document.getElementById('oib-compteAttente').value = "";
		document.getElementById('oib-chkCentralisee').checked = "";
		document.getElementById('oib-chkFusion').checked = "";
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_nouveau() {
 	try {
 		oib_reset();
 		
 		oib_activeAll(true);
		
		oib_aLigneImport.clearParams();
  		oib_aLigneImport.initTree();
  		
  		oib_aEcritureBanque.clearParams();
  		oib_aEcritureBanque.initTree();
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_ouvrir(importId) {
 	try {
		ogi_setSelectedTab(0);
		oib_reset();
		
		oib_importId = importId;
		
		//recuperation de l'import
		var qGetImport = new QueryHttp("Compta/ImportBanque/getImport.tmpl");
		qGetImport.setParam("ImportId", oib_importId);
		var result = qGetImport.execute();
		
		var debut = result.responseXML.documentElement.getAttribute('debut');
		var fin = result.responseXML.documentElement.getAttribute('fin');
		var calc = result.responseXML.documentElement.getAttribute('calc');
		var etat = result.responseXML.documentElement.getAttribute('etat');
		var date = result.responseXML.documentElement.getAttribute('date');
		var param = result.responseXML.documentElement.getAttribute('param');
		var format = result.responseXML.documentElement.getAttribute('format');
		var coherence = result.responseXML.documentElement.getAttribute('coherence');
		var journal = result.responseXML.documentElement.getAttribute('journal');
		var banque = result.responseXML.documentElement.getAttribute('banque');
		var central = result.responseXML.documentElement.getAttribute('central');
		var lsm = result.responseXML.documentElement.getAttribute('lsm');
		var comcb = result.responseXML.documentElement.getAttribute('comcb');
		var attente = result.responseXML.documentElement.getAttribute('attente');
		
		document.getElementById('oib-soldeDebut').value = debut;
		document.getElementById('oib-soldeFin').value = fin;
		document.getElementById('oib-soldeCalcule').value = calc;
		oib_soldesOk = (fin==calc);
		
		if (!isEmpty(etat) && etat!="V") {
			oib_etatValide=false;
		} else {
			oib_etatValide=true;
		}
		
		if (isEmpty(param)) {
			param = 0;
		}
		oib_paramId = param;
		
		ogi_setTabParamDisabled(oib_paramId==0); 
		
		if (isEmpty(format)) {
			format = 0;
		}
		document.getElementById('oib-formatImport').value = format;
		oib_activeAnnee();
		
		oib_coherence = isEmpty(coherence)?false:(coherence!=0);
		
		if (isEmpty(journal)) {
			journal = 0;
		}
		oib_journal = journal;
		document.getElementById('oib-journal').value = oib_journal;
		document.getElementById('oib-chkCentralisee').checked = isEmpty(central)?false:(central!="0");
		document.getElementById('oib-compteBanque').value = banque;//isEmpty(banque)?'51200000':banque;
		document.getElementById('oib-chkFusion').checked = isEmpty(lsm)?false:(lsm!="0");
		document.getElementById('oib-compteAttente').value = attente;//isEmpty(attente)?'47200000':attente;
		
		oib_activeAll(true);
		
		// mise à jour du tableau de lignes d'import
		oib_aLigneImport.clearParams();
		oib_aLigneImport.setParam("importId", oib_importId);
  		oib_aLigneImport.initTree();
  		
  		// mise à jour du tableau d'ecritures
  		oib_aEcritureBanque.clearParams();
  		oib_aEcritureBanque.setParam("importId", oib_importId);
  		oib_aEcritureBanque.initTree();
		
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_importer() {
	try {
	  	if (isEmpty(document.getElementById('oib-fichierImport').value)) {
			showWarning('Vous devez sélectionner un fichier à importer !');
		} else {
			// récupération du nom de fichier
			var fichierImport = getFileName(document.getElementById('oib-fichierImport').value);
			// passage du fichier à la fenêtre de chargement
			var url = "chrome://opensi/content/compta/util/upload.xul?"+ cookie();
			url += "&file="+ document.getElementById('oib-fichierImport').value;
			url += "&dir=iobuffer";
			// ouverture de la fenêtre de chargement
			window.openDialog(url,'','chrome,modal,centerscreen');
			// traitement import
			var formatImport = document.getElementById('oib-formatImport').value;
			var queryImport = new QueryHttp("Compta/ImportBanque/processImport.tmpl");
			queryImport.setParam("ImportId", oib_importId);
			queryImport.setParam("Format", formatImport);
			queryImport.setParam("Fichier", fichierImport);
			queryImport.setParam("Annee", document.getElementById('oib-anneeImport').value);
			var result=queryImport.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
			} else {
				// reload
				oib_ouvrir(result.responseXML.documentElement.getAttribute("Import_Id"));
			}
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_activeAnnee() {
	try {
		if (document.getElementById('oib-formatImport').value!=0) {
	  		var queryAnnee = new QueryHttp("Compta/ImportBanque/getBesoinAnnee.tmpl");
	  		queryAnnee.setParam("Format", document.getElementById('oib-formatImport').value);
	  		var result = queryAnnee.execute();
			var errors = new Errors(result);
			if (errors.hasNext()) {
				errors.show();
			} else {
				oib_besoinAnnee = (result.responseXML.documentElement.getAttribute("besoin")=="true");
	  			document.getElementById('oib-ligneAnnee').collapsed = !oib_besoinAnnee;
	  			if (!oib_besoinAnnee) {
	  				document.getElementById('oib-anneeImport').value = "";
	  			}
	  		}
	  	} else {
	  		oib_besoinAnnee = false;
	  		document.getElementById('oib-ligneAnnee').collapsed = true;
	  		document.getElementById('oib-anneeImport').value = "";
	  	}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_verifAnnee(annee) {
	try {
		if (annee.length==4) {
			return isPositive(annee);
		} else {
			return false;
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_pressOnImporter() {
	try {
		if (oib_importId==0 || window.confirm("Êtes-vous sûr de vouloir écraser les précédentes données de l'import ?")) {
			if (oib_besoinAnnee && isEmpty(document.getElementById('oib-anneeImport').value)) {
				showWarning("Veuillez saisir une année concernée pour ce type d'import !");
			} else if (oib_besoinAnnee && !oib_verifAnnee(document.getElementById('oib-anneeImport').value)) {
				showWarning("Veuillez saisir une année au format 'yyyy' !");
			} else {
				oib_activeImport(false);
				var debut = document.getElementById('oib-soldeDebut').value;
				var fin = document.getElementById('oib-soldeFin').value;
	  			oib_importer();
	  			document.getElementById('oib-soldeDebut').value = debut;
	  			document.getElementById('oib-soldeFin').value = fin;
	  			if (oib_importId!=0) {
					oib_saveSoldes();
	  			}
	  			oib_activeImport(true);
	  		}
	  	}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_selectOnFormatImport() {
	try {
  		oib_activeAnnee();
  		oib_activeImport(true);
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_selectOnTreeLigneImport() {
	try {
 		if (oib_aLigneImport.isSelected()) {
 			var index = oib_aLigneImport.getCurrentIndex();
			oib_ligneImportId = oib_aLigneImport.getCellText(index,"oib-colLigneId");
			document.getElementById('oib-dateLigne').value = oib_aLigneImport.getCellText(index,'oib-colDate');
			document.getElementById('oib-libelleLigne').value = oib_aLigneImport.getCellText(index,'oib-colLibelle');
			document.getElementById('oib-debitLigne').value = oib_aLigneImport.getCellText(index,'oib-colDebit');
			document.getElementById('oib-creditLigne').value = oib_aLigneImport.getCellText(index,'oib-colCredit');
			document.getElementById('oib-reglementLigne').value = oib_aLigneImport.getCellText(index,'oib-colReglement');
			document.getElementById('oib-pieceLigne').value = oib_aLigneImport.getCellText(index,'oib-colNumPiece');
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oib_pressOnAnnulerLigne() {
	try {
  		oib_annulerLigne();
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_pressOnValiderLigne() {
	try {
  		// verif date
  		if (isEmpty(document.getElementById('oib-dateLigne').value)
  			|| !isDate(document.getElementById('oib-dateLigne').value)) { showWarning("Date incorrecte !"); }
  			
  		// verif libelle
  		else if (isEmpty(document.getElementById('oib-libelleLigne').value)) { showWarning("Libellé incorrect !"); }
  		
  		// verif debit (la partie décimale ne peut faire plus de 2 caractères)
		else if (!checkDecimal(document.getElementById('oib-debitLigne').value,2)) { showWarning("Montant au débit incorrect !"); }
		
		// verif debit (la partie entière ne peut faire plus de 14 caractères)
		else if (!checkIPart(document.getElementById('oib-debitLigne').value,14)) { showWarning("Montant au débit incorrect !"); }
		
		// verif debit (positif)
		else if (!isPositiveOrNull(document.getElementById('oib-debitLigne').value)) { showWarning("Montant au débit incorrect : montant négatif !"); }
		
		// verif credit (la partie décimale ne peut faire plus de 2 caractères)
		else if (!checkDecimal(document.getElementById('oib-creditLigne').value,2)) { showWarning("Montant au crédit incorrect !"); }
		
		// verif credit (la partie entière ne peut faire plus de 14 caractères)
		else if (!checkIPart(document.getElementById('oib-creditLigne').value,14)) { showWarning("Montant au crédit incorrect !"); }
		
		// verif credit (positif)
		else if (!isPositiveOrNull(document.getElementById('oib-creditLigne').value)) { showWarning("Montant au crédit incorrect : montant négatif !"); }
		
		// verif debit ou credit : l'un ou l'autre doit être vide mais pas les deux
		// doubles vides : (d="" || d=0) && (c="" || c=0)
		else if ((isEmpty(document.getElementById('oib-debitLigne').value)
				|| document.getElementById('oib-debitLigne').value==0)
			&& (isEmpty(document.getElementById('oib-creditLigne').value)
				|| document.getElementById('oib-creditLigne').value==0)) { 
			showWarning("Veuillez saisir un debit ou un credit !");
		}
		// doubles montants : d=x && c=x  <=>  d!="" && d!=0 && c!="" && c!=0
		else if (!isEmpty(document.getElementById('oib-debitLigne').value)
			&& !isEmpty(document.getElementById('oib-creditLigne').value)
			&& document.getElementById('oib-debitLigne').value!=0
			&& document.getElementById('oib-creditLigne').value!=0) {
			showWarning("Veuillez ne saisir qu'un débit OU un crédit !");
		}
  		else {
  			oib_activeLigneImport(false);
 			oib_saveSoldes();
  			oib_saveLigne();
  		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_pressOnSupprimerLigne() {
	try {
  		if (oib_ligneImportId!=0) {
			oib_activeLigneImport(false);
			oib_saveSoldes();
  			oib_supprimerLigne();
  		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_annulerLigne() {
	try {
		oib_ligneImportId = 0;
		oib_aLigneImport.select(-1);
		
		document.getElementById('oib-dateLigne').value = "";
		document.getElementById('oib-libelleLigne').value = "";
		document.getElementById('oib-debitLigne').value = "";
		document.getElementById('oib-creditLigne').value = "";
		document.getElementById('oib-reglementLigne').value = "";
		document.getElementById('oib-pieceLigne').value = "";
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_saveLigne() {
	try {
		var querySave = new QueryHttp("Compta/ImportBanque/saveLigne.tmpl");
		
		querySave.setParam("Ligne_Id", oib_ligneImportId);
		querySave.setParam("Date", document.getElementById('oib-dateLigne').value);
		querySave.setParam("Libelle", urlEncode(document.getElementById('oib-libelleLigne').value));
		querySave.setParam("Montant_D", document.getElementById('oib-debitLigne').value);
		querySave.setParam("Montant_C", document.getElementById('oib-creditLigne').value);
		querySave.setParam("Mode_Reg", document.getElementById('oib-reglementLigne').value);
		querySave.setParam("Num_Piece", urlEncode(document.getElementById('oib-pieceLigne').value));
		querySave.setParam("Import_Id", oib_importId);
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			oib_activeAll(true);
		} else {
			// rafraichir l'arbre
	  		oib_ouvrir(oib_importId);
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_supprimerLigne() {
	try {
		var querySuppr = new QueryHttp("Compta/ImportBanque/deleteLigne.tmpl");
		
		querySuppr.setParam("Ligne_Id", oib_ligneImportId);
		
		var result = querySuppr.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			oib_activeAll(true);
		} else {
			// rafraichir l'arbre
	  		oib_ouvrir(oib_importId);
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_selectOnJournal() {
	try {
		var journal = document.getElementById('oib-journal').value;
		ogi_setTabParamDisabled(journal==0);
		oib_saveSoldes();
		
		if (journal!=0) {
			oib_saveJournal();
			oib_getParam();
		} else {
			oib_videParam();
			oib_paramId = 0;
			oib_activeParam(true);
			oib_activeActionImport(true);
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_pressOnRechercherCompteBanque() {
	try {
		oib_recherche_compteBanque();
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_pressOnRechercherCompteJournal() {
	try {
		oib_recherche_compteAttente();
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_saveJournal() {
	try {
		var querySave = new QueryHttp("Compta/ImportBanque/saveJournalImport.tmpl");
  		querySave.setParam("Import_Id", oib_importId);
  		querySave.setParam("Journal", document.getElementById('oib-journal').value);
  		var result = querySave.execute();
		var errors = new Errors(result);
		if (errors.hasNext()) {
			errors.show();
		} else {
			oib_ouvrir(oib_importId);
  		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_getParam() {
	try {
		var qGetParam = new QueryHttp("Compta/ImportBanque/getParam.tmpl");
		qGetParam.setParam("paramId", oib_paramId);
		var result = qGetParam.execute();
		if (!isEmpty(result.responseXML.documentElement.getAttribute('id'))) {
			var journal = result.responseXML.documentElement.getAttribute('journal');
			var banque = result.responseXML.documentElement.getAttribute('banque');
			var central = result.responseXML.documentElement.getAttribute('central');
			var lsm = result.responseXML.documentElement.getAttribute('lsm');
			var comcb = result.responseXML.documentElement.getAttribute('comcb');
			var attente = result.responseXML.documentElement.getAttribute('attente');
			
			oib_journal = journal;
			document.getElementById('oib-journal').value = oib_journal;
			document.getElementById('oib-chkCentralisee').checked = isEmpty(central)?false:(central!="0");
			document.getElementById('oib-compteBanque').value = banque;
			document.getElementById('oib-chkFusion').checked = isEmpty(lsm)?false:(lsm!="0");
			document.getElementById('oib-compteAttente').value = attente;
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_pressOnSupprimer() {
	try {
		oib_activeActionImport(false);
  		oib_supprimerImport();
  		oib_activeActionImport(true);
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_pressOnRafraichir() {
	try {
		// verif comptes vides
		if (!isCompteCorrect(document.getElementById('oib-compteBanque').value)) { showWarning("Numéro de compte de banque incorrect !"); }
		else if (!isCompteCorrect(document.getElementById('oib-compteAttente').value)) { showWarning("Numéro de compte d'attente incorrect !"); }
		else {
			oib_activeActionImport(false);
			oib_saveSoldes();
			oib_saveParam();
			oib_refreshListeEcriture();
			oib_activeActionImport(true);
	  	}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_pressOnValider() {
	try {
 		oib_activeActionImport(false);
		oib_saveSoldes();
		if (oib_soldesOk) {
			oib_validerImport();
		} else {
			showWarning("Les soldes ne correspondent plus, la validation est annulée !");
		}
		oib_activeActionImport(true);
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_recherche_compteBanque() {
	try {
		var compte = document.getElementById('oib-compteBanque').value;
		var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie()+"&Creer=false&Num_Compte="+ urlEncode(compte);
		window.openDialog(url,'','chrome,modal,centerscreen',oib_retourRechercheCompteBanque);
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_retourRechercheCompteBanque(numCompte) {
	try {
		document.getElementById('oib-compteBanque').value = numCompte;
	} catch (e) {
		recup_erreur(e);
	}
}

function oib_recherche_compteAttente() {
	try {
		var compte = document.getElementById('oib-compteAttente').value;
		var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie()+"&Creer=false&Num_Compte="+ urlEncode(compte);
		window.openDialog(url,'','chrome,modal,centerscreen',oib_retourRechercheCompteAttente);
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_retourRechercheCompteAttente(numCompte) {
	try {
		document.getElementById('oib-compteAttente').value = numCompte;
	} catch (e) {
		recup_erreur(e);
	}
}

function oib_supprimerImport() {
	try {
		var querySuppr = new QueryHttp("Compta/ImportBanque/deleteImport.tmpl");
		
		querySuppr.setParam("Import_Id", oib_importId);
		
		var result = querySuppr.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			retourListeImport();
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_saveParam() {
	try {
		var querySave = new QueryHttp("Compta/ImportBanque/saveParam.tmpl");
  		querySave.setParam("Param_Id", oib_paramId);
  		querySave.setParam("Compte_Banque", document.getElementById('oib-compteBanque').value);
  		querySave.setParam("Centralisation", document.getElementById('oib-chkCentralisee').checked);
  		querySave.setParam("Concat_LSM", document.getElementById('oib-chkFusion').checked);
  		querySave.setParam("Compte_Attente", document.getElementById('oib-compteAttente').value);
  		var result = querySave.execute();
		var errors = new Errors(result);
		if (errors.hasNext()) {
			errors.show();
		} else {
			oib_paramId = result.responseXML.documentElement.getAttribute("Param_Id");
  		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_refreshListeEcriture() {
	try {
		var queryRefresh = new QueryHttp("Compta/ImportBanque/genListeEcriture.tmpl");
		queryRefresh.setParam("Import_Id", oib_importId);
		var result = queryRefresh.execute();
		var errors = new Errors(result);
		if (errors.hasNext()) {
			errors.show();
		} else {
			var coherence = (result.responseXML.documentElement.getAttribute("Coherence")=="true");
			if (!coherence) {
				var message = result.responseXML.documentElement.getAttribute("Message");
				showWarning(message);
			}
			oib_ouvrir(oib_importId);
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_validerImport() {
	try {
		var queryValider = new QueryHttp("Compta/ImportBanque/validateImport.tmpl");
		queryValider.setParam("Import_Id", oib_importId);
		var result = queryValider.execute();
		var errors = new Errors(result);
		if (errors.hasNext()) {
			errors.show();
		} else {
			showWarning("L'import a été correctement effectué");
			retourListeImport();
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_saveSoldes() {
	try {
		var nf = new NumberFormat("0.00", false);
		if (!oib_verifSoldes()) {
			document.getElementById('oib-soldeDebut').value = nf.format(0);
			document.getElementById('oib-soldeFin').value = nf.format(0);
		}
		var querySave = new QueryHttp("Compta/ImportBanque/saveSoldes.tmpl");
		querySave.setParam("Import_Id", oib_importId);
		var debut = document.getElementById('oib-soldeDebut').value;
		var fin = document.getElementById('oib-soldeFin').value;
		querySave.setParam("Solde_Debut", debut);
		querySave.setParam("Solde_Fin", fin);
		var result = querySave.execute();
		var errors = new Errors(result);
		if (errors.hasNext()) {
			errors.show();
			oib_soldesOk = false;
		} else {
			var calc = result.responseXML.documentElement.getAttribute("Solde_Calc");
			calc = nf.format(calc);
			debut = nf.format(debut);
			fin = nf.format(fin);
			document.getElementById('oib-soldeCalcule').value = calc;
			document.getElementById('oib-soldeDebut').value = debut;
			document.getElementById('oib-soldeFin').value = fin;
			oib_soldesOk = (calc==fin);
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function oib_verifSoldes() {
	try {
		var ok = true;
		// verif debut (partie entière : 14 car max ; partie décimale : car)
		if (!checkNumber(document.getElementById('oib-soldeDebut').value,14, 2)) {
			showWarning("Solde de début incorrect !");
			ok = false;
		}
		// verif fin (partie entière : 14 car max ; partie décimale : car)
		else if (!checkNumber(document.getElementById('oib-soldeFin').value,14, 2)) {
			showWarning("Solde de fin incorrect !");
			ok = false;
		}
		return ok;
	} catch (e) {
  		recup_erreur(e);
	}
}
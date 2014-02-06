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

var ofa_aModeleEcriture;
var ofa_aListeEcheance;
var ofa_aComboModes;
var ofa_aFiltreJournaux;

var ofa_abonnementId;
var ofa_etatAbonnement;
var ofa_ligneId;
var ofa_change;


function ofa_init() {
  try {
  		// init des variables globales
  		ofa_abonnementId = 0;
  		ofa_etatAbonnement = 'N';
  		ofa_ligneId = 0;
  		ofa_change = false;
  		
  		// init de la menulist des journaux
  		ofa_aFiltreJournaux = new Arbre('Compta/GetRDF/combo-journauxSansAN.tmpl', 'ofa-journal');
  		
  		// init de la menulist des modes de règlement
  		ofa_aComboModes = new Arbre("ComboListe/combo-modesReglement.tmpl","ofa-filtreModesLigne");
  		
  		// init du modèle
  		ofa_aModeleEcriture = new Arbre("Compta/Abonnement/getModele.tmpl","ofa-modeleEcriture");
  		
  		// init de la liste d'échéances
  		ofa_aListeEcheance = new Arbre("Compta/Abonnement/listeEcheanceFiche.tmpl","ofa-listeEcheance");
  		
  		// init du rendez-vous pour les filtres
  		var sia = new SyncInitArbre(ofa_finInit);
  		sia.add(ofa_aFiltreJournaux);
  		sia.add(ofa_aComboModes);
  		ofa_desactiveMenu();
  		sia.load();
	} catch (e) {
  		recup_erreur(e);
	}
}

function ofa_finInit() {
	try {
		//setTimeout("ofa_activeMenu();", 100);
		ofa_activeMenu();
	} catch (e) {
  		recup_erreur(e);
	}
}

function ofa_desactiveMenu() {
	try {
		// actions du menu haut
		document.getElementById('ofa-bCopier').disabled = true;
		document.getElementById('ofa-bSupprimer').disabled = true;
		document.getElementById('ofa-bAnnuler').disabled = true;
		document.getElementById('ofa-bNouveau').disabled = true;
		document.getElementById('ofa-bEnregistrer').disabled = true;
		document.getElementById('ofa-bValider').disabled = true;
		
		// actions de la ligne d'insertion
		ofa_desactiveActionLigne();
		
		// action des échéances
		document.getElementById("ofa-generer").disabled = true;
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_activeMenu() {
	try {
		if (ofa_abonnementId!=0) {	
			// la copie est possible dès lors qu'un abonnement est chargé (id!=0) et que toute modif a été sauvée
			document.getElementById('ofa-bCopier').disabled = ofa_change;
			
			// de même pour les actions sur le modèle ; elles seront désactivées si l'abonnement n'est pas nouveau
			ofa_activeActionLigne();
			
			// la suppression est possible tant qu'aucune écriture n'a été générée
			// sinon l'annulation devient possible, sauf si l'abonnement n'est pas en cours 
			if (ofa_existEcriture("G")) {
				document.getElementById('ofa-bAnnuler').disabled = (ofa_etatAbonnement!='T');
				document.getElementById('ofa-bSupprimer').disabled = true;
			} else {
				document.getElementById('ofa-bAnnuler').disabled = true;
				document.getElementById('ofa-bSupprimer').disabled = false;
			}
			
			// la validation n'est possible que si l'abonnement est enregistré, nouveau, et qu'il présente un modèle équilibré
			document.getElementById('ofa-bValider').disabled = !(ofa_etatAbonnement=='N' && !ofa_change && ofa_isValidModele());
		}
		// seuls les boutons nouveau et enregistrer fonctionnent en cas de nouvel abo (id=0)
		document.getElementById('ofa-bNouveau').disabled = false;
		
		// enregistrer est activé dès qu'il y a une saisie et tant qu'elle n'a pas été sauvegardée
		document.getElementById('ofa-bEnregistrer').disabled = !ofa_change;
		
		// la génération d'écriture n'est possible que sur un abonnement en cours et disposant d'au moins une écriture 'en attente'
		document.getElementById('ofa-generer').disabled = !(ofa_etatAbonnement=='T' && ofa_existEcriture("N"));
		
		// reset de la ligne de saisie
		ofa_annulerLigneModele();
		
		// si l'abonnement est dans un état autre que nouveau toutes les saisies sont bloquées
		if (ofa_etatAbonnement!='N') {
			ofa_lockParams();
			ofa_lockLigne();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_desactiveActionLigne() {
	try {
		document.getElementById('ofa-annulerLigne').disabled = true;
		document.getElementById('ofa-validerLigne').disabled = true;
		document.getElementById('ofa-supprimerLigne').disabled = true;
		document.getElementById('ofa-chkPeriode').disabled = true;
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_activeActionLigne() {
	try {
		// on active les actions sur le modèle uniquement si l'abonnement est nouveau
		if (ofa_etatAbonnement=='N') {
			document.getElementById('ofa-annulerLigne').disabled = false;
			document.getElementById('ofa-validerLigne').disabled = false;
			document.getElementById('ofa-supprimerLigne').disabled = false;
			document.getElementById('ofa-chkPeriode').disabled = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_lockLigne() {
	try {
		document.getElementById('ofa-compteLigne').disabled = true;
		document.getElementById('ofa-libelleLigne').disabled = true;
		document.getElementById('ofa-filtreModesLigne').disabled = true;
		document.getElementById('ofa-infosLigne').disabled = true;
		document.getElementById('ofa-debitLigne').disabled = true;
		document.getElementById('ofa-creditLigne').disabled = true;
		document.getElementById('ofa-pieceLigne').disabled = true;
		ofa_desactiveActionLigne();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_unlockLigne() {
	try {
		// on active les lignes du modèle uniquement si l'abonnement est nouveau
		if (ofa_etatAbonnement=='N') {
			document.getElementById('ofa-compteLigne').disabled = false;
			document.getElementById('ofa-libelleLigne').disabled = false;
			document.getElementById('ofa-filtreModesLigne').disabled = false;
			document.getElementById('ofa-infosLigne').disabled = false;
			document.getElementById('ofa-debitLigne').disabled = false;
			document.getElementById('ofa-creditLigne').disabled = false;
			document.getElementById('ofa-pieceLigne').disabled = false;
		}
		ofa_activeActionLigne();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_lockParams() {
	try {
		document.getElementById('ofa-libelle').disabled = true;
		document.getElementById('ofa-journal').disabled = true;
		document.getElementById('ofa-etat').disabled = true;
		document.getElementById('ofa-periodicite').disabled = true;
		document.getElementById('ofa-debut').disabled = true;
		document.getElementById('ofa-fin').disabled = true;
		document.getElementById('ofa-chkFinMois').disabled = true;
		document.getElementById('ofa-labelEcriture').disabled = false;
		document.getElementById('ofa-ecriture').disabled = true;
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_unlockParams() {
	try {
		document.getElementById('ofa-libelle').disabled = false;
		document.getElementById('ofa-journal').disabled = false;
		document.getElementById('ofa-etat').disabled = false;
		document.getElementById('ofa-periodicite').disabled = false;
		document.getElementById('ofa-debut').disabled = false;
		document.getElementById('ofa-fin').disabled = false;
		document.getElementById('ofa-chkFinMois').disabled = false;
		document.getElementById('ofa-labelEcriture').disabled = false;
		document.getElementById('ofa-ecriture').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_existEcriture(statut) {
	try {
		var trouve = false;
		var i=0
		while (i<ofa_aListeEcheance.nbLignes() && !trouve) {
			if (ofa_aListeEcheance.getCellText(i,"ofa-colStatutId")==statut) {
				trouve = true;
			}
			i++;
		}
		return trouve;
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_ouvrir(abonnement_id) {
	try {	
		// indicateurs de sélection
		ofa_abonnementId = abonnement_id;
  		ofa_etatAbonnement = 'N';
		ofa_ligneId = 0;
		ofa_change = false;
		
		
		ofa_unlockParams();
		ofa_unlockLigne();
		ofa_desactiveMenu();
		
		// reset du formulaire de ligne
  		ofa_annulerLigneModele();
		
		// init paramètres généraux
		var ofa_qGetAbonnement = new QueryHttp("Compta/Abonnement/getAbonnement.tmpl");
		if (ofa_abonnementId!=0) {
			ofa_qGetAbonnement.setParam("IdAbo", ofa_abonnementId);
		}
		var result = ofa_qGetAbonnement.execute();
		var field = "";
		
		document.getElementById('ofa-libelle').value = result.responseXML.documentElement.getAttribute('libelle');
		field = result.responseXML.documentElement.getAttribute('etat');
		ofa_etatAbonnement = isEmpty(field)?"N":field;
		document.getElementById('ofa-etat').value = ofa_libelleEtat(ofa_etatAbonnement);
		document.getElementById('ofa-debut').value = result.responseXML.documentElement.getAttribute('debut');
		document.getElementById('ofa-fin').value = result.responseXML.documentElement.getAttribute('fin');
		field = result.responseXML.documentElement.getAttribute('journal');
		document.getElementById('ofa-journal').value = isEmpty(field)?"0":field;
		field = result.responseXML.documentElement.getAttribute('periodicite');
		document.getElementById('ofa-periodicite').value = isEmpty(field)?"0":field;
		ofa_checkPeriodicite();
		field = result.responseXML.documentElement.getAttribute('dfm');
		document.getElementById('ofa-chkFinMois').checked = isEmpty(field)?false:(field!="0");
		ofa_chkFinMois();
		if (!document.getElementById('ofa-chkFinMois').checked) {
			document.getElementById('ofa-ecriture').value = result.responseXML.documentElement.getAttribute('jour');
		}
		
		// init du modèle
  		ofa_aModeleEcriture.clearParams;
  		ofa_aModeleEcriture.setParam("AboId", ofa_abonnementId);
  		
  		// init de la liste d'échéances
  		ofa_aListeEcheance.clearParams;
  		ofa_aListeEcheance.setParam("AboId", ofa_abonnementId);
  		
  		// init du rendez-vous
  		var sia = new SyncInitArbre(ofa_finInit);
  		sia.add(ofa_aModeleEcriture);
  		sia.add(ofa_aListeEcheance);
  		sia.load();
		
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_copier() {
	try {
		ofa_desactiveMenu();
		
		var queryCopier = new QueryHttp("Compta/Abonnement/copyAbonnement.tmpl");
		
		queryCopier.setParam("Abt_Ecr_Id", ofa_abonnementId);
		
		var result = queryCopier.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			ofa_activeMenu();
		} else {
			showWarning("L'abonnement a été dupliqué !");
			ofa_ouvrir(result.responseXML.documentElement.getAttribute('Abt_Ecr_Id'));
		}
  		
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_supprimer() {
	try {
		ofa_desactiveMenu();
		
		var queryDelete = new QueryHttp("Compta/Abonnement/deleteAbonnement.tmpl");
		
		queryDelete.setParam("Abt_Ecr_Id", ofa_abonnementId);
		
		var result = queryDelete.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			ofa_activeMenu();
		} else {
			showWarning("L'abonnement a été supprimé !");
			retourListeAbonnement();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_annuler() {
	try {
		ofa_desactiveMenu();
		
		var queryAnnuler = new QueryHttp("Compta/Abonnement/annuleAbonnement.tmpl");
		
		queryAnnuler.setParam("Abt_Ecr_Id", ofa_abonnementId);
		
		var result = queryAnnuler.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			ofa_activeMenu();
		} else {
			showWarning("L'abonnement a été annulé !");
			retourListeAbonnement();
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_nouveau() {
	try {
  		// reset des variables globales
  		ofa_abonnementId = 0;
  		ofa_etatAbonnement = 'N';
  		ofa_ligneId = 0;
  		ofa_change = false;
  		
		ofa_unlockParams();
		ofa_unlockLigne();
		ofa_desactiveMenu();
  		
  		// reset des arbres
  		ofa_aModeleEcriture.deleteTree();
  		ofa_aListeEcheance.deleteTree();
  		
  		// reset du formulaire haut
  		ofa_unlockParams();
  		document.getElementById('ofa-libelle').value = "";
  		document.getElementById('ofa-etat').value = "Nouveau";
  		document.getElementById('ofa-debut').value = "";
  		document.getElementById('ofa-fin').value = "";
  		document.getElementById('ofa-journal').value = 0;
  		document.getElementById('ofa-periodicite').value = 0;
  		document.getElementById('ofa-chkFinMois').checked = false;
  		ofa_chkFinMois();
		
		// reset du formulaire de ligne
  		ofa_annulerLigneModele();
  		
  		ofa_activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_enregistrer() {
	try {
		ofa_desactiveMenu();
		
		var querySave = new QueryHttp("Compta/Abonnement/saveAbonnement.tmpl");
					
		querySave.setParam("Abt_Ecr_Id", ofa_abonnementId);
		querySave.setParam("Libelle", document.getElementById('ofa-libelle').value);
		querySave.setParam("Etat", ofa_etatAbonnement);
		querySave.setParam("Periodicite", document.getElementById('ofa-periodicite').value);
		querySave.setParam("Date_Fin_Mois", document.getElementById('ofa-chkFinMois').checked);
		querySave.setParam("Jour_Ecriture", document.getElementById('ofa-ecriture').value);
		querySave.setParam("Journal", document.getElementById('ofa-journal').value);
		querySave.setParam("Debut_Abt", document.getElementById('ofa-debut').value);
		if (!isEmpty(document.getElementById('ofa-fin').value)) {
			querySave.setParam("Fin_Abt", document.getElementById('ofa-fin').value);
		}
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			ofa_activeMenu();
		} else {
			showWarning("L'abonnement a été enregistré !");
			ofa_abonnementId = result.responseXML.documentElement.getAttribute('Abt_Ecr_Id');
			ofa_change = false;
			ofa_activeMenu();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_valider() {
	try {
		ofa_desactiveMenu();
		
		ofa_desactiveMenu();
		var queryValid = new QueryHttp("Compta/Abonnement/genEcheance.tmpl");
		
		queryValid.setParam("Abt_Ecr_Id", ofa_abonnementId);
		
		var result = queryValid.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			ofa_activeMenu();
		} else {
			showWarning("L'abonnement a été validé !");
			ofa_etatAbonnement = result.responseXML.documentElement.getAttribute('Etat');
			document.getElementById("ofa-etat").value = ofa_libelleEtat(ofa_etatAbonnement);
			// reset arbre echeances
	  		ofa_aListeEcheance.clearParams;
	  		ofa_aListeEcheance.setParam("AboId", ofa_abonnementId);
	  		ofa_aListeEcheance.initTree(ofa_finInit);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_libelleEtat(etat) {
	try {
		switch (etat) {
			case 'N' : return "Nouveau"; break;
			case 'T' : return "En cours"; break;
			case 'A' : return "Annulé"; break;
			case 'C' : return "Clôturé"; break;
			default : return "";
		}
	} catch (e) {
		recup_erreur(e);
	}
}


/**
 * Gestion des paramètres
 */
function ofa_chkFinMois() {
	try {
		var text = document.getElementById('ofa-ecriture');
		var lab = document.getElementById('ofa-labelEcriture');
		if (document.getElementById('ofa-chkFinMois').checked) {
			text.value = "31";
			text.disabled = true;
			lab.disabled = true;
		} else {
			text.value = "";
			text.disabled = false;
			lab.disabled = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_keyPressOnFormHaut(event) {
	try {
		ofa_change = true;
		ofa_activeMenu();
		if (event.keyCode==13) {
			ofa_pressOnEnregistrer()
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_changeOnListeHaut() {
	try {
		ofa_change = true;
		ofa_activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_changeOnPeriodicite() {
	try {
		ofa_checkPeriodicite();
		ofa_changeOnListeHaut();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_checkPeriodicite() {
	try {
		if (document.getElementById('ofa-periodicite').value=="J") {
			document.getElementById('ofa-chkFinMois').disabled = true;
			document.getElementById('ofa-ecriture').disabled = true;
			document.getElementById('ofa-chkFinMois').checked = false;
			document.getElementById('ofa-ecriture').value = 31;
		} else {
			document.getElementById('ofa-chkFinMois').disabled = false;
			document.getElementById('ofa-ecriture').disabled = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}

/**
 * Gestion des actions d'abonnement
 */
function ofa_pressOnCopier() {
	try {
		if (window.confirm("Voulez-vous dupliquer cet abonnement ?")) {
			ofa_copier();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnSupprimer() {
	try {
		var go = false;
		if (ofa_abonnementId!=0) {
			go = window.confirm("Voulez-vous supprimer cet abonnement ?");
		}
		
		if (go) {
			ofa_supprimer();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnAnnuler() {
	try {
		if (window.confirm("Voulez-vous annuler cet abonnement ?")) {
			ofa_annuler();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnNouveau() {
	try {
		if (window.confirm("Voulez-vous saisir un nouvel abonnement ?")) {
			ofa_nouveau();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnEnregistrer() {
	try {
		var go = false;
		
		// verifs diverses
		// libelle unique -> vérifié sur le serveur
		// journal existe dans la table journal -> vérifié sur le serveur, != 0
		var journal = document.getElementById('ofa-journal').value;
		// etat N=Nouveau, T=En cours, A=Annulé, C=Clôturé : non modifiable
		// periodicite J=Journalière, A=Annuelle, M=Mensuelle, S=Semestrielle, T=Trimestrielle, B=Bimestrielle : non modifiable, != 0
		var periode = document.getElementById('ofa-periodicite').value;
		// debutAbt et finAbt sont des dates et une période correcte -> a vérifier
		var dateDeb = document.getElementById('ofa-debut').value;
		var dateFin = document.getElementById('ofa-fin').value;
		// dateFinMois -> non modifiable
		// jourEcriture compris entre 1 et 31 -> a vérifier
		var jour = document.getElementById('ofa-ecriture').value;
		var intJour = (!isEmpty(jour) && isPositiveInteger(jour))?parseIntBis(jour):0;
		
		if (journal==0) { showWarning("Veuillez choisir un journal !"); }
		else if (periode==0) { showWarning("Veuillez choisir une périodicité !"); }
		else if (!isDate(dateDeb)) { showWarning("Date de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDeb) && !isEmpty(dateFin) && !isDateInterval(dateDeb, dateFin)) { showWarning("Période incorrecte !"); }
		else if (intJour<1 || intJour>31) { showWarning("Jour d'écriture incorrect !"); }
		else {
			// les dates ne sont pas malformées, ou bien n'existent pas
			go = true;
			if (!isEmpty(dateDeb)) { dateDeb = prepareDateJava(dateDeb); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
		}
		// demande de confirmation
		if (go) {
			if (ofa_abonnementId!=0) {
				go = window.confirm("Voulez-vous enregistrer les modifications ?");
			} else {
				go = window.confirm("Voulez-vous enregistrer ce nouvel abonnement ?");
			}
		}
		
		if (go) {
			ofa_enregistrer();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnValider() {
	try {
		if (window.confirm("Voulez-vous valider cet abonnement ?")) {
			ofa_valider();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

/**
 * Gestion du modèle d'écriture
 */
function ofa_loadLigneModele() {
	try {
		if (ofa_aModeleEcriture.isSelected()) {
			var index = ofa_aModeleEcriture.getCurrentIndex();
			ofa_ligneId = ofa_aModeleEcriture.getCellText(index,'ofa-colLigneId');
  			document.getElementById('ofa-compteLigne').value = ofa_aModeleEcriture.getCellText(index,'ofa-colCompte');
			document.getElementById('ofa-libelleLigne').value = ofa_aModeleEcriture.getCellText(index,'ofa-colLibelle');
			document.getElementById('ofa-filtreModesLigne').value = (isEmpty(ofa_aModeleEcriture.getCellText(index,'ofa-colReglementId')))?0:ofa_aModeleEcriture.getCellText(index,'ofa-colReglementId');
			document.getElementById('ofa-infosLigne').value = ofa_aModeleEcriture.getCellText(index,'ofa-colInfos');
			document.getElementById('ofa-debitLigne').value = ofa_aModeleEcriture.getCellText(index,'ofa-colDebit');
			document.getElementById('ofa-creditLigne').value = ofa_aModeleEcriture.getCellText(index,'ofa-colCredit');
			document.getElementById('ofa-pieceLigne').value = ofa_aModeleEcriture.getCellText(index,'ofa-colPiece');
			document.getElementById('ofa-chkPeriode').checked = (ofa_aModeleEcriture.getCellText(index,'ofa-colPeriode')!=0);
  		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_isValidModele() {
	try {
		var sumD = 0;
		var sumC = 0;
		for (var i=0; i<ofa_aModeleEcriture.nbLignes(); i++) {
			var debit = ofa_aModeleEcriture.getCellText(i,'ofa-colDebit');
			var credit = ofa_aModeleEcriture.getCellText(i,'ofa-colCredit');
			if (!isEmpty(debit)) {
				sumD = sumD + parseFloat(debit);
			}
			if (!isEmpty(credit)) {
				sumC = sumC + parseFloat(credit);
			}
		}
		return (sumD==sumC && i!=0);
	} catch(e) {
		recup_erreur(e);
		return false;
	}
}

function ofa_annulerLigneModele() {
	try {
		// reset la ligne
		
		// si le modèle n'est pas vide, on charge le libelle, le num pièce et le chk periode de la dernière ligne
		if (ofa_abonnementId!=0 && ofa_aModeleEcriture.nbLignes()!=0) {
		var index = ofa_aModeleEcriture.nbLignes()-1;
			document.getElementById('ofa-libelleLigne').value = ofa_aModeleEcriture.getCellText(index,'ofa-colLibelle');
			document.getElementById('ofa-pieceLigne').value = ofa_aModeleEcriture.getCellText(index,'ofa-colPiece');
			document.getElementById('ofa-chkPeriode').checked = (ofa_aModeleEcriture.getCellText(index,'ofa-colPeriode')!=0);
		} else {
			document.getElementById('ofa-libelleLigne').value = "";
			document.getElementById('ofa-pieceLigne').value = "";
			document.getElementById('ofa-chkPeriode').checked = "true";
		}
			
		ofa_ligneId = 0;
		ofa_aModeleEcriture.select(-1);
		
		document.getElementById('ofa-compteLigne').value = "";
		document.getElementById('ofa-filtreModesLigne').selectedIndex = 0;
		document.getElementById('ofa-infosLigne').value = "";
		document.getElementById('ofa-debitLigne').value = "0.00";
		document.getElementById('ofa-creditLigne').value = "0.00";
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_saveLigneModele() {
	try {
		var querySave = new QueryHttp("Compta/Abonnement/saveLigne.tmpl");
		
		querySave.setParam("Ligne_Id", ofa_ligneId);
		querySave.setParam("Abt_Ecr_Id", ofa_abonnementId);
		querySave.setParam("Numero_Compte", document.getElementById('ofa-compteLigne').value);
		querySave.setParam("Libelle", document.getElementById('ofa-libelleLigne').value);
		querySave.setParam("Montant_D", document.getElementById('ofa-debitLigne').value);
		querySave.setParam("Montant_C", document.getElementById('ofa-creditLigne').value);
		querySave.setParam("Mode_Reg_Id", document.getElementById('ofa-filtreModesLigne').value);
		querySave.setParam("Commentaire", document.getElementById('ofa-infosLigne').value);
		querySave.setParam("Num_Piece", document.getElementById('ofa-pieceLigne').value);
		querySave.setParam("Periode_Lib", document.getElementById('ofa-chkPeriode').checked);
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			// rafraichir l'arbre
	  		ofa_aModeleEcriture.clearParams;
	  		ofa_aModeleEcriture.setParam("AboId", ofa_abonnementId);
	  		ofa_aModeleEcriture.initTree(ofa_finInit);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_supprimerLigneModele() {
	try {
		var querySuppr = new QueryHttp("Compta/Abonnement/deleteLigne.tmpl");
		
		querySuppr.setParam("Ligne_Id", ofa_ligneId);
		
		var result = querySuppr.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			// rafraichir l'arbre
	  		ofa_aModeleEcriture.clearParams;
	  		ofa_aModeleEcriture.setParam("AboId", ofa_abonnementId);
	  		ofa_aModeleEcriture.initTree(ofa_finInit);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_rechercheCompte(numero_compte) {
	try {
		var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Creer=false&Num_Compte="+urlEncode(numero_compte);
    	window.openDialog(url,'','chrome,modal,centerscreen',ofa_finRechercheCompte);
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_finRechercheCompte(numCompte) {
	try {
		document.getElementById('ofa-compteLigne').value = numCompte;
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_keyPressOnCompte(event) {
	try {
		if (event.keyCode==13) {
			ofa_rechercheCompte(document.getElementById('ofa-compteLigne').value);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_selectOnTreeModele() {
	try {
		if (ofa_etatAbonnement=='N') {
			ofa_loadLigneModele();
		} else {
			// annulation de la sélection
			ofa_aModeleEcriture.select(-1);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnAnnulerLigne() {
	try {
		ofa_desactiveActionLigne();
		ofa_annulerLigneModele();
		ofa_activeActionLigne();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnValiderLigne() {
	try {
		var verif = false;
		// verif compte
		if (!isCompteCorrect(document.getElementById('ofa-compteLigne').value)) { showWarning("Numéro de compte incorrect !"); }			
		
		// verif libelle
		else if (isEmpty(document.getElementById('ofa-libelleLigne').value)) { showWarning("Libellé incorrect !"); }
		
		// verif mode reglement
		
		// verif infos
		
		// verif debit (la partie décimale ne peut faire plus de 2 caractères)
		else if (!checkDecimal(document.getElementById('ofa-debitLigne').value,2)) { showWarning("Montant au débit incorrect !"); }
		
		// verif debit (la partie entière ne peut faire plus de 14 caractères)
		else if (!checkIPart(document.getElementById('ofa-debitLigne').value,14)) { showWarning("Montant au débit incorrect !"); }
		
		// verif debit (positif)
		else if (!isPositiveOrNull(document.getElementById('ofa-debitLigne').value)) { showWarning("Montant au débit incorrect : montant négatif !"); }
		
		// verif credit (la partie décimale ne peut faire plus de 2 caractères)
		else if (!checkDecimal(document.getElementById('ofa-creditLigne').value,2)) { showWarning("Montant au crédit incorrect !"); }
		
		// verif credit (la partie entière ne peut faire plus de 14 caractères)
		else if (!checkIPart(document.getElementById('ofa-creditLigne').value,14)) { showWarning("Montant au crédit incorrect !"); }
		
		// verif credit (positif)
		else if (!isPositiveOrNull(document.getElementById('ofa-creditLigne').value)) { showWarning("Montant au crédit incorrect : montant négatif !"); }
		
		// verif debit ou credit : l'un ou l'autre doit être vide mais pas les deux
		// doubles vides : (d="" || d=0) && (c="" || c=0)
		else if ((isEmpty(document.getElementById('ofa-debitLigne').value)
				|| document.getElementById('ofa-debitLigne').value==0)
			&& (isEmpty(document.getElementById('ofa-creditLigne').value)
				|| document.getElementById('ofa-creditLigne').value==0)) { showWarning("Veuillez saisir un debit ou un credit !"); }
		// doubles montants : d=x && c=x  <=>  d!="" && d!=0 && c!="" && c!=0
		else if (!isEmpty(document.getElementById('ofa-debitLigne').value)
			&& !isEmpty(document.getElementById('ofa-creditLigne').value)
			&& document.getElementById('ofa-debitLigne').value!=0
			&& document.getElementById('ofa-creditLigne').value!=0) {
			showWarning("Veuillez ne saisir qu'un débit OU un crédit !");
		}
		// verif piece
		
		else { verif = true; }
		
		if (verif) {
			ofa_desactiveActionLigne();
			ofa_saveLigneModele();
			ofa_activeActionLigne();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnSupprimerLigne() {
	try {
		if (ofa_ligneId!=0) {
			ofa_desactiveActionLigne();
			ofa_supprimerLigneModele();
			ofa_activeActionLigne();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

/**
 * Gestion des échéances d'écriture
 */
function ofa_selectOnEcheance() {
	try {
		// annulation de la sélection
		ofa_aListeEcheance.select(-1);
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_genererEcriture() {
	try {
		var queryGen = new QueryHttp("Compta/Abonnement/genEcriture.tmpl");
		
		queryGen.setParam("Abt_Ecr_Id", ofa_abonnementId);
		
		var result = queryGen.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			showWarning("Les échéances ont été générées !");
			if (result.responseXML.documentElement.getAttribute('Etat')=='C') {
				retourListeAbonnement();
			}
			else {
				ofa_ouvrir(ofa_abonnementId);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}
 
function ofa_pressOnGenerer() {
	try {
		ofa_genererEcriture();
	} catch (e) {
		recup_erreur(e);
	}
}
	

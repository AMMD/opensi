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

var osa_currentPeriode;
var osa_currentJournal;
var osa_currentTypeJournal;

var osa_writeable = false;

var osa_currentPage;
var osa_currentNbPages;

var osa_currentRechId;

var osa_aEcritures = new Arbre('Compta/Saisie/liste-ecritures.tmpl', 'osa-treeEcritures');

var qSaveEcr = new QueryHttp("Compta/Saisie/saveEcriture.tmpl");
var qInfosCompte = new QueryHttp("Compta/Saisie/getInfosCompte.tmpl");
var qExCompte = new QueryHttp("Compta/Commun/existeCompte.tmpl");
var qSupEcr = new QueryHttp("Compta/Saisie/deleteEcriture.tmpl");

var osa_dsEcritures;
var osa_wTreeEcritures;

var osa_ECRITURES_NS = "http://www.opensi.org/compta/operations";

var osa_opIdToLoad = null;
var osa_pageToLoad = null;

var nfMt = new NumberFormat("0.00", true);

var osa_compteLike;

var osa_modeRaccourci = false;
var osa_modele = new Array();
var osa_currentLigne = 0;
var osa_montantPourcent = -1;
var osa_tabLP = new Array(); // tableau des lignes en pourcentage

var osa_rappelAuto = false;
var osa_modeRappel = new osa_ModeRappel(); 

/* Classe de ligne utilisée pour la manipulation de donnée lors de l'aide à la saisie par modèle */
function osa_LigneModele() {
	this.compte = "";
	this.libelle = "";
	this.reglement = 0;
	this.infos = "";
	this.debit = 0;
	this.credit = 0;
	this.piece = "";
	this.calcul = "P";
	this.periode = false;
	this.debitCalc = 0; // utilisé pour stocker la valeur calculée en cas de pourcentage
	this.creditCalc = 0;
	this.tabLPId=0;
}

/* Classe de mode utilisée pour la gestion du rappel auto et de l'auto-apprentissage */
function osa_ModeRappel() {
	this.active = false;
	this.contrepartie = "";
	this.codeTVA = 1;
	this.compteTVA = "";
	this.taux = 0;
	this.typeCompte = "";
	this.etat = 0; // 0:verif tiers, 1:charge contrepartie, 2:charge tva
	this.debitRef = 0;
	this.creditRef = 0;
	this.debitCp = 0;
	this.creditCp = 0;
	this.debitTVA = 0;
	this.creditTVA = 0;
	}


function osa_init() {
	try {

		osa_wTreeEcritures = document.getElementById('osa-treeEcritures');

		var aJournal = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'osa-journal');
		aJournal.initTree();

		var aPeriode = new Arbre('Compta/GetRDF/liste_periodes.tmpl', 'osa-periode');
		aPeriode.initTree();

		var aModeReg = new Arbre('ComboListe/combo-modesReglement.tmpl', 'osa-reglement');
		aModeReg.initTree();
		
		var qRappel = new QueryHttp("Config/comptabilite/preferences/getPreferences.tmpl");
		var result = qRappel.execute();
		osa_rappelAuto = (result.responseXML.documentElement.getAttribute('Rappel_Auto_Saisie')!=0);

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_initSaisie(codeJournal, periode) {
	try {

		document.getElementById('osa-journal').value = codeJournal;
		document.getElementById('osa-periode').value = periode;

		osa_chargerJournal();

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_initSaisieEcr(opId) {
	try {

		var qLocEcr = new QueryHttp("Compta/Saisie/getLocationEcriture.tmpl");
		qLocEcr.setParam('Op_Id', opId);
		qLocEcr.setParam('Nb_Ecr_Page', 10);
		var result = qLocEcr.execute();

		var contenu = result.responseXML.documentElement;

		osa_opIdToLoad = opId;
		osa_pageToLoad = contenu.getAttribute('Page');
		
		setTimeout("osa_initSaisie('"+ contenu.getAttribute('Code_Journal') +"','"+ contenu.getAttribute('Periode') +"');", 50);

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_chargerJournal() {
	try {

		osa_currentJournal = document.getElementById('osa-journal').value;
		osa_currentPeriode = document.getElementById('osa-periode').value;

		osa_razInfosCpte();
		osa_razSoldesEcr();

		var qJournal = new QueryHttp("Compta/Saisie/getInfosJournal.tmpl");
		qJournal.setParam('Periode', preparePeriodeJava(osa_currentPeriode));
		qJournal.setParam('Code_Journal', osa_currentJournal);
		var result = qJournal.execute();

		osa_currentTypeJournal = result.responseXML.documentElement.getAttribute('Type_Journal');
		osa_writeable = (result.responseXML.documentElement.getAttribute('Periode_Close')==0 && osa_currentTypeJournal!="AN");

		var nbEcr = result.responseXML.documentElement.getAttribute('NbEcr');

		osa_currentNbPages = parseIntBis(nbEcr/10+1);

		if (osa_pageToLoad==null) {
			osa_chargerPage(osa_currentNbPages);
		}
		else {
			osa_chargerPage(osa_pageToLoad);
			osa_pageToLoad = null;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_chargerPage(p) {
	try {

		osa_disableAll(true);

		osa_currentPage = p;
		document.getElementById('osa-pagination').value = "Page N° "+ osa_currentPage +" / "+ osa_currentNbPages;

		osa_dsEcritures = new RDFDataSource();

		osa_aEcritures.setParam('Code_Journal', osa_currentJournal);
		osa_aEcritures.setParam('Periode', preparePeriodeJava(osa_currentPeriode));
		osa_aEcritures.setParam('Num_Page', osa_currentPage);
		osa_aEcritures.initTree(osa_initTreeEcritures);

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pageDebut() {
	try {

		osa_chargerPage(1);

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pagePrec() {
	try {

		if (osa_currentPage>1) {
			osa_chargerPage(osa_currentPage-1);
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pageSuiv() {
	try {

		if (osa_currentPage<osa_currentNbPages) {
			osa_chargerPage(osa_currentPage+1);
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pageFin() {
	try {

		osa_chargerPage(osa_currentNbPages);

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_disableAll(b) {
	try {
		osa_setLigneEditable(!b);
		
		osa_disableNearlyAll();

	} catch (e) {
		recup_erreur(e);
	}
}

function osa_disableNearlyAll(b) {
	try {

		osa_wTreeEcritures.disabled = b;

		document.getElementById('osa-bPageDebut').disabled = b;
		document.getElementById('osa-bPagePrec').disabled = b;
		document.getElementById('osa-bPageFin').disabled = b;
		document.getElementById('osa-bPageSuiv').disabled = b;

		document.getElementById('osa-journal').disabled = b;
		document.getElementById('osa-periode').disabled = b;
		document.getElementById('osa-bPeriodeSuiv').disabled = b;
		document.getElementById('osa-bPeriodePrec').disabled = b;
		document.getElementById('osa-bPlanComptable').disabled = b;
		document.getElementById('osa-bRevision').disabled = b;
		document.getElementById('osa-bRechercher').disabled = b;

	} catch (e) {
		recup_erreur(e);
	}
}

function osa_initTreeEcritures(dsource) {
	try {

		dsource.copyAllToDataSource(osa_dsEcritures);

		osa_wTreeEcritures.database.RemoveDataSource(dsource.getRawDataSource());

		var datasource = osa_dsEcritures.getRawDataSource();
		osa_wTreeEcritures.database.AddDataSource(datasource);

		if (osa_currentTypeJournal!="AN") {
			document.getElementById('osa-ColDateOp').collapsed = true;
			document.getElementById('osa-ColJourOp').collapsed = false;
		}
		else {
			document.getElementById('osa-ColDateOp').collapsed = false;
			document.getElementById('osa-ColJourOp').collapsed = true;
		}

		document.getElementById('osa-ligneSaisie').collapsed = !osa_writeable;
		if (osa_wTreeEcritures.view!=null) {

			osa_ajouterSeparateur(osa_wTreeEcritures.view.rowCount);
			if (osa_currentPage==osa_currentNbPages) {
				// saisie sur dernière page uniquement
				if (osa_writeable) {
					osa_ajouterLigneVide(osa_wTreeEcritures.view.rowCount);
					osa_selectLigne(osa_wTreeEcritures.view.rowCount-1);
				}
				else {
					osa_selectLigne(osa_wTreeEcritures.view.rowCount-2);
				}
			}
			else {
				osa_selectLigne(0);
			}

			if (osa_opIdToLoad!=null) {
				osa_selectLigneOp(osa_opIdToLoad);
				osa_opIdToLoad = null;
			}
		}
		else if (osa_writeable) {
			osa_ajouterLigneVide(0);
			osa_selectLigne(0);
		}

		osa_disableAll(false);
		osa_enableModeRaccourci(false);

		if (osa_wTreeEcritures.view!=null && osa_wTreeEcritures.currentIndex!=-1 && (!isEmpty(getCellText(osa_wTreeEcritures,osa_wTreeEcritures.currentIndex,'osa-ColLettre')) || getCellValue(osa_wTreeEcritures,osa_wTreeEcritures.currentIndex,'osa-ColPointage')=="1")) {
			osa_setLigneEditable(false);
		}

		document.getElementById('osa-bPageDebut').disabled = (osa_currentPage == 1);
		document.getElementById('osa-bPagePrec').disabled = (osa_currentPage == 1);
		document.getElementById('osa-bPageFin').disabled = (osa_currentPage == osa_currentNbPages);
		document.getElementById('osa-bPageSuiv').disabled = (osa_currentPage == osa_currentNbPages);

		document.getElementById('osa-jour').focus();

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_selectLigne(idx) {
	try {

		if (osa_wTreeEcritures.view!=null && osa_wTreeEcritures.view.rowCount>idx) {
			osa_wTreeEcritures.view.selection.select(idx);
			osa_wTreeEcritures.treeBoxObject.ensureRowIsVisible(idx);
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_supprimerLigne(idx) {
	try {

		osa_dsEcritures.getNode(osa_ECRITURES_NS).removeChildAt(idx+1);

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_targetName(item) {
	try {

		return osa_ECRITURES_NS +"/rdf#"+ item;

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_ajouterSeparateur(idx) {
	try {

		var child = osa_dsEcritures.getAnonymousNode();
		child.addTargetOnce(osa_targetName('type_desc'), 'separator');
		osa_dsEcritures.getNode(osa_ECRITURES_NS).addChildAt(child,idx+1); // idx +1 car index commence à 1

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_ajouterLigneVide(idx) {
	try {

		var child = osa_dsEcritures.getAnonymousNode();
		child.addTargetOnce(osa_targetName('Prop'), 'enabled');
		child.addTargetOnce(osa_targetName('Modif'), '1');
		child.addTargetOnce(osa_targetName('Ecriture_Id'), '0');
		child.addTargetOnce(osa_targetName('Op_Id'), '0');
		osa_dsEcritures.getNode(osa_ECRITURES_NS).addChildAt(child,idx+1); // idx +1 car index commence à 1

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_selectLigneOp(opId) {
	try {

		if (osa_wTreeEcritures.view!=null) {

			for(var i=0; i<osa_wTreeEcritures.view.rowCount; i++) {
				if (parseIntBis(getCellText(osa_wTreeEcritures,i,'osa-ColOpId'))==opId) {
					osa_selectLigne(i);
					break;
				}
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_lignePrecedente() {
	try {

		if (osa_wTreeEcritures.view!=null) {
			var idx = osa_wTreeEcritures.currentIndex - 1;
			if (idx>=0 && !(osa_wTreeEcritures.view.isSeparator(idx) && parseFloat(document.getElementById('osa-soldeEC').value)!=0)) {
				while (osa_wTreeEcritures.view.isSeparator(idx)) idx--;
				osa_selectLigne(idx);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_ligneSuivante() {
	try {

		if (osa_wTreeEcritures.view!=null) {
			var rc = osa_wTreeEcritures.view.rowCount;
			var idx = osa_wTreeEcritures.currentIndex + 1;
			if (idx<rc && !(osa_wTreeEcritures.view.isSeparator(idx) && parseFloat(document.getElementById('osa-soldeEC').value)!=0)) {
				while (idx<rc && osa_wTreeEcritures.view.isSeparator(idx)) idx++;
				osa_selectLigne(idx);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_ligneDefilPrec() {
	try {

		if (osa_wTreeEcritures.view!=null) {
			var idx = osa_wTreeEcritures.currentIndex - 10;
			if (idx<=0) {
				osa_ligneDebut();
			}
			else {
				while (idx>0 && osa_wTreeEcritures.view.isSeparator(idx)) idx--;
				osa_selectLigne(idx);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_ligneDefilSuiv() {
	try {

		if (osa_wTreeEcritures.view!=null) {
			var rc = osa_wTreeEcritures.view.rowCount;
			var idx = osa_wTreeEcritures.currentIndex + 10;
			if (idx>=rc) {
				osa_ligneFin();
			}
			else {
				while (idx<rc && osa_wTreeEcritures.view.isSeparator(idx)) idx++;
				osa_selectLigne(idx);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_ligneFin() {
	try {

		if (osa_wTreeEcritures.view!=null) {
			osa_selectLigne(osa_wTreeEcritures.view.rowCount - 1);
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_ligneDebut() {
	try {

		osa_selectLigne(0);

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_reporterLigne() {
	try {

		var idx = osa_wTreeEcritures.currentIndex;

		if (osa_wTreeEcritures.view!=null && idx!=-1) {

			document.getElementById('osa-jour').value = getCellText(osa_wTreeEcritures,idx,'osa-ColJourOp');
			var numeroCompte = getCellText(osa_wTreeEcritures,idx,'osa-ColNumeroCompte');
			document.getElementById('osa-compte').value = numeroCompte;
			document.getElementById('osa-libelle').value = getCellText(osa_wTreeEcritures,idx,'osa-ColLibelle');
			document.getElementById('osa-contrepartie').value = getCellText(osa_wTreeEcritures,idx,'osa-ColContrepartie');
			document.getElementById('osa-echeance').value = getCellText(osa_wTreeEcritures,idx,'osa-ColEcheance');
			document.getElementById('osa-reglement').value = getCellText(osa_wTreeEcritures,idx,'osa-ColModeRegId');
			document.getElementById('osa-commentaire').value = getCellText(osa_wTreeEcritures,idx,'osa-ColCommentaire');
			document.getElementById('osa-debit').value = getCellText(osa_wTreeEcritures,idx,'osa-ColDebit').replace(/ /gi,'');
			document.getElementById('osa-credit').value = getCellText(osa_wTreeEcritures,idx,'osa-ColCredit').replace(/ /gi,'');
			document.getElementById('osa-piece').value = getCellText(osa_wTreeEcritures,idx,'osa-ColPiece');

			document.getElementById('osa-controleCoherence').value = "";
			document.getElementById('osa-controleCoherence').collapsed = true;

			if (osa_wTreeEcritures.view.isSeparator(idx)) {
				osa_setLigneEditable(false);
				osa_razInfosCpte();
				osa_razSoldesEcr();
			}
			else {
				osa_refreshInfosCpte(numeroCompte);
				if (isEmpty(getCellText(osa_wTreeEcritures,idx,'osa-ColLettre')) && getCellValue(osa_wTreeEcritures,idx,'osa-ColPointage')!="1") {
					osa_setLigneEditable(true);
				}
				else {
					osa_setLigneEditable(false);
				}
				osa_refreshSoldesEcr(idx);
			}

			if (!isEmpty(numeroCompte) && getCellText(osa_wTreeEcritures,idx,'osa-ColModif')=='1') {
				if (isEmpty(document.getElementById('osa-debit').value)) {
					document.getElementById('osa-credit').focus();
				}
				else {
					document.getElementById('osa-debit').focus();
				}
			}
			else {
				document.getElementById('osa-jour').focus();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_refreshSoldesEcr(idx) {
	try {

		var debit = 0;
		var credit = 0;

		var rd2 = new Arrondi(2);

		var i = idx;
		while (i>=0 && !osa_wTreeEcritures.view.isSeparator(i)) {
			var d = getCellText(osa_wTreeEcritures,i,'osa-ColDebit').replace(/ /gi,'');
			var c = getCellText(osa_wTreeEcritures,i,'osa-ColCredit').replace(/ /gi,'');
			if (d!="") debit += rd2.round(parseFloat(d));
			if (c!="") credit += rd2.round(parseFloat(c));
			i--;
		}
		i = idx + 1;
		while (i<osa_wTreeEcritures.view.rowCount && !osa_wTreeEcritures.view.isSeparator(i)) {
			var d = getCellText(osa_wTreeEcritures,i,'osa-ColDebit').replace(/ /gi,'');
			var c = getCellText(osa_wTreeEcritures,i,'osa-ColCredit').replace(/ /gi,'');
			if (d!="") debit += rd2.round(parseFloat(d));
			if (c!="") credit += rd2.round(parseFloat(c));
			i++;
		}

	 	document.getElementById("osa-debitEC").value = nfMt.format(debit);
	 	document.getElementById("osa-creditEC").value = nfMt.format(credit);
		document.getElementById("osa-soldeEC").value = nfMt.format(rd2.round(debit - credit));

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_razSoldesEcr() {
	try {

		document.getElementById("osa-debitEC").value = "";
	 	document.getElementById("osa-creditEC").value = "";
		document.getElementById("osa-soldeEC").value = "";

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_existeCompte(numeroCompte) {
	try {
		qExCompte.setParam("Numero_Compte", numeroCompte);
		var result = qExCompte.execute();

		osa_compteLike = result.responseXML.documentElement.getAttribute("compte_like");

		return (result.responseXML.documentElement.getAttribute("existe")=="true");

 	} catch (e) {
		recup_erreur(e);
		return false;
	}
}


function osa_refreshInfosCpte(numeroCompte) {
	try {

		if (osa_existeCompte(numeroCompte)) {

			qInfosCompte.setParam("Numero_Compte", numeroCompte);
			var result = qInfosCompte.execute();

			var contenu = result.responseXML.documentElement;

			document.getElementById('osa-intituleCompte').value = contenu.getAttribute('Libelle');
			var type = contenu.getAttribute('Type_Compte')
			document.getElementById('osa-typeCompte').value = type;
			document.getElementById('osa-debitCompteN').value = contenu.getAttribute('DebitN');
			document.getElementById('osa-creditCompteN').value = contenu.getAttribute('CreditN');
			document.getElementById('osa-soldeCompteN').value = contenu.getAttribute('SoldeN');
			document.getElementById('osa-debitCompteN1').value = contenu.getAttribute('DebitN1');
			document.getElementById('osa-creditCompteN1').value = contenu.getAttribute('CreditN1');
			document.getElementById('osa-soldeCompteN1').value = contenu.getAttribute('SoldeN1');
			
			// en mode rappel, hors raccourci, si le compte sur la premiere ligne est un compte de tiers on active le rappel 
			if(!osa_modeRaccourci && osa_rappelAuto && isPremiereLigne() && (type=="F" || type=="C")) {
				osa_modeRappel.active = true;
				osa_modeRappel.typeCompte = type;
				osa_modeRappel.contrepartie = contenu.getAttribute('Contrepartie');
				osa_modeRappel.codeTVA = contenu.getAttribute('Code_TVA');
				
				if (osa_modeRappel.codeTVA!=1) {
					// chargement des infos de  tva
					var qCompteTVA = new QueryHttp("Compta/Saisie/getTaux.tmpl");
					qCompteTVA.setParam("IdTaux", osa_modeRappel.codeTVA)
					var result = qCompteTVA.execute();
					if (osa_modeRappel.typeCompte=='F') {
						osa_modeRappel.compteTVA = (result.responseXML.documentElement.getAttribute('Compte_TVA_Achat'));
					} else if (osa_modeRappel.typeCompte=='C') {
						osa_modeRappel.compteTVA = (result.responseXML.documentElement.getAttribute('Compte_TVA_Vente'));
					}
					osa_modeRappel.taux = (result.responseXML.documentElement.getAttribute('Taux_TVA'));
				}
			}
		}
		else {
			osa_razInfosCpte();
		}

 	} catch (e) {
		recup_erreur(e);
	}
}


function osa_razInfosCpte() {
	try {

		document.getElementById('osa-intituleCompte').value = "";
		document.getElementById('osa-typeCompte').value = "";
		document.getElementById('osa-debitCompteN').value = "";
		document.getElementById('osa-creditCompteN').value = "";
		document.getElementById('osa-soldeCompteN').value = "";
		document.getElementById('osa-debitCompteN1').value = "";
		document.getElementById('osa-creditCompteN1').value = "";
		document.getElementById('osa-soldeCompteN1').value = "";

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_getChild(idx) {
	try {

		var child = null;
		var children = osa_dsEcritures.getNode(osa_ECRITURES_NS).getChildren();

		while (children.hasMoreElements()) {
			var c = children.getNext();
			if (osa_dsEcritures.getNode(osa_ECRITURES_NS).getChildIndex(c) == idx+1) {
				child = c;
				break;
			}
		}
		return child;

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_validerLigne() {
	try {

		if (osa_checkLigne()) {
		// la ligne est valide
			
			// si on est dans le mode raccourci
			// on peut calculer le pourcentage d'origine et passer à la ligne de modele suivante
			if (osa_modeRaccourci) {
				// la ligne saisie était un pourcentage en le montant total n'avait pas été calculé
				if (osa_modele[osa_currentLigne].calcul=='P' && osa_montantPourcent==-1) {
					// preparation de l'arrondi
					var rd2 = new Arrondi(2);
					// debit modele !=0 et debit courant non vide et non nul et montant pourcent = -1 -> calcul montant pourcent
					if (osa_modele[osa_currentLigne].debit!=0
					&& !isEmpty(document.getElementById('osa-debit').value)
					&& document.getElementById('osa-debit').value!=0) {
						osa_montantPourcent = rd2.round(document.getElementById('osa-debit').value*100/osa_modele[osa_currentLigne].debit);
						osa_modele[osa_currentLigne].debitCalc = rd2.round(document.getElementById('osa-debit').value);
					}
					// credit modele !=0 et credit courant non vide et non nul et montant pourcent = -1 -> calcul montant pourcent
					if (osa_modele[osa_currentLigne].credit!=0
					&& !isEmpty(document.getElementById('osa-credit').value)
					&& document.getElementById('osa-credit').value!=0) {
						osa_montantPourcent = rd2.round(document.getElementById('osa-credit').value*100/osa_modele[osa_currentLigne].credit);
						osa_modele[osa_currentLigne].creditCalc = rd2.round(document.getElementById('osa-credit').value);
					}
				}
				
				// passage à la ligne suivante du modele
				osa_currentLigne++;
				
				// si on a atteint la fin du modele, on quitte le mode raccourci 
				if (osa_currentLigne>=osa_modele.length) {
					osa_enableModeRaccourci(false);
				}
			}
			
			
			if (osa_modeRappel.active) {
				if (osa_modeRappel.etat==0) {
					osa_modeRappel.debitRef = isEmpty(document.getElementById('osa-debit').value)?0:document.getElementById('osa-debit').value;
					osa_modeRappel.creditRef = isEmpty(document.getElementById('osa-credit').value)?0:document.getElementById('osa-credit').value;
					if (osa_modeRappel.codeTVA!=1) {
						// on a une tva, on peut donc en déduire le montant de la contrepartie
						var rd2 = new Arrondi(2);
						osa_modeRappel.creditCp = rd2.round(parseFloat(osa_modeRappel.debitRef)*100/(100+parseFloat(osa_modeRappel.taux)));
						osa_modeRappel.debitCp = rd2.round(parseFloat(osa_modeRappel.creditRef)*100/(100+parseFloat(osa_modeRappel.taux)));
						osa_modeRappel.creditTVA = rd2.round(parseFloat(osa_modeRappel.debitRef)*parseFloat(osa_modeRappel.taux)/(100+parseFloat(osa_modeRappel.taux)));
						osa_modeRappel.debitTVA = rd2.round(parseFloat(osa_modeRappel.creditRef)*parseFloat(osa_modeRappel.taux)/(100+parseFloat(osa_modeRappel.taux)));
						// lissage de la valeur
						var deb = parseFloat(osa_modeRappel.debitCp)+parseFloat(osa_modeRappel.debitTVA);
						var cre = parseFloat(osa_modeRappel.creditCp)+parseFloat(osa_modeRappel.creditTVA);
						if (deb<parseFloat(osa_modeRappel.creditRef)) {
							osa_modeRappel.debitTVA += osa_modeRappel.creditRef-deb;
						} else {
							osa_modeRappel.debitTVA -= deb-osa_modeRappel.creditRef;
						}
						if (cre<parseFloat(osa_modeRappel.debitRef)) {
							osa_modeRappel.creditTVA += osa_modeRappel.debitRef-cre;
						} else {
							osa_modeRappel.creditTVA -= cre-osa_modeRappel.debitRef;
						}
					}
				}
				// verif du respect de la contrepartie du rappel
				// en etat 0, il n'ya rien à vérifier
				// en etat 1, on verifie la contrepartie
				if (osa_modeRappel.etat==1 && !isEmpty(osa_modeRappel.contrepartie) && document.getElementById('osa-compte').value!=osa_modeRappel.contrepartie) {
					osa_modeRappel = new osa_ModeRappel();
				}
				// en etat 2, si le taux tva n'est pas respecté, c'est pas grave puisque c'est la dernière ligne
			}
			if (osa_modeRappel.active) {
				// passage du rappel à l'etat suivant
				osa_modeRappel.etat++;
				if (osa_modeRappel.etat>2) {
				// on a atteint la fin théorique du modele de rappel, il est donc reinitialisé
					osa_modeRappel = new osa_ModeRappel();
				}
			}

			var idx = osa_wTreeEcritures.currentIndex;
			var child = osa_getChild(idx);

			child.addTargetOnce(osa_targetName('Jour_Op'), document.getElementById('osa-jour').value);
			child.addTargetOnce(osa_targetName('Numero_Compte'), document.getElementById('osa-compte').value);
			child.addTargetOnce(osa_targetName('Libelle'), document.getElementById('osa-libelle').value);
			child.addTargetOnce(osa_targetName('Contrepartie'), document.getElementById('osa-contrepartie').value);
			child.addTargetOnce(osa_targetName('Echeance'), document.getElementById('osa-echeance').value);
			child.addTargetOnce(osa_targetName('Mode_Reg_Id'), document.getElementById('osa-reglement').value);
			if (!isEmpty(document.getElementById('osa-reglement').value)) {
				child.addTargetOnce(osa_targetName('Lib_Mode_Reg'), document.getElementById('osa-reglement').getAttribute('label'));
			}
			child.addTargetOnce(osa_targetName('Commentaire'), document.getElementById('osa-commentaire').value);
			var debit = document.getElementById('osa-debit').value;
			var credit = document.getElementById('osa-credit').value;
			child.addTargetOnce(osa_targetName('Debit'), isEmpty(debit)?debit:nfMt.format(debit));
			child.addTargetOnce(osa_targetName('Credit'), isEmpty(credit)?credit:nfMt.format(credit));
			child.addTargetOnce(osa_targetName('Num_Piece'), document.getElementById('osa-piece').value);

			var modif = false;

			if (!osa_ecritureSansMontant(idx)) {
				if (osa_ecritureStable(idx)) {

					if (!osa_isEcritureEnModif(idx)) {
						osa_ajouterSeparateur(idx+1);
						osa_ajouterLigneVide(idx+2);
						osa_selectLigne(idx+2);
					}
					else {
						osa_selectEcritureSuivante(idx);
					}
					
					osa_enregistrerEcriture(idx);
					
					// on a terminé une écriture
					// on relance le mode rappel
					if (osa_rappelAuto) {
						osa_modeRappel = new osa_ModeRappel();
					}
				}
				else if (osa_wTreeEcritures.view.rowCount==idx+1 || osa_wTreeEcritures.view.isSeparator(idx+1)) {
					osa_toModeModif(idx);
					osa_insererLignePreremplie(idx);
				}
				else {
					osa_toModeModif(idx);
					modif = true;
					osa_selectLigne(idx+1);
				}
			}

			if (modif && !isEmpty(document.getElementById('osa-compte').value)) {
				if (isEmpty(document.getElementById('osa-debit').value)) {
					document.getElementById('osa-credit').focus();
				}
				else {
					document.getElementById('osa-debit').focus();
				}
			}
			else {
				document.getElementById('osa-jour').focus();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_insererLignePreremplie(idx) {
	try {

		osa_ajouterLigneVide(idx+1);

		var child = osa_getChild(idx+1);

		child.addTargetOnce(osa_targetName('Ecriture_Id'), getCellText(osa_wTreeEcritures,idx,'osa-ColEcritureId'));
		child.addTargetOnce(osa_targetName('Jour_Op'), document.getElementById('osa-jour').value);
		child.addTargetOnce(osa_targetName('Numero_Compte'), document.getElementById('osa-contrepartie').value);
		child.addTargetOnce(osa_targetName('Libelle'), document.getElementById('osa-libelle').value);
		child.addTargetOnce(osa_targetName('Echeance'), document.getElementById('osa-echeance').value);
		child.addTargetOnce(osa_targetName('Num_Piece'), document.getElementById('osa-piece').value);

		osa_selectLigne(idx+1);

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_checkLigne() {
	try {

		var jour = document.getElementById('osa-jour').value;
		var compte = document.getElementById('osa-compte').value;
		var libelle = document.getElementById('osa-libelle').value;
		var contrepartie = document.getElementById('osa-contrepartie').value;
		var echeance = document.getElementById('osa-echeance').value;
		var commentaire = document.getElementById('osa-commentaire').value;
		var debit = document.getElementById('osa-debit').value;
		var credit = document.getElementById('osa-credit').value;
		var piece = document.getElementById('osa-piece').value;


		if (isEmpty(jour)) {
			document.getElementById('osa-jour').focus();
			showWarning("Date manquante");
			return false;
		}

		if (!isDate(jour +"/"+ osa_currentPeriode.substring(0,2) +"/20"+ osa_currentPeriode.substring(2,4))) {
			document.getElementById('osa-jour').focus();
			showWarning("Date incorrecte (format jj)");
			return false;
		}

		if (isEmpty(compte)) {
			document.getElementById('osa-compte').focus();
			showWarning("Numéro de compte manquant");
			return false;
		}

		if (!osa_existeCompte(compte)) {
			document.getElementById('osa-compte').focus();
			showWarning("Numéro de compte incorrect");
			return false;
		}

		if (isEmpty(libelle)) {
			document.getElementById('osa-libelle').focus();
			showWarning("Libellé de l'écriture manquant");
			return false;
		}

		if (libelle.indexOf("|")!=-1) {
			document.getElementById('osa-libelle').focus();
			showWarning("Caractère | interdit dans le libellé");
			return false;
		}

		if (!isEmpty(contrepartie) && !osa_existeCompte(contrepartie)) {
			document.getElementById('osa-contrepartie').focus();
			showWarning("Contrepartie incorrecte");
			return false;
		}

		if (!isEmpty(echeance) && !isDate(echeance)) {
			document.getElementById('osa-echeance').focus();
			showWarning("Date d'échéance incorrecte (format jj/mm/aaaa)");
			return false;
		}

		if (commentaire.indexOf("|")!=-1) {
			document.getElementById('osa-commentaire').focus();
			showWarning("Caractère | interdit dans le champ Infos");
			return false;
		}

		if (isEmpty(debit) && isEmpty(credit)) {
			document.getElementById('osa-debit').focus();
			showWarning("Montant de la ligne manquant");
			return false;
		}

		if (!isEmpty(debit) && !isEmpty(credit)) {
			document.getElementById('osa-debit').focus();
			showWarning("Veuillez ne remplir que le débit ou que le crédit de la ligne");
			return false;
		}

		if (isEmpty(debit) && (!isPositive(credit) || !checkDecimal(credit, 2))) {
			document.getElementById('osa-credit').focus();
			showWarning("Montant au crédit incorrect");
			return false;
		}

		if (isEmpty(credit) && (!isPositive(debit) || !checkDecimal(debit, 2))) {
			document.getElementById('osa-debit').focus();
			showWarning("Montant au débit incorrect");
			return false;
		}

		if (piece.indexOf("|")!=-1) {
			document.getElementById('osa-piece').focus();
			showWarning("Caractère | interdit dans le champ N° Pièce");
			return false;
		}

		return true;

	} catch (e) {
		recup_erreur(e);
		return false;
	}
}


function osa_isEcritureEnModif(idx) {
	try {

		return getCellText(osa_wTreeEcritures,idx,'osa-ColEcritureId')!='0';

	} catch (e) {
		recup_erreur(e);
		return false;
	}
}


function osa_toModeModif(idx) {
	try {

		var i = idx;
		var child;

		while (i>=0 && !osa_wTreeEcritures.view.isSeparator(i)) {
			child = osa_getChild(i);
			child.addTargetOnce(osa_targetName('Prop'), 'enabled');
			child.addTargetOnce(osa_targetName('Modif'), '1');
			i--;
		}
		i = idx + 1;
		while (i<osa_wTreeEcritures.view.rowCount && !osa_wTreeEcritures.view.isSeparator(i)) {
			child = osa_getChild(i);
			child.addTargetOnce(osa_targetName('Prop'), 'enabled');
			child.addTargetOnce(osa_targetName('Modif'), '1');
			i++;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_selectEcritureSuivante(idx) {
	try {

		var i = idx + 1;

		while (i<osa_wTreeEcritures.view.rowCount) {
			if (osa_wTreeEcritures.view.isSeparator(i)) {
				osa_selectLigne(i+1);
				break;
			}
			i++;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_ecritureStable(idx) {
	try {

		osa_refreshSoldesEcr(idx);
		return document.getElementById('osa-debitEC').value==document.getElementById('osa-creditEC').value && parseFloat(document.getElementById('osa-debitEC').value)>0 && parseFloat(document.getElementById('osa-creditEC').value)>0;

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_ecritureSansMontant(idx) {
	try {

		var i = idx;
		while (i>=0 && !osa_wTreeEcritures.view.isSeparator(i)) {
			if (isEmpty(getCellText(osa_wTreeEcritures,i,'osa-ColDebit')) && isEmpty(getCellText(osa_wTreeEcritures,i,'osa-ColCredit'))) return true;
			i--;
		}
		i = idx + 1;
		while (i<osa_wTreeEcritures.view.rowCount && !osa_wTreeEcritures.view.isSeparator(i)) {
			if (isEmpty(getCellText(osa_wTreeEcritures,i,'osa-ColDebit')) && isEmpty(getCellText(osa_wTreeEcritures,i,'osa-ColCredit'))) return true;
			i++;
		}

		return false;

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pressOnLibelle(event) {
	try {
		// F3
		if (event.keyCode==114) {
			document.getElementById('osa-libelle').value = document.getElementById('osa-intituleCompte').value;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pressOnCredit() {
	try {

		var credit = document.getElementById('osa-credit').value;

		if (parseFloat(credit)==0) {
			document.getElementById('osa-credit').value = "";
			credit = "";
		}

		var rd2 = new Arrondi(2);

		if (credit=="*" && !osa_modeRaccourci) {

			var debitOp = getCellText(osa_wTreeEcritures,osa_wTreeEcritures.currentIndex,'osa-ColDebit');
			var creditOp = getCellText(osa_wTreeEcritures,osa_wTreeEcritures.currentIndex,'osa-ColCredit');
			var soldeOp = (isEmpty(debitOp)?0:debitOp) - (isEmpty(creditOp)?0:creditOp);
			var solde = rd2.round(parseFloat(document.getElementById("osa-soldeEC").value.replace(/ /gi,'')) - soldeOp);

			if (solde>0) {
				document.getElementById('osa-credit').value = solde;
			}
			else if (solde<0) {
				document.getElementById('osa-credit').value = "";
				document.getElementById('osa-debit').value = Math.abs(solde);
			}
			else {
				document.getElementById('osa-credit').value = "";
			}
		}
		else if (!isEmpty(credit)) {
			try {
				document.getElementById('osa-credit').value = rd2.round(eval(credit));
			}	catch(e) {}
		}

		document.getElementById('osa-piece').focus();

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pressOnDebit() {
	try {

		var debit = document.getElementById('osa-debit').value;

		if (parseFloat(debit)==0) {
			document.getElementById('osa-debit').value = "";
			debit = "";
		}

		var rd2 = new Arrondi(2);

		if (isEmpty(debit)) {
			document.getElementById('osa-credit').focus();
		}
		else if (debit=="*" && !osa_modeRaccourci) {

			var debitOp = getCellText(osa_wTreeEcritures,osa_wTreeEcritures.currentIndex,'osa-ColDebit');
			var creditOp = getCellText(osa_wTreeEcritures,osa_wTreeEcritures.currentIndex,'osa-ColCredit');
			var soldeOp = (isEmpty(debitOp)?0:debitOp) - (isEmpty(creditOp)?0:creditOp);
			var solde = rd2.round(parseFloat(document.getElementById("osa-soldeEC").value.replace(/ /gi,'')) - soldeOp);

			if (solde<0) {
				document.getElementById('osa-debit').value = Math.abs(solde);
			}
			else if (solde>0) {
				document.getElementById('osa-debit').value = "";
				document.getElementById('osa-credit').value = solde;
			}
			else {
				document.getElementById('osa-debit').value = "";
			}
			document.getElementById('osa-piece').focus();
		}
		else {
			try {
				document.getElementById('osa-debit').value = rd2.round(eval(debit));
			}	catch(e) {}
			document.getElementById('osa-piece').focus();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pressOnCompte() {
	try {

		var numeroCompte = document.getElementById('osa-compte').value;

		if (isEmpty(numeroCompte) || !osa_existeCompte(numeroCompte)) {
			if (isEmpty(osa_compteLike)) {
				osa_openRechercheCompte('osa-compte');
			}
			else {
				document.getElementById('osa-compte').value = osa_compteLike;
			}
		}

		osa_refreshInfosCpte(document.getElementById('osa-compte').value);

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pressOnContrepartie() {
	try {

		var numeroCompte = document.getElementById('osa-contrepartie').value;

		if (!isEmpty(numeroCompte) && !osa_existeCompte(numeroCompte)) {
			if (isEmpty(osa_compteLike)) {
				osa_openRechercheCompte('osa-contrepartie');
			}
			else {
				document.getElementById('osa-contrepartie').value = osa_compteLike;
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pressOnLigneSaisie(event) {
	try {

		if ((event.keyCode==13 || event.keyCode==9) && osa_wTreeEcritures.view!=null && osa_wTreeEcritures.currentIndex!=-1 && !osa_wTreeEcritures.view.isSeparator(osa_wTreeEcritures.currentIndex)) {

			if (event.keyCode==9) event.preventDefault();

			// entrée
			switch (event.target.id) {
				case 'osa-jour':
					document.getElementById('osa-compte').focus();
					break;
				case 'osa-compte':
					osa_pressOnCompte();
					osa_checkCoherence();
					document.getElementById('osa-libelle').focus();
					break;
				case 'osa-libelle':
					document.getElementById('osa-contrepartie').focus();
					break;
				case 'osa-contrepartie':
					osa_pressOnContrepartie();
					document.getElementById('osa-echeance').focus();
					break;
				case 'osa-echeance':
					if (!document.getElementById('osa-reglement').disabled) {
						document.getElementById('osa-reglement').focus();
					}
					else {
						document.getElementById('osa-commentaire').focus();
					}
					break;
				case 'osa-reglement':
					document.getElementById('osa-commentaire').focus();
					break;
				case 'osa-commentaire':
					document.getElementById('osa-debit').focus();
					break;
				case 'osa-debit':
					osa_pressOnDebit();
					osa_checkCoherence();
					break;
				case 'osa-credit':
					osa_pressOnCredit();
					osa_checkCoherence();
					break;
				case 'osa-piece':
					if (osa_modeRaccourci) { 
						if (osa_checkModele()) {
							// on valide et si ok, on calcule le montant total et on passe à la ligne suivante du modele
							osa_validerLigne();
							// si non validé on recharge la ligne du modele, sinon on charge la suivante
							if (osa_modeRaccourci) {
								osa_executeModele();
							}
						} else {
							// il y a eu un probleme
							if (!osa_modeRaccourci) {
								// on a quitté le mode raccourci, on valide donc la ligne
								osa_validerLigne();
							} else {
								// on veut rester dans le mode raccourci, on reload donc les primaries
								osa_executeModelePrimaries();
							}
						}
					} else {
						// le mode rappel auto ne fonctionne que hors raccourci
						// chargement effectué dans refresh infos compte
						osa_validerLigne();
						if (osa_modeRappel.active) {
							// on charge les données auto-apprises
							osa_executeRappel();
						}
					}
					break;
			}
		}
		else if (event.keyCode==27 && osa_wTreeEcritures.view!=null && osa_wTreeEcritures.currentIndex!=-1 && !osa_wTreeEcritures.view.isSeparator(osa_wTreeEcritures.currentIndex) && !event.ctrlKey) {
			// echap
			switch (event.target.id) {
				case 'osa-compte':
					document.getElementById('osa-jour').focus();
					break;
				case 'osa-libelle':
					document.getElementById('osa-compte').focus();
					break;
				case 'osa-contrepartie':
					document.getElementById('osa-libelle').focus();
					break;
				case 'osa-echeance':
					document.getElementById('osa-contrepartie').focus();
					break;
				case 'osa-reglement':
					document.getElementById('osa-echeance').focus();
					break;
				case 'osa-commentaire':
					if (!document.getElementById('osa-reglement').disabled) {
						document.getElementById('osa-reglement').focus();
					}
					else {
						document.getElementById('osa-echeance').focus();
					}
					break;
				case 'osa-debit':
					document.getElementById('osa-commentaire').focus();
					break;
				case 'osa-credit':
					document.getElementById('osa-debit').focus();
					break;
				case 'osa-piece':
					document.getElementById('osa-credit').focus();
					break;
			}
		}
		else if (event.keyCode==38 && event.target.id!="osa-reglement") {
			// flèche haut
			osa_lignePrecedente();
		}
		else if (event.keyCode==40 && event.target.id!="osa-reglement") {
			// flèche bas
			osa_ligneSuivante();
		}
		else if (event.keyCode==33) {
			// page up
			osa_ligneDefilPrec();
		}
		else if (event.keyCode==34) {
			// page down
			osa_ligneDefilSuiv();
		}
		else if (event.keyCode==35) {
			// fin
			osa_ligneFin();
		}
		else if (event.keyCode==36) {
			// orig
			osa_ligneDebut();
		}
		else if (event.keyCode==45 && event.ctrlKey) {
			// ctrl + inser
			// insérer une ligne

			osa_insererOperation();
		}
		else if (event.keyCode==46 && event.ctrlKey) {
			// ctrl + suppr
			// supprimer une ligne

			osa_supprimerOperation();

			/*
			HALLUCINANT
			var mm = document.getElementById('osa-jour').value;
			debug(mm);
			document.getElementById('osa-jour').value = mm;
			debug(document.getElementById('osa-jour').value);
			*/
		}
		else if (event.keyCode==46 && event.altKey) {
			// alt + suppr
			// supprimer une écriture complète

			osa_supprimerEcriture();
		}
		else if (event.keyCode==27 && event.ctrlKey && osa_modeRaccourci) {
			// ctrl + esc
			osa_enableModeRaccourci(false);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function osa_pressOnDate(event) {
	try {
		// verif des touches pertinentes avant de verifier les lignes du tableau
		if (event.keyCode==120 || (event.charCode>=49 && event.charCode<=57 && event.ctrlKey)) {
			if (isPremiereLigne() && !osa_modeRaccourci) {
				if (event.keyCode==120) {
					var url = "chrome://opensi/content/compta/user/saisie/rechModele.xul?"+ cookie();
			    	window.openDialog(url,'','chrome,modal,centerscreen',osa_loadModeleById);
				} else if (event.charCode>=49 && event.charCode<=57 && event.ctrlKey) {
					var numRaccourci=0;
					switch(event.charCode) {
						case 49:
							numRaccourci = 1; break;
						case 50:
							numRaccourci = 2; break;
						case 51:
							numRaccourci = 3; break;
						case 52:
							numRaccourci = 4; break;
						case 53:
							numRaccourci = 5; break;
						case 54:
							numRaccourci = 6; break;
						case 55:
							numRaccourci = 7; break;
						case 56:
							numRaccourci = 8; break;
						case 57:
							numRaccourci = 9; break;
						default:
							numRaccourci = 0; break;
					}
					osa_loadModeleByRaccourci(numRaccourci);
				}
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function isPremiereLigne() {
	try {
		// verif si on est pas en modif d'une ecriture
		return ((!osa_isEcritureEnModif(osa_wTreeEcritures.currentIndex))
				// verif si on est bien la première ligne d'une saisie : idx à 0 ou ligne prec = separator
				&& (osa_wTreeEcritures.currentIndex==0
					|| (osa_wTreeEcritures.currentIndex>0 && osa_wTreeEcritures.view.isSeparator(osa_wTreeEcritures.currentIndex-1))))
	} catch (e) {
		recup_erreur(e);
	}
}

function osa_enableModeRaccourci(b) {
	try {
		osa_modeRaccourci = b;
		osa_disableNearlyAll(b);
		document.getElementById("osa-modeleActif").collapsed = !b;
		
		if (b) {
			osa_executeModele();
		} else {
			osa_modele.length = 0;
			osa_currentLigne = 0;
			osa_montantPourcent = -1;
			osa_tabLP.length = 0;
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function osa_executeModele() {
	try {
		osa_executeModelePrimaries();
		
		document.getElementById('osa-libelle').value = osa_modele[osa_currentLigne].libelle+(osa_modele[osa_currentLigne].periode?" du mois de "+document.getElementById('osa-periode').label:"");
		document.getElementById('osa-reglement').value = osa_modele[osa_currentLigne].reglement;
		document.getElementById('osa-commentaire').value = osa_modele[osa_currentLigne].infos;
		document.getElementById('osa-piece').value = osa_modele[osa_currentLigne].piece;
	} catch (e) {
		recup_erreur(e);
	}
}

function osa_executeModelePrimaries() {
	try {
		// compte
		document.getElementById('osa-compte').value = osa_modele[osa_currentLigne].compte;
		osa_refreshInfosCpte(osa_modele[osa_currentLigne].compte);
		
		// debit et credit
		document.getElementById('osa-credit').value = "";
		document.getElementById('osa-debit').value = "";
		// calcul sans montant
		if (osa_modele[osa_currentLigne].calcul=='S') {
			// saisie libre au débit ou au crédit
			document.getElementById('osa-debit').focus();
		}
		
		// calcul montant fixe
		else if (osa_modele[osa_currentLigne].calcul=='F') {
			// pas de saisie
			document.getElementById('osa-debit').value = (osa_modele[osa_currentLigne].debit==0?"":osa_modele[osa_currentLigne].debit);
			document.getElementById('osa-credit').value = (osa_modele[osa_currentLigne].credit==0?"":osa_modele[osa_currentLigne].credit);
			document.getElementById('osa-piece').focus();
		}
		
		// calcul pourcentage
		else if (osa_modele[osa_currentLigne].calcul=='P') {
			// calcul de la valeur à 100% lors de la premiere saisie -> checkModele
			if (osa_montantPourcent==-1) {
				// calcul au débit
				if (osa_modele[osa_currentLigne].debit!=0) {
					document.getElementById('osa-debit').focus();
				}
				// calcul au crédit
				else if (osa_modele[osa_currentLigne].credit!=0) {
					document.getElementById('osa-credit').focus();
				} else {
					alert("mauvaise ligne");
				}
			}
			// calcul de la valeur au débit ou au crédit lors des saisies suivantes
			else {
				// preparation de l'arrondi
				var rd2 = new Arrondi(2);
				
				// calcul au débit
				if (osa_modele[osa_currentLigne].debit!=0) {
					osa_modele[osa_currentLigne].debitCalc = rd2.round(osa_montantPourcent*osa_modele[osa_currentLigne].debit/100);
					document.getElementById('osa-debit').value = osa_modele[osa_currentLigne].debitCalc;
					document.getElementById('osa-piece').focus();
				}
				// calcul au crédit
				else if (osa_modele[osa_currentLigne].credit!=0) {
					osa_modele[osa_currentLigne].creditCalc = rd2.round(osa_montantPourcent*osa_modele[osa_currentLigne].credit/100);
					document.getElementById('osa-credit').value = osa_modele[osa_currentLigne].creditCalc;
					document.getElementById('osa-piece').focus();
				} else {
					alert("mauvaise ligne");
				}
				
				// test si dernière valeur en pourcent
				if (osa_modele[osa_currentLigne].tabLPId==osa_tabLP.length-1) {
					// calcul des sommes
					var sumD = 0;
					var sumC = 0;
					for (var i=0; i<osa_tabLP.length; i++) {
						sumD += osa_tabLP[i].debitCalc;
						sumC += osa_tabLP[i].creditCalc; 
					}
					sumD = rd2.round(sumD);
					sumC = rd2.round(sumC);
					// ajustement calcul au débit
					if (osa_modele[osa_currentLigne].debit!=0) {
						if (sumC<sumD) {
							osa_modele[osa_currentLigne].debitCalc -= (sumD-sumC);
						} else {
							osa_modele[osa_currentLigne].debitCalc += (sumC-sumD);
						}
						document.getElementById('osa-debit').value = osa_modele[osa_currentLigne].debitCalc;
					}
					// ajustement calcul au crédit
					else if (osa_modele[osa_currentLigne].credit!=0) {
						if (sumD<sumC) {
							osa_modele[osa_currentLigne].creditCalc -= (sumC-sumD);
						} else {
							osa_modele[osa_currentLigne].creditCalc += (sumD-sumC);
						}
						document.getElementById('osa-credit').value = osa_modele[osa_currentLigne].creditCalc;
					} else {
						alert("mauvaise ligne");
					}
				}
			}
		} else {
			alert("mauvais type calcul");
		}
	} catch (e) {
		recup_erreur(e);
	}
}

// verif cohérence par rapport au modele : compte, debit, credit
// renvoie true si aucun problème
// set osa_modeRaccourci = false si quitter
function osa_checkModele() {
	try {
		var probleme = false;
		var quitter = false;
		// verif compte
		if (document.getElementById('osa-compte').value!=osa_modele[osa_currentLigne].compte) {
			probleme = true;
			quitter = window.confirm("Vous avez modifié le compte de référence du modèle.\n"+
					"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
					"Voulez-vous quitter le mode raccourci ?");
		}
		// montant fixe
		else if (osa_modele[osa_currentLigne].calcul=='F') {
			// debit
			// debit modele = 0 -> debit courant vide ou 0
			if (osa_modele[osa_currentLigne].debit==0
			&& !isEmpty(document.getElementById('osa-debit').value)
			&& document.getElementById('osa-debit').value!=0) {
				probleme = true;
				quitter = window.confirm("Vous avez modifié le débit de référence du modèle.\n"+
				"Celui-ci était à l'origine nul.\n"+
				"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
				"Voulez-vous quitter le mode raccourci ?");
			}
			// debit modele !=0 -> debit courant = debit modele
			else if (osa_modele[osa_currentLigne].debit!=0
			&& document.getElementById('osa-debit').value!=parseFloat(osa_modele[osa_currentLigne].debit)) {
				probleme = true;
				quitter = window.confirm("Vous avez modifié le débit de référence du modèle.\n"+
				"Celui-ci était à l'origine fixé à une valeur précise.\n"+
				"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
				"Voulez-vous quitter le mode raccourci ?");
			}
			// credit
			// credit modele = 0 -> credit courant vide ou 0
			else if (osa_modele[osa_currentLigne].credit==0
			&& !isEmpty(document.getElementById('osa-credit').value)
			&& document.getElementById('osa-credit').value!=0) {
				probleme = true;
				quitter = window.confirm("Vous avez modifié le crédit de référence du modèle.\n"+
				"Celui-ci était à l'origine nul.\n"+
				"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
				"Voulez-vous quitter le mode raccourci ?");
			}
			// credit modele !=0 -> credit courant = credit modele
			else if (osa_modele[osa_currentLigne].credit!=0
			&& document.getElementById('osa-credit').value!=parseFloat(osa_modele[osa_currentLigne].credit)) {
				probleme = true;
				quitter = window.confirm("Vous avez modifié le crédit de référence du modèle.\n"+
				"Celui-ci était à l'origine fixé à une valeur précise.\n"+
				"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
				"Voulez-vous quitter le mode raccourci ?");
			}
		}
		// montant pourcentage
		else if (osa_modele[osa_currentLigne].calcul=='P') {
			// debit
			var rd2 = new Arrondi(2);
			// debit modele = 0 -> debit courant vide ou 0
			if (osa_modele[osa_currentLigne].debit==0
			&& !isEmpty(document.getElementById('osa-debit').value)
			&& document.getElementById('osa-debit').value!=0) {
				probleme = true;
				quitter = window.confirm("Vous avez modifié le débit de référence du modèle.\n"+
				"Celui-ci correspondait à l'origine à un pourcentage nul.\n"+
				"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
				"Voulez-vous quitter le mode raccourci ?");
			}
			// debit modele !=0 -> debit courant non vide et non nul
			else if (osa_modele[osa_currentLigne].debit!=0
			&& (isEmpty(document.getElementById('osa-debit').value) || document.getElementById('osa-debit').value==0)) {
				probleme = true;
				quitter = window.confirm("Le modèle attend un montant au débit.\n"+
				"Celui-ci correspondait à l'origine à un pourcentage.\n"+
				"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
				"Voulez-vous quitter le mode raccourci ?");
			}
			// debit modele !=0 et debit courant non vide et non nul et montant pourcent != -1 -> debit courant = montant pourcent * debit modele / 100
			else if (osa_modele[osa_currentLigne].debit!=0
			&& !isEmpty(document.getElementById('osa-debit').value)
			&& document.getElementById('osa-debit').value!=0
			&& osa_montantPourcent!=-1
			&& document.getElementById('osa-debit').value!=rd2.round(osa_montantPourcent*osa_modele[osa_currentLigne].debit/100)) {
				probleme = true;
				quitter = window.confirm("Vous avez modifié le débit de référence du modèle.\n"+
				"Celui-ci correspondait à l'origine à un pourcentage de votre première saisie.\n"+
				"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
				"Voulez-vous quitter le mode raccourci ?");
			}
			// credit
			// credit modele = 0 -> credit courant vide ou 0
			else if (osa_modele[osa_currentLigne].credit==0
			&& !isEmpty(document.getElementById('osa-credit').value)
			&& document.getElementById('osa-credit').value!=0) {
				probleme = true;
				quitter = window.confirm("Vous avez modifié le crédit de référence du modèle.\n"+
				"Celui-ci correspondait à l'origine à un pourcentage nul.\n"+
				"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
				"Voulez-vous quitter le mode raccourci ?");
			}
			// credit modele !=0 -> credit courant non vide et non nul
			else if (osa_modele[osa_currentLigne].credit!=0
			&& (isEmpty(document.getElementById('osa-credit').value) || document.getElementById('osa-credit').value==0)) {
				probleme = true;
				quitter = window.confirm("Le modèle attend un montant au crédit.\n"+
				"Celui-ci correspondait à l'origine à un pourcentage.\n"+
				"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
				"Voulez-vous quitter le mode raccourci ?");
			}
			// credit modele !=0 et credit courant non vide et non nul et montant pourcent != -1 -> credit courant = montant pourcent * credit modele / 100
			else if (osa_modele[osa_currentLigne].credit!=0
			&& !isEmpty(document.getElementById('osa-credit').value)
			&& document.getElementById('osa-credit').value!=0
			&& osa_montantPourcent!=-1
			&& document.getElementById('osa-credit').value!=rd2.round(osa_montantPourcent*osa_modele[osa_currentLigne].credit/100)) {
				probleme = true;
				quitter = window.confirm("Vous avez modifié le crédit de référence du modèle.\n"+
				"Celui-ci correspondait à l'origine à un pourcentage de votre première saisie.\n"+
				"Si vous continuez la saisie, vous quitterez le modèle actuel.\n"+
				"Voulez-vous quitter le mode raccourci ?");
			}
		}
		if (quitter) {
			osa_enableModeRaccourci(false);
			//osa_modeRaccourci = false;
		}
		return !probleme;
	} catch (e) {
		recup_erreur(e);
	}
}

function osa_loadModeleById(id) {
	try {
		var qLoadModele = new QueryHttp("Compta/Saisie/getModele.tmpl");
		
		qLoadModele.setParam("ModId", id);
		
		var result = qLoadModele.execute();
		
		var tabLignes = result.responseXML.documentElement.getElementsByTagName("ligne");
		
		osa_loadLignes(tabLignes);
	} catch (e) {
		recup_erreur(e);
	}
}

function osa_loadModeleByRaccourci(raccourci) {
	try {
		var qLoadModele = new QueryHttp("Compta/Saisie/getModele.tmpl");
		
		qLoadModele.setParam("RaccId", raccourci);
		
		var result = qLoadModele.execute();
		
		var tabLignes = result.responseXML.documentElement.getElementsByTagName("ligne");
		osa_loadLignes(tabLignes);
	} catch (e) {
		recup_erreur(e);
	}
}

function osa_loadLignes(tabLignes) {
	try {
		if (tabLignes.length!=0) {
			osa_modele = new Array();
			osa_currentLigne = 0;
			osa_montantPourcent = -1;
			osa_tabLP = new Array();
			
			for(var i=0; i<tabLignes.length; i++) {
				var ligneXml = tabLignes.item(i);
				var ligne = new osa_LigneModele();
				
				ligne.compte = ligneXml.getAttribute("compte");
				ligne.libelle = ligneXml.getAttribute("libelle");
				ligne.reglement = ligneXml.getAttribute("idreg");
				ligne.infos = ligneXml.getAttribute("infos");
				ligne.debit = ligneXml.getAttribute("debit");
				ligne.credit = ligneXml.getAttribute("credit");
				ligne.piece = ligneXml.getAttribute("piece");
				ligne.calcul = ligneXml.getAttribute("calcul");
				ligne.periode = (ligneXml.getAttribute("periode")!=0);
				
				osa_modele[i] = ligne;
				
				// si c'est un pourcentage on ajoute la ligne au tableau des lignes en pourcentage
				if (osa_modele[i].calcul=='P') {
					ligne.tabLPId = osa_tabLP.length; 
					osa_tabLP[ligne.tabLPId] = ligne;
				}
			}
			osa_enableModeRaccourci(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function osa_executeRappel() {
	try {
		var rd2 = new Arrondi(2);
		if (osa_modeRappel.etat==1) {
			// chargement de la contrepartie;
			if (!isEmpty(osa_modeRappel.contrepartie)) {
				document.getElementById('osa-compte').value = osa_modeRappel.contrepartie;
				osa_refreshInfosCpte(osa_modeRappel.contrepartie);
				document.getElementById('osa-debit').focus();
			} else {
				document.getElementById('osa-compte').focus();
			}
			if (osa_modeRappel.codeTVA!=1) {
				// on a une tva, on peut donc en déduire le montant de la contrepartie 
				document.getElementById('osa-debit').value = (osa_modeRappel.debitCp==0)?"":rd2.round(osa_modeRappel.debitCp);
				document.getElementById('osa-credit').value = (osa_modeRappel.creditCp==0)?"":rd2.round(osa_modeRappel.creditCp);
				if (!isEmpty(osa_modeRappel.contrepartie)) {
					document.getElementById('osa-piece').focus();
				}
			}
		} else if (osa_modeRappel.etat==2) {
			// chargement de la tva
			document.getElementById('osa-compte').value = osa_modeRappel.compteTVA;
			if (!isEmpty(osa_modeRappel.compteTVA)) {
				document.getElementById('osa-debit').focus();
			} else {
				document.getElementById('osa-compte').focus();
			}
			if (osa_modeRappel.codeTVA!=1) {
				document.getElementById('osa-debit').value = (osa_modeRappel.debitTVA==0)?"":rd2.round(osa_modeRappel.debitTVA);
				document.getElementById('osa-credit').value = (osa_modeRappel.creditTVA==0)?"":rd2.round(osa_modeRappel.creditTVA);
				if (!isEmpty(osa_modeRappel.compteTVA)) {
					document.getElementById('osa-piece').focus();
				}
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}

function osa_insererOperation() {
	try {

		var idx = osa_wTreeEcritures.currentIndex;
		if (osa_writeable && !osa_wTreeEcritures.view.isSeparator(idx)) {
			if (getCellText(osa_wTreeEcritures,idx,'osa-ColEcritureId')!='0') {
				osa_toModeModif(idx);
			}
			osa_insererLignePreremplie(idx);
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_pressOnTreeEcritures(event) {
	try {

		if (event.keyCode==13) {
			osa_menuRevision();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_setLigneEditable(editable) {
	try {

		var b = !editable;

		if (b) {
			document.getElementById("osa-jour").setAttribute("readonly",true);
			document.getElementById("osa-compte").setAttribute("readonly",true);
			document.getElementById("osa-libelle").setAttribute("readonly",true);
			document.getElementById("osa-contrepartie").setAttribute("readonly",true);
			document.getElementById("osa-echeance").setAttribute("readonly",true);
			document.getElementById("osa-commentaire").setAttribute("readonly",true);
			document.getElementById("osa-debit").setAttribute("readonly",true);
			document.getElementById("osa-credit").setAttribute("readonly",true);
			document.getElementById("osa-piece").setAttribute("readonly",true);
		}
		else {
			document.getElementById("osa-jour").removeAttribute("readonly");
			document.getElementById("osa-compte").removeAttribute("readonly");
			document.getElementById("osa-libelle").removeAttribute("readonly");
			document.getElementById("osa-contrepartie").removeAttribute("readonly");
			document.getElementById("osa-echeance").removeAttribute("readonly");
			document.getElementById("osa-commentaire").removeAttribute("readonly");
			document.getElementById("osa-debit").removeAttribute("readonly");
			document.getElementById("osa-credit").removeAttribute("readonly");
			document.getElementById("osa-piece").removeAttribute("readonly");
		}

		document.getElementById("osa-reglement").disabled = b;

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_checkCoherence() {
	try {

		if (osa_currentTypeJournal=="AC" || osa_currentTypeJournal=="VE") {

			switch (document.getElementById('osa-typeCompte').value) {
				case 'F':
					if (isEmpty(document.getElementById('osa-debit').value)) {
						document.getElementById('osa-controleCoherence').value = "";
						document.getElementById('osa-controleCoherence').collapsed = true;
					}
					else {
						document.getElementById('osa-controleCoherence').value = "Attention ! Vous débitez un compte fournisseur. Etes-vous sûr de comptabiliser un avoir ?";
						document.getElementById('osa-controleCoherence').collapsed = false;
					}
					break;
				case 'C':
					if (isEmpty(document.getElementById('osa-credit').value)) {
						document.getElementById('osa-controleCoherence').value = "";
						document.getElementById('osa-controleCoherence').collapsed = true;
					}
					else {
						document.getElementById('osa-controleCoherence').value = "Attention ! Vous créditez un compte client. Etes-vous sûr de comptabiliser un avoir ?";
						document.getElementById('osa-controleCoherence').collapsed = false;
					}
					break;
				default:
					document.getElementById('osa-controleCoherence').value = "";
					document.getElementById('osa-controleCoherence').collapsed = true;
					break;
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_enregistrerEcriture(idx) {
	try {

		var i = idx;
		var listeOp = "";

		while (i>=0 && !osa_wTreeEcritures.view.isSeparator(i)) {
			i--;
		}

		i++;
		var ind = i;

		while (i<osa_wTreeEcritures.view.rowCount && !osa_wTreeEcritures.view.isSeparator(i)) {

			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColOpId') +"|";
			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColJourOp') +"|";
			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColNumeroCompte') +"|";
			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColLibelle').replace(/\|/gi,'') +"|";
			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColContrepartie') +"|";
			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColEcheance') +"|";
			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColModeRegId') +"|";
			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColCommentaire').replace(/\|/gi,'') +"|";
			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColDebit').replace(/ /gi,'') +"|";
			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColCredit').replace(/ /gi,'') +"|";
			listeOp += getCellText(osa_wTreeEcritures,i,'osa-ColPiece').replace(/\|/gi,'') +"|";
			i++;
		}

		qSaveEcr.setParam('Ecriture_Id', getCellText(osa_wTreeEcritures,idx,'osa-ColEcritureId'));
		qSaveEcr.setParam('Code_Journal', osa_currentJournal);
		qSaveEcr.setParam('Periode', osa_currentPeriode);
		qSaveEcr.setParam('ListeOp', listeOp);
		
		var result = qSaveEcr.execute();

		var contenu = result.responseXML.documentElement;
		var numero = contenu.getAttribute('Numero');
		var ecritureId = contenu.getAttribute('Ecriture_Id');
		var opids = contenu.getAttribute('Liste_Op_Id').split(/,/gi);

		i = ind;
		var j = 0;

		while (i<osa_wTreeEcritures.view.rowCount && !osa_wTreeEcritures.view.isSeparator(i)) {
			var child = osa_getChild(i);
			child.addTargetOnce(osa_targetName('Numero'), numero);
			child.addTargetOnce(osa_targetName('Ecriture_Id'), ecritureId);
			child.addTargetOnce(osa_targetName('Prop'), '');
			child.addTargetOnce(osa_targetName('Modif'), '');
			child.addTargetOnce(osa_targetName('Op_Id'), opids[j++]);
			i++;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_supprimerEcriture() {
	try {

		if (osa_writeable && osa_wTreeEcritures.view!=null && osa_wTreeEcritures.currentIndex!=-1) {

			var idx = osa_wTreeEcritures.currentIndex;

			if (!osa_wTreeEcritures.view.isSeparator(idx) && osa_isEcritureSupprimable(idx) && confirm("Voulez-vous supprimer l'écriture courante ?")) {

				var ecritureId = getCellText(osa_wTreeEcritures,idx,'osa-ColEcritureId');

				// suppression à l'écran
				var i = idx;

				while (i<osa_wTreeEcritures.view.rowCount && !osa_wTreeEcritures.view.isSeparator(i)) {
					osa_supprimerLigne(i);
				}

				i = idx - 1;
				while (i>=0 && !osa_wTreeEcritures.view.isSeparator(i)) {
					osa_supprimerLigne(i);
					i--;
				}

				i++;
				if (i<osa_wTreeEcritures.view.rowCount && osa_wTreeEcritures.view.isSeparator(i)) {
					osa_supprimerLigne(i); // suppression d'un séparateur
					if (i==osa_wTreeEcritures.view.rowCount) {
						osa_selectLigne(i-1);
					}
					else {
						osa_selectLigne(i);
					}
				}

				// suppression sur le serveur
				if (ecritureId!="" && ecritureId!="0") {
					qSupEcr.setParam('Ecriture_Id', ecritureId);
					qSupEcr.execute();
				}
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_supprimerOperation() {
	try {

		if (osa_writeable && osa_wTreeEcritures.view!=null && osa_wTreeEcritures.currentIndex!=-1) {

			var idx = osa_wTreeEcritures.currentIndex;

			if ((idx==osa_wTreeEcritures.view.rowCount-1 || osa_wTreeEcritures.view.isSeparator(idx+1)) && (idx==0 || osa_wTreeEcritures.view.isSeparator(idx-1))) {
				// si opération toute seule, on demande la suppression de l'écriture complète
				osa_supprimerEcriture();
			}
			else if (!osa_wTreeEcritures.view.isSeparator(idx) && osa_isOperationSupprimable(idx) && confirm("Voulez-vous supprimer la ligne courante ?")) {

				osa_toModeModif(idx);
				osa_supprimerLigne(idx);
				if (idx==osa_wTreeEcritures.view.rowCount-1 || (idx!=-1 && osa_wTreeEcritures.view.isSeparator(idx))) {
					osa_selectLigne(idx-1);
				}
				else {
					osa_selectLigne(idx);
				}
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_isEcritureSupprimable(idx) {
	try {

		var i = idx;
		while (i>=0 && !osa_wTreeEcritures.view.isSeparator(i)) {
			if (!osa_isOperationSupprimable(i)) return false;
			i--;
		}
		i = idx + 1;
		while (i<osa_wTreeEcritures.view.rowCount && !osa_wTreeEcritures.view.isSeparator(i)) {
			if (!osa_isOperationSupprimable(i)) return false;
			i++;
		}
		return true;

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_isOperationSupprimable(idx) {
	try {

		// proposer délettrage si lettrée ?

		if (!isEmpty(getCellText(osa_wTreeEcritures,idx,'osa-ColLettre'))) {
			showWarning("Impossible de supprimer l'écriture (écriture lettrée)");
			return false;
		}
		else if (getCellValue(osa_wTreeEcritures,idx,'osa-ColPointage')=="1") {
			showWarning("Impossible de supprimer l'écriture (écriture pointée ou appartenant à un rapprochement bancaire clôturé)");
			return false;
		}
		else if (getCellText(osa_wTreeEcritures,idx,'osa-ColEtat')=="T") {
			showWarning("Impossible de supprimer l'écriture (écriture bloquée)");
			return false;
		}
		else if (getCellText(osa_wTreeEcritures,idx,'osa-ColEtat')=="V") {
			showWarning("Impossible de supprimer l'écriture (écriture clôturée)");
			return false;
		}
		else {
			return true;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_periodePrec() {
	try {

		var wPeriode = document.getElementById('osa-periode');
		var idxPeriode = wPeriode.selectedIndex - 1;
		var maxIndex = wPeriode.getElementsByTagName('menuitem').length - 2;
		wPeriode.selectedIndex = (idxPeriode>=0?idxPeriode:maxIndex);
		osa_chargerJournal();

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_periodeSuiv() {
	try {

		var wPeriode = document.getElementById('osa-periode');
		var idxPeriode = wPeriode.selectedIndex + 1;
		var maxIndex = wPeriode.getElementsByTagName('menuitem').length - 2;
		wPeriode.selectedIndex = (idxPeriode<=maxIndex?idxPeriode:0);
		osa_chargerJournal();

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_openRechercheCompte(rechId) {
	try {

		osa_currentRechId = rechId;

		var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Creer=true&Num_Compte="+ urlEncode(document.getElementById(rechId).value);
		window.openDialog(url,'','chrome,modal,centerscreen',osa_retourRechercheCompte);

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_retourRechercheCompte(numeroCompte) {
	try {

		document.getElementById(osa_currentRechId).value = numeroCompte;

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_openPlanComptable() {
	try {

		// comment connaitre l'élément qui avait le focus précédemment ???
		//var previousFocusId = ?;
		//osa_currentRechId = (previousFocusId=="osa-compte" || previousFocusId=="osa-contrepartie"?previousFocusId:null);

		osa_currentRechId = null;

		var url = "chrome://opensi/content/config/util/liste_plan.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen','1',retourPlanComptable);

	} catch (e) {
		recup_erreur(e);
	}
}


function retourPlanComptable(numeroCompte) {
	try {

		if (osa_currentRechId!=null) {
			document.getElementById(osa_currentRechId).value = numeroCompte;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_menuRevision() {
	try {

		if (osa_wTreeEcritures.view!=null && osa_wTreeEcritures.currentIndex!=-1) {

			var idx = osa_wTreeEcritures.currentIndex;

			var numeroCompte = getCellText(osa_wTreeEcritures,idx,'osa-ColNumeroCompte');
			var opId = getCellText(osa_wTreeEcritures,idx,'osa-ColOpId');
			var lettre = getCellText(osa_wTreeEcritures,idx,'osa-ColLettre');

			if (!isEmpty(numeroCompte)) {
			 	var prec = "chrome://opensi/content/compta/user/saisie/menuSaisie.xul?"+ cookie();
				if (opId=="0") {
					prec += "&Code_Journal="+ osa_currentJournal +"&Periode="+ osa_currentPeriode;
				}
				else {
					prec += "&Op_Id="+ opId;
				}

				var page = "chrome://opensi/content/compta/user/consultation/menu_consultation.xul?"+ cookie();
				page += "&compte="+ numeroCompte;
				page += "&let="+ (isEmpty(lettre)?'0':'1');
				page += "&numop="+ opId;
				page += "&prec="+ urlEncode(prec);
				page += "&nomprec=Saisie";
				window.location = page;
			}
			else {
				window.location = "chrome://opensi/content/compta/user/consultation/menu_consultation.xul?"+ cookie();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_enCoursDeSaisie() {
	try {

		if (osa_wTreeEcritures.view!=null) {
			for (var i=0; i<osa_wTreeEcritures.view.rowCount-1; i++) {
				if (getCellText(osa_wTreeEcritures,i,'osa-ColModif')=='1') {
					return true;
				}
			}
		}

		return false;

	} catch (e) {
		recup_erreur(e);
	}
}


function osa_confirmerAction(fonction) {
	try {

		if (!osa_enCoursDeSaisie() || window.confirm("Attention, des écritures sont en cours de saisie et ne seront pas enregistrées ! Souhaitez-vous poursuivre ?")) {
			fonction();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


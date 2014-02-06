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

var orbt_aRemboursements = new Arbre("Facturation/Suivi_Reglements_Fournisseurs/liste-remboursements.tmpl", "orbt-listeRemboursements");
var orbt_aImputations = new Arbre("Facturation/Suivi_Reglements_Fournisseurs/liste-imputationsReglements.tmpl", "orbt-listeReglements");

var orbt_aBanquesRemise = new Arbre('Config/GetRDF/listeBanques.tmpl', 'orbt-banqueRemise');
var orbt_aMotifs = new Arbre('ComboListe/combo-motifsRemboursement.tmpl', 'orbt-motif');
var orbt_aFournisseurs = new Arbre('Facturation/Suivi_Reglements_Fournisseurs/combo-fournisseurs.tmpl', 'orbt-fournisseur');
var orbt_aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'orbt-modeReglement');
var orbt_chargerModeReg;
var orbt_chargerFournisseur;
var orbt_chargerDenominationFournisseur;
var orbt_currentRemboursementId;

var orbt_nbLignesParPage = 100;
var orbt_pageCourante = 1;
var orbt_nbPages = 1;

function orbt_init() {
  try {
    
  	document.getElementById('orbt-etat').value = "N";
  	orbt_aBanquesRemise.initTree(orbt_initBanqueRetrait);
  	
	} catch (e) {
  	recup_erreur(e);
	}
}

function orbt_initBanqueRetrait() {
	try {
    document.getElementById('orbt-banqueRemise').selectedIndex = 0;
    orbt_aMotifs.initTree(orbt_initMotif);
	} catch (e) {
    recup_erreur(e);
  }
}

function orbt_initMotif() {
	try {
    document.getElementById('orbt-motif').selectedIndex = 0;
    orbt_initListeRemboursements();
	} catch (e) {
    recup_erreur(e);
  }
}

function orbt_chargerFournisseurs(selection, denomination) {
	try {
		orbt_chargerFournisseur = selection;
		orbt_chargerDenominationFournisseur = denomination;
		orbt_aFournisseurs.setParam("Fournisseur_Id", selection);
		orbt_aFournisseurs.setParam("Remboursement_Id", orbt_currentRemboursementId);
		orbt_aFournisseurs.setParam("Type", "RB");
    orbt_aFournisseurs.initTree(orbt_selectFournisseur);
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_chargerModesReglements(selection) {
	try {
		orbt_chargerModeReg = selection;
		orbt_aModesReglements.setParam("Selection", orbt_chargerModeReg);
		orbt_aModesReglements.initTree(orbt_initModeReglement);
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_initModeReglement() {
	try {

    document.getElementById('orbt-modeReglement').value=orbt_chargerModeReg;

	} catch (e) {
    recup_erreur(e);
  }
}

function orbt_initListeRemboursements() {
	try {
		
		orbt_aRemboursements.deleteTree();
		orbt_aImputations.deleteTree();
		document.getElementById('orbt-bDesaffecter').disabled = true;
		document.getElementById('orbt-bAffecterRemb').disabled = true;
		
		orbt_nouveauRemboursement();
		
		var fournisseurId = document.getElementById('orbt-numFournisseur').value;
		var dateDebut = document.getElementById('orbt-dateDebut').value;
		var dateFin = document.getElementById('orbt-dateFin').value;
		var etat = document.getElementById('orbt-etat').value;
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("La date de fin doit être supérieure à la date de début !"); }
		else {
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			document.getElementById('orbt-listeRemboursements').disabled = true;
			
			document.getElementById('orbt-totalRemboursement').value = "";
			document.getElementById('orbt-totalRestant').value = "";
			
			orbt_pageCourante = 1;
			orbt_nbPages = 1;
			document.getElementById('orbt-pageDeb').value = 1;
			document.getElementById('orbt-pageFin').value = 1;
			document.getElementById('orbt-bPrec').disabled = true;
			document.getElementById('orbt-bSuiv').disabled = true;
			
			orbt_aRemboursements.setParam("Fournisseur_Id", fournisseurId);
			orbt_aRemboursements.setParam("Date_Debut", dateDebut);
			orbt_aRemboursements.setParam("Date_Fin", dateFin);
			orbt_aRemboursements.setParam("Etat", etat);
			orbt_aRemboursements.setParam("Page_Debut", orbt_pageCourante);
			orbt_aRemboursements.setParam("Nb_Lignes_Par_Page", orbt_nbLignesParPage);
			orbt_aRemboursements.initTree(orbt_initTotaux);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_initTotaux() {
	try {
		var fournisseurId = document.getElementById('orbt-numFournisseur').value;
		var dateDebut = document.getElementById('orbt-dateDebut').value;
		var dateFin = document.getElementById('orbt-dateFin').value;
		var etat = document.getElementById('orbt-etat').value;
		
		if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
		if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
		
		var qTotauxPieces = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/getTotauxRemboursements.tmpl");
		qTotauxPieces.setParam("Fournisseur_Id", fournisseurId);
		qTotauxPieces.setParam("Date_Debut", dateDebut);
		qTotauxPieces.setParam("Date_Fin", dateFin);
		qTotauxPieces.setParam("Etat", etat);
		qTotauxPieces.setParam("Nb_Lignes_Par_Page", orbt_nbLignesParPage);
		var result = qTotauxPieces.execute();
		
		document.getElementById('orbt-totalRemboursement').value = result.responseXML.documentElement.getAttribute("Total_Remboursement");
		document.getElementById('orbt-totalRestant').value = result.responseXML.documentElement.getAttribute("Total_Restant");
		orbt_nbPages = result.responseXML.documentElement.getAttribute("Nb_Pages");
		
		orbt_initPagination();
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_activerListeRemboursements() {
	try {
		document.getElementById('orbt-listeRemboursements').disabled = false;
		document.getElementById('orbt-bAffecterRemb').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_initPagination() {
	try {
		document.getElementById('orbt-pageDeb').value = orbt_pageCourante;
		document.getElementById('orbt-pageFin').value = (orbt_nbPages>0?orbt_nbPages:1);
		document.getElementById('orbt-bPrec').disabled = (orbt_pageCourante==1);
		document.getElementById('orbt-bSuiv').disabled = (orbt_pageCourante>=orbt_nbPages); // peut se produire si nbPages=0
		
		orbt_activerListeRemboursements();
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_pressOnPagePrec() {
	try {
		orbt_pageCourante--;
		orbt_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_pressOnPageSuiv() {
	try {
		orbt_pageCourante++;
		orbt_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_majPagination() {
	try {
		
		document.getElementById('orbt-listeRemboursements').disabled = true;
		orbt_aImputations.deleteTree();
		document.getElementById('orbt-bDesaffecter').disabled = true;

		orbt_nouveauRemboursement();
		
		document.getElementById('orbt-pageDeb').value = orbt_pageCourante;
		document.getElementById('orbt-bPrec').disabled = (orbt_pageCourante==1);
		document.getElementById('orbt-bSuiv').disabled = (orbt_pageCourante==orbt_nbPages);
		
		orbt_aRemboursements.setParam("Page_Debut", orbt_pageCourante);
		orbt_aRemboursements.initTree(orbt_activerListeRemboursements);

	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_reinitialiser() {
	try {
		document.getElementById('orbt-numFournisseur').value = "";
		document.getElementById('orbt-dateDebut').value = "";
		document.getElementById('orbt-dateFin').value = "";
		document.getElementById('orbt-etat').value = "N";
		
		orbt_initListeRemboursements();
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_rechercherFournisseur() {
	try {
		var url="chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',orbt_retourRechercherFournisseur);
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_retourRechercherFournisseur(codeFournisseur) {
	try {
  	document.getElementById('orbt-numFournisseur').value = codeFournisseur;
  	orbt_initListeRemboursements();
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_ajouterFournisseurListe() {
	try {
		var url="chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',orbt_retourAjouterFournisseurListe);
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_retourAjouterFournisseurListe(codeFournisseur) {
	try {
		orbt_chargerFournisseurs(codeFournisseur, "");
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			orbt_initListeRemboursements();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_selectOnListeRemboursements() {
	try {
		if (orbt_aRemboursements.isSelected()) {
			var i = orbt_aRemboursements.getCurrentIndex();
			orbt_currentRemboursementId = orbt_aRemboursements.getCellText(i, 'orbt-colRemboursementId');
			orbt_aImputations.setParam("Remboursement_Id", orbt_currentRemboursementId);
			orbt_aImputations.initTree();
			
			//document.getElementById('orbt-bEditerPdf').disabled = (orbt_aRemboursements.getCellText(i, 'orbt-colLettreEditable')!="1");
			
			var typeSuppression = orbt_aRemboursements.getCellText(i, 'orbt-colTypeSuppression');
			// 0 -> aucune interaction possible ; 1 -> suppression possible ; 2 -> annulation possible
			document.getElementById('orbt-bSupprimer').disabled = (typeSuppression!="1");
			document.getElementById('orbt-bSupprimer').collapsed = (typeSuppression=="2");
			document.getElementById('orbt-bAnnuler').collapsed = (typeSuppression!="2");
			
			var fournisseurId = orbt_aRemboursements.getCellText(i, 'orbt-colFournisseurId');
			var denomination = "";
			if (fournisseurId=="") { denomination = orbt_aRemboursements.getCellText(i, 'orbt-colDenomination'); }
			
			orbt_chargerFournisseurs(fournisseurId, denomination);
			orbt_chargerModesReglements(orbt_aRemboursements.getCellText(i, 'orbt-colModeRegId'));
			document.getElementById('orbt-dateRemboursement').value = orbt_aRemboursements.getCellText(i, 'orbt-colDateRemboursement');
			document.getElementById('orbt-banqueRemise').value = orbt_aRemboursements.getCellText(i, 'orbt-colBanqueRemiseId');
			document.getElementById('orbt-motif').value = orbt_aRemboursements.getCellText(i, 'orbt-colMotif');
			document.getElementById('orbt-banqueFournisseur').value = orbt_aRemboursements.getCellText(i, 'orbt-colBanqueFournisseur');
			document.getElementById('orbt-montant').value = orbt_aRemboursements.getCellText(i, 'orbt-colMontant');
			document.getElementById('orbt-commentaires').value = orbt_aRemboursements.getCellText(i, 'orbt-colCommentaires');
			document.getElementById('orbt-numPiece').value = orbt_aRemboursements.getCellText(i, 'orbt-colNumPiece');
			
			var typeModification = orbt_aRemboursements.getCellText(i, 'orbt-colTypeModification');
			// 0 -> aucune interaction possible ; 1 -> modification totale possible ; 2 -> modification possible sauf pour le montant
			document.getElementById('orbt-dateRemboursement').disabled = (typeModification=="0");
			document.getElementById('orbt-banqueRemise').disabled = (typeModification=="0");
			document.getElementById('orbt-motif').disabled = (typeModification=="0");
			document.getElementById('orbt-fournisseur').disabled = (typeModification=="0");
			document.getElementById('orbt-modeReglement').disabled = (typeModification=="0");
			document.getElementById('orbt-numPiece').disabled = (typeModification=="0");
			document.getElementById('orbt-montant').disabled = (typeModification!="1");
			
			document.getElementById('orbt-fournisseur').disabled = (typeModification!="1");
			document.getElementById('orbt-recFournisseur').disabled = (typeModification!="1");
			
			document.getElementById('orbt-commentaires').disabled = (typeModification=="0");
			document.getElementById('orbt-bEnregistrerRemboursement').disabled = (typeModification=="0");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function orbt_pressOnListeRemboursements() {
	try {
		if (orbt_currentRemboursementId != "") {
			var url="chrome://opensi/content/facturation/user/suivi_reglements_fournisseurs/popup-imputationRemboursement.xul?"+ cookie();
			window.openDialog(url,'','chrome,modal,centerscreen','R',orbt_currentRemboursementId,orbt_initListeRemboursements,false);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function orbt_selectOnListeImputations() {
	try {
		document.getElementById('orbt-bDesaffecter').disabled = !orbt_aImputations.isSelected();
	} catch (e) {
		recup_erreur(e);
	}
}


function orbt_pressOnDesaffecter() {
	try {
		var listeImputations = "";
		
		var rangeCount = orbt_aImputations.getRangeCount();
		for (var i=0; i<rangeCount; i++) {
			var start = {};
			var end = {};
			orbt_aImputations.getRangeAt(i,start,end);

			for (var c=start.value; c<=end.value; c++) {
				listeImputations += orbt_aImputations.getCellText(c, 'orbt-colImputationId') + ";";
				listeImputations += orbt_aImputations.getCellText(c, 'orbt-colType') + ",";
			}
		}
			
		if (!isEmpty(listeImputations) && window.confirm("Voulez-vous désaffecter ces imputations ?")) {
			var qDesaffecter = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/desaffecterImputationReglement.tmpl");
			qDesaffecter.setParam("Remboursement_Id", orbt_currentRemboursementId);
			qDesaffecter.setParam("Liste_Imputations", listeImputations);
			qDesaffecter.execute(orbt_initListeRemboursements);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function orbt_selectFournisseur() {
	try {
		var selected = false;
		var i=0;
		var menulist = document.getElementById('orbt-fournisseur');
		var items = menulist.getElementsByTagName("menuitem");
		while (!selected && i<items.length) {
			if (items[i].getAttribute(orbt_chargerFournisseur!=""?"value":"label").toUpperCase()==(orbt_chargerFournisseur!=""?orbt_chargerFournisseur:orbt_chargerDenominationFournisseur).toUpperCase()) {
				menulist.selectedIndex = i;
				selected = true;
			}
			i++;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function orbt_affecterRemboursements() {
	try {
		document.getElementById('orbt-bAffecterRemb').disabled = true;
		var url="chrome://opensi/content/facturation/user/suivi_reglements_fournisseurs/popup-imputationRemboursement.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen','B','','',false);
		orbt_initListeRemboursements();
	} catch (e) {
		recup_erreur(e);
	}
}


function orbt_nouveauRemboursement() {
	try {
		if (orbt_aRemboursements.isSelected()) {
			orbt_aRemboursements.select(-1);
			orbt_aImputations.deleteTree();
		}
		orbt_currentRemboursementId = "";
		document.getElementById('orbt-bSupprimer').disabled = true;
		document.getElementById('orbt-bSupprimer').collapsed = false;
		document.getElementById('orbt-bAnnuler').collapsed = true;
		//document.getElementById('orbt-bEditerPdf').disabled = true;
		document.getElementById('orbt-dateRemboursement').value = "";
		document.getElementById('orbt-banqueRemise').selectedIndex=0;
		document.getElementById('orbt-motif').selectedIndex=0;
		document.getElementById('orbt-banqueFournisseur').value="";
		orbt_chargerFournisseurs("0","");
		orbt_chargerModesReglements("0");
		document.getElementById('orbt-numPiece').value = "";
		document.getElementById('orbt-montant').value = "";
		document.getElementById('orbt-commentaires').value = "";
		document.getElementById('orbt-dateRemboursement').disabled = false;
		document.getElementById('orbt-banqueRemise').disabled = false;
		document.getElementById('orbt-motif').disabled = false;
		document.getElementById('orbt-fournisseur').disabled = false;
		document.getElementById('orbt-modeReglement').disabled = false;
		document.getElementById('orbt-numPiece').disabled = false;
		document.getElementById('orbt-montant').disabled = false;
		
		
		document.getElementById('orbt-fournisseur').disabled = false;
		document.getElementById('orbt-recFournisseur').disabled = false;
		
		
		
		document.getElementById('orbt-commentaires').disabled = false;
		document.getElementById('orbt-bEnregistrerRemboursement').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function orbt_enregistrerRemboursement() {
	try {
		var dateRemboursement = document.getElementById('orbt-dateRemboursement').value;
		var banqueRemise = document.getElementById('orbt-banqueRemise').value;
		var motif = document.getElementById('orbt-motif').value;
		var fournisseurId = document.getElementById('orbt-fournisseur').value;
		
		//alert(fournisseurId);
		var denomination = (isEmpty(fournisseurId)?document.getElementById('orbt-fournisseur').getAttribute("label"):"");
		//alert(denomination);//OK
		
		var modeReglement = document.getElementById('orbt-modeReglement').value;
		var numPiece = document.getElementById('orbt-numPiece').value;
		var montant = document.getElementById('orbt-montant').value;
		var commentaires = document.getElementById('orbt-commentaires').value;
		var banqueFournisseur = document.getElementById('orbt-banqueFournisseur').value;
		
		if (isEmpty(dateRemboursement) || !isDate(dateRemboursement)) { showWarning("Date incorrecte !"); }
		
		else if (modeReglement=="0") { showWarning("Selectionner un mode réglement"); }
		
		else if (motif=="0") { showWarning("Veuillez choisir un motif !"); }
		else if (fournisseurId=="0") { showWarning("Veuillez choisir un fournisseur !"); }
		else if (isEmpty(montant) || !isPositive(montant)) { showWarning("Montant incorrect !"); }
		else if (commentaires.length>100) { showWarning("Le commentaire ne doit pas dépasser 100 caractères !"); }
		else {
			
			//dateRemboursement = prepareDateJava(dateRemboursement);
			
			var qEnregistrer;
			if (orbt_currentRemboursementId!="") {
				qEnregistrer = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/modifierRemboursement.tmpl");
				qEnregistrer.setParam("Remboursement_Id", orbt_currentRemboursementId);
				//qEnregistrer.setParam("Montant", montant);
			} else {
				qEnregistrer = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/creerRemboursement.tmpl");
			}
			
			qEnregistrer.setParam("Banque_Fournisseur", banqueFournisseur);
			qEnregistrer.setParam("Date_Remboursement", dateRemboursement);
			qEnregistrer.setParam("Banque_Remise", banqueRemise);
			qEnregistrer.setParam("Motif", motif);
			qEnregistrer.setParam("Fournisseur_Id", fournisseurId);
			qEnregistrer.setParam("Denomination", denomination);
			qEnregistrer.setParam("Mode_Reglement", modeReglement);
			qEnregistrer.setParam("Num_Piece", numPiece);
			if (!document.getElementById('orbt-montant').disabled) { qEnregistrer.setParam("Montant", montant); }
			qEnregistrer.setParam("Commentaires", commentaires);
			var result = qEnregistrer.execute();
			var codeErreur = "0";
			if (orbt_currentRemboursementId=="") {
				var remboursementId = result.responseXML.documentElement.getAttribute("Remboursement_Id");
				var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
				if (transfertAuto) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", remboursementId);
					qVerifier.setParam("Type", "ENCAISSEMENT_FOURN"); // vérif unique pour les remboursements et les annulations de remboursements
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Remboursement_Id", remboursementId);
						qTransfertAuto.setParam("Type", "ENCAISSEMENT_FOURN");
						qTransfertAuto.execute();
					}
				}
				
				var url="chrome://opensi/content/facturation/user/suivi_reglements_fournisseurs/popup-imputationRemboursement.xul?"+ cookie();
				window.openDialog(url,'','chrome,modal,centerscreen','R',remboursementId,'',true);
			} else {
				codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
			}
			if (codeErreur=="1") { showWarning("Le remboursement ne peut pas être modifié !"); }
			else if (!document.getElementById('orbt-montant').disabled && codeErreur=="2") { showWarning("Avertissement : le montant du remboursement n'a pas été modifié !"); }
			
			if (codeErreur!="1") { orbt_initListeRemboursements(); }
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_pressOnSupprimer() {
	try {
		if (orbt_currentRemboursementId != "" && window.confirm("Voulez-vous supprimer le remboursement sélectionné ?")) {
			var qSupprimer = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/supprimerRemboursement.tmpl");
			qSupprimer.setParam("Remboursement_Id", orbt_currentRemboursementId);
			var result = qSupprimer.execute();
			
				
			var errors = new Errors(result);
			
			if (errors.hasNext()) {
				errors.show();
			} else {
				orbt_initListeRemboursements();
			}

		}
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_pressOnAnnuler() {
	try {
		if (orbt_currentRemboursementId != "" && window.confirm("Voulez-vous annuler le remboursement sélectionné ?")) {
			var qAnnuler = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/annulerRemboursement.tmpl");
			qAnnuler.setParam("Remboursement_Id", orbt_currentRemboursementId);
			var result = qAnnuler.execute();		
			var codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
			if (codeErreur=="0") {
				var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
				if (transfertAuto) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", orbt_currentRemboursementId);
					qVerifier.setParam("Type", "ENCAISSEMENT_FOURN"); // vérif unique pour les remboursements et les annulations de remboursements
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Remboursement_Id", orbt_currentRemboursementId);
						qTransfertAuto.setParam("Type", "ANNUL_ENCAISSEMENT_FOURN");
						qTransfertAuto.execute();
					}
				}
				showWarning("Le remboursement a été annulé !");
				orbt_initListeRemboursements();
			}
			else { showWarning("Le remboursement ne peut pas être annulé !"); }
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_editerPdf() {
	try {
		if (orbt_currentRemboursementId!="") {
			var url="chrome://opensi/content/facturation/user/suivi_reglements_fournisseurs/popup-adresseRemboursement.xul?"+ cookie();
			window.openDialog(url,'','chrome,modal,centerscreen',orbt_currentRemboursementId,orbt_retourChoixAdresse);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function orbt_retourChoixAdresse(denomination, adresse1, adresse2, adresse3, codePostal, ville, codePays) {
	try {
		var qGenPdf = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/pdfLettreRemboursement.tmpl");
   		qGenPdf.setParam("Remboursement_Id", orbt_currentRemboursementId);
	    qGenPdf.setParam("Denomination", denomination);
	    qGenPdf.setParam("Adresse_1", adresse1);
	    qGenPdf.setParam("Adresse_2", adresse2);
	    qGenPdf.setParam("Adresse_3", adresse3);
	    qGenPdf.setParam("Code_Postal", codePostal);
	    qGenPdf.setParam("Ville", ville);
	    qGenPdf.setParam("Code_Pays", codePays);
	    var result = qGenPdf.execute();
	    var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
		switchPdf(page);
	} catch (e) {
		recup_erreur(e);
	}
}

function orb_pressOnActualiser(){

	try{
		orbt_aBanquesRemise.initTree();
	}
	catch(e){
	recup_erreur(e);	
	}
}	
	

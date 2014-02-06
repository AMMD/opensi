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


var org_aReglements = new Arbre("Facturation/Suivi_Reglements_Fournisseurs/liste-avoirsReglements.tmpl", "org-listeReglements");
var org_aImputations = new Arbre("Facturation/Suivi_Reglements_Fournisseurs/liste-imputationsEcheances.tmpl", "org-listeEcheances");

var org_aFiltreModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'org-filtreModeReglement');

var org_aBanquesRetrait = new Arbre('Config/GetRDF/listeBanques.tmpl', 'org-banqueRetrait');
var org_aFournisseurs = new Arbre('Facturation/Suivi_Reglements_Fournisseurs/combo-fournisseurs.tmpl', 'org-fournisseur');
var org_aBanquesFournisseur = new Arbre('Facturation/GetRDF/liste_banque_fournisseur.tmpl', 'org-banqueFournisseur');
var org_aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'org-modeReglement');
var org_chargerModeReg;
var org_chargerBanqueFournisseur = "";
var org_chargerFournisseur;
var org_chargerDenominationFournisseur;
var org_currentReglementId;
var org_currentType;

var org_nbLignesParPage = 100;
var org_pageCourante = 1;
var org_nbPages = 1;

function org_init() {
  try {
  	document.getElementById('org-etat').value = "N";
  	org_aFiltreModesReglements.initTree(org_initFiltreModeReglement);
	} catch (e) {
  	recup_erreur(e);
	}
}

function org_initFiltreModeReglement() {
	try {
		document.getElementById('org-filtreModeReglement').selectedIndex = 0;
		org_aBanquesRetrait.initTree(org_initBanqueRetrait);
	} catch (e) {
		recup_erreur(e);
	}
}


function org_initBanqueRetrait() {
	try {
    document.getElementById('org-banqueRetrait').selectedIndex = 0;
    org_initListeReglements();
	} catch (e) {
    recup_erreur(e);
  }
}


function org_chargerFournisseurs(selection, denomination) {
	try {
		org_chargerFournisseur = selection;
		org_chargerDenominationFournisseur = denomination;
		org_aFournisseurs.setParam("Fournisseur_Id", selection);
		org_aFournisseurs.setParam("Reglement_Id", org_currentReglementId);
		org_aFournisseurs.setParam("Type", "RG");
    org_aFournisseurs.initTree(org_selectFournisseur);
	} catch (e) {
		recup_erreur(e);
	}
}


function org_chargerBanquesFournisseur() {
	try {
		var fournisseurId = document.getElementById('org-fournisseur').value;
		if (isEmpty(fournisseurId) || fournisseurId=="0") {
			org_aBanquesFournisseur.deleteTree();
			org_initBanqueFournisseur();
		} else {
			org_aBanquesFournisseur.setParam("Fournisseur_Id", fournisseurId);
			org_aBanquesFournisseur.initTree(org_initBanqueFournisseur);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function org_initBanqueFournisseur() {
	try {
		document.getElementById('org-banqueFournisseur').setAttribute("label", org_chargerBanqueFournisseur);
		document.getElementById('org-banqueFournisseur').value = org_chargerBanqueFournisseur;
	} catch (e) {
		recup_erreur(e);
	}
}


function org_chargerModesReglements(selection) {
	try {
		org_chargerModeReg = selection;
		org_aModesReglements.setParam("Selection", org_chargerModeReg);
		org_aModesReglements.initTree(org_initModeReglement);
	} catch (e) {
		recup_erreur(e);
	}
}


function org_initModeReglement() {
	try {

    document.getElementById('org-modeReglement').value=org_chargerModeReg;

	} catch (e) {
    recup_erreur(e);
  }
}


function org_initListeReglements() {
	try {
		
		var fournisseurId = document.getElementById('org-numFournisseur').value;
		var dateDebut = document.getElementById('org-dateDebut').value;
		var dateFin = document.getElementById('org-dateFin').value;
		var etat = document.getElementById('org-etat').value;
		var modeReglement = document.getElementById('org-filtreModeReglement').value;
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("La date de fin doit être supérieure à la date de début !"); }
		else {
		
			org_aReglements.deleteTree();
			org_aImputations.deleteTree();
			document.getElementById('org-bDesaffecter').disabled = true;
			document.getElementById('org-bAffecterRegl').disabled = true;
			
			org_nouveauReglement();
		
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			document.getElementById('org-bEditerPdf').disabled = true;
			document.getElementById('org-listeReglements').disabled = true;
			
			document.getElementById('org-totalReglement').value = "";
			document.getElementById('org-totalRestant').value = "";
			
			org_pageCourante = 1;
			org_nbPages = 1;
			document.getElementById('org-pageDeb').value = 1;
			document.getElementById('org-pageFin').value = 1;
			document.getElementById('org-bPrec').disabled = true;
			document.getElementById('org-bSuiv').disabled = true;
			
			org_aReglements.setParam("Fournisseur_Id", fournisseurId);
			org_aReglements.setParam("Date_Debut", dateDebut);
			org_aReglements.setParam("Date_Fin", dateFin);
			org_aReglements.setParam("Etat", etat);
			org_aReglements.setParam("Mode_Reglement", modeReglement);
			org_aReglements.setParam("Page_Debut", org_pageCourante);
			org_aReglements.setParam("Nb_Lignes_Par_Page", org_nbLignesParPage);
			org_aReglements.initTree(org_initTotaux);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function org_initTotaux() {
	try {
		var fournisseurId = document.getElementById('org-numFournisseur').value;
		var dateDebut = document.getElementById('org-dateDebut').value;
		var dateFin = document.getElementById('org-dateFin').value;
		var etat = document.getElementById('org-etat').value;
		var modeReglement = document.getElementById('org-filtreModeReglement').value;
		
		if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
		if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
		
		var qTotauxPieces = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/getTotauxReglements.tmpl");
		qTotauxPieces.setParam("Fournisseur_Id", fournisseurId);
		qTotauxPieces.setParam("Date_Debut", dateDebut);
		qTotauxPieces.setParam("Date_Fin", dateFin);
		qTotauxPieces.setParam("Etat", etat);
		qTotauxPieces.setParam("Mode_Reglement", modeReglement);
		qTotauxPieces.setParam("Nb_Lignes_Par_Page", org_nbLignesParPage);
		var result = qTotauxPieces.execute();
		
		document.getElementById('org-totalReglement').value = result.responseXML.documentElement.getAttribute("Total_Reglement");
		document.getElementById('org-totalRestant').value = result.responseXML.documentElement.getAttribute("Total_Restant");
		org_nbPages = result.responseXML.documentElement.getAttribute("Nb_Pages");
		
		org_initPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function org_activerListeReglements() {
	try {
		document.getElementById('org-listeReglements').disabled = false;
		document.getElementById('org-bEditerPdf').disabled = (org_aReglements.nbLignes()==0);
		document.getElementById('org-bAffecterRegl').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function org_initPagination() {
	try {
		document.getElementById('org-pageDeb').value = org_pageCourante;
		document.getElementById('org-pageFin').value = (org_nbPages>0?org_nbPages:1);
		document.getElementById('org-bPrec').disabled = (org_pageCourante==1);
		document.getElementById('org-bSuiv').disabled = (org_pageCourante>=org_nbPages); // peut se produire si nbPages=0
		
		org_activerListeReglements();
	} catch (e) {
		recup_erreur(e);
	}
}


function org_pressOnPagePrec() {
	try {
		org_pageCourante--;
		org_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function org_pressOnPageSuiv() {
	try {
		org_pageCourante++;
		org_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function org_majPagination() {
	try {
		document.getElementById('org-listeReglements').disabled = true;
		org_aImputations.deleteTree();
		document.getElementById('org-bDesaffecter').disabled = true;
		
		org_nouveauReglement();

		document.getElementById('org-pageDeb').value = org_pageCourante;
		document.getElementById('org-bPrec').disabled = (org_pageCourante==1);
		document.getElementById('org-bSuiv').disabled = (org_pageCourante==org_nbPages);
		
		org_aReglements.setParam("Page_Debut", org_pageCourante);
		org_aReglements.initTree(org_activerListeReglements);

	} catch (e) {
		recup_erreur(e);
	}
}


function org_reinitialiser() {
	try {
		document.getElementById('org-numFournisseur').value = "";
		document.getElementById('org-dateDebut').value = "";
		document.getElementById('org-dateFin').value = "";
		document.getElementById('org-etat').value = "N";
		document.getElementById('org-filtreModeReglement').selectedIndex = 0;
		
		org_initListeReglements();
	} catch (e) {
		recup_erreur(e);
	}
}


function org_rechercherFournisseur() {
	try {
		var url="chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',org_retourRechercherFournisseur);
	} catch (e) {
		recup_erreur(e);
	}
}


function org_retourRechercherFournisseur(codeFournisseur) {
	try {
  	document.getElementById('org-numFournisseur').value = codeFournisseur;
  	org_initListeReglements();
	} catch (e) {
		recup_erreur(e);
	}
}


function org_ajouterFournisseurListe() {
	try {
		var url="chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',org_retourAjouterFournisseurListe);
	} catch (e) {
		recup_erreur(e);
	}
}


function org_retourAjouterFournisseurListe(codeFournisseur) {
	try {
		org_chargerFournisseurs(codeFournisseur, "");
	} catch (e) {
		recup_erreur(e);
	}
}


function org_onKeyPress(event) {
	try {
		document.getElementById('org-bEditerPdf').disabled = true;
		if (event.keyCode==13) {
			org_initListeReglements();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function org_selectOnListeReglements() {
	try {
		if (org_aReglements.isSelected()) {
			var i = org_aReglements.getCurrentIndex();
			org_currentReglementId = org_aReglements.getCellText(i, 'org-colReglementId');
			org_currentType = org_aReglements.getCellText(i, 'org-colType');
			org_aImputations.setParam("Reglement_Id", org_currentReglementId);
			org_aImputations.setParam("Type", org_currentType);
			org_aImputations.initTree();
			document.getElementById('org-bRegulariser').disabled = (org_aReglements.getCellText(i, 'org-colEtat')=="T");
			
			var typeSuppression = org_aReglements.getCellText(i, 'org-colTypeSuppression');
			// 0 -> aucune interaction possible ; 1 -> suppression possible ; 2 -> annulation possible
			
			document.getElementById('org-bSupprimer').disabled = (org_currentType=="A" || typeSuppression!="1");
			document.getElementById('org-bSupprimer').collapsed = (org_currentType=="A" || typeSuppression=="2");
			document.getElementById('org-bAnnuler').collapsed = (org_currentType=="A" || typeSuppression!="2");
			
			if (org_currentType=="A") {
				org_chargerBanqueFournisseur = "";
				org_chargerModesReglements("0");
				document.getElementById('org-dateReglement').value = "";
				document.getElementById('org-banqueRetrait').value = "";
				org_chargerFournisseurs("0","");
				document.getElementById('org-montant').value = "";
				document.getElementById('org-commentaires').value = "";
				document.getElementById('org-numPiece').value = "";
				document.getElementById('org-dateReglement').disabled = true;
				document.getElementById('org-banqueRetrait').disabled = true;
				document.getElementById('org-fournisseur').disabled = true;
				document.getElementById('org-banqueFournisseur').disabled = true;
				document.getElementById('org-modeReglement').disabled = true;
				document.getElementById('org-numPiece').disabled = true;
				document.getElementById('org-montant').disabled = true;
				document.getElementById('org-fournisseur').disabled = true;
				document.getElementById('org-recFournisseur').disabled = true;
				
				
				document.getElementById('org-commentaires').disabled = true;
				document.getElementById('org-bEnregistrerReglement').disabled = true;
			} else {
				
				org_chargerBanqueFournisseur = org_aReglements.getCellText(i, 'org-colBanqueFournisseur');
				
				var fournisseurId = org_aReglements.getCellText(i, 'org-colFournisseurId');
				var denomination = "";
				
				if (fournisseurId=="") { denomination = org_aReglements.getCellText(i, 'org-colDenomination'); }
				
				org_chargerFournisseurs(fournisseurId, denomination);
				
				org_chargerModesReglements(org_aReglements.getCellText(i, 'org-colModeRegId'));
				
				document.getElementById('org-dateReglement').value = org_aReglements.getCellText(i, 'org-colDateReglement');

				if(org_aReglements.getCellText(i, 'org-colBanqueRetrait_Id') != 0){
				document.getElementById('org-banqueRetrait').value = org_aReglements.getCellText(i, 'org-colBanqueRetrait_Id');
				} else {
					document.getElementById('org-banqueRetrait').value="";
				}
				document.getElementById('org-montant').value = org_aReglements.getCellText(i, 'org-colMontant');

				document.getElementById('org-commentaires').value = org_aReglements.getCellText(i, 'org-colCommentaires');
				document.getElementById('org-numPiece').value = org_aReglements.getCellText(i, 'org-colNumPiece');
				
				var typeModification = org_aReglements.getCellText(i, 'org-colTypeModification');
				// 0 -> aucune interaction possible ; 1 -> modification totale possible ; 2 -> modification possible sauf pour le montant
				
				document.getElementById('org-dateReglement').disabled = (typeModification=="0");
				document.getElementById('org-banqueRetrait').disabled = (typeModification=="0");
				document.getElementById('org-fournisseur').disabled = (typeModification=="0");
				document.getElementById('org-banqueFournisseur').disabled = (typeModification=="0");
				document.getElementById('org-modeReglement').disabled = (typeModification=="0");
				document.getElementById('org-numPiece').disabled = (typeModification=="0");
				
				/*
				document.getElementById('org-montant').disabled = (org_aReglements.getCellText(i,"colRestantImputer")=="0.00");
				document.getElementById('org-fournisseur').disabled = (org_aReglements.getCellText(i,"colRestantImputer")=="0.00");
				document.getElementById('org-recFournisseur').disabled = (org_aReglements.getCellText(i,"colRestantImputer")=="0.00");
				*/
				
				
				document.getElementById('org-montant').disabled = (typeModification!="1");
				document.getElementById('org-fournisseur').disabled = (typeModification!="1");
				document.getElementById('org-recFournisseur').disabled = (typeModification!="1");
				
				document.getElementById('org-commentaires').disabled = (typeModification=="0");
				document.getElementById('org-bEnregistrerReglement').disabled = (typeModification=="0");
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function org_pressOnListeReglements() {
	try {
		if (org_currentReglementId != "") {
			var url="chrome://opensi/content/facturation/user/suivi_reglements_fournisseurs/popup-imputationReglement.xul?"+ cookie();
			window.openDialog(url,'','chrome,modal,centerscreen',org_currentType,org_currentReglementId,org_initListeReglements,false);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function org_selectOnListeImputations() {
	try {
		document.getElementById('org-bDesaffecter').disabled = !org_aImputations.isSelected();
	} catch (e) {
		recup_erreur(e);
	}
}


function org_pressOnDesaffecter() {
	try {
		var listeImputations = "";
		var listeRegularisations = "";
		var listeRemboursements ="";
		
		var rangeCount = org_aImputations.getRangeCount();
		for (var i=0; i<rangeCount; i++) {
			var start = {};
			var end = {};
			org_aImputations.getRangeAt(i,start,end);

			for (var c=start.value; c<=end.value; c++) {
				var type = org_aImputations.getCellText(c, 'org-colTypeImputation');
				var imputationId = org_aImputations.getCellText(c, 'org-colImputationId');
				if (type=='R') { listeRegularisations += imputationId + ",";  }
				else if (type=='RB') { listeRemboursements += imputationId + ",";  }
				else { listeImputations += imputationId  + ","; }
			}
		}
			
		if ((!isEmpty(listeImputations) || !isEmpty(listeRemboursements) ||!isEmpty(listeRegularisations)) && window.confirm("Voulez-vous désaffecter ces imputations ?")) {
			var qDesaffecter = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/desaffecterImputationEcheance.tmpl");
			qDesaffecter.setParam("Reglement_Id", org_currentReglementId);
			qDesaffecter.setParam("Type", org_currentType);
			qDesaffecter.setParam("Liste_Imputations", listeImputations);
			qDesaffecter.setParam("Liste_Remboursements", listeRemboursements);
			qDesaffecter.setParam("Liste_Regularisations", listeRegularisations);
			var result = qDesaffecter.execute();
			if (!isEmpty(listeRegularisations)) {
				var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
				
				if (transfertAuto) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", listeRegularisations);
					qVerifier.setParam("Type", type=='R'?"REGUL_REGLEMENT_FOURN":"REGUL_AVOIR_FOURN"); // vérif unique
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Liste_Regularisations", listeRegularisations);
						qTransfertAuto.setParam("Type", type=='R'?"ANNUL_REGUL_REGL_FOURN":"ANNUL_REGUL_AVOIR_FOURN");
						qTransfertAuto.execute();
					}
				}
			}
			
			org_initListeReglements();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function org_selectFournisseur() {
	try {
		var selected = false;
		var i=0;
		var menulist = document.getElementById('org-fournisseur');
		var items = menulist.getElementsByTagName("menuitem");
		while (!selected && i<items.length) {
			if (items[i].getAttribute(org_chargerFournisseur!=""?"value":"label").toUpperCase()==(org_chargerFournisseur!=""?org_chargerFournisseur:org_chargerDenominationFournisseur).toUpperCase()) {
				menulist.selectedIndex = i;
				selected = true;
			}
			i++;
		}
		
		org_chargerBanquesFournisseur();
	} catch (e) {
		recup_erreur(e);
	}
}


function org_affecterReglements() {
	try {
		document.getElementById('org-bAffecterRegl').disabled = true;
		var url="chrome://opensi/content/facturation/user/suivi_reglements_fournisseurs/popup-imputationReglement.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen','B','','',false);
		org_initListeReglements();
	} catch (e) {
		recup_erreur(e);
	}
}


function org_pressOnRegulariser() {
	try {
		var message = "Voulez-vous solder " + (org_currentType=="R"?"ce règlement":"cet avoir") + " en perte et profit ?";
		if (window.confirm(message)) {
			var qRegulariser = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/regulariserReglementAvoir.tmpl");
			qRegulariser.setParam("Reglement_Id", org_currentReglementId);
			qRegulariser.setParam("Type", org_currentType);
			var result = qRegulariser.execute();
			var regularisationId = result.responseXML.documentElement.getAttribute("Regularisation_Id");
			var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
			if (transfertAuto) {
				var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
				qVerifier.setParam("Liste_Id", regularisationId);
				qVerifier.setParam("Type", org_currentType=="R"?"REGUL_REGLEMENT_FOURN":"REGUL_AVOIR_FOURN"); // vérif unique
				result = qVerifier.execute();
				var errors = new Errors(result);
				if (errors.hasNext()) {
					errors.show();
				} else {
					var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
					qTransfertAuto.setParam("Regularisation_Id", regularisationId);
					qTransfertAuto.setParam("Type", org_currentType=="R"?"REGUL_REGL_FOURN":"REGUL_AVOIR_FOURN");
					qTransfertAuto.execute();
				}
			}
			
			org_initListeReglements();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function org_pressOnSolderRestantDu() {
	try {
		
		var url="chrome://opensi/content/facturation/user/suivi_reglements_fournisseurs/popup-solderReglements.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',org_initListeReglements);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function org_nouveauReglement() {
	try {
		if (org_aReglements.isSelected()) {
			org_aReglements.select(-1);
			org_aImputations.deleteTree();
		}
		document.getElementById('org-bRegulariser').disabled = true;
		document.getElementById('org-bSupprimer').disabled = true;
		document.getElementById('org-bSupprimer').collapsed = false;
		document.getElementById('org-bAnnuler').collapsed = true;
		org_currentReglementId = "";
		org_currentType = "";
		
		org_chargerBanqueFournisseur = "";
		document.getElementById('org-dateReglement').value = "";
		document.getElementById('org-banqueRetrait').selectedIndex=0;
		org_aBanquesFournisseur.deleteTree();
		org_chargerFournisseurs("0","");
		org_chargerModesReglements("0");
		document.getElementById('org-numPiece').value = "";
		document.getElementById('org-montant').value = "";
		document.getElementById('org-commentaires').value = "";
		document.getElementById('org-dateReglement').disabled = false;
		document.getElementById('org-banqueRetrait').disabled = false;
		document.getElementById('org-fournisseur').disabled = false;
		document.getElementById('org-banqueFournisseur').disabled = false;
		document.getElementById('org-modeReglement').disabled = false;
		document.getElementById('org-numPiece').disabled = false;
		document.getElementById('org-montant').disabled = false;
		
		document.getElementById('org-fournisseur').disabled = false;
		document.getElementById('org-recFournisseur').disabled = false;
		
		document.getElementById('org-commentaires').disabled = false;
		document.getElementById('org-bEnregistrerReglement').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function org_enregistrerReglement() {
	try {
		var dateReglement = document.getElementById('org-dateReglement').value;
		var banqueRetrait = document.getElementById('org-banqueRetrait').value;
		var fournisseurId = document.getElementById('org-fournisseur').value;
		var denomination = (isEmpty(fournisseurId)?document.getElementById('org-fournisseur').getAttribute("label"):"");
		var banqueFournisseur = document.getElementById('org-banqueFournisseur').value;
		var modeReglement = document.getElementById('org-modeReglement').value;
		var numPiece = document.getElementById('org-numPiece').value;
		var montant = document.getElementById('org-montant').value;
		var commentaires = document.getElementById('org-commentaires').value;
		
		if (isEmpty(dateReglement) || !isDate(dateReglement)) { showWarning("Date incorrecte !"); }
		else if (fournisseurId=="0") { showWarning("Veuillez choisir un fournisseur !"); }
		else if (modeReglement=="0") { showWarning("Veuillez choisir un mode de règlement !"); }
		else if (isEmpty(montant) || !isPositive(montant)) { showWarning("Montant incorrect !"); }
		else if (commentaires.length>100) { showWarning("Le commentaire ne doit pas dépasser 100 caractères !"); }
		else if (banqueFournisseur.length>30) { showWarning("La banque fournisseur ne doit pas dépasser 30 caractères !"); }
		else if (banqueRetrait=="") { showWarning("Veuillez choisir une banque de retrait"); }
		else {
			
			var qEnregistrer;
			if (org_currentReglementId!="" && org_currentType=="R") {
				qEnregistrer = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/modifierReglement.tmpl");
				qEnregistrer.setParam("Reglement_Id", org_currentReglementId);
			} else {
				qEnregistrer = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/creerReglement.tmpl");
			}
			qEnregistrer.setParam("Date_Reglement", dateReglement);
			qEnregistrer.setParam("Banque_Retrait", banqueRetrait);
			qEnregistrer.setParam("Fournisseur_Id", fournisseurId);
			qEnregistrer.setParam("Denomination", denomination);
			qEnregistrer.setParam("Banque_Fournisseur", banqueFournisseur);
			qEnregistrer.setParam("Mode_Reglement", modeReglement);
			qEnregistrer.setParam("Num_Piece", numPiece);
			if (!document.getElementById('org-montant').disabled) { qEnregistrer.setParam("Montant", montant); }
			qEnregistrer.setParam("Commentaires", commentaires);
			
			var result = qEnregistrer.execute();
			var codeErreur = "0";
			if (org_currentReglementId=="" || org_currentType!="R") {
				var reglementId = result.responseXML.documentElement.getAttribute("Reglement_Id");
				var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
				if (transfertAuto) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", reglementId);
					qVerifier.setParam("Type", "REGLEMENT_FOURN");
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {

						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Reglement_Id", reglementId);
						qTransfertAuto.setParam("Type", "REGLEMENT_FOURN");
						qTransfertAuto.execute();
					}
				}
				
				var url="chrome://opensi/content/facturation/user/suivi_reglements_fournisseurs/popup-imputationReglement.xul?"+ cookie();
				window.openDialog(url,'','chrome,modal,centerscreen','R',reglementId,'',true);
			} else {
				codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
			}
			if (codeErreur=="1") { showWarning("Le règlement ne peut pas être modifié !"); }
			else if (!document.getElementById('org-montant').disabled && codeErreur=="2") { showWarning("Avertissement : le montant du règlement n'a pas été modifié !"); }
			
			if (codeErreur!="1") { org_initListeReglements(); }
			orbt_nouveauRemboursement();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_pressOnSupprimer() {
	try {
		if (org_currentReglementId != "" && window.confirm("Voulez-vous supprimer le règlement sélectionné ?")) {
			var qSupprimer = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/supprimerReglement.tmpl");
			qSupprimer.setParam("Reglement_Id", org_currentReglementId);
			var result = qSupprimer.execute();
			var codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
			orbt_nouveauRemboursement();
			if (codeErreur=="0") {
				showWarning("Le règlement a été supprimé !");
				org_initListeReglements();
			}
			else { showWarning("Le règlement ne peut pas être supprimé !"); }
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function org_pressOnAnnuler() {
	try {
		if (org_currentReglementId != "" && window.confirm("Voulez-vous annuler le règlement sélectionné ?")) {
			var qAnnuler = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/annulerReglement.tmpl");
			qAnnuler.setParam("Reglement_Id", org_currentReglementId);
			var result = qAnnuler.execute();
			var codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
			if (codeErreur=="0") {
				var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
				if (transfertAuto) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", org_currentReglementId);
					qVerifier.setParam("Type", "REGLEMENT_FOURN"); // vérif unique pour les encaissements et les annulations d'encaissements
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Reglement_Id", org_currentReglementId);
						qTransfertAuto.setParam("Type", "ANNUL_REGLEMENT_FOURN");
						qTransfertAuto.execute();
					}
				}
				showWarning("Le règlement a été annulé !");
				orbt_nouveauRemboursement();
				org_initListeReglements();
			}
			else { showWarning("Le règlement ne peut pas être annulé !"); }
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function org_editerPdf() {
	try {
		document.getElementById('chkDetailReg').checked = false;
		document.getElementById('triReglements').value = "Date";
		document.getElementById('chkSousTotauxReg').checked = true;
		org_rafraichirPdf();
	} catch (e) {
		recup_erreur(e);
	}
}


function org_rafraichirPdf() {
	try {
		var fournisseurId = document.getElementById('org-numFournisseur').value;
		var dateDebut = document.getElementById('org-dateDebut').value;
		var dateFin = document.getElementById('org-dateFin').value;
		var etat = document.getElementById('org-etat').value;
		var modeReglement = document.getElementById('org-filtreModeReglement').value;
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("La date de fin doit être supérieure à la date de début !"); }
		else {
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			var detail = document.getElementById('chkDetailReg').checked;
			var triReglements = document.getElementById('triReglements').value;
			var sousTotaux = document.getElementById('chkSousTotauxReg').checked;
			
			var qGenPdf = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/pdfListeReglements.tmpl");
			qGenPdf.setParam("Etat", etat);
      qGenPdf.setParam("Date_Debut", dateDebut);
      qGenPdf.setParam("Date_Fin", dateFin);
      qGenPdf.setParam("Mode_Reglement", modeReglement);
      qGenPdf.setParam("Fournisseur_Id", fournisseurId);
      qGenPdf.setParam("Detail", detail);
      qGenPdf.setParam("Tri", triReglements);
      qGenPdf.setParam("Sous_Totaux", sousTotaux);
      var result = qGenPdf.execute();
      var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
			switchPdf(page);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


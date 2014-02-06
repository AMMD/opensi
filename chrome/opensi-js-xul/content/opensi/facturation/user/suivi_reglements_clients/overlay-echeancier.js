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


var oe_aPieces = new Arbre("Facturation/Suivi_Reglements_Clients/liste-pieces.tmpl", "oe-listePieces");
var oe_aEcheances = new Arbre("Facturation/Suivi_Reglements_Clients/liste-echeances.tmpl", "oe-listeEcheances");

var oe_aEcheancesFact = new Arbre("Facturation/Suivi_Reglements_Clients/liste-echeancesFact.tmpl", "oe-listeEcheancesFact");
var oe_aReglements = new Arbre("Facturation/Suivi_Reglements_Clients/liste-reglementsEcheance.tmpl", "oe-listeReglements");

var oe_aFiltreModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'oe-filtreModeReglement');
var oe_aBanquesRemise = new Arbre('Config/GetRDF/listeBanques.tmpl', 'oe-banqueRemise');
var oe_aClients = new Arbre('Facturation/Suivi_Reglements_Clients/combo-clients.tmpl', 'oe-client');
var oe_aBanquesClient = new Arbre('Facturation/GetRDF/liste_banque_client.tmpl', 'oe-banqueClient');
var oe_aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'oe-modeReglement');
var oe_chargerModeReg;

var oe_chargerClient;
var oe_chargerDenominationClient;
var oe_currentEcheanceId;

var oe_nbLignesParPage = 100;
var oe_pageCourante = 1;
var oe_nbPages = 1;


function oe_init() {
  try {
    
  	document.getElementById('oe-etat').value = "N";
  	oe_aFiltreModesReglements.initTree(oe_initFiltreModeReglement);
  	
	} catch (e) {
  	recup_erreur(e);
	}
}


function oe_initFiltreModeReglement() {
	try {
    document.getElementById('oe-filtreModeReglement').selectedIndex = 0;
    oe_aBanquesRemise.initTree(oe_initBanqueRemise);
	} catch (e) {
    recup_erreur(e);
  }
}


function oe_initBanqueRemise() {
	try {
    document.getElementById('oe-banqueRemise').selectedIndex = 0;
    oe_initListeHaut();
	} catch (e) {
    recup_erreur(e);
  }
}


function oe_chargerClients(selection, denomination) {
	try {
		oe_chargerClient = selection;
		oe_chargerDenominationClient = denomination;
		oe_aClients.setParam("Client_Id", oe_chargerClient);
		oe_aClients.setParam("Echeance_Id", oe_currentEcheanceId);
		oe_aClients.setParam("Type", "EC");
    oe_aClients.initTree(oe_selectClient);
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_chargerBanquesClient() {
	try {
		var clientId = document.getElementById('oe-client').value;
		if (isEmpty(clientId) || clientId=="0") {
			oe_aBanquesClient.deleteTree();
			oe_initBanqueClient();
		} else {
			oe_aBanquesClient.setParam("Client_Id", clientId);
			oe_aBanquesClient.initTree(oe_initBanqueClient);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_initBanqueClient() {
	try {
		document.getElementById('oe-banqueClient').setAttribute("label", "");
		document.getElementById('oe-banqueClient').value = "";
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_chargerModesReglements(selection) {
	try {
		oe_chargerModeReg = selection;
		oe_aModesReglements.setParam("Selection", oe_chargerModeReg);
		oe_aModesReglements.initTree(oe_initModeReglement);
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_initModeReglement() {
	try {

    document.getElementById('oe-modeReglement').value=oe_chargerModeReg;

	} catch (e) {
    recup_erreur(e);
  }
}


function oe_initListeHaut() {
	try {
		
		var etat = document.getElementById('oe-etat').value;
		var dateDebut = document.getElementById('oe-dateDebut').value;
		var dateFin = document.getElementById('oe-dateFin').value;
		var modeReglement = document.getElementById('oe-filtreModeReglement').value;
		var clientId = document.getElementById('oe-numClient').value;
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("La date de fin doit être supérieure à la date de début !"); }
		else {
		
			oe_currentEcheanceId = "";
			document.getElementById('oe-bDesaffecter').disabled = true;
			document.getElementById('oe-dateReglement').value = "";
			document.getElementById('oe-echeanceRemise').value = "";
			document.getElementById('oe-banqueRemise').selectedIndex=0;
			oe_aBanquesClient.deleteTree();
			oe_chargerClients("0","");
			oe_chargerModesReglements("0");
			document.getElementById('oe-numPiece').value = "";
			document.getElementById('oe-montant').value = "";
			document.getElementById('oe-commentaires').value = "";
			
			var modeTraitement = document.getElementById('oe-modeTraitement').value;
			if (modeTraitement=="F") {
				oe_aPieces.deleteTree();
				oe_aEcheancesFact.deleteTree();
			} else {
				oe_aEcheances.deleteTree();
				oe_aReglements.deleteTree();
			}
			
			document.getElementById('oe-editerPdf').disabled = true;
			document.getElementById('oe-listePieces').collapsed=(modeTraitement!="F");
			document.getElementById('oe-grpEcheances').collapsed=(modeTraitement!="F");
			document.getElementById('oe-listeEcheances').collapsed=(modeTraitement=="F");
			document.getElementById('oe-bRegulariser').collapsed=(modeTraitement=="F");
			document.getElementById('oe-bSolderEcheances').collapsed=(modeTraitement=="F");
			document.getElementById('oe-grpReglements').collapsed=(modeTraitement=="F");

			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			document.getElementById('oe-totalDu').value = "";
			document.getElementById('oe-totalRestantDu').value = "";
			
			oe_pageCourante = 1;
			oe_nbPages = 1;
			document.getElementById('oe-pageDeb').value = 1;
			document.getElementById('oe-pageFin').value = 1;
			document.getElementById('oe-bPrec').disabled = true;
			document.getElementById('oe-bSuiv').disabled = true;
		
			if (modeTraitement=="F") {
				document.getElementById('oe-listePieces').disabled = true;
				document.getElementById('oe-bRegulariserFact').disabled = true;
				
				oe_aPieces.setParam("Etat", etat);
				oe_aPieces.setParam("Date_Debut", dateDebut);
				oe_aPieces.setParam("Date_Fin", dateFin);
				oe_aPieces.setParam("Mode_Reglement", modeReglement);
				oe_aPieces.setParam("Client_Id", clientId);
				oe_aPieces.setParam("Page_Debut", oe_pageCourante);
				oe_aPieces.setParam("Nb_Lignes_Par_Page", oe_nbLignesParPage);
				oe_aPieces.initTree(oe_initTotaux);
			} else {
				document.getElementById('oe-listeEcheances').disabled = true;
				document.getElementById('oe-bRegulariser').disabled = true;
				
				oe_aEcheances.setParam("Etat", etat);
				oe_aEcheances.setParam("Date_Debut", dateDebut);
				oe_aEcheances.setParam("Date_Fin", dateFin);
				oe_aEcheances.setParam("Mode_Reglement", modeReglement);
				oe_aEcheances.setParam("Client_Id", clientId);
				oe_aEcheances.setParam("Page_Debut", oe_pageCourante);
				oe_aEcheances.setParam("Nb_Lignes_Par_Page", oe_nbLignesParPage);
				oe_aEcheances.initTree(oe_initTotaux);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_initTotaux() {
	try {
		var modeTraitement = document.getElementById('oe-modeTraitement').value;
		var etat = document.getElementById('oe-etat').value;
		var dateDebut = document.getElementById('oe-dateDebut').value;
		var dateFin = document.getElementById('oe-dateFin').value;
		var modeReglement = document.getElementById('oe-filtreModeReglement').value;
		var clientId = document.getElementById('oe-numClient').value;
		
		if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
		if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
		
		var qTotaux;
		if (modeTraitement=="F") {
			qTotaux = new QueryHttp("Facturation/Suivi_Reglements_Clients/getTotauxPieces.tmpl");
		} else {
			qTotaux = new QueryHttp("Facturation/Suivi_Reglements_Clients/getTotauxEcheances.tmpl");
		}
		qTotaux.setParam("Etat", etat);
		qTotaux.setParam("Date_Debut", dateDebut);
		qTotaux.setParam("Date_Fin", dateFin);
		qTotaux.setParam("Mode_Reglement", modeReglement);
		qTotaux.setParam("Client_Id", clientId);
		qTotaux.setParam("Nb_Lignes_Par_Page", oe_nbLignesParPage);
		var result = qTotaux.execute();
		

		
		document.getElementById('oe-totalDu').value = result.responseXML.documentElement.getAttribute("Total_Du");
		document.getElementById('oe-totalRestantDu').value = result.responseXML.documentElement.getAttribute("Total_Restant_Du");
		oe_nbPages = result.responseXML.documentElement.getAttribute("Nb_Pages");

		oe_initPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_activerListeHaut() {
	try {
		var modeTraitement = document.getElementById('oe-modeTraitement').value;
		if (modeTraitement=="F") {
			document.getElementById('oe-listePieces').disabled = false;
			document.getElementById('oe-editerPdf').disabled = (oe_aPieces.nbLignes()==0);
		}
		else {
			document.getElementById('oe-listeEcheances').disabled = false;
			document.getElementById('oe-editerPdf').disabled = (oe_aEcheances.nbLignes()==0);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_initPagination() {
	try {
		document.getElementById('oe-pageDeb').value = oe_pageCourante;
		document.getElementById('oe-pageFin').value = (oe_nbPages>0?oe_nbPages:1);
		document.getElementById('oe-bPrec').disabled = (oe_pageCourante==1);
		document.getElementById('oe-bSuiv').disabled = (oe_pageCourante>=oe_nbPages); // peut se produire si nbPages=0
		
		oe_activerListeHaut();
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_pressOnPagePrec() {
	try {
		oe_pageCourante--;
		oe_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_pressOnPageSuiv() {
	try {
		oe_pageCourante++;
		oe_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_majPagination() {
	try {
		oe_currentEcheanceId = "";
		document.getElementById('oe-bDesaffecter').disabled = true;
		
		var modeTraitement = document.getElementById('oe-modeTraitement').value;
		if (modeTraitement=="F") {
			document.getElementById('oe-listePieces').disabled = true;
			document.getElementById('oe-bRegulariserFact').disabled = true;
			oe_aEcheancesFact.deleteTree();
		} else {
			document.getElementById('oe-listeEcheances').disabled = true;
			document.getElementById('oe-bRegulariser').disabled = true;
			oe_aReglements.deleteTree();
		}
		document.getElementById('oe-dateReglement').value = "";
		document.getElementById('oe-echeanceRemise').value = "";
		document.getElementById('oe-banqueRemise').selectedIndex=0;
		oe_aBanquesClient.deleteTree();
		oe_initBanqueClient();
		oe_chargerClients("0","");
		oe_chargerModesReglements("0");
		document.getElementById('oe-numPiece').value = "";
		document.getElementById('oe-montant').value = "";
		document.getElementById('oe-commentaires').value = "";
		
		
		document.getElementById('oe-pageDeb').value = oe_pageCourante;
		document.getElementById('oe-bPrec').disabled = (oe_pageCourante==1);
		document.getElementById('oe-bSuiv').disabled = (oe_pageCourante==oe_nbPages);
		
		if (modeTraitement=="F") {
			oe_aPieces.setParam("Page_Debut", oe_pageCourante);
			oe_aPieces.initTree(oe_activerListeHaut);
		} else {
			oe_aEcheances.setParam("Page_Debut", oe_pageCourante);
			oe_aEcheances.initTree(oe_activerListeHaut);
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function oe_reinitialiser() {
	try {
		document.getElementById('oe-modeTraitement').value = "F";
		document.getElementById('oe-etat').value = "N";
		document.getElementById('oe-dateDebut').value = "";
		document.getElementById('oe-dateFin').value = "";
		document.getElementById('oe-filtreModeReglement').selectedIndex = 0;
		document.getElementById('oe-numClient').value = "";
		
		oe_initListeHaut();
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_rechercherClient() {
	try {
		var url="chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',oe_retourRechercherClient);
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('oe-numClient').value = codeClient;
  	oe_initListeHaut();
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_ajouterClientListe() {
	try {
		var url="chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',oe_retourAjouterClientListe);
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_retourAjouterClientListe(codeClient) {
	try {
		oe_chargerClients(codeClient, "");
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_onKeyPress(event) {
	try {
		document.getElementById('oe-editerPdf').disabled = true;
		if (event.keyCode==13) {
			oe_initListeHaut();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_editerPdf() {
	try {
		document.getElementById('chkDetailEch').checked = false;
		document.getElementById('triEcheances').value = "Date";
		document.getElementById('chkSousTotauxEch').checked = true;
		oe_rafraichirPdf();
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_rafraichirPdf() {
	try {
		var etat = document.getElementById('oe-etat').value;
		var dateDebut = document.getElementById('oe-dateDebut').value;
		var dateFin = document.getElementById('oe-dateFin').value;
		var modeReglement = document.getElementById('oe-filtreModeReglement').value;
		var clientId = document.getElementById('oe-numClient').value;
		var modeTraitement = document.getElementById('oe-modeTraitement').value;
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("La date de fin doit être supérieure à la date de début !"); }
		else {
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			var detail = document.getElementById('chkDetailEch').checked;
			var triEcheances = document.getElementById('triEcheances').value;
			var sousTotaux = document.getElementById('chkSousTotauxEch').checked;
			
			var qGenPdf = new QueryHttp("Facturation/Suivi_Reglements_Clients/pdfListePieces.tmpl");
			qGenPdf.setParam("Type", modeTraitement);
      qGenPdf.setParam("Etat", etat);
      qGenPdf.setParam("Date_Debut", dateDebut);
      qGenPdf.setParam("Date_Fin", dateFin);
      qGenPdf.setParam("Mode_Reglement", modeReglement);
      qGenPdf.setParam("Client_Id", clientId);
      qGenPdf.setParam("Detail", detail);
      qGenPdf.setParam("Tri", triEcheances);
      qGenPdf.setParam("Sous_Totaux", sousTotaux);
      var result = qGenPdf.execute();
      var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
			switchPdf(page);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_selectOnListePieces() {
	try {
		if (oe_aPieces.isSelected()) {
			document.getElementById('oe-listeEcheancesFact').disabled = true;
			var i = oe_aPieces.getCurrentIndex();
			var pieceId = oe_aPieces.getCellText(i, 'oe-colPieceId');
			var typePiece = oe_aPieces.getCellText(i, 'oe-colTypePiece');
			oe_aEcheancesFact.setParam("Piece_Id", pieceId);
			oe_aEcheancesFact.setParam("Type_Piece", typePiece);
			oe_aEcheancesFact.initTree(oe_selectPremiereEcheance);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_selectPremiereEcheance() {
	try {
		document.getElementById('oe-listeEcheancesFact').disabled = false;
		if (oe_aEcheancesFact.nbLignes()>0) {
			oe_aEcheancesFact.select(0);
			oe_selectOnListeEcheancesFact();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_selectOnListeEcheancesFact() {
	try {
		if (oe_aEcheancesFact.isSelected()) {
			var i = oe_aEcheancesFact.getCurrentIndex();
			oe_currentEcheanceId = oe_aEcheancesFact.getCellText(i, 'oe-colEcheanceIdFact');
			
			var clientId = oe_aEcheancesFact.getCellText(i, 'oe-colClientIdFact');
			var denomination = "";
			if (clientId=="") { denomination = oe_aEcheancesFact.getCellText(i, 'oe-colDenominationFact'); }
			
			oe_chargerClients(clientId, denomination);
			oe_chargerModesReglements(oe_aEcheancesFact.getCellText(i, 'oe-colModeRegIdFact'));

			document.getElementById('oe-dateReglement').value = get_cookie('Today');
			document.getElementById('oe-echeanceRemise').value = "";
			document.getElementById('oe-banqueRemise').value = oe_aEcheancesFact.getCellText(i, 'oe-colBanqueRemiseFact');
			document.getElementById('oe-numPiece').value = "";
			document.getElementById('oe-montant').value = oe_aEcheancesFact.getCellText(i, 'oe-colMontantFact');
			document.getElementById('oe-commentaires').value = oe_aEcheancesFact.getCellText(i, 'oe-colCommentairesFact');
			document.getElementById('oe-bRegulariserFact').disabled = (oe_aEcheancesFact.getCellText(i, 'oe-colEtatFact')=="T");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_selectClient() {
	try {
		var selected = false;
		var i=0;
		var menulist = document.getElementById('oe-client');
		var items = menulist.getElementsByTagName("menuitem");
		while (!selected && i<items.length) {
			if (items[i].getAttribute(oe_chargerClient!=""?"value":"label").toUpperCase()==(oe_chargerClient!=""?oe_chargerClient:oe_chargerDenominationClient).toUpperCase()) {
				menulist.selectedIndex = i;
				selected = true;
			}
			i++;
		}
		
		oe_chargerBanquesClient();
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_pressOnListeEcheancesFact() {
	try {
		if (oe_currentEcheanceId != "") {
			var url="chrome://opensi/content/facturation/user/suivi_reglements_clients/popup-modifierEcheance.xul?"+ cookie() +"&Echeance_Id="+ oe_currentEcheanceId;
			window.openDialog(url,'','chrome,modal,centerscreen',oe_selectOnListePieces);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_pressOnRegulariserFact() {
	try {
		if (oe_currentEcheanceId) {
			if (window.confirm("Voulez-vous solder cette échéance en perte et profit ?")) {
				var qRegulariser = new QueryHttp("Facturation/Suivi_Reglements_Clients/regulariserEcheanceClient.tmpl");
				qRegulariser.setParam("Echeance_Id", oe_currentEcheanceId);
				var result = qRegulariser.execute();
				
				var regularisationId = result.responseXML.documentElement.getAttribute("Regularisation_Id");
				var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
				if (transfertAuto) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", regularisationId);
					qVerifier.setParam("Type", "REGUL_ECHEANCE");
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Regularisation_Id", regularisationId);
						qTransfertAuto.setParam("Type", "REGUL_ECHEANCE");
						qTransfertAuto.execute();
					}
				}
				oe_initListeHaut();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_selectOnListeEcheances() {
	try {
		if (oe_aEcheances.isSelected()) {
			var i = oe_aEcheances.getCurrentIndex();
			oe_currentEcheanceId = oe_aEcheances.getCellText(i, 'oe-colEcheanceId');
			
			var clientId = oe_aEcheances.getCellText(i, 'oe-colClientId');
			var denomination = "";
			if (clientId=="") { denomination = oe_aEcheances.getCellText(i, 'oe-colDenomination'); }
			
			oe_chargerClients(clientId, denomination);
			oe_chargerModesReglements(oe_aEcheances.getCellText(i, 'oe-colModeRegId'));
			
			document.getElementById('oe-dateReglement').value = get_cookie('Today');
			document.getElementById('oe-echeanceRemise').value = "";
			document.getElementById('oe-banqueRemise').value = oe_aEcheances.getCellText(i, 'oe-colBanqueRemise');
			document.getElementById('oe-numPiece').value = "";
			document.getElementById('oe-montant').value = oe_aEcheances.getCellText(i, 'oe-colMontant');
			document.getElementById('oe-commentaires').value = oe_aEcheances.getCellText(i, 'oe-colCommentaires');
			document.getElementById('oe-bRegulariser').disabled = (oe_aEcheances.getCellText(i, 'oe-colEtat')=="T");
			
			oe_aReglements.setParam("Echeance_Id", oe_currentEcheanceId);
			oe_aReglements.initTree();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_pressOnListeEcheances() {
	try {
		if (oe_currentEcheanceId != "") {
			var url="chrome://opensi/content/facturation/user/suivi_reglements_clients/popup-modifierEcheance.xul?"+ cookie() +"&Echeance_Id="+ oe_currentEcheanceId;
			window.openDialog(url,'','chrome,modal,centerscreen',oe_initListeHaut);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_selectOnListeReglements() {
	try {
		document.getElementById('oe-bDesaffecter').disabled = !oe_aReglements.isSelected();
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_pressOnDesaffecter() {
	try {
		var listeImputations = "";
		var listeRegularisations = "";
		
		var rangeCount = oe_aReglements.getRangeCount();
		for (var i=0; i<rangeCount; i++) {
			var start = {};
			var end = {};
			oe_aReglements.getRangeAt(i,start,end);

			for (var c=start.value; c<=end.value; c++) {
				var type = oe_aReglements.getCellText(c, 'oe-colTypeImputation');
				var imputationId = oe_aReglements.getCellText(c, 'oe-colImputationId');
				if (type=='RR') { listeRegularisations += imputationId + ",";  }
				else { listeImputations += imputationId  + ","; }
			}
		}
		
		if ((!isEmpty(listeImputations) || !isEmpty(listeRegularisations)) && window.confirm("Voulez-vous désaffecter ces imputations ?")) {
			var qDesaffecter = new QueryHttp("Facturation/Suivi_Reglements_Clients/desaffecterReglementEcheance.tmpl");
			qDesaffecter.setParam("Echeance_Id", oe_currentEcheanceId);
			qDesaffecter.setParam("Liste_Imputations", listeImputations);
			qDesaffecter.setParam("Liste_Regularisations", listeRegularisations);
			var result = qDesaffecter.execute();
			if (!isEmpty(listeRegularisations)) {
				var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
				
				if (transfertAuto) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", listeRegularisations);
					qVerifier.setParam("Type", "REGUL_ECHEANCE"); // vérif unique
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Liste_Regularisations", listeRegularisations);
						qTransfertAuto.setParam("Type", "ANNUL_REGUL_ECHEANCE");
						qTransfertAuto.execute();
					}
				}
			}
			
			oe_initListeHaut();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_pressOnRegulariser() {
	try {
		if (oe_currentEcheanceId != "") {
			if (window.confirm("Voulez-vous solder cette échéance en perte et profit ?")) {
				var qRegulariser = new QueryHttp("Facturation/Suivi_Reglements_Clients/regulariserEcheanceClient.tmpl");
				qRegulariser.setParam("Echeance_Id", oe_currentEcheanceId);
				var result = qRegulariser.execute();
				
				var regularisationId = result.responseXML.documentElement.getAttribute("Regularisation_Id");
				var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
				if (transfertAuto) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", regularisationId);
					qVerifier.setParam("Type", "REGUL_ECHEANCE");
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Regularisation_Id", regularisationId);
						qTransfertAuto.setParam("Type", "REGUL_ECHEANCE");
						qTransfertAuto.execute();
					}
				}
				
				oe_initListeHaut();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_pressOnSolderRestantDu() {
	try {
		
		var url="chrome://opensi/content/facturation/user/suivi_reglements_clients/popup-solderEcheances.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',oe_initListeHaut);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oe_enregistrerReglement() {
	try {
		var dateReglement = document.getElementById('oe-dateReglement').value;
		var echeanceRemise = document.getElementById('oe-echeanceRemise').value;
		var banqueRemise = document.getElementById('oe-banqueRemise').value;
		var clientId = document.getElementById('oe-client').value;
		var denomination = (isEmpty(clientId)?document.getElementById('oe-client').getAttribute("label"):"");
		var banqueClient = document.getElementById('oe-banqueClient').value;
		var modeReglement = document.getElementById('oe-modeReglement').value;
		var numPiece = document.getElementById('oe-numPiece').value;
		var montant = document.getElementById('oe-montant').value;
		var commentaires = document.getElementById('oe-commentaires').value;
		
		if (isEmpty(dateReglement) || !isDate(dateReglement)) { showWarning("Date incorrecte !"); }
		else if (!isEmpty(echeanceRemise) && !isDate(echeanceRemise)) { showWarning("Date d'échéance de remise incorrecte !"); }
		else if (clientId=="0") { showWarning("Veuillez choisir un client !"); }
		else if (banqueClient.length>30) { showWarning("La banque client ne doit pas dépasser 30 caractères !"); }
		else if (modeReglement=="0") { showWarning("Veuillez choisir un mode de règlement !"); }
		else if (isEmpty(montant) || !isPositive(montant)) { showWarning("Montant incorrect !"); }
		else if (commentaires.length>100) { showWarning("Le commentaire ne doit pas dépasser 100 caractères !"); }
		else {
			document.getElementById('oe-bEnregistrerReglement').disabled = true;
			
			dateReglement = prepareDateJava(dateReglement);
			if (!isEmpty(echeanceRemise)) { echeanceRemise = prepareDateJava(echeanceRemise); }
			
			var qEnregistrer = new QueryHttp("Facturation/Suivi_Reglements_Clients/creerReglement.tmpl");
			qEnregistrer.setParam("Date_Reglement", dateReglement);
			qEnregistrer.setParam("Echeance_Remise", echeanceRemise);
			qEnregistrer.setParam("Banque_Remise", banqueRemise);
			qEnregistrer.setParam("Client_Id", clientId);
			qEnregistrer.setParam("Denomination", denomination);
			qEnregistrer.setParam("Banque_Client", banqueClient);
			qEnregistrer.setParam("Mode_Reglement", modeReglement);
			qEnregistrer.setParam("Num_Piece", numPiece);
			qEnregistrer.setParam("Montant", montant);
			qEnregistrer.setParam("Commentaires", commentaires);
			var result = qEnregistrer.execute();
			var reglementId = result.responseXML.documentElement.getAttribute("Reglement_Id");
			
			var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
			if (transfertAuto) {
				var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
				qVerifier.setParam("Liste_Id", reglementId);
				qVerifier.setParam("Type", "ENCAISSEMENT");
				result = qVerifier.execute();
				var errors = new Errors(result);
				if (errors.hasNext()) {
					errors.show();
				} else {
					var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
					qTransfertAuto.setParam("Reglement_Id", reglementId);
					qTransfertAuto.setParam("Type", "ENCAISSEMENT");
					qTransfertAuto.execute();
				}
			}
			
			var url="chrome://opensi/content/facturation/user/suivi_reglements_clients/popup-imputationReglement.xul?"+ cookie();
			window.openDialog(url,'','chrome,modal,centerscreen','R',reglementId,'',true);
			
			oe_initListeHaut();
			orbt_nouveauRemboursement();
			document.getElementById('oe-bEnregistrerReglement').disabled = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}

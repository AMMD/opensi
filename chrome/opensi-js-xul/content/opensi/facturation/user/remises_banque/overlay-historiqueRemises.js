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

var ohr_aBanques = new Arbre("ComboListe/combo-banques.tmpl", "ohr-comboBanques");
var ohr_aTypeReg = new Arbre("Facturation/GetRDF/liste-typesReglement.tmpl", "ohr-comboTypeReg");
var ohr_aRemises = new Arbre("Facturation/Remises_Banque/liste-historiqueRemises.tmpl", "ohr-listeRemises");
var ohr_aDetailReglements = new Arbre("Facturation/Remises_Banque/liste-historiqueReglements.tmpl", "ohr-listeReglements");
var ohr_aDetailEspeces = new Arbre("Facturation/Remises_Banque/liste-historiqueEspeces.tmpl", "ohr-listeReglementsEspeces");

var ohr_nbLignesParPage = 100;
var ohr_pageCourante = 1;
var ohr_nbPages = 1;


function ohr_init() {
	try {
		
		document.getElementById('ohr-bAnnulerRemise').disabled = true;
		document.getElementById('ohr-bReediterBordereau').disabled = true;
		
		document.getElementById('ohr-boxDetails').collapsed=true;
		document.getElementById('ohr-listeReglements').collapsed=true;
		document.getElementById('ohr-listeReglementsEspeces').collapsed=true;
		ohr_aBanques.initTree(ohr_initBanque);
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_initBanque() {
	try {
		document.getElementById('ohr-comboBanques').selectedIndex = 0;
		ohr_aTypeReg.initTree(ohr_initTypeReg);
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_initTypeReg() {
	try {

		document.getElementById('ohr-comboTypeReg').selectedIndex = 0;
		ohr_initPagination();

	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_rechercherClient() {
	try {
		var url="chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',ohr_retourRechercherClient);
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('ohr-numClient').value = codeClient;
  	ohr_listerReglements();
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_rechercherFournisseur() {
	try {
		var url="chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',ohr_retourRechercherFournisseur);
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_retourRechercherFournisseur(codeFournisseur) {
	try {
  	document.getElementById('ohr-numFournisseur').value = codeFournisseur;
  	ohr_listerReglements();
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			ohr_listerReglements();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_reinitialiser() {
	try {
		ohr_aRemises.deleteTree();
		document.getElementById('ohr-boxDetails').collapsed=true;
		document.getElementById('ohr-listeReglements').collapsed=true;
		document.getElementById('ohr-listeReglementsEspeces').collapsed=true;
		ohr_aDetailReglements.deleteTree();
		ohr_aDetailEspeces.deleteTree();
		
		document.getElementById('ohr-bAnnulerRemise').disabled = true;
		document.getElementById('ohr-bReediterBordereau').disabled = true;
		
		document.getElementById('ohr-comboTypeReg').selectedIndex=0;
		document.getElementById('ohr-comboBanques').selectedIndex=0;
		document.getElementById('ohr-numClient').value="";
		document.getElementById('ohr-numFournisseur').value="";
		document.getElementById('ohr-numRemise').value="";
		document.getElementById('ohr-dateDebutReg').value="";
		document.getElementById('ohr-dateFinReg').value="";
		document.getElementById('ohr-dateDebutRemise').value="";
		document.getElementById('ohr-dateFinRemise').value="";
		
		ohr_pageCourante = 1;
		ohr_nbPages = 1;
		ohr_initPagination();

	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_listerReglements() {
	try {
		
		var typeReg = document.getElementById('ohr-comboTypeReg').value;
		var banque = document.getElementById('ohr-comboBanques').value;
		var clientId = document.getElementById('ohr-numClient').value;
		var fournisseurId = document.getElementById('ohr-numFournisseur').value;
		var numRemise = document.getElementById('ohr-numRemise').value;
		var dateDebutReg = document.getElementById('ohr-dateDebutReg').value;
		var dateFinReg = document.getElementById('ohr-dateFinReg').value;
		var dateDebutRemise = document.getElementById('ohr-dateDebutRemise').value;
		var dateFinRemise = document.getElementById('ohr-dateFinRemise').value;
		
		if (!isEmpty(dateDebutReg) && !isDate(dateDebutReg)) { showWarning("Date de début de règlement incorrecte !"); }
		else if (!isEmpty(dateFinReg) && !isDate(dateFinReg)) { showWarning("Date de fin de règlement incorrecte !"); }
		else if (!isEmpty(dateDebutReg) && !isEmpty(dateFinReg) && !isDateInterval(dateDebutReg, dateFinReg)) { showWarning("L'intervalle des dates de règlement est incorrect !"); }
		else if (!isEmpty(dateDebutRemise) && !isDate(dateDebutRemise)) { showWarning("Date de début de remise incorrecte !"); }
		else if (!isEmpty(dateFinRemise) && !isDate(dateFinRemise)) { showWarning("Date de fin de remise incorrecte !"); }
		else if (!isEmpty(dateDebutRemise) && !isEmpty(dateFinRemise) && !isDateInterval(dateDebutRemise, dateFinRemise)) { showWarning("L'intervalle des dates de remises est incorrect !"); }
		else {
			
			ohr_aRemises.deleteTree();
			document.getElementById('ohr-boxDetails').collapsed=true;
			document.getElementById('ohr-listeReglements').collapsed=true;
			document.getElementById('ohr-listeReglementsEspeces').collapsed=true;
			ohr_aDetailReglements.deleteTree();
			ohr_aDetailEspeces.deleteTree();
			document.getElementById('ohr-listeRemises').disabled = true;
			document.getElementById('ohr-bAnnulerRemise').disabled = true;
			document.getElementById('ohr-bReediterBordereau').disabled = true;
			
			if (!isEmpty(dateDebutReg)) { dateDebutReg = prepareDateJava(dateDebutReg); }
			if (!isEmpty(dateFinReg)) { dateFinReg = prepareDateJava(dateFinReg); }
			if (!isEmpty(dateDebutRemise)) { dateDebutRemise = prepareDateJava(dateDebutRemise); }
			if (!isEmpty(dateFinRemise)) { dateFinRemise = prepareDateJava(dateFinRemise); }
			
			ohr_pageCourante = 1;
			ohr_nbPages = 1;
			document.getElementById('ohr-pageDeb').value = 1;
			document.getElementById('ohr-pageFin').value = 1;
			document.getElementById('ohr-bPrec').disabled = true;
			document.getElementById('ohr-bSuiv').disabled = true;
			
			ohr_aRemises.setParam("Type_Reg", typeReg);
			ohr_aRemises.setParam("Banque", banque);
			ohr_aRemises.setParam("Client_Id", clientId);
			ohr_aRemises.setParam("Fournisseur_Id", fournisseurId);
			ohr_aRemises.setParam("Num_Remise", numRemise);
			ohr_aRemises.setParam("Date_Debut_Reg", dateDebutReg);
			ohr_aRemises.setParam("Date_Fin_Reg", dateFinReg);
			ohr_aRemises.setParam("Date_Debut_Remise", dateDebutRemise);
			ohr_aRemises.setParam("Date_Fin_Remise", dateFinRemise);
			ohr_aRemises.setParam("Page_Debut", ohr_pageCourante);
			ohr_aRemises.setParam("Nb_Lignes_Par_Page", ohr_nbLignesParPage);
			ohr_aRemises.initTree(ohr_initTotaux);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_initTotaux() {
	try {
		var typeReg = document.getElementById('ohr-comboTypeReg').value;
		var banque = document.getElementById('ohr-comboBanques').value;
		var clientId = document.getElementById('ohr-numClient').value;
		var fournisseurId = document.getElementById('ohr-numFournisseur').value;
		var numRemise = document.getElementById('ohr-numRemise').value;
		var dateDebutReg = document.getElementById('ohr-dateDebutReg').value;
		var dateFinReg = document.getElementById('ohr-dateFinReg').value;
		var dateDebutRemise = document.getElementById('ohr-dateDebutRemise').value;
		var dateFinRemise = document.getElementById('ohr-dateFinRemise').value;
		
		if (!isEmpty(dateDebutReg)) { dateDebutReg = prepareDateJava(dateDebutReg); }
		if (!isEmpty(dateFinReg)) { dateFinReg = prepareDateJava(dateFinReg); }
		if (!isEmpty(dateDebutRemise)) { dateDebutRemise = prepareDateJava(dateDebutRemise); }
		if (!isEmpty(dateFinRemise)) { dateFinRemise = prepareDateJava(dateFinRemise); }
		
		var ohr_qGetNbPages = new QueryHttp("Facturation/Remises_Banque/getNbPagesHistRemises.tmpl");
		ohr_qGetNbPages.setParam("Type_Reg", typeReg);
		ohr_qGetNbPages.setParam("Banque", banque);
		ohr_qGetNbPages.setParam("Client_Id", clientId);
		ohr_qGetNbPages.setParam("Fournisseur_Id", fournisseurId);
		ohr_qGetNbPages.setParam("Num_Remise", numRemise);
		ohr_qGetNbPages.setParam("Date_Debut_Reg", dateDebutReg);
		ohr_qGetNbPages.setParam("Date_Fin_Reg", dateFinReg);
		ohr_qGetNbPages.setParam("Date_Debut_Remise", dateDebutRemise);
		ohr_qGetNbPages.setParam("Date_Fin_Remise", dateFinRemise);
		ohr_qGetNbPages.setParam("Nb_Lignes_Par_Page", ohr_nbLignesParPage);
		var result = ohr_qGetNbPages.execute();
		ohr_nbPages = result.responseXML.documentElement.getAttribute("Nb_Pages");
		
		ohr_initPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_activerListeRemises() {
	try {
		document.getElementById('ohr-listeRemises').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_initPagination() {
	try {
		document.getElementById('ohr-pageDeb').value = ohr_pageCourante;
		document.getElementById('ohr-pageFin').value = (ohr_nbPages>0?ohr_nbPages:1);
		document.getElementById('ohr-bPrec').disabled = (ohr_pageCourante==1);
		document.getElementById('ohr-bSuiv').disabled = (ohr_pageCourante>=ohr_nbPages); // peut se produire si nbPages=0
		
		ohr_activerListeRemises();
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_pressOnPagePrec() {
	try {
		ohr_pageCourante--;
		ohr_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_pressOnPageSuiv() {
	try {
		ohr_pageCourante++;
		ohr_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_majPagination() {
	try {
		document.getElementById('ohr-pageDeb').value = ohr_pageCourante;
		document.getElementById('ohr-bPrec').disabled = (ohr_pageCourante==1);
		document.getElementById('ohr-bSuiv').disabled = (ohr_pageCourante==ohr_nbPages);
		
		document.getElementById('ohr-listeRemises').disabled = true;
		document.getElementById('ohr-bAnnulerRemise').disabled = true;
		document.getElementById('ohr-bReediterBordereau').disabled = true;
		
		document.getElementById('ohr-boxDetails').collapsed=true;
		document.getElementById('ohr-listeReglements').collapsed=true;
		document.getElementById('ohr-listeReglementsEspeces').collapsed=true;
		ohr_aDetailReglements.deleteTree();
		ohr_aDetailEspeces.deleteTree();
		
		ohr_aRemises.setParam("Page_Debut", ohr_pageCourante);
		ohr_aRemises.initTree(ohr_activerListeRemises);

	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_selectOnListeRemises() {
	try {
		if (ohr_aRemises.isSelected()) {
			var i = ohr_aRemises.getCurrentIndex();
			var remiseId = ohr_aRemises.getCellText(i, 'ohr-colRemiseId');
			var especes = (ohr_aRemises.getCellText(i, 'ohr-colEspeces')=="1");
			var annulationPossible = (ohr_aRemises.getCellText(i, 'ohr-colEtat')=="V");
			
			document.getElementById('ohr-bAnnulerRemise').disabled = !annulationPossible;
			document.getElementById('ohr-bReediterBordereau').disabled = false;
			
			document.getElementById('ohr-boxDetails').collapsed=false;
			document.getElementById('ohr-listeReglements').collapsed = especes;
			document.getElementById('ohr-listeReglementsEspeces').collapsed = !especes;
			
			if (especes) {
				ohr_aDetailEspeces.setParam("Remise_Id", remiseId);
				ohr_aDetailEspeces.initTree();
			} else {
				ohr_aDetailReglements.setParam("Remise_Id", remiseId);
				ohr_aDetailReglements.initTree();
			}

		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_annulerRemise() {
	try {
		if (window.confirm("Voulez-vous annuler la remise en banque sélectionnée ?")) {
			var i = ohr_aRemises.getCurrentIndex();
			var remiseId = ohr_aRemises.getCellText(i, 'ohr-colRemiseId');
			var especes = (ohr_aRemises.getCellText(i, 'ohr-colEspeces')=="1");
			
			var qAnnulerRemise = new QueryHttp("Facturation/Remises_Banque/annulerRemise.tmpl");
			qAnnulerRemise.setParam("Remise_Id", remiseId);
			var result = qAnnulerRemise.execute();
			var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
			if (transfertAuto) {
				var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
				qVerifier.setParam("Liste_Id", remiseId);
				qVerifier.setParam("Type", especes?"REMISE_ESP":"REMISE_REGL"); // vérif unique
				result = qVerifier.execute();
				var errors = new Errors(result);
				if (errors.hasNext()) {
					errors.show();
				} else {
					var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
					qTransfertAuto.setParam("Remise_Id", remiseId);
					qTransfertAuto.setParam("Type", especes?"ANNUL_REMISE_ESP":"ANNUL_REMISE_REGL");
					qTransfertAuto.execute();
				}
			}
			
			ohr_listerReglements();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ohr_reediterRemise() {
	try {
		
		if (ohr_aRemises.isSelected()) {
			var i = ohr_aRemises.getCurrentIndex();
			var remiseId = ohr_aRemises.getCellText(i, 'ohr-colRemiseId');
			var especes = (ohr_aRemises.getCellText(i, 'ohr-colEspeces')=="1");
			
			var qGenPdf = new QueryHttp("Facturation/Remises_Banque/pdfRemise.tmpl");
			if (especes) { qGenPdf.setParam('Especes','true'); }
			qGenPdf.setParam('Remise_Id', remiseId);
			var result = qGenPdf.execute();
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
			switchPdf(page);
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


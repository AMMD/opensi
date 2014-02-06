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


var oarnf_aReglements = new Arbre("Facturation/Suivi_Reglements_Clients/liste-acomptesRecusNonFactures.tmpl", "oarnf-listeReglements");
var oarnf_aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'oarnf-filtreModeReglement');
var oarnf_qTotaux = new QueryHttp("Facturation/Suivi_Reglements_Clients/getTotauxAcomptesRecusNonFactures.tmpl");

var oarnf_currentReglementId;

var oarnf_nbLignesParPage = 100;
var oarnf_pageCourante = 1;
var oarnf_nbPages = 1;


function oarnf_init() {
  try {
    
  	oarnf_aModesReglements.initTree(oarnf_initFiltreModeReglement);
  	
	} catch (e) {
  	recup_erreur(e);
	}
}


function oarnf_initFiltreModeReglement() {
  try {
    
  	document.getElementById('oarnf-filtreModeReglement').selectedIndex=0;
  	oarnf_initListeReglements();
  	
	} catch (e) {
  	recup_erreur(e);
	}
}


function oarnf_initListeReglements() {
	try {
		
		var dateDebut = document.getElementById('oarnf-dateDebut').value;
		var dateFin = document.getElementById('oarnf-dateFin').value;
		var modeReglement = document.getElementById('oarnf-filtreModeReglement').value;
		var clientId = document.getElementById('oarnf-numClient').value;
		var chkAffecter = (document.getElementById('oarnf-chkAffecter').checked?"1":"0");
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("La date de fin doit être supérieure à la date de début !"); }
		else {
		
			oarnf_currentReglementId = "";
			oarnf_aReglements.deleteTree();
			document.getElementById('oarnf-bChangerReglement').disabled = true;
			document.getElementById('oarnf-bChangerCommande').disabled = true;
		
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			document.getElementById('oarnf-totalReglement').value = "";
			document.getElementById('oarnf-totalRestant').value = "";
			
			oarnf_pageCourante = 1;
			oarnf_nbPages = 1;
			document.getElementById('oarnf-pageDeb').value = 1;
			document.getElementById('oarnf-pageFin').value = 1;
			document.getElementById('oarnf-bPrec').disabled = true;
			document.getElementById('oarnf-bSuiv').disabled = true;

			document.getElementById('oarnf-listeReglements').disabled = true;

			oarnf_aReglements.setParam("Date_Debut", dateDebut);
			oarnf_aReglements.setParam("Date_Fin", dateFin);
			oarnf_aReglements.setParam("Mode_Reglement", modeReglement);
			oarnf_aReglements.setParam("Client_Id", clientId);
			oarnf_aReglements.setParam("Affecter", chkAffecter);
			oarnf_aReglements.setParam("Page_Debut", oarnf_pageCourante);
			oarnf_aReglements.setParam("Nb_Lignes_Par_Page", oarnf_nbLignesParPage);
			
			oarnf_qTotaux.setParam("Date_Debut", dateDebut);
			oarnf_qTotaux.setParam("Date_Fin", dateFin);
			oarnf_qTotaux.setParam("Mode_Reglement", modeReglement);
			oarnf_qTotaux.setParam("Client_Id", clientId);
			oarnf_qTotaux.setParam("Affecter", chkAffecter);
			oarnf_qTotaux.setParam("Nb_Lignes_Par_Page", oarnf_nbLignesParPage);
			
			oarnf_aReglements.initTree(oarnf_initTotaux);

		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_initTotaux() {
	try {

		var result = oarnf_qTotaux.execute();
		
		document.getElementById('oarnf-totalReglement').value = result.responseXML.documentElement.getAttribute("Total_Reglement");
		document.getElementById('oarnf-totalRestant').value = result.responseXML.documentElement.getAttribute("Total_Restant");
		oarnf_nbPages = result.responseXML.documentElement.getAttribute("Nb_Pages");

		oarnf_initPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_activerListeHaut() {
	try {
		document.getElementById('oarnf-listeReglements').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_initPagination() {
	try {
		document.getElementById('oarnf-pageDeb').value = oarnf_pageCourante;
		document.getElementById('oarnf-pageFin').value = (oarnf_nbPages>0?oarnf_nbPages:1);
		document.getElementById('oarnf-bPrec').disabled = (oarnf_pageCourante==1);
		document.getElementById('oarnf-bSuiv').disabled = (oarnf_pageCourante>=oarnf_nbPages); // peut se produire si nbPages=0
		
		oarnf_activerListeHaut();
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_pressOnPagePrec() {
	try {
		oarnf_pageCourante--;
		oarnf_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_pressOnPageSuiv() {
	try {
		oarnf_pageCourante++;
		oarnf_majPagination();
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_majPagination() {
	try {
		oarnf_currentReglementId = "";
		oarnf_aReglements.deleteTree();
		document.getElementById('oarnf-bChangerReglement').disabled = true;
		document.getElementById('oarnf-bChangerCommande').disabled = true;
		document.getElementById('oarnf-listeReglements').disabled = true;

		document.getElementById('oarnf-pageDeb').value = oarnf_pageCourante;
		document.getElementById('oarnf-bPrec').disabled = (oarnf_pageCourante==1);
		document.getElementById('oarnf-bSuiv').disabled = (oarnf_pageCourante==oarnf_nbPages);
		
		oarnf_aReglements.setParam("Page_Debut", oarnf_pageCourante);
		oarnf_aReglements.initTree(oarnf_activerListeHaut);

	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_reinitialiser() {
	try {
		document.getElementById('oarnf-dateDebut').value = "";
		document.getElementById('oarnf-dateFin').value = "";
		document.getElementById('oarnf-filtreModeReglement').selectedIndex = 0;
		document.getElementById('oarnf-numClient').value = "";
		document.getElementById('oarnf-chkAffecter').checked = false;
		
		oarnf_initListeReglements();
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_rechercherClient() {
	try {
		var url="chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=false";
		window.openDialog(url,'','chrome,modal,centerscreen',oarnf_retourRechercherClient);
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('oarnf-numClient').value = codeClient;
  	oarnf_initListeReglements();
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			oarnf_initListeReglements();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_selectOnListeReglements() {
	try {
		if (oarnf_aReglements.isSelected()) {
			var nbSelection = oarnf_aReglements.nbSelection();
			var i = oarnf_aReglements.getCurrentIndex();
			var surplus = false;
			oarnf_currentReglementId = "";
			
			if (nbSelection>0) {
				var checkSurplus = true;
				surplus = true;
				var rangeCount = oarnf_aReglements.getRangeCount();
				for (var j=0; j<rangeCount; j++) {
					var start = {};
					var end = {};
					oarnf_aReglements.getRangeAt(j,start,end);
					
					for (var c=start.value; c<=end.value; c++) {
						if (!isEmpty(oarnf_currentReglementId)) { oarnf_currentReglementId += ",";  }
						oarnf_currentReglementId += oarnf_aReglements.getCellText(c, 'oarnf-colReglementId');
						
						if (checkSurplus && oarnf_aReglements.getCellText(c, 'oarnf-colSurplus')=="0") {
							surplus = false;
							checkSurplus = false;
						}
					}
				}
			} 
			
			document.getElementById('oarnf-bChangerReglement').disabled = (nbSelection==0 || !surplus);
			document.getElementById('oarnf-bChangerCommande').disabled = (nbSelection!=1 || !surplus);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_pressOnChangerReglement() {
	try {
		if (window.confirm("Voulez-vous déplacer ce règlement dans l'onglet Règlements ?")) {
			var qChangerReglement = new QueryHttp("Facturation/Suivi_Reglements_Clients/changerStatutReglementAnticipe.tmpl");
			qChangerReglement.setParam("Reglement_Id", oarnf_currentReglementId);
			var result = qChangerReglement.execute();
			if (result.responseXML.documentElement.getAttribute("codeErreur")=="0") { oarnf_retourDesaffecter(); }
			else { showWarning("Erreur : votre sélection ne doit comporter que des règlements en surplus !"); } 
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_pressOnChangerCommande() {
	try {
		var url="chrome://opensi/content/facturation/user/suivi_reglements_clients/popup-changerCommandeReglAnticipe.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',oarnf_currentReglementId,oarnf_retourDesaffecter);
	} catch (e) {
		recup_erreur(e);
	}
}


function oarnf_retourDesaffecter() {
	try {
		oarnf_initListeReglements();
		orbt_initListeRemboursements();
	} catch (e) {
		recup_erreur(e);
	}
}



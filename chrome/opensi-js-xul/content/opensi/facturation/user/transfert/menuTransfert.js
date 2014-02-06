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

jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var transfertEnc;
var formatExport;
var nomFichierDefaut;


function init() {
	try {
		var qParam = new QueryHttp("Config/comptabilite/preferences/getPreferences.tmpl");
		var result = qParam.execute();
		transfertEnc = (result.responseXML.documentElement.getAttribute("Transfert_Enc")!="0");
		document.getElementById('tabTransfertEnc').collapsed = !transfertEnc;
		document.getElementById('tabTransfertEnc').disabled = !transfertEnc;
		
		otv_init();
		ota_init();
		if (transfertEnc) { ote_init(); }
		otr_init();
	} catch (e) {
		recup_erreur(e);
	}
}


function testcheck(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		if (cks.item(1).getAttribute("label")=="non") {
			if (cks.item(0).getAttribute("checked")=="false") {
				cks.item(0).setAttribute("checked","true");
			} else {
				cks.item(0).setAttribute("checked","false");
			}
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function toutCocher(id, b) {
	try {

		var listbox = document.getElementById(id);
		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;

			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				if (cks.item(1).getAttribute("label")=="non") {
					cks.item(0).setAttribute("checked", b);
				}
				i++;
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function affecterCompte(listitem, indexTiers, indexTypeTiers) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		var typeTiers = cks.item(indexTypeTiers).getAttribute("label");
		if (typeTiers=="C") { affecterCompteClient(listitem, indexTiers); }
		else { affecterCompteFournisseur(listitem, indexTiers); }
	} catch (e) {
    recup_erreur(e);
  }
}


function affecterCompteClient(listitem, index) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		var clientId = cks.item(index).getAttribute("label");
		if (!isEmpty(clientId)) {
			var url = "chrome://opensi/content/facturation/user/clients/popup-modifierCompteClient.xul?"+ cookie() +"&Client_Id="+ urlEncode(clientId);
			window.openDialog(url,'','chrome,modal,centerscreen',reinitialiserListesClients);
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function reinitialiserListesClients() {
	try {
		otv_actualiserSelection();
		if (transfertEnc) { ote_actualiserSelection(); }
		otr_actualiserSelection();
	} catch (e) {
		recup_erreur(e);
	}
}


function affecterCompteFournisseur(listitem, index) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		var fournisseurId = cks.item(index).getAttribute("label");
		if (!isEmpty(fournisseurId)) {
			var url = "chrome://opensi/content/facturation/user/fournisseurs/popup-modifierCompteFournisseur.xul?"+ cookie() +"&Fournisseur_Id="+ urlEncode(fournisseurId);
			window.openDialog(url,'','chrome,modal,centerscreen',reinitialiserListesFournisseurs);
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function reinitialiserListesFournisseurs() {
	try {
		ota_actualiserSelection();
		if (transfertEnc) { ote_actualiserSelection(); }
		otr_actualiserSelection();
	} catch (e) {
		recup_erreur(e);
	}
}



function checkErreurs(listeId, typeListe, typeVerif) {
	try {
		var ok = true;
		if (!isEmpty(listeId)) {
			var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
			qVerifier.setParam("Liste_Id", listeId);
			qVerifier.setParam("Type", typeListe);
			qVerifier.setParam("Type_Verif", typeVerif);
			var result = qVerifier.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				ok = false;
				errors.show();
			}
		}
		return ok;
	} catch (e) {
		recup_erreur(e);
	}
}


function getCodeExport(exportId) {
	try {
		var qCodeExport = new QueryHttp("Facturation/Transfert/getCodeExport.tmpl");
		qCodeExport.setParam('Export_Id', exportId);
		var result = qCodeExport.execute();
		return result.responseXML.documentElement.getAttribute('Code_Export');
	} catch (e) {
		recup_erreur(e);
	}
}


function checkNomFichierExport(formatExport) {
	try {
		nomFichierDefaut = "";
		var codeExport = getCodeExport(formatExport);
		
		if (codeExport=="CADOR") {
			var url="chrome://opensi/content/facturation/user/transfert/popup-exportCador.xul?"+ cookie();
			window.openDialog(url,'','chrome,modal,centerscreen',retourExportCador);
		} else {
			nomFichierDefaut = "export_ecritures.txt";
		}
		
		return !isEmpty(nomFichierDefaut);
	} catch (e) {
		recup_erreur(e);
	}
}


function retourExportCador(nomFichier) {
	try {
		nomFichierDefaut = nomFichier;
	} catch (e) {
		recup_erreur(e);
	}
}


function telechargerFichier(fichier, nomFichier) {
	try {
		var file = fileChooser("save", nomFichier);
		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function retourMenuPrincipal() {
	try {

		window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
		recup_erreur(e);
	}
}

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


jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");

var aBanquesRemise = new Arbre('Config/GetRDF/listeBanques.tmpl', 'banqueRemise');
var aBanquesClient = new Arbre('Facturation/GetRDF/liste_banque_client.tmpl', 'banqueClient');
var aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'modeReglement');


var commandeId;
var clientId;
var denomination;

var chargerModeReg;


function init() {
  try {
		commandeId = ParamValeur("Commande_Id");
		chargerModeReg = ParamValeur("Mode_Reg_Id");
		clientId = ParamValeur("Client_Id");
		denomination = (isEmpty(clientId)?ParamValeur("Denomination"):"");
		
		aBanquesRemise.initTree(initBanqueRemise);
  } catch (e) {
    recup_erreur(e);
  }
}


function initBanqueRemise() {
	try {
    document.getElementById('banqueRemise').selectedIndex = 0;
    if (chargerModeReg!="0") { aModesReglements.setParam("Selection", chargerModeReg); }
		aModesReglements.initTree(initModeReglement);
	} catch (e) {
    recup_erreur(e);
  }
}


function initModeReglement() {
	try {

    document.getElementById('modeReglement').value = chargerModeReg;
    chargerBanquesClient();

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerBanquesClient() {
	try {
		if (clientId!="") {
			aBanquesClient.setParam("Client_Id", clientId);
			aBanquesClient.initTree(initBanqueClient);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function initBanqueClient() {
	try {
		document.getElementById('banqueClient').setAttribute("label", "");
		document.getElementById('banqueClient').value = "";
	} catch (e) {
		recup_erreur(e);
	}
}


function valider() {
	try {
		var dateReglement = document.getElementById('dateReglement').value;
		var echeanceRemise = document.getElementById('echeanceRemise').value;
		var banqueRemise = document.getElementById('banqueRemise').value;
		var banqueClient = document.getElementById('banqueClient').value;
		var modeReglement = document.getElementById('modeReglement').value;
		var numPiece = document.getElementById('numPiece').value;
		var montant = document.getElementById('montant').value;
		var commentaires = document.getElementById('commentaires').value;
		
		if (isEmpty(dateReglement) || !isDate(dateReglement)) { showWarning("Date incorrecte !"); }
		else if (!isEmpty(echeanceRemise) && !isDate(echeanceRemise)) { showWarning("Date d'échéance de remise incorrecte !"); }
		else if (banqueClient.length>30) { showWarning("La banque client ne doit pas dépasser 30 caractères !"); }
		else if (modeReglement=="0") { showWarning("Veuillez choisir un mode de règlement !"); }
		else if (isEmpty(montant) || !isPositive(montant)) { showWarning("Montant incorrect !"); }
		else if (commentaires.length>100) { showWarning("Le commentaire ne doit pas dépasser 100 caractères !"); }
		else {
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
			qEnregistrer.setParam("Commande_Id", commandeId);
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
			
      
			window.arguments[0]();
			window.close();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


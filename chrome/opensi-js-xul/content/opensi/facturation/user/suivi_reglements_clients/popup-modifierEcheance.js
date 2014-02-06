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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");

var echeanceId;
var chargerModeReg;

var aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'modeReglement');


function init() {
  try {
  	window.resizeTo(400,300);
  	echeanceId = ParamValeur("Echeance_Id");

  	var qEcheance = new QueryHttp("Facturation/Suivi_Reglements_Clients/getEcheanceClient.tmpl");
  	qEcheance.setParam("Echeance_Id", echeanceId);
		var result = qEcheance.execute();
		document.getElementById('lblAncienneDateEch').value = result.responseXML.documentElement.getAttribute("Date_Echeance");
		document.getElementById('nouvelleDateEch').value = result.responseXML.documentElement.getAttribute("Date_Echeance");
		document.getElementById('lblAncienModeReg').value = result.responseXML.documentElement.getAttribute("Lbl_Mode_Reg");
		chargerModesReglements(result.responseXML.documentElement.getAttribute("Mode_Reg_Id"));
		document.getElementById('commentaires').value = result.responseXML.documentElement.getAttribute("Commentaires");
  } catch (e) {
    recup_erreur(e);
  }
}


function chargerModesReglements(selection) {
	try {
		chargerModeReg = selection;
		aModesReglements.setParam("Selection", chargerModeReg);
		aModesReglements.initTree(initModeReglement);
	} catch (e) {
		recup_erreur(e);
	}
}


function initModeReglement() {
	try {

    document.getElementById('modeReglement').value=chargerModeReg;

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrer() {
	try {
		var dateEcheance = document.getElementById('nouvelleDateEch').value;
		var modeReglement = document.getElementById('modeReglement').value;
		var commentaires = document.getElementById('commentaires').value;
		
		if (isEmpty(dateEcheance) || !isDate(dateEcheance)) { showWarning("Date incorrecte !"); }
		else if (modeReglement=="0") { showWarning("Veuillez choisir un mode de règlement !"); }
		else if (commentaires.length>100) { showWarning("Le commentaire ne doit pas dépasser 100 caractères !"); }
		else {
			dateEcheance = prepareDateJava(dateEcheance);
			var qModifierEcheance = new QueryHttp("Facturation/Suivi_Reglements_Clients/modifierEcheanceClient.tmpl");
			qModifierEcheance.setParam("Echeance_Id", echeanceId);
			qModifierEcheance.setParam("Date_Echeance", dateEcheance);
			qModifierEcheance.setParam("Mode_Reglement", modeReglement);
			qModifierEcheance.setParam("Commentaires", commentaires);
			qModifierEcheance.execute();
			
			window.arguments[0]();
			window.close();
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


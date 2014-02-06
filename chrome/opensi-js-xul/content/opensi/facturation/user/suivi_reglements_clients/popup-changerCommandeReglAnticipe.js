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

var reglementId;

var aNumCommandes = new Arbre('Facturation/Suivi_Reglements_Clients/combo-commandesAffectablesRegl.tmpl', 'numCommande');


function init() {
  try {
  	window.resizeTo(400,200);
  	reglementId = window.arguments[0];

  	var qNumCommande = new QueryHttp("Facturation/Suivi_Reglements_Clients/getNumCommandeRegl.tmpl");
  	qNumCommande.setParam("Reglement_Id", reglementId);
		var result = qNumCommande.execute();
		document.getElementById('lblNumCommandeActuel').value = result.responseXML.documentElement.getAttribute("Num_Commande");
		
		aNumCommandes.initTree(initNumCommande);
		
  } catch (e) {
    recup_erreur(e);
  }
}


function initNumCommande() {
	try {

    document.getElementById('numCommande').selectedIndex=0;

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrer() {
	try {
		var commandeId = document.getElementById('numCommande').value;
		
		if (commandeId=="0") { showWarning("Veuillez choisir une commande !"); }
		else {
			var qModifierRegl = new QueryHttp("Facturation/Suivi_Reglements_Clients/modifierNumCommandeRegl.tmpl");
			qModifierRegl.setParam("Reglement_Id", reglementId);
			qModifierRegl.setParam("Commande_Id", commandeId);
			qModifierRegl.execute();
			
			window.arguments[1]();
			window.close();
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


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

var typeTiers;
var reglementId;
var aBanquesRemise = new Arbre('Config/GetRDF/listeBanques.tmpl', 'banqueRemise');

function init() {
  try {
  	window.resizeTo(360,160);
  	reglementId = window.arguments[0];
  	typeTiers = window.arguments[1];
  	aBanquesRemise.initTree(initBanqueRemise);

  } catch (e) {
    recup_erreur(e);
  }
}


function initBanqueRemise() {
	try {
    document.getElementById('banqueRemise').selectedIndex = 0;
	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrer() {
	try {
		var banqueRemise = document.getElementById('banqueRemise').value;
		if (banqueRemise=="0") { showWarning("Veuillez choisir une banque de remise !"); }
		else {
			var qEnregistrer = new QueryHttp("Facturation/Remises_Banque/affecterBanqueRemiseReglement.tmpl");
			qEnregistrer.setParam("Reglement_Id", reglementId);
			qEnregistrer.setParam("Type_Tiers", typeTiers);
			qEnregistrer.setParam("Banque_Remise", banqueRemise);
			qEnregistrer.execute();
			
			window.arguments[2]();
			window.close();
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


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


var aHistorique = new Arbre("Facturation/GetRDF/historique_commissions.tmpl", "historique_commissions");


function init_historique() {
	try {

		aHistorique.setParam("Commercial_Id", identifiant);
		aHistorique.initTree();

	} catch(e) {
		recup_erreur(e);
	}
}


function reediterPdf() {
	try {
		var tree = document.getElementById('historique_commissions');

		if (tree.view != null && tree.currentIndex!=-1) {

			var commission_id = getCellText(tree,tree.currentIndex,'ColCommissionId');
			var params = "&Commission_Id="+ commission_id;
			var page = getUrlOpeneas("&Page=Facturation/Commerciaux/pdf_commissionnement.tmpl" + params);
			document.getElementById('pdf_commission').setAttribute("src", page);
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('bRetourCommercial').collapsed = false;
		}

	} catch (e) {
		recup_erreur(e);
	}
}

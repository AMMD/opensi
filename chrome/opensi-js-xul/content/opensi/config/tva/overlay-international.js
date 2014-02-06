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



var aVentil = new Arbre('Config/GetRDF/liste-tauxInternational.tmpl','oi-listeInternational');
var codeTVA = -1;


function oi_init() {
	try {

		aVentil.initTree();

	} catch (e) {
    recup_erreur(e);
  }
}


function oi_reporter() {
  try {

    var tree = document.getElementById('oi-listeInternational');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var idx = tree.currentIndex;

			codeTVA = getCellText(tree,idx,'oi-ColCode_TVA');
			document.getElementById('oi-Pays').value = getCellText(tree,idx,'oi-ColPays');
			document.getElementById('oi-Compte_Achat').value = getCellText(tree,idx,'oi-ColCompte_Achat');
			document.getElementById('oi-Compte_Vente').value = getCellText(tree,idx,'oi-ColCompte_Vente');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oi_enregistrerComptes() {
	try {

		var compteAchat = document.getElementById('oi-Compte_Achat').value;
		var compteVente = document.getElementById('oi-Compte_Vente').value;

		if (codeTVA==-1) {
			showWarning("Veuillez sélectionner un pays !");
		}
		else if (isEmpty(compteAchat)) {
			showWarning("Veuillez définir un numéro de compte d'achat !");
		}
		else if (isEmpty(compteVente)) {
			showWarning("Veuillez définir un numéro de compte de vente !");
		}
		else {
			var qMaj = new QueryHttp("Config/Tva/modifierTauxInternational.tmpl");
			qMaj.setParam('Code_TVA', codeTVA);
			qMaj.setParam('Compte_Achat', compteAchat);
			qMaj.setParam('Compte_Vente', compteVente);
			qMaj.execute();

			aVentil.initTree();

			codeTVA = -1;
			document.getElementById('oi-Pays').value = "";
			document.getElementById('oi-Compte_Achat').value = "";
			document.getElementById('oi-Compte_Vente').value = "";
		}

	} catch (e) {
    recup_erreur(e);
  }
}

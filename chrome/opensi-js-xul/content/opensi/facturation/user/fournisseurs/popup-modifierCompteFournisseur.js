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

var fournisseurId;


function init() {
  try {
  	window.resizeTo(380,200);
  	fournisseurId = ParamValeur("Fournisseur_Id");
  	
  	var qFournisseur = new QueryHttp("Facturation/Fournisseurs/getNumeroCompte.tmpl");
  	qFournisseur.setParam("Fournisseur_Id", fournisseurId);
		var result = qFournisseur.execute();
		document.getElementById('lblAncienNumeroCompte').value = result.responseXML.documentElement.getAttribute("Numero_Compte");

		document.getElementById('lblFournisseurId').value = fournisseurId;

  } catch (e) {
    recup_erreur(e);
  }
}


function rechcompte() {
	try {

		var debCompte="0";
		var typeCompte="F";
    var url ="chrome://opensi/content/config/util/rechcompte.xul?"+ cookie();
    url += "&Force_Deb="+debCompte;
    url += "&Type_Compte="+ typeCompte;
    url += "&nom=FOURNISSEUR";
    url += "&Creer=false";
    url += "&Num_Compte="+ urlEncode(debCompte);
    window.openDialog(url,'rechcompte','chrome,modal,centerscreen',retourRechercherCompte);

	} catch (e) {
		recup_erreur(e);
	}
}


function retourRechercherCompte(numCompte) {
	try {
		document.getElementById('numeroCompte').value = numCompte;
	} catch (e) {
		  recup_erreur(e);
	}
}


function enregistrer() {
	try {
		var numCompte = document.getElementById('numeroCompte').value;
		if (isEmpty(numCompte)) { showWarning("Veuillez choisir un numéro de compte !"); }
		else if (window.confirm("Voulez-vous modifier le numéro de compte ?")) {
			var qAffecterCompte = new QueryHttp("Facturation/Fournisseurs/modifierNumeroCompte.tmpl");
			qAffecterCompte.setParam("Fournisseur_Id", fournisseurId);
			qAffecterCompte.setParam("Numero_Compte", numCompte);
			qAffecterCompte.execute();
			
			window.arguments[0]();
			window.close();
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


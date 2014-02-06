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

var chargementFamille;
var chargerResponsable;
var aFamilles = new Arbre("Facturation/GetRDF/familles_client.tmpl", "Famille");
var aResponsables = new Arbre("ComboListe/combo-responsables.tmpl", "Login_Resp");


function initFiche() {
	try {

		var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays");
		aPays.initTree(initPays);
		
		var aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "Secteur");
		aSecteurs.initTree();

		var arbre_type=new Arbre("Facturation/GetRDF/liste-typesSociete.tmpl","Type_Societe");
		arbre_type.initTree(initTypeIndex);

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerResponsables(selection) {
	try {
		chargerResponsable = selection;
		aResponsables.setParam("Selection", chargerResponsable);
		aResponsables.initTree(initResponsable);
	} catch (e) {
		recup_erreur(e);
	}
}


function initResponsable() {
  try {
		document.getElementById('Login_Resp').value = chargerResponsable;
	} catch (e) {
  	recup_erreur(e);
	}
}


function ouvrirEditionListe() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=FCLIENT";
    window.openDialog(url,'','chrome,modal,centerscreen', chargerFamille);
	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamille(selection) {
	try {
		chargementFamille = selection;
		aFamilles.setParam("Selection", chargementFamille);
		aFamilles.initTree(initFamille);
	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille() {
  try {

		document.getElementById('Famille').value = chargementFamille;

	} catch (e) {
		recup_erreur(e);
	}
}


function initPays() {
	try {

    document.getElementById('Code_Pays').value = "FR";

	} catch (e) {
    recup_erreur(e);
  }
}


function initTypeIndex() {
	try {

		selectTypeSociete('SARL');
		modifie = false;
	} catch (e) {
		recup_erreur(e);
	}
}

function afficherFichiers() {
	try {

		if (document.getElementById("Client_Id").value!="") {
	    var url = "chrome://opensi/content/facturation/user/recherches/rech_fichiers.xul?"+ cookie();
	    url +="&Type=Client&Document_Id="+ urlEncode(document.getElementById('Client_Id').value);
  	  window.openDialog(url,'','chrome,modal,centerscreen');
    }
    else {
      showWarning("Vous devez enregistrer votre client");
    }
	} catch (e) {
    recup_erreur(e);
  }
}

function selTypeClient(t) {
  try {

		switch(t) {
			case 'P':	document.getElementById('bcParticulier').collapsed = true;
								document.getElementById('rowType_Societe').collapsed = true;
								if (currentClient=="") {
									document.getElementById('oef-Assujetti_TVA').checked=false;
								}
								break;
			case 'E':	document.getElementById('bcParticulier').collapsed = false;
								document.getElementById('rowType_Societe').collapsed = false;
								if (currentClient=="") {
									document.getElementById('oef-Assujetti_TVA').checked=true;
								}
								break;
			case 'O': document.getElementById('bcParticulier').collapsed = false;
								document.getElementById('rowType_Societe').collapsed = true;
								if (currentClient=="") {
									document.getElementById('oef-Assujetti_TVA').checked=false;
								}
								break;
			case 'A': document.getElementById('bcParticulier').collapsed = false;
								document.getElementById('rowType_Societe').collapsed = true;
								break;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function changerCodeClient() {
	try {

		var client_id = document.getElementById('Client_Id').value;

		var url = "chrome://opensi/content/facturation/user/clients/changer_code_client.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',client_id,remplaceCodeClient);

	} catch (e) {
		recup_erreur(e);
	}
}


function remplaceCodeClient(nouveau_code) {
	try {

		document.getElementById('Client_Id').value = nouveau_code;
		currentClient = nouveau_code;

	} catch (e) {
		recup_erreur(e);
	}
}

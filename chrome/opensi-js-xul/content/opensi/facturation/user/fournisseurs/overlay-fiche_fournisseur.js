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


var ff_chargementFamille;
var ff_chargerResponsable;
var ff_aFamille = new Arbre('Facturation/GetRDF/familles_fournisseur.tmpl', 'ff-Famille');
var ff_aResponsables = new Arbre("ComboListe/combo-responsables.tmpl", "ff-Responsable");


function initFicheFournisseur() {
	try {

		var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "ff-Code_Pays");
		aPays.initTree(initPaysFournisseur);
		
		var aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "ff-Secteur");
		aSecteurs.initTree();

		var arbre_type = new Arbre("Facturation/GetRDF/liste-typesSociete.tmpl","ff-Type_Societe");
		arbre_type.initTree(initTypeIndex);

	} catch (e) {
		recup_erreur(e);
	}
}


function ff_ouvrirEditionListe() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=FFOURN";
    window.openDialog(url,'','chrome,modal,centerscreen', ff_chargerFamille);
	} catch (e) {
		recup_erreur(e);
	}
}


function ff_chargerResponsables(selection) {
	try {
		ff_chargerResponsable = selection;
		ff_aResponsables.setParam("Selection", ff_chargerResponsable);
		ff_aResponsables.initTree(ff_initResponsable);
	} catch (e) {
		recup_erreur(e);
	}
}


function ff_initResponsable() {
  try {
		document.getElementById('ff-Responsable').value = ff_chargerResponsable;
	} catch (e) {
  	recup_erreur(e);
	}
}


function ff_chargerFamille(selection) {
	try {
		ff_chargementFamille = selection;
		ff_aFamille.setParam("Selection", ff_chargementFamille);
		ff_aFamille.initTree(ff_initFamille);
	} catch (e) {
		recup_erreur(e);
	}
}


function ff_initFamille() {
  try {

		document.getElementById('ff-Famille').value = ff_chargementFamille;

	} catch (e) {
		recup_erreur(e);
	}
}


function initPaysFournisseur() {
	try {

    document.getElementById('ff-Code_Pays').value = "FR";

	} catch (e) {
    recup_erreur(e);
  }
}


function afficherFichiers() {
	try {

		if (document.getElementById("ff-Fournisseur_Id").value!="") {
	    var url = "chrome://opensi/content/facturation/user/recherches/rech_fichiers.xul?"+ cookie();
	    url +="&Type=Fournisseur&Document_Id="+ urlEncode(document.getElementById('ff-Fournisseur_Id').value);
  	  window.openDialog(url,'','chrome,modal,centerscreen');
    }
    else {
      showWarning("Vous devez enregistrer votre fournisseur");
    }
	} catch (e) {
    recup_erreur(e);
  }
}


function initTypeIndex() {
	try {

		selectTypeSociete('SARL');

	} catch (e) {
		recup_erreur(e);
	}
}

function changerCodeFournisseur() {
	try {

		var fournisseur_id = document.getElementById('ff-Fournisseur_Id').value;

		var url = "chrome://opensi/content/facturation/user/fournisseurs/changer_code_fournisseur.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',fournisseur_id,remplaceCodeFournisseur);

	} catch (e) {
		recup_erreur(e);
	}
}


function remplaceCodeFournisseur(nouveau_code) {
	try {

		document.getElementById('ff-Fournisseur_Id').value = nouveau_code;
		document.getElementById('Fournisseur').value = nouveau_code;

	} catch (e) {
		recup_erreur(e);
	}
}

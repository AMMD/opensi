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


jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var aReg = new Arbre('Config/GetRDF/listeReglement.tmpl', 'liste_modes');
var aJournaux = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'Code_Journal');
var actif = true;
var currentMode = "";
var currentLblMode = "";


function init() {
	try {
		document.getElementById('afficherTout').setAttribute("checked", false);
		var arbre_type=new Arbre("Facturation/GetRDF/liste-typesReglement.tmpl","Type_R");
		arbre_type.initTree(initTypeR);

	} catch (e) {
    recup_erreur(e);
  }
}

function initTypeR() {
	document.getElementById('Type_R').selectedIndex = 0;
	aJournaux.setParam('Type_Journal', 'TR');
	aJournaux.initTree(initJournal);
}


function initJournal() {
	try {
		document.getElementById('Code_Journal').selectedIndex = 0;
		chargerListe();
	} catch (e) {
		recup_erreur(e);
	}
}


function chargerListe() {
	try {
		var chkAfficherTout = document.getElementById('afficherTout').checked?"1":"0";
		document.getElementById('colPictoActif').collapsed = !chkAfficherTout;
		aReg.setParam("Afficher_Tout", chkAfficherTout);
		aReg.initTree(nouveauMode);
	} catch (e) {
		recup_erreur(e);
	}
}


function nouveauMode() {
	try {
		if (aReg.isNotNull()) {
			aReg.select(-1);
		}
		currentMode="";
		currentLblMode="";
		actif = true;
		
		document.getElementById('Type_R').selectedIndex = 0;
		document.getElementById('Mode_R').value="";
		document.getElementById('Code_Journal').selectedIndex = 0;
		document.getElementById('Type_R').disabled=false;
		document.getElementById('Mode_R').disabled=false;
		document.getElementById('Code_Journal').disabled=false;
		
		document.getElementById('bNouveauMode').collapsed = true;
		document.getElementById('bEnregistrerMode').collapsed = false;
		document.getElementById('bReactiverMode').collapsed = true;
		document.getElementById('bSupprimerMode').collapsed = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirModeReglement() {
	try {

		if (aReg.isSelected()) {
			var i = aReg.getCurrentIndex();
			currentMode = aReg.getCellText(i,'ColModeRegId');
			currentLblMode = aReg.getCellText(i,'ColLabelModeReg');
			actif = (aReg.getCellText(i, 'colActif')=="1");
			
			document.getElementById('Type_R').value=aReg.getCellText(i,'ColTypeRegId');
			document.getElementById('Mode_R').value=currentLblMode;
			document.getElementById('Code_Journal').value=aReg.getCellText(i,'ColCodeJournal');
			document.getElementById('Type_R').disabled=!actif;
			document.getElementById('Mode_R').disabled=true;
			document.getElementById('Code_Journal').disabled=!actif;
			document.getElementById('bNouveauMode').collapsed = false;
			document.getElementById('bEnregistrerMode').collapsed = !actif;
			document.getElementById('bReactiverMode').collapsed = actif;
			document.getElementById('bSupprimerMode').collapsed = !actif;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerMode() {
	try {
		
		var mode_r = document.getElementById('Mode_R').value;
		var type_r = document.getElementById('Type_R').value;
		var codeJournal = document.getElementById('Code_Journal').value;

		if (isEmpty(mode_r)) {
			showWarning("Veuillez remplir le champ 'Mode de règlement' !");
		} else {
		
			var qEnregistrer;
			if (isEmpty(currentMode)) {
				qEnregistrer = new QueryHttp("Config/gestion_commerciale/reglement/creerModeReglement.tmpl");
			} else {
				qEnregistrer = new QueryHttp("Config/gestion_commerciale/reglement/modifierModeReglement.tmpl");
				qEnregistrer.setParam('Mode_Reg_Id', currentMode);
			}
			qEnregistrer.setParam('Type_R', type_r);
			qEnregistrer.setParam('Mode_R', mode_r);
			qEnregistrer.setParam('Code_Journal', codeJournal);
			var result = qEnregistrer.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				chargerListe();
			} else {
				showWarning("Erreur : le mode de règlement '"+ mode_r +"' existe déjà !");
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function reactiverMode() {
	try {
		if (window.confirm("Voulez-vous réactiver le mode de règlement sélectionné ?")) {
			var qReactiver = new QueryHttp("Config/gestion_commerciale/reglement/reactiverModeReglement.tmpl");
			qReactiver.setParam("Mode_Reg_Id", currentMode);
			qReactiver.execute(chargerListe);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerMode() {
	try {
		if (window.confirm("Voulez-vous supprimer le mode de règlement sélectionné ?")) {
			var qSupprimer = new QueryHttp("Config/gestion_commerciale/reglement/supprimerModeReglement.tmpl");
			qSupprimer.setParam("Mode_Reg_Id", currentMode);
			var result = qSupprimer.execute();
			if (result.responseXML.documentElement.getAttribute("codeErreur")=="1") {
				showWarning("Le mode de règlement étant encore utilisé, il a simplement été désactivé !");
			}
			chargerListe();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

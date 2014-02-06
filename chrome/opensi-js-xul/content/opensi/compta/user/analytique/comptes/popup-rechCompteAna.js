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

var aComptes;
var filtreNumero;
var filtreIntitule;
var filtreType;

function init() {
	try {
		document.getElementById('filtreNumero').focus();
		
		resetFiltres();
		filtreNumero = window.arguments[1];
		document.getElementById('filtreNumero').value = filtreNumero;
		
		aComptes = new Arbre("Compta/Analytique/Comptes/listeComptes.tmpl","treeComptes");
  		initArbreComptes();
	} catch (e) {
		recup_erreur(e);
	}
}

function resetFiltres() {
	try {
		// reset des variables globales
		filtreNumero = "";
		filtreIntitule = "";
		filtreType = 2;
		
		// reset des champs du document
		document.getElementById('filtreNumero').value = filtreNumero;
		document.getElementById('filtreIntitule').value = filtreIntitule;
		document.getElementById('filtreType').value = filtreType;
		
	} catch (e) {
		recup_erreur(e);
	}
}

function activeMenu(boolean) {
	try {
		// activation des filtres de recherche
		document.getElementById('filtreNumero').disabled = !boolean;
		document.getElementById('filtreIntitule').disabled = !boolean;
		document.getElementById('filtreType').disabled = !boolean;
		document.getElementById('bActualiser').disabled = !boolean;
		document.getElementById('bReinitialiser').disabled = !boolean;
		
		// activation de l'arbre
		document.getElementById('treeComptes').disabled = !boolean;
		
		// activation des actions 
		document.getElementById('bAnnuler').disabled = !boolean;
		document.getElementById('bValider').disabled = !boolean;
	} catch (e) {
		recup_erreur(e);
	}
}

function finInit() {
	try {
  		activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function initArbreComptes() {
	try {
		aComptes.clearParams();
		if (!isEmpty(filtreNumero)) {
			aComptes.setParam("Numero", filtreNumero);
		}
		if (!isEmpty(filtreIntitule)) {
			aComptes.setParam("Intitule", filtreIntitule);
		}
		if (filtreType!=2) {
			aComptes.setParam("Direct", filtreType);
		}
		aComptes.setParam("Actif", 1);
		
		aComptes.initTree(finInit);
	} catch (e) {
		recup_erreur(e);
	}
}



function changeOnFiltreNumero() {
	try {
		filtreNumero = document.getElementById('filtreNumero').value;
	} catch (e) {
		recup_erreur(e);
	}
}

function changeOnFiltreIntitule() {
	try {
		filtreIntitule = document.getElementById('filtreIntitule').value;
	} catch (e) {
		recup_erreur(e);
	}
}

function keyPressOnFiltreNumero(event) {
	try {
		if (event.keyCode==13) {
			activeMenu(false);
			filtreNumero = document.getElementById('filtreNumero').value;
			initArbreComptes();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function keyPressOnFiltreIntitule(event) {
	try {
		if (event.keyCode==13) {
			activeMenu(false);
			filtreIntitule = document.getElementById('filtreIntitule').value;
			initArbreComptes();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnFiltreType() {
	try {
		activeMenu(false);
		filtreType = document.getElementById('filtreType').value;
		initArbreComptes();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnActualiser() {
	try {
		activeMenu(false);
		initArbreComptes();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnReinitialiser() {
	try {
		activeMenu(false);
		resetFiltres();
		initArbreComptes();
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnTreeComptes() {
	try {
 		if (aComptes.isSelected()) {
 			var index = aComptes.getCurrentIndex();
 			
			filtreNumero = aComptes.getCellText(index,'colNumero');
			filtreIntitule = aComptes.getCellText(index,'colIntitule');
			filtreType = aComptes.getCellText(index,'colType');
			
			document.getElementById('filtreNumero').value = filtreNumero;
			document.getElementById('filtreIntitule').value = filtreIntitule;
			document.getElementById('filtreType').value = filtreType;
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function dblClickOnTreeComptes() {
	try {
		if (aComptes.isSelected()) {
			activeMenu(false);
			valideCompte();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnAnnuler() {
	try {
		activeMenu(false);
		window.close();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnOk() {
	try {
		activeMenu(false);
		valideCompte();
	} catch (e) {
		recup_erreur(e);
	}
}

function valideCompte() {
	try {
		if (isEmpty(filtreNumero)) {
			showWarning("Veuillez saisir un numéro de compte !");
			activeMenu(true);
		} else {
			qExistCompteByNumero = new QueryHttp("Compta/Analytique/Comptes/getCompteByNumero.tmpl");
			qExistCompteByNumero.setParam("Numero", filtreNumero);
			var result = qExistCompteByNumero.execute();
			var errors = new Errors(result);
			
			if (errors.hasNext()) {
				errors.show();
				initArbreComptes();
				activeMenu(true);
			} else {
				var id = result.responseXML.documentElement.getAttribute('Compte_Id');
				var numero = result.responseXML.documentElement.getAttribute('Numero');
				window.arguments[0](id, numero);
				window.close();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}
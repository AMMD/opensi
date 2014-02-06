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

var aListeModeles;
var aModeleEcriture;

var modeleId;

function init() {
	try {
		// init des variables globales
		modeleId = 0;
		
		// init de la liste des modeles dispo
  		aListeModeles = new Arbre("Compta/Saisie/listeModele.tmpl","treeModele");
  		aListeModeles.initTree();
  		  		
  		// init des lignes du modèle
  		aModeleEcriture = new Arbre("Compta/Saisie/listeLigne.tmpl","treeLigne");
  		aModeleEcriture.initTree();
  		
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnTreeModele() {
	try {
 		if (aListeModeles.isSelected()) {
 			var index = aListeModeles.getCurrentIndex();
			modeleId = aListeModeles.getCellText(index,"colModeleId");
			document.getElementById("libelleModele").value = aListeModeles.getCellText(index,"colLibelle");
			document.getElementById("raccourciModele").value = aListeModeles.getCellText(index,"colTextRaccourci");
			
			aModeleEcriture.clearParams();
			aModeleEcriture.setParam("ModId", modeleId);
			aModeleEcriture.initTree();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function dblClickOnTreeModele() {
	try {
 		ok();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnValider() {
	try {
 		ok();
	} catch (e) {
		recup_erreur(e);
	}
}

function ok() {
	try {
		if (modeleId!=0) {
			window.arguments[0](modeleId);
			window.close();
		} else {
			showWarning("Veuillez sélectionner un abonnement !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


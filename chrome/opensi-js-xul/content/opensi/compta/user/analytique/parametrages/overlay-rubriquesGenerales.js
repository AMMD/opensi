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

var org_aListeRubriques;
var org_aListePlages;

var org_rubriqueId;
var org_plageId;
var org_change;

function org_init() {
	try {
		// init des variables globales
		org_rubriqueId = 0;
		org_plageId = 0;
		org_change = false;
		
		// init des arbres
		org_aListeRubriques = new Arbre("Compta/Analytique/Rubriques/listeRubriques.tmpl",'org-treeRubriques');
		org_aListeRubriques.initTree();
		
		org_aListePlages	= new Arbre("Compta/Analytique/Rubriques/listePlages.tmpl",'org-treePlages');
		//org_aPlages.setParam("Rubrique_Id", 1);
		org_aListePlages.initTree();
		
		org_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function org_selectOnTreeRubriques() {
	try {
 		if (org_aListeRubriques.isSelected()) {
 			var index = org_aListeRubriques.getCurrentIndex();
			var id = org_aListeRubriques.getCellText(index,'org-colRubriqueId');
			org_ouvrir(id);
			org_activeMenu(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_ouvrir(id) {
	try {
		org_rubriqueId = id;
		
		// récupération des infos de la rubrique
		var qGetRubrique = new QueryHttp("Compta/Analytique/Rubriques/getRubrique.tmpl");
		if (org_rubriqueId!=0) {
			qGetRubrique.setParam("Rubrique_Id", org_rubriqueId);
		}
		var result = qGetRubrique.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			org_nouveau();
		} else {
			var intitule = result.responseXML.documentElement.getAttribute('Intitule');
			
			// affichage de la rubrique
			document.getElementById('org-intitule').value = intitule;
			
			// init des plages de la rubrique
			org_aListePlages.clearParams();
			org_aListePlages.setParam('Rubrique_Id', org_rubriqueId);
			org_aListePlages.initTree();
			org_annulerPlage();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_activeMenu(boolean) {
	try {
		// actions générales
		document.getElementById('org-bNouveau').disabled = !boolean || false;
		document.getElementById('org-bEnregistrer').disabled = !boolean || !org_change;
		document.getElementById('org-bSupprimer').disabled = !boolean || (org_rubriqueId==0);
		
		// champs de saisie de ligne
		document.getElementById('org-debut').disabled = !boolean || (org_rubriqueId==0);
		document.getElementById('org-fin').disabled = !boolean || (org_rubriqueId==0);
	
		// actions sur les lignes
		document.getElementById('org-bAnnulerPlage').disabled = !boolean || (org_rubriqueId==0);
		document.getElementById('org-bValiderPlage').disabled = !boolean || (org_rubriqueId==0);
		document.getElementById('org-bSupprimerPlage').disabled = !boolean || (org_rubriqueId==0) || (org_plageId==0);
	} catch (e) {
  		recup_erreur(e);
	}
}

function org_keyPressOnIntitule(event) {
	try {
		org_change = true;
		org_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function org_pressOnNouveau() {
	try {
		var go = true;
		if (org_change) {
			go = window.confirm("Voulez-vous saisir une nouvelle rubrique ?\nVous allez perdre les informations non enregistrées.");
		}
		if (go) {
			org_activeMenu(false);
			org_nouveau();
			org_activeMenu(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_pressOnSupprimer() {
	try {
		var go = false;
		if (org_rubriqueId!=0) {
			go = window.confirm("Voulez-vous supprimer cette rubrique ?\nCelà entrainera la suppression de toutes les plages de comptes associées.");
		}
		if (go) {
			org_activeMenu(false);
			org_supprimer();
			org_activeMenu(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_pressOnEnregistrer() {
	try {
		// verif libelle
		if (isEmpty(document.getElementById('org-intitule').value)) { showWarning("Intitulé incorrect !"); }
		
		else {
			org_activeMenu(false);
			org_enregistrer();
			org_activeMenu(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_nouveau() {
	try {
  		// reset des variables globales
  		org_rubriqueId = 0;
  		org_aListeRubriques.select(-1);
  		org_change = false;
  		
  		// reset de l'arbre
  		org_aListePlages.deleteTree();
  		
  		// reset de la rubrique
  		document.getElementById('org-intitule').value = "";
  		
  		// reset du formulaire de plage
  		org_annulerPlage();
	} catch (e) {
		recup_erreur(e);
	}
}

function org_supprimer() {
	try {
		var queryDelete = new QueryHttp("Compta/Analytique/Rubriques/deleteRubrique.tmpl");
		
		queryDelete.setParam("Rubrique_Id", org_rubriqueId);
		
		var result = queryDelete.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			// refresh de la liste
			org_aListeRubriques.deleteTree();
			org_aListeRubriques.initTree();
			// reset
			org_nouveau();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_enregistrer() {
	try {
		var querySave = new QueryHttp("Compta/Analytique/Rubriques/saveRubrique.tmpl");
					
		querySave.setParam("Rubrique_Id", org_rubriqueId);
		querySave.setParam("Intitule", urlEncode(document.getElementById('org-intitule').value));
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			org_rubriqueId = result.responseXML.documentElement.getAttribute('Rubrique_Id');
			org_aListeRubriques.deleteTree();
			org_aListeRubriques.initTree();
			org_change = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_selectOnTreePlages() {
	try {
		org_loadPlage();
		org_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function org_loadPlage() {
	try {
		if (org_aListePlages.isSelected()) {
			var index = org_aListePlages.getCurrentIndex();
			org_plageId = org_aListePlages.getCellText(index,'org-colPlageId');
  			document.getElementById('org-debut').value = org_aListePlages.getCellText(index,'org-colDebut');
			document.getElementById('org-fin').value = org_aListePlages.getCellText(index,'org-colFin');
  		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_pressOnAnnulerPlage() {
	try {
		org_activeMenu(false);
		org_annulerPlage();
		org_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function org_pressOnValiderPlage() {
	try {
		var debut = document.getElementById('org-debut').value;
		var fin = document.getElementById('org-fin').value;
		// verif debut
		if (!isCompteCorrect(debut)) { showWarning("Compte de début incorrect !"); }
		
		// verif fin
		else if (!isCompteCorrect(fin)) { showWarning("Compte de fin incorrect !"); }
		
		// verif plage
		else if (!((debut.charAt(0)=='6' && fin.charAt(0)=='6') || (debut.charAt(0)=='7' && fin.charAt(0)=='7'))) { showWarning("Les comptes de début et de fin doivent être soit des comptes de charges(6), soit des comptes de produits(7) !"); }
		
		else if (parseInt(debut)>parseInt(fin)) { showWarning("Le compte de début doit être inférieur au compte de fin !"); }
		
		else {
			org_activeMenu(false);
			org_savePlage();
			org_activeMenu(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_pressOnSupprimerPlage() {
	try {
		if (org_plageId!=0) {
			org_activeMenu(false);
			org_supprimerPlage();
			org_activeMenu(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_annulerPlage() {
	try {
		org_plageId = 0;
		org_aListePlages.select(-1);
				
		document.getElementById('org-debut').value = "";
		document.getElementById('org-fin').value = "";
	} catch (e) {
		recup_erreur(e);
	}
}

function org_savePlage() {
	try {
		var querySave = new QueryHttp("Compta/Analytique/Rubriques/savePlage.tmpl");
		
		querySave.setParam("Plage_Id", org_plageId);
		querySave.setParam("Rubrique_Id", org_rubriqueId);
		querySave.setParam("Compte_Debut", urlEncode(document.getElementById('org-debut').value));
		querySave.setParam("Compte_Fin", urlEncode(document.getElementById('org-fin').value));
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
	  		org_ouvrir(org_rubriqueId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function org_supprimerPlage() {
	try {
		var querySuppr = new QueryHttp("Compta/Analytique/Rubriques/deletePlage.tmpl");
		
		querySuppr.setParam("Plage_Id", org_plageId);
		
		var result = querySuppr.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
	  		org_ouvrir(org_rubriqueId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}
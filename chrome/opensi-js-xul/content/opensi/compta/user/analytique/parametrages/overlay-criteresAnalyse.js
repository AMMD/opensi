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

var oca_aListeCriteres;
var oca_aListeCentres;

var oca_critereId;
var oca_centreId;
var oca_change;

function oca_init() {
	try {
		// init des variables globales
		oca_critereId = 0;
		oca_centreId = 0;
		oca_change = false;
		
		// init de la liste des modeles dispo
  		oca_aListeCriteres = new Arbre("Compta/Analytique/Criteres/listeCriteres.tmpl",'oca-treeCriteres');
  		oca_aListeCriteres.initTree();
  		  		
  		// init des lignes du modèle
  		oca_aListeCentres = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl",'oca-treeCentres');
  		oca_aListeCentres.initTree();
  		
  		// préparation du menu
  		oca_activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_selectOnTreeCriteres() {
	try {
 		if (oca_aListeCriteres.isSelected()) {
 			var index = oca_aListeCriteres.getCurrentIndex();
			var id = oca_aListeCriteres.getCellText(index,'oca-colCritereId');
			oca_ouvrir(id);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_ouvrir(id) {
	try {
		oca_critereId = id;
		
		// récupération des infos du critère
		var qGetCritere = new QueryHttp("Compta/Analytique/Criteres/getCritere.tmpl");
		if (oca_critereId!=0) {
			qGetCritere.setParam("Critere_Id", oca_critereId);
		}
		var result = qGetCritere.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			oca_nouveau();
		} else {
			var intitule = result.responseXML.documentElement.getAttribute('Intitule');
			var formatCode = result.responseXML.documentElement.getAttribute('Format_Code');
			var newId = result.responseXML.documentElement.getAttribute('Critere_Id');
			
			// affichage du critère
			document.getElementById('oca-intitule').value = intitule;
			document.getElementById('oca-formatCode').value = formatCode;
			
			// init var globales
			oca_centreId = 0;
			oca_change = false;
			oca_critereId = newId;
			
			// init des centres du critère
			oca_aListeCentres.clearParams();
			oca_aListeCentres.setParam('Critere_Id', oca_critereId);
			oca_aListeCentres.initTree(oca_annulerCentre);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_activeMenu() {
	try {
		// actions générales
		document.getElementById('oca-bNouveau').disabled = false;
		document.getElementById('oca-bEnregistrer').disabled = !oca_change;
		document.getElementById('oca-bSupprimer').disabled = (oca_critereId==0);
		
		// champs de saisie de ligne
		document.getElementById('oca-codeCentre').disabled = (oca_critereId==0);
		document.getElementById('oca-libelleCentre').disabled = (oca_critereId==0);
	
		// actions sur les lignes
		document.getElementById('oca-bAnnulerCentre').disabled = (oca_critereId==0);
		document.getElementById('oca-bValiderCentre').disabled = (oca_critereId==0);
		document.getElementById('oca-bSupprimerCentre').disabled = (oca_critereId==0);
	} catch (e) {
  		recup_erreur(e);
	}
}

function oca_desactiveMenu() {
	try {
		// actions générales
		document.getElementById('oca-bNouveau').disabled = true;
		document.getElementById('oca-bEnregistrer').disabled = true;
		document.getElementById('oca-bSupprimer').disabled = true;
		
		// actions sur les lignes
		document.getElementById('oca-bAnnulerCentre').disabled = true;
		document.getElementById('oca-bValiderCentre').disabled = true;
		document.getElementById('oca-bSupprimerCentre').disabled = true;
	} catch (e) {
  		recup_erreur(e);
	}
}

function oca_keyPressOnIntitule(event) {
	try {
		oca_change = true;
		oca_activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_keyPressOnFormatCode(event) {
	try {
		oca_change = true;
		oca_activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_pressOnNouveau() {
	try {
		var go = true;
		if (oca_change) {
			go = window.confirm("Voulez-vous saisir un nouveau critère d'analyse ?\nVous allez perdre les informations non enregistrées.");
		}
		if (go) {
			oca_desactiveMenu();
			oca_nouveau();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_pressOnSupprimer() {
	try {
		var go = false;
		if (oca_critereId!=0) {
			go = window.confirm("Voulez-vous supprimer ce critère ?\nCelà entrainera la suppression de tous les centres de profits associés.");
		}
		if (go) {
			oca_desactiveMenu();
			oca_supprimer();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_isFormatCorrect(val) {
	try {
		var str = val.toString();
		var ok = !isEmpty(str) && str.length<=4;
		
		if (ok) {
			for (var i=0;i<str.length && ok;i++) {
				var c = str.charAt(i);
				ok = ((c=='A') || (c=='9'));
			}
		}
		return ok;
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_pressOnEnregistrer() {
	try {
		// verif libelle
		if (isEmpty(document.getElementById('oca-intitule').value)) { showWarning("Intitulé incorrect !"); }
		
		// verif format code
		else if (!oca_isFormatCorrect(document.getElementById('oca-formatCode').value)) { showWarning("Format de code incorrect !"); }			
		
		else {
			oca_desactiveMenu();
			oca_enregistrer();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_nouveau() {
	try {
  		// reset des variables globales
  		oca_critereId = 0;
  		oca_aListeCriteres.select(-1);
  		oca_change = false;
  		
  		// reset de l'arbre
  		oca_aListeCentres.deleteTree();
  		
  		// reset du critère
  		document.getElementById('oca-intitule').value = "";
  		document.getElementById('oca-formatCode').value = "";
  		
  		// reset du formulaire de centre
  		oca_annulerCentre();
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_supprimer() {
	try {
		var queryDelete = new QueryHttp("Compta/Analytique/Criteres/deleteCritere.tmpl");
		
		queryDelete.setParam("Critere_Id", oca_critereId);
		
		var result = queryDelete.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			oca_activeMenu();
		} else {
			// refresh de la liste
			oca_aListeCriteres.deleteTree();
			oca_aListeCriteres.initTree();
			// reset
			oca_nouveau();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_enregistrer() {
	try {
		var querySave = new QueryHttp("Compta/Analytique/Criteres/saveCritere.tmpl");
					
		querySave.setParam("Critere_Id", oca_critereId);
		querySave.setParam("Intitule", urlEncode(document.getElementById('oca-intitule').value));
		querySave.setParam("Format_Code", urlEncode(document.getElementById('oca-formatCode').value));
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			oca_activeMenu();
		} else {
			oca_critereId = result.responseXML.documentElement.getAttribute('Critere_Id');
			oca_aListeCriteres.deleteTree();
			oca_aListeCriteres.initTree();
			oca_change = false;
			oca_activeMenu();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_selectOnTreeCentres() {
	try {
		oca_loadCentre();
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_loadCentre() {
	try {
		if (oca_aListeCentres.isSelected()) {
			var index = oca_aListeCentres.getCurrentIndex();
			oca_centreId = oca_aListeCentres.getCellText(index,'oca-colCentreId');
  			document.getElementById('oca-codeCentre').value = oca_aListeCentres.getCellText(index,'oca-colCode');
			document.getElementById('oca-libelleCentre').value = oca_aListeCentres.getCellText(index,'oca-colLibelle');
  		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_pressOnAnnulerCentre() {
	try {
		oca_desactiveMenu();
		oca_annulerCentre();
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_isCodeCorrect(val) {
	try {
		var str = val.toString();
		var ok = str.length<=4;
		
		if (ok) {
			for (var i=0;i<str.length && ok;i++) {
				var c = str.charAt(i);
				ok = ((c<='z' && c>='a') || (c<='Z' && c>='A') || (c<='9' && c>='0') || (c=='_'));
			}
		}
		return ok;
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_pressOnValiderCentre() {
	try {
		// verif code
		if (!oca_isCodeCorrect(document.getElementById('oca-codeCentre').value)) { showWarning("Code incorrect !"); }			
		
		// verif libelle
		else if (isEmpty(document.getElementById('oca-libelleCentre').value)) { showWarning("Libellé incorrect !"); }
		
		else {
			oca_desactiveMenu();
			oca_saveCentre();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_pressOnSupprimerCentre() {
	try {
		if (oca_centreId!=0) {
			oca_desactiveMenu();
			oca_supprimerCentre();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_annulerCentre() {
	try {
		// reset la ligne
		oca_centreId = 0;
		oca_aListeCentres.select(-1);
		
		document.getElementById('oca-codeCentre').value = "";
		document.getElementById('oca-libelleCentre').value = "";
		
		oca_activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_saveCentre() {
	try {
		var querySave = new QueryHttp("Compta/Analytique/Criteres/saveCentre.tmpl");
		
		querySave.setParam("Centre_Id", oca_centreId);
		querySave.setParam("Critere_Id", oca_critereId);
		querySave.setParam("Code", urlEncode(document.getElementById('oca-codeCentre').value));
		querySave.setParam("Libelle", urlEncode(document.getElementById('oca-libelleCentre').value));
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			oca_activeMenu();
		} else {
	  		oca_ouvrir(oca_critereId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function oca_supprimerCentre() {
	try {
		var querySuppr = new QueryHttp("Compta/Analytique/Criteres/deleteCentre.tmpl");
		
		querySuppr.setParam("Centre_Id", oca_centreId);
		
		var result = querySuppr.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			oca_activeMenu();
		} else {
	  		oca_ouvrir(oca_critereId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}
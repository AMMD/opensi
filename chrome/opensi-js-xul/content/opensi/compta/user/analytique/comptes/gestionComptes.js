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
jsLoader.loadSubScript("chrome://opensi/content/libs/semaphores.js");

var aComptes;
var aListeCriteres1;
var aListeCriteres2;
var aListeCriteres3;
var aListeCriteres4;
var aListeCriteres5;

var formatId;
var filtreNumero;
var filtreIntitule;
var filtreType;
var filtreActif;

var compteId;
var numero;
var intitule;
var type;
var actif;

var centreId1;
var centreId2;
var centreId3;
var centreId4;
var centreId5;

function init() {
	try {
		// init de l'arbre des comptes
  		aComptes = new Arbre("Compta/Analytique/Comptes/listeComptes.tmpl","treeComptes");
  		aComptes.initTree();
  		
  		// init des listes de critères
  		aListeCriteres1 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl","listeCentre1");
  		aListeCriteres2 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl","listeCentre2");
  		aListeCriteres3 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl","listeCentre3");
  		aListeCriteres4 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl","listeCentre4");
  		aListeCriteres5 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl","listeCentre5");
  		
		// init des variables globales
		formatId = 0;
		resetFiltres();
		resetCompte();
  		
  		// récupération du format de compte
  		var qGetFormat = new QueryHttp("Compta/Analytique/Format/getFormat.tmpl");
  		
		var result = qGetFormat.execute();
		var errors = new Errors(result);
		if (errors.hasNext()) {
			errors.show();
		} else {
			formatId = result.responseXML.documentElement.getAttribute('Format_Id');
			if (formatId!=0) {
				var critereId1 = result.responseXML.documentElement.getAttribute('Critere_Id1');
				var critereId2 = result.responseXML.documentElement.getAttribute('Critere_Id2');
				var critereId3 = result.responseXML.documentElement.getAttribute('Critere_Id3');
				var critereId4 = result.responseXML.documentElement.getAttribute('Critere_Id4');
				var critereId5 = result.responseXML.documentElement.getAttribute('Critere_Id5');
				
				aListeCriteres1.setParam("Critere_Id", critereId1);
				if (critereId2==null) {
					document.getElementById('ligneListe2').collapsed=true;
				} else {
					aListeCriteres2.setParam("Critere_Id", critereId2);
				}
				if (critereId3==null) {
					document.getElementById('ligneListe3').collapsed=true;
				} else {
					aListeCriteres3.setParam("Critere_Id", critereId3);
				}
				if (critereId4==null) {
					document.getElementById('ligneListe4').collapsed=true;
				} else {
					aListeCriteres4.setParam("Critere_Id", critereId4);
				}
				if (critereId5==null) {
					document.getElementById('ligneListe5').collapsed=true;
				} else {
					aListeCriteres5.setParam("Critere_Id", critereId5);
				}
			} else {
				document.getElementById('ligneListe1').collapsed=true;
				document.getElementById('ligneListe2').collapsed=true;
				document.getElementById('ligneListe3').collapsed=true;
				document.getElementById('ligneListe4').collapsed=true;
				document.getElementById('ligneListe5').collapsed=true;
			}
		}
		
		// synchronisation des filtres
		var sia = new SyncInitArbre(finInit);
  		sia.add(aListeCriteres1);
  		sia.add(aListeCriteres2);
  		sia.add(aListeCriteres3);
  		sia.add(aListeCriteres4);
  		sia.add(aListeCriteres5);
  		sia.load();
  		
	} catch (e) {
		recup_erreur(e);
	}
}

function finInit() {
	try {
  		// préparation du menu
  		activeMenu(true);
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
		filtreActif = 2;
		
		// reset des champs du document
		document.getElementById('filtreNumero').value = filtreNumero;
		document.getElementById('filtreIntitule').value = filtreIntitule;
		document.getElementById('filtreType').value = filtreType;
		document.getElementById('filtreActif').value = filtreActif;
	} catch (e) {
		recup_erreur(e);
	}
}

function resetCompte() {
	try {
		resetCentres();
		
		// reset des variables globales
		compteId = 0;
  		aComptes.select(-1);
		intitule = "";
		type = true;
		actif = true;
  		
  		// reset des champs
		document.getElementById('intitule').value = intitule;
		document.getElementById('type').value = type?1:0;
		document.getElementById('chkActif').checked = actif;
		
		activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function resetCentres() {
	try {
		// reset numero
		numero = "";
  		document.getElementById('numero').value = numero;
  		
		// reset des centres 
		centreId1 = 0;
		centreId2 = 0;
		centreId3 = 0;
		centreId4 = 0;
		centreId5 = 0;
		
		// reset des listes
		document.getElementById('listeCentre1').value = centreId1;
		document.getElementById('listeCentre2').value = centreId2;
		document.getElementById('listeCentre3').value = centreId3;
		document.getElementById('listeCentre4').value = centreId4;
		document.getElementById('listeCentre5').value = centreId5;
	} catch (e) {
		recup_erreur(e);
	}
}

function retourMenuPrincipal() {
	try {
    	window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();
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
		document.getElementById('filtreActif').disabled = !boolean;
		document.getElementById('bActualiser').disabled = !boolean;
		document.getElementById('bReinitialiser').disabled = !boolean;
		
		// activation de l'arbre
		document.getElementById('treeComptes').disabled = !boolean;
		
		// activation de la fiche de compte
		document.getElementById('labelNumero').disabled = (compteId!=0 || type || !boolean);
		document.getElementById('numero').disabled = (compteId!=0 || type || !boolean);
		document.getElementById('type').disabled = (compteId!=0 || !boolean);
		document.getElementById('intitule').disabled = !boolean;
		document.getElementById('chkActif').disabled = !boolean;
		
		// activation de la liste de centres
		document.getElementById('labelCentre1').disabled = (compteId!=0 || !type || !boolean);
		document.getElementById('labelCentre2').disabled = (centreId1==0 || compteId!=0 || !type || !boolean);
		document.getElementById('labelCentre3').disabled = (centreId1==0 || centreId2==0 || compteId!=0 || !type || !boolean);
		document.getElementById('labelCentre4').disabled = (centreId1==0 || centreId2==0 || centreId3==0 || compteId!=0 || !type || !boolean);
		document.getElementById('labelCentre5').disabled = (centreId1==0 || centreId2==0 || centreId3==0 || centreId4==0 || compteId!=0 || !type || !boolean);
		document.getElementById('listeCentre1').disabled = (compteId!=0 || !type || !boolean);
		document.getElementById('listeCentre2').disabled = (centreId1==0 || compteId!=0 || !type || !boolean);
		document.getElementById('listeCentre3').disabled = (centreId1==0 || centreId2==0 || compteId!=0 || !type || !boolean);
		document.getElementById('listeCentre4').disabled = (centreId1==0 || centreId2==0 || centreId3==0 || compteId!=0 || !type || !boolean);
		document.getElementById('listeCentre5').disabled = (centreId1==0 || centreId2==0 || centreId3==0 || centreId4==0 || compteId!=0 || !type || !boolean);
		
		// activation des actions de la fiche de comptes
		document.getElementById('bNouveau').disabled = !boolean;
		document.getElementById('bSupprimer').disabled = (compteId==0 || !boolean);
		document.getElementById('bEnregistrer').disabled = !boolean;
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

function selectOnFiltreActif() {
	try {
		activeMenu(false);
		filtreActif = document.getElementById('filtreActif').value;
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
		if (filtreActif!=2) {
			aComptes.setParam("Actif", filtreActif);
		}
		aComptes.initTree(finInit);
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnTreeComptes() {
	try {
 		if (aComptes.isSelected()) {
 			activeMenu(false);
 			var index = aComptes.getCurrentIndex();
			var id = aComptes.getCellText(index,'colCompteId');
			ouvrir(id);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ouvrir(id) {
	try {
		
		compteId = id;
		
		if (compteId==0) {
			resetCompte();
		} else {
			// récupération des infos du compte
			var qGetCompte = new QueryHttp("Compta/Analytique/Comptes/getCompte.tmpl");
			qGetCompte.setParam("Compte_Id", compteId);
			
			var result = qGetCompte.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				resetCompte();
			} else {
				numero = result.responseXML.documentElement.getAttribute('Numero');
				intitule = result.responseXML.documentElement.getAttribute('Intitule');
				type = (result.responseXML.documentElement.getAttribute('Direct')=='true');
				actif = (result.responseXML.documentElement.getAttribute('Actif')=='true');
				
				centreId1 = result.responseXML.documentElement.getAttribute('Centre_Id1');
				centreId2 = result.responseXML.documentElement.getAttribute('Centre_Id2');
				centreId3 = result.responseXML.documentElement.getAttribute('Centre_Id3');
				centreId4 = result.responseXML.documentElement.getAttribute('Centre_Id4');
				centreId5 = result.responseXML.documentElement.getAttribute('Centre_Id5');
				
				centreId1 = (centreId1!=null?centreId1:0);
				centreId2 = (centreId2!=null?centreId2:0);
				centreId3 = (centreId3!=null?centreId3:0);
				centreId4 = (centreId4!=null?centreId4:0);
				centreId5 = (centreId5!=null?centreId5:0);
				
				// affichage du compte
				document.getElementById('numero').value = numero;
				document.getElementById('intitule').value = intitule;
				document.getElementById('type').value = type?1:0;
				document.getElementById('chkActif').checked = actif;
				
				document.getElementById('listeCentre1').value = centreId1;
				document.getElementById('listeCentre2').value = centreId2;
				document.getElementById('listeCentre3').value = centreId3;
				document.getElementById('listeCentre4').value = centreId4;
				document.getElementById('listeCentre5').value = centreId5;
				
				activeMenu(true);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnCsv() {
	try {
		activeMenu(false);
		editCsv();
	} catch (e) {
		recup_erreur(e);
	}
}

function editCsv() {
 	try {
 		var qCSV = new QueryHttp("Compta/Analytique/Comptes/editionCsvComptes.tmpl");
 		// params
 		qCSV.setParam("Numero", filtreNumero);
 		qCSV.setParam("Intitule", filtreIntitule);
 		if (filtreType!=2) {
 			qCSV.setParam("Direct", filtreType);
 		}
 		if (filtreActif!=2) {
 			qCSV.setParam("Actif", filtreActif);
 		}
 		
 		var result = qCSV.execute();
 		
 		var fichier = result.responseXML.documentElement.getAttribute("FichierCSV");
 		var nomFichier = "liste_comptes_analytiques.csv";
 		
 		var file = fileChooser("save", nomFichier);
 		
 		if (file!=null) {
 			downloadFile(getDirBuffer()+fichier,file);
 		}
 		activeMenu(true);
	} catch (e) {
  		recup_erreur(e);
	}
}

function selectOnType() {
	try {
		activeMenu(false);
		type = (document.getElementById('type').value==1);
		resetCentres();
		activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function checkOnChkActif() {
	try {
		actif = document.getElementById('chkActif').checked;
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnListeCentre1() {
	try {
		activeMenu(false);
		if (document.getElementById('listeCentre1').value==0) {
			document.getElementById('listeCentre2').value = 0;
			document.getElementById('listeCentre3').value = 0;
			document.getElementById('listeCentre4').value = 0;
			document.getElementById('listeCentre5').value = 0;
		}
		majNumero();
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnListeCentre2() {
	try {
		activeMenu(false);
		if (document.getElementById('listeCentre2').value==0) {
			document.getElementById('listeCentre3').value = 0;
			document.getElementById('listeCentre4').value = 0;
			document.getElementById('listeCentre5').value = 0;
		}
		majNumero();
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnListeCentre3() {
	try {
		activeMenu(false);
		if (document.getElementById('listeCentre3').value==0) {
			document.getElementById('listeCentre4').value = 0;
			document.getElementById('listeCentre5').value = 0;
		}
		majNumero();
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnListeCentre4() {
	try {
		activeMenu(false);
		if (document.getElementById('listeCentre4').value==0) {
			document.getElementById('listeCentre5').value = 0;
		}
		majNumero();
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnListeCentre5() {
	try {
		activeMenu(false);
		majNumero();
	} catch (e) {
		recup_erreur(e);
	}
}

function majNumero() {
	try {
		centreId1 = document.getElementById('listeCentre1').value;
		centreId2 = document.getElementById('listeCentre2').value;
		centreId3 = document.getElementById('listeCentre3').value;
		centreId4 = document.getElementById('listeCentre4').value;
		centreId5 = document.getElementById('listeCentre5').value;
		
		document.getElementById('numero').value = "";
		var numero = "";
		var ok = true;
		
		// construction du numéro
		if (centreId1!=0) {
			var qGetCentre = new QueryHttp("Compta/Analytique/Criteres/getCentre.tmpl");
			qGetCentre.setParam("Centre_Id", centreId1);
			var result = qGetCentre.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				ok = false;
			} else {
				 numero += result.responseXML.documentElement.getAttribute('Code');
			}
		}
		
		if (ok && centreId1!=0 && centreId2!=0) {
			var qGetCentre = new QueryHttp("Compta/Analytique/Criteres/getCentre.tmpl");
			qGetCentre.setParam("Centre_Id", centreId2);
			var result = qGetCentre.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				ok = false;
			} else {
				 numero += result.responseXML.documentElement.getAttribute('Code');
			}
		}
		
		if (ok && centreId1!=0 && centreId2!=0 && centreId3!=0) {
			var qGetCentre = new QueryHttp("Compta/Analytique/Criteres/getCentre.tmpl");
			qGetCentre.setParam("Centre_Id", centreId3);
			var result = qGetCentre.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				ok = false;
			} else {
				 numero += result.responseXML.documentElement.getAttribute('Code');
			}
		}
		
		if (ok && centreId1!=0 && centreId2!=0 && centreId3!=0 && centreId4!=0) {
			var qGetCentre = new QueryHttp("Compta/Analytique/Criteres/getCentre.tmpl");
			qGetCentre.setParam("Centre_Id", centreId4);
			var result = qGetCentre.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				ok = false;
			} else {
				 numero += result.responseXML.documentElement.getAttribute('Code');
			}
		}
		
		if (ok && centreId1!=0 && centreId2!=0 && centreId3!=0 && centreId4!=0 && centreId5!=0) {
			var qGetCentre = new QueryHttp("Compta/Analytique/Criteres/getCentre.tmpl");
			qGetCentre.setParam("Centre_Id", centreId5);
			var result = qGetCentre.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				ok = false;
			} else {
				 numero += result.responseXML.documentElement.getAttribute('Code');
			}
		}
		
		document.getElementById('numero').value = numero;
		
		activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnNouveau() {
	try {
		activeMenu(false);
		resetCompte();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnSupprimer() {
	try {
		if (compteId!=0) {
			activeMenu(false);
			deleteCompte();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function isNumeroCorrect(val) {
	try {
		var str = val.toString();
		var ok = str.length<=10;
		
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

function pressOnEnregistrer() {
	try {
		if (isEmpty(document.getElementById('numero').value) || !isNumeroCorrect(document.getElementById('numero').value)) { showWarning("Numéro de compte incorrect !"); }
		
		else if (isEmpty(document.getElementById('intitule').value)) { showWarning("Intitulé incorrect !"); }
		
		else {
			activeMenu(false);
			saveCompte();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function deleteCompte() {
	try {
		var querySuppr = new QueryHttp("Compta/Analytique/Comptes/deleteCompte.tmpl");
		
		querySuppr.setParam("Compte_Id", compteId);
		
		var result = querySuppr.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			activeMenu(true);
		} else {
			// rafraichir l'arbre
			aComptes.deleteTree();
			aComptes.initTree();
			// nouveau compte
			resetCompte();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function saveCompte() {
	try {
		var querySave = new QueryHttp("Compta/Analytique/Comptes/saveCompte.tmpl");
		
		querySave.setParam("Compte_Id", compteId);
		querySave.setParam("Numero", urlEncode(document.getElementById('numero').value));
		querySave.setParam("Intitule", urlEncode(document.getElementById('intitule').value));
		querySave.setParam("Actif", document.getElementById('chkActif').checked);
		querySave.setParam("Direct", document.getElementById('type').value!=0);
		
		querySave.setParam("Centre_Id1", centreId1);
		querySave.setParam("Centre_Id2", centreId2);
		querySave.setParam("Centre_Id3", centreId3);
		querySave.setParam("Centre_Id4", centreId4);
		querySave.setParam("Centre_Id5", centreId5);
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			activeMenu(true);
		} else {
			compteId = result.responseXML.documentElement.getAttribute('Compte_Id');
			// rafraichir l'arbre
			aComptes.deleteTree();
			aComptes.initTree();
			// rafraichir le compte
			ouvrir(compteId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}
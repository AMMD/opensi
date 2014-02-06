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

var label;
var aListeCriteres;

var aListeCentresDebut1;
var aListeCentresDebut2;
var aListeCentresDebut3;
var aListeCentresDebut4;
var aListeCentresDebut5;

var aListeCentresFin1;
var aListeCentresFin2;
var aListeCentresFin3;
var aListeCentresFin4;
var aListeCentresFin5;

var critereId1;
var critereId2;
var critereId3;
var critereId4;
var critereId5;

var critere1;
var critere2;
var critere3;
var critere4;
var critere5;

var selLigne;

function retourMenuPrincipal() {
	try {
    	window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();
	} catch (e) {
		recup_erreur(e);
	}
}

function retourGrandLivre() {
	try {
		document.getElementById('bRetourOptions').collapsed = true;
		document.getElementById('deckGrandLivre').selectedIndex = 0;
	} catch (e) {
		recup_erreur(e);
	}
}

function init() {
	try {
		aListeCriteres = new Arbre("Compta/Analytique/Criteres/listeCriteresByFormat.tmpl", 'lbListeCriteres');
		
		aListeCentresDebut1 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl", 'filtreCentreDebut1');
		aListeCentresDebut2 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl", 'filtreCentreDebut2');
		aListeCentresDebut3 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl", 'filtreCentreDebut3');
		aListeCentresDebut4 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl", 'filtreCentreDebut4');
		aListeCentresDebut5 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl", 'filtreCentreDebut5');
		
		aListeCentresFin1 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl", 'filtreCentreFin1');
		aListeCentresFin2 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl", 'filtreCentreFin2');
		aListeCentresFin3 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl", 'filtreCentreFin3');
		aListeCentresFin4 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl", 'filtreCentreFin4');
		aListeCentresFin5 = new Arbre("Compta/Analytique/Criteres/listeCentres.tmpl", 'filtreCentreFin5');
		
		var qGetCriteres = new QueryHttp("Compta/Analytique/Criteres/getCriteresByFormat.tmpl");
		
		var result = qGetCriteres.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			// enregistrement des id de critères dans l'ordre dans lequel ils vont apparaitre dans l'arbre de tri
			critereId1 = result.responseXML.documentElement.getAttribute('Critere_Id1');
			critereId2 = result.responseXML.documentElement.getAttribute('Critere_Id2');
			critereId3 = result.responseXML.documentElement.getAttribute('Critere_Id3');
			critereId4 = result.responseXML.documentElement.getAttribute('Critere_Id4');
			critereId5 = result.responseXML.documentElement.getAttribute('Critere_Id5');
			
			//alert(critereId1+","+critereId2+","+critereId3+","+critereId4+","+critereId5);
			
			// enregistrement de l'ordre des criteres dans le tri
			critere1 = critereId1;
			critere2 = critereId2;
			critere3 = critereId3;
			critere4 = critereId4;
			critere5 = critereId5;
			
			selLigne = -1;
			
			// suppression des criteres inutilisés et préparation des listes de centres
			if (critereId1==null) {
				document.getElementById('rowCritere1').collapsed = true;
			} else {
				document.getElementById('chkCritere1').label = result.responseXML.documentElement.getAttribute('Intitule1');
				aListeCentresDebut1.setParam("Critere_Id", critereId1);
				aListeCentresFin1.setParam("Critere_Id", critereId1);
			}
			if (critereId2==null) {
				document.getElementById('rowCritere2').collapsed = true;
			} else {
				document.getElementById('chkCritere2').label = result.responseXML.documentElement.getAttribute('Intitule2');
				aListeCentresDebut2.setParam("Critere_Id", critereId2);
				aListeCentresFin2.setParam("Critere_Id", critereId2);
			}
			if (critereId3==null) {
				document.getElementById('rowCritere3').collapsed = true;
			} else {
				document.getElementById('chkCritere3').label = result.responseXML.documentElement.getAttribute('Intitule3');
				aListeCentresDebut3.setParam("Critere_Id", critereId3);
				aListeCentresFin3.setParam("Critere_Id", critereId3);
			}
			if (critereId4==null) {
				document.getElementById('rowCritere4').collapsed = true;
			} else {
				document.getElementById('chkCritere4').label = result.responseXML.documentElement.getAttribute('Intitule4');
				aListeCentresDebut4.setParam("Critere_Id", critereId4);
				aListeCentresFin4.setParam("Critere_Id", critereId4);
			}
			if (critereId5==null) {
				document.getElementById('rowCritere5').collapsed = true;
			} else {
				document.getElementById('chkCritere5').label = result.responseXML.documentElement.getAttribute('Intitule5');
				aListeCentresDebut5.setParam("Critere_Id", critereId5);
				aListeCentresFin5.setParam("Critere_Id", critereId5);
			}
			
			// synchronisation des filtres
			var sia = new SyncInitArbre(finInit);
			sia.add(aListeCriteres);
	  		sia.add(aListeCentresDebut1);
	  		sia.add(aListeCentresDebut2);
	  		sia.add(aListeCentresDebut3);
	  		sia.add(aListeCentresDebut4);
	  		sia.add(aListeCentresDebut5);
	  		sia.add(aListeCentresFin1);
	  		sia.add(aListeCentresFin2);
	  		sia.add(aListeCentresFin3);
	  		sia.add(aListeCentresFin4);
	  		sia.add(aListeCentresFin5);
	  		sia.load();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function finInit() {
	try {
		activeAll(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function activeAll(boolean) {
	try {
		activeSelection(boolean);
		activePresentation(boolean);
		activePeriode(boolean);
		activeTri(boolean);
		activeSortie(boolean);
		activeEdition(boolean);
	} catch (e) {
		recup_erreur(e);
	}
}

function activeSelection(boolean) {
	try {
		document.getElementById('rgSelection').disabled = !boolean;
		document.getElementById('lNumPlage').disabled = !boolean;
		
		document.getElementById('tbCompteSingle').disabled = !boolean || document.getElementById('rgSelection').value!=2;
		document.getElementById('bRechCompteSingle').disabled = document.getElementById('tbCompteSingle').disabled;
		
		document.getElementById('tbCompteDebut').disabled = !boolean || document.getElementById('rgSelection').value!=3;
		document.getElementById('bRechCompteDebut').disabled = document.getElementById('tbCompteDebut').disabled;
		document.getElementById('tbCompteFin').disabled = !boolean || document.getElementById('rgSelection').value!=3;
		document.getElementById('bRechCompteFin').disabled = document.getElementById('tbCompteFin').disabled;
		
		activeSelectionLigneCritere(1, boolean && document.getElementById('rgSelection').value==4);
		activeSelectionLigneCritere(2, boolean && document.getElementById('rgSelection').value==4);
		activeSelectionLigneCritere(3, boolean && document.getElementById('rgSelection').value==4);
		activeSelectionLigneCritere(4, boolean && document.getElementById('rgSelection').value==4);
		activeSelectionLigneCritere(5, boolean && document.getElementById('rgSelection').value==4);
	} catch (e) {
		recup_erreur(e);
	}
}

function activeSelectionLigneCritere(numero, boolean) {
	try {
		document.getElementById('chkCritere'+numero).disabled = !boolean;
		document.getElementById('lDebCentre'+numero).disabled = !boolean;
		document.getElementById('filtreCentreDebut'+numero).disabled = !boolean || !document.getElementById('chkCritere'+numero).checked;
		document.getElementById('lFinCentre'+numero).disabled = !boolean;
		document.getElementById('filtreCentreFin'+numero).disabled = !boolean || !document.getElementById('chkCritere'+numero).checked;
	} catch (e) {
		recup_erreur(e);
	}
}

function activePresentation(boolean) {
	try {
		document.getElementById('rgPresentation').disabled = !boolean;
		document.getElementById('lPresentation').disabled = !boolean;
		
		document.getElementById('chkPresRubrique').disabled = !boolean;
		document.getElementById('chkSsTotRubrique').disabled = !boolean 
			|| !document.getElementById('chkPresRubrique').checked
			|| (document.getElementById('rgPresentation').value==1
				&& !document.getElementById('chkPresCompte').checked
				&& !document.getElementById('chkPresPeriode').checked);
		
		document.getElementById('chkPresCompte').disabled = !boolean;
		document.getElementById('chkSsTotCompte').disabled = !boolean
			|| !document.getElementById('chkPresCompte').checked
			|| (document.getElementById('rgPresentation').value==1
				&& !document.getElementById('chkPresPeriode').checked);
		
		document.getElementById('chkPresPeriode').disabled = !boolean;
		document.getElementById('chkSsTotPeriode').disabled = !boolean
			|| !document.getElementById('chkPresPeriode').checked
			|| (document.getElementById('rgPresentation').value==1);
	} catch (e) {
		recup_erreur(e);
	}
}

function activePeriode(boolean) {
	try {
		document.getElementById('rgPeriode').disabled = !boolean;
		document.getElementById('lFinPeriode').disabled = !boolean;
		
		document.getElementById('tbDateDebut').disabled = !boolean || document.getElementById('rgPeriode').value!=2;
		document.getElementById('tbDateFin').disabled = !boolean || document.getElementById('rgPeriode').value!=2;
	} catch (e) {
		recup_erreur(e);
	}
}

function activeTri(boolean) {
	try {
		document.getElementById('rgTri').disabled = !boolean;
		
		document.getElementById('lbListeCriteres').disabled = !boolean || document.getElementById('rgTri').value!=2;
		if (document.getElementById('lbListeCriteres').disabled) {
			document.getElementById('lbListeCriteres').currentIndex = -1;
			activeTriFleches(false);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function activeTriFleches(boolean) {
	try {
		/*alert("act:"+(boolean?"true":"false")
			+",ind:"+document.getElementById('lbListeCriteres').currentIndex
			+",max:"+(document.getElementById('lbListeCriteres').itemCount-1));*/
		
		document.getElementById('bFlecheHaut').disabled = !boolean || (document.getElementById('lbListeCriteres').currentIndex==-1) || (document.getElementById('lbListeCriteres').currentIndex==0);
		document.getElementById('bFlecheBas').disabled = !boolean || (document.getElementById('lbListeCriteres').currentIndex==-1) || (document.getElementById('lbListeCriteres').currentIndex==(document.getElementById('lbListeCriteres').itemCount-1));
	} catch (e) {
		recup_erreur(e);
	}
}

function activeSortie(boolean) {
	try {
		document.getElementById('rgSortie').disabled = !boolean;
		
		document.getElementById('lbListeCriteres').disabled = !boolean || document.getElementById('rgTri').value!=2;
		document.getElementById('bFlecheHaut').disabled = !boolean || document.getElementById('rgTri').value!=2;
		document.getElementById('bFlecheBas').disabled = !boolean || document.getElementById('rgTri').value!=2;
	} catch (e) {
		recup_erreur(e);
	}
}

function activeEdition(boolean) {
	try {
		document.getElementById('bEdition').disabled = !boolean;
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnRgSelection() {
	try {
		activeSelection(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnRechCompteDebut() {
	try {
		activeSelection(false);
		rechercheCompteDebut(document.getElementById('tbCompteDebut').value);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnRechCompteFin() {
	try {
		activeSelection(false);
		rechercheCompteFin(document.getElementById('tbCompteFin').value);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnRechCompteSingle() {
	try {
		activeSelection(false);
		rechercheCompteSingle(document.getElementById('tbCompteSingle').value);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnChkCritere1() {
	try {
		activeSelectionLigneCritere(1, true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnChkCritere2() {
	try {
		activeSelectionLigneCritere(2, true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnChkCritere3() {
	try {
		activeSelectionLigneCritere(3, true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnChkCritere4() {
	try {
		activeSelectionLigneCritere(4, true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnChkCritere5() {
	try {
		activeSelectionLigneCritere(5, true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnRgPresentation() {
	try {
		pressOnPresentation();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnChkPresRubrique() {
	try {
		pressOnPresentation();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnChkPresCompte() {
	try {
		pressOnPresentation();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnChkPresPeriode() {
	try {
		pressOnPresentation();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnPresentation() {
	try {
		activePresentation(true);
		regulePresentation();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnRgPeriode() {
	try {
		activePeriode(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnRgTri() {
	try {
		if (document.getElementById('rgTri').value==1) {
			document.getElementById('lbListeCriteres').selectedIndex = -1;
			selLigne = -1;
		}
		activeTri(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnListeCriteres() {
	try {
		activeTriFleches(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnFlecheHaut() {
	try {
		activeTriFleches(false);
		selLigne = document.getElementById('lbListeCriteres').selectedIndex;
		deplacerCritereHaut(document.getElementById('lbListeCriteres').getSelectedItem(0).getElementsByTagName("listcell").item(1).getAttribute("label"));
		activeTriFleches(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnFlecheBas() {
	try {
		activeTriFleches(false);
		selLigne = document.getElementById('lbListeCriteres').selectedIndex;
		deplacerCritereBas(document.getElementById('lbListeCriteres').getSelectedItem(0).getElementsByTagName("listcell").item(1).getAttribute("label"));
		activeTriFleches(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnRgSortie() {
	try {
		activeSortie(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnEdition() {
	try {
		// verif select single
		if (document.getElementById('rgSelection').value==2
			&& !isNumeroCorrect(document.getElementById('tbCompteSingle').value)) {
			showWarning("Compte sélectionné incorrect !");
		}
		// verif select plage
		else if (document.getElementById('rgSelection').value==3
			&& (!isNumeroCorrect(document.getElementById('tbCompteDebut').value)
				|| !isNumeroCorrect(document.getElementById('tbCompteFin').value)
				|| document.getElementById('tbCompteDebut').value > document.getElementById('tbCompteFin').value)) {
			showWarning("Plage de comptes sélectionné incorrecte !");
		}
		// verif select critere
		else if (document.getElementById('rgSelection').value==4
			&& !(document.getElementById('chkCritere1').checked
				|| document.getElementById('chkCritere2').checked
				|| document.getElementById('chkCritere3').checked
				|| document.getElementById('chkCritere4').checked
				|| document.getElementById('chkCritere5').checked)) {
			showWarning("Veuillez sélectionner au moins un critère !");
		}
		else if (document.getElementById('rgSelection').value==4
			&& document.getElementById('chkCritere1').checked
			&& (isEmpty(document.getElementById('filtreCentreDebut1').value)
				|| isEmpty(document.getElementById('filtreCentreFin1').value))) {
			showWarning("Veuillez sélectionner un centre de début et un centre de fin pour le critère n°1 !");
		}
		else if (document.getElementById('rgSelection').value==4
			&& document.getElementById('chkCritere1').checked
			&& (document.getElementById('filtreCentreDebut1').value > document.getElementById('filtreCentreFin1').value)) {
			showWarning("La plage de centre est incorrecte pour le critère n°1 !");
		}
		else if (document.getElementById('rgSelection').value==4
			&& document.getElementById('chkCritere2').checked
			&& (isEmpty(document.getElementById('filtreCentreDebut2').value)
				|| isEmpty(document.getElementById('filtreCentreFin2').value))) {
			showWarning("Veuillez sélectionner un centre de début et un centre de fin pour le critère n°2 !");
		}
		else if (document.getElementById('rgSelection').value==4
			&& document.getElementById('chkCritere2').checked
			&& (document.getElementById('filtreCentreDebut2').value > document.getElementById('filtreCentreFin2').value)) {
			showWarning("La plage de comptes est incorrecte pour le critère n°2 !");
		}
		else if (document.getElementById('rgSelection').value==4
			&& document.getElementById('chkCritere3').checked
			&& (isEmpty(document.getElementById('filtreCentreDebut3').value)
				|| isEmpty(document.getElementById('filtreCentreFin3').value))) {
			showWarning("Veuillez sélectionner un centre de début et un centre de fin pour le critère n°3 !");
		}
		else if (document.getElementById('rgSelection').value==4
			&& document.getElementById('chkCritere3').checked
			&& (document.getElementById('filtreCentreDebut3').value > document.getElementById('filtreCentreFin3').value)) {
			showWarning("La plage de comptes est incorrecte pour le critère n°3 !");
		}
		else if (document.getElementById('rgSelection').value==4
			&& document.getElementById('chkCritere4').checked
			&& (isEmpty(document.getElementById('filtreCentreDebut4').value)
				|| isEmpty(document.getElementById('filtreCentreFin4').value))) {
			showWarning("Veuillez sélectionner un centre de début et un centre de fin pour le critère n°4 !");
		}
		else if (document.getElementById('rgSelection').value==4
			&& document.getElementById('chkCritere4').checked
			&& (document.getElementById('filtreCentreDebut4').value > document.getElementById('filtreCentreFin4').value)) {
			showWarning("La plage de comptes est incorrecte pour le critère n°4 !");
		}
		else if (document.getElementById('rgSelection').value==4
			&& document.getElementById('chkCritere5').checked
			&& (isEmpty(document.getElementById('filtreCentreDebut5').value)
				|| isEmpty(document.getElementById('filtreCentreFin5').value))) {
			showWarning("Veuillez sélectionner un centre de début et un centre de fin pour le critère n°5 !");
		}
		else if (document.getElementById('rgSelection').value==4
			&& document.getElementById('chkCritere5').checked
			&& (document.getElementById('filtreCentreDebut5').value > document.getElementById('filtreCentreFin5').value)) {
			showWarning("La plage de comptes est incorrecte pour le critère n°5 !");
		}
		// verif periode
		else if (document.getElementById('rgPeriode').value==2
			&& (!isPeriode(document.getElementById('tbDateDebut').value)
				|| !isPeriode(document.getElementById('tbDateFin').value)
				|| !isPeriodeInterval(document.getElementById('tbDateDebut').value, document.getElementById('tbDateFin').value))) {
			showWarning("Periode incorrecte !");
			/*
			alert("deb : "+document.getElementById('tbDateDebut').value+", per ? "+(isPeriode(document.getElementById('tbDateDebut').value)?"oui":"non")
				+"; fin : "+document.getElementById('tbDateFin').value+", per ? "+(isPeriode(document.getElementById('tbDateFin').value)?"oui":"non")
				+"; inter ? "+isPeriodeInterval(document.getElementById('tbDateDebut').value, document.getElementById('tbDateFin').value));
			*/
		}
		// verif presentation
		else if (document.getElementById('rgPresentation').value==1
			&& !document.getElementById('chkPresRubrique').checked
			&& !document.getElementById('chkPresCompte').checked
			&& !document.getElementById('chkPresPeriode').checked) {
			showWarning("Veuillez choisir au moins un niveau de rupture pour le calcul des totaux !")
		}
		// sinon go
		else {
			activeAll(false);
    		editGrandLivre();
    		activeAll(true);
    	}
	} catch (e) {
		recup_erreur(e);
	}
}

function rechercheCompteSingle(numero) {
	try {
		var url = "chrome://opensi/content/compta/user/analytique/comptes/popup-rechCompteAna.xul?"+ cookie();
    	window.openDialog(url,'','chrome,modal,centerscreen',finRechercheCompteSingle,urlEncode(numero));
	} catch (e) {
		recup_erreur(e);
	}
}

function finRechercheCompteSingle(id ,numero) {
	try {
		document.getElementById('tbCompteSingle').value = numero;
		activeSelection(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function rechercheCompteDebut(numero) {
	try {
		var url = "chrome://opensi/content/compta/user/analytique/comptes/popup-rechCompteAna.xul?"+ cookie();
    	window.openDialog(url,'','chrome,modal,centerscreen',finRechercheCompteDebut,urlEncode(numero));
	} catch (e) {
		recup_erreur(e);
	}
}

function finRechercheCompteDebut(id ,numero) {
	try {
		document.getElementById('tbCompteDebut').value = numero;
		activeSelection(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function rechercheCompteFin(numero) {
	try {
		var url = "chrome://opensi/content/compta/user/analytique/comptes/popup-rechCompteAna.xul?"+ cookie();
    	window.openDialog(url,'','chrome,modal,centerscreen',finRechercheCompteFin,urlEncode(numero));
	} catch (e) {
		recup_erreur(e);
	}
}

function finRechercheCompteFin(id ,numero) {
	try {
		document.getElementById('tbCompteFin').value = numero;
		activeSelection(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function isNumeroCorrect(val) {
	try {
		var str = val.toString();
		var ok = !isEmpty(str) && str.length<=10;
		
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

function regulePresentation() {
	try {
		document.getElementById('chkPresRubrique').checked = !document.getElementById('chkPresRubrique').disabled && document.getElementById('chkPresRubrique').checked;
		document.getElementById('chkSsTotRubrique').checked = !document.getElementById('chkSsTotRubrique').disabled && document.getElementById('chkSsTotRubrique').checked;
		
		document.getElementById('chkPresCompte').checked = !document.getElementById('chkPresCompte').disabled && document.getElementById('chkPresCompte').checked;
		document.getElementById('chkSsTotCompte').checked = !document.getElementById('chkSsTotCompte').disabled && document.getElementById('chkSsTotCompte').checked;
		
		document.getElementById('chkPresPeriode').checked = !document.getElementById('chkPresPeriode').disabled && document.getElementById('chkPresPeriode').checked;
		document.getElementById('chkSsTotPeriode').checked = !document.getElementById('chkSsTotPeriode').disabled && document.getElementById('chkSsTotPeriode').checked;
	} catch (e) {
		recup_erreur(e);
	}
}

function deplacerCritereHaut(critereId) {
	try {
		if (critere5==critereId) {
			critere5 = critere4;
			critere4 = critereId;
		} else if (critere4==critereId) {
			critere4 = critere3;
			critere3 = critereId;
		} else if (critere3==critereId) {
			critere3 = critere2;
			critere2 = critereId;
		} else if (critere2==critereId) {
			critere2 = critere1;
			critere1 = critereId;
		}
		selLigne = selLigne-1;
		resetListeCriteres();
	} catch (e) {
		recup_erreur(e);
	}
}

function deplacerCritereBas(critereId) {
	try {
		if (critere1==critereId) {
			critere1 = critere2;
			critere2 = critereId;
		} else if (critere2==critereId) {
			critere2 = critere3;
			critere3 = critereId;
		} else if (critere3==critereId) {
			critere3 = critere4;
			critere4 = critereId;
		} else if (critere4==critereId) {
			critere4 = critere5;
			critere5 = critereId;
		}
		selLigne = selLigne+1
		resetListeCriteres();
	} catch (e) {
		recup_erreur(e);
	}
}

function resetListeCriteres() {
	try {
		aListeCriteres.clearParams();
		aListeCriteres.setParam("Critere_Id1", critere1);
		aListeCriteres.setParam("Critere_Id2", critere2);
		aListeCriteres.setParam("Critere_Id3", critere3);
		aListeCriteres.setParam("Critere_Id4", critere4);
		aListeCriteres.setParam("Critere_Id5", critere5);
		aListeCriteres.initTree(restoreSelectionListeCriteres);
	} catch (e) {
		recup_erreur(e);
	}
}

function restoreSelectionListeCriteres() {
	try {
		document.getElementById("lbListeCriteres").selectedIndex = selLigne;
	} catch (e) {
		recup_erreur(e);
	}
}

function editGrandLivre() {
	try {
		//alert("edit");
 		// requete d'edition
		var qEdit = new QueryHttp("Compta/Analytique/Ecritures/editionGrandLivre.tmpl");
		
		// params selection
		qEdit.setParam("Selection", document.getElementById('rgSelection').value);
		qEdit.setParam("CompteSingle", document.getElementById('tbCompteSingle').value);
		qEdit.setParam("CompteDebut", document.getElementById('tbCompteDebut').value);
		qEdit.setParam("CompteFin", document.getElementById('tbCompteFin').value);
		
 		qEdit.setParam("CritereId1", critereId1);
 		qEdit.setParam("CritereId2", critereId2);
 		qEdit.setParam("CritereId3", critereId3);
 		qEdit.setParam("CritereId4", critereId4);
 		qEdit.setParam("CritereId5", critereId5);
		qEdit.setParam("ChkCritere1", document.getElementById('chkCritere1').checked);
		qEdit.setParam("DebCentre1", document.getElementById('filtreCentreDebut1').value);
		qEdit.setParam("FinCentre1", document.getElementById('filtreCentreFin1').value);
		qEdit.setParam("ChkCritere2", document.getElementById('chkCritere2').checked);
		qEdit.setParam("DebCentre2", document.getElementById('filtreCentreDebut2').value);
		qEdit.setParam("FinCentre2", document.getElementById('filtreCentreFin2').value);
		qEdit.setParam("ChkCritere3", document.getElementById('chkCritere3').checked);
		qEdit.setParam("DebCentre3", document.getElementById('filtreCentreDebut3').value);
		qEdit.setParam("FinCentre3", document.getElementById('filtreCentreFin3').value);
		qEdit.setParam("ChkCritere4", document.getElementById('chkCritere4').checked);
		qEdit.setParam("DebCentre4", document.getElementById('filtreCentreDebut4').value);
		qEdit.setParam("FinCentre4", document.getElementById('filtreCentreFin4').value);
		qEdit.setParam("ChkCritere5", document.getElementById('chkCritere5').checked);
		qEdit.setParam("DebCentre5", document.getElementById('filtreCentreDebut5').value);
		qEdit.setParam("FinCentre5", document.getElementById('filtreCentreFin5').value);
		
		// params presentation
		qEdit.setParam("Presentation", document.getElementById('rgPresentation').value);
		qEdit.setParam("ChkPresRubrique", document.getElementById('chkPresRubrique').checked);
		qEdit.setParam("ChkSsTotRubrique", document.getElementById('chkSsTotRubrique').checked);
		qEdit.setParam("ChkPresCompte", document.getElementById('chkPresCompte').checked);
		qEdit.setParam("ChkSsTotCompte", document.getElementById('chkSsTotCompte').checked);
		qEdit.setParam("ChkPresPeriode", document.getElementById('chkPresPeriode').checked);
		qEdit.setParam("ChkSsTotPeriode", document.getElementById('chkSsTotPeriode').checked);
		
		// params periode
		qEdit.setParam("Periode", document.getElementById('rgPeriode').value);
		qEdit.setParam("DateDebut", document.getElementById('tbDateDebut').value);
		qEdit.setParam("DateFin", document.getElementById('tbDateFin').value);
		
 		// params tri
 		qEdit.setParam("Tri", document.getElementById('rgTri').value);
 		qEdit.setParam("Critere1", critere1);
 		qEdit.setParam("Critere2", critere2);
 		qEdit.setParam("Critere3", critere3);
 		qEdit.setParam("Critere4", critere4);
 		qEdit.setParam("Critere5", critere5);
 		
 		// params sortie
 		var sortie = document.getElementById('rgSortie').value;
 		qEdit.setParam("Sortie", sortie);
 		
 		// execution requete
 		var result = qEdit.execute();
 		var errors = new Errors(result);
 		
 		if (errors.hasNext()) {
			errors.show();
		} else {
	 		var fichier = result.responseXML.documentElement.getAttribute("Fichier");
	 		
	 		// traitement resultat
	 		if (sortie==1) {
	 			//alert("pdf");
				document.getElementById('bRetourOptions').collapsed = false;
	 			document.getElementById('deckGrandLivre').selectedIndex = 1;
	 			var page = getDirPdf()+fichier;
	 			document.getElementById('pdfGrandLivre').setAttribute("src", page);
	 		} else if (sortie==2) {
	 			//alert("csv");
		 		var nomFichier = "grand_livre_analytique.csv";
		 		
		 		var file = fileChooser("save", nomFichier);
		 		
		 		if (file!=null) {
		 			downloadFile(getDirBuffer()+fichier,file);
		 		}
	 		}
	 	}
	} catch (e) {
		recup_erreur(e);
	}
}
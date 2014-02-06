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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");

var ismenu = true;
var numop = '';
var popup='';
var currentAction = "C";
var currentJournalInitial = "0";

var aPeriodesSourceDebut = new Arbre("Compta/GetRDF/Get_periode.tmpl", 'periode_initiale');
var aPeriodesSourceFin = new Arbre("Compta/GetRDF/Get_periode.tmpl", 'periode_initiale_intervalle');

var nf = new NumberFormat("00", false);

function init() {
  try {
  	
  	var aJournaux = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'journal_initial');
		aJournaux.initTree(initialiser1);

  } catch (e) {
    recup_erreur(e);
  }
}

function initialiser1() {
	try {
		document.getElementById("journal_initial").selectedIndex = 0;
	
		var aExinit = new Arbre('Compta/GetRDF/Dossier.tmpl', 'exercice_initial');
		aExinit.initTree(initialiser2);
	} catch (e) {
		recup_erreur(e);
	}
}

function initialiser2() {
	try {
		var num_exo_courant= get_cookie('Num_Exercice');
		document.getElementById('exercice_initial').value = num_exo_courant;
	
		if (document.getElementById('exercice_initial').selectedIndex == -1) {
			document.getElementById('exercice_initial').selectedIndex = 0;
		}
		pressOnExerciceSource();
		
		initialiser5();
	} catch (e) {
		recup_erreur(e);
	}
}


function initialiser3() {
	try {
		document.getElementById("periode_initiale").selectedIndex = 0;
		var exercice=document.getElementById('exercice_initial').value;

		aPeriodesSourceFin.setParam("Sans_Cloture", currentAction=="C"?"0":"1");
		aPeriodesSourceFin.setParam("Num_Exercice",exercice);
		aPeriodesSourceFin.initTree(initialiser4);
	} catch (e) {
		recup_erreur(e);
	}
}

function initialiser4() {
	try {
		document.getElementById("periode_initiale_intervalle").selectedIndex = 0;
		
	} catch (e) {
		recup_erreur(e);
	}
}

function initialiser5() {
	try {
		var bJournaux = new Arbre('Compta/GetRDF/combo-journauxSansAN.tmpl', 'journal_cible');
		bJournaux.initTree(initialiser6);
	} catch (e) {
		recup_erreur(e);
	}
}

function initialiser6() {
	try {
		document.getElementById("journal_cible").selectedIndex = 0;
		var aExcible = new Arbre('Compta/GetRDF/Exercices_ouverts.tmpl', 'exercice_cible');
		aExcible.initTree(initialiser7);
	} catch (e) {
		recup_erreur(e);
	}
}

function initialiser7(){
	try {
		var num_exo_courant=(get_cookie('Num_Exercice'));
		document.getElementById('exercice_cible').value = num_exo_courant;
	
		if (document.getElementById('exercice_cible').selectedIndex == -1) {
			document.getElementById('exercice_cible').selectedIndex = 0;
		}
		
		pressOnExerciceDestination();
	} catch (e) {
		recup_erreur(e);
	}
}

function initialiser8() {
	try {
		document.getElementById("periode_cible").selectedIndex = 0;
		var exercice=document.getElementById('exercice_cible').value;
		
		var bPeriodesintervalle = new Arbre("Compta/GetRDF/Get_periode.tmpl", 'periode_cible_intervalle');
		bPeriodesintervalle.setParam("Sans_Cloture","1");
		bPeriodesintervalle.setParam("Num_Exercice",exercice);
		bPeriodesintervalle.initTree(initialiser9);
	} catch (e) {
		recup_erreur(e);
	}
}


function initialiser9() {
	try {
		document.getElementById("periode_cible_intervalle").selectedIndex = 0;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnExerciceSource() {
	try {
		var exercice=document.getElementById('exercice_initial').value;
		if (exercice != "") {
			aPeriodesSourceDebut.setParam("Sans_Cloture", currentAction=="C"?"0":"1");
			aPeriodesSourceDebut.setParam("Num_Exercice",exercice);
			aPeriodesSourceDebut.initTree(initialiser3);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnExerciceDestination() {
	try {
		var exercice=document.getElementById('exercice_cible').value;
		if (exercice != "") {
			var bPeriodes = new Arbre("Compta/GetRDF/Get_periode.tmpl", 'periode_cible');
			bPeriodes.setParam("Sans_Cloture","1");
			bPeriodes.setParam("Num_Exercice",exercice);
			bPeriodes.initTree(initialiser8);
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function etat_avancement(){
	try {
		var url = "chrome://opensi/content/compta/user/autres/popup_avancement.xul?"+ cookie();
	  popup=window.openDialog(url,'','chrome,centerscreen');
	} catch (e) {
		recup_erreur(e);
	}
}


function close_etat_avancement(){
	try {
		if (popup!=""){
	   	popup.close();
		}
	} catch (e) {
		recup_erreur(e);
	}
}
function focus_tree() {
  try {

		var tree = document.getElementById('exercice_initial');
		var tree2 = document.getElementById('exercice_cible');
		if (tree.view!=null) {
    	tree.focus();
    	tree.view.selection.select(1);
		}
		if (tree2.view!=null) {
    	tree2.focus();
    	tree2.view.selection.select(1);
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnChoix() {
	try {
		
		var choix = document.getElementById('Choix').value;

		document.getElementById('num1').disabled = (choix!="B");
		document.getElementById('num2').disabled = (choix!="B");
		
		document.getElementById('date1').disabled = (choix!="C");
		document.getElementById('date2').disabled = (choix!="C");

	} catch (e) {
    recup_erreur(e);
  }
}


function copie_ecriture() {
  try	{
  	
  	var exercice_initial=document.getElementById("exercice_initial").value;
		var exercice_cible=document.getElementById("exercice_cible").value;
    var journal_initial=document.getElementById("journal_initial").value;
		var journal_cible=document.getElementById("journal_cible").value;
		var periode_initiale=document.getElementById("periode_initiale").value;
		var periode_cible=document.getElementById("periode_cible").value;
		var periode_initiale_int=document.getElementById("periode_initiale_intervalle").value;
		var periode_cible_int=document.getElementById("periode_cible_intervalle").value;
		var extourne = document.getElementById("Extourne").checked;
		var choix = document.getElementById("Choix").value;
		var num1=document.getElementById("num1").value;
		var num2=document.getElementById("num2").value;
		var date1=document.getElementById("date1").value;
		var date2=document.getElementById("date2").value;

		if (journal_initial=="0") { showWarning("Veuillez choisir un journal source !"); }
		else if (journal_cible=="0") { showWarning("Veuillez choisir un journal de destination !"); }
		else if (periode_initiale=="0") { showWarning("Veuillez choisir une période source de début !"); }
		else if (periode_initiale_int=="0") { showWarning("Veuillez choisir une période source de fin !"); }
		else if (periode_cible=="0") { showWarning("Veuillez choisir une période de destination de début !"); }
		else if (periode_cible_int=="0") { showWarning("Veuillez choisir une période de destination de fin !"); }
		else if (choix=="B" && (!isPositiveInteger(num1) || !isPositiveInteger(num2) || parseIntBis(num1)>parseIntBis(num2))) { showWarning("La plage de numéros d'écritures n'est pas valide !"); }
		else if (choix=="C" && (!isPositiveInteger(date1) || !isPositiveInteger(date2) || parseIntBis(date1)>31 || parseIntBis(date2)>31 || parseIntBis(date1)>parseIntBis(date2))) { showWarning("La plage de dates n'est pas valide !"); }
		else if (verifIntervalle()){

			var dlg="Confirmez-vous la copie des écritures de l'exercice "+document.getElementById("exercice_initial").selectedItem.label+" du journal "+document.getElementById("journal_initial").selectedItem.label+" pour les périodes : "+ document.getElementById("periode_initiale").selectedItem.label+" - "+document.getElementById("periode_initiale_intervalle").selectedItem.label+" ?";
			
			if (window.confirm(dlg)) {
				
				close_etat_avancement();

				document.getElementById("Progression").collapsed = false;
				document.getElementById('pm').setAttribute('mode','undetermined');
				document.getElementById("bMenuPrincipal").collapsed = true;
				var periode_cible=document.getElementById("periode_cible").value;
				var queryEdit = new QueryHttp("Compta/Saisie/CopieJournal.tmpl");
				queryEdit.setParam("ExerciceDest",exercice_cible);
				queryEdit.setParam("JournalDest",journal_cible);
				queryEdit.setParam("PeriodeDestDebut",periode_cible);
				queryEdit.setParam("Extourne",extourne);
				queryEdit.setParam("ExerciceSrc",exercice_initial);
				queryEdit.setParam("JournalSrc",journal_initial);
				queryEdit.setParam("PeriodeSrcDebut",periode_initiale);
				queryEdit.setParam("PeriodeSrcFin",periode_initiale_int);
				queryEdit.setParam("TypeSel",choix);
				if (choix=="B"){
					queryEdit.setParam("NumEcrDebut",num1);
					queryEdit.setParam("NumEcrFin",num2);
				}
				if (choix=="C"){
					queryEdit.setParam("JourDebut",date1);
					queryEdit.setParam("JourFin",date2);
				}
  			var result = queryEdit.execute();

				document.getElementById("Progression").collapsed = true;
				document.getElementById('pm').setAttribute('mode','none');
				document.getElementById("bMenuPrincipal").collapsed = false;
				
				var errors = new Errors(result);

				if (errors.hasNext()) {		
					errors.show();
				} else {
					var contenu = result.responseXML.documentElement;
					var nbreecriture= contenu.getAttribute('NbEcrCopy');
	
					if (periode_initiale!=periode_initiale_int) {
						showMessage(nbreecriture+ " écritures ont été insérées dans le journal "+document.getElementById("journal_cible").selectedItem.label+" pour les périodes du "+document.getElementById("periode_cible").selectedItem.label+ " au " +document.getElementById("periode_cible_intervalle").selectedItem.label+" de l'exercice "+document.getElementById("exercice_cible").selectedItem.label);
					}
					else {
						showMessage(nbreecriture+ " écritures ont été insérées dans le journal "+document.getElementById("journal_cible").selectedItem.label+" pour la période "+document.getElementById("periode_cible").selectedItem.label+" de l'exercice "+document.getElementById("exercice_cible").selectedItem.label);
					}
				}
			}
  	}
  	else {
			showMessage("L'intervalle des périodes initiales et cibles doit être identique !");
		}
		
  } catch (e) {
    recup_erreur(e);
  }
}


function suppression_ecriture() {
	try {

		var exercice_initial=document.getElementById("exercice_initial").value;
	  var journal_initial=document.getElementById("journal_initial").value;
		var periode_initiale=document.getElementById("periode_initiale").value;
		var periode_initiale_int=document.getElementById("periode_initiale_intervalle").value;
		var choix=document.getElementById("Choix").value;
		var num1=document.getElementById("num1").value;
		var num2=document.getElementById("num2").value;
		var date1=document.getElementById("date1").value;
		var date2=document.getElementById("date2").value;
		var supprimerLettrage=document.getElementById("chkSupprLettrage").checked;

		if (journal_initial=="0") { showWarning("Veuillez choisir un journal source !"); }
		else if (periode_initiale=="0") { showWarning("Veuillez choisir une période source de début !"); }
		else if (periode_initiale_int=="0") { showWarning("Veuillez choisir une période source de fin !"); }
		else if (choix=="B" && (!isPositiveInteger(num1) || !isPositiveInteger(num2) || parseIntBis(num1)>parseIntBis(num2))) { showWarning("La plage de numéros d'écritures n'est pas valide !"); }
		else if (choix=="C" && (!isPositiveInteger(date1) || !isPositiveInteger(date2) || parseIntBis(date1)>31 || parseIntBis(date2)>31 || parseIntBis(date1)>parseIntBis(date2))) { showWarning("La plage de dates n'est pas valide !"); }
		else {
			var dlg="Confirmez-vous la suppression des écritures de l'exercice "+document.getElementById("exercice_initial").selectedItem.label+" du journal "+document.getElementById("journal_initial").selectedItem.label +" de la période : "+document.getElementById("periode_initiale").selectedItem.label+ " à "+document.getElementById("periode_initiale_intervalle").selectedItem.label +" ?";

			if (window.confirm(dlg) ) {
				close_etat_avancement();

				document.getElementById("Progression").collapsed = false;
				document.getElementById('pm').setAttribute('mode','undetermined');
				document.getElementById("bMenuPrincipal").collapsed = true;
				var periode_cible=document.getElementById("periode_cible").value;
				var queryEdit = new QueryHttp("Compta/Saisie/SupJournal.tmpl");

				queryEdit.setParam("ExerciceSrc",exercice_initial);
				queryEdit.setParam("JournalSrc",journal_initial);
				queryEdit.setParam("PeriodeDebut",periode_initiale);
				queryEdit.setParam("PeriodeFin",periode_initiale_int);
				queryEdit.setParam("TypeSel",choix);
				queryEdit.setParam("SupLet",supprimerLettrage);
				if (choix=="B"){
					queryEdit.setParam("NumEcrDebut",num1);
					queryEdit.setParam("NumEcrFin",num2);
				}
				if (choix=="C"){
					queryEdit.setParam("JourDebut",date1);
					queryEdit.setParam("JourFin",date2);
				}
				
	  		var result = queryEdit.execute();
				
				document.getElementById("Progression").collapsed = true;
				document.getElementById('pm').setAttribute('mode','none');
				document.getElementById("bMenuPrincipal").collapsed = false;
				
				var errors = new Errors(result);

				if (errors.hasNext()) {		
					errors.show();
				}
				else {				
					var contenu = result.responseXML.documentElement;
					var nbreecriture = contenu.getAttribute('NbEcrSup');
					var nontransfereLR = contenu.getAttribute('NonTransRB');

					if (periode_initiale!=periode_initiale_int) {
						showMessage(nbreecriture+ " écritures ont été supprimées du journal "+document.getElementById("journal_initial").selectedItem.label+" pour les périodes : "+document.getElementById("periode_initiale").selectedItem.label+ " à " +document.getElementById("periode_initiale_intervalle").selectedItem.label+" de l'exercice "+document.getElementById("exercice_initial").selectedItem.label);
					} else {
						showMessage(nbreecriture+ " écritures ont été supprimées du journal "+document.getElementById("journal_initial").selectedItem.label+" pour la période "+document.getElementById("periode_initiale").selectedItem.label+" de l'exercice "+document.getElementById("exercice_initial").selectedItem.label);
					}

					if (nontransfereLR>0){
						showWarning(nontransfereLR+ " écritures n'ont pas été supprimées (opérations présentes en rapprochement bancaire)");
					}
				}
			}

		}
		
  } catch (e) {
    recup_erreur(e);
  }
}


function transfert_ecriture() {
	try {
		
		var exercice_initial=document.getElementById("exercice_initial").value;
		var exercice_cible=document.getElementById("exercice_cible").value;
    var journal_initial=document.getElementById("journal_initial").value;
		var journal_cible=document.getElementById("journal_cible").value;
		var periode_initiale=document.getElementById("periode_initiale").value;
		var periode_cible=document.getElementById("periode_cible").value;
		var periode_initiale_int=document.getElementById("periode_initiale_intervalle").value;
		var periode_cible_int=document.getElementById("periode_cible_intervalle").value;
		var extourne=document.getElementById("Extourne").checked;
		var choix=document.getElementById("Choix").value;
		var num1=document.getElementById("num1").value;
		var num2=document.getElementById("num2").value;
		var date1=document.getElementById("date1").value;
		var date2=document.getElementById("date2").value;

		if (document.getElementById("journal_initial").selectedItem.tooltip=="AN") { showMessage("Vous ne pouvez pas transférer les journaux d'A NOUVEAUX"); }
		else if (journal_initial=="0") { showWarning("Veuillez choisir un journal source !"); }
		else if (journal_cible=="0") { showWarning("Veuillez choisir un journal de destination !"); }
		else if (periode_initiale=="0") { showWarning("Veuillez choisir une période source de début !"); }
		else if (periode_initiale_int=="0") { showWarning("Veuillez choisir une période source de fin !"); }
		else if (periode_cible=="0") { showWarning("Veuillez choisir une période de destination de début !"); }
		else if (periode_cible_int=="0") { showWarning("Veuillez choisir une période de destination de fin !"); }
		else if (choix=="B" && (!isPositiveInteger(num1) || !isPositiveInteger(num2) || parseIntBis(num1)>parseIntBis(num2))) { showWarning("La plage de numéros d'écritures n'est pas valide !"); }
		else if (choix=="C" && (!isPositiveInteger(date1) || !isPositiveInteger(date2) || parseIntBis(date1)>31 || parseIntBis(date2)>31 || parseIntBis(date1)>parseIntBis(date2))) { showWarning("La plage de dates n'est pas valide !"); }
		else if (verifIntervalle()) {

			var dlg="Confirmez-vous le transfert des écritures de l'exercice "+document.getElementById("exercice_initial").selectedItem.label+" du journal "+document.getElementById("journal_initial").selectedItem.label+" pour les périodes : "+ document.getElementById("periode_initiale").selectedItem.label+" - "+document.getElementById("periode_initiale_intervalle").selectedItem.label+" ?";
			
			if (window.confirm(dlg)) {
				close_etat_avancement();

				document.getElementById("Progression").collapsed = false;
				document.getElementById('pm').setAttribute('mode','undetermined');
				document.getElementById("bMenuPrincipal").collapsed = true;
				var periode_cible=document.getElementById("periode_cible").value;
				var queryEdit = new QueryHttp("Compta/Saisie/TransfertJournal.tmpl");
				queryEdit.setParam("ExerciceDest",exercice_cible);
				queryEdit.setParam("ExerciceSrc",exercice_initial);
				queryEdit.setParam("JournalSrc",journal_initial);
				queryEdit.setParam("JournalDest",journal_cible);
				queryEdit.setParam("PeriodeSrcDebut",periode_initiale);
				queryEdit.setParam("PeriodeSrcFin",periode_initiale_int);
				queryEdit.setParam("PeriodeDestDebut",periode_cible);
				queryEdit.setParam("Extourne",extourne);
				queryEdit.setParam("TypeSel",choix);
				
				if (choix=="B") {
					queryEdit.setParam("NumEcrDebut",num1);
					queryEdit.setParam("NumEcrFin",num2);
				} else if (choix=="C") {
					queryEdit.setParam("jourDebut",date1);
					queryEdit.setParam("jourFin",date2);
				}

  			var result = queryEdit.execute();

				document.getElementById("Progression").collapsed = true;
				document.getElementById('pm').setAttribute('mode','none');
				document.getElementById("bMenuPrincipal").collapsed = false;
				
				var errors = new Errors(result);

				if (errors.hasNext()) {		
					errors.show();
				}
				else {				
					var contenu = result.responseXML.documentElement;
					var nontransfere= contenu.getAttribute('NbEcrNonTrans');
					var nbreecriture= contenu.getAttribute('NbEcrTrans');
					var nontransfererLR= contenu.getAttribute('NonTransRB');

					if (periode_initiale!=periode_initiale_int){
						showMessage(nbreecriture+ " écritures ont été transférées du journal "+document.getElementById("journal_cible").selectedItem.label+" pour les périodes du "+document.getElementById("periode_cible").selectedItem.label+ " au " +document.getElementById("periode_cible_intervalle").selectedItem.label+" de l'exercice "+document.getElementById("exercice_cible").selectedItem.label);
					}
					else{
						showMessage(nbreecriture+ " écritures ont été transférées dans le journal "+document.getElementById("journal_cible").selectedItem.label+" pour la période "+document.getElementById("periode_cible").selectedItem.label+" de l'exercice "+document.getElementById("exercice_cible").selectedItem.label);
					}

					if (nontransfere>0){
						showMessage(nontransfere+ " ecritures n'ont pas été transférées (écritures lettrées)");
					}
					if (nontransfererLR>0){
						showMessage(nontransfererLR+ " ecritures n'ont pas été transférées (opérations dans rapprochement bancaire)");
					}
				}
			}
		}
		else {
			showMessage("L'intervalle des périodes initiales et cibles doit être identique !");
		}
		
	} catch (e) {
    recup_erreur(e);
	}
}


function verifIntervalle(){
	try {
		// intervalle de 0 à 11 - 0 = le meme mois
		periode_init=document.getElementById("periode_initiale").value;
		periode_fin=document.getElementById("periode_initiale_intervalle").value;
		periode_c_init=document.getElementById("periode_cible").value;
		periode_c_fin=document.getElementById("periode_cible_intervalle").value;
		var mois=periode_init.substring(0, 2);
		var mois2=periode_fin.substring(0, 2);
		var mois3=periode_c_init.substring(0, 2);
		var mois4=periode_c_fin.substring(0, 2);
		var interv=parseIntBis(mois2) - parseIntBis(mois);
		var interv2=parseIntBis(mois4) - parseIntBis(mois3);
		return (interv==interv2);
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnAction() {
	try {
		currentAction = document.getElementById('rgpAction').value;
		
		var lblExercice = document.getElementById('exercice_initial').label;
		var cloture = (lblExercice=="clôturé");
		
		currentJournalInitial = document.getElementById('journal_initial').value;
		
		if (currentAction=="C") {
			var bJournaux = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'journal_initial');
			bJournaux.initTree(initJournalSource);
		} else {
			var bJournaux = new Arbre('Compta/GetRDF/combo-journauxSansAN.tmpl', 'journal_initial');
			bJournaux.initTree(initJournalSource);
		}

		document.getElementById('ok_cible').collapsed = (currentAction!="C");
		document.getElementById('transfere').collapsed = (cloture || currentAction!="T");
		document.getElementById('suppression').collapsed = (cloture || currentAction!="S");
		
		document.getElementById('grpDestination').collapsed = (currentAction=="S");
		document.getElementById('miTousJournaux').collapsed = (currentAction!="S");
		document.getElementById('chkSupprLettrage').collapsed = (currentAction!="S");
		if (currentAction!="S") {	document.getElementById('chkSupprLettrage').setAttribute("checked", false); }
		
		majPeriodesSource();
	} catch (e) {
		recup_erreur(e);
	}
}


function initJournalSource() {
	try {
		if ((currentJournalInitial=="Tous" && currentAction!="S") || (currentJournalInitial=="AN" && currentAction!="C")) {
			currentJournalInitial="0";
		}
		document.getElementById('journal_initial').value = currentJournalInitial;
		currentJournalInitial = "0";
	} catch (e) {
		recup_erreur(e);
	}
}


function majPeriodesSource() {
	try {
		aPeriodesSourceDebut.setParam("Sans_Cloture", currentAction=="C"?"0":"1");
		aPeriodesSourceDebut.initTree(initPeriodeSourceDebut);
	} catch (e) {
		recup_erreur(e);
	}
}


function initPeriodeSourceDebut() {
	try {
		document.getElementById("periode_initiale").selectedIndex = 0;
		aPeriodesSourceFin.setParam("Sans_Cloture", currentAction!="C"?"1":"0");
		aPeriodesSourceFin.initTree(initPeriodeSourceFin);
	} catch (e) {
		recup_erreur(e);
	}
}

function initPeriodeSourceFin() {
	try {
		document.getElementById("periode_initiale_intervalle").selectedIndex = 0;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnPeriodeSourceInitial() {
	try {
		document.getElementById("periode_initiale_intervalle").value = document.getElementById("periode_initiale").value;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnPeriodeDestInitiale() {
	try {
		var periodeSourceDebut = document.getElementById("periode_initiale").value;
		var periodeSourceFin = document.getElementById("periode_initiale_intervalle").value;
		var periodeDestDebut = document.getElementById("periode_cible").value;
		
		if (periodeSourceDebut!="0" && periodeSourceFin!="0" && periodeDestDebut!="0") {
			
			var moisSourceDebut = periodeSourceDebut.substring(0, 2);
			var moisSourceFin = periodeSourceFin.substring(0, 2);
			var moisDestDebut = periodeDestDebut.substring(0, 2);
			var anneeDestDebut = periodeDestDebut.substring(2, 4);

			var intervalleSource = parseIntBis(moisSourceFin) - parseIntBis(moisSourceDebut);
			if (isPositiveOrNullInteger(intervalleSource)) {
				var moisDestFin = parseIntBis(moisDestDebut) + intervalleSource;
				if (moisDestFin<=12) {
					document.getElementById('periode_cible_intervalle').value = (nf.format(moisDestFin) + anneeDestDebut);
				}
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function menuPrincipal() {
	try {

		window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();

	} catch (e) {
		recup_erreur(e);
	}
}

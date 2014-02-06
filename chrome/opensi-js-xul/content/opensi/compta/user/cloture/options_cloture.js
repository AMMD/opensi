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


var nouvel_exercice = false; // variable globale indiquant s'il faut creer un nouvel exercice

var aJOD = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'JournalEX');
var aPerExt = new Arbre('Compta/GetRDF/periodes_extourne.tmpl', 'DateEX');
			

function init() {
	try {

		aJOD.setParam('Type_Journal', 'OD');

		document.getElementById("Ancien_Exercice").value = "Ancien Exercice: Du "+ get_cookie('Date_Debut_Exercice') +" au "+ get_cookie('Date_Fin_Exercice');
		document.getElementById("JournalAN").focus();
		
		var aJAN = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'JournalAN');
		aJAN.setParam('Type_Journal', 'AN');
		aJAN.initTree(selectJournalAN);

		var qNonBloque = new QueryHttp("Compta/GetNonBloque.tmpl");
		var result = qNonBloque.execute();

		var nbExosOuverts = result.responseXML.documentElement.getAttribute('NbExosOuverts');

		if (nbExosOuverts>1) {
  		var num_exo = parseIntBis(get_cookie('Num_Exercice'))+1;
			
			var qDatesExo = new QueryHttp("Compta/GetDateExercice.tmpl");
			qDatesExo.setParam('Num_Exercice', num_exo);
			var result = qDatesExo.execute();
			
			var date_debut = result.responseXML.documentElement.getAttribute('Debut_Exercice');
    	var date_fin = result.responseXML.documentElement.getAttribute('Fin_Exercice');
			document.getElementById("Nouvel_Exercice").value = "Nouvel Exercice: Du "+ date_debut +" au "+ date_fin;
		}
		else {
			// il faut creer un nouvel exercice
			nouvel_exercice = true;
			document.getElementById('labelDate_Fin').collapsed = false;
			document.getElementById('Date_Fin').collapsed = false;
			var date_fin_exercice = get_cookie('Date_Fin_Exercice');
			document.getElementById('Date_Fin').value = date_fin_exercice.substring(0,6)+(parseIntBis(date_fin_exercice.substring(6,10))+1);
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function displayEX(d) {
  try {
	  document.getElementById('JournalEX').collapsed = d;
	  document.getElementById('DateEX').collapsed = d;
	  document.getElementById('labelJournalEX').collapsed = d;
	  document.getElementById('labelDateEX').collapsed = d;

    if (d) {
			aJOD.deleteTree();
			aPerExt.deleteTree();
		}
		else {
			aJOD.initTree(selectJournal);
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function selectJournal() {
	try {
    
		document.getElementById('JournalEX').selectedIndex = 0;
		
		initPeriodesEX();
		
	} catch (e) {
    recup_erreur(e);
  }
}


function initPeriodesEX() {
	try {
	
		aPerExt.setParam('Code_Journal', document.getElementById('JournalEX').value);
		aPerExt.initTree(selectPeriode);
	
	} catch (e) {
    recup_erreur(e);
  }
}


function selectJournalAN() {
	try {
	
    document.getElementById('JournalAN').selectedIndex = 0;
		
	} catch (e) {
    recup_erreur(e);
  }
}


function selectPeriode() {
	try {
	
    document.getElementById('DateEX').selectedIndex = 0;
		
	} catch (e) {
    recup_erreur(e);
  }
}


function reinit() {
	try {

		document.getElementById('progression').collapsed = true;
		document.getElementById('pm').setAttribute('mode', 'none');

    document.getElementById('bMenuPrincipal').disabled = false;
    document.getElementById('bFermerSession').disabled = false;
    document.getElementById('Date_Fin').disabled = false;
    document.getElementById('JournalAN').disabled = false;
    document.getElementById('DetailTiers').disabled = false;
		document.getElementById('DetailAux').disabled = false;
    document.getElementById('AExtourner').disabled = false;
    document.getElementById('bOK').disabled = false;

	} catch (e) {
    recup_erreur(e);
  }
}


function precloture() {
	try {

		document.getElementById('progression').collapsed = false;
		document.getElementById('pm').setAttribute('mode', 'undetermined');

    document.getElementById('bMenuPrincipal').disabled = true;
    document.getElementById('bFermerSession').disabled = true;
    document.getElementById('Date_Fin').disabled = true;
    document.getElementById('JournalAN').disabled = true;
    document.getElementById('DetailTiers').disabled = true;
		document.getElementById('DetailAux').disabled = true;
    document.getElementById('AExtourner').disabled = true;
    document.getElementById('bOK').disabled = true;

		var Date_Fin = '';
		if (nouvel_exercice) {
			var Date_Fin = document.getElementById('Date_Fin').value;
		}
		var JournalAN = document.getElementById('JournalAN').value;
		var DetailTiers = document.getElementById('DetailTiers').checked;
		var DetailAux = document.getElementById('DetailAux').checked;
		var AExtourner = document.getElementById('AExtourner').checked;
		var JournalEX = '';
		var DateEX = '';
		if (AExtourner) {
			JournalEX = document.getElementById('JournalEX').value;
			DateEX = document.getElementById('DateEX').value;
		}

		if (isEmpty(JournalAN)) {
			showWarning("Impossible de cloturer l'exercice aucun journal d'A Nouveau disponible !");
  		reinit();
		}
		else if (AExtourner && isEmpty(JournalEX)) {
			showWarning("Impossible d'extourner un journal, aucun journal disponible !");
  		reinit();
		}
		else if (AExtourner && (isEmpty(DateEX) || !isPeriode(DateEX))) {
			showWarning("Période d'extourne incorrecte !");
  		reinit();
		}
		else if (nouvel_exercice && (isEmpty(Date_Fin) || !isDate(Date_Fin))) {
			showWarning("Date de fin du nouvel exercice incorrecte !");
  		reinit();
		}
		else {
			var cloture = 1;

			if (nouvel_exercice) {				
				var qNewExo = new QueryHttp("Compta/UpdateDatabase/CreerExercice.tmpl");
				qNewExo.setParam('Fin_Exercice', Date_Fin);
				qNewExo.setParam('JournalAN', JournalAN);
				var result = qNewExo.execute();
				
				var errors = new Errors(result);

				if (errors.hasNext()) {		
					errors.show();
					cloture = 0;
					document.getElementById('Date_Fin').focus();
				}
				else {
    			showMessage("Le nouvel exercice a été créé avec succés");
  			}
			}
			
			if (cloture==1) {
      	
				var qVerifCloture = new QueryHttp("Compta/UpdateDatabase/VerifCloture.tmpl");
				var result = qVerifCloture.execute();		

    		var resultat = result.responseXML.documentElement.getAttribute('Resultat');		

    		var coherenceResultat = parseIntBis(result.responseXML.documentElement.getAttribute('Resultat_Coherent'));

    		if (coherenceResultat==1) {
      		var page = "chrome://opensi/content/compta/user/cloture/confirmation_cloture.xul?"+ cookie();
      		page += "&Resultat="+ resultat;
      		page += "&JournalAN="+ JournalAN;
      		page += "&DetailTiers="+ DetailTiers;
					page += "&DetailAux="+ DetailAux;
      		page += "&AExtourner="+ AExtourner;
      		page += "&JournalEX="+ JournalEX;
      		page += "&DateEX="+ DateEX;
					window.location = page;
				}
				else {			
					var msg = "Attention: Incohérence lors de la cloture. ";
      		msg += "La différence entre les produits(7) et les charges(6) ";
      		msg += "n'est pas égale à la variation théorique de vos capitaux propres !";
					showWarning(msg);
					reinit();
				}				
    	}
			else {
    		reinit();
    	}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function retour_menu_principal() {
	try {

  	window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

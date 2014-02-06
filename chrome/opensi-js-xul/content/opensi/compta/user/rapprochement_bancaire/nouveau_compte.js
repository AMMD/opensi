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


jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var typerappro="";


function init() {
  try {

    window.resizeTo(700,300);
	  initlistcompte();

	} catch (e) {
  	recup_erreur(e);
  }
}


function initlistcompte() {
  try {

		typerappro = get_cookie('Type_Rappro');

		if (typerappro=="C") {
			document.getElementById("lblcompte").collapsed=false
			document.getElementById("casecompte").collapsed=false
			var al = new Arbre('Compta/GetRDF/rapproListeCompteJournaux.tmpl', 'list_compte');
			al.clearParams();
			al.setParam("req","listsansrappro");
			al.initTree(initialiser2);
		}

		if (typerappro=="J") {
			document.getElementById("lbljournal").collapsed=false
			document.getElementById("casejournal").collapsed=false
			var al = new Arbre('Compta/GetRDF/rapproListeCompteJournaux.tmpl', 'list_journaux');
			al.clearParams();
			al.setParam("req","listsansrappro");
			al.initTree(initialiser3);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function initialiser2() {
	document.getElementById("list_compte").selectedIndex = 0;
	
}


function initialiser3() {
	document.getElementById("list_journaux").selectedIndex = 0;

}


function ok() {
  try {

		if (typerappro=="C") {
  		var compte=document.getElementById("list_compte").value;
  		var comptejournal=compte;
  	}

  	if (typerappro=="J") {
  		var journal=document.getElementById("list_journaux").value;
  		var comptejournal=journal;
  	}
  	var daterappro=document.getElementById("dateRappro").value;
  	var datereleve=document.getElementById("dateEcrituremax").value;
  	var soldereleve=document.getElementById("soldeRelevé").value;
  	var soldereleve=soldereleve.replace(",", ".");
  	if (soldereleve==""){
  		soldereleve=0;
  	}
  	if (isNaN(soldereleve)){
  		showMessage("Le solde de relevé doit être un nombre ");
  		return false;
  	}
  	var numreleve=document.getElementById("numreleve").value;
  	if (numreleve==""){
  		numreleve=0;
  	}
  	daterapproLong=Date2Long(daterappro);
  	datereleveLong=Date2Long(datereleve);
	  if (daterappro!="") {
	  	if (!isDate(daterappro)) {
	  		showMessage("La date de debut de rapprochement n'est pas au bon format");
	     	return false;
	  	}
	  	if (daterapproLong<=(get_cookie('Debut_Exercice'))) {
	  		showMessage("La date de debut de rapprochement ne peut pas être antérieure à la date de début de l'exercice ");
	     	return false;
	  	}
	  }
	  else {
	  	showMessage("La date de debut de rapprochement sera la date de début de l'exercice");
	  }
	  if (datereleve!="") {
	  	if (datereleveLong<=(get_cookie('Debut_Exercice'))) {
	  		showMessage("La date de relevé ne peut pas être antérieure à la date de début de l'exercice ");
	  		return false;
	  	}
	  	if (daterapproLong>=(get_cookie('Fin_Exercice'))) {
	  		showMessage("La date de rapprochement ne peut pas être supérieure à la date de fin de l'exercice ");
	  		return false;
	  	}
	  	if (datereleveLong>=(get_cookie('Fin_Exercice'))) {
	  		showMessage("La date de relevé ne peut pas être supérieure à la date de fin de l'exercice ");
	  		return false;
	  	}
	  	if (datereleveLong<daterapproLong) {
	  		showMessage("La date de relevé doit être postérieure à la date de début de rapprochement");
	  	 	return false;
	  	}
	  }
	  else {
	  	showMessage("Merci d'insérer une date de relevé de banque ");
	  }

  	if (isDate(datereleve)) {
			var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
			queryEdit.setParam("req","createCompte");
			queryEdit.setParam("typerappro",typerappro);
			if (typerappro=="C") {
				queryEdit.setParam("compte",compte);
			}
			if (typerappro=="J") {
				queryEdit.setParam("journal",journal);
			}

			queryEdit.setParam("daterappro",prepareDateJava(daterappro));
			queryEdit.setParam("datereleve",prepareDateJava(datereleve));
			queryEdit.setParam("soldereleve",soldereleve);
			queryEdit.setParam("numreleve",numreleve);
			var response=queryEdit.execute();
			var contenu = response.responseXML.documentElement;
			var stat= contenu.getAttribute('status');
			if (stat=="1") {
				window.opener.initcomptejournal(comptejournal);
				window.opener.init();
				window.close();
			}
    	else {
				if (stat=="pasdecompte") {
					showMessage("Le journal "+ journal +" n'a pas de compte de contrepartie, veuillez en indiquer un dans la gestion des journaux");
				}
				else {
					showMessage("une erreur s'est produite lors de la creation du compte/journal");
				}
    	}
  	}
    else {
    	showMessage("La date n'est pas au bon format");
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function keypress(e) {
	if (e.keyCode==13) {
		ok();
	}
}


function Date2Long(val) {
	try {

		if (val.length != 10 && val.length != 8) {
  	  return false;
  	}
    else {
      strjour = val.substring(0,2);
      strmois = val.substring(3,5);
      strannee = val.length==10?val.substring(6,10):"20"+val.substring(6,8);

      if ((val.charAt(2)!='/' && val.charAt(2)!='.' &&    val.charAt(2)!=':')    || (val.charAt(5)!='/' &&    val.charAt(5)!='.' && val.charAt(5)!=':')) {
    	  return false;
    	}
      else if (!(isPositive(strjour) && isPositive(strmois) && isPositive(strannee))) {
      	return false;
      }
      else {
        d = new Date();
      	d.setFullYear(strannee, strmois-1, strjour);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d.getTime();
      }
    }
	} catch (e) {
  	recup_erreur(e);
	}
}

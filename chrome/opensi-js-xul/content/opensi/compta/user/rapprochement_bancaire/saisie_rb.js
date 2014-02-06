/******************************************************************************/
/* OpenSi : Outils libres de gestiion d'entreprise                            */
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

var periode;
var journal;

var arbre = new Arbre("Compta/GetRDF/rapproListeRB.tmpl", "listerb");

var modif = false;
var id = 0;


function init() {
	try {

		window.resizeTo(1000,300);

    var rapproid=ParamValeur('rapproid');
    var typerappro=get_cookie('Type_Rappro');
		arbre.setParam("rapproid", rapproid);

		arbre.initTree();

	}	catch(e) {
		recup_erreur(e);
	}
}


function fermer() {
	try {

		window.close();

	}	catch(e) {
		recup_erreur(e);
	}
}


function test_rempli() {
	try {

		var dateOp = document.getElementById("dateOp").value;
		var libelle = document.getElementById("labelrb").value;
		var debit = document.getElementById("debit").value;
		var credit = document.getElementById("credit").value;

		if (!isEmpty(dateOp) || !isEmpty(libelle) || !isEmpty(debit) || !isEmpty(credit)) {
			document.getElementById("bAnnuler").disabled = false;
		}

		if (!isEmpty(libelle) && (!isEmpty(debit) || !isEmpty(credit))) {
			document.getElementById("bAnnuler").disabled = false;
			document.getElementById("bValider").disabled = false;
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function selectlig() {
	try {

		document.getElementById("bSupprimer").disabled = false;

	} catch(e) {
		recup_erreur(e);
	}
}


function annuler() {
	try {

		effacer();

	}	catch(e){
		recup_erreur(e);
	}
}


function valider() {
	try {

		var rapproid=ParamValeur('rapproid');
		var date=document.getElementById("dateOp").value;
		var debit=document.getElementById("debit").value;
		var credit=document.getElementById("credit").value;
		var labelrb=document.getElementById("labelrb").value;
		if (debit=="") {
		  debit=0;
		}

		if (credit=="") {
		  credit=0;
		}
		if (!isDate(date)) {
		  showMessage("la date n'est pas au bon format");
			return false;
		}
		var daterappro=Date2Long(ParamValeur('dateRappro'));
		var daterelevé=Date2Long(ParamValeur('dateReleve'));
		var datelong=Date2Long(date);
		if (!isDate(date)) {
		  showMessage("la date n'est pas au bon format");
			return false;
		}

		if (datelong>daterelevé || datelong< daterappro){
		  showMessage("la date doit se trouver dans l'interval du rapprochement ( date de début - date jusqu'au) ");
			return false;
		}
		var typerappro=get_cookie('Type_Rappro');
		var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
		queryEdit.setParam("req","createOpSaisie");
		queryEdit.setParam("datelong",datelong);
		queryEdit.setParam("debit",debit);
		queryEdit.setParam("credit",credit);
		queryEdit.setParam("labelrb",labelrb);
		queryEdit.setParam("rapproid",rapproid);
		var response=queryEdit.execute();
		var contenu = response.responseXML.documentElement;
		var stat= contenu.getAttribute('status');
		if (stat=="1") {
			window.opener.loadinfo();
		}
		else {
			showMessage("une erreur s'est produite,la ligne n'est pas créée");
		}

    effacer();
		arbre.initTree();
		modif = true;

	}	catch(e) {
		recup_erreur(e);
	}
}


function supprimer() {
	try {

		var tree = document.getElementById("listerb");

		if (tree.view!=null && tree.currentIndex!=-1) {
			var lignerb = getCellValue(tree,tree.currentIndex,"id");

			var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
			queryEdit.setParam("req","DeletelgOpSaisie");
			queryEdit.setParam("lignerb",lignerb);
		  var response=queryEdit.execute();
			var contenu = response.responseXML.documentElement;
			var stat= contenu.getAttribute('status');
			if (stat=="1") {
				window.opener.loadinfo();
			}
			else {
				showMessage("une erreur s'est produite,la ligne n'est pas créée");
			}

    	effacer();
			arbre.initTree();
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function effacer() {
	try {
		document.getElementById("dateOp").value = "";
		document.getElementById("labelrb").value = "";
		document.getElementById("debit").value = "";
		document.getElementById("credit").value = "";
		document.getElementById("bValider").disabled = true;
		document.getElementById("bSupprimer").disabled = true;
		document.getElementById("bAnnuler").disabled = true;
		document.getElementById("dateOp").focus();

	}	catch(e) {
		recup_erreur(e);
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

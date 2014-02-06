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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
var rExp = / /gi;
var aEcritures = new Arbre("Compta/GetRDF/rechEcritures.tmpl", "ecritures");


function init() {
  try {

		var aJournaux = new Arbre("Compta/GetRDF/combo-journaux.tmpl", "journaux");
		aJournaux.initTree();

    document.getElementById('compte').focus();

  } catch (e) {
    recup_erreur(e);
  }
}


function ok() {
  try {

		aEcritures.clearParams();

		var compte = document.getElementById('compte').value;
    var toutvide = isEmpty(compte);

 		if (!isEmpty(compte))
    	aEcritures.setParam("Numero_Compte", compte);

		aEcritures.setParam("Lettrage", document.getElementById('Lettrage').value);

    switch(document.getElementById('debitbox').selectedItem.id) {
      case 'isdebitexact':
        var debit = document.getElementById('debit').value;
				if (!isEmpty(debit))
        	aEcritures.setParam("debit", debit.replace(rExp,''));
				toutvide = toutvide && isEmpty(debit);
        break;
      case 'isdebitinter':
        var debitinf = document.getElementById('debitinf').value;
        var debitsup = document.getElementById('debitsup').value;
				if (!isEmpty(debitinf))
					aEcritures.setParam("debitinf", debitinf.replace(rExp,''));
				if (!isEmpty(debitsup))
					aEcritures.setParam("debitsup", debitsup.replace(rExp,''));
        toutvide = toutvide && isEmpty(debitinf) && isEmpty(debitsup);
        break;
    }

    switch(document.getElementById('creditbox').selectedItem.id){
      case 'iscreditexact':
        var credit = document.getElementById('credit').value;
				if (!isEmpty(credit))
        	aEcritures.setParam("credit", credit.replace(rExp,''));
        toutvide = toutvide && isEmpty(credit);
        break;
      case 'iscreditinter':
        var creditinf = document.getElementById('creditinf').value;
        var creditsup = document.getElementById('creditsup').value;
				if (!isEmpty(creditinf))
					aEcritures.setParam("creditinf", creditinf.replace(rExp,''));
				if (!isEmpty(creditsup))
					aEcritures.setParam("creditsup", creditsup.replace(rExp,''));
        toutvide = toutvide && isEmpty(creditinf) && isEmpty(creditsup);
        break;
    }

    switch(document.getElementById('datebox').selectedItem.id){
      case 'isdateexact':
        var date = document.getElementById('date');
        if (isDate(date.value)) {
					aEcritures.setParam("date", prepareDateJava(date.value));
        }
				else if (!isEmpty(date.value)) {
          showWarning('Date invalide');
          date.focus();
          return false;
        }
        toutvide = toutvide && isEmpty(date.value);
        break;
      case 'isdateinter':
        var dateinf = document.getElementById('dateinf');
        var datesup = document.getElementById('datesup');
        if (isDate(dateinf.value)) {
          aEcritures.setParam("dateinf", prepareDateJava(dateinf.value));
        }
				else if (!isEmpty(dateinf.value)) {
          showWarning('Date invalide');
          dateinf.focus();
          return false;
        }
        if (isDate(datesup.value)) {
          aEcritures.setParam("datesup", prepareDateJava(datesup.value));
        } else if (!isEmpty(datesup.value)) {
          showWarning('Date invalide');
          datesup.focus();
          return false;
        }
        toutvide = toutvide && isEmpty(dateinf.value) && isEmpty(datesup.value);
        break;
    }

    var libelle = document.getElementById('libelle').value;
		var piece = document.getElementById('piece').value;
		var journal = document.getElementById('journaux').value;

		if (!isEmpty(libelle))
			aEcritures.setParam("Libelle", libelle);
    if (!isEmpty(piece))
			aEcritures.setParam("Num_Piece", piece); 
		if (!isEmpty(journal))
    	aEcritures.setParam("Code_Journal", journal);

    toutvide = toutvide && isEmpty(libelle) && isEmpty(piece) && isEmpty(journal);

    if (toutvide) {
      showWarning("Vous devez spécifier au moins un critère de recherche");
      document.getElementById('compte').focus();
    }
		else {
			document.getElementById('labelpm').value = "Recherche en cours...";
			document.getElementById('pm').setAttribute("mode", "undetermined");
			document.getElementById('pm').collapsed = false;
      aEcritures.initTree(finRecherche);
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function finRecherche() {
  try {

		document.getElementById('labelpm').value = "Recherche terminée.";
		document.getElementById('pm').setAttribute("mode", "none");

	} catch (e) {
    recup_erreur(e);
  }
}


function export_csv(){
	try {

	var queryEdit = new QueryHttp("Compta/Etats/RechEcriture_csv.tmpl");
		var compte = document.getElementById('compte').value;
    var toutvide = isEmpty(compte);
  	queryEdit.setParam("Numero_Compte", compte);
		queryEdit.setParam("Lettrage", document.getElementById('Lettrage').value);
    var debit = document.getElementById('debit').value;
   	queryEdit.setParam("debit", debit.replace(rExp,''));		
    var debitinf = document.getElementById('debitinf').value;
    var debitsup = document.getElementById('debitsup').value;				
		queryEdit.setParam("debitinf", debitinf.replace(rExp,''));			
		queryEdit.setParam("debitsup", debitsup.replace(rExp,''));
    var credit = document.getElementById('credit').value;
   	queryEdit.setParam("credit", credit.replace(rExp,''));
   	var creditinf = document.getElementById('creditinf').value;
    var creditsup = document.getElementById('creditsup').value;			
		queryEdit.setParam("creditinf", creditinf.replace(rExp,''));		
		queryEdit.setParam("creditsup", creditsup.replace(rExp,''));
       var date = document.getElementById('date');

        if (isDate(date.value)) {

					queryEdit.setParam("date", prepareDateJava(date.value));
        }
				else if (!isEmpty(date.value)) {
          showWarning('Date invalide');
          date.focus();
          return false;
        }
        else if(isEmpty(date.value)){
        	queryEdit.setParam("date", "0");
        }

        var dateinf = document.getElementById('dateinf');
        var datesup = document.getElementById('datesup');
        if (isDate(dateinf.value)) {
          queryEdit.setParam("dateinf", prepareDateJava(dateinf.value));
        }
				else if (!isEmpty(dateinf.value)) {
          showWarning('Date invalide');
          dateinf.focus();
          return false;
        }
        else if(isEmpty(dateinf.value)){
        	queryEdit.setParam("dateinf", "0");
        }
        if (isDate(datesup.value)) {
          queryEdit.setParam("datesup", prepareDateJava(datesup.value));
        } else if (!isEmpty(datesup.value)) {
          showWarning('Date invalide');
          datesup.focus();
          return false;
        }
        else if(isEmpty(datesup.value)){
        	queryEdit.setParam("datesup", "0");
        }
       

    	var libelle = document.getElementById('libelle').value;
			var piece = document.getElementById('piece').value;
			queryEdit.setParam("Libelle", libelle);  
			queryEdit.setParam("Num_Piece", piece);
    	queryEdit.setParam("Code_Journal", document.getElementById('journaux').value);

			document.getElementById('labelpm').value = "Recherche en cours...";
			document.getElementById('pm').setAttribute("mode", "undetermined");
			document.getElementById('pm').collapsed = false;
     var response=queryEdit.execute();
		  			finexport(response);
  

  } catch (e) {
    recup_erreur(e);
  }
}

function finexport(response) {
  try {
 		var contenu = response.responseXML;
		var fichier_csv = contenu.documentElement.getAttribute('fichier');

		var file = fileChooser("save", "Ecriture.csv");
		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier_csv, file);
		}

		document.getElementById('labelpm').value = "Recherche terminée.";
		document.getElementById('pm').setAttribute("mode", "none");

	} catch (e) {
    recup_erreur(e);
  }
}
function selectradio(t) {
  try {

    switch(t.id) {
      case 'debitbox':
        switch(t.selectedItem.id){
          case 'isdebitexact':
            var tb = document.getElementById('debit');
            tb.removeAttribute("readonly");
            tb.focus();
            tb = document.getElementById('debitinf');
            tb.value = '';
            tb.setAttribute("readonly",true);
            tb = document.getElementById('debitsup');
            tb.value = '';
            tb.setAttribute("readonly",true);
            break;
          case 'isdebitinter':
            var tb = document.getElementById('debitinf');
            tb.removeAttribute("readonly");
            tb.focus();
            document.getElementById('debitsup').removeAttribute("readonly");
            tb = document.getElementById('debit');
            tb.value = '';
            tb.setAttribute("readonly",true);
            break;
        }
        break;
      case 'creditbox':
        switch(t.selectedItem.id){
          case 'iscreditexact':
            var tb = document.getElementById('credit');
            tb.removeAttribute("readonly");
            tb.focus();
            tb = document.getElementById('creditinf');
            tb.value = '';
            tb.setAttribute("readonly",true);
            tb = document.getElementById('creditsup');
            tb.value = '';
            tb.setAttribute("readonly",true);
            break;
          case 'iscreditinter':
            var tb = document.getElementById('creditinf');
            tb.removeAttribute("readonly");
            tb.focus();
            document.getElementById('creditsup').removeAttribute("readonly");
            tb = document.getElementById('credit');
            tb.value = '';
            tb.setAttribute("readonly",true);
            break;
        }
        break;
      case 'datebox':
        switch(t.selectedItem.id){
          case 'isdateexact':
            var tb = document.getElementById('date');
            tb.removeAttribute("readonly");
            tb.focus();
            tb = document.getElementById('dateinf');
            tb.value = '';
            tb.setAttribute("readonly",true);
            tb = document.getElementById('datesup');
            tb.value = '';
            tb.setAttribute("readonly",true);
            break;
          case 'isdateinter':
            var tb = document.getElementById('dateinf');
            tb.removeAttribute("readonly");
            tb.focus();
            document.getElementById('datesup').removeAttribute("readonly");
            tb = document.getElementById('date');
            tb.value = '';
            tb.setAttribute("readonly",true);
        }
			}

  } catch (e) {
    recup_erreur(e);
  }
}


function keypress(e, id) {
  try {

    switch (e.keyCode) {
      case 13:
				if (id=="ecritures")
					goToSaisie();
				else
        	ok();
        break;
      case 123: // F12
        recherche_compte();
        break;
    }

	} catch (e) {
    recup_erreur(e);
  }
}


function goToSaisie() {
  try {

  	var tree = document.getElementById('ecritures');

		if (tree.view!=null && tree.currentIndex!=-1) {

    	var page = "chrome://opensi/content/compta/user/saisie/menuSaisie.xul?"+ cookie();
			page += "&Op_Id="+ getCellText(tree,tree.currentIndex,'ColOp_Id');

     	window.opener.location = page;
    	window.close();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function blurmontant(t) {
  try {

		var fm = new NumberFormat("0.00", true);

    var v = eval(t.value.replace(rExp,''));
    if (isNaN(v)) {
      t.value = '';
    } else {
      t.value = fm.format(v);
    }
  } catch (e) {
    t.value = '';
  }
}


function recherche_compte() {
  try {

    var compte = document.getElementById('compte').value;
    var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie()+"&Creer=false&Num_Compte="+ urlEncode(compte);
    window.openDialog(url,'','chrome,modal,centerscreen',retourRechercheCompte);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourRechercheCompte(numCompte) {
	try {
		
		document.getElementById('compte').value = numCompte;

	} catch (e) {
		recup_erreur(e);
	}
}


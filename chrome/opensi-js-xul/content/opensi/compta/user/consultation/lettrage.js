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


function init() {
  try {

    window.resizeTo(700,300);

		var nf = new NumberFormat("0.00", true);
		
		var aJSAN = new Arbre('Compta/GetRDF/combo-journauxSansAN.tmpl', 'journaux');
		aJSAN.initTree(initJournal);
		
    var solde = parseFloat(ParamValeur('solde'));
    if (solde > 0) {
      document.getElementById('montant').value = nf.format(solde);
      document.getElementById('nom_montant').value = 'Montant au crédit :';
    }
		else {
      solde = - solde;
      document.getElementById('montant').value = nf.format(solde);
      document.getElementById('nom_montant').value = 'Montant au débit :';
    }
    document.getElementById('libelle').value = "Différence lettrage";
    document.getElementById('contrepartie').focus();

	} catch (e) {
    recup_erreur(e);
  }
}


function initJournal() {
	try {
		document.getElementById('journaux').selectedIndex = 0;
	} catch (e) {
		recup_erreur(e);
	}
}


function changerCompte() {
	try {

		var compte = document.getElementById('contrepartie').value;

    var url ="chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Creer=false&Num_Compte="+ urlEncode(compte);
    window.openDialog(url,'','chrome,modal,centerscreen',retourChangerCompte);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourChangerCompte(numCompte) {
	try {
	
		document.getElementById('contrepartie').value = numCompte;
	
	} catch (e) {
		recup_erreur(e);
	}
}


function validerEcriture() {
  try {

		var date = document.getElementById('date').value;
		var libelle = document.getElementById('libelle').value;
		var journal = document.getElementById('journaux').value;
		var contrepartie = document.getElementById('contrepartie').value;
    
		if (isEmpty(contrepartie)) {
			showWarning("Contrepartie manquante !");
		}
		else if (journal=="0") {
			showWarning("Journal obligatoire !");
    }
		else if (isEmpty(date)) {
			showWarning("Date manquante !");
    }
    else if (!isDate(date)) {
      showWarning("Date incorrecte !");
    } 
		else if (isEmpty(libelle)) {
      showWarning("Libellé manquant !");
    }
		else {
		
			var qEcrEcart = new QueryHttp("Compta/Consultation/genEcrEquiLettrage.tmpl");
			qEcrEcart.setParam('Numero_Compte', ParamValeur('NumCompte'));
			qEcrEcart.setParam('Solde', ParamValeur('solde'));
			qEcrEcart.setParam('Date', date);
			qEcrEcart.setParam('Libelle', libelle);
			qEcrEcart.setParam('Contrepartie', contrepartie);
			qEcrEcart.setParam('Code_Journal', journal);
			var result = qEcrEcart.execute();

			var errors = new Errors(result);

			if (errors.hasNext()) {
				errors.show();
			}
			else {			
				var opId = result.responseXML.documentElement.getAttribute('Op_Id');			
    		window.arguments[0](opId);
    		window.close();
			}
		}
		
  } catch (e) {
    recup_erreur(e);
  }
}

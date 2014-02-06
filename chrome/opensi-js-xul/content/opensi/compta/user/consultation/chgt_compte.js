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

    window.resizeTo(600,250);
	  document.getElementById('CompteDest').focus();

	} catch (e) {
  	recup_erreur(e);
  }
}


function ok() {
  try {
		
    var comptedest = document.getElementById('CompteDest').value;
		var comptesrc = window.arguments[0];
    var transAll = document.getElementById('TransAll').checked;
		
    if (isEmpty(comptedest)) {
      document.getElementById('CompteDest').focus();
      showWarning("Veuillez sélectionner un compte.");
    }
		else if (!existeCompte(comptedest)) {
			document.getElementById('CompteDest').focus();
			showWarning("Numéro de compte invalide.");
		}
		else {
			var msg = "Confirmez-vous le transfert "+ (transAll?"de toutes les opérations":"des opérations sélectionnées") +" du compte "+ comptesrc +" vers le compte "+ comptedest +" ?";
		
			if (window.confirm(msg)){
				window.arguments[1](comptesrc, comptedest, transAll);
			  window.close();
			}
    }
		
  } catch (e) {
    recup_erreur(e);
  }
}


function keypresscompte(ev) {
  try {

		if (ev.keyCode==13) {
			recherche_compte();
		}    

  } catch (e) {
    recup_erreur(e);
  }
}


function recherche_compte() {
  try {

    var compte = document.getElementById('CompteDest').value;
    var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Creer=false&Num_Compte="+ urlEncode(compte);
    window.openDialog(url,'','chrome,modal,centerscreen',retourRechercheCompte);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourRechercheCompte(numCompte) {
	try {
	
		document.getElementById('CompteDest').value = numCompte;

	} catch (e) {
		recup_erreur(e);
	}
}


function existeCompte(numeroCompte) {
  try {
		
		var qExCompte = new QueryHttp("Compta/Commun/existeCompte.tmpl");
		qExCompte.setParam("Numero_Compte", numeroCompte);
		var result = qExCompte.execute();

		return (result.responseXML.documentElement.getAttribute("existe")=="true");

  } catch (e) {
    recup_erreur(e);
		return false;
  }
}

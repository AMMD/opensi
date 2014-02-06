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


jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var editionAcompte;


function init() {
	try {
		
		editionAcompte = (ParamValeur("Type_Doc")=="Acompte");
		if (editionAcompte) {
			document.getElementById('Chiffre').collapsed=true;
			editerAcompte();
		} else {
			editerCommande();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function editerCommande() {
	try {
    var Chiffre=document.getElementById('Chiffre').checked?1:0;
 		var page = getUrlOpeneas("&Page=Facturation/Commandes/commande_pdf.tmpl&Commande_Id="+ ParamValeur("Commande_Id")+"&Chiffre="+Chiffre);
		document.getElementById('commande').setAttribute("src",page);

	} catch (e) {
    recup_erreur(e);
  }
}

function editerAcompte() {
	try {
		
 		var page = getUrlOpeneas("&Page=Facturation/Commandes/pdfAcompte.tmpl&Acompte_Id="+ ParamValeur("Acompte_Id"));
		document.getElementById('commande').setAttribute("src",page);

	} catch (e) {
    recup_erreur(e);
  }
}

function envoyer() {
	try {
		var url = "chrome://opensi/content/facturation/user/factu_fournisseur/popup-envoyerMail.xul?"+ cookie();
		if (editionAcompte) {
			url += "&Doc_Id="+ ParamValeur("Acompte_Id") +"&Type_Doc=Acompte_Fournisseur";
		} else {
			var Chiffre=document.getElementById('Chiffre').checked?1:0;
			url += "&Doc_Id="+ ParamValeur("Commande_Id")+"&Chiffre="+Chiffre +"&Type_Doc=Commande_Fournisseur";
		}

		window.openDialog(url,'','chrome,modal,centerscreen');
	}
	catch (e) {
    recup_erreur(e);
  }
}


function retour_commande() {
  try {

    var page = "chrome://opensi/content/facturation/user/commandes/edition_commande.xul?" + cookie();
    page += "&Commande_Id=" + ParamValeur('Commande_Id');
    page += "&Mode=" + ParamValeur('Mode');
    window.location = page;


  } catch (e) {
    recup_erreur(e);
  }
}


function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

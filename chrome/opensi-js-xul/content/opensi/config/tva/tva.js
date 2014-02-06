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
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var ouvert_ue = 0;
var ouvert_taxation = 0;
var currentChampCompte;

function init() {
	try {

		var page = "chrome://opensi/content/config/tva/tva_france.xul?"+ cookie();
  	document.getElementById("tva_fr").setAttribute("src", page);

		oi_init();

	} catch (e) {
    recup_erreur(e);
  }
}


function changerCompte(id, debut, titre) {
  try {
  	
  	currentChampCompte = id;

    var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Creer=false&Force_Deb="+ debut +"&Type_Compte=G&nom="+ urlEncode(titre) +"&Num_Compte="+ urlEncode(debut);
    window.openDialog(url,'','chrome,modal,centerscreen', retourChangerCompte);

  } catch (e) {
    recup_erreur(e);
  }
}


function retourChangerCompte(numCompte) {
	try {
		document.getElementById(currentChampCompte).value = numCompte;

	} catch (e) {
		  recup_erreur(e);
	}
}


function tab() {
	try {

		if (document.getElementById("tab").selectedIndex==0) {
			ouvert_ue = 0; // car si on rajoute des taux tva fr, il faut actualiser les taux nationaux pour l'UE
		} else if (document.getElementById("tab").selectedIndex==1 && ouvert_ue!=1) {
			var page = "chrome://opensi/content/config/tva/tva_ue.xul?"+ cookie();
  		document.getElementById("tva_ue").setAttribute("src",page);
			ouvert_ue = 1;
		} else if (document.getElementById("tab").selectedIndex==3 && ouvert_taxation!=1) {
			var page = "chrome://opensi/content/config/tva/tva_taxation.xul?"+ cookie();
  		document.getElementById("tva_taxation").setAttribute("src",page);
			ouvert_taxation = 1;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_menuManager() {
	try {

  	window.location = "chrome://opensi/content/config/menu_manager.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

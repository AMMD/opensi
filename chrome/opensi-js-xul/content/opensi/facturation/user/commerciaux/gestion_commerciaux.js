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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");

var is_admin = (ParamValeur("isAdmin") == "true");
var actif = (ParamValeur("Supprime") == "0");
var is_new_commercial = (ParamValeur('NewCommercial')=="true");
var identifiant = (!is_new_commercial?ParamValeur('Commercial_Id'):"");

var nf = new NumberFormat("0", false);
var nf2 = new NumberFormat("0.00", false);


function init() {
  try {

  	document.getElementById('bRetourCommercial').collapsed = true;
		document.getElementById('deck').selectedIndex = 0;

		init_infos();

		document.getElementById("tabStatistiques").collapsed=is_new_commercial || !actif;
		document.getElementById("tabHistorique").collapsed=is_new_commercial;

		if (!is_new_commercial) {
			var queryModif = new QueryHttp("Facturation/Commerciaux/infos_modification.tmpl");
      queryModif.setParam("Commercial_Id", identifiant);
			queryModif.execute(init_2);
		}
		else {
			document.getElementById('Creation').label = "Création en cours";
			document.getElementById('Modification').label = "";
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function init_2(result) {
	try {

		var contenu = result.responseXML.documentElement;

		document.getElementById('Creation').label = "Créé le "+ contenu.getAttribute("Date_Creation") +" par "+ contenu.getAttribute("Login_Createur");
		document.getElementById('Modification').label = "Dernière modification le "+ contenu.getAttribute("Date_Maj") +" par "+ contenu.getAttribute("Login_Maj");

	} catch(e) {
		recup_erreur(e);
	}
}


function demandeEnregistrement() {
  try {

		if (document.getElementById("Modifie").value=="y") {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées aux coordonnées du commercial ?")) {
				enregistrerCommercial();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function retour_commercial() {
  try {

		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bRetourCommercial').collapsed = true;

  } catch (e) {
    recup_erreur(e);
  }
}


function retourChoixCommercial() {
	try {

    window.location = "chrome://opensi/content/facturation/user/commerciaux/choix_commerciaux.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function retourMenuPrincipal() {
	try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

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


var aListePeriodes = new Arbre('Compta/GetRDF/listePeriodesExercice.tmpl', 'listePeriodes');
var periodeId;
var datePeriode;
var derniere;

function init() {
	try {

		var qPeriode = new QueryHttp("Compta/UpdateDatabase/VerifClotureMois.tmpl");
		var result = qPeriode.execute();
		
		periodeId = result.responseXML.documentElement.getAttribute("Periode_Id");
		datePeriode = result.responseXML.documentElement.getAttribute("Periode");
		derniere = (result.responseXML.documentElement.getAttribute("Derniere")=="1");

		document.getElementById('boxPeriodeEnCours').collapsed = (periodeId==0);
		document.getElementById('periodeEnCours').value = datePeriode;
		aListePeriodes.initTree();

	} catch (e) {
		recup_erreur(e);
	}
}


function cloturer() {
	try {
		if (window.confirm("Confirmez-vous la clôture de la période "+ datePeriode +" ? (attention plus aucune écriture ne pourra être saisie sur la période)")) {
			var qCloturer = new QueryHttp("Compta/UpdateDatabase/ClotureMois.tmpl");
			qCloturer.setParam("Periode_Id", periodeId);
			var result = qCloturer.execute();
			
			var erreurs = result.responseXML.documentElement.getElementsByTagName("Error");
			if (erreurs.length>0) {
				showWarning("Erreur "+ erreurs.item(0).getAttribute("Code") + " : " + erreurs.item(0).getAttribute("Message"));
			} else {
				showWarning("La clôture de la période "+ datePeriode +" a été effectuée !");
				if (derniere && window.confirm("Il ne reste plus de période à clôturer. Voulez-vous clôturer l'exercice ?")) {
					window.location = "chrome://opensi/content/compta/user/cloture/options_cloture.xul?"+ cookie();
				} else {
					init();
				}
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

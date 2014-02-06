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

var aEvenement = new Arbre("CRM/liste-evenementAVenir.tmpl","evenementsAVenir");
var aTache = new Arbre("CRM/liste-tacheEnCours.tmpl","listeTacheCours");


function init() {
  try {
	
		document.getElementById('news').setAttribute("src", "http://opensi.speedinfo.fr/speedinfo/expershop?Page=OpenSI/DisplayNewsOpensi.tmpl"+ nocache());
		initialiserIndicateurs();
		var qUser = new QueryHttp("CRM/Commun/infoUtilisateur.tmpl");
		var result = qUser.execute();
		var utilisateurId=result.responseXML.documentElement.getAttribute("Utilisateur_Id");
		aEvenement.setParam("Responsable",utilisateurId);
		aEvenement.initTree();
		
		aTache.setParam("Responsable",utilisateurId);
		aTache.initTree();
		
		
  } catch (e) {
    recup_erreur(e);
  }
}

function goToMenu(m) {
  try {
	
		switch(m) {
			case 1:	 window.location = "chrome://opensi/content/crm/gestion_compte/gestionComptes.xul?"+ cookie();		break;
			case 3:	 window.location = "chrome://opensi/content/crm/gestion_tache_evenement/gestionTacheEvenement.xul?"+ cookie();		break;		}

	} catch (e) {
    recup_erreur(e);
  }
}


function initialiserIndicateurs() {
	try{
		var qIndicateur = new QueryHttp("CRM/getIndicateursCles.tmpl");
		var result = qIndicateur.execute();
		document.getElementById("nbrProjet").value = result.responseXML.documentElement.getAttribute("nbr_Projet");
		document.getElementById("nbrTacheRetard").value = result.responseXML.documentElement.getAttribute("nbrTacheRetard");
		document.getElementById("nbrTacheCours").value = result.responseXML.documentElement.getAttribute("nbrTache");
	} catch (e) {
	 recup_erreur(e);
	}
}


function ouvrirSousMenu(idSM) {

	document.getElementById('smTiers').collapsed = true;

	document.getElementById(idSM).collapsed = false;
}

function retourChoixDossier() {
	try {

    window.location = "chrome://opensi/content/crm/menu.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

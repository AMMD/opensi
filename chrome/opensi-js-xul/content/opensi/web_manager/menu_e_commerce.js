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

jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");

function init() {
	try	{
  		//On teste si l'initialisation a déjà été faite
		var page = cookie()+"&Page=WebManager/initialisationEffectuee.tmpl&ContentType=xml";
		requeteHTTP(page,new XMLHttpRequest(),requeteTerminee);
		
	} catch (e) {
    recup_erreur(e);
  }
}

/* Fonction lancée à la fin de la requete */
function requeteTerminee(requete) {
	try	{
	
		var initialisation=requete.responseXML.documentElement.getAttribute('init');
		if(initialisation=="OUI")
		{
			document.getElementById('paramConfig').disabled=false;
			document.getElementById('gerer').disabled=false;
		}
		else if(initialisation=="NON")
		{
			document.getElementById('paramConfig').disabled=true;
			document.getElementById('gerer').disabled=true;
		}
	}
	catch (e)
	{
   	recup_erreur(e);
 	}
}

/* LES BOUTONS */

function initVL() {
	try {
  	window.location = "chrome://opensi/content/web_manager/param_serveur/param_serveur.xul?"+ cookie()+"&source=INIT";
	} catch (e) {
    recup_erreur(e);
  }
}
 
 
function paramConfig() {
	try	{
  	window.location = "chrome://opensi/content/web_manager/param_serveur/param_serveur.xul?"+ cookie()+"&source=MODIF";
	} catch (e) {
    recup_erreur(e);
  }
}
 
function gerer() {
	try {
    window.location = "chrome://opensi/content/web_manager/modifications/choisir_un_site.xul?"+ cookie();
	} catch (e) {
    recup_erreur(e);
  }
}

function menuDossier() {
	try {
    window.location = "chrome://opensi/content/web_manager/menu.xul?"+ cookie();
	} catch (e) {
    recup_erreur(e);
  }
}

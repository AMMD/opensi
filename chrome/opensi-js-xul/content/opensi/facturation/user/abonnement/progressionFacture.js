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
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");


var listeEcheance;
var listeAbonnement;
var nbAbo;


function init() {
	try {

		listeEcheance = ParamValeur("listeEcheance");
		listeAbonnement = ParamValeur("listeAbonnement");
		nbAbo = ParamValeur("nbAbo");
		creationFacture();

	}	catch (e) {
  	recup_erreur(e);
  }
}


function factureAEmettre() {
  try {

    window.location = "chrome://opensi/content/facturation/user/abonnement/facture_a_emettre.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


/* Lance la procédure de création des factures */
function creationFacture() {
	try	{

		document.getElementById('info').value="Génération des factures en cours";
		var bar = document.getElementById("barre_progression");
    bar.setAttribute("hidden","false");
    bar.mode="undetermined";

		var page = cookie() +"&Page=Facturation/Abonnement/creerFacture.tmpl&ContentType=xml";
		page +="&listeEcheance="+urlEncode(listeEcheance);
		page +="&listeAbonnement="+urlEncode(listeAbonnement);
		page +="&nbAbo="+urlEncode(nbAbo);
		requeteHTTP(page,new XMLHttpRequest(),creationFactureTerminee);

	}	catch (e)	{
    recup_erreur(e);
  }
}


//fonction executée après la création des factures => créer le PDF et l'affiche
function creationFactureTerminee(requete) {
	try {

		document.getElementById('info').value="Génération du PDF en cours";

		var contenu = requete.responseXML.documentElement;
		Liste_Facture = contenu.getAttribute("listeFacture");

		var page =  cookie() +"&Page=Facturation/Abonnement/creerPdf.tmpl&ContentType=xml";
		page +="&Liste_Facture=" + urlEncode(Liste_Facture);
		requeteHTTP(page,new XMLHttpRequest(),afficherPDF);

	}	catch (e)	{
    recup_erreur(e);
  }
}

function afficherPDF(requete) {
	try	{

		document.getElementById('info').value="Factures générées, affichage du PDF";
		var bar = document.getElementById("barre_progression");
		bar.mode="determined";
    bar.value="0%";
    bar.setAttribute("hidden","true");

		var contenu = requete.responseXML.documentElement;
		var Id_Facture = contenu.getAttribute("Id_Facture");
		var page = getUrlOpeneas("&Page=Facturation/Abonnement/AfficherFacture.tmpl&Id_Facture="+urlEncode(Id_Facture));
		document.getElementById('facture').setAttribute("src",page);

	}	catch(e) {
   	recup_erreur(e);
  }
}

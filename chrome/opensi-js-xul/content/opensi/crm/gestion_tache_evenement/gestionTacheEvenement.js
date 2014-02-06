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


var aResponsable = new Arbre("CRM/Commun/combo-responsables.tmpl","listeResponsable");
var aAction = new Arbre("CRM/GestionTachesEvenements/combo-action.tmpl","listeActions");
var aEtat = new Arbre("CRM/GestionTachesEvenements/combo-etat.tmpl","listeEtats");

// arbres principaux

var aTaches = new Arbre("CRM/GestionTachesEvenements/liste-tache.tmpl","listeTaches");
var aEvenements = new Arbre("CRM/GestionTachesEvenements/liste-evenement.tmpl","listeEvenements");

// gestion des pages

var gestTac_pageCourante = 1;
var gestEvent_pageCourante = 1;

var globalIsDirection = "false";
var globalUtilisateurId = 0; 

var globalTacheId = "";

function initGestionTacheEvenement(){
	try {
		
	aResponsable.initTree(lockerDirection);
	aAction.initTree();
		
	} catch(e){
		recup_erreur(e);
	}
}


function changeDeck(deck) {
	try {
		document.getElementById('deck').selectedIndex=deck;
	} catch (e) {
		recup_erreur(e);
	}
}







function lockerDirection() {
	try {
		var qIsDirection = new QueryHttp("CRM/Commun/infoUtilisateur.tmpl");
		var result = qIsDirection.execute();
		globalIsDirection= result.responseXML.documentElement.getAttribute("Direction");
		globalUtilisateurId=result.responseXML.documentElement.getAttribute("Utilisateur_Id");
		//alert(globalUtilisateurId);
		document.getElementById("listeResponsable").value=globalUtilisateurId;
		if(globalIsDirection=="false") {
			document.getElementById("labelListeResponsable").collapsed =true;
			document.getElementById("listeResponsable").collapsed = true;
		} else {
			document.getElementById("labelListeResponsable").collapsed = false;
			document.getElementById("listeResponsable").collapsed = false;			
		}
		
	rechercher();
	} catch (e) {
		recup_erreur(e);
	}
	
}

function rechercher() {
	
	try {
		rechercherTache();
		rechercherEvenement();
	} catch (e) {
		recup_erreur(e);
	}
	
}

function rechercherTache() {
	
	try {
		initNbrPagesTac();
		aTaches.setParam("IsDirection",globalIsDirection);
		aTaches.setParam("Utilisateur_Id",globalUtilisateurId);
		aTaches.setParam("Responsable",document.getElementById("listeResponsable").value);
		aTaches.setParam("Prospect",document.getElementById("numCompte").value);
		aTaches.setParam("Contact",document.getElementById("contact").value);
		aTaches.setParam("ClientId",document.getElementById("ClientId").value);
		aTaches.setParam("Intitule",document.getElementById("intitule").value);		
		aTaches.setParam("Etat",document.getElementById("listeEtats").value);
		aTaches.setParam("param_Action",document.getElementById("listeActions").value);
		aTaches.setParam("Date_Debut",document.getElementById("dateDebut").value);
		aTaches.setParam("Date_Fin",document.getElementById("dateFin").value);
		aTaches.setParam("Nb_Lignes_Par_Page",document.getElementById("nbLignePageTac").value);
		aTaches.setParam("Page_Courante",gestTac_pageCourante);
		aTaches.initTree();		
		
		
	} catch (e) {
		recup_erreur(e);
	}
	
}

function rechercherEvenement() {
	
	try {
		initNbrPagesEvent();
		aEvenements.setParam("IsDirection",globalIsDirection);
		aEvenements.setParam("Utilisateur_Id",globalUtilisateurId);
		aEvenements.setParam("Responsable",document.getElementById("listeResponsable").value);
		aEvenements.setParam("Prospect",document.getElementById("numCompte").value);
		aEvenements.setParam("Contact",document.getElementById("contact").value);
		aEvenements.setParam("ClientId",document.getElementById("ClientId").value);
		aEvenements.setParam("Intitule",document.getElementById("intitule").value);		
		aEvenements.setParam("Etat",document.getElementById("listeEtats").value);
		aEvenements.setParam("param_Action",document.getElementById("listeActions").value);
		aEvenements.setParam("Date_Debut",document.getElementById("dateDebut").value);
		aEvenements.setParam("Date_Fin",document.getElementById("dateFin").value);
		aEvenements.setParam("Nb_Lignes_Par_Page",document.getElementById("nbLignePageTac").value);
		aEvenements.setParam("Page_Courante",gestTac_pageCourante);
		

		aEvenements.initTree();		
		
		
	} catch (e) {
		recup_erreur(e);
	}
	
}



/**					 					GESTION DES PAGES 						**/



function majNbrLigneTache() {
	try {
		gestTac_pageCourante = 1;
		rechercher();
	} catch (e) {
		recup_erreur(e);
	}
}


function majNbrLigneEvent() {
	try {
		gestEvent_pageCourante = 1;
		rechercher();
	} catch (e) {
		recup_erreur(e);
	}
}




function pressOnPageTacSuiv() {
	try {
		gestTac_pageCourante = gestTac_pageCourante + 1; 
		rechercherTache();
	} catch (e) {
		recup_erreur(e);
	}	
	
}


function pressOnPageEventSuiv() {
	try {
		gestEvent_pageCourante = gestEvent_pageCourante + 1; 
		rechercherEvent();
	} catch (e) {
		recup_erreur(e);
	}	
	
}


function pressOnPageTacPrec() {
	try {
		gestTac_pageCourante = gestTac_pageCourante - 1; 
		rechercherTache();
	} catch (e) {
		recup_erreur(e);
	}	
	
}


function pressOnPageEventPrec() {
	try {
		gestEvent_pageCourante = gestEvent_pageCourante - 1; 
		rechercherEvent();
	} catch (e) {
		recup_erreur(e);
	}	
	
}

function initNbrPagesTac(){
	
	try {
		var qPages = new QueryHttp("CRM/GestionTachesEvenements/infoTache.tmpl");
		qPages.setParam("IsDirection",globalIsDirection);
		qPages.setParam("Utilisateur_Id",globalUtilisateurId);
		qPages.setParam("Responsable",document.getElementById("listeResponsable").value);
		qPages.setParam("numCompte",document.getElementById("numCompte").value);
		qPages.setParam("Contact",document.getElementById("contact").value);
		qPages.setParam("Client_Id",document.getElementById("ClientId").value);
		qPages.setParam("Intitule",document.getElementById("intitule").value);		
		qPages.setParam("Etat",document.getElementById("listeEtats").value);
		qPages.setParam("param_Action",document.getElementById("listeActions").value);
		qPages.setParam("Date_Debut",document.getElementById("dateDebut").value);
		qPages.setParam("Date_Fin",document.getElementById("dateFin").value);
		qPages.setParam("Nbr_Ligne_Pages",document.getElementById("nbLignePage").value);
		var result = qPages.execute();
	  	var nbrPages= result.responseXML.documentElement.getAttribute("nombreLigneParPage");

	  	if(nbrPages!="0") {
	  		document.getElementById("pageFinTac").value=nbrPages;
	  	} else {
	  		document.getElementById("pageFinTac").value="1";
	  	}
	  
	  document.getElementById('pageDebTac').value = gestTac_pageCourante;
	  
	  
	} catch (e) {
		recup_erreur(e);		
	}

}


function initNbrPagesEvent(){
	
	try {
		var qPages = new QueryHttp("CRM/GestionTachesEvenements/infoTache.tmpl");
		qPages.setParam("IsDirection",globalIsDirection);
		qPages.setParam("Utilisateur_Id",globalUtilisateurId);
		qPages.setParam("Responsable",document.getElementById("listeResponsable").value);
		qPages.setParam("numCompte",document.getElementById("numCompte").value);
		qPages.setParam("Contact",document.getElementById("contact").value);
		qPages.setParam("Client_Id",document.getElementById("ClientId").value);
		qPages.setParam("Intitule",document.getElementById("intitule").value);		
		qPages.setParam("Etat",document.getElementById("listeEtats").value);
		qPages.setParam("param_Action",document.getElementById("listeActions").value);
		qPages.setParam("Date_Debut",document.getElementById("dateDebut").value);
		qPages.setParam("Date_Fin",document.getElementById("dateFin").value);
		qPages.setParam("Nbr_Ligne_Pages",document.getElementById("nbLignePage").value);
		var result = qPages.execute();
	  	var nbrPages= result.responseXML.documentElement.getAttribute("nombreLigneParPage");
	  	//showWarning("nbr Pages : " + nbrPages);
	  	
	  	if(nbrPages!="0") {
	  		document.getElementById("pageFinEvent").value=nbrPages;
	  	} else {
	  		document.getElementById("pageFinEvent").value="1";
	  	}
	  
	  document.getElementById('pageDebEvent').value = gestEvent_pageCourante;
	  
	  
	} catch (e) {
		recup_erreur(e);		
	}

}






/**									GESTION DU MENU DU HAUT										**/


function retourMenuPrincipal() {
	
	try {
		window.location = "chrome://opensi/content/crm/menu_principal.xul?"+ cookie();
	} catch (e) {
    recup_erreur(e);
  }
}
	
	

/**									CSV															**/


function genCSVgestionTaches(){
	
	try{
		
		var qCSV = new QueryHttp("CRM/GestionTachesEvenements/getCSVTaches.tmpl")
		
		qCSV.setParam("denomination",document.getElementById("numCompte").value);
		
		qCSV.setParam("isDirection",globalIsDirection);
		//showWarning(document.getElementById("listeResponsable").value);
		
		if(document.getElementById("listeResponsable").value!="TOUS") {
		qCSV.setParam("responsable",document.getElementById("listeResponsable").value);
		} else {
		qCSV.setParam("responsable","");
		}
		qCSV.setParam("utilisateurId",globalUtilisateurId);
		qCSV.setParam("clientId",document.getElementById("ClientId").value);
		qCSV.setParam("contact",document.getElementById("contact").value);
		qCSV.setParam("Intitule",document.getElementById("intitule").value);		
		qCSV.setParam("Etat",document.getElementById("listeEtats").value);
		qCSV.setParam("Param_Action",document.getElementById("listeActions").value);
		qCSV.setParam("Date_Debut",document.getElementById("dateDebut").value);
		qCSV.setParam("Date_Fin",document.getElementById("dateFin").value);
			
		var result = qCSV.execute();
		var fichier = result.responseXML.documentElement.getAttribute("fichierCsv");
		var nomFichier="Fichier.csv";
		var file = fileChooser("save",nomFichier);
		
		if(file!=null)
		{
			//showWarning(getDirBuffer()+"___"+fichier);
			downloadFile(getDirBuffer()+fichier,file);
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


		
		
function genCSVgestionEvenements(){
	
	try{
		
		var qCSV = new QueryHttp("CRM/GestionTachesEvenements/getCSVEvenement.tmpl")
		
		qCSV.setParam("denomination",document.getElementById("numCompte").value);
		
		qCSV.setParam("isDirection",globalIsDirection);
		//showWarning(document.getElementById("listeResponsable").value);
		
		if(document.getElementById("listeResponsable").value!="TOUS") {
		qCSV.setParam("responsable",document.getElementById("listeResponsable").value);
		} else {
		qCSV.setParam("responsable","");
		}
		qCSV.setParam("utilisateurId",globalUtilisateurId);
		qCSV.setParam("clientId",document.getElementById("ClientId").value);
		qCSV.setParam("contact",document.getElementById("contact").value);
		qCSV.setParam("Intitule",document.getElementById("intitule").value);
		qCSV.setParam("Param_Action",document.getElementById("listeActions").value);
		qCSV.setParam("Date_Debut",document.getElementById("dateDebut").value);
		qCSV.setParam("Date_Fin",document.getElementById("dateFin").value);
			
		var result = qCSV.execute();
		var fichier = result.responseXML.documentElement.getAttribute("fichierCsv");
		var nomFichier="Fichier.csv";
		var file = fileChooser("save",nomFichier);
		
		if(file!=null)
		{
			//showWarning(getDirBuffer()+"___"+fichier);
			downloadFile(getDirBuffer()+fichier,file);
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}		
		
		
		
/**								nouvelle tache / nouvel evenement											**/		
		
		
function nouvelleTache() {
	try {
		//alert("héhéhéhéhé");
		changeDeck(1);
		chargerTache("N");
		
	} catch (e) {
		recup_erreur(e);
	}
	
}	



function chargerTache(string) {
	try {
		
		
		/** document.getElementById("bRetourReglementsFournisseurs").collapsed=false; **/
		document.getElementById("oft-listeResponsable").disabled =  (globalIsDirection == "false");
		oft_listeResponsable.initTree(initoft_listeResponsable);
		//oft_listePays.initTree(initoft_listePays);
		if(string=="N") {
			document.getElementById("oft-listeEtats").value="N";
			document.getElementById("oft-DateT").value="";
			document.getElementById("oft-listePriorite").value="N";
			document.getElementById("oft-Intitule").value="";
			document.getElementById("oft-listeAction").value="";
			document.getElementById("oft-libelle").value="";				
		} else {
			
			/* Obtention d'une tâche */
			
			var qTache = new QueryHttp("CRM/GestionTachesEvenements/getTache.tmpl")
			qTache.setParam("tacheId",globalTacheId);
	
			result = qTache.execute();
			
			document.getElementById("oft-listeEtats").value=result.responseXML.documentElement.getAttribute("Etat");
			document.getElementById("oft-listeResponsable").value=result.responseXML.documentElement.getAttribute("Responsable");
			document.getElementById("oft-DateT").value=result.responseXML.documentElement.getAttribute("Date");
			document.getElementById("oft-listePriorite").value=result.responseXML.documentElement.getAttribute("Priorite");								
			document.getElementById("oft-Intitule").value=result.responseXML.documentElement.getAttribute("Intitule");			
			document.getElementById("oft-libelle").value=result.responseXML.documentElement.getAttribute("Libelle");		
		
			
		
			if(result.responseXML.documentElement.getAttribute("Action")==null){
				document.getElementById("oft-listeAction").value="";
			} else {
			
			document.getElementById("oft-listeAction").value=result.responseXML.documentElement.getAttribute("Action");
			}
			
			
			globalTacheContactId = result.responseXML.documentElement.getAttribute("Contact_Id");
			
			if(globalTacheContactId== null) {
				globalTacheContactId="";
			} else {
				remplirContact();
			}
			

			globalTacheProspectId = result.responseXML.documentElement.getAttribute("Prospect_Id");
			remplirInfoCompte();
			
			document.getElementById("bRechercherContact").disabled=false;
		}
			
	} catch(e) {
		recup_erreur(e);		
	}
}		



		
		
/**								charger tache / charger evenement 												**/



function dbClickListeTaches(){
	
	try {
		
		var i = aTaches.getCurrentIndex();	
		globalTacheId = aTaches.getCellText(i, 'Tache_Id');
		chargerTache("U");
		changeDeck(1);
	} catch (e) {
		recup_erreur(e);
	}
	
	
}		
		

	
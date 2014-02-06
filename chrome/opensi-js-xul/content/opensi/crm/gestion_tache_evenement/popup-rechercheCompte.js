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

var aResp = new Arbre("CRM/Commun/combo-responsables.tmpl", "listeResponsable");
var aPays = new Arbre("Facturation/Affaires/liste-pays.tmpl", "listePays");
var atypes= new Arbre("CRM/Commun/combo-typeProspect.tmpl", "listeType");
var aListeComptes = new Arbre("CRM/GestionComptes/liste-Comptes.tmpl", "listeComptes");

var globalIsDirection = "false";
var globalUtilisateurId = 0; 
var gestcom_pageCourante = 1;


function init() {
	
	try {

	globalIsDirection=window.arguments[0];
	globalUtilisateurId=window.arguments[1];
	  	
	  	
	  	
  	aResp.initTree(lockerDirection);
  	aPays.initTree(initPays);
	//atypes.iniTree();
	
	
	
	} catch(e) {
		
		recup_erreur(e);
	
	}

}

// lock ou unlock selon si l'utilisateur est de la direction
function lockerDirection() {
	try {
		var qIsDirection = new QueryHttp("CRM/Commun/infoUtilisateur.tmpl");
		var result = qIsDirection.execute();
		globalIsDirection= result.responseXML.documentElement.getAttribute("Direction");
		globalUtilisateurId=result.responseXML.documentElement.getAttribute("Utilisateur_Id");
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


function lockerListeCompte(boolean) {
	
	try {
		document.getElementById('listeComptes').disabled = boolean;
	} catch(e) {
		recup_erreur(e);
	}

}

function majNbrLigne() {
	try {
		gestcom_pageCourante = 1;
		rechercher();
	} catch (e) {
		recup_erreur(e);
	}
}

function dbClickListeComptes() {
	try{
		
		if(aListeComptes.isSelected()){	
			var i = aListeComptes.getCurrentIndex();
			
			
			ofsaResp.setParam("Selection",aListeComptes.getCellText(i, 'Responsable_Id'))
			ofsaResp.initTree();
			
			document.getElementById("ofs-denomination").value=aListeComptes.getCellText(i, 'denomination');
			
			globalProspectId=aListeComptes.getCellText(i, 'Prospect_Id');
			initialiser("");
			changeDeck(1);
		}
	
	}
	catch (e) {
		recup_erreur(e);
	}
}

function initPays() {
	try {
	document.getElementById("listePays").value="TOUS";
	atypes.initTree(initType);
		} catch (e) {
	  recup_erreur(e);
  }
	
}

function initType() {	
	try {
		document.getElementById("listeType").value="TOUS";
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnPageSuiv() {
	try {
		gestcom_pageCourante = gestcom_pageCourante + 1; 
		rechercher();
	} catch (e) {
		recup_erreur(e);
	}	
	
}


function pressOnAnnuler(){
	
	try {
		window.close();
	} catch (e) {
		 recup_erreur(e);	
	}
	
}


function pressOnPagePrec() {
	try {
		gestcom_pageCourante = gestcom_pageCourante - 1; 
		rechercher();
	} catch (e) {
		recup_erreur(e);
	}	
	
}


function rechercher() {
	try {
		
		//showWarning("recherche en cours");
		//lockerListeCompte(true);
		initNbrPages();
		aListeComptes.setParam("Denomination",document.getElementById("denomination").value);
		aListeComptes.setParam("CodePostal",document.getElementById("codePostal").value);
		aListeComptes.setParam("ClientId",document.getElementById("numClient").value);
		aListeComptes.setParam("Code_Pays",document.getElementById("listePays").value);
		aListeComptes.setParam("Type_Prospect",document.getElementById("listeType").value);
		aListeComptes.setParam("Nom_Contact",document.getElementById("contact").value);
		aListeComptes.setParam("Util_C",globalUtilisateurId);
		aListeComptes.setParam("Responsable",document.getElementById("listeResponsable").value);
		aListeComptes.setParam("IsDirection",globalIsDirection);
		aListeComptes.setParam("Utilisateur_Id",globalUtilisateurId);
		aListeComptes.setParam("Page_Courante",gestcom_pageCourante);
		aListeComptes.setParam("Nb_Lignes_Par_Page",document.getElementById("nbLignePage").value);
		aListeComptes.initTree(finInit);
		//lockerListeCompte(false);
		actualiserPages();
		
	} catch (e) {
	  recup_erreur(e);
  }
	
}

function finInit() {
	try {
		lockerListeCompte(false);
	} catch (e) {
		recup_erreur(e);
	}
}


function actualiserPages() {
	
	try {
		if(gestcom_pageCourante==1) {
			document.getElementById("bPrec").disabled = true;
		}
		else {
			document.getElementById("bPrec").disabled = false;
		}
		
		if(gestcom_pageCourante==document.getElementById("pageFin").value) {
			document.getElementById("bSuiv").disabled = true;
		}
		else {
			document.getElementById("bSuiv").disabled = false;
		}
		document.getElementById("pageDeb").value = gestcom_pageCourante;
		document.getElementById("listeComptes").disabled=false;
		} catch (e) {
		recup_erreur(e);		
	}
	
}

function initNbrPages(){
	
	try {
		var qPages = new QueryHttp("CRM/GestionComptes/infoCompte.tmpl");
		qPages.setParam("Denomination",document.getElementById("denomination").value);
		qPages.setParam("Code_Postal",document.getElementById("codePostal").value);
		qPages.setParam("Client_Id",document.getElementById("numClient").value);
		qPages.setParam("Code_Pays",document.getElementById("listePays").value);
		qPages.setParam("Type_Prospect",document.getElementById("listeType").value);
		qPages.setParam("Nom_Contact",document.getElementById("contact").value);
		if(document.getElementById("listeResponsable").value=="TOUS") {
			qPages.setParam("Responsable","");
		} else {
			qPages.setParam("Responsable",document.getElementById("listeResponsable").value);
		}
		
		qPages.setParam("IsDirection",globalIsDirection);
		qPages.setParam("Utilisateur_Id",globalUtilisateurId);
		qPages.setParam("Nbr_Ligne_Pages",document.getElementById("nbLignePage").value);
		var result = qPages.execute();
	  	var nbrPages= result.responseXML.documentElement.getAttribute("nbr_Pages");
	  	//showWarning("nbr Pages : " + nbrPages);
	  	
	  	if(nbrPages!="0") {
	  		document.getElementById("pageFin").value=nbrPages;
	  	} else {
	  		document.getElementById("pageFin").value="1";
	  	}
	  
	  document.getElementById('pageDeb').value = gestcom_pageCourante;
	  
	  
	} catch (e) {
		recup_erreur(e);		
	}
	
	
	
}

function oe_onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			rechercher();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function desactiverOnglet(boolean) {
	
	try {	
		document.getElementById('ofc-tabContact').disabled=boolean;
		document.getElementById('ofc-tabEvenement').disabled=boolean;
		
	} catch(e) {
		recup_erreur(e);
	}
	
}

function pop_reinitialiser(){
	try{
		document.getElementById("denomination").value="";
		document.getElementById("codePostal").value="";
		document.getElementById("numClient").value="";
		document.getElementById("listeType").value="TOUS";
		document.getElementById("listePays").value="TOUS";
		document.getElementById("Nom_Contact").value="";				
		rechercher();
		aListeComptes.initTree();
	}
	catch (e){
		recup_erreur(e);
	}		
}

function getCompte() {
	
	try{
		
		if(aListeComptes.isSelected()){	
			var i = aListeComptes.getCurrentIndex();			
			//var denomination =aListeComptes.getCellText(i, 'denomination');		
			globalProspectId=aListeComptes.getCellText(i, 'Prospect_Id');
			window.arguments[2](globalProspectId);
			window.close();
		}
	}
	catch (e) {
		recup_erreur(e);
	}
	
	
}

function pressOnOk(){
	
	try{
		if (aListeComptes.selectedIndex!=-1) {
			getCompte();
		}
	} catch (e) {
		recup_erreur(e);
	}
	
}

function oe_onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			rechercher();
		}
	} catch (e) {
		recup_erreur(e);
	}
}



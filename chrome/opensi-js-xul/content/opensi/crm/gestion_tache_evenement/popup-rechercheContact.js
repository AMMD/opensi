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

var ofcaPays =new Arbre("Facturation/Affaires/liste-pays.tmpl","ofc-listePays");
var aContacts = new Arbre("CRM/GestionComptes/liste-Contacts.tmpl","ofc-listeContacts");
var globalContactId = "";
var globalProspectId="";

function init() {
	
	try {
		
		globalProspectId=window.arguments[0];
		initContact();
		
	} catch (e) {
		recup_erreur(e);
	}
	
}

function ofcInitPays() {
	
	try {
		document.getElementById('ofc-listePays').value="FR";
	} catch (e) {
		 recup_erreur(e);
	}
	
}
function initContact() {
	try {
		aContacts.setParam("Prospect_Id",globalProspectId);
		aContacts.initTree();
	} catch(e) {
		
		recup_erreur(e);
		
	}
}



function getContact() {
	
	try{
		
		if(aContacts.isSelected()){	
			var i = aContacts.getCurrentIndex();			
			globalContactId=aContacts.getCellText(i, 'Contact_Id');
			window.arguments[1](globalContactId);
			window.close();
		}
	}
	catch (e) {
		recup_erreur(e);
	}
	
	
}


function pressOnOk(){
	
	try{
		if (aContacts.selectedIndex!=-1) {
			getContact();
		}
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

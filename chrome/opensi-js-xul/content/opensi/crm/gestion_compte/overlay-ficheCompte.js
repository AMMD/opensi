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


function refreshTabPanel(){
	try {
		
		var qGetInfos=new QueryHttp("CRM/GestionComptes/getCompte.tmpl");
		qGetInfos.setParam("prospectId",globalProspectId);
		result = qGetInfos.execute();
		var dateCreation=result.responseXML.documentElement.getAttribute("Date_C");
		var dateModification=result.responseXML.documentElement.getAttribute("Date_M");
		var utilC=result.responseXML.documentElement.getAttribute("loginUtil_C");
		var utilM=result.responseXML.documentElement.getAttribute("loginUtil_M");

		document.getElementById("Creation").label="Compte crée le "+dateCreation+" par "+utilC;
		document.getElementById("Modification").label="Dernière modification le "+dateModification+" par "+utilM;
		document.getElementById("Fiche").label=document.getElementById("ofs-denomination").value;
	} catch (e) {
  	   recup_erreur(e);
	}
}


function clearTabPanel() {
	try {
		document.getElementById("Creation").label="";
		document.getElementById("Modification").label="";
		document.getElementById("Fiche").label="";
	} catch (e) {
  	   recup_erreur(e);
	}
}








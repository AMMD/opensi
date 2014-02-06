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
	
var  oft_listeResponsable = new Arbre ("CRM/Commun/combo-responsables.tmpl","oft-listeResponsable");	
var	 oft_listePays = new Arbre("Facturation/Affaires/liste-pays.tmpl","oft-listePays");	
var  oft_listeAction = new Arbre("CRM/GestionTachesEvenements/combo-actionFicheTache.tmpl","oft-listeAction"); 	
	
	
var globalTacheProspectId = 0;
var globalTacheContactId ="";

var modifie = false;
	
	
function initoft_listeResponsable() {
	
	try {
		document.getElementById("oft-listeResponsable").value=globalUtilisateurId;
	} catch (e){
		recup_erreur(e);
	}
}

function initoft_listePays(){
	
	try {
		
		document.getElementById("oft-listePays").value="FR";
		
	} catch (e) {
		recup_erreur(e);
	}	
	
}	

function oftEnregistrer() {
	
	try {
		
		
		
		
		var auth = false;
		
		if(document.getElementById("oft-DateT").value=="" || !isDate(document.getElementById("oft-DateT").value)){
					
			showWarning("Date incorrect");
			
			
		} else {
			
			if(document.getElementById("oft-Intitule").value=="" ) {
			
				showWarning("L'intitule ne doit pas être vide ");
				
			} else {
				
				
				if(document.getElementById("oft-DenomCompte").value==""){
					
					showWarning("Veuillez choisir un compte associé");

					
				} else {
				
				
				auth=true;
				}
				
			}
			
		}
		
		
		if(auth){
		
		document.getElementById("boft-Supprimer").disabled=false;
		var qsaveTache=new QueryHttp("CRM/GestionTachesEvenements/enregistrer-Tache.tmpl");
			
		// partie tache
		
		qsaveTache.setParam("Etat",document.getElementById("oft-listeEtats").value);
		qsaveTache.setParam("Responsable",document.getElementById("oft-listeResponsable").value);
		qsaveTache.setParam("Date",document.getElementById("oft-DateT").value);
		qsaveTache.setParam("Priorite",document.getElementById("oft-listePriorite").value);
		qsaveTache.setParam("Intitule",document.getElementById("oft-Intitule").value);
		qsaveTache.setParam("var_Action",document.getElementById("oft-listeAction").value);
		qsaveTache.setParam("Libelle",document.getElementById("oft-libelle").value);
		qsaveTache.setParam("TacheId",globalTacheId);
		
		// partie compte & contact
			
		qsaveTache.setParam("Prospect_Id", globalTacheProspectId);
		qsaveTache.setParam("Contact",globalTacheContactId);
		
		result = qsaveTache.execute();
		
		refreshTabPanel();
		
		
		}
	} catch (e) {
		recup_erreur(e);
	}

}


function oftNouvelleTache(){
	
	try {
		
		
		
		
		if(!modifie) {
		
		clearTabPanel();
		//Réinitialisation des variables
		
		globalTacheId = "";
		var globalTacheProspectId = 0;
		var globalTacheContactId ="";
		
		// Initialisation de la partie "tâches"
		document.getElementById("oft-listeEtats").value="N";
		//alert(globalUtilisateurId);
		document.getElementById("oft-listeResponsable").value=globalUtilisateurId;
		document.getElementById("oft-DateT").value="";
		document.getElementById("oft-listePriorite").value="N";
		document.getElementById("oft-Intitule").value="";
		document.getElementById("oft-listeAction").value="";
		document.getElementById("oft-libelle").value="";	
		
		// Initialisation de la partie "compte"
		
		document.getElementById("oft-DenomCompte").value="";
		document.getElementById("adresse1-compte").value="";
		document.getElementById("adresse2-compte").value="";		
		document.getElementById("adresse3-compte").value="";		
		document.getElementById("CP-compte").value="";
		document.getElementById("Ville-compte").value="";
		document.getElementById("Pays-compte").value="";
		document.getElementById("Tel-compte").value="";
		document.getElementById("Fax-compte").value="";
		document.getElementById("Mail-compte").value="";

		// Initialisation de la partie "contact"

		document.getElementById("oft-DenomContact").value="";
		document.getElementById("adresse1-contact").value="";
		document.getElementById("CP-contact").value="";
		document.getElementById("Ville-contact").value="";
		document.getElementById("Pays-contact").value="";
		document.getElementById("oft-DenomContact").value="";
		document.getElementById("Tel-contact").value="";
		document.getElementById("Port-contact").value="";
		document.getElementById("Fax-contact").value="";
		document.getElementById("Mail-contact").value="";
		
		
		document.getElementById("boft-Supprimer").disabled=true;
		} else {
			
		var go = false;	
		
		go = window.confirm("Il y a des informations non sauvegardées, voulez vous vraiment quitter?");
			
			if (go) {
				modifie = false;
				oftNouvelleTache();	
			}	
			
		}
		
	} catch(e){
		recup_erreur(e);
	}
	
	
}


function remplirInfoCompte(){
	
	try {
		
		
		var qGetInfoCompte=new QueryHttp("CRM/GestionComptes/getCompte.tmpl");
		qGetInfoCompte.setParam("prospectId",globalTacheProspectId);
		reponse=qGetInfoCompte.execute();
		
		document.getElementById("oft-DenomCompte").value=reponse.responseXML.documentElement.getAttribute("Denomination");
		document.getElementById("adresse1-compte").value=reponse.responseXML.documentElement.getAttribute("Adresse_1");
		document.getElementById("adresse2-compte").value=reponse.responseXML.documentElement.getAttribute("Adresse_2");		
		document.getElementById("adresse3-compte").value=reponse.responseXML.documentElement.getAttribute("Adresse_3");		
		document.getElementById("CP-compte").value=reponse.responseXML.documentElement.getAttribute("Code_Postal");
		document.getElementById("Ville-compte").value=reponse.responseXML.documentElement.getAttribute("Ville");
		
		document.getElementById("Tel-compte").value=reponse.responseXML.documentElement.getAttribute("Tel");
		document.getElementById("Fax-compte").value=reponse.responseXML.documentElement.getAttribute("Fax");
		document.getElementById("Mail-compte").value=reponse.responseXML.documentElement.getAttribute("Email");
		
		
		var qGetPays=new QueryHttp("CRM/Commun/getNomFRPays.tmpl");
		qGetPays.setParam("Code_Pays",reponse.responseXML.documentElement.getAttribute("Code_Pays"));
		result=qGetPays.execute();
		
		document.getElementById("Pays-compte").value=result.responseXML.documentElement.getAttribute("Nom_Fr");
		
		
	}catch(e){
		recup_erreur(e);
	}
	
}


function obtenirCompte(pid) {
	
	try {
		globalTacheProspectId = pid;
		document.getElementById("bRechercherContact").disabled=false;
		remplirInfoCompte();
		initialiserContact();
	} catch (e) {
		recup_erreur(e);
	}			
}


function initialiserContact(){
	
	try {
		
		document.getElementById("oft-DenomContact").value="";
		document.getElementById("adresse1-contact").value="";
		//document.getElementById("adresse2-contact").value="";
		//document.getElementById("adresse3-contact").value="";
		document.getElementById("CP-contact").value="";
		document.getElementById("Ville-contact").value="";
		document.getElementById("Pays-contact").value="";		//alert("héhéhéhéhé");
		document.getElementById("oft-DenomContact").value="";
		document.getElementById("Tel-contact").value="";
		document.getElementById("Port-contact").value="";
		document.getElementById("Fax-contact").value="";
		document.getElementById("Mail-contact").value="";
			
		globalTacheContactId ="";
		
	} catch (e) {
		recup_erreur(e);
	}
	
	
}



function oft_supprimerContact() {
	
	try {
		
		initialiserContact();
		globalTacheContactId ="";
		
	} catch (e) {
		recup_erreur(e);
	} 
	
	
}


function remplirContact(){
	
	try {
		
		var qGetInfoContact=new QueryHttp("CRM/GestionComptes/getContact.tmpl");
		qGetInfoContact.setParam("Contact_Id",globalTacheContactId);
		reponse=qGetInfoContact.execute();
		
		var civilite = reponse.responseXML.documentElement.getAttribute("Civilite");
		if(civilite==1){
			civilite="M.";
		} else {
			if(civilite==2){
				civilite="Mme";
			} else {
				civilite = "Mlle";
			}
		}
		var nom = reponse.responseXML.documentElement.getAttribute("Nom");
		var prenom = reponse.responseXML.documentElement.getAttribute("Prenom");
		var denom = civilite+" "+nom+" "+prenom;
		
		
		document.getElementById("oft-DenomContact").value=denom;
		document.getElementById("adresse1-contact").value=reponse.responseXML.documentElement.getAttribute("Adresse");
		document.getElementById("CP-contact").value=reponse.responseXML.documentElement.getAttribute("Code_Postal");
		document.getElementById("Ville-contact").value=reponse.responseXML.documentElement.getAttribute("Ville");
		//document.getElementById("oft-listePays-Contact").value="";
		document.getElementById("Tel-contact").value=reponse.responseXML.documentElement.getAttribute("Tel");
		document.getElementById("Port-contact").value=reponse.responseXML.documentElement.getAttribute("Portable");
		document.getElementById("Fax-contact").value=reponse.responseXML.documentElement.getAttribute("Fax");
		document.getElementById("Mail-contact").value=reponse.responseXML.documentElement.getAttribute("Email");
		
		
		var qGetPays=new QueryHttp("CRM/Commun/getNomFRPays.tmpl");
		qGetPays.setParam("Code_Pays",reponse.responseXML.documentElement.getAttribute("Code_Pays"));
		result=qGetPays.execute();
		document.getElementById("Pays-contact").value=result.responseXML.documentElement.getAttribute("Nom_Fr");
		
		
		
	} catch (e) {
		recup_erreur(e);	
	}
	
}


function obtenirContact(contactId) {
	
	try {
		
		globalTacheContactId = contactId;		
		//alert(contactId);
		
		
		remplirContact();
		
	} catch (e) {
		recup_erreur(e);
	}
	
	
	
}

function oft_rechercherContact() {
	
	try {
		
		var url = "chrome://opensi/content/crm/gestion_tache_evenement/popup-rechercheContact.xul?"+cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',globalTacheProspectId,obtenirContact);
		
	} catch (e) {
		
		recup_erreur(e);
		
	}
	
}


function oft_rechercherCompte() {
	
	
	try {
	
	var url = "chrome://opensi/content/crm/gestion_tache_evenement/popup-rechercheCompte.xul?"+ cookie();
    window.openDialog(url,'','chrome,modal,centerscreen',globalIsDirection,globalUtilisateurId,obtenirCompte);
		
		
	} catch (e) {
		
		recup_erreur(e);
	}

}


function oftpressOnSupprimer(){
	
	
	try {
		
		var go = false;	
		
		go = window.confirm("Voulez-vous supprimer ce contact ?");
			
		if (go) {	
			var qDeleteTache=new QueryHttp("CRM/GestionTachesEvenements/supprimer-Tache.tmpl");
			qDeleteTache.setParam("Tache_Id",globalTacheId);
			qDeleteTache.execute(oftNouvelleTache);
			clearTabPanel();
		}
		
		
	} catch (e) {
		recup_erreur(e);
	}
 		
}
	
	
	
	
/**									Gestion de la tâche															**/	
	
	
function refreshTabPanel(){
	try {
		
		//document.getElementById("test").collapsed=false;
		
		var qGetInfos=new QueryHttp("CRM/GestionTachesEvenements/getTache.tmpl");
		qGetInfos.setParam("tacheId",globalTacheId);
		result = qGetInfos.execute();
		var dateCreation=result.responseXML.documentElement.getAttribute("Date_C");
		var dateModification=result.responseXML.documentElement.getAttribute("Date_M");
		var utilC=result.responseXML.documentElement.getAttribute("Createur");
		var utilM=result.responseXML.documentElement.getAttribute("Modificateur");

		document.getElementById("StatBaroft-Creation").label="Tâche crée le "+dateCreation+" par "+utilC;
		document.getElementById("StatBaroft-Modification").label="Dernière modification le "+dateModification+" par "+utilM;
		
	} catch (e) {
  	   recup_erreur(e);
	}
}


function clearTabPanel() {
	try {
		document.getElementById("StatBaroft-Creation").label="";
		document.getElementById("StatBaroft-Modification").label="";

	} catch (e) {
  	   recup_erreur(e);
	}
}
	
	
	
function setModifie(m) {
  try {

  	modifie = m;

	} catch (e) {
  	recup_erreur(e);
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

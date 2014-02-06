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

var ofcaPays =new Arbre("Facturation/Affaires/liste-pays.tmpl","ofc-listePays");
var aContacts = new Arbre("CRM/GestionComptes/liste-Contacts.tmpl","ofc-listeContacts");
var globalContactId = "";


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

function ofsNouveauContact(){
	try {	
		document.getElementById('ofc-Civilite').value="1";
		document.getElementById('ofc-Nom').value="";
		document.getElementById('ofc-Prenom').value="";
		document.getElementById('ofc-Fonction').value="";
		document.getElementById('ofc-DNaiss').value="";	
		document.getElementById('ofc-Adresse').value="";		
		document.getElementById('ofc-CP').value="";
		document.getElementById('ofc-Ville').value="";
		document.getElementById('ofc-listePays').value="FR";
		document.getElementById('ofc-relation').value=2;
		document.getElementById('ofc-Telephone').value="";				
		document.getElementById('ofc-Fax').value="";
		document.getElementById('ofc-mail').value="";
		document.getElementById('ofc-Portable').value="";	
		} catch (e) {
		recup_erreur(e);
	}	
}


function ofc_pressOnSupprimer() {
	try {
		var go = false;	
		
			go = window.confirm("Voulez-vous supprimer ce contact ?");
			
		if (go) {
			ofcSupprimer();
		}
	} catch (e) {
		recup_erreur(e);
	}
}




function ofcSupprimer() {
	
	try {
		
			var qDeleteProspect=new QueryHttp("CRM/GestionComptes/supprimer-Contact.tmpl");
			qDeleteProspect.setParam("Contact_Id",globalContactId);
			result = qDeleteProspect.execute();
			
			var errors = new Errors(result);
			
			if (errors.hasNext()) {
				errors.show();
			} else  {
				aContacts.initTree();
				ofsNouveauContact();
			}
		
	} catch (e) {
		
		recup_erreur(e);
		
	}
	
	
	
	
}

	
function onClickListeContact() {
	try {
		
		var qGetInfos=new QueryHttp("CRM/GestionComptes/getContact.tmpl");
		var i = aContacts.getCurrentIndex();
		qGetInfos.setParam("Contact_Id",aContacts.getCellText(i, 'Contact_Id'));
		result = qGetInfos.execute();
		
		document.getElementById('ofc-Civilite').value=result.responseXML.documentElement.getAttribute("Civilite");
		document.getElementById('ofc-Nom').value=result.responseXML.documentElement.getAttribute("Nom");
		document.getElementById('ofc-Prenom').value=result.responseXML.documentElement.getAttribute("Prenom");
		document.getElementById('ofc-Fonction').value=result.responseXML.documentElement.getAttribute("Fonction");
		document.getElementById('ofc-DNaiss').value=result.responseXML.documentElement.getAttribute("Date_Naissance");	
		document.getElementById('ofc-Adresse').value=result.responseXML.documentElement.getAttribute("Adresse");		
		document.getElementById('ofc-CP').value=result.responseXML.documentElement.getAttribute("Code_Postal");
		document.getElementById('ofc-Ville').value=result.responseXML.documentElement.getAttribute("Ville");
		document.getElementById('ofc-listePays').value=result.responseXML.documentElement.getAttribute("Code_Pays");
		if(result.responseXML.documentElement.getAttribute("Relation")=="H") {
			document.getElementById('ofc-relation').value="H";
		} else {
			document.getElementById('ofc-relation').value="O";
		}
		
		document.getElementById('ofc-Telephone').value=result.responseXML.documentElement.getAttribute("Tel");				
		document.getElementById('ofc-Fax').value=result.responseXML.documentElement.getAttribute("Fax");
		document.getElementById('ofc-mail').value=result.responseXML.documentElement.getAttribute("Email");
		document.getElementById('ofc-Portable').value=result.responseXML.documentElement.getAttribute("Portable");
		globalContactId = aContacts.getCellText(i, 'Contact_Id');
				
	} catch(e) {
		recup_erreur(e);
	}
}	
	

function ofcEnregistrer(){
	try 
	{	
		var auth = false;
		if(document.getElementById("ofc-Nom").value == "") {
			showWarning("Un nom est requis");					
		} else {
			if(document.getElementById("ofc-Telephone").value!="" &&!isPhone(document.getElementById("ofc-Telephone").value)){
				showWarning("Téléphone incorrect");
			} else {
				if(document.getElementById("ofc-mail").value!="" && !isEmail(document.getElementById("ofc-mail").value)){
					showWarning("Email incorrect");
				} else { 
					if(document.getElementById("ofc-Fax").value!="" && !isPhone(document.getElementById("ofc-Fax").value)){
							showWarning("Fax incorrect");
						} else {
							if(document.getElementById("ofc-Portable").value!="" && !isPhone(document.getElementById("ofc-Portable").value)  ){
								showWarning("Portable incorrect");	
							} else {
								if(document.getElementById("ofc-DNaiss").value!="" && !isDate(document.getElementById("ofc-DNaiss").value)) {
									showWarning("Date incorrect");										
								} else {
									
								auth = true;
								}
											
								
							
							}
						}
					}
				}
			}

		
		// si tout les points de contrôles ont été passés
		if(auth){
			var qSaveContact=new QueryHttp("CRM/GestionComptes/enregistrer-Contact.tmpl");
			
			qSaveContact.setParam("Civilite",document.getElementById("ofc-Civilite").value);
			qSaveContact.setParam("Nom",document.getElementById("ofc-Nom").value);
			qSaveContact.setParam("Prenom",document.getElementById("ofc-Prenom").value);
			qSaveContact.setParam("Fonction",document.getElementById("ofc-Fonction").value);
			qSaveContact.setParam("Date_Naissance",document.getElementById("ofc-DNaiss").value);
			qSaveContact.setParam("Relation",document.getElementById("ofc-relation").value);
			
			qSaveContact.setParam("Telephone",document.getElementById("ofc-Telephone").value);
			qSaveContact.setParam("Portable",document.getElementById("ofc-Portable").value);
			qSaveContact.setParam("Fax",document.getElementById("ofc-Fax").value);
			qSaveContact.setParam("Email",document.getElementById("ofc-mail").value);
			
			qSaveContact.setParam("Adresse",document.getElementById("ofc-Adresse").value);
			qSaveContact.setParam("Code_Postal",document.getElementById("ofc-CP").value);
			qSaveContact.setParam("Ville",document.getElementById("ofc-Ville").value);
			qSaveContact.setParam("Code_Pays",document.getElementById("ofc-listePays").value);
			qSaveContact.setParam("Commentaires",document.getElementById("ofc-comLibre").value);
			qSaveContact.setParam("Prospect_Id",globalProspectId);
			qSaveContact.setParam("Contact_Id",globalContactId);
	
			reponse = qSaveContact.execute();
			globalContactId=reponse.responseXML.documentElement.getAttribute("ContactId");
			initContact();
		}
	 } catch (e) {
  	   recup_erreur(e);
		
	}
	
}

	
	
	


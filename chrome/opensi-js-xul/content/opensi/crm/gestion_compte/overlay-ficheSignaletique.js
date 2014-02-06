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

var ofsaPays =new Arbre("Facturation/Affaires/liste-pays.tmpl","ofs-listePays");
var ofsaType =new Arbre("CRM/Commun/combo-typeProspect.tmpl","ofs-listeType");
var ofsaResp = new Arbre("CRM/Commun/combo-responsables.tmpl", "ofs-listeResponsable");


function ofs_pressOnSupprimer() {
	try {
		var go = false;	
		
			go = window.confirm("Voulez-vous supprimer ce compte ?");
			
		if (go) {
			ofsSupprimer();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofsSupprimer(){
	try {
		
		var qDeleteProspect=new QueryHttp("CRM/GestionComptes/supprimer-Compte.tmpl");
			qDeleteProspect.setParam("Prospect_Id",globalProspectId);
			result = qDeleteProspect.execute();
		
		var errors = new Errors(result);
		
		if (errors.hasNext()) {
			errors.show();
		} else {
			initialiser("N");
			clearTabPanel();
		}
			
	}catch(e){
		recup_erreur(e);
	}
}

function ofsEnregistrer(){
	try 
	{	
		var auth = false;
		if(document.getElementById("ofs-denomination").value == "") {
			showWarning("Dénomination incorrecte");					
		} else {
			if (document.getElementById("ofs-adresse1").value == "") {
				showWarning("Adresse incorrecte");
			} else {
				if(document.getElementById("ofs-ville").value==""){
					showWarning("Ville incorrecte");
				} else { 
					if(document.getElementById("ofs-listeResponsable").value=="TOUS"){
						showWarning("Selectionnez un responsable");
					} else {
						if(!isPhone(document.getElementById("ofs-telephone").value)&&document.getElementById("ofs-telephone").value!=""){
							showWarning("Téléphone incorrect");
						} else {
							if(!isEmail(document.getElementById("ofs-email").value)&&document.getElementById("ofs-email").value!=""){
								showWarning("Email incorrect");
							} else { 
								if(!isURL(document.getElementById("ofs-Site_Web").value)&&document.getElementById("ofs-Site_Web").value!=""){
									showWarning("Site Web incorrect");
								} else { 
									if(!isPhone(document.getElementById("ofs-fax").value)&&document.getElementById("ofs-fax").value!=""){
										showWarning("Fax incorrect");
									} else {
										if(document.getElementById("ofs-listeType").value=="TOUS"){
											showWarning("Selectionnez un type de compte ");	
										}else {
													auth = true;
													}
												}
											}
										}
									}
								}
							}
						}
					}
				
				
				if(auth) {
					if(!isPositiveOrNullInteger(document.getElementById("ofs-CA").value) && document.getElementById("ofs-CA").value!="" ){
						auth=false;
						showWarning("Erreur dans le formatage du chiffre d'affaires , entrez un montant entier positif ou null.");
					} else {
						if(!isPositiveOrNullInteger(document.getElementById("ofs-nbr-employes").value) && document.getElementById("ofs-nbr-employes").value!="" ){
							auth=false;
							showWarning("Erreur dans le formatage du nombre d'employés , entrez un montant entier positif ou null.");
						}
					}
				}
		
		
		// si tout les points de contrôles ont été passés
		if(auth){
			var qSaveProspect=new QueryHttp("CRM/GestionComptes/enregistrer-Compte.tmpl");
			
			qSaveProspect.setParam("utilR",globalUtilisateurId);// 1 ici avant
			qSaveProspect.setParam("Chiffre_Affaire",document.getElementById("ofs-CA").value);
			qSaveProspect.setParam("Nb_Employes",document.getElementById("ofs-nbr-employes").value);
			qSaveProspect.setParam("Client_Id","-1");
			qSaveProspect.setParam("Commentaires",document.getElementById("ofs-comLibre").value);
			qSaveProspect.setParam("Tel",document.getElementById("ofs-telephone").value);
			qSaveProspect.setParam("Fax",document.getElementById("ofs-fax").value);
			qSaveProspect.setParam("Email",document.getElementById("ofs-email").value);
			qSaveProspect.setParam("Site_Web",document.getElementById("ofs-Site_Web").value);
			qSaveProspect.setParam("Type",document.getElementById("ofs-listeType").value);
			qSaveProspect.setParam("Denomination",document.getElementById("ofs-denomination").value);
			qSaveProspect.setParam("Adresse_1",document.getElementById("ofs-adresse1").value);
			qSaveProspect.setParam("Adresse_2",document.getElementById("ofs-adresse2").value);		
			qSaveProspect.setParam("Adresse_3",document.getElementById("ofs-adresse3").value);	
			qSaveProspect.setParam("Code_Postal",document.getElementById("ofs-Code_Postal").value);
			qSaveProspect.setParam("Ville",document.getElementById("ofs-ville").value);
			qSaveProspect.setParam("Code_Pays",document.getElementById("ofs-listePays").value);
			
			if(document.getElementById("ofs-projet").checked) {
				qSaveProspect.setParam("Projet",true);
			}
			else {
				qSaveProspect.setParam("Projet",false);
			}
			qSaveProspect.setParam("Prospect_Id",globalProspectId);
			reponse = qSaveProspect.execute();
			globalProspectId=reponse.responseXML.documentElement.getAttribute("Prospect_Id");
			refreshTabPanel()
			desactiverOnglet(false);
		}
	 } catch (e) {
  	   recup_erreur(e);
		
	}
	
}

function initofsaResp() {
	
	try {
		document.getElementById("ofs-listeResponsable").value=globalUtilisateurId;
	} catch (e) {
		recup_erreur(e);
	}
	
	
}

function initialiser(type){ 
	
	try 
	{
		document.getElementById("bMenuComptes").collapsed=false;
		document.getElementById("ofs-listeResponsable").disabled =  (globalIsDirection == "false");



		//nouveau dossier
		if(type=="N") {
			ofsaResp.initTree(initofsaResp);
			document.getElementById("ofs-denomination").value="";
			document.getElementById("ofs-adresse1").value="";
			document.getElementById("ofs-adresse2").value="";
			document.getElementById("ofs-adresse3").value="";
			document.getElementById("ofs-Code_Postal").value="";
			document.getElementById("ofs-ville").value="";
			document.getElementById("ofs-listePays").value="FR";			
			document.getElementById("ofs-telephone").value="";	
			document.getElementById("ofs-fax").value="";
			document.getElementById("ofs-email").value="";
			document.getElementById("ofs-nbr-employes").value="";
			document.getElementById("ofs-CA").value="";	
			document.getElementById("ofs-projet").checked="";

		} else {
			initContact();
			initFicheTaches();
			refreshTabPanel();
			
			var qGetInfos=new QueryHttp("CRM/GestionComptes/getCompte.tmpl");
			qGetInfos.setParam("prospectId",globalProspectId);
			result = qGetInfos.execute();
			var dateCreation=result.responseXML.documentElement.getAttribute("Date_C");
			var dateModification=result.responseXML.documentElement.getAttribute("Date_M");
			var utilC=result.responseXML.documentElement.getAttribute("loginUtil_C");
			var utilM=result.responseXML.documentElement.getAttribute("loginUtil_M");
			var denomination = document.getElementById("ofs-denomination").value;
			document.getElementById("ofs-adresse1").value=result.responseXML.documentElement.getAttribute("Adresse_1");
			document.getElementById("ofs-adresse2").value=result.responseXML.documentElement.getAttribute("Adresse_2");
			document.getElementById("ofs-adresse3").value=result.responseXML.documentElement.getAttribute("Adresse_3");
			document.getElementById("ofs-Code_Postal").value=result.responseXML.documentElement.getAttribute("Code_Postal");
			document.getElementById("ofs-ville").value=result.responseXML.documentElement.getAttribute("Ville");
			document.getElementById("ofs-listePays").value=result.responseXML.documentElement.getAttribute("Code_Pays");			
			document.getElementById("ofs-telephone").value=result.responseXML.documentElement.getAttribute("Tel");	
			document.getElementById("ofs-fax").value=result.responseXML.documentElement.getAttribute("Fax");
			document.getElementById("ofs-email").value=result.responseXML.documentElement.getAttribute("Email");
			document.getElementById("ofs-nbr-employes").value=result.responseXML.documentElement.getAttribute("Nb_Employes");
			document.getElementById("ofs-CA").value=result.responseXML.documentElement.getAttribute("Chiffre_Affaire");	
			document.getElementById("ofs-projet").checked=(result.responseXML.documentElement.getAttribute("Projet")=="true");
			document.getElementById("ofs-listeResponsable").value=result.responseXML.documentElement.getAttribute("Util_R");
			document.getElementById("ofs-listeType").value=result.responseXML.documentElement.getAttribute("Type");
			if(denomination != "") {
			document.getElementById("Fiche").label="Compte "+denomination;
			
			}
				
		}
  } catch (e) {
  	   recup_erreur(e);
		
	}
	
	
}



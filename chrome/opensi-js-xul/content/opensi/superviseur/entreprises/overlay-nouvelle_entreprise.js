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


function initNouvelleEntreprise() {
	try {
		
		document.getElementById('ne-Identifiant').value = "";
  	document.getElementById('ne-Denomination').value = "";
  	document.getElementById('ne-Tel').value = "";
		document.getElementById('ne-Email').value = "";
		document.getElementById('ne-Email').disabled = false;
		document.getElementById('ne-No_Mail').checked = false;
		document.getElementById('ne-gesco').checked = true;
		document.getElementById('ne-compta').checked = true;
		document.getElementById('ne-contact').checked = false;
		document.getElementById('ne-Responsable').value = "";

		document.getElementById('ne-Identifiant').focus();		
		document.getElementById("bMenuEntreprises").collapsed = false;
  	document.getElementById("deck").selectedIndex=1;

	} catch (e) {
    recup_erreur(e);
  }
}


function checkNouveauMail() {
	try {
		var no_mail = document.getElementById('ne-No_Mail').checked;
		if (no_mail) {
			document.getElementById('ne-Email').value = "";
			document.getElementById('ne-Email').disabled = true;
		} else {
			document.getElementById('ne-Email').disabled = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function creerEntreprise() {
	try {

		var identifiant = document.getElementById('ne-Identifiant').value;
  	var denomination = document.getElementById('ne-Denomination').value;
  	var telephone = document.getElementById('ne-Tel').value;
		var email = document.getElementById('ne-Email').value;
		var no_mail = (document.getElementById('ne-No_Mail').checked?"1":"0");
		var responsable = document.getElementById('ne-Responsable').value;
		var gesco = (document.getElementById("ne-gesco").checked?"1":"0");
		var compta = (document.getElementById("ne-compta").checked?"1":"0");
		var contact = (document.getElementById("ne-contact").checked?"1":"0");

		if (isEmpty(identifiant)) { showWarning("Veuillez saisir un identifiant !"); }
		else if (!isCleAlpha(identifiant)) { showWarning('Identifiant incorrect ! (A-Z,a-z,0-9,_)'); }
		else if (isEmpty(denomination)) { showWarning("Veuillez saisir une dénomination !"); }
		else if ((no_mail=="1") && isEmpty(telephone)) { showWarning("Veuillez saisir un téléphone !"); }
		else if (!isEmpty(telephone) && !isPhone(telephone)) { showWarning("Le téléphone est invalide !"); }
		else if ((no_mail=="0") && isEmpty(email)) { showWarning("Veuillez saisir une adresse e-mail !"); }
		else if (!isEmpty(email) && !isEmail(email)) { showWarning("L'adresse e-mail est incorrecte !"); }
		else {

  		var qNouvEnt = new QueryHttp("Superviseur/entreprises/nouvelleEntreprise.tmpl");
			qNouvEnt.setParam("Identifiant", identifiant);
			qNouvEnt.setParam("Denomination", denomination);
			qNouvEnt.setParam("Telephone", telephone);
			qNouvEnt.setParam("Email", email);
			qNouvEnt.setParam("No_Mail", no_mail);
			qNouvEnt.setParam("Responsable", responsable);
			qNouvEnt.setParam("Acc_Gest_Com", gesco);
			qNouvEnt.setParam("Acc_Compta", compta);
			qNouvEnt.setParam("Acc_CRM", contact);
			
			var p = qNouvEnt.execute();
			var message = p.responseXML.documentElement.getAttribute("message");
			
			if (message=="true") {
				var entrepriseId = p.responseXML.documentElement.getAttribute("Entreprise_Id");
				initModifEntreprise(entrepriseId);
			}
			else {
				showWarning("L'entreprise "+ identifiant +" existe déjà !");
			}

		}

	} catch (e) {
    recup_erreur(e);
  }
}



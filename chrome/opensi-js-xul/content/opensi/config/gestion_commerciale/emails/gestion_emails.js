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


jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'liste_emails');
var emailId = "";


function init() {
	try {

		aEmails.initTree(nouvelEmail);

	} catch (e) {
    recup_erreur(e);
  }
}


function nouvelEmail() {
	try {
		aEmails.select(-1);

		document.getElementById('bNouvelEmail').collapsed = true;
		document.getElementById('bSupprimerEmail').collapsed = true;
		document.getElementById('Libelle').value="";
		document.getElementById('Expediteur').value="";
		document.getElementById('Dest_CC').value="";
		document.getElementById('Dest_BCC').value="";
		document.getElementById('Sujet').value="";
		emailId="";

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerEmail() {
	try {

		if (aEmails.isSelected()) {
			var currentIndex = aEmails.getCurrentIndex();
			document.getElementById('bNouvelEmail').collapsed = false;
			document.getElementById('bSupprimerEmail').collapsed = false;
			document.getElementById('Libelle').value = aEmails.getCellText(currentIndex,'ColLibelle');
			document.getElementById('Expediteur').value = aEmails.getCellText(currentIndex,'ColExpediteur');
			document.getElementById('Dest_CC').value = aEmails.getCellText(currentIndex,'ColDestCC');
			document.getElementById('Dest_BCC').value = aEmails.getCellText(currentIndex,'ColDestBCC');
			document.getElementById('Sujet').value = aEmails.getCellText(currentIndex,'ColSujet');
			emailId = aEmails.getCellText(currentIndex,'ColEmailId');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerEmail() {
	try {

		var libelle = document.getElementById('Libelle').value;
		var expediteur = document.getElementById('Expediteur').value;
		var destCC = document.getElementById('Dest_CC').value;
		var destBCC = document.getElementById('Dest_BCC').value;
		var sujet = document.getElementById('Sujet').value;

		if (isEmpty(expediteur) || !isEmail(expediteur)) { showWarning("L'email de l'expéditeur est incorrect !"); }
		else if (!isEmpty(destCC) && !isEmail(destCC)) { showWarning("L'email du destinataire CC est incorrect !"); }
		else if (!isEmpty(destBCC) && !isEmail(destBCC)) { showWarning("L'email du destinataire BCC est incorrect !"); }
		else if (isEmpty(sujet)) { showWarning("Veuillez remplir le champ 'Sujet' !"); }
		else {
			var qEnregistrer;
			if (emailId=="") {
				qEnregistrer = new QueryHttp("Config/gestion_commerciale/emails/creerEmail.tmpl");
			} else {
				qEnregistrer = new QueryHttp("Config/gestion_commerciale/emails/modifierEmail.tmpl");
				qEnregistrer.setParam("Email_Id", emailId);
			}
			qEnregistrer.setParam('Libelle', libelle);
			qEnregistrer.setParam('Expediteur', expediteur);
			qEnregistrer.setParam('Dest_CC', destCC);
			qEnregistrer.setParam('Dest_BCC', destBCC);
			qEnregistrer.setParam('Sujet', sujet);
			qEnregistrer.execute();

			aEmails.initTree(nouvelEmail);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerEmail() {
	try {

		if (window.confirm("Confirmez-vous la suppression de l'email sélectionné ?")) {

			var querySup = new QueryHttp("Config/gestion_commerciale/emails/supprimerEmail.tmpl");
			querySup.setParam("Email_Id", emailId);
			var result = querySup.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				aEmails.initTree(nouvelEmail);
			} else {
				showWarning("Impossible de supprimer l'email car il est utilisé !");
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

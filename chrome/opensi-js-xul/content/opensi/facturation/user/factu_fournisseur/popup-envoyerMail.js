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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var docId;
var typeDoc;

function init() {
	try {

		docId = ParamValeur("Doc_Id");
		typeDoc = ParamValeur("Type_Doc");
		
		var libellePopup = "";
		var libelleSujet = "";
		if (typeDoc=="Facture_Fournisseur") {
			libellePopup = "ENVOI D'UNE FACTURE FOURNISSEUR PAR E-MAIL";
			libelleSujet = "Facture N° ";
		} else if (typeDoc=="Avoir_Fournisseur") {
			libellePopup = "ENVOI D'UN AVOIR FOURNISSEUR PAR E-MAIL";
			libelleSujet = "Avoir N° ";
		} else if (typeDoc=="Commande_Fournisseur") {
			libellePopup = "ENVOI D'UNE COMMANDE FOURNISSEUR PAR E-MAIL";
			libelleSujet = "Commande N° ";
		} else if (typeDoc=="Acompte_Fournisseur") {
			libellePopup = "ENVOI D'UN ACOMPTE FOURNISSEUR PAR E-MAIL";
			libelleSujet = "Acompte N° ";
		}
		document.getElementById('lblPopup').value = libellePopup;

		// remplissage du champ expéditeur par l'e-mail de l'utilisateur connecté, ou du dossier
		var qGetExp = new QueryHttp("Facturation/Commun/getEmailUtilisateur.tmpl");
		var result = qGetExp.execute();
		document.getElementById('Expediteur').value = result.responseXML.documentElement.getAttribute("Email");

		var qGetEmailDest = new QueryHttp("Facturation/Commun/getInfosEmailDest.tmpl");
		qGetEmailDest.setParam("Type_Doc", typeDoc);
		qGetEmailDest.setParam("Doc_Id", docId);
		var result = qGetEmailDest.execute();
		document.getElementById('Destinataire').value = result.responseXML.documentElement.getAttribute("Email");
		document.getElementById('Sujet').value = libelleSujet + result.responseXML.documentElement.getAttribute("Numero");

	} catch (e) {
  	recup_erreur(e);
  }
}


function envoyer() {
	try {

		var expediteur = document.getElementById('Expediteur').value;
		var destinataire = document.getElementById('Destinataire').value;
		var sujet = document.getElementById('Sujet').value;
		var message = document.getElementById('Message').value;

		if (!isEmail(expediteur)) { showWarning("L'adresse e-mail de l'expéditeur est invalide !"); }
		else if (!isEmail(destinataire)) { showWarning("L'adresse e-mail du destinataire est invalide !"); }
		else {
			var qEnvoiMail;
			if (typeDoc=="Facture_Fournisseur") {
				qEnvoiMail = new QueryHttp("Facturation/Factu_Fournisseur/facture_pdf.tmpl");
				qEnvoiMail.setParam("Facture_Id", docId);
			} else if (typeDoc=="Avoir_Fournisseur") {
				qEnvoiMail = new QueryHttp("Facturation/Factu_Fournisseur/avoir_pdf.tmpl");
				qEnvoiMail.setParam("Avoir_Id", docId);
			} else if (typeDoc=="Commande_Fournisseur") {
				qEnvoiMail = new QueryHttp("Facturation/Commandes/commande_pdf.tmpl");
				qEnvoiMail.setParam("Commande_Id", docId);
				qEnvoiMail.setParam("Chiffre", ParamValeur("Chiffre"));
			} else if (typeDoc=="Acompte_Fournisseur") {
				qEnvoiMail = new QueryHttp("Facturation/Commandes/pdfAcompte.tmpl");
				qEnvoiMail.setParam("Acompte_Id", docId);
			}
			qEnvoiMail.setParam("EnvoiMail", "y");
			qEnvoiMail.setParam("Expediteur", expediteur);
			qEnvoiMail.setParam("Destinataire", destinataire);
			qEnvoiMail.setParam("Sujet", sujet);
			qEnvoiMail.setParam("Corps_Message", message);
			qEnvoiMail.execute();

			var message = "";
			if (typeDoc=="Facture_Fournisseur") {
				message = "La facture fournisseur a été envoyée par e-mail !"
			} else if (typeDoc=="Avoir_Fournisseur") {
				message = "L'avoir fournisseur a été envoyé par e-mail !"
			} else if (typeDoc=="Commande_Fournisseur") {
				message = "La commande fournisseur a été envoyée par e-mail !"
			} else if (typeDoc=="Acompte_Fournisseur") {
				message = "L'acompte fournisseur a été envoyé par e-mail !"
			}
			showMessage(message);
			window.close();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}
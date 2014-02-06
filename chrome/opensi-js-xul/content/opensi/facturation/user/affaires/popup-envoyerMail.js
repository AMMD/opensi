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

var typeDoc;
var docId;

function init() {
	try {
		typeDoc = ParamValeur("Type_Doc");
		docId = ParamValeur("Doc_Id");
		
		var libellePopup = "";
		var libelleSujet = "";
		if (typeDoc=="Facture") {
			libellePopup = "ENVOI D'UNE FACTURE PAR E-MAIL";
			libelleSujet = "Facture N° ";
		} else if (typeDoc=="Avoir") {
			libellePopup = "ENVOI D'UN AVOIR PAR E-MAIL";
			libelleSujet = "Avoir N° ";
		} else if (typeDoc=="Commande_Client") {
			libellePopup = "ENVOI D'UNE COMMANDE CLIENT PAR E-MAIL";
			libelleSujet = "Commande N° ";
		} else if (typeDoc=="Ordre_Fabrication") {
			libellePopup = "ENVOI D'UN ORDRE DE FABRICATION PAR E-MAIL";
			libelleSujet = "Commande N° ";
		} else if (typeDoc=="Acompte_Client") {
			libellePopup = "ENVOI D'UN ACOMPTE CLIENT PAR E-MAIL";
			libelleSujet = "Facture d'acompte N° ";
		} else if (typeDoc=="Proforma") {
			libellePopup = "ENVOI D'UNE PROFORMA PAR E-MAIL";
			libelleSujet = "Proforma N° ";
		}
		document.getElementById('lblPopup').value = libellePopup;

		// remplissage du champ expéditeur par l'e-mail de l'utilisateur connecté, ou du dossier
		var qGetExp = new QueryHttp("Facturation/Commun/getEmailUtilisateur.tmpl");
		var result = qGetExp.execute();
		document.getElementById('expediteur').value = result.responseXML.documentElement.getAttribute("Email");
		
		var qGetEmailDest = new QueryHttp("Facturation/Commun/getInfosEmailDest.tmpl");
		qGetEmailDest.setParam("Type_Doc", typeDoc);
		qGetEmailDest.setParam("Doc_Id", docId);
		var result = qGetEmailDest.execute();
		document.getElementById('destinataire').value = result.responseXML.documentElement.getAttribute("Email");
		document.getElementById('sujet').value = libelleSujet + result.responseXML.documentElement.getAttribute("Numero");

	} catch (e) {
  	recup_erreur(e);
  }
}


function envoyer() {
	try {
		var expediteur = document.getElementById('expediteur').value;
		var destinataire = document.getElementById('destinataire').value;
		var sujet = document.getElementById('sujet').value;
		var message = document.getElementById('message').value;

		if (!isEmail(expediteur)) { showWarning("L'adresse e-mail de l'expéditeur est invalide !"); }
		else if (!isEmail(destinataire)) { showWarning("L'adresse e-mail du destinataire est invalide !"); }
		else {
			var qEnvoiMail;
			if (typeDoc=="Facture") {
				qEnvoiMail = new QueryHttp("Facturation/Affaires/pdfFacture.tmpl");
				qEnvoiMail.setParam("Facture_Id", docId);
			} else if (typeDoc=="Avoir") {
				qEnvoiMail = new QueryHttp("Facturation/Avoirs/avoir_pdf.tmpl");
				qEnvoiMail.setParam("Avoir_Id", docId);
			} else if (typeDoc=="Commande_Client") {
				qEnvoiMail = new QueryHttp("Facturation/Affaires/pdfCommande.tmpl");
				qEnvoiMail.setParam("Commande_Id", docId);
				if (ParamValeur("Initiale")=="1") { qEnvoiMail.setParam("Initiale", "1"); }
			} else if (typeDoc=="Ordre_Fabrication") {
				qEnvoiMail = new QueryHttp("Facturation/Affaires/pdfCommande.tmpl");
				qEnvoiMail.setParam("OF", "1");
				qEnvoiMail.setParam("Commande_Id", docId);
				if (ParamValeur("Initiale")=="1") { qEnvoiMail.setParam("Initiale", "1"); }
			} else if (typeDoc=="Acompte_Client") {
				qEnvoiMail = new QueryHttp("Facturation/Affaires/pdfAcompte.tmpl");
				qEnvoiMail.setParam("Acompte_Id", docId);
			} else if (typeDoc=="Proforma") {
				qEnvoiMail = new QueryHttp("Facturation/Proforma/pdfProforma.tmpl");
				qEnvoiMail.setParam("Proforma_Id", docId);
			}
			
			qEnvoiMail.setParam("Langue", ParamValeur("Langue"));
			qEnvoiMail.setParam("EnvoiMail", "y");
			qEnvoiMail.setParam("Expediteur", expediteur);
			qEnvoiMail.setParam("Destinataire", destinataire);
			qEnvoiMail.setParam("Sujet", sujet);
			qEnvoiMail.setParam("Corps_Message", message);
			qEnvoiMail.execute();
			
			var message = "";
			if (typeDoc=="Facture") {
				message = "La facture a été envoyée par e-mail !"
			} else if (typeDoc=="Avoir") {
				message = "L'avoir a été envoyé par e-mail !"
			} else if (typeDoc=="Commande_Client") {
				message = "La commande client a été envoyée par e-mail !"
			} else if (typeDoc=="Ordre_Fabrication") {
				message = "L'ordre de fabrication a été envoyé par e-mail !"
			} else if (typeDoc=="Acompte_Client") {
				message = "L'acompte client a été envoyé par e-mail !"
			} else if (typeDoc=="Proforma") {
				message = "La proforma a été envoyée par e-mail !"
			}
			showMessage(message);
			window.close();
		}
	} catch (e) {
  	recup_erreur(e);
  }
}


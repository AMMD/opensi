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

var avoirId;
var stock;

function init() {
	try {
		avoirId = ParamValeur("Avoir_Id");
		stock = ParamValeur("Stock");

		// remplissage du champ exp�diteur par l'e-mail de l'utilisateur connect�, ou du dossier
		var qGetExp = new QueryHttp("Facturation/Commun/getEmailUtilisateur.tmpl");
		var result = qGetExp.execute();
		document.getElementById('Expediteur').value = result.responseXML.documentElement.getAttribute("Email");

		var qGetEmailDest = new QueryHttp("Facturation/Commun/getInfosEmailDest.tmpl");
		qGetEmailDest.setParam("Type_Doc", "Avoir");
		qGetEmailDest.setParam("Doc_Id", avoirId);
		var result = qGetEmailDest.execute();
		document.getElementById('Destinataire').value = result.responseXML.documentElement.getAttribute("Email");
		document.getElementById('Sujet').value = "Avoir N� " + result.responseXML.documentElement.getAttribute("Numero");
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

		if (!isEmail(expediteur)) { showWarning("L'adresse e-mail de l'exp�diteur est invalide !"); }
		else if (!isEmail(destinataire)) { showWarning("L'adresse e-mail du destinataire est invalide !"); }
		else {
			var qEnvoiMail = new QueryHttp("Facturation/Avoirs/avoir_pdf.tmpl");
			qEnvoiMail.setParam("Avoir_Id", avoirId);
			qEnvoiMail.setParam("Langue", ParamValeur("Langue"));
			qEnvoiMail.setParam("Stock", stock);
			qEnvoiMail.setParam("EnvoiMail", "y");
			qEnvoiMail.setParam("Expediteur", expediteur);
			qEnvoiMail.setParam("Destinataire", destinataire);
			qEnvoiMail.setParam("Sujet", sujet);
			qEnvoiMail.setParam("Corps_Message", message);
			qEnvoiMail.execute();
			
			showMessage("L'avoir a �t� envoy� par e-mail !");
			window.close();
		}
	} catch (e) {
  	recup_erreur(e);
  }
}


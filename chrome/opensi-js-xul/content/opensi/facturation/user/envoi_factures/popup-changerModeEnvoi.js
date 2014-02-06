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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var docId;
var typeDoc;
var modeEnvoiInitial;

function init() {
	try {

		window.resizeTo(300,160);
		docId = window.arguments[1];
		typeDoc = window.arguments[2];
		
		var qGetModeEnvoi = new QueryHttp("Facturation/Envoi_Factures/getModeEnvoi.tmpl");
		qGetModeEnvoi.setParam("Doc_Id", docId);
		qGetModeEnvoi.setParam("Type_Doc", typeDoc);
		var result = qGetModeEnvoi.execute();
		modeEnvoiInitial = result.responseXML.documentElement.getAttribute("Mode_Envoi");
		document.getElementById('modeEnvoi').value = modeEnvoiInitial;

	} catch (e) {
		recup_erreur(e);
	}
}



function valider() {
	try {
		var modeEnvoi = document.getElementById('modeEnvoi').value;
		if (modeEnvoi != modeEnvoiInitial) {
			var qEnregistrer = new QueryHttp("Facturation/Envoi_Factures/modifierModeEnvoi.tmpl");
			qEnregistrer.setParam("Doc_Id", docId);
			qEnregistrer.setParam("Type_Doc", typeDoc);
			qEnregistrer.setParam("Mode_Envoi", modeEnvoi);
			qEnregistrer.execute();
			window.arguments[0]();
		}
		window.close();
	} catch (e) {
		recup_erreur(e);
	}
}

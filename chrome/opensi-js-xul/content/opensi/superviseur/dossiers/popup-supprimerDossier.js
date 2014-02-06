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

var dossierId;
var nomDossier;

function init() {
	try {
		dossierId = ParamValeur("Dossier_Id");
		var qGetDossier = new QueryHttp("Superviseur/dossiers/getDossier.tmpl");
		qGetDossier.setParam("Dossier_Id", dossierId);
		var result = qGetDossier.execute();
		nomDossier = result.responseXML.documentElement.getAttribute("Nom");
		
		document.getElementById('lblPopup').value = "SUPPRESSION DU DOSSIER "+ dossierId;
		document.getElementById('lblConfirm').value = "Vous allez supprimer le dossier "+ dossierId +" - "+ nomDossier + ".";


	} catch (e) {
  	recup_erreur(e);
  }
}


function supprimer() {
	try {
		
		var confirm = document.getElementById('txtConfirm').value;
		if (confirm!="oui") { showWarning("Veuillez saisir le texte 'oui' !"); }
		else if (window.confirm("Etes-vous sûr de vouloir supprimer ce dossier ?")) {
		
			document.getElementById('bAnnuler').disabled = true;
			document.getElementById('bSupprimer').disabled = true;
			
			var qSupDossier = new QueryHttp("Superviseur/dossiers/supprimerDossier.tmpl");
			qSupDossier.setParam('Dossier_Id', dossierId);
			var result = qSupDossier.execute();
			
			var message = result.responseXML.documentElement.getAttribute("message");
	
			if (message=="impossible") {
				showWarning("Le dossier est introuvable !");
			}
			else if (message=="supp") {
				showMessage("Le dossier "+dossierId+" a été supprimé!");
			}
			else {
				showWarning("Erreur du serveur !");
			}
			
			window.arguments[0]();
			window.close();
		}
		
	} catch (e) {
  	recup_erreur(e);
  }
}


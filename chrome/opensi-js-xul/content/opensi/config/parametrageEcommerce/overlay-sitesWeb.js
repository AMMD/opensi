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


var osw_currentSiteId = "";
var osw_aSitesWeb = new Arbre('Config/parametrageEcommerce/listeSitesWeb.tmpl', 'osw-listeSites');


function osw_initSitesWeb() {
	try {
		
		document.getElementById('osw-bVoirPhoto').collapsed = true;
		document.getElementById('osw-bChangerPhoto').collapsed = true;
		document.getElementById('osw-bSupprimer').collapsed = true;
		
		var aBanqueRemiseCB = new Arbre('ComboListe/combo-banques.tmpl', 'osw-banqueRemiseCB');
		aBanqueRemiseCB.initTree(osw_initBanqueRemiseCB);


	} catch (e) {
    recup_erreur(e);
  }
}


function osw_initBanqueRemiseCB() {
	try {
		
		document.getElementById('osw-banqueRemiseCB').selectedIndex=0;

		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'osw-emailVCC');
		aEmails.initTree(osw_initEmailVCC);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_initEmailVCC() {
	try {
		
		document.getElementById('osw-emailVCC').selectedIndex=0;
		
		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'osw-emailACC');
		aEmails.initTree(osw_initEmailACC);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_initEmailACC() {
	try {
		
		document.getElementById('osw-emailACC').selectedIndex=0;
		
		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'osw-emailECC');
		aEmails.initTree(osw_initEmailECC);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_initEmailECC() {
	try {
		
		document.getElementById('osw-emailECC').selectedIndex=0;
		
		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'osw-emailPCC');
		aEmails.initTree(osw_initEmailPCC);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_initEmailPCC() {
	try {
		
		document.getElementById('osw-emailPCC').selectedIndex=0;
		
		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'osw-emailVFC');
		aEmails.initTree(osw_initEmailVFC);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_initEmailVFC() {
	try {
		
		document.getElementById('osw-emailVFC').selectedIndex=0;
		
		var aEmails = new Arbre('Config/gestion_commerciale/emails/liste-emails.tmpl', 'osw-emailVAC');
		aEmails.initTree(osw_initEmailVAC);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_initEmailVAC() {
	try {
		
		document.getElementById('osw-emailVAC').selectedIndex=0;
		
		osw_aSitesWeb.initTree(osw_initListeSitesWeb);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_desactiverTout(b) {
	try {
		document.getElementById('osw-listeSites').disabled = b;
		document.getElementById('osw-codeSite').disabled = b;
		document.getElementById('osw-nomSite').disabled = b;
		document.getElementById('osw-adresseSite').disabled = b;
		document.getElementById('osw-chkActif').disabled = b;
		document.getElementById('osw-banqueRemiseCB').disabled = b;
		document.getElementById('osw-emailVCC').disabled = b;
		document.getElementById('osw-emailACC').disabled = b;
		document.getElementById('osw-emailECC').disabled = b;
		document.getElementById('osw-emailPCC').disabled = b;
		document.getElementById('osw-emailVFC').disabled = b;
		document.getElementById('osw-emailVAC').disabled = b;
		document.getElementById('osw-chkLogoAdr').disabled = b;
		document.getElementById('osw-bVoirPhoto').disabled = b;
		document.getElementById('osw-bChangerPhoto').disabled = b;
		document.getElementById('osw-bNouveau').disabled = b;
		document.getElementById('osw-bEnregistrer').disabled = b;
		document.getElementById('osw-bSupprimer').disabled = b;
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_loadPhoto() {
  try {
  	
		document.getElementById('osw-vignette').setAttribute("src", "");
		document.getElementById('osw-vignette').setAttribute("src", getDirServeur() +"datas/"+ get_cookie('Dossier_Id') +"/logos/SW_"+ osw_currentSiteId +"_small.jpg");

	} catch (e) {
    recup_erreur(e);
  }
}



function osw_voirPhoto() {
  try {

		var url = "chrome://opensi/content/config/parametrageEcommerce/voirPhoto.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',osw_currentSiteId);

	} catch (e) {
    recup_erreur(e);
  }
}


function osw_changerPhoto() {
  try {

		var url = "chrome://opensi/content/config/parametrageEcommerce/changePhoto.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',osw_currentSiteId);

		osw_loadPhoto();

	} catch (e) {
    recup_erreur(e);
  }
}


function osw_rafraichirListeSitesWeb() {
	try {
		document.getElementById('osw-bVoirPhoto').collapsed = true;
		document.getElementById('osw-bChangerPhoto').collapsed = true;
		document.getElementById('osw-bSupprimer').collapsed = true;
		osw_desactiverTout(true);
		osw_aSitesWeb.initTree(osw_initListeSitesWeb);
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_initListeSitesWeb() {
	try {
		
		osw_desactiverTout(false);
		osw_nouveauSiteWeb();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_nouveauSiteWeb() {
	try {
		
		if (osw_aSitesWeb.isSelected()) { osw_aSitesWeb.select(-1); }
		
		document.getElementById('osw-bVoirPhoto').collapsed = true;
		document.getElementById('osw-bChangerPhoto').collapsed = true;
		document.getElementById('osw-bSupprimer').collapsed = true;
		
		osw_currentSiteId = "";
		
		document.getElementById('osw-codeSite').value = "";
		document.getElementById('osw-nomSite').value = "";
		document.getElementById('osw-adresseSite').value = "";
		document.getElementById('osw-chkActif').checked = true;
		document.getElementById('osw-banqueRemiseCB').value = "";
		document.getElementById('osw-emailVCC').value = "";
		document.getElementById('osw-emailACC').value = "";
		document.getElementById('osw-emailECC').value = "";
		document.getElementById('osw-emailPCC').value = "";
		document.getElementById('osw-emailVFC').value = "";
		document.getElementById('osw-emailVAC').value = "";
		document.getElementById('osw-chkLogoAdr').checked = false;
		
		osw_loadPhoto();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_ouvrirSite() {
	try {
		
		if (osw_aSitesWeb.isSelected()) {
			var i = osw_aSitesWeb.getCurrentIndex();
			
			osw_currentSiteId = osw_aSitesWeb.getCellText(i, 'osw-colSiteId');
			
			document.getElementById('osw-codeSite').value = osw_aSitesWeb.getCellText(i, 'osw-colCodeSite');
			document.getElementById('osw-nomSite').value = osw_aSitesWeb.getCellText(i, 'osw-colNomSite');
			document.getElementById('osw-adresseSite').value = osw_aSitesWeb.getCellText(i, 'osw-colAdresse');
			document.getElementById('osw-chkActif').checked = (osw_aSitesWeb.getCellText(i, 'osw-colActif')=="1");
			document.getElementById('osw-banqueRemiseCB').value = osw_aSitesWeb.getCellText(i, 'osw-colBanqueRemiseCB');
			document.getElementById('osw-emailVCC').value = osw_aSitesWeb.getCellText(i, 'osw-colEmailVCC');
			document.getElementById('osw-emailACC').value = osw_aSitesWeb.getCellText(i, 'osw-colEmailACC');
			document.getElementById('osw-emailECC').value = osw_aSitesWeb.getCellText(i, 'osw-colEmailECC');
			document.getElementById('osw-emailPCC').value = osw_aSitesWeb.getCellText(i, 'osw-colEmailPCC');
			document.getElementById('osw-emailVFC').value = osw_aSitesWeb.getCellText(i, 'osw-colEmailVFC');
			document.getElementById('osw-emailVAC').value = osw_aSitesWeb.getCellText(i, 'osw-colEmailVAC');
			document.getElementById('osw-chkLogoAdr').checked = (osw_aSitesWeb.getCellText(i, 'osw-colLogoAdr')=="1");
			
			osw_loadPhoto();
			document.getElementById('osw-bVoirPhoto').collapsed = false;
			document.getElementById('osw-bChangerPhoto').collapsed = false;
			document.getElementById('osw-bSupprimer').collapsed = false;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function osw_supprimerSiteWeb() {
	try {
		
		if (!isEmpty(osw_currentSiteId) && window.confirm("Voulez-vous supprimer le site web sélectionné ?")) {
			var qSupprimer = new QueryHttp("Config/parametrageEcommerce/supprimerSiteWeb.tmpl");
			qSupprimer.setParam("Site_Id", osw_currentSiteId);
			var result = qSupprimer.execute();
			var errors = new Errors(result);
			if (errors.hasNext()) {		
				errors.show();
			} else {
				osw_rafraichirListeSitesWeb();
			}
		}
			
	} catch (e) {
		recup_erreur(e);
	}
}



function osw_enregistrerSiteWeb() {
	try {
		
		var codeSite = document.getElementById('osw-codeSite').value;
		var nomSite = document.getElementById('osw-nomSite').value;
		var adresseSite = document.getElementById('osw-adresseSite').value;
		var actif = document.getElementById('osw-chkActif').checked;
		var banqueRemiseCB = document.getElementById('osw-banqueRemiseCB').value;
		var emailVCC = document.getElementById('osw-emailVCC').value;
		var emailACC = document.getElementById('osw-emailACC').value;
		var emailECC = document.getElementById('osw-emailECC').value;
		var emailPCC = document.getElementById('osw-emailPCC').value;
		var emailVFC = document.getElementById('osw-emailVFC').value;
		var emailVAC = document.getElementById('osw-emailVAC').value;
		var logoAdr = document.getElementById('osw-chkLogoAdr').checked;
		
		if (isEmpty(codeSite)) { showWarning("Veuillez saisir le code du site.") }
		else if (!isCleAlpha(codeSite)) { showWarning("Le code du site ne doit pas contenir d'accents ni de caractères spéciaux.") }
		else if (isEmpty(nomSite)) { showWarning("Veuillez saisir le nom du site.") }
		else {
			
			var qEnregistrer;

			if (!isEmpty(osw_currentSiteId)) {
				qEnregistrer = new QueryHttp("Config/parametrageEcommerce/modifierSiteWeb.tmpl");
				qEnregistrer.setParam("Site_Id", osw_currentSiteId);
			} else {
				qEnregistrer = new QueryHttp("Config/parametrageEcommerce/creerSiteWeb.tmpl");
			}
			
			qEnregistrer.setParam("Code", codeSite);
			qEnregistrer.setParam("Nom_Site", nomSite);
			qEnregistrer.setParam("URL_Site", adresseSite);
			qEnregistrer.setParam("Actif", actif);
			qEnregistrer.setParam("Logo_Adr", logoAdr);
			if (!isEmpty(banqueRemiseCB)) { qEnregistrer.setParam("Banque_Remise_CB", banqueRemiseCB); }
			if (!isEmpty(emailVCC)) { qEnregistrer.setParam("Email_VCC", emailVCC); }
			if (!isEmpty(emailACC)) { qEnregistrer.setParam("Email_ACC", emailACC); }
			if (!isEmpty(emailECC)) { qEnregistrer.setParam("Email_ECC", emailECC); }
			if (!isEmpty(emailPCC)) { qEnregistrer.setParam("Email_PCC", emailPCC); }
			if (!isEmpty(emailVFC)) { qEnregistrer.setParam("Email_VFC", emailVFC); }
			if (!isEmpty(emailVAC)) { qEnregistrer.setParam("Email_VAC", emailVAC); }
			
			var result = qEnregistrer.execute();
			var errors = new Errors(result);
			if (errors.hasNext()) {		
				errors.show();
			} else {
				osw_rafraichirListeSitesWeb();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}



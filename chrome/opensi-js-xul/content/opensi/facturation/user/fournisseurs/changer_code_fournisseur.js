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


function init() {
  try {

		document.getElementById('AncienCode').value = window.arguments[0];
    document.getElementById('NouveauCode').focus();

  } catch (e) {
    recup_erreur(e);
  }
}


function changerCodeFournisseur() {
	try {

		var nouveau_code = document.getElementById('NouveauCode').value;
		var ancien_code = document.getElementById('AncienCode').value;

		if (isEmpty(nouveau_code)) {
			showWarning("Veuillez sp�cifier un code fournisseur !");
		}
		else if (!isCleAlpha(nouveau_code)) {
			showWarning("Code fournisseur invalide !");
		}
		else if (existeFournisseur(nouveau_code)) {
			showWarning("Le code fournisseur '"+ nouveau_code +"' est d�j� utilis� !");
		}
		else {
			var corps = cookie() +"&Page=Facturation/Fournisseurs/changerCodeFournisseur.tmpl&ContentType=xml&AncienCode="+ urlEncode(ancien_code) +"&NouveauCode="+ urlEncode(nouveau_code);
			var p = requeteHTTP(corps);
			window.arguments[1](nouveau_code);
			window.close();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function existeFournisseur(fournisseurId) {
  try {

		var corps = cookie() +"&Page=Facturation/Fournisseurs/existeFournisseur.tmpl&ContentType=xml&Fournisseur_Id="+ urlEncode(fournisseurId);
		var p = requeteHTTP(corps);

  	return (p.responseXML.documentElement.getAttribute('existe')=="true");

  } catch (e) {
    recup_erreur(e);
  }
}

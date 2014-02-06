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


function init() {
	try {

		document.getElementById('titre').value = 'CHANGER LE MOT DE PASSE DE L\'UTILISATEUR "'+ parent.document.getElementById('login').value +'"';
		document.getElementById('OldPassword').focus();

	} catch (e) {
    recup_erreur(e);
  }
}


function changeUserPassword() {
	try {

		var old_password = document.getElementById('OldPassword').value;
  	var password = document.getElementById('Password').value;
		var password2 = document.getElementById('Password2').value;

		if (isEmpty(old_password) || isEmpty(password) || isEmpty(password2)) {
			showWarning('Vous devez remplir tous les champs !');
		}
		else if (password2 != password) {
			showWarning('Les mots de passe saisis sont différents !\nVeuillez reconfirmer le mot de passe');
			document.getElementById('Password2').value = '';
		}
		else if (window.confirm('Confirmez-vous le changement de votre mot de passe ?')) {

			var qChgPass = new QueryHttp("Compta/UpdateDatabase/ChangeUserPassword.tmpl");
			qChgPass.setParam("OldPassword", old_password);
			qChgPass.setParam("Password", password);
			var result = qChgPass.execute();

			showWarning(result.responseXML.documentElement.getAttribute('Message'));
  		retour_menu_principal();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

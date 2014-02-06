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

    window.resizeTo(400,200);

		document.getElementById('Password').focus();

  } catch (e) {
    recup_erreur(e);
  }
}


function changer() {
  try {

  	var password = document.getElementById('Password').value;
		var password2 = document.getElementById('Password2').value;

		if (isEmpty(password) || isEmpty(password2)) {
			showWarning("Vous devez remplir tous les champs !");
		}
		else if (password2 != password) {
			showWarning("Les mots de passe saisis sont différents ! Veuillez reconfirmer le mot de passe");
			document.getElementById('Password2').value = '';
		}
		else {

			var qChgPass = new QueryHttp("Utilisateurs/changerUtilisateurPassword.tmpl");
			qChgPass.setParam('Password', password);
			qChgPass.setParam('Utilisateur_Id', ParamValeur('Utilisateur_Id'));
			var result = qChgPass.execute();

			var message = result.responseXML.documentElement.getAttribute("message");

			if (message=="inexistant") {
				showWarning("Erreur dans la modification du mot de passe !");
			}
			else if (message=="fini") {
				showMessage("Le mot de passe a été changé avec succès !");
			}
			else {
				showWarning("Erreur inconnue");
			}

			window.close();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


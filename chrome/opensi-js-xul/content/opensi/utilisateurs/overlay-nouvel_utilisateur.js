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


function initNouvelUtilisateur() {
	try {
		
		document.getElementById('nu-Login').value = "";
  	document.getElementById('nu-Password').value = "";
		document.getElementById('nu-Password2').value = "";
		document.getElementById('nu-Civilite').value = "1";
		document.getElementById('nu-Nom').value = "";
		document.getElementById('nu-Prenom').value = "";
		document.getElementById('nu-Telephone').value = "";
		document.getElementById('nu-Email').value = "";
		document.getElementById('nu-Fonction').value = "";
		document.getElementById('nu-membreDirection').checked = false;

		document.getElementById('nu-Login').focus();		
		document.getElementById("bMenuUtilisateurs").collapsed = false;
  	document.getElementById("deck").selectedIndex=1;

	} catch (e) {
    recup_erreur(e);
  }
}


function creerUtilisateur() {
	try {

		var login = document.getElementById('nu-Login').value;
  	var password = document.getElementById('nu-Password').value;
		var password2 = document.getElementById('nu-Password2').value;
		var civilite = document.getElementById('nu-Civilite').value;
		var nom = document.getElementById('nu-Nom').value;
		var prenom = document.getElementById('nu-Prenom').value;
		var telephone = document.getElementById('nu-Telephone').value;
		var email = document.getElementById('nu-Email').value;
		var fonction = document.getElementById('nu-Fonction').value;
		var membreDirection = (document.getElementById('nu-membreDirection').checked?1:0);

		if (isEmpty(login)) { showWarning("Veuillez saisir un login !"); }
		else if (login.toLowerCase()=="root") { showWarning("Login non autorisé !"); }
		else if (!isCleAlpha(login)) { showWarning('Login incorrect ! (A-Z,a-z,0-9,_)'); }
		else if (isEmpty(password)) { showWarning("Veuillez saisir un mot de passe !"); }
		else if (isEmpty(password2)) { showWarning("Veuillez confirmer un mot de passe !"); }
		else if (password2 != password) {
			showWarning('Les mots de passe saisis sont différents ! Veuillez reconfirmer le mot de passe !');
			document.getElementById('nu-Password2').value = '';
		}
		else if (isEmpty(nom)) { showWarning("Veuillez saisir un nom !"); }
		else if (!isEmpty(telephone) && !isPhone(telephone)) { showWarning("Le téléphone est incorrect !"); }
		else if (!isEmpty(email) && !isEmail(email)) { showWarning("L'adresse e-mail est incorrecte !"); }
		else {

  		var qNouvUtil = new QueryHttp("Utilisateurs/nouvelUtilisateur.tmpl");
			qNouvUtil.setParam("Login", login);
			qNouvUtil.setParam("Password", password);
			qNouvUtil.setParam("Civilite", civilite);
			qNouvUtil.setParam("Nom", nom);
			qNouvUtil.setParam("Prenom", prenom);
			qNouvUtil.setParam("Telephone", telephone);
			qNouvUtil.setParam("Email", email);
			qNouvUtil.setParam("Fonction", fonction);
			qNouvUtil.setParam("Direction", membreDirection);
			
			var p = qNouvUtil.execute();
			var message = p.responseXML.documentElement.getAttribute("message");
			
			if (message=="true") {
				var utilisateurId = p.responseXML.documentElement.getAttribute("Utilisateur_Id");
				initModifUtilisateur2(utilisateurId);
			}
			else {
				showWarning("L'utilisateur "+ login +" existe déjà !");
			}

		}

	} catch (e) {
    recup_erreur(e);
  }
}



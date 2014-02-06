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


function initNouveauProfil() {
	try {
		document.getElementById("bMenuProfils").collapsed = false;
		document.getElementById('nom').value = "";
  	document.getElementById('commentaire').value = "";
  	
  	document.getElementById("deck").selectedIndex=1;
  
	} catch (e) {
    recup_erreur(e);
  }
}


function creerProfil() {
	try {

		var nom = document.getElementById('nom').value;
  	var commentaire = document.getElementById('commentaire').value;
  
		
		if (isEmpty(nom)) 
		{ showWarning("Veuillez saisir un nom de profil !"); 
		}
	 else{
  		var qNouvProfil = new QueryHttp("Utilisateurs/changeProfil.tmpl");
  		qNouvProfil.setParam("req", "nouveau");
			qNouvProfil.setParam("nom", nom);
			qNouvProfil.setParam("commentaire", commentaire);
	
			var p = qNouvProfil.execute();
			var message = p.responseXML.documentElement.getAttribute("msg");
			var profilid = p.responseXML.documentElement.getAttribute("profil_id");
			if (message=="1") {
				showWarning("Le profil a été créé !");			
				initModifProfiljournaux(profilid);
			}
			else if (message=="0"){
				showWarning("Erreur : le profil existe déjà !");
			}

		}

	} catch (e) {
    recup_erreur(e);
  }
}



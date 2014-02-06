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


var aProfil = new Arbre('Utilisateurs/GetRDF/listeProfilEntreprise.tmpl' , 'liste_profil');

function initListeProfil() {
	try {
		
		document.getElementById("bMenuProfils").collapsed = true;
		

		aProfil.initTree();
	
		document.getElementById("deck").selectedIndex=0;

	} catch (e) {
    recup_erreur(e);
  }
}



function keypress(e) {
  try {

    if (e.keyCode==13) {
    	modifProfil();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function modifProfil() {
	try {
		if (aProfil.isSelected()) {

  		var profilId = aProfil.getSelectedCellText('profil_id');
  		
  		initModifProfil(profilId);

		}

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauProfil() {

	initNouveauProfil();
  
}

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


var aEntreprises = new Arbre('Superviseur/GetRDF/listeEntreprises.tmpl' , 'liste_entreprises');

function initListeEntreprises() {
	try {
		
		document.getElementById('ome-chkAffTous').checked = false;
		document.getElementById("bMenuEntreprises").collapsed = true;

		ome_rechercherEntreprises();
		document.getElementById("deck").selectedIndex=0;

	} catch (e) {
    recup_erreur(e);
  }
}


function ome_rechercherEntreprises() {
	try {
		document.getElementById('liste_entreprises').disabled = true;
		document.getElementById('ome-chkAffTous').disabled = true;
		document.getElementById('ome-denomination').disabled = true;
		document.getElementById('ome-chkAffTous').disabled = true;
		document.getElementById('ome-bNouveau').disabled = true;
		
		var identifiant = document.getElementById('ome-identifiant').value;
		var denomination = document.getElementById('ome-denomination').value;
		var afficherTous = document.getElementById('ome-chkAffTous').checked?"1":"0";
		
		aEntreprises.setParam("Identifiant", identifiant);
		aEntreprises.setParam("Denomination", denomination);
		aEntreprises.setParam("Afficher_Tous", afficherTous);
		aEntreprises.initTree(focus_tree);
	} catch (e) {
		recup_erreur(e);
	}
}


function focus_tree() {
  try {

  	document.getElementById('liste_entreprises').disabled = false;
		document.getElementById('ome-chkAffTous').disabled = false;
		document.getElementById('ome-denomination').disabled = false;
		document.getElementById('ome-chkAffTous').disabled = false;
		document.getElementById('ome-bNouveau').disabled = false;
		
    document.getElementById('liste_entreprises').focus();

		if (aEntreprises.nbLignes()>0) {
			aEntreprises.select(0);
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function ome_pressOnFiltre(e) {
  try {

    if (e.keyCode==13) {
    	ome_rechercherEntreprises();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function keypress(e) {
  try {

    if (e.keyCode==13) {
    	modifEntreprise();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function modifEntreprise() {
	try {
		if (aEntreprises.isSelected()) {

  		var entrepriseId = aEntreprises.getSelectedCellText('ColEntreprise_Id');
  		initModifEntreprise(entrepriseId);

		}

	} catch (e) {
    recup_erreur(e);
  }
}


function nouvelleEntreprise() {
	try {
		initNouvelleEntreprise();
	} catch (e) {
		recup_erreur(e);
	}
}

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


var ond4_aUtilisateurs = new Arbre('Superviseur/GetRDF/listeUtilisateursEnt.tmpl', 'ond4-listeUtilisateurs');


function ond4_init(listeEntreprises) {
	try {

		document.getElementById("ond4-titre").value = "Affectation d'utilisateurs au dossier "+ dossierEnCours;
		ond4_aUtilisateurs.setParam("Liste_Entreprises", listeEntreprises);
		ond4_aUtilisateurs.initTree(ond4_reinitialiser);

	} catch (e) {
    recup_erreur(e);
  }
}


function ond4_reinitialiser() {
	try {

		var liste = document.getElementById("ond4-listeUtilisateurs");
		var nombreElements = liste.getRowCount();
		
		for (var i=0; i<nombreElements; i++) {
			liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).setAttribute("checked","false");
		}
		
		liste.clearSelection();
	} catch (e) {
		recup_erreur(e);
	}
}


function ond4_enregistrer() {
	try {
	
		var liste = document.getElementById("ond4-listeUtilisateurs");
		var listeUtilisateurs = "";
		var nombreElements = liste.getRowCount();

		for (var i=0; i<nombreElements; i++) {
			if(liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
				listeUtilisateurs += liste.getItemAtIndex(i).value +",";
			}
		}
		
		if (!isEmpty(listeUtilisateurs)) {
			var qEnregistrer = new QueryHttp("Superviseur/dossiers/enregistrerEtape4.tmpl");
			qEnregistrer.setParam("Dossier_Id", dossierEnCours);
			qEnregistrer.setParam('Liste_Utilisateurs', listeUtilisateurs);
			qEnregistrer.execute();
		}

		retour_menuDossiers();

	} catch (e) {
    recup_erreur(e);
  }
}

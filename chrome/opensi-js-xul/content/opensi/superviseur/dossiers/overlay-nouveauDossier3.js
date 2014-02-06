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


var ond3_aEntreprises = new Arbre('Superviseur/GetRDF/listeEntreprises.tmpl', 'ond3-listeEntreprises');


function ond3_init() {
	try {
		
		ond3_aEntreprises.initTree(ond3_reinitialiser);
		
	} catch (e) {
    recup_erreur(e);
  }
}


function ond3_reinitialiser() {
	try {
		document.getElementById("ond3-titre").value = "Affectation d'entreprises au dossier "+ dossierEnCours;
		
		var liste = document.getElementById("ond3-listeEntreprises");
		var listeEntreprises = "";
		var nombreElements = liste.getRowCount();
		
		for (var i=0; i<nombreElements; i++) {
			liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).setAttribute("checked","false");
		}
		
		liste.clearSelection();
	} catch (e) {
		recup_erreur(e);
	}
}


function ond3_etapeSuivante() {
	try {
		
		var liste = document.getElementById("ond3-listeEntreprises");
		var listeEntreprises = "";
		var nombreElements = liste.getRowCount();
		
		for (var i=0; i<nombreElements; i++) {
			if (liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
				listeEntreprises += liste.getItemAtIndex(i).value +",";
			}
		}
		
		if (isEmpty(listeEntreprises)) { showWarning("Veuillez sélectionner au moins une entreprise !"); }
		else {
			
			var qEnregistrer = new QueryHttp("Superviseur/dossiers/enregistrerEtape3.tmpl");
			qEnregistrer.setParam("Dossier_Id", dossierEnCours);
			qEnregistrer.setParam("Liste_Entreprises", listeEntreprises);
			qEnregistrer.execute();
			
			ond4_init(listeEntreprises);
			document.getElementById('deck').selectedIndex=4;

		}

	} catch (e) {
    recup_erreur(e);
  }
}


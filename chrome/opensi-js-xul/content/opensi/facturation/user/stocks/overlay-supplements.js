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


var aPW = new Arbre("Facturation/GetRDF/liste_publication_web.tmpl", "web");


function initSupplements() {
	try {

		aPW.setParam("Article_Id", document.getElementById('Article').value);
		aPW.initTree();

	} catch (e) {
		recup_erreur(e);
  }
}


function os_testCheck(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		if (cks.item(0).getAttribute("checked")=="false") { cks.item(0).setAttribute("checked","true"); }
		else { cks.item(0).setAttribute("checked","false"); }
		setModifie();
	} catch (e) {
		recup_erreur(e);
	}
}


function os_getListePublications() {
	try {
		
		var liste = document.getElementById("web");
		var listePublications = "";
		var nombreElements = liste.getRowCount();
		for (var i=0; i<nombreElements; i++) {
			if (liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
				listePublications += liste.getItemAtIndex(i).value +",";
			}
		}
		
		return listePublications;
	} catch (e) {
		recup_erreur(e);
	}
}

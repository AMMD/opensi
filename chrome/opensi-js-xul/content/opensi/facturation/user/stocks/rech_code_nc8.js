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


jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");


function init() {
  try {

    var aCodesNC8 = new Arbre("Facturation/GetRDF/liste_codes_nc8.tmpl", "liste_codes_nc8");
		aCodesNC8.initTree();

  } catch (e) {
    recup_erreur(e);
  }
}


function choixCodeNC8() {
	try {
		var tree = document.getElementById('liste_codes_nc8');

		if (tree.view!=null && tree.currentIndex!=-1) {
			var type = getCellText(tree,tree.currentIndex, 'ColType');
			if (type == "4") {
				var code_nc8 = getCellText(tree,tree.currentIndex, 'ColCode_NC8');
				window.arguments[0](code_nc8);
	    	window.close();
			} else {
				showWarning("Veuillez choisir un code NC8 !");
			}
		} else {
			showWarning("Veuillez choisir un code NC8 !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}

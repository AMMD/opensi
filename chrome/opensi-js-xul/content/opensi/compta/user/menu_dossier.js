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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


function init() {
  try {

		var aExos = new Arbre('Compta/GetRDF/Dossier.tmpl', 'tree-exercices');
		aExos.initTree(focus_tree);
    
		parent.document.getElementById("boxExercice").collapsed = true;
		parent.document.getElementById("date_exercice").value = "";

  } catch (e) {
    recup_erreur(e);
  }
}


function focus_tree() {
  try {

		var tree = document.getElementById('tree-exercices');

		if (tree.view!=null) {
    	tree.focus();
    	tree.view.selection.select(0);
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function nouvel_exercice() {
  try {

		var qExosOuverts = new QueryHttp("Compta/GetNonBloque.tmpl");
	  var result = qExosOuverts.execute();

		var nbExosOuverts = result.responseXML.documentElement.getAttribute('NbExosOuverts');

		if (nbExosOuverts<2) {
  	  window.location = "chrome://opensi/content/compta/user/creer_exercice.xul?"+ cookie();
	  }
		else {
		  showWarning("Impossible d'ouvrir un nouvel exercice ! Vous devez clôturer l'exercice précédent");
    }

	} catch (e) {
    recup_erreur(e);
  }
}


function ok() {
  try {

    var tree = document.getElementById('tree-exercices');

		if (tree.view!=null && tree.currentIndex!=-1) {
    	var debut_exercice = getCellText(tree,tree.currentIndex,'debut_exercice');
    	var fin_exercice = getCellText(tree,tree.currentIndex,'fin_exercice');
    	var num_exercice = getCellText(tree,tree.currentIndex,'num_exercice');
    	var dates = getCellText(tree,tree.currentIndex,'dates');
			var exerciceId = getCellText(tree,tree.currentIndex,'exercice_id');
			
			var qEnterExercice = new QueryHttp("EnterExercice.tmpl");
			qEnterExercice.setParam('Exercice_Id', exerciceId);
			qEnterExercice.setParam('Debut_Exercice', debut_exercice);
			qEnterExercice.setParam('Fin_Exercice', fin_exercice);
			qEnterExercice.setParam('Num_Exercice', num_exercice);
			qEnterExercice.execute();
			
			parent.document.getElementById("date_exercice").value = "Exercice "+ dates;
			parent.document.getElementById("boxExercice").collapsed = false;
    	window.location = "chrome://opensi/content/compta/user/control_coherence.xul?"+ cookie();
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function keypress(e) {
  try {

    switch(e.keyCode){
      case 13:	ok();	break;
      case 78:	nouvel_exercice(); break;
    }

	} catch (e) {
    recup_erreur(e);
  }
}


function retourChoixDossier() {
  try {

    window.location = "chrome://opensi/content/compta/user/menu.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

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


function historique_init() {
	try {

		document.getElementById('bGenererFacture').collapsed=true;
		treeHistorique.initTree(menu_enableGenererFacture);

	}	catch(e) {
		recup_erreur(e);
  }
}


function historique_initTree() {
	try {

		document.getElementById('bGenererFacture').collapsed=true;
		if (modification){
			menu_disableGenererFacture();
			treeHistorique.initTree(menu_enableGenererFacture);
			modification = false;
		}

	}	catch(e) {
		recup_erreur(e);
  }
}

function choixFacture() {
	try {

		var tree = document.getElementById('historique_tree');
		if (tree.view!=null && tree.currentIndex!=-1) {
			var facture_id = getCellText(tree,tree.currentIndex,'Facture_Id');
			window.location = "chrome://opensi/content/facturation/user/factu_directe/edition_facture.xul?" + cookie() +"&Mode=V&Facture_Id="+ facture_id;
    }

	} catch (e) {
		recup_erreur(e);
	}
}


//fonction qui récupère la liste des factures id pour créer un PDF
function historique_genererFacture(){
	try {

		arbre = document.getElementById('historique_tree');
		if (arbre.view.rowCount>0){
			modification = true;
			listeFacture="";
			listeEcheance="";
			listeAbonnement="";
			document.getElementById('info_histo').value="Mise à jour des dernières factures émises ";
			document.getElementById('bMenuPrincipal').disabled=true;
			document.getElementById('bMenuModeles').disabled=true;
			document.getElementById('bMenuAbonnements').disabled=true;
			document.getElementById('bGenererFacture').disabled=true;
			document.getElementById('progressBox_histo').collapsed=false;
			var bar = document.getElementById("barre_progression_histo");
   			bar.setAttribute("hidden","false");
    		bar.mode="undetermined";

			for(i=0;i<arbre.view.rowCount;i++)
				listeFacture+=getCellText(arbre,i,'Facture_Id')+',';

			histo_majFinieCreerPdf();
		}
		else
			showWarning("Il n'y a pas de facture à générer dans l'onglet historique !!!");

	}	catch(e) {
		recup_erreur(e);
  }
}


function histo_majFinieCreerPdf() {
	try {

		emettre_creationFactureTerminee(null,listeFacture);

	}	catch(e) {
		recup_erreur(e);
  }
}






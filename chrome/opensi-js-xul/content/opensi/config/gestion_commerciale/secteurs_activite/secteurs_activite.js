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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var aSecteurs = new Arbre('Config/GetRDF/listeSecteursActivite.tmpl', 'liste_secteurs');
var secteur_id = -1;


function init() {
	try {

		aSecteurs.initTree(nouveauSecteur);

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauSecteur() {
	try {

		document.getElementById('liste_secteurs').view.selection.clearSelection();

		document.getElementById('bSupprimer').disabled = true;
		document.getElementById('bAjouter').collapsed = false;
		document.getElementById('bModifier').collapsed = true;
		document.getElementById('bNouveau').disabled = true;
		document.getElementById('Secteur').value="";
		document.getElementById('Code_Secteur').value="";
		secteur_id=-1;

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerSecteur() {
	try {

		var tree = document.getElementById('liste_secteurs');

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById('bSupprimer').disabled = false;
			document.getElementById('bNouveau').disabled = false;
			document.getElementById('bAjouter').collapsed = true;
			document.getElementById('bModifier').collapsed = false;			
			document.getElementById('Secteur').value=getCellText(tree,tree.currentIndex,'ColSecteur');
			document.getElementById('Code_Secteur').value=getCellText(tree,tree.currentIndex,'ColCodeSecteur');
			secteur_id = getCellText(tree,tree.currentIndex,'ColId');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerSecteur() {
	try {

		var tree = document.getElementById('liste_secteurs');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var secteur = getCellText(tree,tree.currentIndex,'ColSecteur');

			if (window.confirm("Confirmez-vous la suppression du secteur d'activit� '"+ secteur +"' ?")) {

				var querySup = new QueryHttp("Config/gestion_commerciale/secteurs_activite/supprimerSecteur.tmpl");
				querySup.setParam('Secteur_Id', secteur_id);
				var result = querySup.execute();
				if (result.responseXML.documentElement.getAttribute("ok")=="false") {
					showWarning("Impossible de supprimer ce secteur d'activit� car il est utilis� !");
				} else {
					aSecteurs.initTree();
					nouveauSecteur();
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerSecteur() {
	try {

		var secteur = document.getElementById('Secteur').value;
		var codeSecteur = document.getElementById('Code_Secteur').value;

		if (isEmpty(secteur)) {
			showWarning("Veuillez remplir le champ 'Secteur' !");
		}
		else if (isEmpty(codeSecteur)) {
			showWarning("Veuillez remplir le champ 'Code Secteur' !");
		}
		else {
			var querySave = new QueryHttp("Config/gestion_commerciale/secteurs_activite/creerSecteur.tmpl");
			querySave.setParam('Secteur', secteur);
			querySave.setParam('Code_Secteur', codeSecteur);
			var rep = querySave.execute();

			if (rep.responseXML.documentElement.getAttribute('existe')=="true") {
				showWarning("Le secteur d'activit� '"+ secteur +"' ou le code secteur '"+ codeSecteur +"' existe d�j� !");
			}
			else {
				aSecteurs.initTree();
				nouveauSecteur();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function modifierSecteur() {
	try {

		var secteur = document.getElementById('Secteur').value;
		var codeSecteur = document.getElementById('Code_Secteur').value;

		if (isEmpty(secteur)) {
			showWarning("Veuillez remplir le champ 'Secteur' !");
		}
		else if (isEmpty(codeSecteur)) {
			showWarning("Veuillez remplir le champ 'Code Secteur' !");
		}
		else {
			var queryMod = new QueryHttp("Config/gestion_commerciale/secteurs_activite/modifierSecteur.tmpl");
			queryMod.setParam('Secteur', secteur);
			queryMod.setParam('Code_Secteur', codeSecteur);
			queryMod.setParam('Secteur_Id', secteur_id);
			var rep = queryMod.execute();

			if (rep.responseXML.documentElement.getAttribute('existe')=="true") {
				showWarning("Le secteur d'activit� '"+ secteur +"' ou le code secteur '"+ codeSecteur +"' existe d�j� !");
			}
			else {
				aSecteurs.initTree();
				nouveauSecteur();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

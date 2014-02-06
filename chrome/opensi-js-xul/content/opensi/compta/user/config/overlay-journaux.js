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


var oj_aJournal = new Arbre('Compta/GetRDF/liste-journaux.tmpl', 'oj-listeJournaux');


function oj_init() {
	try {

		oj_nouveauJournal();
    oj_aJournal.initTree();
		
		document.getElementById('oj-Code_Journal').focus();
		
		var aDossier = new Arbre('Compta/GetRDF/liste_dossier.tmpl', 'oj-dossier');
		aDossier.initTree(oj_selDossier);			
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oj_selDossier() {
	try {

		document.getElementById('oj-dossier').selectedIndex = 0;
			
	} catch (e) {
		recup_erreur(e);
	}
}


function oj_importerJournaux() {
	try {

		var dossier = document.getElementById("oj-dossier").value;
			
		if (!isEmpty(dossier) && window.confirm("Confirmez-vous la copie des journaux (qui ne sont pas présents) du dossier "+ dossier+ " dans le dossier "+ get_cookie('Dossier_Id'))) {
		
			var queryEdit = new QueryHttp("Compta/Config/journaux/copieJournauxDossier.tmpl");
			queryEdit.setParam("Dossier_Id", dossier);				
			var result = queryEdit.execute();

			var errors = new Errors(result);
			if (errors.hasNext()) {		
				errors.show();
			}
			else {
				showMessage("La liste des journaux a été mise à jour !");
				oj_nouveauJournal();
				oj_aJournal.initTree();
			}			
		}	
			
	} catch (e) {
		recup_erreur(e);
	}
}


function oj_rechercherCompte(id) {
	try {

		var url ="chrome://opensi/content/config/util/rechcompte.xul?"+ cookie();
		url += "&Force_Deb=5";
		url += "&Type_Compte=G";
		url += "&Num_Compte=5";
		url += "&Creer=false";
		url += "&nom="+urlEncode("DE TRESORERIE");
		window.openDialog(url,'','chrome,modal,centerscreen',oj_retourRechercherCompte);

	} catch (e) {
		recup_erreur(e);
	}
}

function oj_retourRechercherCompte(numeroCompte) {
	try {
		
		document.getElementById('oj-Contrepartie').value = numeroCompte;

	} catch (e) {
		recup_erreur(e);
	}
}


function oj_enableContrepartie() {
	try {

		document.getElementById("oj-rowContrepartie").collapsed = !(document.getElementById("oj-Type_Journal").value=="TR");
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oj_enregistrerJournal() {
	try {
	
		var codeJournal = document.getElementById('oj-Code_Journal').value;
		var intitule = document.getElementById('oj-Intitule').value;
		var typeJournal = document.getElementById('oj-Type_Journal').value;
		var contrepartie = document.getElementById('oj-Contrepartie').value;
		
		if (isEmpty(intitule)) {
			showWarning('Intitulé manquant');
		}
		else if (typeJournal=='TR' && (isEmpty(contrepartie) || !isCompteCorrect(contrepartie))) {
			showWarning('Numéro de compte de contrepartie incorrect');
		}
		else {
			
			var qSaveJournal = new QueryHttp("Compta/Config/journaux/saveJournal.tmpl");
			qSaveJournal.setParam('Code_Journal', codeJournal);
			qSaveJournal.setParam('Contrepartie', contrepartie);
			qSaveJournal.setParam('Intitule', intitule);
			qSaveJournal.setParam('Type_Journal', typeJournal);
			var result = qSaveJournal.execute();
			
			var errors = new Errors(result);

			if (errors.hasNext()) {		
				errors.show();
			}
			else {			
				oj_nouveauJournal();
				oj_aJournal.initTree();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function oj_nouveauJournal() {
	try {
	
		document.getElementById('oj-bSupprimer').disabled = true;
		document.getElementById('oj-bNouveau').disabled = true;
		
		document.getElementById('oj-Code_Journal').disabled = false;
		document.getElementById('oj-Code_Journal').value = "";
		document.getElementById('oj-Type_Journal').value = "TR";
		document.getElementById('oj-Intitule').value = "";
		document.getElementById('oj-Contrepartie').value = "";
		document.getElementById('oj-rowContrepartie').collapsed = false;
		document.getElementById('oj-Type_Journal').disabled = false;
		
		if (oj_aJournal.isSelected()) {
			oj_aJournal.select(-1);
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function oj_supprimerJournal() {
	try {

		var codeJournal = document.getElementById('oj-Code_Journal').value;
		var typeJournal = document.getElementById('oj-Type_Journal').value;

		if (typeJournal=="AN") {
			showWarning("Impossible de supprimer le journal "+ codeJournal);
		}
		else if (window.confirm('Confirmez-vous la suppression du journal "'+ codeJournal +'" ?')) {
			
			var qSupJournal = new QueryHttp("Compta/Config/journaux/supprimerJournal.tmpl");
			qSupJournal.setParam('Code_Journal', codeJournal);
			var result = qSupJournal.execute();

			var errors = new Errors(result);

			if (errors.hasNext()) {		
				errors.show();
			}
			else {
				oj_nouveauJournal();
				oj_aJournal.initTree();
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function oj_chargerJournal() {
	try {
	
		var tree = document.getElementById('oj-listeJournaux');
		
		if (tree.view!=null && tree.currentIndex!=-1) {
		
			document.getElementById('oj-Code_Journal').disabled = true;

			document.getElementById('oj-Code_Journal').value = getCellText(tree,tree.currentIndex, 'oj-ColCode_Journal');
			document.getElementById('oj-Intitule').value = getCellText(tree,tree.currentIndex, 'oj-ColIntitule');
			document.getElementById('oj-Type_Journal').value = getCellText(tree,tree.currentIndex, 'oj-ColType_Journal');			
			document.getElementById('oj-Contrepartie').value = getCellText(tree,tree.currentIndex, 'oj-ColContrepartie');
			
			oj_enableContrepartie();
			
			document.getElementById('oj-Type_Journal').disabled = (document.getElementById('oj-Type_Journal').value=="AN");
			
			document.getElementById('oj-bSupprimer').disabled = false;
			document.getElementById('oj-bNouveau').disabled = false;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}

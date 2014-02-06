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



var oc_aTranches = new Arbre("Compta/Config/collectifs/liste-tranchesCollectifs.tmpl", "oc-listeTranchesCollectifs");
var oc_currentTrancheId;


function oc_init() {
	try {
		oc_aTranches.initTree(oc_nouvelleTranche);
	} catch (e) {
		recup_erreur(e);
	}
}



function oc_selectTranche() {
	try {

		if (oc_aTranches.isSelected()) {
			var currentIndex = oc_aTranches.getCurrentIndex();

			document.getElementById('oc-compteDebut').value = oc_aTranches.getCellText(currentIndex, 'oc-colCompteDebut');
			document.getElementById('oc-compteFin').value = oc_aTranches.getCellText(currentIndex, 'oc-colCompteFin');
			oc_currentTrancheId = oc_aTranches.getCellText(currentIndex, 'oc-colTrancheId');

			document.getElementById('oc-bSupprimer').disabled = false;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function oc_nouvelleTranche() {
	try {
		
		if (oc_aTranches.isSelected()) {
			oc_aTranches.select(-1);
		}
		oc_currentTrancheId = "";

		document.getElementById('oc-compteDebut').value = "";
		document.getElementById('oc-compteFin').value = "";

		document.getElementById('oc-bSupprimer').disabled = true;

	} catch (e) {
		recup_erreur(e);
	}
}



function oc_supprimerTranche() {
	try {

		if (oc_currentTrancheId!="") {
			var currentIndex = oc_aTranches.getCurrentIndex();
			var compteDebut = oc_aTranches.getCellText(currentIndex, 'oc-colCompteDebut');
			var compteFin = oc_aTranches.getCellText(currentIndex, 'oc-colCompteFin');

			if (window.confirm("Confirmez-vous la suppression de la tranche du compte '"+ compteDebut +"' à '"+ compteFin +"' ?")) {

				var qSupprimerTranche = new QueryHttp("Compta/Config/collectifs/supprimerTrancheCollectifs.tmpl");
				qSupprimerTranche.setParam("Tranche_Id", oc_currentTrancheId);
				var result = qSupprimerTranche.execute();
				
				var errors = new Errors(result);

				if (errors.hasNext()) {		
					errors.show();
				}
				else {
					oc_aTranches.initTree(oc_nouvelleTranche);
				}
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}




function oc_enregistrerTranche() {
	try {
		
		var compteDebut = document.getElementById('oc-compteDebut').value;
		var compteFin = document.getElementById('oc-compteFin').value;
		
		if (!isCompteCorrect(compteDebut)) { showWarning("Compte de début incorrect !"); }
		else if (!isCompteCorrect(compteFin)) { showWarning("Compte de fin incorrect !"); }
		else if (compteDebut>compteFin) { showWarning("Le compte de début doit être inférieur au compte de fin !"); }
		else {
			
			var qEnregistrerTranche = new QueryHttp("Compta/Config/collectifs/enregistrerTrancheCollectifs.tmpl");
			qEnregistrerTranche.setParam("Tranche_Id", oc_currentTrancheId!=""?oc_currentTrancheId:"0");
			qEnregistrerTranche.setParam("Compte_Debut", compteDebut);
			qEnregistrerTranche.setParam("Compte_Fin", compteFin);

			var result = qEnregistrerTranche.execute();
			var errors = new Errors(result);

			if (errors.hasNext()) {		
				errors.show();
			}
			else {
				oc_aTranches.initTree(oc_nouvelleTranche);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


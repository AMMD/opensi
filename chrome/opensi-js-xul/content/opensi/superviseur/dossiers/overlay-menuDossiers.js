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


var omd_aDossiers = new Arbre('Superviseur/GetRDF/listeDossiers.tmpl', 'omd-listeDossiers');
var omd_currentDossierId = "";
var omd_precDateDebut = "";

function omd_init() {
	try {

		document.getElementById('omd-filtreDossierId').disabled = true;
		document.getElementById('omd-bRechercher').disabled = true;
		document.getElementById('omd-listeDossiers').disabled = true;
		document.getElementById('omd-bNouveau').disabled = true;
		document.getElementById('omd-bEnregistrer').disabled = true;
  	omd_aDossiers.initTree(omd_initListeDossiers);

	} catch (e) {
    recup_erreur(e);
  }
}


function omd_initListeDossiers() {
	try {
		document.getElementById('omd-filtreDossierId').disabled = false;
		document.getElementById('omd-bRechercher').disabled = false;
		document.getElementById('omd-listeDossiers').disabled = false;
		document.getElementById('omd-bNouveau').disabled = false;
		document.getElementById('omd-bEnregistrer').disabled = false;
		omd_nouveauDossier();
	} catch (e) {
		recup_erreur(e);
	}
}


function omd_rechercherDossier() {
	try {
		var dossierId = document.getElementById('omd-filtreDossierId').value;
		document.getElementById('omd-filtreDossierId').disabled = true;
		document.getElementById('omd-bRechercher').disabled = true;
		document.getElementById('omd-listeDossiers').disabled = true;
		
		omd_aDossiers.setParam('Dossier_Id', dossierId);
		omd_aDossiers.initTree(omd_initListeDossiers);

	} catch (e) {
    recup_erreur(e);
  }
}


function omd_pressOnDossierId(e) {
	try {

    if (e.keyCode==13) {
      omd_rechercherDossier();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function omd_calculerDateFinExercice() {
  try {

		var dateDebut = document.getElementById('omd-debutExercice').value;

		if (!isEmpty(dateDebut) && isDate(dateDebut) && omd_precDateDebut!=dateDebut && dateDebut.length==10) {

			var annee = parseIntBis(dateDebut.substring(6,10));
			var jour = parseIntBis(dateDebut.substring(0,2));
			var mois = parseIntBis(dateDebut.substring(3,5));
			var separ1 = dateDebut.substring(2,3);
			var separ2 = dateDebut.substring(5,6);
			omd_precDateDebut = dateDebut;

			if (jour!=1) {
				jour = jour-1;
			}
			else {
				mois = mois-1;
				switch(mois) {
		  		case 1:case 3:case 5:case 7: case 8:case 10:case 0:
			  		jour = 31;
				  	break;
	  			case 4:case 6:case 9:case 11:
		  			jour = 30;
			  		break;
	  			case 2:
		  			jour = isBissextile(annee)?29:28;
			  		break;
				}
	  	}
			if (mois!=0) {
	     	annee = annee+1;
			}
			else {
	    	mois = 12;
	   	}

			if (jour>=1 && jour<=9) jour = "0"+ jour;
			if (mois>=1 && mois<=9) mois = "0"+ mois;

			document.getElementById('omd-finExercice').value = jour+separ1+mois+separ2+annee;
			document.getElementById('omd-finExercice').select();
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function omd_selectOnListeDossiers() {
	try {
		if (omd_aDossiers.isSelected()) {
			var i = omd_aDossiers.getCurrentIndex();
			omd_currentDossierId = omd_aDossiers.getCellText(i, 'omd-colDossierId');
			
			document.getElementById('omd-dossierId').value = omd_currentDossierId;
			document.getElementById('omd-nomDossier').value = omd_aDossiers.getCellText(i, 'omd-colNom');
			document.getElementById('omd-chkActif').checked = (omd_aDossiers.getCellText(i, 'omd-colActif')=="1");
			document.getElementById('omd-debutExercice').value = "";
			document.getElementById('omd-finExercice').value = "";
			
			document.getElementById('omd-dossierId').disabled = true;
			document.getElementById('omd-rowDateDebutPremierExercice').collapsed=true;
			document.getElementById('omd-rowDateFinPremierExercice').collapsed=true;
			document.getElementById('omd-bSupprimer').disabled = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function omd_enregistrerDossier() {
	try {
		
		var modification = (omd_currentDossierId!="");
		
		var dossierId = document.getElementById('omd-dossierId').value;
		var nomDossier = document.getElementById('omd-nomDossier').value;
		var actif = document.getElementById('omd-chkActif').checked;
		var debutExercice = document.getElementById('omd-debutExercice').value;
		var finExercice = document.getElementById('omd-finExercice').value;
		
		if (isEmpty(dossierId)) { showWarning("Veuillez saisir l'identifiant du dossier !"); }
		else if (!isNomDossier(dossierId)) { showWarning("Nom de dossier incorrect (A-Z,a-z,_,0-9) !"); }
		else if (!modification && omd_existeDossierId(dossierId)) { showWarning("L'identifiant du dossier est déjà utilisé !"); }
		else if (isEmpty(nomDossier)) { showWarning("Veuillez saisir le nom du dossier !"); }
		else if (!modification && (isEmpty(debutExercice) || !isDate(debutExercice))) { showWarning("La date de début d'exercice est incorrecte !"); }
		else if (!modification && (isEmpty(finExercice) || !isDate(finExercice))) { showWarning("La date de fin d'exercice est incorrecte !"); }
		else if (!modification && !isDateInterval(debutExercice, finExercice)) { showWarning("La date de fin doit être supérieure à la date de début !"); }
		else if (omd_verifierDates(debutExercice, finExercice)) {
			var qEnregistrer;
			
			document.getElementById('omd-filtreDossierId').disabled = true;
			document.getElementById('omd-bRechercher').disabled = true;
			document.getElementById('omd-listeDossiers').disabled = true;
			document.getElementById('omd-bNouveau').disabled = true;
			document.getElementById('omd-bEnregistrer').disabled = true;
			
			if (!modification) {				
				qEnregistrer = new QueryHttp("Superviseur/dossiers/creerDossier.tmpl");
				qEnregistrer.setParam("Debut_Exercice", debutExercice);
				qEnregistrer.setParam("Fin_Exercice", finExercice);
			} else {
				qEnregistrer = new QueryHttp("Superviseur/dossiers/modifierDossier.tmpl");
			}
			qEnregistrer.setParam("Dossier_Id", dossierId);
			qEnregistrer.setParam("Nom", nomDossier);
			qEnregistrer.setParam("Actif", actif);
			qEnregistrer.execute();
			
			if (!modification) {
				dossierEnCours = dossierId;
				ond1_reinitialiser();
				document.getElementById('deck').selectedIndex=1;
				document.getElementById('bGestionDossiers').collapsed=false;
			}
			
			omd_init();
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function omd_verifierDates(dateDeb, dateFin) {
	try {
		var ok=false;
		
		var maintenant = new Date();
		var debAnnee = parseIntBis(dateDeb.substring(6,10));
		var debMois = parseIntBis(dateDeb.substring(3,5));
		var debJour = parseIntBis(dateDeb.substring(0,2));
		var finAnnee = parseIntBis(dateFin.substring(6,10));
		var finMois = parseIntBis(dateFin.substring(3,5));
		var finJour = parseIntBis(dateFin.substring(0,2));
		if (debAnnee<1970) {
			showWarning("Les dates inférieures à 1970 ne sont pas acceptées !");
		}
		else if (debAnnee<maintenant.getFullYear() || debAnnee>maintenant.getFullYear()+1) {
			ok = window.confirm("L'année du début de l'exercice est probablement incorrecte : "+debAnnee+"\nEtes vous sûr de vouloir continuer ?");
		}
		else if (finAnnee-debAnnee>1 || (finAnnee-debAnnee==1 && finMois>debMois) || (finAnnee-debAnnee==1 && finMois==debMois && finJour>=debJour)) {
			ok = window.confirm("La durée de l'exercice est supérieure à une année\nEtes vous sûr de vouloir continuer ?");
		}
		else if ((finAnnee-debAnnee==0 && (finMois-debMois!=11 || finJour-debJour!=30)) || ((finAnnee-debAnnee==1 && finMois<debMois))) {
			ok = window.confirm("La durée de l'exercice est inférieure à une année\nEtes vous sûr de vouloir continuer ?");
		}
		else {
			ok = true;
		}
		
		return ok;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function omd_existeDossierId(dossierId) {
	try {
		var qExisteDossier = new QueryHttp("Superviseur/dossiers/existeDossier.tmpl");
		qExisteDossier.setParam("Dossier_Id", dossierId);
		var result = qExisteDossier.execute();
		return (result.responseXML.documentElement.getAttribute("message")=="existe");
	} catch (e) {
		recup_erreur(e);
	}
}


function omd_pressOnSupprimer() {
	try {
		if (omd_currentDossierId!="") {
			var url="chrome://opensi/content/superviseur/dossiers/popup-supprimerDossier.xul?"+ cookie() +"&Dossier_Id="+ omd_currentDossierId;
			window.openDialog(url,'','chrome,modal,centerscreen',omd_init);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function omd_nouveauDossier() {
	try {
		if (omd_aDossiers.isSelected()) {
			omd_aDossiers.select(-1);
		}
		omd_currentDossierId = "";
		omd_precDateDebut = "";
		
		document.getElementById('omd-dossierId').value = "";
		document.getElementById('omd-nomDossier').value = "";
		document.getElementById('omd-chkActif').checked = true;
		document.getElementById('omd-debutExercice').value = "";
		document.getElementById('omd-finExercice').value = "";
		
		document.getElementById('omd-dossierId').disabled = false;
		document.getElementById('omd-rowDateDebutPremierExercice').collapsed=false;
		document.getElementById('omd-rowDateFinPremierExercice').collapsed=false;
		document.getElementById('omd-bSupprimer').disabled = true;
		
	} catch (e) {
		recup_erreur(e);
	}
}


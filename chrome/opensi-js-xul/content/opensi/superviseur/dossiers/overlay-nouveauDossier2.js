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


var ond2_aPlan = new Arbre('Superviseur/GetRDF/listePlan.tmpl', 'ond2-plan');


function ond2_init() {
	try {
		
		ond2_aPlan.initTree(ond2_initPlan);

	} catch (e) {
    recup_erreur(e);
  }
}


function ond2_initPlan() {
	try {

		document.getElementById('ond2-plan').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function ond2_reinitialiser() {
	try {
		document.getElementById('ond2-plan').selectedIndex = 0;
		document.getElementById('ond2-BQ').checked = true;
		document.getElementById('ond2-CS').checked = true;
		document.getElementById('ond2-OD').checked = true;
	} catch (e) {
		recup_erreur(e);
	}
}


function ond2_etapeSuivante() {
	try {
		
		var plan = document.getElementById('ond2-plan').value;
		var bq = document.getElementById('ond2-BQ').checked?1:0;
		var cs = document.getElementById('ond2-CS').checked?1:0;
		var od = document.getElementById('ond2-OD').checked?1:0;
		
		var qEnregistrer = new QueryHttp("Superviseur/dossiers/enregistrerEtape2.tmpl");
		qEnregistrer.setParam("Dossier_Id", dossierEnCours);
		qEnregistrer.setParam("Code_Plan", plan);
		qEnregistrer.setParam("BQ", bq);
		qEnregistrer.setParam("CS", cs);
		qEnregistrer.setParam("OD", od);
		qEnregistrer.execute();

		ond3_reinitialiser();
		document.getElementById('deck').selectedIndex=3;

	} catch (e) {
    recup_erreur(e);
  }
}

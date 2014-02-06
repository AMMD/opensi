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

jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


function init() {
	try {

		var qChargerPrefs = new QueryHttp("Config/comptabilite/preferences/getPreferences.tmpl");
		var result = qChargerPrefs.execute();

		document.getElementById("Mode_Rappro").value = result.responseXML.documentElement.getAttribute('Mode_Rappro');
		document.getElementById("Intitule_Ecr_Tiers").checked = (result.responseXML.documentElement.getAttribute('Intitule_Ecr_Tiers')=="1");
		document.getElementById("Transfert_Enc").checked = (result.responseXML.documentElement.getAttribute('Transfert_Enc')=="1");
		document.getElementById("Trans_Auto_Enc").checked = (result.responseXML.documentElement.getAttribute('Trans_Auto_Enc')=="1");
		document.getElementById("Trans_Auto_Rem").checked = (result.responseXML.documentElement.getAttribute('Trans_Auto_Rem')=="1");
		document.getElementById("Trans_Auto_Regul").checked = (result.responseXML.documentElement.getAttribute('Trans_Auto_Regul')=="1");
		document.getElementById("Trans_Auto_Regul_AC").checked = (result.responseXML.documentElement.getAttribute('Trans_Auto_Regul_AC')=="1");
		document.getElementById("Trans_Auto_Remb").checked = (result.responseXML.documentElement.getAttribute('Trans_Auto_Remb')=="1");
		document.getElementById("Trans_Auto_Remb_AC").checked = (result.responseXML.documentElement.getAttribute('Trans_Auto_Remb_AC')=="1");
		document.getElementById("Trans_Auto_Reg_AC").checked = (result.responseXML.documentElement.getAttribute('Trans_Auto_Reg_AC')=="1");
		document.getElementById("Ecr_Glob_Enc").checked = (result.responseXML.documentElement.getAttribute('Ecr_Glob_Enc')=="1");
		document.getElementById("Ecr_Glob_Rem").checked = (result.responseXML.documentElement.getAttribute('Ecr_Glob_Rem')=="1");
		document.getElementById("Ecr_Glob_Regul").checked = (result.responseXML.documentElement.getAttribute('Ecr_Glob_Regul')=="1");
		document.getElementById("Ecr_Glob_Remb").checked = (result.responseXML.documentElement.getAttribute('Ecr_Glob_Remb')=="1");
		
		document.getElementById("Ecr_Glob_Enc").disabled = document.getElementById("Trans_Auto_Enc").checked;
		document.getElementById("Ecr_Glob_Regul").disabled = document.getElementById("Trans_Auto_Regul").checked;
		document.getElementById("Ecr_Glob_Remb").disabled = document.getElementById("Trans_Auto_Remb").checked;
		
		document.getElementById("Rappel_Auto_Saisie").checked = (result.responseXML.documentElement.getAttribute('Rappel_Auto_Saisie')=="1");
		
		document.getElementById("Act_Analytique").checked = (result.responseXML.documentElement.getAttribute('Act_Analytique')=="1");

	} catch (e) {
    recup_erreur(e);
  }
}


function onCheck(checkBox) {
	try {
		if (checkBox=="Trans_Auto_Enc") { document.getElementById("Ecr_Glob_Enc").disabled = document.getElementById("Trans_Auto_Enc").checked; }
		else if (checkBox=="Trans_Auto_Regul") { document.getElementById("Ecr_Glob_Regul").disabled = document.getElementById("Trans_Auto_Regul").checked; }
		else if (checkBox=="Trans_Auto_Remb") { document.getElementById("Ecr_Glob_Remb").disabled = document.getElementById("Trans_Auto_Remb").checked; }
	} catch (e) {
		recup_erreur(e);
	}
}



function enregistrerParametrage() {
	try {

		var qEnregistrer = new QueryHttp("Config/comptabilite/preferences/modifierPreferences.tmpl");
		qEnregistrer.setParam("Mode_Rappro", document.getElementById('Mode_Rappro').value);
		qEnregistrer.setParam("Intitule_Ecr_Tiers", document.getElementById("Intitule_Ecr_Tiers").checked?1:0);
		qEnregistrer.setParam("Transfert_Enc", document.getElementById("Transfert_Enc").checked?1:0);
		qEnregistrer.setParam("Trans_Auto_Enc", document.getElementById("Trans_Auto_Enc").checked?1:0);
		qEnregistrer.setParam("Trans_Auto_Rem", document.getElementById("Trans_Auto_Rem").checked?1:0);
		qEnregistrer.setParam("Trans_Auto_Regul", document.getElementById("Trans_Auto_Regul").checked?1:0);
		qEnregistrer.setParam("Trans_Auto_Regul_AC", document.getElementById("Trans_Auto_Regul_AC").checked?1:0);
		qEnregistrer.setParam("Trans_Auto_Remb", document.getElementById("Trans_Auto_Remb").checked?1:0);
		qEnregistrer.setParam("Trans_Auto_Remb_AC", document.getElementById("Trans_Auto_Remb_AC").checked?1:0);
		qEnregistrer.setParam("Trans_Auto_Reg_AC", document.getElementById("Trans_Auto_Reg_AC").checked?1:0);
		qEnregistrer.setParam("Ecr_Glob_Enc", document.getElementById("Ecr_Glob_Enc").checked?1:0);
		qEnregistrer.setParam("Ecr_Glob_Rem", document.getElementById("Ecr_Glob_Rem").checked?1:0);
		qEnregistrer.setParam("Ecr_Glob_Regul", document.getElementById("Ecr_Glob_Regul").checked?1:0);
		qEnregistrer.setParam("Ecr_Glob_Remb", document.getElementById("Ecr_Glob_Remb").checked?1:0);
		qEnregistrer.setParam("Rappel_Auto_Saisie", document.getElementById("Rappel_Auto_Saisie").checked?1:0);
		qEnregistrer.setParam("Act_Analytique", document.getElementById("Act_Analytique").checked?1:0);
		qEnregistrer.execute();
		
		showMessage("Paramètres sauvegardés !");

	} catch (e) {
    recup_erreur(e);
  }
}



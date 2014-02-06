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


jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var code_journal_achat_init = "";
var code_journal_vente_init = "";
var code_journal_acpte_init = "";
var code_journal_regul_init = "";
var code_journal_anouveau_init = "";
var codeJournalAcompteAchat = "";
var currentChampCompte;


function init() {
	try {

		var qParams = new QueryHttp("Config/comptabilite/defaut/getComptesJournaux.tmpl");
		var result = qParams.execute();
		var contenu = result.responseXML.documentElement;

		document.getElementById('Numero_Compte_Clients').value = contenu.getAttribute('Numero_Compte_Clients');
		document.getElementById('Numero_Compte_Fournisseurs').value = contenu.getAttribute('Numero_Compte_Fournisseurs');
		document.getElementById('Numero_Compte_Escompte_VE').value = contenu.getAttribute('Numero_Compte_Escompte_VE');
		document.getElementById('Numero_Compte_Acompte_VE').value = contenu.getAttribute('Numero_Compte_Acompte_VE');
		document.getElementById('Numero_Compte_Escompte_AC').value = contenu.getAttribute('Numero_Compte_Escompte_AC');
		document.getElementById('Numero_Compte_Regul_VE').value = contenu.getAttribute('Numero_Compte_Regul_VE');
		document.getElementById('Numero_Compte_Regul_AC').value = contenu.getAttribute('Numero_Compte_Regul_AC');
		document.getElementById('Numero_Compte_Especes').value = contenu.getAttribute('Numero_Compte_Especes');
		document.getElementById('Numero_Compte_Port_VE').value = contenu.getAttribute('Numero_Compte_Port_VE');
		document.getElementById('Numero_Compte_Port_AC').value = contenu.getAttribute('Numero_Compte_Port_AC');
		document.getElementById('Numero_Compte_Tva_Due_IC').value = contenu.getAttribute('Numero_Compte_Tva_Due_IC');
		document.getElementById('Numero_Compte_Tva_Ded_IC').value = contenu.getAttribute('Numero_Compte_Tva_Ded_IC');
		document.getElementById('Numero_Compte_Acompte_AC').value = contenu.getAttribute('Numero_Compte_Acompte_AC');
		
		code_journal_achat_init = contenu.getAttribute('Code_Journal_Achat');
		code_journal_vente_init = contenu.getAttribute('Code_Journal_Vente');
		code_journal_acpte_init = contenu.getAttribute('Code_Journal_Acpte');
		code_journal_regul_init = contenu.getAttribute('Code_Journal_Regul');
		code_journal_anouveau_init = contenu.getAttribute('Code_Journal_AN');
		codeJournalAcompteAchat = contenu.getAttribute('Code_Journal_Acpte_AC');

		var aJAC = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'Journaux_Achat');
		aJAC.setParam('Type_Journal', 'AC');
		aJAC.initTree(initJournauxAchat);

	} catch (e) {
    recup_erreur(e);
  }
}


function initJournauxAchat() {
	try {

		document.getElementById('Journaux_Achat').value = code_journal_achat_init;
		var aJVE = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'Journaux_Vente');
		aJVE.setParam('Type_Journal', 'VE');
		aJVE.initTree(initJournauxVente);

	} catch (e) {
    recup_erreur(e);
  }
}


function initJournauxVente() {
	try {

		document.getElementById('Journaux_Vente').value = code_journal_vente_init;
		var aJACPTE = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'Journaux_Acompte');
		aJACPTE.setParam('Type_Journal', 'OD');
		aJACPTE.initTree(initJournauxAcompte);

	} catch (e) {
    recup_erreur(e);
  }
}


function initJournauxAcompte() {
	try {

		document.getElementById('Journaux_Acompte').value = code_journal_acpte_init;
		var aJRG = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'Journaux_Regul');
		aJRG.setParam('Type_Journal', 'OD');
		aJRG.initTree(initJournauxRegul);

	} catch (e) {
    recup_erreur(e);
  }
}


function initJournauxRegul() {
	try {

		document.getElementById('Journaux_Regul').value = code_journal_regul_init;
		var aJAN = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'Journaux_ANouveau');
		aJAN.setParam('Type_Journal', 'AN');
		aJAN.initTree(initJournauxAN);

	} catch (e) {
    recup_erreur(e);
  }
}


function initJournauxAN() {
	try {

		document.getElementById('Journaux_ANouveau').value = code_journal_anouveau_init;
		var aJAAC = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'Journaux_Acompte_Achats');
		aJAAC.setParam('Type_Journal', 'OD');
		aJAAC.initTree(initJournauxAAC);

	} catch (e) {
    recup_erreur(e);
  }
}


function initJournauxAAC() {
	try {

		document.getElementById('Journaux_Acompte_Achats').value = codeJournalAcompteAchat;

	} catch (e) {
    recup_erreur(e);
  }
}


function Changer(id) {
	try {

		var compte = "";
		var debCompte = "";
		var typeCompte = "G";
		var nom = "";

		if (id=="Numero_Compte_Clients") {
			typeCompte = "C";
			nom = "CLIENTS";
		}
		else if (id=="Numero_Compte_Fournisseurs") {
			typeCompte = "F";
			nom = "FOURNISSEURS";
		}
		else if (id=="Numero_Compte_Port_AC") {
			debCompte = "6241";
			nom = "PORT SUR ACHAT";
		}
		else if (id=="Numero_Compte_Port_VE") {
			debCompte = "7";
			nom = "PORT SUR VENTE";
		}
		else if (id=="Numero_Compte_Escompte_VE") {
			debCompte = "665";
			nom = "ESCOMPTE SUR VENTE";
		}
		else if (id=="Numero_Compte_Acompte_VE") {
			debCompte = "4191";
			nom = "ACOMPTE SUR VENTE";
		}
		else if (id=="Numero_Compte_Escompte_AC") {
			debCompte = "765";
			nom = "ESCOMPTE SUR ACHAT";
		}
		else if (id=="Numero_Compte_Regul_VE") {
			debCompte = "658";
			nom = "CHARGES EXCEPTIONNELLES";
		}
		else if (id=="Numero_Compte_Regul_AC") {
			debCompte = "758";
			nom = "PRODUITS EXCEPTIONNELS";
		}
		else if (id=="Numero_Compte_Especes") {
			debCompte = "5";
			nom = "REMISE D'ESPECES";
		}
		else if (id=="Numero_Compte_Tva_Due_IC") {
			debCompte = "4452";
			nom = "TVA DUE INTRACOMMUNAUTAIRE";
		}
		else if (id=="Numero_Compte_Tva_Ded_IC") {
			debCompte = "445662";
			nom = "TVA DEDUCTIBLE UE";
		}
		else if (id=="Numero_Compte_Acompte_AC") {
			debCompte = "4091";
			nom = "ACOMPTE SUR ACHAT";
		}

		currentChampCompte = id;
    var url ="chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Force_Deb="+ debCompte +"&Type_Compte="+ typeCompte +"&nom="+ nom +"&Creer=false&Num_Compte="+ urlEncode(compte);
    window.openDialog(url,'','chrome,modal,centerscreen',retourChangerCompte);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourChangerCompte(numCompte) {
	try {
		document.getElementById(currentChampCompte).value = numCompte;

	} catch (e) {
		  recup_erreur(e);
	}
}


function modifierParametres() {
	try {

		var code_journal_achat = document.getElementById('Journaux_Achat').value;
		var code_journal_vente = document.getElementById('Journaux_Vente').value;
		var code_journal_acpte = document.getElementById('Journaux_Acompte').value;
		var code_journal_regul = document.getElementById('Journaux_Regul').value;
		var code_journal_anouveau = document.getElementById('Journaux_ANouveau').value;
		var codeJournalAcompteAchat = document.getElementById('Journaux_Acompte_Achats').value;
		var numero_compte_clients = document.getElementById('Numero_Compte_Clients').value;
		var numero_compte_fournisseurs = document.getElementById('Numero_Compte_Fournisseurs').value;
		var numero_compte_port_ve = document.getElementById('Numero_Compte_Port_VE').value;
		var numero_compte_port_ac = document.getElementById('Numero_Compte_Port_AC').value;
		var numero_compte_escompte_ve = document.getElementById('Numero_Compte_Escompte_VE').value;
		var numero_compte_acompte_ve = document.getElementById('Numero_Compte_Acompte_VE').value;
		var numero_compte_escompte_ac = document.getElementById('Numero_Compte_Escompte_AC').value;
		var numero_compte_regul_ve = document.getElementById('Numero_Compte_Regul_VE').value;
		var numero_compte_regul_ac = document.getElementById('Numero_Compte_Regul_AC').value;
		var numero_compte_especes = document.getElementById('Numero_Compte_Especes').value;
		var numero_compte_tva_due_ic = document.getElementById('Numero_Compte_Tva_Due_IC').value;
		var numero_compte_tva_ded_ic = document.getElementById('Numero_Compte_Tva_Ded_IC').value;
		var numeroCompteAcompteAC = document.getElementById('Numero_Compte_Acompte_AC').value;

		if (code_journal_achat=="0" || code_journal_vente=="0" || code_journal_anouveau=="0"
				|| isEmpty(numero_compte_clients) || isEmpty(numero_compte_fournisseurs)
				|| isEmpty(numero_compte_escompte_ve) || isEmpty(numero_compte_acompte_ve) || isEmpty(numero_compte_escompte_ac)
				|| isEmpty(numero_compte_regul_ve) || isEmpty(numero_compte_regul_ac) || isEmpty(numero_compte_port_ve)
				|| isEmpty(numero_compte_port_ac) || isEmpty(numero_compte_tva_due_ic) || isEmpty(numero_compte_tva_ded_ic)
				|| isEmpty(numeroCompteAcompteAC)) {
			showWarning("Les champs marqués d'une étoile sont obligatoires !");
		}
		else {

			var qMajParams = new QueryHttp("Config/comptabilite/defaut/modifierComptesJournaux.tmpl");
			qMajParams.setParam("Code_Journal_Achat", code_journal_achat);
			qMajParams.setParam("Code_Journal_Vente", code_journal_vente);
			qMajParams.setParam("Code_Journal_Acpte", code_journal_acpte);
			qMajParams.setParam("Code_Journal_Regul", code_journal_regul);
			qMajParams.setParam("Code_Journal_AN", code_journal_anouveau);
			qMajParams.setParam("Code_Journal_Acpte_AC", codeJournalAcompteAchat);
			qMajParams.setParam("Numero_Compte_Clients", numero_compte_clients);
			qMajParams.setParam("Numero_Compte_Fournisseurs", numero_compte_fournisseurs);
			qMajParams.setParam("Numero_Compte_Port_VE", numero_compte_port_ve);
			qMajParams.setParam("Numero_Compte_Port_AC", numero_compte_port_ac);
			qMajParams.setParam("Numero_Compte_Escompte_VE", numero_compte_escompte_ve);
			qMajParams.setParam("Numero_Compte_Acompte_VE", numero_compte_acompte_ve);
			qMajParams.setParam("Numero_Compte_Escompte_AC", numero_compte_escompte_ac);
			qMajParams.setParam("Numero_Compte_Regul_VE", numero_compte_regul_ve);
			qMajParams.setParam("Numero_Compte_Regul_AC", numero_compte_regul_ac);
			qMajParams.setParam("Numero_Compte_Especes", numero_compte_especes);
			qMajParams.setParam("Numero_Compte_Tva_Due_IC", numero_compte_tva_due_ic);
			qMajParams.setParam("Numero_Compte_Tva_Ded_IC", numero_compte_tva_ded_ic);
			qMajParams.setParam("Numero_Compte_Acompte_AC", numeroCompteAcompteAC);
			qMajParams.execute();

			showMessage("Les comptes et journaux par défaut ont été enregistrés avec succès !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}

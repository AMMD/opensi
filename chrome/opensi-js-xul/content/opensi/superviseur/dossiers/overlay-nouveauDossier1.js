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

var ond1_aCentres = new Arbre('Superviseur/GetRDF/listeCentreImpot.tmpl', 'ond1-centreImpot');
var ond1_aTresors = new Arbre('Superviseur/GetRDF/listeTresorerie.tmpl', 'ond1-tresorerie');
var ond1_aTypesSociete = new Arbre("Facturation/GetRDF/liste-typesSociete.tmpl","ond1-typeSociete");
var ond1_aDevises = new Arbre('ComboListe/combo-devises.tmpl', 'ond1-monnaieTenue');

var ond1_deviseDefaut;

function ond1_init() {
	try {
		
		var qDevise = new QueryHttp("Superviseur/dossiers/getDevise.tmpl");
		qDevise.setParam("Code_Alpha", "EUR");
		var result = qDevise.execute();
		ond1_deviseDefaut = result.responseXML.documentElement.getAttribute("Devise_Id");

		document.getElementById('ond1-centreImpot').inputField.setAttribute("maxlength","60");
		document.getElementById('ond1-tresorerie').inputField.setAttribute("maxlength","60");
		document.getElementById('ond1-monnaieTenue').disabled = true;
		
		ond1_aCentres.initTree(ond1_initCentre);
	} catch (e) {
    recup_erreur(e);
  }
}


function ond1_initCentre() {
	try {
		ond1_aTresors.initTree(ond1_initTresor);
	} catch (e) {
		recup_erreur(e);
	}
}


function ond1_initTresor() {
	try {

		ond1_aDevises.initTree(ond1_initDevise);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ond1_initDevise() {
	try {

		document.getElementById('ond1-monnaieTenue').value = ond1_deviseDefaut;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ond1_reinitialiser() {
	try {
		document.getElementById("ond1-denomination").value = "";
		document.getElementById("ond1-adresse1").value = "";
		document.getElementById("ond1-adresse2").value = "";
		document.getElementById("ond1-adresse3").value = "";
		document.getElementById("ond1-codePostal").value = "";
		document.getElementById("ond1-ville").value = "";
		document.getElementById("ond1-enseigne").value = "";
		document.getElementById("ond1-email").value = "";
		document.getElementById("ond1-fax").value = "";
		document.getElementById("ond1-telephone").value = "";
		document.getElementById("ond1-dateCreation").value = "";
		document.getElementById("ond1-numSIRET").value = "";
		document.getElementById("ond1-codeNAF").value = "";
		document.getElementById("ond1-siteWeb").value = "";
		document.getElementById("ond1-numTvaIntra").value = "";
		document.getElementById("ond1-villeRCS").value = "";
		document.getElementById("ond1-dureeSociete").value = "";
		document.getElementById('ond1-monnaieTenue').value = ond1_deviseDefaut;
		document.getElementById("ond1-montantCapital").value = "";
		document.getElementById("ond1-nbParts").value = "";
		document.getElementById("ond1-typologie").selectedIndex=0;
		document.getElementById("ond1-expert").value = "";
		document.getElementById("ond1-regimeFiscal").value = "IR";
		document.getElementById("ond1-regimeGroupe").value = "1";
		document.getElementById("ond1-centreImpot").value = "";
		document.getElementById("ond1-tresorerie").value = "";
		document.getElementById("ond1-centreGestion").value = "";
		
		ond1_aTypesSociete.setParam("Dossier_Id", dossierEnCours);
		ond1_aTypesSociete.initTree(ond1_initValues);
	} catch (e) {
		recup_erreur(e);
	}
}


function ond1_initValues() {
	try {
		
		document.getElementById("ond1-typeSociete").selectedIndex=0;
		
		var qGetDossier = new QueryHttp("Superviseur/dossiers/getDossier.tmpl");
		qGetDossier.setParam("Dossier_Id", dossierEnCours);
		var result = qGetDossier.execute();
		document.getElementById("ond1-denomination").value = result.responseXML.documentElement.getAttribute("Nom");
		
	} catch (e) {
		recup_erreur(e);
	}
}



function ond1_etapeSuivante() {
	try {
		
		var denomination = document.getElementById("ond1-denomination").value;
		var adresse1 = document.getElementById("ond1-adresse1").value;
		var adresse2 = document.getElementById("ond1-adresse2").value;
		var adresse3 = document.getElementById("ond1-adresse3").value;
		var codePostal = document.getElementById("ond1-codePostal").value;
		var ville = document.getElementById("ond1-ville").value;
		var enseigne = document.getElementById("ond1-enseigne").value;
		var email = document.getElementById("ond1-email").value;
		var fax = document.getElementById("ond1-fax").value;
		var telephone = document.getElementById("ond1-telephone").value;
		var dateCreation = document.getElementById("ond1-dateCreation").value;
		var numSiret = document.getElementById("ond1-numSIRET").value;
		var codeNaf = document.getElementById("ond1-codeNAF").value;
		var dureeSociete = document.getElementById("ond1-dureeSociete").value;
		var typeSociete = document.getElementById("ond1-typeSociete").value;
		var montantCapital = document.getElementById("ond1-montantCapital").value;
		var monnaieTenue = document.getElementById("ond1-monnaieTenue").value;
		var nbParts = document.getElementById("ond1-nbParts").value;
		var typologie = document.getElementById("ond1-typologie").value;
		var expert = document.getElementById("ond1-expert").value;
		var regimeFiscal = document.getElementById("ond1-regimeFiscal").value;
		var regimeGroupe = document.getElementById("ond1-regimeGroupe").value;
		var centreImpot = document.getElementById("ond1-centreImpot").value;
		var tresorerie = document.getElementById("ond1-tresorerie").value;
		var centreGestion = document.getElementById("ond1-centreGestion").value;
		var siteWeb = document.getElementById("ond1-siteWeb").value;
		var numTvaIntra = document.getElementById("ond1-numTvaIntra").value;
		var villeRcs = document.getElementById("ond1-villeRCS").value;

		if (isEmpty(denomination)) { showWarning('Raison sociale manquante !'); }
		else if (isEmpty(adresse1)) { showWarning('Adresse manquante !'); }
		else if (isEmpty(codePostal)) { showWarning('Code postal manquant !'); }
		else if (isEmpty(ville)) { showWarning('Ville manquante !'); }
		else if (isEmpty(numSiret)) { showWarning('Numéro de SIRET manquant !'); }
		else if (isEmpty(codeNaf)) { showWarning('Code NAF manquant !'); }
		else if (!isEmpty(dateCreation) && !isDate(dateCreation)) { showWarning('Date de création incorrecte (format: jj/mm/aaaa) !'); }
		else if (codePostal.length != 5 || !isDigitList(codePostal)) { showWarning('Code postal incorrect !'); }
		else if (!isEmpty(email) && !isEmail(email)) { showWarning('Adresse e-mail incorrecte !'); }
		else if (!isEmpty(fax) && !isPhone(fax)) { showWarning('Numéro de fax incorrect !'); }
		else if (!isEmpty(telephone) && !isPhone(telephone)) { showWarning('Numéro de téléphone incorrect !'); }
		else if (typeSociete=="0") { showWarning("Veuillez choisir un type de société !"); }
		else if (!isEmpty(dureeSociete) && !isPositiveInteger(dureeSociete)) { showWarning('Durée de société incorrecte !'); }
		else if (!isEmpty(montantCapital) && !isPositive(montantCapital)) { showWarning('Montant du capital incorrect'); }
		else if (!isEmpty(nbParts) && !isPositiveInteger(nbParts)) { showWarning('Nombre de parts incorrect'); }
		else {

			if (!isEmpty(dateCreation)) { dateCreation = prepareDateJava(dateCreation); }

			var qEnregistrer = new QueryHttp("Superviseur/dossiers/enregistrerEtape1.tmpl");
			qEnregistrer.setParam("Dossier_Id", dossierEnCours);
			qEnregistrer.setParam("Denomination", denomination);
			qEnregistrer.setParam("Enseigne", enseigne);
			qEnregistrer.setParam("Adresse_1", adresse1);
			qEnregistrer.setParam("Adresse_2", adresse2);
			qEnregistrer.setParam("Adresse_3", adresse3);
			qEnregistrer.setParam("Code_Postal", codePostal);
			qEnregistrer.setParam("Ville", ville);
			qEnregistrer.setParam("Email", email);
			qEnregistrer.setParam("Telephone", telephone);
			qEnregistrer.setParam("Fax", fax);
			qEnregistrer.setParam("Num_SIRET", numSiret);
			qEnregistrer.setParam("Code_NAF", codeNaf);
			qEnregistrer.setParam("Type_Societe", typeSociete);
			qEnregistrer.setParam("Typologie", typologie);
			qEnregistrer.setParam("Date_Creation", dateCreation);
			qEnregistrer.setParam("Duree_Societe", dureeSociete);
			qEnregistrer.setParam("Montant_Capital", montantCapital);
			qEnregistrer.setParam("Nb_Parts", nbParts);
			qEnregistrer.setParam("Expert", expert);
			qEnregistrer.setParam("Monnaie_Tenue", monnaieTenue);
			qEnregistrer.setParam("Regime_Fiscal", regimeFiscal);
			qEnregistrer.setParam("Regime_Groupe", regimeGroupe);
			qEnregistrer.setParam("Centre_Impot", centreImpot);
			qEnregistrer.setParam("Tresorerie", tresorerie);
			qEnregistrer.setParam("Centre_Gestion", centreGestion);
			qEnregistrer.setParam("Site_Web", siteWeb);
			qEnregistrer.setParam("Num_TVA_Intra", numTvaIntra);
			qEnregistrer.setParam("Ville_RCS", villeRcs);
			qEnregistrer.execute();

			ond2_reinitialiser();
			document.getElementById('deck').selectedIndex=2;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


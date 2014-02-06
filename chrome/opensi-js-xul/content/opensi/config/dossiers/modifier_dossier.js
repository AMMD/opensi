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


var Dossier_Id;
var change_exo = 0;
var debut_exercice = '';

function init() {
	try {
		
		document.getElementById('Centre_Impot').inputField.setAttribute("maxlength","60");
		document.getElementById('Tresorerie').inputField.setAttribute("maxlength","60");
	
		var arbre_type = new Arbre('Facturation/GetRDF/liste-typesSociete.tmpl','Type_Societe');
		arbre_type.initTree(initCentre);

	} catch (e) {
    recup_erreur(e);
  }
}


function initCentre() {
	try {
		var aCentres = new Arbre('Config/GetRDF/listeCentreImpot.tmpl', 'Centre_Impot');
		aCentres.initTree(initTresor);
	} catch (e) {
		recup_erreur(e);
	}
}


function initTresor() {
	try {
		var aTresors = new Arbre('Config/GetRDF/listeTresorerie.tmpl', 'Tresorerie');
		aTresors.initTree(initDevise);
	} catch (e) {
		recup_erreur(e);
	}
}


function initDevise() {
	try {
		var aDevises = new Arbre('ComboListe/combo-devises.tmpl', 'monnaieTenue');
		aDevises.initTree(initValues);
	} catch (e) {
		recup_erreur(e);
	}
}


function initValues() {
	try {

		var corps = cookie() +"&Page=Config/dossiers/getDossier.tmpl&ContentType=xml";
		requeteHTTP(corps, new XMLHttpRequest(), initValues_2);

	} catch (e) {
    recup_erreur(e);
  }
}


function initValues_2(httpRequest) {
	try {

    var dossier = httpRequest.responseXML.documentElement;

		Dossier_Id = dossier.getAttribute('Dossier_Id');

		document.getElementById("titre").value = 'MODIFICATION DU DOSSIER "'+ Dossier_Id +'"';

		document.getElementById('Denomination').value = dossier.getAttribute('raison_sociale');
		document.getElementById('Enseigne').value = dossier.getAttribute('enseigne');
		document.getElementById('Adresse').value = dossier.getAttribute('adresse');
		document.getElementById('Comp_Adresse').value = dossier.getAttribute('comp_adresse');
		document.getElementById('Adresse_3').value = dossier.getAttribute('adresse_3');
		document.getElementById('Code_Postal').value = dossier.getAttribute('code_postal');
		document.getElementById('Ville').value = dossier.getAttribute('ville');
		document.getElementById('Email').value = dossier.getAttribute('email');
		document.getElementById('Telephone').value = dossier.getAttribute('telephone');
		document.getElementById('Fax').value = dossier.getAttribute('fax');
		document.getElementById('Num_SIRET').value = dossier.getAttribute('num_siret');
		document.getElementById('Code_NAF').value = dossier.getAttribute('code_naf');
		document.getElementById('Typologie').value = dossier.getAttribute('typologie');
		document.getElementById('Type_Societe').value = dossier.getAttribute('type_societe');

		if (dossier.getAttribute('date_creation')!="0") {
			document.getElementById('Date_Creation').value = dossier.getAttribute('date_creation');
		}
		if (dossier.getAttribute('duree_societe')!="0") {
			document.getElementById('Duree_Societe').value = dossier.getAttribute('duree_societe');
		}
		if (dossier.getAttribute('montant_capital')!="0.00") {
			document.getElementById('Montant_Capital').value = dossier.getAttribute('montant_capital');
		}
		if (dossier.getAttribute('nb_parts')!="0") {
			document.getElementById('Nb_Parts').value = dossier.getAttribute('nb_parts');
		}
		document.getElementById('Expert').value = dossier.getAttribute('expert');
		document.getElementById('monnaieTenue').value = dossier.getAttribute('monnaie_tenue');
		document.getElementById('Regime_Fiscal').value = dossier.getAttribute('regime_fiscal');
		document.getElementById('Regime_Groupe').value = dossier.getAttribute('regime_groupe');
		document.getElementById('Centre_Impot').value = dossier.getAttribute('centre_impot');
		document.getElementById('Tresorerie').value = dossier.getAttribute('tresorerie');
		document.getElementById('Centre_Gestion').value = dossier.getAttribute('centre_gestion');
		document.getElementById('Site_Web').value = dossier.getAttribute('site_web');
		document.getElementById('Num_TVA_Intra').value = dossier.getAttribute('num_tva_intra');
		document.getElementById('Ville_RCS').value = dossier.getAttribute('ville_rcs');

		document.getElementById('Fin_Exercice').value = dossier.getAttribute('fin_exercice');

		change_exo = dossier.getAttribute('change_exo');
		debut_exercice = dossier.getAttribute('debut_exercice');

		if (change_exo==0) {
			document.getElementById('Fin_Exercice').disabled = true;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function modifierDossier() {
	try {

		var date_creation = document.getElementById('Date_Creation').value;
		var email = document.getElementById("Email").value;
		var fax = document.getElementById("Fax").value;
		var telephone = document.getElementById("Telephone").value;
		var code_postal = document.getElementById("Code_Postal").value;
		var num_siret = document.getElementById("Num_SIRET").value;
		var code_naf = document.getElementById("Code_NAF").value;
		var duree_societe = document.getElementById("Duree_Societe").value;
		var montant_capital = document.getElementById("Montant_Capital").value;
		var nb_parts = document.getElementById("Nb_Parts").value;
		var fin_exercice = document.getElementById("Fin_Exercice").value;

		if (isEmpty(document.getElementById("Denomination").value)) { showWarning('Raison sociale manquante !'); return false; }
		else if (isEmpty(document.getElementById("Adresse").value)) { showWarning('Adresse manquante !'); return false; }
		else if (isEmpty(code_postal)) { showWarning('Code postal manquant !'); return false; }
		else if (isEmpty(document.getElementById("Ville").value)) { showWarning('Ville manquante !'); return false; }
		else if (isEmpty(num_siret)) { showWarning('Numéro de SIRET manquant !'); return false; }
		else if (isEmpty(code_naf)) { showWarning('Code NAF manquant !'); return false; }
		else if (isEmpty(fin_exercice)) { showWarning('Date de fin d\'exercice manquante !'); return false; }
		else if (!isEmpty(date_creation) && !isDate(date_creation)) { showWarning('Date de création incorrecte (format: jj/mm/aaaa)'); return false; }
		else if (code_postal.length !=5 || !isDigitList(code_postal)) { showWarning('Code postal incorrect !'); return false;}
		else if (!isEmpty(email) && !isEmail(email)) { showWarning('Adresse e-mail incorrecte !'); return false; }
		else if (!isEmpty(fax) && !isPhone(fax)) { showWarning('Numéro de fax incorrect !'); return false; }
		else if (!isEmpty(telephone) && !isPhone(telephone)) { showWarning('Numéro de téléphone incorrect !'); return false; }
		//else if (num_siret.length != 14 || !isDigitList(num_siret)) { showWarning('Numéro de SIRET incorrect !'); return false; }
		//else if (code_naf.length != 4 || !isDigitList(code_naf.substring(0,3)) || !isAlpha(code_naf.charAt(3))) { showWarning('Code NAF incorrect !'); return false; }
		else if (!isEmpty(duree_societe) && !isPositiveInteger(duree_societe)) { showWarning('Durée de société incorrecte !'); return false; }
		else if (!isEmpty(montant_capital) && !isPositive(montant_capital)) { showWarning('Montant du capital incorrect'); return false; }
		else if (!isEmpty(nb_parts) && !isPositiveInteger(nb_parts)) { showWarning('Nombre de parts incorrect'); return false; }
		else if (!isDate(fin_exercice)) { showWarning('Dates d\'exercices incorrectes ! (format: jj/mm/aaaa)'); }
		else if (!isDateInterval(debut_exercice,fin_exercice)) { showWarning('la date de fin d\'exercice est inférieur à la date de début d\'exercice'); return false; }
		else {

			if (!isEmpty(date_creation))
				date_creation = prepareDateJava(date_creation);

			if (window.confirm('Confirmez-vous la modification du dossier "'+ Dossier_Id +'" ?')) {

				var infos_societe = "&Denomination=" + urlEncode(document.getElementById("Denomination").value);
				infos_societe += "&Enseigne=" + urlEncode(document.getElementById("Enseigne").value);
				infos_societe += "&Adresse=" + urlEncode(document.getElementById("Adresse").value);
				infos_societe += "&Comp_Adresse=" + urlEncode(document.getElementById("Comp_Adresse").value);
				infos_societe += "&Adresse_3=" + urlEncode(document.getElementById("Adresse_3").value);
				infos_societe += "&Code_Postal=" + code_postal;
				infos_societe += "&Ville=" + urlEncode(document.getElementById("Ville").value);
				infos_societe += "&Email=" + email;
				infos_societe += "&Telephone=" + telephone;
				infos_societe += "&Fax=" + fax;
				infos_societe += "&Num_SIRET=" + num_siret;
				infos_societe += "&Code_NAF=" + code_naf;
				infos_societe += "&Type_Societe=" + document.getElementById("Type_Societe").value;
				infos_societe += "&Typologie=" + urlEncode(document.getElementById("Typologie").value);
				infos_societe += "&Date_Creation=" + date_creation;
				infos_societe += "&Duree_Societe=" + duree_societe;
				infos_societe += "&Montant_Capital=" + montant_capital;
				infos_societe += "&Nb_Parts=" + nb_parts;
				infos_societe += "&Expert=" + urlEncode(document.getElementById("Expert").value);
				infos_societe += "&Monnaie_Tenue=" + document.getElementById("monnaieTenue").value;
				infos_societe += "&Regime_Fiscal=" + urlEncode(document.getElementById("Regime_Fiscal").value);
				infos_societe += "&Regime_Groupe=" + urlEncode(document.getElementById("Regime_Groupe").value);
				infos_societe += "&Centre_Impot=" + urlEncode(document.getElementById("Centre_Impot").value);
				infos_societe += "&Tresorerie=" + urlEncode(document.getElementById("Tresorerie").value);
				infos_societe += "&Centre_Gestion=" + urlEncode(document.getElementById("Centre_Gestion").value);
				infos_societe += "&Site_Web=" + urlEncode(document.getElementById("Site_Web").value);
				infos_societe += "&Num_TVA_Intra=" + urlEncode(document.getElementById("Num_TVA_Intra").value);
				infos_societe += "&Fin_Exercice=" + prepareDateJava(document.getElementById("Fin_Exercice").value);
				infos_societe += "&Change_Exo="+ change_exo;
				infos_societe += "&Ville_RCS="+ urlEncode(document.getElementById('Ville_RCS').value);

				var corps = cookie() +"&Page=Config/dossiers/modifierDossier.tmpl&ContentType=xml" + infos_societe;
				requeteHTTP(corps, new XMLHttpRequest(), modifierDossier_2);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function modifierDossier_2(httpRequest) {
	try {

		var message = httpRequest.responseXML.documentElement.getAttribute("message");

		if (message=="erreur") {
			showWarning("Dossier non modifié !");
		}
		else if (message=="fini") {

			var message2 = httpRequest.responseXML.documentElement.getAttribute("message2");

			if (message2=="Impossible") {
				showWarning("Impossible de modifier la date de fin d'exercice !");
			}
			else if (message2=="Impossible existe") {
				showWarning("Impossible de modifier la date de fin d'exercice ! Des écritures existent aprés la nouvelle date de fin d'exercice !");
			} else {
				showMessage("Le dossier "+Dossier_Id+" a été modifié avec succès !");
			}
		}
		else {
			showWarning("Erreur du serveur !");
		}

		retour_menuManager();

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_menuManager() {
	try {

  	window.location = "chrome://opensi/content/config/menu_manager.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_choixDossier() {
	try {

	 	window.location = "chrome://opensi/content/config/menu.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

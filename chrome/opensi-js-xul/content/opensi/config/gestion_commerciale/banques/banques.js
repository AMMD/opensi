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
jsLoader.loadSubScript("chrome://opensi/content/libs/banques.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var currentBanque;
var aBanques = new Arbre("Config/GetRDF/listeBanques.tmpl", "tree-banques");
var aJournaux = new Arbre('Compta/GetRDF/combo-journaux.tmpl', 'Code_Journal');


function initBanques() {
	try {

		aJournaux.setParam("Type_Journal", "TR");
		aJournaux.initTree(initJournal);

	} catch (e) {
    recup_erreur(e);
  }
}

function initJournal() {
	try {
		document.getElementById('Code_Journal').selectedIndex = 0;
		aBanques.initTree(nouveauBanque);
	} catch (e) {
		recup_erreur(e);
	}
}


function makeIBAN() {
	try {

		var suite_iban = "";
		if (!document.getElementById('international').checked) {
			suite_iban += document.getElementById('Code_Agence').value;
			suite_iban += document.getElementById('Code_Guichet').value;
			suite_iban += document.getElementById('Num_Compte').value;
			suite_iban += document.getElementById('Cle_RIB').value;
		}

		document.getElementById('IBAN_Suite').value = suite_iban;

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauBanque() {
	try {
		
		if (aBanques.isSelected()) {
			aBanques.select(-1);
		}

		// initialisation valeurs par d�faut
		document.getElementById('Nom_Banque').value = "";
		document.getElementById('Domiciliation').value = "";
		document.getElementById('Code_Agence').value = "";
		document.getElementById('Code_Guichet').value = "";
		document.getElementById('Num_Compte').value = "";
		document.getElementById('Cle_RIB').value = "";
		document.getElementById('IBAN').value = "";
		document.getElementById('BIC').value = "";
		document.getElementById('IBAN_Suite').value = "";
		document.getElementById('Code_Journal').selectedIndex = 0;
		document.getElementById('bNouveauBanque').collapsed = true;
		document.getElementById('bSupprimerBanque').collapsed = true;
		document.getElementById('bModifierBanque').collapsed = true;
		document.getElementById('bCreerBanque').collapsed = false;
		currentBanque = "";

	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerBanque() {
	try {

		var nom = document.getElementById('Nom_Banque').value;

		if (window.confirm("Confirmez-vous la suppression de la banque '"+ nom +"' ?")) {
			var qSupprimerBanque = new QueryHttp("Config/gestion_commerciale/banques/supprimerBanque.tmpl");
			qSupprimerBanque.setParam("Banque_Id", currentBanque);
			var result = qSupprimerBanque.execute();

			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				document.getElementById('bSupprimerBanque').collapsed = true;
				document.getElementById('bModifierBanque').collapsed = true;
				document.getElementById('bCreerBanque').collapsed = false;
				document.getElementById('bNouveauBanque').collapsed = true;
				aBanques.initTree(nouveauBanque);
			} else {
				showWarning("Impossible de supprimer la banque car elle est utilis�e !");
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerBanque(mode) {
	try {

		var nom = document.getElementById('Nom_Banque').value;
		var adresse = document.getElementById('Domiciliation').value;
		var code_agence = document.getElementById('Code_Agence').value;
		var code_guichet = document.getElementById('Code_Guichet').value;
		var num_compte = document.getElementById('Num_Compte').value;
		var cle_rib = document.getElementById('Cle_RIB').value;
		var deb_iban=document.getElementById('IBAN').value;
		var fin_iban = document.getElementById('IBAN_Suite').value;
		var iban = document.getElementById('IBAN').value+document.getElementById('IBAN_Suite').value;
		var bic = document.getElementById('BIC').value;
		var international = document.getElementById('international').checked;
		var codeJournal = document.getElementById('Code_Journal').value;

		var qEnregistrerBanque;
		var corps;

		if (mode=="C") {
			qEnregistrerBanque = new QueryHttp("Config/gestion_commerciale/banques/creerBanque.tmpl");
		}
		else {
			qEnregistrerBanque = new QueryHttp("Config/gestion_commerciale/banques/modifierBanque.tmpl");
			qEnregistrerBanque.setParam("Banque_Id", currentBanque);
		}
		
		qEnregistrerBanque.setParam("Nom", nom);
		qEnregistrerBanque.setParam("Adresse", adresse);
		qEnregistrerBanque.setParam("BIC", bic);

		if (!international) {
			qEnregistrerBanque.setParam("Code_Agence", code_agence);
			qEnregistrerBanque.setParam("Code_Guichet", code_guichet);
			qEnregistrerBanque.setParam("Num_Compte", num_compte);
			qEnregistrerBanque.setParam("Cle_RIB", cle_rib);
		}
		if (international || deb_iban!="") {
			qEnregistrerBanque.setParam("IBAN", iban);
		}
		qEnregistrerBanque.setParam("Code_Journal", codeJournal);

		if (isEmpty(nom)) { showWarning("Veuillez sp�cifier le nom de la banque !"); }
		else if (isEmpty(adresse)) { showWarning("Veuillez sp�cifier la domiciliation"); }
		else if (!international && isEmpty(code_agence)) { showWarning("Veuillez sp�cifier le code agence !"); }
		else if (!international && isEmpty(code_guichet)) { showWarning("Veuillez sp�cifier le code guichet !"); }
		else if (!international && isEmpty(num_compte)) { showWarning("Veuillez sp�cifier le num�ro de compte !"); }
		else if (!international && isEmpty(cle_rib)) { showWarning("Veuillez sp�cifier la cl� de RIB !"); }
		else if (!international && !isCodeAgence(code_agence)) { showWarning("Code agence incorrect !"); }
		else if (!international && !isCodeGuichet(code_guichet)) { showWarning("Code guichet incorrect !"); }
		else if (!international && !isNumCompte(num_compte)) { showWarning("Num�ro de compte incorrect !"); }
		else if (!international && !isCleRIB(cle_rib)) { showWarning("Cl� de RIB incorrect !"); }
		else if (!international && !isEmpty(deb_iban) && !isPrefIBAN(deb_iban)) { showWarning("IBAN incorrect !"); }
		else if (!international && !isEmpty(bic) && !isBIC(bic)) { showWarning("BIC incorrect !"); }
		else if (!international && !verifCleRIB(cle_rib, fin_iban)) { showWarning("Echec du contr�le de la cl� de RIB ! Erreur probable sur Num�ro de compte, Code agence ou Code guichet"); }
		else if (!international && !isEmpty(deb_iban) && !verifCleIBAN(deb_iban.substring(2,4), deb_iban, fin_iban)) { showWarning("Echec du contr�le de la cl� IBAN ! Erreur probable sur Num�ro IBAN, Num�ro de compte, Code agence ou Code guichet"); }
		
		else if (international && (isEmpty(deb_iban) || !isPrefIBAN(deb_iban) || isEmpty(fin_iban))) { showWarning("IBAN incorrect !"); }
		else if (international && !verifCleIBAN(deb_iban.substring(2,4), deb_iban, fin_iban)) { showWarning("Echec du contr�le de la cl� IBAN !"); }

		else {
			var p = qEnregistrerBanque.execute();

			if (mode=="C") {
				contenu = p.responseXML.documentElement;

				currentBanque = contenu.getAttribute('Banque_Id');
				document.getElementById('bCreerBanque').collapsed = true;
				document.getElementById('bModifierBanque').collapsed = false;
				document.getElementById('bNouveauBanque').collapsed = false;
				document.getElementById('bSupprimerBanque').collapsed = false;
			}

			aBanques.initTree(nouveauBanque);
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function changer_type(international) {
  try {
    document.getElementById("row_Code_Agence").collapsed=international;
    document.getElementById("row_Code_Guichet").collapsed=international;
    document.getElementById("row_Num_Compte").collapsed=international;
    document.getElementById("row_Cle_RIB").collapsed=international;
    document.getElementById("IBAN_Suite").disabled=!international;
    makeIBAN();

  } catch (e) {
    recup_erreur(e);
  }
}


function chargerBanque() {
	try {

		var tree = document.getElementById('tree-banques');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var banque_id = getCellValue(tree,tree.currentIndex,'ColNom');
			var qChargerBanque = new QueryHttp("Config/gestion_commerciale/banques/getBanque.tmpl");
			qChargerBanque.setParam("Banque_Id", banque_id);
			
			var p = qChargerBanque.execute();

			var contenu = p.responseXML.documentElement;

			currentBanque = banque_id;
			document.getElementById('Nom_Banque').value = contenu.getAttribute('Nom');
			document.getElementById('Domiciliation').value = contenu.getAttribute('Adresse');
			document.getElementById('Code_Agence').value = contenu.getAttribute('Code_Agence');
			document.getElementById('Code_Guichet').value = contenu.getAttribute('Code_Guichet');
			document.getElementById('Num_Compte').value = contenu.getAttribute('Num_Compte');
			document.getElementById('Cle_RIB').value = contenu.getAttribute('Cle_RIB');
			document.getElementById('IBAN').value = contenu.getAttribute('IBAN');
			document.getElementById('BIC').value = contenu.getAttribute('BIC');
			document.getElementById('Code_Journal').value = contenu.getAttribute('Code_Journal');
			document.getElementById('bSupprimerBanque').collapsed = false;
			document.getElementById('bModifierBanque').collapsed = false;
			document.getElementById('bNouveauBanque').collapsed = false;
			document.getElementById('bCreerBanque').collapsed = true;
			document.getElementById('international').checked=document.getElementById('Code_Agence').value=="";
			changer_type(document.getElementById('international').checked);
      
			if (document.getElementById('international').checked) {
				document.getElementById('IBAN_Suite').value = contenu.getAttribute('IBAN_Suite');
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}



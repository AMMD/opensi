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


var currentBanque;
var aBanques = new Arbre("Facturation/GetRDF/banques_clients.tmpl", "tree-banques");


function initBanques() {
	try {

		aBanques.setParam("Client_Id", currentClient);
		aBanques.initTree();
		nouveauBanque();

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

		// initialisation valeurs par défaut
		document.getElementById('Nom_Banque').value = "";
		document.getElementById('Domiciliation').value = "";
		document.getElementById('Code_Agence').value = "";
		document.getElementById('Code_Guichet').value = "";
		document.getElementById('Num_Compte').value = "";
		document.getElementById('Cle_RIB').value = "";
		document.getElementById('IBAN').value = "";
		document.getElementById('BIC').value = "";
		document.getElementById('IBAN_Suite').value = "";
		document.getElementById('bNouveauBanque').collapsed = true;
		document.getElementById('bSupprimerBanque').collapsed = true;
		document.getElementById('bModifierBanque').collapsed = true;
		document.getElementById('bCreerBanque').collapsed = false;

	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerBanque() {
	try {

		var nom = document.getElementById('Nom_Banque').value;

		if (window.confirm("Confirmez-vous la suppression de la banque '"+ nom +"' ?")) {
			var corps = cookie() +"&Page=Facturation/Clients/supprimerBanqueClient.tmpl&ContentType=xml&Client_Id="+ currentClient +"&Banque_Id="+ currentBanque;

			requeteHTTP(corps);

			document.getElementById('bSupprimerBanque').collapsed = true;
			document.getElementById('bModifierBanque').collapsed = true;
			document.getElementById('bCreerBanque').collapsed = false;
			document.getElementById('bNouveauBanque').collapsed = true;
			aBanques.initTree();
			nouveauBanque();
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

		var corps;

		if (mode=="C") {
			corps = cookie() +"&Page=Facturation/Clients/creerBanqueClient.tmpl&ContentType=xml";
		}
		else {
			corps = cookie() +"&Page=Facturation/Clients/modifierBanqueClient.tmpl&ContentType=xml&Banque_Id="+ currentBanque;
		}

		corps += "&Client_Id="+ urlEncode(currentClient) +"&Nom="+ urlEncode(nom) +"&Adresse="+ urlEncode(adresse) + "&BIC="+ bic;
		if (!international) {
		  corps += "&Code_Agence="+ code_agence+ "&Code_Guichet="+ code_guichet +"&Num_Compte="+ num_compte +"&Cle_RIB="+ cle_rib;
		}
		if (international || deb_iban!="") {
		 corps += "&IBAN="+ iban;
    }

		if (isEmpty(nom)) { showWarning("Veuillez spécifier le nom de la banque !"); }
		else if (isEmpty(adresse)) { showWarning("Veuillez spécifier la domiciliation"); }
		else if (!international && isEmpty(code_agence)) { showWarning("Veuillez spécifier le code agence !"); }
		else if (!international && isEmpty(code_guichet)) { showWarning("Veuillez spécifier le code guichet !"); }
		else if (!international && isEmpty(num_compte)) { showWarning("Veuillez spécifier le numéro de compte !"); }
		else if (!international && isEmpty(cle_rib)) { showWarning("Veuillez spécifier la clé de RIB !"); }

		else if (!international && !isCodeAgence(code_agence)) { showWarning("Code agence incorrect !"); }
		else if (!international && !isCodeGuichet(code_guichet)) { showWarning("Code guichet incorrect !"); }
		else if (!international && !isNumCompte(num_compte)) { showWarning("Numéro de compte incorrect !"); }
		else if (!international && !isCleRIB(cle_rib)) { showWarning("Clé de RIB incorrect !"); }
		else if (!international && !isEmpty(deb_iban) && !isPrefIBAN(deb_iban)) { showWarning("IBAN incorrect !"); }
		else if (!international && !isEmpty(bic) && !isBIC(bic)) { showWarning("BIC incorrect !"); }
		else if (!international && !verifCleRIB(cle_rib, fin_iban)) { showWarning("Echec du contrôle de la clé de RIB ! Erreur probable sur Numéro de compte, Code agence ou Code guichet"); }
		else if (!isEmpty(iban) && !verifCleIBAN(deb_iban.substring(2,4), deb_iban, fin_iban)) { showWarning("Echec du contrôle de la clé IBAN ! Erreur probable sur Numéro IBAN, Numéro de compte, Code agence ou Code guichet"); }

		else {
			var p = requeteHTTP(corps);

			if (mode=="C") {
				contenu = p.responseXML.documentElement;

				currentBanque = contenu.getAttribute('Banque_Id');
				document.getElementById('bCreerBanque').collapsed = true;
				document.getElementById('bModifierBanque').collapsed = false;
				document.getElementById('bNouveauBanque').collapsed = false;
				document.getElementById('bSupprimerBanque').collapsed = false;
			}

			aBanques.initTree();
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

function pressOnTreeBanques(ev) {
	try {

		if (ev.keyCode==13) {
    	chargerBanque();
    }

 	} catch (e) {
    recup_erreur(e);
  }
}


function chargerBanque() {
	try {

		var tree = document.getElementById('tree-banques');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var banque_id = getCellValue(tree,tree.currentIndex,'ColNom');
			var corps = cookie() +"&Page=Facturation/Clients/getBanqueClient.tmpl&ContentType=xml&Banque_Id="+ banque_id +"&Client_Id="+ currentClient;

			var p = requeteHTTP(corps);

      var contenu = p.responseXML.documentElement;

			currentBanque = contenu.getAttribute('Banque_Id');
			document.getElementById('Nom_Banque').value = contenu.getAttribute('Nom');
			document.getElementById('Domiciliation').value = contenu.getAttribute('Adresse');
			document.getElementById('Code_Agence').value = contenu.getAttribute('Code_Agence');
			document.getElementById('Code_Guichet').value = contenu.getAttribute('Code_Guichet');
			document.getElementById('Num_Compte').value = contenu.getAttribute('Num_Compte');
			document.getElementById('Cle_RIB').value = contenu.getAttribute('Cle_RIB');
			document.getElementById('IBAN').value = contenu.getAttribute('IBAN');
      document.getElementById('IBAN_Suite').value = contenu.getAttribute('IBAN_Suite');
			document.getElementById('BIC').value = contenu.getAttribute('BIC');
			document.getElementById('bSupprimerBanque').collapsed = false;
			document.getElementById('bModifierBanque').collapsed = false;
			document.getElementById('bNouveauBanque').collapsed = false;
			document.getElementById('bCreerBanque').collapsed = true;
			document.getElementById('international').checked=document.getElementById('Code_Agence').value=="";
      changer_type(document.getElementById('international').checked);

			if (!document.getElementById('international').checked) {
			  makeIBAN();
			}
		}

 	} catch (e) {
    recup_erreur(e);
  }
}

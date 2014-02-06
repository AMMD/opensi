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


var aContacts = new Arbre("Facturation/GetRDF/liste-contactsFournisseur.tmpl", "oc-liste_contacts");
var currentContact;

function initContact() {
	try {

		var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "oc-Code_Pays");
		aPays.initTree(initPays);

		aContacts.setParam("Fournisseur_Id", currentFournisseur);
		aContacts.initTree(nouveauContact);

	} catch (e) {
    recup_erreur(e);
  }
}

function initPays() {
	try {

    document.getElementById('oc-Code_Pays').value = "FR";

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauContact() {
	try {

		// initialisation valeurs par défaut
	  document.getElementById('oc-Civilite').selectedItem = document.getElementById('oc-CiviliteM');
		document.getElementById('oc-Nom').value = "";
		document.getElementById('oc-Prenom').value = "";
		document.getElementById('oc-Fonction').value = "";
		document.getElementById('oc-dateNaissance').value = "";
		document.getElementById('oc-Adresse').value = "";
		document.getElementById('oc-Code_Postal').value = "";
		document.getElementById('oc-Ville').value = "";
		initPays();
		document.getElementById('oc-Tel').value = "";
		document.getElementById('oc-Portable').value = "";
		document.getElementById('oc-Fax').value = "";
		document.getElementById('oc-Email').value = "";
		document.getElementById('oc-Site_Web').value = "";
		document.getElementById('oc-Relation').value = "O";
		document.getElementById('oc-Principal').checked = false;
		document.getElementById('oc-Infos').value = "";

		document.getElementById('bNouveauContact').collapsed = true;
		document.getElementById('bSupprimerContact').collapsed = true;
		document.getElementById('bModifierContact').collapsed = true;
		document.getElementById('bCreerContact').collapsed = false;

	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerContact() {
	try {

		var prenom = document.getElementById('oc-Prenom').value;
		var nom = document.getElementById('oc-Nom').value;

		if (window.confirm("Confirmez-vous la suppression du contact '"+ prenom +" "+ nom +"' ?")) {
			var corps = cookie() + "&Page=Facturation/Fournisseurs/supprimerInterlocuteur.tmpl&ContentType=xml&Fournisseur_Id="+ currentFournisseur +"&Num_Inter="+ currentContact;

			var p = requeteHTTP(corps);

			if (p.responseXML.documentElement.getAttribute("existe")=="true") {
				showWarning("Impossible de supprimer ce contact car il est lié à une adresse.");
			} else {
				document.getElementById('bSupprimerContact').collapsed = true;
				document.getElementById('bModifierContact').collapsed = true;
				document.getElementById('bCreerContact').collapsed = false;
				document.getElementById('bNouveauContact').collapsed = true;
				aContacts.initTree(nouveauContact);
				initAdrCom();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerContact(mode) {
	try {
    var civilite = document.getElementById('oc-Civilite').value;
		var nom = document.getElementById('oc-Nom').value;
		var prenom = document.getElementById('oc-Prenom').value;
		var fonction = document.getElementById('oc-Fonction').value;
		var relation = document.getElementById('oc-Relation').value;
		var infos = document.getElementById('oc-Infos').value;
		var adresse = document.getElementById('oc-Adresse').value;
		var code_postal = document.getElementById('oc-Code_Postal').value;
		var ville = document.getElementById('oc-Ville').value;
		var code_pays = document.getElementById('oc-Code_Pays').value;
		var tel = document.getElementById('oc-Tel').value;
		var portable = document.getElementById('oc-Portable').value;
		var fax = document.getElementById('oc-Fax').value;
		var email = document.getElementById('oc-Email').value;
		var site_web = document.getElementById('oc-Site_Web').value;
		var principal = (document.getElementById('oc-Principal').checked?"1":"0");
		var dateNaissance = document.getElementById('oc-dateNaissance').value;

		var corps;

		if (mode=="C") {
			corps = cookie() + "&Page=Facturation/Fournisseurs/creerInterlocuteur.tmpl&ContentType=xml";
		}
		else {
			corps = cookie() +"&Page=Facturation/Fournisseurs/modifierContact.tmpl&ContentType=xml&Num_Inter="+ currentContact;
		}

		corps += "&Fournisseur_Id="+ urlEncode(currentFournisseur) +"&Nom="+ urlEncode(nom) +"&Prenom="+ urlEncode(prenom) +"&Fonction="+ urlEncode(fonction);
		corps += "&Relation="+ relation +"&Infos="+ urlEncode(infos) +"&Principal="+ principal;
		corps += "&Adresse="+ urlEncode(adresse) +"&Code_Postal="+ urlEncode(code_postal) +"&Ville="+ urlEncode(ville) +"&Code_Pays="+ urlEncode(code_pays) +"&Tel="+ urlEncode(tel);
		corps += "&Portable="+ urlEncode(portable) +"&Fax="+ urlEncode(fax) +"&Email="+ urlEncode(email) +"&Site_Web="+ urlEncode(site_web)+"&Civilite="+ civilite;

		if (isEmpty(nom)) {
			showWarning("Veuillez spécifier le nom du contact !");
		}
		else if (!isEmpty(dateNaissance) && !isDate(dateNaissance)) { showWarning("La date de naissance est invalide !"); }
		else if (!isEmpty(email) && !isEmail(email)) { showWarning("L'adresse e-mail est invalide !"); }
		else if (!isEmpty(tel) && !isPhone(tel)) { showWarning("Le téléphone est invalide !"); }
		else if (!isEmpty(portable) && !isPhone(portable)) { showWarning("Le portable est invalide !"); }
		else if (!isEmpty(fax) && !isPhone(fax)) { showWarning("Le fax est invalide !"); }
		else {
			if (!isEmpty(dateNaissance)) { dateNaissance = prepareDateJava(dateNaissance); }
			corps += "&Date_Naissance="+ urlEncode(dateNaissance);
			var p = requeteHTTP(corps);

			if (mode=="C") {
				contenu = p.responseXML.documentElement;

				currentContact = contenu.getAttribute('Num_Inter');

				document.getElementById('bCreerContact').collapsed = true;
				document.getElementById('bModifierContact').collapsed = false;
				document.getElementById('bNouveauContact').collapsed = false;
				document.getElementById('bSupprimerContact').collapsed = false;
			}

			if (principal==1) {
				defaut_contact = currentContact;
			}

			aContacts.initTree();
			initAdrCom();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnTree(ev) {
	try {

		if (ev.keyCode==13) {
    	chargerContact();
    }

 	} catch (e) {
    recup_erreur(e);
  }
}

function chargerContact() {
	try {

		if (aContacts.isSelected()) {

			currentContact = aContacts.getSelectedCellValue('oc-ColCivilite');

			document.getElementById('oc-Civilite').value = aContacts.getSelectedCellText('oc-ColNum_Civ');
			document.getElementById('oc-Nom').value = aContacts.getSelectedCellText('oc-ColNom');
			document.getElementById('oc-Prenom').value = aContacts.getSelectedCellText('oc-ColPrenom');
			document.getElementById('oc-Fonction').value = aContacts.getSelectedCellText('oc-ColFonction');
			document.getElementById('oc-Relation').value = aContacts.getSelectedCellText('oc-ColRelation');

			document.getElementById('oc-dateNaissance').value = aContacts.getSelectedCellText('oc-ColDate_Naissance');
			document.getElementById('oc-Infos').value = aContacts.getSelectedCellText('oc-ColInfos');
			document.getElementById('oc-Adresse').value = aContacts.getSelectedCellText('oc-ColAdresse');
			document.getElementById('oc-Code_Postal').value = aContacts.getSelectedCellText('oc-ColCode_Postal');
			document.getElementById('oc-Ville').value = aContacts.getSelectedCellText('oc-ColVille');
			document.getElementById('oc-Code_Pays').value = aContacts.getSelectedCellText('oc-ColCode_Pays');
			document.getElementById('oc-Tel').value = aContacts.getSelectedCellText('oc-ColTel');
			document.getElementById('oc-Portable').value = aContacts.getSelectedCellText('oc-ColPortable');
			document.getElementById('oc-Fax').value = aContacts.getSelectedCellText('oc-ColFax');
			document.getElementById('oc-Email').value = aContacts.getSelectedCellText('oc-ColEmail');
			document.getElementById('oc-Site_Web').value = aContacts.getSelectedCellText('oc-ColSite_Web');
			document.getElementById('oc-Principal').checked = (aContacts.getSelectedCellText('oc-ColPrincipal')=="1");

      document.getElementById('bSupprimerContact').collapsed = false;
			document.getElementById('bModifierContact').collapsed = false;
			document.getElementById('bNouveauContact').collapsed = false;
			document.getElementById('bCreerContact').collapsed = true;
		}

 	} catch (e) {
    recup_erreur(e);
  }
}

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

var currentContact=-1;
var currentFournisseur;

var aContacts = new Arbre("Facturation/GetRDF/liste-contactsFournisseur.tmpl", "tree-contacts");

function init() {
  try {
		window.resizeTo(1000,400);
		currentFournisseur=ParamValeur("Fournisseur_Id");
		aContacts.setParam("Fournisseur_Id", ParamValeur("Fournisseur_Id"));
		aContacts.initTree();
		var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays");
		aPays.initTree(initPays);
		nouveauContact();
  } catch (e) {
    recup_erreur(e);
  }
}

function initPays() {
	try {

    document.getElementById('Code_Pays').value = "FR";

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauContact() {
	try {

		var tree = document.getElementById('tree-contacts');
		if (tree.view!=null) {
			tree.view.selection.select(-1);
		}

		currentContact=-1;

		// initialisation valeurs par défaut
	  document.getElementById('Civilite').value = "1";
		document.getElementById('Nom').value = "";
		document.getElementById('Prenom').value = "";
		document.getElementById('Fonction').value = "";
		document.getElementById('dateNaissance').value = "";
		document.getElementById('Adresse').value = "";
		document.getElementById('Code_Postal').value = "";
		document.getElementById('Ville').value = "";
		initPays();
		document.getElementById('Tel').value = "";
		document.getElementById('Portable').value = "";
		document.getElementById('Fax').value = "";
		document.getElementById('Email').value = "";
		document.getElementById('Site_Web').value = "";
		document.getElementById('Relation').value = "0";
		document.getElementById('Principal').checked = false;
		document.getElementById('Infos').value = "";

		document.getElementById('bNouveauContact').collapsed = true;
		document.getElementById('bSupprimerContact').collapsed = true;
		document.getElementById('bModifierContact').collapsed = true;
		document.getElementById('bCreerContact').collapsed = false;
		mode="C";

	} catch (e) {
    recup_erreur(e);
  }
}

function changergroupbox(check) {
	try {
		window.resizeTo(1000,check?800:400);
		document.getElementById('Group_Contact').collapsed=!check;


	} catch (e) {
    recup_erreur(e);
  }
}

function chargerContact() {
	try {

		if (aContacts.isSelected()) {
			mode="M";

			currentContact = aContacts.getSelectedCellValue('ColCiv');
			document.getElementById('Nom').value = aContacts.getSelectedCellText('ColNom');
			document.getElementById('Prenom').value = aContacts.getSelectedCellText('ColPrenom');
			document.getElementById('Fonction').value = aContacts.getSelectedCellText('ColFonction');
			document.getElementById('Relation').value = aContacts.getSelectedCellText('ColRelation');
			document.getElementById('dateNaissance').value = aContacts.getSelectedCellText('ColDate_Naissance');
			document.getElementById('Infos').value = aContacts.getSelectedCellText('ColInfos');
			document.getElementById('Adresse').value = aContacts.getSelectedCellText('ColAdresse');
			document.getElementById('Code_Postal').value = aContacts.getSelectedCellText('ColCode_Postal');
			document.getElementById('Ville').value = aContacts.getSelectedCellText('ColVille');
			document.getElementById('Code_Pays').value = aContacts.getSelectedCellText('ColCode_Pays');
			document.getElementById('Tel').value = aContacts.getSelectedCellText('ColTel');
			document.getElementById('Portable').value = aContacts.getSelectedCellText('ColPortable');
			document.getElementById('Fax').value = aContacts.getSelectedCellText('ColFax');
			document.getElementById('Email').value = aContacts.getSelectedCellText('ColEmail');
			document.getElementById('Site_Web').value = aContacts.getSelectedCellText('ColSite_Web');

			document.getElementById('Principal').checked = (aContacts.getSelectedCellText('ColPrincipal')=="1");

			var civ = aContacts.getSelectedCellText('ColNum_Civ');
			document.getElementById("Civilite").value = (civ=="0"?"1":civ);

			document.getElementById('bSupprimerContact').collapsed = false;
			document.getElementById('bModifierContact').collapsed = false;
			document.getElementById('bNouveauContact').collapsed = false;
			document.getElementById('bCreerContact').collapsed = true;
  	}

 	} catch (e) {
    recup_erreur(e);
  }
}


function supprimerContact() {
	try {

		var prenom = document.getElementById('Prenom').value;
		var nom = document.getElementById('Nom').value;

		if (window.confirm("Confirmez-vous la suppression du contact '"+ prenom +" "+ nom +"' ?")) {
			var corps = cookie() +"&Page=Facturation/Fournisseurs/supprimerInterlocuteur.tmpl&ContentType=xml&Num_Inter="+ currentContact;
			var p = requeteHTTP(corps);
			if (p.responseXML.documentElement.getAttribute("existe")=="true") {
				showWarning("Impossible de supprimer ce contact car il est lié à une adresse.");
			} else {
				document.getElementById('bSupprimerContact').collapsed = true;
				document.getElementById('bModifierContact').collapsed = true;
				document.getElementById('bCreerContact').collapsed = false;
				document.getElementById('bNouveauContact').collapsed = true;
				aContacts.initTree();
				nouveauContact();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerContact(mode) {
	try {
    var civilite = document.getElementById('Civilite').value;
		var nom = document.getElementById('Nom').value;
		var prenom = document.getElementById('Prenom').value;
		var fonction = document.getElementById('Fonction').value;
		var relation = document.getElementById('Relation').value;
		var infos = document.getElementById('Infos').value;
		var adresse = document.getElementById('Adresse').value;
		var code_postal = document.getElementById('Code_Postal').value;
		var ville = document.getElementById('Ville').value;
		var code_pays = document.getElementById('Code_Pays').value;
		var tel = document.getElementById('Tel').value;
		var portable = document.getElementById('Portable').value;
		var fax = document.getElementById('Fax').value;
		var email = document.getElementById('Email').value;
		var site_web = document.getElementById('Site_Web').value;
		var principal = (document.getElementById('Principal').checked?"1":"0");
		var dateNaissance = document.getElementById('dateNaissance').value;

		var corps;

		if (mode=="C") {
			corps = cookie() +"&Page=Facturation/Fournisseurs/creerInterlocuteur.tmpl&ContentType=xml";
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
		else if (!isEmpty(tel) && !isPhone(tel)) { showWarning("Le numéro de téléphone est invalide !"); }
		else if (!isEmpty(portable) && !isPhone(portable)) { showWarning("Le numéro de portable est invalide !"); }
		else if (!isEmpty(fax) && !isPhone(fax)) { showWarning("Le numéro de fax est invalide !"); }
		else if (!isEmpty(email) && !isEmail(email)) { showWarning("L'adresse e-mail est invalide !"); }
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

			aContacts.initTree(scrollToNum);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function scrollToNum() {
	try {
		var tree = document.getElementById("tree-contacts");

		if (tree.view!=null && tree.view.rowCount>0 && currentContact>-1) {

			var tb = document.getElementById("tree-contacts").treeBoxObject;
			var i = 0;
			var trouve = false;

			while (!trouve && i<tree.view.rowCount) {
				if (parseIntBis(getCellValue(tree,i,'ColCiv'))==currentContact) {
					tb.ensureRowIsVisible(i);
					document.getElementById("tree-contacts").view.selection.select(i);
					trouve = true;
				}

				i++;
			}
			if (!trouve) tb.ensureRowIsVisible(tree.view.rowCount-1);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function ouvrirInter() {
  try {

		if (currentContact!=-1) {

			var civ = aContacts.getSelectedCellText('ColNum_Civ');
			var civ_courte = aContacts.getSelectedCellText('ColCiv');
			var nom = aContacts.getSelectedCellText('ColNom');
			var prenom = aContacts.getSelectedCellText('ColPrenom');
			var tel = aContacts.getSelectedCellText('ColTel');
			var fax = aContacts.getSelectedCellText('ColFax');
			var email = aContacts.getSelectedCellText('ColEmail');

			window.arguments[0](civ, civ_courte, nom, prenom, tel, fax, email);

    	window.close();
		} else {
			showWarning("Veuillez sélectionner un contact !");
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnTree(ev) {
  try {

    if (ev.keyCode==13) {
    	ouvrirInter();
    }

  } catch (e) {
    recup_erreur(e);
  }
}

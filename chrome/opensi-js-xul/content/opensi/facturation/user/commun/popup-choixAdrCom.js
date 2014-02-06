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

var aAdresses = new Arbre("Facturation/GetRDF/liste-adresses-commande.tmpl", "tree-adresses");
var aContacts = new Arbre("Facturation/GetRDF/liste-contactsFournisseur.tmpl", "Contact");
var currentFournisseur;
var currentAdr = -1;
var defaut_contact = "";

function init() {
  try {
  	window.resizeTo(1000,400);
  	currentFournisseur=ParamValeur("Fournisseur_Id");

  	var qContactFournisseur = new QueryHttp("Facturation/Fournisseurs/getFournisseur.tmpl");
  	qContactFournisseur.setParam("Fournisseur_Id",currentFournisseur);
  	var p = qContactFournisseur.execute();
  	defaut_contact = p.responseXML.documentElement.getAttribute('Contact');

  	var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays");
		aPays.initTree(initPays);

  	aContacts.setParam("Fournisseur_Id", currentFournisseur);
		aContacts.initTree(initContact);

		aAdresses.setParam("Fournisseur_Id", currentFournisseur);
		aAdresses.initTree(nouveauAdr);

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


function initContact() {
	try {

    document.getElementById('Contact').value = defaut_contact;

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauAdr() {
	try {

		var tree = document.getElementById('tree-adresses');
		if (tree.view!=null) {
			tree.view.selection.select(-1);
		}
		currentAdr=-1;

		// initialisation valeurs par défaut
		document.getElementById('Denomination').value = "";
		document.getElementById('Adresse_1').value = "";
		document.getElementById('Adresse_2').value = "";
		document.getElementById('Adresse_3').value = "";
		document.getElementById('Code_Postal').value = "";
		document.getElementById('Ville').value = "";
		initPays();
		document.getElementById('Defaut').checked = false;
		document.getElementById('Defaut').disabled = false;
		initContact();

		document.getElementById('bNouveauAdr').collapsed = true;
		document.getElementById('bSupprimerAdr').collapsed = true;
		document.getElementById('bModifierAdr').collapsed = true;
		document.getElementById('bCreerAdr').collapsed = false;

	} catch (e) {
    recup_erreur(e);
  }
}

function supprimerAdr() {
	try {

		if (!document.getElementById('Defaut').disabled) {

			var denomination = document.getElementById('Denomination').value;

			if (window.confirm("Confirmez-vous la suppression de l'adresse '"+ denomination +"' ?")) {
				var corps = cookie() +"&Page=Facturation/Fournisseurs/supprimerAdrCom.tmpl&ContentType=xml&Fournisseur_Id="+ currentFournisseur +"&Num_Adresse="+ currentAdr;

				requeteHTTP(corps);

				document.getElementById('bSupprimerAdr').collapsed = true;
				document.getElementById('bModifierAdr').collapsed = true;
				document.getElementById('bCreerAdr').collapsed = false;
				document.getElementById('bNouveauAdr').collapsed = true;
				aAdresses.initTree();
				nouveauAdr();
			}
		}
		else {
			showWarning("Impossible de supprimer l'adresse car elle est utilisée par défaut !");
		}

  } catch (e) {
  	recup_erreur(e);
  }
}


function chargerAdr() {
	try {

		if (aAdresses.isSelected()) {

			currentAdr = aAdresses.getSelectedCellValue('ColDenomination');

			document.getElementById('Denomination').value = aAdresses.getSelectedCellText('ColDenomination');
			document.getElementById('Adresse_1').value = aAdresses.getSelectedCellText('ColAdresse_1');
			document.getElementById('Adresse_2').value = aAdresses.getSelectedCellText('ColAdresse_2');
			document.getElementById('Adresse_3').value = aAdresses.getSelectedCellText('ColAdresse_3');
			document.getElementById('Code_Postal').value = aAdresses.getSelectedCellText('ColCode_Postal');
			document.getElementById('Ville').value = aAdresses.getSelectedCellText('ColVille');
			document.getElementById('Code_Pays').value = aAdresses.getSelectedCellText('ColCode_Pays');
			document.getElementById('Defaut').checked = (aAdresses.getSelectedCellText('ColDefaut')==1);

			document.getElementById('Defaut').disabled = document.getElementById('Defaut').checked;

			document.getElementById('Contact').value = aAdresses.getSelectedCellText('ColContact');

			document.getElementById('bSupprimerAdr').collapsed = false;
			document.getElementById('bModifierAdr').collapsed = false;
			document.getElementById('bNouveauAdr').collapsed = false;
			document.getElementById('bCreerAdr').collapsed = true;
		}

 	} catch (e) {
    recup_erreur(e);
  }
}


function changergroupbox(check) {
	try {
		window.resizeTo(1000,check?800:400);
		document.getElementById('Group_Adresse').collapsed=!check;
	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirAdresse() {
  try {

		if (currentAdr!=-1) {

			var nom = aAdresses.getSelectedCellText('ColDenomination');
   		var adr1 = aAdresses.getSelectedCellText('ColAdresse_1');
			var adr2 = aAdresses.getSelectedCellText('ColAdresse_2');
			var adr3 = aAdresses.getSelectedCellText('ColAdresse_3');
			var cp = aAdresses.getSelectedCellText('ColCode_Postal');
			var ville = aAdresses.getSelectedCellText('ColVille');
			var pays = aAdresses.getSelectedCellText('ColPays');
			var code_pays = aAdresses.getSelectedCellText('ColCode_Pays');
			var contact = aAdresses.getSelectedCellText('ColContact');

			window.arguments[0](nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact);

    	window.close();
		} else {
			showWarning("Veuillez sélectionner une adresse !");
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnTree(ev) {
  try {

    if (ev.keyCode==13) {
    	ouvrirAdresse();
    }

  } catch (e) {
    recup_erreur(e);
  }
}

function enregistrerAdr(mode) {
  try {

    var denomination = document.getElementById('Denomination').value;
		var adresse_1 = document.getElementById('Adresse_1').value;
		var adresse_2 = document.getElementById('Adresse_2').value;
		var adresse_3 = document.getElementById('Adresse_3').value;
		var code_postal = document.getElementById('Code_Postal').value;
		var ville = document.getElementById('Ville').value;
		var code_pays = document.getElementById('Code_Pays').value;
		var defaut = (document.getElementById('Defaut').checked?"1":"0");
		var contact = (document.getElementById('Contact').selectedIndex==0?"":document.getElementById('Contact').value);

		if (isEmpty(denomination)) { showWarning("Veuillez spécifier la raison sociale de l'entreprise !"); }
		else if (isEmpty(adresse_1)) { showWarning("Veuillez spécifier l'adresse !"); }
		else if (isEmpty(ville)) { showWarning("Veuillez spécifier la ville !"); }
		else {

			var corps;

			if (mode=="C") {
				corps = cookie() +"&Page=Facturation/Fournisseurs/creerAdrCom.tmpl&ContentType=xml";
			}
			else {
				corps = cookie() +"&Page=Facturation/Fournisseurs/modifierAdrCom.tmpl&ContentType=xml&Num_Adresse="+ currentAdr;
			}

			corps += "&Fournisseur_Id="+ urlEncode(currentFournisseur) +"&Denomination="+ urlEncode(denomination) +"&Adresse="+ urlEncode(adresse_1);
			corps += "&Comp_Adresse="+ urlEncode(adresse_2)+ "&Adresse_3="+ urlEncode(adresse_3) +"&Code_Postal="+ urlEncode(code_postal) +"&Ville="+ urlEncode(ville) +"&Code_Pays="+ urlEncode(code_pays);
			corps += "&Defaut="+ defaut +"&Contact="+ contact;

			var p = requeteHTTP(corps);

			document.getElementById('Defaut').disabled = (defaut==1);

			if (mode=="C") {
				currentAdr = p.responseXML.documentElement.getAttribute('Num_Adresse');

				document.getElementById('bCreerAdr').collapsed = true;
				document.getElementById('bModifierAdr').collapsed = false;
				document.getElementById('bNouveauAdr').collapsed = false;
				document.getElementById('bSupprimerAdr').collapsed = false;
			}

			aAdresses.initTree(scrollToNum);
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function scrollToNum() {
	try {
		var tree = document.getElementById("tree-adresses");

		if (tree.view!=null && tree.view.rowCount>0 && currentAdr>-1) {

			var tb = document.getElementById("tree-adresses").treeBoxObject;
			var i = 0;
			var trouve = false;

			while (!trouve && i<tree.view.rowCount) {
				if (parseIntBis(getCellValue(tree,i,'ColDenomination'))==currentAdr) {
					tb.ensureRowIsVisible(i);
					document.getElementById("tree-adresses").view.selection.select(i);
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

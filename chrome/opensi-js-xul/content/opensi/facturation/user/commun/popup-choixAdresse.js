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

var aAdresses = new Arbre("Facturation/GetRDF/adresses_client.tmpl", "tree-adresses");
var aContactsFact = new Arbre("Facturation/GetRDF/liste-contactsClient.tmpl", "Contact_Fact");
var aContactsLiv = new Arbre("Facturation/GetRDF/liste-contactsClient.tmpl", "Contact_Liv");
var aContactsEnvoi = new Arbre("Facturation/GetRDF/liste-contactsClient.tmpl", "Contact_Envoi");
var currentClient;
var currentAdr = -1;
var defaut_contact_fact = "";
var defaut_contact_liv = "";
var defaut_contact_envoi = "";

function init() {
  try {
  	window.resizeTo(1000,400);
  	currentClient=ParamValeur("Client_Id");

  	var qContactClient = new QueryHttp("Facturation/Clients/getClient.tmpl");
  	qContactClient.setParam("Client_Id",currentClient);
  	var p = qContactClient.execute();
  	defaut_contact_fact = p.responseXML.documentElement.getAttribute('Contact_Fact');
  	defaut_contact_liv = p.responseXML.documentElement.getAttribute('Contact_Liv');
  	defaut_contact_envoi = p.responseXML.documentElement.getAttribute('Contact_Envoi');

  	aContactsFact.setParam("Client_Id", currentClient);
		aContactsFact.initTree(initContactFact);

		aContactsLiv.setParam("Client_Id", currentClient);
		aContactsLiv.initTree(initContactLiv);
		
		aContactsEnvoi.setParam("Client_Id", currentClient);
		aContactsEnvoi.initTree(initContactEnvoi);

		aAdresses.setParam("Client_Id", ParamValeur("Client_Id"));
		aAdresses.initTree();
		var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays");
		aPays.initTree(initPays);
		nouveauAdr();
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


function initContactFact() {
	try {

    document.getElementById('Contact_Fact').value = defaut_contact_fact;

	} catch (e) {
    recup_erreur(e);
  }
}

function initContactLiv() {
	try {

    document.getElementById('Contact_Liv').value = defaut_contact_liv;

	} catch (e) {
    recup_erreur(e);
  }
}

function initContactEnvoi() {
	try {

    document.getElementById('Contact_Envoi').value = defaut_contact_envoi;

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
		document.getElementById('Defaut_Fact').checked = false;
		document.getElementById('Defaut_Liv').checked = false;
		document.getElementById('Defaut_Envoi').checked = false;
		document.getElementById('Defaut_Fact').disabled = false;
		document.getElementById('Defaut_Liv').disabled = false;
		document.getElementById('Defaut_Envoi').disabled = false;
		initContactFact();
		initContactLiv();
		initContactEnvoi();

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

		if (!document.getElementById('Defaut_Fact').disabled && !document.getElementById('Defaut_Liv').disabled && !document.getElementById('Defaut_Envoi').disabled) {

			var denomination = document.getElementById('Denomination').value;

			if (window.confirm("Confirmez-vous la suppression de l'adresse '"+ denomination +"' ?")) {
				var corps = cookie() +"&Page=Facturation/Clients/supprimerAdresse.tmpl&ContentType=xml&Client_Id="+ currentClient +"&Adresse_Id="+ currentAdr;

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
			document.getElementById('Defaut_Fact').checked = (aAdresses.getSelectedCellText('ColDefaut_Fact')==1);
			document.getElementById('Defaut_Liv').checked = (aAdresses.getSelectedCellText('ColDefaut_Liv')==1);
			document.getElementById('Defaut_Envoi').checked = (aAdresses.getSelectedCellText('ColDefaut_Envoi')==1);

			document.getElementById('Defaut_Fact').disabled = document.getElementById('Defaut_Fact').checked;
			document.getElementById('Defaut_Liv').disabled = document.getElementById('Defaut_Liv').checked;
			document.getElementById('Defaut_Envoi').disabled = document.getElementById('Defaut_Envoi').checked;
			
			if (aAdresses.getSelectedCellText('ColLib_Contact_Fact') != "") {
				document.getElementById('Contact_Fact').value = aAdresses.getSelectedCellText('ColContact_Fact');
			} else {
				document.getElementById('Contact_Fact').selectedIndex = 0;
			}

			if (aAdresses.getSelectedCellText('ColLib_Contact_Liv') != "") {
				document.getElementById('Contact_Liv').value = aAdresses.getSelectedCellText('ColContact_Liv');
			} else {
				document.getElementById('Contact_Liv').selectedIndex = 0;
			}
			
			if (aAdresses.getSelectedCellText('ColLib_Contact_Envoi') != "") {
				document.getElementById('Contact_Envoi').value = aAdresses.getSelectedCellText('ColContact_Envoi');
			} else {
				document.getElementById('Contact_Envoi').selectedIndex = 0;
			}

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
			var contact_fact = aAdresses.getSelectedCellText('ColContact_Fact');
			var contact_liv = aAdresses.getSelectedCellText('ColContact_Liv');
			var contact_envoi = aAdresses.getSelectedCellText('ColContact_Envoi');

			window.arguments[0](nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact_fact, contact_liv, contact_envoi);

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
		var defaut_fact = (document.getElementById('Defaut_Fact').checked?"1":"0");
		var defaut_liv = (document.getElementById('Defaut_Liv').checked?"1":"0");
		var defaut_envoi = (document.getElementById('Defaut_Envoi').checked?"1":"0");
		var contact_fact = (document.getElementById('Contact_Fact').selectedIndex==0?"":document.getElementById('Contact_Fact').value);
		var contact_liv = (document.getElementById('Contact_Liv').selectedIndex==0?"":document.getElementById('Contact_Liv').value);
		var contact_envoi = (document.getElementById('Contact_Envoi').selectedIndex==0?"":document.getElementById('Contact_Envoi').value);

		if (isEmpty(denomination)) { showWarning("Veuillez spécifier la raison sociale de l'entreprise !"); }
		else if (isEmpty(adresse_1)) { showWarning("Veuillez spécifier l'adresse !"); }
		else if (isEmpty(ville)) { showWarning("Veuillez spécifier la ville !"); }
		else {

			var corps;

			if (mode=="C") {
				corps = cookie() +"&Page=Facturation/Clients/creerAdresse.tmpl&ContentType=xml";
			}
			else {
				corps = cookie() +"&Page=Facturation/Clients/modifierAdresse.tmpl&ContentType=xml&Adresse_Id="+ currentAdr;
			}

			corps += "&Client_Id="+ urlEncode(currentClient) +"&Denomination="+ urlEncode(denomination) +"&Adresse_1="+ urlEncode(adresse_1);
			corps += "&Adresse_2="+ urlEncode(adresse_2)+ "&Adresse_3="+ urlEncode(adresse_3) +"&Code_Postal="+ urlEncode(code_postal) +"&Ville="+ urlEncode(ville) +"&Code_Pays="+ urlEncode(code_pays);
			corps += "&Defaut_Fact="+ defaut_fact + "&Defaut_Liv="+ defaut_liv + "&Defaut_Envoi="+ defaut_envoi +"&Contact_Fact="+ contact_fact +"&Contact_Liv="+ contact_liv +"&Contact_Envoi="+ contact_envoi;

			var p = requeteHTTP(corps);

			document.getElementById('Defaut_Fact').disabled = (defaut_fact==1);
			document.getElementById('Defaut_Liv').disabled = (defaut_liv==1);
			document.getElementById('Defaut_Envoi').disabled = (defaut_envoi==1);

			if (mode=="C") {
				currentAdr = p.responseXML.documentElement.getAttribute('Adresse_Id');

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

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

var currentAdr;
var aAdresses = new Arbre("Facturation/GetRDF/adresses_client.tmpl", "tree-adresses");
var aContactsFact = new Arbre("Facturation/GetRDF/liste-contactsClient.tmpl", "oa-Contact_Fact");
var aContactsLiv = new Arbre("Facturation/GetRDF/liste-contactsClient.tmpl", "oa-Contact_Liv");
var aContactsEnvoi = new Arbre("Facturation/GetRDF/liste-contactsClient.tmpl", "oa-Contact_Envoi");

function initAdr() {
	try {

		var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "oa-Code_Pays");
		aPays.initTree(initPaysAdr);

		aContactsFact.setParam("Client_Id", currentClient);
		aContactsFact.initTree(initContactFact);

		aContactsLiv.setParam("Client_Id", currentClient);
		aContactsLiv.initTree(initContactLiv);
		
		aContactsEnvoi.setParam("Client_Id", currentClient);
		aContactsEnvoi.initTree(initContactEnvoi);

		aAdresses.setParam("Client_Id", currentClient);
		aAdresses.initTree();
  	nouveauAdr();

  } catch (e) {
    recup_erreur(e);
  }
}

function initPaysAdr() {
	try {

    document.getElementById('oa-Code_Pays').value = "FR";

	} catch (e) {
    recup_erreur(e);
  }
}

function initContactFact() {
	try {

    document.getElementById('oa-Contact_Fact').value = defaut_contact_fact;

	} catch (e) {
    recup_erreur(e);
  }
}

function initContactLiv() {
	try {

    document.getElementById('oa-Contact_Liv').value = defaut_contact_liv;

	} catch (e) {
    recup_erreur(e);
  }
}

function initContactEnvoi() {
	try {

    document.getElementById('oa-Contact_Envoi').value = defaut_contact_envoi;

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauAdr() {
	try {

		// initialisation valeurs par défaut
		document.getElementById('oa-Denomination').value = "";
		document.getElementById('oa-Adresse_1').value = "";
		document.getElementById('oa-Adresse_2').value = "";
		document.getElementById('oa-Adresse_3').value = "";
		document.getElementById('oa-Code_Postal').value = "";
		document.getElementById('oa-Ville').value = "";
		initPaysAdr();
		document.getElementById('oa-Defaut_Fact').checked = false;
		document.getElementById('oa-Defaut_Liv').checked = false;
		document.getElementById('oa-Defaut_Envoi').checked = false;
		document.getElementById('oa-Defaut_Fact').disabled = false;
		document.getElementById('oa-Defaut_Liv').disabled = false;
		document.getElementById('oa-Defaut_Envoi').disabled = false;
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


function pressOnTreeAdresses(e) {
	try {

		if (e.keyCode==13){
    	chargerAdr();
    }

 	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerAdr(mode) {
  try {

    var denomination = document.getElementById('oa-Denomination').value;
		var adresse_1 = document.getElementById('oa-Adresse_1').value;
		var adresse_2 = document.getElementById('oa-Adresse_2').value;
		var adresse_3 = document.getElementById('oa-Adresse_3').value;
		var code_postal = document.getElementById('oa-Code_Postal').value;
		var ville = document.getElementById('oa-Ville').value;
		var code_pays = document.getElementById('oa-Code_Pays').value;
		var defaut_fact = (document.getElementById('oa-Defaut_Fact').checked?"1":"0");
		var defaut_liv = (document.getElementById('oa-Defaut_Liv').checked?"1":"0");
		var defaut_envoi = (document.getElementById('oa-Defaut_Envoi').checked?"1":"0");
		var contact_fact = (document.getElementById('oa-Contact_Fact').selectedIndex==0?"":document.getElementById('oa-Contact_Fact').value);
		var contact_liv = (document.getElementById('oa-Contact_Liv').selectedIndex==0?"":document.getElementById('oa-Contact_Liv').value);
		var contact_envoi = (document.getElementById('oa-Contact_Envoi').selectedIndex==0?"":document.getElementById('oa-Contact_Envoi').value);

		if (isEmpty(denomination)) { showWarning("Veuillez spécifier la dénomination de l'entreprise !"); }
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

			corps += "&Client_Id="+ urlEncode(currentClient) +"&Denomination="+ urlEncode(denomination);
			corps += "&Adresse_1="+ urlEncode(adresse_1) +"&Adresse_2="+ urlEncode(adresse_2) + "&Adresse_3="+ urlEncode(adresse_3);
			corps += "&Code_Postal="+ urlEncode(code_postal) +"&Ville="+ urlEncode(ville) +"&Code_Pays="+ urlEncode(code_pays);
			corps += "&Defaut_Fact="+ defaut_fact +"&Defaut_Liv="+ defaut_liv +"&Defaut_Envoi="+ defaut_envoi +"&Contact_Fact="+ contact_fact +"&Contact_Liv="+ contact_liv +"&Contact_Envoi="+ contact_envoi;

			var p = requeteHTTP(corps);

			document.getElementById('oa-Defaut_Fact').disabled = (defaut_fact==1);
			document.getElementById('oa-Defaut_Liv').disabled = (defaut_liv==1);
			document.getElementById('oa-Defaut_Envoi').disabled = (defaut_envoi==1);

			if (mode=="C") {

				currentAdr = p.responseXML.documentElement.getAttribute('Adresse_Id');

				document.getElementById('bCreerAdr').collapsed = true;
				document.getElementById('bModifierAdr').collapsed = false;
				document.getElementById('bNouveauAdr').collapsed = false;
				document.getElementById('bSupprimerAdr').collapsed = false;
			}

			aAdresses.initTree();
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function supprimerAdr() {
	try {

		if (!document.getElementById('oa-Defaut_Fact').disabled && !document.getElementById('oa-Defaut_Liv').disabled && !document.getElementById('oa-Defaut_Envoi').disabled) {

			var denomination = document.getElementById('oa-Denomination').value;

			if (window.confirm("Confirmez-vous la suppression de l'adresse '"+ denomination +"' ?")) {
				var corps = cookie() +"&Page=Facturation/Clients/supprimerAdresse.tmpl&ContentType=xml&Client_Id="+ currentClient +"&Adresse_Id="+ currentAdr;

				var p = requeteHTTP(corps);

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

			currentAdr = aAdresses.getSelectedCellValue('oa-ColDenomination');

			document.getElementById('oa-Denomination').value = aAdresses.getSelectedCellText('oa-ColDenomination');
			document.getElementById('oa-Adresse_1').value = aAdresses.getSelectedCellText('oa-ColAdresse_1');
			document.getElementById('oa-Adresse_2').value = aAdresses.getSelectedCellText('oa-ColAdresse_2');
			document.getElementById('oa-Adresse_3').value = aAdresses.getSelectedCellText('oa-ColAdresse_3');
			document.getElementById('oa-Code_Postal').value = aAdresses.getSelectedCellText('oa-ColCode_Postal');
			document.getElementById('oa-Ville').value = aAdresses.getSelectedCellText('oa-ColVille');
			document.getElementById('oa-Code_Pays').value = aAdresses.getSelectedCellText('oa-ColCode_Pays');
			document.getElementById('oa-Defaut_Fact').checked = (aAdresses.getSelectedCellText('oa-ColDefaut_Fact')==1);
			document.getElementById('oa-Defaut_Liv').checked = (aAdresses.getSelectedCellText('oa-ColDefaut_Liv')==1);
			document.getElementById('oa-Defaut_Envoi').checked = (aAdresses.getSelectedCellText('oa-ColDefaut_Envoi')==1);

			document.getElementById('oa-Defaut_Fact').disabled = document.getElementById('oa-Defaut_Fact').checked;
			document.getElementById('oa-Defaut_Liv').disabled = document.getElementById('oa-Defaut_Liv').checked;
			document.getElementById('oa-Defaut_Envoi').disabled = document.getElementById('oa-Defaut_Envoi').checked;

			if (aAdresses.getSelectedCellText('oa-ColLib_Contact_Fact') != "") {
				document.getElementById('oa-Contact_Fact').value = aAdresses.getSelectedCellText('oa-ColContact_Fact');
			} else {
				document.getElementById('oa-Contact_Fact').selectedIndex = 0;
			}

			if (aAdresses.getSelectedCellText('oa-ColLib_Contact_Liv') != "") {
				document.getElementById('oa-Contact_Liv').value = aAdresses.getSelectedCellText('oa-ColContact_Liv');
			} else {
				document.getElementById('oa-Contact_Liv').selectedIndex = 0;
			}
			
			if (aAdresses.getSelectedCellText('oa-ColLib_Contact_Envoi') != "") {
				document.getElementById('oa-Contact_Envoi').value = aAdresses.getSelectedCellText('oa-ColContact_Envoi');
			} else {
				document.getElementById('oa-Contact_Envoi').selectedIndex = 0;
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


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


var currentAdrCom;
var aAdrCom = new Arbre("Facturation/GetRDF/liste-adresses-commande.tmpl", "tree-adrcom");
var aContactsAdr = new Arbre("Facturation/GetRDF/liste-contactsFournisseur.tmpl", "oac-Contact");

function initAdrCom() {
	try {

		var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "oac-Code_Pays");
		aPays.initTree(initPaysCom);

		aContactsAdr.setParam("Fournisseur_Id", currentFournisseur);
		aContactsAdr.initTree(initContactAdr);

		aAdrCom.setParam("Fournisseur_Id", currentFournisseur);
		aAdrCom.initTree();
  	nouveauAdrCom();

  } catch (e) {
    recup_erreur(e);
  }
}

function initPaysCom() {
	try {

    document.getElementById('oac-Code_Pays').value = "FR";

	} catch (e) {
    recup_erreur(e);
  }
}

function initContactAdr() {
	try {
    document.getElementById('oac-Contact').value = defaut_contact;

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauAdrCom() {
	try {

		// initialisation valeurs par défaut
		document.getElementById('oac-Denomination').value = "";
		document.getElementById('oac-Adresse').value = "";
		document.getElementById('oac-Comp_Adresse').value = "";
		document.getElementById('oac-Adresse_3').value = "";
		document.getElementById('oac-Code_Postal').value = "";
		document.getElementById('oac-Ville').value = "";
		initPaysCom();
		document.getElementById('oac-Defaut').checked = false;
		document.getElementById('oac-Defaut').disabled = false;
		initContactAdr();

		document.getElementById('bNouveauAdrCom').collapsed = true;
		document.getElementById('bSupprimerAdrCom').collapsed = true;
		document.getElementById('bModifierAdrCom').collapsed = true;
		document.getElementById('bCreerAdrCom').collapsed = false;

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnTreeAdrCom(e) {
	try {

		if (e.keyCode==13){
    	chargerAdrCom();
    }

 	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerAdrCom(mode) {
  try {

    var raison_sociale = document.getElementById('oac-Denomination').value;
		var adresse = document.getElementById('oac-Adresse').value;
		var comp_adresse = document.getElementById('oac-Comp_Adresse').value;
		var adresse_3 = document.getElementById('oac-Adresse_3').value;
		var code_postal = document.getElementById('oac-Code_Postal').value;
		var ville = document.getElementById('oac-Ville').value;
		var code_pays = document.getElementById('oac-Code_Pays').value;
		var defaut = (document.getElementById('oac-Defaut').checked?"1":"0");
		var contact = (document.getElementById('oac-Contact').selectedIndex==0?"":document.getElementById('oac-Contact').value);

		var corps;

		if (mode=="C") {
			corps = cookie() +"&Page=Facturation/Fournisseurs/creerAdrCom.tmpl&ContentType=xml";
		}
		else {
			corps = cookie() +"&Page=Facturation/Fournisseurs/modifierAdrCom.tmpl&ContentType=xml&Num_Adresse="+ currentAdrCom;
		}

		corps += "&Fournisseur_Id="+ urlEncode(currentFournisseur) +"&Denomination="+ urlEncode(raison_sociale) +"&Comp_Adresse="+ urlEncode(comp_adresse);
		corps += "&Adresse="+ urlEncode(adresse) +"&Code_Postal="+ urlEncode(code_postal) +"&Ville="+ urlEncode(ville) +"&Code_Pays="+ urlEncode(code_pays) +"&Defaut="+ defaut;
		corps += "&Adresse_3="+ urlEncode(adresse_3) +"&Contact="+ contact;

				 if (isEmpty(raison_sociale)) { showWarning("Veuillez spécifier la raison sociale de l'entreprise à livrer !"); }
		else if (isEmpty(adresse)) { showWarning("Veuillez spécifier l'adresse de livraison !"); }
		else if (isEmpty(code_postal)) { showWarning("Veuillez spécifier le code postal de livraison !"); }
		else if (isEmpty(ville)) { showWarning("Veuillez spécifier la ville de livraison !"); }

		else {
			var p = requeteHTTP(corps);

			if (mode=="C") {
				contenu = p.responseXML.documentElement;

				currentAdrCom = contenu.getAttribute('Num_Adresse');

				document.getElementById('bCreerAdrCom').collapsed = true;
				document.getElementById('bModifierAdrCom').collapsed = false;
				document.getElementById('bNouveauAdrCom').collapsed = false;
				document.getElementById('bSupprimerAdrCom').collapsed = false;
			}

			aAdrCom.initTree();
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function supprimerAdrCom() {
	try {

		if (!document.getElementById('oac-Defaut').checked) {

			var raison_sociale = document.getElementById('oac-Denomination').value;

			if (window.confirm("Confirmez-vous la suppression de l'adresse '"+ raison_sociale +"' ?")) {
				var corps = cookie() +"&Page=Facturation/Fournisseurs/supprimerAdrCom.tmpl&ContentType=xml&Fournisseur_Id="+ currentFournisseur +"&Num_Adresse="+ currentAdrCom;

				requeteHTTP(corps);

				document.getElementById('bSupprimerAdrCom').collapsed = true;
				document.getElementById('bModifierAdrCom').collapsed = true;
				document.getElementById('bCreerAdrCom').collapsed = false;
				document.getElementById('bNouveauAdrCom').collapsed = true;
				aAdrCom.initTree();
				nouveauAdrCom();
			}
		}
		else {
			showWarning("Impossible de supprimer l'adresse car elle est utilisée par défaut !");
		}

  } catch (e) {
  	recup_erreur(e);
  }
}


function chargerAdrCom() {
	try {

		if (aAdrCom.isSelected()) {

			currentAdrCom = aAdrCom.getSelectedCellValue('oac-ColDenomination');

			document.getElementById('oac-Denomination').value = aAdrCom.getSelectedCellText('oac-ColDenomination');
			document.getElementById('oac-Adresse').value = aAdrCom.getSelectedCellText('oac-ColAdresse_1');
			document.getElementById('oac-Comp_Adresse').value = aAdrCom.getSelectedCellText('oac-ColAdresse_2');
			document.getElementById('oac-Adresse_3').value = aAdrCom.getSelectedCellText('oac-ColAdresse_3');
			document.getElementById('oac-Code_Postal').value = aAdrCom.getSelectedCellText('oac-ColCode_Postal');
			document.getElementById('oac-Ville').value = aAdrCom.getSelectedCellText('oac-ColVille');
			document.getElementById('oac-Code_Pays').value = aAdrCom.getSelectedCellText('oac-ColCode_Pays');
			document.getElementById('oac-Defaut').checked = (aAdrCom.getSelectedCellText('oac-ColDefaut')==1);

			document.getElementById('oac-Defaut').disabled = document.getElementById('oac-Defaut').checked;

			if (aAdrCom.getSelectedCellText('oac-ColLib_Contact') != "") {
				document.getElementById('oac-Contact').value = aAdrCom.getSelectedCellText('oac-ColContact');
			} else {
				document.getElementById('oac-Contact').selectedIndex = 0;
			}

			document.getElementById('bSupprimerAdrCom').collapsed = false;
			document.getElementById('bModifierAdrCom').collapsed = false;
			document.getElementById('bNouveauAdrCom').collapsed = false;
			document.getElementById('bCreerAdrCom').collapsed = true;
		}

 	} catch (e) {
    recup_erreur(e);
  }
}


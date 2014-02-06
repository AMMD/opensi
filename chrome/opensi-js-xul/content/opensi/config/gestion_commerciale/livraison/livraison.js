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


var org_cour = '';
var aOrg = new Arbre("Config/GetRDF/listeOrgLivraison.tmpl", "liste_org");


function init() {
	try {

		aOrg.initTree();

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirOrg() {
	try {

		var tree = document.getElementById('liste_org');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var organismeId = getCellValue(tree,tree.currentIndex,'ColOrg');

			var corps = cookie() +"&Page=Config/gestion_commerciale/livraison/champsOrgLivraison.tmpl&ContentType=xml&Organisme_Id="+ organismeId;
			var result = requeteHTTP(corps);

			var contenu = result.responseXML.documentElement;

			document.getElementById('Nom_Org').value = contenu.getAttribute('nom_org');
			document.getElementById('Adresse').value = contenu.getAttribute('adresse');
			document.getElementById('Code_Postal').value = contenu.getAttribute('code_postal');
			document.getElementById('Ville').value = contenu.getAttribute('ville');
			document.getElementById('Tel').value = contenu.getAttribute('tel');
			document.getElementById('Fax').value = contenu.getAttribute('fax');
			document.getElementById('Num_Client').value = contenu.getAttribute('num_client');

			document.getElementById('bSupprimer').disabled = false;
			document.getElementById('bNouveau').disabled = false;
			document.getElementById('bModifier').disabled = false;
			document.getElementById('bModifier').collapsed = false;
			document.getElementById('bCreer').disabled = true;
			document.getElementById('bCreer').collapsed = true;

			org_cour = organismeId;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function keypress(e) {
  try {

    if (e.keyCode==13) {
      ouvrirOrg();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function supprimerOrg() {
	try {

		if (org_cour != '') {

			if (window.confirm("Confirmez-vous la suppression de l'organisme de livraison '"+ document.getElementById('Nom_Org').value +"' ?")) {

				var qSupprimerOrg = new QueryHttp("Config/gestion_commerciale/livraison/supprimerOrgLivraison.tmpl");
				qSupprimerOrg.setParam("Organisme_Id", org_cour);
				var p = qSupprimerOrg.execute();
				if (p.responseXML.documentElement.getAttribute("ok")=="true") {
					aOrg.initTree();
					nouveauOrg();
				} else {
					showWarning("Suppression impossible car l'organisme est utilisé par un mode de livraison !");
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function modifierOrg() {
	try {

		if (org_cour != '') {

			var nom_org = document.getElementById('Nom_Org').value;
			var adresse = document.getElementById('Adresse').value;
			var code_postal = document.getElementById('Code_Postal').value;
			var ville = document.getElementById('Ville').value;
			var tel = document.getElementById('Tel').value;
			var fax = document.getElementById('Fax').value;
			var num_client = document.getElementById('Num_Client').value;

			if (isEmpty(nom_org)) {
				showWarning("Veuillez remplir le champ 'Organisme de livraison' !");
			}
			else if (!isEmpty(code_postal) && (code_postal.length !=5 || !isDigitList(code_postal))) {
				showWarning("Code postal incorrect !");
			}
			else if (!isEmpty(tel) && !isPhone(tel)) {
				showWarning("Numéro de téléphone incorrect !");
			}
			else if (!isEmpty(fax) && !isPhone(fax)) {
				showWarning("Numéro de fax incorrect !");
			}
			else {
				var corps = cookie() +"&Page=Config/gestion_commerciale/livraison/modifierOrgLivraison.tmpl&ContentType=xml&Organisme_Id="+ org_cour;
				corps += "&Nom_Org="+ urlEncode(nom_org);
				corps += "&Adresse="+ urlEncode(adresse);
				corps += "&Code_Postal="+ urlEncode(code_postal);
				corps += "&Ville="+ urlEncode(ville);
				corps += "&Tel="+ urlEncode(tel);
				corps += "&Fax="+ urlEncode(fax);
				corps += "&Num_Client="+ urlEncode(num_client);

				requeteHTTP(corps);
				aOrg.initTree();
				nouveauOrg();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function nouveauOrg() {
	try {

		document.getElementById('Nom_Org').value = "";
		document.getElementById('Adresse').value = "";
		document.getElementById('Code_Postal').value = "";
		document.getElementById('Ville').value = "";
		document.getElementById('Tel').value = "";
		document.getElementById('Fax').value = "";
		document.getElementById('Num_Client').value = "";

		document.getElementById('bSupprimer').disabled = true;
		document.getElementById('bNouveau').disabled = true;
		document.getElementById('bModifier').disabled = true;
		document.getElementById('bModifier').collapsed = true;
		document.getElementById('bCreer').disabled = false;
		document.getElementById('bCreer').collapsed = false;

		org_cour = '';

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerOrg() {
	try {

		var nom_org = document.getElementById('Nom_Org').value;
		var adresse = document.getElementById('Adresse').value;
		var code_postal = document.getElementById('Code_Postal').value;
		var ville = document.getElementById('Ville').value;
		var tel = document.getElementById('Tel').value;
		var fax = document.getElementById('Fax').value;
		var num_client = document.getElementById('Num_Client').value;

		if (isEmpty(nom_org)) {
			showWarning("Veuillez remplir le champ 'Organisme de livraison' !");
		}
		else if (!isEmpty(code_postal) && (code_postal.length !=5 || !isDigitList(code_postal))) {
			showWarning("Code postal incorrect !");
		}
		else if (!isEmpty(tel) && !isPhone(tel)) {
			showWarning("Numéro de téléphone incorrect !");
		}
		else if (!isEmpty(fax) && !isPhone(fax)) {
			showWarning("Numéro de fax incorrect !");
		}
		else {
			var corps = cookie() +"&Page=Config/gestion_commerciale/livraison/creerOrgLivraison.tmpl&ContentType=xml";
			corps += "&Nom_Org="+ urlEncode(nom_org);
			corps += "&Adresse="+ urlEncode(adresse);
			corps += "&Code_Postal="+ urlEncode(code_postal);
			corps += "&Ville="+ urlEncode(ville);
			corps += "&Tel="+ urlEncode(tel);
			corps += "&Fax="+ urlEncode(fax);
			corps += "&Num_Client="+ urlEncode(num_client);

			requeteHTTP(corps);
			aOrg.initTree();
			nouveauOrg();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

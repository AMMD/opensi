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

jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");

var num_client;


function init() {
  try {

		if (ParamValeur("popup")=="true") {
			document.getElementById("bMenuPrincipal").collapsed = true;
			document.getElementById("bAide").collapsed = true;
			document.getElementById("bFermerSession").collapsed = true;
			document.getElementById("bMenuCommandes").collapsed = true;
		}
		num_client=ParamValeur("num_client");
		document.getElementById('txt_num_opensi').value=num_client;
		var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays");
		aPays.initTree(getInfoClient);

	}	catch (e) {
  	recup_erreur(e);
	}
}


function getInfoClient() {
	try	{

		var qClient = new QueryHttp('Facturation/ClientsWeb/getClientWeb.tmpl');
 		qClient.setParam('num', num_client);
 		var result = qClient.execute();
		var contenu = result.responseXML.documentElement;		
		
		var clientIdOpenSi = contenu.getAttribute('id_client_opensi');		

		document.getElementById("txt_civ").value = contenu.getAttribute('civ_client');
		document.getElementById("txt_nom").value = contenu.getAttribute('nom_client');
		document.getElementById("txt_prenom").value = contenu.getAttribute('prenom_client');
		document.getElementById("txt_adresse_1").value = contenu.getAttribute('adresse_client_1');
		document.getElementById("txt_adresse_2").value = contenu.getAttribute('adresse_client_2');
		document.getElementById("txt_adresse_3").value = contenu.getAttribute('adresse_client_3');
		document.getElementById("txt_cp").value = contenu.getAttribute('cp_client');
		document.getElementById("txt_ville").value = contenu.getAttribute('ville_client');
		document.getElementById("txt_num_site").value="("+contenu.getAttribute('nom_site')+")";
		document.getElementById("txt_password").value = contenu.getAttribute('password');
		document.getElementById("Code_Pays").value = contenu.getAttribute('Code_Pays');
		document.getElementById("txt_email").value = contenu.getAttribute('email');
		document.getElementById("txt_tel").value = contenu.getAttribute('tel');
		document.getElementById("txt_fax").value = contenu.getAttribute('fax');
		document.getElementById("txt_entreprise").value = contenu.getAttribute('entreprise');
		document.getElementById("txt_num_site").value = contenu.getAttribute('id_client_site');
		document.getElementById("txt_num_liaison").value = clientIdOpenSi;

		if (isEmpty(clientIdOpenSi)) {
			document.getElementById('bt_voir_fiche').disabled = true;
		}
		else {
			document.getElementById('bt_voir_fiche').disabled = false;
		}
		
		initListeCommandes();

	}	catch (e) {
		recup_erreur(e);
	}
}


function initListeCommandes() {
  try {

		var arbre = new Arbre('Facturation/ClientsWeb/liste-commandesClientWeb.tmpl','liste_com');
		arbre.setParam("num_client",num_client);
		arbre.initTree(calculTotal);

	}	catch (e) {
  	recup_erreur(e);
	}
}


function calculTotal() {
  try {
	
		var qTotal = new QueryHttp('Facturation/ClientsWeb/getTotalComClient.tmpl');
 		qTotal.setParam('Client_Web_Id', num_client);
 		var result = qTotal.execute();
		document.getElementById('total').value = result.responseXML.documentElement.getAttribute('total');

	}	catch (e) {
  	recup_erreur(e);
	}
}


function selectArbre() {
	try {

	 	document.getElementById("bt_voirCommande").disabled=false;

	}	catch (e) {
  	recup_erreur(e);
	}
}


function voirCommande() {
	try {

		var tree = document.getElementById("liste_com");
		
		if (tree.view!=null) {
			var numCommande = getCellText(tree,tree.currentIndex, 'num');			
   	 	window.location = "chrome://opensi/content/facturation/user/affaires/gestionAffaires.xul?"+ cookie() +"&Commande_Id="+ urlEncode(numCommande);
		}

	}	catch (e)	{
  	recup_erreur(e);
	}
}


function menu_principal() {
	try	{

		window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	}	catch (e)	{
  	recup_erreur(e);
	}
}


function menu_client() {
	try	{

    window.location = "chrome://opensi/content/facturation/user/clients_web/liste_clients.xul?"+ cookie();

	}	catch (e)	{
  	recup_erreur(e);
	}
}

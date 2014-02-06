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

jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");

var arbre;

function init() {
	try {

		initListes();

		if (ParamValeur("popup")=="true") {
			document.getElementById('bMenuPrincipal').collapsed = true;
			document.getElementById('bAide').collapsed = true;
			document.getElementById('bFermerSession').collapsed = true;
		}

	}	catch (e) {
  	recup_erreur(e);
	}
}


function initListes() {
	try {
	
		arbre = new Arbre('Facturation/ClientsWeb/liste-clientsWeb.tmpl','liste_clients');
		arbre.setParam('nom_client','');
		arbre.setParam('num_client','');
		arbre.setParam('site_id','T');
		arbre.initTree();

		var arbre_sites = new Arbre('Facturation/ClientsWeb/combo-provenanceSiteWeb.tmpl','menulist_sites');
		arbre_sites.initTree(fin_initListes);

	}	catch (e)	{
  	recup_erreur(e);
	}
}


function fin_initListes() {
	try	{
	
		document.getElementById('menulist_sites').selectedIndex = 0;
	
	}	catch (e)	{
  	recup_erreur(e);
	}
}


function clic_reinitialiser() {
	try	{
		
		document.getElementById('txt_num').value = "";
		document.getElementById('txt_nom').value = "";

		document.getElementById('menulist_sites').selectedIndex = 0;
		rechercher();

	}	catch (e)	{
		recup_erreur(e);
	}
}


function doubleClic() {
	try	{
		
		var tree = document.getElementById('liste_clients');
		if (tree.view!=null)	{
			var num = getCellText(tree,tree.currentIndex, 'num');
			var page = "chrome://opensi/content/facturation/user/clients_web/fiche_client.xul?"+ cookie();
			page += "&num_client="+urlEncode(num);
			page += "&popup="+ParamValeur("popup");
   	 	window.location = page;
		}
	
	}	catch (e)	{
		recup_erreur(e);
	}
}


function rechercher() {
	try	{
		
		var entreprise_client=document.getElementById('txt_entreprise').value;
		var nom_client=document.getElementById('txt_nom').value;
		var num_client=document.getElementById('txt_num').value;
		var site_id=document.getElementById('menulist_sites').value;
		arbre.setParam('entreprise_client',entreprise_client);
		arbre.setParam('nom_client',nom_client);
		arbre.setParam('num_client',num_client);
		arbre.setParam('site_id',site_id);
		arbre.initTree();

	}	catch (e)	{
		recup_erreur(e);
	}
}


function menu_principal() {
	try {

		window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	}	catch (e)	{
  	recup_erreur(e);
	}
}

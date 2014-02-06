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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var site_id;
var nom_site;

/* Initialise la page, entre autre la liste des sites déjà créés */
function init()
{
	try
	{
		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");

		cache_stock();

		document.getElementById("lb_nom_site").value="Site Internet : "+nom_site;


		document.getElementById('maj_article').value="1440";
		document.getElementById('maj_prix').value="1440";
		document.getElementById('maj_stock').value="60";
		document.getElementById('maj_cmde').value="10";
		document.getElementById('horaire_depart_article').selectedItem.selectedIndex=0;
		document.getElementById('horaire_depart_prix').selectedItem.selectedIndex=0;

	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}



function cache_stock() {}




function etape_suivante()
{
	try
	{

		//Enregistrement des politiques de mise à jour:
		var page = cookie()+"&Page=WebManager/enregistrerPolitiquesMAJ.tmpl";
		page+="&maj_prix="+document.getElementById("maj_prix").value;
		page+="&maj_article="+document.getElementById("maj_article").value;
		page+="&maj_stock="+document.getElementById("maj_stock").value;
		page+="&maj_cmde="+document.getElementById("maj_cmde").value;
		page+="&maj_statut="+document.getElementById("maj_statut").value;
		page+="&site_id="+site_id;

 		var req=requeteHTTP(page);

		//Demarrage des mise à jour
		var queryHttp = new QueryHttp("WebManager/modifications/MAJ_auto.tmpl");
		queryHttp.setParam("action", "START");
		queryHttp.setParam("type_maj","TOUT");
		queryHttp.setParam("site_id",site_id);
		queryHttp.execute();


		//changement de page
		window.location =
			"chrome://opensi/content/web_manager/initVL/publication.xul?"+
			cookie()+"&site_id="+site_id+"&nom_site="+nom_site;


	}
	catch (e)
	{
		recup_erreur(e);
	}
}



function etape_precedente()
{
	try
	{
		window.location = "chrome://opensi/content/web_manager/attrib_caracs_web/rapportCoherenceStock.xul?"+	cookie()+"&site_id="+site_id+"&nom_site="+nom_site+"&source=INIT";
		// OU revenir sur rapportCoherencePrix.xul ??
	}
	catch (e)
	{
		recup_erreur(e);
	}
}


function menuWebManager()
{
	try
	{
  		window.location = "chrome://opensi/content/web_manager/menu_e_commerce.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

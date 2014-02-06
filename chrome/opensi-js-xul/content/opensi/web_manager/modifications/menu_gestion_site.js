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

var site_id;
var nom_site;


function init() {
	try	{
  	
		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");
		
	}	catch (e)	{
    recup_erreur(e);
  }
}


function modifArticles() {
	try	{
  	
		page = "chrome://opensi/content/web_manager/attrib_caracs_web/selection_web_articles.xul?"+ cookie();
		page+="&site_id="+site_id+"&nom_site="+nom_site+"&source=MODIF";
		window.location = page;
		
	} catch (e) {
    recup_erreur(e);
  }
}
 
 
function rapports()
{
	try
	{
  		window.location = "chrome://opensi/content/web_manager/modifications/rapports.xul?"+ cookie() +"&site_id="+site_id+"&nom_site="+nom_site;
	} catch (e) {
    recup_erreur(e);
  }
 }


function maj()
{
	try
	{
  		window.location = "chrome://opensi/content/web_manager/modifications/maj_manuelle.xul?"
				+ cookie()+"&site_id="+site_id+"&nom_site="+nom_site;
		
	} catch (e) {
    recup_erreur(e);
  }
}


function menuSite()
{
	try
	{
  		window.location = "chrome://opensi/content/web_manager/modifications/choisir_un_site.xul?"+ cookie();
		
	} catch (e) {
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


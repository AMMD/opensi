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


/* Initialise la page, entre autre la liste des sites déjà créés */
function init()
{
	try
	{
	
		initListeSitesActifs();
		document.getElementById('liste_sites_e_commerce').selectedIndex = 0;
		
	}

	catch (e)
	{
		recup_erreur(e);
	}
}


function initListeSitesActifs()
{
	try
	{
		var arbre_sites=new Arbre("WebManager/GetRDF/listeSitesECommerce.tmpl","liste_sites_e_commerce");
		arbre_sites.setParam("tous","NON");
		arbre_sites.initTree();
	}
	catch (e)
	{
		recup_erreur(e);
	}
}


function select_site()
{
	try
	{
		var arbre=document.getElementById("liste_sites_e_commerce");
		if (arbre.view!=null && arbre.currentIndex!=-1)
		{
			var id=getCellText(arbre,arbre.view.selection.currentIndex, 'id_site');
			var nom=getCellText(arbre,arbre.view.selection.currentIndex, 'nom_site');
			
			var page="chrome://opensi/content/web_manager/modifications/menu_gestion_site.xul?"+ cookie();
			page+="&site_id="+id+"&nom_site="+nom;
			window.location = page;
		}

	}
	catch (e)
	{
		recup_erreur(e);
	}

	
}




/* Gestion des boutons du menu en haut */
function menuWebManager()
{
	try
	{
  		window.location = "chrome://opensi/content/web_manager/menu_e_commerce.xul?"+ cookie();
		
	} catch (e) {
    recup_erreur(e);
  }
}

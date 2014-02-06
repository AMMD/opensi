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

var site_id;
var nom_site;


function init()
{
	try
	{

		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");
		document.getElementById("bt_relancer").hidden=true;
		document.getElementById("lb_nom_site").value="Site Internet : "+nom_site;

		publicationArticles();
	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}




/* Lance la procédure de récupération des articles */
function publicationArticles()
{
	try
	{
		var bar = document.getElementById("barre_progression");
    	bar.setAttribute("hidden","false");
    	bar.mode="undetermined";


		var page = cookie()+"&Page=WebManager/publication.tmpl&ContentType=xml";
		page+="&site_id="+site_id;

		requeteHTTP(page,new XMLHttpRequest(),requeteTerminee);


	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}


/* Fonction lancée à la fin du chargement de l'arbre */
function requeteTerminee(requete)
{
	try
	{

		var bar = document.getElementById("barre_progression");
    	bar.mode="determined";
    	bar.value="0%";
    	bar.setAttribute("hidden","true");

		var reussite=requete.responseXML.documentElement.getAttribute('publication');
		if(reussite=="OUI")
		{
			document.getElementById('info').value="La publication est terminée avec succès. Vous pouvez maintenant revenir au menu de e-commerce si vous le souhaitez.";
		}
		else if(reussite=="NON")
		{
			document.getElementById('info').value="Une erreur s'est produite lors de la publication.";
			document.getElementById("bt_relancer").hidden=false;
		}


	}
	catch (e)
	{
    	recup_erreur(e);
  	}

}



function relancer()
{
	try
	{
		document.getElementById("info").value="Publication des articles en cours";
		document.getElementById("bt_relancer").hidden=true;
		publicationArticles();

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

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

/* Initialise la page, entre autre la liste des sites d�j� cr��s */
function init()
{
	try
	{
		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");

		document.getElementById("lb_nom_site").value="Site Internet : "+nom_site;

		coherencePA();
	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}




/* Lance la proc�dure de coh�rence */
function coherencePA()
{
	try
	{
		document.getElementById("info").value="V�rification des prix d'achat en cours....";

		var arbre_rapport=new Arbre("WebManager/GetRDF/verifPATemp.tmpl","contenu_rapport");
		arbre_rapport.setParam("site_id",site_id);
		arbre_rapport.initTree(chargementFini_timeout);


	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}


/* Fonction lanc�e � la fin du chargement de l'arbre */
function chargementFini_timeout()
{
	try
	{
		setTimeout("chargementFini()",500);
	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}

/* Fonction lanc�e � la fin du chargement de l'arbre */
function chargementFini()
{
	try
	{

		document.getElementById("info").value="V�rifications termin�es.";

		var arbre=document.getElementById("contenu_rapport");

		if(arbre.view==null)
		{//pas d'erreur
			document.getElementById("etape_suivante").hidden=false;
			document.getElementById("conclusion_test").value="";

			etape_suivante();

		}
		else
		{
			document.getElementById("etape_suivante").label="Continuer quand meme";
			document.getElementById("etape_suivante").hidden=false;
			document.getElementById("conclusion_test").value="La v�rification a �chou�e, veuillez v�rifier";
			document.getElementById("conclusion_test").value+=" les prix d'achat de vos articles";
		}

	}
	catch (e)
	{
    	recup_erreur(e);
  	}

}



function etape_suivante()
{
	try
	{
		window.location =	"chrome://opensi/content/web_manager/initVL/gestionDoublons.xul?"+ cookie()+"&site_id="+site_id+"&nom_site="+nom_site;


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
		window.location = "chrome://opensi/content/web_manager/initVL/attributionPrixAchat.xul?"+
		cookie()+"&site_id="+site_id+"&nom_site="+nom_site;
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


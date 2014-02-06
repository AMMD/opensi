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

var source;

/* Initialise la page, entre autre la liste des sites déjà créés */
function init() {
	try	{
		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");
		source=ParamValeur("source");
		document.getElementById("etape_suivante").hidden=true;
		initSelonSource();

		document.getElementById("lb_nom_site").value="Site Internet : "+nom_site;

		testConnexion();
	}	catch (e)	{
    recup_erreur(e);
  }
}

function initSelonSource()
{
	try
	{
		if(source=="INIT")
		{
			document.getElementById("lb_etape").hidden=false;
		}
		else
		{
			document.getElementById("lb_etape").hidden=true;
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
		window.location =	"chrome://opensi/content/web_manager/initVL/questionUploadArticle.xul?"+ cookie()+"&site_id="+site_id+"&nom_site="+nom_site;


	}
	catch (e)
	{
		recup_erreur(e);
	}
}

function select_ligne(){}


/* Lance la procédure de test de la connexion */
function testConnexion()
{
	try
	{
		document.getElementById("info").value="Tests de connexion en cours....";
		var site_id=ParamValeur("site_id");

		var arbre_rapport=new Arbre("WebManager/GetRDF/testConnexion.tmpl","contenu_rapport");
		arbre_rapport.setParam("site_id",site_id);
		arbre_rapport.initTree(chargementFini_timeout);



	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}


/* Fonction lancée à la fin du chargement de l'arbre */
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



/* Fonction lancée à la fin du chargement de l'arbre */
function chargementFini()
{
	try
	{

		document.getElementById("info").value="Tests terminés.";

		document.getElementById("info").value="";

		var arbre=document.getElementById("contenu_rapport");
		var taille=arbre.view.rowCount;

		var trouve=false;
		var i=0;

		/* On regarde s'il y a un echec */
		while(i<taille && !trouve)
		{

			var celCourante=getCellText(arbre,i, 'etat');

			if(celCourante=="ECHEC")
			{ trouve=true;}

			i++;
		}

		if(trouve)
		{
			document.getElementById("etape_suivante").hidden=true;
			document.getElementById("conclusion_test").value="Le test a échoué, veuillez vérifier";
			document.getElementById("conclusion_test").value+=" vos paramètres";
			//document.getElementById("etape_suivante").label="Retour aux paramètres";
		}
		else
		{
			if(source=="INIT")document.getElementById("etape_suivante").hidden=false;
			document.getElementById("conclusion_test").value="";
			document.getElementById("etape_suivante").label="Etape suivante";
		}
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

		window.location =
		"chrome://opensi/content/web_manager/param_serveur/param_serveur.xul?"+
		cookie()+"&site_id="+site_id+"&nom_site="+nom_site+"&source="+source;


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

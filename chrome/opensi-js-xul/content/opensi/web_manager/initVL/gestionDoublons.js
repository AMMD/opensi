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
var arbre_rapport;

/* Initialise la page, entre autre la liste des sites déjà créés */
function init()
{
	try
	{
		document.getElementById("desc").hidden=true;
		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");

		document.getElementById("lb_nom_site").value="Site Internet : "+nom_site;

		bloquerInterface(true);

		rechercherDoublons();
	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}




/* Lance la procédure de recherche des doublons */
function rechercherDoublons()
{
	try
	{
		arbre_rapport=new Arbre("WebManager/GetRDF/verifDoublons.tmpl","contenu_rapport");
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
		bloquerInterface(false);

		var arbre=document.getElementById("contenu_rapport");
		if(arbre.view==null)
		{//pas d'erreur
			etape_suivante();

		}
		else
		{
			document.getElementById("desc").hidden=false;
		}



	}
	catch (e)
	{
    	recup_erreur(e);
  	}

}

function bloquerInterface(bool)
{
	try
	{
		var bar = document.getElementById("barre_progression");
		bar.setAttribute("hidden",!bool);

		if(bool)
		{
			bar.setAttribute("mode","undetermined");
		}
		else
		{
			bar.setAttribute("mode","determined");
		}


		document.getElementById('menu_dossier').disabled = bool;
		document.getElementById('bMenuPrincipal').disabled = bool;
		document.getElementById('etape_precedente').disabled = bool;
		document.getElementById('etape_suivante').disabled = bool;


	}
	catch (e)
	{
		recup_erreur(e);
	}

}





function select_ligne()
{
	try
	{
		var arbre=document.getElementById("contenu_rapport");

		if (arbre.view!=null && arbre.currentIndex!=-1)
		{
			var i=arbre.view.selection.currentIndex;

			document.getElementById("boite_un_article").hidden=false;
			document.getElementById("boite_liste_article").hidden=true;

			document.getElementById("txt_ref").value=""+getCellText(arbre,i, 'ref_temp');
			document.getElementById("txt_design").value=""+getCellText(arbre,i, 'des_temp');
			document.getElementById("txt_sousFamille").value=""+getCellText(arbre,i, 'sousfam_temp');
			document.getElementById("txt_famille").value=""+getCellText(arbre,i, 'fam_temp');

			document.getElementById("txt_nvlRef").value=document.getElementById("txt_ref").value;
			document.getElementById("txt_nvlDes").value=document.getElementById("txt_design").value;
		}

	}
	catch (e)
	{
		recup_erreur(e);
  }
}


function clic_valider()
{
	try
	{
		var suffixe_ref=document.getElementById("txt_suffixe_ref").value;
		var suffixe_des=document.getElementById("txt_suffixe_des").value;

		var page = cookie()+"&Page=WebManager/modifDoublon.tmpl";
		page+="&site_id="+site_id+"&suffixeref="+urlEncode(suffixe_ref)+"&suffixedes="+urlEncode(suffixe_des);
		page+="&action=SUFFIXE";
 		var req=requeteHTTP(page);

		arbre_rapport.initTree();

		document.getElementById("txt_suffixe_ref").value="";
		document.getElementById("txt_suffixe_des").value="";


	}
	catch (e)
	{
    	recup_erreur(e);
  	}

}

function clic_annuler()
{
	try
	{
		document.getElementById("boite_un_article").hidden=true;
		document.getElementById("boite_liste_article").hidden=false;

	}
	catch (e)
	{
    	recup_erreur(e);
  	}

}


function clic_changer()
{
	try
	{
		var old_ref=document.getElementById("txt_ref").value;
		var new_ref=document.getElementById("txt_nvlRef").value;
		var new_des=document.getElementById("txt_nvlDes").value;

		var page = cookie()+"&Page=WebManager/modifDoublon.tmpl";
		page+="&site_id="+site_id+"&old_ref="+urlEncode(old_ref)+"&new_ref="+urlEncode(new_ref)+"&new_des="+urlEncode(new_des);
		page+="&action=MODIF";
 		var req=requeteHTTP(page);

		arbre_rapport.initTree();

		document.getElementById("txt_ref").value="";
		document.getElementById("txt_design").value="";
		document.getElementById("txt_sousFamille").value="";
		document.getElementById("txt_famille").value="";





	}
	catch (e)
	{
    	recup_erreur(e);
  	}

}

function clic_supprimer()
{
	try
	{
		var ref=document.getElementById("txt_ref").value;

		var page = cookie()+"&Page=WebManager/modifDoublon.tmpl";
		page+="&site_id="+site_id+"&old_ref="+urlEncode(ref);
		page+="&action=SUPPR";
 		var req=requeteHTTP(page);

		arbre_rapport.initTree();

		document.getElementById("txt_ref").value="";
		document.getElementById("txt_design").value="";
		document.getElementById("txt_sousFamille").value="";
		document.getElementById("txt_famille").value="";

	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}


function keyPressee_suffixes(event)
{
	try
	{
		if (event.keyCode==13)
		{
			clic_valider();
		}
	}
	catch (e)
	{
		recup_erreur(e);
	}
}



function keyPressee_newRef(event)
{
	try
	{
		if (event.keyCode==13)
		{
			clic_changer();
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

	window.location =
			"chrome://opensi/content/web_manager/initVL/enregistrerArticlesTemp.xul?"+
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


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
var dossier;

function init()
{
	try
	{
		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");
		
		dossier = get_cookie("Dossier_Id");
		
		initListes();
	
	}

	catch (e)
	{
		recup_erreur(e);
	}
}

function afficher_majPrix()
{
	try
	{	
		var fichier=document.getElementById('menulist_majPrix').label;
		document.getElementById('frame_rapport').setAttribute("src", getDirServeur()+"rapports/"+dossier+"/"+site_id+"/"+fichier);
	}

	catch (e)
	{
		recup_erreur(e);
	}
}



function afficher_majStock()
{
	try
	{	
		var fichier=document.getElementById('menulist_majStock').label;
		document.getElementById('frame_rapport').setAttribute("src", getDirServeur()+"rapports/"+dossier+"/"+site_id+"/"+fichier);
	}

	catch (e)
	{
		recup_erreur(e);
	}
}


function afficher_majInfo()
{
	try
	{	
		var fichier=document.getElementById('menulist_majInfo').label;
		document.getElementById('frame_rapport').setAttribute("src", getDirServeur()+"rapports/"+dossier+"/"+site_id+"/"+fichier);
	}

	catch (e)
	{
		recup_erreur(e);
	}
}


function afficher_majArt()
{
	try
	{	
		var fichier=document.getElementById('menulist_majArticle').label;
		document.getElementById('frame_rapport').setAttribute("src", getDirServeur()+"rapports/"+dossier+"/"+site_id+"/"+fichier);
	}

	catch (e)
	{
		recup_erreur(e);
	}
}

function afficher_majCom()
{
	try
	{	
		var fichier=document.getElementById('menulist_majCom').label;
		document.getElementById('frame_rapport').setAttribute("src", getDirServeur()+"rapports/"+dossier+"/"+site_id+"/"+fichier);
	}

	catch (e)
	{
		recup_erreur(e);
	}
}


function afficher_upArt()
{
	try
	{	
		var fichier=document.getElementById('menulist_upArt').label;
		document.getElementById('frame_rapport').setAttribute("src", getDirServeur()+"rapports/"+dossier+"/"+site_id+"/"+fichier);
	}

	catch (e)
	{
		recup_erreur(e);
	}
}


function initListes()
{
	try
	{
		var liste_majPrix=new Arbre("WebManager/GetRDF/listeRapportMajPrix.tmpl","menulist_majPrix");
		liste_majPrix.setParam("site_id",site_id);
		liste_majPrix.initTree();
		
		var liste_majStock=new Arbre("WebManager/GetRDF/listeRapportMajStock.tmpl","menulist_majStock");
		liste_majStock.setParam("site_id",site_id);
		liste_majStock.initTree();
		
		var liste_majInfo=new Arbre("WebManager/GetRDF/listeRapportMajInfo.tmpl","menulist_majInfo");
		liste_majInfo.setParam("site_id",site_id);
		liste_majInfo.initTree();
		
		var liste_majCom=new Arbre("WebManager/GetRDF/listeRapportMajCom.tmpl","menulist_majCom");
		liste_majCom.setParam("site_id",site_id);
		liste_majCom.initTree();
		
		var liste_majArticle=new Arbre("WebManager/GetRDF/listeRapportMajArticles.tmpl","menulist_majArticle");
		liste_majArticle.setParam("site_id",site_id);
		liste_majArticle.initTree();
		
		
		var liste_upArticle=new Arbre("WebManager/GetRDF/listeRapportsUploadArt.tmpl","menulist_upArt");
		liste_upArticle.setParam("site_id",site_id);
		liste_upArticle.initTree();
	}

	catch (e)
	{
		recup_erreur(e);
	}
}

function admin_maj()
{
	try
	{

		var page = "chrome://opensi/content/web_manager/modifications/maj_manuelle.xul?"+ cookie();
		page+="&site_id="+site_id+"&nom_site="+nom_site;
		window.location =page;

	}
	catch (e)
	{
		recup_erreur(e);
	}
}

function menuGestionSite()
{
	try
	{
  		
		var page = "chrome://opensi/content/web_manager/modifications/menu_gestion_site.xul?"+ cookie();
		page+="&site_id="+site_id+"&nom_site="+nom_site;
		window.location =page;
		
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


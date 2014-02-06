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

var source;

/* Initialise la page, entre autre la liste des sites déjà créés */
function init() {
	try	{

		source=ParamValeur("source");
		initSelonSource();

		initListeSitesActifs();

		initListeSitesDesactives();

		RAZ();
		document.getElementById("warning").hidden=true;

		document.getElementById("site_en_cours").value="Selectionnez un site actif avant de passer à l'étape suivante";
		document.getElementById("etape_suivante").disabled=true;

		document.getElementById('liste_sites_e_commerce').selectedIndex = 0;
		document.getElementById('liste_sites_desactives').selectedIndex = 0;


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

function initListeSitesActifs()
{
	try
	{
		var arbre_sites=new Arbre("WebManager/GetRDF/listeSitesECommerce.tmpl","liste_sites_e_commerce");
		arbre_sites.setParam("tous","OUI");
		arbre_sites.initTree();
	}
	catch (e)
	{
		recup_erreur(e);
	}
}

function initListeSitesDesactives()
{
	try
	{
		var arbre_desactive=new Arbre("WebManager/GetRDF/listeSitesDesactives.tmpl","liste_sites_desactives");
		arbre_desactive.initTree();
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
		var arbre=document.getElementById("liste_sites_e_commerce");
		if (arbre.view!=null && arbre.currentIndex!=-1)
		{
			var page = "chrome://opensi/content/web_manager/param_serveur/rapport_connexion.xul?"+ cookie();
			page+="&site_id="+getCellText(arbre,arbre.view.selection.currentIndex, 'id_site');
			page+="&nom_site="+getCellText(arbre,arbre.view.selection.currentIndex, 'nom_site');
			page+="&source="+source;

			window.location=page;

		}
		else
		{

		}
	}
	catch (e)
	{
		recup_erreur(e);
	}


}


function doubleClic()
{
	etape_suivante();

}


function clic_nouveau()
{
	try
	{
		RAZ();
		interdireEcriture(false);
	}
	catch (e)
	{
		recup_erreur(e);
	}
}


function clic_ajouter()
{
	try
	{
		var mode=document.getElementById("bt_ajouter").label;

		if(mode=="Modifier")
		{
			interdireEcriture(false);
			document.getElementById("bt_suppr").label="Annuler";
			document.getElementById("bt_ajouter").label="Valider";
		}
		else if(mode=="Ajouter")
		{
			if(verifierPresenceChamps())
			{
				ajouterSite(
					document.getElementById("txt_nom_site").value,
					document.getElementById("txt_url_site").value,
					document.getElementById("txt_adresse_site").value,
					document.getElementById("txt_logo").value
					);
				RAZ();
				initListeSitesActifs();
			}

		}
		else if(mode=="Activer")
		{
			activerSite(document.getElementById("txt_id_site").value);

			initListeSitesActifs();
			initListeSitesDesactives();
		}
		else if(mode=="Valider")
		{

			modifierSite(
					document.getElementById("txt_id_site").value,
					document.getElementById("txt_nom_site").value,
					document.getElementById("txt_url_site").value,
					document.getElementById("txt_adresse_site").value,
					document.getElementById("txt_logo").value
					);
			RAZ();
			initListeSitesActifs();
		}
	}
	catch (e)
	{
		recup_erreur(e);
	}
}


function clic_suppr()
{
	try
	{
		var mode=document.getElementById("bt_suppr").label;

		if(mode=="Supprimer")
		{
			supprimerSite(document.getElementById("txt_id_site").value);
			initListeSitesDesactives();
		}
		else if(mode=="Annuler")
		{
			RAZ();
		}
		else if(mode=="Désactiver")
		{
			desactiverSite(document.getElementById("txt_id_site").value);

			initListeSitesActifs();
			initListeSitesDesactives();

			document.getElementById("site_en_cours").value="Selectionnez un site actif avant de passer à l'étape suivante";
			document.getElementById("etape_suivante").disabled=true;
		}
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
		document.getElementById("warning").hidden=true;
		interdireEcriture(true);
		document.getElementById("bt_suppr").label="Désactiver";
		document.getElementById("bt_ajouter").label="Modifier";
		informerChamps("liste_sites_e_commerce");

		var arbre=document.getElementById("liste_sites_e_commerce");
		if (arbre.view!=null && arbre.currentIndex!=-1)
		{
			document.getElementById("site_en_cours").value="Site sélectionné: "+getCellText(arbre,arbre.view.selection.currentIndex, 'nom_site');
			document.getElementById("etape_suivante").disabled=false;
		}
		else
		{
			document.getElementById("site_en_cours").value="Selectionnez un site actif avant de passer à l'étape suivante";
			document.getElementById("etape_suivante").disabled=true;
		}
	}
	catch (e)
	{
		recup_erreur(e);
	}


}

function select_desactive()
{
	try
	{
		document.getElementById("warning").hidden=true;
		interdireEcriture(true);
		document.getElementById("bt_suppr").label="Supprimer";
		document.getElementById("bt_ajouter").label="Activer";

		informerChamps("liste_sites_desactives");
	}
	catch (e)
	{
		recup_erreur(e);
	}
}




  function modifierSite (site_id, nom_site, url_site, adresse_site,logo)
  {
  	try
	{

 		page = cookie()+"&Page=WebManager/modifParamSites.tmpl";
		page+= "&action=MODIF";
		page+= "&nom_site="+urlEncode(nom_site)+"&url_site="+urlEncode(url_site);
		page+= "&adresse_site="+urlEncode(adresse_site)+"&url_logo="+urlEncode(logo);
		page+= "&site_id="+site_id;

 		var req=requeteHTTP(page);
	}
	catch (e)
	{
		recup_erreur(e);
	}

  }

 function ajouterSite(nom_site, url_site, adresse_site,logo)
 {
 	try
	{
 		page = cookie()+"&Page=WebManager/modifParamSites.tmpl";
		page+= "&action=AJOUT";
		page+= "&nom_site="+urlEncode(nom_site)+"&url_site="+urlEncode(url_site);
		page+= "&adresse_site="+urlEncode(adresse_site)+"&url_logo="+urlEncode(logo);

 		var req=requeteHTTP(page);
	}
	catch (e)
	{
		recup_erreur(e);
	}

 }

 function activerSite(id)
 {
 	try
	{
 		page = cookie()+"&Page=WebManager/modifParamSites.tmpl";
		page+= "&action=ACTIVER";
		page+= "&site_id="+id;


 		var req=requeteHTTP(page);
	}
	catch (e)
	{
		recup_erreur(e);
	}

 }

 function desactiverSite(id)
 {
 	try
	{
 		page = cookie()+"&Page=WebManager/modifParamSites.tmpl";
		page+= "&action=DESACTIVER";
		page+= "&site_id="+id;


 		var req=requeteHTTP(page);
	}
	catch (e)
	{
		recup_erreur(e);
	}

 }

 function supprimerSite(id)
 {
 	try
	{
 		page = cookie()+"&Page=WebManager/modifParamSites.tmpl";
		page+= "&action=SUPPRIMER";
		page+= "&site_id="+id;


 		var req=requeteHTTP(page);
	}
	catch (e)
	{
		recup_erreur(e);
	}

 }


function RAZ()
{
	try
	{
		viderChamps();
		interdireEcriture(true);
		document.getElementById("bt_suppr").label="Annuler";
		document.getElementById("bt_ajouter").label="Ajouter";
		document.getElementById("warning").hidden=true;
	}
	catch (e)
	{
		recup_erreur(e);
	}
}


/* Si un champs est manquant, l'utilisateur est informé
  et la fonction renvoi false
  si tous les champs sont présent, alors la fonction renvoi true
*/
function verifierPresenceChamps()
{
	try
	{
		var retour=false;

		if(document.getElementById("txt_nom_site").value=="")
		{
			document.getElementById("warning").value="Veuillez indiquer le nom du site";
			document.getElementById("warning").hidden=false;
		}
		else if (document.getElementById("txt_url_site").value=="")
		{
			document.getElementById("warning").value="Veuillez indiquer l'adresse du service";
			document.getElementById("warning").hidden=false;
		}
		else if (document.getElementById("txt_adresse_site").value=="")
		{
			document.getElementById("warning").value="Veuillez donner une l'adresse du site";
			document.getElementById("warning").hidden=false;
		}
		else
		{
			document.getElementById("warning").hidden=true;
			retour=true;
		}

		return retour;
	}
	catch (e)
	{
		recup_erreur(e);
	}

}



function interdireEcriture(bool)
{
	try
	{
		if (bool) {
			document.getElementById("txt_url_site").setAttribute("readonly",bool);
			document.getElementById("txt_nom_site").setAttribute("readonly",bool);

			document.getElementById("txt_adresse_site").setAttribute("readonly",bool);
			document.getElementById("txt_logo").setAttribute("readonly",bool);
		}
		else {
			document.getElementById("txt_url_site").removeAttribute("readonly");
			document.getElementById("txt_nom_site").removeAttribute("readonly");

			document.getElementById("txt_adresse_site").removeAttribute("readonly");
			document.getElementById("txt_logo").removeAttribute("readonly");
		}
	}
	catch (e)
	{
		recup_erreur(e);
	}

}

function viderChamps()
{
	try
	{
		document.getElementById("txt_url_site").value="";
		document.getElementById("txt_nom_site").value="";
		document.getElementById("txt_adresse_site").value="";
		document.getElementById("txt_logo").value="";
	}
	catch (e)
	{
		recup_erreur(e);
	}


}


function informerChamps(nomArbre)
{
	try
	{
		var arbre=document.getElementById(nomArbre);
		if (arbre.view!=null && arbre.currentIndex!=-1)
		{
			var nom_site=getCellText(arbre,arbre.view.selection.currentIndex, 'nom_site');
			var url_site=getCellText(arbre,arbre.view.selection.currentIndex, 'url_site');
			var id=getCellText(arbre,arbre.view.selection.currentIndex, 'id_site');
			var adresse=getCellText(arbre,arbre.view.selection.currentIndex, 'adresse');
			var logo=getCellText(arbre,arbre.view.selection.currentIndex, 'logo');

			document.getElementById("txt_id_site").value=""+id;
			document.getElementById("txt_nom_site").value=""+nom_site;
			document.getElementById("txt_url_site").value=""+url_site;
			document.getElementById("txt_adresse_site").value=""+adresse;
			document.getElementById("txt_logo").value=""+logo;

		}
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


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

jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");

var site_id;
var nom_site;

var arbre_articles;

var checkbox_full="chrome://opensi/content/design/full_coche3.png";
var checkbox_empty="chrome://opensi/content/design/non_coche.png";
var checkbox_partiel="chrome://opensi/content/design/partiel_coche2.png";

var numColonneCoche=3;
var numColonneType=1;
var numColonneId=0;
var numColonneFamilleId=4;

var chargementTermine;

var fautRafraichir;

var source;

/* Initialise la page, entre autre la liste des sites déjà créés */
function init() {
	try	{

		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");

		source=ParamValeur("source");
		document.getElementById("info").value="Source:"+source;

		document.getElementById("lb_nom_site").value="Site Internet : "+nom_site;

		initSelonSource();
		

	}	catch (e)	{
    recup_erreur(e);
  }
}

function initSelonSource() {
	if(source=="INIT") {
		document.getElementById("bMenuSites").hidden=true;
		document.getElementById("bGestionSite").hidden=true;
		document.getElementById("etape_suivante").label="Etape suivante";
	}
	else {
		document.getElementById("bMenuSites").hidden=false;
		document.getElementById("bGestionSite").hidden=false;
		document.getElementById("lb_etape").value="";
		document.getElementById("etape_precedente").hidden=false;
	}
	initListeArticles();
	
}


function initListeArticles() {
	try {

		chargementTermine=false;
		bloquerInterface(true);

		arbre_articles=new Arbre("WebManager/GetRDF/listeArticlesWebEtOpenSi.tmpl","liste_articles");
		arbre_articles.setParam("coche_empty",checkbox_empty);
		arbre_articles.setParam("coche_partiel",checkbox_partiel);
		arbre_articles.setParam("coche_full",checkbox_full);
		arbre_articles.setParam("site_id",site_id);
		arbre_articles.initTree(chargementArbreTermine);

	}	catch (e)	{
		recup_erreur(e);
	}
}


function refreshListeArticles() {
	try	{

		chargementTermine=false;
		bloquerInterface(true);

		arbre_articles.setParam("coche_partiel",checkbox_partiel);
		arbre_articles.setParam("coche_empty",checkbox_empty);
		arbre_articles.setParam("coche_full",checkbox_full);
		arbre_articles.setParam("site_id",site_id);
		arbre_articles.initTree(chargementArbreTermine);

	}	catch (e)	{
		recup_erreur(e);
	}
}


function chargementArbreTermine() {
	try	{
		fautRafraichir=false;
		chargementTermine=true;
		bloquerInterface(false);

	}	catch (e) {
		recup_erreur(e);
	}
}


function bloquerInterface(bool) {
	try	{

		var bar = document.getElementById("barre_progression");
		bar.setAttribute("hidden",!bool);

		if (bool) {
			bar.setAttribute("mode","undetermined");
		}
		else {
			bar.setAttribute("mode","determined");
		}

		document.getElementById('toutCocher').disabled = bool;
		document.getElementById('toutDecocher').disabled = bool;
		document.getElementById('etape_suivante').disabled = bool;

	}	catch (e) {
		recup_erreur(e);
	}
}


function tout_cocher() {
	try	{

		document.getElementById("conclusion").value="";

		fautRafraichir=true;
		chargementTermine=false;

		creerWebArticles("","","");

	}	catch (e)	{
		recup_erreur(e);
	}
}


function tout_decocher() {
	try	{

		fautRafraichir=true;
		chargementTermine=false;
		deleteWebArticles("","","");

	}	catch (e)	{
		recup_erreur(e);
	}
}


function on_clic(event) {
	try	{

		if (chargementTermine)	{

			var arbre=document.getElementById("liste_articles");

			if (event && arbre && event.type == "click")

  			{

    		var row = {}, col = {}, obj = {};

    		arbre.treeBoxObject.getCellAt(event.clientX, event.clientY, row, col, obj);

			if(obj.value=="twisty")
			{
				document.getElementById("conclusion").value="";
			}
			else
			{
				document.getElementById("conclusion").value="";
				if(row.value>=0)
				{
					cocher_ligne(row.value);
				}

			}


  			}
		}
	}	catch (e)	{
		recup_erreur(e);
	}
}


//Retourne vrai si au moins une case est cochée
//faux sinon
function YauMoinsUneCoche() {
	try	{
	var arbre=document.getElementById("liste_articles");
	var taille=arbre.view.rowCount;

	var i=0;
	var trouve=false;


	while(i<taille&&(!trouve))
	{
		var objet_XUL=arbre.view.getItemAtIndex(i);
		var ligne=objet_XUL.childNodes[0].childNodes;
		var celluleCoche=ligne[numColonneCoche];

		var coche=celluleCoche.getAttribute("src");
		if(coche==checkbox_full||coche==checkbox_partiel)
		{
			trouve=true;
		}

		i++;

	}
	return trouve;

	}	catch (e) {
		recup_erreur(e);
	}
}



//Crée les FICHE_ARTICLE_WEB des articles. avec etat_Existance=+1
// Si id_article="" alors toute la sous famille est crée
// Si sou_famille="", alors toute la famille est crée.
// Si tout est "", alors une fiche web est crée pour tous les articles de la base
function creerWebArticles(id_article, famille1, famille2) {
	try	{

		var queryHttp = new QueryHttp("WebManager/modifications/modifWebArticles.tmpl");

		queryHttp.setParam("id_article", id_article);
		queryHttp.setParam("site_id",site_id);
		queryHttp.setParam("famille1",famille1);
		queryHttp.setParam("famille2",famille2);
		queryHttp.setParam("modeOp","CREER");

		bloquerInterface(true);

		queryHttp.execute(reqTerminee);

	}	catch (e)	{
		recup_erreur(e);
	}
}


//Modifie les FICHE_ARTICLE_WEB des articles ==>avec etat_Existance=-1
// Si id_article="" alors toute la sous famille est modifiée
// Si sou_famille="", alors toute la famille est modifiée.
// Si tout est à "", alors toute la base du site est modifiée
function deleteWebArticles(id_article, famille1, famille2) {
	try	{

		var queryHttp = new QueryHttp("WebManager/modifications/modifWebArticles.tmpl");

		queryHttp.setParam("id_article", id_article);
		queryHttp.setParam("site_id",site_id);
		queryHttp.setParam("famille1",famille1);
		queryHttp.setParam("famille2",famille2);
		queryHttp.setParam("modeOp","DEL");

		bloquerInterface(true);

		queryHttp.execute(reqTerminee);

	}	catch (e)	{
		recup_erreur(e);
	}
}


function reqTerminee() {
	try	{

		if (fautRafraichir) {
			fautRafraichir=false;
			refreshListeArticles();
		}
		else {
			bloquerInterface(false);
		}

	}	catch (e)	{
		recup_erreur(e);
	}
}





//Coche la ligne et insère ou supprime l'article web de la base
function cocher_ligne(num_ligne_clique) {
	try	{

		var arbre=document.getElementById("liste_articles");

		var numLigne=num_ligne_clique;

		var objet_XUL=arbre.view.getItemAtIndex(numLigne);
		var ligne=objet_XUL.childNodes[0].childNodes;

		var celluleCoche=ligne[numColonneCoche];
		var celluleType=ligne[numColonneType];
		var celluleFamilleId=ligne[numColonneFamilleId];
		var typeDeCellule=celluleType.getAttribute("label");
		var cocheAvantClic=celluleCoche.getAttribute("src");


		/* ******************** ARTICLE ***************** */
		//On inverse juste la coche
		if (typeDeCellule=="article") {

			var celluleIdArticle=ligne[numColonneId];
			if (cocheAvantClic==checkbox_empty) {
				creerWebArticles(celluleIdArticle.getAttribute("label"),"","");
				celluleCoche.setAttribute("src",checkbox_full);
			} else {
				deleteWebArticles(celluleIdArticle.getAttribute("label"),"","");
				celluleCoche.setAttribute("src",checkbox_empty);

			}

			repercuterCocheSousFamille(num_ligne_clique);
		}
		/* ******************** SOUS FAMILLE ***************** */
		else if (typeDeCellule=="sous_famille") {
			// Il faut cocher ou décocher tous les articles de cette sous famille

			var famille2=celluleFamilleId.getAttribute("label");
			var position=objet_XUL.getAttribute('open');

			objet_XUL.setAttribute('open','true');

			var continuer=true;
			var i=0;

			var index=num_ligne_clique;

			//Recherche de la famille
			var famille1=rechercheFamille(index);

			if (cocheAvantClic==checkbox_full) {
				deleteWebArticles("",famille1,famille2);
				celluleCoche.setAttribute("src",checkbox_empty);
			} else if(cocheAvantClic==checkbox_empty) {
				creerWebArticles("",famille1,famille2);
				celluleCoche.setAttribute("src",checkbox_full);
			} else if(cocheAvantClic==checkbox_partiel) {
				creerWebArticles("",famille1,famille2);
				celluleCoche.setAttribute("src",checkbox_full);
			}

			//On parcours les suivant jusqu'a tomber
			// sur une sous famille, ou une famille ou jusqu'a la fin
			// de la liste
			while (continuer) {

				var objet_XUL_temp=arbre.view.getItemAtIndex(index+i);
				var ligne_temp=objet_XUL_temp.childNodes[0].childNodes;
				var celluleCoche_temp=ligne_temp[numColonneCoche];
				var celluleType_temp=ligne_temp[numColonneType];
				var typeDeCellule_temp=celluleType_temp.getAttribute("label");

				if(i!=0&&(typeDeCellule_temp=="sous_famille"||typeDeCellule_temp=="famille"))
				{
					continuer=false;
				}
				else
				{

					if(cocheAvantClic==checkbox_full)
					{
						celluleCoche_temp.setAttribute("src",checkbox_empty);
					}
					else if(cocheAvantClic==checkbox_empty)
					{
						celluleCoche_temp.setAttribute("src",checkbox_full);

					}
					else if(cocheAvantClic==checkbox_partiel)
					{
						celluleCoche_temp.setAttribute("src",checkbox_full);

					}

				}

				try
				{
					arbre.view.getItemAtIndex(numLigne+i+1);
				}
				catch(e)
				{
					continuer=false;
				}

				i++;

			}


			//Parce que si c'est pas open, position="" et pas false
			if(position=="true")
			{
				objet_XUL.setAttribute('open','true');
			}
			else
			{
				objet_XUL.setAttribute('open','false');
			}

			repercuterCocheFamille(num_ligne_clique);

			//arbre.boxObject.invalidateColumn("coche");
		}
		
		

		/* ******************** FAMILLE ***************** */
		else if(typeDeCellule=="famille")
		{
			// Il faut cocher ou décocher tous les articles de cette sous famille
			var famille1=celluleFamilleId.getAttribute("label");

			var position_famille=objet_XUL.getAttribute('open');
			objet_XUL.setAttribute('open','true');


			var cocheAMettre="";
			if(cocheAvantClic==checkbox_empty)
			{
				creerWebArticles("",famille1,"");
				cocheAMettre=checkbox_full;
			}
			else if(cocheAvantClic==checkbox_full)
			{
				deleteWebArticles("",famille1,"");
				cocheAMettre=checkbox_empty;
			}
			else if(cocheAvantClic==checkbox_partiel)
			{
				creerWebArticles("",famille1,"");
				cocheAMettre=checkbox_full;
			}

			var continuer=true;
			var i=0;

			var index=num_ligne_clique;
			//On parcours les suivant jusqu'a tomber
			// une famille ou jusqu'a la fin
			// de la liste


			var tab_sousFamille= new Array();//enregistre les index des sous familles
			var tab_sousFamillePos= new Array();//enregistre les position correspondante

			while(continuer)
			{

				var objet_XUL_temp=arbre.view.getItemAtIndex(index+i);
				var ligne_temp=objet_XUL_temp.childNodes[0].childNodes;
				var celluleCoche_temp=ligne_temp[numColonneCoche];
				var celluleType_temp=ligne_temp[numColonneType];
				var typeDeCellule_temp=celluleType_temp.getAttribute("label");

				if(i!=0&&(typeDeCellule_temp=="famille"))
				{
					continuer=false;
				}
				else
				{

					if(i!=0&&(typeDeCellule_temp=="sous_famille"))
					{
						tab_sousFamille.push(index+i);
						tab_sousFamillePos.push(objet_XUL_temp.getAttribute('open'));
						objet_XUL_temp.setAttribute('open','true');
					}

					celluleCoche_temp.setAttribute("src",cocheAMettre);
				}


				try
				{
					arbre.view.getItemAtIndex(numLigne+i+1);
				}
				catch(e)
				{
					continuer=false;
				}

				i++;
			}


			//Fermeture des sous familles qui ont été ouvertes:
			var j;
			tab_sousFamille.reverse();
			tab_sousFamillePos.reverse();

			for(j=0;j<tab_sousFamille.length;j++)
			{
				var objet_XUL_temp=arbre.view.getItemAtIndex(tab_sousFamille[j]);
				if(tab_sousFamillePos[j]=="true")
				{
					objet_XUL_temp.setAttribute('open','true');
				}
				else
				{
					objet_XUL_temp.setAttribute('open','false');
				}
			}


			//Parce que si c'est pas open, position="" et pas false
			if(position_famille=="true")
			{
				objet_XUL.setAttribute('open','true');
			}
			else
			{
				objet_XUL.setAttribute('open','false');
			}

			//arbre.boxObject.invalidateColumn("coche");
		}

	}	catch (e)	{
		recup_erreur(e);
	}
}




//Regarde s'il faut changer la coche devant la famille
//a laquelle la sous_famille courante apartient
function repercuterCocheFamille(indexCocheSf) {
	try	{

		var arbre=document.getElementById("liste_articles");
		var tailleArbre=arbre.view.rowCount;
		var ligne_sf_coche=getLigneArbre(arbre,indexCocheSf);

		var cocheSf=ligne_sf_coche[numColonneCoche].getAttribute("src");


		var ligne_famille;
		var index_famille;

		//1. On cherche la sous famille de l'article
		var i=indexCocheSf;
		var trouve=false;
		while(i>=0 && !trouve) {

			var ligne_rech=getLigneArbre(arbre,i);
			var typeCellule=ligne_rech[numColonneType].getAttribute("label");

			if(typeCellule=="famille")
			{
				trouve=true;
				ligne_famille=ligne_rech;
				index_famille=i;
			}

			i=i-1;
		}

		//2. Selon les valeur des cases à cocher, on affecte la valeur à la sous-fam

		var cocheFam=ligne_famille[numColonneCoche].getAttribute("src");

		if(cocheSf==checkbox_partiel)
		{//facile !
			ligne_famille[numColonneCoche].setAttribute("src",checkbox_partiel);
			arbre.boxObject.invalidateCell(index_famille,"coche");
		}
		else if(cocheSf==checkbox_full)
		{
			//On cherche un not full, s'il y en a un, c'est partiel
			var continuer=true;
			var j=index_famille+1;

			trouve=false;

			while(continuer&&!trouve&&j<tailleArbre)
			{
				var ligne_temp=getLigneArbre(arbre,j);

				var typeCell=ligne_temp[numColonneType].getAttribute("label");
				//conditions d'arret
				if(typeCell=="famille")
				{
					continuer=false;
				}
				else
				{//c'est une sous_famille ou un article
					if(!(ligne_temp[numColonneCoche].getAttribute("src")==checkbox_full))
					{
						trouve=true;
					}
				}

				j++;
			}

			if(trouve)
			{
				ligne_famille[numColonneCoche].setAttribute("src",checkbox_partiel);
				arbre.boxObject.invalidateCell(index_famille,"coche");
			}
			else
			{
				ligne_famille[numColonneCoche].setAttribute("src",checkbox_full);
				arbre.boxObject.invalidateCell(index_famille,"coche");
			}

		}
		else if(cocheSf==checkbox_empty)
		{

			//On cherche un not empty, s'il y en a un, c'est partiel
			var continuer=true;
			var j=index_famille+1;

			trouve=false;

			while(continuer&&!trouve&&j<tailleArbre)
			{
				var ligne_temp=getLigneArbre(arbre,j);

				var typeCell=ligne_temp[numColonneType].getAttribute("label");
				//conditions d'arret
				if(typeCell=="famille")
				{
					continuer=false;
				}
				else
				{//c'est une sous_famille ou un article
					if(!(ligne_temp[numColonneCoche].getAttribute("src")==checkbox_empty))
					{
						trouve=true;
					}
				}

				j++;
			}

			if(trouve)
			{
				ligne_famille[numColonneCoche].setAttribute("src",checkbox_partiel);
				arbre.boxObject.invalidateCell(index_famille,"coche");
			}
			else
			{
				ligne_famille[numColonneCoche].setAttribute("src",checkbox_empty);
				arbre.boxObject.invalidateCell(index_famille,"coche");
			}

		}

	}	catch (e)	{
		recup_erreur(e);
	}
}


function repercuterCocheSousFamille(indexCocheArticle) {
	try	{

		var arbre=document.getElementById("liste_articles");
		var tailleArbre=arbre.view.rowCount;
		var ligne_article_coche=getLigneArbre(arbre,indexCocheArticle);

		var cocheArticle=ligne_article_coche[numColonneCoche].getAttribute("src");


		var ligne_sous_famille;
		var index_sous_famille;

		//1. On cherche la sous famille de l'article
		var i=indexCocheArticle;
		var trouve=false;
		while(i>=0 && !trouve)
		{

			var ligne_rech=getLigneArbre(arbre,i);
			var typeCellule=ligne_rech[numColonneType].getAttribute("label");

			if(typeCellule=="sous_famille")
			{
				trouve=true;
				ligne_sous_famille=ligne_rech;
				index_sous_famille=i;
			}

			i=i-1;
		}

		//2. Selon les valeur des cases à cocher, on affecte la valeur à la sous-fam

		var cocheSousFam=ligne_sous_famille[numColonneCoche].getAttribute("src");

		if(cocheArticle==checkbox_full)
		{
			if(cocheSousFam==checkbox_empty||cocheSousFam==checkbox_partiel)
			{
				//on recherche une case vide
				var continuer=true;
				var j=index_sous_famille+1;

				trouve=false;

				while(continuer&&!trouve&&j<tailleArbre)
				{
					var ligne_temp=getLigneArbre(arbre,j);

					var typeCell=ligne_temp[numColonneType].getAttribute("label");
					//conditions d'arret
					if(typeCell=="famille"||typeCell=="sous_famille")
					{
						continuer=false;
					}
					else
					{//c'est un article
						if(ligne_temp[numColonneCoche].getAttribute("src")==checkbox_empty)
						{
							trouve=true;
						}
					}

					j++;
				}

				if(trouve)
				{
					ligne_sous_famille[numColonneCoche].setAttribute("src",checkbox_partiel);
					arbre.boxObject.invalidateCell(index_sous_famille,"coche");
				}
				else
				{
					ligne_sous_famille[numColonneCoche].setAttribute("src",checkbox_full);
					arbre.boxObject.invalidateCell(index_sous_famille,"coche");
				}

				repercuterCocheFamille(index_sous_famille);

			}

		}
		else
		{
			if(cocheSousFam==checkbox_full||cocheSousFam==checkbox_partiel)
			{
				//on recherche une case pleine
				var continuer=true;
				var j=index_sous_famille+1;

				trouve=false;

				while(continuer&&!trouve&&j<tailleArbre)
				{
					var ligne_temp=getLigneArbre(arbre,j);

					var typeCell=ligne_temp[numColonneType].getAttribute("label");
					//conditions d'arret
					if(typeCell=="famille"||typeCell=="sous_famille")
					{
						continuer=false;
					}
					else
					{//c'est un article
						if(ligne_temp[numColonneCoche].getAttribute("src")==checkbox_full)
						{
							trouve=true;
						}
					}

					j++;
				}

				if(trouve)
				{
					ligne_sous_famille[numColonneCoche].setAttribute("src",checkbox_partiel);
					arbre.boxObject.invalidateCell(index_sous_famille,"coche");
				}
				else
				{
					ligne_sous_famille[numColonneCoche].setAttribute("src",checkbox_empty);
					arbre.boxObject.invalidateCell(index_sous_famille,"coche");
				}

				repercuterCocheFamille(index_sous_famille);

			}

		}

	}	catch (e)	{
		recup_erreur(e);
	}
}


function rechercheFamille(indexSousFamille) {
	try	{

		var resultat="";
		var k=indexSousFamille;

		var arbre=document.getElementById("liste_articles");
		var typeCourant="sous_famille";
		var continuer=true;
		while(k>0 && continuer)
		{
			k=k-1;
			var objet_XUL=arbre.view.getItemAtIndex(k);
			var ligne=objet_XUL.childNodes[0].childNodes;
			typeCourant=ligne[1].getAttribute("label"); //le type est dans la colonne 1

			if(typeCourant=="famille")
			{
				continuer=false;
				resultat=ligne[4].getAttribute("label");//l'id de famille est à l'index 4

			}

		}

		return resultat;


	}	catch (e)	{
		recup_erreur(e);
	}
}


function getLigneArbre(arbre, index) {
	try	{

		var objet_XUL=arbre.view.getItemAtIndex(index);
		var ligne=objet_XUL.childNodes[0].childNodes;
		return ligne;

	}	catch (e)	{
		recup_erreur(e);
	}
}


function etape_suivante() {
	try	{

		if (YauMoinsUneCoche())	{
			window.location = "chrome://opensi/content/web_manager/attrib_caracs_web/attribution_carac.xul?"+ cookie() +"&site_id="+site_id+"&nom_site="+nom_site+"&source="+source;
		}
		else {
			document.getElementById("conclusion").value="Vous devez selectionner au moins un article.";
			document.getElementById("conclusion").setAttribute('class',"warning");
		}

	}	catch (e)	{
		recup_erreur(e);
	}
}


function etape_precedente() {
	try	{

		window.location = "chrome://opensi/content/web_manager/initVL/questionUploadArticle.xul?"+ cookie()	+"&site_id="+site_id+"&nom_site="+nom_site;

	}	catch (e) {
		recup_erreur(e);
	}
}


function menuGestionSite() {
	try	{

		window.location = "chrome://opensi/content/web_manager/modifications/menu_gestion_site.xul?"+ cookie() +"&site_id="+site_id+"&nom_site="+nom_site;

	} catch (e) {
    recup_erreur(e);
  }
}

function menuSite() {
	try	{

		window.location = "chrome://opensi/content/web_manager/modifications/choisir_un_site.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function menuWebManager() {
	try	{

		window.location = "chrome://opensi/content/web_manager/menu_e_commerce.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


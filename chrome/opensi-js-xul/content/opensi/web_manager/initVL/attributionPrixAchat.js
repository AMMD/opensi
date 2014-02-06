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

var liste_articles=new Arbre("WebManager/GetRDF/listeArticlesTemp.tmpl","tree_articles");
var liste_familles2;

var selection_arbre;

/* Initialise la page, entre autre la liste des sites déjà créés */
function init()
{
	try
	{
		selection_arbre=-1;

		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");

		document.getElementById("lb_nom_site").value="Site Internet : "+nom_site;

		init_listes();

	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}


/* Init des menu déroulants*/
function init_listes()
{
try
	{
		var liste_famille=new Arbre("WebManager/GetRDF/listeFamilles1Temp.tmpl","menulist_familles1");
		liste_famille.setParam("site_id",site_id);
		liste_famille.initTree(initFamille1);

	}
	catch (e)
	{
    	recup_erreur(e);
  	}
}

function initFamille1() {
	try {
		document.getElementById('menulist_familles1').selectedIndex=0;
		document.getElementById('menulist_familles2').selectedIndex=0;
		document.getElementById('menulist_familles2').disabled = true;
		
		liste_familles2=new Arbre("WebManager/GetRDF/listeFamilles2Temp.tmpl","menulist_familles2");
		liste_familles2.setParam("site_id",site_id);


		var liste_marque=new Arbre("WebManager/GetRDF/listeMarquesTemp.tmpl","menulist_marques");
		liste_marque.setParam("site_id",site_id);
		liste_marque.initTree(initMarque);
	} catch (e) {
		recup_erreur(e);
	}
}


function initMarque() {
	try {
		document.getElementById('menulist_marques').selectedIndex=0;
		rechercher();
	} catch (e) {
		recup_erreur(e);
	}
}


function reinitialiser()
{
	try
	{
		clic_annuler_article();

		document.getElementById('txt_reference').value = "";
		document.getElementById('txt_designation').value = "";
		document.getElementById('menulist_familles1').selectedIndex = 0;
		document.getElementById('menulist_familles2').selectedIndex = 0;
		document.getElementById('menulist_familles2').disabled = true;
		document.getElementById('menulist_marques').selectedIndex = 0;
		document.getElementById('txt_info').value="Tous les articles";

		rechercher();



	}
	catch (e)
	{
		recup_erreur(e);
	}

}


/* Evt appelé lors de la sélection d'un article*/
function select_arbre()
{
	try
	{

		var arbre=document.getElementById("tree_articles");
		var i=arbre.view.selection.currentIndex;

		if (arbre.view!=null && arbre.currentIndex!=-1)
		{
			document.getElementById('boite_un_article').hidden=false;
			document.getElementById('boite_liste_article').hidden=true;

			document.getElementById("txt_ref").value=""+getCellText(arbre,i, 'ColArticle_Id');
			document.getElementById("txt_design").value=""+getCellText(arbre,i, 'ColDesignation');
			document.getElementById("txt_prixVente").value=""+getCellText(arbre,i, 'ColPrixVente');

			var pa=document.getElementById("txt_prixVente").value=""+getCellText(arbre,i, 'ColPrixAchat');
			if(isPositive(pa))
			{
				document.getElementById("txt_prixAchat").value=pa;
			}
			else
			{
				document.getElementById("txt_prixAchat").value="";
			}


		}

	}
	catch (e)
	{
		recup_erreur(e);
	}

}










function clic_valider_liste()
{
	try
	{
		var valeur=document.getElementById('txt_valeur').value;

		if(valeur!="")
		{
			if(isPositive(valeur))
			{//La valeur est OK, on lance la procédure
				document.getElementById('txt_valeur').setAttribute('class',"contenu_correct");
				var famille1=document.getElementById('menulist_familles1').value;
				var famille2=document.getElementById('menulist_familles2').value;
				var marque=document.getElementById('menulist_marques').value;
				var reference=document.getElementById('txt_reference').value;
				var designation=document.getElementById('txt_designation').value;

				modifierPrixGroupe(reference, designation, famille1, famille2, marque, valeur);

				//pour rafraichir
				rechercher();

				document.getElementById('txt_valeur').value="";
			}
			else
			{
				document.getElementById('txt_valeur').setAttribute('class',"contenu_incorrect");
			}
		}
		else
		{
			document.getElementById('txt_valeur').setAttribute('class',"contenu_incorrect");
		}


	}
	catch (e)
	{
		recup_erreur(e);
	}

}


function clic_valider_article()
{
	try
	{
		var prix=document.getElementById("txt_prixAchat").value;

		if(prix!="")
		{
			if(isPositive(prix))
			{//La valeur est OK, on lance la procédure
				document.getElementById('txt_prixAchat').setAttribute('class',"contenu_correct");

				var ref=document.getElementById("txt_ref").value;

				modifierPrixAchat(ref,prix);

				var arbre=document.getElementById("tree_articles");
				selection_arbre=arbre.view.selection.currentIndex;

				//pour rafraichir
				rechercher();



			}
			else
			{
				document.getElementById('txt_prixAchat').setAttribute('class',"contenu_incorrect");
			}
		}
		else
		{
			document.getElementById('txt_prixAchat').setAttribute('class',"contenu_incorrect");
		}



	}
	catch (e)
	{
		recup_erreur(e);
	}

}


function clic_annuler_article()
{
	try
	{
		document.getElementById('boite_un_article').hidden=true;
		document.getElementById('boite_liste_article').hidden=false;

		document.getElementById('txt_valeur').value="";
	}
	catch (e)
	{
		recup_erreur(e);
	}

}


function verifNombre(textbox_src)
{
	try
	{
		var nombre=document.getElementById(textbox_src).value;

		if(nombre!="")
		{
			if(isPositive(nombre))
			{
				document.getElementById(textbox_src).setAttribute('class',"contenu_correct");
			}
			else
			{
				document.getElementById(textbox_src).setAttribute('class',"contenu_incorrect");
			}
		}
		else
		{
			document.getElementById(textbox_src).setAttribute('class',"contenu_correct");
		}
	}
	catch (e)
	{
		recup_erreur(e);
	}

}



function modifierPrixGroupe(reference, designation, famille1, famille2, marque, valeur)
{
	try
	{
		var page = cookie()+"&Page=WebManager/modifPrixAchatTemp.tmpl";
		page+="&id_article=&site_id="+site_id;
		page+="&reference="+urlEncode(reference);
		page+="&designation="+urlEncode(designation);
		page+="&famille1="+famille1;
		page+="&famille2="+famille2;
		page+="&marque="+marque;
		page+="&valeur="+valeur;

 		var req=requeteHTTP(page);
	}
	catch (e)
	{
		recup_erreur(e);
	}

}


function modifierPrixAchat(id_article,prix)
{
	try
	{
		var page = cookie()+"&Page=WebManager/modifPrixAchatTemp.tmpl";
		page+="&id_article="+urlEncode(id_article)+"&site_id="+site_id+"&prix="+prix;
 		var req=requeteHTTP(page);
	}
	catch (e)
	{
		recup_erreur(e);
	}
}



function keyPressee(event)
{
	try
	{
		if (event.keyCode==13)
		{
			clic_annuler_article();
			rechercher();
		}
	}
	catch (e)
	{
		recup_erreur(e);
	}
}


function keyPressee_prixAchat(event)
{
	try
	{
		if (event.keyCode==13)
		{
			clic_valider_article();
		}
	}
	catch (e)
	{
		recup_erreur(e);
	}
}


function keyPressee_valeur(event)
{
	try
	{
		if (event.keyCode==13)
		{
			clic_valider_liste();
		}
	}
	catch (e)
	{
		recup_erreur(e);
	}
}




function rechercher_famille()
{
	try
	{
		adapter_famille2();

		rechercher();

	}
	catch (e)
	{
		recup_erreur(e);
	}
}

function adapter_famille2() {
	try {
		var famille1 = document.getElementById('menulist_familles1').value;
		if (famille1=="0") {
			liste_familles2.deleteTree();
			document.getElementById('menulist_familles2').disabled=true;
			document.getElementById('menulist_familles2').selectedIndex=0;
		} else {
			liste_familles2.setParam("Famille_1", famille1);
			liste_familles2.initTree(initFamille2);
		}
	}
	catch (e) {
    recup_erreur(e);
	}
}

function initFamille2() {
	try {
		document.getElementById('menulist_familles2').disabled=false;
		document.getElementById('menulist_familles2').selectedIndex = 0;
	} catch (e) {
		recup_erreur(e);
	}
}









//appelée quand on choisi dans les listes déroulantes
function rechercher()
{
	try
	{

		liste_articles.setParam("famille1",document.getElementById('menulist_familles1').value);
		liste_articles.setParam("famille2",document.getElementById('menulist_familles2').value);
		liste_articles.setParam("marque",document.getElementById('menulist_marques').value);
		liste_articles.setParam("reference",document.getElementById('txt_reference').value);
		liste_articles.setParam("designation",document.getElementById('txt_designation').value);
		liste_articles.setParam("site_id",site_id);

		liste_articles.initTree(fin_init_tree);

		MAJInfo();



	}
	catch (e)
	{
		recup_erreur(e);
	}
}


function fin_init_tree()
{
	try
	{
		if(selection_arbre>-1)
		{
			//on remet la selection
			var arbre=document.getElementById("tree_articles");
			arbre.view.selection.select(selection_arbre);
			selection_arbre=-1;
		}



	}
	catch (e)
	{
		recup_erreur(e);
	}


}




//Met à jour l'information sur la recherche d'articles en cours
function MAJInfo()
{
	try
	{
		var result="";

		var ref=document.getElementById("txt_reference").value;
		if (ref=="")
		{
			//result+="Toutes les références";
		}
		else
		{
			result+=" "+ref;
		}


		var des=document.getElementById("txt_designation").value;
		if (des=="")
		{
			//result+=", toutes les désignations";
		}
		else
		{
			result+=", "+des;
		}




		var fam1=document.getElementById("menulist_familles1").value;
		if (fam1=="0")
		{
			//result+=", toutes les familles";
		}
		else
		{
			result+=", "+document.getElementById("menulist_familles1").label;
		}


		var fam2=document.getElementById("menulist_familles2").value;
		if (fam2=="0")
		{
			//result+=", toutes les sous-familles";
		}
		else
		{
			result+=", "+document.getElementById("menulist_familles2").label;
		}

		var marques=document.getElementById("menulist_marques").value;
		if (marques=="0")
		{
			//result+=", toutes les marques";
		}
		else
		{
			result+=", "+document.getElementById("menulist_marques").label;
		}


		document.getElementById("txt_info").value=result;

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
		window.location = "chrome://opensi/content/web_manager/initVL/rapportCoherencePATemp.xul?"+ cookie()
				+"&site_id="+site_id+"&nom_site="+nom_site;
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
		window.location = "chrome://opensi/content/web_manager/initVL/questionUploadArticle.xul?"+
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

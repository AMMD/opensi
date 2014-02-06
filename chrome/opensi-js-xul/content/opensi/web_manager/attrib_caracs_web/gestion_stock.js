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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var nf = new NumberFormat("0.00", false);

var site_id;
var nom_site;
var source;

var liste_articles=new Arbre("WebManager/GetRDF/listeArticlesWebStocks.tmpl","tree_articles");
var liste_familles2;

var aAttribut1 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'menulist_attr1');
var aAttribut2 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'menulist_attr2');
var aAttribut3 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'menulist_attr3');

var selection_arbre;

var modeCalculCourant;
var valeurCourante;


/* Pour le message de confirmation: */
var message_confirm="vide";


function init() {
	try	{

		modeCalculCourant="";
		valeurCourante="";

		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");
		source=ParamValeur("source");
		document.getElementById("lb_nom_site").value="Site Internet : "+nom_site;
		
		var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
    qNomListeAttribut.setParam("Liste_Id", 1);
    var result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut1').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    document.getElementById('colAttribut1').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    qNomListeAttribut.setParam("Liste_Id", 2);
    result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut2').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    document.getElementById('colAttribut2').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    qNomListeAttribut.setParam("Liste_Id", 3);
    result = qNomListeAttribut.execute();
    document.getElementById('lblAttribut3').value = result.responseXML.documentElement.getAttribute('Nom') + " :";
    document.getElementById('colAttribut3').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));
    
    aAttribut1.setParam("site_id",site_id);
    aAttribut1.setParam("Liste_Id",1);
    aAttribut2.setParam("site_id",site_id);
    aAttribut2.setParam("Liste_Id",2);
    aAttribut3.setParam("site_id",site_id);
    aAttribut3.setParam("Liste_Id",3);

		initSelonSource();
		

	}	catch (e)	{
    recup_erreur(e);
  }
}


function initSelonSource() {
	if (source=="INIT") {
		document.getElementById("bMenuSites").hidden=true;
		document.getElementById("bGestionSite").hidden=true;
	} else {
		document.getElementById("bMenuSites").hidden=false;
		document.getElementById("bGestionSite").hidden=false;
		document.getElementById("lb_etape").value="";
	}
	
	init_listes();
}


/* Init des menu déroulants*/
function init_listes() {
	try {
		var liste_famille=new Arbre("WebManager/GetRDF/listeFamilles1Web.tmpl","menulist_familles1");
		liste_famille.setParam("site_id",site_id);
		liste_famille.initTree(initFamille1);
	} catch (e) {
    recup_erreur(e);
	}
}


function initFamille1() {
	try {
		document.getElementById('menulist_familles1').selectedIndex=0;
		document.getElementById('menulist_familles2').selectedIndex=0;
		document.getElementById('menulist_familles2').disabled = true;
		
		liste_familles2=new Arbre("WebManager/GetRDF/listeFamilles2Web.tmpl","menulist_familles2");
		liste_familles2.setParam("site_id",site_id);
		
		var liste_marque=new Arbre("WebManager/GetRDF/listeMarquesWeb.tmpl","menulist_marques");
		liste_marque.setParam("site_id",site_id);
		liste_marque.initTree(initMarque);
	} catch (e) {
		recup_erreur(e);
	}
}


function initMarque() {
	try {
		document.getElementById('menulist_marques').selectedIndex=0;
		aAttribut1.initTree(initAttribut1);
	} catch (e) {
		recup_erreur(e);
	}
}

function initAttribut1() {
	try {
		document.getElementById('menulist_attr1').selectedIndex=0;
		aAttribut2.initTree(initAttribut2);
	} catch (e) {
		recup_erreur(e);
	}
}

function initAttribut2() {
	try {
		document.getElementById('menulist_attr2').selectedIndex=0;
		aAttribut3.initTree(initAttribut3);
	} catch (e) {
		recup_erreur(e);
	}
}

function initAttribut3() {
	try {
		document.getElementById('menulist_attr3').selectedIndex=0;
		rechercher();
	} catch (e) {
		recup_erreur(e);
	}
}




function bloquerInterface(bool) {
	try	{
		
		var bar = document.getElementById("barre_progression");
		bar.setAttribute("hidden",!bool);

		if (bool) { bar.setAttribute("mode","undetermined"); }
		else { bar.setAttribute("mode","determined"); }

		document.getElementById('txt_reference').disabled = bool;
		document.getElementById('menulist_marques').disabled = bool;
		document.getElementById('menulist_familles1').disabled = bool;
		document.getElementById('menulist_familles2').disabled = (bool || document.getElementById('menulist_familles1').selectedIndex==0);
		document.getElementById('txt_designation').disabled = bool;
		document.getElementById('menulist_attr1').disabled = bool;
		document.getElementById('menulist_attr2').disabled = bool;
		document.getElementById('menulist_attr3').disabled = bool;
		document.getElementById('bt_reinit').disabled = bool;
		document.getElementById('txt_stockWeb').disabled = bool;
		document.getElementById('txt_stockTampon').disabled = bool;
		document.getElementById('txt_stockOpensi').disabled = bool;
		document.getElementById('bt_valider').disabled = bool;
		document.getElementById('bt_annuler').disabled = bool;
		document.getElementById('txt_valeur').disabled = bool;
		document.getElementById('bt_valider_2').disabled = bool;
		document.getElementById('etape_precedente').disabled = bool;
		document.getElementById('etape_suivante').disabled = bool;

		document.getElementById('menu_dossier').disabled = bool;
		document.getElementById('bMenuPrincipal').disabled = bool;
		document.getElementById('bMenuSites').disabled = bool;
		document.getElementById('bGestionSite').disabled = bool

	}	catch (e) {
		recup_erreur(e);
	}
}


function reinitialiser() {
	try	{
		
		document.getElementById('txt_reference').value = "";
		document.getElementById('txt_designation').value = "";
		document.getElementById('menulist_familles1').selectedIndex = 0;
		document.getElementById('menulist_familles2').selectedIndex = 0;
		document.getElementById('menulist_familles2').disabled = true;
		document.getElementById('menulist_marques').selectedIndex = 0;
		document.getElementById('menulist_attr1').selectedIndex = 0;
		document.getElementById('menulist_attr2').selectedIndex = 0;
		document.getElementById('menulist_attr3').selectedIndex = 0;
		document.getElementById('txt_info').value="Tous les articles";

		rechercher();

		document.getElementById('boite_un_article').hidden=true;
		document.getElementById('boite_liste_article').hidden=false;

		document.getElementById('tree_articles').view.selection.clearSelection();

	}	catch (e)	{
		recup_erreur(e);
	}
}


/* Evt appelé lors de la sélection d'un article*/
function select_arbre() {
	try	{

		document.getElementById('lb_confirmation').value="";

		var arbre=document.getElementById("tree_articles");
		var i=arbre.view.selection.currentIndex;

		if (arbre.view!=null && arbre.currentIndex!=-1) {
			document.getElementById('boite_un_article').hidden=false;
			document.getElementById('boite_liste_article').hidden=true;

			document.getElementById("txt_ref").value=""+getCellText(arbre,i, 'ColArticle_Id');
			document.getElementById("txt_design").value=""+getCellText(arbre,i, 'ColDesignation');
			document.getElementById("txt_stock").value=""+getCellText(arbre,i, 'ColStock');

			var stockWeb=getCellText(arbre,i, 'ColStockWeb');

			if(stockWeb=="") {
				document.getElementById("txt_stockWeb").value=getCellText(arbre,i, 'ColStock');
			} else {
				document.getElementById("txt_stockWeb").value=getCellText(arbre,i,'ColStockWeb');
			}

			//Y a plus qu'a calculer les différents champs de texte
			calculer_stock_pc();
			calculer_stock_tampon();

			modeCalculCourant="PC_OPENSI";
			valeurCourante="100";
		}

	}	catch (e)	{
		recup_erreur(e);
	}
}


function keyPressee_valeur(event) {
	try	{
	
		if (event.keyCode==13) {
			clic_valider_liste();
		}
	
	}	catch (e)	{
		recup_erreur(e);
	}
}



function keyPressee_unarticle(event) {
	try	{
		
		if (event.keyCode==13) {
			clic_valider_article();
		}
	
	}	catch (e)	{
		recup_erreur(e);
	}
}


function clic_valider_liste() {
	try	{
		
		bloquerInterface(true);

		var famille1=document.getElementById('menulist_familles1').value;
		var famille2=document.getElementById('menulist_familles2').value;
		var marque=document.getElementById('menulist_marques').value;
		var attribut1=document.getElementById('menulist_attr1').value;
		var attribut2=document.getElementById('menulist_attr2').value;
		var attribut3=document.getElementById('menulist_attr3').value;
		var reference=document.getElementById('txt_reference').value;
		var designation=document.getElementById('txt_designation').value;

		var modeCalcul=document.getElementById('choix_calcul').value;

		var valeur=document.getElementById('txt_valeur').value;

		if(modeCalcul=="TAMPON") {
			message_confirm="Le stock tampon de "+valeur+" articles a été appliqué.";
		} else if(modeCalcul=="MEME") {
			message_confirm="Le stock en ligne est le même que celui de OpenSi.";
		} else if(modeCalcul=="PC_OPENSI") {
			message_confirm="Le stock des articles en ligne a été mis a "+valeur+"% de celui de OpenSi.";
		}
		modifierStockGroupe(reference, designation, famille1, famille2, marque, attribut1, attribut2, attribut3, modeCalcul, valeur);

	}	catch (e)	{
		recup_erreur(e);
	}
}


function clic_valider_article() {
	try	{
		
		bloquerInterface(true);

		var stock=document.getElementById("txt_stockWeb").value;
		var ref=document.getElementById("txt_ref").value;
		
		modifierStockWeb(ref,stock);

	}	catch (e) {
		recup_erreur(e);
	}
}


function clic_annuler_article() {
	try	{
		
		document.getElementById('boite_un_article').hidden=true;
		document.getElementById('boite_liste_article').hidden=false;

		document.getElementById('choix_calcul').value="MEME";
		document.getElementById('txt_valeur').value="";

	}	catch (e)	{
		recup_erreur(e);
	}
}

/* Appelé quand un champs texte est modifié */
function stockWeb_modifie() {
	try	{
	
		var nouveau_stock=document.getElementById("txt_stockWeb").value;
		if (nouveau_stock!="") {
			if (isPositive(nouveau_stock)) {
				document.getElementById("txt_stockWeb").setAttribute('class',"contenu_correct");
				calculer_stock_pc();
				calculer_stock_tampon();

				modeCalculCourant="PC_OPENSI";
				valeurCourante=document.getElementById("txt_stockOpensi").value;
			} else {
				document.getElementById("txt_stockWeb").setAttribute('class',"contenu_incorrect");
			}
		}

	}	catch (e)	{
		recup_erreur(e);
	}
}


function stockTampon_modifie() {
	try	{
		
		var nouveau_stock=document.getElementById("txt_stockTampon").value;
		modeCalculCourant="TAMPON";
		valeurCourante=nouveau_stock;
		if (nouveau_stock!="") {
			if (isPositiveOrNullInteger(nouveau_stock)) {
				document.getElementById("txt_stockTampon").setAttribute('class',"contenu_correct");

				//Calcul du stockWeb
				var stockOpensi=document.getElementById("txt_stock").value;
				var stock_web=parseInt(stockOpensi)-parseInt(nouveau_stock);
				document.getElementById("txt_stockWeb").value=stock_web;

				if (stock_web<0) {
					document.getElementById("txt_stockWeb").setAttribute('class',"contenu_incorrect");
				} else {
					document.getElementById("txt_stockWeb").setAttribute('class',"contenu_correct");
				}

				calculer_stock_pc();
			} else {
				document.getElementById("txt_stockTampon").setAttribute('class',"contenu_incorrect");
			}
		}

	}	catch (e)	{
		recup_erreur(e);
	}
}


function stockOpensi_modifie() {
	try {
	
		var nouveau_stock=document.getElementById("txt_stockOpensi").value;

		modeCalculCourant="PC_OPENSI";
		valeurCourante=nouveau_stock;

		if (nouveau_stock!="") {
			if (isPositive(nouveau_stock)) {
				document.getElementById("txt_stockWeb").setAttribute('class',"contenu_correct");
				var stock=document.getElementById("txt_stock").value;
				var stockWeb=(parseFloat(nouveau_stock)*parseFloat(stock))/100;
				document.getElementById("txt_stockWeb").value=parseInt(stockWeb);
				calculer_stock_tampon();
			} else {
				document.getElementById("txt_stockWeb").setAttribute('class',"contenu_incorrect");
			}
		}

	}	catch (e)	{
		recup_erreur(e);
	}
}


function modifierStockGroupe(reference, designation, famille1, famille2, marque, attribut1, attribut2, attribut3, modeCalcul, valeur) {
	try	{
		
		var queryHttp = new QueryHttp("WebManager/attrib_caracs/modifStockWeb.tmpl");

		queryHttp.setParam("id_article", "");
		queryHttp.setParam("site_id",site_id);
		queryHttp.setParam("reference",reference);
		queryHttp.setParam("designation",designation);
		queryHttp.setParam("famille1",famille1);
		queryHttp.setParam("famille2",famille2);
		queryHttp.setParam("marque", marque);
		queryHttp.setParam("attribut1",attribut1);
		queryHttp.setParam("attribut2",attribut2);
		queryHttp.setParam("attribut3",attribut3);
		queryHttp.setParam("typeCalcul", modeCalcul);
		queryHttp.setParam("valeur",valeur);

		queryHttp.execute(reqGroupeTerminee);

	}	catch (e)	{
		recup_erreur(e);
	}
}


function reqGroupeTerminee() {
	try	{

		bloquerInterface(false);

		//pour rafraichir
		rechercher();
		document.getElementById('txt_valeur').value="";

		document.getElementById('lb_confirmation').value=message_confirm;


	}	catch (e)	{
		recup_erreur(e);
	}
}



function modifierStockWeb(id_article,stock) {
	try	{

		if (valeurCourante!="" && modeCalculCourant!="")	{

			var queryHttp = new QueryHttp("WebManager/attrib_caracs/modifStockWeb.tmpl");

			queryHttp.setParam("id_article", id_article);
			queryHttp.setParam("site_id",site_id);
			queryHttp.setParam("stock",stock);
			queryHttp.setParam("typeCalcul", modeCalculCourant);
			queryHttp.setParam("valeur",valeurCourante);

			queryHttp.execute(reqSoloTerminee);

		}

	}	catch (e)	{
		recup_erreur(e);
	}
}




function reqSoloTerminee() {
	try	{

		bloquerInterface(false);

		var arbre=document.getElementById("tree_articles");
		selection_arbre=arbre.view.selection.currentIndex;

		rechercher();

	}	catch (e)	{
		recup_erreur(e);
	}
}


//Met à jour l'information sur la recherche d'articles en cours
function MAJInfo() {
	try	{
		
		var result="";

		var ref=document.getElementById("txt_reference").value;
		if (ref=="") {
			//result+="Toutes les références";
		} else {
			result+=" "+ref;
		}

		var des=document.getElementById("txt_designation").value;
		if (des=="") {
			//result+=", toutes les désignations";
		} else {
			result+=", "+des;
		}

		var fam1=document.getElementById("menulist_familles1").value;
		if (fam1=="0") {
			//result+=", toutes les familles";
		} else {
			result+=", "+document.getElementById("menulist_familles1").label;
		}

		var fam2=document.getElementById("menulist_familles2").value;
		if (fam2=="0") {
			//result+=", toutes les sous-familles";
		} else {
			result+=", "+document.getElementById("menulist_familles2").label;
		}

		var marques=document.getElementById("menulist_marques").value;
		if (marques=="0") {
			//result+=", toutes les marques";
		} else {
			result+=", "+document.getElementById("menulist_marques").label;
		}

		var attr1=document.getElementById("menulist_attr1").value;
		if (attr1=="") {
			//result+=", toutes les collections";
		} else {
			result+=", "+document.getElementById("menulist_attr1").label;
		}


		var attr2=document.getElementById("menulist_attr2").value;
		if (attr2=="") {
			//result+=", toutes les couleurs";
		} else {
			result+=", "+document.getElementById("menulist_attr2").label;
		}

		var attr3=document.getElementById("menulist_attr3").value;
		if (attr3=="") {
			//result+=", toutes les tailles";
		} else {
			result+=", "+document.getElementById("menulist_attr3").label;
		}

		if (result=="") {
			document.getElementById("txt_info").value="Toute la base";
		} else {
			document.getElementById("txt_info").value=result;
		}

	}	catch (e) {
		recup_erreur(e);
	}
}


function calculer_stock_pc() {
	try	{
		
		var stockWeb=document.getElementById("txt_stockWeb").value;
		var stockOpenSi=document.getElementById("txt_stock").value;

		if (stockOpenSi!=0) {
			var stock_pc=(100*parseFloat(stockWeb))/stockOpenSi;
			document.getElementById("txt_stockOpensi").value=""+nf.format(stock_pc);

			if(stock_pc<0) {
				document.getElementById("txt_stockOpensi").setAttribute('class',"contenu_incorrect");
			} else {
				document.getElementById("txt_stockOpensi").setAttribute('class',"contenu_correct");
			}
		}
	}	catch (e)	{
		recup_erreur(e);
	}
}


function calculer_stock_tampon() {
	try	{
		
		var stockWeb=document.getElementById("txt_stockWeb").value;
		var stockOpenSi=document.getElementById("txt_stock").value;

		document.getElementById("txt_stockTampon").value=""+(parseInt(stockOpenSi)-parseInt(stockWeb));

		if(parseInt(stockOpenSi)-parseInt(stockWeb)<0) {
			document.getElementById("txt_stockTampon").setAttribute('class',"contenu_incorrect");
		} else {
			document.getElementById("txt_stockTampon").setAttribute('class',"contenu_correct");
		}
	
	}	catch (e)	{
		recup_erreur(e);
	}
}


function keyPressee(event) {
	try	{
		
		if (event.keyCode==13) {
			rechercher();
		}
		
	}	catch (e)	{
		recup_erreur(e);
	}
}


function rechercher_famille() {
	try	{
		adapter_famille2();

		rechercher();
		MAJInfo();

	}	catch (e)	{
		recup_erreur(e);
	}
}


function pre_rechercher() {
	try	{
		
		document.getElementById('boite_un_article').hidden=true;
		document.getElementById('boite_liste_article').hidden=false;
		rechercher();
		MAJInfo();

	}	catch (e)	{
		recup_erreur(e);
	}
}


//appelée quand on choisit dans les listes déroulantes
function rechercher() {
	try {

		liste_articles.setParam("famille1",document.getElementById('menulist_familles1').value);
		liste_articles.setParam("famille2",document.getElementById('menulist_familles2').value);
		liste_articles.setParam("marque",document.getElementById('menulist_marques').value);
		liste_articles.setParam("attribut1",document.getElementById('menulist_attr1').value);
		liste_articles.setParam("attribut2",document.getElementById('menulist_attr2').value);
		liste_articles.setParam("attribut3",document.getElementById('menulist_attr3').value);
		liste_articles.setParam("reference",document.getElementById('txt_reference').value);
		liste_articles.setParam("designation",document.getElementById('txt_designation').value);
		liste_articles.setParam("site_id",site_id);

		liste_articles.initTree(fin_init_tree);

	}	catch (e)	{
		recup_erreur(e);
	}
}



function fin_init_tree() {
	try	{
		
		if (selection_arbre>-1) {
			//on remet la selection
			var arbre=document.getElementById("tree_articles");
			arbre.view.selection.select(selection_arbre);
			selection_arbre=-1;
		}

	}	catch (e) {
		recup_erreur(e);
	}
}


function adapter_famille2() {
	try	{
		var famille1 = document.getElementById('menulist_familles1').value;
		if (famille1=="0") {
			liste_familles2.deleteTree();
			document.getElementById('menulist_familles2').disabled=true;
			document.getElementById('menulist_familles2').selectedIndex=0;
		} else {
			liste_familles2.setParam("Famille_1", famille1);
			liste_familles2.initTree(initFamille2);
		}
	}	catch (e)	{
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


function etape_suivante() {
	try	{
		window.location = "chrome://opensi/content/web_manager/attrib_caracs_web/rapportCoherenceStock.xul?"+ cookie() +"&site_id="+site_id+"&nom_site="+nom_site+"&source="+source;
	}	catch (e)	{
		recup_erreur(e);
	}
}


function etape_precedente() {
	try	{
		window.location = "chrome://opensi/content/web_manager/attrib_caracs_web/rapportCoherencePrix.xul?"+ cookie()+"&site_id="+site_id+"&nom_site="+nom_site+"&source="+source;
	}	catch (e)	{
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

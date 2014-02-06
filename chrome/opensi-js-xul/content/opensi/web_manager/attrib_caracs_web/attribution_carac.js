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
var nfc = new NumberFormat("0.000000", false);

var site_id;
var nom_site;
var source;

var liste_articles=new Arbre("WebManager/GetRDF/listeArticlesWeb.tmpl","tree_articles");
var liste_familles2;

var aAttribut1 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'menulist_attr1');
var aAttribut2 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'menulist_attr2');
var aAttribut3 = new Arbre('ComboListe/combo-attributsArticle.tmpl', 'menulist_attr3');

var selection_arbre;

var mode_calcul_courant;
var valeur_en_cours;

/* Pour le message de confirmation: */
var message_confirm="vide";

/* Initialise la page, entre autre la liste des sites déjà créés */
function init() {
	try {
		selection_arbre=-1;

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

	} catch (e) {
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
	try {
		var bar = document.getElementById("barre_progression");
		bar.setAttribute("hidden",!bool);

		if(bool) {
			bar.setAttribute("mode","undetermined");
		} else {
			bar.setAttribute("mode","determined");
		}

		document.getElementById('txt_reference').disabled = bool;
		document.getElementById('menulist_marques').disabled = bool;
		document.getElementById('menulist_familles1').disabled = bool;
		document.getElementById('menulist_familles2').disabled = (bool || document.getElementById('menulist_familles1').selectedIndex==0);
		document.getElementById('txt_designation').disabled = bool;
		document.getElementById('menulist_attr1').disabled = bool;
		document.getElementById('menulist_attr2').disabled = bool;
		document.getElementById('menulist_attr3').disabled = bool;
		document.getElementById('bt_reinit').disabled = bool;
		document.getElementById('txt_prixWeb').disabled = bool;
		document.getElementById('txt_marge').disabled = bool;
		document.getElementById('txt_coef_pa').disabled = bool;
		document.getElementById('txt_coef_pv').disabled = bool;
		document.getElementById('bt_valider').disabled = bool;
		document.getElementById('bt_annuler').disabled = bool;
		document.getElementById('txt_valeur').disabled = bool;
		document.getElementById('bt_valider_2').disabled = bool;
		document.getElementById('etape_precedente').disabled = bool;
		document.getElementById('etape_suivante').disabled = bool;

		document.getElementById('menu_dossier').disabled = bool;
		document.getElementById('bMenuPrincipal').disabled = bool;
		document.getElementById('bMenuSites').disabled = bool;
		document.getElementById('bGestionSite').disabled = bool;

	} catch (e) {
		recup_erreur(e);
	}
}




function reinitialiser() {
	try {
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
	} catch (e) {
		recup_erreur(e);
	}

}


/* Evt appelé lors de la sélection d'un article*/
function select_arbre() {
	try {

		var arbre=document.getElementById("tree_articles");
		var i=arbre.view.selection.currentIndex;
		if (arbre.view!=null && arbre.currentIndex!=-1) {

			document.getElementById("txt_margePc").removeAttribute("readonly");
			document.getElementById("txt_coef_pa").removeAttribute("readonly");
			document.getElementById("txt_coef_pv").removeAttribute("readonly");

			document.getElementById('boite_un_article').hidden=false;
			document.getElementById('boite_liste_article').hidden=true;

			document.getElementById("txt_ref").value=""+getCellText(arbre,i, 'ColArticle_Id');
			document.getElementById("txt_design").value=""+getCellText(arbre,i, 'ColDesignation');
			document.getElementById("txt_prixAchat").value=""+getCellText(arbre,i, 'ColPrixAchat');
			document.getElementById("txt_prixVente").value=""+getCellText(arbre,i, 'ColPrixVente');

			var prixWeb=getCellText(arbre,i, 'ColPrixWeb');

			if(prixWeb==""||parseFloat(prixWeb)==0.0) {
				// par défaut PV web=PV classique
				document.getElementById("txt_prixWeb").value=getCellText(arbre,i, 'ColPrixVente');
			} else {
				document.getElementById("txt_prixWeb").value=getCellText(arbre,i,'ColPrixWeb');
			}

			// Y a plus qu'a calculer les différents indicateurs
			recalculer_marge_pc();
			recalculer_marge();
			recalculer_coef_pa();
			recalculer_coef_pv();

			mode_calcul_courant="MARGE_PC";
			valeur_en_cours=document.getElementById("txt_margePc").value;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function keyPressee_valeur(event) {
	try {
		if (event.keyCode==13) {
			clic_valider_liste();
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function keyPressee_unarticle(event) {
	try {
		if (event.keyCode==13) {
			clic_valider_article();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function clic_valider_liste() {
	try {

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


		if(modeCalcul=="PV_WEB") { message_confirm="Le prix des articles web est de "+valeur+"."; }
		else if(modeCalcul=="MARGE") { message_confirm="Le prix web correspond a une marge de "+valeur+"."; }
		else if(modeCalcul=="MARGE_PC") { message_confirm="Le prix web correspond a une marge de "+valeur+"%."; }
		else if(modeCalcul=="COEF_PV") { message_confirm="Le prix web est le prix de vente de OpenSi coefficienté de "+valeur+"."; }
		else if(modeCalcul=="COEF_PA") { message_confirm="Le prix web est le prix d'achat coefficienté de "+valeur+"."; }

		modifierPrixGroupe(reference, designation, famille1, famille2, marque, attribut1, attribut2, attribut3, modeCalcul, valeur);

	} catch (e) {
		recup_erreur(e);
	}
}


function clic_valider_article() {
	try	{

		bloquerInterface(true);

		var ref=document.getElementById("txt_ref").value;
		modifierPrixWeb(ref);

	}	catch (e)	{
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



function prix_web_modifie() {
	try	{
		
		mode_calcul_courant="PV_WEB";
		var nouveau_prix=document.getElementById("txt_prixWeb").value;
		valeur_en_cours=nouveau_prix;

		if (nouveau_prix!="") {
			if (isPositive(nouveau_prix)) {
				document.getElementById("txt_prixWeb").setAttribute('class',"contenu_correct");
				recalculer_marge_pc();
				recalculer_marge();
				recalculer_coef_pa();
				recalculer_coef_pv();
			} else {
				document.getElementById("txt_prixWeb").setAttribute('class',"contenu_incorrect");
			}
		} else {
			document.getElementById("txt_prixWeb").setAttribute('class',"contenu_correct");
		}
	}	catch (e)	{
		recup_erreur(e);
	}
}


function marge_modifie() {
	try	{
		
		mode_calcul_courant="MARGE";
		var nouvelle_marge=document.getElementById("txt_marge").value;
		valeur_en_cours=nouvelle_marge;

		if (nouvelle_marge!="") {
			if (isPositive(nouvelle_marge)) {
				document.getElementById("txt_marge").setAttribute('class',"contenu_correct");
				//calcul du nouveau prix web
				var PA=document.getElementById("txt_prixAchat").value;
				var nouveau_prixWeb=parseFloat(PA)+parseFloat(nouvelle_marge);
				document.getElementById("txt_prixWeb").value=""+nf.format(nouveau_prixWeb);
				//Recalcul des autres champs
				recalculer_marge_pc();
				recalculer_coef_pa();
				recalculer_coef_pv();
			} else {
				document.getElementById("txt_marge").setAttribute('class',"contenu_incorrect");
			}
		}
	}	catch (e)	{
		recup_erreur(e);
	}
}


function marge_pc_modifie() {
	try	{

		mode_calcul_courant="MARGE_PC";
		var nouvelle_marge=document.getElementById("txt_margePc").value;
		valeur_en_cours=nouvelle_marge;
		if (nouvelle_marge!="") {
			if (isPositive(nouvelle_marge)) {
				document.getElementById("txt_margePc").setAttribute('class',"contenu_correct");

				//calcul du nouveau prix web
				var PA=document.getElementById("txt_prixAchat").value;
				var nouveau_prixWeb=parseFloat(PA)*(100/(100-nouvelle_marge));

				document.getElementById("txt_prixWeb").value=""+nf.format(nouveau_prixWeb);
				//Recalcul des autres champs
				recalculer_marge();
				recalculer_coef_pa();
				recalculer_coef_pv();
			} else {
				document.getElementById("txt_margePc").setAttribute('class',"contenu_incorrect");
			}
		}
	}	catch (e)	{
		recup_erreur(e);
	}
}


function coef_pa_modifie() {
	try	{
		
		mode_calcul_courant="COEF_PA";
		var nouveau_coef=document.getElementById("txt_coef_pa").value;
		valeur_en_cours=nouveau_coef;

		if (nouveau_coef!="") {
			if (isPositive(nouveau_coef)) {
				document.getElementById("txt_coef_pa").setAttribute('class',"contenu_correct");

				//calcul du nouveau prix web
				var PA=document.getElementById("txt_prixAchat").value;
				var nouveau_prixWeb=parseFloat(nouveau_coef)*parseFloat(PA);

				document.getElementById("txt_prixWeb").value=""+nf.format(nouveau_prixWeb);
				//Recalcul des autres champs
				recalculer_marge();
				recalculer_marge_pc();
				recalculer_coef_pv();
			} else {
				document.getElementById("txt_coef_pa").setAttribute('class',"contenu_incorrect");
			}
		}
	}	catch (e)	{
		recup_erreur(e);
	}
}


function coef_pv_modifie() {
	try	{
		
		mode_calcul_courant="COEF_PV";
		var nouveau_coef=document.getElementById("txt_coef_pv").value;
		valeur_en_cours=nouveau_coef;

		if (nouveau_coef!="") {
			if (isPositive(nouveau_coef)) {
				document.getElementById("txt_coef_pv").setAttribute('class',"contenu_correct");

				//calcul du nouveau prix web
				var PV=document.getElementById("txt_prixVente").value;
				var nouveau_prixWeb=parseFloat(nouveau_coef)*parseFloat(PV);

				document.getElementById("txt_prixWeb").value=""+nf.format(nouveau_prixWeb);
				//Recalcul des autres champs
				recalculer_marge();
				recalculer_coef_pa();
				recalculer_marge_pc();
			} else {
				document.getElementById("txt_coef_pv").setAttribute('class',"contenu_incorrect");
			}
		}
	}	catch (e)	{
		recup_erreur(e);
	}
}


function modifierPrixGroupe(reference, designation, famille1, famille2, marque, attribut1, attribut2, attribut3, modeCalcul, valeur) {
	try {

		var queryHttp = new QueryHttp("WebManager/attrib_caracs/modifPrixWeb.tmpl");

		queryHttp.setParam("id_article", "");
		queryHttp.setParam("site_id",site_id);
		queryHttp.setParam("reference",reference);
		queryHttp.setParam("designation",designation);
		queryHttp.setParam("famille1",famille1);
		queryHttp.setParam("famille2",famille2);
		queryHttp.setParam("marque", marque);
		queryHttp.setParam("attribut1", attribut1);
		queryHttp.setParam("attribut2", attribut2);
		queryHttp.setParam("attribut3", attribut3);
		queryHttp.setParam("typeCalcul", modeCalcul);
		queryHttp.setParam("valeur",valeur);

		queryHttp.execute(reqGoupeTerminee);

	}	catch (e)	{
		recup_erreur(e);
	}
}


function reqGoupeTerminee() {
	try {

		bloquerInterface(false);

		//pour rafraichir
		rechercher();
		document.getElementById('lb_confirmation').value=message_confirm;
		document.getElementById('txt_valeur').value="";

	} catch (e) {
		recup_erreur(e);
	}
}



function modifierPrixWeb(id_article) {
	try {
		if (valeur_en_cours!="" && mode_calcul_courant!="") {
			var queryHttp = new QueryHttp("WebManager/attrib_caracs/modifPrixWeb.tmpl");

			queryHttp.setParam("id_article", id_article);
			queryHttp.setParam("site_id",site_id);
			queryHttp.setParam("typeCalcul", mode_calcul_courant);
			queryHttp.setParam("valeur",valeur_en_cours);

			queryHttp.execute(reqSoloTerminee);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function reqSoloTerminee() {
	try {
		bloquerInterface(false);

		var arbre=document.getElementById("tree_articles");
		selection_arbre=arbre.view.selection.currentIndex;
		//pour rafraichir
		rechercher();

	} catch (e) {
		recup_erreur(e);
	}

}


//Met à jour l'information sur la recherche d'articles en cours
function MAJInfo() {
	try {
		var result="";

		var ref=document.getElementById("txt_reference").value;
		if (ref=="") {
			//result+="Toutes les références";
		} else {
			result+=" "+ref+"...";
		}


		var des=document.getElementById("txt_designation").value;
		if (des=="") {
			//result+=", toutes les désignations";
		} else {
			result+=", "+des+"...";
		}


		var fam1=document.getElementById("menulist_familles1").value;
		if (fam1=="0") {
			//result+=", toutes les familles";
		}
		else {
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

		document.getElementById("txt_info").value=result;

	} catch (e) {
		recup_erreur(e);
	}
}



function recalculer_marge_pc() {
	try {
		var montant_prixWeb=document.getElementById("txt_prixWeb").value;
		var PA=document.getElementById("txt_prixAchat").value;
		var marge_montant=montant_prixWeb-PA;

		if (PA==0) {
			document.getElementById("txt_margePc").value="IMPOSSIBLE";
			document.getElementById("txt_margePc").setAttribute("readonly",true);
		} else {
			var marge_pc=(100*parseFloat(marge_montant))/montant_prixWeb;
			document.getElementById("txt_margePc").value=""+nf.format(marge_pc);

			if(marge_pc<0) {
				document.getElementById("txt_margePc").setAttribute('class',"contenu_incorrect");
			} else {
				document.getElementById("txt_margePc").setAttribute('class',"contenu_correct");
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function recalculer_marge() {
	try {
		var montant_prixWeb=document.getElementById("txt_prixWeb").value;
		var PA=document.getElementById("txt_prixAchat").value;

		var marge_montant=montant_prixWeb-PA;

		document.getElementById("txt_marge").value=""+nf.format(marge_montant);

		if(marge_montant<0) {
			document.getElementById("txt_marge").setAttribute('class',"contenu_incorrect");
		} else {
			document.getElementById("txt_marge").setAttribute('class',"contenu_correct");
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function recalculer_coef_pa() {
	try {

		var montant_prixWeb=document.getElementById("txt_prixWeb").value;
		var PA=document.getElementById("txt_prixAchat").value;
		if (PA==0) {
			document.getElementById("txt_coef_pa").value="IMPOSSIBLE";
			document.getElementById("txt_coef_pa").setAttribute("readonly",true);
		} else {
			var coef_pa=parseFloat(montant_prixWeb)/parseFloat(PA);
			document.getElementById("txt_coef_pa").value=""+nfc.format(coef_pa);

			if(coef_pa<0) {
				document.getElementById("txt_coef_pa").setAttribute('class',"contenu_incorrect");
			} else {
				document.getElementById("txt_coef_pa").setAttribute('class',"contenu_correct");
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function recalculer_coef_pv() {
	try {
		var montant_prixWeb=document.getElementById("txt_prixWeb").value;
		var PV=document.getElementById("txt_prixVente").value;

		if (PV==0) {
			document.getElementById("txt_coef_pv").value="IMPOSSIBLE";
			document.getElementById("txt_coef_pv").setAttribute("readonly",true);
		} else {
			var coef_pv=montant_prixWeb/PV;
			document.getElementById("txt_coef_pv").value=""+nfc.format(coef_pv);

			if(coef_pv<0) {
				document.getElementById("txt_coef_pv").setAttribute('class',"contenu_incorrect");
			} else {
				document.getElementById("txt_coef_pv").setAttribute('class',"contenu_correct");
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}




function keyPressee(event) {
	try {
		if (event.keyCode==13) {
			document.getElementById('boite_un_article').hidden=true;
			document.getElementById('boite_liste_article').hidden=false;
			rechercher();
			MAJInfo();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function rechercher_famille() {
	try {
		document.getElementById('boite_un_article').hidden=true;
		document.getElementById('boite_liste_article').hidden=false;

		adapter_famille2();

		rechercher();
		MAJInfo();

	} catch (e) {
		recup_erreur(e);
	}
}


function pre_rechercher() {
	try {
		document.getElementById('boite_un_article').hidden=true;
		document.getElementById('boite_liste_article').hidden=false;
		rechercher();
		MAJInfo();
	} catch (e) {
		recup_erreur(e);
	}
}


//appelée quand on choisi dans les listes déroulantes
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

	} catch (e) {
		recup_erreur(e);
	}
}



function fin_init_tree() {
	try {

		if(selection_arbre>-1) {
			//on remet la selection
			var arbre=document.getElementById("tree_articles");
			arbre.view.selection.select(selection_arbre);
			selection_arbre=-1;
		}
	} catch (e) {
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


function etape_precedente() {
	try {
		if (source=="INIT") {
			window.location = "chrome://opensi/content/web_manager/attrib_caracs_web/selection_web_articles.xul?"+ cookie()+"&site_id="+site_id+"&nom_site="+nom_site;
		} else {
			window.location = "chrome://opensi/content/web_manager/attrib_caracs_web/selection_web_articles.xul?"+ cookie()+"&site_id="+site_id+"&nom_site="+nom_site;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function etape_suivante() {
	try {
		window.location = "chrome://opensi/content/web_manager/attrib_caracs_web/rapportCoherencePrix.xul?"+ cookie() +"&site_id="+site_id+"&nom_site="+nom_site+"&source="+source;
	} catch (e) {
		recup_erreur(e);
	}
}


function menuWebManager() {
	try {
  	window.location = "chrome://opensi/content/web_manager/menu_e_commerce.xul?"+ cookie();
	} catch (e) {
    recup_erreur(e);
  }
}


function menuGestionSite() {
	try {

		var page = "chrome://opensi/content/web_manager/modifications/menu_gestion_site.xul?"+ cookie();
		page+="&site_id="+site_id+"&nom_site="+nom_site;
		window.location =page;

	} catch (e) {
    recup_erreur(e);
  }
}

function menuSite() {
	try {
  	window.location = "chrome://opensi/content/web_manager/modifications/choisir_un_site.xul?"+ cookie();
	} catch (e) {
    recup_erreur(e);
  }
}

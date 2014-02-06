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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var element;

// Prix de Vente
var pourc_pv_t1;
var pourc_pv_t2;
var pourc_pv_t3;
var pourc_pv_t4;
var pourc_pv_t5;
var pourc_pv_ts;
var eur_pv_t1;
var eur_pv_t2;
var eur_pv_t3;
var eur_pv_t4;
var eur_pv_t5;

// Coeff
var coeff_t1;
var coeff_t2;
var coeff_t3;
var coeff_t4;
var coeff_t5;

// Marge
var marge_t1;
var marge_t2;
var marge_t3;
var marge_t4;
var marge_t5;

// Prix d'Achat
var chk_spec;
var chk_repercution;
var type_repercution;
var type_repercution_spec;
var mode_calcul;
var valeur;

// Filtre
var critere;
var refArticle;
var famille1;
var famille2;
var famille3;
var marque;
var fournisseur;

var cur_page_tarifs;
var max_page_tarifs;

var aFamille1 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_1');
var aFamille2 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_2');
var aFamille3 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_3');
var aMarques = new Arbre("Facturation/GetRDF/combo-marquesArticle.tmpl","liste_marques");
var aFournisseurs = new Arbre("Facturation/GetRDF/liste_fournisseurs_tous_article.tmpl","liste_fournisseurs");

var aTarifs = new Arbre("Facturation/GetRDF/liste_maj_tarifs.tmpl","tarifs");


function init() {
	try {
		
		var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var p=qParam.execute();
		document.getElementById('lblTarif1').value = p.responseXML.documentElement.getAttribute('Label_Tarif_1');
		document.getElementById('lblTarif2').value = p.responseXML.documentElement.getAttribute('Label_Tarif_2');
		document.getElementById('lblTarif3').value = p.responseXML.documentElement.getAttribute('Label_Tarif_3');
		document.getElementById('lblTarif4').value = p.responseXML.documentElement.getAttribute('Label_Tarif_4');
		document.getElementById('lblTarif5').value = p.responseXML.documentElement.getAttribute('Label_Tarif_5');
	
		document.getElementById("deck").selectedIndex = 0;
		document.getElementById("rgp_element").value = "0";
		document.getElementById('lbl_unite').setAttribute("value", "\u20AC");
		document.getElementById('lbl_unite_2').setAttribute("value", "\u20AC");
		initBoxTarifs();
		document.getElementById("rgp_repercution").value = "0";
		document.getElementById("rgp_repercution_spec").value = "0";
		document.getElementById("rgp_calcul").value = "0";
		
		document.getElementById("rgp_critere").value = "0";
		
		document.getElementById('bPrecTarifs').disabled = true;
		document.getElementById('bSuivTarifs').disabled = true;
		
		aFamille1.initTree(initFamille1);
		aMarques.initTree(initMarques);
		aFournisseurs.initTree(initFournisseurs);
	
	}	catch(e){
		recup_erreur(e);
	}
}


function initFamille1() {
  try {

		document.getElementById('Famille_1').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles2() {
	try {
  	
		aFamille2.setParam('Parent_Id', document.getElementById('Famille_1').value);
		aFamille2.initTree(initFamille2);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille2() {
  try {

		document.getElementById('Famille_2').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles3() {
	try {
  	
		aFamille3.setParam('Parent_Id', document.getElementById('Famille_2').value);
		aFamille3.initTree(initFamille3);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille3() {
  try {

		document.getElementById('Famille_3').selectedIndex = 0;

	} catch (e) {
		recup_erreur(e);
	}
}


function initMarques() {
	try {
		document.getElementById("liste_marques").selectedIndex=0;
	} catch (e) {
		recup_erreur(e);
	}
}

function initFournisseurs() {
	try {
		document.getElementById("liste_fournisseurs").selectedIndex=0;
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnElement() {
	try {
		var elem = document.getElementById("rgp_element").value;
		
		document.getElementById("box_tarifs").collapsed = (elem=="4");
		document.getElementById("options_achat").collapsed = (elem!="4");
		document.getElementById("fournisseur").collapsed = (elem!="4");
		document.getElementById("calcul_pa").collapsed = (elem!="4");
		
		if (elem=="4") {
			document.getElementById("rgp_calcul").value="0";
			pressOnCalcul();

			document.getElementById("chk_repercution").checked=true;
			document.getElementById("chk_spec").collapsed=false;
			document.getElementById("chk_spec").checked=false;
			checkTarifSpecifique(false);
			document.getElementById("rgp_repercution").disabled=false;
		} else {
			
			if (document.getElementById("rgp_critere").value=="3") {
				document.getElementById("rgp_critere").value="0";
				pressOnCritere();
			} else {
				desactiverValidation(); // fonction appelée dans tous les cas, mais indirectement dans les conditions précédentes
			}
		}
		initBoxTarifs();
	}
	catch(e){
		recup_erreur(e);
	}
}


function initBoxTarifs() {
	try {
		var elem = document.getElementById("rgp_element").value;
		
		for (var i=0; i<7; i++) {
			document.getElementById("Col_Pourc_PV_"+i).collapsed = (elem!="0" && elem != "1");
			document.getElementById("Col_Eur_PV_"+i).collapsed = (elem!="0" && elem != "1");
			document.getElementById("Col_Coeff_"+i).collapsed = (elem!="2");
			document.getElementById("Col_Marge_"+i).collapsed = (elem!="3");
		}

		document.getElementById("ligne_ts").collapsed = (elem!="0" && elem != "1");
		document.getElementById("aide_pv").collapsed = (elem!="0" && elem != "1");
		document.getElementById("aide_coeff").collapsed = (elem!="2");
		document.getElementById("aide_marge").collapsed = (elem!="3");
		
		switch (elem) {
			case "0":
			case "1":
				for (var i=1; i<6; i++) {
					document.getElementById("Pourc_PV_T"+i).value="";
					document.getElementById("Eur_PV_T"+i).value="";
				}
				document.getElementById("Pourc_PV_TS").value="";
			break;
			
			case "2":
				for (var i=1; i<6; i++) {
					document.getElementById("Coeff_T"+i).value="";
				}
			break;
			
			case "3":
				for (var i=1; i<6; i++) {
					document.getElementById("Marge_T"+i).value="";
				}
			break;
			case "4":
				for (var i=1; i<6; i++) {
					document.getElementById("Pourc_PV_T"+i).value="";
					document.getElementById("Eur_PV_T"+i).value="";
				}
				document.getElementById("Pourc_PV_TS").value="";
				for (var i=1; i<6; i++) {
					document.getElementById("Coeff_T"+i).value="";
				}
				for (var i=1; i<6; i++) {
					document.getElementById("Marge_T"+i).value="";
				}
			break;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function vider(champ) {
	try {
		document.getElementById(champ).value="";
		desactiverValidation();
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnFamille1() {
	try {
		document.getElementById("Famille_2").collapsed = (document.getElementById('Famille_1').selectedIndex==0);
		if (document.getElementById('Famille_1').selectedIndex==0) {
			document.getElementById("Famille_3").collapsed = true;
		}
		chargerFamilles2();
		aFamille3.deleteTree();
		initFamille3();
		desactiverValidation();
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnFamille2() {
	try {
		document.getElementById("Famille_3").collapsed = (document.getElementById('Famille_2').selectedIndex==0);
		chargerFamilles3();
		desactiverValidation();
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnCritere() {
	try {
		var critere = document.getElementById("rgp_critere").value;
		
		document.getElementById("txt_refArticle").disabled = (critere!="1");
		document.getElementById("Famille_1").disabled = (critere!="2");
		document.getElementById("Famille_2").disabled = (critere!="2");
		document.getElementById("Famille_3").disabled = (critere!="2");
		document.getElementById("chk_marque").disabled = (critere!="2");
		document.getElementById("liste_marques").disabled = (critere!="2" || !document.getElementById("chk_marque").checked);
		document.getElementById("liste_fournisseurs").disabled = (critere!="3");
		desactiverValidation();
		
	}
	catch(e){
		recup_erreur(e);
	}
}


function pressOnCalcul(){
	try {
		var mode_calcul = document.getElementById("rgp_calcul").value;
		document.getElementById("txt_pourcentage").disabled = (mode_calcul!="0");
		document.getElementById("txt_montant").disabled = (mode_calcul!="1");
		document.getElementById("txt_pourcentage").value="";
		document.getElementById("txt_montant").value="";
		desactiverValidation();
	}
	catch(e){
		recup_erreur(e);
	}
}


function checkTarifSpecifique(b) {
	try {
		document.getElementById("montant").collapsed=b;
		document.getElementById("rgp_repercution_spec").collapsed=!b;
		if (b) {
			document.getElementById("rgp_calcul").value="0";
			document.getElementById("txt_pourcentage").disabled=false;
			document.getElementById("txt_montant").disabled=true;
			document.getElementById("txt_montant").value="";
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function checkRepercution(b) {
	try {
		document.getElementById("chk_spec").collapsed=!b;
		document.getElementById("rgp_repercution").disabled=!b;
		if (!b) {
			document.getElementById("chk_spec").checked=false;
			checkTarifSpecifique(false);
		}
		desactiverValidation();
	} catch (e) {
		recup_erreur(e);
	}
}


function checkMarque(b) {
	try {
		document.getElementById("liste_marques").disabled=!b;
		desactiverValidation();
	} catch (e) {
		recup_erreur(e);
	}
}


function desactiverValidation() {
	try {
		document.getElementById("bEditerPdf").disabled = true;
		document.getElementById("bEditerCsv").disabled = true;
		document.getElementById("bValider").disabled = true;
	} catch (e) {
		recup_erreur(e);
	}
}


function pageTarifsSuiv() {
	try {
		cur_page_tarifs++;
		document.getElementById('PageDebTarifs').value = cur_page_tarifs;
		document.getElementById('bPrecTarifs').disabled = false;
		document.getElementById('bSuivTarifs').disabled = (cur_page_tarifs==max_page_tarifs);
		initTarifs();
	} catch (e) {
		recup_erreur(e);
	}
}

function pageTarifsPrec() {
	try {
		cur_page_tarifs--;
		document.getElementById('PageDebTarifs').value = cur_page_tarifs;
		document.getElementById('bPrecTarifs').disabled = (cur_page_tarifs==1);
		document.getElementById('bSuivTarifs').disabled = false;
		initTarifs();
	} catch (e) {
		recup_erreur(e);
	}
}


function initTarifs() {
  try {
		aTarifs.setParam("Page_Deb", cur_page_tarifs);
		aTarifs.initTree();
  } catch (e) {
    recup_erreur(e);
  }
}




function calculer() {
	try {
		
		element = document.getElementById("rgp_element").value;
		
		// Prix de Vente, Coeff et Marge
		pourc_pv_t1 = (element=="0" || element=="1"?document.getElementById("Pourc_PV_T1").value:"");
		pourc_pv_t2 = (element=="0" || element=="1"?document.getElementById("Pourc_PV_T2").value:"");
		pourc_pv_t3 = (element=="0" || element=="1"?document.getElementById("Pourc_PV_T3").value:"");
		pourc_pv_t4 = (element=="0" || element=="1"?document.getElementById("Pourc_PV_T4").value:"");
		pourc_pv_t5 = (element=="0" || element=="1"?document.getElementById("Pourc_PV_T5").value:"");
		pourc_pv_ts = (element=="0" || element=="1"?document.getElementById("Pourc_PV_TS").value:"");
		eur_pv_t1 = (element=="0" || element=="1"?document.getElementById("Eur_PV_T1").value:"");
		eur_pv_t2 = (element=="0" || element=="1"?document.getElementById("Eur_PV_T2").value:"");
		eur_pv_t3 = (element=="0" || element=="1"?document.getElementById("Eur_PV_T3").value:"");
		eur_pv_t4 = (element=="0" || element=="1"?document.getElementById("Eur_PV_T4").value:"");
		eur_pv_t5 = (element=="0" || element=="1"?document.getElementById("Eur_PV_T5").value:"");
		coeff_t1 = (element=="2"?document.getElementById("Coeff_T1").value:"");
		coeff_t2 = (element=="2"?document.getElementById("Coeff_T2").value:"");
		coeff_t3 = (element=="2"?document.getElementById("Coeff_T3").value:"");
		coeff_t4 = (element=="2"?document.getElementById("Coeff_T4").value:"");
		coeff_t5 = (element=="2"?document.getElementById("Coeff_T5").value:"");
		marge_t1 = (element=="3"?document.getElementById("Marge_T1").value:"");
		marge_t2 = (element=="3"?document.getElementById("Marge_T2").value:"");
		marge_t3 = (element=="3"?document.getElementById("Marge_T3").value:"");
		marge_t4 = (element=="3"?document.getElementById("Marge_T4").value:"");
		marge_t5 = (element=="3"?document.getElementById("Marge_T5").value:"");
		
		// Prix d'Achat
		chk_repercution = (element=="4"?document.getElementById("chk_repercution").checked:false);
		type_repercution = (chk_repercution?document.getElementById("rgp_repercution").value:"0");
		chk_spec = (chk_repercution?document.getElementById("chk_spec").checked:false);
		type_repercution_spec = (chk_spec?document.getElementById("rgp_repercution_spec").value:"0");
		mode_calcul = document.getElementById("rgp_calcul").value;
		valeur = (mode_calcul=="0"?document.getElementById("txt_pourcentage").value:document.getElementById("txt_montant").value);
		
		// Filtre
		critere = document.getElementById("rgp_critere").value;
		refArticle = (critere=="1"?document.getElementById("txt_refArticle").value:"");		
		famille1 = (critere=="2"?document.getElementById("Famille_1").value:"0");
		famille2 = (critere=="2" && famille1!="0"?document.getElementById("Famille_2").value:"0");
		famille3 = (critere=="2" && famille2!="0"?document.getElementById("Famille_3").value:"0");
		marque = (critere=="2" && document.getElementById("chk_marque").checked && document.getElementById("liste_marques").selectedIndex!=0?document.getElementById("liste_marques").value:"0");
		fournisseur = (critere=="3" && document.getElementById("liste_fournisseurs").selectedIndex!=0?document.getElementById("liste_fournisseurs").value:"");
		
		if (critere=="1" && isEmpty(refArticle)) { showWarning("Veuillez saisir une référence d'article !"); }
		else if (critere=="2" && document.getElementById("chk_marque").checked && document.getElementById("liste_marques").selectedIndex==0) { showWarning("Veuillez choisir une marque !"); }
		else if (critere=="3" && document.getElementById("liste_fournisseurs").selectedIndex==0) { showWarning("Veuiller choisir un fournisseur !"); }
		else if (checkTarifs() && checkMethodeCalculArticles()) {
		
			document.getElementById("bCalculer").disabled = true;
			
			var qNbPages = new QueryHttp("Facturation/MajTarifs/getNbPages.tmpl");
			qNbPages.setParam("Critere", critere);
			qNbPages.setParam("Ref_Article", refArticle);
			qNbPages.setParam("Famille_1", famille1);
			qNbPages.setParam("Famille_2", famille2);
			qNbPages.setParam("Famille_3", famille3);
			qNbPages.setParam("Marque", marque);
			qNbPages.setParam("Fournisseur", fournisseur);
			var p = qNbPages.execute();

			max_page_tarifs = p.responseXML.documentElement.getAttribute('NbPagesTarifs');
			if (max_page_tarifs<1) {
				max_page_tarifs = 1;
			}
			cur_page_tarifs = 1;
			document.getElementById('pagination').collapsed=(max_page_tarifs==1);
			document.getElementById('PageDebTarifs').value = cur_page_tarifs;
			document.getElementById('PageFinTarifs').value = max_page_tarifs;
			document.getElementById('bPrecTarifs').disabled = true;
			document.getElementById('bSuivTarifs').disabled = (max_page_tarifs==1);
				
			aTarifs.setParam("Element", element);
			
			// Prix de Vente, Coeff, Marge
			aTarifs.setParam("Pourc_PV_T1", pourc_pv_t1);
			aTarifs.setParam("Pourc_PV_T2", pourc_pv_t2);
			aTarifs.setParam("Pourc_PV_T3", pourc_pv_t3);
			aTarifs.setParam("Pourc_PV_T4", pourc_pv_t4);
			aTarifs.setParam("Pourc_PV_T5", pourc_pv_t5);
			aTarifs.setParam("Pourc_PV_TS", pourc_pv_ts);
			aTarifs.setParam("Eur_PV_T1", eur_pv_t1);
			aTarifs.setParam("Eur_PV_T2", eur_pv_t2);
			aTarifs.setParam("Eur_PV_T3", eur_pv_t3);
			aTarifs.setParam("Eur_PV_T4", eur_pv_t4);
			aTarifs.setParam("Eur_PV_T5", eur_pv_t5);
			aTarifs.setParam("Coeff_T1", coeff_t1);
			aTarifs.setParam("Coeff_T2", coeff_t2);
			aTarifs.setParam("Coeff_T3", coeff_t3);
			aTarifs.setParam("Coeff_T4", coeff_t4);
			aTarifs.setParam("Coeff_T5", coeff_t5);
			aTarifs.setParam("Marge_T1", marge_t1);
			aTarifs.setParam("Marge_T2", marge_t2);
			aTarifs.setParam("Marge_T3", marge_t3);
			aTarifs.setParam("Marge_T4", marge_t4);
			aTarifs.setParam("Marge_T5", marge_t5);
			
			// Prix d'Achat
			aTarifs.setParam("Repercution", chk_repercution);
			aTarifs.setParam("Type_Repercution", type_repercution);
			aTarifs.setParam("Tarif_Spec", chk_spec);
			aTarifs.setParam("Type_Repercution_Spec", type_repercution_spec);
			aTarifs.setParam("Mode_Calcul", mode_calcul);
			aTarifs.setParam("Valeur", valeur);
			
			// Filtre
			aTarifs.setParam("Critere", critere);
			aTarifs.setParam("Ref_Article", refArticle);
			aTarifs.setParam("Famille_1", famille1);
			aTarifs.setParam("Famille_2", famille2);
			aTarifs.setParam("Famille_3", famille3);
			aTarifs.setParam("Marque", marque);
			aTarifs.setParam("Fournisseur", fournisseur);
			
			aTarifs.setParam("Page_Deb", cur_page_tarifs);
			aTarifs.initTree(afficherColonnes);
		}
	}
	catch(e){
		recup_erreur(e);
	}
}


function checkTarifs() {
	try {
		var saisieOk = false;
		var erreur = false;

		switch (element) {
			case "0":
			case "1":
				saisieOk = (!isEmpty(pourc_pv_t1) || !isEmpty(pourc_pv_t2) || !isEmpty(pourc_pv_t3) || !isEmpty(pourc_pv_t4) || !isEmpty(pourc_pv_t5) || !isEmpty(pourc_pv_ts)
									|| !isEmpty(eur_pv_t1) || !isEmpty(eur_pv_t2) || !isEmpty(eur_pv_t3) || !isEmpty(eur_pv_t4) || !isEmpty(eur_pv_t5));
				
				erreur = ((!isEmpty(pourc_pv_t1) && (!checkNumber(pourc_pv_t1,5,2) || parseFloat(pourc_pv_t1)<-100))
									|| (!isEmpty(pourc_pv_t2) && (!checkNumber(pourc_pv_t2,5,2) || parseFloat(pourc_pv_t2)<-100))
									|| (!isEmpty(pourc_pv_t3) && (!checkNumber(pourc_pv_t3,5,2) || parseFloat(pourc_pv_t3)<-100))
									|| (!isEmpty(pourc_pv_t4) && (!checkNumber(pourc_pv_t4,5,2) || parseFloat(pourc_pv_t4)<-100))
									|| (!isEmpty(pourc_pv_t5) && (!checkNumber(pourc_pv_t5,5,2) || parseFloat(pourc_pv_t5)<-100))
									|| (!isEmpty(pourc_pv_ts) && (!checkNumber(pourc_pv_ts,5,2) || parseFloat(pourc_pv_ts)<-100))
									
									|| (!isEmpty(eur_pv_t1) && !checkNumber(eur_pv_t1,14,4))
									|| (!isEmpty(eur_pv_t2) && !checkNumber(eur_pv_t1,14,4))
									|| (!isEmpty(eur_pv_t3) && !checkNumber(eur_pv_t1,14,4))
									|| (!isEmpty(eur_pv_t4) && !checkNumber(eur_pv_t1,14,4))
									|| (!isEmpty(eur_pv_t5) && !checkNumber(eur_pv_t1,14,4))

									);
			break;
			
			case "2":
				saisieOk = (!isEmpty(coeff_t1) || !isEmpty(coeff_t2) || !isEmpty(coeff_t3) || !isEmpty(coeff_t4) || !isEmpty(coeff_t5));
				
				erreur = ((!isEmpty(coeff_t1) && (!checkNumber(coeff_t1,10,6) || parseFloat(coeff_t1)<1))
									|| (!isEmpty(coeff_t2) && (!checkNumber(coeff_t2,10,6) || parseFloat(coeff_t2)<1))
									|| (!isEmpty(coeff_t3) && (!checkNumber(coeff_t3,10,6) || parseFloat(coeff_t3)<1))
									|| (!isEmpty(coeff_t4) && (!checkNumber(coeff_t4,10,6) || parseFloat(coeff_t4)<1))
									|| (!isEmpty(coeff_t5) && (!checkNumber(coeff_t5,10,6) || parseFloat(coeff_t5)<1))
								);
			break;
			
			case "3":
				saisieOk = (!isEmpty(marge_t1) || !isEmpty(marge_t2) || !isEmpty(marge_t3) || !isEmpty(marge_t4) || !isEmpty(marge_t5));
				
				erreur = ((!isEmpty(marge_t1) && (!isTaux(marge_t1) || parseFloat(marge_t1)==100))
									|| (!isEmpty(marge_t2) && (!isTaux(marge_t2) || parseFloat(marge_t2)==100))
									|| (!isEmpty(marge_t3) && (!isTaux(marge_t3) || parseFloat(marge_t3)==100))
									|| (!isEmpty(marge_t4) && (!isTaux(marge_t4) || parseFloat(marge_t4)==100))
									|| (!isEmpty(marge_t5) && (!isTaux(marge_t5) || parseFloat(marge_t5)==100))
								);
			break;
			
			case "4":
				saisieOk = (!isEmpty(valeur));
				if (!isEmpty(valeur)) {
					erreur = ((mode_calcul=="0" && (!checkNumber(valeur,5,2) || parseFloat(valeur)<-100))
									|| (mode_calcul=="1" && !checkNumber(valeur,14,4))
								);
				}
			break;
		}
	
		if (!saisieOk) { showWarning("Vous n'avez rien saisi !"); }
		else if (erreur) { showWarning("Votre saisie comporte des erreurs !"); }
		
		return (saisieOk && !erreur);
	}
	catch(e){
		recup_erreur(e);
	}
}


function checkMethodeCalculArticles() {
	try {
		var ok=true;
		
		if (element=="2" || element=="3") {
			var t1 = (element=="2"?!isEmpty(coeff_t1):!isEmpty(marge_t1));
			var t2 = (element=="2"?!isEmpty(coeff_t2):!isEmpty(marge_t2));
			var t3 = (element=="2"?!isEmpty(coeff_t3):!isEmpty(marge_t3));
			var t4 = (element=="2"?!isEmpty(coeff_t4):!isEmpty(marge_t4));
			var t5 = (element=="2"?!isEmpty(coeff_t5):!isEmpty(marge_t5));
			
			var qVerifMethode = new QueryHttp("Facturation/MajTarifs/checkMethodeCalcul.tmpl");
			qVerifMethode.setParam("Element", element);
			qVerifMethode.setParam("Critere", critere);
			qVerifMethode.setParam("Ref_Article", refArticle);
			qVerifMethode.setParam("Famille_1", famille1);
			qVerifMethode.setParam("Famille_2", famille2);
			qVerifMethode.setParam("Famille_3", famille3);
			qVerifMethode.setParam("Marque", marque);
			qVerifMethode.setParam("Tarifs_1", t1);
			qVerifMethode.setParam("Tarifs_2", t2);
			qVerifMethode.setParam("Tarifs_3", t3);
			qVerifMethode.setParam("Tarifs_4", t4);
			qVerifMethode.setParam("Tarifs_5", t5);
			var p=qVerifMethode.execute();
			if (p.responseXML.documentElement.getAttribute("retour")=="false") {
				ok = window.confirm("Attention, les "+ (element=="2"?"coefficients":"marges") + " des articles ne sont pas identiques pour les tarifs modifiés ! Continuer ?");
			}
		}
		
		return ok;
	} catch (e) {
		recup_erreur(e);
	}
}



function afficherColonnes() {
	try {
		document.getElementById("ColAncPVHT1").hidden = (element!="0" || (isEmpty(pourc_pv_t1) && isEmpty(eur_pv_t1)));
		document.getElementById("ColNvPVHT1").hidden = (element!="0" || (isEmpty(pourc_pv_t1) && isEmpty(eur_pv_t1)));
		document.getElementById("ColAncPVHT2").hidden = (element!="0" || (isEmpty(pourc_pv_t2) && isEmpty(eur_pv_t2)));
		document.getElementById("ColNvPVHT2").hidden = (element!="0" || (isEmpty(pourc_pv_t2) && isEmpty(eur_pv_t2)));
		document.getElementById("ColAncPVHT3").hidden = (element!="0" || (isEmpty(pourc_pv_t3) && isEmpty(eur_pv_t3)));
		document.getElementById("ColNvPVHT3").hidden = (element!="0" || (isEmpty(pourc_pv_t3) && isEmpty(eur_pv_t3)));
		document.getElementById("ColAncPVHT4").hidden = (element!="0" || (isEmpty(pourc_pv_t4) && isEmpty(eur_pv_t4)));
		document.getElementById("ColNvPVHT4").hidden = (element!="0" || (isEmpty(pourc_pv_t4) && isEmpty(eur_pv_t4)));
		document.getElementById("ColAncPVHT5").hidden = (element!="0" || (isEmpty(pourc_pv_t5) && isEmpty(eur_pv_t5)));
		document.getElementById("ColNvPVHT5").hidden = (element!="0" || (isEmpty(pourc_pv_t5) && isEmpty(eur_pv_t5)));
		document.getElementById("ColTVA").hidden = (element!="1");
		document.getElementById("ColAncPVTTC1").hidden = (element!="1" || (isEmpty(pourc_pv_t1) && isEmpty(eur_pv_t1)));
		document.getElementById("ColNvPVTTC1").hidden = (element!="1" || (isEmpty(pourc_pv_t1) && isEmpty(eur_pv_t1)));
		document.getElementById("ColAncPVTTC2").hidden = (element!="1" || (isEmpty(pourc_pv_t2) && isEmpty(eur_pv_t2)));
		document.getElementById("ColNvPVTTC2").hidden = (element!="1" || (isEmpty(pourc_pv_t2) && isEmpty(eur_pv_t2)));
		document.getElementById("ColAncPVTTC3").hidden = (element!="1" || (isEmpty(pourc_pv_t3) && isEmpty(eur_pv_t3)));
		document.getElementById("ColNvPVTTC3").hidden = (element!="1" || (isEmpty(pourc_pv_t3) && isEmpty(eur_pv_t3)));
		document.getElementById("ColAncPVTTC4").hidden = (element!="1" || (isEmpty(pourc_pv_t4) && isEmpty(eur_pv_t4)));
		document.getElementById("ColNvPVTTC4").hidden = (element!="1" || (isEmpty(pourc_pv_t4) && isEmpty(eur_pv_t4)));
		document.getElementById("ColAncPVTTC5").hidden = (element!="1" || (isEmpty(pourc_pv_t5) && isEmpty(eur_pv_t5)));
		document.getElementById("ColNvPVTTC5").hidden = (element!="1" || (isEmpty(pourc_pv_t5) && isEmpty(eur_pv_t5)));
		document.getElementById("ColAncCoeff1").hidden = (element!="2" || isEmpty(coeff_t1));
		document.getElementById("ColNvCoeff1").hidden = (element!="2" || isEmpty(coeff_t1));
		document.getElementById("ColAncCoeff2").hidden = (element!="2" || isEmpty(coeff_t2));
		document.getElementById("ColNvCoeff2").hidden = (element!="2" || isEmpty(coeff_t2));
		document.getElementById("ColAncCoeff3").hidden = (element!="2" || isEmpty(coeff_t3));
		document.getElementById("ColNvCoeff3").hidden = (element!="2" || isEmpty(coeff_t3));
		document.getElementById("ColAncCoeff4").hidden = (element!="2" || isEmpty(coeff_t4));
		document.getElementById("ColNvCoeff4").hidden = (element!="2" || isEmpty(coeff_t4));
		document.getElementById("ColAncCoeff5").hidden = (element!="2" || isEmpty(coeff_t5));
		document.getElementById("ColNvCoeff5").hidden = (element!="2" || isEmpty(coeff_t5));
		document.getElementById("ColAncMarge1").hidden = (element!="3" || isEmpty(marge_t1));
		document.getElementById("ColNvMarge1").hidden = (element!="3" || isEmpty(marge_t1));
		document.getElementById("ColAncMarge2").hidden = (element!="3" || isEmpty(marge_t2));
		document.getElementById("ColNvMarge2").hidden = (element!="3" || isEmpty(marge_t2));
		document.getElementById("ColAncMarge3").hidden = (element!="3" || isEmpty(marge_t3));
		document.getElementById("ColNvMarge3").hidden = (element!="3" || isEmpty(marge_t3));
		document.getElementById("ColAncMarge4").hidden = (element!="3" || isEmpty(marge_t4));
		document.getElementById("ColNvMarge4").hidden = (element!="3" || isEmpty(marge_t4));
		document.getElementById("ColAncMarge5").hidden = (element!="3" || isEmpty(marge_t5));
		document.getElementById("ColNvMarge5").hidden = (element!="3" || isEmpty(marge_t5));
		document.getElementById("ColAncPrixAchat").hidden = (element!="4");
		document.getElementById("ColNvPrixAchat").hidden = (element!="4");
		
		document.getElementById("bEditerPdf").disabled = false;
		document.getElementById("bEditerCsv").disabled = false;
		document.getElementById("bValider").disabled = false;
		document.getElementById("bCalculer").disabled = false;
	}
	catch(e){
		recup_erreur(e);
	}
}



function editerPdf() {
	try {

		var listeParams = "&Element="+ urlEncode(element);
		
		// Prix de Vente, Coeff, Marge
		listeParams += "&Pourc_PV_T1="+ urlEncode(pourc_pv_t1);
		listeParams += "&Pourc_PV_T2="+ urlEncode(pourc_pv_t2);
		listeParams += "&Pourc_PV_T3="+ urlEncode(pourc_pv_t3);
		listeParams += "&Pourc_PV_T4="+ urlEncode(pourc_pv_t4);
		listeParams += "&Pourc_PV_T5="+ urlEncode(pourc_pv_t5);
		listeParams += "&Pourc_PV_TS="+ urlEncode(pourc_pv_ts);
		listeParams += "&Eur_PV_T1="+ urlEncode(eur_pv_t1);
		listeParams += "&Eur_PV_T2="+ urlEncode(eur_pv_t2);
		listeParams += "&Eur_PV_T3="+ urlEncode(eur_pv_t3);
		listeParams += "&Eur_PV_T4="+ urlEncode(eur_pv_t4);
		listeParams += "&Eur_PV_T5="+ urlEncode(eur_pv_t5);
		listeParams += "&Coeff_T1="+ urlEncode(coeff_t1);
		listeParams += "&Coeff_T2="+ urlEncode(coeff_t2);
		listeParams += "&Coeff_T3="+ urlEncode(coeff_t3);
		listeParams += "&Coeff_T4="+ urlEncode(coeff_t4);
		listeParams += "&Coeff_T5="+ urlEncode(coeff_t5);
		listeParams += "&Marge_T1="+ urlEncode(marge_t1);
		listeParams += "&Marge_T2="+ urlEncode(marge_t2);
		listeParams += "&Marge_T3="+ urlEncode(marge_t3);
		listeParams += "&Marge_T4="+ urlEncode(marge_t4);
		listeParams += "&Marge_T5="+ urlEncode(marge_t5);
		
		// Prix d'Achat
		listeParams += "&Repercution="+ urlEncode(chk_repercution);
		listeParams += "&Type_Repercution="+ urlEncode(type_repercution);
		listeParams += "&Tarif_Spec="+ urlEncode(chk_spec);
		listeParams += "&Type_Repercution_Spec="+ urlEncode(type_repercution_spec);
		listeParams += "&Mode_Calcul="+ urlEncode(mode_calcul);
		listeParams += "&Valeur="+ urlEncode(valeur);
		
		// Filtre
		listeParams += "&Critere="+ urlEncode(critere);
		listeParams += "&Ref_Article="+ urlEncode(refArticle);
		listeParams += "&Famille_1="+ urlEncode(famille1);
		listeParams += "&Famille_2="+ urlEncode(famille2);
		listeParams += "&Famille_3="+ urlEncode(famille3);
		listeParams += "&Marque="+ urlEncode(marque);
		listeParams += "&Fournisseur="+ urlEncode(fournisseur);

		var page = getUrlOpeneas("&Page=Facturation/MajTarifs/majTarifsPdf.tmpl"+ listeParams);
		document.getElementById('pdf').setAttribute("src", page);	

		document.getElementById("bRetourMajTarifs").collapsed=false;
		document.getElementById("deck").selectedIndex = 1;
	
	}	catch (e) {
		recup_erreur(e);
	}
}


function editerCsv() {
	try {
		var qEdition = new QueryHttp("Facturation/MajTarifs/majTarifsCsv.tmpl");
		qEdition.setParam("Element", element);
		
		// Prix de Vente, Coeff, Marge
		qEdition.setParam("Pourc_PV_T1", pourc_pv_t1);
		qEdition.setParam("Pourc_PV_T2", pourc_pv_t2);
		qEdition.setParam("Pourc_PV_T3", pourc_pv_t3);
		qEdition.setParam("Pourc_PV_T4", pourc_pv_t4);
		qEdition.setParam("Pourc_PV_T5", pourc_pv_t5);
		qEdition.setParam("Pourc_PV_TS", pourc_pv_ts);
		qEdition.setParam("Eur_PV_T1", eur_pv_t1);
		qEdition.setParam("Eur_PV_T2", eur_pv_t2);
		qEdition.setParam("Eur_PV_T3", eur_pv_t3);
		qEdition.setParam("Eur_PV_T4", eur_pv_t4);
		qEdition.setParam("Eur_PV_T5", eur_pv_t5);
		qEdition.setParam("Coeff_T1", coeff_t1);
		qEdition.setParam("Coeff_T2", coeff_t2);
		qEdition.setParam("Coeff_T3", coeff_t3);
		qEdition.setParam("Coeff_T4", coeff_t4);
		qEdition.setParam("Coeff_T5", coeff_t5);
		qEdition.setParam("Marge_T1", marge_t1);
		qEdition.setParam("Marge_T2", marge_t2);
		qEdition.setParam("Marge_T3", marge_t3);
		qEdition.setParam("Marge_T4", marge_t4);
		qEdition.setParam("Marge_T5", marge_t5);
		
		// Prix d'Achat
		qEdition.setParam("Repercution", chk_repercution);
		qEdition.setParam("Type_Repercution", type_repercution);
		qEdition.setParam("Tarif_Spec", chk_spec);
		qEdition.setParam("Type_Repercution_Spec", type_repercution_spec);
		qEdition.setParam("Mode_Calcul", mode_calcul);
		qEdition.setParam("Valeur", valeur);
		
		// Filtre
		qEdition.setParam("Critere", critere);
		qEdition.setParam("Ref_Article", refArticle);
		qEdition.setParam("Famille_1", famille1);
		qEdition.setParam("Famille_2", famille2);
		qEdition.setParam("Famille_3", famille3);
		qEdition.setParam("Marque", marque);
		qEdition.setParam("Fournisseur", fournisseur);
		
		qEdition.execute(editerCsv_2);
	} catch (e) {
		recup_erreur(e);
	}
}


function editerCsv_2(httpRequest) {
	try {
		var contenu = httpRequest.responseXML.documentElement;
		var fichier = contenu.getAttribute('FichierCsv');
		var nom_defaut = "majTarifs.csv";
		var file = fileChooser("save", nom_defaut);

		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier, file);
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function valider() {
	try {
		if (window.confirm("Attention ! La validation entrainera une mise à jour définitive de vos tarifs.")) {
			
			if (testerPertes()) {
				showWarning("Impossible de valider car la mise à jour entrainera des pertes pour certains articles !");
				document.getElementById("bValider").disabled=true;
			} else {
				var qMajTarifs = new QueryHttp("Facturation/MajTarifs/validerMajTarifs.tmpl");
				qMajTarifs.setParam("Element", element);
				
				// Prix de Vente, Coeff, Marge
				qMajTarifs.setParam("Pourc_PV_T1", pourc_pv_t1);
				qMajTarifs.setParam("Pourc_PV_T2", pourc_pv_t2);
				qMajTarifs.setParam("Pourc_PV_T3", pourc_pv_t3);
				qMajTarifs.setParam("Pourc_PV_T4", pourc_pv_t4);
				qMajTarifs.setParam("Pourc_PV_T5", pourc_pv_t5);
				qMajTarifs.setParam("Pourc_PV_TS", pourc_pv_ts);
				qMajTarifs.setParam("Eur_PV_T1", eur_pv_t1);
				qMajTarifs.setParam("Eur_PV_T2", eur_pv_t2);
				qMajTarifs.setParam("Eur_PV_T3", eur_pv_t3);
				qMajTarifs.setParam("Eur_PV_T4", eur_pv_t4);
				qMajTarifs.setParam("Eur_PV_T5", eur_pv_t5);
				qMajTarifs.setParam("Coeff_T1", coeff_t1);
				qMajTarifs.setParam("Coeff_T2", coeff_t2);
				qMajTarifs.setParam("Coeff_T3", coeff_t3);
				qMajTarifs.setParam("Coeff_T4", coeff_t4);
				qMajTarifs.setParam("Coeff_T5", coeff_t5);
				qMajTarifs.setParam("Marge_T1", marge_t1);
				qMajTarifs.setParam("Marge_T2", marge_t2);
				qMajTarifs.setParam("Marge_T3", marge_t3);
				qMajTarifs.setParam("Marge_T4", marge_t4);
				qMajTarifs.setParam("Marge_T5", marge_t5);
				
				// Prix d'Achat
				qMajTarifs.setParam("Repercution", chk_repercution);
				qMajTarifs.setParam("Type_Repercution", type_repercution);
				qMajTarifs.setParam("Tarif_Spec", chk_spec);
				qMajTarifs.setParam("Type_Repercution_Spec", type_repercution_spec);
				qMajTarifs.setParam("Mode_Calcul", mode_calcul);
				qMajTarifs.setParam("Valeur", valeur);
				
				// Filtre
				qMajTarifs.setParam("Critere", critere);
				qMajTarifs.setParam("Ref_Article", refArticle);
				qMajTarifs.setParam("Famille_1", famille1);
				qMajTarifs.setParam("Famille_2", famille2);
				qMajTarifs.setParam("Famille_3", famille3);
				qMajTarifs.setParam("Marque", marque);
				qMajTarifs.setParam("Fournisseur", fournisseur);
				
				qMajTarifs.execute();
				showWarning("Validation effectuée !");
				desactiverValidation();
			}
		}
	}
	catch(e){
		recup_erreur(e);
	}
}


function testerPertes() {
	try {
		var qPerte = new QueryHttp("Facturation/MajTarifs/getPertes.tmpl");
		qPerte.setParam("Element", element);
		
		// Prix de Vente, Coeff, Marge
		qPerte.setParam("Pourc_PV_T1", pourc_pv_t1);
		qPerte.setParam("Pourc_PV_T2", pourc_pv_t2);
		qPerte.setParam("Pourc_PV_T3", pourc_pv_t3);
		qPerte.setParam("Pourc_PV_T4", pourc_pv_t4);
		qPerte.setParam("Pourc_PV_T5", pourc_pv_t5);
		qPerte.setParam("Pourc_PV_TS", pourc_pv_ts);
		qPerte.setParam("Eur_PV_T1", eur_pv_t1);
		qPerte.setParam("Eur_PV_T2", eur_pv_t2);
		qPerte.setParam("Eur_PV_T3", eur_pv_t3);
		qPerte.setParam("Eur_PV_T4", eur_pv_t4);
		qPerte.setParam("Eur_PV_T5", eur_pv_t5);
		qPerte.setParam("Coeff_T1", coeff_t1);
		qPerte.setParam("Coeff_T2", coeff_t2);
		qPerte.setParam("Coeff_T3", coeff_t3);
		qPerte.setParam("Coeff_T4", coeff_t4);
		qPerte.setParam("Coeff_T5", coeff_t5);
		qPerte.setParam("Marge_T1", marge_t1);
		qPerte.setParam("Marge_T2", marge_t2);
		qPerte.setParam("Marge_T3", marge_t3);
		qPerte.setParam("Marge_T4", marge_t4);
		qPerte.setParam("Marge_T5", marge_t5);
		
		// Prix d'Achat
		qPerte.setParam("Repercution", chk_repercution);
		qPerte.setParam("Type_Repercution", type_repercution);
		qPerte.setParam("Tarif_Spec", chk_spec);
		qPerte.setParam("Type_Repercution_Spec", type_repercution_spec);
		qPerte.setParam("Mode_Calcul", mode_calcul);
		qPerte.setParam("Valeur", valeur);
		
		// Filtre
		qPerte.setParam("Critere", critere);
		qPerte.setParam("Ref_Article", refArticle);
		qPerte.setParam("Famille_1", famille1);
		qPerte.setParam("Famille_2", famille2);
		qPerte.setParam("Famille_3", famille3);
		qPerte.setParam("Marque", marque);
		qPerte.setParam("Fournisseur", fournisseur);
		
		var p = qPerte.execute();
		return (p.responseXML.documentElement.getAttribute("perte")=="y");
	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerTarifsSpec() {
	try {
		if (window.confirm("Les tarifs spécifiques vont être définitivement supprimés ! Continuer ?")) {
			var qSupprTarifs = new QueryHttp("Facturation/MajTarifs/supprimerTarifsSpec.tmpl");
			qSupprTarifs.execute();
			showWarning("Tous les tarifs spécifiques sont supprimés !");
			document.getElementById('bSupprTarifsSpec').disabled=true;
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function retour_maj_tarifs() {
	try {
	
		document.getElementById("deck").selectedIndex = 0;
		document.getElementById("bRetourMajTarifs").collapsed = true;
	
	}	catch (e) {
		recup_erreur(e);
	}
}



function retour_menu_principal() {
	try {
	
		window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();
	
	}	catch (e) {
		recup_erreur(e);
	}
}


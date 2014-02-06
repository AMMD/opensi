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


var aStats = new Arbre("Facturation/GetRDF/statistiques_commercial.tmpl", "statistiques_commercial");
var date_debut = "";
var date_fin = "";


function init_stats() {
	try {

		document.getElementById("grp_edition").collapsed=true;

		aStats.deleteTree();

		document.getElementById('rgp_date').value = "MC";
		document.getElementById('rgp_filtre').value = "ND";
		action_date();

		var reqExisteCAE = new QueryHttp("Facturation/Commerciaux/existe_CAE.tmpl");
		reqExisteCAE.setParam("Commercial_Id", identifiant);
		var result = reqExisteCAE.execute();
		var have_CAE = (result.responseXML.documentElement.getAttribute("existe")=="true");

		document.getElementById('marque').collapsed = have_CAE;
		document.getElementById('article').collapsed = have_CAE;
		document.getElementById('famille1').collapsed = have_CAE;
		document.getElementById('famille2').collapsed = have_CAE;
		document.getElementById('famille3').collapsed = have_CAE;

		document.getElementById('lbl_periode').value = "Période";
		document.getElementById('txt_CAHT').value = "";
		document.getElementById('txt_CATTC').value = "";
		document.getElementById('txt_remuneration').value = "";

		document.getElementById('rgp_typeAjustement').value = "D";
		document.getElementById('txt_valAjustement').value = "0";
		document.getElementById('txt_commentaires').value = "";

	} catch(e) {
		recup_erreur(e);
	}
}


function action_date() {
	try {
		action_params_edition();
		var date = document.getElementById('rgp_date').value;
		document.getElementById('date1').disabled = (date!="DD");
		document.getElementById('date2').disabled = (date!="DD");
	} catch(e) {
		recup_erreur(e);
	}
}


function action_params_edition() {
	try {
		document.getElementById("grp_edition").collapsed=true;
		document.getElementById('txt_valAjustement').value="0";
		document.getElementById('rgp_typeAjustement').value="D";
		document.getElementById('txt_commentaires').value="";
	} catch (e) {
		recup_erreur(e);
	}
}


function verifier_dates() {
	try {

		var date = document.getElementById('rgp_date').value;
		var etat = false;

		if (date!="DD") {
			date_debut = date;
			date_fin = "";
			etat = true;
		}
		else {
			var d1 = document.getElementById('date1').value;
			var d2 = document.getElementById('date2').value;

			if (!isDate(d1)) { showWarning("La date de début est incorrecte."); }
			else if (!isDate(d2)) {	showWarning("La date de fin est incorrecte.");	}
			else if (!isDateInterval(d1,d2)) { showWarning("L'interval des dates est incorrect."); }
			else {
				date_debut = prepareDateJava(d1);
				date_fin = prepareDateJava(d2);
				etat = true;
			}
		}

		return etat;

	} catch(e) {
		recup_erreur(e);
	}
}


function lister_statistiques() {
	try {
		if (verifier_dates()) {
			if (!erreurArticlePA()) {
				var filtre = document.getElementById('rgp_filtre').value;
				document.getElementById('ColClient').collapsed=(filtre!="C");
				document.getElementById('ColMarque').collapsed=(filtre!="MQ");
				document.getElementById('ColFamille1').collapsed=(filtre!="F1" && filtre!="F2" && filtre!="F3");
				document.getElementById('ColFamille2').collapsed=(filtre!="F2" && filtre!="F3");
				document.getElementById('ColFamille3').collapsed=(filtre!="F3");
				document.getElementById('ColArticle').collapsed=(filtre!="A");

				aStats.setParam("Commercial_Id", identifiant);
				aStats.setParam("Date_Debut", date_debut);
				aStats.setParam("Date_Fin", date_fin);
				aStats.setParam("Filtre", filtre);
				aStats.initTree();

				var reqTotaux = new QueryHttp("Facturation/Commerciaux/totaux_remuneration.tmpl");
				reqTotaux.setParam("Commercial_Id", identifiant);
				reqTotaux.setParam("Date_Debut", date_debut);
				reqTotaux.setParam("Date_Fin", date_fin);
				reqTotaux.setParam("Filtre", filtre);
				var result = reqTotaux.execute();
				document.getElementById('lbl_periode').value = "Période du "+ result.responseXML.documentElement.getAttribute("dd") +" au "+ result.responseXML.documentElement.getAttribute("df");
				document.getElementById('txt_CAHT').value = result.responseXML.documentElement.getAttribute("caht");
				document.getElementById('txt_CATTC').value = result.responseXML.documentElement.getAttribute("cattc");
				document.getElementById('txt_remuneration').value = result.responseXML.documentElement.getAttribute("commission");

				var montant_commission = parseFloat(result.responseXML.documentElement.getAttribute("commission"));
				document.getElementById("grp_edition").collapsed=(!is_admin || (montant_commission==0));
			}
		}
	} catch(e) {
		recup_erreur(e);
	}
}


function erreurArticlePA() {
	try {
		// Cette fonction vérifie, uniquement dans le cas où il existe une règle portant sur la marge,
		// que tous les articles (hors ceux identifiés comme prestations) ont leur prix d'achat renseigné
		var reqArticleInvalide = new QueryHttp("Facturation/Commerciaux/verifierArticlesPA.tmpl");
		reqArticleInvalide.setParam("Commercial_Id", identifiant);
		var result = reqArticleInvalide.execute();
		var articleInvalide = result.responseXML.documentElement.getAttribute("articleInvalide");
		var erreur = false;

		if (!isEmpty(articleInvalide)) {
			erreur=true;
			showWarning("Erreur : veuillez d'abord renseigner le prix d'achat de l'article " + articleInvalide + " !");
		}

		return erreur;
	} catch (e) {
		recup_erreur(e);
	}
}


function checkPeriode() {
	try {

		var reqPeriode = new QueryHttp("Facturation/Commerciaux/existePeriodeCommissionnement.tmpl");
		reqPeriode.setParam("Commercial_Id", identifiant);
		reqPeriode.setParam("Date_Debut", date_debut);
		reqPeriode.setParam("Date_Fin", date_fin);
		var result = reqPeriode.execute();

		return (result.responseXML.documentElement.getAttribute("existe")=="true");

	} catch (e) {
		recup_erreur(e);
	}
}


function generer_pdf() {
	try {

		if (verifier_dates() && !erreurArticlePA()) {
			if (window.confirm("Confirmez-vous le commissionnement du commercial pour la période indiquée ?")){
				var filtre = document.getElementById('rgp_filtre').value;
				var ajustement = parseFloat(document.getElementById('txt_valAjustement').value);
				var signeAjustement = document.getElementById('rgp_typeAjustement').value;
				var commentaires = document.getElementById('txt_commentaires').value;

				if (isEmpty(ajustement) || !isPositiveOrNull(ajustement)) { showWarning("L'ajustement doit être un nombre positif !"); }
				else if (!checkPeriode() || confirm("La période choisie a déjà été commissionnée. Voulez-vous quand-même continuer ?")) {
					if (signeAjustement=="D") { ajustement *= -1; }
					var params = "&Date_Debut="+ date_debut +"&Date_Fin="+ date_fin +"&Commercial_Id="+ identifiant +"&Filtre="+ urlEncode(filtre);
					params += "&Montant_Ajustement="+ ajustement +"&Commentaires="+ urlEncode(commentaires);
					var page = getUrlOpeneas("&Page=Facturation/Commerciaux/pdf_commissionnement.tmpl" + params);
					document.getElementById('pdf_commission').setAttribute("src", page);
					document.getElementById('deck').selectedIndex = 1;
					document.getElementById('bRetourCommercial').collapsed = false;
				}
			}
		}

	} catch(e) {
		recup_erreur(e);
	}
}


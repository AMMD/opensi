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


var om_selMarque = "";
var om_actif = true;
var om_aMarques = new Arbre('Config/parametrageArticles/listeMarquesArticles.tmpl', 'om-listeMarques');


function om_initMarques() {
	try {

		document.getElementById('om-afficherTout').setAttribute("checked", false);
		om_chargerListe();

	} catch (e) {
    recup_erreur(e);
  }
}


function om_chargerListe() {
	try {
		var chkAfficherTout = document.getElementById('om-afficherTout').checked?"1":"0";
		document.getElementById('om-colPictoActif').collapsed = !chkAfficherTout;
		om_aMarques.setParam("Afficher_Tout", chkAfficherTout);
		om_aMarques.initTree(om_nouvelleMarque);
	} catch (e) {
		recup_erreur(e);
	}
}


function om_nouvelleMarque() {
	try {
		if (om_aMarques.isNotNull()) {
			om_aMarques.select(-1);
		}
		om_selMarque = "";
		om_actif = true;
		document.getElementById('om-nom').value = "";
		document.getElementById('om-nom').disabled = false;
		document.getElementById('om-bNouvelleMarque').collapsed = true;
		document.getElementById('om-bEnregistrerMarque').collapsed = false;
		document.getElementById('om-bReactiverMarque').collapsed = true;
		document.getElementById('om-bSupprimerMarque').collapsed = true;
	} catch (e) {
		recup_erreur(e);
	}
}


function om_ouvrirMarque() {
	try {
		if (om_aMarques.isSelected()) {
			var i = om_aMarques.getCurrentIndex();
			om_selMarque = om_aMarques.getCellText(i, 'om-colMarqueId');
			om_actif = (om_aMarques.getCellText(i, 'om-colActif')=="1");
			document.getElementById('om-nom').value = om_aMarques.getCellText(i, 'om-colMarque');
			document.getElementById('om-nom').disabled = !om_actif;
			document.getElementById('om-bNouvelleMarque').collapsed = false;
			document.getElementById('om-bEnregistrerMarque').collapsed = !om_actif;
			document.getElementById('om-bReactiverMarque').collapsed = om_actif;
			document.getElementById('om-bSupprimerMarque').collapsed = !om_actif;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function om_enregistrerMarque() {
	try {
		
		var nom = document.getElementById('om-nom').value;
		if (isEmpty(nom)) {
			showWarning("Veuillez saisir le nom de la marque !");
		} else {
		
			var qEnregistrer;
			if (isEmpty(om_selMarque)) {
				qEnregistrer = new QueryHttp("Config/parametrageArticles/creerMarqueArticle.tmpl");
			} else {
				qEnregistrer = new QueryHttp("Config/parametrageArticles/modifierMarqueArticle.tmpl");
				qEnregistrer.setParam("Marque_Id", om_selMarque);
			}
			qEnregistrer.setParam("Nom", nom);
			var result = qEnregistrer.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				if (result.responseXML.documentElement.getAttribute("desactiver")=="true") {
					showWarning("La marque étant utilisée dans des documents, l'ancienne a simplement été désactivée !");
				}
				om_chargerListe();
			} else {
				showWarning("Erreur : une marque porte déjà le même nom !");
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function om_reactiverMarque() {
	try {
		if (window.confirm("Voulez-vous réactiver la marque sélectionnée ?")) {
			var qReactiver = new QueryHttp("Config/parametrageArticles/reactiverMarqueArticle.tmpl");
			qReactiver.setParam("Marque_Id", om_selMarque);
			qReactiver.execute(om_chargerListe);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function om_supprimerMarque() {
	try {
		if (window.confirm("Voulez-vous supprimer la marque sélectionnée ?")) {
			var qSupprimer = new QueryHttp("Config/parametrageArticles/supprimerMarqueArticle.tmpl");
			qSupprimer.setParam("Marque_Id", om_selMarque);
			var result = qSupprimer.execute();
			if (result.responseXML.documentElement.getAttribute("codeErreur")=="1") {
				showWarning("La marque étant encore utilisée, elle a simplement été désactivée !");
			}
			om_chargerListe();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


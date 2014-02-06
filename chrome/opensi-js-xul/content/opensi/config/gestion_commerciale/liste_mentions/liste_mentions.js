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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");


var selMention = "";
var actif = true;
var aMentions = new Arbre('Config/GetRDF/listeMentions.tmpl', 'liste_mentions');


function init() {
	try {

		document.getElementById('afficherTout').setAttribute("checked", false);
		chargerListe();

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerListe() {
	try {
		var chkAfficherTout = document.getElementById('afficherTout').checked?"1":"0";
		document.getElementById('colPictoActif').collapsed = !chkAfficherTout;
		aMentions.setParam("Afficher_Tout", chkAfficherTout);
		aMentions.initTree(nouvelleMention);
	} catch (e) {
		recup_erreur(e);
	}
}


function nouvelleMention() {
	try {
		if (aMentions.isNotNull()) {
			aMentions.select(-1);
		}
		selMention = "";
		actif = true;
		document.getElementById('nom').value="";
		document.getElementById('nom').disabled = false;
		document.getElementById('bNouvelleMention').collapsed = true;
		document.getElementById('bEnregistrerMention').collapsed = false;
		document.getElementById('bReactiverMention').collapsed = true;
		document.getElementById('bSupprimerMention').collapsed = true;
		

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirMention() {
	try {
		if (aMentions.isSelected()) {
			var i = aMentions.getCurrentIndex();
			selMention = aMentions.getCellText(i, 'colMentionId');
			actif = (aMentions.getCellText(i, 'colActif')=="1");
			document.getElementById('nom').value = aMentions.getCellText(i, 'colMention');
			document.getElementById('nom').disabled = !actif;
			document.getElementById('bNouvelleMention').collapsed = false;
			document.getElementById('bEnregistrerMention').collapsed = !actif;
			document.getElementById('bReactiverMention').collapsed = actif;
			document.getElementById('bSupprimerMention').collapsed = !actif;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function enregistrerMention() {
	try {

		var mention = document.getElementById('nom').value;

		if (isEmpty(mention)) {
			showWarning("Veuillez remplir le champ 'Mention' !");
		}
		else if (mention.length>255) {
			showWarning("Le champ 'Mention' ne doit pas dépasser 255 caractères !");
		}
		else {
			
			var qEnregistrer;
			if (isEmpty(selMention)) {
				qEnregistrer = new QueryHttp("Config/gestion_commerciale/liste_mentions/creerMention.tmpl");
			} else {
				qEnregistrer = new QueryHttp("Config/gestion_commerciale/liste_mentions/modifierMention.tmpl");
				qEnregistrer.setParam('Mention_Id', selMention);
			}
			qEnregistrer.setParam('Mention', mention);
			var result = qEnregistrer.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				chargerListe();
			} else {
				showWarning("Erreur : une mention porte déjà le même nom !");
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function reactiverMention() {
	try {
		if (window.confirm("Voulez-vous réactiver la mention sélectionnée ?")) {
			var qReactiver = new QueryHttp("Config/gestion_commerciale/liste_mentions/reactiverMention.tmpl");
			qReactiver.setParam('Mention_Id', selMention);
			qReactiver.execute(chargerListe);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerMention() {
	try {
		if (window.confirm("Voulez-vous supprimer la mention sélectionnée ?")) {
			var qSupprimer = new QueryHttp("Config/gestion_commerciale/liste_mentions/supprimerMention.tmpl");
			qSupprimer.setParam('Mention_Id', selMention);
			var result = qSupprimer.execute();
			if (result.responseXML.documentElement.getAttribute("codeErreur")=="1") {
				showWarning("La mention étant encore utilisée, elle a simplement été désactivée !");
			}
			chargerListe();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


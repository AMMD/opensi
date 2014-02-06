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


var off_selFamille = "";
var off_actif = true;
var off_aFamilles = new Arbre('Config/parametrageFournisseurs/listeFamillesFournisseurs.tmpl', 'off-listeFamilles');


function off_initFamillesFournisseurs() {
	try {
		
		document.getElementById('off-afficherTout').setAttribute("checked", false);
		off_chargerListe();

	} catch (e) {
    recup_erreur(e);
  }
}


function off_chargerListe() {
	try {
		var chkAfficherTout = document.getElementById('off-afficherTout').checked?"1":"0";
		document.getElementById('off-colPictoActif').collapsed = !chkAfficherTout;
		off_aFamilles.setParam("Afficher_Tout", chkAfficherTout);
		off_aFamilles.initTree(off_nouvelleFamille);
	} catch (e) {
		recup_erreur(e);
	}
}


function off_nouvelleFamille() {
	try {
		if (off_aFamilles.isNotNull()) {
			off_aFamilles.select(-1);
		}
		off_selFamille = "";
		off_actif = true;
		document.getElementById('off-nom').value = "";
		document.getElementById('off-nom').disabled = false;
		document.getElementById('off-bNouvelleFamille').collapsed = true;
		document.getElementById('off-bEnregistrerFamille').collapsed = false;
		document.getElementById('off-bReactiverFamille').collapsed = true;
		document.getElementById('off-bSupprimerFamille').collapsed = true;
	} catch (e) {
		recup_erreur(e);
	}
}


function off_ouvrirFamille() {
	try {
		if (off_aFamilles.isSelected()) {
			var i = off_aFamilles.getCurrentIndex();
			off_selFamille = off_aFamilles.getCellText(i, 'off-colFamilleId');
			off_actif = (off_aFamilles.getCellText(i, 'off-colActif')=="1");
			document.getElementById('off-nom').value = off_aFamilles.getCellText(i, 'off-colFamille');
			document.getElementById('off-nom').disabled = !off_actif;
			document.getElementById('off-bNouvelleFamille').collapsed = false;
			document.getElementById('off-bEnregistrerFamille').collapsed = !off_actif;
			document.getElementById('off-bReactiverFamille').collapsed = off_actif;
			document.getElementById('off-bSupprimerFamille').collapsed = !off_actif;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function off_enregistrerFamille() {
	try {
		
		var nom = document.getElementById('off-nom').value;
		if (isEmpty(nom)) {
			showWarning("Veuillez saisir le nom de la famille !");
		} else {
		
			var qEnregistrer;
			if (isEmpty(off_selFamille)) {
				qEnregistrer = new QueryHttp("Config/parametrageFournisseurs/creerFamilleFournisseur.tmpl");
			} else {
				qEnregistrer = new QueryHttp("Config/parametrageFournisseurs/modifierFamilleFournisseur.tmpl");
				qEnregistrer.setParam("Famille_Id", off_selFamille);
			}
			qEnregistrer.setParam("Nom", nom);
			var result = qEnregistrer.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				off_chargerListe();
			} else {
				showWarning("Erreur : une famille porte déjà le même nom !");
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function off_reactiverFamille() {
	try {
		if (window.confirm("Voulez-vous réactiver la famille sélectionnée ?")) {
			var qReactiver = new QueryHttp("Config/parametrageFournisseurs/reactiverFamilleFournisseur.tmpl");
			qReactiver.setParam("Famille_Id", off_selFamille);
			qReactiver.execute(off_chargerListe);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function off_supprimerFamille() {
	try {
		if (window.confirm("Voulez-vous supprimer la famille de fournisseurs sélectionnée ?")) {
			var qSupprimer = new QueryHttp("Config/parametrageFournisseurs/supprimerFamilleFournisseur.tmpl");
			qSupprimer.setParam("Famille_Id", off_selFamille);
			var result = qSupprimer.execute();
			if (result.responseXML.documentElement.getAttribute("codeErreur")=="1") {
				showWarning("La famille de fournisseurs étant encore utilisée, elle a simplement été désactivée !");
			}
			off_chargerListe();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

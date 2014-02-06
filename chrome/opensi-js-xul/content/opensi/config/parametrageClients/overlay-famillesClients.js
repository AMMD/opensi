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


var ofc_selFamille = "";
var ofc_actif = true;
var ofc_aFamilles = new Arbre('Config/parametrageClients/listeFamillesClients.tmpl', 'ofc-listeFamilles');
var ofc_aMentionsFamille = new Arbre('Config/parametrageClients/listeMentionsFamille.tmpl', 'ofc-listeMentions');


function ofc_initFamillesClients() {
	try {
		
		document.getElementById('ofc-afficherTout').setAttribute("checked", false);
		ofc_chargerListe();

	} catch (e) {
    recup_erreur(e);
  }
}


function ofc_chargerListe() {
	try {
		var chkAfficherTout = document.getElementById('ofc-afficherTout').checked?"1":"0";
		document.getElementById('ofc-colPictoActif').collapsed = !chkAfficherTout;
		ofc_aFamilles.setParam("Afficher_Tout", chkAfficherTout);
		ofc_aFamilles.initTree(ofc_nouvelleFamille);
	} catch (e) {
		recup_erreur(e);
	}
}


function ofc_nouvelleFamille() {
	try {
		if (ofc_aFamilles.isNotNull()) {
			ofc_aFamilles.select(-1);
		}
		ofc_selFamille = "";
		ofc_actif = true;
		document.getElementById('ofc-nom').value = "";
		document.getElementById('ofc-nom').disabled = false;
		document.getElementById('ofc-listeMentions').disabled = false;
		document.getElementById('ofc-bNouvelleFamille').collapsed = true;
		document.getElementById('ofc-bEnregistrerFamille').collapsed = false;
		document.getElementById('ofc-bReactiverFamille').collapsed = true;
		document.getElementById('ofc-bSupprimerFamille').collapsed = true;
		
		ofc_aMentionsFamille.setParam("Famille_Id", ofc_selFamille);
		ofc_aMentionsFamille.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function ofc_ouvrirFamille() {
	try {
		if (ofc_aFamilles.isSelected()) {
			var i = ofc_aFamilles.getCurrentIndex();
			ofc_selFamille = ofc_aFamilles.getCellText(i, 'ofc-colFamilleId');
			ofc_actif = (ofc_aFamilles.getCellText(i, 'ofc-colActif')=="1");
			document.getElementById('ofc-nom').value = ofc_aFamilles.getCellText(i, 'ofc-colFamille');
			document.getElementById('ofc-nom').disabled = !ofc_actif;
			document.getElementById('ofc-listeMentions').disabled = !ofc_actif;
			document.getElementById('ofc-bNouvelleFamille').collapsed = false;
			document.getElementById('ofc-bEnregistrerFamille').collapsed = !ofc_actif;
			document.getElementById('ofc-bReactiverFamille').collapsed = ofc_actif;
			document.getElementById('ofc-bSupprimerFamille').collapsed = !ofc_actif;
			
			ofc_aMentionsFamille.setParam("Famille_Id", ofc_selFamille);
			ofc_aMentionsFamille.initTree();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofc_enregistrerFamille() {
	try {
		
		var nom = document.getElementById('ofc-nom').value;
		if (isEmpty(nom)) {
			showWarning("Veuillez saisir le nom de la famille !");
		} else {
			
	  	var listeMentions = "";
	  	var listbox = document.getElementById("ofc-listeMentions");
			var nbLignes = listbox.getRowCount();
			if (nbLignes>0) {
				var i = 0;
				while (i<nbLignes) {
					var item = listbox.getItemAtIndex(i);
					var cks = item.getElementsByTagName("listcell");
					if (cks.item(0).getAttribute("checked")=="true") {
						listeMentions += item.value+",";
					}
					i++;
				}
			}
		
			var qEnregistrer;
			if (isEmpty(ofc_selFamille)) {
				qEnregistrer = new QueryHttp("Config/parametrageClients/creerFamilleClient.tmpl");
			} else {
				qEnregistrer = new QueryHttp("Config/parametrageClients/modifierFamilleClient.tmpl");
				qEnregistrer.setParam("Famille_Id", ofc_selFamille);
			}
			qEnregistrer.setParam("Nom", nom);
			qEnregistrer.setParam("Liste_Mentions", listeMentions);
			var result = qEnregistrer.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				ofc_chargerListe();
			} else {
				showWarning("Erreur : une famille porte déjà le même nom !");
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ofc_reactiverFamille() {
	try {
		if (window.confirm("Voulez-vous réactiver la famille sélectionnée ?")) {
			var qReactiver = new QueryHttp("Config/parametrageClients/reactiverFamilleClient.tmpl");
			qReactiver.setParam("Famille_Id", ofc_selFamille);
			qReactiver.execute(ofc_chargerListe);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofc_supprimerFamille() {
	try {
		if (window.confirm("Voulez-vous supprimer la famille de clients sélectionnée ?")) {
			var qSupprimer = new QueryHttp("Config/parametrageClients/supprimerFamilleClient.tmpl");
			qSupprimer.setParam("Famille_Id", ofc_selFamille);
			var result = qSupprimer.execute();
			if (result.responseXML.documentElement.getAttribute("codeErreur")=="1") {
				showWarning("La famille de clients étant encore utilisée, elle a simplement été désactivée !");
			}
			ofc_chargerListe();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofc_testCheck(listitem) {
	try {
		if (!document.getElementById('ofc-listeMentions').disabled) {
			var cks = listitem.getElementsByTagName("listcell");
			var checked = (cks.item(0).getAttribute("checked")=="true");
			cks.item(0).setAttribute("checked",!checked);
		}
	} catch (e) {
    recup_erreur(e);
  }
}



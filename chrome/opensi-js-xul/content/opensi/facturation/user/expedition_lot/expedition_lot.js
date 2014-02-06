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

var aListeCommandes = new Arbre("Facturation/GetRDF/liste_commandes_expediables.tmpl", "liste_commandes");
var aSites = new Arbre("Facturation/Affaires/liste-sites.tmpl","Provenance");
var aModeExpedition = new Arbre("Facturation/Affaires/liste-modesExpedition.tmpl","modeExpedition");
var aHistorique = new Arbre("Facturation/GetRDF/historique_expeditions_lot.tmpl", "Reedition");


function init() {
	try {
		bloquer(true);
		
		var qExisteSites = new QueryHttp("Facturation/Affaires/existeSites.tmpl");
		var result = qExisteSites.execute();
		var existeSite = (result.responseXML.documentElement.getAttribute("Existe")=="true");
		document.getElementById('lblProvenance').collapsed = !existeSite;
		document.getElementById('Provenance').collapsed = !existeSite;
		document.getElementById('lhProvenance').collapsed = !existeSite;
		document.getElementById('colProvenance').collapsed = !existeSite;

		document.getElementById("typeExpedition").value = "TT";
		document.getElementById("etatPaiement").value = "1";

		document.getElementById('bRetourExpeditions').collapsed = true;		
		document.getElementById('deck').selectedIndex = 0;

		aSites.initTree(initSite);

	} catch (e) {
		recup_erreur(e);
	}
}

function initSite() {
	try {
		document.getElementById("Provenance").selectedIndex=0;
		aHistorique.initTree(initHistorique);
	}	catch (e)	{
  	recup_erreur(e);
	}
}


function initHistorique() {
	try {
		document.getElementById('Reedition').selectedIndex=0;
		aModeExpedition.initTree(initModesExpedition);
	} catch (e) {
		recup_erreur(e);
	}
}

function initModesExpedition() {
	try {
		document.getElementById('modeExpedition').selectedIndex=0;
		listerCommandes();
	} catch (e) {
		recup_erreur(e);
	}
}


function onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			listerCommandes();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function listerCommandes() {
	try {
		bloquer(true);
		
		var provenance = document.getElementById("Provenance").value;
		var modeExpedition = document.getElementById("modeExpedition").value;
		var typeExpedition = document.getElementById("typeExpedition").value;
		var statutPaiement = document.getElementById("etatPaiement").value;
		var dateDebut = document.getElementById('dateDebut').value;
		var dateFin = document.getElementById('dateFin').value;
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début de période incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin de période incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("Plage de dates incorrecte !"); }
		else {
			
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
		
			aListeCommandes.setParam("Provenance", provenance);
			aListeCommandes.setParam("Mode_Expedition", modeExpedition);
			aListeCommandes.setParam("Type_Expedition", typeExpedition);
			aListeCommandes.setParam("Statut_Paiement", statutPaiement);
			aListeCommandes.setParam("Date_Debut", dateDebut);
			aListeCommandes.setParam("Date_Fin", dateFin);
			aListeCommandes.initTree(debloquerListe);
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function debloquerListe() {
	try {
		compterLignesCochees();
		bloquer(false);
	} catch (e) {
		recup_erreur(e);
	}
}


function compterLignesCochees() {
	try {
		var nbCoches = 0;
		var listbox = document.getElementById("liste_commandes");
		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			for (var i=0; i<nbLignes; i++) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				if (cks.item(0).getAttribute("checked")=="true") {
					nbCoches++;
				}
			}
		}
		document.getElementById('lblNbLignesCochees').value = nbCoches;
	} catch (e) {
		recup_erreur(e);
	}
}


function afficherPopupCommentaire(listitem) {
	try {
		var commandeId = listitem.value;
		
		var url = "chrome://opensi/content/facturation/user/expedition_lot/popup-afficherCommentaire.xul?"+ cookie();
		url += "&Commande_Id=" + commandeId;
		window.openDialog(url,'','chrome,modal,centerscreen');
	} catch (e) {
		recup_erreur(e);
	}
}


function testcheck(listitem, numcell) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		if (cks.item(12).getAttribute("label")=="true") {
			showWarning("Sélection impossible pour les commandes ayant des articles hors-stock à livrer !");
		} else if (cks.item(10).getAttribute("label")=="true") {
			showWarning("Sélection impossible : un BL est déjà en cours de création pour cette commande !");
		} else {	
			switch (numcell) {
				case 1:
					if (cks.item(0).getAttribute("checked")=="false") {
						cks.item(0).setAttribute("checked","true");
					} else {
						cks.item(0).setAttribute("checked","false");
					}
					break;
			}
		}
		compterLignesCochees();
		
	} catch (e) {
    recup_erreur(e);
  }
}


function toutCocherBL(b) {
	try {
		bloquer(true);
		if (!b) { checkActFacture(); }
		
		var listbox = document.getElementById("liste_commandes");
		var nbLignes = listbox.getRowCount();
		for (var i=0; i<nbLignes; i++) {
			var item = listbox.getItemAtIndex(i);
			var cks = item.getElementsByTagName("listcell");
			if (b) {
				if ((cks.item(12).getAttribute("label")=="false") && (cks.item(10).getAttribute("label")=="false")) {
					cks.item(0).setAttribute("checked","true");
				}
			} else {
				cks.item(0).setAttribute("checked","false");
			}
		}
		compterLignesCochees();
		bloquer(false);
	} catch (e) {
		recup_erreur(e);
	}
}

function valider() {
	try {
		bloquer(true);
		var listbox = document.getElementById("liste_commandes");		
		var params="";

		var nbLignes = listbox.getRowCount();
		
		if (nbLignes>0) {
			var nbCommandesATraiter = 0;

			for (var i=0; i<nbLignes; i++) {
				var item = listbox.getItemAtIndex(i);				
				var cks = item.getElementsByTagName("listcell");
				if (cks.item(0).getAttribute("checked")=="true") {
					nbCommandesATraiter++;
					params += item.value+",";
				}
			}
			
			if (nbCommandesATraiter>0) {
				
				document.getElementById('deck').selectedIndex = 1;
				document.getElementById('pmbox').collapsed = false;
				document.getElementById('pm').setAttribute('mode', 'undetermined');
				
				var qGenPdf = new QueryHttp("Facturation/Expedition_Lot/pdf_expedition.tmpl");
				qGenPdf.setParam('NePasEditerFacture', (document.getElementById('chkFacture').checked?"1":"0"));
				qGenPdf.setParam('Creer_Fact', (document.getElementById('chkCreerFacture').checked?"1":"0"));
				qGenPdf.setParam('Editer_BP', document.getElementById('chkBP').checked?"1":"0");
				qGenPdf.setParam('Editer_Picking', document.getElementById('chkEditerPicking').checked?"1":"0");
				qGenPdf.setParam('Liste_Editions', params);
				var result = qGenPdf.execute();
				var nbEmail = result.responseXML.documentElement.getAttribute('NbEmail');
				var nbEmailErreur = result.responseXML.documentElement.getAttribute('NbEmailErreur');

				if (nbEmail>0) {
					showMessage(nbEmail + " factures ont été envoyées par email.");
				}
				if (nbEmailErreur>0) {
					showMessage(nbEmailErreur + " factures n'ont pas pu être envoyées par e-mail. Veuillez vérifier qu'il existe un email d'envoi ou de facturation sur la facture, ou que les champs email 1 ou email 2 soient remplis sur la fiche client.");
				}
				var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
				
				document.getElementById('expedition').setAttribute("src", page);
				
				document.getElementById('pm').setAttribute('mode', 'none');
				document.getElementById('pmbox').collapsed = true;
				document.getElementById('bRetourExpeditions').collapsed = false;
			} else {
				showWarning("Vous n'avez rien coché !");
			}
		} else {
			showWarning("La liste est vide !");
		}
		bloquer(false);
		
	} catch (e) {
		recup_erreur(e);
	}
}

function checkActFacture() {
	try {
		var chkCreerFacture = document.getElementById('chkCreerFacture').checked;
		document.getElementById('chkFacture').disabled = !chkCreerFacture;
		if (!chkCreerFacture) {
			document.getElementById('chkFacture').checked = false;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function bloquer(bloque) {
	try {
			document.getElementById("bValider").disabled=bloque;
			document.getElementById("bReediter").disabled=bloque;
	} catch (e) {
		recup_erreur(e);
	}
}

function reediter() {
	try {
		if (document.getElementById('Reedition').selectedIndex!=0) {
			bloquer(true);
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('pmbox').collapsed = false;
			document.getElementById('pm').setAttribute('mode', 'undetermined');
							
			var qGenPdf = new QueryHttp("Facturation/Expedition_Lot/pdf_expedition.tmpl");
			qGenPdf.setParam('Date_Reedition', document.getElementById('Reedition').value);
			qGenPdf.setParam('Editer_Picking', document.getElementById('chkReediterPicking').checked?"1":"0");
			var result = qGenPdf.execute();
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
				
			document.getElementById('expedition').setAttribute("src", page);
				
			document.getElementById('pm').setAttribute('mode', 'none');
			document.getElementById('pmbox').collapsed = true;
			document.getElementById('bRetourExpeditions').collapsed = false;

			bloquer(false);

		} else {
			showWarning("Veuillez sélectionner une date de réédition !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function retour_expedition() {
  try {

		listerCommandes();
		aHistorique.initTree(initHistorique);
		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bRetourExpeditions').collapsed = true;

  } catch (e) {
    recup_erreur(e);
  }
}

function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}

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


jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var aFacturesAvoirs = new Arbre('Facturation/Envoi_Factures/liste-facturesAvoirsNonEnvoyes.tmpl', 'listeFacturesAvoirsNonEnvoyes');
var aHistorique = new Arbre('Facturation/Envoi_Factures/combo-historiqueEnvoiFactures.tmpl', 'timeEdition');

function init() {
  try {
		
		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bRetourFacturation').collapsed = true;

		aHistorique.initTree();
		listerFacturesAvoirs();

  } catch (e) {
  	recup_erreur(e);
  }
}


function listerFacturesAvoirs() {
	try {
		
		var typeDoc = document.getElementById('Type_Doc').value;
		var modeEnvoi = document.getElementById('Mode_Envoi').value;
		var dateDebut = document.getElementById('dateFactureDebut').value;
		var dateFin = document.getElementById('dateFactureFin').value;
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début de période incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin de période incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("Plage de dates incorrecte !"); }
		else {
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			aFacturesAvoirs.setParam("Type_Doc", typeDoc);
			aFacturesAvoirs.setParam("Mode_Envoi", modeEnvoi);
			aFacturesAvoirs.setParam("Date_Debut", dateDebut);
			aFacturesAvoirs.setParam("Date_Fin", dateFin);
			aFacturesAvoirs.initTree();
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function testcheck(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		if (cks.item(0).getAttribute("checked")=="false") {
			cks.item(0).setAttribute("checked","true");
		} else {
			cks.item(0).setAttribute("checked","false");
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function toutCocher() {
	try {
		var total = 0;
		var listbox = document.getElementById("listeFacturesAvoirsNonEnvoyes");

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;
			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				cks.item(0).setAttribute("checked","true");
				i++;
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function toutDecocher() {
	try {
		var listbox = document.getElementById("listeFacturesAvoirsNonEnvoyes");

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;
			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				cks.item(0).setAttribute("checked","false");
				i++;
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			listerFacturesAvoirs();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function envoyerFactures() {
  try {
  	
  	var nbCoches = 0;
  	var listeFactures = "";
  	var listeAvoirs = "";
  	var listbox = document.getElementById("listeFacturesAvoirsNonEnvoyes");

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;
			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				if (cks.item(0).getAttribute("checked")=="true") {
					if (cks.item(12).getAttribute("label")=="Facture") {
						listeFactures += item.value+",";
					} else {
						listeAvoirs += item.value+",";
					}
					nbCoches++;
				}
				i++;
			}
		}
		
		if (nbCoches==0) {
			showWarning("Vous n'avez rien coché !");
		} else if (window.confirm("Confirmez-vous l'édition des factures et avoirs sélectionnés ?")) {

			var qGenFact = new QueryHttp("Facturation/Envoi_Factures/genFacturesAvoirs.tmpl");
			qGenFact.setParam("Liste_Factures", listeFactures);
			qGenFact.setParam("Liste_Avoirs", listeAvoirs);
			var result = qGenFact.execute();
	
			var timeEdition = result.responseXML.documentElement.getAttribute('TimeEdition');
	
			var nbEmail = result.responseXML.documentElement.getAttribute('NbEmail');
			var nbEmailErreur = result.responseXML.documentElement.getAttribute('NbEmailErreur');

			if (nbEmail>0) {
				showMessage(nbEmail + " factures ont été envoyées par email.");
			}
			if (nbEmailErreur>0) {
				showMessage(nbEmailErreur + " factures n'ont pas pu être envoyées par e-mail. Veuillez vérifier qu'il existe un email d'envoi ou de facturation sur la facture, ou que les champs email 1 ou email 2 soient remplis sur la fiche client.");
			}
	
			if (isEmpty(timeEdition)) {
				showMessage("Rien n'a été édité !");
			}
			else {
				editerFactures(timeEdition, true);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function editerFactures(timeEdition, premiereEdition) {
  try {
  	
  	var editionOk = false;

  	document.getElementById('deck').selectedIndex = 1;
		document.getElementById('bRetourFacturation').collapsed = false;
		
		document.getElementById('pdf').setAttribute("src", null);
		document.getElementById('pmbox').collapsed = false;
		document.getElementById('pm').setAttribute('mode', 'undetermined');

		var qGenPdf = new QueryHttp("Facturation/Envoi_Factures/editionFacturesAvoirs.tmpl");
		qGenPdf.setParam('TimeEdition', timeEdition);
		qGenPdf.setParam('Premiere_Edition', premiereEdition);
		var result = qGenPdf.execute();
		if (result.responseXML.documentElement.getAttribute('Existe_Edition')=="true") {
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('FichierPDF');
			
			document.getElementById('pdf').setAttribute("src", page);
			editionOk = true;
		}
			
		document.getElementById('pm').setAttribute('mode', 'none');
		document.getElementById('pmbox').collapsed = true;
		
		if (!editionOk) { retourFacturation(); }

  } catch (e) {
    recup_erreur(e);
  }
}


function reediter() {
  try {

		if (document.getElementById('timeEdition').selectedIndex==0) {
			showWarning("Veuillez choisir une réédition !");
		} else {
			var timeEdition = document.getElementById('timeEdition').value;
			editerFactures(timeEdition, false);
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnListeNonEnvoyes(listitem) {
	try {
		
		var cks = listitem.getElementsByTagName("listcell");
		var docId = listitem.value;
		var typeDoc = cks.item(12).getAttribute("label");
		
		var url="chrome://opensi/content/facturation/user/envoi_factures/popup-changerModeEnvoi.xul?"+ cookie();
		window.openDialog(url,'','chrome,modal,centerscreen',init,docId,typeDoc);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function retourFacturation() {
  try {

    document.getElementById('deck').selectedIndex = 0;
		init();

	} catch (e) {
    recup_erreur(e);
  }
}


function retourMenuPrincipal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

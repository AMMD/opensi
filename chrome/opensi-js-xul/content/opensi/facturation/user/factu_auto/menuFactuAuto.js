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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");

var nf = new NumberFormat("0.00", true);

var produitsDecoche;

var aAffaires = new Arbre('Facturation/Factu_Auto/liste-affairesEnAttente.tmpl', 'listeAffairesEnAttente');
var aHistorique = new Arbre('Facturation/Factu_Auto/combo-historiqueEditionFactures.tmpl', 'timeEdition');

function init() {
  try {
		produitsDecoche = new Array();
		document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bRetourFacturation').collapsed = true;
		
		var qExisteSitesWeb = new QueryHttp("Facturation/Factu_Auto/existeSitesWeb.tmpl");
		var result = qExisteSitesWeb.execute();
		document.getElementById('itemClientsWeb').collapsed = (result.responseXML.documentElement.getAttribute('ok')=="false");
		
		aHistorique.initTree();
		listerAffaires();

  } catch (e) {
  	recup_erreur(e);
  }
}


function listerAffaires() {
	try {
		
		var typeFacturation = document.getElementById('typeFacturation').value;
		if (typeFacturation=="BL") {
			document.getElementById('modeFacturation').value="E";
			document.getElementById('modeFacturation').disabled=true;
		} else { document.getElementById('modeFacturation').disabled=false; }
		var modeFacturation = document.getElementById('modeFacturation').value;
		var modeEnvoiFacture = document.getElementById('modeEnvoiFacture').value;
		var dateDebut = document.getElementById('dateDebut').value;
		var dateFin = document.getElementById('dateFin').value;
		var client = document.getElementById('client').value;
		
		if (!isEmpty(dateDebut) && !isDate(dateDebut)) { showWarning("Date de début incorrecte !"); }
		else if (!isEmpty(dateFin) && !isDate(dateFin)) { showWarning("Date de fin incorrecte !"); }
		else if (!isEmpty(dateDebut) && !isEmpty(dateFin) && !isDateInterval(dateDebut, dateFin)) { showWarning("Plage de dates incorrecte !"); }
		else {
			if (!isEmpty(dateDebut)) { dateDebut = prepareDateJava(dateDebut); }
			if (!isEmpty(dateFin)) { dateFin = prepareDateJava(dateFin); }
			
			document.getElementById('totalHT').value = "";
			
			aAffaires.setParam("Type_Facturation", typeFacturation);
			aAffaires.setParam("Mode_Facturation", modeFacturation);
			aAffaires.setParam("Mode_Envoi_Facture", modeEnvoiFacture);
			aAffaires.setParam("Date_Debut", dateDebut);
			aAffaires.setParam("Date_Fin", dateFin);
			aAffaires.setParam("Client", client);
			aAffaires.initTree(calculerTotalHT);
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function calculerTotalHT() {
	try {
		var total = 0;
		
		var listbox = document.getElementById("listeAffairesEnAttente");

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;
			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				if (cks.item(0).getAttribute("checked")=="true") {
					total += parseFloat(cks.item(8).getAttribute("label").replace(",","."));
				}
				i++;
			}
		}
		
		total = nf.format(total);
		document.getElementById('totalHT').value = total;
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
		calculerTotalHT();
	} catch (e) {
    recup_erreur(e);
  }
}


function toutCocher() {
	try {
		var total = 0;
		var listbox = document.getElementById("listeAffairesEnAttente");

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;
			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				cks.item(0).setAttribute("checked","true");
				total += parseFloat(cks.item(8).getAttribute("label").replace(",","."));
				i++;
			}
		}
		
		document.getElementById('totalHT').value = nf.format(total);
	} catch (e) {
		recup_erreur(e);
	}
}


function toutDecocher() {
	try {
		var listbox = document.getElementById("listeAffairesEnAttente");

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
		
		document.getElementById('totalHT').value = nf.format(0);
	} catch (e) {
		recup_erreur(e);
	}
}


function onKeyPress(event) {
	try {
		if (event.keyCode==13) {
			listerAffaires();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function genererFactures() {
  try {
  	
  	var nbCoches = 0;
  	var listeDocs = "";
  	var listbox = document.getElementById("listeAffairesEnAttente");

		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;
			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				if (cks.item(0).getAttribute("checked")=="true") {
					listeDocs += item.value+",";
					nbCoches++;
				}
				i++;
			}
		}
		
		if (nbCoches==0) {
			showWarning("Vous n'avez rien coché !");
		} else if (window.confirm("Confirmez-vous la génération des factures des affaires sélectionnées ?")) {
			document.getElementById('deck').selectedIndex = 1;
			document.getElementById('bRetourFacturation').collapsed = false;		
			
			document.getElementById('pmbox').collapsed = false;
			document.getElementById('pm').setAttribute('mode', 'undetermined');
	
			var qGenFact = new QueryHttp("Facturation/Factu_Auto/genFacturesAuto.tmpl");
			// listeDocs pour récupérer les id des affaires séparés par des virgules
			qGenFact.setParam("Liste_Id",listeDocs);
			qGenFact.setParam("Produits_Decoche", produitsDecoche.join(","));
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
				showMessage("Aucune facture n'a été générée.");
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
		
		var qGenPdf = new QueryHttp("Facturation/Factu_Auto/editionFacturesAuto.tmpl");
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

		var timeEdition = document.getElementById('timeEdition').value;
		
		if (isEmpty(timeEdition)) {
			showWarning("Veuillez choisir une réédition !");
		}
		else {
			editerFactures(timeEdition, false);
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function ouvrirChoixCodeProduit(affaireId) {
  try {
  	// A CORRIGER
  	qExisteProduitEnAttente.setParam("Affaire_Id",affaireId);
		var result = qExisteProduitEnAttente.execute();
		if (result.responseXML.documentElement.getAttribute('ok')=="true") {
			var page ="chrome://opensi/content/facturation/user/factu_auto/choixProduit.xul?"+ cookie();
			page +="&Affaire_Id="+affaireId+"&Produits_Decoche="+produitsDecoche;
		  window.openDialog(page,'Choix des codes produits','chrome,modal,centerscreen',modif_choix);
		}
  } catch (e) {
    recup_erreur(e);
  }
}

function modif_choix(coche_produit,decoche_produit) {
  try {
  	for (var i=0; i<coche_produit.length; i++) {
  		removeParam(coche_produit[i]);
		}
		for (var i=0; i<decoche_produit.length; i++) {
  		setParam(decoche_produit[i]);
		}
		
  } catch (e) {
    recup_erreur(e);
  }
}


function setParam(value) {

	var param = getParam(value);

	if (param==undefined) {
		addParam(value);
	}
}

function addParam(value) {
	produitsDecoche.push(value);
}


function removeParam(value) {

	var trouve = false;
	var i = 0;

	while (!trouve && i<produitsDecoche.length) {

		trouve = (produitsDecoche[i]==value);
		i++;
	}

	if (trouve) {
		produitsDecoche.splice(i-1,1);
	}
}


function getParam(value)  {

	var trouve = false;
	var i = 0;

	while (!trouve && i<produitsDecoche.length) {
		trouve = produitsDecoche[i]==value;
		i++;
	}

	return (trouve?produitsDecoche[i-1]:undefined);
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

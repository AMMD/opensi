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


var orb_aBanques = new Arbre("ComboListe/combo-banques.tmpl", "orb-comboBanques");
var orb_aTypeReg = new Arbre("Facturation/GetRDF/liste-typesReglement.tmpl", "orb-comboTypeReg");
var orb_aReglements = new Arbre("Facturation/Remises_Banque/liste-reglements.tmpl", "orb-listeReglements");
var orb_aBanquesRemise = new Arbre('Config/GetRDF/listeBanques.tmpl', 'orb-banqueRemise');

var orb_montantTotal = 0;
var orb_nf = new NumberFormat("0.00", true);

var orb_tabPieces = new Array();
var orb_tabBillets = new Array();


function orb_init() {
	try {
		document.getElementById('orb-typeRemise').value="A";
		orb_switchInterface();
		orb_aBanques.initTree(orb_initBanque);
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_initBanque() {
	try {
		document.getElementById('orb-comboBanques').selectedIndex = 0;
		orb_aTypeReg.initTree(orb_initTypeReg);
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_initTypeReg() {
	try {

		document.getElementById('orb-comboTypeReg').selectedIndex = 0;
		orb_aBanquesRemise.initTree(orb_initBanqueRemise);

	} catch (e) {
		recup_erreur(e);
	}
}


function orb_initBanqueRemise() {
	try {
    document.getElementById('orb-banqueRemise').selectedIndex = 0;
    orb_genererInterfaceEspeces();
		orb_listerReglements();
	} catch (e) {
    recup_erreur(e);
  }
}


function orb_listerReglements() {
	try {
		document.getElementById('orb-listeReglements').disabled = true;
		var typeReg = document.getElementById('orb-comboTypeReg').value;
		var banque = document.getElementById('orb-comboBanques').value;
		var afficherRemisesAEchoir = document.getElementById('orb-chkAffRemisesAEchoir').checked?"1":"0";
		
		document.getElementById('orb-bValiderRemise').disabled = true;
		document.getElementById("orb-totalRemise").value = "";
		
		orb_aReglements.setParam("Type_Reg", typeReg);
		orb_aReglements.setParam("Banque", banque);
		orb_aReglements.setParam("Afficher_Remises_A_Echoir", afficherRemisesAEchoir);
		orb_aReglements.initTree(orb_calculTotaux);
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_calculTotaux() {
	try {
		
		orb_montantTotal = 0;

		var listeReglements = document.getElementById("orb-listeReglements");
		var nombreElements = listeReglements.getRowCount();
		
		for (var i=0; i<nombreElements; i++) {
			if (listeReglements.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
				orb_montantTotal += parseFloat(listeReglements.getItemAtIndex(i).getElementsByTagName("listcell").item(5).getAttribute("label"));
			}
		}

		document.getElementById("orb-totalRemise").value = orb_nf.format(orb_montantTotal);
		
		if (nombreElements>0 && document.getElementById('orb-comboBanques').value != "0") {
			document.getElementById('orb-bValiderRemise').disabled = false;
		}
		document.getElementById('orb-listeReglements').disabled = false;

	} catch (e) {
		recup_erreur(e);
	}
}


function orb_testCheck(listitem) {
	try {
		if (!document.getElementById('orb-listeReglements').disabled) {
			var cks = listitem.getElementsByTagName("listcell");
			if (cks.item(0).getAttribute("checked")=="false") {
				cks.item(0).setAttribute("checked","true");
			} else {
				cks.item(0).setAttribute("checked","false");
			}
			orb_calculTotaux();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_toutCocher(b) {
	try {
		var listeReglements = document.getElementById("orb-listeReglements");
		var nombreElements = listeReglements.getRowCount();
		for (var i=0; i<nombreElements; i++) {
			listeReglements.getItemAtIndex(i).getElementsByTagName("listcell").item(0).setAttribute("checked", b);
		}
		orb_calculTotaux();
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_validerRemise() {
	try {
		
		if (window.confirm("Voulez-vous valider la remise en banque ?")) {
			var listeReglements = document.getElementById("orb-listeReglements");
			var nombreElements = listeReglements.getRowCount();
			
			var listeReglClient = "";
			var listeRembFourn = "";
			for (var i=0; i<nombreElements; i++) {
				if (listeReglements.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
					if (listeReglements.getItemAtIndex(i).getElementsByTagName("listcell").item(6).getAttribute("label")=="C") {
						if (!isEmpty(listeReglClient)) { listeReglClient += ","; }
						listeReglClient += listeReglements.getItemAtIndex(i).value;
					} else {
						if (!isEmpty(listeRembFourn)) { listeRembFourn += ","; }
						listeRembFourn += listeReglements.getItemAtIndex(i).value;
					}
				}
			}
			
			if (isEmpty(listeReglClient) && isEmpty(listeRembFourn)) { showWarning("Il n'y a rien à valider !"); }
			else {
				var banque = document.getElementById('orb-comboBanques').value;
				var typeReglement = document.getElementById('orb-comboTypeReg').value;
				
				var qValider = new QueryHttp("Facturation/Remises_Banque/validerRemise.tmpl");
				qValider.setParam("Liste_Regl_Client", listeReglClient);
				qValider.setParam("Liste_Remb_Fourn", listeRembFourn);
				qValider.setParam("Banque", banque);
				qValider.setParam("Type_Reg_Id", typeReglement);
				var result = qValider.execute();
				var remiseId = result.responseXML.documentElement.getAttribute("Remise_Id");
				
				var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
				if (transfertAuto) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", remiseId);
					qVerifier.setParam("Type", "REMISE_REGL"); // vérif unique pour les remises et les annulations de remises
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Remise_Id", remiseId);
						qTransfertAuto.setParam("Type", "REMISE_REGL");
						qTransfertAuto.execute();
					}
				}
				
				var qGenPdf = new QueryHttp("Facturation/Remises_Banque/pdfRemise.tmpl");
				qGenPdf.setParam('Remise_Id', remiseId);
				var result = qGenPdf.execute();
				var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
				switchPdf(page);
				
				orb_listerReglements();
				ohr_reinitialiser(); // on met à jour l'onglet des historiques
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_switchInterface() {
	try {
		var typeRemise = document.getElementById('orb-typeRemise').value;
		document.getElementById('orb-remiseEspeces').collapsed = (typeRemise!="E");
		document.getElementById('orb-remiseAutres').collapsed = (typeRemise!="A");
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_genererInterfaceEspeces() {
	try {
		var rowsBillets = document.getElementById('orb-rowsBillets');
		var qEspeces = new QueryHttp("Facturation/Remises_Banque/getEspeces.tmpl");
		qEspeces.setParam("Type", "B");
		var result = qEspeces.execute();
		var lesBillets = result.responseXML.documentElement.getElementsByTagName("champ");
		for (var i=0;i<lesBillets.length;i++) {
			var row = orb_creerRow(lesBillets.item(i), 'B');
			rowsBillets.appendChild(row);
		}
		
		var rowsPieces = document.getElementById('orb-rowsPieces');
		qEspeces.setParam("Type", "P");
		result = qEspeces.execute();
		var lesPieces = result.responseXML.documentElement.getElementsByTagName("champ");
		for (var i=0;i<lesPieces.length;i++) {
			var row = orb_creerRow(lesPieces.item(i), 'P');
			rowsPieces.appendChild(row);
		}
		
		document.getElementById('orb-totalBillets').value = "0.00";
		document.getElementById('orb-totalPieces').value = "0.00";
		document.getElementById('orb-totalRemiseEspeces').value = "0.00";
		
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_creerRow(result, type) {
	try {

		var monnaieId = result.getAttribute("Monnaie_Id");
		var valeur = result.getAttribute("Valeur");
		var symbole = result.getAttribute("Symbole");
    var qteRemise = result.getAttribute("Qte_Remise");
    var valeurTotale = valeur;
    
    var idQte = "orb-qte" + monnaieId;
    var idMontant = "orb-mt" + monnaieId;

		var dataEntryNode = document.createElementNS(XUL_NS, "xul:row");
		dataEntryNode.setAttribute("style", "height:30px");
		dataEntryNode.setAttribute("align", "center");
  	var hbox = document.createElementNS(XUL_NS, "xul:hbox");
  	hbox.setAttribute("pack", "center");
  	var label = document.createElementNS(XUL_NS, "xul:label");
  	label.setAttribute("value", nf.format(valeur));
  	hbox.appendChild(label);
  	label = document.createElementNS(XUL_NS, "xul:label");
  	label.setAttribute("value", symbole);
  	hbox.appendChild(label);
  	dataEntryNode.appendChild(hbox);
  	
  	if (type=='P') {
  		valeurTotale *= qteRemise;
  		
  		hbox = document.createElementNS(XUL_NS, "xul:hbox");
    	hbox.setAttribute("pack", "center");
    	label = document.createElementNS(XUL_NS, "xul:label");
    	label.setAttribute("value", qteRemise);
    	hbox.appendChild(label);
    	dataEntryNode.appendChild(hbox);
    	
    	hbox = document.createElementNS(XUL_NS, "xul:hbox");
    	hbox.setAttribute("pack", "center");
    	label = document.createElementNS(XUL_NS, "xul:label");
    	label.setAttribute("value", nf.format(valeurTotale));
    	hbox.appendChild(label);
    	label = document.createElementNS(XUL_NS, "xul:label");
    	label.setAttribute("value", symbole);
    	hbox.appendChild(label);
    	dataEntryNode.appendChild(hbox);
  	}
  	
  	hbox = document.createElementNS(XUL_NS, "xul:hbox");
  	hbox.setAttribute("pack", "center");
  	var textbox = document.createElementNS(XUL_NS, "xul:textbox");
  	textbox.setAttribute("class", "nombre");
  	textbox.setAttribute("maxlength", "4");
  	textbox.setAttribute("size", "15");
  	textbox.setAttribute("value", "0");
  	textbox.setAttribute("id", idQte);
  	textbox.setAttribute("timeout", "200");
  	

  	textbox.setAttribute("oncommand", "orb_calculerMontant('"+ valeurTotale +"', '"+ idQte +"', '"+ idMontant +"')");
  	textbox.setAttribute("type", "timed");
  	hbox.appendChild(textbox);
  	dataEntryNode.appendChild(hbox);
  	
  	hbox = document.createElementNS(XUL_NS, "xul:hbox");
  	hbox.setAttribute("pack", "center");
  	textbox = document.createElementNS(XUL_NS, "xul:textbox");
  	textbox.setAttribute("class", "nombre");
  	textbox.setAttribute("readonly", "true");
  	textbox.setAttribute("size", "15");
  	textbox.setAttribute("value", "0.00");
  	textbox.setAttribute("id", idMontant);
  	hbox.appendChild(textbox);
  	dataEntryNode.appendChild(hbox);
  	
  	if (type=='P') { orb_tabPieces.push(new Array(qteRemise*valeur, monnaieId)); }
  	else { orb_tabBillets.push(new Array(valeur, monnaieId)); }

		return dataEntryNode;

  } catch (e) {
		recup_erreur(e);
  }
}


function orb_calculerMontant(valeur, idSource, idDest) {
	try {
		var qte = document.getElementById(idSource).value;
		var montant = (isPositiveOrNullInteger(qte)?parseIntBis(qte)*parseFloat(valeur):0);
		document.getElementById(idDest).value = orb_nf.format(montant);
		
		var montantBillets = 0;
		for (var i=0; i<orb_tabBillets.length; i++) {
			var valInter = orb_tabBillets[i][0];
			var qteInter = document.getElementById("orb-qte"+ orb_tabBillets[i][1]).value;
			montantBillets += (isPositiveOrNullInteger(qteInter)?parseIntBis(qteInter)*parseFloat(valInter):0);
		}
		
		var montantPieces = 0;
		for (var i=0; i<orb_tabPieces.length; i++) {
			var valInter = orb_tabPieces[i][0];
			var qteInter = document.getElementById("orb-qte"+ orb_tabPieces[i][1]).value;
			montantPieces += (isPositiveOrNullInteger(qteInter)?parseIntBis(qteInter)*parseFloat(valInter):0);
		}
		
		var montantTotal = montantBillets + montantPieces;
		
		document.getElementById('orb-totalBillets').value = orb_nf.format(montantBillets);
		document.getElementById('orb-totalPieces').value = orb_nf.format(montantPieces);
		document.getElementById('orb-totalRemiseEspeces').value = orb_nf.format(montantTotal);
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_reinitialiserEspeces() {
	try {
		
		for (var i=0; i<orb_tabBillets.length; i++) {
			document.getElementById("orb-qte"+ orb_tabBillets[i][1]).value = "0";
			document.getElementById("orb-mt"+ orb_tabBillets[i][1]).value = "0.00";
		}
		for (var i=0; i<orb_tabPieces.length; i++) {
			document.getElementById("orb-qte"+ orb_tabPieces[i][1]).value = "0";
			document.getElementById("orb-mt"+ orb_tabPieces[i][1]).value = "0.00";
		}
		
		document.getElementById('orb-totalBillets').value = "0.00";
		document.getElementById('orb-totalPieces').value = "0.00";
		document.getElementById('orb-totalRemiseEspeces').value = "0.00";
		
		document.getElementById('orb-banqueRemise').selectedIndex = 0;
		document.getElementById('orb-bValiderRemiseEspeces').disabled = true;
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_pressOnBanqueRemiseEspeces() {
	try {
		document.getElementById('orb-bValiderRemiseEspeces').disabled = (document.getElementById('orb-banqueRemise').selectedIndex == 0);
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_validerRemiseEspeces() {
	try {
		if (window.confirm("Voulez-vous valider la remise en banque ?")) {
			var banqueRemise = document.getElementById('orb-banqueRemise').value;
	
			var listeRemiseBillets = "";
			var listeRemisePieces = "";
			
			var ok = true;
			var totalQte = 0;
			var i=0;
			while (ok && i<orb_tabBillets.length) {
				var qte = document.getElementById("orb-qte"+ orb_tabBillets[i][1]).value;
				if (!isPositiveOrNullInteger(qte)) { ok = false; }
				else if (parseIntBis(qte)>0) {
					listeRemiseBillets += orb_tabBillets[i][1] +";";
					listeRemiseBillets += qte + ",";
					totalQte += parseIntBis(qte);
				}
				i++;
			}
			var i=0;
			while (ok && i<orb_tabPieces.length) {
				var qte = document.getElementById("orb-qte"+ orb_tabPieces[i][1]).value;
				if (!isPositiveOrNullInteger(qte)) { ok = false; }
				else if (parseIntBis(qte)>0) {
					listeRemisePieces += orb_tabPieces[i][1] +";";
					listeRemisePieces += qte + ",";
					totalQte += parseIntBis(qte);
				}
				i++;
			}
			
			if (!ok) { showWarning("Votre saisie est incorrecte !"); }
			else if (totalQte==0) { showWarning("Le total de la remise doit être supérieur à 0 !"); }
			else {
				var qValider = new QueryHttp("Facturation/Remises_Banque/validerRemiseEspeces.tmpl");
				qValider.setParam("Liste_Remise_Billets", listeRemiseBillets);
				qValider.setParam("Liste_Remise_Pieces", listeRemisePieces);
				qValider.setParam("Banque", banqueRemise);
				var result = qValider.execute();
				var remiseId = result.responseXML.documentElement.getAttribute("Remise_Id");
				
				var transfertAuto = (result.responseXML.documentElement.getAttribute("Transfert_Auto")=="true");
				if (transfertAuto) {
					var qVerifier = new QueryHttp("Facturation/Transfert/VerifTransfert.tmpl");
					qVerifier.setParam("Liste_Id", remiseId);
					qVerifier.setParam("Type", "REMISE_ESP"); // vérif unique pour les remises et les annulations de remises
					result = qVerifier.execute();
					var errors = new Errors(result);
					if (errors.hasNext()) {
						errors.show();
					} else {
						var qTransfertAuto = new QueryHttp("Facturation/Transfert/TransfertAuto.tmpl");
						qTransfertAuto.setParam("Remise_Id", remiseId);
						qTransfertAuto.setParam("Type", "REMISE_ESP");
						qTransfertAuto.execute();
					}
				}
				
				var qGenPdf = new QueryHttp("Facturation/Remises_Banque/pdfRemise.tmpl");
				qGenPdf.setParam('Especes', 'true');
				qGenPdf.setParam('Remise_Id', remiseId);
				var result = qGenPdf.execute();
				var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
				switchPdf(page);
				
				orb_reinitialiserEspeces();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function orb_pressOnListeReglements(listitem, indexTypeTiers) {
	try {
		
		if (document.getElementById('orb-comboBanques').value=="0" && !document.getElementById('orb-listeReglements').disabled) {
			var cks = listitem.getElementsByTagName("listcell");
			var reglementId = listitem.value;
			var typeTiers = cks.item(indexTypeTiers).getAttribute("label");
			var url="chrome://opensi/content/facturation/user/remises_banque/popup-affecterBanqueRemise.xul?"+ cookie();
			window.openDialog(url,'','chrome,modal,centerscreen',reglementId,typeTiers,orb_listerReglements);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


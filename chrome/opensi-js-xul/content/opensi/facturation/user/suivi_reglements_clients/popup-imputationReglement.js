/******************************************************************************/
/* OpenSi : Outils libres de gestion d'entreprise                             */
/* Copyright (C) 2003 Speedinfo.fr S.A.R.L.                                   */
/* Contact: contact@opensi.org                                                */
/*                                                                            */
/* This program is free software; you can redistribute it and/or              */
/* modify it under talhe terms of the GNU General Public License              */
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
/*
 * Arguments :
 * 0 -> Type (R -> règlement ; A -> Avoir ; B -> Boucle)
 * 1 -> Id (du règlement ou de l'avoir)
 */


jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");

var aEcheances=new Arbre("Facturation/Suivi_Reglements_Clients/liste-affectationEcheances.tmpl", "listeEcheances");

var pieceId;
var modeRegId = "";
var montantTotal = 0;
var montantImpute = 0;
var montantRestant = 0;
var boucler;
var creation;

var listeReglements = "";
var listeAvoirs = "";
var currentIndex = 0;
var typePiece;
var validationOk = false;

var nf = new NumberFormat("0.00", false);


function init() {
	try {

		window.parent.addEventListener("close",alertExit,false);
		window.resizeTo(1000,750);
		typePiece = window.arguments[0];
		pieceId = window.arguments[1];
		boucler = (typePiece=="B");
		creation = window.arguments[3];
		
		if (boucler) {
			var qListePieces = new QueryHttp("Facturation/Suivi_Reglements_Clients/getListePiecesImputables.tmpl");
			var result = qListePieces.execute();
			listeReglements = result.responseXML.documentElement.getAttribute("Liste_Reglements");
			listeAvoirs = result.responseXML.documentElement.getAttribute("Liste_Avoirs");
			
			if (isEmpty(listeReglements) && isEmpty(listeAvoirs)) {
				showWarning("Il n'y a aucune échéance à imputer.");
				window.close();
			} else {
				var reg=new RegExp("[,]+", "g");
				if (listeReglements.length>0) {
					listeReglements = listeReglements.split(reg);
					pieceId = listeReglements[0];
					typePiece = "R";
					
					if (listeAvoirs.length>0) { listeAvoirs = listeAvoirs.split(reg); }
				} else if (listeAvoirs.length>0) {
					listeAvoirs = listeAvoirs.split(reg);
					pieceId = listeAvoirs[0];
					typePiece = "A";
				}
				currentIndex++;
			}
		}
		
		reinitialiser();
	} catch (e) {
		recup_erreur(e);
	}
}


function reinitialiser() {
	try {
		if (typePiece=="R") {
			var qReglement = new QueryHttp("Facturation/Suivi_Reglements_Clients/getReglementClient.tmpl");
			qReglement.setParam("Reglement_Id", pieceId);
			var result = qReglement.execute();
			
			modeRegId = result.responseXML.documentElement.getAttribute("Mode_Reg_Id");
			montantTotal = parseFloat(result.responseXML.documentElement.getAttribute("Montant_Restant"));
			document.getElementById('typePiece').value = "Règlement";
			document.getElementById('modeReglement').value = result.responseXML.documentElement.getAttribute("Mode_Reglement");
			document.getElementById('datePiece').value = result.responseXML.documentElement.getAttribute("Date_Reglement");
			document.getElementById('numPiece').value = result.responseXML.documentElement.getAttribute("Num_Piece");
			document.getElementById('numClient').value = result.responseXML.documentElement.getAttribute("Client_Id");
			document.getElementById('raisonSociale').value = result.responseXML.documentElement.getAttribute("Denomination");
			
		} else if (typePiece=="A") {
			var qAvoir = new QueryHttp("Facturation/Suivi_Reglements_Clients/getAvoirClient.tmpl");
			qAvoir.setParam("Avoir_Id", pieceId);
			var result = qAvoir.execute();
			
			modeRegId = "";
			montantTotal = parseFloat(result.responseXML.documentElement.getAttribute("Montant_Restant"));
			document.getElementById('typePiece').value = "Avoir";
			document.getElementById('modeReglement').value = "";
			document.getElementById('datePiece').value = result.responseXML.documentElement.getAttribute("Date_Avoir");
			document.getElementById('numPiece').value = result.responseXML.documentElement.getAttribute("Num_Piece");
			document.getElementById('numClient').value = result.responseXML.documentElement.getAttribute("Client_Id");
			document.getElementById('raisonSociale').value = result.responseXML.documentElement.getAttribute("Denomination");
		}
		
		document.getElementById("nouveauMontant").value = "";
		document.getElementById("montantTotal").value = nf.format(montantTotal);
		
		document.getElementById('lblModeReglement').collapsed=(typePiece!="R");
		document.getElementById('modeReglement').collapsed=(typePiece!="R");
		
		document.getElementById('bIgnorer').collapsed=!boucler;
		document.getElementById('bValider').setAttribute("tooltiptext", !boucler?"valider et quitter":"valider et passer à l'imputation suivante");
		document.getElementById('bValider').disabled=true;
		
		aEcheances.setParam("Client_Id", document.getElementById('numClient').value);
		aEcheances.setParam("Denomination", document.getElementById('raisonSociale').value);
		aEcheances.setParam("Mode_Reg_Id", modeRegId);
		aEcheances.setParam("Montant", montantTotal);
		aEcheances.setParam("Type_Piece", typePiece);
		aEcheances.initTree(initListeEcheances);
	} catch (e) {
		recup_erreur(e);
	}
}


function initListeEcheances() {
	try {
		calculTotaux();
		var listeEcheances = document.getElementById("listeEcheances");
		var nombreElements = listeEcheances.getRowCount();
		if (nombreElements==0) {
			if (boucler) {
				imputationSuivante();
			}	else {
				showWarning("Il n'y a aucune échéance à imputer.");
				window.close();
			}
		} else {
			checkValidationPossible();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function calculTotaux() {
	try {
		
		montantImpute = 0;
		var modeRegEgal = true;

		var listeEcheances = document.getElementById("listeEcheances");
		var nombreElements = listeEcheances.getRowCount();
		
		for (var i=0; i<nombreElements; i++) {
			if (listeEcheances.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
				montantImpute += parseFloat(listeEcheances.getItemAtIndex(i).getElementsByTagName("listcell").item(5).getAttribute("label"));
				if (typePiece=="R" && modeRegEgal && modeRegId!=listeEcheances.getItemAtIndex(i).getElementsByTagName("listcell").item(6).getAttribute("label")) {
					modeRegEgal = false;
				}
			}
		}
		montantImpute = parseFloat(nf.format(montantImpute));
		montantRestant = montantTotal - montantImpute;

		document.getElementById("montantImpute").value = nf.format(montantImpute);
		document.getElementById("montantRestant").value = nf.format(montantRestant);

		document.getElementById("lblMontantRestant").style.color = (montantRestant==0?"green":"red");
		document.getElementById("montantRestant").style.color = (montantRestant==0?"green":"red");
		
		document.getElementById("lblCheckModeReg").value = (typePiece=="A" || modeRegEgal?"":"Attention : les modes de règlements sont différents !");

	} catch (e) {
		recup_erreur(e);
	}
}


function checkValidationPossible() {
	try {
		var existeCoche = false;
		var listbox = document.getElementById('listeEcheances');

		var nbLignes = listbox.getRowCount();
		var i = 0;

		while (i<nbLignes && !existeCoche) {
			var item = listbox.getItemAtIndex(i);
			var cks = item.getElementsByTagName("listcell");
			if ((cks.item(0).getAttribute("checked")=="true") && (parseFloat(cks.item(5).getAttribute("label"))>0)) {
				existeCoche=true;
			}
			i++;
		}
		
		document.getElementById('bValider').disabled = (!existeCoche);
	} catch (e) {
		recup_erreur(e);
	}
}


function testCheck(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		if (cks.item(0).getAttribute("checked")=="false") {
			cks.item(0).setAttribute("checked","true");
		} else {
			cks.item(0).setAttribute("checked","false");
			cks.item(5).setAttribute("label", "0.00");
			document.getElementById('nouveauMontant').value = "0.00";
		}
		checkValidationPossible();
		calculTotaux();
	} catch (e) {
		recup_erreur(e);
	}
}


function selectOnListeEcheances() {
	try {
		var liste = document.getElementById("listeEcheances");
		if (liste.selectedIndex!=-1) {
			var item = liste.getItemAtIndex(liste.selectedIndex);
			var cell = item.getElementsByTagName("listcell");
			document.getElementById("nouveauMontant").value = cell.item(5).getAttribute("label");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function onKeyPress(e) {
	try {
		if (e.keyCode==13) {
		 	changerMontant();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function changerMontant() {
	try {
		var montant = document.getElementById("nouveauMontant").value;
		var liste = document.getElementById("listeEcheances");
		
		if (liste.selectedIndex==-1) { showWarning("Veuillez sélectionner une échéance !"); }
		else if (isEmpty(montant) || !isPositiveOrNull(montant)) { showWarning("Montant incorrect !"); }
		else {
			montant = parseFloat(montant);
			var item = liste.getItemAtIndex(liste.selectedIndex);
			var cell = item.getElementsByTagName("listcell");
			var montantRestant = parseFloat(cell.item(4).getAttribute("label"));
			if (montant > montantRestant) { showWarning("Le montant doit être inférieur au montant restant !"); }
			else {
				cell.item(5).setAttribute("label",nf.format(montant));
				cell.item(0).setAttribute("checked",(isPositive(montant)));
				liste.selectedIndex = -1;
				document.getElementById("nouveauMontant").value = "";
				
				calculTotaux();
				checkValidationPossible();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function verifierMontantMax() {
	try {

		var liste = document.getElementById("listeEcheances");
		var nombreElements = liste.getRowCount();
		var continuer = true;
		var i=0;
		while (i<nombreElements && continuer) {
			if (liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
				var impute = parseFloat(liste.getItemAtIndex(i).getElementsByTagName("listcell").item(5).getAttribute("label"));
				var restant = parseFloat(liste.getItemAtIndex(i).getElementsByTagName("listcell").item(4).getAttribute("label"));

				if (impute != restant) {
					continuer = false;
				}
			}
			else {
				continuer=false;
			}
			i++;
		}
		return continuer;

	} catch (e) {
		recup_erreur(e);
	}

}


function imputationSuivante() {
	try {
		if (boucler) {
			if (typePiece=="R" && currentIndex==listeReglements.length) {
				currentIndex = 0;
				typePiece = "A";
			}
			if (typePiece=="A" && currentIndex==listeAvoirs.length) {
				majListeParente();
			} else {
				if (typePiece=="R") {
					pieceId = listeReglements[currentIndex];
				} else {
					pieceId = listeAvoirs[currentIndex];
				}
				currentIndex++;
				
				reinitialiser();
			}
			
		} else {
			majListeParente();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function majListeParente() {
	try {
		if (validationOk && (window.arguments[2]!="")) { window.arguments[2](); }
		window.close();
	} catch (e) {
		recup_erreur(e);
	}
}


function valider() {
	try {
		
		var ok = false;
		if (montantRestant > 0) {
			if (verifierMontantMax()) {
				ok = window.confirm("Un surplus sera créé ! Etes-vous sûr de vouloir continuer ?");
			} else {
				ok = true;
			}
		}
		else if (montantRestant < 0) {
			if (typePiece=="R") { showWarning("Vous ne pouvez pas affecter plus que le montant du règlement !"); }
			else if (typePiece=="A") { showWarning("Vous ne pouvez pas affecter plus que le montant de l'avoir !"); }
		}
		else {
			ok = true;
		}
		
		
		if (ok) {
			document.getElementById('bValider').disabled=true;
			document.getElementById('bIgnorer').disabled=true;
			document.getElementById('bQuitter').disabled=true;
			
			var liste = document.getElementById("listeEcheances");
			var listeEcheances = "";
			var nombreElements = liste.getRowCount();
			for (var i=0; i<nombreElements; i++) {
				if (liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
					listeEcheances += liste.getItemAtIndex(i).value +";";
					listeEcheances += liste.getItemAtIndex(i).getElementsByTagName("listcell").item(5).getAttribute("label") +",";
				}
			}
			
			if (isEmpty(listeEcheances)) { showWarning("Veuillez cocher au moins une échéance !"); }
			else {
				var qAffecterReglement = new QueryHttp("Facturation/Suivi_Reglements_Clients/affecterImputationReglement.tmpl");
				qAffecterReglement.setParam("Piece_Id", pieceId);
				qAffecterReglement.setParam("Type_Piece", typePiece);
				qAffecterReglement.setParam("Liste_Echeances", listeEcheances);
				qAffecterReglement.setParam("Montant_Restant", montantRestant);
				qAffecterReglement.execute();
				validationOk = true;
				
				imputationSuivante();
			}
			
			document.getElementById('bValider').disabled=false;
			document.getElementById('bIgnorer').disabled=false;
			document.getElementById('bQuitter').disabled=false;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function quitter() {
	try {
		if (!creation || window.confirm("Attention, le règlement a été créé mais pas encore imputé.\nVoulez-vous vraiment quitter ?")) {
			window.close();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function alertExit() {
	try {
		if (creation) { showWarning("Attention, le règlement a été créé mais pas encore imputé."); }
	} catch (e) {
		recup_erreur(e);
	}
}


function desinit() {
	try {

		window.parent.removeEventListener("close",alertExit,false);

	} catch (e) {
  	recup_erreur(e);
  }
}

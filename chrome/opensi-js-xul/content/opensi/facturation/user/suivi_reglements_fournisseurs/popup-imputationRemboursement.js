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
 * 0 -> Type (R -> remboursement unique ; B -> Boucle)
 * 1 -> Id du remboursement
 */


jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");

var aReglements=new Arbre("Facturation/Suivi_Reglements_Fournisseurs/liste-affectationReglements.tmpl", "listeReglements");

var remboursementId;
var montantTotal = 0;
var montantImpute = 0;
var montantRestant = 0;
var boucler;
var creation;

var listeRemboursements;
var currentIndex = 0;
var validationOk = false;

var nf = new NumberFormat("0.00", false);


function init() {
	try {

		window.parent.addEventListener("close",alertExit,false);
		window.resizeTo(1000,750);
		boucler = (window.arguments[0]=="B");
		remboursementId = window.arguments[1];
		creation = window.arguments[3];
		
		if (boucler) {
			var qListePieces = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/getListeRemboursementsImputables.tmpl");
			var result = qListePieces.execute();
			listeRemboursements = result.responseXML.documentElement.getAttribute("Liste_Remboursements")
			
			if (isEmpty(listeRemboursements)) {
				showWarning("Il n'y a aucun règlement à imputer.");
				window.close();
			} else {
				var reg=new RegExp("[,]+", "g");
				listeRemboursements = listeRemboursements.split(reg);
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
		var qRemboursement = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/getRemboursementFournisseur.tmpl");
		qRemboursement.setParam("Remboursement_Id", remboursementId);
		var result = qRemboursement.execute();
		
		montantTotal = parseFloat(result.responseXML.documentElement.getAttribute("Montant_Restant"));
		document.getElementById('modeReglement').value = result.responseXML.documentElement.getAttribute("Mode_Reglement");
		document.getElementById('datePiece').value = result.responseXML.documentElement.getAttribute("Date_Remboursement");
		document.getElementById('numPiece').value = result.responseXML.documentElement.getAttribute("Num_Piece");
		//document.getElementById('numFournisseur').value = result.responseXML.documentElement.getAttribute("Fournisseur_Id");
		
		var fournId = result.responseXML.documentElement.getAttribute("Fournisseur_Id");
			
			///if(fournId==""){alert("vide!");}
			
			if(fournId!="") {
				document.getElementById('numFournisseur').value = fournId;
			} else {
				document.getElementById('numFournisseur').value ="";
			}
		
		//alert(fournId);
		
		document.getElementById('raisonSociale').value = result.responseXML.documentElement.getAttribute("Denomination");
		
		document.getElementById("nouveauMontant").value = "";
		document.getElementById("montantTotal").value = nf.format(montantTotal);
		
		document.getElementById('bIgnorer').collapsed=!boucler;
		document.getElementById('bValider').setAttribute("tooltiptext", !boucler?"valider et quitter":"valider et passer à l'imputation suivante");
		document.getElementById('bValider').disabled=true;
		
		aReglements.setParam("Fournisseur_Id", document.getElementById('numFournisseur').value);
		
		
		
		
		
		
		aReglements.setParam("Denomination", document.getElementById('raisonSociale').value);
		aReglements.setParam("Montant", montantTotal);
		aReglements.initTree(initListeReglements);
	} catch (e) {
		recup_erreur(e);
	}
}


function initListeReglements() {
	try {
		calculTotaux();
		var listeReglements = document.getElementById("listeReglements");
		var nombreElements = listeReglements.getRowCount();
		if (nombreElements==0) {
			if (boucler) {
				imputationSuivante();
			}	else {
				showWarning("Il n'y a aucun règlement à imputer.");
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

		var listeReglements = document.getElementById("listeReglements");
		var nombreElements = listeReglements.getRowCount();
		
		for (var i=0; i<nombreElements; i++) {
			if (listeReglements.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
				montantImpute += parseFloat(listeReglements.getItemAtIndex(i).getElementsByTagName("listcell").item(5).getAttribute("label"));
			}
		}
		montantImpute = parseFloat(nf.format(montantImpute));
		montantRestant = montantTotal-montantImpute;

		document.getElementById("montantImpute").value = nf.format(montantImpute);
		document.getElementById("montantRestant").value = nf.format(montantRestant);

		document.getElementById("lblMontantRestant").style.color = (montantRestant==0?"green":"red");
		document.getElementById("montantRestant").style.color = (montantRestant==0?"green":"red");

	} catch (e) {
		recup_erreur(e);
	}
}


function checkValidationPossible() {
	try {
		var existeCoche = false;
		var listbox = document.getElementById('listeReglements');

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
			cks.item(5).setAttribute("label","0.00");
			document.getElementById('nouveauMontant').value = "0.00";
		}
		checkValidationPossible();
		calculTotaux();
	} catch (e) {
		recup_erreur(e);
	}
}


function selectOnListeReglements() {
	try {
		var liste = document.getElementById("listeReglements");
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
		var liste = document.getElementById("listeReglements");
		
		if (liste.selectedIndex==-1) { showWarning("Veuillez sélectionner un règlement ou avoir !"); }
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
	try{

		var liste = document.getElementById("listeReglements");
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
			if (currentIndex==listeReglements.length) {
				majListeParente();
			} else {
				remboursementId = listeReglements[currentIndex];
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
			showWarning("Vous ne pouvez pas affecter plus que le montant du remboursement !");
		}
		else {
			ok = true;
		}
		
		
		if (ok) {
			var liste = document.getElementById("listeReglements");
			var listeReglements = "";
			var nombreElements = liste.getRowCount();
			for (var i=0; i<nombreElements; i++) {
				if (liste.getItemAtIndex(i).getElementsByTagName("listcell").item(0).getAttribute("checked")=="true") {
					listeReglements += liste.getItemAtIndex(i).value +";";
					listeReglements += liste.getItemAtIndex(i).getElementsByTagName("listcell").item(5).getAttribute("label") +";";
					listeReglements += liste.getItemAtIndex(i).getElementsByTagName("listcell").item(6).getAttribute("label") +",";
				}
			}
			
			if (isEmpty(listeReglements)) { showWarning("Veuillez cocher au moins un règlement !"); }
			else {
				var qAffecterRemboursement = new QueryHttp("Facturation/Suivi_Reglements_Fournisseurs/affecterImputationRemboursement.tmpl");
				qAffecterRemboursement.setParam("Remboursement_Id", remboursementId);
				qAffecterRemboursement.setParam("Liste_Reglements", listeReglements);
				qAffecterRemboursement.setParam("Montant_Restant", montantRestant);
				qAffecterRemboursement.execute();
				validationOk = true;
				
				imputationSuivante();
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function quitter() {
	try {
		if (!creation || window.confirm("Attention, le remboursement a été créé mais pas encore imputé.\nVoulez-vous vraiment quitter ?")) {
			window.close();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function alertExit() {
	try {
		if (creation) { showWarning("Attention, le remboursement a été créé mais pas encore imputé."); }
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

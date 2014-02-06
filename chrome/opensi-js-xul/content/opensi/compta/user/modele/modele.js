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

var aComboModes;
var aListeModeles;
var aModeleEcriture;

var modeleId;
var ligneId;
var change;
var etat;

function init() {
	try {
		// init des variables globales
		modeleId = 0;
		ligneId = 0;
		change = false;
		etat = 'N';
		
		// init de la menulist des modes de règlement
  		aComboModes = new Arbre("ComboListe/combo-modesReglement.tmpl","filtreModesLigne");
  		aComboModes.initTree();
  		
  		// init de la liste des modeles dispo
  		aListeModeles = new Arbre("Compta/Modele/listeModele.tmpl","treeModele");
  		aListeModeles.initTree();
  		  		
  		// init des lignes du modèle
  		aModeleEcriture = new Arbre("Compta/Modele/listeLigne.tmpl","treeLigne");
  		aModeleEcriture.initTree();
  		
  		// préparation du menu
  		activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function retourMenuPrincipal() {
	try {

    window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();

	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnTreeModele() {
	try {
 		if (aListeModeles.isSelected()) {
 			var index = aListeModeles.getCurrentIndex();
			var id = aListeModeles.getCellText(index,"colModeleId");
			ouvrir(id);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ouvrir(id) {
	try {
		modeleId = id;
		
		// récupération des infos du modèle
		var qGetModele = new QueryHttp("Compta/Modele/getModele.tmpl");
		if (modeleId!=0) {
			qGetModele.setParam("IdModele", modeleId);
		}
		var result = qGetModele.execute();
		
		var libelle = result.responseXML.documentElement.getAttribute('libelle');
		var raccourci = result.responseXML.documentElement.getAttribute('raccourci');
		var codeEtat = result.responseXML.documentElement.getAttribute('etat');
		
		// affichage du modèle
		document.getElementById('libelle').value = libelle;
		document.getElementById('raccourci').value = raccourci;
		
		// init var globales
		ligneId = 0;
		change = false;
		etat = codeEtat;
		
		// init des lignes du modèle
		aModeleEcriture.clearParams();
		aModeleEcriture.setParam("ModId", modeleId);
		aModeleEcriture.initTree(finInitModele);
		
	} catch (e) {
		recup_erreur(e);
	}
}

function finInitModele() {
	try {
		// WARNING : problème de synchronisation !!!
		setTimeout("activeMenu();", 100);
	} catch (e) {
  		recup_erreur(e);
	}
}

function activeMenu() {
	try {
		// actions générales
		document.getElementById('bNouveau').disabled = false;
		document.getElementById('bEnregistrer').disabled = !change;
		document.getElementById('bSupprimer').disabled = (modeleId==0);
		document.getElementById('bCopier').disabled = (modeleId==0 || change);
		document.getElementById('bValider').disabled = (modeleId==0 || change || etat=='V');
		
		// champs de saisie de ligne
		document.getElementById('compteLigne').disabled = (modeleId==0);
		document.getElementById('libelleLigne').disabled = (modeleId==0);
		document.getElementById('filtreModesLigne').disabled = (modeleId==0);
		document.getElementById('infosLigne').disabled = (modeleId==0);
		document.getElementById('debitLigne').disabled = (modeleId==0);
		document.getElementById('creditLigne').disabled = (modeleId==0);
		document.getElementById('pieceLigne').disabled = (modeleId==0);
		document.getElementById('filtreCalculLigne').disabled = (modeleId==0);
	
		// actions sur les lignes
		document.getElementById('bAnnulerLigne').disabled = (modeleId==0);
		document.getElementById('bValiderLigne').disabled = (modeleId==0);
		document.getElementById('bSupprimerLigne').disabled = (modeleId==0);
		
		// reset ligne
		annulerLigneModele();
	} catch (e) {
  		recup_erreur(e);
	}
}

function desactiveMenu() {
	try {
		// actions générales
		document.getElementById('bNouveau').disabled = true;
		document.getElementById('bEnregistrer').disabled = true;
		document.getElementById('bSupprimer').disabled = true;
		document.getElementById('bCopier').disabled = true;
		document.getElementById('bValider').disabled = true;
		
		// actions sur les lignes
		document.getElementById('bAnnulerLigne').disabled = true;
		document.getElementById('bValiderLigne').disabled = true;
		document.getElementById('bSupprimerLigne').disabled = true;
	} catch (e) {
  		recup_erreur(e);
	}
}

function keyPressOnLibelle(event) {
	try {
		change = true;
		activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function changeOnRaccourci() {
	try {
		change = true;
		activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnNouveau() {
	try {
		var go = true;
		if (change) {
			go = window.confirm("Voulez-vous saisir un nouveau modèle d'écriture ?\nVous allez perdre les informations non enregistrées.");
		}
		if (go) {
			desactiveMenu();
			nouveau();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnSupprimer() {
	try {
		var go = false;
		if (modeleId!=0) {
			go = window.confirm("Voulez-vous supprimer ce modèle ?");
		}
		if (go) {
			desactiveMenu();
			supprimer();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnEnregistrer() {
	try {
		var go = false;
		// verifs diverses
		// libelle unique -> vérifié sur le serveur
		// raccourci 0 à 9 : 0 selectionnable n fois, 1 à 9 une seule fois
		var raccourci = document.getElementById('raccourci').value;
		if (raccourci==0 || !existRaccourci(raccourci)) {
			go = true;
		} else { showWarning("Ce raccourci est déjà utilisé !") }
		
		if (go) {
			desactiveMenu();
			enregistrer();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function existRaccourci(raccourci) {
	try {
		var trouve = false;
		var i=0;
		while (i<aListeModeles.nbLignes() && !trouve) {
			if (aListeModeles.getCellText(i,"colRaccourci")==raccourci) {
				trouve = true;
			}
			i++;
		}
		return trouve;
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnCopier() {
	try {
		var go = false;
		if (modeleId!=0) {
			go = window.confirm("Voulez-vous dupliquer ce modèle ?")
		}
		if (go) {
			desactiveMenu();
			copier();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnValider() {
	try {
		var go = false;
		if (modeleId!=0) {
			go = window.confirm("Voulez-vous valider ce modèle ?");
		}
		if (go) {
			desactiveMenu();
			valider();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function nouveau() {
	try {
  		// reset des variables globales
  		modeleId = 0;
  		ligneId = 0;
  		change = false;
  		
  		// reset de l'arbre
  		aModeleEcriture.deleteTree();
  		
  		// reset du modèle
  		document.getElementById('libelle').value = "";
  		document.getElementById('raccourci').value = 0;
  		
  		// reset du formulaire de ligne
  		annulerLigneModele();
  		
  		// refresh menu
  		activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function supprimer() {
	try {
		var queryDelete = new QueryHttp("Compta/Modele/deleteModele.tmpl");
		
		queryDelete.setParam("Mod_Ecr_Id", modeleId);
		
		var result = queryDelete.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			activeMenu();
		} else {
			// refresh de la liste
			aListeModeles.deleteTree();
			aListeModeles.initTree();
			// reset
			nouveau();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function enregistrer() {
	try {
		var querySave = new QueryHttp("Compta/Modele/saveModele.tmpl");
					
		querySave.setParam("Mod_Ecr_Id", modeleId);
		querySave.setParam("Libelle", urlEncode(document.getElementById('libelle').value));
		querySave.setParam("Raccourci", document.getElementById('raccourci').value);
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			activeMenu();
		} else {
			modeleId = result.responseXML.documentElement.getAttribute('Mod_Ecr_Id');
			aListeModeles.deleteTree();
			aListeModeles.initTree();
			change = false;
			activeMenu();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function copier() {
	try {
		var queryCopier = new QueryHttp("Compta/Modele/copyModele.tmpl");
		
		queryCopier.setParam("Mod_Ecr_Id", modeleId);
		
		var result = queryCopier.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			activeMenu();
		} else {
			// refresh de la liste
			aListeModeles.deleteTree();
			aListeModeles.initTree();
			// refresh modele
			var id = result.responseXML.documentElement.getAttribute('Mod_Ecr_Id');
			ouvrir(id);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function valider() {
	try {		
		var queryValider = new QueryHttp("Compta/Modele/validateModele.tmpl");
		
		queryValider.setParam("Mod_Ecr_Id", modeleId);
		
		var result = queryValider.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			activeMenu();
		} else {
			// refresh de la liste
			aListeModeles.deleteTree();
			aListeModeles.initTree();
			// refresh modele
			ouvrir(modeleId);
		}
	} catch(e) {
		recup_erreur(e);
	}
}

function keyPressOnCompte(event) {
	try {
		if (event.keyCode==13) {
			rechercheCompte(document.getElementById('compteLigne').value);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function rechercheCompte(numero_compte) {
	try {
		var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Creer=false&Num_Compte="+urlEncode(numero_compte);
    	window.openDialog(url,'','chrome,modal,centerscreen',finRechercheCompte);
	} catch (e) {
		recup_erreur(e);
	}
}

function finRechercheCompte(numCompte) {
	try {
		document.getElementById('compteLigne').value = numCompte;
	} catch (e) {
		recup_erreur(e);
	}
}

function selectOnTreeLigne() {
	try {
		loadLigneModele();
	} catch (e) {
		recup_erreur(e);
	}
}

function loadLigneModele() {
	try {
		if (aModeleEcriture.isSelected()) {
			var index = aModeleEcriture.getCurrentIndex();
			ligneId = aModeleEcriture.getCellText(index,'colLigneId');
  			document.getElementById('compteLigne').value = aModeleEcriture.getCellText(index,'colCompte');
			document.getElementById('libelleLigne').value = aModeleEcriture.getCellText(index,'colLibelle');
			document.getElementById('filtreModesLigne').value = (isEmpty(aModeleEcriture.getCellText(index,'colReglementId')))?0:aModeleEcriture.getCellText(index,'colReglementId');
			document.getElementById('infosLigne').value = aModeleEcriture.getCellText(index,'colInfos');
			var debit = aModeleEcriture.getCellText(index,'colDebit');
			var credit = aModeleEcriture.getCellText(index,'colCredit')
			var calcul = aModeleEcriture.getCellText(index,'colCalculId');
			if (calcul=='P') {
				document.getElementById('debitLigne').value = (debit.length==0)?debit:debit.substring(0,debit.length-1);
				document.getElementById('creditLigne').value = (credit.length==0)?credit:credit.substring(0,credit.length-1);
			} else {
				document.getElementById('debitLigne').value = debit;
				document.getElementById('creditLigne').value = credit;
			}
			document.getElementById('pieceLigne').value = aModeleEcriture.getCellText(index,'colPiece');
			document.getElementById('filtreCalculLigne').value = calcul;
			document.getElementById('chkPeriode').checked = (aModeleEcriture.getCellText(index,'colPeriode')!=0);
  		}
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnAnnulerLigne() {
	try {
		desactiveMenu();
		annulerLigneModele();
		activeMenu();
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnValiderLigne() {
	try {
		var verif = false;
		// verif compte
		if (!isCompteCorrect(document.getElementById('compteLigne').value)) { showWarning("Numéro de compte incorrect !"); }			
		
		// verif libelle
		else if (isEmpty(document.getElementById('libelleLigne').value)) { showWarning("Libellé incorrect !"); }
		
		// verif mode reglement
		
		// verif infos
		
		// verif debit (la partie décimale ne peux faire plus de 2 caractères)
		else if (!checkDecimal(document.getElementById('debitLigne').value,2)) { showWarning("Montant au débit incorrect !"); }
		
		// verif debit (la partie entière ne peux faire plus de 14 caractères)
		else if (!checkIPart(document.getElementById('debitLigne').value,14)) { showWarning("Montant au débit incorrect !"); }
		
		// verif debit (positif)
		else if (!isPositiveOrNull(document.getElementById('debitLigne').value)) { showWarning("Montant au débit incorrect : montant négatif !"); }
		
		// verif credit (la partie décimale ne peux faire plus de 2 caractères)
		else if (!checkDecimal(document.getElementById('creditLigne').value,2)) { showWarning("Montant au crédit incorrect !"); }
		
		// verif credit (la partie entière ne peux faire plus de 14 caractères)
		else if (!checkIPart(document.getElementById('creditLigne').value,14)) { showWarning("Montant au crédit incorrect !"); }
		
		// verif credit (positif)
		else if (!isPositiveOrNull(document.getElementById('creditLigne').value)) { showWarning("Montant au crédit incorrect : montant négatif !"); }
		
		// verif debit ou credit : l'un ou l'autre doit être vide mais pas les deux
		// doubles vides : (d="" || d=0) && (c="" || c=0)
		else if (document.getElementById('filtreCalculLigne').value!='S'
			&& (isEmpty(document.getElementById('debitLigne').value)
				|| document.getElementById('debitLigne').value==0)
			&& (isEmpty(document.getElementById('creditLigne').value)
				|| document.getElementById('creditLigne').value==0)) { showWarning("Veuillez saisir un debit ou un credit !"); }
		// doubles montants : d=x && c=x  <=>  d!="" && d!=0 && c!="" && c!=0
		else if (!isEmpty(document.getElementById('debitLigne').value)
			&& !isEmpty(document.getElementById('creditLigne').value)
			&& document.getElementById('debitLigne').value!=0
			&& document.getElementById('creditLigne').value!=0) { showWarning("Veuillez ne saisir qu'un débit OU un crédit !"); }
		// montants dans une ligne sans montant
		else if (document.getElementById('filtreCalculLigne').value=='S'
			&& ((!isEmpty(document.getElementById('debitLigne').value)
					&& document.getElementById('debitLigne').value!=0)
				|| (!isEmpty(document.getElementById('creditLigne').value)
					&& document.getElementById('creditLigne').value!=0))) { showWarning("Veuillez ne pas saisir de montants dans une ligne sans montant !"); }
		// montant supérieur à 100 dans un pourcentage
		else if (document.getElementById('filtreCalculLigne').value=='P'
			&& ((!isEmpty(document.getElementById('debitLigne').value)
					&& document.getElementById('debitLigne').value>100)
				|| (!isEmpty(document.getElementById('creditLigne').value)
					&& document.getElementById('creditLigne').value>100))) { showWarning("Veuillez ne pas saisir de montants supérieurs à 100 dans une ligne en pourcentage !"); }
				
		// verif piece
		
		// verif calcul
		else if (document.getElementById('filtreCalculLigne').selectedIndex==0) { showWarning("Veuillez choisir un type de calcul !"); }
				
		else { verif = true; }
		
		if (verif) {
			desactiveMenu();
			saveLigneModele();
			activeMenu();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnSupprimerLigne() {
	try {
		if (ligneId!=0) {
			desactiveMenu();
			supprimerLigneModele();
			activeMenu();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function annulerLigneModele() {
	try {
		// reset la ligne
		
		// si le modèle n'est pas vide, on charge le libelle, le num pièce et le type de calcul de la dernière ligne
		if (modeleId!=0 && aModeleEcriture.nbLignes()!=0) {
		var index = aModeleEcriture.nbLignes()-1;
			document.getElementById('libelleLigne').value = aModeleEcriture.getCellText(index,'colLibelle');
			document.getElementById('pieceLigne').value = aModeleEcriture.getCellText(index,'colPiece');
			document.getElementById('filtreCalculLigne').value = aModeleEcriture.getCellText(index,'colCalculId');
			document.getElementById('chkPeriode').checked = (aModeleEcriture.getCellText(index,'colPeriode')!=0);
		} else {
			document.getElementById('libelleLigne').value = "";
			document.getElementById('pieceLigne').value = "";
			document.getElementById('filtreCalculLigne').value = 0;
			document.getElementById('chkPeriode').checked = "true";
		}
			
		ligneId = 0;
		aModeleEcriture.select(-1);
		
		document.getElementById('compteLigne').value = "";
		document.getElementById('filtreModesLigne').value = "0";
		document.getElementById('infosLigne').value = "";
		document.getElementById('debitLigne').value = "0.00";
		document.getElementById('creditLigne').value = "0.00";
	} catch (e) {
		recup_erreur(e);
	}
}

function saveLigneModele() {
	try {
		desactiveMenu();
		
		var querySave = new QueryHttp("Compta/Modele/saveLigne.tmpl");
		
		querySave.setParam("Ligne_Id", ligneId);
		querySave.setParam("Mod_Ecr_Id", modeleId);
		querySave.setParam("Numero_Compte", document.getElementById('compteLigne').value);
		querySave.setParam("Libelle", urlEncode(document.getElementById('libelleLigne').value));
		querySave.setParam("Montant_D", document.getElementById('debitLigne').value);
		querySave.setParam("Montant_C", document.getElementById('creditLigne').value);
		querySave.setParam("Mode_Reg_Id", document.getElementById('filtreModesLigne').value);
		querySave.setParam("Commentaire", urlEncode(document.getElementById('infosLigne').value));
		querySave.setParam("Num_Piece", urlEncode(document.getElementById('pieceLigne').value));
		querySave.setParam("Type_Calcul", document.getElementById('filtreCalculLigne').value);
		querySave.setParam("Periode_Lib", document.getElementById('chkPeriode').checked);
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			activeMenu();
		} else {
			// rafraichir l'arbre
			aListeModeles.deleteTree();
			aListeModeles.initTree();
			
	  		ouvrir(modeleId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function supprimerLigneModele() {
	try {
		desactiveMenu();
		
		var querySuppr = new QueryHttp("Compta/Modele/deleteLigne.tmpl");
		
		querySuppr.setParam("Ligne_Id", ligneId);
		
		var result = querySuppr.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			activeMenu();
		} else {
			// rafraichir l'arbre
			aListeModeles.deleteTree();
			aListeModeles.initTree();
			
	  		ouvrir(modeleId);
		}
	} catch (e) {
		recup_erreur(e);
	}
}
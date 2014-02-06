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

var opi_aListeModeReg;

var opi_aParamCompte;
var opi_aParamModeReg;
var opi_aParamNumPiece;

var opi_selLigneCompte;
var opi_selLigneModeReg;
var opi_selLigneNumPiece;

var opi_paramId;

function opi_init() {
	try {
		opi_paramId = 0;
		opi_selLigneCompte = false;
		opi_selLigneModeReg = false;
		opi_selLigneNumPiece = false;
		opi_aListeModeReg = new Arbre('ComboListe/combo-modesReglement.tmpl', 'opi-listeModeReg');
		opi_aListeModeReg.initTree();
		
		opi_aParamCompte = new Arbre('Compta/ImportBanque/listeParamCompte.tmpl', 'opi-treeParamCompte');
		opi_aParamModeReg = new Arbre('Compta/ImportBanque/listeParamModeReg.tmpl', 'opi-treeParamModeReg');
		opi_aParamNumPiece = new Arbre('Compta/ImportBanque/listeParamNumPiece.tmpl', 'opi-treeParamNumPiece');
	} catch (e) {
  		recup_erreur(e);
	}
}

function opi_reset() {
	try {
		var newParam = oib_paramId;
		if (opi_paramId!=newParam) {
			opi_selLigneCompte = false;
			opi_selLigneModeReg = false;
			opi_selLigneNumPiece = false;
			
			opi_activeAllLignes(false);
			opi_videLignes();
			
			opi_paramId = newParam;
			
			opi_aParamCompte.clearParams();
			opi_aParamModeReg.clearParams();
			opi_aParamNumPiece.clearParams();
			
			if (opi_paramId!=0) {
				// recup param
				opi_aParamCompte.setParam("ParamId", opi_paramId);
				opi_aParamModeReg.setParam("ParamId", opi_paramId);
				opi_aParamNumPiece.setParam("ParamId", opi_paramId);
			}
			opi_aParamCompte.initTree();
			opi_aParamModeReg.initTree();
			opi_aParamNumPiece.initTree();
			
			opi_activeAllLignes(true);
		}
	} catch (e) {
  		recup_erreur(e);
	}
}

function opi_activeAllLignes(boolean) {
	try {
		opi_activeLigneCompte(boolean);
		opi_activeLigneModeReg(boolean);
		opi_activeLigneNumPiece(boolean);
	} catch (e) {
  		recup_erreur(e);
	}
}

function opi_activeLigneCompte(boolean) {
	try {
		if (opi_selLigneCompte) {
			document.getElementById('opi-libelleRechercheAffectation').disabled = true;
			document.getElementById('opi-bSupprimerAffectation').disabled = !boolean;
		} else {
			document.getElementById('opi-libelleRechercheAffectation').disabled = !boolean;
			document.getElementById('opi-bSupprimerAffectation').disabled = true;
		}
		document.getElementById('opi-libelleRemplacementAffectation').disabled = !boolean;
		document.getElementById('opi-compteRecetteAffectation').disabled = !boolean;
		document.getElementById('opi-bRechercheCompteRecetteAffectation').disabled = !boolean;
		document.getElementById('opi-compteDepenseAffectation').disabled = !boolean;
		document.getElementById('opi-bRechercheCompteDepenseAffectation').disabled = !boolean;
		document.getElementById('opi-bNouveauAffectation').disabled = !boolean;
		document.getElementById('opi-bEnregistrerAffectation').disabled = !boolean;
	} catch (e) {
  		recup_erreur(e);
	}
}

function opi_activeLigneModeReg(boolean) {
	try {
		if (opi_selLigneModeReg) {
			document.getElementById('opi-libelleRechercheModeReg').disabled = true;
			document.getElementById('opi-bSupprimerModeReg').disabled = !boolean;
		} else {
			document.getElementById('opi-libelleRechercheModeReg').disabled = !boolean;
			document.getElementById('opi-bSupprimerModeReg').disabled = true;
		}
		document.getElementById('opi-listeModeReg').disabled = !boolean;
		document.getElementById('opi-bNouveauModeReg').disabled = !boolean;
		document.getElementById('opi-bEnregistrerModeReg').disabled = !boolean;
	} catch (e) {
  		recup_erreur(e);
	}
}

function opi_activeLigneNumPiece(boolean) {
	try {
		if (opi_selLigneNumPiece) {
			document.getElementById('opi-libelleRechercheNumPiece').disabled = true;
			document.getElementById('opi-bSupprimerNumPiece').disabled = !boolean;
		} else {
			document.getElementById('opi-libelleRechercheNumPiece').disabled = !boolean;
			document.getElementById('opi-bSupprimerNumPiece').disabled = true;
		}
		document.getElementById('opi-listeModeReg').disabled = !boolean;
		document.getElementById('opi-bEnregistrerNumPiece').disabled = !boolean;
		document.getElementById('opi-bNouveauNumPiece').disabled = !boolean;
	} catch (e) {
  		recup_erreur(e);
	}
}

function opi_videLignes() {
	try {
		document.getElementById('opi-libelleRechercheAffectation').value = "";
		document.getElementById('opi-libelleRemplacementAffectation').value = "";
		document.getElementById('opi-compteRecetteAffectation').value = "";
		document.getElementById('opi-compteDepenseAffectation').value = "";
		
		document.getElementById('opi-libelleRechercheModeReg').value = "";
		document.getElementById('opi-listeModeReg').value = 0;
		
		
		document.getElementById('opi-libelleRechercheNumPiece').value = "";
		document.getElementById('opi-nbCarNumPiece').value = "";
	} catch (e) {
  		recup_erreur(e);
	}
}

function opi_selectOnTreeCompte() {
	try {
 		if (opi_aParamCompte.isSelected()) {
 			opi_selLigneCompte = true;
 			var index = opi_aParamCompte.getCurrentIndex();
			document.getElementById('opi-libelleRechercheAffectation').value = opi_aParamCompte.getCellText(index,'opi-colLibRechCompte');
			document.getElementById('opi-libelleRemplacementAffectation').value = opi_aParamCompte.getCellText(index,'opi-colLibRempCompte');
			document.getElementById('opi-compteRecetteAffectation').value = opi_aParamCompte.getCellText(index,'opi-colRecette');
			document.getElementById('opi-compteDepenseAffectation').value = opi_aParamCompte.getCellText(index,'opi-colDepense');
			opi_activeLigneCompte(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnRechercheCompteRecetteAffectation() {
	try {
		opi_rechercheCompteRecetteAffectation();
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnRechercheCompteDepenseAffectation() {
	try {
		opi_rechercheCompteDepenseAffectation();
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_rechercheCompteRecetteAffectation() {
	try {
		var compte = document.getElementById('opi-compteRecetteAffectation').value;
		var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie()+"&Creer=false&Num_Compte="+ urlEncode(compte);
		window.openDialog(url,'','chrome,modal,centerscreen',opi_retourRechercheCompteRecetteAffectation);
	} catch (e) {
  		recup_erreur(e);
	}
}

function opi_retourRechercheCompteRecetteAffectation(numCompte) {
	try {
		document.getElementById('opi-compteRecetteAffectation').value = numCompte;
		opi_activeLigneCompte(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_rechercheCompteDepenseAffectation() {
	try {
		var compte = document.getElementById('opi-compteDepenseAffectation').value;
		var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie()+"&Creer=false&Num_Compte="+ urlEncode(compte);
		window.openDialog(url,'','chrome,modal,centerscreen',opi_retourRechercheCompteDepenseAffectation);
	} catch (e) {
  		recup_erreur(e);
	}
}

function opi_retourRechercheCompteDepenseAffectation(numCompte) {
	try {
		document.getElementById('opi-compteDepenseAffectation').value = numCompte;
		opi_activeLigneCompte(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnNouveauAffectation() {
	try {
		opi_activeLigneCompte(false);
		opi_newAffectation();
		opi_activeLigneCompte(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_newAffectation() {
	try {
		opi_aParamCompte.select(-1);
		opi_selLigneCompte = false;
		
		document.getElementById('opi-libelleRechercheAffectation').value = "";
		document.getElementById('opi-libelleRemplacementAffectation').value = "";
		document.getElementById('opi-compteRecetteAffectation').value = "";
		document.getElementById('opi-compteDepenseAffectation').value = "";
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnEnregistrerAffectation() {
	try {
		opi_activeLigneCompte(false);
		// verif libelle
		if (isEmpty(document.getElementById('opi-libelleRechercheAffectation').value)) { showWarning("Libellé incorrect !"); }
		// verif compte recette
		else if (!isCompteCorrect(document.getElementById('opi-compteRecetteAffectation').value)) { showWarning("Numéro de compte de recettes incorrect !"); }
		// verif compte recette
		else if (!isCompteCorrect(document.getElementById('opi-compteDepenseAffectation').value)) { showWarning("Numéro de compte de dépenses incorrect !"); }
		
		else {
			opi_saveAffectation();
		}
		opi_activeLigneCompte(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_saveAffectation() {
	try {
		var querySave = new QueryHttp("Compta/ImportBanque/saveParamCompte.tmpl");
	
		querySave.setParam("Param_Id", opi_paramId);
		querySave.setParam("Lib_Rech", urlEncode(document.getElementById('opi-libelleRechercheAffectation').value));
		querySave.setParam("Lib_Remp", urlEncode(document.getElementById('opi-libelleRemplacementAffectation').value));
		querySave.setParam("Compte_Rec", document.getElementById('opi-compteRecetteAffectation').value);
		querySave.setParam("Compte_Dep", document.getElementById('opi-compteDepenseAffectation').value);
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			// rafraichir l'arbre
			opi_aParamCompte.deleteTree();
			opi_aParamCompte.initTree();
			opi_newAffectation();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnSupprimerAffectation() {
	try {
		opi_activeLigneCompte(false);
		opi_deleteAffectation();
		opi_activeLigneCompte(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_deleteAffectation() {
	try {
		if (isEmpty(document.getElementById('opi-libelleRechercheAffectation').value)) { showWarning("Veuillez selectionner une ligne à supprimer"); }
		else {
			var querySuppr = new QueryHttp("Compta/ImportBanque/deleteParamCompte.tmpl");
			
			querySuppr.setParam("Param_Id", opi_paramId);
			querySuppr.setParam("Lib_Rech", urlEncode(document.getElementById('opi-libelleRechercheAffectation').value));
			
			var result = querySuppr.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
			} else {
				// rafraichir l'arbre
				opi_aParamCompte.deleteTree();
				opi_aParamCompte.initTree();
				opi_newAffectation();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_selectOnTreeModeReg() {
	try {
 		if (opi_aParamModeReg.isSelected()) {
 			opi_selLigneModeReg = true;
 			var index = opi_aParamModeReg.getCurrentIndex();
			document.getElementById('opi-libelleRechercheModeReg').value = opi_aParamModeReg.getCellText(index,'opi-colLibRechModeReg');
			document.getElementById('opi-listeModeReg').value = opi_aParamModeReg.getCellText(index,'opi-colParamModeRegId');
			opi_activeLigneModeReg(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnNouveauModeReg() {
	try {
		opi_activeLigneModeReg(false);
		opi_newModeReg();
		opi_activeLigneModeReg(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_newModeReg() {
	try {
		opi_aParamModeReg.select(-1);
		opi_selLigneModeReg = false;
		
		document.getElementById('opi-libelleRechercheModeReg').value = "";
		document.getElementById('opi-listeModeReg').value = 0;
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnEnregistrerModeReg() {
	try {
		opi_activeLigneModeReg(false);
		// verif libelle
		if (isEmpty(document.getElementById('opi-libelleRechercheModeReg').value)) { showWarning("Libellé incorrect !"); }
		
		// verif modereg
		else if (document.getElementById('opi-libelleRechercheModeReg').value==0) { showWarning("Veuillez choisir un mode de réglement !"); }
		
		else {
			opi_saveModeReg();
		}
		opi_activeLigneModeReg(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_saveModeReg() {
	try {
		var querySave = new QueryHttp("Compta/ImportBanque/saveParamModeReg.tmpl");
	
		querySave.setParam("Param_Id", opi_paramId);
		querySave.setParam("Lib_Mode_Reg", urlEncode(document.getElementById('opi-libelleRechercheModeReg').value));
		querySave.setParam("Mode_Reg_Id", urlEncode(document.getElementById('opi-listeModeReg').value));
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			// rafraichir l'arbre
			opi_aParamModeReg.deleteTree();
			opi_aParamModeReg.initTree();
			opi_newModeReg();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnSupprimerModeReg() {
	try {
		opi_activeLigneModeReg(false);
		opi_deleteModeReg();
		opi_activeLigneModeReg(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_deleteModeReg() {
	try {
		if (isEmpty(document.getElementById('opi-libelleRechercheModeReg').value)) { showWarning("Veuillez selectionner une ligne à supprimer"); }
		else {
			var querySuppr = new QueryHttp("Compta/ImportBanque/deleteParamModeReg.tmpl");
			
			querySuppr.setParam("Param_Id", opi_paramId);
			querySuppr.setParam("Lib_Mode_Reg", urlEncode(document.getElementById('opi-libelleRechercheModeReg').value));
			
			var result = querySuppr.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
			} else {
				// rafraichir l'arbre
				opi_aParamModeReg.deleteTree();
				opi_aParamModeReg.initTree();
				opi_newModeReg();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_selectOnTreeNumPiece() {
	try {
 		if (opi_aParamNumPiece.isSelected()) {
 			opi_selLigneNumPiece = true;
 			var index = opi_aParamNumPiece.getCurrentIndex();
			document.getElementById('opi-libelleRechercheNumPiece').value = opi_aParamNumPiece.getCellText(index,'opi-colLibRechNumPiece');
			document.getElementById('opi-nbCarNumPiece').value = opi_aParamNumPiece.getCellText(index,'opi-colNbCarNumPiece');
			opi_activeLigneNumPiece(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnNouveauNumPiece() {
	try {
		opi_activeLigneNumPiece(false);
		opi_newNumPiece();
		opi_activeLigneNumPiece(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_newNumPiece() {
	try {
		opi_aParamNumPiece.select(-1);
		opi_selLigneNumPiece = false;
		
		document.getElementById('opi-libelleRechercheNumPiece').value = "";
		document.getElementById('opi-nbCarNumPiece').value = "";
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnEnregistrerNumPiece() {
	try {
		opi_activeLigneNumPiece(false);
		// verif libelle
		if (isEmpty(document.getElementById('opi-libelleRechercheNumPiece').value)) { showWarning("Libellé incorrect !"); }
		// verif nb car
		else if (!isPositiveOrNullInteger(document.getElementById('opi-nbCarNumPiece').value)) { showWarning("Nombre de caractères incorrect !") }
		// verif nb car <= 20
		else if (document.getElementById('opi-nbCarNumPiece').value>20) { showWarning("Le nombre de caractères ne peut excéder 20 !"); }
		else {
			opi_saveNumPiece();
		}
		opi_activeLigneNumPiece(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_saveNumPiece() {
	try {
		var querySave = new QueryHttp("Compta/ImportBanque/saveParamNumPiece.tmpl");
	
		querySave.setParam("Param_Id", opi_paramId);
		querySave.setParam("Lib_Num_Piece", urlEncode(document.getElementById('opi-libelleRechercheNumPiece').value));
		querySave.setParam("Nb_Car_Piece", document.getElementById('opi-nbCarNumPiece').value);
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			// rafraichir l'arbre
			opi_aParamNumPiece.deleteTree();
			opi_aParamNumPiece.initTree();
			opi_newNumPiece();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_pressOnSupprimerNumPiece() {
	try {
		opi_activeLigneNumPiece(false);
		opi_deleteNumPiece();
		opi_activeLigneNumPiece(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opi_deleteNumPiece() {
	try {
		if (isEmpty(document.getElementById('opi-libelleRechercheNumPiece').value)) { showWarning("Veuillez selectionner une ligne à supprimer"); }
		else {
			var querySuppr = new QueryHttp("Compta/ImportBanque/deleteParamNumPiece.tmpl");
			
			querySuppr.setParam("Param_Id", opi_paramId);
			querySuppr.setParam("Lib_Num_Piece", urlEncode(document.getElementById('opi-libelleRechercheNumPiece').value));
			
			var result = querySuppr.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
			} else {
				// rafraichir l'arbre
				opi_aParamNumPiece.deleteTree();
				opi_aParamNumPiece.initTree();
				opi_newNumPiece();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

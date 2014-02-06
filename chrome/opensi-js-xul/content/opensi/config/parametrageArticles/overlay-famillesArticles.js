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

var ofa_aFamilles = new Arbre('Config/GetRDF/listeFamilles.tmpl', 'ofa-liste_familles');

var ofa_aComptesNational = new Arbre("Config/GetRDF/liste_comptes_familles_articles.tmpl", "ofa-liste_comptes_familles_national");
var ofa_aComptesUE = new Arbre("Config/GetRDF/liste_comptes_familles_articles.tmpl", "ofa-liste_comptes_familles_ue");
var ofa_aComptesNatUE = new Arbre("Config/GetRDF/liste_comptes_familles_articles_nat_ue.tmpl", "ofa-liste_comptes_familles_nat_ue");
var ofa_aComptesInternational = new Arbre("Config/GetRDF/liste_comptes_familles_articles.tmpl", "ofa-liste_comptes_familles_international");


var ofa_currentChampCompte = "";
var ofa_curFamilleId = "";
var ofa_curFamilleLibelle = "";
var ofa_curParentId = "";
var ofa_curParentLibelle = "";
var ofa_actif = true;

function ofa_initFamilles() {
	try {
		
		document.getElementById('ofa-afficherTout').setAttribute("checked", false);
		ofa_chargerListe();

	} catch (e) {
    recup_erreur(e);
  }
}


function ofa_chargerListe() {
	try {
		var chkAfficherTout = document.getElementById('ofa-afficherTout').checked?"1":"0";
		document.getElementById('ofa-colPictoActif').collapsed = !chkAfficherTout;
		ofa_aFamilles.setParam("Afficher_Tout", chkAfficherTout);
		ofa_aFamilles.initTree(ofa_nouvelleFamille);
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_rechcompte(id) {
	try {

		var debCompte="";
		var nom="";
    switch (id) {
    	case 'ofa-Compte_Vente_National':
    		debCompte="7";
        nom="VENTE";
        break;
    	case 'ofa-Compte_Vente_UE':
    		debCompte="7";
        nom="VENTE UE";
        break;
      case 'ofa-Compte_Vente_Nat_UE':
    		debCompte="7";
        nom="VENTE UE";
        break;
    	case 'ofa-Compte_Vente_International':
  			debCompte="7";
        nom="VENTE INTERNATIONAL";
        break;
      case 'ofa-Compte_Achat_National':
  			debCompte="6";
        nom="ACHAT";
        break;
      case 'ofa-Compte_Achat_UE':
  			debCompte="6";
        nom="ACHAT UE";
        break;
      case 'ofa-Compte_Achat_International':
  			debCompte="6";
        nom="ACHAT INTERNATIONAL";
        break;
    }
    ofa_currentChampCompte = id;
    var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie();
    url += "&Type_Compte=G";
		url += "&Force_Deb="+ debCompte;
    url += "&nom="+ urlEncode(nom);
    url += "&Num_Compte="+ urlEncode(debCompte);
    url += "&Creer=false";
    window.openDialog(url,'','chrome,modal,centerscreen',ofa_retourChoixCompte);

	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_retourChoixCompte(numCompte) {
	try {
		
		document.getElementById(ofa_currentChampCompte).value = numCompte;
		ofa_currentChampCompte = "";

	} catch (e) {
		  recup_erreur(e);
	}
}



function ofa_nouvelleFamille() {
	try {
		
		document.getElementById('ofa-Famille_Parente').value = "";
		document.getElementById('ofa-Nom_Famille').value = "";
		document.getElementById('ofa-Nom_Famille').disabled = false;
		document.getElementById('ofa-Row_Famille_Parente').collapsed = true;
		document.getElementById('ofa-bAjouterSousFamille').collapsed = true;
		document.getElementById('ofa-bNouveau').collapsed = true;
		document.getElementById('ofa-bEnregistrer').collapsed = false;
		document.getElementById('ofa-bReactiver').collapsed = true;
		document.getElementById('ofa-bSupprimer').collapsed = true;
		ofa_desactiverComptesNational();
		
		ofa_curFamilleId = "";
		ofa_curFamilleLibelle = "";
		ofa_curParentId = "";
		ofa_curParentLibelle = "";
		ofa_actif = true;
		
		if (ofa_aFamilles.isNotNull()) {
			ofa_aFamilles.select(-1);
		}
		
	} catch (e) {
    recup_erreur(e);
  }
}


function ofa_nouvelleSousFamille() {
	try {
		
		ofa_curParentId = ofa_curFamilleId;
		ofa_curParentLibelle = ofa_curFamilleLibelle;

		document.getElementById('ofa-Famille_Parente').value = ofa_curParentLibelle;
		document.getElementById('ofa-Nom_Famille').value = "";
		document.getElementById('ofa-Row_Famille_Parente').collapsed = false;
		document.getElementById('ofa-bAjouterSousFamille').collapsed = true;
		document.getElementById('ofa-bSupprimer').collapsed = true;
		ofa_desactiverComptesNational();
		
		
		ofa_curFamilleId = "";
		ofa_curFamilleLibelle = "";
		ofa_aFamilles.select(-1);

	} catch (e) {
    recup_erreur(e);
  }
}


function ofa_enregistrerFamille() {
	try {

		var nom = document.getElementById('ofa-Nom_Famille').value;

		if (isEmpty(nom)) {
			showWarning("Le champ nom est obligatoire !");
		}
		else {
			var qEnregistrer;
			if (ofa_curFamilleId!="") {
				qEnregistrer = new QueryHttp("Config/gestion_commerciale/famille/modifierFamille.tmpl");
				qEnregistrer.setParam("Famille_Id", ofa_curFamilleId);
			}
			else {
				qEnregistrer = new QueryHttp("Config/gestion_commerciale/famille/creerFamille.tmpl");
			}
			qEnregistrer.setParam("Nom", nom);
			qEnregistrer.setParam("Parent_Id", ofa_curParentId);
			var result = qEnregistrer.execute();
			var codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
			if (codeErreur=="1") {
				showWarning("Erreur : une famille porte déjà le même nom !");
			} else if (codeErreur=="2") {
				showWarning("Erreur lors de l'enregistrement de la famille !");
			} else {
				if (isEmpty(ofa_curFamilleId)) {
					ofa_curFamilleId = result.responseXML.documentElement.getAttribute("Famille_Id");
				}
				ofa_chargerListe();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ofa_supprimerFamille() {
	try {

		if (window.confirm("Voulez-vous supprimer la famille '"+ ofa_curFamilleLibelle +"' ?")) {
			
			var qSupprimer = new QueryHttp("Config/gestion_commerciale/famille/supprimerFamille.tmpl");
			qSupprimer.setParam("Famille_Id", ofa_curFamilleId);
			var result = qSupprimer.execute();
			var codeErreur = result.responseXML.documentElement.getAttribute("codeErreur");
			if (codeErreur=="1") {
				showWarning("La famille a simplement été désactivée car d'autres familles en dépendent !");
			} else if (codeErreur=="2") {
				showWarning("La famille a simplement été désactivée car des articles en dépendent !");
			} else if (codeErreur=="3") {
				showWarning("Erreur lors de la suppression de la famille '"+ ofa_curFamilleLibelle +"' !");
			}
			
			if (codeErreur!="3") {
				ofa_chargerListe();
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ofa_reactiverFamille() {
	try {
		if (window.confirm("Voulez-vous réactiver la famille '"+ ofa_curFamilleLibelle +"' ?")) {
			var qReactiver = new QueryHttp("Config/gestion_commerciale/famille/reactiverFamille.tmpl");
			qReactiver.setParam('Famille_Id', ofa_curFamilleId);
			qReactiver.execute(ofa_chargerListe);
		}
	} catch (e) {
		recup_erreur(e);
	}
}




function ofa_ouvrirFamille() {
	try {

		if (ofa_aFamilles.isSelected()) {
		
			var currentIndex = ofa_aFamilles.getCurrentIndex();
			ofa_actif = (ofa_aFamilles.getCellText(currentIndex, 'ofa-colActif')=="1");
			ofa_curFamilleId = ofa_aFamilles.getItemValue(currentIndex);
			ofa_curFamilleLibelle = ofa_aFamilles.getCellText(currentIndex, 'ofa-ColLibelle');
			ofa_curParentId = ofa_aFamilles.getCellText(currentIndex, 'ofa-ColParentId');
			ofa_curParentLibelle = ofa_aFamilles.getCellText(currentIndex, 'ofa-ColLibelleParent');
			document.getElementById('ofa-Nom_Famille').value = ofa_curFamilleLibelle;
			document.getElementById('ofa-Nom_Famille').disabled = !ofa_actif;
			document.getElementById('ofa-Famille_Parente').value = ofa_curParentLibelle;
			
			var niveau = ofa_aFamilles.getCellText(currentIndex, 'ofa-ColNiveau');
			document.getElementById('ofa-Row_Famille_Parente').collapsed = (niveau=="1");
			document.getElementById('ofa-bAjouterSousFamille').collapsed = (!ofa_actif || niveau=="3");
			document.getElementById('ofa-bNouveau').collapsed = false;
			document.getElementById('ofa-bEnregistrer').collapsed = !ofa_actif;
			document.getElementById('ofa-bReactiver').collapsed = ofa_actif;
			document.getElementById('ofa-bSupprimer').collapsed = !ofa_actif;

			ofa_desactiverComptesNational();
			ofa_activerComptesNational();
		}

	} catch (e) {
    recup_erreur(e);
  }
}



function ofa_existeCompteFamille(familleId, code_tva) {
	try {
		var qExistCF = new QueryHttp("Config/gestion_commerciale/famille/existeCompteFamilleArticle.tmpl");
		qExistCF.setParam("Famille_Id", familleId);
		qExistCF.setParam("Code_TVA", code_tva);
		var result = qExistCF.execute();
		var existe = (result.responseXML.documentElement.getAttribute('existe') == "true");
		return existe;
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_existeCompteFamilleNatUE(familleId, code_pays, code_tva) {
	try {
		var qExistCF = new QueryHttp("Config/gestion_commerciale/famille/existeCompteFamilleArticleNatUE.tmpl");
		qExistCF.setParam("Famille_Id", familleId);
		qExistCF.setParam("Code_Pays", code_pays);
		qExistCF.setParam("Code_TVA", code_tva);
		var result = qExistCF.execute();
		var existe = (result.responseXML.documentElement.getAttribute('existe') == "true");
		return existe;
	} catch (e) {
		recup_erreur(e);
	}
}




function ofa_pressOnComptesFamillesNational() {
	try {
		var tree = document.getElementById('ofa-liste_comptes_familles_national');
		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("ofa-Code_TVA_National").value = getCellText(tree,tree.currentIndex,'ofa-ColCode_TVA_National');
			document.getElementById("ofa-Taux_TVA_National").value = getCellText(tree,tree.currentIndex,'ofa-ColTaux_TVA_National');
			document.getElementById("ofa-Compte_Achat_National").value = getCellText(tree,tree.currentIndex,'ofa-ColCompte_Achat_National');
			document.getElementById("ofa-Compte_Vente_National").value = getCellText(tree,tree.currentIndex,'ofa-ColCompte_Vente_National');
			
			document.getElementById("ofa-Aplus_National").disabled=!ofa_actif;
			document.getElementById("ofa-Amoins_National").disabled=!ofa_actif;
			document.getElementById("ofa-Vplus_National").disabled=!ofa_actif;
			document.getElementById("ofa-Vmoins_National").disabled=!ofa_actif;
			document.getElementById("ofa-bValiderCompte_National").disabled=!ofa_actif;
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function ofa_validerCompteFamilleNational() {
	try {

		if (isEmpty(document.getElementById('ofa-Code_TVA_National').value)) {
			showWarning("Veuillez sélectionner un taux de TVA !");
		} else {
			var code_tva = document.getElementById("ofa-Code_TVA_National").value;
			var compte_achat = document.getElementById("ofa-Compte_Achat_National").value;
			var compte_vente = document.getElementById("ofa-Compte_Vente_National").value;

			if (isEmpty(compte_achat) && isEmpty(compte_vente)) {
				// Suppression compte famille
				var qSupprCF = new QueryHttp("Config/gestion_commerciale/famille/supprimerCompteFamilleArticle.tmpl");
				qSupprCF.setParam("Famille_Id", ofa_curFamilleId);
				qSupprCF.setParam("Code_TVA", code_tva);
				qSupprCF.execute();
			} else {
				var qCF;
				if (ofa_existeCompteFamille(ofa_curFamilleId, code_tva)) {
					// modifier compte famille
					qCF = new QueryHttp("Config/gestion_commerciale/famille/modifierCompteFamilleArticle.tmpl");
				} else {
					// nouveau compte famille
					qCF = new QueryHttp("Config/gestion_commerciale/famille/ajouterCompteFamilleArticle.tmpl");
				}

				qCF.setParam("Famille_Id", ofa_curFamilleId);
				qCF.setParam("Code_TVA", code_tva);
				qCF.setParam("Compte_Achat", compte_achat);
				qCF.setParam("Compte_Vente", compte_vente);
				qCF.execute();
			}
			
			document.getElementById("ofa-Aplus_National").disabled=true;
			document.getElementById("ofa-Amoins_National").disabled=true;
			document.getElementById("ofa-Vplus_National").disabled=true;
			document.getElementById("ofa-Vmoins_National").disabled=true;
			document.getElementById("ofa-bValiderCompte_National").disabled=true;

			ofa_initComptesNational();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_desactiverComptesNational() {
	try {
		
		document.getElementById("ofa-Code_TVA_National").value = "";
		document.getElementById("ofa-Taux_TVA_National").value = "";
		document.getElementById("ofa-Compte_Achat_National").value = "";
		document.getElementById("ofa-Compte_Vente_National").value = "";

		document.getElementById("ofa-liste_comptes_familles_national").disabled=true;
		document.getElementById("ofa-Aplus_National").disabled=true;
		document.getElementById("ofa-Amoins_National").disabled=true;
		document.getElementById("ofa-Vplus_National").disabled=true;
		document.getElementById("ofa-Vmoins_National").disabled=true;
		document.getElementById("ofa-bValiderCompte_National").disabled=true;
		
		ofa_aComptesNational.deleteTree();
		ofa_desactiverComptesUE();
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_activerComptesNational() {
	try {
		document.getElementById("ofa-liste_comptes_familles_national").disabled=false;

		ofa_initComptesNational();
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_initComptesNational() {
	try {
		document.getElementById("ofa-Code_TVA_National").value = "";
		document.getElementById("ofa-Taux_TVA_National").value = "";
		document.getElementById("ofa-Compte_Achat_National").value = "";
		document.getElementById("ofa-Compte_Vente_National").value = "";
		
		ofa_aComptesNational.clearParams();
		ofa_aComptesNational.setParam('Famille_Id', ofa_curFamilleId);
		ofa_aComptesNational.setParam('National', 1);
		ofa_aComptesNational.initTree(ofa_activerComptesUE);
	} catch (e) {
		recup_erreur(e);
	}
}



function ofa_pressOnComptesFamillesUE() {
	try {
		var tree = document.getElementById('ofa-liste_comptes_familles_ue');
		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("ofa-Code_TVA_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColCode_TVA_UE');
			document.getElementById("ofa-Taux_TVA_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColTaux_TVA_UE');
			document.getElementById("ofa-Code_Pays_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColCode_Pays_UE');
			document.getElementById("ofa-Pays_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColPays_UE');
			document.getElementById("ofa-Compte_Achat_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColCompte_Achat_UE');
			document.getElementById("ofa-Compte_Vente_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColCompte_Vente_UE');
			
			document.getElementById("ofa-Aplus_UE").disabled=!ofa_actif;
			document.getElementById("ofa-Amoins_UE").disabled=!ofa_actif;
			document.getElementById("ofa-Vplus_UE").disabled=!ofa_actif;
			document.getElementById("ofa-Vmoins_UE").disabled=!ofa_actif;
			document.getElementById("ofa-bValiderCompte_UE").disabled=!ofa_actif;
		}
	} catch (e) {
		recup_erreur(e);
	}
}




function ofa_validerCompteFamilleUE() {
	try {

		if (isEmpty(document.getElementById('ofa-Code_Pays_UE').value)) {
			showWarning("Veuillez sélectionner un pays !");
		}
		else {
			var code_tva = document.getElementById("ofa-Code_TVA_UE").value;
			var compteAchat = document.getElementById("ofa-Compte_Achat_UE").value;
			var compte_vente = document.getElementById("ofa-Compte_Vente_UE").value;

			if (isEmpty(compteAchat) && isEmpty(compte_vente)) {
				// Suppression compte famille
				var qSupprCF = new QueryHttp("Config/gestion_commerciale/famille/supprimerCompteFamilleArticle.tmpl");
				qSupprCF.setParam("Famille_Id", ofa_curFamilleId);
				qSupprCF.setParam("Code_TVA", code_tva);
				qSupprCF.execute();
			} else {
				var qCF;
				if (ofa_existeCompteFamille(ofa_curFamilleId, code_tva)) {
					// modifier compte famille
					qCF = new QueryHttp("Config/gestion_commerciale/famille/modifierCompteFamilleArticle.tmpl");
				} else {
					// nouveau compte famille
					qCF = new QueryHttp("Config/gestion_commerciale/famille/ajouterCompteFamilleArticle.tmpl");
				}

				qCF.setParam("Famille_Id", ofa_curFamilleId);
				qCF.setParam("Code_TVA", code_tva);
				qCF.setParam("Compte_Achat", compteAchat);
				qCF.setParam("Compte_Vente", compte_vente);
				qCF.execute();
			}
			
			document.getElementById("ofa-Aplus_UE").disabled=true;
			document.getElementById("ofa-Amoins_UE").disabled=true;
			document.getElementById("ofa-Vplus_UE").disabled=true;
			document.getElementById("ofa-Vmoins_UE").disabled=true;
			document.getElementById("ofa-bValiderCompte_UE").disabled=true;

			ofa_initComptesUE();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_desactiverComptesUE() {
	try {
		document.getElementById("ofa-Code_TVA_UE").value = "";
		document.getElementById("ofa-Taux_TVA_UE").value = "";
		document.getElementById("ofa-Code_Pays_UE").value = "";
		document.getElementById("ofa-Pays_UE").value = "";
		document.getElementById("ofa-Compte_Achat_UE").value = "";
		document.getElementById("ofa-Compte_Vente_UE").value = "";

		document.getElementById("ofa-liste_comptes_familles_ue").disabled=true;
		document.getElementById("ofa-Aplus_UE").disabled=true;
		document.getElementById("ofa-Amoins_UE").disabled=true;
		document.getElementById("ofa-Vplus_UE").disabled=true;
		document.getElementById("ofa-Vmoins_UE").disabled=true;
		document.getElementById("ofa-bValiderCompte_UE").disabled=true;
		ofa_aComptesUE.deleteTree();
		ofa_desactiverComptesNatUE();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_desactiverComptesNatUE() {
	try {
		document.getElementById("ofa-Code_TVA_Nat_UE").value = "";
		document.getElementById("ofa-Taux_TVA_Nat_UE").value = "";
		document.getElementById("ofa-Code_Pays_Nat_UE").value = "";
		document.getElementById("ofa-Pays_Nat_UE").value = "";
		document.getElementById("ofa-Compte_Vente_Nat_UE").value = "";

		document.getElementById("ofa-liste_comptes_familles_nat_ue").disabled=true;
		document.getElementById("ofa-Vplus_Nat_UE").disabled=true;
		document.getElementById("ofa-Vmoins_Nat_UE").disabled=true;
		document.getElementById("ofa-bValiderCompte_Nat_UE").disabled=true;
		ofa_aComptesNatUE.deleteTree();
		ofa_desactiverComptesInternational();
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_activerComptesUE() {
	try {
		document.getElementById("ofa-liste_comptes_familles_ue").disabled=false;

		ofa_initComptesUE();
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_initComptesUE() {
	try {
		document.getElementById("ofa-Code_TVA_UE").value = "";
		document.getElementById("ofa-Taux_TVA_UE").value = "";
		document.getElementById("ofa-Code_Pays_UE").value = "";
		document.getElementById("ofa-Pays_UE").value = "";
		document.getElementById("ofa-Compte_Achat_UE").value = "";
		document.getElementById("ofa-Compte_Vente_UE").value = "";

		ofa_aComptesUE.clearParams();
		ofa_aComptesUE.setParam('Famille_Id', ofa_curFamilleId);
		ofa_aComptesUE.setParam('UE', 1);
		ofa_aComptesUE.initTree(ofa_activerComptesNatUE);
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_activerComptesNatUE() {
	try {
		document.getElementById("ofa-liste_comptes_familles_nat_ue").disabled=false;
		
		ofa_initComptesNatUE();
	} catch (e) {
		recup_erreur(e);
	}
}



function ofa_initComptesNatUE() {
	try {
		document.getElementById("ofa-Code_TVA_Nat_UE").value = "";
		document.getElementById("ofa-Taux_TVA_Nat_UE").value = "";
		document.getElementById("ofa-Code_Pays_Nat_UE").value = "";
		document.getElementById("ofa-Pays_Nat_UE").value = "";
		document.getElementById("ofa-Compte_Vente_Nat_UE").value = "";

		ofa_aComptesNatUE.clearParams();
		ofa_aComptesNatUE.setParam('Famille_Id', ofa_curFamilleId);
		ofa_aComptesNatUE.initTree(ofa_activerComptesInternational);
	} catch (e) {
		recup_erreur(e);
	}
}



function ofa_pressOnComptesFamillesNatUE() {
	try {
		var tree = document.getElementById('ofa-liste_comptes_familles_nat_ue');
		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("ofa-Code_TVA_Nat_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColCode_TVA_Nat_UE');
			document.getElementById("ofa-Taux_TVA_Nat_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColTaux_TVA_Nat_UE');
			document.getElementById("ofa-Code_Pays_Nat_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColCode_Pays_Nat_UE');
			document.getElementById("ofa-Pays_Nat_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColPays_Nat_UE');
			document.getElementById("ofa-Compte_Vente_Nat_UE").value = getCellText(tree,tree.currentIndex,'ofa-ColCompte_Vente_Nat_UE');
			
			document.getElementById("ofa-Vplus_Nat_UE").disabled=!ofa_actif;
			document.getElementById("ofa-Vmoins_Nat_UE").disabled=!ofa_actif;
			document.getElementById("ofa-bValiderCompte_Nat_UE").disabled=!ofa_actif;
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function ofa_validerCompteFamilleNatUE() {
	try {

		if (isEmpty(document.getElementById('ofa-Code_Pays_Nat_UE').value)) {
			showWarning("Veuillez sélectionner un pays !");
		}
		else {
			var code_pays = document.getElementById("ofa-Code_Pays_Nat_UE").value;
			var code_tva = document.getElementById("ofa-Code_TVA_Nat_UE").value;
			var compte_vente = document.getElementById("ofa-Compte_Vente_Nat_UE").value;

			if (isEmpty(compte_vente)) {
				// Suppression compte famille
				var qSupprCF = new QueryHttp("Config/gestion_commerciale/famille/supprimerCompteFamilleArticleNatUE.tmpl");
				qSupprCF.setParam("Famille_Id", ofa_curFamilleId);
				qSupprCF.setParam("Code_Pays", code_pays);
				qSupprCF.setParam("Code_TVA", code_tva);
				qSupprCF.execute();
			} else {
				var qCF;
				if (ofa_existeCompteFamilleNatUE(ofa_curFamilleId, code_pays, code_tva)) {
					// modifier compte famille
					qCF = new QueryHttp("Config/gestion_commerciale/famille/modifierCompteFamilleArticleNatUE.tmpl");
				} else {
					// nouveau compte famille
					qCF = new QueryHttp("Config/gestion_commerciale/famille/ajouterCompteFamilleArticleNatUE.tmpl");
				}

				qCF.setParam("Famille_Id", ofa_curFamilleId);
				qCF.setParam("Code_Pays", code_pays);
				qCF.setParam("Code_TVA", code_tva);
				qCF.setParam("Compte_Vente", compte_vente);
				qCF.execute();
			}
			
			document.getElementById("ofa-Vplus_Nat_UE").disabled=true;
			document.getElementById("ofa-Vmoins_Nat_UE").disabled=true;
			document.getElementById("ofa-bValiderCompte_Nat_UE").disabled=true;

			ofa_initComptesNatUE();
		}

	} catch (e) {
		recup_erreur(e);
	}
}



function ofa_pressOnComptesFamillesInternational() {
	try {
		var tree = document.getElementById('ofa-liste_comptes_familles_international');
		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("ofa-Code_TVA_International").value = getCellText(tree,tree.currentIndex,'ofa-ColCode_TVA_International');
			document.getElementById("ofa-Code_Pays_International").value = getCellText(tree,tree.currentIndex,'ofa-ColCode_Pays_International');
			document.getElementById("ofa-Pays_International").value = getCellText(tree,tree.currentIndex,'ofa-ColPays_International');
			document.getElementById("ofa-Compte_Achat_International").value =  getCellText(tree,tree.currentIndex,'ofa-ColCompte_Achat_International');
			document.getElementById("ofa-Compte_Vente_International").value =  getCellText(tree,tree.currentIndex,'ofa-ColCompte_Vente_International');
			
			document.getElementById("ofa-Aplus_International").disabled=!ofa_actif;
			document.getElementById("ofa-Amoins_International").disabled=!ofa_actif;
			document.getElementById("ofa-Vplus_International").disabled=!ofa_actif;
			document.getElementById("ofa-Vmoins_International").disabled=!ofa_actif;
			document.getElementById("ofa-bValiderCompte_International").disabled=!ofa_actif;
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function ofa_validerCompteFamilleInternational() {
	try {

		if (isEmpty(document.getElementById('ofa-Code_Pays_International').value)) {
			showWarning("Veuillez choisir un pays !");
		}
		else {
			var code_pays = document.getElementById('ofa-Code_Pays_International').value;
			var code_tva = document.getElementById('ofa-Code_TVA_International').value;
			var compteAchat = document.getElementById("ofa-Compte_Achat_International").value;
			var compte_vente = document.getElementById("ofa-Compte_Vente_International").value;

			if (isEmpty(compteAchat) && isEmpty(compte_vente)) {
				// Suppression compte famille
				var qSupprCF = new QueryHttp("Config/gestion_commerciale/famille/supprimerCompteFamilleArticle.tmpl");
				qSupprCF.setParam("Famille_Id", ofa_curFamilleId);
				qSupprCF.setParam("Code_TVA", code_tva);
				qSupprCF.execute();
			} else {
				var qCF;
				if (ofa_existeCompteFamille(ofa_curFamilleId, code_tva)) {
					// modifier compte famille
					qCF = new QueryHttp("Config/gestion_commerciale/famille/modifierCompteFamilleArticle.tmpl");
				} else {
					// nouveau compte famille
					qCF = new QueryHttp("Config/gestion_commerciale/famille/ajouterCompteFamilleArticle.tmpl");
				}

				qCF.setParam("Famille_Id", ofa_curFamilleId);
				qCF.setParam("Code_TVA", code_tva);
				qCF.setParam("Compte_Achat", compteAchat);
				qCF.setParam("Compte_Vente", compte_vente);
				qCF.execute();
			}
			
			document.getElementById("ofa-Aplus_International").disabled=true;
			document.getElementById("ofa-Amoins_International").disabled=true;
			document.getElementById("ofa-Vplus_International").disabled=true;
			document.getElementById("ofa-Vmoins_International").disabled=true;
			document.getElementById("ofa-bValiderCompte_International").disabled=true;

			ofa_initComptesInternational();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_desactiverComptesInternational() {
	try {
		document.getElementById("ofa-Code_TVA_International").value = "";
		document.getElementById("ofa-Code_Pays_International").value = "";
		document.getElementById("ofa-Pays_International").value = value = "";
		document.getElementById("ofa-Compte_Achat_International").value = "";
		document.getElementById("ofa-Compte_Vente_International").value = "";

		document.getElementById("ofa-liste_comptes_familles_international").disabled=true;
		document.getElementById("ofa-Aplus_International").disabled=true;
		document.getElementById("ofa-Amoins_International").disabled=true;
		document.getElementById("ofa-Vplus_International").disabled=true;
		document.getElementById("ofa-Vmoins_International").disabled=true;
		document.getElementById("ofa-bValiderCompte_International").disabled=true;
		ofa_aComptesInternational.deleteTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_activerComptesInternational() {
	try {
		document.getElementById("ofa-liste_comptes_familles_international").disabled=false;

		ofa_initComptesInternational();
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_initComptesInternational() {
	try {
		document.getElementById("ofa-Code_TVA_International").value = "";
		document.getElementById("ofa-Code_Pays_International").value = "";
		document.getElementById("ofa-Pays_International").value = value = "";
		document.getElementById("ofa-Compte_Achat_International").value = "";
		document.getElementById("ofa-Compte_Vente_International").value = "";

		ofa_aComptesInternational.clearParams();
		ofa_aComptesInternational.setParam('Famille_Id', ofa_curFamilleId);
		ofa_aComptesInternational.setParam('International', 1);
		ofa_aComptesInternational.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}

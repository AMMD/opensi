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


jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");


var br_id;
var commande_id;
var fournisseur_id;
var mode;
var etat_br;
var modifie = false;
var bloquer = false;
var facturable = false;
var existeFacture = false;

var aBRs = new Arbre("Facturation/GetRDF/brs_commande.tmpl", "brs");
var aBR = new Arbre("Facturation/GetRDF/articles_br.tmpl", "bon_reception");
var aCom = new Arbre("Facturation/GetRDF/articles_a_receptionner.tmpl", "commande");
var aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","listeVersion");


function init() {
  try {
  	
  	bloquerInterface();

  	var qProduitsFrais = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qProduitsFrais.execute();
		var prod_frais = (result.responseXML.documentElement.getAttribute("Produit_Frais")=="1");
		document.getElementById('prod_frais_entree').collapsed = !prod_frais;
		document.getElementById('prod_frais_sortie').collapsed = !prod_frais;
		document.getElementById('ColNbPiecesDev').collapsed = !prod_frais;
		document.getElementById('ColNumLotLiv').collapsed = !prod_frais;
		document.getElementById('ColDLCLiv').collapsed = !prod_frais;
		document.getElementById('ColNbPiecesLiv').collapsed = !prod_frais;
		
		var qNomListeAttribut = new QueryHttp("Facturation/Commun/getListeAttribut.tmpl");
    qNomListeAttribut.setParam("Liste_Id", 2);
    result = qNomListeAttribut.execute();
    document.getElementById('colAttribut2').setAttribute("label", result.responseXML.documentElement.getAttribute('Nom'));

		commande_id = ParamValeur("Commande_Id");
		fournisseur_id = ParamValeur("Fournisseur_Id");

		aCom.setParam("Commande_Id", commande_id);

		// Récupération des infos concernant la commande
		var qCommande = new QueryHttp("Facturation/Commandes/getCommande.tmpl");
		qCommande.setParam("Commande_Id", commande_id);
		result = qCommande.execute();
		var contenu = result.responseXML.documentElement;
		var etatCommande = contenu.getAttribute("Etat");
		bloquer = (etatCommande!="T");
		
		if (!isEmpty(fournisseur_id)) {
			afficheInfoFournisseur();
		} else {
			document.getElementById('Denomination').value = contenu.getAttribute('Denomination');
			document.getElementById('Adresse_1').value = contenu.getAttribute('Adresse_1');
			document.getElementById('Adresse_2').value = contenu.getAttribute('Adresse_2');
			document.getElementById('Adresse_3').value = contenu.getAttribute('Adresse_3');
			document.getElementById('Code_Postal').value = contenu.getAttribute('Code_Postal');
			document.getElementById('Ville').value = contenu.getAttribute('Ville');
		}
		var lblFournisseur = (isEmpty(fournisseur_id)?"Fournisseur":"Fournisseur N° "+ fournisseur_id);
		document.getElementById("Fournisseur").setAttribute("label",lblFournisseur);
		document.getElementById("labelCommande").value = contenu.getAttribute('Numero');
		document.getElementById('Login_Resp').value = contenu.getAttribute('Login_Resp');
		document.getElementById('Date_Commande').value = contenu.getAttribute('Date_Commande');

		aBRs.setParam("Commande_Id", commande_id);
		aBRs.initTree(init2);

	} catch (e) {
  	recup_erreur(e);
	}
}


function init2() {
	try {
		window.parent.addEventListener("close",demandeEnregistrement,false);
		
		if (!bloquer) {
			document.getElementById('Etat_Commande').value = "En cours de réception";

			var qBREC = new QueryHttp("Facturation/Commandes/getBREnCours.tmpl");
			qBREC.setParam("Commande_Id", commande_id);
			result = qBREC.execute();
			var brEnCours = result.responseXML.documentElement.getAttribute('BR_Id');

			if (isEmpty(brEnCours)) {
				nouveauBR();
			} else {
				br_id = brEnCours;
				chargerBR();
			}
		}
		else {
			document.getElementById('Etat_Commande').value = "Terminée";
			document.getElementById('bTransFacture').collapsed = true;
			document.getElementById('bAnnuler').collapsed = true;
			document.getElementById('bSupprimer').collapsed = true;
			mode = "V";
			debloquerInterface();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function debloquerInterface() {
	try {

		document.getElementById('listeVersion').disabled = false;
		document.getElementById('brs').disabled = false;
		document.getElementById('commande').disabled = false;
		document.getElementById('bon_reception').disabled = false;

		var rienATransferer = false;
		if (mode=="C" && aCom.nbLignes()==1) {
			rienATransferer = (aCom.getCellText(0,"ColQuantiteDev")=="0");
		}
		document.getElementById('bNouveauBR').disabled = bloquer;
		if (!rienATransferer) {
			if (mode != "V") {
				if (etat_br!="A") {
					document.getElementById('bToutAjouter').disabled = false;
					document.getElementById('bEnregistrer').disabled = false;
					document.getElementById('bSupprimer').disabled = false;
					document.getElementById('Commentaires_Fin').disabled = false;
					document.getElementById('Commentaires_Int').disabled = false;
					document.getElementById('bChoisirMentions').disabled = false;
					document.getElementById('Num_BL').disabled = false;
					document.getElementById('Solder').disabled = false;
				}
				
				if (mode!="C") {
					document.getElementById('bVisualiser').disabled = (etat_br == "N");
					document.getElementById('bValider').disabled = (etat_br != "N");
					document.getElementById('bToutEnlever').disabled = (etat_br != "N");
				}
			} else {
				document.getElementById('bAnnuler').disabled = false;
				document.getElementById('bTransFacture').disabled = false;
			}
		}
		
		debloquerBoutonsMenu();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function desinit() {
	try {

		window.parent.removeEventListener("close",demandeEnregistrement,false);

	} catch (e) {
    recup_erreur(e);
  }
}


function afficheInfoFournisseur() {
	try {

		var qInfos = new QueryHttp("Facturation/Fournisseurs/getFournisseur.tmpl");
		qInfos.setParam("Fournisseur_Id", fournisseur_id);
		var result = qInfos.execute();
		var contenu = result.responseXML.documentElement;

		document.getElementById('Denomination').value = contenu.getAttribute('Denomination');
		document.getElementById('Adresse_1').value = contenu.getAttribute('Adresse');
		document.getElementById('Adresse_2').value = contenu.getAttribute('Comp_Adresse');
		document.getElementById('Adresse_3').value = contenu.getAttribute('Adresse_3');
		document.getElementById('Code_Postal').value = contenu.getAttribute('Code_Postal');
		document.getElementById('Ville').value = contenu.getAttribute('Ville');

	} catch (e) {
		recup_erreur(e);
	}
}


function reporterQteEntree() {
	try {

		var tree = document.getElementById('commande');

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("NumLotEntree").value = "";
			document.getElementById("DLCEntree").value = "";
			document.getElementById("NbPiecesEntree").value = getCellText(tree,tree.currentIndex,'ColNbPiecesDev');
			document.getElementById("QteEntree").value = getCellText(tree,tree.currentIndex,'ColQuantiteDev');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function reporterQteSortie() {
	try {

		var tree = document.getElementById('bon_reception');

		if (tree.view!=null && tree.currentIndex!=-1) {
			document.getElementById("NbPiecesSortie").value = getCellText(tree,tree.currentIndex,'ColNbPiecesLiv');
			document.getElementById("QteSortie").value = getCellText(tree,tree.currentIndex,'ColQuantiteLiv');
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function disableAjouter(b,arbre) {
	try {

		var tree = document.getElementById('commande');

		if (!arbre || (tree.view!=null && tree.currentIndex!=-1 && mode!="V")) {
			document.getElementById('bAjouter').disabled = b;
			document.getElementById('NumLotEntree').disabled = b;
			document.getElementById('DLCEntree').disabled = b;
			document.getElementById('NbPiecesEntree').disabled = b;
			document.getElementById('QteEntree').disabled = b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function disableEnlever(b,arbre) {
	try {

		var tree = document.getElementById('bon_reception');

		if (!arbre || (tree.view!=null && tree.currentIndex!=-1 && mode!="V")) {
			document.getElementById('bEnlever').disabled = b;
			document.getElementById('NbPiecesSortie').disabled = b;
			document.getElementById('QteSortie').disabled = b;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnNouveauBR() {
	try {
		bloquerInterface();
		nouveauBR();
	} catch (e) {
		recup_erreur(e);
	}
}


function nouveauBR() {
  try {

		mode = "C";
		etat_br = "N";

		document.getElementById('corps_commande').collapsed = false;
		document.getElementById('corps_transfert').collapsed = false;
		document.getElementById('titre_corps').collapsed = false;

		disableAjouter(true,false);
		disableEnlever(true,false);
		
		document.getElementById('bAnnuler').collapsed = true;
		document.getElementById('bSupprimer').collapsed = true;
		document.getElementById('bTransFacture').collapsed = true;

		document.getElementById('Commentaires_Fin').value = "";
		document.getElementById('Commentaires_Int').value = "";
		document.getElementById('Num_BL').value = "";
		document.getElementById('Date_Reception').value = "";
		document.getElementById('Num_Entier').value = "";
		document.getElementById('Etat').value = "Nouveau";
		
		viderChampsTransfert();
		document.getElementById('Solder').checked = false;

		document.getElementById('Creation').label = "";
		document.getElementById('Modification').label = "";
		document.getElementById('Creation').collapsed = true;
		document.getElementById('Modification').collapsed = true;
		document.getElementById('Fiche').label = "";
		
		document.getElementById('tabVersionDocument').collapsed = true;
		aVersion.deleteTree();
		
		setModifie(false);

		aBR.deleteTree();

		aCom.removeParam("BR_Id");
		aCom.initTree(debloquerInterface);

	} catch (e) {
  	recup_erreur(e);
  }
}


function viderChampsTransfert() {
	try {
		document.getElementById('NumLotEntree').value = "";
		document.getElementById('DLCEntree').value = "";
		document.getElementById('NbPiecesEntree').value = "";
		document.getElementById('QteEntree').value = "";
		document.getElementById('NbPiecesSortie').value = "";
		document.getElementById('QteSortie').value = "";
	} catch (e) {
		recup_erreur(e);
	}
}


function ouvrirBR() {
  try {

		if (aBRs.isSelected()) {
			var i = aBRs.getCurrentIndex();
			br_id = aBRs.getCellText(i, 'ColBR_Id');
			bloquerInterface();
			chargerBR();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function pressOnTree(ev) {
  try {

		if (ev.keyCode==13) {
			ouvrirBR();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function chargerBR() {
  try {
  	
  	mode = "M";
  	aCom.setParam("BR_Id", br_id);
  	aCom.initTree(chargerBR2);
		
  } catch (e) {
  	recup_erreur(e);
  }
}

function chargerBR2() {
	try {
		
		aBR.setParam("BR_Id", br_id);
		aBR.initTree(chargerBR3);
		
	} catch (e) {
		recup_erreur(e);
	}
}

function chargerBR3() {
	try {

		var qBR = new QueryHttp("Facturation/Commandes/getBonReception.tmpl");
		qBR.setParam("BR_Id", br_id);
		var result = qBR.execute();
		var contenu = result.responseXML.documentElement;
		var statutFact = contenu.getAttribute("Facture");
		facturable = (statutFact!="T");
		existeFacture = (statutFact!="N");
		etat_br = contenu.getAttribute("Etat");
		
		if (etat_br=="V") {
			mode = "V";
			document.getElementById('Etat').value = "Validé";
		}
		else if (etat_br=="N") { document.getElementById('Etat').value = "En cours"; }
		else { document.getElementById('Etat').value = "Annulé"; }
		
		document.getElementById('corps_commande').collapsed = (etat_br!="N");
		document.getElementById('corps_transfert').collapsed = (etat_br!="N");
		document.getElementById('titre_corps').collapsed = (etat_br!="N");
		document.getElementById('bSupprimer').collapsed = (etat_br!="N");
		document.getElementById('bAnnuler').collapsed = (mode!="V" || existeFacture);
		document.getElementById('bTransFacture').collapsed = (mode!="V" || !facturable);

		document.getElementById('Date_Reception').value = contenu.getAttribute("Date_BR");
		document.getElementById('Commentaires_Fin').value = contenu.getAttribute("Commentaires_Fin");
		document.getElementById('Commentaires_Int').value = contenu.getAttribute("Commentaires_Int");
		document.getElementById('Num_BL').value = contenu.getAttribute("Num_BL");
		document.getElementById('Num_Entier').value = contenu.getAttribute("Num_Entier");
		
		viderChampsTransfert();
		document.getElementById('Solder').checked = false;

		document.getElementById('Creation').label = "Bon de réception créé le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur');
		document.getElementById('Modification').label = "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj');
		document.getElementById('Fiche').label = "BR N° "+ contenu.getAttribute('Num_Entier');
		document.getElementById('Creation').collapsed = false;
		document.getElementById('Modification').collapsed = false;
		
		document.getElementById('tabVersionDocument').collapsed = false;
		document.getElementById('bOuvrirCommentairesCaches').disabled = false;

		setModifie(false);
		
		aVersion.setParam("Type_Document", "Bon_Reception");
		aVersion.setParam("Document_Id", br_id);
		aVersion.initTree(debloquerInterface);

	} catch (e) {
  	recup_erreur(e);
  }
}


function enregistrerBR() {
  try {

		var qSave;

		if (mode=="C") {
			qSave = new QueryHttp("Facturation/Commandes/creerBonReception.tmpl");
		}
		else {
			qSave = new QueryHttp("Facturation/Commandes/modifierBonReception.tmpl");
			qSave.setParam("BR_Id", br_id);
		}

		qSave.setParam("Commande_Id", commande_id);
		qSave.setParam("Commentaires_Fin", document.getElementById('Commentaires_Fin').value);
		qSave.setParam("Commentaires_Int", document.getElementById('Commentaires_Int').value);
		qSave.setParam("Num_BL", document.getElementById('Num_BL').value);

		var result = qSave.execute();

		var contenu = result.responseXML.documentElement;

		if (mode=="C") {
			br_id = contenu.getAttribute("BR_Id");
			bloquerInterface();
			aBRs.initTree(chargerBR);
		}

		setModifie(false);

	} catch (e) {
  	recup_erreur(e);
  }
}


function supprimerBR() {
  try {

		if (window.confirm("Confirmez-vous la suppression de ce bon de réception ?")) {

			var qSupBR = new QueryHttp("Facturation/Commandes/supprimerBR.tmpl");
			qSupBR.setParam("BR_Id", br_id);
			qSupBR.execute();

			aBRs.initTree();
			bloquerInterface();
			nouveauBR();

			showMessage("Le bon de réception a été supprimé avec succès !");
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function ToutTransferer() {
  try {

		if (mode=="C") {
			enregistrerBR();
		}

		var qTransferer = new QueryHttp("Facturation/Commandes/ajouterToutBR.tmpl");
		qTransferer.setParam("BR_Id", br_id);
		qTransferer.setParam("Commande_Id", commande_id);
		qTransferer.execute(reinitArbres);

	} catch (e) {
  	recup_erreur(e);
	}
}


function ToutEnlever() {
  try {

		var qEnlever = new QueryHttp("Facturation/Commandes/enleverToutBR.tmpl");
		qEnlever.setParam("BR_Id", br_id);
		qEnlever.execute(reinitArbres);

	} catch (e) {
  	recup_erreur(e);
	}
}


function Ajouter() {
  try {

		var tree = document.getElementById("commande");

		if (tree.view!=null && tree.currentIndex!=-1) {

			var ligne = getCellText(tree,tree.currentIndex,'ColLigneDev');
			var qteinit = getCellText(tree,tree.currentIndex,'ColQuantiteDev');
			var quantite = document.getElementById("QteEntree").value;

			var date_peremption = document.getElementById("DLCEntree").value;
			var num_lot = document.getElementById("NumLotEntree").value;
			var nb_pieces_init = getCellText(tree,tree.currentIndex,'ColNbPiecesDev');
			if (isEmpty(nb_pieces_init)) { nb_pieces_init = 0; }
			var nb_pieces = document.getElementById("NbPiecesEntree").value;

			var qCheckNumLot = new QueryHttp("Facturation/Suivi_Lot/checkNumLot.tmpl");
			qCheckNumLot.setParam("Num_Lot", num_lot);
			var result = qCheckNumLot.execute();
			if (result.responseXML.documentElement.getAttribute("blocage")=="true") { showWarning("Impossible de transférer cet article car le numéro de lot est bloqué !"); }

			else if (isEmpty(quantite)) { showWarning("Veuillez entrer une quantité à transférer"); }
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !"); }
			else if (!isEmpty(nb_pieces) && !isPositiveInteger(nb_pieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (!isEmpty(date_peremption) && !isDate(date_peremption)) { showWarning("Date de péremption incorrecte !");	}
			else {

				var continuer = true;

				if (parseFloat(qteinit)-parseFloat(quantite)<0) {
					continuer = window.confirm("La quantité à transférer dépasse la quantité restant à réceptionner !\n\nVoulez-vous vraiment réceptionner plus que la quantité commandée ?");
				}

				if (!isEmpty(nb_pieces)) {
					if (parseFloat(nb_pieces_init)-parseFloat(nb_pieces)<0) {
						continuer = window.confirm("Le nb de pièces à transférer dépasse le nb de pièces restant à réceptionner !\n\nVoulez-vous vraiment réceptionner plus que le nb de pièces commandé ?");
					}
				}

				if (continuer) {

					if (mode=="C") {
						enregistrerBR();
					}

					var qAjBR = new QueryHttp("Facturation/Commandes/ajouterArticleBR.tmpl");
					qAjBR.setParam("BR_Id", br_id);
					qAjBR.setParam("Ligne", ligne);
					qAjBR.setParam("Quantite", quantite);
					qAjBR.setParam("Num_Lot", num_lot);
					qAjBR.setParam("Nb_Pieces", nb_pieces);
					qAjBR.setParam("Date_Peremption", (!isEmpty(date_peremption)?prepareDateJava(date_peremption):""));
					qAjBR.execute();
					reinitArbres();
				}
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function Enlever() {
  try {

		var tree = document.getElementById("bon_reception");

		if (tree.view!=null && tree.currentIndex!=-1) {

			var ligneId = getCellText(tree,tree.currentIndex,'ColLigneLiv');
			var qteinit = getCellText(tree,tree.currentIndex,'ColQuantiteLiv');
			var quantite = document.getElementById("QteSortie").value;
			var nb_pieces = document.getElementById("NbPiecesSortie").value;
			var nb_pieces_init = getCellText(tree,tree.currentIndex,'ColNbPiecesLiv');
			if (isEmpty(nb_pieces_init)) { nb_pieces_init = 0; }

			if (isEmpty(quantite)) { showWarning("Veuillez entrer une quantité à enlever"); }
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !"); }
			else if (parseFloat(qteinit)-parseFloat(quantite)<0) { showWarning("La quantité à enlever ne peut dépasser la quantité présente dans le bon de réception !"); }
			else if (!isEmpty(nb_pieces) && !isPositiveInteger(nb_pieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (!isEmpty(nb_pieces) && (parseFloat(nb_pieces_init)-parseFloat(nb_pieces)<0)) {
				showWarning("Le nb de pièces à enlever ne peut dépasser le nb de pièces présent dans le bon de réception !");
			}
			else {

				var qReBR = new QueryHttp("Facturation/Commandes/enleverArticleBR.tmpl");
				qReBR.setParam("BR_Id", br_id);
				qReBR.setParam("Ligne_Id", ligneId);
				qReBR.setParam("Quantite", quantite);
				qReBR.setParam("Nb_Pieces", nb_pieces);
				qReBR.setParam("QteInit", qteinit);
				qReBR.execute();
				reinitArbres();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function reinitArbres() {
  try {
  	viderChampsTransfert();
  	if (mode=="M") {
			aCom.setParam("BR_Id", br_id);
		}
		else {
			aCom.removeParam("BR_Id");
		}
  	aCom.initTree(reinitArbres2);

	} catch (e) {
  	recup_erreur(e);
	}
}

function reinitArbres2() {
	try {
		aBR.initTree(reinitArbres3);
	} catch (e) {
		recup_erreur(e);
	}
}

function reinitArbres3() {
	try {
		disableAjouter(true,false);
		disableEnlever(true,false);
	} catch (e) {
		recup_erreur(e);
	}
}


function demandeEnregistrement() {
  try {

		if (modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées au bon de réception ?")) {
				enregistrerBR();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function setModifie(m) {
  try {

  	modifie = m;
		if (m) {
			document.getElementById('tabBR').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('bValider').disabled = true;
			document.getElementById('bVisualiser').disabled = true;
		}
		else {
			document.getElementById('tabBR').setAttribute('image', null);
			document.getElementById('bValider').disabled = (mode=="C" || etat_br!='N');
			document.getElementById('bVisualiser').disabled = (mode=="C" || etat_br=='N');
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function visualiserBR() {
  try {

		var tree = document.getElementById("bon_reception");

		if (tree.view==null || tree.view.rowCount<=0) {
			showWarning("Le bon de réception ne contient aucune ligne !");
		}
		else {

			var param_retour = "&Commande_Id="+ commande_id +"&Fournisseur_Id="+ fournisseur_id;

			var page = "chrome://opensi/content/facturation/user/commandes/bon_reception.xul?"+ cookie();
			page += "&BR_Id="+ br_id +"&ParamRetour="+ urlEncode(param_retour);
	  	window.location = page;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function validerBR() {
  try {

		var tree = document.getElementById("bon_reception");

		if (tree.view==null || tree.view.rowCount<=0) {
			showWarning("Le bon de réception ne contient aucune ligne !");
		}
		else if (window.confirm("Confirmez-vous la validation du bon de réception ?\n(Attention le bon de réception validé ne pourra plus être modifié !)")) {

			var param_retour = "&Commande_Id="+ commande_id +"&Fournisseur_Id="+ fournisseur_id;

			var solder = (document.getElementById('Solder').checked?"1":"0");

			var page = "chrome://opensi/content/facturation/user/commandes/bon_reception.xul?"+ cookie() +"&Solder="+ solder +"&Valider=1";
			page += "&Commande_Id="+ commande_id +"&BR_Id="+ br_id +"&ParamRetour="+ urlEncode(param_retour);
	  	window.location = page;
		}

	} catch (e) {
    recup_erreur(e);
  }
}



function annulerBR() {
	try {
		
		if (window.confirm("Voulez-vous annuler ce bon de réception ?")) {
			var qAnnuler = new QueryHttp("Facturation/Commandes/annulerBR.tmpl");
			qAnnuler.setParam("Bon_Id", br_id);
			qAnnuler.execute();
			
			var page = window.location = "chrome://opensi/content/facturation/user/commandes/edition_br.xul?"+ cookie() +"&Commande_Id="+ commande_id +"&Fournisseur_Id="+ fournisseur_id;
			window.location = page;
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function transFacture() {
  try {
  	if (!facturable) { showWarning("Erreur : ce bon de réception est déjà facturé entièrement !"); }
  	else {
  		var message = (existeFacture?"Certains articles ont déjà été facturés. Voulez-vous facturer les articles restants ?":"Etes-vous sûr de vouloir transformer le bon de réception en facture ?");
			if (window.confirm(message)) {
				var qTransFacture = new QueryHttp("Facturation/Commandes/transBRFacture.tmpl");
				qTransFacture.setParam("BR_Id", br_id);
				var p = qTransFacture.execute();
				var contenu = p.responseXML.documentElement;
	
				var facture_id = contenu.getAttribute('Facture_Id');
	
				var page = "chrome://opensi/content/facturation/user/factu_fournisseur/gestionFactures.xul?"+ cookie() +"&Facture_Id="+ facture_id;
	  		window.location = page;
			}
  	}

	} catch (e) {
  	recup_erreur(e);
	}
}


function choisirMentions() {
  try {

  	if (mode=="C") {
			enregistrerBR();
		}

		var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Bon_Reception&Doc_Id="+ br_id;
    window.openDialog(url,'','chrome,modal,centerscreen',setModifie);

	} catch (e) {
  	recup_erreur(e);
  }
}

function editerCommentairesCaches() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-commentaireCache.xul?"+ cookie();
    url += "&Type_Doc=Bon_Reception&Doc_Id="+ br_id;
  	window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_receptions() {
  try {

    window.location = "chrome://opensi/content/facturation/user/commandes/menu_commandes.xul?"+ cookie() +"&Receptions=1";

  } catch (e) {
    recup_erreur(e);
  }
}


function retour_commande() {
  try {

    window.location = "chrome://opensi/content/facturation/user/commandes/edition_commande.xul?"+ cookie() +"&Mode=M&Commande_Id="+ commande_id;

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

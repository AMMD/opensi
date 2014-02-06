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



var comboResp = new Arbre("ComboListe/combo-responsables.tmpl","Login_Resp");
var comboRegl = new Arbre("ComboListe/combo-modesReglement.tmpl","Mode_Reg");
var comboTVA = new Arbre("Facturation/GetRDF/taux_tva.tmpl","Code_TVA");
var aLignes = new Arbre("Facturation/GetRDF/articles_abonnement.tmpl","articles");

var mode_tarif;
var codeTvaPort;
var tauxTvaPort;
var chargerModeReg;
var typeRemise = 'P';
var typeRemiseFP = 'P';
var majTotaux = false;
var chargementFacture = false;


function FactureType_init() {
	try {
		
		var aCodesTarifs = new Arbre("Facturation/GetRDF/liste_types_tarifs.tmpl", "tarif");
		aCodesTarifs.initTree(FactureType_initCodeTarif);

		FactureType_setModeTarif();
		FactureType_chargerResponsables("0");
		comboTVA.initTree(FactureType_initTVA);
		FactureType_initValeur();
		document.getElementById('bSupprimer').disabled=true;

	} catch (e) {
    recup_erreur(e);
  }
}


function FactureType_chargerResponsables(selection) {
	try {
		global_resp = selection;
		comboResp.setParam("Selection", global_resp);
		comboResp.initTree(FactureType_initResp);
	} catch (e) {
		recup_erreur(e);
	}
}


function FactureType_chargerModesReglements(selection) {
	try {
		chargerModeReg = selection;
		comboRegl.setParam("Selection", chargerModeReg);
		comboRegl.initTree(FactureType_initRegl);
	} catch (e) {
		recup_erreur(e);
	}
}


function FactureType_initCodeTarif() {
	try {
		document.getElementById('tarif').selectedIndex=0;
	} catch (e) {
		recup_erreur(e);
	}
}


function FactureType_changerTypeVente() {
	try {
	  var qTypeVente = new QueryHttp("GetPays.tmpl");
	  qTypeVente.setParam("Code_Pays", document.getElementById("Code_Pays_Liv").value);
	  var result = qTypeVente.execute();
	  zoneUE = (result.responseXML.documentElement.getAttribute("zone_ue")=="1");
	  document.getElementById('Code_TVA').disabled = !zoneUE;
	}	catch(e) {
		recup_erreur(e);
	}
}


function FactureType_calculerTvaPort() {
	try {
		codeTvaPort = getCodeTvaNormal(document.getElementById("Code_Pays_Liv").value,assujettiTVA,"G");
		tauxTvaPort = getTva(codeTvaPort);
	} catch (e) {
		recup_erreur(e);
	}
}


function FactureType_listeTVA() {
  try {
  	FactureType_calculTotaux();
    var aCode = new Arbre("Facturation/GetRDF/taux_tva.tmpl", "Code_TVA");
    aCode.setParam("Code_Pays", document.getElementById("Code_Pays_Liv").value);
    aCode.setParam("Regime_TVA", "G");
    aCode.setParam("Assujetti_TVA", assujettiTVA?"1":"0");
    aCode.initTree(FactureType_selectTVA);
  } catch (e) {
    recup_erreur(e);
  }
}


function FactureType_selectTVA() {
  try {
    document.getElementById('Code_TVA').value = getCodeTvaNormal(document.getElementById('Code_Pays_Liv').value,assujettiTVA,"G");
  } catch (e) {
    recup_erreur(e);
  }
}


function FactureType_initRegl() {
	try {

		document.getElementById('Mode_Reg').value = chargerModeReg;

	} catch (e) {
    recup_erreur(e);
  }
}


function FactureType_initResp() {
	try {

		document.getElementById('Login_Resp').value = global_resp;

	}	catch (e) {
    recup_erreur(e);
  }
}


function FactureType_initTVA() {
	try {

    document.getElementById('Code_TVA').value = 4;

	} catch (e) {
    recup_erreur(e);
  }
}

function FactureType_evaluer(elem, ev) {
	try {

		if (ev.keyCode==13) {
			var nf4 = new NumberFormat("0.00##", false);
			elem.value = nf4.format(calcExpr(elem.value));
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function FactureType_switchRemise() {
	try {

		if (typeRemise=='P') {
			document.getElementById('bRemise').setAttribute("class", "bIcoEuro");
			typeRemise = 'M';
		}
		else {
			document.getElementById('bRemise').setAttribute("class", "bIcoPourcentage");
			typeRemise = 'P';
		}
		FactureType_calculTotaux();
		menu_abonnement_setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function FactureType_switchRemiseFP() {
	try {

		if (typeRemiseFP=='P') {
			document.getElementById('bRemiseFP').setAttribute("class", "bIcoEuro");
			typeRemiseFP = 'M';
		}
		else {
			document.getElementById('bRemiseFP').setAttribute("class", "bIcoPourcentage");
			typeRemiseFP = 'P';
		}
		FactureType_calculTotaux();
		menu_abonnement_setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


//fonction qui initialise le mode tarif
function FactureType_setModeTarif() {
	try {

    var corps = cookie() +"&Page=Config/gestion_commerciale/preferences/getParam.tmpl&ContentType=xml";
    var p = requeteHTTP(corps);

		mode_tarif = p.responseXML.documentElement.getAttribute('Mode_Tarif');

		if (mode_tarif=='Q') {
			document.getElementById('row_tarif').collapsed = true;
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function FactureType_initValeur() {
	try	{

		document.getElementById('Remise').value = "0.00";
		document.getElementById('Escompte').value = "0.00";
		document.getElementById('Frais_Port').value = "0.00";
		document.getElementById('RemiseFP').value = "0.00";

		document.getElementById('MontantHT').value = "0.00";
		document.getElementById('MontantRemise').value = "0.00";
		document.getElementById('MontantFrais_Port').value = "0.00";
		document.getElementById('MontantRemiseFP').value = "0.00";
		document.getElementById('TotalHT').value = "0.00";
		document.getElementById('TVA').value = "0.00";
		document.getElementById('MontantTTC').value = "0.00";
		document.getElementById('MontantEscompte').value = "0.00";
		document.getElementById('TotalTTC').value = "0.00";
		
		document.getElementById('rowRemiseHT').collapsed = true;
		document.getElementById('rowRemiseFPHT').collapsed = true;
		document.getElementById('rowMontantTTC').collapsed = true;
		document.getElementById('rowEscompteHT').collapsed = true;
		
		document.getElementById('pttcMontantRemise').value = "0.00";
		document.getElementById('pttcMontantFrais_Port').value = "0.00";
		document.getElementById('pttcMontantRemiseFP').value = "0.00";
		document.getElementById('pttcTVA').value = "0.00";
		document.getElementById('pttcMontantTTC').value = "0.00";
		document.getElementById('pttcMontantEscompte').value = "0.00";
		document.getElementById('pttcTotalTTC').value = "0.00";
		document.getElementById('pttcNetTTC').value = "0.00";
		
		document.getElementById('rowRemiseTTC').collapsed = true;
		document.getElementById('rowRemiseFPTTC').collapsed = true;
		document.getElementById('rowEscompteTTC').collapsed = true;

	} catch(e) {
		recup_erreur(e);
	}
}


//fonction qui calcul le total des articles ( cette fonction recupere les valeurs dans la base et pas dans l'arbre car il ne charge pas bien a cause des overlays)
function FactureType_calculTotaux() {
  try {
  	
  	//var client_id = document.getElementById("Client_Id").value;
		//var client_connu = (client_id!="");

		var tree = document.getElementById("articles");
    //document.getElementById('Code_Pays_Liv').disabled = (tree.view==null || tree.view.rowCount>0);
    //document.getElementById('chercher_client').collapsed = (tree.view==null || tree.view.rowCount>0);
   	//document.getElementById('chercher_adrliv').disabled = (!client_connu || tree.view==null || tree.view.rowCount>0);
    //document.getElementById('bCopierFactVersLivEnvoi').disabled = (tree.view==null || tree.view.rowCount>0);
		//document.getElementById('Assujetti_TVA').disabled = (tree.view==null || tree.view.rowCount>0);
		document.getElementById('tarif').disabled = (tree.view==null || tree.view.rowCount>0);
		var taux_escompte = parseFloat(document.getElementById('Escompte').value);
		var frais_port = parseFloat(document.getElementById('Frais_Port').value);
		var remise = parseFloat(document.getElementById('Remise').value);
		var remiseFP = parseFloat(document.getElementById('RemiseFP').value);

		if ((typeRemise=='P'?isTaux(remise):isPositiveOrNull(remise)) && (typeRemiseFP=='P'?isTaux(remiseFP):isPositiveOrNull(remiseFP)) && isTaux(taux_escompte) && isPositiveOrNull(frais_port)) {

			if (tree.view!=null) {
				
				var calculDocument = new CalculDocument();
				calculDocument.setEditionTTC(editionTTC);
				if (typeRemise=='P') { calculDocument.setRemiseP(remise); }
				else { calculDocument.setRemiseM(remise); }
				calculDocument.setFraisPortBruts(frais_port);
				if (typeRemiseFP=='P') { calculDocument.setRemiseFPP(remiseFP); }
				else { calculDocument.setRemiseFPM(remiseFP); }
				calculDocument.setTauxTVAFP(tauxTvaPort);
				calculDocument.setEscompteP(taux_escompte);
				
				for (var i=0;i<tree.view.rowCount;i++) {
					if (getCellText(tree,i,'ColType_Ligne')!="C") {
						var prixUnitaireBrut  = getCellText(tree,i,'ColPU');
						var ristourneP = getCellText(tree,i,'ColRistourne');
						var commissionP = 0;
						var quantite  = getCellText(tree,i,'ColQuantite');
						var codeTVA  = getCellText(tree,i,'ColCode_TVA');
						calculDocument.ajouterLigneDocument(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA);
					}
				}
				
				calculDocument.calculer();
				
				if (editionTTC) {
					document.getElementById('pttcMontantRemise').value = calculDocument.getRemiseM();
					document.getElementById('pttcMontantFrais_Port').value = calculDocument.getFraisPortBruts();
					document.getElementById('pttcMontantRemiseFP').value = calculDocument.getRemiseFPM();
					document.getElementById('pttcTVA').value = calculDocument.getTotalTVA();
					document.getElementById('pttcMontantTTC').value = calculDocument.getMontantTTC();
					document.getElementById('pttcMontantEscompte').value = calculDocument.getEscompteM();
					document.getElementById('pttcTotalTTC').value = calculDocument.getTotalTTC();
					document.getElementById('pttcNetTTC').value = calculDocument.getNetAPayer();
					
					document.getElementById('rowRemiseTTC').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('rowRemiseFPTTC').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('rowEscompteTTC').collapsed = !calculDocument.afficherEscompteM();
				}
				else {
					document.getElementById('MontantHT').value = calculDocument.getMontantHT();
					document.getElementById('MontantRemise').value = calculDocument.getRemiseM();
					document.getElementById('MontantFrais_Port').value = calculDocument.getFraisPortBruts();
					document.getElementById('MontantRemiseFP').value = calculDocument.getRemiseFPM();
					document.getElementById('TotalHT').value = calculDocument.getTotalHT();
					document.getElementById('TVA').value = calculDocument.getTotalTVA();
					document.getElementById('MontantTTC').value = calculDocument.getMontantTTC();
					document.getElementById('MontantEscompte').value = calculDocument.getEscompteM();
					document.getElementById('TotalTTC').value = calculDocument.getTotalTTC();
					
					document.getElementById('rowRemiseHT').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('rowRemiseFPHT').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('rowMontantTTC').collapsed = !calculDocument.afficherEscompteM();
					document.getElementById('rowEscompteHT').collapsed = !calculDocument.afficherEscompteM();
				}
				
				currentTotalHT = calculDocument.getMontantHTSansFormat();
				currentTotalHTFP = calculDocument.getTotalHTSansFormat();
				currentMontantTTC = calculDocument.getMontantTTCSansFormat();
				
				if (majTotaux && chargementFacture) {
					enregistrerEcheances();
					modification = true;
					majTotaux = false;
					chargementFacture = false;
				}
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function changerTypeEdition(chgType) {
	try {

		editionTTC = chgType;

		if (editionTTC) {
			document.getElementById('ColTotal').setAttribute("label", "Total TTC");
			document.getElementById('ColPU').setAttribute("label", "P.U TTC");
			document.getElementById('lblFrais_Port').value = "Frais de port (ttc) :";
			document.getElementById('lblPU').value = "P.U TTC :";
			document.getElementById('piedTTC').collapsed = false;
			document.getElementById('piedHT').collapsed = true;
		}
		else {
			document.getElementById('ColTotal').setAttribute("label", "Total HT");
			document.getElementById('ColPU').setAttribute("label", "P.U HT");
			document.getElementById('lblFrais_Port').value = "Frais de port (ht) :";
			document.getElementById('lblPU').value = "P.U HT :";
			document.getElementById('piedTTC').collapsed = true;
			document.getElementById('piedHT').collapsed = false;
		}

		FactureType_calculTotaux();

	}	catch(e) {
		recup_erreur(e);
	}
}


//fonction qui permet de valider une ligne d'article et de l'ajouter dans la table temporaire
//appel enregistrerTout dans le cas d'une premiere création
function FactureType_validerLigne() {
  try	{

		if (mode=="C")
		{
			menu_abonnement_enregistrerTout(false,true);
		}
		
		if (abonnementId!="" && abonnementId!=null && abonnementId!=undefined)
		{
		
			var type_ligne = document.getElementById("Type_Ligne").value;
			var reference = document.getElementById("Reference").value;
			var designation = document.getElementById("Designation").value;
			var quantite = document.getElementById("Quantite").value;
			var pu = document.getElementById("PU").value;
			var ristourne = document.getElementById("Ristourne").value;
			var code_tva = document.getElementById("Code_TVA").value;
			var ligneId = document.getElementById("Ligne_Id").value;
			var libelle = document.getElementById("Libelle").value;

			if (mode_ligne=="C")
			{
				var corps = cookie() +"&Page=Facturation/Abonnement/ajouterArticle.tmpl&ContentType=xml&type=abonnement";
			}
			else {
				var corps = cookie() +"&Page=Facturation/Abonnement/modifierArticle.tmpl&ContentType=xml&type=abonnement";
				corps += "&Ligne_Id="+ ligneId;
			}

			corps += "&Reference="+ urlEncode(reference) +"&Designation="+ urlEncode(designation) +"&Quantite="+ quantite +"&Type_Ligne="+ type_ligne;
			corps += "&Prix="+ pu +"&Ristourne="+ ristourne +"&Code_TVA="+ code_tva +"&Identifiant="+ abonnementId +"&Libelle="+ urlEncode(libelle);

			if (isEmpty(designation)) { showWarning("Désignation de l'article manquante !");	}
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !");	}
			else if (isEmpty(pu) || !isPositiveOrNull(pu) || !checkDecimal(pu,4)) { showWarning("Prix unitaire incorrect !");	}
			else if (isEmpty(ristourne) || !isTaux(ristourne)) { showWarning("Taux de ristourne incorrect !");	}
			else
			{
				var p = requeteHTTP(corps);
				majTotaux = true;
				chargementFacture = false;
				menu_abonnement_chargerAbonnement();
			}
		}
	} catch (e) {
  	recup_erreur(e);
	}
}



//fonction qui charge les informations concernant un article
function FactureType_ajouterLigne(type_ligne) {
  try {

		document.getElementById('bSupprimer').disabled = true;
		mode_ligne = "C";
		document.getElementById("Type_Ligne").value = type_ligne;
		document.getElementById("Ligne_Id").value = "";
		FactureType_formatLigne(type_ligne);
		switch(type_ligne) {
			case "S":

				var reference = document.getElementById("Reference").value;
				if (!isEmpty(reference))
				{

						if (mode_tarif=='Q')
						{
							var url = "chrome://opensi/content/facturation/user/commun/popup-choixTarif.xul?"+ cookie() +"&Article_Id="+ urlEncode(reference);
    					window.openDialog(url,'','chrome,modal,centerscreen',reporterTarifId);
							var tarif_id = document.getElementById('Tarif_Id').value;

							if (!isEmpty(tarif_id))
							{
								var corps = cookie() +"&Page=Facturation/Affaires/getArticleQte.tmpl&ContentType=xml&Article_Id="+ urlEncode(reference);
								corps += "&Tarif_Id="+ tarif_id;
								corps += "&Type_Prix="+ (editionTTC?"TTC":"HT");
								var p = requeteHTTP(corps);
								var contenu = p.responseXML.documentElement;
								document.getElementById("Designation").value = contenu.getAttribute("Designation");
								document.getElementById('Quantite').value = contenu.getAttribute("Quantite");
								document.getElementById("PU").value = contenu.getAttribute("Prix");
								document.getElementById('Ristourne').value = "0.00";
								document.getElementById("Code_TVA").value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"),document.getElementById('Code_Pays_Liv').value,assujettiTVA,"G");
								document.getElementById("Tarif_Id").value = "";
								document.getElementById("Libelle").value = contenu.getAttribute("Libelle");
							}
							else
							{
								FactureType_ajouterLigne("I");
							}
						}
						else
						{
							var corps = cookie() +"&Page=Facturation/Affaires/getArticleTarif.tmpl&ContentType=xml&Article_Id="+ urlEncode(reference) +"&Code_Tarif="+ document.getElementById('tarif').value;
							corps += "&Type_Prix="+ (editionTTC?"TTC":"HT");
							var p = requeteHTTP(corps);
							var contenu = p.responseXML.documentElement;

							document.getElementById("Designation").value = contenu.getAttribute("Designation");
							document.getElementById('Quantite').value = 1;
							document.getElementById("PU").value = contenu.getAttribute("Prix");
							document.getElementById('Ristourne').value = "0.00";
							document.getElementById("Code_TVA").value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"),document.getElementById('Code_Pays_Liv').value,assujettiTVA,"G");
							document.getElementById("Libelle").value = "";
						}
				}
				else {
					FactureType_ajouterLigne("I");
				}

				break;

			case "I":

				document.getElementById('Reference').value = "";
				document.getElementById('Designation').value = "";
				document.getElementById('Quantite').value = 1;
				document.getElementById('PU').value = "";
				document.getElementById('Ristourne').value = "0.00";
				document.getElementById('Code_TVA').value = getCodeTvaNormal(document.getElementById('Code_Pays_Liv').value,assujettiTVA,"G");
				document.getElementById("Libelle").value = "";
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function reporterTarifId(tarif_id) {
	try {
		document.getElementById('Tarif_Id').value = tarif_id;
	} catch (e) {
		recup_erreur(e);
	}
}


function FactureType_pressOnReference(ev) {
	try {

		if (ev.keyCode==13) {
			FactureType_rechercherReference();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function FactureType_rechercherStock(reference) {
	try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		if (reference != null) { url += "&Reference="+ urlEncode(reference); }
    window.openDialog(url,'','chrome,modal,centerscreen',FactureType_retourRechercherStock);

	} catch (e) {
    recup_erreur(e);
  }
}


function FactureType_retourRechercherStock(reference) {
	try {

		document.getElementById('Reference').value = reference;
		FactureType_ajouterLigne("S");

	} catch (e) {
    recup_erreur(e);
  }
}


function FactureType_rechercherReference() {
	try {

		var reference = document.getElementById('Reference').value;
		
		var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
		qExArt.setParam("Reference", reference);
		var result = qExArt.execute();

		var articleId = result.responseXML.documentElement.getAttribute("Article_Id");

		if (!isEmpty(articleId)) {
			document.getElementById('Reference').value = articleId;
			FactureType_ajouterLigne("S");
		} else {
			FactureType_rechercherStock(reference);
		}

	} catch (e) {
    recup_erreur(e);
  }
}



//fonction qui charge les informations du modele (uniquement celle de facture type)
function FactureType_chargerModele(contenu) {
	try
	{
		FactureType_chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById('tarif').value = contenu.getAttribute('Code_Tarif');
		FactureType_chargerModesReglements(contenu.getAttribute('Mode_reglement'));
		document.getElementById('Remise').value = contenu.getAttribute('Remise');
		typeRemise = contenu.getAttribute('TypeRemise');
		document.getElementById('bRemise').setAttribute("class", (typeRemise=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('Frais_Port').value = contenu.getAttribute('Frais_Port');
		document.getElementById('RemiseFP').value = contenu.getAttribute('RemiseFP');
		typeRemiseFP = contenu.getAttribute('TypeRemise_FP');
		document.getElementById('bRemiseFP').setAttribute("class", (typeRemiseFP=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('Escompte').value = contenu.getAttribute('Escompte');
		var typeEdition = (contenu.getAttribute('Edition_TTC')=="1");

		if (contenu.getAttribute('Com_ds_facture')=="0")
		{
			document.getElementById('Commentaires').value = "";
		}
		else
		{
			document.getElementById('Commentaires').value = contenu.getAttribute('Commentaires');
		}
		
		if (global_modele_id!=undefined && abonnementId==undefined) {
			var aLignesModele = new Arbre("Facturation/GetRDF/articles_modele.tmpl","articles");
			aLignesModele.setParam("Modele_Id", global_modele_id);
			aLignesModele.initTree(FactureType_calculTotaux);
		}
		else
		{
			aLignes.initTree(FactureType_calculTotaux);
		}
		
		changerTypeEdition(typeEdition);

	} catch(e) {
	 	recup_erreur(e);
	}
}

//fonction qui charge les informations de l'abonnement (uniquement celle de facture type)
function FactureType_chargerAbonnement(contenu) {
	try	{

		FactureType_chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById('tarif').value = contenu.getAttribute('Code_tarif');
		FactureType_chargerModesReglements(contenu.getAttribute('Mode_reglement'));
		document.getElementById('Remise').value = contenu.getAttribute('Remise');
		typeRemise = contenu.getAttribute('TypeRemise');
		document.getElementById('bRemise').setAttribute("class", (typeRemise=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('Frais_Port').value = contenu.getAttribute('Frais_Port');
		document.getElementById('RemiseFP').value = contenu.getAttribute('RemiseFP');
		typeRemiseFP = contenu.getAttribute('TypeRemise_FP');
		document.getElementById('bRemiseFP').setAttribute("class", (typeRemiseFP=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('Escompte').value = contenu.getAttribute('Escompte');
		document.getElementById('Commentaires').value = contenu.getAttribute('Commentaires');

		editionTTC = (contenu.getAttribute('Edition_TTC')=="1");
		if (editionTTC) {
			document.getElementById('ColTotal').setAttribute("label", "Total TTC");
			document.getElementById('ColPU').setAttribute("label", "P.U TTC");
			document.getElementById('lblFrais_Port').value = "Frais de port (ttc) :";
			document.getElementById('lblPU').value = "P.U TTC :";
			document.getElementById('piedTTC').collapsed = false;
			document.getElementById('piedHT').collapsed = true;
		}
		else {
			document.getElementById('ColTotal').setAttribute("label", "Total HT");
			document.getElementById('ColPU').setAttribute("label", "P.U HT");
			document.getElementById('lblFrais_Port').value = "Frais de port (ht) :";
			document.getElementById('lblPU').value = "P.U HT :";
			document.getElementById('piedTTC').collapsed = true;
			document.getElementById('piedHT').collapsed = false;
		}
		
		FactureType_ajouterLigne("I");
		
		chargementFacture = true;
	 	aLignes.setParam("Abonnement_Id", abonnementId);
		aLignes.initTree(FactureType_calculTotaux);

	} catch(e) {
		recup_erreur(e);
	}
}


//fonction qui initialise les valeurs des champs de l'article
function FactureType_formatLigne(type_ligne) {
  try {

		switch(type_ligne) {
			case "S":
				document.getElementById('Reference').disabled = true;
				document.getElementById('Designation').disabled = true;
				document.getElementById('Quantite').disabled = false;
				document.getElementById('PU').disabled = false;
				document.getElementById('Ristourne').disabled = false;
				document.getElementById('Code_TVA').disabled = !zoneUE;
				document.getElementById('bValider').disabled = false;
				document.getElementById('bAnnuler').disabled = false;
				break;

			case "I":
				document.getElementById('Reference').disabled = false;
				document.getElementById('Designation').disabled = false;
				document.getElementById('Quantite').disabled = false;
				document.getElementById('PU').disabled = false;
				document.getElementById('Ristourne').disabled = false;
				document.getElementById('Code_TVA').disabled = !zoneUE;
				document.getElementById('bValider').disabled = false;
				document.getElementById('bAnnuler').disabled = false;
				break;

			default:
				document.getElementById('Reference').value = "";
				document.getElementById('Designation').value = "";
				document.getElementById('Quantite').value = "";
				document.getElementById('PU').value = "";
				document.getElementById('Ristourne').value = "";
				document.getElementById('Libelle').value = "";
				document.getElementById('Ligne_Id').value = "";
				document.getElementById('Code_TVA').value = getCodeTvaNormal(document.getElementById("Code_Pays_Liv").value,assujettiTVA,"G");
				document.getElementById('Reference').disabled = true;
				document.getElementById('Designation').disabled = true;
				document.getElementById('Quantite').disabled = true;
				document.getElementById('PU').disabled = true;
				document.getElementById('Ristourne').disabled = true;
				document.getElementById('Code_TVA').disabled = true;
				document.getElementById('bSupprimer').disabled = true;
				document.getElementById('bValider').disabled = true;
				document.getElementById('bAnnuler').disabled = true;
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


//fonction qui permet d'editer un commentaire pour un article selectionné
function FactureType_editerCommentaire() {
	try 
	{
		if (mode=="C")
		{
			showWarning("Veuillez d'abord enregistrer l'abonnement.");
		}
		else {

			var tree_articles = document.getElementById("articles");

			if (tree_articles.view!=null && tree_articles.currentIndex!=-1) {

				var ligneId = getCellText(tree_articles,tree_articles.currentIndex,'ColLigne_Id');

				var page ="chrome://opensi/content/facturation/user/abonnement/commentaire.xul?" + cookie()+"&Type=abonnement&Ligne_Id="+ ligneId;
				window.openDialog(page,'','chrome,modal,centerscreen');

				aLignes.initTree(FactureType_calculTotaux);
				FactureType_ajouterLigne("I");
			}
			else
			{
				showWarning("Aucun article ou commentaire sélectionné !");
			}
		}

	}	catch (e) {
    recup_erreur(e);
  }
}
//fonction qui charge les informations d'un article selectionné dans l'arbre
function FactureType_ouvrirLigne() {
  try {
		if (etat!="R" && etat!="T") {
			var tree = document.getElementById("articles");
			if (tree.view!=null && tree.currentIndex!=-1) {
				if (getCellText(tree,tree.currentIndex,'ColType_Ligne')=="C") {
					FactureType_ajouterLigne("I");
				}
				else {
					mode_ligne = "M";
					document.getElementById('bSupprimer').disabled = false;
					document.getElementById("Reference").value = getCellText(tree,tree.currentIndex,'ColReference');
					document.getElementById("Designation").value = getCellText(tree,tree.currentIndex,'ColDesignation');
					document.getElementById("Quantite").value = getCellText(tree,tree.currentIndex,'ColQuantite');
					document.getElementById("PU").value = getCellText(tree,tree.currentIndex,'ColPU');
					document.getElementById("Code_TVA").value = getCellText(tree,tree.currentIndex,'ColCode_TVA');
					document.getElementById("Ristourne").value = getCellText(tree,tree.currentIndex,'ColRistourne');
					document.getElementById("Type_Ligne").value = getCellText(tree,tree.currentIndex,'ColType_Ligne');
					document.getElementById("Ligne_Id").value = getCellText(tree,tree.currentIndex,'ColLigne_Id');
					document.getElementById("Libelle").value = getCellText(tree,tree.currentIndex,'ColLibelle');
					
					FactureType_formatLigne(document.getElementById("Type_Ligne").value);
				}
			}
		}
	} catch (e) {
  	recup_erreur(e);
	}
}


function FactureType_ouvrirCommentaire() {
  try {

		var tree = document.getElementById("articles");

		if (tree.view!=null && tree.currentIndex!=-1 && mode=="M") {

			if (getCellText(tree,tree.currentIndex,'ColType_Ligne')=="C") {
				FactureType_editerCommentaire();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function FactureType_annulerLigne() {
  try {

  	aLignes.select(-1);
		FactureType_ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
	}
}


function FactureType_supprimerLigne() {
  try {

		var ligneId = document.getElementById("Ligne_Id").value;

		var corps = cookie() +"&Page=Facturation/Abonnement/supprimerArticle.tmpl&ContentType=xml&type=abonnement&Ligne_Id="+ ligneId;
		requeteHTTP(corps);

		majTotaux = true;
		chargementFacture = false;
		menu_abonnement_chargerAbonnement();

	} catch (e) {
  	recup_erreur(e);
	}
}


function FactureType_choisirMentions() {
  try {

  	var ok = true;

  	if (mode=="C") {
			ok = menu_abonnement_enregistrerTout(false);
		}

		if (ok) {
			var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Abonnement&Doc_Id="+ abonnementId;
    	window.openDialog(url,'','chrome,modal,centerscreen',menu_abonnement_setModifie);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}




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

var oea_aLignes = new Arbre('Facturation/GetRDF/articles_avoir_fournisseur.tmpl', 'oea-articles');
var oea_aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "oea-secteur");
var oea_aResponsables = new Arbre("ComboListe/combo-responsables.tmpl","oea-responsable");
var oea_aVersion = new Arbre("Facturation/Commun/liste-historiqueEditions.tmpl","oea-listeVersion");

var oea_modeLigne;
var oea_mode;
var oea_tauxTvaPort;
var oea_codeTvaPort;
var oea_chargerResponsable;
var oea_modifie = false;
var oea_currentIndex = 0;
var oea_typeRemise = 'P';
var oea_typeRemiseFP = 'P';
var oea_montantHT = 0;
var oea_typeLigne;
var oea_tarifId;
var oea_ligneId;
var oea_libelle;

function oea_init() {
  try {

  	var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();
		var produitFrais = (parseInt(result.responseXML.documentElement.getAttribute('Produit_Frais'))==1);

		if (!produitFrais) {
			document.getElementById('oea-colNumLot').collapsed = true;
			document.getElementById('oea-colNbPieces').collapsed = true;
			document.getElementById('oea-colUnite').collapsed = true;
			document.getElementById('oea-colDatePeremption').collapsed = true;
			document.getElementById('oea-produitFrais1').collapsed = true;
			document.getElementById('oea-produitFrais2').collapsed = true;
			document.getElementById('oea-produitFrais3').collapsed = true;
			document.getElementById('oea-produitFrais4').collapsed = true;
		}

		var aUnite = new Arbre("Facturation/GetRDF/unites_vente.tmpl", "oea-unite");
		aUnite.initTree(oea_initUnite);
	} catch (e) {
  	recup_erreur(e);
	}
}

function oea_initUnite() {
	try {

    document.getElementById('oea-unite').selectedIndex = 0;
    oea_aSecteurs.initTree(oea_initSecteur);

	} catch (e) {
    recup_erreur(e);
  }
}

function oea_initSecteur() {
	try {

    document.getElementById('oea-secteur').selectedIndex = 0;
    var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "oea-codePays");
		aPays.initTree(oea_initPays);

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_initPays() {
	try {

    document.getElementById('oea-codePays').value = "FR";
    oea_calculerTvaPort();
    oea_selectPays();

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_selectPays() {
	try {
		oea_listeTVA();
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_calculerTvaPort() {
	try {
		var codePays = document.getElementById('oea-codePays').value;
		oea_codeTvaPort = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
		oea_tauxTvaPort = getTva(oea_codeTvaPort);
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_listeTVA() {
  try {
  	oea_calculTotaux();
    var aCode = new Arbre("Facturation/GetRDF/taux_tva_fournisseur.tmpl", "oea-codeTVA");
    aCode.setParam("Code_Pays", document.getElementById("oea-codePays").value);
    aCode.initTree(oea_selectTVA);

  } catch (e) {
    recup_erreur(e);
  }
}


function oea_selectTVA() {
  try {
  	var codePays = document.getElementById('oea-codePays').value;
    document.getElementById('oea-codeTVA').value = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
  } catch (e) {
    recup_erreur(e);
  }
}


function oea_chargerResponsables(selection) {
	try {
		oea_chargerResponsable = selection;
		oea_aResponsables.setParam("Selection", oea_chargerResponsable);
		oea_aResponsables.initTree(oea_initResponsable);
	} catch (e) {
		recup_erreur(e);
	}
}

function oea_initResponsable() {
  try {
		document.getElementById('oea-responsable').value = oea_chargerResponsable;
	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_reinitialiser() {
	try {
		
		oea_modeLigne = "C";
		oea_currentIndex = 0;
		oea_typeRemise = "P";
		oea_typeRemiseFP = "P";
		oea_chargerModeReg = "0";
		oea_chargerResponsable = "0";
		oea_montantHT = 0;
		oea_bloquerEcheance = false;
		
		document.getElementById('oea-tabBoxAvoir').selectedIndex = 0;
		document.getElementById('oea-deckAvoir').selectedIndex = 0;
		document.getElementById('oea-boxMail').collapsed=false;
		document.getElementById('oea-tabAvoir').setAttribute('image', null);

		document.getElementById('oea-numAvoir').value = "";
		document.getElementById('oea-dateAvoir').value = "";
		document.getElementById('oea-secteur').selectedIndex = 0;
		
		oea_aVersion.deleteTree();
		
		document.getElementById('oea-fournisseurId').value = "";
		document.getElementById('oea-labelFournisseur').value = "";
		
		oea_aResponsables.deleteTree();

		document.getElementById('oea-denomination').value = "";
		document.getElementById('oea-adresse1').value = "";
		document.getElementById('oea-adresse2').value = "";
		document.getElementById('oea-adresse3').value = "";
		document.getElementById('oea-codePostal').value = "";
		document.getElementById('oea-ville').value = "";
		document.getElementById('oea-codePays').value = "FR";
		document.getElementById('oea-civInter').selectedIndex = 0;
		document.getElementById('oea-nomInter').value = "";
		document.getElementById('oea-prenomInter').value = "";
		document.getElementById('oea-telInter').value = "";
		document.getElementById('oea-faxInter').value = "";
		document.getElementById('oea-emailInter').value = "";
		
		document.getElementById('oea-reference').value = "";
		document.getElementById('oea-designation').value = "";
		document.getElementById('oea-numLot').value = "";
		document.getElementById('oea-nbPieces').value = "";
		document.getElementById('oea-quantite').value = "";
		document.getElementById('oea-unite').value = "U";
		document.getElementById('oea-datePeremption').value = "";
		document.getElementById('oea-PU').value = "";
		document.getElementById('oea-ristourne').value = "";
		
		document.getElementById('oea-commentairesFin').value = "";
		document.getElementById('oea-commentairesInt').value = "";
		document.getElementById('oea-bRemise').setAttribute('class', 'bIcoPourcentage');
		document.getElementById('oea-remise').value = "0.00";
		document.getElementById('oea-fraisPort').value = "0.00";
		document.getElementById('oea-bRemiseFP').setAttribute('class', 'bIcoPourcentage');
		document.getElementById('oea-remiseFP').value = "0.00";
		document.getElementById('oea-escompte').value = "0.00";
		
		document.getElementById('oea-montantHT').value = "0.00";
		document.getElementById('oea-montantRemise').value = "0.00";
		document.getElementById('oea-montantFraisPort').value = "0.00";
		document.getElementById('oea-montantRemiseFP').value = "0.00";
		document.getElementById('oea-totalHT').value = "0.00";
		document.getElementById('oea-TVA').value = "0.00";
		document.getElementById('oea-montantTTC').value = "0.00";
		document.getElementById('oea-montantEscompte').value = "0.00";
		document.getElementById('oea-totalTTC').value = "0.00";
		
		document.getElementById('oea-rowRemiseHT').collapsed = true;
		document.getElementById('oea-rowRemiseFPHT').collapsed = true;
		document.getElementById('oea-rowMontantTTC').collapsed = true;
		document.getElementById('oea-rowEscompteHT').collapsed = true;
		
		document.getElementById('oea-creation').setAttribute("label", "");
		document.getElementById('oea-modification').setAttribute("label", "");
		document.getElementById('oea-fiche').setAttribute("label", "");
		
		oea_typeLigne = "";
		oea_tarifId = "";
		oea_ligneId = "";
		oea_libelle = "";
		oea_modifie = false;
		
		document.getElementById('oea-numAvoir').disabled = true;
		document.getElementById('oea-dateAvoir').disabled = true;
		document.getElementById('oea-secteur').disabled = true;
		document.getElementById('oea-responsable').disabled = true;
		
		document.getElementById('oea-denomination').disabled = true;
		document.getElementById('oea-adresse1').disabled = true;
		document.getElementById('oea-adresse2').disabled = true;
		document.getElementById('oea-adresse3').disabled = true;
		document.getElementById('oea-codePostal').disabled = true;
		document.getElementById('oea-ville').disabled = true;
		document.getElementById('oea-codePays').disabled = true;
		document.getElementById('oea-civInter').disabled = true;
		document.getElementById('oea-nomInter').disabled = true;
		document.getElementById('oea-prenomInter').disabled = true;
		document.getElementById('oea-telInter').disabled = true;
		document.getElementById('oea-faxInter').disabled = true;
		document.getElementById('oea-emailInter').disabled = true;
		document.getElementById('oea-bRechFournisseur').collapsed = true;
		document.getElementById('oea-bChercherAdr').disabled = true;
		document.getElementById('oea-bChercherInter').disabled = true;
		
		document.getElementById('oea-bFlecheHaut').disabled = true;
		document.getElementById('oea-bFlecheBas').disabled = true;
		
		document.getElementById('oea-reference').disabled = true;
		document.getElementById('oea-designation').disabled = true;
		document.getElementById('oea-numLot').disabled = true;
		document.getElementById('oea-nbPieces').disabled = true;
		document.getElementById('oea-quantite').disabled = true;
		document.getElementById('oea-unite').disabled = true;
		document.getElementById('oea-datePeremption').disabled = true;
		document.getElementById('oea-PU').disabled = true;
		document.getElementById('oea-ristourne').disabled = true;
		document.getElementById('oea-codeTVA').disabled = true;
		
		document.getElementById('oea-bArticle').disabled = true;
		document.getElementById('oea-bCommentaire').disabled = true;
		document.getElementById('oea-bAnnuler').disabled = true;
		document.getElementById('oea-bValider').disabled = true;
		document.getElementById('oea-bSupprimer').disabled = true;
		oea_aLignes.deleteTree();
		
		document.getElementById('oea-commentairesFin').disabled = true;
		document.getElementById('oea-commentairesInt').disabled = true;
		document.getElementById('oea-bOuvrirCommentairesCaches').disabled = true;
		document.getElementById('oea-bChoisirMentions').disabled = true;
		document.getElementById('oea-bRemise').disabled = true;
		document.getElementById('oea-remise').disabled = true;
		document.getElementById('oea-fraisPort').disabled = true;
		document.getElementById('oea-bRemiseFP').disabled = true;
		document.getElementById('oea-remiseFP').disabled = true;
		document.getElementById('oea-escompte').disabled = true;
		document.getElementById('oea-bEnregistrer').disabled = true;
		document.getElementById('oea-bSupAvoir').disabled = true;
		document.getElementById('oea-bVisualiser').disabled = true;
		document.getElementById('oea-pdfAvoir').setAttribute('src', null);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_debloquerChamps() {
	try {
		document.getElementById('oea-numAvoir').disabled = false;
		document.getElementById('oea-dateAvoir').disabled = false;
		document.getElementById('oea-secteur').disabled = false;
		document.getElementById('oea-responsable').disabled = false;
		
		document.getElementById('oea-denomination').disabled = false;
		document.getElementById('oea-adresse1').disabled = false;
		document.getElementById('oea-adresse2').disabled = false;
		document.getElementById('oea-adresse3').disabled = false;
		document.getElementById('oea-codePostal').disabled = false;
		document.getElementById('oea-ville').disabled = false;
		document.getElementById('oea-codePays').disabled = false;
		document.getElementById('oea-civInter').disabled = false;
		document.getElementById('oea-nomInter').disabled = false;
		document.getElementById('oea-prenomInter').disabled = false;
		document.getElementById('oea-telInter').disabled = false;
		document.getElementById('oea-faxInter').disabled = false;
		document.getElementById('oea-emailInter').disabled = false;
		
		oea_ajouterLigne("I");
		document.getElementById('oea-bArticle').disabled = false;
		
		document.getElementById('oea-commentairesFin').disabled = false;
		document.getElementById('oea-commentairesInt').disabled = false;
		document.getElementById('oea-bChoisirMentions').disabled = false;
		document.getElementById('oea-bRemise').disabled = false;
		document.getElementById('oea-remise').disabled = false;
		document.getElementById('oea-fraisPort').disabled = false;
		document.getElementById('oea-bRemiseFP').disabled = false;
		document.getElementById('oea-remiseFP').disabled = false;
		document.getElementById('oea-escompte').disabled = false;
		document.getElementById('oea-bEnregistrer').disabled = false;
		document.getElementById('oea-bSupAvoir').disabled = (oea_mode!="M");
		
		if (oea_mode=='C') { document.getElementById('oea-bRechFournisseur').collapsed = false; }
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_chargerAvoir() {
	try {
		oea_mode = "M";
		oea_reinitialiser();
		
		oea_aLignes.setParam("Avoir_Id",avoirId);
		oea_aLignes.initTree(oea_chargerAvoir2);
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_chargerAvoir2() {
  try {
  	
  	var qChargerAvoir = new QueryHttp("Facturation/Avoirs_Fournisseur/getAvoir.tmpl");
  	qChargerAvoir.setParam("Avoir_Id", avoirId);
		var result = qChargerAvoir.execute();
		var contenu = result.responseXML.documentElement;
		
		var numAvoir = contenu.getAttribute('Numero');
		var statut = contenu.getAttribute('Statut');
		if (statut=="V") { oea_mode = "V"; }

    oea_chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById('oea-commentairesFin').value = contenu.getAttribute('Commentaires_Fin');
		document.getElementById('oea-commentairesInt').value = contenu.getAttribute('Commentaires_Int');
		document.getElementById('oea-dateAvoir').value = contenu.getAttribute('Date_Avoir');
		document.getElementById('oea-numAvoir').value = numAvoir;
		document.getElementById('oea-escompte').value = contenu.getAttribute('Escompte');
    document.getElementById('oea-fraisPort').value = contenu.getAttribute('Frais_Port');
    oea_codeTvaPort = contenu.getAttribute('Code_TVA_Port');
		oea_tauxTvaPort = contenu.getAttribute('Taux_TVA_Port');

		var fournisseurId = contenu.getAttribute('Fournisseur_Id');
		document.getElementById('oea-fournisseurId').value = fournisseurId;
		
		var fournisseurConnu = (fournisseurId!="");
		document.getElementById('oea-labelFournisseur').value = fournisseurId;

    document.getElementById('oea-denomination').value = contenu.getAttribute('Denomination');
    document.getElementById('oea-adresse1').value = contenu.getAttribute('Adresse_Fact');
    document.getElementById('oea-adresse2').value = contenu.getAttribute('Comp_Adresse_Fact');
		document.getElementById('oea-adresse3').value = contenu.getAttribute('Adresse_3_Fact');
    document.getElementById('oea-codePostal').value = contenu.getAttribute('CP_Fact');
    document.getElementById('oea-ville').value = contenu.getAttribute('Ville_Fact');
		document.getElementById('oea-codePays').value = contenu.getAttribute('Code_Pays_Fact');
		oea_selectPays();
		
		document.getElementById('oea-civInter').value = contenu.getAttribute('Civ_Inter');
    document.getElementById('oea-nomInter').value = contenu.getAttribute('Nom_Inter');
    document.getElementById('oea-prenomInter').value = contenu.getAttribute('Prenom_Inter');
    document.getElementById('oea-telInter').value = contenu.getAttribute('Tel_Inter');
    document.getElementById('oea-faxInter').value = contenu.getAttribute('Fax_Inter');
    document.getElementById('oea-emailInter').value = contenu.getAttribute('Email_Inter');
    
    document.getElementById('oea-remise').value = contenu.getAttribute('Remise');
    oea_typeRemise = contenu.getAttribute('TypeRemise');
		document.getElementById('oea-bRemise').setAttribute("class", (oea_typeRemise=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('oea-remiseFP').value = contenu.getAttribute('Remise_FP');
		oea_typeRemiseFP = contenu.getAttribute('TypeRemise_FP');
		document.getElementById('oea-bRemiseFP').setAttribute("class", (oea_typeRemiseFP=='P'?"bIcoPourcentage":"bIcoEuro"));

		document.getElementById('oea-secteur').value = contenu.getAttribute('Secteur_Activite');

		document.getElementById('oea-creation').label = "Avoir créé le "+ contenu.getAttribute('Date_Creation') + " par "+ contenu.getAttribute('Login_Createur');
		document.getElementById('oea-modification').label = "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj');
		document.getElementById('oea-fiche').label = "Avoir N° "+ contenu.getAttribute('Numero');
		
		document.getElementById('oea-tabVersionDocument').collapsed = false;
		oea_initVersion();

		oea_setModifie(false);

		if (oea_mode!="V") {
			oea_debloquerChamps();
			document.getElementById('oea-bChercherInter').disabled = !fournisseurConnu;
		}
		
		document.getElementById('oea-bOuvrirCommentairesCaches').disabled = false;
    document.getElementById('oea-bVisualiser').disabled = false;

		oea_calculTotaux();

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_switchRemise() {
	try {

		if (oea_typeRemise=='P') {
			document.getElementById('oea-bRemise').setAttribute("class", "bIcoEuro");
			oea_typeRemise = 'M';
		}
		else {
			document.getElementById('oea-bRemise').setAttribute("class", "bIcoPourcentage");
			oea_typeRemise = 'P';
		}
		oea_calculTotaux();
		oea_setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_switchRemiseFP() {
	try {

		if (oea_typeRemiseFP=='P') {
			document.getElementById('oea-bRemiseFP').setAttribute("class", "bIcoEuro");
			oea_typeRemiseFP = 'M';
		}
		else {
			document.getElementById('oea-bRemiseFP').setAttribute("class", "bIcoPourcentage");
			oea_typeRemiseFP = 'P';
		}
		oea_calculTotaux();
		oea_setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_rechercherFournisseur() {
  try {

		var url = "chrome://opensi/content/facturation/user/fournisseurs/rech_fournisseur.xul?"+ cookie();
    url += "&Nouv=false&Bloque=true";
    window.openDialog(url,'','chrome,modal,centerscreen',oea_retourRechercherFournisseur);
		if (!isEmpty(document.getElementById("oea-fournisseurId").value)) {
			oea_setModifie(true);
			oea_chargerCoord();
		}

	} catch (e) {
  	recup_erreur(e);
  }
}

function oea_retourRechercherFournisseur(codeFournisseur) {
	try {
		document.getElementById('oea-fournisseurId').value = codeFournisseur;
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_rechercherAdr() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdrCom.xul?"+ cookie() +"&Fournisseur_Id="+ urlEncode(document.getElementById('oea_fournisseurId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oea_reporterAdr);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_reporterAdr(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact) {
  try {

		document.getElementById("oea-denomination").value = nom;
		document.getElementById("oea-adresse1").value = adr1;
		document.getElementById("oea-adresse2").value = adr2;
		document.getElementById("oea-adresse3").value = adr3;
		document.getElementById("oea-codePostal").value = cp;
		document.getElementById("oea-ville").value = ville;
	  document.getElementById("oea-codePays").value = code_pays;
	  oea_calculerTvaPort();
	  oea_selectPays();

	  if (!isEmpty(contact)) {
	  	var qInter = new QueryHttp("Facturation/Fournisseurs/getContact.tmpl");
	  	qInter.setParam("Num_Inter", contact);
	  	var result = qInter.execute();
	  	var content = result.responseXML.documentElement;
	  	oea_reporterInter(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
	  oea_setModifie(true);


	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_rechercherInterlocuteur() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInterFournisseur.xul?"+ cookie() +"&Fournisseur_Id="+ urlEncode(document.getElementById('oea-fournisseurId').value);
    window.openDialog(url,'','chrome,modal,centerscreen', oea_reporterInter);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_reporterInter(civ, civ_courte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById("oea-civInter").value = civ;
		document.getElementById("oea-nomInter").value = nom;
		document.getElementById("oea-prenomInter").value = prenom;
		document.getElementById("oea-telInter").value = tel;
		document.getElementById("oea-faxInter").value = fax;
		document.getElementById("oea-emailInter").value = email;

		oea_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_chargerCoord() {
  try {

		var fournisseurId = document.getElementById("oea-fournisseurId").value;
		document.getElementById('oea-labelFournisseur').value = fournisseurId;
		var qCoord = new QueryHttp("Facturation/Fournisseurs/getCoord.tmpl");
		qCoord.setParam("Fournisseur_Id", fournisseurId);
		var result = qCoord.execute();
		var contenu = result.responseXML.documentElement;
		document.getElementById("oea-denomination").value = contenu.getAttribute("Denomination");
		document.getElementById("oea-adresse1").value = contenu.getAttribute("Adresse_Fact");
		document.getElementById("oea-adresse2").value = contenu.getAttribute("Comp_Adresse_Fact");
		document.getElementById("oea-adresse3").value = contenu.getAttribute("Adresse_3_Fact");
		document.getElementById("oea-codePostal").value = contenu.getAttribute("CP_Fact");
		document.getElementById("oea-ville").value = contenu.getAttribute("Ville_Fact");
		document.getElementById("oea-codePays").value = contenu.getAttribute("Code_Pays_Fact");
		oea_calculerTvaPort();
		oea_selectPays();

		document.getElementById("oea-civInter").value = contenu.getAttribute("Civ_Inter");
		document.getElementById("oea-nomInter").value = contenu.getAttribute("Nom_Inter");
		document.getElementById("oea-prenomInter").value = contenu.getAttribute("Prenom_Inter");
		document.getElementById("oea-telInter").value = contenu.getAttribute("Tel_Inter");
		document.getElementById("oea-faxInter").value = contenu.getAttribute("Fax_Inter");
		document.getElementById("oea-emailInter").value = contenu.getAttribute("Email_Inter");
		oea_chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById("oea-secteur").value = contenu.getAttribute("Secteur_Activite");

    document.getElementById('oea-remise').value = contenu.getAttribute("Remise");
		document.getElementById('oea-bRemise').setAttribute("class", "bIcoPourcentage");
		oea_typeRemise = 'P';
		
		document.getElementById('oea-bChercherAdr').disabled = false;
		document.getElementById('oea-bChercherInter').disabled = false;

		oea_ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_ajouterLigne(typeLigne) {
  try {

		document.getElementById('oea-bSupprimer').disabled = true;
		document.getElementById('oea-bCommentaire').disabled = false;
		document.getElementById('oea-bFlecheHaut').disabled = true;
		document.getElementById('oea-bFlecheBas').disabled = true;
		oea_modeLigne = "C";
		
		oea_typeLigne = typeLigne;
		oea_ligneId = "";

		oea_formatLigne(typeLigne);
		var fournisseurId = document.getElementById("oea-fournisseurId").value;
		var codePays = document.getElementById('oea-codePays').value;

		switch(typeLigne) {
			case "S":

				var reference = document.getElementById("oea-reference").value;

				if (!isEmpty(reference)) {
					var queryTarif = new QueryHttp("Facturation/Factu_Fournisseur/getArticleTarif.tmpl");
					queryTarif.setParam("Article_Id", reference);
					if (!isEmpty(fournisseurId)) { queryTarif.setParam("Fournisseur_Id", fournisseurId); }
					var result = queryTarif.execute();
					var contenu = result.responseXML.documentElement;
					document.getElementById("oea-designation").value = contenu.getAttribute("Designation");
					document.getElementById("oea-numLot").value = "";
					document.getElementById("oea-nbPieces").value = "";
					document.getElementById('oea-quantite').value = 1;
					document.getElementById('oea-unite').value = contenu.getAttribute("Unite");
					document.getElementById("oea-datePeremption").value = "";
					document.getElementById("oea-PU").value = contenu.getAttribute("Prix");
					document.getElementById('oea-ristourne').value = "0.00";
					document.getElementById("oea-codeTVA").value = (codePays=="FR"?contenu.getAttribute("Code_TVA"):getCodeTvaZero(codePays));
					oea_libelle = "";
				}
				else {
					oea_ajouterLigne("I");
				}

				break;

			case "I":

				document.getElementById('oea-reference').value = "";
				document.getElementById('oea-designation').value = "";
				document.getElementById("oea-numLot").value = "";
				document.getElementById("oea-nbPieces").value = "";
				document.getElementById('oea-quantite').value = 1;
				document.getElementById('oea-unite').value = "U";
				document.getElementById("oea-datePeremption").value = "";
				document.getElementById('oea-PU').value = "";
				document.getElementById('oea-ristourne').value = "0.00";
				document.getElementById('oea-codeTVA').value = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
				oea_libelle = "";
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_formatLigne(typeLigne) {
  try {
		switch (typeLigne) {
			case "S":
        if (oea_mode != 'V') {
				  document.getElementById('oea-reference').disabled = true;
				  document.getElementById('oea-designation').disabled = true;
				  document.getElementById('oea-numLot').disabled = false;
					document.getElementById('oea-nbPieces').disabled = false;
				  document.getElementById('oea-quantite').disabled = false;
				  document.getElementById('oea-unite').disabled = false;
					document.getElementById('oea-datePeremption').disabled = false;
				  document.getElementById('oea-PU').disabled = false;
				  document.getElementById('oea-ristourne').disabled = false;
				  document.getElementById('oea-codeTVA').disabled = false;
				  document.getElementById('oea-bValider').disabled = false;
				  document.getElementById('oea-bAnnuler').disabled = false;
        }
				break;

			case "I":
        if (oea_mode != 'V') {
  				document.getElementById('oea-reference').disabled = false;
	  			document.getElementById('oea-designation').disabled = false;
	  			document.getElementById('oea-numLot').disabled = false;
					document.getElementById('oea-nbPieces').disabled = false;
		  		document.getElementById('oea-quantite').disabled = false;
		  		document.getElementById('oea-unite').disabled = false;
					document.getElementById('oea-datePeremption').disabled = false;
			  	document.getElementById('oea-PU').disabled = false;
			  	document.getElementById('oea-ristourne').disabled = false;
				  document.getElementById('oea-codeTVA').disabled = false;
				  document.getElementById('oea-bValider').disabled = false;
				  document.getElementById('oea-bAnnuler').disabled = false;
        }
				break;

			default:
				var codePays = document.getElementById('oea-codePays').value;
			
				document.getElementById('oea-reference').value = "";
				document.getElementById('oea-designation').value = "";
				document.getElementById('oea-numLot').value = "";
				document.getElementById('oea-nbPieces').value = "";
				document.getElementById('oea-quantite').value = "";
				document.getElementById('oea-unite').value = "U";
				document.getElementById('oea-datePeremption').value = "";
				document.getElementById('oea-PU').value = "";
				document.getElementById('oea-ristourne').value = "0.00";
				document.getElementById('oea-codeTVA').value = (codePays=="FR"?getCodeTvaNormalFrance():getCodeTvaZero(codePays));
				oea_libelle = "";
				oea_ligneId = "";
				document.getElementById('oea-reference').disabled = true;
				document.getElementById('oea-designation').disabled = true;
				document.getElementById('oea-numLot').disabled = true;
				document.getElementById('oea-nbPieces').disabled = true;
				document.getElementById('oea-quantite').disabled = true;
				document.getElementById('oea-unite').disabled = true;
				document.getElementById('oea-datePeremption').disabled = true;
				document.getElementById('oea-PU').disabled = true;
				document.getElementById('oea-ristourne').disabled = true;
				document.getElementById('oea-codeTVA').disabled = true;
				document.getElementById('oea-bSupprimer').disabled = true;
				document.getElementById('oea-bFlecheHaut').disabled = true;
				document.getElementById('oea-bFlecheBas').disabled = true;
				document.getElementById('oea-bValider').disabled = true;
				document.getElementById('oea-bAnnuler').disabled = true;
				break;
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_dejaPresente(reference) {
  try {

		var queryExArticle = new QueryHttp("Facturation/Factu_Fournisseur/existeArticle.tmpl");
		queryExArticle.setParam("Reference",reference);
		queryExArticle.setParam("Doc_Id",avoirId);
		queryExArticle.setParam("Type_Doc", "Avoir_Fournisseur");
		var result=queryExArticle.execute();

    return (result.responseXML.documentElement.getAttribute("existe")=="true");

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_pressOnQuantite(ev) {
	try {

		if (ev.keyCode==13) {
			oea_validerLigne();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_pressOnReference(ev) {
	try {

		if (ev.keyCode==13) {
			oea_rechercherReference();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_rechercherStock(reference) {
	try {

		var fournisseurId = document.getElementById("oea-fournisseurId").value;
		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		if (!isEmpty(fournisseurId)) { url += "&Fournisseur="+ urlEncode(fournisseurId); }
		if (reference != null) { url += "&Reference="+ urlEncode(reference); }
    window.openDialog(url,'','chrome,modal,centerscreen',oea_retourRechercherStock);

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_retourRechercherStock(reference) {
	try {

		document.getElementById('oea-reference').value = reference;
		oea_ajouterLigne("S");

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_rechercherReference() {
	try {

		var fournisseurId = document.getElementById("oea-fournisseurId").value;
		var reference = document.getElementById('oea-reference').value;
		
		var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
		qExArt.setParam('Reference', reference);
		if (!isEmpty(fournisseurId)) { qExArt.setParam('Fournisseur_Id', fournisseurId); }
		var result = qExArt.execute();
		var articleId = result.responseXML.documentElement.getAttribute("Article_Id");

		if (!isEmpty(articleId)) {
			document.getElementById('oea-reference').value = articleId;
			oea_ajouterLigne("S");
		} else {
			oea_rechercherStock(reference);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_ouvrirLigne() {
  try {

		if (oea_aLignes.isSelected() && (oea_mode!="C")) {
			var i = oea_aLignes.getCurrentIndex();
			oea_currentIndex = i;
			
			if (oea_aLignes.getCellText(i,'oea-colTypeLigne')=="C") {
				oea_ajouterLigne("I");
			}
			else {
				oea_modeLigne = "M";
        
				document.getElementById("oea-reference").value = oea_aLignes.getCellText(i,'oea-colReference');
				document.getElementById("oea-designation").value = oea_aLignes.getCellText(i,'oea-colDesignation');
				document.getElementById("oea-numLot").value = oea_aLignes.getCellText(i,'oea-colNumLot');
				document.getElementById("oea-nbPieces").value = oea_aLignes.getCellText(i,'oea-colNbPieces');
				document.getElementById("oea-quantite").value = oea_aLignes.getCellText(i,'oea-colQuantite');
				document.getElementById("oea-unite").value = oea_aLignes.getCellText(i,'oea-colUnite');
				document.getElementById("oea-datePeremption").value = oea_aLignes.getCellText(i,'oea-colDatePeremption');
				document.getElementById("oea-PU").value = oea_aLignes.getCellText(i,'oea-colPU');
				document.getElementById("oea-ristourne").value = oea_aLignes.getCellText(i,'oea-colRistourne');
				document.getElementById("oea-codeTVA").value = oea_aLignes.getCellText(i,'oea-colCodeTVA');
				oea_typeLigne = oea_aLignes.getCellText(i,'oea-colTypeLigne');
				oea_ligneId = oea_aLignes.getCellText(i,'oea-colLigneId');
				oea_libelle = oea_aLignes.getCellText(i,'oea-colLibelle');
				
				if (oea_mode == "M") {
					document.getElementById('oea-bCommentaire').disabled = false;
					document.getElementById('oea-bSupprimer').disabled = false;
  		    
  		    // on ignore les lignes de commentaires
  				var firstIndex = 0;
  				var lastIndex = oea_aLignes.nbLignes()-1;
  				if (oea_aLignes.getCellText(firstIndex,'oea-colTypeLigne')=="C") { firstIndex++; }
  				if (oea_aLignes.getCellText(lastIndex,'oea-colTypeLigne')=="C") { lastIndex--; }
  				
  				document.getElementById('oea-bFlecheHaut').disabled = (i==firstIndex);
  				document.getElementById('oea-bFlecheBas').disabled = (i==lastIndex);
        }

				oea_formatLigne(oea_typeLigne);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_ouvrirCommentaire() {
  try {

		if (oea_aLignes.isSelected() && oea_mode=="M") {
			var i = oea_aLignes.getCurrentIndex();
			
			if (oea_aLignes.getCellText(i,'oea-colTypeLigne')=="C") {
				oea_editerCommentaire();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_deplacerLigneBas() {
	try {
		oea_deplacerLigne("Bas");
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_deplacerLigneHaut() {
	try {
		oea_deplacerLigne("Haut");
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_deplacerLigne(type) {
	try {
		if (oea_aLignes.isSelected() && oea_mode=="M") {
			var i = oea_aLignes.getCurrentIndex();
			if (oea_aLignes.getCellText(i,'oea-colTypeLigne')!="C") {
				var ligneId = oea_aLignes.getCellText(i,'oea-colLigneId');
				var qDeplacerLigne = new QueryHttp("Facturation/Avoirs_Fournisseur/deplacerLigne.tmpl");
				qDeplacerLigne.setParam("Ligne_Id", ligneId);
				qDeplacerLigne.setParam("Deplacement", type);
				qDeplacerLigne.execute();
				
				oea_ajouterLigne("I");
				oea_aLignes.initTree(oea_afterRefreshArticles);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_validerLigne() {
  try {

		var reference = document.getElementById("oea-reference").value;
		var designation = document.getElementById("oea-designation").value;
		var numLot = document.getElementById("oea-numLot").value;
		var nbPieces = document.getElementById("oea-nbPieces").value;
		var quantite = document.getElementById("oea-quantite").value;
		var unite = document.getElementById("oea-unite").value;
		var datePeremption = document.getElementById("oea-datePeremption").value;
		var pu = document.getElementById("oea-PU").value;
		var ristourne = document.getElementById("oea-ristourne").value;
		var codeTva = document.getElementById("oea-codeTVA").value;
		var ok=true;

		if (oea_mode=="C") {
			var prec_typeLigne = oea_typeLigne;
			ok = oea_enregistrerAvoir();
			oea_typeLigne = prec_typeLigne;
		}

		if (ok) {

			var qEnregistrer;
			if (oea_modeLigne=="C") {
				qEnregistrer = new QueryHttp("Facturation/Avoirs_Fournisseur/ajouterArticle.tmpl");
			}
			else {
				qEnregistrer = new QueryHttp("Facturation/Avoirs_Fournisseur/modifierArticle.tmpl");
				qEnregistrer.setParam("Ligne_Id", oea_ligneId);
			}
			
			qEnregistrer.setParam("Avoir_Id", avoirId);
			qEnregistrer.setParam("Reference", reference);
			qEnregistrer.setParam("Designation", designation);
			qEnregistrer.setParam("Quantite", quantite);
			qEnregistrer.setParam("Type_Ligne", oea_typeLigne);
			qEnregistrer.setParam("Prix", pu);
			qEnregistrer.setParam("Ristourne", ristourne);
			qEnregistrer.setParam("Code_TVA", codeTva);
			qEnregistrer.setParam("Libelle", oea_libelle);
			qEnregistrer.setParam("Num_Lot", numLot);
			qEnregistrer.setParam("Nb_Pieces", nbPieces);
			qEnregistrer.setParam("Unite", unite);

			if (isEmpty(designation)) { showWarning("Désignation de l'article manquante !"); }
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !");	}
			else if (!isEmpty(nbPieces) && !isPositiveInteger(nbPieces)) { showWarning("Nombre de pièces incorrect !");	}
			else if (!isEmpty(datePeremption) && !isDate(datePeremption)) { showWarning("Date de péremption incorrecte !");	}
			else if (isEmpty(pu) || !checkDecimal(pu,4) || !isPositiveOrNull(pu)) { showWarning("Prix unitaire incorrect !");	}
			else if (isEmpty(ristourne) || !isTaux(ristourne)) { showWarning("Taux de ristourne incorrect !");	}
			else {
	    	
	    	if (oea_modeLigne=="C") {
	    		oea_currentIndex = oea_aLignes.nbLignes();
				}
	    	qEnregistrer.setParam("Date_Peremption", (!isEmpty(datePeremption)?prepareDateJava(datePeremption):""));
				qEnregistrer.execute();

				oea_ajouterLigne("I");
				
				oea_aLignes.initTree(oea_afterRefreshArticles);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_annulerLigne() {
  try {

  	oea_aLignes.select(-1);
  	oea_ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_supprimerLigne() {
  try {
  	
  	var qSupprimer = new QueryHttp("Facturation/Avoirs_Fournisseur/supprimerArticle.tmpl");
		qSupprimer.setParam("Avoir_Id", avoirId);
		qSupprimer.setParam("Ligne_Id", oea_ligneId);
    qSupprimer.execute();

		oea_currentIndex--;
		oea_ajouterLigne("I");
		oea_aLignes.initTree(oea_afterRefreshArticles);

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_enregistrerAvoir() {
  try {
  	var ok=false;

    if (oea_mode != 'C' && (oea_aLignes.nbLignes()==0)) { showWarning("L'avoir ne contient aucune ligne !"); }
    else {
    	var fraisPort = document.getElementById('oea-fraisPort').value;
		  var escompte = document.getElementById('oea-escompte').value;
      var denomination = document.getElementById('oea-denomination').value;
      var adresse1 = document.getElementById('oea-adresse1').value;
      var adresse2 = document.getElementById('oea-adresse2').value;
			var adresse3 = document.getElementById('oea-adresse3').value;
      var cp = document.getElementById('oea-codePostal').value;
      var ville = document.getElementById('oea-ville').value;
			var codePays = document.getElementById('oea-codePays').value;
			var civInter = document.getElementById('oea-civInter').value;
			var nomInter = document.getElementById('oea-nomInter').value;
			var prenomInter = document.getElementById('oea-prenomInter').value;
			var telInter = document.getElementById('oea-telInter').value;
			var faxInter = document.getElementById('oea-faxInter').value;
			var emailInter = document.getElementById('oea-emailInter').value;
			var numero = document.getElementById('oea-numAvoir').value;
			var dateAvoir = document.getElementById('oea-dateAvoir').value;
			var fournisseurId = document.getElementById('oea-fournisseurId').value;
			var secteurActivite = document.getElementById('oea-secteur').value;
			var responsable = document.getElementById('oea-responsable').value;
			var commentairesFin = document.getElementById('oea-commentairesFin').value;
			var commentairesInt = document.getElementById('oea-commentairesInt').value;
		  
		  var remise = document.getElementById('oea-remise').value;
	    var remiseFP = document.getElementById('oea-remiseFP').value;
			var tauxRemise = 0;
			var montantRemise = 0;
			var tauxRemiseFP = 0;
			var montantRemiseFP = 0;
			
			var montantBase = oea_montantHT;

			if (isEmpty(denomination)) { showWarning("Veuillez saisir la raison sociale du fournisseur !"); }
		  else if (isEmpty(adresse1)) { showWarning("Veuillez saisir l'adresse du fournisseur !"); }
		  else if (isEmpty(ville)) { showWarning("Veuillez saisir la ville du fournisseur !"); }
		  else if (isEmpty(remise) || (oea_typeRemise=='P'?!isTaux(remise):!isPositiveOrNull(remise) || parseFloat(remise)>montantBase)) { showWarning("Remise incorrecte !"); }
		  else if (isEmpty(fraisPort) || !isPositiveOrNull(fraisPort)) { showWarning("Frais de port incorrects !"); }
		  else if (isEmpty(remiseFP) || (oea_typeRemiseFP=='P'?!isTaux(remiseFP):!isPositiveOrNull(remiseFP) || parseFloat(remiseFP)>parseFloat(fraisPort))) { showWarning("Remise sur frais de port incorrecte !"); }
    	else if (isEmpty(escompte) || !isTaux(escompte)) { showWarning("Taux d'escompte incorrect !"); }
    	else if (isEmpty(trim(numero))) { showWarning("Numéro de l'avoir incorrect !"); }
		  else if (isEmpty(dateAvoir) || !isDate(dateAvoir)) { showWarning("Date de l'avoir incorrecte !"); }
		  else if (!isEmpty(telInter) && !isPhone(telInter)) { showWarning("Numéro de téléphone de facturation incorrect !"); }
			else if (!isEmpty(faxInter) && !isPhone(faxInter)) { showWarning("Numéro de fax de facturation incorrect !"); }
			else if (!isEmpty(emailInter) && !isEmail(emailInter)) { showWarning("Adresse e-mail de facturation incorrecte !"); }
 			else {
 				
				fraisPort = parseFloat(fraisPort);
				remise = parseFloat(remise);
				remiseFP = parseFloat(remiseFP);
				
				var qEnregistrer;
				
				if (oea_mode=="C") {
			  	qEnregistrer = new QueryHttp("Facturation/Avoirs_Fournisseur/creerAvoir.tmpl");
			  } else {
			  	qEnregistrer = new QueryHttp("Facturation/Avoirs_Fournisseur/modifierAvoir.tmpl");
				  qEnregistrer.setParam("Avoir_Id", avoirId);
			  }
				
				if (oea_typeRemise=='P') {
					tauxRemise = remise;
				}
				else {
					tauxRemise = (montantBase>0?remise/montantBase*100:0);
					montantRemise = remise;
				}
				
				if (oea_typeRemiseFP=='P') {
					tauxRemiseFP = remiseFP;
				}
				else {
					tauxRemiseFP = (fraisPort>0?remiseFP/fraisPort*100:0);
					montantRemiseFP = remiseFP;
				}
				
				qEnregistrer.setParam("Fournisseur_Id", fournisseurId);
				qEnregistrer.setParam("PRemise", tauxRemise);
				qEnregistrer.setParam("MRemise", montantRemise);
				qEnregistrer.setParam("PRemise_FP", tauxRemiseFP);
				qEnregistrer.setParam("MRemise_FP", montantRemiseFP);
				qEnregistrer.setParam("Date_Avoir", prepareDateJava(dateAvoir));
				qEnregistrer.setParam("Numero", numero);
				qEnregistrer.setParam("Denomination", denomination);
				qEnregistrer.setParam("Adresse_Fact", adresse1);
				qEnregistrer.setParam("Comp_Adresse_Fact", adresse2);
				qEnregistrer.setParam("Adresse_3_Fact", adresse3);
				qEnregistrer.setParam("CP_Fact", cp);
				qEnregistrer.setParam("Ville_Fact", ville);
				qEnregistrer.setParam("Code_Pays_Fact", codePays);
				qEnregistrer.setParam("Util_R", responsable);
				qEnregistrer.setParam("Civ_Inter", civInter);
				qEnregistrer.setParam("Nom_Inter", nomInter);
				qEnregistrer.setParam("Prenom_Inter", prenomInter);
				qEnregistrer.setParam("Tel_Inter", telInter);
				qEnregistrer.setParam("Fax_Inter", faxInter);
				qEnregistrer.setParam("Email_Inter", emailInter);
				qEnregistrer.setParam("Code_TVA_Port", oea_codeTvaPort);
				qEnregistrer.setParam("Taux_TVA_Port", oea_tauxTvaPort);
				qEnregistrer.setParam("Secteur_Activite", secteurActivite);
				qEnregistrer.setParam("Frais_Port", fraisPort);
				qEnregistrer.setParam("Escompte", escompte);
				qEnregistrer.setParam("Commentaires_Fin", commentairesFin);
				qEnregistrer.setParam("Commentaires_Int", commentairesInt);
				var result = qEnregistrer.execute();
				var contenu = result.responseXML.documentElement;
				
				if (oea_mode=="C") {
					avoirId = contenu.getAttribute("Avoir_Id");
					oea_aLignes.setParam("Avoir_Id",avoirId);
					oea_chargerAvoir();
				}

			  oea_setModifie(false);
			  ok = true;
		  }
    }

    return ok;

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_calculTotaux() {
  try {
  	
  	var fournisseurId = document.getElementById("oea-fournisseurId").value;
		var fournisseurConnu = (fournisseurId!="");
  	
  	if (oea_mode!='V') {
			document.getElementById('oea-bRechFournisseur').collapsed = (oea_aLignes.nbLignes()>0);
	    document.getElementById('oea-codePays').disabled = (oea_aLignes.nbLignes()>0);
	    document.getElementById('oea-bChercherAdr').disabled = (!fournisseurConnu || oea_aLignes.nbLignes()>0);
		}

		var tauxEscompte = parseFloat(document.getElementById('oea-escompte').value);
		var fraisPort = parseFloat(document.getElementById('oea-fraisPort').value);
		var remise = parseFloat(document.getElementById('oea-remise').value);
		var remiseFP = parseFloat(document.getElementById('oea-remiseFP').value);

		if ((oea_typeRemise=='P'?isTaux(remise):isPositiveOrNull(remise)) && (oea_typeRemiseFP=='P'?isTaux(remiseFP):isPositiveOrNull(remiseFP)) && isTaux(tauxEscompte) && isPositiveOrNull(fraisPort)) {

			if (oea_aLignes.isNotNull()) {
				
				var calculDocument = new CalculDocument();
				if (oea_typeRemise=='P') { calculDocument.setRemiseP(remise); }
				else { calculDocument.setRemiseM(remise); }
				calculDocument.setFraisPortBruts(fraisPort);
				if (oea_typeRemiseFP=='P') { calculDocument.setRemiseFPP(remiseFP); }
				else { calculDocument.setRemiseFPM(remiseFP); }
				calculDocument.setTauxTVAFP(oea_tauxTvaPort);
				calculDocument.setEscompteP(tauxEscompte);
				
				var nbLignes = oea_aLignes.nbLignes();
				for (var i=0; i<nbLignes; i++) {
					if (oea_aLignes.getCellText(i,'oea-colTypeLigne')!="C") {
						var prixUnitaireBrut = oea_aLignes.getCellText(i,'oea-colPU');
						var ristourneP = oea_aLignes.getCellText(i,'oea-colRistourne');
						var commissionP = 0;
						var quantite = oea_aLignes.getCellText(i,'oea-colQuantite');
						var codeTVA = oea_aLignes.getCellText(i,'oea-colCodeTVA');
						calculDocument.ajouterLigneDocument(prixUnitaireBrut, ristourneP, commissionP, quantite, codeTVA);
					}
				}
				
				calculDocument.calculer();
				
				document.getElementById('oea-montantHT').value = calculDocument.getMontantHT();
				document.getElementById('oea-montantRemise').value = calculDocument.getRemiseM();
				document.getElementById('oea-montantFraisPort').value = calculDocument.getFraisPortBruts();
				document.getElementById('oea-montantRemiseFP').value = calculDocument.getRemiseFPM();
				document.getElementById('oea-totalHT').value = calculDocument.getTotalHT();
				document.getElementById('oea-TVA').value = calculDocument.getTotalTVA();
				document.getElementById('oea-montantTTC').value = calculDocument.getMontantTTC();
				document.getElementById('oea-montantEscompte').value = calculDocument.getEscompteM();
				document.getElementById('oea-totalTTC').value = calculDocument.getTotalTTC();
				
				oea_montantHT = calculDocument.getMontantHTSansFormat();
				
				document.getElementById('oea-rowRemiseHT').collapsed = !calculDocument.afficherRemiseM();
				document.getElementById('oea-rowRemiseFPHT').collapsed = !calculDocument.afficherRemiseFPM();
				document.getElementById('oea-rowMontantTTC').collapsed = !calculDocument.afficherEscompteM();
				document.getElementById('oea-rowEscompteHT').collapsed = !calculDocument.afficherEscompteM();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_demandeEnregistrement() {
  try {

		if (oea_modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à l'avoir ?")) {
				oea_enregistrerAvoir();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_afterRefreshArticles() {
	try {

		oea_calculTotaux();
		oea_scrollToRank();

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_scrollToRank() {
	try {
		
		var tb = document.getElementById("oea-articles").treeBoxObject;
		
		if (oea_currentIndex>0) {
			tb.ensureRowIsVisible(oea_currentIndex);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_evaluer(elem, ev) {
	try {

		if (ev.keyCode==13) {
			var nf4 = new NumberFormat("0.00##", false);
			elem.value = nf4.format(calcExpr(elem.value));
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function oea_setModifie(m) {
  try {

  	oea_modifie = m;
  	document.getElementById('oea-bVisualiser').disabled = m;
		if (m) {
			document.getElementById('oea-tabAvoir').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
		}
		else {
			document.getElementById('oea-tabAvoir').setAttribute('image', null);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oea_nouvelAvoir() {
	try {
		oea_mode = "C";
		oea_reinitialiser();
		oea_chargerResponsables(get_cookie("User"));
		oea_calculerTvaPort();
		oea_selectPays();
		oea_debloquerChamps();
	} catch (e) {
		recup_erreur(e);
	}
}



function oea_visualiserAvoir() {
  try {

  	if (isEmpty(document.getElementById('oea-numAvoir').value)) {
			showWarning("Numéro d'avoir incorrect !");
		} else {
			var ok = true;
			if (oea_mode=="M") {
				ok = oea_enregistrerAvoir();
			}

			if (ok) {
				if (oea_aLignes.nbLignes()==0) { showWarning("L'avoir ne contient aucune ligne !"); }
				else if (oea_mode=="V" || window.confirm("Confirmez-vous la génération de l'avoir ?\n(Attention l'avoir généré ne pourra plus être modifié !)")) {
					
					document.getElementById('oea-deckAvoir').selectedIndex=1;
					document.getElementById('bRetourAvoir').collapsed = false;
					
					var qGenPdf = new QueryHttp("Facturation/Factu_Fournisseur/avoir_pdf.tmpl");
					qGenPdf.setParam("Avoir_Id", avoirId);
		      var result = qGenPdf.execute();
		      var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
		      document.getElementById('oea-pdfAvoir').setAttribute("src",page);
				}
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_supprimerAvoir() {
  try {

		if (window.confirm("Confirmez-vous la suppression de l'avoir ?")) {
			
			var qSupprimer = new QueryHttp("Facturation/Avoirs_Fournisseur/supprimerAvoir.tmpl");
			qSupprimer.setParam("Avoir_Id", avoirId);
			qSupprimer.execute();

			showMessage("L'avoir a été supprimé !");

			retourMenuFactures();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_editerCommentaire() {
  try {

		if (oea_aLignes.isSelected()) {
			var i = oea_aLignes.getCurrentIndex();
			var ligneId = oea_aLignes.getCellText(i,'oea-colLigneId');

			var url = "chrome://opensi/content/facturation/user/factu_fournisseur/popup-commentaire.xul?"+ cookie();
      url += "&Ligne_Id="+ ligneId +"&Type_Doc=Avoir_Fournisseur";
    	window.openDialog(url,'','chrome,modal,centerscreen');

    	oea_aLignes.initTree(oea_afterRefreshArticles);
    	oea_ajouterLigne("I");
		}
		else {
			showWarning("Aucun article ou commentaire sélectionné !");
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_editerCommentairesCaches() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-commentaireCache.xul?"+ cookie();
    url += "&Type_Doc=Avoir_Fournisseur&Doc_Id="+ avoirId;
  	window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


function oea_choisirMentions() {
  try {

  	var ok = true;

  	if (oea_mode=="C") {
			ok = oea_enregistrerFacture();
		}

		if (ok) {
			var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Avoir_Fournisseur&Doc_Id="+ avoirId;
    	window.openDialog(url,'','chrome,modal,centerscreen',oea_setModifie);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}


function oea_initVersion() {
	try {
		
		oea_aVersion.setParam("Type_Document", "Avoir_Fournisseur");
		oea_aVersion.setParam("Document_Id", avoirId);
		oea_aVersion.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oea_envoyerMail() {
	try {
		var url = "chrome://opensi/content/facturation/user/factu_fournisseur/popup-envoyerMail.xul?"+ cookie();
		url += "&Doc_Id="+ avoirId +"&Type_Doc=Avoir_Fournisseur";

		window.openDialog(url,'','chrome,modal,centerscreen');
	}
	catch (e) {
    recup_erreur(e);
  }
}


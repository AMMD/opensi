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
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/calculDocument.js");

var mode_tarif;
var mode;//récupéré de l'url par paramValeur
var modele_id;
var initLigne = false;

var editionTTC = false;
var codeTvaPort;
var tauxTvaPort;
var chargerModeReg;
var chargerResp="0";
var typeRemise = 'P';
var typeRemiseFP = 'P';
var modifie = false;
var montantHT = 0;
var montantTTC = 0;

var aLignes = new Arbre("Facturation/GetRDF/articles_modele.tmpl","articles");
var comboResp = new Arbre("ComboListe/combo-responsables.tmpl","Login_Resp");
var comboRegl = new Arbre("ComboListe/combo-modesReglement.tmpl","Mode_Reg");
var comboTVA = new Arbre("Facturation/GetRDF/taux_tva.tmpl","Code_TVA");
var aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "Secteur");


//fonctions qui initialise les combo box et appel l'autre init
function init() {
	try {
		
		bloquerInterface();
		
		calculerTvaPort();
		document.getElementById('TypeFacturation').value="1";
		
		var aCodesTarifs = new Arbre("Facturation/GetRDF/liste_types_tarifs.tmpl", "tarif");
		aCodesTarifs.initTree(initCodeTarif);

	} catch (e) {
    recup_erreur(e);
  }
}

function initCodeTarif() {
	try {
		document.getElementById('tarif').selectedIndex=0;
		setModeTarif();
		aSecteurs.initTree(initSecteur);
	} catch (e) {
		recup_erreur(e);
	}
}

function initSecteur() {
	try {

    document.getElementById('Secteur').selectedIndex = 0;
    comboTVA.initTree(initTVA);

	} catch (e) {
    recup_erreur(e);
  }
}

function initTVA() {
	try {

    document.getElementById('Code_TVA').value = 4;
    init2();

	} catch (e) {
    recup_erreur(e);
  }
}


function chargerResponsables(selection) {
	try {
		chargerResp = selection;
		comboResp.setParam("Selection", selection);
		comboResp.initTree(initResp);
	} catch (e) {
		recup_erreur(e);
	}
}


//fonction qui initialise le mode et charge l'arbre des articles
function init2() {
	try	{

		window.parent.addEventListener("close",demandeEnregistrement,false);

		mode = ParamValeur("Mode");
		if (mode=="C")
			nouveauModele();
		else{
			// chargement

			modele_id = ParamValeur("Modele_Id");
			initLigne = true;
			
			aLignes.setParam("Modele_Id", modele_id);
    	aLignes.initTree(chargerModele);

		}

	} catch (e) {
  	recup_erreur(e);
	}
}

function chargerModesReglements(selection) {
	try {
		chargerModeReg = selection;
		comboRegl.setParam("Selection", chargerModeReg);
		comboRegl.initTree(initMode);
	} catch (e) {
		recup_erreur(e);
	}
}


function calculerTvaPort() {
	try {
		codeTvaPort = getCodeTvaNormal("FR",0,"G");
		tauxTvaPort = getTva(codeTvaPort);
	} catch (e) {
		recup_erreur(e);
	}
}


//fonction qui permet de demander l'enregistrement du modele dans le cas d'une fermeture de page
function desinit() {
	try {

		window.parent.removeEventListener("close",demandeEnregistrement,false);

	} catch (e) {
    recup_erreur(e);
  }
}


//fonction qui initialise la combo box du mode de reglement
function initMode() {
	try {
	   document.getElementById('Mode_Reg').value = chargerModeReg;
	} catch (e) {
    recup_erreur(e);
  }
}
//fonction qui initialise la combo box du responsable
function initResp() {
	try {
		document.getElementById('Login_Resp').value = chargerResp;
	} catch (e) {
    recup_erreur(e);
  }
}


//fonction qui affiche ou non le cadre option de rachat en fonction du type de contrat selectionné
function initRachat() {
	try {
		if (document.getElementById("typeReconduction").value=='1')
			document.getElementById("rowRachat").collapsed=false;
		else {
			document.getElementById("rowRachat").collapsed=true;
			document.getElementById("optionRachat").checked=false;
		}
	}
	catch (e) {
    recup_erreur(e);
  }
}


function evaluer(elem, ev) {
	try {

		if (ev.keyCode==13) {
			var nf4 = new NumberFormat("0.00##", false);
			elem.value = nf4.format(calcExpr(elem.value));
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function switchRemise() {
	try {

		if (typeRemise=='P') {
			document.getElementById('bRemise').setAttribute("class", "bIcoEuro");
			typeRemise = 'M';
		}
		else {
			document.getElementById('bRemise').setAttribute("class", "bIcoPourcentage");
			typeRemise = 'P';
		}
		calculTotaux();
		setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


function switchRemiseFP() {
	try {

		if (typeRemiseFP=='P') {
			document.getElementById('bRemiseFP').setAttribute("class", "bIcoEuro");
			typeRemiseFP = 'M';
		}
		else {
			document.getElementById('bRemiseFP').setAttribute("class", "bIcoPourcentage");
			typeRemiseFP = 'P';
		}
		calculTotaux();
		setModifie(true);

	} catch (e) {
    recup_erreur(e);
  }
}


//fonction qui initialise de le mode tarif utilisé
function setModeTarif() {
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

function debloquerInterface() {
	try {

		document.getElementById('Login_Resp').disabled = false;
		document.getElementById('articles').disabled = false;
		document.getElementById('Reference').disabled = false;
		document.getElementById('Designation').disabled = false;
		document.getElementById('Quantite').disabled = false;
		document.getElementById('PU').disabled = false;
		document.getElementById('Ristourne').disabled = false;
		document.getElementById('Code_TVA').disabled = false;
		document.getElementById('bArticle').disabled = false;
		document.getElementById('bCommentaire').disabled = false;
		document.getElementById('bAnnuler').disabled = false;
		document.getElementById('bValider').disabled = false;
		document.getElementById('Commentaires').disabled = false;
		document.getElementById('imprimerCommentaires').disabled = false;
		document.getElementById('bChoisirMentions').disabled = false;
		document.getElementById('Mode_Reg').disabled = false;
		document.getElementById('bRemise').disabled=false;
		document.getElementById('Remise').disabled=false;
		document.getElementById('Frais_Port').disabled = false;
		document.getElementById('bRemiseFP').disabled = false;
		document.getElementById('RemiseFP').disabled = false;
		document.getElementById('Escompte').disabled = false;
		document.getElementById('EnregistrerModele').disabled = false;
		document.getElementById('tarif').disabled = false;
		document.getElementById('SupprimerModele').disabled=(mode=="C");
		
		if (mode!="M") {
			document.getElementById('RefModele').disabled = false;
			document.getElementById('LibModele').disabled = false;
			document.getElementById('PeriodFactu').disabled = false;
			document.getElementById('TypePeriodicite').disabled = false;
			document.getElementById('DureeContrat').disabled = false;
			document.getElementById('TypeDureeContrat').disabled = false;
	 		document.getElementById('Duree_recon_contrat').disabled=false;
			document.getElementById('Type_duree_recon_contrat').disabled=false;
			document.getElementById('typeReconduction').disabled = false;
			document.getElementById('optionRachat').disabled = false;
			document.getElementById('delaiPreavis').disabled = false;
			document.getElementById('generationFacture').disabled = false;
			document.getElementById('delaiReglement').disabled = false;
			document.getElementById('TypeReglement').disabled = false;
			document.getElementById('jourReglement').disabled = (document.getElementById('TypeReglement').value!="3");
			document.getElementById('TypeFacturation').disabled = false;
			document.getElementById('PrefixeNumContrat').disabled = false;
			document.getElementById('nbPeriodeOfferte').disabled = false;
			document.getElementById('Edition_TTC').disabled = false;
			document.getElementById('Secteur').disabled = false;
		}
		
		debloquerBoutonsMenu();
	} catch (e) {
		recup_erreur(e);
	}
}


function nouveauModele() {
  try {

		var qVenteTTC = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qVenteTTC.execute();

		var venteTTC = (result.responseXML.documentElement.getAttribute('Vente_TTC')==1);

		document.getElementById('Edition_TTC').checked = venteTTC;

		changerTypeEdition(venteTTC);

		mode = "C";
		chargerModesReglements("0");
		chargerResponsables(get_cookie("User"));
		
		document.getElementById('RefModele').value = "";
		document.getElementById('LibModele').value = "";
		document.getElementById('PeriodFactu').value = "";
		document.getElementById('TypePeriodicite').value = "1";
		document.getElementById('DureeContrat').value = "";
		document.getElementById('TypeDureeContrat').value = "1";
		document.getElementById('delaiPreavis').value = "1";
		document.getElementById('generationFacture').value = "";
		document.getElementById('delaiReglement').value = "";
		document.getElementById('TypeReglement').value = "2";
		document.getElementById('Secteur').selectedIndex = 0;

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
		
		montantHT=0;
		montantTTC=0;
		
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

		document.getElementById('tarif').value = 1;
		ajouterLigne("I");
		aLignes.deleteTree();
		initRachat();
		document.getElementById('Creation').label = "";
		document.getElementById('Modification').label = "";
		document.getElementById('Creation').collapsed = true;
		document.getElementById('Modification').collapsed = true;
		document.getElementById('Fiche').label = "";
		
		debloquerInterface();
	}
		catch (e) {
  	recup_erreur(e);
  }
}


//fonction de retour au menu principal
function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}
//fonction de retour à la gestion des modeles
function retourModeles() {
  try {

    window.location = "chrome://opensi/content/facturation/user/abonnement/gestionModeles.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerModele(quit) {
	try
	{
		var ok=false;

		//informations cadre Paramètres modele
		var reference = document.getElementById('RefModele').value;
		var libele = document.getElementById('LibModele').value;
		var PrefixeNumContrat = document.getElementById('PrefixeNumContrat').value;
		var periodicite = document.getElementById('PeriodFactu').value;
		var typePeriodicite = document.getElementById('TypePeriodicite').value;
		var dureeContrat = document.getElementById('DureeContrat').value;
		var typeDureeContrat = document.getElementById('TypeDureeContrat').value;
		var Duree_recon_contrat=document.getElementById('Duree_recon_contrat').value;
		var Type_duree_recon_contrat=document.getElementById('Type_duree_recon_contrat').value;
		var typeContrat = document.getElementById('typeReconduction').value;
		var optionRachat = (document.getElementById('optionRachat').checked?1:0);
 		var delaiPreavis = document.getElementById('delaiPreavis').value;
 		var secteurActivite = document.getElementById('Secteur').value;

		//informations cadre Paramètres facture
		var Util_R = document.getElementById('Login_Resp').value;
		var codeTarifaire = document.getElementById('tarif').value;
		var delaiGenerationFacture = document.getElementById('generationFacture').value;
		var nbPeriodeOfferte = document.getElementById('nbPeriodeOfferte').value;
		var Type_facturation = document.getElementById('TypeFacturation').value;

		//Paramètres reglement
		var delaisReglement = document.getElementById('delaiReglement').value;
		var typeReglement = document.getElementById('TypeReglement').value;
		var valTypeReglement = valeurTypeReglement(typeReglement);


		//Commentaires
		var commentaires = document.getElementById('Commentaires').value;
		var imprimerCommentaires = (document.getElementById('imprimerCommentaires').checked?1:0);

		//informations sur les paramètres
		var modeReglement = document.getElementById('Mode_Reg').value;
		var remise = document.getElementById('Remise').value;
    var remiseFP = document.getElementById('RemiseFP').value;
		var tauxRemise = 0;
		var montantRemise = 0;
		var tauxRemiseFP = 0;
		var montantRemiseFP = 0;
		var fraisPort = document.getElementById('Frais_Port').value;
		var escompte = document.getElementById('Escompte').value;

		var montantBase = (editionTTC?montantTTC:montantHT);

		if (isEmpty(reference)) {showWarning("Vous devez indiquer la référence du modèle avant de l'enregistrer!");}
		else if (isEmpty(libele)) {showWarning("Vous devez indiquer un libellé avant d'enregistrer le modèle !");}
		else if (isEmpty(periodicite) || !isPositiveOrNull(periodicite)) { showWarning("Vous devez indiquer la périodicité de facturation !"); }
		else if (isEmpty(dureeContrat) || !isPositiveOrNull(dureeContrat)) { showWarning("Vous devez indiquer la durée du contrat !"); }
		else if (isEmpty(Duree_recon_contrat) || !isPositiveOrNull(Duree_recon_contrat)) { showWarning("Vous devez indiquer la durée de reconduction du contrat !"); }
		else if (isEmpty(delaiPreavis)|| !isPositiveOrNull(delaiPreavis)) {	showWarning("Vous devez indiquer le délai du préavis !"); }
		else if (isEmpty(delaiGenerationFacture)|| !isPositiveOrNull(delaiGenerationFacture)) {	showWarning("Vous devez indiquer le délai de génération de la facture !"); }
		else if (isEmpty(nbPeriodeOfferte)|| !isPositiveOrNull(nbPeriodeOfferte)) {	showWarning("Vous devez indiquer le nombre de périodes gratuites !"); }
		else if (isEmpty(delaisReglement)|| !isPositiveOrNull(delaisReglement)) {	showWarning("Vous devez indiquer le délai de règlement de la facture !"); }
		else if (modeReglement=="0") { showWarning("Veuillez choisir un mode de règlement !"); }
		else if (isEmpty(remise) || (typeRemise=='P'?!isTaux(remise):!isPositiveOrNull(remise) || parseFloat(remise)>montantBase)) { showWarning("Remise incorrecte !"); }
		else if (isEmpty(fraisPort) || !isPositiveOrNull(fraisPort)) { showWarning("Frais de port incorrects !"); }
		else if (isEmpty(remiseFP) || (typeRemiseFP=='P'?!isTaux(remiseFP):!isPositiveOrNull(remiseFP) || parseFloat(remiseFP)>parseFloat(fraisPort))) { showWarning("Remise sur frais de port incorrecte !"); }
		else if (isEmpty(escompte) || !isTaux(escompte)) { showWarning("Taux d'escompte incorrect !"); }
		else if (dureeInfouEgalePeriodicite(periodicite,typePeriodicite,dureeContrat,typeDureeContrat)) { showWarning("La périodicité doit être inférieure à la durée !"); }
		else if (dureeInfouEgalePeriodicite(periodicite,typePeriodicite,Duree_recon_contrat,Type_duree_recon_contrat)) { showWarning("La périodicité doit être inférieure à la durée de reconduction !"); }
		else if (valTypeReglement==-1) { showWarning("Jour de règlement incorrect !"); }
		else if (referenceDejaExistante(reference) && (mode!="M")) { showWarning("La référence du modèle existe déjà, veuillez en saisir une autre !"); }
		else {
			
			fraisPort = parseFloat(fraisPort);
			remise = parseFloat(remise);
			remiseFP = parseFloat(remiseFP);

			var corps;
			if (mode=="C") {
				corps = cookie() +"&Page=Facturation/Abonnement/creerModele.tmpl&ContentType=xml";
			}
			else {
				corps = cookie() +"&Page=Facturation/Abonnement/modifierModele.tmpl&ContentType=xml&Modele_Id="+ modele_id;
			}
			
			if (typeRemise=='P') {
				tauxRemise = remise;
			}
			else {
				tauxRemise = (montantBase>0?remise/montantBase*100:0);
				montantRemise = remise;
			}
			
			if (typeRemiseFP=='P') {
				tauxRemiseFP = remiseFP;
			}
			else {
				tauxRemiseFP = (fraisPort>0?remiseFP/fraisPort*100:0);
				montantRemiseFP = remiseFP;
			}
			
			corps += "&reference="+ urlEncode(reference);
			corps += "&libelle="+ urlEncode(libele);
			corps += "&Secteur_Activite="+ secteurActivite;
			corps += "&periodicite="+urlEncode(periodicite);
			corps += "&typePeriodicite="+urlEncode(typePeriodicite);
			corps += "&dureeContrat="+urlEncode(dureeContrat);
			corps += "&typeDureeContrat="+ urlEncode(typeDureeContrat);
			corps += "&Duree_recon_contrat="+urlEncode(Duree_recon_contrat);
			corps += "&Type_duree_recon_contrat="+ urlEncode(Type_duree_recon_contrat);
			corps += "&typeContrat="+ urlEncode(typeContrat);
			corps += "&optionRachat=" + urlEncode(optionRachat);
			corps += "&delaiPreavis="+ urlEncode(delaiPreavis);
			corps += "&delaiGenerationFacture=" +urlEncode(delaiGenerationFacture);
			corps += "&delaisReglement=" +urlEncode(delaisReglement);
			corps += "&typeReglement=" +urlEncode(typeReglement);
			corps += "&valTypReglement=" +urlEncode(valTypeReglement);
			corps += "&Util_R=" + Util_R;
			corps += "&codeTarifaire=" +codeTarifaire;
			corps += "&modeReglement=" +modeReglement;
			corps += "&commentaires=" +urlEncode(commentaires);
			corps += "&imprimerCommentaire=" +urlEncode(imprimerCommentaires);
			corps += "&fraisPort=" + fraisPort;
			corps += "&PRemise="+ tauxRemise +"&MRemise="+ montantRemise;
			corps += "&PRemise_FP="+ tauxRemiseFP +"&MRemise_FP="+ montantRemiseFP;
			corps += "&escompte="+ escompte;
			corps += "&Type_facturation=" + urlEncode(Type_facturation);
			corps += "&PrefixeNumContrat=" + urlEncode(PrefixeNumContrat);
			corps += "&nbPeriodeOfferte=" + urlEncode(nbPeriodeOfferte);
			corps += "&Edition_TTC="+ (document.getElementById('Edition_TTC').checked?"1":"0");

			var p=requeteHTTP(corps);
			if (mode=="C") {
				var contenu = p.responseXML.documentElement;
				modele_id = contenu.getAttribute("Modele_Id");
				if (!quit) {
					aLignes.setParam("Modele_Id", modele_id);
					bloquerInterface();
					chargerModele();
				}
			}

			setModifie(false);
			ok = true;
		}
		return ok;

	}	catch(e) {
   	recup_erreur(e);
  }
}

//fonction qui permet de valider une ligne d'article et de l'ajouter dans la table temporaire
//appel enregistrer dans le cas d'une premiere création
function validerLigne() {
  try	{

		if (mode=="C") {
			enregistrerModele(false);
		}
		
		if (modele_id!="" && modele_id!=null && modele_id!=undefined)	{
		
			var type_ligne = document.getElementById("Type_Ligne").value;
			var reference = document.getElementById("Reference").value;
			var designation = document.getElementById("Designation").value;
			var quantite = document.getElementById("Quantite").value;
			var pu = document.getElementById("PU").value;
			var ristourne = document.getElementById("Ristourne").value;
			var code_tva = document.getElementById("Code_TVA").value;
			var ligneId = document.getElementById("Ligne_Id").value;
			var libelle = document.getElementById("Libelle").value;

			if (mode_ligne=="C") {
				var corps = cookie() +"&Page=Facturation/Abonnement/ajouterArticle.tmpl&ContentType=xml&type=modele";
			}
			else {
				var corps = cookie() +"&Page=Facturation/Abonnement/modifierArticle.tmpl&ContentType=xml&type=modele";
				corps += "&Ligne_Id="+ ligneId;
			}

			corps += "&Reference="+ urlEncode(reference) +"&Designation="+ urlEncode(designation) +"&Quantite="+ quantite +"&Type_Ligne="+ type_ligne;
			corps += "&Prix="+ pu +"&Ristourne="+ ristourne +"&Code_TVA="+ code_tva +"&Identifiant="+ modele_id +"&Libelle="+ urlEncode(libelle);

			if (isEmpty(designation)) { showWarning("Désignation de l'article manquante !");	}
			//else if (type_ligne=="I" && isEmpty(reference)) { showWarning("Référence de l'article manquante !");	}
			else if (!checkQte(quantite)) { showWarning("Quantité incorrecte !");	}
			else if (isEmpty(pu) || !isPositiveOrNull(pu) || !checkDecimal(pu,4)) { showWarning("Prix unitaire incorrect !");	}
			else if (isEmpty(ristourne) || !isTaux(ristourne)) { showWarning("Taux de ristourne incorrect !");	}
			else {
				requeteHTTP(corps);
				ajouterLigne("I");
				aLignes.initTree(calculTotaux);
			}
		}
	} catch (e) {
  	recup_erreur(e);
	}
}

//fonction qui permet d'enregistrer si l'utilisateur quitte sans avoir enregistré
function demandeEnregistrement() {
  try {
		if (modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées au modèle ?")) {
				enregistrerModele(true);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}

//supprime le modele si il existe sinon fait que la redirection vers la page de gestion des modeles
function supprimerModele() {
	try	{

		if (window.confirm("Voulez-vous vraiment supprimer le modèle ?"))	{
			if (modele_id!="" && modele_id!=null && modele_id!=undefined)	{
				var qSupprimer = new QueryHttp("Facturation/Abonnement/supprimerModele.tmpl");
				qSupprimer.setParam("Modele_Id", modele_id);
				var result = qSupprimer.execute();
				if (result.responseXML.documentElement.getAttribute("codeErreur")=="0") {
					showMessage("Le modèle a été supprimé !");
					retourModeles();
				} else {
					showMessage("Le modèle ne peut pas être supprimé car il est utilisé par des abonnements !");
				}
			}
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


//fonction qui charge les informations d'un modele
function chargerModele() {
  try {
		mode = "M";
		var corps = cookie() +"&Page=Facturation/Abonnement/getModele.tmpl&ContentType=xml&Modele_Id="+ modele_id;

		var p = requeteHTTP(corps);

		var contenu = p.responseXML.documentElement;
		//informations cadre Paramètres modele
		document.getElementById('RefModele').value = contenu.getAttribute('Reference_modele');
		document.getElementById('LibModele').value = contenu.getAttribute('Libelle_modele');
		document.getElementById('PrefixeNumContrat').value = contenu.getAttribute('PrefixeNumContrat');
		document.getElementById('PeriodFactu').value = contenu.getAttribute('Periodicite');
		document.getElementById('TypePeriodicite').value = contenu.getAttribute('Type_periodicite');
		document.getElementById('DureeContrat').value = contenu.getAttribute('Duree_contrat');
		document.getElementById('TypeDureeContrat').value = contenu.getAttribute('Type_duree_contrat');
		document.getElementById('Duree_recon_contrat').value= contenu.getAttribute('Duree_recon_contrat');
 		document.getElementById('Type_duree_recon_contrat').value=contenu.getAttribute('Type_duree_recon_contrat');
		document.getElementById('typeReconduction').value = contenu.getAttribute('Type_contrat');
		document.getElementById('Secteur').value = contenu.getAttribute('Secteur_Activite');
		document.getElementById('optionRachat').checked=(contenu.getAttribute('OptionRachat')!=0);
		document.getElementById('delaiPreavis').value = contenu.getAttribute('Delai_preavis');
		initRachat();

		//informations cadre Paramètres facture
		document.getElementById('tarif').value = contenu.getAttribute('Code_Tarif');
		chargerResponsables(contenu.getAttribute('Util_R'));
		document.getElementById('generationFacture').value = contenu.getAttribute('Delai_gen_facture');
		document.getElementById('nbPeriodeOfferte').value = contenu.getAttribute('nbPeriodeOfferte');
		document.getElementById('TypeFacturation').value=(contenu.getAttribute('Type_facturation')==1?"1":"2");

		//Paramètres reglement
		document.getElementById('delaiReglement').value = contenu.getAttribute('Delais_reglement');
		switch (contenu.getAttribute('Type_reglement')) {
			case "1":document.getElementById('TypeReglement').value="1";break;
			case "2":document.getElementById('TypeReglement').value="2";break;
			default :document.getElementById('TypeReglement').value="3";break;
		}

		if (contenu.getAttribute('Val_type_reglement')=="0")
			document.getElementById('jourReglement').value = contenu.getAttribute('');
		else
			document.getElementById('jourReglement').value = contenu.getAttribute('Val_type_reglement');

		//commentaires
		document.getElementById('Commentaires').value = contenu.getAttribute('Commentaires');
		document.getElementById('imprimerCommentaires').checked=(contenu.getAttribute('Com_ds_facture')!="0");

		//informations sur les paramètres
		chargerModesReglements(contenu.getAttribute('Mode_reglement'));
		document.getElementById('Escompte').value = contenu.getAttribute('Escompte');
		document.getElementById('Frais_Port').value = contenu.getAttribute('Frais_Port');
		
		document.getElementById('Remise').value = contenu.getAttribute('Remise');
		typeRemise = contenu.getAttribute('TypeRemise');
		document.getElementById('bRemise').setAttribute("class", (typeRemise=='P'?"bIcoPourcentage":"bIcoEuro"));
		document.getElementById('RemiseFP').value = contenu.getAttribute('RemiseFP');
		typeRemiseFP = contenu.getAttribute('TypeRemise_FP');
		document.getElementById('bRemiseFP').setAttribute("class", (typeRemiseFP=='P'?"bIcoPourcentage":"bIcoEuro"));

		var typeEdition = (contenu.getAttribute('Edition_TTC')=="1");
		document.getElementById('Edition_TTC').checked = typeEdition;

		//Champ en bas de la page + champ caché
		document.getElementById('Creation').label = "Modele créé le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur');
		document.getElementById('Modification').label = "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj');
		document.getElementById('Fiche').label = "Modele N° "+ contenu.getAttribute('Modele_Id');
		document.getElementById('Creation').collapsed = false;
		document.getElementById('Modification').collapsed = false;
		document.getElementById('SupprimerModele').disabled=false;
		setModifie(false);

		debloquerInterface();
		
		changerTypeEdition(typeEdition);

	}	catch (e) {
    recup_erreur(e);
  }
}

//fonction qui charge les informations concernant un article
function ajouterLigne(type_ligne) {
  try {

		document.getElementById('bSupprimer').disabled = true;
		mode_ligne = "C";
		document.getElementById("Type_Ligne").value = type_ligne;
		document.getElementById("Ligne_Id").value = "";
		formatLigne(type_ligne);
		switch(type_ligne) {
			case "S":

				var reference = document.getElementById("Reference").value;
				if (!isEmpty(reference))
				{
					//if (mode=="C" || !dejaPresente(reference)) {
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
								document.getElementById("Code_TVA").value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"),"FR",false,"G");
								document.getElementById("Tarif_Id").value = "";
								document.getElementById("Libelle").value = contenu.getAttribute("Libelle");
							}
							else
							{
								ajouterLigne("I");
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
							document.getElementById("Code_TVA").value = getCodeTvaCorrespondant(contenu.getAttribute("Code_TVA"),"FR",false,"G");
							document.getElementById("Libelle").value = "";
						}
				}
				else {
					ajouterLigne("I");
				}

				break;

			case "I":

				document.getElementById('Reference').value = "";
				document.getElementById('Designation').value = "";
				document.getElementById('Quantite').value = 1;
				document.getElementById('PU').value = "";
				document.getElementById('Ristourne').value = "0.00";
				document.getElementById('Code_TVA').value = getCodeTvaNormal("FR",false,"G");
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


//fonction qui initialise les valeurs des champs de l'article
function formatLigne(type_ligne) {
  try {

		switch(type_ligne) {
			case "S":
				document.getElementById('Reference').disabled = true;
				document.getElementById('Designation').disabled = true;
				document.getElementById('Quantite').disabled = false;
				document.getElementById('PU').disabled = false;
				document.getElementById('Ristourne').disabled = false;
				document.getElementById('Code_TVA').disabled = false;
				document.getElementById('bValider').disabled = false;
				document.getElementById('bAnnuler').disabled = false;
				break;

			case "I":
				document.getElementById('Reference').disabled = false;
				document.getElementById('Designation').disabled = false;
				document.getElementById('Quantite').disabled = false;
				document.getElementById('PU').disabled = false;
				document.getElementById('Ristourne').disabled = false;
				document.getElementById('Code_TVA').disabled = false;
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
				document.getElementById("Ligne_Id").value = "";
				document.getElementById('Code_TVA').value = getCodeTvaNormal("FR",false,"G");
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

//fonction qui calcul le total des articles present dans l'arbre
function calculTotaux() {
  try {

		var tree = document.getElementById("articles");
		document.getElementById('Edition_TTC').disabled = (tree.view==null || tree.view.rowCount>0);
		document.getElementById('tarif').disabled = (tree.view==null || tree.view.rowCount>0);

		var remise = parseFloat(document.getElementById('Remise').value);
		var remiseFP = parseFloat(document.getElementById('RemiseFP').value);
		var taux_escompte = parseFloat(document.getElementById('Escompte').value);
		var frais_port = parseFloat(document.getElementById('Frais_Port').value);

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
					
					montantTTC = calculDocument.getMontantTTCSansFormat();
					
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
					
					montantHT = calculDocument.getMontantHTSansFormat();
					montantTTC = calculDocument.getMontantTTCSansFormat();
					
					document.getElementById('rowRemiseHT').collapsed = !calculDocument.afficherRemiseM();
					document.getElementById('rowRemiseFPHT').collapsed = !calculDocument.afficherRemiseFPM();
					document.getElementById('rowMontantTTC').collapsed = !calculDocument.afficherEscompteM();
					document.getElementById('rowEscompteHT').collapsed = !calculDocument.afficherEscompteM();
				}
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function pressOnReference(ev) {
	try {

		if (ev.keyCode==13) {
			rechercherReference();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function rechercherStock(reference) {
	try {

		var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
		if (reference != null) { url += "&Reference="+ urlEncode(reference); }
    window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherStock);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourRechercherStock(reference) {
	try {

		document.getElementById('Reference').value = reference;
		ajouterLigne("S");

	} catch (e) {
    recup_erreur(e);
  }
}


function rechercherReference() {
	try {

		var reference = document.getElementById('Reference').value;
		
		var qExArt = new QueryHttp("Facturation/Recherches/rechReference.tmpl");
		qExArt.setParam("Reference", reference);
		var result = qExArt.execute();

		var articleId = result.responseXML.documentElement.getAttribute("Article_Id");

		if (!isEmpty(articleId)) {
			document.getElementById('Reference').value = articleId;
			ajouterLigne("S");
		} else {
			rechercherStock(reference);
		}

	} catch (e) {
    recup_erreur(e);
  }
}



//fonction qui charge les informations d'un article selectionné dans l'arbre
function ouvrirLigne() {
  try {

		var tree = document.getElementById("articles");

		if (tree.view!=null && tree.currentIndex!=-1 && mode=="M") {

			if (getCellText(tree,tree.currentIndex,'ColType_Ligne')=="C") {
				ajouterLigne("I");
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

				formatLigne(document.getElementById("Type_Ligne").value);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}
//fonction qui efface tout les champs d'un article
function annulerLigne() {
  try {

  	aLignes.select(-1);
		ajouterLigne("I");

	} catch (e) {
  	recup_erreur(e);
	}
}
//fonction qui supprime un article selectionné
function supprimerLigne() {
  try {

		var ligneId = document.getElementById("Ligne_Id").value;

		var corps = cookie() +"&Page=Facturation/Abonnement/supprimerArticle.tmpl&ContentType=xml&type=modele&Ligne_Id="+ ligneId;
		requeteHTTP(corps);

		ajouterLigne("I");
		aLignes.initTree(calculTotaux);

	} catch (e) {
  	recup_erreur(e);
	}
}
//fonction qui permet d'editer un commentaire pour un article selectionné
function editerCommentaire() {
	try 
	{
		var tree = document.getElementById("articles");

		if (tree.view!=null && tree.currentIndex!=-1)
		{

			var ligneId = getCellText(tree,tree.currentIndex,'ColLigne_Id');

			var page ="chrome://opensi/content/facturation/user/abonnement/commentaire.xul?" + cookie()+"&Type=modele&Ligne_Id="+ ligneId;
			window.openDialog(page,'','chrome,modal,centerscreen');

			aLignes.initTree(calculTotaux);
			ajouterLigne("I");
		}
		else
		{
			showWarning("Aucun article ou commentaire sélectionné !");
		}
	}
	catch (e) {
    recup_erreur(e);
  }
}

//fonction qui permet d'ouvrir un commentaire
function ouvrirCommentaire() {
  try {

		var tree = document.getElementById("articles");

		if (tree.view!=null && tree.currentIndex!=-1 && mode=="M") {

			if (getCellText(tree,tree.currentIndex,'ColType_Ligne')=="C") {
				editerCommentaire();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


//fonction qui verifie que periodicite<contrat . La fonction calcul le nombre de jour correspond a la durre
//(1semaine=7 jour, 1 mois=30 jour, 1 an = 360) et compare ces 2 nombres.
function dureeInfouEgalePeriodicite(periodicite,typePeriodicite,dureeContrat,typeDureeContrat) {
	try	{
		//pour Periodicite
		var nbJourPeriodicite;
		if (typePeriodicite==1) //jours
		{
			nbJourPeriodicite=periodicite;
		}
		else if (typePeriodicite==2) //semaines
		{
			nbJourPeriodicite=periodicite*7;
		}
		else if (typePeriodicite==3) //mois
		{
			nbJourPeriodicite=periodicite*30;
		}
		else //année
		{
			nbJourPeriodicite=periodicite*360;
		}

		//pour duree
		var nbJourDureeContrat;
		if (typeDureeContrat==1) //jours
		{
			nbJourDureeContrat=dureeContrat;
		}
		else if (typeDureeContrat==2) //semaines
		{
			nbJourDureeContrat=dureeContrat*7;
		}
		else if (typeDureeContrat==3) //mois
		{
			nbJourDureeContrat=dureeContrat*30;
		}
		else
		{
			nbJourDureeContrat=dureeContrat*360;
		}
		return (parseIntBis(nbJourDureeContrat)<parseIntBis(nbJourPeriodicite));

	}	catch(e) {
   	recup_erreur(e);
  }
}

//si le type de reglement est fin de mois le, retourne la valeur du champ jourReglement, sinon retourne 0 ou -1 si le
//champ est vide
function valeurTypeReglement(typeReglement) {
	try	{

		if (typeReglement==3)
		{
			var valeurTypeReglement = document.getElementById('jourReglement').value;
			if (isEmpty(valeurTypeReglement)|| !isPositiveOrNull(valeurTypeReglement) || valeurTypeReglement>30 )
			{
				return -1;
			}
			else
			{
				return  valeurTypeReglement;
			}
		}
		else
		{
			return 0;
		}

	}	catch(e) {
   	recup_erreur(e);
  }
}

//fonction gere la modification du champ modifie et du label de la groupBox
function setModifie(m) {
  try {

  	modifie = m;
		if (m) {
			document.getElementById('Param_modele').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
		}
		else {
			document.getElementById('Param_modele').setAttribute('image', null);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


//fonction qui verifie si la reference saisie n'existe pas dans la base
function referenceDejaExistante(reference) {
	try	{

		var corps = cookie() +"&Page=Facturation/Abonnement/referenceDejaExistante.tmpl&ContentType=xml&Reference=" +reference;
		var p = requeteHTTP(corps);

		return (p.responseXML.documentElement.getAttribute("msg")=="true");

	}	catch(e) {
		recup_erreur(e);
	}
}

function enableJourReglement() {
	try {
		document.getElementById('jourReglement').disabled=(document.getElementById('TypeReglement').value!="3");
	}	catch(e) {
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

		calculTotaux();

	}	catch(e) {
		recup_erreur(e);
	}
}


function choisirMentions() {
  try {

  	var ok = true;

  	if (mode=="C") {
			ok = enregistrerModele(true);
		}

		if (ok) {
			var url = "chrome://opensi/content/facturation/user/commun/popup-choix_mentions.xul?"+ cookie() +"&Type_Doc=Modele&Doc_Id="+ modele_id;
    	window.openDialog(url,'','chrome,modal,centerscreen',setModifie);
		}

	} catch (e) {
  	recup_erreur(e);
  }
}



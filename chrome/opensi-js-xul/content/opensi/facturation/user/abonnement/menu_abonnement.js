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

//2 modes dans la page : C = creation, M = modification,
//4 etat : A=en attente, C=en cours, R=résilié, T=terminé



jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/lib_tva.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/calculDocument.js");


var mode;
var etat;
var assujettiTVA = false;
var zoneUE = false;
var editionTTC = false;

var global_modele_id;
var global_client_id = "";
var global_code_tarif;

var abonnementId;
var global_mode_reglement = "";
var global_resp = "0";

var modification = true;
var init = true;
var temp = true;
var verrou = false;
var globalvaleur;
var globalvaleurTTC;
var optionRachat;

var currentTotalHT = 0;
var currentTotalHTFP = 0;
var currentMontantTTC = 0;

var modele_id;

var treeEcheancier = new Arbre("Facturation/GetRDF/echeance.tmpl","Echeancier");


function menu_abonnement_init() {
	try	{

		mode = ParamValeur("Mode");
		window.parent.addEventListener("close",menu_abonnement_demandeEnregistrement,false);
		if (mode=="C") {
			modele_id="";
			var url = "chrome://opensi/content/facturation/user/abonnement/rechModele.xul?"+ cookie();
			window.openDialog(url,'','chrome,modal,centerscreen',menu_abonnement_retourModele_Id);
			menu_abonnement_retourModele_Id2();
		} else if (mode=="M") {
			abonnementId = ParamValeur("Abonnement_Id");
		}

		if ((global_modele_id!="" && global_modele_id!=null && global_modele_id!=undefined) || mode=="M")	{
			Echeancier_init();
			Parametre_abonnement_init();
			FactureType_init();

			if (mode=="M") {
				window.setTimeout(menu_abonnement_chargerAbonnement,500);
			}
			else {
				if (global_modele_id!=0) { menu_abonnement_chargerModele(); }
				else { FactureType_chargerModesReglements("0"); }
			}
			menu_abonnement_initBoutons(0);
		}

	}	catch (e) {
    recup_erreur(e);
  }
}

//fonction qui recupere le modele_id de la page rech_modele et initialise le mode
function menu_abonnement_retourModele_Id(mid) {
	try	{
		modele_id=mid;
	}	catch(e) {
  	recup_erreur(e);
	}
}

function menu_abonnement_retourModele_Id2() {
	try	{
		if (modele_id=="null") {
			menu_abonnement_retour_gestion_abonnement();
		} else if (modele_id=="nouveauModele") {
			window.location = "chrome://opensi/content/facturation/user/abonnement/nouveauModele.xul?"+ cookie() +"&Mode=C";
		}
		else {
			global_modele_id=modele_id;
		}
	}	catch(e) {
  	recup_erreur(e);
	}
}


//fonction qui gere les boutons en bas de la page en fonction de l'onglet selectionné
function menu_abonnement_initBoutons(page) {
	try {

		if (page==0) {
			document.getElementById('bEnregistrer').collapsed=false;
			document.getElementById('Supprimer').collapsed=(mode=='C');
			document.getElementById('reconduireAbonnement').collapsed=(document.getElementById('typeReconduction').value=="2");
			document.getElementById('ResilierAbonnement').collapsed=(mode=='C');
			document.getElementById('AnnulerResiliation').collapsed=true;
			document.getElementById('imprimerAbo').collapsed=(mode=='C');
			menu_abonnement_disableBouton();
		}
		else if (page==2) {
			document.getElementById('bEnregistrer').collapsed=true;
			document.getElementById('Supprimer').collapsed=true;
			document.getElementById('reconduireAbonnement').collapsed=true;
			document.getElementById('ResilierAbonnement').collapsed=true;
			document.getElementById('AnnulerResiliation').collapsed=true;
			document.getElementById('imprimerAbo').collapsed=true;
		}
		else {
			document.getElementById('bEnregistrer').collapsed=false;
			document.getElementById('Supprimer').collapsed=(mode=='C');
			document.getElementById('reconduireAbonnement').collapsed=true;
			document.getElementById('ResilierAbonnement').collapsed=true;
			document.getElementById('AnnulerResiliation').collapsed=true;
			document.getElementById('imprimerAbo').collapsed=true;
			menu_abonnement_disableBouton();
		}

	}	catch(e) {
	  recup_erreur(e);
  }
}


//fonction qui gere les boutons en bas de la page en fonction de l'etat des abonnements
function menu_abonnement_disableBouton() {
	try {

		if (mode=="C" || (mode=="M" && etat=="A")) {
			document.getElementById('bEnregistrer').disabled = false;
			document.getElementById('Supprimer').disabled = false;
			document.getElementById('reconduireAbonnement').disabled = true;
			document.getElementById('ResilierAbonnement').disabled = true;
			if (mode=="C")
				document.getElementById('imprimerAbo').disabled = true;
			else
				document.getElementById('imprimerAbo').disabled = false;
		}
		else if (mode=="M" && etat=="R") {
			document.getElementById('bEnregistrer').disabled = true;
			document.getElementById('Supprimer').disabled = false;
			document.getElementById('reconduireAbonnement').disabled = true;
			document.getElementById('ResilierAbonnement').disabled = true;
			document.getElementById('AnnulerResiliation').collapsed=false;
			document.getElementById('imprimerAbo').disabled = false;
		}
		else if (mode=="M" && etat=="C") {
			document.getElementById('bEnregistrer').disabled = false;
			document.getElementById('Supprimer').disabled = true;
			document.getElementById('reconduireAbonnement').disabled = false;
			document.getElementById('ResilierAbonnement').disabled = false;
			document.getElementById('imprimerAbo').disabled = false;
		}
		else if (mode=="M" && etat=="T") {
			document.getElementById('bEnregistrer').disabled = true;
			document.getElementById('Supprimer').disabled = true;
			document.getElementById('reconduireAbonnement').disabled = false;
			document.getElementById('ResilierAbonnement').disabled = true;
			document.getElementById('imprimerAbo').disabled = false;
		}

	}	catch(e) {
	  recup_erreur(e);
  }
}


//fonction qui permet de demander l'enregistrement de l'abonnement dans le cas d'une fermeture de page
function menu_abonnement_desinit() {
	try {

		window.parent.removeEventListener("close",menu_abonnement_demandeEnregistrement,false);

	} catch (e) {
    recup_erreur(e);
  }
}



function menu_abonnement_setModifie(m) {
  try {
  	
  	if (m) {
			document.getElementById('Modifie').value = "y";
			document.getElementById('Param_abonnement').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
			document.getElementById('FactureType').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
		}
		else {
			document.getElementById('Modifie').value = "n";
			document.getElementById('Param_abonnement').setAttribute('image', null);
			document.getElementById('FactureType').setAttribute('image', null);
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function menu_abonnement_setEtat(e) {
  try {
  	
  	etat = e;
  	var libelle = "";
  	switch (e) {
  		case 'A': libelle = "en attente"; break;
  		case 'C': libelle = "en cours"; break;
  		case 'T': libelle = "terminé"; break;
  		case 'R': libelle = "résilié"; break;
  	}
  	
  	document.getElementById('etatContrat').value = libelle;

	} catch (e) {
  	recup_erreur(e);
	}
}



//fonction de retour au menu principal
function menu_abonnement_retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


//fonction de retour à la gestion des abonnements
function menu_abonnement_retour_gestion_abonnement() {
	 try {

    window.location = "chrome://opensi/content/facturation/user/abonnement/gestionAbonnement.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


//fonction qui enregistre l'abonnement (ne charge pas l'abonnement apres dans le cas d'un enregistrement avant de quitter)
//et ne verifie pas la presence d'article dans le cas de l'ajout d'un article
function menu_abonnement_enregistrerTout(quit,ValiderArticle) {
	try {
		var ok=false;
		//on met un verrou dans le cas ou l'utilisateur clique trop vite sur enregistrer (l'arbre n'a pas le temps de se charger)
		if (!verrou) {
			verrou = true;
			var arbre = document.getElementById('articles');
			if (arbre.view.rowCount!=0 || ValiderArticle)	{
				
				//cadre parametres abonnement
				var PrefixeNumContrat = document.getElementById('numContrat').value;
				var libelle = document.getElementById('Libelle_abo').value;
				var periodicite = document.getElementById('PeriodFactu').value;
				var typePeriodicite = document.getElementById('TypePeriodicite').value;
				var dureeContrat = document.getElementById('DureeContrat').value;
				var typeDureeContrat = document.getElementById('TypeDureeContrat').value;
				var Duree_recon_contrat=document.getElementById('Duree_recon_contrat').value;
				var Type_duree_recon_contrat=document.getElementById('Type_duree_recon_contrat').value;
				var dateDebut = document.getElementById('dateDeb').value;
				var dateFin = document.getElementById('dateFin').value;
				var typeContrat = document.getElementById('typeReconduction').value;
				var secteurActivite = document.getElementById('Secteur').value;
				optionRachat = 0;
				var pourcentage = 0;
				globalvaleur = 0;
				globalvaleurTTC = 0;
				if (typeContrat=="1" && document.getElementById('optionRachat').checked){
					optionRachat = 1 ;
		 			pourcentage = document.getElementById('pourcentage').value;
					globalvaleur =  document.getElementById('valeur').value;
					globalvaleurTTC = document.getElementById('valeurTTC').value;
				}
				var delaiPreavis = document.getElementById('delaiPreavis').value;
				var delaiGenerationFacture = document.getElementById('generationFacture').value;
				var nbPeriodeOfferte = document.getElementById('nbPeriodeOfferte').value;
				var Type_facturation = document.getElementById('TypeFacturation').value;

				//information cadre reglement
				var delaisReglement = document.getElementById('delaiReglement').value;
				var typeReglement = document.getElementById('TypeReglement').value;
				var valTypeReglement = Parametre_abonnement_valeurTypeReglement(typeReglement);

				//informations cadre client
				var denomination_fact = document.getElementById('Denomination_Fact').value;
				var adresse_1_fact = document.getElementById('Adresse_1_Fact').value;
				var adresse_2_fact = document.getElementById('Adresse_2_Fact').value;
				var adresse_3_fact = document.getElementById('Adresse_3_Fact').value;
				var code_postal_fact = document.getElementById('Code_Postal_Fact').value;
				var ville_fact = document.getElementById('Ville_Fact').value;
				var code_pays_fact = document.getElementById('Code_Pays_Fact').value;
				var civ_inter_fact = document.getElementById("Civ_Inter_Fact").value;
				var nom_inter_fact = document.getElementById("Nom_Inter_Fact").value;
				var prenom_inter_fact = document.getElementById("Prenom_Inter_Fact").value;
				var tel_inter_fact = document.getElementById("Tel_Inter_Fact").value;
				var fax_inter_fact = document.getElementById('Fax_Inter_Fact').value;
				var email_inter_fact = document.getElementById('Email_Inter_Fact').value;

				var denomination_liv = document.getElementById('Denomination_Liv').value;
				var adresse_1_liv = document.getElementById('Adresse_1_Liv').value;
				var adresse_2_liv = document.getElementById('Adresse_2_Liv').value;
				var adresse_3_liv = document.getElementById('Adresse_3_Liv').value;
				var code_postal_liv = document.getElementById('Code_Postal_Liv').value;
				var ville_liv = document.getElementById('Ville_Liv').value;
				var code_pays_liv = document.getElementById('Code_Pays_Liv').value;
				var civ_inter_liv = document.getElementById("Civ_Inter_Liv").value;
				var nom_inter_liv = document.getElementById("Nom_Inter_Liv").value;
				var prenom_inter_liv = document.getElementById("Prenom_Inter_Liv").value;
				var tel_inter_liv = document.getElementById("Tel_Inter_Liv").value;
				var fax_inter_liv = document.getElementById('Fax_Inter_Liv').value;
				var email_inter_liv = document.getElementById('Email_Inter_Liv').value;
				
				var denomination_envoi = document.getElementById('Denomination_Envoi').value;
				var adresse_1_envoi = document.getElementById('Adresse_1_Envoi').value;
				var adresse_2_envoi = document.getElementById('Adresse_2_Envoi').value;
				var adresse_3_envoi = document.getElementById('Adresse_3_Envoi').value;
				var code_postal_envoi = document.getElementById('Code_Postal_Envoi').value;
				var ville_envoi = document.getElementById('Ville_Envoi').value;
				var code_pays_envoi = document.getElementById('Code_Pays_Envoi').value;
				
				var civ_inter_envoi = document.getElementById("Civ_Inter_Envoi").value;
				var nom_inter_envoi = document.getElementById("Nom_Inter_Envoi").value;
				var prenom_inter_envoi = document.getElementById("Prenom_Inter_Envoi").value;
				var tel_inter_envoi = document.getElementById("Tel_Inter_Envoi").value;
				var fax_inter_envoi = document.getElementById('Fax_Inter_Envoi').value;
				var email_inter_envoi = document.getElementById('Email_Inter_Envoi').value;

				var num_tva = assujettiTVA?document.getElementById('Num_TVA').value:"";
				
				var Code_tarif = document.getElementById('tarif').value;
				var Commentaires = document.getElementById('Commentaires').value;
				var modeReglement = document.getElementById('Mode_Reg').value;
				var remise = document.getElementById('Remise').value;
				var remiseFP = document.getElementById('RemiseFP').value;
				var tauxRemise = 0;
				var montantRemise = 0;
				var tauxRemiseFP = 0;
				var montantRemiseFP = 0;
				var fraisPort = document.getElementById('Frais_Port').value;
				var escompte = document.getElementById('Escompte').value;
				
				var montantBase = (editionTTC?currentMontantTTC:currentTotalHT);

				var Util_R = document.getElementById('Login_Resp').value;

				if (Parametre_abonnement_CoherenceValeur())
				{
					//calcul de la date de preavis apres voir verifié la coherence des valeurs saisie
					var Date_du_preavis = Parametre_abonnement_date_delai_preavis(dateFin,delaiPreavis)
					if (valTypeReglement!=-1)
					{
						if (modeReglement=="0") { showWarning("Veuillez choisir un mode de règlement !"); }
						else if (isEmpty(remise) || (typeRemise=='P'?!isTaux(remise):!isPositiveOrNull(remise) || parseFloat(remise)>montantBase)) { showWarning("Remise incorrecte !"); }
						else if (isEmpty(fraisPort) || !isPositiveOrNull(fraisPort)) { showWarning("Frais de port incorrects !"); }
						else if (isEmpty(remiseFP) || (typeRemiseFP=='P'?!isTaux(remiseFP):!isPositiveOrNull(remiseFP) || parseFloat(remiseFP)>parseFloat(fraisPort))) { showWarning("Remise sur frais de port incorrecte !"); }
						else if (isEmpty(escompte) || !isTaux(escompte)) { showWarning("Taux d'escompte incorrect !"); }
						else {
							
							fraisPort = parseFloat(fraisPort);
							remise = parseFloat(remise);
							remiseFP = parseFloat(remiseFP);

							var corps;
			
							if (assujettiTVA && code_pays_liv!="FR" && isEmpty(num_tva) && zoneUE) {
								showWarning("Attention : vous n'avez pas saisi le numéro de tva intra-communautaire !");
							}
			
							if (mode=="C")
							{
									corps = cookie() +"&Page=Facturation/Abonnement/creerAbonnement.tmpl&ContentType=xml";
									corps += "&modele_id="+ urlEncode(global_modele_id);
							}
							else
							{
									corps = cookie()+"&Page=Facturation/Abonnement/modifierAbonnement.tmpl&ContentType=xml&Abonnement="+abonnementId;
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
							
							corps += "&PrefixeNumContrat="+ urlEncode(PrefixeNumContrat);
			      	corps += "&libelle="+ urlEncode(libelle);
							corps += "&periodicite="+urlEncode(periodicite);
							corps += "&typePeriodicite="+urlEncode(typePeriodicite);
							corps += "&dureeContrat="+urlEncode(dureeContrat);
							corps += "&typeDureeContrat="+ urlEncode(typeDureeContrat);
							corps += "&Duree_recon_contrat="+urlEncode(Duree_recon_contrat);
							corps += "&Type_duree_recon_contrat="+ urlEncode(Type_duree_recon_contrat);
							corps += "&dateDebut=" + prepareDateJava(dateDebut);
							corps += "&dateFin=" + prepareDateJava(dateFin);
							corps += "&typeContrat="+ urlEncode(typeContrat);
							corps += "&optionRachat=" + urlEncode(optionRachat);
							corps += "&pourcentage="+urlEncode(pourcentage);
							corps += "&valeur="+urlEncode(globalvaleur);
							corps += "&delaiPreavis="+ urlEncode(delaiPreavis);
							corps += "&Date_du_preavis="+urlEncode(prepareDateJava(Date_du_preavis));
							corps += "&delaiGenerationFacture=" +urlEncode(delaiGenerationFacture);
							corps += "&delaisReglement=" +urlEncode(delaisReglement);
							corps += "&typeReglement=" +urlEncode(typeReglement);
							corps += "&valTypReglement=" +urlEncode(valTypeReglement);
							corps += "&Secteur_Activite="+ secteurActivite;
			
							corps += "&Denomination="+ urlEncode(denomination_fact);
							corps += "&Adresse="+ urlEncode(adresse_1_fact);
							corps += "&Comp_Adresse="+ urlEncode(adresse_2_fact);
							corps += "&Adresse_3="+ urlEncode(adresse_3_fact);
							corps += "&Code_Postal="+ urlEncode(code_postal_fact);
							corps += "&Ville="+ urlEncode(ville_fact);
							corps += "&Code_Pays="+ urlEncode(code_pays_fact);
							corps += "&Civ_Inter="+ urlEncode(civ_inter_fact);
							corps += "&Nom_Inter="+ urlEncode(nom_inter_fact);
							corps += "&Prenom_Inter="+ urlEncode(prenom_inter_fact);
							corps += "&Tel_Inter="+ urlEncode(tel_inter_fact);
							corps += "&Fax_Inter="+ urlEncode(fax_inter_fact);
							corps += "&Email_Inter="+ urlEncode(email_inter_fact);
							corps += "&Denomination_Liv="+ urlEncode(denomination_liv);
							corps += "&Adresse_1_Liv="+ urlEncode(adresse_1_liv);
							corps += "&Adresse_2_Liv="+ urlEncode(adresse_2_liv);
							corps += "&Adresse_3_Liv="+ urlEncode(adresse_3_liv);
							corps += "&Code_Postal_Liv="+ urlEncode(code_postal_liv);
							corps += "&Ville_Liv="+ urlEncode(ville_liv);
							corps += "&Code_Pays_Liv="+ urlEncode(code_pays_liv);
							corps += "&Civ_Inter_Liv="+ urlEncode(civ_inter_liv);
							corps += "&Nom_Inter_Liv="+ urlEncode(nom_inter_liv);
							corps += "&Prenom_Inter_Liv="+ urlEncode(prenom_inter_liv);
							corps += "&Tel_Inter_Liv="+ urlEncode(tel_inter_liv);
							corps += "&Fax_Inter_Liv="+ urlEncode(fax_inter_liv);
							corps += "&Email_Inter_Liv="+ urlEncode(email_inter_liv);
							corps += "&Denomination_Envoi="+ urlEncode(denomination_envoi);
							corps += "&Adresse_1_Envoi="+ urlEncode(adresse_1_envoi);
							corps += "&Adresse_2_Envoi="+ urlEncode(adresse_2_envoi);
							corps += "&Adresse_3_Envoi="+ urlEncode(adresse_3_envoi);
							corps += "&Code_Postal_Envoi="+ urlEncode(code_postal_envoi);
							corps += "&Ville_Envoi="+ urlEncode(ville_envoi);
							corps += "&Code_Pays_Envoi="+ urlEncode(code_pays_envoi);
							corps += "&Civ_Inter_Envoi="+ urlEncode(civ_inter_envoi);
							corps += "&Nom_Inter_Envoi="+ urlEncode(nom_inter_envoi);
							corps += "&Prenom_Inter_Envoi="+ urlEncode(prenom_inter_envoi);
							corps += "&Tel_Inter_Envoi="+ urlEncode(tel_inter_envoi);
							corps += "&Fax_Inter_Envoi="+ urlEncode(fax_inter_envoi);
							corps += "&Email_Inter_Envoi="+ urlEncode(email_inter_envoi);
			
							corps += "&Client_Id="+ urlEncode(global_client_id);
							corps += "&Type_facturation="+ Type_facturation;
							corps += "&nbPeriodeOfferte=" + urlEncode(nbPeriodeOfferte);
							corps += "&Edition_TTC="+ (editionTTC?"1":"0");
							corps += "&Assujetti_TVA="+ (assujettiTVA?"1":"0");
							corps += "&Num_TVA_Intra="+ urlEncode(num_tva);
							
							corps += "&Frais_Port="+ fraisPort;
							corps += "&PRemise="+ tauxRemise +"&MRemise="+ montantRemise;
							corps += "&PRemise_FP="+ tauxRemiseFP +"&MRemise_FP="+ montantRemiseFP;
							corps += "&Escompte="+ escompte;
							corps += "&modeReglement="+ modeReglement;
							corps += "&Commentaires="+ urlEncode(Commentaires);
							corps += "&Util_R=" +Util_R;
							corps += "&Code_tarif="+ Code_tarif;
			
							var p = requeteHTTP(corps);

							if (mode=="C") {
								menu_abonnement_setEtat("A");
								abonnementId = p.responseXML.documentElement.getAttribute("Abonnement_Id");
								
								corps = cookie() +"&Page=Facturation/Abonnement/copieArticleModeleAbonnement.tmpl&ContentType=xml&Modele_Id="+ global_modele_id +"&Abonnement_Id="+ abonnementId;
								requeteHTTP(corps);
							}
							enregistrerEcheances();
							modification = true;
							ok = true;
							if (!quit)
								menu_abonnement_chargerAbonnement();
						}
						
					} else {
						showWarning("Jour de règlement incorrect !");
					}
				}

			}
			else {
				showWarning("Veuillez saisir un article (onglet Facture Type)");
			}
		}
		verrou = false;
		return ok;

	}	catch(e) {
	 	recup_erreur(e);
  }
}


//fonction qui permet de supprimer un abonnement
function menu_abonnement_supprimerTout() {
	try {

		if (window.confirm("Voulez-vous vraiment supprimer l'abonnement ?")) {

			var corps = cookie() +"&Page=Facturation/Abonnement/supprimerAbonnement.tmpl&contentType=xml&Abonnement_Id="+ abonnementId;
			requeteHTTP(corps);

			showMessage("Abonnement supprimé !");
			menu_abonnement_retour_gestion_abonnement();
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function menu_abonnement_resilierAbonnement() {
	try {

		if (window.confirm("Voulez-vous vraiment résilier l'abonnement ?")) {
			modification = true;
			var corps = cookie() +"&Page=Facturation/Abonnement/modifierEtatAbonnement.tmpl&contentType=xml&Abonnement_Id="+ abonnementId +"&Etat=R";
			requeteHTTP(corps);
			menu_abonnement_setEtat("R");
			menu_abonnement_initBoutons(document.getElementById("Panneau").selectedIndex);
			menu_abonnement_disable_champ();
		}

	}	catch(e) {
		recup_erreur(e);
	}
}


function menu_abonnement_annulerResiliation() {
	try {

		if (window.confirm("Voulez-vous vraiment annuler la résiliation de l'abonnement ?")) {

			modification = true;
			var corps = cookie() +"&Page=Facturation/Abonnement/modifierEtatAbonnement.tmpl&contentType=xml&Abonnement_Id="+ abonnementId +"&Etat=C";
			requeteHTTP(corps);
			menu_abonnement_setModifie(false);
			menu_abonnement_setEtat("C");
			menu_abonnement_initBoutons(document.getElementById("Panneau").selectedIndex);
			menu_abonnement_disable_champ();
		}

	} catch(e) {
		recup_erreur(e);
	}
}


//fonction qui permet d'enregistrer si l'utilisateur quitte sans avoir enregistré
function menu_abonnement_demandeEnregistrement() {
	try {

		if (document.getElementById('Modifie').value == "y") {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à l'abonnement ?")) {
				menu_abonnement_enregistrerTout(true,false);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


//fonction qui reconduit un abonnement à reconduction sur demande (recalcul les dates et crée de nouvelle echeance)
function menu_abonnement_reconduireAbonnement() {
	try {

		var ancDateFin = document.getElementById('dateFin').value;

		var nouvDateFin = Parametre_abonnement_DateFinAbonnement(parseIntBis(ancDateFin.substring(0,2)),
																													parseIntBis(ancDateFin.substring(3,5)),
																													parseIntBis(ancDateFin.substring(6,10)),
																													'/','/',
																													parseIntBis(document.getElementById('Duree_recon_contrat').value),
																													(document.getElementById('Type_duree_recon_contrat').value));

		var datePreavisTemp = Parametre_abonnement_DateFinAbonnement(parseIntBis(nouvDateFin.substring(0,2)),
																													parseIntBis(nouvDateFin.substring(3,5)),
																													parseIntBis(nouvDateFin.substring(6,10)),
																													'/','/',
																													-parseIntBis(document.getElementById('delaiPreavis').value),3);

		var datePreavis = Parametre_abonnement_DateFinAbonnement(parseIntBis(datePreavisTemp.substring(0,2)),
																														parseIntBis(datePreavisTemp.substring(3,5)),
																														parseIntBis(datePreavisTemp.substring(6,10)),
																														'/','/',1,1);

		if (menu_abonnement_enregistrerTout(false,false)) {
			corps = cookie() +"&Page=Facturation/Abonnement/reconduireAbonnement.tmpl&ContentType=xml";
			corps +="&Abonnement_Id="+urlEncode(abonnementId)+"&nouvDateFin="+urlEncode(prepareDateJava(nouvDateFin));
			corps +="&datePreavis="+urlEncode(prepareDateJava(datePreavis));
			requeteHTTP(corps);
			document.getElementById('dateFin').value = nouvDateFin;
			showWarning("Abonnement reconduit jusqu'au "+ nouvDateFin);
		}

	}	catch (e) {
  	recup_erreur(e);
	}
}


function enregistrerEcheances() {
	try {

		if (etat=="A")
			corps = cookie()+"&Page=Facturation/Abonnement/creerEcheance.tmpl&ContentType=xml";
		else
			corps = cookie()+"&Page=Facturation/Abonnement/modifierEcheance.tmpl&ContentType=xml";

		corps +="&totalHT="+ currentTotalHTFP;
		corps +="&MontantTTC="+ currentMontantTTC;
		corps +="&Abonnement_Id="+ urlEncode(abonnementId);

		if (optionRachat=="1") {
			corps +="&type=avecRachat";
			corps +="&valeurHT="+ urlEncode(globalvaleur);
			corps +="&valeurTTC="+ urlEncode(globalvaleurTTC);
		} else {
			corps +="&type=sansRachat";
		}

		requeteHTTP(corps);

	}	catch (e) {
  	recup_erreur(e);
	}
}


//fonction qui initialise certaine variable global et appel les autres fonctions de chargement d'un modele
function menu_abonnement_chargerModele() {
	try {

		var corps = cookie() +"&Page=Facturation/Abonnement/getModele.tmpl&ContentType=xml&Modele_Id="+ global_modele_id;

		var p = requeteHTTP(corps);

		var contenu = p.responseXML.documentElement;
		global_mode_reglement = contenu.getAttribute('Mode_reglement');
		global_resp = contenu.getAttribute('Util_R');
		global_code_tarif = contenu.getAttribute('Code_Tarif');
		Parametre_abonnement_chargerModele(contenu);
		FactureType_chargerModele(contenu);

	}	catch (e) {
    recup_erreur(e);
  }
}


//fonction qui initialise certaine variable global et appel les autres fonctions de chargement d'un abonnement
function menu_abonnement_chargerAbonnement() {
	try {

		mode="M";
		var corps = cookie() +"&Page=Facturation/Abonnement/getAbonnement.tmpl&ContentType=xml&Abonnement_Id="+abonnementId;
		var p = requeteHTTP(corps);
		var contenu = p.responseXML.documentElement;

		global_modele_id = contenu.getAttribute('Modele_Id');
		global_client_id = contenu.getAttribute('Client_Id');
		global_code_tarif = contenu.getAttribute('Code_tarif');
		abonnementId = contenu.getAttribute('Abonnement_Id');
		global_mode_reglement = contenu.getAttribute('Mode_reglement');
		global_resp = contenu.getAttribute('Util_R');
		menu_abonnement_setEtat(contenu.getAttribute('Etat'));

		document.getElementById('Creation').label = "Abonnement créé le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur');
		document.getElementById('Modification').label = "Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj');
		document.getElementById('Fiche').label = "Abonnement N° "+ contenu.getAttribute('Num_Entier');
		document.getElementById('Creation').collapsed = false;
		document.getElementById('Modification').collapsed = false;
		
		document.getElementById('tabFactureType').collapsed = false;
		document.getElementById('tabEch').collapsed = false;

		Parametre_abonnement_chargerAbonnement(contenu);
		FactureType_chargerAbonnement(contenu);
		menu_abonnement_initBoutons(document.getElementById("Panneau").selectedIndex);

	}	catch(e) {
	  recup_erreur(e);
  }
}


//fonction qui desactive les champs de saisie lors de l'ouverture de la page dans l'etat en cours et resilié (abonnement en cours)
function menu_abonnement_disable_champ() {
	try {

		document.getElementById('Libelle_abo').disabled = true;
		document.getElementById('PeriodFactu').disabled = true;
		document.getElementById('TypePeriodicite').disabled = true;

		document.getElementById('DureeContrat').disabled = true;
		document.getElementById('TypeDureeContrat').disabled = true;
		document.getElementById('Duree_recon_contrat').disabled = true;
		document.getElementById('Type_duree_recon_contrat').disabled = true;
		document.getElementById('dateDeb').disabled = true;
		document.getElementById('dateFin').disabled = true;

		document.getElementById('Secteur').disabled = true;
		document.getElementById('typeReconduction').disabled = true;
		document.getElementById('optionRachat').disabled = true;
		document.getElementById('delaiPreavis').disabled = true;
		document.getElementById('generationFacture').disabled = true;
		document.getElementById('nbPeriodeOfferte').disabled = true;
		document.getElementById('delaiReglement').disabled = true;
		document.getElementById('TypeReglement').disabled = true;

		document.getElementById('TypeFacturation').disabled = true;

		document.getElementById('tarif').disabled = true;

		var valeur = (etat=="R" || etat=="T");


		document.getElementById('valeur').disabled = valeur;
		document.getElementById('pourcentage').disabled = valeur;
		document.getElementById('bArticle').disabled = valeur;
		document.getElementById('bCommentaire').disabled = valeur;
		document.getElementById('bAnnuler').disabled = valeur;
		document.getElementById('bValider').disabled = valeur;
		document.getElementById('bSupprimer').disabled = valeur;
		
		document.getElementById('Commentaires').disabled = valeur;
		document.getElementById('Mode_Reg').disabled = valeur;
		document.getElementById('Remise').disabled = valeur;
		document.getElementById('bRemise').disabled = valeur;
		document.getElementById('Frais_Port').disabled = valeur;
		document.getElementById('RemiseFP').disabled = valeur;
		document.getElementById('bRemiseFP').disabled = valeur;
		document.getElementById('Escompte').disabled = valeur;
		document.getElementById('Login_Resp').disabled = valeur;
		document.getElementById('bChoisirMentions').disabled = valeur;
		document.getElementById('Assujetti_TVA').disabled = valeur;
		document.getElementById('Num_TVA').disabled = (valeur || !assujettiTVA);

		document.getElementById("Denomination_Fact").disabled = valeur;
		document.getElementById("Adresse_1_Fact").disabled = valeur;
		document.getElementById("Adresse_2_Fact").disabled = valeur;
		document.getElementById("Adresse_3_Fact").disabled = valeur;
		document.getElementById("Code_Postal_Fact").disabled = valeur;
		document.getElementById("Ville_Fact").disabled = valeur;
    document.getElementById("Code_Pays_Fact").disabled = valeur;
		document.getElementById("Civ_Inter_Fact").disabled = valeur;
		document.getElementById("Nom_Inter_Fact").disabled = valeur;
		document.getElementById("Prenom_Inter_Fact").disabled = valeur;
		document.getElementById("Tel_Inter_Fact").disabled = valeur;
		document.getElementById("Fax_Inter_Fact").disabled = valeur;
		document.getElementById("Email_Inter_Fact").disabled = valeur;
		document.getElementById("chercher_client").disabled = valeur;
		document.getElementById("chercher_adrfact").disabled = valeur;
		document.getElementById("chercher_inter").disabled = valeur;
		document.getElementById("bCopierFactVersLivEnvoi").disabled = valeur;
		document.getElementById("Denomination_Liv").disabled = valeur;
		document.getElementById("Adresse_1_Liv").disabled = valeur;
		document.getElementById("Adresse_2_Liv").disabled = valeur;
		document.getElementById("Adresse_3_Liv").disabled = valeur;
		document.getElementById("Code_Postal_Liv").disabled = valeur;
		document.getElementById("Ville_Liv").disabled = valeur;
		
		//var tree = document.getElementById("articles");
		//document.getElementById('Code_Pays_Liv').disabled = (valeur || tree.view==null || tree.view.rowCount>0);
		document.getElementById('Code_Pays_Liv').disabled = valeur;
		
    document.getElementById("Civ_Inter_Liv").disabled = valeur;
		document.getElementById("Nom_Inter_Liv").disabled = valeur;
		document.getElementById("Prenom_Inter_Liv").disabled = valeur;
		document.getElementById("Tel_Inter_Liv").disabled = valeur;
		document.getElementById("Fax_Inter_Liv").disabled = valeur;
		document.getElementById("Email_Inter_Liv").disabled = valeur;
		document.getElementById("chercher_adrliv").disabled = valeur;
		document.getElementById("chercher_inter_liv").disabled = valeur;
		document.getElementById("Denomination_Envoi").disabled = valeur;
		document.getElementById("Adresse_1_Envoi").disabled = valeur;
		document.getElementById("Adresse_2_Envoi").disabled = valeur;
		document.getElementById("Adresse_3_Envoi").disabled = valeur;
		document.getElementById("Code_Postal_Envoi").disabled = valeur;
		document.getElementById("Ville_Envoi").disabled = valeur;
    document.getElementById("Code_Pays_Envoi").disabled = valeur;
    document.getElementById("Civ_Inter_Envoi").disabled = valeur;
		document.getElementById("Nom_Inter_Envoi").disabled = valeur;
		document.getElementById("Prenom_Inter_Envoi").disabled = valeur;
		document.getElementById("Tel_Inter_Envoi").disabled = valeur;
		document.getElementById("Fax_Inter_Envoi").disabled = valeur;
		document.getElementById("Email_Inter_Envoi").disabled = valeur;
		document.getElementById("chercher_adrEnvoi").disabled = valeur;
		document.getElementById("chercher_inter_envoi").disabled = valeur;

		FactureType_formatLigne();

	}	catch(e) {
		recup_erreur(e);
	}
}


function menu_abonnement_imprimerAbonnement() {
	try {

		window.location = "chrome://opensi/content/facturation/user/abonnement/AbonnementPdf.xul?"+ cookie() +"&Abonnement_Id="+ abonnementId;

	}	catch(e) {
		recup_erreur(e);
	}
}


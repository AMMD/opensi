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

var ofa_defTypeFacturation;
var ofa_defModeFacturation;
var ofa_defPeriodeFacturation;
var ofa_defModeEnvoiFacture;
var ofa_bons;
var ofa_commandes;
var ofa_etatAffaire;
var ofa_modifie;
var ofa_chargerResponsable;
var ofa_chargement;

var ofa_aResponsables = new Arbre("ComboListe/combo-responsables.tmpl","ofa-responsable");
var ofa_aListeReglements = new Arbre("Facturation/Affaires/liste-reglementsAffaire.tmpl","ofa-listeReglements");
var ofa_aListeCommandes = new Arbre("Facturation/Affaires/liste-commandesAffaire.tmpl","ofa-listeCommandes");
var ofa_aListeBL = new Arbre("Facturation/Affaires/liste-bonsLivraisonAffaire.tmpl","ofa-listeBL");
var ofa_aListeFacturesAvoirs = new Arbre("Facturation/Affaires/liste-facturesAvoirsAffaire.tmpl","ofa-listeFacturesAvoirs");


function ofa_init() {
	try {
		
		ofa_chargement = true;
		document.getElementById('ofa-boxBoutonsAffaire').collapsed = true;
		document.getElementById('ofa-boxBoutonsCommande').collapsed = true;
		document.getElementById('ofa-boxBoutonsBL').collapsed = true;
		document.getElementById('ofa-boxBoutonsFacture').collapsed = true;
		
		var qParam = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qParam.execute();
		
		ofa_defTypeFacturation = result.responseXML.documentElement.getAttribute('Def_Type_Fact');
		ofa_defModeFacturation = result.responseXML.documentElement.getAttribute('Def_Mode_Facturation');
		ofa_defPeriodeFacturation = result.responseXML.documentElement.getAttribute('Def_Periode_Facturation');
		ofa_defModeEnvoiFacture = result.responseXML.documentElement.getAttribute('Def_Mode_Envoi_Facture');
		
		document.getElementById('ofa-rowActivationCP').collapsed = (result.responseXML.documentElement.getAttribute('Act_Activation_CP')!="1");
		document.getElementById('ofa-rowFacturationFP').collapsed = (result.responseXML.documentElement.getAttribute('Act_Code_Produit')!="1");
		
		ofa_chargerResponsables(get_cookie("User"));
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_chargerResponsables(selection) {
	try {
		ofa_chargerResponsable = selection;
		ofa_aResponsables.setParam("Selection", ofa_chargerResponsable);
		ofa_aResponsables.initTree(ofa_initResponsable);
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_initResponsable() {
  try {
		document.getElementById('ofa-responsable').value = ofa_chargerResponsable;
		
		if (ofa_chargement) {
			document.getElementById('ofa-boxBoutonsAffaire').collapsed = false;
			document.getElementById('ofa-boxBoutonsCommande').collapsed = false;
			document.getElementById('ofa-boxBoutonsBL').collapsed = false;
			document.getElementById('ofa-boxBoutonsFacture').collapsed = false;
			ofa_chargement = false;
		}
		
	} catch (e) {
  	recup_erreur(e);
	}
}


function ofa_reinitialiser() {
	try {
		ofa_codePaysBL="";
		ofa_etatAffaire="";
		ofa_setModifie(false);
		ofa_chargerResponsable="0";

		document.getElementById('ofa-typeFacturation').value = ofa_defTypeFacturation;
		document.getElementById('ofa-modeFacturation').checked = (ofa_defModeFacturation=="C");
		document.getElementById('ofa-chkSansLivraison').checked = false;
		document.getElementById('ofa-periodeFacturation').value = ofa_defPeriodeFacturation;
		document.getElementById('ofa-dateDebutPeriode').value = "";
		document.getElementById('ofa-dateDebutPeriode').collapsed = true;
		document.getElementById('ofa-modeEnvoiFacture').value = ofa_defModeEnvoiFacture;
		document.getElementById('ofa-clientId').value="";
		document.getElementById('ofa-raisonSociale').value="";
		document.getElementById('ofa-telephone').value="";
		document.getElementById('ofa-fax').value="";
		document.getElementById('ofa-email').value="";
		document.getElementById('ofa-numAffaire').value="Affaire";
		document.getElementById('ofa-etatAvancement').value="";
		document.getElementById('ofa-intitule').value="";
		document.getElementById('ofa-activationCP').checked = true;
		document.getElementById('ofa-factSepFP').checked=false;
		document.getElementById('ofa-commentaires').value="";
		document.getElementById('ofa-creation').setAttribute("label","");
		document.getElementById('ofa-modification').setAttribute("label","");
		document.getElementById('ofa-fiche').setAttribute("label","");
		ofa_aResponsables.deleteTree();

		document.getElementById('ofa-intitule').disabled = true;
		document.getElementById('ofa-responsable').disabled = true;
		document.getElementById('ofa-activationCP').disabled = true;
		document.getElementById('ofa-factSepFP').disabled = true;
		document.getElementById('ofa-typeFacturation').disabled = true;
		document.getElementById('ofa-modeFacturation').disabled = true;
		document.getElementById('ofa-chkSansLivraison').disabled = true;
		document.getElementById('ofa-periodeFacturation').disabled = true;
		document.getElementById('ofa-dateDebutPeriode').disabled = true;
		document.getElementById('ofa-modeEnvoiFacture').disabled = true;
		document.getElementById('ofa-raisonSociale').disabled = true;
		document.getElementById('ofa-telephone').disabled = true;
		document.getElementById('ofa-fax').disabled = true;
		document.getElementById('ofa-email').setAttribute('readonly', true);
		document.getElementById('ofa-commentaires').disabled = true;
		document.getElementById('ofa-bRechercher').disabled = true;
		document.getElementById('ofa-bAnnuler').disabled = true;
		document.getElementById('ofa-bEnregistrer').disabled = true;
		document.getElementById('ofa-bNouvelleCommande').disabled=true;
		document.getElementById('ofa-bNouveauBL').disabled=true;
		document.getElementById('ofa-bNouveauBLF').disabled=true;
		document.getElementById('ofa-bNouveauBR').disabled=true;
		document.getElementById('ofa-bNouvelleFacture').disabled=true;
		document.getElementById('ofa-bNouvelAvoir').disabled=true;
		
		document.getElementById('ofa-nbCommandesEnCours').value = "0";
		document.getElementById('ofa-caHTCommandesEnCours').value = "0.00 \u20AC";
		document.getElementById('ofa-paHTCommandes').value = "0.00 \u20AC";
		document.getElementById('ofa-margeHTAffaire').value = "0.00 \u20AC (0.00 %)";
		document.getElementById('ofa-nbArticlesALivrer').value = "0";
		document.getElementById('ofa-nbArticlesDejaLivres').value = "0";
		document.getElementById('ofa-nbArticlesRestantALivrer').value = "0";
		document.getElementById('ofa-avancementAffaire').value = "0 %";
		document.getElementById('ofa-lblMargeHT').setAttribute("style", "color:black");
		document.getElementById('ofa-margeHTAffaire').setAttribute("style", "color:black");
		document.getElementById('ofa-pictoMargeNegative').collapsed = true;
		
		document.getElementById('ofa-boxEncaissements').collapsed = true;
		document.getElementById('ofa-caTTCFacture').value = "";
		document.getElementById('ofa-caTTCPaye').value = "";
		document.getElementById('ofa-pourcCATTCPaye').value = "";
		document.getElementById('ofa-soldeAEncaisser').value = "";
		document.getElementById('ofa-pourcSoldeAEncaisser').value = "";
		
		ofa_aListeReglements.deleteTree();
		ofa_aListeCommandes.deleteTree();
		ofa_aListeBL.deleteTree();
		ofa_aListeFacturesAvoirs.deleteTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_nouvelleAffaire() {
	try {
		affaireId="";
		commandeId="";
		ofa_commandes="";
		bonId="";
		bonRetourId="";
		ofa_bons="";
		factureId="";
		avoirId="";
		
		ofa_reinitialiser();
		ofa_chargerResponsables(get_cookie("User"));
		
		var typeFact = document.getElementById('ofa-typeFacturation').value;
		
		document.getElementById('ofa-intitule').disabled = false;
		document.getElementById('ofa-responsable').disabled = false;
		document.getElementById('ofa-activationCP').disabled = false;
		document.getElementById('ofa-factSepFP').disabled = false;
		document.getElementById('ofa-typeFacturation').disabled = false;
		document.getElementById('ofa-modeFacturation').disabled = (typeFact=="BL");
		document.getElementById('ofa-chkSansLivraison').disabled = false;
		document.getElementById('ofa-periodeFacturation').disabled = false;
		document.getElementById('ofa-dateDebutPeriode').disabled = false;
		document.getElementById('ofa-modeEnvoiFacture').disabled = false;
		document.getElementById('ofa-raisonSociale').disabled = false;
		document.getElementById('ofa-telephone').disabled = false;
		document.getElementById('ofa-fax').disabled = false;
		document.getElementById('ofa-email').removeAttribute('readonly');
		document.getElementById('ofa-commentaires').disabled = false;
		document.getElementById('ofa-bRechercher').disabled = false;
		document.getElementById('ofa-bEnregistrer').disabled = false;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_chargerAffaire() {
	try {
		commandeId = "";
		ofa_commandes = "";
		bonId = "";
		bonRetourId = "";
		ofa_bons = "";
		factureId = "";
		avoirId = "";
		
		ofa_reinitialiser();
		
		var qCharger = new QueryHttp("Facturation/Affaires/getAffaire.tmpl");
		qCharger.setParam("Affaire_Id", affaireId);
		var result = qCharger.execute();
		var contenu = result.responseXML.documentElement;
		
		document.getElementById('ofa-clientId').value = contenu.getAttribute("Client_Id");
		document.getElementById('ofa-raisonSociale').value = contenu.getAttribute("Denomination");
		document.getElementById('ofa-telephone').value = contenu.getAttribute("Telephone");
		document.getElementById('ofa-fax').value = contenu.getAttribute("Fax");
		document.getElementById('ofa-email').value = contenu.getAttribute("Email");
		document.getElementById('ofa-activationCP').checked = (contenu.getAttribute("Activation_CP")=="1");
		document.getElementById('ofa-factSepFP').checked = (contenu.getAttribute("Fact_Sep_FP")=="1");
		
		ofa_etatAffaire = contenu.getAttribute("Etat");
		var desactiver = (ofa_etatAffaire=="A" || ofa_etatAffaire=="C");
		var libelleEtat = "";
		if (ofa_etatAffaire=="N") { libelleEtat = "Non validée"; }
		else if (ofa_etatAffaire=="T") { libelleEtat = "En cours"; }
		else if (ofa_etatAffaire=="A") { libelleEtat = "Annulée"; }
		else if (ofa_etatAffaire=="Z") { libelleEtat = "Non aboutie"; }
		else if (ofa_etatAffaire=="C") { libelleEtat = "Clôturée"; }
		var typeFact = contenu.getAttribute("Type_Fact");
		var periodeFact = contenu.getAttribute("Periode_Facturation");
		var modeFacturation = contenu.getAttribute("Mode_Facturation");
		var sansLivraison = (contenu.getAttribute("Sans_Livraison")=="1");
		document.getElementById('ofa-numAffaire').value = "Affaire N° "+ contenu.getAttribute("Num_Entier");
		document.getElementById('ofa-etatAvancement').value = libelleEtat;
		document.getElementById('ofa-intitule').value = contenu.getAttribute("Intitule");
		ofa_chargerResponsables(contenu.getAttribute("Util_R"));
		document.getElementById('ofa-typeFacturation').value = typeFact;
		document.getElementById('ofa-modeFacturation').checked = (modeFacturation=="C");
		document.getElementById('ofa-chkSansLivraison').checked = sansLivraison;
		document.getElementById('ofa-periodeFacturation').value = periodeFact;
		document.getElementById('ofa-dateDebutPeriode').value = contenu.getAttribute("Date_Debut_Periode");
		document.getElementById('ofa-dateDebutPeriode').collapsed = (periodeFact!="D");
		document.getElementById('ofa-modeEnvoiFacture').value = contenu.getAttribute("Mode_Envoi_Facture");
		document.getElementById('ofa-commentaires').value = contenu.getAttribute("Commentaires");
		document.getElementById('ofa-creation').setAttribute("label","Affaire créée le "+ contenu.getAttribute('Date_Creation') +" par "+ contenu.getAttribute('Login_Createur'));
		document.getElementById('ofa-modification').setAttribute("label","Dernière modification le "+ contenu.getAttribute('Date_Maj') +" par "+ contenu.getAttribute('Login_Maj'));
		document.getElementById('ofa-fiche').setAttribute("label","Affaire N°"+ contenu.getAttribute("Num_Entier"));
		
		document.getElementById('ofa-nbCommandesEnCours').value = contenu.getAttribute("Nb_Commandes_En_Cours");
		document.getElementById('ofa-caHTCommandesEnCours').value = contenu.getAttribute("CAHT_Commandes_En_Cours") + " \u20AC";
		document.getElementById('ofa-paHTCommandes').value = contenu.getAttribute("PAHT_Commandes") + " \u20AC";
		document.getElementById('ofa-margeHTAffaire').value = contenu.getAttribute("Marge_HT_Affaire") + " \u20AC ("+ contenu.getAttribute("Pourc_Marge_HT_Affaire") +" %)";
		document.getElementById('ofa-nbArticlesALivrer').value = contenu.getAttribute("Nb_Articles_A_Livrer");
		document.getElementById('ofa-nbArticlesDejaLivres').value = contenu.getAttribute("Nb_Articles_Deja_Livres");
		document.getElementById('ofa-nbArticlesRestantALivrer').value = contenu.getAttribute("Nb_Articles_Restant_A_Livrer");
		document.getElementById('ofa-avancementAffaire').value = contenu.getAttribute("Avancement_Affaire") + " %";
		
		if (contenu.getAttribute("Marge_Negative")=="true") {
			document.getElementById('ofa-lblMargeHT').setAttribute("style", "color:red");
			document.getElementById('ofa-margeHTAffaire').setAttribute("style", "color:red");
			document.getElementById('ofa-pictoMargeNegative').collapsed = false;
		}
		
		document.getElementById('ofa-boxEncaissements').collapsed = false;
		document.getElementById('ofa-caTTCFacture').value = contenu.getAttribute("CA_TTC_Facture");
		document.getElementById('ofa-caTTCPaye').value = contenu.getAttribute("CA_TTC_Paye");
		document.getElementById('ofa-pourcCATTCPaye').value = contenu.getAttribute("Pourc_CA_TTC_Paye");
		document.getElementById('ofa-soldeAEncaisser').value = contenu.getAttribute("Solde_A_Encaisser");
		document.getElementById('ofa-pourcSoldeAEncaisser').value = contenu.getAttribute("Pourc_Solde_A_Encaisser");
		
		ofa_aListeReglements.setParam("Affaire_Id", affaireId);
		ofa_aListeReglements.initTree();

		ofa_aListeCommandes.setParam("Affaire_Id", affaireId);
		ofa_aListeCommandes.initTree(ofa_initListeCommandes);
		
		
		document.getElementById('ofa-intitule').disabled = desactiver;
		document.getElementById('ofa-responsable').disabled = desactiver;
		document.getElementById('ofa-activationCP').disabled = desactiver;
		document.getElementById('ofa-factSepFP').disabled = desactiver;
		document.getElementById('ofa-modeEnvoiFacture').disabled = desactiver;
		document.getElementById('ofa-commentaires').disabled = desactiver;
		document.getElementById('ofa-bAnnuler').disabled = desactiver;
		document.getElementById('ofa-bEnregistrer').disabled = desactiver;
		document.getElementById('ofa-bNouvelleCommande').disabled = (desactiver || ofa_etatAffaire=="Z");
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_initListeCommandes() {
	try {
		ofa_activerRechercherClient();
		
		ofa_aListeBL.setParam("Affaire_Id", affaireId);
		ofa_aListeBL.initTree(ofa_initListeBL);
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_initListeBL() {
	try {
		ofa_aListeFacturesAvoirs.setParam("Affaire_Id", affaireId);
		ofa_aListeFacturesAvoirs.initTree(ofa_activerTypeFact);
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_activerRechercherClient() {
	try {
		var desactiver = (ofa_etatAffaire=="A" || ofa_etatAffaire=="C" || ofa_aListeCommandes.nbLignes()>0);
		document.getElementById('ofa-bRechercher').disabled = desactiver;
		if (document.getElementById('ofa-clientId').value=="" && !desactiver) {
			document.getElementById('ofa-raisonSociale').disabled = false;
			document.getElementById('ofa-telephone').disabled = false;
			document.getElementById('ofa-fax').disabled = false;
			document.getElementById('ofa-email').removeAttribute('readonly');
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_activerTypeFact() {
	try {
		var desactiver = (ofa_etatAffaire=="A" || ofa_etatAffaire=="C" || ofa_aListeFacturesAvoirs.nbLignes()>0);
		var typeFact = document.getElementById('ofa-typeFacturation').value;
		var sansLivraison = document.getElementById('ofa-chkSansLivraison').checked;
		var periodeFact = document.getElementById('ofa-periodeFacturation').value;
		document.getElementById('ofa-typeFacturation').disabled = desactiver;
		document.getElementById('ofa-periodeFacturation').disabled = desactiver;
		document.getElementById('ofa-dateDebutPeriode').disabled = (desactiver || periodeFact!="D");
		document.getElementById('ofa-modeFacturation').disabled = (desactiver || sansLivraison || typeFact=="BL");
		document.getElementById('ofa-chkSansLivraison').disabled = (desactiver || ofa_aListeBL.nbLignes()>0 || typeFact=="BL");
		
		ofa_activerBoutons();
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_pressOnSansLivraison() {
	try {
		var sansLivraison = (document.getElementById('ofa-chkSansLivraison').checked);
		document.getElementById('ofa-modeFacturation').disabled = sansLivraison;
		if (sansLivraison) { document.getElementById('ofa-modeFacturation').checked=true; }
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_pressOnPeriodeFacturation() {
	try {
		var periodeFact = document.getElementById('ofa-periodeFacturation').value;
		document.getElementById('ofa-dateDebutPeriode').collapsed = (periodeFact!="D");
		document.getElementById('ofa-dateDebutPeriode').disabled = (periodeFact!="D");
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_activerBoutons() {
	try {
		var sansLivraison = (document.getElementById('ofa-chkSansLivraison').checked);
		var desactiver = (ofa_etatAffaire=="A" || ofa_etatAffaire=="C" || sansLivraison);
		
		if (!desactiver) {
			var qGetCommandesLivrables = new QueryHttp("Facturation/Affaires/getNbCommandesLivrables.tmpl");
			qGetCommandesLivrables.setParam('Affaire_Id',affaireId);
			var result = qGetCommandesLivrables.execute();
			desactiver = (result.responseXML.documentElement.getAttribute('nbCommandes')==0);
		}
		document.getElementById('ofa-bNouveauBL').disabled=desactiver;
		document.getElementById('ofa-bNouveauBLF').disabled=desactiver;
		
		ofa_activerNouvelleFacture();
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_activerNouvelleFacture() {
	try {
		if (affaireId!="") {
			var typeFact = document.getElementById('ofa-typeFacturation').value;
			var modeFacturation = (document.getElementById('ofa-modeFacturation').checked?"C":"E");
			
			var desactiver = (ofa_etatAffaire=="A" || ofa_etatAffaire=="C" || typeFact=="GA");
			
			if (!desactiver) {
				var qGetFacturesNonGenerees = new QueryHttp("Facturation/Affaires/getNbFacturesNonGenerees.tmpl");
				qGetFacturesNonGenerees.setParam('Affaire_Id',affaireId);
				var result = qGetFacturesNonGenerees.execute();
				desactiver = (parseInt(result.responseXML.documentElement.getAttribute("nbFact"))>0);
			}

			if (!desactiver) {
				var qCheckPeriodeFacturation = new QueryHttp("Facturation/Affaires/checkPeriodeFacturation.tmpl");
				qCheckPeriodeFacturation.setParam('Affaire_Id',affaireId);
				var result = qCheckPeriodeFacturation.execute();
				desactiver = (result.responseXML.documentElement.getAttribute("codeErreur")!="0");
			}
			
			var facturationBLPossible;
			if (!desactiver) {
				var qGetBLFacturables = new QueryHttp("Facturation/Affaires/getNbBLFacturables.tmpl");
				qGetBLFacturables.setParam('Affaire_Id',affaireId);
				var result = qGetBLFacturables.execute();
				facturationBLPossible = (parseInt(result.responseXML.documentElement.getAttribute("nbBL"))>0);
				
				desactiver = (typeFact=="BL" && !facturationBLPossible);
			}
			
			if (!desactiver) {
				var qGetFraisFacturables = new QueryHttp("Facturation/Affaires/getFraisFacturables.tmpl");
				qGetFraisFacturables.setParam('Affaire_Id',affaireId);
				qGetFraisFacturables.setParam('Type_Facturation',typeFact);
				var result = qGetFraisFacturables.execute();
				var facturationFraisImpossible = (parseInt(result.responseXML.documentElement.getAttribute("nbCommandes"))==0);
	
				var qGetCommandesFacturables = new QueryHttp("Facturation/Affaires/getNbCommandesFacturables.tmpl");
				qGetCommandesFacturables.setParam('Affaire_Id',affaireId);
				qGetCommandesFacturables.setParam('Mode_Facturation',modeFacturation);
				var result = qGetCommandesFacturables.execute();
				var facturationCmdPossible = (parseInt(result.responseXML.documentElement.getAttribute("nbCommandes"))>0);

				desactiver = (facturationFraisImpossible && (typeFact=="GC" || typeFact=="CC") && ((modeFacturation=="C" && !facturationCmdPossible) || (modeFacturation=="E" && !facturationBLPossible)));
			}
			
			document.getElementById('ofa-bNouvelleFacture').disabled = desactiver;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_rechercherClient() {
	try {
		var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=true&Client_Express=true&Bloque=true";
    window.openDialog(url,'','chrome,modal,centerscreen',ofa_retourRechercherClient);
    var clientId = document.getElementById('ofa-clientId').value;

		if (clientId != "") {
			ofa_chargerCoord();
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('ofa-clientId').value = codeClient;
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_chargerCoord() {
  try {
		var clientId = document.getElementById("ofa-clientId").value;
		var qGetCoord = new QueryHttp("Facturation/Clients/getClient.tmpl");
		qGetCoord.setParam("Client_Id", clientId);
		var result = qGetCoord.execute();
		var contenu = result.responseXML.documentElement;

		document.getElementById('ofa-raisonSociale').value = contenu.getAttribute("Denomination");
		document.getElementById('ofa-telephone').value = contenu.getAttribute("Tel_1");
		document.getElementById('ofa-fax').value = contenu.getAttribute("Fax_1");
		document.getElementById('ofa-email').value = contenu.getAttribute("Email_1");
		ofa_chargerResponsables(contenu.getAttribute("Util_R"));
		document.getElementById('ofa-activationCP').checked = (contenu.getAttribute("Activation_CP")=="1");
		document.getElementById('ofa-factSepFP').checked = (contenu.getAttribute("Fact_Sep_FP")=="1");
		
		document.getElementById('ofa-raisonSociale').disabled = true;
		document.getElementById('ofa-telephone').disabled = true;
		document.getElementById('ofa-fax').disabled = true;
		document.getElementById('ofa-email').setAttribute('readonly', true);
		
		var typeFact = result.responseXML.documentElement.getAttribute('Type_Fact');
		
		var modeFacturation = result.responseXML.documentElement.getAttribute('Mode_Facturation');
		
		document.getElementById('ofa-typeFacturation').value = typeFact;
		document.getElementById('ofa-modeFacturation').checked = (modeFacturation=="C");
		document.getElementById('ofa-chkSansLivraison').checked=false;
		document.getElementById('ofa-periodeFacturation').value = result.responseXML.documentElement.getAttribute('Periode_Facturation');
		document.getElementById('ofa-dateDebutPeriode').value = "";
		document.getElementById('ofa-dateDebutPeriode').collapsed = true;
		document.getElementById('ofa-modeEnvoiFacture').value = result.responseXML.documentElement.getAttribute('Mode_Envoi_Facture');
		
		document.getElementById('ofa-chkSansLivraison').disabled = (typeFact=="BL");
		document.getElementById('ofa-modeFacturation').disabled = (typeFact=="BL");
		
		ofa_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function ofa_pressOnFichiers() {
	try {
		
		if (affaireId!="") {
	    var url = "chrome://opensi/content/facturation/user/recherches/rech_fichiers.xul?"+ cookie();
	    url +="&Type=Affaire&Document_Id="+ affaireId;
  	  window.openDialog(url,'','chrome,modal,centerscreen');
    }
    else {
      showWarning("Vous devez enregistrer votre affaire !");
    }
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_pressOnAnnuler() {
	try {
		if (window.confirm("Voulez-vous annuler l'affaire courante ?")) {
			var qAnnuler = new QueryHttp("Facturation/Affaires/annulerAffaire.tmpl");
			qAnnuler.setParam("Affaire_Id", affaireId);
			var result = qAnnuler.execute();
			if (result.responseXML.documentElement.getAttribute("code_erreur")=="1") {
				showWarning("Veuillez d'abord annuler toutes les commandes !");
			} else {
				showWarning("L'affaire est annulée !");
				ofa_chargerAffaire();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_enregistrerAffaire() {
	try {
		var ok = false;
		
		var denomination = document.getElementById('ofa-raisonSociale').value;
		var telephone = document.getElementById('ofa-telephone').value;
		var fax = document.getElementById('ofa-fax').value;
		var email = document.getElementById('ofa-email').value;
		var activationCP = document.getElementById('ofa-activationCP').checked?"1":"0";
		var factSepFP = document.getElementById('ofa-factSepFP').checked?"1":"0";
		
		var typeFacturation = document.getElementById('ofa-typeFacturation').value;
		var modeFacturation = (document.getElementById('ofa-modeFacturation').checked?"C":"E");
		var sansLivraison = document.getElementById('ofa-chkSansLivraison').checked?"1":"0";
		var periodeFacturation = document.getElementById('ofa-periodeFacturation').value;
		var dateDebutPeriode = document.getElementById('ofa-dateDebutPeriode').value;
		
		if (isEmpty(denomination)) { showWarning("Veuillez saisir la raison sociale du client !"); }
		else if (!isEmpty(telephone) && !isPhone(telephone) && !document.getElementById('ofa-telephone').disabled) { showWarning("Le téléphone du client est incorrect !"); }
		else if (!isEmpty(fax) && !isPhone(fax) && !document.getElementById('ofa-fax').disabled) { showWarning("Le fax du client est incorrect !"); }
		else if (!isEmpty(email) && !isEmail(email) && document.getElementById('ofa-email').getAttribute("readonly")!="true") { showWarning("L'adresse e-mail du client est incorrecte !"); }
		else if (typeFacturation=="BL" && modeFacturation=="C") { showWarning("Le type de facturation par BL et le mode de facturation par commande sont incompatibles !"); }
		else if (sansLivraison=="1" && modeFacturation!="C") { showWarning("Le mode de facturation ne peut être que par commande !"); }
		else if (periodeFacturation=="D" && !isDate(dateDebutPeriode)) { showWarning("La date de début de période est incorrecte !"); }
		else {
			if (!isEmpty(dateDebutPeriode)) { dateDebutPeriode = prepareDateJava(dateDebutPeriode); }
		
			var qEnregistrer;
			if (affaireId=="") {
				qEnregistrer = new QueryHttp("Facturation/Affaires/creerAffaire.tmpl");
			} else {
				qEnregistrer = new QueryHttp("Facturation/Affaires/modifierAffaire.tmpl");
				qEnregistrer.setParam("Affaire_Id", affaireId);
			}
			qEnregistrer.setParam("Client_Id", document.getElementById('ofa-clientId').value);
			qEnregistrer.setParam("Denomination", denomination);
			qEnregistrer.setParam("Telephone", telephone);
			qEnregistrer.setParam("Fax", fax);
			qEnregistrer.setParam("Email", email);
			qEnregistrer.setParam("Intitule", document.getElementById('ofa-intitule').value);
			qEnregistrer.setParam("Util_R", document.getElementById('ofa-responsable').value);
			qEnregistrer.setParam("Activation_CP", activationCP);
			qEnregistrer.setParam("Fact_Sep_FP", factSepFP);
			qEnregistrer.setParam("Type_Fact", typeFacturation);
			qEnregistrer.setParam("Mode_Facturation", modeFacturation);
			qEnregistrer.setParam("Sans_Livraison", sansLivraison);
			qEnregistrer.setParam("Periode_Facturation", periodeFacturation);
			qEnregistrer.setParam("Date_Debut_Periode", dateDebutPeriode);
			qEnregistrer.setParam("Mode_Envoi_Facture", document.getElementById('ofa-modeEnvoiFacture').value);
			qEnregistrer.setParam("Commentaires", document.getElementById('ofa-commentaires').value);
			var result = qEnregistrer.execute();
			
			if (affaireId=="") {
				affaireId = result.responseXML.documentElement.getAttribute("Affaire_Id");
			}
			
			ofa_setModifie(false);
			ok = true;
		}
		
		return ok;
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_pressOnEnregistrer() {
	try {
		
		var ok = ofa_enregistrerAffaire();
		if (ok) {
			ofa_chargerAffaire();
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_pressOnListeCommandes() {
	try {
		if (ofa_aListeCommandes.isSelected()) {
			var i = ofa_aListeCommandes.getCurrentIndex();
			ofa_demandeEnregistrement();
			commandeId = ofa_aListeCommandes.getCellText(i, "ofa-colCommandeId");
			oec_chargerCommande();
			document.getElementById('bRetourAffaire').collapsed=false;
			document.getElementById('deck').selectedIndex=2;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_pressOnNouvelleCommande() {
	try {
		ofa_demandeEnregistrement();
		oec_nouvelleCommande();
		document.getElementById('bRetourAffaire').collapsed=false;
		document.getElementById('deck').selectedIndex=2;
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_selectOnListeBL() {
	try {
		if (ofa_aListeBL.isSelected()) {
			var i = ofa_aListeBL.getCurrentIndex();
			var typeDoc = ofa_aListeBL.getCellText(i, "ofa-colTypeBon");
			var etat = ofa_aListeBL.getCellText(i, "ofa-colEtat");
			document.getElementById('ofa-bNouveauBR').disabled=(ofa_etatAffaire!="T" || typeDoc!="BL" || etat!="V");
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_pressOnListeBL() {
	try {

		if (ofa_aListeBL.isSelected()) {
			var i = ofa_aListeBL.getCurrentIndex();
			ofa_demandeEnregistrement();
			oebl_fournisseur=ofa_aListeBL.getCellText(i, "ofa-colFournisseur")!=""?1:0;
			oebl_fournisseurId=ofa_aListeBL.getCellText(i, "ofa-colFournisseur");
			
			var typeDoc = ofa_aListeBL.getCellText(i, "ofa-colTypeBon");
			if (typeDoc=="BL") {
				bonId = ofa_aListeBL.getCellText(i, "ofa-colBonId");
				oebl_chargerBon();
				document.getElementById('bRetourAffaire').collapsed=false;
				document.getElementById('deck').selectedIndex=3;
			} else {
				bonRetourId = ofa_aListeBL.getCellText(i, "ofa-colBonId");
				oebrc_chargerBon();
				document.getElementById('bRetourAffaire').collapsed=false;
				document.getElementById('deck').selectedIndex=7;
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_pressOnNouveauBL() {
	try {
		oebl_fournisseur=0;
		oebl_fournisseurId="";
		var qGetCommandesLivrables = new QueryHttp("Facturation/Affaires/getNbCommandesLivrables.tmpl");
		qGetCommandesLivrables.setParam('Affaire_Id',affaireId);
		var result = qGetCommandesLivrables.execute();

		if (parseIntBis(result.responseXML.documentElement.getAttribute('nbCommandes'))>1) {
			var url = "chrome://opensi/content/facturation/user/affaires/popup-choixCommandeLivrable.xul?"+ cookie() +"&Affaire_Id="+ affaireId;
  		window.openDialog(url,'','chrome,modal,centerscreen', ofa_retourChoixCommandeLivrable);
  	}
  	else {
			commandeId=result.responseXML.documentElement.getAttribute('Commande_Id');

			document.getElementById('bRetourAffaire').collapsed=false;
			document.getElementById('deck').selectedIndex=3;
			oebl_nouveauBon();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnNouveauBLF() {
	try {
		oebl_fournisseur=1;
		oebl_fournisseurId="";
		var qGetCommandesLivrables = new QueryHttp("Facturation/Affaires/getNbCommandesLivrables.tmpl");
		qGetCommandesLivrables.setParam('Affaire_Id',affaireId);
		var result = qGetCommandesLivrables.execute();

		if (parseIntBis(result.responseXML.documentElement.getAttribute('nbCommandes'))>1) {
			var url = "chrome://opensi/content/facturation/user/affaires/popup-choixCommandeLivrable.xul?"+ cookie() +"&Affaire_Id="+ affaireId;
  		window.openDialog(url,'','chrome,modal,centerscreen', ofa_retourChoixCommandeLivrable);
  	}
  	else {
			commandeId=result.responseXML.documentElement.getAttribute('Commande_Id');

			document.getElementById('deck').selectedIndex=3;
			document.getElementById('bRetourAffaire').collapsed=false;
			oebl_nouveauBon();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnNouveauBR() {
	try {
		if (ofa_aListeBL.isSelected()) {
			var i = ofa_aListeBL.getCurrentIndex();
			var typeDoc = ofa_aListeBL.getCellText(i, "ofa-colTypeBon");
			if (typeDoc=="BL") {
				ofa_demandeEnregistrement();
				bonId = ofa_aListeBL.getCellText(i, "ofa-colBonId");
				document.getElementById('bRetourAffaire').collapsed=false;
				document.getElementById('deck').selectedIndex=7;
				oebrc_nouveauBon();
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_retourChoixCommandeLivrable(Commande_Id) {
	try {
		commandeId=Commande_Id;
		document.getElementById('bRetourAffaire').collapsed=false;
		ofa_demandeEnregistrement();
		document.getElementById('deck').selectedIndex=3;
		oebl_nouveauBon();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_pressOnListeFacturesAvoirs() {
	try {
		if (ofa_aListeFacturesAvoirs.isSelected()) {
			var i = ofa_aListeFacturesAvoirs.getCurrentIndex();
			ofa_demandeEnregistrement();
			var typeDoc = ofa_aListeFacturesAvoirs.getCellText(i, "ofa-colTypeDoc");
			var docId = ofa_aListeFacturesAvoirs.getCellText(i, "ofa-colDocId");
			document.getElementById('bRetourAffaire').collapsed=false;
			if (typeDoc=="Facture") {
				factureId = docId;
				oef_chargerFacture();
				document.getElementById('deck').selectedIndex=5;
			} else {
				avoirId = docId;
				oea_chargerAvoir();
				document.getElementById('deck').selectedIndex=6;
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_selectOnListeFacturesAvoirs() {
	try {
		if (ofa_aListeFacturesAvoirs.isSelected()) {
			var i = ofa_aListeFacturesAvoirs.getCurrentIndex();
			var typeDoc = ofa_aListeFacturesAvoirs.getCellText(i, "ofa-colTypeDoc");
			var valide = (ofa_aListeFacturesAvoirs.getCellText(i, "ofa-colValide")=="1");
			document.getElementById('ofa-bNouvelAvoir').disabled=(ofa_etatAffaire=="A" || typeDoc!="Facture" || !valide);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_pressOnNouvelleFacture() {
	try {
		// Quand on arrive dans cette fonction, c'est que toutes les conditions sont réunies
		// pour qu'une facturation soit possible (le bouton Nouvelle Facture est grisé sinon)
		
		var typeFact = document.getElementById('ofa-typeFacturation').value;
		var periodeFact = document.getElementById('ofa-periodeFacturation').value;
		var modeFacturation = (document.getElementById('ofa-modeFacturation').checked?"C":"E");
	
		var ok = true;
		if (typeFact=="BL") {
			// ouvrir popup BL si plusieurs BL sinon choisir BL dispo
			var qGetBLFacturables = new QueryHttp("Facturation/Affaires/getNbBLFacturables.tmpl");
			qGetBLFacturables.setParam('Affaire_Id',affaireId);
			var result = qGetBLFacturables.execute();
	
			if (parseIntBis(result.responseXML.documentElement.getAttribute('nbBL'))>1) {
				var url = "chrome://opensi/content/facturation/user/affaires/popup-choixBLFacturable.xul?"+ cookie() +"&Affaire_Id="+ affaireId;
	  		window.openDialog(url,'','chrome,modal,centerscreen', ofa_retourChoixBLFacturable);
	  		if (bonId=="") {
	  			ok = false;
	  		}
	  	}
	  	else {
				bonId=result.responseXML.documentElement.getAttribute('Bon_Id');
			}
		}
		else if (modeFacturation=="E") {
			// si typeFact==GC ou CC alors demander popup choix Pays
			if (typeFact=="CC") {
				var qGetCommandesFacturables = new QueryHttp("Facturation/Affaires/getNbCommandesFacturables.tmpl");
				qGetCommandesFacturables.setParam('Affaire_Id',affaireId);
				qGetCommandesFacturables.setParam('Mode_Facturation',modeFacturation);

				var result = qGetCommandesFacturables.execute();
				if (parseIntBis(result.responseXML.documentElement.getAttribute('nbCommandes'))>1) {
					var url = "chrome://opensi/content/facturation/user/affaires/popup-choixCommandeFacturable.xul?"+ cookie() +"&Affaire_Id="+ affaireId;
		  		window.openDialog(url,'','chrome,modal,centerscreen', ofa_retourChoixCommandeFacturable);
		  		if (commandeId=="") {
		  			ok = false;
		  		}
		  	}
		  	else {
					commandeId=result.responseXML.documentElement.getAttribute('Commande_Id');
				}
			}
			if (ok || typeFact=="GC") {
        var queryHttp = new QueryHttp("Facturation/Affaires/getNbPaysBL.tmpl");
        queryHttp.setParam("Affaire_Id",affaireId);
        queryHttp.setParam("Commande_Id",commandeId);
        queryHttp.setParam("Type_Fact",typeFact);
        var result = queryHttp.execute();
        
        if (parseIntBis(result.responseXML.documentElement.getAttribute('nb'))>1) {
	        var url = "chrome://opensi/content/facturation/user/affaires/popup-choixPaysBL.xul?"+ cookie() +"&Affaire_Id="+ affaireId;
	        window.openDialog(url,'','chrome,modal,centerscreen', ofa_retourChoixPaysBL);
		  		if (ofa_bons=="") {
		  			ok = false;
		  		}
        }
        else {
          ofa_bons = result.responseXML.documentElement.getAttribute('Bons');
          ofa_commandes = result.responseXML.documentElement.getAttribute('Commandes');
        }
			}
		}
		else if (typeFact=="CC") {
			// ouvrir popup commandes si plusieurs commandes sinon choisir commande dispo
			var qGetCommandesFacturables = new QueryHttp("Facturation/Affaires/getNbCommandesFacturables.tmpl");
			qGetCommandesFacturables.setParam('Affaire_Id',affaireId);
			qGetCommandesFacturables.setParam('Mode_Facturation',modeFacturation);
			var result = qGetCommandesFacturables.execute();
	
			if (parseIntBis(result.responseXML.documentElement.getAttribute('nbCommandes'))>1) {
				var url = "chrome://opensi/content/facturation/user/affaires/popup-choixCommandeFacturable.xul?"+ cookie() +"&Affaire_Id="+ affaireId+ "&Mode_Facturation="+modeFacturation;
	  		window.openDialog(url,'','chrome,modal,centerscreen', ofa_retourChoixCommandeFacturable);
	  		if (commandeId=="") {
	  			ok = false;
	  		}
	  	}
	  	else {
				commandeId=result.responseXML.documentElement.getAttribute('Commande_Id');
			}
		}
		else if (typeFact=="GC") {
			// ouvrir popup commandes si plusieurs commandes sinon choisir commandes groupes dispo
			var qGetGroupeCommandesFacturables = new QueryHttp("Facturation/Affaires/getNbGroupeCommandesFacturables.tmpl");
			qGetGroupeCommandesFacturables.setParam('Mode_Facturation',modeFacturation);
			qGetGroupeCommandesFacturables.setParam('Affaire_Id',affaireId);
			var result = qGetGroupeCommandesFacturables.execute();
	
			if (parseIntBis(result.responseXML.documentElement.getAttribute('nbCommandes'))>1) {
				var url = "chrome://opensi/content/facturation/user/affaires/popup-choixGroupeCommandeFacturable.xul?"+ cookie() +"&Affaire_Id="+ affaireId+ "&Mode_Facturation="+modeFacturation;
	  		window.openDialog(url,'','chrome,modal,centerscreen', ofa_retourChoixGroupeCommandeFacturable);
	  		if (ofa_commandes=="") {
	  			ok = false;
	  		}
	  	}
	  	else {
				ofa_commandes=result.responseXML.documentElement.getAttribute('Commandes_Id');
			}
		}
		
		if (ok) {
			var qCreerFacture = new QueryHttp("Facturation/Affaires/creerFacture.tmpl");
			qCreerFacture.setParam("Affaires_Id", affaireId);
			qCreerFacture.setParam("Type_Fact", typeFact);
			qCreerFacture.setParam("Mode_Facturation", modeFacturation);

			if (typeFact=="BL") {
				qCreerFacture.setParam("Bons_Id", bonId);
			}
			else if (modeFacturation=="E" && typeFact=="CC") {
				qCreerFacture.setParam("Commandes_Id", commandeId);
				qCreerFacture.setParam("Bons_Id", ofa_bons);
			}
			else if (modeFacturation=="E" && typeFact=="GC") {
				qCreerFacture.setParam("Commandes_Id", ofa_commandes);
				qCreerFacture.setParam("Bons_Id", ofa_bons);
			}
			else if (typeFact=="CC") {
				qCreerFacture.setParam("Commandes_Id", commandeId);
			}
			else if (typeFact=="GC") {
				qCreerFacture.setParam("Commandes_Id", ofa_commandes);
			}

		  var result = qCreerFacture.execute();
			if (factureId=="") {
				factureId = result.responseXML.documentElement.getAttribute("Facture_Id");
			}		  
		  
		  // dans les 2 cas, récupérer factureId
			// Puis ouvrir la facture
			oef_chargerFacture();
			document.getElementById('bMenuAffaires').collapsed=false;
			document.getElementById('bRetourAffaire').collapsed=false;
			document.getElementById('deck').selectedIndex=5;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_retourChoixCommandeFacturable(id) {
	try {
		commandeId=id;
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_retourChoixGroupeCommandeFacturable(id) {
	try {
		ofa_commandes=id;
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_retourChoixBLFacturable(id) {
	try {
		bonId=id;
	} catch (e) {
		recup_erreur(e);
	}
}

function ofa_retourChoixPaysBL(bons,commandes) {
	try {
		ofa_bons = bons;
		ofa_commandes = commandes;
	} catch (e) {
		recup_erreur(e);
	}
}


function ofa_pressOnNouvelAvoir() {
	try {
		if (window.confirm("Voulez-vous créer un avoir à partir de cette facture ?")) {
			ofa_demandeEnregistrement();
			
			var qVerif = new QueryHttp("Facturation/Affaires/verifierAvoirPossible.tmpl");
			qVerif.setParam("Affaire_Id", affaireId);
			var result = qVerif.execute();
			if (result.responseXML.documentElement.getAttribute("ok")=="true") {
				var currentIndex = ofa_aListeFacturesAvoirs.getCurrentIndex();
				var factId = ofa_aListeFacturesAvoirs.getCellText(currentIndex, 'ofa-colDocId');
				
				var qTransFact = new QueryHttp("Facturation/Affaires/transformerFactureEnAvoir.tmpl");
				qTransFact.setParam("Facture_Id", factId);
				var result = qTransFact.execute();
				avoirId = result.responseXML.documentElement.getAttribute("Avoir_Id");
				document.getElementById('bRetourAffaire').collapsed=false;
				oea_chargerAvoir();
				document.getElementById('deck').selectedIndex=6;
			} else {
				showWarning("Impossible de créer un avoir tant que les avoirs précédents ne sont pas validés !");
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function ofa_demandeEnregistrement() {
  try {

		if (ofa_modifie) {
			if (window.confirm("Voulez-vous enregistrer les modifications apportées à l'affaire ?")) {
				ofa_enregistrerAffaire();
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function ofa_setModifie(m) {
  try {
  	ofa_modifie = m;
  	if (m) {
  		document.getElementById('ofa-lblAffaire').setAttribute('image', 'chrome://opensi/content/design/icones/modified.png');
  		document.getElementById('ofa-bNouveauBL').disabled = true;
  		document.getElementById('ofa-bNouveauBLF').disabled = true;
  		document.getElementById('ofa-bNouvelleFacture').disabled = true;
  	}
  	else { document.getElementById('ofa-lblAffaire').setAttribute('image', null); }
	} catch (e) {
  	recup_erreur(e);
	}
}


function ofa_pressOnTypeFacturation() {
	try {
		var typeFacturation = document.getElementById('ofa-typeFacturation').value;
		if (typeFacturation=="BL") {
			document.getElementById('ofa-modeFacturation').checked=false;
			document.getElementById('ofa-chkSansLivraison').checked=false;
		}
		document.getElementById('ofa-modeFacturation').disabled = (typeFacturation=="BL");
		document.getElementById('ofa-chkSansLivraison').disabled = (typeFacturation=="BL");
	} catch (e) {
		recup_erreur(e);
	}
}

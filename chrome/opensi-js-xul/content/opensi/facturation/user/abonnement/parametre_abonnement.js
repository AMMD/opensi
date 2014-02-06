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



var ancDateDebut="";


//fonctions d'initialisation des champs de la page
function Parametre_abonnement_init() {
	try {
		var aPaysFact = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays_Fact");
		aPaysFact.initTree(initPaysFact);
		var aPaysLiv = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays_Liv");
		aPaysLiv.initTree(initPaysLiv);
		var aPaysEnvoi = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays_Envoi");
		aPaysEnvoi.initTree(initPaysEnvoi);
		
		var aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "Secteur");
		aSecteurs.initTree(initSecteur);
	} catch (e) {
		recup_erreur(e);
	}
}


function initPaysFact() {
	try {
    document.getElementById('Code_Pays_Fact').value='FR';
	} catch (e) {
    recup_erreur(e);
  }
}


function initPaysLiv() {
	try {
		document.getElementById('Code_Pays_Liv').value='FR';
	} catch (e) {
		recup_erreur(e);
	}
}


function initPaysEnvoi() {
	try {
		document.getElementById('Code_Pays_Envoi').value='FR';
	} catch (e) {
		recup_erreur(e);
	}
}

function initSecteur() {
	try {

    document.getElementById('Secteur').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function selectPaysLiv() {
	try {
		FactureType_listeTVA();
		FactureType_changerTypeVente();
	} catch (e) {
		recup_erreur(e);
	}
}


//fonction qui affiche ou non le cadre option de rachat en fonction du type de contrat selectionné
function Parametre_abonnement_initRachat() {
	try {

		if (document.getElementById("typeReconduction").value=='1'){
			document.getElementById("rowRachat").collapsed=false;
			Parametre_abonnement_initChoixAchat();
		}
		else {
			document.getElementById("rowRachat").collapsed=true;
			document.getElementById("optionRachat").checked=false;
			Parametre_abonnement_initChoixAchat();
		}

	}	catch (e) {
    recup_erreur(e);
  }
}


function Parametre_abonnement_initChoixAchat() {
	try {

		if (document.getElementById("optionRachat").checked){
			document.getElementById("rowPourcentage").collapsed=false;
			document.getElementById("rowValeur").collapsed=false;
		}
		else{
			document.getElementById("rowPourcentage").collapsed=true;
			document.getElementById("rowValeur").collapsed=true;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


//fonction qui permet la recherche d'un client en appelant la page de recherche d'un client
function Parametre_abonnement_rechercherClient() {
  try {

		var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie() +"&Nouv=true&Client_Express=true&Bloque=true";
    window.openDialog(url,'','chrome,modal,centerscreen',Parametre_abonnement_retourRechercherClient);

		global_client_id = document.getElementById("Client_Id").value;
		if (global_client_id != "") {
			menu_abonnement_setModifie(true);
			Parametre_abonnement_charger_client();
		}

	}	catch (e) {
    recup_erreur(e);
  }
}


function Parametre_abonnement_retourRechercherClient(codeClient) {
	try {
  	document.getElementById('Client_Id').value = codeClient;
	}	catch (e) {
		recup_erreur(e);
	}
}


//fonction qui charge les informations correspondante à un modele (ne charge que les informations relative à la page parametre_abonnement)
function Parametre_abonnement_chargerModele(contenu) {
	try	{

		//informations cadre parametres abonnement
		document.getElementById('Secteur').value = contenu.getAttribute('Secteur_Activite');
		document.getElementById('RefModele').value = contenu.getAttribute('Reference_modele');
		document.getElementById('Libelle_abo').value = contenu.getAttribute('Libelle_modele');
		document.getElementById('PeriodFactu').value = contenu.getAttribute('Periodicite');
		document.getElementById('TypePeriodicite').value = contenu.getAttribute('Type_periodicite');
		document.getElementById('DureeContrat').value = contenu.getAttribute('Duree_contrat');
		document.getElementById('TypeDureeContrat').value = contenu.getAttribute('Type_duree_contrat');
		document.getElementById('Duree_recon_contrat').value= contenu.getAttribute('Duree_recon_contrat');
 		document.getElementById('Type_duree_recon_contrat').value=contenu.getAttribute('Type_duree_recon_contrat');
		document.getElementById('typeReconduction').value = contenu.getAttribute('Type_contrat');
		document.getElementById('reconduireAbonnement').collapsed=(document.getElementById('typeReconduction').value=="2");
		if (contenu.getAttribute('OptionRachat')==0)
			document.getElementById('optionRachat').checked=false;
		else
			document.getElementById('optionRachat').checked=true;

		Parametre_abonnement_initRachat();
		document.getElementById('delaiPreavis').value = contenu.getAttribute('Delai_preavis');
		document.getElementById('generationFacture').value = contenu.getAttribute('Delai_gen_facture');
		document.getElementById('TypeReglement').value = contenu.getAttribute('Type_reglement');
		document.getElementById('numContrat').value = contenu.getAttribute('PrefixeNumContrat');
		document.getElementById('numContrat').collapsed=true;
		document.getElementById('nbPeriodeOfferte').value= contenu.getAttribute('nbPeriodeOfferte');

		editionTTC = contenu.getAttribute('Edition_TTC');

		if (contenu.getAttribute('Val_type_reglement')=="0")
		{
			document.getElementById('jourReglement').value = contenu.getAttribute('');
		}
		else
		{
			document.getElementById('jourReglement').value = contenu.getAttribute('Val_type_reglement');
		}
		if (document.getElementById('dateDeb').value != "")
			Parametre_abonnement_PutDateFin();

		if (contenu.getAttribute('Type_facturation')==1)
			document.getElementById('TypeFacturation').selectedItem=document.getElementById('AEcheoir');
		else
			document.getElementById('TypeFacturation').selectedItem=document.getElementById('AEchu');

		//informations sur le reglement
		document.getElementById('delaiReglement').value = contenu.getAttribute('Delais_reglement');
		switch(contenu.getAttribute('Type_reglement')){
			case "1":document.getElementById('TypeReglement').selectedItem=document.getElementById('RegNet');break;
			case "2":document.getElementById('TypeReglement').selectedItem=document.getElementById('RegFinMois');break;
			default :document.getElementById('TypeReglement').selectedItem=document.getElementById('RegFinMoisLe');break;
		}
		
		document.getElementById('chercher_client').disabled = false;

	}	catch(e) {
		recup_erreur(e);
  }
}


//fonction qui charge les informations sur un client
function Parametre_abonnement_charger_client() {
	try	{

		var client_id = document.getElementById("Client_Id").value;

		var corps = cookie() +"&Page=Facturation/Clients/getCoord.tmpl&ContentType=xml&Client_Id="+ urlEncode(client_id);

		var p = requeteHTTP(corps);

		var contenu = p.responseXML.documentElement;

		assujettiTVA = (contenu.getAttribute("Assujetti_TVA")=="1");
		document.getElementById('Assujetti_TVA').checked=assujettiTVA;
		document.getElementById('Num_TVA').disabled=!assujettiTVA;
		document.getElementById('Num_TVA').value=contenu.getAttribute("Num_TVA_Intra");

		if (document.getElementById('Secteur').selectedIndex==0) {
			document.getElementById('Secteur').value = contenu.getAttribute('Secteur_Activite');
		}
		document.getElementById("Denomination_Fact").value = contenu.getAttribute("Denomination_Fact");
		document.getElementById("Adresse_1_Fact").value = contenu.getAttribute("Adresse_1_Fact");
		document.getElementById("Adresse_2_Fact").value = contenu.getAttribute("Adresse_2_Fact");
		document.getElementById("Adresse_3_Fact").value = contenu.getAttribute("Adresse_3_Fact");
		document.getElementById("Code_Postal_Fact").value = contenu.getAttribute("Code_Postal_Fact");
		document.getElementById("Ville_Fact").value = contenu.getAttribute("Ville_Fact");
    document.getElementById("Code_Pays_Fact").value = contenu.getAttribute("Code_Pays_Fact");

		document.getElementById("Civ_Inter_Fact").value = contenu.getAttribute("Civ_Inter_Fact");
		document.getElementById("Nom_Inter_Fact").value = contenu.getAttribute("Nom_Inter_Fact");
		document.getElementById("Prenom_Inter_Fact").value = contenu.getAttribute("Prenom_Inter_Fact");
		document.getElementById("Tel_Inter_Fact").value = contenu.getAttribute("Tel_Inter_Fact");
		document.getElementById("Fax_Inter_Fact").value = contenu.getAttribute("Fax_Inter_Fact");
		document.getElementById("Email_Inter_Fact").value = contenu.getAttribute("Email_Inter_Fact");

		document.getElementById("Denomination_Liv").value = contenu.getAttribute("Denomination_Liv");
		document.getElementById("Adresse_1_Liv").value = contenu.getAttribute("Adresse_1_Liv");
		document.getElementById("Adresse_2_Liv").value = contenu.getAttribute("Adresse_2_Liv");
		document.getElementById("Adresse_3_Liv").value = contenu.getAttribute("Adresse_3_Liv");
		document.getElementById("Code_Postal_Liv").value = contenu.getAttribute("Code_Postal_Liv");
		document.getElementById("Ville_Liv").value = contenu.getAttribute("Ville_Liv");
    document.getElementById("Code_Pays_Liv").value = contenu.getAttribute("Code_Pays_Liv");
    FactureType_calculerTvaPort();
    selectPaysLiv();

    document.getElementById("Civ_Inter_Liv").value = contenu.getAttribute("Civ_Inter_Liv");
		document.getElementById("Nom_Inter_Liv").value = contenu.getAttribute("Nom_Inter_Liv");
		document.getElementById("Prenom_Inter_Liv").value = contenu.getAttribute("Prenom_Inter_Liv");
		document.getElementById("Tel_Inter_Liv").value = contenu.getAttribute("Tel_Inter_Liv");
		document.getElementById("Fax_Inter_Liv").value = contenu.getAttribute("Fax_Inter_Liv");
		document.getElementById("Email_Inter_Liv").value = contenu.getAttribute("Email_Inter_Liv");
		
		document.getElementById("Denomination_Envoi").value = contenu.getAttribute("Denomination_Envoi");
		document.getElementById("Adresse_1_Envoi").value = contenu.getAttribute("Adresse_1_Envoi");
		document.getElementById("Adresse_2_Envoi").value = contenu.getAttribute("Adresse_2_Envoi");
		document.getElementById("Adresse_3_Envoi").value = contenu.getAttribute("Adresse_3_Envoi");
		document.getElementById("Code_Postal_Envoi").value = contenu.getAttribute("Code_Postal_Envoi");		
		document.getElementById("Ville_Envoi").value = contenu.getAttribute("Ville_Envoi");
    document.getElementById("Code_Pays_Envoi").value = contenu.getAttribute("Code_Pays_Envoi");
    
    document.getElementById("Civ_Inter_Envoi").value = contenu.getAttribute("Civ_Inter_Envoi");
		document.getElementById("Nom_Inter_Envoi").value = contenu.getAttribute("Nom_Inter_Envoi");
		document.getElementById("Prenom_Inter_Envoi").value = contenu.getAttribute("Prenom_Inter_Envoi");
		document.getElementById("Tel_Inter_Envoi").value = contenu.getAttribute("Tel_Inter_Envoi");
		document.getElementById("Fax_Inter_Envoi").value = contenu.getAttribute("Fax_Inter_Envoi");
		document.getElementById("Email_Inter_Envoi").value = contenu.getAttribute("Email_Inter_Envoi");

		var modeReg = contenu.getAttribute('Mode_Reg');
		if (modeReg!="0") { FactureType_chargerModesReglements(modeReg); }
		document.getElementById('Remise').value = contenu.getAttribute("Remise");
		document.getElementById('bRemise').setAttribute("class", "bIcoPourcentage");
		typeRemise = 'P';
		document.getElementById('tarif').value = contenu.getAttribute("Code_Tarif");

		document.getElementById('labelClientFact').setAttribute("value", "Client N° "+ client_id);
		document.getElementById('labelClientLiv').setAttribute("value", "Client N° "+ client_id);
		document.getElementById('labelClientEnvoi').setAttribute("value", "Client N° "+ client_id);

		document.getElementById('chercher_adrfact').disabled = false;
		document.getElementById('chercher_inter').disabled = false;
		document.getElementById('chercher_inter_liv').disabled = false;
		
		var client_connu = (client_id!="");
		//var tree = document.getElementById("articles");
   	//document.getElementById('chercher_adrliv').disabled = (!client_connu || tree.view==null || tree.view.rowCount>0);
   	document.getElementById('chercher_adrliv').disabled = !client_connu;
    //document.getElementById('bCopierFactVersLivEnvoi').disabled = (tree.view==null || tree.view.rowCount>0);
		document.getElementById('chercher_adrfact').disabled = !client_connu;
		document.getElementById('chercher_inter').disabled = !client_connu;
		document.getElementById('chercher_inter_liv').disabled = !client_connu;
		document.getElementById('chercher_adrEnvoi').disabled = !client_connu;
		document.getElementById('chercher_inter_envoi').disabled = !client_connu;

	}	catch(e) {
		recup_erreur(e);
  }
}



//fonction qui charge les informations correspondantes à l'abonnement
function Parametre_abonnement_chargerAbonnement(contenu) {
	try {

	//informations cadre paramètres abonnement
	document.getElementById('Secteur').value = contenu.getAttribute('Secteur_Activite');
	document.getElementById('numContrat').value= contenu.getAttribute('Num_Entier');
	document.getElementById('numContrat').collapsed=false;
	document.getElementById('RefModele').value= contenu.getAttribute('Reference_modele');
	document.getElementById('Libelle_abo').value= contenu.getAttribute('Libelle');
	document.getElementById('PeriodFactu').value= contenu.getAttribute('Periodicite');
	document.getElementById('TypePeriodicite').value= contenu.getAttribute('Type_periodicite');
	document.getElementById('DureeContrat').value= contenu.getAttribute('Duree_contrat');
	document.getElementById('TypeDureeContrat').value= contenu.getAttribute('Type_duree_contrat');
	document.getElementById('Duree_recon_contrat').value= contenu.getAttribute('Duree_recon_contrat');
 	document.getElementById('Type_duree_recon_contrat').value=contenu.getAttribute('Type_duree_recon_contrat');
	document.getElementById('dateDeb').value= contenu.getAttribute('Date_debut');
	document.getElementById('dateFin').value= contenu.getAttribute('Date_fin');
	document.getElementById('typeReconduction').value= contenu.getAttribute('Type_contrat');
	document.getElementById('reconduireAbonnement').collapsed=(document.getElementById('typeReconduction').value=="2");
	if (contenu.getAttribute('OptionRachat')==0)
		document.getElementById('optionRachat').checked=false;
	else
		document.getElementById('optionRachat').checked=true;

	Parametre_abonnement_initRachat();
	document.getElementById('pourcentage').value= contenu.getAttribute('PourcentageRachat');
	document.getElementById('valeur').value= contenu.getAttribute('ValeurRachat');
	document.getElementById('delaiPreavis').value= contenu.getAttribute('Delai_preavis');
	document.getElementById('generationFacture').value= contenu.getAttribute('Delai_gen_facture');
	document.getElementById('nbPeriodeOfferte').value= contenu.getAttribute('nbPeriodeOfferte');
	if (contenu.getAttribute('Type_facturation')==1)
			document.getElementById('TypeFacturation').selectedItem=document.getElementById('AEcheoir');
		else
			document.getElementById('TypeFacturation').selectedItem=document.getElementById('AEchu');


	if (contenu.getAttribute('Val_type_reglement')=="0")
	{
		document.getElementById('jourReglement').value = '';
	}
	else
	{
		document.getElementById('jourReglement').value = contenu.getAttribute('Val_type_reglement');
	}

	//informations sur le reglement
	document.getElementById('delaiReglement').value= contenu.getAttribute('Delais_reglement');
	switch(contenu.getAttribute('Type_reglement')){
		case "1":document.getElementById('TypeReglement').selectedItem=document.getElementById('RegNet');break;
		case "2":document.getElementById('TypeReglement').selectedItem=document.getElementById('RegFinMois');break;
		default :document.getElementById('TypeReglement').selectedItem=document.getElementById('RegFinMoisLe');break;
	}

	document.getElementById('Denomination_Fact').value = contenu.getAttribute('Denomination');
	document.getElementById('Adresse_1_Fact').value = contenu.getAttribute('Adresse');
	document.getElementById('Adresse_2_Fact').value = contenu.getAttribute('Comp_Adresse');
	document.getElementById('Adresse_3_Fact').value = contenu.getAttribute('Adresse_3');
	document.getElementById('Code_Postal_Fact').value = contenu.getAttribute('Code_Postal');
	document.getElementById('Ville_Fact').value = contenu.getAttribute('Ville');
	document.getElementById('Code_Pays_Fact').value = contenu.getAttribute('Code_Pays');

	document.getElementById('Denomination_Liv').value = contenu.getAttribute('Denomination_Liv');
	document.getElementById('Adresse_1_Liv').value = contenu.getAttribute('Adresse_1_Liv');
	document.getElementById('Adresse_2_Liv').value = contenu.getAttribute('Adresse_2_Liv');
	document.getElementById('Adresse_3_Liv').value = contenu.getAttribute('Adresse_3_Liv');
	document.getElementById('Code_Postal_Liv').value = contenu.getAttribute('Code_Postal_Liv');
	document.getElementById('Ville_Liv').value = contenu.getAttribute('Ville_Liv');
	document.getElementById('Code_Pays_Liv').value = contenu.getAttribute('Code_Pays_Liv');
	assujettiTVA = (contenu.getAttribute("Assujetti_TVA")=="1");
	FactureType_calculerTvaPort();
	selectPaysLiv();

	document.getElementById('Civ_Inter_Fact').value = contenu.getAttribute('Civ_Inter');
	document.getElementById('Nom_Inter_Fact').value = contenu.getAttribute('Nom_Inter');
	document.getElementById('Prenom_Inter_Fact').value = contenu.getAttribute('Prenom_Inter');
	document.getElementById('Tel_Inter_Fact').value = contenu.getAttribute('Tel_Inter');
	document.getElementById('Fax_Inter_Fact').value = contenu.getAttribute('Fax_Inter');
	document.getElementById('Email_Inter_Fact').value = contenu.getAttribute('Email_Inter');

	document.getElementById('Civ_Inter_Liv').value = contenu.getAttribute('Civ_Inter_Liv');
	document.getElementById('Nom_Inter_Liv').value = contenu.getAttribute('Nom_Inter_Liv');
	document.getElementById('Prenom_Inter_Liv').value = contenu.getAttribute('Prenom_Inter_Liv');
	document.getElementById('Tel_Inter_Liv').value = contenu.getAttribute('Tel_Inter_Liv');
	document.getElementById('Fax_Inter_Liv').value = contenu.getAttribute('Fax_Inter_Liv');
	document.getElementById('Email_Inter_Liv').value = contenu.getAttribute('Email_Inter_Liv');
	
	document.getElementById('Denomination_Envoi').value = contenu.getAttribute('Denomination_Envoi');
	document.getElementById('Adresse_1_Envoi').value = contenu.getAttribute('Adresse_1_Envoi');
	document.getElementById('Adresse_2_Envoi').value = contenu.getAttribute('Adresse_2_Envoi');
	document.getElementById('Adresse_3_Envoi').value = contenu.getAttribute('Adresse_3_Envoi');
	document.getElementById('Code_Postal_Envoi').value = contenu.getAttribute('Code_Postal_Envoi');
	document.getElementById('Ville_Envoi').value = contenu.getAttribute('Ville_Envoi');
	document.getElementById('Code_Pays_Envoi').value = contenu.getAttribute('Code_Pays_Envoi');
	
	document.getElementById('Civ_Inter_Envoi').value = contenu.getAttribute('Civ_Inter_Envoi');
	document.getElementById('Nom_Inter_Envoi').value = contenu.getAttribute('Nom_Inter_Envoi');
	document.getElementById('Prenom_Inter_Envoi').value = contenu.getAttribute('Prenom_Inter_Envoi');
	document.getElementById('Tel_Inter_Envoi').value = contenu.getAttribute('Tel_Inter_Envoi');
	document.getElementById('Fax_Inter_Envoi').value = contenu.getAttribute('Fax_Inter_Envoi');
	document.getElementById('Email_Inter_Envoi').value = contenu.getAttribute('Email_Inter_Envoi');

	document.getElementById('Assujetti_TVA').checked = assujettiTVA;
	document.getElementById('Num_TVA').disabled = !assujettiTVA;
	document.getElementById('Num_TVA').value = contenu.getAttribute("Num_TVA_Intra");

	var client_id = contenu.getAttribute('Client_Id');
  document.getElementById('Client_Id').value = client_id;
	var client_connu = (client_id!="");
	
	document.getElementById('chercher_client').disabled = client_connu;

	if (client_connu) {
		document.getElementById('labelClientFact').setAttribute("value", "Client N° "+ client_id);
		document.getElementById('labelClientLiv').setAttribute("value", "Client N° "+ client_id);
		document.getElementById('labelClientEnvoi').setAttribute("value", "Client N° "+ client_id);
	}
	else {
		document.getElementById('labelClientFact').setAttribute("value", "Client");
		document.getElementById('labelClientLiv').setAttribute("value", "Client");
		document.getElementById('labelClientEnvoi').setAttribute("value", "Client");
	}

	if (etat=='C' || etat=='R' || etat=='T')
		menu_abonnement_disable_champ();

	menu_abonnement_setModifie(false);

	}	catch(e) {
		recup_erreur(e);
  }
}


//fonction qui verifie que periodicite<contrat . La fonction calcul le nombre de jour correspond a la durre
//(1semaine=7 jour, 1 mois=30 jour, 1 an = 360) et compare ces 2 nombres.
function Parametre_abonnement_dureeInfouEgalePeriodicite(periodicite,typePeriodicite,dureeContrat,typeDureeContrat) {
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


//fonction qui verfie la coherence des valeurs contenue dans la page avant l'enregistrement d'un abonnement
function Parametre_abonnement_CoherenceValeur() {
	try {

		var ok = false;

		var libelle = document.getElementById('Libelle_abo').value;
		var periodicite = document.getElementById('PeriodFactu').value;
		var typePeriodicite = document.getElementById('TypePeriodicite').value;

		var dureeContrat = document.getElementById('DureeContrat').value;
		var typeDureeContrat = document.getElementById('TypeDureeContrat').value;
		var Duree_recon_contrat=document.getElementById('Duree_recon_contrat').value;
		var Type_duree_recon_contrat=document.getElementById('Type_duree_recon_contrat').value;
		var dateDebut = document.getElementById('dateDeb').value;
		var dateFin = document.getElementById('dateFin').value;

		var pourcentage = document.getElementById('pourcentage').value;
		var	valeur =  document.getElementById('valeur').value;

		var delaiPreavis = document.getElementById('delaiPreavis').value;
		var delaiGenerationFacture = document.getElementById('generationFacture').value;
		var delaisReglement = document.getElementById('delaiReglement').value;
		var typeReglement = document.getElementById('TypeReglement').value;
		var valTypeReglement = Parametre_abonnement_valeurTypeReglement(typeReglement);

		var denomination_fact = document.getElementById('Denomination_Fact').value;
		var adresse_1_fact = document.getElementById('Adresse_1_Fact').value;
		var ville_fact = document.getElementById('Ville_Fact').value;
		var denomination_liv = document.getElementById('Denomination_Liv').value;
		var adresse_1_liv = document.getElementById('Adresse_1_Liv').value;
		var ville_liv = document.getElementById('Ville_Liv').value;
		var denomination_envoi = document.getElementById('Denomination_Envoi').value;
		var adresse_1_envoi = document.getElementById('Adresse_1_Envoi').value;
		var ville_envoi = document.getElementById('Ville_Envoi').value;
		var tel_inter_fact = document.getElementById("Tel_Inter_Fact").value;
		var fax_inter_fact = document.getElementById('Fax_Inter_Fact').value;
		var email_inter_fact = document.getElementById('Email_Inter_Fact').value;
		var tel_inter_liv = document.getElementById("Tel_Inter_Liv").value;
		var fax_inter_liv = document.getElementById('Fax_Inter_Liv').value;
		var email_inter_liv = document.getElementById('Email_Inter_Liv').value;
		var tel_inter_envoi = document.getElementById("Tel_Inter_Envoi").value;
		var fax_inter_envoi = document.getElementById('Fax_Inter_Envoi').value;
		var email_inter_envoi = document.getElementById('Email_Inter_Envoi').value;

		if (isEmpty(libelle)) {showWarning("Vous devez indiquer un libellé avant d'enregistrer l'abonnement (onglet paramètres abonnement) !");}
		else if (isEmpty(periodicite) || !isPositiveOrNull(periodicite)) { showWarning("Vous devez indiquer la périodicité de facturation !");}
		else if (isEmpty(dureeContrat) || !isPositiveOrNull(dureeContrat)) { showWarning("Vous devez indiquer la durée du contrat (onglet paramètres abonnement) !");}
		else if (isEmpty(delaiPreavis)|| !isPositiveOrNull(delaiPreavis)) {	showWarning("Vous devez indiquer le délai du préavis (onglet paramètres abonnement) !");}
		else if (isEmpty(delaiGenerationFacture)|| !isPositiveOrNull(delaiGenerationFacture)) {	showWarning("Vous devez indiquer le délai de génération de la facture (onglet paramètres abonnement) !"); }
		else if (isEmpty(delaisReglement)|| !isPositiveOrNull(delaisReglement)) {	showWarning("Vous devez indiquer le	délai de règlement de la facture (onglet paramètres abonnement) !");}
		else if (isEmpty(denomination_fact)) { showWarning("Veuillez indiquer la raison sociale du client de facturation !"); }
		else if (isEmpty(adresse_1_fact)) { showWarning("Veuillez indiquer l'adresse du client de facturation !"); }
		else if (isEmpty(ville_fact)) { showWarning("Veuillez indiquer la ville du client de facturation !"); }
		else if (isEmpty(denomination_liv)) { showWarning("Veuillez indiquer la raison sociale du client de livraison !"); }
		else if (isEmpty(adresse_1_liv)) { showWarning("Veuillez indiquer l'adresse du client de livraison !"); }
		else if (isEmpty(ville_liv)) { showWarning("Veuillez indiquer la ville du client de livraison !"); }
		else if (isEmpty(denomination_envoi)) { showWarning("Veuillez indiquer la raison sociale du client d'envoi !"); }
		else if (isEmpty(adresse_1_envoi)) { showWarning("Veuillez indiquer l'adresse du client d'envoi !"); }
		else if (isEmpty(ville_envoi)) { showWarning("Veuillez indiquer la ville du client d'envoi !"); }
		else if (!isEmpty(tel_inter_fact) && !isPhone(tel_inter_fact)) { showWarning("Numéro de téléphone de facturation incorrect !"); }
		else if (!isEmpty(fax_inter_fact) && !isPhone(fax_inter_fact)) { showWarning("Numéro de fax de facturation incorrect !"); }
		else if (!isEmpty(email_inter_fact) && !isEmail(email_inter_fact)) { showWarning("Adresse e-mail de facturation incorrecte !"); }
		else if (!isEmpty(tel_inter_liv) && !isPhone(tel_inter_liv)) { showWarning("Numéro de téléphone de livraison incorrect !"); }
		else if (!isEmpty(fax_inter_liv) && !isPhone(fax_inter_liv)) { showWarning("Numéro de fax de livraison incorrect !"); }
		else if (!isEmpty(email_inter_liv) && !isEmail(email_inter_liv)) { showWarning("Adresse e-mail de livraison incorrecte !"); }
		else if (!isEmpty(tel_inter_envoi) && !isPhone(tel_inter_envoi)) { showWarning("Numéro de téléphone d'envoi incorrect !"); }
		else if (!isEmpty(fax_inter_envoi) && !isPhone(fax_inter_envoi)) { showWarning("Numéro de fax d'envoi incorrect !"); }
		else if (!isEmpty(email_inter_envoi) && !isEmail(email_inter_envoi)) { showWarning("Adresse e-mail d'envoi incorrecte !"); }
		else if (isEmpty(dateDebut)) {showWarning("Vous devez saisir une date de debut (onglet paramètres abonnement) !");}
		else if (isEmpty(dateFin)) {showWarning("Vous devez saisir une date de fin (onglet paramètres abonnement) !");}
		else if ((isEmpty(pourcentage) || !isTaux(pourcentage)) && document.getElementById('optionRachat').checked){	showWarning("veuillez saisir un pourcentage valide"); }
		else if ((isEmpty(valeur) || !isPositiveOrNull(valeur)) && document.getElementById('optionRachat').checked){	showWarning("veuillez saisir une valeur valide"); }
		else if (Parametre_abonnement_dureeInfouEgalePeriodicite(periodicite,typePeriodicite,dureeContrat,typeDureeContrat)){showWarning("la périodicite doit être inferieure ou égale à la duree : !");}
		else if (Parametre_abonnement_dureeInfouEgalePeriodicite(periodicite,typePeriodicite,Duree_recon_contrat,Type_duree_recon_contrat)){showWarning("la périodicite doit être inferieure ou égale à la durée de reconduction : !");}
		else if (Parametre_abonnement_verifDates(dateDebut,dateFin,dureeContrat,typeDureeContrat))
			ok = true;

		return ok;

	} catch(e) {
   	recup_erreur(e);
  }
}


//fonction qui verifie la cohérence des dates de début et de fin
function Parametre_abonnement_verifDates(dateDebut,dateFin,dureeContrat,typeDureeContrat) {
	try {
		var ok=false;

		if (dateDebut.length!=10  || !isDate(dateDebut)) { showWarning('Date de début incorrecte ! (format: jj/mm/aaaa)');}
		else if (dateFin.length!=10 || !isDate(dateFin)) { showWarning('Date de fin incorrecte ! (format: jj/mm/aaaa)');}
		else if (!isDateInterval(dateDebut, dateFin)) { showWarning("La date de début doit être antérieure à la date de fin !"); }
		else
		{
			var maintenant = new Date();
			var deb_annee = parseIntBis(dateDebut.substring(6,10));

			if (deb_annee<1970) {	showWarning("Les dates inférieures à 1970 ne sont pas acceptées !");}
			else if (mode=="C" && (deb_annee<maintenant.getFullYear() || deb_annee>maintenant.getFullYear()+1)) {
				if (window.confirm("L'année du début de l'abonnement est probablement incorrecte : "+deb_annee+"\nEtes vous sûr de vouloir continuer ?"))
					ok=true;
				}
			else
				ok=true;
		}

		return ok;

	}	catch(e) {
		recup_erreur(e);
  }
}


//si la selection est fin de mois le, retourne la valeur du champ jourReglement ou -1 si celui si est vide
//si la selection n'est pas fin de mois le, retourne 0
function Parametre_abonnement_valeurTypeReglement(typeReglement) {
	try	{

		if (typeReglement==3)
		{
			var valeurTypeReglement = document.getElementById('jourReglement').value;
			if (isEmpty(valeurTypeReglement)|| !isPositiveOrNull(valeurTypeReglement) || valeurTypeReglement>30)
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


//fonction executée lors de la sélection du label dateFin et qui écrit la valeur de la date de fin
function Parametre_abonnement_PutDateFin() {
	try {

		var dateDebut = document.getElementById('dateDeb').value;
		if (!isEmpty(dateDebut) && isDate(dateDebut) && ancDateDebut!=dateDebut && dateDebut.length==10) {

			var annee = parseIntBis(dateDebut.substring(6,10));
			var jour = parseIntBis(dateDebut.substring(0,2));
			var mois = parseIntBis(dateDebut.substring(3,5));
			var separ1 = dateDebut.substring(2,3);
			var separ2 = dateDebut.substring(5,6);
			ancdebdate = dateDebut;
			var dureeContrat = parseIntBis(document.getElementById('DureeContrat').value);
			var typeDureeContrat = document.getElementById('TypeDureeContrat').value;
			var dateFin = Parametre_abonnement_DateFin(jour,mois,annee,separ1,separ2,dureeContrat,typeDureeContrat);
			document.getElementById('dateFin').value = dateFin;
			document.getElementById('dateFin').focus();
		}

	} catch(e) {
   	recup_erreur(e);
  }
}


//Fonction qui calcul la date de fin d'abonnement veritable c'est a dire date debut + dureeContrat - 1 jour
function Parametre_abonnement_DateFin(jour,mois,annee,separ1,separ2,dureeContrat,typeDureeContrat) {
	try {
		var dateFin = Parametre_abonnement_DateFinAbonnement(jour,mois,annee,separ1,separ2,dureeContrat,typeDureeContrat);
		var annee = parseIntBis(dateFin.substring(6,10));
		var jour = parseIntBis(dateFin.substring(0,2));
		var mois = parseIntBis(dateFin.substring(3,5));

		return (Parametre_abonnement_DateFinAbonnement(jour,mois,annee,separ1,separ2,-1,1));

	} catch(e) {
		recup_erreur(e);
  }
}


//Fonction qui calcul le le jour de la fin de l'abonnement en ajoutant n'importe quel duree et typeDureeContrat
//Permet egalement de soustraire un nombre de jour, de semaine et de mois
// /!\ ne calcul pas la bonne fin d'abonnement car elle ne soustrait pas -1 jour
function Parametre_abonnement_DateFinAbonnement(jour,mois,annee,separ1,separ2,dureeContrat,typeDureeContrat) {
	try {
	var moisOrigine=mois;
	if (typeDureeContrat==1 || typeDureeContrat==2)	{

		if (typeDureeContrat==2)
		{
			dureeContrat = dureeContrat*7;
		}
		jour = jour + parseIntBis(dureeContrat);

		//pour le cas ou on utilise la fonction pour soustraire une date
		while (jour<=0)
		{
			mois = mois-1; // variable mois2 => variable pour appeler nb_jours
			if (mois==0)	// pour le cas ou le mois trouvé est le premier mois on repasse a 12
			{
				mois=12;
				annee= annee-1;
			}
			if (jour==0)
				jour=nb_jours(mois,annee);
			else
				jour=nb_jours(mois,annee)+jour;
		}
		while ((jour)>nb_jours(mois,annee))
				{

					switch(mois)
					{
						case 1:case 3:case 5:case 7: case 8:case 10:case 12:
							jour=jour-31;break;
						case 4:case 6:case 9:case 11:
							jour=jour-30;break;
						case 2:
	  					if (isBissextile(annee)){
								jour=jour-29;
								}
							else
							{
								jour=jour-28;break;
							}
					}
					mois=mois+1;
					if (mois==13){
						annee=annee+1;
						mois = mois -12;
					}
				}
		}
		else if (typeDureeContrat==3) {
			mois=parseIntBis(mois)+parseIntBis(dureeContrat);
			while (mois<=0){
				annee=annee-1;
				mois = mois + 12;
			}

			while (mois>12){
				annee=annee+1;
				mois = mois - 12;

			}
				var mois2 = mois-1; // variable mois2 => variable pour appeler nb_jours dans le cas ou le nombre de jour est egal au nombre de jour max d'un mois
				if (mois2==0) 	// pour le cas ou le mois trouvé est le premier mois on repasse a 12
					mois2=12;
				else if ((mois2==2) && (moisOrigine==3))
					mois2=mois;

				if (jour==nb_jours(mois2,annee))
					jour =nb_jours(mois,annee);

		}
		else{
			var ancAnnee = annee;
			annee=annee+parseIntBis(dureeContrat);
			if (isBissextile(ancAnnee) && jour==29)
				jour=28;
			if (isBissextile(annee)&&jour==28)
				jour=29;

		}
		if (jour>=1 && jour<=9) jour = "0"+ jour;
		if (mois>=1 && mois<=9) mois = "0"+ mois;

		return jour+separ1+mois+separ2+annee;

	}	catch(e) {
		recup_erreur(e);
	}
}


//fonction qui calcul la date de preavis, on prend la date de fin, on enleve 1,2 ou 3 mois et on ajoute 1 jour
function Parametre_abonnement_date_delai_preavis(dateFin,delai) {
	try {

		var datePreavisTemp=Parametre_abonnement_DateFinAbonnement(	parseIntBis(dateFin.substring(0,2)),
																						parseIntBis(dateFin.substring(3,5)),
																						parseIntBis(dateFin.substring(6,10)),
																						'/','/',-parseIntBis(delai),3);

		var datePreavis = Parametre_abonnement_DateFinAbonnement(	parseIntBis(datePreavisTemp.substring(0,2)),
																						parseIntBis(datePreavisTemp.substring(3,5)),
																						parseIntBis(datePreavisTemp.substring(6,10)),
																						'/','/',1,1);
		return datePreavis;

	}	catch(e) {
		recup_erreur(e);
	}
}


//fonction qui calcul la valeur (HT et TTC) de rachat d'un article en fonction du type (1 = pourcentage, 2 = valeur, 3 les deux)
function Parametre_abonnement_calcul_rachat(type) {
	try {

		var nbEcheance = Parametre_abonnement_nbEcheance();
		var total = parseFloat(nbEcheance*document.getElementById('TotalHT').value);
		var totalTTC = parseFloat(nbEcheance*document.getElementById('TotalTTC').value);
		var Taux_escompte = parseFloat(document.getElementById('Escompte').value/100);
		var valeur = parseFloat(document.getElementById('valeur').value);
		var pourcentage = parseFloat(document.getElementById('pourcentage').value);
		var valeurTTC = 0;
		switch (type) {
		case 1:
			if (!isEmpty(pourcentage) && isTaux(pourcentage)) {
				valeur = parseFloat(total*parseFloat(pourcentage/100));
				valeurTTC = parseFloat(totalTTC*parseFloat(pourcentage/100));
			}
			break;
		case 2:

			if (!isEmpty(valeur) && isPositiveOrNull(valeur)) {
				pourcentage = parseFloat(parseFloat(valeur/total)*100);
				valeurTTC = parseFloat(totalTTC*parseFloat(pourcentage/100));
			}
			break;
		}

		var nf = new NumberFormat("0.00", false);

		document.getElementById('valeur').value = nf.format(valeur);
		document.getElementById('pourcentage').value = nf.format(pourcentage);
		document.getElementById('valeurTTC').value = nf.format(valeurTTC);

	}	catch(e) {
		recup_erreur(e);
	}
}


//fonction qui calcul le nombre d'échéance qui vont être généré (ne marche que si le nombre est pair pour les mois et les années)
function Parametre_abonnement_nbEcheance() {
	try {

		var periodicite = document.getElementById('PeriodFactu').value;
		var typePeriodicite = document.getElementById('TypePeriodicite').value;
		var dureeContrat = document.getElementById('DureeContrat').value;
		var typeDureeContrat = document.getElementById('TypeDureeContrat').value;

		if (typePeriodicite==4)
			periodicite = parseIntBis(periodicite*12);
		if (typeDureeContrat==4)
			dureeContrat = parseIntBis(dureeContrat*12);

		return(dureeContrat/periodicite);

	}	catch(e) {
		recup_erreur(e);
	}
}


function Parametre_abonnement_pressOnPourcentage(ev) {
	try {

	  if (ev.keyCode==13) {
    	Parametre_abonnement_calcul_rachat(1);
	  }

	} catch (e) {
    recup_erreur(e);
  }
}


function Parametre_abonnement_pressOnValeur(ev) {
  try {
  
	  if (ev.keyCode==13) {
			Parametre_abonnement_calcul_rachat(2);
	  }
  
	} catch (e) {
    recup_erreur(e);
  }
}


function Parametre_abonnement_pressOnDuree(ev) {
  try {

		if (ev.keyCode==13) {
			Parametre_abonnement_PutDateFin();
	  }

  } catch (e) {
    recup_erreur(e);
  }
}


function parametre_abonnement_enableJourReglement() {
	try {
		if (document.getElementById('TypeReglement').value==3)
			document.getElementById('jourReglement').disabled=false;
		else
			document.getElementById('jourReglement').disabled=true;

	}	catch(e) {
		recup_erreur(e);
  }
}


function rechercherAdrFact() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterAdrFact);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterAdrFact(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact_fact, contact_liv, contact_envoi) {
  try {

		document.getElementById("Denomination_Fact").value = nom;
		document.getElementById("Adresse_1_Fact").value = adr1;
		document.getElementById("Adresse_2_Fact").value = adr2;
		document.getElementById("Adresse_3_Fact").value = adr3;
		document.getElementById("Code_Postal_Fact").value = cp;
		document.getElementById("Ville_Fact").value = ville;
	  document.getElementById("Code_Pays_Fact").value = code_pays;

	  if (!isEmpty(contact_fact)) {
	  	var qInterFact = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterFact.setParam("Num_Inter", contact_fact);
	  	var result = qInterFact.execute();
	  	var content = result.responseXML.documentElement;
	  	reporterInterFact(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
		menu_abonnement_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function rechercherInterlocuteurFact() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterInterFact);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterInterFact(civ, civ_courte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById("Civ_Inter_Fact").value = civ;
		document.getElementById("Nom_Inter_Fact").value = nom;
		document.getElementById("Prenom_Inter_Fact").value = prenom;
		document.getElementById("Tel_Inter_Fact").value = tel;
		document.getElementById("Fax_Inter_Fact").value = fax;
		document.getElementById("Email_Inter_Fact").value = email;

		menu_abonnement_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function copierFactVersLivEnvoi() {
	try {
		document.getElementById('Denomination_Liv').value = document.getElementById('Denomination_Fact').value;
		document.getElementById("Adresse_1_Liv").value = document.getElementById("Adresse_1_Fact").value;
		document.getElementById("Adresse_2_Liv").value = document.getElementById("Adresse_2_Fact").value;
		document.getElementById("Adresse_3_Liv").value = document.getElementById("Adresse_3_Fact").value;
		document.getElementById("Code_Postal_Liv").value = document.getElementById("Code_Postal_Fact").value;
		document.getElementById("Ville_Liv").value = document.getElementById("Ville_Fact").value;
	  document.getElementById("Code_Pays_Liv").value = document.getElementById("Code_Pays_Fact").value;
	  FactureType_calculerTvaPort();
		selectPaysLiv();

	  document.getElementById("Civ_Inter_Liv").value = document.getElementById("Civ_Inter_Fact").value;
		document.getElementById("Nom_Inter_Liv").value = document.getElementById("Nom_Inter_Fact").value;
		document.getElementById("Prenom_Inter_Liv").value = document.getElementById("Prenom_Inter_Fact").value;
		document.getElementById("Tel_Inter_Liv").value = document.getElementById("Tel_Inter_Fact").value;
		document.getElementById("Fax_Inter_Liv").value = document.getElementById("Fax_Inter_Fact").value;
		document.getElementById("Email_Inter_Liv").value = document.getElementById("Email_Inter_Fact").value;
		
		document.getElementById('Denomination_Envoi').value = document.getElementById('Denomination_Fact').value;
		document.getElementById("Adresse_1_Envoi").value = document.getElementById("Adresse_1_Fact").value;		
		document.getElementById("Adresse_2_Envoi").value = document.getElementById("Adresse_2_Fact").value;
		document.getElementById("Adresse_3_Envoi").value = document.getElementById("Adresse_3_Fact").value;
		document.getElementById("Code_Postal_Envoi").value = document.getElementById("Code_Postal_Fact").value;
		document.getElementById("Ville_Envoi").value = document.getElementById("Ville_Fact").value;
	  document.getElementById("Code_Pays_Envoi").value = document.getElementById("Code_Pays_Fact").value;
	  
	  document.getElementById("Civ_Inter_Envoi").value = document.getElementById("Civ_Inter_Fact").value;
		document.getElementById("Nom_Inter_Envoi").value = document.getElementById("Nom_Inter_Fact").value;		
		document.getElementById("Prenom_Inter_Envoi").value = document.getElementById("Prenom_Inter_Fact").value;
		document.getElementById("Tel_Inter_Envoi").value = document.getElementById("Tel_Inter_Fact").value;
		document.getElementById("Fax_Inter_Envoi").value = document.getElementById("Fax_Inter_Fact").value;
		document.getElementById("Email_Inter_Envoi").value = document.getElementById("Email_Inter_Fact").value;
		
		menu_abonnement_setModifie(true);
	} catch (e) {
		recup_erreur(e);
	}
}


function rechercherAdrLiv() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterAdrLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterAdrLiv(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact_fact, contact_liv, contact_envoi) {
  try {

		document.getElementById("Denomination_Liv").value = nom;
		document.getElementById("Adresse_1_Liv").value = adr1;
		document.getElementById("Adresse_2_Liv").value = adr2;
		document.getElementById("Adresse_3_Liv").value = adr3;
		document.getElementById("Code_Postal_Liv").value = cp;
		document.getElementById("Ville_Liv").value = ville;
	  document.getElementById("Code_Pays_Liv").value = code_pays;
	  FactureType_calculerTvaPort();
	  selectPaysLiv();

		if (!isEmpty(contact_liv)) {
	  	var qInterLiv = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterLiv.setParam("Num_Inter", contact_liv);
	  	var result = qInterLiv.execute();
	  	var content = result.responseXML.documentElement;
	  	reporterInterLiv(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
	  menu_abonnement_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function rechercherAdrEnvoi() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixAdresse.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterAdrEnvoi);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterAdrEnvoi(nom, adr1, adr2, adr3, cp, ville, pays, code_pays, contact_fact, contact_liv, contact_envoi) {
  try {

		document.getElementById("Denomination_Envoi").value = nom;
		document.getElementById("Adresse_1_Envoi").value = adr1;		
		document.getElementById("Adresse_2_Envoi").value = adr2;
		document.getElementById("Adresse_3_Envoi").value = adr3;
		document.getElementById("Code_Postal_Envoi").value = cp;
		document.getElementById("Ville_Envoi").value = ville;
	  document.getElementById("Code_Pays_Envoi").value = code_pays;
	  
	   if (!isEmpty(contact_envoi)) {
	  	var qInterEnvoi = new QueryHttp("Facturation/Clients/getContact.tmpl");
	  	qInterEnvoi.setParam("Num_Inter", contact_envoi);
	  	var result = qInterEnvoi.execute();
	  	var content = result.responseXML.documentElement;
	  	reporterInterEnvoi(content.getAttribute("Civilite"),content.getAttribute("Civ_Courte"),content.getAttribute("Nom"),content.getAttribute("Prenom"),content.getAttribute("Tel"),content.getAttribute("Fax"),content.getAttribute("Email"));
	  }
	  
		menu_abonnement_setModifie(true);

	} catch (e) {
  	recup_erreur(e);
  }
}


function rechercherInterlocuteurLiv() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterInterLiv);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterInterLiv(civ, civ_courte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById("Civ_Inter_Liv").value = civ;
		document.getElementById("Nom_Inter_Liv").value = nom;
		document.getElementById("Prenom_Inter_Liv").value = prenom;
		document.getElementById("Tel_Inter_Liv").value = tel;
		document.getElementById("Fax_Inter_Liv").value = fax;
		document.getElementById("Email_Inter_Liv").value = email;

		menu_abonnement_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}


function rechercherInterlocuteurEnvoi() {
  try {

		var url = "chrome://opensi/content/facturation/user/commun/popup-choixInter.xul?"+ cookie() +"&Client_Id="+ urlEncode(document.getElementById('Client_Id').value);
    window.openDialog(url,'','chrome,modal,centerscreen', reporterInterEnvoi);

	} catch (e) {
  	recup_erreur(e);
  }
}


function reporterInterEnvoi(civ, civ_courte, nom, prenom, tel, fax, email) {
  try {
		document.getElementById("Civ_Inter_Envoi").value = civ;
		document.getElementById("Nom_Inter_Envoi").value = nom;		
		document.getElementById("Prenom_Inter_Envoi").value = prenom;
		document.getElementById("Tel_Inter_Envoi").value = tel;
		document.getElementById("Fax_Inter_Envoi").value = fax;
		document.getElementById("Email_Inter_Envoi").value = email;
		
		menu_abonnement_setModifie(true);
	} catch (e) {
  	recup_erreur(e);
  }
}


function changerAssujettiTVA(b) {
	try {

		assujettiTVA = b;
		document.getElementById('Num_TVA').disabled=!assujettiTVA;
		FactureType_listeTVA();

	}	catch(e) {
		recup_erreur(e);
	}
}




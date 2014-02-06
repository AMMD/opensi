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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var infosExistantes = false;
var numeroration_auto = false;
var currentChampCompte;
var chargementFamille;
var chargerResponsable;

var aFamilles = new Arbre("Facturation/GetRDF/familles_client.tmpl", "Famille");
var aResponsables = new Arbre("ComboListe/combo-responsables.tmpl", "Login_Resp");

function init() {
  try {

  	var qModeTarif = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var p = qModeTarif.execute();
		var mode_tarif = p.responseXML.documentElement.getAttribute('Mode_Tarif');
		numerotation_auto = (p.responseXML.documentElement.getAttribute("Format_NC")!="");
		document.getElementById('Client_Id').disabled = numerotation_auto;
		document.getElementById('Client_Id').collapsed=numerotation_auto;
		document.getElementById('lblAuto').collapsed=!numerotation_auto;

    if (mode_tarif=="Q") {
			document.getElementById('row_codeTarif').collapsed = true;
		}

		selTypeClient('E');
		infosExistantes = (ParamValeur('Infos_Existantes')=='1');
		document.getElementById('Code_Tarif').value = 1;
		document.getElementById('Type_Client').value = 'E';
		document.getElementById('Civilite').value = 1;

		window.outerHeight = 500;
		window.outerWidth = 800;

		var x = (screen.width / 2) - (window.outerWidth / 2);
    var y = (screen.height / 2) - (window.outerHeight / 2);
    window.moveTo(x,y);

		var aPays = new Arbre("Facturation/GetRDF/liste_pays.tmpl", "Code_Pays");
		aPays.initTree(initPays);

  } catch (e) {
    recup_erreur(e);
  }
}


function init2() {
	try {
		if (infosExistantes) {
			var assujettiTVA = (ParamValeur("Assujetti_TVA")=="1");
			document.getElementById('Assujetti_TVA').checked = assujettiTVA;
			changerAssujettiTVA(assujettiTVA);
			if (assujettiTVA) {
				document.getElementById('Type_Client').value = "E";
				selTypeClient("E");
				document.getElementById('Denomination').value = ParamValeur("Denomination_Fact");
				document.getElementById('Num_TVA_Intra').value = ParamValeur("Num_TVA");
				document.getElementById('Civilite').value = ParamValeur("Civ_Inter_Fact");
				document.getElementById('Nom').value = ParamValeur("Nom_Inter_Fact");
				document.getElementById('Prenom').value = ParamValeur("Prenom_Inter_Fact");
			} else {
				document.getElementById('Type_Client').value = "P";
				selTypeClient("P");
				var nom = ParamValeur("Denomination_Fact");
				if (nom.length>30) { nom = nom.substr(0,30); }
				document.getElementById('Nom').value = nom;
				document.getElementById('Civilite').value = "0";
			}
			document.getElementById('Login_Resp').value = ParamValeur("Util_R");
			document.getElementById('Code_Tarif').value = ParamValeur("Code_Tarif");
			document.getElementById('Mode_Reg').value = ParamValeur("Mode_Reg");
			document.getElementById('Adresse_1').value = ParamValeur("Adresse_1_Fact");
			document.getElementById('Adresse_2').value = ParamValeur("Adresse_2_Fact");
			document.getElementById('Adresse_3').value = ParamValeur("Adresse_3_Fact");
			document.getElementById('Code_Postal').value = ParamValeur("Code_Postal_Fact");
			document.getElementById('Ville').value = ParamValeur("Ville_Fact");
			document.getElementById('Code_Pays').value = ParamValeur("Code_Pays_Fact");
			document.getElementById('Tel').value = ParamValeur("Tel_Inter_Fact");
			document.getElementById('Fax').value = ParamValeur("Fax_Inter_Fact");
			document.getElementById('Email').value = ParamValeur("Email_Inter_Fact");
			document.getElementById('Secteur').value = ParamValeur("Secteur_Activite");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function initPays() {
	try {

    document.getElementById('Code_Pays').value = "FR";
    
    chargerResponsable = get_cookie("User");
    aResponsables.setParam("Selection", chargerResponsable);
		aResponsables.initTree(initResponsable);

	} catch (e) {
    recup_erreur(e);
  }
}


function initResponsable() {
	try {

    document.getElementById('Login_Resp').value = chargerResponsable;
    var aModeReg = new Arbre("ComboListe/combo-modesReglement.tmpl", "Mode_Reg");
		aModeReg.initTree(initMode);

	} catch (e) {
    recup_erreur(e);
  }
}


function initMode() {
	try {

		document.getElementById('Mode_Reg').selectedIndex = 0;
		var aCodesTarifs = new Arbre("Facturation/GetRDF/liste_types_tarifs.tmpl", "Code_Tarif");
		aCodesTarifs.initTree(initCodeTarif);

	} catch (e) {
    recup_erreur(e);
  }
}


function initCodeTarif() {
	try {
		document.getElementById('Code_Tarif').selectedIndex=0;
		aFamilles.initTree(initSecteur);
	} catch (e) {
		recup_erreur(e);
	}
}

function initSecteur() {
	try {
		document.getElementById('Famille').selectedIndex=0;
		var aSecteurs = new Arbre("Facturation/GetRDF/secteurs_activite.tmpl", "Secteur");
		aSecteurs.initTree(initType);
	} catch (e) {
		recup_erreur(e);
	}
}


function initType() {
  try {

		document.getElementById('Secteur').selectedIndex=0;
		var arbre_type=new Arbre("Facturation/GetRDF/liste-typesSociete.tmpl","Type_Societe");
		arbre_type.initTree(initTypeIndex);

  } catch (e) {
    recup_erreur(e);
  }
}


function initTypeIndex() {
	try {

		selectTypeSociete('SARL');
		init2();

	} catch (e) {
		recup_erreur(e);
	}
}

function selectTypeSociete(typeSociete) {
	try {
		var selected = false;
		var i=0;
		var menulist = document.getElementById('Type_Societe');
		var items = menulist.getElementsByTagName("menuitem");
		while (!selected && i<items.length) {
			if (items[i].getAttribute("label")==typeSociete) {
				menulist.selectedIndex = i;
				selected = true;
			}
			i++;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function selTypeClient(t) {
  try {

		switch(t) {
			case 'P':	document.getElementById('bcParticulier').collapsed = true;
								document.getElementById('rowType_Societe').collapsed = true;
								if (!infosExistantes) {
									document.getElementById('Assujetti_TVA').checked = false;
									changerAssujettiTVA(false);
								}
								break;
			case 'E':	document.getElementById('bcParticulier').collapsed = false;
								document.getElementById('rowType_Societe').collapsed = false;
								if (!infosExistantes) {
									document.getElementById('Assujetti_TVA').checked = true;
									changerAssujettiTVA(true);
								}
								break;
			case 'O': document.getElementById('bcParticulier').collapsed = false;
								document.getElementById('rowType_Societe').collapsed = true;
								if (!infosExistantes) {
									document.getElementById('Assujetti_TVA').checked = false;
									changerAssujettiTVA(false);
								}
								break;
			case 'A': document.getElementById('bcParticulier').collapsed = false;
								document.getElementById('rowType_Societe').collapsed = true;
								break;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function existeClient(code_client) {
  try {

		var qExiste = new QueryHttp("Facturation/Clients/existeClient.tmpl");
		qExiste.setParam("Client_Id",code_client);
		var p = qExiste.execute();

  	return p.responseXML.documentElement.getAttribute('existe')=="true";

  } catch (e) {
    recup_erreur(e);
  }
}


function enregistrer() {
	try {

		var client_id = document.getElementById('Client_Id').value;
		var raison_sociale = document.getElementById('Denomination').value;
		var civilite = document.getElementById('Civilite').value;
		var nom = document.getElementById('Nom').value;
		var prenom = document.getElementById('Prenom').value;
		var adresse_1 = document.getElementById('Adresse_1').value;
		var adresse_2 = document.getElementById('Adresse_2').value;
		var adresse_3 = document.getElementById('Adresse_3').value;
		var code_postal = document.getElementById('Code_Postal').value;
		var ville = document.getElementById('Ville').value;
		var code_pays = document.getElementById('Code_Pays').value;
		var tel = document.getElementById('Tel').value;
		var fax = document.getElementById('Fax').value;
		var email = document.getElementById('Email').value;
		var type_societe = document.getElementById('Type_Societe').value;
		var assujetti_tva = (document.getElementById('Assujetti_TVA').checked?1:0);
		var num_tva_intra = (document.getElementById('Assujetti_TVA').checked?document.getElementById('Num_TVA_Intra').value:"");
		var famille = document.getElementById('Famille').value;
		var secteur_id = document.getElementById('Secteur').value;
		var util_R = document.getElementById('Login_Resp').value;
		var type_client = document.getElementById('Type_Client').value;
		var numero_compte = document.getElementById('Numero_Compte').value;
		var code_tarif = document.getElementById('Code_Tarif').value;
		var mode_reg = document.getElementById('Mode_Reg').value;

		var saveOK = false;

		if (!numerotation_auto && isEmpty(client_id)) {	showWarning("Veuillez spécifier un code client !"); }
		else if (!numerotation_auto && existeClient(client_id)) {	showWarning("Le code client '"+ client_id +"' est déjà utilisé !"); }
		else if (!numerotation_auto && !isCleAlpha(client_id)) { showWarning("Code client invalide !"); }
		else if (type_client!="P" && isEmpty(raison_sociale)) { showWarning("Veuillez spécifier la raison sociale du client !"); }
		else if (type_client=="P" && isEmpty(nom)) { showWarning("Veuillez spécifier le nom du client !"); }
		else if (isEmpty(adresse_1)) { showWarning("Veuillez spécifier l'adresse du client !"); }
		else if (isEmpty(ville)) { showWarning("Veuillez spécifier la ville du client !"); }
		else if (!isEmpty(tel) && !isPhone(tel)) { showWarning("Numéro de téléphone incorrect !"); }
		else if (!isEmpty(fax) && !isPhone(fax)) { showWarning("Numéro de fax incorrect !"); }
		else if (!isEmpty(email) && !isEmail(email)) { showWarning("Adresse e-mail incorrecte !"); }
		else {

			saveOK = true;
			if (assujetti_tva && type_client=="P") {
				showWarning("Attention : vous avez coché la case assujetti à la tva bien que votre client soit un particulier !");
			} else if (assujetti_tva && type_client=="O") {
				showWarning("Attention : vous avez coché la case assujetti à la tva bien que votre client soit un organisme public !");
			} else if (!assujetti_tva && type_client=="E") {
				showWarning("Attention : vous n'avez pas coché la case assujetti à la tva bien que votre client soit une entreprise !");
			}

			if (assujetti_tva && code_pays!="FR" && isEmpty(num_tva_intra)) {
				var qZoneUE = new QueryHttp("GetPays.tmpl");
				qZoneUE.setParam("Code_Pays", code_pays);
				var result = qZoneUE.execute();
				if (result.responseXML.documentElement.getAttribute("zone_ue")=="1") {
					saveOK = (window.confirm("Vous n'avez pas saisi le numéro de tva intra-communautaire ! Continuer ?"));
				}
			}

			if (saveOK) {
				var qEnregistrer = new QueryHttp("Facturation/Clients/creerClientExpress.tmpl");
				if (!numerotation_auto) {
					qEnregistrer.setParam("Client_Id", client_id);
				}
				qEnregistrer.setParam("Denomination", raison_sociale);
				qEnregistrer.setParam("Civilite", civilite);
				qEnregistrer.setParam("Nom", nom);
				qEnregistrer.setParam("Prenom", prenom);
				qEnregistrer.setParam("Adresse_1", adresse_1);
				qEnregistrer.setParam("Adresse_2", adresse_2);
				qEnregistrer.setParam("Adresse_3", adresse_3);
				qEnregistrer.setParam("Code_Postal", code_postal);
				qEnregistrer.setParam("Ville", ville);
				qEnregistrer.setParam("Code_Pays", code_pays);
				qEnregistrer.setParam("Tel", tel);
				qEnregistrer.setParam("Fax", fax);
				qEnregistrer.setParam("Email", email);
				qEnregistrer.setParam("Type_Societe", type_societe);
				qEnregistrer.setParam("Assujetti_TVA", assujetti_tva);
				qEnregistrer.setParam("Num_TVA_Intra", num_tva_intra);
				qEnregistrer.setParam("Famille", famille);
				qEnregistrer.setParam("Secteur_Id", secteur_id);
				qEnregistrer.setParam("Util_R", util_R);
				qEnregistrer.setParam("Type_Client", type_client);
				qEnregistrer.setParam("Numero_Compte", numero_compte);
				qEnregistrer.setParam("Code_Tarif", code_tarif);
				qEnregistrer.setParam("Mode_Reg", mode_reg);
				
				var result = qEnregistrer.execute();
				if (numerotation_auto) {
					if (result.responseXML.documentElement.getAttribute("Client_Id")=="") {
						showMessage("Erreur : le format de numérotation actuel ne permet plus de générer de numéros client pour la période définie !");
						saveOK=false;
					} else {
						client_id = result.responseXML.documentElement.getAttribute("Client_Id");
						document.getElementById("Client_Id").value = client_id;
					}
				}
			}

		}

		return saveOK;

	} catch (e) {
		recup_erreur(e);
	}
}


function ouvrirClient() {
  try {

		if (enregistrer()) {
			window.arguments[0](document.getElementById("Client_Id").value);
			window.close();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirEditionListe() {
	try {
		var url = "chrome://opensi/content/facturation/user/commun/popup-ajouterElementListe.xul?"+ cookie() +"&Type_Element=FCLIENT";
    window.openDialog(url,'','chrome,modal,centerscreen', chargerFamille);
	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamille(selection) {
	try {
		chargementFamille = selection;
		aFamilles.setParam("Selection", chargementFamille);
		aFamilles.initTree(initFamilleClient);
	} catch (e) {
		recup_erreur(e);
	}
}

function initFamilleClient() {
	try {
		document.getElementById('Famille').value = chargementFamille;
	} catch (e) {
		recup_erreur(e);
	}
}


function rechcompte(id) {
	try {

		currentChampCompte = id;
		var debCompte="0";
		var typeCompte="C";
    var url ="chrome://opensi/content/config/util/rechcompte.xul?"+ cookie();
    url += "&Force_Deb="+debCompte;
    url += "&Type_Compte="+ typeCompte;
    url += "&nom=CLIENT";
    url += "&Creer=false";
    url += "&Num_Compte="+ urlEncode(debCompte);
    window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherCompte);

	} catch (e) {
		recup_erreur(e);
	}
}

function retourRechercherCompte(numCompte) {
	try {
		
		document.getElementById(currentChampCompte).value = numCompte;

	} catch (e) {
		  recup_erreur(e);
	}
}


function changerAssujettiTVA(etat) {
	try {

		document.getElementById('row_tva').collapsed=!etat;

	}	catch(e) {
		recup_erreur(e);
	}
}


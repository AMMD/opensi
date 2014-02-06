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


var opc_Classe = -1;
var opc_numero_compte;
var opc_Code_Plan;
var opc_nomClasse = new Array(10);
var opc_Numero_Compte_Clients;
var opc_Numero_Compte_Fournisseurs;
var opc_currentChampCompte;

var opc_actAnalytique;
var opc_ventilationId;
var opc_compteAnaId;

var opc_aClasses = new Arbre('Compta/GetRDF/listeClassesComptes.tmpl' , 'opc-Compte');
var opc_aProfil = new Arbre('Compta/GetRDF/listeProfilCompte.tmpl' , 'opc-liste_profil_compte');

var opc_aVentilations;


function opc_init() {
	try {
		opc_aVentilations = new Arbre("Compta/Analytique/Comptes/listeVentilations.tmpl", 'opc-treeVentilations');
		opc_activeGroupeVentilation(false);
		
		var aTxTva = new Arbre('Facturation/GetRDF/taux_tva.tmpl', 'opc-Code_TVA');
		aTxTva.initTree(opc_initTva);
		
		// activation compta ana
		var qChargerPrefs = new QueryHttp("Config/comptabilite/preferences/getPreferences.tmpl");
		var result = qChargerPrefs.execute();
		opc_actAnalytique = (result.responseXML.documentElement.getAttribute('Act_Analytique')=="1");
		document.getElementById('opc-groupeVentilation').collapsed = !opc_actAnalytique;
		
		document.getElementById('opc-numeroAna').readOnly = true;
	} catch (e) {
		recup_erreur(e);
	}
}


function opc_initTva() {
	try {

		document.getElementById('opc-Code_TVA').selectedIndex = 0;
		var aPlan = new Arbre('Config/GetRDF/listePlan.tmpl', 'opc-Plan');
		aPlan.initTree(opc_initPlan);

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_initPlan() {
	try {

		document.getElementById('opc-Plan').selectedIndex = 0;
		var aDossier = new Arbre("Compta/GetRDF/liste_dossier.tmpl", 'opc-dossier');	
		aDossier.initTree(opc_selDossier);

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_selDossier() {
	try {

		document.getElementById("opc-dossier").selectedIndex = 0;
		document.getElementById("opc-Niveau").value = "2";
		opc_nouveauCompte();
		opc_Classe = -1;
		opc_tab(opc_Classe);
		opc_choisirPlan();
			
	} catch (e) {
		recup_erreur(e);
	}
}


function opc_import_compte() {
	try {

		var dossier = document.getElementById("opc-dossier").value;	
		if (dossier!="") {

			var dlg = "confirmez-vous la copie des comptes du plan comptable du dossier "+ dossier+ " dans le dossier "+get_cookie('Dossier_Id')+ "(import des nouveaux comptes) "
			if (window.confirm(dlg) ) {
				var queryEdit = new QueryHttp("Compta/Config/plan_comptable/copieComptesDossier.tmpl");
				queryEdit.setParam("Dossier_Id", dossier);				
				var result = queryEdit.execute();
				
				var errors = new Errors(result);

				if (errors.hasNext()) {		
					errors.show();
				}
				else {
					showMessage("La liste des comptes a été mise à jour");
					opc_init();
				}
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function opc_choisirPlan() {
	try {

		var qDossier = new QueryHttp("Config/dossiers/getDossier.tmpl");
		qDossier.execute(opc_choisirPlan_2);

	} catch (e) {
    recup_erreur(e);
  }
}


function opc_choisirPlan_2(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		opc_Code_Plan = contenu.getAttribute('Code_Plan');
		opc_Numero_Compte_Clients = contenu.getAttribute('Numero_Compte_Clients');
		opc_Numero_Compte_Fournisseurs = contenu.getAttribute('Numero_Compte_Fournisseurs');

		var qPlan = new QueryHttp("Compta/Config/plan_comptable/getPlan.tmpl");
		qPlan.execute(opc_choisirPlan_3);

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_choisirPlan_3(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		opc_Libelle = contenu.getAttribute('Libelle');
		opc_Code = contenu.getAttribute('Code');
		document.getElementById("opc-nomPlan").value = "Plan comptable actuel : "+ opc_Libelle;
		opc_enregistrerTitre();

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_niv() {
	try {
		opc_tab(opc_Classe);
	} catch (e) {
		recup_erreur(e);
	}
}


function opc_tab(Cl) {
	try {

		opc_Classe = Cl;
		document.getElementById("opc-nomClasse").value = (opc_Classe==-2?"Auxiliaires":opc_nomClasse[opc_Classe+1]);

		var Niveau = document.getElementById("opc-Niveau").value;
    
		document.getElementById("opc-num").flex = (opc_Classe>0?Niveau:1);
		document.getElementById("opc-Niveau").disabled = (opc_Classe<=0);

		opc_aClasses.setParam('Niveau',Niveau);
		opc_aClasses.setParam('Classe',opc_Classe);
		opc_aClasses.setParam('Code',opc_Code_Plan);
		opc_aClasses.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function opc_enregistrerTitre() {
	try {
		
		var qTitre = new QueryHttp("Compta/Config/plan_comptable/getTitrePlan.tmpl");
		qTitre.setParam('Code_Plan', opc_Code_Plan);
		var result = qTitre.execute();

		for (var i=0;i<opc_nomClasse.length;i++) {
			opc_nomClasse[i]="";
		}

		opc_nomClasse[0]="Clients";
		opc_nomClasse[1]="Fournisseurs";
		var ent = result.responseXML.documentElement.getElementsByTagName('Entete');

		for (var i=0;i<ent.length;i++) {
			var nom = ent.item(i).getAttribute('libelle');
			var numero = ent.item(i).getAttribute('num');
			var num = parseInt(numero);
			opc_nomClasse[num+1] = "Classe "+ (num) +" - "+ nom;
		}

		document.getElementById("opc-nomClasse").value = opc_nomClasse[opc_Classe+1];
		setTimeout("document.getElementById('opc-Plan').value=opc_Code_Plan", 200);

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_ouvrirCompte() {
	try {

		var t = document.getElementById('opc-Compte');

		if (t.view!=null && t.currentIndex!=-1) {

			opc_numero_compte = getCellText(t,t.currentIndex,'opc-num');

			if (opc_numero_compte!='' && opc_numero_compte.length==8) {
				document.getElementById('opc-bSupprimer').disabled = false;
				document.getElementById('opc-Numero_Compte').disabled = true;
				
				var qCompte = new QueryHttp("Compta/Config/plan_comptable/getCompte.tmpl");
				qCompte.setParam('Numero_Compte', opc_numero_compte);
				var result = qCompte.execute();	
				
				if (opc_numero_compte.substring(0,1)=='0') {
					var comptesIdentiques = (opc_numero_compte==opc_Numero_Compte_Clients || opc_numero_compte==opc_Numero_Compte_Fournisseurs);
					document.getElementById("opc-Type_Compte").disabled = comptesIdentiques;
				}
		
				
				var contenu = result.responseXML.documentElement;
				
				var existeMvts = (contenu.getAttribute('Existe_Mvts')=="true");
				document.getElementById('opc-Type_Compte').disabled = existeMvts;
				document.getElementById('opc-Collectif').disabled = existeMvts;
				document.getElementById('opc-bRechCollectif').disabled = existeMvts;
				
				document.getElementById('opc-Numero_Compte').value = contenu.getAttribute('Numero_Compte');
				document.getElementById('opc-Intitule').value = contenu.getAttribute('Intitule');
				document.getElementById('opc-Type_Compte').value = contenu.getAttribute('Type_Compte');
				opc_pressOnTypeCompte();
				document.getElementById('opc-chkCentralisateur').checked = (contenu.getAttribute('Centralisateur') == "1");
				document.getElementById('opc-Code_TVA').value = contenu.getAttribute('Code_TVA');
				document.getElementById('opc-Cumul_Journal').checked = (contenu.getAttribute('Cumul_Journal') == "1");
				document.getElementById('opc-Detail_Cloture').checked = (contenu.getAttribute('Detail_Cloture') == "1");
				document.getElementById('opc-Tva_Encaissement').checked = (contenu.getAttribute('Tva_Encaissement')== "1");
				document.getElementById('opc-Collectif').value = contenu.getAttribute('Collectif');
				document.getElementById('opc-Contrepartie').value = contenu.getAttribute('Contrepartie');
				
				opc_leaveNumero_Compte();
				
				opc_remplir_tabsoldes();
				opc_remplir_tabprofil();
				opc_liste_profil();
				
				// gestion analytique
				if (opc_isCompteChargeOuProduit(opc_numero_compte)) {
					opc_annulerAna();
					opc_activeGroupeVentilation(true);
					opc_initArbreVentilations();
				}
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function opc_recherche_compte(numero_compte,id) {
  try {		
		
  	opc_currentChampCompte = id;
    var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Creer=false&Num_Compte="+urlEncode(numero_compte);
    if (id=="opc-Collectif") { url += "&Type_Rech=C"; }
    window.openDialog(url,'','chrome,modal,centerscreen',opc_retourRechercheCompte);

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_retourRechercheCompte(numCompte) {
	try {
	
		document.getElementById(opc_currentChampCompte).value = numCompte;
		
	} catch (e) {
		  recup_erreur(e);
	}
}


function opc_remplir_tabsoldes() {
	try {

		var qInfosCompte = new QueryHttp("Compta/Config/plan_comptable/soldesCompte.tmpl");
		qInfosCompte.setParam("Numero_Compte", opc_numero_compte);
		var result = qInfosCompte.execute();
	
		var contenu = result.responseXML.documentElement;
	
		document.getElementById('opc-debit_compte').value = contenu.getAttribute('DebitN');
		document.getElementById('opc-credit_compte').value = contenu.getAttribute('CreditN');
	
		document.getElementById('opc-old_debit_compte').value = contenu.getAttribute('DebitN1');
		document.getElementById('opc-old_credit_compte').value = contenu.getAttribute('CreditN1');
	
		document.getElementById('opc-old_2_debit_compte').value = contenu.getAttribute('DebitN2');
		document.getElementById('opc-old_2_credit_compte').value = contenu.getAttribute('CreditN2');
		
	} catch (e) {
		recup_erreur(e);
	}
}


function opc_remplir_tabprofil() {
	try {
		opc_aProfil.setParam("Numero_Compte", opc_numero_compte);
		opc_aProfil.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_liste_profil() {
	try {
		document.getElementById('opc-listeprofil').collapsed = false;
		var lProfil = new Arbre('Compta/GetRDF/listeProfilEntrepriseDossier.tmpl' , 'opc-liste_profil');
		lProfil.initTree(opc_initListeProfil);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_initListeProfil() {
	try {

		document.getElementById('opc-liste_profil').selectedIndex=0;
		document.getElementById('opc-bAjouterProfil').disabled=true;
		document.getElementById('opc-bSupprimerProfil').disabled=true;

	} catch (e) {
		recup_erreur(e);
	}
}

function opc_pressOnListeProfils() {
	try {
		document.getElementById('opc-bAjouterProfil').disabled = (document.getElementById('opc-liste_profil').selectedIndex==0);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_selectProfil() {
	try {
		document.getElementById('opc-bSupprimerProfil').disabled = false;
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_ajouterProfil() {
	try {
		var profilId=document.getElementById("opc-liste_profil").value;
		var nomProfil=document.getElementById("opc-liste_profil").getAttribute("label");
		
		if (opc_numero_compte!="" && profilId!="[Choisir]" ) {
			
			var qGetUtil = new QueryHttp("Compta/Config/plan_comptable/ajouterProfilCompte.tmpl");
			qGetUtil.setParam("Numero_Compte", opc_numero_compte);
			qGetUtil.setParam("Profil_Id", profilId);
			
			var result = qGetUtil.execute();
			var contenu = result.responseXML.documentElement;
			var message = result.responseXML.documentElement.getAttribute("message");
		
			if (message=="0") {
				showMessage("Le profil "+ nomProfil +" existe déjà !");
			}
			else if (message=="1") {
				opc_remplir_tabprofil();
				opc_initListeProfil();
			}
		} 
	}
	catch (e) {
		recup_erreur(e);
	}
}


function opc_supprimerProfil() {
	try {
		var tree = document.getElementById('opc-liste_profil_compte');
		var rangeCount = tree.view.selection.getRangeCount();

		for (var i=0; i<rangeCount; i++) {
			var start = {};
			var end = {};
			tree.view.selection.getRangeAt(i,start,end);

			for (var c=start.value; c<=end.value; c++) {			
				var profilId = getCellText(tree,c,'opc-ColProfil_Id');
				var qEnleverProfil = new QueryHttp("Compta/Config/plan_comptable/supProfilDossierCompte.tmpl");
				qEnleverProfil.setParam("Profil_Id", profilId);
				qEnleverProfil.setParam("Numero_Compte", opc_numero_compte);
				qEnleverProfil.execute();
			}
		}
		opc_remplir_tabprofil();
		opc_initListeProfil();
	} catch (e) {
		recup_erreur(e);
	}
}


function opc_nouveauCompte() {
	try {
		
		if (opc_aClasses.isSelected()) {
			opc_aClasses.select(-1);
		}
		
		opc_numero_compte = "";

		document.getElementById('opc-debit_compte').value = "";
		document.getElementById('opc-credit_compte').value = "";   	
		document.getElementById('opc-old_debit_compte').value = "";
		document.getElementById('opc-old_credit_compte').value = "";   	
		document.getElementById('opc-old_2_debit_compte').value = "";
		document.getElementById('opc-old_2_credit_compte').value = "";
		opc_aProfil.deleteTree();
		document.getElementById("opc-Detail_Cloture").checked =true;
		document.getElementById("opc-Cumul_Journal").checked = false;
		document.getElementById("opc-Tva_Encaissement").checked = false;
		document.getElementById('opc-Contrepartie').value = '';
		document.getElementById('opc-Collectif').value = '';
			
		document.getElementById('opc-listeprofil').collapsed = true;
		document.getElementById('opc-Numero_Compte').disabled = false;
		document.getElementById('opc-Numero_Compte').value = '';
		
		document.getElementById('opc-Intitule').value = '';
		
		document.getElementById('opc-bSupprimer').disabled = true;

		document.getElementById('opc-Code_TVA').selectedIndex = 0;
		document.getElementById('opc-Type_Compte').value = "G";
		document.getElementById("opc-Type_Compte").disabled = false;
		document.getElementById('opc-Collectif').disabled = false;
		document.getElementById('opc-bRechCollectif').disabled = false;
		
		opc_pressOnTypeCompte();
		document.getElementById("opc-rTva").collapsed = false;
		
		// gestion de la compta analytique
		opc_annulerAna();
		opc_initArbreVentilations();
		opc_activeGroupeVentilation(false);

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_leaveNumero_Compte() {
	try {

		var numero_compte = document.getElementById('opc-Numero_Compte').value;
		var racineCompte = numero_compte.substring(0,1);
		document.getElementById("opc-rTva").collapsed = (racineCompte!='6' && racineCompte!='7');
    
	} catch (e) {
		recup_erreur(e);
	}
}


function opc_supprimerCompte() {
	try {

		if (opc_numero_compte=='40100000' || opc_numero_compte=='41100000' || opc_numero_compte=='12000000') {
			showWarning("Le compte '"+ opc_numero_compte +"' ne peut pas être supprimé !");
		}
		else if (opc_numero_compte==opc_Numero_Compte_Clients || opc_numero_compte==opc_Numero_Compte_Fournisseurs) {
			showWarning("Le compte '"+ opc_numero_compte +"' ne peut pas être supprimé car c'est un compte par défaut !");
		}
		else if (window.confirm('Confirmez-vous la suppression du compte "'+ opc_numero_compte +'" ?')) {

			var qSupCpte = new QueryHttp("Compta/Config/plan_comptable/supprimerCompte.tmpl");
			qSupCpte.setParam("Numero_Compte", opc_numero_compte);
			var result = qSupCpte.execute();
			
			var errors = new Errors(result);
			if (errors.hasNext()) {		
				errors.show();
			} else {
				showMessage("Le compte "+ opc_numero_compte+" a été supprimé avec succès !");
				
				opc_nouveauCompte();
				opc_tab(opc_Classe);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_enregistrerCompte() {
	try {
		
		var numeroCompte = document.getElementById('opc-Numero_Compte').value;
		var intitule = document.getElementById('opc-Intitule').value;
		var typeCompte = document.getElementById('opc-Type_Compte').value;
		var codeTVA = document.getElementById('opc-Code_TVA').value;
		var cumulJournal = document.getElementById('opc-Cumul_Journal').checked;
		var detailCloture = document.getElementById('opc-Detail_Cloture').checked;
		var tvaEncaissement = document.getElementById('opc-Tva_Encaissement').checked;
		var collectif = document.getElementById('opc-Collectif').value;
		var contrepartie = document.getElementById('opc-Contrepartie').value;
		var creation = (opc_numero_compte!=numeroCompte);
		
		if (isEmpty(numeroCompte)) { showWarning('Veuillez saisir un numéro de compte !'); }
		else if (isEmpty(intitule)) { showWarning('Veuillez saisir un libellé !'); }
		else if (!isCompteCorrect(numeroCompte)) { showWarning('Le numéro de compte est incorrect !'); }
		else if (typeCompte=="G" && (numeroCompte.charAt(0)<'1' || numeroCompte.charAt(0)>'7')) { showWarning("Le numéro de compte doit commencer par un chiffre de 1 à 7 !"); }
		else if (typeCompte!="G" && numeroCompte.charAt(0)>'0' && numeroCompte.charAt(0)<'9') { showWarning("Le numéro de compte ne doit pas commencer par un chiffre de 1 à 8 !"); }
		else if (typeCompte!="G" && !isCompteCorrect(collectif)) { showWarning("Le compte collectif doit être rempli !"); }
		else if (typeCompte=="F" && collectif.substr(0,3)!="401") { showWarning("La racine du compte collectif doit être 401 !"); }
		else if (typeCompte=="C" && collectif.substr(0,3)!="411") { showWarning("La racine du compte collectif doit être 411 !"); }
		else if (typeCompte=="A" && (collectif.substr(0,3)=="401" || collectif.substr(0,3)=="411")) { showWarning("La racine du compte collectif ne doit pas être 401 ni 411 !"); }
		
		else if (window.confirm("Confirmez-vous l'enregistrement du compte '"+ numeroCompte +"' ?")) {

			var qSaveCpte = new QueryHttp("Compta/Config/plan_comptable/saveCompte.tmpl");
			
			qSaveCpte.setParam('Numero_Compte', numeroCompte);
			qSaveCpte.setParam('Intitule', intitule);
			qSaveCpte.setParam('Type_Compte', typeCompte);
			qSaveCpte.setParam('Code_TVA', codeTVA);
			qSaveCpte.setParam('Cumul_Journal', cumulJournal);
			qSaveCpte.setParam('Detail_Cloture', detailCloture);
			qSaveCpte.setParam('Collectif', collectif);
			qSaveCpte.setParam('Contrepartie', contrepartie);
			qSaveCpte.setParam('Tva_Encaissement', tvaEncaissement);
			qSaveCpte.setParam('Creation', creation);
			
			var result = qSaveCpte.execute();
			
			var errors = new Errors(result);
			if (errors.hasNext()) {
				errors.show();
			} else {
				opc_nouveauCompte();
				opc_tab(opc_Classe);
			}
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_enregistrerPlan() {
	try {

		var qMajPlan = new QueryHttp("Compta/Config/plan_comptable/modifierPlan.tmpl");
		qMajPlan.setParam("NouvCode", document.getElementById('opc-Plan').value);
		var result = qMajPlan.execute();

		if (result.responseXML.documentElement.getAttribute("message")!="fini") {
			showWarning("Erreur dans le changement de plan comptable !");
		}

		opc_choisirPlan();
		opc_tab(-1);

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_keypress(e,id,p) {
  try {

		if (e.keyCode==13) {			       
	    	if (id=="opc-Contrepartie" || id=="opc-Collectif") {					
	    		opc_recherche_compte(p, id);
	    	}  
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function opc_pressOnTypeCompte() {
	try {
		var typeCompte = document.getElementById('opc-Type_Compte').value;
		document.getElementById('opc-Collectif').value="";
		document.getElementById('opc-rCollectif').collapsed = (typeCompte=="G");
		
		document.getElementById('opc-Detail_Cloture').checked = true;
		document.getElementById('opc-rDetail').collapsed = (typeCompte=="G");
		
		document.getElementById('opc-chkCentralisateur').checked = false;
		document.getElementById('opc-rCentralisateur').collapsed = (typeCompte!="G");
		
		document.getElementById('opc-Contrepartie').value="";
		document.getElementById("opc-rContrepartie").collapsed = (typeCompte=="G");

	} catch (e) {
		recup_erreur(e);
	}
}

function opc_isCompteChargeOuProduit(num) {
	try {
		val = num.toString();
    	return (val.charAt(0)=='6' || val.charAt(0)=='7');
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_activeGroupeVentilation(boolean) {
	try {
		document.getElementById('opc-treeVentilations').disabled = !boolean;
		opc_activeFlechesVentilation(boolean);
		opc_activeMenuVentilation(boolean);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_activeFlechesVentilation(boolean) {
	try {
		document.getElementById('opc-bFlecheHaut').disabled = !boolean || opc_aVentilations.getCurrentIndex()==-1 || opc_aVentilations.getCurrentIndex()==0;
		document.getElementById('opc-bFlecheBas').disabled = !boolean || opc_aVentilations.getCurrentIndex()==-1 || opc_aVentilations.getCurrentIndex()==(opc_aVentilations.nbLignes()-1);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_activeMenuVentilation(boolean) {
	try {
		document.getElementById('opc-numeroAna').disabled = !boolean;
		document.getElementById('opc-bRechercheCompteAna').disabled = !boolean;
		document.getElementById('opc-libelleAna').disabled = !boolean;
		document.getElementById('opc-ventilation').disabled = !boolean;
		document.getElementById('opc-bAnnulerAna').disabled = !boolean;
		document.getElementById('opc-bValiderAna').disabled = !boolean || opc_compteAnaId==0;
		document.getElementById('opc-bSupprimerAna').disabled = !boolean || opc_ventilationId==0;
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_initArbreVentilations() {
	try {
		opc_aVentilations.clearParams();
		if (!isEmpty(opc_numero_compte)) {
			opc_aVentilations.setParam("Compte_Gen", opc_numero_compte);
		}
		opc_aVentilations.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_selectOnTreeVentilation() {
	try {
		if (opc_aVentilations.isSelected()) {
			var index = opc_aVentilations.getCurrentIndex();
 			
			opc_ventilationId = opc_aVentilations.getCellText(index,'opc-colVentilationId');
			opc_compteAnaId = opc_aVentilations.getCellText(index,'opc-colCompteAnaId');
			
			document.getElementById('opc-numeroAna').value = opc_aVentilations.getCellText(index,'opc-colNumeroAna');
			document.getElementById('opc-libelleAna').value = opc_aVentilations.getCellText(index,'opc-colLibelleAna');
			document.getElementById('opc-ventilation').value = opc_aVentilations.getCellText(index,'opc-colVentilation');
			
			opc_activeMenuVentilation(true);
			opc_activeFlechesVentilation(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_pressOnFlecheHaut() {
	try {
		opc_activeFlechesVentilation(false);
		opc_deplacerLigneHaut();
		opc_activeFlechesVentilation(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_pressOnFlecheBas() {
	try {
		opc_activeFlechesVentilation(false);
		opc_deplacerLigneBas();
		opc_activeFlechesVentilation(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_deplacerLigneHaut() {
	try {
		var querySave = new QueryHttp("Compta/Analytique/Comptes/saveVentilationRank.tmpl");
		
		querySave.setParam("Ventilation_Id", opc_ventilationId);
		querySave.setParam("Sens", "Haut");
		
		var result = querySave.execute();
		var errors = new Errors(result);
		
		if (errors.hasNext()) {
			errors.show();
		} else {
			opc_aVentilations.deleteTree();
			opc_aVentilations.initTree();
			opc_annulerAna();
			opc_activeFlechesVentilation(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_deplacerLigneBas() {
	try {
		var querySave = new QueryHttp("Compta/Analytique/Comptes/saveVentilationRank.tmpl");
		
		querySave.setParam("Ventilation_Id", opc_ventilationId);
		querySave.setParam("Sens", "Bas");
		
		var result = querySave.execute();
		var errors = new Errors(result);
		
		if (errors.hasNext()) {
			errors.show();
		} else {
			opc_aVentilations.deleteTree();
			opc_aVentilations.initTree();
			opc_annulerAna();
			opc_activeFlechesVentilation(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_pressOnRechercheCompteAna() {
	try {
		opc_activeMenuVentilation(false);
		opc_rechercheCompteAna(document.getElementById('opc-numeroAna').value);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_rechercheCompteAna(numero) {
	try {
		var url = "chrome://opensi/content/compta/user/analytique/comptes/popup-rechCompteAna.xul?"+ cookie();
    	window.openDialog(url,'','chrome,modal,centerscreen',opc_finRechercheCompteAna,urlEncode(numero));
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_finRechercheCompteAna(id ,numero) {
	try {
		opc_compteAnaId = id;
		document.getElementById('opc-numeroAna').value = numero;
		// load libellé compte ana
		var qGetCompte = new QueryHttp("Compta/Analytique/Comptes/getCompte.tmpl");
		qGetCompte.setParam("Compte_Id", opc_compteAnaId);
		
		var result = qGetCompte.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
			opc_annulerAna();
		} else {
			document.getElementById('opc-numeroAna').value = result.responseXML.documentElement.getAttribute('Numero');
			document.getElementById('opc-libelleAna').value = result.responseXML.documentElement.getAttribute('Intitule');	
		}
		opc_activeMenuVentilation(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_pressOnAnnulerAna() {
	try {
		opc_activeMenuVentilation(false);
		opc_annulerAna();
		opc_activeFlechesVentilation(true);
		opc_activeMenuVentilation(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_pressOnValiderAna() {
	try {
		// verif libelle
		if (isEmpty(document.getElementById('opc-libelleAna'))) { showWarning("Libellé incorrect !"); }
		
		// verif ventilation (la partie décimale ne peut faire plus de 2 caractères)
		else if (!checkDecimal(document.getElementById('opc-ventilation').value,2)) { showWarning("Ventilation incorrecte !"); }
		
		// verif ventilation (la partie entière ne peut faire plus de 5 caractères)
		else if (!checkIPart(document.getElementById('opc-ventilation').value,5)) { showWarning("Ventilation incorrecte !"); }
		
		// verif ventilation nulle
		else if (document.getElementById('opc-ventilation').value==0) { showWarning("Ventilation incorrecte !"); }
		
		else {
			opc_activeMenuVentilation(false);
			opc_saveAna();
			opc_activeFlechesVentilation(true);
			opc_activeMenuVentilation(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_pressOnSupprimerAna() {
	try {
		opc_activeMenuVentilation(false);
		opc_deleteAna();
		opc_activeFlechesVentilation(true);
		opc_activeMenuVentilation(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_annulerAna() {
	try {
		opc_ventilationId=0;
		opc_compteAnaId=0;
		
		document.getElementById('opc-numeroAna').value = "";
		document.getElementById('opc-libelleAna').value = "";
		document.getElementById('opc-ventilation').value = "";
		
		opc_aVentilations.select(-1);
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_saveAna() {
	try {
		//alert("valider : "+opc_ventilationId+","+urlEncode(opc_numero_compte)+","+opc_compteAnaId+","+urlEncode(document.getElementById('opc-libelleAna').value)+","+document.getElementById('opc-ventilation').value);
		var querySave = new QueryHttp("Compta/Analytique/Comptes/saveVentilation.tmpl");
		
		querySave.setParam("Ventilation_Id", opc_ventilationId);
		querySave.setParam("Compte_Gen", urlEncode(opc_numero_compte));
		querySave.setParam("Compte_Ana", opc_compteAnaId);
		querySave.setParam("Libelle", urlEncode(document.getElementById('opc-libelleAna').value));
		querySave.setParam("Ventilation", document.getElementById('opc-ventilation').value);
		
		var result = querySave.execute();
		var errors = new Errors(result);
		
		if (errors.hasNext()) {
			errors.show();
		} else {
			ventilationId = result.responseXML.documentElement.getAttribute('Ventilation_Id');
			opc_aVentilations.deleteTree();
			opc_aVentilations.initTree();
			opc_annulerAna();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function opc_deleteAna() {
	try {
		var querySuppr = new QueryHttp("Compta/Analytique/Comptes/deleteVentilation.tmpl");
		
		querySuppr.setParam("Ventilation_Id", opc_ventilationId);
		
		var result = querySuppr.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			// rafraichir l'arbre
			opc_aVentilations.deleteTree();
			opc_aVentilations.initTree();
			opc_annulerAna();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

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

var admin = 0;
var utilisateurId;
var curDossierId;
var login;
var profilId;
var profilStd;

var aDossiersInterdits = new Arbre('Utilisateurs/GetRDF/listeDossiersInterdits.tmpl', 'liste_dossiers_interdits');
var aDossiersAccessibles = new Arbre('Utilisateurs/GetRDF/listeDossiersAccessibles.tmpl', 'liste_dossiers_accessibles');
	
var aJournauxInterdits = new Arbre('Utilisateurs/GetRDF/listeJournauxInterditsProfil.tmpl', 'liste_journaux_interdits');
var aJournauxAccessibles = new Arbre('Utilisateurs/GetRDF/listeJournauxAccessiblesProfil.tmpl', 'liste_journaux_accessibles');

var aComptesInterdits = new Arbre('Utilisateurs/GetRDF/listeComptesInterditsProfil.tmpl', 'liste_comptes_interdits');
var aComptesAccessibles = new Arbre('Utilisateurs/GetRDF/listeComptesAccessiblesProfil.tmpl', 'liste_comptes_accessibles');


function initModifProfil(pId) {
	try {
		
		document.getElementById("bMenuProfils").collapsed = false;
	
		profilId=pId;
		var qGetUtil = new QueryHttp("Utilisateurs/getProfil.tmpl");
		qGetUtil.setParam("Profil_Id", profilId);
		
		var p = qGetUtil.execute();
		var contenu = p.responseXML.documentElement;
		nom = contenu.getAttribute("nom");	
		commentaire = contenu.getAttribute("commentaire");
		profilStd = (contenu.getAttribute("Standard")=="1");
		
		document.getElementById("labProfil").value = "MODIFICATION DU PROFIL '"+ nom +"'";
		document.getElementById("pnom").value=nom;
		document.getElementById("pcommentaire").value =commentaire;
		
		document.getElementById("pnom").disabled=profilStd;
		document.getElementById("bSupprimer").collapsed=profilStd;
		document.getElementById("tab-modification").selectedIndex=0;
  	document.getElementById("deck").selectedIndex=2;
  	
		
  } catch (e) {
    recup_erreur(e);
  }
}
function initialiser1(){
	
	document.getElementById("plisteEntreprise").selectedIndex = 0;
	
}
function initModifProfil2() {
	try {
		if (profilId!=""){
			document.getElementById("bMenuProfils").collapsed = false;
			var qGetUtil = new QueryHttp("Utilisateurs/getProfil.tmpl");
			qGetUtil.setParam("Profil_Id", profilId);	
			var p = qGetUtil.execute();
			var contenu = p.responseXML.documentElement;
			nom = contenu.getAttribute("nom");	
			commentaire = contenu.getAttribute("commentaire");
			
			document.getElementById("labProfil").value = "MODIFICATION DU PROFIL '"+ nom +"'";
			document.getElementById("pnom").value =nom ;
			document.getElementById("pcommentaire").value =commentaire;
			document.getElementById("tab-modification").selectedIndex=0;
	  	document.getElementById("deck").selectedIndex=2;
		}

		
  } catch (e) {
    recup_erreur(e);
  }
}
function initModifProfiljournaux(pId) {
	try {
	
		document.getElementById("bMenuProfils").collapsed = false;
		profilId=pId;
		document.getElementById("tab-modification").selectedIndex=1;
		document.getElementById("deck").selectedIndex=2;  
		initTabJournaux();	
		pressOnListeDossiersJournaux();		
  } catch (e) {
    recup_erreur(e);
  }
}


function modifierProfil() {
	try {
		nom=document.getElementById("pnom").value  ;
		commentaire=document.getElementById("pcommentaire").value;
		
		if (isEmpty(nom)) { showWarning("Veuillez saisir un nom !"); }
		else {			
			var qModifUtil = new QueryHttp("Utilisateurs/changeProfil.tmpl");
			qModifUtil.setParam("req", "modifier");
			qModifUtil.setParam("nom", nom);
			qModifUtil.setParam("commentaire", commentaire);
			qModifUtil.setParam("id", profilId);
			
			var p = qModifUtil.execute();
			var message = p.responseXML.documentElement.getAttribute("msg");			
			if (message=="1") { showWarning("Le profil est modifié !"); }
			else { showMessage("Erreur : le nom saisi est déjà utilisé dans l'entreprise !"); }	
		}

	}	catch (e) {
		recup_erreur(e);
	}
}


function supprimerProfil() {
	try {
		var qSupprimerProfil = new QueryHttp("Utilisateurs/supprimerProfil.tmpl");
		qSupprimerProfil.setParam("Profil_Id", profilId);
		
		var p = qSupprimerProfil.execute();
		if (p.responseXML.documentElement.getAttribute("ok")=="true") {
			showWarning("Le profil a été supprimé !");
			retour_menuGestionDroit();
		} else {
			showWarning("Impossible de supprimer le profil, car il est toujours utilisé !")
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function initTabJournaux() {
	try {
		
		document.getElementById('bAjouterJournaux').disabled = true;
		document.getElementById('bEnleverJournaux').disabled = true;
		
		aJournauxInterdits.deleteTree();
		aJournauxAccessibles.deleteTree();
		var aDossiers = new Arbre('Utilisateurs/GetRDF/listeDossiers.tmpl', 'liste_dossiers_journaux');
		aDossiers.initTree(initListeDossiers1);
		
	} catch (e) {
		recup_erreur(e);
	}
}

function initTabCompte() {
	try {
		
		document.getElementById('bAjouterComptes').disabled = true;
		document.getElementById('bEnleverComptes').disabled = true;
		
		aComptesInterdits.deleteTree();
		aComptesAccessibles.deleteTree();
		var aDossiers = new Arbre('Utilisateurs/GetRDF/listeDossiers.tmpl', 'liste_dossiers_comptes');
		aDossiers.initTree(initListeDossiers2);
		
	} catch (e) {
		recup_erreur(e);
	}
}

function initListeDossiers1() {
	try {
		document.getElementById('liste_dossiers_journaux').selectedIndex=0;
	} catch (e) {
		recup_erreur(e);
	}
}
function initListeDossiers2() {
	try {
		document.getElementById('liste_dossiers_comptes').selectedIndex=0;
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnListeDossiersJournaux() {
	try {


		if (document.getElementById('liste_dossiers_journaux').selectedIndex>0) {
			document.getElementById('bAjouterJournaux').disabled = true;
			document.getElementById('bEnleverJournaux').disabled = true;
		
			curDossierId = document.getElementById('liste_dossiers_journaux').value;

			aJournauxInterdits.setParam("Profil_Id", profilId);
			aJournauxInterdits.setParam("Dossier_Id", curDossierId);
			aJournauxInterdits.initTree();
			
			aJournauxAccessibles.setParam("Profil_Id", profilId);
			aJournauxAccessibles.setParam("Dossier_Id", curDossierId);
			aJournauxAccessibles.initTree();
		} else {
			aJournauxInterdits.deleteTree();
			aJournauxAccessibles.deleteTree();
		}
	} catch (e) {
		recup_erreur(e);
	}
}
function pressOnListeDossiersCompte() {
	try {


		if (document.getElementById('liste_dossiers_comptes').selectedIndex>0) {
			document.getElementById('bAjouterComptes').disabled = true;
			document.getElementById('bEnleverComptes').disabled = true;
		
			curDossierId = document.getElementById('liste_dossiers_comptes').value;

			aComptesInterdits.setParam("Profil_Id", profilId);
			aComptesInterdits.setParam("Dossier_Id", curDossierId);
			aComptesInterdits.initTree();
			
			aComptesAccessibles.setParam("Profil_Id", profilId);
			aComptesAccessibles.setParam("Dossier_Id", curDossierId);
			aComptesAccessibles.initTree();
		} else {
			aComptesInterdits.deleteTree();
			aComptesAccessibles.deleteTree();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function pressOnJournauxInterdits() {
	try {
		if (aJournauxInterdits.isSelected()) {
			if (aJournauxAccessibles.nbLignes()>0) {
				aJournauxAccessibles.select(-1);
			}
			document.getElementById('bAjouterJournaux').disabled = false;
			document.getElementById('bEnleverJournaux').disabled = true;
		}
	} catch (e) {
    recup_erreur(e);
  }
}
function pressOnComptesInterdits() {
	try {
		if (aComptesInterdits.isSelected()) {
			if (aComptesAccessibles.nbLignes()>0) {
				aComptesAccessibles.select(-1);
			}
			document.getElementById('bAjouterComptes').disabled = false;
			document.getElementById('bEnleverComptes').disabled = true;
		}
	} catch (e) {
    recup_erreur(e);
  }
}
function pressOnJournauxAccessibles() {
	try {
		if (aJournauxAccessibles.isSelected()) {
			if (aJournauxInterdits.nbLignes()>0) {
				aJournauxInterdits.select(-1);
			}
			document.getElementById('bAjouterJournaux').disabled = true;
			document.getElementById('bEnleverJournaux').disabled = false;			
		}
	} catch (e) {
    recup_erreur(e);
  }
}
function pressOnComptesAccessibles() {
	try {
		if (aComptesAccessibles.isSelected()) {
			if (aComptesInterdits.nbLignes()>0) {
				aComptesInterdits.select(-1);
			}
			document.getElementById('bAjouterComptes').disabled = true;
			document.getElementById('bEnleverComptes').disabled = false;			
		}
	} catch (e) {
    recup_erreur(e);
  }
}

function ajouterJournauxAccessibles() {
	try {

		var tree = document.getElementById('liste_journaux_interdits');
		var rangeCount = tree.view.selection.getRangeCount();

		for (var i=0; i<rangeCount; i++) {
			var start = {};
  		var end = {};
  		tree.view.selection.getRangeAt(i,start,end);

			for(var c=start.value; c<=end.value; c++) {
				var codeJournal = getCellText(tree,c,'lji-ColCode');
				var qAjouterJournaux = new QueryHttp("Utilisateurs/ajouterJournauxProfil.tmpl");
				qAjouterJournaux.setParam("Profil_Id", profilId);
				qAjouterJournaux.setParam("Dossier_Id", curDossierId);
				qAjouterJournaux.setParam("Code_Journal", codeJournal);
				qAjouterJournaux.execute();
			}
		}

		aJournauxInterdits.initTree();
		aJournauxAccessibles.initTree();

		document.getElementById('bAjouterJournaux').disabled = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function enleverJournauxAccessibles() {
	try {

		var tree = document.getElementById('liste_journaux_accessibles');
		var rangeCount = tree.view.selection.getRangeCount();

		for (var i=0; i<rangeCount; i++) {
			var start = {};
  		var end = {};
  		tree.view.selection.getRangeAt(i,start,end);

			for(var c=start.value; c<=end.value; c++) {
				var codeJournal = getCellText(tree,c,'lja-ColCode');
				var qEnleverJournaux = new QueryHttp("Utilisateurs/enleverJournauxProfil.tmpl");
				qEnleverJournaux.setParam("Profil_Id", profilId);
				qEnleverJournaux.setParam("Dossier_Id", curDossierId);
				qEnleverJournaux.setParam("Code_Journal", codeJournal);
				qEnleverJournaux.execute();
			}
		}

		aJournauxInterdits.initTree();
		aJournauxAccessibles.initTree();

		document.getElementById('bEnleverJournaux').disabled = true;

	} catch (e) {
    recup_erreur(e);
  }
}
function ajouterComptesAccessibles() {
	try {

		var tree = document.getElementById('liste_comptes_interdits');
		var rangeCount = tree.view.selection.getRangeCount();

		for (var i=0; i<rangeCount; i++) {
			var start = {};
  		var end = {};
  		tree.view.selection.getRangeAt(i,start,end);

			for(var c=start.value; c<=end.value; c++) {
				var NumeroCompte = getCellText(tree,c,'lci-ColCompte');
				var qAjouterComptes = new QueryHttp("Utilisateurs/ajouterComptesProfil.tmpl");
				qAjouterComptes.setParam("Profil_Id", profilId);
				qAjouterComptes.setParam("Dossier_Id", curDossierId);
				qAjouterComptes.setParam("Numero_Compte", NumeroCompte);
				qAjouterComptes.execute();
			}
		}

		aComptesInterdits.initTree();
		aComptesAccessibles.initTree();

		document.getElementById('bAjouterComptes').disabled = true;

	} catch (e) {
    recup_erreur(e);
  }
}


function enleverComptesAccessibles() {
	try {

		var tree = document.getElementById('liste_comptes_accessibles');
		var rangeCount = tree.view.selection.getRangeCount();

		for (var i=0; i<rangeCount; i++) {
			var start = {};
  		var end = {};
  		tree.view.selection.getRangeAt(i,start,end);

			for(var c=start.value; c<=end.value; c++) {
				var NumeroCompte = getCellText(tree,c,'lca-ColCompte');				
				var qEnleverComptes = new QueryHttp("Utilisateurs/enleverComptesProfil.tmpl");
				qEnleverComptes.setParam("Profil_Id", profilId);
				qEnleverComptes.setParam("Dossier_Id", curDossierId);
				qEnleverComptes.setParam("NumeroCompte", NumeroCompte);
				qEnleverComptes.execute();
			}
		}

		aComptesInterdits.initTree();
		aComptesAccessibles.initTree();

		document.getElementById('bEnleverComptes').disabled = true;

	} catch (e) {
    recup_erreur(e);
  }
}

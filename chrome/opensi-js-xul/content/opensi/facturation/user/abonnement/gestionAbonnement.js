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


jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/facturation/user/abonnement/parametre_abonnement.js");



var tree = new Arbre("Facturation/GetRDF/abonnement.tmpl","GestionDesAbonnements");
var modele_ids = new Arbre("Facturation/GetRDF/liste-referencesModeleAbonnement.tmpl","Combo_reference");


function init() {
	try {

	modele_ids.initTree();

	var qNbAbonnements = new QueryHttp("Facturation/Abonnement/nbAbonnementEtClients.tmpl");
	var p = qNbAbonnements.execute();
	var contenu = p.responseXML.documentElement;

	document.getElementById("nbClients").value="Nombre d'abonnés : " + contenu.getAttribute('nbClients');
	document.getElementById("nbAbonnement").value="Nombre d'abonnements en cours : " + contenu.getAttribute('nbAbonnements');
	reconduireAbonnement(contenu.getAttribute('listeAbo'),contenu.getAttribute('nbAboRecTacites'));
	tree.initTree();

	}	catch (e) {
    recup_erreur(e);
  }
}

function reinitialiser() {
	try {

		document.getElementById('Combo_reference').value="";
		document.getElementById('typeContrat').value=0;
		document.getElementById('Etat').value=0;
		document.getElementById('dateDebut').value="";
		document.getElementById('dateFin').value="";
		pressOnParam();

	}	catch (e) {
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

//fonction de retour à la page factures à emettre
function factureAEmettre() {
	try {

		window.location = "chrome://opensi/content/facturation/user/abonnement/menuFacture_a_emettre.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

//fonction d'appel à nouvel abonnement,ici mode = C pour appel de nouvelAbonnement en mode Creation
function nouvelAbonnement()  {
	try {

		window.location = "chrome://opensi/content/facturation/user/abonnement/menu_abonnement.xul?"+ cookie() +"&Mode=C";

	}	catch (e) {
    recup_erreur(e);
  }
}

//fonction d'appel à nouvel abonnement,ici mode = M pour appel de nouvelAbonnement en mode Creation
function ModifierAbonnement() {
	try {

		var tree = document.getElementById("GestionDesAbonnements");

		if (tree.view!=null && tree.currentIndex!=-1)	{

			var abonnement_id = getCellText(tree,tree.currentIndex,'ColAbonnement_Id');

	 		var page = "chrome://opensi/content/facturation/user/abonnement/menu_abonnement.xul?" + cookie();
    	page += "&Mode="+"M";
			page += "&Abonnement_Id="+abonnement_id;
			window.location = page;
		}

	}	catch (e) {
    recup_erreur(e);
  }
}


function gestionModele() {
	try {

    window.location = "chrome://opensi/content/facturation/user/abonnement/gestionModeles.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


//fonction qui initialise les parametres envoyé au tmpl pour l'affichage de la liste des abonnements
function pressOnParam() {
try{
	var refModele=document.getElementById('Combo_reference').value;
	var typeContrat=document.getElementById('typeContrat').value;
	var etat=document.getElementById('Etat').value;
	var dateDebut=document.getElementById('dateDebut').value;
	var dateFin=document.getElementById('dateFin').value;

	tree.clearParams();

	if (refModele != "")
		tree.setParam("ref_modele",refModele);
	if (typeContrat != 0)
		tree.setParam("typeContrat",typeContrat);
	if (etat != 0)
		tree.setParam("Etat",etat);
	if (!isEmpty(dateDebut) && isDate(dateDebut))
		tree.setParam("DateDebut",prepareDateJava(dateDebut));
	if (!isEmpty(dateFin) && isDate(dateFin))
		tree.setParam("DateFin",prepareDateJava(dateFin));

	tree.initTree();

	} catch (e) {
    recup_erreur(e);
  }
}

function pressOnDate(ev) {
	try	{

    if (ev.keyCode==13) {
			pressOnParam();
		}

	}	catch(e) {
   	recup_erreur(e);
  }
}

//fonction qui créer le pdf correspondant aux abonnements affichés dans l'arbre
function creerEtatAbonnement() {
	try {

		var Liste_Abonnement="";
		var arbre = document.getElementById("GestionDesAbonnements");
		for (var i=0;i<arbre.view.rowCount;i++) {
			Liste_Abonnement+=getCellText(arbre,i,'ColAbonnement_Id');
			if (i!=((arbre.view.rowCount)-1))
						Liste_Abonnement += ",";
		}
		if (i>0){
			var nbAbonnement = arbre.view.rowCount;
			var page = "chrome://opensi/content/facturation/user/abonnement/etatAbonnement.xul?" + cookie();
    	page += "&Liste_Abonnement=" + Liste_Abonnement;
			page += "&nbAbonnement=" + nbAbonnement;
			window.location = page;
		}
		else
			showWarning("Il n'y a pas d'abonnement dans la liste");

	}	catch(e) {
   	recup_erreur(e);
  }
}


//fonction qui reconduit les abonnements à reconduction tacite
function reconduireAbonnement(listeAbo,nb) {
	try {
		if (nb>0) {
			var listeAbo_id = listeAbo.split(',');
			for (var i=0;i<nb;i++) {
				//calcul nouvelle date de fin :
				var abonnement_id = listeAbo_id[i];
				var corps = cookie() +"&Page=Facturation/Abonnement/getAbonnement.tmpl&ContentType=xml&Abonnement_Id="+abonnement_id;
				var p = requeteHTTP(corps);
				var contenu = p.responseXML.documentElement;
				//calcul de la nouvelle date de fin d'abonnement

				var nouvDateFin = Parametre_abonnement_DateFinAbonnement(parseIntBis(contenu.getAttribute('Date_fin').substring(0,2)),
																																parseIntBis(contenu.getAttribute('Date_fin').substring(3,5)),
																																parseIntBis(contenu.getAttribute('Date_fin').substring(6,10)),
																																'/','/',
																																parseIntBis(contenu.getAttribute('Duree_recon_contrat')),
																																(contenu.getAttribute('Type_duree_recon_contrat')));

				var datePreavisTemp = Parametre_abonnement_DateFinAbonnement(parseIntBis(nouvDateFin.substring(0,2)),
																																parseIntBis(nouvDateFin.substring(3,5)),
																																parseIntBis(nouvDateFin.substring(6,10)),
																																'/','/',-parseIntBis(contenu.getAttribute('Delai_preavis')),
																																3);

				var datePreavis = Parametre_abonnement_DateFinAbonnement(parseIntBis(datePreavisTemp.substring(0,2)),
																																parseIntBis(datePreavisTemp.substring(3,5)),
																																parseIntBis(datePreavisTemp.substring(6,10)),
																																'/','/',1,1);

				corps = cookie() +"&Page=Facturation/Abonnement/reconduireAbonnement.tmpl&ContentType=xml";
				corps +="&Abonnement_Id="+urlEncode(abonnement_id)+"&nouvDateFin="+urlEncode(prepareDateJava(nouvDateFin));
				corps +="&datePreavis="+urlEncode(prepareDateJava(datePreavis));
				corps +="&Reconduction_Auto=1";
				requeteHTTP(corps);
			}
			pressOnParam();
		}

	}	catch(e) {
   	recup_erreur(e);
  }
}


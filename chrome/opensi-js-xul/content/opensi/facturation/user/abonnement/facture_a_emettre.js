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

var pageSelec;

function emettre_init() {
	try {

		document.getElementById('bGenererFacture').collapsed=false;
		tree.initTree(menu_enableGenererFacture);
		var bar = document.getElementById("barre_progression_emettre");
   	bar.setAttribute("hidden","false");
    bar.mode="undetermined";

	}	catch(e) {
		recup_erreur(e);
  }
}


function emettre_initTree() {
try {
		document.getElementById('bGenererFacture').collapsed=false;
		if (modification){
			menu_disableGenererFacture();
			tree.initTree(menu_enableGenererFacture);
			modification = false;
		}

	}	catch(e) {
		recup_erreur(e);
  }
}


function emettre_majDerniereFacture() {
	try {
		var arbre = document.getElementById("factureAEmettre");
		if (arbre.view.rowCount>0){
			modification=true;
			document.getElementById('bMenuPrincipal').disabled=true;
			document.getElementById('bMenuModeles').disabled=true;
			document.getElementById('bMenuAbonnements').disabled=true;
			document.getElementById('bGenererFacture').disabled=true;
			document.getElementById('progressBox_emettre').collapsed=false;
			document.getElementById('info_emettre').value="Mise à jour des dernières factures émises ";
			var bar = document.getElementById("barre_progression_emettre");
   			bar.setAttribute("hidden","false");
    		bar.mode="undetermined";

			var page =  cookie() +"&Page=Facturation/Abonnement/miseAJourEcheance.tmpl&ContentType=xml";
			requeteHTTP(page,new XMLHttpRequest(),emettre_creerFacture);
		}
		else
			showWarning("Il n'y a pas de facture à générer dans l'onglet factures à émettre !");

	}	catch(e) {
		recup_erreur(e);
  }
}

/* Lance la procédure de création des factures */
function emettre_creerFacture() {
	try {
			document.getElementById('info_emettre').value="     Génération des factures en cours     ";
			var arbre = document.getElementById("factureAEmettre");
			var listeEcheance="";
			var listeAbonnement="";
			for (i=0;i<arbre.view.rowCount;i++) {
				listeEcheance +=getCellText(arbre,i,'ColNumEcheance')+",";
				listeAbonnement += getCellText(arbre,i,'ColAbonnement_Id')+",";
			}
			var page =  cookie() +"&Page=Facturation/Abonnement/creerFacture.tmpl&ContentType=xml";
			page +="&listeEcheance="+urlEncode(listeEcheance);
			page +="&listeAbonnement="+urlEncode(listeAbonnement);
			page +="&nbAbo="+urlEncode(arbre.view.rowCount);
			requeteHTTP(page,new XMLHttpRequest(),emettre_creationFactureTerminee);
		}
		catch(e){
    	recup_erreur(e);
  }
}


//fonction executée après la création des factures => créer le PDF et appelle la fonction d'affichage du PDF
//Cette fonction est aussi utilisée pour créer des PDF pour l'historique
function emettre_creationFactureTerminee(requete,Liste_Facture) {
	try	{

		if (requete!=null){
			pageSelec = "emettre";
			var contenu = requete.responseXML.documentElement;
			Liste_Facture = contenu.getAttribute("listeFacture");
		}
		else
			pageSelec = "histo";

		document.getElementById('info_'+pageSelec).value="        Génération du PDF en cours        ";

		var page =  cookie() +"&Page=Facturation/Abonnement/creerPdf.tmpl&ContentType=xml";
		page +="&Liste_Facture=" + urlEncode(Liste_Facture);
		requeteHTTP(page,new XMLHttpRequest(),emettre_afficherPDF);

	}	catch (e)	{
    recup_erreur(e);
  }
}

function emettre_afficherPDF(requete) {
	try	{

		document.getElementById('progressBox_'+pageSelec).collapsed=true
		var bar = document.getElementById("barre_progression_"+pageSelec);
			bar.mode="determined";
    	bar.value="0%";
    	bar.setAttribute("hidden","true");

		var contenu = requete.responseXML.documentElement;
		var Id_Facture = contenu.getAttribute("Id_Facture");

		var page = "chrome://opensi/content/facturation/user/abonnement/facture.xul?"+ cookie();
    		page += "&Id_Facture="+Id_Facture;
				page += "&retour="+urlEncode(pageSelec);
				window.location = page;

	}	catch(e) {
   	recup_erreur(e);
  }
}


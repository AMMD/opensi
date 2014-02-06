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


//fonction d'initialisation des champs de la page
function Echeancier_init() {
	try	{

		document.getElementById('annulerEcheance').disabled = true;
		document.getElementById('activerEcheance').disabled = true;

	}	catch (e) {
    recup_erreur(e);
  }
}


//fonction qui initialise l'arbre de la page
function Echeancier_initTree() {
	try {

		if (mode=="M" && modification) {
			document.getElementById('annulerEcheance').disabled = true;
			document.getElementById('activerEcheance').disabled = true;
			treeEcheancier.clearParams();
			treeEcheancier.setParam("Abonnement_Id", abonnementId);
			treeEcheancier.initTree();
			modification = false;
		}

	}	catch(e) {
    recup_erreur(e);
  }
}



//fonction qui gere l'activation des boutons en fonction de l'etat de l'echeance
function Echeancier_activerBoutons() {
	try {

		if (etat!="R") {
			var arbreEch=document.getElementById("Echeancier");
			if (arbreEch.currentIndex==-1 || getCellText(arbreEch,arbreEch.currentIndex,'ColEtat')=='Générée')
			{
				document.getElementById('annulerEcheance').disabled = true;
				document.getElementById('activerEcheance').disabled = true;
			}
			else if (getCellText(arbreEch,arbreEch.currentIndex,'ColEtat')=='En attente')
			{
				document.getElementById('annulerEcheance').disabled = false;
				document.getElementById('activerEcheance').disabled = true;
			}
			else
			{
				document.getElementById('annulerEcheance').disabled = true;
				document.getElementById('activerEcheance').disabled = false;
			}
		}

	}	catch(e) {
    recup_erreur(e);
  }
}

function choixFacture() {
	try {
		var tree = document.getElementById('Echeancier');
		if (tree.view!=null && tree.currentIndex!=-1) {
			var facture_id = getCellText(tree,tree.currentIndex,'Facture_Id');
			if (facture_id!='' && facture_id!=0) {
				var page = "chrome://opensi/content/facturation/user/factu_directe/edition_facture.xul?" + cookie();
				page += "&Facture_Id="+ facture_id;
				page += "&Mode=V";
				window.location = page;
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

//fonction qui modifie l'etat d'une echeance sans recharger tout l'arbre
function Echeancier_ModifierEtatEcheance(bouton) {
	try {

		var arbreEch=document.getElementById("Echeancier");

			if (arbreEch.view!=null && arbreEch.currentIndex!=-1)
			{

				var NumEcheance=getCellText(arbreEch,arbreEch.currentIndex,'ColNum');
				var corps = cookie() +"&Page=Facturation/Abonnement/modifierEtatEcheance.tmpl&ContentType=xml";
				corps += "&Abonnement_Id=" + urlEncode(abonnementId);
		 		corps += "&NumEcheance=" + urlEncode(NumEcheance);

				if (bouton=="annuler")
					corps += "&Etat=" + urlEncode('A');
				else
					corps += "&Etat=" + urlEncode('E');

				var p = requeteHTTP(corps);

				var numLigne=arbreEch.currentIndex;
				var numColonne=5;

				var objet_XUL=arbreEch.view.getItemAtIndex(numLigne);//numLigne

				var ligne=objet_XUL.childNodes[0].childNodes;

				var cellule=ligne[numColonne];

				var old_valeur=cellule.getAttribute("label");

				if (bouton=="annuler")
					cellule.setAttribute("label","Annulée");
				else
					cellule.setAttribute("label","En attente");

			}
			Echeancier_activerBoutons();

	}	catch(e) {
    recup_erreur(e);
  }
}





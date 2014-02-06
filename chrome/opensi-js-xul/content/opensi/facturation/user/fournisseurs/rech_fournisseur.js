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


/*

Paramètres d'entrée non obligatoires :
	- Nouv - true->affichage du bouton nouveau - defaut=true

*/


jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");

var aRecherche = new Arbre('Facturation/GetRDF/liste_fournisseurs.tmpl', 'fournisseurs');


function init() {
  try {

    var nouv = ParamValeur('Nouv');
    if (!isEmpty(nouv)) {
      if (nouv == 'false') {
        document.getElementById('bouton_nouveau').collapsed = true;
      }
    }

		if (!isEmpty(ParamValeur('Fournisseur_Id'))) {
    	document.getElementById('Fournisseur_Id').value = ParamValeur('Fournisseur_Id');
			var code_fournisseur = document.getElementById('Fournisseur_Id').value;
			if (existeFournisseur(code_fournisseur)) {
       	ouvrirFournisseur(code_fournisseur);
			}
			else {
				document.getElementById('Famille').value.selectedIndex=0;
				document.getElementById('Nom').value = "";
				document.getElementById('Code_Couleur').selectedIndex=0;
				
				aRecherche.clearParams();
				aRecherche.setParam('Fournisseur_Id', code_fournisseur);
				aRecherche.initTree();
			}
		}
		
		var aFamille = new Arbre('Facturation/GetRDF/familles_fournisseur.tmpl', 'Famille');
		aFamille.initTree(initFamille);

    window.resizeTo(800,400);

    document.getElementById('Fournisseur_Id').focus();

  } catch (e) {
    recup_erreur(e);
  }
}


function initFamille() {
	try {

		document.getElementById('Famille').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnId(ev) {
  try {

    if (ev.keyCode==13) {

			var code_fournisseur = document.getElementById('Fournisseur_Id').value;

			if (existeFournisseur(code_fournisseur)) {
        ouvrirFournisseur(code_fournisseur);
			}
			else {
				document.getElementById('Code_Couleur').selectedIndex=0;
				document.getElementById('Famille').selectedIndex=0;
				document.getElementById('Nom').value = "";

        aRecherche.clearParams();
				aRecherche.setParam('Fournisseur_Id', code_fournisseur);
				aRecherche.initTree();
			}
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnNom(ev) {
  try {

    if (ev.keyCode==13) {

			document.getElementById('Code_Couleur').selectedIndex=0;
			document.getElementById('Famille').selectedIndex=0;
			document.getElementById('Fournisseur_Id').value = "";

      aRecherche.clearParams();
			aRecherche.setParam('Nom', document.getElementById('Nom').value);
			aRecherche.initTree();
   	}

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnCouleur() {
  try {

		document.getElementById('Nom').value = "";
		document.getElementById('Famille').selectedIndex=0;
		document.getElementById('Fournisseur_Id').value = "";
		
		if (document.getElementById('Code_Couleur').selectedIndex==0) {
  		aRecherche.deleteTree();
  	} else {
  		aRecherche.clearParams();
  		aRecherche.setParam('Code_Couleur', document.getElementById('Code_Couleur').value);
  		aRecherche.initTree();
  	}
  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnFamille() {
  try {

    document.getElementById('Code_Couleur').selectedIndex=0;
		document.getElementById('Nom').value = "";
		document.getElementById('Fournisseur_Id').value = "";
		
		if (document.getElementById('Famille').selectedIndex==0) {
  		aRecherche.deleteTree();
  	} else {
  		aRecherche.clearParams();
  		aRecherche.setParam('Famille', document.getElementById('Famille').value);
  		aRecherche.initTree();
  	}

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnTree(ev) {
  try {

    if (ev.keyCode==13) {
			choixFournisseur();
  	}

  } catch (e) {
    recup_erreur(e);
  }
}


function nouveauFournisseur() {
  try {
  	
		window.arguments[0]("");
		window.close();

  } catch (e) {
    recup_erreur(e);
  }
}


function ouvrirFournisseur(code_fournisseur) {
  try {
  	
		window.arguments[0](code_fournisseur);
  	window.close();

  } catch (e) {
    recup_erreur(e);
  }
}


function choixFournisseur() {
	try {

		var tree = document.getElementById('fournisseurs');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var code_fournisseur = getCellText(tree,tree.currentIndex, 'ColFournisseur_Id');

			ouvrirFournisseur(code_fournisseur);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function existeFournisseur(code_fournisseur) {
  try {

		var corps = cookie() +"&Page=Facturation/Fournisseurs/existeFournisseur.tmpl&ContentType=xml&Fournisseur_Id="+ urlEncode(code_fournisseur);
		var p = requeteHTTP(corps);

  	var contenu = p.responseXML.documentElement;
  	return (contenu.getAttribute('existe')=="true" && contenu.getAttribute('supprime')=="false");

  } catch (e) {
    recup_erreur(e);
  }
}

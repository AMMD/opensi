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

var aApercu = new Arbre('Facturation/GetRDF/apercu_commande_fournisseur.tmpl', 'apercu');
var aCom = new Arbre('Facturation/GetRDF/commandes.tmpl', 'commandes');


function init() {
  try {

    document.getElementById('Numero').focus();

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnId(ev) {
  try {

    if (ev.keyCode==13) {

		 	var numero = document.getElementById('Numero').value;

			var commande_id = existeCommande(numero);

			if (commande_id!="") {
       	ouvrirCommande(commande_id);
			}
			else {
        document.getElementById('Fournisseur_Id').value = "";
        document.getElementById('Denomination').value = "";
				document.getElementById('Article_Id').value = "";
				document.getElementById('Num_BR').value = "";
				aCom.clearParams();
				changerReliquats(false);
				aCom.setParam('Num_Commande', document.getElementById('Numero').value);
				aCom.initTree();
				unloadApercu();
			}
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnFournisseurId(ev) {
  try {

    if (ev.keyCode==13) {

      document.getElementById('Numero').value = "";
      document.getElementById('Denomination').value = "";
			document.getElementById('Article_Id').value = "";
			document.getElementById('Num_BR').value = "";
			aCom.clearParams();
			changerReliquats(false);
			aCom.setParam('Fournisseur_Id', document.getElementById('Fournisseur_Id').value);
			aCom.initTree();
			unloadApercu();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnRaisonSociale(ev) {
  try {

    if (ev.keyCode==13) {

			document.getElementById('Numero').value = "";
      document.getElementById('Fournisseur_Id').value = "";
			document.getElementById('Article_Id').value = "";
			document.getElementById('Num_BR').value = "";
			aCom.clearParams();
			changerReliquats(false);
			aCom.setParam('Denomination', document.getElementById('Denomination').value);
			aCom.initTree();
			unloadApercu();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnArticle(ev) {
  try {

    if (ev.keyCode==13) {

			document.getElementById('Numero').value = "";
      document.getElementById('Fournisseur_Id').value = "";
			document.getElementById('Denomination').value = "";
			document.getElementById('Num_BR').value = "";
			aCom.clearParams();
			changerReliquats(false);
			aCom.setParam('Article_Id', document.getElementById('Article_Id').value);
			aCom.initTree();
			unloadApercu();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnNumBR(ev) {
  try {

    if (ev.keyCode==13) {

      document.getElementById('Numero').value = "";
      document.getElementById('Denomination').value = "";
			document.getElementById('Article_Id').value = "";
			document.getElementById('Fournisseur_Id').value = "";
			aCom.clearParams();
			changerReliquats(false);
			aCom.setParam('Num_BR', document.getElementById('Num_BR').value);
			aCom.initTree();
			unloadApercu();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function changerReliquats(reinit) {
  try {

		if (document.getElementById('Aff_Reliquats').checked) {
			aCom.setParam('Aff_Reliquats', "1");
			if (reinit && aCom.nbParams()>1) aCom.initTree();
		}
		else {
			aCom.removeParam('Aff_Reliquats');
			if (reinit && aCom.nbParams()>0) aCom.initTree();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function pressOnTree(ev) {
  try {

    if (ev.keyCode==13) {
    	choixCommande();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function existeCommande(numero) {
  try {

		var corps = cookie() +"&Page=Facturation/Commandes/existeCommande.tmpl&ContentType=xml&Numero="+ urlEncode(numero);
		var p = requeteHTTP(corps);

  	return p.responseXML.documentElement.getAttribute('Commande_Id');

  } catch (e) {
    recup_erreur(e);
  }
}


function ouvrirCommande(commande_id) {
  try {

		window.opener.ouvrir_commande_win(commande_id);
    window.close();

  } catch (e) {
    recup_erreur(e);
  }
}


function choixCommande() {
	try {

		var tree = document.getElementById('commandes');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var commande_id = getCellText(tree,tree.currentIndex,'ColCommande_Id');

			ouvrirCommande(commande_id);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function loadApercu() {
	try {

		unloadApercu();

		var tree = document.getElementById('commandes');

		if (tree.view!=null && tree.currentIndex!=-1) {
			var commande_id = getCellText(tree,tree.currentIndex,'ColCommande_Id');
			var numero = getCellText(tree,tree.currentIndex,'ColNum');
			document.getElementById('Num_Commande').value = numero;
			aApercu.setParam('Commande_Id', commande_id);
			aApercu.initTree();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function unloadApercu() {
	try {

		document.getElementById('Num_Commande').value = "";
		aApercu.deleteTree();

	} catch (e) {
    recup_erreur(e);
  }
}

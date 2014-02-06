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

var aApercu = new Arbre('Facturation/GetRDF/apercu_devis.tmpl', 'apercu');
var aRecherche = new Arbre('Facturation/GetRDF/liste_devis.tmpl', 'devis');


function init() {
  try {

    window.resizeTo(900,500);
		
    document.getElementById('Numero').focus();

  } catch (e) {
    recup_erreur(e);
  }
}


function rechercher() {
	try {
		
		unloadApercu();
		
		var numero = document.getElementById('Numero').value;
		var clientId = document.getElementById('Client_Id').value;
		var denomination = document.getElementById('Denomination').value;
		var articleId = document.getElementById('Article_Id').value;
		var etat = document.getElementById('Etat').value;
		
		aRecherche.setParam('Numero', numero);
		aRecherche.setParam('Client_Id', clientId);
		aRecherche.setParam('Denomination', denomination);
		aRecherche.setParam('Article_Id', articleId);
		aRecherche.setParam('Etat', etat);
		aRecherche.initTree();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOnId(ev) {
  try {

    if (ev.keyCode==13) {

			var numero = document.getElementById('Numero').value;
			var devis_id = existeDevis(numero);

			if (!isEmpty(devis_id)) {
       	ouvrirDevis(devis_id);
			}
			else {
				rechercher();
			}
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnClientId(ev) {
  try {

    if (ev.keyCode==13) {
      rechercher();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnRaisonSociale(ev) {
  try {

    if (ev.keyCode==13) {
    	rechercher();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnArticle(ev) {
  try {

    if (ev.keyCode==13) {
    	rechercher();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnTree(ev) {
  try {

    if (ev.keyCode==13) {
    	choixDevis();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function existeDevis(numero) {
  try {

		var corps = cookie() +"&Page=Facturation/Devis/existeDevis.tmpl&ContentType=xml&Numero="+ numero;
		var p = requeteHTTP(corps);

  	return p.responseXML.documentElement.getAttribute('Devis_Id');

  } catch (e) {
    recup_erreur(e);
  }
}


function ouvrirDevis(devis_id) {
  try {

		window.opener.ouvrir_devis_win(devis_id);
    window.close();

  } catch (e) {
    recup_erreur(e);
  }
}


function choixDevis() {
	try {

		var tree = document.getElementById('devis');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var devis_id = getCellText(tree,tree.currentIndex,'ColDevis_Id');

			ouvrirDevis(devis_id);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function loadApercu() {
	try {

		unloadApercu();

		var tree = document.getElementById('devis');

		if (tree.view!=null && tree.currentIndex!=-1) {
			var devis_id = getCellText(tree,tree.currentIndex,'ColDevis_Id');
			var numero = getCellText(tree,tree.currentIndex,'ColNumero');
			document.getElementById('Num_Devis').value = numero;
			aApercu.setParam('Devis_Id', devis_id);
			aApercu.initTree();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function unloadApercu() {
	try {

		document.getElementById('Num_Devis').value = "";
		aApercu.deleteTree();

	} catch (e) {
    recup_erreur(e);
  }
}

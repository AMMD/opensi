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

/*

Paramètres d'entrée non obligatoires :
	- Nouv - true->affichage du bouton nouveau - defaut=true
	- Client_Express - true->indique que le bouton Nouveau correspond à la création d'un client express - defaut=false
	- Bloque - true->impossible de choisir un client bloqué - default=false

*/


var aRecherche = new Arbre('Facturation/GetRDF/liste_clients.tmpl', 'clients');

var client_id;

function init() {
  try {


		var nouv = ParamValeur('Nouv');
    if (!isEmpty(nouv)) {
      if (nouv == 'false') {
        document.getElementById('bouton_nouveau').collapsed = true;
      }
    }

		if (!isEmpty(ParamValeur('Client_Id'))) {
    	document.getElementById('Client_Id').value = ParamValeur('Client_Id');
			var code_client = document.getElementById('Client_Id').value;
			if (existeClient(code_client)) {
       	ouvrirClient(code_client);
			}
			else {
				document.getElementById('Famille').selectedIndex=0;
				document.getElementById('Nom').value = "";
				document.getElementById('Code_Couleur').selectedIndex=0;
								
				aRecherche.clearParams();
				aRecherche.setParam('Client_Id', document.getElementById('Client_Id').value);
				aRecherche.initTree();
			}
		}
		
		var aFamille = new Arbre('Facturation/GetRDF/familles_client.tmpl', 'Famille');
		aFamille.initTree(initFamille);

    window.resizeTo(800,400);

    document.getElementById('Client_Id').focus();

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


function pressOnNom(ev) {
  try {

		if (ev.keyCode==13) {

			document.getElementById('Code_Couleur').selectedIndex=0;
			document.getElementById('Famille').selectedIndex=0;
			document.getElementById('Client_Id').value = "";
			
			aRecherche.clearParams();
			aRecherche.setParam('Nom', document.getElementById('Nom').value);
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
		document.getElementById('Client_Id').value = "";
  	
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


function pressOnCouleur() {
  try {

		document.getElementById('Famille').selectedIndex=0;
		document.getElementById('Nom').value = "";
		document.getElementById('Client_Id').value = "";
		
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


function existeClient(code_client) {
  try {

		var corps = cookie() +"&Page=Facturation/Clients/existeClient.tmpl&ContentType=xml&Client_Id="+ urlEncode(code_client);
		var p = requeteHTTP(corps);

		var contenu = p.responseXML.documentElement;
  	return (contenu.getAttribute('existe')=="true" && contenu.getAttribute('supprime')=="false");

  } catch (e) {
    recup_erreur(e);
  }
}


function clientBloque(code_client) {
  try {

		var corps = cookie() +"&Page=Facturation/Clients/clientBloque.tmpl&ContentType=xml&Client_Id="+ urlEncode(code_client);
		var p = requeteHTTP(corps);

  	return (p.responseXML.documentElement.getAttribute('bloque')=="true");

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnId(ev) {
  try {

		if (ev.keyCode==13) {

			var code_client = document.getElementById('Client_Id').value;

			if (existeClient(code_client)) {
        ouvrirClient(code_client);
			}
			else {
				document.getElementById('Famille').selectedIndex=0;
				document.getElementById('Nom').value = "";
				document.getElementById('Code_Couleur').selectedIndex=0;
				
				aRecherche.clearParams();
				aRecherche.setParam('Client_Id', code_client);
				aRecherche.initTree();
			}
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnTree(ev) {
  try {

    if (ev.keyCode==13) {
			choixClient();
  	}

  } catch (e) {
    recup_erreur(e);
  }
}


function nouveauClient() {
  try {

  	if (isEmpty(ParamValeur('Client_Express')) || (ParamValeur('Client_Express')=="false")) {

			window.arguments[0]("");
			window.close();
  	} else {
  		client_id="";
  		var url = "chrome://opensi/content/facturation/user/commun/popup-creerClient.xul?"+ cookie();
    	window.openDialog(url,'','chrome,modal,centerscreen', reporterClient);
    	
    	if (client_id != "") {
				ouvrirClient(client_id);
			}
  	}

  } catch (e) {
    recup_erreur(e);
  }
}


function reporterClient(cid) {
  try {
  	client_id = cid;
	} catch (e) {
  	recup_erreur(e);
  }
}


function ouvrirClient(code_client) {
  try {

		if (ParamValeur('Bloque')=="true" && clientBloque(code_client)) {
			showWarning("Ce client est bloqué !");
		}
		else {
			window.arguments[0](code_client);
      window.close();
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function choixClient() {
	try {

		var tree = document.getElementById('clients');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var code_client = getCellText(tree,tree.currentIndex, 'ColClient_Id');

			ouvrirClient(code_client);
		}

	} catch (e) {
    recup_erreur(e);
  }
}

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

var aApercu = new Arbre('Facturation/GetRDF/apercu_facture_client.tmpl', 'apercu');
var aFacts = new Arbre('Facturation/GetRDF/factures.tmpl', 'factures');


function init() {
  try {

    window.resizeTo(900,500);

    document.getElementById('Numero').focus();

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnId(ev) {
  try {

    if (ev.keyCode==13) {

    	var numero = document.getElementById('Numero').value;

			var facture_id = existeFacture(numero);

			if (facture_id!="") {
       	ouvrirFacture(facture_id);
			}
			else {
      	document.getElementById('Client_Id').value = "";
				document.getElementById('Denomination').value = "";
				document.getElementById('Date_Debut').value = "";
				document.getElementById('Date_Fin').value = "";
				document.getElementById('Article_Id').value = "";
				aFacts.clearParams();
				aFacts.setParam('Num_Facture', document.getElementById('Numero').value);
				aFacts.initTree();
				unloadApercu();
			}
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnClientId(ev) {
  try {

    if (ev.keyCode==13) {
			document.getElementById('Numero').value = "";
			document.getElementById('Denomination').value = "";
			document.getElementById('Date_Debut').value = "";
			document.getElementById('Date_Fin').value = "";
			document.getElementById('Article_Id').value = "";
			aFacts.clearParams();
			aFacts.setParam('Client_Id', document.getElementById('Client_Id').value);
			aFacts.initTree();
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
			document.getElementById('Client_Id').value = "";
			document.getElementById('Date_Debut').value = "";
			document.getElementById('Date_Fin').value = "";
			document.getElementById('Article_Id').value = "";
			aFacts.clearParams();
			aFacts.setParam('Denomination', document.getElementById('Denomination').value);
			aFacts.initTree();
			unloadApercu();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnDateDebut(ev) {
  try {

    if (ev.keyCode==13) {

			if (isEmpty(document.getElementById('Date_Debut').value)) {
				showWarning("Veuillez saisir une date de début !");
			}	else if (!isDate(document.getElementById('Date_Debut').value)) {
				showWarning("Date de début incorrecte !");
			}	else if (!isEmpty(document.getElementById('Date_Fin').value) && !isDate(document.getElementById('Date_Fin').value)) {
				showWarning("Date de fin incorrecte !");
			} else if (!isEmpty(document.getElementById('Date_Fin').value) && !isDateInterval(document.getElementById('Date_Debut').value, document.getElementById('Date_Fin').value)) {
				showWarning("La date de fin doit être supérieure à la date de début !");
			} else {
				document.getElementById('Numero').value = "";
      	document.getElementById('Client_Id').value = "";
				document.getElementById('Denomination').value = "";
				document.getElementById('Article_Id').value = "";
				var date_debut = prepareDateJava(document.getElementById('Date_Debut').value);
				aFacts.clearParams();
				aFacts.setParam('Date_Debut', date_debut);
				if (!isEmpty(document.getElementById('Date_Fin').value)) {
					var date_fin = prepareDateJava(document.getElementById('Date_Fin').value);
					aFacts.setParam('Date_Fin', date_fin);
				}
				aFacts.initTree();
				unloadApercu();
			}
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnDateFin(ev) {
  try {

    if (ev.keyCode==13) {
			if (isEmpty(document.getElementById('Date_Fin').value)) {
				showWarning("Veuillez saisir une date de fin !");
			}	else if (!isDate(document.getElementById('Date_Fin').value)) {
				showWarning("Date de fin incorrecte !");
			}	else if (isEmpty(document.getElementById('Date_Debut').value)) {
				showWarning("Veuillez saisir une date de début !");
			} else if (!isDate(document.getElementById('Date_Debut').value)) {
				showWarning("Date de début incorrecte !");
			} else if (!isDateInterval(document.getElementById('Date_Debut').value, document.getElementById('Date_Fin').value)) {
				showWarning("La date de fin doit être supérieure à la date de début !");
			} else {
				document.getElementById('Numero').value = "";
      	document.getElementById('Client_Id').value = "";
				document.getElementById('Denomination').value = "";
				document.getElementById('Article_Id').value = "";
				var date_debut = prepareDateJava(document.getElementById('Date_Debut').value);
				var date_fin = prepareDateJava(document.getElementById('Date_Fin').value);
				aFacts.clearParams();
				aFacts.setParam('Date_Debut', date_debut);
				aFacts.setParam('Date_Fin', date_fin);
				aFacts.initTree();
				unloadApercu();
			}
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnArticleId(ev) {
  try {

    if (ev.keyCode==13) {

			document.getElementById('Numero').value = "";
			document.getElementById('Client_Id').value = "";
			document.getElementById('Denomination').value = "";
			document.getElementById('Date_Debut').value = "";
			document.getElementById('Date_Fin').value = "";
			aFacts.clearParams();
			aFacts.setParam('Article_Id', document.getElementById('Article_Id').value);
			aFacts.initTree();
			unloadApercu();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnTree(ev) {
  try {

    if (ev.keyCode==13) {
    	choixFacture();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function existeFacture(numero) {
  try {

		var qExFact = new QueryHttp("Facturation/Recherches/existeFacture.tmpl");
		qExFact.setParam('Numero', numero);
		var result = qExFact.execute();

  	return result.responseXML.documentElement.getAttribute('Facture_Id');

  } catch (e) {
    recup_erreur(e);
  }
}


function ouvrirFacture(facture_id) {
  try {

		window.arguments[0](facture_id);
		window.close();

  } catch (e) {
    recup_erreur(e);
  }
}


function choixFacture() {
	try {

		var tree = document.getElementById('factures');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var facture_id = getCellText(tree,tree.currentIndex,'ColFacture_Id');

			ouvrirFacture(facture_id);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function loadApercu() {
	try {

		aApercu.deleteTree();

		var tree = document.getElementById('factures');

		if (tree.view!=null && tree.currentIndex!=-1) {
			var facture_id = getCellText(tree,tree.currentIndex,'ColFacture_Id');
			var numero = getCellText(tree,tree.currentIndex,'ColNum_Entier');
			document.getElementById('Num_Facture').value = numero;
			aApercu.setParam('Facture_Id', facture_id);
			aApercu.initTree();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function unloadApercu() {
	try {

		document.getElementById('Num_Facture').value = "";
		aApercu.deleteTree();

	} catch (e) {
    recup_erreur(e);
  }
}

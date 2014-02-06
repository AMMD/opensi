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

var aApercu = new Arbre('Facturation/GetRDF/apercu_avoir_client.tmpl', 'apercu');
var aAvoirs = new Arbre('Facturation/GetRDF/avoirs.tmpl', 'avoirs');


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

			var avoir_id = existeAvoir(numero);

			if (avoir_id!="") {
       	ouvrirAvoir(avoir_id);
			}
			else {
        document.getElementById('Client_Id').value = "";
        document.getElementById('Denomination').value = "";
        document.getElementById('Date_Debut').value = "";
				document.getElementById('Date_Fin').value = "";
				document.getElementById('Article_Id').value = "";
				aAvoirs.clearParams();
				aAvoirs.setParam('Num_Avoir', document.getElementById('Numero').value);
				aAvoirs.initTree();
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
			aAvoirs.clearParams();
			aAvoirs.setParam('Client_Id', document.getElementById('Client_Id').value);
			aAvoirs.initTree();
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
			aAvoirs.clearParams();
			aAvoirs.setParam('Denomination', document.getElementById('Denomination').value);
			aAvoirs.initTree();
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
				aAvoirs.clearParams();
				aAvoirs.setParam('Date_Debut', date_debut);
				if (!isEmpty(document.getElementById('Date_Fin').value)) {
					var date_fin = prepareDateJava(document.getElementById('Date_Fin').value);
					aAvoirs.setParam('Date_Fin', date_fin);
				}
				aAvoirs.initTree();
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
				aAvoirs.clearParams();
				aAvoirs.setParam('Date_Debut', date_debut);
				aAvoirs.setParam('Date_Fin', date_fin);
				aAvoirs.initTree();
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
			aAvoirs.clearParams();
			aAvoirs.setParam('Article_Id', document.getElementById('Article_Id').value);
			aAvoirs.initTree();
			unloadApercu();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnTree(ev) {
  try {

    if (ev.keyCode==13) {
    	choixAvoir();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function existeAvoir(numero) {
  try {

		var qExAvoir = new QueryHttp("Facturation/Recherches/existeAvoir.tmpl");
		qExAvoir.setParam('Numero', numero);
		var result = qExAvoir.execute();

  	return result.responseXML.documentElement.getAttribute('Avoir_Id');

  } catch (e) {
    recup_erreur(e);
  }
}


function ouvrirAvoir(avoir_id) {
  try {

		window.arguments[0](avoir_id);
    window.close();

  } catch (e) {
    recup_erreur(e);
  }
}


function choixAvoir() {
	try {

		var tree = document.getElementById('avoirs');

		if (tree.view!=null && tree.currentIndex!=-1) {

			var avoir_id = getCellText(tree,tree.currentIndex,'ColAvoir_Id');

			ouvrirAvoir(avoir_id);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function loadApercu() {
	try {

		aApercu.deleteTree();

		var tree = document.getElementById('avoirs');

		if (tree.view!=null && tree.currentIndex!=-1) {
			var avoir_id = getCellText(tree,tree.currentIndex,'ColAvoir_Id');
			var numero = getCellText(tree,tree.currentIndex,'ColNum_Entier');
			document.getElementById('Num_Avoir').value = numero;
			aApercu.setParam('Avoir_Id', avoir_id);
			aApercu.initTree();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function unloadApercu() {
	try {

		document.getElementById('Num_Avoir').value = "";
		aApercu.deleteTree();

	} catch (e) {
    recup_erreur(e);
  }
}



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

jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var liste_options;
var currentChampCompte;


function init() {
  try {

		document.getElementById('Type').value = "G";
		document.getElementById('Periode').selectedItem = document.getElementById('PeriodeEC');
		document.getElementById('Edition').selectedItem = document.getElementById('EditionC');
		document.getElementById('Ed_Cpte').selectedItem = document.getElementById('EdCpteT');
		document.getElementById('Sortie').selectedItem = document.getElementById('SortieP');

  } catch (e) {
    recup_erreur(e);
  }
}

function cacheChampsMail(b) {
	try {
		document.getElementById('ChampsMail').collapsed = b;

		if (b) {
			document.getElementById('BoutonEdition').label = "EDITER LA BALANCE";
		}
		else {
			document.getElementById('BoutonEdition').label = "ENVOYER LA BALANCE";
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function disableDates(b) {
	try {

		document.getElementById('Date_Debut').disabled = b;
		document.getElementById('Date_Fin').disabled = b;

	} catch (e) {
    recup_erreur(e);
  }
}

function disableCptes(b) {
	try {

		document.getElementById('Cpte_Debut').disabled = b;
		document.getElementById('Cpte_Fin').disabled = b;
		document.getElementById('bCpte_Debut').disabled = b;
		document.getElementById('bCpte_Fin').disabled = b;

	} catch (e) {
    recup_erreur(e);
  }
}


function rechcompte(id) {
	try {
		currentChampCompte = id;
		var type_compte = document.getElementById('Type').value;
		var numero_compte = document.getElementById(id).value;
    var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Type_Rech=A&Creer=false&Num_Compte="+ urlEncode(numero_compte);
		if (type_compte!="T") {
    	if (type_compte=="C") {
    		nom ="CLIENT";
    	} else if (type_compte=="F") {
    		nom ="FOURNISSEUR";
    	} else if (type_compte=="A") {
    		nom ="AUXILIAIRE";
			} else if (type_compte=="G") {
    		nom ="GENERAL";
    	}
    	url += "&Type_Compte="+type_compte+"&nom="+nom;
    }
    window.openDialog(url,'','chrome,modal,centerscreen',retourRechCompte);
	} catch (e) {
		recup_erreur(e);
	}
}

function retourRechCompte(numCompte) {
	try {
		document.getElementById(currentChampCompte).value = numCompte;

	} catch (e) {
		  recup_erreur(e);
	}
}

function keypress(e,id) {
  try {

    if (e.keyCode == 13){
      rechcompte(id);
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function retour_menu_principal() {
  try {

    window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


function editerBalance() {
	try {

		var date_debut = document.getElementById('Date_Debut').value;
		var date_fin = document.getElementById('Date_Fin').value;
		var cpte_debut = document.getElementById('Cpte_Debut').value;
		var cpte_fin = document.getElementById('Cpte_Fin').value;

		if (document.getElementById('EditionP').selected && (!isCompteCorrect(cpte_debut) || !isCompteCorrect(cpte_fin))) {
			showMessage("Numéros de compte invalides !");
		}
		else if (document.getElementById('PeriodeDD').selected && (!isDate(date_fin) || !isDate(date_debut) || !isDateInterval(date_debut, date_fin))) {
			showMessage("Plage de dates invalide !");
		}
		else {
			liste_options = "&Date_Debut="+ date_debut;
			liste_options += "&Date_Fin="+ date_fin;
			liste_options += "&Cpte_Debut="+ cpte_debut;
			liste_options += "&Cpte_Fin="+ cpte_fin;
			liste_options += "&Type="+ document.getElementById('Type').value;
			liste_options += "&Periode="+ document.getElementById('Periode').value;
			liste_options += "&Edition="+ document.getElementById('Edition').value;
			liste_options += "&Ed_Cpte="+ document.getElementById('Ed_Cpte').value;

			var sortie = document.getElementById('Sortie').value;

			if (sortie=="M") {

				var email = document.getElementById('Email').value;
				var sujet = document.getElementById('Sujet').value;
				var message = document.getElementById('Message').value;

				if (!isEmail(email)) {
					showMessage("Adresse e-mail incorrecte !");
				}
				else {
					var corps = cookie() + "&Page=Compta/Etats/balance_pdf.tmpl&ContentType=xml&EnvoiMail=y";
          corps += liste_options+"&Email="+urlEncode(email)+"&Sujet="+urlEncode(sujet)+"&Message="+urlEncode(message);
          requeteHTTP(corps,new XMLHttpRequest(),suiteEditer);
				}
			}	else if (sortie=="E") {
			document.getElementById('deck').selectedIndex = 2;
			document.getElementById('bRetourOptions').collapsed = false;
				t = document.getElementById('Type').value;
				if (t=="T") t="G";

				loadBalance(t,'');
			
			} else if (sortie=="C") {
				var corps = cookie() + "&Page=Compta/Etats/balance_csv.tmpl&ContentType=xml" + liste_options;
        requeteHTTP(corps,new XMLHttpRequest(),suiteEditerCSV);
			}
			else {			
				page = getUrlOpeneas("&Page=Compta/Etats/balance_pdf.tmpl" + liste_options);
				document.getElementById('balance_pdf').setAttribute("src", page);
				document.getElementById('deck').selectedIndex = 1;
				document.getElementById('bRetourOptions').collapsed = false;
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}
function retour_options() {
  try {

   	document.getElementById('deck').selectedIndex = 0;
		document.getElementById('bRetourOptions').collapsed = true;

  } catch (e) {
    recup_erreur(e);
  }
}
function suiteEditer(httpRequest) {
  try {

    showMessage("La balance a été envoyée !");

	} catch (e) {
    recup_erreur(e);
  }
}

function suiteEditerCSV(httpRequest) {
  try {

    var contenu = httpRequest.responseXML;

		var fichier_csv = contenu.documentElement.getAttribute('fichier');
		var file = fileChooser("save", "balance.csv");
		if (file!=null) {
			downloadFile(getDirBuffer()+ fichier_csv, file);
			
		}

	} catch (e) {
    recup_erreur(e);
  }
}

/****************************/
/*** deck 2 sortie ecran***/




var like = "";
var typeCompte = "";
var enableGoTo = false;
var nfs = new NumberFormat("0.00", true);


function disableBoutons(b) {
	try {

		document.getElementById('bMenuPrincipal').disabled = b;
		document.getElementById('bRetourOptions').disabled = b;
		document.getElementById('bA').disabled = b;
		document.getElementById('bG').disabled = b;
		document.getElementById('bC').disabled = b;
		document.getElementById('bF').disabled = b;
		document.getElementById('b1').disabled = b;
		document.getElementById('b2').disabled = b;
		document.getElementById('b3').disabled = b;
		document.getElementById('b4').disabled = b;
		document.getElementById('b5').disabled = b;
		document.getElementById('b6').disabled = b;
		document.getElementById('b7').disabled = b;

		enableGoTo = !b;

	} catch (e) {
    recup_erreur(e);
  }
}


function loadBalance(t,l) {
	try {

		disableBoutons(true);

		like = l;
		typeCompte = t;

		var titre = "";

		if (t=="F") {
			titre = "Fournisseurs";
		}
		else if (t=="C") {
			titre = "Clients";
		}
		else if (t=="A") {
			titre = "Auxiliaires";
		}
		else if (t=="G" && l=="") {
			titre = "Généraux";
		}
		else {
			titre = "de la classe "+ l;
		}

		document.getElementById('Titre').value = "Edition de la balance : Comptes "+ titre;

		document.getElementById('TotalDebit').value = '0.00';
		document.getElementById('TotalCredit').value = '0.00';
		document.getElementById('TotalSolde').value = '0.00';

		init_tree();

	} catch (e) {
    recup_erreur(e);
  }
}


function endLoading() {
	try {

		var tree = document.getElementById('balance');
		if (tree.view==null) {
      endLoading2();
    } else if (tree.view.rowCount < 1) {
      endLoading2();
    } else {
			if (getCellText(tree,0,'ColDebit')=="") {
				setTimeout("endLoading()",50);
			}
			else {
				var debit = 0;
				var credit = 0;

				document.getElementById('Progression').collapsed = true;
				document.getElementById('pm').setAttribute('mode','none');

				for (i=0;i<tree.view.rowCount;i++) {
					debit += parseFloat(getCellText(tree,i,'ColDebit').replace(/ /i,''));
					credit += parseFloat(getCellText(tree,i,'ColCredit').replace(/ /i,''));
				}

				if (debit<0.01 && debit>-0.01) debit = 0;
				if (credit<0.01 && credit>-0.01) credit = 0;
				var solde = debit - credit;

				if (solde<0.01 && solde>-0.01) solde = 0;

				document.getElementById('TotalDebit').value = nfs.format(debit);
				document.getElementById('TotalCredit').value = nfs.format(credit);
				document.getElementById('TotalSolde').value = nfs.format(solde);

				disableBoutons(false);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function endLoading2() {
  try {
    document.getElementById('Progression').collapsed = true;
		document.getElementById('pm').setAttribute('mode','none');
		disableBoutons(false);
  } catch (e) {
    recup_erreur(e);
  }
}


function init_tree() {
  try {
 
	  document.getElementById('Progression').collapsed = false;
		document.getElementById('pm').setAttribute('mode','undetermined');
		
		var aBalance = new Arbre('Compta/GetRDF/balance.tmpl'+ liste_options, 'balance');
		aBalance.setParam('Like', like);
		aBalance.setParam('Type_Compte', typeCompte);
		aBalance.initTree(endLoading);
    	
  } catch (e) {
    recup_erreur(e);
  }
}


function keypress(ev) {
	try {
		if (ev.keyCode==13) {
      goToCompte();
    }
	} catch (e) {
    recup_erreur(e);
  }
}


function goToCompte() {
	try {

		if (enableGoTo) {

	 		var tree = document.getElementById('balance');

			if (tree.view!=null && tree.currentIndex!=-1) {

  			var numero_compte = getCellText(tree,tree.currentIndex,'ColCompte');

   			var prec = "chrome://opensi/content/compta/user/edition/options_balance.xul?"+ cookie();
				prec += "&ListeOptions="+ urlEncode(ParamValeur("ListeOptions"));
				prec += "&Type="+ ParamValeur("Type");

      	var page = "chrome://opensi/content/compta/user/consultation/menu_consultation.xul?"+ cookie();
      	page += "&compte="+ numero_compte;
				page += "&nomprec=Balance";
      	page += "&prec="+ urlEncode(prec);
      	window.location = page;
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

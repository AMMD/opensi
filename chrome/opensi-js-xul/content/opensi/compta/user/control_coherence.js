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
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var ctrlComptes = 0;
var ctrlJournaux = 0;
var ctrlTiers = 0;
var ctrlCJ = 0;

var nfs = new NumberFormat("0.00", true);

function init() {
  try {

		document.getElementById('progression').setAttribute("mode", "undetermined");

		document.getElementById("Sous_Titre").value = "calcul en cours des à nouveaux temporaires...";
		
		var qANTemp = new QueryHttp('Compta/UpdateDatabase/RegenererANouveaux.tmpl');
		qANTemp.execute(init0);

	} catch (e) {
    recup_erreur(e);
  }
}


function init0(result) {
  try {

		document.getElementById('progression').setAttribute("mode", "determined");
		document.getElementById('progression').value = 10;
		
		var qCrtlNbOp = new QueryHttp('Compta/ControlCoherence/CtrlNbOp.tmpl');
		qCrtlNbOp.execute(init1);

	} catch (e) {
    recup_erreur(e);
  }
}

function init1(httpRequest) {
  try {

		document.getElementById('progression').value = 20;
		var contenu = httpRequest.responseXML.documentElement;
		document.getElementById("Sous_Titre").value = "NOMBRE TOTAL D'ECRITURES DANS L'EXERCICE : "+ contenu.getAttribute('nb');
		
		var qCtrlComptes = new QueryHttp('Compta/ControlCoherence/CtrlComptes.tmpl');
		qCtrlComptes.execute(init2);

	} catch (e) {
    recup_erreur(e);
  }
}

function init2(httpRequest) {
  try {
		var creditCptes = 0;
		var debitCptes = 0;

		var contenu = httpRequest.responseXML.documentElement;

		var credit = 0;
		var debit = 0;
		var ecart = 0;

		for (i=1;i<contenu.childNodes.length;i++) {

			if (contenu.childNodes.item(i).nodeType==Node.ELEMENT_NODE) {

				credit += parseFloat(contenu.childNodes.item(i).getAttribute('credit'));
				debit += parseFloat(contenu.childNodes.item(i).getAttribute('debit'));
				ecart = debit - credit;

				document.getElementById("Credit_Compte").value = nfs.format(credit);
				document.getElementById("Debit_Compte").value = nfs.format(debit);
				document.getElementById("Ecart_Compte").value = nfs.format(ecart);
			}
		}
		creditCptes = credit;
		debitCptes = debit;
		if (ecart<0.01 && ecart>-0.01) {
			ctrlComptes = 1;
			document.getElementById("Ecart_Compte").value = "0.00";
		}
		document.getElementById('progression').value = 45;
  	var corps = cookie() +"&Page=Compta/ControlCoherence/CtrlJournaux.tmpl&ContentType=xml";
    var httpParams3 = new Array(creditCptes,debitCptes);
    requeteHTTP(corps,new XMLHttpRequest(),init3,httpParams3);

	} catch (e) {
    recup_erreur(e);
  }
}

function init3(httpRequest,httpParams) {
  try {

    var creditCptes = httpParams[0];
    var debitCptes = httpParams[1];
		var creditJ = 0;
		var debitJ = 0;

		var contenu = httpRequest.responseXML.documentElement;

		var credit = 0;
		var debit = 0;
		var ecart = 0;

		for (i=1;i<contenu.childNodes.length;i++) {

			if (contenu.childNodes.item(i).nodeType==Node.ELEMENT_NODE) {

				credit += parseFloat(contenu.childNodes.item(i).getAttribute('credit'));
				debit += parseFloat(contenu.childNodes.item(i).getAttribute('debit'));
				ecart = debit - credit;

				document.getElementById("Credit_Journal").value = nfs.format(credit);
				document.getElementById("Debit_Journal").value = nfs.format(debit);
				document.getElementById("Ecart_Journal").value = nfs.format(ecart);
			}
		}
		document.getElementById('progression').value = 55;

		creditJ = credit;
		debitJ = debit;

		if (ecart<0.01 && ecart>-0.01) {
			ctrlJournaux = 1;
			document.getElementById("Ecart_Journal").value = "0.00";
		}

		var ecartCreditCJ = creditCptes - creditJ;
		var ecartDebitCJ = debitCptes - debitJ;

		if (ecartCreditCJ<0.01 && ecartCreditCJ>-0.01 && ecartDebitCJ<0.01 && ecartDebitCJ>-0.01) {
			ctrlCJ = 1;
		}
		var corps = cookie() +"&Page=Compta/ControlCoherence/CtrlFournisseur.tmpl&ContentType=xml";
    requeteHTTP(corps,new XMLHttpRequest(),init4);

	} catch (e) {
    recup_erreur(e);
  }
}


function init4(httpRequest) {
  try {

		var creditF = 0;
		var debitF = 0;

		var contenu = httpRequest.responseXML.documentElement;

		for (i=1;i<contenu.childNodes.length;i++) {

			if (contenu.childNodes.item(i).nodeType==Node.ELEMENT_NODE) {

				creditF += parseFloat(contenu.childNodes.item(i).getAttribute('credit'));
				debitF += parseFloat(contenu.childNodes.item(i).getAttribute('debit'));

				document.getElementById("Credit_Fournisseur").value = nfs.format(creditF);
				document.getElementById("Debit_Fournisseur").value = nfs.format(debitF);
			}
		}
  	var corps = cookie() +"&Page=Compta/ControlCoherence/CtrlCollectif.tmpl&ContentType=xml&Racine=401";
    var httpParams5 = new Array(creditF,debitF);
    requeteHTTP(corps,new XMLHttpRequest(),init5,httpParams5);
		document.getElementById('progression').value = 75;

	} catch (e) {
    recup_erreur(e);
  }
}


function init5(httpRequest,httpParams) {
  try {

    var creditF = httpParams[0];
    var debitF = httpParams[1];
		var credit401;
		var debit401;

		var contenu = httpRequest.responseXML.documentElement;

		credit401 = contenu.getAttribute('credit');
		debit401 = contenu.getAttribute('debit');

		document.getElementById("Credit_401").value = nfs.format(credit401);
		document.getElementById("Debit_401").value = nfs.format(debit401);

		var ecartCF401 = creditF-credit401;
		var ecartDF401 = debitF-debit401;

		document.getElementById("Ecart_CF").value = nfs.format(ecartCF401);
		document.getElementById("Ecart_DF").value = nfs.format(ecartDF401);

		if (ecartCF401<0.01 && ecartCF401>-0.01) {
			document.getElementById("Ecart_CF").value = "0.00";
		}

		if (ecartDF401<0.01 && ecartDF401>-0.01) {
			document.getElementById("Ecart_DF").value = "0.00";
		}

		var corps = cookie() +"&Page=Compta/ControlCoherence/CtrlClient.tmpl&ContentType=xml";
    var httpParams6 = new Array(creditF,debitF,credit401,debit401);
    requeteHTTP(corps,new XMLHttpRequest(),init6,httpParams6);
		document.getElementById('progression').value = 80;

	} catch (e) {
    recup_erreur(e);
  }
}


function init6(httpRequest,httpParams) {
  try {

    var creditF = httpParams[0];
    var debitF = httpParams[1];
    var credit401 = httpParams[2];
    var debit401 = httpParams[3];
		var debitC = 0;
		var creditC = 0;

		var contenu = httpRequest.responseXML.documentElement;

		for (i=1;i<contenu.childNodes.length;i++) {

			if (contenu.childNodes.item(i).nodeType==Node.ELEMENT_NODE) {

				creditC += parseFloat(contenu.childNodes.item(i).getAttribute('credit'));
				debitC += parseFloat(contenu.childNodes.item(i).getAttribute('debit'));

				document.getElementById("Credit_Client").value = nfs.format(creditC);
				document.getElementById("Debit_Client").value = nfs.format(debitC);
			}
		}
  	var corps = cookie() +"&Page=Compta/ControlCoherence/CtrlCollectif.tmpl&ContentType=xml&Racine=411";
    var httpParams7 = new Array(creditF,debitF,credit401,debit401,creditC,debitC);
    requeteHTTP(corps,new XMLHttpRequest(),init7,httpParams7);
		document.getElementById('progression').value = 95;

	} catch (e) {
    recup_erreur(e);
  }
}


function init7(httpRequest,httpParams) {
  try {

    var creditF = httpParams[0];
    var debitF = httpParams[1];
    var credit401 = httpParams[2];
    var debit401 = httpParams[3];
    var creditC = httpParams[4];
    var debitC = httpParams[5];
		var credit411;
		var debit411;

		var contenu = httpRequest.responseXML.documentElement;

		credit411 = contenu.getAttribute('credit');
		debit411 = contenu.getAttribute('debit');

		document.getElementById("Credit_411").value = nfs.format(credit411);
		document.getElementById("Debit_411").value = nfs.format(debit411);

		var ecartCC411 = creditC-credit411;
		var ecartDC411 = debitC-debit411;

		document.getElementById("Ecart_DC").value = nfs.format(ecartDC411);
		document.getElementById("Ecart_CC").value = nfs.format(ecartCC411);

		if (ecartCC411<0.01 && ecartCC411>-0.01) {
			document.getElementById("Ecart_CC").value = "0.00";
		}

		if (ecartDC411<0.01 && ecartDC411>-0.01) {
			document.getElementById("Ecart_DC").value = "0.00";
		}

		document.getElementById('progression').value = 100;

		document.getElementById('bRapport').collapsed = false;

		var ecartTiers = parseFloat(debit411)-debitC+parseFloat(credit411)-creditC+parseFloat(debit401)-debitF+parseFloat(credit401)-creditF;

		if (ecartTiers<0.001 && ecartTiers>-0.001) {
			ctrlTiers = 1;
		}

		if ((ctrlTiers+ctrlComptes+ctrlJournaux+ctrlCJ)!=4) {
			document.getElementById('bContact').collapsed = false;
		}	else {
			document.getElementById('bEntrer').collapsed = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function editerRapport() {
	try {
		var corps = cookie() +"&Page=Compta/ControlCoherence/GenRapport.tmpl&ContentType=xml";
    corps += "&CtrlCJ="+ctrlCJ+"&CtrlComptes="+ctrlComptes+"&CtrlJournaux="+ctrlJournaux+"&CtrlTiers="+ctrlTiers;
    requeteHTTP(corps,new XMLHttpRequest(),suiteEditerRapport);
	} catch (e) {
    recup_erreur(e);
  }
}


function suiteEditerRapport(httpRequest) {
	try {

		var page = "chrome://opensi/content/compta/user/affiche_pdf_rapport.xul?"+ cookie();
    page += "&CtrlComptes="+ctrlComptes+"&CtrlJournaux="+ctrlJournaux+"&CtrlTiers="+ctrlTiers;
  	window.location = page;

	} catch (e) {
    recup_erreur(e);
  }
}

function envoyerRapport() {
	try {
		var corps = cookie() +"&Page=Compta/ControlCoherence/GenRapport.tmpl&ContentType=xml&EnvoiMail=y";
    corps += "&CtrlCJ="+ctrlCJ+"&CtrlComptes="+ctrlComptes+"&CtrlJournaux="+ctrlJournaux+"&CtrlTiers="+ctrlTiers;
    requeteHTTP(corps,new XMLHttpRequest(),suiteEnvoyerRapport);
	} catch (e) {
    recup_erreur(e);
  }
}


function suiteEnvoyerRapport(httpRequest) {
  try {

		showMessage("Le rapport a été envoyé");

	} catch (e) {
    recup_erreur(e);
  }
}


function entrer() {
  try {

		window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie() +"&Dates="+ ParamValeur('Dates');

	} catch (e) {
    recup_erreur(e);
  }
}


function retour_exercice() {
  try {

    window.location = "chrome://opensi/content/compta/user/menu_dossier.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}


function retourChoixDossier() {
  try {

    window.location = "chrome://opensi/content/compta/user/menu.xul?"+ cookie();

  } catch (e) {
    recup_erreur(e);
  }
}


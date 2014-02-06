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

var oef_currentChampCompte;
var oef_chargerModeReg;
var oef_typePort;

var oef_aMentionsClient = new Arbre('Facturation/Clients/liste-mentionsClient.tmpl', 'oef-listeMentions');
var oef_aModesReglements = new Arbre("ComboListe/combo-modesReglement.tmpl", "oef-Mode_Reg");


function initElemsFact() {
	try {

		aOrgLiv = new Arbre("Facturation/GetRDF/liste_orgliv.tmpl", "oef-Num_Org");
		aOrgLiv.initTree(initOrg);
		
		var aCodesTarifs = new Arbre("Facturation/GetRDF/liste_types_tarifs.tmpl", "oef-Code_Tarif");
		aCodesTarifs.initTree(initCodeTarif);
		
		var aBanques = new Arbre('Config/GetRDF/listeBanques.tmpl', 'oef-banqueRemise');
		aBanques.initTree(initBanqueRemise);

		if (mode_tarif=="Q") {
			document.getElementById('row_codeTarif').collapsed = true;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function initCodeTarif() {
	try {
		document.getElementById('oef-Code_Tarif').selectedIndex=0;
	} catch (e) {
		recup_erreur(e);
	}
}


function initOrg() {
	try {

		if (document.getElementById('oef-Num_Org').selectedIndex==-1) {
    	document.getElementById('oef-Num_Org').selectedIndex = 0;
			modifie = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function initBanqueRemise() {
	try {
		document.getElementById('oef-banqueRemise').selectedIndex = 0;
	} catch (e) {
		recup_erreur(e);
	}
}

function chargerModesReglements(selection) {
	try {
		oef_chargerModeReg = selection;
		oef_aModesReglements.setParam("Selection", oef_chargerModeReg);
		oef_aModesReglements.initTree(initModeReglement);
	} catch (e) {
		recup_erreur(e);
	}
}

function initModeReglement() {
	try {

  	document.getElementById('oef-Mode_Reg').value=oef_chargerModeReg;
		modifie = false;

	} catch (e) {
    recup_erreur(e);
  }
}


function rechcompte(id) {
	try {

    setModifie();
		var debCompte="";
		var typeCompte="C";
		oef_currentChampCompte = id;
    var url ="chrome://opensi/content/config/util/rechcompte.xul?"+ cookie();
    url += "&Force_Deb="+debCompte;
    url += "&Type_Compte="+ typeCompte;
    url += "&nom=CLIENT";
    url += "&Creer=false";
    url += "&Num_Compte="+ urlEncode(debCompte);
    window.openDialog(url,'rechcompte','chrome,modal,centerscreen',oef_retourRechercherCompte);
    oef_getCompteCollectif();

	} catch (e) {
		recup_erreur(e);
	}
}

function oef_retourRechercherCompte(numCompte) {
	try {
		document.getElementById(oef_currentChampCompte).value = numCompte;

	} catch (e) {
		  recup_erreur(e);
	}
}


function oef_getCompteCollectif() {
	try {
		var qCollectif = new QueryHttp("Compta/Config/plan_comptable/getCompte.tmpl");
		qCollectif.setParam("Numero_Compte", document.getElementById('oef-Numero_Compte').value);
		var result = qCollectif.execute();
		document.getElementById('oef-Collectif').value = result.responseXML.documentElement.getAttribute('Collectif');
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_initMentions() {
	try {
		oef_aMentionsClient.setParam("Client_Id", currentClient);
		oef_aMentionsClient.initTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_effacerMentions() {
	try {
		oef_aMentionsClient.deleteTree();
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_pressOnTypeFact() {
	try {
		var typeFacturation = document.getElementById('oef-Type_Fact').value;
		if (typeFacturation=="BL") {
			document.getElementById('oef-Mode_Facturation').checked = false;
		}
		document.getElementById('oef-Mode_Facturation').disabled = (typeFacturation=="BL");
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_getListeMentions() {
	try {
		var listeMentions = "";
  	var listbox = document.getElementById("oef-listeMentions");
		var nbLignes = listbox.getRowCount();
		if (nbLignes>0) {
			var i = 0;
			while (i<nbLignes) {
				var item = listbox.getItemAtIndex(i);
				var cks = item.getElementsByTagName("listcell");
				if (cks.item(0).getAttribute("checked")=="true") {
					listeMentions += item.value+",";
				}
				i++;
			}
		}
		
		return listeMentions;
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_testCheck(listitem) {
	try {
		var cks = listitem.getElementsByTagName("listcell");
		var checked = (cks.item(0).getAttribute("checked")=="true");
		cks.item(0).setAttribute("checked",!checked);
		setModifie();
	} catch (e) {
    recup_erreur(e);
  }
}


function oef_switchTypePort() {
	try {

		if (oef_typePort=='P') {
			document.getElementById('oef-bTypePort').setAttribute("class", "bIcoEuro");
			oef_typePort = 'M';
		}
		else {
			document.getElementById('oef-bTypePort').setAttribute("class", "bIcoPourcentage");
			oef_typePort = 'P';
		}
		setModifie();

	} catch (e) {
    recup_erreur(e);
  }
}


function oef_pressOnFrancoPort() {
	try {
	
		var francoPort = document.getElementById('oef-chkFrancoPort').checked;
		document.getElementById('oef-montantFranco').disabled = !francoPort;
		if (!francoPort) {
			document.getElementById('oef-montantFranco').value = "0.00";
		}
		setModifie();
		
	} catch (e) {
		recup_erreur(e);
	}
}


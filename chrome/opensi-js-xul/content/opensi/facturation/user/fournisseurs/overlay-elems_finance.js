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

var currentChampCompte;
var oef_chargerModeReg;
var oef_typePort;

var oef_aModesReglements = new Arbre('ComboListe/combo-modesReglement.tmpl', 'oef-Mode_Reg');


function oef_init() {
	try {
		var aBanques = new Arbre('Config/GetRDF/listeBanques.tmpl', 'oef-banqueRetrait');
		aBanques.initTree(oef_initBanqueRetrait);
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_initBanqueRetrait() {
	try {
		document.getElementById('oef-banqueRetrait').selectedIndex = 0;
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_chargerModesReglements(selection) {
	try {
		oef_chargerModeReg = selection;
		oef_aModesReglements.setParam("Selection", oef_chargerModeReg);
		oef_aModesReglements.initTree(oef_initModeReglement);
	} catch (e) {
		recup_erreur(e);
	}
}


function oef_initModeReglement() {
	try {

    document.getElementById('oef-Mode_Reg').value=oef_chargerModeReg;
    document.getElementById('Modifie').value = "n";

	} catch (e) {
    recup_erreur(e);
  }
}



function report_tranche() {
	try {

		var nf = new NumberFormat("0.00", false);

		var tranche_1 = parseFloat(document.getElementById('oef-Tranche_CA1').value);
		var tranche_2 = parseFloat(document.getElementById('oef-Tranche_CA2').value);
		var tranche_3 = parseFloat(document.getElementById('oef-Tranche_CA3').value);
		var tranche_4 = parseFloat(document.getElementById('oef-Tranche_CA4').value);

		if (isPositiveOrNull(tranche_1) && isPositiveOrNull(tranche_2) && isPositiveOrNull(tranche_3) && isPositiveOrNull(tranche_4)) {
			document.getElementById('oef-De1').value = nf.format(tranche_1);
			document.getElementById('oef-De2').value = nf.format(tranche_2);
			document.getElementById('oef-De3').value = nf.format(tranche_3);
			document.getElementById('oef-De4').value = nf.format(tranche_4);
		}

	} catch (e) {
		recup_erreur(e);
	}
}


function rechcompte(id) {
	try {

    setModifie();
		var debCompte="";
		currentChampCompte = id;

    var url ="chrome://opensi/content/config/util/rechcompte.xul?"+ cookie();
    url += "&Type_Compte=F&nom=FOURNISSEUR&Creer=false&Force_Deb="+ debCompte +"&Num_Compte="+ urlEncode(debCompte);
    window.openDialog(url,'rechcompte','chrome,modal,centerscreen',retourRechercherCompte);
    oef_getCompteCollectif();
    
	} catch (e) {
		recup_erreur(e);
	}
}


function retourRechercherCompte(numCompte) {
	try {
		document.getElementById(currentChampCompte).value = numCompte;

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

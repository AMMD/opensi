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
 * bibliothèque de fonctions de vérification de données bancaires.
 *
 * charger util.js et verif.js préalablement
 */


/*** fonctions de vérification de format des codes bancaires ***/


function isNumCompte(val) {
	try {

		var nc = val.toString();
		return nc.length==11 && isAlphaNum(nc);

	} catch (e) {
    recup_erreur(e);
  }
}


function isCodeGuichet(val) {
	try {

		var cg = val.toString();
		return cg.length==5 && isDigitList(cg);

	} catch (e) {
    recup_erreur(e);
  }
}


function isCodeAgence(val) {
	try {

		var ca = val.toString();
		return ca.length==5 && isDigitList(ca);

	} catch (e) {
    recup_erreur(e);
  }
}


function isPrefIBAN(val) {
	try {

		var pi = val.toString();
		return pi.length==4 && isAlpha(pi.substring(0,2)) && isDigitList(pi.substring(2,4));

	} catch (e) {
    recup_erreur(e);
  }
}


function isBIC(val) {
	try {

		var bic = val.toString();
		return (bic.length==8 || bic.length==11) && isAlphaNum(bic);

	} catch (e) {
    recup_erreur(e);
  }
}


function isCleRIB(val) {
	try {

		var cr = val.toString();
		return cr.length==2 && isDigitList(cr);

	} catch (e) {
    recup_erreur(e);
  }
}


/*** fonctions de vérification de clés RIB et IBAN ***/


function verifCleRIB(cle, bban) {
	try {

		var num_control = makeRibControl(bban);
		return parseIntBis(cle)==calcCleRIB(num_control);

	} catch (e) {
    recup_erreur(e);
  }
}


function verifCleIBAN(cle, prefIban, bban) {
	try {

		var num_control = makeIbanControl(prefIban, bban);
		return parseIntBis(cle)==calcCleIBAN(num_control);

	} catch (e) {
    recup_erreur(e);
  }
}


function calcCleRIB(num_control) {
	try {

		return 97 - calcMod97(num_control);

	} catch (e) {
    recup_erreur(e);
  }
}


function calcCleIBAN(num_control) {
	try {

		return 98 - calcMod97(num_control);

	} catch (e) {
    recup_erreur(e);
  }
}


function makeBBAN(code_agence, code_guichet, num_compte, cle_rib) {
	try {

		return code_agence.toString() + code_guichet.toString() + num_compte.toString() + cle_rib.toString();

	} catch (e) {
    recup_erreur(e);
  }
}


function makeRibControl(bban) {
	try {

		return ribDecode(bban.toString().substring(0,21) +"00");

	} catch (e) {
    recup_erreur(e);
  }
}


function makeIbanControl(prefIban, bban) {
	try {

		return ibanDecode(bban.toString() + prefIban.toString().substring(0,2) +"00");

	} catch (e) {
    recup_erreur(e);
  }
}


function calcMod97(num_control) {
	try {

		var len = num_control.toString().length;
		var i = 0;
		var reste = 0;

		while (i<len) {

			var j = ((len-i)>9?i+9:len);
			var tranche = num_control.substring(i, j);
			i = j;
			reste = parseIntBis(reste.toString() + tranche)%97;
		}

		return reste;

	} catch (e) {
    recup_erreur(e);
  }
}


function ribDecode(num) {
	try {

		var str = num.toString().toLowerCase();

		str = str.replace(/a/g, "1");
		str = str.replace(/b/g, "2");
		str = str.replace(/c/g, "3");
		str = str.replace(/d/g, "4");
		str = str.replace(/e/g, "5");
		str = str.replace(/f/g, "6");
		str = str.replace(/g/g, "7");
		str = str.replace(/h/g, "8");
		str = str.replace(/i/g, "9");
		str = str.replace(/j/g, "1");
		str = str.replace(/k/g, "2");
		str = str.replace(/l/g, "3");
		str = str.replace(/m/g, "4");
		str = str.replace(/n/g, "5");
		str = str.replace(/o/g, "6");
		str = str.replace(/p/g, "7");
		str = str.replace(/q/g, "8");
		str = str.replace(/r/g, "9");
		str = str.replace(/s/g, "2");
		str = str.replace(/t/g, "3");
		str = str.replace(/u/g, "4");
		str = str.replace(/v/g, "5");
		str = str.replace(/w/g, "6");
		str = str.replace(/x/g, "7");
		str = str.replace(/y/g, "8");
		str = str.replace(/z/g, "9");

		return str;

	} catch (e) {
    recup_erreur(e);
  }
}


function ibanDecode(num) {
	try {

		var str = num.toString().toLowerCase();

		str = str.replace(/a/g, "10");
		str = str.replace(/b/g, "11");
		str = str.replace(/c/g, "12");
		str = str.replace(/d/g, "13");
		str = str.replace(/e/g, "14");
		str = str.replace(/f/g, "15");
		str = str.replace(/g/g, "16");
		str = str.replace(/h/g, "17");
		str = str.replace(/i/g, "18");
		str = str.replace(/j/g, "19");
		str = str.replace(/k/g, "20");
		str = str.replace(/l/g, "21");
		str = str.replace(/m/g, "22");
		str = str.replace(/n/g, "23");
		str = str.replace(/o/g, "24");
		str = str.replace(/p/g, "25");
		str = str.replace(/q/g, "26");
		str = str.replace(/r/g, "27");
		str = str.replace(/s/g, "28");
		str = str.replace(/t/g, "29");
		str = str.replace(/u/g, "30");
		str = str.replace(/v/g, "31");
		str = str.replace(/w/g, "32");
		str = str.replace(/x/g, "33");
		str = str.replace(/y/g, "34");
		str = str.replace(/z/g, "35");

		return str;

	} catch (e) {
    recup_erreur(e);
  }
}

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

var ofc_aFiltreCritere1;
var ofc_aFiltreCritere2;
var ofc_aFiltreCritere3;
var ofc_aFiltreCritere4;
var ofc_aFiltreCritere5;

var ofc_critereId1;
var ofc_critereId2;
var ofc_critereId3;
var ofc_critereId4;
var ofc_critereId5;
var ofc_numIncremental;

function ofc_init() {
	try {
		// verrouillage du format de compte
		document.getElementById('ofc-formatCompte').readOnly = true;
	
		// init des variables globales
		ofc_critereId1 = 0;
		ofc_critereId2 = 0;
		ofc_critereId3 = 0;
		ofc_critereId4 = 0;
		ofc_critereId5 = 0;
		ofc_numIncremental = 0;
		
		// init des filtre de critères
		ofc_aFiltreCritere1 = new Arbre("Compta/Analytique/Criteres/listeCriteres.tmpl",'ofc-filtreCritere1');
		ofc_aFiltreCritere2 = new Arbre("Compta/Analytique/Criteres/listeCriteres.tmpl",'ofc-filtreCritere2');
		ofc_aFiltreCritere3 = new Arbre("Compta/Analytique/Criteres/listeCriteres.tmpl",'ofc-filtreCritere3');
		ofc_aFiltreCritere4 = new Arbre("Compta/Analytique/Criteres/listeCriteres.tmpl",'ofc-filtreCritere4');
		ofc_aFiltreCritere5 = new Arbre("Compta/Analytique/Criteres/listeCriteres.tmpl",'ofc-filtreCritere5');
		
		// synchronisation des filtres
		var sia = new SyncInitArbre(ofc_finInit);
  		sia.add(ofc_aFiltreCritere1);
  		sia.add(ofc_aFiltreCritere2);
  		sia.add(ofc_aFiltreCritere3);
  		sia.add(ofc_aFiltreCritere4);
  		sia.add(ofc_aFiltreCritere5);
  		sia.load();
  		
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_finInit() {
	try {
		// activation limitée des critères
		ofc_activeMenu(true);
		
		// ouverture du format
		ofc_ouvrir();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_activeMenu(boolean) {
	try {
		document.getElementById('ofc-filtreCritere1').disabled = !boolean;
		document.getElementById('ofc-filtreCritere2').disabled = ((ofc_critereId1==0) || !boolean);
		document.getElementById('ofc-filtreCritere3').disabled = ((ofc_critereId1==0) || (ofc_critereId2==0) || !boolean);
		document.getElementById('ofc-filtreCritere4').disabled = ((ofc_critereId1==0) || (ofc_critereId2==0) || (ofc_critereId3==0) || !boolean);
		document.getElementById('ofc-filtreCritere5').disabled = ((ofc_critereId1==0) || (ofc_critereId2==0) || (ofc_critereId3==0) || (ofc_critereId4==0) || !boolean);
		document.getElementById('ofc-listeNumIncremental').disabled = !boolean;
		document.getElementById('ofc-bEnregistrer').disabled = !boolean;
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_selectOnFiltreCritere1() {
	try {
		ofc_activeMenu(false);
		ofc_saveCritere1();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_saveCritere1() {
	try {
		ofc_critereId1 = document.getElementById('ofc-filtreCritere1').value;
		if (ofc_critereId1==0) {
			document.getElementById('ofc-filtreCritere2').value=0;
			ofc_saveCritere2();
		}
		ofc_majFormatCompte();
		ofc_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_selectOnFiltreCritere2() {
	try {
		ofc_activeMenu(false);
		ofc_saveCritere2();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_saveCritere2() {
	try {
		ofc_critereId2 = document.getElementById('ofc-filtreCritere2').value;
		if (ofc_critereId2==0) {
			document.getElementById('ofc-filtreCritere3').value=0;
			ofc_saveCritere3();
		}
		if (ofc_critereId1!=0) {
			// il ne s'agit pas d'une propagation de 0
			ofc_majFormatCompte();
		}
		ofc_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_selectOnFiltreCritere3() {
	try {
		ofc_activeMenu(false);
		ofc_saveCritere3();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_saveCritere3() {
	try {
		ofc_critereId3 = document.getElementById('ofc-filtreCritere3').value;
		if (ofc_critereId3==0) {
			document.getElementById('ofc-filtreCritere4').value=0;
			ofc_saveCritere4();
		}
		if (ofc_critereId2!=0) {
			// il ne s'agit pas d'une propagation de 0
			ofc_majFormatCompte();
		}
		ofc_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_selectOnFiltreCritere4() {
	try {
		ofc_activeMenu(false);
		ofc_saveCritere4();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_saveCritere4() {
	try {
		ofc_critereId4 = document.getElementById('ofc-filtreCritere4').value;
		if (ofc_critereId4==0) {
			document.getElementById('ofc-filtreCritere5').value=0;
			ofc_saveCritere5();
		}
		if (ofc_critereId3!=0) {
			// il ne s'agit pas d'une propagation de 0
			ofc_majFormatCompte();
		}
		ofc_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_selectOnFiltreCritere5() {
	try {
		ofc_activeMenu(false);
		ofc_saveCritere5();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_saveCritere5() {
	try {
		ofc_critereId5 = document.getElementById('ofc-filtreCritere5').value;
		if (ofc_critereId4!=0) {
			// il ne s'agit pas d'une propagation de 0
			ofc_majFormatCompte();
		}
		ofc_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_selectOnListeNumIncremental() {
	try {
		ofc_activeMenu(false);
		ofc_saveNumIncremental();
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_saveNumIncremental() {
	try {
		ofc_numIncremental = document.getElementById('ofc-listeNumIncremental').value;
		ofc_majFormatCompte();
		ofc_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_majFormatCompte() {
	try {
		var format = "";
		
		// recuperation des formats de criteres
		var ok = true;
		var format1 = "";
		var format2 = "";
		var format3 = "";
		var format4 = "";
		var format5 = "";
		
		if (ofc_critereId1!=0) {
			var qGetCritere = new QueryHttp("Compta/Analytique/Criteres/getCritere.tmpl");
			qGetCritere.setParam("Critere_Id", ofc_critereId1);
			var result = qGetCritere.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				ok = false;
			} else {
				 format1 = result.responseXML.documentElement.getAttribute('Format_Code');
			}
		}
		
		if (ok && ofc_critereId1!=0 && ofc_critereId2!=0) {
			qGetCritere = new QueryHttp("Compta/Analytique/Criteres/getCritere.tmpl");
			qGetCritere.setParam("Critere_Id", ofc_critereId2);
			var result = qGetCritere.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				ok = false;
			} else {
				 format2 = result.responseXML.documentElement.getAttribute('Format_Code');
			}
		}
		
		if (ok && ofc_critereId1!=0 && ofc_critereId2!=0 && ofc_critereId3!=0) {
			qGetCritere = new QueryHttp("Compta/Analytique/Criteres/getCritere.tmpl");
			qGetCritere.setParam("Critere_Id", ofc_critereId3);
			var result = qGetCritere.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				ok = false;
			} else {
				 format3 = result.responseXML.documentElement.getAttribute('Format_Code');
			}
		}
		
		if (ok && ofc_critereId1!=0 && ofc_critereId2!=0 && ofc_critereId3!=0 && ofc_critereId4!=0) {
			qGetCritere = new QueryHttp("Compta/Analytique/Criteres/getCritere.tmpl");
			qGetCritere.setParam("Critere_Id", ofc_critereId4);
			var result = qGetCritere.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				ok = false;
			} else {
				 format4 = result.responseXML.documentElement.getAttribute('Format_Code');
			}
		}
		
		if (ok && ofc_critereId1!=0 && ofc_critereId2!=0 && ofc_critereId3!=0 && ofc_critereId4!=0 && ofc_critereId5!=0) {
			qGetCritere = new QueryHttp("Compta/Analytique/Criteres/getCritere.tmpl");
			qGetCritere.setParam("Critere_Id", ofc_critereId5);
			var result = qGetCritere.execute();
			var errors = new Errors(result);
	
			if (errors.hasNext()) {
				errors.show();
				ok = false;
			} else {
				 format5 = result.responseXML.documentElement.getAttribute('Format_Code');
			}
		}
		
		if (ok) {
			// reconstition du format de compte
			format = format1 + format2 + format3 + format4 + format5;
			for (var i=0; i<ofc_numIncremental; i++) {
				format += "0";
			}
		}
		document.getElementById('ofc-formatCompte').value = format;
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_isFormatValide(val) {
	try {
		var str = val.toString();
		var ok = !isEmpty(str) && str.length<=10;
		
		if (ok) {
			var nbZeros = 0;
			for (var i=0;i<str.length && ok;i++) {
				var c = str.charAt(i);
				if (nbZeros!=0) {
					ok = (c=='0');
				} else {
					ok = ((c=='A') || (c=='9') || (c=='0'));
				}
				if (c=='0') {
					nbZeros++;
				}
			}
			if (ok) {
				ok = (nbZeros>=3 && nbZeros<=9);
			}
		}
		return ok;
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_pressOnEnregistrer() {
	try {
		var format = document.getElementById('ofc-formatCompte').value;
		// verif un critere
		if (ofc_critereId1==0) {
			showWarning("Veuillez sélectionner au moins un critère !");
		}
		// verif unicité des critères
		else if (ofc_critereId1==ofc_critereId2 || ofc_critereId1==ofc_critereId3 || ofc_critereId1==ofc_critereId4 || ofc_critereId1==ofc_critereId5
			|| (ofc_critereId2!=0 && (ofc_critereId2==ofc_critereId3 || ofc_critereId2==ofc_critereId4 || ofc_critereId2==ofc_critereId5))
			|| (ofc_critereId3!=0 && (ofc_critereId3==ofc_critereId4 || ofc_critereId3==ofc_critereId5))
			|| (ofc_critereId4!=0 && (ofc_critereId4==ofc_critereId5))) {
			showWarning("Veuillez ne sélectionner chaque critère qu'une seule fois !");
		}
		// verif num incremental
		else if (ofc_numIncremental==0) {
			showWarning("Veuillez indiquer un nombre de chiffres pour le numéro incrémental !");
		}
		// verif format
		else if (format.length>10) {
			showWarning("Format de compte trop long !");
		}
		else if (!ofc_isFormatValide(format)) {
			showWarning("Format de compte incorrect !");
		} else {
			ofc_activeMenu(false);
			ofc_saveFormatCompte();
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_saveFormatCompte() {
	try {
		var querySave = new QueryHttp("Compta/Analytique/Format/saveFormat.tmpl");
		
		querySave.setParam("Critere_Id1", ofc_critereId1);
		querySave.setParam("Critere_Id2", ofc_critereId2);
		querySave.setParam("Critere_Id3", ofc_critereId3);
		querySave.setParam("Critere_Id4", ofc_critereId4);
		querySave.setParam("Critere_Id5", ofc_critereId5);
		querySave.setParam("Nb_Incremental", ofc_numIncremental);
		
		var result = querySave.execute();
		var errors = new Errors(result);

		if (errors.hasNext()) {
			errors.show();
		} else {
			showWarning("Le format a bien été enregistré !");
		}
		ofc_activeMenu(true);
	} catch (e) {
		recup_erreur(e);
	}
}

function ofc_ouvrir() {
	try {
		var qGetFormat = new QueryHttp("Compta/Analytique/Format/getFormat.tmpl");
		
		var result = qGetFormat.execute();
		var errors = new Errors(result);
		if (errors.hasNext()) {
			errors.show();
		} else {
			var formatId = result.responseXML.documentElement.getAttribute('Format_Id');
			if (formatId!=0) {
				ofc_critereId1 = result.responseXML.documentElement.getAttribute('Critere_Id1');
				ofc_critereId1 = (ofc_critereId1==null)?0:ofc_critereId1;
				document.getElementById('ofc-filtreCritere1').value = ofc_critereId1;
				ofc_critereId2 = result.responseXML.documentElement.getAttribute('Critere_Id2');
				ofc_critereId2 = (ofc_critereId2==null)?0:ofc_critereId2;
				document.getElementById('ofc-filtreCritere2').value = ofc_critereId2;
				ofc_critereId3 = result.responseXML.documentElement.getAttribute('Critere_Id3');
				ofc_critereId3 = (ofc_critereId3==null)?0:ofc_critereId3;
				document.getElementById('ofc-filtreCritere3').value = ofc_critereId3;
				ofc_critereId4 = result.responseXML.documentElement.getAttribute('Critere_Id4');
				ofc_critereId4 = (ofc_critereId4==null)?0:ofc_critereId4;
				document.getElementById('ofc-filtreCritere4').value = ofc_critereId4;
				ofc_critereId5 = result.responseXML.documentElement.getAttribute('Critere_Id5');
				ofc_critereId5 = (ofc_critereId5==null)?0:ofc_critereId5;
				document.getElementById('ofc-filtreCritere5').value = ofc_critereId5;
				ofc_numIncremental = result.responseXML.documentElement.getAttribute('Nb_Incremental')
				document.getElementById('ofc-listeNumIncremental').value = ofc_numIncremental;
				
				ofc_majFormatCompte();
			}
			ofc_activeMenu(true);
		}
	} catch (e) {
		recup_erreur(e);
	}
}
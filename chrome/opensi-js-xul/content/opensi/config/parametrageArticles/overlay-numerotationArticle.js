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


var ona_numerotationAuto;
var ona_formatNA;


function ona_initNumerotation() {
	try {
		
		var qFormatNA = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qFormatNA.execute();
		ona_formatNA = result.responseXML.documentElement.getAttribute("Format_NA");
		document.getElementById('ona-chkNumerotationAuto').checked = (ona_formatNA!="");
		ona_checkNumerotationAuto(!isEmpty(ona_formatNA));
	} catch (e) {
    recup_erreur(e);
  }
}


function ona_checkNumerotationAuto(b) {
	try {
		ona_numerotationAuto = b;
		document.getElementById('ona-pattern').disabled=!b;
		document.getElementById('ona-bReinitialisation').disabled=!b;
		document.getElementById('ona-zoneFixe').disabled=!b;
		document.getElementById('ona-bAjouterZoneFixe').disabled=!b;
		document.getElementById('ona-nbChiffresAnnee').disabled=!b;
		document.getElementById('ona-bAjouterAnnee').disabled=!b;
		document.getElementById('ona-bAjouterMois').disabled=!b;
		document.getElementById('ona-nbChiffresNumero').disabled=!b;
		document.getElementById('ona-bAjouterNumero').disabled=!b;
		document.getElementById('ona-numDebut').disabled=!b;
		document.getElementById('ona-typeReinitialisation').disabled=!b;
		
		document.getElementById('ona-zoneFixe').value="";
		document.getElementById('ona-nbChiffresAnnee').selectedIndex=0;
		document.getElementById('ona-nbChiffresNumero').value="4";
		
		if (ona_numerotationAuto && !isEmpty(ona_formatNA)) {
			ona_chargerNumerotation();
		} else {
			document.getElementById('ona-pattern').value="";
			document.getElementById('ona-numDebut').value="1";
			document.getElementById('ona-typeReinitialisation').selectedIndex=0;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ona_chargerNumerotation() {
	try {
		var qGetNumerotation = new QueryHttp("Config/parametrageArticles/getNumerotation.tmpl");
		qGetNumerotation.setParam("Format_NA", ona_formatNA);
		var result = qGetNumerotation.execute();
		var contenu = result.responseXML.documentElement;
		document.getElementById('ona-pattern').value = contenu.getAttribute("Pattern");
		document.getElementById('ona-numDebut').value = contenu.getAttribute("Numero_Init");
		document.getElementById('ona-typeReinitialisation').value = contenu.getAttribute("Periode_Init");
	} catch (e) {
		recup_erreur(e);
	}
}


function ona_reinitPattern() {
	try {
		document.getElementById('ona-pattern').value = "";
	} catch (e) {
		recup_erreur(e);
	}
}


function ona_ajouterZoneFixe() {
	try {
		var zoneFixe = document.getElementById('ona-zoneFixe').value;
		if (isEmpty(zoneFixe)) { showWarning("La zone fixe est vide !"); }
		else if (!isCleAlpha(zoneFixe)) { showWarning("La zone fixe contient des caractères invalides !"); }
		else {
			document.getElementById('ona-pattern').value += zoneFixe;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ona_ajouterAnnee() {
	try {
		var annee = (document.getElementById('ona-nbChiffresAnnee').value=="2"?"aa":"aaaa");
		document.getElementById('ona-pattern').value += "["+ annee +"]";
	} catch (e) {
		recup_erreur(e);
	}
}


function ona_ajouterMois() {
	try {
		document.getElementById('ona-pattern').value += "[mm]";
	} catch (e) {
		recup_erreur(e);
	}
}


function ona_ajouterNumero() {
	try {
		var nbChiffres = document.getElementById('ona-nbChiffresNumero').value;
		if (isEmpty(nbChiffres) || !isPositiveInteger(nbChiffres)) { showWarning("Le nombre de chiffres du numéro incrémental est incorrect !"); }
		else {
			nbChiffres = parseIntBis(nbChiffres);
			document.getElementById('ona-pattern').value += "[";
			for (var i=0; i<nbChiffres; i++) {
				document.getElementById('ona-pattern').value += "0";
			}
			document.getElementById('ona-pattern').value += "]";
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ona_enregistrerNumerotation() {
	try {
		var ok=false;
		if (ona_numerotationAuto) {
			
			var pattern = document.getElementById('ona-pattern').value;
			var numDebut = document.getElementById('ona-numDebut').value;
			var typeReinitialisation = document.getElementById('ona-typeReinitialisation').value;
			
			if (ona_checkPattern(pattern, numDebut, typeReinitialisation)) {
				ok = true;
				var qEnregistrerNumerotation;
				if (isEmpty(ona_formatNA)) {
					qEnregistrerNumerotation = new QueryHttp("Config/parametrageArticles/creerNumerotation.tmpl");
				} else {
					qEnregistrerNumerotation = new QueryHttp("Config/parametrageArticles/modifierNumerotation.tmpl");
					qEnregistrerNumerotation.setParam("Format_NA", ona_formatNA);
				}
				qEnregistrerNumerotation.setParam("Pattern", pattern);
				qEnregistrerNumerotation.setParam("Numero_Init", numDebut);
				qEnregistrerNumerotation.setParam("Periode_Init", typeReinitialisation);
				var result = qEnregistrerNumerotation.execute();
				
				if (isEmpty(ona_formatNA)) {
					ona_formatNA = result.responseXML.documentElement.getAttribute("Format_NA");
				}
			}
		} else {
			ok = true;
			// si ona_formatNA est vide, alors inutile de faire la suppression car la liaison n'existe pas
			if (!isEmpty(ona_formatNA)) {
				var qSupprimerNumerotation = new QueryHttp("Config/parametrageArticles/supprimerNumerotation.tmpl");
				qSupprimerNumerotation.setParam("Format_NA", ona_formatNA);
				qSupprimerNumerotation.execute();
				ona_formatNA="";
			}
		}
		
		if (ok) {
			showWarning("Modifications enregistrées !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function ona_checkPattern(pattern, numDebut, typeReinitialisation) {
	try {
		var ok=false;
		
		var nbOccurrencesAnnee = 0;
		var deb = pattern.indexOf('[aa');
		while (deb != -1) {
		  nbOccurrencesAnnee++;
		  deb = pattern.indexOf('[aa',deb+1);
		}
		
		var nbOccurrencesMois = 0;
		deb = pattern.indexOf('[mm]');
		while (deb != -1) {
		  nbOccurrencesMois++;
		  deb = pattern.indexOf('[mm]',deb+1);
		}
		
		var nbOccurrencesNumero = 0;
		deb = pattern.indexOf('[0');
		while (deb != -1) {
		  nbOccurrencesNumero++;
		  deb = pattern.indexOf('[0',deb+1);
		}
		
		var nbChiffresNumero = 0;
		if (nbOccurrencesNumero==1) {
			deb = pattern.indexOf('[0');
			var fin = pattern.indexOf('0]',deb+1);
			nbChiffresNumero = fin-deb;
		}
		
		var purgePattern = pattern.replace(/\[/g, "");
		purgePattern = purgePattern.replace(/\]/g, "");
		
		if (isEmpty(purgePattern)) { showWarning("Le format du numéro ne doit pas être vide !"); }
		else if (purgePattern.length>40) { showWarning("Le format du numéro ne doit pas excéder 40 caractères !"); }
		else if (nbOccurrencesAnnee>1) { showWarning("L'année ne doit pas apparaître plus d'une fois !"); }
		else if (nbOccurrencesMois>1) { showWarning("Le mois ne doit pas apparaître plus d'une fois !"); }
		else if (nbOccurrencesAnnee==0 && nbOccurrencesMois==1) { showWarning("Le mois ne doit pas apparaître si l'année n'y est pas !"); }
		else if (nbOccurrencesNumero!=1) { showWarning("Le numéro incrémental doit apparaître une fois !"); }
		else if (isEmpty(numDebut) || !isPositiveInteger(numDebut)) { showWarning("Le numéro de départ est incorrect !"); }
		else if (parseIntBis(numDebut) > Math.pow(10,nbChiffresNumero)-1) { showWarning("Le nombre de chiffres du numéro de départ est plus élevé que celui du numéro incrémental !"); }
		else if (typeReinitialisation=="A" && nbOccurrencesAnnee!=1) { showWarning("La réinitialisation ne peut pas être annuelle si l'année ne figure pas dans le format !"); }
		else if (typeReinitialisation=="M" && nbOccurrencesMois!=1) { showWarning("La réinitialisation ne peut pas être mensuelle si le mois ne figure pas dans le format !"); }
		else {
			ok = true;
		}
		
		return ok;
	} catch (e) {
		recup_erreur(e);
	}
}




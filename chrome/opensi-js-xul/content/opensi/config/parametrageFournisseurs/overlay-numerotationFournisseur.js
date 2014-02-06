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


var onf_numerotationAuto;
var onf_formatNF;


function onf_initNumerotation() {
	try {
		
		var qFormatNF = new QueryHttp("Config/gestion_commerciale/preferences/getParam.tmpl");
		var result = qFormatNF.execute();
		onf_formatNF = result.responseXML.documentElement.getAttribute("Format_NF");
		document.getElementById('onf-chkNumerotationAuto').checked = (onf_formatNF!="");
		onf_checkNumerotationAuto(!isEmpty(onf_formatNF));
	} catch (e) {
    recup_erreur(e);
  }
}


function onf_checkNumerotationAuto(b) {
	try {
		onf_numerotationAuto = b;
		document.getElementById('onf-pattern').disabled=!b;
		document.getElementById('onf-bReinitialisation').disabled=!b;
		document.getElementById('onf-zoneFixe').disabled=!b;
		document.getElementById('onf-bAjouterZoneFixe').disabled=!b;
		document.getElementById('onf-nbChiffresAnnee').disabled=!b;
		document.getElementById('onf-bAjouterAnnee').disabled=!b;
		document.getElementById('onf-bAjouterMois').disabled=!b;
		document.getElementById('onf-nbChiffresNumero').disabled=!b;
		document.getElementById('onf-bAjouterNumero').disabled=!b;
		document.getElementById('onf-numDebut').disabled=!b;
		document.getElementById('onf-typeReinitialisation').disabled=!b;
		
		document.getElementById('onf-zoneFixe').value="";
		document.getElementById('onf-nbChiffresAnnee').selectedIndex=0;
		document.getElementById('onf-nbChiffresNumero').value="4";
		
		if (onf_numerotationAuto && !isEmpty(onf_formatNF)) {
			onf_chargerNumerotation();
		} else {
			document.getElementById('onf-pattern').value="";
			document.getElementById('onf-numDebut').value="1";
			document.getElementById('onf-typeReinitialisation').selectedIndex=0;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function onf_chargerNumerotation() {
	try {
		var qGetNumerotation = new QueryHttp("Config/parametrageFournisseurs/getNumerotation.tmpl");
		qGetNumerotation.setParam("Format_NF", onf_formatNF);
		var result = qGetNumerotation.execute();
		var contenu = result.responseXML.documentElement;
		document.getElementById('onf-pattern').value = contenu.getAttribute("Pattern");
		document.getElementById('onf-numDebut').value = contenu.getAttribute("Numero_Init");
		document.getElementById('onf-typeReinitialisation').value = contenu.getAttribute("Periode_Init");
	} catch (e) {
		recup_erreur(e);
	}
}


function onf_reinitPattern() {
	try {
		document.getElementById('onf-pattern').value = "";
	} catch (e) {
		recup_erreur(e);
	}
}


function onf_ajouterZoneFixe() {
	try {
		var zoneFixe = document.getElementById('onf-zoneFixe').value;
		if (isEmpty(zoneFixe)) { showWarning("La zone fixe est vide !"); }
		else if (!isCleAlpha(zoneFixe)) { showWarning("La zone fixe contient des caractères invalides !"); }
		else {
			document.getElementById('onf-pattern').value += zoneFixe;
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function onf_ajouterAnnee() {
	try {
		var annee = (document.getElementById('onf-nbChiffresAnnee').value=="2"?"aa":"aaaa");
		document.getElementById('onf-pattern').value += "["+ annee +"]";
	} catch (e) {
		recup_erreur(e);
	}
}


function onf_ajouterMois() {
	try {
		document.getElementById('onf-pattern').value += "[mm]";
	} catch (e) {
		recup_erreur(e);
	}
}


function onf_ajouterNumero() {
	try {
		var nbChiffres = document.getElementById('onf-nbChiffresNumero').value;
		if (isEmpty(nbChiffres) || !isPositiveInteger(nbChiffres)) { showWarning("Le nombre de chiffres du numéro incrémental est incorrect !"); }
		else {
			nbChiffres = parseIntBis(nbChiffres);
			document.getElementById('onf-pattern').value += "[";
			for (var i=0; i<nbChiffres; i++) {
				document.getElementById('onf-pattern').value += "0";
			}
			document.getElementById('onf-pattern').value += "]";
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function onf_enregistrerNumerotation() {
	try {
		var ok=false;
		if (onf_numerotationAuto) {
			
			var pattern = document.getElementById('onf-pattern').value;
			var numDebut = document.getElementById('onf-numDebut').value;
			var typeReinitialisation = document.getElementById('onf-typeReinitialisation').value;
			
			if (onf_checkPattern(pattern, numDebut, typeReinitialisation)) {
				ok = true;
				var qEnregistrerNumerotation;
				if (isEmpty(onf_formatNF)) {
					qEnregistrerNumerotation = new QueryHttp("Config/parametrageFournisseurs/creerNumerotation.tmpl");
				} else {
					qEnregistrerNumerotation = new QueryHttp("Config/parametrageFournisseurs/modifierNumerotation.tmpl");
					qEnregistrerNumerotation.setParam("Format_NF", onf_formatNF);
				}
				qEnregistrerNumerotation.setParam("Pattern", pattern);
				qEnregistrerNumerotation.setParam("Numero_Init", numDebut);
				qEnregistrerNumerotation.setParam("Periode_Init", typeReinitialisation);
				var result = qEnregistrerNumerotation.execute();
				
				if (isEmpty(onf_formatNF)) {
					onf_formatNF = result.responseXML.documentElement.getAttribute("Format_NF");
				}
			}
		} else {
			ok = true;
			// si onf_formatNF est vide, alors inutile de faire la suppression car la liaison n'existe pas
			if (!isEmpty(onf_formatNF)) {
				var qSupprimerNumerotation = new QueryHttp("Config/parametrageFournisseurs/supprimerNumerotation.tmpl");
				qSupprimerNumerotation.setParam("Format_NF", onf_formatNF);
				qSupprimerNumerotation.execute();
				onf_formatNF="";
			}
		}
		
		if (ok) {
			showWarning("Modifications enregistrées !");
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function onf_checkPattern(pattern, numDebut, typeReinitialisation) {
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
		else if (purgePattern.length>10) { showWarning("Le format du numéro ne doit pas excéder 10 caractères !"); }
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




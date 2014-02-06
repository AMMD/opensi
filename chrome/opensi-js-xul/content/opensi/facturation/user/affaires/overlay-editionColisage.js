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

//var oecol_aOrgLiv = new Arbre("Facturation/GetRDF/liste_orgliv.tmpl","oecol-numOrg");
var oecol_aColis = new Arbre("Facturation/GetRDF/liste_colis.tmpl","oecol-listeColis");
var oecol_aHorsColis = new Arbre("Facturation/GetRDF/hors_colis.tmpl","oecol-horsColis");
var oecol_aContenuColis = new Arbre("Facturation/GetRDF/contenu_colis.tmpl","oecol-contenuColis");

var oecol_qEtiquettes = new QueryHttp("Facturation/Affaires/pdfEtiquettes.tmpl");
var oecol_qajoutArticleColis = new QueryHttp("Facturation/Affaires/ajouterArticleColis.tmpl");
var oecol_qCalculColisage = new QueryHttp("Facturation/Affaires/calculColisage.tmpl");
var oecol_qNbColisSuivi = new QueryHttp("Facturation/Affaires/getNbColisSuivi.tmpl");

var oecol_colisId = 0;
var oecol_autEtiq = false;


function oecol_init() {
  try {
  	oecol_colisId = 0;
		oecol_disableRetirer(true);
		oecol_disableAjouter(true);

		oecol_qNbColisSuivi.setParam("Bon_Id",bonId);
		var retour = oecol_qNbColisSuivi.execute();
		document.getElementById("oecol-bCalculColisage").disabled = retour.responseXML.documentElement.getAttribute('NbColis')>0;

		oecol_qCalculColisage.setParam("Bon_Id",bonId);

		oecol_aColis.setParam("Bon_Id",bonId);
		oecol_aColis.initTree(oecol_calcColis);
		oecol_aHorsColis.setParam("Bon_Id",bonId);
		oecol_aHorsColis.initTree();
		
		oecol_nouveauColis();

		//oecol_aOrgLiv.initTree(oecol_initOrg);
		document.getElementById("bRetourBL").collapsed = false;

  } catch (e) {
    recup_erreur(e);
  }
}

/*function oecol_initOrg() {
	try {

    document.getElementById('oecol-numOrg').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}*/

function oecol_nouveauColis() {
	try {

		oecol_aContenuColis.deleteTree();
		oecol_colisId = 0;
		document.getElementById('oecol-lblContenu').value = "Nouveau colis :";

	} catch (e) {
    recup_erreur(e);
  }
}


function oecol_reporterQteEntree() {
	try {

		if (oecol_aHorsColis.isSelected()) {
			document.getElementById("oecol-QteEntree").value = oecol_aHorsColis.getSelectedCellText('oecol-colQuantiteHC');
			var poidsUnit = oecol_aHorsColis.getSelectedCellText('oecol-colPoidsHC');
			document.getElementById("oecol-PoidsEntree").value = poidsUnit;
			oecol_disableRetirer(true);
			oecol_disableAjouter(false);
			document.getElementById('oecol-PoidsEntree').disabled = !isEmpty(poidsUnit);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oecol_reporterQteSortie() {
	try {

		if (oecol_aContenuColis.isSelected()) {
			document.getElementById("oecol-QteSortie").value = oecol_aContenuColis.getSelectedCellText('oecol-colQuantite');
			oecol_disableRetirer(false);
			oecol_disableAjouter(true);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oecol_disableAjouter(b) {
	try {
		document.getElementById('oecol-bAjouter').disabled = b;
		document.getElementById('oecol-QteEntree').disabled = b;
		document.getElementById('oecol-PoidsEntree').disabled = b;
	} catch (e) {
    recup_erreur(e);
  }
}


function oecol_disableRetirer(b) {
	try {
		document.getElementById('oecol-bRetirer').disabled = b;
		document.getElementById('oecol-QteSortie').disabled = b;
	} catch (e) {
    recup_erreur(e);
  }
}


function oecol_calculColisage() {
	try {

		oecol_qCalculColisage.execute();
		oecol_aHorsColis.initTree();
		oecol_aColis.initTree(oecol_calcColis);

	} catch (e) {
    recup_erreur(e);
  }
}


function oecol_ajouterAuColis() {
	try {


		if (oecol_aHorsColis.isSelected()) {

			var refLigne = oecol_aHorsColis.getSelectedCellValue('oecol-colReferenceHC');
			var qteinit = oecol_aHorsColis.getSelectedCellText('oecol-colQuantiteHC');
			var poids = document.getElementById("oecol-PoidsEntree").value;
			var quantite = document.getElementById("oecol-QteEntree").value;

			if (isEmpty(quantite)) {
				showWarning("Veuillez entrer une quantité à transférer");
			}
			else if (!checkQte(quantite)) {
				showWarning("Quantité incorrecte !");
			}
			else if (parseFloat(qteinit)-parseFloat(quantite)<0) {
				showWarning("La quantité à transférer dépasse la quantité restant à livrer !");
			}
			else if (isEmpty(poids)) {
				showWarning("Veuillez entrer un poids unitaire pour cet article !");
			}
			else if (!isPositiveOrNull(poids) || !checkDecimal(poids,3)) {
				showWarning("Poids unitaire incorrect !");
			}
			else {

				oecol_disableAjouter(true);

				oecol_qajoutArticleColis.setParam("Colis_Id",oecol_colisId);
				oecol_qajoutArticleColis.setParam("Ref_Ligne",refLigne);
				oecol_qajoutArticleColis.setParam("Quantite",quantite);
				oecol_qajoutArticleColis.setParam("Poids",poids);
				oecol_qajoutArticleColis.setParam("Bon_Id",bonId);
				oecol_qajoutArticleColis.execute(oecol_ajouterAuColis_2);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function oecol_ajouterAuColis_2(httpRequest) {
	try {

		if (oecol_colisId==0) {
			oecol_colisId = httpRequest.responseXML.documentElement.getAttribute("Colis_Id");
			document.getElementById('oecol-lblContenu').value = "Contenu du colis n° "+ oecol_colisId;
		}
		oecol_aContenuColis.setParam("Colis_Id", oecol_colisId);
		oecol_aContenuColis.initTree();
		oecol_aHorsColis.initTree();
		oecol_aColis.initTree(oecol_calcColis);

	} catch (e) {
    recup_erreur(e);
  }
}


function oecol_retirerAuColis() {
  try {

		if (oecol_aContenuColis.isSelected()) {

			var ref_ligne = oecol_aContenuColis.getSelectedCellValue('oecol-colReference');
			var qteinit = oecol_aContenuColis.getSelectedCellText('oecol-colQuantite');
			var quantite = document.getElementById("oecol-QteSortie").value;

			if (isEmpty(quantite)) {
				showWarning("Veuillez entrer une quantité à enlever");
			}
			else if (!checkQte(quantite)) {
				showWarning("Quantité incorrecte !");
			}
			else if (parseFloat(qteinit)-parseFloat(quantite)<0) {
				showWarning("La quantité à enlever ne peut dépasser la quantité présente dans le colis !");
			}
			else {

				oecol_disableRetirer(true);

				var corps = cookie() +"&Page=Facturation/Affaires/enleverArticleColis.tmpl&ContentType=xml&Colis_Id="+ oecol_colisId;
						corps += "&Ref_Ligne="+ ref_ligne +"&QteInit="+ qteinit +"&Quantite="+ quantite;

				requeteHTTP(corps, new XMLHttpRequest(), oecol_retirerAuColis_2);
			}
		}

	} catch (e) {
  	recup_erreur(e);
	}
}


function oecol_retirerAuColis_2(httpRequest) {
  try {

		if (httpRequest.responseXML.documentElement.getAttribute("vide")=="y") {
			oecol_nouveauColis();
		}
		else {
			oecol_aContenuColis.setParam("Colis_Id", oecol_colisId);
			oecol_aContenuColis.initTree();
		}
		oecol_aHorsColis.initTree();
		oecol_aColis.initTree(oecol_calcColis);

	} catch (e) {
  	recup_erreur(e);
	}
}


function oecol_afficherContenu() {
	try {

		if (oecol_aColis.isSelected()) {
			oecol_colisId = oecol_aColis.getSelectedCellValue('oecol-colNumColis');
			document.getElementById('oecol-lblContenu').value = "Contenu du colis n° "+ oecol_aColis.getSelectedCellText('oecol-colNumColis') +" :";
			oecol_aContenuColis.setParam("Colis_Id", oecol_colisId);
			oecol_aContenuColis.initTree();
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function oecol_demandeEnregistrement() {
	try {

	} catch (e) {
    recup_erreur(e);
  }
}

function oecol_calcColis() {
	try {

		if (oecol_aColis.isNotNull()) {

			document.getElementById('oecol-nbColis').value = oecol_aColis.nbLignes();

			var pt = 0;

			for (var i=0;i<oecol_aColis.nbLignes();i++) {
				pt += parseFloat(oecol_aColis.getCellText(i, 'oecol-colPoidsColis'));
			}
			var nf = new NumberFormat("0.##", false);
			document.getElementById('oecol-poidsTotal').value = nf.format(pt);
		}

		oecol_autEtiq = (parseIntBis(document.getElementById('oecol-nbColis').value)>0);

	} catch (e) {
    recup_erreur(e);
  }
}

function oecol_editerEtiquettesSans() {
	try {

		var oecol_nbEtiquettes = document.getElementById('oecol-nbEtiquettes').value;

		if (isEmpty(oecol_nbEtiquettes) || !isPositiveInteger(oecol_nbEtiquettes)) {
			showWarning("Nombre d'étiquettes incorrect");
		}
		else {
			document.getElementById("oecol-deckColisageEtiquettes").selectedIndex = 1;
			oecol_qEtiquettes.setParam("Bon_Id", bonId);		
			oecol_qEtiquettes.setParam("Nb_Colis", oecol_nbEtiquettes);		
			var result = oecol_qEtiquettes.execute();
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
			document.getElementById('oecol-pdfColisageEtiquettes').setAttribute("src", page);
			document.getElementById("bRetourColisage").collapsed = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}

function oecol_editerEtiquettes() {
	try {

		if (oecol_autEtiq) {
			document.getElementById("oecol-deckColisageEtiquettes").selectedIndex = 1;
			oecol_qEtiquettes.setParam("Bon_Id", bonId);		
			if (!isEmpty(document.getElementById('oecol-nbColis').value)) {
				oecol_qEtiquettes.setParam("Nb_Colis", document.getElementById('oecol-nbColis').value);		
			}
			var result = oecol_qEtiquettes.execute();
			var page = getDirPdf() + result.responseXML.documentElement.getAttribute('fichier');
			document.getElementById('oecol-pdfColisageEtiquettes').setAttribute("src", page);
			document.getElementById("bRetourColisage").collapsed = false;
		}
		else {
			showWarning("Vous devez avoir au moins un colis pour pouvoir générer des etiquettes");
		}

	} catch (e) {
    recup_erreur(e);
  }
}

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

var aRecherche = new Arbre('Facturation/Outillage/liste_outils.tmpl', 'tree-outils');
var currentOutil = "";

function init() {
	try {
		init2();
		window.resizeTo(900,650);
	} catch (e) {
		recup_erreur(e);
	}
}

function init2() {
  try {
		var aRForme = new Arbre('Facturation/Outillage/liste_critere_outils.tmpl', 'Rforme');
		aRForme.setParam('critere', 'forme');
		aRForme.initTree(initRForme);
		
		var aRCategorie = new Arbre('Facturation/Outillage/liste_critere_outils.tmpl', 'Rcategorie');
		aRCategorie.setParam('critere', 'categorie');
		aRCategorie.initTree(initRCategorie);
		
		var aRType = new Arbre('Facturation/Outillage/liste_critere_outils.tmpl', 'Rtype');
		aRType.setParam('critere', 'type');
		aRType.initTree(initRType);
		
		var aForme = new Arbre('Facturation/Outillage/liste_critere_outils.tmpl', 'forme');
		aForme.setParam('critere', 'forme');
		aForme.initTree(initForme);
		
		var aCategorie = new Arbre('Facturation/Outillage/liste_critere_outils.tmpl', 'categorie');
		aCategorie.setParam('critere', 'categorie');
		aCategorie.initTree(initCategorie);
		
		var aType = new Arbre('Facturation/Outillage/liste_critere_outils.tmpl', 'type');
		aType.setParam('critere', 'type');
		aType.initTree(initType);
  } catch (e) {
    recup_erreur(e);
  }
}


function initRForme() {
	try {
		document.getElementById('Rforme').selectedIndex = 0;
	} catch (e) {
    recup_erreur(e);
  }
}

function initRCategorie() {
	try {
		document.getElementById('Rcategorie').selectedIndex = 0;
	} catch (e) {
    recup_erreur(e);
  }
}

function initRType() {
	try {
		document.getElementById('Rtype').selectedIndex = 0;
	} catch (e) {
    recup_erreur(e);
  }
}

function initForme() {
	try {
		document.getElementById('forme').selectedIndex = 0;
	} catch (e) {
    recup_erreur(e);
  }
}

function initCategorie() {
	try {
		document.getElementById('categorie').selectedIndex = 0;
	} catch (e) {
    recup_erreur(e);
  }
}

function initType() {
	try {
		document.getElementById('type').selectedIndex = 0;
	} catch (e) {
    recup_erreur(e);
  }
}


function rechercher() {
	try {
		var numero = document.getElementById('Rnumero').value;
		var forme = (document.getElementById('Rforme').value == "[toutes]"?"":document.getElementById('Rforme').value);
		var categorie = (document.getElementById('Rcategorie').value == "[toutes]"?"":document.getElementById('Rcategorie').value);
		var type = (document.getElementById('Rtype').value == "[tous]"?"":document.getElementById('Rtype').value);
		var diametre = (document.getElementById('Rdiametre').value).replace(",", ".");
		var rayon = (document.getElementById('Rrayon').value).replace(",", ".");
		var longueur = (document.getElementById('Rlongueur').value).replace(",", ".");
		var largeur = (document.getElementById('Rlargeur').value).replace(",", ".");
		var hauteur = (document.getElementById('Rhauteur').value).replace(",", ".");
		var hauteur_lame = (document.getElementById('Rhaut_lame').value).replace(",", ".");

		if (!isEmpty(numero) && !isPositiveInteger(numero)) { showWarning("Le numéro est incorrect !"); }
		else if (!checkType(4,2,diametre)) { showWarning("Le diamètre est incorrect !"); }
		else if (!checkType(4,2,rayon)) { showWarning("Le rayon est incorrect !"); }
		else if (!checkType(4,2,longueur)) { showWarning("La longueur est incorrecte !"); }
		else if (!checkType(4,2,largeur)) { showWarning("La largeur est incorrecte !"); }
		else if (!checkType(4,2,hauteur)) { showWarning("La hauteur est incorrecte !"); }
		else if (!checkType(4,2,hauteur_lame)) { showWarning("La hauteur de lame est incorrecte !"); }
		else {
			aRecherche.setParam('Numero', numero);
			aRecherche.setParam('Forme', forme);
			aRecherche.setParam('Categorie', categorie);
			aRecherche.setParam('Type', type);
			aRecherche.setParam('Diametre', diametre);
			aRecherche.setParam('Rayon', rayon);
			aRecherche.setParam('Longueur', longueur);
			aRecherche.setParam('Largeur', largeur);
			aRecherche.setParam('Hauteur', hauteur);
			aRecherche.setParam('Haut_Lame', hauteur_lame);
			aRecherche.initTree();
		}
	} catch (e) {
    recup_erreur(e);
  }
}


function checkType(nbentier, nbdecimal, val) {
	try {
		return (checkDecimal(val, nbdecimal) && checkIPart(val, nbentier));
	} catch (e) {
    recup_erreur(e);
  }
}


function changergroupbox(check) {
	try {
		document.getElementById('gpGerer').collapsed=!check;
		if (check) {
			nouvelOutil();
		}
		window.resizeTo(900,check?900:650);
	} catch (e) {
    recup_erreur(e);
  }
}


function nouvelOutil() {
	try {
		document.getElementById('bNouveau').collapsed=true;
		document.getElementById('bEnregistrer').collapsed=false;
		document.getElementById('bSupprimer').collapsed=true;
		currentOutil="";
		document.getElementById('numero').disabled=false;
		document.getElementById('numero').value="";
		document.getElementById('forme').selectedIndex=0;
		document.getElementById('categorie').selectedIndex=0;
		document.getElementById('type').selectedIndex=0;
		document.getElementById('diametre').value="";
		document.getElementById('rayon').value="";
		document.getElementById('longueur').value="";
		document.getElementById('largeur').value="";
		document.getElementById('hauteur').value="";
		document.getElementById('haut_lame').value="";
		if (aRecherche.isSelected()) {
			aRecherche.select(-1);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function pressOntree(ev) {
  try {

    if (ev.keyCode==13) {
			selectOutil();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function selectOutil() {
	try {
		if (aRecherche.isSelected()) {
			var currentIndex = aRecherche.getCurrentIndex();
			currentOutil = aRecherche.getCellText(currentIndex,'colOutilId');
			document.getElementById('numero').value = aRecherche.getCellText(currentIndex,'colNumero');
			document.getElementById('forme').value = (aRecherche.getCellText(currentIndex,'colForme')==""?"[aucune]":aRecherche.getCellText(currentIndex,'colForme'));
			document.getElementById('type').value = (aRecherche.getCellText(currentIndex,'colType')==""?"[aucun]":aRecherche.getCellText(currentIndex,'colType'));
			document.getElementById('categorie').value = (aRecherche.getCellText(currentIndex,'colCategorie')==""?"[aucune]":aRecherche.getCellText(currentIndex,'colCategorie'));
			document.getElementById('diametre').value= aRecherche.getCellText(currentIndex,'colDiametre');
			document.getElementById('rayon').value= aRecherche.getCellText(currentIndex,'colRayon');
			document.getElementById('longueur').value= aRecherche.getCellText(currentIndex,'colLongueur');
			document.getElementById('largeur').value= aRecherche.getCellText(currentIndex,'colLargeur');
			document.getElementById('hauteur').value= aRecherche.getCellText(currentIndex,'colHauteur');
			document.getElementById('haut_lame').value= aRecherche.getCellText(currentIndex,'colHauteurLame');
			document.getElementById('bNouveau').collapsed=false;
			document.getElementById('bEnregistrer').collapsed=false;
			document.getElementById('bSupprimer').collapsed=false;
			document.getElementById('numero').disabled=true;
		}
	} catch (e) {
		recup_erreur(e);
	}
}



function enregistrerOutil() {
	try {
		
		var numero = document.getElementById('numero').value;
		var forme = (document.getElementById('forme').value == "[aucune]"?"":document.getElementById('forme').value);
		var categorie = (document.getElementById('categorie').value == "[aucune]"?"":document.getElementById('categorie').value);
		var type = (document.getElementById('type').value == "[aucun]"?"":document.getElementById('type').value);
		var diametre = (document.getElementById('diametre').value).replace(",", ".");
		var rayon = (document.getElementById('rayon').value).replace(",", ".");
		var longueur = (document.getElementById('longueur').value).replace(",", ".");
		var largeur = (document.getElementById('largeur').value).replace(",", ".");
		var hauteur = (document.getElementById('hauteur').value).replace(",", ".");
		var hauteur_lame = (document.getElementById('haut_lame').value).replace(",", ".");
		
		if (isEmpty(numero) || !isPositiveInteger(numero)) { showWarning("Le numéro est incorrect !"); }
		else if (!isEmpty(diametre) && !checkType(4,2,diametre)) { showWarning("Le diamètre est incorrect !"); }
		else if (!isEmpty(rayon) && !checkType(4,2,rayon)) { showWarning("Le rayon est incorrect !"); }
		else if (!isEmpty(longueur) && !checkType(4,2,longueur)) { showWarning("La longueur est incorrecte !"); }
		else if (!isEmpty(largeur) && !checkType(4,2,largeur)) { showWarning("La largeur est incorrecte !"); }
		else if (!isEmpty(hauteur) && !checkType(4,2,hauteur)) { showWarning("La hauteur est incorrecte !"); }
		else if (!isEmpty(hauteur_lame) && !checkType(4,2,hauteur_lame)) { showWarning("La hauteur de lame est incorrecte !"); }
		else {
	
			var qEnregistrer;
			if (currentOutil=="") {
				qEnregistrer = new QueryHttp("Facturation/Outillage/creer_outil.tmpl");
			} else {
				qEnregistrer = new QueryHttp("Facturation/Outillage/modifier_outil.tmpl");
				qEnregistrer.setParam("Outil_Id", currentOutil);
			}
			qEnregistrer.setParam('Numero', numero);
			qEnregistrer.setParam('Forme', forme);
			qEnregistrer.setParam('Categorie', categorie);
			qEnregistrer.setParam('Type', type);
			qEnregistrer.setParam('Diametre', diametre);
			qEnregistrer.setParam('Rayon', rayon);
			qEnregistrer.setParam('Longueur', longueur);
			qEnregistrer.setParam('Largeur', largeur);
			qEnregistrer.setParam('Hauteur', hauteur);
			qEnregistrer.setParam('Haut_Lame', hauteur_lame);
			var result = qEnregistrer.execute();
			
			var ok=true;
			if (currentOutil=="") {
				if (result.responseXML.documentElement.getAttribute("ok")=="false") {
					showWarning("Ce numéro d'outil est déjà utilisé !");
					ok = false;
				} else {
					showWarning("L'outil a été créé !");
				}
			} else {
				showWarning("L'outil a été modifié !");
			}
			
			if (ok) {
				init2();
				nouvelOutil();
				rechercher();
			}
			
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function supprimerOutil() {
	try {
		if (window.confirm("Voulez-vous supprimer cet outil ?")) {
			qDelete = new QueryHttp("Facturation/Outillage/supprimer_outil.tmpl");
			qDelete.setParam('Outil_Id', currentOutil);
			qDelete.execute();
			showWarning("L'outil est supprimé");
			init2();
			nouvelOutil();
			rechercher();
		}
	} catch (e) {
		recup_erreur(e);
	}
}



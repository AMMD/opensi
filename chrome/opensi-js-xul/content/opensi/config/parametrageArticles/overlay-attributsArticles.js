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


var oa_currentListe;
var oa_currentAttribut;
var oa_currentCirconstanciation;
var oa_aListeAttributs = new Arbre('Config/parametrageArticles/listeAttributs.tmpl', 'oa-listeAttributs');
var oa_aAttributsArticles = new Arbre('Config/parametrageArticles/listeAttributsArticles.tmpl', 'oa-listeAttributsArticles');
var oa_aCirconstanciation = new Arbre('Config/parametrageArticles/listeCirconstanciation.tmpl', 'oa-listeCirconstanciation');


function oa_initAttributs() {
	try {
		
		oa_aListeAttributs.initTree(oa_initListeAttributs);

	} catch (e) {
    recup_erreur(e);
  }
}


function oa_initListeAttributs() {
	try {
		
		oa_currentListe = "";
		oa_currentCirconstanciation = false;
		
		
		document.getElementById('oa-nom').value = "";
		document.getElementById('oa-chkCirconstancie').checked = false;
		
		document.getElementById('oa-nom').disabled = true;
		document.getElementById('oa-chkCirconstancie').disabled = true;
		document.getElementById('oa-bEnregistrerListe').disabled = true;
		
		oa_aAttributsArticles.deleteTree();
		document.getElementById('oa-libelle').value = "";
		document.getElementById('oa-chkActif').checked = false;
		document.getElementById('oa-listeAttributsArticles').disabled = true;
		document.getElementById('oa-libelle').disabled = true;
		document.getElementById('oa-chkActif').disabled = true;
		document.getElementById('oa-bAnnulerAttribut').disabled = true;
		document.getElementById('oa-bValiderAttribut').disabled = true;
		document.getElementById('oa-bSupprimerAttribut').disabled = true;
		document.getElementById('oa-bFlecheHaut').disabled = true;
		document.getElementById('oa-bFlecheBas').disabled = true;
		
		document.getElementById('oa-circonstanciation').collapsed = true;
		oa_aCirconstanciation.deleteTree();
		document.getElementById('oa-listeCirconstanciation').disabled = true;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_enregistrerListeAttributs() {
	try {
		
		var nom = document.getElementById('oa-nom').value;
		var circonstancie = document.getElementById('oa-chkCirconstancie').checked;
		
		if (isEmpty(nom)) { showWarning("Veuillez saisir un nom d'attribut !"); }
		else {
			var qEnregistrer = new QueryHttp("Config/parametrageArticles/modifierListeAttribut.tmpl");
			qEnregistrer.setParam("Liste_Id", oa_currentListe);
			qEnregistrer.setParam("Nom", nom);
			qEnregistrer.setParam("Circonstancie", circonstancie);
			var result = qEnregistrer.execute();
			var errors = new Errors(result);
			if (errors.hasNext()) {
				errors.show();
			} else {
				oa_aListeAttributs.initTree(oa_refreshSelectionListeAttributs);
			}
		}
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_refreshSelectionListeAttributs() {
	try {
		
		var nbLignes = oa_aListeAttributs.nbLignes();
		var trouve = false;
		var i = 0;
		while (!trouve && i<nbLignes) {
			if (oa_aListeAttributs.getCellText(i, 'oa-colNumListe') == oa_currentListe) { trouve = true; }
			else { i++; }
		}
		oa_aListeAttributs.select(i);
		oa_ouvrirListeAttributs();
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_ouvrirListeAttributs() {
	try {
		if (oa_aListeAttributs.isSelected()) {
			var i = oa_aListeAttributs.getCurrentIndex();
			
			oa_currentListe = oa_aListeAttributs.getCellText(i, 'oa-colNumListe');
			document.getElementById('oa-nom').value = oa_aListeAttributs.getCellText(i, 'oa-colNomListe');
			oa_currentCirconstanciation = (oa_aListeAttributs.getCellText(i, 'oa-colCirconstancie')=="1");
			document.getElementById('oa-chkCirconstancie').checked = oa_currentCirconstanciation;
			
			document.getElementById('oa-nom').disabled = false;
			document.getElementById('oa-chkCirconstancie').disabled = false;
			document.getElementById('oa-bEnregistrerListe').disabled = false;
			
			document.getElementById('oa-listeAttributsArticles').disabled = true;
			oa_aAttributsArticles.setParam("Liste_Id", oa_currentListe);
			oa_aAttributsArticles.initTree(oa_initAttributsArticles);
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_initAttributsArticles() {
	try {

		oa_nouvelAttribut();
		
		document.getElementById('oa-listeAttributsArticles').disabled = false;
		document.getElementById('oa-libelle').disabled = false;
		document.getElementById('oa-chkActif').disabled = false;
		document.getElementById('oa-bAnnulerAttribut').disabled = false;
		document.getElementById('oa-bValiderAttribut').disabled = false;
		
		document.getElementById('oa-circonstanciation').collapsed = true;
		oa_aCirconstanciation.deleteTree();
		document.getElementById('oa-listeCirconstanciation').disabled = true;
		
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_nouvelAttribut() {
	try {
		oa_currentAttribut = "";
		if (oa_aAttributsArticles.isSelected()) { oa_aAttributsArticles.select(-1); }
		document.getElementById('oa-libelle').value = "";
		document.getElementById('oa-chkActif').checked = true;
		document.getElementById('oa-bFlecheHaut').disabled = true;
		document.getElementById('oa-bFlecheBas').disabled = true;
		document.getElementById('oa-bSupprimerAttribut').disabled = true;
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_ouvrirAttribut() {
	try {
		if (oa_aAttributsArticles.isSelected()) {
			var i = oa_aAttributsArticles.getCurrentIndex();
			var nbLignes = oa_aAttributsArticles.nbLignes();
			oa_currentAttribut = oa_aAttributsArticles.getCellText(i, 'oa-colAttributId');
			document.getElementById('oa-libelle').value = oa_aAttributsArticles.getCellText(i, 'oa-colLibelle');
			document.getElementById('oa-chkActif').checked = (oa_aAttributsArticles.getCellText(i, 'oa-colActif')=="1");
			document.getElementById('oa-bSupprimerAttribut').disabled = false;
			document.getElementById('oa-bFlecheHaut').disabled = (i==0);
			document.getElementById('oa-bFlecheBas').disabled = (i==nbLignes-1);
			
			if (oa_currentCirconstanciation) {
				oa_aCirconstanciation.setParam("Attribut_Id", oa_currentAttribut);
				oa_aCirconstanciation.initTree(oa_initCirconstanciation)
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_deplacerAttributBas() {
	try {
		oa_deplacerAttribut("Bas");
	} catch (e) {
		recup_erreur(e);
	}
}

function oa_deplacerAttributHaut() {
	try {
		oa_deplacerAttribut("Haut");
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_deplacerAttribut(type) {
	try {
			var qDeplacerLigne = new QueryHttp("Config/parametrageArticles/deplacerAttribut.tmpl");
			qDeplacerLigne.setParam("Attribut_Id", oa_currentAttribut);
			qDeplacerLigne.setParam("Deplacement", type);
			qDeplacerLigne.execute();
			
			oa_aAttributsArticles.initTree(oa_initAttributsArticles);
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_enregistrerAttribut() {
	try {
		var libelle = document.getElementById('oa-libelle').value;
		var actif = document.getElementById('oa-chkActif').checked;
		if (isEmpty(libelle)) { showWarning("Veuillez saisir le libellé de l'attribut !"); }
		else {
		
			var qEnregistrer;
			if (isEmpty(oa_currentAttribut)) {
				qEnregistrer = new QueryHttp("Config/parametrageArticles/creerAttributArticle.tmpl");
				qEnregistrer.setParam("Liste_Id", oa_currentListe);
			} else {
				qEnregistrer = new QueryHttp("Config/parametrageArticles/modifierAttributArticle.tmpl");
				qEnregistrer.setParam("Attribut_Id", oa_currentAttribut);
			}
			qEnregistrer.setParam("Libelle", libelle);
			qEnregistrer.setParam("Actif", actif);
			var result = qEnregistrer.execute();
			var errors = new Errors(result);
			if (errors.hasNext()) {
				errors.show();
			} else {
				oa_aAttributsArticles.initTree(oa_initAttributsArticles);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_supprimerAttribut() {
	try {
		if (window.confirm("Voulez-vous supprimer l'attribut sélectionné ?")) {
			var qSupprimer = new QueryHttp("Config/parametrageArticles/supprimerAttributArticle.tmpl");
			qSupprimer.setParam("Attribut_Id", oa_currentAttribut);
			var result = qSupprimer.execute();
			var errors = new Errors(result);
			if (errors.hasNext()) {
				errors.show();
			} else {
				oa_aAttributsArticles.initTree(oa_initAttributsArticles);
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_initCirconstanciation() {
	try {
		document.getElementById('oa-listeCirconstanciation').disabled = false;
		document.getElementById('oa-circonstanciation').collapsed = false;
	} catch (e) {
		recup_erreur(e);
	}
}


function oa_pressOnListeCirconstanciation(event) {
	try {
		var tree = document.getElementById("oa-listeCirconstanciation");
	  var tbo = tree.treeBoxObject;

	  var row = { }, col = { }, child = { };
	  tbo.getCellAt(event.clientX, event.clientY, row, col, child);
	  var numLigne = row.value;
	  var numColImg = col.value.index;
	  var continuer = (col.value.id=="oa-colPictoChecked");
	  
	  if (continuer) {
	  	var numColEtat = tbo.columns.getNamedColumn('oa-colChecked').index;
	  	var numColFamilleId = tbo.columns.getNamedColumn('oa-colFamilleId').index;
	  	var etatCoche = oa_aCirconstanciation.getCellText(numLigne, 'oa-colChecked');
	  	// etatCoche = 0: pas coché; 1: coché; 2: grisé donc ne rien faire;
	  	if (etatCoche!="2") {
	  		var curNiveau = parseInt(oa_aCirconstanciation.getCellText(numLigne, 'oa-colNiveau'));
		  	var cocherParent = cocher;
		  	if (curNiveau>1) {
		  		// on va chercher l'état de la coche du parent, car si on décoche une case, celle-ci devra prendre l'état de son parent (décochée, ou cochée en gris)
		  		var i=numLigne-1;
		  		while (i>0 && parseInt(oa_aCirconstanciation.getCellText(i, 'oa-colNiveau'))==curNiveau) { i--; }
		  		cocherParent = (tree.view.getItemAtIndex(i).childNodes[0].childNodes[numColEtat].getAttribute("label")!="0");
		  	}
	  		
	  		var familleId = oa_aCirconstanciation.getCellText(numLigne, 'oa-colFamilleId');
	  		var cocher;
		  	var cellImg = tree.view.getItemAtIndex(numLigne).childNodes[0].childNodes[numColImg];
		  	var cellEtat = tree.view.getItemAtIndex(numLigne).childNodes[0].childNodes[numColEtat];
		  	if (etatCoche=="0") {
		  		cocher=true;
		  		cellImg.setAttribute("src","chrome://opensi/content/design/checkbox.png");
		  		cellEtat.setAttribute("label", "1");
		  	} else {
		  		cocher=false;
		  		cellImg.setAttribute("src",cocherParent?"chrome://opensi/content/design/checkbox_disabled.png":"chrome://opensi/content/design/checkbox_empty.png");
		  		cellEtat.setAttribute("label", cocherParent?"2":"0");
		  	}

		  	document.getElementById('oa-listeCirconstanciation').disabled = true;
		  	var qEnregistrer = new QueryHttp("Config/parametrageArticles/modifierCirconstanciation.tmpl");
		  	qEnregistrer.setParam("Attribut_Id", oa_currentAttribut);
		  	qEnregistrer.setParam("Famille_Id", familleId);
		  	qEnregistrer.setParam("Cocher", cocher);
		  	qEnregistrer.execute();
		  	
		  	var nbLignes = oa_aCirconstanciation.nbLignes();
		  	var i=numLigne+1;
		  	
		  	// on propage en interface l'état de la coche dans toutes les sous-familles qui ne possèdent pas une liaison en base :
		  	// soit on les décoche, soit on les coche en gris
		  	var peutContinuer = true;
		  	while (i<nbLignes && peutContinuer) {
		  		if (parseInt(oa_aCirconstanciation.getCellText(i, 'oa-colNiveau'))<=curNiveau) { peutContinuer=false; }
		  		else {
		  			if (oa_aCirconstanciation.getCellText(i, 'oa-colChecked')!="1") {
		  				tree.view.getItemAtIndex(i).childNodes[0].childNodes[numColImg].setAttribute("src",cocher || cocherParent?"chrome://opensi/content/design/checkbox_disabled.png":"chrome://opensi/content/design/checkbox_empty.png");
		  				tree.view.getItemAtIndex(i).childNodes[0].childNodes[numColEtat].setAttribute("label",cocher || cocherParent?"2":"0");
		  			}
		  			i++;
		  		}
		  	}
		  	
		  	document.getElementById('oa-listeCirconstanciation').disabled = false;
	  	}
	  }

	} catch (e) {
		recup_erreur(e);
	}
}


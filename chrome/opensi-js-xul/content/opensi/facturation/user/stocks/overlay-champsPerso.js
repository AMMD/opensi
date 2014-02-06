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

XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

var tab_champs = new Array();
var tab_listes = new Array();
var article_id;


function initChampsPerso(famille1, famille2, famille3, art_id) {
	try {

		article_id = art_id;
		viderChampsPerso();
		var box_champs = document.getElementById('Champs');
  	var box_listes = document.getElementById('Listes');

		var qChamps = new QueryHttp("Facturation/Stocks/getListeChampsPerso.tmpl");
		qChamps.setParam("Famille_1", famille1);
		qChamps.setParam("Famille_2", famille2);
		qChamps.setParam("Famille_3", famille3);
		qChamps.setParam("Article_Id", article_id);
		var result = qChamps.execute();
		var les_champs = result.responseXML.documentElement.getElementsByTagName("champ");
		var nbChamps = les_champs.length;
		document.getElementById('TabChampsPerso').collapsed=(nbChamps==0);
		
		if (nbChamps>0) {
			var gridNode = document.createElementNS(XUL_NS, "xul:grid");
		  var headingNode = document.createElementNS(XUL_NS, "xul:columns");
		  headingNode.appendChild(document.createElementNS(XUL_NS, "xul:column"));
		  headingNode.appendChild(document.createElementNS(XUL_NS, "xul:column"));
		  gridNode.appendChild(headingNode);
		  var dataNode = document.createElementNS(XUL_NS, "xul:rows");
		  
			for (var i=0;i<nbChamps;i++) {
				if (les_champs.item(i).getAttribute("type") == "LP") {
					var liste = creerListe(les_champs.item(i));
					box_listes.appendChild(liste);
				} else {
					var dataEntryNode = creerChamp(les_champs.item(i));
					dataNode.appendChild(dataEntryNode);
				}
			}

			gridNode.appendChild(dataNode);
		  box_champs.appendChild(gridNode);
		}
	} catch (e) {
		recup_erreur(e);
  }
}


function viderChampsPerso() {
	try {
		var box_champs = document.getElementById('Champs');
		while(box_champs.hasChildNodes())
  		box_champs.removeChild(box_champs.firstChild);

  	var box_listes = document.getElementById('Listes');
		while(box_listes.hasChildNodes())
  		box_listes.removeChild(box_listes.firstChild);
	} catch (e) {
		recup_erreur(e);
	}
}


function creerChamp(result) {
	try {

		var champ_id = result.getAttribute("champ_id");
		var lab = result.getAttribute("libelle");
    var type = result.getAttribute("type");
    var valeur = result.getAttribute("valeur");

		var dataEntryNode = document.createElementNS(XUL_NS, "xul:row");
    var libelle = document.createElementNS(XUL_NS, "xul:label");
    libelle.setAttribute("value", lab);
  	libelle.setAttribute("class", "label");

  	var hbox = document.createElementNS(XUL_NS, "xul:hbox");
    var champ;
		switch (type) {
			case "CC": // case à cocher
				libelle.setAttribute("value", "");
				champ = document.createElementNS(XUL_NS, "xul:checkbox");
				champ.setAttribute("label", lab);
				break;
			case "ZT": // zone de texte
				champ = document.createElementNS(XUL_NS, "xul:textbox");
				champ.setAttribute("multiline", "true");
				champ.setAttribute("maxlength", "50");
				champ.setAttribute("cols", "35");
				champ.setAttribute("rows", "3");
				champ.setAttribute("onkeypress", "checkMaxLength(event, this.id);");
				break;
			case "CT": // champ texte
				champ = document.createElementNS(XUL_NS, "xul:textbox");
				champ.setAttribute("maxlength", "50");
				champ.setAttribute("size", "25");
				break;
			case "ND": // champ numérique décimal
				champ = document.createElementNS(XUL_NS, "xul:textbox");
				champ.setAttribute("class", "nombre");
				champ.setAttribute("value", "0.00");
				champ.setAttribute("maxlength", "50");
				champ.setAttribute("size", "25");
				break;
			case "NE": // champ numérique entier
				champ = document.createElementNS(XUL_NS, "xul:textbox");
				champ.setAttribute("class", "nombre");
				champ.setAttribute("value", "0");
				champ.setAttribute("maxlength", "50");
				champ.setAttribute("size", "25");
				break;
			case "LD": // liste déroulante
				champ = document.createElementNS(XUL_NS, "xul:menulist");
				var itemChoix = document.createElementNS(XUL_NS, "xul:menuitem");
				itemChoix.setAttribute("label", "[Choisir]");
				itemChoix.setAttribute("value", "-1");
				var popup = document.createElementNS(XUL_NS, "xul:menupopup");
				popup.appendChild(itemChoix);
				var les_options = result.getElementsByTagName("option");
				for (var i=0;i<les_options.length;i++) {
					var option = creerOption(les_options.item(i), "LD");
					popup.appendChild(option);
				}
				champ.appendChild(popup);
				champ.setAttribute("value", "-1");
				break;
			case "BR": // bouton radio
				champ = document.createElementNS(XUL_NS, "xul:radiogroup");
				var les_options = result.getElementsByTagName("option");
				for (var i=0;i<les_options.length;i++) {
					var option = creerOption(les_options.item(i), "BR");
					champ.appendChild(option);
				}
				break;
		}

		champ.setAttribute("id", type+champ_id);
		tab_champs.push(new Array(champ_id, type, lab));

		// on charge la valeur du champ
		if (!isEmpty(valeur)) {
			if (type == "CC") {
				champ.setAttribute("checked", valeur==1);
			} else {
				champ.setAttribute("value", valeur);
			}
		}

		hbox.appendChild(champ);

		dataEntryNode.appendChild(libelle);
		dataEntryNode.appendChild(hbox);

		return dataEntryNode;

  } catch (e) {
		recup_erreur(e);
  }
}


function creerOption(result, type_elem) {
	try {

		var option;
		switch (type_elem) {
			case "LD":
				option = document.createElementNS(XUL_NS, "xul:menuitem");
				option.setAttribute("label", result.getAttribute("libelle"));
				option.setAttribute("value", result.getAttribute("valeur"));
				break;
			case "BR":
				option = document.createElementNS(XUL_NS, "xul:radio");
				option.setAttribute("label", result.getAttribute("libelle"));
				option.setAttribute("value", result.getAttribute("valeur"));
				option.setAttribute("selected", result.getAttribute("selected"));
				break;
		}
		return option;

	} catch (e) {
		recup_erreur(e);
  }
}


function checkMaxLength(ev, id) {
	try {
		if (ev.keyCode != 8) { // on ignore les backspace
			var element = document.getElementById(id);
			if (element.value.length >= element.getAttribute("maxlength")) {
				var nouveau_texte = element.value.substring(0, element.getAttribute("maxlength")-1);
				element.value = nouveau_texte;
			}
		}
	} catch (e) {
		recup_erreur(e);
  }
}


function checkChampsPerso() {
	try {
		var check = true;
		var i=0;
		while (i<tab_champs.length && check) {
			var id=tab_champs[i][1]+tab_champs[i][0];
			var type=tab_champs[i][1];
			var libelle=tab_champs[i][2];
			var valeur=document.getElementById(id).value;

			// on teste si la valeur du champ correspond à son type
			if ((type=="ND") && !isEmpty(valeur) && !checkDecimal(valeur,2)) {
				showWarning("Veuillez saisir un nombre à deux décimales pour : " + libelle + " (Onglet Champs personnalisés)");
				check = false;
			}	else if ((type=="NE") && !isEmpty(valeur) && !isPositiveOrNullInteger(valeur)) {
				showWarning("Veuillez saisir un nombre entier pour : " + libelle + " (Onglet Champs personnalisés)");
				check = false;
			}	else if ((type=="LD") && (valeur == -1)) {
				showWarning("Veuillez sélectionner une option pour : " + libelle + " (Onglet Champs personnalisés)");
				check = false;
			} else if ((type=="BR") && isEmpty(valeur)) {
				showWarning("Veuillez sélectionner une option pour : " + libelle + " (Onglet Champs personnalisés)");
				check = false;
			}
			i++;
		}
		return check;
	} catch (e) {
		recup_erreur(e);
  }
}


function saveChampsPerso() {
	try {
		var qSaveChamp = new QueryHttp("Facturation/Stocks/saveValChampPerso.tmpl");
		qSaveChamp.setParam("Article_Id", article_id);

		for (var i=0; i<tab_champs.length; i++) {
			var id=tab_champs[i][1]+tab_champs[i][0];
			var valeur;
			qSaveChamp.setParam("Champ_Perso_Id", tab_champs[i][0]);
			if (tab_champs[i][1] == "CC") {
				valeur=document.getElementById(id).checked?1:0;
			} else {
				valeur=document.getElementById(id).value;
			}
			qSaveChamp.setParam("Valeur", valeur);
			qSaveChamp.execute();
		}

	} catch (e) {
		recup_erreur(e);
  }
}


function creerListe(result) {
	try {
		var tab_cols = new Array(); // identifiants des colonnes pour les listes personnalisées
		var champ_id = result.getAttribute("champ_id");
		var lab = result.getAttribute("libelle");
    var type = result.getAttribute("type");

		var groupbox = document.createElementNS(XUL_NS, "xul:groupbox");
		groupbox.setAttribute("flex", "1");
		var caption = document.createElementNS(XUL_NS, "xul:caption");
		caption.setAttribute("label", lab);
		var tree = document.createElementNS(XUL_NS, "xul:tree");
		tree.setAttribute("onselect", "pressOnListe("+ champ_id +");");
		tree.setAttribute("onclick", "pressOnListe("+ champ_id +");");
		var treecols = document.createElementNS(XUL_NS, "xul:treecols");
		var entete = result.getElementsByTagName("entete").item(0).getElementsByTagName("colonne");
		for (var i=0;i<entete.length;i++) {
			var colonne = document.createElementNS(XUL_NS, "xul:treecol");
			colonne.setAttribute("id", "Col" + entete.item(i).getAttribute("colonne_id"));
			colonne.setAttribute("label", entete.item(i).getAttribute("libelle"));
			colonne.setAttribute("flex", "1");
			treecols.appendChild(colonne);
			tab_cols.push(entete.item(i).getAttribute("colonne_id"));
		}
		var colonne = document.createElementNS(XUL_NS, "xul:treecol");
		colonne.setAttribute("id", "ColLigne_Id");
		colonne.setAttribute("label", "Ligne_Id");
		colonne.setAttribute("collapsed", "true");
		treecols.appendChild(colonne);
		tree.appendChild(treecols);
		var treechildren = document.createElementNS(XUL_NS, "xul:treechildren");
		var les_lignes = result.getElementsByTagName("ligne");
		for (var i=0;i<les_lignes.length;i++) {
			var ligne = creerLigne(les_lignes.item(i), tab_cols);
			treechildren.appendChild(ligne);
		}
		tree.appendChild(treechildren);
		tree.setAttribute("id", type+champ_id);
		tree.setAttribute("flex", "1");
		tree.setAttribute("hidecolumnpicker", "true");

		var ligne_edition = creerLigneEdition(tab_cols, champ_id); // création des champs de saisie
		tab_listes.push(new Array(champ_id, tab_cols));

		groupbox.appendChild(caption);
		groupbox.appendChild(tree);
		groupbox.appendChild(ligne_edition);

		return groupbox;

	} catch (e) {
		recup_erreur(e);
  }
}


function creerLigne(result, tab_cols) {
	try {
		var treeitem = document.createElementNS(XUL_NS, "xul:treeitem");
		var treerow = document.createElementNS(XUL_NS, "xul:treerow");

		var les_cellules = result.getElementsByTagName("cellule");
		var j=0;
		for (var i=0;i<tab_cols.length;i++) {
			var treecell = document.createElementNS(XUL_NS, "xul:treecell");
			if ((j<les_cellules.length) && (les_cellules.item(j).getAttribute("colonne_id") == tab_cols[i])) {
				treecell.setAttribute("label", les_cellules.item(j).getAttribute("valeur"));
				j++;
			}
			treerow.appendChild(treecell);
		}
		var treecell = document.createElementNS(XUL_NS, "xul:treecell");
		treecell.setAttribute("label", result.getAttribute("ligne_id"));
		treerow.appendChild(treecell);

		treeitem.appendChild(treerow);
		return treeitem;
	} catch (e) {
		recup_erreur(e);
  }
}


function creerLigneEdition(tab_cols, champ_id) {
	try {

		var vbox = document.createElementNS(XUL_NS, "xul:vbox");

		var ligne_champs = document.createElementNS(XUL_NS, "xul:hbox");
		for (var i=0;i<tab_cols.length;i++) {
			var textbox = document.createElementNS(XUL_NS, "xul:textbox");
			textbox.setAttribute("id", "Edit" + tab_cols[i]);
			textbox.setAttribute("maxlength", "50");
			textbox.setAttribute("flex", "1");
			ligne_champs.appendChild(textbox);
		}

		var ligne_boutons = document.createElementNS(XUL_NS, "xul:hbox");
		ligne_boutons.setAttribute("pack", "center");
		var bNouveau = document.createElementNS(XUL_NS, "xul:button");
		bNouveau.setAttribute("label", "Nouveau");
		bNouveau.setAttribute("id", "bNouv"+ champ_id);
		bNouveau.setAttribute("collapsed", "true");
		bNouveau.setAttribute("oncommand", "viderZoneEditionListe("+ champ_id +");");
		var bEnregistrer = document.createElementNS(XUL_NS, "xul:button");
		bEnregistrer.setAttribute("label", "Enregistrer");
		bEnregistrer.setAttribute("id", "bEnr"+ champ_id);
		bEnregistrer.setAttribute("oncommand", "sauverLigneListe("+ champ_id +");");
		var bSupprimer = document.createElementNS(XUL_NS, "xul:button");
		bSupprimer.setAttribute("label", "Supprimer");
		bSupprimer.setAttribute("id", "bSuppr"+ champ_id);
		bSupprimer.setAttribute("disabled", "true");
		bSupprimer.setAttribute("oncommand", "supprimerLigneListe("+ champ_id +");");
		ligne_boutons.appendChild(bNouveau);
		ligne_boutons.appendChild(bEnregistrer);
		ligne_boutons.appendChild(bSupprimer);

		vbox.appendChild(ligne_champs);
		vbox.appendChild(ligne_boutons);

		return vbox;

	} catch (e) {
		recup_erreur(e);
  }
}


function getIndiceTabListes(champ_id) {
	try {
		var i=0;
		while ((i<tab_listes.length) && (champ_id != tab_listes[i][0])){
			i++;
		}
		return i;
	} catch (e) {
		recup_erreur(e);
  }
}


function pressOnListe(champ_id) {
	try {
		var tree = document.getElementById("LP"+champ_id);
		if (tree.view!=null && tree.currentIndex!=-1) {
			var i = getIndiceTabListes(champ_id);
			for (var j=0; j<tab_listes[i][1].length; j++) {
				var id = "Edit"+tab_listes[i][1][j];
				document.getElementById(id).value = getCellText(tree, tree.currentIndex, "Col"+tab_listes[i][1][j]);
			}
			document.getElementById("bNouv"+ champ_id).collapsed=false;
			document.getElementById("bEnr"+ champ_id).label="Modifier";
			document.getElementById("bSuppr"+ champ_id).disabled=false;
		}
	} catch (e) {
		recup_erreur(e);
  }
}


function viderZoneEditionListe(champ_id) {
	try {
		var i = getIndiceTabListes(champ_id);
		for (var j=0; j<tab_listes[i][1].length; j++) {
			var id = "Edit"+tab_listes[i][1][j];
			document.getElementById(id).value="";
		}
		var tree = document.getElementById("LP"+champ_id);
		if (tree.view!=null && tree.currentIndex!=-1) {
			tree.view.selection.select(-1);
		}
		document.getElementById("bNouv"+ champ_id).collapsed=true;
		document.getElementById("bEnr"+ champ_id).label="Enregistrer";
		document.getElementById("bSuppr"+ champ_id).disabled=true;
	} catch (e) {
		recup_erreur(e);
  }
}


function checkZoneEditionListe(i) {
	try {
		var check=false;
		var j=0;
		while (!check && (j<tab_listes[i][1].length)) {
			var id = "Edit"+tab_listes[i][1][j];
			check = !isEmpty(document.getElementById(id).value);
			j++;
		}
		return check;
	} catch (e) {
		recup_erreur(e);
  }
}


function sauverLigneListe(champ_id) {
	try {
		var i = getIndiceTabListes(champ_id);
		if (checkZoneEditionListe(i)) {
			var tree = document.getElementById("LP"+champ_id);
			if (tree.view!=null && tree.currentIndex!=-1) {
				// Modification d'une ligne
				for (var j=0; j<tab_listes[i][1].length; j++) {
					var id = "Edit"+tab_listes[i][1][j];
					var qRequete;
					if (isEmpty(document.getElementById(id).value)) {
						qRequete = new QueryHttp("Facturation/Stocks/supprimerCelluleListePerso.tmpl");
					} else {
						qRequete = new QueryHttp("Facturation/Stocks/sauverCelluleListePerso.tmpl");
						qRequete.setParam("Valeur", document.getElementById(id).value);
					}
					qRequete.setParam("Ligne_Id", getCellText(tree, tree.currentIndex, "ColLigne_Id"));
					qRequete.setParam("Colonne_Id", tab_listes[i][1][j]);
					qRequete.execute();
					// mise à jour de la liste dans l'interface
					tree.view.setCellText(tree.currentIndex, tree.columns.getColumnAt(j), document.getElementById(id).value);
				}
			} else {
				// Création d'une nouvelle ligne
				var qNouvLigne = new QueryHttp("Facturation/Stocks/ajouterLigneListePerso.tmpl");
				qNouvLigne.setParam("Champ_Perso_Id", champ_id);
				qNouvLigne.setParam("Article_Id", article_id);
				var result = qNouvLigne.execute();
				var ligne_id = result.responseXML.documentElement.getAttribute("ligne_id");

				// ajout d'une ligne dans l'interface
				var treeitem = document.createElementNS(XUL_NS, "xul:treeitem");
				var treerow = document.createElementNS(XUL_NS, "xul:treerow");
				for (var j=0;j<tab_listes[i][1].length;j++) {
					var id = "Edit"+tab_listes[i][1][j];
					var treecell = document.createElementNS(XUL_NS, "xul:treecell");
					if (!isEmpty(document.getElementById(id).value)) {
						qRequete = new QueryHttp("Facturation/Stocks/sauverCelluleListePerso.tmpl");
						qRequete.setParam("Valeur", document.getElementById(id).value);
						qRequete.setParam("Ligne_Id", ligne_id);
						qRequete.setParam("Colonne_Id", tab_listes[i][1][j]);
						qRequete.execute();
						treecell.setAttribute("label", document.getElementById(id).value);
					}
					treerow.appendChild(treecell);
				}
				var treecell = document.createElementNS(XUL_NS, "xul:treecell");
				treecell.setAttribute("label", ligne_id);
				treerow.appendChild(treecell);
				treeitem.appendChild(treerow);
				tree.lastChild.appendChild(treeitem);
			}

			// effacement des champs
			viderZoneEditionListe(champ_id);
		} else {
			showWarning("Vous devez remplir au moins un champ !");
		}
	} catch (e) {
		recup_erreur(e);
  }
}


function supprimerLigneListe(champ_id) {
	try {
		var tree = document.getElementById("LP"+champ_id);
		if (tree.view!=null && tree.currentIndex!=-1) {
			if (window.confirm("Voulez-vous vraiment supprimer la ligne sélectionnée ?")) {
				var ligne_id = getCellText(tree, tree.currentIndex, "ColLigne_Id");
				qRequete = new QueryHttp("Facturation/Stocks/supprimerLigneListePerso.tmpl");
				qRequete.setParam("Ligne_Id", ligne_id);
				qRequete.execute();

				// mettre à jour l'arbre
				var currentIndex = tree.currentIndex;
				var currentElement = tree.treeBoxObject.view.getItemAtIndex(currentIndex);
        currentElement.parentNode.removeChild(currentElement);

				viderZoneEditionListe(champ_id);
			}
		}
	} catch (e) {
		recup_erreur(e);
  }
}


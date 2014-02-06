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

var ocp_aChamps = new Arbre("Config/GetRDF/listeChamps.tmpl", "ocp-liste_champs");
var ocp_aOptions = new Arbre("Config/GetRDF/listeOptions.tmpl", "ocp-liste_options");
var ocp_aColonnes = new Arbre("Config/GetRDF/listeColonnes.tmpl", "ocp-liste_colonnes");
var ocp_aFamille1 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'ocp-Famille_1');
var ocp_aFamille2 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'ocp-Famille_2');
var ocp_aFamille3 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'ocp-Famille_3');

var ocp_champ_id = -1; // liste des champs ; -1 = Création ; supérieur à -1 = Modification
var ocp_liste_id = -1; // liste des options
var ocp_colonne_id = -1; // liste des colonnes

var ocp_selFamille1 = "0";
var ocp_selFamille2 = "0";
var ocp_selFamille3 = "0";


function ocp_initChamps() {
	try {

		ocp_champ_id = -1;
		ocp_selFamille1 = "0";
		ocp_selFamille2 = "0";
		ocp_selFamille3 = "0";
		ocp_aChamps.initTree();
		ocp_aFamille1.initTree(ocp_initFamille1);
		document.getElementById('ocp-Type_Champ').selectedIndex = 0;
		document.getElementById('ocp-Libelle_Champ').value = "";
		document.getElementById('ocp-Libelle_Option').value = "";
		document.getElementById('ocp-Valeur_Option').value = "";
		document.getElementById('ocp-bSupprimer').disabled=true;
		document.getElementById('ocp-Type_Champ').collapsed=false;
		document.getElementById('ocp-label_type').value = "";
		document.getElementById('ocp-label_type').collapsed = true;
		document.getElementById('ocp-bNouveau').collapsed=true;
		ocp_initOptions();
		ocp_desactiverOptions();
		ocp_initColonnes();
		ocp_desactiverColonnes();

	} catch (e) {
    recup_erreur(e);
  }
}



function ocp_initFamille1() {
  try {

		document.getElementById('ocp-Famille_1').value = ocp_selFamille1;
		ocp_chargerFamilles2();

	} catch (e) {
		recup_erreur(e);
	}
}


function ocp_chargerFamilles2() {
	try {
  	
		ocp_aFamille2.setParam('Parent_Id', document.getElementById('ocp-Famille_1').value);
		ocp_aFamille2.initTree(ocp_initFamille2);

	} catch (e) {
		recup_erreur(e);
	}
}


function ocp_initFamille2() {
  try {

		document.getElementById('ocp-Famille_2').value = ocp_selFamille2;
		ocp_chargerFamilles3();

	} catch (e) {
		recup_erreur(e);
	}
}


function ocp_chargerFamilles3() {
	try {
  	
		ocp_aFamille3.setParam('Parent_Id', document.getElementById('ocp-Famille_2').value);
		ocp_aFamille3.initTree(ocp_initFamille3);

	} catch (e) {
		recup_erreur(e);
	}
}


function ocp_initFamille3() {
  try {

		document.getElementById('ocp-Famille_3').value = ocp_selFamille3;

	} catch (e) {
		recup_erreur(e);
	}
}





function ocp_initOptions() {
	try {
		ocp_liste_id = -1;
		ocp_aOptions.deleteTree();
		document.getElementById('ocp-Libelle_Option').value = "";
		document.getElementById('ocp-Valeur_Option').value = "";
		document.getElementById('ocp-bNouvelleOption').collapsed=true;
		document.getElementById('ocp-bAjouterOption').label="Ajouter";
		document.getElementById("ocp-bSupprimerOption").disabled = true;
	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_desactiverOptions() {
	try {
		document.getElementById('ocp-Options').collapsed=true;
		document.getElementById('ocp-liste_options').disabled = true;
		document.getElementById('ocp-Libelle_Option').disabled = true;
		document.getElementById('ocp-Valeur_Option').disabled = true;
		document.getElementById('ocp-bAjouterOption').disabled=true;
	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_activerOptions() {
	try {
		document.getElementById('ocp-Options').collapsed=false;
		document.getElementById('ocp-liste_options').disabled = false;
		document.getElementById('ocp-Libelle_Option').disabled = false;
		document.getElementById('ocp-Valeur_Option').disabled = false;
		document.getElementById('ocp-bAjouterOption').disabled=false;
	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_initColonnes() {
	try {
		ocp_colonne_id = -1;
		ocp_aColonnes.deleteTree();
		document.getElementById('ocp-Libelle_Colonne').value = "";
		document.getElementById('ocp-bNouvelleColonne').collapsed=true;
		document.getElementById('ocp-bAjouterColonne').label="Ajouter";
		document.getElementById("ocp-bSupprimerColonne").disabled = true;
	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_desactiverColonnes() {
	try {
		document.getElementById('ocp-Colonnes').collapsed=true;
		document.getElementById('ocp-liste_colonnes').disabled = true;
		document.getElementById('ocp-Libelle_Colonne').disabled = true;
		document.getElementById('ocp-bAjouterColonne').disabled=true;
	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_activerColonnes() {
	try {
		document.getElementById('ocp-Colonnes').collapsed=false;
		document.getElementById('ocp-liste_colonnes').disabled = false;
		document.getElementById('ocp-Libelle_Colonne').disabled = false;
		document.getElementById('ocp-bAjouterColonne').disabled=false;
	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_enregistrerChamp() {
	try {
		var libelle_champ = document.getElementById('ocp-Libelle_Champ').value;
		var type_champ = document.getElementById('ocp-Type_Champ').value;
		var famille1 = document.getElementById('ocp-Famille_1').value;
		var famille2 = document.getElementById('ocp-Famille_2').value;
		var famille3 = document.getElementById('ocp-Famille_3').value;

		if (isEmpty(libelle_champ)) {
			showWarning("Veuillez spécifier un libellé pour le champ !");
		} else {
			var qEnregistrer;
			if (ocp_champ_id == -1) {
				qEnregistrer = new QueryHttp("Config/gestion_commerciale/champs/creerChamp.tmpl");
				qEnregistrer.setParam("Type_Champ", type_champ);
			} else {
				qEnregistrer = new QueryHttp("Config/gestion_commerciale/champs/modifierChamp.tmpl");
				qEnregistrer.setParam("Champ_Id", ocp_champ_id);
			}
			
			qEnregistrer.setParam("Libelle_Champ", libelle_champ);
			qEnregistrer.setParam("Famille_1", famille1);
			qEnregistrer.setParam("Famille_2", famille2);
			qEnregistrer.setParam("Famille_3", famille3);
			qEnregistrer.execute(ocp_initChamps);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_supprimerChamp() {
  try {

  	if (confirm("Etes-vous sûr de vouloir supprimer les données de ce champ ?")) {
  		var qSupprimer = new QueryHttp("Config/gestion_commerciale/champs/supprimerChamp.tmpl");
  		qSupprimer.setParam("Champ_Id", ocp_champ_id);
			qSupprimer.execute(ocp_initChamps);
  	}
  } catch (e) {
    recup_erreur(e);
  }
}


function ocp_selectionnerChamp() {
  try {
  	var tree = document.getElementById('ocp-liste_champs');

		if (tree.view!=null && tree.currentIndex!=-1) {
			ocp_champ_id = getCellText(tree,tree.currentIndex,'ocp-ColChampId');
			ocp_initOptions();
			ocp_initColonnes();

			var type_champ = getCellText(tree,tree.currentIndex,'ocp-ColType');
			document.getElementById('ocp-Type_Champ').value = type_champ;
			document.getElementById('ocp-Type_Champ').collapsed=true;
			document.getElementById('ocp-Libelle_Champ').value = getCellText(tree,tree.currentIndex,'ocp-ColLibelle');
			document.getElementById('ocp-label_type').value = getCellText(tree,tree.currentIndex,'ocp-ColLblType');
			document.getElementById('ocp-label_type').collapsed = false;
			
			ocp_selFamille1 = getCellText(tree,tree.currentIndex,'ocp-ColFamille1');
			ocp_selFamille2 = getCellText(tree,tree.currentIndex,'ocp-ColFamille2');
			ocp_selFamille3 = getCellText(tree,tree.currentIndex,'ocp-ColFamille3');
			ocp_initFamille1();
			
			if ((type_champ == "LD") || (type_champ == "BR")) {
				ocp_desactiverColonnes();
				ocp_activerOptions();
			} else {
				ocp_desactiverOptions();
				if (type_champ == "LP") {
					ocp_activerColonnes();
				} else {
					ocp_desactiverColonnes();
				}
			}
			
			ocp_aOptions.setParam('Champ_Id', ocp_champ_id);
			ocp_aOptions.initTree();
			ocp_aColonnes.setParam('Champ_Id', ocp_champ_id);
			ocp_aColonnes.initTree();

			document.getElementById('ocp-bSupprimer').disabled=false;
			document.getElementById('ocp-bSupprimerOption').disabled = true;
			document.getElementById('ocp-bSupprimerColonne').disabled = true;
			document.getElementById('ocp-bNouveau').collapsed=false;
		}
  } catch (e) {
    recup_erreur(e);
  }
}


function ocp_nouvelleOption() {
	try {
		ocp_liste_id = -1;
		document.getElementById('ocp-Libelle_Option').value = "";
		document.getElementById('ocp-Valeur_Option').value = "";
		document.getElementById('ocp-bNouvelleOption').collapsed=true;
		document.getElementById('ocp-bAjouterOption').label="Ajouter";
		document.getElementById('ocp-bSupprimerOption').disabled = true;
	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_selectionnerOption() {
	try {
		var tree = document.getElementById('ocp-liste_options');

		if (tree.view!=null && tree.currentIndex!=-1) {
			ocp_liste_id = getCellText(tree,tree.currentIndex,'ocp-ColListeId');
			document.getElementById('ocp-Libelle_Option').value = getCellText(tree,tree.currentIndex,'ocp-ColLibelle');
			document.getElementById('ocp-Valeur_Option').value = getCellText(tree,tree.currentIndex,'ocp-ColValeur');
			document.getElementById('ocp-bNouvelleOption').collapsed=false;
			document.getElementById('ocp-bAjouterOption').label="Modifier";
			document.getElementById("ocp-bSupprimerOption").disabled = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_enregistrerOption() {
	try {
		var libelle_option = document.getElementById('ocp-Libelle_Option').value;
		var valeur_option = document.getElementById('ocp-Valeur_Option').value;

		if (isEmpty(libelle_option)) {
			showWarning("Veuillez saisir le libellé de l'option !");
		} else {
			if (isEmpty(valeur_option)) {
				valeur_option = libelle_option;
			}

			var qExisteOption = new QueryHttp("Config/gestion_commerciale/champs/existeOption.tmpl");
			qExisteOption.setParam("Champ_Id", ocp_champ_id);
			qExisteOption.setParam("Liste_Id", ocp_liste_id);
			qExisteOption.setParam("Libelle", libelle_option);
			qExisteOption.setParam("Valeur", valeur_option);
			var result = qExisteOption.execute();
			if (result.responseXML.documentElement.getAttribute("existe")=="true") {
				showWarning("Les données saisies sont incorrectes : le libellé et/ou la valeur sont déjà utilisés.");
			} else {
				var qEnregistrerOption;
				if (ocp_liste_id == -1) {
					qEnregistrerOption = new QueryHttp("Config/gestion_commerciale/champs/creerOptionListe.tmpl");
					qEnregistrerOption.setParam("Champ_Id", ocp_champ_id);
				} else {
					qEnregistrerOption = new QueryHttp("Config/gestion_commerciale/champs/modifierOptionListe.tmpl");
					qEnregistrerOption.setParam("Liste_Id", ocp_liste_id);
				}
				qEnregistrerOption.setParam("Libelle_Option", libelle_option);
				qEnregistrerOption.setParam("Valeur_Option", valeur_option);
				qEnregistrerOption.execute();
				if (ocp_liste_id == -1) {
					ocp_initOptions();
				}

				// rafraîchir l'arbre
				ocp_aOptions.setParam('Champ_Id', ocp_champ_id);
				ocp_aOptions.initTree(ocp_nouvelleOption);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_supprimerOption() {
	try {

		if (confirm("Etes-vous sûr de vouloir supprimer cette option ?")) {
			var tree = document.getElementById('ocp-liste_options');

			if (ocp_liste_id!=-1) {

				var qSupprimerOption = new QueryHttp("Config/gestion_commerciale/champs/supprimerOptionListe.tmpl")
				qSupprimerOption.setParam("Liste_Id", ocp_liste_id);
				qSupprimerOption.execute();

				// rafraîchir
				ocp_aOptions.setParam('Champ_Id', ocp_champ_id);
				ocp_aOptions.initTree(ocp_nouvelleOption);

			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}



function ocp_nouvelleColonne() {
	try {
		ocp_colonne_id = -1;
		document.getElementById('ocp-Libelle_Colonne').value = "";
		document.getElementById('ocp-bNouvelleColonne').collapsed=true;
		document.getElementById('ocp-bAjouterColonne').label="Ajouter";
		document.getElementById("ocp-bSupprimerColonne").disabled = true;
	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_selectionnerColonne() {
	try {
		var tree = document.getElementById('ocp-liste_colonnes');

		if (tree.view!=null && tree.currentIndex!=-1) {
			ocp_colonne_id = getCellText(tree,tree.currentIndex,'ocp-ColColonneId');
			document.getElementById('ocp-Libelle_Colonne').value = getCellText(tree,tree.currentIndex,'ocp-ColLibelle');
			document.getElementById('ocp-bNouvelleColonne').collapsed=false;
			document.getElementById('ocp-bAjouterColonne').label="Modifier";
			document.getElementById("ocp-bSupprimerColonne").disabled = false;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_enregistrerColonne() {
	try {
		var libelle_colonne = document.getElementById('ocp-Libelle_Colonne').value;

		if (isEmpty(libelle_colonne)) {
			showWarning("Veuillez saisir le libellé de la colonne !");
		} else {

			var qExisteColonne = new QueryHttp("Config/gestion_commerciale/champs/existeColonne.tmpl");
			qExisteColonne.setParam("Champ_Id", ocp_champ_id);
			qExisteColonne.setParam("Colonne_Id", ocp_colonne_id);
			qExisteColonne.setParam("Libelle", libelle_colonne);
			var result = qExisteColonne.execute();
			if (result.responseXML.documentElement.getAttribute("existe")=="true") {
				showWarning("Le libellé saisi est déjà utilisé.");
			} else {
				var qEnregistrerColonne;
				if (ocp_colonne_id == -1) {
					qEnregistrerColonne = new QueryHttp("Config/gestion_commerciale/champs/creerColonne.tmpl");
					qEnregistrerColonne.setParam("Champ_Id", ocp_champ_id);
				} else {
					qEnregistrerColonne = new QueryHttp("Config/gestion_commerciale/champs/modifierColonne.tmpl");
					qEnregistrerColonne.setParam("Colonne_Id", ocp_colonne_id);
				}
				qEnregistrerColonne.setParam("Libelle_Colonne", libelle_colonne);
				qEnregistrerColonne.execute();
				
				if (ocp_colonne_id == -1) {
					ocp_initColonnes();
				}

				// rafraîchir l'arbre
				ocp_aColonnes.setParam('Champ_Id', ocp_champ_id);
				ocp_aColonnes.initTree(ocp_nouvelleColonne);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function ocp_supprimerColonne() {
	try {

		if (confirm("Etes-vous sûr de vouloir supprimer cette colonne ?")) {
			var tree = document.getElementById('ocp-liste_colonnes');

			if (ocp_colonne_id!=-1) {
				var qSupprimerColonne = new QueryHttp("Config/gestion_commerciale/champs/supprimerColonne.tmpl");
				qSupprimerColonne.setParam("Colonne_Id", ocp_colonne_id);
				qSupprimerColonne.execute();

				// rafraîchir
				ocp_aColonnes.setParam('Champ_Id', ocp_champ_id);
				ocp_aColonnes.initTree(ocp_nouvelleColonne);
			}
		}

	} catch (e) {
    recup_erreur(e);
  }
}

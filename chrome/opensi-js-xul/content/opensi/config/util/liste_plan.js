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


jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");


var ouvert = 0;
var Classe = -1;
var numero_compte;
var Code_Plan;
var id = 0;
var nomClasse = new Array(10);
var valeur;


function init() {
	try {

    window.resizeTo(800,600);

		Classe = 1;

		valeur = window.arguments[0];

		if (valeur.charAt(0)>=1 && (valeur.charAt(0))<=7) {
			Classe = parseInt(valeur.charAt(0));
		}

		choisirPlan();

	} catch (e) {
    recup_erreur(e);
  }
}


function choisirPlan() {
	try {

		var qPlan = new QueryHttp("Config/dossiers/getDossier.tmpl");
		qPlan.execute(choisirPlan_2);

	} catch (e) {
    recup_erreur(e);
  }
}


function choisirPlan_2(httpRequest) {
	try {

		Code_Plan = httpRequest.responseXML.documentElement.getAttribute('Code_Plan');

		var qPlan = new QueryHttp("Compta/Config/plan_comptable/getPlan.tmpl");
		qPlan.execute(choisirPlan_3);

	} catch (e) {
    recup_erreur(e);
  }
}


function choisirPlan_3(httpRequest) {
	try {

		var contenu = httpRequest.responseXML.documentElement;
		Libelle = contenu.getAttribute('Libelle');
		Code = contenu.getAttribute('Code');

		enregistrerTitre();
		tab(Classe);

	} catch (e) {
    recup_erreur(e);
  }
}


function tab(Cl) {
	try {

		Classe = Cl;
		afficherTitre();
		
		var aClasses = new Arbre('Compta/GetRDF/listeClassesComptes.tmpl', 'Classe');
		aClasses.setParam('Niveau', 3);
		aClasses.setParam('Classe', Classe);
		aClasses.setParam('Code', Code_Plan);
		aClasses.initTree();		

	} catch (e) {
    recup_erreur(e);
  }
}


function enregistrerTitre() {
	try {

		var qTitre = new QueryHttp("Compta/Config/plan_comptable/getTitrePlan.tmpl");
		qTitre.setParam("Code_Plan", Code_Plan);
		var result = qTitre.execute();

		var ent = result.responseXML.documentElement.getElementsByTagName('Entete');

		for (var i=0;i<nomClasse.length;i++) {
			nomClasse[i]="";
		}

		nomClasse[0]="Clients";
		nomClasse[1]="Fournisseurs";

		for (var i=0;i<ent.length;i++) {
			var nom=ent.item(i).getAttribute('libelle');
			var numero = ent.item(i).getAttribute('num');
			var num = parseInt(numero);
			nomClasse[num+1] = "Classe "+(num)+" - "+nom;
		}

		afficherTitre();

	} catch (e) {
    recup_erreur(e);
  }
}


function afficherTitre() {
	try {

		document.getElementById("titre").value = (Classe==-2?"Auxiliaires":nomClasse[Classe+1]);

	} catch (e) {
    recup_erreur(e);
  }
}


function ouvrirClasse() {
	try {

		var t = document.getElementById('Classe');
		if(t.view!=null && t.currentIndex!=-1){
  		var code = getCellText(t,t.view.selection.currentIndex,'num');
      window.arguments[1](code);
      window.close();
		}

	} catch (e) {
    recup_erreur(e);
  }
}


function keypress(e) {
	try {

		if (e.keyCode==13) {
      ouvrirClasse();
    }

	} catch (e) {
    recup_erreur(e);
  }
}

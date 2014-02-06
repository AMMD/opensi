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
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");



var page = 1;
var nb_pages = 1;
var debit = 0;
var credit = 0;
var solde = 0;
var soldeecart=0;
var soldefinal=0;
var soldereleve=0;
var compteprec = '';
var comptesuiv = '';
var comptedebut = '';
var comptefin = '';
var numop = '';
var typerappro="";
var listop ="";
var listoprb="";
var nbOp=0;
var nomcompte="";
var nomjournal="";
var valuerapproid="";
var baseexo2="";
var nfs = new NumberFormat("0.00", true);
var fs = new NumberFormat("0.00", false);


function init() {
  try {
    valuerapproid = ParamValeur('rapproid');
    if (ParamValeur('nomjournal')!="" || ParamValeur('nomcompte')!=""){
    	nomjournal = ParamValeur('nomjournal');
			nomcompte = ParamValeur('nomcompte');
    }

    getModerapprochement();
    initialiser2();
  } catch (e) {
    recup_erreur(e);
  }
}
function initcomptejournal(comptejournal){

	if (typerappro=="C"){
		nomcompte=comptejournal;

	}
	if (typerappro=="J"){
		nomjournal=comptejournal;
	}
}
function getModerapprochement(){
	var queryEdit = new QueryHttp("Compta/RapprochementBancaire/LoadModeRapprochement.tmpl");
  queryEdit.execute();

}
function initialiser2(){

		typerappro=get_cookie('Type_Rappro');

	if (typerappro=="C"){
		var aListe = new Arbre('Compta/GetRDF/rapproListeCompteJournaux.tmpl', 'liste');
		aListe.initTree(initialiser3);
		document.getElementById("casecompte").collapsed=false;
		document.getElementById("journal").collapsed=false;
	}
	if (typerappro=="J"){
	  var aListe = new Arbre('Compta/GetRDF/rapproListeCompteJournaux.tmpl', 'liste_journaux');
		aListe.initTree(initialiser4);
		document.getElementById("casejournal").collapsed=false;
		document.getElementById("compte").collapsed=false;
	}



}
function initialiser3(){

	if (nomcompte!=""){

		document.getElementById("liste").selectedIndex = 0;
	
		document.getElementById("liste").setAttribute('label', nomcompte);
		nomcompte="";
	}
	else{
		document.getElementById("liste").selectedIndex = 0;
	}

	if (document.getElementById("liste").selectedIndex == -1){
		initvaleur();
		disablecompte(true);
		disable(true);
		collapse(true);
		loadTree();
	}

	else{
		collapse(false);
		loadhisto();
	}

	if (get_cookie('Nouveau_Rappro')=="0"){
		document.getElementById("lblnvcompte").collapsed=true;
		document.getElementById("btnvcompte").collapsed=true;
	}
	else{
		document.getElementById("lblnvcompte").collapsed=false;
		document.getElementById("btnvcompte").collapsed=false;
	}

}
function initialiser4(){
	if (nomjournal!=""){
		document.getElementById("liste_journaux").selectedIndex = 0;
		document.getElementById("liste_journaux").setAttribute('label', nomjournal);
		nomjournal="";
	}
	else{
		document.getElementById("liste_journaux").selectedIndex = 0;
	}

	if (document.getElementById("liste_journaux").selectedIndex == -1){
		document.getElementById("liste_journaux").collapsed=true;
		initvaleur();
		disablecompte(true);
		disable(true);
		collapse(true);
		loadTree();
	}

	else{
		collapse(false);
		loadhisto();
	}

	if (get_cookie('Nouveau_Rappro')=="0"){
		document.getElementById("lblnvjournal").collapsed=true;
		document.getElementById("btnvjournal").collapsed=true;
	}
	else{
		document.getElementById("lblnvjournal").collapsed=false;
		document.getElementById("btnvjournal").collapsed=false;
	}
}
function loadhisto(){
	
	 if (typerappro=="C"){
	 		var compte=document.getElementById("liste").label;
			document.getElementById("lblcompte").value=document.getElementById("liste").value;
	 }
	 if (typerappro=="J"){
	 		var compte=document.getElementById("liste_journaux").label;
	 		document.getElementById("lbljournal").value=document.getElementById("liste_journaux").value;
	 }
	
	 if (compte!=""){
	 	var bListe = new Arbre('Compta/GetRDF/rapproListeHisto.tmpl', 'histo_rappro');
  	    bListe.clearParams();

		 		bListe.setParam("NumCompte",compte);
		    bListe.initTree(initialiser5);
	 }
	 else{
	 	init();
	 }
}
function initialiser5(){
 
   if (valuerapproid!=""){
    	document.getElementById("histo_rappro").value = valuerapproid;
    	valuerapproid="";
   }
   else{
    	document.getElementById("histo_rappro").selectedIndex = 0;
   }

   if (document.getElementById("histo_rappro").value != ""){
   	loadinfo();
   }

}
function loadinfo(){

	 if (document.getElementById("histo_rappro").selectedIndex == 1){
	  	 document.getElementById("supRap").collapsed=false;
	 }
	 else{
	  	document.getElementById("supRap").collapsed=true;
	 }

		var rapproid=document.getElementById("histo_rappro").value;
    
		var queryEdit = new QueryHttp("Compta/RapprochementBancaire/InfoRapprochement.tmpl");
							queryEdit.setParam("req","infoRappro");
							queryEdit.setParam("rapproid",rapproid);
	  var response=queryEdit.execute();
		var contenu = response.responseXML.documentElement;
		var iscloture=contenu.getAttribute('iscloture');
		var daterappro=contenu.getAttribute('Date_Rappro');
		var numreleve=contenu.getAttribute('Num_Releve');
		soldereleve=contenu.getAttribute('Solde_Releve');
		soldereleve=fs.format(soldereleve);
		
		var datefinrappro=contenu.getAttribute('Date_Releve');

		var totaldebit=contenu.getAttribute('totdebit');
		var totalcredit=contenu.getAttribute('totcredit');
		var soldecomptable=contenu.getAttribute('soldecomptable');
		var soldeini=contenu.getAttribute('soldeini');
	
		baseexo2="";
		baseexo2=contenu.getAttribute('exoprecedent');

		if (datefinrappro==""){

			 	document.getElementById("dateRappro").value=daterappro;
		    document.getElementById("numreleve").value=numreleve;
		    document.getElementById("soldeRelevé").value=nfs.format(soldereleve);
		    document.getElementById("dateEcrituremax").value="";
				document.getElementById("total_debit").value="";
				document.getElementById("total_credit").value="";
				document.getElementById("soldecomptable").value="";
				document.getElementById("soldeinibanque").value="";
				document.getElementById("soldefinal").value="";
				document.getElementById("ecartdebit").value="";
				document.getElementById("ecart").value="";
				document.getElementById("ecartcredit").value="";
				document.getElementById("impression").collapsed=true;
		}
		else{
		    soldefinal=contenu.getAttribute('soldefinal');
		    soldefinal=fs.format(soldefinal);		    
		    soldeecart=fs.format(soldefinal-soldereleve);
		    document.getElementById("dateRappro").value=daterappro;
		    document.getElementById("numreleve").value=numreleve;
		    document.getElementById("soldeRelevé").value=nfs.format(soldereleve);
		    document.getElementById("dateEcrituremax").value=datefinrappro;
				document.getElementById("total_debit").value=nfs.format(totaldebit);
				document.getElementById("total_credit").value=nfs.format(totalcredit);
				document.getElementById("soldecomptable").value=nfs.format(soldecomptable);
				document.getElementById("soldeinibanque").value=nfs.format(soldeini);
				document.getElementById("soldefinal").value=nfs.format(soldefinal);
				document.getElementById("impression").collapsed=false;
					if (soldeecart>0){
						document.getElementById("ecartdebit").value=nfs.format(Math.abs(soldeecart));
						document.getElementById("ecart").value=nfs.format(soldeecart);
						document.getElementById("ecartcredit").value="";
					}
					else{
						document.getElementById("ecartdebit").value="";
						document.getElementById("ecart").value=nfs.format(soldeecart);
						document.getElementById("ecartcredit").value=nfs.format(Math.abs(soldeecart));
					}
		}
		page=1;
		loadTree();
	if (document.getElementById("histo_rappro").label!="En cours"){
		disablecompte(true);
		collapse2(true);
	}
	if (document.getElementById("histo_rappro").label=="En cours"){
		disablecompte(false);
		collapse2(false);
	}
}
function disablecompte(arg){

	document.getElementById("numreleve").disabled=arg;
	document.getElementById("dateEcrituremax").disabled=arg;
	document.getElementById("soldeRelevé").disabled=arg;
	document.getElementById("rech_debit").disabled=arg;
	document.getElementById("rech_credit").disabled=arg;

}
function initvaleur(){
	document.getElementById("dateRappro").value="";
	document.getElementById("soldeinibanque").value="";
	document.getElementById("histo_rappro").value="";
	document.getElementById("soldeRelevé").value="";
	document.getElementById("dateEcrituremax").value="";
	document.getElementById("total_debit").value="";
	document.getElementById("total_credit").value="";
	document.getElementById("soldecomptable").value="";
}
function collapse(arg){

	document.getElementById("histo_rappro").collapsed=arg;
	document.getElementById("supRap").collapsed=arg;
	document.getElementById("saisierb").collapsed=arg;
	document.getElementById("toutpointer").collapsed=arg;
	document.getElementById("toutdepointer").collapsed=arg;
	document.getElementById("cloture").collapsed=arg;
	document.getElementById("liste").collapsed=arg;
	document.getElementById("liste_journaux").collapsed=arg;
	if (typerappro=="C"){
		document.getElementById("btnrazcompte").collapsed=arg;
		document.getElementById("lblrazcompte").collapsed=arg;
		document.getElementById("lblcompte").collapsed=arg;
	}
	if (typerappro=="J"){
		document.getElementById("lblrazjournal").collapsed=arg;
		document.getElementById("btnrazjournal").collapsed=arg;
		document.getElementById("lbljournal").collapsed=arg;
	}
	document.getElementById("checkbox").collapsed=arg;
}
function collapse2(arg){
	document.getElementById("saisierb").collapsed=arg;
	document.getElementById("toutpointer").collapsed=arg;
	document.getElementById("toutdepointer").collapsed=arg;
	document.getElementById("cloture").collapsed=arg;
}
function disable(arg){
	document.getElementById("boutonDebut").disabled=arg;
	document.getElementById("boutonPrec").disabled=arg;
	document.getElementById("numpage").disabled=arg;
	document.getElementById("boutonSuiv").disabled=arg;
	document.getElementById("boutonFin").disabled=arg;
}

function loadTree(rech){

	var rechcredit="";
	var rechdebit="";
	if (rech==1){
	rechdebit=document.getElementById("rech_debit").value;
	rechdebit=rechdebit.replace(",", ".");
	page=1;
	}
	if (rech==2){
	rechcredit=document.getElementById("rech_credit").value;
	rechcredit=rechcredit.replace(",", ".");
	page=1;
	}
	if (rech==3){

	document.getElementById("rech_credit").value="";
	document.getElementById("rech_debit").value="";
	}
	var rapproid=document.getElementById("histo_rappro").value;

	if (document.getElementById("nonpointees").selected){
		var pointage=0;
	}
	else if (document.getElementById("pointees").selected){
		var pointage=1;
	}
	else{
		var pointage=2;
	}
	if (listop==""){
		listop="''";
	}
	if (listoprb==""){
		listoprb="''";
	}
	var a1 = new Arbre('Compta/GetRDF/rapprochementBancaire.tmpl', 'lignes');
	if (rapproid!=""){


		a1.setParam("rapproid",rapproid);
		a1.setParam("pointe",pointage);
		a1.setParam("nbPage",page);
		a1.setParam("rechcredit",rechcredit);
		a1.setParam("rechdebit",rechdebit);
		if (isPositive(document.getElementById('nbOp').value)) {
			a1.setParam("nbOpparpage",document.getElementById('nbOp').value);
		}
		else {
			a1.setParam("nbOpparpage", 50);
		}
		if (baseexo2!="") {
			a1.setParam("baseexo2",baseexo2);
		}
		a1.initTree(loadTree_suite);
	}
	else{
		a1.deleteTree();
	}

}
function loadTree_suite(){
	
	nbOp=get_cookie('Nb_Op');

	initpage(page);

}
function testdatefinrappro(){

	var daterappro=document.getElementById("dateRappro").value;
	var datefinrappro=document.getElementById("dateEcrituremax").value;
	if (datefinrappro<daterappro){
		showMessage("la date jusqu'au ne peut pas être antérieure à la date de rapprochement");
		return false;
	}
	else{
		return true;
	}
}

function raz(){

	 if (typerappro=="C"){
		 var compte=document.getElementById("liste").label;
		 var dlg=" Le rapprochement pour ce compte sera entièrement supprimé - sur tous les exercices"
	 }
	 if (typerappro=="J"){
		 var compte=document.getElementById("liste_journaux").label;
		 var dlg=" Le rapprochement pour ce journal sera entièrement supprimé - sur tous les exercices"
	 }

	 if (window.confirm(dlg) && compte !=""){
		 var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
						queryEdit.setParam("req","RAZ");
						queryEdit.setParam("comptejournal",compte);
						queryEdit.setParam("typerappro",typerappro);
	   var response=queryEdit.execute();
		 var contenu = response.responseXML.documentElement;
		 var stat= contenu.getAttribute('status');

		 if (stat=="1") {
			showMessage("Le rapprochement est supprimé");
			//initialiser2();
			init();
		   }
		else{
			showMessage("une erreur s'est produite,la remise à zéro n'a pas été éffectuée");
			}
	 }

}



function updatePointage(){

	if (document.getElementById("histo_rappro").label=="En cours"){
		 var tree= get_tree();
		 var indx = tree.currentIndex;
		 var cellule = tree.view.getItemAtIndex(indx).childNodes[0].childNodes[6];
		 var src = cellule.getAttribute("src");
		 var valeur = cellule.getAttribute("value");

		 if (valeur=="0"){
			 cellule.setAttribute("value","1");
			 cellule.setAttribute("src","chrome://opensi/content/design/coche.png");
			 pointe=1;
		 }
		 else{
		 	cellule.setAttribute("value","0");
			cellule.setAttribute("src","");
			pointe=0;
		 }

	 	var pointage=getCellValue(tree,tree.currentIndex,'pointage');
		var opid=getCellText(tree,tree.currentIndex,'opid');
		var typerb=getCellText(tree,tree.currentIndex,'type_rb');

		//opérations
		if (typerb==0){
			var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
								queryEdit.setParam("req","majPointage");
								queryEdit.setParam("opid",opid);
								queryEdit.setParam("baseexo2","");
								queryEdit.setParam("pointage",pointage);
	    	var response=queryEdit.execute();
		}
		//saisies rb
		else if (typerb==1) {
			var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
								queryEdit.setParam("req","majPointageSRB");
								queryEdit.setParam("ligRBId",opid);
								queryEdit.setParam("baseexo2","");
								queryEdit.setParam("pointage",pointage);
	   		var response=queryEdit.execute();
		}
		//opérations venant de l'exercice précédent
		else if (typerb==3) {
			var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
								queryEdit.setParam("req","majPointage");
								queryEdit.setParam("opid",opid);
								queryEdit.setParam("baseexo2",baseexo2);
								queryEdit.setParam("pointage",pointage);
	   		var response=queryEdit.execute();
		}

		//saisies rb venant de l'exercice précédent
		else if (typerb==4) {

			var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
								queryEdit.setParam("req","majPointageSRB");
								queryEdit.setParam("ligRBId",opid);
								queryEdit.setParam("baseexo2",baseexo2);
								queryEdit.setParam("pointage",pointage);
	   		var response=queryEdit.execute();
		}
		credit=getCellText(tree,tree.currentIndex,'credit');		
		debit=getCellText(tree,tree.currentIndex,'debit');
 
		if (pointe==0){

				if (credit>0){		
					 
					soldeecart=fs.format(parseFloat(soldeecart) + parseFloat(credit));					
					soldefinal=fs.format(parseFloat(soldefinal) + parseFloat(credit));
				}
				if (debit>0){
					soldeecart=fs.format(parseFloat(soldeecart) - parseFloat(debit));					
					soldefinal=fs.format(parseFloat(soldefinal) - parseFloat(debit));										
				}
				if (soldeecart>0){
					document.getElementById("ecartdebit").value=nfs.format(Math.abs(soldeecart));
					document.getElementById("ecartcredit").value="";
					document.getElementById("ecart").value=nfs.format(soldeecart);
				}
				else{
					document.getElementById("ecartdebit").value="";
					document.getElementById("ecartcredit").value=nfs.format(Math.abs(soldeecart));
					document.getElementById("ecart").value=nfs.format(soldeecart);
				}			
				document.getElementById("soldefinal").value=nfs.format(soldefinal);

		}
		if (pointe==1){

				if (credit>0){				
					soldeecart=fs.format(parseFloat(soldeecart) - parseFloat(credit));					
					soldefinal=fs.format(parseFloat(soldefinal) - parseFloat(credit));
				}
				if (debit>0){
					soldeecart=fs.format(parseFloat(soldeecart) + parseFloat(debit));					
					soldefinal=fs.format(parseFloat(soldefinal) + parseFloat(debit));
				}
				if (soldeecart>0){
					document.getElementById("ecartdebit").value=nfs.format(Math.abs(soldeecart));
					document.getElementById("ecartcredit").value="";
					document.getElementById("ecart").value=nfs.format(soldeecart);
				}
				else{
					document.getElementById("ecartdebit").value="";
					document.getElementById("ecartcredit").value=nfs.format(Math.abs(parseFloat(soldeecart)));
					document.getElementById("ecart").value=nfs.format(soldeecart);
				}				
				document.getElementById("soldefinal").value=nfs.format(soldefinal);
		}
		
	}
}
function PointageTot(valeur){

	var rapproid=document.getElementById("histo_rappro").value;
	var valeurPointage=valeur;
	var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
						queryEdit.setParam("req","PointageTot");
						queryEdit.setParam("rapproid",rapproid);
						queryEdit.setParam("baseexo2",baseexo2);
						queryEdit.setParam("valuePointage",valeurPointage);
  var response=queryEdit.execute();
	var contenu = response.responseXML.documentElement;
	var stat= contenu.getAttribute('status');
		if (stat=="1") {
			showMessage("Le rapprochement est modifié");
			loadinfo();
		}
		else{
			showMessage("une erreur s'est produite,le rapprochement n'est pas modifié");
			}
    }
function updateRappro(){

	var rapproid=document.getElementById("histo_rappro").value;
	var daterappro=document.getElementById("dateRappro").value;
	var datereleve=document.getElementById("dateEcrituremax").value;

	/*if (datereleveLong> get_cookie('Fin_Exercice')){
		showMessage("vous ne pouvez pas mettre de date de relevé supérieure à la date de la fin d'exercice");
		return false;
	}*/

	if (isDate(daterappro) && isDate(datereleve)){
						var daterapproLong=Date2Long(daterappro);
						var datereleveLong=Date2Long(datereleve);
					if (datereleveLong< daterapproLong){
						showMessage("La date jusqu'au ne peut pas être antérieure à la date de début de rapprochement");
						return false;
					}
					if (datereleveLong< get_cookie('Debut_Exercice')){
						showMessage("La date de relevé ne peut pas être antérieure à la date de début de l'exercice");
						return false;
					}
					if (datereleveLong> get_cookie('Fin_Exercice')){
						//on verifie que le l'exercice suivant existe, si oui on change le cookie
						var queryEdit = new QueryHttp("Compta/RapprochementBancaire/ChgtExercice.tmpl");
													//	queryEdit.setParam("req","chgtexo");

						var dlg="Attention la date de relevé depasse la fin de l'exercice - le rapprochement sera accessible à partir	de l'exercice suivant"
						if (!window.confirm(dlg)){
							return false;
						}
						var response=queryEdit.execute();
						var contenu = response.responseXML.documentElement;
						var stat= contenu.getAttribute('status');
						if (stat=="0") {
							showMessage("La date de relevé est postérieure à la date de fin de l'exercice - l'exercice suivant doit être créé");
							return false;
						}
						else{

						}
		}
		var soldereleve=document.getElementById("soldeRelevé").value;
		var soldereleve=soldereleve.replace(",", ".");
		var soldereleve=soldereleve.replace(" ", "");

		if (isNaN(soldereleve)){
  		showMessage("Le solde de relevé doit être un nombre ");
  		return false;
  	}
		var numreleve=document.getElementById("numreleve").value;
		var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
							queryEdit.setParam("req","updateRappro");
							queryEdit.setParam("daterappro",prepareDateJava(daterappro));
							queryEdit.setParam("datereleve",prepareDateJava(datereleve));
			   			queryEdit.setParam("soldereleve",soldereleve);
							queryEdit.setParam("rapproid",rapproid);
							queryEdit.setParam("numreleve",numreleve);
		var response=queryEdit.execute();
		var contenu = response.responseXML.documentElement;
		var stat= contenu.getAttribute('status');
		if (stat=="1") {
			showMessage("Le rapprochement est modifié");
			if (datereleveLong> get_cookie('Fin_Exercice')){

					var queryEdit2 = new QueryHttp("Compta/RapprochementBancaire/ChgtExercice.tmpl");
															queryEdit2.setParam("req2","chgtexo");
															queryEdit2.setParam("req","exosuivant");
					var response2=queryEdit2.execute();
					var contenu2 = response2.responseXML.documentElement;
					var datesexo= contenu2.getAttribute('datesexo');
					parent.document.getElementById("date_exercice").value = "Exercice "+ datesexo;

						if (typerappro=="C"){
							var comptejournal=document.getElementById("liste").label;
								nomcompte=comptejournal;
				    }
				    if (typerappro=="J"){
							var comptejournal=document.getElementById("liste_journaux").label;
							nomjournal=comptejournal;
				    }
				  showMessage("Vous êtes maintenant sur l'exercice "+ datesexo);
					init();
			}
			else{
			loadinfo();
			}

		}
		else{
			showMessage("une erreur s'est produite,le rapprochement n'est pas modifié");
			loadinfo();
		}

	}
	else{
		showMessage("La date n'est pas au bon format");
	}
}

function Date2Long(val) {
	try {

		if (val.length != 10 && val.length != 8) {
  	  return false;
  	}
    else {
      strjour = val.substring(0,2);
      strmois = val.substring(3,5);
      strannee = val.length==10?val.substring(6,10):"20"+val.substring(6,8);

      if ((val.charAt(2)!='/' && val.charAt(2)!='.' &&    val.charAt(2)!=':')    || (val.charAt(5)!='/' &&    val.charAt(5)!='.' && val.charAt(5)!=':')) {
    	  return false;
    	}
      else if (!(isPositive(strjour) && isPositive(strmois) && isPositive(strannee))) {
      	return false;
      }
      else {
        d = new Date();
      	d.setFullYear(strannee, strmois-1, strjour);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d.getTime();
      }
    }
	} catch (e) {
  	recup_erreur(e);
	}
}


function clotureRappro(){
	if (soldeecart==0){
		var rapproid=document.getElementById("histo_rappro").value;
		var datereleve=document.getElementById("dateEcrituremax").value;
		var soldeFinal=document.getElementById("soldefinal").value;
		var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
							queryEdit.setParam("req","cloture");
							queryEdit.setParam("datereleve",prepareDateJava(datereleve));
							queryEdit.setParam("rapproid",rapproid);
							queryEdit.setParam("baseexo2",baseexo2);
							queryEdit.setParam("soldeFinal",soldeFinal);
	  var response=queryEdit.execute();
		var contenu = response.responseXML.documentElement;
		var stat= contenu.getAttribute('status');
		if (stat=="1") {
			showMessage("Le rapprochement est historisé");
			loadhisto();
		}
		else{
			showMessage("une erreur s'est produite,le rapprochement n'est pas historisé");
			}
	}
	else{
		showMessage("L'écart de rapprochement doit être nul pour clôturer le rapprochement");
	}
}

function supRappro(){

	var rapproid=document.getElementById("histo_rappro").value;
	if (rapproid!=""){
		var queryEdit = new QueryHttp("Compta/RapprochementBancaire/MajRapprochement.tmpl");
						queryEdit.setParam("req","supRappro");
						queryEdit.setParam("baseexo2",baseexo2);
						queryEdit.setParam("rapproid",rapproid);
    var response=queryEdit.execute();
    var contenu = response.responseXML.documentElement;
	var stat= contenu.getAttribute('status');
	if (stat=="1") {
		showMessage("l'historique a été supprimé");
		loadhisto();
		document.getElementById("histo_rappro").selectedIndex = 0;

						var daterappro=document.getElementById("dateRappro").value;
						var datereleve=document.getElementById("dateEcrituremax").value;
						var daterapproLong=Date2Long(daterappro);
						var datereleveLong=Date2Long(datereleve);
						//si on est sur un rappro dont les dates sont sur 2 exercices et que la date de relevé est nulle
					if (daterapproLong< get_cookie('Debut_Exercice') && document.getElementById("histo_rappro").selectedIndex==-1){

								var queryEdit2 = new QueryHttp("Compta/RapprochementBancaire/ChgtExercice.tmpl");
								queryEdit2.setParam("req2","chgtexo");
								queryEdit2.setParam("req","exoprecedent");

								var response2=queryEdit2.execute();
								var contenu2 = response2.responseXML.documentElement;
								var datesexo= contenu2.getAttribute('datesexo');
								parent.document.getElementById("date_exercice").value = "Exercice "+ datesexo;

									if (typerappro=="C"){
										var comptejournal=document.getElementById("liste").label;
											nomcompte=comptejournal;
							    }
							    if (typerappro=="J"){
										var comptejournal=document.getElementById("liste_journaux").label;
										nomjournal=comptejournal;
							    }
							  showMessage("Vous êtes maintenant sur l'exercice "+ datesexo);
								init();
					}
					else{
								loadhisto();
					}
	}
	else{
		showMessage("une erreur s'est produite l'historique n'a pas été supprimé");
	}

	}
	else{
		showMessage("une erreur s'est produite l'historique n'a pas été supprimé");
	}

}


function get_nb_pages() {

  try {
	   var nbecr = nbOp;
	   var nbOpPAGE = document.getElementById('nbOp').value;
	   if (!isPositive(nbOpPAGE)) {
			nbOpPAGE = 50;
		}
		if (nbecr%nbOpPAGE==0) {
			return parseIntBis((nbecr/nbOpPAGE));
		}
		else {
	    	return parseIntBis((nbecr/nbOpPAGE)+1);
		}
  } catch (e) {
    recup_erreur(e);
  }
}

/* Chargement de la première page d'écriture */
function pageDebut() {
  try {

    reinit(1);

	} catch (e) {
    recup_erreur(e);
  }
}

/* Chargement de la dernière page d'écriture */
function pageFin() {
  try {

    reinit(nb_pages);

	} catch (e) {
    recup_erreur(e);
  }
}

/* Chargement de la page précédente */
function pagePrec() {
  try {

		reinit(parseIntBis(page)-1);

	} catch (e) {
    recup_erreur(e);
  }
}

/* Chargement de la page suivante */
function pageSuiv() {
  try {

	  reinit(parseIntBis(page)+1);

	} catch (e) {
    recup_erreur(e);
  }
}

function reinit(p) {
  try {

    nb_pages = get_nb_pages();
		if (!isNaN(p)) {
			if (parseIntBis(p)>nb_pages) {
				page = nb_pages;
			}
			else if (parseIntBis(p)<1) {
				page = 1;
			}
			else {
				page = p;
			}
		}


        document.getElementById('page').value = "Page N°";
        document.getElementById('numpage').value = page;
        document.getElementById('finpage').value="/ " + nb_pages;
        loadTree();
		disable(false);
  } catch (e) {
    recup_erreur(e);
  }
}
function initpage(p) {
  try {

    nb_pages = get_nb_pages();
		if (!isNaN(p)) {
			if (parseIntBis(p)>nb_pages) {
				page = nb_pages;
			}
			else if (parseIntBis(p)<1) {
				page = 1;
			}
			else {
				page = p;
			}
		}
        document.getElementById('page').value = "Page N°";
        document.getElementById('numpage').value = page;
        document.getElementById('finpage').value="/ " + nb_pages;

	disable(false);

  } catch (e) {
    recup_erreur(e);
  }
}
function newcompte_window() {
  try {



	var page = "chrome://opensi/content/compta/user/rapprochement_bancaire/nouveau_compte.xul?"+ cookie();
    window.openDialog(page,'','chrome,modal,centerscreen');



  } catch (e) {
    recup_erreur(e);
  }
}


function rechecr() {
  try {

    var url = "chrome://opensi/content/compta/util/rechecriture.xul?"+ cookie();
    window.openDialog(url,'','chrome,modal,centerscreen');

  } catch (e) {
    recup_erreur(e);
  }
}

function saisierb_window() {
  try {

    var rapproid=document.getElementById("histo_rappro").value;
    var dateRappro=document.getElementById("dateRappro").value;
    var dateReleve=document.getElementById("dateEcrituremax").value;

    if (dateReleve==""){
    	showMessage(" La date 'Ecritures jusqu'au' doit être renseignée ");
    	return false;
    }
    if (typerappro=="C"){
	var comptejournal=document.getElementById("liste").label;
    }
    if (typerappro=="J"){
	var comptejournal=document.getElementById("liste_journaux").label;
    }
	var page = "chrome://opensi/content/compta/user/rapprochement_bancaire/saisie_rb.xul?"+ cookie()+"&comptejournal="+comptejournal+"&rapproid="+rapproid+"&dateRappro="+dateRappro+"&dateReleve="+dateReleve;
    window.openDialog(page,'','chrome,modal,centerscreen');



  } catch (e) {
    recup_erreur(e);
  }
}
function retour_consultation() {
  try {

    window.location = "chrome://opensi/content/compta/user/menu_exercice.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}
function retour_prec() {
  try {

    window.location = ParamValeur('prec');

	} catch (e) {
    recup_erreur(e);
  }
}
/*****************************************************
 *  @return le pointeur vers l'arbre contenant les écritures comptables.
 ****************************************************/
function get_tree() {
  try {

    return document.getElementById('lignes');

	} catch (e) {
    recup_erreur(e);
  }
}

/****************************************************
 *  Correspondance entre l'id d'un textbox et le target RDF associé
 *  @param id : l'identifiant du textbox
 *  @return le target associé
 ****************************************************/


function genPdf() {
	try {
 	if (typerappro=="C"){
	 nomcompte=document.getElementById("liste").label;
	 }
	 if (typerappro=="J"){
	 nomjournal=document.getElementById("liste_journaux").label;
	 }

	var rapproid=document.getElementById("histo_rappro").value;
	var page = "chrome://opensi/content/compta/user/rapprochement_bancaire/pdfRapprochement.xul?"+ cookie();
		page += "&rapproid="+rapproid+"&nomcompte="+nomcompte+"&nomjournal="+nomjournal+"&base2="+baseexo2;
		window.location = page;

	}	catch(e) {
		recup_erreur(e);
	}
}







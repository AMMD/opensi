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


jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/verif.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/formatter.js");

var arbre_operation = new Arbre("Compta/GetRDF/Consultation.tmpl","lignes");

var page = 1;
var nb_pages = 1;

var lettrage_en_cours = 0;
var debit = 0;
var credit = 0;
var solde = 0;
var dsource; // source de données RDF de l'arbre.
var compteprec = '';
var comptesuiv = '';
var comptedebut = '';
var comptefin = '';
var numop = '';
var charge = false;
var listeop = new Array();
var nfs = new NumberFormat("0.00", true);
var nf = new NumberFormat("0.00", false);
var nmoins1=0;

var lEnCours=0;

function init() {
  try {

    var compte = ParamValeur('compte');
    var prec = ParamValeur('prec');
    var nomprec = ParamValeur('nomprec');
    numop = ParamValeur('numop');
		
		var httpRequest = new QueryHttp("Compta/Consultation/getComptes.tmpl");
		httpRequest.setParam("nmoins1", nmoins1);
		var p=httpRequest.execute();

		comptedebut = p.responseXML.documentElement.getAttribute('Compte_Premier');
    comptefin = p.responseXML.documentElement.getAttribute('Compte_Dernier');

    if (isEmpty(compte)) {
      document.getElementById('compte').focus();
    }
		else {
      document.getElementById('compte').value = compte;
      ok();
    }

    if (!isEmpty(nomprec)) {
      document.getElementById('bRetour'+ nomprec).collapsed = false;
    }
		infoExoNmoins1();
		
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
function targetname(id) {
  try {
    switch(id) {
      case 'lettre':
        return "http://www.opensi.org/compta/lignes_ecriture/rdf#lettre";
        break;
      case 'input_prop':
        return "http://www.opensi.org/compta/lignes_ecriture/rdf#prop";
        break;
      default:
        return '';
    }
  } catch (e) {
    recup_erreur(e);
  }
}


/****************************************************
 *  Chargement de l'arbre depuis la source.
 *  @param dsource2 : la source du RDF
 ****************************************************/
function init_tree(dsource2) {
  try {

    dsource.deleteRecursive("http://www.opensi.org/compta/lignes_ecriture");
    var datasource = dsource.getRawDataSource();
    get_tree().database.RemoveDataSource(datasource);

    dsource2.copyAllToDataSource(dsource);

    var datasource2 = dsource2.getRawDataSource();
    get_tree().database.RemoveDataSource(datasource2);
    var datasource = dsource.getRawDataSource();
    get_tree().database.AddDataSource(datasource);

    setTimeout('focus_tree()',100);

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

		loadsuite();
  } catch (e) {
    recup_erreur(e);
  }
}
function exoNmoins1() {
  try {

  nmoins1=1;
  document.getElementById('exon').collapsed = false;
  document.getElementById('exonmoins1').collapsed = true;
  document.getElementById('lblnmoins1').collapsed = false;
  
  if (document.getElementById('compte').value!=""){
  	ok();
  }
  } catch (e) {
    recup_erreur(e);
  }
}
function exoN() {
  try {
 	nmoins1=0;
 	document.getElementById('exon').collapsed = true;
  document.getElementById('exonmoins1').collapsed = false;
  document.getElementById('lblnmoins1').collapsed = true;
   if (document.getElementById('compte').value!=""){
  	ok();
  }
  } catch (e) {
    recup_erreur(e);
  }
}


function infoExoNmoins1(){
	var queryEdit = new QueryHttp("Compta/Consultation/getInfosExo.tmpl");
	var response=queryEdit.execute();
	var contenu = response.responseXML.documentElement;
	
	var exo= contenu.getAttribute('Nom_Base');
	var debutexo= contenu.getAttribute('debutexo');

	var finexo= contenu.getAttribute('finexo');
	if (exo==""){
		document.getElementById('lblnmoins1').collapsed="true";
		document.getElementById('exonmoins1').collapsed="true";
	}

	else{
		document.getElementById('lblnmoins1').value="EXERCICE du " + debutexo + " au "+finexo;
	}
}
function loadCompte(cpte) {
  try {

    var let = ParamValeur('let');
    if (isEmpty(let)) {
			let='0';
    }
		else if (let!='0') {
			document.getElementById('let').checked=true;
		}

		compte = cpte;

    nb_pages = get_nb_pages();
    page = 1;

    if (!isEmpty(numop)) {
      var corps = cookie() +"&Page=Compta/GetNumPageOperation.tmpl&ContentType=xml&NumCompte="+ compte;
      corps += "&NumOp="+ numop;
			corps += "&nbOp=50";
      var p = requeteHTTP(corps);
			page = p.responseXML.documentElement.getAttribute("page");
		}

		loadsuite();

  } catch(e) {
    recup_erreur(e);
  }
}

function loadsuite() {
  try {

		charge=false;
    var nonlet = '0';
    if (document.getElementById('nonlet').checked) {
      nonlet = '1';
    }
    var let = '0';
    if (document.getElementById('let').checked) {
      let = '1';
    }
		arbre_operation.setParam("NumCompte", compte);
		arbre_operation.setParam("nbPage",page);
		arbre_operation.setParam("lop", listeop);
		arbre_operation.setParam("let", let);
		arbre_operation.setParam("nonlet",nonlet);
		arbre_operation.setParam("nmoins1",nmoins1);

		if (isPositive(document.getElementById('nbOp').value)) {
			arbre_operation.setParam("nbOp",document.getElementById('nbOp').value);
		}
		else {
			arbre_operation.setParam("nbOp", 50);
		}
    document.getElementById('page').value = "Page N°";
    document.getElementById('numpage').value = page;
    document.getElementById('finpage').value="/ " + nb_pages;

    document.getElementById('nbOp').disabled = true;
    document.getElementById('boutonDebut').disabled = true;
    document.getElementById('boutonPrec').disabled = true;
    document.getElementById('boutonFin').disabled = true;
    document.getElementById('boutonSuiv').disabled = true;
    document.getElementById('numpage').disabled = true;
    document.getElementById('let').disabled = true;
    document.getElementById('nonlet').disabled = true;
    document.getElementById('bCpteDebut').disabled = true;
    document.getElementById('bCptePrec').disabled = true;
    document.getElementById('compte').disabled = true;
    document.getElementById('bCpteSuiv').disabled = true;
    document.getElementById('bCpteFin').disabled = true;
    document.getElementById('ok').disabled = true;
		if (nb_pages == 0) {
    	document.getElementById('numpage').value=0;
		}

    dsource = new RDFDataSource();
		arbre_operation.initTree(init_tree);

  } catch(e) {
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


function keypress(e,id,p) {
  try {

    switch(e.keyCode){
      case 13: // 'Enter'
				if (id=="lignes") {
        	ecritures();
        }
        else if (id=="numpage") {
        	reinit(p);
        }
        else if (id=="nbOp") {
        	reinit(1);
        }
				else if (id=="compte") {
        	ok();
        }
        break;
      case 32: // Barre d'Espace
        lettrage();
        break;
      case 118 : // 'F7'
        validLettrage();
        break;
      case 119 : // 'F8'
        annulLettrage();
        break;
      case 123: // 'F12'
        rechecr();
				break;
      case 84: // ctrl + t
				if (e.ctrlKey) {
      		transfertcompte_window();
				}
        break;
    }

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


function ok() {
  try {

		razLettrage();

    var numero_compte = document.getElementById('compte').value;

		if (isEmpty(numero_compte)) {
      document.getElementById('compte').focus();
    }
		else {
			var httpRequest = new QueryHttp("Compta/Commun/existeCompte.tmpl");
			httpRequest.setParam("Numero_Compte", numero_compte);
			httpRequest.execute(ok_2, numero_compte);
		}

  } catch(e) {
    recup_erreur(e);
  }
}


function ok_2(result, numero_compte) {
  try {

		if (result.responseXML.documentElement.getAttribute("existe")=="true") {

			loadCompte(numero_compte);
		}
		else if (result.responseXML.documentElement.getAttribute("compte_like")!="") {

			loadCompte(result.responseXML.documentElement.getAttribute("compte_like"));
		}
		else {
			recherche_compte(numero_compte);
			document.getElementById('compte').focus();
			loadCompte(document.getElementById('compte').value);
		}

	} catch(e) {
    recup_erreur(e);
  }
}


function compteSuiv() {
  try {

    document.getElementById('compte').value = comptesuiv;
    ok();

	} catch (e) {
    recup_erreur(e);
  }
}


function comptePrec() {
  try {

    document.getElementById('compte').value = compteprec;
    ok();

	} catch (e) {
    recup_erreur(e);
  }
}


function compteDebut() {
  try {

		document.getElementById('compte').value = comptedebut;
    ok();

  } catch (e) {
    recup_erreur(e);
  }
}


function compteFin() {
  try {

		document.getElementById('compte').value = comptefin;
		ok();

  } catch (e) {
    recup_erreur(e);
  }
}


function recherche_compte(numero_compte) {
  try {

    var url = "chrome://opensi/content/config/util/rechcompte.xul?"+ cookie() +"&Creer=false&Num_Compte="+ urlEncode(numero_compte);
    window.openDialog(url,'','chrome,modal,centerscreen',retourRechercheCompte);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourRechercheCompte(numCompte) {
	try {
		document.getElementById('compte').value = numCompte;

	} catch (e) {
		  recup_erreur(e);
	}
}


function get_nb_pages() {
  try {

    var corps = cookie() +"&Page=Compta/GetNbOperationsCompte.tmpl&ContentType=xml&NumCompte="+ compte;
    var nonlet = '0';
    if (document.getElementById('nonlet').checked) {
      nonlet = '1';
    }
    var let = '0';
    if (document.getElementById('let').checked) {
      let = '1';
    }
    corps += "&let="+ let;
    corps += "&nonlet="+ nonlet;
		corps += "&nmoins1="+ nmoins1;
		
    var p = requeteHTTP(corps);

    var nbecr = p.responseXML.documentElement.getAttribute('nb');
   
    nbOp = document.getElementById('nbOp').value;

		if (!isPositive(nbOp)) {
			nbOp = 50;
		}
		if (nbecr%nbOp==0) {
			return parseIntBis((nbecr/nbOp));
		}
		else {
    	return parseIntBis((nbecr/nbOp)+1);
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


function focus_tree() {
  try {

    var tree = get_tree();

		var httpRequest = new QueryHttp("Compta/Consultation/getInfosCompte.tmpl");
		httpRequest.setParam("Numero_Compte", compte);
		httpRequest.setParam("nmoins1", nmoins1);
		httpRequest.execute(focusTree_2);

    document.getElementById('nbOp').disabled = (nb_pages == 0);
    document.getElementById('boutonDebut').disabled = (page == 1) || (nb_pages == 0);
    document.getElementById('boutonPrec').disabled = (page == 1) || (nb_pages == 0);
    document.getElementById('boutonFin').disabled = (page == nb_pages) || (nb_pages == 0);
    document.getElementById('boutonSuiv').disabled = (page == nb_pages) || (nb_pages == 0);
    document.getElementById('numpage').disabled = (nb_pages == 0) || (nb_pages == 1);
    document.getElementById('let').disabled = false;
    document.getElementById('nonlet').disabled = false;
    document.getElementById('bCpteDebut').disabled = false;
    document.getElementById('bCptePrec').disabled = false;
    document.getElementById('compte').disabled = false;
    document.getElementById('bCpteSuiv').disabled = false;
    document.getElementById('bCpteFin').disabled = false;
    document.getElementById('ok').disabled = false;


    if (tree.view != null) {

      var lignefocus = 0;
      var found = false;
      if (!isEmpty(numop) && numop!=0) {
        while (!found) {
          if (getCellText(tree,lignefocus,'opid') == numop) {
            found = true;
          }
					else {
            lignefocus++;
          }
        }
        numop = '';
      }

			charge=true;

			if (tree.view.rowCount>0 && found) {
      	tree.view.selection.select(lignefocus);
     		tree.treeBoxObject.ensureRowIsVisible(lignefocus);
				tree.focus();
			}
			else {
        tree.view.selection.select(0);
        tree.treeBoxObject.ensureRowIsVisible(0);
        tree.focus();
			}
    }

	} catch (e) {
    recup_erreur(e);
  }
}


function focusTree_2(result) {
  try {

		var contenu = result.responseXML.documentElement;

    document.getElementById('compte').value = contenu.getAttribute('Numero_Compte');
    document.getElementById('libelle_compte').value = contenu.getAttribute('Libelle');
    document.getElementById('type_compte').value = contenu.getAttribute('Type_Compte');

    document.getElementById('solde_compte').value = contenu.getAttribute('SoldeN');
    document.getElementById('debit_compte').value = contenu.getAttribute('DebitN');
    document.getElementById('credit_compte').value = contenu.getAttribute('CreditN');

    document.getElementById('old_solde_compte').value = contenu.getAttribute('SoldeN1');
    document.getElementById('old_debit_compte').value = contenu.getAttribute('DebitN1');
    document.getElementById('old_credit_compte').value = contenu.getAttribute('CreditN1');

    compteprec = contenu.getAttribute('Compte_Prec');
    comptesuiv = contenu.getAttribute('Compte_Suiv');

    document.getElementById('bCptePrec').disabled = (compteprec == '-');
    document.getElementById('bCpteSuiv').disabled = (comptesuiv == '-');
    document.getElementById('bCpteDebut').disabled = (document.getElementById('compte').value == comptedebut);
    document.getElementById('bCpteFin').disabled = (document.getElementById('compte').value == comptefin);

  } catch (e) {
    recup_erreur(e);
  }
}


function lettrage() {
  try {
		if (lEnCours==0) {
			lEnCours=1;
			if (nmoins1!=1){
				if (charge) {
		    	var tree = get_tree();
		    	var idx = tree.currentIndex;
		
		    	var aux = getCellText(tree,idx,'debit');
		    	var aux2 = '';
		    	for (i = 0;i<aux.length;i++) {
		      	var c = aux.charCodeAt(i);
		      	if ((c != 160) && (c != 32)) aux2 += aux.charAt(i);
		    	}
		    	var td = parseFloat(aux2.replace(',','.'));
		    	if (isNaN(td)) td = 0;
		
		    	aux = getCellText(tree,idx,'credit');
		    	aux2 = '';
		    	for (i = 0;i<aux.length;i++) {
		      	var c = aux.charCodeAt(i);
		      	if ((c != 160) && (c != 32)) aux2 += aux.charAt(i);
		    	}
		    	var tc = parseFloat(aux2.replace(',','.'));
		    	if (isNaN(tc)) tc = 0;
		
		    	var tl = getCellText(tree,idx,'lettre');
		
		    	var child = get_child(idx);
		
		    	if (peut_lettrer()) {
		      	if (isEmpty(tl)) {
		        	debit = parseFloat(nf.format(debit + td));
		        	credit = parseFloat(nf.format(credit + tc));
		        	solde =  parseFloat(nf.format(credit - debit));
		        	maj_aff_solde();
		        	child.addTargetOnce(targetname('lettre'),'+');
		        	lettrage_en_cours++;
							ajouterListeOp(getCellText(tree,idx,'opid'));
		      	} else if (tl == '+') {
		        	child.addTargetOnce(targetname('lettre'),'');
		        	debit = parseFloat(nf.format(debit - td));
		        	credit = parseFloat(nf.format(credit - tc));
		        	solde = parseFloat(nf.format(credit - debit));
		        	lettrage_en_cours--;
		        	if (lettrage_en_cours == 0) {
		          	document.getElementById('lettrage').collapsed = true;
		        	} else {
		          	maj_aff_solde();
		        	}
							ajouterListeOp(getCellText(tree,idx,'opid'));
		      	}
		      	if (lettrage_en_cours > 0 && solde == 0) {
		        	validLettrage();
		      	}
		    	}
				}
			}
			lEnCours=0;
		}
  } catch (e) {
    recup_erreur(e);
  }
}

function ajouterListeOp(opid) {
  try {
		var i=0;
		supp=false;
  	while (i<listeop.length && !supp) {
			if (listeop[i]==opid) {
				supp=true;
			}
			i++;
		}
		if (supp) {
			listeop.splice(i-1,1);
		}
		else {
			listeop.push(opid);
		}
		listeop.sort();
  } catch (e) {
    recup_erreur(e);
  }
}



function peut_lettrer() {
  try {
    if (premier_exo_ouvert()) {
      return true;
    } else {
      var tree = get_tree();
      var type_journal = getCellText(tree,tree.currentIndex,'type_journal');
      return (type_journal != 'AN');
    }
  } catch (e) {
    recup_erreur(e);
  }
}


/* retourne VRAI si l'exercice courant est le plus ancien exercice non cloturé et est writeable ! */
function premier_exo_ouvert() {
  try {

		var qExo = new QueryHttp("Compta/Exercice/GetExercice.tmpl");
		var result = qExo.execute();		

    var writeable = (result.responseXML.documentElement.getAttribute('Verrouille')=='0' && result.responseXML.documentElement.getAttribute('Cloture')=='0');

    var corps = cookie() +"&Page=Compta/GetPremierOuvert.tmpl&ContentType=xml";
	  var result = requeteHTTP(corps);

    return (writeable && parseIntBis(result.responseXML.documentElement.getAttribute('NbExosNonClotures'))==0);

  } catch (e) {
    recup_erreur(e);
  }
}


function annulLettrage() {
  try {
	
		if (nmoins1!=1){

			var qExo = new QueryHttp("Compta/Exercice/GetExercice.tmpl");
			var result = qExo.execute();		

    	var writeable = (result.responseXML.documentElement.getAttribute('Verrouille')=='0' && result.responseXML.documentElement.getAttribute('Cloture')=='0');

    	if (writeable) {

      	var tree = get_tree();
      	var tl = getCellText(tree,tree.currentIndex,'lettre');

      	if (isEmpty(tl)) return -1;
      	if (tl == '+') return -1;

      	if (confirm("Voulez-vous annuler le lettrage des lignes d'écritures lettrées par "+ tl +" ?")) {

					var qDLet = new QueryHttp("Compta/Consultation/delettrer.tmpl");
					qDLet.setParam('Lettre', tl);
					qDLet.setParam('Numero_Compte', compte);
					qDLet.execute();

        	for (i=0;i<tree.view.rowCount;i++) {
          	if (tl == getCellText(tree,i,'lettre')) {
            	var opid = getCellText(tree,i,'opid');
            	var child = get_child(i);
            	child.addTargetOnce(targetname('lettre'),'');
            	child.addTargetOnce(targetname('input_prop'),'disabled');
          	}
        	}
      	}
    	}
		}
		
  } catch (e) {
    recup_erreur(e);
  }
}


function get_child(id) {
  try {

    var child = null;
    var index = id + 1;
    var root = dsource.getNode("http://www.opensi.org/compta/lignes_ecriture");
    var children = root.getChildren();
    var found = false;

    while ((children.hasMoreElements()) && (! found) ) {
      var c = children.getNext();
      if (root.getChildIndex(c) == index) {
        child = c;
        found = true;
      }
    }

    return child;

  } catch (e) {
    recup_erreur(e);
  }
}


function maj_aff_solde() {
  try {
	
    document.getElementById('lettrage').collapsed = false;
    document.getElementById('total_debit_lett').value = nfs.format(debit);
    document.getElementById('total_credit_lett').value = nfs.format(credit);
    document.getElementById('total_solde_lett').value = nfs.format(solde);
		
  } catch (e) {
    recup_erreur(e);
  }
}


function razLettrage() {
  try {
	
    debit = 0;
    credit = 0;
    solde = 0;
    lettrage_en_cours = 0;
		listeop = new Array();
    document.getElementById('lettrage').collapsed = true;
		
  } catch (e) {
    recup_erreur(e);
  }
}


function lettrer() {
  try {

    if (lettrage_en_cours>0) {

			var list_op = '';
      var tree = get_tree();
      for (i=0;i<listeop.length;i++) {
        list_op += listeop[i]+',';
      }

			var qLet = new QueryHttp("Compta/Consultation/lettrer.tmpl");
			qLet.setParam('Numero_Compte', compte);
			qLet.setParam('Liste_Op', list_op);
			var result = qLet.execute();
			
			var errors = new Errors(result);

			if (errors.hasNext()) {		
				errors.show();
			}
			else {
			
				var lettre = result.responseXML.documentElement.getAttribute('Lettre');

      	for (i=0;i<tree.view.rowCount;i++) {
        	var tl = getCellText(tree,i,'lettre');
        	if (tl == '+') {
          	var child = get_child(i);
          	child.addTargetOnce(targetname('lettre'),lettre);
          	child.addTargetOnce(targetname('input_prop'),'enabled');
        	}
				}

      	razLettrage();
			}
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function validLettrage() {
  try {
	
		if (nmoins1!=1) {
			var qExo = new QueryHttp("Compta/Exercice/GetExercice.tmpl");
			var result = qExo.execute();		

    	var writeable = (result.responseXML.documentElement.getAttribute('Verrouille')=='0' && result.responseXML.documentElement.getAttribute('Cloture')=='0');

    	if (writeable) {

      	if (solde == 0) {
        	lettrer();
      	}
				else if (confirm("Le lettrage n'est pas équilibré. Voulez vous saisir une écriture de lettrage ?")) {

        	var page = "chrome://opensi/content/compta/user/consultation/lettrage.xul?"+ cookie();
        	page += "&NumCompte="+ compte;
        	page += "&solde="+ (0 - solde);
        	window.openDialog(page,'','chrome,modal,centerscreen', retourEcartLettrage);
        	reinit(1);
      	}
    	}
		}
		
  } catch (e) {
    recup_erreur(e);
  }
}


function retourEcartLettrage(opid) {
  try {
	
		ajouterListeOp(opid);
		lettrer();
	
	} catch (e) {
    recup_erreur(e);
  }
}


function ecritures() {
  try {
	
		if (nmoins1!=1){
    	var tree = get_tree();
			if (tree.view!=null && tree.currentIndex!=-1) {
    		window.location = "chrome://opensi/content/compta/user/saisie/menuSaisie.xul?"+ cookie() +"&Op_Id="+ getCellText(tree,tree.currentIndex,'opid');
			}
		}
		
  } catch (e) {
    recup_erreur(e);
  }
}


function plan_comptable() {
  try {

    var page = "chrome://opensi/content/config/util/liste_plan.xul?"+ cookie();
    window.openDialog(page,'','chrome,modal,centerscreen','1',retourPlanComptable);

	} catch (e) {
    recup_erreur(e);
  }
}


function retourPlanComptable(numeroCompte) {
  try {
	
		document.getElementById('compte').value = numeroCompte;
		document.getElementById('compte').focus();
	
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


function retour_exercice() {
  try {

    window.location = "chrome://opensi/content/compta/user/menu_dossier.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}


//ouverture de la fenetre de transfert de compte
function transfertcompte_window() {
  try {
	
		if (nmoins1!=1) {
			var tree = get_tree();
    	if (tree.view!=null && tree.view.selection.getRangeCount()>0) {
				var page = "chrome://opensi/content/compta/user/consultation/chgt_compte.xul?"+ cookie();
				var comptesrc = document.getElementById('compte').value;
  			window.openDialog(page,'','chrome,modal,centerscreen',comptesrc,transfertcompte);
    	}
		}

  } catch (e) {
    recup_erreur(e);
  }
}


//maj base avec le nouveau compte (inséré dans chgt_compte.xul)
function transfertcompte(comptesrc, comptedest, transAll) {
	try {

    var tree = get_tree();		
		var queryEdit = new QueryHttp("Compta/UpdateDatabase/update_compte.tmpl");

		queryEdit.setParam("CompteDest",comptedest);
  	queryEdit.setParam("CompteSrc",comptesrc);
		queryEdit.setParam("TransAll", transAll);

		var result = null;

    if (transAll) {
			//transfert de toutes les operations du compte
  	  
   	  result = queryEdit.execute();
		}
    else if (tree.view.selection.getRangeCount()>0) {

			var start = new Object();
			var end = new Object();
			var numRanges = tree.view.selection.getRangeCount();

			var operations = "";

			for (var t = 0; t < numRanges; t++){
	  		tree.view.selection.getRangeAt(t,start,end);
	  		for (var v = start.value; v <= end.value; v++){
	    		operations += getCellText(tree,v,'opid') +",";
				}
			}

 			queryEdit.setParam("Liste_Op", operations);

   	  result = queryEdit.execute();
    }	
		
		
		if (result!=null) {
			var errors = new Errors(result);

			if (errors.hasNext()) {		
				errors.show();
			}
			else {
				var nbOpTrans = result.responseXML.documentElement.getAttribute('NbOpTrans');
				showMessage(nbOpTrans +" opérations ont été transférées dans le compte "+ comptedest);
	  		loadCompte(transAll?comptedest:comptesrc);
			}
		}		

  } catch (e) {
  	recup_erreur(e);
  }
}

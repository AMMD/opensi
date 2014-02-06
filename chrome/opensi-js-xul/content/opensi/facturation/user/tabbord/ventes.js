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


var frm;
var tabClient="client";
var tabArticle="article";

var aFamille1 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_1');
var aFamille2 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_2');
var aFamille3 = new Arbre('Facturation/Stocks/liste-famillesArticle.tmpl', 'Famille_3');
var aMarques = new Arbre('Facturation/GetRDF/combo-marquesArticle.tmpl', 'Marque');

var selFamille1 = "0";
var selFamille2 = "0";
var selFamille3 = "0";

function init() {
  try {

    frm = ParamValeur('onglet');
    switch(frm) {
      case 'frmVtGlobal':
        loadfrmGlobal();
        break;
      case 'frmVtClient':
        loadfrmClient();
        break;
      case 'frmVtArticle':
        loadfrmArticle();
        break;
      case 'frmVtCommercial':
        loadfrmCommercial();
        break;
    }

  } catch (e) {
    recup_erreur(e);
  }
}

function init_rdf(param) {
  try {
    document.getElementById('tableau_bord').collapsed = false;
    document.getElementById('lblDates').collapsed = false;
    var paramlist = "&Page=Facturation/GetRDF/tableau_bord_ventes.tmpl&ContentType=xml";
    paramlist += param;
    load_rdf('lignes_tabbord', getUrlOpeneas(paramlist));
  } catch (e) {
    recup_erreur(e);
  }
}

function delete_rdf() {
  try {

    document.getElementById('tableau_bord').collapsed = true;
    document.getElementById('lblDates').collapsed = true;
    
    var database = document.getElementById('lignes_tabbord').database;
    var datasources = database.GetDataSources();
    while (datasources.hasMoreElements()) {
      var ds = datasources.getNext();
      database.RemoveDataSource(ds);
    }
		document.getElementById('lignes_tabbord').builder.rebuild();
		
  } catch (e) {
    recup_erreur(e);
  }
}

function reinit_rdf(param) {
  try {
    delete_rdf();
    init_rdf(param);
  } catch (e) {
    recup_erreur(e);
  }
}

function loadfrmGlobal() {
  try {
    document.getElementById('totCol').collapsed = true;
    document.getElementById('pourcentageCol').collapsed = true;
    init_rdf("&Global=1");
  } catch (e) {
    recup_erreur(e);
  }
}


function loadfrmClient() {
  try {
    document.getElementById('infos_client').collapsed = false;
		var paramlist = "&Page=Facturation/GetRDF/familles_client.tmpl&ContentType=xml";
  	load_rdf_async('FamilleClient', getUrlOpeneas(paramlist), initFamilleClient);
  } catch (e) {
    recup_erreur(e);
  }
}

function rechercherClient() {
  try {
		var url = "chrome://opensi/content/facturation/user/clients/rech_client.xul?"+ cookie();
    url += "&Nouv=false&Bloque=true";
    window.openDialog(url,'','chrome,modal,centerscreen',retourRechercherClient);
		if (document.getElementById("Client_Id").value != "") {
			chargerClient();
		}
	} catch (e) {
  	recup_erreur(e);
  }
}

function retourRechercherClient(codeClient) {
	try {
  	document.getElementById('Client_Id').value = codeClient;
	} catch (e) {
		recup_erreur(e);
	}
}

function chargerClient() {
  try {
		var client_id = document.getElementById("Client_Id").value;
		var corps = cookie() +"&Page=Facturation/Clients/getCoord.tmpl&ContentType=xml&Client_Id="+ urlEncode(client_id);
    requeteHTTP(corps,new XMLHttpRequest(),suite_chargerClient);
  } catch (e) {
    recup_erreur(e);
  }
}


function suite_chargerClient(httpRequest) {
  try {
  	
		var contenu = httpRequest.responseXML.documentElement;
		document.getElementById("Denomination").value = contenu.getAttribute("Denomination_Fact");
		document.getElementById("Adresse_Fact").value = contenu.getAttribute("Adresse_1_Fact");
		document.getElementById("Comp_Adresse_Fact").value = contenu.getAttribute("Adresse_2_Fact");
		document.getElementById("CP_Fact").value = contenu.getAttribute("Code_Postal_Fact");
		document.getElementById("Ville_Fact").value = contenu.getAttribute("Ville_Fact");
		document.getElementById("Pays_Fact").value = contenu.getAttribute("Pays_Fact"); 

    var param = "&Client=1&Client_Id="+ document.getElementById('Client_Id').value;
    reinit_rdf(param);

	} catch (e) {
  	recup_erreur(e);
  }
}

function selectTabClient(nomtab) {
  try {
  	tabClient = nomtab;
    switch(nomtab) {
      case 'client':
        if (isEmpty(document.getElementById('Client_Id').value)) {
          delete_rdf();
        } else {
          chargerClient();
        }
        break;
      case 'famille':
        var famille = document.getElementById('FamilleClient').value;
        if (isEmpty(famille)) {
          delete_rdf();
        } else {
          pressOnFamilleClient();
        }
        break;
    }
  } catch (e) {
    recup_erreur(e);
  }
}


function initFamille1() {
  try {

		document.getElementById('Famille_1').value = selFamille1;
		selFamille1 = "0";
		chargerFamilles2();

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles2() {
	try {
  	
		aFamille2.setParam('Parent_Id', document.getElementById('Famille_1').value);
		aFamille2.initTree(initFamille2);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille2() {
  try {

		document.getElementById('Famille_2').value = selFamille2;
		selFamille2 = "0";
		chargerFamilles3();

	} catch (e) {
		recup_erreur(e);
	}
}


function chargerFamilles3() {
	try {
  	
		aFamille3.setParam('Parent_Id', document.getElementById('Famille_2').value);
		aFamille3.initTree(initFamille3);

	} catch (e) {
		recup_erreur(e);
	}
}


function initFamille3() {
  try {

		document.getElementById('Famille_3').value = selFamille3;
		selFamille3 = "0";

	} catch (e) {
		recup_erreur(e);
	}
}


function initMarque() {
	try {

		document.getElementById('Marque').selectedIndex = 0;

	} catch (e) {
    recup_erreur(e);
  }
}



function initFamilleClient() {
	try {
		document.getElementById('FamilleClient').selectedIndex = 0;
	} catch (e) {
    recup_erreur(e);
  }
}

function pressOnFamilleClient() {
  try {
    var famille = document.getElementById('FamilleClient').value;
    if (isEmpty(famille)) {
      delete_rdf();
    } else {
      var param = "&Client=1&FamilleClient="+ urlEncode(famille);
      reinit_rdf(param);
    }
  } catch (e) {
    recup_erreur(e);
  }
}


function loadfrmArticle() {
  try {
    document.getElementById('infos_article').collapsed = false;

		aFamille1.initTree(initFamille1);
		aMarques.initTree(initMarque);

  } catch (e) {
    recup_erreur(e);
  }
}




function rechercherArticle() {
  try {

    var url = "chrome://opensi/content/facturation/user/stocks/rech_stocks.xul?"+ cookie();
    window.openDialog(url,'','chrome,modal,centerscreen',chargerArticle);

  } catch (e) {
    recup_erreur(e);
  }
}

function chargerArticle(reference) {
	try {    
    if (reference == null || isEmpty(reference)) {
      delete_rdf();
    } else {
    	var qArticle = new QueryHttp("Facturation/Stocks/getArticle.tmpl");
    	qArticle.setParam("Article_Id",reference);
		  var p = qArticle.execute();
		  
		  document.getElementById('Reference').value = p.responseXML.documentElement.getAttribute('Article_Id');
			document.getElementById('Designation').value = p.responseXML.documentElement.getAttribute('Designation');
			document.getElementById('lblMarque').value = p.responseXML.documentElement.getAttribute('Libelle_Marque');
			document.getElementById('lblFamille1').value = p.responseXML.documentElement.getAttribute('Libelle_Famille_1');
			document.getElementById('lblFamille2').value = p.responseXML.documentElement.getAttribute('Libelle_Famille_2');
			document.getElementById('lblFamille3').value = p.responseXML.documentElement.getAttribute('Libelle_Famille_3');
			
			document.getElementById('Marque').value = p.responseXML.documentElement.getAttribute('Marque');
			selFamille1 = p.responseXML.documentElement.getAttribute('Famille_1');
			selFamille2 = p.responseXML.documentElement.getAttribute('Famille_2');
			selFamille3 = p.responseXML.documentElement.getAttribute('Famille_3');
			initFamille1();
	
	    var param = "&Article=1";
	    param += "&Reference="+ document.getElementById('Reference').value;
	    reinit_rdf(param);
    }
  } catch (e) {
    recup_erreur(e);
  }
}


function selectTabArticle(nomtab) {
  try {
  	tabArticle = nomtab;
    switch(nomtab) {
      case 'article':
      	var article = document.getElementById('Reference').value;
        if (isEmpty(article)) {
          delete_rdf();
        } else {
          chargerArticle(article);
        }
        break;
      case 'famille':
        var famille1 = document.getElementById('Famille_1').value;
        var famille2 = document.getElementById('Famille_2').value;
        var famille3 = document.getElementById('Famille_3').value;
        if (famille1 == "0") {
          delete_rdf();
        } else {
          if (famille2 == "0") {
          	pressOnFamille1();
          } else {
          	if (famille3 == "0") {
          		pressOnFamille2();
          	} else {
          		pressOnFamille3();
          	}
          }
        }
        break;
      case 'marque':
        var marque = document.getElementById('Marque').value;
        if (marque == "0") {
          delete_rdf();
        } else {
          pressOnMarque();
        }
        break;
    }
  } catch (e) {
    recup_erreur(e);
  }
}



function pressOnMarque() {
  try {
    var marque = document.getElementById('Marque').value;
    if (marque == "0") {
      delete_rdf();
    } else {
      var param = "&Article=1&Marque="+ marque;
      reinit_rdf(param);
    }
  } catch (e) {
    recup_erreur(e);
  }
}



function pressOnFamille1() {
  try {
  	var famille1 = document.getElementById('Famille_1').value;
  	if (famille1=="0") {
  		delete_rdf();
  	} else {
  		var param = "&Article=1&Famille_1="+ famille1;
  		reinit_rdf(param);
  	}
		chargerFamilles2();

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnFamille2() {
  try {
  	var famille2 = document.getElementById('Famille_2').value;
  	if (famille2=="0") {
  		pressOnFamille1();
  	} else {
  		var param = "&Article=1&Famille_1="+ document.getElementById('Famille_1').value +"&Famille_2="+ famille2;
  		reinit_rdf(param);
  	}
		chargerFamilles3();

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnFamille3() {
  try {
  	var famille3 = document.getElementById('Famille_3').value;
  	if (famille3=="0") {
  		pressOnFamille2();
  	} else {
  		var param = "&Article=1&Famille_1="+ document.getElementById('Famille_1').value +"&Famille_2="+ document.getElementById('Famille_2').value +"&Famille_3="+ famille3;
  		reinit_rdf(param);
  	}

  } catch (e) {
    recup_erreur(e);
  }
}


function loadfrmCommercial() {
  try {
    document.getElementById('infos_commercial').collapsed = false;
		paramlist = "&Page=Facturation/GetRDF/liste_commerciaux.tmpl&ContentType=xml&tabbord=1";
  	load_rdf_async('Login_Resp', getUrlOpeneas(paramlist), initResp);		
  } catch (e) {
    recup_erreur(e);
  }
}

function initResp() {
  try { 
		document.getElementById('Login_Resp').selectedIndex = 0;
  } catch (e) {
    recup_erreur(e);
  }
}

function changeResp() {
  try {
    reinit_rdf("&Util_R=" + document.getElementById('Login_Resp').value);
  } catch (e) {
    recup_erreur(e);
  }
}


function majDates() {
  try {

    var date_debut = document.getElementById('date_debut').value;
    var date_fin = document.getElementById('date_fin').value;

    var paramlist = "&Periode=1";

    if (isEmpty(date_debut) && isEmpty(date_fin)) {
      return false;
    }
    if (isDate(date_debut)) {
      paramlist += "&Date_Debut=" + prepareDateJava(date_debut);
    } else if (! isEmpty(date_debut)){
      showWarning("Veuillez saisir un format de date correct (jj/mm/aaaa)");
      return false;
    }
    if (isDate(date_fin)) {
      paramlist += "&Date_Fin=" + prepareDateJava(date_fin);
    } else if (! isEmpty(date_fin)) {
      showWarning("Veuillez saisir un format de date correct (jj/mm/aaaa)");
      return false;
    }

    switch(frm) {
      case 'frmVtGlobal':
        paramlist += "&Global=1";
        break;
      case 'frmVtClient':
        paramlist += "&Client=1";
        switch (tabClient) {
        	case 'client':
        		var client = document.getElementById('Client_Id').value;
        		if (!isEmpty(client)) {
        			paramlist += "&Client_Id=" + urlEncode(client);
        		}
        		break;
        	case 'famille':
        		var famille = document.getElementById('FamilleClient').value
        		if (!isEmpty(famille)) {
      				paramlist += "&FamilleClient="+ urlEncode(famille);
        		}
        		break;
        }
        break;
      case 'frmVtArticle':
        paramlist += "&Article=1";
      	switch (tabArticle) {
      		case 'article':
      			var article = document.getElementById('Reference').value;
      			if (!isEmpty(article)) {
      				paramlist += "&Reference=" + urlEncode(article);
      			}
      			break;
      		case 'famille':
      			var famille1 = document.getElementById('Famille_1').value;
      			if (famille1 != "0") {
      				paramlist += "&Famille_1="+ famille;
      				var famille2 = document.getElementById('Famille_2').value;
				      if (famille2 != "0") {
				        paramlist += "&Famille_2="+ famille2;
				        var famille3 = document.getElementById('Famille_3').value;
					      if (famille3 != "0") {
					        paramlist += "&Famille_3="+ famille3;
					      }
				      }
      			}
      			break;
      		case 'marque':
      			var marque = document.getElementById('Marque').value;
				    if (marque != "0") {
				      paramlist += "&Marque="+ marque;
				    }
      			break;
      	}
        break;
      case 'frmVtCommercial':
        paramlist += "&Util_R=" + urlEncode(document.getElementById('Login_Resp').value);
        break;
    }

    reinit_rdf(paramlist);

  } catch (e) {
    recup_erreur(e);
  }
}

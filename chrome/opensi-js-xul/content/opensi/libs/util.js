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

/*
 * Bibliothèque de fonctions utiles à OpenSi
 */

// objet pour charger des librairies js à partir d'une autre fichier js
var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);

var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);


try {
  // Extraction des paramètres de la requête HTTP
  // et initialise la variable "paramOk" à false
  // s'il n'y a aucun paramètre.
  if (!location.search) {
    paramOk = false;
  }
  else {
    // éliminer le "?"
    var nReq = location.search.substring(1,location.search.length)
    // Extrait les différents paramètres avec leur valeur.
    nReq = nReq.split("&");
    var param = new FaitTableau(nReq.length-1)
    for (var i=0;i<(nReq.length);i++) {
      param[i] = nReq[i]
    }
  }
} catch (e) {
  recup_erreur(e);
}


function getVersion() {
  try {

    return "4.8.0-EC";

  } catch (e) {
    recup_erreur(e);
  }
}



function get_os() {
  try {

    return navigator.platform;

  } catch (e) {
    recup_erreur(e);
  }
}


function get_pref_module() {
  try {

    if (prefs.getPrefType("opensi.serveur.module") == prefs.PREF_STRING){
      return prefs.getCharPref("opensi.serveur.module");
    } else {
      return "Compta";
    }

  } catch (e) {
    recup_erreur(e);
  }
}

function get_pref_entreprise() {
  try {

    if (prefs.getPrefType("opensi.serveur.entreprise") == prefs.PREF_STRING){
      return prefs.getCharPref("opensi.serveur.entreprise");
    } else {
      return "";
    }

  } catch (e) {
    recup_erreur(e);
  }
}

function get_pref_login() {
  try {

    if (prefs.getPrefType("opensi.serveur.login") == prefs.PREF_STRING){
      return prefs.getCharPref("opensi.serveur.login");
    } else {
      return "";
    }

  } catch (e) {
    recup_erreur(e);
  }
}

function get_pref_password() {
  try {

    if (prefs.getPrefType("opensi.serveur.password") == prefs.PREF_STRING){
      return prefs.getCharPref("opensi.serveur.password");
    } else {
      return "";
    }

  } catch (e) {
    recup_erreur(e);
  }
}

function get_pref_login_check() {
  try {

    if (prefs.getPrefType("opensi.serveur.login_check") == prefs.PREF_BOOL){
      return prefs.getBoolPref("opensi.serveur.login_check");
    } else {
      return false;
    }

  } catch (e) {
    recup_erreur(e);
  }
}

function get_pref_password_check() {
  try {

    if (prefs.getPrefType("opensi.serveur.password_check") == prefs.PREF_BOOL){
      return prefs.getBoolPref("opensi.serveur.password_check");
    } else {
      return false;
    }

  } catch (e) {
    recup_erreur(e);
  }
}

function get_pref_acces_check() {
  try {

    if (prefs.getPrefType("opensi.serveur.acces_check") == prefs.PREF_BOOL){
      return prefs.getBoolPref("opensi.serveur.acces_check");
    } else {
      return false;
    }

  } catch (e) {
    recup_erreur(e);
  }
}

function get_pref_ssl() {
  try {

    if (prefs.getPrefType("opensi.serveur.ssl") == prefs.PREF_BOOL){
      return prefs.getBoolPref("opensi.serveur.ssl");
    } else {
      return false;
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function get_pref_protocol() {
  try {

		return (get_pref_ssl()?"https":"http");

  } catch (e) {
    recup_erreur(e);
  }
}


function get_pref_ipserveur() {
  try {

    if (prefs.getPrefType("opensi.serveur.addresse") == prefs.PREF_STRING){
      return prefs.getCharPref("opensi.serveur.addresse");
    } else {
      return "localhost";
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function get_pref_porttomcat() {
  try {

    if (prefs.getPrefType("opensi.serveur.port") == prefs.PREF_STRING){
      return prefs.getCharPref("opensi.serveur.port");
    } else {
      return "8080";
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function get_pref_servlet() {
  try {

    if (prefs.getPrefType("opensi.serveur.servlet") == prefs.PREF_STRING){
      return prefs.getCharPref("opensi.serveur.servlet");
    } else {
      return "OpenSI";
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function get_pref_mailcomptable() {
  try {

    if (prefs.getPrefType("opensi.mailcomptable") == prefs.PREF_STRING){
      return prefs.getCharPref("opensi.mailcomptable");
    } else {
      return "";
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function get_pref_logmail() {
  try {

    if (prefs.getPrefType("network.protocol-handler.app.mailto") == prefs.PREF_STRING) {
      return prefs.getCharPref("network.protocol-handler.app.mailto");
    } else {
      return "";
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function set_pref_module(value) {
  try {

    prefs.setCharPref("opensi.serveur.module",value );

  } catch (e) {
    recup_erreur(e);
  }
}

function set_pref_entreprise(value) {
  try {

    prefs.setCharPref("opensi.serveur.entreprise",value );

  } catch (e) {
    recup_erreur(e);
  }
}

function set_pref_login(value) {
  try {

    prefs.setCharPref("opensi.serveur.login",value );

  } catch (e) {
    recup_erreur(e);
  }
}

function set_pref_password(value) {
  try {

    prefs.setCharPref("opensi.serveur.password",value );

  } catch (e) {
    recup_erreur(e);
  }
}
function set_pref_login_check(value) {
  try {

    prefs.setBoolPref("opensi.serveur.login_check",value );

  } catch (e) {
    recup_erreur(e);
  }
}

function set_pref_password_check(value) {
  try {

    prefs.setBoolPref("opensi.serveur.password_check",value );

  } catch (e) {
    recup_erreur(e);
  }
}

function set_pref_acces_check(value) {
  try {

    prefs.setBoolPref("opensi.serveur.acces_check",value );

  } catch (e) {
    recup_erreur(e);
  }
}

function set_pref_ssl(value) {
  try {

    prefs.setBoolPref("opensi.serveur.ssl",value );

  } catch (e) {
    recup_erreur(e);
  }
}


function set_pref_ipserveur(value) {
  try {

    prefs.setCharPref("opensi.serveur.addresse",value );

  } catch (e) {
    recup_erreur(e);
  }
}


function set_pref_porttomcat(value) {
  try {

    prefs.setCharPref("opensi.serveur.port", value);

  } catch (e) {
    recup_erreur(e);
  }
}


function set_pref_servlet(value) {
  try {

    prefs.setCharPref("opensi.serveur.servlet", value);

  } catch (e) {
    recup_erreur(e);
  }
}


function set_pref_mailcomptable(value) {
  try {

    prefs.setCharPref("opensi.mailcomptable", value);

  } catch (e) {
    recup_erreur(e);
  }
}


function set_pref_logmail(value) {
  try {

    prefs.setCharPref("network.protocol-handler.app.mailto", value);

  } catch (e) {
    recup_erreur(e);
  }
}

/* res est une string transmise par l'element XUL d'origine de l'appel */
function launchExternalMailer(res) {
  try {

    if (res) {
      var url = "mailto:"+ res;
      var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
      var uri = ioService.newURI(url, null, null);
      var extProtocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
      extProtocolSvc.loadUrl(uri);
    }

  } catch (e) {
    recup_erreur(e);
  }
}


// =====================================================================


// ********************************************
// Récupération de paramétre d'une requéte HTTP
// ou récupération des données d'un formulaire.
// Auteur : Oznog (www.trucsweb.com)
// ********************************************

// NE PAS MODIFIER CE CODE
var paramOk = true;


/* création d'un tableau (array) aux dimensions du nombre de paramétres */
function FaitTableau(n) {
  try {

    this.length = n;
    for (var i = 0; i <= n; i++) {
      this[i] = 0
    }

    return this;

  } catch (e) {
    recup_erreur(e);
  }
}


/* récupération de la valeur d'une variable pour créer la variable en javascript */
function ParamValeur(nValeur) {
  try {

    if (paramOk) {
      var nTemp = "";
      for (var i=0;i<(param.length+1);i++) {
        if (param[i].substring(0,param[i].indexOf("=")) == nValeur)
          nTemp = param[i].substring(param[i].indexOf("=")+1,param[i].length)
      }
      return Decode(nTemp);
    } else {
      return '';
    }

  } catch (e) {
//    alert(e);
  }
}


/* Decoder la requete HTTP manuellement pour le signe (+) */
function Decode(tChaine) {
  try {

    while (true) {
      var i = tChaine.indexOf('+');
      if (i < 0) break;
      tChaine = tChaine.substring(0,i) +'%20'+ tChaine.substring(i + 1, tChaine.length);
    }
    return unescape(tChaine);

  } catch (e) {
    recup_erreur(e);
  }
}


// =====================================================================


/* recuperation du numero de session OpenEAS */
function cookie() {
	try {

  	return "S_="+ ParamValeur("S_") + nocache();

	} catch (e) {
    recup_erreur(e);
  }
}


function getDirServeur() {
    var url = get_pref_protocol() +"://";
    url += get_pref_ipserveur();
    url += ":"+ get_pref_porttomcat();
    url += "/"+ get_pref_servlet() +"/";
    return url;
}


/* retourne le repertoire d'entrée/sortie du serveur */
function getDirBuffer() {
  try {

    return getDirServeur() +"iobuffer/";

  } catch (e) {
    recup_erreur(e);
  }
}


/* retourne le repertoire de stockage des pdf */
function getDirPdf() {
  try {

    return getDirServeur() +"pdf/";

  } catch (e) {
    recup_erreur(e);
  }
}


function getUrlOpeneas(paramlist) {
  var retour = getDirServeur() +"openeas";
  if (paramlist != '') {
    retour += "?"+ cookie() + paramlist;
  }
  return retour;
}

/* ne pas utiliser */
function requeteHTTP(param,httpRequest,callbackFn,callbackParams) {
  try {

    if (httpRequest==undefined) {

      var p = new XMLHttpRequest();
      p.onload = null;
      p.open("POST",getUrlOpeneas(''), false);
      p.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      p.send(param);
      return p;

    }	else {

      httpRequest.onload = null;

      if (callbackFn==undefined) {
        httpRequest.open("POST",getUrlOpeneas(''), false);
      } else {
//        httpRequest.onreadystatechange = callbackFn;
//        httpRequest.onload = callbackFn;
        httpRequest.onload = function (aEvt) {
          callbackFn(httpRequest,callbackParams);
        };
        httpRequest.open("POST",getUrlOpeneas(''), true);
      }
      httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      httpRequest.send(param);
    }

  } catch (e) {
    alert("Le serveur est introuvable.\n Veuillez v\u00E9rifier son adresse et son port dans les param\u00E8tres avanc\u00E9s");
    alert(e);
    return p;
  }
}


/*  retourne le nombre de jours dans le mois correspondant à la saisie */
function nb_jours(mois,annee) {
  try {

  	switch (mois) {
    	case 1:
    	case 3:
    	case 5:
    	case 7:
    	case 8:
    	case 10:
    	case 12:	return 31;	break;
    	case 4:
    	case 6:
    	case 9:
    	case 11:	return 30; 	break;
    	case 2:  	return ((annee!=0 && (annee % 4)==0)?29:28);	break;
    	default: 	return false;
  	}

	} catch (e) {
    recup_erreur(e);
  }
}


/* récupération d'un cookie de la session OpenEAS */
function get_cookie(name) {
  try {

    var p = requeteHTTP(cookie() +"&Page=GetCookie.tmpl&ContentType=xml&Name="+ name);

    return p.responseXML.documentElement.getAttribute('cookie');

  } catch (e) {
    recup_erreur(e);
  }
}


function quit() {
	try {

		requeteHTTP(cookie() +"&Page=KillSession.tmpl&ContentType=xml");

  	window.open('chrome://opensi/content/login.xul','','chrome,resizable,minimizable,dialog=no');
  	window.parent.close();

	} catch (e) {
    recup_erreur(e);
  }
}


function parseIntBis(nb) {
  try {

		// parseInt en base 10
    return parseInt(nb, 10);

  } catch (e) {
    recup_erreur(e);
  }
}


/* récupération des erreurs provenant des exceptions */
function recup_erreur(err) {
  try {
	  err+=" erreur dans : "+window.location+"  : "+window.location.pathname;
	  var boucle=true;
	  var rec=recup_erreur;
	  while (boucle) {
	  	rec=rec.caller;
	  	rec!=null?err+="#"+rec.name:boucle=false;
	  }
    var corps = cookie() +"&Page=RapportDeBug.tmpl";
    corps += "&Err="+ urlEncode(err);
    corps += "&Version="+ getVersion() +"&Os="+ urlEncode(get_os()) +"&Gecko="+ geckoVersion();
    
		requeteHTTP(corps);

  } catch (e) {
    alert('erreur dans libs/util.js#recup_erreur : '+ e);
  }
}


/* écriture d'une trace client dans les logs */
function debug(msg) {
  try {

		requeteHTTP(cookie() +"&Page=Debug.tmpl&Msg="+ urlEncode(msg));

  } catch (e) {
    alert('erreur dans libs/util.js#debug : '+ e);
  }
}


/* renvoie une date au format yyyy:MM:dd */
function prepareDateJava(val) {
  try {

    var retour = "";

    if (val.length == 10) {
      retour = val.substring(6,10) +':'+ val.substring(3,5) +':'+ val.substring(0,2);
    }
		else if (val.length == 8) {
      retour = "20" + val.substring(6,8) +':'+ val.substring(3,5) +':'+ val.substring(0,2);
    }

    return retour;

  } catch (e) {
    recup_erreur(e);
  }
}


/* renvoie une periode au format 20yy:MM:01 */
function preparePeriodeJava(val) {
  try {

    return '20'+ val.substring(2,4) +':'+ val.substring(0,2) +':01';

  } catch (e) {
    recup_erreur(e);
  }
}


/* encode une chaine 'str' en url */
function urlEncode(str) {
  try {

		var url = new String(str);

		if (parseFloat(geckoVersion()) < 1.9) {
			url = escape(str);

			// signe euro
			url = url.replace(/%u20AC/g, '%80');

			// transformation des retours de ligne en \n
			url = url.replace(/%0A/g, '%5Cn');

			// encodage des '+'
			url = url.replace(/\+/g, '%2B');

			// encodage des 'apostrophes'
			url = url.replace(/%u2019/g, '\'');

			// encodage des 'grand -'
			url = url.replace(/%u2013/g, '-');
		}
		else {
			// encodage des '%'
			url = url.replace(/\%/g, '%25');
			// encodage des '+'
			url = url.replace(/\+/g, '%2B');
			// encodage des '&'
			url = url.replace(/\&/g, '%26');
			// encodage des '#'
			url = url.replace(/\#/g, '%23');

			// transformation des retours de ligne en \n
			url = url.replace(/\n/g, '%5Cn');
		}

		return url;

  } catch (e) {
    recup_erreur(e);
  }
}


/* enlève les caractères "invisibles" de début et de fin de la chaine 'str' */
function trim(str) {
  try {

	  var i = 0;
  	var lg = str.length;
	  var j = lg-1;

  	while (i<lg && ((str.charCodeAt(i)==9) || (str.charCodeAt(i)==10) || (str.charCodeAt(i)==13) || (str.charCodeAt(i)==32))) {
	  	i++;
	  }

  	while (j>i && ((str.charCodeAt(j)==9) || (str.charCodeAt(j)==10) || (str.charCodeAt(j)==13) || (str.charCodeAt(j)==32))) {
	  	j--;
	  }

	  return str.substring(i,j+1);

  } catch (e) {
    recup_erreur(e);
  }
}


/* renvoie un parametre http fictif pour forcer le rechargement de la page a partir du serveur */
function nocache() {
	try {

		var nocache = new Date();
		return "&NoCache="+ nocache.getMilliseconds();

	} catch (e) {
    recup_erreur(e);
  }
}


/* renvoie le nom du fichier contenu dans le chemin 'path' */
function getFileName(path) {
	try {

		var lastslash = path.lastIndexOf('/');
		var lastantislash = path.lastIndexOf('\\');
		var lastsep = (lastslash>lastantislash)?lastslash:lastantislash;

		return path.substring(lastsep+1,path.length);

	} catch (e) {
    recup_erreur(e);
  }
}


/* renvoie l'extension du fichier 'file' */
function getFileExtension(file) {
	try {

		var lastPoint = file.lastIndexOf('.');

		if (lastPoint==-1 || lastPoint==file.length-1) {
			return "";
		}
		else {
			return file.substring(lastPoint+1,file.length);
		}

	} catch (e) {
    recup_erreur(e);
  }
}


/* Message d'information */
function showMessage(msg) {
	try {

		var url = "chrome://opensi/content/popup/message.xul?"+ cookie() +"&Msg="+ urlEncode(msg);
		window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


/* Message d'alerte */
function showWarning(msg) {
	try {

		var url = "chrome://opensi/content/popup/warning.xul?"+ cookie() +"&Msg="+ urlEncode(msg);
		window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


/* Message d'erreur */
function showError(msg) {
	try {

		var url = "chrome://opensi/content/popup/error.xul?"+ cookie() +"&Msg="+ urlEncode(msg);
		window.openDialog(url,'','chrome,modal,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


/* évaluation d'une expression mathématique */
function calcExpr(expr) {
	try {

		return eval(expr.replace(/ /gi, ''));

	}	catch(e) {
		showWarning("Expression incorrecte !");
		return expr;
	}
}


/* fenêtre de choix d'un fichier */
function fileChooser(mode, suggestedFile) {
	try {

		var nsIFilePicker = Components.interfaces.nsIFilePicker;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);

		if (mode=="save") {
			var pickerMode = nsIFilePicker.modeSave;
			var titre = "Enregistrer sous ...";
		}
		else if (mode=="open") {
			var pickerMode = nsIFilePicker.modeOpen;
			var titre = "Ouvrir un fichier";
		}
		else if (mode=="folder") {
			var pickerMode = nsIFilePicker.modeGetFolder;
			var titre = "Ouvrir un répertoire";
		}

		fp.init(window, titre, pickerMode);
		fp.appendFilters(nsIFilePicker.filterAll); // filtre obligatoire sinon ca plante
		fp.defaultString = suggestedFile;

		var res = fp.show();

		if (res == nsIFilePicker.returnOK){
  		return fp.file;
		}
		else {
			return null;
		}

	} catch (e) {
    recup_erreur(e);
  }
}


/* téléchargement d'un fichier depuis l'url 'url' dans le fichier local 'file' */
function downloadFile(url, file) {
	try {

		var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI(url, "", null);
		var wp = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Components.interfaces.nsIWebBrowserPersist);

		wp.saveURI(uri,null,null,null,null,file);

	} catch (e) {
    recup_erreur(e);
  }
}


/* ouverture de la page d'aide 'page' du guide opensi */
function aide(page) {
	try {

		var url = getDirServeur() +"aide/"+ (page==null || page==""?"aide-indisponible.htm":page);		
		window.openDialog(url,'','chrome,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


/* ouverture de la page de raccourcis clavier 'page' */
function raccourcis(page) {
	try {

		var url = getDirServeur() +"raccourcis/"+ page;
		window.openDialog(url,'','chrome,centerscreen');

	} catch (e) {
    recup_erreur(e);
  }
}


/* fonctions de compatibilité entre les versions 1.0 et 1.5 de firefox */
function geckoVersion() {
  var versionindex=navigator.userAgent.indexOf("rv:1")+3;
  if (parseInt(navigator.userAgent.charAt(versionindex))>=1) {
    return navigator.userAgent.substr(versionindex,3);
  } else {
    return false;
  }
}

function getCellText(tree,idligne,idcolumn) {

	return tree.view.getCellText(idligne,tree.columns.getNamedColumn(idcolumn)); // FF1.5+ et XulRunner
}

function getCellValue(tree,idligne,idcolumn) {
  return tree.view.getCellValue(idligne,tree.columns.getNamedColumn(idcolumn)); // FF1.5+ et XulRunner
}


function bloquerElements(type) {
	try {
		var liste = document.getElementsByTagName(type);
		for (var i=0; i<liste.length; i++) {
			liste[i].disabled=true;
		}
	} catch (e) {
		recup_erreur(e);
	}
}

function bloquerInterface() {
	try {
		
		bloquerElements("textbox");
		bloquerElements("menulist");
		bloquerElements("tree");
		bloquerElements("button");
		bloquerElements("checkbox");
		bloquerElements("listbox");
		bloquerElements("radiogroup");
		
	} catch (e) {
		recup_erreur(e);
	}
}

function debloquerBoutonsMenu() {
	try {
		var liste = document.getElementsByTagName('button');
		for (var i=0; i<liste.length; i++) {
			if (liste[i].getAttribute('class')=='bouton_menu') {
				liste[i].disabled=false;
			}
		}
	} catch (e) {
		recup_erreur(e);
	}
}

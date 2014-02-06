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

//récupération des anciennes valeurs
if (get_pref_login()!="") {
	try {
	
		var hostname = "https://login.opensi.eu";
		var formSubmitURL = "https://login.opensi.eu";
		var httprealm = null;
		var oldentreprise =get_pref_entreprise();
		var oldlogin =get_pref_login();
		var oldpassword =get_pref_password();
		if (oldpassword=="") {
			oldpassword=" ";
		}
		var oldusername =oldentreprise +"---" +oldlogin;
		
	   	var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
	                         .getService(Components.interfaces.nsILoginManager);
	                             
		var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
		                                             Components.interfaces.nsILoginInfo,
		                                             "init");
		  
		var oldloginInfo = new nsLoginInfo(hostname, formSubmitURL, httprealm, oldusername, oldpassword,
		                                'login', 'password');
		                                
		myLoginManager.addLogin(oldloginInfo);
		set_pref_entreprise("");
		set_pref_login("");
		set_pref_password("");
		
	
	}
	catch (ex) {
	}
}

//récupération mot de passe dans gestionnaire de mot de passe
try {
	var hostname = "https://login.opensi.eu";
	var formSubmitURL = "https://login.opensi.eu";
	var httprealm = null;
   var oldusername ="";
   var oldentreprise ="";
   var oldlogin ="";
   var oldpassword ="";

   // Obtient le gestionnaire d'identification 
   var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
                         .getService(Components.interfaces.nsILoginManager);
                             
	var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
	                                             Components.interfaces.nsILoginInfo,
	                                             "init");
	  
   // Recherche des utilisateurs pour les paramètres donnés
   var logins = myLoginManager.findLogins({}, hostname, formSubmitURL, httprealm);
   
   // Trouve l'utilisateur dans le tableau d'objets nsILoginInfo renvoyé
   for (var i = 0; i < logins.length; i++) {
   		 oldusername = logins[i].username;
   		 var reg=new RegExp("---", "g");
     	 ident = oldusername.split(reg);
     	 oldentreprise = ident[0];
     	 oldlogin = ident[1];
         oldpassword = logins[i].password;
         break;
   }
   
	var oldloginInfo = new nsLoginInfo(hostname, formSubmitURL, httprealm, oldusername, oldpassword,
	                                'login', 'password');
}	                           
catch(ex) {
   // Ceci se produira uniquement s'il n'y a pas de classe de composant nsILoginManager
   // ou annulation au moment du mot de passe manager
}
                                

var gTimeoutConnect = null;
var nSession;

function init() {
  try {

		var x = (screen.width / 2) - 325;
    var y = (screen.height / 2) - 219;
		window.innerWidth = 651;
		window.innerHeight = 438;
    window.moveTo(x,y);

    document.getElementById('version').value = "v. "+ getVersion();
    if (get_pref_login_check()) {
      document.getElementById('login_check').checked = true;
      if (get_pref_password_check()) {
        document.getElementById('password_check').checked = true;
      }
      else {
        document.getElementById('password_check').removeAttribute("Checked");
      }
    }
    else {
      document.getElementById('login_check').removeAttribute("Checked");
    }


		var module = get_pref_module();

    document.getElementById('liste').value = module;

		if (module=='Superviseur') {
      affichPassword();
    }
		else {
      affichTout();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function affiche_param() {
  try {

    document.getElementById('parambutton').collapsed = true;
    document.getElementById('paramavances').collapsed = false;
		document.getElementById('nouveautes').collapsed = true;
    document.getElementById('ipserveur').value = get_pref_ipserveur();
    document.getElementById('servlet').value = get_pref_servlet();
    document.getElementById('porttomcat').value = get_pref_porttomcat();
    document.getElementById('is_ssl').checked = get_pref_ssl();

  } catch (e) {
    recup_erreur(e);
  }
}


function checkLogin() {
  try {

		var oklog = true;

    if (!document.getElementById('paramavances').collapsed) {

			var ipserveur = document.getElementById('ipserveur');
    	var porttomcat = document.getElementById('porttomcat');
    	var servlet = document.getElementById('servlet');

    	if (isEmpty(ipserveur.value) || isEmpty(porttomcat.value)) {
      	alert("Vous devez préciser l'adresse et le port du serveur OpenSi");
      	ipserveur.focus();
				oklog = false;
    	}
    	else if (isEmpty(servlet.value)) {
      	alert("Vous devez préciser le nom du servlet sur le serveur OpenSi");
      	porttomcat.focus();
				oklog = false;
    	}
			else {
				set_pref_ipserveur(document.getElementById('ipserveur').value);
      	set_pref_porttomcat(document.getElementById('porttomcat').value);
      	set_pref_servlet(document.getElementById('servlet').value);
      	set_pref_ssl(document.getElementById('is_ssl').checked);
			}
    }

		if (oklog) {
			var entreprise = document.getElementById('Entreprise');
			var login = document.getElementById('login');
    	var passwd = document.getElementById('password');

			if (isEmpty(login.value)) {
      	login.focus();
    	}
			else if (isEmpty(passwd.value)) {
      	passwd.focus();
    	}
			else if (isEmpty(entreprise.value)) {
      	entreprise.focus();
    	}
			else {
    		var corps = "Page=Login.tmpl&ContentType=xml&Login="+ login.value +"&Password="+ urlEncode(passwd.value) +"&Entreprise="+ entreprise.value;

				requeteHTTP(corps,new XMLHttpRequest(),checkLogin2);
				document.getElementById('ok').disabled = true;
				document.getElementById( 'label_connect_msg' ).value = 'Connexion en cours...';
				if (gTimeoutConnect) clearTimeout(gTimeoutConnect);
				gTimeoutConnect = setTimeout("timeoutConnect()", 6000);
			}
		}

  } catch(e) {
    recup_erreur(e);
  }
}

function timeoutConnect() {
	document.getElementById( 'label_connect_msg' ).value = "Connexion au serveur impossible. Vérifiez vos paramètres.";
	document.getElementById('ok').disabled = false;
}

function checkLogin2(httpRequest) {
  try {
		clearTimeout( gTimeoutConnect );
    // if(httpRequest.readyState != 4) return false;
    //4==document completement charge; 1==en cours; 2==charge; 3==interactif 0==initialise

    if (httpRequest.status == "0") {
      enableAll();
      timeoutConnect();
      return false;
    }

    if (httpRequest.status != "200") {
      alert("Réception erreur "+ httpRequest.status);
      enableAll();
      timeoutConnect();
 	 	} else {

     var contenu=httpRequest.responseXML;
      if (contenu == null) {
        alert("Le serveur nécessite une connexion sécurisée. Veuillez cocher la case correspondante dans les paramètres avancés.");
        window.location = "chrome://opensi/content/login.xul";
        return -1;
      } else {

        var session = contenu.documentElement;
        nSession = session.getAttribute('cookie');

        if (nSession=="") {
          alert('Login incorrect');
          window.location = "chrome://opensi/content/login.xul";
          return -1;
        } else {

          var user = session.getElementsByTagName('user')[0];
          var versionok = user.getAttribute('databaseversion')=="true";
          var versionServeur = user.getAttribute('releasename');

					versionok=true; // a enlever quand la gestion de la version de la base de données sera fonctionnelle
					if (!versionok) {
						versionok=confirm("la base de données n'est pas cohérente avec votre version d'OpenSi, veuillez contacter votre administrateur,     êtes vous sûr de vouloir continuer ?");
					}
          if (!versionok) {
 				    enableAll();
			      timeoutConnect();
          }
					
					if (versionServeur!=getVersion()) {
            window.location = "update.html?versionServeur="+ versionServeur +"&urlupdate="+ user.getAttribute('urlupdate');						
					}
					else {
            checkLogin3(user);
          }
        }
      }
    }

  } catch(e) {
		recup_erreur(e);
    enableAll();
  }
}


function checkLogin3(user) {
  try {

		var vtest = user.getAttribute('vtest');
    var utilisateur = user.getAttribute('id');
		
    if (isEmpty(utilisateur)) {
      alert('Login incorrect');
      window.location = "chrome://opensi/content/login.xul";
      return -1;
    } else {
      var url="";
      var root = user.getAttribute('root');
      var choix = document.getElementById('liste').value;
      set_pref_module(choix) ;

      if (root == "true") {
        switch (choix) {
          case 'Configuration' :
            url = "chrome://opensi/content/config/main.xul";
            break;
          case 'Superviseur' :
            url = "chrome://opensi/content/superviseur/main.xul";
            break;
          default:
            alert('Login incorrect');
            window.location = "chrome://opensi/content/login.xul";
            return -1;
            break;
          }
			}
			else {
				var entreprise = document.getElementById('Entreprise').value;
			  var login = document.getElementById('login').value;
		    var password = document.getElementById('password').value;
				var administrateur = user.getAttribute('administrateur');
			
		    /* traite le cas de mémorisation d'identification */
		    if ( document.getElementById('login_check').checked) {
		        username = document.getElementById('Entreprise').value + '---' + document.getElementById('login').value;
		    
				var newloginInfo = new nsLoginInfo(hostname, formSubmitURL, httprealm, username, " ",
                                'login', 'password');

		      set_pref_login_check(document.getElementById('login_check').checked);
		      if ( document.getElementById('password_check').checked) {
		        set_pref_password_check(document.getElementById('password_check').checked);
				var newloginInfo = new nsLoginInfo(hostname, formSubmitURL, httprealm, username, document.getElementById('password').value,
                                'login', 'password');
                if (username!=oldusername || document.getElementById('password').value!=oldpassword) {
                    try {
                
                	if (oldusername!="") {
						myLoginManager.removeLogin(oldloginInfo);
					}
                	myLoginManager.addLogin(newloginInfo);
                	}
                	catch (ex) {
                	}
                }
                                
		      }
		      else {
		        set_pref_password_check(false);
		        if (username!=oldusername) {
		        try {
		        	if (oldusername!="") {
						myLoginManager.removeLogin(oldloginInfo);
					}
		         	myLoginManager.addLogin(newloginInfo);
		         	}
                	catch (ex) {
                	}
		         	
		       }
		       
		    }
		    }
		    else {        /* sinon, supprime les informations des préférences */
		    try {
		      	if (oldusername!="") {
					myLoginManager.removeLogin(oldloginInfo);
				}
			}
                	catch (ex) {
                	}
				
		    
		      set_pref_login("");
			  set_pref_entreprise("");
		      set_pref_login_check(false);
		      set_pref_password("");
		      set_pref_password_check(false);
		    }
				var url;
        switch (choix) {
          case 'Compta':
            url = "chrome://opensi/content/compta/user/main.xul";
            break;
          case 'Facturation':
            url = "chrome://opensi/content/facturation/user/main.xul";
            break;
					case 'CRM':
            url = "chrome://opensi/content/crm/main.xul";
            break;
		  		case 'Web':
            url = "chrome://opensi/content/web_manager/main.xul";
            break;
          case 'Configuration':
            url = "chrome://opensi/content/config/main.xul";
            break;
          case 'Utilisateurs':
						if (administrateur=="true") {
            	url = "chrome://opensi/content/utilisateurs/main.xul";
						}
						else {
							alert("Vous n'avez pas les droits d'accès au module Gestion des utilisateurs");
            	window.location = "chrome://opensi/content/login.xul";
            	return -1;
						}
						break;
          default:
            alert('Login incorrect');
            window.location = "chrome://opensi/content/login.xul";
            return -1;
            break;
        }
      }

			window.location = url +"?"+ nSession +"&Utilisateur="+ utilisateur +"&VTest="+ vtest;
    }

  } catch(e) {
		recup_erreur(e);
    enableAll();
  }
}


function keypress(e) {
  try {

    if (e.keyCode==13) {
      checkLogin();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function enableAll() {
  try {

    document.getElementById('ok').disabled = false;

  } catch (e) {
    recup_erreur(e);
  }
}


function affichPassword() {
  try {

    document.getElementById('login').collapsed = true;
		document.getElementById('Entreprise').collapsed = true;
    document.getElementById('logintexte').collapsed = true;
		document.getElementById('lblEntreprise').collapsed = true;
    document.getElementById('login').disabled = true;
		document.getElementById('Entreprise').disabled = true;
    document.getElementById('password').value="";
    document.getElementById('password').focus();
    document.getElementById('login_check').collapsed=true;
    document.getElementById('password_check').collapsed=true;
		document.getElementById('login').value = "root";
		document.getElementById('Entreprise').value = "root";
    check_login();

	} catch (e) {
    recup_erreur(e);
  }
}


function check_login() {
  try {

    document.getElementById('password_check').disabled = !document.getElementById('login_check').checked; 
		
	} catch (e) {
    recup_erreur(e);
  }
}


function affichTout() {
  try {

		if (document.getElementById('login').value == "root") {
      document.getElementById('login').value = "";
			document.getElementById('Entreprise').value = "";
    }
    document.getElementById('login').disabled = false;
		document.getElementById('Entreprise').disabled = false;
    document.getElementById('login').collapsed = false;
    document.getElementById('logintexte').collapsed = false;
		document.getElementById('lblEntreprise').collapsed = false;
		document.getElementById('Entreprise').collapsed = false;
    document.getElementById('login').focus();
    if ( document.getElementById('login_check').checked) {
    	document.getElementById('Entreprise').value = oldentreprise;
     	document.getElementById('login').value = oldlogin;
      if ( document.getElementById('password_check').checked) {
         if (oldpassword!=" ") {
    		document.getElementById('password').value = oldpassword;
         }
         else {
    		document.getElementById('password').value = "";
          }
         
      }
      else {
        document.getElementById('password').focus();
      }
    }
    check_login();
    document.getElementById('login_check').collapsed = false;
    document.getElementById('password_check').collapsed = false;

  } catch (e) {
    recup_erreur(e);
  }
}


function opensiweb() {
  window.open('http://www.opensi.org');
}

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


var aClientsWeb = new Arbre("Facturation/GetRDF/liste-clientsWeb.tmpl", "tree-web");
var arbre_sites = new Arbre("Facturation/GetRDF/liste_sites_web.tmpl","menulist_sites");

function initWeb() {
  try {
    arbre_sites.initTree(fin_initSites);

    aClientsWeb.setParam("Client_Id", currentClient);
    aClientsWeb.initTree();
    nouveauClientWeb();

  } catch (e) {
    recup_erreur(e);
  }
}

function fin_initSites() {
  try {

    document.getElementById('menulist_sites').selectedIndex = 0;

  } catch (e) {
    recup_erreur(e);
  }
}

function nouveauClientWeb() {
  try {

    // initialisation valeurs par défaut
    ref_client=0;
    document.getElementById('menulist_sites').selectedIndex = 0;
    document.getElementById('Client_Web_Id').value = 0;
    document.getElementById('Login').value = "";
    document.getElementById('Password').value = "";
    document.getElementById('Remise_Web').value = 0;
    document.getElementById('bNouveauClientWeb').collapsed = true;
    document.getElementById('bModifierClientWeb').collapsed = true;
    document.getElementById('bCreerClientWeb').collapsed = false;

    document.getElementById('menulist_sites').disabled = false;
    document.getElementById('Login').disabled = false;


  } catch (e) {
    recup_erreur(e);
  }
}


function enregistrerClientWeb(mode) {
  try {

    var site_id = document.getElementById('menulist_sites').value;
    var login = document.getElementById('Login').value;
    var password = document.getElementById('Password').value;
    var remise_web = document.getElementById('Remise_Web').value;
    var ref_client = document.getElementById('Client_Web_Id').value;
    var actif = document.getElementById('ValActif').checked?1:0;
    var corps;

    if (mode=="C") {
      corps = cookie() +"&Page=Facturation/Clients/creerClientWeb.tmpl&ContentType=xml";
    }
    else {
      corps = cookie() +"&Page=Facturation/Clients/modifierClientWeb.tmpl&ContentType=xml&ClientWeb_Id="+ currentClientWeb;
    }

    corps += "&Client_Id="+ urlEncode(currentClient) +"&Site_Id="+ urlEncode(site_id) +"&Login="+ urlEncode(login) +"&Password="+  urlEncode(password);
    corps += "&Remise_Web="+ urlEncode(remise_web) +"&Client_Web_Id="+ urlEncode(ref_client) +"&Actif="+ urlEncode(actif);
    if (isEmpty(site_id)) { showWarning("Veuillez spécifier le site !"); }
    else if (isEmpty(login)) { showWarning("Veuillez spécifier le login"); }
    else if (isEmpty(password)) { showWarning("Veuillez spécifier le mot de passe !"); }
    else if (isEmpty(remise_web)) { showWarning("Veuillez spécifier la remise web !"); }
    else if (!isTaux(remise_web)) { showWarning("Veuillez spécifier un taux de remise !"); }
    else {
      var qVerifClientWeb = new QueryHttp("Facturation/Clients/verifClientWeb.tmpl");
      qVerifClientWeb.setParam("Site_Id",site_id);
      qVerifClientWeb.setParam("Login",login);
      qVerifClientWeb.setParam("Actif",actif);
      qVerifClientWeb.setParam("Client_Id",currentClient);
      qVerifClientWeb.setParam("Client_Web_Id",ref_client);

      var p= qVerifClientWeb.execute();
      var reponse = p.responseXML.documentElement.getAttribute('reponse');
      if (reponse=='Actif') { showWarning("Le client possède déjà un login actif sur ce site !"); }
      else if (reponse=='Login') { showWarning("Ce login est déjà utilisé sur le site séléctionné !"); }
      else {
        var p = requeteHTTP(corps);

	      if (mode=="C") {
	        contenu = p.responseXML.documentElement;

	        currentClientWeb = contenu.getAttribute('Client_Web_Id');
	        document.getElementById('bCreerClientWeb').collapsed = true;
	        document.getElementById('bModifierClientWeb').collapsed = false;
	        document.getElementById('bNouveauClientWeb').collapsed = false;
          document.getElementById('menulist_sites').disabled = true;
          document.getElementById('Login').disabled = true;
	      }

	      aClientsWeb.initTree();
        nouveauClientWeb();
	    }
	  }

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnTreeClientWeb(ev) {
  try {

    if (ev.keyCode==13) {
      chargerClientWeb();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function chargerClientWeb() {
  try {

    if (aClientsWeb.isSelected()) {

      currentClientWeb = aClientsWeb.getSelectedCellText("ColClient_Web_Id");
      document.getElementById('menulist_sites').setAttribute('label',aClientsWeb.getSelectedCellText("ColNom_Site"));
      document.getElementById('menulist_sites').value = aClientsWeb.getSelectedCellText("ColSite_Id");
      document.getElementById('Login').value = aClientsWeb.getSelectedCellText("ColLogin");
      document.getElementById('Password').value = aClientsWeb.getSelectedCellText("ColPassword");
      document.getElementById('Remise_Web').value = aClientsWeb.getSelectedCellText("ColRemiseWeb");
      document.getElementById('Client_Web_Id').value = aClientsWeb.getSelectedCellText("ColClient_Web_Id");
      document.getElementById('ValActif').setAttribute("checked",aClientsWeb.getSelectedCellText("ColValActif")==1?true:false);

      document.getElementById('bModifierClientWeb').collapsed = false;
      document.getElementById('bNouveauClientWeb').collapsed = false;
      document.getElementById('bCreerClientWeb').collapsed = true;
      document.getElementById('menulist_sites').disabled = true;
      document.getElementById('Login').disabled = true;
    }

  } catch (e) {
    recup_erreur(e);
  }
}

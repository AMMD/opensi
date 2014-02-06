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


function init() {
  try {

    window.resizeTo(500,400);

		document.getElementById('Message').childNodes.item(0).nodeValue = ParamValeur('Msg');
  } catch (e) {
    alert('erreur dans popup/error.js#init : '+ e);
  }
}


function aff_err() {
  alert(ParamValeur('Err'));
}

function envoyerRapport() {
	try {
    var description = document.getElementById('description').value;
    if (isEmpty(description)) {
      alert("veuillez décrire les dernières manipulations que vous avez effectuées avant que l'erreur ne se produise");
      document.getElementById('description').focus();
    } else {
  		var corps = cookie() +"&Page=RapportDeBug.tmpl&Msg="+ urlEncode(ParamValeur('Msg')) +"&Err="+ urlEncode(ParamValeur('Err'));
	  	corps += "&Description="+ urlEncode(description);
		  corps += "&Version="+ getVersion() +"&Os="+ get_os();

      requeteHTTP(corps,new XMLHttpRequest(),suiteEnvoiRapport);
	  }
	} catch (e) {
    alert('erreur dans popup/error.js#envoyerRapport : '+ e);
  }
}

function suiteEnvoiRapport(httpRequest) {
  try {

    alert("Le rapport de bug a été envoyé !");
    window.close();

	} catch (e) {
    alert('erreur dans popup/error.js#suiteEnvoiRapport : '+ e);
  }
}

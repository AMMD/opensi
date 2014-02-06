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
 * bibliothèque de fonctions pour l'interrogation du serveur
 *
 * charger util.js préalablement
 */


jsLoader.loadSubScript("chrome://opensi/content/libs/param.js");


function QueryHttp(page) {

	this.url = cookie() +"&Page="+ page +"&ContentType=xml";
	this.params = "";
	this.plist = new Array();
}


QueryHttp.prototype.execute = function(callBackFunction, callBackParams) {

	this.buildUrlParam();

	var httpRequest = new XMLHttpRequest();

	if (callBackFunction==undefined) {

		httpRequest.onload = null;
    httpRequest.open("POST", getUrlOpeneas(''), false);
		httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    httpRequest.send(this.url + this.params);

		if (httpRequest.responseXML.documentElement.getAttribute('sys-queryhttp-error')==1) {
			alert("Votre session a expiré. Veuillez vous reconnecter.");
			quit();
		}

    return httpRequest;
	}
	else {

		httpRequest.onload = function (aEvt) {
			if (httpRequest.responseXML.documentElement.getAttribute('sys-queryhttp-error')==1) {
				alert("Votre session a expiré. Veuillez vous reconnecter.");
				quit();
			}
			else {
				callBackFunction(httpRequest,callBackParams);
			}
		};
		httpRequest.open("POST", getUrlOpeneas(''), true);
		httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		httpRequest.send(this.url + this.params);
	}
}


QueryHttp.prototype.setParam = function(pname, pvalue) {

	var param = this.getParam(pname);

	if (param==undefined) {
		this.addParam(pname, pvalue);
	}
	else {
		param.setValue(pvalue);
	}
}


QueryHttp.prototype.setParamById = function(pname, pid) {

	this.setParam(pname, document.getElementById(pid).value);
}


QueryHttp.prototype.setFullParamById = function(pid) {

	this.setParam(pid, document.getElementById(pid).value);
}


QueryHttp.prototype.addParam = function(pname, pvalue) {

	this.plist.push(new Param(pname, pvalue));
}


QueryHttp.prototype.removeParam = function(pname) {

	var trouve = false;
	var i = 0;

	while (!trouve && i<this.plist.length) {

		trouve = (this.plist[i].pname==pname);
		i++;
	}

	if (trouve) {
		this.plist.splice(i-1,1);
	}
}


QueryHttp.prototype.getParam = function(pname) {

	var trouve = false;
	var i = 0;

	while (!trouve && i<this.plist.length) {
		trouve = this.plist[i].pname==pname;
		i++;
	}

	return (trouve?this.plist[i-1]:undefined);
}


QueryHttp.prototype.clearParams = function() {

	this.plist.length = 0;
}


QueryHttp.prototype.buildUrlParam = function() {

	this.params = "";

	for (var i=0; i<this.plist.length; i++)
		this.params += this.plist[i].getUrlParam();
}





function Errors(queryResult) {

	this.currentError = null;
	this.iterator = -1;
	
	this.errors = queryResult.responseXML.documentElement.getElementsByTagName("Error");
}


/*  */
Errors.prototype.hasNext = function() {
	
	this.currentError = this.errors.item(++this.iterator);
	return this.currentError!=null;	
}


/*  */
Errors.prototype.show = function() {
	
	showWarning(this.getMessage());
}


/*  */
Errors.prototype.getCode = function() {
	
	return this.currentError.getAttribute('Code');
}


/*  */
Errors.prototype.getMessage = function() {
	
	return this.currentError.getAttribute('Message');
}








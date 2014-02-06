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
 * bibliothèque de fonctions pour la gestion d'arbres RDF.
 *
 * charger util.js préalablement
 */


jsLoader.loadSubScript("chrome://opensi/content/libs/load_rdf.js");
jsLoader.loadSubScript("chrome://opensi/content/libs/param.js");


function Arbre(tmpl, id) {

	this.urlRdf = getUrlOpeneas("&Page="+ tmpl +"&ContentType=xml");
	this.treeId = id;
	this.params = "";
	this.plist = new Array();
}


Arbre.prototype.initTree = function(callBackFunction, callBackParams) {

	if (this.isSelected()) {
		this.select(-1);
	}

	this.deleteTree();
	this.buildUrlParam();

	if (callBackFunction==undefined) {
  	load_rdf(this.treeId, this.urlRdf + this.params);
	}
	else {
		load_rdf_async(this.treeId, this.urlRdf + this.params, callBackFunction, callBackParams);
	}
}


Arbre.prototype.deleteTree = function() {

	var database = document.getElementById(this.treeId).database;
  var datasources = database.GetDataSources();
  while (datasources.hasMoreElements()) {
  	var ds = datasources.getNext();
    database.RemoveDataSource(ds);
  }
	document.getElementById(this.treeId).builder.rebuild();
}


Arbre.prototype.setParam = function(pname, pvalue) {

	var param = this.getParam(pname);

	if (param==undefined) {
		this.addParam(pname, pvalue);
	}
	else {
		param.setValue(pvalue);
	}
}


Arbre.prototype.setParamById = function(pname, pid) {

	this.setParam(pname, document.getElementById(pid).value);
}


Arbre.prototype.setFullParamById = function(pid) {

	this.setParam(pid, document.getElementById(pid).value);
}


Arbre.prototype.addParam = function(pname, pvalue) {

	this.plist.push(new Param(pname, pvalue));
}


Arbre.prototype.removeParam = function(pname) {

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


Arbre.prototype.getParam = function(pname) {

	var trouve = false;
	var i = 0;

	while (!trouve && i<this.plist.length) {
		trouve = this.plist[i].pname==pname;
		i++;
	}

	return (trouve?this.plist[i-1]:undefined);
}


Arbre.prototype.clearParams = function() {

	this.plist.length = 0;
}


Arbre.prototype.nbParams = function() {

	return this.plist.length;
}


Arbre.prototype.buildUrlParam = function() {

	this.params = "";

	for (var i=0; i<this.plist.length; i++)
		this.params += this.plist[i].getUrlParam();
}


Arbre.prototype.select = function(numline) {
	document.getElementById(this.treeId).view.selection.select(numline);
}

Arbre.prototype.selectAll = function() {
	if (this.isNotNull()) {
		document.getElementById(this.treeId).view.selection.selectAll();
	}
}

Arbre.prototype.clearSelection = function() {
	if (this.isNotNull()) {
		document.getElementById(this.treeId).view.selection.clearSelection();
	}
}

Arbre.prototype.getRangeCount = function() {
	return (this.isNotNull()?document.getElementById(this.treeId).view.selection.getRangeCount():0);
}

Arbre.prototype.getRangeAt = function(i, start, end) {
	return document.getElementById(this.treeId).view.selection.getRangeAt(i, start, end);
}

Arbre.prototype.nbSelection = function() {
	return (this.isNotNull()?document.getElementById(this.treeId).view.selection.count:0);
}

Arbre.prototype.isNotNull = function() {
		return (document.getElementById(this.treeId)!=null && document.getElementById(this.treeId).view!=null);
}

Arbre.prototype.getCurrentIndex = function() {
		return (this.isSelected()?document.getElementById(this.treeId).currentIndex:-1);
}

Arbre.prototype.isSelected = function() {
		return (this.isNotNull() && document.getElementById(this.treeId).currentIndex!=-1);
}

Arbre.prototype.nbLignes = function() {
		return (this.isNotNull()?document.getElementById(this.treeId).view.rowCount:0);
}

Arbre.prototype.getSelectedCellText = function(idcolumn) {
		return this.getCellText(document.getElementById(this.treeId).currentIndex,idcolumn);
}

Arbre.prototype.getSelectedCellValue = function(idcolumn) {
		return this.getCellValue(document.getElementById(this.treeId).currentIndex,idcolumn);
}

Arbre.prototype.getCellText = function(idligne,idcolumn) {
		return (idligne!=-1?getCellText(document.getElementById(this.treeId),idligne,idcolumn):"");
}

Arbre.prototype.getCellValue = function(idligne,idcolumn) {
		return (idligne!=-1?getCellValue(document.getElementById(this.treeId),idligne,idcolumn):"");
}

Arbre.prototype.getItemValue = function(idligne) {
		return (idligne!=-1?document.getElementById(this.treeId).view.getItemAtIndex(idligne).getAttribute("value"):"");
}

Arbre.prototype.toggleOpenState = function(idligne) {
		if (idligne!=-1) {
			document.getElementById(this.treeId).view.toggleOpenState(idligne);
		}
}

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
 * bibliothèque de fonctions pour la gestion de semaphores synchronisant l'initialisation d'arbres RDF.
 *
 * charger util.js préalablement
 * SyncInitArbre ne fonctionne qu'avec des arbres : charger arbres.js préalablement 
 */
function demandeRdv(sema) {
	sema.params[0].rdv();
}

function SyncInitArbre(ftoexec) {
	this.count = 0;
	this.ftoexec = ftoexec;
	this.tarbre = new Array();
}

SyncInitArbre.prototype.add = function(arbre) {
	this.tarbre.push(arbre);
	this.count++;
}

SyncInitArbre.prototype.load = function() {
	for (var i=0; i<this.tarbre.length; i++) {
		var tabParam = new Array(this);
		this.tarbre[i].initTree(demandeRdv, tabParam);
	}
}

SyncInitArbre.prototype.rdv = function() {
	this.count--;
	if (this.count==0) {
		this.ftoexec();
	}
}
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


function init() {
  try {
		
		loadOngletVt('frmVtGlobal');
    loadOngletVt('frmVtClient');
    loadOngletVt('frmVtArticle');
    loadOngletVt('frmVtCommercial');
		
		loadOngletAc('frmAcGlobal');
    loadOngletAc('frmAcFournisseur');
    loadOngletAc('frmAcArticle');
    loadOngletAc('frmAcCommercial');
		
  } catch (e) {
    recup_erreur(e);
  }
}


function loadOngletVt(onglet) {
  try {

  	var url = "chrome://opensi/content/facturation/user/tabbord/ventes.xul?"+ cookie();
    var page = url +"&onglet="+ onglet;
  	document.getElementById(onglet).setAttribute("src",page);

  } catch (e) {
    recup_erreur(e);
  }
}


function loadOngletAc(onglet) {
  try {

  	var url = "chrome://opensi/content/facturation/user/tabbord/achats.xul?"+ cookie();
    var page = url +"&onglet="+ onglet;
  	document.getElementById(onglet).setAttribute("src",page);

  } catch (e) {
    recup_erreur(e);
  }
}


function retour_menu_principal() {
  try {
	
    window.location = "chrome://opensi/content/facturation/user/menu_principal.xul?"+ cookie();
  
	} catch (e) {
    recup_erreur(e);
  }
}

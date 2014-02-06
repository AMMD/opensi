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


	} catch (e) {
    recup_erreur(e);
  }
}


function goToMenu(numMenu) {

  switch (numMenu) {
    case 1: window.location = "chrome://opensi/content/config/dossiers/modifier_dossier.xul?"+ cookie();
            break;
    case 2: window.location = "chrome://opensi/content/config/gestion_commerciale/menu_gestion_commerciale.xul?"+ cookie();
            break;
    case 3: window.location = "chrome://opensi/content/config/parametrageArticles/menuParametrageArticles.xul?"+ cookie();
    				break;
    case 4: window.location = "chrome://opensi/content/config/parametrageClients/menuParametrageClients.xul?"+ cookie();
            break;
    case 5: window.location = "chrome://opensi/content/config/parametrageFournisseurs/menuParametrageFournisseurs.xul?"+ cookie();
    				break;
    case 6: window.location = "chrome://opensi/content/config/comptabilite/menu_comptabilite.xul?"+ cookie();
            break;
		case 7: window.location = "chrome://opensi/content/config/tva/tva.xul?"+ cookie();
            break;
		case 8: window.location = "chrome://opensi/content/config/multisites/gestion-sites.xul?"+ cookie();
            break;
    case 9: window.location = "chrome://opensi/content/config/articles_clients_fournisseurs/menu_acf.xul?"+ cookie();
            break;
    case 10: window.location = "chrome://opensi/content/config/parametrageEcommerce/menuParametrageEcommerce.xul?"+ cookie();
    				break;
	}
}


function retour_choixDossier() {
	try {

  	window.location = "chrome://opensi/content/config/menu.xul?"+ cookie();

	} catch (e) {
    recup_erreur(e);
  }
}

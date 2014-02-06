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


jsLoader.loadSubScript("chrome://opensi/content/libs/arbres.js");
var aListeBLAFacturer=new Arbre("Facturation/Affaires/liste-bonsLivraisonAFacturer.tmpl","bons_livraison");


function init() {
  try {

    window.resizeTo(500,350);

    init_tree();

  } catch (e) {
    recup_erreur(e);
  }
}


function ouvrirBL() {
  try {

		if (aListeBLAFacturer.isSelected()) {

			window.arguments[0](aListeBLAFacturer.getSelectedCellText('ColBon_Id'));
			window.close();
		}

  } catch (e) {
    recup_erreur(e);
  }
}


function pressOnTree(ev) {
  try {

    if (ev.keyCode==13) {
      ouvrirBL();
    }

  } catch (e) {
    recup_erreur(e);
  }
}


function init_tree() {
  try {
		aListeBLAFacturer.setParam("Affaire_Id", ParamValeur("Affaire_Id"));
		aListeBLAFacturer.initTree();

  } catch (e) {
    recup_erreur(e);
  }
}


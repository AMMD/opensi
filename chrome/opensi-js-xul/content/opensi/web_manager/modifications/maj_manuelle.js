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
jsLoader.loadSubScript("chrome://opensi/content/libs/query.js");

var site_id;
var nom_site;

var type_maj_modif;


function init()
{
	try
	{
		site_id=ParamValeur("site_id");
		nom_site=ParamValeur("nom_site");
		getInfoMaj();
		interdireModifications();
		bloquerConsole(false);
	}

	catch (e)
	{
		recup_erreur(e);
	}
}


function getInfoMaj()
{
	try
	{
		var queryHttp = new QueryHttp("WebManager/modifications/getInfoMaj.tmpl");
 		queryHttp.setParam("site_id",site_id);
 		queryHttp.execute(getInfoMaj_termine);
	}
	catch (e) 
	{
  		recup_erreur(e);
	}
}

function getInfoMaj_termine(requete)
{
	try
	{
		
		creerInfo('com',requete);
		creerInfo('cli',requete);
    creerInfo('maj_cli',requete);
		creerInfo('prix',requete);
		creerInfo('info',requete);
		creerInfo('stat',requete);
		creerInfo('stock',requete);
		
	}
	catch (e) 
	{
  		recup_erreur(e);
	}
}

function creerInfo(type, requete)
{
	try
	{
		var periode=requete.responseXML.documentElement.getAttribute('type_periode_'+type);
		var valeur=requete.responseXML.documentElement.getAttribute('valeur_periode_'+type);
		var depart=requete.responseXML.documentElement.getAttribute('depart_'+type);
		var etat=requete.responseXML.documentElement.getAttribute('etat_'+type);
		var date_derniere=requete.responseXML.documentElement.getAttribute('derniere_maj_'+type);
		var message="";
		
		document.getElementById('type_periode_'+type).value=periode;
		document.getElementById('valeur_periode_'+type).value=valeur;
		document.getElementById('heure_depart_'+type).value=depart;
		document.getElementById('lb_date_'+type).value=date_derniere;
		
		if(periode=="MINUTE")
		{
			message="- Toutes les "+valeur+" minutes.";
		}
		else if(periode=="HEURE")
		{
			message="- Toutes les "+valeur+" heure(s).";
		}
		else if(periode=="JOUR")
		{
			message="- Tous les jours à "+depart+"h.";
		}
		else if(periode=="SEMAINE")
		{
			message="- Tous les "+valeur+" à "+depart+"h.";
		}
		
		document.getElementById('lb_info_'+type).value=message;
		
		if(etat=="true")
		{
			document.getElementById('img_etat_'+type).src="chrome://opensi/content/design/vert2.png";
		}
		else
		{
			document.getElementById('img_etat_'+type).src="chrome://opensi/content/design/rouge2.png";
		}

	}
	catch (e) 
	{
  		recup_erreur(e);
	}
}


/* ************ RAPPORTS ************************ */

function clic_toutRapports()
{
	try
	{
		window.location = "chrome://opensi/content/web_manager/modifications/rapports.xul?"+ cookie()
			+"&site_id="+site_id+"&nom_site="+nom_site;
	}

	catch (e)
	{
		recup_erreur(e);
	}
}

/* ************ MISE A JOUR IMMEDIATES ********* */


function lancer_maj(type_maj)
{
	try
	{
		bloquerConsole(true);
	
		document.getElementById('info').value="";
		var queryHttp = new QueryHttp("WebManager/modifications/MAJ_manuelles.tmpl");
		
		queryHttp.setParam("maj", type_maj);
		queryHttp.setParam("site_id",site_id);
		
		bloquerInterface(true);
		
		queryHttp.execute(reqTerminee);
	}

	catch (e)
	{
		recup_erreur(e);
	}
}



function reqTerminee(requete)
{
	try
	{

		bloquerConsole(false);
		bloquerInterface(false);
		
		var reussite=requete.responseXML.documentElement.getAttribute('maj');
		if(reussite=="OUI")
		{
			document.getElementById('info').value="Mise a jour réussie.";
		}
		else if(reussite=="NON")
		{
			document.getElementById('info').value="Une erreur s'est produite lors de la mise à jour.";
		
		}
		
		init();
		
	}
	catch (e)
	{
		recup_erreur(e);
	}

}

/* **************** EVENEMENTS & INTERFACE********************** */

function interdireModifications()
{
	try
	{
		document.getElementById('choix_periode').disabled=true;
		document.getElementById('choix_minute').disabled=true;
		document.getElementById('choix_heure').disabled=true;
		document.getElementById('choix_jour').disabled=true;
		document.getElementById('choix_semaine').disabled=true;

		document.getElementById('case_lun').disabled=true;
		document.getElementById('case_mar').disabled=true;
		document.getElementById('case_mer').disabled=true;
		document.getElementById('case_jeu').disabled=true;
		document.getElementById('case_ven').disabled=true;
		document.getElementById('case_sam').disabled=true;
		document.getElementById('case_dim').disabled=true;

		document.getElementById('bt_annuler').disabled=true;
		document.getElementById('bt_enregistrer').disabled=true;

		document.getElementById('case_lun').checked=false;
		document.getElementById('case_mar').checked=false;
		document.getElementById('case_mer').checked=false;
		document.getElementById('case_jeu').checked=false;
		document.getElementById('case_ven').checked=false;
		document.getElementById('case_sam').checked=false;
		document.getElementById('case_dim').checked=false;
	}
	catch (e)
	{
		recup_erreur(e);
	}
}


function bloquerConsole(bool)
{
	try
	{
		document.getElementById('info').value="";
		document.getElementById('bt_demarrerTout').disabled=bool;
		document.getElementById('bt_arreterTout').disabled=bool;
		document.getElementById('bt_toutRapports').disabled=bool;
		
		document.getElementById('bt_demarrerCom').disabled=bool;
		document.getElementById('bt_arreterCom').disabled=bool;
		document.getElementById('bt_nowCom').disabled=bool;
		
		document.getElementById('bt_demarrerCli').disabled=bool;
		document.getElementById('bt_arreterCli').disabled=bool;
		document.getElementById('bt_nowCli').disabled=bool;

		document.getElementById('bt_demarrerMajCli').disabled=bool;
		document.getElementById('bt_arreterMajCli').disabled=bool;
		document.getElementById('bt_nowMajCli').disabled=bool;
		
    document.getElementById('bt_demarrerStock').disabled=bool;
    document.getElementById('bt_arreterStock').disabled=bool;
    document.getElementById('bt_nowStock').disabled=bool;
    
		document.getElementById('bt_demarrerPrix').disabled=bool;
		document.getElementById('bt_arreterPrix').disabled=bool;
		document.getElementById('bt_nowPrix').disabled=bool;
		
		document.getElementById('bt_demarrerInfo').disabled=bool;
		document.getElementById('bt_arreterInfo').disabled=bool;
		document.getElementById('bt_nowInfo').disabled=bool;
		
		document.getElementById('bt_demarrerStat').disabled=bool;
		document.getElementById('bt_arreterStat').disabled=bool;
		document.getElementById('bt_nowStat').disabled=bool;		
		
		document.getElementById('bt_changerCom').disabled=bool;
		document.getElementById('bt_changerCli').disabled=bool;
    document.getElementById('bt_changerMajCli').disabled=bool;
		document.getElementById('bt_changerStat').disabled=bool;
		document.getElementById('bt_changerStock').disabled=bool;
		document.getElementById('bt_changerPrix').disabled=bool;
		document.getElementById('bt_changerInfo').disabled=bool;

		
	}
	catch (e)
	{
		recup_erreur(e);
	}
}



function bloquerInterface(bool)
{

try
	{
		var bar = document.getElementById("barre_progression");
		bar.setAttribute("hidden",!bool);
		
		if(bool)
		{
			bar.setAttribute("mode","undetermined");
		}
		else
		{
			bar.setAttribute("mode","determined");
		}
		document.getElementById('bMenuPrincipal').disabled=bool;
		document.getElementById('bMenuSites').disabled=bool;
		document.getElementById('bGestionSite').disabled=bool;
		
		
		
	}
	catch (e)
	{
		recup_erreur(e);
	}


}



function periode_select()
{
	try
	{
		var type_periode=document.getElementById("choix_periode").value;
		
		if(type_periode=="HEURE")
		{
			document.getElementById('choix_minute').disabled=true;
			document.getElementById('choix_heure').disabled=false;
			document.getElementById('choix_jour').disabled=true;
			document.getElementById('choix_semaine').disabled=true;
	
			document.getElementById('case_lun').disabled=true;
			document.getElementById('case_mar').disabled=true;
			document.getElementById('case_mer').disabled=true;
			document.getElementById('case_jeu').disabled=true;
			document.getElementById('case_ven').disabled=true;
			document.getElementById('case_sam').disabled=true;
			document.getElementById('case_dim').disabled=true;

			document.getElementById('case_lun').checked=false;
			document.getElementById('case_mar').checked=false;
			document.getElementById('case_mer').checked=false;
			document.getElementById('case_jeu').checked=false;
			document.getElementById('case_ven').checked=false;
			document.getElementById('case_sam').checked=false;
			document.getElementById('case_dim').checked=false;
		}
		else if(type_periode=="MINUTE")
		{
			document.getElementById('choix_minute').disabled=false;
			document.getElementById('choix_heure').disabled=true;
			document.getElementById('choix_jour').disabled=true;
			document.getElementById('choix_semaine').disabled=true;
	
			document.getElementById('case_lun').disabled=true;
			document.getElementById('case_mar').disabled=true;
			document.getElementById('case_mer').disabled=true;
			document.getElementById('case_jeu').disabled=true;
			document.getElementById('case_ven').disabled=true;
			document.getElementById('case_sam').disabled=true;
			document.getElementById('case_dim').disabled=true;

			document.getElementById('case_lun').checked=false;
			document.getElementById('case_mar').checked=false;
			document.getElementById('case_mer').checked=false;
			document.getElementById('case_jeu').checked=false;
			document.getElementById('case_ven').checked=false;
			document.getElementById('case_sam').checked=false;
			document.getElementById('case_dim').checked=false;
		}
		else if(type_periode=="JOUR")
		{
			document.getElementById('choix_minute').disabled=true;
			document.getElementById('choix_heure').disabled=true;
			document.getElementById('choix_jour').disabled=false;
			document.getElementById('choix_semaine').disabled=true;
	
			document.getElementById('case_lun').disabled=true;
			document.getElementById('case_mar').disabled=true;
			document.getElementById('case_mer').disabled=true;
			document.getElementById('case_jeu').disabled=true;
			document.getElementById('case_ven').disabled=true;
			document.getElementById('case_sam').disabled=true;
			document.getElementById('case_dim').disabled=true;

			document.getElementById('case_lun').checked=false;
			document.getElementById('case_mar').checked=false;
			document.getElementById('case_mer').checked=false;
			document.getElementById('case_jeu').checked=false;
			document.getElementById('case_ven').checked=false;
			document.getElementById('case_sam').checked=false;
			document.getElementById('case_dim').checked=false;
		}
		else if(type_periode=="SEMAINE")
		{
			document.getElementById('choix_minute').disabled=true;
			document.getElementById('choix_heure').disabled=true;
			document.getElementById('choix_jour').disabled=true;
			document.getElementById('choix_semaine').disabled=false;
	
			document.getElementById('case_lun').disabled=false;
			document.getElementById('case_mar').disabled=false;
			document.getElementById('case_mer').disabled=false;
			document.getElementById('case_jeu').disabled=false;
			document.getElementById('case_ven').disabled=false;
			document.getElementById('case_sam').disabled=false;
			document.getElementById('case_dim').disabled=false;

			document.getElementById('case_lun').checked=false;
			document.getElementById('case_mar').checked=false;
			document.getElementById('case_mer').checked=false;
			document.getElementById('case_jeu').checked=false;
			document.getElementById('case_ven').checked=false;
			document.getElementById('case_sam').checked=false;
			document.getElementById('case_dim').checked=false;
		}
		
	} 
	catch (e) 
	{
    	recup_erreur(e);
	}

}



function clic_enregistrer()
{
	try
	{
		var type_periode=document.getElementById('choix_periode').value;
		var valeur="1";
		var depart="0";
		
		if(type_periode=="HEURE")
		{
			valeur=document.getElementById('choix_heure').value;
		}
		else if(type_periode=="MINUTE")
		{	
			valeur=document.getElementById('choix_minute').value;
		}
		else if(type_periode=="JOUR")
		{
			depart=document.getElementById('choix_jour').value;
		}
		else if(type_periode=="SEMAINE")
		{
			depart=document.getElementById('choix_semaine').value;
			
			var liste_jour="";
			if(document.getElementById('case_lun').checked)
			{
				liste_jour+="lun,";
			}
			
			if(document.getElementById('case_mar').checked)
			{
				liste_jour+="mar,";
			}
			
			if(document.getElementById('case_mer').checked)
			{
				liste_jour+="mer,";
			}
			
			if(document.getElementById('case_jeu').checked)
			{
				liste_jour+="jeu,";
			}
			
			if(document.getElementById('case_ven').checked)
			{
				liste_jour+="ven,";
			}
			
			if(document.getElementById('case_sam').checked)
			{
				liste_jour+="sam,";
			}
			
			if(document.getElementById('case_dim').checked)
			{
				liste_jour+="dim,";
			}
			
			valeur=liste_jour;
			
		}
		
		var queryHttp = new QueryHttp("WebManager/modifications/enregistrerModifMaj.tmpl");
 		queryHttp.setParam("site_id",site_id);
		queryHttp.setParam("type_periode",type_periode);
		queryHttp.setParam("valeur_periode",valeur);
		queryHttp.setParam("depart",depart);
		queryHttp.setParam("type_maj",type_maj_modif);
 		queryHttp.execute(enregistre_termine);
		
	} 
	catch (e) 
	{
    	recup_erreur(e);
	}

}

function enregistre_termine()
{
	try
	{
		redemarrerMaj(type_maj_modif);
	} 
	catch (e) 
	{
    	recup_erreur(e);
	}

}



function clic_annuler()
{
	try
	{
		bloquerConsole(false);
		interdireModifications();
	} 
	catch (e) 
	{
    	recup_erreur(e);
	}

}


function clic_changer(type_maj)
{
	try
	{
		type_maj_modif=type_maj;
	
		bloquerConsole(true);
	
		document.getElementById('bt_annuler').disabled=false;
		document.getElementById('bt_enregistrer').disabled=false;
	
		var type_periode="MINUTE";
		var valeur="10";
		var depart="0";
		
		if(type_maj=="COM")
		{
			document.getElementById('cap_modif').label="Récupération des commandes:";
			type_periode=document.getElementById('type_periode_com').value;
			valeur=document.getElementById('valeur_periode_com').value;
			depart=document.getElementById('heure_depart_com').value;
			
		}
		else if(type_maj=="CLI")
		{
			document.getElementById('cap_modif').label="Récupération des commandes:";
			type_periode=document.getElementById('type_periode_cli').value;
			valeur=document.getElementById('valeur_periode_cli').value;
			depart=document.getElementById('heure_depart_cli').value;
			
		}
		else if(type_maj=="MAJCLI")
		{
			document.getElementById('cap_modif').label="Récupération des commandes:";
			type_periode=document.getElementById('type_periode_cli').value;
			valeur=document.getElementById('valeur_periode_cli').value;
			depart=document.getElementById('heure_depart_cli').value;
			
		}
		else if(type_maj=="PRIX")
		{
			document.getElementById('cap_modif').label="Mise à jour des prix:";
			type_periode=document.getElementById('type_periode_prix').value;
			valeur=document.getElementById('valeur_periode_prix').value;
			depart=document.getElementById('heure_depart_prix').value;
		}
		else if(type_maj=="STOCK")
		{
			document.getElementById('cap_modif').label="Mise à jour des stocks:";
			type_periode=document.getElementById('type_periode_stock').value;
			valeur=document.getElementById('valeur_periode_stock').value;
			depart=document.getElementById('heure_depart_stock').value;
		}
		else if(type_maj=="INFO")
		{
			document.getElementById('cap_modif').label="Mise à jour des infos:";
			type_periode=document.getElementById('type_periode_info').value;
			valeur=document.getElementById('valeur_periode_info').value;
			depart=document.getElementById('heure_depart_info').value;
		}
		else if(type_maj=="STAT")
		{
			document.getElementById('cap_modif').label="Mise à jour des statuts:";
			type_periode=document.getElementById('type_periode_stat').value;
			valeur=document.getElementById('valeur_periode_stat').value;
			depart=document.getElementById('heure_depart_stat').value;
		}
		
		
		document.getElementById('choix_periode').disabled=false;


		if(type_periode=="MINUTE")
		{
			document.getElementById('choix_periode').value="MINUTE";
			document.getElementById('choix_minute').disabled=false;
			document.getElementById('choix_minute').value=valeur;

		}
		else if (type_periode=="HEURE")
		{
			document.getElementById('choix_periode').value="HEURE";
			document.getElementById('choix_heure').disabled=false;
			document.getElementById('choix_heure').value=valeur;

		}
		else if (type_periode=="JOUR")
		{
			document.getElementById('choix_periode').value="JOUR";
			document.getElementById('choix_jour').disabled=false;
			document.getElementById('choix_jour').value=depart;

		}
		else if (type_periode=="SEMAINE")
		{
			document.getElementById('choix_periode').value="SEMAINE";
			document.getElementById('choix_semaine').disabled=false;
			document.getElementById('choix_semaine').value=depart;
			
			document.getElementById('case_lun').disabled=false;
			document.getElementById('case_mar').disabled=false;
			document.getElementById('case_mer').disabled=false;
			document.getElementById('case_jeu').disabled=false;
			document.getElementById('case_ven').disabled=false;
			document.getElementById('case_sam').disabled=false;
			document.getElementById('case_dim').disabled=false;
			
			var tab=new Array();
			tab=valeur.split(',');
			
			
			for(i=0;i<tab.length;i++)
			{
				if(tab[i]=="lun")
				{
					document.getElementById('case_lun').checked=true;
				}
				else if(tab[i]=="mar")
				{
					document.getElementById('case_mar').checked=true;
				}
				else if(tab[i]=="mer")
				{
					document.getElementById('case_mer').checked=true;
				}
				else if(tab[i]=="jeu")
				{
					document.getElementById('case_jeu').checked=true;
				}
				else if(tab[i]=="ven")
				{
					document.getElementById('case_ven').checked=true;
				}
				else if(tab[i]=="sam")
				{
					document.getElementById('case_sam').checked=true;
				}
				else if(tab[i]=="dim")
				{
					document.getElementById('case_dim').checked=true;
				}
			
			}
			
		}	

		
	}
	catch (e) 
	{
    	recup_erreur(e);
	}


}


function redemarrerMaj(type_maj)
{
	try
	{
		bloquerConsole(true);		
		bloquerInterface(true);
	
		var queryHttp = new QueryHttp("WebManager/modifications/MAJ_auto.tmpl");
		queryHttp.setParam("action", "STOP");
		queryHttp.setParam("type_maj",type_maj);
		queryHttp.setParam("site_id",site_id);
		queryHttp.execute(fin_redemarrerMaj);
		
		
	} catch (e) {
    recup_erreur(e);
  }



}

function fin_redemarrerMaj()
{
	try
	{

		var queryHttp = new QueryHttp("WebManager/modifications/MAJ_auto.tmpl");
		queryHttp.setParam("action", "START");
		queryHttp.setParam("type_maj",type_maj_modif);
		queryHttp.setParam("site_id",site_id);
		queryHttp.execute(fin_demarrerMaj);
		
	}
	catch (e) 
	{
    recup_erreur(e);
  }

}

function demarrerMaj(type_maj)
{
	try
	{
		bloquerConsole(true);		
		bloquerInterface(true);
	
		var queryHttp = new QueryHttp("WebManager/modifications/MAJ_auto.tmpl");
		queryHttp.setParam("action", "START");
		queryHttp.setParam("type_maj",type_maj);
		queryHttp.setParam("site_id",site_id);
		queryHttp.execute(fin_demarrerMaj);
		
		
	} catch (e) {
    recup_erreur(e);
  }

}

function fin_demarrerMaj()
{
	try
	{

		bloquerConsole(false);		
		bloquerInterface(false);
		
		//Il faut questionner le serveur de maj, parceque ça peut avoir planté
		init();
		
	}
	catch (e) 
	{
    recup_erreur(e);
  }

}

function arreterMaj(type_maj)
{
try
	{
		bloquerConsole(true);		
		bloquerInterface(true);
	
		var queryHttp = new QueryHttp("WebManager/modifications/MAJ_auto.tmpl");
		queryHttp.setParam("action", "STOP");
		queryHttp.setParam("type_maj",type_maj);
		queryHttp.setParam("site_id",site_id);
		queryHttp.execute(fin_demarrerMaj);
		
	} catch (e) {
    recup_erreur(e);
  }

}


function arreterTout()
{
	try
	{
		bloquerConsole(true);		
		bloquerInterface(true);
	
		var queryHttp = new QueryHttp("WebManager/modifications/MAJ_auto.tmpl");
		queryHttp.setParam("action", "STOP");
		queryHttp.setParam("type_maj","TOUT");
		queryHttp.setParam("site_id",site_id);
		queryHttp.execute(fin_demarrerMaj);
		
	}
	catch (e)
	{
    recup_erreur(e);
  }

}

function demarrerTout()
{
	try
	{
		bloquerConsole(true);		
		bloquerInterface(true);
	
		var queryHttp = new QueryHttp("WebManager/modifications/MAJ_auto.tmpl");
		queryHttp.setParam("action", "START");
		queryHttp.setParam("type_maj","TOUT");
		queryHttp.setParam("site_id",site_id);
		queryHttp.execute(fin_demarrerMaj);
	}
	catch (e)
	{
    recup_erreur(e);
  }

}




function menuGestionSite()
{
	try
	{
  		
		var page = "chrome://opensi/content/web_manager/modifications/menu_gestion_site.xul?"+ cookie();
		page+="&site_id="+site_id+"&nom_site="+nom_site;
		window.location =page;
		
	} catch (e) {
    recup_erreur(e);
  }
}

function menuSite()
{
	try
	{
  		window.location = "chrome://opensi/content/web_manager/modifications/choisir_un_site.xul?"+ cookie();
		
	} catch (e) {
    recup_erreur(e);
  }
}


/* Gestion des boutons du menu en haut */
function menuWebManager()
{
	try
	{
  		window.location = "chrome://opensi/content/web_manager/menu_e_commerce.xul?"+ cookie();
		
	} catch (e) {
    recup_erreur(e);
  }
}


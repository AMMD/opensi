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
 * bibliothèque de fonctions servant à vérifier des conditions sur des champs de saisie.
 */


function isPositive(val) {
	return !isNaN(val) && val > 0 && isFinite(val);
}

function isPositiveOrNull(val) {
	return !isNaN(val) && val >= 0 && isFinite(val);
}

function isPositiveInteger(val) {
	return !isNaN(val) && val > 0 && parseFloat(val)==parseIntBis(val) && isFinite(val);
}

function isPositiveOrNullInteger(val) {
	return !isNaN(val) && val >= 0 && parseFloat(val)==parseIntBis(val) && isFinite(val);
}

function isTaux(val) {
	try {

		return isPositiveOrNull(val) && val <= 100 && checkDecimal(val,2);

	} catch (e) {
    recup_erreur(e);
  }
}

/*
	val -> valeur à examiner
	dec -> nombre de decimales maxi (>=0)
*/
function checkDecimal(val,dec) {
	try {

		if (isNaN(val)) return false;

		val = val.toString();

		var indexOfPoint = val.indexOf(".");

		if (indexOfPoint==-1)
			return true;
		else
			return (val.substring(indexOfPoint+1, val.length).length <= dec);

	} catch (e) {
    recup_erreur(e);
  }
}


/*
	val -> valeur à examiner
	dec -> nombre maxi de chiffres composant la partie entière (>=0)
*/
function checkIPart(val,nbc) {
	try {

		if (isNaN(val)) return false;

		val = val.toString();

		var indexOfPoint = val.indexOf(".");

		if (indexOfPoint==-1)
			return (val.length <= nbc);
		else
			return (val.substring(0, indexOfPoint).length <= nbc);

	} catch (e) {
    recup_erreur(e);
  }
}


function checkNumber(val,nbc,nbd) {
	try {

		return checkIPart(val,nbc) && checkDecimal(val,nbd);

	} catch (e) {
    recup_erreur(e);
  }
}


function isDigitList(val) {
  try {

	  n = val.length;
	  i = 0;
	  ok = true;
  	while (i<n && ok) {
	  	c = val.charAt(i);
		  ok = (c<='9' && c>='0');
  		i += 1;
	  }
  	return ok;

  } catch (e) {
    recup_erreur(e);
  }
}


function isAlpha(val) {
	try {

		var str = val.toString();
		var ok = true;

		for (var i=0;i<str.length && ok;i++) {
			var c = str.charAt(i);
			ok = ((c<='z' && c>='a') || (c<='Z' && c>='A'));
		}

		return ok;

	} catch (e) {
    recup_erreur(e);
  }
}


function isAlphaNum(val) {
	try {

		var str = val.toString();
		var ok = true;

		for (var i=0;i<str.length && ok;i++) {
			var c = str.charAt(i);
			ok = ((c<='z' && c>='a') || (c<='Z' && c>='A') || (c<='9' && c>='0'));
		}

		return ok;

	} catch (e) {
    recup_erreur(e);
  }
}


function isEmpty(val) {
  try {

	  return val.length < 1;

  } catch (e) {
    recup_erreur(e);
  }
}


function isPhone(val) {
  try {

		var regex = /^[\d()\+\ .\-]+$/;
    return (regex.test(val));

  } catch (e) {
    recup_erreur(e);
  }
}


function isCleAlpha(val) {
  try {

  	n = val.length;
	  i = 0;
  	ok = true;
	  while (i<n && ok) {
		  c = val.charAt(i);
  		ok = ((c<='z' && c>='a') || (c<='Z' && c>='A') || c=='_' || c=='-' || (c<='9' && c>='0'));
	  	i += 1;
  	}
	  return ok;

  } catch (e) {
    recup_erreur(e);
  }
}


function isNomDossier(val) {
  try {

  	n = val.length;
	  i = 0;
  	ok = true;
	  while (i<n && ok) {
		  c = val.charAt(i);
  		ok = ((c<='z' && c>='a') || (c<='Z' && c>='A') || c=='_' || (c<='9' && c>='0'));
	  	i += 1;
  	}
	  return ok;

  } catch (e) {
    recup_erreur(e);
  }
}


function isBissextile(a) {
  try {
	  return  a%4==0 && ((a%100==0 && a%400==0) || a%100!=0);
  } catch (e) {
    recup_erreur(e);
  }
}


function isJourValide(j,m,a) {
  try {

  	switch(m) {
	  	case 1:case 3:case 5:case 7: case 8:case 10:case 12:
		  	return j<=31;
			  break;
  		case 4:case 6:case 9:case 11:
	  		return j<=30;
		  	break;
  		case 2:
	  		return isBissextile(a)?j<=29:j<=28;
		  	break;
  	}

  } catch (e) {
    recup_erreur(e);
  }
}


function isDateValide(j,m,a) {
  try {

  	if (j>31 || j<1 || m>12 || m<1)
	  	return false;
  	else if (!isJourValide(j,m,a))
	  	return false;
  	else
	  	return true;

  } catch (e) {
    recup_erreur(e);
  }
}


function isDate(val) {
  try {

  	if (val.length!=10)
	  	return false;
  	else {
	  	strjour = val.substring(0,2);
		  strmois = val.substring(3,5);
  		strannee = val.substring(6,10);

	  	if (val.charAt(2)!='/' || val.charAt(5)!='/')
		  	return false;
  		else if (!(isPositive(strjour) && isPositive(strmois) && isPositive(strannee)))
	  		return false;
		  else
			  return isDateValide(parseIntBis(strjour),parseIntBis(strmois),parseIntBis(strannee));
  	}

  } catch (e) {
    recup_erreur(e);
  }
}


function isDateInterval(d,f) {
  try {

  	jj1 = parseIntBis(d.substring(0,2));
	  mm1 = parseIntBis(d.substring(3,5));
  	aa1 = parseIntBis(d.substring(6,d.length));
	  jj2 = parseIntBis(f.substring(0,2));
  	mm2 = parseIntBis(f.substring(3,5));
	  aa2 = parseIntBis(f.substring(6,f.length));

  	return aa1 < aa2 || (aa1==aa2 && (mm1 < mm2 || (mm1==mm2 && jj1 <= jj2)));

  } catch (e) {
    recup_erreur(e);
  }
}


function isPeriode(val) {
  try {

	  if (val.length==4 && isDigitList(val)) {
		  mm = parseIntBis(val.substring(0,2));
  		aa = parseIntBis(val.substring(2,4));
	  	return mm <= 12 && mm >= 1 && aa <= 99 && aa >= 0;
	  }
	  else
		  return false;

  } catch (e) {
    recup_erreur(e);
  }
}


function isPeriodeInterval(d,f) {
  try {

  	mm1 = parseIntBis(d.substring(0,2));
	  aa1 = parseIntBis(d.substring(2,4));
  	mm2 = parseIntBis(f.substring(0,2));
	  aa2 = parseIntBis(f.substring(2,4));

  	return aa1 < aa2 || (aa1==aa2 && mm1 <= mm2);

  } catch (e) {
    recup_erreur(e);
  }
}


function isEmail(email) {
  try {

		var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-zA-Z]{2,4}$/;
    return (regex.test(email));

	} catch (e) {
    recup_erreur(e);
  }
}


function isURL(argvalue) {

  if (argvalue.indexOf(" ") != -1)
    return false;
  else if (argvalue.indexOf("http://") == -1) {
    if (argvalue.indexOf("https://") == -1)
      return false;
    else if (argvalue == "https://")
      return false;
    else if (argvalue.indexOf("https://") > 0)
      return false;
  } else if (argvalue == "http://")
    return false;
  else if (argvalue.indexOf("http://") > 0)
    return false;

  argvalue = argvalue.substring(7, argvalue.length);
  if (argvalue.indexOf(".") == -1)
    return false;
  else if (argvalue.indexOf(".") == 0)
    return false;
  else if (argvalue.charAt(argvalue.length - 1) == ".")
    return false;

  if (argvalue.indexOf("/") != -1) {
    argvalue = argvalue.substring(0, argvalue.indexOf("/"));
    if (argvalue.charAt(argvalue.length - 1) == ".")
      return false;
  }

  if (argvalue.indexOf(":") != -1) {
    if (argvalue.indexOf(":") == (argvalue.length - 1))
      return false;
    else if (argvalue.charAt(argvalue.indexOf(":") + 1) == ".")
      return false;
    argvalue = argvalue.substring(0, argvalue.indexOf(":"));
    if (argvalue.charAt(argvalue.length - 1) == ".")
      return false;
  }

  return true;
}


function isWeb(argvalue) {

  // arranger isURL pour accepter le format www.truc.fr (sans http://)

  return true;
}


function isCompteCorrect(numc) {
  try {

		var regex = /^[a-zA-Z0-9_]{8}$/;
    return (regex.test(numc));

  } catch (e) {
    recup_erreur(e);
  }
}


function checkQte(val) {
	try {

		return !isEmpty(val) && isPositive(val) && checkDecimal(val, 3);

	} catch (e) {
    recup_erreur(e);
  }
}

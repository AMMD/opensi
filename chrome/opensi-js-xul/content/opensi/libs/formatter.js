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
 * bibliothèque de fonctions pour le formattage de nombre
 *
 */


function NumberFormat(pattern, sepmil) {

	this.sepmil = sepmil;

	var decIndex = pattern.indexOf(".");
	var pleft = (decIndex==-1?pattern:pattern.substring(0, decIndex));
	this.pright = (decIndex==-1?"":pattern.substring(decIndex +1));

	this.zsleft = this.nbOccOfChar(pleft, '0');
	this.zsright = this.nbOccOfChar(this.pright, '0');
}


/* nombre d'occurences du caractère 'char' dans la chaine 'chaine' */
NumberFormat.prototype.nbOccOfChar = function(chaine, car) {
	var count = 0;

	for (var i=0;i<chaine.length;i++) {
		if (chaine.charAt(i)==car) count++;
	}

	return count;
}


NumberFormat.prototype.format = function(number) {

	var nombre = number.toString().replace(/ /gi, '').replace(/,/gi, '.');

	if (isNaN(nombre)) {
		return number;
	}

	var negatif = (parseFloat(nombre) < 0);

	nombre = (Math.abs(nombre)).toString();

	var decIndex = nombre.indexOf(".");
	var nleft = (decIndex==-1?nombre:nombre.substring(0, decIndex));
	var nright = (decIndex==-1?"":nombre.substring(decIndex +1));

	for (var i=nright.length-1;i>=0 && nright.charAt(i)=='0';i--)
		nright = nright.substring(0,i);

	var pright = this.pright;

	if (pright.length < nright.length) {
		// on arrondi
		var nextChar = nright.charAt(pright.length);
    nright = nright.substring(0, pright.length);
    if (parseInt(nextChar,10) >= 5) {
			if (nright=="") {
				nleft = (parseInt(nleft, 10) + 1).toString();
			}
			else {
				var patt0 = "";
				for (var i=0;i<pright.length;i++)
					patt0 += "0";
				var nf = new NumberFormat(patt0, false);
				var ancnrightlength = nright.length;
				nright = nf.format(parseInt(nright,10) + 1);
				if (nright.length>ancnrightlength) {
					nright = nright.substring(1, nright.length);
					nleft = (parseInt(nleft, 10) + 1).toString();
				}
			}
		}
		for (var i=nright.length-1;i>=0 && nright.charAt(i)=='0';i--)
			nright = nright.substring(0,i);
	}

	for (var i=nleft.length;i<this.zsleft;i++)
		nleft = "0"+ nleft;

	for (var i=nright.length;i<this.zsright;i++)
		nright += "0";

	if (this.sepmil==true) {
		nleft = this.separate(nleft, " ");
	}

	return (negatif?"-":"") + nleft + (nright.length>0?"."+ nright:"");
}


NumberFormat.prototype.separate = function(input, separator) {
  var output = "";
  for (var i=0; i<input.length; i++) {
    if (i!=0 && (input.length - i) % 3 == 0) output += separator;
    output += input.charAt(i);
  }
  return output;
}


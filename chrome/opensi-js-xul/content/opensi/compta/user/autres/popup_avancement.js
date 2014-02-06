function init() {
  try {
  	
  	window.resizeTo(1000,600);
  	self.focus();
  	var num_exo=opener.document.getElementById('exercice_initial').value;
  	var urlavancement = "$COOKIE$&Page=Compta/Etats/Avancement_exercice.tmpl&ContentType=xul&num_exo="+num_exo;

  	document.getElementById('frmavancement').setAttribute("src", getUrlOpeneas(urlavancement));

  } catch (e) {
    recup_erreur(e);
  }
}


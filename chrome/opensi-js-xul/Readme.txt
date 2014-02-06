OpenSi Client version 4.8 (F�vrier 2010)
--------------------------------------
License/licence: see gpl.txt file/voir le fichier gpl.txt

* Module client du logiciel OpenSi.

=======================
CONFIGURATION REQUISE : 

- PC sous Windows 98/Me/NT/2000/XP ou Linux, ou ordinateur Apple sous Mac OS X,
     sur lequel tourne le logiciel OpenSi Serveur, ou reli� par Intranet ou Internet 
     � une machine sur laquelle tourne le logiciel OpenSi Serveur.
  (non test� avec MacOS, mais �a devrait fonctionner aussi).
- Navigateur Web Mozilla Firefox (v3.0 -> 3.5.*)

===================================
INSTALLATION DEPUIS LE SCRIPT XPI :

T�l�charger et ouvrir avec Firefox le fichier <opensi-4.7.xpi>.
(Ce script installe OpenSi en tant qu'extension Firefox)
Une fois l'extension install�e, quitter Firefox et arr�ter compl�tement le processus firefox.exe (red�marrer l'ordinateur au besoin).

===================================
INSTALLATION DEPUIS L'INSTALLEUR EXE (pour Windows) :

T�l�charger et ex�cuter le fichier <opensi-setup-4.7.exe>.
Ce script installe Firefox s'il n'est pas d�j� install�, installe OpenSi en tant qu'extension
et cr�e une ic�ne sur le bureau et dans le menu d�marrer.
Une fois OpenSi install�, quitter Firefox et arr�ter compl�tement le processus firefox.exe (red�marrer l'ordinateur au besoin).


=================================
INSTALLATION DEPUIS LES SOURCES :

1. D�compresser le fichier 'opensi-client.tgz' 
(sous Linux : 'tar xzf opensi-client.tgz', 
sous Windows : utiliser un outil d'archivage tel que WinZip).

2. Se placer � la racine du r�pertoire opensi-client.

3. Cr�er une archive JAR du r�pertoire courant
(sous Unix, Linux, MacOS X : 'jar cf opensi.jar .',
sous Windows : � l'aide d'un outil d'archivage g�rant les archives .jar).

4. D�placer l'archive JAR dans le r�pertoire 'chrome' de Mozilla 
Lui donner les droits de lecture pour tous les utilisateurs.

5. Se placer dans le r�pertoire 'chrome' de Mozilla et �diter le fichier "installed-chrome.txt", 
en y ajoutant les lignes :
content,install,url,jar:resource:/chrome/opensi.jar!/content/opensi/
skin,install,url,jar:resource:/chrome/opensi.jar!/skin/opensi/


===========
EXECUTION :

- Pour lancer le logiciel OpenSi Client sous Linux, il faut taper la commande :
'firefox -chrome chrome://opensi/content/login.xul' 

- Sous windows, si vous avez install� � partir de l'installeur, un raccourci vers OpenSi a
�t� cr�� automatiquement sur le bureau.
Sinon, cr�ez un raccourci vers la commande :
'"C:\Program Files\mozilla.org\Mozilla Firefox\firefox.exe" -chrome chrome://opensi/content/login.xul'

- Sous tous les Syst�mes d'Exploitation, OpenSi peut �galement �tre lanc� via le menu "Outils/OpenSi"
dans Firefox. 

- Si le serveur OpenSi n'est pas install� en local, et/ou si le port de Tomcat sur le serveur
n'est pas 8080, modifier les param�tres 'adresse du serveur' et 'port' dans la fen�tre de login
(en cliquant sur "Param�tres Avanc�s") pour les faire correspondre.

- Lancez d'abord le module Superviseur (mot de passe : 'root')
pour ajouter des utilisateurs, un dossier, et affecter les droits d'acc�s.


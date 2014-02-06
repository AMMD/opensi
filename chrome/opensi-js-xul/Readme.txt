OpenSi Client version 4.8 (Février 2010)
--------------------------------------
License/licence: see gpl.txt file/voir le fichier gpl.txt

* Module client du logiciel OpenSi.

=======================
CONFIGURATION REQUISE : 

- PC sous Windows 98/Me/NT/2000/XP ou Linux, ou ordinateur Apple sous Mac OS X,
     sur lequel tourne le logiciel OpenSi Serveur, ou relié par Intranet ou Internet 
     à une machine sur laquelle tourne le logiciel OpenSi Serveur.
  (non testé avec MacOS, mais ça devrait fonctionner aussi).
- Navigateur Web Mozilla Firefox (v3.0 -> 3.5.*)

===================================
INSTALLATION DEPUIS LE SCRIPT XPI :

Télécharger et ouvrir avec Firefox le fichier <opensi-4.7.xpi>.
(Ce script installe OpenSi en tant qu'extension Firefox)
Une fois l'extension installée, quitter Firefox et arrêter complètement le processus firefox.exe (redémarrer l'ordinateur au besoin).

===================================
INSTALLATION DEPUIS L'INSTALLEUR EXE (pour Windows) :

Télécharger et exécuter le fichier <opensi-setup-4.7.exe>.
Ce script installe Firefox s'il n'est pas déjà installé, installe OpenSi en tant qu'extension
et crée une icône sur le bureau et dans le menu démarrer.
Une fois OpenSi installé, quitter Firefox et arrêter complètement le processus firefox.exe (redémarrer l'ordinateur au besoin).


=================================
INSTALLATION DEPUIS LES SOURCES :

1. Décompresser le fichier 'opensi-client.tgz' 
(sous Linux : 'tar xzf opensi-client.tgz', 
sous Windows : utiliser un outil d'archivage tel que WinZip).

2. Se placer à la racine du répertoire opensi-client.

3. Créer une archive JAR du répertoire courant
(sous Unix, Linux, MacOS X : 'jar cf opensi.jar .',
sous Windows : à l'aide d'un outil d'archivage gérant les archives .jar).

4. Déplacer l'archive JAR dans le répertoire 'chrome' de Mozilla 
Lui donner les droits de lecture pour tous les utilisateurs.

5. Se placer dans le répertoire 'chrome' de Mozilla et éditer le fichier "installed-chrome.txt", 
en y ajoutant les lignes :
content,install,url,jar:resource:/chrome/opensi.jar!/content/opensi/
skin,install,url,jar:resource:/chrome/opensi.jar!/skin/opensi/


===========
EXECUTION :

- Pour lancer le logiciel OpenSi Client sous Linux, il faut taper la commande :
'firefox -chrome chrome://opensi/content/login.xul' 

- Sous windows, si vous avez installé à partir de l'installeur, un raccourci vers OpenSi a
été créé automatiquement sur le bureau.
Sinon, créez un raccourci vers la commande :
'"C:\Program Files\mozilla.org\Mozilla Firefox\firefox.exe" -chrome chrome://opensi/content/login.xul'

- Sous tous les Systèmes d'Exploitation, OpenSi peut également être lancé via le menu "Outils/OpenSi"
dans Firefox. 

- Si le serveur OpenSi n'est pas installé en local, et/ou si le port de Tomcat sur le serveur
n'est pas 8080, modifier les paramètres 'adresse du serveur' et 'port' dans la fenêtre de login
(en cliquant sur "Paramètres Avancés") pour les faire correspondre.

- Lancez d'abord le module Superviseur (mot de passe : 'root')
pour ajouter des utilisateurs, un dossier, et affecter les droits d'accès.


sh ./create_jar.sh
zip -r opensi.xpi . -i "META-INF/*" -i install.rdf -i chrome.manifest -i chrome/opensi.jar

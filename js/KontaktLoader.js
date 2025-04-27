// KontaktLoader.js

// Überprüft, ob sich der Benutzer auf der Startseite befindet
const istStartseite = document.location.pathname === '/' || document.location.pathname === '/index.html';

// Setzt den JSON- und Bildpfad abhängig von der aktuellen Seite
const jsonPfad = istStartseite ? '/json/menu.json' : '../json/menu.json';
const bildPfad = istStartseite ? '/images/' : '../images/';

/**
 * Lädt und zeigt die Kontaktdaten.
 */
function loadKontaktdaten() {
    // JSON-Pfad und Bildpfad basierend auf der aktuellen Seite festlegen
    fetch(jsonPfad)
        .then(antwort => antwort.json())
        .then(daten => {
            // Hauptcontainer für Kontaktdaten auswählen oder erstellen
            let kontaktdatenContainer = document.getElementById('kontaktdaten-neu');
            if (!kontaktdatenContainer) {
                kontaktdatenContainer = document.createElement('div');
                kontaktdatenContainer.className = 'kontaktdaten-neu';
                document.body.appendChild(kontaktdatenContainer);
            }

            // Grid-Container für die Anzeige erstellen
            const gridContainer = document.createElement('div');
            gridContainer.className = 'grid-neu';

            // Gehe durch alle Kontaktdaten und zeige sie im Grid an
            daten.kontaktdaten.forEach(kontakt => {
                const kontaktBox = document.createElement('div');
                kontaktBox.className = 'box-neu';

                // FontAwesome Icon basierend auf den Daten hinzufügen
                const iconElement = document.createElement('i');
                iconElement.className = kontakt.icon;
                kontaktBox.appendChild(iconElement);

                // Titel des Kontaktdatenelements hinzufügen
                const titel = document.createElement('h3');
                titel.textContent = kontakt.title;
                kontaktBox.appendChild(titel);

                // Details hinzufügen (z.B. Telefonnummern, E-Mail-Adressen)
                kontakt.details.forEach(detail => {
                    const detailParagraph = document.createElement('p');

                    if (detail.includes('@')) {
                        // E-Mail-Link erstellen
                        const emailLink = document.createElement('a');
                        emailLink.href = `mailto:${detail}`;
                        emailLink.textContent = detail;
                        detailParagraph.appendChild(emailLink);
                    } else if (kontakt.title === 'Telefonnummer') {
                        // Telefon-Link erstellen
                        const telefonLink = document.createElement('a');
                        telefonLink.href = `tel:${detail.replace(/\s/g, '')}`;
                        telefonLink.textContent = detail;
                        detailParagraph.appendChild(telefonLink);
                    } else if (kontakt.title === 'Adresse') {
                        // Adresse aufteilen und in formatierter Form als Link anzeigen
                        const addressComponents = detail.split(',').map(part => part.trim());
                        const strasse = addressComponents[0];
                        const plz = addressComponents[1];
                        const ort = addressComponents[2];

                        const kartenLink = document.createElement('a');
                        kartenLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail)}`;

                        const strasseSpan = document.createElement('span');
                        strasseSpan.classList.add('adresse-teil', 'strasse');
                        strasseSpan.textContent = strasse;

                        const ortSpan = document.createElement('span');
                        ortSpan.textContent = `${plz} ${ort}`;

                        kartenLink.appendChild(strasseSpan);
                        kartenLink.appendChild(document.createElement('br'));
                        kartenLink.appendChild(ortSpan);

                        detailParagraph.appendChild(kartenLink);
                    } else {
                        detailParagraph.textContent = detail;
                    }

                    kontaktBox.appendChild(detailParagraph);
                });

                // Die Kontakt-Box dem Grid-Container hinzufügen
                gridContainer.appendChild(kontaktBox);
            });

            // Den Grid-Container zum Hauptcontainer hinzufügen
            kontaktdatenContainer.appendChild(gridContainer);
        })
        .catch(fehler => {
            console.error("Ein Fehler ist aufgetreten:", fehler);
        });
}

// Exportiert die Funktion loadKontaktdaten
export { loadKontaktdaten };

// mapModule.js

const latitude = 48.21165504025604;
const longitude = 9.019498081571752;

function loadMap() {
    // Erstellen der Karte mit den angegebenen Koordinaten
    const map = L.map('map').setView([latitude, longitude], 15);

    // Hinzufügen der OpenStreetMap-Karte zur Karte
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Erstellen eines Markers für den Standort des Imbisses
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Beispiel Imbiss') // Popup-Text, der beim Klicken auf den Marker angezeigt wird
        .openPopup();
}

export { loadMap };

// main.js

// Dieser Abschnitt importiert verschiedene Funktionen aus anderen JavaScript-Modulen. 
// Module helfen dabei, den Code besser zu organisieren und wiederverwendbar zu machen.

// Importiert die `initCart` Funktion aus dem `cartModule.js` Modul
import { initCart } from './cartModule.js';
// Importiert die `initOptionsModal` Funktion aus dem `optionsModalModule.js` Modul
import { initOptionsModal } from './optionsModalModule.js';
// Importiert die `initExtrasModal` Funktion aus dem `extrasModalModule.js` Modul
import { initExtrasModal } from './extrasModalModule.js';
// Importiert die `initializeApplication` Funktion aus dem `initializationModule.js` Modul
import { initializeApplication } from './initializationModule.js';

import { orderViaWhatsApp } from './cartModule.js';
window.orderViaWhatsApp = orderViaWhatsApp;


// Hier definieren wir die Hauptdatenstruktur für den Warenkorb in main.js. 
// Es handelt sich um ein JavaScript-Objekt mit zwei Eigenschaften: items und total.
// - `items`: Dies ist ein Array, das die verschiedenen Artikel im Warenkorb speichert.
// - `total`: Dies ist eine Zahl, die die Gesamtsumme der Artikel im Warenkorb repräsentiert.
const mainCartData = {
    items: [],  // Ein leeres Array, das später mit Artikeln gefüllt wird
    total: 0    // Initialisierung des Gesamtbetrags auf 0
};

/**
 * Dies ist die Hauptfunktion der Anwendung, die beim Start der App aufgerufen wird.
 * Sie initialisiert verschiedene Teile der Anwendung. 
 * Die Anwendung kann entweder durch Aufrufen der einzelnen Initialisierungsfunktionen oder
 * durch Aufrufen der zentralen Initialisierungsfunktion aus dem `initializationModule` gestartet werden.
 */
function startApplication() {
    // Hier rufen wir die zentrale Initialisierungsfunktion auf, 
    // die wir aus dem `initializationModule` importiert haben.
    // Diese Funktion wird wahrscheinlich andere Initialisierungsfunktionen aufrufen 
    // und die Anwendung startklar machen.
    initializeApplication();
}

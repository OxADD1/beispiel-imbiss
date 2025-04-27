// initializationModule.js

// Importieren der benötigten Funktionen und Klassen aus den verschiedenen Modulen
import { initCart } from './cartModule.js';
import { initOptionsModal } from './optionsModalModule.js';
import { initExtrasModal } from './extrasModalModule.js';
import MenuLoader from './MenuLoader.js';

// Hauptfunktion zur Initialisierung der gesamten Anwendung
export function initializeApplication() {
    // Datenstruktur für den Warenkorb
    const mainCartData = {
        items: [],  // Artikel im Warenkorb
        total: 0    // Gesamtpreis der Artikel im Warenkorb
    };

    // Initialisieren des Modals für Produkt-Optionen
    initOptionsModal();

    // Initialisieren des Warenkorbs mit den definierten Daten
    initCart(mainCartData);

    // Initialisieren des Modals für zusätzliche Produkt-Optionen
    initExtrasModal();

    // Laden und Initialisieren des Menüs aus einer JSON-Datei
    initMenu();
}

// URL zur JSON-Datei, die die Menüdaten enthält
const DATA_URL = '../json/menu.json';

// Erstellung eines neuen Events, das ausgelöst wird, sobald das Menü geladen ist
const menuLoadedEvent = new Event('menuLoaded');

// Funktion zum Initialisieren des Menüs
function initMenu() {
    // Einblenden des Ladeindikators durch Hinzufügen der Klasse 'loading' zum Body-Element
    document.body.classList.add("loading");

    // Erstellen einer neuen Instanz des MenuLoader mit der URL und einer Callback-Funktion
    const menuLoader = new MenuLoader(DATA_URL, onDataLoaded);

    // Laden des Menüs
    menuLoader.loadMenu();
}

// Callback-Funktion, die aufgerufen wird, sobald die Menüdaten geladen sind
function onDataLoaded(products) {
    // Ausblenden des Ladeindikators durch Entfernen der Klasse 'loading' vom Body-Element
    document.body.classList.remove("loading");

    // Für jedes Produkt-Element im DOM
    document.querySelectorAll('.product-item').forEach(item => {
        // Füge einen Klick-Event-Listener hinzu
        item.addEventListener('click', function () {
            // Hole die Produkt-ID aus dem data-Attribut des Elements
            const productId = parseInt(this.dataset.productId, 10);

            // Finde das Produkt in den geladenen Produkten anhand der ID
            const product = products.find(p => p.id === productId);

            // Wenn das Produkt gefunden wurde, aktualisiere das Options-Modal mit den Produktinformationen
            if (product) {
                updateOptionsModal(product);
            }
        });
    });

    // Wenn alle Klick-Event-Listener zu den Produkten hinzugefügt wurden, löse das menuLoaded-Event aus
    document.dispatchEvent(menuLoadedEvent);
}

// Füge einen Event-Listener hinzu, der sicherstellt, dass die Anwendung initialisiert wird, sobald der gesamte DOM geladen ist
document.addEventListener('DOMContentLoaded', initializeApplication);

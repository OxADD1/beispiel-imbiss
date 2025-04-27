import { addToCart } from './cartModule.js';
import { ADDITIVES, ALLERGENS } from './infoLists.js';

let activeModal = null; // Aktuelles aktives Modal, initialisiert als null

// Initialer Zustand des Modals ohne ausgewählte Optionen
let state = {
    selectedOptions: []
};

/**
 * Aktualisiert den aktuellen Zustand mit den ausgewählten Optionen.
 */
function saveState() {

    // Sammle alle ausgewählten Optionen
    const selectedOptions = [...document.querySelectorAll('#optionsForm input[type="checkbox"]:checked')]
        .map(checkbox => checkbox.value);

    state = {
        selectedOptions: selectedOptions
    };
}

/**
 * Wendet den gespeicherten Zustand auf das Modal an.
 */
function applyState() {

    // Markiere Checkboxen basierend auf dem gespeicherten Zustand
    state.selectedOptions.forEach(option => {
        const checkbox = document.querySelector(`#optionsForm input[type="checkbox"][value="${option}"]`);
        if (checkbox) checkbox.checked = true;
    });
}


/**
 * Öffnet das Modal mit den Produktinformationen.
 *
 * @param {Object} product Das Produktobjekt
 */
function openModal(product) {
    // Den internen Zustand zurücksetzen, wenn das Modal geöffnet wird
    const state = { selectedOptions: [] };

    // Referenz zum Modal-Element abrufen
    const modalElement = document.querySelector("#optionsModal");

    // Modal-Titel und Produktbeschreibung aktualisieren
    modalElement.querySelector(".modal-title").textContent = product.name;
    document.getElementById("productDescription").textContent = product.description;

    // Überschriften für Optionen, Additive und Allergene initial verstecken
    document.getElementById("optionsTitle").style.display = 'none';
    document.getElementById("additiveTitle").style.display = 'none';
    document.getElementById("allergensTitle").style.display = 'none';

    // Den Inhalt des OptionsForm-Elements im Modal löschen
    const optionsForm = document.querySelector("#optionsForm");
    optionsForm.innerHTML = '';

    // Checkboxen für Optionen erstellen, falls vorhanden
    if (product.options && product.options.length > 0) {
        document.getElementById("optionsTitle").style.display = 'block';
        product.options.forEach(option => {
            const checkboxWrapper = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = checkbox.value = option;

            const label = document.createElement('label');
            label.textContent = option;
            label.htmlFor = option;

            checkboxWrapper.append(checkbox, label);
            optionsForm.appendChild(checkboxWrapper);
        });
    }

    // Referenzen zu den Listen für Additive und Allergene abrufen und zurücksetzen
    const additiveList = document.querySelector("#additiveList");
    const allergensList = document.querySelector("#allergensList");
    additiveList.innerHTML = '';
    allergensList.innerHTML = '';

    // Daten für Additive und Allergene extrahieren (angenommen, diese Daten sind in getDetailsFromOptions enthalten)
    let allAdditives = [];
    let allAllergens = [];
    if (product.options) {
        product.options.forEach(option => {
            const details = getDetailsFromOptions(option);  // Diese Funktion muss existieren
            allAdditives = allAdditives.concat(details.additives || []);
            allAllergens = allAllergens.concat(details.allergens || []);
        });
    }

    // Duplikate entfernen und Listen sortieren
    const uniqueAdditives = [...new Set(allAdditives)].sort();
    const uniqueAllergens = [...new Set(allAllergens)].sort();

    // Additive zur Liste hinzufügen, falls vorhanden
    if (uniqueAdditives.length > 0) {
        document.getElementById("additiveTitle").style.display = 'block';
        uniqueAdditives.forEach(additive => {
            const li = document.createElement('li');
            li.textContent = additive;
            additiveList.appendChild(li);
        });
    }

    // Allergene zur Liste hinzufügen, falls vorhanden
    if (uniqueAllergens.length > 0) {
        document.getElementById("allergensTitle").style.display = 'block';
        uniqueAllergens.forEach(allergen => {
            const li = document.createElement('li');
            li.textContent = allergen;
            allergensList.appendChild(li);
        });
    }

    // Modal anzeigen
    const activeModal = new bootstrap.Modal(modalElement);
    activeModal.show();

    // Event Listener für den Speichern-Button hinzufügen, falls noch nicht geschehen
    if (!modalElement.dataset.eventListenerAdded) {
        document.getElementById("saveOptions").addEventListener('click', function () {
            saveOptions(product);  // Diese Funktion muss existieren
        });
        modalElement.dataset.eventListenerAdded = "true";
    }
}







function getDetailsFromOptions(option) {
    const matches = option.match(/\((.*?)\)/);
    if (!matches) return { additives: [], allergens: [] };

    const data = matches[1].split(',');

    // Verwenden Sie Sets, um Duplikate zu vermeiden
    let details = { additives: new Set(), allergens: new Set() };

    data.forEach(item => {
        if (ADDITIVES[item]) {
            details.additives.add(ADDITIVES[item]);
        } else if (ALLERGENS[item]) {
            details.allergens.add(ALLERGENS[item]);
        }
    });

    // Konvertieren Sie Sets zurück zu Arrays, sortieren Sie diese und geben Sie das Ergebnis zurück
    return {
        additives: [...details.additives].sort(),
        allergens: [...details.allergens].sort()
    };
}




/**
 * Speichert die ausgewählten Optionen und Extras zum Produkt und fügt sie dem Warenkorb hinzu.
 *
 * @param {Object} product Das Produktobjekt
 */
function saveOptions(product) {

    // Wert aus #extrasText holen
    const extrasTextInput = document.querySelector("#extrasText").value.split('\n').map(e => e.trim());


    // Starten Sie mit dem Basispreis des Produkts
    let totalPrice = product.price;

    const selectedOptions = [...document.querySelectorAll('#optionsForm input[type="checkbox"]:checked')]
        .map(checkbox => {
            // Verwendung eines regulären Ausdrucks, um Preise im europäischen Format (z.B. "0,50€") zu erkennen.
            const priceMatch = checkbox.value.match(/(\d+,\d+)€/);

            // Wenn ein Preis gefunden wurde...
            if (priceMatch) {
                // ... den Preis ins Standardformat umwandeln und zum Gesamtpreis hinzufügen.
                const optionPrice = parseFloat(priceMatch[1].replace(',', '.'));
                totalPrice += optionPrice;
            }

            // Den Wert der Checkbox zurückgeben
            return checkbox.value;
        });

    // Hole die ausgewählte Menge aus dem Dropdown und konvertiere sie in eine Zahl
    const selectedQuantity = parseInt(document.getElementById("productQuantity").value);
    
    const productObj = {
        name: product.name,
        price: totalPrice,  
        checkboxOptions: selectedOptions,             // Ausgewählte Optionen über Checkboxen
        userEnteredExtras: extrasTextInput            // Vom Benutzer eingegebene Extras
    };
    

    addToCart(productObj, selectedQuantity);  // Füge das Produkt dem Warenkorb hinzu

    closeModal();

    // Setzen Sie den Wert von extrasText zurück
    document.querySelector("#extrasText").value = "";

    // Seite neu laden
    window.location.reload();
}


/**
 * Schließt das aktive Modal.
 */
function closeModal() {

    if (activeModal) {
        activeModal.hide(); // Verwende die Bootstrap-API, um das Modal zu schließen
        activeModal = null;
    } 
}

// Event-Delegation für das Öffnen des Modals
document.body.addEventListener('click', function(event) {
    let target = event.target;
    while (target !== this) {
        if (target.classList.contains('open-options-button')) {
            openModal({
                id: target.dataset.productId,
                name: target.dataset.productName,
                price: parseFloat(target.dataset.price),
                description: target.dataset.productDescription,
                options: target.dataset.options.split(',')
            });
            return;
        }
        target = target.parentNode;
    }
});


/**
 * Initialisiert das Modal und fügt den Schließ-Button-Listener hinzu.
 */
function initOptionsModal() {

    const closeButton = document.querySelector("#closeOptionsModal");
    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    } 
}

// Wenn das Dokument geladen ist, initialisiere das Modal
document.addEventListener('DOMContentLoaded', (event) => {
    initOptionsModal();
});

export {
    openModal,
    closeModal,
    initOptionsModal
};

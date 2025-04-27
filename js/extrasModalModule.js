// extrasModalModule.js

// Globale Variable für die Bootstrap-Modal-Instanz des Extras-Modals
let extrasBsModal;

/**
 * Öffnet das Extras-Modal mit Hilfe von Bootstrap.
 */
function openExtrasModal() {
    let modalElement = document.querySelector("#extrasModal"); // Das DOM-Element des Extras-Modals

    // Wenn das Modal-Element existiert, wird eine neue Bootstrap-Modal-Instanz erstellt und angezeigt.
    if (modalElement) {
        extrasBsModal = new bootstrap.Modal(modalElement);
        
        // Füge einen Event-Listener hinzu, um den Fokus auf das Textfeld zu setzen, sobald das Modal geöffnet ist.
        modalElement.addEventListener('shown.bs.modal', function() {
            document.querySelector("#extrasText").focus();
        });
        
        extrasBsModal.show();
    }
}


/**
 * Schließt das Extras-Modal.
 */
function closeExtrasModal() {
    // Wenn die Bootstrap-Modal-Instanz existiert, wird sie geschlossen.
    if (extrasBsModal) {
        extrasBsModal.hide();
    }
}

/**
 * Speichert den Inhalt des Textbereichs des Extras-Modals in einem Anzeigeelement.
 */
/**
 * Speichert den Inhalt des Textbereichs des Extras-Modals in einem Anzeigeelement.
 */
function saveExtras() {
    // Auswahl der Textbereichs- und Anzeigeelemente
    let extrasTextarea = document.querySelector("#extrasText");
    let displayElement = document.querySelector("#extraOptionsDisplay");

    // Wenn beide Elemente existieren, wird der Inhalt des Textbereichs im Anzeigeelement angezeigt.
    if (extrasTextarea && displayElement) {
        let extrasValue = extrasTextarea.value.trim(); // trim entfernt überflüssige Leerzeichen
        if (extrasValue) { // Überprüft, ob extrasValue nicht leer ist
            displayElement.textContent = "Extras: " + extrasValue;
        } else {
            displayElement.textContent = ""; // Wenn nichts eingegeben wurde, bleibt das Anzeigeelement leer
        }
    }
}


/**
 * Initialisiert das Extras-Modal, indem Event-Listener für verschiedene Schaltflächen hinzugefügt werden.
 */
function initExtrasModal() {
    // Hinzufügen eines Event-Listeners zum Öffnen des Extras-Modals
    let openExtrasButton = document.querySelector(".btn-icon");
    if (openExtrasButton) {
        openExtrasButton.addEventListener("click", openExtrasModal);
    }

    // Hinzufügen eines Event-Listeners zum Schließen des Extras-Modals
    let closeButton = document.querySelector("#closeExtrasModal");
    if (closeButton) {
        closeButton.addEventListener("click", closeExtrasModal);
    }

    // Hinzufügen eines Event-Listeners zum Speichern des Inhalts des Textbereichs und zum Schließen des Modals
    let saveButton = document.querySelector("#saveExtras");
    if (saveButton) {
        saveButton.addEventListener("click", function() {
            saveExtras();
            closeExtrasModal(); // Das Modal wird geschlossen, nachdem die Extras gespeichert wurden.
        });
    }
}

// Exportieren der Funktionen, um sie in anderen Modulen verwenden zu können.
export {
    openExtrasModal,
    closeExtrasModal,
    saveExtras,
    initExtrasModal
};

// Erstelle Referenzen zu den benötigten DOM-Elementen
const optionsModal = document.getElementById('optionsModal');  // Das Hauptmodal
const modalTitle = document.querySelector("#optionsModal .modal-title"); // Der Titelbereich des Modals
const optionsForm = document.getElementById('optionsForm'); // Das Formular innerhalb des Modals
const extraOptionsDisplay = document.getElementById('extraOptionsDisplay'); // Bereich zur Anzeige zusätzlicher Optionen

// Erstelle eine einzige Instanz des Modals, die immer verwendet wird, 
// um zu verhindern, dass Daten verloren gehen oder neu erstellt werden.
const optionsModalInstance = new bootstrap.Modal(optionsModal);

// Speichere die aktuelle Produkt-ID global, um sie später beim Hinzufügen zum Warenkorb zu nutzen
let currentProductId;

/**
 * Diese Funktion aktualisiert das Modal mit den Optionen des ausgewählten Produkts.
 * @param {Object} product - Das Produktobjekt mit notwendigen Informationen.
 */
function updateOptionsModal(product) {
    modalTitle.textContent = product.name; // Setze den Titel des Modals
    currentProductId = product.id; // Aktualisiere die aktuelle Produkt-ID

    // Wenn das Produkt Optionen besitzt, erstelle Checkboxen für jede Option
    let checkboxesHtml = '';
    if(product.options && product.options.length > 0) {
        product.options.forEach(option => {
            checkboxesHtml += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${option.name}" id="${option.id}">
                    <label class="form-check-label" for="${option.id}">
                        ${option.name}
                    </label>
                </div>`;
        });
    }
    optionsForm.innerHTML = checkboxesHtml; // Füge die erstellten Checkboxen zum Formular hinzu
    extraOptionsDisplay.textContent = '';

    // Öffne das Modal
    optionsModalInstance.show();
}

// Wenn der "Speichern"-Button geklickt wird, lies die ausgewählten Optionen aus und füge sie dem Warenkorb hinzu
const saveOptionsBtn = document.getElementById('saveOptions');
saveOptionsBtn.addEventListener('click', function() {
    const selectedOptions = []; // Liste der ausgewählten Optionen
    optionsForm.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        selectedOptions.push(checkbox.value);
    });

    // Füge das Produkt und die ausgewählten Optionen zum Warenkorb hinzu
    addToCart({
        productId: currentProductId,
        productName: modalTitle.textContent,
        options: selectedOptions
    });
});

/**
 * Eine Hilfsfunktion, die das ausgewählte Produkt und seine Optionen dem Warenkorb hinzufügt.
 * @param {Object} item - Das Produktobjekt, das hinzugefügt werden soll.
 */
function addToCart(item) {
    const cartItemsList = document.getElementById('cart-items'); // Warenkorb-Liste
    const cartItemHtml = `
        <li>
            ${item.productName} 
            ${item.options.length > 0 ? `<p>Extras: ${item.options.join(', ')}</p>` : ''}
        </li>
    `;
    cartItemsList.insertAdjacentHTML('beforeend', cartItemHtml); // Füge das Produkt der Warenkorb-Liste hinzu
}

/**
 * Funktion zum Initialisieren des Produkt-Modals.
 * Dies könnte das Hinzufügen von EventListeners beinhalten, um das Modal zu öffnen, wenn ein Produkt gewählt wird.
 */
function initProductModal() {
    // Hier könnten Sie z.B. einen EventListener hinzufügen, um das Modal zu öffnen.
    // Dies ist nur ein Platzhalter und muss Ihren Bedürfnissen entsprechend angepasst werden.
}

// Exportiere die nötigen Funktionen, um sie in anderen Modulen nutzbar zu machen.
export {
    updateOptionsModal,
    initProductModal
};

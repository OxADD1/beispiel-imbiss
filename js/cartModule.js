// Importiere benötigte Funktionen aus storageModule.js
import { saveToLocalStorage, loadFromLocalStorage } from './storageModule.js';

// Importiere TableManagement Modul
import TableManagement from './tableManagement.js';


// UI-Elemente definieren
const cartPanel = document.getElementById('cart-panel');
const smallCartIcon = document.querySelector('#small-cart-icon');
const largeCartIcon = document.querySelector('#large-cart-icon');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountElement = document.getElementById('total-amount');
const smallCartCountElement = document.getElementById('small-cart-count');
const largeCartCountElement = document.getElementById('large-cart-count');
const timeSelect = document.getElementById('pickupTime');
const STUDENT_DISCOUNT = 1.5;



// Anfangsstruktur des Warenkorb-Objekts
const cart = {
    items: [],
    total: 0,
    tableNumber: null
};

function updateCartCount() {
    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    if (smallCartCountElement) {
        smallCartCountElement.textContent = `${itemCount}`;
    }
    if (largeCartCountElement) {
        largeCartCountElement.textContent = `${itemCount}`;
    }
}

let isStudentDiscountApplied = false;

function applyStudentDiscount() {
    if (!isStudentDiscountApplied) {
        cart.total -= STUDENT_DISCOUNT;
        isStudentDiscountApplied = true;
        displayDiscountInCart();
    }
}

function removeStudentDiscount() {
    if (isStudentDiscountApplied) {
        cart.total += STUDENT_DISCOUNT;
        isStudentDiscountApplied = false;
        hideDiscountInCart();
    }
}

function displayDiscountInCart() {
    const cartItemsContainer = document.getElementById('cart-items');

    // Überprüfen, ob der Rabatt bereits angezeigt wird
    const existingDiscountElement = document.getElementById('studentDiscountItem');
    if (existingDiscountElement) return; // Beenden Sie die Funktion, wenn der Rabatt bereits angezeigt wird

    // Neues Listen-Element für den Schülerrabatt erstellen
    const discountItem = document.createElement('li');
    discountItem.id = 'studentDiscountItem';  // ID hinzufügen, um es später leichter finden zu können
    discountItem.textContent = `Schülerrabatt: -${STUDENT_DISCOUNT}€`;
    cartItemsContainer.appendChild(discountItem);
}

function hideDiscountInCart() {
    const discountItem = document.getElementById('studentDiscountItem');
    if (discountItem) {
        discountItem.remove();  // Entfernen Sie das Element, wenn es gefunden wird
    }
}


const hourSelect = document.getElementById('pickupHour');
const minuteSelect = document.getElementById('pickupMinute');
const deliveryCheckbox = document.getElementById('deliveryCheckbox');
const timeLabel = document.getElementById('timeLabel');
const deliveryCostContainer = document.querySelector('.delivery-cost-container');
const totalAmount = document.getElementById('total-amount');


function generateTimeDropdowns() {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    // Lösche vorherige Optionen
    hourSelect.innerHTML = '';
    minuteSelect.innerHTML = '';

    // Wenn außerhalb der Öffnungszeiten, füge "geschlossen" hinzu und beende die Funktion
    if (currentHour < 10 || (currentHour === 23 && currentMinute > 0)) {
        timeLabel.textContent = "Abholzeit: geschlossen";
        hourSelect.style.display = 'none';
        minuteSelect.style.display = 'none';
        return;
    }

    // Stellen Sie den ursprünglichen Label-Text wieder her
    timeLabel.textContent = "Abholzeit:";
    hourSelect.style.display = 'inline';
    minuteSelect.style.display = 'inline';

    // Beginnzeit für Dropdown festlegen
    let startHour = currentHour;
    let startMinute = currentMinute;

    // Füllen des Stunden-Dropdown-Menüs
    for (let i = startHour; i <= 22; i++) {
        const hourOption = document.createElement('option');
        hourOption.value = i;
        hourOption.textContent = i < 10 ? '0' + i : i;
        hourSelect.appendChild(hourOption);
    }

    // Füllen des Minuten-Dropdown-Menüs
    for (let i = startMinute; i < 60; i++) {
        const minuteOption = document.createElement('option');
        minuteOption.value = i;
        minuteOption.textContent = i < 10 ? '0' + i : i;
        minuteSelect.appendChild(minuteOption);
    }
}

generateTimeDropdowns();
setInterval(generateTimeDropdowns, 60 * 1000);  // Alle 60 Sekunden aktualisieren

deliveryCheckbox.addEventListener('change', function () {
    if (deliveryCheckbox.checked) {
        timeLabel.textContent = 'Lieferzeit:';
        deliveryCostContainer.style.display = 'block';
        updateTotalAmount(deliveryCostValue);
    } else {
        timeLabel.textContent = 'Abholzeit:';
        deliveryCostContainer.style.display = 'none';
        updateTotalAmount(-deliveryCostValue);
    }
});


function updateTotalAmount(change) {
    let currentAmount = parseFloat(totalAmount.textContent.split('€')[0].split(':')[1].trim());
    currentAmount += change;
    totalAmount.textContent = `Gesamtsumme: ${currentAmount.toFixed(2)}€`;
}

document.getElementById("deliveryCheckbox").addEventListener("change", function () {
    if (this.checked) {
        document.querySelector(".delivery-cost-container").style.display = "block";
        document.querySelector(".delivery-address-container").style.display = "block";
        document.getElementById("timeLabel").textContent = "Lieferzeit:";
    } else {
        document.querySelector(".delivery-cost-container").style.display = "none";
        document.querySelector(".delivery-address-container").style.display = "none";
        document.getElementById("timeLabel").textContent = "Abholzeit:";
    }
});


let currentCartItem = null;
const deliveryCostValue = 2; // Lieferkosten in Euro
const MIN_ORDER_VALUE = 15; // Mindestbestellwert in Euro


function renderCart() {
    // === 1. HTML-Elemente initialisieren ===
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const deliveryCheckbox = document.getElementById('deliveryCheckbox');
    const deliveryCostContainer = document.querySelector('.delivery-cost-container');
    const deliveryAddressContainer = document.querySelector('.delivery-address-container');

    // === 0. Tischnummer anzeigen ===
    const tableNumberElement = document.getElementById('table-number');
    let tableNumber = localStorage.getItem('tableNumber');
    const deliveryOptionDiv = document.querySelector('.delivery-option');
    const pickupTimeContainer = document.querySelector('.pickupTime-container');

    if (tableNumber) {
        tableNumberElement.textContent = `Tischnummer: ${tableNumber}`;
        tableNumberElement.style.display = 'block';
        // Verstecke Lieferoption und Abholzeit, wenn eine Tischnummer vorhanden ist
        deliveryOptionDiv.style.display = 'none';
        pickupTimeContainer.style.display = 'none';
    } else {
        tableNumberElement.style.display = 'none';
        // Zeige Lieferoption und Abholzeit, wenn keine Tischnummer vorhanden ist
        deliveryOptionDiv.style.display = 'block';
        pickupTimeContainer.style.display = 'block';
    }

    // === 2. Event Listener für Schülerrabatt ===
    // Abhängigkeiten: Gesamtpreisberechnung
    // Dieser Abschnitt reagiert auf die Auswahl des Schülerrabattes. 
    // Tipp: Bei Rabattänderungen sollte dieser Event Listener angepasst werden.
    const studentDiscountCheckbox = document.getElementById('studentDiscountCheckbox');

    // Fügt einen Event Listener hinzu, um den Rabatt zu berechnen, basierend auf dem Zustand der Schülerrabatt-Checkbox.
    studentDiscountCheckbox.addEventListener('change', function () {
        if (this.checked) {
            applyStudentDiscount();  // Wenn die Checkbox aktiviert ist, Rabatt anwenden.
        } else {
            removeStudentDiscount();  // Wenn die Checkbox deaktiviert ist, Rabatt entfernen.
        }
        saveCart();  // Den aktuellen Zustand des Warenkorbs speichern (nicht im gezeigten Code enthalten).
        renderCart();  // Aktualisiert die Anzeige des Warenkorbs.
    });

    // === 3. Event Listener für Lieferoptionen ===
    // Abhängigkeiten: Mindestbestellwert
    // Hier überprüfen wir die Auswahl der Lieferoption und den Mindestbestellwert.
    // Tipp: Bei Änderungen der Lieferkosten sollten Sie die Logik hier anpassen.
    deliveryCheckbox.addEventListener('change', function () {
        const total = calculateTotal();  // Gesamtbetrag ohne Lieferkosten berechnen.
        if (this.checked) {
            if (total < MIN_ORDER_VALUE) {
                // Benachrichtigt den Benutzer, wenn der Mindestbetrag für die Lieferung nicht erreicht ist.
                alert(`Um die Lieferoption zu nutzen, muss der Mindestbestellwert ${MIN_ORDER_VALUE}€ betragen!`);
                this.checked = false;
                deliveryCostContainer.style.display = 'none';  // Versteckt die Lieferkosten.
                deliveryAddressContainer.style.display = 'none';  // Versteckt die Lieferadresse.
            } else {
                deliveryCostContainer.style.display = 'block';  // Zeigt die Lieferkosten an.
                deliveryAddressContainer.style.display = 'block';  // Zeigt die Lieferadresse an.
            }
        } else {
            deliveryCostContainer.style.display = 'none';  // Versteckt die Lieferkosten.
            deliveryAddressContainer.style.display = 'none';  // Versteckt die Lieferadresse.
        }
        renderCart();  // Aktualisiert die Anzeige des Warenkorbs.
    });

    // === 4. Warenkorbartikel anzeigen ===
    // Abhängigkeiten: Produktdatenbank/Produktliste
    // Jeder Artikel im Warenkorb wird dargestellt. 
    // Tipp: Bei Designänderungen passen Sie die Darstellung innerhalb dieser Schleife an.
    cartItemsContainer.innerHTML = '';

    // Geht jeden Artikel im Warenkorb durch und erstellt entsprechende HTML-Elemente zur Anzeige.
    cart.items.forEach((item, index) => {
        // Hier wird ein Listen-Element erstellt, das Informationen zu jedem Artikel im Warenkorb enthält.
        const listItem = document.createElement('li');
        listItem.className = 'cart-item';  // CSS-Klasse zuweisen für Styling.

        // Zeigt den Artikelnamen fett an.
        const productNameBold = document.createElement('span');
        productNameBold.className = 'cart-item-name';
        productNameBold.textContent = `${index + 1}. ${item.product.name}`;
        listItem.appendChild(productNameBold);

        // Zeigt den Preis und die Anzahl der Artikel an.
        listItem.appendChild(document.createTextNode(` = ${item.product.price * item.quantity}€ x`));

        // Dropdown-Menü zur Auswahl der Menge des Artikels.
        const quantitySelect = document.createElement('select');
        quantitySelect.className = 'quantity-select';
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === item.quantity) {
                option.selected = true;  // Setzt die aktuelle Menge als ausgewählt.
            }
            quantitySelect.appendChild(option);
        }

        // Aktualisiert den Warenkorb, wenn sich die Menge des Artikels ändert.
        quantitySelect.addEventListener('change', function () {
            item.quantity = parseInt(this.value);
            calculateTotal();
            saveCart();
            renderCart();
        });
        listItem.appendChild(quantitySelect);

        // Fügt ein Mülleimer-Icon hinzu, um Artikel aus dem Warenkorb zu entfernen.
        const trashCanIcon = document.createElement('i');
        trashCanIcon.className = 'fa-regular fa-trash-can trash-can-icon';
        trashCanIcon.addEventListener('click', function () {
            removeFromCart(item.product);
        });
        listItem.appendChild(trashCanIcon);


        cartItemsContainer.appendChild(listItem);

        // Verarbeitet und zeigt Checkbox-Optionen für Produkte an.
        let checkboxOptionsArray = Array.isArray(item.product.checkboxOptions)
            ? item.product.checkboxOptions
            : (item.product.checkboxOptions || '').split(', ');

        checkboxOptionsArray.forEach(option => {
            // Hier wird ein Listen-Element für jede Checkbox-Option erstellt.
            const optionItem = document.createElement('li');
            optionItem.className = 'option-item';
            optionItem.textContent = `- ${option}`;

            // Fügt ein Symbol zum Entfernen der Checkbox-Option hinzu.
            const removeCheckboxOptionsIcon = document.createElement('i');
            removeCheckboxOptionsIcon.className = 'fa-regular fa-circle-xmark remove-checkbox-option-icon';
            removeCheckboxOptionsIcon.addEventListener('click', function () {
                const index = item.product.checkboxOptions.indexOf(option);
                if (index !== -1) {
                    item.product.price -= getExtraPrice(option);
                    item.product.checkboxOptions.splice(index, 1);
                }
                calculateTotal();
                saveCart();
                renderCart();
            });
            optionItem.appendChild(removeCheckboxOptionsIcon);
            cartItemsContainer.appendChild(optionItem);
        });

        // Verarbeitet und zeigt benutzerdefinierte Extras für Produkte an.
        let userEnteredExtrasArray = Array.isArray(item.product.userEnteredExtras)
            ? item.product.userEnteredExtras
            : (item.product.userEnteredExtras || '').split(', ');

        if (userEnteredExtrasArray.length) {
            // Hier wird ein Listen-Element erstellt, das benutzerdefinierte Extras anzeigt.
            const extrasTitleItem = document.createElement('li');
            extrasTitleItem.className = 'extras-title';
            extrasTitleItem.textContent = 'Benutzerdefinierte Extras:';
            extrasTitleItem.style.textDecoration = 'underline';
            // Fügt ein Symbol hinzu, um benutzerdefinierte Extras hinzuzufügen.
            const addExtraIcon = document.createElement('i');
            addExtraIcon.className = 'fa-regular fa-pen-to-square add-extra-icon';
            addExtraIcon.title = 'Benutzerdefinierte Extras hinzufügen';

            addExtraIcon.addEventListener('click', function () {
                const modalElement = document.getElementById('extraModulWarenkorb');
                const modal = new bootstrap.Modal(modalElement);

                // Füge einen Event-Listener hinzu, um den Fokus auf das Textarea zu setzen, sobald das Modal geöffnet ist.
                modalElement.addEventListener('shown.bs.modal', function () {
                    document.querySelector("#extrasTextarea").focus();
                });

                modal.show();
                currentCartItem = item;  // Speichert den aktuellen Artikel für spätere Verwendung.
            });


            extrasTitleItem.appendChild(addExtraIcon);
            cartItemsContainer.appendChild(extrasTitleItem);
        }

        userEnteredExtrasArray.forEach(extra => {
            // Zeigt jedes benutzerdefinierte Extra in der Liste an.
            if (extra.trim()) {
                const extraItem = document.createElement('li');
                extraItem.className = 'extra-item';
                extraItem.textContent = `- ${extra}`;

                // Fügt ein Symbol zum Entfernen des benutzerdefinierten Extras hinzu.
                const removeExtrasIcon = document.createElement('i');
                removeExtrasIcon.className = 'fa-regular fa-circle-xmark remove-extra-icon';
                removeExtrasIcon.addEventListener('click', function () {
                    const index = item.product.userEnteredExtras.indexOf(extra);
                    if (index !== -1) {
                        item.product.userEnteredExtras.splice(index, 1);
                    }
                    calculateTotal();
                    saveCart();
                    renderCart();
                });
                extraItem.appendChild(removeExtrasIcon);
                cartItemsContainer.appendChild(extraItem);
            }
        });

        // Fügt eine Trennlinie nach jedem Artikel im Warenkorb hinzu.
        const separator = document.createElement('hr');
        cartItemsContainer.appendChild(separator);
    });

    // Zeigt den Schülerrabatt im Warenkorb an, wenn er aktiviert ist.
    if (studentDiscountCheckbox.checked && isStudentDiscountApplied) {
        const discountLi = document.createElement('li');
        discountLi.className = 'discount-item';
        discountLi.textContent = `Schüler-Rabatt: -${STUDENT_DISCOUNT}€`;
        cartItemsContainer.appendChild(discountLi);
    }

    // Zeigt den Gesamtpreis im Warenkorb an.
    totalAmountElement.textContent = `Gesamtpreis: ${calculateTotal()}€`;

    // Setzt Event-Listener für die Buttons zum Schließen und Speichern im Extras-Modal.
    const modal = new bootstrap.Modal(document.getElementById('extraModulWarenkorb'));
    document.getElementById('closeExtrasBtn').addEventListener('click', function () {
        let modalElement = document.getElementById('extraModulWarenkorb');
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    });
    document.getElementById('saveExtrasBtn').addEventListener('click', function () {
        // Speichert die im Modal eingegebenen Extras.
        const extrasTextarea = document.getElementById('extrasTextarea');


        if (currentCartItem && extrasTextarea.value.trim()) {
            if (!Array.isArray(currentCartItem.product.userEnteredExtras)) {
                currentCartItem.product.userEnteredExtras = [];
            }
            const extrasArray = extrasTextarea.value.split(',').map(extra => extra.trim());
            currentCartItem.product.userEnteredExtras = currentCartItem.product.userEnteredExtras.concat(extrasArray);



            // Speichert den aktuellen Zustand des Warenkorbs im localStorage.
            saveCart();

        }

        // Schließt das Modal und aktualisiert den Warenkorb.
        const modal = bootstrap.Modal.getInstance(document.getElementById('extraModulWarenkorb'));
        if (modal) {
            modal.hide();
        }
        renderCart();
    });

}


function addToCart(product, quantity) {


    // Suche nach einem Artikel im Warenkorb, der denselben Produkt-Namen, Checkbox-Optionen und Benutzereingaben hat.
    const item = cart.items.find(item =>
        item.product.name === product.name &&
        JSON.stringify(item.product.checkboxOptions) === JSON.stringify(product.checkboxOptions) &&
        JSON.stringify(item.product.userEnteredExtras) === JSON.stringify(product.userEnteredExtras)
    );

    if (item) {
        item.quantity += quantity;
    } else {
        cart.items.push({ product, quantity });
    }

    calculateTotal();
    saveCart();
    renderCart();
    // Aktualisieren Sie die Anzahl der Artikel im Warenkorb
    updateCartCount();

    // Das Gerät kurz (200 Millisekunden) vibrieren lassen
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(200);
    }
}



function getExtraPrice(extraString) {
    const priceMatch = extraString.match(/(\d+,\d{2})€/);
    if (priceMatch) {
        return parseFloat(priceMatch[1].replace(',', '.'));
    }
    return 0;
}



function removeExtraFromCartItem(productName) {
    // Finden des Produkts anhand des Namens
    const itemIndex = cart.items.findIndex(item => item.product.name === productName);

    if (itemIndex !== -1) {
        const extraPrice = getExtraPrice(cart.items[itemIndex].product.options);

        // Aktualisiere den Gesamtpreis des Artikels
        cart.items[itemIndex].product.price -= extraPrice;

        // Lösche die Optionen des ausgewählten Artikels
        cart.items[itemIndex].product.options = "";

        // Wenn nach dem Löschen von Extras keine weiteren Daten zum Artikel vorhanden sind, 
        // können Sie den Artikel auch aus dem Warenkorb entfernen
        if (!cart.items[itemIndex].product.name && !cart.items[itemIndex].product.price) {
            cart.items.splice(itemIndex, 1);
        }

        calculateTotal();  // Neu berechnen nachdem das Extra entfernt wurde
        saveCart();
    }
}


function calculateTotal() {
    // Zunächst den Gesamtpreis ohne jegliche Rabatte oder Lieferkosten berechnen
    cart.total = cart.items.reduce((acc, curr) => {
        const productTotal = curr.product.price * curr.quantity;

        // Preis für Checkbox-Optionen hinzufügen
        const checkboxOptionsPrice = (curr.product.checkboxOptions || []).reduce((acc, option) => {
            return acc + getExtraPrice(option);
        }, 0) * curr.quantity;

        // Preis für benutzerdefinierte Extras hinzufügen
        const userExtrasPrice = (curr.product.userEnteredExtras || []).reduce((acc, extra) => {
            return acc + getExtraPrice(extra);
        }, 0) * curr.quantity;

        return acc + productTotal + checkboxOptionsPrice + userExtrasPrice;
    }, 0);

    // Schülerrabatt anwenden, wenn die Checkbox ausgewählt ist
    if (isStudentDiscountApplied) {
        cart.total -= 1.5;  // Schülerrabatt abziehen
    }

    // Wenn Lieferung ausgewählt wurde und der Gesamtpreis 15€ oder mehr beträgt, dann Lieferkosten hinzufügen
    if (deliveryCheckbox.checked && cart.total >= 15) {
        cart.total += 2; // Lieferkosten hinzufügen
    }
    return cart.total;
}



function saveCart() {
    saveToLocalStorage('userCart', cart);
}

function removeFromCart(product) {
    // Findet den Index des Artikels im Warenkorb
    const index = cart.items.findIndex(item => item.product.name === product.name);

    // Entfernt den Artikel aus dem Warenkorb, wenn er gefunden wurde
    if (index !== -1) {
        cart.items.splice(index, 1);
    }

    // Berechnet den Gesamtpreis neu und speichert den aktualisierten Warenkorb
    calculateTotal();
    saveCart();

    // Rendert den Warenkorb neu
    renderCart();
    // Aktualisieren Sie die Anzahl der Artikel im Warenkorb
    updateCartCount();
}


function clearCart() {
    cart.items = [];
    cart.total = 0;
    saveCart();
    renderCart();
    // Aktualisieren Sie die Anzahl der Artikel im Warenkorb
    updateCartCount();
}

function initCart() {
    const savedCart = loadFromLocalStorage('userCart');
    if (savedCart) {
        cart.items = savedCart.items || [];
        cart.total = savedCart.total || 0;

    }
    renderCart();
    // Aktualisieren Sie die Anzahl der Artikel im Warenkorb
    updateCartCount();
    initCartUI();
}

function initCartUI() {
    // Überprüfung für kleine Displays
    if (smallCartIcon) {
        smallCartIcon.addEventListener('click', function () {
            cartPanel.classList.toggle('show');
        });
    }

    // Überprüfung für große Displays
    if (largeCartIcon) {
        largeCartIcon.addEventListener('click', function () {
            cartPanel.classList.toggle('show');
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function () {
            cartPanel.classList.remove('show');
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function (event) {
            event.preventDefault();
            clearCart();
        });
    }
}


// Funktion zum Speichern des Lieferpreises und der Adresse im Local Storage
function saveDeliveryDetails(price, address) {
    localStorage.setItem('deliveryPrice', price);
    localStorage.setItem('deliveryAddress', address);
}

// Funktion zum Abrufen des Lieferpreises und der Adresse aus dem Local Storage
function getDeliveryDetails() {
    const price = parseFloat(localStorage.getItem('deliveryPrice') || "0");
    const address = localStorage.getItem('deliveryAddress') || "";
    return { price, address };
}

function generateInvoiceNumber() {
    return Math.floor(Math.random() * 9999) + 1;
}


function formatCartForWhatsApp() {
    // Funktion zur Generierung einer zufälligen Rechnungsnummer
    function generateInvoiceNumber() {
        return Math.floor(Math.random() * 9999) + 1;
    }

    // Abschnitt zum Abholen der Tischnummer aus dem Local Storage
    const storedTableNumber = localStorage.getItem('tableNumber');

    // Entscheidung, welche Rechnungsnummer oder Tischnummer zu verwenden ist
    let invoiceNumber = storedTableNumber ? `Tischnummer: ${storedTableNumber}` : `Rechnungsnummer: ${generateInvoiceNumber()}`;

    // Initialisierung der Nachricht
    let message = `${invoiceNumber}\n\nHallo! Ich möchte folgende Artikel bestellen:\n\n`;

    // Abschnitt zum Hinzufügen der Artikel zum Nachrichtentext
    cart.items.forEach((item, index) => {
        message += `${index + 1}. ${item.product.name} x${item.quantity} = ${item.product.price * item.quantity}€\n`;

        if (item.product.checkboxOptions && item.product.checkboxOptions.length) {
            item.product.checkboxOptions.forEach(option => {
                message += `- ${option}\n`;
            });
        }

        if (item.product.userEnteredExtras && item.product.userEnteredExtras.length && item.product.userEnteredExtras[0] !== "") {
            message += "Benutzerdefinierte Extras:\n";
            item.product.userEnteredExtras.forEach(extra => {
                message += `- ${extra}\n`;
            });
        }

        message += "\n";
    });

    // Abschnitt zum Überprüfen der Liefer- oder Abholoptionen
    const isDelivery = document.getElementById('deliveryCheckbox').checked;
    if (isDelivery) {
        const deliveryTimeHour = document.getElementById('pickupHour').value;
        const deliveryTimeMinute = document.getElementById('pickupMinute').value;
        message += `Lieferzeit: ${deliveryTimeHour}:${deliveryTimeMinute}\n`;
        message += `Lieferpreis: ${document.getElementById('delivery-cost').textContent}\n`;
        message += `Lieferadresse: ${document.getElementById('deliveryAddress').value}\n`;
    } else {
        const pickupTimeHour = document.getElementById('pickupHour').value;
        const pickupTimeMinute = document.getElementById('pickupMinute').value;
        message += `Abholzeit: ${pickupTimeHour}:${pickupTimeMinute}\n`;
    }

    // Abschnitt zum Überprüfen des Schülerrabatts
    const studentDiscountCheckbox = document.getElementById('studentDiscountCheckbox');
    if (studentDiscountCheckbox.checked) {
        message += `Schülerrabatt: -${STUDENT_DISCOUNT}€\n`;
    }

    // Abschnitt zum Hinzufügen der Gesamtsumme
    message += `Gesamtsumme inkl. ${isDelivery ? 'Lieferung' : 'Abholung'}: ${cart.total + (isDelivery ? 2 : 0)}€`;

    return message;
}



/**
 * Sendet den Inhalt des Warenkorbs als formatierte Nachricht über WhatsApp.
 *
 * @param {Event} event - Das Event-Objekt, das automatisch übergeben wird, wenn diese Funktion als Event-Handler aufgerufen wird.
 */
function orderViaWhatsApp(event) {
    // Verhindert das Standardverhalten des Formularabsendens, was die Seite neu laden würde.
    event.preventDefault();

    // Ruft die Funktion auf, die den aktuellen Warenkorb in eine formatierte Nachricht für WhatsApp umwandelt.
    const message = formatCartForWhatsApp();

    // Die Telefonnummer, an die die Bestellung gesendet wird.
    const phoneNumber = '+4915123676333';

    // Erstellt die URL für die WhatsApp-API, um eine Nachricht zu senden.
    // encodeURIComponent stellt sicher, dass die Nachricht korrekt formatiert ist, um sie als URL-Parameter zu verwenden.
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    // Öffnet die erstellte URL in einem neuen Browser-Tab.
    window.open(whatsappURL, '_blank');

    // Nachdem die WhatsApp-Nachricht vorbereitet wurde, wird der Warenkorb geleert.
    clearCart();

    // Entfernt die Tischnummer aus dem Local Storage
    localStorage.removeItem('tableNumber');

    // Optional: Die Tischnummer im Speicher und im DOM zurücksetzen
    const tableNumberElement = document.getElementById('table-number');
    tableNumber = 0;
    tableNumberElement.textContent = '';
    tableNumberElement.style.display = 'none';
}



export {
    removeFromCart,
    addToCart,
    initCart,
    orderViaWhatsApp
};

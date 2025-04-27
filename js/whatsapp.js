function orderViaWhatsApp() {
    // Basis-Nachricht
    let baseMessage = "Meine Bestellung lautet:";

    // Sie können hier den Inhalt Ihres Warenkorbs abrufen und zur Nachricht hinzufügen.
    // Zum Beispiel:
    // let cartItems = document.getElementById('cart-items').innerText;
    // baseMessage += ' ' + cartItems;

    // URL-kodiert die Nachricht
    let encodedMessage = encodeURIComponent(baseMessage);

    // Verwenden Sie die gegebene Telefonnummer: +4915123676333 -> 4915123676333 für den WhatsApp-Link
    let whatsappLink = "https://wa.me/4915123676333?text=" + encodedMessage;

    // Öffnet den Link in einem neuen Tab/Fenster
    window.open(whatsappLink, '_blank');
}
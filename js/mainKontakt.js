import { loadKontaktdaten } from './KontaktLoader.js';
import { loadMap } from './mapModule.js';

import { initCart, orderViaWhatsApp } from './cartModule.js';
import { initOptionsModal } from './optionsModalModule.js';
import { initExtrasModal } from './extrasModalModule.js';

const mainCartData = {
    items: [],
    total: 0
};

function initializeKontaktseite() {
    document.body.classList.add('loading'); // Fügt die 'loading' Klasse hinzu, um den Loader anzuzeigen

    loadMap();
    loadKontaktdaten();
    initCart(mainCartData);
    initOptionsModal();
    initExtrasModal();

    document.body.classList.remove('loading'); // Entfernt die 'loading' Klasse, um den Loader zu verbergen
}

$(document).ready(function() {
    initializeKontaktseite();
});

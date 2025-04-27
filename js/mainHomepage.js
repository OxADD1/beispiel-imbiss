import { loadStartseiteMenu } from './StartseiteLoader.js';
import { loadKontaktdaten } from './KontaktLoader.js';
import { initCart } from './cartModule.js';
import { initOptionsModal } from './optionsModalModule.js';
import { initExtrasModal } from './extrasModalModule.js';
import { orderViaWhatsApp } from './cartModule.js';
import TableManagement from './tableManagement.js';


window.orderViaWhatsApp = orderViaWhatsApp;

const mainCartData = {
    items: [],
    total: 0
};

function setBodyLoading() {
    document.body.classList.add('loading');
}

function unsetBodyLoading() {
    document.body.classList.remove('loading');
}

async function initializeHomepage() {
    setBodyLoading();

    try {
        await Promise.all([loadStartseiteMenu(), loadKontaktdaten()]);
        
        const tableNumber = TableManagement.getTableNumberFromUrl();
        
        if (tableNumber !== null) {
            TableManagement.saveTableNumberToLocalStorage(tableNumber);
            mainCartData.orderType = 'Tisch';
        } else {
            mainCartData.orderType = 'Online';
        }

        initCart(mainCartData);
        initOptionsModal();
        initExtrasModal();
        
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
    } finally {
        unsetBodyLoading();
    }
}


$(document).ready(function () {
    initializeHomepage();
});

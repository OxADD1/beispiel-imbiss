// initializationHomepageModule.js

import { initContact } from './contactModule.js';
import { initCart } from './cartModule.js';
import { initExtrasModal } from './extrasModalModule.js';

export function initializeHomepage() {
    initContact();
    initCart();
    initExtrasModal();
}

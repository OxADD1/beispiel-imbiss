/**
 * Diese Klasse verwaltet das "DetailsModal". Sie bietet Funktionen zum Öffnen und Schließen des Modals
 * und zum Festlegen des Titels und des Detailtextes.
 */
import { ADDITIVES, ALLERGENS } from './infoLists.js';
export default class DetailsModal {
    /**
 * Konvertiert ein Informationsobjekt in eine formatierte Zeichenkette.
 * 
 * @param {Object} infoObject - Das Informationsobjekt (z.B. ALLERGENS oder ADDITIVES).
 * @return {String} - Eine formatierte Zeichenkette.
 */
    /**
 * Konvertiert ein Informationsobjekt in eine formatierte Zeichenkette.
 * 
 * @param {Object} infoObject - Das Informationsobjekt (z.B. ALLERGENS oder ADDITIVES).
 * @return {String} - Eine formatierte Zeichenkette.
 */
    formatInfo(infoObject) {
        return Object.values(infoObject).join(', ');
    }


    /**
     * Der Konstruktor initialisiert die notwendigen DOM-Elemente und fügt ihnen Event-Listener hinzu.
     */
    constructor() {
        // Ein neues Bootstrap Modal wird basierend auf dem Element mit der ID "detailsModal" initialisiert.
        this.modal = new bootstrap.Modal(document.getElementById('detailsModal'), {});

        // Das modal-title DOM-Element wird abgerufen, um später den Titel des Modals zu setzen.
        this.modalTitle = document.querySelector("#detailsModal .modal-title");

        // Das detailsText DOM-Element wird abgerufen, um später den Detailtext des Modals zu setzen.
        this.detailsText = document.getElementById('detailsText');

        // Der Schließen-Button des Modals wird abgerufen.
        this.closeButton = document.querySelector("#detailsModal .btn.btn-secondary");

        // Event-Listener werden hinzugefügt.
        this.bindEvents();
    }

    /**
     * Diese Methode fügt dem Schließen-Button des Modals einen Event-Listener hinzu.
     * Wenn der Button geklickt wird, wird das Modal geschlossen.
     */
    bindEvents() {
        this.closeButton.addEventListener('click', () => {
            this.hide();
        });
    }

    /**
     * Diese Methode zeigt das Modal mit den angegebenen Details an.
     * 
     * @param {String} title - Der Titel, der im Modal angezeigt werden soll.
     * @param {String} details - Der Text, der als Detailinformation im Modal angezeigt werden soll.
     */
    show(name, details, description, allergensKeys, additivesKeys) {
        this.modalTitle.textContent = name;

        let detailsContent = `${details}<br><br>`;
        let descriptionIntro = `<strong>Beschreibung:</strong><br>${description}<br><br>`;

        let allergensContent = "";
        if (allergensKeys.length) {
            const allergensInfo = this.formatInfo(allergensKeys.reduce((obj, key) => {
                obj[key] = ALLERGENS[key];
                return obj;
            }, {}));
            allergensContent = `<strong>Allergene:</strong><ul>${allergensInfo.split(', ').map(item => `<li>${item}</li>`).join('')}</ul>`;
        }

        let additivesContent = "";
        if (additivesKeys.length) {
            const additivesInfo = this.formatInfo(additivesKeys.reduce((obj, key) => {
                obj[key] = ADDITIVES[key];
                return obj;
            }, {}));
            additivesContent = `<strong>Zusatzstoffe:</strong><ul>${additivesInfo.split(', ').map(item => `<li>${item}</li>`).join('')}</ul>`;
        }

        this.detailsText.innerHTML = descriptionIntro + (allergensKeys.length ? allergensContent : '') + (additivesKeys.length ? additivesContent : '');

        this.modal.show(); // Zeige das Modal.
    }









    /**
     * Diese Methode schließt das Modal.
     */
    hide() {
        this.modal.hide(); // Das Modal wird verborgen.
    }
}

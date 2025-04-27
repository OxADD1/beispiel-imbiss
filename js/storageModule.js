/**
 * storageModule.js
 * 
 * Dieses Modul stellt Funktionen bereit, um Daten im localStorage des Browsers zu speichern,
 * zu laden und zu entfernen. Dies ermöglicht eine clientseitige Speicherung von Daten
 * über mehrere Sitzungen hinweg.
 */

/**
 * Speichert Daten unter einem spezifizierten Schlüssel im localStorage.
 * 
 * @param {string} key - Der Schlüssel, unter dem die Daten gespeichert werden sollen.
 * @param {any} data - Die zu speichernden Daten.
 */
function saveToLocalStorage(key, data) {
    try {
        // Daten werden in einen String umgewandelt (Serialisierung),
        // da der localStorage nur String-Daten speichern kann.
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);

     
    } catch (error) {
        // Fehlermeldung wird in der Konsole angezeigt, falls es beim Speichern Probleme gibt.
        console.error(`Fehler beim Speichern der Daten unter dem Schlüssel "${key}" im localStorage:`, error);
    }
}

/**
 * Lädt Daten eines spezifizierten Schlüssels aus dem localStorage.
 * 
 * @param {string} key - Der Schlüssel, von dem die Daten geladen werden sollen.
 * @returns {any|null} - Die geladenen Daten oder null, wenn ein Fehler auftritt oder keine Daten gefunden werden.
 */
function loadFromLocalStorage(key) {
    try {
        // Daten werden vom localStorage anhand des Schlüssels abgerufen.
        const serializedData = localStorage.getItem(key);
        
        if(serializedData) {
            // Daten werden aus dem String-Format in ihr ursprüngliches Format zurückkonvertiert (Deserialisierung).
            return JSON.parse(serializedData);
        } else {
            return null;
        }
    } catch (error) {
        // Fehlermeldung wird in der Konsole angezeigt, falls es beim Laden Probleme gibt.
        console.error(`Fehler beim Laden der Daten unter dem Schlüssel "${key}" aus dem localStorage:`, error);
        return null;
    }
}

/**
 * Löscht Daten eines spezifizierten Schlüssels aus dem localStorage.
 * 
 * @param {string} key - Der Schlüssel, von dem die Daten gelöscht werden sollen.
 */
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        // Fehlermeldung wird in der Konsole angezeigt, falls es beim Löschen Probleme gibt.
        console.error(`Fehler beim Löschen der Daten unter dem Schlüssel "${key}" aus dem localStorage:`, error);
    }
}

// Funktionen werden exportiert, sodass sie in anderen Modulen verwendet werden können.
export {
    saveToLocalStorage,
    loadFromLocalStorage,
    removeFromLocalStorage
};

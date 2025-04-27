// tableManagement.js

// TableManagement Modul
const TableManagement = (() => {

  // ------ Funktionen für die Tischnummer ------

  // Funktion zum Abrufen der Tischnummer aus der URL
  const getTableNumberFromUrl = () => {
    // URL-Parameter extrahieren
    const urlParams = new URLSearchParams(window.location.search);
    // 'tisch' Parameter aus der URL lesen
    const tableNumber = urlParams.get('tisch');
    return tableNumber;
  };

  // Funktion zum Speichern der Tischnummer im Local Storage
  const saveTableNumberToLocalStorage = (tableNumber) => {
    // Überprüfung, ob eine Tischnummer existiert
    if (tableNumber) {
      // Tischnummer im Local Storage speichern
      localStorage.setItem('tableNumber', tableNumber);
    }
  };

// Funktion zum Abrufen der Tischnummer aus dem Local Storage
const getTableNumberFromLocalStorage = () => {
  // Tischnummer aus dem Local Storage lesen
  const storedTableNumber = localStorage.getItem('tableNumber');
  return storedTableNumber;
};


  // Funktion zum Löschen der Tischnummer aus dem Local Storage
  const clearTableNumber = () => {
    localStorage.removeItem('tableNumber');
  };
  
  // ------ Veröffentlichte Methoden ------

  return {
    getTableNumberFromUrl,
    saveTableNumberToLocalStorage,
    getTableNumberFromLocalStorage,
    clearTableNumber,
  };
})();

// Modul exportieren
export default TableManagement;

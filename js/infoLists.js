// infoLists.js
export let ADDITIVES = {};
export let ALLERGENS = {};

// Lade die JSON-Daten dynamisch
fetch('../json/menu.json')
  .then(response => response.json())
  .then(data => {
    ADDITIVES = data.additives;
    ALLERGENS = data.allergens;
  })
  .catch(error => console.error('Fehler beim Laden der JSON-Daten:', error));

// StartseiteLoader.js
export function loadStartseiteMenu() {
    // Ihr Code zum Laden des Menüs...
    $.getJSON('./json/menu.json', function (data) {
        var gerichte = data.categories;
        var html = '';

        $.each(gerichte, function (i, category) {
            html += '<a href="./html/menu.html#' + category.id + '-anchor" class="box">';
            html += '<img src="./images/' + category.image + '" alt="' + category.name + '">';
            html += '<h3>' + category.name + '</h3></a>';
        });

        $('.gerichte').append(html);
    }).done(function () {
        // Ausblenden des Ladebildschirms, wenn die Daten erfolgreich geladen wurden
        document.querySelector('.loader').style.display = 'none';
    }).fail(function () {
        console.error('Fehler beim Laden der JSON-Daten');
        // Ausblenden des Ladebildschirms, auch wenn ein Fehler aufgetreten ist
        document.querySelector('.loader').style.display = 'none';
    });
}

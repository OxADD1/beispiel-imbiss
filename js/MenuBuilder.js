import { openModal } from './optionsModalModule.js';
import { ALLERGENS, ADDITIVES } from './infoLists.js';

class MenuBuilder {
    static postAppendInit(callback) {
        callback();
    }

    static createCategory(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.id = `${category.id}-anchor`;
        categoryDiv.className = 'category';

        const categoryTitle = document.createElement('h2');
        categoryTitle.id = category.id;
        categoryTitle.textContent = category.name;
        categoryDiv.appendChild(categoryTitle);

        const categoryImg = document.createElement('img');
        categoryImg.src = `../images/${category.image}`;
        categoryImg.alt = category.name;
        categoryDiv.appendChild(categoryImg);

        const categoryDescription = document.createElement('h4');
        categoryDescription.textContent = category.description;
        categoryDiv.appendChild(categoryDescription);

        const categoryItems = this.createItemsList(category.items);
        categoryDiv.appendChild(categoryItems);

        return categoryDiv;
    }

    static createItemsList(items) {
        const itemsList = document.createElement('ul');
        items.forEach((item, index) => {
            const itemElement = this.createItem(item, index);
            itemsList.appendChild(itemElement);
        });
        return itemsList;
    }

    static createItem(item, index) {
        const itemElement = document.createElement('li');

        // Hinzugefügt: Event-Listener für das gesamte li-Element
        itemElement.addEventListener('click', function (event) {
            if (!event.target.closest('.details-button')) {  
                const itemCopy = { ...item };
                openModal(itemCopy);
            }
        });

        const itemNameAndPrice = document.createElement('p');
        itemNameAndPrice.className = 'name-and-price';
        const itemName = document.createElement('span');
        itemName.className = 'item-name';
        itemName.textContent = item.name;

        const itemPrice = document.createElement('span');
        itemPrice.className = 'item-price';
        itemPrice.textContent = `${item.price}€`;

        itemNameAndPrice.appendChild(itemName);
        itemNameAndPrice.appendChild(itemPrice);
        itemElement.appendChild(itemNameAndPrice);

        const buttonWrapper = this.createItemButtons(item, index);
        itemElement.appendChild(buttonWrapper);

        return itemElement;
    }

    static createItemButtons(item, index) {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.display = 'flex';
        buttonWrapper.style.justifyContent = 'flex-end';

        const detailsButton = document.createElement('button');
        detailsButton.className = 'show-details details-button';
        detailsButton.dataset.name = item.name;
        detailsButton.dataset.price = item.price;
        detailsButton.dataset.details = item.details;
        detailsButton.dataset.description = item.description || '';
        detailsButton.dataset.allergens = item.allergens ? item.allergens.join(', ') : '';
        detailsButton.dataset.additives = item.additives ? item.additives.join(', ') : '';

        const detailsIcon = document.createElement('i');
        detailsIcon.className = 'fa-solid fa-info-circle';
        detailsButton.appendChild(detailsIcon);
        buttonWrapper.appendChild(detailsButton);

        return buttonWrapper;
    }
}


export default MenuBuilder;

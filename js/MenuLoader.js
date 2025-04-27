import { ADDITIVES, ALLERGENS } from './infoLists.js';
import MenuBuilder from './MenuBuilder.js';
import DetailsModal from './DetailsModal.js';

// Dynamisches NAVBAR_OFFSET, je nach Bildschirmgröße
const getNavbarOffset = () => {
    return window.innerWidth > 991 ? 215 : 85;
};

class MenuLoader {
    constructor(dataURL, onDataLoaded) {
        this.dataURL = dataURL;
        this.onDataLoaded = onDataLoaded;
        this.navigation = document.querySelector('.navigation');
        this.detailsModal = new DetailsModal();
    }

    async checkImagesAndScroll() {
        const images = document.querySelectorAll('img');

        Promise.all([...images].map(img => {
            if (!img.complete) {
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }
        })).then(() => {
            if (window.location.hash) {
                const anchor = document.querySelector(window.location.hash);
                if (anchor) {
                    window.scrollTo({
                        top: anchor.offsetTop - getNavbarOffset(),
                        behavior: "smooth"
                    });
                }
            }
        });
    }

    async loadMenu() {
        document.body.classList.add('loading');
    
        try {
            const response = await fetch(this.dataURL);
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok.');
            }
    
            const data = await response.json();
    
            data.categories.forEach(category => {
                const categoryElement = MenuBuilder.createCategory(category);
                document.body.appendChild(categoryElement);
                this.addNavigationLink(category);
            });
    
            this.addEventListeners();
    
            if (this.onDataLoaded) {
                this.onDataLoaded();
            }
    
            document.body.classList.remove('loading');
    
            this.checkImagesAndScroll();
    
        } catch (error) {
            console.error('Fehler beim Laden des Menüs:', error);
            document.body.classList.remove('loading');
        }
    }

    addNavigationLink(category) {
        const navLink = document.createElement('a');
        navLink.href = `#${category.id}-anchor`;
        navLink.textContent = category.name;
        navLink.className = 'navbar-item';
        navLink.addEventListener('click', this.handleNavigationClick.bind(this));
        this.navigation.appendChild(navLink);
    }

    handleNavigationClick(e) {
        e.preventDefault();
        const targetElement = document.querySelector(e.currentTarget.getAttribute('href'));
        const offsetPosition = targetElement.offsetTop - getNavbarOffset();

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }

    centerActiveNavItem() {
        const activeItem = this.navigation.querySelector('.navbar-item.active');
        if (activeItem) {
            const navbarWidth = this.navigation.clientWidth;
            const activeItemOffset = activeItem.offsetLeft;
            const activeItemWidth = activeItem.offsetWidth;

            const scrollAmount = activeItemOffset - (navbarWidth / 2) + (activeItemWidth / 2);
            this.navigation.scrollLeft = scrollAmount;
        }
    }


    // Füge Event-Listener zu verschiedenen Elementen im Dokument hinzu.
    addEventListeners() {
        document.body.addEventListener('click', (e) => {
            let target = e.target;
            while (target !== document.body && !target.classList.contains('show-details')) {
                target = target.parentElement;
            }
            // Wenn ein Element mit der Klasse "show-details" gefunden wurde...
            if (target.classList.contains('show-details')) {
                const itemName = target.dataset.name;
                const itemDetails = target.dataset.details || '';
                const itemDescription = target.dataset.description || ''; // Extrahieren der Beschreibung
                const allergensKeys = target.dataset.allergens ? target.dataset.allergens.split(', ') : [];
                const additivesKeys = target.dataset.additives ? target.dataset.additives.split(', ').map(Number) : [];
            
                // Zeige das Modal mit den gesammelten Informationen.
                this.detailsModal.show(itemName, itemDetails, itemDescription, allergensKeys, additivesKeys);

            }
            
        });


        // Füge Klick-Event-Listener zu den Scroll-Buttons hinzu.
        const scrollLeft = document.getElementById('scroll-left');
        const scrollRight = document.getElementById('scroll-right');
        let scrollInterval;
        const scrollSpeed = 5;
    
        const scrollContinuouslyLeft = () => {
            this.navigation.scrollLeft -= scrollSpeed;
        };
    
        const scrollContinuouslyRight = () => {
            this.navigation.scrollLeft += scrollSpeed;
        };
    
        const startScrolling = (scrollFunction) => {
            scrollFunction();
            scrollInterval = setInterval(scrollFunction, 25);
        };
    
        const stopScrolling = () => {
            clearInterval(scrollInterval);
        };
    
        // Maus-Events
        scrollLeft.addEventListener('mousedown', () => startScrolling(scrollContinuouslyLeft));
        scrollLeft.addEventListener('mouseup', stopScrolling);
        scrollLeft.addEventListener('mouseleave', stopScrolling);
    
        scrollRight.addEventListener('mousedown', () => startScrolling(scrollContinuouslyRight));
        scrollRight.addEventListener('mouseup', stopScrolling);
        scrollRight.addEventListener('mouseleave', stopScrolling);
    
        // Touch-Events für Mobile
        scrollLeft.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startScrolling(scrollContinuouslyLeft);
        });
        scrollLeft.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopScrolling();
        });
    
        scrollRight.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startScrolling(scrollContinuouslyRight);
        });
        scrollRight.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopScrolling();
        });
        // Füge einen Scroll-Event-Listener zum Fenster hinzu, um den aktiven Navigationslink hervorzuheben.
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    /**
  * Diese Methode bestimmt das aktive Navigations-Element basierend auf der aktuellen Scroll-Position.
  */
    handleScroll() {
        let navLinks = document.querySelectorAll('.navigation a');
        
        navLinks.forEach(link => {
            let section = document.querySelector(link.hash);
            const headerOffset = getNavbarOffset();
            
            if (
                section.offsetTop - headerOffset <= window.scrollY &&
                section.offsetTop + section.offsetHeight - headerOffset > window.scrollY
            ) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        this.centerActiveNavItem();
    }
}

export default MenuLoader;
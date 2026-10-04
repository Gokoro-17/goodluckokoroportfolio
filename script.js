document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    const menuButton = document.getElementById('menu-toggle');
    const menuIcon = menuButton?.querySelector('use');
    const navigation = document.getElementById('site-nav');

    if (year) year.textContent = new Date().getFullYear();
    if (!menuButton || !navigation) return;

    function closeMenu(returnFocus = false) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
        menuIcon?.setAttribute('href', 'images/icons.svg#menu');
        navigation.classList.remove('is-open');
        if (returnFocus) menuButton.focus();
    }

    menuButton.addEventListener('click', () => {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            closeMenu();
        } else {
            menuButton.setAttribute('aria-expanded', 'true');
            menuButton.setAttribute('aria-label', 'Close menu');
            menuIcon?.setAttribute('href', 'images/icons.svg#close');
            navigation.classList.add('is-open');
        }
    });

    navigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            closeMenu(true);
        }
    });

    document.addEventListener('click', (event) => {
        if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) closeMenu();
    });
});

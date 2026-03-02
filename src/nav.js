/**
 * Floatcap — Navigation
 * Scroll shrink effect & mobile hamburger menu
 */
export function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    // Scroll shrink
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile hamburger
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobileOverlay');
    if (!hamburger || !overlay) return;

    function toggleMenu() {
        const isOpen = overlay.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        overlay.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close on link click
    overlay.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            closeMenu();
        }
    });
}

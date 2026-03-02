/**
 * Floatcap — Scroll Reveal
 * IntersectionObserver-based reveal animation
 */
export function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
}

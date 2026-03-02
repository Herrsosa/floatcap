/**
 * Floatcap — Waitlist Form
 * Handles email submission with Formspree integration
 *
 * Configuration:
 *   Set VITE_FORMSPREE_ID in .env to your Formspree form ID.
 *   Without it, the form shows a success state but doesn't submit anywhere (demo mode).
 */
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ID
    ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`
    : null;

export function initWaitlist() {
    const input = document.getElementById('emailInput');
    const form = document.getElementById('waitlistForm');
    const successEl = document.getElementById('formSuccess');
    const errorEl = document.getElementById('formError');
    if (!input || !form) return;

    function validateEmail(email) {
        return email && email.includes('@') && email.includes('.') && email.length > 5;
    }

    function showError(msg) {
        if (errorEl) {
            errorEl.textContent = msg || 'Please enter a valid email address.';
            errorEl.classList.add('show');
            setTimeout(() => errorEl.classList.remove('show'), 4000);
        }
        input.style.borderColor = '#F87171';
        input.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.15)';
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }, 2500);
    }

    function showSuccess() {
        form.style.display = 'none';
        if (successEl) successEl.classList.add('show');
    }

    async function handleSubmit() {
        const email = input.value.trim();

        if (!validateEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        if (FORMSPREE_ENDPOINT) {
            // Real submission via Formspree
            const submitBtn = form.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending…';
            submitBtn.disabled = true;

            try {
                const res = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({ email }),
                });

                if (res.ok) {
                    showSuccess();
                } else {
                    const data = await res.json().catch(() => ({}));
                    showError(data.error || 'Something went wrong. Please try again.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch {
                showError('Network error. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } else {
            // Demo mode — just show success
            console.log('[Floatcap Demo] Waitlist signup:', email);
            showSuccess();
        }
    }

    // Bind events
    const submitBtn = form.querySelector('button');
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSubmit();
    });
}

/**
 * Floatcap — Terminal Typewriter
 * Credit assessment animation triggered by IntersectionObserver
 */
export function initTerminal() {
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminalBody) return;

    const targets = {
        aR: { final: '$487,200', delay: 200 },
        aC: { final: '$194,880', delay: 500 },
        aM: { final: '60.0%', delay: 800 },
        aI: { final: '$2.50', delay: 1100 },
        aL: { final: '$350,000', delay: 1600 },
        aU: { final: '72%', delay: 2000 },
    };

    let hasPlayed = false;

    function scramble(el, finalText, duration) {
        const chars = '0123456789$%.,';
        let frame = 0;
        const totalFrames = Math.floor(duration / 30);
        const interval = setInterval(() => {
            frame++;
            let result = '';
            for (let i = 0; i < finalText.length; i++) {
                result += frame / totalFrames > i / finalText.length
                    ? finalText[i]
                    : chars[Math.floor(Math.random() * chars.length)];
            }
            el.textContent = result;
            if (frame >= totalFrames) {
                el.textContent = finalText;
                clearInterval(interval);
            }
        }, 30);
    }

    function playAnimation() {
        if (hasPlayed) return;
        hasPlayed = true;

        Object.entries(targets).forEach(([id, config]) => {
            const el = document.getElementById(id);
            if (el) {
                setTimeout(() => scramble(el, config.final, 600), config.delay);
            }
        });

        setTimeout(() => {
            const bar = document.getElementById('aB');
            if (bar) bar.classList.add('animate');
        }, 2200);
    }

    // Use IntersectionObserver to trigger animation when terminal is in view
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(playAnimation, 400);
                    observer.disconnect();
                }
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(terminalBody);
}

/**
 * Floatcap — Mesh Background
 * Animated particle canvas for hero section
 */
export function initMeshBackground() {
    const container = document.getElementById('heroCanvas');
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w, h, pts = [];

    function resize() {
        w = canvas.width = container.offsetWidth;
        h = canvas.height = container.offsetHeight;
        pts = [];
        for (let i = 0; i < 55; i++) {
            pts.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x;
                const dy = pts[i].y - pts[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 170) {
                    ctx.beginPath();
                    ctx.moveTo(pts[i].x, pts[i].y);
                    ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.strokeStyle = `rgba(201,168,76,${(1 - d / 170) * 0.06})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        for (const p of pts) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(201,168,76,0.2)';
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
}

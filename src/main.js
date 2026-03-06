/**
 * Floatcap — Main Entry Point
 */
import './style.css';
import { inject } from '@vercel/analytics';
import { initMeshBackground } from './mesh-bg.js';
import { initTerminal } from './terminal.js';
import { initScrollReveal } from './scroll-reveal.js';
import { initNav } from './nav.js';
import { initWaitlist } from './waitlist.js';
import { initBackToTop } from './back-to-top.js';

// Initialize Vercel Analytics
inject();

// Remove no-js class once JS is loaded
document.documentElement.classList.remove('no-js');

// Initialize all modules
initMeshBackground();
initTerminal();
initScrollReveal();
initNav();
initWaitlist();
initBackToTop();

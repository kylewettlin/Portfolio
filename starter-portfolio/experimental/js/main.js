import { initParticles } from './particles.js';
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initProjectCards } from './projects.js';
import { initSkillOrbs } from './skills.js';
import { initContactForm } from './contact.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursor();
    initNavigation();
    initProjectCards();
    initSkillOrbs();
    initContactForm();
}); 
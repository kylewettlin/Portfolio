export function initContactForm() {
    const form = document.getElementById('contactForm');
    const fields = document.querySelectorAll('.form-field');

    fields.forEach(field => {
        const input = field.querySelector('input, textarea');
        const label = field.querySelector('label');
        const line = field.querySelector('.line');

        // Animate label on focus
        input.addEventListener('focus', () => {
            gsap.to(label, {
                duration: 0.3,
                y: -24,
                scale: 0.8,
                color: 'var(--primary)',
                ease: "power2.out"
            });

            gsap.to(line, {
                duration: 0.5,
                scaleX: 1,
                ease: "power2.out"
            });
        });

        // Reset animation if empty
        input.addEventListener('blur', () => {
            if (!input.value) {
                gsap.to(label, {
                    duration: 0.3,
                    y: 0,
                    scale: 1,
                    color: 'var(--text)',
                    ease: "power2.out"
                });
            }

            gsap.to(line, {
                duration: 0.5,
                scaleX: 0,
                ease: "power2.out"
            });
        });
    });

    // Form submission animation
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Animate form submission
        gsap.to(form, {
            duration: 0.5,
            y: -20,
            opacity: 0,
            ease: "power2.in"
        });

        // Show success message
        setTimeout(() => {
            form.style.display = 'none';
            document.querySelector('.success-message').style.display = 'block';
            
            gsap.from('.success-message', {
                duration: 0.5,
                y: 20,
                opacity: 0,
                ease: "power2.out"
            });
        }, 500);
    });
} 
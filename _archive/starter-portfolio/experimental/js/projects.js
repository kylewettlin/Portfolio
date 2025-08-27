export function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            gsap.to(card, {
                duration: 0.5,
                rotateX: rotateX,
                rotateY: rotateY,
                ease: "power2.out",
                transformPerspective: 1000
            });
        });

        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                ease: "power2.out"
            });
        });
    });
} 
export function initSkillOrbs() {
    const orbs = document.querySelectorAll('.skill-orb');
    
    orbs.forEach(orb => {
        orb.addEventListener('mouseenter', () => {
            // Create particles burst effect
            for (let i = 0; i < 10; i++) {
                createParticle(orb);
            }
        });
    });

    function createParticle(orb) {
        const particle = document.createElement('div');
        particle.className = 'skill-particle';
        
        const rect = orb.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        gsap.to(particle, {
            duration: Math.random() * 1 + 0.5,
            x: vx,
            y: vy,
            opacity: 0,
            ease: "power1.out",
            onComplete: () => particle.remove()
        });
    }
} 
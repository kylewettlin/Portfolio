export function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    // Smoother animation using requestAnimationFrame
    function animate() {
        posX += (mouseX - posX) / 8;
        posY += (mouseY - posY) / 8;
        
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        follower.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
        
        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Cursor effects for interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .skill-orb, .main-nav li, .project-card'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = 0;
        follower.style.opacity = 0;
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = 1;
        follower.style.opacity = 1;
    });
} 
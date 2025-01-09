export function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let speed = 0.2; // Adjust this value to change the trailing speed (0-1)

    function updateCursor() {
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        follower.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        requestAnimationFrame(updateCursor);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorX === 0) { // Initial position
            cursorX = mouseX;
            cursorY = mouseY;
        }
    });

    updateCursor();

    // Enhanced interactive elements handling
    const interactiveElements = document.querySelectorAll(
        'a, button, .skill-orb, .main-nav li, .project-card, input, textarea'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
            speed = 0.1; // Slower following on interactive elements
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
            speed = 0.2; // Normal following speed
        });
    });
} 
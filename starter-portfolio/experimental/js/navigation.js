export function initNavigation() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.main-nav li');
    let currentSection = 0;
    let isAnimating = false;
    let isScrolling = false;
    let scrollTimeout;

    function updateNavigation(index) {
        navItems.forEach(item => item.classList.remove('active'));
        navItems[index].classList.add('active');
    }

    function smoothScroll(target) {
        if (isAnimating) return;
        isAnimating = true;

        const currentActive = document.querySelector('.section.active');
        if (currentActive) {
            gsap.to(currentActive, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    currentActive.classList.remove('active');
                    currentActive.style.visibility = 'hidden';
                }
            });
        }

        gsap.fromTo(target,
            {
                opacity: 0,
                visibility: 'visible'
            },
            {
                opacity: 1,
                duration: 0.5,
                onStart: () => {
                    target.classList.add('active');
                },
                onComplete: () => {
                    isAnimating = false;
                }
            }
        );
    }

    // Mouse wheel navigation with debounce
    window.addEventListener('wheel', (e) => {
        if (isAnimating || isScrolling) return;
        
        clearTimeout(scrollTimeout);
        isScrolling = true;

        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            currentSection++;
        } else if (e.deltaY < 0 && currentSection > 0) {
            currentSection--;
        }

        smoothScroll(sections[currentSection]);
        updateNavigation(currentSection);

        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 1000);
    });

    // Navigation click events
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (isAnimating) return;
            currentSection = index;
            smoothScroll(sections[currentSection]);
            updateNavigation(currentSection);
        });
    });

    // Initialize first section
    sections[0].classList.add('active');
    updateNavigation(0);
} 
export function initNavigation() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.main-nav li');
    let currentSection = 0;
    let isAnimating = false;
    let lastScrollTime = Date.now();

    function updateNavigation(index) {
        navItems.forEach(item => item.classList.remove('active'));
        navItems[index].classList.add('active');
    }

    let scrollTimeout;
    let scrollThreshold = 1500; // Increased threshold for smoother transitions

    function handleWheel(e) {
        const now = Date.now();
        if (now - lastScrollTime < scrollThreshold) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (e.deltaY > 0 && currentSection < sections.length - 1) {
                currentSection++;
                smoothScroll(sections[currentSection], 'next');
            } else if (e.deltaY < 0 && currentSection > 0) {
                currentSection--;
                smoothScroll(sections[currentSection], 'prev');
            }
            updateNavigation(currentSection);
            lastScrollTime = now;
        }, 50); // Small delay for smoother detection
    }

    // Update smooth scroll animation
    function smoothScroll(target, direction = 'next') {
        if (isAnimating) return;
        isAnimating = true;

        const currentActive = document.querySelector('.section.active');
        if (currentActive) {
            gsap.to(currentActive, {
                opacity: 0,
                y: direction === 'next' ? -100 : 100, // Increased movement
                duration: 0.8, // Slower animation
                ease: "power2.inOut",
                onComplete: () => {
                    currentActive.classList.remove('active');
                    currentActive.style.visibility = 'hidden';
                }
            });
        }

        gsap.fromTo(target,
            {
                opacity: 0,
                y: direction === 'next' ? 100 : -100,
                visibility: 'visible'
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onStart: () => {
                    target.classList.add('active');
                },
                onComplete: () => {
                    isAnimating = false;
                }
            }
        );
    }

    window.addEventListener('wheel', handleWheel, { passive: true });

    // Touch support
    let touchStartY = 0;
    window.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', e => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0 && currentSection < sections.length - 1) {
                currentSection++;
                smoothScroll(sections[currentSection], 'next');
            } else if (diff < 0 && currentSection > 0) {
                currentSection--;
                smoothScroll(sections[currentSection], 'prev');
            }
            updateNavigation(currentSection);
        }
    });

    // Initialize
    sections[0].classList.add('active');
    updateNavigation(0);

    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (isAnimating) return;
            currentSection = index;
            smoothScroll(sections[currentSection], 
                index > currentSection ? 'next' : 'prev');
            updateNavigation(currentSection);
        });
    });
} 
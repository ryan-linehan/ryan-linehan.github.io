/* ==========================================================================
   RYAN LINEHAN - PORTFOLIO SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initTypingEffect();
    initScrollReveal();
    initSmoothScroll();
    initMobileNav();
    initNewsletterForm();
});

/* --------------------------------------------------------------------------
   TYPING EFFECT
   -------------------------------------------------------------------------- */
function initTypingEffect() {
    const typedTextElement = document.querySelector('.typed-text');
    if (!typedTextElement) return;

    const phrases = [
        'Building websites that stand out.',
        'Crafting games that captivate.',
        'Turning ideas into reality.',
        'Code is my canvas.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at end of phrase
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing after a delay
    setTimeout(type, 1500);
}

/* --------------------------------------------------------------------------
   SCROLL REVEAL ANIMATION
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    // Add reveal class to elements we want to animate
    const revealElements = document.querySelectorAll(
        '.section-header, .about-intro, .about-body, .tech-stack, ' +
        '.terminal, .project-card, .contact-text, .contact-links'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Stagger animation for project cards
                if (entry.target.classList.contains('project-card')) {
                    const cards = document.querySelectorAll('.project-card');
                    cards.forEach((card, index) => {
                        card.style.transitionDelay = `${index * 0.1}s`;
                    });
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   SMOOTH SCROLL FOR NAV LINKS
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* --------------------------------------------------------------------------
   EASTER EGG - KONAMI CODE
   -------------------------------------------------------------------------- */
(function initKonamiCode() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        document.body.style.animation = 'rainbow 2s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);

        // Add rainbow keyframes if not exists
        if (!document.querySelector('#rainbow-style')) {
            const style = document.createElement('style');
            style.id = 'rainbow-style';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        console.log('🎮 Achievement Unlocked: Konami Master!');
    }
})();

/* --------------------------------------------------------------------------
   NEWSLETTER FORM (AJAX submission)
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    const emailInput = form.querySelector('.newsletter-input');
    const submitBtn = form.querySelector('.newsletter-btn');
    const originalBtnText = submitBtn.textContent;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!email) return;

        // Set loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';
        form.classList.remove('newsletter-success', 'newsletter-error');
        form.classList.add('newsletter-loading');

        try {
            const formData = new FormData();
            formData.append('email', email);

            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Buttondown doesn't support CORS, so we use no-cors
            });

            // With no-cors mode, we can't read the response, but the request still goes through
            // We'll assume success if no error was thrown
            form.classList.remove('newsletter-loading');
            form.classList.add('newsletter-success');
            submitBtn.textContent = 'SUBSCRIBED!';
            emailInput.value = '';

            // Show success message
            showNewsletterMessage(form, 'success', 'Thanks for subscribing! Check your email to confirm.');

            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, 3000);

        } catch (error) {
            form.classList.remove('newsletter-loading');
            form.classList.add('newsletter-error');
            submitBtn.textContent = 'ERROR';

            // Show error message
            showNewsletterMessage(form, 'error', 'Something went wrong. Please try again.');

            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                form.classList.remove('newsletter-error');
            }, 3000);
        }
    });
}

function showNewsletterMessage(form, type, message) {
    // Remove any existing message
    const existingMsg = form.parentElement.querySelector('.newsletter-message');
    if (existingMsg) existingMsg.remove();

    // Create message element
    const msgEl = document.createElement('p');
    msgEl.className = `newsletter-message newsletter-message-${type}`;
    msgEl.textContent = message;

    // Insert after form
    form.after(msgEl);

    // Auto-remove success message after a while
    if (type === 'success') {
        setTimeout(() => {
            msgEl.classList.add('newsletter-message-fade');
            setTimeout(() => msgEl.remove(), 500);
        }, 5000);
    }
}

/* --------------------------------------------------------------------------
   CURSOR GLOW EFFECT (subtle)
   -------------------------------------------------------------------------- */
(function initCursorGlow() {
    // Only on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        glow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 245, 255, 0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9997;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(glow);

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            glow.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });

        // Smooth follow
        function animate() {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(animate);
        }
        animate();
    }
})();

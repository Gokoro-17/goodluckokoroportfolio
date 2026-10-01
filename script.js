/**
 * Goodluck Paul Okoro - Portfolio JavaScript
 * Handles navigation, form validation, scroll animations, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // DOM ELEMENTS
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('back-to-top');
    const yearSpan = document.getElementById('year');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ============================================
    // SET CURRENT YEAR IN FOOTER
    // ============================================
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    function updateThemeLabel() {
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', document.documentElement.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        }
    }

    if (themeToggle) {
        updateThemeLabel();
        themeToggle.addEventListener('click', function() {
            const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = nextTheme;
            try { localStorage.setItem('portfolio-theme', nextTheme); } catch (error) { /* The theme still works for this visit. */ }
            updateThemeLabel();
        });
    }

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    if (navToggle && navMenu) {
        function closeMenu() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open navigation');
        }

        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
            if (isOpen) navLinks[0]?.focus();
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
                navToggle.focus();
            }
        });
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) closeMenu();
        });
    }

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============================================
    // NAVBAR BACKGROUND ON SCROLL
    // ============================================
    function handleNavbarScroll() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
            });
        });
    }

    // ============================================
    // SCROLL REVEAL ANIMATION (IntersectionObserver)
    // ============================================
    if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        scrollRevealElements.forEach(el => revealObserver.observe(el));
    } else {
        scrollRevealElements.forEach(el => el.classList.add('revealed'));
    }

    // ============================================
    // CONTACT FORM VALIDATION
    // ============================================
    const formFields = {
        name: {
            element: document.getElementById('name'),
            error: document.getElementById('name-error'),
            validate: (value) => {
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return '';
            }
        },
        email: {
            element: document.getElementById('email'),
            error: document.getElementById('email-error'),
            validate: (value) => {
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
            }
        },
        subject: {
            element: document.getElementById('subject'),
            error: document.getElementById('subject-error'),
            validate: (value) => {
                if (!value.trim()) return 'Subject is required';
                if (value.trim().length < 3) return 'Subject must be at least 3 characters';
                return '';
            }
        },
        message: {
            element: document.getElementById('message'),
            error: document.getElementById('message-error'),
            validate: (value) => {
                if (!value.trim()) return 'Message is required';
                if (value.trim().length < 10) return 'Message must be at least 10 characters';
                return '';
            }
        }
    };

    function validateField(fieldName) {
        const field = formFields[fieldName];
        if (!field || !field.element) return false;

        const value = field.element.value;
        const error = field.validate(value);

        if (error) {
            field.element.classList.add('error');
            field.element.classList.remove('success');
            field.element.setAttribute('aria-invalid', 'true');
            field.error.textContent = error;
            return false;
        } else {
            field.element.classList.remove('error');
            field.element.classList.add('success');
            field.element.setAttribute('aria-invalid', 'false');
            field.error.textContent = '';
            return true;
        }
    }

    function validateForm() {
        let isValid = true;
        for (const fieldName in formFields) {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        }
        return isValid;
    }

    // Real-time validation on blur
    for (const fieldName in formFields) {
        const field = formFields[fieldName];
        if (field && field.element) {
            field.element.addEventListener('blur', function() {
                if (this.value.trim()) {
                    validateField(fieldName);
                }
            });

            field.element.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(fieldName);
                }
            });
        }
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
                contactForm.querySelector('[aria-invalid="true"]')?.focus();
                return;
            }
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
        });
    }

    // ============================================
    // SCROLL EVENT LISTENER
    // ============================================
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                highlightNavOnScroll();
                handleNavbarScroll();
                handleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial calls
    highlightNavOnScroll();
    handleNavbarScroll();
    handleBackToTop();

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
                });
            }
        });
    });

});

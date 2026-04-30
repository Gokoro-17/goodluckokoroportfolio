/**
 * Goodluck Paul Okoro - Portfolio JavaScript
 * Handles navigation, form validation, project filtering, scroll animations, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // DOM ELEMENTS
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('back-to-top');
    const yearSpan = document.getElementById('year');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formSuccess = document.getElementById('form-success');

    // ============================================
    // SET CURRENT YEAR IN FOOTER
    // ============================================
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
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
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
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
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // SCROLL REVEAL ANIMATION (IntersectionObserver)
    // ============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after reveal
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ============================================
    // PROJECT FILTERING
    // ============================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Filter cards with animation
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

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
            field.error.textContent = error;
            return false;
        } else {
            field.element.classList.remove('error');
            field.element.classList.add('success');
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

            contactForm.style.transform = 'translateX(5px)';
            setTimeout(() => {
                contactForm.style.transform = 'translateX(-5px)';
                setTimeout(() => {
                    contactForm.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        contactForm.style.transform = 'translateX(0)';
                    }, 100);
                }, 100);
            }, 100);
        } else {
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
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
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // RESUME DOWNLOAD HANDLER (Placeholder)
    // ============================================
    const resumeBtn = document.querySelector('a[href="app/images/Goodluck_Paul_Okoro_Enhanced_Resume.pdf"]');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
            // If resume.pdf doesn't exist, show a friendly alert
            // In production, this would download the actual file
            console.log('Resume download clicked - ensure app/images/Goodluck_Paul_Okoro_Enhanced_Resume.pdf exists in the same directory');
        });
    }
});

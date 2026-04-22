// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Prevent body scroll when menu is open on mobile
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scrolling for navigation links (SPA behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update URL without page reload (SPA)
            history.pushState(null, null, this.getAttribute('href'));
        }
    });
});

// Handle browser back/forward buttons (SPA)
window.addEventListener('popstate', (e) => {
    e.preventDefault();
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Navbar background on scroll (optimized with throttle)
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.scrollY;
            
            // Change navbar background based on scroll
            if (currentScroll > 50) {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.8)';
                navbar.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// Intersection Observer for fade-in animations (SPA)
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate skill bars
            if (entry.target.classList.contains('skill-category')) {
                const bars = entry.target.querySelectorAll('.skill-bar-fill');
                bars.forEach(bar => {
                    const width = bar.getAttribute('data-width') || '90%';
                    bar.style.width = width;
                });
            }
            
            // Stagger animation for cards
            if (entry.target.classList.contains('project-card') || 
                entry.target.classList.contains('skill-category') ||
                entry.target.classList.contains('contact-card')) {
                // Individual card animation
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        }
    });
}, observerOptions);

// Observe all sections (but keep them visible)
document.querySelectorAll('section').forEach(el => {
    // Don't hide sections, just observe them
    observer.observe(el);
});

// Observe cards with initial hidden state
document.querySelectorAll('.project-card, .skill-category, .contact-card').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Active navigation highlighting (SPA)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Parallax effect on hero section (desktop only)
const hero = document.querySelector('.hero');
if (hero && !isMobile && window.innerWidth > 768) {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (scrolled < window.innerHeight) {
                    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                    hero.style.opacity = 1 - (scrolled / window.innerHeight);
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Cursor trail effect (desktop only)
if (!isMobile && !isTouch && window.innerWidth > 768) {
    const coords = { x: 0, y: 0 };
    const circles = document.querySelectorAll('.circle');

    if (circles.length === 0) {
        // Create cursor trail circles
        for (let i = 0; i < 20; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(circle);
        }
    }

    const allCircles = document.querySelectorAll('.circle');

    allCircles.forEach((circle, index) => {
        circle.x = 0;
        circle.y = 0;
    });

    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        allCircles.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.opacity = (20 - index) / 20 * 0.5;

            circle.x = x;
            circle.y = y;

            const nextCircle = allCircles[index + 1] || allCircles[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// Preload animation
window.addEventListener('load', () => {
    // Ensure body is visible
    document.body.style.opacity = '1';
    
    // Trigger animations for visible elements
    const visibleElements = document.querySelectorAll('.project-card, .skill-category, .contact-card');
    visibleElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
});

// Handle initial hash on page load (SPA)
window.addEventListener('DOMContentLoaded', () => {
    // Ensure all sections are visible initially
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    });
    
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 300);
    }
});

// Handle external links (open in new tab)
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// Lazy load images (SPA optimization)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add active class style dynamically
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: var(--primary-color);
    }
    
    .nav-menu a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

console.log('✨ SPA Portfolio loaded successfully!');

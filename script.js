/* ========================================
   BALMA LUXURY EVENT VENUE - JAVASCRIPT
   Author: Professional Web Designer
   Description: Interactivity and functionality
   ======================================== */

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// 1. LOADING PAGE TRANSITION
// Hide loading page on first user interaction (scroll, click) or after 3 seconds
// ========================================

const loadingPage = document.getElementById('loadingPage');
let hasInteracted = false;

function hideLoadingPage() {
    if (!hasInteracted) {
        hasInteracted = true;
        loadingPage.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Listen for scroll (including wheel), click to trigger transition
window.addEventListener('scroll', hideLoadingPage, { once: true });
window.addEventListener('wheel', hideLoadingPage, { once: true });
window.addEventListener('click', hideLoadingPage, { once: true });
window.addEventListener('touchstart', hideLoadingPage, { once: true });

// Auto-hide after 3 seconds if no interaction
setTimeout(hideLoadingPage, 3000);

// ========================================
// 2. NAVIGATION BAR
// Hamburger menu, smooth scrolling, scroll effects
// ========================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Smooth scroll to sections
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Hide navbar on scroll down, show on scroll up
let lastScrollTop = 0;
const scrollThreshold = 100;

window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Navbar sempre visibile - non si nasconde più durante lo scroll
    navbar.style.transform = 'translateY(0)';
    
    lastScrollTop = scrollTop;
}, 100));

// ========================================
// 3. LANGUAGE SWITCHER
// Toggle between English and Italian
// ========================================

const langButtons = document.querySelectorAll('.lang-btn');
let currentLang = 'it';  // Default language is Italian

// Translation data structure
// Add more translations as needed
const translations = {
    en: {},  // English translations
    it: {}   // Italian is default in HTML
};

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const newLang = btn.getAttribute('data-lang');
        
        if (newLang !== currentLang) {
            currentLang = newLang;
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update page language
            document.documentElement.lang = currentLang;
            
            // Switch all translatable elements
            switchLanguage(currentLang);
        }
    });
});

/**
 * Switch language for all elements with data-en and data-it attributes
 * @param {string} lang - Language code ('en' or 'it')
 */
function switchLanguage(lang) {
    const elements = document.querySelectorAll('[data-en][data-it]');
    
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // Handle different element types
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });
}

// ========================================
// 4. SETUP SECTION - LAYOUT SWITCHER
// Interactive tabs for different seating arrangements
// ========================================

const layoutTabs = document.querySelectorAll('.layout-tab');
const layoutDisplays = document.querySelectorAll('.layout-display');

layoutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const layoutType = tab.getAttribute('data-layout');
        
        // Update active tab
        layoutTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update displayed layout
        layoutDisplays.forEach(display => {
            if (display.getAttribute('data-layout') === layoutType) {
                display.classList.add('active');
            } else {
                display.classList.remove('active');
            }
        });
    });
});

// ========================================
// 5. GALLERY LIGHTBOX
// Open, close, and navigate through gallery images
// ========================================

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
const galleryImages = Array.from(galleryItems).map(item => {
    const img = item.querySelector('.gallery-img');
    return {
        src: img.src,
        alt: img.alt
    };
});

// Open lightbox
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
    });
});

function openLightbox() {
    lightbox.classList.add('active');
    updateLightboxImage();
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateLightboxImage() {
    const image = galleryImages[currentImageIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

// Lightbox controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNextImage);
lightboxPrev.addEventListener('click', showPrevImage);

// Close lightbox on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
        }
    }
});

// ========================================
// 6. STORIA SECTION - IMAGE SLIDER
// Automatic slider that cycles through 6 images every 8 seconds
// Manual controls with arrow buttons and dots
// ========================================

const storiaSliderImages = document.querySelectorAll('.storia-slider-img');
const sliderArrowLeft = document.querySelector('.slider-arrow-left');
const sliderArrowRight = document.querySelector('.slider-arrow-right');
const sliderDots = document.querySelectorAll('.slider-dot');
let currentSlideIndex = 0;
let sliderInterval;

function updateSlider() {
    // Update images
    storiaSliderImages.forEach((img, index) => {
        img.classList.toggle('active', index === currentSlideIndex);
    });
    
    // Update dots
    sliderDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
}

function showNextSlide() {
    // Move to next image (loop back to 0 if at the end)
    currentSlideIndex = (currentSlideIndex + 1) % storiaSliderImages.length;
    updateSlider();
}

function showPrevSlide() {
    // Move to previous image (loop to last if at the beginning)
    currentSlideIndex = (currentSlideIndex - 1 + storiaSliderImages.length) % storiaSliderImages.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlideIndex = index;
    updateSlider();
}

function resetSliderInterval() {
    // Clear existing interval and start a new one
    clearInterval(sliderInterval);
    sliderInterval = setInterval(showNextSlide, 8000);
}

// Start the slider if images exist
if (storiaSliderImages.length > 0) {
    sliderInterval = setInterval(showNextSlide, 8000); // Change image every 8 seconds
    
    // Add click event listeners to arrow buttons
    if (sliderArrowRight) {
        sliderArrowRight.addEventListener('click', () => {
            showNextSlide();
            resetSliderInterval(); // Reset the auto-advance timer
        });
    }
    
    if (sliderArrowLeft) {
        sliderArrowLeft.addEventListener('click', () => {
            showPrevSlide();
            resetSliderInterval(); // Reset the auto-advance timer
        });
    }
    
    // Add click event listeners to dots
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetSliderInterval(); // Reset the auto-advance timer
        });
    });
}

// ========================================
// 7. LAZY LOADING IMAGES
// Load images as they enter viewport for better performance
// ========================================

const lazyImages = document.querySelectorAll('img[loading="lazy"]');

// Use Intersection Observer API for efficient lazy loading
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Image will load automatically due to loading="lazy" attribute
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// 8. FORM VALIDATION
// Client-side validation for contact form
// ========================================

const contactForm = document.getElementById('contactForm');
const thankYouPopup = document.getElementById('thankYouPopup');
const popupClose = document.getElementById('popupClose');

contactForm.addEventListener('submit', async (e) => {
    // Clear previous errors
    const formGroups = contactForm.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('error'));
    
    // Validate form
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('name');
    if (name.value.trim() === '') {
        name.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone');
    if (phone.value.trim() === '') {
        phone.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    // Event date validation
    const eventDate = document.getElementById('eventDate');
    if (eventDate.value === '') {
        eventDate.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    // Guests validation
    const guests = document.getElementById('guests');
    if (guests.value === '' || guests.value < 1) {
        guests.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    // Message validation
    const message = document.getElementById('message');
    if (message.value.trim() === '') {
        message.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    // If form is NOT valid, prevent submission
    if (!isValid) {
        e.preventDefault();
        return false;
    }
    
    // If valid, show popup before form submits
    e.preventDefault();
    showThankYouPopup();
    
    // Submit the form after showing popup
    setTimeout(() => {
        contactForm.submit();
    }, 100);
});

function showThankYouPopup() {
    thankYouPopup.classList.add('active');
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        closeThankYouPopup();
    }, 3000);
}

function closeThankYouPopup() {
    thankYouPopup.classList.remove('active');
    contactForm.reset();
}

// Close popup on X click
if (popupClose) {
    popupClose.addEventListener('click', closeThankYouPopup);
}

// Close popup on background click
thankYouPopup.addEventListener('click', (e) => {
    if (e.target === thankYouPopup) {
        closeThankYouPopup();
    }
});

// Real-time validation on blur
const formInputs = contactForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateField(input);
    });
});

/**
 * Validate individual form field
 * @param {HTMLElement} field - Input or textarea element
 */
function validateField(field) {
    const formGroup = field.closest('.form-group');
    
    if (field.hasAttribute('required')) {
        if (field.value.trim() === '') {
            formGroup.classList.add('error');
        } else {
            // Additional validation for specific fields
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(field.value.trim())) {
                    formGroup.classList.remove('error');
                } else {
                    formGroup.classList.add('error');
                }
            } else if (field.type === 'number') {
                if (field.value > 0) {
                    formGroup.classList.remove('error');
                } else {
                    formGroup.classList.add('error');
                }
            } else {
                formGroup.classList.remove('error');
            }
        }
    }
}

// ========================================
// 9. SCROLL ANIMATIONS
// Fade in elements as they enter viewport
// ========================================

// Add fade-in class to elements you want to animate
const animatedElements = document.querySelectorAll('.service-card, .process-step, .stat-item');

if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
}

// ========================================
// REVIEWS BANNER
// Show/hide reviews banner based on scroll position
// ========================================

const reviewsBanner = document.getElementById('reviewsBanner');
const doveSiamoSection = document.getElementById('dove-siamo');
const contactSection = document.getElementById('contact');

if (reviewsBanner && doveSiamoSection && contactSection) {
    // Reviews rotation with slide animation
    const reviewItems = reviewsBanner.querySelectorAll('.review-item');
    let currentReviewIndex = 0;
    
    function rotateReviews() {
        const currentReview = reviewItems[currentReviewIndex];
        
        // Add exiting class to current review
        currentReview.classList.add('exiting');
        
        // After animation, remove classes and show next review
        setTimeout(() => {
            currentReview.classList.remove('active', 'exiting');
            currentReviewIndex = (currentReviewIndex + 1) % reviewItems.length;
            reviewItems[currentReviewIndex].classList.add('active');
        }, 500);
    }
    
    // Start rotation every 8 seconds
    setInterval(rotateReviews, 8000);
    
    // Check if banner should be visible based on scroll position
    function checkBannerVisibility() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollBottom = scrollY + windowHeight;
        
        const doveSiamoTop = doveSiamoSection.offsetTop;
        const doveSiamoBottom = doveSiamoTop + doveSiamoSection.offsetHeight;
        const contactTop = contactSection.offsetTop;
        const contactBottom = contactTop + contactSection.offsetHeight;
        const contactHeight = contactSection.offsetHeight;
        const contactMiddle = contactTop + (contactHeight / 2);
        
        // Banner is visible if we've scrolled past the start of "Dove Siamo"
        // and haven't scrolled past the middle of "Contatti"
        const pastDoveSiamo = scrollY >= doveSiamoTop - windowHeight / 2;
        const beforeContactMiddle = scrollY < contactMiddle;
        
        if (pastDoveSiamo && beforeContactMiddle) {
            reviewsBanner.classList.add('visible');
        } else {
            reviewsBanner.classList.remove('visible');
        }
    }
    
    // Initial check
    checkBannerVisibility();
    
    // Check on scroll
    window.addEventListener('scroll', checkBannerVisibility);
    
    // Close banner on X button click
    const reviewClose = document.getElementById('reviewClose');
    if (reviewClose) {
        reviewClose.addEventListener('click', () => {
            reviewsBanner.classList.remove('visible');
            // Optional: prevent banner from reappearing until page reload
            reviewsBanner.style.display = 'none';
        });
    }
}

// ========================================
// 10. SMOOTH SCROLL TO TOP
// Add a back-to-top button (optional enhancement)
// ========================================

// Create back-to-top button dynamically
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i data-lucide="chevron-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.setAttribute('aria-label', 'Back to top');
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: var(--color-secondary);
    color: white;
    font-size: 2rem;
    border: none;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    padding: 0;
`;

document.body.appendChild(backToTopButton);

// Initialize Lucide icons for the button
if (typeof lucide !== 'undefined') {
    // Use setTimeout to ensure the button is in the DOM
    setTimeout(() => {
        lucide.createIcons();
    }, 0);
}

// Show/hide back-to-top button based on scroll position
window.addEventListener('scroll', debounce(() => {
    if (window.pageYOffset > 500) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
}, 100));

// Scroll to top on click
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopButton.addEventListener('mouseenter', () => {
    backToTopButton.style.transform = 'translateY(-5px)';
});

backToTopButton.addEventListener('mouseleave', () => {
    backToTopButton.style.transform = 'translateY(0)';
});

// ========================================
// 11. PERFORMANCE OPTIMIZATION
// Preload critical images
// ========================================

// Preload hero image and logo for faster initial display
const heroImage = document.querySelector('.hero-image');
if (heroImage) {
    const heroSrc = getComputedStyle(heroImage).backgroundImage.slice(5, -2);
    const img = new Image();
    img.src = heroSrc;
}

// ========================================
// INITIALIZATION
// Code that runs when DOM is fully loaded
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('BALMA website loaded successfully');
    
    // Set initial body overflow for loading page
    document.body.style.overflow = 'hidden';
    
    // Add any additional initialization here
});

// ========================================
// ERROR HANDLING
// Global error handler for graceful degradation
// ========================================

window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // You can add user-friendly error messaging here if needed
});

// ========================================
// BROWSER COMPATIBILITY CHECKS
// Provide fallbacks for older browsers
// ========================================

// Check for required features and provide fallbacks
if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without Intersection Observer
    // All images will load immediately
    console.warn('IntersectionObserver not supported. Images will load immediately.');
}

if (!('fetch' in window)) {
    console.warn('Fetch API not supported. Form submission may not work correctly.');
}

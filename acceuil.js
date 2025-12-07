// Cart Management
var cart = [];

// Initialize cart from memory (not localStorage as it's not supported)
function initCart() {
    updateCart();
}

function updateCart() {
    var cartCount = document.getElementById('cartCount');
    var cartItems = document.getElementById('cartItems');
    var cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    var totalItems = 0;
    for (var i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity;
    }
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Votre panier est vide</p>';
    } else {
        var html = '';
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            html += '<div class="cart-item">';
            html += '<div class="cart-item-info">';
            html += '<strong>' + item.name + '</strong>';
            html += '<div>' + item.price.toFixed(2) + ' € × ' + item.quantity + '</div>';
            html += '</div>';
            html += '<div class="cart-item-controls">';
            html += '<button class="qty-btn" onclick="updateQuantity(' + item.id + ', -1)">-</button>';
            html += '<span>' + item.quantity + '</span>';
            html += '<button class="qty-btn" onclick="updateQuantity(' + item.id + ', 1)">+</button>';
            html += '<button class="qty-btn" onclick="removeFromCart(' + item.id + ')" style="background: #d32f2f;">×</button>';
            html += '</div>';
            html += '</div>';
        }
        cartItems.innerHTML = html;
    }
    
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }
    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(productId) {
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]);
        }
    }
    cart = newCart;
    updateCart();
}

function updateQuantity(productId, change) {
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity += change;
            if (cart[i].quantity <= 0) {
                removeFromCart(productId);
                return;
            }
            break;
        }
    }
    updateCart();
}

function toggleCart() {
    var cartModal = document.getElementById('cartModal');
    if (cartModal.classList.contains('open')) {
        cartModal.classList.remove('open');
    } else {
        cartModal.classList.add('open');
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Votre panier est vide');
        return;
    }
    alert('Fonctionnalité de commande bientôt disponible!');
}

// Mobile Menu Toggle
function toggleMenu() {
    var nav = document.getElementById('mainNav');
    var menuToggle = document.querySelector('.menu-toggle');
    
    if (nav && menuToggle) {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    var nav = document.getElementById('mainNav');
    var menuToggle = document.querySelector('.menu-toggle');
    
    if (nav && menuToggle) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }
});

// Hero Banner Carousel
var currentSlide = 0;
var slides = [];
var slideInterval;
var isTransitioning = false;

function initCarousel() {
    slides = document.querySelectorAll('.slide');
    var indicators = document.querySelectorAll('.indicator');
    
    if (slides.length > 0) {
        startAutoSlide();
    }
}

function startAutoSlide() {
    slideInterval = setInterval(function() {
        changeSlide(1);
    }, 5000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

function changeSlide(direction) {
    if (isTransitioning || slides.length === 0) return;
    
    isTransitioning = true;
    slides[currentSlide].classList.remove('active');
    
    var indicators = document.querySelectorAll('.indicator');
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.remove('active');
    }
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
    }
    
    setTimeout(function() {
        isTransitioning = false;
    }, 1000);
}

function goToSlide(index) {
    if (isTransitioning || slides.length === 0 || index === currentSlide) return;
    
    stopAutoSlide();
    isTransitioning = true;
    
    slides[currentSlide].classList.remove('active');
    var indicators = document.querySelectorAll('.indicator');
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.remove('active');
    }
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
    }
    
    setTimeout(function() {
        isTransitioning = false;
        startAutoSlide();
    }, 1000);
}

// Smooth Scrolling for Anchor Links
function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function(e) {
            var targetId = this.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                var nav = document.getElementById('mainNav');
                var menuToggle = document.querySelector('.menu-toggle');
                if (nav && menuToggle) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    }
}

// Header Shadow on Scroll
function initHeaderScroll() {
    var header = document.querySelector('header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

// Intersection Observer for Animations
function initAnimations() {
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    var animatedElements = document.querySelectorAll('.value-item, .presentation-text, .presentation-image');
    
    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// CTA Button Ripple Effect
function initCTAEffects() {
    var ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            var rect = this.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            
            var ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.5)';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            
            this.appendChild(ripple);
            
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    initCarousel();
    initSmoothScroll();
    initHeaderScroll();
    initAnimations();
    initCTAEffects();
    
    console.log('Biscottino\'s website initialized successfully!');
});

// Pause carousel when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoSlide();
    } else {
        startAutoSlide();
    }
});

// Keyboard navigation for carousel
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        stopAutoSlide();
        changeSlide(-1);
        setTimeout(startAutoSlide, 5000);
    } else if (e.key === 'ArrowRight') {
        stopAutoSlide();
        changeSlide(1);
        setTimeout(startAutoSlide, 5000);
    }
});
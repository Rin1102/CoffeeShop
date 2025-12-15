/* ========================================
   GLOBAL VARIABLES
   ======================================== */
/* Cart array to store all products added by user */
var cart = [];

/* Object to store customer information (name, phone, address) */
let customerDetails = {};

/* ========================================
   CART INITIALIZATION & PERSISTENCE
   ======================================== */

/* 
 * Initialize cart from localStorage on page load
 * Retrieves saved cart data and updates the display
 */
function initCart() {
    const savedCart = localStorage.getItem('biscottinos_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartDisplay();
}

/* 
 * Save current cart state to localStorage
 * Ensures cart persists across page refreshes
 */
function saveCart() {
    localStorage.setItem('biscottinos_cart', JSON.stringify(cart));
}

/* ========================================
   CART DISPLAY UPDATES
   ======================================== */

/* 
 * Update all cart-related displays
 * Updates both the item count badge and total price
 */
function updateCartDisplay() {
    updateCartCount();
    calculateCartTotal();
}

/* 
 * Update the cart item count badge in the header
 * Shows total number of items (sum of all quantities)
 */
function updateCartCount() {
    /* reduce() is a JavaScript method that reduces an array to a single value
       by applying a function on each element */
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
    }
}

/* 
 * Calculate and display the total price of all items in cart
 * Multiplies each item's price by its quantity and sums them up
 * Returns the total value
 */
function calculateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.textContent = total.toFixed(2);
    }
    return total;
}

/* ========================================
   CART MODAL CONTROLS
   ======================================== */

/* 
 * Toggle cart modal open/closed
 * Opens the sliding cart panel from the right side or closes it
 */
function toggleCart() {
    /* 1. Get the cart modal HTML element */
    var cartModal = document.getElementById('cartModal');
    
    /* 2. Check if cart is already open */
    if (cartModal.classList.contains('open')) {
        /* If YES → Close the cart by removing 'open' class */
        cartModal.classList.remove('open');
    } else {
        /* If NO → Open the cart */
        cartModal.classList.add('open');      /* Add 'open' class (triggers opening animation) */
        renderCartItems();                     /* Display cart items */
    }
}

/* 
 * Render all cart items in the cart modal
 * Creates HTML for each product with quantity controls
 * Shows empty cart message if no items
 */
function renderCartItems() {
    var cartItemsContainer = document.getElementById('cartItems');
    var invoiceArea = document.getElementById('invoiceArea');
    var checkoutBtn = document.getElementById('checkoutBtn');
    var customerFormArea = document.getElementById('customerFormArea');
    
    if (!cartItemsContainer || !invoiceArea || !checkoutBtn || !customerFormArea) return;
    
    /* Hide alternative views (invoice and checkout form) */
    invoiceArea.classList.remove('visible');
    customerFormArea.classList.remove('visible');
    
    /* Show cart view */
    cartItemsContainer.style.display = 'block';
    checkoutBtn.style.display = 'block';
    
    cartItemsContainer.innerHTML = '';
    
    /* Display empty cart message if no items */
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Votre panier est vide</p>';
        checkoutBtn.disabled = true;
        updateCartDisplay();
        return;
    }
    
    checkoutBtn.disabled = false;
    
    /* Create HTML for each cart item with quantity controls */
    cart.forEach(function(item) {
        var itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = 
            '<div class="cart-item-info">' +
                '<strong>' + item.name + '</strong>' +
                '<div>' + item.price.toFixed(2) + ' DT x ' + item.quantity + ' = ' + (item.price * item.quantity).toFixed(2) + ' DT</div>' +
            '</div>' +
            '<div class="cart-item-controls">' +
                '<button class="qty-btn" onclick="updateQuantity(' + item.id + ', -1)">-</button>' +
                '<span>' + item.quantity + '</span>' +
                '<button class="qty-btn" onclick="updateQuantity(' + item.id + ', 1)">+</button>' +
            '</div>';
        cartItemsContainer.appendChild(itemElement);
    });
    
    updateCartDisplay();
    
    /* Reset customer form if it exists */
    var form = document.getElementById('customerForm');
    if (form) form.reset();
}

/* ========================================
   CART ITEM MANAGEMENT
   ======================================== */

/* 
 * Add a product to the cart
 * If product already exists, increment quantity
 * If new product, add it with quantity 1
 * Saves cart and provides visual feedback
 */
function addToCart(productId, productName, productPrice) {
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        /* Product already in cart - increase quantity */
        cartItem.quantity += 1;
    } else {
        /* New product - add to cart */
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    saveCart();
    updateCartDisplay();
    
    /* Show brief visual feedback on cart icon */
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

/* 
 * Remove a product completely from the cart
 * Filters out the item by ID and updates storage
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
}

/* 
 * Update the quantity of a cart item
 * Change can be +1 or -1
 * Removes item if quantity reaches 0
 */
function updateQuantity(productId, change) {
    const cartItemIndex = cart.findIndex(item => item.id === productId);

    if (cartItemIndex > -1) {
        const item = cart[cartItemIndex];
        item.quantity += change;

        /* Remove item if quantity is 0 or less */
        if (item.quantity <= 0) {
            cart.splice(cartItemIndex, 1);
        }
    }
    
    saveCart();
    renderCartItems();
}

/* ========================================
   CHECKOUT PROCESS
   ======================================== */

/* 
 * Initiate checkout process
 * Validates cart is not empty
 * Hides cart view and shows customer information form
 */
function checkout() {
    if (cart.length === 0) {
        alert("Votre panier est vide. Veuillez ajouter des articles avant de commander.");
        return;
    }
    
    /* Save cart snapshot for invoice generation later */
    window.tempCartForInvoice = JSON.stringify(cart);
    
    /* Hide cart items and checkout button */
    document.getElementById('cartItems').style.display = 'none';
    document.getElementById('checkoutBtn').style.display = 'none';
    
    /* Update total display */
    var total = calculateCartTotal();
    document.getElementById('cartTotal').textContent = total.toFixed(2);
    
    /* Show customer information form */
    document.getElementById('customerFormArea').classList.add('visible');
}

/* 
 * Process the order after customer submits their information
 * Validates required fields (name and phone)
 * Generates invoice and clears the cart
 */
function processOrder() {
    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var address = document.getElementById('address').value.trim();
    
    /* Validate required fields */
    if (!name || !phone) {
        alert("Veuillez remplir votre nom complet et votre numéro de téléphone.");
        return;
    }
    
    /* Store customer details */
    customerDetails = { name: name, phone: phone, address: address };
    
    /* Hide customer form */
    document.getElementById('customerFormArea').classList.remove('visible');
    
    /* Generate and display invoice */
    generateInvoice();
    
    /* Clear cart after successful order */
    cart = [];
    saveCart();
    updateCartDisplay();
    
    alert("Commande enregistrée ! Vous pouvez consulter la facture ci-dessous.");
}

/* 
 * Generate and display the order invoice
 * Shows order number, date, customer info, and itemized list
 * Uses saved cart snapshot to ensure accuracy
 */
function generateInvoice() {
    var invoiceArea = document.getElementById('invoiceArea');
    
    /* Retrieve saved cart items for invoice */
    var itemsToInvoice = JSON.parse(window.tempCartForInvoice || '[]');
    var customer = customerDetails;
    
    /* Error handling if no items found */
    if (itemsToInvoice.length === 0) {
        invoiceArea.innerHTML = '<p style="padding: 2rem; text-align: center; color: red;">Erreur: Impossible de trouver les articles pour la facture.</p>';
        invoiceArea.classList.add('visible');
        window.tempCartForInvoice = null;
        return;
    }
    
    /* Calculate final total */
    var finalTotal = 0;
    for (var i = 0; i < itemsToInvoice.length; i++) {
        finalTotal += itemsToInvoice[i].price * itemsToInvoice[i].quantity;
    }
    
    /* Build invoice HTML with order details */
    var invoiceContent = 
        '<div class="invoice-details">' +
            '<h4>Confirmation de Commande #' + Math.floor(Math.random() * 10000) + '</h4>' +
            '<p>Date et Heure: ' + new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'medium' }) + '</p>' +
            '<hr style="margin: 0.75rem 0; border-color: #ddd;">' +
            '<h5>Détails du Client:</h5>' +
            '<p><strong>Nom:</strong> ' + customer.name + '</p>' +
            '<p><strong>Tél:</strong> ' + customer.phone + '</p>';
    
    /* Add address if provided */
    if (customer.address) {
        invoiceContent += '<p><strong>Adresse:</strong> ' + customer.address + '</p>';
    }
    
    /* Add itemized list of products */
    invoiceContent += 
        '<hr style="margin: 0.75rem 0; border-color: #ddd;">' +
        '<h5>Détail des Articles :</h5>' +
        '<ul style="padding-left: 0;">';
    
    for (var i = 0; i < itemsToInvoice.length; i++) {
        var item = itemsToInvoice[i];
        invoiceContent += 
            '<li style="list-style: none; padding: 0.2rem 0; display: flex; justify-content: space-between;">' +
                '<span>' + item.name + ' (x' + item.quantity + ')</span>' +
                '<span>' + (item.price * item.quantity).toFixed(2) + ' DT</span>' +
            '</li>';
    }
    
    /* Add total and close button */
    invoiceContent += 
        '</ul>' +
        '<hr style="margin: 0.75rem 0; border-color: var(--secondary-color);">' +
        '<h5 style="text-align: right; color: var(--primary-color);">Total Payé: ' + finalTotal.toFixed(2) + ' DT</h5>' +
        '<p style="margin-top: 1rem; text-align: center; font-style: italic;">Merci de votre confiance ! Votre commande est en cours de préparation.</p>' +
        '<button class="checkout-btn" onclick="toggleCart()" style="background: linear-gradient(135deg, var(--secondary-color), #2a3570); margin-top: 1.5rem;">Fermer la facture</button>' +
        '</div>';
    
    /* Display invoice */
    invoiceArea.innerHTML = invoiceContent;
    invoiceArea.classList.add('visible');
    
    /* Clear temporary cart data */
    window.tempCartForInvoice = null;
}

/* ========================================
   MOBILE NAVIGATION
   ======================================== */

/* 
 * Toggle mobile navigation menu
 * Opens/closes the slide-in menu and animates hamburger icon
 */
function toggleMenu() {
    var nav = document.getElementById('mainNav');
    var menuToggle = document.querySelector('.menu-toggle');
    
    if (nav && menuToggle) {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }
}

/* 
 * Close mobile menu when clicking outside
 * Event listener that detects clicks outside nav and menu button
 */
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

/* ========================================
   HERO BANNER CAROUSEL
   ======================================== */

/* Carousel state variables */
var currentSlide = 0;          /* Index of currently displayed slide */
var slides = [];               /* Array of all slide elements */
var slideInterval;             /* Interval ID for auto-sliding */
var isTransitioning = false;   /* Prevents multiple transitions at once */

/* 
 * Initialize the carousel
 * Gets all slide elements and starts automatic sliding
 */
function initCarousel() {
    slides = document.querySelectorAll('.slide');
    var indicators = document.querySelectorAll('.indicator');
    
    if (slides.length > 0) {
        startAutoSlide();
    }
}

/* 
 * Start automatic slide rotation
 * Changes slide every 5 seconds
 */
function startAutoSlide() {
    slideInterval = setInterval(function() {
        changeSlide(1);
    }, 5000);
}

/* 
 * Stop automatic slide rotation
 * Clears the interval timer
 */
function stopAutoSlide() {
    clearInterval(slideInterval);
}

/* 
 * Change to next or previous slide
 * Direction: +1 for next, -1 for previous
 * Updates slide visibility and indicator dots
 */
function changeSlide(direction) {
    if (isTransitioning || slides.length === 0) return;
    
    isTransitioning = true;
    
    /* Hide current slide */
    slides[currentSlide].classList.remove('active');
    
    var indicators = document.querySelectorAll('.indicator');
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.remove('active');
    }
    
    /* Calculate new slide index (wraps around at ends) */
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    /* Show new slide */
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
    }
    
    /* Allow next transition after animation completes */
    setTimeout(function() {
        isTransitioning = false;
    }, 1000);
}

/* 
 * Jump directly to a specific slide
 * Used by indicator dots for direct navigation
 * Pauses auto-slide temporarily
 */
function goToSlide(index) {
    if (isTransitioning || slides.length === 0 || index === currentSlide) return;
    
    stopAutoSlide();
    isTransitioning = true;
    
    /* Hide current slide */
    slides[currentSlide].classList.remove('active');
    var indicators = document.querySelectorAll('.indicator');
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.remove('active');
    }
    
    /* Set new slide */
    currentSlide = index;
    
    /* Show new slide */
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
    }
    
    /* Resume auto-slide after transition */
    setTimeout(function() {
        isTransitioning = false;
        startAutoSlide();
    }, 1000);
}

/* ========================================
   SMOOTH SCROLLING
   ======================================== */

/* 
 * Enable smooth scrolling for anchor links
 * Scrolls smoothly to sections when clicking navigation links
 * Closes mobile menu after navigation
 */
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
                
                /* Close mobile menu after navigation */
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

/* ========================================
   HEADER SCROLL EFFECTS
   ======================================== */

/* 
 * Add shadow to header on scroll
 * Increases shadow depth when user scrolls down
 */
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

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */

/* 
 * Initialize fade-in animations for elements
 * Uses Intersection Observer to animate elements when they enter viewport
 * Elements fade in and slide up when scrolled into view
 */
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
    
    /* Select elements to animate */
    var animatedElements = document.querySelectorAll('.value-item, .presentation-text, .presentation-image');
    
    /* Set initial state and observe each element */
    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

/* ========================================
   CTA BUTTON EFFECTS
   ======================================== */

/* 
 * Add hover and click effects to CTA button
 * Hover: enlarges button and enhances shadow
 * Click: creates ripple effect at click position
 */
function initCTAEffects() {
    var ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        /* MOUSEENTER - Enlarge button and enhance shadow */
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.08)';
            this.style.boxShadow = '0 10px 30px rgba(74, 68, 189, 0.5)';
        });
        
        /* MOUSELEAVE - Reset to original state */
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(74, 68, 189, 0.3)';
        });
        
        /* CLICK - Create ripple effect at mouse position */
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
            
            /* Remove ripple after animation */
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    }
}

/* ========================================
   PAGE INITIALIZATION
   ======================================== */

/* 
 * Initialize all features when DOM is fully loaded
 * Runs all initialization functions in sequence
 */
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    initCarousel();
    initSmoothScroll();
    initHeaderScroll();
    initAnimations();
    initCTAEffects();
    
    console.log('Biscottino\'s website initialized successfully!');
});

/* ========================================
   CAROUSEL VISIBILITY CONTROL
   ======================================== */

/* 
 * Pause carousel when page is not visible
 * Resumes when user returns to tab
 * Improves performance and battery usage
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoSlide();
    } else {
        startAutoSlide();
    }
});

/* ========================================
   KEYBOARD NAVIGATION
   ======================================== */

/* 
 * Enable keyboard navigation for carousel
 * Left arrow: previous slide
 * Right arrow: next slide
 * Temporarily pauses auto-slide after manual navigation
 */
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
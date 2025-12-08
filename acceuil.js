// Cart Management with localStorage sync
var cart = [];
let customerDetails = {};

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('biscottinos_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('biscottinos_cart', JSON.stringify(cart));
}

// Update all cart displays
function updateCartDisplay() {
    updateCartCount();
    calculateCartTotal();
}

function updateCartCount() {
    //reduce() est une méthode JavaScript qui réduit un tableau à une seule valeur
    //  en appliquant une fonction sur chaque élément.
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
    }
}

function calculateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.textContent = total.toFixed(2);
    }
    return total;
}

function toggleCart() {
    // 1. Récupère l'élément HTML du panier modal
    var cartModal = document.getElementById('cartModal');
    
    // 2. Vérifie si le panier est déjà ouvert
    if (cartModal.classList.contains('open')) {
        // Si OUI → Ferme le panier en retirant la classe 'open'
        cartModal.classList.remove('open');
    } else {
        // Si NON → Ouvre le panier
        cartModal.classList.add('open');      // Ajoute la classe 'open' (animation d'ouverture)
        renderCartItems();                     // Affiche les articles du panier
    }
}
function renderCartItems() {
    var cartItemsContainer = document.getElementById('cartItems');
    var invoiceArea = document.getElementById('invoiceArea');
    var checkoutBtn = document.getElementById('checkoutBtn');
    var customerFormArea = document.getElementById('customerFormArea');
    
    if (!cartItemsContainer || !invoiceArea || !checkoutBtn || !customerFormArea) return;
    
    // Hide alternative views
    invoiceArea.classList.remove('visible');
    customerFormArea.classList.remove('visible');
    
    // Show cart view
    cartItemsContainer.style.display = 'block';
    checkoutBtn.style.display = 'block';
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Votre panier est vide</p>';
        checkoutBtn.disabled = true;
        updateCartDisplay();
        return;
    }
    
    checkoutBtn.disabled = false;
    
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
    
    var form = document.getElementById('customerForm');
    if (form) form.reset();
}

function addToCart(productId, productName, productPrice) {
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    saveCart();
    updateCartDisplay();
    
    // Show brief feedback
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
}

function updateQuantity(productId, change) {
    const cartItemIndex = cart.findIndex(item => item.id === productId);

    if (cartItemIndex > -1) {
        const item = cart[cartItemIndex];
        item.quantity += change;

        if (item.quantity <= 0) {
            cart.splice(cartItemIndex, 1);
        }
    }
    
    saveCart();
    renderCartItems();
}

function checkout() {
    if (cart.length === 0) {
        alert("Votre panier est vide. Veuillez ajouter des articles avant de commander.");
        return;
    }
    
    // Save cart snapshot for invoice
    window.tempCartForInvoice = JSON.stringify(cart);
    
    document.getElementById('cartItems').style.display = 'none';
    document.getElementById('checkoutBtn').style.display = 'none';
    
    var total = calculateCartTotal();
    document.getElementById('cartTotal').textContent = total.toFixed(2);
    
    document.getElementById('customerFormArea').classList.add('visible');
}

function processOrder() {
    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var address = document.getElementById('address').value.trim();
    
    if (!name || !phone) {
        alert("Veuillez remplir votre nom complet et votre numéro de téléphone.");
        return;
    }
    
    customerDetails = { name: name, phone: phone, address: address };
    
    document.getElementById('customerFormArea').classList.remove('visible');
    
    generateInvoice();
    
    // Clear cart after order
    cart = [];
    saveCart();
    updateCartDisplay();
    
    alert("Commande enregistrée ! Vous pouvez consulter la facture ci-dessous.");
}

function generateInvoice() {
    var invoiceArea = document.getElementById('invoiceArea');
    
    var itemsToInvoice = JSON.parse(window.tempCartForInvoice || '[]');
    var customer = customerDetails;
    
    if (itemsToInvoice.length === 0) {
        invoiceArea.innerHTML = '<p style="padding: 2rem; text-align: center; color: red;">Erreur: Impossible de trouver les articles pour la facture.</p>';
        invoiceArea.classList.add('visible');
        window.tempCartForInvoice = null;
        return;
    }
    
    var finalTotal = 0;
    for (var i = 0; i < itemsToInvoice.length; i++) {
        finalTotal += itemsToInvoice[i].price * itemsToInvoice[i].quantity;
    }
    
    var invoiceContent = 
        '<div class="invoice-details">' +
            '<h4>Confirmation de Commande #' + Math.floor(Math.random() * 10000) + '</h4>' +
            '<p>Date et Heure: ' + new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'medium' }) + '</p>' +
            '<hr style="margin: 0.75rem 0; border-color: #ddd;">' +
            '<h5>Détails du Client:</h5>' +
            '<p><strong>Nom:</strong> ' + customer.name + '</p>' +
            '<p><strong>Tél:</strong> ' + customer.phone + '</p>';
    
    if (customer.address) {
        invoiceContent += '<p><strong>Adresse:</strong> ' + customer.address + '</p>';
    }
    
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
    
    invoiceContent += 
        '</ul>' +
        '<hr style="margin: 0.75rem 0; border-color: var(--secondary-color);">' +
        '<h5 style="text-align: right; color: var(--primary-color);">Total Payé: ' + finalTotal.toFixed(2) + ' DT /h5>' +
        '<p style="margin-top: 1rem; text-align: center; font-style: italic;">Merci de votre confiance ! Votre commande est en cours de préparation.</p>' +
        '<button class="checkout-btn" onclick="toggleCart()" style="background: linear-gradient(135deg, var(--secondary-color), #2a3570); margin-top: 1.5rem;">Fermer la facture</button>' +
        '</div>';
    
    invoiceArea.innerHTML = invoiceContent;
    invoiceArea.classList.add('visible');
    
    window.tempCartForInvoice = null;
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
// CTA Button Effects (Hover + Ripple)
function initCTAEffects() {
    var ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        // ✅ MOUSEENTER - Change color and enlarge
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.08)';
            this.style.boxShadow = '0 10px 30px rgba(74, 68, 189, 0.5)';
        });
        
        // ✅ MOUSELEAVE - Reset to original state
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(74, 68, 189, 0.3)';
        });
        
        // Click event for ripple effect (keep your existing code)
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
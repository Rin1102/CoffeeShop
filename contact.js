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
    var cartModal = document.getElementById('cartModal');
    if (cartModal.classList.contains('open')) {
        cartModal.classList.remove('open');
    } else {
        cartModal.classList.add('open');
        renderCartItems();
    }
}

function renderCartItems() {
    var cartItemsContainer = document.getElementById('cartItems');
    var invoiceArea = document.getElementById('invoiceArea');
    var checkoutBtn = document.getElementById('checkoutBtn');
    var customerFormArea = document.getElementById('customerFormArea');
    
    if (!cartItemsContainer || !invoiceArea || !checkoutBtn || !customerFormArea) return;
    
    invoiceArea.classList.remove('visible');
    customerFormArea.classList.remove('visible');
    
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
    
    window.tempCartForInvoice = JSON.stringify(cart);
    
    document.getElementById('cartItems').style.display = 'none';
    document.getElementById('checkoutBtn').style.display = 'none';
    
    var total = calculateCartTotal();
    document.getElementById('cartTotal').textContent = total.toFixed(2);
    
    document.getElementById('customerFormArea').classList.add('visible');
}

function processOrder() {
    var name = document.getElementById('cart-name').value.trim();
    var phone = document.getElementById('cart-phone').value.trim();
    var address = document.getElementById('cart-address').value.trim();
    
    if (!name || !phone) {
        alert("Veuillez remplir votre nom complet et votre numéro de téléphone.");
        return;
    }
    
    customerDetails = { name: name, phone: phone, address: address };
    
    document.getElementById('customerFormArea').classList.remove('visible');
    
    generateInvoice();
    
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
        '<h5 style="text-align: right; color: var(--primary-color);">Total Payé: ' + finalTotal.toFixed(2) + ' DT</h5>' +
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

// ===== CONTACT FORM VALIDATION =====

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function handleSubmit(event) {
    event.preventDefault();
    
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var message = document.getElementById('message');
    
    var isValid = true;
    
    // Validate name
    var nameGroup = name.parentElement;
    if (name.value.trim() === '') {
        nameGroup.classList.add('error');
        isValid = false;
    } else {
        nameGroup.classList.remove('error');
    }
    
    // Validate email
    var emailGroup = email.parentElement;
    if (email.value.trim() === '' || !validateEmail(email.value)) {
        emailGroup.classList.add('error');
        isValid = false;
    } else {
        emailGroup.classList.remove('error');
    }
    
    // Validate message
    var messageGroup = message.parentElement;
    if (message.value.trim() === '') {
        messageGroup.classList.add('error');
        isValid = false;
    } else {
        messageGroup.classList.remove('error');
    }
    
    // If form is valid, show confirmation and reset
    if (isValid) {
        var confirmationMessage = document.getElementById('confirmationMessage');
        confirmationMessage.classList.add('show');
        
        // Reset form
        name.value = '';
        email.value = '';
        message.value = '';
        
        // Hide confirmation after 5 seconds
        setTimeout(function() {
            confirmationMessage.classList.remove('show');
        }, 5000);
    }
}

// Real-time validation
document.getElementById('name').addEventListener('input', function() {
    if (this.value.trim() !== '') {
        this.parentElement.classList.remove('error');
    }
});

document.getElementById('email').addEventListener('input', function() {
    if (this.value.trim() !== '' && validateEmail(this.value)) {
        this.parentElement.classList.remove('error');
    }
});

document.getElementById('message').addEventListener('input', function() {
    if (this.value.trim() !== '') {
        this.parentElement.classList.remove('error');
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    console.log('Biscottino\'s contact page initialized successfully!');
});
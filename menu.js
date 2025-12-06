console.log("JS chargé ✓");

var products = [
    // BOISSONS
    { id: 1, name: 'Espresso', category: 'boissons', subCategory: 'coffee', price: 3.50, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400', description: 'Café italien authentique', extraInfo: 'Torréfié artisanalement, grains Arabica sélectionnés, une crema parfaite.', popularity: 95, reviews: '5/5 (25 avis clients)' },
    { id: 2, name: 'Cappuccino', category: 'boissons', subCategory: 'coffee', price: 4.50, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', description: 'Onctueux et crémeux', extraInfo: 'Mousse de lait veloutée, une touche de cannelle, parfait équilibre entre lait et café.', popularity: 90, reviews: '4.8/5 (30 avis clients)' },
    { id: 3, name: 'Latte', category: 'boissons', subCategory: 'coffee', price: 4.80, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', description: 'Doux et parfumé', extraInfo: 'Lait chaud délicatement moussé avec espresso. Idéal pour les amateurs de douceur.', popularity: 85, reviews: '4.5/5 (18 avis clients)' },
    { id: 4, name: 'Thé Vert', category: 'boissons', subCategory: 'tea', price: 3.00, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', description: 'Fraîcheur et légèreté', extraInfo: 'Thé vert premium du Japon, riche en antioxydants, infusé à la perfection.', popularity: 70, reviews: '4.3/5 (10 avis clients)' },
    
    // PÂTISSERIES (avec sous-catégories)
    { id: 5, name: 'Croissant', category: 'patisseries', subCategory: 'classique', price: 2.50, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', description: 'Croustillant et beurré', extraInfo: 'Fait maison chaque matin, pur beurre français. Un classique indispensable pour le petit-déjeuner.', popularity: 92, reviews: '5/5 (40 avis clients)' },
    { id: 6, name: 'Pain au Chocolat', category: 'patisseries', subCategory: 'classique', price: 2.80, image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=400', description: 'Chocolat fondant', extraInfo: 'Deux barres de chocolat noir de haute qualité, pâte feuilletée aérienne et dorée.', popularity: 88, reviews: '4.7/5 (22 avis clients)' },
    { id: 10, name: 'Cookie Choc-Noix', category: 'patisseries', subCategory: 'cookies', price: 2.00, image: 'https://images.unsplash.com/photo-1563212726-2a781077e232?w=400', description: 'Moelleux à cœur', extraInfo: 'Moelleux à l\'intérieur, légèrement croustillant à l\'extérieur, pépites de chocolat noir.', popularity: 98, reviews: '5/5 (50 avis clients)' },
    { id: 11, name: 'Cheesecake New-Yorkais', category: 'patisseries', subCategory: 'cheesecake', price: 6.00, image: 'https://images.unsplash.com/photo-1587391782245-c335e4d26532?w=400', description: 'Crémée et gourmand', extraInfo: 'Base de biscuits Graham, crème au fromage légère, coulis de fruits rouges en option.', popularity: 90, reviews: '4.9/5 (35 avis clients)' },
    { id: 12, name: 'Tiramisu Classique', category: 'patisseries', subCategory: 'tiramisu', price: 5.80, image: 'https://images.unsplash.com/photo-1571217088901-b58ed323c2a6?w=400', description: 'L\'Italie dans un verre', extraInfo: 'Mascarpone onctueux, biscuits trempés dans l\'espresso et saupoudré de cacao amer.', popularity: 85, reviews: '4.7/5 (28 avis clients)' },
    { id: 13, name: 'Tarte aux Pommes', category: 'patisseries', subCategory: 'tarte', price: 4.50, image: 'https://images.unsplash.com/photo-1541783262923-cf45b56557b7?w=400', description: 'Chaleur et réconfort', extraInfo: 'Fines tranches de pommes sur une pâte feuilletée, une touche de cannelle.', popularity: 82, reviews: '4.6/5 (18 avis clients)' },
    
    // SANDWICHES
    { id: 8, name: 'Club Poulet', category: 'sandwiches', subCategory: 'savoureux', price: 7.90, image: 'https://images.unsplash.com/photo-1596701083281-797384aed209?w=400', description: 'Complet et savoureux', extraInfo: 'Poulet grillé, bacon, tomate, laitue et sauce moutarde au miel. Servi avec frites.', popularity: 80, reviews: '4.4/5 (12 avis clients)' },
    { id: 9, name: 'Végétarien', category: 'sandwiches', subCategory: 'leger', price: 6.50, image: 'https://images.unsplash.com/photo-1521404092497-b08e7c10d32f?w=400', description: 'Frais et léger', extraInfo: 'Légumes de saison, mozzarella, pesto basilic, dans un pain ciabatta. Option saine.', popularity: 78, reviews: '4.2/5 (8 avis clients)' }
];

var cart = []; 
let customerDetails = {}; // Variable pour stocker les coordonnées du client

// --- Fonctions de Rendu et de Filtrage (Inchangées, sauf où indiqué) ---

function renderProducts(productsToRender) {
    // ... (Logique de rendu des produits inchangée) ...
    var productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    productsToRender.forEach(function(product) {
        var card = document.createElement('div');
        card.className = 'product-card ' + product.category + (product.subCategory ? ' ' + product.subCategory : '');
        
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-extra-info">
                    <h3>Détails du Produit</h3>
                    <p class="full-description">${product.extraInfo}</p>
                    <div class="reviews">
                        🌟 ${product.reviews || 'Aucun avis pour l\'instant'}
                    </div>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price.toFixed(2)} €</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        Ajouter
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

function filterProducts(filterValue, parentCategory = null) {
    // ... (Logique de filtrage inchangée) ...
    const subFiltersContainer = document.getElementById('patisserieSubFilters');

    // 1. GESTION DES CLASSES ACTIVES
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.sub-filter-btn').forEach(btn => btn.classList.remove('active-sub'));

    if (filterValue === 'patisseries' || parentCategory === 'patisseries') {
        subFiltersContainer.classList.add('visible');
        
        const patisserieBtn = document.querySelector(`.filter-btn[onclick*="patisseries"]`);
        if(patisserieBtn) patisserieBtn.classList.add('active');

        if (filterValue === 'patisseries') {
            filterValue = 'all-patisseries'; 
        }

        const subBtn = document.querySelector(`.sub-filter-btn[onclick*="${filterValue}"]`);
        if(subBtn) subBtn.classList.add('active-sub');

    } else {
        subFiltersContainer.classList.remove('visible');
        
        const mainBtn = document.querySelector(`.filter-btn[onclick*="${filterValue}"]`);
        if(mainBtn) mainBtn.classList.add('active');
    }

    // 2. LOGIQUE DE FILTRAGE
    let filtered = products;

    if (filterValue === 'all') {
        filtered = products;
    } else if (filterValue === 'all-patisseries') {
        filtered = products.filter(product => product.category === 'patisseries');
    } else if (parentCategory === 'patisseries') {
        filtered = products.filter(product => product.category === 'patisseries' && product.subCategory === filterValue);
    } else {
        filtered = products.filter(product => product.category === filterValue);
    }

    // 3. Réappliquer le tri en cours
    const sortValue = document.getElementById('sortSelect').value;
    sortProducts(sortValue, filtered);
}


function sortProducts(value, productsList = products) {
    // ... (Logique de tri inchangée) ...
    let sortedList = [...productsList];

    switch (value) {
        case 'price-asc':
            sortedList.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedList.sort((a, b) => b.price - a.price);
            break;
        case 'popularity':
            sortedList.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'none':
        default:
            break;
    }

    renderProducts(sortedList);
}


// --- Fonctions de Panier, Commande et Facturation ---

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('open');
    if (cartModal.classList.contains('open')) {
        renderCartItems(); 
    }
}

function updateCartCount() {
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalCount;
}

function calculateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
    return total;
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const invoiceArea = document.getElementById('invoiceArea');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const customerFormArea = document.getElementById('customerFormArea'); 
    
    // 1. Masquer les vues alternatives (Formulaire et Facture)
    invoiceArea.classList.remove('visible');
    customerFormArea.classList.remove('visible'); 
    
    // 2. Afficher la vue standard du panier
    cartItemsContainer.style.display = 'block';
    checkoutBtn.style.display = 'block'; 

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Votre panier est vide</p>';
        calculateCartTotal();
        updateCartCount();
        checkoutBtn.disabled = true;
        return;
    }
    checkoutBtn.disabled = false;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <div>${item.price.toFixed(2)} € x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    calculateCartTotal();
    updateCartCount();
    
    // S'assurer que les données du formulaire sont effacées au retour au panier
    document.getElementById('customerForm').reset(); 
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    // Sauvegarder le panier temporairement AVANT le checkout
    localStorage.setItem('temp_cart_for_invoice', JSON.stringify(cart)); 
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
    
    // Sauvegarder le panier temporairement
    localStorage.setItem('temp_cart_for_invoice', JSON.stringify(cart)); 
    renderCartItems();
}

function checkout() {
    if (cart.length === 0) {
        alert("Votre panier est vide. Veuillez ajouter des articles avant de commander.");
        return;
    }
    
    // 1. Masquer le panier et le bouton de commande
    document.getElementById('cartItems').style.display = 'none';
    document.getElementById('checkoutBtn').style.display = 'none';
    document.getElementById('cartTotal').textContent = calculateCartTotal().toFixed(2);
    
    // 2. Afficher le formulaire de coordonnées
    document.getElementById('customerFormArea').classList.add('visible');
}

function processOrder() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!name || !phone) {
        alert("Veuillez remplir votre nom complet et votre numéro de téléphone.");
        return;
    }

    // 1. Sauvegarder les détails du client
    customerDetails = { name, phone, address };

    // 2. Masquer le formulaire
    document.getElementById('customerFormArea').classList.remove('visible');
    
    // 3. Générer et afficher la facture
    generateInvoice();
    
    // 4. Vider le panier principal et mettre à jour le compteur
    cart = []; 
    updateCartCount();
    
    alert("Commande enregistrée ! Vous pouvez consulter la facture ci-dessous.");
}


function generateInvoice() {
    const invoiceArea = document.getElementById('invoiceArea');
    
    // Récupérer le panier sauvegardé juste avant le checkout
    const itemsToInvoice = JSON.parse(localStorage.getItem('temp_cart_for_invoice') || '[]');
    const customer = customerDetails;

    if (itemsToInvoice.length === 0) {
        invoiceArea.innerHTML = '<p style="padding: 2rem; text-align: center; color: red;">Erreur: Impossible de trouver les articles pour la facture.</p>';
        invoiceArea.classList.add('visible');
        localStorage.removeItem('temp_cart_for_invoice');
        return;
    }
    
    // Recalculer le total final
    const finalTotal = itemsToInvoice.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let invoiceContent = `
        <div class="invoice-details">
            <h4>Confirmation de Commande #${Math.floor(Math.random() * 10000)}</h4>
            <p>Date et Heure: ${new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'medium' })}</p>
            <hr style="margin: 0.75rem 0; border-color: #ddd;">
            
            <h5>Détails du Client:</h5>
            <p><strong>Nom:</strong> ${customer.name}</p>
            <p><strong>Tél:</strong> ${customer.phone}</p>
            ${customer.address ? `<p><strong>Adresse:</strong> ${customer.address}</p>` : ''}

            <hr style="margin: 0.75rem 0; border-color: #ddd;">
            <h5>Détail des Articles :</h5>
            <ul style="padding-left: 0;">
    `;
    
    itemsToInvoice.forEach(item => {
        invoiceContent += `
            <li style="list-style: none; padding: 0.2rem 0; display: flex; justify-content: space-between;">
                <span>${item.name} (x${item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)} €</span>
            </li>
        `;
    });
    

    invoiceContent += `
            </ul>
            <hr style="margin: 0.75rem 0; border-color: var(--secondary-color);">
            <h5 style="text-align: right; color: var(--primary-color);">Total Payé: ${finalTotal.toFixed(2)} €</h5>
            <p style="margin-top: 1rem; text-align: center; font-style: italic;">Merci de votre confiance ! Votre commande est en cours de préparation.</p>
            <button class="checkout-btn" onclick="toggleCart()" style="background: var(--secondary-color); margin-top: 1.5rem;">Fermer la facture</button>
        </div>
    `;

    invoiceArea.innerHTML = invoiceContent;
    invoiceArea.classList.add('visible');
    
    // Nettoyer la sauvegarde temporaire
    localStorage.removeItem('temp_cart_for_invoice');
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    
    const allBtn = document.querySelector('.filter-btn[onclick*="all"]');
    if (allBtn) {
        allBtn.classList.add('active');
    }
    
    const defaultSubFilter = document.querySelector('.sub-filter-btn[onclick*="all-patisseries"]');
    if (defaultSubFilter) {
        defaultSubFilter.classList.add('active-sub');
    }
    
    // Assurez-vous que le panier temporaire est vidé au chargement initial pour éviter les erreurs
    localStorage.removeItem('temp_cart_for_invoice');
});
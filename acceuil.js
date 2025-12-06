
        var cart = [];

        try {
            var stored = localStorage.getItem('cafeCart');
            if (stored) {
                cart = JSON.parse(stored);
            }
        } catch (e) {
            cart = [];
        }

        function updateCart() {
            var cartCount = document.getElementById('cartCount');
            var cartItems = document.getElementById('cartItems');
            var cartTotal = document.getElementById('cartTotal');
            
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
            
            try {
                localStorage.setItem('cafeCart', JSON.stringify(cart));
            } catch (e) {
                console.log('Cannot save to localStorage');
            }
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

        var currentSlide = 0;
        var slides = document.querySelectorAll('.slide');
        
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
        
        setInterval(nextSlide, 4000);

        var anchors = document.querySelectorAll('a[href^="#"]');
        for (var i = 0; i < anchors.length; i++) {
            anchors[i].addEventListener('click', function(e) {
                var targetId = this.getAttribute('href').substring(1);
                var targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        var ctaButton = document.getElementById('ctaButton');
        if (ctaButton) {
            ctaButton.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            ctaButton.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            updateCart();
        });
    
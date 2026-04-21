CREATE DATABASE IF NOT EXISTS coffeeshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE coffeeshop;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    phone VARCHAR(30) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(60) NOT NULL,
    subcategory VARCHAR(60) DEFAULT NULL,
    description VARCHAR(255) NOT NULL,
    extra_info TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    popularity INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contact_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO products (name, category, subcategory, description, extra_info, price, image_path, popularity)
VALUES
('Espresso', 'boissons', 'coffee', 'Café italien authentique', 'Torréfié artisanalement, grains Arabica sélectionnés.', 3.50, 'assets/espresso.png', 95),
('Cappuccino', 'boissons', 'coffee', 'Onctueux et crémeux', 'Mousse de lait veloutée, cannelle légère.', 4.50, 'assets/cappucino.png', 90),
('Latte', 'boissons', 'coffee', 'Doux et parfumé', 'Lait chaud moussé avec espresso.', 5.00, 'assets/latte.png', 85),
('Cookie maison', 'patisseries', 'cookies', 'Moelleux à cœur', 'Pépites fondantes et cuisson du jour.', 4.00, 'assets/cookie.jpg', 98),
('Club Poulet', 'sandwiches', 'savoureux', 'Complet et savoureux', 'Poulet grillé, tomate, laitue.', 8.50, 'assets/clubpoulet.png', 80),
('Cheesecake Biscottino', 'patisseries', 'cheesecake', 'Crémeux et gourmand', 'Recette maison signature.', 6.00, 'assets/cheesecake.jpg', 88),
('hot chocolate', 'boissons', 'special', 'Boisson spéciale maison', 'Recette exclusive de la maison.', 7.00, 'assets/coffee.png', 82);

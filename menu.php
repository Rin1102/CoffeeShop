<?php
require_once __DIR__ . '/inc/config.php';
require_once __DIR__ . '/inc/layout.php';

$user = current_user();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'add_to_cart') {
    if (!$user) {
        set_flash('error', 'Veuillez vous connecter pour ajouter des produits au panier.');
        redirect('login.php');
    }

    $productId = (int) ($_POST['product_id'] ?? 0);

    $check = $pdo->prepare('SELECT id FROM products WHERE id = :id AND is_active = 1');
    $check->execute(['id' => $productId]);

    if ($check->fetch()) {
        $upsert = $pdo->prepare(
            'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (:user_id, :product_id, 1)
             ON DUPLICATE KEY UPDATE quantity = quantity + 1'
        );
        $upsert->execute([
            'user_id' => (int) $user['id'],
            'product_id' => $productId,
        ]);
    }

    redirect('menu.php');
}

$stmt = $pdo->query('SELECT id, name, category, subcategory, description, extra_info, price, image_path, popularity FROM products WHERE is_active = 1 ORDER BY category, popularity DESC');
$products = $stmt->fetchAll();

render_header($pdo, 'Biscottino\'s - Menu', 'menu');
render_flash();
?>
<div class="container" style="margin-top: 110px;">
    <h1 class="page-title">Ce que nous vous proposons</h1>
    <div class="products-grid" id="productsGrid">
        <?php foreach ($products as $product): ?>
            <div class="product-card <?= e($product['category']) ?>" data-category="<?= e($product['category']) ?>" data-price="<?= e((string) $product['price']) ?>" data-popularity="<?= e((string) $product['popularity']) ?>">
                <div class="product-image-wrapper">
                    <img src="<?= e($product['image_path']) ?>" alt="<?= e($product['name']) ?>" class="product-image">
                    <div class="product-extra-info">
                        <h3>Détails du Produit</h3>
                        <p class="full-description"><?= e($product['extra_info']) ?></p>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name"><?= e($product['name']) ?></h3>
                    <p class="product-description"><?= e($product['description']) ?></p>
                    <div class="product-footer">
                        <span class="product-price"><?= e(number_format((float) $product['price'], 2)) ?> DT</span>
                        <?php if ($user): ?>
                            <form method="post" class="inline-form">
                                <input type="hidden" name="action" value="add_to_cart">
                                <input type="hidden" name="product_id" value="<?= e((string) $product['id']) ?>">
                                <button class="add-to-cart" type="submit">Ajouter</button>
                            </form>
                        <?php else: ?>
                            <a class="add-to-cart" href="login.php" style="display:inline-block;text-decoration:none;">Se connecter</a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>
<script src="products.js"></script>
<?php render_footer(); ?>

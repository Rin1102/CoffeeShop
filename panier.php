<?php
require_once __DIR__ . '/inc/config.php';
require_once __DIR__ . '/inc/layout.php';
require_auth();

$user = current_user();
$userId = (int) $user['id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $productId = (int) ($_POST['product_id'] ?? 0);

    if ($action === 'inc') {
        $stmt = $pdo->prepare('UPDATE cart_items SET quantity = quantity + 1 WHERE user_id = :user_id AND product_id = :product_id');
        $stmt->execute(['user_id' => $userId, 'product_id' => $productId]);
    }

    if ($action === 'dec') {
        $stmt = $pdo->prepare('UPDATE cart_items SET quantity = quantity - 1 WHERE user_id = :user_id AND product_id = :product_id');
        $stmt->execute(['user_id' => $userId, 'product_id' => $productId]);
        $pdo->prepare('DELETE FROM cart_items WHERE user_id = :user_id AND product_id = :product_id AND quantity <= 0')
            ->execute(['user_id' => $userId, 'product_id' => $productId]);
    }

    if ($action === 'remove') {
        $stmt = $pdo->prepare('DELETE FROM cart_items WHERE user_id = :user_id AND product_id = :product_id');
        $stmt->execute(['user_id' => $userId, 'product_id' => $productId]);
    }

    if ($action === 'checkout') {
        $pdo->beginTransaction();
        try {
            $itemsStmt = $pdo->prepare('SELECT ci.product_id, ci.quantity, p.price FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = :user_id');
            $itemsStmt->execute(['user_id' => $userId]);
            $items = $itemsStmt->fetchAll();

            if (!$items) {
                throw new RuntimeException('Panier vide.');
            }

            $total = 0;
            foreach ($items as $item) {
                $total += ((float) $item['price']) * ((int) $item['quantity']);
            }

            $orderStmt = $pdo->prepare('INSERT INTO orders (user_id, total_amount) VALUES (:user_id, :total_amount)');
            $orderStmt->execute(['user_id' => $userId, 'total_amount' => $total]);
            $orderId = (int) $pdo->lastInsertId();

            $detailStmt = $pdo->prepare('INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (:order_id, :product_id, :quantity, :unit_price)');
            foreach ($items as $item) {
                $detailStmt->execute([
                    'order_id' => $orderId,
                    'product_id' => (int) $item['product_id'],
                    'quantity' => (int) $item['quantity'],
                    'unit_price' => (float) $item['price'],
                ]);
            }

            $pdo->prepare('DELETE FROM cart_items WHERE user_id = :user_id')->execute(['user_id' => $userId]);
            $pdo->commit();
            set_flash('success', 'Commande confirmée avec succès.');
        } catch (Throwable $e) {
            $pdo->rollBack();
            set_flash('error', 'Erreur checkout: ' . $e->getMessage());
        }
    }

    redirect('panier.php');
}

$stmt = $pdo->prepare(
    'SELECT p.id, p.name, p.image_path, p.price, ci.quantity
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = :user_id
     ORDER BY p.name'
);
$stmt->execute(['user_id' => $userId]);
$items = $stmt->fetchAll();

$total = 0;
foreach ($items as $item) {
    $total += ((float) $item['price']) * ((int) $item['quantity']);
}

render_header($pdo, 'Panier - Biscottino\'s', 'panier');
render_flash();
?>
<div class="auth-container panier-container auth-center">
    <h1 class="panier-title">Votre panier</h1>

    <?php if (!$items): ?>
        <p>Votre panier est vide.</p>
        <p><a href="menu.php">Ajouter des produits</a></p>
    <?php else: ?>
        <table class="table">
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>Quantité</th>
                    <th>Sous-total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($items as $item): ?>
                    <tr>
                        <td>
                            <img src="<?= e($item['image_path']) ?>" alt="<?= e($item['name']) ?>" class="product-thumb">
                            <?= e($item['name']) ?>
                        </td>
                        <td><?= e(number_format((float) $item['price'], 2)) ?> DT</td>
                        <td>
                            <form method="post" class="inline-form">
                                <input type="hidden" name="action" value="dec">
                                <input type="hidden" name="product_id" value="<?= e((string) $item['id']) ?>">
                                <button class="cart-btn cart-btn-qty" type="submit">−</button>
                            </form>
                            <span class="qty-value"><?= e((string) $item['quantity']) ?></span>
                            <form method="post" class="inline-form">
                                <input type="hidden" name="action" value="inc">
                                <input type="hidden" name="product_id" value="<?= e((string) $item['id']) ?>">
                                <button class="cart-btn cart-btn-qty" type="submit">+</button>
                            </form>
                        </td>
                        <td><?= e(number_format(((float) $item['price']) * ((int) $item['quantity']), 2)) ?> DT</td>
                        <td>
                            <form method="post" class="inline-form">
                                <input type="hidden" name="action" value="remove">
                                <input type="hidden" name="product_id" value="<?= e((string) $item['id']) ?>">
                                <button class="cart-btn cart-btn-remove" type="submit">Supprimer</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <h3>Total : <?= e(number_format($total, 2)) ?> DT</h3>
        <form method="post" class="checkout-wrap">
            <input type="hidden" name="action" value="checkout">
            <button class="auth-btn" type="submit">Valider la commande</button>
        </form>
    <?php endif; ?>
</div>
<?php render_footer(); ?>

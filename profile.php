<?php
require_once __DIR__ . '/inc/bootstrap.php';
require_once __DIR__ . '/inc/layout.php';
require_auth();

$user = current_user();
$userId = (int) $user['id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'update_profile') {
        $fullName = trim($_POST['full_name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $address = trim($_POST['address'] ?? '');

        if ($fullName === '') {
            set_flash('error', 'Le nom complet est obligatoire.');
            redirect('profile.php');
        }

        $stmt = $pdo->prepare('UPDATE users SET full_name = :full_name, phone = :phone, address = :address WHERE id = :id');
        $stmt->execute([
            'full_name' => $fullName,
            'phone' => $phone ?: null,
            'address' => $address ?: null,
            'id' => $userId,
        ]);

        refresh_session_user($pdo, $userId);
        set_flash('success', 'Profil mis à jour.');
        redirect('profile.php');
    }

    if ($action === 'update_password') {
        $currentPassword = $_POST['current_password'] ?? '';
        $newPassword = $_POST['new_password'] ?? '';
        $confirmNewPassword = $_POST['confirm_new_password'] ?? '';

        $stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = :id');
        $stmt->execute(['id' => $userId]);
        $hash = (string) $stmt->fetchColumn();

        if (!password_verify($currentPassword, $hash)) {
            set_flash('error', 'Mot de passe actuel incorrect.');
            redirect('profile.php');
        }

        if (strlen($newPassword) < 6) {
            set_flash('error', 'Le nouveau mot de passe doit faire au moins 6 caractères.');
            redirect('profile.php');
        }

        if ($newPassword !== $confirmNewPassword) {
            set_flash('error', 'La confirmation du nouveau mot de passe ne correspond pas.');
            redirect('profile.php');
        }

        $up = $pdo->prepare('UPDATE users SET password_hash = :password_hash WHERE id = :id');
        $up->execute([
            'password_hash' => password_hash($newPassword, PASSWORD_DEFAULT),
            'id' => $userId,
        ]);

        set_flash('success', 'Mot de passe mis à jour.');
        redirect('profile.php');
    }

    if ($action === 'delete_account') {
        $stmt = $pdo->prepare('DELETE FROM users WHERE id = :id');
        $stmt->execute(['id' => $userId]);

        $_SESSION = [];
        session_destroy();

        session_start();
        set_flash('success', 'Compte supprimé avec succès.');
        redirect('register.php');
    }
}

refresh_session_user($pdo, $userId);
$user = current_user();

$ordersStmt = $pdo->prepare('SELECT id, total_amount, status, created_at FROM orders WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 10');
$ordersStmt->execute(['user_id' => $userId]);
$orders = $ordersStmt->fetchAll();

render_header($pdo, 'Mon Profil - Biscottino\'s', 'profile');
render_flash();
?>
<div class="auth-container" style="max-width: 920px;">
    <h1>Mon profil</h1>

    <div class="profile-grid">
        <div>
            <h3>Informations</h3>
            <form method="post" class="auth-form">
                <input type="hidden" name="action" value="update_profile">
                <div class="form-group">
                    <label>Nom complet</label>
                    <input type="text" name="full_name" value="<?= e($user['full_name']) ?>" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="<?= e($user['email']) ?>" disabled>
                </div>
                <div class="form-group">
                    <label>Téléphone</label>
                    <input type="text" name="phone" value="<?= e($user['phone']) ?>">
                </div>
                <div class="form-group">
                    <label>Adresse</label>
                    <input type="text" name="address" value="<?= e($user['address']) ?>">
                </div>
                <button class="auth-btn" type="submit">Mettre à jour</button>
            </form>
        </div>

        <div>
            <h3>Sécurité</h3>
            <form method="post" class="auth-form">
                <input type="hidden" name="action" value="update_password">
                <div class="form-group">
                    <label>Mot de passe actuel</label>
                    <input type="password" name="current_password" required>
                </div>
                <div class="form-group">
                    <label>Nouveau mot de passe</label>
                    <input type="password" name="new_password" required>
                </div>
                <div class="form-group">
                    <label>Confirmer le nouveau mot de passe</label>
                    <input type="password" name="confirm_new_password" required>
                </div>
                <button class="auth-btn" type="submit">Changer mot de passe</button>
            </form>

            <hr style="margin: 1.2rem 0;">
            <form method="post" onsubmit="return confirm('Supprimer définitivement votre compte ?');">
                <input type="hidden" name="action" value="delete_account">
                <button type="submit" style="background:#b63636;color:#fff;border:none;padding:0.7rem 1rem;border-radius:8px;cursor:pointer;">Supprimer mon compte</button>
            </form>
        </div>
    </div>

    <h3 style="margin-top: 2rem;">Historique des commandes</h3>
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            <?php if (!$orders): ?>
                <tr><td colspan="4">Aucune commande pour le moment.</td></tr>
            <?php else: ?>
                <?php foreach ($orders as $order): ?>
                    <tr>
                        <td><?= e((string) $order['id']) ?></td>
                        <td><?= e(number_format((float) $order['total_amount'], 2)) ?> DT</td>
                        <td><?= e($order['status']) ?></td>
                        <td><?= e($order['created_at']) ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>
<?php render_footer(); ?>

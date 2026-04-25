<?php
require_once __DIR__ . '/inc/config.php';
require_once __DIR__ . '/inc/layout.php';

$user = current_user();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$user) {
        set_flash('error', 'Veuillez vous connecter pour envoyer un message.');
        redirect('login.php');
    }

    $name = trim($_POST['full_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if ($name === '' || $email === '' || $message === '') {
        set_flash('error', 'Tous les champs sont obligatoires.');
        redirect('contact.php');
    }

    $stmt = $pdo->prepare('INSERT INTO contact_messages (user_id, full_name, email, message) VALUES (:user_id, :full_name, :email, :message)');
    $stmt->execute([
        'user_id' => (int) $user['id'],
        'full_name' => $name,
        'email' => $email,
        'message' => $message,
    ]);

    set_flash('success', 'Message envoyé avec succès.');
    redirect('contact.php');
}

render_header($pdo, 'Contact - Biscottino\'s', 'contact');
render_flash();
?>
<div class="container" style="margin-top: 110px;">
    <h1 class="page-title">Contactez-nous</h1>
    <div class="contact-wrapper">
        <div class="contact-form-section">
            <h2>Envoyez-nous un message</h2>
            <?php if ($user): ?>
                <form method="post" class="auth-form">
                    <div class="form-group">
                        <label>Nom complet *</label>
                        <input type="text" name="full_name" value="<?= e($user['full_name']) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" value="<?= e($user['email']) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Message *</label>
                        <textarea name="message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="auth-btn">Envoyer le message</button>
                </form>
            <?php else: ?>
                <p style="margin-bottom: 1rem;">Vous pouvez consulter cette page librement. Pour envoyer un message, veuillez vous connecter.</p>
                <a href="login.php" class="auth-btn" style="display:inline-block;text-decoration:none;">Se connecter</a>
            <?php endif; ?>
        </div>

        <div class="map-section">
            <h2>Où nous trouver</h2>
            <div class="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.0527678258536!2d10.808026276401781!3d35.77408012486698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13026d4db7f7fedb%3A0xb491af87ab042d5f!2sBiscottino&#39;s!5e0!3m2!1sfr!2stn!4v1765118418723!5m2!1sfr!2stn"
                    width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    </div>
</div>
<?php render_footer(); ?>

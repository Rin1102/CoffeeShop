<?php
require_once __DIR__ . '/inc/config.php';
require_once __DIR__ . '/inc/layout.php';

if (is_logged_in()) {
    redirect('acceuil.php');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare('SELECT id, full_name, email, phone, address, password_hash FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        unset($user['password_hash']);
        $_SESSION['user'] = $user;
        set_flash('success', 'Connexion réussie. Bienvenue !');
        redirect('acceuil.php');
    }

    set_flash('error', 'Email ou mot de passe invalide.');
    redirect('login.php');
}

render_header($pdo, 'Login - Biscottino\'s', 'login');
render_flash();
?>
<div class="auth-container auth-center">
    <h1>Connexion</h1>
    <form method="post" class="auth-form">
        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" required>
        </div>
        <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" name="password" required>
        </div>
        <button class="auth-btn" type="submit">Se connecter</button>
    </form>
    <p class="auth-links">Pas encore de compte ? <a href="register.php">Inscription</a></p>
</div>
<?php render_footer(); ?>

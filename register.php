<?php
require_once __DIR__ . '/inc/config.php';
require_once __DIR__ . '/inc/layout.php';

if (is_logged_in()) {
    redirect('acceuil.php');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = trim($_POST['full_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');

    if ($fullName === '' || $email === '' || strlen($password) < 6) {
        set_flash('error', 'Veuillez remplir correctement le formulaire (mot de passe min 6 caractères).');
        redirect('register.php');
    }

    if ($password !== $confirmPassword) {
        set_flash('error', 'La confirmation du mot de passe ne correspond pas.');
        redirect('register.php');
    }

    $check = $pdo->prepare('SELECT id FROM users WHERE email = :email');
    $check->execute(['email' => $email]);

    if ($check->fetch()) {
        set_flash('error', 'Cet email existe déjà.');
        redirect('register.php');
    }

    $stmt = $pdo->prepare('INSERT INTO users (full_name, email, phone, address, password_hash) VALUES (:full_name, :email, :phone, :address, :password_hash)');
    $stmt->execute([
        'full_name' => $fullName,
        'email' => $email,
        'phone' => $phone ?: null,
        'address' => $address ?: null,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);

    set_flash('success', 'Inscription réussie. Connectez-vous maintenant.');
    redirect('login.php');
}

render_header($pdo, 'Inscription - Biscottino\'s', 'register');
render_flash();
?>
<div class="auth-container auth-center">
    <h1>Inscription</h1>
    <form method="post" class="auth-form">
        <div class="form-group">
            <label>Nom complet</label>
            <input type="text" name="full_name" required>
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" required>
        </div>
        <div class="profile-grid">
            <div class="form-group">
                <label>Téléphone</label>
                <input type="text" name="phone">
            </div>
            <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" name="password" required>
            </div>
        </div>
        <div class="form-group">
            <label>Confirmer le mot de passe</label>
            <input type="password" name="confirm_password" required>
        </div>
        <div class="form-group">
            <label>Adresse</label>
            <input type="text" name="address">
        </div>
        <button class="auth-btn" type="submit">Créer mon compte</button>
    </form>
    <p class="auth-links">Vous avez déjà un compte ? <a href="login.php">Se connecter</a></p>
</div>
<?php render_footer(); ?>

<?php

declare(strict_types=1);

require_once __DIR__ . '/helpers.php';

function render_header(PDO $pdo, string $title, string $activePage = ''): void
{
    $user = current_user();
    $count = 0;

    if ($user) {
        $count = cart_count($pdo, (int) $user['id']);
    }

    ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($title) ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="acceuil.css">
    <?php if ($activePage === 'menu'): ?>
        <link rel="stylesheet" href="menu.css">
    <?php endif; ?>
    <?php if ($activePage === 'contact'): ?>
        <link rel="stylesheet" href="contact.css">
    <?php endif; ?>
    <link rel="stylesheet" href="auth.css">
</head>
<body>
<header>
    <div class="header-content">
        <a href="acceuil.php" class="logo">
            <img src="assets/logo.png" alt="Biscottino's Logo">
            <span>Biscottino's</span>
        </a>

        <button class="menu-toggle" onclick="toggleMenu()" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>

        <nav id="mainNav">
            <ul>
                <li><a href="acceuil.php" class="<?= $activePage === 'acceuil' ? 'active' : '' ?>">Accueil</a></li>
                <li><a href="menu.php" class="<?= $activePage === 'menu' ? 'active' : '' ?>">Menu</a></li>
                <li><a href="contact.php" class="<?= $activePage === 'contact' ? 'active' : '' ?>">Contact</a></li>
                <?php if ($user): ?>
                    <li><a href="profile.php" class="<?= $activePage === 'profile' ? 'active' : '' ?>">Profil</a></li>
                    <li><a href="logout.php">Logout</a></li>
                <?php else: ?>
                    <li><a href="login.php" class="<?= $activePage === 'login' ? 'active' : '' ?>">Login</a></li>
                    <li><a href="register.php" class="<?= $activePage === 'register' ? 'active' : '' ?>">Inscription</a></li>
                <?php endif; ?>
            </ul>
        </nav>

        <?php if ($user): ?>
            <a href="panier.php" class="panier-nav-link header-panier-link <?= $activePage === 'panier' ? 'active' : '' ?>" aria-label="Panier (<?= $count ?>)">
                <img src="assets/panier.png" alt="Panier" class="panier-nav-icon">
                <span class="panier-nav-count"><?= $count ?></span>
            </a>
        <?php endif; ?>
    </div>
</header>
<main class="page-main">
<?php
}

function render_flash(): void
{
    $flash = get_flash();

    if (!$flash) {
        return;
    }

    $class = $flash['type'] === 'success' ? 'flash-success' : 'flash-error';
    echo '<div class="flash-message ' . e($class) . '">' . e($flash['message']) . '</div>';
}

function render_footer(): void
{
    ?>
</main>
<footer>
    <div class="footer-content">
        <div class="footer-section">
            <h3>Biscottino's</h3>
            <p>Votre café de quartier préféré au cœur de Monastir</p>
            <p>Ouvert tous les jours pour vous servir</p>
        </div>
        <div class="footer-section">
            <h3>Contact</h3>
            <p>📍 Monastir, Tunisie</p>
            <p>📞 +216 71 123 456</p>
            <p>✉️ contact@biscottinos.tn</p>
        </div>
        <div class="footer-section">
            <h3>Horaires</h3>
            <p>Lundi - Vendredi: 7h - 20h</p>
            <p>Samedi - Dimanche: 8h - 22h</p>
            <div class="social-links">
                <a href="https://www.facebook.com/biscottinos/?locale=fr_FR" title="Facebook" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/biscottino_s/?hl=fr" title="Instagram" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" stroke-width="2"/>
                        <circle cx="17.5" cy="6.5" r="1.5"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2026 Biscottino's. Tous droits réservés.</p>
    </div>
</footer>
<script src="common.js"></script>
</body>
</html>
<?php
}

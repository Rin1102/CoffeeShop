<?php
require_once __DIR__ . '/inc/config.php';
require_once __DIR__ . '/inc/layout.php';

$user = current_user();

render_header($pdo, 'Biscottino\'s - Accueil', 'acceuil');
render_flash();
?>
<div class="hero-banner">
    <div class="slide active">
        <img src="assets/slide1.jpg" alt="Café intérieur">
        <div class="slide-overlay">
            <div class="slide-content">
                <h1 class="slide-text">Venez savourer un moment de tranquillité</h1>
                <p class="slide-subtitle">C'est là où vos plaisirs sont servis</p>
            </div>
        </div>
    </div>
    <div class="slide">
        <img src="assets/cosy.png" alt="Café ambiance">
        <div class="slide-overlay">
            <div class="slide-content">
                <h1 class="slide-text">Un café où chaque instant compte</h1>
                <p class="slide-subtitle">Votre refuge urbain au cœur de Monastir</p>
            </div>
        </div>
    </div>
    <div class="slide">
        <img src="assets/overview.png" alt="Café terrasse">
        <div class="slide-overlay">
            <div class="slide-content">
                <h1 class="slide-text">Détendez-vous dans notre espace cosy</h1>
                <p class="slide-subtitle">L'endroit parfait pour se retrouver</p>
            </div>
        </div>
    </div>

    <div class="banner-controls">
        <button class="banner-btn prev" onclick="changeSlide(-1)" aria-label="Previous slide">‹</button>
        <button class="banner-btn next" onclick="changeSlide(1)" aria-label="Next slide">›</button>
    </div>

    <div class="slide-indicators">
        <span class="indicator active" onclick="goToSlide(0)"></span>
        <span class="indicator" onclick="goToSlide(1)"></span>
        <span class="indicator" onclick="goToSlide(2)"></span>
    </div>
</div>

<div class="container">
    <section class="presentation" id="presentation">
        <div class="presentation-text">
            <h2>Le spot parfait pour se retrouver, échanger et se faire plaisir!</h2>
            <?php if ($user): ?>
                <p>Bienvenue <strong><?= e($user['full_name']) ?></strong>, explorez notre carte, gérez votre panier et votre profil en session sécurisée.</p>
            <?php else: ?>
                <p>Bienvenue chez Biscottino's. Vous pouvez consulter le site librement. Pour ajouter au panier ou envoyer un message, veuillez vous connecter.</p>
            <?php endif; ?>
            <p>Nos produits sont maintenant liés à la base de données, avec images locales depuis le dossier assets.</p>
        </div>
        <div class="presentation-image">
            <img src="assets/overview.png" alt="Intérieur du café">
            <div class="image-decoration"></div>
        </div>
    </section>

    <section class="values" id="values">
        <h2>Nos Valeurs</h2>
        <p class="values-subtitle">Ce qui fait de Biscottino's un lieu unique</p>
        <div class="values-grid">
            <div class="value-item">
                <div class="value-icon-wrapper">
                    <svg class="value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <h3>Produits Locaux</h3>
                <p>Nous privilégions les circuits courts et travaillons avec des producteurs de la région pour vous garantir fraîcheur et qualité.</p>
                <div class="value-badge">100% Local</div>
            </div>
            <div class="value-item">
                <div class="value-icon-wrapper">
                    <svg class="value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
                <h3>Service Amical</h3>
                <p>Notre équipe passionnée est à votre écoute pour vous offrir une expérience personnalisée et chaleureuse.</p>
                <div class="value-badge">À votre écoute</div>
            </div>
            <div class="value-item">
                <div class="value-icon-wrapper">
                    <svg class="value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                </div>
                <h3>Ambiance Conviviale</h3>
                <p>Un espace confortable et accueillant où vous vous sentirez comme chez vous, parfait pour travailler ou se détendre.</p>
                <div class="value-badge">Chez vous</div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <h2>Explorez Notre Sélection</h2>
        <p>Découvrez notre gamme de boissons et pâtisseries</p>
        <a href="menu.php" class="cta-button">Voir le menu</a>
    </section>
</div>
<script src="home.js"></script>
<?php render_footer(); ?>

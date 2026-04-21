<?php

declare(strict_types=1);

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function redirect(string $path): never
{
    header('Location: ' . $path);
    exit;
}

function set_flash(string $type, string $message): void
{
    $_SESSION['flash'] = [
        'type' => $type,
        'message' => $message,
    ];
}

function get_flash(): ?array
{
    if (!isset($_SESSION['flash'])) {
        return null;
    }

    $flash = $_SESSION['flash'];
    unset($_SESSION['flash']);

    return $flash;
}

function current_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

function is_logged_in(): bool
{
    return isset($_SESSION['user']);
}

function require_auth(): void
{
    if (!is_logged_in()) {
        set_flash('error', 'Veuillez vous connecter pour continuer.');
        redirect('login.php');
    }
}

function refresh_session_user(PDO $pdo, int $userId): void
{
    $stmt = $pdo->prepare('SELECT id, full_name, email, phone, address FROM users WHERE id = :id');
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch();

    if ($user) {
        $_SESSION['user'] = $user;
    }
}

function cart_count(PDO $pdo, int $userId): int
{
    $stmt = $pdo->prepare('SELECT COALESCE(SUM(quantity), 0) AS total_count FROM cart_items WHERE user_id = :user_id');
    $stmt->execute(['user_id' => $userId]);

    return (int) $stmt->fetchColumn();
}

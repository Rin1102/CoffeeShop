# CoffeeShop (PHP + MySQL)

Projet converti en application dynamique avec sessions + base de données.

## Fonctionnalités ajoutées

- Login / inscription
- Session utilisateur sur toutes les pages principales
- Profil utilisateur (update infos + mot de passe + suppression compte)
- Menu dynamique depuis la base
- Panier dynamique (CRUD)
- Checkout vers commandes
- Formulaire contact enregistré en base
- Images servies depuis assets (stockées en `image_path` en base)

## Pages

- [index.php](index.php)
- [login.php](login.php)
- [register.php](register.php)
- [acceuil.php](acceuil.php)
- [menu.php](menu.php)
- [panier.php](panier.php)
- [contact.php](contact.php)
- [profile.php](profile.php)

## Installation rapide

1. Créer la base + tables:
	- importer [db_schema.sql](db_schema.sql)
2. Vérifier la connexion DB dans [inc/bootstrap.php](inc/bootstrap.php)
3. Ouvrir dans navigateur:
	- `http://localhost/coffeeshop/index.php`

## Notes

- Les anciens fichiers HTML/JS statiques restent dans le repo pour référence visuelle, mais les nouvelles pages à utiliser sont en PHP.

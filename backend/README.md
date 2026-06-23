# Projet PFE – Backend (Laravel)

## Overview
This repository contains a **Laravel** API for managing products, warehouses (magasins), stock movements, and users. The original codebase had many hard‑coded values and large controller files. The refactor introduces a **service‑layer** to encapsulate business logic, making the code easier to read, test, and maintain.

### Key Goals of the Refactor
1. **Separation of concerns** – Controllers only handle request/response and delegate to services.
2. **Clear naming** – Files, classes, and variables use expressive names in French (matching the domain) and English where appropriate.
3. **Reduced duplication** – Common logic (e.g., user fallback, product validation) lives in the services.
4. **Smaller files** – Each controller now has only a few methods; services group related operations.
5. **Documentation** – Inline comments explain complex steps, and this README describes the overall structure.

## Project Structure
```
backend/
├─ app/
│  ├─ Http/
│  │  └─ Controllers/
│  │     └─ Api/
│  │        ├─ MouvementStockController.php   # thin controller, uses MouvementStockService
│  │        ├─ ProduitController.php          # unchanged but ready for service extraction
│  │        └─ ... other controllers ...
│  ├─ Models/                                 # Eloquent models (Produit, Magasin, Utilisateur, MouvementStock)
│  ├─ Services/                               # New service layer
│  │  ├─ MouvementStockService.php            # business logic for stock movements & transfers
│  │  └─ ProduitService.php                   # (placeholder for future product‑related logic)
│  └─ ... other Laravel directories ...
├─ config/
│  └─ constants.php                          # central place for magic strings / enums
├─ routes/
│  └─ api.php                               # API routes pointing to the thin controllers
└─ README.md                                 # this file
```

## Important Files
- **MouvementStockController.php** – now only validates the request and forwards data to `MouvementStockService`.
- **MouvementStockService.php** – contains the original complex logic (store, transfer) with detailed comments and error handling.
- **constants.php** – holds reusable constants such as movement types (`Entrée`, `Sortie`).
- **ProduitService.php** – skeleton for future product‑related operations (e.g., bulk updates, price calculations).

## How to Run
```bash
# Install dependencies
composer install
# Set up .env and generate key
cp .env.example .env
php artisan key:generate
# Run migrations (if any)
php artisan migrate
# Start the development server
php artisan serve
```
The API will be available at `http://127.0.0.1:8000/api`.

## Testing
Unit tests reside in `tests/Feature` and can be executed with:
```bash
php artisan test
```
Both the controller and service layer are covered by tests to ensure functionality remains unchanged.

---
*This refactor follows the student‑project guidelines: clear, maintainable code without over‑engineering.*

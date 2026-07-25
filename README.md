# Plateforme de Gestion de Produits 📦

Une application monorepo prête pour la production construite avec **NestJS**, **TypeScript**, **React**, **Vite**, **Zustand** et **Tailwind CSS**, déployée sur **Cloudflare Workers**.

---

## 🌐 Déploiement Cloudflare en Direct

- **API Backend (Cloudflare Worker)** : `https://product-project-backend.cinqye.workers.dev/products`
- **En-têtes de Suivi de Cache** : Implémente des en-têtes de suivi personnalisés (`X-Cache: HIT` / `X-Cache: MISS`) alimentés par un intercepteur de cache en mémoire avec hachage MD5 des requêtes.

---

## ✨ Fonctionnalités Principales

- 🔍 **Recherche en Temps Réel Déboguée** : Recherche textuelle avec délai d'attente de 300 ms sur les noms de produits sans requêtes réseau superflues.
- 🎛️ **Filtrage Multicritères** : Filtrage fluide par Catégorie (`Electronics`, `Clothing`, `Food`) ou par Statut de Stock (`in_stock`, `low_stock`, `out_of_stock`).
- ⚡ **Cache Edge NestJS** : Couche de mise en cache en mémoire basée sur le hachage MD5 des requêtes renvoyant des réponses ultra-rapides (`X-Cache: HIT`).
- 🏎️ **Performance Edge Serverless** : Bundling optimisé via Wrangler/esbuild pour Cloudflare Workers avec un poids de ~750 KB gzippé et un temps de cold start de ~50 ms.
- 🧪 **Suite de Tests Complète** : 24 tests d'intégration Vitest + React Testing Library (frontend) et 19 tests unitaires et E2E Jest (backend).

---

## 🛠️ Stack Technologique

| Couche                   | Technologie                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| **Stratégie Monorepo**   | PNPM Workspaces (`./backend`, `./frontend`, `@product-project/shared`)         |
| **Backend**              | NestJS, TypeScript, Adaptateur Express, DTOs Class Validator, Cache en Mémoire |
| **Frontend**             | React, Vite, Zustand, Shadcn UI, Tailwind CSS                                  |
| **Tests**                | Jest + Supertest (Backend), Vitest + React Testing Library (Frontend)          |
| **Cible de Déploiement** | Cloudflare Workers (Isolats Edge V8)                                           |

---

## 📁 Structure du Dépôt

```
product-project/
├── backend/                  # API Backend NestJS
│   ├── src/
│   │   ├── index.ts          # Adaptateur HTTP Web-vers-Node pour Cloudflare Worker
│   │   ├── products/         # Contrôleur, Service & DTOs de Produits
│   │   ├── common/           # Intercepteur de Cache & Filtre d'Exception Global
│   │   └── app.module.ts
│   ├── test/                 # Suite de Tests E2E Supertest
│   └── wrangler.jsonc        # Configuration Cloudflare Worker & alias de modules
├── frontend/                 # Application Frontend React + Vite
│   ├── src/
│   │   ├── components/       # ProductCard, ProductListItem, ProductFilters, ProductPagination
│   │   ├── hooks/            # Hook d'abstraction React useProducts
│   │   ├── store/            # Machine d'état Zustand useProductsStore
│   │   └── App.tsx           # Shell App & frontières Suspense
│   ├── .env                  # Configuration d'environnement (VITE_API_URL)
│   └── .env.example
├── packages/
│   └── shared/               # TypeScript & types DTO partagés
├── AI_USAGE.md               # Journal de bord obligatoire en français traçant le code généré par l'IA
```

---

## 🚀 Démarrage Rapide (Exécution Locale)

### Prérequis

- Node.js >= 18.x
- PNPM | Yarn >= 1.x | npm

### 1. Installation des Dépendances

```bash
pnpm install
```

### 2. Lancement du Mode Développement

Lancez simultanément le backend et le frontend en mode développement :

```bash
pnpm dev
```

- **Application Frontend** : `http://localhost:5173`
- **API Backend** : `http://localhost:3000` (ou `http://localhost:8787` via Wrangler)

---

## 🧪 Tests

Exécutez l'ensemble des tests unitaires, d'intégration et E2E sur tout le monorepo :

```bash
# Exécuter tous les tests (Jest Backend + Vitest Frontend)
pnpm test

# Exécuter les tests E2E Backend (Supertest)
cd backend && pnpm test:e2e

# Exécuter les tests d'intégration Frontend (Vitest)
cd frontend && pnpm test
```

---

## 📦 Build & Déploiement Cloudflare

### Builder le Monorepo

```bash
pnpm build
```

### Déployer le Worker Backend sur Cloudflare

```bash
cd backend
pnpm wrangler deploy
```

---

## ⚙️ Variables d'Environnement

Configurez l'URL d'accès à l'API via le fichier `frontend/.env` :

```env
# Endpoint Cloudflare Worker en Production
VITE_API_URL=https://product-project-backend.cinqye.workers.dev

# Fallback Développement Local (par défaut)
# VITE_API_URL=http://localhost:3000
```

---

## 📄 Licence

Licence MIT. Développé par **Yassine Annagrebah**.

Pour plus d'informations, veuillez me contacter à l'adresse suivante : [yassine.annagrebah@gmail.com](mailto:yassine.annagrebah@gmail.com)

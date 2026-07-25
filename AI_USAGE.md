## Ce que vous avez demandé à Claude

- Quelles tâches avez-vous déléguées à Claude ?
  * **Structure initiale du module Products** : Génération automatisée du module NestJS `ProductsModule`, du contrôleur `ProductsController`, et du service `ProductsService`.
  * **Modèle de données et mock (`PRODUCTS_SEED`)** : Création et enrichissement du tableau de démonstration en mémoire contenant 25 produits complets.
  * **Validation DTO (`GetProductsDto`)** : Définition de la classe DTO avec l'intégration des règles de validation de `class-validator` et `class-transformer`.
  * **Intégration du système de cache NestJS** : Configuration initiale du module de gestion de cache officiel de NestJS (`@nestjs/cache-manager`).
  * **Filtre d'exception global (`GlobalExceptionFilter`)** : Implémentation du formateur générique pour standardiser les réponses d'erreurs au format JSON.
  * **Moteur d'état réactif et Hook d'abstraction** : Génération du store Zustand centralisé et typé (`useProductsStore.ts`) associé à son hook d'encapsulation de logique asynchrone (`useProducts.ts`).
  * **Suites de tests automatisées** : Écriture de la couverture de tests E2E/Unitaires côté Backend avec Supertest, et des tests d'intégration visuels et comportementaux côté Frontend avec Vitest et React Testing Library dans un environnement `jsdom`.
  * **Gestion des variables d'environnement Vite** : Configuration du support pour `VITE_API_URL` avec gestion automatisée des fallbacks locaux et nettoyage des barres obliques finales (trailing slashes).
  * **Workflow CI GitHub Actions** : Rédaction du fichier `.github/workflows/ci.yml` pour automatiser la pipeline d'intégration continue des deux applications en parallèle.
  * **Script de lancement simultané** : Écriture de `start.sh` et de la configuration du fichier `package.json` racine pour piloter le monorepo.

- Quels problèmes avez-vous cherché à résoudre ?
  * **Compatibilité Serverless Edge (Cloudflare Workers)** : Adapter une architecture NestJS/Express classique pour qu'elle s'exécute sans erreur au sein de l'environnement isolé V8 de Cloudflare Workers, qui est dépourvu de certaines fonctionnalités Node.js natives.
  * **Pilonnage de l'API (Request Throttling)** : Éviter l'envoi massif et immédiat de requêtes HTTP vers le serveur à chaque fois que l'utilisateur saisit un caractère dans la barre de recherche textuelle en utilisant un debounce pour réduire le nombre de requêtes envoyées.
  * **Instabilité des références de rendu React** : Solutionner les re-rendus inutiles et lourds de l'arbre de composants causés par le remplacement systématique de la référence du tableau de données Zustand lors de la réception de payloads identiques.

## Comment vous avez utilisé les suggestions de Claude

- Qu'avez-vous adopté directement ?
  * **Squelettes de contrôleurs et services NestJS** : La répartition logique initiale pour l'endpoint unique `GET /products` a été conservée telle quelle.
  * **Dictionnaires de correspondance UI** : L'utilisation de dictionnaires statiques (`CATEGORY_LABELS`, `STOCK_STATUS_LABELS`, `LIMIT_LABELS`) pour formater les valeurs brutes dans les composants select dans le frontend.
  * **Découpage de code asynchrone (Code Splitting)** : L'implémentation native de `React.lazy` et des balises `<Suspense>` pour isoler et charger dynamiquement les blocs lourds de l'interface utilisateur.
  * **Structure de validation DTO** : L'utilisation directe des décorateurs de type primitif pour valider et transformer la pagination (`page`, `limit`).

- Qu'avez-vous adapté ou modifié ?
  * **Pont d'adaptation HTTP pour Cloudflare Workers** : Modification profonde du fichier `backend/src/index.ts` pour encapsuler manuellement les objets HTTP natifs V8 en instances compatibles `node:http` (`IncomingMessage` & `ServerResponse`). Cela permet à NestJS et à son intercepteur de cache d'évaluer les requêtes sur le réseau Edge sans proxy lourd.
  * **Comparateur structurel Zustand** : Implémentation de la fonction sur mesure `areProductsStructurallyEqual` au sein du store pour effectuer une vérification membre à membre des objets reçus de l'API avant de mettre à jour le store, stabilisant les hooks React couplés à `React.memo`.
  * **Système de recherche textuelle avec Debounce personnalisé** : Adaptation des filtres graphiques via l'usage combiné de `useRef` et `useEffect` pour imposer un délai de temporisation de 300 ms (`SEARCH_DEBOUNCE_MS`) sur l'état local `localSearch`.
  * **Animations échelonnées (Staggered Animations)** : Calcul dynamique et à la volée des délais d'animation CSS par carte de produit (`animationDelayStyle`) pour offrir un rendu visuel fluide et progressif.

## Ce que vous avez rejeté et pourquoi

- Quelles suggestions n'étaient pas appropriées ?
  * **L'installation du module complet `@nestjs/microservices`** : Rejetée pour éviter d'embarquer des drivers de composants inutiles qui auraient gonflé la taille du bundle Worker de plusieurs mégaoctets et augmenté le temps de déploiement, préservant ainsi les performances strictes de l'Edge.
  * **La création de routes de mutation (`POST`, `PUT`, `DELETE`, `PATCH`)** : Rejetée par respect absolu des directives métiers du test qui imposaient un seul et unique endpoint de consultation (`GET /products`). L'ajout de ces routes a été exclu pour éviter la sur-ingénierie et garantir l'immutabilité de la source de données.
  * **La connexion à un système de base de données persistant externe (PostgreSQL / MongoDB / Redis)** : Rejetée car les consignes exigeaient explicitement de stocker les produits uniquement en mémoire (tableau TypeScript) afin de valider la réactivité immédiate sans dépendance d'infrastructure externe.
  * **L'intégration de bibliothèques d'animation lourdes au runtime (Framer Motion, GSAP, Lottie)** : Rejetée au profit des classes utilitaires intégrées de Tailwind CSS v3 et du plugin `tailwindcss-animate` de Shadcn UI, garantissant une grande fluidité visuelle sur Desktop sans surcharger le poids final du bundle JavaScript.
  * **Le démontage/remontage inconditionnel du DOM des cartes de produit lors du refetch réseau** : Rejeté car le remplacement systématique des cartes par un écran de chargement global brisait la fluidité visuelle. Conserver les éléments affichés en arrière-plan tout en appliquant un délai de temporisation (debounce) offre une expérience utilisateur haut de gamme et stable.
  * **Le codage en dur de l'URL du serveur API dans le code source React** : Rejeté pour privilégier une approche propre et modulaire via l'exportation centralisée de `API_BASE_URL`, s'appuyant sur les variables d'environnement Vite et un fallback sécurisé en cas d'absence de variable.

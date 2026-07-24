# AGENT.md / CLAUDE.md

## 🎯 Context & Objective
You are assisting in creating a product management endpoint and frontend. Absolute compliance with the constraints outlined below is mandatory to clear production-readiness reviews. Do not hallucinate dependencies or introduce unapproved architecture patterns.

---

## 🛠️ Technology Stack Matrix
*   **Workspace Strategy:** Monorepo (`./backend` and `./frontend`)
*   **Backend:** NestJS, TypeScript, in-memory caching
*   **Frontend:** React, Vite, TypeScript, Shadcn UI, Tailwind CSS, Zustand
*   **Testing:** Jest + Supertest (Backend), Vitest + React Testing Library (Frontend)
*   **Deployment Target:** Cloudflare

---

## 🛑 Strict Engineering Guidelines & Constraints

### 1. Architectural Layout Boundaries (Frontend)
*   **Asset Restriction:** Do not generate SVG components or raw inline vector patterns for product illustrations. Use rendered images (via remote URLs from stable providers like Unsplash) to maintain high-fidelity presentation metrics.
*   **Animation Strategy:** Rely strictly on Tailwind CSS built-in utility classes, standard transitions, and the `tailwindcss-animate` plugin embedded within Shadcn UI primitives. Do not install heavy external runtime animation engines unless explicitly prompted.

### 2. Backend Design Core Requirements
*   **Data Tier:** Maintain all product entities inside a synchronous, in-memory TypeScript array (`PRODUCTS_SEED`).
*   **Endpoint Limit:** You are authorized to expose exactly **one** operational route: `GET /products`. Do not engineer mutation routes (`POST`, `PUT`, `DELETE`).
*   **Pagination & Filter Matrix:**
    *   Parameters: `page`, `limit`, `category`, `stock_status`.
    *   Filtering Strategy: Provide clean exclusive filtering capability by `category` OR `stock_status`.
    *   Pagination state must remain perfectly synced while filters are applied active.
*   **Input Integrity:** Enforce runtime payload filtering using NestJS global validation pipes utilizing `class-validator` and `class-transformer` DTO models.
*   **Error Layering:** Implement a dedicated global exception filter extending `BaseExceptionFilter` to intercept internal exceptions and return structured JSON responses.
*   **Caching Engine:** Implement a custom in-memory caching interceptor. Generate cache keys by hashing incoming request query string variables (e.g., `?page=1&limit=5&category=Electronics`). Append custom tracking headers (`X-Cache: HIT` / `X-Cache: MISS`) to server responses to simplify evaluation testing.

---

## 📂 Exact Mock Database Schema
Ensure all mock data models perfectly reflect these strict core constraints:
*   `id`: `number`
*   `name`: `string`
*   `category`: Union Literals Only: `'Electronics' | 'Clothing' | 'Food'`
*   `price`: `number`
*   `stock_status`: Enum/Union Literals Only: `'in_stock' | 'low_stock' | 'out_of_stock'`
*   `imageUrl`: `string` (Must point to a rendered photo asset asset URL)

---

## 🧪 Testing Protocol Checklist
Prior to marking a implementation stage complete, verify execution parity against the target validation criteria:

### Backend E2E Matrix (`supertest`)
*   Verify default pagination parameters (`page=1`, `limit=10`) are inferred seamlessly.
*   Assert data sorting boundaries when combining filtering parameters with pagination offsets.
*   Confirm secondary duplicate query dispatches evaluate with an `X-Cache: HIT` response signature.
*   Confirm out-of-bounds or mutated payloads return a `400 Bad Request` status code.

### Frontend Integration Matrix (`vitest` + RTL)
*   Ensure full component rendering cycle executes cleanly without raising React hook mismatch notifications.
*   Mock out global network `fetch` modules; verify filter dropdown actions execute targeted queries against the backend endpoint string.
*   Confirm state modifications execute cleanly through the Zustand data pipeline upon firing UI click actions.

---

## 📝 Required Log Book: `AI_USAGE.md`
Every major code generation command, modification action, or architectural choice must be clear for tracking purposes. You must compile facts into the `AI_USAGE.md` file **in FRENCH** following this exact framework:
1.  **Delegated Tasks:** Code segments or standard boilerplate blocks generated directly by the AI assistant.
2.  **Adapted Modules:** Complex systems tailored by the engineer to optimize runtime behavior (e.g., custom query-string hashing keys within the cache interceptor).
3.  **Explicitly Rejected Blocks:** Concepts provided by the AI that were deliberately thrown out (e.g., overengineered methods, wrong architectural patterns, incorrect code and technical decisions), explicitly documenting the design rationale behind each decision.

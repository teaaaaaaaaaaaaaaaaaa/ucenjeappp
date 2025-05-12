# Migration Plan: RDPR ASP.NET to React

This plan outlines the steps to migrate the existing ASP.NET portal (`https://www.rdrr.gov.rs/index.asp`) to a modern React application using Vite, TypeScript, React Router 6, Tailwind CSS, and Shadcn UI. The data will be fetched from the provided API endpoints.

**Phase 1: Project Setup & Core Structure**

1.  **Initialize Project (if not already done):**
    *   Ensure a Vite + React + TypeScript project is set up.
    *   Verify `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, and `vite.config.ts` are correctly configured.

2.  **Install/Verify Dependencies:**
    *   `react-router-dom`: For client-side routing.
    *   `axios`: For API calls.
    *   `lucide-react`: For icons.
    *   `clsx`, `tailwind-merge`: Utility libraries.
    *   `class-variance-authority`, `tailwindcss-animate`: Common Shadcn UI peer dependencies.
    *   `dompurify`, `@types/dompurify`: For sanitizing HTML fetched from the API.

3.  **Configure Tailwind CSS:**
    *   Set up `tailwind.config.js` according to project requirements, including the color palette from `cursor-rules.md`:
        *   Primary Blue: `#3FA9F5`
        *   White: `#FFFFFF`
        *   Dark Gray/Black: `#000000` (and shades)
        *   Accent Red: `#E30613`
    *   Ensure Tailwind directives are in `src/index.css` (or equivalent global CSS file).
    *   Typography: Configure Roboto font (ensure it's imported, e.g., via Google Fonts in `index.html`).

4.  **Set up Shadcn UI:**
    *   Initialize Shadcn UI in the project (`npx shadcn-ui@latest init`) if not already done.
    *   Configure components path (e.g., `src/components/ui`).

5.  **Define Project Directory Structure:**
    ```
    src/
    ├── assets/              # Static assets (images, fonts if local)
    ├── components/
    │   ├── layout/          # Header, Footer, Layout components
    │   ├── ui/              # Shadcn UI components
    │   └── shared/          # Common reusable components (e.g., NavLink, Logo)
    ├── hooks/               # Custom React hooks (e.g., useApiData)
    ├── lib/                 # Utility functions (e.g., cn for classnames, sanitizeHtml)
    ├── pages/               # Page components (e.g., DynamicPage)
    ├── services/            # API call logic
    ├── styles/              # Global styles (if any beyond Tailwind setup)
    ├── types/               # TypeScript type definitions
    ├── App.tsx              # Main application component with routing
    └── main.tsx             # Entry point
    ```

6.  **Environment Variables:**
    *   Create a `.env` file for the API base URL:
        `VITE_API_BASE_URL=https://core.ajsasoft.rs/api`

**Phase 2: API Service and Types**

1.  **Define TypeScript Types (`src/types/`)**:
    *   `navigation.ts`: Interfaces for navigation items (e.g., `NavItem`, `NavMenu`) based on `/api/Content/Navs/...` responses.
    *   `page.ts`: Interface for page content (e.g., `PageData`) based on `/api/Content/Pages/{slug}` response (title, htmlBody, metaTitle, metaDescription).
    *   `company.ts`: Interface for company data (e.g., `CompanyInfo`) based on `/api/Option/object/company-data` response.

2.  **Create API Service (`src/services/api.ts`)**:
    *   Implement functions to fetch data:
        *   `fetchHeaderNavData()`: Calls `/Content/Navs/nav-bar`.
        *   `fetchFooterNavData()`: Calls `/Content/Navs/footer-nav`.
        *   `fetchPageData(slug: string)`: Calls `/Content/Pages/${slug}`.
        *   `fetchCompanyData()`: Calls `/Option/object/company-data`.
    *   Use the `VITE_API_BASE_URL` environment variable.
    *   Include error handling and type responses.

**Phase 3: Layout Implementation**

1.  **Create `Header` Component (`src/components/layout/header.tsx`)**:
    *   Fetch navigation data using `fetchHeaderNavData`.
    *   Display logo (obtain from `www.rdrr.gov.rs` or assets).
    *   Display site title: "Републичка дирекција за робне резерве".
    *   Render dynamic navigation links using fetched data. Use `NavLink` from `react-router-dom` for active states.
    *   Style to match the original site using Tailwind CSS and Shadcn UI components (e.g., `NavigationMenu`).
    *   Handle responsive design for mobile/tablet views.

2.  **Create `Footer` Component (`src/components/layout/footer.tsx`)**:
    *   Fetch footer navigation data using `fetchFooterNavData`.
    *   Fetch company data using `fetchCompanyData`.
    *   Display company contact details, address, etc.
    *   Render footer navigation links.
    *   Include copyright information and any other relevant links (e.g., "мапа презентације", "контакт").
    *   Style to match the original site.

3.  **Create Main `Layout` Component (`src/components/layout/layout.tsx`)**:
    *   Combine `Header` and `Footer`.
    *   Include an `<Outlet />` from `react-router-dom` between the Header and Footer to render the current page's content.
    *   Manage global layout states if any (e.g., loading states for initial layout data).

**Phase 4: Routing and Page Display**

1.  **Configure Routes (`src/App.tsx`)**:
    *   Use `BrowserRouter`.
    *   Define routes:
        *   A root route `/` wrapping the `Layout` component.
        *   A child route `/:slug` mapping to the `DynamicPage` component.
        *   A child route for the homepage (e.g., `index` or handle `/` to load a default slug like "pocetna").
        *   Consider a 404 Not Found component/route (`*`).

2.  **Create `DynamicPage` Component (`src/pages/dynamic-page.tsx`)**:
    *   Use `useParams` hook from `react-router-dom` to get the `slug`.
    *   Determine default slug if none is present.
    *   Fetch page data using `fetchPageData(slug)`.
    *   Use React 19's built-in capabilities to set the document `<title>` (from `pageData.metaTitle`) and `<meta name="description">` (from `pageData.metaDescription`) directly within the component's return statement.
    *   **Sanitize `pageData.htmlBody` using `dompurify`** before rendering it (e.g., using `dangerouslySetInnerHTML={{ __html: sanitizedHtml }}`). Create a utility function for this in `src/lib/`.
    *   Implement loading states.
    *   Implement error states.
    *   Style the page content area.

**Phase 5: Styling and Components**

1.  **Global Styles (`src/index.css` or `src/styles/global.css`)**:
    *   Apply base styles, import fonts (Roboto).
    *   Ensure Tailwind base, components, and utilities are included.

2.  **Shared Components (`src/components/shared/`)**:
    *   Develop any reusable UI elements not covered by Shadcn UI.

3.  **Visual Replication:**
    *   Iteratively refine styling to match `https://www.rdrr.gov.rs/index.asp`.
    *   Ensure responsiveness.

4.  **Carousel/Slider:**
    *   **Action Item:** Clarify scope and data source. Plan omits implementation for now.

**Phase 6: Accessibility and Optimization**

1.  **Accessibility (A11y):**
    *   Use semantic HTML.
    *   Ensure keyboard accessibility.
    *   Provide `alt` text for images.
    *   Use ARIA attributes where needed.
    *   Test thoroughly.

2.  **Performance:**
    *   Optimize images (WebP, lazy loading).
    *   Utilize Vite's code splitting.
    *   Minimize re-renders judiciously.

**Phase 7: Testing and Refinement**

1.  **Manual Testing:**
    *   Test navigation, page loading, content display, responsiveness.

2.  **Linting and Code Quality:**
    *   Run `eslint`, adhere to `cursor-rules.md`.

**Key API Endpoints:**

*   Header Navigation: `/Content/Navs/nav-bar`
*   Footer Navigation: `/Content/Navs/footer-nav`
*   Page Content: `/Content/Pages/{slug}`
*   Company Data (for footer): `/Option/object/company-data`

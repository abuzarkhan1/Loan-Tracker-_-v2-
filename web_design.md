# Web Application Visual Architecture, Component Catalog, and AI Prompt Library

This document provides a detailed visual analysis of the Personal Finance & Loan Tracker web client (React / TypeScript / Vite). It aligns the visual tokens of the application's implementation with the global design blueprints, reconciling CSS variables, Tailwind classes, layout configs, and responsive typography between the primary design system in `fintech_design_system_and_ai_prompts.md` and the codebase parameters in `web-app/src/styles/index.css` and `web-app/src/config/theme.config.ts`.

Additionally, it provides high-fidelity, ready-to-copy generation prompts for each of the 17 custom components in the common catalog and the 10 screen modules, making it straightforward to generate matching interfaces using web builders like Stitch, Lovable, Bolt.new, or v0.

---

## 🎨 Global Design System: Alignment & Reconciliation

Below is a detailed analysis and reconciliation of the design tokens defined in the master design specification versus the actual implementation configuration of the web application.

### 1. Color Palette Comparison & Alignment

The web client implementation leverages standard CSS custom properties injected via utility layers to support instant theme changes. It maps onto the same warm peach, terracotta, cozy cream, and mint-emerald theme as the mobile client. Below is the direct color mapping reconciliation:

| Token / Usage | Blueprint Specification (`fintech_design_system_and_ai_prompts.md`) | Codebase CSS Variable (`index.css` / `theme.config.ts`) | Tone Style | Semantic Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `#2563EB` | `--primary`: `#f36f56` (Light / Dark) | Cozy Coral / Peach Accent | Primary branding highlights, main CTA buttons, focus outlines |
| **Primary Dark** | — | `--primary-dark`: `#d95441` (Light / Dark) | Deep Terracotta | Button hover/active states, active text links |
| **Success** | `#16A34A` | `--success`: `#1b7d62` (Light) / `#d9f1d7` (Dark) | Emerald Teal / Soft Mint | Positive financial flows, receivables ("Mujhe Lene Hain"), settled states |
| **Warning** | `#F59E0B` | `--warning`: `#8a6d1f` (Light) / `#ffd56a` (Dark) | Muted Gold / Warm Yellow | Pending items, partial payments, warning badges, promises pending |
| **Danger** | `#DC2626` | `--danger`: `#d95441` (Light) / `#f36f56` (Dark) | Terracotta Red / Muted Coral | Overdue loans, payables ("Mujhe Dene Hain"), error text |
| **Background** | `#F8FAFC` | `--background`: `#fffaf4` (Light) / `#1a161f` (Dark) | Cozy Cream / Dark Eggplant | App container background |
| **Background Soft**| — | `--background-soft`: `#fff7ef` (Light) / `#25212b` (Dark) | Soft Cream / Deep Plum | Content backplates, sidebar item hover backings |
| **Card** | `#FFFFFF` | `--card`: `#ffffff` (Light) / `#25212b` (Dark) | Pure White / Deep Plum | Main dashboard cards, widget containers, dialogue sheets |
| **Border** | `#E2E8F0` | `--border`: `rgba(80, 61, 52, 0.14)` (Light) / `rgba(255, 255, 255, 0.08)` (Dark) | Warm Clay / Muted Divider | Layout dividers, card borders, table margins |
| **Muted** | `#64748B` | `--muted`: `#6f6577` (Light) / `#a89fb0` (Dark) | Slate Purple / Muted Lilac | Small captions, metadata labels, placeholders |
| **Text** | `#0F172A` | `--text`: `#25212b` (Light) / `#f5f0eb` (Dark) | Charcoal Eggplant / Warm Cream | Body text, headers, primary metrics |
| **Peach Accent** | — | `--peach`: `#ffe4d3` (Light) / `rgba(255, 228, 211, 0.14)` (Dark) | Soft Peach | Warm aesthetic pills, highlight tags |
| **Mint Accent** | — | `--mint`: `#d9f1d7` (Light) / `rgba(217, 241, 215, 0.14)` (Dark) | Soft Mint | Positive alert boxes, success tag borders |
| **Yellow Accent** | — | `--yellow`: `#ffd56a` (Light) / `rgba(255, 213, 106, 0.15)` (Dark) | Warm Amber | Alert highlights, warning pills |
| **Pill Background** | — | `--pill`: `#fff7ef` (Light) / `#332d3a` (Dark) | Subtle Coral / Dark Slate | Badge backgrounds, structural toggle pills |
| **Shadow Tint** | — | `--shadow-color`: `rgba(88, 48, 32, 0.08)` (Light) / `rgba(0, 0, 0, 0.4)` (Dark) | Cozy Shadow / Ink Black | Underlay depth borders |

> [!NOTE]
> The web application tailwind config integrates these variables through custom classes prefixed with `app` (e.g. `bg-appBg`, `text-appText`, `border-appBorder`) ensuring utility compatibility across dark mode toggles via standard document-level tailwind `.dark` classes.

### 2. Typography & Fonts Reconciliation

The web application forces the loading of Google Fonts dynamically inside `index.css` via an `@import` rule. It defaults to the geometric sans-serif typeface `Manrope` which provides legible text elements in all sizes:

| Weight Class | Blueprint Font Target (`Inter` / `Outfit`) | Codebase Font Target (`Manrope`) | CSS / Tailwind Utility Class | Common Web Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **Regular (400)** | `Inter-Regular` / `Outfit-Regular` | `Manrope (400)` | `font-normal` | Paragraph descriptions, transaction rows, list tables |
| **Medium (500)** | `Inter-Medium` / `Outfit-Medium` | `Manrope (500)` | `font-medium` | Menu text, secondary form buttons, helper text |
| **Semi-Bold (600)** | `Inter-SemiBold` / `Outfit-SemiBold` | `Manrope (600)` | `font-semibold` | Table headers, dropdown selectors, field headings |
| **Bold (700)** | `Inter-Bold` / `Outfit-Bold` | `Manrope (700)` | `font-bold` | Card headings, numeric widgets, active CTAs |
| **Extra Bold (800)**| `Inter-Black` / `Outfit-Black` | `Manrope (800)` | `font-extrabold` | Hero page metrics, title banners, status labels |

*   **Subtle Optimizations:** Tables and currency layouts implement `tabular-nums` inside the typography utilities to maintain columnar alignment during value changes.
*   **Transition Properties:** Theme variable modifications are governed by root transition directives that smoothly shift colors over `150ms` using cubic bezier parameters.

### 3. Layout, Borders, & Shadow Continuity

*   **Border Radius Continuity:** The web application adopts soft layout shapes using custom Tailwind declarations: `rounded-xl` (12px) is used for basic form inputs, buttons, and secondary tag badges; `rounded-2xl` (16px) is used for dashboard summary items, modular dialog overlays, table blocks, and standard layouts; `rounded-full` (999px) is used for circular avatar icons, action buttons, and status indicator pills.
*   **Shadow Specifications Comparison:**
    *   *Blueprint Specs:* Soft offsets `{ width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12`.
    *   *Web-App Specs (`shadow-soft` / `shadow-sm`):*
        *   **Light Mode:** `0 4px 24px rgba(88, 48, 32, 0.08)` (uses warm clay base).
        *   **Dark Mode:** `0 4px 24px rgba(0, 0, 0, 0.4)` (deep black overlay shadow).
    *   *Web-App Specs (`shadow-elevated` / `shadow-md`):*
        *   **Light Mode:** `0 12px 40px rgba(88, 48, 32, 0.08)`.
        *   **Dark Mode:** `0 12px 40px rgba(0, 0, 0, 0.4)`.

---

## 🏛️ Comprehensive Component Analysis & AI Prompt Library

Below is a detailed analysis of the 17 custom components in `web-app/src/components/common`. Each includes a code generation prompt incorporating the reconciled CSS/Tailwind variables.

### 1. `AmountText.tsx`
*   **Purpose & UX Value:** Dynamically displays decimal/numeric currencies, formatted according to localization parameters. Links with the root `privacy.store` using the `amountsHidden` toggle to render masked layouts (`••••`) without corrupting raw numbers.
*   **Key Props & Custom Behavior:** `amount` (numeric value), `className` (text layout styles), `hideMask` (custom blur visual placeholder, default "••••").
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React TypeScript AmountText component styled with Tailwind. Props: amount (number), className (string), hideMask (string, default "••••"). It imports usePrivacyStore from "../../store/privacy.store" to check amountsHidden. If true, it displays hideMask inside an opacity-80 span with tracking-widest. Otherwise, it formats the amount into local currency (Rs.) using formatCurrency. Apply font-sans and tabular-nums utilities, and support select-all to let users copy the value.
    ```

### 2. `Badge.tsx`
*   **Purpose & UX Value:** Modular badge pill to represent categorizations, tags, and status categories.
*   **Key Props & Custom Behavior:** `variant` (`primary`, `success`, `warning`, `danger`, `muted`, `peach`, `mint`, `yellow`), `size` (`sm`, `md`), `outlined` (boolean).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a custom React Badge component styled with Tailwind. Props: children (ReactNode), className (string), variant ('primary' | 'success' | 'warning' | 'danger' | 'muted' | 'peach' | 'mint' | 'yellow'), size ('sm' | 'md'), outlined (boolean). Apply base styles: inline-flex, items-center, justify-center, font-semibold, rounded-full, tracking-wider, uppercase, transition-colors duration-150. Configure color mappings using the variables (--primary, --success, --warning, --danger, --muted) mapping to bg/border combinations. Support outlined variants. Size 'sm' should be text-[10px] px-2 py-0.5 and 'md' text-xs px-2.5 py-1.
    ```

### 3. `Button.tsx`
*   **Purpose & UX Value:** Interactive click element. Integrates a loading spinner state, disables pointer actions while active, and scales down slightly on press click transitions.
*   **Key Props & Custom Behavior:** `variant` (`primary`, `secondary`, `success`, `danger`, `outline`, `ghost`), `size` (`sm`, `md`, `lg`), `isLoading`, `fullWidth`, `leftIcon`, `rightIcon`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a highly premium React Button component with TypeScript and Tailwind. Props: variant ('primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'), size ('sm' | 'md' | 'lg'), isLoading (boolean), fullWidth (boolean), leftIcon (ReactNode), rightIcon (ReactNode), standard button attributes. Base styles: inline-flex, items-center, justify-center, font-medium, rounded-xl, focus:outline-none, active:scale-[0.98], disabled:pointer-events-none, disabled:opacity-50, transition-all duration-150. Use Lucide's Loader2 for loading states. Set the hover state to trigger subtle shadow depth adjustments.
    ```

### 4. `Card.tsx`
*   **Purpose & UX Value:** Structural bounding card that supports different surface heights, border frames, and interactive scale highlights.
*   **Key Props & Custom Behavior:** `variant` (`flat`, `bordered`, `elevated`, `glass`), `hoverable` (scale compression effect), `padding` (`none`, `sm`, `md`, `lg`).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a visual React Card component in Tailwind. Props: variant ('flat' | 'bordered' | 'elevated' | 'glass'), hoverable (boolean), padding ('none' | 'sm' | 'md' | 'lg'), standard div attributes. Apply rounded-2xl border shape. Define flat using bg-appBgSoft; bordered using bg-appCard border border-appBorder shadow-sm; elevated using bg-appCard shadow-soft border border-appBorder/40; glass using glass-card. If hoverable is true, add hover:shadow-md, hover:scale-[1.005], active:scale-[0.998], and cursor-pointer.
    ```

### 5. `ConfirmDialog.tsx`
*   **Purpose & UX Value:** Modal-locked popup layout designed for critical validation checks, supporting destructive safety alerts.
*   **Key Props & Custom Behavior:** `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmText`, `cancelText`, `isDestructive`, `isLoading`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React ConfirmDialog component. Renders an absolute backdrop using bg-black/60 and backdrop-blur-sm, centering a Card container. The Card must animate on entry using fade-in and zoom-in-95. The header displays a Lucide AlertTriangle inside a circular badge (red background if isDestructive, orange if regular). Render Title, detailed message, and action controls aligned right. Destructive action buttons should use the danger variant. Include ESC key listener hooks to close.
    ```

### 6. `DatePicker.tsx`
*   **Purpose & UX Value:** Native HTML date selector styled to match theme bounds, complete with prefix calendars.
*   **Key Props & Custom Behavior:** `value` (ISO string), `onChange`, `label`, `error`, `min`, `max`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React DatePicker input component. Include a label in font-semibold text-xs text-appMuted. Renders a date input container containing a Lucide calendar icon on the left. The input is styled with rounded-xl, bg-appCard, border-appBorder. On focus, the border must glow with the appPrimary color. If error is present, highlight the container border in crimson red and render the error message below.
    ```

### 7. `Drawer.tsx`
*   **Purpose & UX Value:** Slide-out right panel designed for detailed forms or data reviews, preserving background view states.
*   **Key Props & Custom Behavior:** `isOpen`, `onClose`, `title`, `children`, `size` (`sm`, `md`, `lg`).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Slide Drawer panel. When isOpen is active, block background scrolling by appending overflow-hidden to document body. Render an absolute overlay background backdrop-blur-sm with animate-fade-in. The main content slider scales in from translate-x-full to translate-x-0 on the right side. Include a header showing the Title and a Lucide X close button. Support sizes: sm (max-w-md), md (max-w-lg), lg (max-w-xl).
    ```

### 8. `EmptyState.tsx`
*   **Purpose & UX Value:** Centered prompt illustrating empty search queries or absent databases.
*   **Key Props & Custom Behavior:** `title`, `message`, `icon` (Lucide element), `action` (optional button payload).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React EmptyState graphic component. Renders a central layout containing an optional Lucide icon colored in muted slate-purple. The headline uses font-bold text-base text-appText, followed by a detailed explanation paragraph in text-sm text-appMuted. If an action element is passed as a prop, render it underneath to guide the user (e.g. "Add Loan").
    ```

### 9. `ErrorState.tsx`
*   **Purpose & UX Value:** Renders red-alert prompts on failure states, equipped with retry buttons.
*   **Key Props & Custom Behavior:** `message`, `onRetry`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create an ErrorState element. Features a Card container with red-orange accents. Displays a Lucide AlertCircle icon alongside a bold error header. The detailed message explains the API/database error in text-sm. Include an action retry button that re-fires the onRetry callback function.
    ```

### 10. `Input.tsx`
*   **Purpose & UX Value:** Generic visual text/number field supporting focus shadows, placeholder colors, and validation error messages.
*   **Key Props & Custom Behavior:** `label`, `error`, `leftIcon`, `rightIcon`, standard input props.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Form Input element. It supports labels styled in font-semibold text-xs uppercase tracking-widest text-appMuted. Wrap the input inside a border-appBorder container that highlights with border-appPrimary and a subtle ring on focus. Support leftIcon and rightIcon rendering (e.g., Lucide elements). Render red validation error strings beneath the container.
    ```

### 11. `LoadingState.tsx`
*   **Purpose & UX Value:** Screen overlay showing dynamic spinner logs or structured skeleton grids while fetching data.
*   **Key Props & Custom Behavior:** `message`, `type` (`spinner` | `skeletons`), `count` (skeleton row density).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React LoadingState indicator. If type is 'spinner', render a rotating loader loop alongside a pulsing description text (e.g. "Compiling ledger logs"). If type is 'skeletons', render a grid of shimmering grey/peach boxes utilizing animate-pulse to mock a loading card structure.
    ```

### 12. `Modal.tsx`
*   **Purpose & UX Value:** Centered dialog popup layout suitable for adding entities or configuration forms.
*   **Key Props & Custom Behavior:** `isOpen`, `onClose`, `title`, `children`, `size` (`sm`, `md`, `lg`, `xl`).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a modular React Modal template. It uses a portal to mount on the document body. Includes a dark overlay underlay matching black/60 with backdrop-blur-sm. Centered Card container animates via a scale transition. Includes a title bar with a Lucide close button. Sizes range from sm (max-w-sm) to xl (max-w-2xl).
    ```

### 13. `SearchInput.tsx`
*   **Purpose & UX Value:** Specialized search field with built-in search/clear icons.
*   **Key Props & Custom Behavior:** `value`, `onChange`, `placeholder`, `onClear`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create an interactive React SearchInput component. Renders a search input field containing a prefix Lucide Search icon on the left and a suffix Lucide X clear button on the right when value length is greater than 0. The clear action resets the text and fires the onChange trigger.
    ```

### 14. `Select.tsx`
*   **Purpose & UX Value:** Dropdown option selector supporting custom form inputs.
*   **Key Props & Custom Behavior:** `label`, `options` (key/value array), `value`, `onChange`, `error`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Select selector dropdown field. Displays a custom option list box. The container features a trailing Lucide ChevronDown icon. Active choices display highlight backplates. Fully support keyboard selection cycles, and apply red-danger outlines on error states.
    ```

### 15. `StatusBadge.tsx`
*   **Purpose & UX Value:** Translates raw database enum codes (e.g., `ACTIVE`, `WRITTEN_OFF`, `BROKEN`) to formatted pills.
*   **Key Props & Custom Behavior:** `status` (enum string value).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React StatusBadge component. It imports Badge from "./Badge". The component accepts a status string, normalizes it using toUpperCase(), and maps it to variants. Map ACTIVE to variant 'primary', SETTLED to variant 'success', OVERDUE to variant 'danger', WRITTEN_OFF to variant 'muted'. Map PINGING/PENDING to variant 'warning', KEPT to variant 'success', and BROKEN to variant 'danger'. Output a clean, uppercase status badge.
    ```

### 16. `Table.tsx`
*   **Purpose & UX Value:** Foundational data grid supporting structured columns, responsive horizontal scrolling, loading backplates, and empty states.
*   **Key Props & Custom Behavior:** `headers` (array of strings), `children` (tbody rows), `isLoading`, `isEmpty`, `emptyComponent`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Table grid container. Props: headers (string[]), children (ReactNode), isLoading (boolean), isEmpty (boolean), emptyComponent (ReactNode). Container styles: w-full, overflow-x-auto, rounded-2xl, border, bg-appCard. Table headers are styled inside the thead using bg-appBgSoft/60, uppercase, text-xs, font-semibold text-appMuted. If isLoading is active, span loading animations across all columns. If empty, center the emptyComponent or a default "No records found" text.
    ```

### 17. `ThemeToggle.tsx`
*   **Purpose & UX Value:** Corner utility button that toggles `.dark` classes on the document element.
*   **Key Props & Custom Behavior:** Standard icon buttons switching between sun and moon states.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React ThemeToggle button. Renders a circle outline button containing Lucide's Sun icon (if active theme is dark) or Moon icon (if light). Clicking the button toggles document.documentElement.classList between 'light' and 'dark', saving the active state to localStorage.
    ```

---

## 🏛️ Comprehensive Screen Analysis & AI User Journey Library

The 63 page views registered in `web-app/src/routes/AppRouter.tsx` are mapped into **10 cohesive User Journey Flows**. The section below breaks down every screen in detail, outlining the exact layouts, fields, components, state connections, and specific prompts to allow builders to generate the respective interfaces.

---

### Flow 1: SaaS Portal Authentication & Access Management (User Entry & Onboarding Flow)
This flow represents a user's entry point to the SaaS web platform, covering onboarding registration wizards, secure token credential verification, legal disclosures, and account recoveries.

#### 📁 Registered Screen Files
*   [Login.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/auth/Login.tsx) — Main entry portal. Captures email and password, returning JWT access tokens.
*   [Register.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/auth/Register.tsx) — Multi-field sign-up form validating user details, passwords, and service checks.
*   [ForgotPassword.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/auth/ForgotPassword.tsx) — Security view allowing users to input recovery emails and request password reset notifications.
*   [PrivacyPolicy.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/legal/PrivacyPolicy.tsx) — Static legal view displaying full privacy clauses, data control standards, and backup vault descriptions.
*   [Terms.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/legal/Terms.tsx) — Static terms and conditions detailing bilateral mediation clauses.

#### 🔍 Detailed Screen Specifications
*   **Login Page UI:** A split-screen desktop viewport. Left side is a widescreen layout featuring a deep terracotta-coral gradient mesh, a stylized overlay showing dynamic statistics, and the branding logo text: "LoanTracker. Reclaiming Bilateral Trust." Right side is a pure white container centering a card with inputs for Email (with a prefix Lucide Mail icon) and Password (equipped with an interactive secure-eye Lucide Eye/EyeOff toggle), a "Forgot Password?" anchor link, and a full-width pill Button. Include quick-social mock login buttons below.
*   **Register Page UI:** A symmetrical dual-column registration view. Captured fields: Full Name, Email, Phone Number, and Password. Includes real-time password strength check meters styled in HSL colors. If validations fail (e.g. invalid phone number), input borders turn red and render validation messages. Toggle checkbox for "I accept the Terms and Privacy Policy."
*   **Forgot Password Page UI:** Minimalist centered form inside an elevated card. Input for Email. Submitting the form changes the card content to a success prompt with a Lucide CheckCircle icon and a "Back to Login" CTA button.
*   **Legal Disclosures UI:** Centered, spacious reading container using a single h1 tag, rounded-2xl panels, clear text paragraph styles, and a print button on top that launches the browser's printing window.

#### 📋 Master AI Screen Codegen Prompt (First-Time User Journey)
```text
Generate a set of React views using Vite and Tailwind CSS for Onboarding & SaaS Auth (Login, Register, Forgot Password, and static Legal disclosure pages).
Color configuration uses system HSL variables: bg-appBg (#fffaf4 in light, #1a161f in dark), bg-appCard (#ffffff / #25212b), appPrimary (#f36f56), and text-appText (#25212b / #f5f0eb).
1. Login View: 2-column layout. The left column (hidden on mobile) shows a warm gradient mesh overlaying a brand tag: "LoanTracker. Reclaiming Bilateral Trust." The right column centers a form containing standard FormInput fields for Email and Password. Password has a toggle icon. Place a "Forgot Password?" link on top of the password field. CTA: Primary pill Button.
2. Register View: Clean card form centering. Fields: Full Name, Email, Phone Number, Password. Password input highlights characters as they are typed. Include a checkbox matching custom labels for "I accept Terms & Conditions" linking to legal pages.
3. Forgot Password: Input box for Email. Displays an absolute success alert panel on successful submission.
4. Legal Pages (Terms & Privacy): Centered card wrappers using clean typography, a single H1, and an floating "Print Document" Button.
Ensure smooth theme toggling, rounded-xl borders for inputs, and Manrope typography throughout the auth flow.
```

---

### Flow 2: Core Contacts Ledger & Net Outstanding Directory (Bilateral Trust Flow)
This flow manages debtor/creditor profile indices, aggregating ledger statuses (receivables and payables), analyzing trust ratings, and defining custom payment limits.

#### 📁 Registered Screen Files
*   [Contacts.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/contacts/Contacts.tsx) — Main directory grid. Groups favorite contacts and displays searchable lists of profiles with outstanding net balances.
*   [ContactDetail.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/contacts/ContactDetail.tsx) — Contact center, showing aggregate metrics, quick communications shortcuts, and action buttons.
*   [ContactLedger.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/contacts/ContactLedger.tsx) — Interactive ledger breakdown separating loans given, loans taken, and cash payments.
*   [ContactTrustProfile.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/contacts/ContactTrustProfile.tsx) — Credit profiling scorecard displaying late payment ratios and behavioral grades.
*   [ContactRelationshipSettings.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/contacts/ContactRelationshipSettings.tsx) — Settings page managing credit thresholds and payment alerts.

#### 🔍 Detailed Screen Specifications
*   **Contacts Directory UI:** Top action bar features a SearchInput field and filter pills (Favorites, Debtors, Creditors). Groups favorites inside a horizontal slider with circular avatars. The main body lists contacts in a structured table or card grid. Each row displays an avatar, contact name, last payment date, net balance (colored emerald-green for receivables "Lene Hain", or coral-red for payables "Dene Hain"), and a chevron navigation arrow.
*   **Contact Detail UI:** Left panel shows the contact profile card, aggregating receivables, payables, and a trust score star meter. Top horizontal bar contains quick action buttons (Log Loan, Add Repayment, WhatsApp reminder). Right panel shows overdue alerts.
*   **Contact Ledger UI:** A tabbed component ("All Transactions", "Loans Given/Taken", "Payments Recorded"). Data is loaded inside a Table component with columns for Date, Type, Description, Payment Method, Amount, and Status.
*   **Contact Trust Profile UI:** Renders a radial speed dial showing the reliability score. Compiles statistics for broken promises, late payment cycles, and rating ratings.
*   **Relationship Settings UI:** Simple form view. Form fields capture "Maximum Credit Limit (Rs.)" and "Automatic follow-up interval."

#### 📋 Master AI Screen Codegen Prompt (Bilateral Trust Flow)
```text
Generate a set of React contact management pages in Tailwind CSS (Directory, Profile Detail, Tabbed Ledger, Trust Profile, and Relationship settings).
Colors: bg-appBg (#fffaf4 / #1a161f), bg-appCard (#ffffff / #25212b), Success: #1b7d62, Danger: #d95441.
1. Contacts Directory: Header contains search input and filter buttons. Displays favorite contacts inside a horizontal slider. Below, lists contacts inside a table. Rows display a circular avatar, contact name, trust badge, outstanding net balance, and action buttons. Floating (+) action button launches an Add Contact Drawer.
2. Profile Detail Page: Left column houses a card showing aggregate balances and trust star ratings. Right column lists details and alerts.
3. Tabbed Ledger Page: Renders tab buttons ("All", "Loans", "Payments"). Inside, table list displays transactions.
4. Trust Score Profile: Centers a radial percentage dial of trust. Underneath, displays progress bars for broken promise rates.
5. Relationship Settings: Form containing numerical input fields for Credit Limit and alert intervals.
Use Manrope typography, soft elevation shadows, and rounded-xl containers throughout.
```

---

### Flow 3: Loan Portfolio Management & Repayment Amortization (Bilateral Lending Flow)
Initiating bilateral loans, modeling interest schedules, and tracking remaining balances.

#### 📁 Registered Screen Files
*   [Loans.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/loans/Loans.tsx) — Loan portfolio dashboard, tabulating active, settled, and overdue entries.
*   [LoanDetail.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/loans/LoanDetail.tsx) — Detailed breakdown screen showing interest accumulations, paid progress lines, and upcoming due cycles.
*   [AddLoan.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/loans/AddLoan.tsx) — Advanced form compiling principal amounts, compounding configurations, interest rates, and loan terms.
*   [EditLoan.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/loans/EditLoan.tsx) — Modification panel to adjust interest rates or terms of active loans.

#### 🔍 Detailed Screen Specifications
*   **Loans Dashboard UI:** Displays three large summary envelopes (Total Active Loans Given, Total Active Loans Taken, Total Remaining Balances). Underneath, a segmented tab controller ("Active", "Overdue", "Settled"). Each tab contains lists of items rendered inside card containers with a borrower name, issue date, paid progress line, and a remaining amount text ("Baqi Raqam Rs. ****" if privacy is enabled).
*   **Add Loan Form UI:** Symmetrical dual-column view. Left column contains form fields: Borrower Select, Principal Amount, Annual Interest Rate (%), Repayment Frequency (Weekly, Monthly), Loan Duration (Months), and Start Date. Right column contains a real-time amortization preview box updating as inputs are changed.
*   **Loan Detail View UI:** Left column shows a radial paid-percentage ring and visual cash graphs. Right column lists the complete due schedule inside a Table component, showing dates, principal due, interest due, and payment status badges.

#### 📋 Master AI Screen Codegen Prompt (Bilateral Lending Flow)
```text
Generate a set of React / Vite views using Tailwind for Loan Portfolio Administration (Loans Hub, Add Loan Form, and Loan Detail).
Colors: bg-appBg (#fffaf4 / #1a161f), bg-appCard (#ffffff / #25212b), appPrimary (#f36f56).
1. Loans Hub: Tab-separated table layout showing "Active", "Overdue", "Settled" portfolios. Each row details Borrower Name, principal value, interest rate, issue date, outstanding balance, and progress. Overdue items display red danger badges.
2. Add Loan Form: Left side contains form fields for Principal Amount, Interest Rate, Repayment Frequency (Weekly, Monthly), and DatePicker. Right side features an interactive Amortization Schedule box updating in real-time as values are typed.
3. Loan Detail View: Left column shows progress rings comparing Principal vs Interest. Right column lists the complete due schedule inside a Table component, showing column cells with green checkmarks (Paid) or grey clock icons (Pending).
Ensure support for privacy masking using the AmountText component.
```

---

### Flow 4: Payment Execution, Bilateral Settlements, & PDF Receipts (Cash Repayment Flow)
Recording repayments against loans, configuring digital payments, attaching receipt images, and generating bilateral netting agreements.

#### 📁 Registered Screen Files
*   [AddPayment.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/payments/AddPayment.tsx) — Main form capturing payment values, date stamps, and receipt photo uploads.
*   [EditPayment.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/payments/EditPayment.tsx) — Correction wizard validating transaction limits.
*   [PaymentDetail.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/payments/PaymentDetail.tsx) — Digital receipt view showing payment details and print anchors.
*   [PaymentRequests.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/recovery/PaymentRequests.tsx) — Record listing outgoing request links and payment alerts.
*   [PaymentRequestPreview.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/recovery/PaymentRequestPreview.tsx) — Final receipt display containing digital signatures.

#### 🔍 Detailed Screen Specifications
*   **Add Payment UI:** Standard form inside a rounded-2xl Card. Form fields: Loan Select, Payment Amount, Payment Date, Payment Method (Cash, Bank Transfer, EasyPaisa). Includes a file upload drop zone box supporting image drag-and-drop to capture slips.
*   **Payment Detail UI:** Renders a visual layout resembling a cash register receipt. Displays Transaction ID, barcode placeholders, loan tags, payment status badges, and download button.
*   **Payment Requests & Netting UI:** Shows a comparative layout detailing "What Ali owes you" vs "What you owe Ali". Displays a net reconciliation recommendation card. Tapping "Confirm Settlement" launches a signature canvas overlay to sign the agreement.

#### 📋 Master AI Screen Codegen Prompt (Cash Repayment Flow)
```text
Generate a set of React / Vite pages in Tailwind for Repayment Processing (Add Payment, Payment Detail, and Payment Requests).
Theme: Background: --background, Primary: --primary (#f36f56), Cards: --card.
1. Add Payment Form: Form linked to a specific loan. Numeric input box for amount. Select dropdown for payment method (Cash, Bank, EasyPaisa). File upload container supporting drop zones for receipt images.
2. Payment Detail Receipt: Simulates an invoice layout. Renders Transaction ID, barcode placeholders, loan tags, payment status badges, and download button.
3. Payment Request View: Bilateral netting engine. Generates payment reconciliation tables comparing "Amount Ali owes you" vs "Amount you owe Ali". Displays net settlement recommendations inside an alert box: "Settle net balance of Rs. 15,000?". Clicking "Settle" launches a signature canvas overlay.
Ensure all borders use rounded-xl and fonts use Manrope.
```

---

### Flow 5: Voice Assistant & Smart Natural Language Transaction Logging (AI Intake Flow)
Smart transaction entry panels that parse Roman Urdu sentences, review extracted parameters, audit ledger errors, and host chat modules.

#### 📁 Registered Screen Files
*   [SmartTextEntry.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/smart/SmartTextEntry.tsx) — Text input view parsing Roman Urdu lines.
*   [SmartEntryHistory.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/smart/SmartEntryHistory.tsx) — History table listing AI inputs and manual adjustments.
*   [FinanceAssistant.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/smart/FinanceAssistant.tsx) — Full screen chat assistant returning interactive charts and tables.
*   [DataQualityAssistant.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/smart/DataQualityAssistant.tsx) — Quality dashboard highlighting duplicate entries and missing tags.

#### 🔍 Detailed Screen Specifications
*   **Smart Entry UI:** Prominent text-area input field. Includes placeholder text: "Type Roman Urdu: 'Mene Ali ko 5000 diye kal tak'." Below, render a parsed preview card displaying extracted parameters in form fields for manual correction before saving: Contact Name, parsed amount, and payment due date.
*   **AI Finance Assistant UI:** Interactive chat view. Left column displays prompt suggestions. Right column shows scrollable message chains. User text appears in peach pills, and AI replies render inside cards containing interactive Recharts charts or formatted tables depending on budget questions.
*   **Data Quality Assistant UI:** Quality grid highlighting duplicate logs, missing categories, and unmatched balances.

#### 📋 Master AI Screen Codegen Prompt (AI Intake Flow)
```text
Generate a set of React views in Tailwind for AI-Driven Intelligent Intake (Smart Entry, AI Chat Assistant, and Data Quality Auditor).
Theme: Dark tech appearance (Background: #1a161f, Card: #25212b, Primary: #f36f56).
1. Smart Entry Panel: Prominent text-area input field. Includes placeholder text: "Type Roman Urdu: 'Mene Ali ko 5000 diye kal tak'." Below, render a parsed preview card displaying extracted parameters in form fields for manual correction before saving: Contact Name, parsed amount, and payment due date.
2. AI Chat Assistant: Chat layout. Left pane displays prompt suggestions. Right pane shows scrollable message chains. User text appears in peach pills, and AI replies render inside cards containing interactive Recharts charts or formatted tables depending on budget questions.
3. Data Quality Auditor: Alerts view showing transaction anomalies (e.g. duplicate payment logs, missing tags). Rows feature action buttons to "Resolve" or "Merge" entries.
Maintain rounded-2xl layout blocks and Manrope typography throughout the interfaces.
```

---

### Flow 6: Urgent Alerts, Urdu Templates, & Payment Commitments (Follow-up Flow)
Visual alert hubs, SMS/WhatsApp Roman Urdu reminder templates, promise trackers, and recovery kanban boards.

#### 📁 Registered Screen Files
*   [AlertsCenter.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/AlertsCenter.tsx) — Notification feed sorting overdue notices and payment alerts.
*   [RecoveryCenter.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/recovery/RecoveryCenter.tsx) — Kanban visual pipeline of debtor collections.
*   [FollowUps.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/recovery/FollowUps.tsx) — Logging table tracking user calls and template dispatches.
*   [Promises.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/recovery/Promises.tsx) — Ledger grid logging Kept and Broken promises.
*   [CommunicationTimeline.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/recovery/CommunicationTimeline.tsx) — Historic timeline showing alerts and call logs.
*   [TransactionTemplates.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/TransactionTemplates.tsx) — Templates hub holding WhatsApp layouts.

#### 🔍 Detailed Screen Specifications
*   **Alerts Feed UI:** Stack of alert cards showing Lucide Warning icons. Left border indicates urgency level (orange/red). Action button triggers a drawer displaying SMS/WhatsApp reminder template builders in Roman Urdu.
*   **Recovery Kanban UI:** Drag-and-drop columns representing debtor status: "Notified", "Awaiting Promise", "Promise Overdue", "Bilateral Mediation".
*   **Promises Tracker UI:** Visual grid separating kept and broken deadlines, tracking star rating impacts.

#### 📋 Master AI Screen Codegen Prompt (Follow-up Flow)
```text
Generate a set of React views inside a Tailwind grid for Recovery Management (Alerts Center, Recovery Kanban Pipeline, and Promise Log).
Theme variables: Background: --background, Cards: --card, Danger: --danger (#d95441), Warning: --warning (#8a6d1f).
1. Alerts Center Feed: Top navigation filtering items by severity. Vertical stack of Alert cards showing custom Lucide Warning icons. Left border indicates urgency level (orange/red). Action button triggers a drawer displaying SMS/WhatsApp reminder template builders in Roman Urdu.
2. Recovery Kanban: Visual horizontal columns depicting recovery states: "Notified", "Awaiting Promise", "Promise Overdue", "Bilateral Mediation". Users drag contact cards across columns to trigger alert templates.
3. Promise Log: Layout separating "Promises Kept" (green border) vs "Promises Broken" (red border). Details the name, promised date, committed amount, and trust rating impacts.
Ensure rounded-2xl widgets and Manrope fonts.
```

---

### Flow 7: Expense Tracking, Cash Budgets, & Savings Targets (Daily Wealth Flow)
Aggregating cash accounts, categorizing daily transactions, defining savings goals, and monitoring budget targets.

#### 📁 Registered Screen Files
*   [MoneyDashboard.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/MoneyDashboard.tsx) — Wealth control center displaying bank assets and budget progress meters.
*   [Transactions.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/Transactions.tsx) — Master data table of all cash flows.
*   [AddTransaction.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/AddTransaction.tsx) — Entry panel to log cash allocations.
*   [TransactionDetail.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/TransactionDetail.tsx) — Metadata card tracking specific expenditures.
*   [Categories.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/Categories.tsx) — Setup page managing ledger categories.
*   [Budget.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/Budget.tsx) — Monthly budget limit gauges.
*   [SavingsGoals.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/SavingsGoals.tsx) — Goal tracker showing circular progress rings.

#### 🔍 Detailed Screen Specifications
*   **Wealth Dashboard UI:** Displays cards for asset classes (Cash, Bank, Wallet). Features a line chart showing Income vs Expenses. Below, a grid of categories with spent vs limit progress meters.
*   **Budget Planner UI:** Vertical card list. Each card displays spent vs limit progress bars that transition to orange-red if limits are exceeded.
*   **Savings Goals UI:** Visual grid of goals displaying SVG progress rings and deposit action buttons.

#### 📋 Master AI Screen Codegen Prompt (Daily Wealth Flow)
```text
Generate a set of React / Vite pages for Unified Personal Wealth (Money Dashboard, Budget Tracker, and Savings Goals).
Theme colors: Background: --background (#fffaf4 / #1a161f), Cards: --card, Text: --text.
1. Money Dashboard: Top row shows card assets (Cash Balance, Bank Balance, Wallet). Middle row features a visual trend line chart (Income vs Expenses). Bottom grid displays categories (Food, Rent, Bills) alongside progress lines.
2. Budget Planner Page: Vertical stack of budget cards. Each card displays an icon, category name, AmountText spent vs limit, and color-coded progress bars. Bars transition to orange-red if expenses exceed limits.
3. Savings Goals Page: Visual grid of goal cards. Each card displays a circular SVG progress ring, goal name (e.g. "Car Fund"), target date, and a CTA button to add savings deposits.
Ensure layouts use rounded-2xl corners, soft shadows, and Manrope typography.
```

---

### Flow 8: Salary Cycle Deductions & Automated Allocations (Income Distribution Flow)
Logging paychecks, scheduling cycles, and configuring automated loan repayments.

#### 📁 Registered Screen Files
*   [SalaryDashboard.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/SalaryDashboard.tsx) — Income dashboard displaying upcoming paydays and planned allocations.
*   [SalarySettings.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/SalarySettings.tsx) — Setup form managing payday frequencies.
*   [SalaryEntries.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/SalaryEntries.tsx) — Historical paycheck ledger logs.

#### 🔍 Detailed Screen Specifications
*   **Salary Dashboard UI:** Card showing Net Pay. Lists planned allocations with toggle switches to manage automated repayments.
*   **Salary Settings UI:** Form grid managing payday cycle frequencies and dates. Shows a calendar detailing upcoming paydays.
*   **Salary Entries UI:** Historic Table logging pay dates, tax deductions, bonuses, and payment modes.

#### 📋 Master AI Screen Codegen Prompt (Income Distribution Flow)
```text
Generate a set of React pages for Salary Management (Salary Dashboard, Cycle Setup, and Allocations).
Theme variables: bg-appBg (#fffaf4 / #1a161f), bg-appCard, text-appText, primary-accent (#f36f56).
1. Salary Dashboard: Elevated top widget showing Net pay. Middle row features progress metrics tracking allocations ("Auto-paid Debt", "Transferred to Savings", "Discretionary Cash"). Below, list active allocations with toggle switches to turn off automated repayments.
2. Salary Setup Form: Configurations grid managing Payday cycle frequencies (Monthly, Weekly) and dates. Left card shows upcoming payout calendars, and right card lists scheduled allocations.
3. Salary Entries Ledger: Historic Table logging pay dates, bonuses, tax deductions, and payment modes.
Apply rounded-xl corners and Manrope typography throughout the screens.
```

---

### Flow 9: Personal Cash Calendars, Forecasts, & Purchase Advisories (Advisory Flow)
Financial simulators modeling purchase feasibility scores, monthly calendar heatmaps, and cash flow charts.

#### 📁 Registered Screen Files
*   [Bills.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/Bills.tsx) — Record listing utility bills.
*   [BillDetail.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/BillDetail.tsx) — Calendar view showing due dates.
*   [RecurringTransactions.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/RecurringTransactions.tsx) — Configuration panel for automated payments.
*   [FinanceCalendar.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/FinanceCalendar.tsx) — Monthly cash flow calendar heatmap.
*   [CashForecast.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/CashForecast.tsx) — Line chart projecting savings.
*   [SpendingInsights.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/SpendingInsights.tsx) — Category trend analysis dashboards.
*   [BudgetRecommendations.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/BudgetRecommendations.tsx) — AI-generated saving tips and category optimizations.
*   [AffordabilityCalculator.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/money/AffordabilityCalculator.tsx) — Scorecard assessing major expense targets.
*   [ScenarioPlanner.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/smart/ScenarioPlanner.tsx) — Compounding calculators projecting repayments.
*   [MoneyHealthScore.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/smart/MoneyHealthScore.tsx) — Financial health summary scorecard.
*   [MonthlyReview.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/smart/MonthlyReview.tsx) — Comparison report.
*   [WhatChanged.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/smart/WhatChanged.tsx) — Trend card isolating expense fluctuations.

#### 🔍 Detailed Screen Specifications
*   **Scenario Simulator UI:** Forms with slider inputs for principal and payback periods, rendering graphs projecting payback costs.
*   **Affordability UI:** Assess inputs, displaying a 0-100 score dial alongside risk alerts.
*   **Heatmap Calendar UI:** Calendar grid where dates are color-coded indicating cash flow projections (green for positive, red for negative).

#### 📋 Master AI Screen Codegen Prompt (Advisory Flow)
```text
Generate a set of React views in Tailwind for Financial Planning (Scenario Simulator, Affordability Scorecard, and Finance Heatmap Calendar).
Theme: Dark tech accents (Background: #1a161f, Card: #25212b, Text: #f5f0eb, Primary: #f36f56).
1. Scenario Simulator: Form with range slider inputs for Loan Principal, Interest Rate, and payback period. Right pane renders comparative graphs projecting compound payback costs.
2. Affordability Calculator: Dynamic inputs assessing purchase details. Displays an "Affordability Score" dial (0-100) alongside advisories ("Warning: This purchase will increase debt-to-income limits above 40%" inside warning cards).
3. Finance Heatmap Calendar: Grid calendar layout. Each date cell is color-coded indicating financial events: green for income events, orange for due dates, and red for negative projections.
Ensure rounded-2xl cards and Manrope typography.
```

---

### Flow 10: Administrative Settings, Custom Reminders SMTP, & Encrypted Backups (Admin Flow)
Managing user profile data, setting secure preferences, exporting PDF reports, and SQLite database backup zip packaging.

#### 📁 Registered Screen Files
*   [Settings.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/settings/Settings.tsx) — Central hub routing to administrative settings.
*   [Profile.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/settings/Profile.tsx) — Personal information form.
*   [Security.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/settings/Security.tsx) — Passcode and security configuration forms.
*   [ReminderSettings.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/settings/ReminderSettings.tsx) — Threshold settings managing follow-up alerts.
*   [EmailSettings.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/settings/EmailSettings.tsx) — SMTP setup details.
*   [EmailLogs.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/settings/EmailLogs.tsx) — Table listing historical emails sent to debtors.
*   [SendEmail.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/settings/SendEmail.tsx) — Template messaging tool.
*   [BackupRestore.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/settings/BackupRestore.tsx) — SQLite backup zip packaging tool.
*   [PrivacyMode.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/settings/PrivacyMode.tsx) — Toggle controlling visibility of numbers.
*   [Reports.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/reports/Reports.tsx) — Document exporter.
*   [ReportDetail.tsx](file:///Users/abuzar/Desktop/LoanTracker/web-app/src/pages/reports/ReportDetail.tsx) — Live visual spreadsheet details.

#### 🔍 Detailed Screen Specifications
*   **Settings Hub UI:** Sidebar checklist layout grouping Profile, Security, SMTP setups, and Database backplate.
*   **Statement Compiler UI:** Card displaying date ranges and export formats (PDF statement, Excel ledger).
*   **SQL Backup UI:** Action cards to "Export Encrypted SQLite Database". Below, render historical backup tables.

#### 📋 Master AI Screen Codegen Prompt (Admin Flow)
```text
Generate a set of React settings and backup views inside a Tailwind grid (Settings Center, Statement Compiler, and SQLite Backup Manager).
Theme: Background: --background, Cards: --card, Text: --text.
1. Settings Center: Sidebar checklist panel organizing sections: Profile, Security, Notification Intervals, Email SMTP templates, and SQL Vault. Active panels display clean input forms.
2. Statement Compiler: Card displaying date ranges and export formats (PDF statement, Excel ledger). Below, list download history tables with share and download icons.
3. SQL Backup: Action cards to "Export Encrypted SQLite Database". Below, render historical backup tables. Clicking "Restore" launches a confirmation dialogue prompting security passwords.
Ensure rounded-xl borders for inputs, and Manrope fonts.
```

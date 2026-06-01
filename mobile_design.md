# Mobile Application Visual Architecture, Component Catalog, and AI Prompt Library

This document provides a detailed visual analysis of the Personal Finance & Loan Tracker mobile client (React Native / Expo). It aligns the visual tokens of the application's implementation with the global design blueprints. It reconciles color palettes, layout tokens, and typography between the primary design system in `fintech_design_system_and_ai_prompts.md` and the actual codebase parameters in `mobile/src/utils/theme.ts`.

Additionally, it provides high-fidelity, ready-to-copy generation prompts for each of the 18 custom components and the 10 screen modules, making it simple to generate matching interfaces using tools like Stitch, Lovable, Bolt.new, or v0.

---

## 🎨 Global Design System: Alignment & Reconciliation

Below is a detailed analysis and reconciliation of the design tokens defined in the master design specification (`fintech_design_system_and_ai_prompts.md`) versus the actual implementation configuration (`mobile/src/utils/theme.ts`).

### 1. Color Palette Comparison & Alignment

The mobile client implementation departs from the generic blue/slate blueprint specification to offer a custom, cozy terracotta, warm peach, and mint-emerald theme, creating a highly premium, tactile experience. Below is the direct reconciliation:

| Token / Usage | Blueprint Specification (`fintech_design_system_and_ai_prompts.md`) | Codebase Implementation (`theme.ts`) | Tone Style | Semantic Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `#2563EB` | `#f36f56` (Light) / `#f36f56` (Dark) | Cozy Coral / Peach Accent | Branding highlights, primary buttons, active states |
| **Primary Dark** | — | `#d95441` (Light) / `#d95441` (Dark) | Deep Terracotta | Active press states, gradients |
| **Success** | `#16A34A` | `#1b7d62` (Light) / `#d9f1d7` (Dark) | Emerald Teal / Soft Mint | Positive flows, completed loans, receivables ("Mujhe Lene Hain") |
| **Warning** | `#F59E0B` | `#8a6d1f` (Light) / `#ffd56a` (Dark) | Muted Gold / Warm Yellow | Pending items, partial payments, warning badges |
| **Danger** | `#DC2626` | `#d95441` (Light) / `#f36f56` (Dark) | Terracotta Red / Coral | Overdue alerts, payables ("Mujhe Dene Hain") |
| **Background** | `#F8FAFC` | `#fffaf4` (Light) / `#1a161f` (Dark) | Cozy Cream / Dark Eggplant | Main screen canvas background |
| **Background Soft**| — | `#fff7ef` (Light) / `#25212b` (Dark) | Soft Cream / Deep Plum | Input fields, sub-headers, lists background |
| **Card** | `#FFFFFF` | `#ffffff` (Light) / `#25212b` (Dark) | Pure White / Deep Plum | Widget containers, cards, dialog popups |
| **Border** | `#E2E8F0` | `rgba(80, 61, 52, 0.14)` (Light) / `rgba(255, 255, 255, 0.08)` (Dark) | Warm Clay / Muted Divider | Outlines, dividers, grid borders |
| **Muted** | `#64748B` | `#6f6577` (Light) / `#a89fb0` (Dark) | Slate Purple / Muted Lilac | Subtitles, helper text, descriptive labels |
| **Text** | `#0F172A` | `#25212b` (Light) / `#f5f0eb` (Dark) | Charcoal Eggplant / Warm Cream | Main legible content, headers |

> [!NOTE]
> The codebase implementation splits background and primary colors into explicit Light/Dark variants, adding utility helper colors like `Background Soft` (`#fff7ef` / `#25212b`) to add layer depth behind dashboard cards.

### 2. Typography & Fonts Reconciliation

While the design blueprint recommends using `Inter` or `Outfit` fonts, the live application codebase leverages `Manrope` for its clean, geometric characteristics. Both approaches map to identical geometric weighting systems, making it straightforward to swap them in high-fidelity builders:

| Weight Class | Blueprint Font Target (`Inter` / `Outfit`) | Codebase Font Target (`Manrope`) | Font Constant in Codebase | Common Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **Regular (400)** | `Inter-Regular` / `Outfit-Regular` | `Manrope_400Regular` | `fontFamily.regular` | Body text, input values, log dates |
| **Medium (500)** | `Inter-Medium` / `Outfit-Medium` | `Manrope_500Medium` | `fontFamily.medium` | Form labels, helper text, subtitles |
| **Semi-Bold (600)** | `Inter-SemiBold` / `Outfit-SemiBold` | `Manrope_600SemiBold` | `fontFamily.semiBold` | Card titles, action texts, navigation items |
| **Bold (700)** | `Inter-Bold` / `Outfit-Bold` | `Manrope_700Bold` | `fontFamily.bold` | Primary metrics, CTA buttons, totals |
| **Extra Bold (800)**| `Inter-Black` / `Outfit-Black` | `Manrope_800ExtraBold` | `fontFamily.extraBold` | Main screen titles, large amounts, status pills |

*   **Letter Spacing:** Extra-bold weights use tight letter spacing on headers, balanced by regular/medium weights on descriptions.
*   **Font Loading Strategy:** In both configurations, these fonts are loaded dynamically during application startup via Google Fonts, showing a splash screen until assets are ready.

### 3. Layout, Borders, & Shadow Continuity

*   **Border Radius Continuity:** The blueprint specification recommends standard parameters: `rounded-xl` (12px) for native text fields and inputs, and `rounded-2xl` (16px) for dashboard widgets. The live codebase implements an even softer look, customizing `tailwind.config.js` to override default border-radii: `rounded-lg` is configured as `24px` for inputs and secondary cards, `rounded-xl` is configured as `28px` for modular widgets and dashboard cards, and `rounded-2xl` is configured as `32px` for main panels. `rounded-full` (999px) is used for pill buttons and status badges.
*   **Shadow Specs Comparison:**
    *   *Blueprint Specs:* Soft offsets `{ width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12`.
    *   *Codebase Specs (`shadowSoft`):*
        *   **Light:** shadowColor: `#583020` (`warmShadow`), shadowOpacity: `0.08`, shadowRadius: `24`, offset `{ width: 0, height: 4 }`, elevation `4`.
        *   **Dark:** shadowColor: `#000000`, shadowOpacity: `0.28`, shadowRadius: `24`, offset `{ width: 0, height: 4 }`, elevation `4`.
    *   *Codebase Specs (`shadowElevated`):*
        *   **Light:** shadowColor: `#583020` (`warmShadow`), shadowOpacity: `0.12`, shadowRadius: `40`, offset `{ width: 0, height: 12 }`, elevation `8`.
        *   **Dark:** shadowColor: `#000000`, shadowOpacity: `0.40`, shadowRadius: `40`, offset `{ width: 0, height: 12 }`, elevation `9`.

---

## 🏛️ Comprehensive Component Analysis & AI Prompt Library

Below is a detailed analysis of the 18 custom components in `mobile/src/components`. Each includes a code generation prompt that incorporates the reconciled styling tokens.

### 1. `AmountText.tsx`
*   **Purpose & UX Value:** Dynamically formats numerical values to currency layouts. Integrates with the `PrivacyProvider` context to mask sensitive amounts with placeholders like `Rs. ****` without altering parent component calculations.
*   **Key Props & Custom Behavior:** `amount` (raw number), `value` (pre-formatted string), `prefix`, `suffix`, `hiddenLabel`, `privacyScope`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Native / Expo AmountText component styled with NativeWind. It takes props: amount (number), value (string), prefix (string), suffix (string), hiddenLabel (string, default "Rs. ****"), and privacyScope ('DASHBOARD' | 'EVERYWHERE'). It must consume a usePrivacy() context exposing settings.privacyModeEnabled and amountsHidden. When active, it displays hiddenLabel. When inactive, it formats numbers into clean currency formats (PKR/USD). Use Manrope_700Bold (or Inter-Bold), supporting custom text props like color and size.
    ```

### 2. `AppButton.tsx`
*   **Purpose & UX Value:** Main touch interactive button. Features built-in loading spinners, custom icons, and active scaling press animations.
*   **Key Props & Custom Behavior:** `title`, `onPress`, `loading`, `disabled`, `variant` (`primary`, `secondary`, `danger`, `ghost`), `icon` (Lucide icon).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a premium React Native / Expo AppButton component. It supports variant props: 'primary' (solid primary color, rounded-full pill shape), 'secondary' (bordered card tone), 'danger' (accent dark red), and 'ghost' (transparent). It accepts custom LucideIcon inputs and renders an ActivityIndicator spinner when loading is true. Customize touch feedback using activeOpacity={0.85} and style with a soft elevation shadow on the primary variant. Set the minimum height to 50px, border-radius to 999px (full pill), and typography using Manrope_700Bold (or Inter-Bold).
    ```

### 3. `BrandLogo.tsx`
*   **Purpose & UX Value:** Renders the central product identity logo inside a card container to maintain brand consistency.
*   **Key Props & Custom Behavior:** `size` (dimensions), `elevated` (boolean to toggle soft card shadows).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Native BrandLogo component. It accepts a size parameter (default 64) and an elevated boolean. It wraps the logo image in a square container with a border-radius calculated dynamically as size * 0.24. Ensure the background color matches the card theme (#ffffff in light, #25212b in dark) with a 1px border. If elevated is true, apply a soft, elegant card shadow.
    ```

### 4. `DatePickerField.tsx`
*   **Purpose & UX Value:** Standardizes date entries using a touchable field that launches the system calendar modal.
*   **Key Props & Custom Behavior:** `label`, `value` (Date), `onChange`, `error`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a DatePickerField component in React Native Expo. It features a form label styled in Manrope_600SemiBold (or Inter-SemiBold), and a touchable selector box that displays the formatted date and a Lucide calendar icon on the right. When tapped, it triggers the native DateTimePicker modal. If validation errors exist, highlight the border in soft red (#d95441 in light, #f36f56 in dark) and render the error text below the input field.
    ```

### 5. `FormInput.tsx`
*   **Purpose & UX Value:** Primary text entry field. Handles focus borders, validation error indicators, and secure-eye toggles.
*   **Key Props & Custom Behavior:** `label`, `error`, `icon` (prefix Lucide), `secureTextEntry` (password toggle).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a robust FormInput component in React Native. It handles focus state by changing the border color to the primary theme color. It supports prefix icons and an interactive suffix eye icon if secureTextEntry is active, allowing toggling of password text visibility. Render error messages in soft crimson (#d95441 in light, #f36f56 in dark) and handle input text colors dynamically across light and dark backgrounds.
    ```

### 6. `FormSelect.tsx`
*   **Purpose & UX Value:** Form dropdown selector trigger, standardizing selection fields with custom option sheets.
*   **Key Props & Custom Behavior:** `label`, `value`, `options`, `onSelect`, `error`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Native FormSelect input field. When the selector container is tapped, display a beautiful slide-up bottom sheet modal showing the selectable options. The active option should show a subtle checkmark. Handle empty states gracefully. Apply rounded-2xl (16px) corners and a 1px border.
    ```

### 7. `LoanCard.tsx`
*   **Purpose & UX Value:** Core dashboard summary card displaying loan metrics, paid progress, status labels, and balance limits.
*   **Key Props & Custom Behavior:** `loan` (loan payload object), `onPress`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a beautiful React Native LoanCard component using NativeWind styling. The card must have a border-radius of 28px, 1px border, card background, and a soft elevation shadow. Show the borrower's name and issue date on the left, and loan type and status badges on the right. Below, place a progress percentage, a remaining amount text ('Baqi Raqam Rs. ****' when privacy is on), and a horizontal progress bar. At the bottom, render the total loan amount and total paid amount side-by-side. Support dark theme adaptations.
    ```

### 8. `MoneySummaryCard.tsx`
*   **Purpose & UX Value:** Central widget displaying receivables and payables in Roman Urdu.
*   **Key Props & Custom Behavior:** `receivables`, `payables`, `onPressReceivables`, `onPressPayables`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Native MoneySummaryCard component. It contains two equal-width columns split by a thin vertical divider. The left column displays the label "Mujhe Lene Hain" and the total receivables amount in success green. The right column displays "Mujhe Dene Hain" and the payables amount in danger red. Wrap both columns in a rounded-3xl container with soft shadows. Ensure currency values support privacy blurring.
    ```

### 9. `PinKeypad.tsx`
*   **Purpose & UX Value:** Renders a secure, visual 3x4 grid for lock-screen PIN validation.
*   **Key Props & Custom Behavior:** `onPress` (returns digit), `onDelete`, `onClear`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Generate a React Native PinKeypad component for security entry. It renders a clean 3x4 grid containing rounded number keys (0-9) alongside "Clear" and delete (backspace) keys. Buttons should have active click scales and transparent backgrounds, using Manrope_700Bold.
    ```

### 10. `PlanningCards.tsx`
*   **Purpose & UX Value:** Aggregates and renders lists of financial items in cards for simulation modules.
*   **Key Props & Custom Behavior:** `title`, `description`, `metrics` (array), `onPress`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Native PlanningCards visual widget. It displays a scenario title, detailed description, a grid of dynamic test metrics, and a "Run Simulation" bottom button in a rounded-3xl container.
    ```

### 11. `ProgressBar.tsx`
*   **Purpose & UX Value:** Renders a thin percentage bar representing outstanding debt repayment completions.
*   **Key Props & Custom Behavior:** `progress` (number percentage).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a simple ProgressBar component in React Native. It renders an outer track with height 8px, full rounded edges, and background-soft tone. The inner bar scales dynamically using the progress percentage prop, colored in success green.
    ```

### 12. `Screen.tsx`
*   **Purpose & UX Value:** Root wrapper for all screens. Controls safe areas, keyboard visibility behaviors, and gradient backgrounds.
*   **Key Props & Custom Behavior:** `children`, `scrollable`, `hasHeader`, `onBackPress`, `title`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a master Screen wrapper component in React Native Expo. It integrates KeyboardAvoidingView, SafeAreaView, and dynamic background colors that switch between light and dark modes. It supports an optional scrollable container and an optional back-navigation header bar with a back button and title in Manrope_800ExtraBold.
    ```

### 13. `SensitiveText.tsx`
*   **Purpose & UX Value:** Parses text structures, masking any found currency patterns when privacy mode is active.
*   **Key Props & Custom Behavior:** `children` (string), `privacyScope`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Native SensitiveText component that wraps regular text values. If privacy mode is on, use regex to identify currency patterns (e.g. "Rs. 10,000") and mask them with "Rs. ****" while leaving unrelated text readable.
    ```

### 14. `StateViews.tsx`
*   **Purpose & UX Value:** Standardizes display interfaces during network updates, empty lists, or errors.
*   **Key Props & Custom Behavior:** `type` (`loading` | `empty` | `error`), `message`, `onRetry`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Native StateViews component that takes status type ('loading' | 'empty' | 'error') and displays custom vector animations or Lucide icons, message text in Manrope_500Medium, and a retry action button on errors.
    ```

### 15. `StatusBadge.tsx`
*   **Purpose & UX Value:** Semantic indicator tagging loan properties, payments, and system states.
*   **Key Props & Custom Behavior:** `value` (database code).
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Native StatusBadge. It translates database status codes to clean English or Roman Urdu labels (e.g., GIVEN to "Mujhe Lene Hain", COMPLETED to "Completed"). Set backgrounds to success green, warning yellow, or primary blue bases based on the status value.
    ```

### 16. `SummaryCard.tsx`
*   **Purpose & UX Value:** Compact grid elements displaying dashboard totals.
*   **Key Props & Custom Behavior:** `label`, `value`, `tone`, `icon`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a modular 2-column SummaryCard widget in React Native. It renders a clean rounded-3xl container, displaying a large top Lucide icon inside a colored square, a bold label in uppercase, and the main metric value below.
    ```

### 17. `TimePickerField.tsx`
*   **Purpose & UX Value:** Interactive visual trigger field for picking specific times.
*   **Key Props & Custom Behavior:** `label`, `value`, `onChange`, `error`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Create a React Native TimePickerField. Renders a form input layout with a clock icon on the right, triggering the platform's time picker on click. Include validation highlighting.
    ```

### 18. `TransactionCard.tsx`
*   **Purpose & UX Value:** Horizontal row representing cash flows. Displays categories, payment channels, dates, user notes, and masked values.
*   **Key Props & Custom Behavior:** `transaction` (transaction payload), `onPress`.
*   **Master AI UI Codegen Prompt:**
    ```text
    Generate a detailed TransactionCard component in React Native Expo using NativeWind. It features a rounded-3xl container, showing a transaction type icon on the left (inflow/outflow arrows). Display the transaction name, relative date, payment method, auto-generated tag badge, and amount formatted with prefix +/- (colored green on inflows, red on outflows).
   ## 🏛️ Comprehensive Screen Analysis & AI User Journey Library

The 115 screen files registered in `mobile/src/navigation/RootNavigator.tsx` are structured into **10 cohesive, step-by-step User Journey Flows**. Instead of isolated pages, these prompts ensure that UI components, states, and variables flow consistently between screens in each workflow.

---

### Flow 1: Safe Onboarding, Identity, & App Lock Setup (First-Time User Journey)
This flow represents a new user opening the app for the very first time. They register, log in, configure their secure PIN, complete the walkthrough onboarding, and handle subsequent secure startups.

#### 📁 Registered Screen Files
*   `src/screens/auth/RegisterScreen.tsx` — Registration wizard capturing name, phone, email, and validations.
*   `src/screens/auth/LoginScreen.tsx` — Secure validation portal yielding access tokens.
*   `src/screens/security/SetPinScreen.tsx` — Wizard forcing secure 4-digit access code configuration.
*   `src/screens/onboarding/OnboardingScreen.tsx` — Multi-step visual walkthrough explaining credit terms and privacy masking.
*   `src/screens/security/UnlockScreen.tsx` — Startup security overlay blocking app visibility until PIN is confirmed.
*   `src/screens/security/SecuritySettingsScreen.tsx` / `ChangePinScreen.tsx` — Preferences panel managing biometrics, lock timers, and passcode updates.

#### 📋 Master AI Screen Codegen Prompt (First-Time User Journey)
```text
Generate a set of interconnected React Native / Expo screens using NativeWind for Onboarding & Security (Register, Login, Set PIN, Onboarding Carousel, and Unlock PIN).
Theme Configuration: Supports Cozy Cream light mode (Background: #fffaf4, Cards: #ffffff, Text: #25212b, Primary: #f36f56) and Dark mode (Background: #1a161f, Cards: #25212b, Text: #f5f0eb, Primary: #f36f56).
1. Registration Screen: Welcome header in Manrope_800ExtraBold. Contains form inputs (Name, Phone, Email, Password) with prefix Lucide icons. Form validations trigger red-orange borders (#d95441). Tap "Register" to navigate to Set PIN.
2. Set PIN Screen: Minimalist interface. Prompts "Create secure 4-digit app PIN" with 4 bubble status indicators. Center a 3x4 tactile PinKeypad component. Once 4 digits are typed, save PIN, and navigate to Onboarding.
3. Onboarding Screen: A 3-slide horizontal slider explaining Urdu financial terms ("Mujhe Lene Hain" and "Mujhe Dene Hain") and the Privacy Mode toggle. A bottom "Get Started" primary pill button logs onboarding completed and redirects to Dashboard.
4. PIN Unlock Screen: Overlay layout triggered on app startup. Displays user avatar, a lock icon, 4 bubble indicators, and a tactile PinKeypad. If verification fails, shake bubbles and flash them in danger red (#d95441).
5. Security Settings: Sub-list under Settings allowing users to toggle biometric auth (FaceID/TouchID), customize sleep lock timeouts, and navigate to the Change PIN screen.
Maintain a warm, terracotta/coral accent tone, rounded-lg (24px) containers, and clean Manrope typography throughout the flow.
```

---

### Flow 2: Core Debtor Directory & Net Outstanding Ledger (Bilateral Trust Flow)
The journey of managing debtors and creditors, creating new profiles, viewing net outstanding positions, and reviewing trust history.

#### 📁 Registered Screen Files
*   `src/screens/contacts/ContactsScreen.tsx` — Directory displaying favorites, search filters, and total outstanding balances.
*   `src/screens/contacts/ContactFormScreen.tsx` — Entry form creating/editing debtor information.
*   `src/screens/contacts/ContactDetailScreen.tsx` — Contact profile hub detailing total balances and quick-action shortcuts.
*   `src/screens/contacts/ContactLedgerScreen.tsx` — Segmented transactional history of all payments and loans.
*   `src/screens/contacts/ContactTrustReportScreen.tsx` — Behavioral audit card tracking promptness, late rates, and rating scores.
*   `src/screens/contacts/ContactLoanProfileScreen.tsx` / `ContactRelationshipSettingsScreen.tsx` — Overdue limits and follow-up configurations.
*   `src/screens/communications/CommunicationTimelineScreen.tsx` — Chronological log of phone calls, reminders, and alerts sent.

#### 📋 Master AI Screen Codegen Prompt (Bilateral Trust Flow)
```text
Generate a set of React Native / Expo screens using NativeWind and Lucide icons for Contacts Management (Directory, Add Contact, Detail, Ledger, and Trust Report).
Theme colors: Background: #fffaf4 (Light) / #1a161f (Dark), Cards: #ffffff (Light) / #25212b (Dark), Text: #25212b (Light) / #f5f0eb (Dark).
1. Contacts Directory: Header with a search bar and filter pills. Horizontal scrolling slider displaying favorite contacts with circular avatars and names. Below, a vertical scroll list of contacts. Each contact row displays an avatar, name in Manrope_700Bold, a net outstanding balance, and a success green (#1b7d62) "Mujhe Lene Hain" or danger red (#d95441) "Mujhe Dene Hain" status badge. Floating action button (+) navigates to Contact Form.
2. Contact Form: Form fields for Name, Phone, Email, Max Credit Limit, and Follow-up Frequency. Save button navigates back to Contacts.
3. Contact Detail Screen: Elevated top card showing Name, Net Balance, and Trust Rating stars. Quick Action buttons: Call, Reminder (navigates to templates), Log Transaction (navigates to loan/payment forms), and Settings (navigates to Relationship Settings).
4. Contact Ledger Screen: 3-tab segmented slider ("All Transactions", "Loans", "Repayments") displaying transaction items using custom TransactionCard components (showing arrows, amounts, and dates).
5. Contact Trust Report Screen: Displays circular radial dial of debtor's reliability score (0-100%). Details promptness ratings, counts of broken promises, and dynamic credit limit warnings.
Maintain consistent rounded-xl (28px) widgets and Manrope fonts.
```

---

### Flow 3: Loan Registration & Installment Amortization (Bilateral Lending Flow)
The workflow for initiating loans, choosing amortization parameters, compiling schedules, and tracking overdue installment cycles.

#### 📁 Registered Screen Files
*   `src/screens/loans/LoansScreen.tsx` — Loan hub segmented into active, closed, and overdue listings.
*   `src/screens/guidance/GuidedLoanWizardScreen.tsx` — Visual step-by-step wizard assisting beginners with loan setups.
*   `src/screens/loans/LoanFormScreen.tsx` — Advanced form registering custom interest rates, issue dates, and terms.
*   `src/screens/loans/LoanDetailScreen.tsx` — Loan center tracking principal, paid progress indicators, and amortization tables.
*   `src/screens/loans/InstallmentScheduleScreen.tsx` — Detailed ledger displaying installment amounts, due dates, and paid indicators.
*   `src/screens/loans/UpcomingInstallmentsScreen.tsx` / `AdvancedLoanFilterScreen.tsx` — Calendar timeline and filtering configurations for due items.
*   `src/screens/loans/InterestBreakdownScreen.tsx` — Interactive breakdowns of compound/simple interest structures.

#### 📋 Master AI Screen Codegen Prompt (Bilateral Lending Flow)
```text
Generate a set of React Native / Expo screens using NativeWind for Loan Management (Loans Dashboard, Guided Wizard, Advanced Form, Loan Detail, and Installment Schedule).
Theme: Background: #fffaf4 (Light) / #1a161f (Dark), Card: #ffffff (Light) / #25212b (Dark), Primary: #f36f56, Success: #1b7d62, Danger: #d95441.
1. Loans Dashboard: Segmented tabs ("Active", "Overdue", "Settled"). Renders lists of outstanding loans using LoanCard components (displaying progress bars, issue dates, outstanding baqi raqam, and borrower names).
2. Guided Loan Wizard: Step-by-step form layout. Step 1: Select Contact; Step 2: Set Amount & Type (Lene Hain / Dene Hain); Step 3: Choose Frequency (Weekly, Monthly). Includes visual illustrations for each step.
3. Advanced Loan Form: Custom dropdown picker for contacts, numerical inputs for Principal Amount and Interest Rate (%), DatePickerField for Issue Date, and a repayment segment controller. Displays a real-time amortization preview box at the bottom.
4. Loan Detail Screen: Elevated summary card with a large paid-percentage progress bar, displaying principal vs interest. Underneath, a vertical timeline of upcoming installments with status badges ("Paid", "Pending", "Overdue"). Bottom CTA buttons: "Log Repayment" (navigates to Payment Form) and "Net Settlement".
5. Installment Schedule: Complete tabular breakdown listing Installment #, Due Date, Principal Component, Interest Component, and a toggle status button.
Ensure privacy masking is supported for sensitive balances, using Manrope typography.
```

---

### Flow 4: Payment Execution, Bilateral Settlements, & PDF Receipts (Cash Repayment Flow)
The workflow of logging cash/digital payments, capturing receipt slips, performing netting balance calculations, and exporting signed statements.

#### 📁 Registered Screen Files
*   `src/screens/payments/PaymentFormScreen.tsx` — Advanced repayment form linking to active loans.
*   `src/screens/payments/QuickAddPaymentScreen.tsx` — Fast floating action modal to log simple payments.
*   `src/screens/settlements/SettlementConfirmationScreen.tsx` — Bilateral netting engine reconciling bilateral balances.
*   `src/screens/settlements/SettlementReceiptPreviewScreen.tsx` — Final transaction slip complete with signed digital logs.
*   `src/screens/receipts/ReceiptHistoryScreen.tsx` / `ReceiptPreviewScreen.tsx` — Image capture, invoice cropping, and OCR receipt histories.

#### 📋 Master AI Screen Codegen Prompt (Cash Repayment Flow)
```text
Generate a set of React Native / Expo screens for Cash Repayments & Settlements (Payment Form, Bilateral Settlement Confirmation, Settlement Receipt Preview, and Receipt Capture History).
Theme: Background: #fffaf4 (Light) / #1a161f (Dark), Primary: #f36f56, Success: #1b7d62, Card: #ffffff (Light) / #25212b (Dark).
1. Payment Form Screen: Dropdown selector linking active outstanding loans. Numeric keypad input for Repayment Amount. Segmented buttons for Payment Method (Cash, Bank Transfer, EasyPaisa/JazzCash). Visual container for "Attach Receipt Photo" triggering the camera; displays a thumbnail with a delete button once selected.
2. Bilateral Settlement Screen: Compiles debt reconciliation. Two columns: "Receivables from Ali" vs "Payables to Ali". Compiles netting in a central card ("Ali owes you net Rs. 20,000. Settle all open items?"). "Confirm & Settle" button launches a signature overlay.
3. Settlement Receipt Preview: Simulates a printable visual slip. Displays transaction ID, timestamps, netted items, and digital signatures. Bottom CTA: "Export PDF" or "Share Statement".
4. Receipt History Screen: Grid layout showing previously uploaded receipt photos, supporting full-screen zoom and cropping utilities.
Ensure clean transitions, rounded-xl (28px) widgets, and Manrope_700Bold headers.
```

---

### Flow 5: Voice Assistant & Smart Natural Language Transaction Logging (AI Intake Flow)
The intake journey enabling users to dictate/type Roman Urdu commands, review parsed transaction details, and audit entries.

#### 📁 Registered Screen Files
*   `src/screens/voiceEntry/VoiceEntryScreen.tsx` — Technology layout catching mic signals and showing audio wave shapes.
*   `src/screens/smartEntry/SmartTextEntryScreen.tsx` — Text dashboard processing natural language entries.
*   `src/screens/smartEntry/ParsedEntryConfirmationScreen.tsx` — Reconciling parsed structures before database commits.
*   `src/screens/assistant/FinanceAssistantScreen.tsx` — Interactive AI conversational assistant chat module.
*   `src/screens/smartEntry/SmartEntryHistoryScreen.tsx` / `WhatChangedScreen.tsx` — Logging AI inputs and checking manual audits.

#### 📋 Master AI Screen Codegen Prompt (AI Intake Flow)
```text
Generate a set of React Native / Expo screens for AI Intake (Voice Entry, Smart Text Entry, Parsed Confirmation, and Finance Assistant Chat).
Theme: Dark tech appearance (Background: #1a161f, Card: #25212b, Text: #f5f0eb, Primary: #f36f56).
1. Voice Entry Screen: Minimalist interface. Features a large central microphone icon surrounded by a circular, pulsating SVG wave animation that scales when recording. Real-time text box displaying Roman Urdu transcripts ("Mene Ali ko 5,000 PKR diye"). Bottom list displays prompt suggestions. Tap "Parse Voice" to navigate to Parsed Confirmation.
2. Smart Text Entry: Multi-line text field allowing users to type natural language sentences. Explains extraction details with a list of historical entries below.
3. Parsed Entry Confirmation: Card displaying parsed parameters in input fields for manual corrections: Contact Name, Amount, Transaction Type (Loan Given / Payment Received), and Due Date. Tapping "Confirm & Save" commits to DB and returns to Dashboard.
4. Finance Assistant Screen: Dynamic chat window interface. Support text inputs and voice buttons. Displays responses in structured blocks (displaying tables or charts for budget/savings queries).
Ensure rounded-2xl (32px) container layouts and Manrope typography throughout the interface.
```

---

### Flow 6: Urgent Alerts, Urdu Templates, & Payment Commitments (Follow-up Flow)
The follow-up process where users track overdue notices, customize reminder templates in Roman Urdu, and record promise dates.

#### 📁 Registered Screen Files
*   `src/screens/alerts/AlertsCenterScreen.tsx` / `AlertDetailScreen.tsx` — Notification logs reporting overdue statuses and warnings.
*   `src/screens/reminderTemplates/ReminderTemplatesScreen.tsx` — Category lists of Urdu template notices.
*   `src/screens/reminderTemplates/CreateEditReminderTemplateScreen.tsx` — Text editor with key token inject buttons.
*   `src/screens/promises/PromisesScreen.tsx` / `AddPromiseScreen.tsx` — Visual meters tracking payment dates and broken promises.
*   `src/screens/followUps/FollowUpTimelineScreen.tsx` / `RecoveryCenterScreen.tsx` — Pipeline analytics dashboard tracking debtor follow-up steps.
*   `src/screens/reminders/ReminderSettingsScreen.tsx` / `ReminderLogsScreen.tsx` / `LoanReminderSettingsScreen.tsx` — Alert intervals, logs, and contact configurations.

#### 📋 Master AI Screen Codegen Prompt (Follow-up Flow)
```text
Generate a set of React Native / Expo screens for Follow-ups (Alerts Center, Reminder Template Creator, Promise Tracker, and Recovery Pipeline).
Theme: Background: #fffaf4 (Light) / #1a161f (Dark), Primary: #f36f56, Danger: #d95441, Muted: #6f6577.
1. Alerts Center Screen: Top segment filters ("All", "Overdue", "Broken Promises"). Vertical feed of warnings (e.g. "Ali is 3 days overdue"). Cards feature right-hand actions: "Settle" or "Send WhatsApp Reminder" (navigates to templates).
2. Create Reminder Template: Renders text editor area to customize Roman Urdu templates. Below the editor, a grid of token insert buttons: "[Debtor Name]", "[Baqi Raqam]", "[Due Date]". Displays real-time template preview card at the bottom.
3. Promise Tracker Screen: Segmented columns for "Kept Promises" vs "Broken Promises". Tapping (+) opens Add Promise Screen, displaying forms for Date, Time, Amount, and Trust penalties.
4. Recovery Center Pipeline: Analytics board visualizing debtor status steps ("Notified", "Promised", "Late", "Bilateral Mediation").
Maintain rounded-lg (24px) containers and clean Manrope fonts.
```

---

### Flow 7: Expense Tracking, Cash Budgets, & Savings Targets (Daily Money Flow)
The personal expense dashboard where users record cash outflows/inflows, construct category budgets, and save money toward goals.

#### 📁 Registered Screen Files
*   `src/screens/money/MoneyDashboardScreen.tsx` — Personal dashboard tracking balances, cash inflows, and category trends.
*   `src/screens/transactions/TransactionsScreen.tsx` / `TransactionDetailScreen.tsx` — Categorized ledger details.
*   `src/screens/transactions/AddTransactionScreen.tsx` (`AddExpenseScreen` / `AddIncomeScreen`) — Form overlays logging cash flow entries.
*   `src/screens/budget/BudgetScreen.tsx` / `AddEditBudgetScreen.tsx` / `BudgetRecommendationsScreen.tsx` — Category budgets and limits.
*   `src/screens/savings/SavingsGoalsScreen.tsx` / `AddEditSavingsGoalScreen.tsx` / `AddSavingsProgressScreen.tsx` — Goal trackers and deposit sheets.
*   `src/screens/bills/BillsScreen.tsx` / `AddEditBillScreen.tsx` / `BillDetailScreen.tsx` / `MarkBillPaidScreen.tsx` — Utility bills tracker.
*   `src/screens/recurring/RecurringTransactionsScreen.tsx` / `AddEditRecurringTransaction.tsx` — Auto-transaction settings.

#### 📋 Master AI Screen Codegen Prompt (Daily Money Flow)
```text
Generate a set of React Native / Expo screens for Personal Wealth (Money Dashboard, Add Expense, Budget Planner, Savings Goals, and Bills Ledger).
Theme: Cozy Cream/Charcoal Mode (Background: #fffaf4 / #1a161f, Card: #ffffff / #25212b, Text: #25212b / #f5f0eb, Success: #1b7d62, Danger: #d95441).
1. Money Dashboard: Top card showing net worth and monthly cash flow. Horizontal trend line chart. Grid displaying category spending cards (Food, Shopping, Utilities) with circular icons.
2. Add Expense Form: Large currency input display. Categorized list selectors, account selector (Cash, Bank, Card), and tags.
3. Budget Planner Screen: Category rows with active progress bars comparing spent vs limit. Green progress lines turn terracotta-red (#d95441) when budget limits are exceeded. Includes an "AI Recommendations" button.
4. Savings Goals Screen: Grid of progress rings depicting savings achievements. Clicking a goal displays detail overlays and deposit inputs.
5. Bills Ledger: List of due utilities with countdown badges ("Due in 2 days"). Features a "Mark Paid" trigger.
Ensure clean Manrope typography and customized rounded-xl (28px) border-radii throughout the flow.
```

---

### Flow 8: Salary Cycle, Deductions, & Paycheck Allocations (Income Allocation Flow)
The payroll portal tracking salary dates, paycheck countdown timers, and auto-paying loan installments directly from incoming salary.

#### 📁 Registered Screen Files
*   `src/screens/salary/SalaryDashboardScreen.tsx` — Payroll dashboard tracking baseline incomes, allocations, and cycle indicators.
*   `src/screens/salary/SalarySetupScreen.tsx` / `SalarySettingsScreen.tsx` — Configures baseline pays, cycle frequencies, and payroll dates.
*   `src/screens/salary/SalaryCycleDetailScreen.tsx` — Circular progress ring counting days until paydays.
*   `src/screens/salary/MarkSalaryReceivedScreen.tsx` — Interactive checklist to log paycheck entries and trigger auto-allocations.
*   `src/screens/salary/SalaryAllocationScreen.tsx` / `AddEditAllocationScreen.tsx` — Slider widgets mapping direct deductions from salaries to loan balances.
*   `src/screens/salary/SalaryEntriesScreen.tsx` / `SalaryEntryDetailScreen.tsx` — Salary receipt logs.

#### 📋 Master AI Screen Codegen Prompt (Income Allocation Flow)
```text
Generate a set of React Native / Expo screens using NativeWind for Salary Allocation (Salary Dashboard, Salary Setup, Salary Cycle Details, and Mark Received Checklist).
Theme: Background: #fffaf4 (Light) / #1a161f (Dark), Primary: #f36f56, Text: #25212b (Light) / #f5f0eb (Dark), Surface: #fff7ef / #2b2631.
1. Salary Dashboard: Elevated top widget showing baseline salary. Dual progress indicators comparing "Remaining Cash" vs "Auto Allocated Payouts". Below, a list of configured deductions (e.g. Ali Repayment, Rent, Savings Goal) with active toggle switches.
2. Salary Setup Screen: Set base pay amount, payment cycle frequency (Monthly, Semi-Monthly), and payday selection calendar.
3. Salary Cycle Details: Center circular progress ring visualizing countdown timer ("12 Days Until Payday"). Detailed breakdowns of planned deductions are listed below.
4. Mark Salary Received Checklist: Form input for Received Amount, Received Date (using DatePickerField), and checklist panel of deductions ("Trigger Ali PKR 5,000 Installment Auto-Allocation").
Maintain rounded-lg (24px) corners, clean shadowSoft elevations, and Manrope_700Bold typography.
```

---

### Flow 9: Scenario Planning, Can-I-Afford-This, & Forecasts (Advisory Flow)
The advisory portal helping users model new loans, calculate purchase affordabilities, and view upcoming cash flows.

#### 📁 Registered Screen Files
*   `src/screens/scenarios/ScenarioPlannerScreen.tsx` / `ScenarioResultScreen.tsx` — Sliders simulating hypothetical loans, interest structures, and cashflow impacts.
*   `src/screens/affordability/AffordabilityCalculatorScreen.tsx` / `AffordabilityResultScreen.tsx` — Feasibility calculator verifying purchase margins.
*   `src/screens/calendar/FinanceCalendarScreen.tsx` — Multi-day heatmaps projecting payments and daily cash positions.
*   `src/screens/forecast/CashForecastScreen.tsx` / `spendingInsights/CategoryTrendDetailScreen.tsx` — Analytics curves projecting savings.

#### 📋 Master AI Screen Codegen Prompt (Advisory Flow)
```text
Generate a set of React Native / Expo screens for Financial Advisory (Scenario Planner, Affordability Scorecard, and Finance Heatmap Calendar).
Theme: Dark tech accents (Background: #1a161f, Card: #25212b, Text: #f5f0eb, Primary: #f36f56).
1. Scenario Planner Screen: Interactive slider controls for Principal Amount, Interest Rate (%), and Duration (Months). Real-time chart displaying "Hypothetical Installment Impact". Tap "Calculate Impact" to view bar charts comparing "Current Cashflow" vs "Simulated Cashflow".
2. Affordability Calculator: Input panels for Purchase Price, Income Stability, and Loan Load. Yields an "Affordability Score" dial with recommendation alerts ("High Risk - Exceeds Debt-to-Income Limits" in red-orange `#d95441`).
3. Finance Heatmap Calendar: Grid calendar displaying monthly dates. Color-coded dates (dark green `#1b7d62` for days with net positive cashflow, warning gold `#ffd56a` for due dates, and terracotta `#d95441` for days with negative balances).
Ensure rounded-2xl (32px) card frames, smooth transition metrics, and Manrope fonts.
```

---

### Flow 10: Financial Reporting, Audits, Settings, & Backups (Administrative Flow)
The administrative portal managing general settings, data backups, PDF/Excel compile exports, and ledger audit logs.

#### 📁 Registered Screen Files
*   `src/screens/settings/SettingsScreen.tsx` / `AppModeSettingsScreen.tsx` — Visual interface configurations and mode presets.
*   `src/screens/privacy/PrivacyModeSettingsScreen.tsx` — Settings managing dashboard masking and hide-amounts.
*   `src/screens/reports/ReportsScreen.tsx` / `GeneratePdfScreen.tsx` / `ExportExcelScreen.tsx` — Document compiler and export interfaces.
*   `src/screens/reports/ReportHistoryScreen.tsx` / `MonthlyReportDetailScreen.tsx` / `OverdueReportScreen.tsx` / `PaymentMethodsReportScreen.tsx` — Summary archive lists.
*   `src/screens/settings/BackupRestoreScreen.tsx` / `BackupHistoryScreen.tsx` / `RestoreConfirmationScreen.tsx` — SQLite backup zip exports, history packages, and database restores.

#### 📋 Master AI Screen Codegen Prompt (Administrative Flow)
```text
Generate a set of React Native / Expo screens for Settings & Data Administration (Settings Hub, Document Export, and Database Backup).
Theme: Background: #fffaf4 (Light) / #1a161f (Dark), Cards: #ffffff (Light) / #25212b (Dark), Text: #25212b (Light) / #f5f0eb (Dark).
1. Settings Hub Screen: Modular list rows grouped under headers: Profile & Account, Privacy (triggers Privacy Mode Settings screen), Document Center (triggers Reports screen), and Database Vault. Clean chevron icons on the right of each row.
2. Privacy Settings Screen: Toggle switches to enable "App Masking (Privacy Mode)" and "Blur Sensitive Amounts". Renders real-time mockup preview displaying "Baqi Raqam: Rs. ****" with privacy toggles.
3. Document Export Screen: Date range calendar selectors. Segment controllers: "Generate PDF statement" vs "Export to Excel". Bottom lists show history logs with share/print Lucide icons.
4. Database Backup Screen: Action panels to "Export Encrypted SQLite Database". Below, lists history logs of backups with timestamp sizes. Tap "Restore" to trigger the Restore Confirmation screen prompting validation PINs.
Ensure premium spacing, rounded-lg (24px) cards, and clean Manrope fonts.
```w the grid, place a "Select Statement Range" calendar widget, followed by a list showing exported report history with print or share icons.
Ensure all layouts adapt cleanly to light/dark themes using the Manrope font.
```

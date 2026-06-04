# LoanTracker — Production Readiness Audit

> **Auditor**: Senior Full-Stack Engineer + Mobile UI/UX Reviewer  
> **Audit Date**: 2026-06-04  
> **Scope**: Backend (Node.js/Express/MongoDB) · Mobile App (React Native / Expo)  
> **Excluded**: Web app, admin panel, public website, deployment files (except where they affect backend/mobile behaviour)

---

## 1. Executive Summary

LoanTracker is a well-structured dual-stack product with a modular Express backend and a React Native (Expo) mobile client. The overall code quality is above average — validation is thorough, ownership checks are consistent, and the auth middleware is sound. However, **several production-blocking issues exist** that must be resolved before release:

| Area | Risk | Count |
|------|------|-------|
| Security | **Critical** | 2 |
| Race conditions / data integrity | **Critical** | 2 |
| Backend-Mobile contract mismatches | **High** | 4 |
| Missing error / offline handling | **High** | 3 |
| Sensitive data & unsafe patterns | **High** | 4 |
| UI/UX & mobile experience gaps | **Medium/Low** | 9 |
| Test coverage | **High** | — |

The biggest immediate risks are: a **real plaintext SMTP password committed to version control**, a **token passed as a URL query param** exposing it in server logs, **no rate limiting on auth endpoints**, and **non-atomic multi-step payment operations** that can leave loan balances inconsistent.

---

## 2. Critical Findings

---

### C-1 · Real SMTP Credentials Committed to Version Control

- **Severity**: Critical  
- **Area**: Security  
- **File**: `backend/.env` · Lines 33–34  
- **What is wrong**:  
  ```
  SMTP_USER="abuzarkhan1242@gmail.com"
  SMTP_PASS="qqby rsec hgwh rxfw"
  ```
  A real Google App Password is committed in plaintext inside `.env`, which is tracked by git (it is NOT in `.gitignore`). Anyone with access to the repository (including CI runners, collaborators, and any future public leak) can use these credentials to send email on behalf of this Gmail account.
- **Why it matters**: This is an immediate credential leak. Google may revoke the token; the account can be abused for spam or phishing.
- **How to reproduce**: `cat backend/.env | grep SMTP_PASS`
- **Recommended fix**:  
  1. Immediately revoke/regenerate the Google App Password.  
  2. Add `.env` to `.gitignore` (use `.env.example` for documentation).  
  3. Rotate and store secrets in a secrets manager (e.g., AWS Secrets Manager, GitHub Encrypted Secrets, Doppler).
- **Suggested tests**: CI pipeline check that `.env` is never committed (e.g., `git-secrets` or `detect-secrets`).

---

### C-2 · JWT Token Passed as URL Query Parameter in PDF Download

- **Severity**: Critical  
- **Area**: Security  
- **File**: `mobile/src/screens/loans/LoanDetailScreen.tsx` · Lines 46–49  
  `backend/src/middleware/auth.middleware.ts` · Lines 13–14  
- **What is wrong**:  
  ```ts
  // mobile – LoanDetailScreen.tsx:48
  const pdfUrl = `${baseUrl}/loans/${loanId}/pdf?token=${token}`;
  await Linking.openURL(pdfUrl);
  
  // backend – auth.middleware.ts:13-14
  } else if (typeof req.query.token === "string" && req.query.token) {
    token = req.query.token;
  }
  ```
  The JWT is appended as a query string and opened in the system browser. Query parameters are: (a) stored in server access logs, (b) stored in browser history, (c) visible in `Referer` headers to third-party resources embedded in the PDF viewer, and (d) cached by proxies/CDNs.
- **Why it matters**: Token extraction from logs is a known attack vector. Once exposed, the attacker has full API access for up to 7 days (the configured JWT TTL).
- **How to reproduce**: Enable access logging on the server; download a PDF; the token appears in the log line.
- **Recommended fix**:  
  1. Issue a short-lived (e.g., 60-second), single-use PDF token via a dedicated endpoint (`POST /api/loans/:loanId/pdf-token`) that returns a nonce stored server-side.  
  2. The PDF endpoint exchanges the nonce for the real token and serves the file.  
  3. Remove the `req.query.token` fallback from the auth middleware.
- **Suggested tests**: Integration test asserting that `GET /api/loans/:id/pdf` with `?token=...` is rejected with 401.

---

### C-3 · Non-Atomic Payment + Loan Recalculation (Race Condition / Partial Failure)

- **Severity**: Critical  
- **Area**: Backend — Data Integrity  
- **File**: `backend/src/modules/payments/payment.service.ts` · Lines 103–116  
- **What is wrong**:  
  ```ts
  const payment = await PaymentModel.create({ ... });           // Step 1
  const updatedLoan = await loanService.recalculateLoanTotals(…); // Step 2
  await transactionService.upsertLoanPaymentTransaction(…);       // Step 3
  ```
  Three independent writes are made sequentially without a MongoDB session/transaction. If the process crashes after step 1 (payment created) but before step 2 (loan totals updated), the loan's `paidAmount`, `remainingAmount`, and `status` are permanently wrong. The same race exists in `updatePayment` (lines 161-162) and `deletePayment` (lines 177-179).
- **Why it matters**: A user could see their remaining balance not decrease after payment, leading to double-payment and financial inaccuracy — the core trust-breaking bug for a financial app.
- **How to reproduce**: Kill the server process between `PaymentModel.create` and `recalculateLoanTotals`. Inspect the loan document directly in MongoDB.
- **Recommended fix**:  
  Wrap each multi-step operation in a MongoDB session with `session.withTransaction(…)`:
  ```ts
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    payment = await PaymentModel.create([payload], { session })[0];
    updatedLoan = await recalculateLoanTotals(…, session);
    await transactionService.upsertLoanPaymentTransaction(…, session);
  });
  session.endSession();
  ```
- **Suggested tests**: Test that an artificial failure after step 1 rolls back the payment document.

---

### C-4 · No Rate Limiting on Authentication Endpoints

- **Severity**: Critical  
- **Area**: Security  
- **File**: `backend/src/app.ts` · Lines 35–41; `backend/src/modules/auth/auth.routes.ts`  
- **What is wrong**:  
  There is no rate-limiting middleware anywhere in the application. The `POST /api/auth/login` and `POST /api/auth/register` endpoints are completely open to brute-force and credential-stuffing attacks. No `express-rate-limit`, no Redis-backed throttler, nothing.
- **Why it matters**: An attacker can make unlimited login attempts and systematically enumerate passwords for any known email address. This is a critical requirement for any internet-facing auth system.
- **How to reproduce**: `while true; do curl -s -X POST http://localhost:5050/api/auth/login -d '{"email":"victim@example.com","password":"guess"}' -H 'Content-Type: application/json'; done`
- **Recommended fix**:  
  ```ts
  import rateLimit from 'express-rate-limit';
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many attempts' });
  router.post('/login', authLimiter, validateRequest(loginSchema), login);
  router.post('/register', authLimiter, validateRequest(registerSchema), register);
  ```
- **Suggested tests**: Test that the 11th login attempt within 15 minutes returns HTTP 429.

---

## 3. High Findings

---

### H-1 · JWT Secret Placeholder Value in Production `.env`

- **Severity**: High  
- **Area**: Security  
- **File**: `backend/.env` · Line 4  
- **What is wrong**:  
  ```
  JWT_SECRET=replace-with-a-long-random-secret
  ```
  The JWT secret is a human-readable placeholder string. The `env.ts` validation only requires `min(16)` characters, and `"replace-with-a-long-random-secret"` satisfies that — so no error is thrown at startup. Any JWT signed with a guessable secret can be forged offline.
- **Why it matters**: An attacker who knows the placeholder value can sign arbitrary JWTs and impersonate any user.
- **Recommended fix**: Generate a cryptographically random 64-character hex secret (`openssl rand -hex 32`). Enforce a higher minimum (e.g., 32 chars) in `env.ts` with a regex test for sufficient entropy.

---

### H-2 · Contact Balance Data Fetched from Dashboard `topContacts` Endpoint (Wrong Semantic, Wrong Limit)

- **Severity**: High  
- **Area**: Backend-Mobile Contract  
- **File**: `mobile/src/screens/contacts/ContactsScreen.tsx` · Lines 174–177  
- **What is wrong**:  
  ```ts
  const balancesQuery = useQuery({
    queryKey: ["contacts", "balances"],
    queryFn: () => api.getTopContacts(80) as Promise<ContactBalance[]>,
  });
  ```
  The contacts screen calls `GET /api/dashboard/top-contacts?limit=80` to get per-contact balances. This endpoint is designed to return the **top N contacts sorted by `remainingAmount`**. If a user has more than 80 contacts, balances for contacts ranked below position 80 will silently show **Rs 0** balance in the UI — no error, no indication. The `TopContact` API type also uses `contactName` but the mobile `ContactBalance` type uses `name`, which may cause a field mapping issue.
- **Why it matters**: A user with 100 contacts will see incorrect (zero) balances for 20 of them, potentially trusting wrong information in a financial app.
- **Recommended fix**:  
  - Add a dedicated `GET /api/contacts/:id/balance` or `GET /api/contacts/balances` endpoint that returns balance for all of a user's contacts (with pagination).  
  - Or use the contact detail aggregation query directly.

---

### H-3 · `deleteContact` Does Not Cascade: Payments and Transactions Become Orphaned

- **Severity**: High  
- **Area**: Backend — Data Integrity  
- **File**: `backend/src/modules/contacts/contact.service.ts` · Lines 351–365  
- **What is wrong**:  
  ```ts
  async deleteContact(userId: string, contactId: string) {
    // Only checks for active loans (remaining > 0)
    const activeLoans = await LoanModel.countDocuments({ userId, contactId, remainingAmount: { $gt: 0 } });
    if (activeLoans > 0) throw new ApiError(400, "Cannot delete contact while active loans exist");
    await contact.deleteOne(); // Loans with remainingAmount=0, their payments, and transactions are NOT deleted
  ```
  A contact with fully-paid (COMPLETED) loans can be deleted. Those loans, payments, and transactions remain in the database with a dangling `contactId`. In the PDF generator and dashboard queries, deleted contacts show as "Deleted contact" (the dashboard does handle this gracefully), but payment records and transaction records still carry the orphaned ObjectId.
- **Why it matters**: Data integrity degrades over time. Loan PDFs reference a non-existent contact. Aggregation pipelines may behave differently depending on `$lookup` behavior with missing documents.
- **Recommended fix**:  
  Either soft-delete contacts (add `isDeleted: true` flag) or cascade-delete all associated completed loans, payments, and transactions when a contact is deleted — wrapped in a transaction.

---

### H-4 · `bulkImportDeviceContacts` Processes Contacts Sequentially (N+1 Pattern)

- **Severity**: High  
- **Area**: Performance  
- **File**: `backend/src/modules/contacts/contact.service.ts` · Lines 272–311  
- **What is wrong**:  
  ```ts
  for (const contactInput of contacts) {
    const result = await this.importDeviceContact(userId, { ...contactInput, name }); // 2-3 DB queries per contact
  }
  ```
  Each contact in a bulk import results in 2–3 sequential DB queries (one for phone match, one for device-id match, one for name match, then a create). For 500 contacts (a realistic phone book), this is 1000–1500 sequential DB round-trips. No concurrency, no bulk-insert, no batching.
- **Why it matters**: A 500-contact import will take 10–30 seconds with a remote DB, causing timeout or very poor UX. At scale it can exhaust the MongoDB connection pool.
- **Recommended fix**:  
  1. Pre-load all existing contacts for the user into a Map (keyed by normalizedPhone and deviceContactId).  
  2. Partition contacts into "match found" (update) and "new" (bulk insert via `insertMany`).  
  3. Run updates in parallel batches.

---

### H-5 · No Offline / Network Error State on Loan Form Screen (Payment Form Also)

- **Severity**: High  
- **Area**: Mobile — Error Handling  
- **File**: `mobile/src/screens/loans/LoanFormScreen.tsx` · Lines 104–106  
- **What is wrong**:  
  ```tsx
  if (contactsQuery.isLoading || loanQuery.isLoading) {
    return <Screen><LoadingState label="Preparing form..." /></Screen>;
  }
  ```
  If `contactsQuery.isError` (network down, server unreachable), the screen falls through to render the form with `contacts = []` — which disables the submit button with `disabled={!contacts.length}` (line 172). The user sees a blank contact selector with no explanation of why they can't submit. There is no `ErrorState` render for the contacts fetch failure.
- **Why it matters**: Offline users are silently blocked from creating loans with no actionable error or retry option.
- **Recommended fix**:  
  ```tsx
  if (contactsQuery.isError) {
    return <Screen><ErrorState message="Contacts load nahi ho sake." onRetry={contactsQuery.refetch} /></Screen>;
  }
  ```

---

### H-6 · Payment Form Fetches Full Loan (Including All Payments) for Edit State

- **Severity**: High  
- **Area**: Performance / Mobile  
- **File**: `mobile/src/screens/payments/PaymentFormScreen.tsx` · Lines 44–47, 64  
- **What is wrong**:  
  ```ts
  const loanQuery = useQuery({
    queryKey: ["loan", loanId],
    queryFn: () => api.getLoan(loanId),
  });
  const existingPayment = loanQuery.data?.payments.find((p) => p._id === paymentId);
  ```
  To pre-populate a payment edit form, the app fetches the entire loan detail (including ALL payments) just to find a single payment by ID. For a loan with 100+ payments, this fetches unnecessary data. There is no direct `GET /api/payments/:paymentId` endpoint.
- **Why it matters**: Unnecessary data over the wire; slow paint on slow connections.
- **Recommended fix**:  
  Add `GET /api/payments/:paymentId` endpoint on the backend. The mobile can call it directly.

---

## 4. Medium Findings

---

### M-1 · `refreshOverdueLoans` Called on Every List/Detail/Dashboard Request

- **Severity**: Medium  
- **Area**: Performance  
- **File**: `backend/src/modules/loans/loan.service.ts` · Lines 42–52, 127, 202  
  `backend/src/modules/dashboard/dashboard.service.ts` · Lines 31, 103, 152, 170, 188  
- **What is wrong**:  
  `refreshOverdueLoans` runs `LoanModel.updateMany` on every call to `getLoans`, `getLoanDetail`, and all five dashboard queries. A single dashboard page load triggers this write 5 times. Under load, this creates unnecessary write amplification on the loans collection.
- **Recommended fix**:  
  Run `refreshOverdueLoans` via a scheduled job (cron or BullMQ queue) once per day at midnight. Cache its last-run timestamp in Redis. Remove inline calls from read paths.

---

### M-2 · Regex Search Vulnerability: Unescaped User Input in Contact/Loan Search

- **Severity**: Medium  
- **Area**: Security / Performance  
- **File**: `backend/src/modules/loans/loan.service.ts` · Line 162  
  `backend/src/modules/contacts/contact.service.ts` · Line 58  
- **What is wrong**:  
  ```ts
  const regex = new RegExp(query.search, "i"); // Line 162 in loan.service.ts
  filter.$or = [{ name: regex }, { phone: regex }, { email: regex }];
  ```
  The `search` string is fed directly into `RegExp()` without escaping. Inputs like `(((` or `.*` create catastrophic-backtracking ReDoS attacks or at minimum malformed regex errors that crash the query.
- **Recommended fix**: Escape the search string before using it as a regex:
  ```ts
  const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'i');
  ```
  Note: `contact.service.ts` line 218 does escape the name match regex correctly; this inconsistency is itself a bug.

---

### M-3 · `LoanFormScreen` Contact List Hard-Capped at 100 — No Pagination or Search

- **Severity**: Medium  
- **Area**: Mobile — UX  
- **File**: `mobile/src/screens/loans/LoanFormScreen.tsx` · Line 42  
- **What is wrong**:  
  ```ts
  queryFn: () => api.getContacts({ limit: 100 }),
  ```
  The loan form fetches the first 100 contacts to populate the contact picker. Users with 100+ contacts cannot reach contacts beyond the first 100. There is no search inside the contact picker.
- **Recommended fix**:  
  Replace the static `FormSelect` with a searchable picker (e.g., a modal with a `TextInput` search and paginated `FlatList` of contacts).

---

### M-4 · Mixed Language Strings (Urdu/English) in UI Without i18n

- **Severity**: Medium  
- **Area**: Mobile UI/UX  
- **File**: Multiple screens — e.g., `LoanDetailScreen.tsx` lines 112, 121, 137; `LoanFormScreen.tsx` line 113; `LoansScreen.tsx` lines 21–24; `DashboardScreen.tsx` line 86  
- **What is wrong**:  
  The UI mixes Urdu ("Naya Loan", "Assalam-o-Alaikum", "Mujhe Diye Hain", "Baqi Raqam", "Maine diya") and English strings ad-hoc without an i18n system. Some screens are fully English, others partially Urdu. Screen reader (accessibility) behaviour for mixed-language content is broken — the TTS engine cannot switch languages mid-sentence.
- **Why it matters**: Accessibility failure; confusing UX for English-only users; unmaintainable as the app grows.
- **Recommended fix**: Commit to one language per release, or implement `i18next`/`expo-localization` with proper locale keys.

---

### M-5 · Settings Screen Has Non-Functional Placeholder Controls

- **Severity**: Medium  
- **Area**: Mobile — UX  
- **File**: `mobile/src/screens/settings/SettingsScreen.tsx` · Lines 315–331  
- **What is wrong**:  
  Controls for **Language**, **PIN Lock**, **Biometric Login**, **Export Data**, **Backup**, **Clear All Data**, **Privacy Policy**, and **Rate App** are all rendered with no action wired up (no `onPress`, or `onPress` with only a `setState` that has no effect). Toggling "PIN Lock" and "Biometric" updates local React state but never persists or enforces anything.
- **Why it matters**: Users who toggle "PIN Lock = ON" believe their app is protected. It is not.
- **Recommended fix**: Either implement the features or remove the controls from the screen until they are ready. Never ship fake security controls.

---

### M-6 · `TopContact` Type Mismatch Between Backend and Mobile

- **Severity**: Medium  
- **Area**: Backend-Mobile Contract  
- **File**: `backend/src/modules/dashboard/dashboard.service.ts` · Lines 222–233  
  `mobile/src/api/types.ts` · Lines 205–211  
- **What is wrong**:  
  Backend returns:
  ```json
  { "contactId": "...", "contactName": "Ali Khan", "phone": "...", ... }
  ```
  Mobile `TopContact` type expects:
  ```ts
  { contactId: string; name: string; phone?: string; ... }
  ```
  The field `contactName` (backend) is `name` (mobile). The mobile type definition is wrong. This causes `contact.name` to be `undefined` wherever `TopContact` is used.
- **Recommended fix**: Align the field names — either rename the backend projection key to `name`, or update the mobile type to `contactName`.

---

### M-7 · `contactsQuery` in ContactsScreen Does Not Refresh on Focus

- **Severity**: Medium  
- **Area**: Mobile — State Management  
- **File**: `mobile/src/screens/contacts/ContactsScreen.tsx` · Lines 170–177  
- **What is wrong**:  
  `appContactsQuery` has no `staleTime` configured, so it uses React Query's default (0). However, the query is keyed on `["contacts", search]` and is not explicitly refetched when the screen gains focus. If a user navigates to create a contact and returns, the list may not show the new contact until a manual refresh.
- **Recommended fix**: Add `useFocusEffect` to invalidate or refetch `["contacts"]` when the screen gains focus, similar to how device contacts are refreshed (lines 195–202).

---

### M-8 · Loans Screen Pagination Not Implemented (Hard Limit of 50)

- **Severity**: Medium  
- **Area**: Mobile — Data Completeness  
- **File**: `mobile/src/screens/loans/LoansScreen.tsx` · Lines 79–88  
- **What is wrong**:  
  ```ts
  queryFn: () => api.getLoans({ search, type, status, limit: 50 })
  ```
  The loans list fetches at most 50 loans. There is no infinite scroll, no pagination, and no indication to the user that older loans may be hidden.
- **Recommended fix**: Implement `useInfiniteQuery` with `fetchNextPage` on `onEndReached` of a `FlatList`.

---

### M-9 · PDF Download Token Exposed in Alert Dialog on Error

- **Severity**: Medium  
- **Area**: Security / Mobile  
- **File**: `mobile/src/screens/loans/LoanDetailScreen.tsx` · Lines 45–57  
- **What is wrong**:  
  If `Linking.openURL` throws, the catch block shows a generic alert. However, the `pdfUrl` is constructed with the raw JWT token in the URL string (see C-2). On some platforms, error messages in `Linking` can bubble up to crash reporters (Sentry, Crashlytics) which would log the full URL — and the token — in plain text.
- **Recommended fix**: Resolve C-2 (short-lived PDF nonce token). Until then, never include the JWT in any URL.

---

## 5. Low Findings

---

### L-1 · `health` Route Registered Twice

- **Severity**: Low  
- **Area**: Backend  
- **File**: `backend/src/app.ts` · Lines 33, 42  
- **What is wrong**:  
  ```ts
  app.use("/health", healthRoutes);    // Line 33
  app.use("/api/health", healthRoutes); // Line 42
  ```
  The health routes module is mounted at two paths. This is harmless but noisy and indicates copy-paste debt.
- **Recommended fix**: Pick one path (`/health` is conventional for load balancers) and remove the other.

---

### L-2 · `updateLoan` Does Not Emit an Audit Log

- **Severity**: Low  
- **Area**: Backend — Observability  
- **File**: `backend/src/modules/loans/loan.service.ts` · Lines 217–266  
- **What is wrong**:  
  `addPayment`, `updatePayment`, and `deletePayment` all call `auditLogService.record(...)`. But `createLoan`, `updateLoan`, and `deleteLoan` do **not**. Loan mutations are not audited.
- **Recommended fix**: Add audit log calls to all loan mutation operations.

---

### L-3 · `pdfGenerator.ts` Uses `any` Type for Loan and Payments

- **Severity**: Low  
- **Area**: Backend — Code Quality  
- **File**: `backend/src/utils/pdfGenerator.ts` · Lines 28–31  
- **What is wrong**:  
  ```ts
  export const generateLoanPdf = (loan: any, payments: any[], res: Response) => {
  ```
  The PDF generator accepts `any` types, meaning callers can pass malformed data without TypeScript catching it. `loan.description`, `loan.amount`, `loan.contactId` etc. are accessed without null safety.
- **Recommended fix**: Type-annotate with `ILoan` and `IPayment` (or a safe projection type).

---

### L-4 · `AuthProvider` Bootstraps with a Stale Cache on First Render

- **Severity**: Low  
- **Area**: Mobile — State Management  
- **File**: `mobile/src/providers/AuthProvider.tsx` · Lines 46–61  
- **What is wrong**:  
  ```ts
  if (storedUser) setUser(JSON.parse(storedUser)); // Show stale user immediately
  const freshUser = await api.me();                 // Then replace with fresh
  setUser(freshUser);
  ```
  This is intentional "optimistic cache" behaviour, but if the token has expired between app sessions (after 7 days), `api.me()` will throw a 401, `clearSession()` is called, but `setUser(null)` happens slightly after the user has briefly been set — causing a screen flash from authenticated → unauthenticated state.
- **Recommended fix**: Use the stale user for UI display only (don't set auth state until token is validated), or show a transparent splash screen until bootstrap completes.

---

### L-5 · `ContactFormScreen` Does Not Show Error State When Editing a Non-Existent Contact

- **Severity**: Low  
- **Area**: Mobile  
- **File**: `mobile/src/screens/contacts/ContactFormScreen.tsx` · Lines 31–35, 68  
- **What is wrong**:  
  ```tsx
  if (contactQuery.isLoading) return <Screen><LoadingState /></Screen>;
  // contactQuery.isError is never checked!
  ```
  If the contact was deleted by another device session, `contactQuery.isError = true` and the form renders with empty default values, silently failing.
- **Recommended fix**: Add an `isError` guard before rendering the form.

---

### L-6 · No `accessibilityLabel` on Icon-Only Touch Targets

- **Severity**: Low  
- **Area**: Mobile — Accessibility  
- **File**: `LoanDetailScreen.tsx` · Lines 249–261; `ContactsScreen.tsx` · Lines 284–302  
- **What is wrong**:  
  Icon-only `TouchableOpacity` components (e.g., the "+" FAB, edit pencil, trash icon) have no `accessibilityLabel` or `accessibilityRole`. Screen readers cannot announce what these buttons do.
- **Recommended fix**:  
  ```tsx
  <TouchableOpacity accessibilityLabel="Add payment" accessibilityRole="button">
  ```

---


## 6. Backend Audit Details

### What is Well-Implemented

- **Consistent ownership checks**: Every service method filters by `userId` before querying. No IDOR issues found.
- **Zod validation**: All routes use `validateRequest` middleware with well-scoped Zod schemas. Input is sanitized and re-assigned to `req.body` after parsing.
- **Password security**: bcrypt with configurable salt rounds (defaults to 12). `select: false` on password field. `comparePassword` uses `bcrypt.compare` (timing-safe).
- **Error uniformity**: All errors go through the central `errorHandler`. `ApiError` class ensures consistent `{ success, message, data }` shape.
- **MongoDB indexes**: Compound indexes on `userId + type + status`, `userId + issueDate`, and `userId + loanId + paymentDate` are correctly defined.
- **Audit log**: `auditLogService` wraps writes in a try/catch so audit failures never break the main request flow.

### Issues Identified

| Issue | File | Line | Severity |
|-------|------|------|----------|
| No rate limiting | `app.ts`, `auth.routes.ts` | – | Critical |
| Token in URL query param | `auth.middleware.ts` | 13-14 | Critical |
| Non-atomic payment ops | `payment.service.ts` | 103–116, 161–162 | Critical |
| Credentials in `.env` | `.env` | 33–34 | Critical |
| Placeholder JWT secret | `.env` | 4 | High |
| N+1 bulk contact import | `contact.service.ts` | 272–311 | High |
| No single-payment GET endpoint | – | – | High |
| Orphaned data on contact delete | `contact.service.ts` | 351–365 | High |
| ReDoS risk in regex search | `loan.service.ts`, `contact.service.ts` | 162, 58 | Medium |
| `refreshOverdueLoans` on every read | `loan.service.ts`, `dashboard.service.ts` | multiple | Medium |
| Missing loan audit logs | `loan.service.ts` | 80–278 | Low |
| `any` type in PDF generator | `pdfGenerator.ts` | 28 | Low |
| Double-mounted `/health` route | `app.ts` | 33, 42 | Low |

---

## 7. Mobile App Audit Details

### What is Well-Implemented

- **React Query throughout**: Consistent use of `useQuery`/`useMutation` with proper cache invalidation after mutations.
- **Biometric credentials**: Stored in `expo-secure-store` with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, which is the correct iOS/Android Keychain access level.
- **Screen safe-area**: `SafeAreaView` with `edges={["top","left","right","bottom"]}` is correctly applied in the `Screen` wrapper.
- **Keyboard avoidance**: `KeyboardAvoidingView` + `keyboardDismissMode="interactive"` in `Screen.tsx` is thoughtfully implemented.
- **Form validation**: All forms use `react-hook-form` + `zod` resolver. Field-level errors are displayed inline.
- **Loading/Error/Empty states**: All query results have `LoadingState`, `ErrorState`, and `EmptyState` renders (with some gaps noted above).
- **Pull-to-refresh**: The `Screen` component's `RefreshControl` invalidates all active React Query queries by default — a clean UX pattern.

### Issues Identified

| Issue | File | Line | Severity |
|-------|------|------|----------|
| Token passed as URL param | `LoanDetailScreen.tsx` | 48 | Critical |
| No error state for contacts query failure in LoanForm | `LoanFormScreen.tsx` | 104 | High |
| Payment form fetches full loan for edit | `PaymentFormScreen.tsx` | 44 | High |
| Contacts list hard-capped at 80 (balance), 80 (list) | `ContactsScreen.tsx` | 172, 176 | High |
| Loans list hard-capped at 50, no pagination | `LoansScreen.tsx` | 86 | Medium |
| ContactsScreen appContacts not refreshed on focus | `ContactsScreen.tsx` | 170 | Medium |
| ContactFormScreen missing error state | `ContactFormScreen.tsx` | 68 | Low |
| No accessibilityLabel on icon-only buttons | Multiple | – | Low |
| Settings: fake security controls | `SettingsScreen.tsx` | 322–323 | Medium |
| Stale cache flash on bootstrap | `AuthProvider.tsx` | 46–61 | Low |

---

## 8. Mobile UI/UX Audit Details

### Positive Notes
- Color palette is consistent and semantic (coral for primary, mint for success, peach for danger backgrounds).
- `fontFamily` constants are used systematically — no ad-hoc font strings.
- `adjustsFontSizeToFit` + `minimumFontScale` prevents text overflow on small screens.
- `ProgressBar` on loan detail gives clear visual feedback.
- `StatusBadge` differentiates GIVEN/TAKEN and ACTIVE/OVERDUE/COMPLETED/PARTIALLY_PAID visually.

### Issues

**UX-1: Loan Form — No Way to Create a New Contact Inline**  
File: `LoanFormScreen.tsx` · Lines 131–133  
If no contacts exist, the user sees `EmptyState` with a message but the only action is to go back, create a contact, then navigate back to the loan form. This is a broken user flow. Recommend an inline "Create Contact" shortcut button.

**UX-2: Dashboard Only Shows 6-Month Chart; No Way to See Historical Data**  
File: `DashboardScreen.tsx` · Line 394  
`api.getMonthlyChart(6)` is hardcoded. Users with long histories have no way to see older data.

**UX-3: Loan Detail — "Due {formatDate(loan.dueDate)}" Shows "No date" When No Due Date**  
File: `LoanDetailScreen.tsx` · Line 184  
`formatDate` returns `"No date"` when `dueDate` is null. Showing "Due No date" is confusing. The field should be conditionally hidden.

```tsx
{loan.dueDate ? (
  <Text>Due {formatDate(loan.dueDate)}</Text>
) : null}
```

**UX-4: TransactionsScreen — `totals` Calculation Includes `LOAN_RECOVERY` and `LOAN_REPAYMENT` in Income/Expense**  
File: `TransactionsScreen.tsx` · Lines 231–239  
```ts
const inflow = transactionTypeTone[transaction.type] === "inflow";
if (inflow) acc.income += transaction.amount;
else acc.expense += transaction.amount;
```
`LOAN_RECOVERY` is classified as "inflow" and `LOAN_REPAYMENT` as "expense" in the totals bar. This inflates both income and expense figures, making the "Cash Flow" card misleading. A loan repayment is not a cash expense in the traditional sense. Add a distinct display or exclude them from the income/expense totals.

**UX-5: Contacts Screen — Balance Bar Shows Raw PKR Abbreviation Inconsistently**  
File: `ContactsScreen.tsx` · Line 405; `formatSignedCurrency` · Line 54  
The contacts screen uses `formatSignedCurrency` (custom "Rs ±N") while the rest of the app uses `formatCurrency` from `format.ts` (Intl `PKR`). Two different currency display formats in the same app session.

**UX-6: Long Contact Names Overflow in `LoanDetailScreen` Header**  
File: `LoanDetailScreen.tsx` · Line 154  
```tsx
<Text className="text-2xl font-black text-dark">{getContactName(loan.contactId)}</Text>
```
No `numberOfLines` prop. A 40+ character contact name will overflow or wrap unpredictably on small phones.

---

## 9. Backend-Mobile Contract Issues

| # | Endpoint | Issue | Backend File | Mobile File |
|---|----------|-------|-------------|-------------|
| 1 | `GET /api/dashboard/top-contacts` | Mobile uses `name` field; backend returns `contactName` | `dashboard.service.ts:223` | `types.ts:208` |
| 2 | `GET /api/loans/:loanId/pdf` | Mobile appends `?token=JWT` to URL; this is a security anti-pattern | `auth.middleware.ts:13` | `LoanDetailScreen.tsx:48` |
| 3 | No `GET /api/payments/:paymentId` | Mobile must fetch full loan+payments to find a single payment | `payment.routes.ts` | `PaymentFormScreen.tsx:44` |
| 4 | `GET /api/contacts` with `limit: 80` | Used to get balances but only returns contacts, not balances | `contact.routes.ts` | `ContactsScreen.tsx:172` |
| 5 | `deletePayment` returns `{ id, loan }` | Mobile `PaymentMutationResponse` marks `payment` as optional but `id` is used directly | `payment.service.ts:181` | `types.ts:168–172` |
| 6 | `LoanDetail.loan.contactId` can be a populated object | Mobile `getContactName`/`getContactId` handle this correctly | `loan.service.ts:204` | `LoanDetailScreen.tsx:23–37` ✅ |
| 7 | Date fields returned as ISO strings | Mobile `formatDate` uses `new Date(dateString)` — correct, but no timezone normalization | `loan.model.ts` | `format.ts:15` |

---

## 10. Security Risks (Summary)

| Risk | Severity | Finding Ref |
|------|----------|-------------|
| Real SMTP password in git | Critical | C-1 |
| JWT in URL query param | Critical | C-2 |
| No brute-force protection on auth | Critical | C-4 |
| Placeholder JWT secret passes validation | High | H-1 |
| ReDoS in unescaped regex search | Medium | M-2 |
| CORS `*` default | Low | L-7 |
| Biometric credentials stored in SecureStore ✅ | N/A (good) | – |
| Password not returned in API responses ✅ | N/A (good) | – |
| Ownership checks on all resources ✅ | N/A (good) | – |

---

## 11. Performance Risks (Summary)

| Risk | Severity | Finding Ref |
|------|----------|-------------|
| `refreshOverdueLoans` on every read request | Medium | M-1 |
| Bulk contact import is sequential N+1 | High | H-4 |
| Payment form fetches full loan for edit | High | H-6 |
| Loans list not paginated (hardcap 50) | Medium | M-8 |
| `getTopContacts(80)` for balance display | High | H-2 |
| No database connection pooling config visible | — | — |

---

## 12. Missing Test Coverage

| Area | What's Missing |
|------|---------------|
| Auth | No test for duplicate email on register; no test for expired token; no test for token in query param |
| Loans | No test for `dueDate` overdue status transition; no test for `updateLoan` reducing amount below paidAmount |
| Payments | No test for race condition simulation; no test for `deletePayment` + loan recalculation; no test for `updatePayment` exceeding remaining |
| Contacts | No test for `bulkImportDeviceContacts` deduplication logic; no test for cascade behavior after delete |
| Dashboard | No test for `getSummary` with mixed GIVEN/TAKEN loans; no test for `getTopContacts` limit behavior |
| Transactions | No test for `upsertLoanPaymentTransaction` idempotency; no test for auto-generated transaction guard |
| Security | Zero tests for rate limiting; zero tests for auth token tampering |
| Mobile | Zero automated tests (no Jest/Detox setup found) |

The current test suite is a single `api.test.ts` file with one large integration test covering the happy path. There are no unit tests, no edge-case tests, and no security tests.

---

## 13. Recommended Fix Order

| Priority | Action | Risk Mitigated |
|----------|--------|----------------|
| **P0 — Immediate** | Rotate SMTP password, remove from git, add `.env` to `.gitignore` | C-1 |
| **P0 — Immediate** | Add `express-rate-limit` to auth routes | C-4 |
| **P0 — Immediate** | Replace JWT query-param PDF flow with short-lived token | C-2 |
| **P0 — Immediate** | Set a real JWT secret in production | H-1 |
| **P1 — This Sprint** | Wrap payment add/update/delete in MongoDB transactions | C-3 |
| **P1 — This Sprint** | Escape regex in loan + contact search | M-2 |
| **P1 — This Sprint** | Fix `TopContact` field name mismatch (`contactName` vs `name`) | M-6 |
| **P1 — This Sprint** | Add `GET /api/payments/:paymentId` endpoint | H-6 |
| **P1 — This Sprint** | Add `ErrorState` to LoanFormScreen contacts failure | H-5 |
| **P2 — Next Sprint** | Move `refreshOverdueLoans` to a cron job | M-1 |
| **P2 — Next Sprint** | Rewrite `bulkImportDeviceContacts` with batching | H-4 |
| **P2 — Next Sprint** | Implement loan list infinite scroll | M-8 |
| **P2 — Next Sprint** | Fix fake Settings security controls | M-5 |
| **P2 — Next Sprint** | Fix contact balance endpoint semantic | H-2 |
| **P3 — Backlog** | Add audit logging to loan mutations | L-2 |
| **P3 — Backlog** | Implement i18n (pick one language or use locale keys) | M-4 |
| **P3 — Backlog** | Add accessibility labels to all icon-only buttons | L-6 |
| **P3 — Backlog** | Fix stale cache flash in AuthProvider bootstrap | L-4 |
| **P3 — Backlog** | Fix UX-3 (hide "Due No date") | UX-3 |
| **P3 — Backlog** | Write unit + integration tests for all modules | Testing |

---

## 14. Files Reviewed

### Backend
- `backend/.env`, `backend/.env.example`
- `backend/src/app.ts`, `server.ts`
- `backend/src/config/env.ts`, `db.ts`, `logger.ts`
- `backend/src/constants/enums.ts`
- `backend/src/middleware/auth.middleware.ts`, `error.middleware.ts`, `validateRequest.ts`, `requestId.middleware.ts`, `requestLogger.middleware.ts`
- `backend/src/modules/auth/` (all 5 files)
- `backend/src/modules/loans/` (all 5 files)
- `backend/src/modules/payments/` (all 5 files)
- `backend/src/modules/contacts/` (all 5 files)
- `backend/src/modules/dashboard/` (controller, routes, service)
- `backend/src/modules/transactions/` (all 5 files)
- `backend/src/modules/categories/` (all 5 files)
- `backend/src/modules/audit/` (all 6 files)
- `backend/src/utils/` (all 10 files)
- `backend/tests/api.test.ts`

### Mobile
- `mobile/.env`, `mobile/src/api/client.ts`, `mobile/src/api/types.ts`
- `mobile/src/navigation/RootNavigator.tsx`, `types.ts`, `FloatingTabBar.tsx`
- `mobile/src/providers/AuthProvider.tsx`, `ThemeProvider.tsx`, `AlertProvider.tsx`
- `mobile/src/services/biometricAuth.ts`
- `mobile/src/screens/auth/LoginScreen.tsx`, `RegisterScreen.tsx`
- `mobile/src/screens/dashboard/DashboardScreen.tsx`
- `mobile/src/screens/loans/LoansScreen.tsx`, `LoanFormScreen.tsx`, `LoanDetailScreen.tsx`
- `mobile/src/screens/payments/PaymentFormScreen.tsx`, `QuickAddPaymentScreen.tsx`
- `mobile/src/screens/contacts/ContactsScreen.tsx`, `ContactFormScreen.tsx`
- `mobile/src/screens/transactions/TransactionsScreen.tsx`
- `mobile/src/screens/settings/SettingsScreen.tsx`
- `mobile/src/components/` (all 14 files)
- `mobile/src/utils/format.ts`, `errors.ts`, `finance.ts`, `theme.ts`

---

*End of Report*

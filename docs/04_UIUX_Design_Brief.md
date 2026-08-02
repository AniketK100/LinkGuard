# 04 — UI/UX Design Brief — v2
## URL Intelligence Platform

*Revision note: v2 adds low-fidelity ASCII wireframes for every core screen, so layout intent is explicit rather than described only in prose.*

---

## 1. Design Philosophy

The frontend is a **visualization layer** for a backend-heavy product — it should feel like a clean, credible analytics/SaaS tool (think Bitly dashboard, Vercel analytics, Linear's polish), not a flashy marketing site. Clarity and data legibility over decoration.

**Principles:**
- Data-dense but uncluttered — generous whitespace around dense tables/charts
- Consistent, restrained color palette; color is used functionally (status, charts) not decoratively
- Fast perceived performance — optimistic UI on link creation, skeleton loaders on analytics
- Mobile-usable dashboard (secondary priority; desktop-first is fine for MVP)

---

## 2. Visual System

| Token | Value/Guidance |
|---|---|
| Typography | One clean sans-serif (Inter, or system-ui stack); 1 heading scale, 1 body scale, 1 mono (for short codes/URLs) |
| Color — base | Neutral gray scale for surfaces/text (Tailwind `slate`/`zinc`) |
| Color — accent | Single brand accent (e.g., indigo/blue) for primary actions/links |
| Color — status | Green = active, amber = expiring soon / under review, red = disabled/expired, gray = draft |
| Spacing | Tailwind default scale (4px base unit) |
| Corners | Consistent radius (e.g., `rounded-lg`) across cards, inputs, buttons |
| Elevation | Subtle shadows only on modals/dropdowns; flat cards with border otherwise |
| Charts | Chart.js/Recharts with a shared 4–6 color categorical palette for browser/device/country breakdowns |

---

## 3. Core Screens & Wireframes

### 3.1 Auth Screens

```
+-----------------------------------------+
|              [ Logo / Brand ]            |
|                                           |
|          Log in to your account          |
|                                           |
|   Email      [_______________________]   |
|   Password   [_______________________]   |
|                                           |
|              [   Log In Button   ]        |
|                                           |
|   Forgot password?      Create account    |
+-------------------------------------------+
```
(Register mirrors this with Name / Email / Password / Confirm Password fields.)

### 3.2 Dashboard (Home)

```
+---------+-------------------------------------------------------+
| Sidebar |  Topbar: [Search links...]           [+ Create Link]   |
|         +-------------------------------------------------------+
| Dashboard|  +----------+ +----------+ +----------+ +----------+  |
| Links    |  | Total    | | Today's  | | Monthly  | | Top      |  |
| Favorites|  | Links    | | Clicks   | | Clicks   | | Link     |  |
| Admin    |  | 42       | | 128      | | 3,201    | | /portfolio|  |
| Settings |  +----------+ +----------+ +----------+ +----------+  |
|         |                                                        |
|         |  +----------------------+  +-------------------------+ |
|         |  | Top Countries (bar)  |  | Top Browsers (pie)      | |
|         |  +----------------------+  +-------------------------+ |
|         |                                                        |
|         |  Recent Activity                                       |
|         |  +----------------------------------------------------+ |
|         |  | Time     | Link      | Browser | Country | Device  | |
|         |  | 10:02 AM | /dev      | Chrome  | IN      | Mobile  | |
|         |  | 09:58 AM | /portfolio| Safari  | US      | Desktop | |
|         |  +----------------------------------------------------+ |
+---------+-------------------------------------------------------+
```

### 3.3 Links List

```
+---------+-------------------------------------------------------+
| Sidebar |  [Search...]  [Status ▾] [Tag ▾]  [Sort: Clicks ▾]     |
|         +-------------------------------------------------------+
|         |  +----------------------------------------------------+ |
|         |  | ☆ | Short Code | Original URL      | Clicks | Status| |
|         |  |---|------------|-------------------|--------|-------| |
|         |  | ★ | /portfolio | github.com/sahil..| 1,230  | ●Active| |
|         |  |   | /resume    | drive.google.com..|   340  | ●Active| |
|         |  |   | /interview | notion.so/...     |    12  | ●Expired| |
|         |  +----------------------------------------------------+ |
|         |                                                        |
|         |            [ ‹ Prev ]   Page 1 of 4   [ Next › ]        |
+---------+-------------------------------------------------------+
```
Row actions (icons, right-aligned per row): copy, QR, edit, pin, delete.

### 3.4 Create/Edit Link (Modal)

```
+---------------------------------------------+
|  Create Short Link                     [ x ] |
|-----------------------------------------------|
|  Original URL *      [_________________________]|
|  Custom Alias         [go.app/][____________]  |
|                        ✓ available             |
|  Expiry Date           [ 📅 Select date ]       |
|  Password Protect      [ ] Enable  → [______]  |
|  Tags                  [Resume ×][+ Add tag]    |
|                                                 |
|                    [ Cancel ]  [ Create Link ]  |
+---------------------------------------------+
```

Success state (replaces form content after submit):
```
+---------------------------------------------+
|  ✓ Link created!                       [ x ] |
|-----------------------------------------------|
|   go.app/portfolio           [ Copy ]         |
|                                                |
|         +--------------+                      |
|         |  QR CODE      |    [ Download PNG ] |
|         |  ▓▓░░▓▓░░▓▓  |                      |
|         +--------------+                      |
+---------------------------------------------+
```

### 3.5 Link Detail / Analytics Page

```
+---------+-------------------------------------------------------+
| Sidebar |  go.app/portfolio          ●Active   [Edit][Disable][QR]|
|         |  → github.com/Sahil-Ghorpade/social-media-platform     |
|         +-------------------------------------------------------+
|         |  +----------+ +----------+ +----------+                |
|         |  | Clicks   | | Unique   | | Last     |                |
|         |  | 1,230    | | Visitors | | Accessed |                |
|         |  |          | | 812      | | 2m ago   |                |
|         |  +----------+ +----------+ +----------+                |
|         |                                                        |
|         |  Traffic Over Time                                     |
|         |  +----------------------------------------------------+ |
|         |  |      ▂▃▅▇▆▄▃▂▄▅▇█▇▅▃▂▁▂▃  (line chart)               |
|         |  +----------------------------------------------------+ |
|         |                                                        |
|         |  +----------------+  +----------------+                |
|         |  | Browser Share  |  | Device Share   |                |
|         |  | Chrome 62%     |  | Desktop 55%    |                |
|         |  | Safari 24%     |  | Mobile 40%     |                |
|         |  | Firefox 14%    |  | Tablet 5%      |                |
|         |  +----------------+  +----------------+                |
|         |                                                        |
|         |  Recent Activity Table (time, referrer, browser, os,   |
|         |  device, country)                                       |
+---------+-------------------------------------------------------+
```

### 3.6 Password Prompt (Public, Unauthenticated)

```
+-----------------------------------+
|        🔒 This link is protected  |
|                                    |
|   Password   [__________________] |
|                                    |
|            [   Unlock   ]          |
+-----------------------------------+
```

### 3.7 Expired / Disabled / Not Found (Public)

```
+-----------------------------------+
|              ⚠                    |
|      This link has expired.       |
|   Contact the link owner for a    |
|          new one.                 |
+-----------------------------------+
```

### 3.8 Admin Panel

```
+---------+-------------------------------------------------------+
| Flagged |  [ Flagged Links ] [ Users ] [ Blacklist ]              |
| Users   +-------------------------------------------------------+
| Blacklist| Short Code | Owner   | Reason           | Actions      |
|         | /promo123  | user42  | Excess clicks/IP | [Approve][Disable]|
|         | /win-free  | user09  | Redirect loop     | [Approve][Disable]|
+---------+-------------------------------------------------------+
```

### 3.9 Account Settings

```
+---------+-------------------------------------------------------+
| Sidebar |  Profile                                               |
|         |  Name   [__________]   Email  [__________] (verified ✓)|
|         |                                                        |
|         |  Change Password                                       |
|         |  Current [______]  New [______]  Confirm [______]      |
|         |                        [ Save Changes ]                |
|         |                                                        |
|         |  Active Sessions                                       |
|         |  Chrome / Windows — this device        [ Revoke ]      |
|         |  Safari / iPhone — 2 days ago           [ Revoke ]      |
+---------+-------------------------------------------------------+
```

---

## 4. Component Inventory (Reusable)

- Button (primary/secondary/danger/ghost)
- Input / Select / DatePicker / Toggle / Tag-input
- Modal / Drawer
- Table (sortable headers, pagination footer)
- StatCard
- StatusBadge (active/expired/disabled/under-review)
- Chart wrappers (LineChart, BarChart, PieChart) with consistent theming
- Toast/Notification
- Skeleton loaders (table rows, stat cards, chart placeholders)
- CopyToClipboard button
- QR display + download

---

## 5. Interaction & State Guidance

- **Optimistic updates:** creating/editing a link updates the list immediately; roll back with toast on server error.
- **Loading states:** skeletons, not spinners, for dashboard/analytics.
- **Empty states:** every list/chart needs a designed empty state, not a blank area.
- **Error states:** every form field shows inline errors; global errors surface as toasts, mapped from the status codes in `02_TRD.md` §8 (e.g., 409 → "That alias is already taken", 429 → "Too many attempts, try again in a moment").
- **Real-time-feel clicks:** poll (React Query `refetchInterval`) the analytics endpoint every 15–30s on the detail page rather than true websockets (out of scope for v1).

---

## 6. Accessibility & Responsiveness

- Color is never the sole indicator of status (pair with icon/text label).
- All interactive elements keyboard-navigable; modals trap focus.
- Minimum contrast ratio 4.5:1 for text.
- Dashboard responsive down to tablet width; mobile gets a simplified single-column view (nice-to-have, not MVP-blocking).

---

## 7. Frontend Folder Structure

```
src/
├── components/
│   ├── ui/            # Button, Input, Modal, Table, StatCard, StatusBadge...
│   ├── charts/         # LineChart, BarChart, PieChart wrappers
│   └── layout/         # Sidebar, Topbar, DashboardShell
├── pages/
│   ├── auth/           # Login, Register, ForgotPassword, ResetPassword
│   ├── dashboard/       # Dashboard home
│   ├── links/           # LinksList, LinkDetail, CreateEditLink
│   ├── admin/            # FlaggedLinks, Users, Blacklist
│   └── public/            # PasswordPrompt, Expired, NotFound
├── hooks/               # useAuth, useLinks, useAnalytics (React Query hooks)
├── lib/                 # axios instance + interceptors, formatters
├── context/             # AuthContext
└── App.jsx / main.jsx
```

---

## 8. Design Deliverable Checklist (before frontend dev starts)

- [ ] Color/typography tokens defined in Tailwind config
- [ ] Component inventory above stubbed as empty components
- [ ] Wireframes in §3 validated against actual API response shapes (`05_Backend_Schema_Data_Auth.md`)
- [ ] Status/badge color mapping finalized (matches backend `status` enum exactly)
- [ ] Chart color palette finalized and reused across all analytics visualizations
- [ ] Error-toast copy mapped 1:1 against the status-code table in `02_TRD.md` §8

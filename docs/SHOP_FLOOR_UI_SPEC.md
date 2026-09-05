# KeiFit AU — FINAL Shop Floor UI Specification

**Status:** HQ-approved Direction A+B with three minor corrections applied. Ready for Developer implementation (PR #6).  
**Authoring role:** UI Designer — does **not** merge or deploy.  
**Locked base:** Direction A — Workshop Honest / Shop Floor  
**Refined with:** Direction B spacing & hierarchy  
**Corrections (HQ):** (1) meta text readability, (2) independent PCD / centre-bore hub fields, (3) label **Manufacturer spec**  
**Data:** All fitment numbers, outcomes, and refs are **Example** placeholders — never invent Confirmed claims.

---

## Confirmation of locked direction

HQ locked **Direction A (Workshop Honest / Shop Floor)** as the visual base:

- Dark charcoal / steel shell (`#1C1F24` / `#252A31`)
- Cream / off-white cards (`#F4F1EA` / `#F7F5F0`)
- IBM Plex Sans + IBM Plex Mono
- Technical workshop / JDM identity with strong KeiFit branding

**B refinements applied:**

- Cleaner spacing and more breathing room
- Comfortable mobile text (body ~14–16px; meta / labels ≥12px)
- Clearer typography hierarchy (Sans for body / titles; Mono for wordmark, sizes, chips, badges)
- **Orange `#F5A623` reserved for primary actions and warnings only**
- Structure uses lighter steel greys for meta on dark; green / red / blue / tan only for semantic fitment states

---

## HQ corrections applied (mandatory)

### 1. Meta text readability

- Bump crumbs, section labels, footers, secondary meta from ~10px muted steel to **at least ~12px** where layout permits.
- On dark charcoal, use lighter grey **`#A8AEB6`** (token `--steel`) instead of low-contrast `#6A7078` / `#8A9099`.
- On cream cards, label / muted text uses **`#5A6068`** at ≥12px so hierarchy stays clear without muddy contrast.
- Keep hierarchy: primary content (off-white / ink) remains stronger than meta.

### 2. Independent hub fields (PCD ≠ centre bore)

- **PCD** and **centre bore** are tracked and displayed as **independent** evidence fields.
- A known PCD must **never** be blanked or forced unknown because centre bore is unresolved (and vice versa).
- Prefer separate **PCD** and **Centre bore** rows/chips, each with its own known / unresolved / unknown state.
- **Hub unknown** is a **summary / aggregate flag only**. It must not wipe or overwrite known field values.

**When to show “Hub unknown”:**

| PCD | Centre bore | Field display | Hub unknown summary |
|-----|-------------|---------------|---------------------|
| Known | Known | Show both values | Off |
| Known (Example) | Unresolved | Show PCD value + CB Unresolved | **On** (overall hub fitment not verified) |
| Unresolved | Known | Show PCD Unresolved + CB value | **On** |
| Unresolved / Unknown | Unresolved / Unknown | Show each as Unresolved/Unknown | **On** |

**Rule:** Aggregate **Hub unknown** when **either** critical hub field is unresolved/unknown (overall hub fitment cannot be verified). Never coerce both fields to unknown when only one is missing.

**Detail demo (Candidate):** PCD `4×100 · Example` known + Centre bore `Unresolved` + Hub unknown badge as summary.

### 3. Evidence label: Manufacturer spec

- Prefer **“Manufacturer spec”** over “Mfr spec” wherever layout permits (filters chips, copy, SPECS, evidence mentions).
- Full formal name in longer copy may still read “Manufacturer specification” when space allows; chip / badge short form is **Manufacturer spec**.

---

## Design tokens

### Colour

| Token | Hex | Use |
|-------|-----|-----|
| Shell bg | `#1C1F24` | Phone background |
| Shell elevated | `#252A31` | Panels, chips, vehicle card |
| Card | `#F4F1EA` | Result / hero cards on dark |
| Card soft | `#F7F5F0` | Off-white text / card alt |
| Card foot | `#E8E4DC` | Result card footer strip |
| Ink | `#1C1F24` | Text on cream cards |
| **Steel (meta on dark)** | `#A8AEB6` | Crumbs, labels, secondary UI on charcoal — **readable** |
| Warm grey / line | `#3A3F47` | Borders, inactive controls |
| **Muted (on cream)** | `#5A6068` | Labels / refs on cream cards ≥12px |
| **Orange (action / warn)** | `#F5A623` | Primary CTAs, example/warning banners, caution callouts **only** |
| Orange dim | `#C4841A` | CTA bottom edge / dashed warn border |
| Pass | `#3D9A5F` | Fitment pass |
| Hold | `#D4A017` | Fitment hold / mods |
| Fail | `#C44B3C` | Fitment fail |
| Candidate | `#6B8CAE` | Incomplete / candidate |
| Hub unknown | `#9A7B4F` | Aggregate flag + unresolved hub field accent |

### When orange is used

- Primary buttons: Start finder, Continue to results, Log a fitment report, Log a correction
- Warning / example-data banners (dashed, sparingly)
- Related caution callout accent on detail
- **Not** used for: header frames, filter selection borders, section labels, wordmark accents, or every chip

### Typography

| Role | Family | Size (approx) |
|------|--------|----------------|
| Wordmark (home) | IBM Plex Mono Bold | 36px |
| Wordmark (compact) | IBM Plex Mono Bold | 16px |
| Screen titles | IBM Plex Mono SemiBold | 13px uppercase |
| Body / mission | IBM Plex Sans | 14–16px |
| Wheel sizes | IBM Plex Mono Bold | 17–22px |
| **Meta / crumbs / labels / footers** | IBM Plex Mono | **≥12px** on dark with `#A8AEB6` |
| State / evidence badges | IBM Plex Mono Bold/SemiBold | 11–12px |

### Spacing

- Phone padding ~14–18px horizontal
- Section gaps ~12–22px
- Card internal padding ~12–16px; list gap ~10–12px
- CTA padding ~15–16px vertical
- Frame target: **390×900** (or taller if content requires) for screenshots

---

## Hub model (implementation)

```
HubEvidence {
  pcd: { value?: string, state: "known" | "unresolved" | "unknown" }
  centreBore: { value?: string, state: "known" | "unresolved" | "unknown" }
  hubUnknownSummary: boolean  // true if pcd.state != known OR centreBore.state != known
}
```

UI rules:

1. Always render **two** fields: PCD and Centre bore.
2. If `state === known`, show `value` (Example-tagged when placeholder).
3. If unresolved/unknown, show that state in hub tan (`#9A7B4F`); do not clear the sibling field.
4. Show **Hub unknown** chip/badge only when `hubUnknownSummary === true`.
5. Copy must clarify that Hub unknown = overall hub fitment not verified — not “both fields blank.”

---

## Evidence labels

| Label | UI treatment |
|-------|----------------|
| **Confirmed** | Solid dark fill, light text |
| **Reported** | Solid outline, dark text |
| **Manufacturer spec** | Prefer this wording on chips/filters; distinct outline treatment when on a card |
| **Unverified** | Dashed grey outline |

---

## Per-screen summary

### 1. `01-home.html` — Mobile home

**Purpose:** Strong KeiFit AU branding and calm Shop Floor entry.

**Key UI:** Shop Floor kicker (≥12px steel) · KeiFit AU wordmark + AU badge · mission line · finder hero card · orange **Start fitment finder** · secondary **Browse DA16T** · evidence-note cream card mentioning Confirmed / Reported / **Manufacturer spec** / Unverified · Pass / Hold / Fail / Candidate / Hub unknown chips · workshop rule footer (≥12px).

### 2. `02-filters.html` — Vehicle / finder filters

**Purpose:** Collect vehicle + setup filters before results.

**Key UI:** Back + Fitment finder title · crumb ≥12px · **Suzuki Carry DA16T** selected · Suspension Stock / Lifted · Wheel size chips (15″ selected) · optional tyre field · Evidence filter chips: All · Confirmed · Reported · **Manufacturer spec** · Unverified · orange **Continue to results**.

### 3. `03-results.html` — Results list (DA16T)

**Purpose:** Documented Example results with independent PCD / centre bore rows and readable meta.

**Key UI:** Compact wordmark · vehicle chip · filter pills · **Example data only** banner · four cards with separate **PCD** and **Centre bore** meta rows:

| Setup (Example) | State | PCD | Centre bore | Evidence / flags |
|-----------------|-------|-----|-------------|------------------|
| 15×5.5 ET +35 / 165/60R15 | Pass | 4×100 | CB54 | Confirmed |
| 15×6.0 ET +28 / 175/55R15 | Hold | 4×100 | CB54 | Reported |
| 16×6.5 ET +20 / 195/45R16 | Fail | 4×100 | CB54 | Unverified |
| 14×5.0 ET +40 / 155/65R14 | Candidate | **4×100 · Example** | **Unresolved** | Unverified + **Hub unknown** |

Left colour rail = semantic state. Orange only on example banner + primary CTA.

### 4. `04-detail.html` — Candidate detail (mixed hub)

**Purpose:** Deep view; demonstrate independent hub fields + Hub unknown as summary.

**Key UI:** Example banner · cream hero (Candidate) · Wheel & tyre Example specs · Clearance / rubbing / mods · **Hub panel**: badge Hub unknown · copy that fields are independent · **PCD `4×100 · Example` (known)** + **Centre bore `Unresolved`** · Evidence confidence (**Unverified**; mentions Manufacturer spec in copy) · Related caution · orange **Log a correction**.

---

## Artifacts

| File | Role |
|------|------|
| `01-home.html` / `01-home.png` | Home mock + screenshot |
| `02-filters.html` / `02-filters.png` | Filters mock + screenshot |
| `03-results.html` / `03-results.png` | Results mock + screenshot |
| `04-detail.html` / `04-detail.png` | Detail mock + screenshot |
| **`FINAL_SPEC.md`** | **Source of truth for posting / PR #6** |
| `SPECS.md` | Pointer to FINAL_SPEC.md |

Frames: **390×900** (content may extend; capture full page). HTML is self-contained with Google Fonts (IBM Plex Sans + Mono).

---

## Implementation note (PR #6)

- Implement Shop Floor UI per this FINAL spec.
- UI Designer delivers mocks + this document; **UI Designer does not merge or deploy**.
- Developer owns implementation PR #6 against product codebase.

---

## Example data only disclaimer

All wheel sizes, offsets, tyres, clearance notes, hub values (including Example PCD `4×100`), refs (e.g. KF-EX-014, KF-EX-CAND-004), and outcomes shown are **Example** UI placeholders for design review. They are **not** published Confirmed fitment data. Confirmed must only appear when real evidence exists. Hub values marked Example must never be treated as bolt-pattern confirmation.

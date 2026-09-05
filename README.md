# KeiFit AU

Australian kei truck wheel, tyre and suspension fitment guide.

## Mission
Build the most useful evidence-based kei truck fitment resource for Australian owners, starting with the Suzuki Carry DA16T.

## Initial product
The first public release will help a user select a vehicle, suspension setup, wheel size and tyre size, then see documented fitment results including offset, rubbing, modification requirements and confidence level.

## Operating teams
- **KeiFit HQ** — strategy, priorities, standards and commercial decisions
- **Fitment Lab** — source, verify and structure fitment evidence
- **KeiFit Build** — website, data model, GitHub and deployment
- **Growth** — SEO, product sourcing, affiliate opportunities and monetisation

See `docs/OPERATING_SYSTEM.md` for how the teams work together.

## Evidence standard
Fitment claims should be labelled as one of:
- **Confirmed** — strong evidence from a documented real vehicle/setup
- **Reported** — owner or supplier report with incomplete supporting evidence
- **Manufacturer specification** — sourced from a credible manufacturer or primary reference
- **Unverified** — useful lead that still requires checking

## Current focus
**Vehicle:** Suzuki Carry DA16T

**Goal:** launch a useful zero/low-cost MVP before expanding to other kei platforms.

## Homepage vs Shop Floor
- **`index.html`** — website-first public homepage (Issue #8) with locked hero artwork and Fitment Finder entry panel. Styles: `css/home.css`. Behaviour: `js/home.js`.
- **Shop Floor finder pages** — `filters.html`, `results.html`, `detail.html` remain the evidence-labelled deep-link experience (Issue #7). Homepage finder submits into `filters.html` with query params only; it does not invent fitment data.

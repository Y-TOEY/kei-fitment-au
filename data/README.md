# Fitment data

Structured JSON for the DA16T MVP finder (Suzuki Carry / Super Carry).

## Public vs scaffold

- `fitments` — gated rows eligible for the public finder (empty until Fitment Lab + Quality Reviewer + Jerome approval).
- `scaffoldExamples` — non-result fixtures for schema/docs only. Never shown in public filters or results.
- Runtime also hard-excludes any row whose `id` starts with `scaffold-`, or `scaffold: true` / `visibility: "scaffold"`.

## Fields (per fitment)

| Field | Notes |
| --- | --- |
| `suspension` | e.g. stock, lifted |
| `wheelDiameterIn` | Wheel diameter in inches |
| `wheelWidthIn` | Wheel width in inches |
| `tyreSize` | e.g. 185/65R14 |
| `offsetMm` | Offset in mm, or `null` if unknown |
| `rubbing` | Rubbing notes or `unknown` |
| `modifications` | Required mods or `none documented` / `unknown` |
| `hubBoreMm` | Always `null` until measured — do not invent 54/54.1 |
| `hubBoreStatus` | Must be `unknown` / unresolved until Jerome Confirms |
| `evidenceConfidence` | Confirmed \| Reported \| Manufacturer specification \| Unverified |
| `notes` | Source / evidence notes |

## Tests

```bash
node --test tests/fitment-lib.test.js
```

Mobile smoke (manual): 320px, 375px, 414px widths — filters stack; cards readable.

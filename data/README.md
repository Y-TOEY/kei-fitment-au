# Fitment data

Structured JSON for the DA16T MVP finder.

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
| `hubBoreMm` | Always `null` until measured |
| `hubBoreStatus` | Must be `unknown` / unresolved until issue #1 is resolved — do not invent |
| `evidenceConfidence` | Confirmed \| Reported \| Manufacturer specification \| Unverified |
| `notes` | Source / evidence notes |

Scaffold rows are placeholders for UI and schema only. Do not treat them as confirmed fitments.

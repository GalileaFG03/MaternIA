---
name: Interactive card layout
description: Layout rules for pressable cards used inside wrapping grids.
---

Interactive cards used in wrapping grids must apply their layout and visual styles to the pressable root itself, rather than placing a similarly styled child view inside an unstyled pressable wrapper.

**Why:** An unstyled pressable wrapper can size itself to intrinsic content while percentage widths remain on the child, causing cards to collapse and text or icons to appear broken.

**How to apply:** When a card accepts `onPress`, make the pressable element the styled card root. Keep the non-interactive version as a styled view with the same base card styles.
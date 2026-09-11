# Momentum design system reference

Verified against the Figma screens in the Momentum file (`node-id=1:2`). The app uses a dark mobile canvas with `#090903` as the main background and DM Sans throughout.

## Tokens

| Role | Value |
| --- | --- |
| Main background | `#090903` |
| Card gradient | `#141414` → `#0A0707` |
| Evergreen accent | `#DDFB24` |
| White | `#FFFFFF` |
| Gray 200 / 300 / 400 / 500 / 600 / 700 / 800 / 900 | `#D2D2D2` / `#ADADAD` / `#8C8C8C` / `#656565` / `#525252` / `#302F2F` / `#1F1E1E` / `#141414` |
| Burnt orange | `#FFD13F`, `#FFC930`, `#FE7C1E` |
| Hot pink | `#FF4B87` |

Typography uses DM Sans Bold headings: H1 34px, H2 28px, H3 24px, H4 20px, H5 16px; body regular 16px/14px/12px and semibold controls 16px/14px/12px. Heading line heights are 1.3–1.35; body line height is 1.4.

Cards use a 24px radius, a 0.5px white stroke at 20% opacity, the card gradient above, and 12px backdrop blur. Pills use an 8px/40px radius depending on the component; workout category pills are 40px. Primary buttons use a 12px radius, 16px semibold text, evergreen fill, a subtle white border, and the green focus/shadow ring shown in Figma. Bottom navigation is a #141414 pill with a #302F2F border and evergreen shadow.

The shared primitives in `src/App.jsx` are mapped to these values so all existing screens inherit the Figma treatment. Figma also contains onboarding, nutrition, community, and dashboard screens whose structure is not currently implemented in this repository; those require feature work beyond styling.

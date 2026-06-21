# DESIGN.md - Editorial Couture Design System

## Brand & Style
This lookbook grid project is built on the **Editorial Couture** theme, capturing the essence of a high-fashion printed lookbook. Key themes are:
- **Minimalist Editorial**: Expansive whitespace, quiet luxury, curated layouts.
- **Visual Breathing Room**: Content sections separated by generous vertical padding (120px+).
- **Geometric Precision**: Rectilinear elements with completely sharp, 90-degree corners (`rounded-none`). Drop shadows are avoided entirely in favor of flat printed page hierarchy.

---

## Design Tokens

### Colors
- **Primary Canvas (Background)**: Warm Cream (`#FDFBF7` / `#FDF9F3`)
- **Typography & Details (Foreground)**: Deep Onyx Charcoal (`#1A1A1A` / `#1C1C18`)
- **Secondary Accent 1**: Soft Sage (`#8A9481` / `#586150`)
- **Secondary Accent 2**: Muted Taupe (`#E8E4DE` / `#C6C7C0` / `#DDD9D4`)

### Typography
- **Headlines / Display**: *Playfair Display* (Serif)
  - Characterized by high-contrast stroke widths and sophisticated serifs.
  - Used for hero typography, category filters, and product titles.
- **Body / Labels**: *DM Sans* (Sans-serif)
  - A highly legible, modern geometric sans-serif.
  - Used for item tags, description copy, CTA labels, and price displays.
- **Caps Label Styling**: Uppercase letters with wide letter-spacing (`tracking-widest` / `letter-spacing: 0.15em`) for metadata and navigation.

---

## Component Rules

### Product Cards
- No borders or box-shadows. The image is the absolute focus.
- On hover, the image scales smoothly to 105% over 700ms (`transition-transform duration-700 ease-out scale-105`).
- The text overlay or button slides up from the bottom with a clean transition.

### Buttons
- Primary buttons: Solid Onyx rectangular shapes, Cream text. Inverts on hover.
- Secondary buttons: Text-only with a thin Onyx underline.

### Ad Slots
- Standardized container (`min-h-[250px]`, background `neutral-50` or cream-tinted taupe, thin 1px border, uppercase tracking-widest text).
- Positioned natively within the lookbook grid to look like a curated editorial page advertisement.

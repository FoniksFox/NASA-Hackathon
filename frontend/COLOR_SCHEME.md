# NASA Bioscience Explorer - Color Scheme

This document describes the custom color palette used throughout the application.

## Color Palette

### Primary Colors

#### 🌿 Mint (Primary Brand Color)
- **Main**: `#4db391`
- **Usage**: Primary actions, active states, highlights
- **Mantine Name**: `mint`
- **Shades**: 0 (lightest) to 9 (darkest)

#### 🌊 Zomp (Secondary Brand Color)
- **Main**: `#3c9779`
- **Usage**: Secondary actions, accents, hover states
- **Mantine Name**: `zomp`
- **Shades**: 0 (lightest) to 9 (darkest)

### Neutral Colors

#### ⚪ Light (Anti-flash White)
- **Main**: `#ebebeb`
- **Usage**: Light mode backgrounds, borders, subtle elements
- **Mantine Name**: `light`
- **Shades**: 0 (lightest) to 9 (darkest)

#### ⚫ Dark (Jet)
- **Main**: `#323232`
- **Usage**: Dark mode backgrounds, medium contrast elements
- **Mantine Name**: `dark`
- **Shades**: 0 (lightest) to 9 (darkest)

#### ⬛ Darker (Eerie Black)
- **Main**: `#222222`
- **Usage**: Dark mode deepest backgrounds, highest contrast
- **Mantine Name**: `darker`
- **Shades**: 0 (lightest) to 9 (darkest)

## Color Usage Guide

### Component Color Mapping

#### BrowserHeader
- **Background**: `light-0` / `darker-7`
- **Borders**: `light-5` / `dark-5`
- **Tab Inactive**: `light-1` / `dark-6`
- **Tab Hover**: `light-2` / `dark-5`
- **Tab Active**: `light-4` / `darker-6`
- **Active Indicator**: `mint-4`
- **Text**: `dark-4` / `light-3`

#### Sidebar
- **Background**: `light-0` / `darker-7`
- **Borders**: `light-5` / `dark-5`
- **Workspace Item Hover**: `light-1` / `dark-6`
- **Workspace Active**: `mint-1` / `zomp-7`
- **Workspace Active Text**: `zomp-6` / `mint-2`
- **UMAP Section Background**: `light-1` / `darker-8`
- **UMAP Placeholder**: `light-2` / `dark-6`

#### PublicationViewer
- **Title Text**: `darker-5` / `light-0`
- **Body Text**: `darker-4` / `light-2`

## Theme Configuration

The theme is configured in `src/theme.ts` with the following settings:

```typescript
{
  primaryColor: 'mint',
  white: '#ebebeb',
  black: '#222222',
  primaryShade: { light: 4, dark: 3 }
}
```

## Accessibility Notes

- All text/background color combinations meet WCAG 2.1 AA standards for contrast
- Primary mint color provides strong visual feedback without being overwhelming
- Neutral palette ensures readability in both light and dark modes
- Consistent color naming convention across all components

## Using Colors in Components

### In CSS Modules
```css
.element {
  background-color: light-dark(
    var(--mantine-color-light-0),
    var(--mantine-color-darker-7)
  );
  color: light-dark(
    var(--mantine-color-darker-5),
    var(--mantine-color-light-0)
  );
  border: 1px solid light-dark(
    var(--mantine-color-light-5),
    var(--mantine-color-dark-5)
  );
}
```

### In JSX with Mantine Components
```tsx
<Button color="mint">Primary Action</Button>
<Button color="zomp">Secondary Action</Button>
<Badge color="mint" variant="light">Tag</Badge>
```

## Color Tokens Reference

| Color Name | Light Mode | Dark Mode | Usage |
|------------|-----------|-----------|--------|
| Brand Primary | Mint | Mint | Primary CTAs, active states |
| Brand Secondary | Zomp | Zomp | Secondary CTAs, accents |
| Background | Light-0 | Darker-7 | Main backgrounds |
| Surface | Light-1 | Darker-8 | Card/panel surfaces |
| Border | Light-5 | Dark-5 | Dividers, borders |
| Text Primary | Darker-5 | Light-0 | Headings, important text |
| Text Secondary | Darker-4 | Light-2 | Body text, descriptions |
| Text Tertiary | Dark-4 | Light-3 | Subtle text, placeholders |

## Future Enhancements

- [ ] Add color palette showcase page
- [ ] Create theme switcher component
- [ ] Add custom color variants for specific components
- [ ] Define semantic color tokens (success, warning, error, info)
- [ ] Add gradient definitions using mint/zomp combinations

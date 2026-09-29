/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#3A3A3A',
    tint: '#7BC9A8',
    background: '#FBF8F3',
    foreground: '#3A3A3A',
    card: '#FFFFFF',
    cardForeground: '#3A3A3A',
    primary: '#7BC9A8',
    primaryForeground: '#FFFFFF',
    secondary: '#C9B6E4',
    secondaryForeground: '#3A3A3A',
    muted: '#F2F2F2',
    mutedForeground: '#8A8A8A',
    accent: '#A8E6CF',
    accentForeground: '#3A3A3A',
    destructive: '#C96D75',
    destructiveForeground: '#FFFFFF',
    border: '#E8D9C3',
    input: '#E8D9C3',
    mint: '#A8E6CF',
    mintDark: '#7BC9A8',
    beige: '#F5EBDD',
    beigeDark: '#E8D9C3',
    lilac: '#C9B6E4',
    lilacDark: '#A88FCC',
    white: '#FFFFFF',
  },
  radius: 20,
};

export default colors;

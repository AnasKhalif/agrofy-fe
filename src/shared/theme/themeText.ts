import { SxProps } from "@mui/material";

// NOTE: The attached style guide image was used as the basis for these
// tokens. Exact pixel values were inferred where the guide only showed
// relative sizes. Assumptions made: headings use fontWeight 600, body text
// uses 400/500, and line-heights are represented as numeric multiples (eg 1.2)
// which work well with MUI.

// Define explicit token names so editors and TypeScript can provide
// property autocompletion when you type `ThemeText.` in a component.
export interface ThemeTextTokens {
    // Hero Text (large display used for hero)
    HeroH1: SxProps; // 56/120
    HeroH2: SxProps; // 48/120
    HeroH3: SxProps; // 40/120
    HeroH4: SxProps; // 32/120
    HeroH5: SxProps; // 24/120
    HeroH6: SxProps; // 20/120

    // Heading Text (page headings)
    HeadingH1: SxProps; // 40/120
    HeadingH2: SxProps; // 32/120
    HeadingH3: SxProps; // 24/120
    HeadingH4: SxProps; // 18/120
    HeadingH5: SxProps; // 16/120
    HeadingH6: SxProps; // 14/120

    // Body Text
    BodyXL: SxProps; // 20/140
    BodyXLRegular: SxProps; // 20/140 regular
    BodyL: SxProps; // 18/140
    BodyLRegular: SxProps; // 18/140 regular
    BodyM: SxProps; // 16/140
    BodyMRegular: SxProps; // 16/140 regular
    BodyS: SxProps; // 14/140
    BodySRegular: SxProps; // 14/140 regular
    BodySBold: SxProps; // 14/140 bold
    BodyXS: SxProps; // 12/140
    BodyXSRegular: SxProps; // 12/140 regular

    // Caption Text
    CaptionNormal: SxProps; // 14/140
    CaptionNormalBold: SxProps; // 14/140 bold
    CaptionSmall: SxProps; // 12/140
    CaptionSmallBold: SxProps; // 12/140 bold

    // Italic Text
    ItalicLRegular: SxProps; // 18/140 italic regular
    ItalicLBold: SxProps; // 18/140 italic bold
    ItalicSRegular: SxProps; // 14/140 italic regular
    ItalicSBold: SxProps; // 14/140 italic bold
    ItalicXSRegular: SxProps; // 12/140 italic regular
    ItalicXSBold: SxProps; // 12/140 italic bold

    // Display Text (extra-large display scale)
    DisplayH1: SxProps; // 80/120
    DisplayH2: SxProps; // 72/120
    DisplayH3: SxProps; // 64/120
    DisplayH4: SxProps; // 56/120
    DisplayH5: SxProps; // 48/120
    DisplayH6: SxProps; // 40/120

    // Small helpers
    Button: SxProps;
    Overline: SxProps;
}

export type ThemeTextKey = keyof ThemeTextTokens;

export const ThemeText: ThemeTextTokens = {
    // Hero Text (56/48/40/32/24/20 with 120% line-height)
    HeroH1: { fontSize: 56, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    HeroH2: { fontSize: 48, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    HeroH3: { fontSize: 40, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    HeroH4: { fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    HeroH5: { fontSize: 24, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    HeroH6: { fontSize: 20, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },

    // Heading Text (40/32/24/18/16/14 with 120% line-height)
    HeadingH1: { fontSize: 40, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    HeadingH2: { fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    HeadingH3: { fontSize: 24, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    HeadingH4: { fontSize: 18, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    HeadingH5: { fontSize: 16, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    HeadingH6: { fontSize: 14, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },

    // Body Text (XL / L / M / S / XS with 140% line-height)
    BodyXL: { fontSize: 20, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-2%' },
    BodyXLRegular: { fontSize: 20, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2%' },
    BodyL: { fontSize: 18, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-2%' },
    BodyLRegular: { fontSize: 18, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2%' },
    BodyM: { fontSize: 16, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-2%' },
    BodyMRegular: { fontSize: 16, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2%' },
    BodyS: { fontSize: 14, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-2%' },
    BodySRegular: { fontSize: 14, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2%' },
    BodySBold: { fontSize: 14, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-2%' },
    BodyXS: { fontSize: 12, fontWeight: 600, lineHeight: 1.4, letterSpacing: '-2%' },
    BodyXSRegular: { fontSize: 12, fontWeight: 400, lineHeight: 1.4, letterSpacing: '-2%' },

    // Caption Text (Normal/Small with bold variants)
    CaptionNormal: { fontSize: 14, fontWeight: 400, lineHeight: 1.4, letterSpacing: '0' },
    CaptionNormalBold: { fontSize: 14, fontWeight: 700, lineHeight: 1.4, letterSpacing: '6%' },
    CaptionSmall: { fontSize: 12, fontWeight: 400, lineHeight: 1.4, letterSpacing: '0' },
    CaptionSmallBold: { fontSize: 12, fontWeight: 700, lineHeight: 1.4, letterSpacing: '6%' },

    // Italic Text
    ItalicLRegular: { fontSize: 18, fontWeight: 400, fontStyle: 'italic', lineHeight: 1.4 },
    ItalicLBold: { fontSize: 18, fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4 },
    ItalicSRegular: { fontSize: 14, fontWeight: 400, fontStyle: 'italic', lineHeight: 1.4 },
    ItalicSBold: { fontSize: 14, fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4 },
    ItalicXSRegular: { fontSize: 12, fontWeight: 400, fontStyle: 'italic', lineHeight: 1.4 },
    ItalicXSBold: { fontSize: 12, fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4 },

    // Display Text (extra-large scale)
    DisplayH1: { fontSize: 80, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    DisplayH2: { fontSize: 72, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    DisplayH3: { fontSize: 64, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    DisplayH4: { fontSize: 56, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    DisplayH5: { fontSize: 48, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    DisplayH6: { fontSize: 40, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },

    // Buttons, labels - keep uppercase overline and spacing
    Button: { fontSize: 14, fontWeight: 600, lineHeight: 1.25, letterSpacing: '0.02em' },
    Overline: { fontSize: 11, fontWeight: 600, lineHeight: 1.33, letterSpacing: '0.08em', textTransform: 'uppercase' },
};

export default ThemeText;
// Single source of truth for the Zeona colour system.
//
// The palette is sampled from the artwork itself:
//   - `gold400` is the exact fill used in /images/logo.svg
//   - the espresso surfaces come from the shadow tones of /images/background.png
// Every component imports from here so panels, text and borders stay in sync
// whenever the background or logo changes.

export const colors = {
  // Gold ramp (light -> dark)
  gold100: "#FBEBC0",
  gold200: "#F3D99A",
  gold300: "#E9C47C",
  gold400: "#CE9F54", // brand gold (logo)
  gold600: "#8F6A2E",

  // Neutrals
  ivory: "#FFF6E4",
  tan: "#C9B28C", // secondary text on dark glass

  // Silver, warmed so it sits naturally next to the brown/gold artwork
  platinum100: "#FFFFFF",
  platinum300: "#E4DFD6",
  platinum500: "#B5AEA2",

  // Market direction
  rise: "#6EE1A5",
  fall: "#FF8F80",
};

export const gradients = {
  // Vertical gradients so they read the same however wide the text box is.
  goldText: `linear-gradient(180deg, ${colors.gold100} 0%, ${colors.gold300} 55%, ${colors.gold400} 100%)`,
  // Lighter ramp for text that sits directly on the bright artwork
  goldOnArt: `linear-gradient(180deg, #FFFBEF 0%, ${colors.gold100} 55%, ${colors.gold200} 100%)`,
  goldValue: `linear-gradient(180deg, #FFF8E6 0%, ${colors.gold200} 50%, #D9AE66 100%)`,
  platinumText: `linear-gradient(180deg, ${colors.platinum100} 0%, ${colors.platinum300} 55%, ${colors.platinum500} 100%)`,

  goldBorder:
    "linear-gradient(135deg, rgba(251,235,192,0.55) 0%, rgba(206,159,84,0.14) 45%, rgba(251,235,192,0.38) 100%)",
  platinumBorder:
    "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(181,174,162,0.12) 45%, rgba(255,255,255,0.32) 100%)",

  // Hairline that fades out at both ends (row dividers, rules)
  goldRule:
    "linear-gradient(90deg, transparent 0%, rgba(233,196,124,0.32) 50%, transparent 100%)",
};

// Recessed "display" behind the live prices.
export const well = "linear-gradient(180deg, rgba(8,4,2,0.72) 0%, rgba(22,11,5,0.62) 100%)";

// Turns a gradient into text fill. Don't combine with text-shadow (it would show
// through the transparent glyphs) — use filter: drop-shadow instead.
export const gradientText = (gradient) => ({
  backgroundImage: gradient,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
});

// 1px gradient hairline drawn with a masked ::before, so the border can be a
// gradient while still following border-radius.
export const hairlineBorder = (gradient) => ({
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    padding: "1px",
    borderRadius: "inherit",
    background: gradient,
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none",
  },
});

// Warm espresso glass used by every panel on the screen.
export const glassPanel = (tone = "gold") => {
  const isGold = tone === "gold";
  const sheen = isGold ? "rgba(233,196,124,0.10)" : "rgba(255,255,255,0.07)";

  return {
    position: "relative",
    overflow: "hidden",
    background: `radial-gradient(120% 90% at 0% 0%, ${sheen} 0%, transparent 55%), linear-gradient(145deg, rgba(44,23,11,0.72) 0%, rgba(17,8,4,0.86) 100%)`,
    backdropFilter: "blur(14px) saturate(115%)",
    WebkitBackdropFilter: "blur(14px) saturate(115%)",
    boxShadow:
      "0 1.1vw 3vw rgba(0,0,0,0.5), inset 0 1px 0 rgba(251,235,192,0.16), inset 0 -1px 0 rgba(0,0,0,0.45)",
    ...hairlineBorder(isGold ? gradients.goldBorder : gradients.platinumBorder),
  };
};

// Staggered entrance used by the page sections (keyframes live in index.css).
export const fadeUp = (delay = "0s") => ({
  animation: `fadeUp 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) ${delay} backwards`,
});

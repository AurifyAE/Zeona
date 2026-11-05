import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";
import {
  colors,
  gradients,
  well,
  gradientText,
  glassPanel,
} from "../theme/luxury";

// Defined at module level (not inside SpotRate) so React keeps these mounted
// between price ticks. Declaring them inside the component remounts the whole
// subtree on every update, which would restart every animation below.

const FLASH = {
  rise: {
    background:
      "linear-gradient(180deg, rgba(58,166,110,0.95) 0%, rgba(24,98,62,0.97) 100%)",
    border: "1px solid rgba(110,225,165,0.9)",
    animation: "pulseRise 0.9s ease-out",
  },
  fall: {
    background:
      "linear-gradient(180deg, rgba(170,52,52,0.95) 0%, rgba(110,24,32,0.97) 100%)",
    border: "1px solid rgba(255,143,128,0.9)",
    animation: "pulseFall 0.9s ease-out",
  },
};

const RateBox = ({
  label,
  value,
  dir,
  isSilver,
  lowHighLabel,
  lowHighValue,
}) => {
  const flash = FLASH[dir];
  const accent = isSilver ? colors.platinum300 : colors.gold300;
  const restingBorder = isSilver
    ? "1px solid rgba(228,223,214,0.14)"
    : "1px solid rgba(233,196,124,0.2)";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "13px", md: "1.05vw" },
          color: accent,
          letterSpacing: "0.34em",
          paddingLeft: "0.34em", // optically re-centre the tracked text
          mb: "0.45vw",
        }}
      >
        {label}
      </Typography>

      {/* Recessed price well */}
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          background: flash ? flash.background : well,
          border: flash ? flash.border : restingBorder,
          borderRadius: "0.9vw",
          py: "0.5vw",
          px: "1vw",
          boxShadow:
            "inset 0 2px 10px rgba(0,0,0,0.55), 0 1px 0 rgba(251,235,192,0.07)",
          transition: "border-color 0.4s ease",
          animation: flash?.animation,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "22px", md: "3.4vw" },
            letterSpacing: "0.02em",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.1,
            ...(flash
              ? { color: "#fff", WebkitTextFillColor: "#fff" }
              : {
                  ...gradientText(
                    isSilver ? gradients.platinumText : gradients.goldValue,
                  ),
                  filter: "drop-shadow(0 0 0.9vw rgba(233,196,124,0.18))",
                }),
          }}
        >
          {value || "--"}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: { xs: "12px", md: "1.15vw" },
          color: colors.tan,
          mt: "0.5vw",
          letterSpacing: "0.16em",
        }}
      >
        {lowHighLabel}{" "}
        <Box
          component="span"
          sx={{
            color: lowHighLabel === "LOW" ? colors.rise : colors.fall,
            ml: "0.4vw",
            letterSpacing: "0.04em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {lowHighValue || "--"}
        </Box>
      </Typography>
    </Box>
  );
};

const MetalPanel = ({ data, bidDir, askDir, theme }) => {
  const isSilver = theme === "silver";
  const title = isSilver ? "SILVER" : "GOLD";
  const imageSrc = isSilver ? "/images/silver-bar.png" : "/images/gold-bar.png";
  const haloColor = isSilver ? "228,223,214" : "233,196,124";

  return (
    <Box
      sx={{
        ...glassPanel(isSilver ? "platinum" : "gold"),
        borderRadius: "1.7vw",
        padding: {
          xs: "4vw 5vw",
          md: "1.1vw 1.8vw",
        },
        display: "grid",
        alignItems: "center",
        gap: "0.8vw",
        gridTemplateColumns: "1fr 1fr 1fr",
      }}
    >
      {/* Metal identity */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "0.7vw",
          width: "100%",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "36px", sm: "48px", md: "4vw" },
            height: { xs: "36px", sm: "48px", md: "4vw" },
            // soft light pool behind the bar
            "&::before": {
              content: '""',
              position: "absolute",
              inset: "-40%",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${haloColor},0.26) 0%, rgba(${haloColor},0) 68%)`,
            },
          }}
        >
          <Box
            className="animate-float"
            component="img"
            src={imageSrc}
            alt={title}
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 0.4vw 0.7vw rgba(0,0,0,0.5))",
            }}
          />
        </Box>

        <Box
          sx={{
            fontSize: { xs: "16px", md: "2vw" },
            letterSpacing: "0.22em",
            paddingLeft: "0.22em", // optically re-centre the tracked text
            lineHeight: 1,
            ...gradientText(
              isSilver ? gradients.platinumText : gradients.goldText,
            ),
          }}
        >
          {title}
        </Box>
      </Box>

      <RateBox
        label="BID"
        value={data.bid}
        dir={bidDir}
        isSilver={isSilver}
        lowHighLabel="LOW"
        lowHighValue={data.low}
      />

      <RateBox
        label="ASK"
        value={data.ask}
        dir={askDir}
        isSilver={isSilver}
        lowHighLabel="HIGH"
        lowHighValue={data.high}
      />
    </Box>
  );
};

const SpotRate = () => {
  const { goldData, silverData } = useSpotRate();

  const [goldBidDir, setGoldBidDir] = useState("neutral");
  const [goldAskDir, setGoldAskDir] = useState("neutral");
  const [silverBidDir, setSilverBidDir] = useState("neutral");
  const [silverAskDir, setSilverAskDir] = useState("neutral");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.screen.width <= 768); // 🔥 screen.width ignores zoom
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const prev = useRef({
    goldBid: null,
    goldAsk: null,
    silverBid: null,
    silverAsk: null,
    platinumBid: null,
    platinumAsk: null,
  });

  const detectChange = (prevVal, currVal, setDir) => {
    if (prevVal === null) return currVal;

    if (currVal > prevVal) {
      setDir("rise");
      setTimeout(() => setDir("neutral"), 800);
    } else if (currVal < prevVal) {
      setDir("fall");
      setTimeout(() => setDir("neutral"), 800);
    }

    return currVal;
  };

  useEffect(() => {
    prev.current.goldBid = detectChange(
      prev.current.goldBid,
      goldData.bid,
      setGoldBidDir,
    );
  }, [goldData.bid]);

  useEffect(() => {
    prev.current.goldAsk = detectChange(
      prev.current.goldAsk,
      goldData.ask,
      setGoldAskDir,
    );
  }, [goldData.ask]);

  useEffect(() => {
    prev.current.silverBid = detectChange(
      prev.current.silverBid,
      silverData.bid,
      setSilverBidDir,
    );
  }, [silverData.bid]);

  useEffect(() => {
    prev.current.silverAsk = detectChange(
      prev.current.silverAsk,
      silverData.ask,
      setSilverAskDir,
    );
  }, [silverData.ask]);

  return (
    <Box
      sx={{
        display: "grid",
        gap: "1.1vw",
        width: "100%",
        alignItems: "end",
        marginTop: {
          xs: "20px", // mobile
          sm: "0vw", // small tablets
        },
        gridTemplateColumns: { xs: "1fr" },
      }}
    >
      <MetalPanel
        data={goldData}
        bidDir={goldBidDir}
        askDir={goldAskDir}
        theme="gold"
      />

      <MetalPanel
        data={silverData}
        bidDir={silverBidDir}
        askDir={silverAskDir}
        theme="silver"
      />
    </Box>
  );
};

export default SpotRate;

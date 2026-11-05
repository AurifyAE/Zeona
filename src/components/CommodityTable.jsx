import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";
import { colors, gradients, glassPanel } from "../theme/luxury";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";

const OUNCE = 31.103;
const AED = 3.674;

const UNIT_MULTIPLIER = {
  GM: 1,
  KG: 1000,
  TTB: 116.64,
  TOLA: 11.664,
  OZ: 31.103,
};

const CommodityTable = ({ title, items }) => {
  const { goldData, silverData } = useSpotRate();

  // ✅ FIXED: Minted bars treated as gold
  const getSpot = (metal) => {
    const lower = metal?.toLowerCase() || "";

    if (lower.includes("gold") || lower.includes("minted")) {
      return goldData; // ✅ minted uses gold spot
    }

    if (lower.includes("silver")) return silverData;

    return null;
  };

  const purityFactor = (purity) => {
    if (!purity) return 1;
    const num = Number(purity);
    if (isNaN(num) || num <= 0) return 1;
    if (num <= 1) return num;
    if (num <= 100) return num / 100;
    if (num <= 1000) return num / 1000;
    if (num <= 10000) return num / 10000;
    return num / 10 ** Math.floor(Math.log10(num) + 1);
  };

  const formatPrice = (value) => {
    if (value == null || isNaN(value)) return "—";

    const intLen = Math.floor(Math.abs(value)).toString().length;

    let decimals = 3;
    if (intLen >= 4) decimals = 0;
    else if (intLen === 3) decimals = 2;

    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const rows =
    items
      ?.map((item) => {
        const spot = getSpot(item.metal);
        // 🔥 IMPORTANT: fallback to goldData
        const effectiveSpot = spot || goldData;
        if (!effectiveSpot) return null;

        const spotBid = Number(effectiveSpot.bid);
        const spotAsk = Number(effectiveSpot.ask);

        // Check if live rates have loaded from the socket yet
        const liveRatesLoaded = spotBid > 0 && spotAsk > 0;

        const mult = UNIT_MULTIPLIER[item.weight] || 1;
        const pur = purityFactor(item.purity);
        const unitValue = Number(item.unit) || 1;

        const weightInGrams = mult * unitValue;
        const buyPremium = Number(item.buyPremium) || 0;
        const buyCharge = Number(item.buyCharge) || 0;
        const sellPremium = Number(item.sellPremium) || 0;
        const sellCharge = Number(item.sellCharge) || 0;

        const bid = liveRatesLoaded
          ? ((spotBid + buyPremium) / OUNCE) * AED * weightInGrams * pur +
            buyCharge
          : null;

        const ask = liveRatesLoaded
          ? ((spotAsk + sellPremium) / OUNCE) * AED * weightInGrams * pur +
            sellCharge
          : null;

        return {
          metal_name: item.metal_name,
          purity: item.purity,
          metal: item.metal,
          unit: `${unitValue} ${item.weight}`,
          bid,
          ask,
        };
      })
      .filter(Boolean) ?? [];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const PURITY_TO_KARAT = {
    9999: "24K", // 99.99%
    999.9: "24K", // 99.99%
    999: "24K", // 99.9%
    995: "24K", // Swiss bullion / investment gold

    958: "23K", // 95.8%
    950: "23K",

    920: "22K", // Some regional jewellery standards
    916: "22K", // Standard 22K
    900: "21.6K",

    875: "21K",

    833: "20K",

    750: "18K",

    708: "17K",

    700: "16.8K",
    666: "16K",

    625: "15K",

    585: "14K", // Standard 14K
    583: "14K", // Russian standard

    500: "12K",

    417: "10K",

    375: "9K",
  };

  const getPurityLabel = (purity) => {
    return PURITY_TO_KARAT[purity] || purity;
  };
  // ❌ No data → don't render section
  if (!rows.length) return null;

  // Only fade the top/bottom edges when rows actually scroll; with <= 5 rows the
  // table is static and every row should stay fully visible.
  const isScrolling = rows.length > 5;

  const COLUMNS = "2fr 0.8fr 1.1fr 1.1fr";

  const headCell = (textAlign) => ({
    fontSize: { xs: "11px", md: "0.95vw" },
    color: colors.gold300,
    letterSpacing: "0.24em",
    textAlign,
  });

  return (
    <Box
      sx={{
        ...glassPanel("gold"),
        width: "100%",
        borderRadius: "1.5vw",
        padding: ".3vw 1vw 0 1vw",
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: COLUMNS,
          py: "0.9vw",
          px: "1.2vw",
          alignItems: "center",
          // fading gold rule under the header
          "&::after": {
            content: '""',
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "1px",
            background: gradients.goldRule,
          },
        }}
      >
        <Typography sx={headCell("start")}>COMMODITY</Typography>
        <Typography sx={headCell("center")}>UNIT</Typography>
        <Typography sx={headCell("center")}>BID</Typography>
        <Typography sx={headCell("center")}>ASK</Typography>
      </Box>

      {/* Rows Container */}
      <Box
        sx={{
          mt: "0.4vw",
          ...(isScrolling && {
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)",
          }),
        }}
      >
        <Swiper
          direction="vertical"
          slidesPerView={5}
          loop={true}
          modules={[Autoplay]}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={3000}
          style={{
            height: isMobile ? "35vw" : "20vw",
            background: "transparent",
            overflow: "hidden",
          }}
        >
          {rows.map((row, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: COLUMNS,
                  alignItems: "center",
                  py: "0.7vw",
                  px: "1.2vw",
                  height: "100%",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "1px",
                    background: gradients.goldRule,
                    opacity: 0.55,
                  },
                }}
              >
                {/* Name + purity badge */}
                <Typography
                  sx={{
                    fontSize: { xs: "13px", md: "1.5vw" },
                    color: colors.ivory,
                    textAlign: "start",
                    lineHeight: "1.2",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    whiteSpace: "nowrap",
                    gap: "0.6vw",
                  }}
                >
                  {row.metal_name ? row.metal_name : row.metal}
                  {row.purity && (
                    <Box
                      component="span"
                      sx={{
                        fontSize: { xs: "10px", md: "0.8vw" },
                        letterSpacing: "0.1em",
                        color: colors.gold300,
                        border: "1px solid rgba(233,196,124,0.4)",
                        background: "rgba(206,159,84,0.1)",
                        borderRadius: "999px",
                        padding: "0.1vw 0.55vw",
                        lineHeight: 1.3,
                      }}
                    >
                      {/* {getPurityLabel(row.purity)} */}
                      {row.purity}
                    </Box>
                  )}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "12px", md: "1.1vw" },
                    color: colors.tan,
                    letterSpacing: "0.08em",
                    textAlign: "center",
                  }}
                >
                  {row.unit}
                </Typography>

                {/* BID — champagne gold */}
                <Typography
                  sx={{
                    fontSize: { xs: "13px", md: "1.5vw" },
                    color: colors.gold200,
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatPrice(row.bid)}
                </Typography>

                {/* ASK — ivory */}
                <Typography
                  sx={{
                    fontSize: { xs: "13px", md: "1.5vw" },
                    color: colors.ivory,
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatPrice(row.ask)}
                </Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default CommodityTable;

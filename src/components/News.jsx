import React from "react";
import { Box, Typography } from "@mui/material";
import Marquee from "react-fast-marquee";
import { colors, gradients, gradientText } from "../theme/luxury";

const EDGE_FADE =
  "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)";

const NewsTicker = ({ newsItems = [] }) => {
  const items =
    newsItems.length > 0
      ? newsItems
      : [{ description: "Welcome to Zelora Gold Updates" }];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {
          xs: "38px",
          md: "2.9vw",
        },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        background:
          "linear-gradient(90deg, rgba(14,7,3,0.94) 0%, rgba(34,18,8,0.9) 50%, rgba(14,7,3,0.94) 100%)",
        boxShadow: "0 -6px 24px rgba(0, 0, 0, 0.5)",
        // gold hairline on the top edge, bright in the middle and fading out
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, rgba(206,159,84,0.05) 0%, rgba(251,235,192,0.75) 50%, rgba(206,159,84,0.05) 100%)",
        },
      }}
    >
      {/* LEFT BRAND SECTION */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1.2vw",
          pl: "2vw",
          pr: "1.2vw",
          height: "100%",
          flexShrink: 0,
          background:
            "linear-gradient(90deg, rgba(206,159,84,0.16) 0%, rgba(206,159,84,0) 100%)",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "12px", md: "1vw" },
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            ...gradientText(gradients.goldText),
          }}
        >
          Zelora Gold Updates
        </Typography>

        <Box
          sx={{
            width: "1px",
            height: "55%",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(233,196,124,0.6) 50%, transparent 100%)",
          }}
        />
      </Box>

      {/* NEWS TICKER */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          height: "100%",
          display: "flex",
          alignItems: "center",
          maskImage: EDGE_FADE,
          WebkitMaskImage: EDGE_FADE,
        }}
      >
        <Marquee
          speed={40}
          gradient={false}
          autoFill={true}
          loop={0}
          direction="left"
        >
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1.5vw",
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: colors.ivory,
                  fontSize: { xs: "12px", md: "1.15vw" },
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  mx: "1.5vw",
                  lineHeight: "1",
                }}
              >
                {item?.description || ""}
              </Typography>
              {/* diamond separator */}
              <span
                style={{
                  color: colors.gold400,
                  fontSize: "0.7vw",
                  marginRight: "1vw",
                }}
              >
                ◆
              </span>
            </Box>
          ))}
        </Marquee>
      </Box>
    </Box>
  );
};

export default NewsTicker;

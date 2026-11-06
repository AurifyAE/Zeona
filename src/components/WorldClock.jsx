import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { colors, glassPanel } from "../theme/luxury";

const clockConfig = [
  {
    key: "uae",
    label: "UAE",
    timeZone: "Asia/Dubai",
    flag: "/images/uae.png",
  },

  {
    key: "london",
    label: "LONDON",
    timeZone: "Europe/London",
    flag: "/images/uk.png",
  },
  {
    key: "usa",
    label: "USA",
    timeZone: "America/New_York",
    flag: "/images/usa.png",
  },
];

const WorldClockHorizontal = () => {
  const [times, setTimes] = useState({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      const updatedTimes = {};

      clockConfig.forEach((clock) => {
        updatedTimes[clock.key] = now.toLocaleTimeString("en-US", {
          ...timeOptions,
          timeZone: clock.timeZone,
        });
      });

      setTimes(updatedTimes);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gap: "1vw",
        width: "100%",
      }}
    >
      {clockConfig.map((clock) => (
        <Box
          key={clock.key}
          sx={{
            ...glassPanel("gold"),
            display: "flex",
            alignItems: "center",
            gap: {
              xs: "10px",
              lg: "0.9vw",
            },
            padding: "0.45vw 1.3vw",
            borderRadius: "0.9vw",
            boxShadow:
              "0 0.5vw 1.4vw rgba(0,0,0,0.4), inset 0 1px 0 rgba(251,235,192,0.14)",
          }}
        >
          <Box
            sx={{
              width: {
                xs: "30px",
                lg: "3vw",
              },
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              boxShadow:
                "0 0 0 1px rgba(251,235,192,0.28), 0 0.2vw 0.5vw rgba(0,0,0,0.55)",
            }}
          >
            <img
              src={clock.flag}
              alt={clock.label}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
              gap: "0.15vw",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "13px",
                  lg: "0.9vw",
                },
                color: colors.gold300,
                letterSpacing: "0.24em",
                lineHeight: 1,
              }}
            >
              {clock.label}
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "14px",
                  lg: "1.3vw",
                },
                color: colors.ivory,
                letterSpacing: "0.04em",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.1,
              }}
            >
              {times[clock.key] || "--:--"}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default WorldClockHorizontal;

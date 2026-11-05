import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { colors, gradients, gradientText } from "../theme/luxury";

const SystemClock = () => {
  const [timeData, setTimeData] = useState({
    day: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const DAYS = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ];

      const dayStr = DAYS[now.getDay()];
      const MONTHS = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];

      const dateStr = `${String(now.getDate()).padStart(2, "0")} ${
        MONTHS[now.getMonth()]
      } ${now.getFullYear()}`;

      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setTimeData({
        day: dayStr,
        date: dateStr,
        time: timeStr,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.4vw",
          width: "100%",
          padding: "0vw 2.5vw",
        }}
      >
        {/* Date */}
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "2vw" },
            letterSpacing: "0.14em",
            lineHeight: 1,
            filter:
              "drop-shadow(0 0 0.5vw rgba(24,10,3,0.9)) drop-shadow(0 2px 6px rgba(0,0,0,0.7))",
            ...gradientText(gradients.goldOnArt),
          }}
        >
          {timeData.date || "-- --- ----"}
        </Typography>

        {/* Hairline divider */}
        <Box
          sx={{
            width: "1px",
            height: { xs: "14px", sm: "1.5vw" },
            background:
              "linear-gradient(180deg, transparent 0%, rgba(233,196,124,0.7) 50%, transparent 100%)",
          }}
        />

        {/* Day */}
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "1vw" },
            color: colors.tan,
            letterSpacing: "0.36em",
            lineHeight: 1,
            textShadow: "0 0 0.5vw rgba(24,10,3,0.9), 0 2px 6px rgba(0,0,0,0.7)",
          }}
        >
          {timeData.day || "-----"}
        </Typography>
      </Box>
    </Box>
  );
};

export default SystemClock;

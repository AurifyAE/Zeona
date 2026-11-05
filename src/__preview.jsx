// TEMPORARY – renders the real TvScreen with mocked data.
import "./__preview_mock";
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { SpotRateProvider, useSpotRate } from "./context/SpotRateContext";
import TvScreen from "./pages/tvscreenView";
import "./App.css";
import "./index.css";

const bump = new URLSearchParams(location.search).get("bump");

const Injector = () => {
  const { updateMarketData } = useSpotRate();
  useEffect(() => {
    const set = (g, s) =>
      updateMarketData(
        { Gold: { bid: g, low: 4498.1, high: 4541.7 }, Silver: { bid: s, low: 51.9, high: 53.2 } },
        0, 1, 0, 0.05,
      );
    set(4521.3, 52.41);
    if (bump) setTimeout(() => set(4526.8, 52.38), 600);
  }, []);
  return null;
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SpotRateProvider>
      <Injector />
      <TvScreen />
    </SpotRateProvider>
  </BrowserRouter>,
);

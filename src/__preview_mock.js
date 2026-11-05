// TEMPORARY – mocks the backend so the real TvScreen can render with data.
import axios from "axios";

const qs = new URLSearchParams(location.search);
const extra = qs.get("rows") === "many";

const base = [
  { metal: "Gold", metal_name: "Gold", purity: 9999, weight: "GM", unit: 1 },
  { metal: "Gold", metal_name: "Gold Kilobar", purity: 995, weight: "KG", unit: 1 },
  { metal: "Gold", metal_name: "Gold Kilobar", purity: 9999, weight: "KG", unit: 1 },
  { metal: "Gold", metal_name: "Gold Ten TOLA", purity: 999, weight: "TTB", unit: 1 },
  { metal: "Silver", metal_name: "Silver", purity: 9999, weight: "KG", unit: 1 },
];
const more = [
  { metal: "Gold", metal_name: "Gold Tola", purity: 999, weight: "TOLA", unit: 1 },
  { metal: "Gold", metal_name: "Gold Coin", purity: 916, weight: "GM", unit: 10 },
  { metal: "Silver", metal_name: "Silver Bar", purity: 999, weight: "KG", unit: 5 },
];

const respond = (config, data) => ({ data, status: 200, statusText: "OK", headers: {}, config });

axios.defaults.adapter = async (config) => {
  const url = config.url || "";
  if (url.includes("get-spotrates"))
    return respond(config, { info: { commodities: extra ? [...base, ...more] : base, goldBidSpread: 0, goldAskSpread: 1, silverBidSpread: 0, silverAskSpread: 0.05 } });
  if (url.includes("get-server")) return respond(config, { info: { serverURL: "" } });
  if (url.includes("get-news"))
    return respond(config, { news: { news: [
      { description: "Gold holds near record highs as safe-haven demand strengthens" },
      { description: "Dubai gold rates updated live every second" },
      { description: "Silver gains on industrial demand outlook" },
    ] } });
  if (url.includes("tv-screen")) return respond(config, {});
  return respond(config, {});
};

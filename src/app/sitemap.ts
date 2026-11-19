import type { MetadataRoute } from "next";

const BASE = "https://beef.unitedundergod.org";
const PATHS = ["", "/shop", "/drops", "/farms", "/sell", "/business", "/gift", "/standing", "/how", "/order"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly", priority: p ? 0.7 : 1 }));
}

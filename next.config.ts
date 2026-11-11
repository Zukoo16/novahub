import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * cacheComponents (PPR) отключён: приложение использует сессионные куки
   * в корне (layout), поэтому все страницы рендерятся на запрос.
   * Включается, когда появятся страницы без сессии, требующие статической кэшируемости.
   */
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

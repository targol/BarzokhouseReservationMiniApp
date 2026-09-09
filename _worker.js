// Cloudflare Pages / Workers Advanced Mode universal router
import worker from "./worker.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ارسال مستقیم مسیرهای API به ورکر
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/webhook") || request.method === "POST") {
      return worker.fetch(request, env, ctx);
    }

    // سرو فایل‌های استاتیک در صورتی که بایندر ASSETS فعال باشد
    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
      // در صورت ۴۰۴ در SPA، صفحه اصلی index.html بازگردانده شود
      return env.ASSETS.fetch(new URL("/", request.url));
    }

    return worker.fetch(request, env, ctx);
  }
};

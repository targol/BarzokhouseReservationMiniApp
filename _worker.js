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
      let assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status === 404) {
        // در صورت ۴۰۴ در SPA، صفحه اصلی index.html بازگردانده شود
        assetResponse = await env.ASSETS.fetch(new URL("/", request.url));
      }
      
      const newHeaders = new Headers(assetResponse.headers);
      newHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");
      newHeaders.set("Pragma", "no-cache");
      newHeaders.set("Expires", "0");
      newHeaders.set("Access-Control-Allow-Origin", "*");

      return new Response(assetResponse.body, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers: newHeaders
      });
    }

    return worker.fetch(request, env, ctx);
  }
};

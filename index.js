import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
// ⬇️ 这是最关键的一步：导入 Wrangler 自动生成的清单文件
import manifest from "__STATIC_CONTENT_MANIFEST";

// 将清单字符串解析为 JSON 对象
const assetManifest = JSON.parse(manifest);

export default {
  async fetch(request, env, ctx) {
    try {
      const response = await getAssetFromKV(
        {
          request,
          waitUntil: (promise) => ctx.waitUntil(promise),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          // ⬇️ 把解析后的清单传递给处理函数
          ASSET_MANIFEST: assetManifest,
        }
      );
      return response;

    } catch (e) {
      const url = new URL(request.url);
      if (e.status === 404 && !url.pathname.match(/\.(css|js|png|jpg|svg|ico|mp3|woff2?)$/)) {
        try {
          // SPA 路由回退
          const spaRequest = new Request(new URL('/index.html', request.url), request);
          return await getAssetFromKV(
            {
              request: spaRequest,
              waitUntil: (promise) => ctx.waitUntil(promise),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              // ⬇️ 这里也需要传递清单
              ASSET_MANIFEST: assetManifest,
            }
          );
        } catch (spaError) {
          return new Response(spaError.message, { status: 500 });
        }
      }

      const errorMsg = `Error: ${e.message}. __STATIC_CONTENT exists? ${!!env.__STATIC_CONTENT}`;
      return new Response(errorMsg, { status: e.status || 500 });
    }
  }
};
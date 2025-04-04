import crypto from 'node:crypto';

export default function vitePluginCspNonce() {
  return {
    name: 'vite:csp-nonce',

    transformIndexHtml(html, ctx) {
      const { server, path } = ctx;
      const nonce = server?.config?.nonce || crypto.randomBytes(16).toString('base64');

      const tags = [
        {
          tag: 'meta',
          attrs: {
            name: 'csp-nonce',
            content: nonce,
          },
          injectTo: 'head',
        },
      ];

      // ✅ Injecte injector.js UNIQUEMENT en mode dev ET sur index.html
      if (server && path === '/index.html') {
        tags.push({
          tag: 'script',
          attrs: {
            type: 'module',
            src: '/src/js/injector.js',
            nonce: nonce,
          },
          injectTo: 'body',
        });
      }

      return { html, tags };
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const nonce = crypto.randomBytes(16).toString('base64');
        server.config.nonce = nonce;

        res.setHeader(
          'Content-Security-Policy',
          [
            `script-src 'self' 'nonce-${nonce}'`,
            `style-src 'self' 'nonce-${nonce}'`,
            `object-src 'none'`,
            `base-uri 'none'`,
            `report-uri http://localhost:5000/api/csp-reports`,
          ].join('; ')
        );
        next();
      });
    },
  };
}

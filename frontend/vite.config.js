import path from 'node:path';
import { createRequire } from 'node:module';
import { build, defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteStaticCopy } from 'vite-plugin-static-copy';

const require = createRequire(import.meta.url);
const standardFontsDir = normalizePath(
  path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts')
);


// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: true
  },
  build: {
    chunkSizeWarningLimit: 10000000, // 10MB
    // rollupOptions: {
    //   output: {
    //     entryFileNames: `assets/[name].js`,
    //     chunkFileNames: `assets/[name].js`,
    //     assetFileNames: `assets/[name].[ext]`
    //   }
    // }
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      cleanupOutdatedCaches: true,
      registerType: 'autoUpdate',
      injectManifest: {
        // injectionPoint: undefined
        maximumFileSizeToCacheInBytes: 10000000, // 10MB
        // cache name
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,otf,webmanifest,xml,webapp,webmanifest,webapp,webp,webm,mp4,mp3,ogg}'],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,otf,webmanifest,xml,webapp,webmanifest,webapp,webp,webm,mp4,mp3,ogg}'],
      }
      // sourcemap: true,
      // devOptions: {
      //   enabled: true
      // },
      // injectManifest: {
      //   injectionPoint: undefined,
      //   rollupFormat: 'iife'
      // },
    }),
    viteStaticCopy({
      targets: [
        {
          src: standardFontsDir,
          dest: '',
        },
      ]
    })
  ],
})

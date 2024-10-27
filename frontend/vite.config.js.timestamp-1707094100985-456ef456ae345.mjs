// vite.config.js
import { defineConfig } from "file:///C:/Users/bohda/Desktop/emplorex/app/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/bohda/Desktop/emplorex/app/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Users/bohda/Desktop/emplorex/app/frontend/node_modules/vite-plugin-pwa/dist/index.mjs";
var vite_config_default = defineConfig({
  base: "/",
  server: {
    host: true
  },
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      cleanupOutdatedCaches: true,
      registerType: "autoUpdate"
      // sourcemap: true,
      // devOptions: {
      //   enabled: true
      // },
      // injectManifest: {
      //   injectionPoint: undefined,
      //   rollupFormat: 'iife'
      // },
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxib2hkYVxcXFxEZXNrdG9wXFxcXGVtcGxvcmV4XFxcXGFwcFxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYm9oZGFcXFxcRGVza3RvcFxcXFxlbXBsb3JleFxcXFxhcHBcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2JvaGRhL0Rlc2t0b3AvZW1wbG9yZXgvYXBwL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBiYXNlOiAnLycsXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiB0cnVlXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgVml0ZVBXQSh7XHJcbiAgICAgIHN0cmF0ZWdpZXM6ICdpbmplY3RNYW5pZmVzdCcsXHJcbiAgICAgIHNyY0RpcjogJ3NyYycsXHJcbiAgICAgIGZpbGVuYW1lOiAnc3cuanMnLFxyXG4gICAgICBjbGVhbnVwT3V0ZGF0ZWRDYWNoZXM6IHRydWUsXHJcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgICAvLyBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICAgIC8vIGRldk9wdGlvbnM6IHtcclxuICAgICAgLy8gICBlbmFibGVkOiB0cnVlXHJcbiAgICAgIC8vIH0sXHJcbiAgICAgIC8vIGluamVjdE1hbmlmZXN0OiB7XHJcbiAgICAgIC8vICAgaW5qZWN0aW9uUG9pbnQ6IHVuZGVmaW5lZCxcclxuICAgICAgLy8gICByb2xsdXBGb3JtYXQ6ICdpaWZlJ1xyXG4gICAgICAvLyB9LFxyXG4gICAgfSlcclxuICBdLFxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9VLFNBQVMsb0JBQW9CO0FBQ2pXLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLHVCQUF1QjtBQUFBLE1BQ3ZCLGNBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFTaEIsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

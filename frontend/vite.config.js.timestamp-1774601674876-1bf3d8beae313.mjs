// frontend/vite.config.js
import { defineConfig } from "file:///D:/Projects/Course%20builder/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Projects/Course%20builder/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import { fileURLToPath } from "url";
import path from "path";
var __vite_injected_original_import_meta_url = "file:///D:/Projects/Course%20builder/frontend/vite.config.js";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000",
      "/videos": {
        target: "http://localhost:5000",
        changeOrigin: true,
        // Handle range requests for video streaming
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            if (req.headers.range) {
              proxyReq.setHeader("range", req.headers.range);
            }
          });
        }
      }
    }
  },
  // Disable CSP eval warnings (Vite uses eval in dev mode)
  build: {
    target: "esnext"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZnJvbnRlbmQvdml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxDb3Vyc2UgYnVpbGRlclxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUHJvamVjdHNcXFxcQ291cnNlIGJ1aWxkZXJcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Byb2plY3RzL0NvdXJzZSUyMGJ1aWxkZXIvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpXG5cbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6ICdodHRwOi8vbG9jYWxob3N0OjUwMDAnLFxuICAgICAgJy92aWRlb3MnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgLy8gSGFuZGxlIHJhbmdlIHJlcXVlc3RzIGZvciB2aWRlbyBzdHJlYW1pbmdcbiAgICAgICAgY29uZmlndXJlOiAocHJveHkpID0+IHtcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSkgPT4ge1xuICAgICAgICAgICAgLy8gRm9yd2FyZCByYW5nZSBoZWFkZXJzIGZvciB2aWRlbyBzdHJlYW1pbmdcbiAgICAgICAgICAgIGlmIChyZXEuaGVhZGVycy5yYW5nZSkge1xuICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ3JhbmdlJywgcmVxLmhlYWRlcnMucmFuZ2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgLy8gRGlzYWJsZSBDU1AgZXZhbCB3YXJuaW5ncyAoVml0ZSB1c2VzIGV2YWwgaW4gZGV2IG1vZGUpXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFTLFNBQVMsb0JBQW9CO0FBQ2xVLE9BQU8sV0FBVztBQUNsQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFVBQVU7QUFIb0ssSUFBTSwyQ0FBMkM7QUFLdE8sSUFBTSxZQUFZLEtBQUssUUFBUSxjQUFjLHdDQUFlLENBQUM7QUFHN0QsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLFdBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBO0FBQUEsUUFFZCxXQUFXLENBQUMsVUFBVTtBQUNwQixnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLFFBQVE7QUFFdEMsZ0JBQUksSUFBSSxRQUFRLE9BQU87QUFDckIsdUJBQVMsVUFBVSxTQUFTLElBQUksUUFBUSxLQUFLO0FBQUEsWUFDL0M7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

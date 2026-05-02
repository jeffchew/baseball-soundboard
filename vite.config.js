import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'manifest.json'],
      manifest: {
        name: 'Lake Monsters Soundboard',
        short_name: 'Lake Monsters',
        description: 'Youth baseball team soundboard for the Lake Monsters',
        theme_color: '#1e3a8a',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        // Don't cache the service worker itself
        navigateFallback: null,
        
        // Cache audio files with CacheFirst strategy
        runtimeCaching: [
          {
            urlPattern: /\.mp3$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200, 206] // Include 206 for range requests
              },
              // Critical: RangeRequestsPlugin for Safari/iOS audio support
              plugins: [
                {
                  handlerDidError: async () => null
                }
              ],
              rangeRequests: true
            }
          },
          {
            urlPattern: /\.m4a$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200, 206]
              },
              rangeRequests: true
            }
          },
          // Cache JSON manifests with StaleWhileRevalidate
          {
            urlPattern: /\/(roster|sounds)\.json$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'manifest-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Cache other assets with StaleWhileRevalidate
          {
            urlPattern: /\.(js|css|html|svg|png|jpg|jpeg|gif|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ],
        
        // Glob patterns for precaching
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp}'],
        
        // Don't precache audio files (too large), cache them on-demand
        globIgnores: ['**/audio/**/*']
      },
      
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

// Made with Bob

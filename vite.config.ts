import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiPath = env.VITE_API_PATH || '/api/v1/'
  const apiProxyTarget = env.VITE_API_PROXY_TARGET

  return {
    plugins: [react()],
    resolve: {
      alias: {
        ui: path.resolve(import.meta.dirname, 'src/ui'),
        utils: path.resolve(import.meta.dirname, 'src/utils'),
        icons: path.resolve(import.meta.dirname, 'src/assets/icons'),
        pages: path.resolve(import.meta.dirname, 'src/pages'),
        components: path.resolve(import.meta.dirname, 'src/components'),
        api: path.resolve(import.meta.dirname, 'src/api'),
        context: path.resolve(import.meta.dirname, 'src/context'),
        const: path.resolve(import.meta.dirname, 'src/const'),
        assets: path.resolve(import.meta.dirname, 'src/assets'),
        types: path.resolve(import.meta.dirname, 'src/types'),
        features: path.resolve(import.meta.dirname, 'src/features'),
        hooks: path.resolve(import.meta.dirname, 'src/hooks'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('react-hook-form') ||
                id.includes('@hookform/resolvers') ||
                id.includes('zod')
              ) {
                return 'forms'
              }

              if (
                id.includes('react-router-dom') ||
                id.includes('react-dom') ||
                id.includes(`${path.sep}react${path.sep}`)
              ) {
                return 'react'
              }
            }
          },
        },
      },
    },
    server: apiProxyTarget
      ? {
          proxy: {
            [apiPath]: {
              target: apiProxyTarget,
              changeOrigin: true,
              secure: true,
            },
          },
        }
      : undefined,
  }
})

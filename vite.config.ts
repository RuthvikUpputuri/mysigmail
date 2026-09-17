import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['REQUIRE_AUTH', 'STORAGE_', 'AWS_', 'S3_', 'R2_', 'SUPABASE_', 'CUSTOM_'],
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dirs: ['./src/composables/**'],
    }),
    Components({
      dts: true,
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
      globalNamespaces: ['shadcn'],
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
      resolvers: [
        IconsResolver({
          prefix: false,
        }),
      ],
    }),
    Icons({
      compiler: 'vue3',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

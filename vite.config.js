import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { searchForWorkspaceRoot } from 'vite';
import Icons from 'unplugin-icons/vite'
import path from "path";

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    server: {
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          'src/**/*.{js,svelte,json,css,html}',
          'src/global.css'
        ]
      }
    }
  },
  define: { _global: ({}), },
});


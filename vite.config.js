import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  build: {
    outDir: 'build',
    assetsDir: 'src',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2024,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: "src/FWDLS.js",
      }
    },
  },
  server: {
    host: 'bs-local.com',
    port: 5173,
    https: true,
  },
  plugins: [
    glsl(),
    mkcert(),
    replace({
      preventAssignment: true,
      values: {
        'import * as THREE from "three";': 'import * as FWDLS_THREE from "three";',
        'THREE.': 'FWDLS_THREE.',
      },
    }),
  ],
});
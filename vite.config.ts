import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TreeTableComponent',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'bignumber.js',
        'rc-resize-observer',
        'rc-virtual-list'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'bignumber.js': 'BigNumber',
          'rc-resize-observer': 'ResizeObserver',
          'rc-virtual-list': 'VirtualList'
        }
      }
    }
  }
});
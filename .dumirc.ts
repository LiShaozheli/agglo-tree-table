import { defineConfig } from 'dumi';
import { resolve } from 'path';

export default defineConfig({
  title: 'AggloTreeTable Component',
  logo: './public/logo.png',
  outputPath: 'docs-dist',
  resolve: {
    docDirs: ['docs'],
    atomDirs: [{ type: 'component', dir: 'src/components' }],
  },
  alias: {
    'agglo-tree-table': resolve(__dirname, 'src'),
  },
  // 禁用 loading 组件以避免导入错误
  conventionRoutes: {
    exclude: [/\/loading\//i],
  },
  // 禁用内置的 loading 组件
  clientLoader: false,
  // 添加 mfsu 配置以提高编译速度
  mfsu: false,
  // 配置代码示例的展示主题
  themeConfig: {
    name: 'AggloTreeTable',
    footer: 'AggloTreeTable Component - 一个支持金融数据聚合功能的 React 树形表格组件',
  },
});
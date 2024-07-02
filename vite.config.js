import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import Inspect from 'vite-plugin-inspect'
import { fileURLToPath, URL } from "node:url";
// import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Unocss from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// 这是一个vite服务器的插件配置项   该服务器会自动加载根目录下的index.html 并解析type=module 的入口引用到的所有文件
export default defineConfig({
  plugins: [
    createVuePlugin({
      // include: ['.vue','.jsx','.js'],
      jsx: true
    }), // 因为浏览器 不认识.vue文件 需要用这个插件 把.vue转换成js
    Inspect(), // 一个检查工具 可以检查文件被编译成了什么样子
    // AutoImport({
    //   dir: [
    //     './src/components/**'
    //   ]
    // })
    Components({
      dirs: ['./src/components','./src/optimize/common'],

      // valid file extensions for components.
      extensions: ['vue'],
      // globs: ['src/components/*.{vue}'],
    }),
    Unocss(),
    createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [fileURLToPath(new URL("./src/assets/svg-icons", import.meta.url))],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
        customDomId: '__svg__icons__dom__',
      }),
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias:{
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    }
  }
})

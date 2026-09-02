import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'
import createImportPlugin from 'vite-plugin-import'

import visualizer from 'rollup-plugin-visualizer'
import proxyConfig from './config/proxyConfigForVite.js'

import eslintPlugin from 'vite-plugin-eslint'
// import lessToJson from 'less-to-json'
// import * as path from 'path'

const { DEV_PORT } = require('./config/conf.default')
// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',
        proxy: proxyConfig,
        port: DEV_PORT
    },
    build: {
        target: 'esnext',
        minify: 'esbuild', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
        manifest: true,
        ssrManifest: true,
        sourcemap: true,
        outDir: 'dist', // 产出目录
        assetsDir: 'static',
    },
    css: {
        modules: {
            localsConvention: 'camelCase'
        },
        preprocessorOptions: {
            less: {
                modifyVars: {
                    // hack: `true; @import (reference) "${resolve('./src/global.vars.less')}";`
                },
                additionalData: `@import '${resolve(__dirname, './src/index.global.less')}';`,
                // 支持内联 javascript
                javascriptEnabled: true,
            },
        }
    },
    plugins: [
        react(),
        visualizer(),
        createSvgIconsPlugin({
            iconDirs: [resolve(process.cwd(), 'src/statics/icons')],
            symbolId: 'icon-[dir]-[name]',
            customDomId: '__svg__icons__dom__',
            inject: 'body-last'
        }),
        // antd 按需引入
        createImportPlugin({
            onlyBuild: false,
            babelImportPluginOptions: [
                {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true, // or 'css'
                },
            ],
        }),
        eslintPlugin({
            include: ['src/**/*.tsx', 'src/**/*.ts'],
        })
    ],
    resolve: {
        alias: [
            {
                find: '@com',
                replacement: '/src/components'
            },
            {
                find: '@src',
                replacement: '/src'
            },
            {
                'find': /^~/,
                'replacement': ''
            }
        ]
    }
})

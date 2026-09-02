/* eslint-disable */
// @ts-nocheck
const {
    PROXY_TARGET,
    COOKIE: Cookie,
    PROXY_TARGET_FOR_SA_LOG,
} = require('./conf.default')

const commonHeadersConfig = {
    Cookie
}
module.exports = {
    '/api': {
        target: PROXY_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
            ...commonHeadersConfig,
            'HEADER-USERINFO': 'eyJ1U05DcmVhdGVkIjoiMTU1Iiwic0FNQWNjb3VudE5hbWUiOiJ6aGFuZ2NoYW8iLCJkaXNwbGF5TmFtZSI6IuW8oOi2hSJ9'
        }
    },
    '/logs': {
        target: PROXY_TARGET_FOR_SA_LOG,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/logs/, ''),
    }
}

/* eslint-disable */
// @ts-nocheck
const {
    PROXY_TARGET,
    COOKIE: Cookie,
    PROXY_NOAH_TARGET,
    PROXY_MANAGE_TARGET,
    PROXY_TARGET_FOR_THIRD_PARTY,
    PROXY_TARGET_FOR_SA_LOG
} = require('./conf.default')

const commonHeadersConfig = {
    Cookie,
    'HEADER-USERINFO': 'eyJ1U05DcmVhdGVkIjoiMTU1Iiwic0FNQWNjb3VudE5hbWUiOiJ6aGFuZ2NoYW8iLCJkaXNwbGF5TmFtZSI6IuW8oOi2hSJ9'
}

const commonConfig = {
    headers: {
        ...commonHeadersConfig
    },
    changeOrigin: true,
}

module.exports = {
    '/api': {
        ...commonConfig,
        target: PROXY_TARGET,
        pathRewrite: (path) => path.replace(/^\/api/, ''),
    },
    '/noahs': {
        ...commonConfig,
        target: PROXY_NOAH_TARGET,
        pathRewrite: (path) => path.replace(/^\/noahs/, ''),
    },
    '/manager': {
        ...commonConfig,
        target: PROXY_MANAGE_TARGET,
        pathRewrite: (path) => path.replace(/^\/manager/, ''),
    },
    '/global': {
        ...commonConfig,
        target: PROXY_TARGET_FOR_THIRD_PARTY,
        pathRewrite: (path) => path.replace(/^\/global/, ''),
    },
    '/logs': {
        ...commonConfig,
        target: PROXY_TARGET_FOR_SA_LOG,
        pathRewrite: (path) => path.replace(/^\/logs/, ''),
    }
}

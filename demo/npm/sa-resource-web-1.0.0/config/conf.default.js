/* eslint-disable */
// @ts-nocheck
/**
 * 统一导出环境配置
 */
const path = require('path')
const fs = require('fs')
const dotenvConfigOutput = require('dotenv').config({ path: '.env' })

const {
    PROXY_TARGET,
    DEV_PORT,
    PROXY_TARGET_FOR_SA_LOG,
    PROXY_NOAH_TARGET,
    PROXY_MANAGE_TARGET,
    PROXY_TARGET_FOR_THIRD_PARTY
} = dotenvConfigOutput.parsed

const cookieFilePath = path.join(__dirname, '../COOKIE')

const COOKIE = fs.readFileSync(cookieFilePath, 'utf8').trim()

module.exports = {
    PROXY_TARGET,
    DEV_PORT,
    COOKIE,
    PROXY_TARGET_FOR_SA_LOG,
    PROXY_NOAH_TARGET,
    PROXY_MANAGE_TARGET,
    PROXY_TARGET_FOR_THIRD_PARTY
}

/**
 * 正则合集
 */
export const IP_REGEXP = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/

// 1 - 65535
export const PORT_REGEXP = /^([1-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

// 并发限制
export const CONCURRENCE_REGEXP = /^\d{0,4}$/

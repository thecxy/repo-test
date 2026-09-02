export const getItem = (item: string) => localStorage.getItem(item) || ''
export const setItem = (key: string, val: string) => localStorage.setItem(key, val)

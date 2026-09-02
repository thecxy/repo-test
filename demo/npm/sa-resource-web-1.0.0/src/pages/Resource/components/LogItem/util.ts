/* eslint-disable */
// @ts-nocheck
export const checkIfHasKeyWords = (targetString, checkList) => {
    const length = checkList.length
    let flag = false
    for (let i = 0; i < length; i++) {
        const checkWords = checkList[i]
        if (targetString.indexOf(checkWords) !== -1) {
            flag = true
            break
        }
    }
    return flag
}

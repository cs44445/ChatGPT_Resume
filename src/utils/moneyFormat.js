// 普通数字转会计金额格式
function moneyFormat(num) {
    // 判断传进来的数字是否为非空数字
    if (!isNaN(parseFloat(num))) {
        let newNum = Number(Number(num).toFixed(2)).toLocaleString('zh', { minimumFractionDigits: 2 })
        return newNum
    } else {
        return ''
    }
}

export default {
    moneyFormat,
}

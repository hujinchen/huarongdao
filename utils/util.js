/**
 * 获取当前日期字符串
 * @return  日期格式 -- 2019/05/29 14:34:30
 */
const formatTime = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}


/**
 * 防止快速点击
 * @fn        Function      回调函数
 * @gapTime   Number        时间（单位毫秒）
 */
function throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 1500
    }
    let _lastTime = null
    // 返回新的函数
    return function () {
        let _nowTime = + new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments)   //将this和参数传给原函数
            _lastTime = _nowTime
        }
    }
}

// 永不重复的随机序列号
function getRandomCode(length) {
    if (length > 0) {
        var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var nums = "";
        for (var i = 0; i < length; i++) {
            var r = parseInt(Math.random() * 61);
            nums += data[r];
        }
        return nums;
    } else {
        return false;
    }
}

/**
 * 生成随机数字
 * @min     Number   最小数字
 * @max     Number   最大数字
 * @return  Number   max <= (Number) >= min
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { formatTime, throttle, getRandomCode, random }
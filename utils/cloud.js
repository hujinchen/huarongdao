/**
 * 调用云函数
 * name：云函数名称
 * data：提交的参数
 */
function callFunction(name, data = {}) {
    return new Promise((resolve, reject) => {
        if (name == '' || name == null) {
            console.error('调用云函数的名称不能为空');
            return;
        }
        
        wx.cloud.callFunction({
            name, data,
            success: res => {
                console.log(`[云函数][${name}]`, res);
                resolve(res)
            },
            fail: err => {
                console.error(`[云函数][${name}] 调用失败`, err);
                reject(err)
            }
        })
    })
}

module.exports = { callFunction }
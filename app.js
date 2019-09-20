//app.js
App({
    onLaunch: function () {
        // if (!wx.cloud) {
        //     console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        // } else {
        //     // 如果要使用云能力，通常我们在小程序初始化时即调用这个方法。
        //     wx.cloud.init({
        //         env: 'test-n922g', // 测试 -- test-n922g  正式 -- release-tulcr
        //         traceUser: true,   // 是否在将用户访问记录到用户管理中，在控制台中可见
        //     })
        // }
        this.globalData = {}

        let that = this;
        wx.getSystemInfo({
            success(res) {
                that.windowWidth = res.windowWidth;
                that.windowHeight = res.windowHeight;
            }
        })
    }
})

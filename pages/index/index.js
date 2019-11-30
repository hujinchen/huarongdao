const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.src = '/audio/click.mp3';

Page({
  data: {
    windowWidth: app.windowWidth, // 屏幕宽度

    numData: [],
    m: '00',   // 分
    s: '00',   // 秒
    step: 0,   // 步数
    nowDifficultyDef: 5, // 默认当前难度系数 -- 注意这个值要和初始的 当前难度系数的值一样
    nowDifficulty: 5,    // 当前难度系数 5*5 6*6 7*7
    maxDifficulty: 10,   // 最大难度系数
  },

  onLoad() {
    this.initNum(this.data.nowDifficulty);
  },

  // 开始游戏
  isStart: false,
  goGame() {
    if (this.isStart) return;

    this.isStart = true;
    this.isPass = false;
    this.setData({
      m: '00', s: '00', step: 0
    })
    this.disorganize(this.data.numData); // 随机打乱题目顺序
    this.countdown();
  },

  // 重置游戏
  reset() {
    this.isStart = false;
    this.isPass = false;
    this.initNum(this.data.nowDifficulty);
    clearInterval(this.timer);
    this.timer = null;
    this.time = 0;
  },

  // 游戏结束
  gameOver() {
    let numData = this.data.numData;
    // 如果最后一格为空的话 并且 倒数第二格值正确的话，再计算游戏是否结束
    if (numData[numData.length - 1].isEmpty && numData[numData.length - 2].num == numData.length - 1) {
      let flg = true; // 是否结束
      for (let y in numData) {
        if (numData[y].num != parseInt(y) + 1) {
          flg = false;
          break;
        }
      }

      if (flg) {
        clearInterval(this.timer);
        this.timer = null;
        this.time = 0;
        this.isPass = true;
        this.isStart = false;
        wx.showModal({
          title: '提示',
          content: '您已过关啦！',
          showCancel: false
        })
      }
    }
  },

  // 移动算法
  isPass: false,
  goMove(e) {
    // 通关 或者 没开始游戏 就不能移动
    if (this.isPass || !this.isStart) return;

    let index = e.currentTarget.dataset.index,
      nowDifficulty = this.data.nowDifficulty,
      numData = this.data.numData,
      step = this.data.step;

    for (let i in numData) {
      if (index == i) {
        let x = '';
        // 当前点击的 上下左右 方向如果有空位的话，就互换位置
        if (numData[index - nowDifficulty] && numData[index - nowDifficulty].isEmpty) {  // 下
          x = index - nowDifficulty;
        } else if (numData[index + nowDifficulty] && numData[index + nowDifficulty].isEmpty) {  // 上
          x = index + nowDifficulty;
        } else if (numData[index - 1] && numData[index - 1].isEmpty) {  // 左
          // 如果是在最左边的话，禁止向左移动
          for (let h = 1; h < nowDifficulty; h++) {
            if (index == nowDifficulty * h) return;
          }
          x = index - 1;
        } else if (numData[index + 1] && numData[index + 1].isEmpty) {  // 右
          // 如果是在最右边的话，禁止向右移动
          for (let h = 1; h < nowDifficulty; h++) {
            if (index == nowDifficulty * h - 1) return;
          }
          x = index + 1;
        } else {
          return; // 没有空位不做任何操作
        }

        // Es6 解构赋值
        [numData[i], numData[x]] = [numData[x], numData[i]];
        step += 1;
        innerAudioContext.play(); // 播放移动效果的音乐
        break;
      }
    }
    this.setData({ step, numData });
    this.gameOver();
  },

  // 初始化题目
  initNum(size) {
    let nowDifficulty = this.data.nowDifficulty, maxDifficulty = this.data.maxDifficulty;
    if (size >= nowDifficulty && size <= maxDifficulty) {
      let numData = [];
      for (let i = 1; i < size * size; i++) {
        numData.push({ num: i, isEmpty: false }); // isEmpty：当前这格是否为空
      }
      numData.push({ num: size * size, isEmpty: true });
      this.setData({
        m: '00', s: '00', step: 0, numData
      })
    } else {
      console.error('初始化题目错误：难度超出限制大小');
    }
  },

  // 随机打乱题目顺序
  disorganize(numData) {
    let nowDifficulty = this.data.nowDifficulty;
    numData.sort(() => { return (0.5 - Math.random()); }); // 随机打乱顺序
    while (!numData[numData.length - 1].isEmpty) {
      numData.sort(() => { return (0.5 - Math.random()); }); // 当前空格在最后一位就退出循环
    }

    let num = 0;
    for (let i = 0; i < numData.length; i++) {
      for (let x = i + 1; x < numData.length; x++) {
        // 计算逆序数总的数量
        if (numData[i].num > numData[x].num) {
          num += 1;
        }
      }
    }

    // 逆序数的数量 必须为偶数才有解
    if (num % 2 == 0) {
      this.setData({ numData });
    } else {
      // 递归调用，直到逆序数的数量为偶数才终止
      this.disorganize(numData);
    }
  },

  // 定时器
  timer: null,
  time: 0,
  countdown() {
    let that = this;
    clearInterval(that.timer);
    that.timer = null;
    that.timer = setInterval(function () {
      that.time += 1;

      // 超过1小时，游戏也结束
      if (that.time > 3600) {
        clearInterval(that.timer);
        that.timer = null;
        that.time = 0;
        wx.showModal({
          title: '超时提示',
          content: '您的游戏时间已超时，请重新开始游戏',
          showCancel: false,
          success(res) {
            that.isPass = true;
            that.isStart = false;
            that.setData({
              m: '00',
              s: '00',
              step: 0
            })
          }
        })
        return;
      }

      // 更新分、秒数
      if (that.time < 60) {
        that.setData({
          s: that.time < 10 ? '0' + that.time : that.time,
          m: '00'
        })
      } else {
        let mm = parseInt(that.time / 60);
        let ss = that.time - (mm * 60);
        that.setData({
          m: mm < 10 ? '0' + mm : mm,
          s: ss < 10 ? '0' + ss : ss
        })
      }
    }, 1000)
  },

  // 选择难度
  choose() {
    let that = this, nowDifficulty = this.data.nowDifficulty, nowDifficultyDef = this.data.nowDifficultyDef;
    wx.showActionSheet({
      itemList: ['5 × 5', '6 × 6', '7 × 7', '8 × 8', '9 × 9', '10 × 10'],
      success(res) {
        if (res.tapIndex + 3 != nowDifficulty) {
          that.setData({ nowDifficulty: res.tapIndex + nowDifficultyDef })
          that.reset();
        }
      }
    })
  },

  onShareAppMessage(e) {
    return {
      title: '最强大脑 《数字华容道》谁敢来战？',
      path: 'pages/index/index'
    }
  }
})

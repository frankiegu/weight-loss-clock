// components/statusbar/index.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: Number, // 1返回+标题，2首页+标题，3返回+首页+标题，4标题
    title: String, // 标题
    theme: String, // 背景 white back default default-back
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached() {
    // 在组件实例进入页面节点树时执行

    // 获取是否是通过分享进入的小程序
    this.setData({
      shijiShowBack: app.globalData.shijiShowBack
    })
    // 定义导航栏的高度   方便对齐
    this.setData({
      shijiNav: app.globalData.shijiNav
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回上一页面
    _navback() {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({ formStatusbar : 1 })
      wx.navigateBack({ delta : 1 })
    },
    //返回到首页
    _navindex: function () {
      wx.showLoading({ title: 'Loading…', mask: true });
      wx.switchTab({ url: '/pages/index/index', })
      wx.hideLoading();
    },
  }
})

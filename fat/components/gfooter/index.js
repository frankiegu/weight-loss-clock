// components/gfooter/index.js
var app = getApp();
var _time = 0;
var _timer;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    hotQuotesArr: [],
    txt: ''
  },
  // 在组件实例进入页面节点树时执行
  attached() {
    var _this = this;
    _timer = setInterval(function () {
      _time++;
      if (app.globalData.hotQuotesArrTip == 'true' || app.globalData.hotQuotesArrTip == true) {
        var _arr = app.globalData.hotQuotesArr;
        var _txt = _arr[Math.floor((Math.random() * _arr.length))];
        _this.setData({
          txt: _txt
        });
        clearInterval(_timer);
      } else if (_time > 1000) {
        clearInterval(_timer);
      }
    }, 10);
  },
  moved: function () {
    if (_timer != '') {
      clearInterval(_timer)
    };
  },
  detached: function () {
    if (_timer != '') {
      clearInterval(_timer)
    };
  },
  pageLifetimes: {
    hide: function () {
      if (_timer != '') {
        clearInterval(_timer)
      };
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    linkRewardFun: function () {
      wx.showLoading({
        title: 'Loading…',
        mask: true
      });
      wx.navigateTo({
        url: '/pages/v1-reward/index'
      })
      wx.hideLoading();
    },
  }
})
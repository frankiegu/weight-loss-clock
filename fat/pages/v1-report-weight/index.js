const app = getApp()
const Api = require("../../config/api.method.js")

// x.js 逻辑处理，这里还需要引入 F2 用于绘制图表，结构如下，注意路径正确。
// index.js
import F2 from '@antv/wx-f2'; // 注：也可以不引入， initChart 方法已经将 F2 传入，如果需要引入，注意需要安装 @antv/wx-f2 依赖
let chart3 = null;
function initChart3(canvas, width, height, F2) { // 使用 F2 绘制图表
  var pages = getCurrentPages(); // 获取当前页面栈
  var currPage = pages[pages.length - 1];
  var data1 = currPage.data.canvasArr;
  var dataArray = [];
  for(var i = 0;i < data1.length;i++){
      var item = {};
      item['date'] = data1[i]['week'];
      item['steps'] = data1[i]['weight'];
      dataArray.push(item);
  } 
  chart3 = new F2.Chart({
      el: canvas,
      width,
      height
  });
  chart3.source(dataArray, {
      date: {
          // type: 'timeCat', // 日期格式
          tickCount: 7,
          range: [0, 1],
          alias: '星期',
      },
      steps: {
          tickCount: 5,
          min: 0,
          alias: '体重(kg)',
      }
  });

  chart3.axis('date', {
      label: function label(text, index, total) {
          const textCfg = {};
          if (index === 0) {
              textCfg.textAlign = 'left';
          } else if (index === total - 1) {
              textCfg.textAlign = 'right';
          }
          return textCfg;
      }
  });
  chart3.tooltip({
      showCrosshairs: true,
  });

  chart3.area()
      .position('date*steps')
      .color('l(90) 0:#3BB19B 1:#f7f7f7')
      .shape('smooth');
  chart3.line()
      .position('date*steps')
      .color('l(90) 0:#3BB19B 1:#f7f7f7')
      .shape('smooth');
  chart3.render();
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    theme: 'default',
    
    defaultImg: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/default_user.png',
    defaultImgUrl: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/',

    infoObj : '',
    canvasArr: [], // 图表数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryInfoFun();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /*
  * 页面滚动 -- 置顶需要加这个
  */
  onPageScroll: function (e) {
    let _this = this;
    var _theme = _this.data.theme;
    if (e.scrollTop >= 33) {
      if(_theme == 'default'){_theme ='black';  _this.setData({ theme: 'black' }); }
    } else {
      if(_theme == 'black'){_theme ='default';  _this.setData({ theme: 'default' }); }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // userId 
    var _url = app.globalData.shareUrl + '?scene=' + app.globalData.userId;
    return {
      title: app.globalData.shareTitle,
      path: _url,
      imageUrl: app.globalData.shareImg
    }
  },

  // 其他方法
  // 请求-----------9.a 获取步数月报
  queryInfoFun: function(){
    wx.showLoading({ title: 'Loading…', mask: true });
    let _this = this;
    Api.memberClockWeek('',
      function (res) {
        _this.setData({ infoObj : res });

        _this.setData({
          canvasArr: res.clockList
        },function(){
          if(res.clockList.length > 0){
            _this.ecComponent = _this.selectComponent('#column-report');
            _this.ecComponent.init(initChart3);
          }
        })
      
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); }
    );
  },

})
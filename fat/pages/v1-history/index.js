// pages/v1-history/index.js
const app = getApp()
const Api = require("../../config/api.method.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: 'default',

    subTitle : '',// 毒鸡汤
    shareTypeLayerShow : false, // 选择分享方式

    historyInfo : '', // 历史数据信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryHistoryFun(); // 获取打卡历史数据信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _arr = app.globalData.hotQuotesArr;
    var _txt = _arr[Math.floor((Math.random() * _arr.length))];
    this.setData({ subTitle: _txt });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /*
  * 页面滚动 -- 置顶需要加这个
  */
  onPageScroll: function (e) {
    let _this = this;
    var _theme = _this.data.theme;
    if (e.scrollTop >= 50) {
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

  // 请求-----------6.a 获取会员历史记录
  queryHistoryFun: function(){
    wx.showLoading({ title: 'Loading…', mask: true });
    let _this = this;
    Api.fatLossClockByMebId('',
      function (res) {
        _this.setData({ historyInfo : res });
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); }
    );
  },
  // 跳转---------去打卡
  linkClockFun: function () {
    wx.showLoading({ title: 'Loading…', mask: true });
    wx.navigateTo({ url: '/pages/v1-clock/index' })
    wx.hideLoading();
  },

})
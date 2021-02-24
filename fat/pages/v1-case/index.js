// pages/v1-case/index.js
const app = getApp()
const Api = require("../../config/api.method.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleInfo : [], // 文章列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryArticleInfoFun();
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
  // 跳转---------文章阅读
  linkCaseViewFun : function(e){
    wx.showLoading({ title: 'Loading…', mask: true });
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({ url: '/pages/v1-case-view/index?url=' + url });
    wx.hideLoading();
  },
  // 请求-----------3.g 获取减脂文章列表
  queryArticleInfoFun: function(){
    let _this = this;
    wx.showLoading({ title: 'Loading…', mask: true });
    Api.marketingCaseList('',
      function (res) {
        _this.setData({ articleInfo : res });
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); }
    );
  },
})
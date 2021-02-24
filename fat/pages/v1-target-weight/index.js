// pages/v1-target-weight/index.js
const app = getApp()
const Api = require("../../config/api.method.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weight: '50.0',
    styles: {
      line: '#B7B7B7',
      bginner: '#fbfbfb',
      bgoutside: 'transparent',
      font: '#FFFFFF',
      fontColor: '#FFFFFF',
      fontSize: 16
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _targetWeight = !app.globalData.targetWeight || app.globalData.targetWeight == 0 ? '50.0' : app.globalData.targetWeight;
    this.setData({ weight : _targetWeight });
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
  
  // 功能-------------滑动选择体重
  changeRulerFun(e) { //滑动回调
    const value = e.detail.value;
    const key = e.currentTarget.id;
    const data = {};
    data[key] = value;
    this.setData(data);
  },
  // 请求-----------5.a 修改目标体重
  querySaveTargetFun: function(){
    let _this = this;
    wx.showLoading({ title: 'Loading…', mask: true });
    Api.updateTargetWeight({ weight : _this.data.weight },
      function (res) {
        app.globalData.targetWeight = _this.data.weight;
        wx.showToast({ title: '目标体重更新成功~', icon: 'success', duration: 2000, success: function () {
            setTimeout(function() {
              wx.navigateTo({ url: '/pages/v1-index/index' })
            }, 2000);
          }
        });
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); }
    );
  },

})
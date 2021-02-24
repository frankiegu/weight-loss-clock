const app = getApp()
const Api = require("../../config/api.method.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultImg: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/default_user.png',
    defaultImgUrl: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/',

    layerShow : false,

    pageno : 1,
    pagesize : 60, 
    total : 0, // 分页总数
    infoArr : [], // 分页内容数组
    isNext : false, // 是否有下一页
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
  // 打赏
  payFun : function(e){
    let _this = this;
    var _num = e.currentTarget.dataset.num;
    var _arr = [1,5,8,10,50,100];
    var _amount = _arr[_num];
    wx.showLoading({ title: 'Loading…', mask: true });
    Api.charge({ amount : _amount },
      function (res) {
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: 'prepay_id=' + res.prepayId,
          signType: 'MD5',
          paySign: res.sign,
          success() {
            wx.hideLoading();
            _this.setData({ layerShow: true });
            _this.setData({ pageno : 1, pagesize : 60,  total : 0, infoArr : [], isNext : false },
              function(){
              _this.queryInfoFun();
            });
          },
          fail() {
            wx.showToast({ title: '支付失败~', icon: "none" });
          },
        });
      },
      function(){ wx.hideLoading(); }
    );
  },
  // 功能------关闭打卡成功弹窗
  closeLayerFun: function () { this.setData({ layerShow: false }); },
  // 请求-----------11.b 获取打赏头像
  queryInfoFun: function(){
    wx.showLoading({ title: 'Loading…', mask: true });
    let _this = this;
    Api.rewardList({ pageno : _this.data.pageno,pagesize : _this.data.pagesize },
      function (res) {
        if(_this.data.pageno == 1){
          _this.setData({ infoArr : res.dataList,total : res.total });
        }else{
          var _arr = _this.data.infoArr;
          var _arr2 = _data.dataList ? _data.dataList : [];
          _arr = _arr.concat(_arr2);
          _this.setData({ infoArr : _arr });
        }
        _this.setData({ isNext : res.isNext });
        
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); }
    );
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    var _isNext = _this.data.isNext;
    var _pageno = _this.data.pageno;
    var _total = _this.data.total;
    if(_isNext && _total > 0){
      _this.setData({ pageno : Number(_pageno) + 1 },function(){
        _this.queryInfoFun(); 
      });
    }
  },

})
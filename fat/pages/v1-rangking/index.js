const app = getApp()
const Api = require("../../config/api.method.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    theme: 'default',

    defaultImg: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/default_user.png',
    defaultImgUrl: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/',
    
    txt1: '晴时雨泪', 
    txt2: '晴时雨泪晴时雨泪', 
    txt3: '12345', 

    navActive : 1, // 默认显示总榜 1总榜 2好友榜
    rankAllInfo : '', // 总榜
    rankFriendsInfo : '', // 好友榜

    friendsCanvas:{ // 邀请好友
      layerHide : true,
      canvasHide : true,
      banner: '', // 最终的海报图
      width: 750, // 画布宽
      height: 1200, // 画布高
      imgArr : [ // 最终需要下载的图片  0背景海报图 1小程序码
        {
          originalUrl: '',
          drawUrl: '',
        },
        {
          originalUrl: '',
          drawUrl: '',
        }
      ],
    },
  },
  /*
  * 页面滚动 -- 置顶需要加这个
  */
  onPageScroll: function (e) {
    let _this = this;
    var _theme = _this.data.theme;
    if (e.scrollTop >= 22) {
      if(_theme == 'default'){_theme ='black';  _this.setData({ theme: 'black' }); }
    } else {
      if(_theme == 'black'){_theme ='default';  _this.setData({ theme: 'default' }); }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;

    _this.queryrankAllInfoFun();

    let _canvasQRcode = wx.getStorageSync("fat_canvasQRcode") || app.globalData.canvasQRcode; // 获取用户专属的分享码
    let _canvasFriendsUrl = app.globalData.canvasFriendsUrl; // 获取用户专属的分享码
    if(_canvasFriendsUrl != ''){
      _this.setData('friendsCanvas.banner',_canvasFriendsUrl);
    }
    if(_canvasQRcode == ''){
      _this.queryCanvasQRcodeFun(); // 获取用户专属的分享码
    }else{
      var _key = 'todayCanvas.imgArr[1].originalUrl';
      var _key2 = 'friendsCanvas.imgArr[1].originalUrl';
      _this.setData({ [_key] : _canvasQRcode , [_key2] : _canvasQRcode });
    }
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
  // 切换导航菜单
  changeNavFun: function(e){
    var _num = e.currentTarget.dataset.num;
    let _this = this;
    this.setData({ navActive : _num });
    if(_num == 1 && _this.data.rankAllInfo == ''){
      _this.queryrankAllInfoFun();
    }else if(_num == 2 && _this.data.rankFriendsInfo == ''){
      _this.queryrankFriendsInfoFun();
    }
  },
  // 请求-----------7.a 获取排行榜总榜
  queryrankAllInfoFun: function(){
    wx.showLoading({ title: 'Loading…', mask: true });
    let _this = this;
    Api.fatLossClockRankingList('',
      function (res) {
        _this.setData({ rankAllInfo : res });
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); },
    );
  },
  // 请求-----------7.b 获取好友排行榜
  queryrankFriendsInfoFun: function(){
    wx.showLoading({ title: 'Loading…', mask: true });
    let _this = this;
    Api.shareFriendsRankingList('',
      function (res) {
        _this.setData({ rankFriendsInfo : res });
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); },
    );
  },

  // ------------------------------- 绘图 邀请好友 start------------------------------------
  showFriendsCanvasFun: function () {
    var _this = this;  
    if (_this.data.friendsCanvas.banner && _this.data.friendsCanvas.banner != '') { // 已经生成过邀请好友
      _this.setData({ 'friendsCanvas.layerHide': false });
    } else { // 未生成过
      wx.showLoading({ title: '海报生成中…', mask: true });

      var _arr = app.globalData.canvasFriendsBgs;
      var _day = (new Date()).getDay();
      var _bg = _arr[_day];
      var _key = 'friendsCanvas.imgArr[0].originalUrl';
      _this.setData({ [_key] : _bg });
      // console.log(_this.data.friendsCanvas.imgArr);
      _this.getFriendsCanvasDrawUrlFun(_this.data.friendsCanvas.imgArr);
    }
  },
  closeFriendsCanvasFun: function () {
    this.setData({ 'friendsCanvas.layerHide': true,'friendsCanvas.canvasHide': true });
  },
  // canvas---------获取绘图路径
  getFriendsCanvasDrawUrlFun: function (param) {
    var _this = this;
    let imageArr = param;
    let arr = [];
    imageArr.forEach((item) => {
      arr.push(_this.loadImageFun(item));
    });
    Promise.all(arr).then((newList) => {
      _this.setData({ 'friendsCanvas.imgArr': newList,'friendsCanvas.canvasHide': false }, () => {
        setTimeout(() => {
          _this.creatFriendsCanvasFun();
        }, 10);
      });
    });
  },
  // canvas---------生成图片
  creatFriendsCanvasFun: function () {
    let _this = this;
    // 创建画布
    let ctx = wx.createCanvasContext('friendsCanvas');
    // 基本显示内容
    var _bg = _this.data.friendsCanvas.imgArr[0].drawUrl; // 背景 
    var _QRcode = _this.data.friendsCanvas.imgArr[1].drawUrl; // 小程序码
    
    // 背景
    ctx.drawImage(_bg, 0, 0, _this.data.friendsCanvas.width, _this.data.friendsCanvas.height);
    // 小程序码
    ctx.drawImage(_QRcode, 564, 948, 116, 116);

    ctx.draw(false, setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: _this.data.friendsCanvas.width,
        height: _this.data.friendsCanvas.height,
        destWidth: _this.data.friendsCanvas.width * 2,
        destHeight: _this.data.friendsCanvas.height * 2,
        canvasId: 'friendsCanvas',
        success(res) {
          app.globalData.canvasFriendsUrl = res.tempFilePath;
          _this.setData({
            'friendsCanvas.banner': res.tempFilePath,
            'friendsCanvas.layerHide': false
          });
          wx.hideLoading();
        },
        fail: function (res) {
          app.globalData.canvasFriendsUrl = '';
          _this.setData({ 'friendsCanvas.banner': '' });
          wx.showToast({ title: "图片生成失败",icon: "none" });
        }
      })
    }, 100));
  },
  //  canvas---------保存图片
  saveFriendsCanvasFun: function () {
    let _this = this;
    if (_this.data.friendsCanvas.banner != "") {
      wx.saveImageToPhotosAlbum({
        filePath: _this.data.friendsCanvas.banner,
        success: function () {
          wx.showToast({ title: "邀请好友海报已经保存到相册，您可以手动分享到朋友圈~", icon: "none" });
          _this.setData({ 'friendsCanvas.layerHide': true,'friendsCanvas.canvasHide': true });
        },
        fail: function (res) {
          wx.getSetting({
            success: (res) => {
              if (!res.authSetting['scope.writePhotosAlbum']) {
                _this.openConfirm()
              } else {
                wx.showToast({ title: "您已取消保存图片到相册~", icon: "none" });
              }
              _this.setData({ 'friendsCanvas.layerHide': true,'friendsCanvas.canvasHide': true });
            }
          })
        }
      })
    }
  },
  // ------------------------------- 绘图 邀请好友 end ------------------------------------

  //  canvas---------打卡权限
  openConfirm: function () {
    wx.showModal({
      content: '检测到您没打开保存图片权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {}
          })
        } else {
          wx.showToast({
            title: "您还没有打开打开保存图片权限，不能保存图片哦~",
            icon: "none"
          });
        }
      }
    });
  },  
  // canvas---------绘制文字
  dealWordsFun: function (options) {
    options.ctx.setTextAlign(options.align);
    options.ctx.font = options.font;
    options.ctx.setFillStyle(options.color);
    if (options.type == 'normal') {
      options.ctx.fillText(options.word, options.x, options.y + options.lineHeight);
    } else {
      var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth);
      var count = '';
      if (options.type == 'over') {
        count = allRow >= options.maxLine ? options.maxLine : allRow;
      } else {
        count = allRow;
      }
      var endPos = 0;
      for (var j = 0; j < count; j++) {
        var nowStr = options.word.slice(endPos);
        var rowWid = 0;
        if (options.ctx.measureText(nowStr).width > options.maxWidth) {
          for (var m = 0; m < nowStr.length; m++) {
            rowWid += options.ctx.measureText(nowStr[m]).width;
            if (rowWid > options.maxWidth) {
              if (options.type == 'over') {
                if (j === options.maxLine - 1) {
                  options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * options.lineHeight);
                } else {
                  options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * options.lineHeight);
                }
              } else {
                options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * options.lineHeight);
              }
              endPos += m;
              break;
            }
          }
        } else {
          options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * options.lineHeight);
        }
      }
    }
  },
  // canvas---------加载图片
  loadImageFun: function (item) {
    if (item && item != 'undefined' && item != null && item != 'null') {
      return new Promise((resolve) => {
        wx.getImageInfo({
          src: item.originalUrl,
          success: (res) => {
            item.drawUrl = res.path;
            resolve(item);
          },
          fail: function () {
            resolve(item);
          }
        });
      })
    } else {
      resolve('');
    }
  },

  // 请求-----------2.a 小程序码生成
  queryCanvasQRcodeFun: function(){
    wx.showLoading({ title: 'Loading…', mask: true });
    let _this = this;
    var params = {
      appid : app.globalData.appId,
      width: 120
    };
    Api.wxQrCodeUnLimit(params,
      function (res) {
        var _key = 'todayCanvas.imgArr[1].originalUrl';
        var _key2 = 'friendsCanvas.imgArr[1].originalUrl';
        app.globalData.canvasQRcode = res;
        wx.setStorageSync("fat_canvasQRcode", res); // 带用户信息的小程序码
        _this.setData({ [_key] : res, [_key2] : res });
      },
      function(){ wx.hideLoading(); },
    );
  },


})
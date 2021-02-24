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

    successLayerShow : false, // 打卡成功弹窗

    todayInfo : '', // 今日打卡数据

    weight : '', // 体重
    breakfast : '', // 早餐
    lunch : '', // 午餐
    dinner : '', // 晚餐
    snack : '', // 加餐
    sports : '', // 运动

    weightArr: [],  // 选择体重数据
    weightArrIndex : [20, 0], // 默认是50kg
    weightNumArr : [], // 30 --200
    weightNumArr2 : [], // 30 --200

    todayCanvas:{ // 日签
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
      txt1 : '', // 打卡天数
      txt2 : '', // 格式化日期
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _arr1 = [], 
      _arr2 = [], 
      _arr = []; 
    for (var i = 30; i <= 200; i++) { _arr1.push(i); } 
    for (var i = 0; i <= 9; i++) { _arr2.push('.' + i); } 
    _arr = [_arr1, _arr2]; 
    this.setData({ weightArr: _arr, weightNumArr : _arr1, weightNumArr2 : _arr2 }); 

    this.queryTodayInfoFun(); // 获取今日打卡数据
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
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
  // 功能------关闭打卡成功弹窗
  closeSuccessLayerFun: function () {
    this.setData({
      successLayerShow: false
    });
  },

  // 请求-----------6.b 获取今日会员打卡记录
  queryTodayInfoFun: function(){
    let _this = this;
    wx.showLoading({ title: 'Loading…', mask: true });
    Api.todayClock('',
      function (res) {
        _this.setData({ 
          todayInfo : res,
          weight : !res.weight ? 50 : res.weight, 
          breakfast : res.breakfast, 
          lunch : res.lunch, 
          dinner : res.dinner, 
          snack : res.snack, 
          sports : res.sports
         });
         if(!res.weight){
           var _arr = [20, 0];
           _this.setData({ weightArrIndex : _arr });
         }else{
           _this.wArrInitializeFun(res.weight);
         }
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); }
    );
  },
  // 请求-----------4.b 修改打卡记录
  querySaveInfoFun: function(){
    let _this = this;
    wx.showLoading({ title: 'Loading…', mask: true });
    var _params = {
      weight : Number(_this.data.weight), 
      breakfast : _this.data.breakfast, 
      lunch : _this.data.lunch, 
      dinner : _this.data.dinner, 
      snack : _this.data.snack, 
      sports : _this.data.sports
    }
    Api.updateMemberFatLossClock(_params,
      function (res) {
        _this.setData({
          todayWeight : res.todayWeight,
          friendsRank : res.friendsRank,
          signDaySum : res.signDaySum,
          successLayerShow : true
        });
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); }
    );
  },
  // 功能-----------输入框输入
  inputFun: function (e) {
    this.setData({
      [e.currentTarget.dataset.txt]: e.detail.value,

    });
  },
   // 功能-----------体重改变 
   changeWeightFun: function (e) { 
     let _this = this;
     var _arr = e.detail.value;
     var _num1 = _arr[0];
     var _num2 = _arr[1];
     var _txt1 = _this.data.weightNumArr[_num1];
     var _txt2 = _this.data.weightNumArr2[_num2];
     var _weight = '';
     _num2 == 0 ? _weight = _txt1 : _weight = String(_txt1) + String(_txt2);
    this.setData({ 
      weight : _weight,
      weightArrIndex: e.detail.value 
    }) 
  },
  // 功能-----------查找某个元素在数组中的位置
  indexInArrFun : function(arr, item) {
    return arr.findIndex(value => value === item );    
  },
  // 功能-----------体重数组回显
  wArrInitializeFun : function(weight){
    var _this = this;
    var _num = weight ? weight : '';
    if(_num == ''){
      var _arr = [20, 0];
      _this.setData({ weightArrIndex : _arr });
    }else{
      var _arr = String(_num).split('.');
      var _txt1 = _arr[0];
      var _txt = _this.indexInArrFun(_this.data.weightNumArr,_txt1);
      _txt = _txt == '' ? 20 : _txt;
      var _txt2 = _arr[1] == '' || !_arr[1] ? 0 : '';
      var arr = [Number(_txt),Number(_txt2)];
      _this.setData({ weightArrIndex : arr });
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
        _this.setData({ [_key] : res, [_key2] : _canvasQRcode });
      },
      function(){ wx.hideLoading(); },
    );
  },
  // ------------------------------- 绘图 日签 start------------------------------------

  showTodayCanvasFun: function () {
    var _this = this;
    if (_this.data.todayCanvas.banner && _this.data.todayCanvas.banner != '') { // 已经生成过日签
      _this.setData({ 'todayCanvas.layerHide': false });
    } else { // 未生成过
      wx.showLoading({ title: '日签生成中…', mask: true });

      var _arr = app.globalData.canvasTodayBgs;
      var _day = (new Date()).getDay();
      var _bg = _arr[_day];
      var _key = 'todayCanvas.imgArr[0].originalUrl';
      _this.setData({ [_key] : _bg });

      // 请求海报需要展示的数据  正常只需要这个 _this.getTodayCanvasDrawUrlFun(_this.data.todayCanvas.imgArr);
      Api.sharePosters('',
        function (res) {
          _this.setData({ 'todayCanvas.txt1' : res.signDaySum, 'todayCanvas.txt2' : res.dateTime });
          _this.getTodayCanvasDrawUrlFun(_this.data.todayCanvas.imgArr);
        },
        function(){ wx.showToast({ title: "日签生成失败，请稍后再试",icon: "none" }); }
      );
    }
  },
  closeTodayCanvasFun: function () {
    this.setData({ 'todayCanvas.layerHide': true,'todayCanvas.canvasHide': true });
  },
  // canvas---------获取绘图路径
  getTodayCanvasDrawUrlFun: function (param) {
    var _this = this;
    let imageArr = param;
    let arr = [];
    imageArr.forEach((item) => {
      arr.push(_this.loadImageFun(item));
    });
    Promise.all(arr).then((newList) => {
      _this.setData({ 'todayCanvas.imgArr': newList,'todayCanvas.canvasHide': false }, () => {
        setTimeout(() => {
          _this.creatTodayCanvasFun();
        }, 10);
      });
    });
  },
  // canvas---------生成图片
  creatTodayCanvasFun: function () {
    let _this = this;
    // 创建画布
    let ctx = wx.createCanvasContext('todayCanvas');
    // 基本显示内容
    var _txt1 = _this.data.todayCanvas.txt1;
    var _txt2 = _this.data.todayCanvas.txt2;
    var _bg = _this.data.todayCanvas.imgArr[0].drawUrl; // 背景 
    var _QRcode = _this.data.todayCanvas.imgArr[1].drawUrl; // 小程序码
    
    // 背景
    ctx.drawImage(_bg, 0, 0, _this.data.todayCanvas.width, _this.data.todayCanvas.height);

    // 打卡天数
    _this.dealWordsFun({
      type: 'normal',
      ctx: ctx,
      align: 'center',
      font: 'normal 240px "alibaba-medium"',
      lineHeight: 330,
      word: _txt1,
      x: _this.data.todayCanvas.width / 2,
      y: 300,
      color: '#FFFFFF',
    });

    // 今日日期
    _this.dealWordsFun({
      type: 'normal',
      ctx: ctx,
      align: 'left',
      font: 'normal 32px "alibaba"',
      lineHeight: 48,
      word: _txt2,
      x: 124,
      y: 830,
      color: '#FFFFFF',
    });

    // 小程序码
    ctx.drawImage(_QRcode, 510, 898, 116, 116);

    ctx.draw(false, setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: _this.data.todayCanvas.width,
        height: _this.data.todayCanvas.height,
        destWidth: _this.data.todayCanvas.width * 2,
        destHeight: _this.data.todayCanvas.height * 2,
        canvasId: 'todayCanvas',
        success(res) {
          app.globalData.canvasTodayUrl = res.tempFilePath;
          _this.setData({
            'todayCanvas.banner': res.tempFilePath,
            'todayCanvas.layerHide': false,
            successLayerShow : false
          });
          wx.hideLoading();
        },
        fail: function (res) {
          app.globalData.canvasTodayUrl = '';
          _this.setData({ 'todayCanvas.banner': '' });
          wx.showToast({ title: "图片生成失败",icon: "none" });
        }
      })
    }, 100));
  },
  //  canvas---------保存图片
  saveTodayCanvasFun: function () {
    let _this = this;
    if (_this.data.todayCanvas.banner != "") {
      wx.saveImageToPhotosAlbum({
        filePath: _this.data.todayCanvas.banner,
        success: function () {
          wx.showToast({ title: "日签海报已经保存到相册，您可以手动分享到朋友圈~", icon: "none" });
          _this.setData({ 'todayCanvas.layerHide': true,'todayCanvas.canvasHide': true });
        },
        fail: function (res) {
          wx.getSetting({
            success: (res) => {
              if (!res.authSetting['scope.writePhotosAlbum']) {
                _this.openConfirm()
              } else {
                wx.showToast({ title: "您已取消保存图片到相册~", icon: "none" });
              }
              _this.setData({ 'todayCanvas.layerHide': true,'todayCanvas.canvasHide': true });
            }
          })
        }
      })
    }
  },
  // ------------------------------- 绘图 日签 end ------------------------------------

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


})
// pages/mine/index.js
const app = getApp()
// const Api = require("../../config/api.method.js") 接口封装方法


Page({
  /**
   * 页面的初始数据
   */
  data: {
    theme: 'default',

    // 系统默认数据初始化
    defaultImg: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/default_user.png', // 默认头像
    defaultImgUrl: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/', // 默认图片路径
    defaultAppName : '减脂打卡+', // 默认小程序名称

    uerIsRegister: false, // 是否授权过
    updateType : '', // 授权更新的下一步  clock，每日打卡，rangking 排行榜，shareToday 分享日签，shareFriend 邀请好友
    userInfo: '', // 用户基础信息
    weightInfo : '', // 用户体重信息
    appInfo : '', // 当前小程序app的信息
    weekTargetInfo : '', // 体重周目标
    wechatStepsInfo : '', // 微信步数数据
    articleInfo: [], // 公众号文章

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    let _this = this;
    // _this.queryArticleInfoFun(); // 文章数据

    let _isRegister = wx.getStorageSync("fat_isRegister") || app.globalData.uerIsRegister; // 获取是否有用户信息
    _this.setData({ uerIsRegister : _isRegister });

    if(_isRegister == true || _isRegister == 'true'){ // 授权过用户信息
      // _this.queryUserBaseInfoFun(); // 基础数据
    }
    // _this.queryBindFriendFun(); // 绑定好友关系
  },

  onShow: function () {
    let _this = this;
    
    // _this.queryAppInfoFun(); // app数据

    let _isRegister = app.globalData.uerIsRegister; // 获取是否有用户信息
    _this.setData({ uerIsRegister : _isRegister });

    if(_isRegister == true || _isRegister == 'true'){ // 授权过用户信息
      // _this.getWxRunDataFun(); // 步数信息授权
      // _this.queryUserWeightFun(); // 体重数据
      // _this.queryWeekTargetInfoFun(); // 体重周目标
      // _this.queryWechatStepsInfoFun(); // 微信步数

      let _canvasQRcode = wx.getStorageSync("fat_canvasQRcode") || app.globalData.canvasQRcode; // 获取用户专属的分享码
      let _canvasFriendsUrl = app.globalData.canvasFriendsUrl; // 获取用户专属的分享码
      if(_canvasFriendsUrl != ''){
        // _this.setData('friendsCanvas.banner',_canvasFriendsUrl);
      }
      if(_canvasQRcode == ''){
        // _this.queryCanvasQRcodeFun(); // 获取用户专属的分享码
      }else{
        var _key = 'todayCanvas.imgArr[1].originalUrl';
        var _key2 = 'friendsCanvas.imgArr[1].originalUrl';
        _this.setData({ [_key] : _canvasQRcode , [_key2] : _canvasQRcode });
      }
    }
  },
  /*
  * 页面滚动 -- 置顶需要加这个
  */
  onPageScroll: function (e) {
    let _this = this;
    var _theme = _this.data.theme;
    if (e.scrollTop >= 30) {
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
  // 跳转---------编辑体重目标
  linkTargetWeightFun: function () {
    wx.showLoading({ title: 'Loading…', mask: true });
    wx.navigateTo({ url: '/pages/v1-target-weight/index' })
    wx.hideLoading();
  },
  // 跳转---------体重周报
  linkReportWFun: function () {
    wx.showLoading({ title: 'Loading…', mask: true });
    wx.navigateTo({ url: '/pages/v1-report-weight/index' })
    wx.hideLoading();
  },
  // 跳转---------步数月报
  linkReportSFun: function () {
    wx.showLoading({ title: 'Loading…', mask: true });
    wx.navigateTo({ url: '/pages/v1-report-steps/index' })
    wx.hideLoading();
  },
  // 跳转---------排行榜
  linkRankingFun: function () {
    wx.showLoading({ title: 'Loading…', mask: true });
    wx.navigateTo({ url: '/pages/v1-rangking/index' })
    wx.hideLoading();
  },
  // 跳转---------去打卡
  linkClockFun: function () {
    wx.showLoading({ title: 'Loading…', mask: true });
    wx.navigateTo({ url: '/pages/v1-clock/index' })
    wx.hideLoading();
  },
  // 跳转---------文章阅读
  linkCaseViewFun : function(e){
    wx.showLoading({ title: 'Loading…', mask: true });
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({ url: '/pages/v1-case-view/index?url=' + url });
    wx.hideLoading();
  },
  // 跳转---------体重历史记录
  linkWeightHistoryFun : function(){
    wx.showLoading({ title: 'Loading…', mask: true });
    wx.navigateTo({ url: '/pages/v1-history/index' });
    wx.hideLoading();
  },
  // 跳转---------精选推荐文章列表
  linkCaseFun : function(){
    wx.showLoading({ title: 'Loading…', mask: true });
    wx.navigateTo({ url: '/pages/v1-case/index' });
    wx.hideLoading();
  },
  // 请求-----------1.b 授权用户头像等信息
  updateTypeFun: function(e){
    var _type = e.currentTarget.dataset.type;
    this.setData({ updateType : _type });
  },
  // 请求-----------1.b 授权用户头像等信息 更新用户信息
  queryUpdateInfo: function (e){
    let _this = this;
    if(e.detail.userInfo){
      wx.showLoading({ title: 'Loading…', mask: true });
      wx.getUserInfo({
        success: res => {
          var rawData = res.rawData
          var signature = res.signature
          var encryptedData = res.encryptedData
          var iv = res.iv
          var userInfo = res.userInfo
          var nickName = userInfo.nickName
          var avatarUrl = userInfo.avatarUrl
          var gender = userInfo.gender //性别 0：未知、1：男、2：女
          var province = userInfo.province
          var city = userInfo.city
          var country = userInfo.country

          var _params = {
            appId : app.globalData.appId,
            rawData : rawData,
            signature : signature,
            encryptedData : encryptedData,
            iv : iv,
            nickName : nickName,
            avatarUrl : avatarUrl,
            gender : gender,
            province : province,
            city : city,
            country : country,
          };
          Api.quickLogin(_params,
            function (res2) {
              if(res2 == true){ 
                wx.setStorageSync("fat_isRegister", true); // 缓存中，用户是否授权
                app.globalData.uerIsRegister = true;
                _this.setData({ uerIsRegister : true });
                // 更新系统用户基本信息
                _this.queryUserBaseInfoFun();
                _this.queryUserWeightFun(); // 体重数据
                _this.queryWeekTargetInfoFun(); // 体重周目标
                _this.queryWechatStepsInfoFun(); // 微信步数
                // _this.queryWxRunDataFun(); // 获取用户步数
              } 
            },
            function(){ wx.hideLoading(); }
          );
        },
        fail : res => { wx.hideLoading(); }
      });
    }else{
      wx.showToast({ title: '授权体验更多APP内容~', icon: "none", mask: true });
    }
  },
  // 请求-----------1.c 获取用户基础信息
  queryUserBaseInfoFun: function(){
    let _this = this;
    Api.memberInfoByMemberId('',
      function (res) {
        app.globalData.userInfo = res;
        _this.setData({ userInfo : res });
      }
    );
  },
  // 请求-----------1.c 获取用户基础信息
  queryUserWeightFun: function(){
    let _this = this;
    wx.showLoading({ title: 'Loading…', mask: true });
    Api.fatLossClocMemberInfo('',
      function (res) {
        _this.setData({ weightInfo : res });
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); }
    );
  },
  // 请求-----------3.b 当前APP参与人数信息查询
  queryAppInfoFun: function(){
    let _this = this;
    wx.showLoading({ title: 'Loading…', mask: true });
    Api.fatLossClockHomePage('',
      function (res) {
        _this.setData({ appInfo : res });
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); }
    );
  },
  // 请求-----------3.c 当前用户周目标信息
  queryWeekTargetInfoFun: function(){
    let _this = this;
    wx.showLoading({ title: 'Loading…', mask: true });
    Api.weekTarget('',
      function (res) {
        _this.setData({ weekTargetInfo : res });
        app.globalData.targetWeight = !res.targetWeight || res.targetWeight == 0 ? "" : res.targetWeight;
        wx.hideLoading();
      },
      function(){ wx.hideLoading(); }
    );
  },
  // 请求-----------3.d 当前用户今日步数信息
  queryWechatStepsInfoFun: function(){
    // wx.showLoading({ title: 'Loading…', mask: true });
    let _this = this;
    Api.wechatSteps('',
      function (res) {
        _this.setData({ wechatStepsInfo : res });
        // if(res.isRegister){
        //   // 获得circle组件
        //   _this. annular = _this.selectComponent("#annular");
        //   // 绘制背景圆环
        //   _this. annular.drawCircleBg('annular_bg', 50, 8)
        //   // 绘制彩色圆环 
        //   _this. annular.drawCircle('annular_draw', 50, 8, res.todaySteps, 10000); 
        //   // wx.hideLoading();
        // }
        wx.hideLoading();
      },
      // function(){ wx.hideLoading(); }
    );
  },
  // 请求-----------3.f 最新的2篇文章推荐
  queryArticleInfoFun: function(){
    let _this = this;
    Api.marketingCase('',
      function (res) {
        _this.setData({ articleInfo : res });
      }
    );
  },
  // 请求-----------1.c 绑定好友关系
  queryBindFriendFun: function(){
    if(app.globalData.userShareId != ''){
      Api.distributorBind({ spreadid : app.globalData.userShareId });
    }
  },
  // 功能-------------请求授权微信运动步数，获取用户过去三十天微信步数
  getWxRunDataFun : function(){
    let _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          let code = res.code;
          wx.getWeRunData({
            success (res2) {
              // 拿 encryptedData 到开发者后台解密开放数据
              let encryptedData = res2.encryptedData;
              let iv = res2.iv;
              var _param = {
                appid : app.globalData.appId,
                js_code : code,
                encryptedData : encryptedData,
                iv : iv,
              }
              _this.queryWxRunDataFun(_param);
            }
          })
        }
      }
    }) 
  },
  // 请求-----------3.c 同步微信步数信息
  queryWxRunDataFun: function(param){
    // wx.showLoading({ title: 'Loading…', mask: true });
    let _this = this;
    Api.userStepInfo(param,
      function (res) {
        _this.queryWechatStepsInfoFun(); // 微信步数
      },
      // function(){ wx.hideLoading(); },
    );
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
  
  // ------------------------------- 绘图 日签 start------------------------------------

  showTodayCanvasFun: function () {
    var _this = this;
    if (_this.data.todayCanvas.banner && _this.data.todayCanvas.banner != '') { // 已经生成过日签
      _this.setData({ 'todayCanvas.layerHide': false });
    } else { // 未生成过
      wx.showLoading({ title: '日签生成中…', mask: true });

      var _arr = app.globalData.canvasTodayBgs;
      var _bg = _arr[Math.floor((Math.random() * _arr.length))];
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
            'todayCanvas.layerHide': false
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

})
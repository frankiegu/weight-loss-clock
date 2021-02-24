// app.js

// const font = require('/utils/font.js') 字体请求
App({
  onLaunch(options) {
    let _this = this;

    /*
     * scene = shareUserid; 
     *  shareUserid --- 分享用户在系统中的唯一标识
     * */
    const scene = decodeURIComponent(options.query.scene);
    let userId = wx.getStorageSync("fat_userId"); 
    let openId = wx.getStorageSync("fat_openId");
    let uerIsRegister = wx.getStorageSync("fat_isRegister"); 
    
    if(scene != '' && scene != 'undefined'){ 
      _this.globalData.userShareId = scene;
    }

    if(openId != '' && openId != 'undefined'){ 
      _this.globalData.openId = openId;
      _this.globalData.userId = userId;
      _this.globalData.uerIsRegister = uerIsRegister;
    }else{ 
      wx.login({
        success: function (res) {
          if (res.code) {
            const code = res.code;
            wx.request({
              url: _this.getUrl('login/GetOpenIdAndRegister'),
              data: {
                appid: _this.globalData.appId,
                js_code: code,
                grant_type : 'authorization_code'
              },
              success: function (result) {
                var _res = result.data.data;
                if (result.data.success) {
                  wx.aldstat.sendOpenid(_res.openId);
                  
                  _this.globalData.openId = _res.openId;
                  _this.globalData.userId = _res.userId;

                  wx.setStorageSync("fat_userId", _res.userId);
                  wx.setStorageSync("fat_openId", _res.openId);
                  wx.setStorageSync("fat_isRegister", _res.isRegister); 
            
                  typeof cb == "function" && cb(_this.globalData.openId)
                }
              }
            })
          }
        }
      })  
    }

    // 下载字体 需要引入字体需要自己配置
    // font.loadFont();

    // 查询随机的毒鸡汤
    wx.cloud.init();
    const db = wx.cloud.database({  env: 'fatlossclock-9gpwsn3r2ed98f31' });
    db.collection('hotQuotes').get({
      success(res) {
        _this.globalData.hotQuotesArr = res.data[0].cont;
        _this.globalData.hotQuotesArrTip = true;
      },
      fail(res) {
        _this.globalData.hotQuotesArrTip = true;
      },
      complete(res) {},
    });

    // 获取导航栏高度
    wx.getSystemInfo({
      success: res => {
        let isIOS = res.system.indexOf("iOS") > -1;
        let navHeight = 0;
        if (!isIOS) {
          navHeight = 48;
        } else {
          navHeight = 44;
        }
        _this.globalData.shijiNav.signalHeight = res.statusBarHeight;
        _this.globalData.shijiNav.capsuleHeight = navHeight;
        _this.globalData.shijiNav.allHeight = res.statusBarHeight + navHeight;
      }
    })
  },
  getUrl(route) {
    return `/${route}`; // 域名
  },
  globalData: {
    appId: '', // appid
    appRequestUrl: '', // 请求域名

    openId : '', // 用户openId
    userId : '', // 用户userId
    uerIsRegister : false, // 用户是否授权，默认是未授权过头像、昵称等数据
    userShareId : '', // 分享用户userId
    userInfo: '', // 用户基础信息，头像，昵称，性别等

    shareTitle: '减脂打卡+ | 一起享「瘦」生活', // 分享标题
    shareUrl: '/pages/v1-index/index', // 分享路径
    shareImg: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210207_9.png', // 分享图片

    defaultImg: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/default_user.png', // 默认头像
    defaultImgUrl: 'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/', // 默认图片路径
    defaultAppName : '减脂打卡+', // 默认小程序名称

    shijiShowBack: false, // 是否显示返回
    shijiNav: {
      signalHeight: 0, // 信息栏高度
      capsuleHeight: 0, // 胶囊高度
      capsuleWidth: 85, // 胶囊高度
      allHeight: 0 // 状态栏的高度
    },

    canvasTodayBgs : [
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210207_1.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210207_2.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210209_2.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210209_3.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210209_4.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210209_5.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210209_6.png'
    ], // 默认海报随机
    canvasFriendsBgs : [
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210207_3.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210207_4.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210209_7.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210209_8.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210209_9.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210209_10.png',
      'https://6661-fatlossclock-9gpwsn3r2ed98f31-1304792319.tcb.qcloud.la/static/img/20210209_11.png',
    ], // 默认海报随机
    canvasQRcode: '', // 小程序码图片
    canvasTodayUrl: '', // 日签图片
    canvasFriendsUrl: '', // 邀请好友

    hotQuotesArr: ['瘦了不一定会成为仙女，但胖了一定很丑！'], // 随机提示毒鸡汤
    hotQuotesArrTip: false, // 毒鸡汤数组
    targetWeight : '', // 目标体重

  },
})
// 加载字体
var loadFont = function () {

  wx.loadFontFace({
    family: 'alibaba', //设置一个font-family使用的名字 中文或英文
    global: true,//是否全局生效
    source: '', //字体资源的地址
    success: function (e) {
    },
    fail: function (e) {
    },
  })

  wx.loadFontFace({
    family: 'alibaba-medium', //设置一个font-family使用的名字 中文或英文
    global: true,//是否全局生效
    source: '', //字体资源的地址
    success: function (e) {
    },
    fail: function (e) {
    },
  })

  wx.loadFontFace({
    family: 'alibaba-blod', //设置一个font-family使用的名字 中文或英文
    global: true,//是否全局生效
    source: '', //字体资源的地址
    success: function (e) {
    },
    fail: function (e) {
    },
  })
}
module.exports = {
  loadFont: loadFont
};
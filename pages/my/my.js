const app = getApp()
var http = require("../../utils/http.js");
Page({
  data: {
    sts: '',
    canAmount: ''
  },
  onLoad: function (options) {
    if(!app.globalData.userInfo){
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return false
    }
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onGotUserInfo: function (res) {
    http.updateUserInfo();
  },
  // 跳转到订单页面
  GoOrder(){
    wx.switchTab({
      url: '/pages/order/order'
    })
  },
  // 跳转到个人资料
  GoPersonal(){
    wx.navigateTo({
      url: '/pages/personal/personal',
    })
  },
  // 跳转到帮助页面
  GoHelp(){
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },
  // 跳转到地址页面
  GoShowAddress(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  // 跳转到充值页面
  GoRecharge(){
    wx.navigateTo({
      url: '/pages/recharge/recharge',
    })
  },
  showTip() {
    wx.showToast({
      title: '功能尚未开放',
      icon: 'none'
    })
  },
  // 跳转到认证页面
  ShowAuthentication(){
    wx.navigateTo({
      url: '/pages/authentication/authentication',
    })
  },
    // 跳转到修改密码
    ShowChangePassword(){
    wx.navigateTo({
      url: '/pages/changePassword/changePassword',
    })
  },
  // 请求用户详情
  getUserInfo(){
    wx.showLoading();
    var params = {
      url: "/weixin/userInfo/getUserInfoByUserId",
      method: "GET",
      data: {
        userId: app.globalData.userInfo.userId
      },
      callBack: (res) => {
        wx.hideLoading();
        this.setData({
          canAmount: res.data.canAmount
        });
      }
    }
    http.request(params);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if(app.globalData.userInfo){
      this.getUserInfo()
    }
  }
})
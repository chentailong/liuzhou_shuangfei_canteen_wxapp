// pages/login/login.js
const http = require("../../utils/http.js");
const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    authorization: true,
    flag: 0,
    model: false, // 显示于隐藏获取微信用户名于头像
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme
  },

  //获取微信头像 
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl,
    })
  },
  // 获取微信名 并注册用户
  formSubmit(e) {
    console.log(e.detail.value.nickname);
    const that = this;
    if (!that.data.phone) {
      wx.showToast({
        title: '请获取您的手机号',
        icon: 'none'
      })
      return false
    }
    if (!e.detail.value.nickname) {
      wx.showToast({
        title: '请授权微信信息',
        icon: 'none'
      })
      return false
    }
    var params = {
      url: "/weixin/userInfo/registration",
      method: "POST",
      data: {
        openId: app.globalData.openid,
        userAvatar: that.data.avatarUrl,
        userName: that.data.userName || '',
        userNickName: e.detail.value.nickname,
        userPhone: that.data.phone,
        officerNumber: that.data.officerNumber,
        userSex: that.data.userSex
      },
      callBack: function (res) {
        console.log(res);
        app.globalData.userInfo = res.data
        that.GoPopup()
        wx.switchTab({
          url: '/pages/home/home'
        })
      }

    };
    http.request(params);
  },
 

  // 获取手机号码
  getUserPhone(e) {
    const that = this
    if (!e.detail.iv) {
      return false
    }
    var params = {
      url: "/weixin/userInfo/getWeixinPhone",
      method: "GET",
      data: {
        code: that.data.code,
        encryptDataB64: e.detail.encryptedData,
        ivB64: e.detail.iv
      },
      callBack: function (res) {
        if (res.data) {
          that.setData({
            phone: res.data
          })
        } else {
          wx.showToast({
            title: '获取手机号码失败',
            icon: 'none'
          })
          return
        }
      }
    };
    http.request(params);
  },
  // 授权允许点击登录按钮
  agreement() {
    this.setData({
      authorization: !this.data.authorization
    })
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
    const that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
        }
      }
    })
  },

  // 隐藏弹窗
  GoPopup(e) {
    this.setData({
      model: !this.data.model
    })
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

  }
})
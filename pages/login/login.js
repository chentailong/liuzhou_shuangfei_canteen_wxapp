// pages/login/login.js
const http = require("../../utils/http.js");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    authorization: true,
    flag: 0
  },
  // 用户注册
  registration(e) {
    const that = this;
    if (!that.data.phone) {
      wx.showToast({
        title: '请获取您的手机号',
        icon: 'none'
      })
      return false
    }
    if (!e.detail.userInfo) {
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
        userAvatar: e.detail.userInfo.avatarUrl,
        userName: that.data.userName || '',
        userNickName: e.detail.userInfo.nickName,
        userPhone: that.data.phone,
        officerNumber: that.data.officerNumber,
        userSex: e.detail.userInfo.gender
      },
      callBack: function (res) {
        console.log(res);
        app.globalData.userInfo = res.data
        wx.switchTab({
          url: '/pages/home/home'
        })
      }
    };
    http.request(params);
  }, 
  // 获取姓名
  getName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 获取会员类型
  getType(e) {
    // console.log(e)
    this.setData({
      index: e.detail.value
    })
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
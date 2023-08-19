const http = require("../../utils/http.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sts: 0,
    orderNumbers: '',
    model: false, // 隐藏支付密码弹窗
    userPassword: '',
    orderIds: '',
    payType: 2,
    actualTotal: '',
    canAmount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    this.setData({
      sts: options.sts,
      // orderNumbers: options.orderNumbers,
      orderType: options.orderType,
      orderIds: options.orderNumbers,
      payType: options.payType,
      actualTotal: options.actualTotal
    });
  },
  toOrderList: function () {
    if(this.data.sts==0){
      wx.reLaunch({
        url: '../order/order?sts=0',
      })
    } else if(this.data.sts==1){
      wx.reLaunch({
        url: '../order/order?sts=1',
      })
    }
    
  },
  // 请求用户详情
  getUsercanAmount(){
    var params = {
      url: "/weixin/userInfo/getUserInfoByUserId",
      method: "GET",
      data: {
        userId: app.globalData.userInfo.userId
      },
      callBack: (res) => {
        this.setData({
          canAmount: res.data.canAmount
        });
      }
    }
    http.request(params);
  },
  // 用户输入密码
  onReceiverInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    });
  },
  // 隐藏弹窗
  GoPopup(e) {
    this.setData({
      model: !this.data.model
    })
  },
  toIndex: function () {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  /**
   * 唤起微信支付
   */
  calWeixinPay: function (actualTotal) {
    wx.showLoading({
      mask: true
    });
    const that = this
    var params = {
      url: "/weixin/order/pay",
      method: "POST",
      data: {
        payType: 2,
        orderIds: that.data.orderIds,
        userPassword: that.data.userPassword,
        actualTotal: actualTotal
      },
      callBack: function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.errorCode == 200 && this.data.payType == 1) {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.packageValue,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success: e => {
              wx.redirectTo({
                url: '/pages/through/through?sts=1&orderNumbers=' + that.data.orderIds + "&orderType=" + this.data.payType+"&actualTotal=" + that.data.actualTotal,
              })
            },
            fail: err => {
              wx.redirectTo({
                url: '/pages/through/through?sts=0&orderNumbers=' + that.data.orderIds + "&orderType=" + this.data.payType+"&actualTotal=" + that.data.actualTotal,
              })
            }
          })
        } else if (res.errorCode == 200 && this.data.payType == 2) {
          wx.redirectTo({
            url: '/pages/through/through?sts=1&orderNumbers=' + that.data.orderIds + "&orderType=" + this.data.payType+"&actualTotal=" + that.data.actualTotal,
          })
        } else if (res.errorCode == 500) {
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: false,
            confirmText: '返回',
            success: function (res) {
              wx.redirectTo({
                url: '/pages/through/through?sts=0&orderNumbers=' + that.data.orderIds + "&orderType=" + that.data.payType + "&actualTotal=" + that.data.actualTotal,
              })
            }
          })
          return false
        }
      }
    };
    http.request(params);
  },
  // 请求用户详情
  getUserInfo(){
    var params = {
      url: "/weixin/userInfo/getUserInfoByUserId",
      method: "GET",
      data: {
        userId: app.globalData.userInfo.userId
      },
      callBack: (res) => {
        // this.setData({
        //   canAmount: res.data.canAmount
        // });
      }
    }
    http.request(params);
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

  },
  
})
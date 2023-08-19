const http = require("../../utils/http.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sts: 0,
    orderNumbers: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      sts: options.sts,
      orderNumbers: options.orderNumbers,
      orderType: options.orderType
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
  toIndex: function () {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  /**
   * 唤起微信支付
   */
  calWeixinPay: function() {
    wx.showLoading({
      mask: true
    });
    const that = this
    var params = {
      url: "/weixin/order/pay",
      method: "POST",
      data: {
        payType: this.data.orderType,
        orderIds: this.data.orderNumbers
      }, 
      callBack: function(res) {
        wx.hideLoading();
        if(res.errorCode == 200 && this.data.payType == 1){
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.packageValue,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success: e => {
              wx.redirectTo({
                url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' +  + "&orderType=" + this.data.orderType,
              })
            },
            fail: err => {
              // console.log(res)
              
            }
          })
        }else if(res.errorCode == 200 && this.data.payType == 2){
          wx.redirectTo({
            url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + orderNumbers + "&orderType=" + this.data.orderType,
          })
        }
        // else{
        //   wx.showModal({
        //     title: '提示',
        //     content: res.message + '，是否使用微信支付？',
        //     success: function(res){
        //       if (res.confirm) {
        //         that.setData({
        //           orderType: 1
        //         })
        //         that.calWeixinPay();
        //       } else if (res.cancel) {
        //         wx.redirectTo({
        //           url: '/pages/pay-result/pay-result?sts=0&orderNumbers=' + orderNumbers + "&orderType=" + that.data.orderType,
        //         })
        //       }
        //     }
        //   })
        //   return false
        // }

      }
    };
    http.request(params);
  },
  /**
   * test
   */
  // toOrderList(e){
  //   wx.reLaunch({
  //     url: '../order/order',
  //   })
  // },

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
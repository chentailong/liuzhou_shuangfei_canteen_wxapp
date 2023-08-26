// pages/order/order.js
const http = require("../../utils/http.js");
const util = require("../../utils/util.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    index: 0,
    orderNumbers: '',
    orderList: [],
    model: false,
    toPlay: false,
    OrderId: '',
    payType: "",
    orderIds: "",
    orderId: '',
    showshitang: false,
    showShopping: false,
    currentTime: util.formatDate(new Date()),
    detailFlag: true,
    userPassword: '',
    appointmentTime: '',
    returnMoneyStatus: '',
    detail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      mask: true
    });
    if (options.sts != undefined) {
      this.setData({
        index: options.sts
      })
    }
  },

  // 导航切换
  switchNav(e) {
    this.setData({
      pageFlag: false,
      index: e.currentTarget.dataset.index,
      orderList: [],
      current: 1
    })
    this.myOrder()
  },

  // 获取订单
  myOrder() {
    wx.showLoading({
      mask: true
    });
    const that = this
    let orderStatus = ''

    if (that.data.index == 0) {
      //待支付
      orderStatus = 1
    } else if (that.data.index == 1) {
      //待取餐
      orderStatus = 2
    } else if (that.data.index == 2) {
      //已取餐
      orderStatus = 3
    } else if (that.data.index == 3) {
      //已退餐
      orderStatus = 4
    } else if (that.data.index == 4) {
      orderStatus = 5
    }
    var params = {
      url: "/weixin/order/myOrder",
      method: "POST",
      data: {
        current: that.data.current,
        orderStatus: orderStatus,
        appointmentTime: that.data.currentTime,
        size: 15,
        remarks: that.data.remarks,
        orderFeed: 2
      },
      callBack: function (res) {
        that.data.orderList = []
        if (res.data.records.length > 0) {
          let orderItem = that.data.orderList.concat(res.data.records)
          that.setData({
            orderList: that.data.orderList.concat(res.data.records)
          })
          for (var i = 0; i < orderItem.length; i++) {
            if (orderItem[i].orderRefunds) {
              if (orderItem[i].orderRefunds.returnMoneyStatus == 1) {
                that.data.returnMoneyStatus = '退款处理中'
              } else if (orderItem[i].orderRefunds.returnMoneyStatus == 2) {
                that.data.returnMoneyStatus = '退款成功'
              } else if (orderItem[i].orderRefunds.returnMoneyStatus == -1) {
                that.data.returnMoneyStatus = '退款失败'
              }
            }
            this.data.appointmentTime = orderItem[i].appointmentTime
          }
          that.setData({
            orderList: that.data.orderList,
            appointmentTime: that.data.appointmentTime,
            returnMoneyStatus: that.data.returnMoneyStatus
          })
        } else {
          that.setData({
            pageFlag: true
          })
        }
      }
    };
    http.request(params);
  },

  // 获取更多
  getMore() {
    if (this.data.pageFlag) {
      return false
    }
    this.setData({
      current: this.data.current + 1
    })
    this.myOrder()
  },

  // 用户输入密码
  onReceiverInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    });
  },

  // 关闭详情页弹窗
  closeDetail() {
    this.setData({
      detailFlag: true
    })
  },

  // 查看详情
  showDetail(e) {
    const that = this
    var params = {
      url: "/weixin/userInfo/getUserInfoByUserId",
      method: "GET",
      data: {
        userId: e.currentTarget.dataset.item.userId
      },
      callBack: function (res) {
        if (res.errorCode === 200) {
          that.setData({
            "detail.userName": res.data.userName
          })
        }
      }
    };
    http.request(params);
    this.setData({
      detail: e.currentTarget.dataset.item,
      detailFlag: false
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
    this.myOrder()
  },
  /**
   * 取消订单
   */
  roomOrderCancel(orderId) {
    const that = this
    var params = {
      url: "/weixin/order/cancel",
      method: "PUT",
      data: {
        orderId
      },
      callBack: function (res) {
        console.log(res);
        if (res.errorCode == 200) {
          that.setData({
            orderList: [],
            current: 1
          })
          that.myOrder();
        } else {
          wx.showToast({
            title: "退款失败",
            icon: 'none',
            duration: 1000
          })
        }
      }
    }
    http.request(params);
  },
  // 点击取消
  cancel(e) {
    var orderId = e.currentTarget.dataset.id;
    const that = this
    wx.showModal({
      title: '提示',
      content: '您确认要取消此订单？',
      confirmColor: "#ff565f",
      cancelColor: "#aaaaaa",
      cancelText: '取消',
      confirmText: '确认',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          });
          that.roomOrderCancel(orderId)
          // 
        }
      }
    })
  },
  // 退款
  refund(e) {
    var orderId = e.currentTarget.dataset.id;
    const that = this
    wx.showModal({
      title: '提示',
      content: '您确认要退款？',
      confirmColor: "#ff565f",
      cancelColor: "#aaaaaa",
      cancelText: '取消',
      confirmText: '确认',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          });
          that.roomOrderCancel(orderId)

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
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      current: this.data.current + 1
    })

    if (this.data.flag == 1) {
      this.myOrder()
    }
  },

  // 隐藏弹窗
  GoPopup(e) {
    this.setData({
      model: !this.data.model,
      orderiD: e.currentTarget.dataset.id,
      actualTotal: e.currentTarget.dataset.actualtotal
    })
  },

  // 获取就餐方式
  getDiningType(e) {
    this.setData({
      payType: e.detail.value
    })
  },
  jumpPayType() {
    var payType = this.data.payType;
    if (payType == 1) {
      this.calWeixinPay()
    } else {
      this.showDetail()

    }

  },
  // 获取订单备注
  getRemarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  },

  /**
   * 唤起微信支付
   */
  calWeixinPay: function (e) {
    console.log(e)
    var that = this;
    var payType = that.data.payType;
    console.log(this.data.orderiD)
    // console.log(payType)
    // return false

    // if (!that.data.userPassword) {
    //   wx.showToast({
    //     title: '请输入密码',
    //     icon: "none"
    //   })
    //   return;
    // }

    wx.showLoading({
      mask: true
    });
    var params = {
      url: "/weixin/order/pay",
      method: "POST",
      data: {
        payType: this.data.payType,
        orderIds: this.data.orderiD,
        userPassword: this.data.userPassword
      },
      callBack: function (res) {
        if (res.errorCode == 200 && this.data.payType == 1) {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.packageValue,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success: e => {
              wx.showToast({
                title: '支付成功',
              })
              that.setData({
                detailFlag: !that.data.detailFlag,
                model: !that.data.model,
                pageFlag: false,
                orderList: [],
                current: 1
              })
              that.myOrder()
            }
          })
        } else if (res.errorCode == 200 && this.data.payType == 2) {
          wx.showToast({
            title: '支付成功',
          })
          that.setData({
            detailFlag: !that.data.detailFlag,
            model: !that.data.model,
            pageFlag: false,
            orderList: [],
            current: 1
          })
          that.myOrder()
        } else if (this.data.payType == 2) {
          wx.showModal({
            title: '提示',
            content: res.message,
            success: e => {
              that.setData({
                detailFlag: false,
                userPassword: null,
              })
              that.data.userPassword = ''
            },
            fail: err => {
              that.setData({
                detailFlag: false
              })
              that.data.userPassword = ''
            }
          })
          return false
        }
      }
    }
    http.request(params);
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})
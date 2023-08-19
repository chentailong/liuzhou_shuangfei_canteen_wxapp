const http = require("../../utils/http.js");
const app = getApp()
var index = [0, 0, 0];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showshitang: false,
    frompage: '',
    shopping: false,
    diningType: '',
    payType: 2,
    floor: false,
    addrList: [0, 0, 0],
    userInfo: [],
    addressList: [],
    userAddrId: '',
    productId: '',
    productNums: '',
    productSkuId: '',
    orderEntry: "0",
    count: 0,
    total: 0,
    receiver: '',
    addr: '',
    mobile: '',
    userAddr: false,
    showUserAddr: false,
    urgent: '',
    orderFeed: '',
    model: false, // 隐藏支付密码弹窗
    userPassword: '',
    canAmount: '',
    sceneStr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      frompage: options.frompage
    })
    if (options.frompage == '营养食堂') {
      this.setData({
        showshitang: true
      })
      this.setData({
        shopping: false
      })
    } else if (options.frompage == '便民超市') {
      this.setData({
        showshitang: false
      })
    }
    if (options.type == 1) {
      this.setData({
        showUserAddr: false
      })
    } else if (options.type == 0) {
      this.setData({
        showUserAddr: true
      })
    }
    this.setData({
      orderEntry: options.orderEntry,
      type: options.type,
      orderTime: options.orderTime,
      orderFeed: options.orderEntry,
      appointmentTime: options.appointmentTime
    });

  },
  // 隐藏弹窗
  GoPopup(e) {
    this.setData({
      model: !this.data.model
    })
  },
  // 获取用户信息
  getUserInfo() {
    var addrId = ''
    if (this.data.userAddr != null) {
      addrId = this.data.userAddr.userAddrId;
    }
    wx.showLoading({
      mask: true
    });
    var ths = this;
    var params = {
      url: "/weixin/order/confirm",
      method: "POST",
      data: {
        urgent: ths.data.urgent,
        orderTime: ths.data.orderTime,
        orderType: ths.data.type,
        userAddrId: addrId,
        shoppCartIds: JSON.parse(wx.getStorageSync("shopCartIds")),
        couponIds: ths.data.couponIds,
        isChangeCoupon: ths.data.isChangeCoupon,
        orderFeed: ths.data.orderFeed,
        sceneStr: app.globalData.sales ? app.globalData.sales.sceneId : ''
      },
      callBack: res => {
        console.log(res);
        wx.hideLoading();
        if (res.errorCode == 817) {
          wx.showModal({
            title: '提示',
            confirmText: '返回',
            content: res.message,
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
          return false
        } else if (res.errorCode == 818) {
          wx.showModal({
            title: '提示',
            confirmText: '返回',
            content: res.message,
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
          return false
        } else if (res.errorCode == 819) {
          wx.showModal({
            title: '提示',
            confirmText: '返回',
            content: res.message,
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
          return false
        }
        let orderItems = [];
        var orderit = res.data.shopCartOrders
        for (var i = 0; i < orderit.length; i++) {
          orderit[i].shopCartItemDiscounts.forEach(itemDiscount => {
            orderItems = orderItems.concat(itemDiscount.shopCartItems)
          })
          if (orderit[i].coupons) {
            let canUseCoupons = orderit[i].coupons
            let unCanUseCoupons = orderit[i].notCoupons
            orderit[i].coupons.forEach(coupon => {
              if (coupon.couponVo.coupon.select) {
                this.data.couponIds.push(coupon.couponVo.coupon.couponId)
              }
            })
            this.setData({
              coupons: {
                totalLength: res.data.shopCartOrders[0].coupons.length,
                canUseCoupons: canUseCoupons,
                unCanUseCoupons: unCanUseCoupons
              }
            })
          }
        }
        this.setData({
          urgent: res.data.urgent,
          deductionPoints: this.data.integralNumber || null,
          couponReduce: res.data.couponReduce,
          canUserPoint: res.data.canUserPoint,
          orderItems: orderItems,
          actualTotal: res.data.actualTotal,
          total: res.data.total,
          totalCount: res.data.totalCount,
          userAddr: res.data.shopCartOrders[0].orderAddrDto,
          dealerReduce: res.data.dealerReduce,
          pointAmount: res.data.pointAmount,
          transfee: res.data.shopCartOrders[0].transfee,
          shopReduce: res.data.shopCartOrders[0].shopReduce,
          deliveryFee: res.data.deliveryFee,
          packingBoxFee: res.data.packingBoxFee,
        });
      },
    };
    http.request(params);
  },

  // 获取订单备注
  getRemarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  /**
   * 去地址页面
   */
  GoSettlement() {
    let orderList = this.data.userAddr
    if (!this.data.userAddr && this.data.type == 0) {
      wx.showToast({
        title: '请选择地址',
        icon: "none"
      })
      return false
    } else {
      if (this.data.showUserAddr) {
        wx.showModal({
          // cancelColor: '#FB6600',
          confirmColor: '#FB6600',
          title: '您的配送地址信息为: ',
          cancelText: '修改',
          content: `${orderList.city}${orderList.area}${orderList.addr}-${orderList.receiver}${orderList.mobile}`,
          success: (res) => {
            if (res.confirm) {
              if (this.data.payType == 1) {
                this.submitOrder()
              } else if (this.data.payType == 2) {
                this.GoPopup()
              }
            } else {
              wx.navigateTo({
                url: '/pages/address/address?order=0',
              })
            }

          }

        })
      } else {
        if (this.data.payType == 1) {
          this.submitOrder()
        } else if (this.data.payType == 2) {
          this.GoPopup()
        }
      }

    }

  },
  submitOrder: function (e) {
    wx.showLoading({
      mask: true
    });

    var params = {
      url: "/weixin/order/comesubmit",
      method: "POST",
      data: {
        orderShopParam: [{
          remarks: this.data.remark || '',
          shopId: 1
        }]
      },
      callBack: res => {
        wx.hideLoading();
        this.setData({
          orderIds: res.data
        })
        this.calWeixinPay();
      }
    };
    http.request(params);
  },
  // 获取支付方式
  getDiningType(e) {
    this.setData({
      payType: e.detail.value
    })
  },
  // 用户名
  onReceiverInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    });
  },
  /**
   * 唤起微信支付
   */
  calWeixinPay: function () {
    wx.showLoading({
      mask: true
    });
    const that = this
    var params = {
      url: "/weixin/order/pay",
      method: "POST",
      data: {
        payType: this.data.payType,
        orderIds: this.data.orderIds,
        userPassword: this.data.userPassword
      },
      callBack: function (res) {
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
                url: '/pages/pay-result/pay-result?sts=1&orderNumbers=' + that.data.orderIds + "&orderType=" + this.data.payType,
              })
            },
            fail: err => {
              wx.redirectTo({
                url: '/pages/pay-result/pay-result?sts=0&orderNumbers=' + that.data.orderIds + "&orderType=" + this.data.payType,
              })
            }
          })
        } else if (res.errorCode == 200 && this.data.payType == 2) {
          wx.redirectTo({
            url: '/pages/through/through?sts=1&orderNumbers=' + that.data.orderIds + "&orderType=" + this.data.payType,
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
              that.getUsercanAmount()
            }
          })
          return false
        }
      }
    };
    http.request(params);
  },
  // 请求用户详情
  getUsercanAmount() {
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
  toAddrListPage: function () {
    wx.navigateTo({
      url: '/pages/address/address?order=0',
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.selAddress == "yes") {
      this.setData({ //将携带的参数赋值
        userAddr: currPage.data.item
      });
    }
    this.getUserInfo()
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
// pages/shop/shop.js
const http = require("../../utils/http.js");
const app = getApp()
const util = require("../../utils/util.js");
// 右侧每一类的 bar 的高度（固定）
const RIGHT_BAR_HEIGHT = 0;

// 右侧每个子类的高度（固定）
const RIGHT_ITEM_HEIGHT = 95;

// 左侧每个类的高度（固定）
const LEFT_ITEM_HEIGHT = 45
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左 => 右联动 右scroll-into-view 所需的id
    toView: null,
    // 右侧每类数据到顶部的距离（用来与 右 => 左 联动时监听右侧滚动到顶部的距离比较）
    HZL_eachRightItemToTop: [],
    HZL_leftToTop: 0,
    // 当前左侧选择的
    HZL_currentLeftSelect: null,
    timeIndex: 0,
    startDate: util.formatDate(new Date()),
    endDate: util.getTimeLastWeek(new Date(), 6),
    timeList: [{
      name: '早餐',
      label: 0
    }, {
      name: '午餐',
      label: 1
    }, {
      name: '晚餐',
      label: 2
    }],
    list: [],
    modelShow: false,
    model: false,
    current: 1,
    selIndex: 0,
    productList: [],
    shopCartItemDiscounts: [],
    finalMoney: 0,
    totalMoney: 0,
    subtractMoney: 0,
    count: 0,
    total: 0,
    appointmentTime: util.DataTime(new Date()),
    diningType: 1,
    productType: '',
    currentTime: util.formatDate(new Date()),
    detailFlag: true,
    itemDetail: [],
    combofood: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      //当前订单时间
      currentTime: util.formatDate(new Date(options.currentTime)),
      //预定的就餐时间
      serveDateTime: util.formatDate(new Date(options.currentTime)),
      serveDate: options.currentTime
    })
    if (!app.globalData.userInfo) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return false
    }
    this.setData({
      categoryType: 1,
    })
  },


  // 获取购物车数量
  getShoppCartNums() {
    let that = this
    var params = {
      url: "/weixin/shopCart/getShoppComboCartNums",
      method: "GET",
      data: {
        categoryType: that.data.categoryType
      },
      callBack: function (res) {
        that.setData({
          count: res.data.count,
          total: res.data.total,
          freeDeliveryFee: res.data.freeDeliveryFee ? Math.abs(res.data.freeDeliveryFee) : 0,
          deliveryFee: res.data.deliveryFee ? res.data.deliveryFee : 0
        })
      }
    };
    http.request(params);
  },

  // 查看详情
  showDetail(e) {
    this.setData({
      detailFlag: false,
      imgContent: e.currentTarget.dataset.src
    })
  },

  // 关闭详情
  closeDetail() {
    this.setData({
      detailFlag: true
    })
  },


  // 获取详情
  getProductByProductId() {
    wx.showLoading()
    const that = this
    var params = {
      url: "/weixin/product/pageProdBycategoryId",
      method: "GET",
      data: {
        categoryId: that.data.categoryId
      },
      callBack: res => {
        console.log(res);
        if (res.errorCode == 200) {
          that.setData({
            orderingTime: res.data.orderingTime,
            deliveryTime: res.data.deliveryTime,
            categoryList: res.data.categorys
          })
        }
      }
    };
    http.request(params);
  },


  // 隐藏价格明细
  isModel() {
    this.setData({
      modelShow: !this.data.modelShow
    })
    if (!this.data.modelShow) {
      this.getProductList()
    }
  },
  // 打开选择就餐方式弹窗
  GoPopup() {
    if (!this.data.model) {
      var shopCartItemDiscounts = this.data.shopCartItemDiscounts;
      var shopCartIds = [];
      shopCartItemDiscounts.forEach(shopCartItemDiscount => {
        shopCartItemDiscount.shopCartItems.forEach(shopCartItem => {
          if (shopCartItem.checked) {
            shopCartIds.push(shopCartItem.shoppCartId)
          }
        })
      })
      if (!shopCartIds.length) {
        wx.showToast({
          title: '请选择商品',
          icon: "none"
        })
        return
      }
    }
    this.setData({
      model: !this.data.model
    })
    if (!this.data.model) {
      this.getProductList()
    }
  },
  // 获取就餐方式
  getDiningType(e) {
    console.log(e.detail.value)
    this.setData({
      diningType: e.detail.value
    })
  },
  // 获取订单备注
  getRemarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  },

  submitOrder: function () {
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
      }
    };
    http.request(params);
  },

  // 加
  addNum(e) {
    if (!app.globalData.userInfo) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return false
    }
    let num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let cindex = e.currentTarget.dataset.cindex;
    let combofood = e.currentTarget.dataset.combofood
    this.addCar(1, id, num, index, cindex, this.data.serveDateTime, combofood)
  },

  // 减
  reduceNum(e) {
    if (!app.globalData.userInfo) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return false
    }
    console.log(e)
    let num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    let cindex = e.currentTarget.dataset.cindex;
    let id = e.currentTarget.dataset.id;
    let combofood = e.currentTarget.dataset.combofood
    // let appointmentTime = this.data.appointmentTime;
    if (num < 1) {
      return false
    }
    this.addCar(-1, id, num, index, cindex, this.data.serveDateTime, combofood)
  },

  // 加入购物车
  addCar(count, productId, num, index, cindex, appointmentTime, combofood) {
    const that = this
    wx.showLoading({
      mask: true
    });
    var params = {
      url: "/weixin/shopCart/addCart",
      method: "POST",
      data: {
        orderTime: this.data.serveDateTime,
        count: count,
        productId: productId,
        shopCartId: '',
        comboFood: combofood,
        appointmentTime: this.data.serveDateTime,
        productType: that.data.productType //食品：早、中、
      },
      callBack: function (res) {
        if (res.errorCode == 200) {
          let selectProductNums = 'categoryList[' + index + ']products[' + cindex + '].selectProductNums';
          that.setData({
            [selectProductNums]: num + count
          })
          that.getShoppCartNums()
          that.getCars()
        } else {
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: false
          })
        }
      }
    };
    http.request(params);
  },
  // 获取日期
  getDate(e) {
    if (e.detail.value == this.data.serveDateTime) {
      this.judgeDate()
    } else {
      this.setData({
        timeList: [{
          name: '早餐',
          label: 0
        }, {
          name: '午餐',
          label: 1
        }, {
          name: '晚餐',
          label: 2
        }],
        productType: 0
      })
    }
    this.setData({
      serveDateTime: e.detail.value,
      HZL_leftToTop: 0,
      timeIndex: 0
    })
    this.getProductList()
  },
  // 获取早中晚
  getTime(e) {
    this.setData({
      timeIndex: e.detail.value,
      HZL_leftToTop: 0,
      productType: this.data.timeList[e.detail.value].label
    })
    this.getProductList()
  },

  // 跳转到提交订单
  GoOrder: function () {
    var shopCartItemDiscounts = this.data.shopCartItemDiscounts;
    var shopCartIds = [];
    shopCartItemDiscounts.forEach(shopCartItemDiscount => {
      shopCartItemDiscount.shopCartItems.forEach(shopCartItem => {
        if (shopCartItem.checked) {
          shopCartIds.push(shopCartItem.shoppCartId)
        }
      })
    })
    if (!shopCartIds.length) {
      wx.showToast({
        title: '请选择商品',
        icon: "none"
      })
      return
    }
    wx.setStorageSync("shopCartIds", JSON.stringify(shopCartIds));
    console.log(this.data.date);
    wx.navigateTo({
      url: '/pages/goods-order/goods-order?orderEntry=1&frompage=营养食堂&type=' + this.data.diningType + '&orderTime=' + this.data.date,
    })
  },

  /**
   * 分类点击事件
   */
  onMenuTab: function (e) {
    this.setData({
      toView: e.target.dataset.id,
      HZL_currentLeftSelect: e.target.dataset.id
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
    wx.showLoading();
    this.judgeDate()
    // 获取全部商品
    this.getProductList()
    this.getShoppCartNums();
    this.getCars();
  },

  // 判断当前日期早中晚餐
  judgeDate() {
    let date = util.getTimeSlot(new Date(this.data.serveDate));
    if (date == 1) {
      //设定为午餐
      this.setData({
        productType: 1,
        timeList: [{
          name: '午餐',
          label: 1
        }, {
          name: '晚餐',
          label: 2
        }]
      })
    }
    if (date == 2) {
      //设定为晚餐
      this.setData({
        productType: 2,
        timeList: [{
          name: '晚餐',
          label: 2
        }]
      })
    }
  },

  // 获取商品
  getProductList() {
    wx.showLoading()
    const that = this
    var params = {
      url: "/weixin/product/getProductList",
      method: "GET",
      data: {
        categoryType: that.data.categoryType, //类型：商品，食品
        productType: that.data.productType, //食品：早、中、晚
        orderTime: that.data.currentTime, //日期时间
      },
      callBack: res => {
        for (let i of res.data.categorys) {
          for (let j of i.products) {
            // j.selectProductNums = 0
          }
        }
        if (res.errorCode == 200) {
          console.log(res);
          res.data.categorys.forEach((item, index) => {
            item.toid = 'id' + index
          });
          that.setData({
            orderingTime: res.data.orderingTime,
            deliveryTime: res.data.deliveryTime,
            categoryList: res.data.categorys,
            HZL_currentLeftSelect: res.data.categorys.length > 0 ? res.data.categorys[0].toid : '',
            toView: res.data.categorys.length > 0 ? res.data.categorys[0].toid : '',
            HZL_eachRightItemToTop: that.HZL_getEachRightItemToTop(res.data.categorys)
          })
          // if(res.data.orderingTime == 1){
          //   wx.showModal({
          //     title: '提示',
          //     content: '当前已过了订餐时间',
          //     showCancel: false,
          //   })
          // }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }
    };
    http.request(params);
  },

  /**
   * 获取每个右侧的 bar 到顶部的距离，
   * 用来做后面的计算。
   */
  HZL_getEachRightItemToTop: function (categoryList) {
    var obj = {};
    var totop = 0;
    if (categoryList.length < 1) {
      return obj
    }
    // 右侧第一类肯定是到顶部的距离为 0
    obj[categoryList[0].toid] = totop
    // 循环来计算每个子类到顶部的高度
    for (let i = 1; i < (categoryList.length + 1); i++) {
      totop += (RIGHT_BAR_HEIGHT + categoryList[i - 1].products.length * RIGHT_ITEM_HEIGHT)
      // 这个的目的是 例如有两类，最后需要 0-1 1-2 2-3 的数据，所以需要一个不存在的 'last' 项，此项即为第一类加上第二类的高度。
      obj[categoryList[i] ? categoryList[i].toid : 'last'] = totop
    }
    return obj
  },

  /**
   * 监听右侧的滚动事件与 HZL_eachRightItemToTop 的循环作对比
   * 从而判断当前可视区域为第几类，从而渲染左侧的对应类
   */
  right: function (e) {
    for (let i = 0; i < this.data.categoryList.length; i++) {
      let left = this.data.HZL_eachRightItemToTop[this.data.categoryList[i].toid]
      let right = this.data.HZL_eachRightItemToTop[this.data.categoryList[i + 1] ? this.data.categoryList[i + 1].toid : 'last']
      if (e.detail.scrollTop < right && e.detail.scrollTop >= left) {
        this.setData({
          HZL_currentLeftSelect: this.data.categoryList[i].toid,
          HZL_leftToTop: LEFT_ITEM_HEIGHT * i
        })
      }
    }
  },
  // 获取购物车
  getCars() {
    const that = this
    //加载购物车
    var params = {
      url: "/weixin/shopCart/info",
      method: "POST",
      data: {
        categoryType: that.data.categoryType,
        currentTime: that.data.currentTime,
        comboFood: that.data.comboFood
      },
      callBack: res => {
        if (res.errorCode == 200 && res.data.length > 0) {
          // 默认全选
          var shopCartItemDiscounts = res.data[0].shopCartItemDiscounts;
          shopCartItemDiscounts.forEach(shopCartItemDiscount => {
            shopCartItemDiscount.shopCartItems.forEach(shopCartItem => {
              // console.log(shopCartItem)
              shopCartItem.checked = true;
            })
          })
          this.setData({
            shopCartItemDiscounts: shopCartItemDiscounts,
            // currentTime: res.data.currentTime,
            allChecked: true
          });
        } else {
          this.setData({
            shopCartItemDiscounts: [],
          });
        }
        // wx.hideLoading();
      }
    };
    http.request(params);
  },

  // 减购物车
  reduceCarNum(e) {
    let productId = e.currentTarget.dataset.proid;
    let shoppCartId = e.currentTarget.dataset.shoppcartid
    let productSkuId = e.currentTarget.dataset.proskuid;
    let appointmentTime = e.currentTarget.dataset.appointmenttime;
    let producttype = e.currentTarget.dataset.producttype;
    this.operationCar(-1, productId, productSkuId, shoppCartId, appointmentTime, producttype)
  },

  //加购物车
  addCarNum(e) {
    console.log(e);
    let shoppCartId = e.currentTarget.dataset.shoppcartid
    let productId = e.currentTarget.dataset.proid;
    let productSkuId = e.currentTarget.dataset.proskuid;
    let appointmentTime = e.currentTarget.dataset.appointmenttime;
    let producttype = e.currentTarget.dataset.producttype;
    this.operationCar(1, productId, productSkuId, shoppCartId, appointmentTime, producttype)
  },

  // 购物车操作
  operationCar(count, productId, productSkuId, shopCartId, appointmentTime, producttype) {
    wx.showLoading({
      mask: true
    });
    const that = this
    const data = {
      orderTime: this.data.serveDateTime, //日期时间
      count: count,
      productId: productId,
      shopCartId: shopCartId,
      productSkuId: productSkuId,
      appointmentTime: this.data.serveDateTime,
      productType: producttype //食品：早、中、晚
    }
    var params = {
      url: "/weixin/shopCart/addCart",
      method: "POST",
      data: data,
      callBack: function (res) {
        if (res.errorCode == 200) {
          that.getShoppCartNums()
          that.getCars()
        } else {
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: false
          })
        }
      }
    };
    http.request(params);
  },

  // 清空购物车
  emptyUserCart() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '是否清空购物车？',
      success: function (res) {
        if (res.confirm) {
          var params = {
            url: "/weixin/shopCart/emptyUserCart",
            method: "POST",
            data: {
              categoryType: that.data.categoryType
            },
            callBack: function (res) {
              if (res.errorCode == 200) {
                that.getShoppCartNums()
                that.getCars()
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.message,
                  showCancel: false
                })
              }
            }
          };
          http.request(params);
        } else if (res.cancel) {
          console.log('用户点击取消')
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
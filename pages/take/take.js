// pages/shop/shop.js
const http = require("../../utils/http.js");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    selIndex: 0,
    productList: [],
    shopCartItemDiscounts: [],
    finalMoney: 0,
    totalMoney: 0,
    subtractMoney: 0,
    count: 0,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShoppCartNums();
    this.getCars()
  },

  // 获取购物车数量
  getShoppCartNums() {
    let that = this
    var params = {
      url: "/weixin/shopCart/getShoppCartNums",
      method: "GET",
      callBack: function (res) {
        wx.setStorageSync('countShop', res.count);
        that.data.count = res.count
        that.setData({
          count: res.data.count,
          total: res.data.total
        })
      }
    };
    http.request(params);
  },


  // 加
  addNum(e) {
    if(!app.globalData.userInfo){
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return false
    }
    let num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let shopCartItemDiscounts = this.data.shopCartItemDiscounts;
    this.addCar(1, id, num, index, shopCartItemDiscounts)
    
  },

  // 减
  reduceNum(e) {
    if(!app.globalData.userInfo){
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return false
    }
    let num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let shopCartItemDiscounts = this.data.shopCartItemDiscounts;
    if (num < 1) {
      return false
    }
    this.addCar(-1, id, num, index, shopCartItemDiscounts)
  },

  // 加入购物车
  addCar(count, productId, num, index) {
    wx.showLoading({
      mask: true
    });
    const that = this
    var params = {
      url: "/weixin/shopCart/addCart",
      method: "POST",
      data: {
        count: count,
        productId: productId,
        shopCartId: "",
      },
      callBack: function (res) {
        if (res.errorCode == 200) {
          let selectProductNums = 'productList[' + index + '].selectProductNums';
          that.setData({
            [selectProductNums]: num + count
          })
          that.getShoppCartNums()
          that.getCars()
        }else{
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
  // /**
  //  * 计算购物车总额
  //  */
  // calTotalPrice: function (e) {
  //   var shopCartItemDiscounts = this.data.shopCartItemDiscounts;
  //   console.log(e)
  //   console.log(shopCartItemDiscounts)
  //   var shoppCartIds = [];
    
  //   for (var i = 0; i < shopCartItemDiscounts.length; i++) {
  //     console.log(111)
  //     var cItems = shopCartItemDiscounts[i].shopCartItems;
    
  //     for (var j = 0; j < cItems.length; j++) {
  //       if (cItems[j].checked) {
  //         shoppCartIds.push(cItems[j].basketId);
  //       }
  //     }
  //   }
  //   var ths = this;
  //   wx.showLoading();
  //   var params = {
  //     url: "/weixin/shopCart/getTotalPay",
  //     method: "POST",
  //     data: shoppCartIds,
  //     callBack: function (res) {
  //       console.log(res)
  //       ths.setData({
  //         finalMoney: res.finalMoney,
  //         totalMoney: res.totalMoney,
  //         subtractMoney: res.subtractMoney
  //       });
  //       wx.hideLoading();
  //     }
  //   };
  //   http.request(params);

  // },
  

  // 获取分类
  categoryInfo() {
    const that = this
    var params = {
      url: "/weixin/category/categoryInfo",
      method: "GET",
      data: {},
      callBack: function (res) {
        that.setData({
          categoryList: res.data
        })
        // 获取分类对应的商品
        that.pageProdBycategoryId();
      }
    };
    http.request(params);
  },

  // 获取商品
  pageProdBycategoryId() {
    const that = this
    var params = {
      url: "/weixin/product/pageProdBycategoryId",
      method: "GET",
      data: {
        categoryId: this.data.categoryList[this.data.selIndex].categoryId,
        current: this.data.current,
        zise: 20
      },
      callBack: function (res) {
        if (res.data.records.length > 0) {
          that.setData({
            productList: that.data.productList.concat(res.data.records)
          })
        }
      }
    };
    http.request(params);
  },
  // 跳转到提交订单
  GoOrder: function (){
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
    wx.navigateTo({
      url: '/pages/goods-order/goods-order?orderEntry=0',
    })
  },
  // 获取翻页
  getMore() {
    this.setData({
      current: this.data.current + 1
    })
    this.pageProdBycategoryId()
  },

  /**
   * 分类点击事件
   */
  onMenuTab: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      selIndex: index,
      productList: [],
      current: 1
    });
    this.pageProdBycategoryId();
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
    this.setData({
      productList: [],
      current: 1
    });

    // 获取分类
    this.categoryInfo()
    // this.getShoppCartNums()
  },


  // 获取购物车
  getCars(){
    //加载购物车
    var params = {
      url: "/weixin/shopCart/info",
      method: "POST",
      data: {

      },
      callBack: res => {
        if (res.data.length > 0) {
          // 默认全选
          var shopCartItemDiscounts = res.data[0].shopCartItemDiscounts;
          shopCartItemDiscounts.forEach(shopCartItemDiscount => {
            shopCartItemDiscount.shopCartItems.forEach(shopCartItem => {
              shopCartItem.checked = true;
            })
          })

          this.setData({
            shopCartItemDiscounts: shopCartItemDiscounts,
            allChecked: true
          });
        } else {
          this.setData({
            shopCartItemDiscounts: [],
          });
        }
        wx.hideLoading();
      }
    };
    http.request(params);
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
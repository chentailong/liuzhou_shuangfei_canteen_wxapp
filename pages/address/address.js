// pages/delivery-address/delivery-address.js

var http = require("../../utils/http.js");
// var config = require("../../utils/config.js");

Page({
  data: {
    defaultSize: 'mini',
    disabled: false,
    plain: true,
    loading: false,
    addressList: [],
    addAddress: '',
    order: -1,
    addr: '',
    areaId: '',
    mobile: '',
    receiver: '',
    postCode: '',
    userAddrId: '',
    commonAddr: 1
  },

  onLoad: function (option) {
    if (option.order) {
      this.setData({
        order: option.order
      });
    }
  },

  //新增收货地址
  onAddAddr: function (e) {
    wx.navigateTo({
      url: '/pages/newAddress/newAddress'
    })
  },

  // 获取用户地址
  onShow: function () {
    var ths = this;
    wx.showLoading();
    var params = {
      url: "/weixin/userAddr/getUserAddrList",
      method: "GET",
      data: {},
      callBack: function (res) {
        ths.setData({
          addressList: res.data.records
        });
        wx.hideLoading();
      }
    }
    http.request(params);
  },

  // 编辑地址 
  toEditAddress: function (e) {
    var useraddrid = e.currentTarget.dataset.useraddrid;
    wx.navigateTo({
      url: '/pages/newAddress/newAddress?useraddrid=' + useraddrid
    })
  },

  /**
   * 选择地址 跳转回提交订单页
   */
  selAddrToOrder: function (e) {
    if (this.data.order == 0) {
      var pages = getCurrentPages();//当前页面
      var prevPage = pages[pages.length - 2];//上一页面
      prevPage.setData({//直接给上移页面赋值
        item: e.currentTarget.dataset.item,
        selAddress: 'yes'
      });
      wx.navigateBack({//返回
        delta: 1
      })
    }
  },
  // 获取用户默认地址
  onDefaultAddr(e) {
    var useraddrid = e.currentTarget.dataset.useraddrid
    wx.showLoading();
    var params = {
      url: "/weixin/userAddr/updateUserAddr?userAddrId=" + useraddrid,
      method: "POST",
      data: {
        userAddrId: useraddrid,
        commonAddr: 1
      },
      callBack: function (res) {
        wx.hideLoading();
      }
    }
    http.request(params);
  },

  //返回上级菜单
  handleClickBtn() {
    wx.navigateBack({
      delta: 1,
    })
  }
})
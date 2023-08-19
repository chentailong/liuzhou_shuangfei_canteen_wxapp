// pages/editAddress/editAddress.js
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
var index = [0, 0, 0];

var t = 0;
var show = false;
var moveY = 200;
Page({
  data: {
    floor: false,
    value: [0, 0, 0],
    province: "",
    city: "",
    area: "",
    provinceId: 0,
    cityId: 0,
    areaId: 0,
    commonAddr: 0,
    receiver: "",
    mobile: "",
    postCode: '',
    addr: "",
    userAddrId: 0,
    floorName: '',
    departmentName: '',
    isChecked: false
  },

  handleRadioChange() {
    this.setData({
      isChecked: !this.data.isChecked
    });
  },

  //获取省市区
  region_change(e) {
    this.setData({
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2],
      provinceId: e.detail.code[0],
      cityId: e.detail.code[1],
      areaId: e.detail.code[2]
    });
  },

  onLoad: function (options) {
    if (options.useraddrid) {
      this.setData({
        userAddrId: options.useraddrid,
        province: options.province,
        city: options.city,
        area: options.area
      })
      wx.showLoading()
      var params = {
        url: "/weixin/userAddr/getUserAddr?userAddrId=" + options.useraddrid,
        method: "GET",
        callBack: res => {
          console.log(res);
          this.setData({
            mobile: res.data.mobile,
            receiver: res.data.receiver,
            province: res.data.province,
            city: res.data.city,
            area: res.data.area,
            addr: res.data.addr
          })
          wx.hideLoading();
        }
      }
      http.request(params)
    }
    // this.getFloor()
  },
  // 获取地址
  getFloor() {
    let that = this
    var params = {
      url: "/weixin/floor/floor",
      method: "GET",
      callBack: function (res) {
        that.setData({
          floorList: res.data,
          floorItems: res.data[0].floorItems,
          bedInfos: res.data[0].floorItems[0].bedInfos,
          floorName: res.data[0] ? res.data[0].floorName : '楼栋',
          departmentName: res.data[0].floorItems[0] ? res.data[0].floorItems[0].department : '科室',
        })
      }
    };
    http.request(params);
  },

  //删除配送地址
  onDeleteAddr: function (e) {
    var ths = this;
    wx.showModal({
      title: '',
      content: '确定要删除此收货地址吗？',
      confirmColor: "#eb2444",
      success(res) {
        if (res.confirm) {
          var userAddrId = ths.data.userAddrId;
          wx.showLoading();
          var params = {
            url: "/weixin/userAddr/deleteUserAddr?userAddrId=" + userAddrId,
            method: "DELETE",
            data: {},
            callBack: function (res) {
              wx.hideLoading();
              wx.navigateBack({
                delta: 1
              })
            }
          }
          http.request(params);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },



  //隐藏弹窗浮层
  hiddenFloatView() {
    this.setData({
      floor: !this.data.floor
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  showFloatView() {
    this.setData({
      floor: !this.data.floor
    })
  },



  /**
   * 保存地址
   */
  onSaveAddr: function () {
    const ths = this;
    let receiver = ths.data.receiver;
    let mobile = ths.data.mobile;
    let addr = ths.data.addr;
    if (!receiver) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: "none"
      })
      return;
    }
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: "none"
      })
      return;
    }
    if (mobile.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: "none"
      })
      return;
    }
    if (!addr) {
      wx.showToast({
        title: '请输入详细地址',
        icon: "none"
      })
      return;
    }

    wx.showLoading();
    var url = "/weixin/userAddr/addUserAddr";
    var method = "POST";
    if (ths.data.userAddrId != 0) {
      url = "/weixin/userAddr/updateUserAddr";
      method = "POST";
    }
    //添加或修改地址
    var params = {
      url: url,
      method: method,
      data: {
        province: ths.data.province,  //省
        city: ths.data.city,     //市
        area: ths.data.area,   //区
        provinceId: ths.data.provinceId,
        cityId: ths.data.cityId,
        areaId: ths.data.areaId,
        receiver: ths.data.receiver,
        addr: ths.data.addr,
        areaId: ths.data.areaId,
        commonAddr: ths.data.commonAddr,
        mobile: ths.data.mobile,
        userAddrId: ths.data.userAddrId,
      },
      callBack: function (res) {
        wx.hideLoading();
        wx.navigateBack({
          delta: 1
        })
      }
    }
    http.request(params);
  },

  //姓名
  onReceiverInput: function (e) { 
    this.setData({
      receiver: e.detail.value
    });
  },

  // 手机号
  onMobileInput: function (e) { 
    this.setData({
      mobile: e.detail.value
    });
  },

  // 地址
  onAddrInput: function (e) { 
    this.setData({
      addr: e.detail.value
    });
  },

  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    })
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  //移动按钮点击事件
  translate: function (e) {
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    this.setData({
      show: true
    });
    // this.animation.translate(arr[0], arr[1]).step();
    this.animationEvents(this, moveY, show);
  },
})
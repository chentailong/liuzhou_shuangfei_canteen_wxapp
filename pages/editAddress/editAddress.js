// pages/editAddress/editAddress.js
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
var index = [0, 0, 0];

var t = 0;
var show = false;
var moveY = 200;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    floor: false,
    value: [0, 0, 0],
    provArray: [],
    cityArray: [],
    areaArray: [],
    province: "",
    city: "",
    area: "",
    provinceId: 0,
    commonAddr: 0,
    cityId: 0,
    areaId: 0,
    receiver: "",
    bedNum: '',
    mobile: "",
    postCode: '',
    addr: "",
    userAddrId: 0,
    floorName: '',
    departmentName: '',
    department: ''

  },


  onLoad: function (options) {
    if (options.useraddrid && options.departmentname && options.floorname) {
      this.setData({
        userAddrId: options.useraddrid,
        floorName: options.floorname,
        departmentName: options.departmentname
      })
      wx.showLoading()
      var params = {
        url: "/weixin/userAddr/getUserAddr?userAddrId=" + options.useraddrid + '&departmentName='+options.departmentname + '&floorName='+ options.floorname,
        method: "GET",
        callBack: res => {
          this.setData({
            mobile: res.data.mobile,
            receiver: res.data.receiver,
            departmentName: this.data.departmentName,
            floorName: this.data.floorName,
            bedNum: res.data.bedNum
          })
          wx.hideLoading();
        }
      }
      http.request(params)
    }
    this.getFloor()
  },
  // 获取地址
  getFloor() {
    let that = this
    var params = {
      url: "/weixin/floor/floor",
      method: "GET",
      callBack: function (res) {
        that.setData({
          // floorList: res.data,
          // floorItems: res.data[0].floorItems,
          // bedInfos: res.data[0].floorItems[0].bedInfos,
          // floorName: res.data[0]?res.data[0].floorName:'楼栋',
          // departmentName: res.data[0].floorItems[0]?res.data[0].floorItems[0].department:'科室',
          floorList: res.data,
          floorItems: res.data[0].floorItems,
          bedInfos: res.data[0].floorItems[0].bedInfos,
          // floorName: res.data[0]?res.data[0].floorName:'楼栋',
          // floorName: res.data[0].floorName || res.data[1].floorName,
//           departmentName: res.data[0].floorItems[0].departmentName || res.data[0].floorItems[1].departmentName,
          floorName: res.data[0] ? res.data[0].floorName : '楼栋',
          departmentName: res.data[0].floorItems[0] ? res.data[0].floorItems[0].departmentName : '科室',
          // bedNum: res.data[0].floorItems[0].bedInfos[0] ? res.data[0].floorItems[0].bedInfos[0].bed : '房号',
        })
      }
    };
    http.request(params);
  },



  //地址滑动选择
  bindChange: function (e) {
    // console.log(e)
    var ths = this;
    var val = e.detail.value
    let floorList = ths.data.floorList
    let floorItems, bedInfos;
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      //更新数据
      floorItems = floorList[val[0]].floorItems
      bedInfos = floorList[val[0]].floorItems[val[1]].bedInfos
    } else { //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        //更新数据
        bedInfos = floorList[val[0]].floorItems[val[1]].bedInfos
      }
    }
    index = val;
    // console.log(floorItems)
    // console.log(floorList)
    // console.log(floorList[val[0]].floorItems[val[1]].bedInfos[val[2]])
    this.setData({
      addrList: [val[0], val[1], val[2]],
      floorItems: floorItems,
      bedInfos: bedInfos,
      floorName: floorList[val[0]].floorName,
      departmentName: floorList[val[0]].floorItems[val[1]].department,
      // bedNum: floorList[val[0]].floorItems[val[1]].bedInfos[val[2]] ? floorList[val[0]].floorItems[val[1]].bedInfos[val[2]].bed : '',
    })
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

  // 修改地址接口
  // getQuery(){
  //   var that = this
  //   wx.showLoading();
  //   var params = {
  //     url: "/weixin/userAddr/updateUserAddr",
  //     method: "POST",
  //     data: {
  //       commonAddr: that.data.commonAddr,
  //       // userAddrId: that.data.userAddrId
  //     },
  //     callBack: function (res) {
  //       console.log(res)
  //       // ths.setData({
  //       //   addressList: res.data.records
  //       // });
  //       wx.hideLoading();
  //     }
  //   }
  //   http.request(params);
  // },

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

  bindRegionChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },


  /**
   * 保存地址
   */
  onSaveAddr: function () {
    var ths = this;
    var receiver = ths.data.receiver;
    var bednum = ths.data.bedNum;
    var mobile = ths.data.mobile;
    var addr = ths.data.addr;
    if (!bednum) {
      wx.showToast({
        title: '请输入床号',
        icon: "none"
      })
    }
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
    // if (!addr) {
    //   wx.showToast({
    //     title: '请输入详细地址',
    //     icon: "none"
    //   })
    //   return;
    // }

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
        receiver: ths.data.receiver,
        addr: ths.data.addr,
        areaId: ths.data.areaId,
        commonAddr: ths.data.commonAddr,
        mobile: ths.data.mobile,
        userAddrId: ths.data.userAddrId,
        floorName: ths.data.floorName,
        departmentName: ths.data.departmentName,
        bedNum: ths.data.bedNum
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

  onReceiverInput: function (e) {
    this.setData({
      receiver: e.detail.value
    });
  },

  onBedNumInput: function (e) {
    this.setData({
      bedNum: e.detail.value
    });
  },

  onMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  onAddrInput: function (e) {
    this.setData({
      addr: e.detail.value
    });
  },
})
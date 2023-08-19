const app = getApp()
var http = require("../../utils/http.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userSex:'',
    timeIndex: 0,
    items: [
      {value: 'userSex', name: '男'},
      {value: 'userSex', name: '女'}
    ],
    userName: '',  // 用户名
    officerNumber: '', // 工号
    identityCard: '',  // 身份证号
    userPassword: '', //用户支付密码
    checkStatus: '',
    userType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: app.globalData.userInfo.userId,
      userType: app.globalData.userInfo.userType
    })
  },

  radioChange(e) {
    // const items = this.data.items
    // for (let i = 0, len = items.length; i < len; ++i) {
    //   items[i].checked = items[i].value === e.detail.value
    // }
    this.setData({
      userSex: e.detail.value
    })
  },
  // 点击员工认证
  handleClickBtn(e){
    var ths = this;
    var userName = ths.data.userName;
    var userSex = ths.data.userSex;
    var officerNumber = ths.data.officerNumber;
    var identityCard = ths.data.identityCard;
    var userPassword = ths.data.userPassword;
    var reg = /(^1[0-9]{10}$)/;
    if (!userName) {
      wx.showToast({
        title: '请输入您的姓名',
        icon: "none"
      })
      return;
    }
    if (!userPassword) {
      wx.showToast({
        title: '请输入支付密码',
        icon: "none"
      })
      return;
    }
    if(!userSex){
      wx.showToast({
        title: '请输入您的性别',
        icon: 'none'
      })
    }
    if(!officerNumber){
      wx.showToast({
        title: '请输入您的工号',
        icon: 'none'
      })
    }
    if(!identityCard){
      wx.showToast({
        title: '请输入您的手机号码',
        icon: 'none'
      })
    }

    if (reg.test(ths.data.identityCard) === false) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return false
    }
  
    var url = "/weixin/userInfo/verifyUserInfo";
    var method = "POST";
    wx.showLoading();
    //员工地址
    var params = {
      url: url,
      method: method,
      data: {
        checkStatus: app.globalData.userInfo.checkStatus,
        userName: ths.data.userName,
        userSex: ths.data.userSex,
        identityCard: ths.data.identityCard,
        officerNumber: ths.data.officerNumber,
        userPassword: ths.data.userPassword,
        userId: app.globalData.userInfo.userId,
        userType: app.globalData.userInfo.userType
      },
      callBack: function (res) {
        wx.hideLoading();
        if(res.errorCode == 200){
          wx.showToast({
            title: '提交成功！',
            icon: "none"
          })
          wx.navigateBack({
            delta: 1,
          })  
        }else if(res.errorCode == 822){
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
        } else if(res.errorCode == 823) {
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
        }
      }
    }
    http.request(params);
  },
  // 用户名
  onReceiverInput: function (e) {
    this.setData({
      userName: e.detail.value
    });
  },
  // 身份证号
  showIdentityCard: function (e) {
    this.setData({
      identityCard: e.detail.value
    });
  },
  // 支付密码
  showUserPassword: function (e) {
    this.setData({
      userPassword: e.detail.value
    });
  },
  // 工号
  showFloatView(e) {
    this.setData({
      officerNumber: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getTime(e){
    this.setData({
      timeIndex: e.detail.value,
      productList: []
    })
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

  }
})
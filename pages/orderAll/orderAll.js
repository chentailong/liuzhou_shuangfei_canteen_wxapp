// pages/home/home.js
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
const util = require("../../utils/util.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorColor: '#d1e5fb',
    indicatorActiveColor: '#333',
    indexImgs: [],
    userInfo: '',
    sycoType: 4,
    userNumber: '',
    topUrl: '/images/icon/index-top.png'

  },

   // 点击前往食堂
   GoCanteen() {
    wx.navigateTo({
      url: '/pages/order/order'
    })
  },

  // 前往超市
  GoLine() {
    wx.navigateTo({
      url: '/pages/supermarket/supermarket?currentTime=' + util.formatTime(new Date(this.data.currentTime))
    })
  },
  // 前往糕点
  GoPastry() {
    wx.navigateTo({
      url: '/pages/pastry/pastry?currentTime=' + util.formatTime(new Date(this.data.currentTime))
    })
  },

  //前往包厢
  GoBox() {
    wx.navigateTo({
      url: '/pages/box/box?currentTime=' + util.formatTime(new Date(this.data.currentTime))
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.getIndex()
  },
 
 
  getAllData() {
    this.getIndexImgs();
  },
  //加载轮播图
  getIndexImgs() {
    var params = {
      url: "/weixin/scrollable/getHomeScrollableEntity",
      method: "GET",
      data: {},
      callBack: (res) => {
        this.setData({
          indexImgs: res.data,
          currentTime: res.currentTime
        });
      }
    };
    http.request(params);
  },

   // 个人信息
   getIndex() {
    var params = {
      url: "/weixin/systemConfig/getSystemConfig",
      method: "GET",
      data: {
        sycoType: this.data.sycoType
      },
      callBack: (res) => {
        this.setData({
          userInfo: res.data[0].sycoValue,
          userNumber: res.data[1].sycoValue
        });
      }
    };
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
    wx.showLoading({
      mask: true
    });
    this.getAllData()
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
    //模拟加载
    var ths = this;
    setTimeout(function() {
      ths.getAllData(); 
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 100);
  },

  // 电话
  GoIpone(){
    wx.makePhoneCall({
      phoneNumber: '0771-2359842'
    })
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
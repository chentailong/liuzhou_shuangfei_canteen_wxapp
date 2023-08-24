// coupon.js
var http = require("../../utils/http.js");
var config = require("../../utils/config.js");
const util = require("../../utils/util.js");
const app = getApp()
Page({
  data: {
    indicatorColor: '#d1e5fb',
    indicatorActiveColor: '#333',
    indexImgs: [],
    userInfo: '',
    sycoType: 4,
    userNumber: '',
    companyIntroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBh_EU1csL5LFcVgJ6gXUK9eqRuVWXXi9QKQ&usqp=CAU',
  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function () {
    this.getIndex()
  },

  //点击轮播图跳转 
  handleBannerTap(event) {
    const url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  //点击查看公司详情
  viewCompanyIntro() {
    wx.navigateTo({
      url: '/pages/companyIntro/companyIntro'
    });
  },

  getAllData() {
    this.getIndexImgs();
  },

  //获取轮播图数据
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

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    wx.showLoading({
      mask: true
    });
    this.getAllData()
  },

  // 获取个人信息
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

  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    var ths = this;
    setTimeout(function () {
      ths.getAllData();
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 100);
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {

  },
  //监听分享
  onShareAppMessage: function () {

  }
});

const http = require("../../utils/http.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    NewList: '',	
    newId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetHelpContent()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取内容
  GetHelpContent(){
    wx.showLoading()
    var params = {
      url: '/weixin/newsInfo/getNewsInfoList',
      method: 'GET',
      data: {},
      callBack: res => {
        console.log(res);
        this.setData({
          NewList: res.data.records
        })
      }
    }
    http.request(params);
  },
  // 根据ID查询信息
  GoBrief(){
    wx.showLoading()
    const thas = this;
    var params = {
      url: '/weixin/newsInfo/getNewsInfoDetails',
      method: 'GET',
      data: {
        newId: thas.data.newId
      },
      callBack: res => {
        console.log(res)
      }
    }
    http.request(params);
    // wx.navigateTo({
    //   url: '/pages/brief/brief',
    // })
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
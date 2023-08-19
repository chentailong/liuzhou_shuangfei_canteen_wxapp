const app = getApp()
var http = require("../../utils/http.js");
Page({
  data: {
    options: ['男', '女'],
  },

  //获取个人信息
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  // 监听名称发生变化
  bindReplaceInput: function (e) {
    this.setData({
      'userInfo.userName': e.detail.value
    })
  },
  //监听日期变化
  bindDateChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      'userInfo.userBirthday': e.detail.value
    })
  },
  //监听性别变化
  handlePickerChange(event) {
    const index = event.detail.value;
    console.log(index);
    this.setData({
      'userInfo.userSex': this.data.options[index]
    });
  },

  //点击提交修改数据
  handleSubmit() {
    wx.showLoading();
    var params = {
      url: "/weixin/userInfo/updateUserInfo",
      method: "POST",
      data: {
        userName: app.globalData.userInfo.userName,
        userSex: app.globalData.userInfo.userSex,
        userId: app.globalData.userInfo.userId,
        userBirthday: app.globalData.userInfo.userBirthday
      },
      callBack: (res) => {
        wx.hideLoading();
        if (res.errorCode === 200) {
          wx.showToast({
            title: res.message || '修改成功', // 提示的内容
            icon: 'success', // 图标，可选值：'success', 'loading', 'none'
            duration: 2000, // 持续时间，单位为毫秒
            mask: true // 是否显示透明蒙层，防止触摸穿透
          })
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/my/my'
            })
          }, 2000)
        }
      }
    }
    http.request(params);
  }
})
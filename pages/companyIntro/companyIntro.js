const app = getApp()
var http = require("../../utils/http.js");
Page({
  data: {
    introImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBh_EU1csL5LFcVgJ6gXUK9eqRuVWXXi9QKQ&usqp=CAU',
    introHtml: '<p>会员注册协议</p>', // 后端传来的富文本内容
    phoneNumber: '19994646994'
  },


  onLoad: function (options) {
    this.getCompanyIntro();
  },

  getCompanyIntro() {
    var that = this;
    const params = {
    
    }
  }

})
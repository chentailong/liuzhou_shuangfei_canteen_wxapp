var http = require("utils/http.js");
App({
  onLaunch: function (options) {
    // wx.clearStorage()
    // return false
    http.getToken();
  },
  watch: function (method) {
    var obj = this.globalData
    Object.defineProperty(obj, 'userInfo', {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._name = value;
        method(value);
      },
      get: function () {
        return this._name
      }
    })
  },
  onShow(options){
    let that = this
    if(options.query.scene){
      let scene = decodeURIComponent(options.query.scene)
      console.log(scene);
      // let arr = scene.split('&');
      // let obj = {
      //   id: arr[1].split('=')[1],
      //   name: arr[0].split('=')[1]
      // }
      // let id = scene.split('=')[1];
      that.getFloorItemById(scene)
    }
  },

    // 根据ID获取门诊的名称及地址
    getFloorItemById(id) {
      const that = this
      setTimeout(function(){
        var params = {
          url: "/weixin/floor/getFloorItemById",
          method: "GET",
          data: {id},
          callBack: function (res) {
            if (res.errorCode == 200) {
              console.log(res)
              let tableObj = {
                floorName: res.data.floorInfo.floorName,
                department: res.data.department,
                floor:res.data.floor,
                sceneId:id
              }
              that.globalData.sales = tableObj
              console.log(tableObj)
              // wx.switchTab({
              //   url: '/pages/order/order',
              // })
            } else {
              wx.showModal({
                title: '提示',
                content: res.message,
                showCancel: false,
                success(res) {
                }
              })
            }
          }
        };
        http.request(params);
      },1000)
    },
  globalData: {
    // 定义全局请求队列
    requestQueue: [],
    // 是否正在进行登陆
    isLanding: true,
    openid: null,
    userInfo: null,
    sales: null,
    date: null
  }
})
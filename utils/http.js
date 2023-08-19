var config = require('config.js')

//统一的网络请求方法
function request(params, isGetTonken) {
  // console.log(wx.getStorageSync('token'))
  // 全局变量
  var globalData = getApp().globalData;
  // 如果正在进行登陆，就将非登陆请求放在队列中等待登陆完毕后进行调用
  if (!isGetTonken && globalData.isLanding) {
    globalData.requestQueue.push(params);
    return;
  }
  wx.request({
    url: config.domain + params.url, //接口请求地址
    data: params.data,
    header: {
      'content-type': params.method == "GET" || params.method == "PUT" ? 'application/x-www-form-urlencoded' : 'application/json;charset=utf-8',
      'token': params.login ? undefined : wx.getStorageSync('token')
    },
    method: params.method == undefined ? "POST" : params.method,
    dataType: 'json',
    responseType: params.responseType == undefined ? 'text' : params.responseType,
    success: function(res) {
      wx.hideLoading();
      if (res.statusCode == 200) {
        if(res.data.data&&res.data.data.token){
          // console.log(res.data.data.token)
          wx.setStorageSync('token', res.data.data.token); //把token存入缓存，请求接口数据时要用
        }
        //如果有定义了params.callBack，则调用 params.callBack(res.data)
        if (params.callBack) {
          params.callBack(res.data);
        }
        // console.log(res.data)

      } else if (res.statusCode == 500) {
        wx.showToast({
          title: "服务器出了点小差",
          icon: "none"
        });
      } else if (res.statusCode == 401) {
        // 添加到请求队列
        globalData.requestQueue.push(params);
        // 是否正在登陆
        if (!globalData.isLanding) {
          globalData.isLanding = true
          //重新获取token,再次请求接口
          getToken();
        }
      } else if (res.statusCode == 400) {
        wx.showToast({
          title: res.data,
          icon: "none"
        })

      } else {
        //如果有定义了params.errCallBack，则调用 params.errCallBack(res.data)
        if (params.errCallBack) {
          params.errCallBack(res);
        }
      }
      if (!globalData.isLanding) {
        wx.hideLoading();
      }
    },
    fail: function(err) {
      wx.hideLoading();
      wx.showToast({
        title: "服务器出了点小差",
        icon: "none"
      });
    }
  })
}

//通过code获取token,并保存到缓存
var getToken = function() {
  wx.showLoading()
  wx.login({
    success: res => {
      request({
        login: true,
        url: '/weixin/userInfo/registerOrnot',
        method: 'PUT',
        data: {
          code: res.code
        },
        callBack: result => {
          // console.log(result)
          var globalData = getApp().globalData;
          globalData.isLanding = false;
          if(result.errorCode == 200){
            globalData.userInfo = result.data
            // if(result.data.token){
            //   console.log(result.data.token)
            //   wx.setStorage('token', result.data.token); //把token存入缓存，请求接口数据时要用
            //   // console.log(result.data.token)
            // }
          }else{
            globalData.openid = result.data
          }
          
          while (globalData.requestQueue.length) {
            request(globalData.requestQueue.pop());
          }
          wx.hideLoading()
        }
      }, true)
    }
  })
}

exports.getToken = getToken;
exports.request = request;
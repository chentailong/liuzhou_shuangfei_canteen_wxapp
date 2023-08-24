const http = require("../../utils/http.js")
const app = getApp()
const util = require("../../utils/util.js")
Page({
    data: {
        array: [
            {
                name: '全部类型',
                value: '4'
            },
            {
                name: '超市',
                value: 0
            },
            {
                name: '食堂',
                value: 1
            },
            {
                name: '糕点',
                value: 2
            },
            {
                name: '包厢',
                value: 3
            }],
        index: 0,
        current: 1,
        couponList: []
    },

    receiveCoupon(event) {
        const index = event.currentTarget.dataset.index;
        const selectedCoupon = this.data.couponList[index];
        // 在这里可以实现领取优惠券的逻辑，比如发送请求给后端进行领取
        console.log(`领取了优惠券：${selectedCoupon.couponName}`);
    },

    onShow: function () {
        this.getCoupon()
    },
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },
    // 获取优惠券
    getCoupon() {
        const that = this
        var params = {
            url: "/coupon/getCouponList",
            method: "GET",
            data: {
                current: that.data.current,
                size: 20,
                couponName: '',
                couponStatus: 1
            },
            callBack: res => {
                console.log(res.data.records);
                if (res.errorCode === 200) {
                    this.setData({
                        couponList: res.data.records
                    })
                } else {
                    wx.showToast({
                        title: "暂无优惠券可领取",
                        icon: 'none',
                        duration: 1000
                    })
                }

            }
        };
        http.request(params)
    },

    // 加载更多 
    getMore() {
        if (this.data.pageFlag) {
            return false
        }
        this.setData({
            current: this.data.current + 1
        })
        this.getCoupon()
    },

})
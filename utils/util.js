const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const getTimeLastWeek = (dates, later) => {
    let dateObj = {};
    // let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay();
    dateObj.year = date.getFullYear();
    dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()+1);
    dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    // dateObj.week = show_day[day];
    // console.log([dateObj.year, dateObj.month, dateObj.day].map(formatNumber).join('-'))
    return [dateObj.year, dateObj.month, dateObj.day].map(formatNumber).join('-');
  }


// 拿到当前时间段
const DataTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + 'T' + [hour, minute, second].map(formatNumber).join(':')
}

// 判断当前早中晚
const getTimeSlot = data => {
  var time = parseInt(new Date().getHours()); //返回小时数 
  let type
　　if (10 <= time && time <= 12) {
  //  午餐
  　　type = 1
　　} else if (12 <= time) {
  // 晚餐
  　　type = 2
　　} else {
  　　type = 0
　　}
  return type
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getTimeLastWeek: getTimeLastWeek,
  getTimeSlot: getTimeSlot,
  DataTime: DataTime
}

export function isAndroid() {
  const ua = navigator.userAgent;
  return ua.match(/(Android);?[\s\/]+([\d.]+)?/);
}

export function isIos() {
  const ua = navigator.userAgent;
  return ua.match(/(iPhone\sOS)\s([\d_]+)/);
}

export function timestampToDate(timestamp) {
  let d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
  let date = (d.getFullYear()) + "-" +
    (d.getMonth() + 1) + "-" +
    (d.getDate()) + " " +
    (d.getHours()) + ":" +
    (d.getMinutes()) + ":" +
    (d.getSeconds());
  return date;
}

export function timestampToDateDay(timestamp) {
  let d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
  let date = (d.getFullYear()) + "-" +
    (d.getMonth() + 1) + "-" +
    (d.getDate());
  return date;
}

// var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
// var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
//	var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);

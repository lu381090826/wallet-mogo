/**
 * http请求模块
 */
import axios from 'axios'
import {openWebview} from "./webview";
import cons from "./constants/Cons";
import {gotoLogin} from "./globalTools";

export async function request(url, data = {}, baseURL = null) {
  const conf = {
    //请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
    url: url,
    // 请求方法同上
    method: 'post', // default
    // 基础url前缀
    baseURL: baseURL === null ? process.env.requestBaseURL : baseURL,
    // 请求头信息
    headers: {
      'Content-Type': 'application/json',
      'uid': typeof (plus) === "undefined" ? "" : plus.storage.getItem('uid'),
      'token': typeof (plus) === "undefined" ? "" : plus.storage.getItem('token'),
    },
    data: data,
    //设置超时时间
    timeout: 15000,
    //返回数据类型
    responseType: 'json', // default
    validateStatus: function (status) {
      return status >= 200 && status < 550; // default
    },
  };
  if (typeof (plus) === "undefined") {
    return false;
  }

  return await axios(conf).then(res => {
    if (res.status === 401) {
      plus.nativeUI.confirm(
        '登录已失效，即将重新登录', () => {
          openWebview({
            url: cons.loginViewUrl,
            id: cons.loginViewId,
            title: "",
            noTitle: true,
          }, {}, {},);
          setTimeout(() => {
            let wvs = plus.webview.all();
            console.log(JSON.stringify(wvs))
            for (let i = 0; i < wvs.length; i++) {
              if (wvs[i].id === cons.loginViewId) {
                continue;
              }
              wvs[i].close();
            }
          }, 300);
        });
      return false;
    } else if (res.status !== 200) {
      plus.nativeUI.toast("出错了！(T＿T)");
      return false;
    }
    //处理服务器返回的错误
    let data = res.data;
    if (data.code !== 100) {
      plus.nativeUI.toast("【" + data.code + "】" + data.msg);
      return Promise.reject("【" + data.code + "】" + data.msg);
    }
    return data.data;
  });
}

/**
 * http请求模块
 */
import Vue from 'vue'
import axios from 'axios'
import {Toast, Dialog} from 'vant';
import {openWebview} from "./webview";
import cons from "./constants/Cons";

Vue.use(Toast);
Vue.use(Dialog);

export async function request(url, data = {}) {
  const conf = {
    //请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
    url: url,
    // 请求方法同上
    method: 'post', // default
    // 基础url前缀
    baseURL: process.env.requestBaseURL,
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
      Dialog.alert({
        title: '提示',
        message: '登录已失效，即将重新登录'
      }).then(() => {
        openWebview({
          url: cons.loginViewUrl,
          id: cons.loginViewId,
          title: "",
          noTitle: true,
        });
      });
      return false;
    } else if (res.status !== 200) {
      Toast("出错了！(T＿T)");
      return false;
    }
    //处理服务器返回的错误
    let data = res.data;
    if (data.code !== 100) {
      Toast("【" + data.code + "】" + data.msg);
      return Promise.reject("【" + data.code + "】" + data.msg);
    }
    return data.data;
  });
}

/**
 * http请求模块
 */
import Vue from 'vue'
import axios from 'axios'
import {
  openWebview,
  preLoad,
  showWebviewById
} from "../utils/webview";

import {Toast, Dialog} from 'vant';

Vue.use(Toast);
Vue.use(Dialog);

export async function request(url, data = {}) {
  const conf = {
    //请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
    url: url,
    // 请求方法同上
    method: 'post', // default
    // 基础url前缀
    // baseURL: 'http://120.79.191.116:9022',
    baseURL: 'http://192.168.8.125:9022',
    // baseURL: 'http://127.0.0.1:9022',
    // 请求头信息
    headers: {
      'Content-Type': 'application/json',
      'uid': typeof (plus) === "undefined" ? "" : plus.storage.getItem('uid'),
      'token': typeof (plus) === "undefined" ? "" : plus.storage.getItem('token'),
    },
    data: data,
    //设置超时时间
    timeout: 5000,
    //返回数据类型
    responseType: 'json', // default
    validateStatus: function (status) {
      return status >= 200 && status < 550; // default
    },
  };

  if (typeof (plus) === "undefined") {
    return false;
  }
  let w = plus.nativeUI.showWaiting();

  return await axios(conf).then(res => {

    if (res.status === 401) {
      openWebview(
        {url: "./wallet.login.html", id: "wallet.login", noTitle: true},
        {},
        {webviewLast: true});
      return Promise.reject('登录已失效，正在跳转登录...');
    } else if (res.status !== 200) {
      return Promise.reject("出错了！(T＿T)");
    }
    //处理服务器返回的错误
    let data = res.data;
    if (data.code !== 100) {
      Toast("【" + data.code + "】" + data.msg);
      return Promise.reject(data.code + data.msg);
    }
    return data.data;
  }).catch(error => {
    console.log(error);
    Toast(error);
  }).finally(
    function () {
      w.close();
      plus.nativeUI.closeWaiting();
    }
  );
}

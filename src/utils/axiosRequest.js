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

export async function axiosRequest(url, data = {}, method = 'post') {
  const conf = {
    //请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
    url: url,
    // 请求方法同上
    method: method, // default
    // 基础url前缀
    // baseURL: process.env.requestBaseURL,
    // 请求头信息
    headers: {
      'Content-Type': 'application/json',
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
    return res.data;
  });
}

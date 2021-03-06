import axios from 'axios'
import Vue from 'vue'
import {Toast} from 'vant';
import {isNotEmpty} from "../globalFunc";

Vue.use(Toast);
let url;
if (isNotEmpty(Vue.prototype.HOST)) {
  url = '/etherscan/api/'
} else {
  url = 'https://api.etherscan.io/api';
}
let etherscanHttpUtils = {
  apiKey: 'NG3SDFKAUSKT1JD3VRKWJSU7QC35T1T85W',
  url: 'https://api.etherscan.io/api',
  // url: 'http://api.etherscan.io/api',
  get: function (request, toast = true) {
    let url = this.url;
    if (toast) {
      plus.nativeUI.showWaiting();
    }

    request.apiKey = this.apiKey;

    return axios.get(url, {params: request}).then(function (res) {
      if (res.data.message === 'NOTOK') {
        Toast(res.data.result);
        return Promise.reject(res.data.result);
      }
      else {
        return res.data.result;
      }
    })
      .catch(error => {
        Toast(error);
        return Promise.reject(error);
      }).finally(() => {
        plus.nativeUI.closeWaiting();
        }
      );
  }

};
export default etherscanHttpUtils

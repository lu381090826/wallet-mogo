import axios from 'axios'
import Vue from 'vue'
import {Toast} from 'vant';
import {isNotEmpty} from "../globalFunc";

Vue.use(Toast);
let url;
if (isNotEmpty(Vue.prototype.HOST)) {
  url = '/ethplorer'
} else {
  url = 'http://api.ethplorer.io/';
}
let ethplorerUtils = {
  apiKey: 'freekey',
  url: url,
  get: function (api, request = {}, toast = true) {
    let url = this.url + api;
    if (toast) {
      Toast.loading('加载中...');
    }
    console.log(this.apiKey);
    console.log(JSON.stringify(request));
    request.apiKey = this.apiKey;

    console.log(JSON.stringify(request));
    return axios.get(url, {params: request}).then(function (res) {

      return res.data;
    })
      .catch(error => {
        Toast(error);
        return Promise.reject(error);
      }).finally(() => {
          Toast.clear();
        }
      );
  }

};
export default ethplorerUtils

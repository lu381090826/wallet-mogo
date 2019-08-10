import axios from 'axios'
import Vue from 'vue'
import {Toast} from 'vant';
import {isNotEmpty} from "../globalFunc";
//https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API
Vue.use(Toast);
let url;
if (isNotEmpty(Vue.prototype.HOST)) {
  url = '/ethplorer'
} else {
  url = 'http://api.ethplorer.io/';
}
let ethplorerUtils = {
  apiKey: 'ufega69104crcM90',
  url: url,
  async get(api, request = {}, toast = true) {
    let url = this.url + api;
    if (toast) {
      Toast.loading('加载中...');
    }

    request.apiKey = this.apiKey;

    return await axios.get(url, {params: request}).then(function (res) {

      return res.data;
    })
      .catch(error => {
        Toast(error);
        return Promise.reject(error);
      }).finally(() => {
          Toast.clear();
        }
      );
  },

// token:     show only specified token address operations
// type:      show operations of specified type only
// limit:     maximum number of operations [1 - 10, default = 10]
// timestamp: starting offset for operations [optional, unix timestamp]
  async getAddressHistory(walletAddress, request = {}) {
    return await this.get('/getAddressHistory/' + walletAddress, request).then(res => {
      return res;
    });
  },
  async getTokenInfo(tokenAddress) {
    return await this.get('/getTokenInfo/' + tokenAddress).then(res => {
      return res;
    });
  }

};
export default ethplorerUtils

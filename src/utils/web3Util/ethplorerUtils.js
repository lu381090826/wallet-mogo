import axios from 'axios'
import Vue from 'vue'
import {isNotEmpty} from "../globalFunc";
import MathUtil from "../MathUtil";
//https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API
let url;
if (isNotEmpty(Vue.prototype.HOST)) {
  url = '/ethplorer'
} else {
  url = 'http://api.ethplorer.io';
}
let ethplorerUtils = {
  apiKey: 'ufega69104crcM90',
  url: url,
  async get(api, request = {}, toast = false) {
    let url = this.url + api;
    if (toast) {
      plus.nativeUI.showWaiting();
    }

    request.apiKey = this.apiKey;

    return await axios.get(url, {params: request}).then(function (res) {

      return res.data;
    })
                      .catch(error => {
                        plus.nativeUI.toast(error);
                        return Promise.reject(error);
                      }).finally(() => {
          plus.nativeUI.closeWaiting();
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
  },
  async getAddressInfo(walletAddress, token = "") {
    let param = {};
    if (token) {
      param = {token: token}
    }
    return await this.get('/getAddressInfo/' + walletAddress, param).then(addInfo => {
      if (addInfo.tokens) {
        let obj = addInfo.tokens.find(v => v.tokenInfo.address === "0x95ff62d03d45e29b20e497d0fd526d8d2d387804");
        addInfo.tgBalance = MathUtil.numberDiv(
          obj.balance,
          Math.pow(10, obj.tokenInfo.decimals),
          obj.tokenInfo.decimals);
      } else {
        addInfo.tgBalance = 0;
      }


      return addInfo;
    });
  }

};
export default ethplorerUtils

/**
 * http请求模块
 */
import Vue from 'vue'
// import {openWebview} from "./webview";
import {isEmpty, isNotEmpty} from "../globalFunc";
import {axiosRequest} from "../axiosRequest";
import {request} from "../request";
import MathUtil from "../MathUtil";
import TGCApiUrl from "../constants/TGCApiUrl";

let url = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';
//测试环境
if (isNotEmpty(Vue.prototype.HOST)) {
  url = '/coinmarketcap/v1/ticker/ethereum/';
}
let RateUtil =
  {
    async ethToUSD(eth) {
      return await axiosRequest(url, {}, 'get').then(ethRate => {
        return MathUtil.accMul(eth, ethRate[0].price_usd);
      });
    },
    async ethToCNY(eth, dollarRate = null) {
      return await axiosRequest(url, {}, 'get').then(ethRate => {
        let ethToUsd = MathUtil.accMul(eth, ethRate[0].price_usd);
        if (isEmpty(dollarRate)) {
          return request(TGCApiUrl.buyTgDollarRate).then(res => {
            return MathUtil.accMul(ethToUsd, res).toFixed(2);
          });
        } else {
          return MathUtil.accMul(ethToUsd, dollarRate).toFixed(2);
        }
      });
    }
  };
export default RateUtil;


import axios from 'axios'
import Vue from 'vue'
import echarts from 'echarts';
import {isEmptyObject, isNotEmpty} from "../globalFunc";
import {timestampToDateDay} from "../tools";


/*
*
* 交易所接口
*
* */
let url;
if (isNotEmpty(Vue.prototype.HOST)) {
  url = '/coinyee'
} else {
  url = 'https://www.coinyee.pro';
}
let coinyeeUtils = {
  url: url,
  async get(api, request = {}, toast = true) {
    let url = this.url + api;
    if (toast) {
      plus.nativeUI.showWaiting();
    }

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
  calculateMA(dayCount, values) {
    let result = [];
    for (let i = 0, len = values.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += values[i - j][1];
      }
      result.push(sum / dayCount);
    }
    return result;
  },
  async tickers() {
    return await this.get("/server/tickers").then(res => {
      return res.data.ticker_list;
    })
  },
  async kline(data = {}) {

    if (isEmptyObject(data)) {
      data = {
        symbol: 'ETHCNY',
        range: 86400000,
        limit: 1000,
        prevTradeTime: 1566442961761
      }
    }

    return await this.get('/kline/proxy.php', data).then(res => {
      let lines = res.data.lines;
      let date = [];
      let data = [];

      for (let i = 0; i < lines.length; i++) {
        lines[i][0] = timestampToDateDay(lines[i][0] / 1000);
        date.push(lines[i].splice(0, 1)[0]);
        data.push(lines[i][3])
      }

      let option = {
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
          },
          yAxis: {
            type: 'value',
            show: false,
            boundaryGap: [0, '100%']
          },
          dataZoom: [
            {
              type: 'inside',
              start: 90,
              end: 100
            },
            {
              start: 0,
              end: 10,
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '60%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }],
          series: [
            {
              name: '当日均价(¥)',
              type: 'line',
              smooth: true,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                color: '#2681f9'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#ccf3ff'
                }, {
                  offset: 1,
                  color: '#ffffff'
                }])
              },
              data: data
            }
          ]
        }
      ;

      return {
        option: option
      };
    })
  }

};
export default coinyeeUtils












import axios from 'axios'
import Vue from 'vue'
import {Toast} from 'vant';
import {isNotEmpty} from "../globalFunc";
import {timestampToDate, timestampToDateDay} from "../tools";

/*
*
* 交易所接口
*
* */

Vue.use(Toast);
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
      Toast.loading('加载中...');
    }

    // request.apiKey = this.apiKey;

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
  calculateMA(dayCount, values) {
    var result = [];
    for (var i = 0, len = values.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += values[i - j][1];
      }
      result.push(sum / dayCount);
    }
    return result;
  },
  async kline(data = {}) {
    return await this.get('/kline/proxy.php', data).then(res => {
      let lines = res.data.lines;
      let categoryData = [];
      let values = [];

      for (let i = 0; i < lines.length; i++) {

        lines[i][0] = timestampToDateDay(lines[i][0] / 1000);

        categoryData.push(lines[i].splice(0, 1)[0]);

        values.push(lines[i])

      }

      let upColor = '#ec0000';
      let upBorderColor = '#8A0000';
      let downColor = '#00da3c';
      let downBorderColor = '#008F28';

      let option = {
        title: {
          text: 'ETH行情',
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['日K', 'MA5']
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: {onZero: false},
          splitLine: {show: false},
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            y: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: '日K',
            type: 'candlestick',
            data: values,
            itemStyle: {
              normal: {
                color: upColor,
                color0: downColor,
                borderColor: upBorderColor,
                borderColor0: downBorderColor
              }
            },
            markPoint: {
              label: {
                normal: {
                  formatter: function (param) {
                    return param != null ? Math.round(param.value) : '';
                  }
                }
              },
              data: [
                {
                  name: 'XX标点',
                  coord: ['2013/5/31', 2300],
                  value: 2300,
                  itemStyle: {
                    normal: {color: 'rgb(41,60,85)'}
                  }
                },
                {
                  name: 'highest value',
                  type: 'max',
                  valueDim: 'highest'
                },
                {
                  name: 'lowest value',
                  type: 'min',
                  valueDim: 'lowest'
                },
                {
                  name: 'average value on close',
                  type: 'average',
                  valueDim: 'close'
                }
              ],
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '');
                }
              }
            },
            markLine: {
              symbol: ['none', 'none'],
              data: [
                [
                  {
                    name: 'from lowest to highest',
                    type: 'min',
                    valueDim: 'lowest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                      normal: {show: false},
                      emphasis: {show: false}
                    }
                  },
                  {
                    type: 'max',
                    valueDim: 'highest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                      normal: {show: false},
                      emphasis: {show: false}
                    }
                  }
                ],
                {
                  name: 'min line on close',
                  type: 'min',
                  valueDim: 'close'
                },
                {
                  name: 'max line on close',
                  type: 'max',
                  valueDim: 'close'
                }
              ]
            }
          },
          {
            name: 'MA5',
            type: 'line',
            data: this.calculateMA(5, values),
            smooth: true,
            lineStyle: {
              normal: {opacity: 0.5}
            }
          },
        ]
      };

      return {
        categoryData: categoryData,
        values: values,
        option: option
      };
    })
  }

};
export default coinyeeUtils












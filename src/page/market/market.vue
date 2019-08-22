<template>
  <div style="color: #616161;">
    <div style="padding: 5%">
      <van-row type="flex" justify="left">
        <van-col span="12">
          <div>
            <span style="font-size: 20px;">ETH</span>
            <span style="font-size: 18px;color: lightgrey">/CNY</span>
          </div>
        </van-col>
        <van-col span="6">
          <div>
            <div style="padding-top: 5%;font-size: 17px;">
              {{formatNum(ethPrice.last)}}
            </div>
          </div>
        </van-col>
        <van-col span="6">
          <div
            style="width: 80px;height: 30px;background-color: red;border-radius: 5px;color: white;text-align: center;">
            <div style="padding-top: 5%;font-size: 17px;">{{percent(ethPrice.percent)}}</div>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="blank-space"></div>

    <div style="width: 100%">
      <v-chart :options="option" ref="chart"
               :height="'300px'"
      />
    </div>
    <div class="blank-space"></div>
    <div style="padding: 3%;color: #616161;">最新行情</div>

    <van-tabs v-model="active" color="#3a81d1">
      <van-tab title="CNY">
        <div style="padding: 3%">
          <price :ticker_list="ticker_list" unit="CNY"/>
        </div>
      </van-tab>
      <van-tab title="USDT">
        <price :ticker_list="ticker_list" unit="USDT"/>
      </van-tab>
      <van-tab title="BTC">
        <price :ticker_list="ticker_list" unit="BTC"/>
      </van-tab>
    </van-tabs>


    <div class="blank-space"></div>
    <div style="margin-top: 10%">

    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueECharts from '../../components/ECharts'
  import coinyeeUtils from "../../utils/web3Util/coinyeeUtils";
  import {Col, Row, Tab, Tabs} from 'vant';
  import Price from "./Price";
  import MathUtil from "../../utils/MathUtil";

  Vue.use(Tab).use(Tabs);
  Vue.use(Row).use(Col);


  export default {
    components: {
      Price,
      'v-chart': VueECharts
    },
    data() {
      return {
        option: null,
        ticker_list: [],
        ethPrice: {
          percent: "-"
        },
        active: 0
      };
    },
    mounted() {
      let _t = this;

      _t.getLastPrice();

      coinyeeUtils.kline().then(res => {
        _t.option = res.option;
      })
    },
    methods: {
      getLastPrice() {
        let _t = this;
        coinyeeUtils.tickers().then(res => {
          _t.ticker_list = res;
          for (let i = 0; i < _t.ticker_list.length; i++) {
            if (_t.ticker_list[i].coin === 'ETH'
              && _t.ticker_list[i].unit === 'CNY') {
              _t.ethPrice = _t.ticker_list[i];
              break;
            }
          }
        });
      },
      getBackground(percent) {
        let number = MathUtil.accMul(percent, 100);
        if (number < 0) {
          return 'green';
        } else if (number === 0) {
          return 'gray'
        } else {
          return 'red';
        }
      },
      percent(percent) {
        if (percent === '-') {
          return '-';
        }
        let number = MathUtil.accMul(percent, 100).toFixed(2);
        if (number > 0) {
          return "+" + number + '%';
        } else {
          return number + '%';
        }
      },
      formatNum(number) {
        return Number(number).toFixed(2);
      },
    }
  }
</script>

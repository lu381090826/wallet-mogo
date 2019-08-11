<template>
  <div>
    <div id="myChart" ref="myChart"></div>
    <div class="box" style="width: 98%">
      ETH最新价格：1eth 约等于 {{lastAmount}} ¥
    </div>

    <div>
      <van-button @click="reflash()">刷新</van-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import echarts from 'echarts'
  import coniyeeUtils from "../../utils/web3Util/coinyeeUtils";
  import RateUtil from "../../utils/web3Util/RateUtil";
  import {Button} from 'vant';

  Vue.use(Button);

  export default {
    created() {
      this.init();
    },
    data() {
      return {
        data0: null,
        categoryData: null,
        values: null,
        option: null,
        lastAmount: "-",
      }
    },
    methods: {
      init() {
        let _t = this;

        RateUtil.ethToCNY(1).then(res => {
          _t.lastAmount = res;
        });

        coniyeeUtils.kline({
          symbol: 'ETHCNY',
          range: 86400000,
          limit: 1000,
          prevTradeTime: 1565269160612
        }).then(res => {

          _t.categoryData = res.categoryData;
          _t.values = res.values;
          _t.option = res.option;

          setTimeout(() => {
            // 调用绘制图表的方法
            _t.draw();
          }, 200);
        });
      },
      reflash() {
        this.init();
      },
      draw() {
        let _t = this;
        // 实例化echarts对象
        let myChart = echarts.init(_t.$refs.myChart);

        // 绘制条形图
        if (_t.option && typeof _t.option === "object") {
          myChart.setOption(_t.option, true);
        }
      }
    }
  }
</script>

<style scoped>
  #myChart {
    width: 95%;
    height: 300px;
    margin: 20px auto;
    border: 1px solid #CCC
  }
</style>

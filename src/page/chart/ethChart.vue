<template>
  <div>
    <div id="myChart" ref="myChart"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {request} from "../../utils/request";
  import coniyeeUtils from "../../utils/web3Util/coinyeeUtils";

  export default {
    created() {
      let _t = this;
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
    data() {
      return {
        data0: null,
        categoryData: null,
        values: null,
        option: null
      }
    },
    methods: {
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

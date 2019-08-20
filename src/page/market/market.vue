<template>
  <div>
    <div class="box">
      <v-chart :options="option" ref="chart"
               :height="'300px'"
               :width="'100%'"
      />
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import VueECharts from '../../components/ECharts'
  import coinyeeUtils from "../../utils/web3Util/coinyeeUtils";

  export default {
    components: {
      'v-chart': VueECharts
    },
    data() {
      return {
        option: null
      };
    },
    mounted() {
      _t = this;

      coinyeeUtils.kline().then(res => {
        _t.option = res.option;
      })


    }
  }</script>

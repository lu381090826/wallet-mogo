<style type="text/css">
  .price-st {
    padding: 5%;
    color: #616161;
  }
</style>
<template>
  <div class="price-st">
    <van-row type="flex" justify="left"
             v-for="(item , k ) in ticker_list"
             :key="k"
             v-if="item.unit===unit">
      <van-col span="10">
        <div>
          <span style="font-size: 20px">
            {{item.coin}}
          </span>
        </div>
      </van-col>
      <van-col span="8">
        {{formatNum(item.last)}} {{symbol()}}
      </van-col>
      <van-col span="6">
        <div style="width: 80px;height: 20px;text-align: center;color:white;border-radius: 5px"
             :style="{backgroundColor:getBackground(item.percent)}">
          {{percent(item.percent)}}
        </div>
      </van-col>
    </van-row>
  </div>
</template>
<script>
  import MathUtil from "../../utils/MathUtil";

  export default {
    name: 'price',
    props: {
      ticker_list: {},
      unit: String,
    },
    methods: {
      formatNum(number) {
        if (this.unit === 'BTC') {
          return Number(number).toFixed(5);
        } else {
          return Number(number).toFixed(2);
        }
      },
      getBackground(percent) {
        let number = Number(percent);
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
      symbol() {
        if (this.unit === 'CNY') {
          return '¥';
        }
        if (this.unit === 'USDT') {
          return '$';
        }
        if (this.unit === 'BTC') {
          return '฿';
        }
      }
    }
  }
</script>

<template>
  <div style="overflow-x: hidden">

    <div id="head-text">
      <span>步数换TG</span>
    </div>

    <div class="progress">
      <div class="progress-title" v-show="!hasChange">
        &nbsp;&nbsp;每天集满5000步可兑换一次<strong style="color: dodgerblue">1TG</strong>
      </div>
      <div class="progress-title" v-show="hasChange">
        &nbsp;&nbsp;今天已经兑换过了，明天再来吧。
      </div>
      <div style="text-align: center">
        <circle-progress :list='progressVal' :jindu='todayStep'></circle-progress>
      </div>

    </div>

    <div>
      <van-button class="changeButton" size="large" v-show="!canChange" disabled type="primary">
        立即捐步
      </van-button>
      <van-button class="changeButton" size="large" v-show="canChange" type="primary" @click="changeStep">
        立即捐步
      </van-button>
    </div>

  </div>
</template>
<script>
  import Vue from "vue";
  import {Toast, Button} from 'vant';
  import {request} from "@/utils/request";
  import circleProgress from '@/components/Circle'

  Vue.use(Button);
  export default {
    name: 'step',
    data() {
      return {
        todayStep: Number(localStorage.getItem("todayStep")),
        totalStep: localStorage.getItem("totalStep"),
        hasChange: localStorage.getItem("hasChange"),
      }
    },
    components: {
      'circle-progress': circleProgress,
    },
    computed: {
      canChange() {
        return this.progressVal >= 100;
      },
      progressVal() {
        let val = this.todayStep / 5000 * 100;
        if (val >= 100) {
          val = 100;
        }
        return val;
      }

    },
    methods: {
      changeStep() {
        let _this = this;
        request("/donation/step/stepToTG", {receiveAddress: plus.storage.getItem("walletAddress")}).then(function (res) {
          Toast('兑换成功，请查收');
          localStorage.setItem("todayStep", 0);
          localStorage.setItem("hasChange", 1);
          _this.hasChange = 1;
          _this.canChange = false;
        })
      },
    },
    mounted: function () {
      //定时更新步数
      let _this = this;
      // this.$nextTick(function () {
      //   setInterval(_this.getStepNum, 500);
      // })
    },
  }
</script>
<style scoped>
  .rate {
    margin-top: 10%;
    margin-bottom: 10%;
  }

  .rate >>> svg {
    /*padding-right: 20px;*/
    /*padding-bottom: 20px;*/
  }

  #head-text {
    width: 100%;
    border: #f1f1f1 1px solid;
    background-color: #f1f1f1;
    color: #606060;
    text-align: left;
    padding: 8px;
    margin-left: -8px;
  }

  .progress {
    margin-top: 10%;
    margin-bottom: 10%;
    font-size: 16px;
  }

  .progress-title {
    margin-top: 8%;
    color: #414141;
    margin-bottom: 8%;
  }

  .changeButton {
    background-color: orange;
    border-color: #ff9209;
    width: 96%;
    margin-left: 2%;
  }
</style>

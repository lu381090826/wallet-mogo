<template>
  <div class="body">
    <div class="box">
      <div class="banner" :style="{backgroundImage:'url(' + backgroundImg + ')'}">
        <div class="banner-title">捐助困境中的病人</div>
        <div class="banner-button">直接捐赠</div>
      </div>

      <div class="circle_contain">
        <circle-progress :list='progressVal' :jindu='todayStep' :size="150"></circle-progress>
      </div>

      <div>
        <van-button round class="changeButton" size="normal" v-show="!canChange" disabled type="primary">
          立即捐步
        </van-button>
        <van-button round class="changeButton" size="normal" v-show="canChange" type="primary" @click="changeStep">
          立即捐步
        </van-button>
      </div>

      <div class="progress-title" v-show="!hasChange">
        &nbsp;&nbsp;每天集满5000步可兑换一次<strong style="color: dodgerblue">1TG</strong>
      </div>
      <div class="progress-title" v-show="hasChange">
        &nbsp;&nbsp;今天已经兑换过了，明天再来吧。
      </div>
    </div>

    <div class="box">
      <van-row type="flex">
        <van-col span="6">
          <img src="@/assets/gongyixianxue.png" width="60">
        </van-col>
        <van-col span="12">
          <div style="text-align: left;margin-top: 3%">
            <div style="font-weight: bold;">查看<span style="color: #33ccef">我的公益</span></div>
            <div><span style="color:#9c9c9c;">每个公益行为都很珍贵</span></div>
          </div>
        </van-col>
        <van-col span="6">
          <div style="margin-top: 15%">
            <van-button size="small" round class="chakanwodegongyi">立即查看</van-button>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="step-footer"></div>
  </div>
</template>
<script>
  import Vue from "vue";
  import {Toast, Button, Circle, Row, Col} from 'vant';
  import {request} from "@/utils/request";
  import {isToday} from "../../utils/globalTools";
  import circleProgress from '@/components/Circle'
  import "@/utils/css/CommonStyle.less";

  Vue.use(Button).use(Circle).use(Row).use(Col);
  export default {
    data() {
      return {
        todayStep: Number(localStorage.getItem("todayStep")),
        totalStep: localStorage.getItem("totalStep"),
        hasChange: localStorage.getItem("hasChange"),
        backgroundImg: require("@/assets/img/shuangshou.png"),
      }
    },
    created() {
      if (!isToday(localStorage.getItem("lastStepTime"))) {
        this.todayStep = 0;
        localStorage.setItem("todayStep", 0);
        let time = new Date().getTime();
        localStorage.setItem("lastStepTime", time);
      }
    },
    mounted() {
      let nw = plus.webview.currentWebview();
      nw.addEventListener('hide', function (e) {
        nw.close();
      }, false);
    },
    computed: {
      canChange() {
        return this.progressVal >= 100;
      },
      progressVal: {
        get() {
          let val = this.todayStep / 5000 * 100;
          if (val >= 100) {
            val = 100;
          }
          return val;
        },
        set() {

        }
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
    components: {
      'circle-progress': circleProgress,
    },
  }
</script>
<style scoped>

  .progress-title {
    margin-top: 5%;
    color: #797979;
    text-align: center;
    font-size: 13px;
  }

  .changeButton {
    background-color: orange;
    border-color: #ff9209;
    width: 50%;
    margin-top: 8%;
    font-size: 16px;
  }

  .circle_contain {
    margin: 0 auto;
    text-align: center;
    width: 150px;
    height: 150px;
    font-size: 20px;
    margin-top: 8%;
  }

  .banner {
    margin: 0 auto;
    height: 150px;
    width: 98%;
    /*border: 1px solid #dcdcdc;*/
    border-radius: 10px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    text-align: left;
  }

  .banner-title {
    text-align: left;
    padding: 4%;
    font-size: 20px;
    color: #363636;
    font-weight: bold;
  }

  .banner-button {
    margin-left: 3%;
    border: 1px solid #f2f2f2;
    width: 18%;
    font-size: 11px;
    background: white;
    border-radius: 20px;
    padding: 2%;
    line-height: 1;
    text-align: center;
    color: #363636;
  }

  .chakanwodegongyi {
    background-color: orange;
    color: white;
  }

  .step-footer {
    height: 30px;
  }
</style>

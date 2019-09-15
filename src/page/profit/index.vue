<template>
  <div>
    <div class="head">
      <div class="head-box">
        <div style="padding-top: 12%;font-size: 15px">可提矿数（TG）</div>
        <div style="font-size: 36px;font-weight: initial;margin-top: 5%">{{profitInfo.balanceProfit}}</div>
        <div class="chibikuang">昨日挖矿 <span style="color: orangered">{{profitInfo.yestadayProfit}}</span> TG</div>

        <div style="padding-top: 10%;">
          <van-row>
            <van-col span="12">
              <div class="hb-text">累计矿数（TG）</div>
            </van-col>
            <van-col span="12">
              <div class="hb-text">七日年化（%）</div>
            </van-col>
          </van-row>

          <van-row>
            <van-col span="12">{{profitInfo.totalProfit}}</van-col>
            <van-col span="12">{{profitInfo.annual}}%</van-col>
          </van-row>
        </div>

        <div style="width: 80%;padding-left: 10%;padding-top: 13%">
          <van-button type="default" size="large" color="orange" @click="gotoDraw">提取矿</van-button>
        </div>

      </div>
    </div>

    <div class="shouyi-title">
      <van-row>
        <van-col span="16">
          <div style="font-weight: bold;">挖矿记录
          </div>
        </van-col>
        <van-col span="8">
          <div style="font-size: 12px;color: #979797">只显示近30条明细</div>
        </van-col>
      </van-row>
    </div>
    <div style="padding: 3%">
      <van-row justify="space-between" class="shouyi-row" v-for="(item,k) in profitList" :key="k">
        <van-col span="17">
          <div class="shouyi-left">
            <div>{{item.profitTypeDesc}}</div>
            <div class="shouyi-bottom">{{item.createTime}}</div>
          </div>
        </van-col>
        <van-col span="7">
          <div>{{getDecimal(item.profitType)}} {{item.profitValue}} TG</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {Row, Col} from 'vant';
  import {Button} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {Popup} from 'vant';
  import {Field} from 'vant';
  import {openWebview} from "../../utils/webview";

  Vue.use(Field);
  Vue.use(Popup);
  Vue.use(Button);
  Vue.use(Row).use(Col);

  export default {
    data() {
      return {
        profitInfo: {
          totalProfit: '-',
          yestadayProfit: '-',
        },
        profitList: [],
      }
    },
    methods: {
      gotoDraw() {
        let balanceProfit = this.profitInfo.balanceProfit;

        openWebview({
          url: "./profit.draw.html",
          id: "profit.draw",
          title: "提取矿"
        }, {}, {
          balanceProfit: balanceProfit
        });
      },
      getDecimal(type) {
        if (type !== 100) {
          return "+";
        } else {
          return "-";
        }
      },
      onRefresh() {
        this.init();
        let ws = plus.webview.currentWebview();
        setTimeout(() => {
          ws.endPullToRefresh();
        }, 1000)
      },
      init() {
        let _t = this;
        request(TGCApiUrl.getProfitInfo, {}).then(res => {
          _t.profitInfo = res.profitInfo;
          _t.profitList = res.profitList;
        })
      }
    },
    created() {
      this.init();
    },
    mounted() {
      let _t = this;
      let ws = plus.webview.currentWebview();
      ws.setPullToRefresh({support: true, style: 'circle', offset: '45px'}, _t.onRefresh);
    },
  }
</script>
<style scoped>
  .head {
    width: 100%;
    min-height: 300px;
    background-image: -webkit-linear-gradient(top, #fa5b21, #fefffd);
    text-align: center;
    padding-top: 5%;
  }

  .head-box {
    width: 94%;
    height: 400px;
    background-color: white;
    margin-left: 3%;
    border-radius: 5px;
    box-shadow: #e6e6e6 1px 10px 20px 0px;
  }

  .chibikuang {
    margin-top: 5%;
    background-color: #eeeeee;
    border-radius: 10px;
    width: 50%;
    margin-left: 25%;
    font-size: 15px;
    color: #979797;
  }

  .hb-text {
    font-size: 15px;
    color: #979797;
  }

  .shouyi-left {
    margin-left: 5%;
  }

  .shouyi-row {
    border-bottom: 1px solid lightgrey;
    padding: 3%;
  }

  .shouyi-title {
    text-align: left;
    margin-top: 8%;
    padding: 3%;
    background-color: #ededed;
  }

  .shouyi-bottom {
    font-size: 15px;
    color: #989898;
  }
</style>




<template>
  <div id="primarySchool-body">
    <div v-if="info===null">

    </div>
    <div v-else>
      <div id="primarySchool-banner">
        <img :src="info.smallImg"/>
      </div>
      <div class="primarySchool-text">
        <div class="primarySchool-text-title">捐助项目</div>
        <div class="primarySchool-text-desc">{{info.donationBrief}}</div>
      </div>
      <div id="primarySchool-sum">
        <div class="item">
          {{balance}}
          <div class="unit">ta的TG</div>
        </div>
        <div class="item">
          {{num}}
          <div class="unit">捐赠笔数</div>
        </div>
      </div>
      <div class="primarySchool-text" @click="doCopy">
        <div class="primarySchool-text-title">{{info.name}}的区块链捐赠地址
          <van-icon name="records"></van-icon>
        </div>
        <div class="primarySchool-text-desc">
          {{info.blAddress}}
        </div>
      </div>


      <div v-if="info.one2oneType === 1">
        <div class="primarySchool-text">
          <div class="primarySchool-text-title">捐助对象</div>
          <div class="primarySchool-text-desc">
            <div class="cell-item">
              <div class="cell-i cell-i-title">
                {{info.name}}
                <div class="cell-i-sync">
                </div>
              </div>
              <div class="cell-i">
                {{info.age}}岁 {{info.sex}}
              </div>
              <div class="cell-i">
                {{info.province}} {{info.city}}
              </div>
            </div>
            <div class="cell-item">
              <div class="cell-i cell-i-title">
                家庭情况
              </div>
              <div class="cell-i">
                {{info.home_info}}
              </div>
            </div>
            <div class="cell-item">
              <div class="cell-i cell-i-title">
                心愿
              </div>
              <div class="cell-i">
                {{info.dream}}
              </div>
            </div>
            <div class="cell-item">
              <div class="cell-i cell-i-title">
                兴趣爱好
              </div>
              <div class="cell-i">
                {{info.interest}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="info.one2oneType === 2 ">
        <div class="primarySchool-text">
          <div class="primarySchool-text-title">病人情况</div>
          <div class="primarySchool-text-desc">
            <div class="cell-item">
              {{info.donationInfo}}
            </div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 20%">
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import {isEmptyObject} from "@/utils/globalFunc";
  import {Toast, Cell, Icon} from 'vant';
  import TGCConfig from "../../utils/constants/tgcConfig";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";
  import VueClipboard from 'vue-clipboard2'
  import Web3Util from "../../utils/web3Util/Web3Util";
  import ethplorerUtils from "../../utils/web3Util/ethplorerUtils";

  Vue.use(VueClipboard);
  Vue.use(Toast)
     .use(Cell)
     .use(Icon);
  export default {
    name: 'charitable',
    data() {
      return {
        selected: 0,
        anonymous: "",
        info: null,
        tokenAddress: TGCConfig.tokenAddress,
        showBase: false,
        sendAmount: "",
        balance: "-",
        num: "-",
      }
    },
    created: function () {
      let _this = this;
      let ws = plus.webview.currentWebview();
      let params = {
        one2OneId: ws.donationId,
      };
      request(TGCApiUrl.donationOne2oneGetInfo, params).then(function (res) {
        _this.info = res;

        ethplorerUtils.getAddressInfo(res.blAddress).then(addInfo => {
          _this.balance = addInfo.tgBalance;
          _this.num = addInfo.countTxs;
        })
      });

    },
    methods: {
      doCopy() {
        let _this = this;
        _this.$copyText(_this.info.blAddress).then(function (e) {
          Toast.success({
            message: '复制成功',
            position: 'bottom',
          })
        }, function (e) {
        });
      },
    }
  }
</script>
<style scoped>
  #primarySchool-body {
    background-color: #fafafadb;
    height: auto;
    overflow: hidden;
  }

  #primarySchool-banner > img {
    width: 100%;
  }

  .primarySchool-text {
    width: 92%;
    background-color: #ffffff;
    color: #767676;
    text-align: left;
    padding: 5%;
    height: auto;
    margin-left: -6px;
    margin-top: 1%;
  }

  .primarySchool-text-desc {
    overflow-x: auto;
    margin-left: 1%;
    font-size: 11px;
    margin-top: 3%;
  }

  .primarySchool-text-desc > a, a:visited {
    color: #21a8ce;
    text-decoration: none;
    font-size: 10px;
  }

  .primarySchool-text-title {
    font-weight: bold;
    color: black;
  }

  #primarySchool-sum {
    margin-top: 1%;
    margin-left: -2%;
    text-align: center;
    font-size: 25px;
    font-weight: bold;
    height: 74px;
  }

  #primarySchool-sum > .item {
    width: 48%;
    background-color: white;
    height: 70px;
    line-height: 50px;
    float: left;
    margin-left: 2%;
    padding-top: 1%;
    color: orange;
    overflow: hidden;
  }

  #primarySchool-sum > .item > .unit {
    text-align: right;
    height: 10px;
    margin-right: 10%;
    color: #bab5b5;
    line-height: 0;
    font-size: 11px;
    font-weight: normal;
  }

  .cell-i {
    font-size: 13px;
    margin-top: 2%;
  }

  .cell-i-title {
    font-size: 16px;
  }

  .cell-i-sync {
    float: right;
  }

  .cell-item {
    padding: 3%;
  }

  .cell-item:not(:first-child):before {
    content: " ";
    position: absolute;
    left: .15rem;
    right: 0;
    top: 0;
    width: auto;
    height: 1px;
    border-top: 3px solid #0f0f0f;
    color: #1e1e1e;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }

  #doDonation {
    background-color: #ff8205;
    height: 50px;
  }

  .danbibutton {
    font-size: 18px;
    font-weight: bold;
    color: white;
  }

  .pop-bottom {
    width: 100%;
    padding: 3%;
    height: 35%;
    background-color: white;
  }

  .pop-button {
    margin-top: 20px;
    width: 98%;
    margin-left: 1%;
    background-color: orangered;
    color: white;
    font-weight: bold;
  }
</style>

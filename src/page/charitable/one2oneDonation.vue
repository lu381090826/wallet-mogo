<template>
  <div id="primarySchool-body">
    <div id="primarySchool-banner">
      <img :src="info.smallImg"/>
    </div>
    <div class="primarySchool-text">
      <div class="primarySchool-text-title">捐助项目</div>
      <div class="primarySchool-text-desc">{{info.donationBrief}}</div>
    </div>
    <div id="primarySchool-sum">
      <div class="item">
        {{info.receiveAmount}}
        <div class="unit">捐赠总额 (TGCOIN)</div>
      </div>
      <div class="item">
        {{info.donationPeopleNum}}
        <div class="unit">捐赠人数</div>
      </div>
    </div>
    <div class="primarySchool-text">
      <div class="primarySchool-text-title">区块链钱包地址</div>
      <div class="primarySchool-text-desc">
        <!--<router-link :to="{path:'/Wallet/Trans',query:{address:tokenAddress,walletAddress:info.blAddress}}">-->
        <!---->
        <!--</router-link>-->
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
    <van-tabbar id="doDonation" v-model="selected">
      <van-tabbar-item class="danbibutton" v-intervalclick="{func:pop}">单笔捐</van-tabbar-item>
    </van-tabbar>

    <van-popup v-model="showBase" position="bottom" class="pop-bottom">
      <van-field label="捐款金额(tg)" v-model="sendAmount"></van-field>
      <van-button size="large" class="pop-button" v-intervalclick="{func:donation}">下一步</van-button>
    </van-popup>

  </div>
</template>
<script>
  import Vue from "vue";
  import {Tabbar, TabbarItem, Sku, Popup, Button, Field, Toast} from 'vant';
  import TGCConfig from "../../utils/constants/tgcConfig";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";
  import {openWebview} from "../../utils/webview";

  Vue.use(Popup).use(Sku).use(Tabbar).use(TabbarItem).use(Button).use(Field);
  export default {
    name: 'charitable',
    data() {
      return {
        selected: 0,
        anonymous: "",
        info: {},
        tokenAddress: TGCConfig.tokenAddress,
        showBase: false,
        sendAmount: "",
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
      });
    },
    methods: {
      onBuyClicked() {
      },
      onAddCartClicked() {
      },
      pop() {
        this.showBase = true;
        return false;
      },
      donation() {
        if (Number(this.sendAmount) === 0) {
          Toast('请填写捐款金额');
          return false;
        }

        let _this = this;
        let receiveAddress = this.info.blAddress;
        //创建订单
        let donationInfo = _this.info;
        let params = {
          donationType: donationInfo.donationType,
          donationId: donationInfo.donationId,
          donationTitle: "捐助" + donationInfo.name,
          blAddress: donationInfo.blAddress,
          uid: plus.storage.getItem('uid'),
          userName: "",
          amount: _this.sendAmount,
        };
        request(TGCApiUrl.donationCreateOrder, params).then(function (res) {
          openWebview({
            url: './wallet.send.html',
            id: 'wallet.send',
            title: '捐款收银台',
            titleStyle: {
              titleText: "捐款收银台",
              autoBackButton: true,
              progress: {color: '#ff5c0a', height: "1%"},
            }

          }, {}, {
            receiveAddress: params.blAddress,
            sendAmount: params.amount,
            tokenAddress: TGCConfig.tokenAddress,
            callbackWebViewId: 'charitable.one2oneDonation',
            donationId: params.donationId,
          });
        })

      }
    }
  }
</script>
<style scoped>
  #primarySchool-body {
    background-color: #fafafadb;
    height: auto;
    overflow: hidden;
  }

  #primarySchool-header {
    background-color: orange;
  }

  #primarySchool-banner > img {
    width: 100%;
    /*height: 250px;*/
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
    height: 130px;
    background-color: white;
  }

  .pop-button {
    margin-top: 40px;
    width: 98%;
    margin-left: 1%;
    background-color: orangered;
    color: white;
    font-weight: bold;
  }
</style>

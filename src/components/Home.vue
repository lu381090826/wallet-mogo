<template>
  <div style="overflow-x: hidden;">
    <div class="top"></div>
    <div>
      <HomeHeader :config="config"
                  :tg-trans="tgTrans"
                  :token-balance="tokenBalance"
                  :token-balance-r-m-b="tokenBalanceRMB"
                  :trans="trans"
                  :wallet-balance="walletBalance"
                  :wallet-balance-r-m-b="walletBalanceRMB"/>

    </div>
    <div v-if="showVerifyIdcard" v-intervalclick="{func:gotoVerifyIdcard}">
      <van-notice-bar
        text="您未进行身份认证，为不影响体验，点击跳转认证。"
        left-icon="info-o"
      />
    </div>
    <HeaderTool/>

    <div class="blank-space"></div>

    <HeaderMiner/>

    <div class="blank-space"></div>

    <HomeShop :goods="goods" :goods-list="goodsList"/>

    <div class="blank-space"></div>

    <Gongyi/>

    <div class="blank-space"></div>

    <van-popup v-model="showWalletConfig" position="right">
      <div style="width: 200px;height: 1000px;padding: 5%">
        <div style="margin-top: 10%;font-weight: bold;">选择地址</div>
        <div style="margin-top: 20%">
          <van-cell-group>
            <van-cell v-for="(item,k) in walletList" :key="k" :title="item.walletName" clickable
                      @click="set(item.walletAddress,item.walletName)" :label="subString(item.walletAddress)"
                      :style="{backgroundColor: getColor(item.walletAddress)}"
            >
            </van-cell>
          </van-cell-group>
          <van-cell-group>
            <van-button class="gotoImport button-blue" type="default" size="large"
                        v-intervalclick="{func:gotoWalletConfig}">
              地址管理
            </van-button>
          </van-cell-group>
        </div>
      </div>
    </van-popup>

  </div>
</template>
<script>
  import Vue from 'vue'
  import Web3Util from "@/utils/web3Util/Web3Util";
  import {request} from "@/utils/request";
  import {
    Button,
    Cell,
    CellGroup,
    Col,
    Icon,
    Loading,
    NoticeBar,
    Popup,
    Row,
    Swipe,
    SwipeItem,
    Tabbar,
    TabbarItem,
    Toast
  } from 'vant';
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {openWebview, openWebviewFast, showWebviewById} from "@/utils/webview";
  import TGCConfig from "../utils/constants/tgcConfig";
  import MathUtil from "../utils/MathUtil";
  import rateUtil from "../utils/web3Util/RateUtil";
  import HomeHeader from "./Home/HomeHeader";
  import Gongyi from "./Home/Gongyi";
  import HomeShop from "./Home/HomeShop";
  import HeaderMiner from "./Home/HeaderMiner";
  import HeaderTool from "./Home/HeaderTool";
  import HomePop from "./Home/HomePop";

  Vue.use(NoticeBar);
  Vue.use(Swipe).use(SwipeItem);
  Vue.use(Tabbar).use(TabbarItem)
     .use(Row).use(Col)
     .use(Popup)
     .use(Button)
     .use(Toast)
     .use(Icon)
     .use(Cell)
     .use(CellGroup)
     .use(Loading);
  export default {
    components: {HomePop, HeaderTool, HeaderMiner, HomeShop, Gongyi, HomeHeader},
    data() {
      return {
        walletAddress: plus.storage.getItem("walletAddress"),
        walletName: plus.storage.getItem("walletName"),
        tokenList: [],
        walletBalance: "-",
        tokenBalance: "-",
        walletList: null,
        goods: [],
        showVerifyIdcard: false,
        walletBalanceRMB: null,
        tokenBalanceRMB: null,
        showWalletConfig: false,
      }
    },
    mounted() {
      let _t = this;
      let ws = plus.webview.currentWebview();
      ws.setPullToRefresh({support: true, style: 'circle', offset: '45px'}, _t.onRefresh);
    },
    created() {
      let t = this;
      this.init();
      window.addEventListener("init", function (event) {
        t.init();
      });
      window.addEventListener("walletList", function (event) {
        t.getWalletList();
      });
    },
    methods: {
      gotoWalletConfig() {
        openWebview(
          {
            url: "./wallet.walletConfig.html",
            id: "wallet.walletConfig",
            title: "地址设置",
          }
        );
      },
      set(walletAddress, walletName) {
        let _t = this;
        plus.storage.setItem("walletAddress", walletAddress);
        plus.storage.setItem("walletName", walletName);
        _t.walletAddress = walletAddress;
        _t.walletName = walletName;
        _t.walletBalanceRMB = null;
        _t.tokenBalanceRMB = null;

        _t.init();
        plus.nativeUI.showWaiting();
        setTimeout(() => {
          plus.nativeUI.closeWaiting();
          _t.showWalletConfig = false;
        }, 1000);

      },
      toBuy(goodsId) {
      },
      goodsList() {
        openWebview({
          url: './shop.shopIndex.html',
          id: "shop.shopIndex",
          title: "TG特惠商城",
          needLoaded: true,
        })
      },
      trans() {
        let _this = this;
        openWebview({
          url: './wallet.trans.html',
          id: "wallet.trans",
          title: "交易记录",
        }, {}, {
          walletAddress: _this.walletAddress,
        })
      },
      tgTrans() {
        let _this = this;
        openWebview({
          url: './wallet.trans.html',
          id: "wallet.trans",
          title: "交易详情",
        }, {}, {
          walletAddress: _this.walletAddress,
          tokenAddress: TGCConfig.tokenAddress,
        })
      },
      gotoVerifyIdcard() {
        openWebview({
          url: './verify.idcard.html',
          id: 'verify.idcard',
          title: '认证中心',
        });
      },
      config() {
        this.showWalletConfig = true;
      },
      onRefresh() {
        let _this = this;
        this.walletBalance = '-';
        this.tokenBalance = '-';
        this.tokenBalanceRMB = null;
        this.walletBalanceRMB = null;
        _this.init();

        let ws = plus.webview.currentWebview();
        setTimeout(() => {
          ws.endPullToRefresh();
        }, 1000)
      },
      getWalletList() {
        let _this = this;
        request(TGCApiUrl.walletList).then(res => {
          _this.walletList = res;
        });
      },
      subString(value) {
        if (Number(value) === 0) {
          return value;
        }
        return value.toString().substring(0, 8) + "..";
      },
      getColor(walletAddress) {
        if (walletAddress === this.walletAddress) {
          return "#efefef";
        } else {
          return "white";
        }
      },
      init() {
        let _this = this;
        request(TGCApiUrl.homePage).then(res => {
          _this.showVerifyIdcard = res.idcardIsCheck === 0;
          _this.walletList = res.walletList;
          _this.goods = res.getHot;
        });

        request(TGCApiUrl.buyTgDollarRate).then(dollarRate => {
          Web3Util.getBalance(_this.walletAddress).then(walletBalance => {
            if (walletBalance.toString().length > 14) {
              _this.walletBalance = walletBalance.toString().substring(0, 14);
            } else {
              _this.walletBalance = walletBalance
            }
            if (Number(_this.walletBalance) !== 0) {
              rateUtil.ethToCNY(_this.walletBalance, dollarRate).then(res => {
                _this.walletBalanceRMB = '≈' + res + '￥';
              })
            }
          });

          Web3Util.getBalance(_this.walletAddress, TGCConfig.tokenAddress).then(tokenBalance => {
            _this.tokenBalance = tokenBalance;
            if (Number(_this.tokenBalance) !== 0) {
              _this.tokenBalanceRMB = '≈' + MathUtil.accMul(_this.tokenBalance, dollarRate).toFixed(2) + '￥';
            }
          });
        });
      }
    }
  }


</script>
<style scoped>

  .gongyi-box > img {
    border-radius: 3px;
    width: 100%;
    height: 115px;
  }

  .top {
    width: 100%;
    padding-top: 10%;
    background-color: #3a90e0;
  }

</style>

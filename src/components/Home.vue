<template>
  <div>
    <div class="top"></div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh"
                      class="pull"
                      pulling-text=" "
                      loosing-text=" "
                      loading-text=" "
    >
      <div slot="pulling" style="margin-left: 45%">
        <van-loading color="white" type="spinner"/>
      </div>
      <div slot="loading" style="margin-left: 45%">
        <van-loading color="white" type="spinner"/>
      </div>
      <div slot="normal" style="margin-left: 45%">
        <van-loading color="white" type="spinner"/>
      </div>
      <div class="pull-refresh">
        <div class="asset-header">
          <van-row type="flex" justify="end">
            <van-col span="12">
            </van-col>
            <van-col span="12" v-intervalclick="{func:config}">
              <div style="margin-left: 80%">
                <van-icon name="wap-nav" size="20px"></van-icon>
              </div>
            </van-col>
          </van-row>
          <van-row gutter="20" type="flex" justify="center">
            <van-col span="10">
              <div class="asset-header-titile" v-intervalclick="{func:trans}">
                <div class="titile-name">Eth</div>
                <div :style="{fontSize: '16px'}">
                  {{walletBalance}}<span class="minbalance">   {{walletBalanceRMB}}</span>
                </div>
              </div>
            </van-col>
            <van-col span="10">
              <div class="asset-header-titile" v-intervalclick="{func:tgTrans}">
                <div class="titile-name">TG</div>
                <div :style="{fontSize: '16px'}">
                  {{tokenBalance}}<span class="minbalance">   {{tokenBalanceRMB}}</span>
                </div>
              </div>
            </van-col>
          </van-row>
        </div>

      </div>
      <div v-if="showVerifyIdcard" v-intervalclick="{func:gotoVerifyIdcard}">
        <van-notice-bar
          text="您未进行身份认证，为不影响体验，点击跳转认证。"
          left-icon="info-o"
        />
      </div>
      <div class="asset-body">
        <div class="asset-header-botton">
          <van-row>
            <van-col span="8" v-intervalclick="{func:scan}">
              <img src="../assets/sa.png" width="40">
            </van-col>
            <van-col span="8" v-intervalclick="{func:send}">
              <img src="../assets/sk.png" width="41">
            </van-col>
            <van-col span="8" v-intervalclick="{func:receive}">
              <img src="../assets/zz.png" width="37">
            </van-col>
          </van-row>
        </div>
        <div class="asset-header-botton-text">
          <van-row>
            <van-col span="8">扫一扫</van-col>
            <van-col span="8">转账</van-col>
            <van-col span="8">收款</van-col>
          </van-row>
        </div>
      </div>

      <div class="blank-space"></div>

      <div class="area-title">
        <div class="area-tag"></div>
        挖矿项目
      </div>
      <div class="area">
        <van-swipe :autoplay="5000" indicator-color="black">
          <van-swipe-item v-intervalclick="{func:profit}">
            <van-row style="height: 80px">
              <van-col span="14">
                <div class="zhuant-title">持币矿</div>
                <div class="zhuant-desc">持有TG涨收益</div>
              </van-col>
              <van-col span="8">
                <div>
                  <img src="../../static/shouyi.png" style="width: 48px;">
                </div>
              </van-col>
            </van-row>
          </van-swipe-item>

          <van-swipe-item v-intervalclick="{func:step}">
            <van-row style="height: 80px">
              <van-col span="14">
                <div class="zhuant-title">行走矿</div>
                <div class="zhuant-desc">行走步数换TG</div>
              </van-col>
              <van-col span="8">
                <div>
                  <img src="../../static/walk.png" style="width: 48px;">
                </div>
              </van-col>
            </van-row>
          </van-swipe-item>

          <van-swipe-item v-intervalclick="{func:forest}">
            <van-row style="height: 80px">
              <van-col span="14">
                <div class="zhuant-title">采集能量攒TG</div>
                <div class="zhuant-desc">采集能量攒TG</div>
              </van-col>
              <van-col span="8">
                <div>
                  <img src="../../static/forest/image/qiu.png" style="width: 48px;">
                  <div style="margin-top: -38px;margin-left:10px;color: #008002">TG能量</div>
                </div>
              </van-col>
            </van-row>
          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="blank-space"></div>

      <div class="area-title">
        <div class="area-tag"></div>
        TG特惠
      </div>
      <div class="area" style="padding-top: 5%;" v-intervalclick="{func:goodsList}">
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in goods" :key="k">
            <div class="hot-sell-img">
              <img :src="item.imgSmall" width="48px"/>
            </div>
          </van-col>
        </van-row>
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in goods" :key="k">
            <div class="hot-sell-title">
              {{item.simpleName}}
            </div>
          </van-col>
        </van-row>
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in goods" :key="k">
            <div class="hot-sell-price">
              热卖价<span class="hot-sell-price-num">{{item.price.toFixed(2)}}{{item.units}}</span>
              <div>
                <span class="hot-sell-price-num-cn">{{item.originPriceCn}}￥</span>
              </div>
            </div>
          </van-col>
        </van-row>
        <div class="seemore" style="padding-top: 5%" v-intervalclick="{func:goodsList}">
          <div class="seemore-inner">
            <van-row type="flex" justify="space-between">
              <van-col>去商城看看</van-col>
              <van-col>
                <van-icon name="arrow"></van-icon>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>

      <div class="blank-space"></div>

      <div class="area-title">
        <div class="area-tag"></div>
        公益捐助，传递爱心
      </div>
      <div class="area">
        <van-row type="flex" justify="center" gutter="10">
          <van-col span="11">
            <div class="gongyi-box" @click="toDonation('1')">
              <img :src="img1">
              <div class="gongyi-box-title">
                <span>让山区孩子温暖过冬</span>
              </div>
              <div class="box-de">
                已有<span class="box-de-num">1,003</span>人捐助
              </div>
            </div>
          </van-col>
          <van-col span="11">
            <div class="gongyi-box" @click="toDonation('2')">
              <img :src="img2">
              <div class="gongyi-box-title">
                <span>给无助病人带来希望</span>
              </div>
              <div class="box-de">
                已有<span class="box-de-num">2,326</span>人捐助
              </div>
            </div>
          </van-col>
        </van-row>
        <div class="seemore" v-intervalclick="{func:one2one}">
          <div class="seemore-inner">
            <van-row type="flex" justify="space-between">
              <van-col>查看更多公益活动</van-col>
              <van-col>
                <van-icon name="arrow"></van-icon>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
      <div class="blank-space"></div>
    </van-pull-refresh>

    <van-popup v-model="showWalletConfig" position="right">
      <div style="width: 200px;height: 1000px;padding: 5%">
        <div style="margin-top: 10%;font-weight: bold;">选择钱包</div>
        <div style="margin-top: 20%">
          <van-cell-group>
            <van-cell v-for="(item,k) in walletList" :key="k" :title="item.walletName" clickable
                      @click="set(item.walletAddress,item.walletName)" :label="subString(item.walletAddress)"
                      :style="{backgroundColor: getColor(item.walletAddress)}"
            >
            </van-cell>
          </van-cell-group>
          <van-cell-group>
            <van-button class="gotoImport button-blue" type="default" size="normal"
                        v-intervalclick="{func:gotoWalletConfig}">
              钱包管理
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
  import {PullRefresh, Row, Col, Toast, Icon, Loading, Button, Popup, Cell, CellGroup} from 'vant';
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {Tabbar, TabbarItem} from 'vant';
  import {openWebview, showWebviewById, openWebviewFast} from "@/utils/webview";
  import TGCConfig from "../utils/constants/tgcConfig";
  import {Swipe, SwipeItem} from 'vant';
  import {NoticeBar} from 'vant';
  import MathUtil from "../utils/MathUtil";
  import etherscanHttpUtils from "../utils/web3Util/etherscanHttpUtils";

  Vue.use(NoticeBar);
  Vue.use(Swipe).use(SwipeItem);
  Vue.use(Tabbar).use(TabbarItem)
    .use(Row).use(Col)
    .use(PullRefresh)
    .use(Popup)
    .use(Button)
    .use(Toast)
    .use(Icon)
    .use(Cell)
    .use(CellGroup)
    .use(Loading);
  export default {
    data() {
      return {
        walletAddress: plus.storage.getItem("walletAddress"),
        walletName: plus.storage.getItem("walletName"),
        tokenList: [],
        walletBalance: "-",
        isLoading: false,
        tokenBalance: "-",
        showWalletConfig: false,
        walletList: null,
        img1: "http://www.thanksgiving.cn/static/img/29c0db75a70929c60f2c0a47a3c8a3f0.jpeg",
        img2: "http://www.thanksgiving.cn/static/img/wuzhubingren.png",
        goods: [],
        showVerifyIdcard: false,
        walletBalanceRMB: null,
        tokenBalanceRMB: null,
      }
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
      getColor(walletAddress) {
        if (walletAddress === this.walletAddress) {
          return "#efefef";
        } else {
          return "white";
        }
      },
      gotoWalletConfig() {
        openWebview({
          url: "./wallet.walletConfig.html",
          id: "wallet.walletConfig",
          title: "钱包设置"
        });
      },
      set(walletAddress, walletName) {
        plus.storage.setItem("walletAddress", walletAddress);
        plus.storage.setItem("walletName", walletName);
        this.walletAddress = walletAddress;
        this.walletName = walletName;

        this.onRefresh();
      },
      buyTg() {
        openWebviewFast({
          url: './wallet.buyTg.html',
          id: 'wallet.buyTg',
          title: '认购TG'
        });
      },
      one2one() {
        openWebviewFast({
          url: './charitable.one2one.html',
          id: 'charitable.one2one',
          titleStyle: {
            titleText: "一帮一",
            titleColor: "#ffffff",
            backgroundColor: "#ffa500",
            splitLine: {color: "#ffa500"},
            progress: {color: '#ff5c0a', height: "1%"},
          }
        });
      },
      step() {
        openWebviewFast({
          url: "./charitable.step.html",
          id: "charitable.step",
          titleStyle: {
            titleText: "行走矿",
          }
        }, {}, {none: true});
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
      forest() {
        openWebviewFast({
          url: './forest.forestIndex.html',
          id: "forest.forestIndex",
          title: "TG森林",
        })
      },
      profit() {
        openWebview(
          {
            url: "./profit.index.html",
            id: "profit.index",
            needLoaded: true,
            titleStyle: {
              titleText: "持币矿",
              titleColor: "#ffffff",
              backgroundColor: "#fa5b21",
              autoBackButton: true,
              progress: {color: '#ff5c0a', height: "1%"},
            },
            style: {render: true}
          })
      },
      trans() {
        let _this = this;
        openWebview({
          url: './wallet.trans.html',
          id: "wallet.trans",
          title: "交易记录",
          needLoaded: true,
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
      scan() {
        openWebviewFast({
          url: "./wallet.scan.html",
          id:
            "wallet.scan",
          title:
            "扫一扫",
          titleStyle: {
            backgroundColor: "#000000", // 导航栏背景色
            titleText: "扫一扫", // 导航栏标题
            titleColor: "#ffffff", // 文字颜色
            autoBackButton: true, // 自动绘制返回箭头
            splitLine: {
              // 底部分割线
              color: "#000000"
            }
          },
        });
      },
      send() {
        openWebview({
          url: "./wallet.send.html",
          id: "wallet.send",
          titleStyle: {
            titleText: "转账",
            autoBackButton: true,
            progress: {color: '#ff5c0a', height: "1%"},
          }
        }, {}, {
          needReLoad: true,
        });
      },
      receive() {
        openWebview({
          url: "./wallet.receive.html",
          id: "wallet.receive",
          title: "收款"
        }, {}, {
          needReLoad: true,
        });
      },
      config() {
        this.showWalletConfig = true;
      },
      onRefresh() {
        let _this = this;
        _this.isLoading = true;
        this.showWalletConfig = false;

        this.walletBalance = '-';
        this.tokenBalance = '-';
        setTimeout(() => {
          _this.init();
        }, 50)
      },
      getWalletList() {
        let _this = this;
        request(TGCApiUrl.walletList).then(res => {
          _this.walletList = res;
        });
      },
      init() {
        let _this = this;
        request(TGCApiUrl.homePage).then(res => {
          _this.showVerifyIdcard = res.idcardIsCheck === 0;
          _this.walletList = res.walletList;
          _this.goods = res.getHot;
        });

        Web3Util.getBalance(_this.walletAddress).then(res => {
          if (res.toString().length > 14) {
            _this.walletBalance = res.toString().substring(0, 14);
          } else {
            _this.walletBalance = res
          }

          request('https://www.coinbase.com/api/v2/prices/CNY/spot?')
          etherscanHttpUtils.get({module: "stats", action: 'ethprice'}, false).then(res => {
            _t.walletBalanceRMB = '≈' + MathUtil.accMul(_this.tokenBalance, res.ethusd) + '￥';
          });
        });

        Web3Util.getBalance(_this.walletAddress, TGCConfig.tokenAddress).then(res => {
          _this.tokenBalance = res;
          request(TGCApiUrl.buyTgDollarRate).then(res => {
            _this.tokenBalanceRMB = '≈' + MathUtil.accMul(_this.tokenBalance, res).toFixed(2) + '￥';
          });
        });


        _this.isLoading = false;
      },
      subString(value) {
        if (Number(value) === 0) {
          return value;
        }
        return value.toString().substring(0, 8) + "..";
      }
    }
  }


</script>
<style scoped>

  .top {
    width: 100%;
    padding-top: 10%;
    background-color: #3a90e0;
  }

  .pull {
    background-color: #3a90e0;
    color: white;
  }

  .asset-header {
    width: 100%;
    background-image: -webkit-linear-gradient(top, #3a90e0, #3a81d1);
    height: 10%;
    min-height: 100px;
  }

  .asset-header-titile {
    font-weight: bold;
    font-size: 30px;
    color: white;
    margin-top: 15%;
    margin-bottom: 10%;
  }

  .titile-name {
    font-size: 13px;
  }

  .asset-body {
    background-color: white;
    padding-top: 5%;
    padding-bottom: 3%;
    text-align: center;
  }

  .asset-header-botton {
    color: #8e8e8e;
  }

  .asset-header-botton-text {
    color: #8e8e8e;
    font-size: 13px;
  }

  .area {
    padding-top: 3%;
    padding-bottom: 3%;
    width: 100%;
    color: black;
    text-align: center;
    background-color: white;
  }

  .gongyi-box {
    background-color: white;
    padding: 5%;
  }

  .gongyi-box > img {
    border-radius: 3px;
    width: 100%;
    height: 115px;
  }

  .gongyi-box-title {
    text-align: left;
    font-size: 15px;
    font-weight: bold;
    color: black;
  }

  .box-de {
    text-align: left;
    font-size: 13px;
    color: #8e8e8e;
    margin-bottom: 5%;
  }

  .asset-footer {
    background-color: #f3f3f3;
    height: 50px;
    text-align: center;
    color: #8e8e8e;
  }

  .area-title {
    background-color: white;
    border-bottom: 1px solid #fafafa;
    color: black;
    font-size: 13px;
    padding-left: 15px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .area-tag {
    margin-top: 2px;
    width: 4px;
    height: 14px;
    background-color: #3a81d1;
    float: left;
    border-radius: 1px;
    margin-right: 5px;
  }

  .zhuant-title {
    font-weight: bold;
    margin-top: 5%;
    margin-left: 28%;
  }

  .zhuant-desc {
    color: #8e8e8e;
    font-size: 12px;
    margin-left: 28%;
  }

  .seemore {
    font-size: 13px;
    color: #595959;
    padding-left: 3%;
    padding-right: 3%;
  }

  .seemore-inner {
    border-top: 1px solid #fafafa;
    padding-top: 3%;
  }

  .box-de-num {
    color: orange;
  }

  .gotoImport {
    margin-top: 30%;
    width: 94%;
    margin-left: 3%;
    margin-bottom: 5%;
  }

  .hot-sell-title {
    font-size: 12px;
    font-weight: bold;
  }

  .hot-sell-price {
    margin-top: 3%;
    font-size: 12px;
    color: #8e8e8e;
    bottom: 0;
  }

  .hot-sell-price-num {
    color: red;
  }

  .hot-sell-price-num-cn {
    color: gray;
  }

  .minbalance {
    font-size: 12px;
  }
</style>

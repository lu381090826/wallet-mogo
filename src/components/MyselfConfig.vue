<template>
  <div class="myselfbody">
    <div class="navpanel">
      <van-row type="flex" justify="center">
        <van-col span="12">
          <div v-intervalclick="{func:config}">
            <van-icon name="pending-payment" size="35px"></van-icon>
          </div>
          <div>
            钱包管理
          </div>
        </van-col>
        <van-col span="12">
          <div v-intervalclick="{func:trans}">
            <van-icon name="cash-back-record" size="35px"></van-icon>
          </div>
          <div>
            交易记录
          </div>
        </van-col>
      </van-row>
    </div>


    <div class="blank-space"></div>
    <div class="blank-space"></div>

    <van-cell-group>
      <van-cell title="邀请好友" is-link icon="point-gift" v-intervalclick="{func:yaoqing}">
      </van-cell>

      <van-cell title="我的捐助" is-link icon="like-o" v-intervalclick="{func:wodejuanzeng}">
      </van-cell>

      <van-cell title="商城订单" is-link icon="shop-collect-o" v-intervalclick="{func:shopOrder}">
      </van-cell>

      <van-cell title="检查更新" is-link icon="upgrade" v-intervalclick="{func:checkUpdate}">
      </van-cell>
    </van-cell-group>

    <div class="bottom">
      <van-button v-intervalclick="{func:logout}" size="large" type="default">
        退出登录
      </van-button>
    </div>

  </div>
</template>
<script>
  import Vue from 'vue';
  import NativeFun from "@/utils/plus/nativeFun";
  import {openWebview, openWebviewFast, preLoad, showWebviewById} from "@/utils/webview";
  import {NavBar, Cell, CellGroup, Button, Row, Col} from 'vant';
  import {Icon} from 'vant';
  import cons from "../utils/constants/Cons";
  import {isNotEmptyObject} from "../utils/globalFunc";

  Vue.use(Icon);
  Vue.use(NavBar);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Cell).use(CellGroup);

  export default {
    data() {
      return {
        uid: "",
      };
    },
    methods: {
      trans() {
        let _this = this;
        openWebview({
          url: './wallet.trans.html',
          id: "wallet.trans",
          title: "交易记录",
          needLoaded: true,
        }, {}, {needRefresh: true})
      },
      config() {
        openWebview({
          url: "./wallet.walletConfig.html",
          id: "wallet.walletConfig",
          title: "钱包设置",
        });
      },
      checkUpdate() {
        NativeFun.checkUpdate(true);
      },
      wodejuanzeng() {
        openWebview({
          url: './charitable.myCharitable.html',
          id: 'charitable.myCharitable',
          titleStyle: {
            titleText: "我的捐助",
            titleColor: "#ffffff",
            backgroundColor: "#ff6507",
            splitLine: {color: "#ff6507"},
            autoBackButton: true,
            progress: {color: '#ff5c0a', height: "1%"}
          }
        }, {}, {needRefresh: true})
      },
      shopOrder() {
        openWebview({
          url: './shop.order.html',
          id: 'shop.order',
          title: '我的商城订单',
        }, {}, {needRefresh: true})
      },
      yaoqing() {
        openWebview({
          url: './wallet.yaoqing.html',
          id: 'wallet.yaoqing',
          title: '邀请好友',
        });
      },
      logout() {
        plus.storage.clear();
        let home = plus.webview.getWebviewById(cons.homeViewId);
        if (isNotEmptyObject(home)) {
          home.close();
        }
        openWebview({
          url: cons.loginViewUrl,
          id: cons.loginViewId,
          title: "",
          noTitle: true,
          needLoaded: true,
        });
      }
    },
  }
</script>
<style scoped>
  .navbar {
    color: white;
    font-size: 16px;
    background-color: #53cbd9;
    padding-top: 10%;
    text-align: center;
  }

  .navpanel {
    color: white;
    width: 100%;
    background-image: -webkit-linear-gradient(top, #53cbd9, #54bac8);
    text-align: center;
    height: 100px;
    padding-top: 10%;
  }

  a:-webkit-any-link {
    color: gray;
    text-decoration: none;
  }

  .bottom {
    padding: 3%;
    margin-top: 40%
  }

  .myselfbody {
    overflow: hidden;
  }

</style>

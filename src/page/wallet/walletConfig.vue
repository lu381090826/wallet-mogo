<template>
  <div class="body" :style="{minHeight:winHeight+'px'}">
    <div class="box text-left">
      <div style="padding: 3%">
        <span style="font-weight: bold;font-size: 26px">我的地址</span>
        <div style="float: right;">
          <van-button size="mini"
                      v-intervalclick="{func:gotoImport}">
            <van-icon name="refund-o"></van-icon>
            导入地址
          </van-button>
          <van-button size="mini" @click="init">
            <van-icon name="replay"></van-icon>
            刷新
          </van-button>
        </div>
      </div>
      <van-cell-group>
        <van-cell v-for="(item,k) in walletList"
                  :key="k"
                  ﻿isLink
                  @click="gotoWalletInfo(item.walletAddress,item.walletName)"
        >
          <img :src="getTokenImg(item.walletAddress)" width="45px" height="45px" slot="icon">
          <div slot="title" class="wallet-list">{{item.walletName}}</div>
          <div slot="label" class="wallet-list-label">{{formatAddress(item.walletAddress)}}</div>
        </van-cell>
      </van-cell-group>


      <van-button class="gotoImport button-blue" type="primary" size="large" v-intervalclick="{func:createWallet}">创建地址
      </van-button>
    </div>

    <van-popup class="box" style="width: 80%" v-model="showCreate">
      <div>
        <van-cell-group>
          <van-field v-model="newWaletName" placeholder="请输入地址名称"></van-field>
          <van-field v-model="newWaletPassword" type='password' placeholder="请输入地址密码"></van-field>
        </van-cell-group>
        <div style="margin-top: 8%">
          <van-button type="info" size="large" v-intervalclick="{func:doCreate}">立即创建</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {request} from "@/utils/request";
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {RadioGroup, Radio, Cell, CellGroup, Button, Toast} from 'vant';
  import cons from "@/utils/constants/Cons";
  import {preLoad, showWebviewById} from "@/utils/webview";
  import {openWebview} from "../../utils/webview";
  import {ActionSheet} from 'vant';
  import {Icon} from 'vant';
  import {Dialog} from 'vant';
  import {Popup} from 'vant';
  import {Field} from 'vant';
  import {getAddressImg} from "../../utils/web3Util/AddressImg";

  Vue.use(Field);
  Vue.use(Popup);
  Vue.use(Icon);
  Vue.use(ActionSheet);
  Vue.use(RadioGroup);
  Vue.use(Button);
  Vue.use(Radio);
  Vue.use(Cell);
  Vue.use(Toast);
  Vue.use(CellGroup);

  export default {
    data() {
      return {
        winHeight: window.innerHeight,
        walletList: [],
        walletAddress: plus.storage.getItem("walletAddress"),
        walletName: plus.storage.getItem("walletName"),
        radio: plus.storage.getItem("walletAddress"),
        originWalletAddress: plus.storage.getItem("walletAddress"),
        showCreate: false,
        newWaletName: '',
        newWaletPassword: '',
      }
    },
    created() {
      let t = this;
      this.init();
      window.addEventListener("init", function (event) {
        t.init();
      });
    },
    methods: {
      getTokenImg(tokenAddress) {
        return getAddressImg(tokenAddress)
      },
      init() {
        let _this = this;
        request(TGCApiUrl.walletList).then(res => {
          _this.walletList = res;
        });
      },
      formatAddress(tokenAddress) {
        return tokenAddress.substring(0, 10) + '...' + tokenAddress.substring(32, tokenAddress.length);
      },
      doCreate() {
        request(TGCApiUrl.createWallet, {walletName: this.newWaletName, password: this.newWaletPassword}).then(res => {
          Dialog({message: "地址创建成功，地址" + res.walletAddress});
        })
      },
      createWallet() {
        this.showCreate = !this.showCreate;
      },
      reloadWebview() {
        setTimeout(() => {
          let ws = plus.webview.getWebviewById(cons.baseWebViewId);
          ws.reload();
        });
      },
      gotoImport() {
        openWebview({
          url: "./wallet.import.html",
          id: "wallet.import",
          title: "地址导入"
        });
      },
      gotoWalletInfo(walletAddress, walletName) {
        openWebview({
          url: "./wallet.walletInfo.html",
          id: "wallet.walletInfo",
          title: walletName
        }, {}, {
          walletAddress: walletAddress,
          walletName: walletName
        });
      }
    },
    watch: {
      radio() {
        if (this.radio !== plus.storage.getItem("walletAddress")) {
          plus.storage.setItem('walletAddress', this.walletAddress);
          plus.storage.setItem('walletName', this.walletName);
        }
      }
    }
  }


</script>
<style scoped>
  .gotoImport {
    margin-top: 5%;
    width: 94%;
    margin-left: 3%;
    margin-bottom: 5%;
    color: white;
  }

  .wallet-list {
    margin-left: 5%;
  }

  .wallet-list-label {
    margin-left: 5%;
  }
</style>

<template>
  <div class="body">
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
                  :title="item.walletName"
                  :label="item.walletAddress"
                  clickable
                  is-link
                  @click="gotoWalletInfo(item.walletAddress,item.walletName)"
        >
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
  import {Actionsheet} from 'vant';
  import {Icon} from 'vant';
  import {Dialog} from 'vant';
  import {Popup} from 'vant';
  import {Field} from 'vant';

  Vue.use(Field);
  Vue.use(Popup);
  Vue.use(Icon);
  Vue.use(Actionsheet);
  Vue.use(RadioGroup);
  Vue.use(Button);
  Vue.use(Radio);
  Vue.use(Cell);
  Vue.use(Toast);
  Vue.use(CellGroup);

  export default {
    data() {
      return {
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
        //通过event.detail可获得传递过来的参数内容
        t.init();
      });
    },
    methods: {
      init() {
        let _this = this;
        request(TGCApiUrl.walletList).then(res => {
          _this.walletList = res;
        });
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
        let wa = plus.nativeUI.showWaiting();
        setTimeout(() => {
          let ws = plus.webview.getWebviewById(cons.baseWebViewId);
          ws.reload();
          wa.close();
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
</style>

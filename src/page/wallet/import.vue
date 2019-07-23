<template>
  <div class="body">
    <div class="box text-left">
      <van-tabs v-model="selected">
        <van-tab id="keyStore" title="KeyStore导入">
          <div class="cotainer">
            <label>
              <div style="margin-left: 5%">请填写KeyStore</div>
              <textarea class="text" v-model="keyStore"></textarea>
            </label>
          </div>
          <van-field label="钱包名" v-model="walletName"></van-field>
          <van-button type="default" size="large" class="button" @click="importWalletFromKeyStore">下一步</van-button>

        </van-tab>
        <van-tab id="privateKey" title="私钥导入">
          <div class="cotainer">
            <van-field label="私钥" v-model="privateKey"></van-field>
            <van-field label="钱包名" v-model="walletName"></van-field>
            <van-button type="default" size="large" class="button" @click="importWalletFromPrivateKey">下一步</van-button>
          </div>
        </van-tab>
      </van-tabs>

      <van-dialog
        v-model="showKeyStorePassword"
        show-cancel-button
        :before-close="beforeKeyStoreClose"
      >
        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
        />
      </van-dialog>

      <van-dialog
        v-model="showPrivatePassword"
        show-cancel-button
        :before-close="beforePrivateClose"
      >
        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
        />
      </van-dialog>
    </div>

  </div>
</template>
<script>
  import Vue from 'vue';
  import {Tab, Tabs, Button, Field, Toast, Dialog} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import Web3Util from "../../utils/web3Util/Web3Util";

  Vue.use(Tab).use(Tabs).use(Button).use(Field).use(Dialog);

  export default {
    name: 'import_wallet',
    data() {
      return {
        selected: "keyStore",
        privateKey: "",
        keyStore: "",
        password: "",
        walletName: "",
        showKeyStorePassword: false,
        showPrivatePassword: false,
      };
    },
    methods: {
      beforeKeyStoreClose(action, done) {
        let _this = this;
        if (action === 'confirm') {
          _this.importByKeyStore(_this.password);
          done()
        } else {
          done();
        }
      },
      beforePrivateClose(action, done) {
        let _this = this;
        if (action === 'confirm') {
          _this.importByPrivate(_this.password);
          done();
        } else {
          done();
        }
      },
      importWalletFromKeyStore() {
        this.showKeyStorePassword = true;
      },
      importByKeyStore(password) {
        let keyStore = this.keyStore;
        let walletName = this.walletName;

        request(TGCApiUrl.checkPassword, {
          uid: plus.storage.getItem("uid"),
          password: password
        }).then(function (res) {
          if (!res.passwordSuccess) {
            Toast('密码不正确');
            throw new Error('password error');
          }

          Toast.loading({
            message: '正在导入钱包，请耐心等待...',
          });
          setTimeout(() => {
            let params = {
              uid: plus.storage.getItem("uid"),
              keyStore: keyStore,
              password: password,
              walletName: walletName,
            };
            request(TGCApiUrl.walletAdd, params).then(() => {
              Toast("钱包导入成功");
            });
          }, 200)
        });
      },
      importWalletFromPrivateKey() {
        this.showPrivatePassword = true;
      },
      importByPrivate(password) {
        let privateKey = this.privateKey;
        let walletName = this.walletName;

        request(TGCApiUrl.checkPassword, {
          uid: plus.storage.getItem("uid"),
          password: password
        }).then(function (res) {
          if (!res.passwordSuccess) {
            Toast('密码不正确');
            throw new Error('password error');
          }

          Toast.loading({
            message: '正在导入钱包，请耐心等待...',
          });
          setTimeout(() => {
            let keyStore = Web3Util.instance.eth.accounts.encrypt(privateKey, password);
            // let keyStore;
            // let Accounts = require('web3-eth-accounts');
            // let accounts = new Accounts(Vue.prototype.HOST + '/v3/d25de4d32b0f48a6bc289cfc7d50d7fd');
            // keyStore = accounts.encrypt(privateKey, password);


            if (typeof keyStore === 'undefined') {
              Toast.fail('导入失败，请重试。');
              return;
            }

            let address = keyStore.address;
            let params = {
              keyStore: JSON.stringify(keyStore),
              address: address,
              uid: plus.storage.getItem("uid"),
              walletName: walletName,
              password: password,
            };
            request(TGCApiUrl.walletAdd, params).then((res) => {
              if (isEmpty(res)) {
                Toast.fail("钱包导入失败");
                return false;
              }
              Toast.success("钱包导入成功");
              plus.webview.currentWebview().close();
            });
          }, 100);
        })
      }
    }
  }
</script>

<style scoped>

  .button {
    margin-top: 10%;
  }

  .text {
    width: 90%;
    height: 250px;
    margin-left: 5%;
    border: #1d9dd2 1px solid;
    margin-top: 5%;
  }

  .cotainer {
    margin-top: 10%;
    margin-bottom: 10%;
  }

</style>

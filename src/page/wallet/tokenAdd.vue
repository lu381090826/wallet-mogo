<template>
  <div style="padding: 3%">
    <div class="box">
      <div style="margin-top: 3%">
        <van-field placeholder="请输入要添加的合约地址" :border="true" v-model="tokenAddress"></van-field>
      </div>
      <div style="margin-top: 8%">
        推荐合约地址：
        <van-radio-group v-model="radio" @change="select">
          <van-cell-group>
            <van-cell v-for="(item,k) in commondTokenAddress"
                      :key="k"
                      :title="item.tokenName"
            >
              <van-radio
                :name="item"
              >
              </van-radio>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <van-button type="default" size="large" class="button button-blue" v-intervalclick="{func:addToken}">立即添加
      </van-button>
    </div>

    <div class="box">
      <div style="font-weight: bold;font-size: 20px;margin-bottom: 5%">
        已添加的合约
        <div style="float: right">
          <van-button size="small" @click="getTokenlist()">点击刷新
          </van-button>
        </div>
      </div>


      <div class="cell-group">
        <van-cell-group>
          <van-cell v-if="tokenList!=null && tokenList.length>0" v-for="(item,k) in tokenList" :key="k"
                    :title="item.tokenName"
                    :label="item.tokenAddressShow"
          >
            <van-switch size="18px"
                        v-model="item.status"
                        @input="onInput(item)"></van-switch>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {RadioGroup, Radio, Cell, CellGroup, Field, Button, Toast, Switch, SwitchCell, Icon, Dialog} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import Web3Util from "../../utils/web3Util/Web3Util";

  Vue.use(SwitchCell);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(Icon);
  Vue.use(Cell);
  Vue.use(CellGroup);
  Vue.use(Field);
  Vue.use(Button);
  Vue.use(Dialog);
  Vue.use(Switch);

  export default {
    data() {
      return {
        tokenAddress: "",
        tokenName: "",
        tokenListAdded: [],
        radio: null,
        tokenList: [
          {}
        ],
        commondTokenAddress: [
          {
            tokenName: Web3Util.tgName,
            tokenAddress: Web3Util.tgAddress,
          },
        ]
      }
    },
    created() {
      let _this = this;
      _this.getTokenlist();
    },
    methods: {
      getTokenlist() {
        let _this = this;
        Toast.loading();
        request(TGCApiUrl.walletTokenList).then(res => {
          _this.tokenList = res;
          Toast.clear();
        });
      },
      onInput(item) {
        let state = !item.status ? "隐藏" : "恢复显示";
        Dialog.confirm({
          title: '提醒',
          message: '是否该' + state + '合约？'
        }).then(() => {
          // on confirm
          Toast.loading();
          request(TGCApiUrl.updateToken, item).then(res => {
            Toast.clear();
          });
        }).catch(() => {
          item.status = !item.status;
        });
      },
      addToken() {
        let t = this;
        let params = {
          tokenAddress: t.tokenAddress,
          tokenName: t.tokenName
        };
        request(TGCApiUrl.addToken, params).then((res) => {
          let pw = plus.webview.getWebviewById('wallet.asset');
          plus.webview.show(pw, "auto", 200, res => {
            pw.reload(true);
            Toast('添加成功');
          });
        });
      },
      select(s) {
        this.tokenName = s.tokenName;
        this.tokenAddress = s.tokenAddress;
      }
    }
  }
</script>
<style scoped>
  .button {
    margin-top: 20%;
    width: 90%;
    margin-left: 5%;
  }
</style>

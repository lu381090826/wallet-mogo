<template>
  <div>
    <div style="margin-top: 3%">
      <van-field placeholder="请输入合约地址" v-model="tokenAddress"></van-field>
    </div>
    <div style="margin-top: 8%">
      <van-radio-group v-model="tokenAddress">
        <van-cell-group>
          <van-cell v-for="(item,k) in tokenList" :key="k" :title="item.tokenName" clickable
                    @click="select(item.tokenName,item.tokenAddress)">
            <van-radio :name="item.tokenAddress" :value="item.tokenAddress"></van-radio>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <van-button type="default" size="large" class="button" v-intervalclick="{func:addToken}">立即添加</van-button>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {RadioGroup, Radio, Cell, CellGroup, Field, Button, Toast} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";

  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(Cell);
  Vue.use(CellGroup);
  Vue.use(Field);
  Vue.use(Button);

  export default {
    data() {
      return {
        tokenAddress: "",
        tokenName: "",
        tokenList: [
          {
            tokenName: '感恩链（Tgc）',
            tokenAddress: '0xCc79Cb5023A4896547F4b00a2289d1ed4098Ce13',
          }
        ]
      }
    },
    methods: {
      addToken() {
        let t = this;
        request(TGCApiUrl.addToken, {
          tokenAddress: t.tokenAddress,
          tokenName: t.tokenName
        }).then((res) => {
          let pw = plus.webview.getWebviewById('wallet.asset');
          plus.webview.show(pw, "auto", 200, res => {
            pw.reload(true);
            Toast('添加成功');
          });
        });

      },
      select(tokenName, tokenAddress) {
        this.tokenAddress = tokenAddress;
        this.tokenName = tokenName;
      }
    }
  }
</script>
<style scoped>
  .button {
    background-color: orange;
    color: white;
    margin-top: 20%;
    width: 90%;
    margin-left: 5%;
  }
</style>

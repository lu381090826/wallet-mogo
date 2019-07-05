<!--购买tg人工审核-->
<template>
  <div style="padding: 2%">
    <div class="box">
      <van-cell-group>
        <van-cell>
          <van-field label="身份证"
                     type="text"
                     v-model="idcard"
                     placeholder="请输入身份证号码"
                     required clearable
          ></van-field>
        </van-cell>

        <van-cell>
          <van-field label="姓名"
                     type="text"
                     v-model="realname"
                     placeholder="请输入真实姓名"
                     required clearable
          ></van-field>
        </van-cell>

        <van-cell>
          <van-field label="联系电话"
                     type="text"
                     v-model="phone"
                     placeholder="请输入可联系您的电话"
                     required clearable
          ></van-field>
        </van-cell>
      </van-cell-group>
      <div style="margin-top: 6%;margin-bottom: 6%">
        <van-button class="button-blue" size="large" v-intervalclick="{func:submitAudit}">
          提交审核
        </van-button>
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import {Cell, CellGroup, Field, Dialog, Button, Toast} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";

  Vue.use(Cell)
    .use(CellGroup)
    .use(Field)
    .use(Button)
    .use(Dialog)
    .use(Toast);

  export default {
    data() {
      return {
        idcard: "",
        realname: "",
        phone: "",
      }
    },
    methods: {
      submitAudit() {
        request(TGCApiUrl.buyTgSubmitAudit, {
          idcard: this.idcard,
          realname: this.realname,
          contactPhone: this.phone
        }).then(res => {
          Dialog.alert({
            message: '您的申请已提交，1-3工作日内会有人工客服主动联系，请保持电话畅通。'
          }).then(() => {
            let ws = plus.webview.currentWebview();
            ws.close();
          })
        })
      }
    }
  }
</script>

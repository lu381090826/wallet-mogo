<template>
  <div>
    <!--&lt;!&ndash; 联系人卡片 &ndash;&gt;-->
    <!--<van-contact-card-->
    <!--:type="cardType"-->
    <!--:name="currentContact.name"-->
    <!--:tel="currentContact.tel"-->
    <!--/>-->
    <van-cell title="收货人：陆嘉冠" label="汇庭居203" value="185****4265" is-link clickable @click="gotoLinkman">
    </van-cell>
    <div class="orderConfirm-address"></div>

    <br>
    <van-cell-group>
      <van-panel title="标题" desc="描述信息" status="状态">
      </van-panel>
    </van-cell-group>

    <br>
    <van-cell-group>
      <van-cell title="配送方式" value="免运费"></van-cell>
    </van-cell-group>

    <br>
    <van-cell-group>
      <van-field label="商品备注" placeholder="建议下单前与客服沟通确认"></van-field>
    </van-cell-group>


    <van-submit-bar
      :price="3050"
      button-text="提交订单"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ContactCard, ContactList, ContactEdit, Popup, Button, Toast, Cell, CellGroup, Field} from 'vant';
  import {AddressList} from 'vant';
  import {Panel} from 'vant';
  import {SubmitBar} from 'vant';
  import {openWebview} from "../../utils/webview";

  Vue.use(SubmitBar);
  Vue.use(AddressList);
  Vue.use(Panel);
  Vue.use(Cell);
  Vue.use(Field);
  Vue.use(Toast);
  Vue
    .use(Popup)
    .use(CellGroup)
    .use(Button)
    .use(ContactCard)
    .use(ContactList)
    .use(ContactEdit);
  export default {
    data() {
      return {
        chosenContactId: null,
        editingContact: {},
        showList: false,
        showEdit: false,
        isEdit: false,
        linkmanList: [{
          name: '张三',
          tel: '13000000000',
          id: 0,
        }],
      };
    },

    methods: {
      onSubmit() {
        openWebview({
          url: './wallet.send.html',
          id: 'wallet.send',
          title: '收银台',
        });
      },
      gotoLinkman() {
        openWebview({
          url: './shop.linkman.html',
          id: 'shop.linkman',
          title: '联系人',
        })
      }
    },
    computed: {
      cardType() {
        return this.chosenContactId !== null ? 'edit' : 'add';
      },
      currentContact() {
        const id = this.chosenContactId;
        return id !== null ? this.list.filter(item => item.id === id)[0] : {};
      }
    }
  };
</script>
<style scoped>
  .orderConfirm-address {
    content: '';
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    /*position: absolute;*/
    background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    background-size: 80px;
  }
</style>

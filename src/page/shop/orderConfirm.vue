<template>
  <div>

    <van-cell-group>
      <van-cell v-if="linkman!=null" :title="linkman.name" :label="linkman.address" :value="linkman.phone" is-link
                clickable
                @click="gotoLinkman">
      </van-cell>
      <van-cell v-else title="收货地址" label="点击查看我的联系人" value="" is-link
                clickable
                @click="gotoLinkman">
      </van-cell>
    </van-cell-group>
    <div class="orderConfirm-address"></div>

    <br>
    <van-cell-group>
      <van-panel :title="goods.skuName" :desc="goods.buyNum" :status="goods.priceShow"></van-panel>
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
      :price="goods.price"
      :currency="goods.units"
      button-text="提交订单"
      @submit="onSubmit"
    ></van-submit-bar>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ContactCard, ContactList, ContactEdit, Popup, Button, Toast, Cell, CellGroup, Field} from 'vant';
  import {AddressList} from 'vant';
  import {Panel} from 'vant';
  import {SubmitBar} from 'vant';
  import {openWebview} from "../../utils/webview";
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import PayType from "../../utils/constants/PayType";
  import OrderType from "../../utils/constants/OrderType";
  import TGCConfig from "../../utils/constants/tgcConfig";
  import MathUtil from "../../utils/MathUtil";
  import {isEmptyObject, isNotEmpty, isNotEmptyObject} from "../../utils/globalFunc";
  import {fire} from "../../utils/envent";

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
        skuNo: "",
        chosenContactId: null,
        editingContact: {},
        showList: false,
        showEdit: false,
        isEdit: false,
        linkman: null,
        goods: {
          skuName: "",
          buyNum: "",
        },
        orderId: "",
      };
    },
    created() {
      let t = this;
      window.addEventListener("updateLinkman", function (event) {
        //通过event.detail可获得传递过来的参数内容
        t.linkman = event.detail;
      });

      let wb = plus.webview.currentWebview();
      this.skuNo = wb.skuNo;

      request(TGCApiUrl.goodsDetail, {skuNo: this.skuNo}).then(res => {
        this.goods = res;
        this.goods.buyNum = "x 1";
        this.goods.priceShow = res.price + res.units;
        this.goods.price = MathUtil.accMul(res.price, 100);
      });

      request(TGCApiUrl.shopLinkmanList, {skuNo: this.skuNo, defaultAddress: 1}).then(res => {
        if (isNotEmptyObject(res[0])) {
          this.linkman = res[0];
          this.linkman.phone = this.linkman.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
        }
      });

    },
    methods: {
      onSubmit() {
        if (isEmptyObject(this.linkman)) {
          Toast.fail('请选择联系人')
        }
        let params = {
          skuList: [{
            skuNo: this.skuNo,
            buyNum: 1,
          }],
          linkmanId: this.linkman.id,
          payType: PayType.eth_tg,
          memo: "测试",
        };
        request(TGCApiUrl.shopOrderCreate, params).then(res => {
          this.orderId = res;
          if (isNotEmpty(res)) {
            openWebview({
              url: './wallet.send.html',
              id: 'wallet.send',
              title: '收银台',
              needLoaded: true,
            }, {}, {
              orderId: this.orderId,
              orderType: OrderType.shop,
              tokenAddress: TGCConfig.tokenAddress,
            });
            fire(plus.webview.getWebviewById('shop.order'), 'init');
          }
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

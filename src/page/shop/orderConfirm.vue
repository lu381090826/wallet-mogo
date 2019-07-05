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
      <van-panel :title="goods.skuName" :desc="goods.buyNum" :status="priceShow()"></van-panel>
    </van-cell-group>

    <br>
    <van-cell-group>
      <van-cell title="配送方式" value="免运费"></van-cell>
    </van-cell-group>

    <br>
    <van-cell-group>
      <van-field label="商品备注" placeholder="建议下单前与客服沟通确认"></van-field>
    </van-cell-group>

    <br>
    <van-cell-group>
      <div style="padding-left: 5%;padding-top: 5%;font-size: 14px;border-top: 0.5px solid #fbfbfb;">
        购买方式
      </div>
      <div style="margin-top: 5%">
        <van-radio-group v-model="radio">
          <van-cell-group>

            <van-cell title="TG积分" @click="radio = '10'">
              <van-radio name="10"></van-radio>
            </van-cell>

            <van-cell title="法币" @click="radio = '20'">
              <van-radio name="20"></van-radio>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>

    </van-cell-group>


    <van-submit-bar
      :price="priceTotal()"
      :currency="getUnits()"
      button-text="提交订单"
      @submit="onSubmit"
    ></van-submit-bar>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    ContactCard,
    ContactList,
    Radio,
    RadioGroup,
    ContactEdit,
    Popup,
    Button,
    Icon,
    Toast,
    Cell,
    CellGroup,
    Field
  } from 'vant';
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
  Vue.use(Icon);
  Vue.use(Radio);
  Vue.use(RadioGroup);
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
        radio: PayType.eth_tg,
        chosenContactId: null,
        editingContact: {},
        showList: false,
        showEdit: false,
        isEdit: false,
        linkman: null,
        price: null,
        units: null,
        priceCn: null,
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
        this.goods.price = res.price.toFixed(2);
        this.goods.priceCn = res.originPriceCn.toFixed(2);

        this.price = this.goods.price;
        this.priceCn = this.goods.priceCn;
        this.units = res.units;
      });

      request(TGCApiUrl.shopLinkmanList, {skuNo: this.skuNo, defaultAddress: 1}).then(res => {
        if (isNotEmptyObject(res[0])) {
          this.linkman = res[0];
          this.linkman.phone = this.linkman.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
        }
      });

    },
    methods: {
      getUnits() {
        if (this.radio === PayType.eth_tg) {
          return this.units;
        } else if (this.radio === PayType.wxpay) {
          return "￥";
        }
      },
      priceTotal() {
        if (this.radio === PayType.eth_tg) {
          return MathUtil.accMul(this.price, 100);
        } else if (this.radio === PayType.wxpay) {
          return MathUtil.accMul(this.priceCn, 100);
        }
      },
      priceShow() {
        if (this.radio === PayType.eth_tg) {
          return this.price + this.getUnits()
        } else if (this.radio === PayType.wxpay) {
          return this.priceCn + this.getUnits()
        }
      },
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
          payType: this.radio,
          memo: "",
        };

        request(TGCApiUrl.shopOrderCreate, params).then(res => {
          this.orderId = res;


          if (isNotEmpty(res)) {
            if (this.radio === PayType.eth_tg) {
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
            } else if (this.radio === PayType.wxpay) {
              openWebview({
                url: './wallet.sendLegalCurrency.html',
                id: 'wallet.sendLegalCurrency',
                title: '收银台',
                needLoaded: true,
              }, {}, {
                orderId: this.orderId,
                orderType: OrderType.shop,
              });
            }
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

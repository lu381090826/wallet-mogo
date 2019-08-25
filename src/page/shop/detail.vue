<template>
  <div class="goods">
    <van-swipe class="goods-swipe" :autoplay="3000">
      <van-swipe-item>
        <img :src="goods.img">
      </van-swipe-item>
    </van-swipe>

    <van-cell-group>
      <van-cell>
        <div class="goods-title">{{ goods.skuName }}</div>
        <div class="goods-price">{{ formatPrice(goods.price) }}</div>
      </van-cell>
      <van-cell class="goods-express">
        <van-col span="10">运费：免运费</van-col>
        <van-col span="14">剩余：{{ goods.stock }}</van-col>
      </van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell>
        <div>{{goods.skuDetail}}</div>
      </van-cell>
    </van-cell-group>

    <van-goods-action>
      <van-goods-action-mini-btn icon="chat" @click="sorry">
        客服
      </van-goods-action-mini-btn>
      <van-goods-action-button primary @click="createOrder">
        立即购买
      </van-goods-action-button>
    </van-goods-action>

  </div>
</template>

<script>
  import {
    Tag,
    Dialog,
    Col,
    Icon,
    Cell,
    CellGroup,
    Swipe,
    Toast,
    SwipeItem,
    GoodsAction,
    GoodsActionButton
  } from "vant";

  import {fire} from "@/utils/envent.js";
  import {openWebview} from "@/utils/webview";
  import {request} from "@/utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";

  Vue
    .use(GoodsAction)
    .use(GoodsActionIcon)
    .use(GoodsActionButton);

  export default {
    components: {
      [Tag.name]: Tag,
      [Dialog.name]: Dialog,
      [Col.name]: Col,
      [Icon.name]: Icon,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
    },
    data() {
      return {
        goods: {
          skuNo: "",
          skuName: "",
          price: "",
          originPrice: "",
          sellNum: "",
          units: "",
          img: "",
          buyNum: "",
          skuDetail: "",
        },
      };
    },
    created() {
      let wb = plus.webview.currentWebview();
      this.skuNo = wb.skuNo;

      request(TGCApiUrl.goodsDetail, {skuNo: this.skuNo}).then(res => {
        this.goods = res;
      });

    },
    methods: {
      createOrder() {
        let skuNo = this.skuNo;
        openWebview({
          id: 'shop.orderConfirm',
          url: './shop.orderConfirm.html',
          title: '确认订单',
          needLoaded: true,
        }, {}, {
          skuNo: skuNo,
        })
      },
      formatPrice() {
        return "" + (this.goods.price) + this.goods.units;
      },
      addToCart() {
        Toast('加入购物车成功');
      },
      onClickCart() {
        openWebview(
          {
            id: 'shop.cart',
            url: './shop.cart.html',
            title: '我的购物车',
          }
        )
      },
      sorry() {
        Dialog.alert({
          title: '联系客服',
          message: '尊敬的用户，如有任何疑问请邮件至381090826@qq.com'
        }).then(() => {
          // on close
        });
      }
    }
  };
</script>

<style lang="less">

  .goods {
    overflow-y: scroll;
    padding-bottom: 50px;
    &-swipe {
      img {
        width: 100%;
        // height: 7.5rem;
        display: block;
      }
    }
    &-title {
      font-size: 16px;
    }
    &-price {
      color: #f44;
    }
    &-express {
      color: #999;
      font-size: 12px;
      padding: 5px 15px;
    }
    &-cell-group {
      margin: 15px 0;
      .van-cell__value {
        color: #999;
      }
    }
  }
</style>

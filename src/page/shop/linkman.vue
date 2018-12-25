<template>
  <div>
    <van-cell-group>
      <van-cell title="添加联系人" value="" is-link
                clickable
                @click="addButton"
      >
        <div slot="icon" class="add-icon">
          <van-icon name="add-o" size="40px" color="#1E90FF"></van-icon>
        </div>
      </van-cell>
    </van-cell-group>
    <div class="orderConfirm-address-linkman"></div>

    <van-cell-group>
      <van-cell v-if="linkmanList!==null"
                v-for="(item,k) in linkmanList"
                :key="k"
                :title="item.name+item.phone"
                :label="item.provinceName+item.cityName+item.countyName+item.address"
                @click="selectLinkman(item)"
      >
        <div slot="right-icon" style="margin-left: 5%">
          <van-icon name="edit" size="20px" @click="editLinkman(item.id)"></van-icon>
        </div>
      </van-cell>
    </van-cell-group>


  </div>
</template>

<script>
  import Vue from 'vue';
  import {Cell, CellGroup, Icon, Field, Button, Toast} from 'vant';
  import {Popup} from 'vant';
  import {openWebview} from "../../utils/webview";
  import {request} from "../../utils/request";
  import TGCConfig from "../../utils/constants/tgcConfig";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {fire} from "../../utils/envent";

  Vue.use(Popup);
  Vue.use(Icon)
    .use(Button)
    .use(Field)
    .use(Cell)
    .use(CellGroup);

  export default {
    data() {
      return {
        showAddFrom: false,
        areaList: [],
        searchResult: [],
        linkmanList: null,
      };
    },
    created() {
      let t = this;
      window.addEventListener("init", function (event) {
        //通过event.detail可获得传递过来的参数内容
        t.init();
      });

      this.init()
    },
    methods: {
      selectLinkman(obj) {
        obj.phone = obj.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
        fire(plus.webview.getWebviewById("shop.orderConfirm"), 'updateLinkman', obj);
        plus.webview.currentWebview().close();
      },
      editLinkman(id) {
        openWebview({
          url: "./shop.linkmanAdd.html",
          id: "shop.linkmanAdd",
          title: "编辑联系人",
        }, {}, {linkmanId: id})
      },
      addButton() {
        openWebview({
          url: "./shop.linkmanAdd.html",
          id: "shop.linkmanAdd",
          title: "添加联系人",
        }, {}, {newWebview: true})
      },
      init() {
        Toast.loading();
        request(TGCApiUrl.shopLinkmanList).then(res => {
          Toast.clear();
          this.linkmanList = res;
        })
      }
    }
  };
</script>
<style scoped>
  .add-icon {
    margin-right: 2%;
  }

  .orderConfirm-address-linkman {
    content: '';
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    background-size: 80px;
  }

  .add-linkman-box {
    /*padding: 3%;*/
    width: 500px;
    /*height: 200px;*/
  }
</style>

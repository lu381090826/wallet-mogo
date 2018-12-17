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
      };
    },
    created() {
      window.addEventListener("customEvent", function (event) {
        //通过event.detail可获得传递过来的参数内容
        plus.nativeUI.toast("我是首页,我很慌,我收到了信息");
        console.log(event);
      });
      this.init()
    },
    computed: {},

    methods: {
      addButton() {
        openWebview({
          url: "./shop.linkmanAdd.html",
          id: "shop.linkmanAdd",
          title: "添加联系人",
        })
      },
      init() {
        Toast.loading();
        request(TGCApiUrl.shopLinkmanList).then(res => {
          console.log(res);
          Toast.clear();
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

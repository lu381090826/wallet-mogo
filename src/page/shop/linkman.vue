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
  import {Cell, CellGroup, Icon, Field, Button} from 'vant';
  import {Popup} from 'vant';
  import {openWebview} from "../../utils/webview";

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

    computed: {},

    methods: {
      addButton() {
        openWebview({
          url: "./shop.linkmanAdd.html",
          id: "shop.linkmanAdd",
          title: "添加联系人",
        })
      },
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

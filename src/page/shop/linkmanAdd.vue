<template>
  <div>
    <van-address-edit
      :area-list="areaList"
      show-postal
      show-delete
      show-set-default
      show-search-result
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
  import Vue from 'vue';
  import area from '../../utils/constants/Area';
  import {AddressEdit, Toast} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {fire} from "../../utils/envent";

  Vue.use(AddressEdit);

  export default {
    data() {
      return {
        areaList: area,
        searchResult: [],
      };
    },

    computed: {},

    methods: {
      onSave(content) {
        request(TGCApiUrl.shopLinkmanAdd, content).then(res => {
          Toast('保存成功');
          fire(plus.webview.getWebviewById("shop.linkman"), 'init');
          plus.webview.currentWebview().close();
        })
      },
      onDelete() {
        plus.webview.currentWebview().close();
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

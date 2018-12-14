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
      @change-detail="onChangeDetail"
    />
  </div>
</template>

<script>
  import Vue from 'vue';
  import area from '../../utils/constants/Area';
  import {AddressEdit, Toast} from 'vant';

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
      onSave() {
        Toast('save');
      },
      onDelete() {
        Toast('delete');
      },
      onChangeDetail(val) {
        if (val) {
          this.searchResult = [{
            name: '黄龙万科中心',
            address: '杭州市西湖区'
          }];
        } else {
          this.searchResult = [];
        }
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

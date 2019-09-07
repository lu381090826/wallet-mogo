<template>
  <div>
    <div style="max-height: 200px;">
      <van-cell-group>
        <van-cell v-for="(item,k) in walletList" :key="k"
                  :title="item.walletName"
                  clickable
                  @click="set(item.walletAddress, item.walletName)"
                  :label="subString(item.walletAddress)"
                  :style="{backgroundColor: getColor(item.walletAddress)}"
        >
        </van-cell>
      </van-cell-group>
    </div>

  </div>
</template>
<script>
  export default {
    name: 'HomePop',
    props: {
      walletAddress: String,
      walletList: {}
    },
    methods: {
      set(walletAddress, walletName) {
        this.$emit('set', walletAddress, walletName);
      },
      subString(value) {
        if (Number(value) === 0) {
          return value;
        }
        return value.toString().substring(0, 8) + "..";
      },
      getColor(walletAddress) {
        if (walletAddress === this.walletAddress) {
          return "#efefef";
        } else {
          return "white";
        }
      },
    }
  }
</script>
<style scoped>

  .gongyi-box > img {
    border-radius: 3px;
    width: 100%;
    height: 115px;
  }

  .gotoImport {
    margin-top: 30%;
    width: 94%;
    margin-left: 3%;
    margin-bottom: 5%;
  }

</style>

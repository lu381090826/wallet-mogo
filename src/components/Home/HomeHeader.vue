<template>
  <div class="asset-header">
    <van-row type="flex" justify="end">
      <van-col span="12">
      </van-col>
      <van-col span="12" v-intervalclick="{func:config}">
        <div style="margin-left: 80%">
          <van-icon name="wap-nav" size="20px"></van-icon>
        </div>
      </van-col>
    </van-row>
    <van-row gutter="20" type="flex" justify="center">
      <van-col span="10">
        <div class="asset-header-titile" v-intervalclick="{func:trans}">
          <div class="titile-name">Eth</div>
          <div :style="{fontSize: '16px'}">
            {{walletBalance}}
            <div class="minbalance"> {{walletBalanceRMB}}</div>
          </div>
        </div>
      </van-col>
      <van-col span="10">
        <div class="asset-header-titile" v-intervalclick="{func:tgTrans}">
          <div class="titile-name">TG</div>
          <div :style="{fontSize: '16px'}">
            {{tokenBalance}}
            <div class="minbalance"> {{tokenBalanceRMB}}</div>
          </div>
        </div>
      </van-col>
    </van-row>
  </div>
</template>
<script>
  export default {
    name: 'HomeHeader',
    props: {
      config: {},
      tgTrans: {},
      tokenBalance: {},
      tokenBalanceRMB: {},
      trans: {},
      walletBalance: {},
      walletBalanceRMB: {}
    }
  }
</script>
<style scoped>

  .asset-header {
    width: 100%;
    background-image: -webkit-linear-gradient(top, #3a90e0, #3677c1);
    height: 10%;
    min-height: 100px;
    border-bottom: 1px solid #e5e5e5;
    color: white;
  }

  .asset-header-titile {
    font-weight: bold;
    font-size: 30px;
    color: white;
    margin-top: 15%;
    margin-bottom: 10%;
  }

  .titile-name {
    font-size: 13px;
  }

  .gongyi-box > img {
    border-radius: 3px;
    width: 100%;
    height: 115px;
  }

  .minbalance {
    font-size: 12px;
  }
</style>

<template>
  <div class="body">
    <div class="box" style="min-height: 280px">
      <div style="margin-top: 10%">
        <img src="../../../static/gongyilanwordlogo.png">
      </div>
      <div>
        <qrcode-vue :value="homePage" :size="100" style="margin-top: 5%" level="H"></qrcode-vue>
        <div class="about-dec">
          扫码二维码，您的朋友也可以下载感恩链客户端！
        </div>
      </div>
    </div>

    <div class="bottom-text">
      <div>
        Copyright@2019.3.1
      </div>
      <div>
        创江thanksgiving.xin 版权所有
      </div>
    </div>
  </div>
</template>
<script>
  import QrcodeVue from 'qrcode.vue'

  export default {
    data() {
      return {
        homePage: "http://www.thanksgiving.cn"
      }
    },
    components: {
      QrcodeVue
    }
  };
</script>
<style type="text/css">
  .about-dec {
    color: #575757;
    font-size: 12px;
    margin-top: 5%;
  }

  .bottom-text {
    margin-top: 10%;
    color: darkgray;
    font-size: 12px;
  }
</style>

<template>
  <div class="body yaoqing-body" :style="{backgroundImage:'url(' + backgroundImg + ')'}">
    <div>
      <div class="bg">
      </div>
      <div class="button-area">
        <van-button size="large" type="default" v-intervalclick="{func:showShare}">
          分享朋友送0.1TG
        </van-button>
      </div>
    </div>
    <van-popup
      v-model="popupVisible"
      position="bottom">
      <div class="shareBox" v-intervalclick="{func:shareWeixinMessage}">
        <div>
          <van-icon name="we-chat"/>
        </div>
        分享给微信朋友
      </div>
    </van-popup>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {Popup, Icon, Toast, Button} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";

  Vue.use(Icon)
    .use(Popup)
    .use(Button)
    .use(Toast);

  export default {
    name: 'share',
    data() {
      return {
        shareUrl: "",
        sharewx: "",
        popupVisible: false,
        backgroundImg: "http://120.79.191.116/static/img/62.png",
      };
    },
    methods: {
      showShare() {
        let _this = this;
        _this.popupVisible = true;
        plus.nativeUI.toast('plus 已加载');
        plus.share.getServices(function (s) {
          for (let i in s) {
            if ('weixin' === s[i].id) {
              _this.sharewx = s[i];
            }
          }
        }, function (e) {
          Toast("获取分享服务列表失败：" + e.message);
        });

      },
      shareWeixinMessage() {
        let _this = this;
        let content = {
          title: "邀请好友，赚取TG",
          content: "下载即可奖励0.1TG",
          href: _this.shareUrl,
          thumbs: ["http://120.79.191.116/static/img/aixin.jpg"],
          extra: {scene: "WXSceneSession"}
        };
        _this.sharewx.send(content, function () {
          Toast("分享成功！");
        }, function (e) {
          Toast("分享失败：" + e.message);
        });
      },
    }
  }
</script>
<style scoped>
  .bg {
    margin-top: 80px;
    width: 100%;
    margin-bottom: 200px;
  }

  .shareBox {
    width: 500px;
    padding-top: 5%;
    padding-bottom: 5%;
  }

  .yaoqing-body {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    background-color: pink;
    min-height: 640px;
  }

  .button-area {
    position: fixed;
    bottom: 10%;
  }
</style>


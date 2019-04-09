<template>
  <div class="body yaoqing-body">
    <div>
      <img src="../../../static/yaoqing.png" width="100%">
      <div class="button-area">
        <van-button size="large"
                    type="default"
                    class="fenxiang"
                    v-intervalclick="{func:showShare}">
          立即分享
        </van-button>
      </div>
    </div>
    <van-popup
      v-model="popupVisible"
      position="bottom">
      <div class="shareBox" v-intervalclick="{func:shareWeixinMessage}">
        <div>
          <van-icon name="wechat" color="#00cc24" size="30px"/>
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
        shareUrl: "http://www.thanksgiving.cn/",
        sharewx: "",
        popupVisible: false,
      };
    },
    methods: {
      showShare() {
        let _this = this;
        _this.popupVisible = true;
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
          title: "区块链公益平台",
          content: "积分购手机享9.5折",
          href: _this.shareUrl,
          type: "web",
          thumbs: ["http://www.thanksgiving.cn/static/img/gongyilogo.png"],
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
    width: 100%;
    padding-top: 5%;
    padding-bottom: 5%;
    text-align: center;
  }

  .yaoqing-body {
    background-repeat: no-repeat;
    background-size: 545px 725px;
    -moz-background-size: 545px 725px;
    /*height: 765px;*/
    /*width: 545px;*/
    background-color: white;
  }

  .fenxiang {
    margin-top: 8%;
    width: 80%;
    height: 45px;
    border: 1px solid;
    border-radius: 6px;
    color: #ffffff;
    cursor: pointer;
    font-size: 16px;
    vertical-align: top;
    background: -webkit-linear-gradient(left top, #54B8F4, #5C78EB);
    background: -o-linear-gradient(bottom right, #54B8F4, #5C78EB);
    background: -moz-linear-gradient(bottom right, #54B8F4, #5C78EB);
    background: linear-gradient(to bottom right, #54B8F4, #5C78EB);
  }
</style>


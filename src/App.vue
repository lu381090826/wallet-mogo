<template>
  <div id="app">
  </div>
</template>
<script>
  import Vue from "vue";
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {request} from "@/utils/request";
  import {openWebviewFast, preLoad, showWebviewById} from "@/utils/webview";
  import {isNotEmpty} from "@/utils/globalFunc";
  import Login from "@/components/Login";
  import Index from "@/components/Index";
  import {isEmpty} from "./utils/globalFunc";
  import cons from "./utils/constants/Cons";
  import {openWebview} from "./utils/webview";
  import {isIos} from "./utils/tools";

  export default {
    data() {
      return {
        logined: false
      }
    },
    beforeCreate() {
      if(isIos()){
        let w = plus.webview.currentWebview();
        w.setStyle({statusbar: {background: "#3a90e0"}});
      }

      let _this = this;
      console.log(":::::::::::::::::::::start::::::::::::::::::::::");
      if (isEmpty(plus.storage.getItem('uid')) || isEmpty(plus.storage.getItem('token'))) {
        plus.storage.clear();
        openWebview({url: cons.loginViewUrl, id: cons.loginViewId, noTitle: true});
      } else {
        request(TGCApiUrl.checkLogin).then(res => {
          if (isNotEmpty(res.state) && res.state === 100) {
            _this.logined = true;
            const component = Vue.extend(Index);
            const instance = new component();
            instance.$mount("#app");
            plus.webview.currentWebview().setStyle({
              scrollIndicator: "none",
              statusBarBackground: "#3a90e0",
            });
          } else {
            plus.storage.clear();
            openWebview({url: cons.loginViewUrl, id: cons.loginViewId, noTitle: true});
          }
        });
      }
    },
    components: {
      Login, Index
    }
  }
</script>

<style lang="less">
  :global {
    body {
      background-color: white;
      -webkit-font-smoothing: antialiased;
      font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
      overflow-x: hidden;
    }
  }
</style>

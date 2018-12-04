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

  export default {
    data() {
      return {
        logined: false
      }
    },
    beforeCreate() {
      let _this = this;
      console.log("start");
      if (isEmpty(plus.storage.getItem('uid')) || isEmpty(plus.storage.getItem('token'))) {
        const component = Vue.extend(Login);
        const instance = new component();
        instance.$mount("#app");
      } else {
        request(TGCApiUrl.checkLogin).then(res => {
          if (isNotEmpty(res.state) && res.state === 100) {
            _this.logined = true;
            const component = Vue.extend(Index);
            const instance = new component();
            instance.$mount("#app");
          } else {
            plus.storage.clear();
            const component = Vue.extend(Login);
            const instance = new component();
            instance.$mount("#app");
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

<template>
  <div>
  </div>
</template>
<script>
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {request} from "@/utils/request";
  import {openWebviewFast, preLoad, showWebviewById} from "@/utils/webview";
  import Cons from "@/utils/constants/Cons";

  export default {
    beforeCreate() {
      preLoad([{
        url: Cons.loginViewUrl,
        id: Cons.loginViewId,
        title: "",
        backgroundColor: "#FFFFFF",
        titleColor: "#FFFFFF",
        autoBackButton: false,
        splitLine: "#FFFFFF",
      }]);

      if (plus.storage.getItem('uid') === null) {
        showWebviewById(Cons.loginViewId)
      } else {
        preLoad([{
          url: Cons.loginViewUrl,
          id: Cons.loginViewId,
          title: "",
          noTitle: true,
        }]);
        request(TGCApiUrl.checkLogin).then(res => {
          console.log(res.state);
          if (res.state !== 100) {
            showWebviewById(Cons.loginViewId);
          } else {
            openWebviewFast(Cons.homeViewUrl, Cons.homeViewId, false);
          }
        });
      }
    }, methods: {
      checkLogin() {

      }
    }
  }
</script>

<style lang="less">
  :global {
    body {
      background-color: #f8f8f8;
      -webkit-font-smoothing: antialiased;
      font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
      overflow-x: hidden;
    }
  }
</style>

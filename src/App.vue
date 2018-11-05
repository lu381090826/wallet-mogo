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
      plus.nativeUI.showWaiting();
      preLoad([{
        url: Cons.loginViewUrl,
        id: Cons.loginViewId,
        title: "",
        noTitle: true,
      }]);
      if (plus.storage.getItem('uid') === null) {
        showWebviewById(Cons.loginViewId)
      } else {
        request(TGCApiUrl.checkLogin).then(res => {
          if (res.state !== 100) {
            showWebviewById(Cons.loginViewId);
          } else {
            openWebviewFast({url: Cons.homeViewUrl, id: Cons.homeViewId, noTitle: true, showWaiting: true});
          }
        }).finally(e => {
        });
      }
    },
    mounted() {
      plus.nativeUI.closeWaiting();
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

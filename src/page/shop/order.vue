<template>
  <div>

  </div>
</template>

<script>
  import cart from '@/components/Cart'
  import {isNotEmptyObject} from "../../utils/globalFunc";

  export default {
    components: {
      cart
    },
    created() {
      plus.key.addEventListener('backbutton', function () {
        let parent = plus.webview.currentWebview().parent();
        if (isNotEmptyObject(parent)) {
          parent.close();
        }
      })
    }
  }
</script>

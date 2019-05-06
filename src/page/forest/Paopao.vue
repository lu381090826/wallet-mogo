<template>
  <div :style="{top:y,left:x,animationDelay:animationDelay}" :class="paoClass" v-intervalclick="{func:paoClick}">
    <div class="pao-text">{{weight}} Tg</div>
  </div>
</template>
<style>

  @keyframes float-qiu {
    from {
      transform: translate(0, 0)
    }
    to {
      transform: translate(0, 16px)
    }
  }

  @keyframes qiu {
    0% {
      opacity: 1;
      transform: translate3d(0, 0px, 0);
      -webkit-transform: translate3d(0, 0px, 0);
    }
    10% {
      transform: translate3d(0, 30px, 0);
      -webkit-transform: translate3d(0, 30px, 0);
    }
    20% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      -webkit-transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(200px, 200px, 0);
      -webkit-transform: translate3d(200px, 200px, 0);
      opacity: 0;
    }
  }

  @keyframes qiu {
    0% {
      opacity: 1;
      transform: translate3d(0, 0px, 0);
      -webkit-transform: translate3d(0, 0px, 0);
    }
    10% {
      transform: translate3d(0, 30px, 0);
      -webkit-transform: translate3d(0, 30px, 0);
    }
    20% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      -webkit-transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(200px, 200px, 0);
      -webkit-transform: translate3d(200px, 200px, 0);
      opacity: 0;

    }

  }

  .qiu {
    background: url("../../../static/forest/image/qiu.png");
    width: 150px;
    height: 148px;
    background-size: 50px 50px;
    background-repeat: no-repeat;
    position: relative;
  }

  .animation {
    animation: qiu 1.5s linear;
    -webkit-animation: qiu 1.5s linear;
    animation-fill-mode: forwards;
  }

  .float-animation {
    animation: float-qiu 1.3s ease-in-out infinite alternate;
  }

  .pao-text {
    padding-left: 10px;
    padding-top: 12px;
    color: #00b004;
    font-weight: bold;
  }
</style>
<script>
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {isEmpty} from "../../utils/globalFunc";

  export default {
    name: 'paopao',
    data() {
      return {
        paoClass: "qiu float-animation",
        loading: 0,
      }
    },
    props: {
      weight: Number,
      x: String,
      y: String,
      animationDelay: String,
    },
    methods: {
      paoClick() {
        let t = this;
        if (this.loading === 1) {
          setTimeout(() => {
            t.loading = 0;
          }, 300);
          return;
        } else {
          this.loading = 1;
        }

        request(TGCApiUrl.forestCollect, {energy: this.weight, walletAddress: plus.storage.getItem("walletAddress")}).then(res => {
          //采集能量
          this.paoClass = "qiu animation";
          if (!isEmpty(res)) {
            this.$emit('reflash');
            this.loading = 0;
          }
        });
      }
    }

  }
</script>


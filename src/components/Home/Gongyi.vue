<template>
  <div>
    <div class="area-title">
      <div class="area-tag"></div>
      公益捐助，传递爱心
    </div>
    <div class="area">
      <van-row type="flex" justify="center" gutter="10">
        <van-col span="11">
          <div class="gongyi-box" @click="toDonation('1')">
            <img :src="img1">
            <div class="gongyi-box-title">
              <span>让山区孩子温暖过冬</span>
            </div>
            <div class="box-de">
              已有<span class="box-de-num">1,003</span>人捐助
            </div>
          </div>
        </van-col>
        <van-col span="11">
          <div class="gongyi-box" @click="toDonation('2')">
            <img :src="img2">
            <div class="gongyi-box-title">
              <span>给无助病人带来希望</span>
            </div>
            <div class="box-de">
              已有<span class="box-de-num">2,326</span>人捐助
            </div>
          </div>
        </van-col>
      </van-row>
      <div class="seemore" v-intervalclick="{func:one2one}">
        <div class="seemore-inner">
          <van-row type="flex" justify="space-between">
            <van-col>查看更多公益活动</van-col>
            <van-col>
              <van-icon name="arrow"></van-icon>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Gongyi',
    props: {},
    data() {
      return {
        img1: "http://www.thanksgiving.cn/static/img/29c0db75a70929c60f2c0a47a3c8a3f0.jpeg",
        img2: "http://www.thanksgiving.cn/static/img/wuzhubingren.png",
      }
    },
    methods: {
      one2one() {
        openWebviewFast({
          url: './charitable.one2one.html',
          id: 'charitable.one2one',
          titleStyle: {
            titleText: "一帮一",
            titleColor: "#ffffff",
            backgroundColor: "#ffa500",
            splitLine: {color: "#ffa500"},
          }
        });
      },
    }
  }
</script>
<style scoped>

  .area {
    padding-top: 3%;
    padding-bottom: 3%;
    width: 100%;
    color: black;
    text-align: center;
    background-color: white;
  }

  .gongyi-box {
    background-color: white;
    padding: 5%;
  }

  .gongyi-box > img {
    border-radius: 3px;
    width: 100%;
    height: 115px;
  }

  .gongyi-box-title {
    text-align: left;
    font-size: 15px;
    font-weight: bold;
    color: black;
  }

  .box-de {
    text-align: left;
    font-size: 13px;
    color: #8e8e8e;
    margin-bottom: 5%;
  }

  .area-title {
    background-color: white;
    border-bottom: 1px solid #fafafa;
    color: black;
    font-size: 13px;
    padding-left: 15px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .area-tag {
    margin-top: 2px;
    width: 4px;
    height: 14px;
    background-color: #3a81d1;
    float: left;
    border-radius: 1px;
    margin-right: 5px;
  }

  .seemore {
    font-size: 13px;
    color: #595959;
    padding-left: 3%;
    padding-right: 3%;
  }

  .seemore-inner {
    border-top: 1px solid #fafafa;
    padding-top: 3%;
  }

  .box-de-num {
    color: orange;
  }

</style>

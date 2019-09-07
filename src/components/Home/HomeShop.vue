<template>
    <div>
        <div class="area-title">
            <div class="area-tag"></div>
            TG特惠
        </div>
        <div class="area" style="padding-top: 5%;" v-intervalclick="{func:goodsList}">
            <van-row type="flex" justify="center">
                <van-col span="8" v-for="(item,k) in goods" :key="k">
                    <div class="hot-sell-img">
                        <img :src="item.imgSmall" width="48px"/>
                    </div>
                </van-col>
            </van-row>
            <van-row type="flex" justify="center">
                <van-col span="8" v-for="(item,k) in goods" :key="k">
                    <div class="hot-sell-title">
                        {{item.simpleName}}
                    </div>
                </van-col>
            </van-row>
            <van-row type="flex" justify="center">
                <van-col span="8" v-for="(item,k) in goods" :key="k">
                    <div class="hot-sell-price">
                        热卖价<span class="hot-sell-price-num">{{item.price.toFixed(2)}}{{item.units}}</span>
                        <div>
                            <span class="hot-sell-price-num-cn">{{item.originPriceCn}}￥</span>
                        </div>
                    </div>
                </van-col>
            </van-row>
            <div class="seemore" style="padding-top: 5%" v-intervalclick="{func:goodsList}">
                <div class="seemore-inner">
                    <van-row type="flex" justify="space-between">
                        <van-col>去商城看看</van-col>
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
        name: 'HomeShop',
        props: {
            goods: {},
            goodsList: {}
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

    .gongyi-box > img {
        border-radius: 3px;
        width: 100%;
        height: 115px;
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

    .hot-sell-title {
        font-size: 12px;
        font-weight: bold;
    }

    .hot-sell-price {
        margin-top: 3%;
        font-size: 12px;
        color: #8e8e8e;
        bottom: 0;
    }

    .hot-sell-price-num {
        color: red;
    }

    .hot-sell-price-num-cn {
        color: gray;
    }

</style>
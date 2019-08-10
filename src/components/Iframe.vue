<template>
  <div>

  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
    created() {
    },
    filters: {
      formatAddress(val) {
        return val.substring(0, 6) + '...' + val.substring(val.length - 6, val.length);
      }
    },
    methods: {
      showWalletQcode() {
        this.walletQcode = !this.walletQcode;
      },
      doCopy() {
        let _this = this;
        _this.$copyText(_this.walletAddress).then(function (e) {
          Toast.success({
            message: '地址复制成功',
            position: 'bottom',
          })
        }, function (e) {
        })
      },
      set(walletAddress, walletName) {
        this.walletAddress = walletAddress;
        this.walletName = walletName;
        this.onRefresh();
      },
      getColor(walletAddress) {
        if (walletAddress === this.walletAddress) {
          return "#efefef";
        } else {
          return "white";
        }
      },
      walletConfig() {
        openWebview({
          url: "./wallet.walletConfig.html",
          id: "wallet.walletConfig",
          title: "钱包设置",
        });
      },
      profit() {
        openWebview(
          {
            url: "./profit.index.html",
            id: "profit.index",
            needLoaded: true,
            titleStyle: {
              titleText: "持币矿",
              titleColor: "#ffffff",
              backgroundColor: "#fa5b21",
              autoBackButton: true,
              progress: {color: '#ff5c0a', height: "1%"},
            },
            style: {render: true}
          })
      },
      subString(value) {
        if (Number(value) === 0) {
          return value;
        }
        return value.toString().substring(0, 8) + "..";
      },
      trans(tokenAddress) {
        let _this = this;
        openWebview({
          url: './wallet.trans.html',
          id: "wallet.trans",
          title: "交易详情",
          needLoaded: true,
        }, {}, {
          walletAddress: _this.walletAddress,
          tokenAddress: tokenAddress,
        })
      },
      addToken() {
        openWebview({
          url: "./wallet.tokenAdd.html",
          id: "wallet.tokenAdd",
          title: "合约管理",
        })
      },
      send() {
        openWebview({
          url: "./wallet.send.html",
          id: "wallet.send",
          titleStyle: {
            titleText: "转账",
            autoBackButton: true,
            progress: {color: '#ff5c0a', height: "1%"},
          }
        });
      },
      receive() {
        openWebview({
          url: "./wallet.receive.html",
          id: "wallet.receive",
          title: "收款"
        });
      },
      config() {
        this.showWalletConfig = true;
      },
      onRefresh() {
        let _t = this;
        this.showWalletConfig = false;
        let ws = plus.nativeUI.showWaiting();
        setTimeout(() => {
          _t.isLoading = false;
          _t.init();
          ws.close();
        }, 500);
      },
      getWalletList() {
        let _this = this;
        request(TGCApiUrl.walletList).then(res => {
          _this.walletList = res;
        });
      },
      init() {
        let _this = this;

        _this.walletBalance = '-';

        _this.getWalletList();

        Web3Util.getBalance(_this.walletAddress).then(res => {
          _this.walletBalance = res;
        });

        request(TGCApiUrl.walletTokenList, {status: true}).then(res => {
          _this.tokenList = [];
          if (res.length != null) {
            let arr = [];

            for (let i = 0; i < res.length; i++) {
              res[i].tokenAddressShow = res[i].tokenAddress.substring(0, 10) + "...";
              _this.tokenList.push(res[i])
              // Web3Util.getContractBalance(res[i].tokenAddress, _this.walletAddress).then(contractBalance => {
              //   res[i].tokenBalance = contractBalance;
              //   res[i].tokenAddressShow = res[i].tokenAddress.substring(0, 10) + "...";
              //   _this.tokenList.push(res[i])
              // });
            }
          }
        });

        request(TGCApiUrl.getProgitInfo, {walletAddress: _this.walletAddress}).then(function (res) {
          _this.totalProfit = res.totalProfit;
        });

      },
    }
  }


</script>
<style scoped>
  .top {
    width: 100%;
    padding-top: 10%;
    background-color: #3a90e0;
    text-align: center;
    color: white;
    padding-bottom: 1%;
  }

  .pull-refresh {
    background-color: #3a90e0;
    color: white;
    height: 100%;
  }

  .asset-header {
    width: 100%;
    background-color: #fafafa;
    height: 10%;
    min-height: 100px;
    background-image: -webkit-linear-gradient(top, #3a90e0, #3a81d1);
  }

  .asset-header-titile {
    font-weight: bold;
    font-size: 18px;
    color: white;
    margin-top: 15%;
    margin-bottom: 10%;
  }

  .titile-name {
    font-size: 13px;
  }

  .cell-group {
    min-height: 500px;
    background-color: white;
  }

  .asset-number {
    font-size: 11px;
  }
</style>

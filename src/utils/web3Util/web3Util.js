import Web3 from "web3";
import abi from "./abi";

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://rinkeby.infura.io/v3/d25de4d32b0f48a6bc289cfc7d50d7fd'));
// web3.setProvider(new web3.providers.HttpProvider(RINKEBYAPI));


let Web3Util = {
  instance: web3,
  getBalance: function () {
    let instance = this.instance;
    return new Promise(function (resolve) {
      let walletAddress = plus.storage.getItem('walletAddress');
      let balance = 0;
      if (walletAddress) {
        balance = instance.eth.getBalance(walletAddress);
      }
      resolve(Number(web3.fromWei(balance, 'ether')));
    });
  },
  getTokenContact: function (tokenAddress) {
    return new Promise(function (resolve) {
      let res = web3.eth.contract(abi).at(tokenAddress);
      resolve(res);
    });
  },
  getTokenBalance: function (tokenAddress, walletAddress) {
    let contract = null;
    let instance = this.instance;
    let t = this;

    return new Promise(function (resolve) {
      t.getTokenContact(tokenAddress).then((res) => {
        contract = res;
        if (walletAddress === null || walletAddress === "" || walletAddress === undefined) {
          walletAddress = localStorage.getItem('walletAddress');
        }
        let s = instance.eth.call({
          to: tokenAddress,
          data: contract.balanceOf.getData(walletAddress)
        });
        if (!isNaN(parseInt(s, 16))) {
          resolve(parseInt(s, 16) / Math.pow(10, 4))
        } else {
          resolve(0)
        }
      });
    });
  }
};
export default Web3Util;

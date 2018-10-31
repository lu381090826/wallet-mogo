import Web3 from "web3";
import abi from "./abi";
import Vue from "vue";
import {isEmpty} from "../globalFunc";

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(Vue.prototype.HOST + '/v3/d25de4d32b0f48a6bc289cfc7d50d7fd'));
// web3.setProvider(new web3.providers.HttpProvider(RINKEBYAPI));


let Web3Util = {
  instance: web3,
  async getBalance(walletAddress, contractAddress) {
    if (isEmpty(contractAddress)) {

      if (isEmpty(walletAddress)) {
        walletAddress = plus.storage.getItem('walletAddress');
      }

      let balance = 0;
      if (walletAddress) {
        balance = web3.eth.getBalance(walletAddress);
      }
      return await (Number(web3.fromWei(balance, 'ether')));

    } else {
      return await this.getContractBalance(walletAddress, contractAddress);
    }
  },
  async getContract(contractAddress) {
    if (isEmpty(contractAddress)) {
      return null;
    }
    return await web3.eth.contract(abi).at(contractAddress);
  },
  async getContractBalance(contractAddress, walletAddress) {
    let t = this;

    return await t.getContract(contractAddress).then(contract => {
      if (isEmpty(walletAddress)) {
        walletAddress = plus.storage.getItem('walletAddress');
      }
      let s = web3.eth.call({
        to: contractAddress,
        data: contract.balanceOf.getData(walletAddress)
      });
      if (!isNaN(parseInt(s, 16))) {
        return (parseInt(s, 16) / Math.pow(10, 4));
      } else {
        return (0);
      }
    });
  },
  async getGasPrice() {
    let gasPrice = web3.eth.gasPrice;
    return await web3.fromWei(gasPrice, 'gwei');
  },
  async getContractName(contractAddress) {
    let t = this;

    return await t.getContract(contractAddress).then(contract => {
      return web3.toAscii(web3.eth.call({
        to: contractAddress,
        data: contract.name.getData()
      }));
    });

  }
};
export default Web3Util;

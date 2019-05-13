import Web3 from "web3";
import abi from "./abi";
import Vue from "vue";
import {isEmpty, isNotEmpty} from "../globalFunc";

const abiDecoder = require('abi-decoder');
abiDecoder.addABI(abi);

let web3 = new Web3();
if (isNotEmpty(Vue.prototype.HOST)) {
  web3.setProvider(new web3.providers.HttpProvider(Vue.prototype.HOST + '/v3/d25de4d32b0f48a6bc289cfc7d50d7fd'));
} else {
  // web3.setProvider(new web3.providers.HttpProvider('https://rinkeby.infura.io/v3/d25de4d32b0f48a6bc289cfc7d50d7fd'));
  web3.setProvider(new web3.providers.HttpProvider('https://mainnet.infura.io/v3/d25de4d32b0f48a6bc289cfc7d50d7fd'));
}

const tgAddress = '0x95ff62d03D45e29b20E497D0fD526D8d2d387804';
const tgName = 'TG积分 (TG)';
const tgContract = web3.eth.contract(abi).at(tgAddress);

let Web3Util = {
  instance: web3,
  tgAddress: '0x95ff62d03D45e29b20E497D0fD526D8d2d387804',
  tgName: 'TG积分 (TG)',
  isContract(tokenAddress) {
    let code = web3.eth.getCode(tokenAddress);
    return code !== '0x';
  },
  abiDecoder() {
    return abiDecoder;
  },
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
    if (contractAddress === tgAddress) {
      return tgContract;
    }
    return await web3.eth.contract(abi).at(contractAddress);
  },
  async getContractBalance(contractAddress, walletAddress) {
    let t = this;

    return await t.getContract(contractAddress).then(contract => {
      if (isEmpty(walletAddress)) {
        walletAddress = plus.storage.getItem('walletAddress');
      }

      let s = contract.balanceOf(walletAddress);
      if (!isNaN(parseInt(s, 16))) {
        return (parseInt(s, 16) / Math.pow(10, Number(contract.decimals())));
      } else {
        return (0);
      }
    });
  },
  async getGasPrice() {
    let gasPrice = web3.eth.gasPrice;
    return await gasPrice;
  },
  async getContractName(contractAddress) {
    let t = this;
    return await t.getContract(contractAddress).then(contract => {
      return contract.name();
    });
  }
};
export default Web3Util;

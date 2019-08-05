import Web3 from "web3";
import abi from "./abi";
import Vue from "vue";
import {isEmpty, isNotEmpty} from "../globalFunc";

// let web3 = new Web3();
// if (isNotEmpty(Vue.prototype.HOST)) {
//   web3.setProvider(new web3.providers.HttpProvider(Vue.prototype.HOST + '/v3/d25de4d32b0f48a6bc289cfc7d50d7fd'));
// } else {
//   // web3.setProvider(new web3.providers.HttpProvider('https://rinkeby.infura.io/v3/d25de4d32b0f48a6bc289cfc7d50d7fd'));
//   web3.setProvider(new web3.providers.HttpProvider('https://mainnet.infura.io/v3/d25de4d32b0f48a6bc289cfc7d50d7fd'));
// }

let web3 = new Web3(Web3.givenProvider || 'wss://mainnet.infura.io/ws');

// web3.setProvider(new web3.providers.HttpProvider('https://mainnet.infura.io/v3/d25de4d32b0f48a6bc289cfc7d50d7fd'));

const tgAddress = '0x95ff62d03D45e29b20E497D0fD526D8d2d387804';
const tgContract = new web3.eth.Contract(abi, tgAddress);

let Web3Util = {
  instance: web3,
  tgAddress: '0x95ff62d03D45e29b20E497D0fD526D8d2d387804',
  tgName: 'TG积分 (TG)',
  isContract(tokenAddress) {
    let code = web3.eth.getCode(tokenAddress);
    return code !== '0x';
  },
  async getBalance(walletAddress, contractAddress) {
    if (isEmpty(contractAddress)) {
      if (isEmpty(walletAddress)) {
        walletAddress = plus.storage.getItem('walletAddress');
      }
      let balance = 0;
      if (walletAddress) {
        return await web3.eth.getBalance(walletAddress).then(balance => {
          return (Number(web3.utils.fromWei(balance, 'ether')));
        })
      } else {
        return balance;
      }

    } else {
      return this.getContractBalance(contractAddress, walletAddress);
    }
  },
  getContract(contractAddress) {
    if (isEmpty(contractAddress)) {
      return null;
    }
    if (contractAddress === tgAddress) {
      return tgContract;
    }
    return new web3.eth.Contract(abi, contractAddress);
  },
  async getContractBalance(contractAddress, walletAddress) {
    let t = this;
    let contract = t.getContract(contractAddress);
    return await contract.methods.balanceOf(walletAddress).call()
      .then(result => {
        let balance = parseInt(result._hex, 16);
        if (balance > 0) {
          return contract.methods.decimals().call().then(res => {
            return balance / Math.pow(10, Number(res));
          });
        } else {
          return 0;
        }
      });
  },
  async getGasPrice() {
    return await web3.eth.getGasPrice().then(res => {
      return res;
    });
  }
  ,
  async getContractName(contractAddress) {
    let t = this;
    return await t.getContract(contractAddress).methods.name().call().then(res => {
      return res;
    })
  }
};
export default Web3Util;

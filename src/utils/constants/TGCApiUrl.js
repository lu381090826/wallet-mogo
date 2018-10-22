//api地址
const TGCApiUrl = {
  WalletTokenList: "/walletToken/api/WalletTokenList",
  walletList: "/wallet/api/walletList",
  login: "/user/api/login",
  register: "/user/api/register",
  payOrder: "/donation/order/payOrder",
  addToken: "/walletToken/api/addToken",
  getLastVersion: "/common/api/getLastVersion",
  checkPassword: "/user/api/checkPassword",
  walletAdd: "/wallet/api/walletAdd",
  sendTransaction: "/wallet/api/sendTransaction",
  donationGetList: "/donation/order/getList",
  donationGetTotalAmount: "/donation/order/getTotalAmount",
  donationGetTotalNum: "/donation/order/getTotalNum",
  donationOne2oneList: '/donation/one2one/list',
  donationOne2oneGetInfo: '/donation/one2one/getInfo',
  donationCreateOrder: '/donation/order/createOrder',
  totalTGBalance: '/wallet/api/totalTgBalance',
  getProgitInfo: '/profit/api/getProgitInfo',
};

export default TGCApiUrl;

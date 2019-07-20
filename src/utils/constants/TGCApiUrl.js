//api地址
const TGCApiUrl = {
  homePage: "/common/api/homePage",
  walletTokenList: "/walletToken/api/WalletTokenList",
  walletList: "/wallet/api/walletList",
  createWallet: "/wallet/api/createWallet",
  goodsHot: "/shop/goods/getHot",
  goodsHome: "/shop/goods/home",
  goodsDetail: "/shop/goods/goodsDetail",
  shopOrderInfo: "/shop/order/getOrder",
  shopOrderCreate: "/shop/order/create",
  shopOrderGetOrderList: "/shop/order/getOrderList",
  shopOrderUpdate: "/shop/order/update",
  shopOrderCancel: "/shop/order/cancel",
  shopLinkmanList: "/shop/linkman/list",
  shopLinkmanAdd: "/shop/linkman/add",
  shopLinkmanUpdate: "/shop/linkman/update",
  shopOrderGet: "/shop/order/getOrder",
  login: "/user/api/login",
  loginSendCodeLoginMsg: "/user/api/sendCodeLoginMsg",
  loginVerifyLoginCodeMsg: "/user/api/verifyLoginCodeMsg",
  register: "/user/api/register",
  userGetMobile: "/user/api/getMobile",
  payOrder: "/donation/order/payOrder",
  addToken: "/walletToken/api/addToken",
  updateToken: "/walletToken/api/updateToken",
  getLastVersion: "/common/api/getLastVersion",
  checkPassword: "/user/api/checkPassword",
  checkMobile: "/user/api/checkMobileAvailable",
  changePassword: "/user/api/changePassword",
  checkLogin: "/user/api/checkLogin",
  walletAdd: "/wallet/api/walletAdd",
  walletDelete: "/wallet/api/walletDelete",
  alterWalletName: "/wallet/api/alterWalletName",
  sendTransaction: "/wallet/api/sendTransaction",
  exprotKey: "/wallet/api/exprotKey",
  donationGetList: "/donation/order/getList",
  donationGetTotalAmount: "/donation/order/getTotalAmount",
  donationGetTotalNum: "/donation/order/getTotalNum",
  donationOne2oneList: '/donation/one2one/list',
  donationOne2oneGetInfo: '/donation/one2one/getInfo',
  donationCreateOrder: '/donation/order/createOrder',
  totalTGBalance: '/wallet/api/totalTgBalance',
  getProgitInfo: '/profit/api/getProgitInfo',
  getShareUrl: "/common/api/getShareUrl",
  forestCollect: "/forset/api/collect",
  forestCollectInfo: "/forset/api/collectInfo",
  forestCollectList: "/forset/api/collectList",
  buyTgDollarRate: "/buyTg/api/getDollarRate",
  buyTgBeforeCheck: "/buyTg/api/beforeCheck",
  buyTgSubmitAudit: "/buyTg/api/submitAudit",
  verifyIdcardIsChecked: "/verify/api/idcardIsChecked",
  verifySendCodeMsg: "/verify/api/sendCodeMsg",
  verifyIdcard: "/verify/api/verifyIdcard",
  donationStepToTG: "/donation/step/stepToTG",
};

export default TGCApiUrl;

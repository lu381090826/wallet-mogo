const OrderState = {
  ALL: 0,
  ORDER_WATI_PAY: 100,
  ORDER_CANCEL: 110,
  ORDER_WATI_DELIVER: 150,
  ORDER_WATI_RECEIVE: 160,
  ORDER_FINISH: 200,
  OrderStateDesc: {
    "0": "全部",
    "100": "待付款",
    "110": "已取消",
    "150": "待发货",
    "160": "待收货",
    "200": "订单完成",
  },
};
export default OrderState;
